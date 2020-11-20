<template>
  <div style="width: 1300px; margin: 0 auto; background-color: #eaf0f7;">
    <v-layout wrap class="px-2">
      <v-flex xs12 md6 class="px-2">
        <v-layout wrap class="">
          <v-flex xs6 class="pr-2 py-3">
            <div class="px-3 py-3" style="background: #17c6b4;border-radius: 7px;">
              <div class="">
                <div class="">
                  <i class="fa fa-paper-plane" style="color: #fff;font-size: 20px;background: #FFC107;
                    padding: 10px;border-radius: 50%;float:right;width:45px;height:45px;font-weight: 500;"></i>
                </div>
                <div class="white--text">
                  <h6 class="mb-2" style="font-size: 14px;font-weight: 500;">LƯỢT TRUY CẬP</h6>
                  <h4 class=""><label style="margin-bottom: 0px;font-size: 26px">{{visitTotal}}</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs6 class="pl-2 py-3">
            <div class="px-3 py-3" style="background: #17c6b4;border-radius: 7px;">
              <div class="">
                <div class="">
                  <i class="fa fa-user-plus" style="color: #fff;font-size: 20px;background: #FFC107;
                  padding: 10px;border-radius: 50%;float:right;width:45px;height:45px;font-weight:500;"></i>
                </div>
                <div class="white--text">
                  <h6 class="mb-2" style="font-size: 14px;font-weight: 500;">NGƯỜI DÙNG</h6>
                  <h4 class=""><label style="margin-bottom: 0px;font-size: 26px">{{visitorTotal}}</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 class="">
            <div class="v-sheet theme--light" style="border-radius: 7px;">
              <div class="pl-3" style="height: 42px;
                font-size: 14px;
                font-weight: 500;
                background: #17c6b4;
                line-height: 42px;
                color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <div class="">ĐANG TRUY CẬP</div>
              </div>
              <v-card-text class="px-0 py-0">
                <v-layout wrap class="custom-class" style="height: 250px">
                  <v-flex xs6 class="px-2" style="">
                    <div class="text-xs-center" style="color: #1d9488">
                      <div style="font-size: 48px; font-weight: 900; margin: 0px 20px;">
                        <span><label style="margin-bottom: 0px;">{{liveStatistic.visits ? liveStatistic.visits : 0}}</label></span>
                      </div>
                      <span>
                        <b>{{liveStatistic.visits ? liveStatistic.visits : 0}} </b> lượt truy cập và <b>{{liveStatistic.actions ? liveStatistic.actions : 0}} </b> hành động <br> trong <b>3 </b> phút gần đây 
                      </span>
                    </div>
                    <div class="mt-3">
                      <table class="dataTable" cellspacing="0" style="background: #17c6b4; border-radius: 3px;color: #fff;">
                        <thead>
                          <tr>
                            <th id="label" class="sortable label first py-2" style="cursor: auto;border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">
                              <div>Thời gian</div>
                            </th>
                            <th class="sortable py-2" style="cursor: auto;border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">
                              <div>Truy cập</div>
                            </th>
                            <th class="sortable py-2" style="cursor: auto;border-bottom: 1px dotted #fff;">
                              <div>Hành động</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="">
                            <td class="label column pl-2 py-2 text-bold" style="border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">24 giờ qua</td>
                            <td class="column text-xs-center text-bold" style="border-bottom: 1px dotted #fff;border-right: 1px dotted #fff;">{{liveStatistic24.visits ? liveStatistic24.visits : 0}}</td>
                            <td class="column text-xs-center text-bold" style="border-bottom: 1px dotted #fff;">{{liveStatistic24.actions ? liveStatistic24.actions : 0}}</td>
                          </tr>
                          <tr class="">
                            <td class="label column pl-2 py-2 text-bold" style="border-right: 1px dotted #fff;">30 phút qua</td>
                            <td class="column text-xs-center text-bold" style="border-right: 1px dotted #fff;">{{liveStatistic30.visits ? liveStatistic30.visits : 0}}</td>
                            <td class="column text-xs-center text-bold">{{liveStatistic30.actions ? liveStatistic30.actions : 0}}</td>
                          </tr>
                        </tbody>
                    </table>
                    </div>
                  </v-flex>
                  <v-flex xs6 style="position: relative;">
                    <div class="px-2" style="
                        height: 20px;
                    ">
                      <i class="" style="
                          position: absolute;
                          top: 5px;
                          font-weight: bold;
                          right: 10px;
                          color: #1d9488;
                      ">Truy cập 24 giờ qua</i>
                    </div>
                    <div id="contentListVisitor" class="mt-1" style="max-height: 215px;overflow: hidden auto;">
                      <v-list three-line>
                        <v-list-tile
                          v-for="item in visitorList"
                          :key="item.idVisit"
                          avatar
                          @click=""
                        >
                          <v-list-tile-content class="pl-2">
                            <v-list-tile-title>
                              Thứ {{ (new Date (item.serverDatePretty)).getDay() + 1 }}, 
                              {{ (new Date (item.serverDatePretty)).getDate()}}/{{ (new Date (item.serverDatePretty)).getMonth() + 1}}/{{ (new Date (item.serverDatePretty)).getFullYear()}}
                              - {{item.serverTimePretty}} <i>(ip: {{item.visitIp}})</i>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="'http://thongke.fds.vn/' + item.browserIcon">
                                  <span>Trình duyệt: {{ item.browser }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="'http://thongke.fds.vn/' + item.operatingSystemIcon">
                                  <span>Hệ điều hành: {{ item.operatingSystem }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="'http://thongke.fds.vn/' + item.deviceTypeIcon">
                                  <span>Thiết bị: {{ item.deviceType }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails">
                                <v-tooltip bottom>
                                  <i slot="activator" class="fa fa-address-card-o" style="color: #1867c0;font-size: 14px;"></i>
                                  <span>Chi tiết</span>
                                </v-tooltip>
                              </span>
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </div>
                  </v-flex>
                </v-layout>
                
              </v-card-text>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md6 class="my-3 px-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">LƯỢT TRUY CẬP THEO NGÀY</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart type="line" height="350" ref="chart" :options="chartOptionsLineType" :series="seriesLineType"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md3 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">TRÌNH DUYỆT TRUY CẬP</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart width=310 type="donut" :options="chartBrowserOptions" :series="browserSeries"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md3 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">THIẾT BỊ TRUY CẬP</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart type="donut" width=310 :options="chartDeviceOptions" :series="deviceSeries"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">TRANG TRUY CẬP GẦN ĐÂY</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <!-- <apexchart class="colum-chart" type="bar" height="300" :options="chartOptionsColumn" :series="seriesColumn"></apexchart> -->
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
    </v-layout>
    <!--  -->
    <v-dialog v-model="dialog_visitor" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="">Thông tin người dùng</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog_visitor = false">
              <v-icon size="24">clear</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"
import TinyPagination from './Pagination.vue'
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    host: "http://thongke.fds.vn",
    idSite: '1',
    token_auth: 'b0a9a426253ca32c552492ab1e41bbee',
    visitTotal: 0,
    visitorTotal: 0,
    liveStatistic: '',
    liveStatistic30: '',
    liveStatistic24: '',
    fromDate: ' 2020-11-01',
    toDate: '2020-11-30',
    loading: false,
    dialog_visitor: false,
    visitorList: [],
    seriesLineType: [],
    chartOptionsLineType: '',
    browserSeries: [],
    chartBrowserOptions: '',
    deviceSeries: [],
    chartDeviceOptions: ''
  }),
  computed: {
    
  },
  created() {
    let vm = this
    vm.$nextTick(() => {
      vm.getStatisticTotal()
      vm.getStatisticVisitorTotal()
      vm.getLiveStatistic('liveStatistic', 3)
      vm.getLiveStatistic('liveStatistic30', 30)
      vm.getLiveStatistic('liveStatistic24', 1440)
      vm.getDetailLiveStatistic24(1440)
      vm.getGraphStatistic()
      vm.getBrowserStatistic()
      vm.getOsStatistic()
    })
  },
  watch: {
    
  },
  methods: {
    getStatisticTotal() {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'VisitsSummary.getVisits',
          format: 'JSON',
          date: vm.fromDate + ',' + vm.toDate,
          period: 'range'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          if (response.data) {
            vm.visitTotal = response.data.value
          }          
        })
        .catch();
    },
    getStatisticVisitorTotal() {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'VisitsSummary.getUniqueVisitors',
          format: 'JSON',
          date: vm.fromDate + ',' + vm.toDate,
          period: 'day'
        }
      };
      vm.visitorTotal = 0
      axios
        .request(config)
        .then(function(response) {
          if (response.data) {
            let dataResult = response.data
            for (let key in dataResult) {
              vm.visitorTotal += dataResult[key]
            }
          }          
        })
        .catch();
    },
    getLiveStatistic(type, minutes) {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'Live.getCounters',
          lastMinutes: minutes,
          format: 'JSON',
          force_api_session: '1'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          if (type === 'liveStatistic') {
            vm.liveStatistic = response.data[0]
          } else if (type === 'liveStatistic30') {
            vm.liveStatistic30 = response.data[0]
          } else if (type === 'liveStatistic24') {
            vm.liveStatistic24 = response.data[0]
          }
          
        })
        .catch();
    },
    getDetailLiveStatistic24(minutes) {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'Live.getLastVisitsDetails',
          lastMinutes: minutes,
          format: 'JSON'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          vm.visitorList = response.data        
        })
        .catch();
    },
    getGraphStatistic() {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'VisitsSummary.getVisits',
          format: 'JSON',
          date: vm.fromDate + ',' + vm.toDate,
          period: 'day'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          vm.seriesLineType = []
          let dataResult = response.data
          let seriesVisit = []
          let labelsVisit = []
          for (let key in dataResult) {
            labelsVisit.push(vm.parsedate(key))
            seriesVisit.push(dataResult[key])
          }
          vm.chartOptionsLineType = {
            chart: {
              height: 350,
              type: "line",
              group: "detail",
              id: "areachart-1",
              toolbar: {
                show: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            grid: {
              padding: {
                right: 30,
                left: 20
              }
            },

            labels: labelsVisit
          }
          vm.seriesLineType = [
            {name: 'Truy cập', data: seriesVisit}
          ]
        })
        .catch();
    },
    getBrowserStatistic () {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'DevicesDetection.getBrowsers',
          format: 'JSON',
          date: vm.fromDate + ',' + vm.toDate,
          period: 'range'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          vm.browserSeries = []
          let dataBrowser = response.data
          let labelsBrowser = []
          let seriesBrowser = []
          if (dataBrowser.length > 0) {
            for (var i = 0; i < dataBrowser.length; i++) {
              labelsBrowser.push(dataBrowser[i]['label'])
              seriesBrowser.push(dataBrowser[i]['nb_visits'])
            }
            vm.chartBrowserOptions = {
              chart: {
                type: 'donut'
              },
              legend: {
                position: 'bottom',
                height: 60
              },
              labels: labelsBrowser,
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
            vm.browserSeries = seriesBrowser
          }
        })
        .catch();
    },
    getOsStatistic () {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'DevicesDetection.getOsFamilies',
          format: 'JSON',
          date: vm.fromDate + ',' + vm.toDate,
          period: 'range'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          vm.deviceSeries = []
          let dataBrowser = response.data
          let labelsDevice = []
          let seriesDevice = []
          if (dataBrowser.length > 0) {
            for (var i = 0; i < dataBrowser.length; i++) {
              labelsDevice.push(dataBrowser[i]['label'])
              seriesDevice.push(dataBrowser[i]['nb_visits'])
            }
            vm.chartDeviceOptions = {
              chart: {
                type: 'donut'
              },
              legend: {
                position: 'bottom',
                height: 60
              },
              labels: labelsDevice,
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
            vm.deviceSeries = seriesDevice
          }
        })
        .catch();
    },
    parsedate (date) {
      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    }
  }
};
</script>
