<template>
  <div>
    <tiep-nhan-ho-so-detail 
      v-if="formCode === 'NEW' || formCode === 'UPDATE' || formCode === 'COPY'" 
      ref="tiepnhanhosodetail"
      :formCode="formCode"
    ></tiep-nhan-ho-so-detail>
  </div>
</template>

<script>
import ChamQuaHanDetail from './ChamQuaHanDetail.vue'
// import ChuyenPhatKetQuaDetail from './ChuyenPhatKetQuaDetail.vue'
// import FeeDetail from './FeeDetail.vue'
import HoanThienBoSungHoSoDetail from './HoanThienBoSungHoSoDetail.vue'
import HoSoLienThongDetail from './HoSoLienThongDetail.vue'
// import HoSoLienThongTinhTrangXuLyDetail from './HoSoLienThongTinhTrangXuLyDetail.vue'
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'
// import TiepNhanHoSoTrucTuyenDetail from './TiepNhanHoSoTrucTuyenDetail.vue'
// import TraKetQuaDetail from './TraKetQuaDetail.vue'
// import XemChiTietHoSoDetail from './XemChiTietHoSoDetail.vue'
import XemChiTietHoSoDetailCanBo from './XemChiTietHoSoDetailCanBo.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'cham-qua-han-detail': ChamQuaHanDetail,
    'hoan-thien-bo-sung-ho-so-detail': HoanThienBoSungHoSoDetail,
    'ho-so-lien-thong-detail': HoSoLienThongDetail,
    // 'ho-so-lien-thong-tinh-trang-xu-ly-detail': HoSoLienThongTinhTrangXuLyDetail,
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail,
    'xem-chi-tiet-ho-so-detail-can-bo': XemChiTietHoSoDetailCanBo,
    // 'chi-tiet-tinh-trang-lien-thong': HoSoLienThongTinhTrangXuLyDetail,
    'chi-tiet-ho-so-lien-thong': HoSoLienThongDetail
  },
  data: () => ({
    initData: null,
    step: ''
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      let currentQuery = vm.$router.history.current.query
      if (currentQuery.hasOwnProperty('step')) {
        vm.step = currentQuery.step
      }
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        if (vm.initData !== null) {
          let tiepnhanhosodetail = vm.$refs.tiepnhanhosodetail
          let hoanthienbosunghosodetail = vm.$refs.hoanthienbosunghosodetail
          let traketquadetail = vm.$refs.traketquadetail
          let chuyenphatketquadetail = vm.$refs.chuyenphatketquadetail
          let xemchitiethosodetailcanbo = vm.$refs.xemchitiethosodetailcanbo
          let xemchitiethosotinhtrangxulylienthong = vm.$refs.xemchitiethosotinhtrangxulylienthong
          let xemchitiethosolienthong = vm.$refs.xemchitiethosolienthong
          if (tiepnhanhosodetail !== null && tiepnhanhosodetail !== undefined && tiepnhanhosodetail !== 'undefined') {
            vm.$refs.tiepnhanhosodetail.initData(vm.id)
          } else if (hoanthienbosunghosodetail !== null && hoanthienbosunghosodetail !== undefined && hoanthienbosunghosodetail !== 'undefined') {
            vm.$refs.hoanthienbosunghosodetail.initData(vm.id)
          } else if (traketquadetail !== null && traketquadetail !== undefined && traketquadetail !== 'undefined') {
            vm.$refs.traketquadetail.initData(vm.id)
          } else if (chuyenphatketquadetail !== null && chuyenphatketquadetail !== undefined && chuyenphatketquadetail !== 'undefined') {
            vm.$refs.chuyenphatketquadetail.initData(vm.id)
          } else if (xemchitiethosodetailcanbo !== null && xemchitiethosodetailcanbo !== undefined && xemchitiethosodetailcanbo !== 'undefined') {
            vm.$refs.xemchitiethosodetailcanbo.initData(vm.id)
          } else if (xemchitiethosotinhtrangxulylienthong !== null && xemchitiethosotinhtrangxulylienthong !== undefined && xemchitiethosotinhtrangxulylienthong !== 'undefined') {
            vm.$refs.xemchitiethosotinhtrangxulylienthong.initData(vm.id)
          } else if (xemchitiethosolienthong !== null && xemchitiethosolienthong !== undefined && xemchitiethosolienthong !== 'undefined') {
            vm.$refs.xemchitiethosolienthong.initData(vm.id)
          }
        }
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query.hasOwnProperty('step')) {
        vm.step = query.step
      }
      // bổ sung cho chức năng tiếp nhận- thêm mới
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        if (vm.initData !== null) {
          let tiepnhanhosodetail = vm.$refs.tiepnhanhosodetail
          let hoanthienbosunghosodetail = vm.$refs.hoanthienbosunghosodetail
          let traketquadetail = vm.$refs.traketquadetail
          let chuyenphatketquadetail = vm.$refs.chuyenphatketquadetail
          let xemchitiethosodetailcanbo = vm.$refs.xemchitiethosodetailcanbo
          let xemchitiethosotinhtrangxulylienthong = vm.$refs.xemchitiethosotinhtrangxulylienthong
          let xemchitiethosolienthong = vm.$refs.xemchitiethosolienthong
          if (tiepnhanhosodetail !== null && tiepnhanhosodetail !== undefined && tiepnhanhosodetail !== 'undefined') {
            vm.$refs.tiepnhanhosodetail.initData(vm.id)
          } else if (hoanthienbosunghosodetail !== null && hoanthienbosunghosodetail !== undefined && hoanthienbosunghosodetail !== 'undefined') {
            vm.$refs.hoanthienbosunghosodetail.initData(vm.id)
          } else if (traketquadetail !== null && traketquadetail !== undefined && traketquadetail !== 'undefined') {
            vm.$refs.traketquadetail.initData(vm.id)
          } else if (chuyenphatketquadetail !== null && chuyenphatketquadetail !== undefined && chuyenphatketquadetail !== 'undefined') {
            vm.$refs.chuyenphatketquadetail.initData(vm.id)
          } else if (xemchitiethosodetailcanbo !== null && xemchitiethosodetailcanbo !== undefined && xemchitiethosodetailcanbo !== 'undefined') {
            vm.$refs.xemchitiethosodetailcanbo.initData(vm.id)
          } else if (xemchitiethosotinhtrangxulylienthong !== null && xemchitiethosotinhtrangxulylienthong !== undefined && xemchitiethosotinhtrangxulylienthong !== 'undefined') {
            vm.$refs.xemchitiethosotinhtrangxulylienthong.initData(vm.id)
          } else if (xemchitiethosolienthong !== null && xemchitiethosolienthong !== undefined && xemchitiethosolienthong !== 'undefined') {
            vm.$refs.xemchitiethosolienthong.initData(vm.id)
          }
        }
      })
    }
  }
}
</script>
