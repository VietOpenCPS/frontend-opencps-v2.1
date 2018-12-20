import 'vuetify/dist/vuetify.min.css'
import './stylus/main.css'
import Vue from 'vue/dist/vue.js'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'babel-polyfill'
import axios from 'axios'
import { isMobile } from 'mobile-device-detect'
import $ from 'jquery'

axios.defaults.headers.common['Token'] = window.Liferay ? window.Liferay.authToken : ''
Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    let vm = this
    vm.$nextTick(function () {
      if (isMobile) {
        vm.$router.push('/m')
        $('.mWrapper > header').css('display', 'none')
        $('.mWrapper > footer').css('display', 'none')
        $('.mWrapper > nav').css('display', 'none')
        $('.mWrapper > footer > .container > .left').css('width', '100%')
        $('.mWrapper > footer > .container > .right').css('width', '100%')
      } else {
        $('.mWrapper > header').css('display', 'block')
        $('.mWrapper > footer').css('display', 'block')
        $('.mWrapper > nav').css('display', 'block')
      }
    })
  }
})
