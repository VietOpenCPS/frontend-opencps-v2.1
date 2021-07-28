<template>
  <div style="height: 100%;">
    <v-container grid-list-md >
        <v-layout row wrap>
            <v-flex xs12 sm3>
                <v-layout row wrap style="background-color: #ffff;border-top: 1px solid #004b94;" class="pa-2">
                    <v-flex xs12 text-center>
                        <span style="color: #004b94; font-weight: 600;">Đánh giá hài lòng của người dùng về việc thực hiện thủ tục hành chính</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                        <v-autocomplete
                          label="Đơn vị"
                          :items="agencyLists"
                          v-model="govAgency"
                          item-text="govAgencyName"
                          item-value="govAgencyCode"
                          return-object
                          clearable
                        >
                        </v-autocomplete>
                    </v-flex>
                    <!-- <v-flex xs12 class="my-2">
                        <v-autocomplete
                            label="Thủ tục"
                            :items="listThuTuc"
                            v-model="domainCode"
                            item-text="serviceName"
                            item-value="serviceCode"
                            return-object
                        >
                        </v-autocomplete>
                    </v-flex> -->
                    <v-flex xs12 class="my-2">
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
                    <v-flex>
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
                    <v-flex xs12 class="my-2">
                      <v-btn class="mx-0" depressed small color="primary" @click="getReportVotingDossier" :loading="btnLoading" :disabled="btnLoading">
                        <v-icon>image_search</v-icon>Xem kết quả
                      </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm9 class="pl-4">
                <v-layout row wrap  style="background-color: #ffff;">
                    <v-flex class="xs12" style="
                        background-color: #004b94 !important;
                        height: auto;
                        min-height: 36px;
                        padding: 9px 15px;
                        font-weight: 600;
                        color: white;">
                        <span>Kết quả đánh giá</span>
                    </v-flex>
                    <v-flex xs12 sm12 class="my-3 px-0">
                        <!-- <div style="margin-bottom: 5px;">
                            <v-layout wrap class="text-bold mb-3">
                                <div class="flex px-3 py-1" style="height:26px;max-width:88px;background-color: #034687;transform: skew(-25deg)">
                                    <span class="d-block white--text" style="transform: skew(25deg)">Phần 1 </span>
                                </div>
                                <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                                    Đánh giá tổng thể dịch vụ
                                </div>
                            </v-layout>
                            <div class="ml-4">
                                <v-card flat class="pl-2">
                                <v-card-text class="px-2 py-1 pr-0">
                                    <v-flex xs12 class="mb-2">
                                    <v-layout wrap>
                                        <v-flex xs12 md3>
                                            <p class="headline primary--text">{{percentVeryGoodTotal}}</p>
                                            <p>Rất hài lòng</p>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <p class="headline primary--text">{{percentGoodTotal}}</p>
                                            <p>Hài lòng</p>
                                        </v-flex>
                                        <v-flex xs12 md3>
                                            <p class="headline primary--text">{{percentBadTotal}}</p>
                                            <p>Không hài lòng</p>
                                        </v-flex>
                                    </v-layout>    
                                </v-card-text>
                                </v-card>
                            </div>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <v-layout wrap class="text-bold mb-3">
                              <div class="flex px-3 py-1" style="height:26px;max-width:88px;background-color: #034687;transform: skew(-25deg)">
                                <span class="d-block white--text" style="transform: skew(25deg)">Phần 2 </span>
                              </div>
                              <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                                Đánh giá chi tiết dịch vụ
                              </div>
                            </v-layout>
                            <div class="ml-4">
                                <v-card flat class="pl-2">
                                  <v-card-text class="px-2 py-1 pr-0">
                                    <v-flex xs12 class="mb-2" v-if="votingItemsDetal.length > 0">
                                      <v-flex xs12 v-for="(item, index) in votingItemsDetal" :key="index">
                                        <v-layout wrap>
                                          <v-flex xs12><strong class="primary--text">{{item.votingSubject}}</strong></v-flex>
                                          <v-flex xs12 class="mb-3">
                                              <v-layout wrap>
                                                  <v-flex xs12 md3>
                                                      <p class="headline primary--text">{{item.veryGoodCount}}</p>
                                                      <p>Rất hài lòng</p>
                                                  </v-flex>
                                                  <v-flex xs12 md3>
                                                      <p class="headline primary--text">{{item.goodCount}}</p>
                                                      <p>Hài lòng</p>
                                                  </v-flex>
                                                  <v-flex xs12 md3>
                                                      <p class="headline primary--text">{{item.badCount}}</p>
                                                      <p>Không hài lòng</p>
                                                  </v-flex>
                                              </v-layout>
                                          </v-flex>
                                        </v-layout>
                                      </v-flex>
                                    </v-flex>
                                    <v-flex v-else>
                                      <v-alert
                                        :value="true"
                                        color="info"
                                        icon="info"
                                        outline
                                      >
                                        Không có đánh giá
                                      </v-alert>
                                    </v-flex>
                                  </v-card-text>
                                </v-card>
                            </div>
                        </div> -->

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
                                    <span>Số điểm</span>
                                  </th>
                                </tr>
                              </thead>

                              <tbody v-for="(item,index) in statisticDossier" :key="index">
                                <tr>
                                  <td align="left" colspan="3"  class="px-2 text-bold">{{item.govAgencyName}}</td>
                                </tr>
                                
                                <tr v-for="(item2,index2) in item['votings']" :key="index2">
                                  <td align="center" class="px-2">{{index2 + 1}}</td>
                                  <td align="left"  class="px-2">{{item2.title}}</td>
                                  <td align="center"  class="px-2">{{item2.point}}</td>
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
      let time = (new Date(vm.parseDate(vm.toReceiveDateFormatted))).getTime() - 30*86400000
      vm.fromReceiveDateFormatted = vm.currentDateFormat(time)
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
        fromReceiveDate: vm.fromReceiveDateFormatted,
        toReceiveDate: vm.toReceiveDateFormatted,
        govAgencyCode: vm.govAgency ? vm.govAgency['govAgencyCode'] : ''
      }).then(function(result) {
        vm.btnLoading = false
        let voteStatistic = result
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

