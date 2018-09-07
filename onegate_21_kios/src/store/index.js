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
    filterDossierKey: {
      dossierNo: '',
      applicantIdNo: '',
      secretCode: ''
    },
    workingUnitSelect: null,
    loading: false,
    dossierDetail: {},
    index: 0,
    activeDetailService: false
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
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10,
              dossierNo: filter.dossierNo ? filter.dossierNo : '',
              applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : ''
            }
          }
          // test local
          // axios.get('/o/rest/v2/dossiers', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/dossiers', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadingDataHoSoKQ ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              step: 300
            }
          }
          // test local
          // axios.get('/o/rest/v2/dossiers/publish/searchDossiers', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/dossiers', param).then(function (response) {
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
    getDomainListsPublic ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10
            }
          }
          // test local
          // axios.get('/o/rest/v2/serviceconfigs/pubish/' + filter.administrationCode + '/domains', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              // let dataReturn = serializable.domains
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
          // axios.get('/o/rest/v2/serviceinfos/statistics/agencies', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/agencies', param).then(function (response) {
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
    },
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10,
              administration: filter.administration ? filter.administration : '',
              keyword: filter.keyword ? filter.keyword : '',
              level: filter.level ? filter.level : 0,
              domain: filter.domain ? filter.domain : ''
            }
          }
          // test local
          // axios.get('/o/rest/v2/serviceinfos', param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/serviceinfos', param).then(function (response) {
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
          // axios.get('/o/rest/v2/serviceinfos/' + filter.index, param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/serviceinfos/' + filter.index, param).then(function (response) {
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
            params: {}
          }
          // test local
          // axios.get('/o/rest/v2/dossiers/' + filter.dossierId, param).then(function (response) {
          axios.get('http://127.0.0.1:8081/api/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            commit('setDossierDetail', serializable)
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
          axios.get('/o/rest/v2/dossierlogs/' + filter.dossierId + '/logs', param).then(function (response) {
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
    // voting
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // axios.get('/o/rest/v2/votings/' + data.className + '/' + data.classPK, param).then(result => {
          axios.get('http://127.0.0.1:8081/api/votings/12/' + data.classPK, param).then(result => {
            if (result.data) {
              resolve(result.data.data)
            } else {
              resolve([])
            }
            commit('setLoading', false)
          }).catch(xhr => {
            reject(xhr)
            commit('setLoading', false)
          })
        })
      })
    },
    submitVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          var params = new URLSearchParams()
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          params.append('selected', data.selected)
          params.append('dossierNo', data.dossierNo)
          params.append('applicantIdNo', data.applicantIdNo)
          axios.post('http://127.0.0.1:8081/api/votings/' + data.votingId, params, config).then(result => {
          // axios.post('/o/rest/v2/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
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
          // axios.get('/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
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
    setDossierDetail (state, payload) {
      state.dossierDetail = payload
    },
    setFilterDossierKey (state, payload) {
      state.filterDossierKey = {
        dossierNo: payload.dossierNo ? payload.dossierNo : '',
        applicantIdNo: payload.applicantIdNo ? payload.applicantIdNo : '',
        secretCode: payload.secretCode ? payload.secretCode : ''
      }
    },
    setTotalEmployee (state, payload) {
      state.totalEmployee = payload
    },
    setWorkingUnitSelect (state, payload) {
      state.workingUnitSelect = payload
    },
    setActiveDetailService (state, payload) {
      state.activeDetailService = payload
    }
  },
  getters: {
    index (state) {
      return state.index
    },
    getTotalEmployee (state) {
      return state.totalEmployee
    },
    getDetailDossier (state) {
      return state.dossierDetail
    },
    getFilterDossierKey (state) {
      return state.filterDossierKey
    },
    getActiveDetailService (state) {
      return state.activeDetailService
    }
  }
})
