import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import axios from 'axios'

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
  created() {
    var vm = this
    vm.$nextTick(function() {
      vm.$store.dispatch('loadInitResource')
      if (window.location.href.endsWith('#/')) {
        let strQuery = ''
        if (window.location.href.includes('/so-theo-doi')) {
          strQuery = '?reportType=register'
        }
        vm.$router.push('/bao-cao/0' + strQuery)
      }
    })
  },
  render: function (h) { return h(App) }
}).$mount('#app_dynamic_report')
