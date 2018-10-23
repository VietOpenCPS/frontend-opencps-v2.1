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
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import VueNativeSock from 'vue-native-websocket'

Vue.use(VueNativeSock, 'ws://localhost:8080/o/socket-gate', 
  {
    store: store,
    format: 'json',
    reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000
  }
)

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
  render: h => h(App)
})
