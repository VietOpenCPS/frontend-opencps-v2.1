<template>
  <div>
    <v-dialog class="my-0" v-model="dialog_loginDVCQG" persistent max-width="1200px" style="width:100%;max-height: 100%;">
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
    <!--  -->
    <v-dialog v-model="dialogLogin" persistent max-width="550">
      <v-card class="px-0">
        <v-card-text class="px-0 py-0">
          <v-flex v-if="!isSigned" xs12>
            <nav class="toolbar theme--dark primary py-2" data-booted="true">
              <div class="toolbar__content"  style="justify-content: center">
                <h3 class="white--text">ĐĂNG NHẬP</h3>
              </div>
            </nav>
            <v-flex xs12 class="px-2 pb-2" style="border: 1px solid #dddddd;">
              <v-form ref="form" v-model="valid" lazy-validation class="mt-3">
                <v-flex xs12>
                  <v-text-field
                    box
                    placeholder="Email đăng nhập"
                    v-model="userName"
                    :rules="[v => !!v || 'Email đăng nhập là bắt buộc']"
                    required
                    prepend-inner-icon="person_outline"
                    @keyup.enter="submitConfirmLogin"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="">
                  <v-text-field
                    box
                    placeholder="Mật khẩu"
                    v-model="passWord"
                    :type="'password'"
                    :rules="[v => !!v || 'Mật khẩu là bắt buộc']"
                    required
                    prepend-inner-icon="vpn_key"
                    @keyup.enter="submitConfirmLogin"
                  ></v-text-field>
                </v-flex>
                <v-layout wrap class="ml-2">
                  <v-flex @click="getPassword" style="font-size: 12px;cursor: pointer;padding:7px">
                    <div class="primary--text right" >
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
                    @click="register"
                  >
                    <v-icon>create</v-icon>&nbsp;
                    Đăng ký
                  </v-btn>
                </v-flex>
                
              </v-form>
            </v-flex>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import support from '../../store/support.json'
import toastr from 'toastr'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: [],
  components: {
  },
  data: () => ({
    dialog_loginDVCQG: false,
    dialogLogin: false,
    tempDVCQG: '',
    configUrl: '',
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
    userName: '',
    passWord: '',
    loadingLogin: false,
    valid: false
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
      try {
        vm.configUrl = configSso 
      } catch (error) {
      }
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let query = vm.$router.history.current.query
        window.callback_dvcqg = vm.callback_dvcqg
        if (!vm.isSigned) {
          vm.checkVNConect()
        }
      })
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  mounted () {
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    }
  },
  methods: {
    checkVNConect () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let filter = {
        state: 'auth'
      }
      vm.$store.dispatch('getVNConect', filter).then(function (result) {
        if (result) {
          vm.dialog_loginDVCQG = true
          setTimeout(function () {
            vm.tempDVCQG = result
          }, 200)
        }
      }).catch(function () {
      })
    },
    callback_dvcqg (data) {
      let vm = this
      let current = vm.$router.history.current
      if (String(data['userId']) !== '0') {
        let url = window.themeDisplay.getURLHome()
        setTimeout(() => {
          window.location.href = url
        }, 300)
        vm.dialog_loginDVCQG = false
      } else {
        vm.dialog_loginDVCQG = false
        vm.dialogLogin = true
      }
    },
    submitConfirmLogin () {
      let vm = this
      let current = vm.$router.history.current
      let filter = {
        npmreactlogin_login: vm.userName,
        npmreactlogin_password: vm.passWord
      }
      if (vm.userName && vm.passWord) {
        vm.loadingLogin = true
        vm.$store.dispatch('goToDangNhap', filter).then(function(result) {
          vm.loadingLogin = false
          if (result === 'success') {
            vm.dialogLogin = false
            let url = window.themeDisplay.getURLHome()
            setTimeout(() => {
              window.location.href = url
            }, 300)
          }          
        }).catch(function(){
          vm.loadingLogin = false
        })
      }
    },
    register () {
      let vm = this
      window.location.href = vm.configUrl.hasOwnProperty('registerUrl') ? vm.configUrl.hasOwnProperty('registerUrl') : window.themeDisplay.getPortalURL() + '/web/cong-dich-vu-cong/register'
    },
    getPassword () {
      let vm = this
      window.location.href = vm.configUrl.hasOwnProperty('registerUrl') ? vm.configUrl.hasOwnProperty('registerUrl') + '/#/cap-lai-mat-khau' : window.themeDisplay.getPortalURL() + '/web/cong-dich-vu-cong/register/#/cap-lai-mat-khau'
    },
  }
}
</script>

