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
            let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
            if (dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) {
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
        let sortReport = function (reportList) {
          function compare(a, b) {
            if (a.order < b.order)
              return -1
            if (a.order > b.order)
              return 1
            return 0
          }
          return reportList.sort(compare)
        }
        let reportType = ''
        if (reportTypeFilter !== undefined && reportTypeFilter !== null) {
          reportType = reportTypeFilter
        }
        if (state.siteName !== '') {
          console.log("state.siteName123", state.siteName)
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
              // 
              let reportList = serializable['getDynamicReports']
              let counterReport = reportList.length
              for (let key in reportList) {
                let orderMenu = counterReport
                try {
                  let stt = eval('( ' + reportList[key]['userConfig'] + ' )')['order']
                  orderMenu = stt ? stt : counterReport
                } catch (error) {
                }
                reportList[key]['order'] = orderMenu
              }
              reportList = sortReport(reportList)
              // 

              let itemsReportsData = []
              let indexKey = 0
              let dynamicReportsFilterSharing = reportList.filter(function (item) {
                return String(item.sharing) !== '9'
              })
              try {
                // TH chỉ lấy các mẫu theo cấu hình từng site
                if (reportTypeScope) {
                  dynamicReportsFilterSharing = dynamicReportsFilterSharing.filter(function (item) {
                    return item.userConfig && JSON.parse(item.userConfig).hasOwnProperty('reportTypeScope') && JSON.parse(item.userConfig)['reportTypeScope'] === reportTypeScope
                  })
                }
              } catch (error) {
              }
              for (let key in dynamicReportsFilterSharing) {
                let current = dynamicReportsFilterSharing[key]
                // console.log('keyDynamicReports', current['filterConfig'])
                try {
                  let checkfilterConfig = eval('( ' + current['filterConfig'] + ' )')
                } catch (error) {
                  alert("Lỗi cấu hình filterConfig mẫu: " + current['reportName'])
                }
                try {
                  let checktableConfig = eval('( ' + current['tableConfig'] + ' )')
                } catch (error) {
                  alert("Lỗi cấu hình tableConfig mẫu: " + current['reportName'])
                }
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
                  'sharing' : current['sharing'],
                  'order': current['order']
                })
                indexKey = indexKey + 1
              }
              itemsReportsData = itemsReportsData.filter(function (item) {
                return String(item.sharing) !== '9'
              })
              try {
                // TH chỉ lấy các mẫu theo cấu hình từng site
                if (reportTypeScope) {
                  console.log('reportTypeScope123', itemsReportsData)
                  itemsReportsData = itemsReportsData.filter(function (item) {
                    return item.userConfig && item.userConfig.hasOwnProperty('reportTypeScope') && item.userConfig['reportTypeScope'] === reportTypeScope
                  })
                }
              } catch (error) {
              }
              state.itemsReports = itemsReportsData
              resolve(itemsReportsData)
            }).catch(function (error) {
              state.itemsReports = []
              commit('setsnackbarerror', true)
              reject(error)
            })
          })
        } else {
          console.log("state.siteName456", state.siteName)
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
            // 
            let reportList = serializable['getDynamicReports']
            let counterReport = reportList.length
            for (let key in reportList) {
              let orderMenu = counterReport
              try {
                let stt = eval('( ' + reportList[key]['userConfig'] + ' )')['order']
                orderMenu = stt ? stt : counterReport
              } catch (error) {
              }
              reportList[key]['order'] = orderMenu
            }
            reportList = sortReport(reportList)
            // 
            let itemsReportsData = []
            let indexKey = 0
            let dynamicReportsFilterSharing = reportList.filter(function (item) {
              return String(item.sharing) !== '9'
            })
            try {
              // TH chỉ lấy các mẫu theo cấu hình từng site
              if (reportTypeScope) {
                dynamicReportsFilterSharing = dynamicReportsFilterSharing.filter(function (item) {
                  return item.userConfig && JSON.parse(item.userConfig).hasOwnProperty('reportTypeScope') && JSON.parse(item.userConfig)['reportTypeScope'] === reportTypeScope
                })
              }
            } catch (error) {
            }
            for (let key in dynamicReportsFilterSharing) {
              let current = dynamicReportsFilterSharing[key]
              try {
                let checkfilterConfig = eval('( ' + current['filterConfig'] + ' )')
              } catch (error) {
                alert("Lỗi cấu hình filterConfig mẫu: " + current['reportName'])
              }
              try {
                let checktableConfig = eval('( ' + current['tableConfig'] + ' )')
              } catch (error) {
                alert("Lỗi cấu hình tableConfig mẫu: " + current['reportName'])
              }
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
                'sharing' : current['sharing'],
                'order': current['order']
              })
              indexKey = indexKey + 1
            }
            itemsReportsData = itemsReportsData.filter(function (item) {
              return String(item.sharing) !== '9'
            })
            try {
              // TH chỉ lấy các mẫu theo cấu hình từng site
              if (reportTypeScope) {
                itemsReportsData = itemsReportsData.filter(function (item) {
                  return item.userConfig && item.userConfig.hasOwnProperty('reportTypeScope') && item.userConfig['reportTypeScope'] === reportTypeScope
                })
              }
            } catch (error) {
            }
            state.itemsReports = itemsReportsData
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
          console.log('filter00000000', filter)
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            },
            params: {
            }
          }
          for (let key in filter['data']) {
            let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
            if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
              let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
              if (dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) {
                param.params[key] = dateStr
              } else {
                if (String(key).indexOf('DateExtend') > 0) {
                  let keySearch = String(key).replace('Extend', '')
                  let dateCurrent = new Date()
                  dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                  param.params['from' + keySearch] = filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp' ? dateCurrent.getTime() : new Date(dateCurrent).toLocaleDateString('vi-VN')
                  param.params['to' + keySearch] = filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp' ? dateCurrent.getTime() : new Date(dateCurrent).toLocaleDateString('vi-VN')
                } else {
                  let [day, month, year] = currentVal.split('/')
                  if (day && month && year && filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp') {
                    let timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)).getTime()
                    if (key === 'toDate') {
                      timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59`)).getTime()
                    }
                    param.params[key] = timeStampDate
                  } else {
                    param.params[key] = currentVal
                  }                  
                }
              }
            }
          }
          let govAgency = filter['govAgency']
          let agencyLists = filter['agencyLists'] ? filter['agencyLists'] : []
          let agencyListsGet = agencyLists.filter(function (item) {
            return String(item['value']) !== '0'
          })
          let requestURL = ''
            // test local
            // requestURL = 'http://127.0.0.1:8081/api/statistic/todolist'
            requestURL = filter['api']
            if (agencyLists.length === 0) {
              axios.post(requestURL, {}, param).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  if (Array.isArray(serializable.data)) {
                    let dataOut = serializable.data
                    if (dataOut.length > 0 && Object.keys(dataOut[0]).length > 0) {
                      resolve(dataOut)
                    } else {
                      resolve(null)
                    }
                    
                  } else {
                    resolve([serializable.data])
                  }
                } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                  resolve(serializable)
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
              for (let key in agencyListsGet) {
                if (String(agencyListsGet[key]['value']) !== '0') {
                  let paramCopy = Object.assign({}, param)
                  paramCopy['headers']['groupId'] = agencyListsGet[key]['value']
                  paramCopy['params']['v'] = Math.random() + key
                  
                  promises.push(axios.post(requestURL, {}, {
                    headers: {
                      groupId: agencyListsGet[key]['value'],
                      Accept: 'application/json'
                    },
                    params: {
                      v: Math.random(),
                      ...param.params
                    }
                  }))
                }
              }
              axios.all(promises)
              .then(axios.spread((...args) => {
                let myObject = []
                for (let i = 0; i < args.length; i++) {
                  let dataOutput = args[i]['data'].hasOwnProperty('total') ? args[i]['data']['data'] : args[i]['data']
                  if (args[i]['data']['total'] > 0 || (!args[i]['data'].hasOwnProperty('total') && dataOutput)) {
                    myObject = myObject.concat(dataOutput)
                  } else {
                    let itemNoData = [
                      {
                        govAgencyCode: agencyListsGet[i]['value'],
                        govAgencyName: agencyListsGet[i]['text']
                      }
                    ]
                    myObject = myObject.concat(itemNoData)
                  }
                }
                if (myObject.length > 0) {
                  resolve(myObject)
                } else {
                  resolve(null)
                }
              }))
            } else if (String(govAgency) !== '0' && String(govAgency) !== '' && agencyLists.length > 0) {
              if (String(govAgency) === 'all') {
                param['headers']['groupId'] = 0
              } else {
                param['headers']['groupId'] = govAgency && !isNaN(Number(govAgency)) ? govAgency : window.themeDisplay.getScopeGroupId()
              }
              param['params']['v'] = Math.random()
              axios.post(requestURL, {}, param).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  if (Array.isArray(serializable.data)) {
                    let dataOut = serializable.data
                    if (dataOut.length > 0 && Object.keys(dataOut[0]).length > 0) {
                      resolve(dataOut)
                    } else {
                      resolve(null)
                    }
                    
                  } else {
                    resolve([serializable.data])
                  }
                } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                  resolve(serializable)
                } else {
                  resolve(null)
                }
              }).catch(function (error) {
                console.log(error)
                reject(error)
              })
            } else if (String(govAgency) === '' && agencyLists.length > 0) {
              let getAllUrlParams = function(arr) {
                let obj = {}
                for (var i = 0; i < arr.length; i++) {
                  let a = arr[i].split('=')
                  let paramName = a[0]
                  let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
                  paramName = paramName.toLowerCase()
                  if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
                  if (paramName.match(/\[(\d+)?\]$/)) {
                    var key = paramName.replace(/\[(\d+)?\]/, '')
                    if (!obj[key]) obj[key] = []
                    if (paramName.match(/\[\d+\]$/)) {
                      var index = /\[(\d+)\]/.exec(paramName)[1]
                      obj[key][index] = paramValue
                    } else {
                      obj[key].push(paramValue)
                    }
                  } else {
                    if (!obj[paramName]) {
                      obj[paramName] = paramValue
                    } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                      obj[paramName] = [obj[paramName]]
                      obj[paramName].push(paramValue)
                    } else {
                      obj[paramName].push(paramValue)
                    }
                  }
                }
                return obj
              }
              let typeMethod = 'POST'
              let paramProxy = {
                  headers: {
                      groupId: window.themeDisplay.getScopeGroupId(),
                      Token: window.Liferay ? window.Liferay.authToken : ''
                  },
                  params: {}
              }
              let dataUpdate = new URLSearchParams()
              let paramGetProxy = param.params
              try {
                let paramApi = getAllUrlParams(filter.api.split('?')[1].split('&'))
                paramGetProxy = Object.assign(param.params, paramApi)
              } catch (error) {
              }
              
              dataUpdate.append("method", "GET")
              dataUpdate.append("url", filter['proxyApi'])
              dataUpdate.append('data', JSON.stringify(paramGetProxy))
              axios({
                method: typeMethod,
                url: '/o/rest/v2/proxy',
                headers: paramProxy.headers,
                params: paramProxy.params,
                data: dataUpdate
              }).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  resolve(serializable.data)
                } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                  resolve(serializable)
                } else {
                  resolve(null)
                }
              }).catch(function (error) {
                reject(error)
              })
            }
          
        })
      })
    },
    getAgencyReportListsOld ({state}, filter) {
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
            let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
            if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
              let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
              if (dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) {
                param.params[key] = dateStr
              } else {
                if (String(key).indexOf('DateExtend') > 0) {
                  let keySearch = String(key).replace('Extend', '')
                  let dateCurrent = new Date()
                  dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                  param.params['from' + keySearch] = filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp' ? dateCurrent.getTime() : new Date(dateCurrent).toLocaleDateString('vi-VN')
                  param.params['to' + keySearch] = filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp' ? dateCurrent.getTime() : new Date(dateCurrent).toLocaleDateString('vi-VN')
                } else {
                  try {
                    let [day, month, year] = currentVal.split('/')
                    if (day && month && year && filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp') {
                      let timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)).getTime()
                      if (key === 'toDate') {
                        timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59`)).getTime()
                      }
                      param.params[key] = timeStampDate
                    } else {
                      param.params[key] = currentVal
                    }   
                  } catch (error) {
                    param.params[key] = currentVal
                  }             
                }
              }
            }
          }
          let govAgency = filter['govAgency']
          let agencyLists = filter['agencyLists']
          let agencyListsGet = agencyLists.filter(function (item) {
            return String(item['value']) !== '0'
          })
          let requestURL = ''
            // test local
            // requestURL = 'http://127.0.0.1:8081/api/statistic/todolist'
            requestURL = filter['api']
            if (agencyLists.length === 0) {
              axios.get(requestURL, param).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  //test
                  if (Array.isArray(serializable.data)) {
                    let dataOut = serializable.data
                    if (dataOut.length > 0 && Object.keys(dataOut[0]).length > 0) {
                      resolve(dataOut)
                    } else {
                      resolve(null)
                    }
                  } else {
                    resolve([serializable.data])
                  }
                } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                  resolve(serializable)
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
              for (let key in agencyListsGet) {
                if (String(agencyListsGet[key]['value']) !== '0') {
                  let paramCopy = Object.assign({}, param)
                  paramCopy['headers']['groupId'] = agencyListsGet[key]['value']
                  paramCopy['params']['v'] = Math.random() + key
                  
                  promises.push(axios.get(requestURL, {
                    headers: {
                      groupId: agencyListsGet[key]['value'],
                      Accept: 'application/json'
                    },
                    params: {
                      v: Math.random(),
                      ...param.params
                    }
                  }))
                }
              }
              axios.all(promises)
              .then(axios.spread((...args) => {
                let myObject = []
                for (let i = 0; i < args.length; i++) {
                  let dataOutput = args[i]['data'].hasOwnProperty('total') ? args[i]['data']['data'] : args[i]['data']
                  if (args[i]['data']['total'] > 0 || (!args[i]['data'].hasOwnProperty('total') && dataOutput)) {
                    myObject = myObject.concat(dataOutput)
                  } else {
                    let itemNoData = [
                      {
                        govAgencyCode: agencyListsGet[i]['value'],
                        govAgencyName: agencyListsGet[i]['text']
                      }
                    ]
                    myObject = myObject.concat(itemNoData)
                  }
                }
                if (myObject.length > 0) {
                  resolve(myObject)
                } else {
                  resolve(null)
                }
              }))
            } else if (String(govAgency) !== '0' && String(govAgency) !== '' && agencyLists.length > 0) {
              if (String(govAgency) === 'all') {
                param['headers']['groupId'] = 0
              } else {
                param['headers']['groupId'] = govAgency
              }
              param['params']['v'] = Math.random()
              axios.get(requestURL, param).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  if (Array.isArray(serializable.data)) {
                    let dataOut = serializable.data
                    if (dataOut.length > 0 && Object.keys(dataOut[0]).length > 0) {
                      resolve(dataOut)
                    } else {
                      resolve(null)
                    }
                    
                  } else {
                    resolve([serializable.data])
                  }
                } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                  resolve(serializable)
                } else {
                  resolve(null)
                }
              }).catch(function (error) {
                console.log(error)
                reject(error)
              })
            } else if (String(govAgency) === '' && agencyLists.length > 0) {
              let getAllUrlParams = function(arr) {
                let obj = {}
                for (var i = 0; i < arr.length; i++) {
                  let a = arr[i].split('=')
                  let paramName = a[0]
                  let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
                  paramName = paramName.toLowerCase()
                  if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
                  if (paramName.match(/\[(\d+)?\]$/)) {
                    var key = paramName.replace(/\[(\d+)?\]/, '')
                    if (!obj[key]) obj[key] = []
                    if (paramName.match(/\[\d+\]$/)) {
                      var index = /\[(\d+)\]/.exec(paramName)[1]
                      obj[key][index] = paramValue
                    } else {
                      obj[key].push(paramValue)
                    }
                  } else {
                    if (!obj[paramName]) {
                      obj[paramName] = paramValue
                    } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                      obj[paramName] = [obj[paramName]]
                      obj[paramName].push(paramValue)
                    } else {
                      obj[paramName].push(paramValue)
                    }
                  }
                }
                return obj
              }
              let typeMethod = 'POST'
              let paramProxy = {
                  headers: {
                      groupId: window.themeDisplay.getScopeGroupId(),
                      Token: window.Liferay ? window.Liferay.authToken : ''
                  },
                  params: {}
              }
              let dataUpdate = new URLSearchParams()
              let paramGetProxy = param.params
              try {
                let paramApi = getAllUrlParams(filter.api.split('?')[1].split('&'))
                paramGetProxy = Object.assign(param.params, paramApi)
              } catch (error) {
              }
              
              dataUpdate.append("method", "GET")
              dataUpdate.append("url", filter['proxyApi'])
              dataUpdate.append('data', JSON.stringify(paramGetProxy))
              axios({
                method: typeMethod,
                url: '/o/rest/v2/proxy',
                headers: paramProxy.headers,
                params: paramProxy.params,
                data: dataUpdate
              }).then(function (response) {
                let serializable = response.data
                if (serializable.data) {
                  resolve(serializable.data)
                } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                  resolve(serializable)
                } else {
                  resolve(null)
                }
              }).catch(function (error) {
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
    },
    getExcelReportFromServer ({state}, dataReq) {
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
    loadDataSource ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        // commit('setLoading', true)
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.groupId
            },
            params: {}
          }
          if (!filter.hasOwnProperty('groupId') || (filter.hasOwnProperty('groupId') && filter.groupId === 'site')) {
            axios.get(filter.api, param).then(function (result) {
              if (result.data) {
                let dataMapping = []
                let dataOutput = result.data.data
                if (filter.hasOwnProperty('valueMapping') && filter.valueMapping) {
                  for (let index in dataOutput) {
                    let x = {
                      value: filter.hasOwnProperty('valueMappingChild') ? dataOutput[index][filter.valueMapping][filter.valueMappingChild] : dataOutput[index][filter.valueMapping],
                      name: dataOutput[index][filter.nameMapping]
                    }
                    dataMapping.push(x)
                  }
                } else {
                  dataMapping = dataOutput
                }
                resolve(dataMapping)
              } else {
                resolve([])
              }
            }).catch(function(xhr) {
              reject(xhr)
            })
          } else if (filter.hasOwnProperty('groupId') && (filter.groupId === '' || String(filter.groupId) === '0')) {
            // lấy qua proxy
            let getAllUrlParams = function(arr) {
              let obj = {}
              for (var i = 0; i < arr.length; i++) {
                let a = arr[i].split('=')
                let paramName = a[0]
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
                paramName = paramName.toLowerCase()
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
                if (paramName.match(/\[(\d+)?\]$/)) {
                  var key = paramName.replace(/\[(\d+)?\]/, '')
                  if (!obj[key]) obj[key] = []
                  if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1]
                    obj[key][index] = paramValue
                  } else {
                    obj[key].push(paramValue)
                  }
                } else {
                  if (!obj[paramName]) {
                    obj[paramName] = paramValue
                  } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    obj[paramName] = [obj[paramName]]
                    obj[paramName].push(paramValue)
                  } else {
                    obj[paramName].push(paramValue)
                  }
                }
              }
              return obj
            }
            let typeMethod = 'POST'
            let paramProxy = {
              headers: {
                groupId: window.themeDisplay.getScopeGroupId(),
                Token: window.Liferay ? window.Liferay.authToken : ''
              },
              params: {}
            }
            let dataUpdate = new URLSearchParams()
            let paramGetProxy = param.params
            try {
              let paramApi = getAllUrlParams(filter.api.split('?')[1].split('&'))
              paramGetProxy = Object.assign(param.params, paramApi)
            } catch (error) {
            }
            
            dataUpdate.append("method", "GET")
            dataUpdate.append("url", filter['proxyApi'])
            dataUpdate.append('data', JSON.stringify(paramGetProxy))
            axios({
              method: typeMethod,
              url: '/o/rest/v2/proxy',
              headers: paramProxy.headers,
              params: paramProxy.params,
              data: dataUpdate
            }).then(function (response) {
              if (response.data) {
                let dataMapping = []
                let dataOutput = response.data.data
                if (filter.hasOwnProperty('valueMapping') && filter.valueMapping) {
                  for (let index in dataOutput) {
                    let x = {
                      value: filter.hasOwnProperty('valueMappingChild') ? dataOutput[index][filter.valueMapping][filter.valueMappingChild] : dataOutput[index][filter.valueMapping],
                      name: dataOutput[index][filter.nameMapping]
                    }
                    dataMapping.push(x)
                  }
                } else {
                  dataMapping = dataOutput
                }
                resolve(dataMapping)
              } else {
                resolve([])
              }
            }).catch(function (error) {
              reject([])
            })
          } else if (filter.hasOwnProperty('groupId') && String(filter.groupId) !== '0' && String(filter.groupId) !== '' && String(filter.groupId) !== 'site') {
            // lấy theo groupId
            param.headers.groupId = filter.groupId
            axios.get(filter.api, param).then(function (result) {
              if (result.data) {
                let dataMapping = []
                let dataOutput = result.data.data
                if (filter.hasOwnProperty('valueMapping') && filter.valueMapping) {
                  for (let index in dataOutput) {
                    let x = {
                      value: filter.hasOwnProperty('valueMappingChild') ? dataOutput[index][filter.valueMapping][filter.valueMappingChild] : dataOutput[index][filter.valueMapping],
                      name: dataOutput[index][filter.nameMapping]
                    }
                    dataMapping.push(x)
                  }
                } else {
                  dataMapping = dataOutput
                }
                resolve(dataMapping)
              } else {
                resolve([])
              }
            }).catch(function(xhr) {
              reject(xhr)
            })
          }
          
        })
      })
    },
    getDossiers ({commit, state}, filter) {
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
            let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
            if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
              let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).getTime() : currentVal
              if ((dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) || (new Date(currentVal)).getFullYear() < 2000) {
                param.params[key] = dateStr
              } else {
                if (String(key).indexOf('DateExtend') > 0) {
                  let keySearch = String(key).replace('Extend', '')
                  let dateCurrent = new Date()
                  dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                  param.params['from' + keySearch] = dateCurrent.getTime()
                  param.params['to' + keySearch] = dateCurrent.getTime()
                } else {
                  let [day, month, year] = currentVal.split('/')
                  if (day && month && year && filter.hasOwnProperty('formatDate') && filter.formatDate === 'timestamp') {
                    let timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)).getTime()
                    if (key === 'toDate') {
                      timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59`)).getTime()
                    }
                    param.params[key] = timeStampDate
                  } else {
                    param.params[key] = currentVal
                  } 
                }
              }
            }
          }
          param.params['start'] = filter.start
          param.params['end'] = filter.end
          let govAgency = filter['govAgency']
          let agencyLists = filter['agencyLists']
          let agencyListsGet = agencyLists.filter(function (item) {
            return String(item['value']) !== '0'
          })
          let requestURL = ''
          requestURL = filter['api']
          console.log('params999', param.params)
          if (agencyLists.length === 0) {
            axios.post(requestURL, {}, param).then(function (response) {
              let serializable = response.data
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else if (String(govAgency) === '0' && agencyLists.length > 0) {
            let promises = []
            for (let key in agencyListsGet) {
              if (String(agencyListsGet[key]['value']) !== '0') {
                let paramCopy = Object.assign({}, param)
                paramCopy['headers']['groupId'] = agencyListsGet[key]['value']
                paramCopy['params']['v'] = Math.random() + key
                
                promises.push(axios.post(requestURL, {}, {
                  headers: {
                    groupId: agencyListsGet[key]['value'],
                    Accept: 'application/json'
                  },
                  params: {
                    v: Math.random(),
                    ...param.params
                  }
                }))
              }
            }
            axios.all(promises)
            .then(axios.spread((...args) => {
              let myObject = []
              for (let i = 0; i < args.length; i++) {
                let dataOutput = args[i]['data'].hasOwnProperty('total') ? args[i]['data']['data'] : args[i]['data']
                if (args[i]['data']['total'] > 0 || (!args[i]['data'].hasOwnProperty('total') && dataOutput)) {
                  myObject = myObject.concat(dataOutput)
                } else {
                  let itemNoData = [
                    {
                      govAgencyCode: agencyListsGet[i]['value'],
                      govAgencyName: agencyListsGet[i]['text']
                    }
                  ]
                  myObject = myObject.concat(itemNoData)
                }
              }
              if (myObject.length > 0) {
                resolve(myObject)
              } else {
                resolve(null)
              }
            }))
          } else if (String(govAgency) !== '0' && String(govAgency) !== '' && agencyLists.length > 0) {
            if (String(govAgency) === 'all') {
              param['headers']['groupId'] = 0
            } else {
              param['headers']['groupId'] = govAgency
            }
            param['params']['v'] = Math.random()
            axios.post(requestURL, {}, param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                resolve(serializable)
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else if (String(govAgency) === '' && agencyLists.length > 0) {
            let getAllUrlParams = function(arr) {
              let obj = {}
              for (var i = 0; i < arr.length; i++) {
                let a = arr[i].split('=')
                let paramName = a[0]
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
                paramName = paramName.toLowerCase()
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
                if (paramName.match(/\[(\d+)?\]$/)) {
                  var key = paramName.replace(/\[(\d+)?\]/, '')
                  if (!obj[key]) obj[key] = []
                  if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1]
                    obj[key][index] = paramValue
                  } else {
                    obj[key].push(paramValue)
                  }
                } else {
                  if (!obj[paramName]) {
                    obj[paramName] = paramValue
                  } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    obj[paramName] = [obj[paramName]]
                    obj[paramName].push(paramValue)
                  } else {
                    obj[paramName].push(paramValue)
                  }
                }
              }
              return obj
            }
            let typeMethod = 'POST'
            let paramProxy = {
                headers: {
                    groupId: window.themeDisplay.getScopeGroupId(),
                    Token: window.Liferay ? window.Liferay.authToken : ''
                },
                params: {}
            }
            let dataUpdate = new URLSearchParams()
            let paramGetProxy = param.params
            try {
              let paramApi = getAllUrlParams(filter.api.split('?')[1].split('&'))
              paramGetProxy = Object.assign(param.params, paramApi)
            } catch (error) {
            }
            
            dataUpdate.append("method", "GET")
            dataUpdate.append("url", filter['proxyApi'])
            dataUpdate.append('data', JSON.stringify(paramGetProxy))
            axios({
              method: typeMethod,
              url: '/o/rest/v2/proxy',
              headers: paramProxy.headers,
              params: paramProxy.params,
              data: dataUpdate
            }).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                resolve(serializable)
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              reject(error)
            })
          }
          
        })
      })
    },
    exportExcel ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/octet-stream'
            },
            params: {
            },
            responseType: 'blob'
          }
          for (let key in filter['data']) {
            let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
            if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
              let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).getTime() : currentVal
              if (dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) {
                param.params[key] = dateStr
              } else {
                if (String(key).indexOf('DateExtend') > 0) {
                  let keySearch = String(key).replace('Extend', '')
                  let dateCurrent = new Date()
                  dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                  param.params['from' + keySearch] = dateCurrent.getTime()
                  param.params['to' + keySearch] = dateCurrent.getTime()
                } else {
                  let [day, month, year] = currentVal.split('/')
                  if (day && month && year) {
                    let timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)).getTime()
                    if (key === 'toDate') {
                      timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59`)).getTime()
                    }
                    if (key === 'fromDate' || key === 'toDate') {
                      param.params[key] = timeStampDate
                    } else {
                      param.params[key] = currentVal
                    }
                  } else {
                    param.params[key] = currentVal
                  } 
                }
              }
            }
          }
          param.params['start'] = filter.start
          param.params['end'] = filter.end
          let govAgency = filter['govAgency']
          let agencyLists = filter['agencyLists']
          let agencyListsGet = agencyLists.filter(function (item) {
            return String(item['value']) !== '0'
          })
          let requestURL = ''
          requestURL = filter['api']
          if (agencyLists.length === 0) {
            axios.post(requestURL, {}, param).then(function (response) {
              let serializable = response.data
              // 
              var fileName = filter.fileName
              var a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              var url = window.URL.createObjectURL(response.data)
              a.href = url
              a.download = fileName
              a.click()
              window.URL.revokeObjectURL(url)
              // 
              resolve(serializable)
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else if (String(govAgency) === '0' && agencyLists.length > 0) {
            let promises = []
            for (let key in agencyListsGet) {
              if (String(agencyListsGet[key]['value']) !== '0') {
                let paramCopy = Object.assign({}, param)
                paramCopy['headers']['groupId'] = agencyListsGet[key]['value']
                paramCopy['params']['v'] = Math.random() + key
                
                promises.push(axios.post(requestURL, {}, {
                  headers: {
                    groupId: agencyListsGet[key]['value'],
                    Accept: 'application/json'
                  },
                  params: {
                    v: Math.random(),
                    ...param.params
                  }
                }))
              }
            }
            axios.all(promises)
            .then(axios.spread((...args) => {
              let myObject = []
              for (let i = 0; i < args.length; i++) {
                // 
                try {
                  var fileName = filter.fileName
                  var a = document.createElement('a')
                  document.body.appendChild(a)
                  a.style = 'display: none'
                  var url = window.URL.createObjectURL(args[i]['data'])
                  a.href = url
                  a.download = fileName
                  a.click()
                  window.URL.revokeObjectURL(url)
                } catch (error) {
                }
                // 
                let dataOutput = args[i]['data'].hasOwnProperty('total') ? args[i]['data']['data'] : args[i]['data']
                if (args[i]['data']['total'] > 0 || (!args[i]['data'].hasOwnProperty('total') && dataOutput)) {
                  myObject = myObject.concat(dataOutput)
                } else {
                  let itemNoData = [
                    {
                      govAgencyCode: agencyListsGet[i]['value'],
                      govAgencyName: agencyListsGet[i]['text']
                    }
                  ]
                  myObject = myObject.concat(itemNoData)
                }
              }
              if (myObject.length > 0) {
                resolve(myObject)
              } else {
                resolve(null)
              }
            }))
          } else if (String(govAgency) !== '0' && String(govAgency) !== '' && agencyLists.length > 0) {
            if (String(govAgency) === 'all') {
              param['headers']['groupId'] = 0
            } else {
              param['headers']['groupId'] = govAgency
            }
            param['params']['v'] = Math.random()
            axios.post(requestURL, {}, param).then(function (response) {
              let serializable = response.data
              // 
              try {
                var fileName = filter.fileName
                var a = document.createElement('a')
                document.body.appendChild(a)
                a.style = 'display: none'
                var url = window.URL.createObjectURL(response.data)
                a.href = url
                a.download = fileName
                a.click()
                window.URL.revokeObjectURL(url)
              } catch (error) {
              }
              // 
              if (serializable.data) {
                resolve(serializable)
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else if (String(govAgency) === '' && agencyLists.length > 0) {
            let getAllUrlParams = function(arr) {
              let obj = {}
              for (var i = 0; i < arr.length; i++) {
                let a = arr[i].split('=')
                let paramName = a[0]
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
                paramName = paramName.toLowerCase()
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
                if (paramName.match(/\[(\d+)?\]$/)) {
                  var key = paramName.replace(/\[(\d+)?\]/, '')
                  if (!obj[key]) obj[key] = []
                  if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1]
                    obj[key][index] = paramValue
                  } else {
                    obj[key].push(paramValue)
                  }
                } else {
                  if (!obj[paramName]) {
                    obj[paramName] = paramValue
                  } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    obj[paramName] = [obj[paramName]]
                    obj[paramName].push(paramValue)
                  } else {
                    obj[paramName].push(paramValue)
                  }
                }
              }
              return obj
            }
            let typeMethod = 'POST'
            let paramProxy = {
                headers: {
                    groupId: window.themeDisplay.getScopeGroupId(),
                    Token: window.Liferay ? window.Liferay.authToken : ''
                },
                params: {}
            }
            let dataUpdate = new URLSearchParams()
            let paramGetProxy = param.params
            try {
              let paramApi = getAllUrlParams(filter.api.split('?')[1].split('&'))
              paramGetProxy = Object.assign(param.params, paramApi)
            } catch (error) {
            }
            
            dataUpdate.append("method", "GET")
            dataUpdate.append("url", filter['proxyApi'])
            dataUpdate.append('data', JSON.stringify(paramGetProxy))
            axios({
              method: typeMethod,
              url: '/o/rest/v2/proxy',
              headers: paramProxy.headers,
              params: paramProxy.params,
              data: dataUpdate
            }).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                resolve(serializable)
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              reject(error)
            })
          }
          
        })
      })
    },
    loadDossierActions ({commit, state}, data) {
      let config = {
        headers: {
          'groupId': data.groupId ? data.groupId : state.groupId,
        },
        params: {
          stepType: data.stepType
        }
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId + '/sequences'
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
          groupId: state.groupId
        },
        params: {
          stepType: data.stepType
        }
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId + '/mermaidgraph'
      return new Promise((resolve, reject) => {
        axios.get(url, config).then(function (response) {
          resolve(response.data)
        }).catch(function (xhr) {
          reject(xhr)
        })
      })
    },
    getRoleUser ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get('/o/rest/v2/users/login', param).then(function (response) {
          let serializable = response.data
          if (serializable && serializable.length > 0) {
            let roles = []
            for (let key in serializable) {
              if (serializable[key]['role']) {
                let role = serializable[key]['role'].split('_')
                let roleLength = role.length
                if (isNaN((Number(role[roleLength - 1])))) {
                  roles.push(serializable[key]['role'])
                } else {
                  let item = serializable[key]['role'].replace('_' + role[roleLength - 1], '')
                  roles.push(item)
                }
                
              }
            }
            console.log('roles store1', roles)
            resolve(roles)
          } else {
            console.log('roles store2')
            resolve('')
          }
        }).catch(function (error) {
          console.log(error)
          reject('default')
        })
      })
    },
    getReportVotingEmployee ({state}, filter) {
      return new Promise((resolve, reject) => {
        let data = JSON.stringify(filter.jobposList)
        let config = {
          method: 'post',
          url: '/o/rest/v2/votings/employee/statistic',
          headers: {
            'groupId': state.groupId,
            'Content-Type': 'application/json'
          },
          data : data,
          params: {}
        };
        for (let key in filter['data']) {
          let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
          if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
            let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
            if (dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) {
              config.params[key] = dateStr
            } else {
              if (String(key).indexOf('DateExtend') > 0) {
                let keySearch = String(key).replace('Extend', '')
                let dateCurrent = new Date()
                dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                config.params['from' + keySearch] = new Date(dateCurrent).toLocaleDateString('vi-VN')
                config.params['to' + keySearch] = new Date(dateCurrent).toLocaleDateString('vi-VN')
              } else {
                config.params[key] = currentVal
              }
            }
          }
        }
        axios(config)
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    exportVotingEmployee ({state}, filter) {
      return new Promise((resolve, reject) => {
        let data = JSON.stringify(filter.jobposList)
        let config = {
          method: 'post',
          url: '/o/rest/v2/votings/employee/statistic/export',
          headers: { 
            'groupId': state.groupId,
            'Content-Type': 'application/octet-stream'
          },
          data : data,
          responseType: 'blob',
          params: {}
        };
        console.log('filterEmployee', filter)
        for (let key in filter['data']) {
          let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
          if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
            let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).toLocaleDateString('vi-VN') : currentVal
            if (dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) {
              config.params[key] = dateStr
            } else {
              if (String(key).indexOf('DateExtend') > 0) {
                let keySearch = String(key).replace('Extend', '')
                let dateCurrent = new Date()
                dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                config.params['from' + keySearch] = new Date(dateCurrent).toLocaleDateString('vi-VN')
                config.params['to' + keySearch] = new Date(dateCurrent).toLocaleDateString('vi-VN')
              } else {
                config.params[key] = currentVal
              }
            }
          }
        }
        axios(config)
        .then(function (response) {
          var fileNames = response.headers['content-disposition']
          var fileName = fileNames.split('filename=')[1]
          fileName = fileName.split('"').join('')
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.style = 'display: none'
          var urlFile = window.URL.createObjectURL(response.data)
          a.href = urlFile
          a.download = fileName
          a.click()
          
          window.URL.revokeObjectURL(urlFile)
          resolve('success')
        })
        .catch(function (error) {
          reject(error)
        })
      })
    },
    createReport ({state}, filter) {
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
            let currentVal = Array.isArray(filter['data'][key]) ? filter['data'][key].toString() : filter['data'][key]
            if (currentVal !== '' && currentVal !== undefined && currentVal !== null) {
              let dateStr = String(currentVal).indexOf('/') <= 0 ? new Date(currentVal).getTime() : currentVal
              if ((dateStr !== 'Invalid Date' && String(currentVal).length === 13 && !isNaN(dateStr)) || (new Date(currentVal)).getFullYear() < 2000 ) {
                param.params[key] = dateStr
              } else {
                if (String(key).indexOf('DateExtend') > 0) {
                  let keySearch = String(key).replace('Extend', '')
                  let dateCurrent = new Date()
                  dateCurrent.setDate(dateCurrent.getDate() + Number(filter['data'][key]))
                  param.params['from' + keySearch] = dateCurrent.getTime()
                  param.params['to' + keySearch] = dateCurrent.getTime()
                } else {
                  let [day, month, year] = currentVal.split('/')
                  if (day && month && year) {
                    let timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)).getTime()
                    if (key === 'toDate') {
                      timeStampDate = (new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59`)).getTime()
                    }
                    param.params[key] = timeStampDate
                  } else {
                    param.params[key] = currentVal
                  }                  
                }
              }
            }
          }
          let govAgency = filter['govAgency']
          let agencyLists = filter['agencyLists'] ? filter['agencyLists'] : []
          let agencyListsGet = agencyLists ? agencyLists.filter(function (item) {
            return String(item['value']) !== '0'
          }) : []
          let requestURL = ''
          requestURL = filter['api']
          if (agencyLists.length === 0) {
            axios.post(requestURL, {}, param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                //test
                if (Array.isArray(serializable.data)) {
                  let dataOut = serializable.data
                  if (dataOut.length > 0 && Object.keys(dataOut[0]).length > 0) {
                    resolve(dataOut)
                  } else {
                    resolve([])
                  }
                } else {
                  resolve([serializable.data])
                }
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
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
            for (let key in agencyListsGet) {
              if (String(agencyListsGet[key]['value']) !== '0') {
                let paramCopy = Object.assign({}, param)
                paramCopy['headers']['groupId'] = agencyListsGet[key]['value']
                paramCopy['params']['v'] = Math.random() + key
                
                promises.push(axios.post(requestURL, {}, {
                  headers: {
                    groupId: agencyListsGet[key]['value'],
                    Accept: 'application/json'
                  },
                  params: {
                    v: Math.random(),
                    ...param.params
                  }
                }))
              }
            }
            axios.all(promises)
            .then(axios.spread((...args) => {
              let myObject = []
              for (let i = 0; i < args.length; i++) {
                let dataOutput = args[i]['data'].hasOwnProperty('total') ? args[i]['data']['data'] : args[i]['data']
                if (args[i]['data']['total'] > 0 || (!args[i]['data'].hasOwnProperty('total') && dataOutput)) {
                  myObject = myObject.concat(dataOutput)
                } else {
                  let itemNoData = [
                    {
                      govAgencyCode: agencyListsGet[i]['value'],
                      govAgencyName: agencyListsGet[i]['text']
                    }
                  ]
                  myObject = myObject.concat(itemNoData)
                }
              }
              if (myObject.length > 0) {
                resolve(myObject)
              } else {
                resolve(null)
              }
            }))
          } else if (String(govAgency) !== '0' && String(govAgency) !== '' && agencyLists.length > 0) {
            if (String(govAgency) === 'all') {
              param['headers']['groupId'] = 0
            } else {
              param['headers']['groupId'] = govAgency
            }
            param['params']['v'] = Math.random()
            axios.post(requestURL, {}, param).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                if (Array.isArray(serializable.data)) {
                  let dataOut = serializable.data
                  if (dataOut.length > 0 && Object.keys(dataOut[0]).length > 0) {
                    resolve(dataOut)
                  } else {
                    resolve([])
                  }
                  
                } else {
                  resolve([serializable.data])
                }
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
                resolve([])
              }
            }).catch(function (error) {
              console.log(error)
              reject(error)
            })
          } else if (String(govAgency) === '' && agencyLists.length > 0) {
            let getAllUrlParams = function(arr) {
              let obj = {}
              for (var i = 0; i < arr.length; i++) {
                let a = arr[i].split('=')
                let paramName = a[0]
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1]
                paramName = paramName.toLowerCase()
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase()
                if (paramName.match(/\[(\d+)?\]$/)) {
                  var key = paramName.replace(/\[(\d+)?\]/, '')
                  if (!obj[key]) obj[key] = []
                  if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1]
                    obj[key][index] = paramValue
                  } else {
                    obj[key].push(paramValue)
                  }
                } else {
                  if (!obj[paramName]) {
                    obj[paramName] = paramValue
                  } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                    obj[paramName] = [obj[paramName]]
                    obj[paramName].push(paramValue)
                  } else {
                    obj[paramName].push(paramValue)
                  }
                }
              }
              return obj
            }
            let typeMethod = 'POST'
            let paramProxy = {
                headers: {
                    groupId: window.themeDisplay.getScopeGroupId(),
                    Token: window.Liferay ? window.Liferay.authToken : ''
                },
                params: {}
            }
            let dataUpdate = new URLSearchParams()
            let paramGetProxy = param.params
            try {
              let paramApi = getAllUrlParams(filter.api.split('?')[1].split('&'))
              paramGetProxy = Object.assign(param.params, paramApi)
            } catch (error) {
            }
            
            dataUpdate.append("method", "GET")
            dataUpdate.append("url", filter['proxyApi'])
            dataUpdate.append('data', JSON.stringify(paramGetProxy))
            axios({
              method: typeMethod,
              url: '/o/rest/v2/proxy',
              headers: paramProxy.headers,
              params: paramProxy.params,
              data: dataUpdate
            }).then(function (response) {
              let serializable = response.data
              if (serializable.data) {
                resolve(serializable.data)
              } else if (!serializable.data && Array.isArray(serializable) && serializable.length > 0) {
                resolve(serializable)
              } else {
                resolve(null)
              }
            }).catch(function (error) {
              reject(error)
            })
          }
          
        })
      })
    },
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
