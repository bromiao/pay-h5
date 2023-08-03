import store from '@/store'
import { isUserLoggedInSelector } from '@/store/slices/auth.slice'
import md5 from 'crypto-js/md5'
export const DESIGN_WIDTH = 750
export const getWndowWidth = () => {
  const windowWidth = window.innerWidth

  if (windowWidth >= 768) return 768

  return windowWidth
}
export const px2vw = (px: number) => {
  return (px / DESIGN_WIDTH) * 100
}
// FlexViewProps
export const FLEXVIEWPROPS: Record<string, boolean> = {
  align: true,
  justify: true,
  wrap: true,
  direction: true,
  fontSize: true,
  iRef: true
}
// 传入一个对象和一个标识,转换成get请求的参数,如果标识为true,则返回一个不带?的字符串
export const objToUrl = (obj: Record<string, any>, flag?: boolean) => {
  if (!obj) return ''
  if (typeof obj !== 'object') return ''

  const arr = []
  const keys = Object.keys(obj).sort()
  let keystring = ''
  let keysvalue = ''

  if (keys.length === 0) return ''
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = obj[key]

    if (key === 'key') {
      keystring = key
      keysvalue = value
      continue
    }

    arr.push(`${key}=${value}`)
  }
  if (keystring) {
    arr.push(`${keystring}=${keysvalue}`)
  }
  if (flag) return arr.join('&')

  return `?${arr.join('&')}`
}
// 传入一个时间,延迟多少毫秒
export const delay = (time: number = 2000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
const PRIVATE_KEY = process.env.VITE_APP_PRIVATE_KEY ?? ''

// 传入post|get请求的参数,根据请求的类型,返回一个相应的默认参数
export const defaultParams = (type: string, data: Record<string, any>) => {
  const lang = 'cn'
  const platform = 'Android'
  const ver = process.env.VITE_APP_VERSION
  const timestamp = Math.round(new Date().getTime() / 1000)
  const key = PRIVATE_KEY

  const newData: Record<string, any> = {
    lang,
    platform,
    timestamp,
    key,
    ver
  }
  const sign = objToUrl(newData, true)

  newData.sign = md5(sign).toString()
  delete newData.key

  if (type === 'get') return objToUrl(Object.assign(newData, data))

  return Object.assign(newData, data)
}
// 传入一个字符串判断是否是一个json字符串
export const isJsonString = (str: string) => {
  if (typeof str === 'string') {
    const reg = /^\{.*\}$/

    if (reg.test(str)) {
      return JSON.parse(str)
    }

    return str
  }

  return str
}
export const isJson = (str: string) => {
  if (typeof str === 'string') {
    const reg = /^\{.*\}$/

    if (reg.test(str)) {
      return true
    }
    if (str === 'true' || str === 'false' || str === 'null' || str === 'undefined') {
      return true
    }

    return false
  }

  return false
}

function isWebPSupported() {
  const elem = document.createElement('canvas')

  if (elem.getContext && elem.getContext('2d')) {
    // 判断浏览器是否支持画布的 getContext 方法

    // 创建一个 WebP 格式的图片数据
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  // 浏览器不支持画布的 getContext 方法
  return false
}

window.isWebPSupported = isWebPSupported()

declare global {
  interface Window {
    isWebPSupported: boolean
    log: (...arg: any[]) => void
    info: (...arg: any[]) => void
    warn: (...arg: any[]) => void
    error: (...arg: any[]) => void
  }
}

export const getLoginStatus = () => {
  const state = store.getState()

  return isUserLoggedInSelector(state)
}

/** -------------------- 调试用 --------------------
 * 简单封装log，便于控制台打印关键信息，颜色高亮显示
 * 可根据自身喜好自定义改造，如高亮颜色
 * 记得调试结束后，删除相应打印log
 * -------------------- 调试用 --------------------
 */
export const MyLog = () => {
  const LOG: ILogType[] = ['log', 'info', 'warn', 'error']

  type ILogType = 'log' | 'info' | 'warn' | 'error'
  LOG.forEach((logType: ILogType) => {
    window[logType] = function () {
      const [key, ...logInfo] = arguments
      let color

      switch (logType) {
        case 'log':
          color = 'hotpink'
          break
        case 'info':
          color = 'orange'
          break
        case 'warn':
          color = 'red'
          break
        case 'error':
          color = ''
          break
        default:
          color = ''
          break
      }

      console[logType](`%c${key}::`, `color:${color}`, ...logInfo)
    }
  })
}
