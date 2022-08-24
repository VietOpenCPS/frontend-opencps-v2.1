import Vue from 'vue'
import toastr from 'toastr'
import Vuex from 'vuex'
import axios from 'axios'
// 
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    endPoint: '/o/rest/v2',
    loading: false,
    isMobile: false,
    userLogin: '',
    submissionNote: '',
    thongTinChiTietHoSo: null
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
    getApplicantDocument ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            },
            params: {
              start: filter.start ? filter.start : 0,
              end: filter.end ? filter.end : 30,
              sort: 'createDate',
              order: 'desc',
              maHoSo: filter.maHoSo ? filter.maHoSo : '',
              soHieuVanBan: filter.soHieuVanBan ? filter.soHieuVanBan : '',
              tenGiayTo: filter.tenGiayTo ? filter.tenGiayTo : '',
              maThuTuc: filter.maThuTuc ? filter.maThuTuc : '',
              keyword: filter.keyword ? filter.keyword : '',
              isKyso: filter.isKyso,
              govAgencyCode: filter.donViCap,
              namKyVanBan: filter.nam
            }
          }
          axios.get('/o/rest/v2/applicantdatas/listExcelData', param).then(function (response) {
            if (response['data'].hasOwnProperty('data')) {
              if (Array.isArray(response['data']['data'])) {
                resolve(response.data)
              } else {
                resolve(
                  {
                    data: [response['data']['data']],
                    total: response['data']['total']
                  }
                )
              }
            } else {
              reject(response)
            }
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    updateFileKySoVgca ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.groupIdSite ? state.groupIdSite : window.themeDisplay.getScopeGroupId(),
            Token: window.Liferay ? window.Liferay.authToken : ''
          }
        }
        let dataPost = new URLSearchParams()
        dataPost.append('fileEntryExcelDataMapping', filter.fileEntryExcelDataMapping)
        let url = '/o/rest/v2/defaultsignature/vgca/sohoa/updateFile'
        axios.put(url, dataPost, param).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    uploadFileKySo ({commit, state}, file) {
      return new Promise((resolve, reject) => {
        let config = {
          headers: {
            'groupId': state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }
        console.log('fileInput', file)
        let fileName = file['name']
        let dataPost = new FormData()
        dataPost.append('uploadfile', file, fileName)
        axios.post('/o/rest/v2/vgca/fileupload', dataPost, config).then(function (result) {
          let data = Object.assign(result.data, {"fileNameInput": file['name']})
          resolve(data)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setSubmissionNote(state, payload){
      state.submissionNote = payload
    },
    setThongTinChiTietHoSo(state, payload){
      state.thongTinChiTietHoSo = payload
    },
  },
  getters: {
    loading (state) {
      return state.loading
    }
  }
})
