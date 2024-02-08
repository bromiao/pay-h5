import { useAuthStore } from '@/store'
import { useCoinBuySellStore } from '@/store/modules/coinBuySell'
import { useProfileCompletionPopup } from '@/components/CommonPopup/ProfileCompletionPopup'

export async function CompletionIdCardMiddleware(): Promise<boolean> {
  const profileCompletionPopup = useProfileCompletionPopup()
  const authStore = useAuthStore()
  if (authStore?.userInfo?.verified_status !== 1) {
    profileCompletionPopup.idcard()
    return false
  }
  return true
}

export async function CompletionPaymentMiddleware(): Promise<boolean> {
  const profileCompletionPopup = useProfileCompletionPopup()
  const coinBuySellStore = useCoinBuySellStore()
  await coinBuySellStore.getWithdrawddresslist({})
  if (!coinBuySellStore?.withdrawddresslist?.length) {
    profileCompletionPopup.payment()
    return false
  }
  return true
}

export async function CompletionPaymentPasswordMiddleware(): Promise<boolean> {
  const profileCompletionPopup = useProfileCompletionPopup()
  const authStore = useAuthStore()
  if (authStore.userInfo.is_set_paypassword === 2) {
    profileCompletionPopup.paymentPassword()
    return false
  }
  return true
}

export async function buy_sell_v(): Promise<boolean> {
  const profileCompletionPopup = useProfileCompletionPopup()
  const authStore = useAuthStore()
  if (authStore?.userInfo?.verified_status !== 1) {
    profileCompletionPopup.idcard()
    return false
  }
  if (authStore.userInfo.is_set_paypassword === 2) {
    profileCompletionPopup.paymentPassword()
    return false
  }
  const coinBuySellStore = useCoinBuySellStore()
  await coinBuySellStore.getWithdrawddresslist({})
  if (!coinBuySellStore?.withdrawddresslist?.length) {
    profileCompletionPopup.payment()
    return false
  }
  return true
}
