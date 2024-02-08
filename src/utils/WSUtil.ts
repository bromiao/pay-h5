export class Socket {
  url: any
  protocols: any
  ws: any
  reconnectTimeout: number
  maxReconnectTimes: number
  reconnectTimes: any
  token: string
  t_s: any
  constructor(url?: any, token?: string, protocols?: any) {
    this.url = url || ''
    this.token = token || ''
    // this.protocols = protocols
    this.ws = null
    this.reconnectTimeout = 1000
    this.maxReconnectTimes = 10
    this.t_s = null
  }
  start(Token: string, url?: string) {
    this.reconnectTimes = 0
    Token && (this.token = Token)
    url && (this.url = url)
    return this
  }
  connect() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => {
      console.log('连接以打开--->', this.token, '<---token')
      this.ws.send(this.token)

      this.reconnectTimes = 0
    }
    this.ws.onclose = () => {
      clearTimeout(this.t_s)
      this.t_s = setTimeout(() => {
        location.reload()
      }, 1000 * 30)
      console.log('WebSocket断开连接')
      this.reconnect()
    }
    this.ws.onerror = (err: any) => {
      console.log('WebSocket连接出错', err)
    }
  }
  reconnect() {
    if (this.reconnectTimes < this.maxReconnectTimes) {
      setTimeout(() => {
        this.connect()
        this.reconnectTimes++
      }, this.reconnectTimeout)
      this.reconnectTimeout *= 2
    } else {
      console.log('WebSocket重连超过最大次数,放弃重连')
    }
  }
  msg(param: any) {
    if (param === 'ping') {
      this.ws.send(param)
    } else {
      this.ws.send(JSON.stringify(param))
    }
  }
  // 延迟发送
  timeout(param: any) {
    setTimeout(() => {
      this.msg(param)
    }, 2000)
  }
  send(param: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.msg(param)
    } else if (this.ws.readyState === WebSocket.CONNECTING) {
      this.timeout(param)
    } else {
      this.timeout(param)
    }
  }
}

import resHandle from '@/store/modules/coinBuySell/resHandle'
// callback: { (data: any): void; (arg0: any): void }
export function wsInit(URL?: string) {
  // const url = import.meta.env.VITE_APP_WS_URL;
  const url = URL
  const init = new Socket(url)
  init.connect()
  init.ws.onmessage = function (ev: { data: string | string[] }) {
    if (ev && ev.data && ev.data.indexOf('subscribe') > -1) {
      console.log('subscribe->', ev.data)
    } else if (ev && ev.data) {
      let data = ev.data == 'pong' ? ev.data : eval('(' + ev.data + ')')
      // callback(data)

      // cmd 消息返回数据处理
      // 事件 消息返回数据处理
      // 推送买币 消息返回数据处理
      resHandle(data)
    }
  }
  // 心跳连接
  function heartbeat() {
    let data = 'ping'
    // data = JSON.stringify(data)
    init && init.send(data)
  }
  // 9秒一次
  heartbeat()
  let t = null
  t = setInterval(heartbeat, 1000 * 9)
  return init
}

// const socket = wsInit()

export default wsInit
