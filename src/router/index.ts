import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// 前台组件
import frontEnd from '../layout/frontEnd.vue'
import HomeView from '../views/HomeView.vue'

// 登录组件
import loginRouter from './modules/login'
// 后台路由
import backendRouter from './modules/backend'

const whiteList = ['/login', '/loginLog',]
//   component: () => import(/* webpackChunkName: "management" */ '../views/management/index.vue')
const routes: Array<RouteRecordRaw> = [
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
  ...backendRouter,
  // { path: '*', redirect: '/404' },
]
// const accessRouter: Array<RouteRecordRaw> = [
//   ...backendRouter,
// ]
// 当前登录人所可见的菜单
function filterRouter(routes: Array<RouteRecordRaw>, roles: Array<String>) {
  const res:Array<RouteRecordRaw> = []
  routes.forEach((route) => {
    const tmp = { ...route }    
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  
  return res
}
function hasPermission(roles: Array<String>, route: any) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    return true
  }
}
// const asyncRoute = filterRouter(routes,['teacher'])
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
})

// 路由前置守卫

router.beforeEach(async (to, form, next) => {

  const system_token = localStorage.getItem('system_token')
  // 是否有token
  if (!system_token) {
    // 是否是白名单
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 有token直接登录
    if (to.path === '/login') {
      next({ path: '/index' })
    }

    next();
  }
})
export default router
