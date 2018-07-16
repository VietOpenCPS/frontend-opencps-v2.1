import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  { path: '/danh-sach-ho-so/:index', component: 'Landing', props: true },
  { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id', component: 'TiepNhanHoSo', props: true },
  { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/phieu-hen', component: 'PhieuHen', props: true },
  { path: '*', component: 'NotFound' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
