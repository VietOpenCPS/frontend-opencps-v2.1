import Vue from 'vue'
import Vuex from 'vuex'
// 
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    endPoint: '/o/rest/v2',
    loading: false,
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
    getDetailDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          axios.get('/o/rest/v2/dossiers/' + data, param).then(function (response) {
            resolve(response.data)
          }, error => {
            reject(error)
          }).catch(function (xhr) {
            console.log(xhr)
          })
        }).catch(function (){})
      })
    },
    loadDossierActions ({commit, state}, data) {
      let config = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        },
        params: {
          stepType: data.stepType
        }
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId + '/sequences'
      return new Promise((resolve, reject) => {
        axios.get(url, config).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    loadDossierLogs ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          params: {
            notificationType: data.type
          }
        }
        let url = '/o/rest/v2/dossiers/' + data.dossierId + '/logs'
        axios.get(url, config).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    }
  }
})
