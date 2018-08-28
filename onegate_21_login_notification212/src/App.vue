<template>
  <v-app id="app_login">
    <div @click="showNoti"
      v-if="drawer"
      style="position: fixed;width: 100%;height: 100vh;left: 0;top: 0;"></div>
    <div v-if="!isSignedIn" style="
        position: relative;
        height: 50px;
    ">
    <div class="login-wrapper">
      <div class="login-input">
        <div class="ico ico-user">
          <input type="text" placeholder="Tài khoản đăng nhập" name="_LoginNotification_login">
        </div>
        <div class="ico ico-pass">
          <input type="text" placeholder="Mật khẩu" name="_LoginNotification_password">
        </div>
      </div>
      <div class="login-input">
        <div style="width: 100%;">
          <a href="/forgotten-password" class="text-hover-blue" style="
              line-height: 30px;
              font-size: 12px;
              color: #005792;
              text-decoration: underline;
              padding-left: 10px;
          ">Quên mật khẩu?</a>
        </div> 
        <div style="
          width: 100%;
          text-align: right;
        ">
          <button type="button" @click="doRegisterRedirect" class="btn-register">Đăng ký</button>
          <button type="submit" class="btn-login">Đăng nhập</button>
        </div>
      </div>
    </div>
    </div>
    <div v-else>
      
      <div style="text-align: right;">
        <v-badge color="red" v-if="notificationCount > 0">
          <span @click="showNoti" slot="badge">2</span>
          <v-btn icon @click="showNoti" class="mx-0 my-0">
            <v-icon
              size="20"
              color="blue darken-3"
              class="swing animated"
              style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;"
            >
              notifications_active
            </v-icon>
          </v-btn>
        </v-badge>
        <v-btn v-else icon @click="showNoti" class="mx-0 my-0" style="margin-right: -10px !important">
            <v-icon
              size="20"
              color="blue darken-3"
              class="swing animated"
              style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;"
            >
              notifications
            </v-icon>
          </v-btn>
        <v-menu offset-y :nudge-bottom="5">
          <v-chip slot="activator" @click="isShowUserMenu = !isShowUserMenu">
            <v-avatar>
              <img :src="avatarURL">
            </v-avatar>
            {{userNameLogin}}
            <v-icon
              v-if="!isShowUserMenu"
              size="20"
              color="blue darken-3"
              class="swing animated"
            >
              expand_more
            </v-icon>
            <v-icon
              v-else
              size="20"
              color="blue darken-3"
              class="swing animated"
            >
              expand_less
            </v-icon>
          </v-chip>
          <v-list>
            <v-list-tile @click="doUserInfo">
              <v-list-tile-action>
                <v-icon size="16">person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Thông tin tài khoản</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="doExitApp">
              <v-list-tile-action>
                <v-icon size="16" color="red darken-3">exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Đăng xuất</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
      
      <v-navigation-drawer
        v-model="drawer"
        temporary
        fixed
        clipped
        right
        hide-overlay
      >
        <v-list class="pa-1">
          <v-list-tile>
            <v-list-tile-content>
              <v-btn-toggle style="width: 100%;" v-model="toggle_exclusive" mandatory>
                <v-btn block flat class="px-0">
                  Hôm nay
                </v-btn>
                <v-btn block flat class="px-0">
                  Thông báo mới
                </v-btn>
              </v-btn-toggle>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
  
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
  
          <!--
          <v-list-tile>

            <v-list-tile-content>
              <v-list-tile-title>Yesterday</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn small icon class="mx-0 my-0" color="grey darken-2">
                <v-icon size="14" style="color: #fff;">clear</v-icon>
              </v-btn>
            </v-list-tile-action>
            
          </v-list-tile>
          <div style="padding: 2px 12px 8px 12px;"><div style="
    border-radius: 7px;
    background: #f3f3f3;
"><div style="
    background: #eaeaea;
    padding: 5px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
">
                  Thong bao moi
                </div> <div style="
    padding: 10px;
">
                  abc
                </div></div></div>

          <div style="padding: 2px 12px 8px 12px;"><div style="
    border-radius: 7px;
    background: #f3f3f3;
"><div style="
    background: #eaeaea;
    padding: 5px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
">
                  Thong bao moi
                </div> <div style="
    padding: 10px;
">
                  abc
                </div></div></div>
            
          <div style="padding: 2px 12px 8px 12px;"><div style="
    border-radius: 7px;
    background: #f3f3f3;
"><div style="
    background: #eaeaea;
    padding: 5px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
">
                  Thong bao moi
                </div> <div style="
    padding: 10px;
">
                  abc
                </div></div></div>

              -->
        </v-list>
      </v-navigation-drawer>
    </div>
  </v-app>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      isSignedIn: false,
      userNameLogin: '',
      drawer: false,
      avatarURL: 'http://via.placeholder.com/350x150',
      notificationCount: 0,
      isShowUserMenu: false,
      toggle_exclusive: 0
    }),
    created () {
      let vm = this
      vm.$nextTick(function () {
        vm.isSignedIn = themeDisplay.isSignedIn()
        vm.userNameLogin = themeDisplay.getUserName()
        if (vm.isSignedIn) {
          let param = {
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/users/' + themeDisplay.getUserId() + '/photo', param).then(function (response) {
            vm.avatarURL = window.URL.createObjectURL(response.data)
          }).catch(function (error) {
            reject(error)
          })
        }
      })
    },
    methods: {
      showNoti () {
        let vm = this
        vm.drawer = !vm.drawer
      },
      doRegisterRedirect () {
        let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        if (redirectURL !== '') {
          window.location.href = redirectURL + '/register'
        } else {
          window.location.href = themeDisplay.getURLHome() + '/register'
        }
      },
      doUserInfo () {
        let redirectURL = themeDisplay.getLayoutRelativeURL().substring(0, themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        window.location.href = redirectURL + '/profile'
      },
      doExitApp () {
        window.location.href = '/c/portal/logout'
      }
    }
  }
</script>

