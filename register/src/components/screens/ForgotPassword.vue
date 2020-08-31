<template>
  <div>
    <v-layout wrap class="mt-4" style="max-width:550px;margin: 0 auto">
      <nav class="v-toolbar elevation-0 theme--dark primary" data-booted="true" style="justify-content: center">
        <div class="v-toolbar__content" style="height: 40px;justify-content: center;">
          <span class="text-bold">CẤP LẠI MẬT KHẨU</span>
        </div>
      </nav>
      <v-flex xs12>
        <v-form ref="form" v-model="valid" lazy-validation class="px-3 pt-3" style="border: 1px solid #ddd;border-top:0px;background-color: white;border-radius:2px">
          <v-flex xs12>
            <p>Vui lòng nhập email để được cấp lại mật khẩu</p>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              box
              placeholder="Địa chỉ email"
              v-model="confirmCode"
              :rules="[v => !!v || 'Địa chỉ email là bắt buộc']"
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
            <v-btn color="primary"
              @click="goBack"
            >
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogConfirm" persistent max-width="350">
      <v-card>
        <v-card-title class="headline">
          <span >Tài khoản chưa xác thực. Vui lòng thực hiện xác thực.</span>
        </v-card-title>
        <v-card-text class="mx-0 my-0 px-0 py-0">
        </v-card-text>
        <v-card-actions class="my-2">
          <div class="text-xs-center flex">
            <v-btn class="px-3" color="primary" @click="confirmXacThuc">Đồng ý</v-btn>
            <v-btn class="px-3" color="primary" @click="dialogConfirm = false">Bỏ qua</v-btn>
          </div>
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
import axios from 'axios'
export default {
  props: [],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    loading: false,
    valid: false,
    confirmCode: '',
    dialogConfirm: false,
    userIdLogin: ''
  }),
  computed: {
    pathNameConfig () {
      return this.$store.getters.getPathNameConfig
    }
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
    submitConfirmPASS () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let currentParams = vm.$router.history.current.params
      if (vm.$refs.form.validate()) {
        vm.loading = true
        let configs = {
          headers: {
            'Authorization': 'BASIC ' + window.btoa(vm.confirmCode + ":0")
          }
        }
        let dataPostApplicant = new URLSearchParams()
        // dataPostApplicant.append('Authorization', 'BASIC ' + window.btoa(vm.confirmCode + ":0"))
        axios.post('/o/v1/opencps/login', dataPostApplicant, configs).then(function (response) {
          if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha' && response.data !== "lockout" && (response.data === 'pending' || response.data === 'verify')) {
            vm.loading = false
            vm.$refs.captcha.makeImageCap()
            vm.dialogConfirm = true
            let idUser = ''
            if (response.data === 'pending' && response.headers.hasOwnProperty('userid')) {
              idUser = response.headers.userid
            }
            if (response.data === 'verify' && response.headers.hasOwnProperty('applicantid')) {
              idUser = response.headers.applicantid
            }
            vm.userIdLogin = idUser
          } else {
            let filter = {
              confirmCode: vm.confirmCode,
              j_captcha_response: vm.$refs.captcha.j_captcha_response
            }      
            vm.$store.dispatch('confirmForgotPASS', filter).then(function (result) {
              vm.loading = false
              vm.$router.push({
                path: '/xac-thuc-cap-lai-mat-khau?active_user_id=' + vm.confirmCode
              })
            }).catch(function (reject) {
              vm.loading = false
              vm.$refs.captcha.makeImageCap()
            })
          }
        }).catch(function () {
          let filter = {
            confirmCode: vm.confirmCode,
            j_captcha_response: vm.$refs.captcha.j_captcha_response
          }      
          vm.$store.dispatch('confirmForgotPASS', filter).then(function (result) {
            vm.loading = false
            vm.$router.push({
              path: '/xac-thuc-cap-lai-mat-khau?active_user_id=' + vm.confirmCode
            })
          }).catch(function (reject) {
            vm.loading = false
            vm.$refs.captcha.makeImageCap()
          })
        })
      }
    },
    confirmXacThuc () {
      let vm = this
      console.log('vm.userIdLogin234', vm.userIdLogin)
      let url = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
      window.location.href = url + vm.pathNameConfig + 
      "#/xac-thuc-tai-khoan?active_user_id=" + vm.userIdLogin +
        "&redirectURL=" + url
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
