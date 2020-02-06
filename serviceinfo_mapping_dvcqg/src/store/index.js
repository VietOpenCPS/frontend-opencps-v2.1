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
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: filter.page * 15 - 15,
            end: filter.page * 15,
            keyword: filter.keyword,
            domain: filter.domain,
            administration: filter.agency
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramGet
          }
          axios.get(state.endPoint + '/serviceinfos/mappingsuggest', param).then(function (response) {
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
    mappingDvcqg ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCode', filter.serviceCode)
          dataPost.append('serviceCodeDVCQG', filter.serviceCodeDVCQG)
          axios.post('/o/rest/v2/nps/mappingserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    mappingDvcqgCongDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {
            serviceCode: filter.serviceCode,
            serviceCodeDVCQG: filter.serviceCodeDVCQG
          }
          dataPost.append('method', 'POST')
          dataPost.append('url', '/nps/mappingserviceinfo')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    removeMappingDvcqg ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/rest/v2/nps/removemappingserviceinfo/' + filter.serviceInfoId, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    removeMappingDvcqgCongDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {}
          dataPost.append('method', 'DELETE')
          dataPost.append('url', '/nps/removemappingserviceinfo/' + filter.serviceInfoId)
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    syncServiceinfo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCodes', filter.serviceCode)
          axios.post('/o/rest/v2/nps/syncserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    syncServiceinfoCongDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {
            serviceCodes: filter.serviceCode
          }
          dataPost.append('method', 'POST')
          dataPost.append('url', '/nps/syncserviceinfo')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
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
