import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import './stylus/main.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#001f4d',
    secondary: '#424242',
    accent: '#001f4d',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  customProperties: true,
  iconfont: 'md',
})
