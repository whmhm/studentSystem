// 后台组件
import { RouteRecordRaw } from 'vue-router'
import backEnd from '@/layout/backEnd.vue'
import newsView from '@/views/management/newsView.vue'
import noticeView from '@/views/management/noticeView.vue'
import collageView from '@/views/management/collageView.vue'
import managementView from '@/views/management/index.vue'
import achievementView from '@/views/management/achievement.vue'
import carouselView from '@/views/management/carouselView.vue'
// 后端的路由
const backendRouter:Array<RouteRecordRaw>  = [
  {
    path: '/index',
    component: backEnd,
    meta: {
      roles: ['admin', 'student', 'teacher'],
    },
    children: [
      {
        path: '/management',
        meta: {
          roles: ['admin'],
        },
        name: '',
        component: managementView,
      },
      {
        path: '/person',
        name: '个人中心',
        component: () => import(/* webpackChunkName: "person" */ '../../views/person/index.vue')
      },
      {
        path: '/achievement',
        name: '成绩管理',
        component: achievementView,
      },
      {
        path: '/achievement',
        name: '成绩管理',
        component: achievementView,
      },
      {
        path: '/students',
        name: '学生管理',
        component: () => import(/* webpackChunkName: "studentsView" */ '../../views/management/studentsView.vue')
      },
      // 管理员
      {
        path: '/teachers',
        name: '辅导员管理',
        component: () => import(/* webpackChunkName: "teachersView" */ '../../views/management/teachersView.vue')
      },
      {//资讯
        path: '/news',
        meta: {
          roles: ['student'],
        },
        name: '校园资讯',
        component: newsView,
      },
      {// 公告
        path: '/notice',
        name: '校园公告',
        component: noticeView,
      },
      {// 公告
        path: '/carouselView',
        name: '轮播图管理',
        component: carouselView,
      },
      {// 院系
        path: '/collage',
        name: '院系管理',
        component: collageView,
      },
      {// 登录日志
        path: '/loginLog',
        name: '登录日志',
        component: () => import(/* webpackChunkName: "loginLog" */ '../../views/management/loginLog.vue')
      },
    ]
  },
]
export default backendRouter