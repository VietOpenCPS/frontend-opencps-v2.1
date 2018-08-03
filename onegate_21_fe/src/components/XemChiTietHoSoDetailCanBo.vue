<template>
  <div class="form-chitiet">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header">
      <div class="background-triangle-big"> <span>CHI TIẾT HỒ SƠ</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="thongTinChiTietHoSo.serviceName">
          {{thongTinChiTietHoSo.serviceName}}
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
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
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
    <thong-tin-co-ban-ho-so ref="thong-tin-co-ban-ho-so" :detailDossier="thongTinChiTietHoSo"></thong-tin-co-ban-ho-so>
    <!--  -->
    <div>
      <v-tabs icons-and-text centered class="mb-4" v-model="activeTab">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab :key="1" href="#tabs-1" @click="loadTPHS()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            THÀNH PHẦN HỒ SƠ
          </v-btn>
        </v-tab>
        <v-tab :key="2" href="#tabs-2" @click="getNextActions()"> 
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            XỬ LÝ HỒ SƠ
          </v-btn>
        </v-tab>
        <v-tab :key="3" href="#tabs-3" @click="loadDossierActions()" v-if="originality !== 1">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            TIẾN TRÌNH THỤ LÝ
          </v-btn>
        </v-tab>
        <v-tab :key="4" href="#tabs-4" @click="loadDossierLogs()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            NHẬT KÝ HỒ SƠ
          </v-btn>
        </v-tab>
        <v-tab :key="5" href="#tabs-5" @click="runComment()" v-if="originality !== 1">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            TRAO ĐỔI NỘI BỘ
          </v-btn>
        </v-tab>
        <!-- <v-tab :key="6" href="#tabs-6" @click="loadDossierSyncs()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            TRAO ĐỔI THẢO LUẬN
          </v-btn>
        </v-tab> -->
        <v-tabs-items v-model="activeTab">
          <v-tab-item id="tabs-1" :key="1" reverse-transition="fade-transition" transition="fade-transition">
            <v-expansion-panel expand  class="expansion-pl ext__form">
              <v-expansion-panel-content v-bind:value="true">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> I.</div>
                  Tài liệu nộp
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso1" :onlyView="true" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
                <!-- <div v-for="(item, index) in dossierTemplatesTN" v-bind:key="item.partNo">
                  <v-card>
                    <v-layout wrap class="px-3 py-1 align-center row-list-style">
                      <v-flex xs11>
                        <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                        <div style="margin-left: 30px;">{{item.partName}}</div>
                      </v-flex>
                      <v-flex xs1 class="text-right">
                        <v-tooltip top>
                          <v-btn slot="activator" class="mx-0 my-0" fab dark small color="primary" @click="viewFileWithPartNo(item)" style="height:25px;width:25px">
                            {{item.count}}
                          </v-btn>
                          <span>Xem</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <div v-if="item.partNo === partView && stateView">
                    <v-layout row wrap>
                      <v-flex xs12 sm12>
                        <div v-for="(itemFileView, index) in fileViews">
                          <div style="display: flex;align-items: center;min-height: 32px;background: #fff;padding-left: 25px;">
                            <span @click="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer; color: blue;">
                              <v-icon v-if="itemFileView.eForm">border_color</v-icon>
                              <v-icon v-else>attach_file</v-icon>
                              {{itemFileView.displayName}}
                            </span>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </div>
                </div> -->
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel expand  class="expansion-pl ext__form">
              <v-expansion-panel-content v-bind:value="true">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> II.</div>
                  Kết quả
                </div>
                <!-- <div v-for="(item, index) in dossierTemplatesKQ" v-bind:key="item.partNo">
                  <v-card>
                    <v-layout wrap class="px-3 py-1 align-center row-list-style py-2"> 
                      <v-flex xs11>
                        <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                        <div style="margin-left: 30px;">{{item.partName}}</div>
                      </v-flex>
                      <v-flex xs1 class="text-right">
                        <v-tooltip top>
                          <v-btn slot="activator" class="mx-0 my-0" fab dark small color="primary" @click="viewFileWithPartNo(item)" style="height:25px;width:25px">
                            {{item.count}}
                          </v-btn>
                          <span>Xem</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <div v-if="item.partNo === partView && stateView">
                    <v-layout row wrap>
                      <v-flex xs12 sm12>
                        <div v-for="(itemFileView, index) in fileViews">
                          <div style="width: calc(100% - 370px);display: flex;align-items: center;min-height: 32px;background: #fff;padding-left: 25px;">
                            <span @click="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer; color: blue;"><v-icon>attach_file</v-icon>{{itemFileView.displayName}}</span>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </div>
                </div> -->
                <thanh-phan-ho-so ref="thanhphanhoso2" :onlyView="true" :id="'kq'" :partTypes="outputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel expand  class="expansion-pl ext__form">
              <v-expansion-panel-content v-bind:value="true">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> III.</div>
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
            <!-- <v-expansion-panel expand  class="expansion-pl ext__form" style="border: none">
              <v-expansion-panel-content v-bind:value="true">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> IV.</div>
                  Chứng từ thanh toán
                </div>
                <div v-for="(item, index) in payments" :key="item.referenceUid">
                  <v-card>
                    <v-layout wrap class="px-3 py-1 align-center row-list-style" style="border-bottom: 1px solid #ddd"> 
                      <v-flex xs11>
                        <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                        <div style="margin-left: 30px;">{{item.paymentFee}}</div>
                      </v-flex>
                      <v-flex xs1 class="text-right">
                        <v-tooltip top>
                          <v-btn slot="activator" class="mx-0 my-0" fab dark small color="primary" @click="viewFile(item)" style="height:25px;width:25px">
                            <v-icon>visibility</v-icon>
                          </v-btn>
                          <span>Xem</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel> -->
          </v-tab-item>
          <v-tab-item id="tabs-2" :key="2" reverse-transition="fade-transition" transition="fade-transition">
            <div style="position: relative;" v-if="checkInput === 2">
              <v-expansion-panel class="expansion-pl">
                <v-expansion-panel-content hide-actions value="1">
                  <div slot="header">
                    <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                    THÀNH PHẦN HỒ SƠ &nbsp;&nbsp;&nbsp;&nbsp; 
                  </div>
                  <thanh-phan-ho-so ref="thanhphanhoso" :onlyView="false" :id="'ci'" :partTypes="inputTypes"></thanh-phan-ho-so>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
            <div class="py-3" v-if="btnStateVisible">
              <v-btn color="primary" :class='{"deactive__btn": String(btnIndex) !== String(index)}' v-for="(item, index) in btnDossierDynamics" v-bind:key="index" 
                v-on:click.native="processPullBtnDetail(item, index)" 
                :loading="loadingAction && index === indexAction"
                :disabled="item.enable === 2"
                v-if="item.enable > 0"
              >
                {{item.actionName}}
                <span slot="loader">Loading...</span>
              </v-btn>
            </div>
            <v-layout wrap v-if="dialogActionProcess">
              <form-bo-sung-thong-tin ref="formBoSungThongTinNgan" v-if="showFormBoSungThongTinNgan" :dossier_id="Number(id)" :action_id="Number(actionIdCurrent)"></form-bo-sung-thong-tin>
              <phan-cong ref="phancong" v-if="showPhanCongNguoiThucHien" v-model="assign_items" :type="type_assign"></phan-cong>
              <tai-lieu-ket-qua v-if="showTaoTaiLieuKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="createFiles"></tai-lieu-ket-qua>
              <!-- showTaoTaiLieuKetQua: {{showTaoTaiLieuKetQua}} <br/> -->
              <tra-ket-qua v-if="showTraKetQua" :resultFiles="returnFiles"></tra-ket-qua>
              <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail"></thu-phi>
              <ky-duyet ref="kypheduyettailieu" :detailDossier="thongTinChiTietHoSo" v-if="showKyPheDuyetTaiLieu"></ky-duyet>
              <!-- showThucHienThanhToanDienTu: {{showThucHienThanhToanDienTu}} <br/> -->
              <y-kien-can-bo ref="ykiencanbo" v-if="showYkienCanBoThucHien" :user_note="userNote" :configNote="configNote"></y-kien-can-bo>
              <v-btn color="primary" @click.native="processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)" v-if="dialogActionProcess"
                :loading="loadingActionProcess"
                :disabled="loadingActionProcess"
                >
                <v-icon>save</v-icon>&nbsp;
                <!-- <span v-if="configNote && configNote.labelButton">{{configNote.labelButton}}</span> <span v-else>Xác nhận</span> -->
                <span>Xác nhận</span>
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-layout>
            <v-alert v-if="!btnStateVisible" outline color="success" icon="check_circle" :value="true">
              Thực hiện thành công!
            </v-alert>
            <p v-if="rollbackable">Bạn có muốn quay lui thao tác vừa thực hiện</p>
            <v-btn color="primary" v-if="rollbackable" @click="rollBack()">Quay lui</v-btn>
            <v-btn color="primary" v-if="printDocument" @click="printViewDocument()">Quay lui</v-btn>
          </v-tab-item>
          <v-tab-item id="tabs-3" v-if="originality !== 1" :key="3" reverse-transition="fade-transition" transition="fade-transition">
            <div>
              <v-data-table :headers="headers" :items="dossierActions" class="table-landing table-bordered"
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
                <td class="text-xs-left">{{props.item.durationCount}} ngày</td>
                <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                <td class="text-xs-left">
                  <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                    {{itemUser.userName}} <br>
                  </div>
                </td>
                <td class="text-xs-left">
                  <div v-for="(itemAction, index) in props.item.actions" :key="index">
                    {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                    <div v-if="index === props.item.actions.length - 1">
                      <div v-if="props.item.statusText">
                        <span style="color: green">{{props.item.statusText}}</span>
                      </div>
                    </div>
                  </div>
                </td>
              </template>
            </v-data-table>
          </div>
          </v-tab-item>
          <v-tab-item id="tabs-4" :key="4" reverse-transition="fade-transition" transition="fade-transition">
            <div v-for="(item, index) in listHistoryProcessing" v-bind:key="item.dossierLogId" class="list_history_style">
                <td class="px-2 pt-2" :class="index % 2 !== 0 ? 'col-tien-trinh-1' : 'col-tien-trinh-2'">{{ index + 1 }}</td>
                <td class="text-xs-left px-2 py-2">
                  <p class="mb-1"> <span>{{ item.createDate | dateTimeView }}</span> - <b>{{ item.author }}</b> 
                    : <span style="color: #0b72ba">{{ item.payload.stepName }}</span>
                  </p>
                  <p class="mb-1" v-if="item.content !== '' && item.content !== null">Ý kiến: <span v-html="item.content"></span></p>
                  <p
                  class="history__download__link hover-pointer-download mb-1"
                  title="Tải file"
                  v-for="file in item.payload.files"
                  :key="file.dossierFileId"
                  style="cursor: pointer;"
                  @click.prevent.stop="downloadFileLogs(file.dossierFileId)"
                  >
                  <v-icon>file_download</v-icon> 
                  <span>{{file.fileName}}</span>
                </p>
              </td>
            </div>
          </v-tab-item>
          <v-tab-item id="tabs-5" v-if="originality !== 1" :key="5" reverse-transition="fade-transition" transition="fade-transition">
            <comment ref="comment" :classPK="id" :className="className"></comment>
          </v-tab-item>
          <!-- <v-tab-item id="tabs-6" :key="6" reverse-transition="fade-transition" transition="fade-transition">
            <v-layout row wrap>
              <v-flex xs12 sm3>
              </v-flex>
              <v-flex xs12 sm6>
                <v-card>
                  <div style="height: 400px; overflow: auto; margin-bottom: 10px;">
                    <div v-for="(item, index) in dossierSyncs" v-bind:key="index">
                      <div :class="{ 'text-xs-left': item.syncType === 1, 'text-xs-right': item.syncType === 2 }">
                        <v-chip label :color="getColorChat(item.syncType)" text-color="white">
                          {{item.actionUser}}: {{item.actionNote}}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  <v-text-field
                  v-model="messageChat"
                  solo
                  label="Nhập trao đổi"
                  append-icon="send"
                  @change="postChat"
                  ></v-text-field>
                </v-card>
              </v-flex>
              <v-flex xs12 sm3>
              </v-flex>
            </v-layout>
          </v-tab-item> -->
        </v-tabs-items>
      </v-tabs>
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
  props: ['index', 'id'],
  components: {
    'comment': Comment,
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
    inputTypes: [1, 3],
    outputTypes: [2],
    actionIdCurrent: 0,
    validateAction: true,
    btnIndex: -1,
    activeTab: 'tabs-1',
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
    processSteps: [],
    documents: null,
    payments: '',
    dossierActions: [],
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
    configNote: null,
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
    printDocument: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    getCheckInput () {
      return this.$store.getters.getCheckInput
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
        vm.thongTinChiTietHoSo['dossierId'] = vm.id
        vm.btnStateVisible = true
        vm.getNextActions()
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (currentParams.hasOwnProperty('activeTab') && vm.isCallBack) {
        vm.isCallBack = false
        vm.btnDossierDynamics = []
        vm.btnStepsDynamics = []
        vm.btnIndex = -1
        vm.activeTab = currentQuery.activeTab
        vm.btnIndex = currentQuery['btnIndex']
        vm.thongTinChiTietHoSo['dossierId'] = vm.id
        vm.btnStateVisible = true
        vm.getNextActions()
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
    }
  },
  methods: {
    initData (data) {
      var vm = this
      vm.dossierId = data
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.thongTinChiTietHoSo = resultDossier
        var arrTemp = []
        arrTemp.push(vm.$store.dispatch('loadDossierTemplates', resultDossier))
        arrTemp.push(vm.$store.dispatch('loadDossierFiles', resultDossier.dossierId))
        vm.thongTinHoSo = resultDossier
        Promise.all(arrTemp).then(values => {
          let dossierTemplates = values[0]
          let dossierFiles = values[1]
          dossierTemplates.forEach(item => {
            if (item.partType === 1 || item.partType === 3) {
              vm.dossierTemplatesTN.push(item)
            } else {
              vm.dossierTemplatesKQ.push(item)
            }
          })
          vm.dossierFilesItems = dossierFiles
          vm.dossierTemplatesItems = dossierTemplates
          vm.recountFileTemplates()
        }).catch(reject => {
        })
        vm.$store.dispatch('loadDossierDocuments', resultDossier).then(resultDocuments => {
          if (Array.isArray(resultDocuments)) {
            vm.documents = resultDocuments
          } else {
            vm.documents.push(resultDocuments)
          }
        })
        console.log('vm.$refs========', vm.$refs)
        if (vm.$refs.thanhphanhoso) {
          vm.$refs.thanhphanhoso.initData(resultDossier)
        }
        if (vm.$refs.thanhphanhoso1) {
          vm.$refs.thanhphanhoso1.initData(resultDossier)
        }
        if (vm.$refs.thanhphanhoso2) {
          vm.$refs.thanhphanhoso2.initData(resultDossier)
        }
        // vm.$store.dispatch('loadDossierPayments', resultDossier).then(resultPayments => {
        //   vm.payments = resultPayments
        // })
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
      vm.$refs.comment.runComment()
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
    loadDossierSyncs (data) {
      var vm = this
      if (vm.thongTinChiTietHoSo.dossierId) {
        let dataParams = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          info: '1,2'
        }
        vm.$store.dispatch('loadDossierSyncs', dataParams).then(resultSyncs => {
          console.log('resultSyncs++++++++++++++++', resultSyncs)
          vm.dossierSyncs = resultSyncs
        })
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
      let params = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        actionCode: 8200,
        actionNote: vm.messageChat,
        actionUser: ''
      }
      vm.$store.dispatch('postAction', params).then(result => {
        vm.loadDossierSyncs()
      })
      vm.messageChat = ''
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
          console.log('resultPlugin+++++++++', resultPlugin)
          vm.stepModel = resultPlugin
        }).catch(reject => {
          vm.stepModel = null
        })
      }
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
      if (result.hasOwnProperty('configNote') && result.configNote !== null && result.configNote !== undefined && result.configNote !== 'undefined') {
        try {
          vm.configNote = JSON.parse(result.configNote)
          if (vm.configNote.confirm) {
            isPopup = true
          }
        } catch (e) {
        }
      }
      console.log('isPopup========11111', isPopup)
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
      }
      console.log('isPopup========222222', isPopup)
      if (isPopup) {
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
      } else {
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, false)
      }
    },
    processPullBtnDetail (item, index) {
      let vm = this
      vm.btnIndex = index
      vm.itemAction = item
      vm.actionIdCurrent = item.processActionId
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        actionId: item.processActionId
      }
      vm.dossierId = vm.thongTinChiTietHoSo.dossierId
      vm.dialogActionProcess = false
      vm.loadingActionProcess = true
      vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
        vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, item, result, index)
      })
    },
    btnActionEvent (item, index, isGroup) {
      let vm = this
      vm.itemAction = item
      vm.indexAction = index
      if (String(item.form) === 'NEW') {
        let isOpenDialog = true
        if (vm.dichVuSelected !== null && vm.dichVuSelected !== undefined && vm.dichVuSelected !== 'undefined' && vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu.length === 1) {
          isOpenDialog = false
        }
        if (isOpenDialog) {
          vm.dialogAction = true
        } else {
          vm.doCreateDossier()
        }
      } else if (String(item.form) === 'UPDATE') {
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + vm.thongTinChiTietHoSo.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'ADD') {
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/bo-sung-ho-so/' + vm.thongTinChiTietHoSo.dossierId,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'COPY') {
        vm.doCopy(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'CANCEL') {
        vm.doCancel(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_01') {
        // Xem trước phiếu của một hồ sơ
        vm.doPrint01(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_02') {
        // Xem trước phiếu gộp của nhiều hồ sơ
        vm.doPrint02(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_03') {
        // In văn bản mới nhất đã phê duyệt
        vm.doPrint03(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'GUIDE') {
        vm.doGuiding(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'PREVIEW') {
        vm.doPreview(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'ACTIONS') {
        vm.doActions(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'DELETE') {
        vm.doDeleteDossier(vm.thongTinChiTietHoSo, item, index, isGroup)
      } else if (String(item.form) === 'ROLLBACK_01') {
        let result = {
          actionCode: 9000
        }
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, true)
      } else if (String(item.form) === 'ROLLBACK_02') {
        let result = {
          actionCode: 9000
        }
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, true)
      } else if (String(item.form) === 'OVERDUE') {
        let result = {
          actionCode: 8500
        }
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, true)
      } else if (String(item.form) === 'BETIMES') {
        let result = {
          actionCode: 8400
        }
        vm.processAction(vm.thongTinChiTietHoSo, item, result, index, true)
      }
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
    rollBack () {
      var vm = this
      let params = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      vm.$store.dispatch('rollBack', params).then(resRollBack => {
        vm.getNextActions()
        vm.btnStateVisible = true
      })
    },
    processAction (dossierItem, item, result, index, isConfirm) {
      let vm = this
      var validPhanCong = false
      var validYKien = false
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
      vm.dossierId = dossierItem.dossierId
      let currentQuery = vm.$router.history.current.query
      vm.loadingActionProcess = true
      if (isConfirm) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x && vm.validateAction) {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.btnStateVisible = false
            if (result.rollbackable) {
              vm.rollbackable = true
            }
            if (result.dossierDocumentId) {
              vm.printDocument = true
            }
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          })
        } else {
          return false
        }
      } else if (vm.validateAction) {
        vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
          vm.dialogActionProcess = false
          vm.loadingActionProcess = false
          vm.btnStateVisible = false
          if (result.rollbackable) {
            vm.rollbackable = true
          }
          if (result.dossierDocumentId) {
            vm.printDocument = true
          }
          vm.checkInput = 0
          vm.$store.commit('setCheckInput', 0)
          if (String(item.form) === 'ACTIONS') {
          } else {
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          }
        })
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
          if (vm.btnDossierDynamics[currentQuery.btnIndex].enable === 1 || vm.btnDossierDynamics[currentQuery.btnIndex].enable === 2) {
            vm.processPullBtnDetail(vm.btnDossierDynamics[currentQuery.btnIndex], currentQuery.btnIndex)
          } else {
            vm.dialogActionProcess = false
          }
        }
        console.log('vm.checkInput======', vm.getCheckInput)
        vm.checkInput = vm.getCheckInput
        if (vm.getCheckInput !== null && vm.getCheckInput !== undefined) {
          if (vm.checkInput === 2) {
            setTimeout(function () {
              vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
            }, 300)
          }
        }
      })
      // vm.$store.dispatch('pullProcessSteps', {
      //   stepCode: vm.thongTinChiTietHoSo.stepCode
      // }).then(resProSteps => {
      //   vm.btnStepsDynamics = resProSteps
      // })
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
            $('#formAlpaca' + item.partNo).alpaca(formScript)
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
    getColorChat (syncType) {
      if (syncType === 1) {
        return 'pink'
      } else {
        return 'cyan lighten-1'
      }
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
      console.log('loadTPHS')
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
    }
  }
}
</script>
