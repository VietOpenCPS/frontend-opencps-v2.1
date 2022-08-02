import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import VueMoment from 'vue-moment'
import Datetime from 'vue-datetime-2'
import eventBus from './event-bus/eventBus'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'

Vue.use(VuejsDialog)
Vue.use(VueMoment)
Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.use(Datetime)

export { eventBus }

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App),
  props: ['type', 'documentTypeCode', 'documentStatusCode'],
  created () {
    var vm = this
    vm.$nextTick(function () {
      if (window.location.href.indexOf('ho-so') <= 0) {
        vm.$store.dispatch('loadInitResource').then(function (result) {
          let user = result.user
          if (user.isKeHoach) {
            router.push('/danh-sach-ho-so/ke_hoach/0/0')
          } else if (user.isThuTuc) {
            router.push('/danh-sach-ho-so/thu_tuc/0/0')
          } else if (user.isLanhDao) {
            router.push('/danh-sach-ho-so/lanh_dao/0/0')
          } else if (user.isVanThu) {
            router.push('/danh-sach-ho-so/van_thu/0/0')
          } else if (user.isKeToan) {
            router.push('/danh-sach-phieu-thanh-toan/ke_toan/0')
          } else {
            router.push('/danh-sach-ho-so/ke_hoach/0/0')
          }
        })
      }
    })
  }
})



// WEBPACK FOOTER //
// ./src/main.js