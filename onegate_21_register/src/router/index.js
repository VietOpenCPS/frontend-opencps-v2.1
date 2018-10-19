import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import XacThucTaiKhoan from '@/components/XacThucTaiKhoan'
import ForgotPassword from '@/components/ForgotPassword'
import ConfirmPassword from '@/components/ConfirmPassword'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/', name: 'Landing', component: Landing, props: false },
  { path: '/xac-thuc-tai-khoan', name: 'XacThucTaiKhoan', component: XacThucTaiKhoan },
  { path: '/cap-lai-mat-khau', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/xac-thuc-cap-lai-mat-khau', name: 'ConfirmPassword', component: ConfirmPassword },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
