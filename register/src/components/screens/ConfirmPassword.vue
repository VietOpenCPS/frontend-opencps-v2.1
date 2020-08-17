<template>
  <div>
    <v-layout wrap class="mt-4" style="max-width:550px;margin: 0 auto">
      <nav class="v-toolbar elevation-0 theme--dark primary" data-booted="true" style="justify-content: center">
        <div class="v-toolbar__content" style="height: 40px;justify-content: center;">
          <span class="text-bold">NHẬP MÃ BẢO MẬT</span>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <p>Vui lòng kiểm tra email để lấy mã bảo mật</p>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Mã bảo mật"
              v-model="confirmCode"
              :rules="[v => !!v || 'Mã bảo mật là bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <captcha ref="captcha"></captcha>
          </v-flex>
          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmPASS"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Đồng ý
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
              Gửi lại mã bảo mật
            </v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogResend" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">
          <div style="text-align: center;width: 100%;">NHẬP MÃ XÁC NHẬN</div>
        </v-card-title>
        <v-card-text class="py-2 px-2" v-if="dialogResend">
          <v-form ref="formCaptcha" v-model="validResend" lazy-validation class="px-2 pt-2">
            <v-flex xs12>
              <captcha ref="captcha_resend"></captcha>
            </v-flex>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="cancelResend">
            <v-icon>clear</v-icon>&nbsp;
              Bỏ qua
          </v-btn>
          <v-btn color="primary" flat @click="submitResend">
            <v-icon>how_to_reg</v-icon>&nbsp;
              Xác nhận
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
import Captcha from './Captcha.vue'
import toastr from 'toastr'

Vue.use(toastr)
export default {
  props: [],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    loading: false,
    valid: false,
    confirmCode: '',
    resend_mail: false,
    dialogResend: false,
    validResend: false
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
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
    submitConfirmPASS () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      let dataForm = {
        userCode: currentQuery.hasOwnProperty('active_user_id') ? currentQuery.active_user_id : '',
        confirmCode: vm.confirmCode,
        j_captcha_response: vm.$refs.captcha.j_captcha_response
      }
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate()) {
        vm.loading = true
        let filter = dataForm
        vm.$store.dispatch('confirmCodeForgotPass', filter).then(function (result) {
          vm.loading = false
          if (result === 'captcha') {
            vm.$refs.captcha.makeImageCap()
          }
        }).catch(function (reject) {
          vm.loading = false
          vm.$refs.captcha.makeImageCap()
        })
      }
    },
    resendMail () {
      let vm = this
      vm.$refs.captcha_resend.makeImageCap()
      vm.dialogResend = true
    },
    cancelResend() {
      let vm = this
      vm.dialogResend = false
    },
    submitResend () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      let filter = {
        activeId: currentQuery.hasOwnProperty('active_user_id') ? currentQuery.active_user_id : '',
        notificationType: 'USER-05',
        notifyMessage: vm.$refs.captcha_resend.j_captcha_response
      }
      vm.$store.dispatch('resendMail', filter).then(function (result) {
        toastr.success('Mã bảo mật đã được gửi lại. Vui lòng kiểm tra email.')
        vm.dialogResend = false
        vm.$refs.captcha.makeImageCap()
        vm.confirmCode = ''
      }).catch(function() {
        vm.$refs.captcha_resend.makeImageCap()
      })
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
