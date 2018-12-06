<template>
  <pie-chart :width="200" :height="200"></pie-chart>
</template>

<script>
import Vue from 'vue'
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
    },
    chart_view: {
      type: Boolean
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
            position: 'top'
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
