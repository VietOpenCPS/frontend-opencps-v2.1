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
                style="width: 300px; display:inline-block; margin: 0 10px;"
                item-text="text"
                item-value="code"
                @change="getStatisticVoting"
              ></v-select>
              <v-select
                v-model="monthSelected"
                :items="monthList"
                style="width: 120px; display:inline-block; margin: 0 10px;"
                item-text="name"
                item-value="value"
                @change="getStatisticVoting"
              ></v-select>
              <v-select
                v-model="yearSelected"
                :items="yearList"
                style="width: 120px; display:inline-block; margin: 0 10px;"
                item-text="name"
                item-value="value"
                @change="getStatisticVoting"
              ></v-select>
            </v-flex>
            <v-flex class="">
              <v-menu
                ref="menuDate1"
                v-model="menuDate1"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
              >
                <v-text-field
                  placeholder="Từ ngày"
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="fromReceiveDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="fromReceiveDate = parseDate(fromReceiveDateFormatted)"
                  hide-details
                  flat
                  height="32"
                  min-height="32"
                  append-outer-icon="remove"
                  readonly
                >
                  <template slot='append-outer'>
                    <v-icon color="primary">remove</v-icon>
                  </template>
                </v-text-field>
                <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : currentDate()" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('1')"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex class="pl-2">
              <v-menu
                ref="menuDate2"
                v-model="menuDate2"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
              >

                <v-text-field
                slot="activator"
                placeholder="Đến ngày"
                class="search-input-appbar input-search"
                v-model="toReceiveDateFormatted"
                persistent-hint
                append-icon="event"
                @blur="toReceiveDate = parseDate(toReceiveDateFormatted)"
                hide-details
                flat
                height="32"
                min-height="32"
                readonly
                ></v-text-field>
                <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null"
                :max="currentDate()"  v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('2')"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </div>
        <div>
          <apexchart class="colum-chart" type="bar" height="600" :options="chartOptionsColumn" :series="seriesColumn"></apexchart>
        </div>
        <v-layout wrap style="width: 400px;margin: 20px auto;">
          <v-flex style="max-width:120px" class="mr-3">
            <v-icon style="color: #8bc34a !important">square</v-icon> &nbsp;&nbsp;
            <span>Rất hài lòng</span>
          </v-flex>
          <v-flex style="max-width:120px" class="mr-3">
            <v-icon style="color: #2196f3 !important">square</v-icon> &nbsp;&nbsp;
            <span>Hài lòng</span>
          </v-flex>
          <v-flex style="max-width:150px" class="mr-3">
            <v-icon style="color: #CE7A58 !important">square</v-icon> &nbsp;&nbsp;
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
      menuDate1: false,
      menuDate2: false,
      fromReceiveDate: '',
      fromReceiveDateFormatted: '',
      toReceiveDate: '',
      toReceiveDateFormatted: '',
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
          width: '100%',
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
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
            return '<div class="wrap-tooltip-chart">' +
              '<div class="header-tooltip-chart">'+ data.x +'</div>' +
              '<div class="content-tooltip-chart">' + data.title + ': <span class="count-text">' + data.y + '% (' + data.count +' lượt)</span></div>' +
            '</div>'
          }
        },
        colors: ['#8bc34a','#2196f3','#CE7A58']
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
        { name: "Cả năm", value: 'all' },
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
    watch: {
      monthSelected (val) {
        let vm = this
        setTimeout(function () {
          if (vm.monthSelected) {
            vm.fromReceiveDateFormatted = ''
            vm.toReceiveDateFormatted = ''
          }
        }, 100)
      },
      yearSelected (val) {
        let vm = this
        setTimeout(function () {
          if (vm.yearSelected) {
            vm.fromReceiveDateFormatted = ''
            vm.toReceiveDateFormatted = ''
          }
        }, 100)
      },
      fromReceiveDateFormatted(newValue, oldValue) {
        if (oldValue) {
          let vm = this
          vm.fromDate = vm.parseDate(vm.fromReceiveDateFormatted)
        }
      },
      toReceiveDateFormatted(newValue, oldValue) {
        if (oldValue) {
          let vm = this
          vm.toDate = vm.parseDate(vm.toReceiveDateFormatted)
        }
      }
    },
    created () {
      let vm = this
      vm.groupSelected = vm.listGroup[0]['code']
      vm.yearSelected = new Date().getFullYear()
      vm.monthSelected = new Date().getMonth() + 1
      vm.getStatisticVoting()
    },
    methods: {
      getStatisticVoting () {
        let vm = this
        setTimeout(function () {
          vm.resetChart()
          let fromDate = ''
          let toDate = ''
          console.log('fromReceiveDate', vm.fromReceiveDate, vm.toReceiveDate)
          if (vm.monthSelected) {
            if (vm.monthSelected !== 'all') {
              let lastDayOfMonth = vm.getDaysInMonth(vm.monthSelected, vm.yearSelected)
              fromDate = (new Date(`${vm.yearSelected}-${String(vm.monthSelected).padStart(2, '0')}-01T00:00`)).getTime()
              toDate = (new Date(`${vm.yearSelected}-${String(vm.monthSelected).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}T23:59`)).getTime()
            } else {
              fromDate = (new Date(`${vm.yearSelected}-01-01T00:00`)).getTime()
              toDate = (new Date(`${vm.yearSelected}-12-31T23:59`)).getTime()
            }
          } else {
            fromDate = (new Date(`${vm.fromReceiveDate}T00:00`)).getTime()
            if (vm.toReceiveDate) {
              toDate = (new Date(`${vm.toReceiveDate}T23:59`)).getTime()
            } else {
              toDate = (new Date()).getTime()
            }
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
              // if (vm.dataVoting.length > 4) {
              //   vm.widthChart = 150*vm.dataVoting.length
              // }
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
                // dataName.push(vm.dataVoting[index]['govAgencyName'])
                // dataVeryHappy.push(vm.dataVoting[index]['veryHappyCount'])
                // dataHappy.push(vm.dataVoting[index]['happyCount'])
                // dataUnHappy.push(vm.dataVoting[index]['unHappyCount'])
                let itemVeryHappy = {
                  x: vm.dataVoting[index]['govAgencyName'],
                  y: vm.dataVoting[index]['percentVeryHappy'],
                  count: vm.dataVoting[index]['veryHappyCount'],
                  title: 'Rất hài lòng'
                }
                let itemHappy = {
                  x: vm.dataVoting[index]['govAgencyName'],
                  y: vm.dataVoting[index]['percentHappy'],
                  count: vm.dataVoting[index]['happyCount'],
                  title: 'Hài lòng'
                }
                let itemUnHappy = {
                  x: vm.dataVoting[index]['govAgencyName'],
                  y: vm.dataVoting[index]['percentUnHappy'],
                  count: vm.dataVoting[index]['unHappyCount'],
                  title: 'Không hài lòng'
                }
                dataVeryHappy.push(itemVeryHappy)
                dataHappy.push(itemHappy)
                dataUnHappy.push(itemUnHappy)
              }

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
                  },
                  width: vm.dataVoting.length > 4 ? 150*vm.dataVoting.length : '600'
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
                yaxis: {
                  max: 100
                },
                fill: {
                  opacity: 1
                },
                tooltip: {
                  custom: function({series, seriesIndex, dataPointIndex, w}) {
                    var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
                    return '<div class="wrap-tooltip-chart">' +
                      '<div class="header-tooltip-chart">'+ data.x +'</div>' +
                      '<div class="content-tooltip-chart">' + data.title + ': <span class="count-text">' + data.y + '% (' + data.count +' lượt)</span></div>' +
                    '</div>'
                  }
                },
                colors: ['#8bc34a','#2196f3','#CE7A58']
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
          yaxis: {
            max: 100
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
          colors: ['#8bc34a','#2196f3','#CE7A58']
        }
        vm.dataVoting = []
      },
      parsedate (date) {
        const [year, month, day] = date.split('-')
        return `${day}-${month}-${year}`
      },
      currentDate () {
        let date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      },
      changeDate(index) {
        let vm = this
        vm.monthSelected = ''
        vm.yearSelected = ''
        vm.menuDate = vm.menuDate2 = false
        if (index === '1') {
          vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
        } else if (index === '2') {
          vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
        }
        if (vm.fromReceiveDateFormatted || vm.toReceiveDateFormatted) {
          vm.getStatisticVoting()
        }
      },
      getMinMax (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
      },
      getMinFromDate30 (date) {
        let vm = this
        let toDate = (new Date(vm.parseDate(date))).getTime() - 30*86400000
        return vm.parseDate(toDate)
      },
      getMaxToDate30 (date) {
        let vm = this
        let toDate = (new Date(vm.parseDate(date))).getTime() + 30*86400000
        if (toDate > (new Date()).getTime()) {
          return vm.parseDate((new Date()).getTime())
        } else {
          return vm.parseDate(toDate)
        }
      },
      parseDate(date) {
        if (!date) return ''
        if (String(date).indexOf('/') > 0) {
          const [day, month, year] = date.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        } else if (String(date).indexOf('-') > 0) {
          const [day, month, year] = date.split('-')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        } else {
          let date1 = new Date(Number(date))
          return `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')}`
        }
      },
      formatDate(date) {
        if (!date) return ''
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      currentDateFormat (date) {
        let date1 = date ? new Date(date) : new Date()
        return `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()}`
      }
    }
  }
</script>

<style>
  .wrap-tooltip-chart {
  }
  .header-tooltip-chart {
    padding: 4px 7px;
    border-radius: 4px;
    background-color: #ededed;
    text-align: left;
  }
  .content-tooltip-chart {
    padding: 4px 7px;
    border-radius: 4px;
    text-align: left;
  }
  .count-text {
    font-weight: bold;
  }
  .row-header {
    height: 48px;
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
      border-top: 30px solid #903938;
      border-left: 30px solid transparent;
      border-bottom: 30px solid transparent;
  }
  .colum-chart {
    overflow-x: auto;
  }
</style>