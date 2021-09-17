<template>
  <div style="height: 100%;">
    <div style="border: 2px solid #e9e9e9;border-radius: 5px;">
      <v-tabs
        color="white"
        dark
        icons-and-text
      >
        <v-tabs-slider color="blue"></v-tabs-slider>
    
        <v-tab href="#tab-1" class="ml-3 mr-4 black--text" @click="resetDataFilter(1)">
          <span style="font-size: 16px">KẾT QUẢ ĐÁNH GIÁ CỦA NLTT</span>
          <v-icon class="black--text" size=26>done_all</v-icon>
        </v-tab>
    
        <v-tab style="max-width: 350px;" href="#tab-2" class="black--text" @click="resetDataFilter(2)">
          <span style="font-size: 16px">KẾT QUẢ ĐÁNH GIÁ CỦA CƠ QUAN QLNN</span>
          <v-icon class="black--text" size=26>ballot</v-icon>
        </v-tab>
    
        <v-tab-item
          value="tab-1"
        >
          <v-card flat>
            <v-flex xs12>
              <v-layout wrap class="px-3 pt-3">
                <v-flex xs12 md4 class="my-2">
                    <v-autocomplete
                      label="Đơn vị"
                      :items="agencyList"
                      v-model="govAgency"
                      item-text="govAgencyName"
                      item-value="govAgencyCode"
                      return-object
                      clearable
                    >
                    </v-autocomplete>
                </v-flex>
                
                <v-flex xs12 md3 class="my-2 pl-3">
                  <v-menu
                    ref="menuDate3"
                    v-model="menuDate3"
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
                    <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : null" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate(2)"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3 class="my-2 pl-3">
                  <v-menu
                    ref="menuDate4"
                    v-model="menuDate4"
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
                    <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate(2)"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md2 class="pl-4">
                  <v-btn class="mx-0" depressed small color="primary" @click="getReportAgency" :loading="btnLoading" :disabled="btnLoading">
                    <v-icon>image_search</v-icon>Xem kết quả
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-card-text class="reportTable">
              <table class="my-2" hide-default-footer>
                <thead>
                  <tr>
                    <th class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Chỉ số đánh giá</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Tiêu chí đánh giá</span>
                    </th>
                    <th class="text-center px-2 py-1">
                      <span>Lượt đánh giá</span>
                    </th>
                    <th class="text-center px-2 py-1">
                      <span>Điểm trung bình</span>
                    </th>
                  </tr>
                </thead>

                <tbody v-for="(item,index) in statisticGovAgency" :key="index">
                  <tr>
                    <td align="left" colspan="5"  class="px-2 text-bold">{{item.govAgencyName}}</td>
                  </tr>
                  
                  <tr v-for="(item2,index2) in item['votings']" :key="index2">
                    <td align="center" class="px-2">{{index2 + 1}}</td>
                    <td align="left"  class="px-2">Chỉ số {{index2 + 1}}</td>
                    <td align="left"  class="px-2">{{item2.title}}</td>
                    <td align="center"  class="px-2">{{item2.countVoteResult}}</td>
                    <td align="center"  class="px-2">{{Number(item2.countVoteResult ? (item2.point/item2.countVoteResult).toFixed(2) : 0)}}</td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item
          value="tab-2"
        >
          <v-card flat>
            <v-flex xs12>
              <v-layout wrap class="px-3 pt-3">
                <v-flex xs12 md4 class="my-2">
                    <v-autocomplete
                      label="Đơn vị"
                      :items="agencyList"
                      v-model="govAgency"
                      item-text="govAgencyName"
                      item-value="govAgencyCode"
                      return-object
                      clearable
                    >
                    </v-autocomplete>
                </v-flex>
                
                <!-- <v-flex xs12 md3 class="my-2 pl-3">
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
                    <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : null" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate(1)"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 md3 class="my-2 pl-3">
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
                    <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate(1)"></v-date-picker>
                  </v-menu>
                </v-flex> -->
                <v-flex xs12 md4 class="my-2 pl-3 layout wrap">
                  <v-select
                    style="width: 150px"
                    :items="yearList"
                    item-value="value"
                    item-text="name"
                    v-model="yearQlnn"
                    class="right"
                    @change="changeYear()"
                  ></v-select>
                  <v-btn class="mx-0 ml-4 mt-0" depressed small color="primary" @click="getReportAgencyMc(yearQlnn)" :loading="btnLoading" :disabled="btnLoading">
                    <v-icon>image_search</v-icon>Xem kết quả
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-card-text class="reportTable">
              <v-flex xs12 class="text-xs-right">
                <v-btn class="white--text mx-0" @click="dialogVoting = true" color="#004C98" :loading="btnLoading" :disabled="btnLoading">
                  <v-icon>verified</v-icon>&nbsp;
                  Thực hiện đánh giá
                </v-btn>
              </v-flex>
              <table class="my-2" hide-default-footer>
                <thead>
                  <tr>
                    <th class="text-center px-2">
                      <span>STT</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Chỉ số đánh giá</span>
                    </th>
                    <th class="text-center px-2">
                      <span>Tiêu chí đánh giá</span>
                    </th>
                    <th class="text-center px-2 py-1">
                      <span>Điểm đánh giá</span>
                    </th>
                  </tr>
                </thead>

                <tbody v-for="(item,index) in statisticGovAgencyMc" :key="index">
                  <tr>
                    <td align="left" colspan="4"  class="px-2 text-bold">{{item.govAgencyName}}</td>
                  </tr>
                  
                  <tr v-for="(item2,index2) in item['votings']" :key="index2">
                    <td align="center" class="px-2">{{index2 + 1}}</td>
                    <td align="left"  class="px-2">Chỉ số {{index2 + 1}}</td>
                    <td align="left"  class="px-2">{{item2.title}}</td>
                    <td align="center"  class="px-2">{{item2.point}}</td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
    <v-dialog v-model="dialogSelectGov" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          <div style="text-align: center;width: 100%;">Chọn đơn vị đánh giá</div>
        </v-card-title>
        <v-card-text class="py-2 px-2">
          <v-form ref="formVerify" v-model="validVerify" lazy-validation class="px-2 pt-2">
            <v-flex xs12>
              <v-autocomplete
                class="select-search my-2"
                :items="agencyList"
                v-model="agency"
                item-text="govAgencyName"
                item-value="govAgencyCode"
                hide-details
                hide-no-data
                height="26"
                min-height="26"
                return-object
              ></v-autocomplete>
            </v-flex>
          </v-form>
        </v-card-text>
        <v-card-actions class="mx-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="btnLoading" :disabled="btnLoading" @click="doVottingResultSubmitNew">
            <v-icon>how_to_reg</v-icon>&nbsp;
              Xác nhận
          </v-btn>
          <v-btn color="primary" @click="dialogSelectGov = false">
            <v-icon>clear</v-icon>&nbsp;
              Hủy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogVoting" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="pl-5">Thực hiện đánh giá</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialogVoting = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-layout row wrap class="ml-2">
            <v-flex xs12 sm12>
              <div v-for="(item, index) in votingItemsSurvey" style="margin-bottom: 5px;" :key="index">
                <v-layout wrap class="text-bold" v-if="!isMobile">
                  <div class="flex px-3 py-1" style="height:26px;max-width:87px;background-color: #034687;transform: skew(-25deg)">
                    <span class="d-block white--text" style="transform: skew(25deg)">Chỉ số {{index + 1}} : </span>
                  </div>
                  <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                    {{ item.title}}
                  </div>
                </v-layout>
                <div class="text-bold px-2" v-if="isMobile">
                  <div class="" style="text-align: justify;color:#034687">
                    Chỉ số {{index + 1}}: {{ item.title }}
                  </div>
                </div>
                <div :class="!isMobile ? 'ml-4' : 'ml-2'">
                  <v-radio-group v-model="item.selected" column class="mt-1">
                    <v-radio :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                      <div style="text-align: justify;" :style="item.selected === indexChoise + 1 ? 'color:#034687' : 'color:black'" slot="label">{{itemChoise.subject}}</div>
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
              <v-flex xs12 sm12 class="mx-2 my-3" v-if="showCaptcha">
                <div style="max-width: 400px;background: #dedede;margin: 0 auto;" class="pb-2">
                  <v-flex xs12 class="py-2" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <div id="captcha" class="d-inline-block text-xs-center" style="padding-top: 15px;background: #fff;border-radius: 5px;"></div>
                    <v-btn class="right ml-3 mx-0 my-0" title="refresh" flat icon v-on:click.native="createCaptcha">
                      <v-icon color="primary" size="32">refresh</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-text-field
                    class="mx-3"
                    single-lines
                    hide-details
                    solo
                    flat
                    height="36"
                    min-height="36"
                    clearable
                    v-model="captchaValue"
                    placeholder="Nhập mã captcha"
                  ></v-text-field>
                </div>
                
              </v-flex>
              <v-flex xs12 sm12 :class="!isMobile ? 'text-xs-left mt-2' : 'text-xs-left my-2 px-2'">
                <v-btn class="white--text" @click="showFormVerify" color="#004C98" :loading="btnLoading" :disabled="btnLoading">
                  <v-icon>save</v-icon>&nbsp;
                  Gửi đánh giá
                </v-btn>
                <v-btn class="white--text ml-3" @click="dialogVoting = false" color="red" :loading="btnLoading" :disabled="btnLoading">
                  <v-icon>close</v-icon>&nbsp;
                  Thoát
                </v-btn>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    menuDate1: false,
    menuDate3: false,
    fromReceiveDate: '',
    fromReceiveDateFormatted: '',
    menuDate2: false,
    menuDate4: false,
    toReceiveDate: '',
    toReceiveDateFormatted: '',
    statisticGovAgency: [],
    statisticGovAgencyMc: [],
    votingItemsSurvey: [],
    dialogSelectGov: false,
    dialogVoting: false,
    agencyList: [],
    agency: '',
    reRender: true,
    votingUpdate: '',
    votingItemsTTHC: [],
    votingItemsCLDV: [],
    filterConfig: '',
    filters: [],
    govAgency: '',
    hasData: true,
    data: {},
    btnLoading: false,
    showPicker: true,
    showCaptcha: false,
    barColor: ['#5cb85c', '#f0ad4e', '#d9534f', '#2e4fc8', '#2ec8bad9', '#142f14'],
    dialog_voting_result: false,
    resultTotal: [],
    totalAnswer: 0,
    currentYear: (new Date()).getFullYear(),
    yearQlnn: (new Date()).getFullYear(),
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    indexReport () {
      return this.$store.getters.getIndexReport
    },
    yearList() {
      let arr = [];
      let year = new Date().getFullYear();
      for (let i = 0; i <= 3; i++) {
        arr.push({ name: "Năm " + (year - i), value: year - i });
      }
      return arr;
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      try {
        vm.agencyList = agencyList
      } catch (error) {
      }
      vm.toReceiveDateFormatted = vm.currentDateFormat()
      vm.fromReceiveDateFormatted = '01/01/' + vm.currentYear
      // 
      // vm.$store.dispatch('loadVoting', {
      //   className: 'survey',
      //   classPk: 0
      // }).then(result => {
      //   vm.votingItemsTTHC = result
      //   vm.totalAnswer = 0
      //   for (let i = 0; i < vm.votingItemsTTHC.length; i++) {
      //     vm.totalAnswer += Number(vm.votingItemsTTHC[i]['answersCount'])
      //     vm.votingItemsTTHC[i]['selected'] = [false, false, false]
      //     vm.votingItemsTTHC[i]['isEdit'] = false
      //     vm.getPercentItem(vm.votingItemsTTHC[i], i)
      //   }
      // }).catch(xhr => {
      // })
      vm.getReportAgency()
      vm.getReportAgencyMc(vm.currentYear)
      vm.$store.dispatch('loadVotingNew', {
        className: 'surveyAgency'
      }).then(function(result) {
        vm.votingItemsSurvey = result
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
        vm.votingItemsSurvey = sortVote(vm.votingItemsSurvey)
      })
      // +-+
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
    resetDataFilter (index) {
      let vm = this
      vm.govAgency = ''
      vm.toReceiveDateFormatted = vm.currentDateFormat()
      let currentYear = (new Date()).getFullYear()
      vm.fromReceiveDateFormatted = '01/01/' + currentYear
      if (index === 1) {
        vm.getReportAgency()
      } else {
        vm.getReportAgencyMc(vm.currentYear)
      }
    },
    getReportAgency () {
      let vm = this
      vm.btnLoading = true
      vm.$store.dispatch('loadVotingResult', {
        className: 'survey',
        fromReceiveDate: (new Date(vm.parseDate(vm.fromReceiveDateFormatted))).getTime(),
        toReceiveDate: (new Date(vm.parseDate(vm.toReceiveDateFormatted))).getTime(),
        govAgencyCode: vm.govAgency ? vm.govAgency['govAgencyCode'] : '',
        type: 23
      }).then(function(result) {
        vm.btnLoading = false
        let voteStatistic = []
        result.forEach(element => {
          let indexSt = vm.agencyList.findIndex(function(gov) {
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
          vm.statisticGovAgency = statistic
        }
      }).catch(xhr => {
        vm.btnLoading = false
      })
    },
    getReportAgencyMc (year) {
      let vm = this
      vm.$store.dispatch('loadVotingResultGov', {
        className: 'surveyAgency',
        fromReceiveDate: '01/01/' + year,
        toReceiveDate: '31/12/' + year,
        govAgencyCode: vm.govAgency ? vm.govAgency['govAgencyCode'] : ''
      }).then(function(result) {
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
          vm.statisticGovAgencyMc = statistic
        }
      }).catch(xhr => {
      })
    },
    showFormVerify () {
      let vm = this
      let valid = false
      for (let key in vm.votingItemsSurvey) {
        if (vm.votingItemsSurvey[key]['selected'] && String(vm.votingItemsSurvey[key]['selected']) !== '0') {
          valid = true
          break
        }
      }
      if (valid) {
        vm.dialogSelectGov = true
        vm.$refs.formVerify.resetValidation()
      } else {
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
    },
    doVottingResultSubmitNew () {
      var vm = this
      vm.yearQlnn = vm.currentYear
      vm.btnLoading = true
      let arrAction = []
      let valid = false
      let formDataAgency = {
        govAgencyCode: vm.agency.govAgencyCode,
        govAgencyName:vm.agency.govAgencyName,
        className: 'surveyAgency'
      }
      for (var key in vm.votingItemsSurvey) {
        vm.votingItemsSurvey[key]['className'] = 'surveyAgency'
        if (vm.votingItemsSurvey[key]['selected'] && String(vm.votingItemsSurvey[key]['selected']) !== '0') {
          valid = true
          let indexChoice = vm.votingItemsSurvey[key]['selected'] - 1
          arrAction.push(vm.$store.dispatch('submitVotingNew', Object.assign(vm.votingItemsSurvey[key]['choices'][indexChoice], formDataAgency)))
        }
      }
      if (valid) {
        Promise.all(arrAction).then(results => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.dialogSelectGov = false
          vm.btnLoading = false
          vm.$store.dispatch('loadVotingNew', {
            className: 'surveyAgency'
          }).then(result => {
            vm.votingItemsSurvey = result
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
            vm.votingItemsSurvey = sortVote(vm.votingItemsSurvey)
            vm.getReportAgencyMc(vm.currentYear)
          }).catch( function () {
          })
        }).catch(xhr => {
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          vm.btnLoading = false
        })
      } else {
        vm.btnLoading = false
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
    },
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
      if (index === 1) {
        vm.menuDate1 = vm.menuDate2  = false
        vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
        vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
      } else {
        vm.menuDate3 = vm.menuDate4  = false
        vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
        vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
      }
    },
  },
  filters: {
  }
}
</script>

