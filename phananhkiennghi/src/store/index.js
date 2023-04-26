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
  'timeOut': '3000'
}
export const store = new Vuex.Store({
  state: {
    initData: {},
    loading: false,
    user: {
      'role': ''
    },
    endPointApi: '/o/rest/v2',
    dossierDetail: '',
    secretCode: ''
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
        if (state['user'].role === '') {
          store.dispatch('getRoleUser').then(function (result) {
            state['user'].role = result
            commit('setInitData', state.initData)
            resolve(state.initData)
          }).catch(function (error) {
            state['user'].role = ['default']
            commit('setInitData', state.initData)
            resolve(state.initData)
            console.log(error)
          })
        } else {
          commit('setInitData', state.initData)
          resolve(state.initData)
        }
      })
    },
    getRoleUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get(state.endPointApi + '/users/login', param).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.length > 0) {
            let roles = []
            for (let key in serializable) {
              if (serializable[key]['role']) {
                let role = serializable[key]['role'].split('_')
                let roleLength = role.length
                if (isNaN((Number(role[roleLength - 1])))) {
                  roles.push(serializable[key]['role'])
                } else {
                  let item = serializable[key]['role'].replace('_' + role[roleLength - 1], '')
                  roles.push(item)
                }
                
              }
            }
            resolve(roles)
          } else {
            resolve(['default'])
          }
        }).catch(function (error) {
          console.log(error)
          reject('default')
        })
      })
    },
    getDanhSachCauHoi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          var settings = {
            "url": "/o/rest/v2/nps/pakn",
            "method": "GET",
            "headers": {
              "groupId": window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : '',
              "Content-Type": "application/x-www-form-urlencoded",
              "Accept": "application/json",
            },
            "data": {
              "trangHienTai": filter.page,
              "soBanGhiMoiTrang": filter.itemsPerPage,
              "keyword": filter.tukhoa
            }
          };
          
          $.ajax(settings).done(function (response) {
            if (response) {
              resolve(response)
            } else {
              resolve("")
            }
          }).fail(function (error) {
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
    setDossierDetail (state, payload) {
      state.dossierDetail = payload
    },
    setScretCode (state, payload) {
      state.secretCode = payload
    },
  },
  getters: {
    loading (state) {
      return state.loading
    },
    getDetailDossier (state) {
      return state.dossierDetail
    },
    getScretCode (state) {
      return state.secretCode
    }
  }
})
