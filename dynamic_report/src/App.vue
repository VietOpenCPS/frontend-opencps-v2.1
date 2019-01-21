<template>
  <v-app id="app_dynamic_report">
    <div v-if="!isSignedIn" style="
                  position: relative;
                  height: 50px;
              ">
              123123 17777 123 2132131
    </div>
    <div v-else>
  
      <div class="login_wrap_app_panel" style="text-align: right;max-width: 1366px;">
        <v-badge color="red" v-if="notificationCount > 0">
          <span slot="badge">2</span>
          <v-btn icon class="mx-0 my-0">
            <v-icon size="20" color="blue darken-3" class="swing animated" style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;">
              notifications_active
            </v-icon>
          </v-btn>
        </v-badge>
        <v-btn v-else icon class="mx-0 my-0">
          <v-icon size="20" color="blue darken-3" class="swing animated" style="-webkit-animation: swing 0.8s infinite;animation: swing 0.8s infinite;">
            notifications
          </v-icon>
        </v-btn>
        <v-menu offset-y :nudge-bottom="5">
          <v-chip slot="activator">
            <v-avatar v-if="avatarURL !== ''">
              <img :src="avatarURL">
            </v-avatar>
            <v-avatar v-else class="white--text" :style="{background: '#' + colorBG}">
              <span class="white--text">{{ userNameLogin.slice(0, 1).toUpperCase() }}</span>
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
              z-index: 9999;
            ">
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
      })
    },
    methods: {
    }
  }
</script>
