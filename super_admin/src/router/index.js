import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import TableEditor from '@/components/screens/TableEditor'

const routes = [
  {
    path: '/table/:tableName',
    name: 'Home',
    component: Home,
    props: true,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/table/:tableName',
        name: 'TableEditor',
        component: TableEditor,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/:tableName/editor/:id',
        name: 'TableEditorForm',
        component: () => import(/* webpackChunkName: "Home" */ '@/components/screens/TableEditorForm.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/opencps_serviceprocess/ext/editor/:id',
        name: 'QuyTrinhThuTuc',
        component: () => import(/* webpackChunkName: "Home" */ '@/components/extform/QuyTrinhThuTuc.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/opencps_certnumbers/ext/editor/:id',
        name: 'ThamSoHeThong',
        component: () => import(/* webpackChunkName: "Home" */ '@/components/extform/ThamSoHeThong.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/:tableName/tool_import',
        name: 'Import',
        component: () => import(/* webpackChunkName: "Home" */ '@/components/screens/import.vue'),
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/:tableName/flowchart/:id',
        name: 'FlowChartView',
        component: () => import(/* webpackChunkName: "Home" */ '@/components/screens/FlowChartView.vue'),
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
