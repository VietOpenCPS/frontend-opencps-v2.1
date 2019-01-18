import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'

const routes = [
  {
    path: '/danh-sach-ho-so/:index',
    name: 'Landing',
    component: () => import(/* webpackChunkName: "Landing" */ '@/components/Landing.vue'),
    props: true
  },
  {
    path: '/m/danh-sach-ho-so/:index',
    name: 'LandingMobile',
    component: () => import(/* webpackChunkName: "LandingMobile" */ '@/components/LandingMobile.vue'),
    props: true
  },
  {
    path: '/tra-cuu-ho-so',
    name: 'TraCuuHoSo',
    component: () => import(/* webpackChunkName: "TraCuuHoSo" */ '@/components/TraCuuHoSo.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode',
    name: 'TiepNhanHoSoDetail',
    component: () => import(/* webpackChunkName: "TiepNhanHoSoDetail" */ '@/components/TiepNhanHoSoDetail.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/chi-tiet-ho-so/:id',
    name: 'XemChiTietHoSoDetailCanBo',
    component: () => import(/* webpackChunkName: "XemChiTietHoSoDetailCanBo" */ '@/components/XemChiTietHoSoDetailCanBo.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/xu-ly-ho-so',
    name: 'XuLyHoSo',
    component: () => import(/* webpackChunkName: "XuLyHoSo" */ '@/components/XuLyHoSo.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id',
    name: 'HoanThienBoSungHoSoDetail',
    component: () => import(/* webpackChunkName: "HoanThienBoSungHoSoDetail" */ '@/components/HoanThienBoSungHoSoDetail.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode',
    name: 'DetailForward',
    component: () => import(/* webpackChunkName: "DetailForward" */ '@/components/DetailForward.vue'),
    props: true
  },
  {
    path: '/add-dvc/:serviceCode',
    name: 'DanhSachThuTuc',
    component: () => import(/* webpackChunkName: "DanhSachThuTuc" */ '@/components/DanhSachThuTuc.vue'),
    props: true
  },
  {
    path: '/danh-sach-ho-so/:index/nop-thanh-cong/:id',
    name: 'NopThanhCong',
    component: () => import(/* webpackChunkName: "NopThanhCong" */ '@/components/NopThanhCong.vue'),
    props: true
  },
  {
    path: '/thanh-toan-thanh-cong',
    name: 'ThanhToanThanhCong',
    component: () => import(/* webpackChunkName: "ThanhToanThanhCong" */ '@/components/ThanhToanThanhCong.vue'),
    props: true
  },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
