import Vue from 'vue'
import Router from 'vue-router'
import DetailForward from '@/components/blacklist/DetailForward'
import NotFound from '@/components/NotFound'
import DanhSachChoTiepNhan from '@/components/screens/DanhSachChoTiepNhan'
import DieuHanhXepHang from '@/components/screens/DieuHanhXepHang'
import GoiSo from '@/components/screens/GoiSo'
import LaySoTuDong from '@/components/screens/LaySoTuDong'
import Landing from '@/components/screens/Landing'
const routes = [
  { path: '/', name: 'Landing', component: Landing, props: true },
  { path: '/danh-sach-cho-tiep-nhan', name: 'DanhSachChoTiepNhan', component: DanhSachChoTiepNhan, props: true },
  { path: '/dieu-hanh-xep-hang', name: 'DieuHanhXepHang', component: DieuHanhXepHang, props: true },
  { path: '/so-dang-goi', name: 'GoiSo', component: GoiSo, props: true },
  { path: '/lay-so-tu-dong', name: 'LaySoTuDong', component: LaySoTuDong, props: true },
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
