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
    levelList: []
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
              'Authorization': 'BASIC ' + window.btoa(filter['npmreactlogin_login'] + ":" + filter['npmreactlogin_password']),
            }
          }
          var dataPostApplicant = new URLSearchParams()
          // dataPostApplicant.append('j_captcha_response', filter.j_captcha_response)
          axios.post('/o/v1/opencps/login', dataPostApplicant, configs).then(function (response) {
            console.log(response.data)
            resolve(response)
            if (response.data !== '' && response.data !== 'ok') {
              if (response.data === 'pending') {
                window.location.href = window.themeDisplay.getURLHome() +
                "/register#/xac-thuc-tai-khoan?active_user_id=" + window.themeDisplay.getUserId() +
                  "&redirectURL=" + window.themeDisplay.getURLHome()
              } else {
                window.location.href = response.data
              }
            } else if (response.data === 'ok') {
              window.location.href = window.themeDisplay.getURLHome()
            } else if (response.data === 'captcha') {
              toastr.error("Nhập sai mã Captcha.", { autoClose: 2000 });
            } else {
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
            }
          }).catch(function (error) {
            reject(error)
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 });
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
          console.log('dataPostApplicant', dataPostApplicant)
          // test local
          // axios.post('http://127.0.0.1:8081/api/applicants', dataPostApplicant, configs).then(function (response) {
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
          // test local
          // axios.get('http://127.0.0.1:8081/api/applicants/' + data.userId + '/activate/' + data.pinCode, param).then(function (response) {
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
    confirmForgotPASS ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/users/' + data.confirmCode + '/forgot', param).then(function (response) {
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
          // axios.get('http://127.0.0.1:8081/api/users/' + data.userCode + '/forgot/confirm/' + data.confirmCode, param).then(function (response) {
          axios.get('/o/rest/v2/users/' + data.userCode + '/forgot/confirm/' + data.confirmCode + '?j_captcha_response=' + data['j_captcha_response'], param).then(function (response) {
            resolve(response.data)
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Mã captcha không chính xác. Vui lòng nhập lại.')
              reject(xhr)
            } else {
              resolve(response.data)
              toastr.clear()
              toastr.success('Xác thực thành công. Bạn vui lòng kiểm tra email hoặc số điện thoại để có mật khẩu mới')
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
    }
  }
})
