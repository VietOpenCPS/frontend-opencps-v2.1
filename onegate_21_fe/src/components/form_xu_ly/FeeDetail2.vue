<template>
  <div style="width:100%" class="payment-info">
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span v-if="data_payment.requestPayment === 1 || data_payment.requestPayment === 3 || data_payment.requestPayment === 4 || data_payment.requestPayment === 5">
            Phí, lệ phí thủ tục hành chính
          </span>
          <span v-if="data_payment.requestPayment === 2">Lập phiếu thanh toán</span>
        </div>
        <v-card>
          <!-- CHI TIẾT CÁC KHOẢN -->
          <v-card-text class="pb-1">
            <!-- DANH SÁCH -->
            <v-data-table
              v-if="feeList && feeList.length"
              :headers="headers"
              :items="feeList"
              hide-actions
              class="elevation-1"
              style="border-bottom: 1px solid #dedede;border-left: 1px solid #dedede;"
            >
              <template slot="items" slot-scope="props">
                <td width="50" class="text-xs-center pt-2"> {{ props.index + 1 }}</td>
                <td class="text-xs-left py-1">
                  <div v-if="!getDataSource('paymentFee')">
                    <v-text-field
                      v-model="props.item.paymentFee"
                      v-if="data_payment.editable === 1 || data_payment.editable === 2 || data_payment.editable === 3"
                      @input="changeTenPhi"
                    ></v-text-field>
                    <p class="mt-1 mb-0" v-else>{{props.item.paymentFee}}</p>
                  </div>
                  <div v-else>
                    <v-combobox @change="changeFee(props.index)" v-if="data_payment.editable === 1 || data_payment.editable === 2 || data_payment.editable === 3" 
                    v-model="props.item.paymentFee" :items="getDataSource('paymentFee')"></v-combobox>
                    <p class="mt-1 mb-0" v-else>{{props.item.paymentFee}}</p>
                  </div>
                </td>
                <td class="px-3 py-1" style="width: 170px">
                  <div v-if="!getDataSource('feeAmount')">
                    <v-text-field
                      @keyup="changeFee(props.index)"
                      v-model="props.item.feeAmount"
                      v-money="money"
                      suffix=""
                      v-if="data_payment.editable === 1 || data_payment.editable === 3"
                    ></v-text-field>
                    <p class="mt-1 mb-0" v-else>{{currency(props.item.feeAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </p>
                  </div>
                  <div v-else>
                    <v-combobox @change="changeFee(props.index)" v-if="data_payment.editable === 1 || data_payment.editable === 3"
                    v-model="props.item.feeAmount" :items="getDataSource('feeAmount')"></v-combobox>
                    <p class="mt-1 mb-0" v-else>{{currency(props.item.feeAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </p>
                  </div>
                </td>
                <td class="px-3 py-1" style="width: 170px">
                  <div v-if="!getDataSource('serviceAmount')">
                    <v-text-field
                      @keyup="changeFee(props.index)"
                      v-model="props.item.serviceAmount"
                      v-money="money"
                      suffix=""
                      v-if="data_payment.editable === 2 || data_payment.editable === 3"
                    ></v-text-field>
                    <p class="mt-1 mb-0" v-else>{{currency(props.item.serviceAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </p>
                  </div>
                  <div v-else>
                    <v-combobox @change="changeFee(props.index)" v-if="data_payment.editable === 2 || data_payment.editable === 3"
                    v-model="props.item.serviceAmount" :items="getDataSource('serviceAmount')" ></v-combobox>
                    <p class="mt-1 mb-0" v-else>{{currency(props.item.serviceAmount.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </p>
                  </div>
                </td>
                <td v-if="showCounterFee" class="py-1" style="width: 170px">
                  <v-text-field
                    @keyup="changeFee(props.index)"
                    @change="changeFee(props.index)"
                    @input="changeFee(props.index)"
                    v-model="props.item.counter"
                    type="number"
                    v-if="data_payment.editable === 2 || data_payment.editable === 3"
                  ></v-text-field>
                  <p class="mt-1 mb-0" v-else>{{props.item.counter}}</p>
                </td>
                <td width="170" class="text-xs-left px-2 py-1" style="font-weight: bold;">
                  <div xs12 sm3 v-if="data_payment.requestPayment === 1" style="">
                    <span>{{currency(props.item.feeTong.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </span>
                  </div>
                  <div xs12 sm3 v-if="data_payment.requestPayment === 2" style="padding-top:7px">
                    <span>{{currency(props.item.totalFee.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </span>
                  </div>
                  <div xs12 sm3 v-if="data_payment.requestPayment === 4 || data_payment.requestPayment === 5" style="padding-top:7px">
                    <span>{{currency(props.item.feeTong.toString().replace(/\./g, ''))}} &nbsp;&nbsp; </span>
                  </div>
                </td>
                <td v-if="splitBienLai && paymentDetail.paymentStatus != 5 && !props.item.hasOwnProperty('invoiceFileEntryId')" width="120" class="text-xs-center py-1">
                  <v-tooltip top>
                    <v-btn v-if="props.index !== 0" slot="activator" width="50" height="32" color="red" dense small dark @click="xoaBienLai(props.index)">
                      <v-icon style="color: #fff !important">delete</v-icon>
                    </v-btn>
                    <span>Xóa</span>
                  </v-tooltip>
                  <v-tooltip top class="ml-2">
                    <v-btn slot="activator" width="50" height="32" color="primary" dense small dark @click="themBienLai">
                      <v-icon>add</v-icon>
                    </v-btn>
                    <span>Thêm biên lai</span>
                  </v-tooltip>
                </td>
              </template>
              <template slot="footer" >
                <td :colspan="showCounterFee ? 5 : 4" class="text-xs-center" style="border-right: 1px solid #dedede;">
                  <span style="font-size: 14px;">TỔNG TIỀN</span>
                </td>
                <td :colspan="splitBienLai && paymentDetail.paymentStatus != 5 ? 2 : 1" class="px-2 text-xs-left" style="border-right: 1px solid #dedede;font-weight: bold;">
                  <span>{{currency(totalFeeAll.toString().replace(/\./g, ''))}} &nbsp;&nbsp; vnđ</span>
                </td>
              </template>
            </v-data-table>
            <v-layout wrap class="my-2">
              <v-flex style="max-width: 145px;" v-if="getDataSource('paymentMethod') && data_payment.requestPayment == 5 && (data_payment.editable === 1 || data_payment.editable === 2 || data_payment.editable === 3)">
                <v-subheader class="pl-0 text-right">Hình thức thanh toán: </v-subheader>
              </v-flex>
              <v-flex style="max-width: 300px;" v-if="getDataSource('paymentMethod') && data_payment.requestPayment == 5 && (data_payment.editable === 1 || data_payment.editable === 2 || data_payment.editable === 3)">
                <v-autocomplete item-text="name" @change="changeMethod" v-model="data_payment.paymentMethod" :items="getDataSource('paymentMethod')"></v-autocomplete>
              </v-flex>
            </v-layout>
            <!--  -->
            <v-layout wrap style="position: relative" class="my-2">
              <v-flex style="width:145px;max-width: 145px;" class="my-0 py-0">
                <v-subheader class="pl-0 text-right">Ghi chú: </v-subheader>
              </v-flex>
              <v-flex>
                <div v-if="activeEdit == false" class="">
                  <v-textarea class="py-0"
                  v-model="data_payment.paymentNote"
                  row="2"
                  :readonly='activeEdit'
                  required
                  ></v-textarea>
                </div>
                <p class="my-0 py-1" v-if="activeEdit||data_payment.paymentNote===''">
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
        <v-toolbar flat dark color="primary">
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

import {VMoney} from 'v-money'
export default {
  props: {
    paymentDetail: {
      type: Object,
      default: () => {}
    },
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
    },
    dataSource: {
      type: Object,
      default: () => {}
    },
    splitBienLai: {
      type: Boolean,
      default: () => false
    }
  },
  model: {
    prop: 'payments'
  },
  data: () => ({
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên phí, lệ phí',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lệ phí',
        align: 'center',
        sortable: false
      },
      {
        text: 'Phí',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thành tiền',
        align: 'center',
        sortable: false
      }
    ],
    feeList: '',
    showCounterFee: false,
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
    dialogPDFLoading: true,
    totalFeeAll: 0
  }),
  directives: {money: VMoney},
  created () {
    var vm = this
    vm.data_payment = vm.payments
    if (vm.payments.hasOwnProperty('groupPaymentFile') && vm.payments.groupPaymentFile) {
      vm.feeList = JSON.parse(vm.payments.groupPaymentFile)
    } else {
      let item = {
        requestPayment: vm.payments['requestPayment'],
        advanceAmount: vm.payments['advanceAmount'],
        feeAmount: vm.payments['feeAmount'],
        serviceAmount: vm.payments['serviceAmount'],
        shipAmount: vm.payments['shipAmount'],
        counter: vm.payments.hasOwnProperty('counter') ? vm.payments['counter'] : '',
        paymentFee: vm.payments['paymentFee'],
        feeTong: 0,
        totalFee: 0
      }
      vm.feeList = [item]
    }
    console.log('feeLisst', vm.feeList)
    vm.showCounterFee = vm.payments.hasOwnProperty('counter')
    if (vm.showCounterFee) {
      vm.headers = [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên phí, lệ phí',
          align: 'center',
          sortable: false
        },
        {
          text: 'Lệ phí',
          align: 'center',
          sortable: false
        },
        {
          text: 'Phí',
          align: 'center',
          sortable: false
        },
        {
          text: 'Số lượng',
          align: 'center',
          sortable: false
        },
        {
          text: 'Thành tiền',
          align: 'center',
          sortable: false
        }
      ]
    }
    if (vm.splitBienLai && vm.paymentDetail.paymentStatus != 5) {
      vm.headers.push({
        text: 'Thao tác',
        align: 'center',
        sortable: false
      })
    }
    if (vm.payments) {
      setTimeout(function () {
        vm.totalFeeAll = 0
        for (let index = 0; index < vm.feeList.length; index++) {
          let element = vm.feeList[index];
          let feeAmount = typeof(element.feeAmount) === 'number' ? Number(element.feeAmount) : Number(element.feeAmount.toString().replace(/\./g, ''))
          if (element.requestPayment === 1) {
            let serviceAmount = typeof(element.serviceAmount) === 'number' ? Number(element.serviceAmount) : Number(element.serviceAmount.toString().replace(/\./g, ''))
            vm.feeList[index].feeTong = feeAmount + serviceAmount
            vm.feeList[index].totalFee = feeAmount + serviceAmount
          } else if (element.requestPayment === 2) {
            let serviceAmount = element.serviceAmount ? Number(element.serviceAmount.toString().replace(/\./g, '')) : 0
            let shipAmount = element.shipAmount ? Number(element.shipAmount.toString().replace(/\./g, '')) : 0
            if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
              vm.feeList[index].totalFee = feeAmount + serviceAmount + shipAmount
            } else {
              vm.feeList[index].totalFee = feeAmount + serviceAmount
            }
          } else {
            let advanceAmount = element.advanceAmount ? Number(element.advanceAmount.toString().replace(/\./g, '')) : 0
            let serviceAmount = element.serviceAmount ? Number(element.serviceAmount.toString().replace(/\./g, '')) : 0
            let shipAmount = element.shipAmount ? Number(element.shipAmount.toString().replace(/\./g, '')) : 0
            if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
              vm.feeList[index].feeTong = feeAmount + serviceAmount + shipAmount
              vm.feeList[index].totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
            } else {
              vm.feeList[index].feeTong = feeAmount + serviceAmount
              vm.feeList[index].totalFee = feeAmount + serviceAmount - advanceAmount
            }
          }
          if (vm.showCounterFee) {
            vm.feeList[index].feeTong = vm.feeList[index].feeTong*element.counter
            vm.feeList[index].totalFee = vm.feeList[index].totalFee*element.counter
          }
          if (vm.feeList[index].totalFee < 0) {
            vm.feeList[index].totalFee = 0
          }
          vm.totalFeeAll += vm.feeList[index].totalFee
        }
      }, 300)
      if (vm.payments.requestPayment === 5) {
        let filter = vm.detailDossier
        vm.$store.dispatch('getPaymentFiles', filter).then(result => {
          vm.paymentFile = result
        })
      }
    }
  },
  computed: {
    paymentFileName () {
      return this.$store.getters.getPaymentFileName
    },
    originality () {
      let vm = this
      return vm.getOriginality()
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
    themBienLai () {
      let vm = this
      let item = {
        requestPayment: vm.payments['requestPayment'],
        advanceAmount: vm.payments['advanceAmount'],
        feeAmount: 0,
        serviceAmount: 0,
        shipAmount: vm.payments['shipAmount'],
        counter: vm.payments.hasOwnProperty('counter') ? vm.payments['counter'] : '',
        paymentFee: vm.payments['paymentFee'],
        feeTong: 0,
        totalFee: 0
      }
      vm.feeList.push(item)
    },
    xoaBienLai (index) {
      let vm = this
      vm.feeList.splice(index, 1)
      vm.changeFee()
    },
    changeFee () {
      var vm = this
      setTimeout(function () {
        let listGroupPayment = []
        vm.totalFeeAll = 0
        vm.payments.advanceAmount = 0
        vm.payments.feeAmount = 0
        vm.payments.serviceAmount = 0
        for (let index = 0; index < vm.feeList.length; index++) {
          let element = vm.feeList[index];
          let feeAmount = typeof(element.feeAmount) === 'number' ? Number(element.feeAmount) : Number(element.feeAmount.toString().replace(/\./g, ''))
          if (element.requestPayment === 1) {
            let serviceAmount = typeof(element.serviceAmount) === 'number' ? Number(element.serviceAmount) : Number(element.serviceAmount.toString().replace(/\./g, ''))
            vm.feeList[index].feeTong = feeAmount + serviceAmount
            vm.feeList[index].totalFee = feeAmount + serviceAmount
            // 
            vm.payments.feeAmount = Number(vm.payments.feeAmount) + feeAmount
            vm.payments.serviceAmount = Number(vm.payments.serviceAmount) + serviceAmount
            listGroupPayment.push({
              feeAmount: feeAmount,
              serviceAmount: serviceAmount,
              paymentFee: element.paymentFee,
              paymentAmount: vm.feeList[index].totalFee,
              tranId: index + 1
            })
          } else if (element.requestPayment === 2) {
            let serviceAmount = element.serviceAmount ? Number(element.serviceAmount.toString().replace(/\./g, '')) : 0
            let shipAmount = element.shipAmount ? Number(element.shipAmount.toString().replace(/\./g, '')) : 0
            if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
              vm.feeList[index].totalFee = feeAmount + serviceAmount + shipAmount
            } else {
              vm.feeList[index].totalFee = feeAmount + serviceAmount
            }
            // 
            vm.payments.feeAmount = Number(vm.payments.feeAmount) + feeAmount
            vm.payments.serviceAmount = Number(vm.payments.serviceAmount) + serviceAmount
            listGroupPayment.push({
              feeAmount: feeAmount,
              serviceAmount: serviceAmount,
              paymentFee: element.paymentFee,
              paymentAmount: vm.feeList[index].totalFee,
              tranId: index + 1
            })
          } else {
            let advanceAmount = element.advanceAmount ? Number(element.advanceAmount.toString().replace(/\./g, '')) : 0
            let serviceAmount = element.serviceAmount ? Number(element.serviceAmount.toString().replace(/\./g, '')) : 0
            let shipAmount = element.shipAmount ? Number(element.shipAmount.toString().replace(/\./g, '')) : 0
            if ((vm.viaPortal === 2 || vm.viaPortal === '2') && shipAmount !== 0) {
              vm.feeList[index].feeTong = feeAmount + serviceAmount + shipAmount
              vm.feeList[index].totalFee = feeAmount + serviceAmount + shipAmount - advanceAmount
            } else {
              vm.feeList[index].feeTong = feeAmount + serviceAmount
              vm.feeList[index].totalFee = feeAmount + serviceAmount - advanceAmount
            }
            // 
            vm.payments.advanceAmount = Number(vm.payments.advanceAmount) + advanceAmount
            vm.payments.feeAmount = Number(vm.payments.feeAmount) + feeAmount
            vm.payments.serviceAmount = Number(vm.payments.serviceAmount) + serviceAmount
            listGroupPayment.push({
              feeAmount: feeAmount,
              serviceAmount: serviceAmount,
              paymentFee: element.paymentFee,
              paymentAmount: vm.feeList[index].totalFee,
              tranId: index + 1
            })
          }
          if (vm.showCounterFee) {
            vm.feeList[index].feeTong = vm.feeList[index].feeTong*element.counter
            vm.feeList[index].totalFee = vm.feeList[index].totalFee*element.counter
          }
          if (vm.feeList[index].totalFee < 0) {
            vm.feeList[index].totalFee = 0
          }
          vm.totalFeeAll += vm.feeList[index].totalFee
          // 
          vm.payments.counter = vm.feeList[0].counter
          // 

        }
        vm.payments.paymentAmount = vm.totalFeeAll
        if (vm.splitBienLai && vm.feeList && vm.feeList.length > 1) {
          vm.payments.groupPaymentFile = JSON.stringify(listGroupPayment)
        }
        if (vm.feeList && vm.feeList.length == 1) {
          vm.payments.paymentFee = vm.feeList[0]['paymentFee']
        }
        console.log('ThongTinThanhToan', vm.payments)
      }, 200)
    },
    changeTenPhi (ten) {
      let vm = this
      setTimeout(function () {
        if (vm.feeList && vm.feeList.length == 1) {
          vm.payments.paymentFee = vm.feeList[0]['paymentFee']
        }
      }, 100)
    },
    changeMethod () {
      let vm = this
      vm.payments.paymentMethod = vm.data_payment.paymentMethod
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
    getDataSource (key) {
      let vm = this
      let data = vm.dataSource
      if (!data || Object.keys(data).length == 0) {
        return false
      }
      let source = data[key] ? data[key] : ''
      return source
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {}
}
</script>
