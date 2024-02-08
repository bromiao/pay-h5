<script setup lang="ts">
import iconWarning from '@/assets/images/common/warning.png'
import { enableAppBar, modeType } from '@/components/AppBar/useAppBar'
import GlobalDialog from '@/components/Common/GlobalDialog.vue'
import MenuBar from '@/components/Menu/MenuBar.vue'
import { useAuthStore } from '@/store/modules/auth'
import socket from '@/utils/WSUtil'
import '@vant/touch-emulator'
import { useWindowSize } from '@vant/use'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from './router'
import { useCommonStore } from './store/modules/common'
import { useEntryStore } from './store/modules/entry'
import mitt from './utils/mitt'
import themes, { changeThemeVariable } from './utils/themes'
import { darkIconRouteList, mergeHrefParams, requireImg } from './utils/tools'

const search = new URLSearchParams(mergeHrefParams())
const hs = search.get('hs') || ''
const wideMode = hs === 'h'

const route = useRoute()
// 刷新页面时使用记录mode，不存在默认为dark
const mode = sessionStorage.getItem('mode') || 'dark'
const AppBar = enableAppBar(mode as modeType)

const { width } = useWindowSize()

// 需显示底部导航栏的路由列表
const MenuBarRouteList = ['Home', 'SellCoin', 'Order', 'Point', 'scanQR', 'Mine']
const commonStore = useCommonStore()
const { showLoading } = storeToRefs(commonStore)

const reqLoading = ref(false)
const isOpen = ref(false)

const { token, Websocket } = storeToRefs(useAuthStore())
const webview = ref(false)
const theme = ref<any>({})
const h5_skin = ref('def')
const hideAppBarRoute = ref(['CollectCards', 'AppCollectCards', 'RankingList'])

async function initApp() {
  const search = new URLSearchParams(mergeHrefParams())
  const vtoken = search.get('vtoken') || ''
  const deviceid = search.get('deviceid') || ''
  const operation_verification = search.get('operation_verification') || ''
  const merchantorderid = search.get('merchantorderid') || ''
  const show_joint_key = search.get('show_joint_key') || ''
  const coin_name = search.get('coin_name') || 'GDB'
  const pay_name = search.get('pay_name') || 'GDpay'
  const utoken = search.get('token') || ''
  console.log('url====vtoken====deviceid', window.location, vtoken, deviceid)

  const { getH5init, getUserInfo } = useAuthStore()
  const entryStore = useEntryStore()
  const { fingerprint } = storeToRefs(entryStore)
  const { getConfigApi, getFingerprint } = entryStore
  const authStore = useAuthStore()
  if (vtoken && deviceid) {
    webview.value = true
  }

  //初始化信息
  if (show_joint_key) {
    // theme.value = themes[show_joint_key]
    sessionStorage.setItem('show_joint_key', show_joint_key)
  } else {
    sessionStorage.removeItem('show_joint_key')
  }
  if (!!merchantorderid) {
    sessionStorage.setItem('merchantorderid', merchantorderid)
  } else {
    sessionStorage.removeItem('merchantorderid')
  }
  if (operation_verification) {
    sessionStorage.setItem('operation_verification', operation_verification)
    const body = document.body
    body.style.backgroundImage = 'none'
    document.title = '在线充值'

    if (
      !(
        window.location.hash.includes('onlineCharge') ||
        window.location.hash.includes('wideOrderCreate')
      )
    ) {
      router.replace('/onlineCharge')
    }
  } else {
    sessionStorage.removeItem('operation_verification')
  }

  //获取接口
  sessionStorage.setItem('SERVE_URL', '')
  const filename =
    process.env.VITE_APP_ENV === 'dev'
      ? '/config_dev.json?time=' + Date.now()
      : '/config.json?time=' + Date.now()
  try {
    const response = await fetch(filename)
    if (!response.ok) {
      throw new Error('网络请求失败')
    }
    const config1 = await response.json()
    sessionStorage.setItem('SERVE_URL', config1.SERVE_URL)
    console.log('config.SERVE_URL', config1.SERVE_URL)

    // url携带用户真实token, 则更新token
    if (utoken) {
      authStore.$patch({ token: utoken })
      localStorage.setItem('token', utoken)
      // sessionStorage.setItem('isApp', '1')
      getUserInfo().then(userInfo => {
        // token失效处理
        if (!userInfo?.token) {
          authStore.$patch({ token: '' })
          localStorage.setItem('token', '')
        }
      })
    }
  } catch (err) {
    console.error('读取或解析配置文件时发生错误:', err)
  }
  if (!fingerprint.value) {
    getFingerprint()
  }
  try {
    // 对比vtoken,deviceid和缓存中的是否相同
    const isDifferent = () => {
      const storeVtoken = sessionStorage.getItem('vtoken')
      const storeDeviceId = sessionStorage.getItem('deviceid')
      return (
        (storeVtoken && storeVtoken !== vtoken) || (storeDeviceId && storeDeviceId !== deviceid)
      )
    }
    // 内嵌打开时获取真实token信息，刷新页面则跳过
    if ((vtoken && deviceid && !sessionStorage.getItem('md5_pri')) || isDifferent()) {
      commonStore.setShowLoading(true)
      // 获取真实token信息
      const res = await getH5init({
        vtoken,
        deviceid,
        operation_verification
      })
      commonStore.setShowLoading(false)
      isOpen.value = true
      getUserInfo().then(userInfo => {
        // 获取用户信息失败后，提醒用户并退出
        if (!userInfo.token) {
          showToast({
            message: '获取用户信息失败，请重新进入',
            icon: iconWarning
          })
          setTimeout(() => {
            window.close && window.close()
          }, 2000)
        }
      })
    }
    //获取配置文件
    getConfigApi({ show_joint_key })
      .then(data => {
        // console.log('data', data)
        const hosts_Websocket = 'ws://' + (data.Web_Set_DefaultInfo.hosts_Websocket as any)?.v || ''
        const hosts_Websocket_WSS =
          'wss://' + (data.Web_Set_DefaultInfo.hosts_Websocket_WSS as any)?.v || ''
        const url = window.location.protocol === 'https:' ? hosts_Websocket_WSS : hosts_Websocket
        // console.log('url--------app', url, window.location.protocol)
        Websocket.value = socket(url)
        Websocket.value.start(token.value)
        if (data.Web_Set_DefaultInfo.coin_name?.v) {
          sessionStorage.setItem('coin_name', data.Web_Set_DefaultInfo.coin_name.v)
        } else {
          if (coin_name) {
            sessionStorage.setItem('coin_name', coin_name)
          }
        }
        if (data.Web_Set_DefaultInfo.pay_name?.v) {
          sessionStorage.setItem('pay_name', data.Web_Set_DefaultInfo.pay_name.v)
        } else {
          if (pay_name) {
            sessionStorage.setItem('pay_name', pay_name)
          }
        }
        if (data.Web_Set_DefaultInfo.net_title?.v) {
          document.title = data.Web_Set_DefaultInfo.net_title.v
        }
        if (data.Web_Set_DefaultInfo.h5_skin?.v) {
          h5_skin.value = data.Web_Set_DefaultInfo.h5_skin.v
          theme.value = themes[data.Web_Set_DefaultInfo.h5_skin.v] || {}
          let rootHTML: any = document.body
          let AttributeStr = ''
          Object.keys(themes['common']).forEach((el, i, arr) => {
            let result = el.replace(/[A-Z]/g, function (match) {
              return '-' + match.toLowerCase()
            })
            AttributeStr += '--app-' + result + ':' + (themes['common'] as any)[el] + ';'
          })
          Object.keys(theme.value).forEach(el => {
            let result = el.replace(/[A-Z]/g, function (match) {
              return '-' + match.toLowerCase()
            })
            AttributeStr += '--van-' + result + ':' + theme.value[el] + ';'
            // console.log(el, theme.value[el])
          })
          rootHTML.setAttribute('style', AttributeStr)
          // console.log('theme.value', theme.value)

          let currentIcon = requireImg('icon/' + h5_skin.value + '.png') //可通过后端动态获取名称
          let link: any = document.querySelector('link[rel*="icon"]')
          link.href = currentIcon

          changeThemeVariable(data.Web_Set_DefaultInfo.h5_skin.v)
          sessionStorage.setItem('theme', data.Web_Set_DefaultInfo.h5_skin.v)
          isOpen.value = true
        }
        if (!operation_verification && data.Web_Set_DefaultInfo.h5loginbgimg_url?.v) {
          document.body.style.backgroundImage =
            'url(' +
            data.Web_Set_DefaultInfo.imgserver_url.v +
            data.Web_Set_DefaultInfo.h5loginbgimg_url.v +
            ')'
        }
      })
      .catch(err => {
        console.log('err', err)
        localStorage.setItem('md5_pri', '')

        // 本地服务不刷新
        if (!window.location.port) {
          window.location.reload()
        }
      })
  } catch (error) {
    console.error(error)
  }
}
initApp()

setTimeout(() => {
  document.body.addEventListener('plugin_web_update_notice', e => {
    window.location.reload()
  })
}, 3000)
// 数字键盘位置修正
const initNumberKeyboardStyle = () => {
  const bodyWidth = document.body.clientWidth
  const appWidth = document.querySelector('#app')!.clientWidth
  const maxWidth = bodyWidth - appWidth
  let vanNumberKeyBoard = document.querySelectorAll('.van-number-keyboard')

  if (vanNumberKeyBoard.length) {
    vanNumberKeyBoard.forEach(item => {
      ;(item as HTMLInputElement).style.setProperty(
        'left',
        (maxWidth < 0 ? 0 : maxWidth) / 2 + 'px',
        'important'
      )
    })
    vanNumberKeyBoard = null as any
  }
}
// 动作面板位置修正
const initActionSheetStyle = () => {
  const bodyWidth = document.body.clientWidth
  const appWidth = document.querySelector('#app')!.clientWidth
  const maxWidth = bodyWidth - appWidth
  const actionSheet = document.querySelector('.full-w-sheet')

  if (actionSheet) {
    ;(actionSheet as HTMLElement).style.setProperty(
      'left',
      (maxWidth < 0 ? 0 : maxWidth) / 2 + 'px',
      'important'
    )
  }
}

// 请求前，显示loading遮罩，请求完成后，隐藏
watch(showLoading, (newValue, oldValue) => {
  reqLoading.value = newValue
})

watch([width], () => {
  setTimeout(() => {
    initNumberKeyboardStyle()
    initActionSheetStyle()
  })
})

const objBlurFun = (sDom: 'input' | 'textarea', time: number = 300) => {
  //判断是否为苹果
  let isIPhone = navigator.userAgent.toUpperCase().includes('IPHONE')
  if (isIPhone) {
    let obj = document.querySelectorAll(sDom)
    for (let i = 0; i < obj.length; i++) {
      objBlur(obj[i] as HTMLElement, time)
    }
  }
}

const objBlur = (sdom: HTMLElement, time: number = 300) => {
  if (sdom) {
    sdom.addEventListener(
      'focus',
      function () {
        document.addEventListener(
          'touchend',
          e => {
            // 这里的e非常重要，用来判断是否是点击了input表单
            docTouchend(sdom, time, e)
          },
          false
        )
      },
      false
    )
  } else {
    throw new Error('objBlur()没有找到元素')
  }
}

const docTouchend = (sDom: HTMLElement, time: number, e: Event) => {
  if (e.target != sDom) {
    // 如果点击的是 屏幕空白处的情况下
    // console.log(sDom)
    // console.log(e.target)
    setTimeout(() => {
      sDom.blur() // 表单失去焦点  键盘就会自动收起
      document.removeEventListener('touchend', docTouchend as (...args: any[]) => void, false) // 收起之后 移除监听器
    }, time)
  }
}

// 路由变化时，处理当前页面所有输入框的ios兼容问题----失焦后自动退出键盘
watch(
  () => router.currentRoute.value,
  route => {
    setTimeout(() => {
      objBlurFun('input')
    })

    // 路由变化时记录mode
    const mode = darkIconRouteList.includes(route.name as string) || !route.name ? 'dark' : 'light'
    if (route.name) {
      sessionStorage.setItem('mode', mode)
    }
  },
  { immediate: true }
)

onMounted(() => {
  mitt.on('number-keyboard-show', initNumberKeyboardStyle)
  mitt.on('action-sheet-show', initActionSheetStyle)
  // 检测断网
  window.addEventListener('offline', () => {
    //
  })
  // 检测有网络
  window.addEventListener('online', () => {
    // window.location.reload()
  })
  // 检测页面可见性
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // window.location.reload()
    } else {
      //
    }
  })
})
</script>

<template>
  <van-config-provider
    ref="APPcontainer"
    class="content-container"
    :class="[
      route.path.includes('/bricks') ? 'flex flex-col' : h5_skin,
      { 'app-wide-mode': wideMode }
    ]"
    :theme-vars="theme"
    theme-vars-scope="global"
  >
    <template v-if="!hideAppBarRoute.includes(route.name as string)">
      <AppBar />
    </template>
    <router-view v-if="isOpen" />
    <MenuBar v-if="isOpen && MenuBarRouteList.includes(route.name as string)" />

    <van-toast
      v-model:show="reqLoading"
      style="padding: 0"
    >
      <template #message>
        <svg
          class="circular"
          viewBox="0 0 50 50"
        >
          <circle
            class="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
          ></circle>
        </svg>
        <div>请求网络中...</div>
      </template>
    </van-toast>

    <GlobalDialog />

    <PreloadResources />
  </van-config-provider>
</template>
<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
@import '@/assets/styles/sprite-home.scss';

body {
  .app-wide-mode {
    .van-dialog {
      --van-dialog-radius: 18px;
    }
    .van-action-sheet {
      max-width: unset;
      width: 100% !important;
    }
  }
  .circular {
    display: inline;
    height: 84px;
    width: 84px;
    animation: loading-rotate 2s linear infinite;

    .path {
      animation: loading-dash 2s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: var(--van-button-primary-background);
      stroke-linecap: round;
      fill: none;
    }
  }

  .van-toast {
    width: 270px;
    height: 270px;
    padding: 40px;
    font-size: 33px;

    &.van-action-sheet {
      width: 100%;
      height: auto;
      padding: 0;
    }

    .van-toast__icon {
      font-size: 110px;
    }

    .van-toast__text {
      margin-top: 15px;
      line-height: 1.5;
    }
  }
  .order_toast {
    width: 100%;
    max-width: 640px;
    height: auto;
    top: 209px;
    padding: 15px;
    padding-top: 0;
    background-color: #ebf1f6;
    text-align: justify;
  }
  .van-pull-refresh {
    height: 100%;
    overflow-y: auto;
  }

  .f_dialog {
    .van-dialog__footer {
      .van-button {
        background: var(--van-button-primary-background);
      }
    }
  }

  .van-action-sheet {
    max-width: 10rem;
  }
}

@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
