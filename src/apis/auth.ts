import {
  ICountryCoinType,
  IH5InitData,
  ILoginType,
  IMobileCodeType,
  IRegisterType
} from '@/store/types/auth'
import { request } from '@/utils/http'
export interface CountryParams {
  cache?: number
}
export const getCountryCode = (params: CountryParams = {}) => {
  return request.post<ICountryCoinType>('/api/Systeminfo/CountryCode', params)
}

// 获取图形验证码
export interface ImgCaptchaParams {
  imgtype: 'login' | 'reg' | 'passw' | 'cleardev'
  imgid: string
}
export interface CaptchaParams {
  mobile: string
  uuid: string
  username: string
  type: string
  internationalCode: string
}
export type Res = ArrayBufferLike
export const getCaptchaApi = (params: CaptchaParams) => {
  // api/user/checkImg 图形验证码
  return request.post<IMobileCodeType>('/api/Smssend/doSend', params, {
    // responseType: 'arraybuffer',
    options: {}
  })
}
// 注册
export interface RegisterParams {
  internationalcode?: string
  username: string
  mobile: string
  mobilecode: string
  country_code?: string
  transpw?: string
  pass: string
  passcheck: string
  set_lang?: string
}

export const registerApi = (params: RegisterParams) => {
  return request.post('/api/user/reg', params, {
    // responseType: 'arraybuffer',
    options: {}
  })
}
// reSetPass
export interface reSetPass {
  mobile: string
  code: string
  newpass: string
  newpassck: string
  type: string
}

export const reSetPass = (params: reSetPass) => {
  return request.post('/api/user/reSetPass', params, {
    options: {
      showLoading: true
    }
  })
}
// 检测是否已经注册
export const checkRegisterApi = (params: RegisterParams) => {
  return request.post('/api/user/userExist', params)
}

// 登录/api/user/userLogin
export interface LoginParams {
  username?: string
  mobile: string
  pass: string
  deviceid?: string
  google_verify_code?: string
  platform?: string
  imgid?: string
  imgtype?: string
  imgcode?: string
  imgvertoken?: string
  web_reg_url?: any
  pushdeviceid?: string
}
export const loginApi = (params: LoginParams) => {
  return request.post<ILoginType>('/api/user/userLogin', params)
}

export interface MobileCodeParams {
  mobile: string
  imgcode?: string
  imgid: string
  imgtype: string
  uuid: string
  username: string
  type: string
  internationalCode: string
}
export const mobileCodeApi = (params: MobileCodeParams) => {
  return request.post<IMobileCodeType>('/api/Smssend/doSend', params)
}
export interface ICheckImgParams {
  imgid: string
  imgtype: string
}
export const checkImgApi = (params: ICheckImgParams) => {
  return request.post<any>('/api/user/checkImg', params, {
    responseType: 'arraybuffer',
    options: {}
  })
}

export interface IH5initParams {
  vtoken: string
  deviceid: string
  operation_verification: string
}
export const H5InitApi = (params: IH5initParams) => {
  return request.post<IH5InitData>('/pay/cjfpay/h5init', params)
}
export interface CountryCode {
  cache?: string
  wallet_type?: string
}

export interface ResCountryCodeObj {
  id: number
  country_code: string
  country_name: string
  phone_code: string
  country_coin: string
  coin_price: string
  top_price: string
  is_sendsms: string
  wallet_type: string
  coin_rate: string
  order: string
  status: number
  remark: string
  country_lang: string
}
export interface ResCountryCode {
  country_coin: ResCountryCodeObj[]
}
export const wallet_type = (params: CountryCode) => {
  return request.post<ResCountryCode>('/api/Systeminfo/CountryCode', params)
}
export interface facecheck {
  vtype: number
  faceimg?: string
  initMsg?: string
  verifyMsg?: string
  vtoken?: string
}
export const facecheck = (params: facecheck) => {
  return request.post('/api/Usercenter/facecheck', params)
}
