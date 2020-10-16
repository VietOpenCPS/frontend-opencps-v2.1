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
            <div class="text-xs-left mt-2 mb-3 ml-0">
              <v-chip class="mb-2" color="indigo" text-color="white"  @click.native="showThanhToanChuyenKhoan"
                :style="methodSelect === 0 ? 'opacity: 1;font-weight:normal' : (methodSelect === 1 ? 'opacity: 1;font-weight:bold' : 'opacity: 0.6;font-weight:normal')">
                <v-avatar :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">
                  <v-icon size=20 style="color: #fff !important">payment</v-icon>
                </v-avatar>
                <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán chuyển khoản</span>
              </v-chip>

              <v-chip class="mb-2" v-if="showPayGov" color="#3b5ab5" text-color="white"
                :style="methodSelect === 0 ? 'opacity: 1;font-weight:normal' : (methodSelect === 5 ? 'opacity: 1;font-weight:bold' : 'opacity: 0.6;font-weight:normal')"
                @click.native="toPayGov()"
              >
                <v-avatar :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'" >
                  <img src="/o/opencps-store/js/cli/dvc/app/image/paygov_logo.png?t=983123" alt="trevor" style="background: #fff">
                </v-avatar>
                <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán qua Cổng hỗ trợ thanh toán quốc gia</span>
              </v-chip>

              <v-chip class="mb-2" v-if="getEPaymentProfile(paymentProfile.epaymentProfile) && !getEPaymentProfile(paymentProfile.epaymentProfile).hasOwnProperty('kpdvcqg')" color="orange" text-color="white"
                :style="methodSelect === 0 ? 'opacity: 1;font-weight:normal' : (methodSelect === 2 ? 'opacity: 1;font-weight:bold' : 'opacity: 0.6;font-weight:normal')"
                @click.native="toKeyPay(getEPaymentProfile(paymentProfile.epaymentProfile).keypayUrl)"
              >
                <v-avatar :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'" >
                  <img src="/o/opencps-store/js/cli/dvc/app/image/logo-keypay.png" alt="trevor" style="background: #fff">
                </v-avatar>
                <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán qua Keypay</span>
                <!-- <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán trực tuyến</span> -->
              </v-chip>

              <v-chip class="mb-2" v-if="getEPaymentProfile(paymentProfile.epaymentProfile) && getEPaymentProfile(paymentProfile.epaymentProfile).hasOwnProperty('kpdvcqg')" color="orange" text-color="white"
                :style="methodSelect === 0 ? 'opacity: 1;font-weight:normal' : (methodSelect === 3 ? 'opacity: 1;font-weight:bold' : 'opacity: 0.6;font-weight:normal')"
                @click.native="toKeyPayDvcqg('kpdvcqg')"
              >
                <v-avatar :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">
                  <img src="/o/opencps-store/js/cli/dvc/app/image/logo-keypay.png" alt="trevor" style="background: #fff">
                </v-avatar>
                <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán qua Cổng DVCQG</span>
              </v-chip>

              <v-chip class="mb-2" v-if="getEPaymentProfile(paymentProfile.epaymentProfile) && getEPaymentProfile(paymentProfile.epaymentProfile).hasOwnProperty('ppkpdvcqg')" color="orange" text-color="white"
                :style="methodSelect === 0 ? 'opacity: 1;font-weight:normal' : (methodSelect === 4 ? 'opacity: 1;font-weight:bold' : 'opacity: 0.6;font-weight:normal')"
                 @click.native="toKeyPayDvcqg('ppkpdvcqg')"
              >
                <v-avatar :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'" >
                  <img src="/o/opencps-store/js/cli/dvc/app/image/logo-keypay.png" alt="trevor" style="background: #fff">
                </v-avatar>
                <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán qua Cổng DVCQG</span>
              </v-chip>
              
              <v-chip class="mb-2" v-if="dataVietelPay" color="green" text-color="white" @click.native="showViettelPay"
                :style="methodSelect === 0 ? 'opacity: 1;font-weight:normal' : (methodSelect === 6 ? 'opacity: 1;font-weight:bold' : 'opacity: 0.6;font-weight:normal')"
              >
                <v-avatar :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">
                  <img src="/o/opencps-store/js/cli/dvc/app/image/logo-viettelpay.svg"  style="background: #fff">
                </v-avatar>
                <span class="py-2" :style="loadingPay ? 'pointer-events: none;' : 'cursor: pointer'">Thanh toán qua ứng dụng ViettelPay</span>
              </v-chip>
            </div>
            <!--  -->
            <div v-if="isBank" class="ml-0 mt-2 px-2 py-1" style="border: 1px solid #004b9485;border-radius: 3px;">
              <div>
                <input type="file" id="paymentFile1" @change="uploadPaymentFile($event)" style="display:none">
                <span class="text-bold" style="color: #004b94!important">Tải lên file báo thanh toán chuyển khoản (Định dạng: .png, .jpg, .jpeg)</span>
                <v-progress-circular
                :width="2"
                :size="25"
                color="green"
                indeterminate
                v-if="progressUploadPart"
                ></v-progress-circular>
                <v-tooltip top v-else class="ml-2">
                  <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile()">
                    <v-badge>
                      <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                    </v-badge>
                  </v-btn>
                  <span>Tải file lên</span>
                </v-tooltip>
              </div>
              <!-- view file -->
              <div v-if="paymentFile">
                <div v-on:click.stop="viewFile()" style="cursor: pointer;">
                  <v-icon size="18" color="#004b94">insert_drive_file</v-icon>
                  <span class="ml-2">{{paymentFileName}}</span>
                  <!-- <v-tooltip top class="ml-3">
                    <v-btn icon ripple slot="activator" v-on:click.stop="downloadPaymentFile(item)" class="mx-0 my-0">
                      <v-icon size="24" color="#004b94">cloud_download</v-icon>
                    </v-btn>
                    <span>Tải xuống</span>
                  </v-tooltip> -->
                  <v-btn dark small color="blue darken-1" class="ml-3 mr-2" v-on:click.stop="downloadPaymentFile(item)">
                    <v-icon>cloud_download</v-icon> &nbsp;
                    Tải xuống
                  </v-btn>
                  <!-- <v-tooltip top class="ml-3">
                    <v-btn slot="activator" icon class="mx-0 my-0" @click.stop="pickFile()">
                      <v-badge>
                        <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                      </v-badge>
                    </v-btn>
                    <span>Cập nhật</span>
                  </v-tooltip> -->
                  <v-btn dark small color="blue darken-1" class="ml-2 mr-2" @click.stop="pickFile()">
                    <v-icon>cloud_upload</v-icon> &nbsp;
                    Cập nhật
                  </v-btn>
                </div>
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
    <v-dialog v-model="dialogQrViettelPay" max-width="350" transition="scale-transition" origin="center center" style="overflow: hidden;">
      <v-card color="#24b2b4" class="text-xs-center">
        <v-toolbar dark color="primary">
          <v-toolbar-title class="white--text">THANH TOÁN DỊCH VỤ CÔNG</v-toolbar-title>
        </v-toolbar>
        <!-- <div class="py-2 pb-3 text-bold white--text" style="font-size: 18px">THANH TOÁN DỊCH VỤ CÔNG</div> -->
        <div class="d-inline-block py-2 mt-4" style="position:relative">
          <img class="logo" src="/o/opencps-store/js/cli/dvc/app/image/logo-viettelpay.svg" width="30" style="
            position: absolute;
            top: 70px;
            left: 60px;
            background: #efe5e5;
            border-radius: 5px;
          ">
          <qrcode :value="JSON.stringify(dataVietelPay)" :options="{ width: 150 }"></qrcode><br>
          <v-chip class="my-0 ml-1" color="#24b2b4" text-color="white" style="width:135px;margin-top:-5px !important">
            <span style="font-size:13px !important">Quét để thanh toán</span>
          </v-chip>
        </div>
      </v-card>
    </v-dialog>
    
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import {VMoney} from 'v-money'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
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
    dataVietelPay: '',
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
    dialogQrViettelPay: false,
    dialogPDF: false,
    dialogPDFLoading: true,
    isBank: false,
    errorNotSelect: false,
    methodSelect: 0,
    ipAddress:'',
    loadingPay: false
  }),
  directives: {money: VMoney},
  created () {
    var vm = this
    if (vm.detailDossier.hasOwnProperty('dossierId')) {
      let filter = vm.detailDossier
      vm.$store.dispatch('getPaymentFiles', filter).then(result => {
        vm.paymentFile = result
        vm.data_payment['paymentFile'] = vm.paymentFile
        vm.data_payment['paymentMethod'] = vm.isBank ? 'Chuyển khoản' : 'Keypay'
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
        //
        if (vm.paymentProfile.hasOwnProperty('epaymentProfile') && vm.paymentProfile.epaymentProfile) {
          let paymentConfigInfo = vm.getEPaymentProfile(vm.paymentProfile.epaymentProfile)
          if (paymentConfigInfo && paymentConfigInfo.hasOwnProperty('isPaygov') && paymentConfigInfo['isPaygov']) {
            vm.showPayGov = true
            $.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
              vm.ipAddress = data && data.hasOwnProperty('ip') ? data.ip : ''
              console.log('ipAddress', vm.ipAddress)
            })
          } else {
            vm.showPayGov = false
          }
          try {
            let jsonQR = JSON.parse(vm.paymentProfile.epaymentProfile)
            vm.dataVietelPay = jsonQR.genQRCode
          } catch (error) {
            vm.dataVietelPay = ''
          }
          
        }
        //
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
          paymentFile: vm.paymentFile,
          paymentMethod: vm.isBank ? 'Chuyển khoản' : 'Keypay'
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
          vm.data_payment['paymentMethod'] = vm.isBank ? 'Chuyển khoản' : 'Keypay'
          vm.$store.commit('setPaymentProfile', vm.data_payment)
        })
      }
    }
  },
  methods: {
    showThanhToanChuyenKhoan () {
      let vm = this
      vm.isBank = true
      vm.methodSelect = 1
      vm.$store.commit('setVisibleDoAction', true)
    },
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
        extensions: 'jpg,png,jpeg'
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
      let vm = this
      vm.isBank = false
      vm.methodSelect = 2
      vm.$store.commit('setVisibleDoAction', false)
      window.open(item, '_self')
    },
    toKeyPayDvcqg (text) {
      let vm = this
      vm.loadingPay = true
      vm.isBank = false
      if (text === 'kpdvcqg') {
        vm.methodSelect = 3
      } else {
        vm.methodSelect = 4
      }
      vm.$store.commit('setVisibleDoAction', false)
      let filter = {
        dossierId: vm.detailDossier.dossierId,
        key: text
      }
      vm.$store.dispatch('toKeypayDvcqg', filter).then(result => {
        vm.loadingPay = false
        window.open(result, '_self')
      }).catch(function() {
        vm.loadingPay = false
      })
    },
    toPayGov () {
      let vm = this
      vm.loadingPay = true
      vm.methodSelect = 5
      vm.isBank = false
      let filter = {
        dossierId: vm.detailDossier.dossierId,
        ipAddress: vm.ipAddress
      }
      vm.$store.dispatch('toPayGov', filter).then(result => {
        vm.loadingPay = false
        if (result.hasOwnProperty('url')) {
          window.open(result.url, '_self')
        }
      }).catch (function () {
        vm.loadingPay = false
      })
    },
    showViettelPay () {
      let vm = this
      vm.isBank = false
      vm.methodSelect = 6
      vm.$store.commit('setVisibleDoAction', false)
      vm.dialogQrViettelPay = true
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {}
}
</script>
