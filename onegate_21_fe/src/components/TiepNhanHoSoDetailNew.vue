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
            <span v-else>THÊM MỚI HỒ SƠ</span> 
          </div>
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
        <thong-tin-chu-ho-so ref="thongtinchuhoso" :requiredConfig="requiredConfigData" :formCode="formCode" :showApplicant="formCode === 'NEW_GROUP' ? true : false" :showDelegate="isNotarization ? true : false"></thong-tin-chu-ho-so>
        <!--  -->
        <div v-if="!isNotarization">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                <span v-if="formCode === 'NEW_GROUP'">Tên nhóm hồ sơ</span>
                <span v-else>Tên hồ sơ</span>
                <!-- <span v-else>Nội dung giải quyết</span> -->
                &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div>
                <v-card>
                  <v-card-text>
                    <v-textarea
                      v-model="briefNote"
                      :rows="2"
                      box
                      :label="formCode === 'NEW_GROUP' ? 'Nhập tên nhóm hồ sơ' : 'Nhập tên hồ sơ'"
                    ></v-textarea>
                    <!-- <v-textarea
                      v-model="briefNote"
                      :rows="2"
                      box
                      :label="formCode === 'NEW_GROUP' ? 'Nhập tên nhóm hồ sơ' : 'Nhập nội dung giải quyết'"
                    ></v-textarea> -->
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
              <thanh-phan-ho-so ref="thanhphanhoso" :formCodeInput="formCode"  :onlyView="formCode === 'NEW_GROUP' ? true : false" :id="'nm'" :partTypes="formCode === 'NEW_GROUP' ? inputTypesGroup : inputTypes"></thanh-phan-ho-so>
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
        <!-- <div style="position: relative;" v-if="viaPortalDetail !== 0 && originality === 1">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content hide-actions value="2">
              <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát hồ sơ</div>
              <dich-vu-chuyen-phat-ho-so ref="dichvuchuyenphathoso" @changeViapostal="changeViapostal"></dich-vu-chuyen-phat-ho-so>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div> -->
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
        <v-tabs icons-and-text centered class="mb-4">
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
          <v-tab href="#tab-5" class="px-0 py-0">
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
          <input id="dossiers_hidden" type="text">
          <input id="dossierFileArr_hidden" type="text">
          <input id="dossierMarkArr_hidden" type="text">
          <input id="payment_hidden" type="text">
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
            <div id="formAlpacaNewTemplate" class="mb-5 pt-0" v-if="serviceCode_hidden !== 'BNG-270821' && serviceCode_hidden !== 'BNG-270817'"></div>
            <thu-tuc-cap-ho-chieu-ngoai-giao-cong-vu v-if="serviceCode_hidden === 'BNG-270821'" :formCode="formCode" :id="id"></thu-tuc-cap-ho-chieu-ngoai-giao-cong-vu>
            <thu-tuc-hop-phap-hoa-lanh-su v-if="serviceCode_hidden === 'BNG-270817'"  :formCode="formCode" :id="id"></thu-tuc-hop-phap-hoa-lanh-su>
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
import ThuTucCapHoChieuNgoaiGiaoCongVu from './TiepNhan/ThuTucCapHoChieuNgoaiGiaoCongVu.vue'
import ThuTucHopPhapHoaLanhSu from './TiepNhan/ThuTucHopPhapHoaLanhSu.vue'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index', 'id', 'formCode'],
  components: {
    'thong-tin-chu-ho-so': ThongTinChuHoSo,
    'thanh-phan-ho-so': ThanhPhanHoSo,
    'tai-lieu-chung-thuc': TaiLieuChungThuc,
    'thong-tin-chung': ThongTinChung,
    'thu-phi': LePhi,
    'dich-vu-chuyen-phat-ho-so': DichVuChuyenPhatHoSo,
    'dich-vu-chuyen-phat-ket-qua': DichVuChuyenPhatKetQua,
    'thu-tuc-cap-ho-chieu-ngoai-giao-cong-vu': ThuTucCapHoChieuNgoaiGiaoCongVu,
    'thu-tuc-hop-phap-hoa-lanh-su': ThuTucHopPhapHoaLanhSu
  },
  data: () => ({
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
    viaPortalDetail: 0,
    showThuPhi: false,
    inputTypes: [1, 3, 6],
    inputTypesGroup: [6],
    outputTypes: [2],
    sampleCount: 0,
    isMobile: false,
    loadingAction: false,
    loadingForm: false,
    notifyConfig: false,
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
    actionDetail: ''
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
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
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.dossierId = vm.id
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
        vm.briefNote = vm.briefNote + ' cho ông/bà ' + vm.thongTinChuHoSo['applicantName']
      }
      // end
      if (vm.formCode === 'UPDATE') {
        vm.briefNote = vm.thongTinChiTietHoSo.dossierName ? vm.thongTinChiTietHoSo.dossierName : vm.thongTinChiTietHoSo.serviceName
      }
    }
  },
  methods: {
    onResize () {
      let vm = this
      let isMobile = window.innerWidth < 1024
      vm.isMobile = isMobile
    },
    initData: function (data) {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      let filter = {
        dossierTemplateNo: currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
      }
      vm.dossierTemplateNo_hidden = currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
      vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result) {
        try {
          vm.requiredConfigData = result['formMeta'] ? JSON.parse(result['formMeta']) : false
        } catch (error) {
        }
        vm.templateName = result['templateName']
        vm.templateDescription = result['description']
        if (result['newFormScript']) {
          vm.data_form_template = eval("( " + result['newFormScript'] + " ) ")
          // console.log('data_form_template', vm.data_form_template)
          vm.formTemplate = 'version_2.0'
          vm.loadingForm = true
          let filterServiceConfig = {
            serviceConfigId: currentQuery.hasOwnProperty('service_config') && currentQuery.service_config ? currentQuery.service_config : ''
          }
          if (currentQuery.hasOwnProperty('service_config') && currentQuery.service_config) {
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
          } 
          else {
            vm.loadingForm = false
            vm.serviceCode_hidden = currentQuery.hasOwnProperty('serviceCode') && currentQuery.serviceCode ? currentQuery.serviceCode : ''
          }
          

        } else {
          vm.formTemplate = 'version_1.0'
          vm.$store.dispatch('getDetailDossier', data).then(result => {
            vm.dossierId = result.dossierId
            vm.briefNote = result.serviceName ? result.serviceName : ''
            if (vm.formCode === 'UPDATE') {
              vm.briefNote = result.dossierName ? result.dossierName : result.serviceName
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
                    vm.actionDetail = actionList[0]
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
                    if (resAction && resAction.payment && resAction.payment.requestPayment > 0) {
                      vm.showThuPhi = true
                      vm.payments = resAction.payment
                    }
                    // call initData thong tin chung ho so
                    if (vm.$refs.thongtinchunghoso) {
                      vm.$refs.thongtinchunghoso.initData(result)
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
            vm.$refs.thongtinchuhoso.initData(result)
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
                vm.$refs.thanhphanhoso.initData(result)
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
              postalWardCode: dichvuchuyenphathoso.postalWardCode,
              postalWardName: dichvuchuyenphathoso.postalWardName,
              postalTelNo: dichvuchuyenphathoso.postalTelNo
            }
            tempData['vnpostalStatus'] = dichvuchuyenphathoso.vnpostalStatus
            tempData['vnpostalProfile'] = vnpostal
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
                let dataPostAction = {
                  dossierId: vm.dossierId,
                  actionCode: vm.actionDetail.actionCode,
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
      var vm = this
      // console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      var thongtinchunghoso = this.$refs.thongtinchunghoso.getthongtinchunghoso()
      let thongtinchuhoso = this.$refs.thongtinchuhoso.getThongTinChuHoSo()
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso ? this.$refs.thanhphanhoso.dossierTemplateItems : ''
      // let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
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
          var tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua, thongtinchunghoso)
          tempData['dossierId'] = vm.dossierId
          tempData['sampleCount'] = vm.thongTinChiTietHoSo.sampleCount
          tempData['dossierName'] = vm.briefNote
          tempData['originality'] = vm.originality
          // console.log('data put dossier -->', tempData)
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            vm.loadingAction = false
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            if (vm.formCode === 'UPDATE') {
              // vm.goBack()
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
              let dataPostAction = {
                dossierId: vm.dossierId,
                actionCode: vm.actionDetail.actionCode,
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
            // console.log('rejectXhr==========', rejectXhr)
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
          // 
          vm.updateNotifyConfig()
        }
      } else {
        toastr.error('Vui lòng điền đầy đủ thông tin bắt buộc')
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
            path: '/danh-sach-ho-so/0/nhom-ho-so/' + result.dossierId,
            query: vm.$router.history.current.query
          })
          // var initData = vm.$store.getters.loadingInitData
          // let actionUser = initData.user.userName ? initData.user.userName : ''
          // //
          // var paymentsOut = {}
          // if (vm.showThuPhi) {
          //   paymentsOut = {
          //     requestPayment: vm.payments['requestPayment'],
          //     paymentNote: vm.payments['paymentNote'],
          //     advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
          //     feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
          //     serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
          //     shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
          //   }
          // }
          // let dataPostAction = {
          //   dossierId: result.dossierId,
          //   actionCode: 1100,
          //   actionNote: '',
          //   actionUser: actionUser,
          //   payload: '',
          //   security: '',
          //   assignUsers: '',
          //   payment: paymentsOut,
          //   createDossiers: ''
          // }
          // vm.loadingAction = true
          // vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
          //   vm.loadingAction = false
          //   vm.$router.push({
          //     path: '/danh-sach-ho-so/0/nhom-ho-so/' + result.dossierId,
          //     query: vm.$router.history.current.query
          //   })
          // }).catch(reject => {
          //   vm.loadingAction = false
          // })
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
        dossiers:  $('#dossiers_hidden').val(),
        dossierFileArr:  $('#dossierFileArr_hidden').val(), 
        dossierMarkArr:  $('#dossierMarkArr_hidden').val(),
        payment:  $('#payment_hidden').val(),
      }
      let dossiers = JSON.parse($('#dossiers_hidden').val())
      if (dossiers.delegateName) {
        if(vm.formCode === 'NEW'){
          vm.loadingAction = true
          vm.$store.dispatch('postDossierNewVersion', dataCreate).then(function (result) {
            vm.loadingAction = false
            vm.$store.commit('setActivePrintBienNhan', result.dossierId)
            vm.goBack() 
          }).catch(reject => {
            vm.loadingAction = false
          })
        } else {
          let dataPUTDossier = {
            id: vm.id,
            dossier: dossiers
          }

          vm.loadingAction = true
          vm.$store.dispatch('putDossierNew', dataPUTDossier).then(function (result) {
            let metaData = JSON.parse(dossiers.metaData)
            let dataMetaData = {
              id: vm.id,
              data: {
                dossierFileCustom: metaData.dossierFileCustom,
                ma_to_khai: metaData.ma_to_khai,
                totalRecord: metaData.totalRecord,
                dossierFilePayment: metaData.dossierFilePayment,
                Doan_HCTN: metaData.Doan_HCTN
              }

            }
            vm.$store.dispatch('putMetaData', dataMetaData).then(()=>{
              console.log(result)
              let dossierFile = JSON.parse($('#dossierFileArr_hidden').val())
              dossierFile.forEach(async (e)=>{
                if(vm.serviceCode_hidden === 'BNG-270821'){
                  if(e.partNo === 'TP01' || e.partNo === 'TP02'){
                    let dataPUTDossierFile = {
                      id: vm.id,
                      referenceUid: e.referenceUid,
                      formData: e.formData
                    }
                    await vm.$store.dispatch('putDossierFileNew', dataPUTDossierFile).then( result2 => {

                    }).catch(reject=>{
                      
                    })
                  }
                }
                if(vm.serviceCode_hidden === 'BNG-270817'){
                  if(e.partNo === 'TP01'){
                    let dataPUTDossierFile = {
                      id: vm.id,
                      referenceUid: e.referenceUid,
                      formData: e.formData
                    }
                    await vm.$store.dispatch('putDossierFileNew', dataPUTDossierFile).then( result2 => {

                    }).catch(reject=>{
                      
                    })
                  }
                }

              })
              vm.loadingAction = false
              vm.$store.commit('setActivePrintBienNhan', result.dossierId)
              vm.goBack()
            }).catch(err=> {
              vm.loadingAction = false
            })
 


          }).catch(reject => {
            vm.loadingAction = false
          })
        }
      } else {
        toastr.error('Vui lòng nhập đầy đủ thông tin bắt buộc')
        return
      }
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
    // 
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
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      delete currentQuery['template_no']
      delete currentQuery['serviceCode']
      delete currentQuery['service_config']
      if (vm.isOffLine) {
        vm.$router.push({
          path: '/add-dvc/0'
        })
      } else {
        // vm.$router.push({
        //   path: '/danh-sach-ho-so/' + currentParams.index,
        //   query: currentQuery
        // })
        window.history.back()
      }
    },
    goBackHistory () {
      window.history.back()
    }
  }
}
</script>
