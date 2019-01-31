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
    questionList: [],
    activeAddQuestion: false,
    activeGetQuestion: false,
    user: {
      'role': ''
    },
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8081/api',
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
          }).catch(function (error) {
            state['user'].role = ['default']
            console.log(error)
          })
        }
        commit('setInitData', state.initData)
        resolve(state.initData)
      })
    },
    getQuestions ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          axios.get(state.endPointApi + '/faq/questions', param).then(function (response) {
            if (response.data && response.data['data']) {
              resolve(response.data['data'])
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
            reject(xhr)
          })
        })
      })
    },
    addQuestion ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var url = state.endPointApi + '/faq/questions'
          var dataAdd = new URLSearchParams()
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('fullname', filter.fullname ? filter.fullname : '')
          dataAdd.append('email', filter.email ? filter.email : '')
          dataAdd.append('publish', filter.publish ? filter.publish : '')
          dataAdd.append('j_captcha_response', filter.j_captcha_response ? filter.j_captcha_response : '')
          axios.post(url, dataAdd, param).then(response => {
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Nhập sai mã Captcha')
              reject(xhr)
            } else {
              resolve(response.data)
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    putQuestion ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var url = state.endPointApi + '/faq/questions/' + filter.questionId
          var dataAdd = new URLSearchParams()
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('publish', filter.publish)
          axios.put(url, dataAdd, param).then(response => {
            resolve(response)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    putAnswer ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var url = state.endPointApi + '/faq/questions/' + filter.questionId + '/answers/' + filter.answerId
          var dataAdd = new URLSearchParams()
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('publish', filter.publish)
          axios.put(url, dataAdd, param).then(response => {
            resolve(response)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    addAnswer ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var url = state.endPointApi + '/faq/questions/' + filter['questionId'] + '/answers'
          var dataAdd = new URLSearchParams()
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('publish', filter.publish ? filter.publish : '')
          axios.post(url, dataAdd, param).then(response => {
            resolve(response.data)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    deleteAnswer ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var url = state.endPointApi + '/faq/questions/' + filter['questionId'] + '/answers/' + filter.answerId
          axios.delete(url, param).then(response => {
            resolve(response)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    getAnswers ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          axios.get(state.endPointApi + '/faq/questions/' + filter.questionId + '/answers', param).then(function (response) {
            if (response.data && response.data['data']) {
              resolve(response.data['data'])
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
            reject(xhr)
          })
        })
      })
    },
    makeImageCap ({commit, state}) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
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
    getRoleUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get(state.endPointApi + '/users/login', param).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.length > 0) {
            let roles = []
            for (let key in serializable) {
              if (serializable[key]['role']) {
                roles.push(serializable[key]['role'])
              }
            }
            console.log('roles', roles)
            resolve(roles)
          } else {
            resolve(['default'])
          }
        }).catch(function (error) {
          console.log(error)
          reject('default')
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
    setQuestionList (state, payload) {
      state.questionList = payload
    },
    setActiveAddQuestion (state, payload) {
      state.activeAddQuestion = payload
    },
    setActiveGetQuestion (state, payload) {
      state.activeGetQuestion = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getQuestionList (state) {
      return state.questionList
    },
    getActiveAddQuestion (state) {
      return state.activeAddQuestion
    },
    getActiveGetQuestion (state) {
      return state.activeGetQuestion
    },
    getUser (state) {
      return state.user
    }
  }
})
