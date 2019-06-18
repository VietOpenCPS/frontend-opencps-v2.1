<template>
  <div>
    <v-layout class="mt-4" wrap style="max-width:550px;margin: 0 auto">
      <nav class="v-toolbar elevation-0 theme--dark primary" data-booted="true" style="justify-content: center">
        <div class="v-toolbar__content" style="height: 40px;justify-content: center;">
          <span class="text-bold">XÁC THỰC TÀI KHOẢN</span>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <p>Vui lòng nhập mã PIN đã được gửi về email của bạn</p>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Nhập mã pin"
              v-model="pinCode"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
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
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import axios from 'axios'
import support from '../../store/support.json'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    valid: false,
    pinCode: '',
    userName: '',
    passWord: ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let currentQuery = current.query
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
      console.log('dataForm', dataForm)
      if (vm.$refs.form.validate() && dataForm.userId) {
        vm.loading = true
        let filter = dataForm
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
          response.data !== 'captcha'
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
        } else {
        }
      })
      .catch(function(error) {
      })
    }
  }
}
</script>
