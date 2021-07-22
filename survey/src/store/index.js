import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import md5 from 'md5'
// 
Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    loading: false,
    index: 0,
    endPointApi: '/o/rest/v2',
    isMobile: false,
    md5Token: ''
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
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/postal/votings/' + data.className + '/' + data.classPk, param).then(result => {
            if (result.data) {
              let dataVoting = result.data.data
              for (let i = 0; i < dataVoting.length; i++) {
                dataVoting[i]['answerPercent'] = []
                dataVoting[i]['averageScore'] = 0
              }
              resolve(dataVoting)
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
    loadVotingNew ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/postal/vote/' + data.className, param).then(result => {
            if (result.data.data) {
              let items = Array.isArray(result.data.data) ? result.data.data : [result.data.data]
              items = items.filter(function(item) {
                return item.voteModel && item.voteModel['status'] == 1
              })
              let lengthQuestion = items.length
              for (let index = 0; index < lengthQuestion; index++) {
                if (items[index]['lstChoiceDetailModels']) {
                  let listChoice = Array.isArray(items[index]['lstChoiceDetailModels']) ? items[index]['lstChoiceDetailModels'] : [items[index]['lstChoiceDetailModels']]
                  items[index] = Object.assign(items[index]['voteModel'], {choices: listChoice})
                } else {
                  items[index] = Object.assign(items[index]['voteModel'], {choices: []})
                }
              }
              console.log('itemResult', items)
              resolve(items)
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
    loadVotingResult ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/postal/vote/survey/statistic/voteResult?govAgencyCode=' + data.govAgencyCode, param).then(result => {
            if (result.data.data) {
              let items = Array.isArray(result.data.data) ? result.data.data : [result.data.data]
              items = items.filter(function (item) {
                return item.govAgencyCode && item.voteCode
              })
              resolve(items)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    increCounter ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let config = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let params = new URLSearchParams()
          params.append('dossierNo', data.dossierNo)
          axios.post(state.endPointApi + '/postal/vote/survey/voteCount', params, config).then(result => {
            resolve(result)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    getCounter ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let config = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/postal/vote/survey/voteCount', config).then(result => {
            let counters = result && result.data && result.data['counter'] ? result.data['counter'] : 0
            resolve(counters)
          }).catch(xhr => {
            reject(xhr)
          })
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
    submitVotingNew ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let params = new URLSearchParams()
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          params.append('dossierNo', data.dossierNo)
          axios.post(state.endPointApi + '/postal/vote/survey/question/' + data.voteId + '/choice/' + data.voteChoiceId, params, config).then(result => {
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
          store.dispatch('getTokenMd5')
          let param = {
            headers: {
              groupId: state.initData.groupId,
              authenKey: state.md5Token
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
              resolve(serializable.data[0])
            } else {
              reject(response)
            }
            
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getTokenMd5 ({commit, state}) {
      let date = (new Date()).getDate()
      let month = (new Date()).getMonth() + 1
      let year = (new Date()).getFullYear()
      let hours = (new Date()).getHours()
      let minutes = (new Date()).getMinutes()
      let currentDate = (new Date(`${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)).getTime()
      let token = md5('opencps' + currentDate)
      commit('setMd5Token', token)
    }
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
    setMd5Token (state, payload) {
      state.md5Token = payload
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
