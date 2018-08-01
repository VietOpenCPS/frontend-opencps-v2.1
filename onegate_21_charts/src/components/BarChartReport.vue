<template>
  <div>
    <line-chart class="mt-3"></line-chart>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.js'
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
  created () {
    let vm = this
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
    let daGiaiQuyetSomHan = []
    let daGiaiQuyetDungHan = []
    let daGiaiQuyetQuaHan = []
    for (let key in vm.item_array) {
      if (String(vm.item_array[key].govAgencyCode) !== '') {
        labelsCustom.push(vm.item_array[key].govAgencyName)
        dangXuLyConHan.push(vm.item_array[key].undueCount)
        dangXuLyQuaHan.push(vm.item_array[key].overdueCount)
        daGiaiQuyetSomHan.push(vm.item_array[key].betimesCount)
        daGiaiQuyetDungHan.push(vm.item_array[key].ontimeCount)
        daGiaiQuyetQuaHan.push(vm.item_array[key].overtimeCount)
      }
    }
    datasetsCustom[0]['data'] = dangXuLyConHan
    datasetsCustom[1]['data'] = dangXuLyQuaHan
    datasetsCustom[2]['data'] = daGiaiQuyetSomHan
    datasetsCustom[3]['data'] = daGiaiQuyetDungHan
    datasetsCustom[4]['data'] = daGiaiQuyetQuaHan
    Vue.component('line-chart', {
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
  }
}
</script>
