// import Vue from 'vue'
// import Router from 'vue-router'
// import NotFound from '@/components/NotFound'
// import LandingReportCharts from '@/components/screens/Landing'

// const routes = [
//   { path: '/bao-cao/:index', component: LandingReportCharts, props: true },
//   { path: '*', name: 'NotFound', component: NotFound }
// ]

// Vue.use(Router)

// const router = new Router({
//   routes
// })

// export default router



import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/components/NotFound'
import LandingReportCharts from '@/components/screens/Landing'
import LandingDanhGia from '@/components/screens/ThongKeDanhGiaHoSo'
import ThongKeDanhGiaHaiLong from '@/components/screens/ThongKeDanhGiaHaiLong'
import ThongKeChiSoDanhGia from '@/components/screens/ThongKeChiSoDanhGia'
import ThongKeDanhGiaCanBo from '@/components/screens/ThongKeDanhGiaCanBo'
import ThongKeTinhHinhGiaiQuyet from '@/components/screens/ThongKeTinhHinhGiaiQuyet'
const routes = [
  { path: '/bao-cao/:index', component: LandingReportCharts, props: true },
  { path: '/danh-gia-thu-tuc', component: LandingDanhGia, props: true },
  { path: '/danh-gia-hai-long', component: ThongKeDanhGiaHaiLong, props: true },
  { path: '/chi-so-danh-gia', component: ThongKeChiSoDanhGia, props: true },
  { path: '/danh-gia-can-bo', component: ThongKeDanhGiaCanBo, props: true },
  { path: '/tinh-hinh-giai-quyet', component: ThongKeTinhHinhGiaiQuyet, props: true },
  { path: '*', name: 'NotFound', component: NotFound }
]

Vue.use(Router)

const router = new Router({
  routes
})

export default router

