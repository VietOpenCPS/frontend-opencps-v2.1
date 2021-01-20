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
              <v-flex xs12 v-if="applicantType === '1'">
                <div>
                  <span>{{applicantType === '1' ? 'Họ và tên ' : (applicantType === '2' ? 'Tên tổ chức, doanh nghiệp ' : 'Tên cơ quan, tổ chức ')}}</span> <span style="color:red">(*)</span>
                </div>
                <v-text-field
                  :placeholder="applicantType === '1' ? 'Họ và tên ' : (applicantType === '2' ? 'Tên tổ chức, doanh nghiệp ' : 'Tên cơ quan, tổ chức ')"
                  v-model="applicantName"
                  box
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 style="position: relative;">
                <div><span>{{applicantType === '1' ? 'Số CMND/ Hộ chiếu ' : (applicantType === '2' ? 'Mã số ĐKKD, mã số thuế ' : 'Mã cơ quan, tổ chức ')}}</span> <span style="color:red">(*)</span></div>
                <v-text-field
                  :placeholder="applicantType === '1' ? 'Số CMND/ Hộ chiếu ' : (applicantType === '2' ? 'Mã số ĐKKD, mã số thuế ' : 'Mã cơ quan, tổ chức ')"
                  v-model="applicantIdNo"
                  box
                  :rules="applicantType === '1' ? [rules.required, rules.credit] : (applicantType === '2' ? [rules.required, rules.taxCode] : [rules.required])"
                  required
                  @input="changeApplicantInfos"
                ></v-text-field>
                <div style="display: inline-block;position:absolute;top:25px;right:-3px" v-if="applicantType === '2' && bussinessExits">
                  <v-tooltip left>
                    <v-btn slot="activator" class="my-0" fab icon small dark color="primary" @click.native="showApplicantInfos()" style="width:26px!important;height:26px!important"
                    >
                      <v-icon dark>account_balance</v-icon>
                    </v-btn>
                    <span>Thông tin doanh nghiệp</span>
                  </v-tooltip>
                </div>
              </v-flex>
              <v-flex xs12 v-if="applicantType === '2'">
                <div v-if="!validBussinessInfos && hasCheckBussiness" class="mb-2">
                  <v-chip color="red" outline text-color="red" class="mx-0" style="width: 100%">
                    <v-avatar>
                      <v-icon size=18>warning</v-icon>
                    </v-avatar>
                    <span v-if="!bussinessExits">{{'Mã số ĐKKD, mã số thuế ' + applicantIdNo + ' không chính xác'}}</span>
                    <span v-if="bussinessExits && !bussinessStatus">{{'Doanh nghiệp mã số thuế ' + applicantIdNo + ' không còn hoạt động'}}</span>
                  </v-chip>
                </div>
                <div>
                  <span>{{applicantType === '1' ? 'Họ và tên ' : (applicantType === '2' ? 'Tên tổ chức, doanh nghiệp ' : 'Tên cơ quan, tổ chức ')}}</span> <span style="color:red">(*)</span>
                </div>
                <v-textarea
                  :placeholder="applicantType === '1' ? 'Họ và tên ' : (applicantType === '2' ? 'Tên tổ chức, doanh nghiệp ' : 'Tên cơ quan, tổ chức ')"
                  v-model="applicantName"
                  box
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                  :disabled="loadingVerify"
                  rows="2"
                  class="text-area-custom"
                ></v-textarea>
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
                    :rules="[rules.required, rules.birthDate]"
                    box
                    slot="activator"
                    v-model="applicantIdDateFormatted"
                    append-icon="event"
                    @blur="date = parseDate(applicantIdDateFormatted)"
                    placeholder="dd/mm/yyyy"
                    mask="##/##/####"
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
                  :rules="requiredOption['contactTelNo'] ? [rules.required, rules.telNo] : (contactTelNo ? [rules.telNo]: [])"
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
              <v-flex xs12  v-if="xacthuc_credit">
                <div>{{applicantType === '1' ? 'Ảnh CMND ' : (applicantType === '2' ? 'Ảnh giấy phép đăng ký ' : 'Ảnh giấy phép đăng ký  ')}} <span style="color:red">(*)</span></div>
                <div style="display:flex; flex-wrap: wrap;">
                  <v-text-field 
                    @click='onPickFileCMND'
                    v-model='fileCMNDName'
                    v-if="xacthuc_credit"
                    :rules="[rules.required]"
                    placeholder="Tải lên ảnh .png, .jpg, .jqeg, .pdf"
                    box
                    append-icon="cloud_upload"
                    :append-icon-cb="onPickFileCMND"
                  ></v-text-field>
                  <!-- <v-btn
                    color="primary"
                    @click="onPickFileCMND"
                  >
                    Tải lên
                    <v-icon right dark>cloud_upload</v-icon>
                  </v-btn> -->
                  <!-- Hidden -->
                  <input
                    type="file"
                    style="display: none"
                    ref="refFileCMND"
                    accept="image/pdf*"
                    @change="onFileCMNDPicked">
                </div>
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
              <div class="mb-2"><span class="text-bold">Mã số ĐKKD, mã số thuế: </span> <span>{{applicantInfos.applicantIdNo}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="mb-2"><span class="text-bold">Ngày thành lập: </span> <span>{{applicantInfos.applicantDate}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="mb-2"><span class="text-bold">Loại hình doanh nghiệp: </span> <span>{{applicantInfos.companyType}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="mb-2"><span class="text-bold">Địa chỉ:</span> <span>{{applicantInfos.address}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="mb-2"><span class="text-bold">Tình trạng: </span> <span>{{applicantInfos.companyStatus}}</span></div>
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
    <v-dialog scrollable v-model="dialogApplicantType" persistent max-width="450">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Đối tượng đăng ký</v-toolbar-title>
        </v-toolbar>
        <v-card-text >
          <v-flex class="text-xs-center">
            <v-btn class="mr-2" color="primary" @click.native="chosseType('1')"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Công dân
            </v-btn>
            <v-btn class="ml-3" color="primary" @click.native="chosseType('2')"
            >
              <v-icon style="color: #fff">account_balance</v-icon>&nbsp;
              Doanh nghiệp
            </v-btn>
          </v-flex>
        </v-card-text>
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
    dialogApplicantType: false,
    date: null,
    dialogPending: false,
    dialogRules: false,
    dialog_applicantInfos: false,
    xacthuc_credit: false,
    applicantInfos: {
      applicantName: '',
      applicantIdNo: '',
      applicantDate: '',
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
    hasCheckBussiness: false,
    bussinessExits: false,
    bussinessStatus: false,
    bussinessInfomation: '',
    validBussinessInfos: true,
    messageCheckApplicant: '',
    ruleContent: '',
    fileCMNDName: '',
    fileCMND: '',
    maskDate: '##/##/####',
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
      birthDate: (value) => {
        const pattern = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])(19|20)\d\d$/
        if (value) {
          return pattern.test(value) || 'Ngày tháng năm không hợp lệ, eg: 31/11/1990, ...'
        } else {
          return []
        }
      },
      passWord: (value) => {
        const pattern = /^((?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])([0-9a-zA-Z@$!%*#?&]{8,}))$/
        return pattern.test(value) || 'Ít nhất 8 ký tự và có chữ hoa, chữ thường, ký tự đặc biệt @$!%*#?&'
      },
      taxCode: (value) => {
        if (value.length === 10) {
          const pattern = /^(([0-9]{10,10}))$/
          return pattern.test(value) || 'Mã số ĐKKD, mã số thuế gồm 10 hoặc 13 ký tự 0-9'
        } else {
          const pattern = /^(([0-9]{13,13}))$/
          return pattern.test(value) || 'Mã số ĐKKD, mã số thuế gồm 10 hoặc 13 ký tự 0-9'
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
      $('body').removeClass('body_login')
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
      try {
        if (xacthuc_credit) {
          vm.xacthuc_credit = true
        }
      } catch (error) {
      }
      try {
        vm.hasCheckBussiness = hasCheckBussiness
      } catch (error) {
      }
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.getDieuKhoan()
      // mappping user dvcqg
      console.log('currentQuery', currentQuery)
      if (currentQuery.hasOwnProperty('applycantType') && currentQuery['applycantType']) {
        vm.dialogApplicantType = true
      }
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
    chosseType(type) {
      let vm = this
      vm.applicantType = type
      vm.dialogApplicantType = false
    },
    submitAddUser () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      // console.log(this.$refs.form.validate(), vm.agreeRules)
      let dataForm = {
        applicantName: vm.applicantName,
        applicantType: vm.applicantType === '1' ? 'citizen' : (vm.applicantType === '2' ? 'business' : 'organization'),
        applicantIdNo: vm.applicantIdNo,
        applicantIdNoDate: String(vm.applicantIdDateFormatted).indexOf('/') > 0 ? vm.applicantIdDateFormatted : vm.formatDateCreate(vm.applicantIdDateFormatted),
        contactTelNo: vm.contactTelNo,
        contactEmail: vm.contactEmail,
        password: vm.passWord,
        j_captcha_response: vm.$refs.captcha.j_captcha_response,
        indentifyNoFile: vm.fileCMND,
      }
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate() && vm.agreeRules) {
        let passValid = true
        if (vm.applicantType === '2' && vm.hasCheckBussiness && (!vm.bussinessExits || !vm.bussinessStatus || 
          (vm.bussinessExits && vm.bussinessStatus && vm.applicantName.toLocaleLowerCase().trim() !== vm.bussinessInfomation['NAME'].toLocaleLowerCase().trim()))
        ) {
          passValid = false
          if (vm.applicantName.toLocaleLowerCase().trim() !== vm.bussinessInfomation['NAME'].toLocaleLowerCase().trim()) {
            vm.messageCheckApplicant = 'Vui lòng nhập tên tổ chức, doanh nghiệp đúng với tên đăng ký kinh doanh'
          }
          toastr.error(vm.messageCheckApplicant)
          return
        } else { passValid = true }
        if (passValid) {
          vm.loading = true
          let filter = dataForm
          if(vm.xacthuc_credit) {
            vm.$store.dispatch('postApplicantBXD', filter).then(function (result) {
              vm.loading = false
              vm.$refs.captcha.makeImageCap()
              vm.$refs.form.reset()
              vm.$refs.form.resetValidation()
              vm.applicantType = '1'
              vm.dialogPending = true
              vm.$router.push({
                path: '/xac-thuc-tai-khoan?active_user_id=' + result.applicantId
              })
            }).catch(function (reject) {
              vm.$refs.captcha.makeImageCap()
              vm.loading = false
            })
          } else {
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
      } else {
        toastr.error('Vui lòng điền đầy đủ thông tin đăng ký')
      }
    },
    changeApplicantType () {
      let vm = this
      // console.log(vm.applicantType)
      setTimeout(function () {
        if (vm.applicantType === '2') {
          vm.validBussinessInfos = true
        } else {
          vm.validBussinessInfos = false
          vm.bussinessExits = false
          vm.bussinessStatus = false
        }
        vm.applicantIdNo = ''
        vm.applicantName = ''
        vm.applicantIdNoDate = ''
        vm.contactTelNo = ''
        vm.contactEmail = ''
        vm.passWord = ''
        vm.rePassWord = ''
        vm.applicantIdDateFormatted = null
        vm.$refs.form.resetValidation()
      }, 50)
    },
    changeApplicantInfos () {
      let vm = this
      if (vm.applicantType === '2' && vm.hasCheckBussiness) {
        if (vm.functionTimeOut) {
          clearTimeout(vm.functionTimeOut)
        }
        vm.functionTimeOut = setTimeout(function () {
          if (vm.applicantIdNo.length >= 10) {
            vm.checkApplicantInfos()
          } else {
            vm.validBussinessInfos = true
          }
        }, 1000)
      }
    },
    checkApplicantInfos () {
      let vm = this
      if (vm.applicantType === '2') {
        let filter = {
          applicantIdNo: vm.applicantIdNo
        }
        // vm.loadingVerify = true
        vm.$store.dispatch('checkApplicantInfos', filter).then(result => {
          // vm.loadingVerify = false
          if (result && result.hasOwnProperty('ENTERPRISE_GDT_CODE') && result.ENTERPRISE_GDT_CODE) {
            vm.bussinessInfomation = result
            vm.validBussinessInfos = true
            vm.bussinessExits = true
            vm.applicantName = result.NAME
            vm.applicantIdDateFormatted = result.FOUNDING_DATE
            if (result.hasOwnProperty('ENTERPRISE_STATUS_ID') && result.ENTERPRISE_STATUS_ID === 'ACT') {
              vm.bussinessStatus = true
            } else {
              vm.bussinessStatus = false
              vm.validBussinessInfos = false
              vm.messageCheckApplicant = 'Doanh nghiệp mã số thuế ' + vm.applicantIdNo + ' không còn hoạt động. Vui lòng kiểm tra lại'
            }
          } else {
            vm.validBussinessInfos = false
            vm.bussinessExits = false
            vm.applicantName = ''
            vm.applicantIdDateFormatted = null
            vm.messageCheckApplicant = 'Mã số ĐKKD, mã số thuế ' + vm.applicantIdNo + ' không chính xác. Vui lòng kiểm tra lại'
          }
        }).catch(function () {
          vm.validBussinessInfos = false
          vm.bussinessExits = false
          vm.bussinessStatus = false
          vm.applicantName = ''
        })
      }
    },
    showApplicantInfos () {
      let vm = this
      vm.applicantInfos['applicantName'] = vm.bussinessInfomation['NAME']
      vm.applicantInfos['applicantIdNo'] = vm.bussinessInfomation['ENTERPRISE_GDT_CODE']
      vm.applicantInfos['applicantDate'] = vm.bussinessInfomation['FOUNDING_DATE']
      vm.applicantInfos['address'] = vm.bussinessInfomation['AddressFullText']
      vm.applicantInfos['companyType'] = vm.bussinessInfomation['ENTERPRISE_TYPE_NAME']
      vm.applicantInfos['companyStatus'] = vm.bussinessInfomation['ENTERPRISE_STATUS_NAME']
      vm.dialog_applicantInfos = true
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
      // const [day, month, year] = date.split('/')
      // return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      let day = date.slice(0, 2)
      let month = date.slice(2, 4)
      let year = date.slice(4, 8)
      return year + '-' + month + '-' + day
    },
    formatDateCreate (date) {
      if (!date) return null
      // const [day, month, year] = date.split('/')
      // return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      let day = date.slice(0, 2)
      let month = date.slice(2, 4)
      let year = date.slice(4, 8)
      return day + '/' + month + '/' + year
    },
    getMaxdate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    inputDisable () {
      return
    },
    onPickFileCMND () {
      this.$refs.refFileCMND.click()
    },
    onFileCMNDPicked (event) {
      let vm = this
      const files = event.target.files
      if(files.length){
        const file = files[0]
        const size = (file.size / 1024 / 1024).toFixed(2)
        if(size > 10){
          alert("Tệp tải lên kích thước tối đa 10MB"); 
        } else {
          vm.fileCMND = file
          vm.fileCMNDName = files[0].name
        }
      }
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
