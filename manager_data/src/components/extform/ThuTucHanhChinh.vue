<template>
  <div style="margin: 0 auto;">
    <vue-confirm-dialog></vue-confirm-dialog>
    <v-card class="mb-3">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-toolbar-title class="ml-0">
          Thủ tục hành chính
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="exportExcel" dark flat :loading="exportLoading" :disabled="exportLoading"
         @click="exportTableData()">
          <v-icon right dark>cloud_download</v-icon> &nbsp; Xuất file Excel 
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="py-0 px-2">
      <div>
        <v-form ref="form" v-model="validFormSearch" lazy-validation>
          <div>
            <div class="adv_search my-2 px-2" :style="!boNganh ? 'background: #eeeeee' : 'background: #eeeeee;width: 100%'">
              <div :class="isDvc ? 'searchAdvanced-content pb-2' : 'searchAdvanced-content py-2'">
                <v-layout wrap>
                  <v-flex xs12 v-if="isDvc" class="my-2 px-2">
                    <div>
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Đơn vị:</div>
                      <v-autocomplete
                        placeholder="Chọn đơn vị"
                        class="select-search d-inline-block"
                        style="width: calc(100% - 200px);"
                        :items="govAgencyList"
                        v-model="govAgencyFilter"
                        item-text="administrationName"
                        item-value="administrationCode"
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
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Lĩnh vực:</div>
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
                      <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Từ khóa:</div>
                      <v-text-field
                        placeholder="Tên thủ tục, mã thủ tục, ..."
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
                        @keyup.enter="getServiceInfoList('reset')"
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
                  <v-btn :loading="loadingTable" :style="loadingTable ? 'pointer-events: none' : ''"
                     class="mx-0 mb-0" color="blue darken-3" dark @click.native="getServiceInfoList('reset')">
                    <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
                  </v-btn>
                  <v-btn color="blue darken-3 right" dark
                    class="mx-0 my-0"
                    @click="openCreateServiceInfo"
                    >
                    <v-icon>add_circle_outline</v-icon>&nbsp;
                    Thêm mới 
                  </v-btn>
                </v-flex>
              </div>
            </div>
          </div>
        </v-form>
        <v-data-table
          :headers="serviceInfoListHeader"
          :items="serviceInfoList"
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
                    <td class="text-xs-center px-2 py-2" @click="editServiceinfo(props.item)" style="width:50px;height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{ serviceinfoPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                        </div>
                    </td>
										<td class="text-xs-left px-2 py-2" @click="editServiceinfo(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.serviceCode}}</span>
                        </div>
                    </td>
										<td v-if="showMaDvcqg" class="text-xs-left px-2 py-2" @click="editServiceinfo(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.serviceCodeDVCQG}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceinfo(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.serviceName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceinfo(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.administrationName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceinfo(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.domainName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center px-2 py-2" @click="editServiceinfo(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.maxLevel}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center px-2 py-2" style="width:220px;height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <v-tooltip top class="mx-2">
                                <v-btn :disabled="loading" @click="cloneThuTuc(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>sync</v-icon>
                                </v-btn>
                                <span>Đồng bộ sang Cổng dịch vụ công</span>
                            </v-tooltip>
                            <v-tooltip v-if="agencyListManager" top class="mx-2">
                                <v-btn :disabled="loading" @click="showCloneDonVi(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>input</v-icon>
                                </v-btn>
                                <span>Đồng bộ sang đơn vị khác</span>
                            </v-tooltip>
                            <v-tooltip top class="mx-2">
                                <v-btn :disabled="loading" @click="editServiceinfo(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <span>Sửa</span>
                            </v-tooltip>
                            <v-tooltip top class="mx-2">
                                <v-btn :disabled="loading" @click="deleteServiceinfo(props.item)" color="red" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                                <span>Xóa</span>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <!--  -->
        <div class="my-2">
            <div class="text-xs-right layout wrap" style="position: relative;">
              <div class="flex pagging-table"> 
                  <tiny-pagination :total="totalServiceinfo" :page="serviceinfoPage" :numberPerPage="numberPerPage" nameRecord="thủ tục" custom-class="custom-tiny-class" 
                  @tiny:change-page="changePage" ></tiny-pagination> 
              </div>
            </div>
        </div>
      </div>
    </v-card>
    <v-dialog v-model="dialog_cloneServiceinfo" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline pb-2">
          <span>Đồng bộ thủ tục: {{oldServiceName}}</span>
        </v-card-title>
        <v-card-text class="pt-3">
          <v-form ref="formCloneServiceProcess" v-model="validForm" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12 class="my-2">
                <div>
                  <div class="my-2">Đồng bộ đến đơn vị:</div>
                  <v-autocomplete
                    placeholder="Chọn đơn vị"
                    :items="agencyListManager"
                    v-model="toAgency"
                    item-text="text"
                    item-value="value"
                    hide-details
                    hide-no-data
                    return-object
                    box
                    :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                    :required="true"
                  ></v-autocomplete>
                </div>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" class="mr-0" dark v-on:click="dialog_cloneServiceinfo = false">
            <v-icon class="white--text">clear</v-icon>&nbsp;
            Hủy
          </v-btn>
          <v-btn color="blue darken-3" dark
            :loading="loading"
            :disabled="loading"
            @click="cloneThuTucSangDonVi"
          >
            <v-icon>save</v-icon>&nbsp;
            <span>Đồng bộ</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import toastr from 'toastr'
import axios from "axios"
import TinyPagination from './Pagination.vue'
import VueConfirmDialog from 'vue-confirm-dialog'
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    dialog_cloneServiceinfo: false,
    oldServiceName: '',
    validForm: false,
    toAgency: '',
    serviceInfoSelect: '',
		showMaDvcqg: false,
    exportExcel: false,
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
    serviceInfoList: '',
    serviceinfoPage: 1,
    numberPerPage: 10,
    totalServiceinfo: 0,
    options: {
      mode: 'code'
    },
    dataRequest: {},
    dataResponse: {},
    dialog_dataInfo: false,
    rules: {
        required: value => !!value || 'Thông tin bắt buộc'
    },
    serviceInfoListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        width: 50
      },
			{
        text: 'Mã thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đơn vị',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lĩnh vực',
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
    agencyListManager() {
      return this.$store.getters.getAgencyListManager
    },
    agencyManager () {
      return this.$store.getters.agencyManager
    },
    agencyCurrentSite () {
      return this.$store.getters.getCurrentSite
    }
  },
  created() {
    let vm = this
    try {
      vm.isDvc = isDvc
    } catch (error) {
    }
    vm.$nextTick(() => {
      let dataPost = new URLSearchParams()
      let textPost = {
        'type': 'admin',
        'cmd': 'get',
        'config': 'true',
        'code': 'opencps_serviceinfo',
        'respone': 'tableConfig'
      }
      dataPost.append('text', JSON.stringify(textPost))
      axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
        let dataObj = response.data.hasOwnProperty('tableConfig') ? response.data['tableConfig'] : ''
        if (dataObj && dataObj['detailColumns']) {
          try {
            let detailColumns = JSON.parse(dataObj['detailColumns'])
            for (let i=0; i<detailColumns.length; i++){
              if (detailColumns[i]['showMaDvcqg']) {
                vm.showMaDvcqg = true
                vm.serviceInfoListHeader.splice(2, 0, {
                  text: 'Mã trên DVCQG',
                  align: 'center',
                  sortable: false
                })
              }
              if (detailColumns[i]['exportExcel']){
                vm.exportExcel = true
              }
            }
          } catch (err) {
          }
        }
        if (vm.isDvc) {
          vm.getAdministration()
        }
        vm.getServiceInfoList()
        vm.getDomains()
      }).catch(function () {
        if (vm.isDvc) {
          vm.getAdministration()
        }
        vm.getServiceInfoList()
        vm.getDomains()
      })
    })
  },
  watch: {
    govAgencyFilter (val) {
      let vm = this
      vm.domainFilter = ''
      vm.serviceFilter = ''
      if (val && vm.isDvc) {
        vm.getDomains(val)
      }
    },
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      let dataPost = new URLSearchParams()
      let textPost = {
        'type': 'admin',
        'cmd': 'get',
        'config': 'true',
        'code': 'opencps_serviceinfo',
        'respone': 'tableConfig'
      }
      dataPost.append('text', JSON.stringify(textPost))
      axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
        let dataObj = response.data.hasOwnProperty('tableConfig') ? response.data['tableConfig'] : ''
        if (dataObj && dataObj['detailColumns']) {
          try {
            let detailColumns = JSON.parse(dataObj['detailColumns'])
            for (let i=0; i<detailColumns.length; i++){
              if (detailColumns[i]['showMaDvcqg']) {
                vm.showMaDvcqg = true
                vm.serviceInfoListHeader.splice(2, 0, {
                  text: 'Mã trên DVCQG',
                  align: 'center',
                  sortable: false
                })
              }
              if (detailColumns[i]['exportExcel']){
                vm.exportExcel = true
              }
            }
          } catch (err) {
          }
        }
        if (vm.isDvc) {
          vm.getAdministration()
        }
        vm.getServiceInfoList()
        vm.getDomains()
      }).catch(function () {
        if (vm.isDvc) {
          vm.getAdministration()
        }
        vm.getServiceInfoList()
        vm.getDomains()
      })
    },
  },
  methods: {
    exportTableData() {
      let vm = this
      let options = {
        headers: {
          'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
          'Token': window.Liferay !== undefined ? window.Liferay.authToken : '',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        responseType: 'blob'
      }
      vm.exportLoading = true
      axios.get('/o/rest/v2/serviceinfos?exportExcel=true&columnName=serviceCode,serviceName,domainCode,domainName,administrationCode,administrationName,maxLevel&tableName=ServiceInfo', options)
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
    getAdministration() {
      let vm = this
      let data = {}
			vm.$store.dispatch('getAdministration', data).then(
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
        administration: agencyCode ? agencyCode : ''
      }
      vm.serviceInfoList = []
      vm.$store.dispatch('getServiceInfo', data).then(function(res) {
        vm.serviceInfoList = res
      }).catch(()=>{
        vm.serviceInfoList = []
      })  
    },
    openCreateServiceInfo () {
      let vm = this
      vm.$router.push({
        path: '/table/opencps_serviceinfo/editor/0',
				query: {
					renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
				}
      })
    },
    getServiceInfoList (reset) {
      let vm = this
      if (reset) {
        vm.serviceinfoPage = 1
      }
      vm.loadingTable = true
      let groupIdSite = vm.$store.getters.groupIdAgencyManager
      let param = {
        headers: {
          'groupId': groupIdSite ? groupIdSite : window.themeDisplay.getScopeGroupId(),
        },
        params: {
          start: vm.serviceinfoPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.serviceinfoPage * vm.numberPerPage,
          administration: vm.govAgencyFilter,
          domain: vm.domainFilter,
          level: vm.levelFilter,
          keyword: vm.keyword,
          active: "true"
        }
      }
      axios.get('/o/rest/v2/serviceinfos', param).then(function (response) {
        let serializable = response.data
        vm.loadingTable = false
        if (serializable['data']) {
            vm.serviceInfoList = Array.isArray(serializable['data']) ? serializable['data'] : [serializable['data']]
            vm.totalServiceinfo = serializable['total']
        } else {
            vm.serviceInfoList = []
            vm.totalServiceinfo = 0
        }
      }).catch(function (error) {
        vm.loadingTable = false
        vm.serviceInfoList = []
        vm.totalServiceinfo = 0
      })
    },
    changePage (config) {
      let vm = this
      vm.serviceinfoPage = config.page
      vm.getServiceInfoList()
    },
    editServiceinfo (item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$router.push({
        path: '/table/opencps_serviceinfo/editor/' + item.serviceInfoId + '?serviceCodeDvcqg=' + item.serviceCodeDVCQG + '&serviceCode=' + item.serviceCode
      })
    },
    deleteServiceinfo (item) {
      let vm = this
      vm.$confirm({
        title: 'XÓA THỦ TỤC HÀNH CHÍNH',
        message: 'Bạn có chắc chắn xóa thủ tục này',
        button: {
          yes: 'Có',
          no: 'Không'
        },
        callback: confirm => {
          if (confirm == true) {
            let param = {
              headers: {
                'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
              }
            }

            axios.delete('/o/rest/v2/serviceinfos/' + item['serviceInfoId'], param).then(function () {
              toastr.success('Xóa thủ tục thành công')
              vm.getServiceInfoList()
            }).catch(function (error) {
              toastr.error('Xóa thủ tục thất bại')
            })
          }
        }
      })
    },
    showCloneDonVi (item) {
      let vm = this
      vm.dialog_cloneServiceinfo = true
      vm.serviceInfoSelect = item
      vm.oldServiceName = item.serviceName
    },
    cloneThuTuc (item) {
      let vm = this
      vm.$confirm({
        title: 'ĐỒNG BỘ THỦ TỤC HÀNH CHÍNH',
        message: 'Bạn có chắc chắn đồng bộ thủ tục này sang Cổng dịch vụ công',
        button: {
          yes: 'Có',
          no: 'Không'
        },
        callback: confirm => {
          if (confirm == true) {
            vm.loading = true
            let options = {
              headers: {
                'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                'Accept': 'application/json',
                'Content-Type': "application/x-www-form-urlencoded",
                'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
              }
            }
            let dataPostdossier = new URLSearchParams()
            dataPostdossier.append('type', 'serviceInfo')
            dataPostdossier.append('serviceCode', item.serviceCode)
            if (vm.agencyManager) {
              dataPostdossier.append('fromServerNo', vm.agencyManager['serveNo'])
            } else if (vm.agencyCurrentSite) {
              dataPostdossier.append('fromServerNo', vm.agencyCurrentSite['serveNo'])
            } else {
              dataPostdossier.append('fromServerNo', "")
            }
            dataPostdossier.append('toServerNo', "SERVER_DVC")
            axios.post('/o/rest/v2/backupDatas/syncMasterDataDVC', dataPostdossier, options).then(function (response) {
              vm.loading = false
              toastr.success('Thủ tục đã được đồng bộ sang cổng Dịch vụ công')
            }).catch(function () {
              vm.loading = false
              toastr.error('Đồng bộ thất bại')
            })
          }
        }
      })
    },
    cloneThuTucSangDonVi () {
      let vm = this
      if (vm.$refs.formCloneServiceProcess.validate()) {
        vm.$confirm({
          title: 'ĐỒNG BỘ THỦ TỤC HÀNH CHÍNH',
          message: 'Bạn có chắc chắn đồng bộ thủ tục này',
          button: {
            yes: 'Có',
            no: 'Không'
          },
          callback: confirm => {
            if (confirm == true) {
              vm.loading = true
              let options = {
                headers: {
                  'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                  'Accept': 'application/json',
                  'Content-Type': "application/x-www-form-urlencoded",
                  'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
                }
              }
              let dataPostdossier = new URLSearchParams()
              dataPostdossier.append('type', 'serviceInfo')
              dataPostdossier.append('serviceCode', vm.serviceInfoSelect.serviceCode)
              if (vm.agencyManager) {
                dataPostdossier.append('fromServerNo', vm.agencyManager['serveNo'])
              } else if (vm.agencyCurrentSite) {
                dataPostdossier.append('fromServerNo', vm.agencyCurrentSite['serveNo'])
              } else {
                dataPostdossier.append('fromServerNo', "")
              }
              dataPostdossier.append('toServerNo', vm.toAgency['serveNo'])
              axios.post('/o/rest/v2/backupDatas/syncMasterDataMC', dataPostdossier, options).then(function (response) {
                vm.loading = false
                vm.dialog_cloneServiceinfo = false
                toastr.success('Thủ tục đã được đồng bộ')
              }).catch(function () {
                vm.loading = false
                toastr.error('Đồng bộ thất bại')
              })
            }
          }
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
