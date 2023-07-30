import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { defaultParams, getLoginStatus } from './tools'
import Toast, { Loading } from './toast'
import { CustomAxiosRequestConfig } from '.'
// 保存 Content-Type 的图片类型
const contentTypeImg = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']
const defaultOptions = {
  auth: false,
  showLoading: false,
  showErrorToast: true
}

interface ResData<T> {
  code: number
  msg: string
  data: T
}

class CustomAxios {
  private readonly axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL:
        process.env.NODE_ENV === 'development'
          ? process.env.REACT_APP_BASE_URL
          : process.env.REACT_APP_SERVE_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
    this.init()
  }

  // 错误处理
  private errorHandler<T>(error: AxiosError | ResData<T>, options?: Record<string, any>) {
    const op = options ?? (error as any)?.config?.options ?? {}

    if (error.code && (error as ResData<T>).msg) {
      const { code, msg } = error as ResData<T>
      // token失效后，跳转登录页
      const handleTokenExpires = () => {
        window.log('location', window.location)

        const matchArr = window.location.href.match(/(?<=h5)\S+$/)

        if (matchArr) {
          window.location.href = window.location.href.replace(matchArr[0], '/auth/login')
        }
      }

      switch (code) {
        case 10066:
          break
        case 10008:
          handleTokenExpires()
          break
        case 1:
          break
        // eslint-disable-next-line indent
        default:
          break
      }

      console.log('code', code)
      console.log('msg', msg)

      if (op?.showErrorToast) Toast.show(`${code}: ${msg}`, 2000)
    } else {
      const errMessage = (error as AxiosError).message

      if (op?.showErrorToast) Toast.show(errMessage, 2000)
    }
    if (Loading.isShow) Loading.hide(op?.hideLoadingInstantly)
  }

  request() {
    return {
      success: (config: CustomAxiosRequestConfig) => {
        const options = Object.assign({}, defaultOptions, config.options ?? {})
        const { auth, showLoading } = options

        if (showLoading) Loading.show()

        const { isLogin, token } = getLoginStatus()

        if (auth && !isLogin) {
          this.errorHandler<null>(
            {
              code: 10066,
              msg: '请先登录',
              data: null
            },
            options
          )

          return Promise.reject({
            code: 10066,
            msg: '请先登录'
          })
        }
        // 如果已经登录，就新增参数token
        if (config.method === 'get') {
          if (isLogin) {
            config.params.token = token
          }

          config.params = defaultParams('post', config.params)
        }
        if (config.method === 'post') {
          if (isLogin) {
            config.data.token = token
          }

          config.data = defaultParams('post', config.data)
        }
        // if (isLogin) config.headers.Authorization = `Bearer ${token}`;

        return Object.assign(config, { options })
      },
      error: (error: AxiosError) => {
        console.log('request:error', error)
        this.errorHandler(error)

        return Promise.reject(error)
      }
    }
  }

  response() {
    return {
      success: (response: AxiosResponse): AxiosResponse => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _options = (response.config as CustomAxiosRequestConfig).options

        if (contentTypeImg.includes(response.headers['content-type'])) {
          return response
        }
        if (response.data.code !== 0) {
          this.errorHandler(response.data, _options)
          // throw response.data;
        }

        return response
      },
      error: (error: AxiosError) => {
        console.log('response:error', error)
        this.errorHandler(error)

        return Promise.reject(error)
      }
    }
  }

  responseData = <T>(response: AxiosResponse<ResData<T>>, config?: CustomAxiosRequestConfig): T => {
    const { data } = response

    if (Loading.isShow) Loading.hide(config?.options?.hideLoadingInstantly)
    if (config?.options?.returnFull) return data as unknown as T

    return data.data ? data.data : (data as unknown as T)
  }

  init() {
    const response = this.response()

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(response.success, response.error)
    // 添加请求拦截器
    const request = this.request()

    this.axiosInstance.interceptors.request.use(request.success as any, request.error)
  }

  // 发送 GET 请求
  get<T>(url: string, params: any = {}, config?: CustomAxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get(url, {
        params
      })
      .then(response => this.responseData<T>(response, config))
      .catch(error => {
        throw error
      })
  }

  // // 发送 POST 请求
  post<T>(url: string, data: any = {}, config?: CustomAxiosRequestConfig): Promise<T> {
    // const params = defaultParams('post', data);

    return this.axiosInstance
      .post<ResData<T>>(url, data, config)
      .then(response => this.responseData<T>(response, config))
      .catch(error => {
        throw error
      })
  }

  // 其他自定义方法
}

export const request = new CustomAxios()
export default CustomAxios
