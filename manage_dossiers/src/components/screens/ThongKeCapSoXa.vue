<template>
  <div style="width: 1300px; margin: 0 auto">
    <v-layout wrap>
      <v-flex xs12 md5 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="height: 100%; border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THEO NĂM</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  style="width: 150px; display:inline-block; margin: 0 10px;"
                  :items="yearList"
                  item-value="value"
                  item-text="name"
                  v-model="yearSelected"
                  @change="getStatisticsYear"
                ></v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap align-center style="margin-top: 25px;">
            <v-flex md6 xs12>
              <apexchart
                type="pie"
                width=400 height=250
                :options="chartOptionsYear"
                :series="statisticalYear"
                class="pieChartTotal"
              ></apexchart>
            </v-flex>
            <v-flex md6 xs12>
              <v-layout wrap class="run-down">
                <v-flex xs12 text-center class="px-3">
                  <span style="color:#1976d2;">{{statistics.receivedCount}}</span>
                  <p>Tổng số đã tiếp nhận</p>
                </v-flex>
                <v-flex xs12 text-center class="px-3">
                  <span style="color:#1976d2;">{{statistics.releaseCount}}</span>
                  <p>Hoàn thành</p>
                </v-flex>
                <v-flex xs12 text-center class="px-3">
                  <span style="color:#1976d2;">{{statistics.processingCount}}</span>
                  <p>Đang xử lý</p>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 md7 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header mb-1" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THEO THÁNG</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  style="width: 150px; display:inline-block; margin: 0 10px;"
                  :items="yearList"
                  item-value="value"
                  item-text="name"
                  v-model="yearSelectedColumn"
                  @change="getStatisticsMonth"
                ></v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart class="colum-chart" type="bar" height="300" :options="chartOptionsColumn" :series="seriesColumn"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1" style="width: auto;">THỐNG KÊ TỔNG HỢP</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  v-model="monthSelected"
                  :items="monthList"
                  style="width: 120px; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                  @change="getStatisticsReport"
                ></v-select>
                <v-select
                  v-model="yearSelected2"
                  :items="yearList"
                  style="width: 120px; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                  @change="getStatisticsReport"
                ></v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap>
            <v-flex xs12 class="my-2 report__table" style="overflow: hidden;">
              <v-flex xs12 class="text-center text-bold my-3">
                TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT HỒ SƠ <br/>
                <span v-if="String(monthSelected) !== '0'">Tháng {{monthSelected}}</span> Năm {{yearSelected2}}
              </v-flex>
              <table class="my-2" hide-default-footer>
                <thead>
                  <tr>
                    <th rowspan="3" class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th rowspan="3" class="text-center px-2">
                      <span>Lĩnh vực</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2 py-1">
                      <span>Số đầu kỳ</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Kỳ trước chuyển qua</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Tiếp nhận trong kỳ</span>
                    </th>
                    <th colspan="7" class="px-2">
                      <span>Kết quả giải quyết trong kỳ</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2 py-1">
                      <span>Tổng số trễ hạn</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Hồ sơ trả lại</span>
                    </th>
                    <th width="80" rowspan="3" class="text-center px-2">
                      <span>Hồ sơ rút</span>
                    </th>
                  </tr>
                  <tr>
                    <th colspan="4" class="text-center px-2 py-2">
                      <span>Hồ sơ đã giải quyết xong</span>
                    </th>
                    <th colspan="3" class="text-center px-2 py-2">
                      <span>Hồ sơ đang giải quyết</span>
                    </th>
                  </tr>
                  <tr>
                    <th width="80" class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Sớm hạn</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Đúng hạn</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Trễ hạn</span>
                    </th>
                    <th width="80" class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Chưa đến hạn</span>
                    </th>
                    <th width="60" class="text-center px-2">
                      <span>Quá hạn</span>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="loadingTable">
                  <content-placeholders class="my-2">
                    <content-placeholders-text :lines="5" />
                  </content-placeholders>
                </tbody>
                <tbody v-if="!loadingTable && danhSachThongKe.length > 0">
                  <tr class="note__column">
                    <td align="center" class="px-2">(1)</td>
                    <td align="center" class="px-2">(2)</td>
                    <td align="center" class="px-2">(3 = 4 + 5)</td>
                    <td align="center" class="px-2">(4)</td>
                    <td align="center" class="px-2">(5)</td>
                    <td align="center" class="px-2">(6 = 7 + 8 + 9)</td>
                    <td align="center" class="px-2">(7)</td>
                    <td align="center" class="px-2">(8)</td>
                    <td align="center" class="px-2">(9)</td>
                    <td align="center" class="px-2">(10 = 11 + 12)</td>
                    <td align="center" class="px-2">(11)</td>
                    <td align="center" class="px-2">(12)</td>
                    <td align="center" class="px-2">(13 = 9 + 12)</td>
                    <td align="center" class="px-2">(14)</td>
                    <td align="center" class="px-2">(15)</td>
                  </tr>
                  <tr v-for="(item,index) in danhSachThongKe" :key="index">
                    <td align="center"  class="px-2">{{index + 1}}</td>
                    <td align="left"  class="px-2" style="padding: 8px 10px;">{{item.domainName}}</td>
                    <td align="center"  class="px-2">{{item.processCount}}</td>
                    <td align="center"  class="px-2">{{item.remainingCount}}</td>
                    <td align="center" class="px-2">{{item.receivedCount}}</td>
                    <td align="center" class="px-2">{{item.releaseCount}}</td>
                    <td align="center" class="px-2">{{item.betimesCount}}</td>
                    <td align="center" class="px-2">{{item.ontimeCount}}</td>
                    <td align="center" class="px-2">{{item.overtimeCount}}</td>
                    <td align="center" class="px-2">{{item.processingCount}}</td>
                    <td align="center" class="px-2">{{item.undueCount}}</td>
                    <td align="center" class="px-2">{{item.overdueCount}}</td>
                    <td align="center" class="px-2">{{item.overtimeCount + item.overdueCount}}</td>
                    <td align="center" class="px-2">{{item.deniedCount}}</td>
                    <td align="center" class="px-2">{{item.cancelledCount}}</td>
                  </tr>
                </tbody>
                <tbody v-if="!loadingTable && danhSachThongKe.length === 0">
                  <tr class="note__column">
                    <td align="center" class="px-2">(1)</td>
                    <td align="center" class="px-2">(2)</td>
                    <td align="center" class="px-2">(3 = 4 + 5)</td>
                    <td align="center" class="px-2">(4)</td>
                    <td align="center" class="px-2">(5)</td>
                    <td align="center" class="px-2">(6 = 7 + 8 + 9)</td>
                    <td align="center" class="px-2">(7)</td>
                    <td align="center" class="px-2">(8)</td>
                    <td align="center" class="px-2">(9)</td>
                    <td align="center" class="px-2">(10 = 11 + 12)</td>
                    <td align="center" class="px-2">(11)</td>
                    <td align="center" class="px-2">(12)</td>
                    <td align="center" class="px-2">(13 = 9 + 12)</td>
                    <td align="center" class="px-2">(14)</td>
                    <td align="center" class="px-2">(15)</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="sum__column" style="font-weight: bold;">
                    <td align="center" colspan="2">Tổng số</td>
                    <td align="center" class="px-2">{{totalCounter['total_3']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_4']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_5']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_6']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_7']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_8']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_9']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_10']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_11']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_12']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_13']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_14']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_15']}}</td>
                  </tr>
                </tfoot>
              </table>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>

  </div>
</template>

<script>
import axios from "axios";
import TinyPagination from './Pagination.vue'
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    listDonViSBN: [],
    donViSBN: 'total',
    listDonViHuyen: [],
    donViHuyen: 'total',
    listDonViXa: [],
    donViXa: 'total',
    groupCode: "SBN",
    isLoading: false,
    loadingTable: false,
    yearSelected: new Date().getFullYear(),
    yearSelected2: new Date().getFullYear(),
    yearSelectedColumn: new Date().getFullYear(),
    monthSelected: new Date().getMonth() + 1,
    distGroupSelected: "",
    statisticalYear: [0, 0],
    statisticalSBN: [0, 0, 0, 0, 0, 0],
    statisticalQUAN_HUYEN: [0, 0, 0, 0, 0, 0],
    statisticalXA_PHUONG: [0, 0, 0, 0, 0, 0],
    statisticalMonth: [
      {
        name: "Hồ sơ nộp trực tiếp",
        data: [0, 0]
      },
      {
        name: "Hồ sơ nộp trực tuyến",
        data: [0, 0]
      }
    ],
    chartOptionsYear: {
      labels: ["Hoàn thành đúng hạn", "Hoàn thành trễ hạn"],
      legend: {
        position: 'bottom'
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
      colors: ['#00E396','#FF4560']
    },
    chartOptionsMonth: {
      plotOptions: {
        bar: {
          barHeight: '100%',
          horizontal: window.innerWidth < 600 ? false : true,
          dataLabels: {
            hideOverflowingLabels: true
          }
        },
      },
      chart: {
        stacked: true,
        locales: [{
          "name": "en",
          "options": {
            "toolbar": {
              "exportToSVG": "Tải xuống SVG",
              "exportToPNG": "Tải xuống PNG"
            }
          }
        }]
      },
      colors: ['#8BC34A', '#2196F3'],
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      xaxis: {
        labels: {
          formatter: function(val) {
            return val
          },
          trim: false
        },
        min: 1
      },
      yaxis: {
        title: {
          text: undefined
        },
        labels: {
          offsetX: 0,
          offsetY: 0
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          if (Number(val) > 2) {return val}
          return ''
        },
        style: {
          fontSize: '11px',
          fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
          colors: ['white']
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      }
    },
    chartOptionsSoQuanXa: {
      labels: [
        "Đang giải quyết trong hạn",
        "Đang giải quyết quá hạn",
        "Hoàn thành đúng hạn",
        "Hoàn thành quá hạn",
        "Xin rút",
        "Chờ bổ sung"
      ],
      colors: ['#00E396','#FF4560','#008FFB','#775DD0','#2f8512','#FEB019'],
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
      }
    },
    chartOptionsColumn: {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
            show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " hồ sơ"
          }
        }
      }
    },
    seriesColumn: [],
    seriesColumnDefault: [
      {
        name: 'Đã tiếp nhận',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        name: 'Hoàn thành',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        name: 'Đang xử lý',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ],
    monthList: [
      { name: "Cả năm", value: 0 },
      { name: "Tháng 1", value: 1 },
      { name: "Tháng 2", value: 2 },
      { name: "Tháng 3", value: 3 },
      { name: "Tháng 4", value: 4 },
      { name: "Tháng 5", value: 5 },
      { name: "Tháng 6", value: 6 },
      { name: "Tháng 7", value: 7 },
      { name: "Tháng 8", value: 8 },
      { name: "Tháng 9", value: 9 },
      { name: "Tháng 10", value: 10 },
      { name: "Tháng 11", value: 11 },
      { name: "Tháng 12", value: 12 }
    ],
    listDoiTuong: [],
    statistics: {
      betimesCount: 1,
      cancelledCount: 0,
      companyId: 0,
      deniedCount: 0,
      domainCode: "",
      domainName: "",
      doneCount: 0,
      dossierOnline3Count: 0,
      dossierOnline4Count: 0,
      govAgencyCode: "",
      govAgencyName: "",
      groupId: 1,
      insideCount: 0,
      interoperatingCount: 0,
      month: 0,
      onegateCount: 0,
      onlineCount: 0,
      ontimeCount: 0,
      ontimePercentage: 0,
      outsideCount: 0,
      overdueCount: 0,
      overtimeCount: 0,
      overtimeInside: 0,
      overtimeOutside: 0,
      processCount: 0,
      processingCount: 0,
      receiveDossierSatCount: 0,
      receivedCount: 0,
      releaseCount: 0,
      releaseDossierSatCount: 0,
      releasingCount: 0,
      remainingCount: 0,
      reporting: false,
      saturdayCount: 0,
      system: 0,
      totalCount: 0,
      undueCount: 0,
      unresolvedCount: 0,
      viaPostalCount: 0,
      waitingCount: 0,
      year: 2020
    },
    danhSachThongKe: [],
    quanhuyenSelected: '',
    labelPieChartConfig: '',
    totalCounter: {}
  }),
  computed: {
    yearList() {
      let arr = [];
      let year = new Date().getFullYear();
      for (let i = 0; i <= 3; i++) {
        arr.push({ name: "Năm " + (year - i), value: year - i });
      }
      return arr;
    },
    heightChart() {
      return this.statisticalMonth[0].data.length < 5 ? "300" : "auto";
    }
  },
  created() {
    let vm = this
    vm.$nextTick(() => {
      vm.getStatisticsYear()
      vm.getStatisticsMonth()
      vm.getStatisticsReport()
    })
  },
  watch: {
    
  },
  methods: {
    getStatisticsYear() {
      let vm = this
      let config = {
        url: "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          year: vm.yearSelected,
          month: 0,
          domain: 'total',
          agency: 'total'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          if (response.data.data) {
            vm.statistics = response.data.data[0]
            vm.statisticalYear = [
              response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
              response.data.data[0].overtimeCount
            ];
          } else {
            vm.statisticalYear = [0, 0]
            vm.statistics = {
              receivedCount: 0,
              releaseCount: 0,
              processingCount: 0,
              overtimeCount: 0
            }
          }
        })
        .catch();
    },
    getStatisticsMonth() {
      let vm = this
      let config = {
        url: "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          domain: "total",
          agency: "total",
          year: vm.yearSelectedColumn
        }
      }

      axios
        .request(config)
        .then(function(response) {
          vm.seriesColumn = vm.seriesColumnDefault
          if (response.data.hasOwnProperty('data') && response.data.data) {
            let currentData = response.data.data
            let dataItem1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let dataItem2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let dataItem3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let i = 0; i < currentData.length; i++) {
              if (currentData[i]['month'] && String(currentData[i]['month']) !== '0') {
                let index = Number(currentData[i]['month']) - 1
                dataItem1[index] = currentData[i]['receivedCount']
                dataItem2[index] = currentData[i]['releaseCount']
                dataItem3[index] = currentData[i]['processingCount']
              }
            }
            setTimeout(function () {
              vm.seriesColumn = [
                {
                  name: 'Đã tiếp nhận',
                  data: dataItem1
                }, {
                  name: 'Hoàn thành',
                  data: dataItem2
                }, {
                  name: 'Đang xử lý',
                  data: dataItem3
                }
              ]
            }, 300)
            
          }
        })
        .catch()
    },
    getStatisticsReport() {
      let vm = this
      vm.loadingTable = true
      setTimeout (function () {
        let config = {
        url: "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          agency: "total",
          year: vm.yearSelected2,
          month: vm.monthSelected
        }
      }
      vm.danhSachThongKe = []
      axios
        .request(config)
        .then(function(response) {
          vm.loadingTable = false
          if (response.data.hasOwnProperty('data') && response.data.data) {
            let dataTotal = response.data.data.filter(function (item) {
              return item.domainCode === ''
            })[0]
            let dataRes = response.data.data.filter(function (item) {
              return item.domainCode !== ''
            })
            let sortDomain = function (domain) {
              function compare(a, b) {
                if (a.domainName < b.domainName)
                  return -1
                if (a.domainName > b.domainName)
                  return 1
                return 0
              }
              return domain.sort(compare)
            }
            vm.danhSachThongKe = sortDomain(dataRes)
            let total = {
              'total_3': dataTotal.processCount,
              'total_4': dataTotal.remainingCount,
              'total_5': dataTotal.receivedCount,
              'total_6': dataTotal.releaseCount,
              'total_7': dataTotal.betimesCount,
              'total_8': dataTotal.ontimeCount,
              'total_9': dataTotal.overtimeCount,
              'total_10': dataTotal.processingCount,
              'total_11': dataTotal.undueCount,
              'total_12': dataTotal.overdueCount,
              'total_13': dataTotal.overtimeCount + dataTotal.overdueCount,
              'total_14': dataTotal.deniedCount,
              'total_15': dataTotal.cancelledCount
            }
            vm.totalCounter = total
          } else {
            vm.setTotalCounter()
          }
        })
        .catch(function () {
          vm.loadingTable = false
          vm.setTotalCounter()
        })
      }, 200)
    },
    setTotalCounter () {
      let vm = this
      let total = {
        'total_3': 0,
        'total_4': 0,
        'total_5': 0,
        'total_6': 0,
        'total_7': 0,
        'total_8': 0,
        'total_9': 0,
        'total_10': 0,
        'total_11': 0,
        'total_12': 0,
        'total_13': 0,
        'total_14': 0,
        'total_15': 0
      }
      vm.totalCounter = total
    },
  }
};
</script>
