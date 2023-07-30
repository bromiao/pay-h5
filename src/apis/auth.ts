import { ICountryCoinType, ILoginType, IMobileCodeType, IRegisterType } from '@/store/types/auth'
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
  return request.post<IRegisterType>('/api/user/reg', params, {
    // responseType: 'arraybuffer',
    options: {}
  })
}
// 检测是否已经注册
interface CheckRegisterParams {}
export const checkRegisterApi = (params: RegisterParams) => {
  return request.post('/api/user/userExist', params)
}

// 登录/api/user/userLogin
export interface LoginParams {
  mobile: string
  pass: string
  google_verify_code?: string
  deviceid?: string
}
export const loginApi = (params: LoginParams) => {
  return request.post<ILoginType>('/api/user/userLogin', params)
}

export interface MobileCodeParams {
  mobile: string
  uuid: string
  username: string
  type: string
  internationalCode: string
}
export const mobileCodeApi = (params: MobileCodeParams) => {
  return request.post<IMobileCodeType>('/api/Smssend/doSend', params)
}
