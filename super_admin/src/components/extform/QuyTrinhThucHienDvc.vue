<template>
  <div style="margin: 0 auto;">
    <v-card class="mb-3 mt-2">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-btn dark icon>
          <v-icon>api</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          <span @click="openServiceConfig" class="mr-2">
            <a href="javascript:;" class="" style="color: white;text-decoration: none;font-size: 16px;">Dịch vụ công</a>
          </span>
          <span> <v-icon>chevron_right</v-icon></span>
          <span @click="openServiceConfigProcess" class="ml-2">
            <a href="javascript:;" class="" style="color: white;text-decoration: none;font-size: 16px;">Quy trình thực hiện</a>
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="py-0 px-0">
      <div>
        <v-flex xs12>
          <span class="text-bold" style="color: #073b76">Tên dịch vụ công:</span>
          <span> {{serviceConfigName}}</span>
        </v-flex>
        <v-flex xs12 class="mt-2" style="height: 32px">
          <span class="text-bold" style="color: #073b76">
            Danh sách quy trình thực hiện:
          </span>
          <v-btn color="blue darken-3" dark
            class="mx-0 my-0 right"
            @click="openserviceProcessOptionList"
            >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm quy trình thực hiện
          </v-btn>
        </v-flex>
        
        <v-data-table
          :headers="serviceProcessOptionHeader"
          :items="serviceProcessOptionList"
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
                    <td class="text-xs-center px-2 py-2" @click="editServiceProcessOption(props.item)" style="width:50px;height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{ serviceProcessOptionPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceProcessOption(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.optionName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceProcessOption(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.templateName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left px-2 py-2" @click="editServiceProcessOption(props.item)" style="height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <span>{{props.item.processName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center px-2 py-2" style="width:125px;height:36px;border-right: 1px solid #dedede">
                        <content-placeholders v-if="loadingTable">
                            <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <div v-else>
                            <v-tooltip top class="mx-2">
                                <v-btn @click="editServiceProcessOption(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                                    <v-icon>edit</v-icon>
                                </v-btn>
                                <span>Sửa quy trình</span>
                            </v-tooltip>
                            <v-tooltip top class="mx-2">
                                <v-btn @click="deleteServiceProcessOption(props.item)" color="red" slot="activator" flat icon class="mx-0 my-0">
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
                  <tiny-pagination :total="totalServiceProcessOption" :page="serviceProcessOptionPage" :numberPerPage="numberPerPage" nameRecord="dịch vụ công" custom-class="custom-tiny-class" 
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
    validFormSearch: false,
    isDvc: false,
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
    serviceProcessOptionList: '',
    serviceProcessOptionPage: 1,
    numberPerPage: 10,
    totalServiceProcessOption: 0,
    options: {
      mode: 'code'
    },
    dataRequest: {},
    dataResponse: {},
    dialog_dataInfo: false,
    serviceConfigId: '',
    serviceConfigName: '',
    rules: {
        required: value => !!value || 'Thông tin bắt buộc'
    },
    serviceProcessOptionHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        width: 50
      },
      {
        text: 'Tên quy trình xác lập dịch vụ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên mẫu hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên quy trình xử lý thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
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
      let currentQuery = vm.$router.history.current.query
      vm.serviceConfigId = currentQuery.hasOwnProperty('serviceConfigId') && currentQuery.serviceConfigId ? currentQuery.serviceConfigId : ''
      vm.serviceConfigName = currentQuery.hasOwnProperty('serviceConfigName') && currentQuery.serviceConfigName ? currentQuery.serviceConfigName : ''
      if (vm.serviceConfigId) {
        vm.getserviceProcessOptionList()
      }
    })
  },
  watch: {

  },
  methods: {
    openServiceConfig () {
      let vm = this
      vm.$router.push({
        path: '/table/opencps_serviceconfig'
      })
    },
    openServiceConfigProcess () {
      let vm = this
      vm.$router.push({
        path: '/table/opencps_processoption?serviceConfigId=' + vm.serviceConfigId + '&serviceConfigName=' + vm.serviceConfigName
      })
    },
    openserviceProcessOptionList () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let serviceConfigName = encodeURI(vm.serviceConfigName)
      vm.$router.push({
        path: '/table/opencps_processoption/editor/0?serviceConfigId=' + vm.serviceConfigId + '&serviceConfigName=' + serviceConfigName + '&col=serviceConfigId&pk=' + vm.serviceConfigId
      })
    },
    getserviceProcessOptionList (reset) {
      let vm = this
      if (reset) {
        vm.serviceProcessOptionPage = 1
      }
      vm.loadingTable = true
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
          start: vm.serviceProcessOptionPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.serviceProcessOptionPage * vm.numberPerPage,
          // agency: vm.govAgencyFilter,
          // domain: vm.domainFilter,
          // service: vm.serviceFilter,
          // level: vm.levelFilter,
          // keyword: vm.keyword
        }
      }
      axios.get('/o/rest/v2/serviceconfigs/' + vm.serviceConfigId + '/processes', param).then(function (response) {
        let serializable = response.data
        vm.loadingTable = false
        if (serializable['data']) {
            vm.serviceProcessOptionList = Array.isArray(serializable['data']) ? serializable['data'] : [serializable['data']]
            vm.totalServiceProcessOption = serializable['total']
        } else {
            vm.serviceProcessOptionList = []
            vm.totalServiceProcessOption = 0
        }
      }).catch(function (error) {
        vm.loadingTable = false
        vm.serviceProcessOptionList = []
        vm.totalServiceProcessOption = 0
      })
    },
    changePage (config) {
      let vm = this
      vm.serviceProcessOptionPage = config.page
      vm.getserviceProcessOptionList()
    },
    editServiceProcessOption (item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$router.push({
        path: '/table/opencps_processoption/editor/' + item.processOptionId + '?serviceConfigId=' + vm.serviceConfigId + '&serviceConfigName=' + vm.serviceConfigName,
      })
    },
    deleteServiceProcessOption (item) {
      let vm = this
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        }
      }
      let x = confirm('Bạn có chắc chắn xóa quy trình thực hiện này')
      if (x) {
        axios.delete('/o/rest/v2/serviceconfigs/' + vm.serviceConfigId + '/processes/' + item.processOptionId, param).then(function () {
          toastr.success('Xóa quy trình thực hiện thành công')
          vm.getserviceProcessOptionList()
        }).catch(function (error) {
          toastr.error('Xóa quy trình thực hiện không thành công')
        })
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
    },
    backToList () {
      window.history.back()
    }
  }
}
</script>
