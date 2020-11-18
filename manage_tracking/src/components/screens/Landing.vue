<template>
  <div style="width: 1300px; margin: 0 auto; background-color: #eaf0f7;">
    <v-layout wrap class="px-2">
      <v-flex xs12 md6 class="px-2">
        <v-layout wrap class="">
          <v-flex xs6 class="pr-2 py-3">
            <div class="px-3 py-3" style="background: #17c6b4;border-radius: 7px;">
              <div class="">
                <div class="">
                  <i class="fa fa-paper-plane" style="color: #fff;font-size: 20px;background: #FFC107;
                    padding: 10px;border-radius: 50%;float:right;width:45px;height:45px;font-weight: 500;"></i>
                </div>
                <div class="white--text">
                  <h6 class="mb-2" style="font-size: 14px;font-weight: 500;">LƯỢT TRUY CẬP</h6>
                  <h4 class=""><label style="margin-bottom: 0px;font-size: 26px">11.146</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs6 class="pl-2 py-3">
            <div class="px-3 py-3" style="background: #17c6b4;border-radius: 7px;">
              <div class="">
                <div class="">
                  <i class="fa fa-user-plus" style="color: #fff;font-size: 20px;background: #FFC107;
                  padding: 10px;border-radius: 50%;float:right;width:45px;height:45px;font-weight:500;"></i>
                </div>
                <div class="white--text">
                  <h6 class="mb-2" style="font-size: 14px;font-weight: 500;">NGƯỜI DÙNG</h6>
                  <h4 class=""><label style="margin-bottom: 0px;font-size: 26px">5.146</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs12 class="">
            <div class="v-sheet theme--light" style="border-radius: 7px;">
              <div class="pl-3" style="height: 42px;
                font-size: 14px;
                font-weight: 500;
                background: #17c6b4;
                line-height: 42px;
                color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <div class="">ĐANG TRUY CẬP</div>
              </div>
              <v-card-text class="px-0 py-0">
                <v-layout wrap class="custom-class" style="height: 250px">
                  <v-flex xs6 class="px-2" style="padding-top: 35px;">
                    <div class="text-xs-center" style="color: #1d9488">
                      <div style="font-size: 48px; font-weight: 900; margin: 10px 20px 20px;">
                        <span><label style="margin-bottom: 0px;">198</label></span>
                      </div>
                      <span>
                        <b>198 </b> lượt truy cập và <b>368 </b> hành động <br> trong <b>3 </b> phút gần đây 
                      </span>
                    </div>
                  </v-flex>
                  <v-flex xs6></v-flex>
                </v-layout>
                
              </v-card-text>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md6 class="my-3 px-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">TRUY CẬP THEO THỜI GIAN</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <apexchart type="line" height="350" ref="chart" :options="chartOptionsLineType" :series="seriesLineType"></apexchart>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">TRÌNH DUYỆT TRUY CẬP</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
      <v-flex xs12 md6 class="pa-2">
        <div class="v-sheet theme--light" style="border-radius: 7px;">
          <div class="pl-3" style="height: 42px;
            font-size: 14px;
            font-weight: 500;
            background: #17c6b4;
            line-height: 42px;
            color: #fff;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <div class="">THIẾT BỊ TRUY CẬP</div>
          </div>
          <v-card-text class="px-0 py-0">
            <v-layout wrap class="custom-class">
              <v-flex xs12>
                <!-- <apexchart class="colum-chart" type="bar" height="300" :options="chartOptionsColumn" :series="seriesColumn"></apexchart> -->
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
      </v-flex>
    </v-layout>
    <!--  -->
    <v-dialog v-model="dialog_visitor" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="">Thông tin người dùng</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog_visitor = false">
              <v-icon size="24">clear</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"
import TinyPagination from './Pagination.vue'
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    loading: false,
    dialog_visitor: false,
    seriesLineType: [
      {data: [20, 31, 31, 39, 56, 61, 85, 195, 163, 190, 205, 252, 299, 353, 415]}
    ],
    chartOptionsLineType: {
      chart: {
        height: 350,
        type: "line",
        group: "detail",
        id: "areachart-1",
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },

      labels: ["14 Mar 2020", "15 Mar 2020", "16 Mar 2020", "17 Mar 2020", "18 Mar 2020", "19 Mar 2020", "20 Mar 2020", "21 Mar 2020",
      "22 Mar 2020",
      "23 Mar 2020",
      "24 Mar 2020",
      "25 Mar 2020",
      "26 Mar 2020",
      "27 Mar 2020",
      "28 Mar 2020"],
      xaxis: {
        type: "datetime"
      }
    },
  }),
  computed: {
    
  },
  created() {
    let vm = this
    vm.$nextTick(() => {

    })
  },
  watch: {
    
  },
  methods: {
    getStatisticsYear() {
      let vm = this
      let config = {
        url: "/o/rest/statistics",
        headers: {
          groupId: window.themeDisplay.getScopeGroupId(),
          Accept: "application/json"
        },
        params: {
          year: vm.yearSelected,
          month: 0,
          domain: 'total',
          agency: 'total'
        }
      };
      axios
        .request(config)
        .then(function(response) {
          if (response.data.data) {
            vm.statistics = response.data.data[0]
            vm.statisticalYear = [
              response.data.data[0].ontimeCount + response.data.data[0].betimesCount,
              response.data.data[0].overtimeCount
            ];
          } else {
            vm.statisticalYear = [0, 0]
            vm.statistics = {
              receivedCount: 0,
              releaseCount: 0,
              processingCount: 0,
              overtimeCount: 0
            }
          }
        })
        .catch();
    }
  }
};
</script>
