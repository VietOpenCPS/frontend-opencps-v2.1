import Vue from 'vue'
import Router from 'vue-router'
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
  { path: '*', name: 'NotFound', component: NotFound }
  // {
  //   path: '/thu-tuc-hanh-chinh',
  //   name: 'Landing',
  //   component: () => import('@/components/screens/Landing.vue'),
  //   props: true
  // },
  // {
  //   path: '/m/thu-tuc-hanh-chinh',
  //   name: 'LandingMobile',
  //   component: () => import('@/components/screens/LandingMobile.vue'),
  //   props: true
  // },
  // {
  //   path: '/thu-tuc-hanh-chinh/:index',
  //   name: 'ChiTietThuTuc',
  //   component: () => import('@/components/screens/ChiTietThuTuc.vue'),
  //   props: true
  // },
  // {
  //   path: '/m/thu-tuc-hanh-chinh/:index',
  //   name: 'ChiTietThuTucMobile',
  //   component: () => import('@/components/screens/ChiTietThuTucMobile.vue'),
  //   props: true
  // },
  // {
  //   path: '*',
  //   name: 'NotFound',
  //   component: () => import('@/components/screens/Landing.vue'),
  //   props: true
  // }

]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
