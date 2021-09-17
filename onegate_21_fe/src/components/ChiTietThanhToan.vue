<template>
  <div>
    <v-card>
      <v-expansion-panel :value="[true]" expand  class="expansion-pl">
        <v-expansion-panel-content>
          <div slot="header">
            <div class="background-triangle-small"> 
              <v-icon size="18" color="white">star_rate</v-icon> 
            </div>
            <span>Thông tin thanh toán</span>
          </div>
          <v-card class="">
            <v-card-text class="px-0 py-0">
              <v-layout wrap>
                <v-flex xs12 md2>
                  <v-subheader class="pl-0 text-right">Tên phí, lệ phí: </v-subheader>
                </v-flex>
                <v-flex xs12 md10>
                  <p class="mt-1 mb-0">{{payments.paymentFee}}</p>
                </v-flex>
                <v-flex xs12 sm2>
                  <v-subheader class="pl-0 text-right">Lệ phí: </v-subheader>
                </v-flex>
                <v-flex xs12 sm2>
                  <p class="pt-2 mb-0">{{payments.feeAmount ? currency(payments.feeAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; vnđ</p>
                </v-flex>
                <v-flex xs12 sm2 class="pt-1">
                  <v-subheader class="pl-0 text-right">Phí: </v-subheader>
                </v-flex>
                <v-flex xs12 sm3 class="pt-1">
                  <p class="pt-2 mb-0">{{payments.serviceAmount ? currency(payments.serviceAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; vnđ</p>
                </v-flex>
                <v-flex xs12 sm3></v-flex>
                <!--  -->
                <v-flex xs12 sm2 v-if="(dossierDetail.viaPortal === 2 || dossierDetail.viaPortal === '2') && payments.shipAmount !== 0">
                  <v-subheader class="pl-0 text-right">Phí chuyển phát: </v-subheader>
                </v-flex>
                <v-flex xs12 sm2 v-if="(dossierDetail.viaPortal === 2 || dossierDetail.viaPortal === '2') && payments.shipAmount !== 0">
                  <p class="pt-2 mb-0">{{payments.shipAmount ? currency(payments.shipAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; vnđ</p>
                </v-flex>
                <v-flex xs12 sm8 v-if="(dossierDetail.viaPortal === 2 || dossierDetail.viaPortal === '2') && payments.shipAmount !== 0"></v-flex>
                <!--  -->
                <v-flex xs12 sm2>
                  <v-subheader class="pl-0 text-right"><span class="text-bold">Tổng: </span></v-subheader>
                </v-flex>
                <v-flex xs12 sm3 style="padding-top:7px">
                  <span>{{payments.paymentAmount ? currency(payments.paymentAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; vnđ</span>
                </v-flex>
                <v-flex xs12 sm7></v-flex>
                <!--  -->
                <v-flex style="width:100px" class="my-0 pl-3 py-1"><span class="red--text">* </span>&nbsp;Ghi chú:</v-flex>
                <v-flex style="width:calc(100% - 100px)">
                  <p class="px-2 my-0 py-1">
                    {{paymentNote}} &nbsp;&nbsp;
                  </p>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel :value="[true]" expand class="expansion-pl">
        <v-expansion-panel-content>
          <div slot="header">
            <div class="background-triangle-small"> 
              <v-icon size="18" color="white">star_rate</v-icon> 
            </div>
            <span>Tình trạng thanh toán</span>
          </div>
          <v-card class="">
            <v-card-text class="px-0 py-0">
              <v-layout wrap>
                <v-flex xs12 sm2>
                  <v-subheader class="pl-0 text-right">Trạng thái: </v-subheader>
                </v-flex>
                <v-flex xs12 sm3>
                  <p class="pt-2 mb-0">{{getPaymentStatus(payments.paymentStatus)}}</p>
                </v-flex>
                <v-flex xs12 sm7></v-flex>
                <v-layout wrap v-if="doneVTpay">
                  <v-flex xs12 sm2>
                    <v-subheader class="pl-0 text-right">Người làm thủ tục thanh toán: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm3>
                    <p class="pt-2 mb-0">Đã thanh toán qua ViettelPay
                      <a class="ml-2" href="javascript:;" @click=""
                        style="color: #001fff;text-decoration: underline;font-style: italic;">
                        chi tiết
                      </a>
                    </p>
                  </v-flex>
                  <v-flex xs12 sm7></v-flex>
                </v-layout>
                <v-layout wrap v-if="Number(payments.paymentStatus) >= 3" style="width: 100%">
                  <v-flex xs12 sm2>
                    <v-subheader class="pl-0 text-right">Hình thức thanh toán: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm3>
                    <p class="pt-2 mb-0">{{payments['paymentMethod']}}</p>
                  </v-flex>
                  <v-flex xs12 sm7></v-flex>
                  <v-flex xs12 sm2 v-if="paymentFile && payments['paymentMethod'] === 'Chuyển khoản'">
                    <v-subheader class="pl-0 text-right">Chứng từ kèm theo: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm10 v-if="paymentFile && payments['paymentMethod'] === 'Chuyển khoản'" >
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
                  </v-flex>
                  <!-- thông tin tra cứu keypay -->
                  <v-flex xs12 sm2 v-if="payments['paymentMethod'] === 'Keypay'">
                    <v-subheader class="pl-0 text-right">Mã giao dịch: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm3 v-if="payments['paymentMethod'] === 'Keypay'">
                    <p class="pt-2 mb-0">{{transId}}</p>
                  </v-flex>
                  <v-flex xs12 sm7 v-if="payments['paymentMethod'] === 'Keypay'"></v-flex>
                  <v-flex xs12 sm2 v-if="payments['paymentMethod'] === 'Keypay'">
                    <v-subheader class="pl-0 text-right">Mã đơn hàng: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm3 v-if="payments['paymentMethod'] === 'Keypay'">
                    <p class="pt-2 mb-0">{{goodCode}}</p>
                  </v-flex>
                  <v-flex xs12 sm7 v-if="payments['paymentMethod'] === 'Keypay'"></v-flex>
                  <!-- end -->

                  <!-- biên lai KeyPayDVCQG -->
                  <v-flex xs12 v-if="payments['paymentMethod'] === 'KeyPayDVCQG'">

                  </v-flex>

                  <!-- end -->
                </v-layout>
                <!-- <v-layout wrap v-if="Number(payments.paymentStatus) < 5 && payments.hasOwnProperty('invoicePayload') && payments['invoicePayload'] == 'VNPT'">
                  <v-flex xs12>
                    <v-btn class="ml-3" color="primary" @click="printPay()">
                      <v-icon>print</v-icon> &nbsp;
                      In biên lai điện tử
                    </v-btn>
                  </v-flex>
                </v-layout> -->
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!--  -->
      <v-expansion-panel :value="[true]" expand  class="expansion-pl" v-if="Number(payments.paymentStatus) >= 5">
        <v-expansion-panel-content>
          <div slot="header">
            <div class="background-triangle-small"> 
              <v-icon size="18" color="white">star_rate</v-icon> 
            </div>
            <span>Hóa đơn thanh toán</span>
          </div>
          <v-card class="pl-2">
            <v-card-text class="px-0 py-0">
              <v-layout wrap>
                <v-flex xs12 sm2>
                  <v-subheader class="pl-0 text-right">Mẫu số hóa đơn : </v-subheader>
                </v-flex>
                <v-flex xs12 sm3>
                  <p class="pt-2 mb-0">{{eInvoiceInfo && eInvoiceInfo['supplierTaxCode'] ? eInvoiceInfo['invoiceTemplateNo'] : payments.invoiceTemplateNo}}</p>
                </v-flex>
                <v-flex xs12 sm2>
                  <v-subheader class="pl-0 text-right">Số hóa đơn trên hệ thống : </v-subheader>
                </v-flex>
                <v-flex xs12 sm3>
                  <!-- <p class="pt-2 mb-0">{{getEinvoiceNo(payments.einvoice)}}</p> -->
                  <p class="pt-2 mb-0">{{eInvoiceInfo && eInvoiceInfo['supplierTaxCode'] ? eInvoiceInfo['invoiceNo'] : payments.invoiceNo}}</p>
                </v-flex>
                <v-flex xs12 sm2></v-flex>
                <!-- Hóa đơn điện tử Vietel -->
                <v-flex xs12 v-if="eInvoiceInfo && eInvoiceInfo['supplierTaxCode']">
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-right">Mã số thuế: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <p class="pt-2 mb-0">{{eInvoiceInfo['supplierTaxCode']}}</p>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-right">Mã bí mật tra cứu hóa đơn: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <p class="pt-2 mb-0">{{eInvoiceInfo['reservationCode']}}</p>
                    </v-flex>
                    <v-flex xs12 sm2></v-flex>
                  </v-layout>
                </v-flex>
                
                <v-flex xs12 v-else>
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-right">Mã tra cứu trên hệ thống : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm3>
                      <p class="pt-2 mb-0">{{getEinvoiceCode(payments.einvoice)}}</p>
                    </v-flex>
                    <v-flex xs12 sm7></v-flex>
                  </v-layout>
                </v-flex>
                <!--  -->
                <v-flex xs12 sm12 class="ml-3 mb-3">
                  <!-- <v-btn color="primary" @click="tracuuhoadon()">
                    <v-icon>search</v-icon> 
                    Tra cứu hóa đơn
                  </v-btn> -->
                  <!-- <v-btn v-if="originality === 3" class="ml-3" color="primary" @click="printPay()"> -->
                  <v-btn class="ml-3" color="primary" @click="printPay()">
                    <v-icon>print</v-icon> &nbsp;
                    In biên lai
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title v-if="!activePrintPay">File đính kèm</v-toolbar-title>
          <v-toolbar-title v-else>In biên lai thanh toán</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
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
        <iframe v-show="!dialogPDFLoading" id="dialogPaymentPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  props: {
    payments: {
      type: Object,
      default: () => {}
    },
    dossierDetail: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data: () => ({
    loading: true,
    loadingAction: false,
    paymentFile: '',
    dialogPDF: false,
    dialogPDFLoading: true,
    activePrintPay: false,
    transId: '',
    goodCode: '',
    doneVTpay: false,
    paymentNote: ''
  }),
  computed: {
    paymentFileName () {
      return this.$store.getters.getPaymentFileName
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    ePaymentProfile () {
      let vm = this
      return vm.getEPaymentProfile(vm.payments['epaymentProfile'])
    },
    eInvoiceInfo () {
      let vm = this
      try {
        return JSON.parse(vm.payments['einvoice'])
      } catch (error) {
        console.log('Không có thông tin hóa đơn - einvoice')
        return ''
      }
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.paymentNote = vm.payments['paymentNote']
      try {
        vm.paymentNote = JSON.parse(vm.payments['paymentNote'])['paymentNote']
      } catch (error) {
      }
    })
  },
  watch: {
    dossierDetail (val) {
      var vm = this
      vm.getPaymentFiles()
    },
    payments (val) {
      // lấy thông tin tra cứu trên keypay
      let vm = this
      // if (!vm.paymentFile && val['paymentMethod'] === 'Chuyển khoản') {
      //   vm.payments.paymentMethod = 'Keypay'
      // }
      vm.paymentNote = val['paymentNote']
      try {
        vm.paymentNote = JSON.parse(val['paymentNote'])['paymentNote']
      } catch (error) {
      }
      let paymentProfile = vm.getEPaymentProfile(val.epaymentProfile)
      // keypay
      if (paymentProfile && paymentProfile['keypayUrl']) {
        vm.transId = paymentProfile['keypayUrl'].split('&').filter(function (item) {return item.indexOf('merchant_trans_id') >= 0})[0].split('=')[1]
        vm.goodCode = paymentProfile['keypayUrl'].split('&').filter(function (item) {return item.indexOf('good_code') >= 0})[0].split('=')[1]
      }
      // viettelPay
      if (paymentProfile && paymentProfile.genQRCode && String(val.paymentStatus) !== '3' && String(val.paymentStatus) !== '5') {
        let filter = {
          billcode: paymentProfile.genQRCode.BILLCODE,
          order_id: paymentProfile.genQRCode.ORDER_ID
        }
        vm.$store.dispatch('getVtPayStatus', filter).then(result => {
          // vm.doneVTpay = true
        }).catch(function(){})

      }
    }
  },
  methods: {
    getPaymentFiles () {
      let vm = this
      let filter = vm.dossierDetail
      vm.$store.dispatch('getPaymentFiles', filter).then(result => {
        vm.paymentFile = result
      }).catch(function(){})
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    },
    viewFile () {
      let vm = this
      vm.activePrintPay = false
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: vm.dossierDetail.dossierId,
        referenceUid: vm.dossierDetail.referenceUid
      }
      vm.$store.dispatch('viewPaymentFile', filter).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPaymentPreview').src = result
      }).catch(function(){})
    },
    getEPaymentProfile (paymentProfile) {
      if (paymentProfile) {
        try {
          JSON.parse(paymentProfile)
          return JSON.parse(paymentProfile)
        } catch (e) {
          return ''
        }
      } else {
        return ''
      }
    },
    downloadPaymentFile (item) {
      let vm = this
      let url = '/o/rest/v2/dossiers/' + vm.dossierDetail.dossierId + '/payments/' + vm.dossierDetail.referenceUid + '/confirmfile'
      window.open(url)
    },
    printPay () {
      let vm = this
      vm.activePrintPay = true
      let filter = {
        dossierId: vm.dossierDetail.dossierId,
        referenceUid: vm.payments.referenceUid
      }
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      if (vm.payments.hasOwnProperty('invoicePayload') && vm.payments['invoicePayload'] == 'VNPT') {
        vm.$store.dispatch('printPayVnpt', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPaymentPreview').src = result
        }).catch(function(){})
      } else {
        if (vm.payments['paymentMethod'] === 'KeyPayDVCQG') {
          let confirmPayload = vm.payments.hasOwnProperty('confirmPayload') ? vm.getEPaymentProfile(vm.payments['confirmPayload']) : ''
          vm.dialogPDFLoading = false
          let url = confirmPayload ? confirmPayload['url_invoice'] : ''
          if (url) {
            window.open(url, "_blank")
          } else {
            alert('Không có biên lai')
          }
        } else if (vm.payments['paymentMethod'] === 'PayPlatDVCQG' || vm.payments['paymentMethod'] === 'Paygov') {
          // let param = {
          //   headers: {
          //     groupId: window.themeDisplay.getScopeGroupId()
          //   },
          //   responseType: 'blob'
          // }
          // axios.get('/o/rest/v2/dossiers/'+ filter.dossierId + '/payments/' + filter.referenceUid + '/invoice', param).then(function (response) {
          //   vm.dialogPDFLoading = false
          //   let serializable = response.data
          //   let file = window.URL.createObjectURL(serializable)
          //   document.getElementById('dialogPaymentPreview').src = file
          // }).catch(function (error) {
          //   vm.dialogPDFLoading = false
          // })
          vm.dialogPDFLoading = false
          vm.dialogPDF = false
          let url = '/o/rest/v2/dossiers/'+ filter.dossierId + '/payments/' + filter.referenceUid + '/invoice'
          window.open(url, "_blank")
        } else {
          vm.$store.dispatch('printPay', filter).then(function (result) {
            vm.dialogPDFLoading = false
            document.getElementById('dialogPaymentPreview').src = result
          }).catch(function(){})
        }
      }
      
    },
    getEinvoiceNo (string) {
      if (string && string.indexOf('#') >= 0) {
        let eInvoiceNo = string.split('#')[1] ? string.split('#')[1] : ''
        return eInvoiceNo.indexOf('}') < 0 && eInvoiceNo.indexOf('"') < 0 ? eInvoiceNo : ''
      } else {
        return ''
      }
    },
    getEinvoiceCode (string) {
      if (string && string.indexOf('#') >= 0) {
        let eInvoiceCode = string.split('#')[3] ? string.split('#')[3].split(',')[0].replace('"', '') : ''
        return eInvoiceCode
      } else {
        return ''
      }
    },
    tracuuhoadon () {
      let vm = this
      let urlRedirect
      if (vm.eInvoiceInfo && vm.eInvoiceInfo['supplierTaxCode']) {
        urlRedirect = vm.eInvoiceInfo['sInvoiceUrl']
      } else {
        urlRedirect = 'http://tracuu.cmcsoft.com'
      }
      window.open(urlRedirect, '_blank')
    },
    checkVTpay () {
      let vm = this
      let paymentProfile = vm.getEPaymentProfile(vm.payments.epaymentProfile)
      let filter = {
        billcode: paymentProfile.genQRCode.BILLCODE,
        order_id: paymentProfile.genQRCode.ORDER_ID
      }
      vm.$store.dispatch('getVtPayStatus', filter).then(result => {

      }).catch(function(){})
    },
    getPaymentStatus (code) {
      if (code === 1 || code === '1') {
        return 'Yêu cầu nộp tiền tạm ứng '
      } else if (code === 2 || code === '2') {
        return 'Yêu cầu quyết toán phí'
      } else if (code === 3 || code === '3') {
        return 'Báo đã nộp phí trực tuyến'
      } else if (code === 4 || code === '4') {
        return 'Yêu cầu nộp lại phí trực tuyến'
      } else if (code === 5 || code === '5') {
        return 'Đã hoàn thành thu phí'
      } else {
        return ''
      }
    }
  }
}
</script>
