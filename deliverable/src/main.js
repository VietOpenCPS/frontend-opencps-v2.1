import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import axios from 'axios'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
import VueNativeSock from 'vue-native-websocket'

Vue.use(UploaderPlugin)
Vue.use(VueContentPlaceholders)

let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0
let companyId = window.themeDisplay !== undefined ? window.themeDisplay.getCompanyId() : 0
let userId = window.themeDisplay !== undefined ? window.themeDisplay.getUserId() : 0
let userName = window.themeDisplay !== undefined ? window.themeDisplay.getUserName() : ''
let portalURL = (window.themeDisplay !== undefined )? window.themeDisplay.getPortalURL().replace('http://', '') : 'localhost:8080'
let token = window.themeDisplay !== undefined ? window.Liferay.authToken : ''
let portalURLSock = portalURL.indexOf(':') > 0 ? portalURL.substr(0, portalURL.indexOf(':')) : portalURL

Vue.use(VueNativeSock, 'ws://' + portalURLSock + ':8080/o/v1/socket/web?groupId='+ groupId
  + '&portalURL=' + portalURL
  + '&companyId=' + companyId
  + '&userId=' + userId
  + '&userName=' + userName
  + '&Token=' + token, 
  {
    store: store,
    format: 'json',
    reconnection: true
  }
)

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
        vm.$router.push('/danh-sach-giay-to/0')
      }
      vm.$store.dispatch('getDeliverableTypes')
    })
  },
  render: function (h) { return h(App) }
}).$mount('#app_deliverable')
