<template>
  <v-expansion-panel class="expansion-pl">
    <v-expansion-panel-content hide-actions value="1">
      <div slot="header">
        <div class="background-triangle-small"> 
          <v-icon size="18" color="white">star_rate</v-icon> 
        </div>XÁC NHẬN THU PHÍ
      </div>
      <v-card>
        <v-card-text>
          <div class="pl-3 fee-info" v-if="payment_type === 5">
            <v-checkbox :label="`Phí phải nộp: ${currency(payments.feeAmount)} VNĐ`" v-model="checkPaid"></v-checkbox>
            <span class="red--text">* </span> Đánh dấu để xác định người làm thủ tục đã hoàn thành nộp phí.
          </div>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>

</template>

<script>

export default {
  props: {
    payments: {
      type: Object,
      default: () => {}
    },
    payment_type: {
      type: Number,
      default: () => 5
    }
  },
  data: () => ({
    dossierId: '',
    loadingAction: false,
    feeAmount: '',
    checkPaid: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    loadingTable () {
      return this.$store.getters.loadingTable
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {})
  },
  methods: {
    initData (data) {
      var vm = this
      vm.dossierId = data
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.$store.dispatch('loadDossierPayments', resultDossier).then(function (result) {
          vm.feeAmount = result.feeAmount
        }).catch(function (reject) {
          console.log(reject)
        })
      }).catch(reject => {
        console.log(reject)
      })
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    }
  }
}
</script>
