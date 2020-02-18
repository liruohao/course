import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login'

Vue.use(Router)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/home',
    name: 'Home',
    redirect: () => {
      return '/curriculum'
    },
    component: resolve => require(['pages/home'], resolve),
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '/curriculum',
        name: 'Curriculum',
        component: resolve => require(['pages/curriculum'], resolve),
        meta: {
          title: '考研课程'
        }
      },
      {
        path: '/curriculumDetails',
        name: 'CurriculumDetails',
        component: resolve => require(['pages/curriculumDetails'], resolve),
        meta: {
          title: '考研课程'
        }
      },
      {
        path: '/dataDownload',
        name: 'DataDownload',
        component: resolve => require(['pages/dataDownload'], resolve),
        meta: {
          title: '资料下载'
        }
      },
      {
        path: '/allCourses',
        name: 'AllCourses',
        component: resolve => require(['pages/allCourses'], resolve),
        meta: {
          title: '全部课程'
        }
      },
      {
        path: '/keToday',
        name: 'KeToday',
        component: resolve => require(['pages/keToday'], resolve),
        meta: {
          title: '今日课程'
        }
      },
      {
        path: '/allOrders',
        name: 'AllOrders',
        component: resolve => require(['pages/allOrders'], resolve),
        meta: {
          title: '全部订单'
        }
      },
      {
        path: '/newOrder',
        name: 'NewOrder',
        component: resolve => require(['pages/NewOrder'], resolve),
        meta: {
          title: '购买课程'
        }
      },
      {
        path: '/school',
        name: 'School',
        component: resolve => require(['pages/school'], resolve),
        meta: {
          title: '学校'
        }
      },
      {
        path: '/schoolDetails',
        name: 'SchoolDetails',
        component: resolve => require(['pages/SchoolDetails'], resolve),
        meta: {
          title: '学校'
        }
      },
      {
        path: '/personal',
        name: 'Personal',
        component: resolve => require(['pages/personal-info'], resolve),
        meta: {
          title: '个人中心'
        }
      }

    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requireAuth: false,
      title: '登录'
    }
  },
  {
    path: '/home2',
    name: 'Home2',
    redirect: () => {
      return '/user'
    },
    component: resolve => require(['pages/home2'], resolve),
    meta: {
      requireAuth: false,
      title: '首页2（管理端）'
    },
    children: [
      {
        path: '/user',
        name: 'User',
        component: resolve => require(['pages/user'], resolve),
        meta: {
          title: '用户'
        }
      },
      {
        path: '/course',
        name: 'Course',
        component: resolve => require(['pages/course'], resolve),
        meta: {
          title: '班级管理'
        }
      },
      {
        path: '/openClass',
        name: 'OpenClass',
        component: resolve => require(['pages/openClass'], resolve),
        meta: {
          title: '课程管理'
        }
      },
      {
        path: '/userStatistics',
        name: 'UserStatistics',
        component: resolve => require(['pages/userStatistics'], resolve),
        meta: {
          title: '用户统计'
        }
      },
      {
        path: '/salesRecords',
        name: 'SalesRecords',
        component: resolve => require(['pages/salesRecords'], resolve),
        meta: {
          title: '销售统计'
        }
      },
      {
        path: '/Timetable',
        name: 'Timetable',
        component: resolve => require(['pages/Timetable'], resolve),
        meta: {
          title: '课表管理(超级管理员)'
        }
      },
      {
        path: '/personal',
        name: 'Personal',
        component: resolve => require(['pages/personal-info'], resolve),
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/teacher',
    name: 'Teacher',
    redirect: () => {
      return '/teacherHome'
    },
    component: resolve => require(['pages/teacher'], resolve),
    meta: {
      title: '老师首页'
    },
    children: [
      {
        path: '/teacherHome',
        name: 'TeacherHome',
        component: resolve => require(['pages/teacher/teacherHome'], resolve),
        meta: {
          title: '老师首页'
        }
      },
      {
        path: '/newTimetable',
        name: 'NewTimetable',
        component: resolve => require(['pages/newTimetable'], resolve),
        meta: {
          title: '课表管理(老师)'
        }
      },
      {
        path: '/personal',
        name: 'Personal',
        component: resolve => require(['pages/personal-info'], resolve),
        meta: {
          title: '个人中心'
        }
      }
    ]
  }
]
const router = new Router({
  routes
})
export default router
