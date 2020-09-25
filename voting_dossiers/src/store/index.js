import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
// 
Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    loading: false,
    index: 0,
    endPointApi: '/o/rest/v2',
    isMobile: false
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
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          if (!data.isDvc) {
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
              commit('setLoading', false)
            }).catch(xhr => {
              reject(xhr)
              commit('setLoading', false)
            })
          } else {
            let config = {
              headers: {
                'groupId': window.themeDisplay.getScopeGroupId()
              }
            }
            let textPost = {
            }
            let dataPost = new URLSearchParams()
            dataPost.append('method', 'GET')
            dataPost.append('url', '/postal/votings/' + data.className + '/' + data.classPk)
            dataPost.append('data', JSON.stringify(textPost))
            dataPost.append('serverCode', data.serverCode)
            axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
              if (result.data) {
                resolve(result.data.data)
              } else {
                resolve([])
              }
            }).catch(xhr => {
              reject(xhr)
            })
          }
        })
      })
    },

    loadGovAgencys ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(support.initData.dictcollectionsApi + '/GOVERNMENT_AGENCY' + '/dictitems', param).then(result => {
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
    loadEmployees ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(support.initData.employeeApi + '/' + data.itemCode, param).then(result => {
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
    getEmployee ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(support.initData.detailEmployeeApi + '/' + data.employeeId, param).then(result => {
            resolve(result.data)
            commit('setLoading', false)
          }).catch(xhr => {
            reject(xhr)
            commit('setLoading', false)
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
          // test local
          axios.get('/o/rest/v2/votings/checkpermission', config).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/votings/checkpermission', config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    submitVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let params = new URLSearchParams()
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          if (data.comment) {
            params.append('comment', data.comment)
          }
          params.append('selected', data.selected)
          params.append('className', data.className)
          params.append('classPk', data.classPk)
          axios.post(state.endPointApi + '/postal/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            reject(xhr)
          })
        })
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
              start: 0,
              end: 1,
              dossierNo: filter.dossierNo ? filter.dossierNo : ''
            }
          }
          axios.get(state.endPointApi + '/dossiers', param).then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              resolve(serializable.data)
            } else {
              reject(response)
            }
            
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    loadingDataHoSoFromDvcToMc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              'groupId': window.themeDisplay.getScopeGroupId()
            }
          }
          let textPost = {
            start: 0,
            end: 1,
            dossierNo: filter.dossierNo ? filter.dossierNo : ''
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'GET')
          dataPost.append('url', '/dossiers')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', filter.serverCode)
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (response) {
            let serializable = response.data.data[0]
            resolve(serializable)
          }).catch(xhr => {
            reject(xhr)
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
            resolve(response)
          }).catch(function (error) {
            console.log('error', error)
            reject(error)
          })
          
        })
      })
    },
  },
  mutations: {
    setIndex (state, payload) {
      state.index = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setIsMobile (state, payload) {
      state.isMobile = payload
    },
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getIsMobile (state) {
      return state.isMobile
    },
  }
})
