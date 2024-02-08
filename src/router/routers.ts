import activity from './module/activity'
import auth from './module/auth'
import bricks from './module/bricks'
import crypto from './module/crypto'
import details from './module/details'
import home from './module/home'
import iframe from './module/iframe'
import mine from './module/mine'
import order from './module/order'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  ...auth,
  ...home,
  ...crypto,
  ...iframe,
  ...details,
  ...mine,
  ...order,
  ...bricks,
  ...activity
]

export default routes
