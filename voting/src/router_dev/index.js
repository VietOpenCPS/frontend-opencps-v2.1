import Vue from 'vue'
import Router from 'vue-router'
import DetailForward from '@/components/blacklist/DetailForward'
import NotFound from '@/components/NotFound'
import LandingVoting from '@/components/screens/Landing'
import Employees from '@/components/screens/Employees'
import EmployeeDetail from '@/components/screens/EmployeeDetail'

const routes = [
  { path: '/', component: LandingVoting, props: true },
  { path: '/danh-gia-can-bo/:itemCode', component: Employees, props: true },
  { path: '/danh-sach-can-bo/:itemCode/:id', component: EmployeeDetail, props: true },
  {
    path: '/danh-sach-ho-so/:index',
    name: 'Landing',
    component: () => import('@/components/blacklist/Landing.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode',
    name: 'TiepNhanHoSoDetail',
    component: () => import('@/components/blacklist/TiepNhanHoSoDetail.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id',
    name: 'HoanThienBoSungHoSoDetail',
    component: () => import('@/components/blacklist/HoanThienBoSungHoSoDetail.vue'),
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
