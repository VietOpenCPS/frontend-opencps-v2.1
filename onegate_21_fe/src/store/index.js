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
  'timeOut': '10000'
}
export const store = new Vuex.Store({
  state: {
    initData: support.initData,
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8080/api',
    loading: false,
    loadingTable: false,
    loadingDynamicBtn: false,
    loadingGov: false,
    validFileUpload: false,
    fileTypeAllowDefault: 'pdf,doc,docx,xls,xlsx,png,jpg,jpeg,txt,rtf',
    fileTypePAYMENT: ['png', 'jpg', 'jpeg'],
    error: null,
    user: {
      'role': ''
    },
    userLogin: '',
    index: 0,
    kysoSuccess: false,
    activeGetCounter: false,
    activeLoadingDataHoSo: false,
    trangThaiHoSoList: null,
    listThuTucHanhChinh: null,
    checkInput: 0,
    stepOverdueNextAction: '',
    usersNextAction: [],
    lePhi: {
      fee: '',
      feeNote: '',
      request: ''
    },
    dossier: {
      applicantIdNo: 'ccc'
    },
    dossierSelected: [],
    actionActive: {},
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
    applicantId: '',
    applicantBussinessExit: false,
    applicantNote: '',
    thongTinChuHoSo: {
      userType: '1',
      cityCode: '',
      districtCode: '',
      wardCode: '',
      applicantIdNo: '',
      contactEmail: '',
      contactName: '',
      address: '',
      applicantName: ''
    },
    thongTinChuHoSoBindChuyenPhat: {
      cityCode: '',
      districtCode: '',
      wardCode: '',
      address: '',
      contactTelNo: ''
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
      viaPostal: 0,
      postalServiceCode: '',
      postalAddress: '',
      postalCityCode: '',
      postalDistrictCode: '',
      postalWardCode: '',
      postalTelNo: ''
    },
    dichVuChuyenPhatHoSo: {
      vnpostalStatus: 0,
      postalServiceCode: '',
      postalAddress: '',
      postalCityCode: '',
      postalCityName: '',
      postalDistrictCode: '',
      postalDistrictName: '',
      postalWardCode: '',
      postalWardName: '',
      postalTelNo: ''
    },
    viaPostal: 0,
    data_phancong: [],
    dataCreateDossier: {},
    dataCreateFile: [],
    paymentProfile: '',
    paymentFileName: '',
    forGroupDossier: false,
    dossierIntoGroup: [],
    filesAdd: [],
    activeAddFileGroup: false,
    dossierTemplateLienThong: '',
    activePrintBienNhan: '',
    createFileSigned: '',
    advSearchShow: false,
    visibleDoAction: true,
    filterDateFromTo: ['fromReceiveDate','toReceiveDate','fromDueDate','toDueDate','fromReleaseDate','toReleaseDate','fromFinishDate','toFinishDate']
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
            // console.log('roles', roles)
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
              let menuData = []
              let index = 0
              for (let key in serializable.data) {
                let current = serializable.data[key]
                let menuDetail = {
                  'index': index,
                  'active': false,
                  'title': current['menuName'],
                  'id': current['menuGroup'],
                  'icon': current['icon'] ? current['icon'] : '',
                  'action': 'description',
                  'action_active': 'play_arrow',
                  'counter': -1,
                  'menuType': parseInt(current['menuType']),
                  'queryParams': current['queryParams'],
                  'hasViewText': current['hasViewText']
                }
                index = index + 1
                let tableConfig = current['tableConfig']
                let buttonConfig = current['buttonConfig']
                if (tableConfig !== '' && tableConfig !== undefined && tableConfig !== 'undefined' && String(tableConfig).indexOf('{') !== -1 && String(tableConfig).indexOf('}') !== -1) {
                  try {
                    menuDetail['tableConfig'] = eval('(' + tableConfig + ')')
                  } catch (error) {
                    alert('Lỗi cấu hình TableConfig menu ' + current['menuName'])
                  }
                }
                if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                  try {
                    menuDetail['buttonConfig'] = eval('(' + buttonConfig + ')')
                  } catch (error) {
                    alert('Lỗi cấu hình ButtonConfig menu ' + current['menuName'])
                  }
                }
                if (current.hasOwnProperty('steps')) {
                  if (Array.isArray(current.steps) && current.steps.length > 1) {
                    menuDetail['items'] = current.steps
                  }
                  if (current.steps && !Array.isArray(current.steps)) {
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
          }).catch(function (){})
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
          }).catch(function (){})
        })
      } else {
        return new Promise((resolve, reject) => {
          let thuTucArray = Array.from(state.listThuTucHanhChinh)
          resolve(thuTucArray)
        })
      }
    },
    loadingDataHoSo ({commit, state}, filter) {
      console.log('filter search dossier', filter)
      commit('setLoadingTable', true)
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramSearch = {
            start: filter.page * filter.numberPerPage - filter.numberPerPage,
            end: filter.page * filter.numberPerPage,
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
            dossierNo: filter.dossierNo ? filter.dossierNo : '',
            paymentStatus: filter.paymentStatus ? filter.paymentStatus : ''
          }
          if (filter['follow']) {
            paramSearch.follow = filter.follow
            paramSearch.originality = 0
          }
          if (filter['originality']) {
            paramSearch.originality = filter.originality
          }
          if (filter['viapostal']) {
            paramSearch.viapostal = filter.viapostal
          }
          if (filter['sort']) {
            paramSearch.sort = filter.sort
          }
          if (filter.order !== '') {
            paramSearch.order = String(filter.order) === 'true' ? true : false
          }
          // 
          for (let index in state.filterDateFromTo) {
            if (filter.hasOwnProperty(state.filterDateFromTo[index]) && filter[state.filterDateFromTo[index]]) {
              paramSearch[state.filterDateFromTo[index]] = filter[state.filterDateFromTo[index]]
            }
          }
          if (paramSearch.hasOwnProperty('order') && (paramSearch.order === true || paramSearch.order === false)) {
            filter.queryParams = filter.queryParams.replace('order=false', '')
            filter.queryParams = filter.queryParams.replace('order=true', '')
            filter.queryParams = filter.queryParams.replace('&order=false', '')
            filter.queryParams = filter.queryParams.replace('&order=true', '')
          }
          let splitUrl = filter.queryParams.split('?')
          if (splitUrl.length !== 0) {
            if (splitUrl[1]) {
              if (splitUrl[1].charAt(0) === '&') {
                filter.queryParams = splitUrl[1].slice(1) ? splitUrl[0] + '?' + splitUrl[1].slice(1) : splitUrl[0]
              }
            } else {
              filter.queryParams = splitUrl[0]
            }
          }
          console.log('paramSearch_dossier_5', filter.queryParams, paramSearch)
          // 
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
        }).catch(function (){})
      })
    },
    getGroupDossier ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramSearch = {
            // service: filter.service ? filter.service : '',
            // template: filter.template ? filter.template : '',
            // agency: filter.agency ? filter.agency : '',
            originality: 9
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramSearch
          }
          axios.get('/o/rest/v2/dossiers/todo', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(serializable.data)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    loadingCounterNotStep ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramSearch = {
            start: 0,
            end: 1,
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
            dossierNo: filter.dossierNo ? filter.dossierNo : '',
            viapostal: filter.viapostal ? filter.viapostal : ''
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
        }).catch(function (){})
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
        }).catch(function (){})
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
              if (data.level === 0 && !data.hasOwnProperty('commit')) {
                commit('setCitys', serializable.data)
              }
            }
            resolve(response.data)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
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
        userType: '1',
        cityCode: '',
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
        delegateCityCode: '',
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
            let marks = serializable.data
            resolve(marks)
          } else {
            resolve([])
          }
        }).catch(function (error){
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
                  maxSize: 30,
                  extensions: state.fileTypeAllowDefault
                }
                return partTip
              }
            }
            if (serializable && serializable['dossierParts']) {
              for (let key in serializable['dossierParts']) {
                serializable['dossierParts'][key].hasTemplate = false
                serializable['dossierParts'][key].hasTemplateLienThong = false
                serializable['dossierParts'][key].fileMarkDefault = ''
                serializable['dossierParts'][key].recordCountDefault = ''
                let partTip = serializable['dossierParts'][key]['partTip']
                serializable['dossierParts'][key]['partTip'] = jsonParse(partTip)
              }
            }
            resolve(serializable)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
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
                  maxSize: 30,
                  extensions: state.fileTypeAllowDefault
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
        }).catch(function (){})
      })
    },
    copyFile ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('dossierTemplateNo', filter.dossierTemplateNo ? filter.dossierTemplateNo : '')
        dataPost.append('dossierPartNo', filter.dossierPartNo ? filter.dossierPartNo : '')
        dataPost.append('dossierFileId', filter.dossierFileId ? filter.dossierFileId : '')
        axios.post(state.initData.dossierApi + '/' + filter.dossierId + '/files/copyfile', dataPost, param).then(function (response) {
          resolve(response)
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
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
        // console.log('data -delete-----', data)
        // console.log('data-- dossier file-------', state.dossierFiles)
        let dataPut = new URLSearchParams()
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
        let dataOutPut = []
        let files = $('input[id="file' + data.partNo + '"]')[0].files
        let countFiles = files.length
        let count = 0
        if (files) {
          for (let index = 0; index < countFiles; index++) {
            let file = files[index]
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
                count += 1
                dataOutPut.push(response.data)
                if (count === countFiles) {
                  resolve(dataOutPut)
                }
              }).catch(function (xhr) {
                toastr.clear()
                toastr.error('Yêu cầu của bạn thực hiện thất bại.')
                count += 1
                if (count === countFiles) {
                  reject(dataOutPut)
                }
              })
            } else {
              count += 1
              if (count === countFiles) {
                reject(dataOutPut)
              }
            }
          }
        }
      })
    },
    uploadFileDossierGroup ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('dossierIds', filter.dossierIds ? filter.dossierIds : '')
        dataPost.append('dossierFileId', filter.dossierFileId ? filter.dossierFileId : '')
        axios.post(state.initData.dossierApi + '/dossierfiles', dataPost, param).then(function (response) {
          resolve(response)
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
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
          toastr.clear()
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          console.log('upload file success!')
        }).catch(function (xhr) {
          console.log(xhr)
          toastr.clear()
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
            // console.log('Tải file lên thành công')
          }).catch(function (xhr) {
            console.log(xhr)
            toastr.clear()
            toastr.error('Tải file lên thất bại')
            reject(xhr)
          })
        } else {
          reject('error')
        }
      })
    },
    uploadDossierFileImport ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        let files = $('#' + data.selector)[0].files
        let file = files[0]
        let fileName = file['name']
        let formData = new FormData()
        formData.append('file', file, fileName)
        let fileUpload = {
          partTip: data['partTip'],
          file: file
        }
        store.dispatch('validFileUpload', fileUpload) // check size, type tài liệu upload
        if (file && state.validFileUpload) {
          axios.post('/o/rest/v2/dossiers/createMutiplite/files', formData, {
            headers: {
              'groupId': state.initData.groupId,
              'Content-Type': 'multipart/form-data'
            }
          }).then(function (response) {
            resolve(response.data)
            console.log('Tải file lên thành công')
          }).catch(function (xhr) {
            console.log(xhr)
            toastr.clear()
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
        }).catch(function (){})
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
        axios.get(state.initData.regionApi + '/GOVERNMENT_AGENCY/dictitems', paramGetGovAgency).then(function (response) {
          resolve(response.data.data)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    getDocumentType ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            sort: 'sibling'
          }
        }
        axios.get(state.initData.regionApi + '/DOCUMENT_TYPE/dictitems', param).then(function (response) {
          if (response.data && response.data.data) {
            resolve(response.data.data)
          } else {
            resolve(null)
          }
        }).catch(function() {
          reject(null)
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
          resolve([])
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
            commit('setPaymentFileName', 'payment_file')
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
          if (response.data) {
            let url = window.URL.createObjectURL(response.data)
            resolve(url)
          } else {
            resolve('pending')
          }
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
          let url = window.URL.createObjectURL(response.data)
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
          let url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    downloadFileDocument ({commit, state, dispatch}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          responseType: 'blob'
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/documents/' + data.referenceUid, param).then(function (response) {
          let url = window.URL.createObjectURL(response.data)
          // window.open(url)
          let fileType = decodeURI(response.headers['content-disposition'].match(/filename="(.*)"/)[1].split('.')[1])
          let fileName = decodeURI(response.headers['content-disposition'].match(/filename="(.*)"/)[1])
          if ('pdf,png,jpg,jpeg'.indexOf(fileType.toLowerCase()) >= 0) {
            resolve(url)
          } else {
            let serializable = response.data
            saveAs(serializable, fileName)
          }
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    postDossier ({ commit, state }, data) {
      // console.log('data-------------', data)
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': ''
          }
        }
        let dataPostdossier = new URLSearchParams()
        dataPostdossier.append('serviceCode', data.serviceCode)
        dataPostdossier.append('govAgencyCode', data.govAgencyCode)
        dataPostdossier.append('dossierTemplateNo', data.templateNo)
        dataPostdossier.append('originality', data.originality)
        if (data.j_captcha_response) {
          dataPostdossier.append('j_captcha_response', data.j_captcha_response)
        }
        // console.log('dataPostdossier-------------', dataPostdossier)
        axios.post(state.initData.postDossierApi, dataPostdossier, options).then(function (response) {
          response.data.serviceConfig = state.serviceConfigObj
          commit('setLoading', false)
          commit('setDossier', response.data)
          commit('setThongTinChuHoSo', response.data)
          commit('setLePhi', response.data)
          commit('setThongTinChungHoSo', response.data)
          toastr.clear()
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          if (data.j_captcha_response) {
            resolve(response)
          } else {
            resolve(response.data)
          }
        }).catch(function (error) {
          reject(error)
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    postDossierIntoGroup ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': ''
          }
        }
        let dataPostdossier = new URLSearchParams()
        dataPostdossier.append('dossierId', data.dossierId)
        axios.put('/o/rest/v2/dossiers/' + data.groupDossierId + '/groupDossier', dataPostdossier, options).then(function (response) {
          commit('setLoading', false)
          // toastr.clear()
          // toastr.success('Thêm hồ sơ vào nhóm thành công')
          resolve(response.data)
        }).catch(function (error) {
          commit('setLoading', false)
          reject(error)
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại')
        })
      })
    },
    postDossierNewVersion ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': ''
          }
        }
        let dataPostdossier = new URLSearchParams()
        dataPostdossier.append('serviceCode', data.serviceCode)
        dataPostdossier.append('govAgencyCode', data.govAgencyCode)
        dataPostdossier.append('dossierTemplateNo', data.templateNo)
        dataPostdossier.append('originality', data.originality)
        dataPostdossier.append('dossiers', data.dossiers)
        dataPostdossier.append('dossierFileArr', data.dossierFileArr)
        dataPostdossier.append('dossierMarkArr', data.dossierMarkArr)
        dataPostdossier.append('payment', data.payment)
        if (data.j_captcha_response) {
          dataPostdossier.append('j_captcha_response', data.j_captcha_response)
        }
        axios.post('/o/rest/v2/dossiers/create/all', dataPostdossier, options).then(function (response) {
          response.data.serviceConfig = state.serviceConfigObj
          commit('setLoading', false)
          toastr.clear()
          if (data.j_captcha_response) {
            resolve(response)
          } else {
            resolve(response.data)
          }
        }).catch(function (error) {
          reject(error)
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    getDossiersIntoGroup ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            groupDossierId: filter.groupDossierId ? filter.groupDossierId : ''
          }
        }
        axios.get('/o/rest/v2/dossiers', param).then(function (response) {
          if (response.data && response.data['data']) {
            resolve(response.data['data'])
          }
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
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
        let dataPostdossier = new URLSearchParams()
        axios.post(state.initData.postDossierApi + '/' + filter.dossierId + '/cloning', dataPostdossier, options).then(function (response) {
          toastr.clear()
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
          toastr.clear()
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
        let dataPostdossier = new URLSearchParams()
        axios.post(state.initData.postDossierApi + '/' + filter.dossierId + '/cancel', dataPostdossier, options).then(function (response) {
          toastr.clear()
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          resolve(response.data)
        }).catch(function (error) {
          reject(error)
          toastr.clear()
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
            'cps_auth': ''
          }
        }
        let applicantType = ''
        if (data.userType === '2') {
          applicantType = 'business'
        } else if (data.userType === '1') {
          applicantType = 'citizen'
        } else {
          applicantType = 'organization'
        }
        //
        let isSameAsApplicant = false
        if (data['sameUser'] !== null && data['sameUser'] !== undefined && data['sameUser'] !== 'undefined') {
          isSameAsApplicant = data['sameUser']
        }
        console.log('dataPutdossier_1', data)
        let dataPutdossier = new URLSearchParams()
        dataPutdossier.append('applicantName', data.applicantName ? data.applicantName : '')
        dataPutdossier.append('dossierNo', data.dossierNo ? data.dossierNo : '')
        dataPutdossier.append('applicantIdType', applicantType)
        dataPutdossier.append('applicantIdNo', data.applicantIdNo ? data.applicantIdNo : '')
        dataPutdossier.append('address', data.address ? data.address : '')
        dataPutdossier.append('cityCode', data.cityCode ? data.cityCode : '')
        dataPutdossier.append('districtCode', data.districtCode ? data.districtCode : '')
        dataPutdossier.append('wardCode', data.wardCode ? data.wardCode : '')
        dataPutdossier.append('contactTelNo', data.contactTelNo ? data.contactTelNo : '')
        dataPutdossier.append('contactEmail', data.contactEmail ? data.contactEmail : '')
        dataPutdossier.append('delegateName', data.delegateName ? data.delegateName : '')
        dataPutdossier.append('delegateIdNo', data.delegateIdNo ? data.delegateIdNo : '')
        dataPutdossier.append('delegateTelNo', data.delegateTelNo ? data.delegateTelNo : '')
        dataPutdossier.append('delegateEmail', data.delegateEmail ? data.delegateEmail : '')
        dataPutdossier.append('delegateAddress', data.delegateAddress ? data.delegateAddress : '')
        dataPutdossier.append('delegateCityCode', data.delegateCityCode ? data.delegateCityCode : '')
        dataPutdossier.append('delegateDistrictCode', data.delegateDistrictCode ? data.delegateDistrictCode : '')
        dataPutdossier.append('delegateWardCode', data.delegateWardCode ? data.delegateWardCode : '')
        dataPutdossier.append('applicantNote', state.applicantNote)
        dataPutdossier.append('dossierName', data.dossierName ? data.dossierName : '')
        dataPutdossier.append('isSameAsApplicant', isSameAsApplicant)
        if (data.editable) {
          dataPutdossier.append('dueDate', data.dueDate ? data.dueDate : '')
        }
        if (data.viaPostal) {
          dataPutdossier.append('viaPostal', data.viaPostal)
          dataPutdossier.append('postalServiceCode', data.postalServiceCode ? data.postalServiceCode : '')
          dataPutdossier.append('postalAddress', data.postalAddress ? data.postalAddress : '')
          dataPutdossier.append('postalCityCode', data.postalCityCode ? data.postalCityCode : '')
          dataPutdossier.append('postalTelNo', data.postalTelNo ? data.postalTelNo : '')

          if (data.hasOwnProperty('vnpostalStatus')) {
            dataPutdossier.append('vnpostalStatus', data.vnpostalStatus)
          }
        }
        if (data.viaPostal && String(data.vnpostalStatus) === '1') {
          dataPutdossier.append('vnpostalProfile', JSON.stringify(data.vnpostalProfile))
        }
        dataPutdossier.append('sampleCount', data.sampleCount ? data.sampleCount : 0)
        console.log('dataPutdossier', dataPutdossier)
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
    importDossier ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        commit('setLoading', false)
        let options = {
          headers: {
            groupId: state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'cps_auth': ''
          }
        }
        // var applicantType = 'citizen'
        //
        // let isSameAsApplicant = true
        // if (data['sameUser'] !== null && data['sameUser'] !== undefined && data['sameUser'] !== 'undefined') {
        //   isSameAsApplicant = data['sameUser']
        // }
        var dataPutdossier = new URLSearchParams()
        dataPutdossier.append('serviceCode', data['serviceCode'])
        dataPutdossier.append('govAgencyCode', data['govAgencyCode'])
        dataPutdossier.append('dossierTemplateNo', data['dossierTemplateNo'])
        dataPutdossier.append('originality', data['originality'])
        dataPutdossier.append('dossiers', data['dossiers'])
        dataPutdossier.append('dossierFileArr', data['dossierFiles'])
        dataPutdossier.append('dossierMarkArr', data['dossierMarks'])
        dataPutdossier.append('payment', data['payment'])
        axios.post(state.initData.postDossierApi + '/import/all', dataPutdossier, options).then(function (response) {
          resolve(response.data)
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
            'cps_auth': ''
          }
        }
        let dataPutdossier = new URLSearchParams()
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
        let url = state.endPointApi + '/applicants/ngsp/verify'
        let dataCheck = new URLSearchParams()
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
        let dataPutdossier = new URLSearchParams()
        dataPutdossier.append('dueDate', data)
        axios.put(state.initData.postDossierApi + '/' + state.thongTinChungHoSo.dossierId, dataPutdossier, options).then(function (response) {
          resolve(response.data)
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
            'cps_auth': ''
          }
        }
        let dataPostdossierMark = new URLSearchParams()
        if (data['checkInput'] === 1) {
          if (data.fileCheck !== undefined && data.fileCheck !== 'undefined' && data.fileCheck !== null) {
            dataPostdossierMark.append('fileCheck', data.fileCheck)
          }
          if (data.fileComment !== undefined && data.fileComment !== 'undefined' && data.fileComment !== null) {
            dataPostdossierMark.append('fileComment', data.fileComment)
          }
        } else {
          if (data.fileMark !== undefined && data.fileMark !== 'undefined') {
            dataPostdossierMark.append('fileMark', data.fileMark)
          }
        }
        if (!isNaN(data.recordCount) && data.recordCount !== undefined && data.recordCount !== 'undefined' && data.recordCount !== null) {
          dataPostdossierMark.append('recordCount', data.recordCount)
        }
        // console.log('dataChangeRecord', data.dossierId)
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
        let dataPostActionDossier = new URLSearchParams()
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
          toastr.clear()
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
        }).catch(function (){})
      })
    },
    loadAlpcaForm ({ commit, state, dispatch }, data) {
      let id = data['id'] ? data['id'] : 'nm'
      window.$('div[id="formAlpaca' + data.dossierPartNo + id + '"]').empty()
      console.log('data_loadAlpcaForm', data, eval('(' + data.formScript + ')'))
      /* eslint-disable */
      let formScript, formData
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
      window.$('div[id="formAlpaca' + data.dossierPartNo + id + '"]').alpaca(formScript)
    },
    putAlpacaForm ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId,
            cps_auth: ''
          }
        }
        let id = data['id'] ? data['id'] : 'nm'
        try {
          let control = window.$('div[id="formAlpaca' + data.dossierPartNo + id + '"]').alpaca('get')
          let formData = control.getValue()
          let field = window.$('div[id="formAlpaca' + data.dossierPartNo + id + '"]').alpaca('get').childrenByPropertyId
          if (field) {
            for (let prop in field) {
              if (field[prop].isRequired() && field[prop].getValue() === '') {
                toastr.clear()
                toastr.error(field[prop].options.title ? field[prop].options.title + ' là trường dữ liệu bắt buộc' : field[prop].options['name'] + ' là trường dữ liệu bắt buộc')
                reject('valid')
                return
              }
            }
          }
          let dataPutAlpacaForm = new URLSearchParams()
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
    putAlpacaFormCallBack ({ commit, state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: state.initData.groupId,
            cps_auth: ''
          }
        }
        try {
          let dataPutAlpacaForm = new URLSearchParams()
          dataPutAlpacaForm.append('formdata', JSON.stringify(data))
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
          let dataRollBack = new URLSearchParams()
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
          let dataGoto = new URLSearchParams()
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
          let dataPostEform = new FormData()
          let control = window.$('div[id="formAlpaca' + data.partNo + id + '"]').alpaca('get')
          let formData = control.getValue()
          dataPostEform.append('formData', JSON.stringify(formData))
          dataPostEform.append('file', '')
          let field = window.$('div[id="formAlpaca' + data.partNo + id + '"]').alpaca('get').childrenByPropertyId
          if (field) {
            for (let prop in field) {
              if (field[prop].isRequired() && field[prop].getValue() === '') {
                toastr.clear()
                toastr.error(field[prop].options.title ? field[prop].options.title + ' là trường dữ liệu bắt buộc' : field[prop].options['name'] + ' là trường dữ liệu bắt buộc')
                reject('valid')
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
    postEformCallBack ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }
        try {
          let dataPostEform = new FormData()
          console.log('data put1',data)
          dataPostEform.append('formData', JSON.stringify(data))
          dataPostEform.append('file', '')
          let url = state.initData.dossierApi + '/' + data.dossierId + '/eforms/' + data.tp
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
          let dataPostEform = new FormData()
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
        let dataVnPost = new URLSearchParams()
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
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          commit('setLoading', false)
        })
      })
    },
    getDossierTemplateEdit ({commit, state}) {
      return new Promise((resolve, reject) => {
        let dossierTemplatesTemp = state.dossierTemplates
        let resultTemp = []
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
        let urlPluginFormData = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/formdata'
        let urlPluginFormScript = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/formscript'
        let config_plugins = {
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
            let responseScript = urlResponesFormScript.data
            let responseData = urlResponesFormData.data
            // console.log('responseScript==============', responseScript)
            item.plugin = true
            if(responseScript.indexOf('#preview@pdf') !== -1){
              // console.log('view pdf')
              let url = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/preview' 
              let config_blob =  {
                headers: {
                  'groupId': state.initData.groupId
                },
                responseType: 'blob'
              }
              axios.get(url, config_blob).then(function (response) {
                let urlblob = window.URL.createObjectURL(response.data)
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
              let config_view = {
                headers: {
                  'groupId': state.initData.groupId
                },
                dataType: 'json'
              }
              item.html = true
              item.no_html = ''
              let url = state.initData.dossierApi + '/' + item.dossierId + '/plugins/' + item.processPluginId + '/previewhtml'
              axios.get(url, config_view).then(function (response) {
                item.no_html = ''
                vm.stepModel = item
                let serializable = response.data 
                let partNo = serializable.partNo
                let dossierFileId = serializable.dossierFileId
                let formReport = eval('(' + serializable.formReport + ')')
                let formData = eval('(' + serializable.formData + ')')
                // console.log('formReport======', formReport)
                // console.log('formData======', formData)
                formReport.data = formData
                // console.log('formReport_____FINAL=======', formReport)
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
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let listHistoryProcessing = []
          // axios.get('http://127.0.0.1:8080/api/dossiers/dossierlogs/77602/logs', param).then(function (response) {
          axios.get(state.initData.dossierlogsApi + '/' + data.dossierId + '/logs', param).then(function (response) {
            let serializable = response.data
            for (let key in serializable.data) {
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
    downloadFile ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          responseType: 'blob'
        }
        axios.get(state.initData.dossierApi + '/' + data.dossierId + '/files/' + data.fileAttachId, param).then(function (response) {
          let url = window.URL.createObjectURL(response.data)
          // window.open(url)
          let fileType = decodeURI(response.headers['content-disposition'].match(/filename="(.*)"/)[1].split('.')[1])
          let fileName = decodeURI(response.headers['content-disposition'].match(/filename="(.*)"/)[1])
          if ('pdf,png,jpg,jpeg'.indexOf(fileType.toLowerCase()) >= 0) {
            resolve(url)
          } else {
            let serializable = response.data
            saveAs(serializable, fileName)
          }
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    getCpsAuthen ({commit, state}) {
      let vm = this
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {}
        }
        axios.get('http://127.0.0.1:8080/api/onegate/token', param).then(function (response) {
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
      let vm = this
      return new Promise((resolve, reject) => {
        let users = []
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
              let user = {}
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
      let vm = this
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
      let vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let strPings = data.pings.join()
        let params = new URLSearchParams()
        params.append('className', data.className)
        params.append('classPK', data.classPK)
        params.append('parent', data.parent != null ? data.parent : 0)
        params.append('pings', strPings)
        params.append('content', data.content)
        params.append('upvoteCount', data.upvoteCount != null ? data.upvoteCount : 0)
        params.append('opinion', data.opinion)

        axios.post(state.initData.commentApi, params, config)
        .then(function (response) {
          let resPostCmt = {}
          if (response != null) {
            resPostCmt = response.data
            console.log('resPostCmt', resPostCmt)
          }
          resolve(resPostCmt)
        })
        .catch(function (error) {
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          console.log(error)
        })
      })
    },
    putComment ({commit, state}, data) {
      let vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let strPings = data.pings.join()
        let params = new URLSearchParams()
        // params.append('className', data.className)
        // params.append('classPK', data.classPK)
        // params.append('parent', data.parent != null ? data.parent : 0)
        params.append('pings', strPings)
        params.append('content', data.content)
        // params.append('upvoteCount', data.upvoteCount != null ? data.upvoteCount : 0)
        // console.log('dataPut', data)
        axios.put(state.initData.commentApi + '/' + data.commentId, params, config)
        .then(function (response) {
          let resPutCmt = {}
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
      let vm = this
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
      let vm = this
      return new Promise((resolve, reject) => {
        const config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        if (data.userHasUpvoted) {
          let params = new URLSearchParams()
          params.append('className', data.className)
          params.append('classPK', data.classPK)
          params.append('commentId', data.commentId)
          params.append('upvoteCount', data.upvoteCount != null ? data.upvoteCount : 0)
          axios.put(state.initData.commentApi + '/' + data.commentId + '/upvotes',
            params,
            config
          )
          .then(function (response) {
            let res = {}
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
            let res = {}
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
          let vm = this
          let url = state.initData.dossierApi + '/' + data.dossierId + '/nextactions'
          let urlPlugin = state.initData.dossierApi + '/' + data.dossierId + '/plugins'
          axios.all([
            axios.get(url, config),
            axios.get(urlPlugin, config)
            ]).then( axios.spread(function (urlRespones, urlPluginsRespones) {
              let serializable = urlRespones.data.data
              let serializablePlugins = urlPluginsRespones.data.data
              let serializablePluginsConvert = []
              let serializableNextActionConvert = []
              if(serializable){
                for (let i = 0; i < serializable.length; i++) {
                  serializable[i].type = 1
                  if(serializable[i].configNote){
                    let configNote = JSON.parse(serializable[i].configNote)
                    serializable[i].configNote = configNote
                  }
                  serializableNextActionConvert.push(serializable[i])
                }
              }else {
                serializable = []
                serializableNextActionConvert = []
              }
              if (serializablePlugins) {
                for (let i = 0; i < serializablePlugins.length; i++) {
                  let plugin = {
                    type: 2,
                    processActionId: serializablePlugins[i].processPluginId,
                    actionName: serializablePlugins[i].pluginName
                  }
                  serializablePluginsConvert.push(plugin)
                }
              }
              let nextactions = serializableNextActionConvert
              let plugins = serializablePluginsConvert
              // console.log('nextactions++++++++++++', nextactions)
              // console.log('plugins++++++++++++', plugins)
              nextactions.push(...plugins);
              // console.log('nextactions2++++++++++++', nextactions)
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
          }).catch(function (){})
        })
      },
      pullBtnConfigStep ({commit, state}, filter) {
        return new Promise((resolve, reject) => {
          const config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          // test local
          axios.get(state.initData.stepConfigApi + '/status/' + filter.dossierStatus + '/' + filter.dossierSubStatus, config).then(function (response) {
          // axios.get('http://congtrinh0209:8080/api/stepconfigs/done/done_5', params, config).then(function (response) {
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
        let params = new URLSearchParams()
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
          }).catch(function (){})
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
            dataPost.append('delegacy', filter.delegacy)
            axios.post(state.initData.dossierApi + '/' + filter.dossierId + '/users', dataPost, param).then(function (response) {
              resolve(response)
            }).catch(function (error) {
              reject(error)
            })
          }).catch(function (){})
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
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
      }).catch(function (){})
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
          let activeFinish = 0
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
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
              reject(error)
            })
          }
        }).catch(function (){})
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
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
            params: {}
          }
          if (filter.document) {
            param.params.documentType =  filter.document
          }
          axios.get(state.initData.getNextAction + '/' + filter.dossierId + '/documents/print', param).then(function (response) {
            let serializable = response.data
            if (response['status'] !== undefined && response['status'] !== 200) {
              reject('pending')
            } else {
              if (serializable['size']) {
                let file = window.URL.createObjectURL(serializable)
                resolve(file)
              } else {
                resolve('pending')
              }
            }
          }).catch(function (error) {
            console.log(error)
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
            govAgencyCode: filter.govAgencyCode ? filter.govAgencyCode : '',
            govAgencyName: filter.govAgencyName ? filter.govAgencyName : '',
            applicantNote: filter.applicantNote ? filter.applicantNote : '',
            type: filter.type ? filter.type : '',
            applicantIdType: filter.applicantType ? filter.applicantType : ''
          }
          if (filter.type !== 'denied') {
            paramGet['partNo'] = filter.partNo ? filter.partNo : ''
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
              saveAs(serializable, filter.type === 'denied' ? 'tuchoitiepnhan' : 'huongdanthutuc' + new Date().getTime() + '.doc')
            }
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            console.log(error)
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
            toastr.clear()
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
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
      })
    },
    previewTienTrinh ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/dossiers/' + filter.dossierId +'/documents/preview/SEQUENCES', param).then(function (response) {
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
        }).catch(function (){})
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
            reject(error)
          })
        }).catch(function (){})
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
        }).catch(function (){})
      })
    },
    loadFormScriptKQ ({state, commit}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: state.initData.dossierTemplatesApi + '/' + data.templateNo + '/parts/' + data.partNo + '/formscript',
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
        }).catch(function (){})
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
        }).catch(function (){})
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
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            reject(error)
          })
        }).catch(function (){})
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
        }).catch(function (){})
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
          // axios.get('http://127.0.0.1:8080/api/serviceinfos/statistics/agencies', param).then(function (response) {
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
        }).catch(function (){})
      })
    },
    getServiceInfos ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let paramGet = {
            start: filter.start ? filter.start : 0,
            end: filter.end ? filter.end : 10,
            keyword: filter.keyword ? filter.keyword.replace(/[!@#$%^&*(),?":{}|<>]/g, '') : '',
            level: filter.level ? filter.level : 0,
            domain: filter.domain ? filter.domain : ''
          }

          if (filter.domain) {
            paramGet.sort = "siblingSearch"
          }
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramGet
          }
          axios.get('/o/rest/v2/serviceinfos', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServiceConfigs ({commit, state}, data) {
      return new Promise((resolve, reject)=>{
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: data.start ? data.start : 0,
              end: data.end ? data.end : 10,
              agency: data.agency ? data.agency : '',
              keyword: data.keyword ? data.keyword : '',
              domain: data.domain ? data.domain : '',
              level: data.level ? data.level : '3,4',
              serviceConfigId: data.service ? data.service : '',
              service: data.serviceCode ? data.serviceCode : ''
            }
          }
          axios.get('/o/rest/v2/serviceconfigs', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})     
      })
    },
    getServiceAdminisTration ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
            }
          }
          axios.get('/o/rest/v2/dictcollections/REPORT_GROUP/dictgroups', param).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})     
      })     
    },
    getAgencys ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
            }
          }
          if (data.parent) {
            param.params = {
              parent: data.parent
            }
          }
          console.log('data', data)
          axios.get('/o/rest/v2/dictcollections/REPORT_GROUP/dictgroups/' + data.administration + '/dictitems', param).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})     
      })     
    },
    getDomains ({commit,state}, data) {
      return new Promise((resolve, reject)=>{
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              agency: data.agency ? data.agency : '',
              sort: 'siblingSearch'
            }
          }
          axios.get('/o/rest/v2/serviceinfos/statistics/domains', param).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})     
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
        }).catch(function (){})
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
          // axios.get('http://127.0.0.1:8080/api/serviceinfos/' + data.serviceConfigId + '/processes', param).then(function (response) {
          axios.get(state.initData.getServiceConfigs + '/' + data.serviceConfigId + '/processes', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              resolve(serializable.data)
            } else {
              resolve('')
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      }).catch(function (){})
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
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})
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
          // axios.get('http://127.0.0.1:8080/api/dictcollections/ADMINISTRATIVE_REGION/dictitems', param).then(function (response) {
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
        }).catch(function (){})
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
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getAgencyLists ({commit, state}, data) {
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
          axios.get('/o/rest/v2/serviceinfos/statistics/agencies', param).then(function (response) {
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
        }).catch(function (){})
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
        }).catch(function (){})
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
        }).catch(function (){})
      })
    },
    getDomainLists ({commit, state}, data) {
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
        }).catch(function (){})
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
            reject(error)
          })
        }).catch(function (){})
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
        }).catch(function (){})
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
          let dataPutDossierFile = new URLSearchParams()
          dataPutDossierFile.append('displayName', data.displayName)
          axios.put(state.initData.serviceInfoApi + '/' + data.dossierId + '/files/' + data.dossierFileId, dataPutDossierFile, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        }).catch(function (){})
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
        }).catch(function (){})
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
          axios.get('/o/rest/v2/postal/votings/' + data.className + '/' + data.classPk, param).then(result => {
          // axios.get('http://127.0.0.1:8080/api/votings/12/' + data.classPK, param).then(result => {
            let serializable = result.data
            if (serializable && serializable.data) {
              resolve(serializable.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    loadVotingMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadDetailDossierMC', data['dossierDetail']).then(result => {
          let config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('method', 'GET')
          dataPost.append('url', '/postal/votings/' + data.className + '/' + result['dossierId'])
          dataPost.append('data', '')
          dataPost.append('serverCode', 'SERVER_' + result['govAgencyCode'])
          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result1) {
            if (result1.data) {
              resolve(result1.data.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(xhr => {
        })
      })
    },
    loadDetailDossierMC ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/dossiers/' + data['referenceUid'])
        dataPost.append('data', '')
        dataPost.append('serverCode', 'SERVER_' + data['govAgencyCode'])
        axios.post('/o/rest/v2/proxy', dataPost, config).then(function (result) {
          resolve(result.data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    submitVoting ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          // let params = new URLSearchParams()
          // const config = {
          //   headers: {
          //     'groupId': state.initData.groupId
          //   }
          // }
          // params.append('className', data.className)
          // params.append('classPk', data.classPk)
          // params.append('votingCode', data.votingCode ? data.votingCode : '')
          // params.append('selected', data.selected)
          // axios.post('/o/rest/v2/postal/votings/' + data.votingId + '/results', params, config).then(result => {
          //   resolve(result.data)
          // }).catch(xhr => {
          //   reject(xhr)
          // })

          // api đồng bộ sang một cửa
          let config = {
            headers: {
              'groupId': state.initData.groupId
            }
          }
          let textPost = {
            className: data.className,
            classPk: data.classPk,
            selected: data.selected,
            votingCode: data.votingCode ? data.votingCode : ''
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
        }).catch(function (){})
      })
    },
    validFileUpload ({commit, state}, data) {
      let getFileType = data.file.name ? data.file.name.split('.') : ''
      let fileType = getFileType ? getFileType[getFileType.length - 1] : ''
      let fileTypeAllow = data.partTip['extensions'] ? (data.partTip['extensions'] + ',' + data.partTip['extensions'].toUpperCase()).split(',') : ''
      let fileSizeAllow = data.partTip['maxSize']
      let fileTypeInput = fileTypeAllow ? fileTypeAllow.filter(function (item) {
        return item === fileType
      }) : ''
      store.commit('setValidFileUpload', false)
      if (fileTypeInput && fileTypeInput.length > 0) {
        if (Number(data.file.size) <= data.partTip['maxSize'] * 1048576 || !data.partTip['maxSize']) {
          store.commit('setValidFileUpload', true)
        } else {
          toastr.clear()
          toastr.error('Tài liệu tải lên dung lượng tối đa là ' + data.partTip['maxSize'] + ' MB')
          store.commit('setValidFileUpload', false)
        }
      } else {
        if (!data.partTip['extensions']) {
          store.commit('setValidFileUpload', true)
        } else {
          toastr.clear()
          toastr.error('Tài liệu tải lên chỉ chấp nhận các định dạng ' + data.partTip['extensions'])
          store.commit('setValidFileUpload', false)
        }
      }
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
        let url = '/o/rest/v2/applicants/jcaptcha'
        axios.get(url, param).then(response => {
          let url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    getServiceRecently ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.start ? filter.start : 0,
              end: filter.end ? filter.end : 50,
              top: 'recently'
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceinfos/statistic/recently', param).then(result => {
            let serializable = result.data
            if (serializable) {
              resolve(serializable)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    // add new template
    loadDossierFormTemplates ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.initData.dossierTemplatesApi + '/' + data.dossierTemplateNo, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getServiceConfigDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2/serviceconfigs/' + filter.serviceConfigId, param).then(result => {
            let serializable = result.data
            if (serializable) {
              resolve(serializable)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    getScriptViewDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2_1/menuconfigs/'+ filter.menuGroup + '/script', param).then(result => {
            let serializable = result.data
            if (serializable) {
              resolve(serializable)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    getDetailMenuConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          // test local
          axios.get('/o/rest/v2_1/menuconfigs/' + filter.menuGroup, param).then(result => {
            let serializable = result.data
            if (serializable) {
              resolve(serializable)
            } else {
              resolve('')
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    getPreAction ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/dossiers/'+ data.dossierId + '/delegacy', param).then(result => {
            let serializable = result.data
            resolve(serializable)
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    getNotifyConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/dossiers/' + filter['dossierId'] + '/metadata/' + filter['key'], param).then(result => {
            let serializable = result.data
            if (serializable) {
              resolve(serializable)
            }
          }).catch(xhr => {
            reject(xhr)
          })
        }).catch(function (){})
      })
    },
    putUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        let dataPutUser = new URLSearchParams()
        let url = ''
        url = '/o/rest/v2/applicants/' + filter['applicantId']
        dataPutUser.append('applicantName', filter['applicantName'])
        dataPutUser.append('applicantIdType', filter['applicantIdType'])
        dataPutUser.append('contactTelNo', filter['contactTelNo'])
        dataPutUser.append('address', filter['address'])
        dataPutUser.append('contactEmail', filter['contactEmail'])
        dataPutUser.append('cityCode', filter['cityCode'])
        dataPutUser.append('cityName', filter['cityName'])
        dataPutUser.append('districtCode', filter['districtCode'])
        dataPutUser.append('districtName', filter['districtName'])
        dataPutUser.append('wardCode', filter['wardCode'])
        dataPutUser.append('wardName', filter['wardName'])
        // dataPutUser.append('applicantIdNo', filter['applicantIdNo'])
        dataPutUser.append('applicantIdDate', filter['applicantIdDate'])
        axios.put(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
          commit('setsnackbarerror', true)
        })
      })
    },
    putNotifyConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          let data = {
            smsNotify: filter['smsNotify'],
            emailNotify: filter['emailNotify']
          }
          let formData = new URLSearchParams()
          formData.append('metaData', JSON.stringify(data))
          axios.put('/o/rest/v2/dossiers/' + filter['dossierId'] + '/metadata' ,formData , param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    updateFileKySoPlugin ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        let dataUpdate = new URLSearchParams()
        let url = ''
        url = '/o/rest/v2/defaultsignature/vgca/' + filter['dossierId'] + '/dossierFiles'
        dataUpdate.append('fileEntries', filter['fileEntries'])
        dataUpdate.append('dossierFiles', filter['dossierFiles'])
        axios.put(url, dataUpdate, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    getNotarization ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            groupId: state.initData.groupId
          },
          params: {
            dossierId: filter.dossierId
          }
        }
        axios.get('/o/rest/v2/notarizations', config).then(function (response) {
          let serializable = response.data
          if (serializable.data) {
            if (Array.isArray(serializable.data)) {
              resolve(serializable.data)
            } else {
              resolve([serializable.data])
            }
          } else {
            resolve([])
          }
        }).catch(function (xhr) {
          reject([])
        })
      })
    },
    createNotarization ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('dossierId', filter.dossierId)
          dataPost.append('fileName', filter.fileName)
          dataPost.append('totalRecord', Number(filter.totalRecord))
          dataPost.append('totalPage', Number(filter.totalPage))
          dataPost.append('totalFee', filter.totalFee.toString().replace(/\./g, ''))
          dataPost.append('totalCopy', 0),
          dataPost.append('notarizationNo', (new Date()).getTime()),
          dataPost.append('notarizationYear', (new Date()).getFullYear()),
          dataPost.append('totalCopy', 0),
          dataPost.append('notarizationDate', (new Date()).getTime()),
          dataPost.append('signerName', ''),
          dataPost.append('signerPosition', ''),
          dataPost.append('statusCode', ''),

          axios.post('/o/rest/v2/notarizations', dataPost, param).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    updateNotarization ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPut = new URLSearchParams()
          dataPut.append('fileName', filter.fileName)
          dataPut.append('totalRecord', Number(filter.totalRecord))
          dataPut.append('totalPage', Number(filter.totalPage))
          dataPut.append('totalFee', filter.totalFee.toString().replace(/\./g, ''))
          dataPut.append('totalCopy', 0)
          axios.put('/o/rest/v2/notarizations/' + filter.notarizationId, dataPut, param).then(function (response) {
            resolve(response)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    deleteNotarization ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/rest/v2/notarizations/' + filter.notarizationId, param).then(function (response) {
            resolve(response)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getDictcollections ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: 'o/rest/v2/dictcollections/REPORT_GROUP/dictgroups/' + filter.groupCode +'/dictitems',
            method: 'get',
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.request(config).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getLevels ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/serviceinfos/statistics/levels',
            method: 'get',
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.request(config).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data.filter(function (item) {
                return String(item.level) !== '2'
              })
              for (let key in dataReturn) {
                dataReturn[key]['levelName'] = 'Mức độ ' + dataReturn[key].level
              }
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getVtPayStatus ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/pgi/vtp/search',
            method: 'get',
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              billcode: filter.billcode,
              order_id: filter.order_id
            }
          }
          axios.request(config).then(function (response) {
            resolve(response)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (){})
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
    setLoadingGov (state, payload) {
      state.loadingGov = payload
    },
    setValidFileUpload (state, payload) {
      state.validFileUpload = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setVisibleDoAction (state, payload) {
      state.visibleDoAction = payload
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
    setDataCreateFile (state, payload) {
      state.dataCreateFile = payload
    },
    setCheckInput (state, payload) {
      state.checkInput = payload
    },
    setUserNextAction (state, payload) {
      state.usersNextAction = payload ? payload : []
    },
    setStepOverdueNextAction (state, payload) {
      state.stepOverdueNextAction = payload
    },
    setThongTinChuHoSo (state, payload) {
      let userTypeCondition = '1'
      if (payload.applicantIdType === 'business' || payload.userType === '2') {
        userTypeCondition = '2'
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
        userType: userTypeCondition
      }
      state.thongTinChuHoSo = thongTinChuHoSoPayLoad
    },
    setThongTinChuHoSoBindChuyenPhat (state, payload) {
      state.thongTinChuHoSoBindChuyenPhat = {
        cityCode: payload.cityCode,
        districtCode: payload.districtCode,
        wardCode: payload.wardCode,
        address: payload.address,
        contactTelNo: payload.contactTelNo
      }
    },
    setThongTinNguoiNopHoSo (state, payload) {
      state.thongTinNguoiNopHoSo = Object.assign(state.thongTinNguoiNopHoSo, payload)
    },
    setDichVuChuyenPhatKetQua (state, payload) {
      let tempData = {
        viaPostal: payload.viaPostal,
        postalServiceCode: payload.postalServiceCode ? payload.postalServiceCode : '',
        postalAddress: payload.postalAddress ? payload.postalAddress : '',
        postalCityCode: payload.postalCityCode ? payload.postalCityCode : '',
        postalDistrictCode: payload.postalDistrictCode ? payload.postalDistrictCode : '',
        postalWardCode: payload.postalWardCode ? payload.postalWardCode : '',
        postalTelNo: payload.postalTelNo ? payload.postalTelNo : ''
      }
      state.dichVuChuyenPhatKetQua = tempData
    },
    setDichVuChuyenPhatHoSo (state, payload) {
      let tempData = {
        vnpostalStatus: payload.vnpostalStatus,
        postalServiceCode: payload.postalServiceCode ? payload.postalServiceCode : '',
        postalAddress: payload.postalAddress ? payload.postalAddress : '',
        postalCityCode: payload.postalCityCode ? payload.postalCityCode : '',
        postalCityName: payload.postalCityName ? payload.postalCityName : '',
        postalDistrictCode: payload.postalDistrictCode ? payload.postalDistrictCode : '',
        postalDistrictName: payload.postalDistrictName ? payload.postalDistrictName : '',
        postalWardCode: payload.postalWardCode ? payload.postalWardCode : '',
        postalWardName: payload.postalWardName ? payload.postalWardName : '',
        postalTelNo: payload.postalTelNo ? payload.postalTelNo : ''
      }
      state.dichVuChuyenPhatHoSo = tempData
    },
    setViaPostal (state, payload) {
      state.viaPostal = payload
    },
    setServiceConfigObj (state, payload) {
      state.serviceConfigObj = payload
    },
    setThongTinChungHoSo (state, payload) {
      let durationText
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
    dossierSelected (state, payload) {
      state.dossierSelected = payload
    },
    actionActive (state, payload) {
      state.actionActive = payload
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
    },
    setKysoSuccess (state, payload) {
      state.kysoSuccess = payload
    },
    setActiveGetCounter (state, payload) {
      state.activeGetCounter = payload
    },
    setActiveLoadingDataHoSo (state, payload) {
      state.activeLoadingDataHoSo = payload
    },
    setDataCreateDossier (state, payload) {
      state.dataCreateDossier = payload
    },
    setPaymentProfile (state, payload) {
      state.paymentProfile = payload
    },
    setPaymentFileName (state, payload) {
      state.paymentFileName = payload
    },
    setApplicantBussinessExit (state, payload) {
      state.applicantBussinessExit = payload
    },
    setApplicantNote (state, payload) {
      state.applicantNote = payload
    },
    setApplicantId (state, payload) {
      state.applicantId = payload
    },
    setForGroupDossier (state, payload) {
      state.forGroupDossier = payload
    },
    setSelectDossierGroup (state, payload) {
      state.dossierIntoGroup = payload
    },
    setFilesAdd (state, payload) {
      state.filesAdd = payload
    },
    setActiveAddFileGroup (state, payload) {
      state.activeAddFileGroup = payload
    },
    setUserLogin (state, payload) {
      state.userLogin = payload
    },
    setDossierTemplateLienThong (state, payload) {
      state.dossierTemplateLienThong = payload
    },
    setActivePrintBienNhan (state, payload) {
      state.activePrintBienNhan = payload
    },
    setCreateFileSigned (state, payload) {
      state.createFileSigned = payload
    },
    setAdvSearchShow (state, payload) {
      state.advSearchShow = payload
    },
    setIsMobile (state, payload) {
      state.isMobile = payload
    },
  },
  getters: {
    loading (state) {
      return state.loading
    },
    loadingTable (state) {
      return state.loadingTable
    },
    getVisibleDoAction (state) {
      return state.visibleDoAction
    },
    loadingGov (state) {
      return state.loadingGov
    },
    error (state) {
      return state.error
    },
    index (state) {
      return state.index
    },
    dossierSelected (state) {
      return state.dossierSelected
    },
    actionActive (state) {
      return state.actionActive
    },
    loadingMenuConfigToDo (state) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadMenuConfigToDo').then(function (result) {
          resolve(result)
        }).catch(function () {})
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
    thongTinChuHoSoBindChuyenPhat (state) {
      return state.thongTinChuHoSoBindChuyenPhat
    },
    kysoSuccess (state) {
      return state.kysoSuccess
    },
    activeGetCounter (state) {
      return state.activeGetCounter
    },
    activeLoadingDataHoSo (state) {
      return state.activeLoadingDataHoSo
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
    dichVuChuyenPhatHoSo (state) {
      return state.dichVuChuyenPhatHoSo
    },
    viaPostal (state) {
      return state.viaPostal
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
    getDataCreateFile (state) {
      return state.dataCreateFile
    },
    getCheckInput (state) {
      return state.checkInput
    },
    getUsersNextAction (state) {
      return state.usersNextAction
    },
    getStepOverdueNextAction (state) {
      return state.stepOverdueNextAction
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
    },
    getDataCreateDossier (state) {
      return state.dataCreateDossier
    },
    getPaymentProfile (state) {
      return state.paymentProfile
    },
    getPaymentFileName (state) {
      return state.paymentFileName
    },
    getUser (state) {
      return state.user
    },
    getApplicantIdNo (state) {
      return state.applicantId
    },
    getApplicantNote (state) {
      return state.applicantNote
    },
    getApplicantBussinessExit (state) {
      return state.applicantBussinessExit
    },
    getForGroupDossier (state) {
      return state.forGroupDossier
    },
    getDossierIntoGroup (state) {
      return state.dossierIntoGroup
    },
    getFilesAdd (state) {
      return state.filesAdd
    },
    activeAddFileGroup (state) {
      return state.activeAddFileGroup
    },
    getMenuConfigsTodo (state) {
      return state.trangThaiHoSoList
    },
    getUserLogin (state) {
      return state.userLogin
    },
    getDossierTemplateLienThong (state) {
      return state.dossierTemplateLienThong
    },
    getActivePrintBienNhan (state) {
      return state.activePrintBienNhan
    },
    getCreateFileSigned (state) {
      return state.createFileSigned
    },
    advSearchShow (state) {
      return state.advSearchShow
    },
    getIsMobile (state) {
      return state.isMobile
    },
  }
})
