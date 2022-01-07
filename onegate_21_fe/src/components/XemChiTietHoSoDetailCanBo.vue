<template>
  <div class="form-chitiet">
    <div v-if="viewScript">
      <div v-if="loadingForm" class="text-xs-center mt-5">
        <v-progress-circular
          :size="50"
          color="#dedede"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-else>
        <div class="row-header">
          <div class="background-triangle-big"> <span>CHI TIẾT HỒ SƠ</span> </div>
          <div class="layout row wrap header_tools row-blue">
            <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="thongTinChiTietHoSo.serviceName">
              {{thongTinChiTietHoSo.serviceName}}
            </div>
            <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
              <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
                <v-icon size="18">reply</v-icon> &nbsp;
                Quay lại
              </v-btn>
            </div>
          </div> 
        </div>
        <v-card flat color="#fff">
          <div id="formScriptTemplate" class="mb-5 pt-0"></div>
        </v-card>
      </div>
    </div>
    <div v-else>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <div v-else class="row-header">
        <div class="background-triangle-big"> <span>CHI TIẾT HỒ SƠ</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="width: calc(100% - 100px);" :title="thongTinChiTietHoSo.serviceName">
            {{thongTinChiTietHoSo.serviceName}}
          </div>
          <div class="flex text-right" style="margin-left: auto;width: 100px">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition" style="overflow: hidden;">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{titleDialogPdf}}</v-toolbar-title>
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
          <iframe v-show="!dialogPDFLoading" id="dialogPDFPreviewXl" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
          </iframe>
          <v-card-actions v-if="itemAction && (itemAction.form === 'PRINT_01' || itemAction.form === 'PRINT_02')">
            <v-spacer></v-spacer>
            <v-btn class="mr-3" color="primary" @click="exportDoc()">
              <v-icon size=16>fas fa fa-file-word-o</v-icon> &nbsp;
              Tải xuống file word
            </v-btn>
            <v-btn class="mr-3" color="primary">
              <v-icon size=16>fa fa-file-pdf-o</v-icon> &nbsp;
              <a :href="srcDownloadIframe" download> Tải xuống file pdf</a>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <thong-tin-co-ban-ho-so v-if="reRender" ref="thong-tin-co-ban-ho-so" :detailDossier="thongTinChiTietHoSo" :mauCongVan="mauCongVan"></thong-tin-co-ban-ho-so>
      <!--  -->
      <div>
        <v-tabs icons-and-text v-model="activeTab">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabs-1" @click="getNextActions()"> 
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              <span v-if="originality === 3">XỬ LÝ HỒ SƠ</span> <span v-else>CHUẨN BỊ HỒ SƠ</span>
            </v-btn>
          </v-tab>
          <v-tab :key="2" href="#tabs-2" @click="!isNotarization ? loadTPHS() : ''">
            <v-btn flat class="px-0 py-0 mx-0 my-0" v-if="!isNotarization">
              <span v-if="thongTinChiTietHoSo.finishDate">THÀNH PHẦN HỒ SƠ VÀ KẾT QUẢ</span> <span v-else>THÀNH PHẦN HỒ SƠ</span>
            </v-btn>
            <v-btn flat class="px-0 py-0 mx-0 my-0" v-else>
              <span> TÀI LIỆU CHỨNG THỰC</span>
            </v-btn>
          </v-tab>
          <v-tab v-if="paymentDetail" :key="3" href="#tabs-3" @click="loadPaymentFile()">
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
              TIẾN TRÌNH XỬ LÝ
            </v-btn>
          </v-tab>
          <v-tab :key="6" href="#tabs-6" v-if="originality !== 1 && viTriLuuTru && docLuuTru.length > 0">
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              VỊ TRÍ LƯU TRỮ
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
                <div class="px-2 py-2" :style="(filterNextActionEnable(btnDossierDynamics) || (usersNextAction && Array.isArray(usersNextAction) && usersNextAction.length > 0)) ? 'border:1px solid #4caf50;border-radius: 3px' : ''" v-if="btnStateVisible && originality === 3 && !thongTinChiTietHoSo.finishDate">
                  <p class="mb-2">
                    <span>Chuyển đến bởi: &nbsp;</span>
                    <b>&nbsp;{{thongTinChiTietHoSo.lastActionUser}}</b>
                    <span v-if="thongTinChiTietHoSo.lastActionNote && thongTinChiTietHoSo.lastActionNote !== 'null'">
                      <span> - Ý kiến: </span>
                      <span style="color: #0b72ba">&nbsp;{{thongTinChiTietHoSo.lastActionNote}}</span>
                    </span>
                  </p>
                  <v-layout wrap xs12 class="mb-0"> 
                    <v-flex style="width: calc(100% - 110px); text-align: justify;">
                      <span>Người thực hiện: &nbsp;</span>
                      <span v-if="usersNextAction && Array.isArray(usersNextAction) && usersNextAction.length > 0">
                        <span v-for="(item, index) in usersNextAction" :key="item.userId">
                          <b>{{item.userName}}</b><span v-if="index !== (usersNextAction.length - 1)">,</span>
                        </span>
                        <span v-if="stepOverdueNextAction"> - </span>
                        <span :style="stepOverdueNextAction&&stepOverdueNextAction.indexOf('Quá hạn') < 0 ? 'color:green' : 'color:red'">
                          {{stepOverdueNextAction}}
                        </span>
                      </span>
                    </v-flex>
                    <v-flex id="reAssign" v-if="thaoTacUyQuyen && showReasign && checkPemissionPhanCongLai(currentUser)" class="text-xs-right" style="width:100px">
                      <v-btn @click="reAsign" class="mx-0 my-0 right" :disabled="checkPemissionPhanCongLai(currentUser) === false && String(currentUser['userId']) !== String(thongTinChiTietHoSo.lastActionUserId)" small color="primary" style="height:26px">
                        Ủy quyền
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </div>

                <v-alert
                  :value="true"
                  color="success"
                  icon="check_circle"
                  outline
                  v-if="thongTinChiTietHoSo.finishDate && btnStateVisible"
                >
                  Hồ sơ đã hoàn thành quá trình xử lý
                </v-alert>
              </div>
              <div style="position: relative;" v-if="checkInput !== 0 && filterNextActionEnable(btnDossierDynamics)">
                <v-expansion-panel :value="[true]" expand  class="expansion-pl">
                  <v-expansion-panel-content hide-actions :key="1">
                    <div slot="header">
                      <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                      <span v-if="checkInput === 2">Chỉnh sửa thành phần hồ sơ</span> 
                      <span v-else>Kiểm tra thành phần hồ sơ</span>&nbsp;&nbsp;&nbsp;&nbsp; 
                    </div>
                    <thanh-phan-ho-so ref="thanhphanhoso" :checkInput="checkInput" :onlyView="checkInput === 2 ? false : true" :id="'ci'" :partTypes="inputTypes" :expandEform="confirmGuiHoSoTrucTuyen && checkInput === 2 && originality === 1 && thongTinChiTietHoSo.dossierStatus === 'new' ? true : false"></thanh-phan-ho-so>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </div>
              <!-- Action button -->
              <div class="px-4 py-3" v-if="btnStateVisible" style="border-bottom: 1px solid #dddddd;">
                <v-progress-linear :indeterminate="true" v-if="loadingNextAction"></v-progress-linear>
                <div v-else>
                  <v-btn color="primary" class="ml-0 mr-2 on-hover-btn" :class='{"deactive__btn": String(btnIndex) === String(index)}' v-for="(item, index) in btnDossierDynamics" v-bind:key="index" 
                    v-on:click.native="processPullBtnDetail(item, index)" 
                    :loading="loadingAction && index === btnIndex"
                    :disabled="loadingAction || item.enable === 2"
                    v-if="item.enable > 0 || (item['autoEvent'] === 'special' && thongTinChiTietHoSo && thongTinChiTietHoSo['permission'].indexOf('write') >= 0)"
                  >
                    {{item.actionName}}
                    <span slot="loader">Loading...</span>
                  </v-btn>
                  <v-btn color="primary" class="ml-0 mr-2 on-hover-btn" v-for="(item, index) in btnPlugins" v-bind:key="index" 
                    v-on:click.native="processPullBtnplugin(item, index)"
                    :loading="loadingPlugin"
                    :disabled="loadingPlugin"
                  >
                    {{item.pluginName}} 
                    <span slot="loader">Loading...</span>
                  </v-btn>
                  <!--  -->
                  <v-btn color="primary" class="ml-0 mr-2 on-hover-btn" v-if="thaoTacPhanCongLai && detailPreAction && Number(detailPreAction['allowAssignUser']) > 2"
                    v-on:click.native="phanCongLai" 
                    :loading="loadingAction"
                    :disabled="loadingAction"
                  >
                    Phân công lại
                    <span slot="loader">Loading...</span>
                  </v-btn>
                  <!--  -->
                  <v-btn v-for="(item, index) in btnStepsDynamics" :key="index" color="primary" class="ml-0 mr-2 on-hover-btn" v-if="item.form === 'UPDATE'"
                    @click="btnActionEvent(item, index)"
                    :loading="loadingAction"
                    :disabled="loadingAction"
                  >
                    {{ item.title }}
                  </v-btn>
                  <!-- Thao tác thu hồi hồ sơ -->
                  <!-- <v-btn color="primary" class="ml-0 mr-2" v-if="String(currentUser['userId']) === String(thongTinChiTietHoSo.lastActionUserId)
                  && thongTinChiTietHoSo['dossierStatus'] !== 'new' && originality === 3"
                    v-on:click.native="rollBack()"
                    :loading="loadingAction"
                    :disabled="loadingAction"
                  >
                    Quay lại bước trước
                    <span slot="loader">Loading...</span>
                  </v-btn> -->
                  <!--  -->
                  <v-menu bottom offset-y v-if="showMenuActionKhac && thongTinChiTietHoSo && thongTinChiTietHoSo.hasOwnProperty('permission') && thongTinChiTietHoSo['permission'].indexOf('write') >= 0"
                    style="display: inline-block;position:relative !important">
                    <v-btn slot="activator" class="on-hover-btn" color="primary" dark>Khác &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                    <v-list>
                      <v-list-tile v-for="(item, index) in btnStepsDynamics" :key="index" @click="btnActionEvent(item, index)" v-if="item.form !== 'UPDATE'">
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
              </div>
              <!--  -->
              <div class="px-4 pt-2" v-if="btnStateVisible && thongTinChiTietHoSo.hasOwnProperty('dossierSyncState') && String(thongTinChiTietHoSo.dossierSyncState) === '1'">
                <v-progress-circular
                  indeterminate
                  color="amber"
                  style="position: absolute; bottom: 13px; left: 36px;"
                ></v-progress-circular>
                <v-alert
                  :value="true"
                  color="warning"
                  icon="priority_high"
                  outline
                >
                  Hồ sơ đang đồng bộ trạng thái, vui lòng chờ giây lát.
                </v-alert>
              </div>
              <!--  -->
              <v-layout wrap v-if="dialogActionProcess && !loadingAction">
                <v-expansion-panel v-if="showThanhPhanLienThong" :value="[true]" expand class="expansion-pl ext__form">
                  <v-expansion-panel-content :key="1">
                    <div slot="header">
                      <div class="background-triangle-small"> 
                        <v-icon size="18" color="white">star_rate</v-icon> 
                      </div> Thành phần hồ sơ gửi liên thông
                    </div>
                    <thanh-phan-ho-so ref="thanhphanhoso" :tempLienThong="true" :checkInput="checkInput" :onlyView="checkInput === 2 ? false : true" :id="'ci'" :partTypes="inputTypesLienThong"></thanh-phan-ho-so>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <form-bo-sung-thong-tin ref="formBoSungThongTinNgan" v-if="showFormBoSungThongTinNgan" :dossier_id="Number(id)" :action_id="Number(actionIdCurrent)"></form-bo-sung-thong-tin>
                <phan-cong ref="phancong" v-if="showPhanCongNguoiThucHien" v-model="assign_items" :data_rolegroup="roleGroupPhanCong" :detailDossier="thongTinChiTietHoSo" :data_uyquyen="reAsignUsers" :type="type_assign"></phan-cong>
                <tai-lieu-ket-qua :esignType="typeEsign" :preCondition="preCondition" ref="tailieuketqua" v-if="showTaoTaiLieuKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="createFiles"></tai-lieu-ket-qua>
                <tra-ket-qua v-if="showTraKetQua" :detailDossier="thongTinChiTietHoSo" :createFiles="returnFiles"></tra-ket-qua>
                <thu-phi ref="thongtinphi" v-if="showThuPhi" v-model="payments" :dataSource="sourcePaymentFee" :viaPortal="viaPortalDetail" :detailDossier="thongTinChiTietHoSo"></thu-phi>
                <!-- thanh toán điện tử -->
                <thanh-toan-dien-tu ref="epayment" v-if="showThanhToanDienTu" :paymentProfile="paymentProfile" :detailDossier="thongTinChiTietHoSo"></thanh-toan-dien-tu>
                <ky-duyet :style="dataEsign['signatureType'] === '' ? 'display:none' : ''" ref="kypheduyettailieu" :detailDossier="thongTinChiTietHoSo"
                :dataEsign="dataEsign" v-if="showKyPheDuyetTaiLieu" :filesPdfSignPlugin="filesPdfSign">
                </ky-duyet>
                <ngay-gia-han ref="ngaygiahan" v-if="showExtendDateEdit" :type="typeExtendDate" :extendDateEdit="extendDateEdit"></ngay-gia-han>
                <ngay-hen-tra ref="ngayhentra" v-if="showEditDate" :dueDateEdit="dueDateEdit"></ngay-hen-tra>
                <thong-tin-buu-chinh v-if="showPostalService" :postalService="thongTinChiTietHoSo"></thong-tin-buu-chinh>
                <y-kien-can-bo ref="ykiencanbo" v-if="showYkienCanBoThucHien" :user_note="userNote" :configNote="configNote"></y-kien-can-bo>
                <div v-if="visibleDoAction" class="px-4 pt-0 pb-2" style="width: 100%;border-bottom: 1px solid #dddddd">
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
              <div v-if="!btnStateVisible && (rollbackable || printDocument || printInvoicefilePayment)" class="ml-2 py-2" style="width: 100%;border-bottom: 1px solid #dddddd">
                <v-btn color="primary" v-if="rollbackable" @click="rollBack()">Thu hồi hồ sơ</v-btn>
                <v-btn color="primary" v-if="printDocument" @click="printViewDocument()"
                  :loading="dialogPDFLoading"
                  :disabled="dialogPDFLoading"
                >
                  <v-icon>print</v-icon> &nbsp;
                  In văn bản hành chính
                  <span slot="loader">Loading...</span>
                </v-btn>
                <v-btn color="primary" v-if="printInvoicefilePayment" @click="printPay()"
                  :loading="dialogPDFLoading"
                  :disabled="dialogPDFLoading"
                >
                  <v-icon>print</v-icon> &nbsp;
                  In biên lai điện tử
                  <span slot="loader">Loading...</span>
                </v-btn>
              </div>
              <!--  -->
            </v-tab-item>
            <v-tab-item value="tabs-2" :key="2" reverse-transition="fade-transition" transition="fade-transition">
              <div v-if="!isNotarization">
                <v-btn color="primary" v-if="hasDownloadAllFile" @click.stop="downloadAllFile()"
                  :loading="loadingDownload"
                  :disabled="loadingDownload"
                  style="position: absolute;right: 50px;z-index: 5;"
                >
                  <v-icon>save_alt</v-icon> &nbsp;
                  Tải giấy tờ đính kèm
                  <span slot="loader">Loading...</span>
                </v-btn>
                <v-expansion-panel :value="[true]" expand class="expansion-pl ext__form">
                  <v-expansion-panel-content :key="1">
                    <div slot="header" class="text-bold">
                      <div class="background-triangle-small"> I.</div>
                      Tài liệu nộp &nbsp;&nbsp;&nbsp;&nbsp;
                      <span v-if="thongTinChiTietHoSo.sampleCount !== 0 && !thongTinChiTietHoSo.online">({{thongTinChiTietHoSo.sampleCount === 0 ? '?' : thongTinChiTietHoSo.sampleCount}}&nbsp;bộ hồ sơ)</span>
                    </div>
                    <thanh-phan-ho-so ref="thanhphanhoso1" :onlyView="true" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel :value="[true]" expand class="expansion-pl ext__form" v-if="stateViewResult">
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
                        <span v-if="stateViewResult">III.</span>
                        <span v-else>II.</span>
                      </div>
                      Văn bản hành chính
                    </div>
                    <div v-for="(item, index) in documents" v-bind:key="index" style="border-bottom: 1px solid #dedede;">
                      <v-card>
                        <v-layout wrap class="pl-4 pr-2 py-1 align-center row-list-style"> 
                          <v-flex xs11>
                            <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                            <div style="margin-left: 20px;">{{item.documentName}}</div>
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
              </div>
              <div v-else>
                <tai-lieu-chung-thuc ref="tailieuchungthuc" :dossierInfo="thongTinChiTietHoSo" :onlyView="true"></tai-lieu-chung-thuc>
              </div>
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
              <v-flex xs12 style="height:42px" v-if="!sequencyDossierImport">
                <v-radio-group class="absolute__btn pt-1" style="width: 350px" v-model="typeTienTrinh" row @change="changeTypeTienTrinh($event)">
                  <v-radio label="Xem dạng bảng" :value="1" ></v-radio>
                  <v-radio label="Xem dạng biểu đồ" :value="2"></v-radio>
                </v-radio-group>
                <v-btn small color="primary" @click.stop="previewTienTrinh" v-if="hasPreviewSync"
                  :loading="dialogPDFLoading"
                  :disabled="dialogPDFLoading"
                  class="right"
                >
                  <v-icon color="white">print</v-icon>&nbsp;
                  In
                </v-btn>
              </v-flex>
              <v-data-table v-if="sequencyDossierImport" :headers="headersSequencyImport" :items="dossierImportActions" class="table-landing table-bordered"
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
                  <td class="text-xs-left">{{props.item.sequenceName}}</td>
                  <td class="text-xs-left">{{props.item.actions[0]['actionUser']}}</td>
                  <td class="text-xs-left">{{props.item.startDate|dateTimeViewSequency}}</td>
                  <td class="text-xs-left">{{props.item.finishDate|dateTimeViewSequency}}</td>
                  <td class="text-xs-left">{{props.item.actions[0]['note']}}</td>

                </template>
              </v-data-table>

              <v-data-table v-if="!sequencyDossierImport && typeTienTrinh === 1" :headers="headers" :items="dossierActions" class="table-landing table-bordered"
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
                    <div v-if="props.item.assignUsers.length === 1 && props.item.actions.length === 1 && props.item.actions[0]['actionCode'] == '4100' && props.item.assignUsers[0]['userName'].indexOf('Admin') >= 0">
                      {{props.item.actions[0]['actionUser']}}
                    </div>
                    <div v-else v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                      {{itemUser.userName}} <br>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <div v-for="(itemAction, index) in props.item.actions" :key="index">
                      {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                      <span v-if="itemAction.actionNote && itemAction.actionNote !== 'null'"> - <i>{{itemAction.actionNote}}</i></span>
                      <div v-if="Array.isArray(itemAction.files) && itemAction.files.length > 0">
                        <div v-for="(itemFile, index) in itemAction.files" :key="index" title="Tải xuống">
                          <p v-if="itemFile.dossierDocumentId" @click="downloadFileDocument(itemFile.dossierReferenceUid ? itemFile.dossierReferenceUid : '')">
                            <v-icon size="18" color="#0b72ba">
                              get_app
                            </v-icon>
                            <!-- <v-icon size="18" color="#0b72ba" class="mx-2" @click="">visibility</v-icon> -->
                            <span style="color: #0b72ba;cursor: pointer;">
                              {{itemFile.fileName}}
                            </span>
                          </p>
                          <p v-if="itemFile.dossierFileId" @click="downloadFileLogs(itemFile.dossierFileId)">
                            <v-icon size="18" color="#0b72ba">
                              get_app
                            </v-icon>
                            <!-- <v-icon size="18" color="#0b72ba" class="mx-2" @click="">visibility</v-icon> -->
                            <span style="color: #0b72ba;cursor: pointer;">
                              {{itemFile.fileName}}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-if="props.item.statusText">
                      <span style="color: green" v-if="thongTinChiTietHoSo['dossierStatus'] === 'done' || thongTinChiTietHoSo['dossierStatus'] === 'unresolved' 
                        || thongTinChiTietHoSo['dossierStatus'] === 'denied' || thongTinChiTietHoSo['dossierStatus'] === 'cancelled'">
                        {{props.item.statusText.replace("Đang thực hiện:", "")}}
                      </span>
                      <span style="color: green" v-else>
                        {{props.item.statusText}}
                      </span>
                    </div>
                  </td>
                </template>
              </v-data-table>
              <div v-if="!sequencyDossierImport && typeTienTrinh !== 1">
                <content-placeholders v-if="loadingMermaidgraph">
                  <content-placeholders-img />
                  <content-placeholders-heading />
                </content-placeholders>
                <div id="mermaid_dossier" class="mermaid" style="padding: 15px;min-height: 350px;"></div>
              </div>
            </v-tab-item>
            <v-tab-item v-if="originality !== 1 && viTriLuuTru" value="tabs-6" :key="6" reverse-transition="fade-transition" transition="fade-transition">
              <v-card>
                <v-card-text>
                  <v-flex xs12 class="">
                    <iframe id="viTriLuuTru" src="" type="application/pdf" width="100%" height="400px" style="overflow: auto;max-height: 400px;" frameborder="0">
                    </iframe>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
        <!--  -->
        <v-tabs icons-and-text v-model="activeTab2">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab :key="1" href="#tabs-1b" v-if="originality === 1 && thongTinChiTietHoSo['dossierStatus'] === 'done'">
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              ĐÁNH GIÁ
            </v-btn>
          </v-tab>
          <v-tab :key="2" href="#tabs-2b" 
            v-if="(originality === 1 && thongTinChiTietHoSo['dossierStatus'] !== 'new') || originality === 3"
          >
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              TRAO ĐỔI
            </v-btn>
          </v-tab>
          <v-tab :key="3" href="#tabs-3b" @click="loadDossierLogs()">
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              NHẬT KÝ SỬA ĐỔI
            </v-btn>
          </v-tab>
          <v-tabs-items v-model="activeTab2" reverse-transition="fade-transition" transition="fade-transition">
            <v-tab-item v-if="originality === 1 && thongTinChiTietHoSo['dossierStatus'] === 'done'"
            value="tabs-1b" :key="1" reverse-transition="fade-transition" transition="fade-transition">
              <div class="px-2 py-2" v-if="votingVersion === 1">
                <div v-if="votingItems && votingItems.length > 0">
                  <div v-for="(item, index) in votingItems" :key="index" >
                    <div class="text-bold">
                      {{index + 1}}.&nbsp; {{ item.title }}
                    </div>
                    <v-radio-group class="ml-3 mt-2" v-model="item.selected" column>
                      <v-radio class="ml-2" v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1.subject" :value="index1 + 1" :disabled="originality === 3"></v-radio>
                    </v-radio-group>
                  </div>
                </div>
                
                <div v-if="!votingItems || (votingItems && votingItems.length === 0)" class="mx-3">
                  <v-alert outline color="warning" icon="priority_high" :value="true">
                    Không có đánh giá
                  </v-alert>
                </div>
                <div class="ml-3 mt-4" v-if="votingItems && votingItems.length > 0 && originality === 1">
                  <v-btn color="primary"
                    :loading="loadingVoting"
                    :disabled="loadingVoting"
                    @click="doVottingResultSubmitNew"
                  >Gửi đánh giá</v-btn>
                </div>
              </div>
              <div class="px-2 py-2" v-if="votingVersion === 2">
                <div v-if="votingItems && votingItems.length > 0">
                  <div v-for="(item, index) in votingItems" :key="index" >
                    <div class="text-bold">
                      {{index + 1}}.&nbsp; {{ item.title }}
                    </div>
                    <v-radio-group class="ml-3 mt-2" v-model="item.selected" column>
                      <v-radio class="ml-2" v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1.subject" :value="index1 + 1" :disabled="originality === 3"></v-radio>
                    </v-radio-group>
                  </div>
                </div>
                
                <div v-if="!votingItems || (votingItems && votingItems.length === 0)" class="mx-3">
                  <v-alert outline color="warning" icon="priority_high" :value="true">
                    Không có đánh giá
                  </v-alert>
                </div>
                <div class="ml-3 mt-4" v-if="votingItems && votingItems.length > 0 && originality === 1">
                  <v-btn color="primary"
                    :loading="loadingVoting"
                    :disabled="loadingVoting"
                    @click="submitVoting"
                  >Gửi đánh giá</v-btn>
                </div>
              </div>
            </v-tab-item>
            <v-tab-item value="tabs-2b" :key="2" reverse-transition="fade-transition" transition="fade-transition"
              v-if="(originality === 1 && thongTinChiTietHoSo['dossierStatus'] !== 'new') || originality === 3"
            >
              <div v-if="thongTinChiTietHoSo.online && !thongTinChiTietHoSo.originDossierNo">
                <v-expansion-panel :value="[true]" expand  class="expansion-pl">
                  <v-expansion-panel-content hide-actions :key="1">
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
                            <li class="timeline-item" v-for="(item, index) in dossierSyncs" v-bind:key="index"
                              v-if="item.syncType !==0 && item.infoType !== 0 && item.actionNote && item.actionNote !== 'null'">
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
                                  <span v-if="item.syncType === 2">Cán bộ trả lời</span>
                                  <span v-if="item.syncType === 2 && item.actionNote && item.actionNote !== 'null'">: </span>
                                  <div v-if="item.actionNote && item.actionNote !== 'null'" style="color: #0b72ba">{{ item.actionNote }}</div>
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
                            <v-form v-model="validTraoDoi" ref="formTraoDoi" lazy-validation>
                              <v-textarea class="pl-4 my-0 mt-2"
                              v-model="messageChat"
                              label="Nhập trao đổi"
                              :rules="[rules.varchar5000]"
                              box
                              clearable
                              rows="3"
                              ></v-textarea>
                              <v-flex xs12 class="right">
                                <v-btn small @click="postChat" color="primary" class="white--text mx-0 my-0">
                                  <v-icon size="16">send</v-icon> &nbsp; Gửi
                                </v-btn>
                              </v-flex>
                            </v-form>
                          </div>
                        </v-flex>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </div>
              <div style="position: relative;" v-if="originality !== 1">
                <v-expansion-panel :value="[true]" expand >
                  <v-expansion-panel-content>
                    <div slot="header">
                      <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                      Trao đổi nội bộ &nbsp;&nbsp;&nbsp;&nbsp; 
                    </div>
                    <!-- TODO -->
                    <comment ref="comment" :classPK="id" :className="className"></comment>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </div>
            </v-tab-item>
            <v-tab-item value="tabs-3b" :key="3" reverse-transition="fade-transition" transition="fade-transition">
              <div v-for="(item, index) in listHistoryProcessing" v-bind:key="item.dossierLogId" class="list_history_style">
                  <td class="px-2 pt-2" :class="index % 2 !== 0 ? 'col-tien-trinh-1' : 'col-tien-trinh-2'">{{ index + 1 }}</td>
                  <td class="text-xs-left px-2 pt-2 pb-1">
                    <p class="mb-1"> <span>{{ item.createDate | dateTimeView }}</span> - <b>{{ item.author }}</b>: <span style="color: #0b72ba">{{ item.payload.stepName }}</span>
                    </p>
                    <p class="mb-1" v-if="item.content !== '' && item.content !== null">Ý kiến: <span v-html="item.content"></span></p>
                    <div v-for="(file, index) in item.payload.files" :key="index">
                      <p v-if="file.dossierFileId" class="history__download__link hover-pointer-download mb-1"
                        title="Tải xuống"
                        style="cursor: pointer;"
                        @click.prevent.stop="downloadFileLogs(file.dossierFileId)"
                        >
                        <v-icon>file_download</v-icon> 
                        <span>{{file.fileName}}</span>
                      </p>
                      <p v-if="file.dossierDocumentId" class="history__download__link hover-pointer-download mb-1"
                        title="Tải xuống"
                        style="cursor: pointer;"
                        @click.prevent.stop="downloadFileDocument(file.dossierReferenceUid ? file.dossierReferenceUid : '')"
                        >
                        <v-icon>file_download</v-icon> 
                        <span>{{file.fileName}}</span>
                      </p>
                    </div>
                </td>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </div>
    </div>
    <!-- plugin ký số -->
    <object id="plugin0" type="application/x-cryptolib05plugin" width="0" height="0"></object>
    <!--  -->
    <div style="display: none">
      <input id="dossierId_hidden" type="text" :value="thongTinChiTietHoSo.dossierId">
      <input id="dossierStatus_hidden" type="text" :value="thongTinChiTietHoSo.dossierStatus">
      <input id="dossierSubStatus_hidden" type="text" :value="thongTinChiTietHoSo.dossierSubStatus">
    </div>
    <!--  -->
    <v-dialog v-model="dialog_reAsign" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Chọn người thực hiện</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_reAsign = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <phan-cong-lai ref="phanconglai" v-model="reAsignUsers" :type="1"></phan-cong-lai>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click="doReAsign()"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>how_to_reg</v-icon> &nbsp;
            Đồng ý
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn class="mr-3" color="primary" @click.native="dialog_reAsign = false">
            <v-icon>reply</v-icon> &nbsp;
            Hủy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPlugin" persistent :overlay="false" :max-width="800" style="overflow: hidden;" transition="dialog-transition">
      <v-card>
        <v-card-title class="px-0 py-0">
          <v-toolbar dark color="primary" height="40">
            <div class="text-bold" v-if="modelPlugin !== null && modelPlugin !== undefined">{{modelPlugin['pluginName']}}</div>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark @click.native="dialogPlugin = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="pr-0 py-0">
          <div v-if="modelPlugin === null" style="width: 100%; height: 400px;" class="text-xs-center center-all">
            <v-progress-circular indeterminate v-bind:size="100" color="purple"></v-progress-circular>
          </div>
          <div v-else-if="modelPlugin.pending">
            Hồ sơ chờ đồng bộ ...
          </div>
          <div v-else-if="modelPlugin['plugin']">
            <div v-if="modelPlugin.pdf">
              <div class="flex xs12 sm12 text-center">
                <object id="dossierPDFViewPlugin" data="" width="100%" height="100%" v-if="!modelPlugin.no_pdf">
                  <iframe :src="modelPlugin.url" width="100%" style="min-height: 500px !important; padding-left: 0;"> </iframe>
                </object>
                <div id="dossierPDFViewNotFound" class="text-center">{{ modelPlugin.no_pdf }}</div>
              </div>
            </div>

            <div v-if="modelPlugin['html']">
              <input type="hidden" id="dossierFilePartNo" class="dossierFilePartNo" name="">
              <div id="alpacajs_form_plugin" class="expansion-panel__header"></div>
              <div id="dossierAlpacaNotFound" class="text-center">{{ modelPlugin.no_html }}</div>
            </div> 
          </div>
          <div v-else>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNew.vue'
import TaiLieuChungThuc from './TiepNhan/TaiLieuChungThuc.vue'
import EditDate from './form_xu_ly/EditDate.vue'
import ExtendDateEdit from './form_xu_ly/ExtendDateEdit.vue'
import HoSoLienThong from './HoSoLienThong.vue'
import PhanCongLai from './form_xu_ly/PhanCongLai.vue'
import ThongTinBuuChinh from './form_xu_ly/ThongTinGuiBuuChinh.vue'
// import mermaid from 'mermaid'
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
    'tai-lieu-chung-thuc': TaiLieuChungThuc,
    'ngay-hen-tra': EditDate,
    'thong-tin-buu-chinh': ThongTinBuuChinh,
    'ngay-gia-han': ExtendDateEdit,
    'chi-tiet-thanh-toan': ChiTietThanhToan,
    'ho-so-lien-thong': HoSoLienThong,
    'phan-cong-lai': PhanCongLai
  },
  data: () => ({
    sourcePaymentFee: {},
    loadingActionProcess: false,
    votingVersion: 1,
    confirmGuiHoSoTrucTuyen: false,
    viTriLuuTru: false,
    docLuuTru: [],
    validTraoDoi: false,
    isMobile: false,
    inputTypes: [1, 3, 6],
    inputTypesLienThong: [1, 2, 3, 6, 7],
    outputTypes: [2, 7],
    actionIdCurrent: 0,
    validateAction: true,
    btnIndex: -1,
    processActionCurrent: 0,
    activeTab: 'tabs-1',
    activeTab2: '',
    btnDossierDynamics: [],
    btnStepsDynamics: [],
    loadingAction: false,
    loadingNextAction: false,
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
    thongTinChiTietHoSo: {},
    dialogPDF: false,
    dialogPDFLoading: false,
    loadingDownload: false,
    loadingAlpacajsForm: false,
    nextActions: [],
    createFiles: [],
    returnFiles: [],
    processSteps: [],
    documents: [],
    payments: '',
    paymentsOriginal: '',
    dossierActions: [],
    dossierImportActions: [],
    reAsignUsers: [],
    showReasign: false,
    thaoTacUyQuyen: false,
    thaoTacPhanCongLai: true,
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
    filesPdfSign: [
      {fileName: 'Tài liệu ký duyệt 001', time: '20/08/2019 11:20:30', url: 'http://103.101.163.17:8080/documents/35166/0/testKS.pdf', fileSigned: false},
      {fileName: 'Tài liệu ký duyệt 002', time: '21/08/2019 10:10:13',url: 'http://103.101.163.17:8080/documents/35166/0/testKS.pdf', fileSigned: false}
    ],
    typeEsign: '',
    preCondition: '',
    showTraKetQua: false,
    showThanhPhanLienThong: false,
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
    roleGroupPhanCong: [],
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
    detailPreAction: '',
    showMenuActionKhac: true,
    headers: [
      {
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
      }
    ],
    headersSequencyImport: [
      {
        text: '#',
        align: 'center',
        sortable: false
      }, {
        text: 'Công việc',
        align: 'center',
        sortable: false,
        class: 'congviec_column'
      }, {
        text: 'Người thực hiện',
        align: 'center',
        sortable: false,
        class: 'nguoithuchien_column'
      }, {
        text: 'Ngày bắt đầu',
        align: 'center',
        sortable: false,
        class: 'ngaybatdau_column'
      }, {
        text: 'Ngày kết thúc',
        align: 'center',
        sortable: false,
        class: 'ngayketthuc_column'
      }, {
        text: 'Ghi chú',
        align: 'center',
        sortable: false,
        class: 'ghichu_column'
      }
    ],
    headerSyncs: [
      {
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
      }
    ],
    filterDossierAction: null,
    filterDossierSyncItems: [{
      text: 'Tất cả',
      value: '1,2'
    }, {
      text: 'Thông tin trao đổi',
      value: '2'
    }
    ],
    filterDossierSync: null,
    messageChat: '',
    isCallBack: true,
    printDocument: false,
    printInvoicefilePayment: false,
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
    loadingVoting: false,
    titleDialogPdf: 'Tài liệu đính kèm',
    viewScript: false,
    loadingForm: false,
    hasPreviewSync: false,
    isNotarization: false,
    sequencyDossierImport: false,
    mauCongVan: '',
    reRender: true,
    activeReload: false,
    srcDownloadIframe: '',
    itemAction: '',
    hasDownloadAllFile: false,
    sendInvoice: false,
    removeInvoice: false,
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      email: (value) => {
        value = value.trim()
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
        if(typeof value === 'string'){
          value = value.trim()
        }
        return pattern.test(value) || 'Gồm các ký tự 0-9'
      },
      varchar100: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 100 ? true : 'Không được nhập quá 100 ký tự'   
        } else {
          return true
        }  
      },
      varchar255: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 255 ? true : 'Không được nhập quá 255 ký tự'   
        } else {
          return true
        }  
      },
      varchar500: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 500 ? true : 'Không được nhập quá 500 ký tự'   
        } else {
          return true
        }  
      },
      varchar5000: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
        } else {
          return true
        }
      },
    },
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    visibleDoAction () {
      return this.$store.getters.getVisibleDoAction
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
    },
    menuConfigs () {
      return this.$store.getters.getMenuConfigsTodo
    },
    dossierTemplateLienThong () {
      return this.$store.getters.getDossierTemplateLienThong
    },
    createFileSignedSync () {
      return this.$store.getters.getCreateFileSigned
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    let vm = this
    vm.onResize()
    window.addEventListener('resize', vm.onResize, { passive: true })
    $('#m-navigation').css('display', 'none')
    if (vm.originality === 3) {
      vm.runComment()
    }
  },
  created () {
    let vm = this
    try {
      vm.votingVersion = votingVersion
    } catch (error) {
    }
    try {
      vm.hasPreviewSync = hasPreviewSync
    } catch (error) {
    }
    try {
      vm.hasDownloadAllFile = hasDownloadAllFile
    } catch (error) {
    }
    try {
      vm.viTriLuuTru = viTriLuuTru
    } catch (error) {
    }
    try {
      vm.confirmGuiHoSoTrucTuyen = confirmGuiHoSoTrucTuyen
    } catch (error) {
    }
    window.toastr = toastr
    vm.$nextTick(function () {
      $('#m-navigation').css('display', 'none')
      // console.log('meunconfig created', vm.menuConfigs, vm.index)
      if (vm.menuConfigs && vm.menuConfigs[vm.index] && vm.menuConfigs[vm.index]['hasViewText']) {
        vm.viewScript = true
        vm.loadingForm = true
        let filter = {
          menuGroup: vm.menuConfigs[vm.index]['id']
        }
        vm.$store.dispatch('getScriptViewDetail', filter).then(function (data) {
          vm.loadingForm = false
          let formScript, formData
          formScript = eval('(' + data + ')')
          vm.$store.dispatch('getDetailDossier', vm.id).then(resultDossier => {
            vm.thongTinChiTietHoSo = resultDossier
            formData = resultDossier
            formScript.data = formData
            window.$('#formScriptTemplate').alpaca(formScript)
          }).catch(function () {
            window.$('#formScriptTemplate').alpaca(formScript)
          })
        }).catch(function () {
          vm.loadingForm = false
        })
      } else {
        vm.viewScript = false
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
        }
        vm.$store.commit('setKysoSuccess', false)
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  beforeDestroy () {
    let viewport = $('meta[name="viewport"]')
    viewport.attr('content', 'initial-scale=1.0, width=device-width')
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
    },
    menuConfigs (val) {
      let vm = this
      console.log('menuconfig watch 123', vm.menuConfigs, vm.index)
      if (val) {
        if (vm.menuConfigs && vm.menuConfigs[vm.index]['hasViewText']) {
          vm.viewScript = true
          vm.loadingForm = true
          let filter = {
            menuGroup: vm.menuConfigs[vm.index]['id']
          }
          vm.$store.dispatch('getScriptViewDetail', filter).then(function (data) {
            vm.loadingForm = false
            let formScript, formData
            formScript = eval('(' + data + ')')
            vm.$store.dispatch('getDetailDossier', vm.id).then(resultDossier => {
              vm.thongTinChiTietHoSo = resultDossier
              formData = resultDossier
              formScript.data = formData
              window.$('#formScriptTemplate').alpaca(formScript)
            }).catch(function () {
              window.$('#formScriptTemplate').alpaca(formScript)
            })
          }).catch(function () {
            vm.loadingForm = false
          })
        } else {
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
          }
          vm.$store.commit('setKysoSuccess', false)
        }
      }
    },
    isMobile (val) {
      let viewport = $('meta[name="viewport"]')
      if (val) {
        viewport.attr('content', '')
      } else {
        viewport.attr('content', 'initial-scale=1.0, width=device-width')
      }
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
    },
    visibleDoAction (val) {
      this.loadingActionProcess = false
    }
  },
  methods: {
    onResize () {
      let vm = this
      let isMobile = window.innerWidth < 1264
      vm.isMobile = isMobile
    },
    initData (data) {
      var vm = this
      vm.dossierId = data
      vm.activeTab2 = 'tabs-2b'
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.thongTinChiTietHoSo = resultDossier
        if (vm.thongTinChiTietHoSo.hasOwnProperty('dossierSyncState') && String(vm.thongTinChiTietHoSo.dossierSyncState) === '1') {
          vm.activeReload = true
          vm.reloadDetailDossier()
        } else {
          vm.activeReload = false
        }
        vm.loadDetailTempalte()
        vm.loadThanhToan()
        if (vm.originality === 3) {
          vm.loadHoSoLienThong()
        }
        vm.getNextActions()
        vm.getPreAction()
        if (resultDossier['dossierSubStatus']) {
          vm.$store.dispatch('pullBtnConfigStep', resultDossier).then(result => {
            vm.btnStepsDynamics = result
            if (vm.btnStepsDynamics.length > 0) {
              vm.btnStepsDynamics = vm.btnStepsDynamics.filter(function (item) {
                return !item.hasOwnProperty('roleCode') || (item.hasOwnProperty('roleCode') && vm.getUser(item.roleCode))
              })
              // bỏ thao tác sửa hồ sơ tk trung tâm
              let currentQuery = vm.$router.history.current.query
              if (currentQuery.hasOwnProperty('groupIdSiteMng')) {
                vm.btnStepsDynamics = vm.btnStepsDynamics.filter(function (item) {
                  return item.form !== 'UPDATE'
                })
              }
              // 
            }
            if (vm.btnStepsDynamics.filter(function(item) {
              return item.form !== 'UPDATE'
            }).length === 0) {
              vm.showMenuActionKhac = false
            }
            
          })
        } else {
          vm.showMenuActionKhac = false
        }
        if (vm.originality === 1 && resultDossier['dossierStatus'] === 'done') {
          vm.activeTab2 = 'tabs-1b'
          vm.loadVoting()
        }
        if (vm.originality === 1 && resultDossier['dossierStatus'] === 'new') {
          vm.activeTab2 = 'tabs-3b'
          vm.loadDossierLogs()
        }
        if (vm.originality === 3) {
          vm.runComment()
        }
        // vm.$store.dispatch('loadDossierDocuments', resultDossier).then(resultDocuments => {
        //   if (Array.isArray(resultDocuments)) {
        //     vm.documents = resultDocuments
        //   } else {
        //     vm.documents.push(resultDocuments)
        //   }
        // })
        vm.$store.dispatch('getListDossierFiles', data).then(result => {
          vm.listDossierFiles = result
        })
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: resultDossier.serviceCode
        }).then(function (res) {
          if (res.hasOwnProperty('isNotarization') && String(res.isNotarization) === 'true') {
            vm.isNotarization = true
          } else {
            vm.isNotarization = false
            if (vm.$refs.thanhphanhoso) {
              vm.$refs.thanhphanhoso.initData(resultDossier)
            }
          }
        })
        if (vm.viTriLuuTru) {
          vm.loadDocumentLuuTru()
        }
      })
    },
    loadDetailTempalte () {
      let vm = this
      let filter = {
        dossierTemplateNo: vm.thongTinChiTietHoSo.dossierTemplateNo
      }
      vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result) {
        vm.mauCongVan = result['newFormScript'] && result['newFormScript'].startsWith('MAU_CV_') ? result['newFormScript'] : '' 
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
      this.$store.dispatch('downloadFile', dataCommit).then(function (result) {
        if (result) {
          vm.dialogPDFLoading = false
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      })
    },
    downloadFileDocument(data) {
      var vm = this
      let dataCommit = {
        referenceUid: data,
        dossierId: vm.id
      }
      vm.$store.dispatch('downloadFileDocument', dataCommit).then(function (result) {
        if (result) {
          vm.dialogPDFLoading = false
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      })
    },
    loadDossierActions (data) {
      var vm = this
      let submissionNote = ''
      try {
        submissionNote = vm.thongTinChiTietHoSo['submissionNote'] ? JSON.parse(vm.thongTinChiTietHoSo['submissionNote']) : ''
      } catch (error) {
      }
      if (submissionNote && submissionNote.hasOwnProperty('dossierImport') && submissionNote.dossierImport) {
        vm.sequencyDossierImport = true
        vm.dossierImportActions = submissionNote['data']
      } else {
        vm.sequencyDossierImport = false
        if (vm.thongTinChiTietHoSo.dossierId) {
          let dataParams = {
            dossierId: vm.thongTinChiTietHoSo.dossierId,
            stepType: data
          }
          vm.$store.dispatch('loadDossierActions', dataParams).then(resultActions => {
            if (resultActions.data && resultActions.data.length !== 0) {
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
            } else {
              if (vm.thongTinChiTietHoSo['submissionNote']) {
                try {
                  JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])
                  let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote']).data
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
                } catch (e) {
                }
              }
            }
          }).catch(function () {
            if (vm.thongTinChiTietHoSo['submissionNote']) {
              try {
                JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])
                let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote']).data
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
              } catch (e) {
              }
            }
          })
        }
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
          setTimeout(function () {
            window.svgPanZoom('#theGraph', {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.1
            })
          }, 500)
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
    previewTienTrinh () {
      let vm = this
      let data = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      vm.dialogPDFLoading = true
      vm.$store.dispatch('previewTienTrinh', data).then(function (result) {
        vm.dialogPDFLoading = false
        vm.titleDialogPdf = 'Tiến trình thụ lý'
        vm.dialogPDF = true
        document.getElementById('dialogPDFPreviewXl').src = result
      }).catch(function () {
        vm.dialogPDFLoading = false
      })
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
      if(vm.$refs.formTraoDoi.validate()){
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
        } else {
           toastr.error('Chưa nhập dữ liệu trao đổi')
        }
      } else {
        toastr.error('Dữ liệu trao đổi không hợp lệ')
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
      vm.showThanhPhanLienThong = false
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
      if (result.hasOwnProperty('configNote') && result.configNote && result.configNote !== null && result.configNote !== undefined && result.configNote !== 'undefined') {
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
        result.hasOwnProperty('payment') || result.hasOwnProperty('checkInput') || result.hasOwnProperty('overdue') || result.hasOwnProperty('betimes') || result.hasOwnProperty('preoverdue'))) {
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
          if (result.hasOwnProperty('postProcessStepRole') && result.postProcessStepRole) {
            if (Array.isArray(result.postProcessStepRole)) {
              vm.roleGroupPhanCong = result.postProcessStepRole
            } else {
              vm.roleGroupPhanCong = [result.postProcessStepRole]
            }
            vm.roleGroupPhanCong = vm.roleGroupPhanCong.map(item => {
              item = Object.assign(item, {assigned: 0})
              return item
            })
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
          if (result.hasOwnProperty('signatureType') && (result.signatureType === 'plugin' || result.signatureType === 'pluginAndHSM' || result.signatureType === 'hsm')) {
            vm.typeEsign = result.signatureType
            vm.preCondition = result.preCondition
          }
        }
        if (result.hasOwnProperty('eSignature') && result.eSignature && result.signatureType !== 'plugin' && result.signatureType !== 'pluginAndHSM' && result.signatureType !== 'hsm') {
          isPopup = true
          vm.showKyPheDuyetTaiLieu = true
          vm.dataEsign = result
          vm.typeEsign = result.signatureType
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
        if (result.hasOwnProperty('dossierParts') && result.dossierParts !== null && result.dossierParts !== undefined && result.dossierParts !== 'undefined') {
          isPopup = true
          if (Array.isArray(result.dossierParts)) {
            vm.dossierParts = result.dossierParts
          } else {
            vm.dossierParts = [result.dossierParts]
          }
          vm.showThanhPhanLienThong = true
          setTimeout(function () {
            vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
          }, 200)
        }
        if (result.hasOwnProperty('preCondition') && result.preCondition !== null && result.preCondition !== undefined && result.preCondition !== 'undefined' && result.preCondition.indexOf('sendViaPostal=1') >= 0) {
          isPopup = true
          vm.showPostalService = true
        }
        if (result.hasOwnProperty('preCondition') && result.preCondition !== null && result.preCondition !== undefined && result.preCondition !== 'undefined' && result.preCondition.indexOf('sendInvoiceVNPT=1') >= 0) {
          vm.sendInvoice = true
        }
        if (result.hasOwnProperty('preCondition') && result.preCondition !== null && result.preCondition !== undefined && result.preCondition !== 'undefined' && result.preCondition.indexOf('destroyInvoiceVNPT=1') >= 0) {
          vm.removeInvoice = true
        } else {
          vm.removeInvoice = false
        }
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0) {
          // add thanh toán điện tử
          // nghiepvuhanghai
          // if (vm.originality == '1' && (result.payment.requestPayment == 3 || result.payment.requestPayment == 5) && vm.paymentDetail && vm.paymentDetail['paymentStatus'] != 3 && vm.paymentDetail['paymentStatus'] != 5) {
          if (vm.originality == '1' && (result.payment.requestPayment == 3 || result.payment.requestPayment == 5)) {
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
            try {
              if (result.hasOwnProperty('paymentFee') && result.paymentFee) {
                vm.sourcePaymentFee = ''
                let configs = JSON.parse(result.paymentFee)
                vm.sourcePaymentFee = configs.hasOwnProperty('source') ? configs['source'] : {}
              } else {
                vm.sourcePaymentFee = {}
              }
            } catch (error) {
            }
            vm.showThuPhi = true
            vm.paymentsOriginal = result.payment
            let dataJson = ''
            try {
              dataJson = JSON.parse(result.payment['paymentNote'])
              if (dataJson) {
                dataJson = Object.assign(dataJson, {
                  editable: result.payment['editable'],
                  requestPayment: result.payment['requestPayment']
                })
              }
            } catch (error) {
            }
            if (dataJson) {
              vm.payments = Object.assign(result.payment, dataJson)
            } else {
              vm.payments = result.payment
            }
            vm.viaPortalDetail = dossierItem.viaPostal
          }
        }
        if ((result.hasOwnProperty('receiving') && result.receiving !== null && result.receiving !== undefined && result.receiving !== 'undefined' && result.receiving.editable === true)) {
          isPopup = true
          vm.showEditDate = true
          vm.dueDateEdit = result.receiving.dueDate !== '' && result.receiving.dueDate !== 0 ? new Date(result.receiving.dueDate) : ''
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
      // 
      let doAction = function () {
        vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
          vm.loadingActionProcess = false
          vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, item, result, index)
        }).catch(function (reject) {
          vm.loadingAction = false
          vm.loadingActionProcess = false
        })
      }
      if (vm.originality === 1 && vm.confirmGuiHoSoTrucTuyen && item.actionCode == 1300) {
        let x = confirm('Bạn có chắc chắn muốn gửi hồ sơ?')
        if (x) {
          doAction()
        } else {
          vm.loadingAction = false
          vm.dialogActionProcess = false
          vm.loadingActionProcess = false
        }
      } else {
        doAction()
      }
      
    },
    btnActionEvent (item, index) {
      let vm = this
      vm.btnIndex = -1
      vm.itemAction = item
      vm.indexAction = index
      if (item && item.title) {
        vm.titleDialogPdf = item.title;
      } else {
        vm.titleDialogPdf = "Tài liệu đính kèm"
      }
      if (String(item.form) === 'UPDATE') {
        let query = vm.$router.history.current.query
        query['template_no'] = vm.thongTinChiTietHoSo.dossierTemplateNo
        query['serviceCode'] = vm.thongTinChiTietHoSo.serviceCode
        vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + vm.thongTinChiTietHoSo.dossierId + '/' + vm.itemAction.form,
          query: query
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
      vm.srcDownloadIframe = ''
      vm.$store.dispatch('doPrint01', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreviewXl').src = result
        vm.srcDownloadIframe = result
      })
    },
    exportDoc () {
      let vm = this
      console.log('itemAction', vm.itemAction)
      if (vm.itemAction.form === 'PRINT_01') {
        let filter = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          document: vm.itemAction.document,
          reportType: 'word'
        }
        vm.$store.dispatch('doPrint01', filter).then(function (result) {
        }).catch(function (){})
      } else if (vm.itemAction.form === 'PRINT_02') {
        let filter2 = {
          document: vm.itemAction.document,
          dossiers: JSON.stringify(vm.selected),
          reportType: 'word'
        }
        vm.$store.dispatch('doPrint02', filter2).then(function (result) {
        }).catch(function (){})
      }
      
    },
    doPreview (dossierItem, item, index) {
      let vm = this
      vm.dialogPDFLoading = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        if (result !== 'pending') {
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      }).catch(function () {
        vm.dialogPDFLoading = false
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
      vm.loadingAction = true
      vm.$store.dispatch('rollBack', params).then(resRollBack => {
        setTimeout(function () {
          vm.loadingAction = false
          vm.getNextActions()
          vm.rollbackable = false
          vm.dialogActionProcess = false
          vm.btnStateVisible = true
        }, 500)
      }).catch(reject => {
        vm.loadingAction = false
        vm.alertObj = {
          icon: 'error',
          color: 'error',
          message: 'Trả lại bước trước không thành công!'
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
        let x = confirm('Bạn có chắc chắn thực hiện hành động này?')
        if (x) {
          let fiter = {
            dossierId: vm.thongTinChiTietHoSo.dossierId
          }
          vm.$store.dispatch('rollBack', fiter).then(function (result) {
          }).catch(function () {
          })
        }
      }
    },
    // Hàm xử lý Actions
    processAction (dossierItem, item, result, index, isConfirm) {
      let vm = this
      if (vm.loadingActionProcess) {
        return
      }
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
        originality: vm.originality,
        thongtinhoso: dossierItem,
        dossierId: dossierItem.dossierId,
        actionCode: result.actionCode,
        actionUser: actionUser
      }
      if (vm.showPhanCongNguoiThucHien) {
        if (vm.type_assign === 6 || vm.type_assign === 7 || vm.type_assign === 8 || vm.type_assign === 9) {
          filter['toUsers'] = vm.$refs.phancong.getToUsersExport()
        } else {
          filter['toUsers'] = vm.assign_items
        }
        
        let result = vm.$refs.phancong.doExport()
        if (result) {
          validPhanCong = true
        } else {
          if (vm.type_assign === 3 || vm.type_assign === 4) {
            if (vm.reAsignUsers.filter(function (item) {
              return Number(item.assigned) > 0
            }).length > 0) {
              validPhanCong = true
            } else {
              validPhanCong = false
            }
          } else {
            validPhanCong = false
          }
        }
        if (!validPhanCong) {
          let title = vm.type_assign === 6 || vm.type_assign === 7 || vm.type_assign === 8 || vm.type_assign === 9 ? 'Vui lòng chọn phòng ban thực hiện' : 'Vui lòng chọn người thực hiện'
          toastr.error(title)
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
          shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, '')),
          paymentFee: vm.payments['paymentFee']
        }
        if (vm.payments['paymentMethod']) {
          paymentsOut['paymentMethod'] = vm.payments['paymentMethod']
        }
      }
      if (vm.showThuPhi) {
        if (vm.payments && vm.payments.hasOwnProperty('counter')) {
          let dataNote = {
            requestPayment: vm.payments['requestPayment'],
            paymentNote: vm.payments['paymentNote'],
            advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
            feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
            serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
            shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, '')),
            counter: vm.payments.counter,
            paymentFee: vm.payments['paymentFee']
          }
          if (vm.payments['paymentMethod']) {
            dataNote['paymentMethod'] = vm.payments['paymentMethod']
          }
          paymentsOut.feeAmount = paymentsOut.feeAmount*vm.payments.counter
          paymentsOut.serviceAmount = paymentsOut.serviceAmount*vm.payments.counter
          paymentsOut.shipAmount = paymentsOut.shipAmount*vm.payments.counter
          paymentsOut.paymentNote = dataNote ? JSON.stringify(dataNote) : paymentsOut.paymentNote
        }
        filter['payment'] = paymentsOut
        console.log('payment99999', filter['payment'])
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
        let paymentData = vm.$store.getters.getPaymentProfile
        if (paymentData && paymentData['paymentFile'] && valid) {
          validThanhToanDienTu = true
          filter['payment'] = {
            requestPayment: 3,
            advanceAmount: paymentData.advanceAmount ? paymentData.advanceAmount : 0,
            feeAmount: paymentData.feeAmount ? paymentData.feeAmount : 0,
            paymentAmount: paymentData.paymentAmount ? paymentData.paymentAmount : 0,
            paymentNote: paymentData.paymentNote ? paymentData.paymentNote : '',
            serviceAmount: paymentData.serviceAmount ? paymentData.serviceAmount : 0,
            shipAmount: paymentData.shipAmount ? paymentData.shipAmount : 0,
            paymentMethod: paymentData.paymentMethod ? paymentData.paymentMethod : 'Chuyển khoản',
            paymentFee: paymentData.paymentFee ? paymentData.paymentFee : '',
          }
          let paymentsOut = filter['payment']
          // console.log('payment data check', paymentsOut)
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
        let payload = {
          'dueDate': date,
          'receiveDate': vm.receiveDateEdit
        }
        if (filter.hasOwnProperty('payload')) {
          filter['payload'] = Object.assign(filter['payload'], payload)
        } else {
          filter['payload'] = payload
        }
        
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
        if (filter.hasOwnProperty('payload')) {
          filter['payload'] = Object.assign(filter['payload'], payload)
        } else {
          filter['payload'] = payload
        }
      }
      if (vm.showFormBoSungThongTinNgan) {
        let payload = vm.$refs.formBoSungThongTinNgan.formSubmitData()
        if (filter.hasOwnProperty('payload')) {
          filter['payload'] = Object.assign(filter['payload'], payload)
        } else {
          filter['payload'] = payload
        }
        let validation = vm.$refs.formBoSungThongTinNgan.checkValid()
        if (validation) {
          validFormBoSung = true
        } else {
          validFormBoSung = false
          vm.loadingAction = false
          return
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
      if (vm.showTaoTaiLieuKetQua) {
        validCreateFiles = vm.$refs.tailieuketqua.validCreateFileTemplate()
        if (!validCreateFiles) {
          vm.loadingAction = false
          return
        }
      }
      if (vm.showKyPheDuyetTaiLieu) {
        vm.loadingActionProcess = false
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
      if (vm.showThanhPhanLienThong) {
        let payload = {
          'dossierParts': vm.dossierTemplateLienThong.toString()
        }
        if (filter.hasOwnProperty('payload')) {
          filter['payload'] = Object.assign(filter['payload'], payload)
        } else {
          filter['payload'] = payload
        }
      }
      if (validPhanCong && validYKien && validTreHan && validThanhToanDienTu && validFormBoSung && validCreateFiles) {
        vm.validateAction = true
      } else {
        vm.validateAction = false
      }
      vm.dossierId = dossierItem.dossierId
      let currentQuery = vm.$router.history.current.query
      vm.loadingActionProcess = true
      // case confirm Thao tác từ trang danh sách hồ sơ
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
            try {
              currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
              currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
            } catch (error) {
            }
            vm.$router.push({
              path: vm.$router.history.current.path,
              query: currentQuery
            })
          }).catch(function (reject) {
            vm.loadingAction = false
            vm.loadingActionProcess = false
          })
          // Thực hiện ủy quyền trong phân công
          // if (vm.showPhanCongNguoiThucHien && (vm.type_assign === 3 || vm.type_assign === 4)) {
          //   let data_delegacy = vm.$refs.phancong.getDataDelegacy()
          //   console.log('data_delegacy', data_delegacy)
          //   let filter = {
          //     'dossierId': vm.thongTinChiTietHoSo.dossierId,
          //     'users': data_delegacy
          //   }
          //   vm.$store.dispatch('postDossierUserAsign', filter).then(function (result) {
          //   }).catch(function (error) {
          //   })
          // }
        } else {
          return false
        }
      }
      // case Thao tác trong chi tiết hồ sơ
      else if (vm.validateAction) {
        if (vm.checkInput === 2 && vm.$refs.thanhphanhoso !== null && vm.$refs.thanhphanhoso !== undefined && vm.$refs.thanhphanhoso !== 'undefined') {
          var valid = vm.$refs.thanhphanhoso.validDossierTemplate()
          if (!valid) {
            vm.loadingAction = false
            vm.loadingActionProcess = false
            return
          }
        }
        vm.loadingActionProcess = true
        // tách riêng case sử dụng ký số
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
                // chưa có file, tự động tạo
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
                  } else {
                    vm.loadingAction = false
                    vm.loadingActionProcess = false
                    alert('Chưa có tài liệu ký duyệt')
                  }
                }
              } else {
                var paymentsOut = ''
                // check phí = 0 => show cảnh báo
                if (vm.showThuPhi) {
                  paymentsOut = {
                    requestPayment: vm.payments['requestPayment'],
                    paymentNote: vm.payments['paymentNote'],
                    advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                    feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                    serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                    shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, '')),
                    paymentFee: vm.payments['paymentFee']
                  }
                  if (vm.payments['paymentMethod']) {
                    paymentsOut['paymentMethod'] = vm.payments['paymentMethod']
                  }
                  if (vm.payments && vm.payments.hasOwnProperty('counter')) {
                    let dataNote = {
                      requestPayment: vm.payments['requestPayment'],
                      paymentNote: vm.payments['paymentNote'],
                      advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                      feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                      serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                      shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, '')),
                      counter: vm.payments.counter,
                      paymentFee: vm.payments['paymentFee']
                    }
                    if (vm.payments['paymentMethod']) {
                      dataNote['paymentMethod'] = vm.payments['paymentMethod']
                    }
                    paymentsOut.feeAmount = paymentsOut.feeAmount*vm.payments.counter
                    paymentsOut.serviceAmount = paymentsOut.serviceAmount*vm.payments.counter
                    paymentsOut.shipAmount = paymentsOut.shipAmount*vm.payments.counter
                    paymentsOut.paymentNote = dataNote ? JSON.stringify(dataNote) : paymentsOut.paymentNote
                  }
                  resultAction['payment'] = paymentsOut
                  console.log('payment99999', resultAction['payment'])
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
          // case không sử dụng ký số
          // Thực hiện ủy quyền trong phân công
          if (vm.showPhanCongNguoiThucHien && (vm.type_assign === 3 || vm.type_assign === 4)) {
            let data_delegacy = vm.$refs.phancong.getDataDelegacy()
            console.log('data_delegacy', data_delegacy)
            let filter2 = {
              'dossierId': vm.thongTinChiTietHoSo.dossierId,
              'users': data_delegacy,
              'delegacy': 1
            }
            vm.$store.dispatch('postDossierUserAsign', filter2).then(function (result) {
              // Chỉ chuyển bước khi có chọn người thực hiện (Mr Duẩn)
              if (filter['toUsers'] && filter['toUsers'].filter(function (item) {
                return Number(item.assigned) > 0
              }).length > 0 ) {
                // A15
                let callBack = function () {
                  vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
                    vm.getDetailDossier()
                    if (vm.originality === 3 && (vm.checkInput === 2 || vm.checkInput === '2')) {
                      vm.$store.dispatch('updateApplicantNote', vm.thongTinChiTietHoSo).then(function (result) {
                      })
                    }
                    if (filter['payment']) {
                      vm.loadThanhToan()
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
                    if (vm.showThuPhi && String(filter['payment']['requestPayment']) === '5') {
                      vm.printInvoicefilePayment = true
                      vm.printPay()
                    }
                    if (vm.thongTinChiTietHoSo.dossierStatus === 'new' && vm.originality === 1) {
                      vm.$router.push('/danh-sach-ho-so/' + vm.index + '/nop-thanh-cong/' + vm.thongTinChiTietHoSo.dossierId)
                    }
                    vm.checkInput = 0
                    vm.$store.commit('setCheckInput', 0)
                    if (String(item.form) === 'ACTIONS') {
                    } else {
                      try {
                        currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                        currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                      } catch (error) {
                      }
                      vm.$router.push({
                        path: vm.$router.history.current.path,
                        query: currentQuery
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
                if (vm.removeInvoice) {
                  let filterDel = {
                    dossierId: vm.thongTinChiTietHoSo['dossierId']
                  }
                  vm.$store.dispatch('deleleBienLai', filterDel).then(function (result) {
                    callBack()
                  }).catch(function () {
                    vm.loadingAction = false
                    vm.loadingActionProcess = false
                  })
                } else {
                  callBack()
                }
                
              } else {
                toastr.success('Yêu cầu thực hiện thành công')
                setTimeout (function () {
                  vm.goBack()
                }, 300)
              }
              
            }).catch(function (error) {
            })
          } else {
            // ký số với plugin cài đặt
            // check không sử dụng ký số trong quy trình có ký số
            // let doNotSign = false
            let requiredSign = false
            if (vm.showTaoTaiLieuKetQua && vm.typeEsign === 'plugin') {
              // doNotSign = vm.$refs.tailieuketqua.checkUseSign()
              requiredSign = vm.$refs.tailieuketqua.checkRequiredSignPlugin()
            }
            // chia 2 trường hợp cấu hình Bắt buộc ký số và Không bắt buộc ký số (cấu hình preCondition)
            if (requiredSign == true) {
              if (result.signatureType === 'plugin' && vm.showTaoTaiLieuKetQua) {
                console.log('file ký số', vm.createFileSignedSync)
                let hasIsSigned = false
                try {
                  hasIsSigned = vm.createFileSignedSync['createFiles'].filter(function(item) {
                    return item.isSigned
                  })
                } catch (error) {
                }
                let valid = true
                // chia 2 trường hợp có tài liệu đã ký và chưa có tài liệu nào được ký
                if (!vm.createFileSignedSync || !hasIsSigned || hasIsSigned.length === 0) {
                  console.log('TH1')
                  toastr.clear()
                  toastr.error('Chưa có tài liệu nào được ký duyệt')
                  vm.loadingAction = false
                  vm.loadingActionProcess = false
                } else {
                  console.log('TH1.2')
                  let fileChuaKy = []
                  let files = vm.createFileSignedSync.createFiles
                  var fileEntries = []
                  let dossierFiles = []
                  for (let index in files) {
                    if (
                      (!files[index]['isSigned'] && files[index]['fileSize'] && files[index]['fileType'].toLocaleLowerCase() === 'pdf' && !files[index]['eForm']) || 
                      (!files[index]['isSigned'] && files[index]['eForm'] && files[index]['fileSize'] && files[index]['createFileDossierPartEform'])
                    ) {
                      fileChuaKy.push(files[index]['displayName'])
                    } else {
                      if (files[index]['fileSize'] && files[index]['isSigned']) {
                        fileEntries.push(files[index]['fileEntryId'])
                        dossierFiles.push(files[index]['dossierFileId'])
                      }
                    }
                  }
                  let doActionKySo = function () {
                    let filterUpdateFile = {
                      dossierId: vm.thongTinChiTietHoSo['dossierId'],
                      fileEntries: fileEntries.toString(),
                      dossierFiles: dossierFiles.toString()
                    }
                    vm.$store.dispatch('updateFileKySoPlugin', filterUpdateFile).then(function () {
                      vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
                        vm.getDetailDossier()
                        if (vm.originality === 3 && (vm.checkInput === 2 || vm.checkInput === '2')) {
                          vm.$store.dispatch('updateApplicantNote', vm.thongTinChiTietHoSo).then(function (result) {
                          })
                        }
                        if (filter['payment']) {
                          vm.loadThanhToan()
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
                        if (vm.showThuPhi && String(filter['payment']['requestPayment']) === '5') {
                          vm.printInvoicefilePayment = true
                          vm.printPay()
                        }
                        if (vm.thongTinChiTietHoSo.dossierStatus === 'new' && vm.originality === 1) {
                          vm.$router.push('/danh-sach-ho-so/' + vm.index + '/nop-thanh-cong/' + vm.thongTinChiTietHoSo.dossierId)
                        }
                        vm.checkInput = 0
                        vm.$store.commit('setCheckInput', 0)
                        if (String(item.form) === 'ACTIONS') {
                        } else {
                          try {
                            currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                            currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                          } catch (error) {
                          }
                          vm.$router.push({
                            path: vm.$router.history.current.path,
                            query: currentQuery
                          })
                        }
                        $('html, body').animate({
                          scrollTop: 0
                        }, 500, 'linear')
                      }).catch(function (reject) {
                        vm.loadingAction = false
                        vm.loadingActionProcess = false
                      })
                    }).catch(function () {
                      toastr.error('Cập nhật kết quả xử lý thất bại')
                      vm.loadingAction = false
                      vm.loadingActionProcess = false
                    })
                  }
                  if (fileChuaKy.length > 0) {
                    let x = confirm('Tài liệu "' + fileChuaKy.toString() + '" chưa được ký duyệt, bạn có muốn tiếp tục?')
                    if (x) {
                      doActionKySo()
                    } else {
                      vm.loadingActionProcess = false
                    }
                  } else {
                    doActionKySo()
                  }
                }
              } else {
                // A15
                let callBackAction = function () {
                  vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
                    vm.getDetailDossier()
                    if (vm.originality === 3 && (vm.checkInput === 2 || vm.checkInput === '2')) {
                      vm.$store.dispatch('updateApplicantNote', vm.thongTinChiTietHoSo).then(function (result) {
                      })
                    }
                    if (filter['payment']) {
                      vm.loadThanhToan()
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
                    if (vm.showThuPhi && String(filter['payment']['requestPayment']) === '5') {
                      vm.printInvoicefilePayment = true
                      vm.printPay()
                    }
                    if (vm.thongTinChiTietHoSo.dossierStatus === 'new' && vm.originality === 1) {
                      vm.$router.push('/danh-sach-ho-so/' + vm.index + '/nop-thanh-cong/' + vm.thongTinChiTietHoSo.dossierId)
                    }
                    vm.checkInput = 0
                    vm.$store.commit('setCheckInput', 0)
                    if (String(item.form) === 'ACTIONS') {
                    } else {
                      try {
                        currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                        currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                      } catch (error) {
                      }
                      vm.$router.push({
                        path: vm.$router.history.current.path,
                        query: currentQuery
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
                if (vm.removeInvoice) {
                  let filterDel = {
                    dossierId: vm.thongTinChiTietHoSo['dossierId']
                  }
                  vm.$store.dispatch('deleleBienLai', filterDel).then(function (result) {
                    callBackAction()
                  }).catch(function () {
                    vm.loadingAction = false
                    vm.loadingActionProcess = false
                  })
                } else {
                  callBackAction()
                }
              }
            }
            // 
            if (requiredSign == false) {
              let hasIsSigned = false
              try {
                hasIsSigned = vm.createFileSignedSync['createFiles'].filter(function(item) {
                  return item.isSigned
                })
              } catch (error) {
              }
              let doAction = function () {
                vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
                  vm.getDetailDossier()
                  if (vm.originality === 3 && (vm.checkInput === 2 || vm.checkInput === '2')) {
                    vm.$store.dispatch('updateApplicantNote', vm.thongTinChiTietHoSo).then(function (result) {
                    })
                  }
                  if (filter['payment']) {
                    vm.loadThanhToan()
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
                  if (vm.showThuPhi && String(filter['payment']['requestPayment']) === '5') {
                    vm.printInvoicefilePayment = true
                    vm.printPay()
                  }
                  if (vm.thongTinChiTietHoSo.dossierStatus === 'new' && vm.originality === 1) {
                    vm.$router.push('/danh-sach-ho-so/' + vm.index + '/nop-thanh-cong/' + vm.thongTinChiTietHoSo.dossierId)
                  }
                  vm.checkInput = 0
                  vm.$store.commit('setCheckInput', 0)
                  if (String(item.form) === 'ACTIONS') {
                  } else {
                    try {
                      currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                      currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
                    } catch (error) {
                    }
                    vm.$router.push({
                      path: vm.$router.history.current.path,
                      query: currentQuery
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
              if (!vm.createFileSignedSync || !hasIsSigned || hasIsSigned.length === 0) {
                let filterUpdateFile = {
                  dossierId: vm.thongTinChiTietHoSo['dossierId'],
                  fileEntries: '',
                  dossierFiles: ''
                }
                vm.$store.dispatch('updateFileKySoPlugin', filterUpdateFile).then(function () {
                  if (vm.removeInvoice) {
                    let filterDel = {
                      dossierId: vm.thongTinChiTietHoSo['dossierId']
                    }
                    vm.$store.dispatch('deleleBienLai', filterDel).then(function (result) {
                      doAction()
                    }).catch(function () {
                      vm.loadingAction = false
                      vm.loadingActionProcess = false
                    })
                  } else {
                    doAction()
                  }
                }).catch(function () {
                  toastr.error('Cập nhật tài liệu kết quả thất bại')
                  vm.loadingAction = false
                  vm.loadingActionProcess = false
                })
              } else {
                let fileChuaKy = []
                let files = vm.createFileSignedSync.createFiles
                var fileEntries = []
                let dossierFiles = []
                for (let index in files) {
                  if (
                    (!files[index]['isSigned'] && files[index]['fileSize'] && files[index]['fileType'].toLocaleLowerCase() === 'pdf' && !files[index]['eForm']) || 
                    (!files[index]['isSigned'] && files[index]['eForm'] && files[index]['fileSize'] && files[index]['createFileDossierPartEform'])
                  ) {
                    fileChuaKy.push(files[index]['displayName'])
                  } else {
                    if (files[index]['fileSize'] && files[index]['isSigned']) {
                      fileEntries.push(files[index]['fileEntryId'])
                      dossierFiles.push(files[index]['dossierFileId'])
                    }
                  }
                }

                let filterUpdateFile = {
                  dossierId: vm.thongTinChiTietHoSo['dossierId'],
                  fileEntries: fileEntries.toString(),
                  dossierFiles: dossierFiles.toString()
                }
                vm.$store.dispatch('updateFileKySoPlugin', filterUpdateFile).then(function () {
                  doAction()
                }).catch(function () {
                  toastr.error('Cập nhật kết quả xử lý thất bại')
                  vm.loadingAction = false
                  vm.loadingActionProcess = false
                })
              }
            }
            
          }
        }
      } else if (!vm.validateAction) {
        vm.loadingActionProcess = false
      }
    },
    kyDuyetPlugin () {
      let vm = this
      console.log('file ký số', vm.createFileSignedSync)
      if (!vm.createFileSignedSync) {
        toastr.clear()
        toastr.error('Chưa có tài liệu nào được ký duyệt')
        return false
      } else {
        let files = vm.createFileSignedSync.createFiles
        let fileEntries = []
        let dossierFiles = []
        for (let index in files) {
          if (!files[index]['isSigned']) {
            toastr.clear()
            toastr.error(files[index]['displayName'] + ' chưa được ký duyệt')
            return false
          } else {
            if (files[index]['fileSize']) {
              fileEntries.push(files[index]['fileEntryId'])
              dossierFiles.push(files[index]['dossierFileId'])
            }
          }
        }
        console.log('fileEntries 12312', fileEntries, dossierFiles)
        let filter = {
          dossierId: vm.thongTinChiTietHoSo['dossierId'],
          fileEntries: fileEntries.toString(),
          dossierFiles: dossierFiles.toString()
        }
        vm.$store.dispatch('updateFileKySoPlugin', filter)
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
        vm.srcDownloadIframe = ''
        vm.$store.dispatch('doPrint02', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreviewXl').src = result
          vm.srcDownloadIframe = result
        })
      }
    },
    doPrint03 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        if (result !== 'pending') {
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      }).catch(function () {
        vm.dialogPDFLoading = false
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
          document.getElementById('dialogPDFPreviewXl').src = result
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
        try {
          currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
          currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
        } catch (error) {
        }
        vm.$router.push({
          path: vm.$router.history.current.path,
          query: currentQuery
        })
      }).catch(function (reject) {
        vm.loadingActionProcess = false
        vm.loadingAction = false
      })
    },
    getNextActions () {
      let vm = this
      let query = vm.$router.history.current.query
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let currentQuery = vm.$router.history.current.query
      vm.dossierId = vm.thongTinChiTietHoSo.dossierId
      vm.loadingNextAction = true
      vm.$store.dispatch('pullNextactions', filter).then(function (result) {
        vm.loadingNextAction = false
        if (!result) {
          return
        }
        vm.btnDossierDynamics = result
        
        let btnEnable = vm.btnDossierDynamics.filter(e => e.enable === 1)
        console.log(btnEnable)
        if(btnEnable.length === 1 &&  currentQuery.hasOwnProperty('activeAction') && currentQuery.activeAction === 'true'){
          vm.processPullBtnDetail(btnEnable[0], 0)
        }
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
        vm.checkInput = vm.getCheckInput
        if (vm.getCheckInput !== null && vm.getCheckInput !== undefined) {
          if (vm.checkInput !== 0) {
            setTimeout(function () {
              vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
            }, 300)
          }
        }
        // lấy danh sách user reAsign
        vm.loadUserReAsign()
      }).catch(function () {
        vm.loadingNextAction = false
      })
      vm.$store.dispatch('loadPlugins', {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }).then(results => {
        vm.btnPlugins = results
      }).catch(xhr => {
        vm.btnPlugins = []
      })
      if (vm.thongTinChiTietHoSo.online && !vm.thongTinChiTietHoSo.originDossierNo && 
        ((vm.originality === 1 && vm.thongTinChiTietHoSo['dossierStatus'] !== 'new') || vm.originality === 3)) {
        vm.loadDossierSyncs(vm.thongTinChiTietHoSo.dossierId)
      }
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
        document.getElementById('dialogPDFPreviewXl').src = result
      })
    },
    viewFileDocument (item) {
      var vm = this
      vm.dialogPDFLoading = true
      vm.titleDialogPdf = 'Văn bản hành chính'
      vm.dialogPDF = true
      item['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('viewDocument', item).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreviewXl').src = result
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
      vm.$store.dispatch('loadDossierDocuments', vm.thongTinChiTietHoSo).then(resultDocuments => {
        if (Array.isArray(resultDocuments)) {
          vm.documents = resultDocuments
        } else {
          vm.documents.push(resultDocuments)
        }
        vm.documents = vm.documents.filter(function(item) {
          return item.documentType !== 'DOC_LUU_TRU'
        })
      })
    },
    loadThanhToan () {
      var vm = this
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.referenceUid
      }
      vm.$store.dispatch('loadDossierPayments', filter).then(result => {
        vm.paymentDetail = result
        // vm.$refs.thongtinthanhtoan.getPaymentFiles()
      }).catch(reject => {
      })
    },
    loadPaymentFile () {
      let vm = this
      vm.loadThanhToan()
      if (vm.$refs.thongtinthanhtoan) {
        vm.$refs.thongtinthanhtoan.getPaymentFiles()
      }
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
      if (vm.votingVersion === 1) {
        let filter = {
          className: 'dossier',
          classPk: vm.id
        }
        vm.$store.dispatch('loadVoting', filter).then(function (result) {
          vm.votingItems = result
          console.log('votingItems', vm.votingItems)
        }).catch(function (reject) {
        })
      } else {
        let filter = {
          className: 'dossier',
          dossierDetail: vm.thongTinChiTietHoSo
        }
        vm.$store.dispatch('loadVotingMC', filter).then(function (result) {
          vm.votingItems = result
          console.log('votingItems', vm.votingItems)
        }).catch(function (reject) {
        })
      }
      
    },
    getPreAction () {
      let vm = this
      let filter = {
        dossierId: vm.id
      }
      vm.$store.dispatch('getPreAction', filter).then(function (result) {
        vm.detailPreAction = result
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
          vm.votingItems[index]['serverCode'] = 'SERVER_' + vm.thongTinChiTietHoSo['govAgencyCode']
          arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[index]))
        }
        Promise.all(arrAction).then(results => {
          vm.loadingVoting = false
          vm.loadVoting()
          toastr.clear()
          toastr.success('Đánh giá của bạn được gửi thành công')
        }).catch(xhr => {
          vm.loadingVoting = false
          toastr.clear()
          toastr.error('Gửi đánh giá không thành công')
        })
      }
    },
    doVottingResultSubmitNew () {
      var vm = this
      vm.loadingVoting = true
      let arrAction = []
      let valid = false
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = 'dossier'
        if (String(vm.votingItems[key]['selected']) !== '0') {
          valid = true
          let indexChoice = vm.votingItems[key]['selected'] - 1
          arrAction.push(vm.$store.dispatch('submitVotingNew', Object.assign(vm.votingItems[key]['choices'][indexChoice], {dossierNo: vm.thongTinChiTietHoSo['dossierNo']})))
        }
      }
      if (valid) {
        Promise.all(arrAction).then(results => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.increCounter()
          vm.loadingVoting = false
        }).catch(xhr => {
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          vm.loadingVoting = false
        })
      } else {
        vm.loadingVoting = false
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
      
    },
    increCounter () {
      let vm = this
      let data = {
        dossierNo: vm.thongTinChiTietHoSo['dossierNo']
      }
      vm.$store.dispatch('increCounter', data).then(function (result) {})
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
            shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, '')),
            paymentFee: vm.payments['paymentFee']
          }
          if (vm.payments['paymentMethod']) {
            paymentsOut['paymentMethod'] = vm.payments['paymentMethod']
          }
          if (vm.payments && vm.payments.hasOwnProperty('counter')) {
            let dataNote = {
              requestPayment: vm.payments['requestPayment'],
              paymentNote: vm.payments['paymentNote'],
              advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
              feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
              serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
              shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, '')),
              counter: vm.payments.counter,
              paymentFee: vm.payments['paymentFee']
            }
            if (vm.payments['paymentMethod']) {
              dataNote['paymentMethod'] = vm.payments['paymentMethod']
            }
            paymentsOut.feeAmount = paymentsOut.feeAmount*vm.payments.counter
            paymentsOut.serviceAmount = paymentsOut.serviceAmount*vm.payments.counter
            paymentsOut.shipAmount = paymentsOut.shipAmount*vm.payments.counter
            paymentsOut.paymentNote = dataNote ? JSON.stringify(dataNote) : paymentsOut.paymentNote
          }
          resultAction['payment'] = paymentsOut
          console.log('payment99999', resultAction['payment'])
        }
        if (vm.showYkienCanBoThucHien) {
          let result = vm.$refs.ykiencanbo.doExport()
          resultAction['userNote'] = result.text
        }
        vm.$refs.kypheduyettailieu.kySo(resultAction)
        vm.getDetailDossier()
      }).catch(function (reject) {
        vm.loadingAction = false
        vm.loadingActionProcess = false
      })
    },
    printViewDocument () {
      let vm = this
      vm.dialogPDFLoading = true
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let counter = 0
      let callServer = function() {
        setTimeout(function () {
          vm.$store.dispatch('doPrint03', filter).then(function (result) {
            if (result === 'pending' && counter <= 5) {
              counter += 1
              callServer()
            } else {
              if (counter > 5) {
                vm.dialogPDFLoading = false
              } else {
                vm.dialogPDFLoading = false
                vm.dialogPDF = true
                setTimeout(function () {
                  document.getElementById('dialogPDFPreviewXl').src = result
                }, 100)
              }
            }
          })
        }, 1000)
      }
      callServer()
    },
    printPay () {
      let vm = this
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        referenceUid: vm.thongTinChiTietHoSo.referenceUid
      }
      vm.dialogPDFLoading = true
      if (!vm.sendInvoice) {
        vm.$store.dispatch('printPay', filter).then(function (result) {
          vm.dialogPDFLoading = false
          vm.titleDialogPdf = 'Biên lai thanh toán'
          vm.dialogPDF = true
          setTimeout(function () {
            document.getElementById('dialogPDFPreviewXl').src = result
          }, 200)
        }).catch(function(){
          vm.dialogPDFLoading = false
        })
      } else {
        vm.$store.dispatch('printPayVnpt', filter).then(function (result) {
          vm.dialogPDFLoading = false
          vm.titleDialogPdf = 'Biên lai thanh toán'
          vm.dialogPDF = true
          setTimeout(function () {
            document.getElementById('dialogPDFPreviewXl').src = result
          }, 200)
        }).catch(function(){
          vm.dialogPDFLoading = false
        })
      }
      
    },
    deleteBienLai () {
      let vm = this
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        referenceUid: vm.thongTinChiTietHoSo.referenceUid
      }
      vm.loadingActionProcess = true
      vm.$store.dispatch('deleleBienLai', filter).then(function (result) {
        toastr.success('Hủy biên lai thành công')
        vm.loadingActionProcess = false
      }).catch(function(){
        vm.loadingActionProcess = false
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
      // let userCheckPermission = userArr.concat(userLastAction)
      let userCheckPermission = userArr
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
      vm.dialog_reAsign = true
    },
    loadUserReAsign () {
      let vm = this
      vm.$store.dispatch('getDossierUserAsign', vm.thongTinChiTietHoSo.dossierId).then(function(result) {
        if (result.length > 0) {
          vm.reAsignUsers = result.filter(function (item) {
            return Number(item['userId']) !== Number(vm.currentUser['userId'])
          })
        }
        vm.showReasign = true
        if (vm.reAsignUsers.length === 0) {
          vm.showReasign = false
        }
        if (vm.usersNextAction.length === 1 && vm.reAsignUsers.length === 1 && Number(vm.reAsignUsers[0]['userId']) === Number(vm.usersNextAction[0]['userId'])) {
          vm.showReasign = false
        }
      })
    },
    phanCongLai () {
      let vm = this
      vm.dialog_reAsign = true
      vm.reAsignUsers = vm.detailPreAction['toUsers']
    },
    doReAsign () {
      let vm = this
      let filter = {
        'dossierId': vm.thongTinChiTietHoSo.dossierId,
        'users': vm.reAsignUsers,
        'delegacy': 0
      }
      let result = vm.$refs.phanconglai.doExport()
      if (result) {
        vm.loadingAction = true
        vm.$store.dispatch('postDossierUserAsign', filter).then(function (result) {
          toastr.success('Thực hiện thành công')
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
        toastr.error('Vui lòng chọn người thực hiện')
      }
    },
    getDetailDossier () {
      let vm = this
      vm.$store.dispatch('getDetailDossier', vm.id).then(resultDossier => {
        vm.reRender = false
        vm.thongTinChiTietHoSo = resultDossier
        vm.reRender = true
      })
    },
    reloadDetailDossier () {
      let vm = this
      var getSyncDossier = setInterval(frame, 3500)
      function frame() {
        if (vm.activeReload == false) {
          clearInterval(getSyncDossier)
        } else {
          console.log('RUN setInterval2')
          vm.$store.dispatch('getDetailDossier', vm.thongTinChiTietHoSo.dossierId).then(resultDossier => {
            vm.thongTinChiTietHoSo = resultDossier
            if (vm.thongTinChiTietHoSo.hasOwnProperty('dossierSyncState') && String(vm.thongTinChiTietHoSo.dossierSyncState) === '1') {
              vm.activeReload = true
            } else {
              vm.activeReload = false
            }
            let filter = {
              dossierId: vm.thongTinChiTietHoSo.dossierId
            }
            vm.$store.dispatch('pullNextactions', filter).then(function (result) {
              vm.btnDossierDynamics = result
              vm.$store.dispatch('pullBtnConfigStep', resultDossier).then(result1 => {
                vm.btnStepsDynamics = result1
                if (vm.btnStepsDynamics.length > 0) {
                  vm.btnStepsDynamics = vm.btnStepsDynamics.filter(function (item) {
                    return !item.hasOwnProperty('roleCode') || (item.hasOwnProperty('roleCode') && vm.getUser(item.roleCode))
                  })
                }
                if (vm.btnStepsDynamics.filter(function(item) {
                  item.form !== 'UPDATE'
                }).length !== 0) {
                  vm.showMenuActionKhac = false
                }
              })
            }).catch(function() {
              vm.activeReload = false
            })
          }).catch(function () {
            vm.activeReload = false
          })
        }
      }
    },
    downloadAllFile () {
      let vm = this
      vm.loadingDownload = true
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      vm.$store.dispatch('downLoadAllFile', filter).then(function (result) {
        vm.loadingDownload = false
      }).catch(function () {
        vm.loadingDownload = false
      })
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
    },
    loadDocumentLuuTru () {
      let vm = this
      vm.$store.dispatch('loadDossierDocuments', vm.thongTinChiTietHoSo).then(resultDocuments => {
        vm.docLuuTru = []
        if (Array.isArray(resultDocuments)) {
          vm.docLuuTru = resultDocuments
        } else {
          vm.docLuuTru.push(resultDocuments)
        }
        vm.docLuuTru = vm.docLuuTru.filter(function(item) {
          return item.documentType === 'DOC_LUU_TRU'
        })
        if (vm.docLuuTru.length > 0) {
          let fileDoc = vm.docLuuTru[0]
          fileDoc['dossierId'] = vm.thongTinChiTietHoSo.dossierId
          vm.$store.dispatch('viewDocument', fileDoc).then(result => {
            document.getElementById('viTriLuuTru').src = result
          })
        }
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
    dateTimeViewSequency (arg) {
      if (arg) {
        let value = new Date(arg)
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
window.showSuccess = function (note) {
  toastr.success(note)
}
window.showError = function (note) {
  toastr.error(note)
}
</script>
