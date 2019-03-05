import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'

Vue.component('apexchart', VueApexCharts)
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
    },
    getModules: function () {
      return this.modules
    },
    getAppElement: function () {
      return this.appElement
    }
  },
  data: () => ({
    modules: '',
    appElement: ''
  })
})
let modules = ['1', '2', '3', '12', '13', '21', '23', '31', '32', '123', '231', '321']
for (let key in modules) {
  if (document.getElementById('app_report_charts_' + modules[key])) {
    new Vue({
      router,
      store,
      created() {
        let vm = this
        vm.modules = modules[key]
        vm.appElement = 'app_report_charts_' + modules[key]
        vm.$nextTick(function() {
          if (window.location.href.endsWith('#/')) {
            vm.$router.push('/bao-cao/' + modules[key] + '/0')
          }
        })
      },
      render: function (h) { return h(App) }
    }).$mount('#app_report_charts_' + modules[key])
    break
  }
}

