
import router from "@/router";
import store from './store'
const whiteList = ['/login', '/',]
// 当前登录人所可见的菜单

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
    if (store.getters.permissionRoutes.length) {
      next()
    } else {
      const userInfo = JSON.parse(localStorage.getItem('info') || '')
      const accessRouter = await store.dispatch('generateRoutes', [userInfo.position])
      accessRouter.forEach((e: any) => {
        router.addRoute(e)
      })
      router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404' })
      next({ ...to, replace: true })
    }
  }
})