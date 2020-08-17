<template>
  <div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else-if="dossierSelected.length > 0" class="row-header">
      <div class="background-triangle-big"> <span>{{actionActive['tiltle'] ? actionActive['tiltle'] : 'XỬ LÝ HỒ SƠ'}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="dossierSelected[0].serviceName">
          {{dossierSelected[0].serviceName}}
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            <v-icon size="16">reply</v-icon> &nbsp;
            Quay lại
          </v-btn>
        </div>
      </div>
    </div>
    <v-expansion-panel :value="[true]" expand  class="expansion-pl" v-if="dossierSelected.length > 0">
      <v-expansion-panel-content>
        <!-- <div slot="header">
          <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
          HỒ SƠ XỬ LÝ &nbsp;&nbsp;&nbsp;&nbsp; 
        </div> -->
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
                  <!-- <td class="text-xs-left">
                    <div>
                      <span> Tiếp nhận: {{props.item.receiveDate}}<br>
                        Hẹn trả: {{props.item.receiveDate}}<br>
                        <span>{{props.item.dossierOverdue}}</span>
                      </span>
                    </div>
                  </td> -->
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
      <v-layout wrap v-if="btnStateVisible">
        <form-bo-sung-thong-tin v-if="showFormBoSungThongTinNgan" ref="formBoSungThongTinNgan" :dossier_id="Number(id)" :action_id="Number(actionIdCurrent)"></form-bo-sung-thong-tin>
        <phan-cong v-if="showPhanCongNguoiThucHien" ref="phancong" v-model="assign_items" :type="type_assign" ></phan-cong>
        <tai-lieu-ket-qua v-if="showTaoTaiLieuKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="createFiles"></tai-lieu-ket-qua>
        <ngay-gia-han v-if="showExtendDateEdit" ref="ngaygiahan" :type="typeExtendDate" :extendDateEdit="extendDateEdit"></ngay-gia-han>
        <ngay-hen-tra v-if="showEditDate" ref="ngayhentra" :dueDateEdit="dueDateEdit"></ngay-hen-tra>
        <tra-ket-qua v-if="showTraKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="returnFiles"></tra-ket-qua>
        <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail" :detailDossier="thongTinChiTietHoSo"></thu-phi>
        <thong-tin-buu-chinh v-if="showPostalService" :postalService="thongTinChiTietHoSo"></thong-tin-buu-chinh>
        <y-kien-can-bo v-if="showYkienCanBoThucHien" ref="ykiencanbo" :user_note="userNote"></y-kien-can-bo>
        <div class="my-2 mx-3">
          <v-btn color="primary" @click.native="processAction()"
          :loading="loadingActionProcess"
          :disabled="loadingActionProcess"
          >
            <v-icon>save</v-icon>&nbsp;
            Xác nhận
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="primary" @click="goBack()">
            <v-icon size="16">reply</v-icon> &nbsp;
            Quay lại
          </v-btn>
        </div>
      </v-layout>
      <v-alert v-if="!btnStateVisible" outline color="success" icon="check_circle" :value="true">
        Thực hiện thành công!
      </v-alert>
    </div>
    <v-dialog v-model="dialog_statusAction" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Trạng thái xử lý</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="closeDialogStatusAction">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="max-height: 350px">
          <div v-for="(item, index) in dossierSelected" v-bind:key="item.dossierId">
            <v-layout wrap class="py-1 align-center row-list-style" style="border-bottom: 1px solid #ddd;position:relative"> 
              <v-flex xs11>
                <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                <div class="ml-4"><span class="text-bold">{{item.dossierNo}}</span> - {{item.applicantName}}</div>
              </v-flex>
              <v-flex xs1 class="text-right">
                <v-tooltip top v-if="item.statusAction">
                  <v-icon size="20" color="primary" slot="activator">
                    check
                  </v-icon>
                  <span>Thành công</span>
                </v-tooltip>
                <v-tooltip top v-else>
                  <v-icon size="20" color="red darken-3" slot="activator">
                    block
                  </v-icon>
                  <span>Thất bại</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="processAction()" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">refresh</v-icon>&nbsp;
            Thử lại
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="red" dark @click.native="closeDialogStatusAction"
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon>undo</v-icon>&nbsp;
            Thoát
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import ThongTinCoBanHoSo from './form_xu_ly/ThongTinCoBanHoSo.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import TraKetQua from './form_xu_ly/TraKetQua.vue'
import ThuPhi from './form_xu_ly/FeeDetail.vue'
import KyDuyet from './form_xu_ly/KyPheDuyetTaiLieu.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
import TaoTaiLieuKetQua from './form_xu_ly/TaoTaiLieuKetQua.vue'
import FormBoSungThongTinNgan from './form_xu_ly/FormBoSungThongTinNgan.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNew.vue'
import EditDate from './form_xu_ly/EditDate.vue'
import ExtendDateEdit from './form_xu_ly/ExtendDateEdit.vue'
import ThongTinBuuChinh from './form_xu_ly/ThongTinGuiBuuChinh.vue'
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
    'thanh-phan-ho-so': ThanhPhanHoSo,
    'ngay-hen-tra': EditDate,
    'ngay-gia-han': ExtendDateEdit,
    'thong-tin-buu-chinh': ThongTinBuuChinh
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
      }
      // {
      //   text: 'Thời gian',
      //   align: 'center',
      //   sortable: false
      // }
    ],
    mutilpleAction: false,
    actionExits: [],
    dossierProcess: [],
    countProcessed: 0,
    activeNotify: false,
    dialog_statusAction: false,
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
    showEditDate: false,
    showExtendDateEdit: false,
    showPostalService: false,
    dueDateEdit: '',
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
    dialogPDFLoading: false,
    loadingActionProcess: false,
    loadingAction: false,
    arrDossierId: [],
    actionActiveTmp: [],
    gopThuPhi: true,
    changePaymentStatus: false,
    createFiles: []
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
      var vm = this
      return vm.$store.getters.dossierSelected
    },
    actionActive () {
      console.log('actionActive-------', this.$store.getters.actionActive)
      return this.$store.getters.actionActive
    },
    activeGetCounter () {
      return this.$store.getters.activeGetCounter
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.btnIndex = -1
      let currentQuery = vm.$router.history.current.query
      console.log('currentQuery', currentQuery)
      if (vm.dossierSelected.length === 0) {
        let arrDossier = []
        if (currentQuery.hasOwnProperty('dossiers')) {
          let arrDossierIdTemp = currentQuery.dossiers.split(',')
          vm.arrDossierId = arrDossierIdTemp
          arrDossierIdTemp.forEach(dossierId => {
            arrDossier.push(vm.$store.dispatch('getDetailDossier', dossierId))
          })
          Promise.all(arrDossier).then(results => {
            vm.thongTinChiTietHoSo = results[0]
            vm.$store.dispatch('loadDossierSelected', results)
          }).catch(reject => {
          })
        }
      } else {
        let arrDossier = []
        if (currentQuery.hasOwnProperty('dossiers')) {
          let arrDossierIdTemp = currentQuery.dossiers.split(',')
          vm.arrDossierId = arrDossierIdTemp
          arrDossierIdTemp.forEach(dossierId => {
            arrDossier.push(vm.$store.dispatch('getDetailDossier', dossierId))
          })
          Promise.all(arrDossier).then(results => {
            vm.thongTinChiTietHoSo = results[0]
            vm.$store.dispatch('loadDossierSelected', results)
          }).catch(reject => {
          })
        }
      }
      try {
        if (vm.actionActive.action === undefined || vm.actionActive.action === null || vm.actionActive.action === '') {
          let actionActive = JSON.parse(currentQuery.actionActive)
          if (actionActive) {
            vm.$store.dispatch('loadActionActive', actionActive)
          }
        }
      } catch (e) {
        console.log(e)
      }
      vm.getNextActions()
      // if (currentQuery.hasOwnProperty('activeTab')) {
      //   vm.activeTab = currentQuery.activeTab
      //   vm.btnIndex = currentQuery['btnIndex']
      //   vm.thongTinChiTietHoSo['dossierId'] = vm.id
      //   vm.btnStateVisible = true
      //   vm.getNextActions()
      // }
      try{
        if(typeof gopThuPhi !== 'undefined'){
          vm.gopThuPhi = gopThuPhi
        }
      } catch {

      }
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
      vm.showEditDate = false
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
        if (result.hasOwnProperty('createFiles') && result.createFiles && result.createFiles !== null && result.createFiles !== undefined && result.createFiles !== 'undefined' && (result.createFiles.length > 0 || [result.createFiles].length > 0)) {
          isPopup = true
          vm.showTaoTaiLieuKetQua = true
          vm.createFiles = Array.isArray(result.createFiles) ? result.createFiles : [result.createFiles]
          console.log('showTaoTaiLieuKetQua5555', vm.createFiles)
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
        // Add thu phí
        if (vm.gopThuPhi && result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0) {
          if ((result.payment.requestPayment === 3 || result.payment.requestPayment === '3')) {
            isPopup = true
            vm.showThanhToanDienTu = true
            let filter = {
              dossierId: vm.dossierId,
              referenceUid: dossierItem.referenceUid
            }
            vm.$store.dispatch('loadDossierPayments', filter).then(result => {
              vm.paymentProfile = result
            }).catch(reject => {
            })
          } else {
            isPopup = true
            vm.showThuPhi = true
            vm.payments = result.payment
            vm.viaPortalDetail = dossierItem.viaPostal
          }
        } else if (!vm.gopThuPhi && result.hasOwnProperty('payment') && result.payment !== null && 
          result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0 && result.payment.requestPayment !== 3
        ) {
          vm.payments = result.payment
          vm.changePaymentStatus = true
        }
        // add Thu phí
        if (result.hasOwnProperty('checkInput') && result.checkInput !== null && result.checkInput !== undefined && result.checkInput !== 'undefined') {
          vm.checkInput = result.checkInput
          if (result.checkInput === 2) {
            isPopup = true
            vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
          }
        }
        if ((result.hasOwnProperty('receiving') && result.receiving !== null && result.receiving !== undefined && result.receiving !== 'undefined' && result.receiving.editable === true)) {
          isPopup = true
          vm.showEditDate = true
          vm.dueDateEdit = result.receiving.dueDate !== '' ? new Date(result.receiving.dueDate) : ''
          vm.receiveDateEdit = result.receiving.receiveDate
        }
      }
      if (isPopup) {
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
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
        vm.$router.push({
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
          vm.$router.push({
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
      vm.dossierProcess = vm.dossierSelected.filter(function (item) {
        return (item['statusAction'] === false || !item['statusAction'])
      })
      vm.countProcessed = 0
      if (vm.mutilpleAction) {
        for (let key in vm.actionExits) {
          for (let key2 in vm.dossierSelected) {
            if (vm.dossierSelected[key2]['statusAction'] === false || !vm.dossierSelected[key2]['statusAction']) {
              let filter = {
                dossierId: vm.dossierSelected[key2].dossierId,
                actionCode: vm.actionExits[key].actionCode,
                actionUser: actionUser
              }
              vm.postAction(filter, vm.dossierSelected[key2], key2)
            }
          }
        }
      } else {
        for (let key in vm.dossierSelected) {
          if (vm.dossierSelected[key]['statusAction'] === false || !vm.dossierSelected[key]['statusAction']) {
            let filter = {
              dossierId: vm.dossierSelected[key].dossierId,
              actionCode: vm.actionActive.action,
              actionUser: actionUser
            }
            vm.postAction(filter, vm.dossierSelected[key], key)
          }
        }
      }
    },
    postAction (filter, dossier, index) {
      var vm = this
      var validPhanCong = true
      var validYKien = true
      if (vm.showPhanCongNguoiThucHien) {
        filter['toUsers'] = vm.assign_items
        let result = vm.$refs.phancong.doExport()
        console.log('validPhanCong', result)
        if (result) {
          validPhanCong = true
        } else {
          validPhanCong = false
        }
      }
      var paymentsOut = null
      if (vm.payments) {
        if (vm.showThuPhi) {
          paymentsOut = {
            requestPayment: vm.payments['requestPayment'],
            advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
            feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
            serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
            shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
          }
        } else if (!vm.showThuPhi && vm.changePaymentStatus) {
          paymentsOut = {
            requestPayment: vm.payments['requestPayment']
          }
        }
        
      }
      if (vm.showThuPhi || vm.changePaymentStatus) {
        filter['payment'] = paymentsOut
      }
      if (vm.showFormBoSungThongTinNgan) {
        filter['payload'] = vm.$refs.formBoSungThongTinNgan.formSubmitData()
      }
      if (vm.showKyPheDuyetTaiLieu) {
        let result = vm.$refs.kypheduyettailieu.doExport()
      }
      if (vm.showEditDate) {
        let date = vm.$refs.ngayhentra.getDateInput()
        console.log('dueDateEdit', date)
        let payload = {
          'dueDate': date,
          'receiveDate': vm.receiveDateEdit
        }
        filter['payload'] = payload
      }
      if (vm.showYkienCanBoThucHien) {
        let result = vm.$refs.ykiencanbo.doExport()
        let note = ''
        if (result.valid) {
          validYKien = true
          note = result.text
        } else {
          validYKien = false
        }
        filter['userNote'] = note
      }
      if (validPhanCong && validYKien) {
        vm.validateAction = true
      } else {
        vm.validateAction = false
      }
      let currentQuery = vm.$router.history.current.query
      if (vm.showYkienCanBoThucHien) {
        if (vm.validateAction) {
          vm.loadingActionProcess = true
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.countProcessed += 1
            vm.dossierSelected[index]['statusAction'] = true
            // console.log('countProcessed', vm.countProcessed)
            // console.log('length', vm.dossierProcess.length)
            if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length && vm.activeNotify) {
              vm.dialog_statusAction = true
            } else if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length) {
              vm.loadingActionProcess = false
              vm.loadingAction = false
              vm.btnStateVisible = false
              setTimeout(function () {
                vm.goBack()
              }, 500)
            }
            // vm.$store.dispatch('getActiveGetCounter', !vm.activeGetCounter)
          }).catch(function (reject) {
            vm.countProcessed += 1
            vm.activeNotify = true
            vm.dossierSelected[index]['statusAction'] = false
            // console.log('countProcessed', vm.countProcessed)
            // console.log('length', vm.dossierProcess.length)
            if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length && vm.activeNotify) {
              vm.dialog_statusAction = true
            } else if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length) {
              vm.loadingActionProcess = false
              vm.loadingAction = false
              vm.btnStateVisible = false
              setTimeout(function () {
                vm.goBack()
              }, 500)
            }
            // vm.$store.dispatch('getActiveGetCounter', !vm.activeGetCounter)
          })
        }
      } else {
        if (vm.validateAction) {
          vm.loadingActionProcess = true
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.countProcessed += 1
            vm.dossierSelected[index]['statusAction'] = true
            if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length && vm.activeNotify) {
              vm.dialog_statusAction = true
            } else if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length) {
              vm.loadingActionProcess = false
              vm.loadingAction = false
              vm.btnStateVisible = false
              setTimeout(function () {
                vm.goBack()
              }, 500)
            }
            // vm.$store.dispatch('getActiveGetCounter', !vm.activeGetCounter)
          }).catch(function (reject) {
            vm.countProcessed += 1
            vm.activeNotify = true
            vm.dossierSelected[index]['statusAction'] = false
            if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length && vm.activeNotify) {
              vm.dialog_statusAction = true
            } else if (vm.countProcessed === vm.dossierProcess.length * vm.actionExits.length) {
              vm.loadingActionProcess = false
              vm.loadingAction = false
              vm.btnStateVisible = false
              setTimeout(function () {
                vm.goBack()
              }, 500)
            }
            // vm.$store.dispatch('getActiveGetCounter', !vm.activeGetCounter)
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
      console.log('run next action')
      let query = vm.$router.history.current.query
      let filter = {}
      if (vm.dossierSelected.length > 0) {
        filter['dossierId'] = vm.dossierSelected[0].dossierId
      } else {
        filter['dossierId'] = vm.arrDossierId[0]
      }
      let currentQuery = vm.$router.history.current.query
      vm.$store.dispatch('pullNextactions', filter).then(function (result) {
        // console.log('pullNextactions', result)
        // console.log('actionActive.action', vm.actionActive.action.split(','))
        result = result.filter(function (item) {
          return item.enable === 1
        })
        var actionActiveArr = []
        if (vm.actionActive.action !== undefined && vm.actionActive.action !== null && vm.actionActive.action !== 'undefined' && vm.actionActive.action !== '') {
          actionActiveArr = vm.actionActive.action.split(',')
        }
        if (actionActiveArr.length === 1) {
          vm.actionExits = actionActiveArr
          let actionActive = result.filter(function (item) {
            return item.actionCode.toString() === vm.actionActive.action.toString()
          })
          vm.dialogActionProcess = true
          vm.mutilpleAction = false
          vm.processPullBtnDetail(actionActive[0], currentQuery.btnIndex)
        } else {
          vm.mutilpleAction = true
          vm.actionExits = []
          for (let key in actionActiveArr) {
            var active = false
            var actionItem
            for (let key2 in result) {
              if (actionActiveArr[key].toString() === result[key2].actionCode.toString()) {
                active = true
                actionItem = result[key2]
                break
              }
            }
            if (active) {
              vm.actionExits.push(actionItem)
            }
          }
          vm.dialogActionProcess = true
          console.log('actionExits', vm.actionExits[0])
          if (vm.actionExits[0]) {
            vm.processPullBtnDetail(vm.actionExits[0], currentQuery.btnIndex)
          }
        }
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
    },
    closeDialogStatusAction () {
      let vm = this
      vm.dialog_statusAction = false
      vm.btnStateVisible = false
      setTimeout(function () {
        vm.goBack()
      }, 500)
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
