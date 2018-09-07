import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'

const routerOptions = [
  { path: '/', component: 'Landing', props: false },
  { path: '/tra-cuu-ho-so', component: 'TraCuuHoSo', props: false },
  { path: '/ho-so/:index', component: 'ChiTietHoSo', props: true },
  { path: '/tra-cuu-thu-tuc', component: 'TraCuuThuTuc', props: false },
  { path: '/tra-cuu-thu-tuc/:index', component: 'ChiTietThuTuc', props: true },
  { path: '/danh-gia-can-bo', component: 'DanhGiaCanBo', props: false },
  { path: '/danh-gia-cldv', component: 'DanhGiaChatLuongDichVu', props: false },
  { path: '/ho-so-co-ket-qua', component: 'HoSoKetQua', props: false },
  { path: '/ma-truy-cap', component: 'CheckPassword', props: false }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes
})

export default router
