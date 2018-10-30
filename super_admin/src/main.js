import Vue from 'vue'
import './plugins/vuetify'
import './stylus/app.styl'
import './stylus/jexcel.css'
import App from './App'
import router from './router'
import { store } from './store'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript.js'
import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-vue-inputs/styles/material.css'
import VueNativeSock from 'vue-native-websocket'
import VueContentPlaceholders from 'vue-content-placeholders'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
import axios from 'axios'

Vue.use(UploaderPlugin)
Vue.use(VueContentPlaceholders)

let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0
let portalURL = window.themeDisplay !== undefined ? window.themeDisplay.getPortalURL() : 'localhost:8080'
let token = window.themeDisplay !== undefined ? window.Liferay.authToken : ''

Vue.use(VueNativeSock, 'ws://' + portalURL.replace('http://', '') + '/o/socket-gate?groupId='+ groupId + '&portalURL=' + portalURL + '&Token=' + token, 
  {
    store: store,
    format: 'json',
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000
  }
)

axios.defaults.headers.common['Token'] = window.Liferay.authToken
axios.defaults.headers.common['groupId'] = groupId

Vue.config.productionTip = true

Vue.use(VueCodemirror, {
  mode: 'text/javascript',
  theme: 'base16-light',
  lineNumbers: true,
  line: true,
})

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
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

