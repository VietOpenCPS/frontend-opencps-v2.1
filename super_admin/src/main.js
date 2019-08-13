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
let portalURL = (window.themeDisplay !== undefined ) ? window.themeDisplay.getPortalURL().replace('http://', '') : 'localhost:8080'
let token = window.themeDisplay !== undefined ? window.Liferay.authToken : ''
let portalURLSock = portalURL.indexOf(':') > 0 ? portalURL.substr(0, portalURL.indexOf(':')) : portalURL

// let portalUrlSocket = window.themeDisplay.getPortalURL().replace('https://', '').replace('http://', '')
// Vue.use(VueNativeSock, 'ws://' + portalUrlSocket + '/o/v1/socket/web?groupId='+ groupId
//   + '&portalURL=' + portalUrlSocket
//   + '&companyId=' + companyId
//   + '&userId=' + userId
//   + '&userName=' + userName
//   + '&Token=' + token, 
//   {
//     store: store,
//     format: 'json',
//     reconnection: true
//   }
// )

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
        /* vm.$socket.sendObj(
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
        // vm.$socket.sendObj(
        //   {
        //     type: 'api',
        //     cmd: 'get',
        //     respone: 'loginUser',
        //     api: '/o/v1/opencps/users/login',
        //     headers: {
        //       'Token': vm.getAuthToken(),
        //       'groupId': vm.getScopeGroupId(),
        //       'USER_ID': vm.getUserId()
        //     }
        //   }
        // )
        */
       vm.dataSocket = {}
       let dataPost = new URLSearchParams()
       
       let textPost = {
         'type': 'api',
         'cmd': 'get',
         'respone': 'loginUser',
         'api': '/o/v1/opencps/users/login',
         'headers': {
           'Token': vm.getAuthToken(),
           'groupId': vm.getScopeGroupId(),
           'USER_ID': vm.getUserId()
         }
       }
       dataPost = new URLSearchParams();

       dataPost.append('text', JSON.stringify(textPost))
       axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
         let dataObj = response.data
         vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
         if (dataObj.respone === 'loginUser') {
          vm.$store.commit('setloginUser', dataObj['loginUser'])
         }

         dataPost = new URLSearchParams();
         textPost = {
           'type': 'admin',
           'cmd': 'get',
           'responeType': 'menu',
           'code': 'opencps_adminconfig',
           'respone': 'listTableMenu',
           'start': -1,
           'end': -1              
         }
         dataPost.append('text', JSON.stringify(textPost))
         axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
           let dataObj = response.data
           vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
           if (dataObj.respone === 'listTableMenu') {
             vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
           }  
         }).catch(function (error) {
         })
       }).catch(function (error) {
         dataPost = new URLSearchParams();
         textPost = {
           'type': 'admin',
           'cmd': 'get',
           'responeType': 'menu',
           'code': 'opencps_adminconfig',
           'respone': 'listTableMenu',
           'start': -1,
           'end': -1              
         }
         dataPost.append('text', JSON.stringify(textPost))
         axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
           let dataObj = response.data
           vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
           if (dataObj.respone === 'listTableMenu') {
             vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
           }  
         }).catch(function (error) {
         })
       })
      //  
      let dataPost1 = new URLSearchParams()
      let textPost1 = {
        'type': 'admin',
        'cmd': 'get',
        'responeType': 'menu',
        'code': 'opencps_adminconfig',
        'respone': 'listTableMenu',
        'start': -1,
        'end': -1
      }
      dataPost1.append('text', JSON.stringify(textPost1))
      axios.post('/o/rest/v2/socket/web', dataPost1, {}).then(function (response) {
        let dataObj = response.data
        vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
        if (dataObj.respone === 'listTableMenu') {
          vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
        }  
      }).catch(function (error) {
      })
      // 
       if (window.location.href.endsWith('#/')) {
         vm.$router.push('/table/opencps_employee')
       }
      }, 100)
    })
  },
  computed: {
    problem: {
      // getter
      get: function() {
        return this.$store.getters.getproblem
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setproblem', newValue)
      }
    },
    isConnected: {
      // getter
      get: function() {
        return this.$store.getters.getisConnected
      },
      // setter
      set: function(newValue) {
        this.$store.commit('setisConnected', newValue)
      }
    }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      console.log('getisConnected: ', vm.isConnected)
      console.debug(newRoute)
      console.debug(oldRoute)
      vm.problem = true
    }
  },
})

