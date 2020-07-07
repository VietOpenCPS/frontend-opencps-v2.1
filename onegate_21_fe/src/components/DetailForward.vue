<template>
  <div>
    <tiep-nhan-ho-so-detail 
      v-if="formCode === 'NEW' || formCode === 'NEW_GROUP' || formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI' || formCode === 'UPDATE' || formCode === 'COPY'" 
      ref="tiepnhanhosodetail"
      :formCode="formCode"
      :id="id"
    ></tiep-nhan-ho-so-detail>
  </div>
</template>

<script>
import TiepNhanHoSoDetail from './TiepNhanHoSoDetail.vue'

export default {
  props: ['id', 'formCode'],
  components: {
    'tiep-nhan-ho-so-detail': TiepNhanHoSoDetail
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
