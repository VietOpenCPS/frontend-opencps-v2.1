import Vue from 'vue/dist/vue.min.js'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: null,
    agencyGroups: null,
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
          // orginURL = 'http://127.0.0.1:8081/api/initdata'
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
    getAgencyReportLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            },
            params: {
              year: filter.year,
              month: filter.month,
              group: filter.group,
              reporting: false,
              agency: filter['agency']
            }
          }
          if (filter['report']) {
            param.params['domain'] = 'total'
          }
          if (filter['report'] === 'linemonth') {
            param.params['domain'] = ''
          }
          axios.get('/o/rest/statistics', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve(null)
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getAgencyGroups ({commit, state}, data) {
      if (state.agencyGroups == null) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get('/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictgroups', param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                let dataReturn = serializable.data
                commit('setAgencyGroups', dataReturn)
                resolve(dataReturn)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.agencyGroups)
        })
      }
    }
    // ----End---------
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setMenuConfigToDo (state, payload) {
      state.trangThaiHoSoList = payload
    },
    setIndex (state, payload) {
      state.index = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setAgencyGroups (state, payload) {
      state.agencyGroups = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    loadingMenuConfigToDo (state) {
      return support.trangThaiHoSoList
    }
  }
})
