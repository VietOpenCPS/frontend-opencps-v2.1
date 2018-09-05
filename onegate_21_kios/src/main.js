import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main.css'
import Vue from 'vue/dist/vue.min.js'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
// import VueTouchKeyboard from 'vue-touch-keyboard'
// import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'babel-polyfill'
// Vue.use(VueTouchKeyboard)
Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.config.productionTip = true

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App)
})
