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
    ],
    questionList: [],
    questionDetail: '',
    activeAddQuestion: false,
    activeGetQuestion: false,
    questionPage: 1,
    totalQuestion: 0,
    agencyFilter: '',
    lvdsFilter: '',
    keywordFilter: '',
    user: {
      'role': ''
    },
    serverConfig: '',
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8081/api',
    counter: true
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
            let filter = {
              serverNo: 'SERVER_DVC'
            }
            if (agencyCodeSite && state.serverConfig === '') {
              store.dispatch('getServerConfig', filter).then(function (result) {
                commit('setServerConfig', result)
                resolve(state.initData)
              }).catch(function (reject) {
                resolve(state.initData)
              })
            } else {
              resolve(state.initData)
            }
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
            let roleExits = roles.findIndex(item => (item === 'Administrator' || item === 'Administrator_data'))
            if (roleExits >= 0) {
              admin = true
            }
          }
          if (admin) {
            let header = {
              groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
            }
            if (agencyCodeSite && state.serverConfig) {
              header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
            }
            param = {
              headers: header,
              params: {
                start: state.questionPage * 20 - 20,
                end: state.questionPage * 20,
                govAgencyCode: filter.agencyCode ? filter.agencyCode : '',
                keyword: filter.keyword ? filter.keyword : '',
                publish: filter.publish,
                answered: filter.answered,
                subDomainCode: filter.subDomainCode ? filter.subDomainCode : ''
              }
            }
          } else {
            param = {
              headers: {
                groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
              },
              params: {
                start: state.questionPage * 20 - 20,
                end: state.questionPage * 20,
                publish: 1,
                govAgencyCode: filter.agencyCode ? filter.agencyCode : '',
                keyword: filter.keyword ? filter.keyword : '',
                subDomainCode: filter.subDomainCode ? filter.subDomainCode : ''
              }
            }
          }
          console.log('param1', param)
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          axios.get(url + '/faq/questions', param).then(function (response) {
            if (response.data && response.data['total']) {
              commit('setTotalQuestion', response.data['total'])
            } else {
              commit('setTotalQuestion', 0)
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
                  dataOutput[key].loading = false
                }
              }
            } else {
              dataOutput = state.questionListDefault
              for (let key in dataOutput) {
                dataOutput[key].answers = []
                dataOutput[key].loading = false
              }
            }
            resolve(dataOutput)
          }).catch(function () {
            commit('setTotalQuestion', 0)
            let dataOutput = state.questionListDefault
            for (let key in dataOutput) {
              dataOutput[key].answers = []
            }
            reject(dataOutput)
          })
        })
      })
    },
    getQuestionsCounter ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let admin = false
          let roles = state['user'].role
          if (!roles) {
            admin = false
          } else {
            let roleExits = roles.findIndex(item => (item === 'Administrator' || item === 'Administrator_data'))
            if (roleExits >= 0) {
              admin = true
            }
          }
          if (admin) {
            let header = {
              groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
            }
            if (agencyCodeSite && state.serverConfig) {
              header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
            }
            let param = {
              headers: header,
              params: {
                start: 0,
                end: 1,
                govAgencyCode: filter['agencyCode'] ? filter['agencyCode'] : '',
                publish: filter['publish'] ? filter['publish'] : '',
                answered: filter['answered'] ? filter['answered'] : ''
              }
            }
            console.log('param2', param)
            let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
            axios.get(url + '/faq/questions', param).then(function (response) {
              if (response.data) {
                resolve(response.data)
              } else {
                resolve(response)
              }
            }).catch(function (xhr) {
              reject(xhr)
            })
          } else {
            reject('')
          }
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
          dataAdd.append('govAgencyCode', filter.agencyCode ? filter.agencyCode : '')
          dataAdd.append('subDomainCode', filter.subDomainCode ? filter.subDomainCode : '')
          dataAdd.append('subDomainName', filter.subDomainName ? filter.subDomainName : '')
          dataAdd.append('j_captcha_response', filter.j_captcha_response ? filter.j_captcha_response : '')
          dataAdd.append('questionType', filter.questionType ? filter.questionType : '')
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
          let header = {
            groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
          }
          if (agencyCodeSite && state.serverConfig) {
            header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
          }
          let param = {
            headers: header
          }
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          let urlPut = url + '/faq/questions/' + filter.questionId
          let dataAdd = new URLSearchParams()
          dataAdd.append('email', filter.email ? filter.email : '')
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('fullname', filter.fullname ? filter.fullname : '')
          dataAdd.append('publish', filter.publish)
          dataAdd.append('govAgencyCode', filter.govAgencyCode)
          axios.put(urlPut, dataAdd, param).then(response => {
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
          let header = {
            groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
          }
          if (agencyCodeSite && state.serverConfig) {
            header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
          }
          let param = {
            headers: header
          }
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          let urlPut = url + '/faq/questions/' + filter.questionId + '/answers/' + filter.answerId
          let dataAdd = new URLSearchParams()
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('publish', filter.publish)
          axios.put(urlPut, dataAdd, param).then(response => {
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
          let header = {
            groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
          }
          if (agencyCodeSite && state.serverConfig) {
            header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
          }
          let param = {
            headers: header
          }
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          let urlPost = url + '/faq/questions/' + filter['questionId'] + '/answers'
          let dataAdd = new URLSearchParams()
          dataAdd.append('content', filter.content ? filter.content : '')
          dataAdd.append('publish', filter.publish ? filter.publish : '')
          axios.post(urlPost, dataAdd, param).then(response => {
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
          let header = {
            groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
          }
          if (agencyCodeSite && state.serverConfig) {
            header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
          }
          let param = {
            headers: header
          }
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          let urlDelete = url + '/faq/questions/' + filter['questionId'] + '/answers/' + filter.answerId
          axios.delete(urlDelete, param).then(response => {
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
          let header = {
            groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
          }
          if (agencyCodeSite && state.serverConfig) {
            header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
          }
          let param = {
            headers: header
          }
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          let urlDelete = url + '/faq/questions/' + filter['questionId']
          axios.delete(urlDelete, param).then(response => {
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
          let header = {
            groupId: state.serverConfig ? state.serverConfig['groupId'] : window.themeDisplay.getScopeGroupId()
          }
          if (agencyCodeSite && state.serverConfig) {
            header.Authorization = 'BASIC ' + window.btoa(state.serverConfig['username'] + ':' + state.serverConfig['password'])
          }
          let param = {
            headers: header
          }
          let url = state.serverConfig ? state.serverConfig['url'] : state.endPointApi
          axios.get(url + '/faq/questions/' + filter.questionId + '/answers', param).then(function (response) {
            if (response.data && response.data['data']) {
              resolve(response.data['data'])
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
            reject([])
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
    },
    getGovAgency ({commit, state}) {
      return new Promise((resolve, reject) => {
        let paramGetGovAgency = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {
            sort: 'sibling'
          }
        }
        axios.get('/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems', paramGetGovAgency).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    getLvdsList ({commit, state}) {
      return new Promise((resolve, reject) => {
        let paramGetGovAgency = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {
            sort: 'sibling'
          }
        }
        axios.get('/o/rest/v2/dictcollections/QUESTION_SUBDOMAIN_CODE/dictitems', paramGetGovAgency).then(function (response) {
          if (response.data.data) {
            resolve(response.data.data)
          } else {
            resolve([])
          }
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    getServerConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            }
          }
          let url = '/o/rest/v2/serverconfigs/' + filter.serverNo
          axios.get(url, param).then(function (response) {
            let serializable = response.data
            try {
              let configs = JSON.parse(serializable.configs)
              resolve(configs)
            } catch (error) {
              resolve(serializable)
            }
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
    setServerConfig (state, payload) {
      state.serverConfig = payload
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
    setLvdsFilter (state, payload) {
      state.lvdsFilter = payload
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
    },
    setCounter (state, payload) {
      state.counter = payload
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
    getAgencyFilter (state) {
      return state.agencyFilter
    },
    getLvdsFilter (state) {
      return state.lvdsFilter
    },
    getKeywordFilter (state) {
      return state.keywordFilter
    },
    getCounter (state) {
      return state.counter
    }
  }
})
