import { IArticleListType, IMessageDetails, IMessageListData } from '@/store/types/article'
import { request } from '@/utils/http'

export interface ArticleListParams {
  type?: number
  bind_key?: string
  lang?: string
  page?: number
  limit?: number
  show_joint_key?: string
}
export const articleListApi = (params: ArticleListParams) => {
  const show_joint_key = sessionStorage.getItem('show_joint_key')
  if (show_joint_key) {
    params.show_joint_key = show_joint_key
  } else {
    params.show_joint_key = ''
  }
  return request.post<IArticleListType[]>('/api/Article/List', params)
}
export interface UserMessageListParams {
  // 支持多个KEY搜索，多个用逗号,隔开
  // CoinBuyOrder -买单通知
  // CoinSellOrder -卖单通知
  // BuyerContact -买家联系
  // SellerContact -卖家联系
  // CoinTransferUser 转账收款消息
  bind_type?: string
  lang?: string
  page?: number
  limit?: number
  message_type?: number
  order_id?: string
  ordertype?: string
}
export const userMessageListApi = (params: UserMessageListParams) => {
  return request.post<IMessageListData>('/api/UserMessage/Last', params)
}
export interface UserMessageDetailsParams {
  lang?: string
  id?: number
  ids?: string
}
export const userMessageDetailsApi = (params: UserMessageDetailsParams) => {
  return request.post<IMessageDetails>('/api/UserMessage/Detail', params)
}

export interface UserMessageDelParams {
  ids: string
}
export const userMessageDelApi = (params: UserMessageDelParams) => {
  return request.post<[]>('/api/UserMessage/userMsgDel', params)
}
