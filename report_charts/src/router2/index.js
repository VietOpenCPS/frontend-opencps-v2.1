import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import Landing from '@/components/screens/Landing'

const routes = [
  {
    path: '/bao-cao/:index',
    name: 'Home',
    component: Home,
    props: true,
    children: [
      {
        path: '/bao-cao/:index',
        name: 'Landing',
        component: Landing,
        // component: () => import(/* webpackChunkName: "Home" */ '@/components/screens/DeliverableList.vue'),
        props: true,
      }
    ]
  },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
