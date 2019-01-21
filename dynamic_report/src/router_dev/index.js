import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
