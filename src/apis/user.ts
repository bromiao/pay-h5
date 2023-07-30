import { request } from '@/utils/http'
import { ILoginType } from '@/store/types/auth'
import { ICoin, IWalletAddress } from '@/store/types/coin'

// 用户个人资料信息接口
export type Res = ILoginType
export const getUserInfoApi = () => {
  return request.get<Res>('/api/UserCenter/getInfo', {
    responseType: 'arraybuffer',
    options: {}
  })
}

export const getUserCoinApi = () => {
  return request.get<ICoin[]>('/api/UserCenter/userCoins', {
    responseType: 'arraybuffer',
    options: {}
  })
}
export interface getUserWalletAddressParams {
  token: string
  mtype: number
  coin_name: string
  coin_protocol: string
  coin_wallet_api: string
  create?: number
}
export const getUserWalletAddressApi = (params: getUserWalletAddressParams) => {
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
