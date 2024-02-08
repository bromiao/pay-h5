const auth = [
  {
    path: '/iframe-page',
    name: 'IframePage',
    component: () => import(/* webpackChunkName: "iframe-page" */ '@/pages/Iframe/index.vue'),
    children: [
      {
        // 第三方外链页面 客服，教程等
        path: 'third',
        name: 'Third',
        meta: {
          title: 'third page'
        },
        component: () => import(/* webpackChunkName: "iframe-page" */ '@/pages/Iframe/Third.vue')
      }
    ]
  }
]

export default auth
