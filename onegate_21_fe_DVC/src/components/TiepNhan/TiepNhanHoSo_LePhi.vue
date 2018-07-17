<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 sm2>
          <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          <v-subheader v-else class="pl-0 text-right">Tổng tiền: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field
            v-else
            v-model.lazy="lePhi.paymentFee"
            v-money="money"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm6>

        </v-flex>
        <!-- <v-flex xs12 sm6 class="pl-4 pt-2 hidden-xs-and-down">Hạn mức: {{lePhi.request|currency}} đ</v-flex> -->
        <v-flex xs12 sm2>
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-subheader v-else class="pl-0 text-right">Ghi chú: </v-subheader>
        </v-flex>
        <v-flex xs12 sm10>
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field
            v-else
            v-model="lePhi.paymentNote"
            multi-line
            rows="2"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
// import * as utils from '../store/onegate_utils'
import {VMoney} from 'v-money'
export default {
  data: () => ({
    money: {
      decimal: '',
      thousands: '.',
      prefix: '',
      suffix: '',
      precision: 0,
      masked: false
    },
    lePhi: {
      paymentFee: '',
      paymentNote: ''
    }
  }),
  directives: {money: VMoney},
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    clearTotalMoney () {
      var vm = this
      console.log(vm.lePhi.fee)
    },
    initData (data) {
      var vm = this
      let params = {
        dossierId: data.dossierId
      }
      vm.$store.dispatch('loadDossierPayments', params).then(resultPayment => {
        vm.lePhi = resultPayment
        vm.lePhi['dossierId'] = data.dossierId
      })
    }
  },
  filters: {
    currency (val) {
      // return utils.currency(val)
    }
  }
}
</script>
