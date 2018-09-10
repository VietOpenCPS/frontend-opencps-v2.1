import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'

const routerOptions = [
  { path: '/danh-sach-ho-so/:index', component: 'Landing', props: true },
  { path: '/tra-cuu-ho-so', component: 'TraCuuHoSo', props: true },
  { path: '/danh-sach-ho-so/:index/tiep-nhan-ho-so/:id/:formCode', component: 'TiepNhanHoSoDetail', props: true },
  { path: '/danh-sach-ho-so/:index/chi-tiet-ho-so/:id', component: 'XemChiTietHoSoDetailCanBo', props: true },
  { path: '/danh-sach-ho-so/:index/xu-ly-ho-so', component: 'XuLyHoSo', props: true },
  { path: '/danh-sach-ho-so/:index/bo-sung-ho-so/:id', component: 'HoanThienBoSungHoSoDetail', props: true },
  { path: '/danh-sach-ho-so/:index/tra-ket-qua/:id', component: 'TraKetQuaDetail', props: true },
  { path: '/danh-sach-ho-so/:index/ho-so/:id/:formCode', component: 'DetailForward', props: true },
  { path: '/add-dvc/:serviceCode', component: 'DanhSachThuTuc', props: true },
  { path: '/captcha', component: 'testCaptcha', props: true },
  { path: '/danh-sach-ho-so/:index/nop-thanh-cong/:id', component: 'NopThanhCong', props: true },
  { path: '*', component: 'NotFound' }
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
