<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>Thu phí, lệ phí
        </div>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Lệ phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-model.lazy="data_payment.feeAmount"
                  v-money="money"
                  suffix="đ"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Đã tạm thu: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-model.lazy="data_payment.advanceAmount"
                  v-money="money"
                  suffix="đ"
                ></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Lệ phí dịch vụ: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-model.lazy="data_payment.serviceAmount"
                  v-money="money"
                  suffix="đ"
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
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text class="pt-0">
            <div class="pl-5 fee-info" v-if="data_payment.requestPayment === 5">
              <v-checkbox :label="`Phí phải nộp: ${currency(data_payment.feeAmount.toString().replace(/\./g, ''))} VNĐ`" v-model="checkPaid"></v-checkbox>
              <span class="red--text">* </span> Đánh dấu để xác định người làm thủ tục đã hoàn thành nộp phí.
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
    checkPaid: false
  }),
  directives: {money: VMoney},
  created () {
    this.data_payment = this.payments
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
  }
}
</script>
