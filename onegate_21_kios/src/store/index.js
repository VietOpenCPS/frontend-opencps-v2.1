import Vue from 'vue/dist/vue.min.js'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)
Vue.use(toastr)
export const store = new Vuex.Store({
  state: {
    initData: null,
    totalEmployee: 0,
    workingUnitSelect: null,
    loading: false,
    index: 0
  },
  actions: {
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise((resolve, reject) => {
          let param = {}
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          /* test local */
          orginURL = 'http://127.0.0.1:8081/api/initdata'
          axios.get(orginURL + support.renderURLInit, param).then(function (response) {
            let serializable = response.data
            commit('setInitData', serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    loadingDataHoSo ({commit, state}, filter) {
      commit('setLoadingTable', true)
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 15 - 15,
              end: filter.page * 15,
              dossierNo: filter.dossierNo ? filter.dossierNo : '',
              applicantName: filter.applicantName ? filter.applicantName : '',
              applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : ''
            }
          }
          axios.get(filter.queryParams, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDomainLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          // axios.get('/o/rest/v2/serviceinfos/statistics/domains', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getGovAgency ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let paramGetGovAgency = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            sort: 'sibling'
          }
        }
        axios.get(state.initData.regionApi + '/GOVERMENT_AGENCY/dictitems', paramGetGovAgency).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    getLevelLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          // axios.get('/o/rest/v2/serviceinfos/statistics/levels', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/levels', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    }
  },
  mutations: {
    setIndex (state, payload) {
      state.index = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setTotalEmployee (state, payload) {
      state.totalEmployee = payload
    },
    setWorkingUnitSelect (state, payload) {
      state.workingUnitSelect = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getTotalEmployee (state) {
      return state.totalEmployee
    },
    getWorkingUnitSelect (state) {
      return state.workingUnitSelect
    }
  }
})
