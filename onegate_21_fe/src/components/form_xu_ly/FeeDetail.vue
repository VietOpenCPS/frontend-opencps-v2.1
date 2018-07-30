<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>THANH TOÁN, LỆ PHÍ
        </div>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 2 || data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right">Phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 2 || data_payment.requestPayment === 5">
                <v-text-field
                  @change="changeFee"
                  v-model="data_payment.feeAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 1 || data_payment.advanceAmount !== 0">
                <v-subheader class="pl-0 text-right">Đã tạm thu: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 1 || data_payment.advanceAmount !== 0">
                <v-text-field
                  @change="changeFee"
                  v-model="data_payment.advanceAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2></v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 2 || data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right">Phí dịch vụ: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 2 || data_payment.requestPayment === 5">
                <v-text-field
                  @change="changeFee"
                  v-model="data_payment.serviceAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="viaPortal === 2">
                <v-subheader class="pl-0 text-right">Phí chuyển phát: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="viaPortal === 2">
                <v-text-field
                  @change="changeFee"
                  v-model="data_payment.shipAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2></v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text class="pt-0">
            <div class="pl-5 fee-info" v-if="data_payment.requestPayment === 5">
              <v-layout wrap>
                <v-checkbox disabled :label="`Phí phải nộp: ${currency(totalFee.toString().replace(/\./g, ''))} VNĐ`" v-model="checkPaid"></v-checkbox>
              </v-layout>
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
    if (vm.payments) {
      setTimeout(function () {
        let feeAmount = vm.payments.feeAmount ? Number(vm.payments.feeAmount.toString().replace(/\./g, '')) : 0
        let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
        let shipAmount = vm.payments.shipAmount ? Number(vm.payments.shipAmount.toString().replace(/\./g, '')) : 0
        let advanceAmount = vm.payments.advanceAmount ? Number(vm.payments.advanceAmount.toString().replace(/\./g, '')) : 0
        vm.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
        if (vm.totalFee < 0) {
          vm.totalFee = 0
        }
      }, 200)
    }
  },
  methods: {
    changeFee () {
      var vm = this
      let val = vm.data_payment
      let feeAmount = Number(val.feeAmount.replace(/\./g, ''))
      let serviceAmount = Number(val.serviceAmount.replace(/\./g, ''))
      let shipAmount = Number(val.shipAmount.replace(/\./g, ''))
      let advanceAmount = Number(val.advanceAmount.replace(/\./g, ''))
      this.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
      if (this.totalFee < 0) {
        this.totalFee = 0
      }
    },
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
.payment-info .input-group--disabled label {
  color: #000 !important
}
</style>

