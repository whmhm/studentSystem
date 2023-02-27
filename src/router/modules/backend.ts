// 后台组件
import { RouteRecordRaw } from 'vue-router'
import backEnd from '@/layout/backEnd.vue'
import newsView from '@/views/management/newsView.vue'
import noticeView from '@/views/management/noticeView.vue'
import collageView from '@/views/management/collageView.vue'
import managementView from '@/views/management/index.vue'
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
        name: '综合成绩管理',
        children: [
          {
            path: '/achievement',
            name: '学科成绩',
            component: () => import(/* webpackChunkName: "achievement" */ '../../views/management/achievement.vue'),
          },
          {
            path: '/competition',
            name: '参加竞赛',
            component: () => import(/* webpackChunkName: "competition" */ '../../views/management/competition.vue'),
          },
          {
            path: '/honor',
            name: '表彰荣誉',
            component: () => import(/* webpackChunkName: "honor" */ '../../views/management/honor.vue'),
          },
          {
            path: '/paper',
            name: '出版或发表论文',
            component: () => import(/* webpackChunkName: "paper" */ '../../views/management/paper.vue'),
          },
          {
            path: '/scholarship',
            name: '奖学金',
            component: () => import(/* webpackChunkName: "scholarship" */ '../../views/management/scholarship.vue'),
          },
          {
            path: '/helpGood',
            name: '助人为乐',
            component: () => import(/* webpackChunkName: "helpGood" */ '../../views/management/helpGood.vue'),
          },

          {
            path: '/invention',
            name: '专利',
            component: () => import(/* webpackChunkName: "invention" */ '../../views/management/invention.vue'),
          },
          {
            path: '/violation',
            name: '违规违纪',
            component: () => import(/* webpackChunkName: "violation" */ '../../views/management/violation.vue'),
          },
          {
            path: '/comprehensive',
            name: '综合素质测评',
            component: () => import(/* webpackChunkName: "comprehensive" */ '../../views/management/comprehensive.vue'),
          },
        ]
      },
      {
        path: '',
        name: '人员管理',
        children: [
          {
            path: '/classCadrePost',
            name: '班干部任职',
            meta: {
              roles: ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
            },
            component: () => import(/* webpackChunkName: "classCadrePost" */ '../../views/management/classCadrePost.vue')
          },
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