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
    indexQuestion: 0,
    questionListDefault: [
      {
        questionId: 101,
        createDate: "30/01/2019 17:16:38",
        fullname: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        content: 'Làm thế nào để nộp hồ sơ?',
        publish: 1
      },
      {
        questionId: 102,
        createDate: "30/01/2019 17:16:38",
        fullname: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        content: 'Làm thế nào để tra cứu hồ sơ sau khi đã nộp?',
        publish: 1
      },
      {
        questionId: 103,
        createDate: "30/01/2019 17:16:38",
        fullname: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        content: 'Cần chuẩn bị gì khi thực hiện giao dịch tại Trung tâm Hành Chính Công?',
        publish: 1
      },
      {
        questionId: 104,
        createDate: "30/01/2019 17:16:38",
        fullname: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        content: 'Sau bao lâu tôi nhận được kết quả giải quyết?',
        publish: 1
      }
    ],
    questionList: [],
    questionDetail: '',
    activeAddQuestion: false,
    activeGetQuestion: false,
    questionPage: 1,
    totalQuestion: 0,
    agencyFilter: '',
    keywordFilter: '',
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
    getQuestions ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param
          let admin = false
          let roles = state['user'].role
          if (!roles) {
            admin = false
          } else {
            let roleExits = roles.findIndex(item => item === 'Administrator')
            if (roleExits >= 0) {
              admin = true
            }
          }
          if (admin) {
            param = {
              headers: {
                groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
              },
              params: {
                // start: state.questionPage * 20 - 20,
                // end: state.questionPage * 20
              }
            }
          } else {
            param = {
              headers: {
                groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              },
              params: {
                // start: state.questionPage * 20 - 20,
                // end: state.questionPage * 20,
                publish: 1
              }
            }
          }
          axios.get(state.endPointApi + '/faq/questions', param).then(function (response) {
            if (response.data && response.data['total']) {
              commit('setTotalQuestion', response.data['total'])
            }
            let dataOutput
            if (response.data && response.data['data']) {
              if (Array.isArray(response.data['data'])) {
                dataOutput = response.data['data']
              } else {
                dataOutput = [response.data['data']]
              }
              if (dataOutput && dataOutput.length > 0) {
                for (let key in dataOutput) {
                  dataOutput[key].answers = []
                }
              }
            } else {
              dataOutput = state.questionListDefault
              for (let key in dataOutput) {
                dataOutput[key].answers = []
              }
            }
            resolve(dataOutput)
          }).catch(function () {
            let dataOutput = state.questionListDefault
            for (let key in dataOutput) {
              dataOutput[key].answers = []
            }
            reject(dataOutput)
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
          dataAdd.append('email', filter.email ? filter.email : '')
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('fullname', filter.fullname ? filter.fullname : '')
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
    deleteQuestion ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          var url = state.endPointApi + '/faq/questions/' + filter['questionId']
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
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
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
    setQuestionDetail (state, payload) {
      state.questionDetail = payload
    },
    setActiveAddQuestion (state, payload) {
      state.activeAddQuestion = payload
    },
    setActiveGetQuestion (state, payload) {
      state.activeGetQuestion = payload
    },
    setAgencyFilter (state, payload) {
      state.agencyFilter = payload
    },
    setKeywordFilter (state, payload) {
      state.keywordFilter = payload
    },
    setQuestionPage (state, payload) {
      state.questionPage = payload
    },
    setTotalQuestion (state, payload) {
      state.totalQuestion = payload
    },
    setIndexQuestion (state, payload) {
      state.indexQuestion = payload
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
    getQuestionDetail (state) {
      return state.questionDetail
    },
    getQuestionPage (state) {
      return state.questionPage
    },
    getTotalQuestion (state) {
      return state.totalQuestion
    },
    getActiveAddQuestion (state) {
      return state.activeAddQuestion
    },
    getActiveGetQuestion (state) {
      return state.activeGetQuestion
    },
    getIndexQuestion (state) {
      return state.indexQuestion
    },
    getUser (state) {
      return state.user
    },
    getAgencyFilter (state, payload) {
      return state.agencyFilter
    },
    getKeywordFilter (state, payload) {
      return state.keywordFilter
    },
  }
})
