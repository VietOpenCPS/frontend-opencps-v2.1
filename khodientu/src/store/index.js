import Vue from 'vue'
import toastr from 'toastr'
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
              start: filter.start ? filter.start : 0,
              end: filter.end ? filter.end : 15,
              status: filter.status ? filter.status : '',
              fileTemplateNo: filter.fileTemplateNo ? filter.fileTemplateNo : '',
              name: filter.name ? filter.name : '',
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
    putVerification ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let dataPutUser = new URLSearchParams()
        let url = ''
        url = '/o/rest/v2/applicants/' + filter['applicantId'] + '/verify/' + filter['verification']
        axios.put(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    makeImageCapLogin ({commit, state}) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId ? state.initData.groupId : '',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
        // test local
        var url = '/o/v1/opencps/users/login/jcaptcha'
        axios.get(url, param).then(response => {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    goToDangNhap({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let configs = {
            headers: {
              'Authorization': 'BASIC ' + window.btoa(filter['npmreactlogin_login'] + ":" + filter['npmreactlogin_password']),
            }
          }
          var dataPostApplicant = new URLSearchParams()
          if (filter.j_captcha_response) {
            dataPostApplicant.append('j_captcha_response', filter.j_captcha_response)
          }
          axios.post('/o/v1/opencps/login', dataPostApplicant, configs).then(function (response) {
            console.log(response.data)
            if (response.data === 'ok' || (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha' && response.data !== 'lockout')) {
              setTimeout(function () {
                window.location.href = window.location.origin + '/web/kho-dien-tu#/so-hoa-giay-to'
              }, 200)
              
            } else if (response.data === 'captcha') {
              if (filter.j_captcha_response && response['status'] !== undefined && response['status'] === 203) {
                toastr.error("Mã captcha không chính xác")
              }
              resolve('captcha')
            } else if (response.data === "lockout") {
              resolve('lockout')
              toastr.error("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị tạm khóa trong 10 phút.")
            } else {
              resolve('fail')
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
            }
          }).catch(function (error) {
            reject(error)
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
          })
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
