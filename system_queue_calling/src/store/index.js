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
    getServiceLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              if (dataReturn !== null && dataReturn !== undefined && dataReturn !== 'undefined') {
                dataReturn.unshift({
                  'serviceCode': '',
                  'serviceName': 'Tất cả thủ tục'
                })
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
    getBooking ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            service: filter.service ? filter.service : '',
            state: filter.state ? filter.state : '',
            gateNumber: filter.gateNumber ? filter.gateNumber : ''
          }
          if (filter['bookingFrom']) {
            paramGet.bookingFrom = filter['bookingFrom']
          }
          if (filter['bookingTo']) {
            paramGet.bookingTo = filter['bookingTo']
          }
          if (filter.hasOwnProperty('online')) {
            paramGet.online = String(filter['online']) === 'true' ? true : false
          }
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            },
            params: paramGet
          }
          axios.get(state.endPoint + '/bookings/' + filter.className, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
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
          dataUpdateBooking.append('state', filter.state)
          dataUpdateBooking.append('gateNumber', filter.gateNumber)
          dataUpdateBooking.append('speaking', filter.speaking)
          axios.put('/o/rest/v2/bookings/' + filter.bookingId, dataUpdateBooking, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    postDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': ''
          }
        }
        var dataPostdossier = new URLSearchParams()
        dataPostdossier.append('serviceCode', data.serviceCode)
        dataPostdossier.append('govAgencyCode', data.govAgencyCode)
        dataPostdossier.append('dossierTemplateNo', data.dossierTemplateNo)
        dataPostdossier.append('originality', 3)
        axios.post('/o/rest/v2/dossiers', dataPostdossier, options).then(function (response) {
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    getProcessDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/onegate/serviceconfigs/processes', param).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getGateNumber ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let url = '/o/rest/v2/users/' + window.themeDisplay.getUserId() + '/preferences/gateNumber'
          let config = {
            headers: {
              'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          axios.get(url, config).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    updateGateNumber ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let url = '/o/rest/v2/users/' + window.themeDisplay.getUserId() + '/preferences'
          let config = {
            headers: {
              'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          let params = new URLSearchParams()
          params.append('preferences', '{"gateNumber":"' + filter.gateNumber + '"}')
          axios.put(url, params, config).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getGateLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/dictcollections/GATE_NUMBER/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              for (let index in dataReturn) {
                dataReturn[index]['itemCode'] = isNaN(dataReturn[index]['itemCode']) ? dataReturn[index]['itemCode'] : Number(dataReturn[index]['itemCode'])
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
    getServerConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
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
    getFieldPick ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let url = '/o/rest/v2/fieldpick/classpk/' + filter
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
    postFieldPick ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let url = '/o/rest/v2/fieldpick/classpk/' + filter.classPK
          let dataPost = new URLSearchParams()
          let data = {}
          data[filter.key] = filter.val
          dataPost.append('formData', JSON.stringify(data))
          axios.post(url,dataPost, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    // add new template
    loadDossierFormTemplates ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/dossiertemplates/' + data.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }, error => {
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
