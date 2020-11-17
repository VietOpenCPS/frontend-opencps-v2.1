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
  'timeOut': '5000'
}
export const store = new Vuex.Store({
  state: {
    initData: {},
    loading: false,
    index: 0,
    agencyList: [],
    domainList: [],
    levelList: [],
    isMobile: false,
    pathNameConfig: '/register'
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
    makeImageCap ({commit, state}) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId ? state.initData.groupId : '',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
        // test local
        var url = '/o/rest/v2/applicants/jcaptcha'
        axios.get(url, param).then(response => {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    checkApplicantInfos ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId ? state.initData.groupId : '',
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        // test local
        var url = '/o/rest/v2/applicants/ngsp/verify'
        // var url = 'http://127.0.0.1:8081/api/applicants/ngsp/verify'
        var dataCheck = new URLSearchParams()
        dataCheck.append('applicantIdNo', filter.applicantIdNo ? filter.applicantIdNo : '')
        dataCheck.append('applicantName', filter.applicantName ? filter.applicantName : '')
        axios.post(url, dataCheck, param).then(result1 => {
          resolve(result1.data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    getApplicantInfos ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        // test local
        // axios.get('http://127.0.0.1:8081/api/applicants/ngsp/0100109106', param).then(function (response) {
        axios.get('/o/rest/v2/applicants/ngsp/' + filter.applicantIdNo, param).then(function (response) {
          if (response.data && response.data['Data']) {
            resolve(response.data['Data'])
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    goToDangNhap({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let configs = {
            headers: {
              // 'Authorization': 'BASIC ' + window.btoa(filter['npmreactlogin_login'] + ":" + filter['npmreactlogin_password']),
            },
          }
          let dataPostApplicant = new URLSearchParams()
          dataPostApplicant.append('Authorization', 'BASIC ' + window.btoa(filter['npmreactlogin_login'] + ":" + filter['npmreactlogin_password']))
          if (filter.j_captcha_response) {
            dataPostApplicant.append('j_captcha_response', filter.j_captcha_response)
          }
          commit('setLoading', true)
          axios.post('/o/v1/opencps/login', dataPostApplicant, configs).then(function (response) {
            console.log('responseLogin', response)
            commit('setLoading', false)
            if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha' && response.data !== "lockout" &&
            response.data !== "changeSecrect" && response.data !== "verify"
            ) {
              if (response.data === 'pending') {
                let url = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
                let userId = response.headers.hasOwnProperty('userid') ? response.headers.userid : ''
                window.location.href = url + state.pathNameConfig + 
                "#/xac-thuc-tai-khoan?active_user_id=" + userId +
                  "&redirectURL=" + url
              } else {
                window.location.href = response.data
              }
            } else if (response.data === 'ok') {
              resolve('success')
              setTimeout(function () {
                let urlDvc = window.themeDisplay.getSiteAdminURL().split('/~/')[0].replace('group','web')
                window.location.href = urlDvc + '/dich-vu-cong'
              }, 200)
            } else if (response.data === 'captcha') {
              if (filter.j_captcha_response && response['status'] !== undefined && response['status'] === 203) {
                toastr.error("Mã captcha không chính xác")
              }
              resolve('captcha')
            } else if (response.data === "lockout") {
              resolve('lockout')
              toastr.error("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị tạm khóa trong 10 phút.")
            } else if (response.data === "changeSecrect") {
              resolve('changeSecrect')
            } else if (response.data === "verify") {
              console.log('reponseLogin', response, response.headers)
              let header = response.headers.hasOwnProperty('applicantid') ? response.headers['applicantid'] : ''
              if ( typeof(Storage) !== 'undefined') {
                sessionStorage.removeItem('applicantId')
                sessionStorage.setItem('applicantId', header)
              }
              resolve('verify')
            } else {
              resolve('fail')
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
            }
          }).catch(function (error) {
            reject(error)
            commit('setLoading', false)
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
          })
        })
      })
    },
    postApplicantBXD ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let configs = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        store.dispatch('loadInitResource').then(function (result) {
          let configs = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }
          var dataPostApplicant = new FormData()
          dataPostApplicant.append('applicantIdType', data.applicantType)
          dataPostApplicant.append('applicantName', data.applicantName)
          dataPostApplicant.append('applicantIdNo', data.applicantIdNo)
          dataPostApplicant.append('applicantIdDate', data.applicantIdNoDate)
          dataPostApplicant.append('contactEmail', data.contactEmail)
          dataPostApplicant.append('contactTelNo', data.contactTelNo)
          dataPostApplicant.append('password', data.password)
          dataPostApplicant.append('j_captcha_response', data.j_captcha_response)
          dataPostApplicant.append('indentifyNoFile', data.indentifyNoFile)
          console.log('dataPostApplicant', dataPostApplicant)
          // test local
          // axios.post('http://127.0.0.1:8081/api/applicants', dataPostApplicant, configs).then(function (response) {
          axios.post('/o/rest/v2/applicants/withindentifies', dataPostApplicant, configs).then(function (response) {
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Mã captcha không chính xác')
              reject(xhr)
            } else {
              resolve(response.data)
            }
            toastr.success('Đăng ký thành công')
            resolve(response.data)
          }).catch(function (errorRes, response) {
            reject(errorRes)
            console.log('response', errorRes.response)
            let dataError
            if (errorRes.response.data) {
              dataError = errorRes.response.data
              if (dataError && dataError.description && dataError.description === 'DuplicateContactEmailException') {
                toastr.error('Đăng ký thất bại. Email sử dụng đã tồn tại trên hệ thống. Sử dụng Email khác để đăng ký')
              } else if (dataError && dataError.description && dataError.description === 'DuplicateApplicantIdException') {
                toastr.error('Đăng ký thất bại. Số CMND/Mã số thuế đã tồn tại trên hệ thống. Sử dụng số CMND/mã số thuế khác để đăng ký')
              } else if (dataError && dataError.description && dataError.description === 'DuplicateContactTelNoException') {
                toastr.error('Đăng ký thất bại. Số điện thoại đã được sử dụng trên hệ thống. Sử dụng số điện thoại khác để đăng ký')
              } else if (dataError && dataError.description && dataError.description === 'Invalid ID, could not validate unexisting or already validated captcha') {
                toastr.error('Nhập sai Captcha')
              } else {
                toastr.error('Đăng ký thất bại. Vui lòng thử lại ' + dataError.description)
              }
            }
          })
        })
      })
    },
    postApplicant ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let configs = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        store.dispatch('loadInitResource').then(function (result) {
          let configs = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var dataPostApplicant = new URLSearchParams()
          dataPostApplicant.append('applicantIdType', data.applicantType)
          dataPostApplicant.append('applicantName', data.applicantName)
          dataPostApplicant.append('applicantIdNo', data.applicantIdNo)
          dataPostApplicant.append('applicantIdDate', data.applicantIdNoDate)
          dataPostApplicant.append('contactEmail', data.contactEmail)
          dataPostApplicant.append('contactTelNo', data.contactTelNo)
          dataPostApplicant.append('password', data.password)
          dataPostApplicant.append('j_captcha_response', data.j_captcha_response)
          // dataPostApplicant.append('Authorization', 'BASIC ' + window.btoa(data['contactEmail'] + ":" + data['password']))

          console.log('dataPostApplicant', dataPostApplicant)
          // test local
          // axios.post('/o/rest/v2/applicants/lgsp/withcaptcha', dataPostApplicant, configs).then(function (response) {
          axios.post('/o/rest/v2/applicants/withcaptcha', dataPostApplicant, configs).then(function (response) {
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Mã captcha không chính xác')
              reject(xhr)
            } else {
              resolve(response.data)
            }
            toastr.success('Đăng ký thành công')
            resolve(response.data)
          }).catch(function (errorRes, response) {
            reject(errorRes)
            console.log('response', errorRes.response)
            let dataError
            if (String(errorRes.response.status) === '409') {
              toastr.error('Đăng ký thất bại. Tài khoản đã tồn tại trên hệ thống')
            } else {
              if (errorRes.response.data) {
                dataError = errorRes.response.data
                if (dataError && dataError.description && dataError.description === 'DuplicateContactEmailException') {
                  toastr.error('Đăng ký thất bại. Email sử dụng đã tồn tại trên hệ thống. Sử dụng Email khác để đăng ký')
                } else if (dataError && dataError.description && dataError.description === 'DuplicateApplicantIdException') {
                  toastr.error('Đăng ký thất bại. Số CMDN/Mã số thuế đã tồn tại trên hệ thống. Sử dụng số CMDN/mã số thuế khác để đăng ký')
                } else if (dataError && dataError.description && dataError.description === 'DuplicateContactTelNoException') {
                  toastr.error('Đăng ký thất bại. Số điện thoại đã được sử dụng trên hệ thống. Sử dụng số điện thoại khác để đăng ký')
                } else if (dataError && dataError.description && dataError.description === 'Invalid ID, could not validate unexisting or already validated captcha') {
                  toastr.error('Nhập sai Captcha')
                } else {
                  toastr.error('Đăng ký thất bại. Vui lòng thử lại ' + dataError.description)
                }
              }
            }
            
          })
        })
      })
    },
    getDieuKhoan ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/dictcollections/jexcel/backend.datamgt.service/org.opencps.datamgt.model.DictCollection/org.opencps.datamgt.service.DictCollectionLocalServiceUtil/collectionCode/dataForm', param).then(function (response) {
          axios.get('/o/v1/opencps/jexcel/backend.datamgt.service/org.opencps.datamgt.model.DictCollection/org.opencps.datamgt.service.DictCollectionLocalServiceUtil/collectionCode/dataForm', param).then(function (response) {
            if (response.data) {
              let dataReturn = response.data
              let dataRule
              if (Array.isArray(dataReturn) && dataReturn.length > 0) {
                let privacy = dataReturn.filter(function (item) {
                  return (item.id === 'PRIVACY')
                })
                dataRule = privacy && privacy.length > 0 ? privacy[0].name : ''
              }
              resolve(dataRule)
            } else {
              resolve('')
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    confirmPIN ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }

          // axios.get('/o/rest/v2/applicants/' + data.userId + '/lgsp/activate/' + data.pinCode, param).then(function (response) {
          axios.get('/o/rest/v2/applicants/' + data.userId + '/activate/' + data.pinCode, param).then(function (response) {
            resolve(response.data)
            toastr.success('Xác thực thành công')
          }).catch(function (xhr) {
            reject(xhr)
            toastr.error('Mã pin không chính xác. Vui lòng kiểm tra lại')
          })
        })
      })
    },
    confirmPINBXD ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // axios.get('/o/rest/v2/applicants/' + data.userId + '/lgsp/activate/' + data.pinCode, param).then(function (response) {
          axios.get('/o/rest/v2/applicants/'+data.userId+'/verify/'+ data.pinCode, param).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
            toastr.error('Mã pin không chính xác. Vui lòng kiểm tra lại')
          })
        })
      })
    },   
    confirmForgotPASS ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/users/' + data.confirmCode + '/forgot?j_captcha_response=' + data['j_captcha_response'], param).then(function (response) {
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Nhập sai mã Captcha')
              reject(xhr)
            } else if (!response.data['userId']) {
              toastr.clear()
              toastr.error('Tài khoản không tồn tại trên hệ thống')
              reject(xhr)
            } else {
              resolve(response.data)
            }
            // toastr.success('Xác thực thành công')
          }).catch(function (xhr) {
            reject(xhr)
            // toastr.error('Yêu cầu thất bại. Vui lòng thử lại')
          })
        })
      })
    },
    confirmCodeForgotPass ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/users/' + data.userCode + '/forgot/confirm/' + data.confirmCode + '?j_captcha_response=' + data['j_captcha_response'], param).then(function (response) {
          // axios.get('/o/rest/v2/users/lgsp/' + data.userCode + '/forgot/confirm/' + data.confirmCode + '?j_captcha_response=' + data['j_captcha_response'], param).then(function (response) {
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Mã captcha không chính xác. Vui lòng nhập lại.')
              resolve('captcha')
            } else {
              resolve(response.data)
              toastr.clear()
              toastr.success('Xác thực thành công. Vui lòng kiểm tra email để lấy mật khẩu mới')
              setTimeout(function () {
                let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
                window.open(redirectURL, '_self')
              }, 500)
            }
          }).catch(function (errorRes) {
            let response = errorRes.response
            if (response['status'] !== undefined && response['status'] === 403) {
              toastr.clear()
              toastr.error('Mã bảo mật không chính xác. Vui lòng kiểm tra lại.')
            }
            reject(errorRes)
            // toastr.error('Yêu cầu thất bại. Vui lòng nhập lại mã bảo mật')
          })
        })
      })
    },
    // sử dụng dvcqg
    getVNConect ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              state: filter.state,
              redirectURL: filter.redirectURL
            }
          }
          axios.get('/o/rest/v2/dvcqgsso/authurl', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    mappingDvcqg ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {}
          }
          let data = filter.dataMapping
          axios.post('/o/rest/v2/dvcqgsso/auth', data, param).then(function (response) {
            resolve(response)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    putContactEmail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let dataAdd = new URLSearchParams()
        dataAdd.append('email', filter.email ? filter.email : '')
        axios.put('/o/rest/v2', dataAdd, param).then(response => {
          resolve(response)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    changePass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId(),
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let userId = 0
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          userId = window.themeDisplay.getUserId()
        }
        var url = '/o/rest/v2/users/' + userId + '/changepass/application'
        var dataPutUser = new URLSearchParams()
        dataPutUser.append('oldPassword', filter.oldPassword)
        dataPutUser.append('newPassword', filter.newPassword)
        axios.post(url, dataPutUser, param).then(result1 => {
          resolve(result1.data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    resendMail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let url = '/o/rest/v2/applicants/sendMail/' + filter.activeId + '/active'
        let dataPutUser = new URLSearchParams()
        dataPutUser.append('notificationType', filter.notificationType)
        dataPutUser.append('notifyMessage', filter.notifyMessage)
        axios.post(url, dataPutUser, param).then(response => {
          resolve(response)
        }).catch(errorRes => {
          let response = errorRes.response
          if (response['status'] !== undefined && response['status'] === 403) {
            toastr.clear()
            toastr.error('Mã xác nhận không chính xác. Vui lòng nhập lại.')
            reject('captcha')
          } else {
            toastr.clear()
            toastr.error('Gửi lại không thành công.')
            reject('error')
          }
          
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
    setAgencyList (state, payload) {
      state.agencyList = payload
    },
    setDomainList (state, payload) {
      state.domainList = payload
    },
    setLevelList (state, payload) {
      state.levelList = payload
    },
    setIsMobile (state, payload) {
      state.isMobile = payload
    },
    setPathNameConfig (state, payload) {
      state.pathNameConfig = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getAgencyList (state) {
      return state.agencyList
    },
    getDomainList (state) {
      return state.domainList
    },
    getLevelList (state) {
      return state.levelList
    },
    getIsMobile (state) {
      return state.isMobile
    },
    getPathNameConfig (state) {
      return state.pathNameConfig
    },
  }
})
