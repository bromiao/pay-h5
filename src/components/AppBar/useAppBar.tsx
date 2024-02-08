import { darkIconRouteList } from '@/utils/tools'
import { CSSProperties, InjectionKey, Ref, inject, onMounted, onUnmounted, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from './AppBar.vue'

export type modeType = 'light' | 'dark'

const defaultMode = ref<modeType>('light')

const defaultStyle = {}
const defaultRefreshHandler = () => window.location.reload()
const defaultCloseHandler = () => window.close()

const modeKey = Symbol('mode') as InjectionKey<{
  mode: Ref<modeType>
  setMode: (mode: modeType) => void
}>
const styleKey = Symbol('style') as InjectionKey<{
  style: Ref<CSSProperties>
  setStyle: (style: CSSProperties) => void
}>
const refreshHandlerKey = Symbol('refresh') as InjectionKey<{
  onRefresh: Ref<() => void>
  setRefreshHandler: (handler: () => void) => void
}>
const closeHandlerKey = Symbol('close') as InjectionKey<{
  onClose: Ref<() => void>
  setCloseHandler: (handler: () => void) => void
}>

/**
 * @name: enableAppBar
 * @description 开启AppBar功能
 */
export function enableAppBar(_mode: modeType) {
  const route = useRoute()
  const mode = ref<modeType>(_mode)
  const setMode = (_mode: modeType) => {
    mode.value = _mode
  }

  const style = ref<CSSProperties>({})
  const setStyle = (_style: CSSProperties) => {
    style.value = _style
  }

  const onRefresh = ref(defaultRefreshHandler)
  const setRefreshHandler = (handler: () => void) => {
    onRefresh.value = handler
  }
  const onClose = ref(defaultCloseHandler)
  const setCloseHandler = (handler: () => void) => {
    onClose.value = handler
  }

  provide(modeKey, { mode, setMode })
  provide(styleKey, { style, setStyle })
  provide(refreshHandlerKey, { onRefresh, setRefreshHandler })
  provide(closeHandlerKey, { onClose, setCloseHandler })
  return AppBar
}

export function useAppBarProvide() {
  const { mode } = inject(modeKey) as {
    mode: Ref<modeType>
    setMode: (mode: modeType) => void
  }
  const { style } = inject(styleKey) as {
    style: Ref<CSSProperties>
    setStyle: (style: CSSProperties) => void
  }
  const { onRefresh } = inject(refreshHandlerKey) as {
    onRefresh: Ref<() => void>
    setRefreshHandler: (handler: () => void) => void
  }
  const { onClose } = inject(closeHandlerKey) as {
    onClose: Ref<() => void>
    setCloseHandler: (handler: () => void) => void
  }

  return {
    mode,
    style,
    onRefresh,
    onClose
  }
}

/**
 * @name: useAppBar
 * @description: 组件内部调用，用于设置AppBar样式，以及绑定刷新和关闭事件
 * @param props {CSSProperties & {onRefresh?: () => void, onClose?: () => void}}
 */
export function useAppBar(
  props?: CSSProperties & {
    mode?: modeType
    onRefresh?: () => void
    onClose?: () => void
  }
) {
  const { setMode } = inject(modeKey) as {
    mode: Ref<modeType>
    setMode: (mode: modeType) => void
  }
  const { setStyle } = inject(styleKey) as {
    style: Ref<CSSProperties>
    setStyle: (style: CSSProperties) => void
  }
  const { setRefreshHandler } = inject(refreshHandlerKey) as {
    onRefresh: Ref<() => void>
    setRefreshHandler: (handler: () => void) => void
  }
  const { setCloseHandler } = inject(closeHandlerKey) as {
    onClose: Ref<() => void>
    setCloseHandler: (handler: () => void) => void
  }

  const route = useRoute()

  if (darkIconRouteList.includes(route.name as string)) {
    defaultMode.value = 'dark'
  } else {
    defaultMode.value = 'light'
  }

  onMounted(() => {
    if (props) {
      const { mode, onRefresh, onClose, ...style } = props
      setStyle(style as CSSProperties)
      setTimeout(() => {
        mode && setMode(mode)
      }, 100)
      onRefresh && setRefreshHandler(onRefresh)
      onClose && setCloseHandler(onClose)
    }
  })

  onUnmounted(() => {
    const mode = darkIconRouteList.includes(route.name as string) ? defaultMode.value : 'light'
    setMode(mode)
    setStyle(defaultStyle)
    setCloseHandler(defaultCloseHandler)
    setRefreshHandler(defaultRefreshHandler)
  })
}
