// import {
//   CompletionPaymentPasswordMiddleware,
//   CompletionIdCardMiddleware,
//   CompletionPaymentMiddleware
// } from '@/router/middleware'

const crypto = [
  {
    path: '/buy_coin',
    name: 'buy_coin',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Crypto/buy.vue'),
    beforeEnter: [
      // CompletionIdCardMiddleware
      // CompletionPaymentMiddleware
    ]
  },
  {
    path: '/send',
    name: 'send',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Crypto/send_orderTopup.vue'),
    beforeEnter: [
      // CompletionIdCardMiddleware
      // CompletionPaymentMiddleware
    ]
  },
  {
    path: '/selfbuy_coin',
    name: 'selfbuy_coin',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Crypto/selfbuyCoin.vue')
  },
  {
    path: '/sell_coin',
    name: 'sell_coin',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Crypto/sell.vue'),
    beforeEnter: [
      // CompletionIdCardMiddleware,
      // CompletionPaymentPasswordMiddleware
      // CompletionPaymentMiddleware
    ]
  },
  {
    path: '/orderCreate',
    name: 'orderCreate',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Crypto/orderCreate.vue')
  },
  {
    path: '/wideOrderCreate',
    name: 'wideOrderCreate',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Crypto/wideOrderCreate.vue')
  },
  {
    path: '/onlineCharge',
    name: 'onlineCharge',
    component: () => import(/* webpackChunkName: "crypto" */ '@/pages/Other/onlineCharge.vue')
  }
]

export default crypto
