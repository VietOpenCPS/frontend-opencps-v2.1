<template>
  <div>
    <line-chart class="mt-3 pl-2"></line-chart>
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
    let labelsCustomMonth = {}
    let monthData = {}
    let lineDataMonth = {}
    for (let key in vm.item_array) {
      if (String(vm.item_array[key].govAgencyCode) === '' && String(vm.item_array[key].domainName) === '') {
      } else {
        if (vm.item_array[key].month > 0) {
          labelsCustomMonth['Tháng ' + vm.item_array[key].month] = vm.item_array[key].month
          if (vm.item_array[key].govAgencyName !== '') {
            if (monthData[vm.item_array[key].govAgencyName] !== null && monthData[vm.item_array[key].govAgencyName] !== undefined) {
              monthData[vm.item_array[key].govAgencyName].push({
                month: vm.item_array[key].month,
                total: vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
              })
            } else {
              monthData[vm.item_array[key].govAgencyName] = []
              monthData[vm.item_array[key].govAgencyName].push({
                month: vm.item_array[key].month,
                total: vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
              })
            }
          } else {
            if (monthData[vm.item_array[key].domainName] !== null && monthData[vm.item_array[key].domainName] !== undefined) {
              monthData[vm.item_array[key].domainName].push({
                month: vm.item_array[key].month,
                total: vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
              })
            } else {
              monthData[vm.item_array[key].domainName] = []
              monthData[vm.item_array[key].domainName].push({
                month: vm.item_array[key].month,
                total: vm.item_array[key].undueCount + vm.item_array[key].overdueCount + vm.item_array[key].waitingCount + vm.item_array[key].betimesCount + vm.item_array[key].ontimeCount + vm.item_array[key].overtimeCount
              })
            }
          }
        }
      }
    }
    console.log('monthData', monthData)
    let dataOfLine = {}
    for (let key in monthData) {
      let lineProcessData = {
        label: key,
        borderColor: '#' + vm.intToRGB(vm.hashCode(key)),
        backgroundColor: '#' + vm.intToRGB(vm.hashCode(key)),
        data: []
      }
      for (let keyArray in monthData[key]) {
        lineProcessData.data.push(monthData[key][keyArray].total)
      }
      datasetsCustom.push(lineProcessData)
    }
    console.log('datasetsCustom', datasetsCustom)
    const lineChartData = {
      labels: Object.keys(labelsCustomMonth),
      datasets: datasetsCustom
    }
    Vue.component('line-chart', {
      extends: VueChartJs.Line,
      mounted () {
        this.renderChart(lineChartData, {
          responsive: true,
          maintainAspectRatio: false
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
