import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'toastr/build/toastr.css'
// import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.min.css'
import 'v-suggestions/dist/v-suggestions.css'
import 'svg-pan-zoom/dist/svg-pan-zoom.min.js'
import axios from 'axios'

axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
Vue.use(VueContentPlaceholders)
Vue.config.productionTip = false

Vue.mixin({
  methods: {
    getOriginality: function () {
      return 3
    }
  }
})

new Vue({
  router,
  store,
  created () {
      axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId()).then(function(response) {
        let userData = response.data
        vm.$store.commit('setUserLogin', userData)
        if (userData.hasOwnProperty('className') && userData.className === 'org.opencps.usermgt.model.Employee') {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          axios.get('/o/rest/v2/employees/byGroupId', param).then(function(response1) {
            let employeeLogin = response1.data
            vm.$store.commit('setEmployeeLogin', employeeLogin)
            console.log('setEmployeeLogin', vm.$store.getters.getEmployeeLogin)
          })
        }
      })
      .catch(function(error) {
      })
  },
  beforeCreate () {
    var vm = this
    vm.$store.dispatch('loadInitResource')
  },
  render: function (h) { return h(App) }
}).$mount('#app')
