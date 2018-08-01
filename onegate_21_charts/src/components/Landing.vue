<template>
  <div class="form-chitiet">
    <div class="row-header">
      <div class="background-triangle-big"> <span>BÁO CÁO</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs12 pl-3 text-ellipsis text-bold">
          <v-layout wrap class="chart__report">
            <v-flex xs6 sm2 class="px-2">
              <v-select 
                :items="years" 
                v-model="year"
                autocomplete 
                item-text="name" 
                item-value="value"
                :hide-selected="true"
                @change="changeYear"
                >
              </v-select>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-select 
                :items="months" 
                v-model="month"
                autocomplete 
                item-text="name" 
                item-value="value"
                :hide-selected="true"
                @change="changeMonth"
                >
              </v-select>
            </v-flex>
            <v-flex xs6 sm2 class="px-2">
              <v-select 
                v-if="agencyGroups !== null && agencyGroups !== undefined && agencyGroups !== 'undefined' && agencyGroups.length > 1"
                :items="agencyGroups" 
                v-model="group"
                autocomplete 
                item-text="groupName" 
                item-value="groupCode" 
                :hide-selected="true"
                @change="changeDonVi"
                >
              </v-select>
            </v-flex>
            <v-flex xs12 sm6 class="px-2 text-right">
              <v-tooltip bottom>
                <v-btn icon class="mx-0 my-0" slot="activator" v-on:click.native="toNativeView(0)">
                  <v-icon>pie_chart</v-icon>
                </v-btn>
                <span>Xem dạng biểu đồ</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon class="mx-0 my-0" slot="activator" v-on:click.native="toNativeView(1)">
                  <v-icon>grid_on</v-icon>
                </v-btn>
                <span>Xem dạng bảng biểu</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </div>
      </div> 
    </div>
    <div v-if="String(index) === '0'">
      <div class="layout wrap" v-if="!noReportData">
        <v-flex xs12 sm4 class="px-2" v-for="(item, index) in agencyLists" v-bind:key="index" v-if="String(item.govAgencyCode) !== '' && reloadPie">
          <pie-chart-report :item="item" :year="year" :month="month"></pie-chart-report>
        </v-flex>
        <v-flex xs12></v-flex>
        <content-placeholders class="my-4 flex xs12 sm4 px-2" v-for="(item, index) in agencyLists" v-bind:key="index" v-if="String(item.govAgencyCode) !== '' && !reloadPie">
          <content-placeholders-heading />
          <content-placeholders-img />
        </content-placeholders>
        <v-flex xs12 class="mt-4" v-if="reloadPie">
          <bar-chart-report :item_array="agencyLists" :year="year" :month="month"></bar-chart-report>
        </v-flex>
        <content-placeholders class="my-4 flex xs12 px-2" v-else>
          <content-placeholders-heading />
          <content-placeholders-img />
        </content-placeholders>
      </div>
      <v-alert v-else :value="true" outline color="info" icon="info">
        Không có dữ liệu báo cáo.
      </v-alert>
    </div>
    <div v-if="String(index) === '1'">
      <v-card class="py-4" style="border-radius: 0;box-shadow: none;
        border-bottom: 1px solid #ddd;">
        <v-card-text>
          <v-layout wrap id="contentToPDF">
            <v-flex xs6 class="text-center text-bold">
            </v-flex>
            <v-flex xs6 class="text-center text-bold">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM <br/>
              Độc lập - Tự do - Hạnh phúc 
              <hr align="center" width="120px" style="margin: auto;">
            </v-flex>
            <v-flex xs6 class="text-center text-bold">
            </v-flex>
            <v-flex xs6 class="text-center mt-2">
              Ngày {{currentDay}} tháng {{currentMonth}} năm {{year}} 
            </v-flex>
            <v-flex xs12 class="text-center text-bold mt-3 fs14">
              BÁO CÁO TỔNG HỢP TÌNH HÌNH GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH <br/>
              <span v-if="String(month) !== '0'">Tháng {{month}}</span> Năm {{year}}
            </v-flex>
            <div class="mt-3 report__table">
              <table>
                <thead>
                    <tr>
                      <th rowspan="5" colspan="1" width="40">STT</th>
                      <th rowspan="5" colspan="1" width="100%">Đơn vị</th>
                      <th rowspan="5" colspan="1" width="40">Tổng số</th>
                      <th rowspan="5" colspan="1" width="40">Từ chối tiếp nhận trong kỳ</th>
                      <th rowspan="5" colspan="1" width="40">Hồ sơ rút không giải quyết</th>
                      <th rowspan="1" colspan="5">Nhận giải quyết</th>
                      <th rowspan="1" colspan="14">Kết quả giải quyết</th>
                    </tr>
                    <tr>
                      <th rowspan="4" colspan="1" width="40">Tổng số</th>
                      <th rowspan="4" colspan="1" width="40">Tồn trước</th>
                      <th rowspan="1" colspan="3" >Nhận trong kỳ</th>
                      <th rowspan="1" colspan="10" >Hồ sơ đã có kết quả</th>
                      <th rowspan="1" colspan="3" >Đang giải quyết</th>
                      <th rowspan="4" colspan="1" width="40">Tạm dừng bổ sung điều kiện</th>
                    </tr>
                    <tr>
                      <th rowspan="3" width="40">Tổng số</th>
                      <th rowspan="3" width="40">Một cửa</th>
                      <th rowspan="3" width="40">Trực tuyến</th>
                      <th rowspan="3" width="40">Tổng số</th>
                      <th colspan="6" >Tình trạng thực hiện</th>
                      <th colspan="2" >Trả kết quả</th>
                      <th rowspan="3" width="40">Từ chối  giải quyết</th>
                      <th rowspan="3" width="40">Tổng số</th>
                      <th rowspan="3" width="40">Còn hạn</th>
                      <th rowspan="3" width="40">Quá hạn</th>
                    </tr>
                    <tr>
                      <th rowspan="2" width="40">Trước hạn</th>
                      <th rowspan="2" width="40">Đúng hạn</th>
                      <th colspan="3" >Quá hạn</th>
                      <th rowspan="2" width="40">% trước và đúng hạn</th>
                      <th rowspan="2" width="40">Đã trả</th>
                      <th rowspan="2" width="40">Chưa trả</th>
                    </tr>
                    <tr>
                      <th width="40">Tổng số</th>
                      <th width="40">Trong đơn vị</th>
                      <th width="40">Ngoài đơn vị</th>
                    </tr>
                </thead>
                <tbody>
                  <tr class="note__column">
                    <td align="center">1</td>
                    <td align="center">2</td>
                    <td align="center">3</td>
                    <td align="center">4</td>
                    <td align="center">5</td>
                    <td align="center">6</td>
                    <td align="center">7</td>
                    <td align="center">8</td>
                    <td align="center">9</td>
                    <td align="center">10</td>
                    <td align="center">11</td>
                    <td align="center">12</td>
                    <td align="center">13</td>
                    <td align="center">14</td>
                    <td align="center">15</td>
                    <td align="center">16</td>
                    <td align="center">17</td>
                    <td align="center">18</td>
                    <td align="center">19</td>
                    <td align="center">20</td>
                    <td align="center">21</td>
                    <td align="center">22</td>
                    <td align="center">23</td>
                    <td align="center">24</td>
                  </tr>
                  <tr v-for="(item, index) in agencyLists" v-bind:key="index">
                    <td align="center">{{index + 1}}</td>
                    <td align="center">{{item.govAgencyName}}</td>
                    <td align="center">{{item.totalCount}}</td>
                    <td align="center">{{item.deniedCount}}</td>
                    <td align="center">{{item.cancelledCount}}</td>
                    <td align="center">{{item.processCount}}</td>
                    <td align="center">{{item.remainingCount}}</td>
                    <td align="center">{{item.receivedCount}}</td>
                    <td align="center">{{item.onegateCount}}</td>
                    <td align="center">{{item.onlineCount}}</td>
                    <td align="center">{{item.releaseCount}}</td>
                    <td align="center">{{item.betimesCount}}</td>
                    <td align="center">{{item.ontimeCount}}</td>
                    <td align="center">{{item.overtimeCount}}</td>
                    <td align="center">{{item.overtimeInside}}</td>
                    <td align="center">{{item.overtimeOutside}}</td>
                    <td align="center">{{item.ontimePercentage}}</td>
                    <td align="center">{{item.doneCount}}</td>
                    <td align="center">{{item.releasingCount}}</td>
                    <td align="center">{{item.unresolvedCount}}</td>
                    <td align="center">{{item.processingCount}}</td>
                    <td align="center">{{item.undueCount}}</td>
                    <td align="center">{{item.overdueCount}}</td>
                    <td align="center">{{item.waitingCount}}</td>
                  </tr>
                  <tr class="sum__column" style="font-weight: bold;">
                    <td align="center" colspan="2">Tổng số <br> <small v-if="agencyLists !== null && agencyLists.length > 1"> ( {{agencyLists.length}} đơn vị ) </small></td>
                    <td align="center ">{{totalCounter['total_3']}}</td>
                    <td align="center">{{totalCounter['total_4']}}</td>
                    <td align="center">{{totalCounter['total_5']}}</td>
                    <td align="center">{{totalCounter['total_6']}}</td>
                    <td align="center">{{totalCounter['total_7']}}</td>
                    <td align="center">{{totalCounter['total_8']}}</td>
                    <td align="center">{{totalCounter['total_9']}}</td>
                    <td align="center">{{totalCounter['total_10']}}</td>
                    <td align="center">{{totalCounter['total_11']}}</td>
                    <td align="center">{{totalCounter['total_12']}}</td>
                    <td align="center">{{totalCounter['total_13']}}</td>
                    <td align="center">{{totalCounter['total_14']}}</td>
                    <td align="center">{{totalCounter['total_15']}}</td>
                    <td align="center">{{totalCounter['total_16']}}</td>
                    <td align="center">{{totalCounter['total_17']}}</td>
                    <td align="center">{{totalCounter['total_18']}}</td>
                    <td align="center">{{totalCounter['total_19']}}</td>
                    <td align="center">{{totalCounter['total_20']}}</td>
                    <td align="center">{{totalCounter['total_21']}}</td>
                    <td align="center">{{totalCounter['total_22']}}</td>
                    <td align="center">{{totalCounter['total_23']}}</td>
                    <td align="center">{{totalCounter['total_24']}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>

  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.js'
import PieChartReport from './PieChartReport.vue'
import BarChartReport from './BarChartReport.vue'

export default {
  props: ['index', 'id'],
  components: {
    'pie-chart-report': PieChartReport,
    'bar-chart-report': BarChartReport
  },
  data: () => ({
    currentMonth: ((new Date()).getMonth() + 1) < 10 ? '0' + ((new Date()).getMonth() + 1) : ((new Date()).getMonth() + 1),
    currentDay: (new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate(),
    agencyGroups: [],
    noReportData: false,
    isCallBack: true,
    reloadPie: false,
    agencyLists: [],
    group: '',
    years: [
      {
        'value': '',
        'name': 'Lọc theo năm'
      },
      {
        'value': '2017',
        'name': 'năm 2017'
      },
      {
        'value': '2018',
        'name': 'năm 2018'
      },
      {
        'value': '2019',
        'name': 'năm 2019'
      }
    ],
    year: (new Date()).getFullYear() + '',
    months: [
      {
        'value': '0',
        'name': 'Lọc theo tháng'
      },
      {
        'value': '1',
        'name': 'tháng 1'
      },
      {
        'value': '2',
        'name': 'tháng 2'
      },
      {
        'value': '3',
        'name': 'tháng 3'
      },
      {
        'value': '4',
        'name': 'tháng 4'
      },
      {
        'value': '5',
        'name': 'tháng 5'
      },
      {
        'value': '6',
        'name': 'tháng 6'
      },
      {
        'value': '7',
        'name': 'tháng 7'
      },
      {
        'value': '8',
        'name': 'tháng 8'
      },
      {
        'value': '9',
        'name': 'tháng 9'
      },
      {
        'value': '10',
        'name': 'tháng 10'
      },
      {
        'value': '11',
        'name': 'tháng 11'
      },
      {
        'value': '12',
        'name': 'tháng 12'
      }
    ],
    month: '0',
    danhSachBaoCaos: [],
    totalCounter: {}
  }),
  computed: {
    loadingMenuConfigToDo () {
      return this.$store.getters.loadingMenuConfigToDo
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('getAgencyGroups').then(function (result) {
        if (result !== null && result !== undefined && result !== 'undefined') {
          vm.agencyGroups = result
          vm.agencyGroups.unshift({
            'groupCode': '',
            'groupName': 'Lọc theo nhóm'
          })
        } else {
          vm.agencyGroups = []
        }
      })
      vm.doStaticsReport()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParam = newRoute.params
      if (String(currentParam.index) === '1') {
        for (let key in vm.agencyLists) {
          let currentData = vm.agencyLists[key]
          vm.doCounterTotal(currentData)
        }
      }
    }
  },
  methods: {
    toNativeView (data) {
      let vm = this
      router.push({
        path: '/bao-cao/' + data
      })
    },
    doStaticsReport () {
      let vm = this
      let filter = {
        year: vm.year,
        month: vm.month,
        group: vm.group,
        reporting: true
      }
      vm.reloadPie = false
      vm.$store.dispatch('getAgencyReportLists', filter).then(function (result) {
        if (result === null || result === undefined || result === 'undefined') {
          vm.noReportData = true
          vm.agencyLists = []
          vm.clearCounterTotal()
        } else {
          vm.noReportData = false
          vm.agencyLists = result
          if (String(vm.index) === '1') {
            for (let key in vm.agencyLists) {
              let currentData = vm.agencyLists[key]
              vm.doCounterTotal(currentData)
            }
          }
        }
        vm.reloadPie = true
      })
    },
    changeYear (item) {
      let vm = this
      vm.year = item
      vm.doStaticsReport()
    },
    changeMonth (item) {
      let vm = this
      vm.month = item
      vm.doStaticsReport()
    },
    changeDonVi (item) {
      let vm = this
      vm.agency = item
      vm.doStaticsReport()
    },
    doCounterTotal (currentData) {
      let vm = this
      vm.totalCounter['total_3'] = String(vm.totalCounter['total_3']) === 'undefined' ? 0 + currentData.totalCount : parseInt(parseInt(vm.totalCounter['total_3']) + currentData.totalCount)
      vm.totalCounter['total_4'] = String(vm.totalCounter['total_4']) === 'undefined' ? 0 + currentData.deniedCount : parseInt(vm.totalCounter['total_4']) + currentData.deniedCount
      vm.totalCounter['total_5'] = String(vm.totalCounter['total_5']) === 'undefined' ? 0 + currentData.cancelledCount : parseInt(vm.totalCounter['total_5']) + currentData.cancelledCount
      vm.totalCounter['total_6'] = String(vm.totalCounter['total_6']) === 'undefined' ? 0 + currentData.processCount : parseInt(vm.totalCounter['total_6']) + currentData.processCount
      vm.totalCounter['total_7'] = String(vm.totalCounter['total_7']) === 'undefined' ? 0 + currentData.remainingCount : parseInt(vm.totalCounter['total_7']) + currentData.remainingCount
      vm.totalCounter['total_8'] = String(vm.totalCounter['total_8']) === 'undefined' ? 0 + currentData.receivedCount : parseInt(vm.totalCounter['total_8']) + currentData.receivedCount
      vm.totalCounter['total_9'] = String(vm.totalCounter['total_9']) === 'undefined' ? 0 + currentData.onegateCount : parseInt(vm.totalCounter['total_9']) + currentData.onegateCount
      vm.totalCounter['total_10'] = String(vm.totalCounter['total_10']) === 'undefined' ? 0 + currentData.onlineCount : parseInt(vm.totalCounter['total_10']) + currentData.onlineCount
      vm.totalCounter['total_11'] = String(vm.totalCounter['total_11']) === 'undefined' ? 0 + currentData.releaseCount : parseInt(vm.totalCounter['total_11']) + currentData.releaseCount
      vm.totalCounter['total_12'] = String(vm.totalCounter['total_12']) === 'undefined' ? 0 + currentData.betimesCount : parseInt(vm.totalCounter['total_12']) + currentData.betimesCount
      vm.totalCounter['total_13'] = String(vm.totalCounter['total_13']) === 'undefined' ? 0 + currentData.ontimeCount : parseInt(vm.totalCounter['total_13']) + currentData.ontimeCount
      vm.totalCounter['total_14'] = String(vm.totalCounter['total_14']) === 'undefined' ? 0 + currentData.overtimeCount : parseInt(vm.totalCounter['total_14']) + currentData.overtimeCount
      vm.totalCounter['total_15'] = String(vm.totalCounter['total_15']) === 'undefined' ? 0 + currentData.overtimeInside : parseInt(vm.totalCounter['total_15']) + currentData.overtimeInside
      vm.totalCounter['total_16'] = String(vm.totalCounter['total_16']) === 'undefined' ? 0 + currentData.overtimeOutside : parseInt(vm.totalCounter['total_16']) + currentData.overtimeOutside
      vm.totalCounter['total_17'] = String(vm.totalCounter['total_17']) === 'undefined' ? 0 + currentData.ontimePercentage : parseInt(vm.totalCounter['total_17']) + currentData.ontimePercentage
      vm.totalCounter['total_18'] = String(vm.totalCounter['total_18']) === 'undefined' ? 0 + currentData.doneCount : parseInt(vm.totalCounter['total_18']) + currentData.doneCount
      vm.totalCounter['total_19'] = String(vm.totalCounter['total_19']) === 'undefined' ? 0 + currentData.releasingCount : parseInt(vm.totalCounter['total_19']) + currentData.releasingCount
      vm.totalCounter['total_20'] = String(vm.totalCounter['total_20']) === 'undefined' ? 0 + currentData.unresolvedCount : parseInt(vm.totalCounter['total_20']) + currentData.unresolvedCount
      vm.totalCounter['total_21'] = String(vm.totalCounter['total_21']) === 'undefined' ? 0 + currentData.processingCount : parseInt(vm.totalCounter['total_21']) + currentData.processingCount
      vm.totalCounter['total_22'] = String(vm.totalCounter['total_22']) === 'undefined' ? 0 + currentData.undueCount : parseInt(vm.totalCounter['total_22']) + currentData.undueCount
      vm.totalCounter['total_23'] = String(vm.totalCounter['total_23']) === 'undefined' ? 0 + currentData.overdueCount : parseInt(vm.totalCounter['total_23']) + currentData.overdueCount
      vm.totalCounter['total_24'] = String(vm.totalCounter['total_24']) === 'undefined' ? 0 + currentData.waitingCount : parseInt(vm.totalCounter['total_24']) + currentData.waitingCount
    },
    clearCounterTotal () {
      let vm = this
      vm.totalCounter['total_3'] = 0
      vm.totalCounter['total_4'] = 0
      vm.totalCounter['total_5'] = 0
      vm.totalCounter['total_6'] = 0
      vm.totalCounter['total_7'] = 0
      vm.totalCounter['total_8'] = 0
      vm.totalCounter['total_9'] = 0
      vm.totalCounter['total_10'] = 0
      vm.totalCounter['total_11'] = 0
      vm.totalCounter['total_12'] = 0
      vm.totalCounter['total_13'] = 0
      vm.totalCounter['total_14'] = 0
      vm.totalCounter['total_15'] = 0
      vm.totalCounter['total_16'] = 0
      vm.totalCounter['total_17'] = 0
      vm.totalCounter['total_18'] = 0
      vm.totalCounter['total_19'] = 0
      vm.totalCounter['total_20'] = 0
      vm.totalCounter['total_21'] = 0
      vm.totalCounter['total_22'] = 0
      vm.totalCounter['total_23'] = 0
      vm.totalCounter['total_24'] = 0
    }
  }
}
</script>
