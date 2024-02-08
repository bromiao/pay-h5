// import App from '@/pages/Home/index.vue'

const home = [
  {
    path: '/',
    name: 'App',
    // component: App,
    children: [
      {
        path: '/index',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/pages/Home/index.vue')
      },
      {
        path: '/sell-coin',
        name: 'SellCoin',
        component: () => import(/* webpackChunkName: "home" */ '@/pages/Crypto/sell.vue')
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import(/* webpackChunkName: "order" */ '@/pages/Order/index.vue'),
        meta: {}
      },
      {
        path: '/point',
        name: 'Point',
        component: () => import(/* webpackChunkName: "point" */ '@/pages/Point/index.vue')
      },
      {
        path: '/mine',
        name: 'Mine',
        component: () => import(/* webpackChunkName: "mine" */ '@/pages/Mine/index.vue'),
        meta: {
          // requiresAuth: true, // 是否需要登录权限
        }
      },
      {
        path: '/scanQR',
        name: 'scanQR',
        component: () => import(/* webpackChunkName: "home" */ '@/pages/Other/scanQR.vue'),
        meta: {
          // requiresAuth: true, // 是否需要登录权限
        }
      }
    ]
  }
]

export default home
