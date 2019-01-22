import Vue from 'vue'
import Router from 'vue-router'
import LandingUserProfile from '@/components/screens/Landing'

const routes = [
  { path: '/', component: LandingUserProfile, props: true },
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
