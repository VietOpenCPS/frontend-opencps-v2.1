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
    loadingDataHoSo ({commit, state}, filter) {
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
          // test local
          axios.get('/o/rest/v2/dossiers', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/dossiers', param).then(function (response) {
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
          axios.get('/o/rest/v2/serviceinfos/statistics/domains', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/domains', param).then(function (response) {
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
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos/statistics/agencies', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/agencies', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
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
          axios.get('/o/rest/v2/serviceinfos/statistics/levels', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/levels', param).then(function (response) {
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
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              keyword: filter.keyword ? filter.keyword : '',
              level: filter.level ? filter.level : 0,
              domain: filter.domain ? filter.domain : ''
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos/' + filter.index, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/' + filter.index, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDossierDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/dossiers/' + filter.dossierId, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDossierDetailPass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              secretCode: filter.password
            }
          }
          // test local
          axios.get('/o/rest/v2/dossiers/' + filter.dossierId, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/dossiers/' + filter.dossierId, param).then(function (response) {
            // let serializable = response.data
            console.log('response', response)
            resolve(response)
          }).catch(function (error) {
            console.log('error', error)
            reject(error)
          })
        })
      })
    },
    getListHistoryProcessingItems ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          var listHistoryProcessing = []
          // test local
          axios.get('/o/rest/v2/dossiers/' + filter.dossierId + '/logs', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/dossiers/dossierlogs/77602/logs', param).then(function (response) {
            var serializable = response.data
            for (var key in serializable.data) {
              if (serializable.data[key].notificationType === 'PROCESS_TYPE') {
                listHistoryProcessing.push(serializable.data[key])
              }
            }
            resolve(listHistoryProcessing)
          })
          .catch(function (error) {
            reject(error)
          })
        })
      })
    },
    loadDossierTemplates ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/dossiertemplates/' + filter.dossierTemplateNo, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/dossiertemplates/' + filter.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.dossierParts)
          }).catch(function (reject) {
            console.log(reject)
          })
        })
      })
    },
    // action Danh gia can bo
    getWorkingUnit ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/workingunits', param).then(function (response) {
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
          param = {
            // workingunit: filter.workingunit,
            employeeName: filter.employeeName,
            start: filter.start,
            end: filter.end
          }
          let configs = {
            headers: {
              groupId: state.initData.groupId
            },
            params: param
          }
          // test local
          axios.get('/o/rest/v2/employees/publish/' + filter.workingunit, configs).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/employees', configs).then(function (response) {
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
          axios.get('/o/rest/v2/pk5/evaluation/' + filter.employeeId, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/evaluation/' + filter.employeeId, param).then(function (response) {
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
        dataPostEvaluation.append('score', filter.score ? filter.score : '')
        // test local
        axios.post('/o/rest/v2/pk5/evaluation/' + filter.employeeId, dataPostEvaluation, options).then(function (response) {
        // axios.post('http://127.0.0.1:8081/api/evaluation/' + filter.employeeId, dataPostEvaluation, options).then(function (response) {
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
