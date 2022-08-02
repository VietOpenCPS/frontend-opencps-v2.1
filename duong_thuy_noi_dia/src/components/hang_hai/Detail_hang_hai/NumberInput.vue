<template id="custominput">
  <input type="text" style="width: 100%; max-width: -webkit-fill-available; position: relative; border: 1px solid blue; height: 22px;" class="form-control input-number" @keydown.up.prevent="increment" @keydown.down.prevent="decrement" :value="active?val:formatted" :disabled="disabled" :style="{'text-align': align, 'padding-right': align === 'right' ? '3px' : 0, 'font-weight': fontweight, 'color': color}" @blur="update" @keyup.enter.stop="update" @focus="active = true" @keypress="isNumberKey">
</template>

<script>
  // import $ from 'jquery'
  export default {
    data () {
      return {
        active: false
      }
    },
    props: {
      value: {type: Number, default: 0},
      min: {type: Number, default: 0},
      max: {type: Number, default: 100000000},
      step: {type: Number, default: 10000},
      decimals: {type: Number, default: 0},
      type: {default: 'currency'},
      disabled: {type: Boolean, default: false},
      align: {type: String, default: 'left'},
      fontweight: {type: String, default: 'bold'},
      color: {type: String, default: '#111'}
    },
    mounted () {
    },
    computed: {
      val: function () {
        let val = 0
        let dec = this.decimals || 0
        if (this.type === 'currency') {
          val = Number(this.value)
        } else if (this.type === 'none') {
          val = Number(this.value) + ''
        } else if (this.type === 'percent') {
          val = Number(this.value * 100).toFixed(3)
        }
        // if (this.roundTimeAnchorage) {
        //   return this.roundSoGioNeo(Number(val))
        // }
        return this.round(val, dec)
      },
      formatted: function () {
        let val = 0
        let dec = this.decimals || 0
        this.value = this.round(this.value, dec)
        if (this.type === 'currency') {
          val = this.formatAsCurrency(this.value, this.decimals)
          // eslint-disable-next-line
          // return Number(this.value + ''.replace(/[^0-9\.]+/g, ''))
        } else if (this.type === 'none') {
          // eslint-disable-next-line
          val = Number(this.value + ''.replace(/[^0-9\.]+/g, '')).toFixed(this.decimals) + ''
        } else if (this.type === 'percent') {
          val = (this.value * 100).toFixed(this.decimals) + '%'
        }
        return val
      }
    },
    methods: {
      isNumberKey ($event) {
        // console.log('this.value+++++++++++++', $event)
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
        if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || $event.target.value.indexOf('.') !== -1)) {
          $event.preventDefault()
        }
      },
      formatAsCurrency: function (value, dec) {
        dec = dec || 0
        // console.log('value.toFixed(dec)++++++++replace', value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')) replace('.', ',')
        return value.toFixed(dec).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
      },
      increment: function (e) {
        if (e.shiftKey) {
          this.value += 10 * this.step
        } else {
          this.value += this.step
        }
        if (this.value > this.max) {
          this.value = this.max
        }
        this.changed()
      },
      decrement: function (e) {
        if (e.shiftKey) {
          this.value -= 10 * this.step
        } else {
          this.value -= this.step
        }
        if (this.value < this.min) {
          this.value = this.min
        }
        this.changed()
      },
      round (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
      },
      update: function () {
        this.active = false
        // console.log(this.$el)
        var tempVal = this.$el.value + '' || '0'
        // console.log('tempVal', tempVal)
        // tempVal = String(tempVal).replace(',', '.') || 0
        // this.value = String(this.value).replace(',', '.')
        // eslint-disable-next-line
        this.value = Number(tempVal.replace(/[^0-9\.]+/g, ''))
        if (this.type === 'percent') {
          this.value /= 100
        }
        // let dec = this.decimals || 0
        // this.value = this.value ? this.value.toFixed(dec) : 0
        let dec = this.decimals || 0
        this.value = this.round(this.value, dec)
        this.changed()
      },
      roundSoGioNeo (val) {
        if (val && Number(val)) {
          let value = Number(val)
          let roundTmp = parseInt(value)
          let tp = value - roundTmp
          if (tp <= 0.5 && tp > 0) {
            tp = 0.5
          } else if (tp > 0.5) {
            tp = 1
          }
          console.log('tp==========', tp)
          console.log('value==========', value)
          console.log('roundTmp==========', roundTmp)
          value = roundTmp + tp
          console.log('value==========', value)
          return value
        }
        return 0
      },
      changed: function () {
        let dec = this.decimals || 0
        this.value = this.round(this.value, dec)
        // if (this.roundTimeAnchorage) {
        //   this.value = this.roundSoGioNeo(Number(this.value))
        // }
        this.$emit('input', Number(this.value))
      }
    },
    filters: {
    }
  }
</script>

