<template>
  <div style="padding: 0px 25px; max-width: 1500px; margin: 0px auto" class="mt-5 pb-3" id="top-header">
    <v-card class="px-3 py-3" style="width: 100%; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
      <div class="headline mb-3" style="font-size: 20px!important;">DỮ LIỆU CÔNG DÂN, TỔ CHỨC, DOANH NGHIỆP</div>
      
      <v-card-text class="px-0 pt-0">
        <v-layout wrap class="">
          <v-flex xs12 class="pr-2 mt-3">
            <div class="text-bold d-inline-block mr-3" style="color: #004b94;line-height: 24px;vertical-align: top;">Đối tượng người dùng: </div>
            <v-radio-group class="pt-0 d-inline-block ml-3 mt-0" v-model="typeSearch" row @change="changeTypeSearch">
              <v-radio label="Công dân" :value="'citizen'"></v-radio>
              <v-radio label="Doanh nghiệp" :value="'business'"></v-radio>
              <v-radio label="Cơ quan, tổ chức" :value="'organization'"></v-radio>
              <v-radio label="Tất cả" :value="''" ></v-radio>
            </v-radio-group>
          </v-flex>
          <v-layout wrap class="" id="form-search">
            <v-flex xs12 sm6 class="pr-2 input-group--text-field-box mt-1">
              <v-text-field
                  label="Tìm kiếm theo tên người dùng"
                  v-model="keySearch"
                  @keyup.enter="searchKeyword"
                  append-icon="search"
                  box
                  clear-icon="clear"
                  clearable
                  @click:clear="clearKeySearch('keyword')"
                  @click:append="searchKeyword"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 class="input-group--text-field-box mt-1 pl-2">
              <v-text-field
                  label="Số CMND/ căn cước, mã tổ chức, doanh nghiệp"
                  v-model="idNoSearch"
                  @keyup.enter="searchKeyword"
                  append-icon="search"
                  box
                  clear-icon="clear"
                  clearable
                  @click:clear="clearKeySearch('idNo')"
                  @click:append="searchKeyword"
                ></v-text-field>
            </v-flex>
          </v-layout>
          
        </v-layout>
        <div style="text-align: right">
          <v-btn color="blue darken-3" dark @click="addApplicant">
            <v-icon size="16">add</v-icon>&nbsp;Thêm mới
          </v-btn>
        </div>
        <v-data-table
          :headers="applicantListHeader"
          :items="applicantLists"
          hide-actions
          class="table-landing table-bordered mt-3"
          style="border-left: 1px solid #dedede"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center" style="width:50px;height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{ applicantPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.applicantName}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.applicantIdType === 'citizen' ? 'Công dân' : (props.item.applicantIdType === 'business' ? 'Doanh nghiệp' : 'Cơ quan, tổ chức')}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.applicantIdNo}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px;min-width:200px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{fullAddress(props.item['address'], props.item['cityName'], props.item['districtName'], props.item['wardName'])}}</span>
                </div>
              </td>
              <td class="text-xs-center" style="height:36px;width: 150px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-tooltip top v-if="!loadingTable">
                  <v-btn @click="showEditApplicant(props.item)" color="green" slot="activator" flat icon class="mx-0 mr-3 my-0">
                    <v-icon size="22">edit</v-icon>
                  </v-btn>
                  <span>Cập nhật thông tin</span>
                </v-tooltip>
                <v-tooltip top v-if="!loadingTable && (getUser('Administrator') || getUser('Administrator_data')) && props.item['verification'] == 1">
                  <v-btn @click="deleteApplicant(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0 mr-3">
                    <v-icon size="22">delete</v-icon>
                  </v-btn>
                  <span>Xóa</span>
                </v-tooltip>
                <v-tooltip top v-if="!loadingTable" class="ml-2">
                  <v-btn @click="documentManage(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon size="22">fas fa fa-folder-open</v-icon>
                  </v-btn>
                  <span>Kho giấy tờ</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có công dân, cơ quan tổ chức, doanh nghiệp
            </div>
          </template>
        </v-data-table>
        <!--  -->
        <div class="my-2" v-if="totalApplicantSearch > numberPerPage">
          <div class="text-xs-right layout wrap" style="position: relative;">
            <div class="flex pagging-table"> 
              <tiny-pagination :total="totalApplicantSearch" :page="applicantPage" :numberPerPage="numberPerPage" nameRecord="người dùng" custom-class="custom-tiny-class" 
                @tiny:change-page="changePage" ></tiny-pagination> 
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog_editApplicant" scrollable persistent max-width="900px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{typeUpdateApplicant === 'update' ? titleEdit : 'Thêm mới công dân, tổ chức, doanh nghiệp'}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="exitDialogEditApplicant">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-form ref="form" v-model="valid" lazy-validation class="py-3 px-0 grid-list">
            <v-layout row wrap class="px-0 py-3">
              <v-flex xs12 sm6>
                <v-text-field v-model="applicantEdit['applicantName']" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required>
                  <template slot="label"> 
                    <span v-if="applicantEdit['applicantIdType'] === 'business'">Tên doanh nghiệp</span>
                    <span v-if="applicantEdit['applicantIdType'] === 'citizen'">Họ tên</span> 
                    <span v-if="applicantEdit['applicantIdType'] === 'organization'">Tên cơ quan, tổ chức</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete 
                  :items="applicantTypeLists" label="Loại thông tin người dùng" 
                  v-model="applicantEdit['applicantIdType']" 
                  item-text="text" item-value="value" 
                  :hide-selected="true" box>
                </v-autocomplete>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="applicantEdit['applicantIdNo']" box 
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required
                >
                  <template slot="label"> 
                    <span v-if="applicantEdit['applicantIdType'] === 'business'">Mã số thuế</span>
                    <span v-if="applicantEdit['applicantIdType'] === 'citizen'">Số CMND/ Căn cước</span> 
                    <span v-if="applicantEdit['applicantIdType'] === 'organization'">Mã cơ quan, tổ chức</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-menu
                  ref="menuBirthDate"
                  :close-on-content-click="false"
                  v-model="menuBirthDate"
                  :nudge-right="40"
                  lazy
                  transition="fade-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    box append-icon="event"
                    v-model="applicantEdit['applicantIdDate']"
                    label="Ngày cấp"
                    @blur="ngayCap = parseDate(applicantEdit['applicantIdDate'])"
                  ></v-text-field>
                  <v-date-picker ref="picker" min="1950-01-01" :max="getMaxdate()" :first-day-of-week="1" locale="vi"
                  v-model="ngayCap" no-title @input="changeBirthDate"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Số điện thoại" v-model="applicantEdit['contactTelNo']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Thư điện tử" v-model="applicantEdit['contactEmail']" box 
                :rules="applicantEdit['contactEmail'] ? [rules.email] : []"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12>
                <v-text-field label="Địa chỉ" v-model="applicantEdit['address']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="applicantEdit['cityCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeCityEditApplicant($event)"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="districtItems" label="Quận/huyện" v-model="applicantEdit['districtCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeDistrictEditApplicant($event)"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete label="Xã/phường" :items="wardItems" v-model="applicantEdit['wardCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeWardEditApplicant($event)"></v-autocomplete>
              </v-flex>
              <v-flex xs12 v-if="hasVerification && typeUpdateApplicant === 'update'">
                <v-checkbox
                  class="mt-2" color="primary" @change="changeVerification" v-model="verificationApplicant" :label="verificationApplicant ? 'Hủy xác thực' : 'Xác thực'"
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="primary" @click.native="exitDialogEditApplicant"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
          <v-btn class="mr-3" color="primary" @click.native="updateApplicant"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon>save</v-icon> &nbsp;
            {{typeUpdateApplicant === 'update' ? 'Cập nhật' : 'Thêm mới'}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    hasVerification: false,
    verificationApplicant: false,
    typeUpdateApplicant: 'update',
    keySearch: '',
    idNoSearch: '',
    typeSearch: '',
    applicantListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên công dân, tổ chức, doanh nghiệp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đối tượng người dùng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số CMND/ căn cước, mã tổ chức, doanh nghiệp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Địa chỉ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    applicantLists: '',
    applicantTypeLists: [
      {text: 'Công dân', value: 'citizen'},
      {text: 'Doanh nghiệp', value: 'business'},
      {text: 'Cơ quan, tổ chức', value: 'organization'}
    ],
    loadingTable: false,
    numberPerPage: 30,
    applicantPage: 1,
    totalApplicantSearch: 0,
    menuBirthDate: false,
    toDateFormatted: null,
    dialog_editApplicant: false,
    valid: true,
    applicantEdit: '',
    ngayCap: null,
    cityItems: [],
    districtItems: [],
    wardItems: [],
    rolesUser: [],
    rules: {
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      }
    }
  }),
  computed: {
    
  },
  created () {
    let vm = this
    try {
      vm.hasVerification = hasVerification
    } catch (error) {
    }
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.getRoleUser().then(function () {
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      })
      
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  mounted () {
    
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    typeSearch (val) {
      let vm = this
      if (val === '') {
        vm.applicantListHeader[1].text = 'Tên công dân, tổ chức, doanh nghiệp'
        vm.applicantListHeader[3].text = 'Số CMND/ căn cước, mã số thuế doanh nghiệp'
      } else if (val === 'citizen') {
        vm.applicantListHeader[1].text = 'Tên công dân'
        vm.applicantListHeader[3].text = 'Số CMND/ căn cước'
      } else if (val === 'business') {
        vm.applicantListHeader[1].text = 'Tên doanh nghiệp'
        vm.applicantListHeader[3].text = 'Mã số thuế doanh nghiệp'
      } else {
        vm.applicantListHeader[1].text = 'Tên cơ quan, tổ chức'
        vm.applicantListHeader[3].text = 'Mã cơ quan, tổ chức'
      }
    },
    ngayCap(val) {
      this.toDateFormatted = this.formatDate(val)
      this.applicantEdit['applicantIdDate'] = this.toDateFormatted
    },
  },
  methods: {
    getApplicantList () {
      let vm = this
      let url = '/o/rest/v2/applicants'
      vm.loadingTable = true
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
              groupId: 0
            },
            params: {
              start: vm.applicantPage * vm.numberPerPage - vm.numberPerPage,
              end: vm.applicantPage * vm.numberPerPage,
              type: vm.typeSearch,
              applicantName: vm.keySearch,
              idNo: vm.idNoSearch
            }
          }
          axios.get(url, param).then(response => {
            let items = []
            if (response.data.hasOwnProperty('data')) {
              items = response.data.data
            } else {
            }
            let dataOut = {
              data: items,
              total: response.data['total']
            }
            vm.loadingTable = false
            resolve(dataOut)
          }).catch(function () {
            vm.loadingTable = false
          })
        })
      })
    },
    addApplicant () {
      let vm = this
      vm.typeUpdateApplicant = 'create'
      vm.applicantEdit = {
        address: "",
        applicantIdNo: "",
        applicantIdType: "citizen",
        applicantName: "",
        contactEmail: "",
        contactTelNo: "",
        cityCode: "",
        cityName: "",
        districtCode: "",
        districtName: "",
        wardCode: "",
        wardName: ""
      }
      if (vm.cityItems.length === 0) {
        let filterCity = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filterCity).then(function (result) {
          vm.cityItems = result.data
        })
      }
      vm.dialog_editApplicant = true
      vm.$refs.form.resetValidation()
    },
    showEditApplicant (item) {
      let vm = this
      vm.typeUpdateApplicant = 'update'
      vm.applicantEdit = item
      vm.verificationApplicant = vm.applicantEdit['verification'] === 0 ? true : false
      if (vm.cityItems.length === 0) {
        let filterCity = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filterCity).then(function (result) {
          vm.cityItems = result.data
        })
      }
      if (vm.applicantEdit['cityCode']) {
        vm.$store.dispatch('loadDictItems', {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: vm.applicantEdit['cityCode']
        }).then(function (resultDistricts) {
          vm.districtItems = resultDistricts.data
        })
      }
      if (vm.applicantEdit['districtCode']) {
        vm.$store.dispatch('loadDictItems', {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: vm.applicantEdit['districtCode']
        }).then(function (resultWards) {
          vm.wardItems = resultWards.data
        })
      }
      if (vm.applicantEdit['applicantIdType'] === 'citizen') {
        vm.titleEdit = "Thông tin công dân"
      } else if (vm.applicantEdit['applicantIdType'] === 'business') {
        vm.titleEdit = "Thông tin tổ chức, doanh nghiệp"
      }
      vm.dialog_editApplicant = true
      vm.$refs.form.resetValidation()
    },
    deleteApplicant (item) {
      let vm = this
      let x = confirm('Bạn có chắc chắn xóa công dân, doanh nghiệp này?')
      if (x) {
        vm.$store.dispatch('deleteUser', item).then(function () {
          toastr.clear()
          toastr.success('Yêu cầu thực hiện thành công')
          vm.getApplicantList().then(function(result) {
            vm.totalApplicantSearch = result['total']
            vm.applicantLists = result['data']
          }).catch(function () {
          })
        }).catch(function () {
          toastr.clear()
          toastr.error('Yêu cầu thực hiện thất bại')
        })
      }
      
    },
    documentManage (item) {
      let vm = this
      vm.$store.commit('setApplicantInfos', item)
      vm.$router.push({
        path: '/kho-tai-lieu',
        query: {
          applicantIdNo: item.applicantIdNo,
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    searchKeyword () {
      let vm = this
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    clearKeySearch (item) {
      let vm = this
      if (item === 'keyword') {
        vm.keySearch = ''
      } else {
        vm.idNoSearch = ''
      }
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    changeTypeSearch () {
      let vm = this
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    changePage (config) {
      let vm = this
      vm.applicantPage = config.page
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
      }).catch(function () {
      })
    },
    updateApplicant () {
      let vm = this
      if (vm.$refs.form.validate()) {
        vm.loading = true
        // console.log('user put data', vm.applicantEdit)
        if (vm.typeUpdateApplicant === 'update') {
          vm.$store.dispatch('putUser', vm.applicantEdit).then(function () {
            vm.loading = false
            toastr.clear()
            toastr.success('Yêu cầu thực hiện thành công')
            vm.dialog_editApplicant = false
            vm.getApplicantList().then(function(result) {
              vm.totalApplicantSearch = result['total']
              vm.applicantLists = result['data']
            }).catch(function () {
            })
          }).catch(function (err) {
            console.log('err', err)
            vm.loading = false
            toastr.clear()
            if (err.description && String(err.description).indexOf('DuplicateApplicantIdException') >= 0) {
              toastr.error('Số CMND/ CCCD/ MST đã tồn tại trên hệ thống')
            } else {
              toastr.error('Yêu cầu thực hiện thất bại')
            }
            
          })
        } else {
          vm.$store.dispatch('addUser', vm.applicantEdit).then(function () {
            vm.loading = false
            toastr.clear()
            toastr.success('Yêu cầu thực hiện thành công')
            vm.dialog_editApplicant = false
            vm.getApplicantList().then(function(result) {
              vm.totalApplicantSearch = result['total']
              vm.applicantLists = result['data']
            }).catch(function () {
            })
          }).catch(function (err) {
            console.log('err', err)
            vm.loading = false
            toastr.clear()
            if (err.description && String(err.description).indexOf('DuplicateApplicantIdException') >= 0) {
              toastr.error('Số CMND/ CCCD/ MST đã tồn tại trên hệ thống')
            } else {
              toastr.error('Yêu cầu thực hiện thất bại')
            }
          })
        }
      }
    },
    exitDialogEditApplicant () {
      let vm = this
      vm.dialog_editApplicant = false
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
      }).catch(function () {
        toastr.error('Không lấy được danh sách công dân, tổ chức, doanh nghiệp')
      })
    },
    fullAddress (address, city, district, ward) {
      let fullAddress = ''
      if (address) {
        fullAddress += (address + ', ')
      }
      if (ward) {
        fullAddress += (ward + ' - ')
      }
      if (district) {
        fullAddress += (district + ' - ')
      }
      if (city) {
        fullAddress += city
      }
      return fullAddress
    },
    changeBirthDate () {
      let vm = this
      vm.menuBirthDate = false
      vm.applicantEdit['applicantIdDate'] = vm.formatDate(vm.ngayCap)
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    onChangeCityEditApplicant (data) {
      let vm = this
      vm.applicantEdit['cityName'] = vm.cityItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.districtItems = result.data
        vm.wardItems = []
      })
    },
    onChangeDistrictEditApplicant (data) {
      let vm = this
      vm.applicantEdit['districtName'] = vm.districtItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.wardItems = result.data
      })
    },
    onChangeWardEditApplicant (data) {
      let vm = this
      vm.applicantEdit['wardName'] = vm.wardItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
    },
    changeVerification () {
      let vm = this
      setTimeout(function () {
        let filter = {
          applicantId: vm.applicantEdit['applicantId'],
          verification: vm.verificationApplicant ? 0 : 1
        }
        vm.$store.dispatch('putVerification', filter).then(function (result) {
          toastr.clear()
          toastr.success('Yêu cầu thực hiện thành công')
        }).catch(function () {
          toastr.clear()
          toastr.error('Yêu cầu thực hiện thất bại')
        })
      }, 100)
    },
    getRoleUser () {
      let vm = this
      return new Promise(resolve => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get('/o/rest/v2/users/login', param).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.length > 0) {
            let roles = []
            for (let key in serializable) {
              if (serializable[key]['role']) {
                roles.push(serializable[key]['role'])
              }
            }
            console.log('roles', roles)
            vm.rolesUser = roles
          } else {
            vm.rolesUser = []
          }
          resolve(vm.rolesUser)
        }).catch(function (error) {
          resolve()
        })
      })
      
    },
    getUser (roleItem) {
      let vm = this
      let roles = vm.rolesUser
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)
    },
    parseDate(date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getMaxdate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
