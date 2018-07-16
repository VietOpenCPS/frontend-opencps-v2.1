import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import $ from 'jquery'
// import router from '@/router'

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: null,
    loading: false,
    loadingTable: false,
    loadingDynamicBtn: false,
    error: null,
    user: null,
    index: 0,
    trangThaiHoSoList: null,
    listThuTucHanhChinh: null,
    lePhi: {
      fee: '',
      feeNote: '',
      request: ''
    },
    dossier: {
      applicantIdNo: 'ccc'
    },
    serviceConfigObj: {},
    dossierTemplateName: '',
    thongTinChungHoSo: {
      serviceName: '',
      dossierTemplateName: '',
      serviceConfig: '',
      serviceOption: '',
      dossierNo: '',
      receiveDate: new Date(),
      dueDate: (new Date()).toString(),
      durationDate: '',
      dossierId: '',
      dossierIdCTN: '',
      dossierStatus: '',
      dossierStatusText: ''
    },
    vnpostCodeItems: [],
    serviceConfigItems: null,
    serviceOptionItems: [],
    citys: null,
    cityVal: null,
    districtVal: null,
    wardVal: null,
    resultServices: null,
    dossierFiles: [],
    listHistoryProcessingItems: [],
    thanhPhanHoSo: {
      dossierTemplates: support.dossierTemplates
    },
    dossierTemplates: support.dossierTemplates,
    thongTinChuHoSo: {
      userType: true,
      cityCode: '',
      districtCode: '',
      wardCode: '',
      applicantNote: '',
      applicantIdNo: '',
      contactEmail: '',
      contactName: '',
      address: '',
      applicantName: ''
    },
    thongTinNguoiNopHoSo: {
      sameUser: true,
      delegateName: '',
      delegateCityCode: '',
      delegateAddress: '',
      delegateDistrictCode: '',
      delegateWardCode: '',
      delegateEmail: '',
      delegateTelNo: '',
      delegateIdNo: ''
    },
    dichVuChuyenPhatKetQua: {
      viaPostal: false,
      postalServiceCode: '',
      postalServiceName: '',
      postalAddress: '',
      postalCityCode: '',
      postalCityName: '',
      postalDistrictCode: '',
      postalDistrictName: '',
      postalWardCode: '',
      postalWardName: '',
      postalTelNo: '',
      vnPostCode: ''
    },
    data_phancong: []
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise((resolve, reject) => {
          let param = {}
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          /* test local */
          /* orginURL = 'http://127.0.0.1:8081/api/initdata' */
          /** */
          axios.get(orginURL + support.renderURLInit, param).then(function (response) {
            let serializable = response.data
            commit('setInitData', serializable)
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    loadMenuConfigToDo ({commit, state}) {
      commit('setLoadingDynamicBtn', true)
      if (state.trangThaiHoSoList === null) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get(state.initData.menuConfigToDo, param).then(function (response) {
              let serializable = response.data
              let menuData = []
              let index = 0
              for (let key in serializable.data) {
                let current = serializable.data[key]
                let menuDetail = {
                  'index': index,
                  'active': false,
                  'title': current['menuName'],
                  'id': current['menuGroup'],
                  'action': 'description',
                  'action_active': 'play_arrow',
                  'counter': -1,
                  'queryParams': current['queryParams']
                }
                index = index + 1
                let tableConfig = current['tableConfig']
                let buttonConfig = current['buttonConfig']
                if (tableConfig !== '' && tableConfig !== undefined && tableConfig !== 'undefined' && String(tableConfig).indexOf('{') !== -1 && String(tableConfig).indexOf('}') !== -1) {
                  menuDetail['tableConfig'] = JSON.parse(tableConfig)
                }
                if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                  menuDetail['buttonConfig'] = JSON.parse(buttonConfig)
                }
                if (current.hasOwnProperty('steps')) {
                  if (current.steps.length > 1) {
                    menuDetail['items'] = current.steps
                  } else {
                    let stepsItems = []
                    stepsItems.push(current.steps)
                    menuDetail['items'] = stepsItems
                  }
                }
                menuData.push(menuDetail)
              }
              commit('setLoadingDynamicBtn', false)
              commit('setMenuConfigToDo', menuData)
              resolve(menuData)
            }).catch(function (error) {
              commit('setLoadingDynamicBtn', false)
              console.log(error)
              reject(error)
            })
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          commit('setLoadingDynamicBtn', false)
          resolve(state.trangThaiHoSoList)
        })
      }
    },
    loadListThuTucHanhChinh ({commit, state}) {
      if (state.listThuTucHanhChinh === null) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get(state.initData.getListThuTucHanhChinh, param).then(function (response) {
              let serializable = response.data
              let thuTucArray = Array.from(serializable.data)
              thuTucArray.unshift({
                'serviceConfigId': '0',
                'serviceName': 'Toàn bộ thủ tục'
              })
              commit('setListThuTucHanhChinh', thuTucArray)
              resolve(thuTucArray)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          let thuTucArray = Array.from(state.listThuTucHanhChinh)
          thuTucArray.unshift({
            'serviceConfigId': '0',
            'serviceName': 'Toàn bộ thủ tục'
          })
          resolve(thuTucArray)
        })
      }
    },
    loadingDataHoSo ({commit, state}, filter) {
      commit('setLoadingTable', true)
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 15 - 15,
              end: filter.page * 15,
              agency: filter.agency,
              service: filter.service,
              template: filter.template,
              status: filter.statusSearch,
              dueCode: filter.dueSearch,
              register: filter.registerSearch,
              keyword: filter.keywordSearch
            }
          }
          axios.get(filter.queryParams, param).then(function (response) {
            let serializable = response.data
            commit('setLoadingTable', false)
            resolve(serializable)
          }).catch(function (error) {
            commit('setLoadingTable', false)
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadingCounterHoSo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.counterMenuStep, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadDictItems ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              parent: data.parent
            }
          }
          axios.get(state.initData.regionApi + '/' + data.collectionCode + '/dictitems', param).then(function (response) {
            let serializable = response.data
            if (data.collectionCode === 'ADMINISTRATIVE_REGION') {
              if (data.level === 0) {
                commit('setCitys', serializable.data)
              }
            }
            resolve(response.data)
          }, error => {
            reject(error)
          })
        })
      })
    },
    resetThongTinChungHoSo ({ commit }) {
      let data = {
        serviceConfig: {},
        serviceOption: '',
        receiveDate: new Date(),
        dueDate: (new Date()).toString(),
        durationDate: '',
        dossierId: '',
        dossierNo: '',
        govAgencyName: '',
        dossierIdCTN: '',
        processBlock: '',
        processUnit: '',
        dossierStatus: '',
        dossierStatusText: '',
        submitDate: ''
      }
      commit('setThongTinChungHoSo', data)
    },
    resetThongTinChuHoSo ({ commit }) {
      let data = {
        userType: true,
        cityCode: 25,
        districtCode: '',
        wardCode: '',
        applicantNote: '',
        applicantIdNo: '',
        contactEmail: '',
        contactName: '',
        address: '',
        applicantName: ''
      }
      commit('setThongTinChuHoSo', data)
    },
    resetThongTinNguoiNopHoSo ({ commit }) {
      let data = {
        sameUser: '',
        delegateName: '',
        delegateCityCode: 25,
        delegateAddress: '',
        delegateDistrictCode: '',
        delegateWardCode: '',
        delegateEmail: '',
        delegateTelNo: '',
        delegateIdNo: ''
      }
      commit('setThongTinNguoiNopHoSo', data)
    },
    resetThanhPhanHoSo ({ commit }) {
      commit('setDossierTemplates', [])
    },
    loadDossierMark ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let paramDossierMark = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            type: 1
          }
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/marks', paramDossierMark).then(function (response) {
          let serializable = response.data
          resolve(serializable.data)
        }, error => {
          reject(error)
        })
      })
    },
    loadDossierTemplates ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.dossierTemplatesApi + '/' + data.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.dossierParts)
          }, error => {
            reject(error)
          })
        })
      })
    },
    loadAllDossierTemplates ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.dossierTemplatesApi + '/' + data.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.dossierParts)
          }, error => {
            reject(error)
          })
        })
      })
    },
    deleteAttackFiles ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        console.log('data -delete-----', data)
        console.log('data-- dossier file-------', state.dossierFiles)
        var dataPut = new URLSearchParams()
        if (data.hasForm || data.eform) {
          axios.put(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.referenceUid + '/resetformdata', dataPut, param).then(function (response) {
            console.log('success')
            resolve(response)
          }).catch(function (xhr) {
            console.log(xhr)
            reject(xhr)
          })
        } else {
          axios.delete(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.fileTemplateNo + '/all', param).then(function (response) {
            console.log('success!')
            resolve(response)
          }).catch(function (xhr) {
            console.log(xhr)
            reject(xhr)
          })
        }
      })
    },
    resetCounterTemplate ({commit, state}, data) {
      state.dossierTemplates.forEach(val => {
        if (val.partNo === data.partNo) {
          if (val.hasForm) {
            val.count = 1
          } else {
            val.count = 0
          }
        }
      })
    },
    deleteSingleFile ({ commit, state }, data) {
      let param = {
        headers: {
          groupId: state.initData.groupId
        }
      }
      axios.delete(state.initData.dossierApi + '/' + state.thonTinChungHoSo.dossierId + '/files/' + data.referenceUid, param).then(function (response) {
        console.log('success')
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    uploadSingleFile ({ commit, state }, e) {
      return new Promise((resolve, reject) => {
        let files = e.target.files || e.dataTransfer.files
        let file = files[0]
        let data = e.dataItem
        let formData = new FormData()
        formData.append('displayName', file.name)
        formData.append('fileType', file.type)
        formData.append('fileSize', file.size)
        formData.append('isSync', 'false')
        formData.append('file', file)
        formData.append('dossierPartNo', data.partNo)
        formData.append('dossierTemplateNo', e.dossierTemplateNo)
        formData.append('fileTemplateNo', data.partNo)
        formData.append('formData', '')
        formData.append('referenceUid', '')
        axios.post(state.initData.dossierApi + '/' + e.dossierId + '/files', formData, {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (response) {
          resolve(response.data)
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          console.log('upload file success!')
        }).catch(function (xhr) {
          console.log(xhr)
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          reject(xhr)
        })
      })
    },
    getDetailDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          if (data > 0) {
            commit('setLoading', true)
            axios.get(state.initData.postDossierApi + '/' + data, param).then(function (response) {
              let thongTinNguoiNop = {
                delegateName: response.data.delegateName,
                delegateCityCode: response.data.delegateCityCode,
                delegateAddress: response.data.delegateAddress,
                delegateDistrictCode: response.data.delegateDistrictCode,
                delegateWardCode: response.data.delegateWardCode,
                delegateEmail: response.data.delegateEmail,
                delegateTelNo: response.data.delegateTelNo,
                delegateIdNo: response.data.delegateIdNo
              }
              commit('setLoading', false)
              commit('setDossier', response.data)
              commit('setThongTinChuHoSo', response.data)
              commit('setLePhi', response.data)
              commit('setThongTinNguoiNopHoSo', thongTinNguoiNop)
              commit('setThongTinChungHoSo', response.data)
              commit('setDichVuChuyenPhatKetQua', response.data)
              resolve(response.data)
            }, error => {
              commit('setLoading', false)
              reject(error)
            }).catch(function (xhr) {
              console.log(xhr)
            })
          } else {
            resolve()
          }
        })
      })
    },
    getGovAgency ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let paramGetGovAgency = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            sort: 'sibling'
          }
        }
        axios.get(state.initData.regionApi + '/GOVERMENT_AGENCY/dictitems', paramGetGovAgency).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    loadDossierFiles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.initData.dossierApi + '/' + data + '/files', param).then(function (response) {
          commit('setDossierFiles', response.data.data)
          if (response.data.data) {
            resolve(response.data.data)
          } else {
            resolve([])
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    viewFile ({commit, state, dispatch}, data) {
      let param = {
        headers: {
          groupId: state.initData.groupId
        },
        responseType: 'blob'
      }
      axios.get(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.referenceUid, param).then(function (response) {
        var url = window.URL.createObjectURL(response.data)
        window.open(url, '_blank')
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    postDossier ({ commit, state }, data) {
      console.log('data-------------', data)
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': state.initData.cps_auth
          }
        }
        var dataPostdossier = new URLSearchParams()
        dataPostdossier.append('serviceCode', data.serviceCode)
        dataPostdossier.append('govAgencyCode', data.govAgencyCode)
        dataPostdossier.append('dossierTemplateNo', data.templateNo)
        dataPostdossier.append('originality', data.originality)
        console.log('dataPostdossier-------------', dataPostdossier)
        axios.post(state.initData.postDossierApi, dataPostdossier, options).then(function (response) {
          response.data.serviceConfig = state.serviceConfigObj
          commit('setLoading', false)
          commit('setDossier', response.data)
          commit('setThongTinChuHoSo', response.data)
          commit('setLePhi', response.data)
          commit('setThongTinChungHoSo', response.data)
          commit('setDichVuChuyenPhatKetQua', response.data)
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    doCopy ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json'
          }
        }
        var dataPostdossier = new URLSearchParams()
        axios.post(state.initData.postDossierApi + '/' + filter.dossierId + '/cloning', dataPostdossier, options).then(function (response) {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    doCancel ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json'
          }
        }
        var dataPostdossier = new URLSearchParams()
        axios.post(state.initData.postDossierApi + '/' + filter.dossierId + '/cancel', dataPostdossier, options).then(function (response) {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    putDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', false)
        let options = {
          headers: {
            groupId: state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': state.initData.cps_auth
          }
        }
        var applicantType = ''
        if (data.userType) {
          applicantType = 'business'
        } else {
          applicantType = 'citizen'
        }
        var dataPutdossier = new URLSearchParams()
        dataPutdossier.append('applicantName', data.applicantName)
        dataPutdossier.append('dossierNo', data.dossierNo)
        dataPutdossier.append('applicantIdType', applicantType)
        dataPutdossier.append('applicantIdNo', data.applicantIdNo)
        dataPutdossier.append('address', data.address)
        dataPutdossier.append('cityCode', data.cityCode)
        dataPutdossier.append('districtCode', data.districtCode)
        dataPutdossier.append('wardCode', data.wardCode)
        dataPutdossier.append('contactTelNo', data.contactTelNo)
        dataPutdossier.append('contactEmail', data.contactEmail)
        dataPutdossier.append('delegateName', data.delegateName)
        dataPutdossier.append('delegateIdNo', data.delegateIdNo)
        dataPutdossier.append('delegateTelNo', data.delegateTelNo)
        dataPutdossier.append('delegateEmail', data.delegateEmail)
        dataPutdossier.append('delegateAddress', data.delegateAddress)
        dataPutdossier.append('delegateCityCode', data.delegateCityCode)
        dataPutdossier.append('delegateDistrictCode', data.delegateDistrictCode)
        dataPutdossier.append('delegateWardCode', data.delegateWardCode)
        dataPutdossier.append('applicantNote', data.applicantNote)
        if (data.viaPostal) {
          dataPutdossier.append('viaPostal', data.viaPostal ? 1 : 0)
          dataPutdossier.append('postalServiceCode', data.postalServiceCode)
          dataPutdossier.append('postalServiceName', data.postalServiceName)
          dataPutdossier.append('postalAddress', data.postalAddress)
          dataPutdossier.append('postalCityCode', data.postalCityCode)
          dataPutdossier.append('postalDistrictCode', data.postalDistrictCode)
          dataPutdossier.append('postalWardCode', data.postalWardCode)
          dataPutdossier.append('postalTelNo', data.postalTelNo)
        }
        axios.put(state.initData.postDossierApi + '/' + data.dossierId, dataPutdossier, options).then(function (response) {
          resolve(response.data)
          commit('setLoading', false)
          commit('setDossier', response.data)
          commit('setThongTinChuHoSo', response.data)
          commit('setThongTinChungHoSo', response.data)
          commit('setLePhi', response.data)
          commit('setDichVuChuyenPhatKetQua', response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    putDuedateDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', false)
        let options = {
          headers: {
            groupId: state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        var dataPutdossier = new URLSearchParams()
        dataPutdossier.append('dueDate', data)
        axios.put(state.initData.postDossierApi + '/' + state.thongTinChungHoSo.dossierId, dataPutdossier, options).then(function (response) {
          resolve(response.data)
          // commit('setLoading', false)
          // commit('setDossier', response.data)
          // commit('setThongTinChuHoSo', response.data)
          // commit('setThongTinChungHoSo', response.data)
          // commit('setLePhi', response.data)
          // commit('setDichVuChuyenPhatKetQua', response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    submitDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.initData.dossierApi + '/' + state.thongTinChungHoSo.dossierId + '/submitting', param).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
          console.log(xhr)
        })
      })
    },
    postDossierMark ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': state.initData.cps_auth
          }
        }
        var dataPostdossierMark = new URLSearchParams()
        dataPostdossierMark.append('fileCheck', data.fileCheck)
        dataPostdossierMark.append('fileType', data.fileType)
        let url = state.initData.dossierApi + '/' + data.dossierId + '/marks/' + data.partNo
        axios.post(url, dataPostdossierMark, options).then(function (response) {
          resolve(response.data)
          commit('setLoading', false)
        }).catch(function (xhr) {
          reject(xhr)
          // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    postAction ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        var dataPostActionDossier = new URLSearchParams()
        dataPostActionDossier.append('actionCode', data.actionCode)
        dataPostActionDossier.append('actionNote', data.actionNote)
        dataPostActionDossier.append('actionUser', data.actionUser)
        dataPostActionDossier.append('payload', data.payload)
        dataPostActionDossier.append('security', data.security)
        dataPostActionDossier.append('assignUsers', data.assignUsers)
        dataPostActionDossier.append('payment', data.payment)
        dataPostActionDossier.append('createDossiers', data.createDossiers)
        let url = state.initData.dossierApi + '/' + data.dossierId + '/actions'
        axios.post(url, dataPostActionDossier, options).then(function (response) {
          resolve(response.data)
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          commit('setLoading', false)
        }).catch(function (xhr) {
          reject(xhr)
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    getUserInfoFromApplicantIdNo ({ commit, state }, data) {
      store.dispatch('loadInitResource').then(function (result) {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.initData.applicantApi + '/' + data, param).then(function (response) {
          // state.thongTinChuHoSo.applicantIdNo = response.data.applicantIdNo
          // state.thongTinChuHoSo.applicantName = response.data.applicantName
          // state.thongTinChuHoSo.address = response.data.address
          // state.thongTinChuHoSo.contactEmail = response.data.contactEmail
          // state.thongTinChuHoSo.contactTelNo = response.data.contactTelNo
          // state.thongTinChuHoSo.city = response.data.city
          // state.thongTinChuHoSo.district = response.data.district
          // state.thongTinChuHoSo.ward = response.data.ward
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    loadAlpcaForm ({ commit, state, dispatch }, data) {
      console.log('alpaca')
      /* eslint-disable */
      var formScript, formData
      if (data.formScript) {
        formScript = eval('(' + data.formScript + ')')
      } else {
        formScript = {}
      }
      if (data.formData) {
        formData = eval('(' + data.formData + ')')
      } else {
        formData = {}
      }
      /* eslint-disable */
      formScript.data = formData
      $('#formAlpaca' + data.dossierPartNo).alpaca(formScript)
    },
    putAlpacaForm ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId,
            cps_auth: state.initData.cps_auth
          }
        }
        try {
          var control = $('#formAlpaca' + data.dossierPartNo).alpaca('get')
          var formData = control.getValue()
          console.log('Data Form ------', data)
          console.log('formData-------', formData)
          var dataPutAlpacaForm = new URLSearchParams()
          dataPutAlpacaForm.append('formdata', JSON.stringify(formData))
          let url = state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.referenceUid + '/formdata'
          axios.put(url, dataPutAlpacaForm, options).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(data)
          })
        } catch (e) {
          console.log(e)
          reject(data)
        }
      })
    },
    postVNPOST ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        var dataVnPost = new URLSearchParams()
        dataVnPost.append('customerCode', 'ccth')
        dataVnPost.append('orderNumber', state.thongTinChungHoSo.dossierId)
        dataVnPost.append('senderProvince', data.senderProvince)
        dataVnPost.append('senderAddress', data.senderAddress)
        dataVnPost.append('senderName', data.senderName)
        dataVnPost.append('senderTel', data.senderTel)
        dataVnPost.append('receiverName', data.receiverName)
        dataVnPost.append('receiverAddress', data.receiverAddress)
        dataVnPost.append('receiverTel', data.receiverTel)
        dataVnPost.append('receiverProvince', data.receiverProvince)
        let url = '/o/rest/v2/postal/vnpost'
        axios.post(url, dataVnPost, options).then(function (response) {
          resolve(response.data)
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          commit('setLoading', false)
        }).catch(function (xhr) {
          reject(xhr)
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    getDossierTemplateEdit ({commit, state}) {
      return new Promise((resolve, reject) => {
        var dossierTemplatesTemp = state.dossierTemplates
        var resultTemp = []
        try {
          if (state.dossierFiles.length === 0) {
            dispatch('loadDossierFiles').then(result => {
              result.forEach(itemFile => {
                dossierTemplatesTemp.forEach(itemTemplate => {
                  if (itemFile.dossierPartNo === itemTemplate.partNo) {
                    resultTemp.push({
                      partName: itemTemplate.partName,
                      partNo: itemTemplate.partNo,
                      displayName: itemFile.displayName,
                      dossierFileId: itemFile.dossierFileId,
                      partType: itemTemplate.partType,
                      hasForm: itemTemplate.hasForm,
                      fileType: itemFile.fileType,
                      referenceUid: itemFile.referenceUid
                    })
                  }
                })
              })
              resolve(resultTemp)
            }).catch(reject => {
              console.log(reject)
              resolve([])
            })
          } else {
            state.dossierFiles.forEach(itemFile => {
              dossierTemplatesTemp.forEach(itemTemplate => {
                if (itemFile.dossierPartNo === itemTemplate.partNo) {
                  resultTemp.push({
                    partName: itemTemplate.partName,
                    partNo: itemTemplate.partNo,
                    displayName: itemFile.displayName,
                    dossierFileId: itemFile.dossierFileId,
                    partType: itemTemplate.partType,
                    hasForm: itemTemplate.hasForm,
                    fileType: itemFile.fileType,
                    referenceUid: itemFile.referenceUid
                  })
                }
              })
            })
          }
          resolve(resultTemp)
          console.log(resultTemp)
        } catch (e) {
          console.log(e)
          reject([])
        }
      })
    },
    loadPlugin ({commit, state}, item) {
      return new Promise((resolve, reject) => {
        item.plugin = true
        var urlPluginFormData = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.actionId + '/formdata'
        var urlPluginFormScript = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.actionId + '/formscript'
        var config_plugins = {
          headers: {
            'groupId': state.initData.groupId
          },
          dataType: 'text'
        }
        axios.all([
          axios.get(urlPluginFormScript, config_plugins),
          axios.get(urlPluginFormData, config_plugins)
          ]).then( axios.spread(function (urlResponesFormScript, urlResponesFormData) {
            var responseScript = urlResponesFormScript.data
            var responseData = urlResponesFormData.data
            console.log('responseScript==============', responseScript)
            item.plugin = true
            if(responseScript.indexOf('#preview@pdf') !== -1){
              console.log('view pdf')
              var url = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processActionId + '/preview' 
              var config_blob =  {
                headers: {
                  'groupId': state.initData.groupId
                },
                responseType: 'blob'
              }
              axios.get(url, config_blob).then(function (response) {
                var urlblob = window.URL.createObjectURL(response.data)
                item.pdf = true
                item.url = urlblob
                item.no_pdf = ''
                resolve(item)
              }).catch(function (error) {
                console.log(error)
                item.pdf = true
                item.url = ''
                item.no_pdf = 'Tài liệu đính kèm không tồn tại!'
                resolve(item)
              })
            }
            if(responseScript.indexOf('#preview@html') !== -1){
              console.log('view html')
              var config_view = {
                headers: {
                  'groupId': state.initData.groupId
                },
                dataType: 'json'
              }
              item.html = true
              item.no_html = ''
              var url = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processActionId + '/previewhtml'
              axios.get(url, config_view).then(function (response) {
                item.no_html = ''
                vm.stepModel = item
                var serializable = response.data 
                var partNo = serializable.partNo
                var dossierFileId = serializable.dossierFileId
                var formReport = eval('(' + serializable.formReport + ')')
                var formData = eval('(' + serializable.formData + ')')
                console.log('formReport======', formReport)
                console.log('formData======', formData)
                formReport.data = formData
                console.log('formReport_____FINAL=======', formReport)
                $('#alpacajs_form_plugin').alpaca(formReport)
              }).catch(function (error) {
                console.log(error)
                item.html = true
                item.no_html = 'Tài liệu đính kèm không tồn tại!'
                resolve(item)
              })
            }
          })).catch(function (xhr) {
            console.log(xhr)
            reject(xhr)
          })
        })
    },
    setDefaultCityCode ({commit, state}, data) {
      state.thongTinChuHoSo.cityCode = data
    },
    getListHistoryProcessingItems ({commit, state}, data){    
      var vm = this
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {}
          }
          var listHistoryProcessing = []
          axios.get(state.initData.dossierlogsApi + '/' + data.dossierId + '/logs', param).then(function (response) {
            var serializable = response.data
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
    loadDossierLogs ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            notificationType: data.type
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/logs'
        axios.get(url, config).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    downloadFile ({commit, state}, data){
      var vm = this
      let param = {
        headers: {
          groupId: state.initData.groupId
        },
        responseType: 'blob'
      }
      axios.get(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.fileAttachId, param).then(function (response) {
        var url = window.URL.createObjectURL(response.data)
        window.open(url)
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    getCpsAuthen ({commit, state}) {
      var vm = this
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {}
        }
        axios.get('http://127.0.0.1:8081/api/onegate/token', param).then(function (response) {
          resolve(response.data)
          // resolve('asa1wsasaaddsdsdscsfsfs1212121212')
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    // action for comment component
    loadUsersComment ({commit, state}, id) {
      var vm = this
      return new Promise((resolve, reject) => {
        var users = []
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            userMapping: true
          }
        }
        axios.get(state.initData.dossierApi + '/' + id + '/contacts', param).then(function (response) {
          if(response != null && response.hasOwnProperty('data')){
            let contacts = response.data
            $.each(contacts, function(index, item){
              var user = {}
              user.id = item.userId
              user.fullname = item.userName
              user.email = item.email
              user.profilePictureURL = item.profileUrl
              users.push(user)
            })
          } else {
            users = []
          }
          resolve(users)
        })
        .catch(function (error) {
          users = []
          reject(users)
        })
      })
    },
    loadCommentItems ({commit, state}, data) {
      var vm = this
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {}
        }
        axios.get(state.initData.commentApi + '/' + data.className + '/' + data.classPK, param).then(function (response) {
          resolve(response.data.data)
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    postComment ({commit, state}, data) {
      var vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        var strPings = data.pings.join()
        var params = new URLSearchParams()
        params.append('className', data.className)
        params.append('classPK', data.classPK)
        params.append('parent', data.parent != null ? data.parent : 0)
        params.append('pings', strPings)
        params.append('content', data.content)
        params.append('upvoteCount', data.upvoteCount != null ? data.upvoteCount : 0)
        params.append('opinion', data.opinion)

        axios.post(state.initData.commentApi, params, config)
        .then(function (response) {
          var resPostCmt = {}
          if (response != null) {
            resPostCmt = response.data
            console.log('resPostCmt', resPostCmt)
          }
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(resPostCmt)
        })
        .catch(function (error) {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          console.log(error)
        })
      })
    },
    putComment ({commit, state}, data) {
      var vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        var strPings = data.pings.join()
        var params = new URLSearchParams()
        // params.append('className', data.className)
        // params.append('classPK', data.classPK)
        // params.append('parent', data.parent != null ? data.parent : 0)
        params.append('pings', strPings)
        params.append('content', data.content)
        // params.append('upvoteCount', data.upvoteCount != null ? data.upvoteCount : 0)
        console.log('dataPut', data)
        axios.put(state.initData.commentApi + '/' + data.commentId, params, config)
        .then(function (response) {
          var resPutCmt = {}
          if (response != null) {
            resPutCmt = response.data
          }
          resolve(resPutCmt)
        })
        .catch(function (error) {
          // onError()
          console.log(error)
        })
      })
    },
    deleteComment ({commit, state}, data) {
      var vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        axios.delete(state.initData.commentApi + '/' + data.commentId, config)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    upvoteComment ({commit, state}, data) {
      var vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        if (data.userHasUpvoted) {
          var params = new URLSearchParams()
          params.append('className', data.className)
          params.append('classPK', data.classPK)
          params.append('commentId', data.commentId)
          params.append('upvoteCount', data.upvoteCount != null ? data.upvoteCount : 0)
          axios.put(state.initData.commentApi + '/' + data.commentId + '/upvotes',
            params,
            config
          )
          .then(function (response) {
            var res = {}
            if (response != null) {
              res = response.data
            }
            resolve(res)
          })
          .catch(function (error) {
            console.log(error)
          })  
        } else {
          axios.delete(state.initData.commentApi + '/' + data.commentId + '/upvotes', config).then(function (response) {
            var res = {}
            if (response != null) {
              res = response.data
            }
            resolve(res)
          })
          .catch(function (error) {
            console.log(error)
          })  
        }
      })
    },
    loadProcessStep ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          var vm = this
          var url = state.initData.dossierApi + '/' + data.dossierId + '/nextactions'
          var urlPlugin = state.initData.dossierApi + '/' + data.dossierId + '/plugins'
          axios.all([
            axios.get(url, config),
            axios.get(urlPlugin, config)
            ]).then( axios.spread(function (urlRespones, urlPluginsRespones) {
              var serializable = urlRespones.data.data
              var serializablePlugins = urlPluginsRespones.data.data
              var serializablePluginsConvert = []
              var serializableNextActionConvert = []
              if(serializable){
                for (var i = 0; i < serializable.length; i++) {
                  serializable[i].type = 1
                  if(serializable[i].configNote){
                    var configNote = JSON.parse(serializable[i].configNote)
                    serializable[i].configNote = configNote
                  }
                  serializableNextActionConvert.push(serializable[i])
                }
              }else {
                serializable = []
                serializableNextActionConvert = []
              }
              if (serializablePlugins) {
                for (var i = 0; i < serializablePlugins.length; i++) {
                  var plugin = {
                    type: 2,
                    processActionId: serializablePlugins[i].processPluginId,
                    actionName: serializablePlugins[i].pluginName
                  }
                  serializablePluginsConvert.push(plugin)
                }
              }
              var nextactions = serializableNextActionConvert
              var plugins = serializablePluginsConvert
              console.log('nextactions++++++++++++', nextactions)
              console.log('plugins++++++++++++', plugins)
              nextactions.push(...plugins);
              console.log('nextactions2++++++++++++', nextactions)
              resolve(nextactions)
            }))
            .catch(function (xhr) {
              reject(xhr)
            })
          })
        })
      },
      pullNextactions ({commit, state}, filter) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            console.log('result', result)
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/nextactions', param).then(function (response) {
              let serializable = response.data
              resolve(serializable.data)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          })
        })
      },
      loadDossierDocuments ({commit, state}, data) {
        let config = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            // abc: dât.abc
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/documents'
        return new Promise((resolve, reject) => {
          axios.get(url, config).then(function (response) {
            resolve(response.data.data)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      },
      loadDossierPayments ({commit, state}, data) {
        let config = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            // abc: data.abc
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/payment'
        return new Promise((resolve, reject) => {
          axios.get(url, config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      },
      postDossierPayments ({commit, state}, data) {
        let config = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        var params = new URLSearchParams()
        params.append('paymentFee', data.paymentFee)
        params.append('paymentNote', data.paymentNote)
        let url = state.initData.dossierApi + '/' + data.dossierId + '/payment'
        return new Promise((resolve, reject) => {
          axios.post(url, params, config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      },
      loadDossierActions ({commit, state}, data) {
        let config = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            stepType: data.stepType
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/sequences'
        return new Promise((resolve, reject) => {
          axios.get(url, config).then(function (response) {
            resolve(response.data)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      },
      loadDossierLienThong ({commit, state}, classPK) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              },
              params: {
                origin: classPK
              }
            }
            axios.get(state.initData.dossierApi, param).then(function (response) {
              let serializable = response.data.data
              if (serializable.length > 0) {
                for (var key in serializable) {
                  serializable[key].dossierLog = []
                }
              }
              resolve(serializable)
            }).catch(function (error) {
              reject(error)
            })
          })
        })
      },
      loadDossierSyncs ({commit, state}, data) {
        return new Promise((resolve, reject) => {
          let config = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              info: data.info
            }
          }
          let url = state.initData.dossierApi + '/' + data.dossierId + '/syncs'
          axios.get(url, config).then(function (response) {
            resolve(response.data.data)
          }).catch(function (xhr) {
            reject(xhr)
        })
      })
    },
    processDossierRouter ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          let formData = new URLSearchParams()
          formData.append('actionCode', filter.actionCode)
          axios.post(state.initData.getNextAction + '/' + filter.dossierId + '/actions', formData, param).then(function (response) {
            let serializable = response.data
            toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    deleteDossier ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.delete(state.initData.getNextAction + '/' + filter.dossierId , param).then(function (response) {
            let serializable = response.data
            toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    doPrint01 ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/documents/preview/' + filter.document, param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    doPrint03 ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/documents/print', param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    doGuiding ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get(state.initData.getServiceConfigs + '/' + filter.serviceConfigId + '/guide', param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    doPrint02 ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          let formData = new URLSearchParams()
          formData.append('serviceCode', filter.serviceCode)
          formData.append('govAgencyCode', filter.govAgencyCode)
          formData.append('dossiers', filter.dossiers)
          axios.post(state.initData.getNextAction + '/preview/' + filter.document ,formData , param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    processPullBtnDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/nextactions/' + filter.actionId, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getNextAction ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.dossierApi + '/' + filter.dossierId + '/nextactions/' + filter.actionId, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            resolve([])
            reject(error)
          })
        })
      })
    },
    loadFormScript ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: state.initData.dossierTemplatesApi + '/' + data.templateFileNo + '/parts/' + data.partNo + '/formscript',
            type: 'GET',
            headers: {
              groupId: state.initData.groupId
            },
            dataType: 'text',
            success: function (result) {
              let serializable = result
              resolve(serializable)
            },
            error: function (xhr) {
              console.log(xhr)
              resolve(xhr)
              reject(xhr)
            }
          })
        })
      })
    },
    loadFormData ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: state.initData.dossierTemplatesApi + '/' + data.templateFileNo + '/parts/' + data.partNo + '/formdata',
            type: 'GET',
            headers: {
              groupId: state.initData.groupId
            },
            dataType: 'text',
            success: function (result) {
              let serializable = result
              resolve(serializable)
            },
            error: function (xhr) {
              console.log(xhr)
              resolve(xhr)
              reject(xhr)
            }
          })
        })
      })
    },
    loadDossierCounting ({state, commit}, data) {
      let config = {
        headers: {
          groupId: state.initData.groupId
        }
      }
      let url = '/o/rest/v2/statistics/dossiers/counting'
      return new Promise((resolve, reject) => {
        axios.get(url, config).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    reassignDossier ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let formData = new URLSearchParams()
          formData.append('toUsers', JSON.stringify(data.toUsers))
          axios.put(state.initData.dossierApi + '/' + data.dossierId + '/reassign' ,formData , param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            reject(error)
          })
        })
      })
    }
    // ----End---------
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setLoadingTable (state, payload) {
      state.loadingTable = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setIndex (state, payload) {
      state.index = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setMenuConfigToDo (state, payload) {
      state.trangThaiHoSoList = payload
    },
    setDataPhanCong (state, payload) {
      state.data_phancong = payload
    },
    setLoadingDynamicBtn (state, payload) {
      state.loadingDynamicBtn = payload
    },
    setListThuTucHanhChinh (state, payload) {
      state.listThuTucHanhChinh = payload
    },
    setDossierTemplateName (state, payload) {
      state.dossierTemplateName = payload
    },
    setIsDetail (state, payload) {
      state.isDetail = payload
    },
    setLePhi (state, payload) {
      state.lePhi.fee = payload.paymentFee
      state.lePhi.feeNote = payload.paymentFeeNote
    },
    setThanhPhanHoso (state, payload) {
      state.thanhPhanHoSo = payload
    },
    setThanhPhanHosoTemplates (state, payload) {
      state.thanhPhanHoSo.dossierTemplates = payload
    },
    setThongTinChuHoSo (state, payload) {
      let userTypeCondition = true
      if (payload.applicantIdType === 'business') {
        userTypeCondition = false
      }
      let thongTinChuHoSoPayLoad = {
        applicantIdNo: payload.applicantIdNo,
        applicantName: payload.applicantName,
        address: payload.address,
        // cityCode: payload.cityCode,
        cityCode: payload.cityCode,
        districtCode: payload.districtCode,
        wardCode: payload.wardCode,
        contactEmail: payload.contactEmail,
        contactTelNo: payload.contactTelNo,
        userType: userTypeCondition,
        applicantNote: payload.applicantNote
      }
      state.thongTinChuHoSo = thongTinChuHoSoPayLoad
    },
    setThongTinNguoiNopHoSo (state, payload) {
      state.thongTinNguoiNopHoSo = Object.assign(state.thongTinNguoiNopHoSo, payload)
    },
    setDichVuChuyenPhatKetQua (state, payload) {
      let tempData = {
        viaPostal: payload.viaPostal,
        postalServiceCode: payload.postalServiceCode,
        postalServiceName: payload.postalServiceName,
        postalAddress: payload.postalAddress,
        postalCityCode: payload.postalCityCode,
        postalCityName: payload.postalCityName,
        postalDistrictCode: payload.postalDistrictCode,
        postalDistrictName: payload.postalDistrictName,
        postalWardCode: payload.postalWardCode,
        postalWardName: payload.postalWardName,
        postalTelNo: payload.postalTelNo
      }
      state.dichVuChuyenPhatKetQua = tempData
    },
    setServiceConfigObj (state, payload) {
      state.serviceConfigObj = payload
    },
    setThongTinChungHoSo (state, payload) {
      var durationText
      if (payload.processUnit === 1 && payload.processBlock > 8) {
        let day = Math.floor(payload.processBlock/8) + ' ngày'
        let hours
        if (payload.processBlock%8 !== 0) {
          hours = ((payload.processBlock / 8) - Math.floor(payload.processBlock / 8)) * 8 + ' giờ'
        } else {
          hours = ''
        }
        durationText = `${day} ${hours}`
      } else if (payload.processUnit === 0) {
        durationText = payload.processBlock + ' ngày'
      } else if (payload.processUnit === 1 && payload.processBlock <= 8) {
        durationText = payload.processBlock + ' giờ'
      }
      let thongTinChungHoSoPayLoad = {
        dossierTemplateNo: payload.dossierTemplateNo,
        dossierTemplateName: payload.dossierTemplateName,
        serviceName: payload.serviceName,
        serviceConfig: payload.serviceConfig,
        serviceOption: payload.dossierTemplateNo,
        receiveDate: new Date(payload.receiveDate),
        dueDate: (new Date(payload.dueDate)).toString(),
        durationDate: durationText,
        dossierId: payload.dossierId,
        dossierIdCTN: payload.dossierIdCTN,
        dossierStatus: payload.dossierStatus,
        dossierNo: payload.dossierNo,
        govAgencyName: payload.govAgencyName,
        dossierStatusText: payload.dossierStatusText,
        submitDate: payload.submitDate
      }
      state.thongTinChungHoSo = thongTinChungHoSoPayLoad
    },
    setThongTinChungHoSoDueDate (state, payload) {
      state.thongTinChungHoSo.dueDate = payload
    },
    setThongTinChungHoSoDurationDate (state, payload) {
      state.thongTinChungHoSo.durationDate = payload
    },
    setThongTinChungHoSoReceiveDate (state, payload) {
      state.thongTinChungHoSo.receiveDate = payload
    },
    setserviceConfigItems (state, payload) {
      state.serviceConfigItems = payload
    },
    setServiceOptionItems (state, payload) {
      state.serviceOptionItems = payload
    },
    setServiceOptionThongTinChungHoSo (state, payload) {
      state.thongTinChungHoSo.serviceOption = payload
    },
    setCitys (state, payload) {
      state.citys = payload
    },
    setResultServices (state, payload) {
      state.resultServices = payload
    },
    setDossierTemplates (state, payload) {
      state.dossierTemplates = payload
    },
    setDossier (state, payload) {
      state.dossier = payload
    },
    setDanhSachHoSo (state, payload) {
      state.danhSachHoSo = payload
    },
    setCityVal (state, payload) {
      state.cityVal = payload
    },
    setDistrictVal (state, payload) {
      state.districtVal = payload
    },
    setWardVal (state, payload) {
      state.wardVal = payload
    },
    setDossierFiles (state, payload) {
      state.dossierFiles = payload
    },
    setSameUser (state, payload) {
      state.thongTinNguoiNopHoSo.sameUser = payload
    },
    setSameUser2 (state, payload) {
      state.sameUser2 = payload
    },
    setPrintPH (state, payload) {
      state.printPH = payload
    },
    setlistHistoryProcessingItems (state, payload) {
      state.listHistoryProcessingItems = payload
    },
    setUsersComment (state, payload) {
      state.usersComment = payload
    },
    setCommentItems (state, payload) {
      state.commentItems = payload
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    loadingTable (state) {
      return state.loadingTable
    },
    error (state) {
      return state.error
    },
    index (state) {
      return state.index
    },
    loadingMenuConfigToDo (state) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadMenuConfigToDo').then(function (result) {
          resolve(result)
        })
      })
    },
    loadingInitData (state) {
      return state.initData
    },
    loadingDynamicBtn (state) {
      return state.loadingDynamicBtn
    },
    loadingListThuTucHanhChinh (state) {
      store.dispatch('loadListThuTucHanhChinh')
    },
    lePhi (state) {
      return state.lePhi
    },
    isDetail (state) {
      return state.isDetail
    },
    dossierTemplateName (state) {
      return state.dossierTemplateName
    },
    thongTinChungHoSo (state, config) {
      return state.thongTinChungHoSo
    },
    thongTinChuHoSo (state) {
      return state.thongTinChuHoSo
    },
    thanhPhanHoSo (state) {
      return state.thanhPhanHoSo
    },
    thongTinNguoiNopHoSo (state) {
      return state.thongTinNguoiNopHoSo
    },
    dichVuChuyenPhatKetQua (state) {
      return state.dichVuChuyenPhatKetQua
    },
    serviceOptionItems (state) {
      return state.serviceOptionItems
    },
    getDictItems (state) {
      return (filter) => {
        if (filter.collectionCode === 'ADMINISTRATIVE_REGION' && filter.level === 0) {
          if (state.citys == null) {
            return store.dispatch('loadDictItems', filter)
          } else {
            return new Promise((resolve, reject) => {
              resolve({
                total: state.citys.length,
                data: state.citys
              })
            })
          }
        } else {
          return store.dispatch('loadDictItems', filter)
        }
      }
    },
    resultServices (state) {
      return state.resultServices
    },
    dossierTemplates (state) {
      return state.dossierTemplates
    },
    dataDetailDossier (state) {
      return state.dossier
    },
    dossier (state) {
      return state.dossier
    },
    getCityVal (state) {
      return state.cityVal
    },
    getDistrictVal (state) {
      return state.districtVal
    },
    getWardVal (state) {
      return state.wardVal
    },
    dossierFiles (state) {
      return state.dossierFiles
    },
    sameUser2 (state) {
      return state.sameUser2
    },
    getVnpostCodeItems (state) {
      return state.vnpostCodeItems
    },
    listHistoryProcessingItems (state) {
      return state.listHistoryProcessingItems
    },
    subStatusNew (state) {
      return state.subStatusNew
    },
    usersComment (state) {
      return state.usersComment
    },
    commentItems (state) {
      return state.commentItems
    },
    dataPhanCong (state) {
      return state.data_phancong
    }
  }
})
