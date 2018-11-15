<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>BÁO CÁO</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex xs6 sm2 class="px-2" v-if="isDVC">
              <v-select
                :items="agencyLists"
                v-model="govAgency"
                autocomplete
                item-text="itemName"
                item-value="itemCode"
                return-object
                :hide-selected="true"
                @change="changeGov"
                >
              </v-select>
            </v-flex>
            <v-flex xs6 sm2 class="px-2" v-if="documentTYPE === 'REPORT_01'">
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
            <!-- <v-flex xs6 sm2 class="px-2" v-if="documentTYPE === 'REPORT_01'">
              <v-select
                :items="months"
                v-model="month"
                autocomplete
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeMonth"
                >
              </v-select>
            </v-flex> -->
            <v-flex xs6 sm1 class="px-2">
              <v-subheader class="pl-0 text-header">Từ ngày: </v-subheader>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-layout wrap>
                <v-flex>
                  <v-menu
                    ref="menufromDate"
                    :close-on-content-click="false"
                    v-model="menufromDate"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      placeholder="Chọn ngày"
                      slot="activator"
                      v-model="fromDateFormatted"
                      append-icon="event"
                      @blur="fromDate = parseDate(fromDateFormatted)"
                    ></v-text-field>
                    <v-date-picker v-model="fromDate" no-title @input="changeFromDate"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs6 sm1 class="px-2">
              <v-subheader class="pl-0 text-header">Đến ngày:</v-subheader>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-menu
                ref="menutoDate"
                :close-on-content-click="false"
                v-model="menutoDate"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  placeholder="Chọn ngày"
                  slot="activator"
                  v-model="toDateFormatted"
                  append-icon="event"
                  @blur="toDate = parseDate(toDateFormatted)"
                ></v-text-field>
                <v-date-picker v-model="toDate" :min="toDateMin" no-title @input="changeToDate"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex class="px-2 text-right">
              <v-btn flat class="mx-0 my-0" v-on:click.native="doExcelFunc">
                Xuất Excel
              </v-btn>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <div>
      <vue-friendly-iframe v-if="pdfBlob !== null && pdfBlob !== undefined && pdfBlob !== '' " :src="pdfBlob"></vue-friendly-iframe>
      <div v-else-if="!isShowLoading">
        <v-alert :value="true" outline color="info" icon="info">
          Không có dữ liệu báo cáo.
        </v-alert>
      </div>
      <v-layout row wrap v-if="isShowLoading">
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
    isDVC: false,
    isCallBack: true,
    fromDate: null,
    menufromDate: false,
    fromDateFormatted: null,
    toDate: null,
    menutoDate: false,
    toDateMin: null,
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
    month: 0,
    agencyLists: [],
    govAgency: null,
    danhSachBaoCao: [],
    pdfBlob: null,
    isShowLoading: false,
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
      vm.year = ''
      vm.danhSachBaoCao = vm.loadingMenuConfigToDo
      let currentQuerys = vm.$router.history.current.query
      vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
      if (currentQuerys.hasOwnProperty('fromDate')) {
        vm.fromDateFormatted = currentQuerys.fromDate
      } else {
        vm.fromDateFormatted = ''
        let date = new Date()
        vm.fromDateFormatted = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN')
      }
      if (currentQuerys.hasOwnProperty('toDate')) {
        vm.toDateFormatted = currentQuerys.toDate
      } else {
        vm.toDateFormatted = ''
        vm.toDateFormatted = new Date().toLocaleDateString('vi-VN')
      }
      if (vm.isDVC) {
        vm.$store.dispatch('getAgencyLists').then(function (result) {
          vm.agencyLists = result
          if (vm.agencyLists !== null && vm.agencyLists !== undefined && vm.agencyLists.length > 0) {
            vm.govAgency = vm.agencyLists[0]
            console.log('run created')
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
          console.log('documentTYPE', vm.documentTYPE)
          if (currentQuerys.hasOwnProperty('fromDate')) {
            vm.year = currentQuerys.fromDate ? '' : vm.year
            vm.fromDateFormatted = currentQuerys.fromDate
          } else {
            vm.fromDateFormatted = ''
            let date = new Date()
            vm.fromDateFormatted = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN')
          }
          if (currentQuerys.hasOwnProperty('toDate')) {
            vm.year = currentQuerys.toDate ? '' : vm.year
            vm.toDateFormatted = currentQuerys.toDate
          } else {
            vm.toDateFormatted = ''
            vm.toDateFormatted = new Date().toLocaleDateString('vi-VN')
          }
        }
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
      if (currentQuery.hasOwnProperty('fromDate')) {
        vm.year = currentQuery.fromDate ? '' : vm.year
        vm.fromDateFormatted = currentQuery.fromDate
      } else {
        vm.fromDateFormatted = ''
        let date = new Date()
        vm.fromDateFormatted = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString('vi-VN')
      }
      if (currentQuery.hasOwnProperty('toDate')) {
        vm.year = currentQuery.toDate ? '' : vm.year
        vm.toDateFormatted = currentQuery.toDate
      } else {
        vm.toDateFormatted = ''
        vm.toDateFormatted = new Date().toLocaleDateString('vi-VN')
      }
      console.log('run watch')
      vm.doPrintReport()
    },
    fromDate (val) {
      this.toDateMin = val
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
        fromDate: vm.fromDateFormatted,
        toDate: vm.toDateFormatted
      }
      if (vm.documentTYPE === 'REPORT_01') {
        filter['year'] = vm.year
      }
      if (vm.isDVC && vm.govAgency) {
        filter['agency'] = vm.govAgency['itemCode']
      } else if (vm.isDVC && !vm.govAgency) {
        filter['agency'] = 'all'
      }
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
          if (filter['agency'] === 'all' || filter['agency'] === undefined) {
            putData['flagAgency'] = 1
          } else {
            putData['flagAgency'] = 0
          }
          if (vm.documentTYPE === 'REPORT_01') {
            putData['year'] = vm.year
            putData['month'] = '0'
            putData['fromStatisticDate'] = vm.fromDateFormatted
            putData['toStatisticDate'] = vm.toDateFormatted
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
        }
      })
    },
    doPrintReport () {
      let vm = this
      vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
      let filter = {
        document: vm.documentTYPE,
        fromDate: vm.fromDateFormatted,
        toDate: vm.toDateFormatted
      }
      if (vm.documentTYPE === 'REPORT_01') {
        filter['year'] = vm.year
      }
      if (vm.isDVC && vm.govAgency) {
        filter['agency'] = vm.govAgency['itemCode']
      } else if (vm.isDVC && !vm.govAgency) {
        filter['agency'] = 'all'
      }
      vm.pdfBlob = null
      vm.isShowLoading = true
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
          if (filter['agency'] === 'all' || filter['agency'] === undefined) {
            putData['flagAgency'] = 1
          } else {
            putData['flagAgency'] = 0
          }
          if (vm.documentTYPE === 'REPORT_01') {
            putData['year'] = vm.year
            // putData['month'] = vm.month
            putData['fromStatisticDate'] = vm.fromDateFormatted
            putData['toStatisticDate'] = vm.toDateFormatted
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
            vm.isShowLoading = false
          })
        } else {
          // vm.agencyLists = []
          vm.isShowLoading = false
        }
      })
    },
    changeYear (item) {
      let vm = this
      vm.year = item
      if (vm.documentTYPE === 'REPORT_01') {
        if (vm.year) {
          vm.fromDateFormatted = ''
          vm.toDateFormatted = ''
        }
        router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            // month: vm.month,
            fromDate: '',
            toDate: '',
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      } else {
        router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            // month: vm.month,
            fromDate: vm.fromDate,
            toDate: vm.toDate,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      if (vm.documentTYPE === 'REPORT_01') {
        vm.fromDateFormatted = ''
        vm.toDateFormatted = ''
        router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            month: vm.month,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      } else {
        router.push({
          path: '/bao-cao/' + vm.index,
          query: {
            year: vm.year,
            month: vm.month,
            fromDate: vm.fromDate,
            toDate: vm.toDate,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    },
    changeGov (item) {
      let vm = this
      vm.govAgency = item
      router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          // month: vm.month,
          fromDate: vm.fromDateFormatted,
          toDate: vm.toDateFormatted,
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeFromDate () {
      let vm = this
      vm.menufromDate = false
      vm.fromDateFormatted = vm.formatDate(vm.fromDate)
      if (vm.documentTYPE === 'REPORT_01') {
        vm.year = ''
        // vm.month = '0'
        if (vm.fromDateFormatted && vm.toDateFormatted) {
          router.push({
            path: '/bao-cao/' + vm.index,
            query: {
              fromDate: vm.fromDateFormatted,
              toDate: vm.toDateFormatted,
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }
      } else {
        if (vm.fromDateFormatted && vm.toDateFormatted) {
          router.push({
            path: '/bao-cao/' + vm.index,
            query: {
              year: vm.year,
              month: vm.month,
              fromDate: vm.fromDateFormatted,
              toDate: vm.toDateFormatted,
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }
      }
    },
    changeToDate () {
      let vm = this
      vm.menutoDate = false
      vm.toDateFormatted = vm.formatDate(vm.toDate)
      if (vm.documentTYPE === 'REPORT_01') {
        vm.year = ''
        // vm.month = '0'
        if (vm.fromDateFormatted && vm.toDateFormatted) {
          router.push({
            path: '/bao-cao/' + vm.index,
            query: {
              fromDate: vm.fromDateFormatted,
              toDate: vm.toDateFormatted,
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }
      } else {
        if (vm.fromDateFormatted && vm.toDateFormatted) {
          router.push({
            path: '/bao-cao/' + vm.index,
            query: {
              year: vm.year,
              // month: vm.month,
              fromDate: vm.fromDateFormatted,
              toDate: vm.toDateFormatted,
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }
      }
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
