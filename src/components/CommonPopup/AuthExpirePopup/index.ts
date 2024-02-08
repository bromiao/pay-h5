import { AppContext, ComponentInternalInstance } from 'vue'
import AuthExpireConstruct from './AuthExpirePopup.vue'
import { createVM } from '../core'
import mitt from '@/utils/mitt'

type ProfileCompletionPopupProps = {
  action: () => void
  msgtext?: string
}

let vm: ComponentInternalInstance | null = null
export function AuthExpirePopup(
  props: ProfileCompletionPopupProps,
  appContext?: AppContext | null
) {
  if (!vm) {
    vm = createVM<ProfileCompletionPopupProps>(AuthExpireConstruct, props, appContext)
  }
  vm!.exposed!.visible.value = true
  // 全局通知，便于其他后续逻辑控制
  mitt.emit('global-notification', { type: 'AuthExpire', value: true })
}
