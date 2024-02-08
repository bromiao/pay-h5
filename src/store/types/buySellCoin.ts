export interface getWithdrawddresslist {
  list: [withdrawddresslist]
}
export interface withdrawddresslist {
  username: string //‘用户名’,
  coin_addresstype: number //‘提现地址类型 2’,
  mtype: string //‘操作账户类型 1 系统账户 2、USDT账户 3.以太坊账户 4.比特币账户 ..’,
  coin_name: string // ‘货币名称 SYS 、USDT 、ETH 、 BTC ..’,
  coin_protocol: string // ‘货币协议 BANK ALIPAY WXPAY USDT_TRC20 USDT_ERC20 ETH BCT…’,
  coin_address: string //‘货币地址 / 提现卡号 /支付宝-账号 微信账号’,
  remark: string // ‘备注’,
  status: number // COMMENT ‘1启用 2禁用 -1审核中(备用)’,
  account_bank_realname: string // ‘银行卡姓名/支付宝 /微信 - 姓名 (USDT_TRC20 …)’,
  account_bankname: string // ‘银行名称/支付宝 /微信 (数字货币 USDT)’,
  account_bankcode: string // ‘银行编码/ALIPAY / WXPAY (USDT_TRC20 …)’,
  code_imgurl: string // ‘图片URL’,
  id: number // 地址ID
  def_card: number // 是否是默认卡
}
interface Iwallets {
  total_num: number
  available_num: number
  remaining_num: number
  trans_num: number
  trans: {
    sell: number
    buy: number
  }
}
export interface SellOrder {
  sell_order_id: string
  buy_order_id: string
  mtype: number
  sell_num: number
  addtime: string
  status: number
}
export interface BuyOrder {
  buy_order_id: string
  sell_order_id: string
  mtype: number
  buy_num: string
  addtime: string
  status: number
}

export interface resBuyOrderDetail {
  sell_mtype: number
  count: number
  list: Array<any>
  buy_orders: [
    {
      order_id: string
    }
  ]
  maping_buy_info: {
    order_id: string
    status: number
  } //撮合中订单
  buy_img: string //付款图
  buy_order: string //买币订单ID
  sell_num: string //买币订单ID
  is_split: number //是否拆分
  remaining_num: string //买币订单ID
  headimg: string //买币订单ID
  nickname: string //买币订单ID
  order_id: string //买币订单ID
  mtype: number //兑换发起类型
  ////1//系统账户
  ////2、USDT账户
  ////3.以太坊账户
  ////4.比特币账户//..
  coin_protocol: string //支持的收款卡协议//BANK//ALIPAY//WXPAY//USDT
  buy_num: number //购买数量
  coin_fee: number //购买手续费
  addtime: number //建立时间
  complete_time: number //完成时间
  status: number //订单状态//:1//等待卖家确认//2//卖家拒绝//3//付款中//4//付款超时//5//取消买入//6//已付待收//7//挂起待确认//8//交易完成//9//强制失败//10//强制成功
  pay_cardid: string //付款卡号
  pay_realname: string //付款姓名
  pay_bankname: string //付款银行
  pay_bankcode: string //付款类型
  seller_star: number //卖方评分
  buyer_star: number //买方评分
  reminder_seconds: number //催单剩馀秒数,null时可以请求催单
  time_second: number //倒数时间，负数为超时
  gift_mtype: number //奖励币别//(2022.11.01新增)
  sell_gift: number //搬砖奖励//(2022.11.01新增)
  sell_info: sell_info //卖币资讯
  uuid: string //卖币资讯
}

export interface sell_info {
  order_id: string //卖方订单号
  sell_num: string //卖方数量
  remaining_num: string //卖方剩余数量
  is_split: number //是否拆分//1,是//2否
  uuid: string //卖方UUID
  headimg: string //卖方头像
  nickname: string //卖方昵称
  collection_cardid: string //收款时候账号
  collection_realname: string //收款卡真实姓名
  collection_bankname: string //收款卡银行名称/支付宝/微信
  collection_bankcode: string //收款卡银行编码
  collection_cardimg: string //收款卡二维码图片
  gift_mtype: number //奖励币别//(2022.11.01新增)
  sell_gift: number //预计奖励//(2022.11.01新增)
  get_sell_gift: number //已获奖励//(2022.11.01新增)
}
export interface IBuySellCoin {
  wallets: Record<string, Iwallets>
  sell_orders: SellOrder[]
  buy_orders: BuyOrder[]
}

interface ISellInfo {
  order_id: string
  sell_num: string
  remaining_num: string
  is_split: number
  uuid: string
  headimg: string
  nickname: string
  collection_cardid: string
  collection_realname: string
  collection_bankname: string
  collection_bankcode: string
  collection_cardimg: string
}
export interface IBuyOrder {
  order_id: string
  status: number
  mtype: number
  buy_num: string
  addtime: string
  headimg: string
  nickname: string
  time_second: number
  sell_info: ISellInfo
}
export interface IBuyOrderData {
  count: number
  list: IBuyOrder[]
}

interface SellOrderInfo {
  id: number
  uuid: string
  order_id: string
  mtype: number
  sell_mtype: number
  coin_protocol: string
  buy_num: string
  coin_fee: string
  status: number
  addtime: string
  complete_time: string | null
  seller_check_buy_status_time: string | null
  buyer_update_trans_time: string | null
  headimg: string | null
  nickname: string | null
  time_second: string | null
}
export interface ISellOrder {
  order_id: string
  coin_protocol: string
  status: number
  mtype: number
  gift_mtype?: number
  get_sell_gift: string
  sell_num: string
  remaining_num: string
  is_split: number
  addtime: string
  headimg: string
  nickname: string
  time_second: string | null
  buy_orders: SellOrderInfo[]
}
export interface ISellOrderData {
  count: number
  list: ISellOrder[]
}
