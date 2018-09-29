import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import TraCuuHoSo from '@/components/TraCuuHoSo'
import ChiTietHoSo from '@/components/ChiTietHoSo'
import TraCuuHomePage from '@/components/TraCuuHomePage'
import ChiTietHoSoHomePage from '@/components/ChiTietHoSoHomePage'
import TraCuuThuTuc from '@/components/TraCuuThuTuc'
import ChiTietThuTuc from '@/components/ChiTietThuTuc'
import DanhGiaCanBo from '@/components/DanhGiaCanBo'
import DanhGiaChatLuongDichVu from '@/components/DanhGiaChatLuongDichVu'
import HoSoKetQua from '@/components/HoSoKetQua'
import DanhSachCanBo from '@/components/DanhSachCanBo'
import CheckPassword from '@/components/CheckPassword'
import CheckPasswordHP from '@/components/CheckPasswordHP'
import ChiTietHoSoQR from '@/components/ChiTietHoSoQR'

const routes = [
  { path: '/', name: 'HoSoKetQua', component: HoSoKetQua, props: false },
  { path: '/tra-cuu-ho-so', name: 'TraCuuHoSo', component: TraCuuHoSo, props: false },
  { path: '/ho-so/:index', name: 'ChiTietHoSo', component: ChiTietHoSo, props: true },
  { path: '/tra-cuu-ho-so-homepage', name: 'TraCuuHomePage', component: TraCuuHomePage, props: false },
  { path: '/thong-tin-ho-so/:index', name: 'ChiTietHoSoHomePage', component: ChiTietHoSoHomePage, props: true },
  { path: '/tra-cuu-thu-tuc', name: 'TraCuuThuTuc', component: TraCuuThuTuc, props: false },
  { path: '/tra-cuu-thu-tuc/:index', name: 'ChiTietThuTuc', component: ChiTietThuTuc, props: true },
  { path: '/danh-gia-can-bo', name: 'DanhGiaCanBo', component: DanhGiaCanBo, props: false },
  { path: '/danh-gia-cldv', name: 'DanhGiaChatLuongDichVu', component: DanhGiaChatLuongDichVu, props: false },
  { path: '/ho-so-co-ket-qua', name: 'HoSoKetQua', component: HoSoKetQua, props: false },
  { path: '/danh-sach-can-bo', name: 'DanhSachCanBo', component: DanhSachCanBo, props: false },
  { path: '/ma-truy-cap', name: 'CheckPassword', component: CheckPassword, props: false },
  { path: '/ma-truy-cap-ho-so', name: 'CheckPasswordHP', component: CheckPasswordHP, props: false },
  { path: '/tra-cuu-thong-tin-ho-so/:index', name: 'ChiTietHoSoQR', component: ChiTietHoSoQR, props: true }
]

Vue.use(Router)

const router = new Router({
  routes
})

export default router
