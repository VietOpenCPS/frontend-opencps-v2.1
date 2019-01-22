import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import axios from 'axios'
import { isMobile } from 'mobile-device-detect'

Vue.use(VueContentPlaceholders)

let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0

axios.defaults.withCredentials = true
axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
axios.defaults.headers.common['groupId'] = groupId

Vue.config.productionTip = true

Vue.mixin({
  methods: {
    getScopeGroupId: function () {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        return window.themeDisplay.getScopeGroupId()
      } else {
        return 0
      }
    },
    getAuthToken: function () {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        return window.Liferay.authToken
      } else {
        return ''
      }
    },
    getUserId: function () {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        return window.themeDisplay.getUserId()
      } else {
        return 0
      }
    }
  }
})

new Vue({
  router,
  store,
  created () {
    let vm = this
    vm.$nextTick(function () {
      if (isMobile) {
        vm.$router.push('/m')
        window.$('.mWrapper > header').css('display', 'none')
        window.$('.mWrapper > footer').css('display', 'none')
        window.$('.mWrapper > nav').css('display', 'none')
        window.$('.mWrapper > footer > .container > .left').css('width', '100%')
        window.$('.mWrapper > footer > .container > .right').css('width', '100%')
      } else {
        window.$('.mWrapper > header').css('display', 'block')
        window.$('.mWrapper > footer').css('display', 'block')
        window.$('.mWrapper > nav').css('display', 'block')
      }
    })
  },
  render: function (h) { return h(App) }
}).$mount('#app_voting')
