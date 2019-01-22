import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import LandingVoting from '@/components/screens/Landing'
import Employees from '@/components/screens/Employees'
import EmployeeDetail from '@/components/screens/EmployeeDetail'

const routes = [
  { path: '/', component: LandingVoting, props: true },
  { path: '/danh-sach-can-bo/:itemCode', component: Employees, props: true },
  { path: '/danh-sach-can-bo/:itemCode/:id', component: EmployeeDetail, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
