import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import $ from 'jquery'
import saveAs from 'file-saver'
// 

Vue.use(toastr)
Vue.use(Vuex)
toastr.options = {
  'closeButton': true,
  'timeOut': '15000'
}
export const store = new Vuex.Store({
  state: {
    initData: support.initData
  },
  actions: {
  },
  mutations: {
  },
  getters: {
  }
})
