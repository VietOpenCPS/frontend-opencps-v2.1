import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
// 

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    endPoint: '/o/rest/v2',
    loading: false,
    isMobile: false,
    userLogin: '',
    applicantInfos: ''
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
    loadDictItems ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            },
            params: {
              parent: data.parent
            }
          }
          axios.get('/o/rest/v2/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
            resolve(response.data)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    deleteUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let url = '/o/rest/v2/applicants/' + filter['applicantId']
        axios.delete(url, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    addUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let dataPutUser = new URLSearchParams()
        let url = '/o/rest/v2/applicants'
        dataPutUser.append('applicantName', filter['applicantName'])
        dataPutUser.append('applicantIdNo', filter['applicantIdNo'])
        dataPutUser.append('applicantIdDate', filter['applicantIdDate'])
        dataPutUser.append('applicantIdType', filter['applicantIdType'])
        dataPutUser.append('contactTelNo', filter['contactTelNo'])
        dataPutUser.append('address', filter['address'])
        dataPutUser.append('contactEmail', filter['contactEmail'])
        dataPutUser.append('cityCode', filter['cityCode'])
        dataPutUser.append('cityName', filter['cityName'])
        dataPutUser.append('districtCode', filter['districtCode'])
        dataPutUser.append('districtName', filter['districtName'])
        dataPutUser.append('wardCode', filter['wardCode'])
        dataPutUser.append('wardName', filter['wardName'])
        
        axios.post(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    putUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let dataPutUser = new URLSearchParams()
        let url = ''
        url = '/o/rest/v2/applicants/' + filter['applicantId']
        dataPutUser.append('applicantName', filter['applicantName'])
        dataPutUser.append('applicantIdType', filter['applicantIdType'])
        dataPutUser.append('contactTelNo', filter['contactTelNo'])
        dataPutUser.append('address', filter['address'])
        dataPutUser.append('contactEmail', filter['contactEmail'])
        dataPutUser.append('cityCode', filter['cityCode'])
        dataPutUser.append('cityName', filter['cityName'])
        dataPutUser.append('districtCode', filter['districtCode'])
        dataPutUser.append('districtName', filter['districtName'])
        dataPutUser.append('wardCode', filter['wardCode'])
        dataPutUser.append('wardName', filter['wardName'])
        dataPutUser.append('applicantIdDate', filter['applicantIdDate'])
        axios.put(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    // putUser ({commit, state}, filter) {
    //   return new Promise((resolve, reject) => {
    //     let param = {
    //       headers: {
    //         groupId: window.themeDisplay.getScopeGroupId()
    //       }
    //     }
    //     let dataPutUser = {
    //       applicantName: filter['applicantName'],
    //       applicantIdType: filter['applicantIdType'],
    //       contactTelNo: filter['contactTelNo'],
    //       address: filter['address'],
    //       contactEmail: filter['contactEmail'],
    //       cityCode: filter['cityCode'],
    //       cityName: filter['cityName'],
    //       districtCode:  filter['districtCode'],
    //       districtName: filter['districtName'],
    //       wardCode: filter['wardCode'],
    //       wardName: filter['wardName'],
    //       applicantIdDate: filter['applicantIdDate']
    //     }

    //     let dataPost = new URLSearchParams()
    //     dataPost.append('method', 'PUT')
    //     dataPost.append('url', '/applicants/' + filter['applicantId'])
    //     dataPost.append('data', JSON.stringify(dataPutUser))

    //     axios.post('/o/rest/v2/proxy', dataPost, param).then(result1 => {
    //       resolve(result1)
    //     }).catch(xhr => {
    //       reject(xhr)
    //     })
    //   })
    // },
    getApplicantInfos ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          axios.get('/o/rest/v2/applicants/' + filter['applicantId'], param).then(function (response) {
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
            keyword: filter.keywordSearch ? filter.keywordSearch : '',
            applicantDataType: filter.applicantDataType ? filter.applicantDataType : '',
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
    setApplicantInfos (state, payload) {
      state.applicantInfos = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    getApplicantInfos (state) {
      return state.applicantInfos
    }
  }
})
