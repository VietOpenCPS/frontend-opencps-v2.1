<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex xs6 sm2 class="px-2">
              <v-select
                :items="years"
                v-model="year"
                autocomplete
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeYear"
                >
              </v-select>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-select
                :items="years"
                v-model="year"
                autocomplete
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeYear"
                >
              </v-select>
            </v-flex>
             <v-flex xs6 sm2 class="px-2">
              <v-select
                :items="years"
                v-model="year"
                autocomplete
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeYear"
                >
              </v-select>
            </v-flex>
             <v-flex xs6 sm2 class="px-2">
              <v-text-field solo placeholder="nhập từ khoá ..." v-model="value"></v-text-field>
            </v-flex>
            <v-flex class="px-2 text-right">
              <v-btn flat class="mx-0 my-0" v-on:click.native="doExcelFunc">
                <v-icon>search</v-icon> &nbsp;
                Tìm kiếm
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <v-layout row wrap v-if="true">
      <v-data-table
        :headers="headers"
        :items="desserts"
        hide-actions
        class="btn--block my-0"
      >
        <template slot="items" slot-scope="props">
          <td></td>
          <td class="text-xs-right"></td>
          <td class="text-xs-right"></td>
          <td class="text-xs-right"></td>
          <td class="text-xs-right"></td>
          <td class="text-xs-right"></td>
        </template>
      </v-data-table>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12 class="text-xs-center" mt-5>
        <v-progress-circular
          :size="100"
          :width="1"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import VueFriendlyIframe from 'vue-friendly-iframe'
import support from '../store/support.json'

export default {
  props: ['index', 'id'],
  components: {
    'vue-friendly-iframe': VueFriendlyIframe
  },
  data: () => ({
    headers: [
      {
        text: 'STT',
        align: 'left',
        sortable: false
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lĩnh vực thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mức độ',
        align: 'center',
        sortable: false
      },
      {
        text: '',
        align: 'center',
        sortable: false
      }
    ],
    isDVC: false,
    isCallBack: true,
    fromDate: null,
    menufromDate: false,
    fromDateFormatted: null,
    toDate: null,
    menutoDate: false,
    toDateFormatted: null,
    danhSachBaoCaos: [],
    years: [
      {
        'value': '',
        'name': 'Lọc theo năm'
      },
      {
        'value': '2017',
        'name': 'năm 2017'
      },
      {
        'value': '2018',
        'name': 'năm 2018'
      },
      {
        'value': '2019',
        'name': 'năm 2019'
      }
    ],
    year: (new Date()).getFullYear() + '',
    months: [
      {
        'value': '0',
        'name': 'Cả năm'
      },
      {
        'value': '1',
        'name': 'tháng 1'
      },
      {
        'value': '2',
        'name': 'tháng 2'
      },
      {
        'value': '3',
        'name': 'tháng 3'
      },
      {
        'value': '4',
        'name': 'tháng 4'
      },
      {
        'value': '5',
        'name': 'tháng 5'
      },
      {
        'value': '6',
        'name': 'tháng 6'
      },
      {
        'value': '7',
        'name': 'tháng 7'
      },
      {
        'value': '8',
        'name': 'tháng 8'
      },
      {
        'value': '9',
        'name': 'tháng 9'
      },
      {
        'value': '10',
        'name': 'tháng 10'
      },
      {
        'value': '11',
        'name': 'tháng 11'
      },
      {
        'value': '12',
        'name': 'tháng 12'
      }
    ],
    month: ((new Date()).getMonth() + 1) + '',
    agencyLists: [],
    govAgency: null,
    danhSachBaoCao: [],
    pdfBlob: null,
    documentTYPE: 'REPORT_01'
  }),
  computed: {
    loadingMenuConfigToDo () {
      return this.$store.getters.loadingMenuConfigToDo
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.isDVC = vm.getReportCongDVC()
      vm.danhSachBaoCao = vm.loadingMenuConfigToDo
      let currentQuerys = vm.$router.history.current.query
      if (currentQuerys.hasOwnProperty('fromDate')) {
        vm.fromDateFormatted = currentQuerys.fromDate
      } else {
        vm.fromDateFormatted = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 3).toLocaleDateString('vi-VN')
      }
      if (currentQuerys.hasOwnProperty('toDate')) {
        vm.toDateFormatted = currentQuerys.toDate
      } else {
        vm.toDateFormatted = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString('vi-VN')
      }
      if (vm.isDVC) {
        vm.$store.dispatch('getAgencyLists').then(function (result) {
          vm.agencyLists = result
          if (vm.agencyLists !== null && vm.agencyLists !== undefined && vm.agencyLists.length > 0) {
            vm.govAgency = vm.agencyLists[0]
            vm.doPrintReport()
          }
        })
      } else {
        vm.doPrintReport()
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      if (vm.isCallBack) {
        vm.isCallBack = false
        vm.danhSachBaoCao = vm.loadingMenuConfigToDo
        let currentParams = vm.$router.history.current.params
        let currentQuerys = vm.$router.history.current.query
        if (vm.isCallBack) {
          vm.isCallBack = false
          vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
          if (currentQuerys.hasOwnProperty('fromDate')) {
            vm.fromDateFormatted = currentQuerys.fromDate
          } else {
            vm.fromDateFormatted = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 3).toLocaleDateString('vi-VN')
          }
          if (currentQuerys.hasOwnProperty('toDate')) {
            vm.toDateFormatted = currentQuerys.toDate
          } else {
            vm.toDateFormatted = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toLocaleDateString('vi-VN')
          }
        }
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      vm.doPrintReport()
    },
    fromDate (val) {
      this.fromDateFormatted = this.formatDate(this.fromDate)
    },
    toDate (val) {
      this.toDateFormatted = this.formatDate(this.toDate)
    }
  },
  methods: {
    doExcelFunc () {
      let vm = this
      vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
      let filter = {
        document: vm.documentTYPE,
        year: vm.year,
        month: vm.month,
        fromDate: vm.fromDateFormatted,
        toDate: vm.toDateFormatted
      }
      if (vm.isDVC) {
        filter['agency'] = vm.govAgency['itemCode']
      }
      vm.pdfBlob = null
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
          if (vm.documentTYPE === 'REPORT_01') {
            putData['year'] = vm.year
            putData['month'] = vm.month
          } else {
            putData['fromDate'] = vm.fromDateFormatted
            putData['toDate'] = vm.toDateFormatted
          }
          putData['reportType'] = 'excel'
          let filterPostData = {
            document: vm.documentTYPE,
            data: putData
          }
          vm.$store.dispatch('doStatisticReportPrint', filterPostData).then(function (result) {
            console.log(result)
            window.open(result, '_blank')
          })
        } else {
          alert('Không tìm thấy dữ liệu báo cáo.')
        }
      })
    },
    doPrintReport () {
      let vm = this
      vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
      let filter = {
        document: vm.documentTYPE,
        year: vm.year,
        month: vm.month,
        fromDate: vm.fromDateFormatted,
        toDate: vm.toDateFormatted
      }
      if (vm.isDVC) {
        filter['agency'] = vm.govAgency['itemCode']
      }
      vm.pdfBlob = null
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
          if (vm.documentTYPE === 'REPORT_01') {
            putData['year'] = vm.year
            putData['month'] = vm.month
          } else {
            putData['fromDate'] = vm.fromDateFormatted
            putData['toDate'] = vm.toDateFormatted
          }
          let filterPostData = {
            document: vm.documentTYPE,
            data: putData
          }
          vm.$store.dispatch('doStatisticReportPrint', filterPostData).then(function (result) {
            vm.pdfBlob = result
          })
        } else {
          alert('Không tìm thấy dữ liệu báo cáo.')
        }
      })
    },
    changeYear (item) {
      let vm = this
      vm.year = item
      router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          fromDate: vm.fromDate,
          toDate: vm.toDate
        }
      })
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          fromDate: vm.fromDate,
          toDate: vm.toDate
        }
      })
    },
    changeGov (item) {
      let vm = this
      vm.govAgency = item
      router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          fromDate: vm.fromDate,
          toDate: vm.toDate
        }
      })
    },
    changeFromDate () {
      let vm = this
      vm.menufromDate = false
      vm.fromDateFormatted = vm.formatDate(vm.fromDate)
      router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          fromDate: vm.fromDateFormatted,
          toDate: vm.toDateFormatted
        }
      })
    },
    changeToDate () {
      let vm = this
      vm.menutoDate = false
      vm.toDateFormatted = vm.formatDate(vm.toDate)
      router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          fromDate: vm.fromDateFormatted,
          toDate: vm.toDateFormatted
        }
      })
    },
    formatDate (date) {
      if (!date) return null
      console.log('formatDate', date)
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      console.log('parseDate', date)
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>
