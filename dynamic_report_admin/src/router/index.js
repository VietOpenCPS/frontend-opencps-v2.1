import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/danh-sach-ho-so/:index', name: 'Landing', component: Landing, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
