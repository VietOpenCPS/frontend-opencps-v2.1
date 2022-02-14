import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import DanhSachNguoiDung from '@/components/screens/Landing'
import QuanLyGiayTo from '@/components/screens/QuanLyGiayTo'
import ChiTietCongDan from '@/components/screens/ChiTietCongDan'
import ChinhSuaCongDan from '@/components/screens/EditCongDan'
import ChiTietDoanhNghiep from '@/components/screens/ChiTietDoanhNghiep'
import ChinhSuaDoanhNghiep from '@/components/screens/EditDoanhNghiep'
import DetailForward from '@/components/blacklist/DetailForward'
const routes = [
  { path: '/', name: 'DanhSachNguoiDung', component: DanhSachNguoiDung, props: true },
  { path: '/:index/quan-ly-giay-to', name: 'QuanLyGiayTo', component: QuanLyGiayTo, props: true },
  {
    path: '/thong-tin-ca-nhan/:id',
    name: 'ChiTietCongDan',
    component: ChiTietCongDan,
    props: true
  },
  {
    path: '/thong-tin-doanh-nghiep/:id',
    name: 'ChiTietDoanhNghiep',
    component: ChiTietDoanhNghiep,
    props: true
  },
  {
    path: '/cong-dan/:id',
    name: 'ChinhSuaCongDan',
    component: ChinhSuaCongDan,
    props: true
  },
  {
    path: '/doanh-nghiep/:id',
    name: 'ChinhSuaDoanhNghiep',
    component: ChinhSuaDoanhNghiep,
    props: true
  },
  // {
  //   path: '/danh-sach-ho-so/:index',
  //   name: 'Landing',
  //   component: () => import(/* webpackChunkName: "Landing" */ '@/components/blacklist/Landing.vue'),
  //   props: true,
  //   meta: {
  //     requiresAuth: false
  //   }
  // },
  // {
  //   path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode',
  //   name: 'TiepNhanHoSoDetail',
  //   component: () => import(/* webpackChunkName: "TiepNhanHoSoDetail" */ '@/components/blacklist/TiepNhanHoSoDetail.vue'),
  //   props: true,
  //   meta: {
  //     requiresAuth: false
  //   }
  // },
  // {
  //   path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id',
  //   name: 'HoanThienBoSungHoSoDetail',
  //   component: () => import(/* webpackChunkName: "HoanThienBoSungHoSoDetail" */ '@/components/blacklist/HoanThienBoSungHoSoDetail.vue'),
  //   props: true,
  //   meta: {
  //     requiresAuth: false
  //   }
  // },
  // { path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode', name: 'DetailForward', component: DetailForward, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
