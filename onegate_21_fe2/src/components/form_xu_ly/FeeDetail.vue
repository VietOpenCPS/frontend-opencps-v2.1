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
                  @keyup="changeFee"
                  v-model="data_payment.feeAmount"
                  v-money="money"
                  suffix="vnđ"
                  v-if="data_payment.editable === 1 || data_payment.editable === 3"
                ></v-text-field>
                <p class="mt-1 mb-0" v-else>{{currency(data_payment.feeAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</p>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 class="pt-1">
                <v-subheader class="pl-0 text-right">Phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-1">
                <v-text-field
                  @keyup="changeFee"
                  v-model="data_payment.serviceAmount"
                  v-money="money"
                  suffix="vnđ"
                  v-if="data_payment.editable === 2 || data_payment.editable === 3"
                ></v-text-field>
                <p class="mt-1 mb-0" v-else>{{currency(data_payment.serviceAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</p>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2></v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="(viaPortal === 2 || viaPortal === '2') && data_payment.shipAmount !== 0">
                <v-subheader class="pl-0 text-right">Phí chuyển phát: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="(viaPortal === 2 || viaPortal === '2') && data_payment.shipAmount !== 0">
                <v-text-field
                  @keyup="changeFee"
                  v-model="data_payment.shipAmount"
                  v-money="money"
                  suffix="vnđ"
                  v-if="data_payment.editable === 1 || data_payment.editable === 3"
                ></v-text-field>
                <p class="mt-1 mb-0" v-else>{{currency(data_payment.shipAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</p>
              </v-flex>
              <v-flex xs12 sm2></v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text class="pt-0">
            <v-layout wrap>
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 1" >
                <v-subheader class="pl-0 text-right"><span class="text-bold">Tổng: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 1" style="padding-top:7px">
                <span>{{currency(feeTong.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1 v-if="data_payment.requestPayment === 1" ></v-flex>
              <!-- requestPayment === 2 -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 2">
                <v-subheader class="pl-0 text-right"><span class="text-bold">Tổng: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 2" style="padding-top:7px">
                <span>{{currency(totalFee.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1 v-if="data_payment.requestPayment === 2"></v-flex>
              <!-- requestPayment === 5" -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right"><span class="text-bold">Tổng: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 5" style="padding-top:7px">
                <span>{{currency(feeTong.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right"><span class="text-bold">Đã tạm nộp: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 5" style="padding-top:7px">
                <!-- <span>{{data_payment.advanceAmount}} vnđ</span> -->
                <span>{{currency((Number(data_payment.advanceAmount.toString().replace(/\./g, ''))).toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1 v-if="data_payment.requestPayment === 5"></v-flex>
              <!--  -->
              <v-flex xs12 sm2 v-if="data_payment.requestPayment === 5">
                <v-subheader class="pl-0 text-right"><span class="text-bold">Còn phải nộp: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 v-if="data_payment.requestPayment === 5" style="padding-top:7px">
                <span>{{currency(totalFee.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1 v-if="data_payment.requestPayment === 5"></v-flex>
            </v-layout>
            <!-- <p class="mt-2" style="margin-left: 100px" v-if="data_payment.paymentNote">
              <span class="red--text">* </span>&nbsp;&nbsp; {{data_payment.paymentNote}}
            </p> -->
            <v-layout wrap style="position: relative">
              <v-flex style="width:70px" class="my-0 py-1"><span class="red--text">* </span>&nbsp;Ghi chú:</v-flex>
              <v-flex style="width:calc(100% - 80px)">
                <div v-if="activeEdit == false" class="pl-2">
                  <v-text-field class="py-0"
                  v-model="data_payment.paymentNote"
                  multi-line
                  :readonly='activeEdit'
                  required
                  ></v-text-field>
                </div>
                <p class="px-2 my-0 py-1" v-if="activeEdit||data_payment.paymentNote===''">
                  {{data_payment.paymentNote}} &nbsp;&nbsp;
                  <v-icon color="blue" size="20" class="hover-pointer btn-add mx-0 my-0" title="Sửa" v-on:click.stop="activeEdit = false" 
                  v-if="activeEdit==true" grey darken-4>
                    create
                  </v-icon>
                </p>
                <span style="position:absolute;top:15px; right:10px">
                  <v-icon color="green" size="25" class="hover-pointer btn-add mx-0 my-0" v-on:click.stop="activeEdit = true" 
                  v-if="activeEdit==false" grey darken-4>
                    check
                  </v-icon>
                </span>
              </v-flex>
            </v-layout>
            <div v-if="paymentFile && data_payment.requestPayment === 5">
              <span><span class="red--text">* </span>&nbsp;File báo thanh toán:</span>&nbsp;
              <span v-on:click.stop="viewFile()" style="cursor: pointer;">
                <v-icon>attach_file</v-icon>
                {{paymentFileName}}
              </span>
              <v-tooltip top>
                <v-btn icon ripple slot="activator" v-on:click.stop="downloadPaymentFile(item)" class="mx-0 my-0">
                  <v-icon style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                </v-btn>
                <span>Tải xuống</span>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-card-title class="headline">File đính kèm</v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogPDF = false">
          <v-icon>clear</v-icon>
        </v-btn>
        <div v-if="dialogPDFLoading" style="
          min-height: 600px;
          text-align: center;
          margin: auto;
          padding: 25%;
        ">
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <iframe v-show="!dialogPDFLoading" id="dialogPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
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
    },
    detailDossier: {
      type: Object,
      default: () => {}
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
    checkPaid: true,
    activeEdit: true,
    paymentFile: '',
    dialogPDF: false,
    dialogPDFLoading: true
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
          // let advanceAmount = vm.payments.advanceAmount ? Number(vm.payments.advanceAmount.toString().replace(/\./g, '')) : 0
          let serviceAmount = Number(vm.payments.serviceAmount)
          vm.feeTong = feeAmount + serviceAmount
          vm.totalFee = feeAmount + serviceAmount
        } else if (vm.payments.requestPayment === 2) {
          let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
          let shipAmount = vm.payments.shipAmount ? Number(vm.payments.shipAmount.toString().replace(/\./g, '')) : 0
          if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
            vm.totalFee = feeAmount + serviceAmount + shipAmount
          } else {
            vm.totalFee = feeAmount + serviceAmount
          }
        } else {
          let advanceAmount = vm.payments.advanceAmount ? Number(vm.payments.advanceAmount.toString().replace(/\./g, '')) : 0
          let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
          let shipAmount = vm.payments.shipAmount ? Number(vm.payments.shipAmount.toString().replace(/\./g, '')) : 0
          if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
            vm.feeTong = feeAmount + serviceAmount + shipAmount
            vm.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
          } else {
            vm.feeTong = feeAmount + serviceAmount
            vm.totalFee = feeAmount + serviceAmount - advanceAmount
          }
          if (vm.payments.requestPayment === 5 && vm.detailDossier.stepCode === 620) {
            let filter = vm.detailDossier
            vm.$store.dispatch('getPaymentFiles', filter).then(result => {
              vm.paymentFile = result
            })
          }
        }
        if (vm.totalFee < 0) {
          vm.totalFee = 0
        }
      }, 200)
    }
  },
  computed: {
    paymentFileName () {
      return this.$store.getters.getPaymentFileName
    }
  },
  watch: {
    viaPortal (val) {
      console.log('viaPortal', val)
      this.changeFee()
    },
    detailDossier (val) {
      var vm = this
      if (vm.payments.requestPayment === 5) {
        let filter = val
        console.log('run get paymentfile', filter)
        vm.$store.dispatch('getPaymentFiles', filter).then(result => {
          vm.paymentFile = result
        })
      }
    }
  },
  methods: {
    changeFee () {
      var vm = this
      let val = vm.data_payment
      let feeAmount = val.feeAmount ? Number(val.feeAmount.toString().replace(/\./g, '')) : 0
      if (val.requestPayment === 1) {
        // let advanceAmount = Number(val.advanceAmount.toString().replace(/\./g, ''))
        let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
        vm.feeTong = feeAmount + serviceAmount
        vm.totalFee = feeAmount + serviceAmount
      } else if (val.requestPayment === 2) {
        let serviceAmount = vm.payments.serviceAmount ? Number(vm.payments.serviceAmount.toString().replace(/\./g, '')) : 0
        let shipAmount = vm.payments.shipAmount ? Number(vm.payments.shipAmount.toString().replace(/\./g, '')) : 0
        if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
          vm.totalFee = feeAmount + serviceAmount + shipAmount
        } else {
          vm.totalFee = feeAmount + serviceAmount
        }
      } else {
        let advanceAmount = Number(val.advanceAmount.toString().replace(/\./g, ''))
        let serviceAmount = Number(val.serviceAmount.toString().replace(/\./g, ''))
        let shipAmount = Number(val.shipAmount.toString().replace(/\./g, ''))
        if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
          vm.feeTong = feeAmount + serviceAmount + shipAmount
          vm.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
        } else {
          vm.feeTong = feeAmount + serviceAmount
          vm.totalFee = feeAmount + serviceAmount - advanceAmount
        }
      }
      if (vm.totalFee < 0) {
        vm.totalFee = 0
      }
    },
    viewFile () {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: vm.detailDossier.dossierId,
        referenceUid: vm.detailDossier.referenceUid
      }
      vm.$store.dispatch('viewPaymentFile', filter).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPreview').src = result
      })
    },
    downloadPaymentFile (item) {
      let vm = this
      // test local
      // let url = 'http://127.0.0.1:8081/api/dossiers/' + vm.dossierId + '/payment/confirmfile'
      let url = '/o/rest/v2/dossiers/' + vm.detailDossier.dossierId + '/payments/' + vm.detailDossier.referenceUid + '/confirmfile'
      window.open(url)
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
