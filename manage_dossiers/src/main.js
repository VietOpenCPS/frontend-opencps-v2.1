import Vue from 'vue'
import App from './App.vue'
import router from './router_dev'
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts'
import axios from 'axios'
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false

let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : ''

axios.defaults.withCredentials = true
axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
axios.defaults.headers.common['groupId'] = groupId

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app_manager_dossiers')
