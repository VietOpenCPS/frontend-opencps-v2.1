<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
      >
        Thống kê truy cập
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout wrap>
        <!-- <v-flex xs12 sm6 class="px-2">
          <div style="-webkit-box-shadow: -1px 0px 5px 0px rgba(0,0,0,0.75);-moz-box-shadow: -1px 0px 5px 0px rgba(0,0,0,0.75);box-shadow: -1px 0px 5px 0px rgba(0,0,0,0.75);">
            <v-card>
                <v-card-text>
                    <v-tabs>
                        <v-tabs-slider color="yellow"></v-tabs-slider>     
                        <v-tab href="#tab-1">
                            <div style="display:flex; flex-wrap: wrap;">
                            <div style="width: 100%;"><strong>Người dùng</strong></div>
                            <div style="width: 100%;"><span>20</span></div>    
                            </div>

                        </v-tab>
                        <v-tab href="#tab-2">
                            <div style="display:flex; flex-wrap: wrap;">
                            <div style="width: 100%;"><strong>Người dùng</strong></div>
                            <div style="width: 100%;"><span>20</span></div>    
                            </div>

                        </v-tab>
                        <v-tab href="#tab-3">
                            <div style="display:flex; flex-wrap: wrap;">
                            <div style="width: 100%;"><strong>Người dùng</strong></div>
                            <div style="width: 100%;"><span>20</span></div>    
                            </div>

                        </v-tab>
                        <v-tab href="#tab-4">
                            <div style="display:flex; flex-wrap: wrap;">
                            <div style="width: 100%;"><strong>Người dùng</strong></div>
                            <div style="width: 100%;"><span>20</span></div>    
                            </div>

                        </v-tab>                    
                        <v-tab-item
                            value="tab-1" key="tab-1"
                            >
                            <v-card flat>
                                <v-card-text>
                                    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>                  
                        <v-tab-item
                            value="tab-2" key="tab-2"
                            >
                            <v-card flat>
                                <v-card-text>
                                    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>                  
                        <v-tab-item
                            value="tab-3" key="tab-3"
                            >
                            <v-card flat>
                                <v-card-text>
                                    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>                  
                        <v-tab-item
                            value="tab-4" key="tab-4"
                            >
                            <v-card flat>
                                <v-card-text>
                                    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
            </v-card>
          </div>
        </v-flex> -->
        <v-flex xs12 sm4 class="px-2">
          <v-card class="wrap_report report_service" style="border-radius: 0;">
            <v-card-title class="headline pa-2"  style="color: white;background-color: #2196F3">
                Số phiên theo thiết bị
            </v-card-title>
            <v-card-text class="py-0 px-0">
              <v-layout wrap>
                <v-flex xs12>
                  <apexchart type="donut" :options="chartDonutOptions" :series="seriesDonut" height="250"></apexchart>
                </v-flex>
                <v-flex xs12>
                  <v-layout wrap>
                    <v-flex xs4>
                      <v-select
                        :items="selects"
                        item-text="text"
                        item-value="value"
                        v-model="timeTKThietBiSelected"
                      ></v-select>
                    </v-flex>
                    <v-flex xs8 v-if="timeTKThietBiSelected === 'chooseDate'">
                      <v-menu
                        ref="menu4"
                        :close-on-content-click="false"
                        v-model="menu4"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="chooseDateTKThietBiFormatted"
                          label="Chọn ngày"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(chooseDateTKThietBiFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="chooseDateTKThietBi" no-title @input="menu4 = false" locale="vn"></v-date-picker>
                      </v-menu>
                    </v-flex>   
                    <v-flex xs3 v-if="timeTKThietBiSelected === 'period'">
                      <v-menu
                        ref="menu5"
                        :close-on-content-click="false"
                        v-model="menu5"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="fromDateTKThietBiFormatted"
                          label="Từ ngày"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(fromDateTKThietBiFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="fromDateTKThietBi" no-title @input="menu5 = false" locale="vn"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs3 v-if="timeTKThietBiSelected === 'period'">
                      <v-menu
                        ref="menu6"
                        :close-on-content-click="false"
                        v-model="menu6"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="toDateTKThietBiFormatted"
                          label="Đến ngày"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(toDateTKThietBiFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="toDateTKThietBi" no-title @input="menu6 = false" locale="vn"></v-date-picker>
                      </v-menu>
                    </v-flex> 
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 class="px-2">
          <div>
              <v-card class="wrap_report report_service" style="border-radius: 0;">
                <v-card-title class="headline pa-2" style="color: white;background-color: #2196F3">
                  Người dùng truy cập những trang
                </v-card-title>
                <v-card-text class="py-0 px-0">
                  <v-data-table
                    :headers="headers"
                    :items="statisticURls"
                    hide-actions
                    style="height: 500px;overflow-y: scroll;"
                  >
                    <template slot="items" slot-scope="props">
                      <tr>
                        <td class="text-xs-left">{{subString(props.item.url)}}</td>
                        <td class="text-xs-right">{{props.item.value}}</td>
                      </tr>
                    </template>
                  </v-data-table>
                  <v-layout wrap>
                    <v-flex xs4>
                      <v-select
                        :items="selects"
                        item-text="text"
                        item-value="value"
                        v-model="timeSelected"
                      ></v-select>
                    </v-flex>
                    <v-flex xs3 v-if="timeSelected === 'chooseDate'">
                      <v-menu
                        ref="menu3"
                        :close-on-content-click="false"
                        v-model="menu3"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="chooseDateFormatted"
                          label="Chọn ngày"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(chooseDateFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="chooseDate" no-title @input="menu3 = false" locale="vn"></v-date-picker>
                      </v-menu>
                    </v-flex>   
                    <v-flex xs3 v-if="timeSelected === 'period'">
                      <v-menu
                        ref="menu1"
                        :close-on-content-click="false"
                        v-model="menu1"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="fromDateFormatted"
                          label="Từ ngày"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(fromDateFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="fromDate" no-title @input="menu1 = false" locale="vn"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs3 v-if="timeSelected === 'period'">
                      <v-menu
                        ref="menu2"
                        :close-on-content-click="false"
                        v-model="menu2"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="toDateFormatted"
                          label="Đến ngày"
                          persistent-hint
                          prepend-icon="event"
                          @blur="date = parseDate(toDateFormatted)"
                        ></v-text-field>
                        <v-date-picker v-model="toDate" no-title @input="menu2 = false" locale="vn"></v-date-picker>
                      </v-menu>
                    </v-flex>                   
                  </v-layout>
                </v-card-text>
            </v-card>
          </div>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>

  // import DatetimePicker from '../ext/DatetimePicker'
  export default {
    props: ['id'],
    components: {
      //DatetimePicker
    },
    data: vm => (
      {
        chooseDate: null,
        fromDate: null,
        toDate: null,
        chooseDateFormatted: null,
        fromDateFormatted: null,
        toDateFormatted: null,
        chooseDateTKThietBi: null,
        fromDateTKThietBi: null,
        toDateTKThietBi: null,
        chooseDateTKThietBiFormatted: null,
        fromDateTKThietBiFormatted: null,
        toDateTKThietBiFormatted: null,
        menu1: false,
        menu2: false,
        menu3: false,
        menu4: false,
        menu5: false,
        menu6: false,
        modal: false,
        timeSelected: '',
        timeTKThietBiSelected: '',
        headers: [
          {
            text: 'Trang',
            align: 'left',
            sortable: false
          },
          {
            text: 'Số lần xem trang',
            align: 'right',
            sortable: false
          }
        ],
        statisticURls: [],
        selects: [
          {text: 'Chọn ngày', value: 'chooseDate'},
          {text: 'Từ ngày đến ngày', value: 'period'},
        ],
        chartDonutOptions: {
          labels: ['Tablet', 'Desktop', 'Mobile'],
          colors: ['#8BC34A', '#FFC107', '#FF4560'],
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Tổng số',
                    color: '#ff5c24'
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
              return w.config.series[seriesIndex]
            }
          },
          legend: {
            position: 'bottom',
            bottom: 0
          }
        },
        seriesDonut: [0, 0, 0]
        }),
    created () {
      var vm = this
      vm.$nextTick(function () {
          vm.timeSelected = 'chooseDate'
          vm.timeTKThietBiSelected = 'chooseDate'
          vm.chooseDate = new Date().toISOString().substr(0, 10)
          vm.chooseDateTKThietBi = new Date().toISOString().substr(0, 10)
      })
    },
    watch: {
      timeSelected (val){
         
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      }
    },
    watch: {
      fromDate (val) {
        this.fromDateFormatted = this.formatDate(this.fromDate)
        this.statisticURl()
      },
      toDate (val) {
        this.toDateFormatted = this.formatDate(this.toDate)
        this.statisticURl()
      },
      chooseDate (val) {
        this.chooseDateFormatted = this.formatDate(this.chooseDate)
        this.statisticURl()
      },
      fromDateTKThietBi (val) {
        this.fromDateTKThietBiFormatted = this.formatDate(this.fromDateTKThietBi)
        this.statisticThietBi()
      },
      toDateTKThietBi (val) {
        this.toDateTKThietBiFormatted = this.formatDate(this.toDateTKThietBi)
        this.statisticThietBi()
      },
      chooseDateTKThietBi (val) {
        this.chooseDateTKThietBiFormatted = this.formatDate(this.chooseDateTKThietBi)
        this.statisticThietBi()
      },
    },
    methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      statisticURl () {
        let vm = this
        let filter = {}
        if(vm.timeSelected === 'period'){
          filter = {
            path: 'period',
            startDay:  vm.fromDate,
            endDay: vm.toDate
          }
        } else {
          let [year, month, day] = vm.chooseDate.split('-')
          filter = {
            path: 'year',
            day,
            month,
            year
          }
        }
        vm.$store.dispatch('statisticURl', filter).then(function (result) {
          vm.statisticURls = result.accessStatisticsURL
        }).catch(reject => {
          vm.statisticURls = []
          console.log(reject)
        })
      },
      statisticThietBi () {
        let vm = this
        let filter = {}
        if(vm.timeSelected === 'period'){
          filter = {
            path: 'period',
            startDay:  vm.fromDateTKThietBi,
            endDay: vm.toDateTKThietBi
          }
        } else {
          let [year, month, day] = vm.chooseDateTKThietBi.split('-')
          filter = {
            path: 'day',
            day,
            month,
            year
          }
        }
        vm.$store.dispatch('statisticThietBi', filter).then(function (result) {
          vm.seriesDonut = [result.accessStatistics.tablet, result.accessStatistics.desktop, result.accessStatistics.mobile]
        }).catch(reject => {
          vm.seriesDonut = [0,0,0]
          console.log(reject)
        })
      },
      subString (str) {
        if (!str){
          return str
        } else {
          let indexstr = str.lastIndexOf('?')
          if(indexstr > 0) {
            return str.substr(0,indexstr)
          } else {
            return str
          }
          
        }
      }

    }
  }
</script>
    