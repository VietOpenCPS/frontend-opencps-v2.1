import Vue from 'vue/dist/vue.min.js'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)
Vue.use(toastr)
export const store = new Vuex.Store({
  state: {
    initData: support.initData,
    endPoint: '/o/rest/v2',
    // endPoint: 'http://127.0.0.1:8081/api',
    originality: '',
    groupIdSite: '',
    totalEmployee: 0,
    filterDossierKey: {
      dossierNo: '',
      applicantIdNo: '',
      secretCode: ''
    },
    workingUnitSelect: null,
    employeeSelected: '',
    loading: false,
    dossierDetail: {},
    index: 0,
    activeDetailService: false,
    applicantIdNoSearch: '',
    dossierNoSearch: '',
    fullScreen: false
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
          axios.get(state.endPoint + '/dossiers', param).then(function (response) {
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
              groupId: filter['groupId'] ? filter['groupId'] : state.initData.groupId
            },
            params: {
              step: '300,310,400',
              fromReleaseDate: filter.fromDate ? filter.fromDate : '',
              toReleaseDate: filter.toDate ? filter.toDate : '',
              keyword: filter.keyword ? filter.keyword : ''
            }
          }
          // test local
          // axios.get(state.endPoint + '/dossiers/publish/searchDossiers', param).then(function (response) {
          axios.get(state.endPoint + '/dossiers', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject([])
          })
        })
      })
    },
    loadingDataHoSoTN ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: filter['groupId'] ? filter['groupId'] : state.initData.groupId
            },
            params: {
              fromReceiveDate: filter.fromDate,
              toReceiveDate: filter.toDate,
              keyword: filter.keyword ? filter.keyword : ''
            }
          }
          axios.get(state.endPoint + '/dossiers', param).then(function (response) {
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
          axios.get(state.endPoint + '/serviceinfos/statistics/domains', param).then(function (response) {
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
          axios.get(state.endPoint + '/serviceconfigs/pubish/' + filter.administrationCode + '/domains', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
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
          axios.get(state.endPoint + '/serviceinfos/statistics/agencies', param).then(function (response) {
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
    agencies ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let groupIdCurrent = ''
          let groupIdArr = []
          let groupIds = state.groupIdSite
          if (groupIds) {
            groupIdArr = groupIds.split(',')
          }
          if (groupIdArr.length === 0) {
            groupIdCurrent = window.themeDisplay.getScopeGroupId()
          }
          if (groupIdArr.length === 1) {
            groupIdCurrent = groupIdArr[0]
          }
          let filter = {
            groupId: groupIdCurrent
          }
          store.dispatch('getGovAgency', filter).then(function (result) {
            console.log('agencies', result)
            resolve(result)
          }).catch(reject => {
            resolve([])
          })
        })
      })
    },
    getGovAgencyDictItem ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
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
          axios.get(state.endPoint + '/serviceinfos/statistics/levels', param).then(function (response) {
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
          axios.get(state.endPoint + '/serviceinfos', param).then(function (response) {
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
          axios.get(state.endPoint + '/serviceinfos/' + filter.index, param).then(function (response) {
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
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
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
              groupId: state.initData.groupId,
              secretCode: filter.password
            },
            params: {}
          }
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            console.log('response', response)
            resolve(response)
          }).catch(function (error) {
            console.log('error', error)
            reject(error)
          })
        })
      })
    },
    getDetailDossierQR ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              secretKey: filter.secretKey
            }
          }
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
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
          axios.get(state.endPoint + '/dossierlogs/' + filter.dossierId + '/logs', param).then(function (response) {
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
    loadDossierActions ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dossiers/' + data.dossierId + '/sequences', config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
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
          axios.get(state.endPoint + '/dossiertemplates/' + filter.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.dossierParts)
          }).catch(function (reject) {
            console.log(reject)
          })
        })
      })
    },
    loadEmployees ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        // commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.start,
              end: filter.end
            }
          }
          axios.get(state.endPoint + '/employees/publish/' + filter.agencyCode, param).then(result => {
            if (result.data) {
              let employees = result.data.data
              if (employees && employees.length > 0) {
                for (let key in employees) {
                  employees[key].imgSrc = ''
                  employees[key].score = 0
                  employees[key].totalVoting = 0
                }
              }
              let dataOutput = [result.data.total, employees]
              resolve(dataOutput)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    loadEmployeesMotcua ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        // commit('setLoading', true)
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.start,
              end: filter.end
            }
          }
          axios.get(state.endPointApi + '/employees', param).then(result => {
            if (result.data) {
              let employees = result.data.data
              if (employees && employees.length > 0) {
                for (let key in employees) {
                  employees[key].imgSrc = ''
                  employees[key].score = 0
                  employees[key].totalVoting = 0
                }
              }
              let dataOutput = [result.data.total, employees]
              resolve(dataOutput)
            } else {
              resolve([])
            }
            // commit('setLoading', false)
          }).catch(xhr => {
            reject(xhr)
            // commit('setLoading', false)
          })
        })
      })
    },
    // voting
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/postal/votings/' + data.className + '/' + data.classPk, param).then(result => {
            if (result.data) {
              resolve(result.data.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
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
          params.append('className', data.className)
          params.append('classPk', data.classPk)
          params.append('selected', data.selected)
          if (data.className === 'dossier') {
            params.append('votingCode', data.votingCode ? data.votingCode : '')
          }
          // test local
          // axios.post('http://127.0.0.1:8081/api/votings/' + data.votingId, params, config).then(result => {
          axios.post(state.endPoint + '/postal/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            toastr.clear()
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
          })
        })
      })
    },
    checkPermisionVoting ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          const config = {
            headers: {
              'groupId': state.initData.groupId
            },
            params: {
              applicantIdNo: filter.applicantIdNo,
              dossierNo: filter.dossierNo
            }
          }
          axios.get(state.endPoint + '/votings/checkpermission', config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
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
          axios.get(state.endPoint + '/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
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
          axios.get(state.endPoint + '/employees/publish/' + filter.workingunit, configs).then(function (response) {
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
    setEmployeeSelected (state, payload) {
      state.employeeSelected = payload
    },
    setTotalEmployee (state, payload) {
      state.totalEmployee = payload
    },
    setWorkingUnitSelect (state, payload) {
      state.workingUnitSelect = payload
    },
    setActiveDetailService (state, payload) {
      state.activeDetailService = payload
    },
    setActiveDetailDossier (state, payload) {
      state.activeDetailDossier = payload
    },
    setApplicantIdNoSearch (state, payload) {
      state.applicantIdNoSearch = payload
    },
    setDossierNoSearch (state, payload) {
      state.dossierNoSearch = payload
    },
    setFullScreen (state, payload) {
      state.fullScreen = payload
    },
    setOriginality (state, payload) {
      state.originality = payload
    },
    setGroupid (state, payload) {
      state.groupIdSite = payload
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
    },
    getApplicantIdNoSearch (state) {
      return state.applicantIdNoSearch
    },
    getDossierNoSearch (state) {
      return state.dossierNoSearch
    },
    getFullScreen (state) {
      return state.fullScreen
    },
    getOriginality (state) {
      return state.originality
    },
    employeeSelected (state) {
      return state.employeeSelected
    },
    getGroupid (state, payload) {
      return state.groupIdSite
    }
  }
})
