import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
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
            link: '/table/quy_trinh_thu_tuc',
            code: 'quy_trinh_thu_tuc',
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
    ]
  },
  actions: {
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
    }
  },
  getters: {
    getlistTableMenu (state) {
      return state.listTableMenu
    }
  }
})
