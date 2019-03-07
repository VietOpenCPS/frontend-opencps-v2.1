<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span>{{paymentProfile.paymentFee}}</span>
        </div>
        <v-card>
          <v-card-text class="px-4 pb-1">
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Lệ phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <p class="mt-1 mb-0">{{currency(Number(paymentProfile.feeAmount))}} &nbsp;&nbsp; vnđ</p>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <p class="mt-1 mb-0">{{currency(Number(paymentProfile.serviceAmount))}} &nbsp;&nbsp; vnđ</p>
              </v-flex>
              <v-flex xs12 sm2></v-flex>
              <v-flex xs12 sm2 v-if="(detailDossier.viaPostal === 2 || detailDossier.viaPostal === '2') && paymentProfile.shipAmount !== 0">
                <v-subheader class="pl-0 text-right">Phí chuyển phát: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <p class="mt-1 mb-0" v-if="(detailDossier.viaPostal === 2 || detailDossier.viaPostal === '2') && paymentProfile.shipAmount !== 0">
                  {{currency(Number(paymentProfile.shipAmount))}} &nbsp;&nbsp; vnđ
                </p>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text class="px-4 pt-0">
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right"><span class="text-bold">Tổng: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 style="padding-top:7px">
                <span>{{currency(Number(feeTong))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right"><span class="text-bold">Đã tạm nộp: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 style="padding-top:7px">
                <span>{{currency(Number(paymentProfile.advanceAmount))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1></v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right"><span class="text-bold">Còn phải nộp: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 style="padding-top:7px">
                <span>{{currency(totalFee)}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1></v-flex>
            </v-layout>
            <!-- paymentNote -->
            <v-layout wrap style="position: relative">
              <v-flex style="width:70px" class="my-0 py-1"><span class="red--text">* </span>&nbsp;Ghi chú:</v-flex>
              <v-flex style="width:calc(100% - 80px)">
                <p class="px-2 my-0 py-1">
                  {{paymentProfile.paymentNote}} &nbsp;&nbsp;
                </p>
              </v-flex>
            </v-layout>
            <!-- epayment -->
            <p class="mb-0"><span class="red--text">* </span>&nbsp;Lựa chọn hình thức thanh toán:</p>
            <v-btn dark small color="blue darken-1" class="ml-3 mr-2" @click.native="() => isBank = true">
              <v-icon>account_balance</v-icon> &nbsp;
              Thanh toán chuyển khoản
            </v-btn>
            <v-btn v-if="getEPaymentProfile(paymentProfile.epaymentProfile)" dark small color="amber accent-4" class="ml-2 mr-2" @click.native="toKeyPay(getEPaymentProfile(paymentProfile.epaymentProfile).keypayUrl)">
              <v-icon>payment</v-icon> &nbsp;
              Thanh toán điện tử
            </v-btn>
            <div v-if="isBank" class="ml-3">
              <div>
                <input type="file" id="paymentFile1" @change="uploadPaymentFile($event)" style="display:none">
                <span>Tải lên file báo thanh toán chuyển khoản (Định dạng: .png, .jpg, .jpeg)</span>
                <v-progress-circular
                :width="2"
                :size="25"
                color="green"
                indeterminate
                v-if="progressUploadPart"
                ></v-progress-circular>
                <v-tooltip top v-else>
                  <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile()">
                    <v-badge>
                      <v-icon size="16" color="primary">cloud_upload</v-icon>
                    </v-badge>
                  </v-btn>
                  <span>Tải file lên</span>
                </v-tooltip>
              </div>
              <!-- view file -->
              <div v-if="paymentFile">
                <span v-on:click.stop="viewFile()" style="cursor: pointer;">
                  <v-icon color="blue">insert_drive_file</v-icon>
                  {{paymentFileName}}
                </span>
                <v-tooltip top>
                  <v-btn icon ripple slot="activator" v-on:click.stop="downloadPaymentFile(item)" class="mx-0 my-0">
                    <v-icon style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                  </v-btn>
                  <span>Tải xuống</span>
                </v-tooltip>
              </div>
              <span v-if="!epaymentValid" style="color:#f44336">* Yêu cầu tải lên file báo thanh toán</span>
            </div>
            <p v-if="!isBank && errorNotSelect" style="color:#f44336">* Yêu cầu lựa chọn hình thức thanh toán</p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>File đính kèm</v-toolbar-title>
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
        <iframe v-show="!dialogPDFLoading" id="dialogPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import {VMoney} from 'v-money'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: {
    paymentProfile: {
      type: Object,
      default: () => {}
    },
    detailDossier: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    data_payment: {
      advanceAmount: '',
      feeAmount: '',
      serviceAmount: '',
      shipAmount: '',
      paymentAmount: '',
      paymentNote: '',
      paymentFile: ''
    },
    paymentFile: '',
    epaymentValid: true,
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
    progressUploadPart: false,
    dialogPDF: false,
    dialogPDFLoading: true,
    isBank: false,
    errorNotSelect: false
  }),
  directives: {money: VMoney},
  created () {
    var vm = this
    if (vm.detailDossier.hasOwnProperty('dossierId')) {
      let filter = vm.detailDossier
      vm.$store.dispatch('getPaymentFiles', filter).then(result => {
        vm.paymentFile = result
        vm.data_payment['paymentFile'] = vm.paymentFile
        vm.$store.commit('setPaymentProfile', vm.data_payment)
      })
    }
  },
  computed: {
    paymentFileName () {
      return this.$store.getters.getPaymentFileName
    },
    isBank (val) {
      if (val === true) {
        this.errorNotSelect = false
      }
    }
  },
  watch: {
    paymentProfile (val) {
      var vm = this
      if (vm.paymentProfile) {
        vm.feeTong = Number(vm.paymentProfile.feeAmount) + Number(vm.paymentProfile.serviceAmount)
        if ((vm.detailDossier.viaPostal === 2 || vm.detailDossier.viaPostal === '2') && vm.paymentProfile.shipAmount !== 0) {
          vm.feeTong = Number(vm.paymentProfile.feeAmount) + Number(vm.paymentProfile.serviceAmount) + Number(vm.paymentProfile.shipAmount)
        }
        console.log('feeTong', vm.feeTong)
        vm.totalFee = vm.feeTong - Number(vm.paymentProfile.advanceAmount)
        if (vm.totalFee < 0) {
          vm.totalFee = 0
        }
        vm.data_payment = {
          advanceAmount: vm.paymentProfile.advanceAmount,
          feeAmount: vm.paymentProfile.feeAmount,
          serviceAmount: vm.paymentProfile.serviceAmount,
          shipAmount: vm.paymentProfile.shipAmount,
          paymentAmount: vm.totalFee,
          paymentNote: vm.paymentProfile.paymentNote,
          paymentFile: vm.paymentFile
        }
        vm.$store.commit('setPaymentProfile', vm.data_payment)
        // }
      }
    },
    detailDossier (val) {
      var vm = this
      if (val.hasOwnProperty('dossierId')) {
        let filter = val
        vm.$store.dispatch('getPaymentFiles', filter).then(result => {
          vm.paymentFile = result
          vm.data_payment['paymentFile'] = vm.paymentFile
          vm.$store.commit('setPaymentProfile', vm.data_payment)
        })
      }
    }
  },
  methods: {
    uploadPaymentFile (e) {
      var vm = this
      vm.progressUploadPart = true
      var data = {}
      data['dossierId'] = vm.detailDossier.dossierId
      data['referenceUid'] = vm.detailDossier.referenceUid
      data['selector'] = 'paymentFile1'
      data['partTip'] = {
        tip: '',
        maxSize: 10,
        extensions: 'jpg,png,jpeg,JPG,PNG,JPEG'
      }
      let file = $('#paymentFile1')[0].files[0]
      vm.$store.dispatch('uploadPaymentFile', data).then(function (result) {
        vm.epaymentValid = true
        vm.progressUploadPart = false
        vm.paymentFile = result
        vm.data_payment['paymentFile'] = vm.paymentFile
        vm.$store.commit('setPaymentProfile', vm.data_payment)
        vm.$store.dispatch('getPaymentFiles', data).then(result => {
          vm.paymentFile = result
          vm.data_payment['paymentFile'] = vm.paymentFile
          vm.$store.commit('setPaymentProfile', vm.data_payment)
        })
      }).catch(function (xhr) {
        vm.progressUploadPart = false
      })
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
    getEPaymentProfile (paymentProfile) {
      if (paymentProfile) {
        return JSON.parse(paymentProfile)
      } else {
        return ''
      }
    },
    deleteFile (item) {
      var vm = this
      let x = confirm('Bạn có chắc chắn xóa file?')
      if (x) {
        item['dossierId'] = vm.dossierId
        vm.$store.dispatch('deletePaymentFile', item).then(resFile => {
          toastr.clear()
          toastr.success('Xóa file thành công.')
          vm.paymentFile = ''
          vm.data_payment['paymentFile'] = vm.paymentFile
          vm.$store.commit('setPaymentProfile', vm.data_payment)
        }).catch(reject => {
          toastr.clear()
          toastr.error('Xóa file thất bại.')
        })
      }
    },
    downloadPaymentFile (item) {
      let vm = this
      // test local
      // let url = 'http://127.0.0.1:8081/api/dossiers/' + vm.dossierId + '/payment/confirmfile'
      let url = '/o/rest/v2/dossiers/' + vm.detailDossier.dossierId + '/payments/' + vm.detailDossier.referenceUid + '/confirmfile'
      window.open(url)
    },
    pickFile () {
      var vm = this
      document.getElementById('paymentFile1').value = ''
      document.getElementById('paymentFile1').click()
    },
    currency (value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 0
      }
      return 0
    },
    validPayment () {
      if (this.paymentFile) {
        this.epaymentValid = true
      } else {
        this.epaymentValid = false
      }
      if (!this.isBank) {
        this.errorNotSelect = true
      } else {
        this.errorNotSelect = false
      }
      if (this.isBank === false) {
        return false
      } else {
        return true
      }
    },
    toKeyPay (item) {
      window.open(item, '_self')
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {}
}
</script>
