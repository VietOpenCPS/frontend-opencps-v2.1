<template>
  <div style="height: 100%;">
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 sm3 >
              <div style="background-color: #ffff; padding-bottom: 1px;">
                <div class="" style="
                  background-color: #004b94 !important;
                  height: 36px;
                  padding: 9px 15px;
                  font-weight: 600;
                  color: white;">
                  Chỉ số đánh giá việc giải quyết TTHC
                </div>
                <v-card color="#ffffff" flat class=" px-2 py-2 mt-3" style="border-radius: 7px;">
                  <v-card-text class="px-2 py-1 pr-0 ">
                    <div class="text-xs-center text-bold" style="color:#034687">Tổng số lượt đánh giá</div>
                    <div class="text-xs-center" style="color:#034687"> trong năm {{(new Date()).getFullYear()}}</div>
                    <div class="text-xs-center text-bold orange--text" style="font-size:42px;line-height: 50px;">{{totalAnswer}}</div>
                    <div class="text-xs-center black--text">lượt đánh giá</div>
                  </v-card-text>
                </v-card>
                <v-card color="#b3e5fc7a" flat class="mx-3 py-2 my-4" style="border-radius: 15px;">
                  <v-card-text class="py-1 pr-0">
                    <div class="text-xs-center text-bold" style="color:#034687">Kết quả đánh giá các chỉ số</div>
                    <div class="text-xs-center" style="color:#034687">Năm {{(new Date()).getFullYear()}}</div>
                    <v-flex xs12 v-for="(item, index) in votingItemsTTHC" :key="index" class="white--text mt-2">
                      <v-layout row justify-center>
                        <v-flex xs12 class="text-xs-center">
                          <span class="black--text">Chỉ số {{index + 1}}:</span>
                          <span class="blue--text">&nbsp; &nbsp;{{item.answersCount ? item.averageScore + ' / 2 điểm' : 'Chưa có đánh giá'}}</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </div>
            </v-flex>
            <v-flex xs12 sm9 class="pl-4" style="padding-top: 8px;">
                <v-layout v-for="(item, index) in votingItemsTTHC" :key="index" class="mb-3" row wrap  style="background-color: #ffff;">
                    <v-flex v-if="reRender" class="xs12" style="
                        background-color: #004b94 !important;
                        height: 36px;
                        padding: 9px 15px;
                        font-weight: 600;
                        color: white;">
                        <span>Chi tiết chỉ số {{index + 1}}</span>
                        <v-btn v-if="(index === 4 || index === 5 || index === 7 || index === 8) && !item['isEdit']" color="green" dark small class="right"
                          @click="updateVotingEmp(item, index)" style="margin-top: -6px; margin-right: -12px;"
                        >
                          <v-icon :size="18">edit</v-icon> &nbsp; Cập nhật
                        </v-btn>
                        <v-btn v-if="(index === 4 || index === 5 || index === 7 || index === 8) && item['isEdit']" color="green" dark small class="right"
                          @click="submitUpdateVoting(item, index)" style="margin-top: -6px; margin-right: -12px;"
                          :loading="btnLoading" :disabled="btnLoading"
                        >
                          <v-icon :size="18">save</v-icon> &nbsp; Lưu
                        </v-btn>
                        <v-btn v-if="(index === 4 || index === 5 || index === 7 || index === 8) && item['isEdit']" color="green" dark small class="right"
                          @click="exitUpdate(item, index)" style="margin-top: -6px;"
                          :loading="btnLoading" :disabled="btnLoading"
                        >
                          <v-icon :size="18">clear</v-icon> &nbsp; Thoát
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 class="my-3 pl-3">
                        <div style="margin-bottom: 5px;">
                            <div class="ml-4">
                                <v-card flat class="pl-2">
                                <v-card-text class="px-2 py-1 pr-0">
                                  <v-flex xs12><strong class="primary--text">{{item.subject}}</strong></v-flex>
                                  <v-flex xs12>
                                    <v-layout wrap class="check-update">
                                        <v-flex xs12 md4>
                                            <p class="headline primary--text">
                                              <v-checkbox
                                                v-if="votingUpdate === index && reRender && item['isEdit']"
                                                v-model="item['selected'][0]"
                                                color="success"
                                                :value="true"
                                                hide-details
                                                class="mt-0 d-inline-block"
                                                @change="changeSelectedUpdate($event, index, 0)"
                                              ></v-checkbox>
                                              <span :class="item['isEdit'] ? 'right mr-2' : ''">{{item['answers'][0]}}</span>
                                            </p>
                                            <p :style="item['selected'][0] ? 'color: green;font-weight: 500;text-align: justify' : 'text-align: justify'">{{item['choices'][0]}}</p>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                            <p class="headline primary--text">
                                              <v-checkbox
                                                v-if="votingUpdate === index && reRender && item['isEdit']"
                                                v-model="item['selected'][1]"
                                                color="success"
                                                hide-details
                                                class="mt-0 d-inline-block"
                                                @change="changeSelectedUpdate($event, index, 1)"
                                              ></v-checkbox>
                                              <span :class="item['isEdit'] ? 'right mr-2' : ''">{{item['answers'][1]}}</span>
                                            </p>
                                            <p :style="item['selected'][1] ? 'color: green;font-weight: 500;text-align: justify' : 'text-align: justify'">{{item['choices'][1]}}</p>
                                        </v-flex>
                                        <v-flex xs12 md4>
                                            <p class="headline primary--text">
                                              <v-checkbox
                                                v-if="votingUpdate === index && reRender && item['isEdit']"
                                                v-model="item['selected'][2]"
                                                color="success"
                                                hide-details
                                                class="mt-0 d-inline-block"
                                                @change="changeSelectedUpdate($event, index, 2)"
                                              ></v-checkbox>
                                              <span :class="item['isEdit'] ? 'right mr-2' : ''">{{item['answers'][2]}}</span>
                                            </p>
                                            <p :style="item['selected'][2] ? 'color: green;font-weight: 500;text-align: justify' : 'text-align: justify'">{{item['choices'][2]}}</p>
                                        </v-flex>
                                    </v-layout>
                                  </v-flex>
    
                                </v-card-text>
                                </v-card>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import DatetimePicker from './DatetimePicker.vue'
import ProgressBar from 'vue-simple-progress'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index'],
  components: {
    DatetimePicker,
    ProgressBar
  },
  data: () => ({
    loading: false,
    reRender: true,
    votingUpdate: '',
    votingItemsTTHC: [],
    votingItemsCLDV: [],
    agencyLists: [],
    filterConfig: '',
    filters: [],
    govAgency: 0,
    hasData: true,
    data: {},
    btnLoading: false,
    showPicker: true,
    showCaptcha: false,
    barColor: ['#5cb85c', '#f0ad4e', '#d9534f', '#2e4fc8', '#2ec8bad9', '#142f14'],
    dialog_voting_result: false,
    resultTotal: [],
    totalAnswer: 0
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    indexReport () {
      return this.$store.getters.getIndexReport
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      // 
      vm.$store.dispatch('loadVoting', {
        className: 'survey',
        classPk: 0
      }).then(result => {
        vm.votingItemsTTHC = result
        vm.totalAnswer = 0
        for (let i = 0; i < vm.votingItemsTTHC.length; i++) {
          vm.totalAnswer += Number(vm.votingItemsTTHC[i]['answersCount'])
          vm.votingItemsTTHC[i]['selected'] = [false, false, false]
          vm.votingItemsTTHC[i]['isEdit'] = false
          vm.getPercentItem(vm.votingItemsTTHC[i], i)
        }
      }).catch(xhr => {
      })
      // +-+
      let filter = {
        reportCode: 'STATISTIC_05'
      }
      vm.$store.dispatch('getDynamicReports', filter).then(function (result) {
        vm.filterConfig = eval('( ' + result['filterConfig'] + ' )')
        if (vm.filterConfig.hasOwnProperty('groupIdsAdmin')) {
          vm.agencyLists = vm.filterConfig['groupIdsAdmin']
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
        vm.getStatistic()
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
    updateVotingEmp (item, index) {
      let vm = this
      vm.votingUpdate = index
      vm.votingItemsTTHC[index]['isEdit'] = true
      vm.reRender = false
      vm.reRender = true
    },
    exitUpdate (item, index) {
      let vm = this
      vm.votingItemsTTHC[index]['isEdit'] = false
      vm.reRender = false
      vm.reRender = true
    },
    changeSelectedUpdate (value, index, key) {
      let vm = this
      console.log('333333', vm.votingItemsTTHC)
      if (value) {
        for (let key1 in vm.votingItemsTTHC[index]['selected']) {
          if (key == key1) {
            vm.votingItemsTTHC[index]['selected'][key1] = true
          } else {
            vm.votingItemsTTHC[index]['selected'][key1] = false
          }
        }
      }
      console.log('44444', vm.votingItemsTTHC)
      vm.reRender = false
      vm.reRender = true
    },
    submitUpdateVoting (item, index) {
      let vm = this
      vm.votingItemsTTHC[index]['className'] = 'survey' 
      vm.votingItemsTTHC[index]['classPk'] = 0
      let selected = vm.votingItemsTTHC[index]['selected'].findIndex(function(item){return item === true})
      
      if (selected !== -1) {
        vm.btnLoading = true
        vm.votingItemsTTHC[index]['voted'] = selected + 1
        vm.$store.dispatch('submitVotingMC', vm.votingItemsTTHC[index]).then(function () {
          //
          vm.btnLoading = false
          vm.$store.dispatch('loadVoting', {
            className: 'survey',
            classPk: 0
          }).then(result => {
            vm.votingItemsTTHC = result
            vm.totalAnswer = 0
            for (let i = 0; i < vm.votingItemsTTHC.length; i++) {
              vm.totalAnswer += Number(vm.votingItemsTTHC[i]['answersCount'])
              vm.votingItemsTTHC[i]['selected'] = [false, false, false]
              vm.votingItemsTTHC[i]['isEdit'] = false
              vm.getPercentItem(vm.votingItemsTTHC[i], i)
            }
          }).catch(xhr => {
          })
          // +-+
        }).catch(function () {
          vm.btnLoading = false
        })
      } else {
        toastr.error('Vui lòng chọn đánh giá')
      }
    },
    reloadPickerChange (key) {
      let vm = this
      vm.showPicker = false
      setTimeout(() => {
        vm.data[key] = new Date(vm.data[key]).toLocaleDateString('vi-VN')
        vm.showPicker = true
        vm.getStatistic()
      }, 200)
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
    formatData (data, groupId) {
      let vm = this
      let dataAgency = data.filter(function(item) {
        return (String(item['groupId']) === String(groupId) && item['govAgencyCode'] && !item['domain'] && item['votingSubject'])
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
    goToBaoCao () {
      let vm = this
      let fromStatisticDate = vm.data['fromStatisticDate']
      let toStatisticDate = vm.data['toStatisticDate']
      let site = window.themeDisplay.getSiteAdminURL().split('/~')[0].replace('group','web')
      let urlReport = site + '/bao-cao#/bao-cao/' + vm.indexReport + '?reportType=&groupId=' + vm.govAgency + '&fromStatisticDate=' +
      fromStatisticDate + '&toStatisticDate=' + toStatisticDate + '&doreport'
      window.location.href = urlReport
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
        console.log('votingPercent', votingPercent)
      }
    }
  },
  filters: {
  }
}
</script>

