import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'LandingRegister',
    component: () => import(/* webpackChunkName: "LandingRegister" */ '@/components/screens/Landing'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/xac-thuc-tai-khoan',
    name: 'XacThucTaiKhoan',
    component: () => import(/* webpackChunkName: "XacThucTaiKhoan" */ '@/components/screens/XacThucTaiKhoan'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/cap-lai-mat-khau',
    name: 'ForgotPassword',
    component: () => import(/* webpackChunkName: "ForgotPassword" */ '@/components/screens/ForgotPassword'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/xac-thuc-cap-lai-mat-khau',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "ConfirmPassword" */ '@/components/screens/ConfirmPassword'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '@/components/screens/Login'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '@/components/screens/Landing'),
    props: true,
    meta: {
      requiresAuth: false
    }
  }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
