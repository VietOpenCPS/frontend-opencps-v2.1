<template>
  <div style="width: 1300px; margin: 0 auto; background-color: #eaf0f7;">
    <v-layout wrap>
      <v-flex xs12 md6 class="pa-2">
        <v-layout wrap class="">
          <v-flex xs6 class="px-3 py-3" style="background: #00bcd5;">
            <div class="px-2 py-2">
              <div class="">
                <div class="">
                  <i class="fa fa-location-arrow float-right" style="color: #fff;font-size: 20px;background: #FFC107;padding: 20px;border-radius: 50%;"></i>
                </div>
                <div class="text-white">
                  <h6 class="mb-3">LƯỢT TRUY CẬP</h6>
                  <h4 class="mb-4"><label style="margin-bottom: 0px;">11.146</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex xs6 class="px-3 py-3" style="background: #00bcd5;">
            <div class="px-2 py-2">
              <div class="">
                <div class="">
                  <i class="fa fa-user-edit float-right" style="color: #fff;font-size: 20px;background: #FFC107;padding: 20px;border-radius: 50%;"></i>
                </div>
                <div class="text-white">
                  <h6 class="mb-3">NGƯỜI DÙNG</h6>
                  <h4 class="mb-4"><label style="margin-bottom: 0px;">5.146</label></h4>
                </div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md7 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header mb-1" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1">TRUY CẬP THEO THỜI GIAN</div>
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
      <v-flex xs12 md6 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1" style="width: auto;">TRÌNH DUYỆT</div>
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
      <v-flex xs12 md6 class="pa-2">
        <div class="pa-2 v-sheet theme--light" style="border: 1px solid #dedede;">
          <div class="row-header" style="height: 38px; overflow: hidden;background: #fff">
            <div class="background-triangle-big1" style="width: auto;">THIẾT BỊ TRUY CẬP</div>
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
    dialog_visitor: false
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
