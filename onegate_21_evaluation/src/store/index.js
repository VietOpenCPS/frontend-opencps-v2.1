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
    getWorkingUnit ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            },
            params: {}
          }
          // test local
          // axios.get('/o/rest/v2/workingunits', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/workingunits', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param
          if (filter.workingunit === 'all') {
            param = {
              start: filter.start,
              end: filter.end
            }
          } else {
            param = {
              workingunit: filter.workingunit,
              start: filter.start,
              end: filter.end
            }
          }
          let configs = {
            headers: {
              groupId: state.initData.groupId
            },
            params: param
          }
          // test local
          // axios.get('/o/rest/v2/employees', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/employees', configs).then(function (response) {
            let serializable = response.data
            commit('setTotalEmployee', serializable.total)
            if (serializable.data) {
              let dataReturn = serializable.data
              for (let key in dataReturn) {
                dataReturn[key]['totalEvaluation'] = 0
                dataReturn[key]['veryGoodCount'] = 0
                dataReturn[key]['perVeryGood'] = 0
                dataReturn[key]['goodCount'] = 0
                dataReturn[key]['perGood'] = 0
                dataReturn[key]['badCount'] = 0
                dataReturn[key]['perBad'] = 0
              }
              resolve(dataReturn)
            } else {
              commit('setTotalEmployee', 0)
              resolve([])
            }
          }).catch(function (error) {
            commit('setTotalEmployee', 0)
            reject(error)
          })
        })
      })
    },
    getEvaluationEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          // axios.get('/o/rest/v2/pk5/evaluation/' + filter.employeeId, param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/evaluation/' + filter.employeeId, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve({})
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    postEvaluationEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        var dataPostEvaluation = new URLSearchParams()
        dataPostEvaluation.append('evaluationName', filter.evaluationName ? filter.evaluationName : '')
        dataPostEvaluation.append('score', filter.score ? filter.score : '')
        // test local
        // axios.post('/o/rest/v2/pk5/evaluation/' + filter.employeeId, dataPostEvaluation, options).then(function (response) {
        axios.post('http://127.0.0.1:8081/api/evaluation/' + filter.employeeId, dataPostEvaluation, options).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
