import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import LandingRegister from '@/components/screens/Landing'
import XacThucTaiKhoan from '@/components/screens/XacThucTaiKhoan'
import ForgotPassword from '@/components/screens/ForgotPassword'
import ConfirmPassword from '@/components/screens/ConfirmPassword'
import Login from '@/components/screens/Login'

const routes = [
  { path: '/', name: 'LandingRegister', component: LandingRegister, props: false },
  { path: '/xac-thuc-tai-khoan', name: 'XacThucTaiKhoan', component: XacThucTaiKhoan },
  { path: '/cap-lai-mat-khau', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/xac-thuc-cap-lai-mat-khau', name: 'ConfirmPassword', component: ConfirmPassword },
  { path: '/login', name: 'Login', component: Login },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
