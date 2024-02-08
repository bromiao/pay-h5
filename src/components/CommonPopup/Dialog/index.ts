import { type AppContext } from 'vue'
import DialogConstructor from './Dialog.vue'
import { createVM } from '../core'
import { type DialogOptions } from 'vant'

type IProps = {
  action?: () => void | Promise<void>
  cancelAction?: () => void | Promise<void>
}

export default function Dialog(props: IProps & DialogOptions, appContext?: AppContext | null) {
  let vm = createVM<IProps & DialogOptions>(DialogConstructor, props, appContext)
  vm!.exposed!.visible.value = true
}

Dialog.alert = function (props?: (IProps & DialogOptions) | undefined) {
  const defaultProps = {
    dialogType: 'alert'
  }
  const newProps = Object.assign(defaultProps, props)
  Dialog(newProps)
}

Dialog.confirm = function (props: IProps & DialogOptions) {
  const defaultProps = {
    dialogType: 'confirm'
  }
  const newProps = Object.assign(defaultProps, props)
  Dialog(newProps)
}
