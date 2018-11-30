import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: support.initData,
    loading: false,
    index: 0
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
    getAgencyLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
          axios.get('/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              dataReturn.unshift({
                'itemCode': 'all',
                'itemName': 'toàn bộ'
              })
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
              month: filter.month ? filter.month : 0,
              group: filter.group,
              reporting: false,
              agency: filter['agency']
            }
          }
          let requestURL = ''
          if (filter.document === 'REPORT_01') {
            // test local
            // requestURL = 'http://127.0.0.1:8081/api/statistics'
            requestURL = '/o/rest/statistics'
            param.params['fromStatisticDate'] = filter.fromDate
            param.params['toStatisticDate'] = filter.toDate
            axios.get(requestURL, param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                let dataReturn = {
                  data: serializable.data
                }
                resolve(dataReturn)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else {
            // test local
            // requestURL = 'http://127.0.0.1:8081/api/dossiers'
            requestURL = '/o/rest/v2/dossiers'
            param.params['sort'] = 'domainCode'
            if (filter.document === 'REPORT_05') {
              param.params['fromFinishDate'] = filter.fromDate
              param.params['toFinishDate'] = filter.toDate
            } else if (filter.document === 'REPORT_09') {
              param.params['fromReleaseDate'] = filter.fromDate
              param.params['toReleaseDate'] = filter.toDate
            } else if (filter.document === 'REPORT_10') {
              param.params['fromReceiveNotDoneDate'] = filter.fromDate
              param.params['toReceiveNotDoneDate'] = filter.toDate
            } else {
              param.params['fromReceiveDate'] = filter.fromDate
              param.params['toReceiveDate'] = filter.toDate
            }
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
