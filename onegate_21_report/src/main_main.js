import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main.css'
import Vue from 'vue/dist/vue.js'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'babel-polyfill'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay.authToken

Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.mixin({
  methods: {
    getReportCongDVC: function () {
      return true
    }
  }
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App)
})
