import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import $ from 'jquery'
import md5 from 'md5'
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
    secretCode: '',
    md5Token: ''
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
    makeImageCapLogin ({commit, state}) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId ? state.initData.groupId : '',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
        // var url = '/o/v1/opencps/users/login/jcaptcha'
        var url = '/o/rest/v2/applicants/jcaptcha'
        axios.get(url, param).then(response => {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadingDataHoSo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          store.dispatch('getTokenMd5')
          let param = {
            headers: {
              groupId: state.initData.groupId,
              authenKey: state.md5Token
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10,
              dossierNo: filter.dossierNo ? filter.dossierNo : '',
              applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : '',
              status: filter.status ? filter.status : '',
              order: filter.order ? true : false
            }
          }
          axios.get(state.endPointApi + '/dossiers', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadingDataHoSoCaptcha ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          // let param = {
          //   headers: {
          //     groupId: state.initData.groupId
          //   },
          //   params: {
          //     start: filter.page * 10 - 10,
          //     end: filter.page * 10,
          //     dossierNo: filter.dossierNo ? filter.dossierNo : ''
          //   }
          // }
          // axios.get(state.endPointApi + '/dossiers/searchDossierNo', param).then(function (response) {
          //   let serializable = response.data
          //   resolve(serializable)
          // }).catch(function (error) {
          //   console.log(error)
          //   reject(error)
          // })

          // 
          var config = {
            method: 'get',
            url: state.endPointApi + '/dossiers/searchDossierNo',
            headers: { groupId: state.initData.groupId },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10,
              dossierNo: filter.dossierNo ? filter.dossierNo : '',
              j_captcha_response: filter.captcha
            }
          };

          axios(config)
          .then(function (response) {
            if (response['status'] !== undefined && response['status'] === 203) {
              toastr.clear()
              toastr.error('Mã captcha không chính xác')
              reject('captcha')
            } else {
              resolve(response.data)
            }
          })
          .catch(function (error) {
            console.log(error)
            reject(error)
          });
          // 
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
            resolve(roles)
          } else {
            resolve(['default'])
          }
        }).catch(function (error) {
          reject('default')
        })
      })
    },
    getDossierDetailPass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              secretCode: filter.password
            },
            params: {}
          }
          axios.get(state.endPointApi + '/dossiers/' + filter.dossierId, param).then(function (response) {
            console.log('response', response)
            resolve(response)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    loadDossierActions ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/dossiers/' + data.dossierId + '/sequences', config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    getListHistoryProcessingItems ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          var listHistoryProcessing = []
          // test local
          axios.get(state.endPointApi + '/dossierlogs/' + filter.dossierId + '/logs', param).then(function (response) {
            let serializable = response.data
            for (var key in serializable.data) {
              if (serializable.data[key].notificationType === 'PROCESS_TYPE') {
                listHistoryProcessing.push(serializable.data[key])
              }
            }
            resolve(listHistoryProcessing)
          })
          .catch(function (error) {
            reject(error)
          })
        })
      })
    },
    // voting
    loadDetailDossierMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let paramsGet = {
          start: 0,
          end: 10,
          dossierNo: data['dossierNo']
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/dossiers')
        dataPost.append('data', JSON.stringify(paramsGet))
        dataPost.append('serverCode', 'SERVER_' + data['govAgencyCode'])
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          if (result.data.hasOwnProperty('data')) {
            resolve(result.data.data)
          } else {
            resolve('')
          }
          
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get(state.endPointApi + '/postal/votings/' + data.className + '/' + data.classPK, param).then(result => {
            if (result.data) {
              resolve(result.data.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    loadVotingMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/postal/votings/' + data.className + '/' + data.classPK)
        dataPost.append('data', '')
        dataPost.append('serverCode', 'SERVER_' + data['serverCode'])
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result1) {
          if (result1.data) {
            resolve(result1.data.data)
          } else {
            resolve([])
          }
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    submitVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          var params = new URLSearchParams()
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          params.append('className', data.className)
          params.append('classPk', data.classPk)
          params.append('selected', data.selected)
          if (data.className === 'dossier') {
            params.append('votingCode', data.votingCode ? data.votingCode : '')
          }
          axios.post(state.endPointApi + '/postal/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
          })
        })
      })
    },
    submitVotingMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          // api đồng bộ sang một cửa
          let config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          let textPost = {
            className: data.className,
            classPk: data.classPk,
            selected: data.selected
          }
          if (data.className === 'dossier') {
            textPost['votingCode'] = data.votingCode ? data.votingCode : ''
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'POST')
          dataPost.append('url', '/postal/votings/' + data.votingId + '/results')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', data.serverCode)
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
            resolve(result.data)
          }).catch(xhr => {
            toastr.clear()
            toastr.error('Gửi đánh giá thất bại')
            reject(xhr)
          })
        })
      })
    },
    loadDossierPayments ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let paramsGet = {
          secretCode: data.secretCode
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/dossiers/' + data.referenceUid+ '/payment')
        dataPost.append('data', JSON.stringify(paramsGet))
        dataPost.append('serverCode', 'SERVER_' + data['serverCode'])
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          resolve(result.data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
      
    },
    putPayments ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let paramsGet = {
          secretCode: data.secretCode
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'PUT')
        dataPost.append('url', '/dossiers/keypay/' + data.referenceUid + '/' + data.referenceUid)
        dataPost.append('data', JSON.stringify(paramsGet))
        dataPost.append('serverCode', 'SERVER_' + data['serverCode'])
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          if (result.data) {
            resolve(result.data)
          } else {
            resolve([])
          }
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    processDossierRouter ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          let paramsGet = {
            secretCode: filter.secretCode,
            actionCode: filter.actionCode ? filter.actionCode : '',
            payment: filter.payment?JSON.stringify(filter.payment):'',
            assignUsers: filter.toUsers?JSON.stringify(filter.toUsers):'',
            actionNote: filter.userNote?JSON.stringify(filter.userNote):'',
            payload: filter.payload?JSON.stringify(filter.payload):''
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'POST')
          dataPost.append('url', '/dossiers/' + filter.dossierId + '/actions')
          dataPost.append('data', JSON.stringify(paramsGet))
          dataPost.append('serverCode', 'SERVER_' + filter['serverCode'])
          console.log('dataPost',dataPost)
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
            let serializable = result.data
            resolve(serializable)
          }).catch(xhr => {
            reject(xhr)
          })

        }).catch(function (){})
      })
    },
    checkkeypay ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append("good_code", filter.good_code)
          dataPost.append("command", filter.command)
          dataPost.append("merchant_trans_id", filter.merchant_trans_id)
          dataPost.append("merchant_code", filter.merchant_code)
          dataPost.append("response_code", filter.response_code)
          dataPost.append("trans_id", filter.trans_id)
          dataPost.append("net_cost", filter.net_cost)
          dataPost.append("ship_fee", filter.ship_fee)
          dataPost.append("tax", filter.tax)
          dataPost.append("service_code", filter.service_code)
          dataPost.append("currency_code", filter.currency_code)
          dataPost.append("bank_code", filter.bank_code)
          dataPost.append("secure_hash", filter.secure_hash)
          dataPost.append("dossierId", filter.dossierId)
          console.log('dataPost',dataPost)
          axios.post('o/rest/v2/dossiers/checkkeypay', dataPost, config).then(function (result) {
            let serializable = result.data
            resolve(serializable)
          }).catch(xhr => {
            reject(xhr)
          })

        }).catch(function (){})
      })
    },
    traCuuHsQlvt ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let settings = {
            "url": "/o/rest/v2/dossiers/proxy",
            "method": "GET",
            "headers": {
              "groupId": state.initData.groupId,
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "serverCode": "SERVER_QLVT",
              "method": "GET",
              "typeCode": "tracuuhoso",
              "data": JSON.stringify({MaHoSo: filter.dossierNo})
            }
          };
          
          $.ajax(settings).done(function (response) {
            if (response) {
              resolve(response)
            } else {
              resolve('')
            }
          }).fail(function () {
            reject('')
          })
        }).catch(function (){})
      })
    },
    getTokenMd5 ({commit, state}) {
      let date = (new Date()).getDate()
      let month = (new Date()).getMonth() + 1
      let year = (new Date()).getFullYear()
      let hours = (new Date()).getHours()
      let minutes = (new Date()).getMinutes()
      let currentDate = (new Date(`${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)).getTime()
      let token = md5('opencps' + currentDate)
      commit('setMd5Token', token)
    },
    getApplicantIdNoByImage ({commit, state}, postData) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let url = '/o/rest/v2/eKYC/getApplicantIdNoByImage'
        let data = new URLSearchParams();
        data.append("image_live", postData.image_live)
        axios.post(url, data, param).then(response => {
          resolve(response)
        }).catch(errorRes => {
          let response = errorRes.message
          toastr.clear()
          toastr.error(response)
          reject('error')
        })
      })
    },
    toKeypayDvcqg ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let url = '/o/pgi/ppdvcqg/inittransaction'
        let dataPost = new URLSearchParams()
        dataPost.append('dossierId', filter.dossierId)
        
        axios.post(url, dataPost, param).then(response => {
          if (response.data && ((response.data.hasOwnProperty('error') && response.data.error == '0') || (response.data.hasOwnProperty('MaLoi') && response.data.MaLoi == '00'))) {
            resolve(response.data.UrlThanhToan)
          } else if (response.data && ((response.data.hasOwnProperty('error') && response.data.error != '0') || (response.data.hasOwnProperty('MaLoi') && response.data.MaLoi != '00'))) {
            // toastr.error(response.data.hasOwnProperty('msg') ? response.data.msg : 'Yêu cầu thực hiện thất bại')
            reject(response)
          } else {
            reject(response)
          }
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    putMetaData({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': ''
          }
        }
        let dataPostdossier = new URLSearchParams()
        dataPostdossier.append('data',filter.data)
        axios.put('/o/rest/v2/dossiers/'+filter.id+'/metadata', dataPostdossier, options).then(function (response) {
          resolve(response)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
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
    setMd5Token (state, payload) {
      state.md5Token = payload
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
