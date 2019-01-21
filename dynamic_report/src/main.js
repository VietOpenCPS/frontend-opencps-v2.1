import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router_dynamic_report from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'v-suggestions/dist/v-suggestions.css'
import 'svg-pan-zoom/dist/svg-pan-zoom.min.js'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
Vue.use(VueContentPlaceholders)
Vue.config.productionTip = true

Vue.mixin({
  methods: {
    getOriginality: function () {
      return 3
    }
  }
})

new Vue({
  router_dynamic_report,
  store,
  beforeCreate () {
    var vm = this
    vm.$store.dispatch('loadInitResource')
  },
  render: function (h) { return h(App) }
}).$mount('#app_dynamic_report')
