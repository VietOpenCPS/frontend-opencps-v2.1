import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main_bgt.css'
import Vue from 'vue/dist/vue.min.js'
import App from './App_bgt'
import router from './router_bgt'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import $ from 'jquery'
import 'babel-polyfill'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay ? window.Liferay.authToken : ''
Vue.mixin({
  methods: {
    goHome () {
      let vm = this
      vm.$router.push({
        path: '/'
      })
    },
    accept (text) {
      this.hide()
    },
    hide () {
      this.visible = false
    },
    next () {
      let inputs = document.querySelectorAll('input')
      let found = false
      let arr1 = []
      arr1.forEach.call(inputs, (item, i) => {
        if (!found && item === this.input && i < inputs.length - 1) {
          found = true
          this.$nextTick(() => {
            inputs[i + 1].focus()
          })
        }
      })
      if (!found) {
        this.input.blur()
        this.hide()
      }
    }
  }
})
Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.config.productionTip = true

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App)
})
