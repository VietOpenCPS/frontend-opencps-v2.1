import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/', name: 'Landing', component: Landing, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
