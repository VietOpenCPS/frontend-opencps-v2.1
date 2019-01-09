import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'
import toastr from 'toastr'
import $ from 'jquery'
import router from '@/router'

Vue.use(toastr)
Vue.use(Vuex)
toastr.options = {
  'timeOut': '5000'
}
export const store = new Vuex.Store({
  state: {
    initData: {},
    loading: false,
    endPoint: '/o/rest/v2',
    // endPoint: 'http://127.0.0.1:8081/api'
  },
  actions: {
    loadInitResource ({commit, state}) {
      return new Promise((resolve, reject) => {
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          state.initData['groupId'] = window.themeDisplay.getScopeGroupId()
          state.initData['user'] = {
            'userName': window.themeDisplay.getUserName(),
            'userEmail': '',
            'userId': window.themeDisplay.getUserId()
          }
        } else {
          state.initData['groupId'] = 0
          state.initData['user'] = {
            'userName': '',
            'userEmail': '',
            'userId': 20103
          }
        }
        resolve(state.initData)
      })
    },
    getDictCollections ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.endPoint + '/dictcollections', param).then(function (response) {
          let data = response.data
          if (data) {
            resolve(data.data)
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject([])
        })
      })
    },
    exportData ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: filter
        }
        axios.get(state.endPoint + '/backupDatas/exportDB', param).then(function (response) {
          let data = response.data
          if (data) {
            resolve(data.data)
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject([])
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setAgencyList (state, payload) {
      state.agencyList = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getAgencyList (state) {
      return state.agencyList
    }
  }
})
