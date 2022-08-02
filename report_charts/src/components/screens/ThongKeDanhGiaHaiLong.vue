<template>
  <div style="height: 100%;">
    <v-container grid-list-md >
        <v-layout row wrap>
            <v-flex xs12 class="pl-4">
                <v-layout row wrap style="background-color: #ffff;">
                    <v-flex class="xs12" style="
                        background-color: #004b94 !important;
                        height: auto;
                        min-height: 36px;
                        padding: 9px 15px;
                        font-weight: 600;
                        color: white;">
                        <span>Kết quả đánh giá sự hài lòng của NLTT khi thực hiện dịch vụ công trực tuyến</span>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout row wrap style="background-color: #ffff;border-top: 1px solid #004b94;" class="pa-2 pt-3">
                          
                          <v-flex xs12 md5 class="my-2 pl-2">
                            <v-menu
                              ref="menuDate1"
                              v-model="menuDate1"
                              :close-on-content-click="true"
                              transition="scale-transition"
                              offset-y
                              full-width
                            >
                              <v-text-field
                              slot="activator"
                              class="search-input-appbar input-search"
                              v-model="fromReceiveDateFormatted"
                              persistent-hint
                              append-icon="event"
                              @blur="fromReceiveDate = parseDate(fromReceiveDateFormatted)"
                              label="Từ ngày"
                              hide-details
                              height="32"
                              min-height="32"
                              >
                              </v-text-field>
                              <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : null" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate()"></v-date-picker>
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 md5 class="my-2 pl-3">
                            <v-menu
                              ref="menuDate2"
                              v-model="menuDate2"
                              :close-on-content-click="true"
                              transition="scale-transition"
                              offset-y
                              full-width
                            >

                              <v-text-field
                              slot="activator"
                              class="search-input-appbar input-search"
                              v-model="toReceiveDateFormatted"
                              persistent-hint
                              append-icon="event"
                              @blur="toReceiveDate = parseDate(toReceiveDateFormatted)"
                              label="Đến ngày"
                              hide-details
                              height="32"
                              min-height="32"
                              ></v-text-field>
                              <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate()"></v-date-picker>
                            </v-menu>
                          </v-flex>
                          <v-flex xs12 md2 class="pl-4">
                            <v-btn class="mx-0" depressed small color="primary" @click="getReportVotingDossier" :loading="btnLoading" :disabled="btnLoading">
                              <v-icon>image_search</v-icon>Xem kết quả
                            </v-btn>
                          </v-flex>
                      </v-layout>
                  </v-flex>
                    <v-flex xs12 sm12 class="mb-3 px-0">
                      <v-card flat>
                        <v-card-text class="reportTable">
                          <table class="my-2" hide-default-footer>
                            <thead>
                              <tr>
                                <th class="text-center px-2">
                                  <span>STT</span>
                                </th>
                                <th class="text-center px-2">
                                  <span>Tiêu chí đánh giá</span>
                                </th>
                                <th class="text-center px-2 py-1">
                                  <span>Lượt đánh giá</span>
                                </th>
                                <th class="text-center px-2 py-1">
                                  <span>Rất hài lòng</span>
                                </th>
                                <th class="text-center px-2 py-1">
                                  <span>Hài lòng</span>
                                </th>
                                <th class="text-center px-2 py-1">
                                  <span>Không hài lòng</span>
                                </th>
                              </tr>
                            </thead>

                            <tbody v-for="(item,index) in statisticDossier" :key="index">
                              <tr>
                                <td align="left" colspan="6"  class="px-2 text-bold">{{item.govAgencyName}}</td>
                              </tr>
                              
                              <tr v-for="(item2,index2) in item['votings']" :key="index2">
                                <td align="center" class="px-2">{{index2 + 1}}</td>
                                <td align="left"  class="px-2">{{item2.title}}</td>
                                <td align="center"  class="px-2">{{item2.countVoteResult}}</td>
                                <td align="center"  class="px-2">{{item2.countVeryGood}}</td>
                                <td align="center"  class="px-2">{{item2.countGood}}</td>
                                <td align="center"  class="px-2">{{item2.countBad}}</td>
                              </tr>
                            </tbody>
                          </table>
                        </v-card-text>
                      </v-card>
                    </v-flex>
                    <!-- <v-flex xs12>
                      <v-btn outline color="primary" @click="back"> 
                          <v-icon>arrow_back</v-icon>  Quay lại
                      </v-btn>
                    </v-flex> -->
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
    statisticDossier: [],
    menuDate1: false,
    fromReceiveDate: '',
    fromReceiveDateFormatted: '',
    menuDate2: false,
    toReceiveDate: '',
    toReceiveDateFormatted: '',
    votingItemsTTHC: [],
    agencyLists: [],
    listThuTuc: [],
    votingItemsDetal: [],
    filterConfig: '',
    filters: [],
    govAgency: '',
    domainCode: '',
    data: {},
    btnLoading: false,
    showPicker: true,
    percentBadTotal: 0,
    percentGoodTotal: 0,
    percentVeryGoodTotal: 0
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
    let vm = this
    vm.$nextTick(function () {
      try {
        vm.agencyLists = agencyList
      } catch (error) {
      }
      vm.toReceiveDateFormatted = vm.currentDateFormat()
      let currentYear = (new Date()).getFullYear()
      vm.fromReceiveDateFormatted = '01/01/' + currentYear
      vm.getReportVotingDossier()
      //
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
    getReportVotingDossier () {
      let vm = this
      vm.btnLoading = true
      vm.$store.dispatch('loadVotingResultDossier', {
        fromReceiveDate: (new Date(vm.parseDate(vm.fromReceiveDateFormatted))).getTime(),
        toReceiveDate: (new Date(vm.parseDate(vm.toReceiveDateFormatted))).getTime(),
        govAgencyCode: vm.govAgency ? vm.govAgency['govAgencyCode'] : ''
      }).then(function(result) {
        vm.btnLoading = false
        let voteStatistic = []
        result.forEach(element => {
          let indexSt = vm.agencyLists.findIndex(function(gov) {
            return gov.govAgencyCode == element.govAgencyCode
          })
          if (indexSt >=0) {
            voteStatistic.push(element)
          }
        })
        let sortVote = function (voteList) {
          function compare(a, b) {
            if (a.voteCode < b.voteCode)
              return -1
            if (a.voteCode > b.voteCode)
              return 1
            return 0
          }
          return voteList.sort(compare)
        }
        voteStatistic = sortVote(voteStatistic)
        if (voteStatistic && voteStatistic.length) {
          let statistic = []
          voteStatistic.forEach(element => {
            let indexSt = statistic.findIndex(function(st) {
              return st.govAgencyCode == element.govAgencyCode
            })
            if (indexSt >= 0) {
              statistic[indexSt]['votings'].push(element)
            } else {
              let itemSt = {
                govAgencyCode: element.govAgencyCode,
                govAgencyName: element.govAgencyName,
                votings: [element]
              }
              statistic.push(itemSt)
            }
          })
          vm.statisticDossier = statistic
        } else {
          vm.statisticDossier = []
        }
      }).catch(xhr => {
        vm.btnLoading = false
        vm.statisticDossier = []
      })
    },
    currentDateFormat (date) {
      let date1 = date ? new Date(date) : new Date()
      return `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()}`
    },
    parseDate(date) {
      if (!date) return ''
      if (String(date).indexOf('/') > 0) {
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else if (String(date).indexOf('-') > 0) {
        const [day, month, year] = date.split('-')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else {
        let date1 = new Date(Number(date))
        return `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')}`
      }
    },
    getMinMax (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    },
    formatDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    changeDate(index) {
      let vm = this
      vm.menuDate1 = vm.menuDate2  = false
      vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
      vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
    },
    reloadPickerChange (key) {
      let vm = this
      vm.showPicker = false
      setTimeout(() => {
        vm.data[key] = new Date(vm.data[key]).toLocaleDateString('vi-VN')
        vm.showPicker = true
      }, 200)
    },
    getStatistic () {
      let vm = this
      setTimeout (function () {
        vm.loading = true
        let filter = {
          groupId: vm.govAgency['value'] ? vm.govAgency['value'] : window.themeDisplay.getScopeGroupId(),
          data: vm.data,
          api: vm.filterConfig['api'],
          serviceCode: vm.domainCode['serviceCode']
        }
        vm.$store.dispatch('getDataReports', filter).then(function (result) {
          if (result) {
            vm.formatData(result)
          } else {
            vm.formatData([])
          }
          vm.loading = false
        }).catch(function () {
          vm.loading = false
        })
      }, 200)
    },
    formatData (data, groupId) {
      let vm = this
      if(data.length > 0) {
        vm.percentBadTotal = 0
        vm.percentGoodTotal = 0
        vm.percentVeryGoodTotal = 0
        vm.votingItemsDetal = data.filter(function (item) {
          return item.votingSubject && item.govAgencyCode && item.domain
        })
        vm.votingItemsDetal.forEach(e => {
          vm.percentVeryGoodTotal += e.veryGoodCount
          vm.percentGoodTotal += e.goodCount
          vm.percentBadTotal += e.badCount
        })
      } else {
        vm.percentBadTotal = 0
        vm.percentGoodTotal = 0
        vm.percentVeryGoodTotal = 0
        vm.votingItemsDetal = []
      }
    },
    getThuTucHanhChinh (statistic) {
      let vm = this
      setTimeout (function () {
        vm.loading = true
        let filter = {
          groupId: vm.govAgency['value'] ? vm.govAgency['value'] : window.themeDisplay.getScopeGroupId(),
          api: '/o/rest/v2/serviceinfos',
          administration: vm.govAgency['code']
        }
        vm.$store.dispatch('getThuTucHanhChinh', filter).then(function (result) {
          if (result) {
            vm.listThuTuc = result
            if (vm.listThuTuc.length > 0) {
              vm.domainCode = vm.listThuTuc[0]
            } else {
              vm.domainCode = ''
            }
            if (vm.domainCode) {
              vm.getStatistic()
            }
          } else {
            vm.listThuTuc = []
          }
        }).catch(function () {
          vm.listThuTuc = []
        })
      }, 200)
    },
    back() {
      window.history.back()
    }
  },
  filters: {
  }
}
</script>

