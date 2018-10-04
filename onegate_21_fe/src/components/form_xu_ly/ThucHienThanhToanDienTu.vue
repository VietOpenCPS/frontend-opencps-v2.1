<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span>{{paymentProfile.paymentFee}}</span>
        </div>
        <v-card>
          <!-- <v-card-text class="pb-1">
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Lệ phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <v-text-field
                  @keyup="changeFee"
                  v-model="paymentProfile.feeAmount"
                  v-money="money"
                  suffix="vnđ"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm2 class="pt-1">
                <v-subheader class="pl-0 text-right">Phí: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3 class="pt-1">
                <v-text-field
                  @keyup="changeFee"
                  v-model="paymentProfile.serviceAmount"
                  v-money="money"
                  suffix="vnđ"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2></v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right">Phí chuyển phát: </v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <v-text-field
                  @keyup="changeFee"
                  v-model="paymentProfile.shipAmount"
                  v-money="money"
                  suffix="vnđ"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text> -->
          <v-card-text class="px-4 pt-0">
            <!-- <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right"><span class="text-bold">Tổng: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 style="padding-top:7px">
                <span>{{currency(feeTong.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right"><span class="text-bold">Đã tạm nộp: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3>
                <v-text-field
                  @keyup="changeFee"
                  v-model="paymentProfile.advanceAmount"
                  v-money="money"
                  suffix="vnđ"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm1></v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0 text-right"><span class="text-bold">Còn phải nộp: </span></v-subheader>
              </v-flex>
              <v-flex xs12 sm3 style="padding-top:7px">
                <span>{{currency(totalFee.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
              </v-flex>
              <v-flex xs12 sm1></v-flex>
            </v-layout>  -->
            <!-- epayment -->
            <div v-if="paymentProfile.hasOwnProperty('epaymentProfile') && paymentProfile.epaymentProfile['bank']">
              <div>
                <input type="file" id="paymentFile1" @change="uploadPaymentFile($event)" style="display:none">
                <span>Tải lên file báo thanh toán <span style="color:red">*</span></span>
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
              <div>
                <span v-on:click.stop="viewFile(paymentFile)" style="cursor: pointer;">
                  <v-icon v-if="paymentFile.fileSize !== 0">attach_file</v-icon>
                  {{paymentFile.displayName}}.{{paymentFile.fileType}} - 
                  <i>{{paymentFile.modifiedDate}}</i>
                </span>
                <v-tooltip top>
                  <v-btn icon ripple slot="activator" v-on:click.stop="downloadPaymentFile(item)" class="mx-0 my-0">
                    <v-icon style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                  </v-btn>
                  <span>Tải xuống</span>
                </v-tooltip>
                <!-- <v-btn icon ripple v-on:click.stop="deleteFile(paymentFile)" class="mx-0 my-0">
                  <v-icon style="color: red">delete_outline</v-icon>
                </v-btn> -->
              </div>
            </div>
            <!-- paymentNote -->
            <!-- <v-layout wrap style="position: relative">
              <v-flex style="width:70px" class="my-0 py-1"><span class="red--text">* </span>&nbsp;Ghi chú:</v-flex>
              <v-flex style="width:calc(100% - 80px)">
                <div v-if="activeEdit == false" class="pl-2">
                  <v-text-field class="py-0"
                  v-model="paymentProfile.confirmNote"
                  @change="changeFee"
                  multi-line
                  :readonly='activeEdit'
                  required
                  ></v-text-field>
                </div>
                <p class="px-2 my-0 py-1" v-if="activeEdit||paymentProfile.confirmNote===''">
                  {{paymentProfile.confirmNote}} &nbsp;&nbsp;
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
            </v-layout>  -->
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
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import toastr from 'toastr'
import {VMoney} from 'v-money'
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
    data_payment: {},
    paymentFile: '',
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
    dialogPDFLoading: true
  }),
  directives: {money: VMoney},
  created () {
    var vm = this
    if (vm.paymentProfile) {
      if (vm.paymentProfile.hasOwnProperty('epaymentProfile') && !vm.paymentProfile.epaymentProfile.bank) {
        if (vm.paymentProfile.epaymentProfile.hasOwnProperty('url') && !vm.paymentProfile.epaymentProfile.url) {
          let url = vm.paymentProfile.epaymentProfile.url
          window.open(url, '_self')
        }
      } else if (vm.paymentProfile.hasOwnProperty('epaymentProfile') && vm.paymentProfile.epaymentProfile.bank) {
        setTimeout(function () {
          let feeAmount = vm.paymentProfile.feeAmount ? Number(vm.paymentProfile.feeAmount.toString().replace(/\./g, '')) : 0
          let advanceAmount = vm.paymentProfile.advanceAmount ? Number(vm.paymentProfile.advanceAmount.toString().replace(/\./g, '')) : 0
          let serviceAmount = vm.paymentProfile.serviceAmount ? Number(vm.paymentProfile.serviceAmount.toString().replace(/\./g, '')) : 0
          let shipAmount = vm.paymentProfile.shipAmount ? Number(vm.paymentProfile.shipAmount.toString().replace(/\./g, '')) : 0
          vm.feeTong = feeAmount + serviceAmount + shipAmount
          vm.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
          if (vm.totalFee < 0) {
            vm.totalFee = 0
          }
          vm.data_payment = {
            advanceAmount: advanceAmount,
            feeAmount: feeAmount,
            serviceAmount: serviceAmount,
            shipAmount: shipAmount,
            paymentAmount: vm.totalFee,
            paymentNote: vm.paymentProfile.confirmNote,
            paymentFile: vm.paymentFile
          }
          vm.$store.commit('setPaymentProfile', vm.data_payment)
        }, 200)
      }
    }
  },
  watch: {
  },
  methods: {
    changeFee () {
      var vm = this
      let val = vm.paymentProfile
      let feeAmount = val.feeAmount ? Number(val.feeAmount.toString().replace(/\./g, '')) : 0
      let advanceAmount = Number(val.advanceAmount.toString().replace(/\./g, ''))
      let serviceAmount = Number(val.serviceAmount.toString().replace(/\./g, ''))
      let shipAmount = Number(val.shipAmount.toString().replace(/\./g, ''))
      vm.feeTong = feeAmount + serviceAmount + shipAmount
      vm.totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
      if (vm.totalFee < 0) {
        vm.totalFee = 0
      }
      vm.data_payment = {
        advanceAmount: advanceAmount,
        feeAmount: feeAmount,
        serviceAmount: serviceAmount,
        shipAmount: shipAmount,
        paymentAmount: vm.totalFee,
        paymentNote: vm.paymentProfile.confirmNote
      }
      // vm.$store.commit('setPaymentProfile', vm.data_payment)
    },
    uploadPaymentFile (e) {
      var vm = this
      vm.progressUploadPart = true
      var data = {}
      data['dossierId'] = vm.detailDossier.dossierId
      data['referenceUid'] = vm.detailDossier.referenceUid
      data['selector'] = 'paymentFile1'
      vm.$store.dispatch('uploadPaymentFile', data).then(function (result) {
        console.log('uploadPayment1')
        vm.progressUploadPart = false
        vm.$store.dispatch('getPaymentFiles', data).then(result => {
          vm.paymentFile = result
          vm.data_payment['paymentFile'] = vm.paymentFile
          vm.$store.commit('setPaymentProfile', vm.data_payment)
          console.log('vm.paymentFile', vm.paymentFile)
        })
      }).catch(function (xhr) {
        vm.progressUploadPart = false
      })
    },
    viewFile (data) {
      let vm = this
      if (data.fileSize === 0) {
        return
      }
      if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar') {
        // test local
        // let url = 'http://127.0.0.1:8081/api/dossiers/' + vm.dossierId + '/payment/confirmfile'
        let url = '/o/rest/v2/dossiers/' + vm.detailDossier.dossierId + '/payments/' + vm.detailDossier.referenceUid + '/confirmfile'
        window.open(url)
      } else {
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        data['dossierId'] = vm.detailDossier.dossierId
        data['referenceUid'] = vm.detailDossier.referenceUid
        vm.$store.dispatch('viewPaymentFile', data).then(result => {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPreview').src = result
        })
      }
    },
    deleteFile (item) {
      var vm = this
      let x = confirm('Bạn có chắc chắn xóa file?')
      if (x) {
        item['dossierId'] = vm.dossierId
        vm.$store.dispatch('deletePaymentFile', item).then(resFile => {
          toastr.success('Xóa file thành công.')
          vm.paymentFile = ''
          vm.data_payment['paymentFile'] = vm.paymentFile
          vm.$store.commit('setPaymentProfile', vm.data_payment)
        }).catch(reject => {
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
      document.getElementById('paymentFile1').click()
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
