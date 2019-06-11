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
    endPoint: '/o/rest/v2',
    // endPoint: 'http://127.0.0.1:8081/api',
    serviceinfoSelected: '',
    fileTemplateSelected: '',
    formScriptEform: '',
    formDataEform: '',
    eformDetail: '',
    loading: false,
    index: 0,
    agencyList: [],
    domainList: [],
    levelList: [],
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
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: filter.page * 15 - 15,
            end: filter.page * 15
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramGet
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
    getFileTemplateEform ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              eForm: true
            }
          }
          axios.get(state.endPoint + '/serviceinfos/' + filter.serviceInfoId + '/filetemplates', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadFormScript ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/serviceinfos/' + data.serviceInfoId + '/filetemplates/' + data.fileTemplateNo + '/formscript',
            type: 'GET',
            headers: {
              groupId: state.initData.groupId,
              Token: window.Liferay ? window.Liferay.authToken : ''
            },
            dataType: 'text',
            success: function (result) {
              let serializable = result
              resolve(serializable)
            },
            error: function (xhr) {
              console.log(xhr)
              resolve(xhr)
              reject(xhr)
            }
          })
        })
      })
    },
    loadFormData ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/serviceinfos/' + data.serviceInfoId + '/filetemplates/' + data.fileTemplateNo + '/formreport',
            type: 'GET',
            headers: {
              groupId: state.initData.groupId,
              Token: window.Liferay ? window.Liferay.authToken : ''
            },
            dataType: 'text',
            success: function (result) {
              let serializable = result
              resolve(serializable)
            },
            error: function (xhr) {
              console.log(xhr)
              resolve(xhr)
              reject(xhr)
            }
          })
        })
      })
    },
    downloadEform ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            },
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/eforms/' + data.eFormNo + '/password/' + data.secret + '/report', param).then(function (response) {
            var url = window.URL.createObjectURL(response.data)
            window.open(url)
            // let fileName = decodeURI(response.headers['content-disposition'].match(/filename="(.*)"/)[1])
            // let serializable = response.data
            // saveAs(serializable, fileName)
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getEformSecret ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          axios.get('/o/rest/v2/eforms/' + data.eFormNo + '/password/' + data.secret, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (xhr) {
            toastr.error('Thực hiện thất bại. Vui lòng kiểm tra lại mã tờ khai, mã xác thực.')
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
    setServiceinfoSelected (state, payload) {
      state.serviceinfoSelected = payload
    },
    setFormScriptEform (state, payload) {
      state.formScriptEform = payload
    },
    setFormDataEform (state, payload) {
      state.formDataEform = payload
    },
    setFileTemplateSelected (state, payload) {
      state.fileTemplateSelected = payload
    },
    setEformDetail (state, payload) {
      state.eformDetail = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getServiceinfoSelected (state) {
      return state.serviceinfoSelected
    },
    getFormScriptEform (state) {
      return state.formScriptEform
    },
    getFormDataEform (state) {
      return state.formDataEform
    },
    getFileTemplateSelected (state, payload) {
      return state.fileTemplateSelected
    },
    getEformDetail (state, payload) {
      return state.eformDetail
    }
  }
})
