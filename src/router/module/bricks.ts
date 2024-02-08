import { CompletionIdCardMiddleware, CompletionPaymentPasswordMiddleware } from '../middleware'

const bricks = [
  {
    path: '/bricks',
    name: 'Bricks',
    component: () => import(/* webpackChunkName: "bricks" */ '@/pages/Bricks/index.vue'),
    children: [
      {
        path: 'recharge',
        name: 'Recharge',
        component: () => import(/* webpackChunkName: "bricks" */ '@/pages/Bricks/Recharge.vue'),
        beforeEnter: [CompletionIdCardMiddleware, CompletionPaymentPasswordMiddleware]
      },
      {
        path: 'withdraw-coins',
        name: 'WithdrawCoins',
        component: () =>
          import(/* webpackChunkName: "bricks" */ '@/pages/Bricks/WithdrawCoins.vue'),
        beforeEnter: [CompletionIdCardMiddleware, CompletionPaymentPasswordMiddleware]
      },
      {
        path: 'transfer/:coin',
        name: 'Transfer',
        component: () => import(/* webpackChunkName: "bricks" */ '@/pages/Bricks/Transfer.vue'),
        beforeEnter: [CompletionIdCardMiddleware, CompletionPaymentPasswordMiddleware]
      },
      {
        path: 'move-brick',
        name: 'MoveBrick',
        component: () => import(/* webpackChunkName: "bricks" */ '@/pages/Bricks/moveBrick.vue')
      }
    ]
  }
]

export default bricks
