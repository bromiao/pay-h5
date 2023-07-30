import App from '@/pages/Home/index.vue'

const home = [
  {
    path: '/',
    name: 'App',
    // component: App,
    children: [
      {
        path: '/index',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/pages/Home/index.vue')
      },
      {
        path: '/point',
        name: 'point',
        component: () => import(/* webpackChunkName: "point" */ '@/pages/Point/index.vue')
      },
      {
        path: '/scan',
        name: 'scan',
        component: () => import(/* webpackChunkName: "scan" */ '@/pages/Scan/index.vue'),
        meta: {}
      },
      {
        path: '/order',
        name: 'order',
        component: () => import(/* webpackChunkName: "order" */ '@/pages/Order/index.vue'),
        meta: {}
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import(/* webpackChunkName: "mine" */ '@/pages/Mine/index.vue'),
        meta: {
          // requiresAuth: true, // 是否需要登录权限
        }
      }
    ]
  }
]

export default home
