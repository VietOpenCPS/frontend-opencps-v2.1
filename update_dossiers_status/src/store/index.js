import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// 
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    endPoint: '/o/rest/v2',
    loading: false,
    isMobile: false,
    userLogin: '',
    submissionNote: '',
    thongTinChiTietHoSo: null
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
    
    getDossiers ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          url: '/o/rest/v2/dossiers',
          method: 'get',
          params: {
            dossierNo: filter.dossierNo,
            keyword: filter.keyword,
            order: true,
            top: 'overtime',
            fromReceiveDate: filter.fromReceiveDate ? filter.fromReceiveDate : '',
            toReceiveDate: filter.toReceiveDate ? filter.toReceiveDate : '',
            fromReleaseDate: filter.fromReleaseDate ? filter.fromReleaseDate : '',
            toReleaseDate: filter.toReleaseDate ? filter.toReleaseDate : '',
            service: filter.service ? filter.service : ''
          },
          headers: {
            groupId: filter.groupId ? filter.groupId : window.themeDisplay.getScopeGroupId()
          }
        }
        axios.request(config).then(function (response) {
          let serializable = response.data
          if (serializable) {
            resolve(serializable)
          } else {
            resolve({total: 0})
          }
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    getDetailDossier ({ commit, state }, data) {
      store.dispatch('loadInitResource').then(function (result) {
        let param = {
          headers: {
            groupId: data.groupId ? data.groupId : window.themeDisplay.getScopeGroupId()
          }
        }
        axios.get('/o/rest/v2/dossiers/' + data, param).then(function (response) {
          resolve(response.data)
        }, error => {
          reject(error)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    updateDossierStatus ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let dataPutdossier = new URLSearchParams()
        dataPutdossier.append('dossierIds', data['dossierIds'])
        dataPutdossier.append('actionCode', data['actionCode'])
        dataPutdossier.append('actionNote', data['actionNote'])
        axios.post('/o/rest/v2/dossiers/overdueTime', dataPutdossier, options).then(function () {
          resolve('success')
        }).catch(function () {
          reject('error')
        })
      })
    },
    getServiceInfo ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        let config = {
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId()
          }
        }
        axios.get('/o/rest/v2/onegate/serviceconfigs/processes', config).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(xhr => {
          reject(xhr)
        }) 
      })     
    },
    getServerConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            Token: window.Liferay ? window.Liferay.authToken : ''
          }
        }
        let url = '/o/rest/v2/serverconfigs/' + filter.serverNo
        axios.get(url, param).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          console.log(error)
          reject(error)
        })
      })
    },
    loadDossierActions ({commit, state}, data) {
      let config = {
        headers: {
          groupId: data.groupId ? data.groupId : window.themeDisplay.getScopeGroupId()
        },
        params: {
          stepType: data.stepType
        }
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId + '/sequences'
      return new Promise((resolve, reject) => {
        axios.get(url, config).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    loadDossierLogs ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: data.groupId ? data.groupId : window.themeDisplay.getScopeGroupId()
          },
          params: {
            notificationType: data.type
          }
        }
        let url = '/o/rest/v2/dossiers/' + data.dossierId + '/logs'
        axios.get(url, config).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    setSubmissionNote({commit, state}, data) {
      commit('setSubmissionNote', data)
    },
    setThongTinChiTietHoSo({commit, state}, data) {
      commit('setThongTinChiTietHoSo', data)
    },
    getListHistoryProcessingItems ({commit, state}, data){    
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let listHistoryProcessing = []
          // axios.get('http://127.0.0.1:8080/api/dossiers/dossierlogs/77602/logs', param).then(function (response) {
          axios.get('/o/rest/v2/dossierlogs/' + data.dossierId + '/logs', param).then(function (response) {
            let serializable = response.data
            for (let key in serializable.data) {
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
    loadMermaidgraph ({commit, state}, data) {
      let config = {
        headers: {
          groupId: state.groupId
        },
        params: {
          stepType: data.stepType
        }
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId + '/mermaidgraph'
      return new Promise((resolve, reject) => {
        axios.get(url, config).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setSubmissionNote(state, payload){
      state.submissionNote = payload
    },
    setThongTinChiTietHoSo(state, payload){
      state.thongTinChiTietHoSo = payload
    },
  },
  getters: {
    loading (state) {
      return state.loading
    },
    submissionNote(state) {
      return state.submissionNote
    },
    thongTinChiTietHoSo (state) {
      return state.thongTinChiTietHoSo
    },
  }
})
