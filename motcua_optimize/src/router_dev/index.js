import Vue from 'vue'
import Router from 'vue-router'
// import Landing from '@/components/Landing'
// import LandingMobile from '@/components/LandingMobile'
// import TraCuuHoSo from '@/components/TraCuuHoSo'
// import TiepNhanHoSoDetail from '@/components/TiepNhanHoSoDetail'
// import TiepNhanNhomHoSo from '@/components/TiepNhanHoSoTheoNhom'
// import XemChiTietHoSoDetailCanBo from '@/components/XemChiTietHoSoDetailCanBo'
// import XuLyHoSo from '@/components/XuLyHoSo'
// import HoanThienBoSungHoSoDetail from '@/components/HoanThienBoSungHoSoDetail'
// import DetailForward from '@/components/DetailForward'
// import DanhSachThuTuc from '@/components/DanhSachThuTuc'
// import NopThanhCong from '@/components/NopThanhCong'
// import ThanhToanThanhCong from '@/components/ThanhToanThanhCong'
// import NotFound from '@/components/NotFound'
// import ImportHoSo from '@/components/ImportHoSo.vue'

const routes = [
  // { path: '/danh-sach-ho-so/:index', name: 'Landing', component: Landing, props: true },
  // { path: '/m/danh-sach-ho-so/:index', name: 'LandingMobile', component: LandingMobile, props: true },
  // { path: '/tra-cuu-ho-so', name: 'TraCuuHoSo', component: TraCuuHoSo, props: true },
  // { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode', name: 'TiepNhanHoSoDetail', component: TiepNhanHoSoDetail, props: true },
  // { path: '/danh-sach-ho-so/:index/nhom-ho-so/:id', name: 'TiepNhanNhomHoSo', component: TiepNhanNhomHoSo, props: true },
  // { path: '/danh-sach-ho-so/:index/chi-tiet-ho-so/:id', name: 'XemChiTietHoSoDetailCanBo', component: XemChiTietHoSoDetailCanBo, props: true },
  // { path: '/danh-sach-ho-so/:index/xu-ly-ho-so', name: 'XuLyHoSo', component: XuLyHoSo, props: true },
  // { path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id', name: 'HoanThienBoSungHoSoDetail', component: HoanThienBoSungHoSoDetail, props: true },
  // { path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode', name: 'DetailForward', component: DetailForward, props: true },
  // { path: '/add-dvc/:serviceCode', name: 'DanhSachThuTuc', component: DanhSachThuTuc, props: true },
  // { path: '/danh-sach-ho-so/:index/nop-thanh-cong/:id', name: 'NopThanhCong', component: NopThanhCong, props: true },
  // { path: '/thanh-toan-thanh-cong', name: 'ThanhToanThanhCong', component: ThanhToanThanhCong, props: true },
  // { path: '/import-ho-so/:id', name: 'ImportHoSo', component: ImportHoSo, props: true},
  // { path: '*', name: 'NotFound', component: NotFound }

  //
  {
    path: '/danh-sach-ho-so/:index',
    name: 'Landing',
    component: () => import('@/components/Landing.vue'),
    props: true
  },
  {
    path: '/m/danh-sach-ho-so/:index',
    name: 'LandingMobile',
    component: () => import('@/components/LandingMobile.vue'),
    props: true
  },
  {
    path: '/tra-cuu-ho-so',
    name: 'TraCuuHoSo',
    component: () => import('@/components/TraCuuHoSo.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode',
    name: 'TiepNhanHoSoDetail',
    component: () => import('@/components/TiepNhanHoSoDetail.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/nhom-ho-so/:id',
    name: 'TiepNhanNhomHoSo',
    component: () => import('@/components/TiepNhanHoSoTheoNhom.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/chi-tiet-ho-so/:id',
    name: 'XemChiTietHoSoDetailCanBo',
    component: () => import('@/components/XemChiTietHoSoDetailCanBo.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/xu-ly-ho-so',
    name: 'XuLyHoSo',
    component: () => import('@/components/XuLyHoSo.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id',
    name: 'HoanThienBoSungHoSoDetail',
    component: () => import('@/components/HoanThienBoSungHoSoDetail.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode',
    name: 'DetailForward',
    component: () => import('@/components/DetailForward.vue'),
    props: true
  },
  {
    path: '/add-dvc/:serviceCode',
    name: 'DanhSachThuTuc',
    component: () => import('@/components/DanhSachThuTuc.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/nop-thanh-cong/:id',
    name: 'NopThanhCong',
    component: () => import('@/components/NopThanhCong.vue'),
    props: true
  },
  {
    path: '/thanh-toan-thanh-cong',
    name: 'ThanhToanThanhCong',
    component: () => import('@/components/ThanhToanThanhCong.vue'),
    props: true
  },
  {
    path: '/import-ho-so/:id',
    name: 'ImportHoSo',
    component: () => import('@/components/ImportHoSo.vue'),
    props: true
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/components/NotFound.vue'),
    props: true
  }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
