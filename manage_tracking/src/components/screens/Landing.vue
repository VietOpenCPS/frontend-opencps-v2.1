<template>
  <div style="width: 1300px; margin: 0 auto; background-color: #eaf0f7;">
    <v-layout wrap class="px-3 pt-3" :style="loading ? 'pointer-event: none' : ''">
      <v-flex xs12 md4 class="pr-3">
        <v-autocomplete
          style="width: 100%"
          class="select-search d-inline-block"
          :items="siteItems"
          v-model="site"
          item-text="siteName"
          item-value="siteId"
          @change="changeSite()"
          hide-details
          hide-no-data
          solo
          flat
          height="32"
          min-height="32"
          return-object
        ></v-autocomplete>
      </v-flex>
      <v-flex xs12 md3 class="pl-2">
        <v-menu
          ref="menuDate1"
          v-model="menuDate1"
          :close-on-content-click="true"
          transition="scale-transition"
          offset-y
          full-width
        >
          <v-text-field
          label="Từ ngày"
          slot="activator"
          class="search-input-appbar input-search"
          v-model="fromReceiveDateFormatted"
          persistent-hint
          append-icon="event"
          @blur="fromReceiveDate = parseDate(fromReceiveDateFormatted)"
          hide-details
          solo
          flat
          height="32"
          min-height="32"
          append-outer-icon="remove"
          >
            <template slot='append-outer'>
              <v-icon color="primary">remove</v-icon>
            </template>
          </v-text-field>
          <v-date-picker :min="toReceiveDateFormatted ? getMinFromDate30(toReceiveDateFormatted) : null" :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : currentDate()" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('1')"></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs12 md3 class="pl-2">
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
          label="Đến ngày"
          class="search-input-appbar input-search"
          v-model="toReceiveDateFormatted"
          persistent-hint
          append-icon="event"
          @blur="toReceiveDate = parseDate(toReceiveDateFormatted)"
          hide-details
          solo
          flat
          height="32"
          min-height="32"
          ></v-text-field>
          <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" :max="fromReceiveDateFormatted ? getMaxToDate30(fromReceiveDateFormatted) : currentDate()" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('2')"></v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
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
                      ">Truy cập gần đây</i>
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
                              Thứ {{ (new Date (item.serverTimestamp*1000)).getDay() + 1 }}, 
                              {{ (new Date (item.serverTimestamp*1000)).getDate()}}/{{ (new Date (item.serverTimestamp*1000)).getMonth() + 1}}/{{ (new Date (item.serverTimestamp*1000)).getFullYear()}}
                              - {{item.serverTimePretty}} <i>(ip: {{item.visitIp}})</i>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="host + '/' + item.browserIcon">
                                  <span>Trình duyệt: {{ item.browser }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="host + '/' + item.operatingSystemIcon">
                                  <span>Hệ điều hành: {{ item.operatingSystem }}</span>
                                </v-tooltip>
                              </span>
                              <span class="visitorDetails" style="margin-right: 10px">
                                <v-tooltip bottom>
                                  <img style="width: 16px;" slot="activator" :src="host + '/' + item.deviceTypeIcon">
                                  <span>Thiết bị: {{ item.deviceType }}</span>
                                </v-tooltip>
                              </span>
                              <!-- <span class="visitorDetails">
                                <v-tooltip bottom>
                                  <i slot="activator" class="fa fa-address-card-o" style="color: #1867c0;font-size: 14px;"></i>
                                  <span>Chi tiết</span>
                                </v-tooltip>
                              </span> -->
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
            <div class="">TRUY CẬP THEO NGÀY</div>
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
              <v-flex xs12 v-if="!reRender">
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
              <v-flex xs12 v-if="!reRender">
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
            <div class="">TRUY CẬP THEO KHUNG GIỜ</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart type="line" height="350" ref="chart" :options="chartOptionsLineTime" :series="seriesLineTime"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 class="pa-2" v-if="!siteDvc">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">CÁN BỘ ĐANG XỬ LÝ HỒ SƠ</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-data-table
              :headers="employeeListHeader"
              :items="employeeOnlineList"
              hide-actions
              class="table-landing table-bordered mt-3"
              style="border-left: 1px solid #dedede"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                  <td class="text-xs-center" style="width:50px;height:36px">
                    <div>
                      <span>{{ employeePage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                    </div>
                  </td>
                  <td class="text-xs-left" style="height:36px">
                    <div>
                      <span>{{props.item.fullName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left" style="height:36px">
                    <div>
                      <span>{{props.item.email}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left" style="height:36px;min-width:200px">
                    <div>
                      <span>{{props.item.lastRequest}}</span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div class="my-2 px-2">
              <div class="text-xs-right layout wrap" style="position: relative;">
                <div class="flex pagging-table"> 
                  <tiny-pagination :total="totalEmployeeSearch" :page="employeePage" :numberPerPage="numberPerPage" nameRecord="cán bộ" custom-class="custom-tiny-class" 
                    @tiny:change-page="changePage" ></tiny-pagination> 
                </div>
              </div>
            </div>
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
    reRender: false,
    loading: false,
    counterGetdata: 0,
    siteDvc: false,
    currentSite: false,
    siteItems: [],
    site: '',
    host: '',
    idSite: '',
    token_auth: '',
    visitTotal: 0,
    visitorTotal: 0,
    liveStatistic: '',
    liveStatistic30: '',
    liveStatistic24: '',
    fromDate: '',
    toDate: '',
    loading: false,
    dialog_visitor: false,
    visitorList: [],
    seriesLineType: [],
    chartOptionsLineType: '',
    chartOptionsLineTime: '',
    seriesLineTime: [],
    browserSeries: [],
    chartBrowserOptions: '',
    deviceSeries: [],
    chartDeviceOptions: '',
    menuDate1: false,
    menuDate2: false,
    fromReceiveDate: '',
    fromReceiveDateFormatted: '',
    toReceiveDate: '',
    toReceiveDateFormatted: '',
    employeeOnlineList: '',
    employeePage: 1,
    numberPerPage: 20,
    totalEmployeeSearch: 0,
    employeeListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên cán bộ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Email',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thời gian truy cập',
        align: 'center',
        sortable: false
      }
    ],
  }),
  computed: {
    
  },
  created() {
    let vm = this
    vm.$nextTick(() => {
      vm.toReceiveDateFormatted = vm.currentDateFormat()
      vm.toDate = vm.parseDate(vm.toReceiveDateFormatted)
      let time = (new Date(vm.parseDate(vm.toReceiveDateFormatted))).getTime() - 7*86400000
      vm.fromReceiveDateFormatted = vm.currentDateFormat(time)
      vm.fromDate = vm.parseDate(vm.fromReceiveDateFormatted)
      try {
        vm.siteDvc = siteDvc /**config fragment*/
      } catch (error) {
      }
      try {
        vm.currentSite = currentSite
      } catch (error) {
        
      }
      vm.getServerConfig()
    })
  },
  watch: {
    fromReceiveDateFormatted(newValue, oldValue) {
      if (oldValue) {
        let vm = this
        vm.fromDate = vm.parseDate(vm.fromReceiveDateFormatted)
        vm.getDataTracking()
      }
    },
    toReceiveDateFormatted(newValue, oldValue) {
      if (oldValue) {
        let vm = this
        vm.toDate = vm.parseDate(vm.toReceiveDateFormatted)
        vm.getDataTracking()
      }
    }
  },
  methods: {
    getDataTracking () {
      let vm = this
      if (vm.fromDate && vm.toDate) {
        vm.resetData()
        vm.getStatisticTotal()
        vm.getStatisticVisitorTotal()
        vm.getLiveStatistic('liveStatistic', 3)
        vm.getLiveStatistic('liveStatistic30', 30)
        vm.getLiveStatistic('liveStatistic24', 1440)
        vm.getDetailLiveStatistic24()
        vm.getGraphStatisticLineType()
        vm.getGraphStatisticLineTime()
        vm.getBrowserStatistic()
        vm.getOsStatistic()
        if (vm.site.hasOwnProperty('siteMotCua') && vm.site.siteMotCua) {
          vm.getEmloyeeOnline()
        }
      }
    },
    resetData () {
      let vm = this
      vm.visitTotal = 0
      vm.visitorTotal = 0
      vm.visitorList = []
      vm.liveStatistic = {
        visits: 0,
        actions: 0
      }
      vm.liveStatistic30 = {
        visits: 0,
        actions: 0
      }
      vm.liveStatistic24 = {
        visits: 0,
        actions: 0
      }
      vm.seriesLineType = []
      vm.seriesLineTime = []
      vm.chartOptionsLineType = ''
      vm.chartOptionsLineTime = ''
      vm.browserSeries = []
      vm.deviceSeries = []
      vm.chartBrowserOptions = ''
      vm.chartDeviceOptions = ''
    },
    getServerConfig () {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
          Token: window.Liferay ? window.Liferay.authToken : ''
        }
      }
      if (vm.siteDvc || vm.currentSite) {
        let url = '/o/rest/v2/serverconfigs/SERVER_TRACKING_OPENCPS'
        axios.get(url, param).then(function (response) {
          let serializable = response.data
          let configs = JSON.parse(serializable.configs)
          vm.siteItems = configs['siteTracking']
          if (vm.siteItems.length > 1) {
            if (vm.siteDvc) {
              vm.site = vm.siteItems[0]
            } else {
              vm.site = vm.siteItems[1]
            }
          } else {
            vm.site = vm.siteItems[0]
          }
          vm.host = configs.urlTracking
          vm.token_auth = configs.tokenAuth
          console.log('site', vm.site)
          vm.idSite = vm.site['siteId']
          vm.getDataTracking()
        }).catch(function (error) {
          
        })
      } else {
        let dataGet = {}
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('serverCode', 'SERVER_DVC')
        dataPost.append('url', '/serverconfigs/SERVER_TRACKING_OPENCPS')
        dataPost.append('data', JSON.stringify(dataGet))

        axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
          let serializable = response.data
          let configs = JSON.parse(serializable.configs)
          vm.siteItems = configs['siteTracking']
          if (vm.siteItems.length > 1) {
            if (vm.siteDvc) {
              vm.site = vm.siteItems[0]
            } else {
              vm.site = vm.siteItems[1]
            }
          } else {
            vm.site = vm.siteItems[0]
          }
          vm.host = configs.urlTracking
          vm.token_auth = configs.tokenAuth
          vm.idSite = vm.site['siteId']
          vm.getDataTracking()
        }).catch(function (xhr) {
        })
      }
      
    },
    changeSite () {
      let vm = this
      vm.reRender = true
      setTimeout(function () {
        vm.idSite = vm.site['siteId']
        vm.getDataTracking()
      }, 100)
    },
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
          vm.counterGetdata += 1
          if (response.data) {
            vm.visitTotal = response.data.value
          }          
        })
        .catch(function () {
          vm.counterGetdata += 1
        });
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
          vm.counterGetdata += 1
          if (response.data) {
            let dataResult = response.data
            for (let key in dataResult) {
              vm.visitorTotal += dataResult[key]
            }
          }          
        })
        .catch(function () {
          vm.counterGetdata += 1
        });
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
          format: 'JSON'
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
    getDetailLiveStatistic24() {
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
          date: vm.currentDate(),
          period: 'day',
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
    getGraphStatisticLineType() {
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
              curve: "smooth",
              width: 2,
            },
            markers: {
              size: 3
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
    getGraphStatisticLineTime() {
      let vm = this
      let config = {
        url: vm.host,
        headers: {
        },
        params: {
          idSite: vm.idSite,
          token_auth: vm.token_auth,
          module: 'API',
          method: 'VisitTime.getVisitInformationPerServerTime',
          format: 'JSON',
          date: vm.fromDate + ',' + vm.toDate,
          period: 'range'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          vm.seriesLineTime = []
          let dataResult = response.data
          let seriesVisit = []
          let labelsVisit = []
          for (let key in dataResult) {
            let range = Number(dataResult[key]['label']) + 'h - ' + (Number(dataResult[key]['label']) + 1) + 'h'
            labelsVisit.push(range)
            seriesVisit.push(dataResult[key]['nb_visits'])
          }
          vm.chartOptionsLineTime = {
            chart: {
              height: 350,
              type: "line",
              toolbar: {
                show: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            markers: {
              size: 3
            },
            grid: {
              padding: {
                right: 30,
                left: 20
              }
            },

            labels: labelsVisit
          }
          vm.seriesLineTime = [
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
          vm.reRender = false
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
        .catch(function () {
          vm.reRender = false
        });
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
    getEmloyeeOnline () {
      let vm = this
      vm.employeeOnlineList = []
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
          Token: window.Liferay ? window.Liferay.authToken : ''
        },
        params: {
          start: vm.employeePage * vm.numberPerPage - vm.numberPerPage,
          end: vm.employeePage * vm.numberPerPage
        }
      }
      let url = '/o/rest/v2/users/liveuser'
      axios.get(url, param).then(function (response) {
        let serializable = response.data
         if (serializable.data) {
          vm.totalEmployeeSearch = serializable['total']
          vm.employeeOnlineList = serializable.data
        } else {
          vm.totalEmployeeSearch = 0
          vm.employeeOnlineList = []
        }
      }).catch(function (error) {
      })
    },
    changePage (config) {
      let vm = this
      vm.employeePage = config.page
      vm.getEmloyeeOnline()
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
      vm.menuDate = vm.menuDate2 = false
      if (index === '1') {
        vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
      } else if (index === '2') {
        vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
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
};
</script>
