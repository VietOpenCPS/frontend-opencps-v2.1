<template>
  <div class="form_admin_thongke">
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item>Thống kê truy cập</v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout wrap>
      <v-flex xs12 md6 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">Số phiên theo thiết bị</div>
            <div style="display: flex;">
              <v-select
                :items="selects"
                item-text="text"
                item-value="value"
                v-model="timeTKThietBiSelected"
                solo
              ></v-select>
              <div class="ml-2" v-if="timeTKThietBiSelected === 'chooseDate'">
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
                    append-icon="event"
                    @blur="date = parseDate(chooseDateTKThietBiFormatted)"
                    solo
                  ></v-text-field>
                  <v-date-picker
                    v-model="chooseDateTKThietBi"
                    no-title
                    @input="menu4 = false"
                    locale="vi"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div class="ml-2" v-if="timeTKThietBiSelected === 'period'">
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
                      append-icon="event"
                      solo
                      @blur="date = parseDate(fromDateTKThietBiFormatted)"
                    ></v-text-field>
                    <v-date-picker
                      v-model="fromDateTKThietBi"
                      no-title
                      @input="menu5 = false"
                      locale="vi"
                    ></v-date-picker>
                  </v-menu>
              </div>
              <div class="ml-2" v-if="timeTKThietBiSelected === 'period'">
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
                    solo
                    append-icon="event"
                    @blur="date = parseDate(toDateTKThietBiFormatted)"
                  ></v-text-field>
                  <v-date-picker
                    v-model="toDateTKThietBi"
                    no-title
                    @input="menu6 = false"
                    locale="vi"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
          </div>
          <v-layout wrap align-center style="height: 265px;">
            <v-flex xs12>
                <apexchart
                  type="donut"
                  :options="chartDonutOptions"
                  :series="seriesDonut"
                  height="250"
                ></apexchart>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">Số lượt truy cập vào hệ thống</div>
            <div style="display: flex;">
              <div class="ml-2">
                    <v-menu
                      ref="menu8"
                      :close-on-content-click="false"
                      v-model="menu8"
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
                        v-model="fromDateTKSoLuotTruyCapFormatted"
                        label="Từ ngày"
                        persistent-hint
                        append-icon="event"
                        @blur="date = parseDate(fromDateTKSoLuotTruyCapFormatted)"
                        solo
                      ></v-text-field>
                      <v-date-picker
                        v-model="fromDateTKSoLuotTruyCap"
                        no-title
                        @input="menu8 = false"
                        locale="vi"
                      ></v-date-picker>
                    </v-menu>
              </div>
              <div class="ml-2">
                <v-menu
                  ref="menu7"
                  :close-on-content-click="false"
                  v-model="menu7"
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
                    v-model="toDateTKSoLuotTruyCapFormatted"
                    label="Đến ngày"
                    persistent-hint
                    append-icon="event"
                    solo
                    @blur="date = parseDate(toDateTKSoLuotTruyCapFormatted)"
                  ></v-text-field>
                  <v-date-picker
                    v-model="toDateTKSoLuotTruyCap"
                    no-title
                    @input="menu7 = false"
                    locale="vi"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
          </div>
          <v-layout wrap align-center style="height: 265px;">
            <v-flex xs12>
                <apexchart
                  type="line"
                  height="250"
                  :options="chartOptionsSoLuotTruyCap"
                  :series="seriesSoLuotTruyCap"
                ></apexchart>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
      <v-flex xs12 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">Người dùng truy cập những trang</div>
            <div style="display: flex;">
              <v-select
                :items="selects"
                item-text="text"
                item-value="value"
                v-model="timeSelected"
                solo
              ></v-select>
              <div class="ml-2" v-if="timeSelected === 'chooseDate'">
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
                    append-icon="event"
                    @blur="date = parseDate(chooseDateFormatted)"
                    solo
                  ></v-text-field>
                  <v-date-picker v-model="chooseDate" no-title @input="menu3 = false" locale="vi"></v-date-picker>
                </v-menu>
              </div>
              <div class="ml-2" v-if="timeSelected === 'period'">
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
                      append-icon="event"
                      @blur="date = parseDate(fromDateFormatted)"
                      solo
                    ></v-text-field>
                    <v-date-picker v-model="fromDate" no-title @input="menu1 = false" locale="vi"></v-date-picker>
                  </v-menu>
              </div>
              <div class="ml-2" v-if="timeSelected === 'period'">
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
                      append-icon="event"
                      @blur="date = parseDate(toDateFormatted)"
                      solo
                    ></v-text-field>
                    <v-date-picker v-model="toDate" no-title @input="menu2 = false" locale="vi"></v-date-picker>
                  </v-menu>
              </div>
            </div>
          </div>
          <v-layout wrap align-center>
            <v-flex xs12>
                <v-data-table
                  :headers="headers"
                  :items="statisticURls"
                  rows-per-page-text="Số dòng hiển thị"
                >
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td class="text-xs-left">{{subString(props.item.url)}}</td>
                      <td class="text-xs-right">{{props.item.value}}</td>
                    </tr>
                  </template>
                </v-data-table>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import DatetimePicker from '../ext/DatetimePicker'
export default {
  props: ["id"],
  components: {
    //DatetimePicker
  },
  data: vm => ({
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
    fromDateTKSoLuotTruyCap: null,
    toDateTKSoLuotTruyCap: null,
    toDateTKSoLuotTruyCapFormatted: null,
    fromDateTKSoLuotTruyCapFormatted: null,
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
    menu6: false,
    modal: false,
    menu8: false,
    menu7: false,
    timeSelected: "",
    timeTKThietBiSelected: "",
    headers: [
      {
        text: "Trang",
        align: "left",
        sortable: false
      },
      {
        text: "Số lần xem trang",
        align: "right",
        sortable: false
      }
    ],
    statisticURls: [],
    selects: [
      { text: "Chọn ngày", value: "chooseDate" },
      { text: "Tùy chỉnh", value: "period" }
    ],
    chartDonutOptions: {
      labels: ["Tablet", "Desktop", "Mobile"],
      colors: ["#8BC34A", "#FFC107", "#FF4560"],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "Tổng số",
                color: "#ff5c24"
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(value, { seriesIndex, dataPointIndex, w }) {
          return w.config.series[seriesIndex];
        }
      },
      legend: {
        position: "bottom",
        bottom: 0
      }
    },
    seriesDonut: [0, 0, 0],
    seriesSoLuotTruyCap: [
      {
        name: "Số người truy cập",
        data: [
        ]
      }
    ],
    chartOptionsSoLuotTruyCap: {
      chart: {
        type: "line",
        height: 250,
        locales: [{
          "name": "vi",
          "options": {
            "months": ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            "shortMonths": ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
            "days": ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"], //hãy nhớ rằng chủ nhật là ngày đầu tuần nhé
            "shortDays": ["CN", "t2", "t3", "t4", "t5", "t6", "t7"],
            "toolbar": { //tooltip hiển thị khi bạn hover vào các icon tương ứng
                "exportToSVG": "Tải định dạng SVG",
                "exportToPNG": "Tải định dạng PNG",
                "zoomIn": "Phóng to",
                "zoomOut": "Thu nhỏ",
                "pan": "Panning", //cái này mình cũng ko biết dịch sao, đại loại là bạn sẽ click chọn 1 vùng thì sẽ phóng to vùng đấy lên 
                "reset": "Cài đặt lại"
            }
          }
        }],
        defaultLocale: "vi"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        type: 'datetime',
      },
    }
  }),
  created() {
    var vm = this;
    vm.$nextTick(function() {
      vm.timeSelected = "chooseDate";
      vm.timeTKThietBiSelected = "chooseDate";
      vm.chooseDate = new Date().toISOString().substr(0, 10);
      vm.chooseDateTKThietBi = new Date().toISOString().substr(0, 10);

      var ourDate = new Date();
      var pastDate = ourDate.getDate() - 7;
      ourDate.setDate(pastDate);
      
      vm.fromDateTKSoLuotTruyCap = ourDate.toISOString().substr(0, 10);
      vm.toDateTKSoLuotTruyCap = new Date().toISOString().substr(0, 10);
    });
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },
  watch: {
    fromDate(val) {
      this.fromDateFormatted = this.formatDate(this.fromDate);
      this.statisticURl();
    },
    toDate(val) {
      this.toDateFormatted = this.formatDate(this.toDate);
      this.statisticURl();
    },
    chooseDate(val) {
      this.chooseDateFormatted = this.formatDate(this.chooseDate);
      this.statisticURl();
    },
    fromDateTKThietBi(val) {
      this.fromDateTKThietBiFormatted = this.formatDate(this.fromDateTKThietBi);
      this.statisticThietBi();
    },
    toDateTKThietBi(val) {
      this.toDateTKThietBiFormatted = this.formatDate(this.toDateTKThietBi);
      this.statisticThietBi();
    },
    chooseDateTKThietBi(val) {
      this.chooseDateTKThietBiFormatted = this.formatDate(
        this.chooseDateTKThietBi
      );
      this.statisticThietBi();
    },
    fromDateTKSoLuotTruyCap () {
      this.fromDateTKSoLuotTruyCapFormatted = this.formatDate(this.fromDateTKSoLuotTruyCap)
      this.statisticSoLuotTruyCap()
    },
    toDateTKSoLuotTruyCap () {
      this.toDateTKSoLuotTruyCapFormatted = this.formatDate(this.toDateTKSoLuotTruyCap)
      this.statisticSoLuotTruyCap()
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    statisticURl() {
      let vm = this;
      let filter = {};
      if (vm.timeSelected === "period") {
        filter = {
          path: "period",
          startDay: vm.fromDate,
          endDay: vm.toDate
        };
      } else {
        let [year, month, day] = vm.chooseDate.split("-");
        filter = {
          path: "year",
          day,
          month,
          year
        };
      }
      vm.$store
        .dispatch("statisticURl", filter)
        .then(function(result) {
          vm.statisticURls = result.accessStatisticsURL;
        })
        .catch(reject => {
          vm.statisticURls = [];
          console.log(reject);
        });
    },
    statisticThietBi() {
      let vm = this;
      let filter = {};
      if (vm.timeTKThietBiSelected === "period") {
        filter = {
          path: "period",
          startDay: vm.fromDateTKThietBi,
          endDay: vm.toDateTKThietBi
        };
      } else {
        let [year, month, day] = vm.chooseDateTKThietBi.split("-");
        filter = {
          path: "day",
          day,
          month,
          year
        };
      }
      vm.$store
        .dispatch("statisticThietBi", filter)
        .then(function(result) {
          vm.seriesDonut = [
            result.accessStatistics.tablet,
            result.accessStatistics.desktop,
            result.accessStatistics.mobile
          ];
        })
        .catch(reject => {
          vm.seriesDonut = [0, 0, 0];
          console.log(reject);
        });
    },
    statisticSoLuotTruyCap() {
      let vm = this;
      if(vm.fromDateTKSoLuotTruyCap && vm.toDateTKSoLuotTruyCap){
        let filter = {};
        filter = {
          path: "period",
          startDay: vm.fromDateTKSoLuotTruyCap,
          endDay: vm.toDateTKSoLuotTruyCap
        };
        vm.$set(vm.seriesSoLuotTruyCap, 0, {name: "Số người truy cập",data: []})
        vm.$store
          .dispatch("statisticThietBi", filter)
          .then(function(result) {
            let data = []
            result.detail.forEach(e=>{  
              data.push(
                {
                  x: new Date(e.day).getTime(),
                  y: e.count
                }
              )
            })
            vm.$set(vm.seriesSoLuotTruyCap, 0, {name: "Số người truy cập",data: data})
          })
          .catch(reject => {
            console.log(reject);
          });
      }

    },
    subString(str) {
      if (!str) {
        return str;
      } else {
        let indexstr = str.lastIndexOf("?");
        if (indexstr > 0) {
          return str.substr(0, indexstr);
        } else {
          return str;
        }
      }
    }
  }
};
</script>
    