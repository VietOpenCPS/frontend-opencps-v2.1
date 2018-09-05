<template>
  <div class="form-chitiet">
    <v-flex xs12>
      <v-card style="border-radius: 0;">
        <v-card-title class="headline">
          TÌNH HÌNH GIẢI QUYẾT HỒ SƠ NĂM {{year}}
        </v-card-title>
        <v-card-text v-if="reloadLine">
          <v-flex xs12 v-for="(item, index) in agencyLists" v-bind:key="index" v-if="item.month === 0 && reloadLine">
          <pie-chart-report :item="item" :year="year" :month="month" :chart_view="true"></pie-chart-report>
        </v-flex>
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
import PieChartReportPublic from './PieChartReportPublic.vue'
import BarChartReport from './BarChartReport.vue'
import BarChartReportHorizontal from './BarChartReportHorizontal.vue'
import LineChartReport from './LineChartReport.vue'

export default {
  props: ['year', 'month', 'agency', 'domain'],
  components: {
    'pie-chart-report': PieChartReportPublic,
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
        agency: 'total',
        report: true
      }
      vm.reloadLine = false
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result === null || result === undefined || result === 'undefined') {
          vm.agencyLists = [
            {
              'betimesCount': 0,
              'cancelledCount': 0,
              'companyId': 0,
              'deniedCount': 0,
              'domainCode': '',
              'domainName': '',
              'doneCount': 0,
              'govAgencyCode': '',
              'govAgencyName': '',
              'groupId': 0,
              'insideCount': 0,
              'interoperatingCount': 0,
              'month': 0,
              'onegateCount': 0,
              'onlineCount': 0,
              'ontimeCount': 0,
              'ontimePercentage': 0,
              'outsideCount': 0,
              'overdueCount': 0,
              'overtimeCount': 0,
              'overtimeInside': 0,
              'overtimeOutside': 0,
              'processCount': 0,
              'processingCount': 0,
              'receivedCount': 0,
              'releaseCount': 0,
              'releasingCount': 0,
              'remainingCount': 0,
              'reporting': false,
              'totalCount': 0,
              'undueCount': 0,
              'unresolvedCount': 0,
              'waitingCount': 0,
              'year': 2018
            }
          ]
        } else {
          vm.agencyLists = result
        }
        vm.reloadLine = true
      })
    }
  }
}
</script>
