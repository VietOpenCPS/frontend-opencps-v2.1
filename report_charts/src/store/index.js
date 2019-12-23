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
    itemsReports: support['trangThaiHoSoList']
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
        try {
          if (groupStatisticConfig) {
            state['groupConfig'] = groupStatisticConfig
          }
        } catch (error) {
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
          axios.get('/o/rest/v2/serviceinfos/statistics/levels', param).then(function (response) {
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
          axios.get('/o/rest/statistics?year=' + year + '&month=0&domain=total&agency=total&system=total', param).then(function (response) {
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
      })
    },
    getAgencyReportLists ({commit, state}, filter) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let param = {
            headers: {
              groupId: state.initData.groupId,
              Accept: 'application/json'
            },
            params: {
              year: filter.year,
              month: filter.month,
              group: filter.group,
              agency: filter['agency'],
              system: filter['system']
            }
          }
          if (filter['report']) {
            param.params['domain'] = 'total'
          }
          if (filter['report'] === 'linemonth') {
            param.params['domain'] = ''
          }
          // 
          // let childsCode = []
          // if (state.groupConfig) {
          //   for (let key in state.groupConfig) {
          //     childsCode = childsCode.concat(state.groupConfig[key][1].split(','))
          //   }
          // }
          // 
          axios.get('/o/rest/statistics', param).then(function (response) {
            let serializable = response.data
            // Khởi tạo group cha với fix trường hợp group cha không có dữ liệu, group con có dữ liệu
            let childsCode = []
            if (state.groupConfig) {
              for (let key in state.groupConfig) {
                childsCode = childsCode.concat(state.groupConfig[key][1].split(','))
                if (param.params['agency'] !== 'total') {
                  if (param.params.hasOwnProperty('month') && param.params['month']) {
                    let groupExits = serializable['data'].filter(function (item) {
                      return item['govAgencyCode'] === key && Number(item['month']) === Number(param.params['month'])
                    })
                    if (groupExits.length === 0) {
                      let group = {
                        govAgencyCode: key,
                        govAgencyName: state.groupConfig[key][0],
                        domainCode: '',
                        domainName: '',
                        processingCount: 0,
                        waitingCount: 0,
                        releaseCount: 0,
                        onlineCount: 0,
                        onegateCount: 0,
                        month: Number(param.params['month']),
                        year: Number(param.params['year']),
                        betimesCount: 0,
                        cancelledCount: 0,
                        deniedCount: 0,
                        doneCount: 0,
                        insideCount: 0,
                        interoperatingCount: 0,
                        ontimeCount: 0,
                        ontimePercentage: 0,
                        outsideCount: 0,
                        overdueCount: 0,
                        overtimeCount: 0,
                        overtimeInside: 0,
                        overtimeOutside: 0,
                        processCount: 0,
                        receivedCount: 0,
                        releasingCount: 0,
                        remainingCount: 0,
                        totalCount: 0,
                        undueCount: 0,
                        unresolvedCount: 0
                      }
                      serializable['data'] = serializable['data'].concat([group])
                    }
                  } else {
                    for (let indexMonth = 1; indexMonth <= 12; indexMonth++) {
                      let groupExits = serializable['data'].filter(function (item) {
                        return item['govAgencyCode'] === key && Number(item['month']) === Number(indexMonth)
                      })
                      if (groupExits.length === 0) {
                        let group = {
                          govAgencyCode: key,
                          govAgencyName: state.groupConfig[key][0],
                          domainCode: '',
                          domainName: '',
                          processingCount: 0,
                          receivedCount: 0,
                          waitingCount: 0,
                          releaseCount: 0,
                          onlineCount: 0,
                          onegateCount: 0,
                          month: Number(indexMonth),
                          year: Number(param.params['year']),
                          betimesCount: 0,
                          cancelledCount: 0,
                          deniedCount: 0,
                          doneCount: 0,
                          insideCount: 0,
                          interoperatingCount: 0,
                          ontimeCount: 0,
                          ontimePercentage: 0,
                          outsideCount: 0,
                          overdueCount: 0,
                          overtimeCount: 0,
                          overtimeInside: 0,
                          overtimeOutside: 0,
                          processCount: 0,
                          receivedCount: 0,
                          releasingCount: 0,
                          remainingCount: 0,
                          totalCount: 0,
                          undueCount: 0,
                          unresolvedCount: 0
                        }
                        serializable['data'] = serializable['data'].concat([group])
                      }
                    }
                  }
                }
              }
            }
            // 
            if (param.params.hasOwnProperty('month') && String(param.params['month']) !== 'undefined' && param.params['agency'] !== 'total' 
              && param.params.hasOwnProperty('domain') && param.params['domain'] === 'total' && state.groupConfig) {
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
                  let childs = state.groupConfig[groupCode][1].split(',')
                  for (let index2 in childs) {
                    // resultData[index]['processingCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['processingCount']) + Number(childsData(childs[index2])[0]['processingCount']) : resultData[index]['processingCount']
                    // resultData[index]['waitingCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['waitingCount']) + Number(childsData(childs[index2])[0]['waitingCount']) : resultData[index]['waitingCount']
                    // resultData[index]['releaseCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['releaseCount']) + Number(childsData(childs[index2])[0]['releaseCount']) : resultData[index]['releaseCount']
                    // resultData[index]['onlineCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['onlineCount']) + Number(childsData(childs[index2])[0]['onlineCount']) : resultData[index]['onlineCount']
                    // resultData[index]['onegateCount'] = childsData(childs[index2])[0] ? Number(resultData[index]['onegateCount']) + Number(childsData(childs[index2])[0]['onegateCount']) : resultData[index]['onegateCount']
                    for (let prop in resultData[index]) {
                      if (String(prop).indexOf('Count') > 0) {
                        resultData[index][prop] = childsData(childs[index2])[0] ? Number(resultData[index][prop]) + Number(childsData(childs[index2])[0][prop]) : resultData[index][prop]
                      }
                    }
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
            } else if (param.params.hasOwnProperty('month') && String(param.params['month']) === 'undefined' && param.params['agency'] !== 'total' 
              && param.params.hasOwnProperty('domain') && param.params['domain'] === 'total' && state.groupConfig) {
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
                    let childs = state.groupConfig[groupCode][1].split(',')
                    for (let index2 in childs) {
                      // if (groupCode === 'BGTVT-CDTND') {
                      //   console.log('resultOutput', resultData[index]['month'], childs[index2], childsData(childs[index2]))
                      // }
                      let childMonth = childsData(childs[index2]).filter(function (item) {
                        return item['month'] === resultData[index]['month']
                      })
                      resultData[index]['receivedCount'] = childMonth[0] ? Number(resultData[index]['receivedCount']) + Number(childMonth[0]['receivedCount']) : resultData[index]['receivedCount']
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
            // 
          }).catch(function (error) {
            console.log(error)
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
    groupAgency ({state}, data) {
      return
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
    }
  }
})
