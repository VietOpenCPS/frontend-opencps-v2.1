import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: support.initData,
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
    // loadInitResource ({commit, state}) {
    //   if (state.initData == null) {
    //     return new Promise((resolve, reject) => {
    //       let param = {}
    //       let orginURL = window.location.href
    //       let coma = window.location.href.lastIndexOf('#/')
    //       if (coma > 0) {
    //         orginURL = window.location.href.substr(0, coma)
    //       }
    //       /* test local */
    //       orginURL = 'http://127.0.0.1:8081/api/initdata'
    //       axios.get(orginURL + support.renderURLInit, param).then(function (response) {
    //         let serializable = response.data
    //         commit('setInitData', serializable)
    //         resolve(serializable)
    //       }).catch(function (error) {
    //         console.log(error)
    //         reject(error)
    //       })
    //     })
    //   } else {
    //     return new Promise((resolve, reject) => {
    //       resolve(state.initData)
    //     })
    //   }
    // },
    getGovAgency ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos/statistics/agencies', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/agencies', param).then(function (response) {
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
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos/statistics/domains', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/domains', param).then(function (response) {
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
          // test local
          axios.get('/o/rest/v2/serviceinfos/statistics/levels', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/levels', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              for (let key in dataReturn) {
                dataReturn[key]['textLevel'] = 'Mức độ ' + dataReturn[key].level
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
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 15 - 15,
              end: filter.page * 15,
              administration: filter.administration ? filter.administration : '',
              keyword: filter.keyword ? filter.keyword : '',
              level: filter.level ? filter.level : 0,
              domain: filter.domain ? filter.domain : ''
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos', param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos', param).then(function (response) {
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
          // test local
          axios.get('/o/rest/v2/serviceinfos/' + filter.index, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/' + filter.index, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
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
