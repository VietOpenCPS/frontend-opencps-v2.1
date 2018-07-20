<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>Thanh toán, lệ phí
        </div>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-if="data_payment.requestPayment === 2 || data_payment.requestPayment === 5"
                  v-model.lazy="data_payment.feeAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Đã tạm thu: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-if="data_payment.requestPayment === 1 || data_payment.advanceAmount !== 0"
                  v-model.lazy="data_payment.advanceAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Phí dịch vụ: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-if="data_payment.requestPayment === 2 || data_payment.requestPayment === 5"
                  v-model.lazy="data_payment.serviceAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="viaPortal === 2">
                <v-subheader class="pl-0 text-right">Phí chuyển phát: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4 v-if="viaPortal === 2">
                <v-text-field
                  v-model.lazy="data_payment.shipAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text class="pt-0">
            <div class="pl-5 fee-info" v-if="data_payment.requestPayment === 5">
              <v-checkbox :label="`Phí phải nộp: ${currency(totalFee.toString().replace(/\./g, ''))} VNĐ`" v-model="checkPaid"></v-checkbox>
              <span class="red--text">* </span> Người làm thủ tục đã hoàn thành nộp phí.
            </div>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>

import {VMoney} from 'v-money'
export default {
  props: {
    payments: {
      type: Object,
      default: () => {}
    },
    viaPortal: {
      type: Number,
      default: () => 0
    }
  },
  model: {
    prop: 'payments'
  },
  watch: {
    payments (val) {
      console.log('payments', val)
      let feeAmount = Number(val.feeAmount.replace(/\./g, ''))
      let serviceAmount = Number(val.serviceAmount.replace(/\./g, ''))
      let shipAmount = Number(val.shipAmount.replace(/\./g, ''))
      let advanceAmount = Number(val.advanceAmount.replace(/\./g, ''))
      this.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
    }
  },
  data: () => ({
    data_payment: {},
    money: {
      decimal: '',
      thousands: '.',
      prefix: '',
      suffix: '',
      precision: 0,
      masked: false
    },
    totalFee: 0,
    checkPaid: true
  }),
  directives: {money: VMoney},
  created () {
    var vm = this
    vm.data_payment = vm.payments
    setTimeout(function () {
      let feeAmount = Number(vm.payments.feeAmount.replace(/\./g, ''))
      let serviceAmount = Number(vm.payments.serviceAmount.replace(/\./g, ''))
      let shipAmount = Number(vm.payments.shipAmount.replace(/\./g, ''))
      let advanceAmount = Number(vm.payments.advanceAmount.replace(/\./g, ''))
      vm.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
    }, 200)
  },
  methods: {
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {}
}
</script>
<style>
.inputDisable, .inputDisable label {
  pointer-events: none
}
.inputDisable .input-group__details {
  display: none
}
</style>

