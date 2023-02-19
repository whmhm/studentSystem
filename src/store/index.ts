import { createStore } from 'vuex'
import { asyncRouter, constantRoutes } from "@/router";
import { filterRouter } from "@/contents/utils";

export default createStore({
  state: {
    permissionRoutes: [] as any,
    routes: [] as any,
  },
  getters: {
    permissionRoutes: state => state.permissionRoutes,
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.permissionRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
  },
  actions: {
    generateRoutes({ commit }, roles) {
      return new Promise((resolve) => {
        let accessedRoutes
        if (roles.includes('ADMIN')) {
          accessedRoutes = asyncRouter || []
        } else {
          accessedRoutes = filterRouter(asyncRouter, roles)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    },
  },
  modules: {
  }
})
