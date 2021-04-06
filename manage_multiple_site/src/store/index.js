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
    getServiceAdminisTration ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          params: {
          }
        }
        axios.get('/o/rest/v2/dictcollections/REPORT_GROUP/dictgroups', param).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(function (error) {
          console.log(error)
          reject(error)
        })  
      })     
    },
    getAgencys ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          params: {
          }
        }
        if (data.parent) {
          param.params = {
            parent: data.parent
          }
        }
        console.log('data', data)
        axios.get('/o/rest/v2/dictcollections/REPORT_GROUP/dictgroups/' + data.administration + '/dictitems', param).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(function (error) {
          console.log(error)
          reject(error)
        })
      })     
    },
    getAgencysFromParent ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        let param = {
          headers: {
            groupId: data.hasOwnProperty('groupIdTrungTam') ? data.groupIdTrungTam :  window.themeDisplay.getScopeGroupId()
          },
          params: {
          }
        }
        if (data.parent) {
          param.params = {
            parent: data.parent
          }
        }
        console.log('data', data)
        axios.get('/o/rest/v2/dictcollections/REPORT_GROUP/dictitems', param).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(function (error) {
          console.log(error)
          reject(error)
        })
      })     
    },
    getDomains ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        let config = {
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId()
          }
        }
        let textPost = {
          agency: data.agency ? data.agency : ''
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/serviceinfos/statistics/domains')
        dataPost.append('data', JSON.stringify(textPost))
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(xhr => {
          reject(xhr)
        })   
      })     
    },
    getAgencysFromDict ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        let config = {
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId()
          }
        }
        let textPost = {
          sort: 'sibling'
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/dictcollections/SERVICE_ADMINISTRATION/dictitems')
        dataPost.append('data', JSON.stringify(textPost))
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(xhr => {
          reject(xhr)
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
        let textPost = {
          administration: data.agency ? data.agency : '',
          domain: data.domain ? data.domain : ''
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/serviceinfos')
        dataPost.append('data', JSON.stringify(textPost))
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }).catch(xhr => {
          reject(xhr)
        }) 
      })     
    },
    getDictcollections ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: 'o/rest/v2/dictcollections/REPORT_GROUP/dictgroups/' + filter.groupCode +'/dictitems',
            method: 'get',
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          axios.request(config).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getDossiers ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          agency: filter.agency,
          domain: filter.domain,
          service: filter.service,
          dossierNo: filter.dossierNo,
          order: true,
          start: filter.start,
          end: filter.end,
          fromReceiveDate: filter.fromReceiveDate ? filter.fromReceiveDate : '',
          toReceiveDate: filter.toReceiveDate ? filter.toReceiveDate : '',
          fromDueDate: filter.fromReleaseDate ? filter.fromReleaseDate : '',
          toDueDate: filter.toReleaseDate ? filter.toReleaseDate : '',
        }
        let config = {
          url: '/o/rest/v2/dossiers',
          method: 'get',
          params: {},
          headers: {
            groupId: filter.groupId ? filter.groupId : window.themeDisplay.getScopeGroupId()
          }
        }
        if (filter.status && (filter.status === 'delay' || filter.status === 'overdue' || filter.status === 'coming' || filter.status === 'overtime')) {
          config.params = Object.assign(param, {top: filter.status})
        } else {
          config.params = Object.assign(param, {status: filter.status})
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
    getDossiersFromDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let params = {
          agency: filter.agency,
          domain: filter.domain,
          service: filter.service,
          dossierNo: filter.dossierNo,
          order: true,
          start: filter.start,
          end: filter.end,
          fromReceiveDate: filter.fromReceiveDate ? filter.fromReceiveDate : '',
          toReceiveDate: filter.toReceiveDate ? filter.toReceiveDate : '',
          fromDueDate: filter.fromReleaseDate ? filter.fromReleaseDate : '',
          toDueDate: filter.toReleaseDate ? filter.toReleaseDate : '',
        }
        if (filter.status && (filter.status === 'delay' || filter.status === 'overdue' || filter.status === 'coming' || filter.status === 'overtime')) {
          params = Object.assign(params, {top: filter.status})
        } else {
          params = Object.assign(params, {status: filter.status})
        }
        let dataPost = new URLSearchParams()
        let textPost = params
        dataPost.append('method', 'GET')
        dataPost.append('url', '/dossiers')
        dataPost.append('data', JSON.stringify(textPost))

        axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
          let serializable = response.data
          if (serializable) {
            resolve(serializable)
          } else {
            resolve({total: 0})
          }
        }, error => {
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
    getStatus ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: filter.groupId ? filter.groupId : window.themeDisplay.getScopeGroupId()
          }
        }
        let url = '/o/rest/v2/statistics/dossiers/counting'
        axios.get(url, param).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
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
