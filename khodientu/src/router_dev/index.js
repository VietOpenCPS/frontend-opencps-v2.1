import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import Landing from '@/components/screens/Landing'
import SoHoaGiayTo from '@/components/screens/SoHoaGiayTo'
import KhoTaiLieu from '@/components/screens/KhoTaiLieu'
import DanhMucGiayTo from '@/components/screens/DanhMucGiayTo'
import DuLieuCongDan from '@/components/screens/DuLieuCongDan'
import BaoCao from '@/components/screens/BaoCao'
import DetailForward from '@/components/blacklist/DetailForward'
const routes = [
  { path: '/', name: 'SoHoaGiayTo', component: SoHoaGiayTo, props: true },
  { path: '/kho-tai-lieu', name: 'KhoTaiLieu', component: KhoTaiLieu, props: true},
  { path: '/danh-muc-giay-to', name: 'DanhMucGiayTo', component: DanhMucGiayTo, props: true},
  { path: '/du-lieu-cong-dan', name: 'DuLieuCongDan', component: DuLieuCongDan, props: true},
  { path: '/bao-cao', name: 'BaoCao', component: BaoCao, props: true},
  {
    path: '/danh-sach-ho-so/:index',
    name: 'Landing',
    component: () => import(/* webpackChunkName: "Landing" */ '@/components/blacklist/Landing.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode',
    name: 'TiepNhanHoSoDetail',
    component: () => import(/* webpackChunkName: "TiepNhanHoSoDetail" */ '@/components/blacklist/TiepNhanHoSoDetail.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id',
    name: 'HoanThienBoSungHoSoDetail',
    component: () => import(/* webpackChunkName: "HoanThienBoSungHoSoDetail" */ '@/components/blacklist/HoanThienBoSungHoSoDetail.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  { path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode', name: 'DetailForward', component: DetailForward, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
