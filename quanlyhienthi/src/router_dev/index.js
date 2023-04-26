import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import LandingApp from '@/components/screens/LandingTraCuuHoSo'
import LandingThongKeDanhGia from '@/components/screens/LandingThongKeDanhGia'
import DanhSachThuTuc from '@/components/screens/DanhSachThuTuc'
import DetailForward from '@/components/blacklist/DetailForward'
const routes = [
  { path: '/', name: 'DanhSachThuTuc', component: DanhSachThuTuc, props: true },
  // { path: '/', name: 'LandingApp', component: LandingApp, props: true },
  // { path: '/thong-ke-danh-gia', name: 'LandingThongKeDanhGia', component: LandingThongKeDanhGia, props: true },
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
