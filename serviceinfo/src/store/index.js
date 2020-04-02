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
    // endPoint: 'http://127.0.0.1:8081/api',
    loading: false,
    index: 0,
    agencyList: [],
    agencyListThucHien: [],
    domainList: [],
    levelList: [],
    isMobile: false,
    userLogin: ''
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
    getGovAgency ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              sort: 'siblingSearch'
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/agencies', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getGovAgencyThucHien ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {}
          }
          axios.get(state.endPoint + '/onegate/serviceconfigs/govagencies', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(serializable.data)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getDomain ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              agency: data.agencyCode,
              sort: 'siblingSearch'
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getLevelList ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/levels', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              for (let key in dataReturn) {
                dataReturn[key]['levelName'] = 'Mức độ ' + dataReturn[key].level
              }
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: filter.page * 15 - 15,
            end: filter.page * 15,
            administration: filter.administration ? filter.administration : '',
            agency: filter.agency ? filter.agency : '',
            keyword: filter.keyword ? filter.keyword.replace(/[!@#$%^&*(),?":{}|<>]/g, '') : '',
            level: filter.level ? filter.level : 0,
            domain: filter.domain ? filter.domain : ''
          }
          // if (filter.domain) {
          //   paramGet.sort = "siblingSearch"
          // } else {
          //   paramGet.sort = "siblingDomain"
          // }

          if (filter.domain) {
            paramGet.sort = "siblingSearch"
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
    checkServiceExits ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: 0,
            end: 1,
            keyword: filter.keyword ? filter.keyword.replace(/[!@#$%^&*(),?":{}|<>]/g, '') : '',
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramGet
          }
          axios.get(state.endPoint + '/serviceinfos', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(true)
            } else {
              resolve(false)
            }
          }).catch(function (error) {
            reject(false)
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
          axios.get(state.endPoint + '/dvcqgsso/authurl', param).then(function (response) {
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
    putVNConect ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
            }
          }
          axios.post(state.endPoint + '/dvcqgsso/auth', filter.userInfo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
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
          let dataPostApplicant = new URLSearchParams()
          if (filter.j_captcha_response) {
            dataPostApplicant.append('j_captcha_response', filter.j_captcha_response)
          }
          axios.post('/o/v1/opencps/login', dataPostApplicant, configs).then(function (response) {
            if (response.data !== '' && response.data !== 'ok' && response.data !== 'captcha' && response.data !== "lockout") {
              if (response.data === 'pending') {
                window.location.href = window.themeDisplay.getURLHome() +
                "/register#/xac-thuc-tai-khoan?active_user_id=" + window.themeDisplay.getUserId() +
                  "&redirectURL=" + window.themeDisplay.getURLHome()
              } else {
                window.location.href = response.data
              }
            } else if (response.data === 'ok') {
              resolve('success')
            } else if (response.data === 'captcha') {
              if (response['status'] !== undefined && response['status'] === 203) {
                toastr.error("Mã captcha không chính xác")
              }
              resolve('captcha')
            } else if (response.data === "lockout") {
              resolve('lockout')
              toastr.error("Bạn đã đăng nhập sai quá 5 lần. Tài khoản bị tạm khóa trong 10 phút.")
            } else {
              toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 })
              resolve('error')
            }
          }).catch(function (error) {
            toastr.error("Tên đăng nhập hoặc mật khẩu không chính xác.", { autoClose: 2000 })
            reject(error)
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
    setAgencyListThucHien (state, payload) {
      state.agencyListThucHien = payload
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
    setUserLogin (state, payload) {
      state.userLogin = payload
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
    getAgencyListThucHien (state) {
      return state.agencyListThucHien
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
    getUserLogin (state) {
      return state.userLogin
    }
  }
})
