<template>
  <div>
    <v-card>
      <div class="row-header">
        <div class="background-triangle-big"> <span>THÔNG TIN THANH TOÁN</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              Quay lại &nbsp;
              <v-icon size="16">undo</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <div>
        <div class="mx-2 my-3">
          <v-alert v-if="statusDeal" outline :value="true" type="success">
            Giao dịch thanh toán thành công
          </v-alert>
          <v-alert v-else outline :value="true" type="error">
            Giao dịch thực hiện thất bại. {{keypayStatusText}}
          </v-alert>
        </div>
        <v-card class="mx-2">
          <v-card-text class="px-0 py-0">
            <div class="table-bordered" style="border-top: 1px solid #dedede;">
              <div class="table__overflow">
                <table class="datatable table">
                  <tbody>
                    <tr>
                      <td width="200"><span class="text-bold">Tên hồ sơ</span></td>
                      <td><span>{{dossierDetail.serviceName}}</span></td>
                    </tr>
                    <tr>
                      <td><span class="text-bold">Mã hồ sơ</span></td>
                      <td><span>{{dossierDetail.dossierNo}}</span></td>
                    </tr>
                    <tr>
                      <td><span class="text-bold">Cơ quan thực hiện</span></td>
                      <td><span>{{dossierDetail.govAgencyName}}</span></td>
                    </tr>
                    <tr>
                      <td><span class="text-bold">Tên phí, lệ phí</span></td>
                      <td><span>{{dossierDetail.paymentFee}}</span></td>
                    </tr>
                    <tr>
                      <td><span class="text-bold">Tổng tiền</span></td>
                      <td><span>{{currency(dossierDetail.paymentAmount)}} VNĐ</span></td>
                    </tr>
                    <tr v-if="statusDeal">
                      <td><span class="text-bold">Mã giao dịch trực tuyến</span></td>
                      <td><span>{{dossierDetail.transId}}</span></td>
                    </tr>
                    <tr v-if="statusDeal">
                      <td><span class="text-bold">Mã đơn hàng</span></td>
                      <td><span>{{dossierDetail.goodCode}}</span></td>
                    </tr>
                    <tr v-if="statusDeal">
                      <td><span class="text-bold">Cổng thanh toán</span></td>
                      <td><span>{{dossierDetail.paymentPortal}}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>

import Vue from 'vue'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: true,
    loadingAction: false,
    statusDeal: false,
    keypayStatusText: '',
    dossierDetail: {
      serviceName: '',
      dossierNo: '',
      govAgencyName: '',
      paymentFee: '',
      paymentAmount: '',
      transId: '',
      goodCode: '',
      paymentPortal: ''
    },
    keypayStatusCode: {
      "00": "Thành công",
      "01": "Đại lý không tồn tại trong hệ thống",
      "02": "Chuỗi mã hóa không hợp lệ",
      "03": "Mã giao dịch đại lý không hợp lệ",
      "04": "Không tìm thấy giao dịch trong hệ thống",
      "05": "Mã dịch vụ không hợp lệ",
      "06": "Lỗi xác nhận giao dịch: giao dịch đã được xác nhận (thành công/ không thành công trước đó và không thể xác nhận lại)",
      "07": "Mã quốc gia không hợp lệ",
      "08": "Không nhận được thông điệp trả về từ Ngân Hàng",
      "09": "Mô tả đơn hàng không hợp lệ",
      "10": "Mã đơn hàng không hợp lệ",
      "11": "Số tiền không hợp lệ",
      "12": "Phí vận chuyển không hợp lệ",
      "13": "Thuế không hợp lệ",
      "14": "Đại lý chưa được cấu hình phí",
      "15": "Sai mã Ngân hàng",
      "16": "Số tiền thanh toán của Đại lý không nằm trong khoảng cho phép",
      "17": "Tài khoản không đủ tiền",
      "18": "Khách hàng đã Hủy giao dịch",
      "19": "Thời gian thanh toán không hợp lệ",
      "20": "Kiểu nhận mã OTP không hợp lệ",
      "21": "Mã OTP sai",
      "25": "Nhập sai thông tin chủ thẻ lần 1",
      "26": "Nhập sai thông tin chủ thẻ lần 2",
      "27": "Nhập sai thông tin chủ thẻ lần 3",
      "30": "Phiên bản không hợp lệ",
      "31": "Mã lệnh không hợp lệ",
      "32": "Loại tiền tệ không hợp lệ",
      "33": "Ngôn ngữ không hợp lệ",
      "34": "Thông tin thêm (desc 1) không hợp lệ",
      "35": "Thông tin thêm (desc 2) không hợp lệ",
      "36": "Thông tin thêm (desc 3) không hợp lệ",
      "37": "Thông tin thêm (desc 4) không hợp lệ",
      "38": "Thông tin thêm (desc 5) không hợp lệ",
      "39": "Chuỗi trả về - Return URL không hợp lệ",
      "40": "Loại thẻ không hợp lệ",
      "41": "Thẻ nghi vấn (thẻ đánh mất, hot card)",
      "54": "Thẻ hết hạn",
      "57": "Chưa đăng ký dịch vụ thanh toán trực tuyến",
      "61": "Quá hạn mức giao dịch trong ngày",
      "62": "Thẻ bị khóa",
      "65": "Quá hạn mức 1 lần giao dịch",
      "97": "Ngân hàng chưa sẵn sàng",
      "98": "Giao dịch không",
      "99": "Lỗi hệ thống"
    }
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let query = vm.$router.history.current.query
      let responseCode = query.hasOwnProperty('response_code') ? query.response_code : ''
      let dossierId = query.hasOwnProperty('dossierId') ? query.dossierId : ''
      let referenceUidQuery = query.hasOwnProperty('referenceUid') ? query.referenceUid : ''
      let actionCode = query.hasOwnProperty('actionCode') ? query.actionCode : ''
      if (dossierId) {
        if (responseCode === '00') {
          vm.statusDeal = true
        } else {
          vm.statusDeal = false
          vm.keypayStatusText = vm.keypayStatusCode['responseCode'] ? vm.keypayStatusCode['responseCode'] : ''
        }
        vm.$store.dispatch('getDetailDossier', dossierId).then(resultDossier => {
          vm.dossierDetail['serviceName'] = resultDossier.serviceName
          vm.dossierDetail['dossierNo'] = resultDossier.dossierNo
          vm.dossierDetail['govAgencyName'] = resultDossier.govAgencyName
          vm.dossierDetail['transId'] = query.transId
          vm.dossierDetail['goodCode'] = query.goodCode
          vm.dossierDetail['paymentPortal'] = query.paymentPortal
          vm.dossierDetail['paymentAmount'] = query.net_cost
          let filter = {
            dossierId: resultDossier.dossierId,
            referenceUid: !referenceUidQuery ? resultDossier.referenceUid : referenceUidQuery
          }
          let filterPayment = {
            dossierId: !referenceUidQuery ? resultDossier.referenceUid : referenceUidQuery
          }
          if (vm.statusDeal === true) {
            vm.$store.dispatch('putPayments', filter).then(result => {
              vm.$store.dispatch('loadDossierPayments', filterPayment).then(result => {
                vm.dossierDetail['paymentFee'] = vm.getEPaymentProfile(result.epaymentProfile).paymentFee
              }).catch(reject => {
              })
              if (actionCode) {
                let fiter2 = {
                  dossierId: !referenceUidQuery ? resultDossier.referenceUid : referenceUidQuery,
                  actionCode: actionCode
                }
                vm.$store.dispatch('processDossierRouter', fiter2).then(function (result) {
                }).catch(function () {
                })
              }
            }).catch(reject => {
            })
          } else {
            vm.$store.dispatch('loadDossierPayments', filterPayment).then(result => {
              vm.dossierDetail['paymentFee'] = vm.getEPaymentProfile(result.epaymentProfile).paymentFee
            }).catch(reject => {
            })
          }
        })
      }
    })
  },
  watch: {},
  methods: {
    currency (value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 0
      }
      return 0
    },
    goBack () {
      var vm = this
      let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      let url = redirectURL + '/dich-vu-cong#/'
      window.open(url, '_self')
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
    }
  }
}
</script>

