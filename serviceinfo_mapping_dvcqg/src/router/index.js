import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
    path: '/thu-tuc-hanh-chinh',
    name: 'LandingServiceInfo',
    component: () => import(/* webpackChunkName: "LandingServiceInfo" */ '@/components/screens/Landing.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/m/thu-tuc-hanh-chinh',
    name: 'LandingMobile',
    component: () => import(/* webpackChunkName: "LandingMobile" */ '@/components/screens/LandingMobile.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/thu-tuc-hanh-chinh/:index',
    name: 'ChiTietThuTuc',
    component: () => import(/* webpackChunkName: "ChiTietThuTuc" */ '@/components/screens/ChiTietThuTuc.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/m/thu-tuc-hanh-chinh/:index',
    name: 'LandingServiceInfo',
    component: () => import(/* webpackChunkName: "ChiTietThuTucMobile" */ '@/components/screens/ChiTietThuTucMobile.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '@/components/NotFound.vue'),
    props: true,
    meta: {
      requiresAuth: false
    }
  }
]

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
