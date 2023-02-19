import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 前台组件
import frontEnd from '../layout/frontEnd.vue'
import HomeView from '../views/HomeView.vue'
import noFound from '../views/noFound.vue'

// 登录组件
import loginRouter from './modules/login'
// 后台路由
import backendRouter from './modules/backend'

export const constantRoutes: Array<RouteRecordRaw> = [
  // 前台
  {// 首页  
    path: '/',
    name: 'home',
    component: frontEnd,
    children: [
      {
        path: '',
        component: HomeView
      }
    ],
  },
  ...loginRouter,
  {
    path: '/404',
    component: noFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes,
})
export const asyncRouter = [
  ...backendRouter,
]
export default router
