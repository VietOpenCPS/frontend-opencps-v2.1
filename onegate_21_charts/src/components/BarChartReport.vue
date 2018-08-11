<template>
  <div>
    <bar-chart-vertical class="mt-3"></bar-chart-vertical>
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
    const horizonalLinePlugin = {
      id: 'horizontalLine',
      afterDraw: function (chartInstance) {
        let yValue
        let yScale = chartInstance.scales['y-axis-0']
        let canvas = chartInstance.chart
        let ctx = canvas.ctx
        let index
        let line
        let style
        if (chartInstance.options.horizontalLine) {
          for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
            line = chartInstance.options.horizontalLine[index]
            if (!line.style) {
              style = '#080808'
            } else {
              style = line.style
            }
            if (line.y) {
              yValue = yScale.getPixelForValue(line.y)
            } else {
              yValue = 0
            }
            ctx.lineWidth = 3
            if (yValue) {
              window.chart = chartInstance
              ctx.beginPath()
              ctx.moveTo(0, yValue)
              ctx.lineTo(canvas.width, yValue)
              ctx.strokeStyle = style
              ctx.stroke()
            }
            if (line.text) {
              ctx.fillStyle = style
              ctx.fillText(line.text, 0, yValue + ctx.lineWidth)
            }
          }
          return
        }
      }
    }
    let labelsCustom = []
    let datasetsCustom = [
      {
        label: 'Đang xử lý còn hạn',
        backgroundColor: '#A5D6A7'
      },
      {
        label: 'Đang xử lý quá hạn',
        backgroundColor: '#EF9A9A'
      },
      {
        label: 'Đang bổ sung điều kiện',
        backgroundColor: '#78909C'
      },
      {
        label: 'Đã giải quyết sớm hạn',
        backgroundColor: '#90CAF9'
      },
      {
        label: 'Đã giải quyết đúng hạn',
        backgroundColor: '#1565C0'
      },
      {
        label: 'Đã giải quyết quá hạn',
        backgroundColor: '#C62828'
      }
    ]
    let dangXuLyConHan = []
    let dangXuLyQuaHan = []
    let dangBoSungDieuKien = []
    let daGiaiQuyetSomHan = []
    let daGiaiQuyetDungHan = []
    let daGiaiQuyetQuaHan = []
    let monthData = {}
    for (let key in vm.item_array) {
      if (String(vm.item_array[key].govAgencyCode) === '' && String(vm.item_array[key].domainName) === '') {
      } else {
        if (vm.item_array[key].month > 0) {
          if (vm.item_array[key].govAgencyName !== '') {
            if (monthData[vm.item_array[key].govAgencyName] !== null && monthData[vm.item_array[key].govAgencyName] !== undefined) {
              monthData[vm.item_array[key].govAgencyName] = {
                undueCount: vm.item_array[key].undueCount,
                overdueCount: vm.item_array[key].overdueCount,
                betimesCount: vm.item_array[key].betimesCount,
                ontimeCount: vm.item_array[key].ontimeCount,
                overtimeCount: vm.item_array[key].overtimeCount,
                waitingCount: vm.item_array[key].waitingCount
              }
            } else {
              monthData[vm.item_array[key].govAgencyName] = {}
              monthData[vm.item_array[key].govAgencyName] = {
                undueCount: vm.item_array[key].undueCount,
                overdueCount: vm.item_array[key].overdueCount,
                betimesCount: vm.item_array[key].betimesCount,
                ontimeCount: vm.item_array[key].ontimeCount,
                overtimeCount: vm.item_array[key].overtimeCount,
                waitingCount: vm.item_array[key].waitingCount
              }
            }
          } else {
            if (monthData[vm.item_array[key].domainName] !== null && monthData[vm.item_array[key].domainName] !== undefined) {
              monthData[vm.item_array[key].domainName] = {
                undueCount: vm.item_array[key].undueCount,
                overdueCount: vm.item_array[key].overdueCount,
                betimesCount: vm.item_array[key].betimesCount,
                ontimeCount: vm.item_array[key].ontimeCount,
                overtimeCount: vm.item_array[key].overtimeCount,
                waitingCount: vm.item_array[key].waitingCount
              }
            } else {
              monthData[vm.item_array[key].domainName] = {}
              monthData[vm.item_array[key].domainName] = {
                undueCount: vm.item_array[key].undueCount,
                overdueCount: vm.item_array[key].overdueCount,
                betimesCount: vm.item_array[key].betimesCount,
                ontimeCount: vm.item_array[key].ontimeCount,
                overtimeCount: vm.item_array[key].overtimeCount,
                waitingCount: vm.item_array[key].waitingCount
              }
            }
          }
        }
      }
    }
    for (let key in monthData) {
      labelsCustom.push(key)
      let currentObj = monthData[key]
      dangXuLyConHan.push(currentObj.undueCount)
      dangXuLyQuaHan.push(currentObj.overdueCount)
      daGiaiQuyetSomHan.push(currentObj.betimesCount)
      daGiaiQuyetDungHan.push(currentObj.ontimeCount)
      daGiaiQuyetQuaHan.push(currentObj.overtimeCount)
      dangBoSungDieuKien.push(currentObj.waitingCount)
    }
    /*
    for (let key in vm.item_array) {
      if (String(vm.item_array[key].govAgencyCode) === '' && String(vm.item_array[key].domainName) === '') {
      } else {
      }
    }
    */
    datasetsCustom[0]['data'] = dangXuLyConHan
    datasetsCustom[1]['data'] = dangXuLyQuaHan
    datasetsCustom[2]['data'] = dangBoSungDieuKien
    datasetsCustom[3]['data'] = daGiaiQuyetSomHan
    datasetsCustom[4]['data'] = daGiaiQuyetDungHan
    datasetsCustom[5]['data'] = daGiaiQuyetQuaHan
    Vue.component('bar-chart-vertical', {
      extends: VueChartJs.Bar,
      beforeMount () {
        this.addPlugin(horizonalLinePlugin)
      },
      mounted () {
        this.renderChart({
          labels: labelsCustom,
          datasets: datasetsCustom
        }, {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              stacked: true,
              categoryPercentage: 0.5,
              barPercentage: 1
            }],
            yAxes: [{
              stacked: true
            }]
          }
        })
      }
    })
  }
}
</script>
