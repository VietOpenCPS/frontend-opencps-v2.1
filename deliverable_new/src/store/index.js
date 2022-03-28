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
    userPermission: false,
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
    user: {
      'role': ''
    },
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
    isConnected: false,
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8081/api',
    getDeliverableTypes: [],
    deliverableTypesFilter: [],
    getContentFile: '',
    getContentFileSimple: [],
    changeFormData: '',
    activeBindFormData: false
  },
  actions: {
    loadInitResource ({commit, state}) {
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
      return new Promise((resolve, reject) => {
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
          state.deliverableTypesFilter = response.data['getDeliverableTypes']
          resolve(response.data['getDeliverableTypes'])
        }).catch(function () {
          state.getDeliverableTypes = []
          state.deliverableTypesFilter = []
          commit('setsnackbarerror', true)
          reject(state.getDeliverableTypes)
        })
      })
    },
    getContentFile ({ commit, state }, fileEntryId) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Accept': 'text/plain'
          }
        }
        axios.get('/o/v1/opencps/fileattach/' + fileEntryId + '/text', options).then(function (response) {
          try {
            state.getContentFile = eval('( ' + response.data + ' )')
            resolve(state.getContentFile)
          } catch (error) {
            resolve(response.data)
          }
        }).catch(function () {
          state.getContentFile = ''
          reject(state.getContentFile)
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
          }
        }
        if(filter.hasOwnProperty('getAll')){
          if(filter.getAll){
            options['params'] = {}
          }else{
            options['params'] = {
              start: filter.page * 15 - 15,
              end: filter.page * 15
            }
          }
        } else {
          options['params'] = {
            start: filter.page * 15 - 15,
            end: filter.page * 15
          }
        }
        if (filter.hasOwnProperty('formDataKey') && filter.formDataKey) {
          options['params'] = Object.assign(options['params'], {formDataKey: filter.formDataKey})
        }
        axios.get('/o/v1/opencps/deliverable/' + filter['type'] + '?' + filter['q'], options).then(function (response) {
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    searchDeliverables ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId
          },
          params: filter.hasOwnProperty('export') && filter.export ? {} : {
            start: filter.page * 15 - 15,
            end: filter.page * 15
          }
        }
        if (filter.typeSearch === 'keyword') {
          options.params.keyword = filter.keyword
          options.params.formDataKey = filter.formDataKey
        } else {
          options.params.keyword = ''
          options.params.formDataKey = filter.formDataKey
        }
        axios.get('/o/v1/opencps/deliverable/' + filter['type'], options).then(function (response) {
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
          if (response.data.data) {
            response.data.data.govAgenciesItems = []
            response.data.data.applicantIdNoItems = []
            resolve(response.data.data)
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
        // console.log(file)
        let formData = new FormData()
        formData.append('UploadFiles', file)
        axios.post('/o/v1/opencps/users/upload/opencps_deliverable/org.opencps.deliverable.model.OpenCPSDeliverableFileEntryId/' + data['id'], formData, {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
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
    },
    putFormData ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        let formDataUpdate = new URLSearchParams()
        formDataUpdate.append('formdata', JSON.stringify(filter['formData']))
        axios.put('/o/rest/v2/deliverables/' + filter['deliverableId'] + '/formdata', formDataUpdate, param).then(function (response) {
          resolve(response)
        }).catch(function(xhr) {
          reject(xhr)
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
        axios.get('/o/rest/v2/users/login', param).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.length > 0) {
            let roles = []
            for (let key in serializable) {
              if (serializable[key]['role']) {
                roles.push(serializable[key]['role'])
              }
            }
            // console.log('roles', roles)
            resolve(roles)
          } else {
            resolve(['default'])
          }
        }).catch(function (error) {
          console.log(error)
          reject('default')
        })
      })
    },
    getReport ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        var settings = {
          "url": "/o/statistic/deliverable/report",
          "method": "POST",
          "headers": {
            "groupId": 0,
            "Content-Type": "application/json"
          },
          "data": filter.data,
        };
        
        $.ajax(settings).done(function (response) {
          if (response.hasOwnProperty('data')) {
            resolve(response)
          } else {
            resolve("")
          }
        });
      })
    },
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
    setUserPermission (state, payload) {
      state.userPermission = payload
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
    },
    setChangeFormData (state, payload) {
      state.changeFormData = payload
    },
    setActiveBindFormData (state, payload) {
      state.activeBindFormData = payload
    },
    setDeliverableTypesFilter (state, payload) {
      return state.deliverableTypesFilter = payload
    },
  },
  getters: {
    getUser (state) {
      return state.user
    },
    getUserPermission (state) {
      return state.userPermission
    },
    getsnackbarerror (state) {
      return state.snackbarerror
    },
    getsnackbarsocket (state) {
      return state.snackbarsocket
    },
    getDeliverableTypes (state) {
      return state.getDeliverableTypes
    },
    getDeliverableTypesFilter (state) {
      return state.deliverableTypesFilter
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
    getChangeFormData (state) {
      return state.changeFormData
    },
    getActiveBindFormData (state) {
      return state.activeBindFormData
    }
  }
})
