<template>
  <div>
    <v-layout wrap class="py-2">
      <v-flex xs12 sm8 class="px-3">
        <div class="bg-gif-register"></div>
      </v-flex>
      <v-flex xs12 sm4 class="">
        <v-card>
          <nav class="toolbar theme--dark primary py-2" data-booted="true">
            <div class="toolbar__content"  style="justify-content: center">
              <span>ĐĂNG KÝ TÀI KHOẢN</span>
            </div>
          </nav>
          <v-form ref="form" v-model="valid" lazy-validation class="px-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
            <v-layout wrap>
              <v-radio-group v-model="applicantType" row @change="changeApplicantType">
                <v-radio label="Công dân" :value="true" class="ml-4"></v-radio>
                <v-radio label="Tổ chức, doanh nghiệp" :value="false"></v-radio>
              </v-radio-group>
              <v-flex xs12>
                <div><span>{{applicantType ? 'Họ và tên' : 'Tên tổ chức, doanh nghiệp'}}</span> <span style="color:red">(*)</span></div>
                <v-text-field
                  :placeholder="applicantType ? 'Họ và tên' : 'Tên tổ chức, doanh nghiệp'"
                  v-model="applicantName"
                  box
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div><span>{{applicantType ? 'Số CMND/ Hộ chiếu' : 'Mã số thuế'}}</span> <span style="color:red">(*)</span></div>
                <v-text-field
                  :placeholder="applicantType ? 'Số CMND/ Hộ chiếu' : 'Mã số thuế'"
                  v-model="applicantIdNo"
                  box
                  :rules="applicantType ? [rules.required] : [rules.required, rules.taxCode]"
                  required
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
                    slot="activator"
                    v-model="applicantIdDateFormatted"
                    append-icon="event"
                    @blur="date = parseDate(applicantIdDateFormatted)"
                    placeholder="Ngày/tháng/năm"
                  ></v-text-field>
                  <v-date-picker v-model="date" no-title @input="menuApplicantIdDate = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <div>Thư điện tử <span style="color:red">(*)</span></div>
                <v-text-field
                  box
                  placeholder="Thư điện tử"
                  v-model="contactEmail"
                  :rules="[rules.required, rules.email]"
                  name="input-10-2"
                  min="6"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <div>Số điện thoại </div>
                <v-text-field
                  placeholder="Số điện thoại"
                  v-model="contactTelNo"
                  box
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
                  name="input-10-2"
                  min="6"
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
                  min="6"
                  v-model="rePassWord"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-layout wrap>
                  <v-flex>
                    <v-checkbox 
                      :rules="[v => !!v || 'Bạn phải đồng ý với điều khoản sử dụng']"
                      required label="Tôi đồng ý với điều khoản sử dụng."
                      v-model="agreeRules"
                    >
                    </v-checkbox>
                  </v-flex>
                  <p class="pt-2 input-group__icon-cb" @click="viewRules" style="color:blue"> Chi tiết</p>
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
        <v-card-title class="headline">Điều khoản sử dụng</v-card-title>
        <v-card-text style="max-height: 600px" v-html="ruleContent"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialogRules = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import support from '../store/support.json'
// import Suggestions from 'v-suggestions'
export default {
  props: [],
  components: {
    // 'suggestions': Suggestions
  },
  data: () => ({
    date: null,
    dialogRules: false,
    loading: false,
    valid: false,
    applicantType: true,
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
    ruleContent: '',
    e1: true,
    e2: true,
    rules: {
      required: (value) => !!value || 'Trường dữ liệu bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z@$!%*#?&]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      taxCode: (value) => {
        if (value.length === 10) {
          const pattern = /^(([0-9]{10,10}))$/
          return pattern.test(value) || 'Mã số thuế gồm 10 hoặc 13 ký tự 0-9'
        } else {
          const pattern = /^(([0-9]{13,13}))$/
          return pattern.test(value) || 'Mã số thuế gồm 10 hoặc 13 ký tự 0-9'
        }
      }
    }
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.getDieuKhoan()
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
    date (val) {
      this.applicantIdDateFormatted = this.formatDate(this.date)
    }
  },
  methods: {
    submitAddUser () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      console.log(this.$refs.form.validate(), vm.agreeRules)
      let dataForm = {
        applicantName: vm.applicantName,
        applicantType: vm.applicantType ? 'citizen' : 'business',
        applicantIdNo: vm.applicantIdNo,
        applicantIdNoDate: vm.applicantIdDateFormatted,
        contactTelNo: vm.contactTelNo,
        contactEmail: vm.contactEmail,
        password: vm.passWord
      }
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate() && vm.agreeRules) {
        vm.loading = true
        let filter = dataForm
        vm.$store.dispatch('postApplicant', filter).then(function (result) {
          vm.loading = false
          router.push({
            path: '/xac-thuc-tai-khoan?active_user_id=' + result.applicantId
          })
        }).catch(function (reject) {
          vm.loading = false
        })
      }
    },
    changeApplicantType () {
      var vm = this
      console.log(vm.applicantType)
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
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
</script>
<style>
  .bg-gif-register {
    background: url('https://vietopencps.github.io/frontend-opencps-v2.1/o/opencps-frontend/register/img/bg-gif-register.gif') no-repeat center center;
    padding-top: 77.961783%;
    background-size: contain;
  }
</style>
