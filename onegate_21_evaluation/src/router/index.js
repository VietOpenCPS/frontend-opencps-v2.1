import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'

const routerOptions = [
  { path: '/danh-gia-can-bo/:index', component: 'Landing', props: true },
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
