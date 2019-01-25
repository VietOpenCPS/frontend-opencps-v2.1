import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
import AdminConfig from './AdminConfig'
var FileSaver = require('file-saver-fixed')
// 

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    groupId: window.themeDisplay !== undefined ? window.themeDisplay.getScopeGroupId() : 0,
    snackbarerror: false,
    snackbarsocket: false,
    refreshSocket: 0,
    initData: {},
    dataSocket: {},
    pullCounter: 0,
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
    endPointApi: '/o/rest/v2',
    // endPointApi: 'http://127.0.0.1:8081/api',
    getDeliverableTypes: [],
    getContentFile: '',
    getContentFileSimple: [],
    selected: ['dossierNo', 'delegateName', 'delegateAddress', 'delegateTelNo', 'receiveDate', 'dueDate'],
    reportType: 'REPORT_01',
    groupType: 'domain',
    siteName: '',
    itemsReports: [],
    reportConfigStatic: {}
  },
  actions: {
    loadInitResource ({commit, state}) {
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
        let param = {
          headers: {
            groupId: state.initData['groupId']
          }
        }
        axios.get('/o/v1/opencps/site/name', param).then(function (response) {
          let serializable = response.data
          state.siteName = serializable
          console.log(state.siteName)
          commit('setsiteName', serializable)
          resolve(state.initData)
        }).catch(function (error) {
          console.log(error)
        })
      })
    },
    updateDynamicReport ({ commit, state }, doData) {
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          }
        }
        let currentObject = {}
        for (let key in doData.itemsReports) {
          if (doData.itemsReports[key]['code'] === String(doData.index)) {
            currentObject['dynamicReportId'] = doData.itemsReports[key]['dynamicReportId']
            currentObject['userConfig'] = doData.itemsReports[key]['userConfig']
            break
          }
        }
        // putData
        let userConfigEdit = currentObject['userConfig']
        userConfigEdit[doData.userId] = doData.selected
        currentObject['userConfig'] = userConfigEdit

        let body = AdminConfig.updateDynamicReport.replace('INPUTBODY', JSON.stringify(currentObject).replace(/"/g, '\\"').replace(/'/g, '\\"'))
        axios.post('/o/v1/opencps/adminconfig', body, options).then(function (response) {
          console.log(response)
          resolve(response.data)
        }).catch(function (error) {
          commit('setsnackbarerror', true)
          reject(error)
        })
      })
    },
    doChotSoLieu ({ commit, state }, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'text/plain',
            'Accept': 'application/json'
          },
          params: {

          }
        }
        param['params'][filter['key']] = filter['value']
        for (let key in filter['data']) {
          let currentVal = filter['data'][key]
          if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
            let dateStr = new Date(currentVal).toLocaleDateString('vi-VN')
            if (dateStr !== 'Invalid Date' && String(currentVal).length === 13) {
              param.params[key] = dateStr
            } else {
              param.params[key] = currentVal
            }
          }
        }
        axios.get(filter['api'], param).then(function (response) {
          let serializable = response.data
          if (serializable.data) {
            let dataReturn = serializable.data
            resolve(dataReturn)
          } else {
            resolve(null)
          }
        }).catch(function (error) {
          console.log(error)
          reject(error)
        })
      })
    },
    getDynamicReports ({commit, state}, reportTypeFilter) {
      return new Promise((resolve, reject) => {
        let reportType = ''
        if (reportTypeFilter !== undefined && reportTypeFilter !== null) {
          reportType = reportTypeFilter
        }
        if (state.siteName !== '') {
          store.dispatch('loadInitResource').then(function () {
            let options = {
              headers: {
                'groupId': state.groupId,
                'Content-Type': 'text/plain',
                'Accept': 'application/json',
                'reportType': reportType
              }
            }
            let body = AdminConfig.getDynamicReports
            axios.post('/o/v1/opencps/adminconfig', body, options).then(function (response) {
              let serializable = response.data
              let itemsReportsData = []
              let indexKey = 0
              for (let key in serializable['getDynamicReports']) {
                let current = serializable['getDynamicReports'][key]
                let typeCurrent = 'dossier'
                if (current['reportCode'].startsWith('STATISTIC')) {
                  typeCurrent = 'thong_ke'
                }
                // push default current siteName
                let filterconfigObject = eval('( ' + current['filterConfig'] + ' )')
                if (filterconfigObject.hasOwnProperty('groupIds') && filterconfigObject.hasOwnProperty('exclusive') && filterconfigObject['exclusive']) {
                  let govCodes = filterconfigObject['groupIds']
                  let exit = false
                  for (let key in govCodes) {
                    if (String(state.groupId) === govCodes[key]['value']) {
                      exit = true
                      break;
                    }
                  }
                  if (!exit && ((filterconfigObject.hasOwnProperty('exclusive') && filterconfigObject['exclusive']) || !filterconfigObject.hasOwnProperty('exclusive'))) {
                    govCodes.push({
                      "value": parseInt(state.groupId),
                      "text": state.siteName
                    })
                  }
                  filterconfigObject['groupIds'] = govCodes
                }
                state.reportConfigStatic[indexKey] = eval('( ' + current['tableConfig'] + ' )')
                itemsReportsData.push({
                  'code' : String(indexKey),
                  'document' : current['reportCode'],
                  'active' : false,
                  'type' : typeCurrent,
                  'title' : current['reportName'],
                  'filterConfig' : filterconfigObject,
                  'tableConfig' : eval('( ' + current['tableConfig'] + ' )'),
                  'userConfig' : eval('( ' + current['userConfig'] + ' )'),
                  'dynamicReportId' : current['dynamicReportId'],
                  'reportCode' : current['reportCode'],
                  'reportName' : current['reportName'],
                  'sharing' : current['sharing']
                })
                indexKey = indexKey + 1
              }
              state.itemsReports = itemsReportsData
              console.log('state.itemsReports', state.itemsReports)
              resolve(itemsReportsData)
            }).catch(function (error) {
              state.itemsReports = []
              commit('setsnackbarerror', true)
              reject(error)
            })
          })
        } else {
          let options = {
            headers: {
              'groupId': state.groupId,
              'Content-Type': 'text/plain',
              'Accept': 'application/json',
              'reportType': reportType
            }
          }
          let body = AdminConfig.getDynamicReports
          axios.post('/o/v1/opencps/adminconfig', body, options).then(function (response) {
            let serializable = response.data
            let itemsReportsData = []
            let indexKey = 0
            for (let key in serializable['getDynamicReports']) {
              let current = serializable['getDynamicReports'][key]
              let typeCurrent = 'dossier'
              if (current['reportCode'].startsWith('STATISTIC')) {
                typeCurrent = 'thong_ke'
              }
              // push default current siteName
              let filterconfigObject = eval('( ' + current['filterConfig'] + ' )')
              if (filterconfigObject.hasOwnProperty('groupIds') && filterconfigObject.hasOwnProperty('exclusive') && filterconfigObject['exclusive']) {
                let govCodes = filterconfigObject['groupIds']
                let exit = false
                for (let key in govCodes) {
                  if (String(state.groupId) === govCodes[key]['value']) {
                    exit = true
                    break;
                  }
                }
                if (!exit && ((filterconfigObject.hasOwnProperty('exclusive') && filterconfigObject['exclusive']) || !filterconfigObject.hasOwnProperty('exclusive'))) {
                  govCodes.push({
                    "value": parseInt(state.groupId),
                    "text": state.siteName
                  })
                }
                filterconfigObject['groupIds'] = govCodes
              }
              state.reportConfigStatic[indexKey] = eval('( ' + current['tableConfig'] + ' )')
              itemsReportsData.push({
                'code' : String(indexKey),
                'document' : current['reportCode'],
                'active' : false,
                'type' : typeCurrent,
                'title' : current['reportName'],
                'filterConfig' : filterconfigObject,
                'tableConfig' : eval('( ' + current['tableConfig'] + ' )'),
                'userConfig' : eval('( ' + current['userConfig'] + ' )'),
                'dynamicReportId' : current['dynamicReportId'],
                'reportCode' : current['reportCode'],
                'reportName' : current['reportName'],
                'sharing' : current['sharing']
              })
              indexKey = indexKey + 1
            }
            state.itemsReports = itemsReportsData
            console.log('state.itemsReports', state.itemsReports)
            resolve(itemsReportsData)
          }).catch(function (error) {
            state.itemsReports = []
            commit('setsnackbarerror', true)
            reject(error)
          })
        }
      })
    },
    getAgencyReportLists ({state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            },
            params: {

            }
          }
          for (let key in filter['data']) {
            let currentVal = filter['data'][key]
            if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
              let dateStr = new Date(currentVal).toLocaleDateString('vi-VN')
              if (dateStr !== 'Invalid Date' && String(currentVal).length === 13) {
                param.params[key] = dateStr
              } else {
                param.params[key] = currentVal
              }
            }
          }
          let govAgency = filter['govAgency']
          let agencyLists = filter['agencyLists']
          let requestURL = ''
            // test local
            // requestURL = 'http://127.0.0.1:8081/api/statistics'
            requestURL = filter['api']
            if (agencyLists.length === 0) {
              axios.get(requestURL, param).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  //test
                  resolve(serializable.data)
                } else {
                  console.log('docu', filter.document === 'STATISTIC_05')
                  if (filter.document === 'STATISTIC_05') {
                    resolve([])
                  } else {
                    resolve(null)
                  }
                }
              }).catch(function (error) {
                console.log(error)
                reject(error)
              })
            } else if (String(govAgency) === '0' && agencyLists.length > 0) {
              let promises = []
              for (let key in agencyLists) {
                if (String(agencyLists[key]['value']) !== '0') {
                  param['headers']['groupId'] = agencyLists[key]['value']
                  promises.push(axios.get(requestURL, param))
                }
              }
              axios.all(promises)
              /*
              .then(function(results) {
                let temp = results.map(r => r.data)
                if (temp.length > 0) {
                  resolve({
                    type: 1,
                    data: temp
                  })
                } else {
                  resolve(null)
                }
              })
              */
              .then(axios.spread((...args) => {
                let myObject = []
                for (let i = 0; i < args.length; i++) {
                  if (args[i]['data']['total'] > 0) {
                    myObject = myObject.concat(args[i]['data']['data'])
                  }
                }
                if (myObject.length > 0) {
                  resolve(myObject)
                } else {
                  resolve(null)
                }
              }))
            } else if (String(govAgency) !== '0' && agencyLists.length > 0) {
              param['headers']['groupId'] = govAgency
              axios.get(requestURL, param).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  resolve(serializable.data)
                } else {
                  resolve(null)
                }
              }).catch(function (error) {
                console.log(error)
                reject(error)
              })
            }
          
        })
      })
    },
    doStatisticReportPrint ({state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          axios({
            method: 'PUT',
            url: '/o/rest/v2_1/statistics/report/' + filter.document,
            headers: {
              groupId: state.initData.groupId
            },
            responseType: 'blob',
            data: filter.data
          }).then(function (response) {
            let serializable = response.data
            if (filter['download']) {
              FileSaver.saveAs(serializable, new Date().getTime() + '.xls')
            } else {
              let file = window.URL.createObjectURL(serializable)
              resolve(file)
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    doExportXlsx ({state}, filter) {
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('files', filter['file'])
        window.$.support.cors = true;
        window.$.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://www.cleverpdf.com/pdf/uploadFiles',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            crossDomain: true,
            type: 'POST',
            success: function (data) {
              console.log(data)
              let formData2 = new FormData()
              formData2.append('url', data['url'])
              formData2.append('index', data['index'])
              formData2.append('pid', 1)
              formData2.append('oid', 3)
              formData2.append('status', 0)
              formData2.append('pwd', '')
              formData2.append('formatv1', 2)
              formData2.append('formatv2', 2)
              let fileName = data['fileName']
              setTimeout(() => {
                window.$.ajax({
                  url: 'https://cors-anywhere.herokuapp.com/https://www.cleverpdf.com/pdf/doProcess.do',
                  headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                  },
                  cache: false,
                  contentType: false,
                  processData: false,
                  data: formData2,
                  crossDomain: true,
                  type: 'POST',
                  success: function (data2) {
                    setTimeout(() => {
                      console.log(data2)
                      console.log('https://www.cleverpdf.com/' + data2['index'] + '/' + 'blob.xlsx')
                      window.open('https://www.cleverpdf.com/' + data2['index'] + '/' + 'blob.xlsx')
                    }, 1000)
                  }
                })
              }, 1000)
            }
        })
      })
    },
    doExportXlsxddd ({state}, filter) {
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('files', window.$('#filefile')[0].files[0])
        window.$.support.cors = true;
        window.$.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://www.cleverpdf.com/pdf/uploadFiles',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            crossDomain: true,
            type: 'POST',
            success: function (data) {
              console.log(data)
              let formData2 = new FormData()
              formData2.append('url', data['url'])
              formData2.append('index', data['index'])
              formData2.append('pid', 1)
              formData2.append('oid', 3)
              formData2.append('status', 0)
              formData2.append('pwd', '')
              formData2.append('formatv1', 2)
              formData2.append('formatv2', 2)
              let fileName = data['fileName']
              setTimeout(() => {
                window.$.ajax({
                  url: 'https://cors-anywhere.herokuapp.com/https://www.cleverpdf.com/pdf/doProcess.do',
                  headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                  },
                  cache: false,
                  contentType: false,
                  processData: false,
                  data: formData2,
                  crossDomain: true,
                  type: 'POST',
                  success: function (data2) {
                    setTimeout(() => {
                      console.log(data2)
                      console.log('https://www.cleverpdf.com/' + data2['index'] + '/' + 'blob.xlsx')
                      window.open('https://www.cleverpdf.com/' + data2['index'] + '/' + 'blob.xlsx')
                    }, 1000)
                  }
                })
              }, 1000)
            }
        })
      })
    },
    doExportXlsx2 ({state}, filter) {
      return new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('SuccessPage', ' /Success/{ID}')
        formData.append('OutputFormat', 'Word')
        formData.append('File', window.$('#filefile')[0].files[0])
        formData.append('ReconstructionMode', 'flowing')
        formData.append('DetectTables', true)
        formData.append('DetectLists', 'detect')
        formData.append('HeaderAndFooterMode', 'detect')
        formData.append('AnnotRecoveryType', 'comment')
        formData.append('DocFormat', 'Word')
        formData.append('AutoRotate', true)
        formData.append('TextRecoveryMode', 0)
        formData.append('NSEMode', 0)
        formData.append('ocrLanguage', 'au')
        formData.append('Password', '')
        formData.append('DynamicFile', window.$('#filefile')[0].files[0])
        window.$.support.cors = true;
        window.$.ajax({
            url: 'https://simplypdf.com/api/convert',
            dataType: 'jsonp',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            crossDomain: true,
            type: 'POST',
            success: function (data) {
              console.log(data)
            }
        })
      })
    }
  },
  mutations: {
    setInitData (state, payload) {
      state.initData = payload
    },
    setsnackbarerror (state, payload) {
      state.snackbarerror = payload
    },
    setsnackbarsocket (state, payload) {
      state.snackbarsocket = payload
    },
    setpullCounter (state, payload) {
      state.pullCounter = payload
    },
    setdataSocket (state, payload) {
      state.dataSocket = payload
    },
    setselected (state, payload) {
      state.selected = payload
    },
    setselectedText (state, payload) {
      state.selectedText = payload
    },
    setreportType (state, payload) {
      state.reportType = payload
    },
    setgroupType (state, payload) {
      state.groupType = payload
    },
    setsiteName (state, payload) {
      state.siteName = payload
    },
    setitemsReports (state, payload) {
      state.itemsReports = payload
    },
    setreportConfigStatic (state, payload) {
      state.reportConfigStatic = payload
    }
  },
  getters: {
    getsnackbarerror (state) {
      return state.snackbarerror
    },
    getsnackbarsocket (state) {
      return state.snackbarsocket
    },
    getDeliverableTypes (state) {
      return state.getDeliverableTypes
    },
    getContentFile (state) {
      return state.getContentFile
    },
    getContentFileSimple (state) {
      return state.getContentFileSimple
    },
    pullCounter (state) {
      return state.pullCounter
    },
    dataSocket (state) {
      return state.dataSocket
    },
    selected (state) {
      return state.selected
    },
    selectedText (state) {
      return state.selectedText
    },
    reportType (state) {
      return state.reportType
    },
    groupType (state) {
      return state.groupType
    },
    siteName (state) {
      return state.siteName
    },
    itemsReports (state) {
      return state.itemsReports
    },
    reportConfigStatic (state) {
      return state.reportConfigStatic
    }
  }
})
