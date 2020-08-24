import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import saveAs from 'file-saver'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    snackbarerror: false,
    snackbarsocket: false,
    refreshSocket: 0,
    initData: {},
    tocken: '',
    loginUser: [
      {
        'email': '',
        'role': ''
      }
    ],
    user: null,
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
    isConnected: false,
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8081/api',
    listTableMenu: [
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Nghiệp vụ',
        model: true,
        children: [
          {
            icon: 'group_add',
            link: '/table/opencps_employee',
            code: 'opencps_employee',
            text: 'Quản lý nhân sự'
          },
          {
            icon: 'filter_1',
            link: '/table/opencps_serviceinfo',
            code: 'opencps_serviceinfo',
            text: 'Thủ tục hành chính'
          },
          {
            icon: 'filter_2',
            link: '/table/opencps_dossiertemplate',
            code: 'opencps_dossiertemplate',
            text: 'Mẫu hồ sơ'
          },
          {
            icon: 'filter_3',
            link: '/table/opencps_serviceprocess',
            code: 'opencps_serviceprocess',
            text: 'Quy trình thủ tục'
          },
          {
            icon: 'filter_4',
            link: '/table/opencps_serviceconfig',
            code: 'opencps_serviceconfig',
            text: 'Dịch vụ công'
          },
          {
            icon: 'filter_5',
            link: '/table/opencps_certnumbers/certnumbers',
            code: 'certnumbers',
            text: 'Tham số hệ thống'
          },
          {
            icon: 'filter_6',
            link: '/table/opencps_voting/votings',
            code: 'votings',
            text: 'Câu hỏi đánh giá, khảo sát'
          },
          {
            icon: 'filter_7',
            link: '/table/opencps_config_report/reports',
            code: 'reports',
            text: 'Cấu hình dữ liệu thống kê'
          },
          {
            icon: 'filter_8',
            link: '/table/opencps_mapping/tthc',
            code: 'mapping',
            text: 'Mapping thủ tục'
          },
          {
            icon: 'filter_9',
            link: '/table/opencps_mapping/domain',
            code: 'mapping',
            text: 'Đồng bộ danh mục lĩnh vực'
          },
          {
            icon: 'filter',
            link: '/table/opencps_mapping/agency',
            code: 'mapping',
            text: 'Đồng bộ danh mục cơ quan'
          },
          {
            icon: 'filter',
            link: '/table/opencps_mapping/sharingqa',
            code: 'mapping',
            text: 'Đồng bộ danh mục câu hỏi'
          },
          {
            icon: 'import_export',
            link: '/table/import/tool_import',
            code: 'import',
            text: 'Import'
          },
          {
            icon: 'import_export',
            link: '/table/export/tool_export',
            code: 'export',
            text: 'Export'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_stt/stt',
            code: 'stt',
            text: 'Số TT, Sổ theo dõi'
          },
          {
            icon: 'arrow_right',
            link: '/table/sync/statistics',
            code: 'statistics',
            text: 'Đồng bộ thống kê hồ sơ'
          },
          {
            icon: 'arrow_right',
            link: '/table/dossierlogs/revesionLog',
            code: 'revesionLog',
            text: 'Nhật ký phiên bản'
          }
        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Dữ liệu dùng chung',
        model: false,
        children: [
        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Bảng dữ liệu DB',
        model: false,
        children: [
        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Cấu hình',
        model: false,
        children: [
          {
            icon: 'apps',
            link: '/table/opencps_adminconfig',
            code: 'opencps_adminconfig',
            text: 'Danh sách màn hình'
          }
        ]
      }
    ],
    jobPosList: [],
    dossierStatusList: [],
    dossierSubStatusList: [],
    employeesList: [],
    dossierTemplatesList: [],
    processStepList: [],
    processActionList: [],
    processRoleList: [],
    problem: true
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
    loadMermaidgraph ({state}, id) {
      let config = {
        headers: {
          groupId: state.initData.groupId
        }
      }
      let url = '/o/rest/v2/serviceprocesses/' + id + '/mermaidgraph'
      return new Promise((resolve, reject) => {
        axios.get(url, config).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    doExportData ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            responseType: 'blob'
          }
          let formData = new URLSearchParams()
          axios.post('/o/rest/v2/backupDatas/backup', formData, param).then(function (response) {
            let serializable = response.data
            if (serializable) {
              saveAs(serializable, 'DataExport.zip')
            }
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    doChangeStatusAccount ({commit, state}, postData) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.put('/o/v1/opencps/user/' + postData['id'] + '/deactive', postData['data'], param).then(function () {
            resolve({status: 200})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    deactiveAccount ({commit, state}, postData) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.put('/o/v1/opencps/user/' + postData['id'] + '/deactive', postData['data'], param).then(function () {
            resolve({statu: 200})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    changePassUserAccount ({commit, state}, postData) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.put('/o/v1/opencps/user/' + postData['id'] + '/changepass', postData['data'], param).then(function () {
            resolve({statu: 200})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    createUserAccount ({commit, state}, postData) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          let endPoint = postData['type'] === 'applicant' ? '/o/rest/v2/applicants/' :  '/o/rest/v2/employees/'
          var dataPostProcess = new URLSearchParams()
          dataPostProcess.append('email', postData['data']['email'])
          dataPostProcess.append('screenName', '')
          dataPostProcess.append('exist', false)
          axios.post(endPoint + postData['id'] + '/account', dataPostProcess, param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (errorRes) {
            reject(errorRes)
            if (errorRes.response['status'] && errorRes.response['status'] === 409) {
              alert('Địa chỉ email đã được sử dụng trên hệ thống')
            } else {
              commit('setsnackbarerror', true)
            }
          })
        })
      })
    },
    getUserAccount ({commit, state}, userId) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/v1/opencps/user/' + userId, param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getUserDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          let endPoint = filter['type'] === 'applicant' ? '/o/rest/v2/applicants/' :  '/o/rest/v2/employees/'
          axios.get(endPoint + filter['id'], param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (errorRes) {
            reject(errorRes)
          })
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
    },
    downloadServiceFileTemplate ({commit, state}, item) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Content-Type': 'application/octet-stream'
            },
            responseType: 'blob'
          }
          axios.get('/o/v1/opencps/filetemplate/' + item['serviceInfoId'] + '/' + item['fileTemplateNo'], param).then(function (data) {
            saveAs(data.data, item['uuid'] + '.' + item['extension'])
            resolve({status: true})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    detailFileAttachsVersions ({commit, state}, item) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              'Content-Type': 'application/octet-stream'
            },
            responseType: 'blob'
          }
          axios.get('/o/rest/v2/fileattachs/versions/'+item.fileEntryId+'/'+item.version, param).then(function (data) {
            saveAs(data.data, item['uuid'] + '.' + item['extension'])
            resolve({status: true})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    updateServiceFileTemplate ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.put('/o/v1/opencps/filetemplate/' + data['item']['serviceInfoId'] + '/' + data['item']['fileTemplateNo'], {
            fileTemplateNo: data['fileTemplateNo'],
            templateName: data['templateName']
          }, param).then(function () {
            resolve({status: true})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    removeServiceFileTemplate ({commit, state}, item) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete('/o/v1/opencps/filetemplate/' + item['serviceInfoId'] + '/' + item['fileTemplateNo'], param).then(function () {
            resolve({status: true})
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getServiceFileTemplate ({commit, state}, pk) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/v1/opencps/filetemplate/' + pk, param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getAttachFileData ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/v1/opencps/fileattach/' + filter['className'] + '/' + filter['pk'], param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getJobposList ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/jobpos', param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable.data)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getDossierStatusList ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/dictcollections/DOSSIER_STATUS/dictitems', param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable.data)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getDossierSubStatusList ({commit, state}, dossierStatus) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/dictcollections/DOSSIER_STATUS/dictitems?parent=' + dossierStatus, param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getAgencyLists ({state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          axios.get(state.endPointApi +'/dictcollections/GOVERNMENT_AGENCY/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    REGISTER_GOVAGENCY ({state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          axios.get(state.endPointApi +'/dictcollections/REGISTER_GOVAGENCY/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getRegisterBookList ({state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          axios.get(state.endPointApi +'/dictcollections/REGISTER_BOOK/dictitems', param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getDossierTemplate ({state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/dossiertemplates', param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    getEmployee ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/employees', param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getDossierPart ({commit, state}, template) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/dossiertemplates/' + template + '/parts', param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessDetail ({commit, state}, id) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + id, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessStepsDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/steps/' + filter.stepCode, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessStep ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let paramInput = filter.page ? {
            start: filter.page * 10 - 10,
            end: filter.page * 10
          } : {}
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramInput
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/steps', param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessAction ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 10 - 10,
              end: filter.page * 10
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/actions', param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessRole ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/roles', param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessSequence ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/sequences', param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getProcessActionsDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/actions/' + filter.actionCode, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    deleteProcessAction ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete(state.endPointApi + '/serviceprocesses/' + filter.currentProcess + '/actions/' + filter.processActionId, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    postProcess ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcess = new URLSearchParams()
          dataPostProcess.append('processNo', data.processNo ? data.processNo : '')
          dataPostProcess.append('processName', data.processName ? data.processName : '')
          dataPostProcess.append('description', data.description ? data.description : '')
          dataPostProcess.append('durationCount', data.durationCount)
          dataPostProcess.append('durationUnit', data.durationUnit)
          dataPostProcess.append('generateDossierNo', data.generateDossierNo)
          dataPostProcess.append('dossierNoPattern', data.dossierNoPattern)
          dataPostProcess.append('dossierGroupPattern', data.dossierGroupPattern ? data.dossierGroupPattern : '')
          dataPostProcess.append('generateDueDate', data.generateDueDate)
          dataPostProcess.append('dueDatePattern', data.dueDatePattern)
          dataPostProcess.append('generatePassword', data.generatePassword)
          dataPostProcess.append('directNotification', data.directNotification)
          dataPostProcess.append('serverNo', data.serverNo)
          if (data.type === 'add') {
            axios.post(state.endPointApi + '/serviceprocesses', dataPostProcess, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          } else {
            axios.put(state.endPointApi + '/serviceprocesses/' + data.serviceProcessId, dataPostProcess, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              commit('setsnackbarerror', true)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
      })
    },
    postProcessRoles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcessRoles = new URLSearchParams()
          var moderator = data.processRoles.moderator
          dataPostProcessRoles.append('roleId', data.processRoles.roleId)
          if (data.processRoles.moderator === false || data.processRoles.moderator === 'false') {
            moderator = 0
          }
          if (data.processRoles.moderator === true || data.processRoles.moderator === 'true') {
            moderator = 1
          }
          dataPostProcessRoles.append('moderator', moderator)
          dataPostProcessRoles.append('roleName', data.processRoles.roleName ? data.processRoles.roleName : '')
          dataPostProcessRoles.append('roleCode', data.processRoles.roleCode ? data.processRoles.roleCode : '')
          dataPostProcessRoles.append('condition', data.processRoles.condition ? data.processRoles.condition : '')
          axios.post(state.endPointApi + '/serviceprocesses/' + data.processId + '/roles', dataPostProcessRoles, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    putProcessRoles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcessRoles = new URLSearchParams()
          dataPostProcessRoles.append('moderator', data.processRoles.moderator)
          dataPostProcessRoles.append('condition', data.processRoles.condition ? data.processRoles.condition : '')
          axios.put(state.endPointApi + '/serviceprocesses/' + data.processId + '/roles/' + data.processRoles.roleId, dataPostProcessRoles, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    deleteProcessRoles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.delete(state.endPointApi + '/serviceprocesses/' + data.processId + '/roles/' + data.processRoles.roleId, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    postProcessSequence ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcessSequence = new URLSearchParams()
          dataPostProcessSequence.append('sequenceName', data.processSequence.sequenceName ? data.processSequence.sequenceName : '')
          dataPostProcessSequence.append('sequenceNo', data.processSequence.sequenceNo ? data.processSequence.sequenceNo : '')
          dataPostProcessSequence.append('durationCount', data.processSequence.durationCount)
          dataPostProcessSequence.append('sequenceRole', data.processSequence.sequenceRole ? data.processSequence.sequenceRole : '')
          axios.post(state.endPointApi + '/serviceprocesses/' + data.processId + '/sequences', dataPostProcessSequence, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    deleteProcessSequence ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.delete(state.endPointApi + '/serviceprocesses/' + data.processId + '/sequences/' + data.processSequence.sequenceNo, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    postProcessStep ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostStep = new URLSearchParams()
          dataPostStep.append('stepCode', data.stepCode)
          dataPostStep.append('stepName', data.stepName)
          dataPostStep.append('sequenceNo', data.sequenceNo)
          dataPostStep.append('dossierStatus', data.dossierStatus ? data.dossierStatus : '')
          dataPostStep.append('dossierSubStatus', data.dossierSubStatus ? data.dossierSubStatus : '')
          dataPostStep.append('durationCount', data.durationCount)
          dataPostStep.append('customProcessUrl', data.customProcessUrl)
          dataPostStep.append('briefNote', data.briefNote)
          dataPostStep.append('stepInstruction', data.stepInstruction)
          dataPostStep.append('editable', data.editable)
          dataPostStep.append('checkInput', data.checkInput ? data.checkInput : '')
          if (data.type === 'add') {
            axios.post(state.endPointApi + '/serviceprocesses/' + data.currentProcess + '/steps', dataPostStep, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          } else {
            axios.put(state.endPointApi + '/serviceprocesses/' + data.currentProcess + '/steps/' + data.stepCode, dataPostStep, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              commit('setsnackbarerror', true)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
      })
    },
    deleteProcessStep ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete(state.endPointApi + '/serviceprocesses/' + filter.currentProcess + '/steps/' + filter.stepCode, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getStepRole ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/steps/' + filter.stepId + '/roles', param).then(function (response) {
            let seriable = response.data
            if (seriable.data) {
              resolve(seriable.data)
            } else {
              resolve([])
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    postStepRoles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcessRoles = new URLSearchParams()
          var moderator = data.stepRoles.moderator
          if (data.stepRoles.moderator === false || data.stepRoles.moderator === 'false') {
            moderator = 0
          }
          if (data.stepRoles.moderator === true || data.stepRoles.moderator === 'true') {
            moderator = 1
          }
          dataPostProcessRoles.append('roleId', data.stepRoles.roleId ? data.stepRoles.roleId : '')
          dataPostProcessRoles.append('roleName', data.stepRoles.roleName ? data.stepRoles.roleName : '')
          dataPostProcessRoles.append('roleCode', data.stepRoles.roleCode ? data.stepRoles.roleCode : '')
          dataPostProcessRoles.append('moderator', moderator)
          dataPostProcessRoles.append('condition', data.stepRoles.condition ? data.stepRoles.condition : '')
          axios.post(state.endPointApi + '/serviceprocesses/' + data.processId + '/steps/' + data.stepId + '/roles', dataPostProcessRoles, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    deleteStepRoles ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.delete(state.endPointApi + '/serviceprocesses/' + data.processId + '/steps/' + data.stepId + '/roles/' + data.stepRoles.roleId, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    postProcessAction ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostAction = new URLSearchParams()
          dataPostAction.append('actionCode', data.actionCode ? data.actionCode : '')
          dataPostAction.append('actionName', data.actionName ? data.actionName : '')
          dataPostAction.append('preStepCode', data.preStepCode ? data.preStepCode : '')
          dataPostAction.append('postStepCode', data.postStepCode ? data.postStepCode : '')
          dataPostAction.append('autoEvent', data.autoEvent ? data.autoEvent : '')
          dataPostAction.append('preCondition', data.preCondition ? data.preCondition : '')
          dataPostAction.append('allowAssignUser', data.allowAssignUser)
          dataPostAction.append('assignUserId', data.assignUserId ? data.assignUserId : '')
          dataPostAction.append('requestPayment', data.requestPayment ? data.requestPayment : 0)
          dataPostAction.append('paymentFee', data.paymentFee ? data.paymentFee : '')
          dataPostAction.append('syncActionCode', data.syncActionCode ? data.syncActionCode : '')
          dataPostAction.append('rollbackable', data.rollbackable)
          dataPostAction.append('createDossierFiles', data.createDossierFiles ? data.createDossierFiles.join() : '')
          dataPostAction.append('returnDossierFiles', data.returnDossierFiles ? data.returnDossierFiles.join() : '')
          dataPostAction.append('createDossierNo', data.createDossierNo ? data.createDossierNo : '')
          dataPostAction.append('eSignature', data.eSignature)
          dataPostAction.append('signatureType', data.eSignature && data.signatureType ? data.signatureType : '')
          dataPostAction.append('configNote', data.configNote ? data.configNote : data.configNote)
          dataPostAction.append('dossierTemplateNo', data.dossierTemplateNo ? data.dossierTemplateNo : '')
          // dataPostAction.append('createDossiers', data.createDossier ? data.createDossier.join() : '')
          dataPostAction.append('createDossiers', data.createDossier ? data.createDossier : '')
          // dataPostAction.append('postAction', data.postAction ? data.postAction : '')
          if (data.type === 'add') {
            console.log('dataPostAction', dataPostAction)
            axios.post(state.endPointApi + '/serviceprocesses/' + data.currentProcess + '/actions', dataPostAction, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          } else {
            axios.put(state.endPointApi + '/serviceprocesses/' + data.currentProcess + '/actions/' + data.processActionId, dataPostAction, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              commit('setsnackbarerror', true)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
      })
    },
    postAction ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostAction = new URLSearchParams()

          dataPostAction.append('postAction', data.postAction ? data.postAction : '')
          axios.put(state.endPointApi + '/serviceprocesses/processAction/' + data.processActionId + '/postAction', dataPostAction, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    // THAM SỐ HỆ THỐNG
    getCertNumberList ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let paramInput = filter.page ? {
            start: filter.page * 10 - 10,
            end: filter.page * 10
          } : {}
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: paramInput
          }
          axios.get(state.endPointApi + '/vr-app/certnumbers', param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getCertNumberDetail ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/vr-app/certnumbers/' + filter.certId, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    updateCertNumber({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostCertNumber = new URLSearchParams()
          dataPostCertNumber.append('pattern', data.pattern ? data.pattern : '')
          dataPostCertNumber.append('initNumber', data.initNumber ? data.initNumber : '')
          if (data.type === 'add') {
            axios.post(state.endPointApi + '/vr-app/certnumbers', dataPostCertNumber, options).then(function (response) {
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
            })
          } else {
            axios.put(state.endPointApi + '/vr-app/certnumbers/' + data.certId, dataPostCertNumber, options).then(function (response) {
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              commit('setsnackbarerror', true)
            })
          }
        })
      })
    },
    deleteCertNumber ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.delete(state.endPointApi + '/vr-app/certnumbers/' + filter.certId).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    // VOTING - CÂU HỎI KHẢO SÁT
    getVotingList ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get(state.endPointApi + '/postal/votings/' + filter.className + '/0', param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    updateVotings ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostVoting = new URLSearchParams()
          dataPostVoting.append('className', data.className ? data.className : '')
          dataPostVoting.append('classPK', data.classPK ? data.classPK : '')
          dataPostVoting.append('votingCode', data.votingCode ? data.votingCode : '')
          dataPostVoting.append('subject', data.subject ? data.subject : '')
          dataPostVoting.append('choices', data.choices ? data.choices : '')
          dataPostVoting.append('commentable', data.commentable ? data.commentable : '')
          if (data.type === 'add') {
            axios.post(state.endPointApi + '/postal/votings', dataPostVoting, options).then(function (response) {
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
            })
          } else {
            axios.put(state.endPointApi + '/postal/votings/' + data.votingId, dataPostVoting, options).then(function (response) {
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              commit('setsnackbarerror', true)
            })
          }
        })
      })
    },
    deleteVotings ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          axios.delete(state.endPointApi + '/postal/votings/' + filter.votingId).then(function (response) {
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            commit('setsnackbarerror', true)
          })
        })
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
          axios.get(state.endPointApi + '/serviceinfos/statistics/agencies', param).then(function (response) {
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
          axios.get(state.endPointApi + '/serviceinfos/statistics/domains', param).then(function (response) {
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
          axios.get(state.endPointApi + '/serviceinfos/mappingsuggest', param).then(function (response) {
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
    syncServiceinfoNew ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('serviceCodes', filter.serviceCodes)
          dataPost.append('type', filter.type)
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
    getChiTietDonVi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/serviceinfos/' + filter.serviceCode,
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
    },
    statisticURl ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {}
          if (filter.path === 'year'){
            config = {
              url: '/o/rest/v2/accessStatistics/url/' + filter.path,
              method: 'get',
              params: {
                day: filter.day,
                month: filter.month,
                year: filter.year 
              },
              headers: {groupId: state.initData.groupId},
            }
          } else {
            config = {
              url: '/o/rest/v2/accessStatistics/url/' + filter.path,
              method: 'get',
              params: {
                startDay: filter.startDay,
                endDay: filter.endDay, 
              },
              headers: {groupId: state.initData.groupId},
            }
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
    statisticThietBi ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {}
          if (filter.path === 'day'){
            config = {
              url: '/o/rest/v2/accessStatistics/' + filter.path,
              method: 'get',
              params: {
                day: filter.day,
                month: filter.month,
                year: filter.year 
              },
              headers: {groupId: state.initData.groupId},
            }
          } else {
            config = {
              url: '/o/rest/v2/accessStatistics/' + filter.path,
              method: 'get',
              params: {
                startDay: filter.startDay,
                endDay: filter.endDay, 
              },
              headers: {groupId: state.initData.groupId},
            }
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
    getCounters ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let config = {
            url: '/o/rest/v2/vr-app/certnumbers/counters',
            headers: {'groupId' : Liferay.ThemeDisplay.getScopeGroupId()},
            params: filter
        }
          axios.request(config).then(function (result) {
            resolve(result.data)
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    postCounters ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          dataPost.append('registerBookCode', filter.registerBookCode)
          dataPost.append('govAgencyCode', filter.govAgencyCode)
          dataPost.append('countNum', filter.countNum)
          axios.post('o/rest/v2/vr-app/certnumbers/counters', dataPost, param).then(function (result) {
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
    getServerconfigs ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/serverconfigs/' + filter, param).then(function (result) {
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
    getStatistics ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: filter
          }
          axios.get('/o/rest/statistics', param).then(function (result) {
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
    postSyncStatistics ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              "Content-Type": "application/json"
            }
          }
          axios.post('/o/rest/v2/nps/getsharingdata', filter).then(function (result) {
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
    getRevesionLog ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              groupId: state.initData.groupId
            },
            params: filter
          }
          axios.get('/o/rest/v2/dossierlogs/revesionLog', param).then(function (result) {
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
    putFileAttach ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }
          let dataPost = new FormData()
          dataPost.append('file', filter.file)
          dataPost.append('fileName', filter.fileName)
          dataPost.append('fileType', filter.fileType)
          dataPost.append('fileSize', filter.fileSize)
          axios.put('/o/rest/v2/fileattachs/versions/' + filter.fileEntryId, dataPost, param).then(function (result) {
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
    postDeliverabletypes ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }
          let dataPost = new FormData()
          dataPost.append('file', filter.file)
          axios.post('/o/rest/v2/deliverabletypes/'+ filter.deliverableTypeId +'/fileTemplateId', dataPost, param).then(function (result) {
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
    getFileattachsVersions ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/fileattachs/versions/'+  filter).then(function (result) {
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
    downLoadExcelRevesionLog ({state}, dataReq) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
        let params = new URLSearchParams()
        params.append('data', dataReq.data)
        axios.post(state.endPointApi + '/statistics/dossiers/export',
          params, options)
          .then(function (response) {
            console.log(response)
            var fileNames = response.headers['content-disposition']
            var fileName = fileNames.split('filename=')[1] || dataReq.fileName
            fileName = fileName.split('"').join('')
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            var url = window.URL.createObjectURL(response.data)
            a.href = url
            a.download = fileName
            a.click()
            window.URL.revokeObjectURL(url)
            resolve(response.data)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
      })
    },
  },
  mutations: {
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event)  {
      state.socket.isConnected = false
      state.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
      state.isConnected = true
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true
    },
    setlistTableMenu (state, payload) {
      let listTableMenu = state.listTableMenu
      listTableMenu[2].children = []
      for (let key in payload) {
        if (payload[key][4] && listTableMenu.length > 1) {
          listTableMenu[1].children.push({
            icon: 'arrow_right',
            link: '/table/' + payload[key][1],
            code: payload[key][1],
            text: payload[key][2]
          })
        } else if (!payload[key][4] && listTableMenu.length > 2) {
          listTableMenu[2].children.push({
            icon: 'arrow_right',
            link: '/table/' + payload[key][1],
            code: payload[key][1],
            text: payload[key][2]
          })
        }
      }
      state.listTableMenu = listTableMenu
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    setJobPosList (state, payload) {
      state.jobPosList = payload
    },
    setDossierStatusList (state, payload) {
      state.dossierStatusList = payload
    },
    setDossierSubStatusList (state, payload) {
      state.dossierSubStatusList = payload
    },
    setEmployeesList (state, payload) {
      state.employeesList = payload
    },
    setDossierTemplatesList (state, payload) {
      state.dossierTemplatesList = payload
    },
    setProcessStepList (state, payload) {
      state.processStepList = payload
    },
    setProcessActionList (state, payload) {
      state.processActionList = payload
    },
    setProcessRoleList (state, payload) {
      state.processRoleList = payload
    },
    setsnackbarerror (state, payload) {
      state.snackbarerror = payload
    },
    setsnackbarsocket (state, payload) {
      state.snackbarsocket = payload
    },
    setloginUser (state, payload) {
      if (payload) {
        let currentLogin = payload[0]
        if (currentLogin['role'] === 'Administrator') {
          console.log('admin login')
        } else if (currentLogin['role'] === 'Administrator_data') {
          state.listTableMenu.splice(3, 1)
        } else if (currentLogin['role'] === 'Administrator_data_user') {
          state.listTableMenu.splice(2, 1)
          state.listTableMenu.splice(2, 1)
        } else {
          state.listTableMenu.splice(2, 1)
          state.listTableMenu.splice(2, 1)
        }
        state.loginUser = payload
      }
    },
    setproblem (state, payload) {
      state.problem = payload
    },
    setisConnected (state, payload) {
      state.isConnected = payload
    }
  },
  getters: {
    getlistTableMenu (state) {
      return state.listTableMenu
    },
    getJobPosList (state) {
      return state.jobPosList
    },
    getDossierStatusList (state) {
      return state.dossierStatusList
    },
    getDossierSubStatusList (state) {
      return state.dossierSubStatusList
    },
    getEmployeesList (state) {
      return state.employeesList
    },
    getDossierTemplatesList (state) {
      return state.dossierTemplatesList
    },
    getProcessStepList (state) {
      return state.processStepList
    },
    getProcessActionList (state) {
      return state.processActionList
    },
    getProcessRoleList (state) {
      return state.processRoleList
    },
    getsnackbarerror (state) {
      return state.snackbarerror
    },
    getsnackbarsocket (state) {
      return state.snackbarsocket
    },
    getloginUser (state) {
      return state.loginUser[0]
    },
    getUserRoles (state) {
      return state.loginUser
    },
    getisConnected (state) {
      return state.isConnected
    },
    getproblem (state) {
      return state.problem
    }
  }
})
