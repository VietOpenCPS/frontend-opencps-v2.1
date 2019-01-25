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
    // endPointApi: 'http://127.0.0.1:8081/api',
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
        // commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/postal/votings/' + data.className + '/' + data.classPk, param).then(result => {
            if (result.data) {
              resolve(result.data.data)
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
    loadImageEmployee ({commit, state}, data) {
      console.log(data)
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/users' + '/' + data.mappingUser.userId + '/photo', param).then(result => {
            var url = window.URL.createObjectURL(result.data)
            resolve(url)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    loadEmployees ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        // commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/employees', param).then(result => {
            if (result.data) {
              resolve(result.data.data)
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
    getEmployee ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        // commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(support.initData.detailEmployeeApi + '/' + data.employeeId, param).then(result => {
            resolve(result.data)
            // commit('setLoading', false)
          }).catch(xhr => {
            reject(xhr)
            // commit('setLoading', false)
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
          axios.get(state.endPointApi + '/votings/checkpermission', config).then(function (response) {
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
          var params = new URLSearchParams()
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
    }
  },
  mutations: {
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
    }
  }
})
