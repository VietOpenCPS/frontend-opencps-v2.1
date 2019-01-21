<template>
  <div class="form-chitiet">
    1231
  </div>
</template>

<script>

import $ from 'jquery'
import toastr from 'toastr'
// import '../store/jquery-comments'
import Comment from './Comment.vue'
import ThongTinCoBanHoSo from './form_xu_ly/ThongTinCoBanHoSo.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import TraKetQua from './form_xu_ly/TraKetQua.vue'
import ThuPhi from './form_xu_ly/FeeDetail.vue'
import ChiTietThanhToan from './ChiTietThanhToan.vue'
import ThucHienThanhToanDienTu from './form_xu_ly/ThucHienThanhToanDienTu.vue'
import KyDuyet from './form_xu_ly/KyPheDuyetTaiLieu.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
import TaoTaiLieuKetQua from './form_xu_ly/TaoTaiLieuKetQua.vue'
import FormBoSungThongTinNgan from './form_xu_ly/FormBoSungThongTinNgan.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
import EditDate from './form_xu_ly/EditDate.vue'
import ExtendDateEdit from './form_xu_ly/ExtendDateEdit.vue'
import HoSoLienThong from './HoSoLienThong.vue'
import PhanCongLai from './form_xu_ly/PhanCongLai.vue'
import ThongTinBuuChinh from './form_xu_ly/ThongTinGuiBuuChinh.vue'
import mermaid from 'mermaid'
mermaid.initialize({
  theme: 'forest',
  startOnLoad: false
})
export default {
  props: ['index', 'id'],
  components: {
    'comment': Comment,
    'thong-tin-co-ban-ho-so': ThongTinCoBanHoSo,
    'phan-cong': PhanCong,
    'tra-ket-qua': TraKetQua,
    'thu-phi': ThuPhi,
    'thanh-toan-dien-tu': ThucHienThanhToanDienTu,
    'ky-duyet': KyDuyet,
    'y-kien-can-bo': YkienCanBoThucHien,
    'tai-lieu-ket-qua': TaoTaiLieuKetQua,
    'form-bo-sung-thong-tin': FormBoSungThongTinNgan,
    'thanh-phan-ho-so': ThanhPhanHoSo,
    'ngay-hen-tra': EditDate,
    'thong-tin-buu-chinh': ThongTinBuuChinh,
    'ngay-gia-han': ExtendDateEdit,
    'chi-tiet-thanh-toan': ChiTietThanhToan,
    'ho-so-lien-thong': HoSoLienThong,
    'phan-cong-lai': PhanCongLai
  },
  data: () => ({
    inputTypes: [1, 3],
    outputTypes: [2],
    actionIdCurrent: 0,
    validateAction: true,
    btnIndex: -1,
    processActionCurrent: 0,
    activeTab: 'tabs-1',
    activeTab2: '',
    btnDossierDynamics: [],
    btnStepsDynamics: [],
    loadingAction: false,
    indexAction: -1,
    indexActionStep: -1,
    dossierId: '',
    className: 'org.opencps.dossiermgt.model.Dossier',
    dossierFilesItems: [],
    dossierTemplatesItems: [],
    fileViews: [],
    showContactDetail: false,
    listHistoryProcessing: [],
    dossierTemplatesTN: [],
    dossierTemplatesKQ: [],
    thongTinChiTietHoSo: {
    },
    dialogPDF: false,
    dialogPDFLoading: true,
    loadingAlpacajsForm: false,
    nextActions: [],
    createFiles: [],
    returnFiles: [],
    processSteps: [],
    documents: [],
    payments: '',
    dossierActions: [],
    reAsignUsers: [],
    itemselect: '',
    dossierSyncs: [],
    stepModel: null,
    actionNote: '',
    actionsSubmitLoading: false,
    showThongTinCoBanHoSo: false,
    showYkienCanBoThucHien: false,
    showFormBoSungThongTinNgan: false,
    showPhanCongNguoiThucHien: false,
    showTaoTaiLieuKetQua: false,
    showKyPheDuyetTaiLieu: false,
    dataEsign: '',
    typeEsign: '',
    showTraKetQua: false,
    showThuPhi: false,
    showPostalService: false,
    showThanhToanDienTu: false,
    showEditDate: false,
    showExtendDateEdit: false,
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
    paymentDetail: '',
    paymentProfile: '',
    payment_type: 0,
    type_assign: 0,
    assign_items: [],
    btnStateVisible: true,
    extendDateEdit: '',
    typeExtendDate: '',
    dueDateEdit: '',
    receiveDateEdit: '',
    dialogActionProcess: false,
    rollbackable: false,
    configNote: null,
    actionSpecial: false,
    btnPlugins: [],
    loadingPlugin: false,
    listDossierFiles: [],
    headers: [{
      text: '#',
      align: 'center',
      sortable: false
    },
    {
      text: 'Vai trò',
      align: 'center',
      sortable: false,
      class: 'vaitro_column'
    }, {
      text: 'Công việc',
      align: 'center',
      sortable: false,
      class: 'congviec_column'
    }, {
      text: 'Thời hạn quy định',
      align: 'center',
      sortable: false,
      class: 'thoihanquydinh_column'
    }, {
      text: 'Ngày bắt đầu',
      align: 'center',
      sortable: false,
      class: 'ngaybatdau_column'
    }, {
      text: 'Người thực hiện',
      align: 'center',
      sortable: false,
      class: 'nguoithuchien_column'
    }, {
      text: 'Kết quả',
      align: 'center',
      sortable: false,
      class: 'ketqua_column'
    }],
    headerSyncs: [{
      text: 'Nhật kí hồ sơ',
      align: 'center',
      sortable: false,
      class: 'nhatki_column'
    }, {
      text: 'Trao đổi trực tuyến',
      align: 'center',
      sortable: false,
      class: 'traodoitructuyen_column'
    }],
    filterDossierActionItems: [{
      text: 'Tất cả',
      value: ''
    }, {
      text: 'Có thao tác thực hiện',
      value: '1'
    }, {
      text: 'Không thao tác thực hiện',
      value: '2'
    }],
    filterDossierAction: null,
    filterDossierSyncItems: [{
      text: 'Tất cả',
      value: '1,2'
    }, {
      text: 'Thông tin trao đổi',
      value: '2'
    }],
    filterDossierSync: null,
    messageChat: '',
    isCallBack: true,
    printDocument: false,
    alertObj: {
      icon: 'check_circle',
      color: 'success',
      message: 'Thực hiện thành công!'
    },
    stateViewResult: true,
    stateViewDocument: true,
    listLienThong: [],
    modelPlugin: null,
    dialogPlugin: false,
    dialog_reAsign: false,
    loadingMermaidgraph: false,
    typeTienTrinh: 1,
    votingItems: [],
    loadingVoting: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    dataCreateFile () {
      return this.$store.getters.getDataCreateFile
    },
    getCheckInput () {
      return this.$store.getters.getCheckInput
    },
    usersNextAction () {
      return this.$store.getters.getUsersNextAction
    },
    stepOverdueNextAction () {
      return this.$store.getters.getStepOverdueNextAction
    },
    currentUser () {
      console.log('AAAAAAA: ', this.$store.getters.loadingInitData.user)
      return this.$store.getters.loadingInitData.user
    },
    kysoSuccess () {
      return this.$store.getters.kysoSuccess
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.initData(vm.id)
      vm.btnIndex = -1
      let currentQuery = vm.$router.history.current.query
      if (currentQuery.hasOwnProperty('activeTab')) {
        vm.activeTab = currentQuery.activeTab
        vm.btnIndex = currentQuery['btnIndex']
        if (currentQuery.hasOwnProperty('actionSpecial') && currentQuery['actionSpecial'] !== null && currentQuery['actionSpecial'] !== undefined && currentQuery['actionSpecial'] !== 'undefined') {
          vm.actionSpecial = currentQuery['actionSpecial']
        }
        vm.thongTinChiTietHoSo['dossierId'] = vm.id
        vm.btnStateVisible = true
        // if (currentQuery['btnIndex'].toString() !== '111' && currentQuery['btnIndex'].toString() !== '333') {
        //   vm.getNextActions()
        // }
      }
      vm.$store.commit('setKysoSuccess', false)
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      // let currentParams = vm.$router.history.current.params
      // let currentQuery = vm.$router.history.current.query
      // if (currentParams.hasOwnProperty('activeTab') && vm.isCallBack) {
      //   vm.isCallBack = false
      //   vm.btnDossierDynamics = []
      //   vm.btnIndex = -1
      //   vm.activeTab = currentQuery.activeTab
      //   vm.btnIndex = currentQuery['btnIndex']
      //   if (currentQuery.hasOwnProperty('actionSpecial') && currentQuery['actionSpecial'] !== null && currentQuery['actionSpecial'] !== undefined && currentQuery['actionSpecial'] !== 'undefined') {
      //     vm.actionSpecial = currentQuery['actionSpecial']
      //   }
      //   vm.thongTinChiTietHoSo['dossierId'] = vm.id
      //   vm.btnStateVisible = true
      //   vm.getNextActions()
      // }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
    },
    kysoSuccess (val) {
      var vm = this
      if (val) {
        vm.loadingAction = false
        vm.dialogActionProcess = false
        vm.loadingActionProcess = false
        vm.alertObj = {
          icon: 'check_circle',
          color: 'success',
          message: 'Thực hiện thành công!'
        }
        vm.btnStateVisible = false
      }
    }
  },
  methods: {
    initData (data) {
      var vm = this
      vm.dossierId = data
      vm.activeTab2 = 'tabs-2b'
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.thongTinChiTietHoSo = resultDossier
        vm.loadThanhToan()
        vm.loadHoSoLienThong()
        vm.getNextActions()
        if (resultDossier['dossierSubStatus']) {
          vm.$store.dispatch('pullBtnConfigStep', resultDossier).then(result => {
            vm.btnStepsDynamics = result
          })
        }
        if (vm.originality === 1 && resultDossier['dossierStatus'] === 'done') {
          vm.activeTab2 = 'tabs-1b'
          vm.loadVoting()
        }
        vm.runComment()
        vm.$store.dispatch('loadDossierDocuments', resultDossier).then(resultDocuments => {
          if (Array.isArray(resultDocuments)) {
            vm.documents = resultDocuments
          } else {
            vm.documents.push(resultDocuments)
          }
        })
        vm.$store.dispatch('getListDossierFiles', data).then(result => {
          vm.listDossierFiles = result
          // console.log('listDossierFiles', vm.listDossierFiles)
        })
        if (vm.$refs.thanhphanhoso) {
          vm.$refs.thanhphanhoso.initData(resultDossier)
        }
        if (vm.$refs.thanhphanhoso1) {
          vm.$refs.thanhphanhoso1.initData(resultDossier)
        }
        if (vm.$refs.thanhphanhoso2) {
          vm.$refs.thanhphanhoso2.initData(resultDossier)
        }
      })
    },
    recountFileTemplates () {
      var vm = this
      vm.dossierTemplatesItems.forEach(itemTemplate => {
        itemTemplate.count = 0
        vm.dossierFilesItems.forEach(itemFile => {
          if (itemTemplate.partNo === itemFile.dossierPartNo) {
            itemTemplate.count ++
          }
        })
      })
    },
    runComment () {
      var vm = this
      if (vm.$refs.comment) {
        vm.$refs.comment.runComment()
      }
    },
    goBack () {
      window.history.back()
    },
    viewFile (data) {
      var vm = this
      vm.dossierFilesItems.forEach(val => {
        val['dossierId'] = vm.thongTinChiTietHoSo.dossierId
        if (val.dossierPartNo === data.partNo) {
          this.$store.dispatch('viewFile', val)
        }
      })
    },
    downloadFileLogs (data) {
      var vm = this
      let dataCommit = {
        fileAttachId: data,
        dossierId: vm.id
      }
      this.$store.dispatch('downloadFile', dataCommit)
    },
    loadDossierActions (data) {
      var vm = this
      if (vm.thongTinChiTietHoSo.dossierId) {
        let dataParams = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          stepType: data
        }
        vm.$store.dispatch('loadDossierActions', dataParams).then(resultActions => {
          if (resultActions.data) {
            let resultTemp = resultActions.data
            for (var i = 0; i < resultTemp.length; i++) {
              if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                if (!Array.isArray(resultTemp[i]['actions'])) {
                  let arrActionsTemp = []
                  arrActionsTemp.push(resultTemp[i]['actions'])
                  resultTemp[i]['actions'] = arrActionsTemp
                }
              }
            }
            vm.dossierActions = resultTemp
          }
        })
      }
    },
    loadMermaidgraph (data) {
      var vm = this
      document.getElementById('mermaid_dossier').innerHTML = ''
      if (vm.thongTinChiTietHoSo.dossierId) {
        let dataParams = {
          dossierId: vm.thongTinChiTietHoSo.dossierId
        }
        vm.loadingMermaidgraph = true
        vm.$store.dispatch('loadMermaidgraph', dataParams).then(chartData => {
          vm.loadingMermaidgraph = false
          mermaid.render('theGraph', chartData, function (svgCode) {
            document.getElementById('mermaid_dossier').innerHTML = svgCode
          })
        }).catch(function () {
          vm.loadingMermaidgraph = false
        })
      }
    },
    loadDossierSyncs (data) {
      var vm = this
      if (vm.thongTinChiTietHoSo.dossierId) {
        let dataParams = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          info: '1,2'
        }
        vm.$store.dispatch('loadDossierSyncs', dataParams).then(resultSyncs => {
          if (resultSyncs !== null && resultSyncs !== undefined && resultSyncs !== 'undefined') {
            if (Array.isArray(resultSyncs)) {
              vm.dossierSyncs = resultSyncs
            } else {
              vm.dossierSyncs = [resultSyncs]
            }
          } else {
            vm.dossierSyncs = []
          }
        })
      }
    },
    changeTypeTienTrinh (event) {
      let vm = this
      if (event === 2) {
        setTimeout(function () {
          vm.loadMermaidgraph()
        }, 200)
      }
    },
    loadDossierLogs (data) {
      var vm = this
      // data.dossierId = vm.thongTinChiTietHoSo.dossierId
      let dataParams = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let promiseHisProcessing = vm.$store.dispatch('getListHistoryProcessingItems', dataParams)
      promiseHisProcessing.then(function (result) {
        vm.listHistoryProcessing = []
        vm.listHistoryProcessing = result
      })
    },
    deleteDossierFileVersion (item) {
      var vm = this
      item['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('deleteAttackFiles', item).then(res => {
      })
    },
    pickFile (item) {
      document.getElementById('file' + item.partNo).click()
    },
    postChat () {
      var vm = this
      if (vm.messageChat) {
        let params = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionCode: vm.originality === 3 ? '8200' : '8100',
          actionNote: vm.messageChat,
          actionUser: ''
        }
        vm.$store.dispatch('postAction', params).then(result => {
          vm.loadDossierSyncs()
        })
        vm.messageChat = ''
      }
    },
    getNextAction (item) {
      var vm = this
      vm.actionIdCurrent = item.processActionId
      if (item.type === 1) {
        let filter = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionId: item.processActionId
        }
        vm.$store.dispatch('getNextAction', filter).then(resultAction => {
          vm.stepModel = resultAction
        }).catch(reject => {
          vm.stepModel = null
        })
      } else {
        let filter = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionId: item.processActionId
        }
        vm.$store.dispatch('loadPlugin', filter).then(resultPlugin => {
          vm.stepModel = resultPlugin
        }).catch(reject => {
          vm.stepModel = null
        })
      }
    },
    processPullBtnplugin (item, index) {
      var vm = this
      let param = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        processPluginId: item.processPluginId
      }
      vm.dialogPlugin = true
      vm.loadingPlugin = true
      vm.$store.dispatch('loadPlugin', param).then(result => {
        vm.modelPlugin = result
        vm.modelPlugin['pluginName'] = item.pluginName
        vm.loadingPlugin = false
      }).catch(xhr => {
        vm.modelPlugin = null
        vm.loadingPlugin = false
      })
    },
    processPullBtnDetailRouter (dossierItem, item, result, index) {
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
      vm.showPostalService = false
      vm.showThanhToanDienTu = false
      vm.showEditDate = false
      vm.showExtendDateEdit = false
      vm.showThucHienThanhToanDienTu = false
      vm.dossierItemDialogPick = dossierItem
      vm.itemDialogPick = item
      vm.resultDialogPick = result
      vm.indexDialogPick = index
      vm.userNote = 0
      if (result.hasOwnProperty('configNote') && result.configNote !== null && result.configNote !== undefined && result.configNote !== 'undefined') {
        try {
          vm.configNote = JSON.parse(result.configNote)
          if (vm.configNote.confirm) {
            isPopup = true
          }
        } catch (e) {
        }
      }
      if (result !== null && result !== undefined && result !== 'undefined' &&
        (result.hasOwnProperty('userNote') || result.hasOwnProperty('extraForm') || result.hasOwnProperty('allowAssignUser') ||
        result.hasOwnProperty('createFiles') || result.hasOwnProperty('eSignature') || result.hasOwnProperty('returnFiles') ||
        result.hasOwnProperty('payment') || result.hasOwnProperty('checkInput') || result.hasOwnProperty('overdue') || result.hasOwnProperty('betimes'))) {
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
          if (Array.isArray(result.toUsers)) {
            vm.assign_items = result.toUsers
          } else {
            vm.assign_items = [result.toUsers]
          }
          vm.type_assign = result.allowAssignUser
          isPopup = true
          vm.showPhanCongNguoiThucHien = true
        }
        if (result.hasOwnProperty('createFiles') && result.createFiles !== null && result.createFiles !== undefined && result.createFiles !== 'undefined') {
          isPopup = true
          if (Array.isArray(result.createFiles)) {
            vm.createFiles = result.createFiles
          } else {
            vm.createFiles = [result.createFiles]
          }
          vm.showTaoTaiLieuKetQua = true
        }
        if (result.hasOwnProperty('eSignature') && result.eSignature) {
          isPopup = true
          vm.showKyPheDuyetTaiLieu = true
          vm.dataEsign = result
          // vm.$store.commit('setDataCreateFile', result)
        }
        if (result.hasOwnProperty('returnFiles') && result.returnFiles !== null && result.returnFiles !== undefined && result.returnFiles !== 'undefined') {
          isPopup = true
          if (Array.isArray(result.returnFiles)) {
            vm.returnFiles = result.returnFiles
          } else {
            vm.returnFiles = [result.returnFiles]
          }
          vm.showTraKetQua = true
        }
        if (result.hasOwnProperty('preCondition') && result.preCondition !== null && result.preCondition !== undefined && result.preCondition !== 'undefined' && result.preCondition.indexOf('sendViaPostal=1') >= 0) {
          isPopup = true
          vm.showPostalService = true
        }
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0) {
          // add thanh toán điện tử
          if ((result.payment.requestPayment === 3 || result.payment.requestPayment === '3') && (dossierItem['stepCode'] === 610 || dossierItem['stepCode'] === 611)) {
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
          // isPopup = true
          // vm.showThuPhi = true
          // vm.payments = result.payment
          // vm.viaPortalDetail = dossierItem.viaPostal
        }
        if ((result.hasOwnProperty('receiving') && result.receiving !== null && result.receiving !== undefined && result.receiving !== 'undefined' && result.receiving.editable === true)) {
          isPopup = true
          vm.showEditDate = true
          vm.dueDateEdit = result.receiving.dueDate !== '' ? new Date(result.receiving.dueDate) : ''
          vm.receiveDateEdit = result.receiving.receiveDate
        }
        if (result.hasOwnProperty('overdue')) {
          isPopup = true
          vm.showExtendDateEdit = true
          vm.extendDateEdit = result.overdue
          vm.typeExtendDate = 'overdue'
        }
        if (result.hasOwnProperty('preoverdue')) {
          isPopup = true
          vm.showExtendDateEdit = true
          vm.extendDateEdit = result.preoverdue
          vm.typeExtendDate = 'preoverdue'
        }
        if (result.hasOwnProperty('betimes')) {
          isPopup = true
          vm.showExtendDateEdit = true
          vm.extendDateEdit = result.betimes
          vm.typeExtendDate = 'betimes'
        }
      }
      if (isPopup) {
        vm.loadingAction = false
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
      } else {
        vm.loadingAction = true
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, false)
      }
    },
    processPullBtnDetail (item, index) {
      let vm = this
      vm.btnIndex = index
      vm.itemAction = item
      vm.actionIdCurrent = item.processActionId
      vm.processActionCurrent = item.processActionId
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        actionId: item.processActionId
      }
      vm.dossierId = vm.thongTinChiTietHoSo.dossierId
      vm.loadingAction = true
      vm.dialogActionProcess = false
      vm.loadingActionProcess = true
      vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
        vm.loadingActionProcess = false
        vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, item, result, index)
      }).catch(function (reject) {
        vm.loadingAction = false
        vm.loadingActionProcess = false
      })
    },
    btnActionEvent (item, index) {
      let vm = this
      vm.itemAction = item
      vm.indexAction = index
      if (String(item.form) === 'UPDATE') {
        vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + vm.thongTinChiTietHoSo.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'ADD') {
        vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/bo-sung-ho-so/' + vm.thongTinChiTietHoSo.dossierId,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'COPY') {
        vm.doCopy(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'CANCEL') {
        vm.doCancel(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'PRINT_01') {
        // Xem trước phiếu của một hồ sơ
        vm.doPrint01(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'PRINT_02') {
        // Xem trước phiếu gộp của nhiều hồ sơ
        vm.doPrint02(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'PRINT_03') {
        // In văn bản mới nhất đã phê duyệt
        vm.doPrint03(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'GUIDE') {
        // vm.doGuiding(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'PREVIEW') {
        vm.doPreview(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'ACTIONS') {
        // vm.doActions(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'DELETE') {
        vm.doDeleteDossier(vm.thongTinChiTietHoSo, item, index)
      } else if (String(item.form) === 'ROLLBACK_01') {
        let result = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionCode: 9000
        }
        vm.doActionSpecial(result)
      } else if (String(item.form) === 'ROLLBACK_02') {
        let result = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionCode: 9000
        }
        vm.doActionSpecial(result)
      } else if (String(item.form) === 'OVERDUE') {
        vm.btnIndex = 8500
        let result = {
          actionCode: 8500,
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          overdue: vm.thongTinChiTietHoSo['extendDate'] ? vm.thongTinChiTietHoSo['extendDate'] : ''
        }
        // vm.doActionSpecial(result)
        vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
      } else if (String(item.form) === 'PREOVERDUE') {
        vm.btnIndex = 8501
        let result = {
          actionCode: 8501,
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          preoverdue: vm.thongTinChiTietHoSo['extendDate'] ? vm.thongTinChiTietHoSo['extendDate'] : ''
        }
        // vm.doActionSpecial(result)
        vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
      } else if (String(item.form) === 'BETIMES') {
        vm.btnIndex = 8400
        let result = {
          actionCode: 8400,
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          betimes: vm.thongTinChiTietHoSo['extendDate'] ? vm.thongTinChiTietHoSo['extendDate'] : ''
        }
        // vm.doActionSpecial(result)
        vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
      }
    },
    doPrint01 (dossierItem, item, index) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint01', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doPreview (dossierItem, item, index) {
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
    doCopy (dossierItem, item, index) {
      let vm = this
      let filter = {
        dossierId: dossierItem.dossierId
      }
      vm.loadingAction = true
      vm.$store.dispatch('doCopy', filter).then(function (result) {
        vm.loadingAction = false
        vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(function (reject) {
        vm.loadingAction = false
      })
    },
    doDeleteDossier (dossierItem, item, index) {
      let vm = this
      let x = confirm('Bạn có muốn thực hiện hành động này?')
      if (x) {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        let currentQuery = vm.$router.history.current.query
        vm.$store.dispatch('deleteDossier', filter).then(function (result) {
          vm.dialogActionProcess = false
          vm.loadingActionProcess = false
          vm.goBack()
        })
      } else {
        return false
      }
    },
    doCancel (dossierItem, item, index) {
      let vm = this
      vm.loadingAction = true
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
      }).catch(function (reject) {
        vm.loadingAction = false
      })
    },
    doCreateDossier () {
      let vm = this
      let data = {
        serviceCode: vm.serviceCode,
        govAgencyCode: vm.govAgencyCode,
        templateNo: vm.templateNo,
        originality: vm.getOriginality()
      }
      vm.loadingAction = true
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    rollBack () {
      var vm = this
      let params = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      vm.$store.dispatch('rollBack', params).then(resRollBack => {
        vm.getNextActions()
        vm.rollbackable = false
        vm.btnStateVisible = true
      }).catch(reject => {
        vm.alertObj = {
          icon: 'error',
          color: 'error',
          message: 'Rút lại hồ sơ không thành công!'
        }
        vm.btnStateVisible = false
      })
    },
    rollBackDossier (isSpecial) {
      var vm = this
      let result = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        actionCode: 9000
      }
      if (isSpecial) {
        vm.doActionSpecial(result)
      } else {
        vm.$store.dispatch('postAction', result).then(function (result) {
          vm.getNextActions()
          vm.rollbackable = false
          vm.btnStateVisible = true
        }).catch(function (reject) {
        })
      }
    },
    processAction (dossierItem, item, result, index, isConfirm) {
      let vm = this
      var validPhanCong = true
      var validYKien = true
      var validTreHan = true
      var validCreateFiles = true
      var validThanhToanDienTu = true
      var validKySo = true
      var validFormBoSung = true
      var useKySo = false
      var initData = vm.$store.getters.loadingInitData
      let actionUser = initData.user.userName ? initData.user.userName : ''
      let filter = {
        dossierId: dossierItem.dossierId,
        actionCode: result.actionCode,
        actionUser: actionUser
      }
      if (vm.showPhanCongNguoiThucHien) {
        filter['toUsers'] = vm.assign_items
        let result = vm.$refs.phancong.doExport()
        if (result) {
          validPhanCong = true
        } else {
          validPhanCong = false
        }
      }
      var paymentsOut = null
      if (vm.payments) {
        paymentsOut = {
          requestPayment: vm.payments['requestPayment'],
          paymentNote: vm.payments['paymentNote'],
          advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
          feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
          serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
          shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
        }
      }
      if (vm.showThuPhi) {
        filter['payment'] = paymentsOut
        let feeTotal = paymentsOut['feeAmount'] + paymentsOut['serviceAmount'] + paymentsOut['shipAmount'] - paymentsOut['advanceAmount']
        if (feeTotal === 0 && vm.originality === 3) {
          let x = confirm('Tổng phí còn phải nộp: 0 đồng. Bạn có muốn tiếp tục?')
          if (!x) {
            vm.loadingActionProcess = false
            return
          }
        }
      }
      if (vm.showThanhToanDienTu) {
        vm.$refs.epayment.validPayment()
        let valid = vm.$refs.epayment.validPayment()
        let paymentProfile = vm.$store.getters.getPaymentProfile
        if (paymentProfile && paymentProfile['paymentFile'] && valid) {
          validThanhToanDienTu = true
          filter['payment'] = {
            requestPayment: 3,
            advanceAmount: paymentProfile.advanceAmount ? paymentProfile.advanceAmount : 0,
            feeAmount: paymentProfile.feeAmount ? paymentProfile.feeAmount : 0,
            paymentAmount: paymentProfile.paymentAmount ? paymentProfile.paymentAmount : 0,
            paymentNote: paymentProfile.paymentNote ? paymentProfile.paymentNote : '',
            serviceAmount: paymentProfile.serviceAmount ? paymentProfile.serviceAmount : 0,
            shipAmount: paymentProfile.shipAmount ? paymentProfile.shipAmount : 0
          }
          let paymentsOut = filter['payment']
          let feeTotal = paymentsOut['feeAmount'] + paymentsOut['serviceAmount'] + paymentsOut['shipAmount'] - paymentsOut['advanceAmount']
          if (feeTotal === 0 && vm.originality === 3) {
            let x = confirm('Tổng phí còn phải nộp: 0 đồng. Bạn có muốn tiếp tục?')
            if (!x) {
              vm.loadingActionProcess = false
              return
            }
          }
        } else {
          validThanhToanDienTu = false
        }
      }
      if (vm.showEditDate) {
        let date = vm.$refs.ngayhentra.getDateInput()
        // console.log('dueDateEdit', date)
        // filter['dueDate'] = date ? date : ''
        // filter['receiveDate'] = vm.receiveDateEdit ? vm.receiveDateEdit : ''
        let payload = {
          'dueDate': date,
          'receiveDate': vm.receiveDateEdit
        }
        filter['payload'] = payload
      }
      if (vm.showExtendDateEdit) {
        let data = vm.$refs.ngaygiahan.doExport()
        if (data.valid) {
          validTreHan = true
        } else {
          validTreHan = false
        }
        let payload = {
          'extendDate': data.extendDate
        }
        if (vm.typeExtendDate === 'overdue') {
          payload = {
            'extendDate': data.extendDate,
            'delayNote': data.text,
            'lockState': ''
          }
        } else if (vm.typeExtendDate === 'preoverdue') {
          payload = {
            'extendDate': data.extendDate,
            'delayNote': data.text,
            'lockState': 'CONFIRM'
          }
        }
        filter['payload'] = payload
      }
      if (vm.showFormBoSungThongTinNgan) {
        filter['payload'] = vm.$refs.formBoSungThongTinNgan.formSubmitData()
        let validation = vm.$refs.formBoSungThongTinNgan.checkValid()
        if (validation) {
          validFormBoSung = true
        } else {
          validFormBoSung = false
        }
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
      // if (vm.showTaoTaiLieuKetQua) {
      //   validCreateFiles = vm.$refs.tailieuketqua.validCreateFileTemplate()
      // }
      if (vm.showKyPheDuyetTaiLieu) {
        let resultTmp = vm.$refs.kypheduyettailieu.doExport()
        if (resultTmp.required) {
          useKySo = true
        } else {
          useKySo = false
          if (vm.dataEsign.signatureType !== 'digital') {
            alert('Yêu cầu xác thực ký duyệt')
          }
        }
      }
      if (validPhanCong && validYKien && validTreHan && validThanhToanDienTu && validFormBoSung) {
        vm.validateAction = true
      } else {
        vm.validateAction = false
      }
      vm.dossierId = dossierItem.dossierId
      let currentQuery = vm.$router.history.current.query
      vm.loadingActionProcess = true
      if (isConfirm) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x && vm.validateAction) {
          vm.loadingActionProcess = true
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.loadingAction = false
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.alertObj = {
              icon: 'check_circle',
              color: 'success',
              message: 'Thực hiện thành công!'
            }
            vm.btnStateVisible = false
            if (result.hasOwnProperty('rollbackable') && result['rollbackable'] !== null && result['rollbackable'] !== undefined) {
              vm.rollbackable = result.rollbackable
            }
            if (result.hasOwnProperty('dossierDocumentId') && result['dossierDocumentId'] !== null && result['dossierDocumentId'] !== undefined && result['dossierDocumentId'] !== 0 && result['dossierDocumentId'] !== '0') {
              vm.printDocument = true
            }
            vm.$router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          }).catch(function (reject) {
            vm.loadingAction = false
            vm.loadingActionProcess = false
          })
        } else {
          return false
        }
      } else if (vm.validateAction) {
        if (vm.checkInput === 2 && vm.$refs.thanhphanhoso !== null && vm.$refs.thanhphanhoso !== undefined && vm.$refs.thanhphanhoso !== 'undefined') {
          var valid = vm.$refs.thanhphanhoso.validDossierTemplate()
          if (!valid) {
            vm.loadingAction = false
            vm.loadingActionProcess = false
            return
          }
        }
        vm.loadingActionProcess = true
        if (vm.showKyPheDuyetTaiLieu) {
          if (useKySo) {
            let filter = {
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              actionId: vm.processActionCurrent
            }
            vm.$store.dispatch('processPullBtnDetail', filter).then(function (resultAction) {
              vm.dataEsign = resultAction
              let resultCreateFile = vm.$refs.kypheduyettailieu.checkCreateFile(vm.dataEsign)
              if (resultCreateFile) {
                if (vm.dataEsign.createFiles) {
                  var fileArr
                  if (Array.isArray(vm.dataEsign.createFiles)) {
                    fileArr = vm.dataEsign.createFiles
                  } else {
                    fileArr = [vm.dataEsign.createFiles]
                  }
                  fileArr = fileArr.filter(item => {
                    return item.eForm === true
                  })
                  if (fileArr.length > 0) {
                    let lengthFiles = fileArr.length
                    let counterSave = 0
                    for (let i = 0; i < lengthFiles; i++) {
                      let fileDetail = fileArr[i]
                      // <---------
                      var fileFind = vm.listDossierFiles.find(itemFile => {
                        return itemFile.dossierPartNo === fileDetail.partNo
                      })
                      if (fileFind) {
                        fileFind['dossierId'] = vm.thongTinChiTietHoSo.dossierId
                        vm.$store.dispatch('putAlpacaForm', fileFind).then(resData => {
                          counterSave += 1
                          if (counterSave === lengthFiles) {
                            vm.loadingAction = false
                            vm.loadingActionProcess = false
                            vm.doAction()
                          }
                        }).catch(reject => {
                        })
                      } else {
                        fileDetail['dossierId'] = vm.thongTinChiTietHoSo.dossierId
                        vm.$store.dispatch('postEformEsignature', fileDetail).then(resPostEform => {
                          counterSave += 1
                          if (counterSave === lengthFiles) {
                            vm.loadingAction = false
                            vm.loadingActionProcess = false
                            vm.doAction()
                          }
                        }).catch(reject => {
                        })
                      }
                    }
                  }
                }
              } else {
                var paymentsOut = ''
                if (vm.showThuPhi) {
                  paymentsOut = {
                    requestPayment: vm.payments['requestPayment'],
                    paymentNote: vm.payments['paymentNote'],
                    advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                    feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                    serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                    shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
                  }
                  resultAction['payment'] = paymentsOut
                  let feeTotal = paymentsOut['feeAmount'] + paymentsOut['serviceAmount'] + paymentsOut['shipAmount'] - paymentsOut['advanceAmount']
                  if (feeTotal === 0 && vm.originality === 3) {
                    let x = confirm('Tổng phí còn phải nộp: 0 đồng. Bạn có muốn tiếp tục?')
                    if (!x) {
                      vm.loadingActionProcess = false
                      return
                    }
                  }
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
                  resultAction['userNote'] = note
                }
                vm.loadingAction = false
                vm.loadingActionProcess = false
                vm.$refs.kypheduyettailieu.kySo(resultAction)
              }
            }).catch(function (reject) {
              vm.loadingAction = false
              vm.loadingActionProcess = false
            })
          }
        } else {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            if (vm.checkInput === 2 || vm.checkInput === '2') {
              vm.$store.dispatch('updateApplicantNote', vm.thongTinChiTietHoSo).then(function (result) {
              })
            }
            vm.loadingAction = false
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.alertObj = {
              icon: 'check_circle',
              color: 'success',
              message: 'Thực hiện thành công!'
            }
            vm.btnStateVisible = false
            if (result.hasOwnProperty('rollbackable') && result['rollbackable'] !== null && result['rollbackable'] !== undefined) {
              vm.rollbackable = result.rollbackable
            }
            if (result.hasOwnProperty('dossierDocumentId') && result['dossierDocumentId'] !== null && result['dossierDocumentId'] !== undefined && result['dossierDocumentId'] !== 0 && result['dossierDocumentId'] !== '0') {
              vm.printDocument = true
            }
            if (vm.thongTinChiTietHoSo.dossierStatus === 'new' && vm.originality === 1) {
              vm.$router.push('/danh-sach-ho-so/' + vm.index + '/nop-thanh-cong/' + vm.thongTinChiTietHoSo.dossierId)
            }
            vm.checkInput = 0
            vm.$store.commit('setCheckInput', 0)
            if (String(item.form) === 'ACTIONS') {
            } else {
              vm.$router.push({
                path: vm.$router.history.current.path,
                query: {
                  recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                  q: currentQuery['q']
                }
              })
            }
            $('html, body').animate({
              scrollTop: 0
            }, 500, 'linear')
          }).catch(function (reject) {
            vm.loadingAction = false
            vm.loadingActionProcess = false
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
    doActionSpecial (filter) {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      vm.loadingAction = true
      vm.$store.dispatch('postAction', filter).then(function (result) {
        // console.log('result======', result)
        vm.loadingAction = false
        vm.dialogActionProcess = false
        vm.loadingActionProcess = false
        vm.btnStateVisible = false
        if (result.hasOwnProperty('rollbackable') && result['rollbackable'] !== null && result['rollbackable'] !== undefined) {
          vm.rollbackable = result.rollbackable
        }
        if (result.hasOwnProperty('dossierDocumentId') && result['dossierDocumentId'] !== null && result['dossierDocumentId'] !== undefined && result['dossierDocumentId'] !== 0 && result['dossierDocumentId'] !== '0') {
          vm.printDocument = true
        }
        vm.checkInput = 0
        vm.$store.commit('setCheckInput', 0)
        vm.$router.push({
          path: vm.$router.history.current.path,
          query: {
            recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: currentQuery['q']
          }
        })
      }).catch(function (reject) {
        vm.loadingActionProcess = false
        vm.loadingAction = false
      })
    },
    getNextActions () {
      // var vm = this
      // let params = {
      //   dossierId: vm.thongTinChiTietHoSo.dossierId
      // }
      // vm.$store.dispatch('loadProcessStep', params).then(resultNextActions => {
      //   console.log('resultNextActions++++++++++++', resultNextActions)
      //   vm.nextActions = resultNextActions
      // })
      let vm = this
      let query = vm.$router.history.current.query
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let currentQuery = vm.$router.history.current.query
      vm.dossierId = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('pullNextactions', filter).then(function (result) {
        vm.btnDossierDynamics = result
        if (currentQuery.hasOwnProperty('btnIndex') && currentQuery.btnIndex !== null && currentQuery.btnIndex !== '') {
          vm.btnStateVisible = true
          vm.dialogActionProcess = true
          if (currentQuery.btnIndex.toString() === '8500') {
            let result = {
              actionCode: 8500,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              overdue: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else if (currentQuery.btnIndex.toString() === '8501') {
            let result = {
              actionCode: 8501,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              preoverdue: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else if (currentQuery.btnIndex.toString() === '8400') {
            let result = {
              actionCode: 8400,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              betimes: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else {
            if (vm.btnDossierDynamics[currentQuery.btnIndex].enable === 1 || vm.btnDossierDynamics[currentQuery.btnIndex].enable === 2) {
              vm.processPullBtnDetail(vm.btnDossierDynamics[currentQuery.btnIndex], currentQuery.btnIndex)
            } else {
              vm.dialogActionProcess = false
            }
          }
        }
        // console.log('vm.checkInput======', vm.getCheckInput)
        vm.checkInput = vm.getCheckInput
        if (vm.getCheckInput !== null && vm.getCheckInput !== undefined) {
          if (vm.checkInput !== 0) {
            setTimeout(function () {
              vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
            }, 300)
          }
        }
        // setTimeout(function () {
        //   vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
        // }, 300)
      })
      vm.$store.dispatch('loadPlugins', {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }).then(results => {
        vm.btnPlugins = results
      }).catch(xhr => {
        vm.btnPlugins = []
      })
      vm.loadDossierSyncs(vm.thongTinChiTietHoSo.dossierId)
    },
    showAlpacaJSFORM (item) {
      var vm = this
      if (item.eform) {
        vm.$store.dispatch('loadFormScript', item).then(resScript => {
          vm.$store.dispatch('loadFormData', item).then(resData => {
            var formScript, formData
            /* eslint-disable */
            if (resScript) {
              formScript = eval('(' + resScript + ')')
            } else {
              formScript = {}
            }
            if (resData) {
              formData = eval('(' + resData + ')')
            } else {
              formData = {}
            }
            /* eslint-disable */
            formScript.data = formData
            window.$('#formAlpaca' + item.partNo).alpaca(formScript)
          })
        })
      }
    },
    onUploadSingleFile (e, data, i) {
      var vm = this
      e.dataItem = data
      e['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      e['dossierTemplateNo'] = vm.thongTinChiTietHoSo.dossierTemplateNo
      vm.$store.dispatch('uploadSingleFile', e).then(function (result) {
      }).catch(function (xhr) {
      })
    },
    submitAlpacajsForm (item) {
      var vm = this
      let value = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        dossierPartNo: item.partNo
      }
      vm.$store.dispatch('putAlpacaForm', value)
    },
    postNextActions (stepModel) {
      var vm = this
      stepModel['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      if (stepModel.allowAssignUser > 0) {
        vm.$store.dispatch('reassignDossier', stepModel).then(resReassign => {
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
        })
      }
    },
    viewFileWithPartNo (item) {
      var vm = this
      if (vm.dossierFilesItems) {
        var fileViewsTemp = vm.dossierFilesItems.filter(file => {
          return file.dossierPartNo === item.partNo
        })
        if (fileViewsTemp) {
          vm.fileViews = fileViewsTemp
          // vm.sheet = true
          if (vm.partView !== item.partNo) {
            vm.stateView = true
            vm.partView = item.partNo
          } else {
            vm.stateView = !vm.stateView
            vm.partView = item.partNo
          }
        } else {
          return
        }
      }
      return
    },
    viewFile2 (data) {
      var vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      data['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('viewFile', data).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    viewFileDocument (item) {
      var vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      item['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('viewDocument', item).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    loadTPHS () {
      var vm = this
      // console.log('loadTPHS')
      if (vm.$refs.thanhphanhoso1) {
        setTimeout(function () {
          vm.$refs.thanhphanhoso1.initData(vm.thongTinChiTietHoSo)
        }, 150)
      }
      if (vm.$refs.thanhphanhoso2) {
        setTimeout(function () {
          vm.$refs.thanhphanhoso2.initData(vm.thongTinChiTietHoSo)
        }, 150)
      }
    },
    loadThanhToan () {
      var vm = this
      let filter = {
        dossierId: vm.dossierId,
        referenceUid: vm.thongTinChiTietHoSo.referenceUid
      }
      vm.$store.dispatch('loadDossierPayments', filter).then(result => {
        vm.paymentDetail = result
        // console.log('paymentProfile', vm.paymentProfile)
      }).catch(reject => {
      })
    },
    loadHoSoLienThong () {
      var vm = this
      let dossierId = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('loadDossierLienThong', dossierId).then(result => {
        vm.listLienThong = result
      }).catch(reject => {
        console.log(reject)
      })
    },
    loadVoting () {
      let vm = this
      let filter = {
        className: 'dossier',
        classPK: vm.id
      }
      vm.$store.dispatch('loadVoting', filter).then(function (result) {
        vm.votingItems = result
        console.log('votingItems', vm.votingItems)
      }).catch(function (reject) {
      })
    },
    submitVoting () {
      let vm = this
      let arrAction = []
      if (vm.votingItems.length > 0) {
        vm.loadingVoting = true
        for (var index in vm.votingItems) {
          vm.votingItems[index]['className'] = 'dossier'
          vm.votingItems[index]['classPk'] = vm.id
          arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[index]))
        }
        Promise.all(arrAction).then(results => {
          vm.loadingVoting = false
          vm.loadVoting()
          toastr.success('Đánh giá của bạn được gửi thành công')
        }).catch(xhr => {
          vm.loadingVoting = false
          toastr.error('Gửi đánh giá không thành công')
        })
      }
    },
    doAction () {
      let vm = this
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        actionId: vm.processActionCurrent
      }
      vm.$store.dispatch('processPullBtnDetail', filter).then(function (resultAction) {
        var paymentsOut = ''
        if (vm.showThuPhi) {
          paymentsOut = {
            requestPayment: vm.payments['requestPayment'],
            paymentNote: vm.payments['paymentNote'],
            advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
            feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
            serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
            shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
          }
          resultAction['payment'] = paymentsOut
        }
        if (vm.showYkienCanBoThucHien) {
          let result = vm.$refs.ykiencanbo.doExport()
          resultAction['userNote'] = result.text
        }
        vm.$refs.kypheduyettailieu.kySo(resultAction)
      }).catch(function (reject) {
        vm.loadingAction = false
        vm.loadingActionProcess = false
      })
    },
    printViewDocument () {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    filterNextActionEnable (nextaction) {
      var isEnabale = false
      if (nextaction && Array.isArray(nextaction)) {
        for (let key in nextaction) {
          if (nextaction[key]['enable'] !== 0) {
            isEnabale = true
          }
        }
      }
      return isEnabale 
    },
    checkPemissionSpecialAction (form, currentUser, thongtinchitiet) {
      var vm = this
      var checkValue = true
      // check theo người thực hiện
      if (form !== 'PRINT_01' && form !== 'PRINT_02' && form !== 'PRINT_03'
      && form !== 'GUIDE' && form !== 'PREVIEW' && form !== 'BETIMES') {
        let userArr = vm.$store.getters.getUsersNextAction
        if (userArr.length > 0) {
          let check = userArr.filter(function (item) {
            if (item !== undefined && currentUser !== undefined) {
              return item['userId'].toString() === currentUser['userId'].toString()
            }
          })
          if (check.length > 0) {
            checkValue = true
          } else {
            checkValue = false
          }
        } else {
          checkValue = false
        }
      }
      // check theo lastactionUser
      if (form === 'ROLLBACK_01' || form === 'ROLLBACK_02' || form === 'ROLLBACK_03') {
        // if (currentUser.userId === thongtinchitiet.lastActionUserId) {
        //   checkValue = true
        // } else {
          checkValue = false
        // }
      }
      return checkValue
    },
    checkPemissionPhanCongLai (currentUser) {
      let vm = this
      let checkValue = true
      // check theo người thực hiện và chuyển đến bởi
      let userArr = vm.$store.getters.getUsersNextAction
      let userLastAction = [{'userId': vm.thongTinChiTietHoSo.lastActionUserId ? vm.thongTinChiTietHoSo.lastActionUserId : ''}]
      let userCheckPermission = userArr.concat(userLastAction)
      console.log('checkPemissionPhanCongLai: ', currentUser)
      if (userCheckPermission.length > 0) {
        let check = userCheckPermission.filter(function (item) {
          if (item !== undefined && currentUser !== undefined) {
            return item['userId'].toString() === currentUser['userId'].toString()
          }
        })
        if (check.length > 0) {
          checkValue = true
        } else {
          checkValue = false
        }
      } else {
        checkValue = false
      }
      return checkValue
    },
    reAsign () {
      let vm = this
      vm.$store.dispatch('getDossierUserAsign', vm.thongTinChiTietHoSo.dossierId).then(function(result) {
        vm.reAsignUsers = result
        vm.dialog_reAsign = true
      })
    },
    doReAsign () {
      let vm = this
      let filter = {
        'dossierId': vm.thongTinChiTietHoSo.dossierId,
        'users': vm.reAsignUsers
      }
      let result = vm.$refs.phanconglai.doExport()
      if (result && vm.checkPemissionPhanCongLai(vm.currentUser)) {
        vm.loadingAction = true
        vm.$store.dispatch('postDossierUserAsign', filter).then(function (result) {
          setTimeout(function() {
            vm.getNextActions()
          }, 300)
          vm.dialog_reAsign = false
          vm.loadingAction = false
        }).catch(function (error) {
          vm.loadingAction = false
          console.log(error)
        })
      } else {
        return
      }
    },
    changeStateViewResult (data) {
      // console.log('state view result', data)
      var vm = this
      vm.stateViewResult = data
    },
    getUser (roleItem) {
      let vm = this
      let roles = vm.$store.getters.getUser.role
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)

    },
    checkActionSpecial (btnAction) {
      var vm = this
      if (Array.isArray(btnAction)) {
        var checkValue = 0
        $(btnAction).each(function (index, item) {
          // check theo người thực hiện
          if (item.form !== 'PRINT_01' && item.form !== 'PRINT_02' && item.form !== 'PRINT_03'
          && item.form !== 'GUIDE' && item.form !== 'PREVIEW' && item.form !== 'BETIMES') {
            let userArr = vm.$store.getters.getUsersNextAction
            if (userArr.length > 0) {
              let check = userArr.filter(function (item) {
                if (item !== undefined && currentUser !== undefined) {
                  return item['userId'].toString() === currentUser['userId'].toString()
                }
              })
              if (check.length > 0) {
                checkValue += 1
              }
            }
          }
        })
        if (checkValue > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(Number(arg))
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    getMaxDueDate (arr) {
      let maxDue = Math.max.apply(Math, arr.map(function (item) {
        return item.actionOverdue
      }))
      return maxDue
    },
    getThoiHanQuyDinh (val) {
      if (val > 0) {
        return val + ' ngày'
      } else {
        return ''
      }
    }
  }
}
</script>
