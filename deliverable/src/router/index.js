import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import DeliverableList from '@/components/screens/DeliverableList'
import DeliverableEditor from '@/components/screens/DeliverableEditor'

const routes = [
  {
    path: '/danh-sach-giay-to/:index',
    name: 'Home',
    component: Home,
    props: true,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/danh-sach-giay-to/:index',
        name: 'DeliverableList',
        component: DeliverableList,
        // component: () => import(/* webpackChunkName: "Home" */ '@/components/screens/DeliverableList.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/danh-sach-giay-to/:index/editor/:id',
        name: 'DeliverableEditor',
        component: DeliverableEditor,
        // component: () => import(/* webpackChunkName: "Home" */ '@/components/screens/DeliverableList.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
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

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && 1 === 0) {
    next('/login')
  } else {
    next()
  }
})

export default router
