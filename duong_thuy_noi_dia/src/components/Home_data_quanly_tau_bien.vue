<template>

  <v-layout wrap>
    <v-flex>
      <div v-if="id">
        <hang-hai-detail-tau-roi-cang
          v-if="code === 'DanhSachTauRoiCang' || code === 'DanhSach<200DWTRoi'"
          :id="idDetailPT || id"
          :type="type"
          :code="code"
          :idPT="id"
          :documentTypeCode="documentTypeCode"
          :documentStatusCode="documentStatusCode"
          :statusCode="statusCode"
          ref="detailTauDenCang"
        ></hang-hai-detail-tau-roi-cang>

        <hang-hai-detail-tau-di-chuyen
          v-if="code === 'DanhSachTauDiChuyen'"
          :id="idDetailPT || id"
          :type="type"
          :code="code"
          :idPT="id"
          :documentTypeCode="documentTypeCode"
          :documentStatusCode="documentStatusCode"
          :statusCode="statusCode"
          ref="detailTauDenCang"
        ></hang-hai-detail-tau-di-chuyen>
        
        
      </div>
      <div v-else>
        <danh-sach-tau-all
          :code="code"
          :type="type"
          :idPT="id"
          :documentYear="''"
          :documentName="''"
          :documentTypeCode="documentTypeCode"
          :documentStatusCode="documentStatusCode"
        >
        </danh-sach-tau-all>
      </div>
    </v-flex>
  </v-layout>

</template>

<script>
import supportData from '../store/support_data.json'
import {eventBus} from '@/event-bus/eventBus.js'
import HangHaiDetailDanhSachTauRoiCang from './hang_hai/Detail_hang_hai/hanghai_detail_tau_roi_cang.vue'
import HangHaiDetailDanhSachTauDiChuyen from './hang_hai/Detail_hang_hai/hanghai_detail_tau_di_chuyen.vue'
import DanhSachTauAll from './hang_hai/DanhSachTauAll.vue'
export default {
  props: {
    type: '',
    documentTypeCode: '',
    documentStatusCode: '',
    code: '',
    id: ''
  },
  components: {
    'danh-sach-tau-all': DanhSachTauAll,
    'hang-hai-detail-tau-roi-cang': HangHaiDetailDanhSachTauRoiCang,
    'hang-hai-detail-tau-di-chuyen': HangHaiDetailDanhSachTauDiChuyen,
  },
  data: () => ({
    loading: true,
    supportData: supportData
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
    var vm = this
    vm.emitStatusTextTable()
    vm.$nextTick(function () {
      vm.changeHeader({
        type: vm.code
      })
    })
  },
  watch: {
    code: function (val) {
      var vm = this
      vm.changeHeader({
        type: val
      })
    }
  },
  methods: {
    emitStatusTextTable () {
      var vm = this
      var statusText = ''
      switch (vm.code) {
        case 'DanhSachTauDiChuyen': {
          statusText = 'Danh sách tàu di chuyển'
          break
        }
        default: {
          statusText = 'Danh sách kế hoạch tàu chuyên tuyến'
          break
        }
      }
      eventBus.$emit('changeStatusTable', statusText)
    },
    changeHeader (item) {
      var vm = this
      vm.$emit('changeHeader', item.type)
    }
  },
  filters: {
    money (value) {
      if (value) {
        var moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ'
      } else {
        return ''
      }
    }
  }
}
</script>
