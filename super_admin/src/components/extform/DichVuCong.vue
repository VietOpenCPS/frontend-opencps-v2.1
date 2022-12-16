<template>
  <div style="margin: 0 auto;">
    <v-card class="mb-3 mt-2">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-btn dark icon>
          <v-icon>api</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Dịch vụ công
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark flat :loading="exportLoading" :disabled="exportLoading"
         @click="exportTableData()">
          <v-icon right dark>cloud_download</v-icon> &nbsp; Xuất file Excel 
        </v-btn>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="py-0 px-0">
      <div>
        <v-form ref="form" v-model="validFormSearch" lazy-validation>
          <div>
            <div class="adv_search my-2 px-2" :style="!boNganh ? 'background: #eeeeee' : 'background: #eeeeee;width: 100%'">
              <div :class="isDvc ? 'searchAdvanced-content pb-2' : 'searchAdvanced-content py-2'">
                <v-layout wrap>
                  <v-flex xs12 class="px-2" v-if="isDvc && !boNganh">
                    <v-layout wrap align-center>
                      <v-flex class="text-bold" style="font-weight:450;width: 200px;">Cấp đơn vị thực hiện:</v-flex>
                      <v-flex style="width: calc(100% - 200px);">    
                        <v-radio-group v-model="capCoQuanThucHien" row class="mt-2">
                          <v-radio v-for='(item, index) in administrationList' :key='index' :value="item.groupCode">
                            <div v-if="item.groupCode === 'XA_PHUONG'" slot="label">
                              <v-menu right offset-x class="d-inline-block">
                                <span small slot="activator" color="primary">
                                  {{item.groupName}} <span v-if="quanhuyenSelected">/ Cấp xã {{quanhuyenSelected.itemName}}</span>&nbsp;<v-icon size="18" class="text-bold">arrow_drop_down</v-icon>
                                </span>
                                <v-list>
                                  <v-list-tile v-for="(item, index) in listDoiTuong" :key="index" @click="getAgencys(capCoQuanThucHien, item)">
                                    <v-list-tile-title><v-icon size="18" class="blue--text" v-if="quanhuyenSelected.itemCode === item.itemCode">check</v-icon>&nbsp; Cấp xã {{item.itemName}}</v-list-tile-title>
                                  </v-list-tile>
                                </v-list>
                              </v-menu>
                            </div>
                            <span v-else slot="label">
                              {{item.groupName}}
                            </span>
                            
                          </v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12 v-if="isDvc" :class="isDvc ? 'mb-2 px-2' : 'my-2 px-2'">
                    <div>
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Đơn vị thực hiện:</div>
                      <v-autocomplete
                        placeholder="Chọn đơn vị thực hiện"
                        class="select-search d-inline-block"
                        style="width: calc(100% - 200px);"
                        :items="govAgencyList"
                        v-model="govAgencyFilter"
                        item-text="itemName"
                        item-value="itemCode"
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
                  <v-flex xs12 :class="!isDvc ? 'my-2 px-2' : 'mb-2 px-2'">
                    <div>
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Lĩnh vực</div>
                      <v-autocomplete
                        placeholder="Chọn lĩnh vực"
                        class="select-search d-inline-block"
                        style="width: calc(100% - 200px);"
                        :items="domainList"
                        v-model="domainFilter"
                        item-text="domainName"
                        item-value="domainCode"
                        hide-details
                        hide-no-data
                        solo
                        flat
                        height="32"
                        min-height="32"
                        clearable
                      >
                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          <v-flex xs12 class="v-list__tile__title">{{data.item.domainCode}} - {{data.item.domainName}}</v-flex>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-flex>
                  <v-flex xs12 class="mb-2 px-2">
                    <div>
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Thủ tục:</div>
                      <v-autocomplete
                        placeholder="Chọn thủ tục"
                        class="select-search d-inline-block"
                        style="width: calc(100% - 200px)"
                        :items="serviceInfoList"
                        v-model="serviceFilter"
                        item-text="serviceName"
                        item-value="serviceCode"
                        hide-details
                        hide-no-data
                        solo
                        flat
                        height="32"
                        min-height="32"
                        clearable
                      >
                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          <v-flex xs12 class="v-list__tile__title">{{data.item.serviceCode}} - {{data.item.serviceName}}</v-flex>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-flex>
                  <v-flex xs12 class="mb-2 px-2">
                    <div>
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Từ khóa:</div>
                      <v-text-field
                        placeholder="Nhập từ khóa"
                        v-model="keyword"
                        class="search-input-appbar input-search d-inline-block"
                        style="width: calc(100% - 200px);"
                        single-lines
                        hide-details
                        solo
                        flat
                        height="32"
                        min-height="32"
                        clearable
                        @keyup.enter="getServiceConfigList('reset')"
                      ></v-text-field>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 class="mb-2 px-2">
                    <div>
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Mức độ:</div>
                      <v-autocomplete
                        placeholder="Chọn mức độ"
                        class="select-search d-inline-block"
                        style="width: calc(100% - 200px)"
                        :items="levelList"
                        v-model="levelFilter"
                        item-text="levelName"
                        item-value="level"
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

                </v-layout>
                
                <v-flex class="xs12 mx-2">
                  <v-btn :loading="loadingTable" :style="loadingTable ? 'pointer-events: none' : ''" class="mx-0 mb-0" color="blue darken-3" dark @click.native="getServiceConfigList('reset')">
                    <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
                  </v-btn>
                  <v-btn color="blue darken-3 right" dark
                    class="mx-0 my-0"
                    @click="openCreateServiceConfig"
                    >
                    <v-icon>add_circle_outline</v-icon>&nbsp;
                    Thêm mới dịch vụ công
                  </v-btn>
                </v-flex>
              </div>
            </div>
          </div>
        </v-form>
        <!-- <v-flex xs12 class="text-xs-right">
          <v-btn color="blue darken-3" dark
            class="mx-0 my-0"
            @click="openCreateServiceConfig"
            >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm mới dịch vụ công
          </v-btn>
        </v-flex> -->
        
        <v-data-table
          :headers="serviceConfigListHeader"
          :items="serviceConfigList"
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
                    <td class="text-xs-center px-2 py-2" @click="editServiceConfig(props.item)" style="width:50px;height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{ serviceconfigPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceConfig(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.serviceName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceConfig(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.govAgencyName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center px-2 py-2" @click="editServiceConfig(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.serviceLevel}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center px-2 py-2" style="width:290px;height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <v-tooltip top class="mx-2">
                                <v-btn @click="editServiceConfig(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <span>Sửa dịch vụ công</span>
                            </v-tooltip>
                            <v-tooltip top class="mx-2">
                                <v-btn @click="deleteServiceConfig(props.item)" color="red" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                                <span>Xóa dịch vụ công</span>
                            </v-tooltip>
                            <v-btn color="green darken-3" dark small class=""
                              @click="updateServiceProcessOption(props.item)"
                            >
                              <v-icon :size="18">settings</v-icon> &nbsp; Xác lập quy trình
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
                  <tiny-pagination :total="totalServiceConfig" :page="serviceconfigPage" :numberPerPage="numberPerPage" nameRecord="dịch vụ công" custom-class="custom-tiny-class" 
                  @tiny:change-page="changePage" ></tiny-pagination> 
              </div>
            </div>
        </div>
      </div>
    </v-card>
    
  </div>
</template>

<script>
import Vue from 'vue'
import toastr from 'toastr'
import axios from "axios"
import TinyPagination from './Pagination.vue'

export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    exportLoading: false,
    validFormSearch: false,
    isDvc: false,
    quanhuyenSelected: '',
    boNganh: false,
    administrationList: [],
    capCoQuanThucHien: '',
    govAgencyList: [],
    govAgencyFilter: '',
    domainList: [],
    domainFilter: '',
    serviceInfoList: [],
    serviceFilter: '',
    levelList: [
      {levelName: 'Mức độ 2', level: 2},
      {levelName: 'Mức độ 3', level: 3},
      {levelName: 'Mức độ 4', level: 4}
    ],
    levelFilter: '',
    keyword: '',
    dialogAddApi: false,
    dialogAddRole: false,
    apiSelected: '',
    apiCode: '',
    apiName: '',
    listRoleApi: [],
    roleList: [],
    apiRole: '',
    apiDescription: '',
    className: '',
    listStatus: [
        {'name': 'Sử dụng', 'value': 1},
        {'name': 'Không sử dụng', 'value': 0}
    ],
    apiStatus: '',
    updateApi: 'add',
    fromDate: '',
    toDate: '',
    loading: false,
    loadingTable: false,
    loadingGetRole: false,
    ladingAddRole: false,
    menuDate1: false,
    menuDate2: false,
    fromReceiveDate: '',
    fromReceiveDateFormatted: '',
    toReceiveDate: '',
    toReceiveDateFormatted: '',
    apiItems: [],
    api: '',
    dossierNo: '',
    serviceConfigList: '',
    serviceconfigPage: 1,
    numberPerPage: 10,
    totalServiceConfig: 0,
    options: {
      mode: 'code'
    },
    dataRequest: {},
    dataResponse: {},
    dialog_dataInfo: false,
    rules: {
        required: value => !!value || 'Thông tin bắt buộc'
    },
    serviceConfigListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        width: 50
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đơn vị xử lý',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mức độ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    headerListRole: [
        {
            text: 'STT',
            align: 'center',
            sortable: false,
            width: 50
        },
        {
            text: 'Mã phân quyền',
            align: 'center',
            sortable: false
        },
        {
            text: 'Tên',
            align: 'center',
            sortable: false
        },
        {
            text: 'Thao tác',
            align: 'center',
            sortable: false
        }
    ]
  }),
  computed: {
    
  },
  created() {
    let vm = this
    try {
      vm.boNganh = boNganh
      // sử dụng cho các đơn vị bộ ngành
    } catch (error) {
    }
    try {
      vm.isDvc = isDvc
    } catch (error) {
    }
    vm.$nextTick(() => {
      vm.getServiceConfigList()
      vm.getDomains()
      if (!vm.boNganh && vm.isDvc) {
        vm.getServiceAdminisTration()
      } else {
        // vm.getDomains()
        // vm.getServiceInfo()
      }
    })
  },
  watch: {
    capCoQuanThucHien (val) {
      let vm = this
      vm.govAgencyList = []
      vm.govAgencyFilter = ''
      vm.domainFilter = ''
      vm.serviceFilter = ''
      vm.quanhuyenSelected = ''
      if(val){
        if (val !== 'XA_PHUONG') {
          vm.getAgencys(val)
        }
        if (val === 'QUAN_HUYEN' || val === 'XA_PHUONG') {
          vm.getDomains(val === 'QUAN_HUYEN' ? 'CAP_HUYEN' : 'CAP_XA')
          vm.getServiceInfo(val === 'QUAN_HUYEN' ? 'CAP_HUYEN' : 'CAP_XA', vm.domainFilter)
        } else {
          vm.domainList = []
          vm.serviceInfoList = []
        }
      }
      
    },

    govAgencyFilter (val) {
      let vm = this
      vm.domainFilter = ''
      vm.serviceFilter = ''
      if (val && vm.capCoQuanThucHien === 'SBN') {
        vm.getDomains(val)
        vm.getServiceInfo(val, vm.domainFilter)
      }
    },
    domainFilter (val) {
      let vm = this
      if (val) {
        if (vm.capCoQuanThucHien === 'QUAN_HUYEN' || vm.capCoQuanThucHien === 'XA_PHUONG') {
          vm.getServiceInfo(vm.capCoQuanThucHien === 'QUAN_HUYEN' ? 'CAP_HUYEN' : 'CAP_XA', val)
        } else {
          vm.getServiceInfo(vm.govAgencyFilter, val)
        }
      }
    }
  },
  methods: {
    exportTableData() {
      let vm = this
      let options = {
        headers: {
          'groupId': window.themeDisplay.getScopeGroupId(),
          'Token': window.Liferay !== undefined ? window.Liferay.authToken : '',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        responseType: 'blob'
      }
      vm.exportLoading = true
      axios.get('/o/rest/v2/serviceconfigs?exportExcel=true&columnName=domainCode,domainName,serviceCode,serviceName,govAgencyCode,govAgencyName,serviceLevel&tableName=ServiceConfig', options)
      .then(function (response) {
        vm.exportLoading = false
        var fileNames = response.headers['content-disposition']
        var fileName = fileNames.split('filename=')[1] || dataReq.fileName
        fileName = fileName.split('"').join('')
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.style = 'display: none'
        var urlFile = window.URL.createObjectURL(response.data)
        a.href = urlFile
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(urlFile)
      }).catch(function (error) {
        vm.exportLoading = false
      })
    },
    getServiceAdminisTration () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let sortCode = function (serviceList) {
        function compare(a, b) {
          if (a.dictGroupId < b.dictGroupId)
            return -1
          if (a.dictGroupId > b.dictGroupId)
            return 1
          return 0
        }
        return serviceList.sort(compare)
      }
      vm.$store.dispatch('getServiceAdminisTration', {}).then(
        res => {
          vm.administrationList = sortCode(res)
          vm.capCoQuanThucHien = 'SBN'
          vm.getAgencys('SBN')
          vm.getAgencys('QUAN_HUYEN')
        }
      ).catch(()=>{})
    },
    getAgencys(administrationCode, parentFilter) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let data = {
        administration: administrationCode ? administrationCode : '',
        parent: parentFilter ? parentFilter.itemCode : ''
      }
      if (!parentFilter) {
        vm.$store.dispatch('getAgencys', data).then(
          res => {
            vm.govAgencyList = res
            if (administrationCode === 'QUAN_HUYEN') {
              vm.listDoiTuong = vm.govAgencyList
            }
          }
        ).catch(()=>{
          vm.govAgencyList = []
        }) 
      } else {
        vm.quanhuyenSelected = parentFilter
        vm.$store.dispatch('getAgencysFromParent', data).then(
          res => {
            vm.govAgencyList = res
          }
        ).catch(()=>{
          vm.govAgencyList = []
        }) 
      }
            
    },
    getAgencysBoNganh() {
      let vm = this
      let data = {}
      vm.govAgencyList = []
      vm.$store.dispatch('getAgencysFromDict', data).then(
        res => {
          vm.govAgencyList = res
        }
      ).catch(()=>{
        vm.govAgencyList = []
      })
    },
    getDomains (agencyCode) {
      let vm = this
      let data = {
        agencyCode: agencyCode ? agencyCode : ''
      }
      vm.domainList = []
      vm.$store.dispatch('getDomain', data).then(
        res => {
          vm.domainList = res
        }
      ).catch(()=>{
        vm.domainList = []
      })      
    },
    getServiceInfo (agencyCode, domainCode) {
      let vm = this
      let data = {
        domain: domainCode ? domainCode : '',
        administration: agencyCode ? agencyCode : '',
        start: 0,
        end: 1000
      }
      vm.serviceInfoList = []
      vm.$store.dispatch('getServiceInfo', data).then(function(res) {
        vm.serviceInfoList = res
      }).catch(()=>{
        vm.serviceInfoList = []
      })  
    },
    openCreateServiceConfig () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      if (vm.govAgencyFilter) {
        if (vm.isDvc && !vm.boNganh) {
          vm.$router.push({
            path: '/table/opencps_serviceconfig/editor/0?administration=' + vm.capCoQuanThucHien + '&govAgencyCode=' + vm.govAgencyFilter + '&domainCode=' + vm.domainFilter + '&serviceCode=' + vm.serviceFilter + '&level=' + vm.levelFilter,
          })
        } else {
          vm.$router.push({
            path: '/table/opencps_serviceconfig/editor/0?govAgencyCode=' + vm.govAgencyFilter + '&domainCode=' + vm.domainFilter + '&serviceCode=' + vm.serviceFilter + '&level=' + vm.levelFilter,
          })
        }
      } else {
        // if (vm.isDvc) {
        //   toastr.error('Vui lòng chọn đơn vị thực hiện để thêm mới');
        // } else {
          vm.$router.push({
            path: '/table/opencps_serviceconfig/editor/0?govAgencyCode=' + vm.govAgencyFilter + '&domainCode=' + vm.domainFilter + '&serviceCode=' + vm.serviceFilter + '&level=' + vm.levelFilter,
          })
        // }
      }
    },
    getServiceConfigList (reset) {
      let vm = this
      if (reset) {
        vm.serviceconfigPage = 1
      }
      vm.loadingTable = true
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
          start: vm.serviceconfigPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.serviceconfigPage * vm.numberPerPage,
          agency: vm.govAgencyFilter,
          domain: vm.domainFilter,
          service: vm.serviceFilter,
          level: vm.levelFilter,
          keyword: vm.keyword
        }
      }
      axios.get('/o/rest/v2/serviceconfigs', param).then(function (response) {
        let serializable = response.data
        vm.loadingTable = false
        if (serializable['data']) {
            vm.serviceConfigList = Array.isArray(serializable['data']) ? serializable['data'] : [serializable['data']]
            vm.totalServiceConfig = serializable['total']
        } else {
            vm.serviceConfigList = []
            vm.totalServiceConfig = 0
        }
      }).catch(function (error) {
        vm.loadingTable = false
        vm.serviceConfigList = []
        vm.totalServiceConfig = 0
      })
    },
    changePage (config) {
      let vm = this
      vm.serviceconfigPage = config.page
      vm.getServiceConfigList()
    },
    editServiceConfig (item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$router.push({
        path: '/table/opencps_serviceconfig/editor/' + item.serviceConfigId,
        query: newQuery
      })
    },
    deleteServiceConfig (item) {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        }
      }
      let x = confirm('Bạn có chắc chắn xóa dịch vụ công này')
      if (x) {
        axios.delete('/o/rest/v2/serviceconfigs/' + item['serviceConfigId'], param).then(function () {
          toastr.success('Xóa dịch vụ công thành công')
          vm.getServiceConfigList()
        }).catch(function (error) {
          toastr.error('Xóa dịch vụ công không thành công')
        })
      }
    },
    updateServiceProcessOption (item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$router.push({
        path: '/table/opencps_processoption?serviceConfigId=' + item.serviceConfigId + '&serviceConfigName=' + item.serviceName
      })
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
}
</script>
