import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    tocken: '',
    user: null,
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false
    },
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
            icon: 'import_export',
            link: '/table/import/tool_import',
            code: 'import',
            text: 'Import'
          }
        ]
      },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Dữ liệu dùng chung',
        model: false,
        children: [
          {
            icon: 'arrow_right',
            link: '/table/opencps_dictcollection',
            code: 'opencps_dictcollection',
            text: 'Nhóm danh mục'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_dictgroup',
            code: 'opencps_dictgroup',
            text: 'Nhóm dữ liệu danh mục'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_dictitem',
            code: 'opencps_dictitem',
            text: 'Dữ liệu danh mục'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_holiday',
            code: 'opencps_holiday',
            text: 'Ngày nghỉ lễ'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_worktime',
            code: 'opencps_worktime',
            text: 'Ngày làm việc trong tuần'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_notificationtemplate',
            code: 'opencps_notificationtemplate',
            text: 'Mẫu thông báo'
          },
          {
            icon: 'arrow_right',
            link: '/table/opencps_workingunit',
            code: 'opencps_workingunit',
            text: 'Tổ chức, phòng ban'
          }
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
    processRoleList: []
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
    getServiceFileTemplate ({state}, pk) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        // test local
        // axios.get('http://127.0.0.1:8081/api/employees', param).then(function (response) {
        axios.get('http://localhost:8080/o/gate/v2/filetemplate/' + pk, param).then(function (response) {
          let seriable = response.data
          if (seriable.data) {
            resolve(seriable)
          }
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    getJobposList ({state}) {
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
          })
        })
      })
    },
    getDossierStatusList ({state}) {
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
          })
        })
      })
    },
    getDossierSubStatusList ({state}, dossierStatus) {
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
    getEmployee ({state}) {
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
          })
        })
      })
    },
    getDossierPart ({state}, template) {
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
          })
        })
      })
    },
    getProcessDetail ({state}, id) {
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
          })
        })
      })
    },
    getProcessStepsDetail ({state}, filter) {
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
          })
        })
      })
    },
    getProcessStep ({state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 15 - 15,
              end: filter.page * 15
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/steps', param).then(function (response) {
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
    getProcessAction ({state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              start: filter.page * 15 - 15,
              end: filter.page * 15
            }
          }
          axios.get(state.endPointApi + '/serviceprocesses/' + filter.processId + '/actions', param).then(function (response) {
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
    getProcessRole ({state}, filter) {
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
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    getProcessActionsDetail ({state}, filter) {
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
          })
        })
      })
    },
    deleteProcessAction ({state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.delete(state.endPointApi + '/serviceprocesses/' + filter.currentProcess + '/actions/' + filter.actionCode, param).then(function (response) {
            let seriable = response.data
            if (seriable) {
              resolve(seriable)
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    postProcess ({ state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcess = new URLSearchParams()
          dataPostProcess.append('processNo', data.processNo)
          dataPostProcess.append('processName', data.processName)
          dataPostProcess.append('description', data.description)
          dataPostProcess.append('durationCount', data.durationCount)
          dataPostProcess.append('durationUnit', data.durationUnit)
          dataPostProcess.append('generateDossierNo', data.generateDossierNo)
          dataPostProcess.append('dossierNoPattern', data.dossierNoPattern)
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
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
      })
    },
    postProcessRoles ({ state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcessRoles = new URLSearchParams()
          dataPostProcessRoles.append('roleId', data.processRoles.roleId)
          dataPostProcessRoles.append('moderator', data.processRoles.moderator)
          dataPostProcessRoles.append('condition', data.processRoles.condition)
          axios.post(state.endPointApi + '/serviceprocesses/' + data.processId + '/roles', dataPostProcessRoles, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    putProcessRoles ({ state }, data) {
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
          dataPostProcessRoles.append('condition', data.processRoles.condition)
          axios.put(state.endPointApi + '/serviceprocesses/' + data.processId + '/roles/' + data.processRoles.roleId, dataPostProcessRoles, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    deleteProcessRoles ({ state }, data) {
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
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    postProcessStep ({ state }, data) {
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
          dataPostStep.append('dossierStatus', data.dossierStatus)
          dataPostStep.append('dossierSubStatus', data.dossierSubStatus)
          dataPostStep.append('durationCount', data.durationCount)
          dataPostStep.append('customProcessUrl', data.customProcessUrl)
          dataPostStep.append('briefNote', data.briefNote)
          dataPostStep.append('stepInstruction', data.stepInstruction)
          dataPostStep.append('lockState', data.lockState)
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
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
      })
    },
    deleteProcessStep ({state}, filter) {
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
          })
        })
      })
    },
    getStepRole ({state}, filter) {
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
            }
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    postStepRoles ({ state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostProcessRoles = new URLSearchParams()
          dataPostProcessRoles.append('roleId', data.stepRoles.roleId)
          dataPostProcessRoles.append('moderator', data.stepRoles.moderator)
          dataPostProcessRoles.append('condition', data.stepRoles.condition)
          axios.post(state.endPointApi + '/serviceprocesses/' + data.processId + '/steps/' + data.stepId + '/roles', dataPostProcessRoles, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    deleteStepRoles ({ state }, data) {
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
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      })
    },
    postProcessAction ({ state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Accept': 'application/json'
            }
          }
          var dataPostAction = new URLSearchParams()
          dataPostAction.append('actionCode', data.actionCode)
          dataPostAction.append('actionName', data.actionName)
          dataPostAction.append('preStepCode', data.preStepCode)
          dataPostAction.append('postStepCode', data.postStepCode)
          dataPostAction.append('autoEvent', data.autoEvent)
          dataPostAction.append('preCondition', data.preCondition)
          dataPostAction.append('allowAssignUser', data.allowAssignUser)
          dataPostAction.append('assignUserId', data.assignUserId)
          dataPostAction.append('requestPayment', data.requestPayment)
          dataPostAction.append('paymentFee', data.paymentFee)
          dataPostAction.append('syncActionCode', data.syncActionCode)
          dataPostAction.append('rollbackable', data.rollbackable)
          dataPostAction.append('createDossierNo', data.createDossierNo)
          dataPostAction.append('eSignature', data.eSignature)
          dataPostAction.append('configNote', data.configNote)
          dataPostAction.append('dossiertemplatesFileFilter', data.dossierTemplateNo)
          dataPostAction.append('createDossiers', data.createDossiers)
          if (data.type === 'add') {
            axios.post(state.endPointApi + '/serviceprocesses/' + data.currentProcess + '/actions', dataPostAction, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          } else {
            axios.put(state.endPointApi + '/serviceprocesses/' + data.currentProcess + '/actions/' + data.actionCode, dataPostAction, options).then(function (response) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              resolve(response.data)
            }).catch(function (error) {
              reject(error)
              // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
      })
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      console.debug(event)
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
      console.error(state, event)
    },
    SOCKET_ONMESSAGE (state, message) {
      state.message = message
    },
    [WebSocket.WS_RECONNECT](state, count) {
      console.debug(state)
      console.debug(count)
    },
    [WebSocket.WS_RECONNECT_ERROR](state) {
      state.socket.reconnectError = true
    },
    setlistTableMenu (state, payload) {
      state.listTableMenu = payload
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
    }
  }
})
