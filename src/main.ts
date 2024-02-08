import 'amfe-flexible'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {
  Button,
  ConfigProvider,
  Dialog,
  Lazyload,
  Loading,
  NavBar,
  PullRefresh,
  Swipe,
  SwipeCell,
  SwipeItem,
  Tab,
  Tabs,
  Toast
} from 'vant'
import 'vant/es/toast/style'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/common.scss'
import './basic-type-extensions'
import router from './router'
import piniaStore from './store'
import './style.css'
import { MyLog } from './utils/tools'

MyLog()
dayjs.locale('zh-cn') // 设置 dayjs 语言

const app = createApp(App)
// 挂载到 Vue 根实例
app.use(piniaStore)
app.use(router)
app.use(Button)
app.use(NavBar)
app.use(Tab)
app.use(Tabs)
app.use(Lazyload)
app.use(Toast)
app.use(Dialog)
app.use(Swipe)
app.use(SwipeItem)
app.use(SwipeCell)
app.use(PullRefresh)
app.use(Loading)
app.use(ConfigProvider)

// 自定义全局指令处理富文本内容
app.directive('content', (el, binding) => {
  const imgs = el.querySelectorAll('img')

  // 处理插入图片前面的文字
  imgs.forEach((item: HTMLImageElement) => {
    // 表情符号alt=[xx], 不做处理
    if (!item.alt) {
      const prevElement = item.previousSibling as HTMLElement

      if (!prevElement) return

      if (!prevElement.tagName) {
        const span = document.createElement('span')
        span.style.display = 'inline-block'
        span.innerHTML = prevElement.textContent as string
        prevElement.before(span)
        prevElement.textContent = ''
      }
      if (prevElement.tagName === 'SPAN') {
        prevElement.style.display = 'inline-block'
      }
    }
  })
})

app.mount('#app')
