<template>
  <div>
    <v-layout :style="dialogVerify ? 'visibility: hidden;' : ''" class="mt-4" wrap style="max-width:350px;margin: 0 auto">
      <nav class="v-toolbar elevation-0 theme--dark primary" data-booted="true" style="justify-content: center">
        <div class="v-toolbar__content" style="height: 40px;justify-content: center;">
          <span class="text-bold">XÁC THỰC TÀI KHOẢN</span>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-2 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12 v-if="!xacthuc_credit">
            <p>Tài khoản chưa xác thực. Để xác thực tài khoản, vui lòng nhập mã PIN đã được gửi về email của bạn.</p>
          </v-flex>
          <v-flex xs12 v-if="xacthuc_credit">
            <p>Để xác thực thông tin tài khoản. Vui lòng nhập mã PIN đã được gửi về email của bạn.</p>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Nhập mã pin"
              v-model="pinCode"
              :rules="[v => !!v || 'Mã pin là bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmPIN"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Xác thực
            </v-btn>
            <v-btn color="primary" v-if="!resend_mail"
              @click="goBack"
            >
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
            <v-btn color="primary"
              @click="resendMail"
              v-if="resend_mail"
            >
              <v-icon>replay</v-icon>&nbsp;
              Gửi lại mã PIN
            </v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="dialogVerify"
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Xác thực tài khoản
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPending" max-width="450">
      <v-card>
        <v-card-text class="pb-2" style="background-color: #00204a;position: relative;color:white">
          <div class="text-xs-center">
            <span>XÁC THỰC THÔNG TIN TÀI KHOẢN THÀNH CÔNG</span><br>
            <span>VUI LÒNG CHỜ QUẢN TRỊ VIÊN XÁC NHẬN</span>
          </div>
          <div class="mt-2">
            <span>(*) Thông báo xác nhận từ quản trị viên sẽ được gửi qua email của bạn</span>
          </div>
          <div class="text-xs-center mt-3">
            <v-btn color="primary" @click.native="goBack" style="width: 120px">
              Đồng ý
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import axios from 'axios'
import support from '../../store/support.json'
import toastr from 'toastr'

Vue.use(toastr)
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    valid: false,
    pinCode: '',
    userName: '',
    passWord: '',
    dialogVerify: false,
    dialogPending: false,
    xacthuc_credit: false,
    resend_mail: false
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      if (currentQuery.hasOwnProperty('active_code') && currentQuery.active_code) {
        vm.dialogVerify = true
        vm.pinCode = currentQuery.active_code
        setTimeout(function() {
          vm.submitConfirmPIN()
        }, 300)
      }
      try {
        if (xacthuc_credit) {
          vm.xacthuc_credit = true
        }
      } catch (error) {
      }

      try {
        if (allow_resend_mail) {
          vm.resend_mail = allow_resend_mail
        }
      } catch (error) {
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
  },
  methods: {
    submitConfirmPIN () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      let dataForm = {
        userId: currentQuery.hasOwnProperty('active_user_id') ? currentQuery.active_user_id : '',
        pinCode: vm.pinCode
      }
      // console.log('dataForm', dataForm)
      if (vm.$refs.form.validate() && dataForm.userId) {
        vm.loading = true
        let filter = dataForm

        if(vm.xacthuc_credit){
          vm.$store.dispatch('confirmPINBXD', filter).then(function (result) {
            vm.loading = false
            vm.dialogPending = true
          }).catch(function (reject) {
            vm.loading = false
          })
        } else {
          vm.$store.dispatch('confirmPIN', filter).then(function (result) {
            vm.loading = false
            $('.login-input input[type=text]').val('')
            $('.login-input input[type=password]').val('')
            $('.login-input input[type=text]').val(result.email)
            $('.login-input input[type=password]').val(result.token)
            vm.userName = result.email
            vm.passWord = result.token
            vm.goToDangNhap()
          }).catch(function (reject) {
            vm.loading = false
          })
        }
      }
    },
    resendMail () {
      let vm = this
      let filter = {
        type: ''
      }
      vm.$store.dispatch('resendMail', filter).then(function (result) {
        toastr.success('Mã PIN đã được gửi lại. Vui lòng kiểm tra email.')
      }).catch(function(error) {
        toastr.error('Gửi lại không thành công.')
      })
    },
    goToDangNhap() {
      let vm = this;
      axios.post('/o/v1/opencps/login', {}, {
        headers: {
          Authorization: 'BASIC ' + window.btoa(vm.userName + ':' + vm.passWord)
        }
      }).then(function(response) {
        if (
          response.data !== '' &&
          response.data !== 'ok' &&
          response.data !== 'captcha' &&
          response.data !== "lockout"
        ) {
          if (response.data === 'pending') {
            window.location.href =
              window.themeDisplay.getURLHome() +
              '/register#/xac-thuc-tai-khoan?active_user_id=' +
              window.themeDisplay.getUserId() +
              '&redirectURL=' +
              window.themeDisplay.getURLHome();
          } else {
            window.location.href = response.data;
          }
        } else if (response.data === 'ok') {
          window.location.href = window.themeDisplay.getURLHome();
        } else if (response.data === 'captcha') {
          let redirectURL = themeDisplay
            .getLayoutRelativeURL()
            .substring(
              0,
              themeDisplay.getLayoutRelativeURL().lastIndexOf('/')
            );
          if (redirectURL !== '') {
            window.location.href = redirectURL + '/register#/login'
          } else {
            window.location.href = themeDisplay.getURLHome() + '/register#/login'
          }
        } else if (response.data === "lockout") {
          toastr.error("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị tạm khóa trong 10 phút.")
        } else {
        }
      })
      .catch(function(error) {
      })
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
