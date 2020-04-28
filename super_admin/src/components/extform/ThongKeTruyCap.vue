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
        <v-flex xs12 sm6>
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
        </v-flex>
        <v-flex xs12 sm6>
            <v-card>
                <v-card-text>
                  <v-data-table
                    :headers="headers"
                    :items="items"
                    hide-actions
                  >
                    <template slot="items" slot-scope="props">
                      <tr>
                        <td class="text-xs-left">{{props.item.page}}</td>
                        <td class="text-xs-right">{{props.item.count}}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>
  
  export default {
    props: ['id'],
    data () {
        return {
          series: [
            {
              name: "High - 2013",
              data: [28, 29, 33, 36, 32, 32, 33]
            },
            {
              name: "Low - 2013",
              data: [12, 11, 14, 18, 17, 13, 13]
            }
          ],
          chartOptions: {
            chart: {
              height: 350,
              type: 'line',
              dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
              },
              toolbar: {
                show: false
              }
            },
            colors: ['#77B6EA', '#545454'],
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: 'smooth'
            },
            title: {
              text: 'Average High & Low Temperature',
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            markers: {
              size: 1
            },
            xaxis: {
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
              title: {
                text: 'Month'
              }
            },
            yaxis: {
              title: {
                text: 'Temperature'
              },
              min: 5,
              max: 40
            },
            legend: {
              position: 'top',
              horizontalAlign: 'right',
              floating: true,
              offsetY: -25,
              offsetX: -5
            }
          },
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
          items: [
            {page: '/web/cong-dich-vu-cong/dich-vu-cong', count: 233},
            {page: '/web/cong-dich-vu-cong/dich-vu-cong', count: 233},
            {page: '/web/cong-dich-vu-cong/dich-vu-cong', count: 233},
            {page: '/web/cong-dich-vu-cong/dich-vu-cong', count: 233},
            {page: '/web/cong-dich-vu-cong/dich-vu-cong', count: 233},
          ]
        }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
          
      })
    },
    computed: {
    },
    watch: {},
    methods: {}
  }
</script>
    