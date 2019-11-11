<template>
  <div style="height: 100%;">
    <v-layout row wrap>
      <v-flex xs12 sm9 class="pr-3">
        <v-layout row wrap style="background-color: #ffff;">
          <v-flex class="xs12" style="
            background-color: #004b94 !important;
            height: 36px;
            padding: 9px 15px;
            font-weight: 600;
            color: white;">
            <span>Đánh giá hài lòng của người sử dụng đối với dịch vụ công trực tuyến mức độ 3 và 4</span>
            <div class="d-inline-block right" style="margin-top: -5px;">
              <v-tooltip top>
                <v-btn icon class="mx-0 my-0" slot="activator" @click="goToBaoCao">
                  <v-icon size="20" color="white">assignment</v-icon>
                </v-btn>
                <span>Báo cáo chi tiết</span>
              </v-tooltip>
            </div>
          </v-flex>
          <v-layout row wrap class="filter_menu my-4">
            <v-flex xs6 sm4 class="mx-3" v-if="agencyLists.length > 1">
              <v-autocomplete
                :items="agencyLists"
                v-model="govAgency"
                label="Chọn đơn vị"
                item-text="text"
                item-value="value"
                @change="getStatistic"
                >
              </v-autocomplete>
            </v-flex>

            <v-flex xs12 sm2 class="mx-3" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
              <datetime-picker
                v-if="item['type'] === 'date' && showPicker"
                v-model="data[item.key]" 
                :item="item" 
                :data-value="data[item.key]"
                :data-all="data"
                :label="true"
                @change="reloadPickerChange(item.key)">
              </datetime-picker>
              <v-text-field 
                v-if="item['type'] === 'text'"
                v-model="data[item.key]" 
                :label="item['label']">
              </v-text-field>
              <v-select
                v-if="item['type'] === 'select'"
                :items="item['source']"
                v-model="data[item.key]"
                :label="item['label']"
                item-value="value"
                item-text="name"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-flex xs12 sm12 class="my-3" v-if="loading">
            <content-placeholders>
              <content-placeholders-text :lines="5" />
            </content-placeholders>
          </v-flex>
          
          <v-flex xs12 sm12 class="my-3 pl-3" v-if="hasData && !loading && votingItemsCLDV.length > 0">
            <div v-for="(item, index) in votingItemsCLDV" style="margin-bottom: 5px;" :key="index">
              <v-layout wrap class="text-bold mb-3">
                <div class="flex px-3 py-1" style="height:26px;max-width:70px;background-color: #034687;transform: skew(-25deg)">
                  <span class="d-block white--text" style="transform: skew(25deg)">Câu {{index + 1}} : </span>
                </div>
                <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                  {{ item.votingSubject }}
                </div>
              </v-layout>
              <div class="ml-4">
                <v-card flat class="pl-2">
                  <v-card-text class="px-2 py-1 pr-0">
                    <v-flex xs12 class="mb-2">
                      <v-layout wrap>
                        <div class="d-inline-block" style="width:120px"><span class="">Rất hài lòng</span> </div>
                        <progress-bar class="d-inline-block" style="width:300px;z-index:10000" size="16" :spacing="1" bar-transition="all 1s ease"
                        :val="item.percentVeryGood" text="" bg-color="#e0e0e0" bar-color="#2196f3"></progress-bar>
                        <div class="d-inline-block pl-3" style="width:120px; color:#034687">
                          <span class="text-bold">{{item.veryGoodCount}}</span>
                          <span> / {{item.totalVoted}} lượt</span>
                        </div>
                      </v-layout>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 class="mb-2">
                      <v-layout wrap>
                        <div class="d-inline-block" style="width:120px"><span class="">Hài lòng</span> </div>
                        <progress-bar class="d-inline-block" style="width:300px;z-index:10000" size="16" :spacing="1" bar-transition="all 1s ease"
                        :val="item.percentGood" text="" bg-color="#e0e0e0" bar-color="#2196f3"></progress-bar>
                        <div class="d-inline-block pl-3" style="width:120px;color:#034687">
                          <span class="text-bold">{{item.goodCount}}</span>
                          <span> / {{item.totalVoted}} lượt</span>
                        </div>
                      </v-layout>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 class="mb-2">
                      <v-layout wrap>
                        <div class="d-inline-block" style="width:120px"><span class="">Không hài lòng</span> </div>
                        <progress-bar class="d-inline-block" style="width:300px;z-index:10000" size="16" :spacing="1" bar-transition="all 1s ease"
                        :val="item.percentBad" text="" bg-color="#e0e0e0" bar-color="#2196f3"></progress-bar>
                        <div class="d-inline-block pl-3" style="width:120px;color:#034687">
                          <span class="text-bold">{{item.badCount}}</span>
                          <span> / {{item.totalVoted}} lượt</span>
                        </div>
                      </v-layout>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-flex>
          <v-flex class="mx-3 xs12 my-4" v-if="(!hasData && !loading) || votingItemsCLDV.length === 0">
            <v-alert :value="true" outline color="info" icon="info">
              Không có dữ liệu đánh giá.
            </v-alert>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 sm3 style="background-color: #ffff;">
        <div >
          <div class="" style="
            background-color: #004b94 !important;
            height: 36px;
            padding: 9px 15px;
            font-weight: 600;
            color: white;">
            Chỉ số đánh giá việc giải quyết thủ tục hành chính
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
                  <v-flex xs7 class="text-xs-center">
                    <span class="black--text">Chỉ số {{index + 1}}:</span>
                    <span class="blue--text">&nbsp; &nbsp;{{item.answersCount ? item.averageScore + ' / 2 điểm' : 'Chưa có đánh giá'}}</span>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-card-text>
          </v-card>
        </div>
      </v-flex>
      <v-flex xs12 sm1>
      </v-flex>
    </v-layout>
    
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
