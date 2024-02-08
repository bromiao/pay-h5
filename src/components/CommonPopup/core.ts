import {
  AppContext,
  ComponentInternalInstance,
  createVNode,
  render,
  VNodeProps,
  VNodeTypes
} from 'vue'

export interface IPopup {
  onVanish?: () => void
}

export function createVM<T>(
  component: VNodeTypes,
  props: T & IPopup & VNodeProps,
  appContext?: AppContext | null
): ComponentInternalInstance | null {
  const container = document.createDocumentFragment()
  props.onVanish = () => {
    render(null, container as unknown as HTMLDivElement)
  }
  const vnode = createVNode(component, props as VNodeProps)
  if (appContext) {
    vnode.appContext = appContext
  }
  render(vnode, container as unknown as HTMLDivElement)
  document.body.appendChild(container)
  return vnode.component
}
