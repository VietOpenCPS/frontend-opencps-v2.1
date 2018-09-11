import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Employees from '@/components/Employees'
import EmployeeDetail from '@/components/EmployeeDetail'
import Captcha from '@/components/Captcha'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/', component: Landing, props: true },
  { path: '/danh-sach-can-bo/:itemCode', component: Employees, props: true },
  { path: '/danh-sach-can-bo/:itemCode/:id', component: EmployeeDetail, props: true },
  { path: '*', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
