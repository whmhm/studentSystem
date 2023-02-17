import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: {}
  },
  getters: {
    USER_INFO:  function (state) {
      return state.userInfo
    }
  },
  mutations: {

  },
  actions: {
   
  },
  modules: {
  }
})
