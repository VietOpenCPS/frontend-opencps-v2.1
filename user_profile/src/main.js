import Vue from 'vue'
import './plugins/vuetify'
import './stylus/app.styl'
import './stylus/jexcel.css'
import './stylus/ej2base.css'
import './stylus/ej2upload.css'
import App from './App'
import router from './router'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
import axios from 'axios'

Vue.use(UploaderPlugin)
Vue.use(VueContentPlaceholders)

let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
axios.defaults.headers.common['groupId'] = groupId

Vue.config.productionTip = true

Vue.mixin({
  methods: {
    getScopeGroupId: function () {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        return window.themeDisplay.getScopeGroupId()
      } else {
        return 0
      }
    },
    getAuthToken: function () {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        return window.Liferay.authToken
      } else {
        return ''
      }
    },
    getUserId: function () {
      if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
        return window.themeDisplay.getUserId()
      } else {
        return 0
      }
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

