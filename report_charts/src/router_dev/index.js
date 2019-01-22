import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import LandingReportCharts from '@/components/screens/Landing'

const routes = [
  { path: '/bao-cao/:index', component: LandingReportCharts, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
