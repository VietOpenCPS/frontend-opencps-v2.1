import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'

const routerOptions = [
  { path: '/', component: 'Landing', props: false },
  { path: '/tra-cuu-ho-so', component: 'TraCuuHoSo', props: false },
  { path: '/tra-cuu-ho-so/:index', component: 'ChiTietHoSo', props: true },
  { path: '/tra-cuu-thu-tuc', component: 'TraCuuThuTuc', props: false },
  { path: '/tra-cuu-thu-tuc/:index', component: 'ChiTietThuTuc', props: true },
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
