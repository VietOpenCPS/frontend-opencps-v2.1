<template>
  <div>
    <bar-chart-horizontal class="mt-3"></bar-chart-horizontal>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import VueChartJs from 'vue-chartjs'
import 'chart.piecelabel.js'

export default {
  props: {
    item_array: {
      type: Array,
      default () {
        return []
      }
    },
    year: {
      type: String
    },
    month: {
      type: String
    },
    gov_agency_code: {
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
    let datasetsCustom = []
    let monthData = {}
    for (let key in vm.item_array) {
      if (String(vm.item_array[key].govAgencyCode) === '' && String(vm.item_array[key].domainName) === '') {
      } else {
        if (vm.item_array[key].month > 0) {
          if (vm.gov_agency_code === '' && vm.item_array[key].govAgencyName !== '') {
            if (monthData[vm.item_array[key].govAgencyName] !== null && monthData[vm.item_array[key].govAgencyName] !== undefined) {
              monthData[vm.item_array[key].govAgencyName] = vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
            } else {
              monthData[vm.item_array[key].govAgencyName] = 0
              monthData[vm.item_array[key].govAgencyName] = vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
            }
          } else if (vm.gov_agency_code !== '' && vm.item_array[key].domainName !== '' || (!vm.chart_view && vm.item_array[key].domainName !== '')) {
            if (monthData[vm.item_array[key].domainName] !== null && monthData[vm.item_array[key].domainName] !== undefined) {
              monthData[vm.item_array[key].domainName] = vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
            } else {
              monthData[vm.item_array[key].domainName] = 0
              monthData[vm.item_array[key].domainName] = vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
            }
          }
        }
      }
    }
    let dataOfLine = {}
    for (let key in monthData) {
      let lineProcessData = {
        label: key,
        backgroundColor: '#' + vm.intToRGB(vm.hashCode(key)),
        data: [monthData[key], 0]
      }
      datasetsCustom.push(lineProcessData)
    }
    console.log('datasetsCustom', datasetsCustom)
    const lineChartData = {
      datasets: datasetsCustom
    }
    Vue.component('bar-chart-horizontal', {
      extends: VueChartJs.HorizontalBar,
      mounted () {
        this.renderChart(lineChartData, {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: (vm.gov_agency_code === '' && vm.chart_view) ? 'Danh sách cơ quan' : 'Danh sách lĩnh vực'
                }
              }
            ]
          }
        })
      }
    })
  },
  methods: {
    hashCode (str) {
      var hash = 0
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    },
    intToRGB (i) {
      var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
      return '00000'.substring(0, 6 - c.length) + c
    }
  }
}
</script>
