import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import NotFound from '@/components/NotFound'
import LandingLinePublic from '@/components/LandingLinePublic'
import LandingPiePublic from '@/components/LandingPiePublic'

const routes = [
  { path: '/bao-cao/:index', name: 'Landing', component: Landing, props: true },
  { path: '/report/bar/:year/:month/:agency/:domain', name: 'LandingLinePublic', component: LandingLinePublic, props: true },
  { path: '/report/pie/:year/:month/:agency/:domain', name: 'LandingPiePublic', component: LandingPiePublic, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
