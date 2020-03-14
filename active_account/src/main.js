import Vue from 'vue'
import './plugins/vuetify'
import './stylus/app.styl'
import './stylus/jexcel.css'
import './stylus/ej2base.css'
import './stylus/ej2upload.css'
import 'toastr/build/toastr.css'
import App from './App'
import router from './router'
import { store } from './store'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import 'codemirror/mode/javascript/javascript.js'
import VueContentPlaceholders from 'vue-content-placeholders'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
import axios from 'axios'

Vue.use(UploaderPlugin)
Vue.use(VueContentPlaceholders)


let groupId = window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0
axios.defaults.headers.common['Token'] = window.Liferay !== undefined ? window.Liferay.authToken : ''
axios.defaults.headers.common['groupId'] = groupId

Vue.config.productionTip = true

Vue.use(VueCodemirror, {
  mode: 'text/javascript',
  theme: 'base16-light',
  lineNumbers: true,
  line: true,
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
       if (window.location.href.endsWith('#/')) {
         vm.$router.push('/active-account')
       }
      }, 300)
    })
  }
}).$mount('#app')

