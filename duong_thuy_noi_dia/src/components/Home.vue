<template>
  <div>
    <v-navigation-drawer app clipped floating width="250">
      <jx-hanghai-filter-left
				ref="filterleft"
        :type="type"
        :document_type_code="documentTypeCode"
        :document_status_code="documentStatusCode"
        :role_filter_status="roleFilterStatus"
        :count_ho_so_api="counterHoSoAll"
        :counter_ho_so_ke_hoach_table="counterHoSoKeHoachTable"
        :counter_ho_so_thu_tuc_table="counterHoSoThuTucTable"
			>
			</jx-hanghai-filter-left>
    </v-navigation-drawer>

    <jx-hanghai-filter-adv
      :type="type"
      :document_type_code="documentTypeCode"
      :document_status_code="documentStatusCode"
      :cang_vu_name="cang_vu_name"
      :tau_den_rois="tau_den_rois"
      :quoc_tichs="quoc_tichs"
      :khu_cuc_cangs="khu_cuc_cangs"
      ref="filteradvF"
    ></jx-hanghai-filter-adv>
    <router-view></router-view>
    
  </div>
</template>

<script>
import FilterLeft from './hang_hai/hanghai_filter_left.vue'
import FilterADV from './hang_hai/hanghai_filter_adv.vue'
import supportData from '../store/support_data.json'
import axios from 'axios'

export default {
  props: ['type', 'documentTypeCode', 'documentStatusCode'],
  components: {
    'jx-hanghai-filter-left': FilterLeft,
    'jx-hanghai-filter-adv': FilterADV
  },
  data: () => ({
    docTypes: [],
    roleFilterStatus: [],
    initData: null,
    counterHoSoAll: '',
    counterHoSoKeHoachTable: '',
    counterHoSoThuTucTable: '',
    cang_vu_name: '',
    tau_den_rois: [],
    quoc_tichs: supportData.data_state,
    khu_cuc_cangs: [],
    cang_den_tiep_theos: [],
    callBack: true,
    getFilterADVDataAPI: ''
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        if (vm.initData !== null) {
          vm.getFilterADVDataAPI = vm.initData.getFilterADVDataAPI
          vm.counterHoSoAll = vm.initData.counterHoSoAll
          vm.counterHoSoKeHoachTable = vm.initData.counterHoSoKeHoachTable
          vm.counterHoSoThuTucTable = vm.initData.counterHoSoThuTucTable
          vm.cang_vu_name = vm.initData.user['cangVuName']
          let emailNameHeader = document.getElementById('emailNameHeader')
          if (emailNameHeader !== null && emailNameHeader !== undefined && emailNameHeader !== 'undefined') {
            emailNameHeader.innerHTML = vm.initData.user.userName
          }
        }
      })
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.doRolesInit(true)
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
      if (vm.callBack) {
        vm.callBack = false
        setTimeout(() => {
          let filteradvF = vm.$refs.filteradvF
          if (filteradvF !== null && filteradvF !== undefined && filteradvF !== 'undefined') {
            vm.process_adv_filter()
          }
        }, 300)
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let newDocumentStatusCode = newRoute.params.documentStatusCode
      let oldDocumentStatusCode = oldRoute.params.documentStatusCode
      let newdocumentTypeCode = newRoute.params.documentTypeCode
      let olddocumentTypeCode = oldRoute.params.documentTypeCode
      let newtype = newRoute.params.type
      let oldtype = oldRoute.params.type
      let allLoad = true
      if (newDocumentStatusCode !== oldDocumentStatusCode && newdocumentTypeCode === olddocumentTypeCode && newtype === oldtype) {
        allLoad = false
      }
      vm.doRolesInit(allLoad)
    }
  },
  methods: {
    doRolesInit (allLoad) {
      let vm = this
      let filterleft = vm.$refs.filterleft
      if (vm.documentTypeCode !== 0 && (vm.type === 'ke_hoach' || vm.type === 'thu_tuc')) {
        let filter = {
          documentType: vm.documentTypeCode
        }
        if (allLoad) {
          vm.$store.getters.roleFilterStatus(filter).then(function (result) {
            vm.roleFilterStatus = result
            if (vm.type === 'ke_hoach') {
              setTimeout(() => {
                filterleft.doKeHoachFilterCount()
              }, 300)
            } else if (vm.type === 'thu_tuc') {
              setTimeout(() => {
                filterleft.doThuTucFilterCount()
              }, 300)
            }
          })
        }
      }
      if (allLoad && (vm.type === 'ke_hoach' || vm.type === 'thu_tuc')) {
        vm.$store.getters.docTypes.then(function (result) {
          vm.docTypes = result
          if (filterleft !== null && filterleft !== undefined && filterleft !== 'undefined') {
            filterleft.doInitUpdate()
          }
        })
      }
    },
    process_adv_filter () {
      let vm = this
      let filteradvF = vm.$refs.filteradvF
      axios
        .post(vm.getFilterADVDataAPI)
        .then(function (response) {
          let serializable = response.data
          filteradvF.bindData(serializable)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>
