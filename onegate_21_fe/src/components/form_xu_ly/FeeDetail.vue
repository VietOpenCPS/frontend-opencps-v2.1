<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span v-if="data_payment.requestPayment === 1 || data_payment.requestPayment === 5">{{data_payment.paymentFee}}</span>
          <span v-if="data_payment.requestPayment === 2">Lập phiếu thanh toán</span>
        </div>
        <v-card>
          <v-card-text class="pb-1">
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Lệ phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <v-text-field
                  @change="changeFee"
                  v-model="data_payment.feeAmount"
                  v-money="money"
                  suffix="đ"
                  :class="!data_payment.editable?'inputDisable':''"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 1">
                <v-subheader class="pl-0 text-right">Phí tạm thu: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 1">
                <v-text-field
                  @change="changeFee"
                  v-model="data_payment.advanceAmount"
                  v-money="money"
                  suffix="vnđ"
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
            <v-layout wrap>
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 1" >
                <v-subheader class="pl-0 text-right">Tổng tạm thu: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-2" v-if="data_payment.requestPayment === 1">
                <span>{{currency(totalFee.toString().replace(/\./g, ''))}} VNĐ</span>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 2">
                <v-subheader class="pl-0 text-right">Tổng phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-2" v-if="data_payment.requestPayment === 2">
                <span>{{currency(totalFee.toString().replace(/\./g, ''))}} VNĐ</span>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right">Tổng phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-2" v-if="data_payment.requestPayment === 5">
                <span>{{currency(feeTong.toString().replace(/\./g, ''))}} VNĐ</span>
              </v-flex>
              <v-flex xs12 sm7 v-if="data_payment.requestPayment === 5">
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right">Đã tạm nộp: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-2" v-if="data_payment.requestPayment === 5">
                <!-- <span>{{data_payment.advanceAmount}} VNĐ</span> -->
                <span>{{currency((Number(data_payment.advanceAmount.toString().replace(/\./g, ''))).toString().replace(/\./g, ''))}} VNĐ</span>
              </v-flex>
              <v-flex xs12 sm7 v-if="data_payment.requestPayment === 5">
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right">Còn phải nộp: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-2" v-if="data_payment.requestPayment === 5">
                <span>{{currency(totalFee.toString().replace(/\./g, ''))}} VNĐ</span>
              </v-flex>
            </v-layout>
            <p class="mt-2" style="margin-left: 100px" v-if="data_payment.paymentNote">
              <span class="red--text">* </span> {{data_payment.paymentNote}}
            </p>
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
    feeTamThu: 0,
    feeTong: 0,
    checkPaid: true
  }),
  directives: {money: VMoney},
  created () {
    var vm = this
    vm.data_payment = vm.payments
    if (vm.payments) {
      setTimeout(function () {
        let feeAmount = vm.payments.feeAmount ? Number(vm.payments.feeAmount.toString().replace(/\./g, '')) : 0
        // let shipAmount = vm.payments.shipAmount ? Number(vm.payments.shipAmount.toString().replace(/\./g, '')) : 0
        if (vm.payments.requestPayment === 1) {
          let advanceAmount = vm.payments.advanceAmount ? Number(vm.payments.advanceAmount.toString().replace(/\./g, '')) : 0
          vm.totalFee = advanceAmount
        } else if (vm.payments.requestPayment === 2) {
          let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
          vm.totalFee = feeAmount + serviceAmount
        } else {
          let advanceAmount = vm.payments.advanceAmount ? Number(vm.payments.advanceAmount.toString().replace(/\./g, '')) : 0
          let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
          vm.feeTong = feeAmount + serviceAmount
          vm.totalFee = feeAmount + serviceAmount - advanceAmount
        }
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
      let feeAmount = val.feeAmount ? Number(val.feeAmount.toString().replace(/\./g, '')) : 0
      if (val.requestPayment === 1) {
        let advanceAmount = Number(val.advanceAmount.toString().replace(/\./g, ''))
        vm.totalFee = advanceAmount
      } else if (val.requestPayment === 2) {
        let serviceAmount = Number(val.serviceAmount.toString().replace(/\./g, ''))
        vm.totalFee = feeAmount + serviceAmount
      } else {
        let advanceAmount = Number(val.advanceAmount.toString().replace(/\./g, ''))
        let serviceAmount = Number(val.serviceAmount.toString().replace(/\./g, ''))
        vm.feeTong = feeAmount + serviceAmount
        vm.totalFee = feeAmount + serviceAmount - advanceAmount
      }
      if (vm.totalFee < 0) {
        vm.totalFee = 0
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

