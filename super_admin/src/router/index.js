import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import TableEditor from '@/components/screens/TableEditor'
import TableEditorForm from '@/components/screens/TableEditorForm.vue'
import QuyTrinhThuTuc from '@/components/extform/QuyTrinhThuTuc.vue'
import ThamSoHeThong from '@/components/extform/ThamSoHeThong.vue'
import Voting from '@/components/extform/Voting.vue'
import Import from '@/components/screens/import.vue'
import Export from '@/components/screens/export.vue'
import FlowChartView from '@/components/screens/FlowChartView.vue'
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
        component: TableEditorForm,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/opencps_serviceprocess/ext/editor/:id',
        name: 'QuyTrinhThuTuc',
        component: QuyTrinhThuTuc,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/opencps_certnumbers/certnumbers',
        name: 'ThamSoHeThong',
        component: ThamSoHeThong,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/opencps_voting/votings',
        name: 'Voting',
        component: Voting,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/:tableName/tool_import',
        name: 'Import',
        component: Import,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/:tableName/tool_export',
        name: 'Export',
        component: Export,
        props: true,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/table/:tableName/flowchart/:id',
        name: 'FlowChartView',
        component: FlowChartView,
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
