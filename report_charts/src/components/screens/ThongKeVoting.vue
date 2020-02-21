<template>
  <div style="height: 100%;">
    <v-layout row wrap>
      <v-flex xs12 sm3>
        <v-card flat color="#ffffff" class="px-2 py-2">
          <v-flex xs12 class="mb-2" v-if="agencyLists.length > 1">
            <v-autocomplete
            :items="agencyLists"
            v-model="govAgency"
            item-text="text"
            item-value="value"
            @change="changeAgency"
            class="input-outline"
            >
            </v-autocomplete>
          </v-flex>
          <v-layout row wrap>
            <v-flex xs6 :class="indexTool%2 === 1 ? 'pl-3' : ''" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
              <datetime-picker
                v-if="item['type'] === 'date' && showPicker"
                v-model="data[item.key]"
                :item="item"
                :data-value="data[item.key]"
                :data-all="data"
                @change="reloadPickerChange(item.key)"
                class="input-outline"
              >
              </datetime-picker>
            </v-flex>
          </v-layout>
        </v-card>
        <v-divider class="my-0 py-0"></v-divider>
        <v-list class="py-2 employeeList" style="max-height: 500px;overflow-y: auto;">
          <v-list-tile
            v-for="item in employeeItems"
            :key="item.employeeId"
            avatar
            class="py-1 px-2"
            :style="item.employeeId === employeeSelected.employeeId ? 'background: #b9e8ff63' : ''"
            @click="changeEmployee(item)"
          >
            <v-list-tile-avatar>
              <v-avatar size="36" color="#004b94">
                <v-icon size="37" dark>account_circle</v-icon>
              </v-avatar>
            </v-list-tile-avatar>

            <v-list-tile-content class="pl-3">
              <v-list-tile-sub-title>
                <span :style="item.employeeId === employeeSelected.employeeId ? 'color:#004b94' :'color:black'">
                  {{item.titleJobpos ? item.titleJobpos : 'Cán bộ tiếp nhận'}}
                </span>
              </v-list-tile-sub-title>
              <v-list-tile-title>
                <span class="text-bold" :style="item.employeeId === employeeSelected.employeeId ? 'color:#004b94;font-size:14px' :'font-size:14px'">{{item.fullName}}</span>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider class="my-0 py-0"></v-divider>
        <v-btn depressed small color="primary" class="white--text mx-0" @click="showReportDossier" style="width:100%">
          Tình hình xử lý hồ sơ của cơ quan &nbsp; <v-icon>double_arrow</v-icon>
        </v-btn>
        <v-divider class="my-0 py-0"></v-divider>
      </v-flex>

      <v-flex xs12 sm9 class="pl-3">
        <div class="row-header">
          <div class="background-triangle-big"> 
            <span v-if="!reportDossier"> KẾT QUẢ ĐÁNH GIÁ</span>
            <span v-else> THỐNG KÊ TÌNH HÌNH XỬ LÝ HỒ SƠ</span>
          </div>
          <div class="layout row wrap header_tools row-blue"> 
          </div> 
        </div>
        <v-card flat class="py-4" v-if="!reportDossier">
          <v-layout wrap class="px-3">
            <v-flex class="" style="text-align: center!important;max-height: 200px;width: 150px">
              <img v-if="employeeSelected['imgSrc']" :src="employeeSelected['imgSrc']" 
              style="width: 100%;max-width: 150px;height: 170px;object-fit: contain;background: #ddd"/>
              <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" 
              style="width: 100%;max-width: 150px;height: 170px;object-fit: contain;opacity:0.6;background: #ddd"/>
            </v-flex>
            <v-flex class="pl-4" style="word-wrap: break-word;position:relative;width: calc(100% - 150px)">
              <div class="primary--text">
                <span class="text-bold">{{govAgencyName}} | </span>
                <span>{{employeeSelected.jobPosTitle ? employeeSelected.jobPosTitle : 'Cán bộ'}}</span>
              </div>
              <div class="text-bold primary--text text-bold mt-2" style="font-size:26px">{{employeeSelected.fullName}}</div>
              <div class="mb-5"></div>
              <div class="my-2"><span class="text-bold">Email: </span> {{employeeSelected.email}}</div>
              <div class="mb-2"><span class="text-bold">Số điện thoại: </span> {{employeeSelected['telNo'] ? employeeSelected['telNo'] : employeeSelected['mobile']}}</div>
            </v-flex>
          </v-layout>
          <div style="position:absolute;top:15px;right:15px">
            <star-rating read-only :rating="employeeSelected['score']" :increment="0.1" :max-rating="5" :show-rating="false" :star-size="30" ></star-rating>
            <div class="text-bold primary--text pl-2">{{employeeSelected['totalVoting']}} lượt đánh giá</div>
          </div>
          <div class="">
            <div class="mt-4 pl-3 primary--text text-bold" style="font-size:16px">TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ CÁN BỘ ({{data['fromStatisticDate']}} - {{data['toStatisticDate']}})</div>
            <v-data-table
              :headers="headers"
              :items="votingList"
              hide-actions
              class="table-landing table-bordered mt-4 mx-3"
              style="border-left: 1px solid #dedede;"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-left pt-2">
                    <div>
                      <span>{{props.item.subject}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center pt-2" style="min-width: 100px">
                    <div>
                      <span>{{props.item.totalVoting}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center pt-2" style="min-width: 135px">
                    <div>
                      <span>{{props.item.percentVeryGood}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center pt-2" style="min-width: 135px">
                    <div>
                      <span>{{props.item.percentGood}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center pt-2" style="min-width: 150px">
                    <div>
                      <span>{{props.item.percentBad}}</span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-card>
        <v-card v-else>
          <v-layout wrap class="pt-3">
            <v-flex xs6 class="text-center">
              <span class="text-bold"> BỘ GIAO THÔNG VẬN TẢI </span><br/>
              <span>{{govAgencyName}}</span>
              <hr align="center" width="120px" style="margin: auto;">
            </v-flex>
            <v-flex xs6 class="text-center">
              <span class="text-bold"> CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM </span><br/>
              <span>Độc lập - Tự do - Hạnh phúc </span>
              <hr align="center" width="120px" style="margin: auto;">
            </v-flex>
            <v-flex xs12 class="text-center mt-5" style="font-size:14px">
              <span class="text-bold">THỐNG KÊ TÌNH HÌNH XỬ LÝ HỒ SƠ CỦA CƠ QUAN</span> <br/>
              <span>Từ ngày {{data['fromStatisticDate']}} đến ngày {{data['toStatisticDate']}}</span>
            </v-flex>
          </v-layout>
          <div class="pb-3">
            <v-data-table
              :headers="headersReport"
              :items="listDossierEmployeeFilter"
              hide-actions
              class="table-landing table-bordered mt-4 mx-3"
              style="border-left: 1px solid #dedede;"
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-center py-2" style="width: 65px;height: 36px">
                    <div>
                      <span>{{ pageNumber * 10 - 10 + props.index + 1 }}</span>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" style="height: 36px">
                    <div>
                      <span>{{props.item.fullName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" style="height: 36px">
                    <div>
                      <span>{{props.item.jobPosName ? props.item.jobPosName : 'Cán bộ'}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center py-2" style="height: 36px">
                    <div>
                      <span>{{Number(props.item.overdue) + Number(props.item.undue)}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center py-2" style="height: 36px">
                    <div>
                      <span>{{props.item.undue}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center py-2" style="height: 36px">
                    <div>
                      <span>{{props.item.overdue}}</span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div class="text-xs-right layout wrap mx-2" style="position: relative;" v-if="listDossierEmployee.length > 10">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="listDossierEmployee.length" nameRecord="cán bộ" :page="pageNumber" :numberPerPage="10" :showLimit="false" custom-class="custom-tiny-class" 
                 @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import DatetimePicker from './DatetimePicker.vue'
import StarRating from 'vue-star-rating'
import TinyPagination from './pagination'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index'],
  components: {
    DatetimePicker,
    StarRating,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    reportDossier: false,
    loading: false,
    agencyLists: [],
    filterConfig: '',
    filters: [],
    govAgency: 0,
    hasData: true,
    data: {},
    showPicker: true,
    totalEmployee: 0,
    employeeItems: [],
    employeeSelected: '',
    votingList: '',
    headers: [
      {
        text: 'Câu hỏi',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số lượt đánh giá',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tỷ lệ rất hài lòng (%)',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tỷ lệ hài lòng (%)',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tỷ lệ không hài lòng (%)',
        align: 'center',
        sortable: false
      }
    ],
    headersReport: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Cán bộ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chức vụ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tổng số hồ sơ đã xử lý',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đúng hạn',
        align: 'center',
        sortable: false
      },
      {
        text: 'Quá hạn',
        align: 'center',
        sortable: false
      }
    ],
    listDossierEmployee: [],
    listDossierEmployeeFilter: [],
    reportDossierTotal: 0,
    pageNumber: 1
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    indexReport () {
      return this.$store.getters.getIndexReport
    },
    govAgencyName () {
      let vm = this
      let name = vm.agencyLists.filter(function(item) {
        return item['value'] === vm.govAgency
      })
      if (name && name[0] && name[0].hasOwnProperty('text')) {
        return name[0]['text']
      } else {
        return ''
      }
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      let filter = {
        reportCode: 'STATISTIC_09'
      }
      vm.$store.dispatch('getDynamicReports', filter).then(function (result) {
        vm.filterConfig = eval('( ' + result['filterConfig'] + ' )')
        if (vm.filterConfig.hasOwnProperty('groupIds')) {
          vm.agencyLists = vm.filterConfig['groupIds']
          if (vm.agencyLists.length > 0) {
            let defaultVal = vm.agencyLists[0]['value']
            for (let key in vm.agencyLists) {
              if (vm.agencyLists[key]['selected']) {
                defaultVal = vm.agencyLists[key]['value']
                break
              }
            }
            if (query.hasOwnProperty('groupId') && query['groupId']) {
              vm.govAgency = Number(query['groupId'])
            } else {
              vm.govAgency = defaultVal
            }
            let agencyCode = vm.agencyLists.filter(function(item) {
              return (String(item['value']) === String(vm.govAgency))
            })[0]['code']
            let filter = {
              groupId: vm.govAgency,
              jobposCode: 'DANHGIA_' + agencyCode
            }
            vm.getEmployee(filter)
          }
        }
        if (vm.filterConfig.hasOwnProperty('filters')) {
          vm.filters = vm.filterConfig['filters']
        }
        for (let key in vm.filters) {
          if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {
            vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
            if (vm.filters[key]['type'] === 'date' && query.hasOwnProperty(vm.filters[key]['key']) && query[vm.filters[key]['key']]) {
              vm.data[vm.filters[key]['key']] = query[vm.filters[key]['key']]
            }
          }
        }
        // vm.getStatistic()
      })
    })
  },
  mounted () {
    let vm = this
    vm.$nextTick(function () {
      $('#app_report_charts .application--wrap').css('max-width', '1500px')
    })
  },
  watch: {
  },
  methods: {
    showReportDossier () {
      let vm = this
      vm.reportDossier = true
      vm.getReportDossierEmployee()
    },
    reloadPickerChange (key) {
      let vm = this
      vm.showPicker = false
      setTimeout(() => {
        vm.data[key] = new Date(vm.data[key]).toLocaleDateString('vi-VN')
        vm.showPicker = true
        vm.getVotingEmployee(vm.employeeSelected)
        if (vm.reportDossier) {
          vm.getReportDossierEmployee()
        }
      }, 200)
    },
    changeAgency () {
      let vm = this
      setTimeout(function () {
        let agencyCode = vm.agencyLists.filter(function(item) {
          return (String(item['value']) === String(vm.govAgency))
        })[0]['code']
        let filter = {
          groupId: vm.govAgency,
          jobposCode: 'DANHGIA_' + agencyCode
        }
        vm.getEmployee(filter)
        if (vm.reportDossier) {
          vm.getReportDossierEmployee()
        }
      }, 200)
    },
    changeEmployee (item) {
      let vm = this
      vm.reportDossier = false
      vm.employeeSelected = item
      vm.getVotingEmployee(vm.employeeSelected)
      vm.getAvatar(vm.employeeSelected)
    },
    getEmployee (filter) {
      let vm = this
      let sortEmployee = function (employeeList) {
        function compare (a, b) {
          if (a.employeeNo < b.employeeNo) {
            return -1
          } else if (a.employeeNo > b.employeeNo) {
            return 1
          } else {
            return 0
          }
        }
        return employeeList.sort(compare)
      }
      vm.$store.dispatch('getEmployee', filter).then(result => {
        vm.totalEmployee = result[0]
        vm.employeeItems = sortEmployee(result[1])
        if (vm.employeeItems && vm.employeeItems.length > 0) {
          vm.employeeSelected = vm.employeeItems[0]
          vm.getVotingEmployee(vm.employeeItems[0])
          vm.getAvatar(vm.employeeItems[0])
        } else {
          vm.employeeSelected = ''
        }
      }).catch(xhr => {
        vm.totalEmployee = 0
        vm.employeeItems = []
      })
    },
    getVotingEmployee (item) {
      let vm = this
      vm.$store.dispatch('loadVotingEmployee', {
        className: 'employee',
        classPk: item.employeeId,
        groupId: vm.govAgency,
        fromVotingDate: vm.data['fromStatisticDate'],
        toVotingDate: vm.data['toStatisticDate']
      }).then(result => {
        vm.votingList = result
        vm.getScoreVoting()
      }).catch(xhr => {
      })
    },
    getAvatar (item) {
      let vm = this
      let filter = {
        employeeId: item.employeeId,
        groupId: vm.govAgency
      }
      vm.$store.dispatch('loadImageEmployee', filter).then(function (data) {
        if (data !== '' && data !== null) {
          let portalURL = ''
          if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
            portalURL = window.themeDisplay.getPortalURL()
          }
          vm.employeeSelected['imgSrc'] = portalURL + data
        }
      }).catch(function (data) {
        vm.employeeSelected['imgSrc'] = ''
      })
    },
    getScoreVoting () {
      let vm = this
      if (vm.votingList && vm.votingList.length > 0) {
        let totalAll = 0
        let totalVoting = 0
        let totalScore = 0
        let lengthQuestion = vm.votingList.length
        for (var i = 0; i < lengthQuestion; i++) {
          totalAll += vm.votingList[i]['answersCount']
          totalVoting = vm.votingList[i]['answersCount']
          let lengthAnswer = vm.votingList[i]['answers'].length
          if (totalVoting === 0) {
            vm.votingList[i]['totalVoting'] = totalVoting
            vm.votingList[i]['percentBad'] = 0
            vm.votingList[i]['percentGood'] = 0
            vm.votingList[i]['percentVeryGood'] = 0
          } else {
            vm.votingList[i]['totalVoting'] = totalVoting
            vm.votingList[i]['percentBad'] = Number(((Number(vm.votingList[i]['answers'][2])/Number(totalVoting))*100).toFixed(0))
            vm.votingList[i]['percentGood'] = Number(((Number(vm.votingList[i]['answers'][1])/Number(totalVoting))*100).toFixed(0))
            vm.votingList[i]['percentVeryGood'] = Number(100 - Number(vm.votingList[i]['percentBad']) - Number(vm.votingList[i]['percentGood']))
          }
          for (var j = 0; j < lengthAnswer; j++) {
            totalScore += Number(vm.votingList[i]['answers'][j] * (lengthAnswer - j))
          }
        }
        vm.employeeSelected['totalVoting'] = totalAll
        let lengthScore = vm.votingList[0]['answers'].length
        vm.employeeSelected.score = Number(((totalScore * 5) / (totalAll * lengthScore)).toFixed(1))
      }
    },
    getStatistic () {
      let vm = this
      setTimeout (function () {
        vm.loading = true
        let filter = {
          groupId: vm.govAgency ? vm.govAgency : window.themeDisplay.getScopeGroupId(),
          data: vm.data,
          api: vm.filterConfig['api']
        }
        vm.$store.dispatch('getDataReports', filter).then(function (result) {
          if (result) {
            vm.formatData(result, filter['groupId'])
            vm.hasData = true
          } else {
            vm.hasData = false
          }
          vm.loading = false
        }).catch(function () {
          vm.hasData = false
          vm.loading = false
        })
      }, 200)
    },
    getReportDossierEmployee () {
      let vm = this
      setTimeout (function () {
        let filter = {
          groupId: vm.govAgency ? vm.govAgency : window.themeDisplay.getScopeGroupId(),
          from: vm.data['fromStatisticDate'],
          to: vm.data['toStatisticDate']
        }
        vm.$store.dispatch('getReportDossierEmployee', filter).then(function (result) {
          vm.listDossierEmployee = result
          vm.pageNumber = 1
          vm.listDossierEmployeeFilter = vm.listDossierEmployee.slice(0, 10)
        }).catch(function () {
          vm.listDossierEmployee = []
          vm.listDossierEmployeeFilter = []
        })
      }, 200)
    },
    formatData (data, groupId) {
      let vm = this
      let dataAgency = data.filter(function(item) {
        return (String(item['groupId']) === String(groupId) && item['govAgencyCode'])
      })
      let votingItems = {}
      for (let key in dataAgency) {
        if (votingItems.hasOwnProperty(dataAgency[key]['votingCode'])) {
          votingItems[dataAgency[key]['votingCode']].push(dataAgency[key])
        } else {
          votingItems[dataAgency[key]['votingCode']] = []
          votingItems[dataAgency[key]['votingCode']].push(dataAgency[key])
        }
      }
      let votingItemsGroup = []
      for (let key in votingItems) {
        if (votingItems[key].length > 1) {
          let item = {
            badCount: 0,
            goodCount: 0,
            veryGoodCount: 0,
            govAgencyCode: votingItems[key][0]['govAgencyCode'],
            govAgencyName: votingItems[key][0]['govAgencyName'],
            groupId: votingItems[key][0]['groupId'],
            percentBad: 0,
            percentGood: 0,
            percentVeryGood: 0,
            totalVoted: 0,
            votingCode: votingItems[key][0]['votingCode'],
            votingSubject: votingItems[key][0]['votingSubject']
          }
          for (let key2 in votingItems[key]) {
            item['badCount'] += Number(votingItems[key][key2]['badCount'])
            item['goodCount'] += Number(votingItems[key][key2]['goodCount'])
            item['veryGoodCount'] += Number(votingItems[key][key2]['veryGoodCount'])
            item['totalVoted'] += (Number(votingItems[key][key2]['badCount']) + Number(votingItems[key][key2]['goodCount']) + Number(votingItems[key][key2]['veryGoodCount']))
          }
          item['percentBad'] = Number(((Number(item['badCount'])/Number(item['totalVoted']))*100).toFixed(0))
          item['percentGood'] = Number(((Number(item['goodCount'])/Number(item['totalVoted']))*100).toFixed(0))
          item['percentVeryGood'] = Number(100 - Number(item['percentBad']) - Number(item['percentGood']))
          votingItemsGroup.push(item)
        } else {
          votingItemsGroup.push(votingItems[key][0])
        }
      }
      console.log('votingItemsGroup', votingItemsGroup)
      vm.votingItemsCLDV = votingItemsGroup
    },
    getPercent (answers, index) {
      let totalVoted = 0
      let percent = 0
      for (var i = 0; i < answers.length; i++) {
        totalVoted += answers[i]
      }
      percent = ((answers[index] / totalVoted) * 100).toFixed(1)
      return percent
    },
    getPercentItem (votingItemsTTHC, index) {
      let vm = this
      let votingPercent = []
      let lengthVotingAnswer = votingItemsTTHC['answers'].length
      let totalScore = 0
      for (var i = lengthVotingAnswer - 1; i >= 0; i--) {
        totalScore += Number(votingItemsTTHC['answers'][i]*(lengthVotingAnswer - i - 1))
        let indexAnswer = lengthVotingAnswer - i - 1
        let result = {
          name: 'Điểm ' + indexAnswer,
          count: Number(votingItemsTTHC['answersCount']),
          percent: Number(((Number(votingItemsTTHC['answers'][i]) / Number(votingItemsTTHC['answersCount'])) * 100).toFixed(1))
        }
        votingPercent.push(result)
      }
      vm.votingItemsTTHC[index]['answerPercent'] = votingPercent.reverse()
      vm.votingItemsTTHC[index]['averageScore'] = (Number(totalScore) / Number(votingItemsTTHC['answersCount'])).toFixed(1)
    },
    getPercentTotal (votingItemsTTHC) {
      let vm = this
      if (votingItemsTTHC && votingItemsTTHC.length > 0) {
        let votingPercent = []
        let totalAnswer = 0
        for (var i = votingItemsTTHC[0]['answers'].length - 1; i >= 0; i--) {
          // let result = {
          //   name: 'Điểm ' + (i + 1),
          //   count: 0,
          //   percent: 0
          // }
          let result = {
            name: 'Điểm ' + (i),
            count: 0,
            percent: 0
          }
          votingPercent.push(result)
        }
        for (var j = votingItemsTTHC.length -1 ; j >= 0; j--) {
          totalAnswer += votingItemsTTHC[j]['answersCount']
          let itemAnswer
          for (var k = votingItemsTTHC[j]['answers'].length - 1; k >= 0; k--) {
            votingPercent[k]['count'] += votingItemsTTHC[j]['answers'][k]
          }
        }
        // for (var i = votingPercent.length - 1; i >= 0; i--) {
        //   totalAnswer += votingPercent[i]['count']
        // }
        for (var i = votingPercent.length - 1; i >= 0; i--) {
          if (totalAnswer) {
            let percent = ((votingPercent[i]['count'] / totalAnswer) * 100).toFixed(0)
            votingPercent[i]['percent'] = percent
          } else {
            votingPercent[i]['percent'] = 0
          }
        }
        vm.totalAnswer = totalAnswer
        vm.resultTotal = votingPercent
        // console.log('votingPercent', votingPercent)
      }
    },
    paggingData (config) {
      let vm = this
      vm.pageNumber = config.page
      vm.listDossierEmployeeFilter = vm.listDossierEmployee.slice((config.page - 1)*10, config.page*10)
    }
  },
  filters: {
  }
}
</script>
