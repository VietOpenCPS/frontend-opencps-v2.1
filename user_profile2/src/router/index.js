import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && 1 === 0) {
    next('/login')
  } else {
    next()
  }
})

export default router
