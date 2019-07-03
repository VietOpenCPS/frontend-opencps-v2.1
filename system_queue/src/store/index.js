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
    getDanhSachCho ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            params: {}
          }
          axios.get(state.endPoint + '/', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve('')
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    getEform ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            params: {}
          }
          axios.get(state.endPoint + '/eforms/' + filter.eFormId, param).then(function (response) {
            let serializable = response.data
            if (serializable) {
              resolve(serializable)
            } else {
              resolve('')
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    getDossier ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            params: {}
          }
          axios.get(state.endPoint + '/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            if (serializable) {
              resolve(serializable)
            } else {
              resolve('')
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    getBookingDangGoi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              Authorization: "BASIC YWRtaW5fY2xzQGRpY2h2dWNvbmcudm46MTIzNDU="
            },
            params: {
              state: filter.state ? filter.state : '',
              service: filter.service ? filter.service : ''
            }
          }
          axios.get(state.endPoint + '/bookings/' + filter.className, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            reject([])
          })
        })
      })
    },
    getDossier ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          axios.get(filter.url, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(serializable.data)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            reject([])
          })
        })
      })
    },
    getDossierDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              Authorization: "BASIC YWRtaW5fY2xzQGRpY2h2dWNvbmcudm46MTIzNDU="
            }
          }
          axios.get('/o/rest/v2/dossiers/' + filter.dossierId, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (xhr) {
            reject()
          })
        })
      })
    },
    getServerConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Authorization: "BASIC YWRtaW5fY2xzQGRpY2h2dWNvbmcudm46MTIzNDU="
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
      })
    },
    createBooking ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              Authorization: "BASIC YWRtaW5fY2xzQGRpY2h2dWNvbmcudm46MTIzNDU="
            }
          }
          let dataCreateBooking = new URLSearchParams()
          dataCreateBooking.append('className', filter.className)
          dataCreateBooking.append('classPK', filter.classPK)
          dataCreateBooking.append('codeNumber', filter.codeNumber)
          dataCreateBooking.append('serviceCode', filter.serviceCode)
          dataCreateBooking.append('state', filter.state)
          dataCreateBooking.append('gateNumber', '')
          dataCreateBooking.append('bookingName', filter.bookingName)
          axios.post('/o/rest/v2/bookings', dataCreateBooking, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    updateBooking ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataUpdateBooking = new URLSearchParams()
          dataUpdateBooking.append('speaking', filter.speaking)
          axios.put('/o/rest/v2/bookings/' + filter.bookingId, dataUpdateBooking, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
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
    },
    setIsMobile (state, payload) {
      state.isMobile = payload
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
    }
  }
})
