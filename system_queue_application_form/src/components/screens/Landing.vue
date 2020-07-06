<template>
  <div style="border: 1px solid #dedede;border-top:0;">
    <v-layout wrap>
      <v-flex xs12 md8>
        <div class="row-header no__hidden_class">
          <!-- <div class="">
            <span>DANH SÁCH MẪU TỜ KHAI TRỰC TUYẾN</span>
          </div> -->
          <v-toolbar flat height="36" dark color="primary">
            <v-toolbar-title class="white--text" style="font-size: 14px;">DANH SÁCH MẪU TỜ KHAI TRỰC TUYẾN</v-toolbar-title>
          </v-toolbar>
          <!-- <div class="layout row wrap header_tools row-blue">
            <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
              <v-text-field
                v-model="eformNoSearch"
                placeholder="Tìm kiếm tờ khai đã tạo"
                solo
                chips
                multiple
                deletable-chips
                item-value="eFormNo"
                item-text="eFormName"
                @keyup.enter="searchEform"
                content-class="adv__search__select"
                return-object
                autofocus
              ></v-text-field>
            </div>
            <div class="flex text-right" style="margin-left: auto;max-width: 100px;height:37px">
              <v-btn color="primary" class="my-0 mx-0 white--text" v-on:click.native="searchEform" style="height:100%">
                <v-icon size="16">search</v-icon> &nbsp;
                Tìm kiếm
              </v-btn>
            </div>
          </div>  -->
        </div>
        <v-card flat class="">
          <v-card-text class='grey lighten-3 px-0 py-0'>
            <v-expansion-panel class="expand__select__domain" v-model="panelServiceList" expand>
              <v-expansion-panel-content v-for='(item, index) in serviceInfoList' :key='index' :value="true">
                <div class="text-bold" slot='header' style="margin-left: 14px;color:#615d5d">
                    <v-icon class="pr-2" color="#615d5d">navigate_next</v-icon> 
                    <span style="position: absolute;margin-top: 1px;">{{item.serviceCode}}  - {{item.serviceName}} </span>
                </div>
                <v-card>
                  <v-card-text class="card__text__gov" v-for='(itemTemplate, index2) in item.templateList' :key='index2'>
                    <v-layout row wrap>
                      <v-flex xs12 sm10 class="pt-1 primary--text text-bold" @click="selectTemplate(index, itemTemplate, item)" style="cursor: pointer">
                        <span>{{index2 + 1}}.</span> &nbsp;
                        <span>{{itemTemplate.templateName}}</span>
                      </v-flex>

                      <v-flex xs12 sm2 class="text-xs-center">
                        <v-menu left offset-x>
                          <v-btn color="primary" class="mx-0 my-0 mt-1 white--text" slot="activator" small 
                            @click="selectTemplate(index, itemTemplate, item)"
                          >
                            Chọn
                          </v-btn>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md4 class="pl-2">
        <div class="dangkyxephang">
          <div class="row-header no__hidden_class">
            <v-toolbar flat height="36" dark color="primary">
              <v-toolbar-title class="white--text" style="font-size: 14px;">ĐĂNG KÝ XẾP HÀNG NỘP HỒ SƠ</v-toolbar-title>
            </v-toolbar>
          </div>
          <v-card flat class="">
            <v-card-text class='px-2 py-3'>
              <v-form ref="formBooking" v-model="validBooking" lazy-validation>
                <v-flex xs12>
                  <v-text-field v-model="eformNoBooking" box clearable
                    :rules="[v => !!v || 'Mã tờ khai là bắt buộc']" required
                  >
                    <template slot="label"> 
                      <span>Mã tờ khai</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="secretBooking" box clearable
                    :rules="[v => !!v || 'Mã bí mật là bắt buộc']" required
                  >
                    <template slot="label"> 
                      <span>Mã bí mật</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="applicantName" box clearable
                    :rules="[v => !!v || 'Họ tên người nộp là bắt buộc']" required
                  >
                    <template slot="label"> 
                      <span>Họ tên người nộp</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="applicantTelNo" box clearable
                    :rules="[v => !!v || 'Số điện thoại là bắt buộc', rules.telNo]" required
                  >
                    <template slot="label"> 
                      <span>Số điện thoại</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-autocomplete :items="agencyItems" v-model="agencyTiepNhan"
                    item-text="name" 
                    item-value="value"
                    :hide-selected="true" 
                    box
                    :rules="[v => !!v || 'Nơi nộp hồ sơ là bắt buộc']" required
                    @change="changeAgencyBooking"
                    return-object
                  >
                    <template slot="label"> 
                      <span>Nơi nộp hồ sơ</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-menu
                    ref="menuApplicantIdDate"
                    :close-on-content-click="false"
                    v-model="menuApplicantIdDate"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      :rules="[v => !!v || 'Ngày đăng ký là bắt buộc']"
                      required
                      box
                      slot="activator"
                      v-model="applicantIdDateFormatted"
                      append-icon="event"
                      readonly
                      @blur="dateBooking = parseDate(applicantIdDateFormatted)"
                    >
                      <template slot="label"> 
                        <span>Ngày đăng ký nộp hồ sơ</span> 
                        <span class="red--text darken-3"> *</span>
                      </template>
                    </v-text-field>
                    <v-date-picker :min="getMindate()" :allowed-dates="allowedDates" ref="picker" locale="vi"
                    :first-day-of-week="1" v-model="dateBooking" no-title @input="changeDateBooking"></v-date-picker>
                  </v-menu>
                </v-flex>
                <!--  -->
                <v-flex xs12 v-if="!isSlot">
                  <v-alert
                    class="py-2"
                    :value="true"
                    color="error"
                    icon="warning"
                    outline
                  >
                    Ngày {{applicantIdDateFormatted}} đã hết lượt xếp hàng
                  </v-alert>
                </v-flex>
                <v-flex xs12>
                  <captcha ref="captcha"></captcha>
                </v-flex>
                <!--  -->
                <v-flex sm12>
                  <div><span class="red--text">Chú ý:</span></div>
                  <div class="pl-3" style="text-align: justify;">
                    - Họ tên của người nộp phải trùng với họ tên của đương sự (người được cấp trong giấy tờ hoặc người xin cấp hộ chiếu) <br>
                    - Số thứ tự và thời gian xếp hàng sẽ được gửi qua tin nhắn SMS <br>
                    - Người đăng ký chịu khoản phí nhắn tin SMS
                  </div>
                </v-flex>
                <v-flex sm12 class="text-xs-right">
                  <v-btn color="blue darken-3" :loading="loading" :disabled="loading || !isSlot" @click.native="submitQueue" class="mx-0" dark>
                    <v-icon>create</v-icon>&nbsp; Đăng ký
                  </v-btn>
                </v-flex>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
        <!--  -->
        <div class="timkiemtokhai" style="margin-top: 16px">
          <div class="row-header no__hidden_class">
            <v-toolbar flat height="36" dark color="primary">
              <v-toolbar-title class="white--text" style="font-size: 14px;">TÌM KIẾM TỜ KHAI</v-toolbar-title>
            </v-toolbar>
          </div>
          <v-card flat class="">
            <v-card-text class='px-2 py-3'>
              <v-form ref="formSearch" v-model="validSearch" lazy-validation>
                <v-flex xs12>
                  <v-text-field v-model="eformNoSearch" box clearable @keyup.enter.prevent="submitSearchEform"
                    :rules="[v => !!v || 'Mã tờ khai là bắt buộc']" required
                  >
                    <template slot="label"> 
                      <span>Mã tờ khai</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="secretSearch" box clearable @keyup.enter.prevent="submitSearchEform"
                    :rules="[v => !!v || 'Mã bí mật là bắt buộc']" required
                  >
                    <template slot="label"> 
                      <span>Mã bí mật</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                </v-flex>
                <v-flex sm12 class="text-xs-right">
                  <v-btn color="blue darken-3" :loading="loading" :disabled="loading" v-on:click.native="submitSearchEform" class="mx-0" dark>
                    <v-icon>search</v-icon>&nbsp; Tìm kiếm
                  </v-btn>
                </v-flex>
              </v-form>
            </v-card-text>
          </v-card>
        </div>
        <!--  -->
      </v-flex>
    </v-layout>
    <!--  -->
    <v-dialog v-model="dialogSecret" persistent max-width="400">
      <v-form v-model="validSecret" ref="formSecret" lazy-validation>
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Mã bí mật tra cứu tờ khai</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialogSecret = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <v-text-field
                  box
                  v-model="secretSearch"
                  label="Mã bí mật"
                  :rules="[v => !!v || 'Mã bí mật là bắt buộc']"
                  required
                  @keyup.enter.prevent="submitSearchEform"
                  autofocus
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="mx-2">
            <v-spacer></v-spacer>
            <v-btn color="primary" class="white--text" @click.native="submitSearchEform">
              <v-icon>save</v-icon> &nbsp;
              Đồng ý
            </v-btn>
            <v-btn color="red" class="white--text" @click.native="() => dialogSecret = false">
              <v-icon>clear</v-icon> &nbsp;
              Thoát
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import Captcha from './Captcha.vue'
import support from '../../store/support.json'
toastr.options = {
  "positionClass": "toast-top-center"
}

Vue.use(toastr)
export default {
  props: [],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    isSlot: true,
    groupDvc: '',
    bookingGroups: '',
    currentGroup: '',
    serviceInfoList: [],
    eformNoSearch: '',
    eformNoBooking: '',
    applicantName: '',
    applicantTelNo: '',
    agencyTiepNhan: '',
    secretSearch: '',
    panelServiceList: [],
    serviceInfoListRender: [],
    formTemplateList: [],
    agencyItems: [
      {name: 'Cục lãnh sự - 40 Trần Phú, Ba Đình, Hà Nội', value: '124302', code: 'CLS', serverNo: 'SERVER_CLS'}
    ],
    dialogSecret: false,
    loading: false,
    validSearch: false,
    validBooking: false,
    menuApplicantIdDate: false,
    dateBooking: null,
    applicantIdDateFormatted: null,
    secretBooking: '',
    countEmpty: 0,
    captcha: '',
    detailEform: '',
    rules: {
      required: (value) => !!value || 'Trường dữ liệu bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      telNo: (value) => {
        // const pattern = /^(([0-9]{0,}))$/
        const pattern = /^0([1-9]{1}\d{8})$/
        if (value) {
          return pattern.test(value) || 'Số điện thoại gồm 10 ký tự 0-9, eg: 0989123456, ...'
        } else {
          return []
        }
      }
    }
  }),
  computed: {
    serviceinfoSelected () {
      return this.$store.getters.getServiceinfoSelected
    },
    formScriptEform () {
      return this.$store.getters.getFormScriptEform
    },
    formDataEform () {
      return this.$store.getters.getFormDataEform
    },
    fileTemplateSelected () {
      return this.$store.getters.getFileTemplateSelected
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      try {
        vm.agencyItems = agencyItems /**config fragment*/
      } catch (error) {
      }
      vm.doLoadingThuTuc()
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    dateBooking (val) {
      this.applicantIdDateFormatted = this.formatDate(this.dateBooking)
    }
  },
  methods: {
    doLoadingThuTuc () {
      var vm = this
      vm.serviceInfoList = []
      vm.formTemplateList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      var filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.serviceInfoList = result.data
          for (let index in vm.serviceInfoList) {
            vm.getFileTemplate(index, vm.serviceInfoList[index])
          }
        } else {
          vm.serviceInfoList = []
        }
      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoList = []
      })
    },
    getFileTemplate (index, item) {
      let vm = this
      vm.$store.dispatch('getFileTemplateEform', item).then(response => {
        if (response.data) {
          vm.serviceInfoList[index].templateList = response.data
          for (let index in response.data) {
            vm.formTemplateList.push(response.data[index])
          }
        }
        vm.panelServiceList.push(true)
      })
    },
    selectTemplate (indexService, template, serviceInfo) {
      let vm = this
      vm.trackingBTTT(serviceInfo.serviceCode)
      vm.$store.commit('setServiceinfoSelected', serviceInfo)
      let templateFile = Object.assign({}, template, {serviceInfoId: serviceInfo.serviceInfoId})
      vm.$store.commit('setFileTemplateSelected', templateFile)
      vm.$router.push({
        path: '/thong-tin-to-khai',
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    searchEform () {
      let vm = this
      vm.secretSearch = ''
      vm.$refs.formSecret.reset()
      vm.dialogSecret = true
    },
    submitSearchEform () {
      let vm = this
      if (vm.$refs.formSearch.validate()) {
        let filter = {
          eFormNo: String(vm.eformNoSearch).trim(),
          secret: vm.secretSearch
        }
        vm.$store.dispatch('getEformSecret', filter).then(function(result) {
          if (result && result.hasOwnProperty('eFormId')) {
            vm.dialogSecret = false
            let templateFile = vm.formTemplateList.filter(function (item) {
              return item.fileTemplateNo === result.fileTemplateNo
            })
            if (templateFile.length > 0) {
              vm.$store.commit('setFileTemplateSelected', templateFile[0])
            }

            vm.$store.commit('setEformDetail', result)
            vm.$router.push({
              path: '/tao-to-khai-thanh-cong/1',
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
          } else {
            toastr.clear()
            toastr.error('Mã tờ khai hoặc mã bí mật không chính xác. Vui lòng kiểm tra lại')
          }
        }).catch(function(error) {
          toastr.clear()
          toastr.error('Mã tờ khai hoặc mã bí mật không chính xác. Vui lòng kiểm tra lại')
        })
      }
    },
    submitQueue () {
      let vm = this
      vm.currentGroup = ''
      let keySearch = String(vm.eformNoBooking).split('-')
      let filterBooking = {
        className: '',
        classPK: '',
        serviceCode: '',
        gateNumber: '',
        state: 1,
        codeNumber: '',
        bookingName: '',
        serviceGroupCode: '',
        serverNo: '',
        dossierRelease: false,
        telNo: vm.applicantTelNo,
        groupId: vm.agencyTiepNhan.value,
        bookingDate: vm.applicantIdDateFormatted,
        j_captcha_response: vm.$refs.captcha.j_captcha_response,
        serverCode: ''
      }
      if (keySearch.length === 1) {
        filterBooking['codeNumber'] = vm.eformNoBooking
      } else {
        filterBooking['codeNumber'] = vm.maBienNhan(vm.eformNoBooking)
      }
      if (keySearch.length === 1) {
        let filter = {
          eFormNo: String(vm.eformNoBooking).trim(),
          secret: vm.secretBooking
        }
        vm.$store.dispatch('getEformSecret', filter).then(function(result) {
          let bookingName = ''
          if (result && result.hasOwnProperty('eFormId')) {
            vm.detailEform = result
            let templateFile = vm.formTemplateList.filter(function (item) {
              return item.fileTemplateNo === result.fileTemplateNo
            })
            if (templateFile.length > 0) {
              vm.$store.commit('setFileTemplateSelected', templateFile[0])
            }
            vm.$store.commit('setEformDetail', result)
            // 
            vm.currentGroup = vm.bookingGroups.filter(function (item) {
              return (item['config'] && item['config'].split(',').indexOf(result['serviceCode']) >= 0)
            })[0]
            console.log('currentGroup', vm.currentGroup)
            // 
            try {
              let name = JSON.parse(result['eFormData'])
              bookingName = name !== 'undefined' && name !== undefined ? name['bookingName'] : ''
            } catch (e) {
              console.log('lỗi parse eFormData get bookingName')
            }
            if (bookingName.toLowerCase() !== String(vm.applicantName).toLowerCase()) {
              toastr.clear()
              toastr.error('Họ tên người nộp không trùng với họ tên của đương sự (người được cấp trong giấy tờ hoặc người xin cấp hộ chiếu). Vui lòng kiểm tra lại.')
            } else {
              filterBooking.className = 'EFORM'
              filterBooking.classPK = result.eFormId
              filterBooking.serviceCode = result.serviceCode
              filterBooking.bookingName = bookingName
              filterBooking.serviceGroupCode = vm.currentGroup['groupCode']
              filterBooking.serverCode = vm.agencyTiepNhan.serverNo
              // 
              let filter = {
                groupIdBooking: vm.agencyTiepNhan.value,
                bookingDate: vm.applicantIdDateFormatted,
                serverCode: vm.agencyTiepNhan.serverNo
              }
              vm.$store.dispatch('getCounterBookingProxy', filter).then(function (result) {
                console.log('checkCounter', result)
                if (result) {
                  vm.isSlot = true
                  vm.createBookingOnline(filterBooking)
                } else {
                  vm.isSlot = false
                }
              }).catch(reject => {
                vm.isSlot = false
              })
            }
          } else {
            toastr.clear()
            toastr.error('Mã tờ khai hoặc mã bí mật không chính xác. Vui lòng kiểm tra lại')
          }
        }).catch(function () {
          console.log('reject')
        })
      } else {
        toastr.clear()
        toastr.error('Mã tờ khai không chính xác. Vui lòng kiểm tra lại.')
      }
    },
    createBookingOnline (filter) {
      let vm = this
      let filterValidate = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        }
      }
      let dataValidate = new URLSearchParams()
      dataValidate.append('value', vm.$refs.captcha.j_captcha_response)
      axios.post('/o/rest/v2/bookings/validatecaptcha', dataValidate, filterValidate).then(function (response) {
        console.log('validatecaptcha', response)
        if (response['data'] && response['data']['code'] === 203) {
          toastr.clear()
          toastr.error('Mã captcha không chính xác')
          vm.$refs.captcha.makeImageCap()
        } else {
          vm.$store.dispatch('createBookingOnlineProxy', filter).then(function (result) {
            vm.$refs.captcha.makeImageCap()
            toastr.success('Đăng ký xếp hàng thành công')
            vm.applicantName = ''
            vm.eformNoBooking = ''
            vm.secretBooking = ''
            vm.applicantTelNo = ''
            vm.agencyTiepNhan = ''
            vm.$refs.formBooking.resetValidation()
            setTimeout(function () {
              vm.$router.push({
                path: '/tao-to-khai-thanh-cong/1',
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            }, 300)
          }).catch (function (reject) {
            vm.$refs.captcha.makeImageCap()
          })
        }
      }).catch(function (xhr) {
        toastr.clear()
        toastr.error('Mã captcha không chính xác')
        vm.$refs.captcha.makeImageCap()
      })
      
    },
    changeAgencyBooking () {
      let vm = this
      vm.getBookingConfigs()
      if (vm.applicantIdDateFormatted) {
        vm.getCounterBooking()
      }
      setTimeout(function () {
        vm.$store.commit('setServerNo', vm.agencyTiepNhan.serverNo)
      }, 200)
    },
    changeDateBooking () {
      let vm = this
      vm.menuApplicantIdDate = false
      if (vm.agencyTiepNhan) {
        vm.getCounterBooking()
      }
    },
    getBooking () {
      let vm = this
      setTimeout(function () {
        let filterEform = {
          state: 2,
          className: 'EFORM',
          bookingFrom: vm.applicantIdDateFormatted,
          bookingTo: vm.applicantIdDateFormatted,
          serverNo: 'GET_BOOKING_' + vm.agencyTiepNhan
        }
        vm.$store.dispatch('getBookingDangGoi', filterEform).then(function (result) {
          
        }).catch(reject => {
        })
      }, 300)
    },
    updateStateBooking (item) {
      let vm = this
      let filter = item
      vm.$store.dispatch('updateBookingAll', filter).then(function (result) {
      }).catch (function (reject) {
      })
    },
    getBookingConfigs () {
      let vm = this
      setTimeout(function () {
        let filter = {
          serverNo: 'BOOKING_CONFIG_' + vm.agencyTiepNhan.code
        }
        vm.$store.dispatch('getServerConfig', filter).then(function (result) {
          // nhóm thủ tục, step dossier
          try {
            let configs = JSON.parse(result.configs)
            vm.bookingGroups = configs['bookings']
            vm.groupDvc = configs['groupId']
            console.log('bookingGroups', vm.bookingGroups)
          } catch (error) {
          }
        }).catch(function (reject) {
        })
      }, 300)  
    },
    getCounterBooking () {
      let vm = this
      setTimeout(function () {
        let filterEform = {
          groupIdBooking: vm.agencyTiepNhan.value,
          bookingDate: vm.applicantIdDateFormatted,
          serverCode: vm.agencyTiepNhan.serverNo
        }
        vm.$store.dispatch('getCounterBookingProxy', filterEform).then(function (result) {
          if (result) {
            vm.isSlot = true
          } else {
            vm.isSlot = false
          }
        }).catch(reject => {
          vm.isSlot = false
        })
      }, 300)
    },
    trackingBTTT (serviceCode) {
      try {
        console.log('trackDVC serviceCode', serviceCode)
        if (_govaq) {
          _govaq.push(['trackDVC', serviceCode, '1', ''])
        }
      } catch (error) { 
      }
    },
    allowedDates: val => (new Date(val)).getDay() !== 0 && (new Date(val)).getDay() !== 6,
    maBienNhan (str) {
      let index = 0
      let pstBN = 0
      for (var i=0; i<str.length; i++) {
        if (str.charAt(i) === '-') {
          index += 1
        }
        if (index === 3) {
          pstBN = i
          break;
        }
      }
      return str.substr(pstBN + 1)
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getCurrentDate: function () {
      let date = new Date()
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    },
    getMindate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
