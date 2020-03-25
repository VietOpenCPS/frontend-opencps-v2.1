<template>
  <div id="login_container">
    <div class="header_login">
      <div class="logo"> 
        <a href=""> 
          <img src=""> 
          <div class="text-logo">
          </div> 
        </a> 
      </div>
    </div>
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
            <v-btn class="my-0 white--text" color="#0b72ba"
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
            <v-btn v-if="conectDvcqg" class="px-2 my-0" color="#913938"
              :loading="loading"
              :disabled="loading"
              @click="loginDVCQG"
            >
              Đăng nhập qua Cổng DVC Quốc gia
            </v-btn>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
    <div class="footer_login"></div>
    <!--  -->
    <v-dialog class="my-0" v-model="dialog_loginDVCQG" max-width="1200px" style="width:100%;max-height: 100%;">
      <v-card>
        <v-card-text class="px-0 py-0">
          <iframe id="iframeLoginDVCQG" :src="tempDVCQG" style="
            width: 100%;
            height: 650px;
            border: none;
          "></iframe>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
    conectDvcqg: false,
    dialog_loginDVCQG: false,
    tempDVCQG: ''
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
      try {
        vm.conectDvcqg = ssoConfig ? ssoConfig['active'] : false
      } catch (error) {
      }
      if (vm.conectDvcqg) {
        window.callback_dvcqg = vm.callback_dvcqg
      }
      // vm.makeImageCap()
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
      let vm = this
      // if (typeof(Storage) !== 'undefined') {
      //   sessionStorage.removeItem('userLogout')
      //   if (String(vm.userData['className']).indexOf('Employee') >= 0) {
      //     sessionStorage.setItem('userLogout', 'employee')
      //   } else {
      //     sessionStorage.setItem('userLogout', 'applicant')
      //   }
      // }
      window.location.href = "/c/portal/logout";
    },
    getPassword () {
      let vm = this
      window.location.href = window.themeDisplay ? window.themeDisplay.getLayoutURL() + '/#/cap-lai-mat-khau' : ''
    },
    loginDVCQG () {
      let vm = this
      // window.location.href = window.themeDisplay.getPortalURL() + '/web/cong-dich-vu-cong/dang-nhap-dvcqg'
      // new version
      let filter = {
        state: 'auth',
        redirectURL: window.location.origin
      }
      vm.$store.dispatch('getVNConect', filter).then(function (result) {
        if (result) {
          window.location.href = result
        } else {
          alert('Chức năng đang cập nhật')
        }
      }).catch(function () {
        alert('Chức năng đang cập nhật')
      })
    },
    callback_dvcqg (data) {
      let vm = this
      let urlRedirect = ''
      try {
        urlRedirect = ssoConfig ? ssoConfig['urlRedirect'] : window.themeDisplay.getLayoutURL() + '#' + current.path
      } catch (error) {
      }
      window.location.href = window.themeDisplay.getURLHome()
      // window.location.href = urlRedirect
      // window.location.reload()
      vm.dialog_loginDVCQG = false
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
