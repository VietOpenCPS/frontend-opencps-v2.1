import 'idempotent-babel-polyfill'
import Vue from 'vue'
// import Vuejx from './plugins/globalComponents'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'toastr/build/toastr.css'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'v-suggestions/dist/v-suggestions.css'
import 'svg-pan-zoom/dist/svg-pan-zoom.min.js'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
// Vue.use(Vuejx)
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
  router,
  store,
  beforeCreate () {
    var vm = this
    vm.$store.dispatch('loadInitResource')
  },
  render: function (h) { return h(App) }
}).$mount('#app')
