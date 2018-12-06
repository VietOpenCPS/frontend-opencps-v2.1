<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>BÁO CÁO</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex xs6 sm2 class="px-2">
              <v-autocomplete
                :items="years"
                v-model="year"
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeYear"
                >
              </v-autocomplete>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-autocomplete
                :items="months"
                v-model="month"
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeMonth"
                >
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm8 class="px-2 text-right" style="    padding-top: 1px;">
              <v-btn v-if="govAgencyCode === ''" flat class="mx-0 my-0" v-on:click.native="toNativeViewType()">
                <span v-if="chartView">Lĩnh vực</span>
                <span v-else>Đơn vị</span>
              </v-btn>
              <v-btn icon class="mx-0 my-0" v-on:click.native="$vuetify.goTo('#lineChartID', options)">
                <v-icon size="14">show_chart</v-icon>
              </v-btn>
              <v-btn v-if="reportGovName.length > 0 && String(index) !== '1'" flat class="mx-0 my-0" v-on:click.native="toNativeViewBack(index)">
                <v-icon class="mr-2">undo</v-icon> Quay lại 
              </v-btn>
              <v-tooltip bottom>
                <v-btn icon class="mx-0 my-0" slot="activator" v-on:click.native="toNativeView(0)">
                  <v-icon size="14">pie_chart</v-icon>
                </v-btn>
                <span>Xem dạng biểu đồ</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon class="mx-0 my-0" slot="activator" v-on:click.native="toNativeView(1)">
                  <v-icon size="14">grid_on</v-icon>
                </v-btn>
                <span>Xem dạng bảng biểu</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
    <v-layout row wrap style="margin: 0;" v-if="String(index) === '0'">
      <v-flex xs12 sm4 class="mt-4 ml-2 mr-2">
        <v-card class="wrap_report" style="border-radius: 0;">
          <v-card-title class="headline">
            Thống kê thủ tục hành chính
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0">
            <v-list class="pt-0">
              <v-list-tile v-for="item in levelList" :key="item.level">
                <v-list-tile-content>
                  <v-list-tile-title>Mức độ {{item.level}}</v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 class="mt-4 ml-2 mr-2">
        <v-card class="wrap_report mx-2" style="border-radius: 0;">
          <v-card-title class="headline">
            Tổng hợp tình hình giải quyết hồ sơ năm {{year}}
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0" v-if="showTableTotal">
            <pie-chart-report-public :item="itemTotal" :year="year" :month="month" :chart_view="chartView"></pie-chart-report-public>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-card class="wrap_report xs12 flex" style="border-radius: 0;">
        <v-card-text class="py-2 px-1 layout row wrap" style="
            background: #fafafa;
            margin: 0;
        ">
          <v-flex xs12 sm4 class="px-2" v-for="(item, index) in agencyLists" v-bind:key="index" v-if="((govAgencyCode === '' && item.govAgencyName !== '') || (govAgencyCode !== '' && item.domainName !== '') || (!chartView && item.domainName !== '')) && reloadPie">
            <pie-chart-report :item="item" :year="year" :month="month" :chart_view="chartView"></pie-chart-report>
          </v-flex>
        </v-card-text>
      </v-card>
      <v-flex xs12 class="mt-4 ml-2 mr-2" v-if="!reloadBar">
        <v-card class="wrap_report" style="border-radius: 0;">
          <v-card-title class="headline">
            Tình hình giải quyết hồ sơ tháng {{month}} năm {{year}}
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0">
            <apexchart type="bar" height="350"
              :options="chartOptionsBarTotal" 
              :series="seriesChartBarTotal" 
              :stacked="true"
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>
      <content-placeholders class="my-4 flex xs12 px-2" v-else>
        <content-placeholders-heading />
        <content-placeholders-img />
      </content-placeholders>
      <v-flex xs12 class="mt-4 ml-2 mr-2" v-if="!reloadBar">
        <v-card class="wrap_report" style="border-radius: 0;">
          <v-card-title class="headline">
            Tình hình giải quyết hồ sơ tháng {{month}} năm {{year}}
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0">
            <apexchart type="bar" height="350"
              :options="chartOptionsBar" 
              :series="seriesChartBar" 
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>
      <content-placeholders class="my-4 flex xs12 px-2" v-else>
        <content-placeholders-heading />
        <content-placeholders-img />
      </content-placeholders>
      <v-flex xs12 class="mt-4 ml-2 mr-2" v-if="!reloadLine">
        <v-card class="wrap_report" style="border-radius: 0;">
          <v-card-title class="headline">
            Tình hình giải quyết hồ sơ năm {{year}}
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0">
            <apexchart type="line" height="450"
              :options="chartOptions" 
              :series="seriesChart" 
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>
      <content-placeholders class="my-4 flex xs12 px-2" v-else>
        <content-placeholders-heading />
        <content-placeholders-img />
      </content-placeholders>
    </v-layout>
    <div v-if="String(index) === '1'">
      <v-card class="py-4" style="border-radius: 0;box-shadow: none;
        border-bottom: 1px solid #ddd;">
        <v-card-text>
          <v-layout wrap id="contentToPDF">
            <v-flex xs6 class="text-center text-bold">
            </v-flex>
            <v-flex xs6 class="text-center text-bold">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM <br/>
              Độc lập - Tự do - Hạnh phúc 
              <hr align="center" width="120px" style="margin: auto;">
            </v-flex>
            <v-flex xs6 class="text-center text-bold">
            </v-flex>
            <v-flex xs6 class="text-center mt-2">
              Ngày {{currentDay}} tháng {{currentMonth}} năm {{(new Date()).getFullYear()}} 
            </v-flex>
            <v-flex xs12 class="text-center text-bold mt-3 fs14">
              BÁO CÁO TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH <br/>
              <span v-if="String(month) !== '0'">Tháng {{month}}</span> Năm {{year}}
            </v-flex>
            <div class="mt-3 report__table">
              <table>
                <thead>
                  <tr>
                    <th rowspan="5" colspan="1" width="40"> <span v-if="govAgencyCode !== '' || String(chartView) === 'false'">Lĩnh vực</span> <span v-else>Đơn vị</span></th>
                    <th rowspan="5" colspan="1" width="40">Tổng số</th>
                    <th rowspan="5" colspan="1" width="40">Từ chối tiếp nhận trong kỳ</th>
                    <th rowspan="5" colspan="1" width="40">Hồ sơ rút không giải quyết</th>
                    <th rowspan="1" colspan="5">Nhận giải quyết</th>
                    <th rowspan="1" colspan="15">Kết quả giải quyết</th>
                  </tr>
                  <tr>
                    <th rowspan="4" colspan="1" width="40">Tổng số</th>
                    <th rowspan="4" colspan="1" width="40">Tồn trước</th>
                    <th rowspan="1" colspan="3">Nhận trong kỳ</th>
                    <th rowspan="1" colspan="9">Hồ sơ đã có kết quả</th>
                    <th rowspan="1" colspan="4">Đang giải quyết</th>
                    <th rowspan="4" colspan="1" width="40">Tạm dừng bổ sung điều kiện</th>
                    <th rowspan="4" colspan="1" width="40">% trước và đúng hạn</th>
                  </tr>
                  <tr>
                    <th rowspan="3" width="40">Tổng số</th>
                    <th rowspan="3" width="40">Một cửa</th>
                    <th rowspan="3" width="40">Trực tuyến</th>
                    <th rowspan="3" width="40">Tổng số</th>
                    <th colspan="5">Tình trạng thực hiện</th>
                    <th colspan="2">Trả kết quả</th>
                    <th rowspan="3" width="40">Từ chối giải quyết</th>
                    <th rowspan="3" width="40">Tổng số</th>
                    <th rowspan="3" width="40">Còn hạn giải quyết</th>
                    <th rowspan="3" width="40">Quá hạn giải quyết</th>
                    <th rowspan="3" width="40">Đang xử lý ngoài đơn vị</th>
                  </tr>
                  <tr>
                    <th rowspan="2" width="40">Trước hạn</th>
                    <th rowspan="2" width="40">Đúng hạn</th>
                    <th colspan="3">Quá hạn</th>
                    <th rowspan="2" width="40">Đã trả</th>
                    <th rowspan="2" width="40">Chưa trả</th>
                  </tr>
                  <tr>
                    <th width="40">Tổng số</th>
                    <th width="40">Trong đơn vị</th>
                    <th width="40">Ngoài đơn vị</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="note__column">
                    <td align="center">1</td>
                    <td align="center">2</td>
                    <td align="center">3</td>
                    <td align="center">4</td>
                    <td align="center">5</td>
                    <td align="center">6</td>
                    <td align="center">7</td>
                    <td align="center">8</td>
                    <td align="center">9</td>
                    <td align="center">10</td>
                    <td align="center">11</td>
                    <td align="center">12</td>
                    <td align="center">13</td>
                    <td align="center">14</td>
                    <td align="center">15</td>
                    <td align="center">16</td>
                    <td align="center">17</td>
                    <td align="center">18</td>
                    <td align="center">19</td>
                    <td align="center">20</td>
                    <td align="center">21</td>
                    <td align="center">22</td>
                    <td align="center">23</td>
                    <td align="center">24</td>
                  </tr>
                  <tr v-for="(item, index) in agencyLists" v-bind:key="index" v-if="((govAgencyCode === '' || String(chartView) === 'true') && item.govAgencyName !== '') || ((govAgencyCode !== ''  || String(chartView) === 'false') && item.domainName !== '')">
                    <td v-if="govAgencyCode !== '' || String(chartView) === 'false'" align="center">{{item.domainName}}</td>
                    <td v-else align="center">{{item.govAgencyName}}</td>
                    <td align="center">{{item.totalCount}}</td>
                    <td align="center">{{item.deniedCount}}</td>
                    <td align="center">{{item.cancelledCount}}</td>
                    <td align="center">{{item.processCount}}</td>
                    <td align="center">{{item.remainingCount}}</td>
                    <td align="center">{{item.receivedCount}}</td>
                    <td align="center">{{item.onegateCount}}</td>
                    <td align="center">{{item.onlineCount}}</td>
                    <td align="center">{{item.releaseCount}}</td>
                    <td align="center">{{item.betimesCount}}</td>
                    <td align="center">{{item.ontimeCount}}</td>
                    <td align="center">{{item.overtimeCount}}</td>
                    <td align="center">{{item.overtimeInside}}</td>
                    <td align="center">{{item.overtimeOutside}}</td>
                    <td align="center">{{item.doneCount}}</td>
                    <td align="center">{{item.releasingCount}}</td>
                    <td align="center">{{item.unresolvedCount}}</td>
                    <td align="center">{{item.processingCount}}</td>
                    <td align="center">{{item.undueCount}}</td>
                    <td align="center">{{item.overdueCount}}</td>
                    <td align="center">{{item.outsideCount}}</td>
                    <td align="center">{{item.waitingCount}}</td>
                    <td align="center">{{item.ontimePercentage}}</td>
                  </tr>
                  <tr class="sum__column" style="font-weight: bold;" v-if="showTable">
                    <td align="center">Tổng số <br> <span v-if="agencyLists !== null && agencyLists.length > 0"> {{agencyLists.length - 1}} </span></td>
                    <td align="center ">{{totalCounter['total_3']}}</td>
                    <td align="center">{{totalCounter['total_4']}}</td>
                    <td align="center">{{totalCounter['total_5']}}</td>
                    <td align="center">{{totalCounter['total_6']}}</td>
                    <td align="center">{{totalCounter['total_7']}}</td>
                    <td align="center">{{totalCounter['total_8']}}</td>
                    <td align="center">{{totalCounter['total_9']}}</td>
                    <td align="center">{{totalCounter['total_10']}}</td>
                    <td align="center">{{totalCounter['total_11']}}</td>
                    <td align="center">{{totalCounter['total_12']}}</td>
                    <td align="center">{{totalCounter['total_13']}}</td>
                    <td align="center">{{totalCounter['total_14']}}</td>
                    <td align="center">{{totalCounter['total_15']}}</td>
                    <td align="center">{{totalCounter['total_16']}}</td>
                    <td align="center">{{totalCounter['total_17']}}</td>
                    <td align="center">{{totalCounter['total_18']}}</td>
                    <td align="center">{{totalCounter['total_19']}}</td>
                    <td align="center">{{totalCounter['total_20']}}</td>
                    <td align="center">{{totalCounter['total_21']}}</td>
                    <td align="center">{{totalCounter['total_22']}}</td>
                    <td align="center">{{totalCounter['total_23']}}</td>
                    <td align="center">{{totalCounter['total_24']}}</td>
                    <td align="center">{{totalCounter['total_25']}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>

import { PieChartReport, PieChartReportPublic } from '@/components'

export default {
  props: ['index', 'id'],
  components: {
    PieChartReport,
    PieChartReportPublic
  },
  data: () => ({
    itemTotal: {},
    levelList: [],
    chartView: true,
    currentMonth: ((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1),
    currentDay: (new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate(),
    agencyGroups: [],
    noReportData: false,
    isCallBack: true,
    reloadPie: true,
    reloadBar: true,
    reloadLine: true,
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
    govAgencyCode: '',
    chartOptions: {
      xaxis: {
        categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      },
      colors: ['#77B6EA', '#545454'],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      }
    },
    toolbar: {
      show: false
    },
    seriesChart: [{
      name: 'Series A',
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    }, {
      name: 'Series B',
      data: [23, 43, 54, 12, 44, 52, 32, 11]
    }],
    chartOptionsBar: {
    },
    seriesChartBar: [{
      data: [0]
    }],
    chartOptionsBarTotal: {
    },
    seriesChartBarTotal: [],
    labelOfLine: [],
    showTableTotal: false
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
    var vm = this
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      let currentQuerys = vm.$router.history.current.query
      if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
        vm.isCallBack = false
        vm.reportGovName = ''
        vm.govAgencyCode = ''
        if (currentQuerys.hasOwnProperty('year')) {
          vm.year = currentQuerys.year
        }
        if (currentQuerys.hasOwnProperty('month')) {
          vm.month = currentQuerys.month
        }
        if (currentQuerys.hasOwnProperty('group')) {
          vm.group = currentQuerys.group
        }
        if (currentQuerys.hasOwnProperty('reportGovName')) {
          vm.reportGovName = currentQuerys.reportGovName
        }
        if (currentQuerys.hasOwnProperty('govAgencyCode')) {
          vm.govAgencyCode = currentQuerys.govAgencyCode
        }
        if (currentQuerys.hasOwnProperty('chartView')) {
          vm.chartView = (currentQuerys.chartView === 'true')
        }
        vm.doStaticsReport()
        vm.$store.dispatch('getLevelList').then(function (result) {
          vm.levelList = result
        })
        vm.showTableTotal = false
        vm.$store.dispatch('getReportTotal').then(function (result) {
          let agencyListsTotal = result
          for (let key in agencyListsTotal) {
            let currentData = agencyListsTotal[key]
            if (currentData.domainName === '' && currentData.domainName === '') {
              vm.itemTotal = {
                undueCount: currentData.undueCount,
                overdueCount: currentData.overdueCount,
                waitingCount: currentData.waitingCount,
                betimesCount: currentData.betimesCount,
                ontimeCount: currentData.ontimeCount,
                overtimeCount: currentData.overtimeCount,
                ontimePercentage: currentData.ontimePercentage,
              }
              vm.showTableTotal = true
              break
            }
          }
          
        })
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      console.debug(oldRoute)
      let currentQuerys = newRoute.query
      vm.reportGovName = ''
      vm.govAgencyCode = ''
      console.log('currentQuerys', currentQuerys)
      if (currentQuerys.hasOwnProperty('year')) {
        vm.year = currentQuerys.year + ''
      } else {
        vm.year = (new Date()).getFullYear() + ''
      }
      if (currentQuerys.hasOwnProperty('month')) {
        vm.month = currentQuerys.month + ''
      } else {
        vm.month = ((new Date()).getMonth() + 1) + ''
      }
      if (currentQuerys.hasOwnProperty('reportGovName')) {
        vm.reportGovName = currentQuerys.reportGovName
      }
      if (currentQuerys.hasOwnProperty('reportGovName')) {
        vm.reportGovName = currentQuerys.reportGovName
      }
      if (currentQuerys.hasOwnProperty('govAgencyCode')) {
        vm.govAgencyCode = currentQuerys.govAgencyCode
      }
      if (currentQuerys.hasOwnProperty('chartView')) {
        if (currentQuerys.chartView === 'true' || currentQuerys.chartView) {
          vm.chartView = true
        } else {
          vm.chartView = false
        }
      }
      vm.doStaticsReport()
    }
  },
  methods: {
    toNativeViewType () {
      let vm = this
      let currentQuerys = vm.$router.history.current.query
      if (currentQuerys.hasOwnProperty('chartView')) {
        let changTypeCHK = (currentQuerys.chartView === 'true' || currentQuerys.chartView)
        console.log('changTypeCHK', changTypeCHK)
        if (String(changTypeCHK) === 'true') {
          vm.chartView = false
          console.log('changTypeCHK1', vm.chartView)
        } else {
          vm.chartView = true
          console.log('changTypeCHK2', vm.chartView)
        }
      } else {
        vm.chartView = !vm.chartView
      }
      console.log('toNativeViewType', vm.chartView)
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          chartView: vm.chartView
        }
      })
    },
    toNativeViewBack (data) {
      let vm = this
      vm.$router.push({
        path: '/bao-cao/' + data,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group
        }
      })
    },
    toNativeView (data) {
      let vm = this
      vm.$router.push({
        path: '/bao-cao/' + data,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode
        }
      })
    },
    doStaticsReport () {
      let vm = this
      let filter = {
        year: vm.year,
        month: vm.month,
        group: vm.group,
        reporting: true,
        agency: vm.govAgencyCode,
        report: vm.chartView ? false : 'linemonth'
      }
      let tempGov = vm.govAgencyCode
      if (vm.chartView) {
        filter.report = true
        let currentQuerys = vm.$router.history.current.query
        if (currentQuerys.hasOwnProperty('govAgencyCode')) {
          vm.govAgencyCode = currentQuerys.govAgencyCode
          tempGov = vm.govAgencyCode
          if (tempGov !== '') {
            filter.report = false
          }
        }
      } else {
        vm.govAgencyCode = ''
        filter.agency = 'total'
      }
      vm.reloadPie = false
      vm.reloadBar = true

      vm.totalCounter['total_3'] = 0
      vm.totalCounter['total_4'] = 0
      vm.totalCounter['total_5'] = 0
      vm.totalCounter['total_6'] = 0
      vm.totalCounter['total_7'] = 0
      vm.totalCounter['total_8'] = 0
      vm.totalCounter['total_9'] = 0
      vm.totalCounter['total_10'] = 0
      vm.totalCounter['total_11'] = 0
      vm.totalCounter['total_12'] = 0
      vm.totalCounter['total_13'] = 0
      vm.totalCounter['total_14'] = 0
      vm.totalCounter['total_15'] = 0
      vm.totalCounter['total_16'] = 0
      vm.totalCounter['total_17'] = 0
      vm.totalCounter['total_18'] = 0
      vm.totalCounter['total_19'] = 0
      vm.totalCounter['total_20'] = 0
      vm.totalCounter['total_21'] = 0
      vm.totalCounter['total_22'] = 0
      vm.totalCounter['total_23'] = 0
      vm.totalCounter['total_24'] = 0
      vm.totalCounter['total_25'] = 0
      vm.showTable = false
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result === null || result === undefined || result === 'undefined') {
          vm.noReportData = true
          vm.agencyLists = []
        } else {
          vm.noReportData = false
          vm.agencyLists = result
        }
        vm.doProcessReport2(vm.agencyLists)
        for (let key in vm.agencyLists) {
          let currentData = vm.agencyLists[key]
          if (currentData.domainName === '' && currentData.domainName === '') {
            vm.totalCounter['total_3'] = currentData.totalCount
            vm.totalCounter['total_4'] = currentData.deniedCount
            vm.totalCounter['total_5'] = currentData.cancelledCount
            vm.totalCounter['total_6'] = currentData.processCount
            vm.totalCounter['total_7'] = currentData.remainingCount
            vm.totalCounter['total_8'] = currentData.receivedCount
            vm.totalCounter['total_9'] = currentData.onegateCount
            vm.totalCounter['total_10'] = currentData.onlineCount
            vm.totalCounter['total_11'] = currentData.releaseCount
            vm.totalCounter['total_12'] = currentData.betimesCount
            vm.totalCounter['total_13'] = currentData.ontimeCount
            vm.totalCounter['total_14'] = currentData.overtimeCount
            vm.totalCounter['total_15'] = currentData.overtimeInside
            vm.totalCounter['total_16'] = currentData.overtimeOutside
            vm.totalCounter['total_17'] = currentData.doneCount
            vm.totalCounter['total_18'] = currentData.releasingCount
            vm.totalCounter['total_19'] = currentData.unresolvedCount
            vm.totalCounter['total_20'] = currentData.processingCount
            vm.totalCounter['total_21'] = currentData.undueCount
            vm.totalCounter['total_22'] = currentData.overdueCount
            vm.totalCounter['total_23'] = currentData.outsideCount
            vm.totalCounter['total_24'] = currentData.waitingCount
            vm.totalCounter['total_25'] = currentData.ontimePercentage
            vm.showTable = true
            break
          }
        }
        vm.reloadPie = true
      })
      setTimeout(() => {
        filter = {
          year: vm.year,
          group: vm.group,
          agency: tempGov,
          report: vm.chartView ? true : 'linemonth'
        }
        if (!vm.chartView) {
          filter.agency = 'total'
          filter.report = 'linemonth'
        } else {
          if (tempGov !== '') {
            filter.agency = tempGov
            filter.report = false
          } else {
            filter.agency = ''
            filter.report = true
          }
        }
        vm.reloadLine = true
        vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
          let dataReport1 = []
          if (result === null || result === undefined || result === 'undefined') {
          } else {
            dataReport1 = result
          }
          vm.doProcessReport1(dataReport1)
        })
      }, 200)
    },
    changeYear (item) {
      let vm = this
      vm.year = item
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode
        }
      })
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      console.log('changeMonth', vm.year)
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode
        }
      })
    },
    changeDonVi (item) {
      let vm = this
      vm.agency = item
      vm.$router.push({
        path: '/bao-cao/' + vm.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.reportGovName,
          govAgencyCode: vm.govAgencyCode
        }
      })
    },
    doProcessReport1 (data) {
      let vm = this
      let datasetsCustom = []
      let labelsCustomMonth = {}
      let monthData = {}
      for (let key in data) {
        if (String(data[key].govAgencyCode) === '' && String(data[key].domainName) === '') {
        } else {
          if (data[key].month > 0) {
            labelsCustomMonth['' + data[key].month] = 'T ' + data[key].month
            if (data[key].govAgencyName !== '') {
              if (monthData[data[key].govAgencyName] !== null && monthData[data[key].govAgencyName] !== undefined) {
                monthData[data[key].govAgencyName].push({
                  month: data[key].month,
                  total: data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
                })
              } else {
                monthData[data[key].govAgencyName] = []
                monthData[data[key].govAgencyName].push({
                  month: data[key].month,
                  total: data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
                })
              }
            }
          }
        }
      }
      for (let key in monthData) {
        let lineProcessData = {
          label: key,
          borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
          backgroundColor: 'transparent',
          data: []
        }
        for (let keyArray in monthData[key]) {
          lineProcessData.data.push(monthData[key][keyArray].total)
        }
        datasetsCustom.push(lineProcessData)
      }
      vm.chartOptions.xaxis.categories = Object.values(labelsCustomMonth)
      vm.chartOptions.colors = []
      vm.seriesChart = []
      for (let key in datasetsCustom) {
        vm.seriesChart.push({
          name: datasetsCustom[key]['label'],
          data: datasetsCustom[key]['data'].reverse()
        })
        vm.chartOptions.colors.push(datasetsCustom[key]['borderColor'])
      }
      vm.reloadLine = false
    },
    doProcessReport2 (data) {
      let vm = this
      let datasetsCustom = []
      let labelsCustomMonth = {}
      let undueCountData = []
      let overdueCountData = []
      let waitingCountData = []
      let betimesCountData = []
      let ontimeCountData = []
      let overtimeCountData = []
      let currentQuerys = vm.$router.history.current.query
      for (let key in data) {
        if (String(data[key].govAgencyName) === '' && String(data[key].domainName) === '') {
        } else {
          if (data[key].month > 0) {
            labelsCustomMonth[data[key].govAgencyName] = data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
            undueCountData.push(data[key].undueCount)
            overdueCountData.push(data[key].overdueCount)
            waitingCountData.push(data[key].waitingCount)
            betimesCountData.push(data[key].betimesCount)
            ontimeCountData.push(data[key].ontimeCount)
            overtimeCountData.push(data[key].overtimeCount)
          }
        }
      }
      vm.labelOfLine = []
      for (let key in labelsCustomMonth) {
        let lineProcessData = {
          label: key,
          borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
          backgroundColor: 'transparent',
          data: labelsCustomMonth[key]
        }
        datasetsCustom.push(lineProcessData)
      }
     let colorDK = []
     let seriesChartBarData = []
     for (let key in datasetsCustom) {
       console.log('datasetsCustom', datasetsCustom[key]['label'])
       console.log('datasetsCustom chk: ', (datasetsCustom[key]['label'] !== '' && datasetsCustom[key]['label'] !== undefined))
        vm.labelOfLine.push(key)
        seriesChartBarData.push(datasetsCustom[key]['data'])
        colorDK.push(datasetsCustom[key]['borderColor'])
      }
      vm.seriesChartBar = []
      vm.seriesChartBar = [{
        data: seriesChartBarData
      }]
      vm.reloadBar = false
      vm.chartOptionsBar = {}
      vm.chartOptionsBar = {
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom'
            }
          }
        },
        colors: colorDK,
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#fff']
          },
          formatter: function(val, opt) {
            if (String(val) > 0) {
              return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            } else {
              return ''
            }
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: vm.labelOfLine,
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function() {
                return ''
              }
            }
          }
        }
      }
      // report 3
      vm.seriesChartBarTotal = []
      vm.seriesChartBarTotal = [{
        name: 'Đang xử lý còn hạn',
        data: undueCountData
      },{
        name: 'Đang xử lý quá hạn',
        data: overdueCountData
      },{
        name: 'Đang bổ sung điều kiện',
        data: waitingCountData
      },{
        name: 'Đã giải quyết sớm hạn',
        data: betimesCountData
      },{
        name: 'Đã giải quyết đúng hạn',
        data: ontimeCountData
      },{
        name: 'Đã giải quyết quá hạn',
        data: overtimeCountData
      }]
      vm.chartOptionsBarTotal = {}
      vm.chartOptionsBarTotal = {
        plotOptions: {
          bar: {
            barHeight: '100%',
            horizontal: true,
            type: 'bar'
          },
        },
        chart: {
          stacked: true
        },
        colors: ['#A5D6A7', '#EF9A9A', '#78909C', '#90CAF9', '#1565C0', '#C62828'],
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: vm.labelOfLine,
          labels: {
            formatter: function(val) {
              return val
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          }
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function() {
                return ''
              }
            }
          }
        }
      }
    },
    hashCode (str) {
      var hash = 0
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    },
    intToRGB (i) {
      var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
      return '00000'.substring(0, 6 - c.length) + c
    }
  }
}
</script>
