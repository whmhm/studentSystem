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
const backendRouter: Array<RouteRecordRaw> = [
  {
    path: '/index',
    name: 'index',
    component: backEnd,
    children: [
      {
        path: '/index',
        name: '首页',
        component: managementView,
      },
      {
        path: '/person',
        name: '账户管理',
        children: [
          {
            path: '/person',
            name: '个人中心',
            component: () => import(/* webpackChunkName: "person" */ '../../views/person/index.vue')
          }
        ]
      },
      {
        path: '',
        name: '成绩管理',
        children: [
          {
            path: '/achievement',
            name: '成绩管理',
            component: achievementView,
          }
        ]
      },
      {
        path: '',
        name: '人员管理',
        meta: {
          roles: ['ADMIN', 'INSTRUCTOR'],
        },
        children: [
          {
            path: '/students',
            name: '学生管理',
            meta: {
              roles: ['ADMIN', 'INSTRUCTOR'],
            },
            component: () => import(/* webpackChunkName: "studentsView" */ '../../views/management/studentsView.vue')
          },
          // 管理员
          {
            path: '/teachers',
            name: '辅导员管理',
            meta: {
              roles: ['ADMIN'],
            },
            component: () => import(/* webpackChunkName: "teachersView" */ '../../views/management/teachersView.vue')
          },
        ]
      },
      {
        path: '',
        name: '系统管理',
        meta: {
          roles: ['ADMIN'],
        },
        children: [
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
          {// 轮播图管理
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
  },
]
export default backendRouter