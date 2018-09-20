import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import ChiTietThuTuc from '@/components/ChiTietThuTuc'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/thu-tuc-hanh-chinh', name: 'Landing', component: Landing, props: true },
  { path: '/thu-tuc-hanh-chinh/:index', name: 'ChiTietThuTuc', component: ChiTietThuTuc, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
