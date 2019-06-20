<template>
  <div id="login_container">
    <v-layout class="mt-4" wrap style="max-width:500px;margin: 0 auto">
      <v-flex xs12 v-if="isSigned" class="container-login">
        <v-card flat class="px-2 py-3" style="border: 1px solid #dddddd;">
          <v-flex xs12 class="primary--text text-bold text-xs-center">
            VUI LÒNG ĐĂNG XUẤT TRƯỚC KHI ĐĂNG NHẬP LẠI
          </v-flex>
          <v-flex xs12 class="mt-3 text-xs-center">
            <v-btn :loading="loading"
              :disabled="loading"
              @click="doLogOut"
              color="primary"
              class="mr-2"
            >
              <v-icon>input</v-icon>&nbsp;
              Đăng xuất
            </v-btn>
            <v-btn @click="goBack" color="primary">
              <v-icon>reply</v-icon>&nbsp;
              Thoát
            </v-btn>
          </v-flex>
        </v-card>
      </v-flex>
      <v-flex xs12 v-if="!isSigned" class="container-login">
        <v-form ref="form" v-model="valid" lazy-validation class="mt-2">
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Email đăng nhập"
              v-model="npmreactlogin_login"
              :rules="[v => !!v || 'Email đăng nhập là bắt buộc']"
              required
              prepend-inner-icon="person_outline"
              @keyup.enter="submitConfirmLogin"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="my-2">
            <v-text-field
              box
              placeholder="Mật khẩu"
              v-model="npmreactlogin_password"
              :type="'password'"
              :rules="[v => !!v || 'Mật khẩu là bắt buộc']"
              required
              prepend-inner-icon="vpn_key"
              @keyup.enter="submitConfirmLogin"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="text-xs-left">
            <div class="d-inline-block ml-2">
              <v-checkbox
                class="mt-0"
                color="primary"
                v-model="rememberAccount"
                @change=""
              >
                <div class="primary--text" slot="label">Ghi nhớ tài khoản</div>
              </v-checkbox>
            </div>
            <div class="d-inline-block primary--text right" style="cursor: pointer;">
              <p @click="getPassword" >
              Quên mật khẩu?
              </p>
            </div>
          </v-flex>
          <v-flex xs12 class="mt-3 text-xs-center">
            <v-btn class="ml-0 my-0 white--text" color="#0b72ba"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmLogin"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Đăng nhập
            </v-btn>
            <v-btn @click="goBack" color="primary">
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import support from '../../store/support.json'
export default {
  props: [],
  components: {},
  data: () => ({
    npmreactlogin_login: '',
    npmreactlogin_password: '',
    j_captcha_response: '',
    chapchablob: '',
    loading: false,
    valid: false,
    pinCode: '',
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      $('body').addClass('body_login')
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.makeImageCap()
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
    makeImageCap () {
      var vm = this
      vm.chapchablob = ''
      vm.$store.dispatch('makeImageCapLogin').then(function (result) {
        vm.chapchablob = result
      }).catch(function (reject) {
        vm.chapchablob = ''
      })
    },
    submitConfirmLogin () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      let filter = {
        npmreactlogin_login: vm.npmreactlogin_login,
        npmreactlogin_password: vm.npmreactlogin_password,
        j_captcha_response: vm.j_captcha_response
      }
      if (vm.npmreactlogin_login && vm.npmreactlogin_password) {
        vm.$store.dispatch('goToDangNhap', filter)
      }
    },
    doLogOut () {
      window.location.href = "/c/portal/logout";
    },
    getPassword () {
      let vm = this
      window.location.href = window.themeDisplay ? window.themeDisplay.getLayoutURL() + '/#/cap-lai-mat-khau' : ''
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
