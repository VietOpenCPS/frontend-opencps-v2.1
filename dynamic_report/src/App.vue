<template>
  <v-app id="app_dynamic_report">
    <div v-if="!isSignedIn" style="
                  position: relative;
                  height: 50px;
              ">
              123123
    </div>
    <div v-else>
  
      <v-navigation-drawer class="login_drawer" v-model="drawerLogin" fixed right hide-overlay temporary>
        <article class="glass down">
          <v-layout class="px-3" row wrap style="    display: -webkit-flex;    display: flex;    border-bottom: 1px solid #fff;">
            <v-flex xs6 class="text-center">
              <v-btn block small style="
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
    ">
                Thông báo mới
              </v-btn>
            </v-flex>
            <v-flex xs6 class="text-center">
              <v-btn block small style="
        background: #d0d0d0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    ">
                Đánh dấu đã đọc
              </v-btn>
            </v-flex>
          </v-layout>
          <div class="layout row wrap pl-3 pr-4" style="display: flex;">
            <div class="flex xs12 mt-3" style="
                  background: #ffffff66;
                  border-radius: 8px;
              ">
  
              <div style="
                    padding: 5px 10px;
                    background: #fff0;
                    text-transform: uppercase;
                    font-weight: bold;
                ">
                <v-icon size="15" color="red accent-4">mail</v-icon>
                Thông báo
              </div>
              <div class="notification_wrap" style="
                    padding: 5px 10px;
                    background: #ffffffb3;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                ">
                <template-rendering
                  v-for="(item, index) in testData"
                  v-bind:key="index"
                  :item="item"
                  :layout_view="item['layout_view']"
                  :template_default="templateDefault"
                ></template-rendering>
              </div>
  
            </div>
          </div>
        </article>
      </v-navigation-drawer>
    </div>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import toastr from 'toastr'
  import TemplateRendering from './template_rendering.vue'
  import { templateDefault, testData } from './DefaultTemplate.js'
  toastr.options = {
    'closeButton': true,
    'timeOut': '15000'
  }
  export default {
    components: {
      'template-rendering': TemplateRendering
    },
    data: () => ({
      isSignedIn: false,
      userNameLogin: '',
      drawerLogin: false,
      avatarURL: 'http://via.placeholder.com/350x150',
      notificationCount: 0,
      isShowUserMenu: false,
      toggle_exclusive: 0,
      forgottenURLStr: '',
      userName: '',
      passWord: '',
      userData: {},
      colorBG: '009688',
      templateDefault: templateDefault,
      testData: testData
    }),
    created() {
      let vm = this
      vm.$nextTick(function() {
        vm.isSignedIn = themeDisplay.isSignedIn()
        vm.userNameLogin = themeDisplay.getUserName()
        vm.colorBG = vm.intToRGB(vm.hashCode(vm.userNameLogin))
        let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        if (redirectURL !== '') {
          vm.forgottenURLStr = redirectURL + '/register/#/cap-lai-mat-khau'
        } else {
          vm.forgottenURLStr = themeDisplay.getURLHome() + '/register/#/cap-lai-mat-khau'
        }
        if (vm.isSignedIn) {
          vm.userData = {}
          let param = {
            responseType: 'blob'
          }
          axios.get('/o/v1/opencps/users/' + themeDisplay.getUserId(), param).then(function(response) {
            vm.userData = response.data
            vm.avatarURL = vm.userData['avatar']
            if (vm.avatarURL.includes('img_id=0')) {
              vm.avatarURL = ''
            }
            vm.userNameLogin = vm.userData['userName']
            vm.colorBG = vm.intToRGB(vm.hashCode(vm.userNameLogin))
          }).catch(function(error) {
            vm.avatarURL = ''
          })
        }
      })
    },
    methods: {
      showNoti() {
        let vm = this
        vm.drawerLogin = !vm.drawerLogin
        vm.isShowUserMenu = false
      },
      doRegisterRedirect() {
        let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        if (redirectURL !== '') {
          window.location.href = redirectURL + '/register'
        } else {
          window.location.href = themeDisplay.getURLHome() + '/register'
        }
      },
      doUserInfo() {
        if (themeDisplay !== null && themeDisplay !== undefined) {
          // eslint-disable-next-line
          let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
          window.location.href = redirectURL + '/profile'
        } else {
          window.location.href = '/profile'
        }
      },
      doExitApp() {
        window.location.href = '/c/portal/logout'
      },
      goToDangKyPage() {
        if (themeDisplay !== null && themeDisplay !== undefined) {
          // eslint-disable-next-line
          let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
          if (redirectURL !== '') {
            window.location.href = redirectURL + '/register'
          } else {
            window.location.href = themeDisplay.getURLHome() + '/register'
          }
        } else {
          window.location.href = '/register'
        }
      },
      goToDangNhap() {
        let vm = this
        axios.post('/o/v1/opencps/login', {}, {
          headers: {
            'Authorization': 'BASIC ' + window.btoa(vm.userName + ":" + vm.passWord)
          }
        }).then(function(response) {
          if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha') {
            if (response.data === 'pending') {
              window.location.href = window.themeDisplay.getURLHome() +
                "/register#/xac-thuc-tai-khoan?active_user_id=" + window.themeDisplay.getUserId() +
                "&redirectURL=" + window.themeDisplay.getURLHome()
            } else {
              window.location.href = response.data
            }
          } else if (response.data === 'ok') {
            window.location.href = window.themeDisplay.getURLHome()
          } else if (response.data === 'captcha') {
            let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
            if (redirectURL !== '') {
              window.location.href = redirectURL + '/register#/login'
            } else {
              window.location.href = themeDisplay.getURLHome() + '/register#/login'
            }
          } else {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
          }
        }).catch(function(error) {
          toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
        })
      },
      goToDangNhapPress(e) {
        let vm = this
        if (e.keyCode == 13) {
          axios.post('/o/v1/opencps/login', {}, {
            headers: {
              'Authorization': 'BASIC ' + window.btoa(vm.userName + ":" + vm.passWord)
            }
          }).then(function(response) {
            console.log(response.data)
            if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha') {
              if (response.data === 'pending') {
                window.location.href = window.themeDisplay.getURLHome() +
                  "/register#/xac-thuc-tai-khoan?active_user_id=" + window.themeDisplay.getUserId() +
                  "&redirectURL=" + window.themeDisplay.getURLHome()
              } else {
                window.location.href = response.data
              }
            } else if (response.data === 'ok') {
              window.location.href = window.themeDisplay.getURLHome()
            } else if (response.data === 'captcha') {
              let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
              if (redirectURL !== '') {
                window.location.href = redirectURL + '/register#/login'
              } else {
                window.location.href = themeDisplay.getURLHome() + '/register#/login'
              }
            } else {
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
            }
          }).catch(function(error) {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.");
          })
        }
      },
      hashCode(str) {
        var hash = 0
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        return hash
      },
      intToRGB(i) {
        var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
        return '00000'.substring(0, 6 - c.length) + c
      }
    }
  }
</script>
