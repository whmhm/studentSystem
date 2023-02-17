const loginRouter = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../../views/login/index.vue')
  },
]
export default loginRouter