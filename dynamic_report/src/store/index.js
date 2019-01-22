import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'
import saveAs from 'file-saver'

Vue.use(Vuex)

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
