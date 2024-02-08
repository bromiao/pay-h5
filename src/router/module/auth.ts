const auth = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ '@/pages/Auth/index.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Auth/Login.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Auth/Register.vue')
      },
      {
        path: 'forgetPasw',
        name: 'forgetPasw',
        component: () => import(/* webpackChunkName: "auth" */ '@/pages/Auth/forgetPasw.vue')
      }
    ]
  },
  {
    path: '/country',
    name: 'Country',
    component: () => import(/* webpackChunkName: "auth" */ '@/pages/Auth/Country.vue')
  }
]

export default auth
