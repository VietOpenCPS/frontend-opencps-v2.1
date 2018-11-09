import Vue from 'vue/dist/vue.min.js'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import TraCuuHoSo from '@/components/TraCuuHoSo'
import ChiTietHoSo from '@/components/ChiTietHoSo'
import TraCuuThuTuc from '@/components/TraCuuThuTuc'
import ChiTietThuTuc from '@/components/ChiTietThuTuc'
import DanhGiaChatLuongDichVu from '@/components/DanhGiaChatLuongDichVu'
import HoSoKetQua from '@/components/HoSoKetQua'
import DanhSachCanBo from '@/components/DanhSachCanBo'
import CheckPassword from '@/components/CheckPassword'

const routes = [
  { path: '/', name: 'HoSoKetQua', component: HoSoKetQua, props: false },
  { path: '/tra-cuu-ho-so', name: 'TraCuuHoSo', component: TraCuuHoSo, props: false },
  { path: '/tra-cuu-ho-so/:index', name: 'ChiTietHoSo', component: ChiTietHoSo, props: true },
  { path: '/tra-cuu-thu-tuc', name: 'TraCuuThuTuc', component: TraCuuThuTuc, props: false },
  { path: '/tra-cuu-thu-tuc/:index', name: 'ChiTietThuTuc', component: ChiTietThuTuc, props: true },
  { path: '/danh-gia-cldv', name: 'DanhGiaChatLuongDichVu', component: DanhGiaChatLuongDichVu, props: false },
  { path: '/ho-so-co-ket-qua', name: 'HoSoKetQua', component: HoSoKetQua, props: false },
  { path: '/danh-sach-can-bo', name: 'DanhSachCanBo', component: DanhSachCanBo, props: false },
  { path: '/ma-truy-cap-ho-so', name: 'CheckPassword', component: CheckPassword, props: false }
]

Vue.use(Router)

const router = new Router({
  routes
})

export default router
