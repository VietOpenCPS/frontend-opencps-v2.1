<template>
  <div>
    <v-layout class="mt-4" wrap style="max-width:550px;margin: 0 auto">
      <nav class="toolbar theme--dark primary py-2" data-booted="true">
        <div class="toolbar__content"  style="justify-content: center">
          <h4>ĐĂNG NHẬP HỆ THỐNG</h4>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Tài khoản đăng nhập"
              v-model="npmreactlogin_login"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
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
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <img :src="chapchablob" alt="capcha">
            <v-btn flat icon v-on:click.native="makeImageCap">
              <v-icon size="48">refresh</v-icon>
            </v-btn>
          </v-flex>
          <div class="my-2">
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
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import support from '../store/support.json'
export default {
  props: [],
  components: {},
  data: () => ({
    npmreactlogin_login: '',
    npmreactlogin_password: '',
    chapchablob: '',
    loading: false,
    valid: false,
    pinCode: ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
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
      vm.$store.dispatch('makeImageCap').then(function (result) {
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
      vm.$store.dispatch('goToDangNhap', filter)
    }
  }
}
</script>
