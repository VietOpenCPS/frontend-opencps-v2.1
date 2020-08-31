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
          <!--  -->
          <v-flex v-if="captcha" class="py-2 text-xs-center captcha" xs12 style="
            align-items: center;
            background: #dedede;
            justify-content: center;
          ">
            <img :src="chapchablob" alt="capcha" style="border-radius: 5px;">
            <v-btn flat icon v-on:click.native="makeImageCap">
              <v-icon color="white" size="26">refresh</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 class="mt-2 text-xs-center" v-if="captcha">
            <v-text-field
              box
              v-model="j_captcha_response"
              placeholder="Nhập captcha"
              :rules="[v => !!v || 'Mã captcha là bắt buộc']"
              required
            ></v-text-field>
          </v-flex>
          <!--  -->
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
            <v-btn v-if="conectDvcqg && !mapping" class="px-2 my-0" color="#913938"
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
    <!--  -->
    <v-dialog v-model="dialogContact" persistent max-width="310">
      <v-card>
        <v-card-title class="headline">
          <span>Cập nhật email sử dụng trên hệ thống</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formContact" v-model="validContact" lazy-validation class="mt-2">
            <v-flex xs12>
              <v-text-field
                box
                placeholder="Nhập email"
                v-model="contactEmail"
                :rules="contactEmail ? [rules.required, rules.email] : [rules.required]"
                required
                prepend-inner-icon="person_outline"
              ></v-text-field>
            </v-flex>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="cancelContact">Bỏ qua</v-btn>
          <v-btn color="green darken-1" flat @click="submitContact">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
export default {
  props: [],
  components: {},
  data: () => ({
    npmreactlogin_login: '',
    npmreactlogin_password: '',
    captcha: false,
    j_captcha_response: '',
    chapchablob: '',
    loading: false,
    valid: false,
    pinCode: '',
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : false,
    conectDvcqg: false,
    dataMapping: '',
    dialogContact: false,
    validContact: false,
    contactEmail: '',
    hasEmail: false,
    rules: {
      required: (value) => !!value || 'Email là bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      }
    },
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
      
      // 
      let searchParams = window.location.href.split("?")[1]
      if (searchParams) {
        let dataDVCQG = decodeURIComponent(String(vm.getSearchParams(searchParams, "data")))
        if (dataDVCQG) {
          let dataObj = JSON.parse(atob(dataDVCQG))
          console.log('dataObj', dataObj)
          vm.dataMapping = dataObj
          if (dataObj && dataObj.hasOwnProperty('userId') && String(dataObj.userId) === '0') {
            vm.mapping = true
            let typeAccount = ''
            let title = ''
            let idType = ''
            if (dataObj.LoaiTaiKhoan === '1') {
              typeAccount = 'Số CMND/ Căn cước '
              idType = dataObj.SoCMND
            } else if (dataObj.LoaiTaiKhoan === '2') {
              typeAccount = 'Mã số thuế '
              idType = dataObj.MaSoThue
            }
            if (typeAccount && (dataObj.SoCMND || dataObj.MaSoThue)) {
              title = typeAccount + idType + ' đã tạo tài khoản trên hệ thống. Vui lòng đăng nhập để đồng bộ với tài khoản Cổng Dịch vụ công Quốc gia.'
            }
            if (title) {
              toastr.options = {
                'positionClass': 'toast-top-center',
                'closeButton': true,
                'timeOut': '30000'
              }
              toastr.info(title)
            }
          }
          if (dataObj && dataObj.hasOwnProperty('state') && dataObj.state === 'create') {
            vm.contactEmail = dataObj['ThuDienTu'] ? dataObj['ThuDienTu'] : ''
            vm.dialogContact = true
          }
        }
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
      if (vm.$refs.form.validate()) {
        vm.$store.dispatch('goToDangNhap', filter).then(function (result) {
          if (vm.mapping && result === 'success') {
            vm.doMappingDvcqg()
          }
          if (result === 'captcha') {
            vm.captcha = true
            vm.makeImageCap()
          }
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
    loginDVCQG () {
      let vm = this
      let filter = {
        state: '',
        redirectURL: window.location.href.split("?")[0]
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
    doMappingDvcqg () {
      let vm = this
      let filter = {
        dataMapping: vm.dataMapping
      }
      vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
      }).catch(function () {
      })
    },
    submitContact () {
      let vm = this
      if (vm.$refs.formContact.validate()) {
        // call cập nhật email user
        let oldEmail = vm.dataMapping['ThuDienTu'] ? vm.dataMapping['ThuDienTu'] : vm.dataMapping['TechID'] + '@dvcqg.gov.vn'
        $.ajax({
          url: '/o/rest/v2/dvcqgsso/changeemail?oldEmail=' + oldEmail + '&newEmail=' + vm.contactEmail + '&techId=' + vm.dataMapping['TechID'],
          data: {},
          type: 'POST',
          async: false,
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Token': window.Liferay.authToken
          },
          success: function (result, status, xhr) {
            vm.dataMapping.state = 'auth'
            vm.doAuth(vm.dataMapping)
            setTimeout(function () {
              let urlDvc = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
              window.location.href = urlDvc
            }, 100)
          },
          error: function (xhr) {
          }
        })
      }
      
    },
    doAuth (dataIn) {
      $.ajaxSetup({
        headers: {
          'groupId': window.themeDisplay.getScopeGroupId(),
          'Token': window.Liferay.authToken,
          'Content-Type': 'application/json'
        }
      });
      $.post('/o/rest/v2/dvcqgsso/auth', JSON.stringify(dataIn))
      .done(function() {				
      })
    },
    getSearchParams (prams, key) {
      let value = ""
      let headers = prams.split("&")
      headers.forEach(function (header) {
        header = header.split("=");
        let keyHeader = header[0];
        if (keyHeader === key) {
          value = header[1]
        }
      });
      return value
    },
    cancelContact () {
      let vm = this
      vm.dialogContact = false
      let urlDvc = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
      window.location.href = urlDvc
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
