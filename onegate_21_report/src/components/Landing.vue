<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>BÁO CÁO</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex xs6 sm2 class="px-2">
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
            <v-flex xs6 sm2 class="px-2" v-if="documentTYPE === 'REPORT_01'">
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
            </v-flex>
            <v-flex xs6 sm1 class="px-2" v-if="documentTYPE !== 'REPORT_01'">
              <v-subheader class="pl-0 text-header">Từ ngày: </v-subheader>
            </v-flex>
            <v-flex xs6 sm2 class="px-2" v-if="documentTYPE !== 'REPORT_01'">
              <v-menu
                ref="menufromDate"
                :close-on-content-click="false"
                v-model="menufromDate"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="fromDate"
                  append-icon="event"
                  @blur="fromDate = parseDate(fromDateFormatted)"
                ></v-text-field>
                <v-date-picker v-model="fromDate" no-title @input="menufromDate = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6 sm1 class="px-2" v-if="documentTYPE !== 'REPORT_01'">
              <v-subheader class="pl-0 text-header">Đến ngày: </v-subheader>
            </v-flex>
            <v-flex xs6 sm2 class="px-2" v-if="documentTYPE !== 'REPORT_01'">
              <v-menu
                ref="menutoDate"
                :close-on-content-click="false"
                v-model="menutoDate"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="toDate"
                  append-icon="event"
                  @blur="toDate = parseDate(toDateFormatted)"
                ></v-text-field>
                <v-date-picker v-model="toDate" no-title @input="menutoDate = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <vue-friendly-iframe v-if="pdfBlob !== null && pdfBlob !== undefined && pdfBlob !== '' " :src="pdfBlob"></vue-friendly-iframe>
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
    isCallBack: true,
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('vi-VN'),
    menufromDate: false,
    fromDateFormatted: null,
    toDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('vi-VN'),
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
        'name': 'Lọc theo tháng'
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
    month: '0',
    agencyLists: [],
    govAgency: null,
    danhSachBaoCao: [],
    pdfBlob: null,
    documentTYPE: ''
  }),
  computed: {
    loadingMenuConfigToDo () {
      return this.$store.getters.loadingMenuConfigToDo
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.danhSachBaoCao = vm.loadingMenuConfigToDo
      vm.$store.dispatch('getAgencyLists').then(function (result) {
        vm.agencyLists = result
        if (vm.agencyLists !== null && vm.agencyLists !== undefined && vm.agencyLists.length > 0) {
          vm.govAgency = vm.agencyLists[0]
          vm.doPrintReport()
        }
      })
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      if (vm.isCallBack) {
        vm.isCallBack = false
        vm.danhSachBaoCao = vm.loadingMenuConfigToDo
        let currentIndex = 0
        if (currentParams.hasOwnProperty('index')) {
          currentIndex = currentParams.index
        }
        vm.danhSachBaoCao[currentIndex]['active'] = true
        router.push({
          path: '/bao-cao/' + currentIndex
        })
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
    doPrintReport () {
      let vm = this
      vm.documentTYPE = vm.danhSachBaoCao[vm.index].document
      let filter = {
        document: vm.documentTYPE,
        year: vm.year,
        month: vm.month,
        fromDate: vm.fromDate,
        toDate: vm.toDate,
        govAgencyCode: vm.govAgency.itemCode,
        govAgencyName: vm.govAgency.itemName
      }
      vm.pdfBlob = null
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        let putData = {}
        if (result !== null && result !== undefined) {
          putData = result
        }
        if (vm.documentTYPE === 'REPORT_01') {
          putData['year'] = vm.year
          putData['month'] = vm.month
        } else {
          putData['fromDate'] = vm.fromDate
          putData['toDate'] = vm.toDate
        }
        putData['govAgencyCode'] = vm.govAgency.itemCode
        putData['govAgencyName'] = vm.govAgency.itemName
        let filterPostData = {
          document: vm.documentTYPE,
          data: putData
        }
        vm.$store.dispatch('doStatisticReportPrint', filterPostData).then(function (result) {
          vm.pdfBlob = result
        })
      })
    },
    changeYear (item) {
      let vm = this
      vm.year = item
      vm.doPrintReport()
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      vm.doPrintReport()
    },
    changeGov (item) {
      let vm = this
      vm.govAgency = item
      vm.doPrintReport()
    },
    formatDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
  }
}
</script>
