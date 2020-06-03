import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App_dvc.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'v-suggestions/dist/v-suggestions.css'
import 'svg-pan-zoom/dist/svg-pan-zoom.min.js'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
Vue.use(VueContentPlaceholders)
Vue.config.productionTip = false

Vue.mixin({
  data: () => ({
    isOffLine: window.themeDisplay ? !window.themeDisplay.isSignedIn() : true
  }),
  methods: {
    getOriginality: function () {
      return 1
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
