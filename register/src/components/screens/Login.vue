<template>
  <div id="login_container">
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
      <v-flex v-if="!isSigned" xs12>
        <nav class="toolbar theme--dark primary py-2" data-booted="true">
          <div class="toolbar__content"  style="justify-content: center">
            <h4>ĐĂNG NHẬP</h4>
          </div>
        </nav>
        <v-flex xs12 v-if="!isSigned" class="px-2 pb-2" style="border: 1px solid #dddddd;">
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
                autofocus
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="">
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
            <v-layout wrap class="ml-2">
              <v-flex style="max-width:150px">
                <v-checkbox
                  class="mt-0"
                  color="primary"
                  v-model="rememberAccount"
                  @change=""
                >
                  <div class="primary--text" slot="label">Ghi nhớ tài khoản</div>
                </v-checkbox>
              </v-flex>
              <v-flex @click="getPassword" style="font-size: 12px;cursor: pointer;max-width:120px;padding:7px">
                <div class="primary--text" >
                  Quên mật khẩu?
                </div>
              </v-flex>
            </v-layout>
            <v-flex xs12 class="text-xs-left text-xs-center">
              <v-btn class="ml-0 mr-1 my-0 white--text" color="#0b72ba"
                :loading="loadingLogin"
                :disabled="loadingLogin"
                @click="submitConfirmLogin"
              >
                <v-icon>how_to_reg</v-icon>&nbsp;
                Đăng nhập
              </v-btn>
              <v-btn class="ml-1 my-0 white--text" color="#0b72ba"
                :loading="loadingLogin"
                :disabled="loadingLogin"
                @click="goBack"
              >
                <v-icon>reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
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
    loadingLogin () {
      return this.$store.getters.loading
    }
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
