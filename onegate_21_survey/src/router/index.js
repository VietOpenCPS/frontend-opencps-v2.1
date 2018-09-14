import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Employees from '@/components/Employees'
import EmployeeDetail from '@/components/EmployeeDetail'
import Captcha from '@/components/Captcha'

const routes = [
  { path: '/', component: Landing, props: true }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
