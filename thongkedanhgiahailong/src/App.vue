<template>
  <v-app id="app_chart_vue">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <v-card-text class="px-0 py-0">
        <div class="row-header mb-5">
          <div class="background-triangle-big1">THỐNG KÊ ĐÁNH GIÁ HÀI LÒNG CÁN BỘ</div>
          <v-layout wrap>
            <v-flex class="filter-time ml-3">
              <v-select
                v-model="groupSelected"
                :items="listGroup"
                style="width: 350px; display:inline-block; margin: 0 10px;"
                item-text="text"
                item-value="code"
                @change="getStatisticVoting"
              ></v-select>
              <v-select
                v-model="monthSelected"
                :items="monthList"
                style="width: 150px; display:inline-block; margin: 0 10px;"
                item-text="name"
                item-value="value"
                @change="getStatisticVoting"
              ></v-select>
              <v-select
                v-model="yearSelected"
                :items="yearList"
                style="width: 150px; display:inline-block; margin: 0 10px;"
                item-text="name"
                item-value="value"
                @change="getStatisticVoting"
              ></v-select>
            </v-flex>
          </v-layout>
        </div>
        <div>
          <apexchart class="colum-chart" type="bar" :width="widthChart" height="600" :options="chartOptionsColumn" :series="seriesColumn"></apexchart>
        </div>
        <v-layout wrap style="width: 400px;margin: 20px auto;">
          <v-flex style="max-width:120px" class="mr-3">
            <v-icon style="color: #00c784 !important">square</v-icon> &nbsp;&nbsp;
            <span>Rất hài lòng</span>
          </v-flex>
          <v-flex style="max-width:120px" class="mr-3">
            <v-icon style="color: #feb019 !important">square</v-icon> &nbsp;&nbsp;
            <span>Hài lòng</span>
          </v-flex>
          <v-flex style="max-width:150px" class="mr-3">
            <v-icon style="color: #908d89 !important">square</v-icon> &nbsp;&nbsp;
            <span>Không hài lòng</span>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  Vue.use(toastr)
  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    data: () => ({
      listGroup: [
        {
          "code": "STNMT,SXD,SCT,SGDDT,SGTVT,SKHDT,SKHCN,SLDTBXH,SNV,SNNPTNT,STC,STTTT,STP,SVHTTDL,SYT,BQLKKT,BQLKCN,VPT,CAT",
          "text": "Cấp Sở ban ngành"
        },
        {
          "code": "HCHAUTHANH,HCHAUTHANHA,HPHUNGHIEP,HVITHUY,HTPNGABAY,HTPVITHANH,HLONGMY,HTXLONGMY",
          "text": "Cấp Huyện, Thành phố, Thị xã"
        },
        {
          "code": "XHCT_TTNGASAU,XHCT_TTMAIDAM,XHCT_XADONGPHUOC,XHCT_XADONGPHUOCA,XHCT_XAPHUHUU,XHCT_XAPHUTAN,XHCT_XAPHUAN,XHCT_XADONGPHU,XHCT_XADONGTHANH",
          "text": "Cấp xã huyện Châu Thành"
        },
        {
            "code": "XHCTA_TTMOTNGAN,XHCTA_TTBAYNGAN,XHCTA_TTCAITAC,XHCTA_TTRACHGOI,XHCTA_XATHANHXUAN,XHCTA_XATANPHUTHANH,XHCTA_XATANHOA,XHCTA_XATRUONGLONGTAY,XHCTA_XATRUONGLONGA,XHCTA_XANHONNGHIAA",
            "text": "Cấp xã huyện Châu Thành A"
        },
        {
          "code": "XHPH_TTCAYDUONG,XHPH_TTKINHCUNG,XHPH_TTBUNGTAU,XHPH_XAPHUNGHIEP,XHPH_XATANPHUOCHUNG,XHPH_XATANBINH,XHPH_XAHOAAN,XHPH_XAPHUONGBINH,XHPH_XAPHUONGPHU,XHPH_XAHOAMY,XHPH_XAHIEPHUNG,XHPH_XATHANHHOA,XHPH_XABINHTHANH,XHPH_XATANLONG,XHPH_XALONGTHANH",
          "text": "Cấp xã huyện Phụng Hiệp"
        },
        {
          "code": "XHVT_TTNANGMAU,XHVT_XAVIBINH,XHVT_XAVIDONG,XHVT_XAVITHANH,XHVT_XAVITHANG,XHVT_XAVITHUY,XHVT_XAVITRUNG,XHVT_XAVINHTHUANTAY,XHVT_XAVINHTRUNG,XHVT_XAVINHTUONG",
          "text": "Cấp xã huyện Vị Thủy"
        },
        {
          "code": "XTPNB_PHUONGNGABAY,XTPNB_PHUONGLAIHIEU,XTPNB_PHUONGHIEPTHANH,XTPNB_PHUONGHIEPLOI,XTPNB_XADAITHANH,XTPNB_XATANTHANH",
          "text": "Cấp xã Thành phố Ngã Bảy"
        },
        {
          "code": "XTPVT_PHUONG1,XTPVT_PHUONG3,XTPVT_PHUONG4,XTPVT_PHUONG5,XTPVT_PHUONG7,XTPVT_XAVITAN,XTPVT_XAHOALUU,XTPVT_XATANTIEN,XTPVT_XAHOATIEN",
          "text": "Cấp xã thành phố Vị Thanh"
        },
        {
          "code": "XHLM_XATHUANHOA,XHLM_XATHUANHUNG,XHLM_XAVINHTHUANDONG,XHLM_XAVINHVIEN,XHLM_XAVINHVIENA,XHLM_XAXAPHIEN,XHLM_XALUONGTAM,XHLM_XALUONGNGHIA",
          "text": "Cấp xã huyện Long Mỹ"
        },
        {
          "code": "XTXLM_PHUONGTHUANAN,XTXLM_PHUONGBINHTHANH,XTXLM_PHUONGVINHTUONG,XTXLM_PHUONGTRALONG,XTXLM_XALONGBINH,XTXLM_XALONGTRI,XTXLM_XALONGTRIA,XTXLM_XATANPHU,XTXLM_XALONGPHU",
          "text": "Cấp xã thị xã Long Mỹ"
        }
      ],
      groupSelected: '',
      widthChart: "100%",
      chartOptionsColumn: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: true
        },
        legend: {
          show: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: [],
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 170
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
        },
        colors: ['#00c784','#feb019','#908d89']
      },
      seriesColumn: [
        {
          name: 'Rất hài lòng',
          data: []
        }, {
          name: 'Hài lòng',
          data: []
        }, {
          name: 'Không hài lòng',
          data: []
        }
      ],
      dataVoting: [],
      yearList: [
        { name: "Năm 2022", value: 2022 }
      ],
      yearSelected: new Date().getFullYear(),
      monthSelected: new Date().getMonth() + 1,
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
    }),
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
      })
    },
    computed: {
    },
    created () {
      let vm = this
      vm.groupSelected = vm.listGroup[0]['code']
      vm.getStatisticVoting()
    },
    methods: {
      getStatisticVoting () {
        let vm = this
        setTimeout(function () {
          vm.resetChart()
          if (!vm.yearSelected) {
            vm.yearSelected = new Date().getFullYear()
          }
          if (vm.monthSelected === '' || vm.monthSelected == undefined || vm.monthSelected == null) {
            vm.monthSelected = new Date().getMonth() + 1
          }
          let fromDate = ''
          let toDate = ''
          if (vm.monthSelected) {
            let lastDayOfMonth = vm.getDaysInMonth(vm.monthSelected, vm.yearSelected)
            console.log('lastDayOfMonth', lastDayOfMonth)
            fromDate = (new Date(`${vm.yearSelected}-${String(vm.monthSelected).padStart(2, '0')}-01T00:00`)).getTime()
            toDate = (new Date(`${vm.yearSelected}-${String(vm.monthSelected).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}T23:59`)).getTime()
          } else {
            console.log('lastDayOfMonth2', vm.yearSelected, vm.monthSelected)
            fromDate = (new Date(`${vm.yearSelected}-01-01T00:00`)).getTime()
            toDate = (new Date(`${vm.yearSelected}-12-31T23:59`)).getTime()
          }
          let config = {
            method: 'get',
            url: '/o/rest/v2/votings/reportVE',
            headers: {
              'Accept': 'application/json'
            },
            params: {
              type: 1,
              fromDate: fromDate,
              toDate: toDate,
              listGov: vm.groupSelected
            }
          };
          axios(config)
          .then(function (response) {
            vm.dataVoting = response.data
            if (vm.dataVoting.length) {
              vm.widthChart = 150*vm.dataVoting.length
              vm.dataVoting = vm.dataVoting.sort(function (a, b) {
                if (a.unHappyCount > b.unHappyCount) {
                  return -1
                } else if (a.unHappyCount < b.unHappyCount) {
                  return 1
                } else {
                  if (a.govAgencyName < b.govAgencyName) {
                    return -1
                  } else if (a.govAgencyName > b.govAgencyName) {
                    return 1
                  }
                  return 0
                }
              })
              let dataName = []
              let dataVeryHappy = []
              let dataHappy = []
              let dataUnHappy = []
              for (let index = 0; index < vm.dataVoting.length; index++) {
                dataName.push(vm.dataVoting[index]['govAgencyName'])
                dataVeryHappy.push(vm.dataVoting[index]['veryHappyCount'])
                dataHappy.push(vm.dataVoting[index]['happyCount'])
                dataUnHappy.push(vm.dataVoting[index]['unHappyCount'])
              }
              // vm.chartOptionsColumn.xaxis.categories = dataName
              // vm.seriesColumn[0]['data'] = dataVeryHappy
              // vm.seriesColumn[1]['data'] = dataHappy
              // vm.seriesColumn[2]['data'] = dataUnHappy

              vm.seriesColumn = [
                {
                  name: 'Rất hài lòng',
                  data: dataVeryHappy
                }, {
                  name: 'Hài lòng',
                  data: dataHappy
                }, {
                  name: 'Không hài lòng',
                  data: dataUnHappy
                }
              ]
              vm.chartOptionsColumn = {
                chart: {
                  type: 'bar',
                  toolbar: {
                    show: false
                  }
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: '60%',
                    endingShape: 'rounded'
                  },
                },
                dataLabels: {
                  enabled: true
                },
                legend: {
                  show: false
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ['transparent']
                },
                xaxis: {
                  categories: dataName,
                  labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                    showDuplicates: false,
                    trim: false,
                    minHeight: undefined,
                    maxHeight: 170
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
                },
                colors: ['#00c784','#feb019','#908d89']
              }
            }
          })
          .catch(function (error) {
          })
        }, 100)
      },
      getDaysInMonth(m, y) {
        return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1)
      },
      sortList (list) {
        function compare(a, b) {
          if (type == 'inc') {
            if (a[key] > b[key])
              return -1
            if (a[key] < b[key])
              return 1
            return 0
          } else {
            if (a[key] > b[key])
              return -1
            if (a[key] < b[key])
              return 1
            return 0
          }
        }
        return list.sort(compare)
      },
      resetChart () {
        let vm = this
        vm.seriesColumn = [
          {
            name: 'Rất hài lòng',
            data: []
          }, {
            name: 'Hài lòng',
            data: []
          }, {
            name: 'Không hài lòng',
            data: []
          }
        ]
        vm.chartOptionsColumn = {
          chart: {
            type: 'bar',
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '60%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: true
          },
          legend: {
            show: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: [],
            labels: {
              show: true,
              rotate: -45,
              rotateAlways: false,
              hideOverlappingLabels: true,
              showDuplicates: false,
              trim: false,
              minHeight: undefined,
              maxHeight: 170
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
          },
          colors: ['#00c784','#feb019','#908d89']
        }
        vm.dataVoting = []
      }
    }
  }
</script>

<style>
  .row-header {
    height: 38px;
    overflow: hidden;
    background: #fff
  }
  .background-triangle-big1 {
    padding: 10px 5px 10px 5px;
    width: auto;
    margin-right: 30px;
    background-color: #903938 !important;
    display: inline-block;
    text-align: right;
    color: #fff;
    position: relative;
    cursor: pointer;
  }
  .background-triangle-big1:before, .background-triangle-small:before {
      content: "";
      position: absolute;
      top: 1px;
      transform: rotate(45deg);
      right: -4px;
      border-top: 28px solid #903938;
      border-left: 28px solid transparent;
      border-bottom: 28px solid transparent;
  }
  .colum-chart {
    overflow-x: auto;
  }
</style>