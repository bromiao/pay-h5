const order = [
  {
    path: '/orderList', // 挂单详情
    name: 'orderList',
    component: () => import(/* webpackChunkName: "order" */ '@/pages/Order/list.vue')
  }
]

export default order
