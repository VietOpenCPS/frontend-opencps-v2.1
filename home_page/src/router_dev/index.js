import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/blacklist/Landing'
import TiepNhanHoSoDetail from '@/components/blacklist/TiepNhanHoSoDetail'
import HoanThienBoSungHoSoDetail from '@/components/blacklist/HoanThienBoSungHoSoDetail'
import DetailForward from '@/components/blacklist/DetailForward'
import NotFound from '@/components/NotFound'
import LandingHome from '@/components/screens/Landing'
import LandingDesktop from '@/components/screens/LandingDesktop'
import TraCuuHoSo from '@/components/screens/TraCuuHoSo'
import ChiTietHoSo from '@/components/screens/ChiTietHoSo'
import TraCuuThuTuc from '@/components/screens/TraCuuThuTuc'
import ChiTietThuTuc from '@/components/screens/ChiTietThuTuc'
import DanhGiaChatLuongDichVu from '@/components/screens/DanhGiaChatLuongDichVu'
import HoSoKetQua from '@/components/screens/HoSoKetQua'
import DanhSachCanBo from '@/components/screens/DanhSachCanBo'
import CheckPassword from '@/components/screens/CheckPassword'
import DangNhap from '@/components/screens/DangNhap'

const routes = [
  { path: '/', name: 'LandingDesktop', component: LandingDesktop, props: false },
  { path: '/m', name: 'LandingHome', component: LandingHome, props: false },
  { path: '/tra-cuu-ho-so', name: 'TraCuuHoSo', component: TraCuuHoSo, props: false },
  { path: '/thong-tin-ho-so/:index', name: 'ChiTietHoSo', component: ChiTietHoSo, props: true },
  { path: '/tra-cuu-thu-tuc', name: 'TraCuuThuTuc', component: TraCuuThuTuc, props: false },
  { path: '/tra-cuu-thu-tuc/:index', name: 'ChiTietThuTuc', component: ChiTietThuTuc, props: true },
  { path: '/danh-gia-cldv', name: 'DanhGiaChatLuongDichVu', component: DanhGiaChatLuongDichVu, props: false },
  { path: '/ho-so-co-ket-qua', name: 'HoSoKetQua', component: HoSoKetQua, props: false },
  { path: '/danh-sach-can-bo', name: 'DanhSachCanBo', component: DanhSachCanBo, props: false },
  { path: '/ma-truy-cap-ho-so', name: 'CheckPassword', component: CheckPassword, props: false },
  { path: '/dang-nhap', name: 'DangNhap', component: DangNhap, props: false },
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
