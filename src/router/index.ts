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
    component: frontEnd,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      }
    ],
  },
  {
    path: '/person',
    name: '账户管理',
    children: [
      {
        path: '/person',
        name: '个人中心',
        component: () => import(/* webpackChunkName: "person" */ '../views/person/index.vue')
      }
    ]
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
