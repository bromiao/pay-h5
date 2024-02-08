export enum EBuyOrderStatus {
  WaitSellerConfirmation = '1',
  SellerRejected = '2',
  PaymentProcessing = '3',
  PaymentTimeout = '4',
  CancelledByBuyer = '5',
  PaidAwaitingReceipt = '6',
  SuspendedAwaitingConfirmation = '7',
  TransactionCompleted = '8',
  ForcedFailure = '9',
  ForcedSuccess = '10'
}
export type IValueBuyOrderStatus = `${EBuyOrderStatus}`
export type IKeyBuyOrderStatus = keyof typeof EBuyOrderStatus
export const getEBuyOrderStatusText = (status: IValueBuyOrderStatus) => {
  switch (status) {
    case EBuyOrderStatus.WaitSellerConfirmation:
      return '等待卖家确认'
    case EBuyOrderStatus.SellerRejected:
      return '卖家拒绝'
    case EBuyOrderStatus.PaymentProcessing:
      return '付款中'
    case EBuyOrderStatus.PaymentTimeout:
      return '付款超时'
    case EBuyOrderStatus.CancelledByBuyer:
      return '取消买入'
    case EBuyOrderStatus.PaidAwaitingReceipt:
      return '已付待收'
    case EBuyOrderStatus.SuspendedAwaitingConfirmation:
      return '挂起待确认'
    case EBuyOrderStatus.TransactionCompleted:
      return '交易完成'
    case EBuyOrderStatus.ForcedFailure:
      return '强制失败'
    case EBuyOrderStatus.ForcedSuccess:
      return '强制成功'
    default:
      return ''
  }
}

export type IBuyOrderStatusMap = {
  1: '等待卖家确认'
  2: '卖家拒绝'
  3: '付款中'
  4: '付款超时'
  5: '取消买入'
  6: '已付待收'
  7: '挂起待确认'
  8: '交易完成'
  9: '强制失败'
  10: '强制成功'
}
export const BuyOrderStatusMap = {
  1: '等待卖家确认',
  2: '卖家拒绝',
  3: '付款中',
  4: '付款超时',
  5: '取消买入',
  6: '已付待收',
  7: '挂起待确认',
  8: '交易完成',
  9: '强制失败',
  10: '强制成功'
}
export type ISellOrderStatusMap = {
  1: '挂单中'
  2: '确认交易中'
  3: '等待买家付款'
  4: '确认收款中'
  5: '挂起待确认'
  6: '全部完成'
  7: '取消卖出'
  8: '部分完成'
}
export const SellOrderStatusMap = {
  1: '挂单中',
  2: '确认交易中',
  3: '等待买家付款',
  4: '确认收款中',
  5: '挂起待确认',
  6: '全部完成',
  7: '取消卖出',
  8: '部分完成'
}
