import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
Vue.config.productionTip = true

// new Vue({
//   render: function (h) { 
//     return h(App) }
// }).$mount('#app_login')

new Vue({
  el: '#app_login',
  components: { App },
  template: '<App/>'
})
