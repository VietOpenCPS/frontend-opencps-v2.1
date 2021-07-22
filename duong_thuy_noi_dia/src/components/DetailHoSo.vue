<template>
  <div>
    
    <jx-hanghai-detail
      :type="type"
      :document_type_code="documentTypeCode"
      :document_status_code="documentStatusCode"
      :document_name="documentName"
      :document_year="documentYear"
      ref="hanghaidetail"
    >
    </jx-hanghai-detail>

    <router-view></router-view>

  </div>
</template>

<script>
import HangHaiDetail from './hang_hai/hanghai_detail.vue'

export default {
  props: ['type', 'documentName', 'documentYear', 'documentTypeCode', 'documentStatusCode'],
  components: {
    'jx-hanghai-detail': HangHaiDetail
  },
  data: () => ({
    detail_model: {}
  }),
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.reloadDetail()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query.hasOwnProperty('renew')) {
        vm.reloadDetail()
      }
    }
  },
  methods: {
    pullDetail () {
      let hanghaidetail = this.$refs.hanghaidetail
      if (hanghaidetail !== null && hanghaidetail !== undefined && hanghaidetail !== 'undefined') {
        return hanghaidetail.detail_model
      }
    },
    reloadDetail: function () {
      var vm = this
      vm.detail_model = {}
      let config = {
        'documentType': vm.documentTypeCode,
        'documentName': vm.documentName,
        'documentYear': vm.documentYear,
        'type': vm.type
      }
      vm.$store.dispatch('loadDetailHoSo', config).then(function (result) {
        vm.detail_model = result
        let hanghaidetail = vm.$refs.hanghaidetail
        if (hanghaidetail !== null && hanghaidetail !== undefined && hanghaidetail !== 'undefined') {
          hanghaidetail.reloadDetail()
          hanghaidetail.reloadKhaiBao()
          hanghaidetail.loadPhanHoi()
        }
      })
    }
  }
}
</script>
