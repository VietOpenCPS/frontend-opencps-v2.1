import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
Vue.use(VueContentPlaceholders)
Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
