const details = [
  {
    path: '/details',
    name: 'Details',
    component: () => import(/* webpackChunkName: "auth" */ '@/pages/Details/index.vue'),
    children: [
      {
        path: 'funding-details',
        name: 'FundingDetails',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Details/FundingDetails.vue')
      },
      {
        path: 'coin-details/:type',
        name: 'CoinDetails',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Details/CoinDetails.vue')
      },
      {
        path: 'message/:id',
        name: 'MessageDetail',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Details/Message.vue')
      }
    ]
  }
]

export default details
