<template>
  <div style="margin: 0 auto;">
    <v-card class="mb-3 mt-2">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-btn dark icon>
          <v-icon>api</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Quản lý danh mục API
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="py-0 px-0">
        <v-btn color="blue darken-3" dark
            class="mx-0 my-0"
            @click="openCreateApi"
            >
            <v-icon>add_circle_outline</v-icon>&nbsp;
            Thêm API
            </v-btn>
        <div>
            <v-data-table
                :headers="apiListHeader"
                :items="apiList"
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
                        <td class="text-xs-center px-2" style="width:50px;height:36px;border-right: 1px solid #dedede">
                            <content-placeholders v-if="loadingTable">
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                            <div v-else>
                                <span>{{ apiPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                            </div>
                        </td>
                        <td class="text-xs-left px-2" style="height:36px;border-right: 1px solid #dedede">
                            <content-placeholders v-if="loadingTable">
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                            <div v-else>
                                <span>{{props.item.apiCode}}</span>
                            </div>
                        </td>
                        <td class="text-xs-left px-2" style="height:36px;border-right: 1px solid #dedede">
                            <content-placeholders v-if="loadingTable">
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                            <div v-else>
                                <span>{{props.item.apiName}}</span>
                            </div>
                        </td>
                        <td class="text-xs-left px-2" style="height:36px;border-right: 1px solid #dedede">
                            <content-placeholders v-if="loadingTable">
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                            <div v-else>
                                <span>{{props.item.apiDescription}}</span>
                            </div>
                        </td>
                        <td class="text-xs-left px-2" style="height:36px;border-right: 1px solid #dedede">
                            <content-placeholders v-if="loadingTable">
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                            <div v-else>
                                <span>{{props.item.apiStatus == 1 ? 'Sử dụng' : 'Không sử dụng'}}</span>
                            </div>
                        </td>
                        <td class="text-xs-center px-2" style="height:36px;border-right: 1px solid #dedede">
                            <content-placeholders v-if="loadingTable">
                                <content-placeholders-text :lines="1" />
                            </content-placeholders>
                            <div v-else>
                                <v-tooltip top class="mx-2">
                                    <v-btn @click="updateRole(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                                        <v-icon>groups</v-icon>
                                    </v-btn>
                                    <span>Quyền truy cập</span>
                                </v-tooltip>
                                <v-tooltip top class="mx-2">
                                    <v-btn @click="editApi(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <span>Sửa</span>
                                </v-tooltip>
                                <v-tooltip top class="mx-2">
                                    <v-btn @click="deleteApi(props.item)" color="red" slot="activator" flat icon class="mx-0 my-0">
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
                    <tiny-pagination :total="totalApi" :page="apiPage" :numberPerPage="numberPerPage" nameRecord="hồ sơ" custom-class="custom-tiny-class" 
                    @tiny:change-page="changePage" ></tiny-pagination> 
                </div>
                </div>
            </div>
        </div>
    </v-card>
    
    <v-dialog
        v-model="dialogAddApi"
        max-width="900px"
        persistent
    >
        <v-card>
            <v-toolbar dark color="blue">
                <v-toolbar-title class="mx-3">
                    <span v-if="updateApi === 'add'">Thêm mới API</span>
                    <span v-else>Cập nhật thông tin API</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click.native="dialogAddApi = false">
                <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="form_vuejs px-0 pb-0" style="background-color: #eeeeee !important;">
                <v-form ref="formUpdateApi" lazy-validation>
                    <v-layout wrap>
                        <v-flex class="xs12 px-2">
                            <v-layout wrap>
                                <v-flex xs12 md6 class="px-2 my-0">
                                    <label for="">Mã API <span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="apiCode"
                                        solo
                                        :rules="[rules.required]"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md6 class="px-2 my-0">
                                    <label for="">Tên API <span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="apiName"
                                        solo
                                        :rules="[rules.required]"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <!-- <v-flex xs12 class="px-2 my-0">
                                    <label for="">Quyền truy cập <span class="red--text">*</span></label>
                                    <v-autocomplete
                                        multiple
                                        :items="roleList"
                                        v-model="apiRole"
                                        item-text="title"
                                        item-value="jobPosId"
                                        clearable
                                        hide-no-data
                                        :rules="[rules.required]"
                                        required
                                        solo                  
                                    ></v-autocomplete>
                                </v-flex> -->
                                <v-flex xs12 class="px-2 my-0">
                                    <label for="">URL truy cập <span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="apiDescription"
                                        solo
                                        :rules="[rules.required]"
                                        required
                                        :readonly="updateApi !== 'add'"
                                        :disabled="updateApi !== 'add'"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 class="px-2 my-0">
                                    <label for="">ClassName <span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="className"
                                        solo
                                        :rules="[rules.required]"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 class="px-2 my-0">
                                    <label for="">Tình trạng <span class="red--text">*</span></label>
                                    <v-autocomplete
                                        :items="listStatus"
                                        v-model="apiStatus"
                                        item-text="name"
                                        item-value="value"
                                        clearable
                                        hide-no-data
                                        :rules="[rules.required]"
                                        required
                                        solo                  
                                    ></v-autocomplete>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        
                        <v-flex xs12 class="mx-0 py-1 mt-2 px-3" style="background: #dededeb3;">
                            <v-btn small color="red" class="white--text right mr-0" @click="dialogAddApi=false"><v-icon>clear</v-icon>&nbsp; Đóng</v-btn>
                            <v-btn small color="blue" class="right white--text" @click="createApi()"
                                :loading="loading"
                                :disabled="loading"
                            >
                                <span v-if="updateApi !== 'add'"><v-icon>save</v-icon>&nbsp; Cập nhật</span>
                                <span v-else> <v-icon>add</v-icon>&nbsp; Thêm API</span>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog
        v-model="dialogAddRole"
        max-width="900px"
        persistent
    >
        <v-card>
            <v-toolbar dark color="blue">
                <v-toolbar-title class="mx-3">
                    <span>Phân quyền truy cập</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click.native="dialogAddRole = false">
                <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="px-0 pb-0" style="">
                <v-layout wrap>
                    <v-flex class="px-2 my-0" style="width: calc(100% - 150px)">
                        <v-autocomplete
                            :items="roleList"
                            v-model="apiRole"
                            item-text="title"
                            item-value="jobPosId"
                            clearable
                            hide-no-data
                            return-object
                            label="Quyền truy cập"
                        >
                            <template slot="selection" slot-scope="props">
                                <div>{{ props.item.jobPosCode }} - {{ props.item.title }}</div>
                            </template>
                            <template slot="item" slot-scope="props">
                                <div style="font-size: 14px !important">{{ props.item.jobPosCode }} - {{ props.item.title }}</div>
                            </template>
                        </v-autocomplete>
                    </v-flex>
                    <v-flex class="px-2 my-0 mt-2" style="width: 150px">
                        <v-btn small color="blue" class="white--text" @click="addApiRole()" :loading="loadingAddRole" :disabled="loadingAddRole">
                            <span> <v-icon>add</v-icon>&nbsp; Thêm quyền</span>
                        </v-btn>
                    </v-flex>
                </v-layout>
                <v-layout wrap class="mt-2 pb-4">
                    <v-flex v-if="loadingGetRole" xs12 class="text-xs-center mt-5">
                        <v-progress-circular
                            :size="100"
                            :width="1"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>
                    </v-flex>
                    <v-flex v-else xs12 class="px-2 my-2">
                        <div class="mb-2" style="font-weight: bold">
                            Danh sách quyền truy cập:
                        </div>
                        <v-data-table
                            :headers="headerListRole"
                            :items="listRoleApi"
                            hide-actions
                            no-data-text="Chưa có quyền truy cập nào"
                            class="table_vuejs"
                            style="border: 1px solid rgb(222, 222, 222);"
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
                                <tr>
                                    <td class="text-xs-center px-2" style="width:50px;height:36px;border-right: 1px solid #dedede">
                                        <div>
                                            <span>{{ props.index + 1 }}</span>
                                        </div>
                                    </td>
                                    <td style="border-right: 1px solid #dedede">{{ props.item.roleCode }}</td>
                                    <td style="border-right: 1px solid #dedede">{{ props.item.roleName }}</td>
                                    <td class="text-xs-center px-2" style="border-right: 1px solid #dedede">
                                        <div>
                                            <v-tooltip top class="mx-2">
                                                <v-btn @click="deleteRoleApi(props.item)" color="red" slot="activator" flat icon class="mx-0 my-0">
                                                    <v-icon>delete</v-icon>
                                                </v-btn>
                                                <span>Xóa</span>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </v-dialog>
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
    apiList: '',
    apiPage: 1,
    numberPerPage: 10,
    totalApi: 0,
    options: {
      mode: 'code'
    },
    dataRequest: {},
    dataResponse: {},
    dialog_dataInfo: false,
    rules: {
        required: value => !!value || 'Thông tin bắt buộc'
    },
    apiListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        width: 50
      },
      {
        text: 'Mã API',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên API',
        align: 'center',
        sortable: false
      },
      {
        text: 'URL truy cập',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng',
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
    vm.$nextTick(() => {
        vm.getApiRole()
        vm.getApiList()
    })
  },
  watch: {
  },
  methods: {
    openCreateApi () {
        let vm = this
        vm.updateApi = 'add'
        vm.dialogAddApi = true
        vm.$refs.formUpdateApi.reset()
        vm.$refs.formUpdateApi.resetValidation()
    },
    getApiList () {
      let vm = this
      vm.loadingTable = true
      let param = {
        headers: {
          'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
        },
        params: {
          start: vm.apiPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.apiPage * vm.numberPerPage
        }
      }
      axios.get('/o/rest/v2/socket/web/apiManagers', param).then(function (response) {
        let serializable = response.data
        vm.loadingTable = false
        if (serializable['data']) {
            vm.apiList = Array.isArray(serializable['data']) ? serializable['data'] : [serializable['data']]
            vm.totalApi = serializable['total']
        } else {
            vm.apiList = []
            vm.totalApi = 0
        }
      }).catch(function (error) {
        vm.loadingTable = false
        vm.apiList = []
        vm.totalApi = 0
      })
    },
    getApiRole () {
        let vm = this
        let param = {
            headers: {
                'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
            }
        }
        axios.get('/o/rest/v2/jobpos', param).then(function (response) {
            let seriable = response.data
            if (seriable.hasOwnProperty('data')) {
                vm.roleList = Array.isArray(seriable['data']) ? seriable['data'] : [seriable['data']]
            } else {
                vm.roleList = []
            }
        }).catch(function (xhr) {

        })
    },
    changePage (config) {
      let vm = this
      vm.apiPage = config.page
      vm.getApiList()
    },
    createApi () {
        let vm = this
        if (vm.$refs.formUpdateApi.validate()) {
            let param = {
                headers: {
                    'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                }
            }
            let dataAddApi = new URLSearchParams()
            dataAddApi.append('apiCode', vm.apiCode)
            dataAddApi.append('apiName', vm.apiName)
            dataAddApi.append('apiStatus', vm.apiStatus)
            dataAddApi.append('apiDescription', vm.apiDescription)
            dataAddApi.append('className', vm.className)
            if (vm.updateApi === 'add') {
                axios.post('/o/rest/v2/socket/web/apiManagers', dataAddApi, param).then(function (response) {
                    toastr.success('Thực hiện thành công')
                    vm.dialogAddApi = false
                    vm.apiPage = 1
                    vm.getApiList()
                }).catch(function (errorRes) {
                    toastr.error('Thêm mới không thành công')
                })
            } else {
                axios.put('/o/rest/v2/socket/web/apiManagers/' + vm.apiSelected['apiManagerId'], dataAddApi, param).then(function (response) {
                    toastr.success('Thực hiện thành công')
                    vm.dialogAddApi = false
                    vm.getApiList()
                }).catch(function () {
                    toastr.error('Cập nhật không thành công')
                })
            }
        }
    },
    editApi (item) {
        let vm = this
        vm.updateApi = 'update'
        vm.apiSelected = item
        vm.apiCode = vm.apiSelected.apiCode
        vm.apiName = vm.apiSelected.apiName
        vm.apiDescription = vm.apiSelected.apiDescription
        vm.apiStatus = vm.apiSelected.apiStatus
        vm.className = vm.apiSelected.className
        vm.dialogAddApi = true
        vm.$refs.formUpdateApi.resetValidation()
    },
    deleteApi (item) {
        let vm = this
        let param = {
            headers: {
                'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
            }
        }
        let x = confirm('Bạn có chắc chắn xóa API này')
        if (x) {
            axios.delete('/o/rest/v2/socket/web/apiManagers/' + item['apiManagerId'], param).then(function () {
                toastr.success('Thực hiện thành công')
                vm.getApiList()
            }).catch(function (error) {
                toastr.error('Xóa API không thành công')
            })
        }
    },
    updateRole (item) {
        let vm = this
        vm.apiSelected = item
        vm.dialogAddRole = true
        vm.getRoleApiList()
    },
    getRoleApiList () {
        let vm = this
        let param = {
            headers: {
                'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
            },
            params: {
                apiCode: vm.apiSelected['apiCode']
            }
        }
        vm.loadingGetRole = true
        axios.get('/o/rest/v2/socket/web/apiRoles', param).then(function (response) {
            vm.loadingGetRole = false
            vm.apiRole = ''
            let seriable = response.data
            if (seriable.hasOwnProperty('data')) {
                vm.listRoleApi = Array.isArray(seriable['data']) ? seriable['data'] : [seriable['data']]
            } else {
                vm.listRoleApi = []
            }
        }).catch(function () {
            vm.loadingGetRole = false
        })
    },
    addApiRole () {
        let vm = this
        if (vm.apiRole) {
            let param = {
                headers: {
                    'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
                }
            }
            let dataAddRole = new URLSearchParams()
            dataAddRole.append('apiCode', vm.apiSelected.apiCode)
            dataAddRole.append('roleCode', vm.apiRole.jobPosCode)
            dataAddRole.append('roleId', vm.apiRole.roleId)
            dataAddRole.append('apiRoleStatus', '')
            vm.loadingAddRole = true
            axios.post('/o/rest/v2/socket/web/apiRoles', dataAddRole, param).then(function (response) {
                vm.loadingAddRole = false
                toastr.success('Thực hiện thành công')
                vm.getRoleApiList()
            }).catch(function () {
                vm.loadingAddRole = false
                toastr.error('Thêm mới không thành công')
            })
            
        }
    },
    deleteRoleApi (item) {
        let vm = this
        let param = {
            headers: {
                'groupId': vm.$store.getters.groupIdAgencyManager ? vm.$store.getters.groupIdAgencyManager : window.themeDisplay.getScopeGroupId(),
            }
        }
        let x = confirm('Bạn có chắc chắn xóa quyền truy cập này')
        if (x) {
            axios.delete('/o/rest/v2/socket/web/apiRoles/' + item['apiRoleId'], param).then(function (response) {
                toastr.success('Thực hiện thành công')
                vm.getRoleApiList()
            }).catch(function () {
                toastr.error('Xóa API không thành công')
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
