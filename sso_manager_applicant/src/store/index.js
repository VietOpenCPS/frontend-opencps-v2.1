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
    loading: false,
    isMobile: false,
    userLogin: '',
    applicantInfos: '',
    apiSso: 'https://apigateway.haugiang.gov.vn'
    // apiSso: "http://119.17.200.66:8378" 
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
    getTokenKeyCloak ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let settings = {
          "url": '/o/rest/v2/userSSO/token',
          "method": "POST",
          "headers": {
            'Content-Type': 'application/json',
            'Token': window.Liferay !== undefined ? window.Liferay.authToken : '',
            'dataType': 'text',
          },
          "data": {}
        };
        
        $.ajax(settings).done(function (response) {
          let serializable = response.responseText
          resolve(serializable)
        }).fail(function (response) {
          let serializable = response.responseText
          resolve(serializable)
        })
      })
    },
    collectionCreate ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/' + filter.collectionName,
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          let data = ''
          try {
            data = error.response['status']
          } catch (error1) {
          }
          reject(data)
        })
      })
    },
    collectionUpdate ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/' + filter.collectionName + '/' + filter.id,
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          let data = ''
          try {
            data = error.response['status']
          } catch (error1) {
          }
          reject(data)
        })
      })
    },
    collectionDelete ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          method: 'delete',
          url: state.apiSso + '/v1/datasharing/' + filter.collectionName + '/' + filter.id,
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data: {}
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    collectionFilter ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          method: 'get',
          url: state.apiSso + '/v1/datasharing/' + filter.collectionName + '/filter',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data: {},
          params: filter.data
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    collectionDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          method: 'get',
          url: state.apiSso + '/v1/datasharing/' + filter.collectionName + '/' + filter.id,
          data: {},
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          }
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    loginKeyCloak ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let settings = {
          "url": state.apiSso + '/flex/oauth2/authorization_endpoint?redirect_uri=' + filter.uri,
          "method": "GET",
          "headers": {
            'Secret': 'JHoZK5AA9WCK6R3Dclj80o2uIpWCspN3',
            'Content-Type': 'application/json'
          },
        };
        
        $.ajax(settings).done(function (response) {
          resolve(response)
        }).fail(function (response) {
          reject(response)
        })
      })
    },
    logoutKeyCloak ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let settings = {
          "url": state.apiSso + '/flex/oauth2/logout_endpoint',
          "method": "GET",
          "headers": {
            'Content-Type': 'application/json'
          },
        };
        
        $.ajax(settings).done(function (response) {
          resolve(response)
        }).fail(function (response) {
          reject(response)
        })
      })
    },
    createAccountCaNhan ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/idp/account/' + filter.data.type,
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    activeCaNhan ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/idp/account/'+ filter.data.type + '/active',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    blockCaNhan ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/idp/account/' + filter.data.type + '/lock',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    unBlockCaNhan ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/idp/account/' + filter.data.type + '/unlock',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    restoreCaNhan ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: '/v1/datasharing/idp/account/' + filter.data.type + '/restore',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    deleteCaNhan ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'delete',
          url: state.apiSso + '/v1/datasharing/idp/account/' + filter.data.type + '/delete',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    changePass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/idp/account/resetpwd',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    getLogChangeStatusAcc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          method: 'get',
          url: state.apiSso + '/v1/admin/activity/filter',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data: {},
          params: filter.data
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    updateLog ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify(filter.data)
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/admin/activity/' + filter.uuid,
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    printPhieu ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let dataPost = JSON.stringify({})
        let config = {
          method: 'post',
          url: state.apiSso + '/v1/datasharing/idp/account/' + filter.madinhdanh + '/printcontent',
          headers: { 
            // 'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data : dataPost
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error.response)
        })
      })
    },
    searchLgspCongDan({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {}
        }
        let dataInput = ''
        let urlTraCuu = "/o/rest/v2/qldc/dvcqg"
        dataInput = {
          "MaYeuCau" : (new Date()).getTime(),
          "MaTichHop" : "037",
          "StaffEmail" : filter.StaffEmail,
          "GovAgencyCode": 'SLDTBXH',
          "MaDVC" : "",
          "HoVaTen" : filter.applicantName,
          "type" : "TraCuuThongTinCongDan",
          "NgayThangNamSinh" : filter.birthDate,
        }
        
        if (String(filter.applicantIdNo).length === 9) {
          dataInput['SoCMND'] = filter.applicantIdNo
        } else {
          dataInput['SoDinhDanh'] = filter.applicantIdNo
        }
        axios({
          method: 'POST',
          url: urlTraCuu,
          headers: config.headers,
          params: config.params,
          data: dataInput
        }).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.hasOwnProperty('Body') && serializable["Body"].hasOwnProperty('CongdanCollection') && serializable["Body"]["CongdanCollection"]) {
            let data = serializable["Body"]["CongdanCollection"]["CongDan"]
            resolve(data)
          } else {
            resolve('')
          }
        }).catch(function () {
          reject('')
        })
      })
    },
    searchLgspDoanhNghiep({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {}
        }
        let dataInput = {
          "type": "ChiTietDoanhNghiep",
          "msdn": filter.applicantIdNo
        }
        axios({
          method: 'POST',
          url: '/o/rest/v2/qldc/doanhnghiep',
          headers: config.headers,
          params: config.params,
          data: dataInput
        }).then(function (response) {
          let serializable = response.data
          console.log('serializableDn', serializable)
          let dataCitizen = ''
          if (serializable && serializable.hasOwnProperty('Data') && serializable["Data"] && serializable["Data"]['MainInformation']) {
            let data = Object.assign(serializable["Data"]['HOAdress'], serializable["Data"]['MainInformation'])
            dataCitizen = Object.assign(data, serializable["Data"]['Representatives'][0])
            resolve(dataCitizen)
          } else {
            resolve('')
          }
        }).catch(function () {
          reject('')
        })
      })
    },
    searchApplicantCongDvc({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {}
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/applicants/applicantIdNo/' + filter.applicantIdNo)
        dataPost.append('data', JSON.stringify({}))
        dataPost.append('serverCode', 'SERVER_DVC')
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          if (result.data) {
            resolve(result.data)
          } else {
            resolve('')
          }
        }).catch(xhr => {
          reject('')
        })
      })
    },
    updateApplicantCongDvc({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {}
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'PUT')
        dataPost.append('url', '/applicants/' + filter.applicantId)
        dataPost.append('data', JSON.stringify(filter.data))
        dataPost.append('serverCode', 'SERVER_DVC')
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          if (result.data) {
            resolve(result.data)
          } else {
            resolve('')
          }
        }).catch(xhr => {
          reject('')
        })
      })
    },
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setApplicantInfos (state, payload) {
      state.applicantInfos = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    getApplicantInfos (state) {
      return state.applicantInfos
    }
  }
})
