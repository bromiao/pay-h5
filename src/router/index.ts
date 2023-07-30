import { createRouter, createWebHistory } from 'vue-router'
import routes from './routers'
const HomeView = () => import(/* webpackChunkName: "Home" */ '@/pages/Home/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: [
  //   {
  //     path: '/',
  //     name: 'home',
  //     component: HomeView,
  //   },
  //   {
  //     path: '/:pathMatch(.*)*',
  //     redirect: '/',
  //   },
  // ],
  routes: routes
})

export default router
