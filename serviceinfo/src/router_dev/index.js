import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/blacklist/Landing'
import TiepNhanHoSoDetail from '@/components/blacklist/TiepNhanHoSoDetail'
import HoanThienBoSungHoSoDetail from '@/components/blacklist/HoanThienBoSungHoSoDetail'
import DetailForward from '@/components/blacklist/DetailForward'
import NotFound from '@/components/NotFound'
import LandingServiceInfo from '@/components/screens/Landing'
import LandingMobile from '@/components/screens/LandingMobile'
import ChiTietThuTuc from '@/components/screens/ChiTietThuTuc'
import ChiTietThuTucMobile from '@/components/screens/ChiTietThuTucMobile'

const routes = [
  { path: '/thu-tuc-hanh-chinh', name: 'LandingServiceInfo', component: LandingServiceInfo, props: true },
  { path: '/m/thu-tuc-hanh-chinh', name: 'LandingMobile', component: LandingMobile, props: true },
  { path: '/thu-tuc-hanh-chinh/:index', name: 'ChiTietThuTuc', component: ChiTietThuTuc, props: true },
  { path: '/m/thu-tuc-hanh-chinh/:index', name: 'ChiTietThuTucMobile', component: ChiTietThuTucMobile, props: true },
  { path: '/danh-sach-ho-so/:index', name: 'Landing', component: Landing, props: true },
  { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode', name: 'TiepNhanHoSoDetail', component: TiepNhanHoSoDetail, props: true },
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
