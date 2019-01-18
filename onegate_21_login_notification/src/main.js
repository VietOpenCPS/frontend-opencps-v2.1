import 'vuetify/dist/vuetify.min.css'
import './stylus/main.css'
import Vue from 'vue/dist/vue.js'
import App from './App'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#app_login',
  render: h => h(App)
})
