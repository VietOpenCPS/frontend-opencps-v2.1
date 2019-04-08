<template>
  <div>
    <v-layout class="mt-4" wrap style="max-width:550px;margin: 0 auto">
      <v-flex xs12 v-if="isSigned">
        <v-card class="px-2 py-3" style="border: 1px solid #dddddd;">
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
      <nav v-if="!isSigned" class="toolbar theme--dark primary py-2" data-booted="true">
        <div class="toolbar__content"  style="justify-content: center">
          <h4>ĐĂNG NHẬP HỆ THỐNG</h4>
        </div>
      </nav>
      <v-flex xs12 v-if="!isSigned">
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Địa chỉ email đăng nhập"
              v-model="npmreactlogin_login"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
              @keyup.enter="submitConfirmLogin"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Mật khẩu"
              v-model="npmreactlogin_password"
              :type="'password'"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
              @keyup.enter="submitConfirmLogin"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="text-xs-left">
            <div style="display:inline-block">
              <a :href="getPassword" style="line-height: 30px; font-size: 12px; color: blue; text-decoration: underline;">
              Quên mật khẩu?
              </a>
            </div>
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
          <div class="my-2 text-xs-center">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitConfirmLogin"
            >
              <v-icon>how_to_reg</v-icon>&nbsp;
              Đăng nhập
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
import support from '../../store/support.json'
export default {
  props: [],
  components: {},
  data: () => ({
    npmreactlogin_login: '',
    npmreactlogin_password: '',
    j_captcha_response: '',
    getPassword: '',
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
      vm.getPassword = window.themeDisplay ? window.themeDisplay.getLayoutURL() + '/#/cap-lai-mat-khau' : ''
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
    goBack () {
      window.history.back()
    }
  }
}
</script>
