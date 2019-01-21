<template>
  <div class="form-chitiet">
    
    <thong-tin-co-ban-ho-so ref="thong-tin-co-ban-ho-so" :detailDossier="thongTinChiTietHoSo"></thong-tin-co-ban-ho-so>
    <!--  -->
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
              <v-expansion-panel :value="[true]" class="expansion-pl">
                <v-expansion-panel-content hide-actions :key="1">
                  <div slot="header">
                    <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                    <span v-if="checkInput === 2">Chỉnh sửa thành phần hồ sơ</span> 
                    <span v-else>Kiểm tra thành phần hồ sơ</span>&nbsp;&nbsp;&nbsp;&nbsp; 
                  </div>
                  <thanh-phan-ho-so ref="thanhphanhoso" :checkInput="checkInput" :onlyView="false" :id="'ci'" :partTypes="inputTypes"></thanh-phan-ho-so>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
            <!-- Action button -->
            <div class="px-4 py-3" v-if="btnStateVisible" style="border-bottom: 1px solid #dddddd;">
              <v-btn color="primary" class="ml-0 mr-2" :class='{"deactive__btn": String(btnIndex) !== String(index)}' v-for="(item, index) in btnDossierDynamics" v-bind:key="index" 
                v-on:click.native="processPullBtnDetail(item, index)" 
                :loading="loadingAction && index === btnIndex"
                :disabled="loadingAction || item.enable === 2"
                v-if="item.enable > 0 || (item['autoEvent'] === 'special' && thongTinChiTietHoSo['permission'].indexOf('write') >= 0)"
              >
                {{item.actionName}}
                <span slot="loader">Loading...</span>
              </v-btn>
              <v-btn color="primary" class="ml-0 mr-2" v-for="(item, index) in btnPlugins" v-bind:key="index" 
                v-on:click.native="processPullBtnplugin(item, index)" 
                :loading="loadingPlugin"
                :disabled="loadingPlugin"
              >
                {{item.pluginName}}
                <span slot="loader">Loading...</span>
              </v-btn>
              <!-- Action rollBack -->
              <!-- <v-btn color="primary" class="ml-0 mr-2 deactive__btn" v-if="String(currentUser.userId) === String(thongTinChiTietHoSo.lastActionUserId)"
                @click="rollBackDossier(true)"
                :loading="loadingAction"
                :disabled="loadingAction"
              >
                Quay lại bước trước
                <span slot="loader">Loading...</span>
              </v-btn> -->
              <!-- Action special -->
              <v-menu bottom offset-y v-if="btnStepsDynamics.length > 0 && thongTinChiTietHoSo['permission'].indexOf('write') >= 0" style="display: inline-block;position:relative !important">
                <v-btn slot="activator" class="deactive__btn" color="primary" dark>Khác &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                <v-list>
                  <v-list-tile v-for="(item, index) in btnStepsDynamics" :key="index" @click="btnActionEvent(item, index)">
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                  <!-- <v-list-tile v-for="(item, index) in btnDossierDynamics" :key="index" 
                    @click="processPullBtnDetail(item, index)" 
                    v-if="checkPemissionSpecialAction(null, currentUser, thongTinChiTietHoSo)"
                    >
                    <v-list-tile-title>{{ item.actionName }}</v-list-tile-title>
                  </v-list-tile> -->
                </v-list>
              </v-menu>
            </div>
            <content-placeholders v-if="loadingAction">
              <content-placeholders-img />
              <content-placeholders-heading />
            </content-placeholders>
            <!--  -->
            <v-layout wrap v-if="dialogActionProcess && !loadingAction">
              <form-bo-sung-thong-tin ref="formBoSungThongTinNgan" v-if="showFormBoSungThongTinNgan" :dossier_id="Number(id)" :action_id="Number(actionIdCurrent)"></form-bo-sung-thong-tin>
              <phan-cong ref="phancong" v-if="showPhanCongNguoiThucHien" v-model="assign_items" :type="type_assign"></phan-cong>
              <tai-lieu-ket-qua ref="tailieuketqua" v-if="showTaoTaiLieuKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="createFiles"></tai-lieu-ket-qua>
              <tra-ket-qua v-if="showTraKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="returnFiles"></tra-ket-qua>
              <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail" :detailDossier="thongTinChiTietHoSo"></thu-phi>
              <!-- thanh toán điện tử -->
              <thanh-toan-dien-tu ref="epayment" v-if="showThanhToanDienTu" :paymentProfile="paymentProfile" :detailDossier="thongTinChiTietHoSo"></thanh-toan-dien-tu>
              <ky-duyet :style="dataEsign['signatureType'] === '' ? 'display:none' : ''" ref="kypheduyettailieu" :detailDossier="thongTinChiTietHoSo" :dataEsign="dataEsign" v-if="showKyPheDuyetTaiLieu"></ky-duyet>
              <ngay-gia-han ref="ngaygiahan" v-if="showExtendDateEdit" :type="typeExtendDate" :extendDateEdit="extendDateEdit"></ngay-gia-han>
              <ngay-hen-tra ref="ngayhentra" v-if="showEditDate" :dueDateEdit="dueDateEdit"></ngay-hen-tra>
              <thong-tin-buu-chinh v-if="showPostalService" :postalService="thongTinChiTietHoSo"></thong-tin-buu-chinh>
              <y-kien-can-bo ref="ykiencanbo" v-if="showYkienCanBoThucHien" :user_note="userNote" :configNote="configNote"></y-kien-can-bo>
              <div class="px-4 pt-0 pb-2" style="width: 100%;border-bottom: 1px solid #dddddd">
                <v-btn color="primary" class="ml-0 mr-2" @click.native="processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)" v-if="dialogActionProcess"
                  :loading="loadingActionProcess"
                  :disabled="loadingActionProcess"
                  >
                  <v-icon>save</v-icon>&nbsp;
                  Xác nhận
                  <span slot="loader">Loading...</span>
                </v-btn>
              </div>
            </v-layout>
            <v-alert class="mx-3" v-if="!btnStateVisible" outline :color="alertObj.color" :icon="alertObj.icon" :value="true">
              {{alertObj.message}}
            </v-alert>
            <div v-if="rollbackable || printDocument" class="py-2" style="width: 100%;border-bottom: 1px solid #dddddd">
              <!-- <v-btn color="primary" v-if="rollbackable" @click="rollBack()">Quay lại bước trước</v-btn> -->
              <v-btn color="primary" v-if="printDocument" @click="printViewDocument()">In văn bản hành chính</v-btn>
            </div>
            <!--  -->
          </v-tab-item>
          <v-tab-item value="tabs-2" :key="2" reverse-transition="fade-transition" transition="fade-transition">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl ext__form">
              <v-expansion-panel-content :key="1">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> I.</div>
                  Tài liệu nộp &nbsp;&nbsp;&nbsp;&nbsp;
                  <span v-if="thongTinChiTietHoSo.sampleCount !== 0 && !thongTinChiTietHoSo.online">({{thongTinChiTietHoSo.sampleCount === 0 ? '?' : thongTinChiTietHoSo.sampleCount}}&nbsp;bộ hồ sơ)</span>
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso1" :onlyView="true" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :value="[true]" expand  class="expansion-pl ext__form" v-if="stateViewResult">
              <v-expansion-panel-content :key="1">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> II.</div>
                  Kết quả xử lý
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso2" @tp:change-state-view-result="changeStateViewResult" :onlyView="true" :id="'kq'" :partTypes="outputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel :value="[true]" expand  class="expansion-pl ext__form" v-if="documents && documents.length > 0">
              <v-expansion-panel-content :key="1">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> 
                    <span v-if="stateViewResult">III</span>
                    <span v-else>II</span>
                  </div>
                  Văn bản hành chính
                </div>
                <div v-for="(item, index) in documents" v-bind:key="index">
                  <v-card>
                    <v-layout wrap class="px-3 py-1 align-center row-list-style"> 
                      <v-flex xs11>
                        <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                        <div style="margin-left: 30px;">{{item.documentName}}</div>
                      </v-flex>
                      <v-flex xs1 class="text-right">
                        <v-tooltip top>
                          <v-btn slot="activator" class="mx-0 my-0" fab dark small color="primary" @click="viewFileDocument(item)" style="height:25px;width:25px">
                            <v-icon style="font-size: 14px;">visibility</v-icon>
                          </v-btn>
                          <span>Xem</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-tab-item>
          <v-tab-item value="tabs-3" :key="3" reverse-transition="fade-transition" transition="fade-transition">
            <v-card>
              <chi-tiet-thanh-toan ref="thongtinthanhtoan" :payments="paymentDetail" :dossierDetail="thongTinChiTietHoSo"></chi-tiet-thanh-toan>
            </v-card>
          </v-tab-item>
          <v-tab-item v-if="listLienThong.length>0" value="tabs-4" :key="4" reverse-transition="fade-transition" transition="fade-transition">
            <v-card>
              <ho-so-lien-thong v-if="listLienThong.length>0" :listLienThong="listLienThong" :dossierDetail="thongTinChiTietHoSo"></ho-so-lien-thong>
              <v-card-text v-else>
                <v-flex xs12 class="text-xs-center">
                  <span>Không có hồ sơ liên thông</span>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tabs-5" v-if="originality !== 1" :key="5" reverse-transition="fade-transition" transition="fade-transition">
            <v-flex xs12 style="height:42px">
              <v-radio-group class="absolute__btn pt-1" style="width: 350px" v-model="typeTienTrinh" row @change="changeTypeTienTrinh($event)">
                <v-radio label="Xem dạng bảng" :value="1" ></v-radio>
                <v-radio label="Xem dạng biểu đồ" :value="2"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-data-table v-if="typeTienTrinh === 1" :headers="headers" :items="dossierActions" class="table-landing table-bordered"
            hide-actions no-data-text="Không có dữ liệu"
            >
              <template slot="headerCell" slot-scope="props">
                <v-tooltip bottom>
                  <span slot="activator">
                    {{ props.header.text }}
                  </span>
                  <span>
                    {{ props.header.text }}
                  </span>
                </v-tooltip>
              </template>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{props.index + 1}}</td>
                <td class="text-xs-left">{{props.item.sequenceRole}}</td>
                <td class="text-xs-left">{{props.item.sequenceName}}</td>
                <td class="text-xs-left">{{props.item.durationCount|getThoiHanQuyDinh}}</td>
                <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                <td class="text-xs-left">
                  <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                    {{itemUser.userName}} <br>
                  </div>
                </td>
                <td class="text-xs-left">
                  <div v-for="(itemAction, index) in props.item.actions" :key="index">
                    {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                    <span v-if="itemAction.actionNote && itemAction.actionNote !== 'null'"> - <i>{{itemAction.actionNote}}</i></span>
                  </div>
                  <div v-if="props.item.statusText">
                    <span style="color: green">{{props.item.statusText}}</span>
                  </div>
                </td>
              </template>
            </v-data-table>
            <div v-else>
              <content-placeholders v-if="loadingMermaidgraph">
                <content-placeholders-img />
                <content-placeholders-heading />
              </content-placeholders>
              <div id="mermaid_dossier" class="mermaid" style="padding: 15px;"></div>
            </div>
          </v-tab-item>
          <!-- <v-tab-item id="tabs-7" :key="7" reverse-transition="fade-transition" transition="fade-transition">
            <div id="mermaid_dossier" class="mermaid" style="padding: 15px;"></div>
          </v-tab-item> -->
        </v-tabs-items>
      </v-tabs>
    </div>
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
  })
}
</script>
