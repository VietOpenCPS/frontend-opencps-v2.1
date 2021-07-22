<template>
  <div style="margin: 0 auto;max-width: 1300px">
    <v-card class="mb-3 mt-2">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-btn dark icon>
          <v-icon>send_and_archive</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0" style="font-size: 16px !important">
          Theo dõi truy cập API hệ thống
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-layout wrap class="px-3 py-3" style="background-color: #ececec;">
      <v-flex xs12 sm12 class="px-2 mb-3">
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Danh sách API:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 130px);"
            :items="apiItems"
            v-model="api"
            item-text="apiName"
            item-value="apiCode"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          >
            <template slot="selection" slot-scope="props">
              <div>{{ props.item.apiName }}</div>
            </template>
            <template slot="item" slot-scope="props">
              <div style="font-size: 14px !important">{{ props.item.apiName }} - {{ props.item.apiDescription }}</div>
            </template>
          </v-autocomplete>
        </div>
      </v-flex>
      <!-- <v-flex xs12 sm6 class="px-2 mb-3">
        <div class="d-inline-block text-bold pt-2" style="font-weight:450;width: 130px;">Mã hồ sơ:</div>
        <v-text-field
          v-model="dossierNo"
          class="search-input-appbar input-search d-inline-block"
          style="width: calc(100% - 130px);"
          single-lines
          hide-details
          solo
          flat
          height="32"
          min-height="32"
          clearable
        ></v-text-field>
      </v-flex> -->
      <v-flex xs12 sm6 class="px-2">
        <div class="layout wrap">
          <div class="d-inline-block text-bold pt-2" style="font-weight:450;width: 130px;">Từ ngày:</div>
          <v-menu
            style="width: calc(100% - 130px);"
            ref="menuDate1"
            v-model="menuDate1"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            full-width
          >

            <v-text-field
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
            ></v-text-field>
            <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : currentDate()" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('1')"></v-date-picker>
          </v-menu>
        </div>
        
      </v-flex>
      <v-flex xs12 sm6 class="px-2">
        <div class="layout wrap">
          <div class="d-inline-block text-bold pt-2" style="font-weight:450;width: 130px;">Đến ngày:</div>
          <v-menu
            style="width: calc(100% - 130px);"
            ref="menuDate2"
            v-model="menuDate2"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            full-width
          >

            <v-text-field
            slot="activator"
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
            <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" :max="currentDate()" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('2')"></v-date-picker>
          </v-menu>
        </div>
      </v-flex>
      <v-flex xs12 sm4 class="px-2 mt-3">
        <div class="layout wrap">
          <div class="d-inline-block text-bold pt-2" style="font-weight:450;width: 130px;">Tháng:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 130px);"
            :items="months"
            v-model="month"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          >
          </v-autocomplete>
        </div>
      </v-flex>
      <v-flex xs12 sm4 class="px-2 mt-3">
        <div class="layout wrap">
          <div class="d-inline-block text-bold pt-2" style="font-weight:450;width: 130px;">Quý:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 130px);"
            :items="quarters"
            v-model="quarter"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          >
          </v-autocomplete>
        </div>
      </v-flex>
      <v-flex xs12 sm4 class="px-2 mt-3">
        <div class="layout wrap">
          <div class="d-inline-block text-bold pt-2" style="font-weight:450;width: 130px;">Năm:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 130px);"
            :items="years"
            v-model="year"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          >
          </v-autocomplete>
        </div>
      </v-flex>
      <v-flex class="xs12 mx-2 mt-3">
        <v-btn :loading="loadingTable" :disabled="loadingTable" class="mx-0 mb-0" color="blue darken-3" dark @click.native="searchSyncDossier">
          <v-icon size="18">search</v-icon> &nbsp; Xem danh sách chi tiết
        </v-btn>
        <v-btn :loading="loading" :disabled="loading" class="mx-0 mb-0" color="blue darken-3 ml-3" dark @click.native="openReport">
          <v-icon size="18">fact_check</v-icon> &nbsp; Thống kê báo cáo
        </v-btn>
      </v-flex>
    </v-layout>
    <div v-if="!showBaoCao">
      <v-data-table
        :headers="dossierListHeader"
        :items="dossierList"
        hide-actions
        class="table-landing table-bordered mt-3"
        style="border: 1px solid rgb(222, 222, 222);"
        no-data-text="Không có dữ liệu"
      >
        <template slot="headers" slot-scope="props">
            <tr style="height: 42px;">
                <th 
                    v-for="header in props.headers"
                    :key="header.text"
                    :class="header['class'] ? header['class'] : ''"
                    :width="header['width'] ? header['width'] + 'px' : ''"
                    style="border-right: 1px solid #dedede"
                >
                    <v-tooltip bottom>
                        <span slot="activator">{{ header.text }}</span>
                        <span>{{ header.text }}</span>
                    </v-tooltip> 
                </th>
            </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
            <td class="text-xs-center" style="width:50px;height:36px;border-right: 1px solid #dedede">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{ dossierPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;border-right: 1px solid #dedede">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.api}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;border-right: 1px solid #dedede">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.createDate ? currentDateFormat(props.item.createDate) : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;border-right: 1px solid #dedede">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span :style="props.item.stateSync == 1 ? 'color: green' : 'color: red'">{{props.item.stateSync == 1 ? 'Thành công' : 'Thất bại'}}</span>
              </div>
            </td>
            <td class="text-xs-center" style="height:36px;border-right: 1px solid #dedede">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <v-btn small color="blue" class="mx-0 my-1 white--text" v-on:click.native="showData(props.item)">
                  Xem dữ liệu
                </v-btn>
              </div>
            </td>
            
          </tr>
        </template>
      </v-data-table>
      <!--  -->
      <div class="my-2">
        <div class="text-xs-right layout wrap" style="position: relative;">
          <div class="flex pagging-table"> 
            <tiny-pagination :total="totalDossierSearch" :page="dossierPage" :numberPerPage="numberPerPage" nameRecord="" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></tiny-pagination> 
          </div>
        </div>
      </div>
    </div>
    <bao-cao v-if="showBaoCao" :dataImport="dataReport" :fromDate="fromDateFormatted" :toDate="toDateFormatted"
      :month="month" :quarter="quarter" :year="year"
    ></bao-cao>
    <v-dialog v-model="dialog_dataInfo" scrollable persistent max-width="1000px">
      <v-card>
        <v-toolbar dark color="blue" class="">
          <v-toolbar-title>Dữ liệu</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_dataInfo = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1" >
          <v-layout wrap class="py-1 align-center mt-3">
            <v-flex xs12 sm6 class="px-2 data-request" >
              <v-textarea
                label="Dữ liệu gửi"
                v-model="dataRequest"
                :rows="5"
                box
              ></v-textarea>
              
            </v-flex>
            <v-flex xs12 sm6 class="px-2 data-response">
              <v-textarea
                label="Dữ liệu nhận"
                v-model="dataResponse"
                :rows="5"
                box
              ></v-textarea>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="blue white--text" @click.native="dialog_dataInfo = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"
import TinyPagination from './Pagination.vue'
import BaoCaoThongKe from './Landing.vue'

export default {
  components: {
    'tiny-pagination': TinyPagination,
    'bao-cao': BaoCaoThongKe
  },
  data: () => ({
    showBaoCao: false,
    months: [1,2,3,4,5,6,7,8,9,10,11,12],
    month: '',
    quarters: [1,2,3,4],
    quarter: '',
    years: [2021,2022,2023,2024,2025],
    year: '',
    fromDate: '',
    toDate: '',
    loading: false,
    loadingTable: false,
    menuDate1: false,
    menuDate2: false,
    fromReceiveDate: '',
    fromReceiveDateFormatted: '',
    toReceiveDate: '',
    toReceiveDateFormatted: '',
    apiItems: [],
    api: '',
    dossierNo: '',
    dataReport: '',
    dossierList: '',
    dossierPage: 1,
    numberPerPage: 15,
    totalDossierSearch: 0,
    options: {
      mode: 'code'
    },
    dataRequest: {},
    dataResponse: {},
    dialog_dataInfo: false,
    dossierListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'API',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thời gian truy cập',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false
      },
      {
        text: 'Dữ liệu truy cập',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    
  },
  created() {
    let vm = this
    vm.$nextTick(() => {
      vm.getServiceInfo()
      vm.searchSyncDossier()
    })
  },
  watch: {
    month(val) {
      let vm = this
      if (val) {
        if (!vm.year) {
          vm.year = (new Date()).getFullYear()
        }
        vm.quarter = ''
        vm.fromReceiveDateFormatted = ''
        vm.toReceiveDateFormatted = ''
        vm.fromDate = ''
        vm.toDate = ''
      }
    },
    quarter(val) {
      let vm = this
      if (val) {
        if (!vm.year) {
          vm.year = (new Date()).getFullYear()
        }
        vm.month = ''
        vm.fromReceiveDateFormatted = ''
        vm.toReceiveDateFormatted = ''
        vm.fromDate = ''
        vm.toDate = ''
      }
    },
    year(val) {
      let vm = this
      if (val) {
        vm.fromReceiveDateFormatted = ''
        vm.toReceiveDateFormatted = ''
        vm.fromDate = ''
        vm.toDate = ''
      }
    }
  },
  methods: {
    showData (item) {
      let vm = this
      try {
        vm.dataRequest = JSON.parse(item.bodyRequest)
      } catch (error) {
        vm.dataRequest = {}
      }
      try {
        vm.dataResponse = JSON.parse(item.bodyResponse)
      } catch (error) {
        vm.dataResponse = {}
      }
      vm.dialog_dataInfo = true
      $('.data-request .jsoneditor-menu').html('<div class="px-2 py-2">Dữ liệu gửi</div>')
      $('.data-response .jsoneditor-menu').html('<div class="px-2 py-2">Dữ liệu nhận</div>')
    },
    openReport () {
      let vm = this
      vm.getReportApi()
    },
    searchSyncDossier () {
      let vm = this
      vm.showBaoCao = false
      vm.loadingTable = true
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
          api: vm.api,
          dossierNo: vm.dossierNo,
          fromDate: vm.fromReceiveDateFormatted,
          toDate: vm.toReceiveDateFormatted,
          start: vm.dossierPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.dossierPage * vm.numberPerPage
        }
      }
      if (vm.month) {
        param.params['fromDate'] = '01/' + vm.month.toString().padStart(2, '0') + '/' + vm.year
        param.params['toDate'] = '31/' + vm.month.toString().padStart(2, '0') + '/' + vm.year
      }
      if (vm.quarter) {
        param.params['fromDate'] = '01/' + (vm.quarter*3 - 3 + 1).toString().padStart(2, '0') + '/' + vm.year
        param.params['toDate'] = '31/' + (vm.quarter*3).toString().padStart(2, '0') + '/' + vm.year
      }
      if (vm.year && !vm.month && !vm.quarter) {
        param.params['fromDate'] = '01/01/' + vm.year
        param.params['toDate'] = '31/12/' + vm.year
      }
      axios.get('/o/rest/v2/socket/web/log-report', param).then(function (response) {
        let serializable = response.data
        vm.loadingTable = false
        vm.dossierList = serializable['data']
        vm.totalDossierSearch = serializable['total']
      }).catch(function (error) {
        vm.loadingTable = false
        vm.dossierList = []
        vm.totalDossierSearch = 0
      })
    },
    getReportApi () {
      let vm = this
      vm.loading = true
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
          api: vm.api,
          fromDate: vm.fromReceiveDateFormatted,
          toDate: vm.toReceiveDateFormatted
        }
      }
      if (vm.month) {
        param.params['fromDate'] = '01/' + vm.month.toString().padStart(2, '0') + '/' + vm.year
        param.params['toDate'] = '31/' + vm.month.toString().padStart(2, '0') + '/' + vm.year
      }
      if (vm.quarter) {
        param.params['fromDate'] = '01/' + (vm.quarter*3 - 3 + 1).toString().padStart(2, '0') + '/' + vm.year
        param.params['toDate'] = '31/' + (vm.quarter*3).toString().padStart(2, '0') + '/' + vm.year
      }
      if (vm.year && !vm.month && !vm.quarter) {
        param.params['fromDate'] = '01/01/' + vm.year
        param.params['toDate'] = '31/12/' + vm.year
      }
      axios.get('/o/rest/v2/socket/web/statistic/log-report', param).then(function (response) {
        let serializable = response.data
        vm.loading = false
        let dataReport = serializable['data']
        vm.showBaoCao = true
        vm.dataReport = []
        let dataRaw = {}
        for (let key in dataReport) {
          let dataReportCurrent = {
            apiCode: dataReport[key]['apiCode'],
            apiName: dataReport[key].hasOwnProperty('apiName') ? dataReport[key]['apiName'] : '',
            apiDescription: dataReport[key].hasOwnProperty('apiDescription') ? dataReport[key]['apiDescription'] : '',
            totalAccess: dataReport[key]['totalAccess'],
            totalAccessFal: dataReport[key]['totalAccessFal'],
            totalAccessSuc: dataReport[key]['totalAccessSuc']
          }
          if (dataRaw.hasOwnProperty(dataReportCurrent['apiCode'])) {
            let key = dataReportCurrent['apiCode']
            dataRaw[key]['totalAccess'] += dataReportCurrent['totalAccess']
            dataRaw[key]['totalAccessFal'] += dataReportCurrent['totalAccessFal']
            dataRaw[key]['totalAccessSuc'] += dataReportCurrent['totalAccessSuc']
          } else {
            dataRaw[dataReportCurrent['apiCode']] = dataReportCurrent
          }
        }
        for (let key in dataRaw) {
          vm.dataReport.push(dataRaw[key])
        }
        console.log('dataReport',vm.dataReport)
      }).catch(function (error) {
        vm.loading = false
        vm.dataReport = []
      })
    },
    getServiceInfo () {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        }
      }
      axios.get('/o/rest/v2/socket/web/apiManagers', param).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data') && serializable.data) {
          let dataOut = serializable.data
          if (Array.isArray(serializable.data)) {
            dataOut = serializable.data
          } else {
            dataOut = [serializable.data]
          }
          vm.apiItems = dataOut
        } 
      }).catch(function (error) {
        
      })
    },
    changePage (config) {
      let vm = this
      vm.dossierPage = config.page
      vm.searchSyncDossier()
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
      vm.menuDate1 = vm.menuDate2 = false
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
      return `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()} ${date1.getHours().toString().padStart(2, '0')}:${date1.getMinutes().toString().padStart(2, '0')}`
    },
    backToList () {
      window.history.back()
    }
  }
};
</script>
