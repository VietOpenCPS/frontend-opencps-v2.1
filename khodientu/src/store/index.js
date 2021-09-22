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
    getFileItems ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            },
            params: {
              status: filter.status ? filter.status : ''
            }
          }
          axios.get('/o/rest/v2/fileitems', param).then(function (response) {
            resolve(response.data)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getFileItemsFromDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          let params = {
            status: filter.status ? filter.status : ''
          }
          let dataPost = new URLSearchParams()
          let textPost = params
          dataPost.append('method', 'GET')
          dataPost.append('url', '/fileitems')
          dataPost.append('data', JSON.stringify(textPost))

          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response.data)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getApplicantDocument ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            },
            params: {
              start: filter.start ? filter.start : 0,
              end: filter.end ? filter.end : 15,
              applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : '',
              fileTemplateNo: filter.fileTemplateNo ? filter.fileTemplateNo : '',
              status: filter.status,
              keyword: filter.keywordSearch ? filter.keywordSearch : '',
              applicantDataType: filter.applicantDataType ? filter.applicantDataType : '',
              fileNo: filter.fileNoSearch
            }
          }

          axios.get('/o/rest/v2/applicantdatas', param).then(function (response) {
            if (response['data'].hasOwnProperty('data')) {
              if (Array.isArray(response['data']['data'])) {
                resolve(response.data)
              } else {
                resolve(
                  {
                    data: [response['data']['data']],
                    total: response['data']['total']
                  }
                )
              }
            } else {
              reject(response)
            }
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getApplicantDocumentFromDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          let params = {
            start: filter.start ? filter.start : 0,
            end: filter.end ? filter.end : 15,
            applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : '',
            fileTemplateNo: filter.fileTemplateNo ? filter.fileTemplateNo : '',
            status: filter.status,
            applicantName: filter.applicantName ? filter.applicantName : '',
            fileNo: filter.fileNoSearch
          }
          let dataPost = new URLSearchParams()
          let textPost = params
          dataPost.append('method', 'GET')
          dataPost.append('url', '/applicantdatas')
          dataPost.append('data', JSON.stringify(textPost))

          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            if (response['data'].hasOwnProperty('data')) {
              if (Array.isArray(response['data']['data'])) {
                resolve(response.data)
              } else {
                resolve(
                  {
                    data: [response['data']['data']],
                    total: response['data']['total']
                  }
                )
              }
            } else {
              reject(response)
            }
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getFileAttachProxy ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          responseType: 'blob'
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/applicantdatas/' + filter.applicantDataId + '/preview')
        dataPost.append('dataType', 'binary')
        dataPost.append('data', '')
        
        axios.post('/o/rest/v2/proxy', dataPost, param).then(response => {
          let url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    getFileAttach ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          responseType: 'blob'
        }
        axios.get('/o/rest/v2/applicantdatas/' + filter.applicantDataId + '/preview', param).then(response => {
          let url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
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
