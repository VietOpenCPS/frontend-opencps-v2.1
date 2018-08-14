<template>
  <div class="form-chitiet">
    <v-flex xs12>
      <v-card style="border-radius: 0;">
        <v-card-title class="headline">
          TÌNH HÌNH GIẢI QUYẾT HỒ SƠ NĂM {{year}}
        </v-card-title>
        <v-card-text class="pt-2 pb-0 pl-5 pr-4" v-if="reloadLine">
          <line-chart-report :item_array="agencyListsMonth" :year="year" gov_agency_code="" :chart_view="true"></line-chart-report>
        </v-card-text>
        <content-placeholders class="my-4 flex xs12 px-2" v-else>
          <content-placeholders-heading />
          <content-placeholders-img />
        </content-placeholders>
      </v-card>
    </v-flex>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import PieChartReport from './PieChartReport.vue'
import BarChartReport from './BarChartReport.vue'
import BarChartReportHorizontal from './BarChartReportHorizontal.vue'
import LineChartReport from './LineChartReport.vue'

export default {
  props: ['year', 'month', 'agency', 'domain'],
  components: {
    'pie-chart-report': PieChartReport,
    'bar-chart-report': BarChartReport,
    'bar-chart-report-horizontal': BarChartReportHorizontal,
    'line-chart-report': LineChartReport
  },
  data: () => ({
    chartView: true,
    currentMonth: ((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1),
    currentDay: (new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate(),
    agencyGroups: [],
    noReportData: false,
    isCallBack: true,
    reloadPie: false,
    reloadLine: false,
    showTable: false,
    agencyLists: [],
    agencyListsMonth: [],
    group: '',
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
    danhSachBaoCaos: [],
    totalCounter: {},
    reportGovName: '',
    govAgencyCode: ''
  }),
  computed: {
    loadingMenuConfigToDo () {
      return this.$store.getters.loadingMenuConfigToDo
    },
    options () {
      return {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.doStaticsReport()
    })
  },
  methods: {
    doStaticsReport () {
      let vm = this
      let filter = {
        year: vm.year,
        reporting: true,
        agency: '',
        report: true
      }
      let tempGov = vm.govAgencyCode
      vm.reloadLine = false
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result === null || result === undefined || result === 'undefined') {
          vm.agencyListsMonth = []
        } else {
          vm.agencyListsMonth = result
        }
        vm.reloadLine = true
      })
    }
  }
}
</script>
