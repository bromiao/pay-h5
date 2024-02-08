const activity = [
  {
    path: '/activity',
    name: 'Activity',
    component: () => import(/* webpackChunkName: "auth" */ '@/pages/Activity/index.vue'),
    children: [
      {
        path: 'collect-cards',
        name: 'CollectCards',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Activity/CollectCards.vue')
      },
      {
        path: 'app-collect-cards',
        name: 'AppCollectCards',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Activity/CollectCards.vue')
      },
      {
        path: 'ranking-list',
        name: 'RankingList',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Activity/RankingList.vue')
      }
    ]
  },
  {
    path: '/activityRules',
    name: 'activityRules',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/activityRules.vue')
  },
  {
    path: '/giftCard',
    name: 'giftCard',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/giftCard.vue')
  },
  {
    path: '/giftResult',
    name: 'giftResult',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/giftResult.vue')
  },
  {
    path: '/cardReceive',
    name: 'cardReceive',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/cardReceive.vue')
  },
  {
    path: '/cardRecord',
    name: 'cardRecord',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/cardRecord.vue')
  },
  {
    path: '/applyRecord',
    name: 'applyRecord',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/applyRecord.vue')
  },
  {
    path: '/activityRecord',
    name: 'activityRecord',
    component: () =>
      import(/* webpackChunkName: "activity" */ '@/pages/Activity/Subpages/activityRecord.vue')
  }
]

export default activity
