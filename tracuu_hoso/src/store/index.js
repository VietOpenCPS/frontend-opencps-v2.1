import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import $ from 'jquery'
// 

Vue.use(toastr)
Vue.use(Vuex)
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export const store = new Vuex.Store({
  state: {
    initData: {},
    loading: false,
    user: {
      'role': ''
    },
    endPointApi: '/o/rest/v2',
    dossierDetail: ''
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
        if (state['user'].role === '') {
          store.dispatch('getRoleUser').then(function (result) {
            state['user'].role = result
            commit('setInitData', state.initData)
            resolve(state.initData)
          }).catch(function (error) {
            state['user'].role = ['default']
            commit('setInitData', state.initData)
            resolve(state.initData)
            console.log(error)
          })
        } else {
          commit('setInitData', state.initData)
          resolve(state.initData)
        }
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
          axios.get(state.endPointApi + '/dossiers', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getRoleUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get(state.endPointApi + '/users/login', param).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.length > 0) {
            let roles = []
            for (let key in serializable) {
              if (serializable[key]['role']) {
                roles.push(serializable[key]['role'])
              }
            }
            resolve(roles)
          } else {
            resolve(['default'])
          }
        }).catch(function (error) {
          reject('default')
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
          axios.get(state.endPointApi + '/dossiers/' + filter.dossierId, param).then(function (response) {
            console.log('response', response)
            resolve(response)
          }).catch(function (error) {
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
          axios.get(state.endPointApi + '/dossiers/' + data.dossierId + '/sequences', config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
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
          axios.get(state.endPointApi + '/dossierlogs/' + filter.dossierId + '/logs', param).then(function (response) {
            let serializable = response.data
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
    // voting
    loadDetailDossierMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/dossiers/' + data['referenceUid'])
        dataPost.append('data', '')
        dataPost.append('serverCode', 'SERVER_' + data['govAgencyCode'])
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          resolve(result.data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get(state.endPointApi + '/postal/votings/' + data.className + '/' + data.classPK, param).then(result => {
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
    loadVotingMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadDetailDossierMC', data['dossierDetail']).then(result => {
          let config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'GET')
          dataPost.append('url', '/postal/votings/' + data.className + '/' + result['dossierId'])
          dataPost.append('data', '')
          dataPost.append('serverCode', 'SERVER_' + result['govAgencyCode'])
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result1) {
            if (result1.data) {
              resolve(result1.data.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(xhr => {
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
          axios.post(state.endPointApi + '/postal/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
          })
        })
      })
    },
    submitVotingMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          // api đồng bộ sang một cửa
          let config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          let textPost = {
            className: data.className,
            classPk: data.classPk,
            selected: data.selected
          }
          if (data.className === 'dossier') {
            textPost['votingCode'] = data.votingCode ? data.votingCode : ''
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'POST')
          dataPost.append('url', '/postal/votings/' + data.votingId + '/results')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', data.serverCode)
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
            resolve(result.data)
          }).catch(xhr => {
            toastr.clear()
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
          })
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setDossierDetail (state, payload) {
      state.dossierDetail = payload
    },
  },
  getters: {
    loading (state) {
      return state.loading
    },
    getDetailDossier (state) {
      return state.dossierDetail
    }
  }
})
