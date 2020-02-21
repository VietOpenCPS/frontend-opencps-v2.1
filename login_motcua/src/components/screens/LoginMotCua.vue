<template>
  <div id="login_container">
    <div class="header_login">
      <div class="logo"> 
        <a href=""> 
          <img src="/o/kiemthuduongbo-theme/images/color_schemes/bogt-theme/logo.png"> 
          <div class="text-logo">
            Bộ Giao thông Vận tải <br> 
            <span>Hệ thống nghiệp vụ xử lý thủ tục hành chính</span>
          </div> 
        </a> 
      </div>
    </div>
    <v-layout class="mt-4" wrap style="max-width:550px;margin: 0 auto">
      <v-flex xs12 v-if="isSigned">
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
      <!-- <nav v-if="!isSigned" class="toolbar theme--dark primary py-2" data-booted="true">
        <div class="toolbar__content"  style="justify-content: center">
          <h4>ĐĂNG NHẬP</h4>
        </div>
      </nav> -->
      <v-flex xs12 v-if="!isSigned">
        <nav>
          <div class="text-bold primary--text">ĐĂNG NHẬP</div>
        </nav>
      </v-flex>
      <v-flex xs12 v-if="!isSigned">
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
            <v-btn class="ml-0 my-0 white--text" color="#0b72ba"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmLogin"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Đăng nhập
            </v-btn>
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
            <!-- <div class="d-inline-block primary--text right" style="cursor: pointer;">
              <p @click="getPassword" >
              Quên mật khẩu?
              </p>
            </div> -->
          </v-flex>
          <v-flex class="py-2" xs12 style="
            display: none;
            align-items: center;
            background: #dedede;
            justify-content: center;
          ">
            <img :src="chapchablob" alt="capcha" style="border-radius: 5px;">
            <v-btn flat icon v-on:click.native="makeImageCap">
              <v-icon color="primary" size="32">refresh</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 class="mt-2 text-xs-center" style="display: none;">
            <v-text-field
              box
              v-model="j_captcha_response"
              placeholder="Nhập captcha"
            ></v-text-field>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
    <div class="footer_login">
      <p class="site-name">&#169; Trung tâm Công nghệ thông tin - Bộ GTVT</p> 
      <p class="info-wrapper"> 
        <span>Địa chỉ: 80 Trần Hưng Đạo, Hoàn kiếm, Hà Nội</span> <br>
        <span>Hotline: 1900 0318 - Điện thoại: (024) 3.822.2979 - Fax: (024) 3.822.1066</span> <br>
        <span>Email: bophanhotro@mt.gov.vn</span> 
      </p> 
    </div>
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
        vm.loading = true
        vm.$store.dispatch('goToDangNhap', filter).then(function() {
          vm.loading = false
        }).catch(function() {
          vm.loading = false
        })
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
    goBack () {
      window.history.back()
    }
  }
}
</script>
