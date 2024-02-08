import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routers'
import { AuthExpirePopup } from '@/components/CommonPopup/AuthExpirePopup'
import { buy_sell_v } from '@/router/middleware'
import { UntokenInWEB, filterList } from '@/utils/tools'
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory('/h5'),
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  // 如果未匹配到路由
  if (to.matched.length === 0) {
    // 如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
    from.path ? next({ path: from.path }) : next('/')
  } else {
    // const commonStore = useCommonStore()
    // 跳转路由前，终止所有未完成的请求
    // commonStore.abortAllRequest()

    const search = new URLSearchParams(window.location.search)
    const vtoken = search.get('vtoken') || ''
    const deviceid = search.get('deviceid') || ''

    // 非开发环境，屏蔽跳转到登录页
    // if (import.meta.env.VITE_APP_ENV === 'prod' && to.name === 'Login') return

    // 兼容本地H5调式页面，未获取到token，则跳转到登录页，避免页面显示异常
    // if (
    //   import.meta.env.VITE_APP_ENV === 'dev' &&
    //   !vtoken &&
    //   !deviceid &&
    //   !localStorage.getItem('token') &&
    //   to.name !== 'Login'
    // ) {
    //   next('/auth/login')
    //   return
    // }

    // 提现后，点击确认进入详情后，点返回，应返回到搬砖页
    if (to.name === 'WithdrawCoins' && from.name === 'CoinDetails') {
      next('/bricks/move-brick')
      return
    }
    if (to.name === 'buy_coin' && from.name !== 'buy_coin' && from.name) {
      if (!!!(await buy_sell_v())) return next(false)
    }
    if (to.name === 'sell_coin' && from.name !== 'sell_coin' && from.name) {
      if (!!!(await buy_sell_v())) return next(false)
    }
    if (UntokenInWEB() && !!!filterList(to.fullPath)) {
      return next('/auth/login')
    }
    // 如果匹配到正确跳转
    next()
  }
})

router.afterEach((to, from) => {
  const hash = window.location.hash
  if (UntokenInWEB() && hash.includes('send')) {
    setTimeout(() => {
      AuthExpirePopup({
        action: () => {
          router.replace('/auth/login')
        },
        msgtext: '登录已失效，请返回登录。'
      })
    }, 500)
    return
  }
})

export default router
