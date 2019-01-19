<template>
  <v-app id="app_login" style="
          position: absolute;
          width: 100%;
          top: 0;
          background: transparent;
      ">
    <div v-if="drawer" style="position: fixed;width: 100%;height: 100vh;left: 0;top: 0;"></div>
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
  
      <div class="login_wrap_app_panel" style="text-align: right;max-width: 1366px;">
        <v-badge color="red" v-if="notificationCount > 0">
          <span slot="badge">2</span>
          <v-btn @click="showNoti" icon class="mx-0 my-0">
            <v-icon size="20" color="blue darken-3" class="swing animated" style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;">
              notifications_active
            </v-icon>
          </v-btn>
        </v-badge>
        <v-btn @click="showNoti" v-else icon class="mx-0 my-0" style="margin-right: -10px !important">
          <v-icon size="20" color="blue darken-3" class="swing animated" style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;">
            notifications
          </v-icon>
        </v-btn>
        <v-menu offset-y :nudge-bottom="5">
          <v-chip slot="activator" @click="isShowUserMenu = !isShowUserMenu">
            <v-avatar>
              <img :src="avatarURL">
            </v-avatar>
            {{userNameLogin}}
            <v-icon v-if="!isShowUserMenu" size="20" color="blue darken-3" class="swing animated">
              expand_more
            </v-icon>
            <v-icon v-else size="20" color="blue darken-3" class="swing animated">
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
  
      <v-navigation-drawer class="login_drawer" v-model="drawerLogin" fixed right hide-overlay temporary style="
          -webkit-box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 5px 28px 2px rgba(0,0,0,.14), 0 -5px 28px 1px rgba(0,0,0,0);
          box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 5px 28px 2px rgba(0,0,0,.14), 0 -5px 28px 1px rgba(0,0,0,0);
        ">
        <article class="glass down">
          <h1>Pelican</h1>
          <p>Pel"i*can, n. Etym: [F. <em>pélican</em>, L. <em>pelicanus</em>, <em>pelecanus</em>, Gr. <em>paraçu</em>.] [Written also <em>pelecan</em>.]
  
          </p>
          <p>1. (Zoöl.)
  
          </p>
          <p>Defn: Any large webfooted bird of the genus of Pelecanus, of which about a dozen species are known. They have an enormous bill, to the lower edge of which is attached a pouch in which captured fishes are temporarily stored.
  
          </p>
          <p>Note: The American white pelican (<em>Pelecanus erythrorhynchos</em>) and the brown species (<em>P. fuscus</em>) are abundant on the Florida coast in winter, but breed about the lakes in the Rocky Mountains and British America.</p>
        </article>
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
    created() {
      let vm = this
      vm.$nextTick(function() {
        vm.isSignedIn = themeDisplay.isSignedIn()
        vm.userNameLogin = themeDisplay.getUserName()
        if (vm.isSignedIn) {
          let param = {
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/users/' + themeDisplay.getUserId() + '/photo', param).then(function(response) {
            vm.avatarURL = window.URL.createObjectURL(response.data)
          })
        }
      })
    },
    methods: {
      showNoti() {
        let vm = this
        vm.drawerLogin = !vm.drawerLogin
        console.log('do show Noti')
      },
      doRegisterRedirect() {},
      doUserInfo() {},
      doExitApp() {
        window.location.href = '/c/portal/logout'
      }
    }
  }
</script>
