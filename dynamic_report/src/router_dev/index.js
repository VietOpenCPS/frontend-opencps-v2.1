import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import DanhSachThuTuc from '@/components/DanhSachThuTuc'
import NopThanhCong from '@/components/NopThanhCong'
import ThanhToanThanhCong from '@/components/ThanhToanThanhCong'
import NotFound from '@/components/NotFound'

const routes = [
  { path: '/danh-sach-ho-so/:index', name: 'Landing', component: Landing, props: true },
  { path: '/add-dvc/:serviceCode', name: 'DanhSachThuTuc', component: DanhSachThuTuc, props: true },
  { path: '/danh-sach-ho-so/:index/nop-thanh-cong/:id', name: 'NopThanhCong', component: NopThanhCong, props: true },
  { path: '/thanh-toan-thanh-cong', name: 'ThanhToanThanhCong', component: ThanhToanThanhCong, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
