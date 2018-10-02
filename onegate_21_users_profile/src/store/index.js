import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'
import axios from 'axios'
import support from './support.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {
      groupId: 55123,
      user: {
        userName: 'Nguyễn Vũ Nam',
        userEmail: 'namnv.sct@phutho.gov.vn',
        userId: 20103
      }
    },
    loading: false
  },
  actions: {
    // loadInitResource ({commit, state}) {
    //   return new Promise((resolve, reject) => {
    //     if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
    //       state.initData['groupId'] = window.themeDisplay.getScopeGroupId()
    //       state.initData['user'] = {
    //         'userName': window.themeDisplay.getUserName(),
    //         'userEmail': '',
    //         'userId': window.themeDisplay.getUserId()
    //       }
    //     } else {
    //       state.initData['groupId'] = 0
    //       state.initData['user'] = {
    //         'userName': '',
    //         'userEmail': '',
    //         'userId': 20103
    //       }
    //     }
    //     resolve(state.initData)
    //   })
    // },
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise((resolve, reject) => {
          let param = {}
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          /* test local */
          orginURL = 'http://127.0.0.1:8081/api/initdata'
          axios.get(orginURL + support.renderURLInit, param).then(function (response) {
            let serializable = response.data
            commit('setInitData', serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    loadUser ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('http://127.0.0.1:8081/api/users/' + data.userId + '/profile', param).then(result1 => {
          // axios.get('/o/rest/v2/users' + '/' + data.userId + '/profile', param).then(result1 => {
            resolve(result1.data)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    putUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        var dataPutUser = new URLSearchParams()
        var url = ''
        if (filter['className'] === 'employee') {
          url = '/o/rest/v2/employees/' + filter['employeeId']
          dataPutUser.append('fullName', filter.fullName)
          dataPutUser.append('telNo', Number(filter.telNo))
          dataPutUser.append('address', filter.address)
          dataPutUser.append('email', filter.email)
        } else {
          url = '/o/rest/v2/applicants/' + filter['applicantId']
          dataPutUser.append('applicantName', filter.applicantName)
          dataPutUser.append('contactTelNo', Number(filter.contactTelNo))
          dataPutUser.append('address', filter.address)
          dataPutUser.append('contactEmail', filter.contactEmail)
          dataPutUser.append('cityCode', filter.cityCode)
          dataPutUser.append('wardCode', filter.wardCode)
          dataPutUser.append('cityName', filter.cityName)
          dataPutUser.append('districtName', filter.districtName)
          dataPutUser.append('wardName', filter.wardName)
        }
        axios.put(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadDictItems ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              parent: data.parent
            }
          }
          // test local
          axios.get('http://127.0.0.1:8081/api/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
          // axios.get('/o/rest/v2/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
            let serializable = response.data
            resolve(response.data)
          }, error => {
            reject(error)
          })
        })
      })
    },
    loadImageUser ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/users/' + state.initData['user'].userId + '/photo', param).then(result => {
            var url = window.URL.createObjectURL(result.data)
            resolve(url)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    }
  },
  getters: {
    getDictItems (state) {
      return (filter) => {
        if (filter.collectionCode === 'ADMINISTRATIVE_REGION' && filter.level === 0) {
          if (state.citys == null) {
            return store.dispatch('loadDictItems', filter)
          } else {
            return new Promise((resolve, reject) => {
              resolve({
                total: state.citys.length,
                data: state.citys
              })
            })
          }
        } else {
          return store.dispatch('loadDictItems', filter)
        }
      }
    },
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    }
  }
})
