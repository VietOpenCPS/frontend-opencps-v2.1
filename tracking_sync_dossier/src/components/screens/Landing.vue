<template>
  <div style="width: 1300px; margin: 0 auto;">
    <v-layout wrap class="px-3 py-3" style="background-color: #eaf0f7;">
      <v-flex xs12 sm6 class="px-2 mb-3">
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Thủ tục:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 130px);"
            :items="serviceItems"
            v-model="service"
            item-text="displayName"
            item-value="serviceCode"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-autocomplete>
        </div>
      </v-flex>
      <v-flex xs12 sm6 class="px-2 mb-3">
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
      </v-flex>
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
      <v-flex class="xs12 mx-2 mt-2">
        <v-btn class="mx-0 mb-0" color="primary" dark @click.native="searchSyncDossier">
          <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
        </v-btn>
      </v-flex>
    </v-layout>
    <div>
      <v-data-table
        :headers="dossierListHeader"
        :items="dossierList"
        hide-actions
        class="table-landing table-bordered mt-3"
        style="border-left: 1px solid #dedede"
        no-data-text="Không có hồ sơ nào"
      >
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
            <td class="text-xs-center" style="width:50px;height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{ dossierPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.serviceCode}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.dossierNo}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>Từ: <span style="color:blue">{{mappingUnit(props.item.fromUnit)}}</span></span><br>
                <span>Đến: <span style="color:green">{{mappingUnit(props.item.toUnit)}}</span></span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.createDate ? currentDateFormat(props.item.createDate) : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span :style="props.item.stateSync == 1 ? 'color: green' : 'color: red'">{{props.item.stateSync == 1 ? 'Thành công' : 'Thất bại'}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.api}}</span>
              </div>
            </td>
            <td class="text-xs-center" style="height:36px;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <v-btn small color="primary" class="mx-0 my-1" v-on:click.native="showData(props.item)">
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
            <tiny-pagination :total="totalDossierSearch" :page="dossierPage" :numberPerPage="numberPerPage" nameRecord="hồ sơ" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></tiny-pagination> 
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialog_dataInfo" scrollable persistent max-width="1000px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Dữ liệu đồng bộ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_dataInfo = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1" >
          <v-layout wrap class="py-1 align-center">
            <v-flex xs12 sm6 class="px-2 data-request" style="height: 350px;">
              <v-jsoneditor class="content-data" ref="editorData" v-model="dataRequest" :options="options" :plus="true" height="100%">
            </v-flex>
            <v-flex xs12 sm6 class="px-2 data-response" style="height: 350px;">
              <v-jsoneditor class="content-data" ref="editorData" v-model="dataResponse" :options="options" :plus="true" height="100%">
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click.native="dialog_dataInfo = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from "axios"
import TinyPagination from './Pagination.vue'
import VJsoneditor from 'v-jsoneditor'

Vue.use(VJsoneditor)
export default {
  components: {
    'tiny-pagination': TinyPagination,
    VJsoneditor
  },
  data: () => ({
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
    serviceItems: [],
    service: '',
    dossierNo: '',
    dossierList: '',
    dossierPage: 1,
    numberPerPage: 10,
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
        text: 'Mã thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Luồng đồng bộ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thời gian thực hiện',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false
      },
      {
        text: 'API',
        align: 'center',
        sortable: false
      },
      {
        text: 'Dữ liệu đồng bộ',
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
    searchSyncDossier () {
      let vm = this
      vm.loadingTable = true
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
          serviceCode: vm.service,
          dossierNo: vm.dossierNo,
          fromDate: vm.fromReceiveDateFormatted,
          toDate: vm.toReceiveDateFormatted,
          start: vm.dossierPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.dossierPage * vm.numberPerPage
        }
      }
      axios.get('/o/log-report', param).then(function (response) {
        let serializable = response.data
        console.log('serializable', serializable)
        vm.loadingTable = false
        vm.dossierList = serializable['data']
        vm.totalDossierSearch = serializable['total']
      }).catch(function (error) {
        vm.loadingTable = false
        vm.dossierList = []
        vm.totalDossierSearch = 0
      })
    },
    getServiceInfo () {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        }
      }
      axios.get('/o/rest/v2/onegate/serviceconfigs/processes', param).then(function (response) {
        let serializable = response.data
        if (serializable.hasOwnProperty('data') && serializable.data) {
          vm.serviceItems = serializable.data.map(thuTuc => {
            thuTuc['displayName'] = thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
            return thuTuc
          })
        } 
      }).catch(function (error) {
        
      })
    },
    changePage (config) {
      let vm = this
      vm.dossierPage = config.page
      vm.searchSyncDossier()
    },
    mappingUnit (unit) {
      if (unit === '001.00.26.G14') {
        return 'Một cửa'
      } else if (unit === '002.00.00.G14') {
        return 'Dịch vụ công Bộ'
      } else if (unit === '003.00.26.G14') {
        return 'Cục tần số'
      } else {
        return ''
      }
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
    }
  }
};
</script>
