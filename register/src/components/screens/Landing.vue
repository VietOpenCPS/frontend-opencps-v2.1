<template>
  <div>
    <v-layout wrap class="py-2" style="
      max-width: 1300px;
    ">
      <v-flex xs12 md8 :class="!isMobile ? 'px-3' : 'px-2'">
        <div class="bg-gif-register" style="background: url('https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend-cli/register/app/img/bg-gif-register.gif') no-repeat center center;padding-top: 77.961783%;background-size: contain;"></div>
      </v-flex>
      <v-flex xs12 md4 :class="!isMobile ? 'px-3' : 'px-2'">
        <v-card>
          <nav class="v-toolbar elevation-0 theme--dark primary" data-booted="true" style="justify-content: center">
            <div class="v-toolbar__content" style="height: 40px;justify-content: center;">
              <span class="text-bold white--text">ĐĂNG KÝ TÀI KHOẢN</span>
            </div>
          </nav>
          <v-form ref="form" v-model="valid" lazy-validation :class="!isMobile ? 'px-3' : 'px-2'" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
            <v-layout wrap>
              <v-radio-group v-if="hasOrganization" class="mt-2 radio_register_type" v-model="applicantType" row @change="changeApplicantType">
                <v-radio label="Công dân" :value="'1'" class="mr-2"></v-radio>
                <v-radio label="Doanh nghiệp" :value="'2'" class="mr-2"></v-radio>
                <v-radio label="Cơ quan, tổ chức" :value="'3'" class="mr-2"></v-radio>
              </v-radio-group>
              <v-radio-group v-else class="mt-2 radio_register_type" v-model="applicantType" row @change="changeApplicantType">
                <v-radio label="Công dân" :value="'1'" class="mr-2"></v-radio>
                <v-radio label="Tổ chức, doanh nghiệp" :value="'2'" class="mr-2"></v-radio>
              </v-radio-group>
              <v-flex xs12>
                <div style="position:relative">
                  <span>{{applicantType === '1' ? 'Họ và tên ' : (applicantType === '2' ? 'Tên tổ chức, doanh nghiệp ' : 'Tên cơ quan, tổ chức ')}}</span> <span style="color:red">(*)</span>
                  <v-tooltip left v-if="applicantType === '2' && bussinessExits" style="position:absolute;top:-5px;right:-3px">
                    <v-btn slot="activator" class="my-0" fab icon small dark color="primary" @click.native="getApplicantInfos()" style="width:26px!important;height:26px!important"
                    >
                      <v-icon dark>account_balance</v-icon>
                    </v-btn>
                    <span>Đối chiếu thông tin doanh nghiệp</span>
                  </v-tooltip>
                </div>
                <v-text-field
                  :placeholder="applicantType === '1' ? 'Họ và tên ' : (applicantType === '2' ? 'Tên tổ chức, doanh nghiệp ' : 'Tên cơ quan, tổ chức ')"
                  v-model="applicantName"
                  box
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                  @input="changeApplicantInfos"
                  :disabled="loadingVerify"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div><span>{{applicantType === '1' ? 'Số CMND/ Hộ chiếu ' : (applicantType === '2' ? 'Mã số thuế ' : 'Mã cơ quan, tổ chức ')}}</span> <span style="color:red">(*)</span></div>
                <v-text-field
                  :placeholder="applicantType === '1' ? 'Số CMND/ Hộ chiếu ' : (applicantType === '2' ? 'Mã số thuế ' : 'Mã cơ quan, tổ chức ')"
                  v-model="applicantIdNo"
                  box
                  :rules="applicantType === '1' ? [rules.required, rules.credit] : (applicantType === '2' ? [rules.required, rules.taxCode] : [rules.required])"
                  required
                  @input="changeApplicantInfos"
                  :disabled="loadingVerify"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div>Ngày cấp <span style="color:red">(*)</span></div>
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
                    :rules="[rules.required]"
                    box
                    readonly
                    style="pointer-events:none"
                    slot="activator"
                    v-model="applicantIdDateFormatted"
                    append-icon="event"
                    @blur="date = parseDate(applicantIdDateFormatted)"
                    placeholder="Ngày/tháng/năm"
                  ></v-text-field>
                  <v-date-picker min="1950-01-01" :max="getMaxdate()" ref="picker"
                  :first-day-of-week="1" locale="vi" v-model="date" no-title @input="menuApplicantIdDate = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <div>Thư điện tử <span style="color:red">(*)</span></div>
                <v-text-field
                  box
                  placeholder="Thư điện tử"
                  v-model="contactEmail"
                  :rules="requiredOption['contactEmail'] ? [rules.required, rules.email] : [rules.email]"
                  min="6"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div>Số điện thoại <span v-if="requiredOption['contactTelNo']" style="color:red">(*)</span></div>
                <v-text-field
                  placeholder="Số điện thoại"
                  v-model="contactTelNo"
                  :rules="requiredOption['contactTelNo'] ? [rules.required, rules.telNo] : [rules.telNo]"
                  box
                  browser-autocomplete="off"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div>Mật khẩu <span style="color:red">(*)</span></div>
                <v-text-field
                  box
                  :append-icon="e1 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e1 = !e1)"
                  :rules="[rules.required, rules.passWord]"
                  :type="e1 ? 'password' : 'text'"
                  min="8"
                  v-model="passWord"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div>Nhập lại mật khẩu <span style="color:red">(*)</span></div>
                <v-text-field
                  box
                  :append-icon="e2 ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (e2 = !e2)"
                  :rules="[rules.required, v => v===passWord || 'Mật khẩu nhập lại không chính xác']"
                  :type="e2 ? 'password' : 'text'"
                  name="input-10-2"
                  v-model="rePassWord"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <captcha ref="captcha"></captcha>
              </v-flex>
              <v-flex xs12>
                <v-layout wrap class="pt-3">
                  <v-flex>
                    <v-checkbox 
                      :rules="[v => !!v || 'Vui lòng đồng ý với điều khoản sử dụng của chúng tôi']"
                      required label="Tôi đồng ý với điều khoản sử dụng"
                      v-model="agreeRules"
                    >
                    </v-checkbox>
                  </v-flex>
                  <p class="pt-2 input-group__icon-cb" @click="viewRules" style="color: #0072c2;font-weight: bold;padding-right: 10px;"> Chi tiết</p>
                </v-layout>
              </v-flex>
            </v-layout>
            <div class="text-xs-center my-2">
              <v-btn color="primary"
                :loading="loading"
                :disabled="loading"
                @click="submitAddUser"
              >
                <v-icon>how_to_reg</v-icon>&nbsp;
                Đăng ký
              </v-btn>
            </div>
          </v-form>
        </v-card>
        
      </v-flex>
    </v-layout>

    <v-dialog scrollable v-model="dialogRules" persistent max-width="600">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Điều khoản sử dụng</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogRules = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="max-height: 600px" v-html="ruleContent"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialogRules = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_applicantInfos" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Thông tin doanh nghiệp</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_applicantInfos = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-layout wrap class="py-1 align-center">
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Tên tổ chức, doanh nghiệp: </span> <span>{{applicantInfos.applicantName}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Mã số thuế: </span> <span>{{applicantInfos.applicantIdNo}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Loại hình doanh nghiệp: </span> <span>{{applicantInfos.companyType}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Địa chỉ:</span> <span>{{applicantInfos.address}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Người đại diện: </span> <span>{{applicantInfos.representatives}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Tình trạng: </span> <span>{{applicantInfos.companyStatus}}</span></div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click.native="dialog_applicantInfos = false">
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
import $ from 'jquery'
import support from '../../store/support.json'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
// import Suggestions from 'v-suggestions'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: [],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    date: null,
    dialogRules: false,
    dialog_applicantInfos: false,
    applicantInfos: {
      applicantName: '',
      applicantIdNo: '',
      companyType: '',
      companyStatus: '',
      address: '',
      representatives: ''
    },
    loading: false,
    loadingVerify: false,
    valid: false,
    hasOrganization: false,
    applicantType: '1',
    applicantName: '',
    applicantIdNo: '',
    menuApplicantIdDate: false,
    applicantIdDate: null,
    applicantIdDateFormatted: null,
    contactTelNo: '',
    contactEmail: '',
    passWord: '',
    rePassWord: '',
    agreeRules: false,
    functionTimeOut: null,
    bussinessExits: false,
    validBussinessInfos: true,
    messageCheckApplicant: '',
    ruleContent: '',
    e1: true,
    e2: true,
    rules: {
      required: (value) => !!value || 'Trường dữ liệu bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      telNo: (value) => {
        const pattern = /^0([1-9]{1}\d{8})$/
        if (value) {
          return pattern.test(value) || 'Số điện thoại gồm 10 ký tự 0-9, eg: 0989123456, ...'
        } else {
          return []
        }
      },
      passWord: (value) => {
        const pattern = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])([0-9a-zA-Z@$!%*#?&]{8,}))$/
        return pattern.test(value) || 'Ít nhất 8 ký tự và có chữ hoa, chữ thường, ký tự đặc biệt @$!%*#?&'
      },
      taxCode: (value) => {
        if (value.length === 10) {
          const pattern = /^(([0-9]{10,10}))$/
          return pattern.test(value) || 'Mã số thuế gồm 10 hoặc 13 ký tự 0-9'
        } else {
          const pattern = /^(([0-9]{13,13}))$/
          return pattern.test(value) || 'Mã số thuế gồm 10 hoặc 13 ký tự 0-9'
        }
      },
      credit: (value) => {
        if (value.length === 9) {
          const pattern = /^(([0-9]{9,9}))$/
          return pattern.test(value) || 'Số CMND gồm 9 hoặc 12 ký tự 0-9'
        } else {
          const pattern = /^(([0-9]{12,12}))$/
          return pattern.test(value) || 'Số CMND gồm 9 hoặc 12 ký tự 0-9'
        }
      }
    },
    requiredOption: {
      applicantName: true,
      applicantIdNo: true,
      applicantIdDate: true,
      contactEmail: true,
      contactTelNo: false
    }
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      try {
        if (rulesConfig) {
          vm.rules = Object.assign({}, vm.rules, rulesConfig)
        }
        if (requiredOption) {
          vm.requiredOption = requiredOption
        }
        if (hasOrganizationConfig === true) {
          vm.hasOrganization = true
        }
      } catch (error) {
      }
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.getDieuKhoan()
      // mappping user dvcqg
      console.log('currentQuery', currentQuery)
      if (currentQuery.hasOwnProperty('name') && currentQuery['name']) {
        console.log('currentQuery 2', currentQuery['type'], currentQuery['name'], currentQuery['tel'])
        vm.applicantType = currentQuery.hasOwnProperty('type') ? (String(currentQuery['type']) === '1' ? '1' : '2') : '1'
        vm.applicantName = currentQuery.hasOwnProperty('name') ? currentQuery['name'] : ''
        vm.applicantIdNo = currentQuery.hasOwnProperty('credit') ? currentQuery['credit'] : ''
        vm.contactTelNo = currentQuery.hasOwnProperty('tel') ? currentQuery['tel'] : ''
        vm.contactEmail = currentQuery.hasOwnProperty('mail') ? currentQuery['mail'] : ''
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  mounted () {
    let vm = this
    try {
      if (hasOrganizationConfig === true) {
        vm.hasOrganization = true
      }
    } catch (error) {
    }
    let elements = document.querySelectorAll('[autocomplete="off"]');
    if (!elements) {
      return
    }
    elements.forEach(element => {
      element.setAttribute('readonly', 'readonly')
      element.style.backgroundColor = 'inherit'
      setTimeout(() => {
        element.removeAttribute('readonly')
      }, 500)
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    date (val) {
      this.applicantIdDateFormatted = this.formatDate(this.date)
    },
    menuApplicantIdDate (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    submitAddUser () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      // console.log(this.$refs.form.validate(), vm.agreeRules)
      let dataForm = {
        applicantName: vm.applicantName,
        applicantType: vm.applicantType === '1' ? 'citizen' : (vm.applicantType === '2' ? 'business' : 'organization'),
        applicantIdNo: vm.applicantIdNo,
        applicantIdNoDate: vm.applicantIdDateFormatted,
        contactTelNo: vm.contactTelNo,
        contactEmail: vm.contactEmail,
        password: vm.passWord,
        j_captcha_response: vm.$refs.captcha.j_captcha_response
      }
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate() && vm.agreeRules) {
        let passValid = false
        if (!vm.validBussinessInfos) {
          let x = confirm(vm.messageCheckApplicant + ' Bạn có muốn tiếp tục?')
          if (x) {
            passValid = true
          }
        } else { passValid = true }
        if (passValid) {
          vm.loading = true
          let filter = dataForm
          vm.$store.dispatch('postApplicant', filter).then(function (result) {
            vm.loading = false
            vm.$refs.captcha.makeImageCap()
            vm.$router.push({
              path: '/xac-thuc-tai-khoan?active_user_id=' + result.applicantId
            })
          }).catch(function (reject) {
            vm.$refs.captcha.makeImageCap()
            vm.loading = false
          })
        }
      }
    },
    changeApplicantType () {
      var vm = this
      // console.log(vm.applicantType)
      if (vm.applicantType === '2') {
        vm.validBussinessInfos = true
      }
      vm.changeApplicantInfos()
    },
    changeApplicantInfos () {
      let vm = this
      if (vm.applicantType === '2') {
        if (vm.functionTimeOut) {
          clearTimeout(vm.functionTimeOut)
        }
        vm.functionTimeOut = setTimeout(function () {
          if (vm.applicantIdNo.length === 10 || vm.applicantIdNo.length === 13) {
            vm.checkApplicantInfos()
          }
        }, 2000)
      }
    },
    checkApplicantInfos () {
      let vm = this
      if (vm.applicantType === '2') {
        let filter = {
          applicantIdNo: vm.applicantIdNo,
          applicantName: vm.applicantName
        }
        // vm.loadingVerify = true
        vm.$store.dispatch('checkApplicantInfos', filter).then(result => {
          // vm.loadingVerify = false
          if (result && result.hasOwnProperty('error') && result.error === true) {
            vm.validBussinessInfos = false
            vm.bussinessExits = false
            // vm.$store.commit('setApplicantBussinessExit', false)
            // toastr.error(result.message + ' Vui lòng kiểm tra lại mã số thuế')
            vm.messageCheckApplicant = result.message
          } else if (result && result.hasOwnProperty('warning') && result.warning === true) {
            vm.validBussinessInfos = false
            vm.bussinessExits = true
            // vm.$store.commit('setApplicantBussinessExit', false)
            // toastr.error(result.message + ' Vui lòng đối chiếu thông tin doanh nghiệp')
            vm.messageCheckApplicant = result.message
          } else if (result && !result.hasOwnProperty('error') && !result.hasOwnProperty('warning')) {
            vm.validBussinessInfos = true
            vm.bussinessExits = true
            // vm.$store.commit('setApplicantBussinessExit', filter['applicantIdNo'])
          }
        }).catch(function () {
          vm.loadingVerify = false
        })
      }
    },
    getApplicantInfos () {
      let vm = this
      let filter = {
        applicantIdNo: vm.applicantIdNo
      }
      vm.$store.dispatch('getApplicantInfos', filter).then(result => {
        vm.applicantInfos['applicantName'] = result['MainInformation']['NAME']
        vm.applicantInfos['applicantIdNo'] = result['MainInformation']['ENTERPRISE_GDT_CODE']
        vm.applicantInfos['address'] = result['HOAdress']['AddressFullText']
        vm.applicantInfos['representatives'] = result['Representatives']['FULL_NAME'] ? result['Representatives']['FULL_NAME'] : result['Representatives'][0]['FULL_NAME']
        vm.applicantInfos['companyType'] = result['MainInformation']['ENTERPRISE_TYPE_NAME']
        vm.applicantInfos['companyStatus'] = result['MainInformation']['ENTERPRISE_STATUS_NAME']
        vm.dialog_applicantInfos = true
      })
    },
    getDieuKhoan () {
      let vm = this
      vm.$store.dispatch('getDieuKhoan').then(function (result) {
        vm.ruleContent = result
      })
    },
    viewRules () {
      let vm = this
      vm.dialogRules = true
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
    getMaxdate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    inputDisable () {
      return
    }
  }
}
</script>
<style>
  .bg-gif-register {
    background: url('https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend-cli/register/app/img/bg-gif-register.gif') no-repeat center center;
    padding-top: 77.961783%;
    background-size: contain;
  }
</style>
