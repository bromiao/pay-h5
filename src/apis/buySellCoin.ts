import {
  IBuyOrderData,
  IBuySellCoin,
  ISellOrderData,
  resBuyOrderDetail
} from '@/store/types/buySellCoin'
import { IHttpOptions, request } from '@/utils/http'

export interface BuyQuickly {
  // token: string //token值
  num: number //购买数量
  coin_protocol: string //付款卡（买家绑定过的卡）协议 单选BANKALIPAYWXPAY
  withdrawddress_id?: string // 指定收款卡信息ID
}

export const BuyQuickly = (params: BuyQuickly, options: IHttpOptions = {}) => {
  return request.post<{ order_id: string }>('/api/Coin/BuyQuickly', params, {
    options: {
      auth: true,
      showLoading: true,
      ...options
    }
  })
}
export interface qcodedeposit {
  // token: string //token值
  sysorderid?: any //平台订单号 [用户支付订单
  rcvuuid?: any //接收方的UUID
  money: any // 金额或数量
  mtype: any //钱类类型
  passwd: any //交易密码
  google_verify_code?: any //谷歌验证码[用户开启谷歌验时]
  trasfer_info?: any //用户转账时的备注
}

export const qcodedeposit = (params: qcodedeposit) => {
  return request.post<{
    to_nickname: any
  }>('/api/Usercenter/qcodedeposit', params, {
    options: {
      // auth: true,
      showLoading: true
    }
  })
}
export interface Buy {
  // token: string //token值
  sell_order_id: string //购买数量
  num: number //购买数量
  coin_protocol: string //付款卡（买家绑定过的卡）协议 单选BANKALIPAYWXPAY
  withdrawddress_id?: string // 指定收款卡信息ID
  operation_verification?: string //在线支付标识副
  merchantorderid?: string //在线支付标识副
}

export const Buy = (params: Buy) => {
  return request.post<{ order_id: string }>('/api/Coin/Buy', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface Appeal {
  buy_order_id: string //	是	string	订单号
  comment: string //	是	string	申诉内容
  img: any[] //	是	array	图片
}
export const Appeal = (params: Appeal) => {
  return request.post<{ order_id: string }>('/api/Coin/Appeal', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface coinsellcommentadd {
  // buy_order_id: string //	是	string	订单号
  // comment: string //	是	string	申诉内容
  // img: any[] //	是	array	图片

  orderid: string //	是	string	订单号
  ctype: string //是	string	评论类
  // 1申诉 2评论
  msg: string //	是	string	文字内容
  img?: string | Array<any> //	是	string	图片网址 可为空
}
export const coinsellcommentadd = (params: coinsellcommentadd) => {
  return request.post<{ order_id: string }>('/api/usercenter/coinsellcommentadd', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface coinsellcommentlist {
  orderid: string //	是	string	订单号
  ctype: string //	是	 1申诉 2评论
}
export const coinsellcommentlist = (params: coinsellcommentlist) => {
  return request.post<{ order_id: string }>('/api/usercenter/coinsellcommentlist', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}

export interface uploadimgBat {
  // file: string //[]	是	string	图片数组名
  wapimgs: any //[]	是	string	图片数组名
  type: string //	是	string	类型 face[头像],realname[实名认证],qrcode[收付款二维码]，comment[评论],community[社区],message[留言],appeal[申诉],editreview[资料审核]
}
export const uploadimgBat = (params: uploadimgBat) => {
  return request.post<IBuySellCoin>('api/user/uploadimgBat', params, {
    options: {
      auth: true,
      showLoading: true
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export interface buySellCoinInfoParams {
  // token: string
  mtype?: number
}
export const buySellCoinInfoApi = (params: buySellCoinInfoParams) => {
  return request.post<IBuySellCoin>('/api/Coin/Info', params, {
    options: {
      // auth: true,
      // showLoading: true
    }
  })
}
export interface Sell {
  mtype: number
  // mtype	是	string	兑换发起类型
  // 1 系统账户
  // 2、USDT账户
  // 3.以太坊账户
  // 4.比特币账户 ..
  coin_protocol: string //付款卡协议 多选用逗号隔开
  // BANK
  // ALIPAY
  // WXPAY
  num: number //数量
  is_split: number //int	是否拆分 1,是 2否
  passwd: string
}
interface resSell {
  order_id: string
}
export const Sell = (params: any) => {
  return request.post<any>('/api/Coin/Sell', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}

export interface BuyOrderDetail {
  order_id: string
}
export const BuyOrderDetail = (params: BuyOrderDetail) => {
  return request.post<resBuyOrderDetail>('/api/Coin/BuyOrderDetail', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}
export interface SellOrderDetail {
  order_id: string
}
export const SellOrderDetail = (params: SellOrderDetail) => {
  return request.post<resBuyOrderDetail>('/api/Coin/SellOrderDetail', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface SellerCheckBuyStatus {
  buy_order_id: string
  status: number
}
export const SellerCheckBuyStatus = (params: SellerCheckBuyStatus) => {
  return request.post<resBuyOrderDetail>('/api/Coin/SellerCheckBuyStatus', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}

export interface SellOrders {
  page?: number //	否	int	当前页码 默认1
  pagesize?: number //	否	int	每页数据量 默认20
  coin_protocol?: string //否	string	支付方式 BANK ALIPAY WXPAY USDT 支持多选,请用逗点隔开
  is_split?: number //否	int	售卖方式 1可拆分 2不可拆分
  amount?: any //	否	int	金额 ex:指定金额100, 范围查询100-1000
}
export const SellOrders = (params: SellOrders) => {
  return request.post<resBuyOrderDetail>('/api/Coin/SellOrders', params, {
    options: {
      // auth: true,showLoading: true,
    }
  })
}

export interface BuyCancel {
  buy_order_id: string
}
export const BuyCancel = (params: BuyCancel) => {
  return request.post<resBuyOrderDetail>('/api/Coin/BuyCancel', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface sell_order_id {
  sell_order_id: string
}
export const SellCancel = (params: sell_order_id) => {
  return request.post<resBuyOrderDetail>('/api/Coin/SellCancel', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface sellerCheckTransStatus {
  buy_order_id: string
  passwd: string
}
export const sellerCheckTransStatus = (params: sellerCheckTransStatus) => {
  return request.post<resBuyOrderDetail>('/api/Coin/sellerCheckTransStatus', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface BuyerUpdateTransInfo {
  buy_order_id: string
  buy_img?: string
  pay_realname?: string
  pay_cardid?: any
  pay_bankname?: string
}
export const BuyerUpdateTransInfo = (params: BuyerUpdateTransInfo) => {
  return request.post<resBuyOrderDetail>('/api/Coin/BuyerUpdateTransInfo', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}

export interface SetStar {
  buy_order_id: string
  star: number
}
export const SetStar = (params: SetStar) => {
  return request.post<resBuyOrderDetail>('/api/Coin/SetStar', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface Reminders {
  buy_order_id: string
}
export const Reminders = (params: Reminders) => {
  return request.post<resBuyOrderDetail>('/api/Coin/Reminders', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}

export interface buyOrdersParams {
  status?: string // 1 等待卖家确认 2 卖家拒绝 3 付款中 4 付款超时 5 取消买入 6 已付待收 7 挂起待确认 8 交易完成 9 强制失败 10 强制成功
  page?: number // 当前页码 默认1
  pagesize?: number // 每页数据量 默认20
  date_start?: string
  date_end?: string
  frontend_status?: string // H5显示状态 1、挂单中，2、待确认，3、待收款，4、待放行，5、已完成，6、已挂起，7、已取消
}
export const myBuyOrdersApi = (params: buyOrdersParams) => {
  return request.post<IBuyOrderData>('/api/Coin/MyBuyOrders', params, {
    options: {
      auth: true
      // showLoading: true
    }
  })
}
export interface sellOrdersParams {
  status?: string // 卖币订单状态 :1 挂单中 2 确认交易中 3 等待买家付款 4 确认收款中 5 挂起待确认 6 全部完成 7 取消卖出 8部分完成（已取消但部分完成）
  page?: number
  pagesize?: number
  mtype?: number
  date_start?: string
  date_end?: string
  frontend_status?: string // H5显示状态 1、挂单中，2、待确认，3、待收款，4、待放行，5、已完成，6、已挂起，7、已取消
}
export const mySellOrdersApi = (params: sellOrdersParams) => {
  return request.post<ISellOrderData>('/api/Coin/MySellOrders', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
export interface withdrawddressDefault {
  id: number //
}
export const withdrawddressDefault = (params: withdrawddressDefault) => {
  return request.post<ISellOrderData>('/api/Usercenter/withdrawddressDefault', params, {
    options: {
      auth: true,
      showLoading: true
    }
  })
}
