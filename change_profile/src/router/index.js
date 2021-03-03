import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'LandingUserProfile',
    component: () => import(/* webpackChunkName: "LandingUserProfile" */ '@/components/screens/Landing.vue'),
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
