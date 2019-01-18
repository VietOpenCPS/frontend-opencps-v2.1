import 'babel-polyfill'
import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main.css'
import './stylus/jquery-comments.css'
import Vue from 'vue'
import App from './App_dvc'
import router from './router_dev'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'v-suggestions/dist/v-suggestions.css'
import 'svg-pan-zoom/dist/svg-pan-zoom.min.js'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.config.productionTip = true

Vue.mixin({
  methods: {
    getOriginality: function () {
      return 1
    }
  }
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) },
}).$mount('#app')
