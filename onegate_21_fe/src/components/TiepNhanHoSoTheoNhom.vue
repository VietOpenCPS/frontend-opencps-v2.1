<template>
  <div>
    <v-form v-model="validTNHS" ref="formTiepNhanHoSo" lazy-validation>
      <!-- Thông tin nhóm hồ sơ -->
      <div class="row-header">
        <div class="background-triangle-big">
          <span v-if="formCode === 'NEW_GROUP'">THÔNG TIN NHÓM HỒ SƠ</span>
          <span v-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'">
            <span v-if="!activeAddDossierIntoGroup">THÔNG TIN CÔNG VĂN</span>
            <span v-else>THÊM MỚI HỒ SƠ</span>
          </span>
        </div>
        <div class="layout wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" :title="thongTinNhomHoSo.serviceName">
            {{thongTinNhomHoSo.serviceName}}
          </div>
          <!-- <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn color="primary" @click="createDossierIntoGroup" class="mx-0 my-0">
              <v-icon size="20">add</v-icon>  &nbsp;
              <span>Tạo hồ sơ trong nhóm</span>
            </v-btn>
          </div> -->
        </div> 
      </div>
      <div v-if="!activeAddDossierIntoGroup">
        <v-layout v-if="formCode === 'NEW_GROUP'" wrap style="background: #fff;border-bottom: 1px solid #dedede;">
          <v-flex xs12 sm2 class="my-2">
            <v-subheader class="pl-0 text-header pt-2">Tên nhóm hồ sơ: </v-subheader>
          </v-flex>
          <v-flex xs12 sm10 class="my-2 pr-3">
            <v-text-field class="mt-1"
            v-model="thongTinNhomHoSo.dossierName"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <thong-tin-chu-ho-so v-if="formCode === 'NEW_GROUP'" :showApplicant="true" :showDelegate="false" ref="thongtinnguoinophoso"></thong-tin-chu-ho-so>

        <thong-tin-cong-van v-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'" ref="thongtincongvan" :detailDossier="thongTinNhomHoSo"
         :tphs="tphsCV" :taoQuyetDinh="hasTaoQuyetDinh" :createFileCongVan="createFileCongVan" :formCodeInput="formCode" :requiredCVDenGroupId="requiredCVDenGroupId" :requiredCVDenGovCode="requiredCVDenGovCode" :donvinhanCollection="donvinhanCollection" :lengthDossier="dossiersCounterIntoGroupFilter">
        </thong-tin-cong-van>

        <div v-if="formCode === 'NEW_GROUP'" style="position: relative;border-top: 1px solid #dedede;">
          <v-expansion-panel :value="0" class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Thành phần hồ sơ dùng chung&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <thanh-phan-ho-so-1 ref="thanhphanhoso1" :onlyView="false" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so-1>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div v-if="formCode === 'NEW_GROUP' " style="position: relative;">
          <v-expansion-panel :value="[true]" expand class="expansion-pl">
            <v-expansion-panel-content :key="1">
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Kết quả xử lý dùng chung&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <thanh-phan-ho-so-2 ref="thanhphanhoso2" :onlyView="true" :id="'nm'" :partTypes="outputTypesGroup"></thanh-phan-ho-so-2>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div style="position: relative;border-bottom: 1px solid #dedede;">
          <v-expansion-panel :value="[true]" expand class="expansion-pl">
            <v-expansion-panel-content :key="1">
              <div v-if="formCode === 'NEW_GROUP'" slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Hồ sơ trong nhóm&nbsp;&nbsp;&nbsp;&nbsp;
              </div>

              <div v-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'" slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Danh sách hồ sơ&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
         
              <div class="mb-3" v-if="dossiersIntoGroupRender.length > 0">
                <!-- <v-layout wrap class="my-2">
                  <v-flex style="width: 120px">
                    <v-subheader class="pl-0 text-header">Bước xử lý: </v-subheader>
                  </v-flex>
                  <v-flex class="pr-3" style="width: calc(100% - 120px)">
                    <v-select
                    :items="stepList"
                    item-text="stepName"
                    item-value="stepCode"
                    v-model="stepSelected"
                    @change="changeStep"
                    return-object
                    clearable
                    >
                    </v-select>
                  </v-flex>
                </v-layout>
                <div class="btn_wrap_actions my-2 mr-2" v-if="formCode !== 'NEW_GROUP_CV' ">
                  <v-btn color="primary" v-for="(item, indexBTN) in btnDynamics" v-bind:key="indexBTN"
                    v-on:click.native="btnActionEvent(item, indexBTN)" 
                    :loading="loadingAction"
                    :disabled="loadingAction"
                  >
                    {{item.title}}{{item.tiltle}}
                    <span slot="loader">Loading...</span>
                  </v-btn>
                </div> -->
                <v-data-table
                  v-model="selected"
                  select-all
                  :headers="headersCV"
                  :items="dossiersIntoGroupRenderTemp"
                  
                  hide-actions
                  class="table-landing table-bordered"
                  item-key="dossierId"
                >
                  <!--  -->
                  <template slot="headers" slot-scope="props">
                    <tr>
                      <!-- <th width="32px" class="v_data_table_check_all" style="padding-left: 14px !important;">
                        <v-checkbox
                          :input-value="props.all"
                          :indeterminate="props.indeterminate"
                          primary
                          hide-details
                          @click.native="toggleAll"
                        ></v-checkbox>
                      </th> -->
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
                    <tr style="cursor: pointer" 
                      :title="formCode === 'NEW_GROUP_CV_DI' && String(metaDataGroupDossier['stepcode']) !== String(props.item.stepCode) && metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui ? 'Hồ sơ đã xử lý' : ''"
                    >
                      <!-- <td class="text-xs-center pl-3" width="32px" style="height: 40px !important">
                        <v-checkbox
                          v-model="props.selected"
                          primary
                          hide-details
                        ></v-checkbox>
                      </td> -->
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-center" width="50px" style="height: 40px !important">
                        <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="150px" style="height: 40px !important">
                        <span :style="formCode === 'NEW_GROUP_CV_DI' && String(metaDataGroupDossier['stepcode']) !== String(props.item.stepCode) && metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui ? 'text-decoration: underline;color: red;' : ''">
                          {{ props.item.dossierNo }}
                        </span><br> 
                        <span v-if="formCode === 'NEW_GROUP_CV_DI' && String(metaDataGroupDossier['stepcode']) !== String(props.item.stepCode) && metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui" style="color: red;">Hồ sơ đã xử lý</span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="150px" style="height: 40px !important">
                        {{ props.item.applicantName }}
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="100px" style="height: 40px !important">
                        <span v-if="getMetaData(props.item) && getMetaData(props.item).hasOwnProperty('birthDateDay') && getMetaData(props.item).hasOwnProperty('birthDateMonth') && getMetaData(props.item).hasOwnProperty('birthDateYear')">{{getMetaData(props.item).birthDateDay}}/</span>
                        <span v-if="props.item && getMetaData(props.item) && getMetaData(props.item).hasOwnProperty('birthDateMonth') && getMetaData(props.item).hasOwnProperty('birthDateYear')">{{getMetaData(props.item).birthDateMonth}}/</span>
                        <span v-if="props.item && getMetaData(props.item) && getMetaData(props.item).hasOwnProperty('birthDateYear')">{{getMetaData(props.item).birthDateYear}} </span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left"  style="height: 40px !important">
                        <span v-if="props.item.address">{{props.item.address}}, </span>
                        <span v-if="props.item.wardName">{{props.item.wardName}}, </span>
                        <span v-if="props.item.districtName">{{props.item.districtName}}, </span>
                        <span v-if="props.item.cityName">{{props.item.cityName}} </span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="100px" style="height: 40px !important">
                        <span v-if="props.item.metaData && getMetaData(props.item) && getMetaData(props.item).yearPayment">{{getMetaData(props.item).yearPayment}} </span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="100px" style="height: 40px !important">
                        <span v-if="props.item.metaData && getMetaData(props.item) && getMetaData(props.item).subsidy">{{currency(getMetaData(props.item).subsidy)}} </span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="100px" style="height: 40px !important">
                        <span v-if="props.item.dossierStatusText">{{props.item.dossierStatusText}} </span>
                      </td>
                      <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="100px" style="height: 40px !important">
                        <span v-if="props.item.applicantNote">{{props.item.applicantNote}} </span>
                      </td>
                      
                      <td class="text-xs-center" :width="(!metaDataGroupDossier.hasOwnProperty('congvandagui') && checkGroupDossierIdCvDen(String(props.item['groupDossierIds']))) || (metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui) ? '170px' : '70px'" style="height: 40px !important">
                        <v-btn flat icon color="indigo" class="mr-2 my-0" @click="viewDetail(props.item)" title="Xem chi tiết">
                          <v-icon>fas fa fa-file-text</v-icon>
                        </v-btn>
                        <v-btn v-if="(!metaDataGroupDossier.hasOwnProperty('congvandagui') && checkGroupDossierIdCvDen(String(props.item['groupDossierIds']), 'editAction', props.item)) || (metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui) && checkGroupDossierIdCvDen(String(props.item['groupDossierIds']), 'editAction', props.item)"
                         flat icon color="green" class="mr-2 my-0" @click="editDossierIntoGroup(props.item)" title="Sửa hồ sơ">
                          <v-icon size="22">create</v-icon>
                        </v-btn>
                        <v-btn v-if="(!metaDataGroupDossier.hasOwnProperty('congvandagui') && checkGroupDossierIdCvDen(String(props.item['groupDossierIds']))) || (metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui)" flat icon color="red" class="my-0" @click="removeDossierFromGroup(props.item)" title="Xóa khỏi công văn">
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
                    <span style="font-weight: bold;">{{hoSoDaXuLyList}}</span> đã xử lý. Vui lòng xóa khỏi công văn trước khi gửi.
                  </span>
                </div>
              </div>
              <div v-else class="pl-5 py-2">Chưa có hồ sơ nào</div>
          
              <v-flex xs12 class="text-right mb-3 mr-2" v-if="(formCode === 'NEW_GROUP_CV' && !metaDataGroupDossier.hasOwnProperty('congvandagui')) || formCode === 'NEW_GROUP_CV_DI'">
                <v-btn :disabled="loadingAction" v-if="formCode === 'NEW_GROUP_CV_DI' && hoSoDaXuLy.length > 0" small color="primary" @click="removeAllDossierFromGroup" class="mx-0 my-0 mr-2" >
                  <v-icon size="20">delete</v-icon> &nbsp;
                  <span>Xóa hồ sơ đã xử lý</span>
                </v-btn>
                <v-btn :disabled="loadingAction" v-if="addFormNewInGroup === 'Thêm mới hồ sơ'" small color="primary" @click="createDossierIntoGroup" class="mx-0 my-0 mr-2">
                  <v-icon size="20">add</v-icon>  &nbsp;
                  <span>Thêm mới hồ sơ</span>
                </v-btn>
                <v-btn :disabled="loadingAction" v-if="formCode !== 'NEW_GROUP_CV' && metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui" small color="primary" @click="showDossierToAdd" class="mx-0 my-0" >
                  <v-icon size="20">create_new_folder</v-icon>  &nbsp;
                  <span>Thêm hồ sơ đã có</span>
                </v-btn>
              </v-flex>

              <v-flex xs12 class="text-right mb-3 mr-2" v-if="formCode === 'NEW_GROUP'">
                <input type="file" id="dossierImport" @change="uploadfileDossierImport($event)" style="display:none">
                <v-btn color="primary" @click="createDossierIntoGroup" class="mx-0 my-0 mr-2" style="height:36px !important">
                  <v-icon size="20">add</v-icon>  &nbsp;
                  <span>Thêm hồ sơ vào nhóm</span>
                </v-btn>
                <v-btn color="primary" @click="importIntoGroup" class="mx-0 my-0 mr-1" style="height:36px !important">
                  <v-icon size="20">cloud_upload</v-icon>  &nbsp;
                  <span>Import hồ sơ vào nhóm</span>
                </v-btn>
              </v-flex>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        
        <!-- <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand class="expansion-pl">
            <v-expansion-panel-content :key="1">
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Kết quả xử lý theo nhóm&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <thanh-phan-ho-so-2 ref="thanhphanhoso2" :onlyView="false" :id="'nm'" :partTypes="outputTypesGroup"></thanh-phan-ho-so-2>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div> -->
      </div>
      <!-- Thông tin hồ sơ trong nhóm -->
      <div v-if="activeAddDossierIntoGroup">
        <thong-tin-chu-ho-so-cong-van v-if="activeAddDossierIntoGroup && (formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI')" ref="thongtinchuhosocongvan" :mauCongVan="mauCongVan"></thong-tin-chu-ho-so-cong-van>
        <thong-tin-chu-ho-so :showApplicant="false" :showDelegate="true" v-if="activeAddDossierIntoGroup && formCode === 'NEW_GROUP'" ref="thongtinchuhoso"></thong-tin-chu-ho-so>

        <v-expansion-panel v-if="formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI'" :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content>
            <div slot="header" style="display: flex; align-items: center;">
              <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
              <span>Tên hồ sơ</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>
              <v-card>
                <v-card-text>
                  <v-form v-model="valid_tenHoSo" ref="formTenHoSo" lazy-validation>
                  <v-textarea
                    v-model="dossierNameCongVan"
                    :rows="2"
                    box
                    :label="'Nhập tên hồ sơ'"
                    :rules="[rules.varchar5000]"
                  ></v-textarea>
                  </v-form>
                </v-card-text>
              </v-card>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <div style="position: relative;" v-if="activeAddDossierIntoGroup">
          <v-expansion-panel :value="0" class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Thành phần hồ sơ &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <thanh-phan-ho-so ref="thanhphanhoso" :formCode="formCode" :onlyView="false" :id="'nm'" :partTypes="inputTypesIntoGroup"></thanh-phan-ho-so>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <!--  -->
        <div style="position: relative;" v-if="viaPortalDetail !== 0">
          <v-expansion-panel :value="0"  class="expansion-pl">
            <v-expansion-panel-content hide-actions value="2">
              <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát kết quả</div>
              <dich-vu-chuyen-phat-ket-qua ref="dichvuchuyenphatketqua" @changeViapostal="changeViapostal"></dich-vu-chuyen-phat-ket-qua>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <!--  -->
        <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content hide-actions value="2">
              <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail"></thu-phi>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <!--  -->
      </div>
      <!--  -->
      <v-tabs icons-and-text centered class="mb-0 mt-4" v-if="activeAddDossierIntoGroup || activeAddGroup">
        <!-- <v-tabs-slider color="primary"></v-tabs-slider> -->
        <!-- Cập nhật thông tin nhóm -->
        <v-tab href="#tab-1" @click="putGroupDossier()" v-if="activeAddGroup && formCode === 'NEW_GROUP_CV' && !metaDataGroupDossier.hasOwnProperty('congvandagui')" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Cập nhật</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>

        <v-tab href="#tab-1" @click="putGroupDossier('save')" v-if="activeAddGroup && formCode === 'NEW_GROUP_CV_DI' && metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Lưu công văn</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        
        <v-tab href="#tab-2" @click="putGroupDossier('saveSend')" v-if="activeAddGroup && formCode === 'NEW_GROUP_CV_DI' && metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction || dossiersCounterIntoGroupFilter === 0"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Lưu và gửi công văn</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <!--  -->
        <v-tab href="#tab-1" @click="tiepNhanHoSoCongVan()" v-if="!activeAddGroup && (formCode === 'NEW_GROUP_CV' || formCode === 'NEW_GROUP_CV_DI')" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Tiếp nhận hồ sơ</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-1" @click="tiepNhanHoSo()" v-if="!activeAddGroup && formCode === 'NEW_GROUP'" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Tiếp nhận hồ sơ</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>

        <!-- <v-tab href="#tab-2" @click="tiepNhanHoSo('add')" v-if="!activeAddGroup" class="px-0 py-0"> 
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">note_add</v-icon>  &nbsp;
            <span>Tiếp nhận và thêm mới</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab> -->
        <!--  -->
        <v-tab v-if="formCode === 'NEW_GROUP_CV_DI' && createFileCongVan" href="#tab-3" class="px-0 py-0">
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
            @click="printCongVan"
          >
            <v-icon size="20">printer</v-icon> &nbsp;
            <span style="margin-left: -30px;">In công văn</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-4" @click="deleteCongVan()" v-if="(metaDataGroupDossier.hasOwnProperty('congvandagui') && !metaDataGroupDossier.congvandagui) || activeDeleteCongVan" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">clear</v-icon>  &nbsp;
            <span>Xóa công văn</span>
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
    </v-form>
    <v-dialog v-model="dialogImportDosier" max-width="700" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Import hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogImportDosier = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <v-flex class="text-xs-center">
            <v-progress-circular
              :rotate="-90"
              :size="70"
              :width="10"
              :value="valueProgress"
              color="primary"
              class="my-2"
              >
              <span style="font-size: 1.5em;font-weight: bold;">{{ countDossierProgress }}</span> 
            </v-progress-circular>
            <div class="pb-0" style="margin: 0 auto;">
              <v-card class="py-0">
                <span style="color: green;">Thành công: {{countDossierSuccess}} hồ sơ</span>
                <p style="color: red;">Lỗi: {{dossierError.length}} hồ sơ</p>
              </v-card>
            </div>
          </v-flex>
          
          <div class="px-2" v-if="dossierError.length && !loadingImportDossier" style="margin: 0 auto;">
            <span style="font-size: 1.2em;font-weight: bold;">Danh sách hồ sơ bị lỗi:</span>
            <v-data-table
              :headers="headers"
              :items="dossierError"
              hide-actions
              class="table-landing table-bordered mt-2"
              item-key="dossierId"
              style="border-left: 1px solid #dedede"
            >
              <template slot="items" slot-scope="props">
                <tr style="cursor: pointer">
                  <td class="text-xs-center" width="">
                    <span>{{props.index + 1}}</span>
                  </td>
                  <td class="text-xs-left" width="">
                    {{ props.item.applicantName }}
                  </td>
                  <td class="text-xs-left">
                    {{ props.item.applicantIdNo }}
                  </td>
                  <td class="text-xs-left" width="">
                    {{ props.item.address}}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="addDossierAgain()"
              :loading="loadingImportDossier"
              :disabled="loadingImportDossier"
              v-if="dossierError.length"
              >
              <v-icon>send</v-icon>&nbsp;
              Thực hiện lại
              <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="red" style="color: #fff;" @click.native="dialogImportDosier = false"
            :loading="loadingImportDossier"
            :disabled="loadingImportDossier"
            >
            <v-icon>reply</v-icon>&nbsp;
            Quay lại
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogSelectDosier" max-width="1000" transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Chọn hồ sơ đính kèm tài liệu</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="cancelAddFile">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <div class="mb-3" v-if="dossiersIntoGroupRender.length > 0">
            <v-layout wrap class="my-2">
              <v-flex style="width: 120px">
                <v-subheader class="pl-0 text-header">Bước xử lý: </v-subheader>
              </v-flex>
              <v-flex class="pr-3" style="width: calc(100% - 120px)">
                <v-select
                :items="stepList"
                item-text="stepName"
                item-value="stepCode"
                v-model="stepSelected"
                @change="changeStep"
                return-object
                clearable
                >
                </v-select>
              </v-flex>
            </v-layout>
            <v-data-table
              v-model="selectedAttach"
              select-all
              :headers="headers"
              :items="dossiersIntoGroupRender"
              :pagination.sync="pagination"
              hide-actions
              class="table-landing table-bordered"
              item-key="dossierId"
            >
              <!--  -->
              <template slot="headers" slot-scope="props">
                <tr>
                  <th width="32px" class="v_data_table_check_all" style="padding-left: 14px !important;">
                    <v-checkbox
                      :input-value="props.all"
                      :indeterminate="props.indeterminate"
                      primary
                      hide-details
                      @click.native="toggleAllSelectDialog"
                    ></v-checkbox>
                  </th>
                  <th
                    v-for="header in headers"
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
                  <td class="text-xs-center pl-3" width="32px" style="height: 40px !important">
                    <v-checkbox
                      v-model="props.selected"
                      primary
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td @click="viewDetail(props.item, props.index)" class="text-xs-center" width="50px" style="height: 40px !important">
                    <span>{{pagination.page * pagination.rowsPerPage - pagination.rowsPerPage + props.index + 1}}</span>
                  </td>
                  <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="150px" style="height: 40px !important">
                    {{ props.item.applicantName }}
                  </td>
                  <td @click="viewDetail(props.item, props.index)" class="text-xs-left" style="height: 40px !important">
                    {{ props.item.applicantName }}
                  </td>
                  <td @click="viewDetail(props.item, props.index)" class="text-xs-left" width="200px" style="height: 40px !important">
                    {{ props.item.dossierSubStatusText ? props.item.dossierSubStatusText : props.item.dossierStatusText }}
                  </td>
                </tr>
              </template>
            </v-data-table>

            <div v-if="dossiersIntoGroupRender.length > 30" class="text-xs-center layout wrap mt-2 pr-1" style="position: relative;">
              <div class="flex pagging-table px-2">
                <tiny-pagination :total="dossiersIntoGroupRender.length" :currentLimit="30" :page="pagination.page" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="addFileToDossier()">
            <v-icon>send</v-icon>&nbsp;
            Xác nhận
          </v-btn>
          <v-btn color="red" style="color: #fff;" @click.native="cancelAddFile"
            >
            <v-icon>close</v-icon>&nbsp;
            Bỏ qua
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialogAddDossier" max-width="1300" transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Chọn hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogAddDossier = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <div class="mb-3">
            <v-layout wrap class="my-2">
              <v-flex class="px-2 mt-3">
                <v-text-field
                  label="Tìm kiếm theo mã hồ sơ"
                  v-model="dossierNoKey"
                  @keyup.enter="searchKeyWordDossierToAdd"
                  append-icon="search"
                  box
                  @click:append="searchKeyWordDossierToAdd"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-data-table
              :headers="headersCV"
              :items="dossiersSelectAdd"
              :select-all="true"
              v-model="selectedDossierAdd"
              hide-actions
              class="table-landing table-bordered"
              item-key="dossierId"
            >
              <!--  -->
              <template slot="headers" slot-scope="props">
                <tr>
                  <th width="32px" class="v_data_table_check_all" style="padding-left: 14px !important;">
                    <v-checkbox
                      class="pl-1"
                      :input-value="props.all"
                      :indeterminate="props.indeterminate"
                      primary
                      hide-details
                      @click.native="toggleAllSelectDossierAdd"
                    ></v-checkbox>
                  </th>
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
                  <td class="text-xs-center" width="30px" style="height: 40px !important">
                    <v-checkbox
                      class="pl-3"
                      v-model="props.selected"
                      @change="changeSelectedDossierAdd"
                      primary
                      hide-details
                      color="primary"
                    ></v-checkbox>
                  </td>
                  <td class="text-xs-center" width="50px" style="height: 40px !important">
                    <span>{{hosoDatasPage * numberPerPageAddDossier - numberPerPageAddDossier + props.index + 1}}</span>
                  </td>
                  <td class="text-xs-left" width="150px" style="height: 40px !important">
                    {{ props.item.dossierNo }}
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
                  
                  <td class="text-xs-center" width="100px" style="height: 40px !important">
                    <v-btn :disabled="loadingAction" small outline color="primary" @click="addDossierToGroup(props.item)" class="mr-2 my-0">
                      <v-icon size="20">add</v-icon>  &nbsp;
                      <span>Thêm hồ sơ</span>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>

            <div class="text-xs-right layout wrap" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" :numberPerPage="numberPerPageAddDossier" :showLimit="false" custom-class="custom-tiny-class" 
                 @tiny:change-page="paggingDataDossierAdd" ></tiny-pagination> 
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="loadingAction" color="primary" @click.native="addMultipleDossierToGroup()">
            <v-icon>send</v-icon>&nbsp;
            Xác nhận
          </v-btn>
          <v-btn :disabled="loadingAction" color="primary" @click.native="dialogAddDossier = false"
            >
            <v-icon class="white--text">close</v-icon>&nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPDF" max-width="1000" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <span >In công văn</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <iframe id="dialogPdfFile" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import toastr from 'toastr'
import $ from 'jquery'
import axios from 'axios'
import ThongTinChuHoSoCongVan from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSoCongVan.vue'
import ThongTinChuHoSo from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNhomNew.vue'
import ThanhPhanHoSo1 from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNhomNew.vue'
import ThanhPhanHoSo2 from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNhomNew.vue'
import ThongTinChung from './TiepNhan/TiepNhanHoSo_ThongTinChung.vue'
import LePhi from './form_xu_ly/FeeDetail.vue'
import DichVuChuyenPhatKetQua from './TiepNhan/TiepNhanHoSo_DichVuChuyenPhatKetQua.vue'
import TinyPagination from './pagging/opencps_pagination.vue'
import ThongTinCongVan from './TiepNhan/TiepNhanHoSo_ThongTinCongVan.vue'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index', 'id', 'formCode'],
  components: {
    'thong-tin-chu-ho-so-cong-van': ThongTinChuHoSoCongVan,
    'thong-tin-chu-ho-so': ThongTinChuHoSo,
    'thanh-phan-ho-so': ThanhPhanHoSo,
    'thanh-phan-ho-so-1': ThanhPhanHoSo1,
    'thanh-phan-ho-so-2': ThanhPhanHoSo2,
    'thong-tin-chung': ThongTinChung,
    'thu-phi': LePhi,
    'dich-vu-chuyen-phat-ket-qua': DichVuChuyenPhatKetQua,
    'tiny-pagination': TinyPagination,
    'thong-tin-cong-van': ThongTinCongVan
  },
  data: () => ({
    valid_tenHoSo: false,
    detailGroup: false,
    dialogImportDosier: false,
    dialogSelectDosier: false,
    dialogAddDossier: false,
    dossiersSelectAdd: [],
    selectedDossierAdd: [],
    selectMultiplePage: [],
    selectedDoAction: [],
    groupDossierList: [],
    groupDossierSelected: '',
    dossierNoKey: '',
    hosoDatasPage: 1,
    hosoDatasTotal: 0,
    hosoTotalPage: 0,
    numberPerPageAddDossier: 5,
    dossiersIntoGroup: [],
    dossiersIntoGroupRender: [],
    dossiersIntoGroupRenderTemp: [],
    selected: [],
    selectedAttach: [],
    stepList: [],
    stepSelected: '',
    btnDynamics: [],
    processOptionSelected: '',
    thongTinNhomHoSo: '',
    validTNHS: false,
    groupDossierNameCreate: '',
    currentDossierIntoGroup: '',
    dossierId: '',
    mark: true,
    stateEditSample: false,
    tiepNhanState: false,
    activeAddGroup: false,
    thongTinChiTietHoSo: {},
    payments: {},
    paymentProfile: {},
    briefNote: '',
    receiveDateEdit: '',
    editableDate: false,
    dueDateEdit: '',
    viaPortalDetail: 0,
    showThuPhi: false,
    inputTypes: [6],
    outputTypesGroup: [7],
    inputTypesIntoGroup: [1, 3, 6],
    outputTypes: [2],
    sampleCount: 0,
    isMobile: false,
    loadingAction: false,
    dialogAddGroup: false,
    activeAddDossierIntoGroup: false,
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
    headers: [
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
        text: 'Tên chủ hồ sơ',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false,
        class: 'text-xs-center'
      }
    ],
    filesGroupDossier: [],
    countDossierProgress: 0,
    listDossierImport: [],
    progressUploadFile: false,
    loadingImportDossier: false,
    dossierError: [],
    dossierSuccess: [],
    totalDossier: 0,
    valueProgress: 0,
    countDossierSuccess: 0,
    dossierNameCongVan: '',
    pagination: {
      rowsPerPage: 15,
      page: 1
    },
    tphsCV: '',
    totalFee: 0,
    dossiersCounterIntoGroupFilter: 0,
    hoSoDaXuLy: [],
    hoSoDaXuLyList: '',
    addFormNewInGroup: '',
    metaDataGroupDossier: '',
    createFileCongVan: '',
    postStepCodeCongVan: '',
    donvinhanCollection: '',
    requiredCVDenGroupId: '',
    requiredCVDenGovCode: '',
    hasTaoQuyetDinh: false,
    dialogPDF: false,
    congvanguiden: false,
    mauCongVan: false,
    activeDeleteCongVan: false,
    mauGiayPhep: 'KQGP',
    mappingValidateGP: '',
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
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    dichVuChuyenPhatKetQua () {
      return this.$store.getters.dichVuChuyenPhatKetQua
    },
    thongTinChuHoSo () {
      return this.$store.getters.thongTinChuHoSo
    },
    filesAdd () {
      return this.$store.getters.getFilesAdd
    },
    activeAddFileGroup () {
      return this.$store.getters.activeAddFileGroup
    },
    menuConfigs () {
      return this.$store.getters.getMenuConfigsTodo
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      let id = vm.id
      if(vm.menuConfigs){
        if(vm.menuConfigs.length > 0){
          vm.addFormNewInGroup =  vm.menuConfigs[vm.index]['tableConfig'].hasOwnProperty('addFormNewInGroup') ? vm.menuConfigs[vm.index]['tableConfig']['addFormNewInGroup'] : ''
        }
      }
      if (id) {
        vm.getDetaiGroup(id)
      }
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
    let vm = this
    if (vm.thongTinNhomHoSo) {
      if (vm.formCode === 'NEW_GROUP' ) {
        if (vm.formCode === 'NEW_GROUP') {
          vm.$refs.thongtinnguoinophoso.initData(vm.thongTinNhomHoSo)
        }
        vm.$refs.thanhphanhoso1.initData(vm.thongTinNhomHoSo)
        vm.$refs.thanhphanhoso2.initData(vm.thongTinNhomHoSo)
        // 
        vm.filesGroupDossier = vm.$refs.thanhphanhoso1.getFilesGroupDossier()
        console.log('fileItems 1', vm.filesGroupDossier)
      }
      // if (vm.formCode === 'NEW_GROUP_CV') {
      //   vm.$refs.thongtincongvan.initData(vm.thongTinNhomHoSo)
      // }
    }
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
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      let id = vm.id
      vm.addFormNewInGroup =  vm.menuConfigs[vm.index]['tableConfig'].hasOwnProperty('addFormNewInGroup') ? vm.menuConfigs[vm.index]['tableConfig']['addFormNewInGroup'] : ''
      if (id) {
        vm.getDetaiGroup(id)
      }
    },
    dossiersIntoGroupRender (arr) {
      let vm = this
      let totalFee = 0
      vm.dossiersCounterIntoGroupFilter = arr.length
      if (vm.formCode === 'NEW_GROUP_CV_DI' && vm.metaDataGroupDossier.hasOwnProperty('congvandagui') && !vm.metaDataGroupDossier.congvandagui) {
        vm.dossiersCounterIntoGroupFilter = arr.filter(function (item) {
          return String(item.stepCode) === String(vm.metaDataGroupDossier.stepcode)
        }).length
        vm.hoSoDaXuLy = vm.dossiersIntoGroupRender.filter(function (item) {
          return String(item.stepCode) !== String(vm.metaDataGroupDossier.stepcode)
        })
        if (vm.hoSoDaXuLy.length > 0) {
          vm.hoSoDaXuLyList = vm.hoSoDaXuLy.map(obj =>{ 
            return obj.dossierNo
          }).toString()
        }
      }
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          if (vm.formCode === 'NEW_GROUP_CV_DI' && vm.metaDataGroupDossier.hasOwnProperty('congvandagui') && !vm.metaDataGroupDossier.congvandagui) {
            if (String(arr[i].stepCode) === String(vm.metaDataGroupDossier.stepcode)) {
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
      } else {
        vm.dossiersIntoGroupRenderTemp = []
        vm.totalFee = 0
      }
      
    },
    thongTinNhomHoSo (val) {
      let vm = this
      if (val) {
        if (vm.formCode === 'NEW_GROUP' ) {
          if (vm.formCode === 'NEW_GROUP') {
            vm.$refs.thongtinnguoinophoso.initData(val)
          }
          
          vm.$refs.thanhphanhoso1.initData(val)
          vm.$refs.thanhphanhoso2.initData(val)
          //
          vm.$store.dispatch('loadDossierFiles', val.dossierId).then(resFiles => {
            vm.filesGroupDossier = resFiles
          }).catch(reject => {
          })
        }
        if (vm.formCode === 'NEW_GROUP_CV' || vm.formCode === 'NEW_GROUP_CV_DI') {
          vm.$refs.thongtincongvan.initData(val)
          let filter = {
            dossierTemplateNo: val.dossierTemplateNo
          }
          // vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result) {
          //   vm.tphsCV = result['dossierParts']
          //   vm.getDetailActionCongVan()
          // })
          vm.$store.dispatch('loadDossierFiles', val.dossierId).then(resFiles => {
            vm.filesGroupDossier = resFiles
          }).catch(reject => {
          })
        }
        
      }
    },
    selected (val) {
      let vm = this
      // vm.$store.commit('setSelectDossierGroup', val)
    },
    activeAddFileGroup (val) {
      let vm = this
      console.log('val activeAddFileGroup', val)
      vm.stepSelected = ''
      vm.dialogSelectDosier = val
    },
    selectMultiplePage: {
      handler: function (val) {
        let vm = this
        if (val.length > 0) {
          vm.selectedDoAction = []
          for (let key in val) {
            vm.selectedDoAction = vm.selectedDoAction.concat(val[key]['selected'])
          }
        } else {
          vm.selectedDoAction = []
        }
      },
      deep: true
    },
    menuConfigs: {
      handler: function (val) {
        let vm = this
        if(val.length){
          vm.addFormNewInGroup =  vm.menuConfigs[parseInt(vm.index)]['tableConfig'].hasOwnProperty('addFormNewInGroup') ? vm.menuConfigs[vm.index]['tableConfig']['addFormNewInGroup'] : ''
        }
      },
      deep: true
    }
  },
  methods: {
    onResize () {
      let vm = this
      let isMobile = window.innerWidth < 1024
      vm.isMobile = isMobile
    },
    paggingData (config) {
      let vm = this
      vm.pagination.page = config.page
      let start = vm.pagination.page * vm.pagination.rowsPerPage - vm.pagination.rowsPerPage
      let end = vm.pagination.page * vm.pagination.rowsPerPage
      vm.dossiersIntoGroupRenderTemp = vm.dossiersIntoGroupRender.slice(start, end)
    },
    paggingDataDossierAdd (config) {
      let vm = this
      vm.hosoDatasPage = config.page
      vm.searchDossierToAdd()
    },
    getGroupDossier () {
      let vm = this
      let query = vm.$router.history.current.query
      let filter = {
        service: query.serviceCode ? query.serviceCode : '',
        template: query.template_no ? query.template_no : '',
        agency: query.govAgencyCode ? query.govAgencyCode : ''
      }
      vm.$store.dispatch('getGroupDossier', filter).then(result => {
        vm.groupDossierList = result
        // if (query.hasOwnProperty('groupDossierId') && query.groupDossierId) {
        //   let id = query.groupDossierId
        //   vm.$store.dispatch('getDetailDossier', id).then(resultDossier => {
        //     vm.activeAddDossierIntoGroup = false
        //     vm.activeAddGroup = true
        //     vm.groupDossierSelected = resultDossier
        //   })
        // }
      })
    },
    getDetaiGroup (id) {
      let vm = this
      vm.$store.dispatch('getDetailDossier', id).then(resultDossier => {
        vm.thongTinNhomHoSo = resultDossier
        vm.activeAddDossierIntoGroup = false
        vm.activeAddGroup = true
        vm.groupDossierSelected = resultDossier
        vm.metaDataGroupDossier = vm.getMetaData(vm.thongTinNhomHoSo)
        vm.donvinhanCollection = vm.metaDataGroupDossier.hasOwnProperty('donvinhancollection') ? vm.metaDataGroupDossier.donvinhancollection : ''
        vm.requiredCVDenGroupId = vm.metaDataGroupDossier.hasOwnProperty('requiredCVDenGroupId') ? vm.metaDataGroupDossier.requiredCVDenGroupId : ''
        vm.requiredCVDenGovCode = vm.metaDataGroupDossier.hasOwnProperty('requiredCVDenGovCode') ? vm.metaDataGroupDossier.requiredCVDenGovCode : ''
        vm.hasTaoQuyetDinh = vm.metaDataGroupDossier.hasOwnProperty('taoQuyetDinh') ? vm.metaDataGroupDossier.taoQuyetDinh : false
        let filter = {
          groupDossierId: id
        }
        vm.dossiersIntoGroup = []
        vm.dossiersIntoGroupRender = []
        vm.$store.dispatch('getDossiersIntoGroup', filter).then(function (result) {
          vm.dossiersIntoGroup = result
          if ((vm.metaDataGroupDossier.hasOwnProperty('congvandagui') && vm.metaDataGroupDossier.congvandagui) || !vm.metaDataGroupDossier.hasOwnProperty('congvandagui')) {
            vm.activeDeleteCongVan = vm.dossiersIntoGroup.length === 0 ? true : false
          }
          vm.$store.commit('setSelectDossierGroup', vm.dossiersIntoGroup)
          if (vm.dossiersIntoGroup.length > 0) {
            let steps = []
            for (let index in vm.dossiersIntoGroup) {
              if (steps.filter(function (item) {
                return String(item['stepCode']) === String(vm.dossiersIntoGroup[index]['stepCode'])
              }).length === 0) {
                steps.push({
                  stepCode: vm.dossiersIntoGroup[index]['stepCode'],
                  stepName: vm.dossiersIntoGroup[index]['stepName']
                })
              }
            }
            vm.stepList = steps
          }
          vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
        })
        // lấy thông tin createFile công văn
        
        let filterGet = {
          dossierTemplateNo: vm.thongTinNhomHoSo.dossierTemplateNo
        }
        vm.$store.dispatch('loadDossierFormTemplates', filterGet).then(function (result) {
          vm.tphsCV = result['dossierParts']
          vm.getDetailActionCongVan()
          vm.mauCongVan = result['newFormScript'] && result['newFormScript'].startsWith('MAU_CV_') ? result['newFormScript'] : false 
        })
        
      })
    },
    changeStep () {
      let vm = this
      setTimeout(function () {
        if (vm.stepSelected) {
          vm.dossiersIntoGroupRender = vm.dossiersIntoGroup.filter(function(item) {
            return String(item['stepCode']) === String(vm.stepSelected['stepCode'])
          })
          vm.$store.dispatch('pullProcessSteps', vm.stepSelected).then(function (result) {
            if (result.hasOwnProperty('menuGroup') && result.menuGroup) {
              vm.$store.dispatch('getDetailMenuConfig', result).then(function (result2) {
                if (result2.hasOwnProperty('buttonConfig') && result2.buttonConfig) {
                  try {
                    vm.btnDynamics = JSON.parse(result2['buttonConfig'])['buttons']
                    vm.btnDynamics = vm.btnDynamics.filter(function(item) {
                      return item['form'] === 'ACTIONS'
                    })
                    vm.btnDynamics = vm.btnDynamics.filter(function(item) {
                      return (!item.hasOwnProperty('onlySteps') ||
                        (item.hasOwnProperty('onlySteps') && item['onlySteps'].filter(function(item2) {
                          return String(item2) === String(vm.stepSelected['stepCode']) 
                        }).length >= 0)
                      )
                    })
                    console.log('btnDynamics dossierGroup', vm.btnDynamics)
                  } catch (error) {
                    vm.btnDynamics = []
                  }
                } else {
                  vm.btnDynamics = []
                }
              })
            } else {
              vm.btnDynamics = []
            }
          })
        } else {
          vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
          vm.btnDynamics = []
        }
      }, 200)
    },
    btnActionEvent (item, index) {
      let vm = this
      if (!vm.selected || vm.selected.length === 0) {
        toastr.error('Chọn hồ sơ để thực hiện')
        return
      }
      vm.$store.dispatch('loadActionActive', item).then(function () {
        vm.$store.dispatch('loadDossierSelected', vm.selected).then(function () {
          let dossiersSelect = vm.selected.map(select => {
            return select.dossierId
          }).join(',')
          let query = vm.$router.history.current.query
          query['dossiers'] = dossiersSelect
          query['actionActive'] = JSON.stringify(item)
          vm.$router.push({
            path: '/danh-sach-ho-so/0/xu-ly-ho-so',
            query: query
          })
        })
      })
    },
    showDossierToAdd () {
      let vm = this
      vm.hosoDatasPage = 1
      vm.dossierNoKey = ''
      vm.selectMultiplePage = []
      vm.searchDossierToAdd()
      vm.dialogAddDossier = true
    },
    putGroupDossier (draf) {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (vm.formCode === 'NEW_GROUP') {
        let thongtinnguoinophoso = this.$refs.thongtinnguoinophoso ? this.$refs.thongtinnguoinophoso.thongTinNguoiNopHoSo : {}
        let validThongtinnguoinophoso = vm.$refs.thongtinnguoinophoso.showValid()
        if (validThongtinnguoinophoso['validForm']) {
          let passValid = false
          if (!validThongtinnguoinophoso['validApplicant']) {
            let x = confirm(validThongtinnguoinophoso['message'] + ' Bạn có muốn tiếp tục?')
            if (x) {
              passValid = true
            }
          } else { passValid = true }
          if (passValid) {
            let tempData = Object.assign(vm.thongTinNhomHoSo, thongtinnguoinophoso)
            tempData['dossierId'] = vm.thongTinNhomHoSo.dossierId
            tempData['originality'] = vm.thongTinNhomHoSo.originality
            tempData['dossierName'] = vm.thongTinNhomHoSo.dossierName
            console.log('data put groupDossier -->', tempData)
            setTimeout(function () {
              vm.$store.dispatch('putDossier', tempData).then(function (result) {
                toastr.clear()
                toastr.success('Cập nhật thành công')
              }).catch(function (xhr) {
                toastr.clear()
                toastr.error('Yêu cầu của bạn thực hiện thất bại.')
              })
            }, 500)
          }
        }
      }
      if (vm.formCode === 'NEW_GROUP_CV' || vm.formCode === 'NEW_GROUP_CV_DI') {
        let thongtincongvan = this.$refs.thongtincongvan.getThongTinCongVan()
        let tempData = thongtincongvan
        tempData.dueDate = vm.dateTimeView(thongtincongvan.dueDate)
        let validateThongTinCongVan = true
        if (vm.formCode === 'NEW_GROUP_CV') {
          validateThongTinCongVan = thongtincongvan.validation
        }
        if (vm.formCode === 'NEW_GROUP_CV_DI' && draf === 'save') {
          validateThongTinCongVan = true
        } else {
          validateThongTinCongVan = thongtincongvan.validation
        }
        if (vm.formCode === 'NEW_GROUP_CV_DI' && draf === 'saveSend') {
          if (vm.hoSoDaXuLy.length > 0) {
            alert('Vui lòng xóa hồ sơ đã xử lý trước khi gửi công văn')
            return
          }
        }
        if (validateThongTinCongVan) {
          vm.loadingAction = true
          vm.$store.dispatch('putDossierCongVan', tempData).then(function (result) {
            let meta
            if (vm.formCode === 'NEW_GROUP_CV') {
              meta = thongtincongvan.metaData
            } else {
              let totalSubsidy_text = vm.currentcyToString(String(vm.totalFee))
              if (draf === 'save') {
                let metadataDraf = {
                  congvandagui: false,
                  donvinhan: '',
                  tendonvinhan: '',
                  donvinhandraf: thongtincongvan.metaData.donvinhan,
                  tendonvinhandraf: thongtincongvan.metaData.tendonvinhan,
                  totalSubsidy: vm.totalFee,
                  totalSubsidyText: totalSubsidy_text
                }
                meta = Object.assign(thongtincongvan.metaData, metadataDraf)
              } else {
                meta = Object.assign(thongtincongvan.metaData, {congvandagui: true, totalSubsidy: vm.totalFee, totalSubsidyText: totalSubsidy_text})
              }
            }
            
            let dataMetaData = {
              id: thongtincongvan.dossierId,
              data: JSON.stringify(meta)
            }
            
            if (vm.formCode === 'NEW_GROUP_CV') {
              vm.$store.dispatch('putMetaData', dataMetaData).then(()=>{
                vm.loadingAction = false
                vm.$router.push({
                  path: '/danh-sach-ho-so/' + currentParams.index + '?' + window.location.href.split('?')[1]
                })
              }).catch(function () {
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
                if (vm.createFileCongVan) {
                  let filter = {
                    dossierId: vm.thongTinNhomHoSo['dossierId'],
                    partNo: vm.createFileCongVan
                  }
                  vm.$store.dispatch('loadFormData', filter).then(function (result) {
                    let formData = JSON.parse(result)
                    let formDataPut = Object.assign(formData, {tp: vm.createFileCongVan, dossierId: vm.thongTinNhomHoSo['dossierId']})
                    vm.$store.dispatch('postEformCallBack', formDataPut).then(function (result) {
                      if (draf === 'save') {
                        vm.$store.dispatch('postDossierIntoGroup', dataAddGroup).then(function (result) {
                          vm.loadingAction = false
                          toastr.success('Lưu công văn thành công')
                          vm.$router.push({
                            path: '/danh-sach-ho-so/' + currentParams.index + '?' + window.location.href.split('?')[1]
                          })
                        }).catch (() => {
                          vm.loadingAction = false
                        })
                      } else {
                        // do action dossierIntoGroup
                        vm.processAction()
                      }
                    })
                    
                  }).catch(function (reject) {
                  })
                } else {
                  if (draf === 'save') {
                    vm.$store.dispatch('postDossierIntoGroup', dataAddGroup).then(function (result) {
                      vm.loadingAction = false
                      toastr.success('Lưu công văn thành công')
                      vm.$router.push({
                        path: '/danh-sach-ho-so/' + currentParams.index + '?' + window.location.href.split('?')[1]
                      })
                    }).catch (() => {
                      vm.loadingAction = false
                    })
                  } else {
                    // do action dossierIntoGroup
                    vm.processAction()
                  }
                }
              }).catch(rejectXhr => {
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
          toastr.error('Vui lòng điền đầy đủ các thông tin bắt buộc')
        }
        
      }
      
    },
    createDossierIntoGroup () {
      // Tạo hồ sơ -> add vào nhóm
      let vm = this
      let query = vm.$router.history.current.query
      vm.activeAddGroup = false
      vm.activeAddDossierIntoGroup = true
      let data = {
        serviceCode: vm.thongTinNhomHoSo.serviceCode,
        govAgencyCode: vm.thongTinNhomHoSo.govAgencyCode,
        templateNo: vm.thongTinNhomHoSo.dossierTemplateNo,
        originality: vm.originality,
        groupDossierId: vm.thongTinNhomHoSo.dossierId,
        dossierId: ''
      }
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.currentDossierIntoGroup = result
        data.dossierId = result.dossierId
        setTimeout (function () {
          result['editable'] = false
          if (vm.formCode === 'NEW_GROUP_CV' || vm.formCode === 'NEW_GROUP_CV_DI') {
            vm.$refs.thongtinchuhosocongvan.initData(result)
          }
          
          if (result.dossierStatus === '') {
            vm.$store.dispatch('pullNextactions', result).then(result2 => {
              if (result2) {
                var actionDetail = result2.filter(function (item) {
                  return (item.actionCode === 1100 || item.actionCode === '1100')
                })
                vm.$store.dispatch('processPullBtnDetail', {
                  dossierId: result.dossierId,
                  actionId: actionDetail[0] ? actionDetail[0].processActionId : ''
                }).then(resAction => {
                  result['editable'] = resAction && resAction.receiving ? resAction.receiving.editable : false
                  result['receivingDuedate'] = resAction && resAction.receiving && resAction.receiving.dueDate ? resAction.receiving.dueDate : null
                  result['receivingDate'] = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                  vm.editableDate = resAction && resAction.receiving ? resAction.receiving.editable : false
                  vm.dueDateEdit = resAction && resAction.receiving && resAction.receiving.dueDate ? resAction.receiving.dueDate : ''
                  vm.receiveDateEdit = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                  if (resAction && resAction.payment && resAction.payment.requestPayment > 0) {
                    vm.showThuPhi = true
                    vm.payments = resAction.payment
                  }
                  // 
                  let mauGP = vm.getSearchParams(resAction['preCondition'], 'validateDeliverable')
                  if (mauGP) {
                    vm.getThongTinValidateGp(mauGP)
                  }
                })
              } else {
              }
            })
          } else {
            if (vm.$refs.thongtinchunghoso) {
              console.log('has thong tin chung ho so')
              vm.$refs.thongtinchunghoso.initData(result)
            }
          }
          // copy file 
          let count = 0
          let files = vm.filesGroupDossier.filter(function(item) {
            return (item['dossierPartType'] === 6 || item['dossierPartType'] === 7)
          })
          if (files.length > 0) {
            let dossierFileIds = files.map(obj =>{ 
              return obj.dossierFileId
            }).toString()
            let filterCopyFile = {
              dossierIds: result.dossierId,
              dossierFileId: dossierFileIds
            }
            vm.$store.dispatch('uploadFileDossierGroup', filterCopyFile).then(function (resultFile) {
              setTimeout(function () {
                vm.$refs.thanhphanhoso.initData(result)
              }, 300)
            })
          } else {
            vm.$refs.thanhphanhoso.initData(result)
          }
          // 
          vm.viaPortalDetail = result.viaPostal
          if (result.viaPostal > 0) {
            let postalAddress = result.address ? (result.address + ', ' + result.wardName + ' - ' + result.districtName + ' - ' + result.cityName) : ''
            if (vm.formCode === 'NEW' && vm.originality === 1) {
              result['postalAddress'] = postalAddress
              result['postalTelNo'] = vm.thongTinChuHoSo['contactTelNo']
            }
            vm.$store.commit('setDichVuChuyenPhatKetQua', result)
          }
        }, 300)
        vm.$store.dispatch('postDossierIntoGroup', data).then(function (result) {
        })
      }).catch(reject => {
      })
    },
    uploadfileDossierImport: function (e) {
      var vm = this
      let thanhphanhoso = vm.$refs.thanhphanhoso1.dossierTemplateItems
      thanhphanhoso = thanhphanhoso.filter(function (item) {
        return (item['partType'] === 1 || item['partType'] === 6)
      })
      // console.log('thanhphanhoso', thanhphanhoso)
      vm.$store.dispatch('loadDossierFiles', vm.thongTinNhomHoSo['dossierId']).then(function (result) {
        let files = []
        for (let index in result) {
          if (result[index]['dossierPartType'] === 1 || result[index]['dossierPartType'] === 6) {
            files.push(result[index]['dossierFileId'])
          }
        }
        vm.dossierFiles = files ? files.toString() : ''
        vm.progressUploadFile = true
        let data = {}
        vm.countDossierProgress = 0
        vm.valueProgress = 0
        vm.listDossierImport = []
        vm.dossierError = []
        vm.dossierSuccess = []
        vm.countDossierSuccess = 0
        data['dossierId'] = vm.thongTinNhomHoSo['dossierId']
        data['referenceUid'] = vm.thongTinNhomHoSo['referenceUid']
        data['selector'] = 'dossierImport'
        data['partTip'] = {
          tip: '',
          maxSize: 10,
          extensions: 'xlsx,xls'
        }
        let file = $('#dossierImport')[0].files[0]
        vm.$store.dispatch('uploadDossierFileImport', data).then(function (result) {
          vm.progressUploadFile = false
          vm.totalDossier = result.total
          if (result.total) {
            let cf = confirm('Bạn có chắc chắn thực hiện hành động này?')
            if (cf) {
              vm.dialogImportDosier = true
              vm.listDossierImport = result.data
              console.log(result.data)
              setTimeout(function () {
                if (vm.listDossierImport.length) {
                  vm.loadingImportDossier = true
                  let action = []
                  vm.listDossierImport.forEach(function (item, index) {
                    setTimeout(function () {
                      action.push(vm.doCreateDossier(item, index))
                      if (action.length === vm.listDossierImport.length) {
                        Promise.all(action).then(function (result) {
                          vm.loadingImportDossier = false
                          // add dossier into group
                          console.log('dossierSuccess 1123412', vm.dossierSuccess)
                          let dataAddGroup = {
                            groupDossierId: vm.thongTinNhomHoSo.dossierId,
                            dossierId: ''
                          }
                          let dossierIdArr = []
                          for (let key in vm.dossierSuccess) {
                            dossierIdArr.push(vm.dossierSuccess[key]['dossierId'])
                          }
                          dataAddGroup['dossierId'] = dossierIdArr.toString()
                          console.log('dataAddGroup', dataAddGroup)
                          vm.$store.dispatch('postDossierIntoGroup', dataAddGroup).then(function (result) {
                            if (vm.dossierError.length === 0) {
                              toastr.success('Import hồ sơ thành công')
                              vm.getDetaiGroup(vm.thongTinNhomHoSo.dossierId)
                              vm.dialogImportDosier = false
                            }
                          })
                          // 
                        }).catch(function (xhr) {
                          vm.loadingImportDossier = false
                        })
                      }
                    }, index * 1000);
                  })
                }
              }, 300);
            }
          } else {
            vm.listDossierImport = []
            toastr.error('Dữ liệu bị lỗi, vui lòng kiểm tra lại!')
          }
        }).catch(function (xhr) {
          vm.dialogImportDosier = false
          vm.progressUploadFile = false
          toastr.error('Tải file lỗi, vui lòng thử lại!')
        })
      }).catch(function (reject) {

      })
    },
    importIntoGroup () {
      let vm = this
      document.getElementById('dossierImport').value = ''
      document.getElementById('dossierImport').click()
    },
    addDossierAgain () {
      let vm = this
      vm.countDossierProgress = vm.dossierSuccess.length
      vm.valueProgress = vm.countDossierProgress * 100 / vm.totalDossier
      console.log('valueProgress++++', vm.valueProgress)
      vm.countDossierSuccess = vm.dossierSuccess.length
      if (vm.dossierError.length) {
        vm.loadingImportDossier = true
        let action = []
        vm.dossierError.forEach(function (item, index) {
          setTimeout(function () {
            action.push(vm.doCreateDossier(item, index))
            if (action.length === vm.dossierError.length) {
              Promise.all(action).then(function (result) {
                vm.loadingImportDossier = false
                // add dossier into group
                console.log('dossierSuccess 1', vm.dossierSuccess)
                let dataAddGroup = {
                  groupDossierId: vm.thongTinNhomHoSo.dossierId,
                  dossierId: ''
                }
                let dossierIdArr = []
                for (let key in vm.dossierSuccess) {
                  dossierIdArr = dossierIdArr.push(vm.dossierSuccess[key]['dossierId'])
                  dataAddGroup['dossierId'] = dossierIdArr.toString()
                }
                vm.$store.dispatch('postDossierIntoGroup', dataAddGroup).then(function (result) {
                  if (vm.dossierError.length === 0) {
                    toastr.success('Import hồ sơ thành công')
                    vm.getDetaiGroup(vm.thongTinNhomHoSo.dossierId)
                    vm.dialogImportDosier = false
                  }
                })
                // 
              }).catch(function (xhr) {
                vm.loadingImportDossier = false
              })
            }
          }, index * 1000);
        })
      }
    },
    doCreateDossier (item, index) {
      return new Promise((resolve, reject) => {
        var vm = this
        let thanhphanhoso = this.$refs.thanhphanhoso1.dossierTemplateItems
        let dataTotal = {}
        let dataDossier = item
        let dataDossiermark = ''
        let dataDossierFile = ''
        let dataDossierPayment = ''
        let thongTinChungHS = vm.$refs.thongtinnguoinophoso
        // let dichVuChuyenKetQua = vm.$refs.dichvuchuyenphatketqua
        dataTotal['serviceCode'] = vm.thongTinNhomHoSo['serviceCode']
        dataTotal['govAgencyCode'] = vm.thongTinNhomHoSo['govAgencyCode']
        dataTotal['dossierTemplateNo'] = vm.thongTinNhomHoSo['dossierTemplateNo']
        dataTotal['originality'] = vm.originality
        if (thanhphanhoso && thanhphanhoso.length) {
          let tmp = thanhphanhoso.map(item => {
            return {
              partNo: item.partNo,
              partName: item.partName,
              fileMark: item.fileMark
            }
          })
          dataDossiermark = JSON.stringify(tmp)
        } else {
          dataDossiermark = ''
        }
        dataTotal['dossierMarks'] = dataDossiermark
        if (thongTinChungHS && thongTinChungHS['thongTinNguoiNopHoSo']) {
          let thongTinNguoiNop = thongTinChungHS['thongTinNguoiNopHoSo']
          dataDossier = Object.assign(dataDossier, thongTinNguoiNop)
        }
        // dataDossier = Object.assign(dataDossier, vm.dichVuChuyenPhatKetQua)
        dataTotal['dossiers'] = dataDossier ? JSON.stringify(dataDossier) : ''
        dataTotal['dossierFiles'] = vm.dossierFiles ? vm.dossierFiles : ''
        dataTotal['payment'] = dataDossierPayment ? JSON.stringify(dataDossierPayment) : ''

        vm.$store.dispatch('importDossier', dataTotal).then(function (result) {
          // ---------
          vm.countDossierProgress ++
          vm.valueProgress += (100 / vm.totalDossier)
          vm.listDossierImport[index]['dossierId'] = result['dossierId']
          vm.listDossierImport[index]['flagError'] = false
          if (vm.countDossierSuccess < vm.listDossierImport.length) {
            vm.countDossierSuccess ++
          }
          vm.calDossierErrorSuccess()
          resolve(true)
        }).catch(xhr => {
          console.log(xhr)
          vm.countDossierProgress ++
          vm.valueProgress += (100 / vm.totalDossier)
          vm.listDossierImport[index]['flagError'] = true
          vm.calDossierErrorSuccess()
          reject(xhr)
        })
      })
    },
    calDossierErrorSuccess () {
      let vm = this
      vm.dossierError = vm.listDossierImport.filter(function (item) {
        return item['flagError']
      })
      vm.dossierSuccess = vm.listDossierImport.filter(function (item) {
        return !item.hasOwnProperty('flagError') || !item['flagError']
      })
    },
    tiepNhanHoSo (type) {
      var vm = this
      vm.$store.commit('setPrintPH', false)
      let thongtinchuhoso = this.$refs.thongtinchuhoso.getThongTinChuHoSo()
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      // let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      if (validThongtinchuhoso['validForm']) {
        let passValid = true
        if (passValid) {
          vm.loadingAction = true
          if (!vm.$refs.thanhphanhoso.validDossierTemplate()) {
            vm.loadingAction = false
            return
          }
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
          thongtinnguoinophoso = {
            sameUser: false,
            delegateName: vm.thongTinNhomHoSo['delegateName'],
            delegateCityCode: vm.thongTinNhomHoSo['delegateCityCode'],
            delegateAddress: vm.thongTinNhomHoSo['delegateAddress'],
            delegateDistrictCode: vm.thongTinNhomHoSo['delegateDistrictCode'],
            delegateWardCode: vm.thongTinNhomHoSo['delegateWardCode'],
            delegateEmail: vm.thongTinNhomHoSo['delegateEmail'],
            delegateTelNo: vm.thongTinNhomHoSo['delegateTelNo'],
            delegateIdNo: vm.thongTinNhomHoSo['delegateIdNo']
          }
          var tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua)
          tempData['dossierId'] = vm.currentDossierIntoGroup.dossierId
          tempData['sampleCount'] = vm.currentDossierIntoGroup.sampleCount
          tempData['originality'] = vm.originality
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            vm.loadingAction = false
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            if (vm.formCode === 'UPDATE') {
              vm.goBack()
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
              }
              var payloadDate = {
                'dueDate': vm.editableDate && tempData.dueDate ? tempData.dueDate : vm.dueDateEdit,
                'receiveDate': vm.receiveDateEdit
              }
              let dataPostAction = {
                dossierId: vm.currentDossierIntoGroup.dossierId,
                actionCode: 1100,
                actionNote: '',
                actionUser: actionUser,
                payload: payloadDate,
                security: '',
                assignUsers: '',
                payment: paymentsOut,
                createDossiers: ''
              }
              vm.loadingAction = true
              vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
                vm.loadingAction = false
                if (!type) {
                  toastr.success('Thêm hồ sơ vào nhóm thành công')
                  vm.getDetaiGroup(vm.id)
                  vm.activeAddDossierIntoGroup = false
                } else {
                  // tạo hồ sơ mới
                  vm.createDossierIntoGroup()
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
        }
      }
    },
    tiepNhanHoSoCongVan (type) {
      var vm = this
      let thongtinchuhosocongvan = this.$refs.thongtinchuhosocongvan.getThongTinChuHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      // let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      // console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      // let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      // if (validThongtinchuhoso['validForm']) {
        let passValid = true
        if (passValid && thongtinchuhosocongvan.validation && vm.$refs.formTenHoSo.validate()) {
          vm.loadingAction = true
          if (!vm.$refs.thanhphanhoso.validDossierTemplate()) {
            vm.loadingAction = false
            return
          }
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
          console.log('assign=congvan', thongtinchuhosocongvan, dichvuchuyenphatketqua)
          let tempData = Object.assign(thongtinchuhosocongvan, dichvuchuyenphatketqua)
          tempData['dossierId'] = vm.currentDossierIntoGroup.dossierId
          tempData['sampleCount'] = vm.currentDossierIntoGroup.sampleCount
          tempData['originality'] = vm.originality
          tempData['userType'] = '1'
          console.log('putDossierIntoCongVan', tempData)
          let doAction = function () {
            // ham put hồ sơ công văn
            vm.$store.dispatch('putDossier', tempData).then(function (result) {
              vm.loadingAction = false
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              if (vm.formCode === 'UPDATE') {
                vm.goBack()
              } else {
                let initData = vm.$store.getters.loadingInitData
                let actionUser = initData.user.userName ? initData.user.userName : ''
                //
                let paymentsOut = {}
                if (vm.showThuPhi) {
                  paymentsOut = {
                    requestPayment: vm.payments['requestPayment'],
                    paymentNote: vm.payments['paymentNote'],
                    advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                    feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                    serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                    shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
                  }
                }
                var payloadDate = {
                  'dueDate': vm.editableDate && tempData.dueDate ? tempData.dueDate : vm.dueDateEdit,
                  'receiveDate': vm.receiveDateEdit
                }
                let dataPostAction = {
                  dossierId: vm.currentDossierIntoGroup.dossierId,
                  actionCode: 1100,
                  actionNote: '',
                  actionUser: actionUser,
                  payload: payloadDate,
                  security: '',
                  assignUsers: '',
                  payment: paymentsOut,
                  createDossiers: ''
                }
                vm.loadingAction = true
                vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
                  vm.loadingAction = false
                  if (!type) {
                    toastr.success('Thêm hồ sơ vào nhóm thành công')
                    vm.getDetaiGroup(vm.id)
                    vm.activeAddDossierIntoGroup = false
                  } else {
                    // tạo hồ sơ mới
                    vm.createDossierIntoGroup()
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
            // 
          }
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
          
        } else {
          vm.loadingAction = false
          toastr.clear()
          toastr.error('Dữ liệu không hợp lệ')
        }
      // }
    },
    changeViapostal (viapostal) {
      if (viapostal) {
        this.viaPortalDetail = 2
      } else {
        this.viaPortalDetail = 1
      }
    },
    durationText (durationUnit, durationCount) {
      let durationText
      if (durationUnit === 1 && durationCount > 8) {
        let day = Math.floor(durationCount / 8) + ' ngày'
        let hours
        if (durationCount % 8 !== 0) {
          hours = ((durationCount / 8) - Math.floor(durationCount / 8)) * 8 + ' giờ'
        } else {
          hours = ''
        }
        durationText = `${day} ${hours}`
      } else if (durationUnit === 0) {
        durationText = durationCount + ' ngày'
      } else if (durationUnit === 1 && durationCount <= 8) {
        durationText = durationCount + ' giờ'
      }
      return durationText
    },
    viewDetail (item, indexItem) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.$router.push('/danh-sach-ho-so/0/chi-tiet-ho-so/' + item['dossierId'])
    },
    editDossierIntoGroup (item) {
      let vm = this
      let query = vm.$router.history.current.query
      query['template_no'] = item.dossierTemplateNo
      query['serviceCode'] = item.serviceCode
      vm.$router.push({
        path: '/danh-sach-ho-so/0/ho-so/' + item.dossierId + '/UPDATE',
        query: query
      })
    },
    removeDossierFromGroup (item) {
      let vm = this
      let filter = {
        dossierId: item.dossierId,
        groupDossierId: vm.thongTinNhomHoSo['dossierId']
      }
      let x = confirm('Bạn có muốn thực hiện thao tác này?')
      if (x) {
        vm.$store.dispatch('removeDossierFromGroup', filter).then(function (result) {
          toastr.success('Yêu cầu thực hiện thành công')
          setTimeout(() => {
            let filter1 = {
              groupDossierId: vm.thongTinNhomHoSo['dossierId']
            }
            vm.$store.dispatch('getDossiersIntoGroup', filter1).then(function (result) {
              vm.dossiersIntoGroup = result
              if ((vm.metaDataGroupDossier.hasOwnProperty('congvandagui') && vm.metaDataGroupDossier.congvandagui) || !vm.metaDataGroupDossier.hasOwnProperty('congvandagui')) {
                vm.activeDeleteCongVan = vm.dossiersIntoGroup.length === 0 ? true : false
              }
              vm.$store.commit('setSelectDossierGroup', vm.dossiersIntoGroup)
              if (vm.dossiersIntoGroup.length > 0) {
                let steps = []
                for (let index in vm.dossiersIntoGroup) {
                  if (steps.filter(function (item) {
                    return String(item['stepCode']) === String(vm.dossiersIntoGroup[index]['stepCode'])
                  }).length === 0) {
                    steps.push({
                      stepCode: vm.dossiersIntoGroup[index]['stepCode'],
                      stepName: vm.dossiersIntoGroup[index]['stepName']
                    })
                  }
                  vm.stepList = steps
                }
                vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
              }
              vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
            }).catch(function () {
              toastr.error('Yêu cầu thực hiện thất bại')
            })
          }, 100)
        })
      }
    },
    removeAllDossierFromGroup () {
      let vm = this
      let arrRemove = []
      for (let i = 0; i < vm.hoSoDaXuLy.length; i++) {
        arrRemove.push(vm.$store.dispatch('removeDossierFromGroup', {dossierId: vm.hoSoDaXuLy[i].dossierId, groupDossierId: vm.thongTinNhomHoSo['dossierId']}))
      }
      vm.loadingAction = true
      Promise.all(arrRemove).then(function () {
        vm.loadingAction = false
        toastr.success('Yêu cầu thực hiện thành công')
        setTimeout(() => {
          let filter1 = {
            groupDossierId: vm.thongTinNhomHoSo['dossierId']
          }
          vm.$store.dispatch('getDossiersIntoGroup', filter1).then(function (result) {
            vm.dossiersIntoGroup = result
            if ((vm.metaDataGroupDossier.hasOwnProperty('congvandagui') && vm.metaDataGroupDossier.congvandagui) || !vm.metaDataGroupDossier.hasOwnProperty('congvandagui')) {
              vm.activeDeleteCongVan = vm.dossiersIntoGroup.length === 0 ? true : false
            }
            vm.$store.commit('setSelectDossierGroup', vm.dossiersIntoGroup)
            if (vm.dossiersIntoGroup.length > 0) {
              let steps = []
              for (let index in vm.dossiersIntoGroup) {
                if (steps.filter(function (item) {
                  return String(item['stepCode']) === String(vm.dossiersIntoGroup[index]['stepCode'])
                }).length === 0) {
                  steps.push({
                    stepCode: vm.dossiersIntoGroup[index]['stepCode'],
                    stepName: vm.dossiersIntoGroup[index]['stepName']
                  })
                }
                vm.stepList = steps
              }
              vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
            }
            vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
          }).catch(function () {
          })
        }, 100)
      }).catch(function () {
        vm.loadingAction = false
      })
    },
    addFileToDossier () {
      let vm = this
      // add file cho thành phần hồ sơ con
      let dossierIds = vm.selectedAttach.map(obj =>{
        return obj.dossierId
      }).toString()
      let dossierFileIds = vm.filesAdd.map(obj =>{
        return obj.dossierFileId
      }).toString()
      let filterCopyFile = {
        dossierIds: dossierIds,
        dossierFileId: dossierFileIds
      }
      // for (let index in vm.filesAdd) {
      //   filterCopyFile.dossierFileId = vm.filesAdd[index]['dossierFileId']
        vm.$store.dispatch('uploadFileDossierGroup', filterCopyFile).then(function (result) {
          toastr.success('Đính kèm tài liệu thành công')
          // vm.$store.commit('setActiveAddFileGroup', false)
        })
      // }
    },
    searchKeyWordDossierToAdd () {
      let vm = this
      vm.selectMultiplePage = []
      vm.searchDossierToAdd()
    },
    searchDossierToAdd () {
      let vm = this
      let menuConfigsCongVan
      if (vm.formCode === 'NEW_GROUP_CV') {
        menuConfigsCongVan = vm.menuConfigs.filter(function (item) {
          return item.id.startsWith('CV_DEN')
        })[0]
      } else {
        menuConfigsCongVan = vm.menuConfigs.filter(function (item) {
          return item.id.startsWith('CV_DI')
        })[0]
      }
      let apiGetDossier = menuConfigsCongVan['tableConfig'].hasOwnProperty('apiGetDossierAddGroup') ? menuConfigsCongVan['tableConfig']['apiGetDossierAddGroup'] : ''
      let filter = {
        api: apiGetDossier,
        dossierNo: vm.dossierNoKey,
        service: vm.thongTinNhomHoSo.serviceCode,
        page: vm.hosoDatasPage,
        numberPerPage: vm.numberPerPageAddDossier,
        originality: 3,
        sort: 'dossierNo',
        top: 'passed',
        order: true,
        groupDossierIdHs: vm.thongTinNhomHoSo.dossierId
      }
      if (vm.metaDataGroupDossier.hasOwnProperty('requiredCVDenGroupId')) {
        filter = Object.assign(filter, {groupDossierId: vm.metaDataGroupDossier.requiredCVDenGroupId})
      }
      if (apiGetDossier) {
        vm.$store.dispatch('getHoSoAddGroup', filter).then(function (result) {
          let resultFilter = result.hasOwnProperty('data') ? result.data : []
          resultFilter = resultFilter.filter(function (item) {
            return String(item.stepCode) === String(vm.metaDataGroupDossier.stepcode)
          })
          vm.dossiersSelectAdd = resultFilter
          vm.hosoDatasTotal = resultFilter.length

          vm.hosoTotalPage = Math.ceil(vm.hosoDatasTotal / vm.numberPerPageAddDossier)
          if (vm.hosoTotalPage > 0 && vm.selectMultiplePage.length === 0) {
            for (let key = 0; key < vm.hosoTotalPage; key++) {
              let item = {
                selected: [],
                page: key + 1
              }
              vm.selectMultiplePage.push(item)
            }
          }
          vm.selectedDossierAdd = vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected']
        }).catch(reject => {
          vm.dossiersSelectAdd = []
          vm.hosoDatasTotal = 0
        })
      } else {
        vm.dossiersSelectAdd = []
        vm.hosoDatasTotal = 0
      }
      
    },
    changeSelectedDossierAdd () {
      let vm = this
      console.log('selectedDossierAdd', vm.selectedDossierAdd)
      vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected'] = vm.selectedDossierAdd
    },
    addMultipleDossierToGroup () {
      let vm = this
      console.log('selectedDoAction', vm.selectedDoAction)
      let arrDossierId = []
      let arrLength = vm.selectedDoAction.length
      for (let index = 0; index < arrLength; index++) {
        let id = vm.selectedDoAction[index]['dossierId']
        arrDossierId.push(id)
      }
      vm.addDossierToGroup(false, arrDossierId.toString())
    },
    addDossierToGroup (item, multiple) {
      let vm = this
      vm.loadingAction = true
      let data = {
        groupDossierId: vm.thongTinNhomHoSo.dossierId,
        dossierId: multiple ? multiple : item.dossierId
      }
      vm.$store.dispatch('postDossierIntoGroup', data).then(function (result) {
        toastr.clear()
        toastr.success('Thêm hồ sơ thành công')
        setTimeout(() => {
          vm.loadingAction = false
          vm.dialogAddDossier = false
          vm.$store.dispatch('getDossiersIntoGroup', data).then(function (result) {
            vm.dossiersIntoGroup = result
            if ((vm.metaDataGroupDossier.hasOwnProperty('congvandagui') && vm.metaDataGroupDossier.congvandagui) || !vm.metaDataGroupDossier.hasOwnProperty('congvandagui')) {
              vm.activeDeleteCongVan = vm.dossiersIntoGroup.length === 0 ? true : false
            }
            vm.$store.commit('setSelectDossierGroup', vm.dossiersIntoGroup)
            if (vm.dossiersIntoGroup.length > 0) {
              let steps = []
              for (let index in vm.dossiersIntoGroup) {
                if (steps.filter(function (item) {
                  return String(item['stepCode']) === String(vm.dossiersIntoGroup[index]['stepCode'])
                }).length === 0) {
                  steps.push({
                    stepCode: vm.dossiersIntoGroup[index]['stepCode'],
                    stepName: vm.dossiersIntoGroup[index]['stepName']
                  })
                }
              }
              vm.stepList = steps
            }
            vm.dossiersIntoGroupRender = vm.dossiersIntoGroup
          })
        }, 500)
        
        // copy file 
        let count = 0
        let files = vm.filesGroupDossier.filter(function(item) {
          return (item['dossierPartType'] === 6 || item['dossierPartType'] === 7)
        })
        if (files.length > 0) {
          let dossierFileIds = files.map(obj =>{ 
            return obj.dossierFileId
          }).toString()
          let filterCopyFile = {
            dossierIds: multiple ? multiple : item.dossierId,
            dossierFileId: dossierFileIds
          }
          vm.$store.dispatch('uploadFileDossierGroup', filterCopyFile).then(function (resultFile) {
          })
        }
        // 
      }).catch(function () {
        vm.loadingAction = false
      })
    },
    processAction () {
      let vm = this
      let initData = vm.$store.getters.loadingInitData
      let actionUser = initData.user.userName ? initData.user.userName : ''
      let filter = {
        dossierId: vm.thongTinNhomHoSo['dossierId'],
        actionCode: vm.metaDataGroupDossier.actioncode,
        actionUser: actionUser
      }
      if (vm.dossiersIntoGroupRender.length > 0) {
        vm.loadingAction = true
        vm.$store.dispatch('doActionDossierIntoGroup', filter).then(function (result) {
          vm.loadingAction = false
          toastr.success('Lưu và gửi công văn thành công')
          vm.$router.push({
            path: '/danh-sach-ho-so/' + vm.index,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
              q: vm.menuConfigs[vm.index]['queryParams']
            }
          })
        }).catch(function (reject) {
          vm.loadingAction = false
        })
      } else {
        vm.loadingAction = false
        toastr.error('Công văn chưa có hồ sơ')
      }

    },
    getDetailActionCongVan () {
      let vm = this
      let filter = {
        dossierId: vm.thongTinNhomHoSo['dossierId'],
        stepCode: vm.metaDataGroupDossier.stepcode,
        actionCode: vm.metaDataGroupDossier.actioncode
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
        console.log('createFileCongVan', vm.createFileCongVan)
      })
    },
    createFileKqCongVan (action) {
      let vm = this
      let filter = {
        dossierId: vm.thongTinNhomHoSo['dossierId'],
        partNo: vm.createFileCongVan
      }
      vm.$store.dispatch('loadFormData', filter).then(function (result) {
        let formData = JSON.parse(result)
        let formDataPut = Object.assign(formData, {tp: vm.createFileCongVan, dossierId: vm.thongTinNhomHoSo['dossierId']})
        vm.$store.dispatch('postEformCallBack', formDataPut).then(function (result) {})
        
      }).catch(function (reject) {
      })
      
    },
    printCongVan () {
      let vm = this
      vm.loadingAction = true
      vm.$store.dispatch('loadDossierFiles', vm.thongTinNhomHoSo['dossierId']).then(result => {
        let files = result
        let fileKq = files.filter(function(item) {
          return item.dossierPartNo == vm.createFileCongVan && item.eForm && String(item.dossierPartType) === '7'
        })[0]
        if (fileKq && fileKq['fileSize']) {
          vm.$store.dispatch('viewFile', fileKq).then(result => {
            vm.loadingAction = false
            vm.dialogPDF = true
            document.getElementById('dialogPdfFile').src = result
          }).catch(reject => {
            vm.loadingAction = false
          })
        } else {
          toastr.error('Bản in công văn chưa được tạo')
          vm.loadingAction = false
        }
      }).catch (() => {
        vm.loadingAction = false
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
    deleteCongVan () {
      let vm = this
      let filter = {
        dossierId: vm.thongTinNhomHoSo['dossierId']
      }
      let x = confirm('Bạn có chắc chắn thực hiện xóa công văn?')
      if (x) {
        vm.$store.dispatch('deleteDossier', filter).then(function (result) {
          toastr.success('Xóa công văn thành công')
          vm.$router.push({
            path: '/danh-sach-ho-so/' + vm.index,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
              q: vm.menuConfigs[vm.index]['queryParams']
            }
          })
        }).catch(function (){})
      }
    },
    getMetaData (val) {
      let metaDataOut = ''
      try {
        metaDataOut = JSON.parse(val.metaData)
      } catch (error) {
      }
      return metaDataOut
    },
    checkGroupDossierIdCvDen (childGroupDossierId, action, dossier) {
      let vm = this
      let owner = true
      if (childGroupDossierId) {
        if (childGroupDossierId.split(',').length > 1 || (childGroupDossierId.split(',').length === 1 && childGroupDossierId.split(',')[0] != vm.thongTinNhomHoSo['dossierId'])) {
          owner = false
        }
      }
      if (vm.formCode === 'NEW_GROUP_CV_DI') {
        owner = true
      }
      if (action === 'editAction' && vm.formCode === 'NEW_GROUP_CV_DI' && vm.thongTinNhomHoSo['govAgencyCode'] !== dossier['govAgencyCode']) {
        owner = false
      }
      if (vm.formCode === 'NEW_GROUP_CV_DI' && dossier.stepCode != vm.metaDataGroupDossier.stepcode) {
        owner = false
      }
      return owner
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
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    },
    cancelAddFile () {
      let vm = this
      // vm.$store.commit('setActiveAddFileGroup', false)
    },
    toggleAll () {
      var vm = this
      if (vm.selected.length) {
        vm.selected = []
      } else {
        vm.selected = vm.dossiersIntoGroupRender
      }
    },
    toggleAllSelectDossierAdd () {
      let vm = this
      if (vm.selectedDossierAdd.length) {
        vm.selectedDossierAdd = []
      } else {
        vm.selectedDossierAdd = vm.dossiersSelectAdd
      }
      vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected'] = vm.selectedDossierAdd
      console.log('selectedDossierAdd all', vm.selectedDossierAdd)
      console.log('selectMultiplePage all', vm.selectMultiplePage)
    },
    toggleAllSelectDialog () {
      var vm = this
      console.log('toggleAllSelectDialog', vm.dossiersIntoGroupRender, vm.selectedAttach)
      if (vm.selectedAttach.length) {
        vm.selectedAttach = []
      } else {
        vm.selectedAttach = vm.dossiersIntoGroupRender
      }
      console.log('toggleAllSelectDialog 2', vm.selectedAttach)
    },
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (vm.activeAddDossierIntoGroup) {
        vm.activeAddDossierIntoGroup = false
        vm.getDetaiGroup(vm.id)
      } else {
        vm.$router.push({
          path: '/danh-sach-ho-so/' + currentParams.index,
          query: currentQuery
        })
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
