import 'idempotent-babel-polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router_dev'
import { store } from './store'

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
  render: function (h) { return h(App) },
}).$mount('#app')
