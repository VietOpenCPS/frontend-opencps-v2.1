import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import TiepNhanHoSoDetail from '@/components/TiepNhanHoSoDetail'
import XemChiTietHoSoDetailCanBo from '@/components/XemChiTietHoSoDetailCanBo'
import XuLyHoSo from '@/components/XuLyHoSo'
import HoanThienBoSungHoSoDetail from '@/components/HoanThienBoSungHoSoDetail'
import DetailForward from '@/components/DetailForward'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/danh-sach-ho-so/:index', name: 'Landing', component: Landing, props: true },
  { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode', name: 'TiepNhanHoSoDetail', component: TiepNhanHoSoDetail, props: true },
  { path: '/danh-sach-ho-so/:index/chi-tiet-ho-so/:id', name: 'XemChiTietHoSoDetailCanBo', component: XemChiTietHoSoDetailCanBo, props: true },
  { path: '/danh-sach-ho-so/:index/xu-ly-ho-so', name: 'XuLyHoSo', component: XuLyHoSo, props: true },
  { path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id', name: 'HoanThienBoSungHoSoDetail', component: HoanThienBoSungHoSoDetail, props: true },
  { path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode', name: 'DetailForward', component: DetailForward, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
