import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import TiepNhanHoSoDetail from '@/components/TiepNhanHoSoDetail'
import HoanThienBoSungHoSoDetail from '@/components/HoanThienBoSungHoSoDetail'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/danh-sach-ho-so/:index', name: 'Landing', component: Landing, props: true },
  { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode', name: 'TiepNhanHoSoDetail', component: TiepNhanHoSoDetail, props: true },
  { path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id', name: 'HoanThienBoSungHoSoDetail', component: HoanThienBoSungHoSoDetail, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
