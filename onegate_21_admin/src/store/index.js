import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
// import router from '@/router'

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: null,
    loading: false,
    loadingTable: false,
    error: null,
    user: null,
    index: 0,
    trangThaiHoSoList: support.trangThaiHoSoList
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise((resolve, reject) => {
          let param = {}
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          axios.get(orginURL + support.renderURLInit, param).then(function (response) {
            let serializable = response.data
            commit('setInitData', serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
            commit('setInitData', {abc: 123})
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    loadHandsOnTableData ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              groupId: state.initData.groupId
            }
          }
          let urlRequest = ''
          if (filter.type === '1') {
            urlRequest = state.initData.getActionConfigs
          } else if (filter.type === '2') {
            urlRequest = state.initData.getMenuConfigs
          } else if (filter.type === '3') {
            urlRequest = state.initData.getStepConfigs
          } else if (filter.type === '4') {
            urlRequest = state.initData.getServiceInfos
          } else if (filter.type === '5') {
            urlRequest = state.initData.getDossierTemplates
          } else if (filter.type === '6') {
            urlRequest = state.initData.getServiceProcesses
          } else if (filter.type === '7') {
            urlRequest = state.initData.getServiceConfigs
          }
          axios.get(urlRequest, param).then(function (response) {
            let serializable = response.data
            serializable['colHeaders'] = support.colHeaders[filter.type]
            serializable['columns'] = support.columns[filter.type]
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    removeData ({commit, state}, dataObj) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let urlRequest = ''
          let idPath = ''
          if (dataObj.type === '1') {
            urlRequest = state.initData.restActionConfigs
            idPath = dataObj.actionConfigId
          } else if (dataObj.type === '2') {
            urlRequest = state.initData.restMenuConfigs
            idPath = dataObj.menuConfigId
          } else if (dataObj.type === '3') {
            urlRequest = state.initData.restStepConfigs
            idPath = dataObj.stepConfigId
          }
          axios({
            method: 'DELETE',
            url: urlRequest + '/' + idPath,
            headers: {
              groupId: state.initData.groupId
            }
          }).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    addOrEditData ({commit, state}, dataObj) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let data = dataObj.newObj
          let urlRequest = ''
          let idPath = ''
          if (data.type === '1') {
            urlRequest = state.initData.restActionConfigs
            idPath = dataObj.oldObj.actionConfigId
          } else if (data.type === '2') {
            urlRequest = state.initData.restMenuConfigs
            idPath = dataObj.oldObj.menuConfigId
          } else if (data.type === '3') {
            urlRequest = state.initData.restStepConfigs
            idPath = dataObj.oldObj.stepConfigId
          }
          if (data.isAdd) {
            axios({
              method: 'POST',
              url: urlRequest,
              headers: {
                groupId: state.initData.groupId
              },
              data: data
            }).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else {
            axios({
              method: 'PUT',
              url: urlRequest + '/' + idPath,
              headers: {
                groupId: state.initData.groupId
              },
              data: data
            }).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          }
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setLoadingTable (state, payload) {
      state.loadingTable = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setIndex (state, payload) {
      state.index = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    loadingTable (state) {
      return state.loadingTable
    },
    error (state) {
      return state.error
    },
    index (state) {
      return state.index
    },
    loadtrangThaiHoSoList (state) {
      return state.trangThaiHoSoList
    },
    loadingInitData (state) {
      return state.initData
    }
  }
})
