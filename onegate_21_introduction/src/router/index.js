import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import DanhSachCanBo from '@/components/DanhSachCanBo'

const routes = [
  { path: '/', name: 'DanhSachCanBo', component: DanhSachCanBo, props: false }
]

Vue.use(Router)

const router = new Router({
  routes
})

export default router
