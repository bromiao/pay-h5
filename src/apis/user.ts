import { ILoginType } from '@/store/types/auth'
import {
  IAllMTypeList,
  ICoin,
  IMoneyDetailsData,
  IMoneyWithdraw,
  IUserScore,
  IWalletAddress
} from '@/store/types/coin'
import { request } from '@/utils/http'

// 用户个人资料信息接口
export type Res = ILoginType
export const getUserInfoApi = () => {
  return request.post<Res>('/api/UserCenter/getInfo', {
    responseType: 'arraybuffer',
    options: {}
  })
}
// app直接跳转进入特定页面时使用该方法传入token获取用户信息
export const getUserInfoApi2 = (token: string) => {
  return request.post<Res>('/api/UserCenter/getInfo', { token })
}

export interface getUserCoinsParams {
  mtype?: number
}
export const getUserCoinApi = (params: getUserCoinsParams) => {
  return request.post<ICoin[]>('/api/UserCenter/userCoins', params, {
    options: {
      // auth: true,
      // showLoading: true
    }
  })
}
export interface GiftInfo {
  mtype?: number
}
export interface resGiftInfo {
  sell_num: Number //int	搬砖金额
  selled_num: Number //	int	完成金额
  pre_sell_gift: Number //int	预计奖励
  get_sell_gift: Number //	int	已获奖励
  status: string //:Number//	搬砖中,未开始搬砖
}
// http://gdpaytest888.ahxkscl.com/api/Coin/GiftInfo
export const GiftInfo = (params: GiftInfo) => {
  return request.post<resGiftInfo>('/api/Coin/GiftInfo', params)
}
export interface getUserWalletAddressParams {
  mtype: number
  coin_name: string
  coin_protocol: string
  coin_wallet_api: string
  create?: number
}
export const userWalletAddressApi = (params: getUserWalletAddressParams) => {
  return request.post<IWalletAddress[]>('/api/Wallet/checkAddress', params)
}

export interface updateUserInfoParams {
  headimg?: string
  email?: string
  nickname?: string
  phone?: string
  set_lang?: string
  telegram_app?: string
  whats_app?: string
  line_app?: string
  zalo_app?: string
}
export const updateUserInfoApi = (params: updateUserInfoParams) => {
  return request.post<ICoin[]>('/api/Usercenter/userUpdate', params)
}

export interface userMoneyDetailsParams {
  // 单条查询时 需传id
  id?: number
  time?: string
  mtype?: string
  trade_type?: string
  remoney_type?: string
  page?: number
  pagesize?: number
}

export const getMoneyDetailsApi = (params: userMoneyDetailsParams) => {
  return request.post<IMoneyDetailsData>('/api/Usercenter/getMoneyDetails', params)
}

export interface setPayPassParams {
  newpasswd: string
  newpasswdck: string
  google_verify_code?: string
}

export const userPayPassAddApi = (params: setPayPassParams) => {
  return request.post<any>('/api/Userpaypass/PaypassAdd', params)
}

export interface updatePayPassParams {
  oldpasswd: string
  newpasswd: string
  newpasswdck: string
  mobile?: string
  code?: string
  google_verify_code?: string
}

export const userPayPassUpdateApi = (params: updatePayPassParams) => {
  return request.post<any>('/api/Userpaypass/PayPasswdUpdate', params)
}

export interface updateLoginPassParams {
  oldpasswd: string
  newpasswd: string
  newpasswdck: string
  google_verify_code?: string
}

export const userLoginPassUpdateApi = (params: updateLoginPassParams) => {
  return request.post<any>('/api/Usercenter/upPasswd', params)
}

export interface resetPayPassParams {
  newpasswd: string
  newpasswdck: string
  img: string
  mobile?: string
  code?: string
}

export const userPayPassResetApi = (params: resetPayPassParams) => {
  return request.post<any>('/api/Userpaypass/PayPasswdReset', params)
}

export interface bankListParams {
  country_code?: string
}

export const bankListApi = (params: bankListParams) => {
  return request.post<any>('/api/user/Systembankcode', params)
}

export interface addAddressParams {
  passwd: string // 資金交易密碼
  mtype: string
  coin_name: string
  coin_protocol: string
  coin_address: string
  account_bank_realname: string
  account_bankname: string
  account_bankcode: string
  code_imgurl: string
  google_verify_code?: string
  force?: number
}
export const addWithdrawAddressApi = (params: addAddressParams) => {
  return request.post<any>('/api/Usercenter/withdrawddressAdd', params)
}

export interface setDefaultAddressParams {
  id: number
}
export const setDefaultWithdrawAddressApi = (params: setDefaultAddressParams) => {
  return request.post<any>('/api/Usercenter/withdrawddressDefault', params)
}

export interface deleteAddressParams {
  passwd: string // 資金交易密碼
  id: string
}

export const deleteWithdrawAddressApi = (params: deleteAddressParams) => {
  return request.post<any>('/api/Usercenter/withdrawddressdelete', params)
}

export interface userVerifiedParams {
  name: string
  idcard_id: string
  idcardimg?: string
  force?: number
  faceimg?: string
}
export const userVerifiedApi = (params: userVerifiedParams) => {
  return request.post<any>('/api/Usercenter/userVerified', params, {
    options: {
      // auth: true,
      showLoading: true
    }
  })
}
export interface IAllMTypeParams {
  money_type?: string
  parent_trade_type?: string
  is_realmoney?: string
  remoney_type?: string
}
export const getAllMTypeApi = (params: IAllMTypeParams) => {
  return request.post<IAllMTypeList[]>('/api/Systeminfo/moneyType', params)
}
export const getUserScoreApi = () => {
  return request.post<IUserScore>('/api/Usercenter/userscore')
}
export interface IMoneyWithdrawParams {
  money: string
  id: string | number
  coin_address: string
  passwd: string
  google_verify_code?: string
}
export const getMoneyWithdrawApi = (params: IMoneyWithdrawParams) => {
  return request.post<IMoneyWithdraw | []>('/api/Withdraw/MoneyWithdraw', params)
}
export interface IMoneyExchargeParams {
  num: number | string
  mtype: number | string
  coin_name: string
  to_mtype: number | string
  to_coin_name: string
}
export const getMoneyExchargeApi = (params: IMoneyExchargeParams) => {
  return request.post<any>('/api/Exchange/MoneyExcharge', params)
}

export interface sendCodeToEmailParams {
  email: string
  type: number
  uuid: string
}

export const sendCodeToEmailAPI = (params: sendCodeToEmailParams) => {
  return request.post<any>('/api/Emailsend/doSend', params)
}

export interface bindEmailParams {
  email: string
  emailcode: string
  pass: string
}

export const bindEmailAPI = (params: bindEmailParams) => {
  return request.post<any>('/api/Emailsend/emailBind', params)
}

export interface updateEmailParams {
  newemail: string
  newemailcode: string
  email: string
  pass: string
}
export interface emailSwitch {
  email: string //email
  emailcode?: string //邮箱验证码[发送type=6]
  pass: string //支付密码
  type: number //	开关类型： 1安全验证开关2买卖币交易通知邮件开关
  status: number //开关 1打开 2关 [关时上面参数全部需要，打开时只要token]
}

export const updateEmailAPI = (params: updateEmailParams) => {
  return request.post<any>('/api/Emailsend/emailUpdate', params)
}
export const emailSwitch = (params: emailSwitch) => {
  return request.post<any>('/api/Emailsend/emailSwitch', params)
}
