import Vue from 'vue'
import Router from 'vue-router'
import LandingVoting from '@/components/screens/Landing'

const routes = [
  { path: '/', component: LandingVoting, props: true },
  {
    path: '/danh-sach-can-bo/:itemCode',
    name: 'Employees',
    component: () => import(/* webpackChunkName: "Employees" */ '@/components/screens/Employees.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-can-bo/:itemCode/:id',
    name: 'EmployeeDetail',
    component: () => import(/* webpackChunkName: "EmployeeDetail" */ '@/components/screens/EmployeeDetail.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '@/components/NotFound.vue'),
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
