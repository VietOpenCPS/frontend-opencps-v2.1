import Vue from 'vue'
import './plugins/vuetify'
import './stylus/app.styl'
import './stylus/jexcel.css'
import './stylus/ej2base.css'
import './stylus/ej2upload.css'
import App from './App'
import router from './router'
import { store } from './store'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript.js'
import VueNativeSock from 'vue-native-websocket'
import VueContentPlaceholders from 'vue-content-placeholders'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
import axios from 'axios'

Vue.use(UploaderPlugin)
Vue.use(VueContentPlaceholders)

let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0
let companyId = window.themeDisplay !== undefined ? window.themeDisplay.getCompanyId() : 0
let userId = window.themeDisplay !== undefined ? window.themeDisplay.getUserId() : 0
let userName = window.themeDisplay !== undefined ? window.themeDisplay.getUserName() : ''
let portalURL = (window.themeDisplay !== undefined )? window.themeDisplay.getPortalURL().replace('http://', '') : 'localhost:8080'
let token = window.themeDisplay !== undefined ? window.Liferay.authToken : ''
let portalURLSock = portalURL.indexOf(':') > 0 ? portalURL.substr(0, portalURL.indexOf(':')) : portalURL

Vue.use(VueNativeSock, 'ws://' + portalURLSock + ':8080' + '/o/gate/socket/web?groupId='+ groupId
  + '&portalURL=' + portalURL
  + '&companyId=' + companyId
  + '&userId=' + userId
  + '&userName=' + userName
  + '&Token=' + token, 
  {
    store: store,
    format: 'json',
    reconnection: true,
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000,
    maxHttpBufferSize: 30 * 1024 * 1024,
    maxPayload: 30 * 1024 * 1024
  }
)

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
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
  render: h => h(App),
  created() {
    var vm = this
    vm.$nextTick(function() {
      setTimeout(() => {
        vm.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'get',
            responeType: 'menu',
            code: 'opencps_adminconfig',
            respone: 'listTableMenu',
            start: -1,
            end: -1
          }
        )
        vm.$socket.sendObj(
          {
            type: 'api',
            cmd: 'get',
            respone: 'loginUser',
            api: '/o/gate/v2/users/login',
            headers: {
              'Token': vm.getAuthToken(),
              'groupId': vm.getScopeGroupId(),
              'USER_ID': vm.getUserId()
            }
          }
        )
        if (window.location.href.endsWith('#/')) {
          vm.$router.push('/table/opencps_employee')
        }
      }, 10)
    })
  }
})

