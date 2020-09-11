<template>
  <div style="border: 1px solid #dedede;border-top:0;">
    <v-dialog
      v-model="dialogLoadingCreate"
      persistent
      width="450"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout wrap v-if="!dialogLoadingCreate">
      <v-flex xs12 md4>
        <div class="timkiemtokhai">
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
      </v-flex>
      <v-flex xs12 md8 class="px-2">
        <div class="dangkyxephang">
          <div class="row-header no__hidden_class">
            <v-toolbar flat height="36" dark color="primary">
              <v-toolbar-title class="white--text" style="font-size: 14px;">ĐĂNG KÝ XẾP HÀNG NỘP HỒ SƠ</v-toolbar-title>
            </v-toolbar>
          </div>
          <v-card flat class="">
            <v-card-text class='px-2 py-3'>
              <v-form ref="formBooking" v-model="validBooking" lazy-validation>
                <v-layout wrap>
                  <v-flex xs12 md6 class="px-2">
                    <v-text-field v-model="eformNoBooking" box clearable
                      :rules="[v => !!v || 'Mã tờ khai là bắt buộc']" required
                    >
                      <template slot="label"> 
                        <span>Mã tờ khai</span> 
                        <span class="red--text darken-3"> *</span>
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 class="px-2">
                    <v-text-field v-model="secretBooking" box clearable
                      :rules="[v => !!v || 'Mã bí mật là bắt buộc']" required
                    >
                      <template slot="label"> 
                        <span>Mã bí mật</span> 
                        <span class="red--text darken-3"> *</span>
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 class="px-2">
                    <v-text-field v-model="applicantName" box clearable
                      :rules="[v => !!v || 'Họ tên người nộp là bắt buộc']" required
                    >
                      <template slot="label"> 
                        <span>Họ tên người nộp</span> 
                        <span class="red--text darken-3"> *</span>
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 class="px-2">
                    <v-text-field v-model="applicantTelNo" box clearable
                      :rules="[v => !!v || 'Số điện thoại là bắt buộc', rules.telNo]" required
                    >
                      <template slot="label"> 
                        <span>Số điện thoại</span> 
                        <span class="red--text darken-3"> *</span>
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 md6 class="px-2">
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
                  <v-flex xs12 md6 class="px-2">
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
                  <v-flex xs12 md6 v-if="!isSlot" class="px-2">
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
                  <v-flex xs12 md6 class="px-2">
                    <captcha ref="captcha"></captcha>
                  </v-flex>
                  <v-flex sm12 md6 class="px-2">
                    <div><span class="red--text">Chú ý:</span></div>
                    <div class="pl-3" style="text-align: justify;">
                      - Họ tên của người nộp phải trùng với họ tên của đương sự (người được cấp trong giấy tờ hoặc người xin cấp hộ chiếu) <br>
                      - Số thứ tự và thời gian xếp hàng sẽ được gửi qua tin nhắn SMS <br>
                      - Người đăng ký chịu khoản phí nhắn tin SMS
                    </div>
                  </v-flex>
                  <v-flex sm12 class="text-xs-right px-2">
                    <v-btn color="blue darken-3" :loading="loading" :disabled="loading || !isSlot" @click.native="submitQueue" class="mx-0" dark>
                      <v-icon>create</v-icon>&nbsp; Đăng ký
                    </v-btn>
                  </v-flex>
                </v-layout>
                <!--  -->

              </v-form>
            </v-card-text>
          </v-card>
        </div>
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
    dialogLoadingCreate: false,
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
      let doLoadService = function () {
        vm.dialogLoadingCreate = false
        let filter = {
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
      }
      let searchParams = window.location.href.split("?")
      
      if (searchParams[1] && searchParams[1].indexOf("vnconnect=1") !== -1 && searchParams[1].indexOf("MaTTHCDP=") !== -1) {
        vm.dialogLoadingCreate = true
        let maDVCQG = vm.getSearchParams(searchParams[1], "MaTTHCDP")
        let filterGet = {
          page: 1,
          keyword: maDVCQG
        }
        vm.$store.dispatch('getServiceLists', filterGet).then(function (result) {
          if (result.data) {
            let serviceInfoListFilter = result.data.filter(function (item) {
              return item.serviceCodeDVCQG == maDVCQG
            })
            if (serviceInfoListFilter.length > 0) {
              vm.$store.dispatch('getFileTemplateEform', serviceInfoListFilter[0]).then(response => {
                if (response.data) {
                  let fileTemplateNo = response.data[0]['fileTemplateNo']
                  let url = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web') + '/to-khai-truc-tuyen#/thong-tin-to-khai?service='+ serviceInfoListFilter[0].serviceInfoId + '&template=' + fileTemplateNo + '&vnconnect=1'
                  window.location.href = url
                } else {
                  doLoadService()
                }
              })
            } else {
              doLoadService()
            }
          } else {
            doLoadService()
          }
        }).catch(reject => {
          doLoadService()
        })
      } else {
        doLoadService()
      }
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
    getSearchParams (prams, key) {
      let value = ""
      let headers = prams.split("&")
      headers.forEach(function (header) {
        header = header.split("=");
        let keyHeader = header[0];
        if (keyHeader === key) {
          value = header[1]
        }
      });
      return value
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
