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
          <v-alert outline :value="true" type="success">
            Giao dịch thanh toán thành công
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
                    <tr>
                      <td><span class="text-bold">Mã giao dịch trực tuyến</span></td>
                      <td><span>{{dossierDetail.transId}}</span></td>
                    </tr>
                    <tr>
                      <td><span class="text-bold">Mã tra cứu trên cổng thanh toán</span></td>
                      <td><span>{{dossierDetail.goodCode}}</span></td>
                    </tr>
                    <tr>
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
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
export default {
  props: [],
  components: {},
  data: () => ({
    loading: true,
    loadingAction: false,
    dossierDetail: {
      serviceName: '',
      dossierNo: '',
      govAgencyName: '',
      paymentFee: '',
      paymentAmount: '',
      transId: '',
      goodCode: '',
      paymentPortal: ''
    }
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let query = vm.$router.history.current.query
      let dossierId = query.hasOwnProperty('dossierId') ? query.dossierId : ''
      let actionCode = query.hasOwnProperty('actionCode') ? query.actionCode : ''
      if (dossierId) {
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
            referenceUid: resultDossier.referenceUid
          }
          vm.$store.dispatch('putPayments', filter).then(result => {
            vm.dossierDetail['paymentFee'] = result.paymentFee
            if (actionCode) {
              let fiter2 = {
                dossierId: dossierId,
                actionCode: actionCode
              }
              vm.$store.dispatch('processDossierRouter', fiter2).then(function (result) {
              }).catch(function () {
              })
            }
          }).catch(reject => {
          })
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
    }
  }
}
</script>

