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
    // endPoint: 'http://127.0.0.1:8081/api',
    loading: false,
    index: 0,
    agencyList: [],
    agencyListThucHien: [],
    domainList: [],
    levelList: [],
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
    getGovAgency ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              sort: 'siblingSearch'
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/agencies', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getDomain ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              agency: data.agencyCode,
              sort: 'siblingSearch'
            }
          }
          axios.get(state.endPoint + '/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            console.log(xhr)
          })
        })
      })
    },
    getServiceLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: filter.page * 15 - 15,
            end: filter.page * 15,
            keyword: filter.keyword.replace(/[!@#$%^&*(),?":{}|<>]/g, ''),
            domain: filter.domain,
            administration: filter.agency
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramGet
          }
          axios.get(state.endPoint + '/serviceinfos/mappingsuggest', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getSharingqa ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }

          axios.post('/o/rest/v2/nps/getsharingqa',filter,param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceDomain ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: 'o/rest/v2/dictcollections/SERVICE_DOMAIN/dictitems/mappingsuggest',
            method: 'get',
            params: filter,
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceDomainDVCQG ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/dictcollections/SERVICE_DOMAIN/dictitems/dvcqg',
            method: 'get',
            params: filter,
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceAgency ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: 'o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems/mappingsuggest',
            method: 'get',
            params: filter,
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceAgencyDVCQG ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems/dvcqg',
            method: 'get',
            params: filter,
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceMcLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: filter.page * 15 - 15,
            end: filter.page * 15,
            keyword: filter.keyword.replace(/[!@#$%^&*(),?":{}|<>]/g, ''),
            domain: filter.domain
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramGet
          }
          axios.get(state.endPoint + '/serviceinfos', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPoint + '/serviceinfos/' + filter.index, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    mappingDvcqg ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCode', filter.serviceCode)
          dataPost.append('serviceCodeDVCQG', filter.serviceCodeDVCQG)
          axios.post('/o/rest/v2/nps/mappingserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    mappingTTHC({commit, state}, filter){
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCode', filter.serviceCode)
          dataPost.append('serviceCodeDVCQG', filter.serviceCodeDVCQG)
          dataPost.append('serviceNameDVCQG', filter.serviceNameDVCQG)
          axios.post('/o/rest/v2/nps/mappingserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    mappingDvcqgCongDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {
            serviceCode: filter.serviceCode,
            serviceCodeDVCQG: filter.serviceCodeDVCQG
          }
          dataPost.append('method', 'POST')
          dataPost.append('url', '/nps/mappingserviceinfo')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    mappingServiceDomain ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('itemCode', filter.itemCode)
          dataPost.append('itemCodeDVCQG', filter.itemCodeDVCQG)
          axios.post('o/rest/v2/dictcollections/SERVICE_DOMAIN/dictitems/mapping', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    mappingServiceAgency ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('itemCode', filter.itemCode)
          dataPost.append('itemCodeDVCQG', filter.itemCodeDVCQG)
          axios.post('o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems/mapping', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    removeMappingDvcqg ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/rest/v2/nps/removemappingserviceinfo/' + filter.serviceInfoId, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    removeMappingTTHC ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/rest/v2/nps/removemappingserviceinfo/' + filter.mappingClassPK, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    removeMappingDvcqgCongDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {}
          dataPost.append('method', 'DELETE')
          dataPost.append('url', '/nps/removemappingserviceinfo/' + filter.serviceInfoId)
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    removeMapping ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/rest/v2/nps/removemappingserviceinfo/' + filter.serviceInfoId, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    removeMappingServiceAgency ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: 'o/rest/v2/dictcollections/GOVERNMENT_AGENCY/dictitems/removemapping/' + filter.dictItemMappingId,
            method: 'delete',
            headers: {groupId: state.initData.groupId},
          }
          // let param = {
          //   headers: {
          //     groupId: state.initData.groupId
          //   },
          //   params: {
          //     itemCodeDVCQG: filter.itemCodeDVCQG
          //   }
          // }
          // let dataPost = new URLSearchParams()
          // dataPost.append('itemCodeDVCQG', filter.itemCodeDVCQG)
          axios.request(config).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    removeMappingServiceDomain ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: 'o/rest/v2/dictcollections/SERVICE_DOMAIN/dictitems/removemapping/' + filter.dictItemMappingId,
            method: 'delete',
            headers: {groupId: state.initData.groupId},
          }
          // let param = {
          //   headers: {
          //     groupId: state.initData.groupId
          //   },
          //   params: {
          //     itemCodeDVCQG: filter.itemCodeDVCQG
          //   }
          // }
          // let dataPost = new URLSearchParams()
          // dataPost.append('itemCodeDVCQG', filter.itemCodeDVCQG)
          axios.request(config).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    syncServiceinfo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCodes', filter.serviceCode)
          axios.post('/o/rest/v2/nps/syncserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    syncServiceinfoAll ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          axios.post('/o/rest/v2/nps/syncserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    syncServiceinfoCongDvc ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {
            serviceCodes: filter.serviceCode
          }
          dataPost.append('method', 'POST')
          dataPost.append('url', '/nps/syncserviceinfo')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    syncSharingqa ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          if(filter) {
            axios.post('/o/rest/v2/nps/syncsharingqa',filter,param).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else {
            axios.post('/o/rest/v2/nps/syncsharingqa',filter,param).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })           
          }

        })
      }) 
    },
    getTTHCDonVi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/serviceinfos',
            method: 'get',
            params: filter,
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
          // resolve({
          //   total: 10,
          //   data: [
          //     {
          //       serviceCode: 'B-BGT-284959-TT',
          //       serviceName: "Cấp lại Giấy phép lái tàu",
          //       serviceCodeDVCQG: "1.003897",
          //       serviceNameDVCQG: "Cấp lại Giấy phép lái tàu"
          //     },
          //     {
          //       serviceCode: 'B-BGT-284959-TT',
          //       erviceName: "Cấp lại Giấy phép lái tàu",
          //       serviceCodeDVCQG: "",
          //       serviceNameDVCQG: ""
          //     },
          //     {
          //       serviceCode: 'B-BGT-284959-TT',
          //       erviceName: "Cấp lại Giấy phép lái tàu",
          //     },
          //   ]
          // })
        })
      })
    },
    getTTHCDVCQG ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/nps/serviceinfodvcqg',
            method: 'get',
            params: filter,
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getChiTietTTDVCQG ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/nps/serviceinfodvcqg/' + filter.serviceCodeDVCQG,
            method: 'get',
            headers: {groupId: state.initData.groupId},
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    addTTHC ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCodes', "")
          dataPost.append('type', "create")
          axios.post('/o/rest/v2/nps/syncserviceinfo', dataPost, param).then(function (result) {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve('')
            }
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
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setAgencyList (state, payload) {
      state.agencyList = payload
    },
    setAgencyListThucHien (state, payload) {
      state.agencyListThucHien = payload
    },
    setDomainList (state, payload) {
      state.domainList = payload
    },
    setLevelList (state, payload) {
      state.levelList = payload
    },
    setIsMobile (state, payload) {
      state.isMobile = payload
    },
    setUserLogin (state, payload) {
      state.userLogin = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    index (state) {
      return state.index
    },
    getAgencyList (state) {
      return state.agencyList
    },
    getAgencyListThucHien (state) {
      return state.agencyListThucHien
    },
    getDomainList (state) {
      return state.domainList
    },
    getLevelList (state) {
      return state.levelList
    },
    getIsMobile (state) {
      return state.isMobile
    },
    getUserLogin (state) {
      return state.userLogin
    }
  }
})
