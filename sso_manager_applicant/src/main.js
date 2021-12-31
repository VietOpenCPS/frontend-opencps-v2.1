import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import axios from 'axios'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.use(VueContentPlaceholders)

// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
if (Vue.$cookies.get('TokenKeyCloak')) {
  axios.defaults.headers['Authorization'] = 'Bearer ' + Vue.$cookies.get('TokenKeyCloak')
} else {
  store.dispatch('getTokenKeyCloak', {}).then(rs => {
    Vue.$cookies.set('TokenKeyCloak', rs)
    axios.defaults.headers['Authorization'] = 'Bearer ' + rs
  }).catch(function (rj) {
    Vue.$cookies.set('TokenKeyCloak', rj)
    axios.defaults.headers['Authorization'] = 'Bearer ' + rj
  })
}

axios.interceptors.response.use((response) => {
  return response
}, error => {
  if (error.response.status == 401) {
    store.dispatch('getTokenKeyCloak', {}).then(rs => {
      Vue.$cookies.set('TokenKeyCloak', rs)
      axios.defaults.headers['Authorization'] = 'Bearer ' + rs
    }).catch(function (rj) {
      Vue.$cookies.set('TokenKeyCloak', rj)
      axios.defaults.headers['Authorization'] = 'Bearer ' + rj
    })
  }
  if (error.response) {
    return parseError(error.response.data)
  } else {
    return Promise.reject(error)
  }
})

// axios.interceptors.request.use(function (config) {
//   if (Vue.$cookies.get('TokenKeyCloak')) {
//     config.headers['Authorization'] = 'Bearer ' + Vue.$cookies.get('TokenKeyCloak')
//     return config
//   } else {
//     if (window.getToken) {
//       return
//     }
//     window.getToken = true
//     store.dispatch('getTokenKeyCloak', {}).then(rs => {
//       window.getToken = false
//       Vue.$cookies.set('TokenKeyCloak', rs)
//       config.headers['Authorization'] = 'Bearer ' + rs
//       return config
//     }).catch(function (rj) {
//       window.getToken = false
//       Vue.$cookies.set('TokenKeyCloak', rj)
//       config.headers['Authorization'] = 'Bearer ' + rj
//       return config
//     })
//   }
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });
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
  router,
  store,
  beforeCreate () {
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  render: function (h) { return h(App) }
}).$mount('#app_sso_manager_applicant')

