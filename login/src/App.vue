<template>
  <v-app id="app_login">
    <div
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
          <button type="button" class="btn-register">Đăng ký</button>
          <button type="submit" class="btn-login">Đăng nhập</button>
        </div>
      </div>
    </div>
    </div>
    <div v-else>
      
      <div style="text-align: right;">
        <v-badge color="red" v-if="notificationCount > 0">
          <span slot="badge">2</span>
          <v-btn @click="showNoti" icon class="mx-0 my-0">
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
        <v-btn @click="showNoti" v-else icon class="mx-0 my-0" style="margin-right: -10px !important">
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
            <v-list-tile>
              <v-list-tile-action>
                <v-icon size="16">person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Thông tin tài khoản</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
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
        v-model="drawerLogin"
        fixed
        right
        hide-overlay
      >
1313213
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
      drawerLogin: false,
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
          })
        }
      })
    },
    methods: {
      showNoti () {
        let vm = this
        vm.drawerLogin = !vm.drawerLogin
        console.log('do show Noti')
      },
      doRegisterRedirect () {
      },
      doUserInfo () {
      },
      doExitApp () {
        window.location.href = '/c/portal/logout'
      }
    }
  }
</script>
