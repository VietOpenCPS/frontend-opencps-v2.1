<template>
  <v-app id="app_dynamic_report">
    <v-navigation-drawer class="login_drawer" v-model="drawerLogin" fixed right hide-overlay temporary>
      <article class="glass down">
        <v-layout class="px-3" row wrap>
          <v-flex xs6 class="text-center">
            <v-btn block small>
              Thông báo mới
            </v-btn>
          </v-flex>
          <v-flex xs6 class="text-center">
            <v-btn block small>
              Đánh dấu đã đọc
            </v-btn>
          </v-flex>
        </v-layout>
        <div class="layout row wrap pl-3 pr-4" style="display: flex;">
          <div class="flex xs12 mt-3">

            <div>
              <v-icon size="15" color="red accent-4">mail</v-icon>
              Thông báo
            </div>
            <div class="notification_wrap">
            </div>

          </div>
        </div>
      </article>
    </v-navigation-drawer>
    
    <div v-if="!isSignedIn">
              123123 17777 123 2132131 adsfdsfsdfa 111
    </div>
    <div v-else>
      
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
