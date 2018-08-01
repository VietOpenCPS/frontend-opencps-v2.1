<template>
  <div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header">
      <div class="background-triangle-big"> <span>{{actionActive.tiltle}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="dossierSelected[0].serviceName">
          {{dossierSelected[0].serviceName}}
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
          HỒ SƠ XỬ LÝ &nbsp;&nbsp;&nbsp;&nbsp; 
        </div>
        <v-card>
          <v-card-text class="px-0 pt-0">
            <v-data-table
            :headers="headersTable"
            :items="dossierSelected"
            hide-actions
            class="table-landing table-bordered"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                  <td class="text-xs-center">
                    <div>
                      <span>{{props.index + 1}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <div>
                      <span>{{props.item.dossierNo}}</span><br>
                      <span style="color:green" v-if="!props.item.online">Hồ sơ một cửa</span>
                      <span style="color:blue" v-else>Hồ sơ trực tuyến</span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <div>
                      <span>{{props.item.applicantName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <div>
                      <span>{{props.item.wardName}}, {{props.item.districtName}}, {{props.item.cityName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <div>
                      <span> Tiếp nhận: {{props.item.receiveDate}}<br>
                        Hẹn trả: {{props.item.receiveDate}}<br>
                        <span>{{props.item.dossierOverdue}}</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition">
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
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
    <!--  -->
    <div>
      <v-layout wrap v-if="dialogActionProcess">
        <form-bo-sung-thong-tin ref="formBoSungThongTinNgan" v-if="showFormBoSungThongTinNgan" :dossier_id="Number(id)" :action_id="Number(actionIdCurrent)"></form-bo-sung-thong-tin>
        <phan-cong v-if="showPhanCongNguoiThucHien" v-model="assign_items" :type="type_assign" ></phan-cong>
        <!-- <tai-lieu-ket-qua v-if="showTaoTaiLieuKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="createFiles"></tai-lieu-ket-qua> -->
        <!-- showTaoTaiLieuKetQua: {{showTaoTaiLieuKetQua}} <br/> -->
        <tra-ket-qua v-if="showTraKetQua" :resultFiles="returnFiles"></tra-ket-qua>
        <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail"></thu-phi>
        <ky-duyet ref="kypheduyettailieu" :detailDossier="thongTinChiTietHoSo" v-if="showKyPheDuyetTaiLieu"></ky-duyet>
        <!-- showThucHienThanhToanDienTu: {{showThucHienThanhToanDienTu}} <br/> -->
        <y-kien-can-bo ref="ykiencanbo" v-if="showYkienCanBoThucHien" :user_note="userNote"></y-kien-can-bo>
        <v-btn color="primary" @click.native="processAction()" v-if="dialogActionProcess"
          :loading="loadingActionProcess"
          :disabled="loadingActionProcess"
          >
          <v-icon>save</v-icon>&nbsp;
          Xác nhận
          <span slot="loader">Loading...</span>
        </v-btn>
        <v-btn color="primary" @click="goBack()">
        <v-icon>undo</v-icon>&nbsp;
        Quay lại
      </v-btn>
      </v-layout>
      <v-alert v-if="!btnStateVisible" outline color="success" icon="check_circle" :value="true">
        Thực hiện thành công!
      </v-alert>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import $ from 'jquery'
import '../store/jquery_comment'
import Comment from './Comment.vue'
import ThongTinCoBanHoSo from './form_xu_ly/ThongTinCoBanHoSo.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import TraKetQua from './form_xu_ly/TraKetQua.vue'
import ThuPhi from './form_xu_ly/FeeDetail.vue'
import KyDuyet from './form_xu_ly/KyPheDuyetTaiLieu.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
import TaoTaiLieuKetQua from './form_xu_ly/TaoTaiLieuKetQua.vue'
import FormBoSungThongTinNgan from './form_xu_ly/FormBoSungThongTinNgan.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
export default {
  props: ['index'],
  components: {
    'thong-tin-co-ban-ho-so': ThongTinCoBanHoSo,
    'phan-cong': PhanCong,
    'tra-ket-qua': TraKetQua,
    'thu-phi': ThuPhi,
    'ky-duyet': KyDuyet,
    'y-kien-can-bo': YkienCanBoThucHien,
    'tai-lieu-ket-qua': TaoTaiLieuKetQua,
    'form-bo-sung-thong-tin': FormBoSungThongTinNgan,
    'thanh-phan-ho-so': ThanhPhanHoSo
  },
  data: () => ({
    headersTable: [
      {
        text: '#',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Địa chỉ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thời gian',
        align: 'center',
        sortable: false
      }
    ],
    thongTinChiTietHoSo: {
    },
    nextActions: [],
    payments: '',
    dossierActions: [],
    itemselect: '',
    actionNote: '',
    actionsSubmitLoading: false,
    showThongTinCoBanHoSo: false,
    showYkienCanBoThucHien: false,
    showFormBoSungThongTinNgan: false,
    showPhanCongNguoiThucHien: false,
    showTaoTaiLieuKetQua: false,
    showKyPheDuyetTaiLieu: false,
    showTraKetQua: false,
    showThuPhi: false,
    checkInput: 0,
    viaPortalDetail: 0,
    showThucHienThanhToanDienTu: false,
    dossierItemDialogPick: '',
    itemDialogPick: '',
    resultDialogPick: '',
    indexDialogPick: '',
    userNote: 0,
    partView: '',
    stateView: false,
    payment_type: 0,
    type_assign: 0,
    returnFiles: [],
    assign_items: [],
    btnStateVisible: true,
    dialogActionProcess: false,
    rollbackable: false,
    dialogPDF: false,
    dialogPDFLoading: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    dossierSelected () {
      return this.$store.getters.dossierSelected
    },
    actionActive () {
      return this.$store.getters.actionActive
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.btnIndex = -1
      let currentQuery = vm.$router.history.current.query
      vm.getNextActions()
      // if (currentQuery.hasOwnProperty('activeTab')) {
      //   vm.activeTab = currentQuery.activeTab
      //   vm.btnIndex = currentQuery['btnIndex']
      //   vm.thongTinChiTietHoSo['dossierId'] = vm.id
      //   vm.btnStateVisible = true
      //   vm.getNextActions()
      // }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {})
  },
  watch: {},
  methods: {
    initData (data) {
      var vm = this
    },
    goBack () {
      window.history.back()
    },
    processPullBtnDetailRouter (dossierItem, item, result, index) {
      console.log('result Nextaction', result)
      let vm = this
      let isPopup = false
      vm.dossierId = dossierItem.dossierId
      vm.showYkienCanBoThucHien = false
      vm.showFormBoSungThongTinNgan = false
      vm.showPhanCongNguoiThucHien = false
      vm.showTaoTaiLieuKetQua = false
      vm.showKyPheDuyetTaiLieu = false
      vm.showTraKetQua = false
      vm.showThuPhi = false
      vm.showThucHienThanhToanDienTu = false
      vm.dossierItemDialogPick = dossierItem
      vm.itemDialogPick = item
      vm.resultDialogPick = result
      vm.indexDialogPick = index
      vm.userNote = 0
      if (result !== null && result !== undefined && result !== 'undefined' &&
        (result.hasOwnProperty('userNote') || result.hasOwnProperty('extraForm') || result.hasOwnProperty('allowAssignUser') ||
        result.hasOwnProperty('createFiles') || result.hasOwnProperty('eSignature') || result.hasOwnProperty('returnFiles') ||
        result.hasOwnProperty('payment') || result.hasOwnProperty('checkInput'))) {
        if (result.hasOwnProperty('userNote') && (result.userNote === 1 || result.userNote === '1' || result.userNote === 2 || result.userNote === '2')) {
          isPopup = true
          vm.showYkienCanBoThucHien = true
          vm.userNote = result.userNote
        }
        if (result.hasOwnProperty('extraForm') && result.extraForm) {
          isPopup = true
          vm.showFormBoSungThongTinNgan = true
        }
        if (result.hasOwnProperty('allowAssignUser') && result.allowAssignUser !== 0) {
          console.log('allowAssignUser', result.toUsers)
          if (Array.isArray(result.toUsers)) {
            vm.assign_items = result.toUsers
          } else {
            vm.assign_items = [result.toUsers]
          }
          vm.type_assign = result.allowAssignUser
          isPopup = true
          vm.showPhanCongNguoiThucHien = true
        }
        if (result.hasOwnProperty('createFiles') && result.createFiles !== null && result.createFiles !== undefined && result.createFiles !== 'undefined' && result.createFiles.length > 0) {
          isPopup = true
          vm.showTaoTaiLieuKetQua = true
          vm.createFiles = result.createFiles
        }
        if (result.hasOwnProperty('eSignature') && result.eSignature) {
          isPopup = true
          vm.showKyPheDuyetTaiLieu = true
        }
        if (result.hasOwnProperty('returnFiles') && result.returnFiles !== null && result.returnFiles !== undefined && result.returnFiles !== 'undefined' && result.returnFiles.length > 0) {
          isPopup = true
          vm.showTraKetQua = true
          vm.returnFiles = result.returnFiles
        }
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment === 5) {
          isPopup = true
          vm.showThuPhi = true
          vm.payments = result.payment
          vm.viaPortalDetail = dossierItem.viaPostal
        }
        if (result.hasOwnProperty('checkInput') && result.checkInput !== null && result.checkInput !== undefined && result.checkInput !== 'undefined') {
          vm.checkInput = result.checkInput
          if (result.checkInput === 2) {
            isPopup = true
            vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
          }
        }
      }
      if (isPopup) {
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
      } else {
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, true)
      }
    },
    processPullBtnDetail (item, index) {
      let vm = this
      vm.btnIndex = index
      vm.itemAction = item
      vm.actionIdCurrent = item.processActionId
      let filter = {
        dossierId: vm.dossierSelected[0].dossierId,
        actionId: item.processActionId
      }
      vm.dialogActionProcess = false
      vm.loadingActionProcess = true
      vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
        vm.processPullBtnDetailRouter(vm.dossierSelected[0], item, result, index)
      })
    },
    doCopy (dossierItem, item, index, isGroup) {
      let vm = this
      let filter = {
        dossierId: dossierItem.dossierId
      }
      vm.loadingAction = true
      vm.$store.dispatch('doCopy', filter).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      })
    },
    doCancel (dossierItem, item, index, isGroup) {
      let vm = this
      vm.loadingAction = true
      if (isGroup) {
        console.log(vm.selected)
      } else {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        vm.$store.dispatch('doCancel', filter).then(function (result) {
          vm.loadingAction = false
          vm.indexAction = -1
          router.push({
            path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
            query: vm.$router.history.current.query
          })
        })
      }
    },
    processAction () {
      var vm = this
      var initData = vm.$store.getters.loadingInitData
      var actionUser = initData.user.userName ? initData.user.userName : ''
      for (let key in vm.dossierSelected) {
        var filter = {
          dossierId: vm.dossierSelected[key].dossierId,
          actionCode: vm.actionActive.action,
          actionUser: actionUser
        }
        if (vm.showPhanCongNguoiThucHien) {
          filter['toUsers'] = vm.assign_items
        }
        var paymentsOut = null
        if (vm.payments) {
          paymentsOut = {
            requestPayment: vm.payments['requestPayment'],
            advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
            feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
            serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
            shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
          }
        }
        if (vm.showThuPhi) {
          filter['payment'] = paymentsOut
        }
        if (vm.showFormBoSungThongTinNgan) {
          filter['payload'] = vm.$refs.formBoSungThongTinNgan.formSubmitData()
        }
        if (vm.showKyPheDuyetTaiLieu) {
          let result = vm.$refs.kypheduyettailieu.doExport()
          console.log('resultKSKS', result)
        }
        if (vm.showYkienCanBoThucHien) {
          let result = vm.$refs.ykiencanbo.doExport()
          let note = ''
          if (result.valid) {
            vm.validateAction = true
            note = result.text
          } else {
            vm.validateAction = false
          }
          filter['userNote'] = note
        }
        let currentQuery = vm.$router.history.current.query
        vm.loadingActionProcess = true
        if (vm.validateAction) {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.btnStateVisible = false
          })
        }
      }
    },
    doPrint02 (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          document: item.document,
          'serviceCode': vm.thuTucHanhChinhSelected.serviceCode,
          'govAgencyCode': vm.thuTucHanhChinhSelected.govAgencyCode,
          dossiers: JSON.stringify(vm.selected)
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doPrint02', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      }
    },
    doPrint03 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doGuiding (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelected.serviceConfigId
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      }
    },
    getNextActions () {
      let vm = this
      let query = vm.$router.history.current.query
      let filter = {
        dossierId: vm.dossierSelected[0].dossierId
      }
      let currentQuery = vm.$router.history.current.query
      vm.$store.dispatch('pullNextactions', filter).then(function (result) {
        console.log('pullNextactions', result)
        console.log('actionActive.action', vm.actionActive.action)
        let actionActive = result.filter(function (item) {
          return item.actionCode.toString() === vm.actionActive.action.toString()
        })
        console.log('actionActive', actionActive[0])
        vm.dialogActionProcess = true
        vm.processPullBtnDetail(actionActive[0], currentQuery.btnIndex)
      })
    },
    postNextActions (stepModel) {
      var vm = this
      stepModel['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      if (stepModel.allowAssignUser > 0) {
        vm.$store.dispatch('reassignDossier', stepModel).then(resReassign => {
          console.log(resReassign)
          let params = {
            dossierId: vm.dossierId,
            actionCode: stepModel.actionCode,
            actionNote: vm.actionNote,
            actionUser: '',
            payload: '',
            security: '',
            assignUsers: '',
            payment: '',
            createDossiers: ''
          }
          vm.$store.dispatch('postAction', params).then(resPostAction => {
            console.log(resPostAction)
          })
        })
      } else {
        let params = {
          dossierId: vm.dossierId,
          actionCode: stepModel.actionCode,
          actionNote: vm.actionNote,
          actionUser: '',
          payload: '',
          security: '',
          assignUsers: '',
          payment: '',
          createDossiers: ''
        }
        vm.$store.dispatch('postAction', params).then(resPostAction => {
          console.log(resPostAction)
        })
      }
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    getMaxDueDate (arr) {
      let maxDue = Math.max.apply(Math, arr.map(function (item) {
        return item.actionOverdue
      }))
      return maxDue
    }
  }
}
</script>
