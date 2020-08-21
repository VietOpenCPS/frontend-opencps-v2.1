<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>BÁO CÁO</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex xs6 sm2 class="px-2">
              <v-select
                :items="years"
                v-model="year"
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeYear"
                >
              </v-select>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-select
                :items="months"
                v-model="month"
                item-text="name"
                item-value="value"
                :hide-selected="true"
                @change="changeMonth"
                >
              </v-select>
            </v-flex>
            <v-flex xs12 sm8 class="px-2 text-right" style="padding-top: 1px;">
              <!-- <v-btn v-if="govAgencyCode === ''" flat class="mx-0 my-0" v-on:click.native="toNativeViewType()">
                <span v-if="chartView">Lĩnh vực</span>
                <span v-else>Đơn vị</span>
              </v-btn> -->
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
      <v-flex xs12 sm4 class="mt-4" style="">
        <v-card class="wrap_report report_service mr-2" style="border-radius: 0;">
          <v-card-title class="headline">
            Thống kê thủ tục hành chính
          </v-card-title>
          <v-card-text class="py-0 px-0" style="height: 285px;">
            <apexchart type="donut" :options="chartDonutOptions" :series="seriesDonut" height="250"></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 class="mt-4">
        <v-card class="wrap_report report_piechart" style="border-radius: 0;">
          <v-card-title class="headline">
            <span>Tình hình giải quyết hồ sơ năm {{year}}</span>
          </v-card-title>
          <v-card-text class="py-0 px-0" style="height: 285px;">
            <!-- report_1 -->
            <apexchart v-if="showTableTotal" type=donut height=250 :options="chartDonutOptionsChart1" :series="seriesDonutChart1" />
            <span class="d-inline-block total-pie-text">
              <p class="mb-0 text-bold" style="color: #ca0202">Tổng số tiếp nhận: 
                <span style="font-size: 20px">
                  {{itemTotal.processCount}}
                </span>
              </p>
            </span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 class="mt-4">
        <v-card class="wrap_report report_piechart ml-2 mr-0" style="border-radius: 0;">
          <v-card-title class="headline">
            <span>Tình hình giải quyết hồ sơ tháng {{String(month) === '0' ? monthDefault : month}} năm {{year}}</span>
          </v-card-title>
          <v-card-text class="py-0 px-0" style="height: 285px;">
            <!-- report_1 -->
            <apexchart v-if="showTableTotalMonth" type=donut height=250 :options="chartDonutOptionsChart2" :series="seriesDonutChart2" />
            <span class="d-inline-block total-pie-text">
              <p class="mb-0 text-bold" style="color: #ca0202">Tổng số tiếp nhận: 
                <span style="font-size: 20px">
                  {{itemTotalMonth.processCount}}
                </span>
              </p>
            </span>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 class="row_3 mt-4 mx-0" v-if="!reloadBar">
        <v-card class="wrap_report" style="border-radius: 0;">
          <v-card-title class="headline" v-if="String(month) !== '0'">
            Tình hình giải quyết hồ sơ tháng {{month}} năm {{year}}
          </v-card-title>
          <v-card-title class="headline" v-else>
            Tình hình giải quyết hồ sơ năm {{year}}
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0">
            <apexchart type="bar" height="350"  v-if="typeMonthChart === 'stacked'"
              :options="chartOptionsBarTotal" 
              :series="seriesChartBarTotal" 
              :stacked="true"
            ></apexchart>
            <!--  -->
            <apexchart type="bar" height="400" v-else
              :options="chartOptionColumn" 
              :series="seriesChartColumn" 
            ></apexchart>

          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 class="row_4 mt-4 mx-0" v-if="!reloadBar">
        <v-card class="wrap_report" style="border-radius: 0;">
          <v-card-title class="headline" v-if="String(month) !== '0'">
            Tình hình giải quyết hồ sơ tháng {{month}} năm {{year}}
          </v-card-title>
          <v-card-title class="headline" v-else>
            Tình hình giải quyết hồ sơ năm {{year}}
          </v-card-title>
          <v-card-text class="pt-2 pb-0 px-0">
            <apexchart type="bar" height="350"
              :options="chartOptionsBar" 
              :series="seriesChartBar" 
            ></apexchart>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 class="row_5 mt-4 mx-0" v-if="!reloadLine" id="lineChartID">
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
            <v-flex xs7 class="text-center text-bold">
            </v-flex>
            <v-flex xs5 class="text-center text-bold">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM <br/>
              Độc lập - Tự do - Hạnh phúc 
              <hr align="center" width="120px" style="margin: auto;">
            </v-flex>
            <v-flex xs7 class="text-center text-bold">
            </v-flex>
            <v-flex xs5 class="text-center mt-2">
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
                    <th rowspan="5" colspan="1" width="60"><span>STT</span></th>
                    <th rowspan="5" colspan="1"><span v-if="govAgencyCode !== '' || String(chartView) === 'false'">Lĩnh vực</span> <span v-else>Đơn vị</span></th>
                    <th rowspan="1" colspan="5">Nhận giải quyết</th>
                    <th rowspan="1" colspan="7">Kết quả giải quyết</th>

                    <th rowspan="1" colspan="3">Đang giải quyết</th>
                    <th rowspan="5" colspan="1" width="60">Tạm dừng bổ sung điều kiện</th>
                    <th rowspan="5" colspan="1" width="60">Rút không giải quyết</th>
                    <th rowspan="5" colspan="1" width="60">Tỉ lệ sớm và đúng hạn</th>
                  </tr>
                  <tr>
                    <th rowspan="4" colspan="1" width="60">Tổng số</th>
                    <th rowspan="4" colspan="1" width="60">Tồn trước</th>
                    <th rowspan="1" colspan="3">Nhận trong kỳ</th>
                    <th rowspan="4" colspan="1" width="60">Tổng số</th>
                    <th rowspan="1" colspan="3">Tình hình thực hiện</th>
                    <th rowspan="4" colspan="1" width="60">Từ chối giải quyết</th>
                    <th rowspan="1" colspan="2">Trả kết quả</th>
                    <th rowspan="4" colspan="1" width="60">Tổng số</th>
                    <th rowspan="4" colspan="1" width="60">Còn hạn</th>
                    <th rowspan="4" colspan="1" width="60">Quá hạn</th>
                  </tr>
                  <tr>
                    <th rowspan="3" width="60">Tổng số</th>
                    <th rowspan="3" width="60">Một cửa</th>
                    <th rowspan="3" width="60">Trực tuyến</th>
                    <th rowspan="3" width="60">Trước hạn</th>
                    <th rowspan="3" width="60">Đúng hạn</th>
                    <th rowspan="3" width="60">Quá hạn</th>
                    <th rowspan="3" width="60">Đã trả</th>
                    <th rowspan="3" width="60">Chưa trả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="note__column">
                    <td align="center">(1)</td>
                    <td align="center">(2)</td>
                    <td align="center">(3)</td>
                    <td align="center">(4)</td>
                    <td align="center">(5)</td>
                    <td align="center">(6)</td>
                    <td align="center">(7)</td>
                    <td align="center">(8)</td>
                    <td align="center">(9)</td>
                    <td align="center">(10)</td>
                    <td align="center">(11)</td>
                    <td align="center">(12)</td>
                    <td align="center">(13)</td>
                    <td align="center">(14)</td>
                    <td align="center">(15)</td>
                    <td align="center">(16)</td>
                    <td align="center">(17)</td>
                    <td align="center">(18)</td>
                    <td align="center">(19)</td>
                    <td align="center">(20)</td>
                  </tr>
                  <tr v-for="(item, index) in agencyLists" v-bind:key="index" v-if="((govAgencyCode === '' || String(chartView) === 'true') && item.govAgencyName !== '') || ((govAgencyCode !== ''  || String(chartView) === 'false') && item.domainName !== '')">
                    <td align="center">{{index}}</td>
                    <td v-if="govAgencyCode !== '' || String(chartView) === 'false'" align="left" style="padding: 8px 10px;">{{item.domainName}}</td>
                    <td v-else align="left" style="padding: 8px 10px;">{{item.govAgencyName}}</td>
                    <td align="center">{{item.processCount}}</td>
                    <td align="center">{{item.remainingCount}}</td>
                    <td align="center">{{item.receivedCount}}</td>
                    <td align="center">{{item.onegateCount}}</td>
                    <td align="center">{{item.onlineCount}}</td>
                    <td align="center">{{item.releaseCount}}</td>
                    <td align="center">{{item.betimesCount}}</td>
                    <td align="center">{{item.ontimeCount}}</td>
                    <td align="center">{{item.overtimeCount}}</td>
                    <td align="center">{{item.unresolvedCount}}</td>
                    <td align="center">{{item.doneCount}}</td>
                    <td align="center">{{item.releasingCount}}</td>
                    <td align="center">{{item.processingCount}}</td>
                    <td align="center">{{item.undueCount}}</td>
                    <td align="center">{{item.overdueCount}}</td>
                    <td align="center">{{item.waitingCount}}</td>
                    <td align="center">{{item.cancelledCount}}</td>
                    <td align="center">{{item.ontimePercentage}}</td>
                  </tr>
                  <tr class="sum__column" style="font-weight: bold;" v-if="showTable">
                    <td align="center" colspan="2">Tổng số</td>
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
import $ from 'jquery'
export default {
  props: ['index', 'id'],
  components: {
    PieChartReport,
    PieChartReportPublic
  },
  data: () => ({
    showDetailReport: false,
    itemTotal: {},
    itemTotalMonth: {},
    levelList: [],
    totalTTHC: 0,
    chartView: false,
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
        'value': '2020',
        'name': 'Năm 2020'
      },
      {
        'value': '2019',
        'name': 'Năm 2019'
      },
      {
        'value': '2018',
        'name': 'Năm 2018'
      },
      {
        'value': '2017',
        'name': 'Năm 2017'
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
        'name': 'Tháng 1'
      },
      {
        'value': '2',
        'name': 'Tháng 2'
      },
      {
        'value': '3',
        'name': 'Tháng 3'
      },
      {
        'value': '4',
        'name': 'Tháng 4'
      },
      {
        'value': '5',
        'name': 'Tháng 5'
      },
      {
        'value': '6',
        'name': 'Tháng 6'
      },
      {
        'value': '7',
        'name': 'Tháng 7'
      },
      {
        'value': '8',
        'name': 'Tháng 8'
      },
      {
        'value': '9',
        'name': 'Tháng 9'
      },
      {
        'value': '10',
        'name': 'Tháng 10'
      },
      {
        'value': '11',
        'name': 'Tháng 11'
      },
      {
        'value': '12',
        'name': 'Tháng 12'
      }
    ],
    month: ((new Date()).getMonth() + 1) + '',
    monthDefault: ((new Date()).getMonth() + 1) + '',
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
    showTableTotal: false,
    showTableTotalMonth: false,
    typeMonthChart: 'stacked',
    chartOptionColumn: {},
    seriesChartColumn: [],
    chartDonutOptions: {
      labels: ['Mức độ 2', 'Mức độ 3', 'Mức độ 4'],
      colors: ['#8BC34A', '#FFC107', '#FF4560'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 5
              },
              value: {
                show: true,
                fontSize: '24px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 20
              },
              total: {
                show: true,
                label: 'Tổng số',
                color: '#ff5c24'
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false,
        formatter: function(value, { seriesIndex, dataPointIndex, w }) {
          return w.config.series[seriesIndex]
        }
      },
      legend: {
        position: 'bottom',
        bottom: 0,
        fontFamily: 'Roboto, Arial, sans-serif',
        formatter: function(seriesName, opts) {
          return '<span class="text-bold" style="color:' + opts.w.globals.colors[opts.seriesIndex]+ '">' +
           opts.w.globals.series[opts.seriesIndex] + '</span>&nbsp;' + seriesName
        }
      },
    },
    seriesDonut: [0, 0, 0],
    chartDonutOptionsChart1: {
      labels: ['Đang giải quyết', 'Đã giải quyết'],
      colors: ['#8BC34A', '#2196F3'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 5
              },
              value: {
                show: true,
                fontSize: '24px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 20,
                formatter: function (val, w) {
                  let total = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return Math.round((val/total)*100)+' %'
                }
              },
              total: {
                show: true,
                label: 'Đúng hạn',
                color: '#ff5c24',
                formatter: function (w) {
                }
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          }
        },
      },
      legend: {
        position: 'bottom',
        bottom: 0,
        fontFamily: 'Roboto, Arial, sans-serif',
        formatter: function(seriesName, opts) {
          return '<span class="text-bold" style="color:' + opts.w.globals.colors[opts.seriesIndex]+ '">' +
           opts.w.globals.series[opts.seriesIndex] + '</span>&nbsp;' + seriesName
        }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function(val) {
            return val + " hồ sơ"
          },
          title: {
            formatter: function (seriesName) {
              return ''
            }
          }
        },
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        }
      }
    },
    seriesDonutChart1: [0, 0],
    chartDonutOptionsChart2: {
      labels: ['Đang giải quyết', 'Đã giải quyết'],
      colors: ['#8BC34A', '#2196F3'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 5
              },
              value: {
                show: true,
                fontSize: '24px',
                fontFamily: 'Roboto, Arial, sans-serif',
                color: undefined,
                offsetY: 20,
                formatter: function (val, w) {
                  let total = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return Math.round((val/total)*100)+' %'
                }
              },
              total: {
                show: true,
                label: 'Đúng hạn',
                color: '#ff5c24',
                formatter: function (w) {
                }
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          }
        },
      },
      legend: {
        position: 'bottom',
        bottom: 0,
        fontFamily: 'Roboto, Arial, sans-serif',
        formatter: function(seriesName, opts) {
          return '<span class="text-bold" style="color:' + opts.w.globals.colors[opts.seriesIndex]+ '">' +
           opts.w.globals.series[opts.seriesIndex] + '</span>&nbsp;' + seriesName
        }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function(val) {
            return val + " hồ sơ"
          },
          title: {
            formatter: function (seriesName) {
              return ''
            }
          }
        },
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        }
      }
    },
    seriesDonutChart2: [0, 0],
    dataDefault: {
      processCount: 0,
      processingCount: 0,
      releaseCount: 0,
      waitingCount: 0,
      cancelledCount: 0
    }
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
    try {
      vm.typeMonthChart = typeMonthChartConfig ? typeMonthChartConfig : 'stacked'
    } catch (error) {
    }
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
          let totalXXX = 0
          let level2 = 0 
          let level3 = 0
          let level4 = 0  
          for (let key in vm.levelList) {
            if (vm.levelList[key]['level'] === 2) {
              level2 = parseInt(vm.levelList[key]['count'])
            }
            if (vm.levelList[key]['level'] === 3) {
              level3 = parseInt(vm.levelList[key]['count'])
            }
            if (vm.levelList[key]['level'] === 4) {
              level4 = parseInt(vm.levelList[key]['count'])
            }
            totalXXX = totalXXX + parseInt(vm.levelList[key]['count'])
          }
          vm.totalTTHC = totalXXX
          vm.seriesDonut = [level2, level3, level4]
        })
        vm.showTableTotal = false
        vm.showTableTotalMonth = false
        vm.itemTotal = vm.dataDefault
        vm.itemTotalMonth = vm.dataDefault
        let filter = {
          year: vm.year,
          month: 0
        }
        vm.$store.dispatch('getReportTotal', filter).then(function (result) {
          if (result) {
            let agencyListsTotal = result
            for (let key in agencyListsTotal) {
              let currentData = agencyListsTotal[key]
              if (currentData.domainName === '' && currentData.domainName === '') {
                vm.itemTotal = currentData
                vm.showTableTotal = true
                break
              }
            }
            if (vm.itemTotal === null) {
              vm.itemTotal = vm.dataDefault
              vm.showTableTotal = false
            }
          }
          
        })
        let filterMonth = {
          year: vm.year,
          month: String(vm.month) === '0' ? ((new Date()).getMonth() + 1) + '' : vm.month
        }
        vm.$store.dispatch('getReportTotal', filterMonth).then(function (result) {
          if (result) {
            let agencyListsTotal = result
            for (let key in agencyListsTotal) {
              let currentData = agencyListsTotal[key]
              if (currentData.domainName === '' && currentData.domainName === '') {
                vm.itemTotalMonth = currentData
                vm.showTableTotalMonth = true
                break
              }
            }
            if (vm.itemTotalMonth === null) {
              vm.itemTotalMonth = vm.dataDefault
              vm.showTableTotalMonth = false
            }
          }
          
        })
      }
    })
  },
  mounted () {
    let vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
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
    },
    reloadLine (val) {
      let vm = this
      setTimeout(function() {
        $('.apexcharts-menu > .apexcharts-menu-item.exportSVG').text('Tải xuống SVG')
        $('.apexcharts-menu > .apexcharts-menu-item.exportPNG').text('Tải xuống PNG')
      }, 300)
      let currentQuerys = vm.$router.history.current.query
      if (!val && String(vm.index) !== '0' && currentQuerys.hasOwnProperty('lineChart') && currentQuerys['lineChart']) {
        setTimeout(function () {
          vm.$vuetify.goTo('#lineChartID', vm.options)
        }, 300)
      }
    },
    itemTotal (val) {
      // data report_1
      let vm = this
      if (val) {
        vm.seriesDonutChart1[0] = val['processingCount'] 
        vm.seriesDonutChart1[1] = val['releaseCount'] + val['waitingCount'] + val['cancelledCount']
        vm.chartDonutOptionsChart1.plotOptions = {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  color: undefined,
                  offsetY: 5
                },
                value: {
                  show: true,
                  fontSize: '24px',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  color: undefined,
                  offsetY: 20,
                  formatter: function (val, w) {
                    let total = w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                    return Math.round((val/total)*100)+' %'
                  }
                },
                total: {
                  show: true,
                  label: 'Đúng hạn',
                  color: '#ff5c24',
                  formatter: function (w) {
                    return val['ontimePercentage']+' %'
                  }
                }
              }
            }
          }
        }
      } else {
        vm.seriesDonutChart1[0] = 0
        vm.seriesDonutChart1[1] = 0
      }
    },
    itemTotalMonth (val) {
      let vm = this
      if (val) {
        vm.seriesDonutChart2[0] = val['processingCount'] 
        vm.seriesDonutChart2[1] = val['releaseCount'] + val['waitingCount'] + val['cancelledCount']
        vm.chartDonutOptionsChart2.plotOptions = {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  color: undefined,
                  offsetY: 5
                },
                value: {
                  show: true,
                  fontSize: '24px',
                  fontFamily: 'Roboto, Arial, sans-serif',
                  color: undefined,
                  offsetY: 20,
                  formatter: function (val, w) {
                    let total = w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                    return Math.round((val/total)*100)+' %'
                  }
                },
                total: {
                  show: true,
                  label: 'Đúng hạn',
                  color: '#ff5c24',
                  formatter: function (w) {
                    return val['ontimePercentage']+' %'
                  }
                }
              }
            }
          }
        }
      } else {
        vm.seriesDonutChart2[0] = 0 
        vm.seriesDonutChart2[1] = 0
      }
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
    toNativeView (data, lineChart) {
      let vm = this
      let query = {
        year: vm.year,
        month: vm.month,
        group: vm.group,
        reportGovName: vm.reportGovName,
        govAgencyCode: vm.govAgencyCode,
        lineChart: lineChart ? true : false
      }
      vm.$router.push({
        path: '/bao-cao/' + data,
        query: query
      })
      if (lineChart) {
        vm.$vuetify.goTo('#lineChartID', vm.options)
      }
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
        console.log('agencyLists', vm.agencyLists)
        vm.doProcessReport2(vm.agencyLists)
        for (let key in vm.agencyLists) {
          let currentData = vm.agencyLists[key]
          console.log('currentData', currentData)
          if (currentData.domainName === '' && currentData.domainName === '') {
            vm.totalCounter['total_3'] = currentData.processCount
            vm.totalCounter['total_4'] = currentData.remainingCount
            vm.totalCounter['total_5'] = currentData.receivedCount
            vm.totalCounter['total_6'] = currentData.onegateCount
            vm.totalCounter['total_7'] = currentData.onlineCount
            vm.totalCounter['total_8'] = currentData.releaseCount
            vm.totalCounter['total_9'] = currentData.betimesCount
            vm.totalCounter['total_10'] = currentData.ontimeCount
            vm.totalCounter['total_11'] = currentData.overtimeCount
            vm.totalCounter['total_12'] = currentData.unresolvedCount
            vm.totalCounter['total_13'] = currentData.doneCount
            vm.totalCounter['total_14'] = currentData.releasingCount
            vm.totalCounter['total_15'] = currentData.processingCount
            vm.totalCounter['total_16'] = currentData.undueCount
            vm.totalCounter['total_17'] = currentData.overdueCount
            vm.totalCounter['total_18'] = currentData.waitingCount
            vm.totalCounter['total_19'] = currentData.cancelledCount
            vm.totalCounter['total_20'] = currentData.ontimePercentage
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
      vm.showTableTotal = false
      vm.showTableTotalMonth = false
      vm.itemTotal = vm.dataDefault
      vm.itemTotalMonth = vm.dataDefault
      let filter = {
        year: vm.year,
        month: 0
      }
      vm.$store.dispatch('getReportTotal', filter).then(function (result) {
        if (result) {
          let agencyListsTotal = result
          for (let key in agencyListsTotal) {
            let currentData = agencyListsTotal[key]
            if (currentData.domainName === '' && currentData.domainName === '') {
              vm.itemTotal = currentData
              vm.showTableTotal = true
              break
            }
          }
          if (vm.itemTotal === null) {
            vm.itemTotal = vm.dataDefault
            vm.showTableTotal = false
          }
        }
        
      })
      let filterMonth = {
        year: vm.year,
        month: String(vm.month) === '0' ? ((new Date()).getMonth() + 1) + '' : vm.month
      }
      vm.$store.dispatch('getReportTotal', filterMonth).then(function (result) {
        if (result) {
          let agencyListsTotal = result
          for (let key in agencyListsTotal) {
            let currentData = agencyListsTotal[key]
            if (currentData.domainName === '' && currentData.domainName === '') {
              vm.itemTotalMonth = currentData
              vm.showTableTotalMonth = true
              break
            }
          }
          if (vm.itemTotalMonth === null) {
            vm.itemTotalMonth = vm.dataDefault
            vm.showTableTotalMonth = false
          }
        }
        
      })
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
      vm.itemTotalMonth = vm.dataDefault
      vm.showTableTotalMonth = false
      let filterMonth = {
        year: vm.year,
        month: String(vm.month) === '0' ? ((new Date()).getMonth() + 1) + '' : vm.month
      }
      vm.$store.dispatch('getReportTotal', filterMonth).then(function (result) {
        let agencyListsTotal = result
        for (let key in agencyListsTotal) {
          let currentData = agencyListsTotal[key]
          if (currentData.domainName === '' && currentData.domainName === '') {
            vm.itemTotalMonth = currentData
            vm.showTableTotalMonth = true
            break
          }
        }
        if (vm.itemTotalMonth === null) {
          vm.itemTotalMonth = vm.dataDefault
          vm.showTableTotalMonth = false
        }
      })
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
      console.log('dataReport1', data)
      // Bind data report NĂM
      for (let key in data) {
        if (String(data[key].govAgencyCode) === '' && String(data[key].domainName) === '') {
        } else {
          if (data[key].month > 0) {
            labelsCustomMonth['' + data[key].month] = 'T ' + data[key].month
            if (data[key].govAgencyName !== '' && String(data[key].domainName) === '') {
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
            } else {
              if (monthData[data[key].domainName] !== null && monthData[data[key].domainName] !== undefined) {
                monthData[data[key].domainName].push({
                  month: data[key].month,
                  total: data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
                })
              } else {
                monthData[data[key].domainName] = []
                monthData[data[key].domainName].push({
                  month: data[key].month,
                  total: data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
                })
              }
            }
          }
        }
      }
      console.log('monthData', monthData)
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
      console.log('vm.seriesChart', vm.seriesChart)
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
      console.log('dataReport2', data)
      // Bind data report THÁNG
      for (let key in data) {
        if (String(data[key].govAgencyName) === '' && String(data[key].domainName) === '') {
        } else {
          // if (data[key].month > 0) {
            // if (currentQuerys.hasOwnProperty('govAgencyCode') && currentQuerys['govAgencyCode'] !== undefined && currentQuerys['govAgencyCode'] !== '' && String(data[key].domainName) !== '') {
            if (String(data[key].govAgencyName) === '' && String(data[key].domainName) !== '') {
              labelsCustomMonth[data[key].domainName] = data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
            } else {
              labelsCustomMonth[data[key].govAgencyName] = data[key].undueCount + data[key].overdueCount + data[key].waitingCount + data[key].betimesCount + data[key].ontimeCount + data[key].overtimeCount
            }
            undueCountData.push(data[key].undueCount)
            overdueCountData.push(data[key].overdueCount)
            waitingCountData.push(data[key].waitingCount)
            betimesCountData.push(data[key].betimesCount)
            ontimeCountData.push(Number(data[key].betimesCount) + data[key].ontimeCount)
            overtimeCountData.push(data[key].overtimeCount)
          // }
        }
      }
      vm.labelOfLine = []
      console.log('labelsCustomMonth ---', labelsCustomMonth)
      for (let key in labelsCustomMonth) {
        if (key === '') {
          vm.labelOfLine.push('Toàn bộ lĩnh vực')
        } else {
          vm.labelOfLine.push(key)
        }
        let lineProcessData = {
          label: key,
          borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
          backgroundColor: 'transparent',
          data: labelsCustomMonth[key]
        }
        datasetsCustom.push(lineProcessData)
      }
      if (currentQuerys.hasOwnProperty('govAgencyCode') && currentQuerys['govAgencyCode'] !== undefined && currentQuerys['govAgencyCode'] !== '') {
        delete datasetsCustom[0]
      }
     let colorDK = []
     let seriesChartBarData = []
     for (let key in datasetsCustom) {
       console.log('datasetsCustom[key]', datasetsCustom[key])
        seriesChartBarData.push(datasetsCustom[key]['data'])
        colorDK.push(datasetsCustom[key]['borderColor'])
      }
      console.log('seriesChartBarData', seriesChartBarData)
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
      // for report month type column 
      vm.seriesChartColumn = []
      vm.seriesChartColumn = [{
        name: 'Đã giải quyết đúng hạn',
        data: ontimeCountData
      },{
        name: 'Đang xử lý còn hạn',
        data: undueCountData
      },{
        name: 'Đang xử lý quá hạn',
        data: overdueCountData
      }]
      vm.chartOptionColumn = {}
      vm.chartOptionColumn = {
        plotOptions: {
          bar: {
            barHeight: '100%',
            columnWidth: '70%',
            type: 'bar'
          },
        },
        chart: {
          stacked: false
        },
        colors: ['#00E396', '#FEB019', '#FF4560'],
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
