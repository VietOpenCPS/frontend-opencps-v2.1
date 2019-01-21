<template>
  <div class="form-chitiet">
    
    <div>
      <v-tabs icons-and-text v-model="activeTab">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabs-1" @click="getNextActions()"> 
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            <span v-if="originality === 3">XỬ LÝ HỒ SƠ</span> <span v-else>CHUẨN BỊ HỒ SƠ</span>
          </v-btn>
        </v-tab>
        <v-tab :key="2" href="#tabs-2" @click="loadTPHS()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            <span v-if="thongTinChiTietHoSo.finishDate">THÀNH PHẦN HỒ SƠ VÀ KẾT QUẢ</span> <span v-else>THÀNH PHẦN HỒ SƠ</span>
          </v-btn>
        </v-tab>
        <v-tab v-if="paymentDetail" :key="3" href="#tabs-3" @click="loadThanhToan()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            THANH TOÁN
          </v-btn>
        </v-tab>
        <v-tab :key="4" href="#tabs-4" v-if="originality !== 1 && listLienThong.length>0" @click="loadHoSoLienThong()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            LIÊN THÔNG
          </v-btn>
        </v-tab>
        <v-tab :key="5" href="#tabs-5" @click="loadDossierActions()" v-if="originality !== 1">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            TIẾN TRÌNH THỤ LÝ
          </v-btn>
        </v-tab>
        <!-- <v-tab :key="7" href="#tabs-7" @click="loadMermaidgraph()" v-if="originality !== 1">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            THEO DÕI HỒ SƠ
          </v-btn>
        </v-tab> -->
        <v-tabs-items v-model="activeTab" reverse-transition="fade-transition" transition="fade-transition" style="overflow: visible!important">
          <v-tab-item value="tabs-1" :key="1" reverse-transition="fade-transition" transition="fade-transition">
            <!-- Một cửa -->
            <div class="px-4 pt-2">
              <div class="px-2 py-2" :style="{border: filterNextActionEnable(btnDossierDynamics) || (usersNextAction && Array.isArray(usersNextAction) && usersNextAction.length > 0) ?'1px solid #4caf50' : ''}" v-if="btnStateVisible && originality === 3 && !thongTinChiTietHoSo.finishDate">
                <p class="mb-2">
                  <span>Chuyển đến bởi: </span>
                  <b>&nbsp;{{thongTinChiTietHoSo.lastActionUser}}</b>
                  <span v-if="thongTinChiTietHoSo.lastActionNote && thongTinChiTietHoSo.lastActionNote !== 'null'">
                    <span> - Ý kiến: </span>
                    <span style="color: #0b72ba">&nbsp;{{thongTinChiTietHoSo.lastActionNote}}</span>
                  </span>
                </p>
                <v-layout wrap xs12 class="mb-0"> 
                  <v-flex style="width: calc(100% - 100px)">
                    <span>Người thực hiện: &nbsp;</span>
                    <span v-if="usersNextAction && Array.isArray(usersNextAction) && usersNextAction.length > 0">
                      <span v-for="(item, index) in usersNextAction" :key="item.userId">
                        &nbsp;<b>{{item.userName}}</b><span v-if="index !== (usersNextAction.length - 1)">,</span>
                      </span>
                      <span v-if="stepOverdueNextAction"> - </span>
                      <span :style="stepOverdueNextAction&&stepOverdueNextAction.indexOf('Quá hạn') < 0 ? 'color:green' : 'color:red'">
                        {{stepOverdueNextAction}}
                      </span>
                    </span>
                  </v-flex>
                  <v-flex class="text-xs-right" style="width:100px">
                    <v-btn class="mx-0 my-0" :disabled="checkPemissionPhanCongLai(currentUser) === false && String(currentUser['userId']) !== String(thongTinChiTietHoSo.lastActionUserId)" @click="reAsign" small color="primary" style="height:26px">
                      <span v-if="String(currentUser['userId']) === String(thongTinChiTietHoSo.lastActionUserId) || getUser('Administrator_data') || getUser('Administrator')">Phân công lại</span>
                      <span v-if="!getUser('Administrator_data') && !getUser('Administrator') && String(currentUser['userId']) !== String(thongTinChiTietHoSo.lastActionUserId) && checkPemissionPhanCongLai(currentUser)">Ủy quyền</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <div class="px-2 py-2" style="border: 1px solid #4caf50" v-if="thongTinChiTietHoSo.finishDate && btnStateVisible">
                <p class="mb-2">
                  Hồ sơ đã hoàn thành quá trình xử lý
                </p>
              </div>
            </div>
            <div style="position: relative;" v-if="checkInput !== 0 && filterNextActionEnable(btnDossierDynamics)">

            </div>
            <!-- Action button -->
            <div class="px-4 py-3" v-if="btnStateVisible" style="border-bottom: 1px solid #dddddd;">
              
            </div>
          </v-tab-item>
          <v-tab-item value="tabs-2" :key="2" reverse-transition="fade-transition" transition="fade-transition">
            123
          </v-tab-item>
          <v-tab-item value="tabs-3" :key="3" reverse-transition="fade-transition" transition="fade-transition">
            123
          </v-tab-item>
          <v-tab-item v-if="listLienThong.length>0" value="tabs-4" :key="4" reverse-transition="fade-transition" transition="fade-transition">
            123
          </v-tab-item>
          <v-tab-item value="tabs-5" v-if="originality !== 1" :key="5" reverse-transition="fade-transition" transition="fade-transition">
            13123
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
  </div>
</template>

<script>

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
  })
}
</script>
