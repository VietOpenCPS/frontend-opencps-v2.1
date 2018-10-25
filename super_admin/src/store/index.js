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
    listTableMenu: [
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Nghiệp vụ',
        model: true,
        children: [
          {
            icon: 'group_add',
            link: '/table/can_bo',
            code: 'can_bo',
            text: 'Cán bộ'
          },
          {
            icon: 'filter_1',
            link: '/table/thu_tuc_hanh_chinh',
            code: 'thu_tuc_hanh_chinh',
            text: 'Thủ tục hành chính'
          },
          {
            icon: 'filter_2',
            link: '/table/mau_ho_so',
            code: 'mau_ho_so',
            text: 'Mẫu hồ sơ'
          },
          {
            icon: 'filter_3',
            link: '/table/quy_trinh_thu_tuc',
            code: 'quy_trinh_thu_tuc',
            text: 'Quy trình thủ tục'
          },
          {
            icon: 'filter_4',
            link: '/table/dich_vu_cong',
            code: 'dich_vu_cong',
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
    getJobposList ({state}) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        // test local
        axios.get('http://127.0.0.1:8081/api/jobpos', param).then(function (response) {
        // axios.get('/o/rest/v2/jobpos', param).then(function (response) {
          let seriable = response.data
          if (seriable) {
            resolve(seriable.data)
          }
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    getDossierStatusList ({state}) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        // test local
        axios.get('http://127.0.0.1:8081/api/dictcollections/DOSSIER_STATUS/dictitems', param).then(function (response) {
        // axios.get('/o/rest/v2/dictcollections/DOSSIER_STATUS/dictitems', param).then(function (response) {
          let seriable = response.data
          if (seriable) {
            resolve(seriable.data)
          }
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    getDossierSubStatusList ({state}, dossierStatus) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        // test local
        axios.get('http://127.0.0.1:8081/api/dictcollections/DOSSIER_STATUS/dictitems?parent=' + dossierStatus, param).then(function (response) {
        // axios.get('/o/rest/v2/dictcollections/DOSSIER_STATUS/dictitems?parent=' + dossierStatus, param).then(function (response) {
          let seriable = response.data
          if (seriable) {
            resolve(seriable.data)
          }
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    getProcessDetail ({state}, id) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        // test local
        axios.get('http://127.0.0.1:8081/api/serviceprocesses/' + id, param).then(function (response) {
        // axios.get('/o/rest/v2/serviceprocesses/' + id, param).then(function (response) {
          let seriable = response.data
          if (seriable) {
            resolve(seriable)
          }
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    postProcess ({ state }, data) {
      return new Promise((resolve, reject) => {
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
          // test local
          axios.post('http://127.0.0.1:8081/api/serviceprocesses', dataPostProcess, options).then(function (response) {
          // axios.post('/o/rest/v2/serviceprocesses', dataPostProcess, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        } else {
          // test local
          axios.put('http://127.0.0.1:8081/api/serviceprocesses/' + data.serviceProcessId, dataPostProcess, options).then(function (response) {
          // axios.put('/o/rest/v2/serviceprocesses', dataPostProcess, options).then(function (response) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            resolve(response.data)
          }).catch(function (error) {
            reject(error)
            // toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        }
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
