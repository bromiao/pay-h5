export interface ICoinAPIConfig {
  deposit_type: {
    n: string
    coin_rechargeaddress: []
    money_rechargecard: []
    third_payment: []
  }
  withdraw_type: {
    n: string
    withdraw_protocol: []
  }
  other_type: {
    n: string
    button_type: []
  }
}
export interface ICoinsetConfig {
  id: number
  mtype: number
  coin_name: string
  coin_unit: string
  wallet_type: string
  status: number
  coin_callname: string
  is_withdraw: number
  is_deposit: number
  min_withdraw: string
  max_withdraw: string
  auto_withdraw: string
  fee_withdraw: string
  fee_withdraw_mod: number
  coin_apiconfig: ICoinAPIConfig
  order: number
  remark: string
  symbol: string
  swapto_fee: string
  min_swapto: string
  coin_countrycode: string
  is_walletshow: number
  is_swapto: number
  coin_price: string
  top_price: string
  coin_rate: string
}
export interface ICoin {
  mtype: number
  coin_name: string
  coin_unit: string
  coincash: string
  available_coincash: string
  status: number
  wallet_type: string
  service_fee: string
  coinset_config?: ICoinsetConfig
}
export interface IWalletAddress {
  id: number
  uuid: string
  username: string
  coin_addresstype: number
  mtype: number
  coin_name: string
  coin_protocol: string
  coin_address: string
  coin_apicode: string
  coin_api_merchant: string
  remark: string
  status: number
  coin_api_id: number
}

export interface IMoneyDetailsItem {
  id: number
  uuid: string
  username: string
  trade_id: string
  money: string
  mtype: number
  coin_name: string
  trade_type: number
  remoney_type: number
  money_cash: string
  trade_desc: string
  reason: string
  out_order_id: string
  status: number
  createtime: string
  water_rate: string
  trade_type_name: string
  remoney_type_name: string
  money_type: number
  coin_unit: string
  coin_callname: string
  coin_symbol: string
  coin_price: string
}

export interface IMoneyDetailsSumCount {
  mtype: number
  coin_name: string
  trade_type: number
  summoney: string
  coin_unit: string
  coin_callname: string
  coin_symbol: string
  coin_price: string
  trade_name: string
}

export interface IMoneyDetailsData {
  count: number
  data: IMoneyDetailsItem[]
  // 分类统计求和 [只有传了mtype和trade_type时才有，否则为空数组]
  sumcount: IMoneyDetailsSumCount[]
}

export interface IAllMTypeList {
  id: number
  trade_name: string
  trade_type: number
  money_type: number
  parent_trade_type: number
  trade_reason: string | null
  is_realmoney: number
  remoney_type: number
  status: number
  is_show: number
  up_time: string | null
  extjson: string | null
}

export interface IUserScore {
  score: number
  scorelevel: number
}

export interface IMoneyWithdraw {
  orderID: string
  orderDetailsID: string
}
