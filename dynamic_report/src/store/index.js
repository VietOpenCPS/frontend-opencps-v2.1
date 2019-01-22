import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import $ from 'jquery'
import saveAs from 'file-saver'
// 

Vue.use(toastr)
Vue.use(Vuex)
toastr.options = {
  'closeButton': true,
  'timeOut': '15000'
}
export const store = new Vuex.Store({
  state: {
    initData: support.initData
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
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
            'userId': 20164
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
    getRoleUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : ''
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
              // if (typeof serializable === 'object' && serializable.constructor === Object) {
              //   serializable = [serializable]
              // }
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
                  'menuType': parseInt(current['menuType']),
                  'queryParams': current['queryParams']
                }
                index = index + 1
                let tableConfig = current['tableConfig']
                let buttonConfig = current['buttonConfig']
                if (tableConfig !== '' && tableConfig !== undefined && tableConfig !== 'undefined' && String(tableConfig).indexOf('{') !== -1 && String(tableConfig).indexOf('}') !== -1) {
                  menuDetail['tableConfig'] = eval('(' + tableConfig + ')')
                }
                if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                  menuDetail['buttonConfig'] = eval('(' + buttonConfig + ')')
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
          resolve(thuTucArray)
        })
      }
    },
    loadingDataHoSo ({commit, state}, filter) {
      commit('setLoadingTable', true)
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramSearch = {
            start: filter.page * 15 - 15,
            end: filter.page * 15,
            agency: filter.agency ? filter.agency : '',
            service: filter.service ? filter.service : '',
            template: filter.template ? filter.template : '',
            status: filter.status ? filter.status : '',
            register: filter.register ? filter.register : '',
            keyword: filter.keyword ? filter.keyword : '',
            domain: filter.domain ? filter.domain : '',
            substatus: filter.substatus ? filter.substatus : '',
            year: filter.year ? filter.year : 0,
            month: filter.month ? filter.month : 0,
            day: filter.day ? filter.day : 0,
            top: filter.top ? filter.top : '',
            dossierNo: filter.dossierNo ? filter.dossierNo : ''
          }
          if (filter['originality']) {
            paramSearch['originality'] = filter.originality
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramSearch
          }
          axios.get(filter.queryParams, param).then(function (response) {
            let serializable = response.data
            commit('setLoadingTable', false)
            commit('setUserNextAction', [])
            resolve(serializable)
          }).catch(function (error) {
            commit('setLoadingTable', false)
            commit('setUserNextAction', [])
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadingCounterNotStep ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramSearch = {
            agency: filter.agency ? filter.agency : '',
            service: filter.service ? filter.service : '',
            template: filter.template ? filter.template : '',
            status: filter.status ? filter.status : '',
            register: filter.register ? filter.register : '',
            keyword: filter.keyword ? filter.keyword : '',
            domain: filter.domain ? filter.domain : '',
            substatus: filter.substatus ? filter.substatus : '',
            year: filter.year ? filter.year : 0,
            month: filter.month ? filter.month : 0,
            day: filter.day ? filter.day : 0,
            top: filter.top ? filter.top : '',
            dossierNo: filter.dossierNo ? filter.dossierNo : ''
          }
          if (filter['originality']) {
            paramSearch['originality'] = filter.originality
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramSearch
          }
          axios.get(filter.queryParams, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
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
          if (filter.hasOwnProperty('originality') && filter.originality === 1) {
            param['params'] = {
              owner: true
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
    loadDossierSelected ({commit, state}, data) {
      commit('dossierSelected', data)
    },
    loadActionActive ({commit, state}, data) {
      commit('actionActive', data)
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
          if (serializable.data) {
            resolve(serializable.data)
          } else {
            resolve([])
          }
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
            let jsonParse = function (string) {
              try {
                JSON.parse(string)
                return JSON.parse(string)
              } catch (e) {
                let partTip = {
                  tip: string,
                  maxSize: 10,
                  extensions: 'pdf,doc,docx,xls,xlsx,png,jpg,jpeg,txt,rtf'
                }
                return partTip
              }
            }
            if (serializable && serializable['dossierParts']) {
              for (let key in serializable['dossierParts']) {
                let partTip = serializable['dossierParts'][key]['partTip']
                serializable['dossierParts'][key]['partTip'] = jsonParse(partTip)
              }
            }
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
            let jsonParse = function (string) {
              try {
                JSON.parse(string)
                return JSON.parse(string)
              } catch (e) {
                let partTip = {
                  tip: string,
                  maxSize: 10,
                  extensions: 'pdf,doc,docx,xls,xlsx,png,jpg,jpeg,txt,rtf'
                }
                return partTip
              }
            }
            if (serializable && serializable['dossierParts']) {
              for (let key in serializable['dossierParts']) {
                let partTip = serializable['dossierParts'][key]['partTip']
                serializable['dossierParts'][key]['partTip'] = jsonParse(partTip)
              }
            }
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
    deleteDossierFile ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.delete(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.referenceUid, param).then(function (response) {
          console.log('success!')
          resolve(response)
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
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
    uploadSingleFile ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let files = $('#file' + data.partNo)[0].files
        let file = files[0]
        let fileName = file['name']
        if (file['name']) {
          fileName = file['name'].replace(/\%/g, '')
          fileName = fileName.replace(/\//g, '')
          fileName = fileName.replace(/\\/g, '')
        }
        let formData = new FormData()
        if (data.partType === 3) {
          if (data['displayName']) {
            fileName = data['displayName'].replace(/\%/g, '')
            fileName = fileName.replace(/\//g, '')
            fileName = fileName.replace(/\\/g, '')
          }
          formData.append('displayName', fileName)
        } else {
          formData.append('displayName', fileName)
        }
        formData.append('fileType', file.type)
        formData.append('fileSize', file.size)
        formData.append('isSync', 'false')
        formData.append('file', file, fileName)
        formData.append('dossierPartNo', data.partNo)
        formData.append('dossierTemplateNo', data.dossierTemplateNo)
        formData.append('fileTemplateNo', data.fileTemplateNo)
        formData.append('formData', '')
        formData.append('referenceUid', '')
        let fileUpload = {
          partTip: data.partTip,
          file: file
        }
        store.dispatch('validFileUpload', fileUpload) // check size, type tài liệu upload
        if (file && state.validFileUpload) {
          axios.post(state.initData.dossierApi + '/' + data.dossierId + '/files', formData, {
            headers: {
              'groupId': state.initData.groupId,
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            resolve(response.data)
            console.log('upload file success!')
          }).catch(function (xhr) {
            console.log(xhr)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(xhr)
          })
        } else {
          reject('error')
        }
      })
    },
    uploadSingleOtherFile ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        let displayName = data['displayName']
        if (data['displayName']) {
          displayName = data['displayName'].replace(/\%/g, '')
          displayName = displayName.replace(/\//g, '')
          displayName = displayName.replace(/\\/g, '')
        }
        formData.append('displayName', data.displayName ? displayName : '')
        formData.append('dossierPartNo', data.partNo ? data.partNo : '')
        formData.append('file', '')
        formData.append('fileType', '')
        formData.append('fileSize', '')
        formData.append('isSync', 'false')
        formData.append('dossierTemplateNo', '')
        formData.append('fileTemplateNo', '')
        formData.append('formData', '')
        formData.append('referenceUid', '')
        axios.post(state.initData.dossierApi + '/' + data.dossierId + '/files', formData, {
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
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          reject(xhr)
        })
      })
    },
    uploadPaymentFile ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let files = $('#' + data.selector)[0].files
        let file = files[0]
        let fileName = file['name']
        if (file['name']) {
          fileName = file['name'].replace(/\%/g, '')
          fileName = fileName.replace(/\//g, '')
          fileName = fileName.replace(/\\/g, '')
        }
        let formData = new FormData()
        formData.append('file', file, fileName)
        let fileUpload = {
          partTip: data['partTip'],
          file: file
        }
        store.dispatch('validFileUpload', fileUpload) // check size, type tài liệu upload
        if (file && state.validFileUpload) {
          axios.put(state.initData.dossierApi + '/' + data.dossierId + '/payments/' + data.referenceUid + '/confirmfile', formData, {
            headers: {
              'groupId': state.initData.groupId,
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            resolve(response.data)
            console.log('Tải file lên thành công')
          }).catch(function (xhr) {
            console.log(xhr)
            toastr.error('Tải file lên thất bại')
            reject(xhr)
          })
        } else {
          reject('error')
        }
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
          console.log('run')
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
              resolve(response.data)
              commit('setLoading', false)
              commit('setDossier', response.data)
              commit('setThongTinChuHoSo', response.data)
              commit('setLePhi', response.data)
              commit('setThongTinNguoiNopHoSo', thongTinNguoiNop)
              commit('setThongTinChungHoSo', response.data)
              commit('setDichVuChuyenPhatKetQua', response.data)
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
    getPaymentFiles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/payments/' + data.referenceUid + '/confirmfile', param).then(function (response) {
          if (response.status === 200 || response.status === '200') {
            resolve('hasPayment')
          } else {
            resolve('')
          }
          if (response.headers['content-disposition']) {
            commit('setPaymentFileName', response.headers['content-disposition'].split(';')[1].split('=')[1].replace(/\"/g, ''))
          } else {
            commit('setPaymentFileName', 'file báo thanh toán')
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    putPayments ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        let dataPut = new URLSearchParams()
        axios.put(state.initData.dossierApi + '/keypay/' + data.referenceUid + '/' + data.referenceUid, dataPut, param).then(function (response) {
          store.dispatch('getActiveGetCounter', !state.activeGetCounter)
          if (response.data) {
            resolve(response.data)
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
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          responseType: 'blob'
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.referenceUid, param).then(function (response) {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    viewPaymentFile ({commit, state, dispatch}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          responseType: 'blob'
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/payments/' + data.referenceUid + '/confirmfile', param).then(function (response) {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    viewDocument ({commit, state, dispatch}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          responseType: 'blob'
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/documents/' + data.referenceUid, param).then(function (response) {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(function (xhr) {
          console.log(xhr)
        })
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
          // commit('setDichVuChuyenPhatKetQua', response.data)
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
        if (!data.userType) {
          applicantType = 'business'
        } else {
          applicantType = 'citizen'
        }
        //
        let isSameAsApplicant = false
        if (data['sameUser'] !== null && data['sameUser'] !== undefined && data['sameUser'] !== 'undefined') {
          isSameAsApplicant = data['sameUser']
        }
        var dataPutdossier = new URLSearchParams()
        dataPutdossier.append('applicantName', data.applicantName)
        dataPutdossier.append('dossierNo', data.dossierNo ? data.dossierNo : '')
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
        dataPutdossier.append('applicantNote', state.applicantNote)
        if (data.originality !== 1) {
          dataPutdossier.append('dossierName', data.dossierName)
        }
        dataPutdossier.append('isSameAsApplicant', isSameAsApplicant)
        if (data.editable) {
          dataPutdossier.append('dueDate', data.dueDate ? data.dueDate : '')
        }
        if (data.viaPostal) {
          dataPutdossier.append('viaPostal', data.viaPostal)
          dataPutdossier.append('postalServiceCode', data.postalServiceCode)
          dataPutdossier.append('postalAddress', data.postalAddress)
          dataPutdossier.append('postalCityCode', data.postalCityCode)
          dataPutdossier.append('postalTelNo', data.postalTelNo)
          // dataPutdossier.append('postalDistrictCode', data.postalDistrictCode)
          // dataPutdossier.append('postalWardCode', data.postalWardCode)
        }
        dataPutdossier.append('sampleCount', data.sampleCount ? data.sampleCount : 0)
        axios.put(state.initData.postDossierApi + '/' + data.dossierId, dataPutdossier, options).then(function (response) {
          resolve(response.data)
          commit('setLoading', false)
          commit('setDossier', response.data)
          commit('setThongTinChuHoSo', response.data)
          commit('setThongTinChungHoSo', response.data)
          commit('setLePhi', response.data)
          commit('setDichVuChuyenPhatKetQua', response.data)
        }).catch(rejectXhr => {
          reject(rejectXhr)
        })
      })
    },
    updateApplicantNote ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': state.initData.cps_auth
          }
        }
        var dataPutdossier = new URLSearchParams()
        dataPutdossier.append('applicantNote', state.applicantNote)
        axios.put(state.initData.postDossierApi + '/' + data.dossierId, dataPutdossier, options).then(function (response) {
          resolve(response.data)
        }).catch(rejectXhr => {
          reject(rejectXhr)
        })
      })
    },
    getApplicantInfos ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.endPointApi + '/applicants/ngsp/' + filter.applicantIdNo, param).then(function (response) {
          if (response.data && response.data['Data']) {
            resolve(response.data['Data'])
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    checkApplicantInfos ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId ? state.initData.groupId : '',
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        var url = state.endPointApi + '/applicants/ngsp/verify'
        var dataCheck = new URLSearchParams()
        dataCheck.append('applicantIdNo', filter.applicantIdNo ? filter.applicantIdNo : '')
        dataCheck.append('applicantName', filter.applicantName ? filter.applicantName : '')
        axios.post(url, dataCheck, param).then(result1 => {
          resolve(result1.data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    getDossierFilesApplicants ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.initData.dossierApi + '/' + filter.dossierId + '/applicant/' + filter.applicantIdNo + '/files/' + filter.fileTemplateNo + '/search', param).then(function (response) {
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
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': state.initData.cps_auth
          }
        }
        var dataPostdossierMark = new URLSearchParams()
        if (data['checkInput'] === 1) {
          if (data.fileCheck !== undefined && data.fileCheck !== 'undefined' && data.fileCheck !== null) {
            dataPostdossierMark.append('fileCheck', data.fileCheck)
          }
          if (data.fileComment !== undefined && data.fileComment !== 'undefined' && data.fileComment !== null) {
            dataPostdossierMark.append('fileComment', data.fileComment)
          }
        } else {
          if (data.fileMark !== undefined && data.fileMark !== 'undefined' && data.fileMark !== null) {
            dataPostdossierMark.append('fileMark', data.fileMark)
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/marks/' + data.partNo
        axios.post(url, dataPostdossierMark, options).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
          // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        })
      })
    },
    postAction ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        var dataPostActionDossier = new URLSearchParams()
        dataPostActionDossier.append('actionCode', data.actionCode ? data.actionCode : '')
        dataPostActionDossier.append('actionNote', data.actionNote ? data.actionNote : '')
        dataPostActionDossier.append('actionUser', data.actionUser ? data.actionUser : '')
        dataPostActionDossier.append('payload', data.payload ? JSON.stringify(data.payload) : '')
        dataPostActionDossier.append('security', data.security ? data.security : '')
        dataPostActionDossier.append('assignUsers', data.assignUsers ? JSON.stringify(data.assignUsers) : '')
        dataPostActionDossier.append('payment', data.payment ? JSON.stringify(data.payment) : '')
        dataPostActionDossier.append('createDossiers', data.createDossiers ? data.createDossiers : '')
        let url = state.initData.dossierApi + '/' + data.dossierId + '/actions'
        axios.post(url, dataPostActionDossier, options).then(function (response) {
          resolve(response.data)
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          commit('setLoading', false)
          store.dispatch('getActiveGetCounter', !state.activeGetCounter)
        }).catch(function (xhr) {
          reject(xhr)
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          store.commit('setLoading', false)
        })
      })
    },
    getUserInfoFromApplicantIdNo ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: 0,
              end: 5,
              idNo: data.idNo
            }
          }
          axios.get(state.initData.applicantApi, param).then(function (response) {
            resolve(response.data.data)
          }).catch(function (xhr) {
            console.log(xhr)
            reject(xhr)
          })
        })
      })
    },
    loadAlpcaForm ({ commit, state, dispatch }, data) {
      console.log('alpaca')
      let id = data['id'] ? data['id'] : 'nm'
      window.$('#formAlpaca' + data.dossierPartNo + id).empty()
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
      window.$('#formAlpaca' + data.dossierPartNo + id).alpaca(formScript)
    },
    putAlpacaForm ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId,
            cps_auth: state.initData.cps_auth
          }
        }
        let id = data['id'] ? data['id'] : 'nm'
        try {
          var control = window.$('#formAlpaca' + data.dossierPartNo + id).alpaca('get')
          var formData = control.getValue()
          let field = window.$('#formAlpaca' + data.dossierPartNo + id).alpaca('get').childrenByPropertyId
          if (field) {
            for (var prop in field) {
              if (field[prop].isRequired() && field[prop].getValue() === '') {
                toastr.error(field[prop].options.placeholder ? field[prop].options.placeholder + ' là trường dữ liệu bắt buộc' : field[prop].options['name'] + ' là trường dữ liệu bắt buộc')
                return
              }
            }
          }
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
    rollBack ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        try {
          var dataRollBack = new URLSearchParams()
          let url = state.initData.dossierApi + '/' + data.dossierId + '/rollback'
          axios.post(url, dataRollBack, options).then(function (response) {
            resolve(response.data)
            store.dispatch('getActiveGetCounter', !state.activeGetCounter)
          }).catch(function (xhr) {
            reject(data)
          })
        } catch (e) {
          console.log(e)
          reject(data)
        }
      })
    },
    goToStep ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        try {
          var dataGoto = new URLSearchParams()
          let url = state.initData.dossierApi + '/' + data.dossierId + '/goto/' + data.stepCode
          axios.post(url, dataGoto, options).then(function (response) {
            resolve(response.data)
            store.dispatch('getActiveGetCounter', !state.activeGetCounter)
          }).catch(function (xhr) {
            reject(data)
          })
        } catch (e) {
          console.log(e)
          reject(data)
        }
      })
    },
    postEform ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }
        try {
          let id = data['id'] ? data['id'] : 'nm'
          var dataPostEform = new FormData()
          var control = window.$('#formAlpaca' + data.partNo + id).alpaca('get')
          var formData = control.getValue()
          dataPostEform.append('formData', JSON.stringify(formData))
          dataPostEform.append('file', '')
          let field = window.$('#formAlpaca' + data.partNo + id).alpaca('get').childrenByPropertyId
          if (field) {
            for (var prop in field) {
              if (field[prop].isRequired() && field[prop].getValue() === '') {
                toastr.error(field[prop].options.placeholder ? field[prop].options.placeholder + ' là trường dữ liệu bắt buộc' : field[prop].options['name'] + ' là trường dữ liệu bắt buộc')
                return
              }
            }
          }
          let url = state.initData.dossierApi + '/' + data.dossierId + '/eforms/' + data.partNo
          axios.post(url, dataPostEform, options).then(function (response) {
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
    postEformEsignature ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }
        try {
          var dataPostEform = new FormData()
          dataPostEform.append('formData', JSON.stringify(JSON.parse(data.formData)))
          dataPostEform.append('file', '')
          let url = state.initData.dossierApi + '/' + data.dossierId + '/eforms/' + data.partNo
          axios.post(url, dataPostEform, options).then(function (response) {
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
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          commit('setLoading', false)
        }).catch(function (xhr) {
          reject(xhr)
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
        var urlPluginFormData = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/formdata'
        var urlPluginFormScript = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/formscript'
        var config_plugins = {
          headers: {
            'groupId': state.initData.groupId,
            Token: window.Liferay ? window.Liferay.authToken : ''
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
              var url = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/preview' 
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
              var url = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/previewhtml'
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
                window.$('#alpacajs_form_plugin').alpaca(formReport)
                window.$('.dossierFilePartNo').val('')
                window.$('.dossierFilePartNo').attr('id', 'dossierFileId' + partNo)
                window.$('.dossierFilePartNo').val(dossierFileId)
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
    getActiveGetCounter ({commit, state}, data) {
      commit('setActiveGetCounter', data)
    },
    getActiveLoadingDataHoSo ({commit, state}, data) {
      commit('setActiveLoadingDataHoSo', data)
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
            }
          }
          var listHistoryProcessing = []
          // axios.get('http://127.0.0.1:8081/api/dossiers/dossierlogs/77602/logs', param).then(function (response) {
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
    loadPlugins ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/plugins'
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
          resolve(resPostCmt)
        })
        .catch(function (error) {
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
              commit('setUserNextAction', [])
              commit('setCheckInput', serializable['checkInput'])
              commit('setStepOverdueNextAction', serializable['stepOverdue'])
              if (serializable['users']) {
                if (Array.isArray(serializable['users'])) {
                  commit('setUserNextAction', serializable['users'])
                } else {
                  commit('setUserNextAction', [serializable['users']])
                }
              }
              resolve(serializable.data)
            }).catch(function (error) {
              console.log(error)
              reject(error)
              commit('setUserNextAction', [])
            })
          })
        })
      },
      pullBtnConfigStep ({commit, state}, filter) {
        return new Promise((resolve, reject) => {
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          var params = new URLSearchParams()
          // test local
          axios.get(state.initData.stepConfigApi + '/status/' + filter.dossierStatus + '/' + filter.dossierSubStatus, config).then(function (response) {
          // axios.get('http://congtrinh0209:8081/api/stepconfigs/done/done_5', params, config).then(function (response) {
            let serializable = response.data.data
            let buttonConfig
            if (serializable[0].buttonConfig && serializable[0].buttonConfig.indexOf('{') >= 0) {
              buttonConfig = JSON.parse(serializable[0].buttonConfig)['buttons'] ? JSON.parse(serializable[0].buttonConfig)['buttons'] : []
            } else {
              buttonConfig = []
            }
            resolve(buttonConfig)
          }).catch(function (error) {
            console.log(error)
            reject(error)
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
        let url = state.initData.documentApi + '/' + data.dossierId + '/documents'
        return new Promise((resolve, reject) => {
          axios.get(url, config).then(function (response) {
            if (response.data.data) {
              resolve(response.data.data)
            } else {
              resolve([])
            }
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
      loadMermaidgraph ({commit, state}, data) {
        let config = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            stepType: data.stepType
          }
        }
        let url = state.initData.dossierApi + '/' + data.dossierId + '/mermaidgraph'
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
                originDossierId: classPK
              }
            }
            axios.get(state.initData.dossierApi, param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                resolve(serializable.data)
              } else {
                resolve([])
              }
            }).catch(function (error) {
              reject(error)
            })
          })
        })
      },
      getDossierUserAsign ({commit, state}, classPK) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            axios.get(state.initData.dossierApi + '/' + classPK + '/users', param).then(function (response) {
              let serializable = response.data
              if (serializable['data']) {
                if (Array.isArray(serializable['data'])) {
                  resolve(serializable.data)
                } else {
                  resolve([serializable['data']])
                }
              } else {
                resolve([])
              }
            }).catch(function (error) {
              reject(error)
            })
          })
        })
      },
      postDossierUserAsign ({commit, state}, filter) {
        return new Promise((resolve, reject) => {
          store.dispatch('loadInitResource').then(function (result) {
            let param = {
              headers: {
                groupId: state.initData.groupId
              }
            }
            let dataPost = new URLSearchParams()
            dataPost.append('assignUsers', filter.users?JSON.stringify(filter.users):'')
            axios.post(state.initData.dossierApi + '/' + filter.dossierId + '/users', dataPost, param).then(function (response) {
              resolve(response)
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
            }
          }
          let url = state.endPointApi + '/dossiers/' + data.dossierId + '/syncs'
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
          formData.append('actionCode', filter.actionCode ? filter.actionCode : '')
          formData.append('payment', filter.payment?JSON.stringify(filter.payment):'')
          formData.append('assignUsers', filter.toUsers?JSON.stringify(filter.toUsers):'')
          formData.append('actionNote', filter.userNote?JSON.stringify(filter.userNote):'')
          formData.append('payload', filter.payload?JSON.stringify(filter.payload):'')
          axios.post(state.initData.getNextAction + '/' + filter.dossierId + '/actions', formData, param).then(function (response) {
            store.dispatch('getActiveGetCounter', !state.activeGetCounter)
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
            store.dispatch('getActiveGetCounter', !state.activeGetCounter)
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    restoreDossier ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.post('/o/rest/v2/dossiers/' + filter.dossierId + '/restore' , param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    getListDossierFiles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        axios.get(state.initData.dossierApi + '/' + data + '/files', param).then(function (response) {
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
    deleteDossierPatch ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var activeFinish = 0
          let selectedLength = filter['dossierId'].length
          for (let keydk in filter.dossierId) {
            axios.delete(state.initData.getNextAction + '/' + filter.dossierId[keydk] , param).then(function (response) {
              let serializable = response.data
              activeFinish += 1
              if (activeFinish === selectedLength) {
                store.dispatch('getActiveGetCounter', !state.activeGetCounter)
                store.dispatch('getActiveLoadingDataHoSo', !state.activeLoadingDataHoSo)
              }
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              activeFinish += 1
              if (activeFinish === selectedLength) {
                store.dispatch('getActiveGetCounter', !state.activeGetCounter)
                store.dispatch('getActiveLoadingDataHoSo', !state.activeLoadingDataHoSo)
              }
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
              reject(error)
            })
          }
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
            responseType: 'blob',
            params: {
              payload: filter.payload
            }
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/documents/preview/' + filter.document, param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
            responseType: 'blob',
            params: {
              payload: filter.payload
            }
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/documents/print', param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    doGuiding ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            serviceCode: filter.serviceCode ? filter.serviceCode : '',
            serviceName: filter.serviceName ? filter.serviceName : '',
            typeCode: filter.typeCode ? filter.typeCode : '',
            templateNo: filter.templateNo ? filter.templateNo : '',
            applicantName: filter.applicantName ? filter.applicantName : '',
            applicantAddress: filter.applicantAddress ? filter.applicantAddress : '',
            applicantEmail: filter.applicantEmail ? filter.applicantEmail : '',
            applicantTelNo: filter.applicantTelNo ? filter.applicantTelNo : '',
            employeeName: filter.employeeName ? filter.employeeName : ''
          }
          if (filter.reportType) {
            paramGet['reportType'] = filter.reportType
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob',
            params: paramGet
          }
          axios.get(state.initData.getServiceConfigs + '/' + filter.serviceConfigId + '/guide', param).then(function (response) {
            let serializable = response.data
            if (filter.reportType) {
              saveAs(serializable, 'HDTT' + new Date().getTime() + '.doc')
            }
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
          formData.append('payload', filter.payload)
          axios.post(state.initData.getNextAction + '/preview/' + filter.document ,formData , param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    printPay ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/payments/' + filter.referenceUid + '/invoicefile/preview', param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
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
              groupId: state.initData.groupId,
              Token: window.Liferay ? window.Liferay.authToken : ''
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
            url: state.initData.dossierApi + '/' + data.dossierId + '/eforms/' + data.partNo + '/formdata',
            type: 'GET',
            headers: {
              groupId: state.initData.groupId,
              Token: window.Liferay ? window.Liferay.authToken : ''
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
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        })
      })
    },
    pullProcessSteps ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.stepConfigApi + '/' + data.stepCode, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadServiceConfigsGov ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
            }
          }
          commit('setLoadingGov', true)
          // test local
          axios.get(state.initData.serviceConfigByGovApi, param).then(function (response) {
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/statistics/agencies', param).then(function (response) {
            commit('setLoadingGov', false)
            let serializable = response.data
            if (serializable.govAgencies) {
              resolve(serializable.govAgencies)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            commit('setLoadingGov', false)
            reject(error)
          })
        })
      })
    },
    processCheckNextActions ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let allActionCode = filter.actionCode.split(',')
          axios.get(state.initData.dossierApi + '/' + filter.dossierId + '/nextactions', param).then(function (response) {
            let serializable = response.data
            let nextActionData = serializable.data
            let newFilter = filter
            let isBreak = false
            for (let key in allActionCode) {
              if (!isBreak) {
                for (let keyNext in nextActionData) {
                  if (String(allActionCode[key]) === String(nextActionData[keyNext].actionCode)) {
                    newFilter.actionCode = nextActionData[keyNext].actionCode
                    isBreak = true
                    break
                  }
                }
              }
            }
            resolve(newFilter)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceOpionByProcess ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/serviceinfos/' + data.serviceConfigId + '/processes', param).then(function (response) {
          axios.get(state.initData.getServiceConfigs + '/' + data.serviceConfigId + '/processes', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(serializable.data)
            } else {
              resolve({})
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getStatusLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/dictcollections/DOSSIER_STATUS/dictitems?parent=0', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              if (dataReturn !== null && dataReturn !== undefined && dataReturn !== 'undefined') {
                dataReturn.unshift({
                  'itemCode': '',
                  'itemName': 'toàn bộ'
                })
              }
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getVNPOSTcode ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/dictcollections/ADMINISTRATIVE_REGION/dictitems', param).then(function (response) {
          axios.get('/o/rest/v2/dictcollections/VNPOST_CITY_CODE/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getSubstatusLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/dictcollections/DOSSIER_STATUS/dictitems?parent=' + data.itemCode, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              if (dataReturn !== null && dataReturn !== undefined && dataReturn !== 'undefined') {
                dataReturn.unshift({
                  'itemCode': '',
                  'itemName': 'toàn bộ'
                })
              }
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getAgencyLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/serviceinfos/statistics/agencies', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              if (dataReturn !== null && dataReturn !== undefined && dataReturn !== 'undefined') {
                dataReturn.unshift({
                  'administrationCode': '',
                  'administrationName': 'toàn bộ'
                })
              }
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceinfos', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              if (dataReturn !== null && dataReturn !== undefined && dataReturn !== 'undefined') {
                dataReturn.unshift({
                  'serviceCode': '',
                  'serviceName': 'toàn bộ'
                })
              }
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceinfoFilter ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              domain: data.domain
            }
          }
          axios.get(state.initData.getListThuTucHanhChinh, param).then(function (response) {
            let serializable = response.data
            let thuTucArray = Array.from(serializable.data)
            commit('setListThuTucHanhChinh', thuTucArray)
            resolve(thuTucArray)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getDomainLists ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getExtraForm ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.dossierApi + '/' + filter.dossierId + '/nextactions/' + filter.actionId +  '/payload', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(serializable.data)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceInfo ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.serviceInfoApi + '/' + data.serviceInfoId, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    changeDisplayNameFile ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          var dataPutDossierFile = new URLSearchParams()
          dataPutDossierFile.append('displayName', data.displayName)
          axios.put(state.initData.serviceInfoApi + '/' + data.dossierId + '/files/' + data.dossierFileId, dataPutDossierFile, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadingDossierCounting ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/statistics/dossiers/counting', param).then(function (response) {
            let serializable = response.data
            if (serializable.hasOwnProperty('data')) {
              resolve(serializable.data)
            } else {
              resolve(null)
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/postal/votings/' + data.className + '/' + data.classPK, param).then(result => {
          // axios.get('http://127.0.0.1:8081/api/votings/12/' + data.classPK, param).then(result => {
            let serializable = result.data
            if (serializable && serializable.data) {
              resolve(serializable.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
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
          params.append('votingCode', data.votingCode ? data.votingCode : '')
          params.append('selected', data.selected)
          // test local
          // axios.post('http://127.0.0.1:8081/api/votings/' + data.votingId, params, config).then(result => {
          axios.post('/o/rest/v2/postal/votings/' + data.votingId + '/results', params, config).then(result => {
            resolve(result.data)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    validFileUpload ({commit, state}, data) {
      let getFileType = data.file.name ? data.file.name.split('.') : ''
      let fileType = getFileType ? getFileType[getFileType.length - 1] : ''
      let fileTypeAllow = data.partTip['extensions'] ? data.partTip['extensions'].split(",") : ''
      let fileSizeAllow = data.partTip['maxSize']
      let fileTypeInput = fileTypeAllow ? fileTypeAllow.filter(function (item) {
        return item === fileType
      }) : ''
      store.commit('setValidFileUpload', false)
      if (fileTypeInput && fileTypeInput.length > 0) {
        if (Number(data.file.size) <= data.partTip['maxSize'] * 1048576 || !data.partTip['maxSize']) {
          store.commit('setValidFileUpload', true)
        } else {
          toastr.error('Tài liệu tải lên dung lượng tối đa là ' + data.partTip['maxSize'] + ' MB')
          store.commit('setValidFileUpload', false)
        }
      } else {
        if (!data.partTip['extensions']) {
          store.commit('setValidFileUpload', true)
        } else {
          toastr.error('Tài liệu tải lên chỉ chấp nhận các định dạng ' + data.partTip['extensions'])
          store.commit('setValidFileUpload', false)
        }
      }
    }
    // ----End---------
  },
  mutations: {
  },
  getters: {
  }
})
