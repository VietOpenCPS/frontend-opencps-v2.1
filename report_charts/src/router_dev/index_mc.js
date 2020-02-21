import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import LandingReportCharts from '@/components/screens/Landing_Motcua'
import LandingDanhGia from '@/components/screens/ThongKeDanhGia'
import LandingVoting from '@/components/screens/ThongKeVoting'

const routes = [
  { path: '/bao-cao/:index', component: LandingReportCharts, props: true },
  { path: '/danh-gia-thu-tuc', component: LandingDanhGia, props: true },
  { path: '/danh-gia-can-bo', component: LandingVoting, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
