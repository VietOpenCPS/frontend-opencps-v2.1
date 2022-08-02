import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
// import router from '@/router'

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: null,
    loading: false,
    loadingTable: false,
    loadingSubmit: false,
    error: null,
    docTypes: null,
    roleFilterStatus: null,
    userSignsData: null
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
    loadDataTugboat ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          params: {
            categoryId: 'DM_VMA_TUGBOAT'
          }
        }
        for (var key in data) {
          param.params[key] = data[key]
        }
        store.dispatch('loadInitResource').then(function (result) {
          if (data.hasOwnProperty('portOfAuthority') && !data['portOfAuthority'] || data.hasOwnProperty('portofAuthority') && !data['portofAuthority']) {
            param.params['portOfAuthority'] = state.maritimeCode
            param.params['portofAuthority'] = state.maritimeCode
          }
          if (data.hasOwnProperty('maritimeCode') && !data['maritimeCode']) {
            param.params['maritimeCode'] = state.maritimeCode
          }
          axios.get(state.initData.getDetailDmCategories, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadDanhSachTauBien ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let urlRequest = data.url
          let query = {}
          for (var key in data) {
            if (key !== 'url') {
              query[key] = data[key]
            }
          }
          // let param = {
          //   params: query
          // }
          // if (data['getShip']) {
          //   param['timeout'] = 35000
          // }
          // axios.get(urlRequest, param).then(function (response) {
          //   let serializable = response.data
          //   resolve(serializable)
          // }).catch(function (error) {
          //   console.log(error)
          //   reject(error)
          // })
          let assign = true
          if (data['assign'] === false) {
            assign = data['assign']
            delete data['assign']
          }
          $.ajax({
            url: urlRequest,
            type: 'GET',
            dataType: 'json',
            data: query,
            assign: assign,
            timeout: 35000,
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    canhbaotinhphi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: filter
          }
          axios.get(state.initData.canhbaotinhphiURL, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    checkHistoryTempDebitnote ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          params: {}
        }
        for (var key in data) {
          param.params[key] = data[key]
        }
        store.dispatch('loadInitResource').then(function (result) {
          console.log("state.initData: ", state.initData);
          axios.get(state.initData['checkHistoryTempDebitnoteURL'], param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadDataItems ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        // let param = {
        //   params: {}
        // }
        // for (var key in data) {
        //   param.params[key] = data[key]
        // }
        let assign = true
        if (data['assign'] === false) {
          assign = data['assign']
          delete data['assign']
        }
        store.dispatch('loadInitResource').then(function (result) {
          // axios.get(state.initData.getDataItems, param).then(function (response) {
          //   let serializable = response.data['data']
          //   resolve(serializable)
          // }).catch(function (error) {
          //   console.log(error)
          //   reject(error)
          // })
          $.ajax({
            url: state.initData.getDataItems,
            type: 'GET',
            dataType: 'json',
            data: data,
            assign: assign,
            success: function (result) {
              resolve(result['data'])
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    loadDataDm ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        // let param = {
        //   params: {}
        // }
        // for (var key in data) {
        //   param.params[key] = data[key]
        // }
        store.dispatch('loadInitResource').then(function (result) {
          if (data.hasOwnProperty('portOfAuthority') && !data['portOfAuthority'] || data.hasOwnProperty('portofAuthority') && !data['portofAuthority']) {
            // param.params['portOfAuthority'] = state.maritimeCode
            // param.params['portofAuthority'] = state.maritimeCode
            data['portOfAuthority'] = state.maritimeCode
            data['portofAuthority'] = state.maritimeCode
          }
          if (data.hasOwnProperty('maritimeCode') && !data['maritimeCode']) {
            // param.params['maritimeCode'] = state.maritimeCode
            data['maritimeCode'] = state.maritimeCode
          }
          let assign = true
          if (data['assign'] === false) {
            assign = data['assign']
            delete data['assign']
          }
          $.ajax({
            url: state.initData.getDetailDmCategories,
            type: 'GET',
            dataType: 'json',
            data: data,
            assign: assign,
            success: function (result) {
              resolve(result['data'])
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
          // axios.get(state.initData.getDetailDmCategories, param).then(function (response) {
          //   let serializable = response.data['data']
          //   resolve(serializable)
          // }).catch(function (error) {
          //   console.log(error)
          //   reject(error)
          // })
        })
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
    //       axios.get(orginURL + support.renderURLInit, param).then(function (response) {
    //         let serializable = response.data
    //         commit('setInitData', serializable)
    //         resolve(serializable)
    //       }).catch(function (error) {
    //         console.log(error)
    //         reject(error)
    //         commit('setInitData', {abc: 123})
    //       })
    //     })
    //   } else {
    //     return new Promise((resolve, reject) => {
    //       resolve(state.initData)
    //     })
    //   }
    // },
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise(function (resolve, reject) {
          let param = {}
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          var url1 = new Promise(function (resolve, reject) {
            axios.get(orginURL + support.renderURLInit, param).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
          var url2 = new Promise(function (resolve, reject) {
            axios.get(orginURL + support.renderURLInit2, param).then(function (response) {
              let serializable = response.data
              if (serializable && serializable['user']) {
                let user = serializable['user']
                commit('setMaritimeCode', user['maritimeCode'])
              } else {
                commit('setMaritimeCode', '')
              }
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
          var url3 = new Promise(function (resolve, reject) {
            axios.get(orginURL + support.renderURLInit3, param).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
          Promise.all([url1, url2, url3]).then(function (results) {
            var data = Object.assign(results[0], results[1], results[2])
            commit('setInitData', data)
            resolve(data)
          }).catch(function (xhr) {
            commit('setInitData', null)
            reject(null)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    loadHomeDataTable ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: data
          }
          if (data.type === 'ke_hoach') {
            param.params['requestState'] = data.documentStatusCode
          } else if (data.type === 'thu_tuc') {
            param.params['documentStatusCode'] = data.documentStatusCode
          }
          param.params['isDTND'] = state.initData.user.isDTND
          param.params['isDTNDCam'] = state.initData.user.isDTNDCam
          let urlRequest = ''
          if (data.type === 'ke_hoach') {
            urlRequest = state.initData.getHoSoKeHoachTable
          } else if (data.type === 'thu_tuc') {
            urlRequest = state.initData.getHoSoThuTucTable
          } else if (data.type === 'lanh_dao') {
            urlRequest = state.initData.getHistoryTable
            param.params['documentTypeCode'] = 'document_sign'
          } else if (data.type === 'van_thu') {
            urlRequest = state.initData.getHistoryTable
            param.params['documentTypeCode'] = 'document_approve'
          } else {
            urlRequest = state.initData.getHoSoKeHoachTable
          }
          axios.get(urlRequest, param).then(function (response) {
            let serializable = response.data
            console.log(serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadHomeDataPaymentTable ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: data
          }
          axios.get(state.initData.getPaymentData, param).then(function (response) {
            let serializable = response.data
            console.log(serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadDocTypes ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          axios.get(state.initData.getDocTypes).then(function (response) {
            let serializable = response.data
            commit('setDocTypes', serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadRoleFilterStatus ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              documentType: filter.documentType
            }
          }
          axios.get(state.initData.getRoleFilterStatus, param).then(function (response) {
            let serializable = response.data
            commit('setRoleFilterStatus', serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadDetailHoSo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'documentType': filter.documentType,
              'documentName': filter.documentName,
              'documentYear': filter.documentYear,
              'type': filter.type
            }
          }
          axios.get(state.initData.getDetailByDocumentName, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadKhaiBaoHoSo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'documentName': filter.maBanKhai,
              'documentYear': filter.documentYear
            }
          }
          axios.get(state.initData.getThongTinKhaiBaoTable, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadMessageType23EXT ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'documentName': filter.maBanKhai,
              'documentYear': filter.documentYear
            }
          }
          axios.get(state.initData.getMessageType23EXT, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadPhanHoi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'documentName': filter.maBanKhai,
              'documentYear': filter.documentYear
            }
          }
          axios.get(state.initData.getPhanHoiTuCoQuanChuyenNganhTable, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadGhiChu ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'documentName': filter.maBanKhai,
              'documentYear': filter.documentYear,
              'ministryCode': filter.ministryCode
            }
          }
          axios.get(state.initData.exportPDFDetail, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadUserSigns ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'documentType': filter.documentType,
              'documentName': filter.documentName,
              'documentYear': filter.documentYear,
              'messageType': filter.messageType,
              'REQUEST_CODE': filter.requestCode,
              'roleType': filter.roleType
            }
          }
          axios.get(state.initData.checkThanhPhanActionButton, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getListPortWharf ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            params: {
              'harbourCode': filter.harbourCode,
              'documentName': filter.documentName,
              'documentYear': filter.documentYear
            }
          }
          axios.get(state.initData.getListPortWharf, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getTinMois ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          axios.get(state.initData.getNotifications).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
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
    setLoadingTable (state, payload) {
      state.loadingTable = payload
    },
    setLoadingSubmit (state, payload) {
      state.loadingSubmit = payload
    },
    setMaritimeCode (state, payload) {
      state.maritimeCode = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    clearError (state) {
      state.error = null
    },
    setDocTypes (state, payload) {
      state.docTypes = payload
    },
    setRoleFilterStatus (state, payload) {
      state.roleFilterStatus = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    maritimeCode (state) {
      return state['maritimeCode']
    },
    loadingTable (state) {
      return state.loadingTable
    },
    loadingSubmit (state) {
      return state.loadingSubmit
    },
    loadingInitData (state) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          resolve(result)
        })
      })
    },
    error (state) {
      return state.error
    },
    index (state) {
      return state.index
    },
    docTypes (state) {
      if (state.docTypes === null) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadDocTypes').then(function (result) {
            resolve(result)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.docTypes)
        })
      }
    },
    roleFilterStatus (state) {
      return (filter) => {
        return new Promise((resolve, reject) => {
          store.dispatch('loadRoleFilterStatus', filter).then(function (result) {
            resolve(result)
          })
        })
      }
    }
  }
})
