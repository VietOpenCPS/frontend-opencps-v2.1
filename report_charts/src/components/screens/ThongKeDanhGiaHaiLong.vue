<template>
  <div style="height: 100%;">
    <v-container grid-list-md >
        <v-layout row wrap>
            <v-flex xs12 sm3>
                <v-layout row wrap style="background-color: #ffff;border-top: 1px solid #004b94;" class="pa-2">
                    <v-flex xs12 text-center>
                        <span style="color: #004b94; font-weight: 600;">Đánh giá hài lòng của người sử dụng đối với dịch vụ công trực tuyến mức độ 3 và 4</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                        <v-autocomplete
                            label="Đơn vị"
                            :items="agencyLists"
                            v-model="govAgency"
                            item-text="text"
                            item-value="value"
                            return-object
                            @change="getThuTucHanhChinh"
                        >
                        </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                        <v-autocomplete
                            label="Thủ tục"
                            :items="listThuTuc"
                            v-model="domainCode"
                            item-text="serviceName"
                            item-value="serviceCode"
                            return-object
                        >
                        </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 class="my-2" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
                        <datetime-picker
                            v-if="item['type'] === 'date' && showPicker"
                            v-model="data[item.key]" 
                            :item="item" 
                            :data-value="data[item.key]"
                            :data-all="data"
                            :label="true"
                            @change="reloadPickerChange(item.key)">
                        </datetime-picker>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                        <v-btn depressed small color="primary" @click="getStatistic"><v-icon>image_search</v-icon>Xem chi tiết</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm9 class="pl-4">
                <v-layout row wrap  style="background-color: #ffff;">
                    <v-flex class="xs12" style="
                        background-color: #004b94 !important;
                        height: 36px;
                        padding: 9px 15px;
                        font-weight: 600;
                        color: white;">
                        <span>{{domainCode['serviceName']}}</span>
                    </v-flex>
                    <v-flex xs12 sm12 class="my-3 pl-3">
                        <div style="margin-bottom: 5px;">
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
                        </div>
                    </v-flex>
                    <v-flex xs12>
                      <v-btn outline color="primary" @click="back"> 
                          <v-icon>arrow_back</v-icon>  Quay lại
                      </v-btn>
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
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      // 
      // +-+
      let filter = {
        reportCode: 'STATISTIC_05'
      }
      vm.$store.dispatch('getDynamicReports', filter).then(function (result) {
        vm.filterConfig = eval('( ' + result['filterConfig'] + ' )')
        console.log(vm.filterConfig)
        if (vm.filterConfig.hasOwnProperty('groupIdsAdmin')) {
          vm.agencyLists = vm.filterConfig['groupIdsAdmin']
          if (vm.agencyLists.length > 0) {
            let defaultVal = vm.agencyLists[0]
            for (let key in vm.agencyLists) {
              if (vm.agencyLists[key]['selected']) {
                defaultVal = vm.agencyLists[key]
                break
              }
            }
            if (query.hasOwnProperty('groupId') && query['groupId']) {
              vm.govAgency = vm.agencyLists.filter(function (item) {
                return String(item['value']) === String(query['groupId'])
              })[0]
              vm.getThuTucHanhChinh('statistic')
            } else {
              vm.govAgency = defaultVal
              vm.getThuTucHanhChinh('statistic')
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

