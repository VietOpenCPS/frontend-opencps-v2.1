import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import 'alpaca/dist/alpaca/bootstrap/alpaca.min.css'
import 'alpaca/dist/alpaca/bootstrap/alpaca.min.js'
import './stylus/main.css'
import './stylus/jquery_comment.css'
import Vue from 'vue/dist/vue.js'
import App from './App_dvc'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'babel-polyfill'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'v-suggestions/dist/v-suggestions.css'

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

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App)
})
