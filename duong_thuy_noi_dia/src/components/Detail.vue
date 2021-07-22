<template>
  <div>
    <v-navigation-drawer app clipped floating width="250" class="px-0 py-0">
      <jx-hanghai-detail-part 
        :thanh_phan_ho_so_api="getThanhPhanHoSo"
        :type="type"
        :document_type_code="documentTypeCode"
        :document_status_code="documentStatusCode"
        :document_name="documentName"
        :document_year="documentYear"
        ref="hanghaidetailpart"
        >
      </jx-hanghai-detail-part>
    </v-navigation-drawer>

    <router-view></router-view>

  </div>
</template>

<script>
import DetailPart from './hang_hai/hanghai_detail_part.vue'

export default {
  props: ['type', 'documentName', 'documentYear', 'documentTypeCode', 'documentStatusCode'],
  components: {
    'jx-hanghai-detail-part': DetailPart
  },
  data: () => ({
    initData: null,
    getThanhPhanHoSo: ''
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        if (vm.initData !== null) {
          vm.getThanhPhanHoSo = vm.initData.getThanhPhanHoSo
          let hanghaidetailpart = vm.$refs.hanghaidetailpart
          if (hanghaidetailpart !== null && hanghaidetailpart !== undefined && hanghaidetailpart !== 'undefined') {
            hanghaidetailpart.reloadThanhPhanParam(vm.getThanhPhanHoSo)
          }
        }
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query.hasOwnProperty('renew')) {
        let hanghaidetailpart = vm.$refs.hanghaidetailpart
        if (hanghaidetailpart !== null && hanghaidetailpart !== undefined && hanghaidetailpart !== 'undefined') {
          hanghaidetailpart.reloadThanhPhanParam(vm.getThanhPhanHoSo)
        }
      }
    }
  }
}
</script>
