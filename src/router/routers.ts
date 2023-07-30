import home from './module/home'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  ...home
]

export default routes
