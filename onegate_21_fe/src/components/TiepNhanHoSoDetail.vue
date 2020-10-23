<template>
  <div>
    <v-form v-model="validTNHS" ref="formTiepNhanHoSo" lazy-validation>
      <div v-if="formTemplate === 'version_1.0'">
        <div class="row-header">
          <div class="background-triangle-big"> 
            <span v-if="formCode === 'UPDATE'">SỬA HỒ SƠ</span>
            <span v-else-if="formCode === 'COPY'">SAO CHÉP HỒ SƠ</span>
            <span v-else-if="isOffLine">NỘP HỒ SƠ TRỰC TUYẾN</span>
            <span v-else-if="formCode === 'NEW_GROUP'">THÊM NHÓM HỒ SƠ</span>
            <span v-else-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'">THÊM MỚI CÔNG VĂN</span>
            <span v-else>THÊM MỚI HỒ SƠ</span> 
          </div>
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

        <div v-if="formCode !== 'NEW_GROUP_CV' && formCode !== 'NEW_GROUP_CV_DI'">
          <div :style="!isNotarization ? 'position: relative' : 'display: none'" v-if="originality !== 1 && formCode !== 'NEW_GROUP'">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <thong-tin-chung ref="thongtinchunghoso"></thong-tin-chung>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <div style="position: relative;" v-if="originality === 1">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header">
                  <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                  HƯỚNG DẪN &nbsp;&nbsp;&nbsp;&nbsp; 
                </div>
                <v-layout wrap>
                  <v-flex xs12 sm12>
                    <div class="ml-3 mr-3 pt-1" v-html="thongTinChiTietHoSo.dossierNote"></div>
                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <thong-tin-chu-ho-so v-if="!mauCongVan" ref="thongtinchuhoso" :requiredConfig="requiredConfigData" :formCode="formCode" :showApplicant="formCode === 'NEW_GROUP' ? true : false" :showDelegate="isNotarization ? true : false" :applicantIdRequired="applicantIdRequired"></thong-tin-chu-ho-so>
          <thong-tin-chu-ho-so-cong-van v-if="mauCongVan" ref="thongtinchuhosocongvan" :mauCongVan="mauCongVan"></thong-tin-chu-ho-so-cong-van>
          <!--  -->
          <div v-if="!isNotarization">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header" style="display: flex; align-items: center;">
                  <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                  <span v-if="formCode === 'NEW_GROUP'">Tên nhóm hồ sơ</span>
                  <span v-else>{{originality === 1 ? 'Nội dung yêu cầu giải quyết' : 'Tên hồ sơ'}}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div>
                  <v-card>
                    <v-card-text>
                      <v-form v-model="valid_tenHoSo" ref="formTenHoSo" lazy-validation>
                        <v-textarea
                          v-model="briefNote"
                          :rows="2"
                          box
                          :rules="originality === 1 ? '' : [rules.varchar5000]"
                          :placeholder="formCode === 'NEW_GROUP' ? 'Nhập tên nhóm hồ sơ' : (originality === 1 ? 'Nhập nội dung yêu cầu giải quyết' : 'Nhập tên hồ sơ')"
                        ></v-textarea>
                      </v-form>
                      <div v-if="templateDescription">(*) &nbsp; {{templateDescription}}</div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <div style="position: relative;" v-if="!isNotarization">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header" style="display: flex; align-items: center;">
                  <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                  <span v-if="formCode === 'NEW_GROUP'">Thành phần hồ sơ dùng chung</span>
                  <span v-else>Thành phần hồ sơ</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span v-if="!stateEditSample && originality !== 1">({{thongTinChiTietHoSo.sampleCount === 0 ? '?' : thongTinChiTietHoSo.sampleCount}}&nbsp;bộ hồ sơ)</span>
                  <v-text-field
                  class="px-0 py-0"
                  style="width: 90px; max-width: 90px;"
                  v-else-if="originality !== 1"
                  v-model="thongTinChiTietHoSo.sampleCount"
                  type="number"
                  @click.stop=""
                  ></v-text-field> &nbsp;
                  <v-icon v-if="!stateEditSample && originality !== 1" v-on:click.stop="stateEditSample = !stateEditSample" style="cursor: pointer;" size="16" color="primary">edit</v-icon>
                  <v-icon v-else-if="originality !== 1" style="cursor: pointer;" v-on:click.stop="stateEditSample = !stateEditSample" size="16" color="primary">done</v-icon>
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso" :formCodeInput="formCode"  :onlyView="formCode === 'NEW_GROUP' ? true : false" :id="'nm'" :partTypes="formCode === 'NEW_GROUP' || formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI' ? inputTypesGroup : inputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!-- thu-tuc-chung-thuc -->
          <div style="position: relative;" v-if="isNotarization">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header" style="display: flex; align-items: center;">
                  <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                  <span>Tài liệu chứng thực</span>
                </div>
                <tai-lieu-chung-thuc ref="tailieuchungthuc" :dossierId="thongTinChiTietHoSo.dossierId" :formCodeInput="formCode" :onlyView="false"></tai-lieu-chung-thuc>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <div style="position: relative;border-top:1px solid #ddd" v-if="originality !== 1 && notifyConfig">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content hide-actions value="2">
                <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Hình thức gửi thông báo giải quyết hồ sơ</div>
                <div class="absolute__btn" style="width: 220px">
                  <content-placeholders class="mt-1" v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <v-checkbox
                    v-model="smsNotify"
                    label="Gửi SMS"
                    color="primary"
                    hide-details
                    class="d-inline-block mr-3 mt-2"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="emailNotify"
                    label="Gửi email"
                    color="primary"
                    hide-details
                    class="d-inline-block ml-3 mt-2"
                  ></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <div style="position: relative;border-top:1px solid #ddd" v-if="originality !== 1 && fromViaPostalConfig">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content hide-actions value="2">
                <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
                  Nhận hồ sơ qua bưu chính
                </div>
                <div class="absolute__btn" style="width: 200px">
                  <content-placeholders class="mt-1" v-if="loading">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <v-checkbox
                    v-model="fromViaPostal"
                    label="Hồ sơ nhận qua bưu chính"
                    color="primary"
                    hide-details
                    class="d-inline-block mt-2"
                  ></v-checkbox>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <div style="position: relative;" v-if="viaPortalDetail !== 0 && originality === 1">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content hide-actions value="2">
                <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát hồ sơ</div>
                <dich-vu-chuyen-phat-ho-so ref="dichvuchuyenphathoso" @changeViapostal="changeViapostal"></dich-vu-chuyen-phat-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <div style="position: relative;" v-if="viaPortalDetail !== 0">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content hide-actions value="2">
                <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát kết quả</div>
                <dich-vu-chuyen-phat-ket-qua ref="dichvuchuyenphatketqua" @changeViapostal="changeViapostal"></dich-vu-chuyen-phat-ket-qua>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <div :style="isNotarization ? 'display: none' : 'position: relative;'">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content hide-actions value="2">
                <thu-phi v-if="showThuPhi" v-model="payments" :detailDossier="thongTinChiTietHoSo" :viaPortal="viaPortalDetail"></thu-phi>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
        
        </div>

        <div v-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'">
          <div>
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <thong-tin-cong-van ref="thongtincongvan" :taoQuyetDinh="hasTaoQuyetDinh" :detailDossier="thongTinChiTietHoSo" :tphs="tphsCV" :createFileCongVan="createFileCongVan"
                  :formCodeInput="formCode" :donvinhanCollection="donvinhanCollection" :requiredCVDenGroupId="requiredCVDenGroupId" :requiredCVDenGovCode="requiredCVDenGovCode" :lengthDossier="dossiersCounterIntoGroupFilter" >
                </thong-tin-cong-van>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <!--  -->
          <!-- <div style="position: relative;">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header" style="display: flex; align-items: center;">
                  <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                  <span>Thành phần hồ sơ dùng chung</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <thanh-phan-ho-so ref="thanhphanhoso" :formCodeInput="formCode"  :onlyView="false" :id="'nm'" :partTypes="formCode === 'NEW_GROUP' || formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI' ? inputTypesGroup : inputTypes"></thanh-phan-ho-so>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div> -->
          <!--  -->
          <div style="position: relative;" v-if="formCode === 'NEW_GROUP_CV_DI'">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header" style="display: flex; align-items: center;">
                  <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                  <span>Danh sách hồ sơ</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div>
                  <div class="mb-3" v-if="dossiersIntoGroupRender.length > 0">
                    <v-data-table
                      :headers="headersCV"
                      :items="dossiersIntoGroupRenderTemp"
                      hide-actions
                      class="table-landing table-bordered"
                      item-key="dossierId"
                    >
                      <!--  -->
                      <template slot="headers" slot-scope="props">
                        <tr>
                          <th
                            v-for="header in headersCV"
                            :key="header.text"
                            :class="header['class'] ? header['class'] : ''"
                            :width="header['width'] ? header['width'] + 'px' : ''"
                          >
                            <v-tooltip bottom>
                              <span slot="activator">{{ header.text }}</span>
                              <span>{{ header.text }}</span>
                            </v-tooltip>
                          </th>
                        </tr>
                      </template>
                      <!--  -->
                      <template slot="items" slot-scope="props">
                        <tr style="cursor: pointer">
                          <td class="text-xs-center" width="50px" style="height: 40px !important">
                            <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span>
                          </td>
                          <td class="text-xs-left" width="150px" style="height: 40px !important">
                            <span :style="formCode === 'NEW_GROUP_CV_DI' && String(formActionGroup['stepCode']) !== String(props.item.stepCode) ? 'text-decoration: underline;color: red;' : ''">
                              {{ props.item.dossierNo }}
                            </span><br> 
                            <span v-if="formCode === 'NEW_GROUP_CV_DI' && String(formActionGroup['stepCode']) !== String(props.item.stepCode)" style="color: red;">Hồ sơ đã xử lý</span>
                          </td>
                          <td class="text-xs-left" width="150px" style="height: 40px !important">
                            {{ props.item.applicantName }}
                          </td>
                          <td class="text-xs-left" width="100px" style="height: 40px !important">
                            <span v-if="getMetaData(props.item) && getMetaData(props.item).hasOwnProperty('birthDateDay') && getMetaData(props.item).hasOwnProperty('birthDateMonth') && getMetaData(props.item).hasOwnProperty('birthDateYear')">{{getMetaData(props.item).birthDateDay}}/</span>
                            <span v-if="props.item && getMetaData(props.item) && getMetaData(props.item).hasOwnProperty('birthDateMonth') && getMetaData(props.item).hasOwnProperty('birthDateYear')">{{getMetaData(props.item).birthDateMonth}}/</span>
                            <span v-if="props.item && getMetaData(props.item) && getMetaData(props.item).hasOwnProperty('birthDateYear')">{{getMetaData(props.item).birthDateYear}} </span>
                          </td>
                          <td class="text-xs-left"  style="height: 40px !important">
                            <span v-if="props.item.address">{{props.item.address}}, </span>
                            <span v-if="props.item.wardName">{{props.item.wardName}}, </span>
                            <span v-if="props.item.districtName">{{props.item.districtName}}, </span>
                            <span v-if="props.item.cityName">{{props.item.cityName}} </span>
                          </td>
                          <td class="text-xs-left" width="100px" style="height: 40px !important">
                            <span v-if="props.item.metaData && getMetaData(props.item) && getMetaData(props.item).yearPayment">{{getMetaData(props.item).yearPayment}} </span>
                          </td>
                          <td class="text-xs-left" width="100px" style="height: 40px !important">
                            <span v-if="props.item.metaData && getMetaData(props.item) && getMetaData(props.item).subsidy">{{currency(getMetaData(props.item).subsidy)}} </span>
                          </td>
                          <td class="text-xs-left" width="100px" style="height: 40px !important">
                            <span v-if="props.item.dossierStatusText">{{props.item.dossierStatusText}} </span>
                          </td>
                          <td class="text-xs-left" width="100px" style="height: 40px !important">
                            <span v-if="props.item.applicantNote">{{props.item.applicantNote}} </span>
                          </td>
                          
                          <td class="text-xs-center" width="120px" style="height: 40px !important">
                            <v-btn flat icon color="indigo" class="mr-2 my-0" @click="viewDetail(props.item)" title="Xem chi tiết">
                              <v-icon>fas fa fa-file-text</v-icon>
                            </v-btn>
                            <v-btn flat icon color="red" class="my-0" @click="removeDossierFromGroup(props.item)" title="Xóa khỏi công văn">
                              <v-icon size="22">delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                    <v-layout wrap class="mt-3 ml-3">
                      <v-flex xs12 sm2 class="pt-2">
                        <span>Tổng số hồ sơ xử lý: </span>
                        <span class="text-bold">{{dossiersCounterIntoGroupFilter}} </span>
                      </v-flex>
                      <v-flex xs12 sm3 class="pt-2">
                        <span>Tổng số tiền: </span>
                        <span class="text-bold">{{currency(totalFee)}} đồng</span>
                      </v-flex>
                      <v-flex xs12 sm7>
                        <div  class="text-xs-center layout wrap pr-1" style="position: relative;">
                          <div class="flex pagging-table px-2">
                            <tiny-pagination :showLimit="true" :total="dossiersIntoGroupRender.length" :showTotal="false" :currentLimit="30" :page="pagination.page" custom-class="custom-tiny-class" 
                              @tiny:change-page="paggingData" ></tiny-pagination> 
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                    <div v-if="formCode === 'NEW_GROUP_CV_DI' && hoSoDaXuLy.length > 0" class="ml-2">
                      <v-icon color="red darken-2" size="24">report_problem</v-icon> &nbsp;
                      <span style="font-size:14px">Hồ sơ 
                        <span style="font-weight: bold;">{{hoSoDaXuLyList}}</span>
                       đã xử lý. Vui lòng xóa khỏi công văn trước khi gửi.
                      </span>
                    </div>
                  </div>
                  <div v-else class="pl-5 py-2">Chưa có hồ sơ nào</div>
                  <v-flex xs12 class="text-right mb-3 mr-2" v-if="formCode === 'NEW_GROUP_CV_DI' && hoSoDaXuLy.length > 0">
                    <v-btn small color="primary" @click="removeAllDossierFromGroup" class="mx-0 my-0" >
                      <v-icon size="20">delete</v-icon> &nbsp;
                      <span>Xóa hồ sơ đã xử lý</span>
                    </v-btn>
                  </v-flex>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>

        </div>
        
        <v-tabs v-if="formCode !== 'NEW_GROUP_CV' && formCode !== 'NEW_GROUP_CV_DI'" icons-and-text centered class="mb-4">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <!-- <v-tab href="#tab-1" @click="luuHoSo">
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              Lưu &nbsp;
              <v-icon>save</v-icon>
            </v-btn>
          </v-tab> -->
          <v-tab href="#tab-2" @click="tiepNhanNhomHoSo()" v-if="formCode === 'NEW_GROUP' && originality !== 1 && tiepNhanState" class="px-0 py-0"> 
            <v-btn flat class="" 
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon size="20">save</v-icon>  &nbsp;
              <span>Tạo nhóm</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <v-tab href="#tab-2" @click="tiepNhanHoSo()" v-if="formCode !== 'NEW_GROUP' && originality !== 1 && tiepNhanState" class="px-0 py-0"> 
            <v-btn flat class="" 
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon size="20">save</v-icon>  &nbsp;
              <span v-if="formCode === 'UPDATE'">Lưu hồ sơ</span> <span v-else>Tiếp nhận</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <v-tab href="#tab-4" @click="tiepNhanHoSo('add')" v-if="originality !== 1 &&  formCode !== 'UPDATE' && formCode !== 'COPY' && formCode !== 'NEW_GROUP' && tiepNhanState" class="px-0 py-0"> 
            <v-btn flat class=""
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon size="20">note_add</v-icon>  &nbsp;
              <span>Tiếp nhận và thêm mới</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <v-tab href="#tab-3" @click="luuHoSo" v-if="originality === 1" class="px-0 py-0"> 
            <v-btn flat class=""
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon size="20">save</v-icon> &nbsp;
              Lưu
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <v-tab href="#tab-5" class="px-0 py-0"  @click="goBackHistory">
            <v-btn flat class=""
              :loading="loadingAction"
              :disabled="loadingAction"
              @click="goBackHistory"
            >
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
        </v-tabs>
        <v-tabs v-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'" icons-and-text centered class="mb-4">
          <v-tab v-if="formCode === 'NEW_GROUP_CV_DI'" href="#tab-1" @click="tiepNhanCongVan('add', 'save')" class="px-0 py-0"> 
            <v-btn flat class="" 
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon size="20">save</v-icon>  &nbsp;
              <span>Lưu công văn</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <v-tab v-if="formCode === 'NEW_GROUP_CV_DI'" href="#tab-2" class="px-0 py-0"> 
            <v-btn flat class="" 
              :loading="loadingAction"
              :disabled="loadingAction || dossiersCounterIntoGroupFilter === 0"
              @click="tiepNhanCongVan('add', 'saveSend')"
            >
              <v-icon size="20">save</v-icon>  &nbsp;
              <span>Lưu và gửi công văn</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <v-tab v-if="formCode === 'NEW_GROUP_CV'" href="#tab-3" @click="tiepNhanCongVan('add')" class="px-0 py-0"> 
            <v-btn flat class="" 
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon size="20">save</v-icon>  &nbsp;
              <span>Thêm công văn</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          <!-- <v-tab v-if="formCode === 'NEW_GROUP_CV_DI' && createFileCongVan" href="#tab-4" class="px-0 py-0">
            <v-btn flat class=""
              :loading="loadingAction"
              :disabled="loadingAction"
              @click=""
            >
              <v-icon size="18">printer</v-icon> &nbsp;
              <span style="margin-left: -30px;">In công văn</span>
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab> -->
          <v-tab href="#tab-5" class="px-0 py-0" @click="goBackHistory"> 
            <v-btn flat class=""
              :loading="loadingAction"
              :disabled="loadingAction"
              @click="goBackHistory"
            >
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-tab>
          
        </v-tabs>
      </div>
      <!-- add new template -->
      <div v-if="formTemplate === 'version_2.0'">

        <div style="display: none">
          <input id="validate_required" type="text" :value="true">
          <input id="serviceCode_hidden" type="text" :value="serviceCode_hidden">
          <input id="serviceName_hidden" type="text" :value="serviceName_hidden">
          <input id="govAgencyCode_hidden" type="text" :value="govAgencyCode_hidden">
          <input id="dossierTemplateNo_hidden" type="text" :value="dossierTemplateNo_hidden">
          <input id="eformCode_hidden" type="text" :value="eformCode_hidden">
        </div>
        <div class="row-header">
          <div class="background-triangle-big"> 
            <span v-if="formCode === 'UPDATE'">SỬA HỒ SƠ</span>
            <span v-else-if="formCode === 'COPY'">SAO CHÉP HỒ SƠ</span>
            <span v-else-if="isOffLine">NỘP HỒ SƠ TRỰC TUYẾN</span>
            <span v-else>THÊM MỚI HỒ SƠ</span> 
          </div>
          <div class="layout row wrap header_tools row-blue">
            <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="templateName">
              {{templateName}}
            </div>
            <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
              <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
                <v-icon size="18">reply</v-icon> &nbsp;
                Quay lại
              </v-btn>
            </div>
          </div> 
        </div>
        <div v-if="loadingForm" class="text-xs-center mt-5">
          <v-progress-circular
            :size="50"
            color="#dedede"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else>
          <v-card flat color="#fff">
            <div style="position: absolute;right: 0">
              <v-btn color="primary" @click="showHDTT()">Phiếu hướng dẫn thủ tục</v-btn>
              <v-btn color="primary" @click="showTCTN()">
                Phiếu từ chối tiếp nhận
              </v-btn>
            </div>
            <div id="formAlpacaNewTemplate" class="mb-5 pt-0"></div>
          </v-card>
          <!--  -->
          <v-tabs icons-and-text centered class="mb-4">
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab href="#tab-2" @click="tiepNhanHoSoNewTemplate()" v-if="originality !== 1 && tiepNhanState" class="px-0 py-0"> 
              <v-btn flat class="" 
                :loading="loadingAction"
                :disabled="loadingAction"
              >
                <v-icon size="20">save</v-icon>  &nbsp;
                <span v-if="formCode === 'UPDATE'">Lưu hồ sơ</span> <span v-else>Tiếp nhận</span>
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-tab>
            <!-- <v-tab href="#tab-4" @click="tiepNhanHoSoNewTemplate('add')" v-if="originality !== 1 &&  formCode !== 'UPDATE' && formCode !== 'COPY' && tiepNhanState" class="px-0 py-0"> 
              <v-btn flat class=""
                :loading="loadingAction"
                :disabled="loadingAction"
              >
                <v-icon size="20">note_add</v-icon>  &nbsp;
                <span>Tiếp nhận và thêm mới</span>
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-tab> -->
            <v-tab href="#tab-3" @click="luuHoSo" v-if="originality === 1" class="px-0 py-0"> 
              <v-btn flat class=""
                :loading="loadingAction"
                :disabled="loadingAction"
              >
                <v-icon size="20">save</v-icon> &nbsp;
                Lưu
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-tab>
            <v-tab href="#tab-5" @click="goBack" class="px-0 py-0">
              <v-btn flat class=""
                :loading="loadingAction"
                :disabled="loadingAction"
              >
                <v-icon size="18">reply</v-icon> &nbsp;
                Quay lại
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-tab>
          </v-tabs>
        </div>
        
      </div>
      <!--  -->
    </v-form>
    <!-- Form phiếu hướng dẫn -->
    <v-dialog v-model="dialog_printGuide" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thông tin phiếu hướng dẫn hoàn thiện hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_printGuide = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formGuide" v-model="validGuide" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thủ tục hành chính <span style="color:red">*</span>:</div>
                <v-text-field
                  box
                  v-model="serviceName_hidden"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Dịch vụ <span style="color:red">*</span>:</div>
                <v-text-field
                  box
                  v-model="templateName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2" style="position:relative">
                <div class="my-2 text-bold">Tên người làm thủ tục <span style="color:red">*</span>:</div>
                <v-text-field
                  placeholder="Nhập tên người làm thủ tục"
                  box
                  v-model="applicantNameGuide"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
                <v-radio-group class="my-0" v-model="applicantTypeGuide" row style="position:absolute;right:0;top:0">
                  <v-radio label="Công dân" :value="true"></v-radio>
                  <v-radio label="Tổ chức, doanh nghiệp" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Địa chỉ:</div>
                <v-text-field
                  placeholder="Nhập địa chỉ"
                  box
                  v-model="applicantAddressGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thư điện tử:</div>
                <v-text-field
                  box
                  placeholder="Nhập thư điện tử"
                  v-model="applicantEmailGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Số điện thoại:</div>
                <v-text-field
                  box
                  v-model="applicantTelNoGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thông tin thành phần hồ sơ:</div>
                <v-data-table
                  :headers="headersTphsGuide"
                  :items="tphsGuide"
                  hide-actions
                  class="table-landing table-bordered"
                  style="border-left: 1px solid #dedede"
                >
                  <template slot="items" slot-scope="props">
                    <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                      <td class="text-xs-center" style="width:50px">
                        <div>
                          <span>{{props.index + 1}}</span><br>
                        </div>
                      </td>
                      <td class="text-xs-left">
                        <div>
                          <span>{{props.item.partName}}</span>
                        </div>
                      </td>
                      <td class="text-xs-center" style="width: 50px">
                        <div>
                          <v-checkbox
                            v-model="props.item.fileMark"
                            primary
                            hide-details
                            color="primary"
                            style="display: inline-block;width: 25px"
                          ></v-checkbox>
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Ghi chú:</div>
                <v-textarea class="py-0"
                box
                v-model="applicantNoteGuide"
                rows="3"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click="doGuiding('doc')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>save</v-icon> &nbsp;
            Lưu phiếu hướng dẫn
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn class="mr-3" color="primary" @click="doGuiding('pdf')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>print</v-icon> &nbsp;
            In phiếu hướng dẫn
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Form phiếu từ chối -->
    <v-dialog v-model="dialog_denied" scrollable persistent max-width="700px">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thông tin phiếu từ chối tiếp nhận</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_denied = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="formDenied" v-model="validDenied" lazy-validation>
            <v-layout wrap class="py-1 align-center row-list-style">
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thủ tục hành chính <span style="color:red">*</span>:</div>
                <v-text-field
                  box
                  v-model="serviceName_hidden"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Dịch vụ <span style="color:red">*</span>:</div>
                <v-text-field
                  box
                  v-model="templateName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2" style="position:relative">
                <div class="my-2 text-bold">Tên người làm thủ tục <span style="color:red">*</span>:</div>
                <v-text-field
                  placeholder="Nhập tên người làm thủ tục"
                  box
                  v-model="applicantNameGuide"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
                <v-radio-group class="my-0" v-model="applicantTypeGuide" row style="position:absolute;right:0;top:0">
                  <v-radio label="Công dân" :value="true"></v-radio>
                  <v-radio label="Tổ chức, doanh nghiệp" :value="false"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Địa chỉ:</div>
                <v-text-field
                  placeholder="Nhập địa chỉ"
                  box
                  v-model="applicantAddressGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Thư điện tử:</div>
                <v-text-field
                  box
                  placeholder="Nhập thư điện tử"
                  v-model="applicantEmailGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Số điện thoại:</div>
                <v-text-field
                  box
                  v-model="applicantTelNoGuide"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 class="px-2">
                <div class="my-2 text-bold">Lý do từ chối tiếp nhận:</div>
                <v-textarea class="py-0"
                box
                v-model="applicantNoteGuide"
                rows="3"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click="doDenied('doc')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>save</v-icon> &nbsp;
            Lưu phiếu từ chối
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn class="mr-3" color="primary" @click="doDenied('pdf')"
          :loading="loadingAction"
          :disabled="loadingAction">
            <v-icon>print</v-icon> &nbsp;
            In phiếu từ chối
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>{{tiltleDialog}}</v-toolbar-title>
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
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import toastr from 'toastr'
import $ from 'jquery'
import ThongTinChuHoSo from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNew.vue'
import TaiLieuChungThuc from './TiepNhan/TaiLieuChungThuc.vue'
import ThongTinChung from './TiepNhan/TiepNhanHoSo_ThongTinChung.vue'
import LePhi from './form_xu_ly/FeeDetail.vue'
import DichVuChuyenPhatKetQua from './TiepNhan/TiepNhanHoSo_DichVuChuyenPhatKetQua.vue'
import DichVuChuyenPhatHoSo from './TiepNhan/TiepNhanHoSo_DichVuChuyenPhatHoSo.vue'
import ThongTinCongVan from './TiepNhan/TiepNhanHoSo_ThongTinCongVan.vue'
import ThongTinChuHoSoCongVan from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSoCongVan.vue'
import TinyPagination from './pagging/opencps_pagination.vue'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index', 'id', 'formCode'],
  components: {
    'thong-tin-chu-ho-so': ThongTinChuHoSo,
    'thong-tin-chu-ho-so-cong-van': ThongTinChuHoSoCongVan,
    'thanh-phan-ho-so': ThanhPhanHoSo,
    'tai-lieu-chung-thuc': TaiLieuChungThuc,
    'thong-tin-chung': ThongTinChung,
    'thu-phi': LePhi,
    'dich-vu-chuyen-phat-ho-so': DichVuChuyenPhatHoSo,
    'dich-vu-chuyen-phat-ket-qua': DichVuChuyenPhatKetQua,
    'thong-tin-cong-van': ThongTinCongVan,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    valid_tenHoSo: false,
    // add new template
    isNotarization: false,
    templateName: '',
    formTemplate: '',
    data_form_template: '',
    serviceCode_hidden: '',
    serviceName_hidden: '',
    govAgencyCode_hidden: '',
    govAgencyName_hidden: '',
    dossierTemplateNo_hidden: '',
    eformCode_hidden: '',
    // 
    validTNHS: false,
    dossierId: '',
    mark: true,
    stateEditSample: false,
    tiepNhanState: true,
    thongTinChiTietHoSo: {},
    payments: {},
    paymentProfile: {},
    briefNote: '',
    receiveDateEdit: '',
    editableDate: false,
    dueDateEdit: '',
    durationPhase: '',
    viaPortalDetail: 0,
    showThuPhi: false,
    inputTypes: [1, 3],
    // inputTypes: [1, 3, 6],
    inputTypesGroup: [6],
    outputTypes: [2],
    sampleCount: 0,
    isMobile: false,
    loadingAction: false,
    loadingForm: false,
    notifyConfig: false,
    fromViaPostal: false,
    fromViaPostalConfig: false,
    smsNotify: true,
    emailNotify: true,
    dialog_printGuide: false,
    dialog_denied: false,
    validGuide: false,
    validDenied: false,
    listThuTucHanhChinh: [],
    thuTucHanhChinhSelectedGuide: '',
    listDichVuGuide: [],
    dichVuSelectedGuide: '',
    applicantNameGuide: '',
    applicantTypeGuide: '',
    applicantEmailGuide: '',
    applicantNoteGuide: '',
    tphsGuide: [],
    headersTphsGuide: [
      {
        text: 'TT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thành phần',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đã có',
        align: 'center',
        sortable: false
      }
    ],
    dialogPDF: false,
    dialogPDFLoading: true,
    tiltleDialog: '',
    requiredConfigData: false,
    templateDescription : '',
    actionDetail: '',
    mauCongVan: '',
    tphsCV: '',
    dossiersIntoGroupRenderTemp: [],
    headersCV: [
      {
        text: 'STT',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Họ và tên',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Năm sinh',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Nơi đăng ký HKTT',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Số tháng được hưởng',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Mức trợ cấp (đồng/tháng)',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Ghi chú',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
    ],
    pagination: {
      rowsPerPage: 30,
      page: 1
    },
    totalFee: 0,
    dossiersCounterIntoGroupFilter: 0,
    hoSoDaXuLy: [],
    hoSoDaXuLyList: '',
    createFileCongVan: '',
    postStepCodeCongVan: '',
    donvinhanCollection: '',
    requiredCVDenGovCode: '',
    requiredCVDenGroupId: '',
    formActionGroup: '',
    hasTaoQuyetDinh: false,
    mauGiayPhep: 'KQGP',
    mappingValidateGP: '',
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
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
    applicantIdRequired :true
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      return this.getOriginality()
    },
    dichVuChuyenPhatKetQua () {
      return this.$store.getters.dichVuChuyenPhatKetQua
    },
    dichVuChuyenPhatHoSo () {
      return this.$store.getters.dichVuChuyenPhatHoSo
    },
    thongTinChuHoSo () {
      return this.$store.getters.thongTinChuHoSo
    },
    menuConfigsToDo () {
      return this.$store.getters.getMenuConfigsTodo
    },
    dossiersIntoGroupRender () {
      return this.$store.getters.dossierSelectedDoAction
    },
    // formActionGroup () {
    //   return this.$store.getters.formActionGroup
    // }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let currentQuery = vm.$router.history.current.query
      if (currentQuery.hasOwnProperty('formActionGroup') && currentQuery.formActionGroup) {
        vm.formActionGroup = JSON.parse(currentQuery.formActionGroup)
      }
      console.log('currentQueryTiepNhanHoSoDetail_created', vm.formActionGroup)
      vm.dossierId = vm.id
      vm.donvinhanCollection = vm.formActionGroup.hasOwnProperty('donvinhan') ? vm.formActionGroup.donvinhan : ''
      vm.requiredCVDenGroupId = vm.formActionGroup.hasOwnProperty('requiredCVDenGroupId') ? vm.formActionGroup.requiredCVDenGroupId : ''
      vm.requiredCVDenGovCode = vm.formActionGroup.hasOwnProperty('requiredCVDenGovCode') ? vm.formActionGroup.requiredCVDenGovCode : ''
      vm.hasTaoQuyetDinh = vm.formActionGroup.hasOwnProperty('taoQuyetDinh') ? vm.formActionGroup.taoQuyetDinh : false
    })
  },
  beforeDestroy () {
    let viewport = $('meta[name="viewport"]')
    viewport.attr('content', 'initial-scale=1.0, width=device-width')
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      if (currentQuery.hasOwnProperty('formActionGroup') && currentQuery.formActionGroup) {
        vm.formActionGroup = JSON.parse(currentQuery.formActionGroup)
      }
      console.log('currentQueryTiepNhanHoSoDetail_watch', vm.formActionGroup)
    },
    isMobile (val) {
      let viewport = $('meta[name="viewport"]')
      if (val) {
        viewport.attr('content', '')
      } else {
        viewport.attr('content', 'initial-scale=1.0, width=device-width')
      }
    },
    thongTinChuHoSo () {
      let vm = this
      // console.log('thongTinChuHoSo', vm.thongTinChuHoSo)
      vm.briefNote = vm.thongTinChiTietHoSo.serviceName ? vm.thongTinChiTietHoSo.serviceName : ''
      // set dossierName
      if (vm.thongTinChiTietHoSo.serviceName && !vm.thongTinChuHoSo['userType'] && vm.thongTinChuHoSo['applicantName']) {
        vm.briefNote = vm.briefNote + ' cho ' + vm.thongTinChuHoSo['applicantName']
      } else if (vm.thongTinChiTietHoSo.serviceName && vm.thongTinChuHoSo['userType'] && vm.thongTinChuHoSo['applicantName']) {
        vm.briefNote = vm.briefNote + ' cho ông/bà/tổ chức ' + vm.thongTinChuHoSo['applicantName']
      }
      // end
      if (vm.formCode === 'UPDATE') {
        vm.briefNote = vm.thongTinChiTietHoSo.dossierName ? vm.thongTinChiTietHoSo.dossierName : vm.thongTinChiTietHoSo.serviceName
      }
    },
    dossiersIntoGroupRender (arr) {
      let vm = this
      let totalFee = 0
      vm.dossiersCounterIntoGroupFilter = arr.length
      if (vm.formCode === 'NEW_GROUP_CV_DI') {
        vm.dossiersCounterIntoGroupFilter = arr.filter(function (item) {
          return String(item.stepCode) === String(vm.formActionGroup.stepCode)
        }).length
        vm.hoSoDaXuLy = vm.dossiersIntoGroupRender.filter(function (item) {
          return String(item.stepCode) !== String(vm.formActionGroup.stepCode)
        })
        if (vm.hoSoDaXuLy.length > 0) {
          vm.hoSoDaXuLyList = vm.hoSoDaXuLy.map(obj =>{ 
            return obj.dossierNo
          }).toString()
        }
        
      }
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (vm.formCode === 'NEW_GROUP_CV_DI') {
            if (String(arr[i].stepCode) === String(vm.formActionGroup.stepCode)) {
              let metaData = vm.getMetaData(arr[i])
              let fee = 0
              if (metaData) {
                let trocapmotlan = metaData.hasOwnProperty('trocapmotlan') && metaData['trocapmotlan'] ? true : false
                fee = trocapmotlan ? Number(metaData['subsidy']) : Number(metaData['yearPayment'])*Number(metaData['subsidy'])
                totalFee += fee
              }
            }
          } else {
            let metaData = vm.getMetaData(arr[i])
            let fee = 0
            if (metaData) {
              let trocapmotlan = metaData.hasOwnProperty('trocapmotlan') && metaData['trocapmotlan'] ? true : false
              fee = trocapmotlan ? Number(metaData['subsidy']) : Number(metaData['yearPayment'])*Number(metaData['subsidy'])
              totalFee += fee
            }
          }
        }
        vm.dossiersIntoGroupRenderTemp = arr.slice(0, vm.pagination.rowsPerPage )
        vm.totalFee = totalFee
      }
      
    },
    formActionGroup (val) {
      let vm = this
      vm.donvinhanCollection = val.hasOwnProperty('donvinhan') ? val.donvinhan : ''
      vm.requiredCVDenGroupId = val.hasOwnProperty('requiredCVDenGroupId') ? val.requiredCVDenGroupId : ''
      vm.requiredCVDenGovCode = val.hasOwnProperty('requiredCVDenGovCode') ? val.requiredCVDenGovCode : ''
      vm.hasTaoQuyetDinh = val.hasOwnProperty('taoQuyetDinh') ? val.taoQuyetDinh : false
    }
  },
  methods: {
    onResize () {
      let vm = this
      let isMobile = window.innerWidth < 1024
      vm.isMobile = isMobile
    },
    initData: function (data) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.formCode === 'NEW_GROUP_CV_DI') {
        console.log('vm.dossiersIntoGroupRender', vm.dossiersIntoGroupRender)
        vm.donvinhanCollection = vm.formActionGroup.hasOwnProperty('donvinhan') ? vm.formActionGroup.donvinhan : ''
        vm.requiredCVDenGroupId = vm.formActionGroup.hasOwnProperty('requiredCVDenGroupId') ? vm.formActionGroup.requiredCVDenGroupId : ''
        vm.requiredCVDenGovCode = vm.formActionGroup.hasOwnProperty('requiredCVDenGovCode') ? vm.formActionGroup.requiredCVDenGovCode : ''
        vm.hasTaoQuyetDinh = vm.formActionGroup.hasOwnProperty('taoQuyetDinh') ? vm.formActionGroup.taoQuyetDinh : false
        let totalFee = 0
        let arr = vm.dossiersIntoGroupRender
        vm.dossiersCounterIntoGroupFilter = arr.length
        if (vm.formCode === 'NEW_GROUP_CV_DI') {
          vm.dossiersCounterIntoGroupFilter = arr.filter(function (item) {
            return String(item.stepCode) === String(vm.formActionGroup.stepCode)
          }).length
          vm.hoSoDaXuLy = vm.dossiersIntoGroupRender.filter(function (item) {
            return String(item.stepCode) !== String(vm.formActionGroup.stepCode)
          })
          if (vm.hoSoDaXuLy.length > 0) {
            vm.hoSoDaXuLyList = vm.hoSoDaXuLy.map(obj =>{ 
              return obj.dossierNo
            }).toString()
          }
        }
        if (arr && arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            if (vm.formCode === 'NEW_GROUP_CV_DI') {
              if (String(arr[i].stepCode) === String(vm.formActionGroup.stepCode)) {
                let metaData = vm.getMetaData(arr[i])
                let fee = 0
                if (metaData) {
                  let trocapmotlan = metaData.hasOwnProperty('trocapmotlan') && metaData['trocapmotlan'] ? true : false
                  fee = trocapmotlan ? Number(metaData['subsidy']) : Number(metaData['yearPayment'])*Number(metaData['subsidy'])
                  totalFee += fee
                }
              }
            } else {
              let metaData = vm.getMetaData(arr[i])
              let fee = 0
              if (metaData) {
                let trocapmotlan = metaData.hasOwnProperty('trocapmotlan') && metaData['trocapmotlan'] ? true : false
                fee = trocapmotlan ? Number(metaData['subsidy']) : Number(metaData['yearPayment'])*Number(metaData['subsidy'])
                totalFee += fee
              }
            }
          }
          vm.dossiersIntoGroupRenderTemp = arr.slice(0, vm.pagination.rowsPerPage )
          vm.totalFee = totalFee
        }
      }
      let filter = {
        dossierTemplateNo: currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
      }
      vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result) {
        try {
          vm.requiredConfigData = result['formMeta'] ? JSON.parse(result['formMeta']) : false
        } catch (error) {
        }
        vm.templateName = result['templateName']
        vm.templateDescription = result['description']
        vm.tphsCV = result['dossierParts']
        vm.mauCongVan = result['newFormScript'] && result['newFormScript'].startsWith('MAU_CV_') ? result['newFormScript'] : false 
        if (result['newFormScript'] && !vm.mauCongVan) {
          vm.data_form_template = eval("( " + result['newFormScript'] + " ) ")
          // console.log('data_form_template', vm.data_form_template)
          vm.formTemplate = 'version_2.0'
          vm.loadingForm = true
          let filterServiceConfig = {
            serviceConfigId: currentQuery.hasOwnProperty('service_config') && currentQuery.service_config ? currentQuery.service_config : ''
          }
          vm.$store.dispatch('getServiceConfigDetail', filterServiceConfig).then(function (data) {
            vm.loadingForm = false
            vm.serviceName_hidden = data.serviceName
            vm.serviceCode_hidden = data.serviceCode
            vm.govAgencyCode_hidden = data.govAgencyCode
            vm.govAgencyName_hidden = data.govAgencyName
            vm.dossierTemplateNo_hidden = currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
            vm.eformCode_hidden = currentQuery.hasOwnProperty('eformCode') && currentQuery.eformCode ? currentQuery.eformCode : ''
            setTimeout (function () {
              if (vm.data_form_template) {
                let formScript, formData
                /* eslint-disable */
                if (vm.data_form_template) {
                  formScript = vm.data_form_template
                } else {
                  formScript = {}
                }
                formData = {}
                /* eslint-disable */
                formScript.data = formData
                window.$('#formAlpacaNewTemplate').alpaca(formScript)
              }
            }, 200)
            // 
            let filter = {
              dossierTemplateNo: vm.dossierTemplateNo_hidden
            }
            vm.$store.dispatch('loadDossierTemplates', filter).then(function (result) {
              for (let key in result['dossierParts']) {
                result['dossierParts'][key].fileMark = true
              }
              vm.tphsGuide = result['dossierParts'].filter(function (item) {
                return item['partType'] === 1
              })
            }).catch(function (){})
          })
        } else {
          vm.formTemplate = 'version_1.0'
          vm.$store.dispatch('getDetailDossier', data).then(result => {
            // lấy thông tin createFile công văn
            if (vm.formCode === 'NEW_GROUP_CV_DI') {
              vm.getDetailActionCongVan()
            }
            vm.dossierId = result.dossierId
            vm.briefNote = result.serviceName ? result.serviceName : ''
            if (vm.formCode === 'UPDATE') {
              vm.fromViaPostal = String(result.fromViaPostal) === '1' ? true : false
            }
            result['editable'] = false
            if (result.dossierStatus === '') {
              vm.$store.dispatch('pullNextactions', result).then(result2 => {
                if (result2) {
                  let actionList = result2.filter(function (item) {
                    return String(item.enable) === '1' && item.autoEvent !== 'listener'
                  })
                  if (actionList.length > 1) {
                    vm.actionDetail = actionList.filter(function (item) {
                      return item.actionCode === 1100 || item.actionCode === '1100'
                    })[0]
                  } else {
                    vm.actionDetail = actionList && actionList.length === 1 ? actionList[0] : result2[0]
                  }
                  vm.$store.dispatch('processPullBtnDetail', {
                    dossierId: result.dossierId,
                    actionId: vm.actionDetail ? vm.actionDetail.processActionId : ''
                  }).then(resAction => {
                    result['editable'] = resAction && resAction.receiving ? resAction.receiving.editable : false
                    result['receivingDuedate'] = resAction && resAction.receiving && resAction.receiving.dueDate ? resAction.receiving.dueDate : null
                    result['receivingDate'] = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                    result['allowAssignUser'] = String(resAction['allowAssignUser'])
                    vm.editableDate = resAction && resAction.receiving ? resAction.receiving.editable : false
                    vm.dueDateEdit = resAction && resAction.receiving && resAction.receiving.dueDate ? resAction.receiving.dueDate : ''
                    vm.receiveDateEdit = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                    vm.durationPhase = resAction && resAction.receiving && resAction.receiving.hasOwnProperty('durationPhase') ? resAction.receiving.durationPhase : ''
                    if (resAction && resAction.payment && resAction.payment.requestPayment > 0) {
                      vm.showThuPhi = true
                      vm.payments = resAction.payment
                    }
                    // call initData thong tin chung ho so
                    if (vm.$refs.thongtinchunghoso) {
                      vm.$refs.thongtinchunghoso.initData(result)
                    }
                    // call initData thong tin cong van
                    if (vm.$refs.thongtincongvan) {
                      vm.$refs.thongtincongvan.initData(result)
                    }
                    // 
                    let mauGP = vm.getSearchParams(resAction['preCondition'], 'validateDeliverable')
                    if (mauGP) {
                      vm.getThongTinValidateGp(mauGP)
                    }
                  }).catch(function(){})
                } else {
                  // call initData thong tin chung ho so
                  if (vm.$refs.thongtinchunghoso) {
                    vm.$refs.thongtinchunghoso.initData(result)
                  }
                }
              })
            } else {
              if (vm.$refs.thongtinchunghoso) {
                // console.log('has thong tin chung ho so')
                vm.$refs.thongtinchunghoso.initData(result)
              }
            }
            vm.thongTinChiTietHoSo = result
            if (!vm.mauCongVan && vm.$refs.thongtinchuhoso) {
              vm.$refs.thongtinchuhoso.initData(result)
            }
            if (vm.formCode === 'UPDATE' && vm.mauCongVan && vm.$refs.thongtinchuhosocongvan) {
              vm.$refs.thongtinchuhosocongvan.initData(result)
            }
            vm.viaPortalDetail = result.viaPostal
            if (result.viaPostal > 0) {
              let vnpostalProfile = {
                vnpostalStatus: 0,
                postalServiceName: '',
                postalServiceCode: '',
                postalAddress: '',
                postalCityCode: '',
                postalCityName: '',
                postalDistrictCode: '',
                postalDistrictName: '',
                postalWardCode: '',
                postalWardName: '',
                postalTelNo: ''
              }
              let postalAddress = result.address ? (result.address + ', ' + result.wardName + ' - ' + result.districtName + ' - ' + result.cityName) : ''
              if (vm.originality === 1) {
                result['postalAddress'] = postalAddress
                result['postalTelNo'] = vm.thongTinChuHoSo['contactTelNo']

                vnpostalProfile['vnpostalStatus'] = result.vnpostalStatus
                vnpostalProfile['postalAddress'] = result.address
                vnpostalProfile['postalCityCode'] = result.cityCode
                vnpostalProfile['postalCityName'] = result.cityName
                vnpostalProfile['postalDistrictCode'] = result.districtCode
                vnpostalProfile['postalDistrictName'] = result.districtName
                vnpostalProfile['postalWardCode'] = result.wardCode
                vnpostalProfile['postalWardName'] = result.wardName
                vnpostalProfile['postalTelNo'] = vm.thongTinChuHoSo['contactTelNo']
              }
              vm.$store.commit('setDichVuChuyenPhatKetQua', result)
              vm.$store.commit('setDichVuChuyenPhatHoSo', vnpostalProfile)
            }
            // lấy thông tin notify config
            vm.getNotifyConfig(vm.dossierId)
            vm.$store.dispatch('getServiceInfo', {
              serviceInfoId: result.serviceCode
            }).then(function (res) {
              if (res.hasOwnProperty('isNotarization') && String(res.isNotarization) === 'true') { 
                vm.isNotarization = true

              } else {
                vm.isNotarization = false
                if (!vm.mauCongVan || vm.formCode === 'UPDATE') {
                  vm.$refs.thanhphanhoso.initData(result)
                }
              }
            })
            
            
          }).catch(reject => {
          })
        }
      })
    },
    luuHoSo () {
      var vm = this
      // console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      let thongtinchunghoso = this.$refs.thongtinchunghoso ? this.$refs.thongtinchunghoso.getthongtinchunghoso() : {}
      let thongtinchuhoso = this.$refs.thongtinchuhoso.thongTinChuHoSo
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso ? this.$refs.thongtinchuhoso.thongTinNguoiNopHoSo : {}
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphathoso = this.$refs.dichvuchuyenphathoso ? this.$refs.dichvuchuyenphathoso.dichVuChuyenPhatHoSo : ''
      // console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      if (validThongtinchuhoso['validForm']) {
        let passValid = false
        if (!validThongtinchuhoso['validApplicant']) {
          let x = confirm(validThongtinchuhoso['message'] + ' Bạn có muốn tiếp tục?')
          if (x) {
            passValid = true
          }
        } else { passValid = true }
        if (passValid) {
          if (!vm.$refs.thanhphanhoso.validDossierTemplate()) {
            return
          }
          if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
            return
          }
          if (dichvuchuyenphathoso && dichvuchuyenphathoso.vnpostalStatus === 1 && !vm.$refs.dichvuchuyenphathoso.validDichVuChuyenPhat()) {
            return
          }
          let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
          let dossierTemplates = thanhphanhoso
          let listAction = []
          let listDossierMark = []
          if (dossierFiles) {
            dossierFiles.forEach(function (value, index) {
              if (value.eForm) {
                value['dossierId'] = vm.dossierId
                listAction.push(vm.$store.dispatch('putAlpacaForm', value))
              }
            })
          }
          // if (vm.$refs.thanhphanhoso) {
          //   vm.$refs.thanhphanhoso.saveMark()
          // }
          let tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua, thongtinchunghoso)
          tempData['dossierId'] = vm.dossierId
          tempData['sampleCount'] = vm.thongTinChiTietHoSo.sampleCount
          tempData['originality'] = vm.originality
          tempData['dossierName'] = vm.briefNote
          // console.log('data put dossier -->', tempData)
          if (dichvuchuyenphathoso) {
            let vnpostal = {
              postalServiceName: dichvuchuyenphathoso.postalServiceCode,
              postalAddress: dichvuchuyenphathoso.postalAddress,
              postalCityCode: dichvuchuyenphathoso.postalCityCode,
              postalCityName: dichvuchuyenphathoso.postalCityName,
              postalDistrictCode: dichvuchuyenphathoso.postalDistrictCode,
              postalDistrictName: dichvuchuyenphathoso.postalDistrictName,
              postalWardCode: "",
              postalWardName: dichvuchuyenphathoso.postalWardName,
              postalTelNo: dichvuchuyenphathoso.postalTelNo
            }
            tempData['vnpostalStatus'] = dichvuchuyenphathoso.vnpostalStatus
            tempData['vnpostalProfile'] = vnpostal
            tempData['postalCityCode'] = dichvuchuyenphathoso.postalCityCode
            tempData['postalDistrictCode'] = dichvuchuyenphathoso.postalDistrictCode
          }
          setTimeout(function () {
            vm.$store.dispatch('putDossier', tempData).then(function (result) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              if (vm.formCode === 'UPDATE') {
                window.history.back()
                // vm.goBack()
              } else {
                var initData = vm.$store.getters.loadingInitData
                let actionUser = initData.user.userName ? initData.user.userName : ''
                let actionCodeRequest = vm.actionDetail.actionCode
                let dataPostAction = {
                  dossierId: vm.dossierId,
                  actionCode: actionCodeRequest,
                  actionNote: '',
                  actionUser: actionUser,
                  payload: '',
                  security: '',
                  assignUsers: '',
                  payment: vm.payments,
                  createDossiers: '',
                  dueDate: tempData.dueDate
                }
                vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
                  // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
                  let currentQuery = vm.$router.history.current.query
                  vm.$router.push({
                    path: '/danh-sach-ho-so/4/chi-tiet-ho-so/' + result.dossierId,
                    query: {
                      activeTab: 'tabs-1'
                    }
                  })
                  vm.tiepNhanState = false
                })
              }
            }).catch(function (xhr) {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
            // cập nhật notify config
            vm.updateNotifyConfig()
          }, 500)
        }
      }
    },
    tiepNhanHoSo (type) {
      let vm = this
      // console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      let thongtinchunghoso = this.$refs.thongtinchunghoso ? this.$refs.thongtinchunghoso.getthongtinchunghoso() : {}
      let thongtinchuhoso = this.$refs.thongtinchuhoso ? this.$refs.thongtinchuhoso.getThongTinChuHoSo() : {}
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso ? this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo() : []
      let thanhphanhoso = this.$refs.thanhphanhoso ? this.$refs.thanhphanhoso.dossierTemplateItems : ''
      let validThanhPhanHoSo = this.$refs.thanhphanhoso ? vm.$refs.thanhphanhoso.showValid() : {validForm: true}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso ? vm.$refs.thongtinchuhoso.showValid() : {validForm: true, validApplicant: true}
      let thongtinchuhosocongvan = vm.$refs.thongtinchuhosocongvan ? vm.$refs.thongtinchuhosocongvan.getThongTinChuHoSo() : {validation: true}
      
      if (validThongtinchuhoso['validForm'] && thongtinchuhosocongvan['validation'] && vm.$refs.formTenHoSo.validate() && validThanhPhanHoSo['validForm']) {
        let passValid = false
        if (!validThongtinchuhoso['validApplicant']) {
          let x = confirm(validThongtinchuhoso['message'] + ' Bạn có muốn tiếp tục?')
          if (x) {
            passValid = true
          }
        } else { passValid = true }
        if (passValid) {
          // console.log('valid confirm2', passValid)
          vm.loadingAction = true
          if (vm.$refs.thanhphanhoso && !vm.$refs.thanhphanhoso.validDossierTemplate()) {
            vm.loadingAction = false
            return
          }
          if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
            vm.loadingAction = false
            return
          }
          let dossierFiles = vm.$refs.thanhphanhoso ? vm.$refs.thanhphanhoso.dossierFilesItems : ''
          let dossierTemplates = thanhphanhoso
          let listAction = []
          let listDossierMark = []
          if (dossierFiles) {
            dossierFiles.forEach(function (value, index) {
              if (value.eForm) {
                value['dossierId'] = vm.dossierId
                listAction.push(vm.$store.dispatch('putAlpacaForm', value))
              }
            })
          }
          let tempData = ''
          if (!vm.mauCongVan) {
            tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua, thongtinchunghoso)
            
          } else {
            tempData = Object.assign(thongtinchuhosocongvan, dichvuchuyenphatketqua, thongtinchunghoso)
          }
          tempData['dossierId'] = vm.dossierId
          tempData['sampleCount'] = vm.thongTinChiTietHoSo.sampleCount
          tempData['dossierName'] = vm.briefNote
          tempData['originality'] = vm.originality
          tempData['fromViaPostal'] = vm.fromViaPostal ? 1 : 0

          let doAction = function () {
            vm.$store.dispatch('putDossier', tempData).then(function (result) {
              vm.loadingAction = false
              if (vm.formCode === 'UPDATE') {
                window.history.back()
              } else {
                var initData = vm.$store.getters.loadingInitData
                let actionUser = initData.user.userName ? initData.user.userName : ''
                //
                var paymentsOut = {}
                if (vm.showThuPhi) {
                  paymentsOut = {
                    requestPayment: vm.payments['requestPayment'],
                    paymentNote: vm.payments['paymentNote'],
                    advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                    feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                    serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                    shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
                  }
                  if (vm.isNotarization) {
                    let dataNotarization = vm.$refs.tailieuchungthuc.dataExport()
                    paymentsOut.feeAmount = dataNotarization.feeTotal
                  }
                }
                var payloadDate = {
                  'dueDate': vm.editableDate && tempData.dueDate ? tempData.dueDate : vm.dueDateEdit,
                  'receiveDate': vm.receiveDateEdit
                }
                if (vm.durationPhase) {
                  payloadDate = Object.assign(payloadDate, {durationPhase: vm.durationPhase})
                }
                // 
                payloadDate = Object.assign(tempData, payloadDate)
                // 
                let actionCodeRequest = vm.actionDetail.actionCode
                let dataPostAction = {
                  dossierId: vm.dossierId,
                  actionCode: actionCodeRequest,
                  actionNote: '',
                  actionUser: actionUser,
                  payload: payloadDate,
                  security: '',
                  assignUsers: '',
                  payment: paymentsOut,
                  createDossiers: ''
                }
                if (vm.thongTinChiTietHoSo.hasOwnProperty('allowAssignUser') && vm.thongTinChiTietHoSo.allowAssignUser === '1') {
                  dataPostAction.assignUsers = [{userId: initData.user.userId, userName: actionUser, assigned: 1}]
                }
                vm.loadingAction = true
                vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
                  vm.loadingAction = false
                  if (!type) {
                    vm.goBack()
                    vm.tiepNhanState = false
                  } else {
                    // tạo hồ sơ mới
                    let current = vm.$router.history.current
                    let newQuery = current.query
                    let dataCreateDossier = vm.$store.getters.getDataCreateDossier
                    vm.loadingAction = true
                    vm.$store.dispatch('postDossier', dataCreateDossier).then(function (result) {
                      vm.loadingAction = false
                      vm.dossierId = result.dossierId
                      vm.$refs.thongtinchunghoso.changeDossierNo(result.dossierNo)
                      let queryString = '?'
                      for (let key in newQuery) {
                        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
                          queryString += key + '=' + newQuery[key] + '&'
                        }
                      }
                      // console.log('queryString=====', queryString)
                      vm.$router.push({
                        path: '/danh-sach-ho-so/0/ho-so/' + result.dossierId + '/NEW' + queryString,
                        query: {
                          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                        }
                      })
                    }).catch(reject => {
                      vm.loadingAction = false
                    })
                  }
                }).catch(reject => {
                  vm.loadingAction = false
                })
              }
            }).catch(rejectXhr => {
              vm.loadingAction = false
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
            vm.updateNotifyConfig()
          }

          if (!vm.mauCongVan) {
            doAction()
          } else {
            //
            if (vm.mappingValidateGP) {
              for (let key in vm.mappingValidateGP) {
                vm.mappingValidateGP[key] = thongtinchuhosocongvan[vm.mappingValidateGP[key]]
              }
            } 
            let filterCheck = {
              formDataKey: vm.mappingValidateGP ? vm.mappingValidateGP : '',
              deliverableType: vm.mauGiayPhep
            }
            if (filterCheck.formDataKey === '') {
              doAction()
            } else {
              vm.$store.dispatch('checkDaCapPhep', filterCheck).then(function (result) {
                let userExits = false
                let quyetdinhItems = []
                let thongTinCapPhep = result.hasOwnProperty('data') ? result.data : []
                if (thongTinCapPhep.length > 0) {
                  userExits = true
                }
                if (userExits) {
                  let x = confirm('Đối tượng đã cấp phép. Bạn có muốn tiếp tục?')
                  if (x) {
                    doAction()
                  } else {
                    vm.loadingAction = false
                  }
                } else {
                  doAction()
                }
                
              }).catch(rejectXhr => {
                doAction()
              })
            }
            // 
          }
        }
      } else {
        toastr.error('Dữ liệu không hợp lệ')
        console.log(validThongtinchuhoso)
        vm.applicantIdRequired = validThongtinchuhoso['applicantIdRequired']
        console.log(validThongtinchuhoso['applicantIdRequired'])
       
      }
    },
    tiepNhanCongVan (type, isDraf) {
      let vm = this
      let thongtincongvan = this.$refs.thongtincongvan.getThongTinCongVan()
      let tempData = thongtincongvan
      tempData.dueDate = vm.dateTimeView(thongtincongvan.dueDate)
      tempData = Object.assign(tempData, {typeAction: type ? type : ''})
      console.log('data put congvan -->', tempData)
      let validateThongTinCongVan = true
      if (vm.formCode === 'NEW_GROUP_CV') {
        validateThongTinCongVan = thongtincongvan.validation
      }
      if (vm.formCode === 'NEW_GROUP_CV_DI' && isDraf === 'save') {
        // validateThongTinCongVan = true
        validateThongTinCongVan = thongtincongvan.validation
      } else {
        validateThongTinCongVan = thongtincongvan.validation
      }
      if (vm.formCode === 'NEW_GROUP_CV_DI' && isDraf === 'saveSend') {
        if (vm.hoSoDaXuLy.length > 0) {
          alert('Vui lòng xóa hồ sơ đã xử lý trước khi gửi công văn')
          return
        }
      }
      vm.loadingAction = true
      if (validateThongTinCongVan) {
        vm.$store.dispatch('putDossierCongVan', tempData).then(function (result) {
          let meta
          if (vm.formCode === 'NEW_GROUP_CV') {
            meta = thongtincongvan.metaData
          } else {
            let totalSubsidy_text = vm.currentcyToString(String(vm.totalFee))
            if (isDraf === 'save') {
              let metadataDraf = {
                congvandagui: false,
                donvinhan: '',
                tendonvinhan: '',
                donvinhandraf: thongtincongvan.metaData.donvinhan,
                tendonvinhandraf: thongtincongvan.metaData.tendonvinhan,
                actioncode: vm.formActionGroup.action,
                postStepCode: vm.postStepCodeCongVan,
                stepcode: vm.formActionGroup.hasOwnProperty('stepCode') ? vm.formActionGroup.stepCode : '',
                donvinhancollection: vm.formActionGroup.hasOwnProperty('donvinhan') ? vm.formActionGroup.donvinhan : '',
                requiredCVDenGovCode: vm.formActionGroup.hasOwnProperty('requiredCVDenGovCode') ? vm.formActionGroup.requiredCVDenGovCode : '',
                requiredCVDenGroupId: vm.formActionGroup.hasOwnProperty('requiredCVDenGroupId') ? vm.formActionGroup.requiredCVDenGroupId : '',
                totalSubsidy: vm.totalFee,
                totalSubsidyText: totalSubsidy_text
              }
              meta = Object.assign(thongtincongvan.metaData, metadataDraf)
            } else {
              let metadataDraf = {
                congvandagui: true, 
                actioncode: vm.formActionGroup.action, 
                postStepCode: vm.postStepCodeCongVan,
                stepcode: vm.formActionGroup.hasOwnProperty('stepCode') ? vm.formActionGroup.stepCode : '',
                donvinhancollection: vm.formActionGroup.hasOwnProperty('donvinhan') ? vm.formActionGroup.donvinhan : '',
                requiredCVDenGovCode: vm.formActionGroup.hasOwnProperty('requiredCVDenGovCode') ? vm.formActionGroup.requiredCVDenGovCode : '',
                requiredCVDenGroupId: vm.formActionGroup.hasOwnProperty('requiredCVDenGroupId') ? vm.formActionGroup.requiredCVDenGroupId : '',
                totalSubsidy: vm.totalFee,
                totalSubsidyText: totalSubsidy_text
              }
              meta = Object.assign(thongtincongvan.metaData, metadataDraf)
            }
            
          }
          
          let dataMetaData = {
            id: vm.dossierId,
            data: JSON.stringify(meta)
          }
          if (vm.formCode === 'NEW_GROUP_CV') {
            vm.$store.dispatch('putMetaData', dataMetaData).then(()=>{
              vm.loadingAction = false
              vm.$router.push({
                path: '/danh-sach-ho-so/' + vm.index + '/nhom-ho-so/' + vm.formCode + '/' + result.dossierId,
                query: vm.$router.history.current.query
              })
            }).catch(function() {
              vm.loadingAction = false
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại')
            })
            
          } else {
            vm.$store.dispatch('putMetaData', dataMetaData).then(()=>{
              let dataAddGroup = {
                groupDossierId: thongtincongvan.dossierId,
                dossierId: ''
              }
              let dossierIdArr = []
              for (let key in vm.dossiersIntoGroupRender) {
                dossierIdArr.push(vm.dossiersIntoGroupRender[key]['dossierId'])
              }
              dataAddGroup['dossierId'] = dossierIdArr.toString()
              vm.$store.dispatch('postDossierIntoGroup', dataAddGroup).then(function (result) {
                // tạo file in công văn
                if (vm.createFileCongVan) {
                  let filterFormData = {
                    dossierId: vm.dossierId,
                    partNo: vm.createFileCongVan
                  }
                  vm.$store.dispatch('loadFormData', filterFormData).then(function (result) {
                    let formData = JSON.parse(result) 
                    let formDataPut = Object.assign(formData, {tp: vm.createFileCongVan, dossierId: vm.dossierId})
                    vm.$store.dispatch('postEformCallBack', formData).then(function (result) {
                      if (isDraf === 'save') {
                        vm.loadingAction = false
                        toastr.success('Lưu công văn thành công')
                        vm.$router.push({
                          path: '/danh-sach-ho-so/' + vm.index + '/nhom-ho-so/' + vm.formCode + '/' + thongtincongvan.dossierId,
                          query: vm.$router.history.current.query
                        })
                      } else {
                        // do action dossierIntoGroup
                        vm.processAction()
                      }
                    })
                    
                  }).catch(function (reject) {
                  })
                } else {
                  if (isDraf === 'save') {
                    vm.loadingAction = false
                    toastr.success('Lưu công văn thành công')
                    vm.$router.push({
                      path: '/danh-sach-ho-so/' + vm.index + '/nhom-ho-so/' + vm.formCode + '/' + thongtincongvan.dossierId,
                      query: vm.$router.history.current.query
                    })
                  } else {
                    // do action dossierIntoGroup
                    vm.processAction()
                  }
                }
                
              })
            }).catch(function () {
              vm.loadingAction = false
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại')
            })
          }

        }).catch(rejectXhr => {
          vm.loadingAction = false
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại')
        })
      } else {
        vm.loadingAction = false
        toastr.clear()
        toastr.error('Dữ liệu không hợp lệ')
      }
      
    },
    boSungHoSo () {
      var vm = this
      // console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      let thongtinchunghoso = this.$refs.thongtinchunghoso.getthongtinchunghoso()
      let thongtinchuhoso = this.$refs.thongtinchuhoso.thongTinChuHoSo
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.thongTinNguoiNopHoSo
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      let lephi = this.$refs.lephi.lePhi
      let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua
      // console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      if (vm.$refs.thongtinchuhoso.showValid()) {
        let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
        let dossierTemplates = thanhphanhoso
        let listAction = []
        let listDossierMark = []
        if (dossierTemplates) {
          dossierTemplates.forEach(function (val, index) {
            if (val.partType === 1) {
              val['dossierId'] = vm.dossierId
              listDossierMark.push(vm.$store.dispatch('postDossierMark', val))
            }
          })
          dossierFiles.forEach(function (value, index) {
            if (value.eForm) {
              value['dossierId'] = vm.dossierId
              listAction.push(vm.$store.dispatch('putAlpacaForm', value))
            }
          })
        }
        Promise.all(listDossierMark).then(values => {
        }).catch(function (xhr) {
        })
        Promise.all(listAction).then(values => {
          // console.log(values)
          let tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, thanhphanhoso, lephi, dichvuchuyenphatketqua, thongtinchunghoso)
          // console.log('data put dossier -->', tempData)
          tempData['dossierId'] = vm.dossierId
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            let dataPostAction = {
              dossierId: vm.dossierId,
              actionCode: 7100,
              payload: '',
              security: '',
              assignUsers: {},
              payment: {},
              createDossiers: {},
              dueDate: tempData.dueDate
            }
            vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
            })
          })
          // 
          vm.updateNotifyConfig()
        }).catch(reject => {
        })
      }
    },
    changeViapostal (viapostal) {
      if (viapostal) {
        this.viaPortalDetail = 2
      } else {
        this.viaPortalDetail = 1
      }
    },
    // 
    tiepNhanNhomHoSo (type) {
      var vm = this
      vm.$store.commit('setPrintPH', false)
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      vm.loadingAction = true
      if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
        vm.loadingAction = false
        return
      }
      let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
      let dossierTemplates = thanhphanhoso
      let listAction = []
      let listDossierMark = []
      if (dossierFiles) {
        dossierFiles.forEach(function (value, index) {
          if (value.eForm) {
            value['dossierId'] = vm.dossierId
            listAction.push(vm.$store.dispatch('putAlpacaForm', value))
          }
        })
      }
      // if (vm.$refs.thanhphanhoso) {
      //   vm.$refs.thanhphanhoso.saveMark()
      // }
      var tempData = Object.assign(thongtinnguoinophoso, dichvuchuyenphatketqua)
      tempData['sampleCount'] = vm.thongTinChiTietHoSo.sampleCount
      tempData['dossierName'] = vm.briefNote
      console.log('data put dossier -->', tempData)
      let dataCreateGroup = {
        serviceCode: vm.thongTinChiTietHoSo.serviceCode,
        govAgencyCode: vm.thongTinChiTietHoSo.govAgencyCode,
        templateNo: vm.thongTinChiTietHoSo.dossierTemplateNo,
        originality: 9
      }
      vm.$store.dispatch('postDossier', dataCreateGroup).then(function (result) {
        tempData['dossierId'] = result.dossierId
        vm.$store.dispatch('putDossier', tempData).then(function (result) {
          vm.loadingAction = false
          vm.$router.push({
            path: '/danh-sach-ho-so/0/nhom-ho-so/' + vm.formCode + '/' + result.dossierId,
            query: vm.$router.history.current.query
          })
        }).catch(rejectXhr => {
          vm.loadingAction = false
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại')
        })
        // 
        vm.updateNotifyConfig()
      })
    },
    // 
    tiepNhanHoSoNewTemplate (type) {
      let vm = this
      let dataCreate = {
        originality: vm.getOriginality(),
        serviceCode: $('#serviceCode_hidden').val(),
        govAgencyCode: $('#govAgencyCode_hidden').val(),
        templateNo: $('#dossierTemplateNo_hidden').val(),
        dossiers: ''
      }
      let dataFormTemplate = window.$('#formAlpacaNewTemplate').alpaca('get').getValue()
      let dataFilter = dataFormTemplate
      for (let i in dataFilter) {
        if (String(i).indexOf('_') >= 0) {
          delete dataFilter[i]
        }
      }
      dataCreate['dossiers'] = JSON.stringify(dataFilter['dossiers'])
      dataCreate['dossierFileArr'] = JSON.stringify(dataFilter['dossierFileArr'])
      dataCreate['dossierMarkArr'] = JSON.stringify(dataFilter['dossierMarkArr'])
      dataCreate['payment'] = JSON.stringify(dataFilter['payment'])
      if (String($('#validate_required').val()) === 'true' ) {
        vm.loadingAction = true
        vm.$store.dispatch('postDossierNewVersion', dataCreate).then(function (result) {
          vm.loadingAction = false
          vm.$store.commit('setActivePrintBienNhan', result.dossierId)
          vm.goBack()         
        }).catch(reject => {
          vm.loadingAction = false
        })
      } else {
        toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
        return
      }
    },
    getDetailActionCongVan () {
      let vm = this
      let filter = {
        dossierId: vm.dossierId,
        stepCode: vm.formActionGroup.stepCode,
        actionCode: vm.formActionGroup.action
      }
      vm.$store.dispatch('getDetailActionCongVan', filter).then(result => {
        let createFileCongVan
        if (result.createDossierFiles) {
          let createDossierFilesArr = result.createDossierFiles.split(',')
          for (let index = 0; index < vm.tphsCV.length; index++) {
            let exits = createDossierFilesArr.filter(function(item) {
              return item === vm.tphsCV[index]['partNo']
            })
            if (exits.length > 0 && vm.tphsCV[index]['partType'] === 7 && vm.tphsCV[index]['hasForm']) {
              createFileCongVan = vm.tphsCV[index]['partNo']
            }
          }
        }
        
        vm.createFileCongVan = createFileCongVan
        vm.postStepCodeCongVan = result.postStepCode
      })
    },
    getNotifyConfig (id) {
      let vm = this
      if (!vm.notifyConfig || vm.originality !== 3) {
        return
      }
      let filter1 = {
        dossierId: id,
        key: 'smsNotify'
      }
      vm.$store.dispatch('getNotifyConfig', filter1).then(result => {
        if (String(result) === 'true') {
          vm.smsNotify = true
        } else {
          vm.smsNotify = false
        }
      })
      let filter2 = {
        dossierId: id,
        key: 'emailNotify'
      }
      vm.$store.dispatch('getNotifyConfig', filter2).then(result => {
        vm.emailNotify = result
        if (String(result) === 'true') {
          vm.emailNotify = true
        } else {
          vm.emailNotify = false
        }
      })
    },
    updateNotifyConfig () {
      let vm = this
      if (!vm.notifyConfig || vm.originality !== 3) {
        return
      }
      let filter = {
        dossierId: vm.dossierId,
        smsNotify: vm.smsNotify,
        emailNotify: vm.emailNotify
      }
      vm.$store.dispatch('putNotifyConfig', filter).then(result => {})
    },
    showHDTT () {
      let vm = this
      vm.applicantNameGuide = $('#delegateName').val()
      vm.applicantAddressGuide = $('#delegateAddress').val()
      if ($('#select2-delegateWardCode-container').text() && $('#select2-delegateWardCode-container').text().indexOf('/')< 0) {
        vm.applicantAddressGuide += (', ' + $('#select2-delegateWardCode-container').text())
        if (!$('#delegateAddress').val()) {
          vm.applicantAddressGuide.replace(/,/g, '')
        }
      }
      if ($('#select2-delegateDistrictCode-container').text() && $('#select2-delegateDistrictCode-container').text().indexOf('/')< 0) {
        vm.applicantAddressGuide += (', ' + $('#select2-delegateDistrictCode-container').text())
      }
      if ($('#select2-delegateCityCode-container').text() && $('#select2-delegateCityCode-container').text().indexOf('/')< 0) {
        vm.applicantAddressGuide += (', ' + $('#select2-delegateCityCode-container').text())
      }
      vm.applicantTelNoGuide = $('#delegateTelNo').val()
      vm.applicantEmailGuide = $('#delegateEmail').val()
      vm.dialog_printGuide = true
      vm.$refs.formDenied.resetValidation()
    },
    showTCTN () {
      let vm = this
      vm.applicantNameGuide = $('#delegateName').val()
      vm.applicantAddressGuide = $('#delegateAddress').val()
      if ($('#select2-delegateWardCode-container').text() && $('#select2-delegateWardCode-container').text().indexOf('/')< 0) {
        vm.applicantAddressGuide += (', ' + $('#select2-delegateWardCode-container').text())
        if (!$('#delegateAddress').val()) {
          vm.applicantAddressGuide.replace(/,/g, '')
        }
      }
      if ($('#select2-delegateDistrictCode-container').text() && $('#select2-delegateDistrictCode-container').text().indexOf('/')< 0) {
        vm.applicantAddressGuide += (', ' + $('#select2-delegateDistrictCode-container').text())
      }
      if ($('#select2-delegateCityCode-container').text() && $('#select2-delegateCityCode-container').text().indexOf('/')< 0) {
        vm.applicantAddressGuide += (', ' + $('#select2-delegateCityCode-container').text())
      }
      vm.applicantTelNoGuide = $('#delegateTelNo').val()
      vm.applicantEmailGuide = $('#delegateEmail').val()
      vm.dialog_denied = true
      vm.$refs.formDenied.resetValidation()
    },
    doGuiding (type) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.$refs.formGuide.validate()) {
        vm.loadingAction = true
        let partNoRequired = []
        for (let key in vm.tphsGuide) {
          if (!vm.tphsGuide[key]['fileMark']) {
            partNoRequired.push(vm.tphsGuide[key]['partNo'])
          }
        }
        let filter = {
          serviceConfigId: currentQuery.hasOwnProperty('service_config') && currentQuery.service_config ? currentQuery.service_config : '',
          serviceCode: vm.serviceCode_hidden,
          serviceName: vm.serviceName_hidden,
          templateNo: vm.dossierTemplateNo_hidden,
          applicantName: vm.applicantNameGuide,
          applicantAddress: vm.applicantAddressGuide,
          applicantEmail: vm.applicantEmailGuide,
          applicantTelNo: vm.applicantTelNoGuide,
          govAgencyCode: vm.govAgencyCode_hidden,
          govAgencyName: vm.govAgencyName_hidden,
          typeCode: 'DOC_03',
          partNo: partNoRequired.toString(),
          applicantNote: vm.applicantNoteGuide,
          type: 'completed',
          applicantType: vm.applicantTypeGuide ? 'citizen' : 'business'
        }
        if (type === 'doc') {
          filter['reportType'] = 'word'
        }
        if (type !== 'doc') {
          vm.tiltleDialog = 'Phiếu hướng dẫn hoàn thiện hồ sơ'
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
        }
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.loadingAction = false
          vm.dialog_printGuide = false
          vm.dialogPDFLoading = false
          if (type !== 'doc') {
            document.getElementById('dialogPDFPreview').src = result
          }
        }).catch(function () {
          vm.loadingAction = false
        })
      }
    },
    doDenied (type) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.$refs.formDenied.validate()) {
        vm.loadingAction = true
        let filter = {
          serviceConfigId: currentQuery.hasOwnProperty('service_config') && currentQuery.service_config ? currentQuery.service_config : '',
          serviceCode: vm.serviceCode_hidden,
          serviceName: vm.serviceName_hidden,
          templateNo: vm.dossierTemplateNo_hidden,
          applicantName: vm.applicantNameGuide,
          applicantAddress: vm.applicantAddressGuide,
          applicantEmail: vm.applicantEmailGuide,
          applicantTelNo: vm.applicantTelNoGuide,
          govAgencyCode: vm.govAgencyCode_hidden,
          govAgencyName: vm.govAgencyName_hidden,
          typeCode: 'DOC_03',
          applicantNote: vm.applicantNoteGuide,
          type: 'denied',
          applicantType: vm.applicantTypeGuide ? 'citizen' : 'business'
        }
        if (type === 'doc') {
          filter['reportType'] = 'word'
        }
        if (type !== 'doc') {
          vm.tiltleDialog = 'Phiếu từ chối tiếp nhận'
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
        }
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.loadingAction = false
          vm.dialog_denied = false
          vm.dialogPDFLoading = false
          if (type !== 'doc') {
            document.getElementById('dialogPDFPreview').src = result
          }
        }).catch(function () {
          vm.loadingAction = false
        })
      }
    },
    viewDetail (item, indexItem) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.$router.push('/danh-sach-ho-so/0/chi-tiet-ho-so/' + item['dossierId'])
    },
    removeDossierFromGroup (itemRemove) {
      let vm = this
      let items = vm.dossiersIntoGroupRender.filter(function(item) {
        return item.dossierId !== itemRemove.dossierId
      })
      vm.$store.commit('setDossierSelectedDoAction', items)
    },
    removeAllDossierFromGroup () {
      let vm = this
      let items = vm.dossiersIntoGroupRender.filter(function(item) {
        return String(item.stepCode) === String(vm.formActionGroup.stepCode)
      })
      vm.$store.commit('setDossierSelectedDoAction', items)
    },
    processAction () {
      let vm = this
      vm.loadingAction = true
      let initData = vm.$store.getters.loadingInitData
      let actionUser = initData.user.userName ? initData.user.userName : ''
      let filter = {
        dossierId: vm.dossierId,
        actionCode: vm.formActionGroup.action,
        actionUser: actionUser
      }
      if (vm.dossiersIntoGroupRender.length > 0) {
        vm.$store.dispatch('doActionDossierIntoGroup', filter).then(function (result) {
          vm.loadingAction = false
          toastr.success('Lưu và gửi công văn thành công')
          vm.$router.push({
            path: '/danh-sach-ho-so/' + vm.index,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
              q: vm.menuConfigsToDo[vm.index]['queryParams']
            }
          })
        }).catch(function (reject) {
          vm.loadingAction = false
        })
      } else {
        vm.loadingAction = false
      }
      
    },
    createFileKqCongVan () {
      let vm = this
      let filter = {
        dossierId: vm.dossierId,
        partNo: vm.createFileCongVan
      }
      vm.$store.dispatch('loadFormData', filter).then(function (result) {
        let formData = JSON.parse(result) 
        let formDataPut = Object.assign(formData, {tp: vm.createFileCongVan, dossierId: vm.dossierId})
        vm.$store.dispatch('postEformCallBack', formData).then(function (result) {})
        
      }).catch(function (reject) {
      })
      
    },
    copyFileDossierIntoGroup () {
      let vm = this
      // copy file 
      let dossierIdIntoGroup = vm.dossiersIntoGroupRender.map(obj =>{ 
        return obj.dossierId
      }).toString()
      let filesKq = vm.$refs.thongtincongvan.getFileCongVan()
      let files = vm.filesKq.filter(function(item) {
        return (item['dossierPartType'] === 7 && item['dossierPartNo'] === vm.createFileCongVan)
      })
      if (files.length > 0 && dossierIdIntoGroup.length > 0) {
        let dossierFileIds = files.map(obj =>{ 
          return obj.dossierFileId
        }).toString()
        let filterCopyFile = {
          dossierIds: dossierIdIntoGroup,
          dossierFileId: dossierFileIds
        }
        vm.$store.dispatch('uploadFileDossierGroup', filterCopyFile).then(function (resultFile) {
        })
      }
      // 
    },
    getMetaData (val) {
      let metaDataOut = ''
      try {
        metaDataOut = JSON.parse(val.metaData)
      } catch (error) {
      }
      return metaDataOut
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    },
    paggingData (config) {
      let vm = this
      vm.pagination.page = config.page
      let start = vm.pagination.page * vm.pagination.rowsPerPage - vm.pagination.rowsPerPage
      let end = vm.pagination.page * vm.pagination.rowsPerPage
      vm.dossiersIntoGroupRenderTemp = vm.dossiersIntoGroupRender.slice(start, end)
    },
    //
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDateToTimestamp (date) {
      if (!date) {
        return null
      }
      let [day, month, year] = `${date}`.split('/')
      let day2 = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      if (new Date(day2) == 'Invalid Date') {
        return ''
      } else {
        return (new Date(day2)).getTime()
      }
    },
    parseDate (date) {
      try {
        let [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } catch (error) {
        return ''
      }
    },
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (vm.isOffLine) {
        vm.$router.push({
          path: '/add-dvc/0'
        })
      } else {
        vm.$router.push({
          path: '/danh-sach-ho-so/' + currentParams.index,
          query: currentQuery
        })
      }
    },
    goBackHistory () {
      window.history.back()
    },
    getThongTinValidateGp (serverNoConfig) {
      let vm = this
      let filter = {
        serverNo: serverNoConfig
      }
      vm.$store.dispatch('getServerConfig', filter).then(function (result) {
        let configs = JSON.parse(result.configs)
        vm.mauGiayPhep = configs.deliverableType
        vm.mappingValidateGP = configs.mapping
        console.log('mauGiayPhep', vm.mauGiayPhep, vm.mappingValidateGP)
      }).catch(function (reject) {
      })
    },
    getSearchParams (strings, key) {
      let value = ""
      let headers = strings.split(",")
      headers.forEach(function (header) {
        header = header.split("=")
        let keyHeader = header[0]
        if (keyHeader === key) {
          value = header[1]
        }
      })
      return value
    },
    currentcyToString (so) {
      var i;
      var j;
      var kq = "";
      var l;
      var dk;
      var tmp = "";
      var check = false;
      var a = new Array(32);
      while (so.length > 0 && so.charAt(0) == "0"){
        so = so.substring(1,so.length);
      }
      l = so.length;
      if (l > 28){
        return "So khong hop le";
      }
          for (var i=1;i<=l;i++){
            so = so.replace(',','');
          }
          l = so.length;
      for (var i=1;i<=l;i++){
        a[i] = parseInt(so.charAt(i-1));
      }
      //Bat dau doc tu trai sang phai
      for (var i=1;i<=l;i++){
      
        if((l - i) % 3 == 2 && a[i] == 0 && (l - i >= 2)) {
          if (a[i + 1] != 0 || a[i + 2] != 0) {
            kq = kq + "không ";
          }
        }

        if (a[i] == 2){  kq = kq + "hai ";}
        if (a[i] == 3){  kq = kq + "ba ";}
        if (a[i] == 6){  kq = kq + "sáu ";}
        if (a[i] == 7){  kq = kq + "bảy ";}
        if (a[i] == 8){  kq = kq + "tám ";}
        if (a[i] == 9){  kq = kq + "chín ";}
        
        //Xu ly cach doc so 4
        if (a[i] == 4) {
          if (i > 1 && (l - i) % 3 == 0){
            if (a[i - 1] > 1){
              kq = kq + "tư ";
            }else{
              kq = kq + "bốn ";
            }
          }else{
            kq = kq + "bốn ";
          }
        }

        //Xu ly cach doc so 5
        if (a[i] == 5){
          if (i > 1 && (l - i)% 3 == 0){
            if (a[i - 1] != 0 ){
              kq = kq + "lăm ";
            }else{
              kq = kq + "năm ";
            }
          }else{
            kq = kq + "năm ";
          }
        } 
      
        //Xu ly cach doc so 1
        if (a[i] == 1) {
          //doc la muoi neu no la hang chuc
          if ((l - i) % 3 == 1) {
            kq = kq + "mười ";	//doc la mot neu la hang don vi	//va hang chuc >1
          }else{
            if ((l - i) % 3 == 0 && (i > 1)){
              if (a[i - 1] > 1){
                kq = kq + "mốt ";
              }else{
                kq = kq + "một ";
              }
            }else{
              kq = kq + "một ";
            }
          }
        } 
        if ((l - i) % 3 == 1 && a[i] != 0 && a[i] != 1){
          kq = kq + "mươi ";
        }
        
        if ((l - i) % 3 == 1 && a[i] == 0 && a[i + 1] != 0){
          kq = kq + "linh ";
        }
        
        if ((l - i) % 3 == 2 && (a[i + 1] != 0 || a[i + 2] != 0)){
          kq = kq + "trăm ";
        }
        
        if ((i + 2) <= l) {
          if (a[i] != 0 && (l - i) % 3 == 2){
            if (a[i + 1] == 0 && a[i + 2] == 0){
              kq = kq + "trăm ";
            }
          }
        }
        
        if ((l - i) == 3){ kq = kq + "nghìn ";}
        if ((l - i) == 6){ kq = kq + "triệu ";}
        if ((l - i) == 9){ kq = kq + "tỷ ";}
        
        if ((l - i) == 12){
          check = true;
          for (j=i+1;i<l;i++){
            if (a[i + 1] != 0){ 
              check = false;
            }
          }
          if (check == false) {
            kq = kq + "nghìn ";
          }else{
            kq = kq + "nghìn tỷ ";
          }
        }

        if ((l - i) == 15){ kq = kq + "triệu tỷ ";}
        if ((l - i) == 18){ kq = kq + "tỷ tỷ ";}
        if ((l - i) == 21){ kq = kq + "nghìn tỷ tỷ ";}
        if ((l - i) == 24){ kq = kq + "triệu tỷ tỷ ";}
        if ((l - i) == 27){ kq = kq + "tỷ tỷ tỷ ";}
        if ((l - i) == 30){ kq = kq + "nghìn tỷ tỷ ";}
      
        //Xu ly bo 3 so khong
        if (((l - i) % 3 == 2) && (a[i] == 0) && (a[i + 1] == 0) && (a[i + 2] == 0)){
          i = i + 2;
        }
      
        //Xu ly tat ca so khong con lai
        if ((l - i) % 3 == 0){
          dk = 1;
          for (j=i+1;j<=l;j++){
            if (a[j] != 0){
              dk = 0;
            }
          }
        }
        if (dk == 1){
          break;
        }
        
      }
    
          //Viet hoa chu cai dau tien
          if (kq == "") kq = "không "
          while (kq.charAt(kq.length) == ","){
              kq = kq.substring(0,kq.length-1);
          }
          kq = kq.charAt(0).toUpperCase() + kq.substring(1,kq.length);
      if (kq!="So khong hop le")
      {
        kq = kq +"đồng chẵn";
      }else{
        kq = kq ;
      }
      return kq
    },
  }
}
</script>
