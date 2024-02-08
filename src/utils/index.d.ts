import { AxiosRequestConfig, AxiosError } from 'axios'
export interface HttpOptions {
  // 是否显示loading
  showLoading?: boolean
  // 是否显示错误提示
  showErrorToast?: boolean
  // 是否需要登录
  auth?: boolean
  // 是否跳转到登录
  login?: boolean
  // 是否立即隐藏loading 如果为false 则在500ms后隐藏
  hideLoadingInstantly?: boolean
  //是否显示返回,不用返回data
  returnFull?: boolean
}
//CustomAxiosRequestConfig
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  options?: HttpOptions
  withCustomErrorHandle?: boolean
}

export interface AxiosRequestConfigExtended extends AxiosRequestConfig {
  retry: number
  retryDelay: number
}

export interface AxiosErrorConfigExtended extends AxiosError {
  config: AxiosRequestConfigExtended
}
