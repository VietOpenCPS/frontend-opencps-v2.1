<template>
  <v-card class="mt-3" style="border-radius: 0;">
    <v-card-title class="headline" v-if="govAgencyCode === ''">
      {{item.govAgencyName}}
      <a class="detail__pie" href="javascript:;" @click="toDetailReport()"> Chi tiết</a>
    </v-card-title>
    <v-card-title class="headline" v-else>
      {{item.domainName}}
    </v-card-title>
    <v-card-text class="pt-2 pb-0 px-0">
      <pie-chart :width="200" :height="200"></pie-chart>
      <div style="line-height: 30px;position: absolute;margin-top: -36px;border-radius: 4px;border: 1px solid #0d71bb94;padding: 0 5px;margin-left: 10px;color: #0d71bb;font-size: 12px;"> 
        &nbsp;Tỷ lệ đúng hạn: 
        <span class="text-bold" style="line-height: 30px;font-size: 12px;">&nbsp;&nbsp;{{item.ontimePercentage}} %</span></div>

      <div style="line-height: 30px;position: absolute;margin-top: -65px;padding: 0 5px;margin-left: 5px;font-size: 12px;"> 
        &nbsp;Tổng số hồ sơ:
        <span class="text-bold" style="line-height: 30px;font-size: 12px;">&nbsp;&nbsp;{{item.undueCount + item.overdueCount + item.waitingCount + item.betimesCount + item.ontimeCount + item.overtimeCount}}</span></div>

    </v-card-text>
  </v-card>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.js'
import VueChartJs from 'vue-chartjs'
import 'chart.piecelabel.js'

export default {
  props: {
    item: {
      type: Object,
      default () {
        return {
        }
      }
    },
    year: {
      type: String
    },
    month: {
      type: String
    }
  },
  data: () => ({
    govAgencyCode: ''
  }),
  created () {
    let vm = this
    let currentQuerys = vm.$router.history.current.query
    if (currentQuerys.hasOwnProperty('govAgencyCode')) {
      vm.govAgencyCode = currentQuerys.govAgencyCode
    }
    Vue.component('pie-chart', {
      extends: VueChartJs.Pie,
      mounted () {
        this.renderChart({
          labels: ['Đang xử lý còn hạn', 'Đang xử lý quá hạn', 'Đang bổ sung điều kiện', 'Đã giải quyết sớm hạn', 'Đã giải quyết đúng hạn', 'Đã giải quyết quá hạn'],
          datasets: [
            {
              backgroundColor: [
                '#A5D6A7',
                '#EF9A9A',
                '#78909C',
                '#90CAF9',
                '#1565C0',
                '#C62828'
              ],
              data: [
                vm.item.undueCount,
                vm.item.overdueCount,
                vm.item.waitingCount,
                vm.item.betimesCount,
                vm.item.ontimeCount,
                vm.item.overtimeCount
              ]
            }
          ]
        }, {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: 'left',
            labels: {
              padding: 10
            }
          },
          pieceLabel: {
            render: 'value',
            fontSize: 12,
            fontColor: '#fff',
            fontStyle: 'bold'
          }
        })
      }
    })
  },
  methods: {
    toDetailReport () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuerys = vm.$router.history.current.query
      vm.$router.push({
        path: '/bao-cao/' + currentParams.index,
        query: {
          year: vm.year,
          month: vm.month,
          group: vm.group,
          reportGovName: vm.item.govAgencyName,
          govAgencyCode: vm.item.govAgencyCode
        }
      })
    }
  }
}
</script>
