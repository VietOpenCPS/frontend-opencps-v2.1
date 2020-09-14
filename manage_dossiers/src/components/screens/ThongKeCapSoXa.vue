<template>
  <div style="width: 1300px; margin: 0 auto">
    <v-layout wrap>
      <v-flex xs12 md5 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="height: 100%; border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">THỐNG KÊ THEO NĂM</div>
            <div style="width: 200px;">
              <v-select
                width="200px"
                :items="yearList"
                item-value="value"
                item-text="name"
                v-model="yearSelected"
              ></v-select>
            </div>
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
            <div style="width: 200px;">
              <v-select
                width="200px"
                :items="yearList"
                item-value="value"
                item-text="name"
                v-model="yearSelected"
              ></v-select>
            </div>
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
            <div class="background-triangle-big1" style="width: 228px;">BÁO CÁO TỔNG HỢP</div>
            <v-layout wrap>
              <v-flex class="text-right">
                <v-select
                  v-model="monthSelected"
                  :items="monthList"
                  style="width: 120px; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                ></v-select>
                <v-select
                  v-model="yearSelected2"
                  :items="yearList"
                  style="width: 120px; display:inline-block; margin: 0 10px;"
                  item-text="name"
                  item-value="value"
                ></v-select>
              </v-flex>
            </v-layout>
          </div>
          <v-layout wrap v-if="false">
            <v-flex xs12 class="my-3 report__table" style="overflow: hidden;">
              <v-flex xs12 class="text-center text-bold my-3">
                BÁO CÁO TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH <br/>
                <span v-if="String(monthSelected) !== '0'">Tháng {{monthSelected}}</span> Năm {{yearSelected2}}
              </v-flex>
              <table class="my-2" hide-default-footer>
                <thead>
                  <tr>
                    <th rowspan="3" class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th rowspan="3" class="text-center px-2">
                      <span>Đơn vị</span>
                    </th>
                    <th colspan="5" class="text-center px-2 py-1">
                      <span>Nhận giải quyết</span>
                    </th>
                    <th colspan="7" class="text-center px-2">
                      <span>Kết quả nhận giải quyết</span>
                    </th>
                    <th colspan="3" class="text-center px-2">
                      <span>Đang giải quyết</span>
                    </th>
                    <th rowspan="3" style="text-align: center;" width="60" class="px-2">
                      <span>Tạm dừng bổ sung điều kiện</span>
                    </th>
                    <th rowspan="3" style="text-align: center;" width="60" class="px-2">
                      <span>Rút không giải quyết</span>
                    </th>
                    <th rowspan="3" style="text-align: center;" width="60" class="px-2">
                      <span>Tỉ lệ sớm và đúng hạn</span>
                    </th>
                  </tr>
                  <tr>
                    <th rowspan="2" class="text-center px-2 py-2">
                      <span>Tổng số</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Tồn trước</span>
                    </th>
                    <th colspan="3" class="text-center px-2 py-1">
                      <span>Nhận trong kì</span>
                    </th>
                    <th rowspan="2" class="text-center px-2 py-1">
                      <span>Tổng số</span>
                    </th>
                    <th colspan="3" class="text-center px-2">
                      <span>Tình hình thực hiện</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Từ chối giải quyết</span>
                    </th>
                    <th colspan="2" class="text-center px-2">
                      <span>Trả kết quả</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Còn hạn</span>
                    </th>
                    <th rowspan="2" class="text-center px-2">
                      <span>Quá hạn</span>
                    </th>
                  </tr>
                  <tr>
                    <th class="text-center px-2">
                      <span>Tổng số</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Một cửa</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Trực tuyến</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Trước hạn</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Đúng hạn</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Quá hạn</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Đã trả</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Chưa trả</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr class="note__column">
                    <td align="center" class="px-2">(1)</td>
                    <td align="center" class="px-2">(2)</td>
                    <td align="center" class="px-2">(3)</td>
                    <td align="center" class="px-2">(4)</td>
                    <td align="center" class="px-2">(5)</td>
                    <td align="center" class="px-2">(6)</td>
                    <td align="center" class="px-2">(7)</td>
                    <td align="center" class="px-2">(8)</td>
                    <td align="center" class="px-2">(9)</td>
                    <td align="center" class="px-2">(10)</td>
                    <td align="center" class="px-2">(11)</td>
                    <td align="center" class="px-2">(12)</td>
                    <td align="center" class="px-2">(13)</td>
                    <td align="center" class="px-2">(14)</td>
                    <td align="center" class="px-2">(15)</td>
                    <td align="center" class="px-2">(16)</td>
                    <td align="center" class="px-2">(17)</td>
                    <td align="center" class="px-2">(18)</td>
                    <td align="center" class="px-2">(19)</td>
                    <td align="center" class="px-2">(20)</td>
                  </tr>
                  <tr v-for="(item,index) in danhSachThongKeThang" :key="index">
                    <td align="center"  class="px-2">{{index + 1}}</td>
                    <td align="left"  class="px-2" style="padding: 8px 10px;">{{item.govAgencyName}}</td>
                    <td align="center"  class="px-2">{{item.processCount}}</td>
                    <td align="center"  class="px-2">{{item.remainingCount}}</td>
                    <td align="center" class="px-2">{{item.receivedCount}}</td>
                    <td align="center" class="px-2">{{item.onegateCount}}</td>
                    <td align="center" class="px-2">{{item.onlineCount}}</td>
                    <td align="center" class="px-2">{{item.releaseCount}}</td>
                    <td align="center" class="px-2">{{item.betimesCount}}</td>
                    <td align="center" class="px-2">{{item.ontimeCount}}</td>
                    <td align="center" class="px-2">{{item.overtimeCount}}</td>
                    <td align="center" class="px-2">{{item.unresolvedCount}}</td>
                    <td align="center" class="px-2">{{item.doneCount}}</td>
                    <td align="center" class="px-2">{{item.releasingCount}}</td>
                    <td align="center" class="px-2">{{item.processingCount}}</td>
                    <td align="center" class="px-2">{{item.undueCount}}</td>
                    <td align="center" class="px-2">{{item.overdueCount}}</td>
                    <td align="center" class="px-2">{{item.waitingCount}}</td>
                    <td align="center" class="px-2">{{item.cancelledCount}}</td>
                    <td align="center" class="px-2">{{item.ontimePercentage}}</td>
                  </tr>
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
                    <td align="center" class="px-2">{{totalCounter['total_16']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_17']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_18']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_19']}}</td>
                    <td align="center" class="px-2">{{totalCounter['total_20']}}</td>
                  </tr>
                </tbody>
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
    yearSelected: new Date().getFullYear(),
    yearSelected2: new Date().getFullYear(),
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
    danhSachThongKeThang: [],
    quanhuyenSelected: '',
    labelPieChartConfig: ''
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
    })
  },
  watch: {
    
  },
  methods: {
    getStatisticsYear() {
      let vm = this;
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
          year: vm.yearSelected2
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
            }, 200)
            
          }
        })
        .catch()
    },
    
  }
};
</script>
