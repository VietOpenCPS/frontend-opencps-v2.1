import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: null,
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
    getAgencyLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          axios.get('/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
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
          let requestURL = ''
          if (filter.document === 'REPORT_01') {
            requestURL = '/o/rest/statistics'
            axios.get(requestURL, param).then(function (response) {
              let serializable = response.data
              param.params['domain'] = 'total'
              axios.get(requestURL, param).then(function (responseTotal) {
                let serializableTotal = responseTotal.data
                if (serializableTotal.data) {
                  let dataReturn = {
                    data: serializable.data,
                    dataTotal: serializableTotal.data
                  }
                  resolve(dataReturn)
                } else {
                  resolve(null)
                }
              }).catch(function (error) {
                console.log(error)
                reject(error)
              })
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else {
            requestURL = '/o/rest/v2/dossiers'
            param.params['sort'] = 'domainCode'
            param.params['fromReceiveDate'] = filter.fromDate
            param.params['toReceiveDate'] = filter.toDate
            axios.get(requestURL, param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                let dataReturn = serializable
                resolve(dataReturn)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          }
        })
      })
    },
    doStatisticReportPrint ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          axios({
            method: 'PUT',
            url: '/o/rest/v2_1/statistics/report/' + filter.document,
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob',
            data: filter.data
          }).then(function (response) {
            console.log('serializable', response)
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
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
