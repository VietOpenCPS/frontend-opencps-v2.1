import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'

const routes = [
  { path: '/', name: 'Landing', component: Landing, props: false }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
