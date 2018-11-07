<template>
  <div class="form-chitiet">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header">
      <div class="background-triangle-big"> <span>CHI TIẾT HỒ SƠ</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="thongTinChiTietHoSo.serviceName">
          {{thongTinChiTietHoSo.serviceCode}} - {{thongTinChiTietHoSo.serviceName}}
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
        <!-- <v-tab :key="4" href="#tabs-4" v-if="originality !== 1" @click="loadHoSoLienThong()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            LIÊN THÔNG
          </v-btn>
        </v-tab> -->
        <v-tab :key="5" href="#tabs-5" @click="loadDossierActions()" v-if="originality !== 1">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            TIẾN TRÌNH THỤ LÝ
          </v-btn>
        </v-tab>
        <v-tab :key="6" href="#tabs-6" @click="loadDossierLogs()">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            NHẬT KÝ SỬA ĐỔI
          </v-btn>
        </v-tab>
        <v-tab :key="7" href="#tabs-7" @click="loadMermaidgraph()" v-if="originality !== 1">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            THEO DÕI HỒ SƠ
          </v-btn>
        </v-tab>
        <v-tabs-items v-model="activeTab" reverse-transition="fade-transition" transition="fade-transition">
          <v-tab-item id="tabs-1" :key="1" reverse-transition="fade-transition" transition="fade-transition">
            <!-- Một cửa -->
            <div class="px-4 pt-2">
              <div class="px-2 py-2" :style="{border: filterNextActionEnable(btnDossierDynamics) || (usersNextAction && Array.isArray(usersNextAction) && usersNextAction.length > 0) ?'1px solid #4caf50' : ''}" v-if="btnStateVisible && originality === 3 && !thongTinChiTietHoSo.finishDate">
                <p class="mb-2" v-if="filterNextActionEnable(btnDossierDynamics)">
                  <span>Chuyển đến bởi: </span>
                  <b>&nbsp;{{thongTinChiTietHoSo.lastActionUser}}</b>
                  <span v-if="thongTinChiTietHoSo.lastActionNote && thongTinChiTietHoSo.lastActionNote !== 'null'">
                    <span> - Ý kiến: </span>
                    <span style="color: #0b72ba">&nbsp;{{thongTinChiTietHoSo.lastActionNote}}</span>
                  </span>
                </p>
                <p class="mb-0" v-if="usersNextAction && Array.isArray(usersNextAction) && usersNextAction.length > 0">
                  <span>Người thực hiện: &nbsp;</span>
                  <span v-for="(item, index) in usersNextAction" :key="item.userId">
                    &nbsp;<b>{{item.userName}}</b><span v-if="index !== (usersNextAction.length - 1)">,</span>
                  </span>
                  <span v-if="stepOverdueNextAction"> - </span>
                  <span :style="stepOverdueNextAction&&stepOverdueNextAction.indexOf('Quá hạn') < 0 ? 'color:green' : 'color:red'">
                    {{stepOverdueNextAction}}
                  </span>
                </p>
              </div>
              <div class="px-2 py-2" style="border: 1px solid #4caf50" v-if="thongTinChiTietHoSo.finishDate">
                <p class="mb-2">
                  Hồ sơ đã hoàn thành quá trình xử lý
                </p>
              </div>
            </div>
            <div style="position: relative;" v-if="checkInput !== 0 && filterNextActionEnable(btnDossierDynamics)">
              <v-expansion-panel class="expansion-pl">
                <v-expansion-panel-content hide-actions value="1">
                  <div slot="header">
                    <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                    <span v-if="checkInput === 2">Chỉnh sửa thành phần hồ sơ</span> <span v-else>Kiểm tra thành phần hồ sơ</span>&nbsp;&nbsp;&nbsp;&nbsp; <span v-if="checkInput === 2" style="position: absolute; right: 15px; margin-top: 5px; color: red; font-weight: normal;">Có thể tải lên các định dạng sau: png, jpg, jpeg, pdf, docx, doc, xls, xlsx</span>
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
                v-if="item.enable > 0 || (item['autoEvent'] === 'special')"
              >
                {{item.actionName}}
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
              <v-menu bottom offset-y v-if="btnStepsDynamics.length > 0 && checkActionSpecial(btnStepsDynamics)">
                <v-btn slot="activator" class="deactive__btn" color="primary" dark>Khác &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                <v-list>
                  <v-list-tile v-for="(item, index) in btnStepsDynamics" :key="index" v-if="checkPemissionSpecialAction(item.form, currentUser, thongTinChiTietHoSo)" @click="btnActionEvent(item, index)">
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
              <tai-lieu-ket-qua v-if="showTaoTaiLieuKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="createFiles"></tai-lieu-ket-qua>
              <tra-ket-qua v-if="showTraKetQua" :resultFiles="returnFiles"></tra-ket-qua>
              <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail" :detailDossier="thongTinChiTietHoSo"></thu-phi>
              <!-- thanh toán điện tử -->
              <thanh-toan-dien-tu ref="epayment" v-if="showThanhToanDienTu" :paymentProfile="paymentProfile" :detailDossier="thongTinChiTietHoSo"></thanh-toan-dien-tu>
              <ky-duyet ref="kypheduyettailieu" :detailDossier="thongTinChiTietHoSo" :dataEsign="dataEsign" v-if="showKyPheDuyetTaiLieu"></ky-duyet>
              <ngay-gia-han ref="ngaygiahan" v-if="showExtendDateEdit" :type="typeExtendDate" :extendDateEdit="extendDateEdit"></ngay-gia-han>
              <ngay-hen-tra ref="ngayhentra" v-if="showEditDate" :dueDateEdit="dueDateEdit"></ngay-hen-tra>
              <y-kien-can-bo ref="ykiencanbo" v-if="showYkienCanBoThucHien" :user_note="userNote" :configNote="configNote"></y-kien-can-bo>
              <div class="px-4 pt-0 pb-2" style="width: 100%;border-bottom: 1px solid #dddddd">
                <v-btn color="primary" class="ml-0 mr-2" @click.native="processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)" v-if="dialogActionProcess"
                  :loading="loadingActionProcess"
                  :disabled="loadingActionProcess"
                  >
                  <v-icon>save</v-icon>&nbsp;
                  <!-- <span v-if="configNote && configNote.labelButton">{{configNote.labelButton}}</span> <span v-else>Xác nhận</span> -->
                  Xác nhận
                  <span slot="loader">Loading...</span>
                </v-btn>
              </div>
            </v-layout>
            <v-alert v-if="!btnStateVisible" outline :color="alertObj.color" :icon="alertObj.icon" :value="true">
              {{alertObj.message}}
            </v-alert>
            <div v-if="rollbackable || printDocument" class="py-2" style="width: 100%;border-bottom: 1px solid #dddddd">
              <!-- <v-btn color="primary" v-if="rollbackable" @click="rollBack()">Quay lại bước trước</v-btn> -->
              <v-btn color="primary" v-if="printDocument" @click="printViewDocument()">In văn bản hành chính</v-btn>
            </div>
            <!-- Trao đổi thảo luận -->
            <div v-if="thongTinChiTietHoSo.online">
              <v-expansion-panel class="expansion-pl">
                <v-expansion-panel-content hide-actions value="1">
                  <div slot="header">
                    <div class="background-triangle-small"> 
                      <v-icon size="18" color="white">star_rate</v-icon> 
                    </div>
                    <span v-if="originality === 3">Trao đổi với người làm thủ tục</span>
                    <span v-else>Trao đổi với cán bộ xử lý</span>
                  </div>
                  <v-card>
                    <v-card-text class="px-0 py-0 pr-3">
                      <v-flex xs12>
                        <ul class="timeline overflowComment" style="max-height: 300px;overflow: auto;" v-if="dossierSyncs.length > 0">
                          <li class="timeline-item" v-for="(item, index) in dossierSyncs" v-bind:key="index" v-if="item.syncType !==0 && item.infoType !== 0">
                            <div class="timeline-badge" :class="item.syncType === 2 ? 'primary' : 'warning'">
                              <v-icon color="grey lighten-4" size="20">{{item.syncType === 2 ? 'account_balance' : 'perm_identity'}}</v-icon>
                            </div>
                            <div class="timeline-panel">
                              <div class="timeline-heading">
                                <div class="timeline-panel-controls">
                                  <div class="timestamp">
                                    <small class="text-muted">{{ item.createDate | dateTimeView }}</small>
                                  </div>
                                </div>
                              </div>
                              <div class="timeline-body">
                                <span v-if="item.syncType === 2">{{item.actionName}} </span>
                                <span v-if="item.syncType === 2 && item.actionNote && item.actionNote !== 'null'">:</span>
                                <span v-if="item.actionNote && item.actionNote !== 'null'" style="color: #0b72ba">{{ item.actionNote }}</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <!--  -->
                        <div v-else class="no-comments no-data my-2">
                          <i class="fa fa-comments" style="font-size: 25px;"></i><br>
                          <span style="font-size: 18px;">Không có trao đổi nào</span>
                        </div>
                        <!--  -->
                        <div style="position:relative">
                          <v-text-field class="pl-4 my-3"
                          v-model="messageChat"
                          label="Nhập trao đổi"
                          @keyup.enter="postChat"
                          box
                          ></v-text-field>
                          <v-icon @click="postChat" color="blue" class="hover-pointer" style="position: absolute;right: 10px;bottom: 18px;font-size: 14px;">send</v-icon>
                        </div>
                      </v-flex>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
            <div style="position: relative;" v-if="originality !== 1">
              <v-expansion-panel class="expansion-pl">
                <v-expansion-panel-content hide-actions value="1">
                  <div slot="header">
                    <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                    Trao đổi nội bộ &nbsp;&nbsp;&nbsp;&nbsp; 
                  </div>
                  <!-- TODO -->
                  <comment ref="comment" :classPK="id" :className="className"></comment>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
            <!--  -->
          </v-tab-item>
          <v-tab-item id="tabs-2" :key="2" reverse-transition="fade-transition" transition="fade-transition">
            <v-expansion-panel expand  class="expansion-pl ext__form">
              <v-expansion-panel-content v-bind:value="true">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> I.</div>
                  Tài liệu nộp &nbsp;&nbsp;&nbsp;&nbsp;
                  <span v-if="thongTinChiTietHoSo.sampleCount !== 0 && !thongTinChiTietHoSo.online">({{thongTinChiTietHoSo.sampleCount === 0 ? '?' : thongTinChiTietHoSo.sampleCount}}&nbsp;bộ hồ sơ)</span>
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso1" :onlyView="true" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel expand  class="expansion-pl ext__form" v-if="stateViewResult">
              <v-expansion-panel-content v-bind:value="true">
                <div slot="header" class="text-bold">
                  <div class="background-triangle-small"> II.</div>
                  Kết quả xử lý
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso2" @tp:change-state-view-result="changeStateViewResult" :onlyView="true" :id="'kq'" :partTypes="outputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel expand  class="expansion-pl ext__form" v-if="documents && documents.length > 0">
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
          </v-tab-item>
          <v-tab-item id="tabs-3" :key="3" reverse-transition="fade-transition" transition="fade-transition">
            <v-card>
              <chi-tiet-thanh-toan ref="thongtinthanhtoan" :payments="paymentDetail" :dossierDetail="thongTinChiTietHoSo"></chi-tiet-thanh-toan>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabs-4" :key="4" reverse-transition="fade-transition" transition="fade-transition">
            <v-card>
              <ho-so-lien-thong :listLienThong="listLienThong" :dossierDetail="thongTinChiTietHoSo"></ho-so-lien-thong>
            </v-card>
          </v-tab-item>
          <v-tab-item id="tabs-5" v-if="originality !== 1" :key="5" reverse-transition="fade-transition" transition="fade-transition">
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
                    </div>
                    <div v-if="props.item.statusText">
                      <span style="color: green">{{props.item.statusText}}</span>
                    </div>
                  </td>
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
          <v-tab-item id="tabs-6" :key="6" reverse-transition="fade-transition" transition="fade-transition">
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
          <v-tab-item id="tabs-7" :key="7" reverse-transition="fade-transition" transition="fade-transition">
            <div id="mermaid_dossier" class="mermaid"></div>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>
    <object id="plugin0" type="application/x-cryptolib05plugin" width="0" height="0"></object>
  </div>
</template>

<script>
import router from '@/router'
// import $ from 'jquery'
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
import mermaid from 'mermaid'
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
    'ngay-gia-han': ExtendDateEdit,
    'chi-tiet-thanh-toan': ChiTietThanhToan,
    'ho-so-lien-thong': HoSoLienThong
  },
  data: () => ({
    inputTypes: [1, 3],
    outputTypes: [2],
    actionIdCurrent: 0,
    validateAction: true,
    btnIndex: -1,
    processActionCurrent: 0,
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
    documents: [],
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
    dataEsign: '',
    showTraKetQua: false,
    showThuPhi: false,
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
    returnFiles: [],
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
    listLienThong: []
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
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.thongTinChiTietHoSo = resultDossier
        vm.loadThanhToan()
        // vm.loadHoSoLienThong()
        vm.getNextActions()
        vm.runComment()
        // console.log('thongtinchitiet', vm.thongTinChiTietHoSo)
        vm.$store.dispatch('loadDossierDocuments', resultDossier).then(resultDocuments => {
          if (Array.isArray(resultDocuments)) {
            vm.documents = resultDocuments
          } else {
            vm.documents.push(resultDocuments)
          }
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
        if (resultDossier['dossierSubStatus']) {
          vm.$store.dispatch('pullBtnConfigStep', resultDossier).then(result => {
            vm.btnStepsDynamics = result
          })
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
        vm.$store.dispatch('loadMermaidgraph', dataParams).then(chartData => {
          document.getElementById('mermaid_dossier').innerHTML = chartData
          mermaid.initialize({
            theme: 'forest'
          })
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
      console.log('isPopup========11111', isPopup)
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
        if (result.hasOwnProperty('returnFiles') && result.returnFiles !== null && result.returnFiles !== undefined && result.returnFiles !== 'undefined' && result.returnFiles.length > 0) {
          isPopup = true
          vm.showTraKetQua = true
          vm.returnFiles = result.returnFiles
        }
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0) {
          // add thanh toán điện tử
          if ((result.payment.requestPayment === 3 || result.payment.requestPayment === '3') && dossierItem['stepCode'] === 610) {
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
        if (result.hasOwnProperty('betimes')) {
          isPopup = true
          vm.showExtendDateEdit = true
          vm.extendDateEdit = result.betimes
          vm.typeExtendDate = 'betimes'
        }
      }
      // console.log('isPopup========222222', isPopup)
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
        vm.btnIndex = 111
        let result = {
          actionCode: 8500,
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          overdue: vm.thongTinChiTietHoSo['extendDate'] ? vm.thongTinChiTietHoSo['extendDate'] : ''
        }
        // vm.doActionSpecial(result)
        vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
      } else if (String(item.form) === 'BETIMES') {
        vm.btnIndex = 333
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
        router.push({
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
        router.push({
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
        router.push({
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
      var validThanhToanDienTu = true
      var validKySo = true
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
        } else {
          validThanhToanDienTu = false
        }
        // console.log('paymentProfile1', paymentProfile, validThanhToanDienTu)
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
        // console.log('extendDateEdit', data.extendDate)
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
            'delayNote': data.text
          }
        }
        filter['payload'] = payload
      }
      if (vm.showFormBoSungThongTinNgan) {
        filter['payload'] = vm.$refs.formBoSungThongTinNgan.formSubmitData()
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
      if (vm.showKyPheDuyetTaiLieu) {
        let resultTmp = vm.$refs.kypheduyettailieu.doExport()
        // console.log('resultTmp', result)
        if (resultTmp.useKS) {
          useKySo = true
          // if (vm.kysoSuccess) {
          //   validKySo = true
          // } else {
          //   validKySo = false
          // }
        } else {
          useKySo = false
        }
      }
      if (validPhanCong && validYKien && validTreHan && validThanhToanDienTu) {
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
            // console.log('result======', result)
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
            // console.log('vm.rollbackable======', vm.rollbackable)
            // console.log('vm.printDocument======', vm.printDocument)
            router.push({
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
        if (useKySo) {
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
              let note = ''
              if (result.valid) {
                validYKien = true
                note = result.text
              } else {
                validYKien = false
              }
              resultAction['userNote'] = note
            }
            vm.$refs.kypheduyettailieu.kySo(resultAction)
            setTimeout(function () {
              vm.loadingAction = false
              vm.loadingActionProcess = false
            }, 200)
          }).catch(function (reject) {
            vm.loadingAction = false
            vm.loadingActionProcess = false
          })
        } else {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            // console.log('result======', result)
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
              router.push('/danh-sach-ho-so/' + vm.index + '/nop-thanh-cong/' + vm.thongTinChiTietHoSo.dossierId)
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
        router.push({
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
          if (currentQuery.btnIndex.toString() === '111') {
            let result = {
              actionCode: 8500,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              overdue: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else if (currentQuery.btnIndex.toString() === '333') {
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
        console.log('paymentProfile', vm.paymentProfile)
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
            return item['userId'].toString() === currentUser['userId'].toString()
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
    changeStateViewResult (data) {
      console.log('state view result', data)
      var vm = this
      vm.stateViewResult = data
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
                return item['userId'].toString() === vm.currentUser['userId'].toString()
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
