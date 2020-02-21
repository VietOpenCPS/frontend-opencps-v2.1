import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main.css'
import Vue from 'vue/dist/vue.min.js'
import App from './App_new'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'babel-polyfill'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay ? window.Liferay.authToken : ''

Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.config.productionTip = true

Vue.mixin({
  methods: {
    getOriginality: function () {
      return 3
    }
  },
  created () {
    let vm = this
    vm.$store.commit('setOriginality', 3)
  }
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App)
})
