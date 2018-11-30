import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    snackbarerror: false,
    snackbarsocket: false
  },
  actions: {
    loadInitResource ({state}) {
      return new Promise((resolve) => {
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
    getUserInfo ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let userId = 0
          if (window.themeDisplay !== undefined && window.themeDisplay !== null) {
            userId = window.themeDisplay.getUserId()
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/users/' + userId, param).then(function (response) {
          axios.get('/o/v1/opencps/users/' + userId, param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    loadDictItems ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              parent: data.parent
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
          axios.get('/o/rest/v2/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }, error => {
            reject(error)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    changePass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let userId = 0
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          userId = window.themeDisplay.getUserId()
        }
        var url = '/o/rest/v2/users/' + userId + '/changepass/application'
        var dataPutUser = new URLSearchParams()
        dataPutUser.append('oldPassword', filter.oldPassword)
        dataPutUser.append('newPassword', filter.newPassword)
        axios.post(url, dataPutUser, param).then(result1 => {
          resolve(result1.data)
        }).catch(xhr => {
          reject(xhr)
          commit('setsnackbarerror', true)
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
        if (filter['className'] === 'org.opencps.usermgt.model.Employee') {
          url = '/o/rest/v2/employees/' + filter['classPK']
          dataPutUser.append('fullName', filter.employeeFullName)
          dataPutUser.append('telNo', Number(filter.employeeTelNo))
          dataPutUser.append('employeeNo', filter.employeeNo)
          dataPutUser.append('title', filter.title)
          let date = ''
          if (filter['employeeBirthDate']) {
            let [dayInput, monthInput, yearInput] = filter['employeeBirthDate'].split('/')
            let newDate = `${yearInput}-${monthInput.padStart(2, '0')}-${dayInput.padStart(2, '0')}`
            date = new Date(newDate).getTime() ? new Date(newDate).getTime() : ''
          }
          dataPutUser.append('birthDate', date ? date : '')
        } else if (filter['className'] === 'org.opencps.usermgt.model.Applicant') {
          url = '/o/rest/v2/applicants/' + filter['classPK']
          dataPutUser.append('applicantName', filter['applicantName'])
          dataPutUser.append('contactTelNo', Number(filter['applicantContactTelNo']))
          dataPutUser.append('address', filter['applicantAddress'])
          dataPutUser.append('contactEmail', filter['applicantContactTelNo'])
          dataPutUser.append('cityCode', filter['applicantCityCode'])
          dataPutUser.append('districtCode', filter['applicantDistrictCode'])
          dataPutUser.append('wardCode', filter['applicantWardCode'])
          dataPutUser.append('applicantIdNo', filter['applicantIdNo'])
          let date = ''
          if (filter['applicantIdDate']) {
            let [dayInput, monthInput, yearInput] = filter['applicantIdDate'].split('/')
            let newDate = `${yearInput}-${monthInput.padStart(2, '0')}-${dayInput.padStart(2, '0')}`
            date = new Date(newDate).getTime() ? new Date(newDate).getTime() : ''
          }
          dataPutUser.append('applicantIdDate', date ? date : '')
        }
        axios.put(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
          commit('setsnackbarerror', true)
        })
      })
    },
    getImageComponent ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/v1/opencps/users/avatar/' + filter['className'] + '/' + filter['pk'], param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    }
  },
  mutations: {
    setsnackbarerror (state, payload) {
      state.snackbarerror = payload
    }
  },
  getters: {
  }
})
