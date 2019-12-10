import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
import support from './support.json'
// 

Vue.use(toastr)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    indexReport: '',
    groupConfig: '',
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
    itemsReports: support['trangThaiHoSoList'],
    sampleStatistic: [{"badCount":0,"companyId":0,"domain":"STNMT_GDDB","domainName":"Giao dịch đảm bảo","goodCount":1,"govAgencyCode":"STNMT","govAgencyName":"Sở tài nguyên và Môi trường","groupId":63785,"month":2,"percentBad":0,"percentGood":100,"percentVeryGood":0,"totalVoted":1,"veryGoodCount":0,"votingCode":1,"votingSubject":"Bạn có hài lòng về thời gian và chi phí phải trả cho dịch vụ hành chính","year":2018},{"badCount":0,"companyId":0,"domain":"STNMT_GDDB","domainName":"Giao dịch đảm bảo","goodCount":1,"govAgencyCode":"","govAgencyName":"","groupId":63785,"month":2,"percentBad":0,"percentGood":100,"percentVeryGood":0,"totalVoted":1,"veryGoodCount":0,"votingCode":2,"votingSubject":"Bạn có hài lòng về quy định hồ sơ của thủ tục hành chính","year":2018},{"badCount":0,"companyId":0,"domain":"STNMT_GDDB","domainName":"Giao dịch đảm bảo","goodCount":1,"govAgencyCode":"STNMT","govAgencyName":"Sở tài nguyên và Môi trường","groupId":63785,"month":2,"percentBad":0,"percentGood":100,"percentVeryGood":0,"totalVoted":1,"veryGoodCount":0,"votingCode":2,"votingSubject":"Bạn có hài lòng về quy định hồ sơ của thủ tục hành chính","year":2018},{"badCount":0,"companyId":0,"domain":"STNMT_GDDB","domainName":"Giao dịch đảm bảo","goodCount":1,"govAgencyCode":"SCT","govAgencyName":"Sở công thương","groupId":63785,"month":2,"percentBad":0,"percentGood":100,"percentVeryGood":0,"totalVoted":1,"veryGoodCount":0,"votingCode":1,"votingSubject":"Bạn có hài lòng về thời gian và chi phí phải trả cho dịch vụ hành chính","year":2018}]
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
        if (groupStatisticConfig) {
          state['groupConfig'] = groupStatisticConfig
        }
        resolve(state.initData)
        // let param = {
        //   headers: {
        //     groupId: state.initData['groupId']
        //   }
        // }
        // axios.get('/o/v1/opencps/site/name', param).then(function (response) {
        //   let serializable = response.data
        //   state.siteName = serializable
        //   console.log(state.siteName)
        //   commit('setsiteName', serializable)
        //   resolve(state.initData)
        // }).catch(function (error) {
        //   console.log(error)
        // })
      })
    },
    getLevelList ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId
            }
          }
          let dataPost = new URLSearchParams()
          let textPost = {}
          dataPost.append('method', 'GET')
          dataPost.append('url', '/serviceinfos/statistics/levels')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve([])
            }
          }).catch(function () {
            reject()
          })
        })
      })
    },
    getReportTotal ({commit, state}, year) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          // 
          let dataPost = new URLSearchParams()
          let textPost = {
            year: year,
            month: 0,
            domain: 'total',
            agency: 'total',
            system: 'total'
          }
          dataPost.append('method', 'GET')
          dataPost.append('url', '/statistics')
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              let dataReturn = serializable.data
              resolve(dataReturn)
            } else {
              resolve(null)
            }
          }).catch(function () {
            reject()
          })
        })
      })
    },
    getAgencyReportLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            }
          }
          let params = {
            year: filter.year,
            month: filter.month,
            group: filter.group,
            agency: filter['agency'],
            system: filter['system']
          }
          if (filter['report']) {
            params['domain'] = 'total'
          }
          if (filter['report'] === 'linemonth') {
            params['domain'] = ''
          }
          // 
          let childsCode = []
          if (state.groupConfig) {
            for (let key in state.groupConfig) {
              childsCode = childsCode.concat(state.groupConfig[key].split(','))
            }
          }
          // 
          let dataPost = new URLSearchParams()
          let url = '/statistics'
          // for (let index in params) {
          //   url += index + '=' + params[index] + '&'
          // }
          dataPost.append('method', 'GET')
          dataPost.append('url', url)
          dataPost.append('data', JSON.stringify(params))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            let serializable = response.data
            if (params.hasOwnProperty('month') && String(params['month']) !== 'undefined' && params['agency'] !== 'total' 
              && params.hasOwnProperty('domain') && params['domain'] === 'total' && state.groupConfig) {
              let childsData = function (code) {
                return serializable['data'].filter(function (item) {
                  return item['govAgencyCode'] === code
                })
              }
              let resultData = serializable['data']
              let resultOutput = []
              for (let index in resultData) {
                let groupCode = resultData[index]['govAgencyCode']
                if (state.groupConfig.hasOwnProperty(groupCode)) {
                  let childs = state.groupConfig[groupCode].split(',')
                  for (let index2 in childs) {
                    resultData[index]['processingCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['processingCount']) + Number(childsData(childs[index2])[0]['processingCount']) : resultData[index]['processingCount']
                    resultData[index]['waitingCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['waitingCount']) + Number(childsData(childs[index2])[0]['waitingCount']) : resultData[index]['waitingCount']
                    resultData[index]['releaseCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['releaseCount']) + Number(childsData(childs[index2])[0]['releaseCount']) : resultData[index]['releaseCount']
                    resultData[index]['onlineCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['onlineCount']) + Number(childsData(childs[index2])[0]['onlineCount']) : resultData[index]['onlineCount']
                    resultData[index]['onegateCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['onegateCount']) + Number(childsData(childs[index2])[0]['onegateCount']) : resultData[index]['onegateCount']
                  }
                }
                let removeItems = childsCode.filter(function (item) {
                  return item !== resultData[index]['govAgencyCode']
                })
                if (removeItems.length === childsCode.length) {
                  resultOutput.push(resultData[index])
                }
              }
              resolve(resultOutput)
            } else if (params.hasOwnProperty('month') && String(params['month']) === 'undefined' && params['agency'] !== 'total' 
              && params.hasOwnProperty('domain') && params['domain'] === 'total' && state.groupConfig) {
                let childsData = function (code) {
                  return serializable['data'].filter(function (item) {
                    return item['govAgencyCode'] === code
                  })
                }
                let resultData = serializable['data']
                let resultOutput = []
                for (let index in resultData) {
                  let groupCode = resultData[index]['govAgencyCode']
                  if (state.groupConfig.hasOwnProperty(groupCode)) {
                    let childs = state.groupConfig[groupCode].split(',')
                    for (let index2 in childs) {
                      resultData[index]['receivedCount'] = childsData(childs[index2])[0] && childsData(childs[index2])[0]['month'] === resultData[index]['month'] ? Number(resultData[index]['receivedCount']) + Number(childsData(childs[index2])[0]['receivedCount']) : resultData[index]['receivedCount']
                    }
                  }
                  let removeItems = childsCode.filter(function (item) {
                    return item !== resultData[index]['govAgencyCode']
                  })
                  if (removeItems.length === childsCode.length) {
                    resultOutput.push(resultData[index])
                  }
                }
                resolve(resultOutput)
            } else {
              if (serializable.data) {
                let dataReturn = serializable.data
                resolve(dataReturn)
              } else {
                resolve(null)
              }
            }
          }).catch(function () {
            reject(error)
          })
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
            console.log('serializable', response)
            let serializable = response.data
            let file = window.URL.createObjectURL(serializable)
            resolve(file)
          }).catch(function (error) {
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
          // 
          let dataPost = new URLSearchParams()
          let textPost = {}
          dataPost.append('method', 'GET')
          dataPost.append('url', '/postal/votings/' + data.className + '/' + data.classPk)
          dataPost.append('data', JSON.stringify(textPost))
          dataPost.append('serverCode', 'SERVER_DVC')
          axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
            if (response.data) {
              let dataVoting = response.data.data
              for (let i = 0; i < dataVoting.length; i++) {
                dataVoting[i]['answerPercent'] = []
                dataVoting[i]['averageScore'] = 0
              }
              resolve(dataVoting)
            } else {
              resolve([])
            }
          }).catch(function () {
            reject()
          })
        })
      })
    },
    getDynamicReports ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let options = {
            headers: {
              'groupId': state.initData.groupId,
              'Content-Type': 'text/plain',
              'Accept': 'application/json',
              'reportType': ''
            }
          }
          let body = `
            {
              getDynamicReports(start: -1, end: -1) {
                dynamicReportId
                reportCode
                reportName
                filterConfig
                tableConfig
                userConfig
                sharing
              }
            }
          `
          axios.post('/o/v1/opencps/adminconfig', body, options).then(function (response) {
            let serializable = response.data
            var currentReport = ''
            if (serializable['getDynamicReports']) {
              for (let key in serializable['getDynamicReports']) {
                if (filter['reportCode'] === serializable['getDynamicReports'][key]['reportCode']) {
                  currentReport = serializable['getDynamicReports'][key]
                  commit('setIndexReport', key)
                }
              }
              resolve(currentReport)
            } else {
              resolve('')
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getDataReports ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function () {
          let param = {
            headers: {
              groupId: filter.groupId,
              Accept: 'application/json'
            },
            params: {}
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
          axios.get(filter.api, param).then(function (response) {
            let serializable = response.data
            if (serializable.data) {
              if (Array.isArray(serializable.data)) {
                resolve(serializable.data)
              } else {
                resolve([serializable.data])
              }
            } else {
              resolve('')
            }
          }).catch(function (error) {
            reject(error)
          })
        })
      })
    },
    getEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: filter['groupId']
            },
            params: {
              jobposCode: filter['jobposCode']
            }
          }
          axios.get('/o/rest/v2/employees', param).then(result => {
            if (result.data) {
              let employees = result.data.data
              if (employees && employees.length > 0) {
                for (let key in employees) {
                  if (employees[key]['employeeNo'] === 'EMPVPB101') {
                    employees[key].titleJobpos = 'Trưởng bộ phận'
                  } else if (employees[key]['employeeNo'] === 'EMPVPB102') {
                    employees[key].titleJobpos = 'Phó trưởng bộ phận'
                  } else if (employees[key]['employeeNo'] === 'EMPVPB103' || employees[key]['employeeNo'] === 'EMPVPB104' || employees[key]['employeeNo'] === 'EMPVPB105') {
                    employees[key].titleJobpos = 'Cán bộ thường trực'
                  }
                  employees[key].imgSrc = ''
                  employees[key].score = 0
                  employees[key].totalVoting = 0
                }
              }
              let dataOutput = [employees.length, employees]
              resolve(dataOutput)
            } else {
              resolve([0, []])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    loadImageEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: filter.groupId
            }
          }
          axios.get('/o/v1/opencps/users/avatar/org.opencps.usermgt.model.Employee/' + filter['employeeId'], param).then(function (response) {
            let seriable = response.data
            resolve(seriable)
          }).catch(function (xhr) {
            reject(xhr)
          })
        })
      })
    },
    loadVotingEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: filter.groupId
            },
            params: {
              fromVotingDate: filter.fromVotingDate,
              toVotingDate: filter.toVotingDate
            }
          }
          axios.get('/o/rest/v2/postal/votings/' + filter.className + '/' + filter.classPk, param).then(result => {
            if (result.data) {
              resolve(result.data.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
        })
      })
    },
    getReportDossierEmployee ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result1) {
          let param = {
            headers: {
              groupId: filter['groupId']
            },
            params: {
              from: filter['from'],
              to: filter['to']
            }
          }
          axios.get('/o/rest/v2/statistics/dossiers/person', param).then(result => {
            if (result.data) {
              resolve(result.data)
            } else {
              resolve([])
            }
          }).catch(xhr => {
            reject(xhr)
          })
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
    setIndexReport (state, payload) {
      state.indexReport = payload
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
    getIndexReport (state) {
      return state.indexReport
    }
  }
})
