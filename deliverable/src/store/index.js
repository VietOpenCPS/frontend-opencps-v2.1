import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import AdminConfig from './AdminConfig'
import $ from 'jquery'
import saveAs from 'file-saver'
import DeliverableTypes from './DeliverableTypes'
import Deliverable from './Deliverable'
import DeliverableLogs from './DeliverableLogs'
// 

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    groupId: window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0,
    snackbarerror: false,
    snackbarsocket: false,
    refreshSocket: 0,
    initData: {},
    dataSocket: {},
    pullCounter: 0,
    tocken: '',
    loginUser: [
      {
        'email': '',
        'role': ''
      }
    ],
    user: null,
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
    isConnected: false,
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8081/api',
    getDeliverableTypes: [],
    getContentFile: '',
    getContentFileSimple: []
  },
  actions: {
    loadInitResource ({state}) {
      return new Promise((resolve) => {
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
    downloadServiceFileTemplate ({commit, state}, item) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Content-Type': 'application/octet-stream'
            },
            responseType: 'blob'
          }
          axios.get('/o/v1/opencps/users/upload/download/opencps_deliverable/' + item['className'] + '/' + item['fileAttachId'], param).then(function (data) {
            saveAs(data.data, item['uuid'] + '.' + item['extension'])
            resolve({status: true})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    removeServiceFileTemplate ({commit, state}, item) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/v1/opencps/users/upload/delete/opencps_deliverable/' + item['className'] + '/' + item['classPK'], param).then(function () {
            resolve({status: true})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getAttachFileData ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/v1/opencps/fileattach/' + filter['className'] + '/' + filter['pk'], param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    viewPDF ({commit, state}, id) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/v1/opencps/deliverable/file/' + id, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    viewLogs ({commit, state}, id) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let options = {
            headers: {
              'groupId': state.groupId,
              'Content-Type': 'text/plain',
              'Accept': 'application/json'
            }
          }
          let body = DeliverableLogs.getDeliverableLogs.replace('INPUTBODY', id)
          axios.post('/o/v1/opencps/deliverable', body, options).then(function (response) {
            resolve(response.data['getDeliverableLogs'])
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getDeliverableTypes ({ commit, state }) {
      return new Promise(() => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          }
        }
        let body = DeliverableTypes.getDeliverableTypes
        axios.post('/o/v1/opencps/deliverable', body, options).then(function (response) {
          state.getDeliverableTypes = response.data['getDeliverableTypes']
        }).catch(function () {
          state.getDeliverableTypes = []
          commit('setsnackbarerror', true)
        })
      })
    },
    getContentFile ({ commit, state }, fileEntryId) {
      return new Promise(() => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Accept': 'text/plain'
          }
        }
        axios.get('/o/v1/opencps/fileattach/' + fileEntryId + '/text', options).then(function (response) {
          state.getContentFile = eval('( ' + response.data + ' )')
        }).catch(function () {
          state.getContentFile = ''
        })
      })
    },
    getContentFileSimple ({ commit, state }) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          }
        }
        let body = AdminConfig.getAdminConfig
        axios.post('/o/v1/opencps/adminconfig', body, options).then(function (response) {
          state.getContentFileSimple = eval('( ' + response.data['getAdminConfig']['detailColumns'] + ' )')
          console.log('state.getContentFileSimple', state.getContentFileSimple)
          resolve(state.getContentFileSimple)
        }).catch(function () {
          state.getContentFileSimple = []
          commit('setsnackbarerror', true)
          reject(state.getContentFileSimple)
        })
      })
    },
    getDeliverables ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId
          },
          params: {
            start: filter.page * 15 - 15,
            end: filter.page * 15
          }
        }
        axios.get('/o/v1/opencps/deliverable/' + filter['type'] + '?' + filter['q'], options).then(function (response) {
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    getDeliverableById ({ commit, state }, id) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId
          }
        }
        axios.get('/o/v1/opencps/deliverable/' + id + '/detail', options).then(function (response) {
          if (response.data) {
            response.data.govAgenciesItems = []
            response.data.applicantIdNoItems = []
            resolve(response.data)
          } else {
            resolve({})
          }
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    uploadSingleFile ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let files = window.$('#templateupload')[0].files
        let file = files[0]
        console.log(file)
        let formData = new FormData()
        formData.append('UploadFiles', file)
        axios.post('/o/v1/opencps/users/upload/opencps_deliverable/org.opencps.deliverable.model.OpenCPSDeliverableFileEntryId/' + data['id'], formData, {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          resolve(response.data)
          console.log('upload file success!')
        }).catch(function (xhr) {
          console.log(xhr)
          toastr.error('Tải file thất bại.')
          reject(xhr)
        })
      })
    },
    createDeliverable ({ commit, state }, input) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          }
        }
        let body = Deliverable.createDeliverable.replace('INPUTBODY', JSON.stringify(input).replace(/"/g, '\\\"'))
        axios.post('/o/v1/opencps/deliverable', body, options).then(function (response) {
          console.log(response)
          resolve(response.data)
        }).catch(function (error) {
          commit('setsnackbarerror', true)
          reject(error)
        })
      })
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event)  {
      state.socket.isConnected = false
      state.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
      state.isConnected = true
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setsnackbarerror (state, payload) {
      state.snackbarerror = payload
    },
    setsnackbarsocket (state, payload) {
      state.snackbarsocket = payload
    },
    setpullCounter (state, payload) {
      state.pullCounter = payload
    },
    setdataSocket (state, payload) {
      state.dataSocket = payload
    },
    setisConnected (state, payload) {
      state.isConnected = payload
    }
  },
  getters: {
    getsnackbarerror (state) {
      return state.snackbarerror
    },
    getsnackbarsocket (state) {
      return state.snackbarsocket
    },
    getDeliverableTypes (state) {
      return state.getDeliverableTypes
    },
    getContentFile (state) {
      return state.getContentFile
    },
    getContentFileSimple (state) {
      return state.getContentFileSimple
    },
    pullCounter (state) {
      return state.pullCounter
    },
    dataSocket (state) {
      return state.dataSocket
    },
    getisConnected (state) {
      return state.isConnected
    },
  }
})
