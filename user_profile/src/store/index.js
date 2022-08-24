import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import saveAs from 'file-saver'
// 

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    initData: {},
    snackbarerror: false,
    snackbarsocket: false,
    profileCitizenDefault: {
      SoDienThoaiBan: '',
      LoaiThe: '',
      GioiTinh: '',
      DanToc: '',
      TonGiao: '',
      DanToc: '',
      TinhTrangHonNhan: '',
      NhomMau: '',
      NgayThangNamSinh: '',
      NoiDangKyKhaiSinhAddress: '',
      NoiDangKyKhaiSinhCityCode: '',
      NoiDangKyKhaiSinhCityName: '',
      NoiDangKyKhaiSinhDistrictCode: '',
      NoiDangKyKhaiSinhDistrictName: '',
      NoiDangKyKhaiSinhWardCode: '',
      NoiDangKyKhaiSinhWardName: '',
      QueQuan: '',
      ThuongTru: '',
      NoiOHienTaiAddress: '',
      NoiOHienTaiCityCode: '',
      NoiOHienTaiCityName: '',
      NoiOHienTaiDistrictCode: '',
      NoiOHienTaiDistrictName: '',
      NoiOHienTaiWardCode: '',
      NoiOHienTaiWardName: '',
      QuocTich: '',
      Cha: '',
      Me: '',
      VoChong: '',
      NguoiDaiDien: '',
      ChuHo: '',
      TrangThai: ''
    },
    profileBussinessDefault : {
      Short_Name: '',
      Name_F: '',
      HOAddress: '',
      Phone: '',
      Fax: '',
      Website: '',
      Founding_Date: '',
      Legal_Name: '',
      Enterprise_type_id: '',
      Enterprise_Status: '',
      Enterprise_Id: '',
      Enterprise_Code: '',
      Enterprise_Gdt_Code: '',
      Site_Id: '',
      Subunit_Paren_Ent_Id: ''
    }
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
    getUserInfo ({commit, state}) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let userId = 0
          if (window.themeDisplay !== undefined && window.themeDisplay !== null) {
            userId = window.themeDisplay.getUserId()
          }
          axios.get('/o/v1/opencps/users/' + userId, param).then(function (response) {
            let seriable = response.data
            if (seriable['applicantProfile']) {
              try {
                let x = JSON.parse(seriable.applicantProfile)
                if (seriable['applicantType'] === 'citizen') {
                  seriable.applicantProfile = Object.assign({}, state.profileCitizenDefault, x)
                } else {
                  seriable.applicantProfile = Object.assign({}, state.profileBussinessDefault, x)
                }
              } catch (error) {
                seriable['applicantProfile'] = seriable['applicantType'] === 'citizen' ? state.profileCitizenDefault : state.profileBussinessDefault
              }
              
            } else {
              seriable['applicantProfile'] = seriable['applicantType'] === 'citizen' ? state.profileCitizenDefault : state.profileBussinessDefault
            }
            resolve(seriable)
          }).catch(function (xhr) {
            reject(xhr)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    getEmployeeInfoKeycloak ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let config = {
          method: 'post',
          url: '/o/rest/v2/qldc/lgsp',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(filter.data),
          params: {}
        }
        axios(config).then(function (response) {
          let serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    getApplicantInfo ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          axios.get('/o/rest/v2/applicants/applicantIdNo/' + filter.applicantIdNo, param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    loadDictItems ({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId
            },
            params: {
              parent: data.parent
            }
          }
          // test local
          // axios.get('http://127.0.0.1:8081/api/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
          axios.get('/o/rest/v2/dictcollections/' + data.collectionCode + '/dictitems', param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }, error => {
            reject(error)
            commit('setsnackbarerror', true)
          })
        })
      })
    },
    changePass ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let userId = 0
        if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
          userId = window.themeDisplay.getUserId()
        }
        var url = '/o/rest/v2/users/' + userId + '/changepass/application'
        var dataPutUser = new URLSearchParams()
        dataPutUser.append('oldPassword', filter.oldPassword)
        dataPutUser.append('newPassword', filter.newPassword)
        if (filter.hasOwnProperty('type')) {
          dataPutUser.append('type', filter.type)
        }
        axios.post(url, dataPutUser, param).then(result1 => {
          resolve(result1.data)
        }).catch(xhr => {
          reject(xhr)
          commit('setsnackbarerror', true)
        })
      })
    },
    changePassKeycloak ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let settings = {
          "url": "https://apigateway.haugiang.gov.vn/v1/datasharing/account/changepwd",
          "method": "POST",
          "headers": {
            "secret": "1hZ64frE9A6088oIgUUgPYJ6zp7+HXat",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + filter.token
          },
          "data": JSON.stringify({
            "matKhauHienTai": filter.oldPassword,
            "matKhauMoi": filter.newPassword,
            "tenDangNhap": filter.tenDangNhap
          }),
        };
        
        $.ajax(settings).done(function (response) {
          resolve(response);
        }).fail(function () {
          reject("")
        })

      })
    },
    getCodeVerify ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let settings = {
          "url": "https://apigateway.haugiang.gov.vn/base/auth/random",
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "tenDinhDanh": filter.tenDinhDanh
          }),
        };
        
        $.ajax(settings).done(function (response) {
          try {
            let data = response.resp.doiTuongXacThuc
            resolve(data);
          } catch (error) {
            reject("")
          }
        }).fail(function () {
          reject("")
        })

      })
    },
    resetPassWordKeycloak ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let settings = {
          "url": "https://apigateway.haugiang.gov.vn/base/auth/resetpwd/code",
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify({
            "tenDinhDanh": filter.tenDinhDanh,
            "maXacThuc": filter.maXacThuc
          })
        };
        
        $.ajax(settings).done(function (response) {
          resolve(response);
        }).fail(function () {
          reject("")
        })

      })
    },
    putUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId
          }
        }
        var dataPutUser = new URLSearchParams()
        var url = ''
        if (filter['className'] === 'org.opencps.usermgt.model.Employee') {
          url = '/o/rest/v2/employees/' + filter['classPK']
          dataPutUser.append('fullName', filter.employeeFullName ? filter.employeeFullName : '')
          dataPutUser.append('telNo', filter.employeeTelNo ? filter.employeeTelNo : '')
          dataPutUser.append('employeeNo', filter.employeeNo ? filter.employeeNo : '')
          dataPutUser.append('title', filter.title ? filter.title : '')
          let date = ''
          if (filter['employeeBirthDate']) {
            let [dayInput, monthInput, yearInput] = filter['employeeBirthDate'].split('/')
            let newDate = `${yearInput}-${monthInput.padStart(2, '0')}-${dayInput.padStart(2, '0')}`
            date = new Date(newDate).getTime()
          }
          dataPutUser.append('birthdate', filter['employeeBirthDate'] ? filter['employeeBirthDate'] : '')
        } else if (filter['className'] === 'org.opencps.usermgt.model.Applicant') {
          url = '/o/rest/v2/applicants/' + filter['classPK']
          dataPutUser.append('applicantName', filter['applicantName'])
          dataPutUser.append('contactTelNo', filter['applicantContactTelNo'])
          dataPutUser.append('address', filter['applicantAddress'])
          dataPutUser.append('contactEmail', filter['applicantContactEmail'])
          dataPutUser.append('cityCode', filter['applicantCityCode'])
          dataPutUser.append('districtCode', filter['applicantDistrictCode'])
          dataPutUser.append('wardCode', filter['applicantWardCode'])
          dataPutUser.append('applicantIdNo', filter['applicantIdNo'])
          dataPutUser.append('applicantIdDate', filter['applicantIdDate'])
          if (filter['applicantProfile']) {
            dataPutUser.append('profile', JSON.stringify(filter['applicantProfile']))
          }
        }
        axios.put(url, dataPutUser, param).then(result1 => {
          resolve(result1)
        }).catch(xhr => {
          reject(xhr)
          commit('setsnackbarerror', true)
        })
      })
    },
    updateindentifies ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: state.initData.groupId,
            'Content-Type': 'multipart/form-data'
          }
        }
        var dataPutUser = new FormData()
        var url = '/o/rest/v2/applicants/updateindentifies'
        dataPutUser.append('indentifyNoFile', filter.indentifyNoFile)
        dataPutUser.append('applicantId', filter.applicantId)
        axios.post(url, dataPutUser, param).then(result1 => {
          resolve(result1.data)
        }).catch(xhr => {
          reject(xhr)
          commit('setsnackbarerror', true)
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
    getDossierFilesApplicants ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {
            start: filter.page*15 - 15,
            end: filter.page*15
          }
        }
        axios.get('/o/rest/v2/dossiers/applicant/' + filter.applicantIdNo + '/fileDone/search', param).then(function (response) {
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
    viewFile ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          responseType: 'blob'
        }
        axios.get('/o/rest/v2/dossiers/' + data.dossierId + '/files/' + data.referenceUid, param).then(function (response) {
          var url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(function (xhr) {
          console.log(xhr)
        })
      })
    },
    downloadFile ({commit, state}, data) {
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        },
        responseType: 'blob'
      }
      axios.get('/o/rest/v2/dossiers/' + data.dossierId + '/files/' + data.referenceUid, param).then(function (response) {
        let fileName = decodeURI(response.headers['content-disposition'].match(/filename="(.*)"/)[1])
        let serializable = response.data
        saveAs(serializable, fileName)
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    deleteFileApplicant ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.delete('/o/rest/v2/dossiers/fileDone/' + data.dossierFileId, param).then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    getServerConfig ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          let url = '/o/rest/v2/serverconfigs/' + filter.serverNo
          axios.get(url, param).then(function (response) {
            let serializable = response.data
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    getServerConfigAll ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          let url = '/o/rest/v2/serverconfigs'
          axios.get(url, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getUserTichHop ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            }
          }
          let url = filter.url
          axios.get(url, param).then(function (response) {
            let serializable = response.data
            resolve(serializable.data)
          }).catch(function (error) {
            reject([])
          })
        })
      })
    },
    getVNConect ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            params: {
              state: filter.state,
              redirectURL: filter.redirectURL
            }
          }
          axios.get('/o/rest/v2/dvcqgsso/authurl', param).then(function (response) {
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
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            params: {}
          }
          let data = filter.dataMapping
          axios.post('/o/rest/v2/dvcqgsso/auth', data, param).then(function (response) {
            resolve(response)
          }).catch(function (error) {
            reject(error)
          })
        })
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
              end: filter.end ? filter.end : 15,
              applicantIdNo: filter.applicantIdNo ? filter.applicantIdNo : '',
              fileTemplateNo: filter.fileTemplateNo ? filter.fileTemplateNo : '',
              status: filter.status,
              keyword: filter.keywordSearch ? filter.keywordSearch : '',
              applicantDataType: filter.applicantDataType ? filter.applicantDataType : '',
              fileNo: filter.fileNoSearch
            }
          }
          axios.get('/o/rest/v2/applicantdatas', param).then(function (response) {
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
              reject(error)
            }
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getFileItems ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: window.themeDisplay.getScopeGroupId()
            }
          }
          let params = {
            status: filter.status ? filter.status : ''
          }
          let dataPost = new URLSearchParams()
          let textPost = params
          dataPost.append('method', 'GET')
          dataPost.append('url', '/fileitems')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_MOTCUA')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            resolve(response.data)
          }, error => {
            reject(error)
          })
        }).catch(function (){})
      })
    },
    getFileAttachProxy ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          responseType: 'blob'
        }
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('url', '/applicantdatas/' + filter.applicantDataId + '/preview')
        dataPost.append('dataType', 'binary')
        dataPost.append('data', '')
        dataPost.append('serverCode', 'SERVER_MOTCUA')        
        axios.post('/o/rest/v2/proxy', dataPost, param).then(response => {
          let url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    getFileAttach ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          responseType: 'blob'
        }
        axios.get('/o/rest/v2/applicantdatas/' + filter.applicantDataId + '/preview', param).then(response => {
          let url = window.URL.createObjectURL(response.data)
          resolve(url)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    }
  },
  mutations: {
    setsnackbarerror (state, payload) {
      state.snackbarerror = payload
    }
  },
  getters: {
  }
})
