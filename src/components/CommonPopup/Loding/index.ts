import { ComponentInternalInstance, type AppContext } from 'vue'
import LoadingConstructor from './Loding.vue'
import { createVM } from '../core'
import { type DialogOptions } from 'vant'

type IProps = {
  action?: () => void | Promise<void>
  cancelAction?: () => void | Promise<void>
}

export default function Loading(props: IProps & DialogOptions, appContext?: AppContext | null) {
  let vm = createVM<IProps & DialogOptions>(LoadingConstructor, props, appContext)
  // vm!.exposed!.visible.value = true
  setTimeout(() => {
    vm!.exposed!.visible.value = false
  }, 800)
  return vm
}

let NewDialog: ComponentInternalInstance | null = null
Loading.show = function (props?: (IProps & DialogOptions) | undefined) {
  const defaultProps = {}
  const newProps = Object.assign(defaultProps, props)
  NewDialog = Loading(newProps)
  return NewDialog
}
Loading.hide = function (props?: (IProps & DialogOptions) | undefined) {
  setTimeout(() => {
    if (NewDialog && NewDialog.exposed) {
      NewDialog.exposed.visible.value = false
      NewDialog.exposed = null
    }
  }, 300)
}
