import Vue from 'vue'
import Router from 'vue-router'
import DetailForward from '@/components/blacklist/DetailForward'
import NotFound from '@/components/NotFound'
import LandingRegister from '@/components/screens/Landing'
import XacThucTaiKhoan from '@/components/screens/XacThucTaiKhoan'
import ForgotPassword from '@/components/screens/ForgotPassword'
import ConfirmPassword from '@/components/screens/ConfirmPassword'
import Login from '@/components/screens/Login'
import LoginMotCua from '@/components/screens/LoginMotCua'
import LoginDichVuCong from '@/components/screens/LoginDichVuCong'
const routes = [
  { path: '/', name: 'LoginMotCua', component: LoginMotCua, props: false },
  { path: '/xac-thuc-tai-khoan', name: 'XacThucTaiKhoan', component: XacThucTaiKhoan },
  { path: '/cap-lai-mat-khau', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/xac-thuc-cap-lai-mat-khau', name: 'ConfirmPassword', component: ConfirmPassword },
  { path: '/login', name: 'Login', component: Login },
  { path: '/login-motcua', name: 'LoginMotCua', component: LoginMotCua },
  { path: '/login-dvc', name: 'LoginDichVuCong', component: LoginDichVuCong },
  {
    path: '/danh-sach-ho-so/:index',
    name: 'Landing',
    component: () => import(/* webpackChunkName: "Landing" */ '@/components/blacklist/Landing.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode',
    name: 'TiepNhanHoSoDetail',
    component: () => import(/* webpackChunkName: "TiepNhanHoSoDetail" */ '@/components/blacklist/TiepNhanHoSoDetail.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id',
    name: 'HoanThienBoSungHoSoDetail',
    component: () => import(/* webpackChunkName: "HoanThienBoSungHoSoDetail" */ '@/components/blacklist/HoanThienBoSungHoSoDetail.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  { path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode', name: 'DetailForward', component: DetailForward, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
