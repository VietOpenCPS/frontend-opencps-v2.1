import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'LandingVoting',
    component: () => import(/* webpackChunkName: "LandingVoting" */ '@/components/screens/Landing.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
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
