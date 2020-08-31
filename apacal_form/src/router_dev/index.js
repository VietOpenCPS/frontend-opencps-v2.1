import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/screens/Landing'

const routes = [
  { path: '/', name: 'Landing', component: Landing, props: true }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
