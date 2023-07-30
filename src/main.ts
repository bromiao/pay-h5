import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import { Button } from 'vant'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn') // 设置 dayjs 语言

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 数据持久化

const app = createApp(App)
// 挂载到 Vue 根实例
app.use(pinia)
app.use(router)
app.use(Button)

app.mount('#app')
