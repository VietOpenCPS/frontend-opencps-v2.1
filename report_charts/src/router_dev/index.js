import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
// import LandingReportCharts from '@/components/screens/Landing_DVC'
import LandingReportCharts from '@/components/screens/Landing'
import LandingDanhGia from '@/components/screens/ThongKeDanhGiaHoSo'
import ThongKeDanhGiaHaiLong from '@/components/screens/ThongKeDanhGiaHaiLong'
import ThongKeChiSoDanhGia from '@/components/screens/ThongKeChiSoDanhGia'
import ThongKeDanhGiaCanBo from '@/components/screens/ThongKeDanhGiaCanBo'
import ThongKeTinhHinhGiaiQuyet from '@/components/screens/ThongKeTinhHinhGiaiQuyet'

import DetailForward from '@/components/blacklist/DetailForward'
const routes = [
  { path: '/bao-cao/:index', component: LandingReportCharts, props: true },
  { path: '/danh-gia-thu-tuc', component: LandingDanhGia, props: true },
  { path: '/danh-gia-hai-long', component: ThongKeDanhGiaHaiLong, props: true },
  { path: '/chi-so-danh-gia', component: ThongKeChiSoDanhGia, props: true },
  { path: '/danh-gia-can-bo', component: ThongKeDanhGiaCanBo, props: true },
  { path: '/tinh-hinh-giai-quyet', component: ThongKeTinhHinhGiaiQuyet, props: true },
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
