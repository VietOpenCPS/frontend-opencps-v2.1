<template>
  <div>
    <v-card flat>
      <div class="d-inline-block" v-if="checkInput === 1" style="position: absolute;right: 10px;top: -50px">
        <v-radio-group v-model="markCheck" row @change="markAll">
          <v-radio
            label="Tất cả đạt"
            color="success"
            :value="1"
          ></v-radio>
          <v-radio
            label="Tất cả không đạt"
            color="error"
            :value="2"
          ></v-radio>
          <v-radio
            label="Tất cả chưa kiểm tra"
            color="warning"
            :value="0"
          ></v-radio>
        </v-radio-group>
      </div>
      <div class="form_alpaca" style="position: relative;overflow: hidden;" v-for="(item, index) in dossierTemplateItemsFilter" v-bind:key="item.partNo">
        <v-expansion-panel expand :value="currentFormView === ('formAlpaca' + item.partNo + id) ? [true] : [false]" class="expaned__list__data">
          <v-expansion-panel-content hide-actions>
            <div slot="header" @click="stateView = false" style="background-color:#fff">
              <div style="align-items: center;background: #fff; padding-left: 25px;" :style="{width: checkStyle(item)}">
                <div class="mr-2" @click="item.hasForm ? loadAlpcaFormClick(item, index) : ''" style="min-width: 20px; display: flex;">
                  <div v-if="originality === 3 && (formCodeInput === 'NEW' || formCodeInput === 'NEW_GROUP')" @click='$event.stopPropagation()' class="header__tphs check-template mr-2" style="width: 20px;margin-left: -15px;">
                    <v-checkbox class="my-0 py-0" v-model="item['hasTemplate']" @change="changeHasTemplate(index, item)"></v-checkbox>
                  </div>
                  <div v-if="originality === 3 && tempLienThong" @click='$event.stopPropagation()' class="header__tphs check-template mr-2" style="width: 20px;margin-left: -15px;">
                    <v-checkbox class="my-0 py-0" v-model="item['hasTemplateLienThong']" @change="changeHasTemplateLienThong(index, item)"></v-checkbox>
                  </div>
                  <div class="header__tphs" style="min-width:20px"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                  <div class="header__tphs" style="text-align: justify;">
                    <v-tooltip top style="max-width: 100% !important;" v-if="item.partTip && item.partTip['tip']">
                      <span slot="activator">
                        {{item.partName}}
                        <span v-if="item.required" style="color: red">&nbsp;  (*) </span>
                        <span v-if="item.hasForm" style="color:#004b94">(Bản khai trực tuyến)</span>
                      </span>
                      <span v-if="item.partTip['tip']">{{item.partTip['tip']}}</span>
                    </v-tooltip>
                    <span v-else>
                      {{item.partName}} <span v-if="item.required" style="color: red">&nbsp;  (*) </span>
                      <span v-if="item.hasForm" style="color:#004b94">(Bản khai trực tuyến)</span>
                    </span>
                    <!-- <v-tooltip top v-if="item.hasForm && item.daKhai && ((originality === 1 && item.partType !==2) || originality !== 1)">
                      <i slot="activator" style="color: #0d71bb; font-size: 13px;" class="fa fa-file-text-o" aria-hidden="true"></i>
                      <span>Biểu mẫu trực tuyến (Đã khai)</span>
                    </v-tooltip> -->
                    <!-- <v-tooltip top v-if="item.hasForm && !item.daKhai && ((originality === 1 && item.partType !==2) || originality !== 1)">
                      <i slot="activator" style="color: #0d71bb; font-size: 13px;" class="fa fa-file-o"></i>
                      <span>Biểu mẫu trực tuyến (Chưa khai)</span>
                    </v-tooltip> -->
                    &nbsp;&nbsp;
                    <v-tooltip top v-if="!item.hasForm && item.hasFileTemp">
                      <v-icon v-on:click.stop="downloadFileTemplate(item, index)" slot="activator" style="color: #0d71bb;" size="16" color="primary">save_alt</v-icon>
                      <span>Biểu mẫu điền thủ công</span>
                    </v-tooltip>
                  </div>
                </div>
                <!-- <i v-if="item.hasForm" style="font-size: 10px; color: #0d71bb; margin-left: 10px;">(Form trực tuyến)</i> 
                <span v-if="item.hasForm">&nbsp;-&nbsp;</span> 
                <i v-if="item.hasForm" style="font-size: 10px;color: #0d71bb;">({{item.daKhai ? 'Đã khai' : 'Chưa khai '}})</i> -->
                <div style="display: flex">
                  <v-text-field
                  v-model="item.fileComment"
                  placeholder="Nhập lý do"
                  v-if="checkInput === 1 && item.fileCheck === 2 && item.stateEditFileCheck"
                  :rules="[v => !!v || 'Bạn phải nhập lý do trước khi gửi']"
                  required
                  @keyup.enter="changeFileComment(item, index)"
                  @click.stop=""
                  class="ml-3"
                  ></v-text-field>
                  <v-tooltip top v-if="checkInput === 1 && item.fileCheck === 2 && item.stateEditFileCheck">
                    <v-btn slot="activator" v-on:click.stop="changeFileComment(item, index)" icon class="mx-0 my-0">
                      <v-icon size="16" class="mx-0" color="primary">send</v-icon>
                    </v-btn>
                    <span>Gửi</span>
                  </v-tooltip>
                </div>
                <i class="pl-3" v-if="item.fileComment && !item.stateEditFileCheck" style="font-size: 12px; color: #0d71bb">Lý do không đạt: {{item.fileComment}}</i>
                <v-tooltip top v-if="item.fileComment && !item.stateEditFileCheck && checkInput === 1">
                  <v-icon slot="activator" v-on:click.stop="item.stateEditFileCheck = !item.stateEditFileCheck" style="font-size: 13px; color: #0d71bb; margin-left: 10px; cursor: pointer;">edit</v-icon>
                  <span>Chỉnh sửa lý do</span>
                </v-tooltip>
                <div class="mt-0" v-for="(itemFileView, index) in dossierFilesItems" :key="index" v-if="item.partNo === itemFileView.dossierPartNo">
                  <!-- <div v-if="itemFileView.eForm && onlyView && itemFileView.fileSize !== 0" :style="{width: 'calc(100% - 370px)', 'display': 'flex', 'align-items': 'center', 'background': '#fff', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '0px'}">
                    <span v-on:click.stop="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;">
                      <i style="font-size: 13px;" class="ml-1 fa fa-file-o"></i> &nbsp;
                      {{itemFileView.dossierTemplateNo + '.pdf'}} - 
                      <i>{{itemFileView.modifiedDate}}</i>
                    </span>
                  </div> -->
                  <div v-if="!itemFileView.eForm" :style="{width: 'calc(100% - 0px)', 'display': 'flex', 'align-items': 'center', 'background': '#fff', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '0px'}">
                    <span v-on:click.stop="viewFile2(itemFileView)" class="ml-1" style="cursor: pointer;">
                      <v-icon class="mr-1" v-if="itemFileView.fileSize !== 0" :color="getDocumentTypeIcon(itemFileView.fileType)['color']"
                        :size="getDocumentTypeIcon(itemFileView.fileType)['size']">
                        {{getDocumentTypeIcon(itemFileView.fileType)['icon']}}
                      </v-icon>
                      {{itemFileView.displayName}} - 
                      <i>{{itemFileView.modifiedDate}}</i>
                    </span>
                    <v-btn icon ripple v-on:click.stop="deleteSingleFile(itemFileView, index)" class="mx-0 my-0" v-if="!onlyView && checkInput !== 1">
                      <v-icon style="color: red">delete_outline</v-icon>
                    </v-btn>
                    <v-btn icon ripple v-on:click.stop="downloadSingleFile(itemFileView)" class="mx-0 my-0">
                      <v-icon size="14" color="primary">fas fa fa-download</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div class="mr-3 my-2 py-2" :id="'fileApplicant-'+item.partNo" style="display:none;max-height: 250px;overflow:auto;border:1px dashed #f3ae75;border-radius: 5px;position:relative">
                  <div v-for="(itemFileView, indexFile) in dossierFilesApplicant" :key="indexFile" v-if="itemFileView.dossierTemplateNo === thongTinHoSo['dossierTemplateNo'] && item.partNo === itemFileView.dossierPartNo" >
                    <div v-if="itemFileView.eForm && itemFileView.fileSize !== 0" :style="{width: 'calc(100% - 0px)', 'display': 'flex', 'align-items': 'center', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '3px'}">
                      <v-tooltip top style="max-width:100%">
                        <span slot="activator" v-on:click.stop="viewGiayToDaNop(itemFileView)" class="" style="cursor: pointer;">
                          <i style="color: #0d71bb; font-size: 13px;" class="ml-1 fa fa-file-o"></i> &nbsp;
                          {{itemFileView.dossierTemplateNo ? itemFileView.dossierTemplateNo : itemFileView.referenceUid}}.{{itemFileView.fileType}} - 
                          <i>{{itemFileView.modifiedDate}}</i>
                        </span>
                        <span>Bản khai trực tuyến</span>
                      </v-tooltip>
                      <v-progress-circular
                      :width="2"
                      :size="25"
                      color="green"
                      indeterminate
                      v-if="progressUploadPart === itemFileView.dossierFileId"
                      ></v-progress-circular>
                      <v-tooltip top v-if="!onlyView && !progressUploadPart" class="ml-2">
                        <v-btn slot="activator" icon class="mx-0 my-0" @click="attachToDossier(itemFileView, index)">
                          <v-badge>
                            <v-icon size="16" color="orange darken-3">cloud_download</v-icon>
                          </v-badge>
                        </v-btn>
                        <span>Sử dụng giấy tờ này</span>
                      </v-tooltip>
                    </div>
                    <div v-else :style="{width: 'calc(100% - 0px)', 'display': 'flex', 'align-items': 'center', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '3px'}">
                      <v-tooltip top style="max-width:100%">
                        <span slot="activator" v-on:click.stop="viewGiayToDaNop(itemFileView)" class="" style="cursor: pointer;">
                          <v-icon style="color: #0d71bb" v-if="itemFileView.fileSize !== 0">attach_file</v-icon>
                          {{itemFileView.displayName}} - 
                          <i>{{itemFileView.modifiedDate}}</i>
                        </span>
                        <span>Đính kèm</span>
                      </v-tooltip>
                      <v-progress-circular
                      :width="2"
                      :size="25"
                      color="green"
                      indeterminate
                      v-if="progressUploadPart === itemFileView.dossierFileId"
                      ></v-progress-circular>
                      <v-tooltip top v-if="!onlyView && !progressUploadPart" class="ml-2">
                        <v-btn slot="activator" icon class="mx-0 my-0" @click="attachToDossier(itemFileView, index)">
                          <v-badge>
                            <v-icon size="16" color="orange darken-3">cloud_download</v-icon>
                          </v-badge>
                        </v-btn>
                        <span>Sử dụng giấy tờ này</span>
                      </v-tooltip>
                    </div>
                  </div>
                  <v-btn class="mx-0 my-0" flat icon color="red" style="position:absolute;right:0px;top:0px"
                  @click.stop="showFilesApplicant(item.partNo)"
                  >
                    <v-icon>clear</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
            <v-card flat v-if="item.hasForm">
              <v-card-text style="background-color: rgba(244, 247, 213, 0.19)">
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-right" v-if="!stateView">
                    <div :id="'wrapForm' + item.partNo + id" :style="pstFixed > pstEl && pstFixed < endEl + pstEl ? 'position:fixed;top:5px;z-index:101' : ''">
                      <v-btn color="primary" @click.stop="saveAlpacaForm(item, index)" 
                        v-if="item['editForm'] && item.hasForm && !onlyView && checkInput !== 1 && !item.embed"
                        :disabled="loadingApacal"
                      >
                        <i class="fa fa-spinner" aria-hidden="true" v-if="loadingApacal"></i>
                        <v-icon color="white" v-else>save</v-icon>&nbsp;
                        Lưu lại
                      </v-btn>
                      <v-btn color="primary" @click.stop="previewFormAlpaca(item, index)" v-if="item['editForm'] && item.daKhai && item.hasForm"
                        :disabled="loadingApacal"
                      >
                        <i class="fa fa-spinner" aria-hidden="true" v-if="loadingApacal"></i>
                        <v-icon color="white" v-else>print</v-icon>&nbsp;
                        Xem
                      </v-btn>
                      <v-btn color="primary" @click.stop="editFormAlpaca(item)" v-if="!item['editForm'] && item.hasForm && !onlyView">
                        <v-icon color="white">edit</v-icon>&nbsp;
                        Sửa
                      </v-btn>
                      <v-btn color="primary" @click.stop="deleteSingleFileEform(item, index)" v-if="item.daKhai && item.hasForm && !onlyView && checkInput !== 1"
                        :disabled="loadingApacal"
                      >
                        <i class="fa fa-spinner" aria-hidden="true" v-if="loadingApacal"></i>
                        <v-icon color="white" v-else>delete</v-icon>&nbsp;
                        Xóa
                      </v-btn>
                    </div>
                    <div :id="'formAlpaca' + item.partNo + id" :style='{"pointer-events: none": onlyView}' v-if="item['editForm'] && !item.embed"></div>

                    <div :style='{"pointer-events: none": onlyView}' v-if="item['editForm'] && item.embed">
                      <iframe :id="'formAlpaca' + item.partNo + id" width="100%" height="500px" frameborder="0" src=""></iframe>
                    </div>
                    <!--  -->
                    <iframe v-if="!item['editForm']" :id="'displayPDF' + item.partNo + id" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
                    </iframe>
                    <!--  -->
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div class="absolute__btn group__thanh_phan mr-1" :style="originality !== 1 ? 'top: 3px' : ''">
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-layout row wrap v-else>
            <v-flex style="width: 100px;" class="layout wrap mr-2" v-if="originality !== 1 && !onlyView">
              <v-text-field
                title="Số lượng"
                style="width:100px"
                v-model="dossierTemplateItemsFilter[index]['recordCount']"
                append-icon="add"
                prepend-inner-icon="remove"
                @click:append="increaseCounter(index)"
                @click:prepend-inner="decreaseCounter(index)"
                clear-icon="mdi-close-circle"
                type="number"
                solo
                flat
                height="32"
                class="counter-up-down text-xs-center"
                :style="onlyView ? 'pointer-events: none' : ''"
                @input="changeRecordCount(index)"
              ></v-text-field>
            </v-flex>
            <v-flex style="width: 100px;" class="layout wrap" v-if="originality !== 1 && (item.partType === 1 || item.partType === 3) && !thongTinHoSo.online && checkInput !== 1">
              <v-autocomplete
                :items="fileMarkItems"
                hide-no-data
                v-model="dossierTemplateItemsFilter[index].fileMark"
                :style="onlyView ? 'pointer-events: none' : ''"
                @change="changeFileMark($event, index)"
              ></v-autocomplete>
            </v-flex>
            <v-flex style="width: 130px;" class="layout wrap" v-if="checkInput === 1">
              <v-select
                :items="fileCheckItems"
                item-text="text"
                item-value="value"
                v-model="dossierTemplateItemsFilter[index].fileCheck"
                @change="changeFileCheck($event, index)"
              ></v-select>
            </v-flex>
            <v-flex :style="{width: '40px', 'align-items': 'center', 'margin-left': '10px', 'margin-top': thongTinHoSo.online ? '10px' : '0px'}" class="layout wrap" v-else-if="item.fileCheck > 0">
              <v-tooltip top v-if="item.fileCheck === 1">
                <v-icon slot="activator" size="24" class="mx-0" color="primary">done</v-icon>
                <span>Đạt</span>
              </v-tooltip>
              <v-tooltip top v-else-if="item.fileCheck === 2">
                <v-icon slot="activator" size="24" class="mx-0" color="primary">close</v-icon>
                <span>Không đạt</span>
              </v-tooltip>
            </v-flex>
            <v-flex :style="{width: !onlyView ? '120px' : 'auto'}" :class="{'text-xs-right' : onlyView}" v-if="checkInput !== 1">
              <input v-if="item['multiple']"
              type="file"
              multiple
              style="display: none"
              :id="'file' + item.partNo"
              @change="onUploadSingleFile($event, item, index)"
              >
              <input v-else
              type="file"
              style="display: none"
              :id="'file' + item.partNo"
              @change="onUploadSingleFile($event, item, index)"
              >
              <v-tooltip top v-if="item.partType === 3 && originality === 3 && !onlyView">
                <v-btn slot="activator" @click="addFileOther(item)" icon class="mx-0 my-0">
                  <v-icon size="16" class="mx-0" color="primary">add</v-icon>
                </v-btn>
                <span>Thêm giấy tờ khác</span>
              </v-tooltip>
              <v-progress-circular
              :width="2"
              :size="25"
              color="green"
              indeterminate
              v-if="progressUploadPart === item.partNo"
              ></v-progress-circular>

              <v-tooltip top v-if="progressUploadPart !== item.partNo && !onlyView & item.hasForm">
                <v-btn slot="activator" icon class="mx-0 my-0" @click.stop="loadAlpcaFormClick(item)">
                  <v-badge>
                    <v-icon size="24" color="#004b94">edit</v-icon>
                  </v-badge>
                </v-btn>
                <span>Khai trực tuyến</span>
              </v-tooltip>
              <v-tooltip top v-if="progressUploadPart !== item.partNo && onlyView & item.hasForm">
                <v-btn slot="activator" class="mx-1 my-0" fab dark small color="primary" @click="loadAlpcaFormClick(item)" style="height:25px;width:25px">
                  <v-icon style="font-size: 14px;">visibility</v-icon>
                </v-btn>
                <span>Xem</span>
              </v-tooltip>

              <v-tooltip left v-if="progressUploadPart !== item.partNo && !onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile(item)">
                  <v-badge>
                    <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                  </v-badge>
                </v-btn>
                <span v-if="!item.partTip['extensions'] && !item.partTip['maxSize']">Tải giấy tờ lên</span>
                <span v-else>Tải giấy tờ lên (Chấp nhận tải lên các định dạng: {{item.partTip['extensions']}}. Tối đa {{item.partTip['maxSize']}} MB)</span>
              </v-tooltip>
              <v-tooltip top v-if="partNoApplicantHasFile(item.partNo) && !onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="showFilesApplicant(item.partNo)">
                  <v-badge>
                    <v-icon size="24" color="orange darken-3">folder</v-icon>
                  </v-badge>
                </v-btn>
                <span>Giấy tờ đã nộp</span>
              </v-tooltip>

              <!-- <v-tooltip left v-if="progressUploadPart !== item.partNo && !onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile(item)">
                  <v-badge>
                    <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                  </v-badge>
                </v-btn>
                <span v-if="!item.partTip['extensions'] && !item.partTip['maxSize']">Tải giấy tờ từ máy</span>
                <span v-else>Tải giấy tờ từ máy (Chấp nhận tải lên các định dạng: {{item.partTip['extensions']}}. Tối đa {{item.partTip['maxSize']}} MB)</span>
              </v-tooltip>
              <v-tooltip class="pl-1 pt-1" top v-if="!onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="showDocumentApplicant(item, index)">
                  <v-badge>
                    <v-icon size="20" color="orange darken-3">fas fa fa-folder-open</v-icon>
                  </v-badge>
                </v-btn>
                <span>Tải giấy tờ từ kho</span>
              </v-tooltip> -->


            </v-flex>
          </v-layout>
        </div>
      </div>
      <div v-if="!partTypes.includes(2) && originality === 3 && !partTypes.includes(6) && !partTypes.includes(7)">
        <v-card flat>
          <v-card-text flat class="py-0 px-3 pl-4">
            <v-form v-model="valid_ghichu" ref="formGhiChuThanhPhan" lazy-validation>
              <div v-if="!onlyView" class="my-2">
                  <v-textarea class="py-0"
                  box
                  v-model="applicantNoteDossier"
                  rows="3"
                  :rules="[rules.varchar5000]"
                  @input="changeApplicantNote"
                  label="Ghi chú"
                  ></v-textarea>
              </div>
              <v-text-field class="my-2"
                v-if="onlyView && applicantNoteDossier"
                v-model="applicantNoteDossier"
                label="Ghi chú"
                readonly
                box
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
      <v-dialog v-model="dialogAddOtherTemp" max-width="400" transition="fade-transition" persistent>
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Tên giấy tờ</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click.native="cancelDialog">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text class="pb-0 pt-4">
              <v-layout wrap>
                <v-flex xs12 class="px-2 pb-3 fix__label">
                  <v-text-field
                  label="Tên giấy tờ:"
                  v-model="otherDossierTemplate"
                  :rules="[v => !!v || 'Bạn phải điền tên giấy tờ.']"
                  required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-3" flat="flat" @click.native="cancelDialog" :loading="loadingAddOther">
                Quay lại
                <span slot="loader">Loading...</span>
              </v-btn>
              <v-btn color="primary" flat="flat" @click.native="addOtherTemplate" :loading="loadingAddOther">
                Đồng ý
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-card>
    <!-- <div class="absolute-lable" style="font-size: 12px" v-if="originality !== 1 && !onlyView">
      <span>Không chọn</span>
      <span>Bản chính</span>
      <span>Bản chụp</span>
      <span>Công chứng</span>
    </div> -->
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <span v-if="pdfEform">Bản in đã khai trực tuyến</span>
            <span v-else>Tài liệu đính kèm</span>
          </v-toolbar-title>
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
        <iframe v-show="!dialogPDFLoading" :id="'dialogPDFPreview' + id" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_documentApplicant" scrollable persistent max-width="1300px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Kho tài liệu công dân, tổ chức, doanh nghiệp</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialog_documentApplicant = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <kho-tai-lieu ref="khotailieu" :index="applicantId" v-on:trigger-attach="attachFileFromStorage"></kho-tai-lieu>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import toastr from 'toastr'
import KhoTaiLieu from '../TiepNhan/KhoTaiLieu'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: {
    onlyView: {
      type: Boolean,
      default: () => false
    },
    id: {
      type: String,
      default: () => 'nm'
    },
    partTypes: {
      type: Array,
      default: () => [1, 3]
    },
    checkInput: {
      type: Number,
      default: () => 0
    },
    formCodeInput: {
      type: String,
      default: () => ''
    },
    tempLienThong: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    'kho-tai-lieu': KhoTaiLieu,
  },
  data: () => ({
    valid_ghichu: false,
    dossierTemplateItems: [],
    dossierMarksItems: [],
    dossierFilesItems: [],
    thongTinHoSo: {},
    valid: true,
    stateView: false,
    dialogAddOtherTemp: false,
    loadingAddOther: false,
    loadingApacal: false,
    otherDossierTemplate: '',
    sheet: false,
    partView: '',
    dossierFileIdView: '',
    stateEdit: false,
    progressUploadPart: '',
    dialogPDF: false,
    dialogPDFLoading: true,
    stateAddFileOther: false,
    dossierTemplatesItemSelect: {},
    fileViews: [],
    pdfEform: false,
    sampleCount: 0,
    serviceInfoId: 0,
    fileMarkItems: [
      {
        text: 'Không có',
        value: 0
      }, {
        text: 'Bản chụp',
        value: 1
      }, {
        text: 'Bản sao',
        value: 2
      }, {
        text: 'Bản gốc',
        value: 3
      }, {
        text: 'Bản dịch',
        value: 4
      }
    ],
    markCheck: '',
    fileCheckItems: [{
      text: 'Chưa kiểm tra',
      value: 0
    }, {
      text: 'Đạt',
      value: 1
    }, {
      text: 'Không đạt',
      value: 2
    }],
    fileTemplateItems: [],
    fileTemplateNoString: '',
    dossierFilesApplicant: [],
    stateViewResult: true,
    currentFormView: '',
    pstFixed: 0,
    pstEl: 0,
    endEl: 0,
    applicantNoteDossier: '',
    doChange: {},
    dossierTemplateLienThong: [],
    receiveMessage: '',
    dialog_documentApplicant: false,
    dossierPartAttach: '',
    indexPart: '',
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      cmndHoChieu: (value) => {
        const pattern = /^(?![0-9]{4,12})[0-9a-zA-Z]{4,12}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 4-12 ký tự'
      },
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
      varchar50: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
        } else {
          return true
        }  
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
  created () {
    let vm = this
    vm.receiveMessage = function (event) {
      vm.saveAlpacaFormCallBack(event)
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      let vm = this
      return vm.getOriginality()
    },
    initDataResource () {
      return this.$store.getters.loadingInitData
    },
    dossierTemplateItemsFilter () {
      let vm = this
      let dossierTemplate = vm.dossierTemplateItems
      if (dossierTemplate.length > 0) {
        let filter1 = dossierTemplate.filter(function (item) {
          return vm.partTypes.includes(item.partType) && vm.checkVisibleTemp(item, 0)
        })
        // check
        let filterCheckInput = filter1
        if (String(vm.checkInput) === '1') {
          filterCheckInput = filter1.filter(function (item) {
            return item['fileMark'] !== 0
          })
        }
        console.log('filter1', filter1)
        console.log('partTypes', vm.partTypes)
        console.log('dossierTemplate', dossierTemplate)
        console.log('dossierTemplateItemsFilter111', filterCheckInput)
        return filterCheckInput
      }
    },
    applicantBussinessExit () {
      return this.$store.getters.getApplicantBussinessExit
    },
    applicantId () {
      return this.$store.getters.getApplicantIdNo
    },
    applicantNote () {
      return this.$store.getters.getApplicantNote
    },
    userLoginInfomation () {
      return this.$store.getters.getUserLogin
    },
  },
  mounted () {
    var vm = this
    vm.page = 1
    vm.$nextTick(function () {
    })
  },
  watch: {
    applicantBussinessExit (val) {
      let vm = this
      if (val && vm.fileTemplateNoString) {
        vm.getDossierFileApplicants(val, vm.fileTemplateNoString)
      }
    },
    applicantId (val) {
      let vm = this
      if (val && vm.fileTemplateNoString) {
        vm.getDossierFileApplicants(val, vm.fileTemplateNoString)
      }
    },
    dossierTemplateItemsFilter () {
      let vm = this
      for (let key in vm.dossierTemplateItemsFilter) {
        vm.doChange[key] = ''
      }
      console.log('dossierTemplateItemsFilter222', vm.dossierTemplateItemsFilter)
    }
  },
  methods: {
    showValid () {
      var vm = this
      let result = {
        validForm: vm.$refs.formGhiChuThanhPhan.validate(),
      }
      return result
    },
    markAll () {
      let vm = this
      if (vm.dossierTemplateItemsFilter && vm.markCheck !== '') {
        vm.dossierTemplateItemsFilter.forEach(function (value, index) {
          if (value.partType === 1 && value.fileMark && !value.recordCountDefault) {
            value['dossierId'] = vm.thongTinHoSo.dossierId
            value['fileCheck'] = vm.markCheck
            value['fileComment'] = ''
            value['checkInput'] = vm.checkInput
            vm.$store.dispatch('postDossierMark', value)
          }
        })
      }
    },
    resetCounterTemplate ({commit, state}, data) {
      var vm = this
      vm.dossierTemplateItems.forEach(val => {
        if (val.partNo === data.partNo) {
          if (val.hasForm) {
            val.count = 1
          } else {
            val.count = 0
          }
        }
      })
    },
    recountFileTemplates () {
      var vm = this
      vm.dossierTemplateItems.forEach(itemTemplate => {
        itemTemplate.count = 0
        vm.dossierFilesItems.forEach(itemFile => {
          if (itemTemplate.partNo === itemFile.dossierPartNo && !itemFile.eForm) {
            itemTemplate.count ++
          }
        })
      })
    },
    initData (data) {
      var vm = this
      vm.$store.dispatch('getDocumentType').then(function (result) {
        let sortItems = function (items) {
          function compare(a, b) {
            if (a.itemCode < b.itemCode)
              return -1
            if (a.itemCode > b.itemCode)
              return 1
            return 0
          }
          return items.sort(compare)
        }
        if (result) {
          let items = sortItems(result)
          vm.fileMarkItems = []
          for (let key in items) {
            vm.fileMarkItems.push({
              text: items[key]['itemName'],
              value: items[key]['itemCode']
            })
          }
        }
      })
      vm.thongTinHoSo = data
      vm.applicantNoteDossier = data['applicantNote'] && String(data['applicantNote']).indexOf('<br>[') < 0 ? data['applicantNote'] : ''
      var arrTemp = []
      if (data['sampleCount'] !== null && data['sampleCount'] !== undefined && data['sampleCount'] !== 'undefined') {
        vm.sampleCount = data['sampleCount']
      }
      arrTemp.push(vm.$store.dispatch('loadDossierTemplates', data))
      arrTemp.push(vm.$store.dispatch('loadDossierMark', data))
      arrTemp.push(vm.$store.dispatch('loadDossierFiles', data.dossierId))
      arrTemp.push(vm.$store.dispatch('getServiceInfo', {
        serviceInfoId: data.serviceCode
      }))
      Promise.all(arrTemp).then(values => {
        var dossierTemplates = values[0]['dossierParts']
        var dossierMarks = values[1]
        console.log('dossierMarksdossierMarksdossierMarksdossierMarks',dossierMarks)
        var dossierFiles = values[2]
        var fileTemplates = []
        if (values[3].hasOwnProperty('serviceInfoId')) {
          vm.serviceInfoId = values[3].serviceInfoId
        }
        if (values[3].fileTemplates) {
          if (Array.isArray(values[3].fileTemplates)) {
            fileTemplates = values[3].fileTemplates
          } else {
            fileTemplates.push(values[3].fileTemplates)
          }
        }
        var dossierTemplateItems = vm.mergeDossierTemplateVsDossierFiles(dossierTemplates, dossierFiles)
        dossierTemplateItems = vm.mergeDossierTemplateVsDossierMark(dossierTemplateItems, dossierMarks)
        dossierTemplateItems = vm.mergeDossierTemplateVsFileTemplates(dossierTemplateItems, fileTemplates)
        vm.dossierFilesItems = dossierFiles
        vm.dossierMarksItems = dossierMarks
        vm.fileTemplateItems = fileTemplates
        vm.dossierTemplateItems = dossierTemplateItems
        console.log('dossierTemplateItems555', vm.dossierTemplateItems)
        // 
        vm.saveMark()
        // console.log('vm.dossierTemplateItems', vm.dossierTemplateItems)
        if ((vm.partTypes.includes(2) || vm.partTypes.includes(7)) && vm.dossierTemplateItems.length > 0 && !vm.tempLienThong) {
          let dossierTemplateKQ = []
          vm.dossierTemplateItems.forEach(item => {
            let hasKQ = vm.dossierFilesItems.find(file => {
              return (item.partNo === file.dossierPartNo && (item.partType === 2 || item.partType === 7))
            })
            if (hasKQ) {
              dossierTemplateKQ.push(item)
            }
          })
          vm.dossierTemplateItems = dossierTemplateKQ
        }
        vm.changeStateViewResult()
        setTimeout(function (argument) {
          vm.genAllAlpacaForm(dossierFiles, dossierTemplateItems)
          vm.recountFileTemplates()
        }, 500)
        let fileTemplateNoArr = []
        vm.dossierTemplateLienThong = []
        for (let key in vm.dossierTemplateItems) {
          if (vm.dossierTemplateItems[key]['fileTemplateNo']) {
            fileTemplateNoArr.push(vm.dossierTemplateItems[key]['fileTemplateNo'])
          }
          // 
          if (vm.tempLienThong && vm.dossierTemplateItems[key]['hasTemplateLienThong']) {
            vm.dossierTemplateLienThong.push(vm.dossierTemplateItems[key]['partNo'])
          }
        }
        vm.$store.commit('setDossierTemplateLienThong', vm.dossierTemplateLienThong)
        if (fileTemplateNoArr.length > 0) {
          vm.fileTemplateNoString = fileTemplateNoArr.toString()
          if (vm.applicantId && !vm.onlyView) {
            vm.getDossierFileApplicants(vm.applicantId, vm.fileTemplateNoString)
          }
        }
      }).catch(reject => {
      })
      console.log('onlyView,checkInput', vm.onlyView, vm.checkInput, vm.progressUploadPart)
    },
    genAllAlpacaForm (dossierFiles, dossierTemplateItems) {
      var vm = this
      if (dossierFiles.length > 0 && dossierFiles.filter(file => {
          return file.eForm && file.size
        }).length > 0
      ) {
        var dossierFilesEform = dossierFiles.filter(file => {
          return file.eForm
        })
        var dossierTemplatesHasForm = dossierTemplateItems.filter(template => {
          return template.hasForm && vm.partTypes.includes(template.partType)
        })
        if (dossierFilesEform.length > 0) {
          // dossierFilesEform.forEach(itemFiles => {
          //   if (itemFiles.eForm) {
          //     vm.$store.dispatch('loadAlpcaForm', itemFiles)
          //   }
          // })
        } else {
          dossierTemplateItems.forEach(val => {
            if (val.hasForm && vm.partTypes.includes(val.partType)) {
              val['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
              vm.showAlpacaJSFORM(val)
            }
          })
        }
        if (dossierTemplatesHasForm.length !== dossierFilesEform.length) {
          dossierTemplatesHasForm.forEach(template => {
            let indexFromFile = dossierFilesEform.findIndex(item => {
              return template.partNo === item.dossierPartNo
            })
            if (indexFromFile === -1) {
              template['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
              vm.showAlpacaJSFORM(template)
            }
          })
        }
      } else {
        dossierTemplateItems.forEach(val => {
          if (val.hasForm && vm.partTypes.includes(val.partType)) {
            val['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
            vm.showAlpacaJSFORM(val)
          }
        })
      }
    },
    postDossierMark (item, index) {
      var vm = this
      item['dossierId'] = vm.thongTinHoSo.dossierId
      vm.$store.dispatch('postDossierMark', item).then(resultMark => {
      }).catch(reject => {
      })
      //   dossierTemplates.forEach(function (val, index) {
        //     if (val.partType === 1) {
        //       val['dossierId'] = vm.dossierId
        //       listDossierMark.push(vm.$store.dispatch('postDossierMark', val))
        //     }
        //   })
    },
    mergeDossierTemplateVsDossierFiles (dossierTemplates, dossierFiles) {
      var vm = this
      if (dossierFiles.length !== 0) {
        dossierTemplates.forEach(template => {
          template['editForm'] = true
          template['daKhai'] = false
          template['passRequired'] = false
          var itemFind = dossierFiles.find(file => {
            return template.partNo === file.dossierPartNo && vm.partTypes.includes(template.partType) && file.eForm && !file.removed && file.fileSize !== 0
          })
          if (itemFind) {
            template['daKhai'] = true
            template['hasForm'] = true
            template['referenceUid'] = itemFind['referenceUid']
          }
          dossierFiles.forEach(dossierFile => {
            if (template.partNo === dossierFile.dossierPartNo) {
              template['passRequired'] = true
            }
          })
        })
      } else {
        dossierTemplates.forEach(template => {
          if (template.hasForm) {
            template['daKhai'] = false
            template['passRequired'] = false
            template['editForm'] = true
          }
        })
      }
      return dossierTemplates
    },
    mergeDossierTemplateVsDossierMark (dossierTemplates, dossierMarks) {
      let vm = this
      if (dossierMarks.length !== 0) {
        dossierTemplates.map(itemTemplate => {
          itemTemplate['count'] = 0
          itemTemplate['stateEditFileCheck'] = false
          let fileMarkFind = dossierMarks.find(fileMark => {
            return fileMark.dossierPartNo === itemTemplate.partNo
          })
          if (fileMarkFind !== null && fileMarkFind !== undefined) {
            itemTemplate['fileMark'] = fileMarkFind.fileMark
            itemTemplate['fileComment'] = fileMarkFind.fileComment
            itemTemplate['fileCheck'] = fileMarkFind.fileCheck
            itemTemplate['recordCount'] = fileMarkFind.recordCount
            itemTemplate['fileMarkDefault'] = fileMarkFind.fileMark
            itemTemplate['hasTemplate'] = String(fileMarkFind.fileMark) !== '0'
            if (itemTemplate['hasTemplate'] && !itemTemplate['recordCount']) {
              itemTemplate['recordCount'] = 1
            } else if (!itemTemplate['hasTemplate']) {
              itemTemplate['recordCount'] = 0
            }
            itemTemplate['hasTemplateLienThong'] = itemTemplate['hasTemplate']
          } else {
            itemTemplate['fileMark'] = 0
            itemTemplate['fileComment'] = ''
            itemTemplate['fileCheck'] = 0
            itemTemplate['recordCount'] = 0
            itemTemplate['hasTemplate'] = false
            itemTemplate['hasTemplateLienThong'] = itemTemplate['hasTemplate']
          }
          return itemTemplate
        })
      } else {
        if (dossierTemplates) {
          dossierTemplates.forEach(itemTemplate => {
            itemTemplate['stateEditFileCheck'] = false
            itemTemplate['count'] = 0
            itemTemplate['fileMark'] = 0
            itemTemplate['fileComment'] = ''
            itemTemplate['fileCheck'] = 0
            itemTemplate['stateEditFileCheck'] = false
          })
        }
      }
      return dossierTemplates
    },
    mergeDossierTemplateVsFileTemplates (dossierTemplates, fileTemplates) {
      if (fileTemplates.length !== 0) {
        dossierTemplates.map(itemTemplate => {
          let fileTemp = fileTemplates.find(fileTemplate => {
            return fileTemplate.fileTemplateNo === itemTemplate.fileTemplateNo
          })
          if (fileTemp !== null && fileTemp !== undefined) {
            itemTemplate['hasFileTemp'] = fileTemp.fileTemplateNo
          } else {
            itemTemplate['hasFileTemp'] = ''
          }
          return itemTemplate
        })
      } else {
        if (dossierTemplates) {
          dossierTemplates.forEach(itemTemplate => {
            itemTemplate['hasFileTemp'] = ''
          })
        }
      }
      return dossierTemplates
    },
    showAlpacaJSFORM (item, isPending) {
      console.log('showAlpacaJSFORM', item)
      let vm = this
      item['dossierId'] = vm.thongTinHoSo.dossierId
      item['editForm'] = true
      vm.$store.dispatch('loadFormScript', item).then(resScript => {
        /* eslint-disable */
        let eformScript = ''
        try {
          eformScript = eval('(' + resScript + ')')
        } catch (error) {
        }
        /* eslint-disable */
        if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
          // console.log('eformEmbed', eformScript)
          item.embed = true
          let userId = window.themeDisplay.getUserId()
          let userEmail = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
          let referenceUid = vm.thongTinHoSo.referenceUid
          let dossierStatus = vm.thongTinHoSo.dossierStatus
          let dossierSubStatus = vm.thongTinHoSo.dossierSubStatus
          let templateNo = item.partNo
          let deliverableType = item.deliverableType ? item.deliverableType : ''
          let token = localStorage.getItem('jwt_token')

          let urlEmbed = eformScript.eformEmbed + '/' + item.fileTemplateNo + '/referenceUid/' +  referenceUid + '/' + token + '/' + encodeURIComponent(document.location.origin) +'?userId=' + userId + '&userEmail=' + userEmail + '&code=' + referenceUid + '&dossierStatus=' + dossierStatus + '&dossierSubStatus=' + dossierSubStatus + '&tp=' + templateNo
          setTimeout(function () {
            console.log('urlEmbed123123123', urlEmbed)
            document.getElementById('formAlpaca' + item.partNo + vm.id).src = ''
            setTimeout(function () {
              document.getElementById('formAlpaca' + item.partNo + vm.id).src = urlEmbed
            }, 50)
          }, 300)
        } else {
          item.embed = false
          vm.$store.dispatch('loadFormData', item).then(resData => {
            if (isPending) {
              resData = item.formData
            }
            window.$('div[id="formAlpaca' + item.partNo + vm.id + '"]').empty()
            let formScript, formData
            /* eslint-disable */
            if (resScript) {
              formScript = eval('(' + resScript + ')')
            } else {
              formScript = {}
            }
            if (resData) {
              formData = eval('(' + resData + ')')
              item['loaded'] = true
            } else {
              formData = {}
            }
            // option 
            formData.templateNo_hidden = item.partNo
            formData.dossierId_hidden = vm.thongTinHoSo.dossierId
            formData.dossierStatus_hidden = vm.thongTinHoSo.dossierStatus
            formData.dossierSubStatus_hidden = vm.thongTinHoSo.dossierSubStatus
            formData.fileTemplateNo_hidden = item.fileTemplateNo
            formData.deliverableType_hidden = item.deliverableType ? item.deliverableType : ''
            formData.userEmailAddress_hidden = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
            formData.referenceUid = vm.thongTinHoSo.referenceUid
            // 
            console.log('data_input postMessage', formScript)
            /* eslint-disable */
            formScript.data = formData
            window.$('div[id="formAlpaca' + item.partNo + vm.id + '"]').alpaca(formScript)
          })
        }
        
      })
    },
    saveAlpacaForm (item, index) {
      var vm = this
      var fileFind = vm.dossierFilesItems.find(itemFile => {
        // return itemFile.dossierPartNo === item.partNo && itemFile.eForm && itemFile.fileSize!==0
        return itemFile.dossierPartNo === item.partNo && itemFile.eForm
      })
      if (fileFind) {
        fileFind['dossierId'] = vm.thongTinHoSo.dossierId
        fileFind['id'] = vm.id
        vm.loadingApacal = true
        vm.$store.dispatch('putAlpacaForm', fileFind).then(resData => {
          setTimeout(function () {
            vm.loadingApacal = false
            toastr.clear()
            toastr.success('Thực hiện thành công')
          }, 3000)
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
            vm.dossierFilesItems = resFiles
          }).catch(reject => {
          })
          vm.dossierTemplateItemsFilter[index]['passRequired'] = true
        }).catch(reject => {
          vm.loadingApacal = false
        })
      } else {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        item['id'] = vm.id
        vm.loadingApacal = true
        vm.$store.dispatch('postEform', item).then(resPostEform => {
          console.log('resole', resPostEform)
          setTimeout(function () {
            vm.loadingApacal = false
            toastr.clear()
            toastr.success('Thực hiện thành công')
            vm.dossierTemplateItemsFilter[index].daKhai = true
          }, 3000)
          vm.dossierTemplateItemsFilter[index]['passRequired'] = true
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
            vm.dossierFilesItems = resFiles
          }).catch(reject => {
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
        }).catch(reject => {
          vm.loadingApacal = false
        })
      }
    },
    saveAlpacaFormCallBack (data) {
      let vm = this
      let dataOutPut = data.data ? data.data : ''
      console.log('data_output new_eform_2', dataOutPut)
      if (dataOutPut.hasOwnProperty('tp') && dataOutPut.tp) {
        let fileFind = vm.dossierFilesItems.find(itemFile => {
          // return itemFile.dossierPartNo === dataOutPut.tp && itemFile.eForm && itemFile.fileSize!==0
          return itemFile.dossierPartNo === dataOutPut.tp && itemFile.eForm
        })
        if (fileFind) {
          fileFind['dossierId'] = vm.thongTinHoSo.dossierId
          fileFind['id'] = vm.id
          vm.loadingApacal = true
          console.log('item put', fileFind)
          vm.$store.dispatch('putAlpacaFormCallBack', fileFind).then(resData => {
            let index = vm.dossierTemplateItemsFilter.findIndex(item => item.partNo === dataOutPut.tp);
            vm.dossierTemplateItemsFilter[index]['passRequired'] = true
            setTimeout(function () {
              vm.loadingApacal = false
              toastr.clear()
              toastr.success('Thực hiện thành công')
              // gen lại sau cập nhật
              vm.dossierTemplateItemsFilter[index].daKhai = true
              vm.showAlpacaJSFORM(vm.dossierTemplateItemsFilter[index])
            }, 3000)
            vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
              vm.dossierFilesItems = resFiles
            }).catch(reject => {
            })
            
          }).catch(reject => {
            vm.loadingApacal = false
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại')
          })
        } else {
          dataOutPut['dossierId'] = vm.thongTinHoSo.dossierId
          dataOutPut['id'] = vm.id
          vm.loadingApacal = true
          console.log('item post', dataOutPut)
          vm.$store.dispatch('postEformCallBack', dataOutPut).then(resPostEform => {
            let index = vm.dossierTemplateItemsFilter.findIndex(item => item.partNo === dataOutPut.tp)
            setTimeout(function () {
              vm.loadingApacal = false
              toastr.clear()
              toastr.success('Thực hiện thành công')
              vm.dossierTemplateItemsFilter[index].daKhai = true
              // gen lại sau cập nhật
              console.log('dossierTemplateItemsFilter-1', vm.dossierTemplateItemsFilter[index])
              vm.showAlpacaJSFORM(vm.dossierTemplateItemsFilter[index])
            }, 3000)
            vm.dossierTemplateItemsFilter[index]['passRequired'] = true
            vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
              vm.dossierFilesItems = resFiles
            }).catch(reject => {
            })
          }).catch(reject => {
            vm.loadingApacal = false
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
        }
      }
    },
    onDeleteAttackFiles (item) {
      var vm = this
      console.log('delete')
      let x = confirm('Bạn có muốn xóa toàn bộ file trong thành phần hồ sơ này?')
      if (x) {
        vm.dossierTemplateItemsFilter.forEach(val => {
          if (val.dossierPartNo === item.partNo) {
            val['dossierId'] = vm.thongTinHoSo.dossierId
            vm.$store.dispatch('deleteAttackFiles', val).then(function (result) {
              vm.resetCounterTemplate(item)
              vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId)
            }).catch(function (xhr) {
            })
          }
        })
      }
    },
    changeApplicantNote () {
      let vm = this
      console.log('applicantNoteEdit', vm.applicantNoteDossier)
      vm.$store.commit('setApplicantNote', vm.applicantNoteDossier)
    },
    pickFile (item) {
      var vm = this
      vm.stateAddFileOther = false
      document.getElementById('file' + item.partNo).value = ''
      document.getElementById('file' + item.partNo).click()
    },
    onUploadSingleFile (e, data, index) {
      var vm = this
      vm.dossierTemplatesItemSelect = data
      vm.progressUploadPart = data.partNo
      data['dossierId'] = vm.thongTinHoSo.dossierId
      data['dossierTemplateNo'] = vm.thongTinHoSo.dossierTemplateNo
      if (data.partType !== 3) {
        vm.$store.dispatch('uploadSingleFile', data).then(function (result) {
          vm.dossierTemplateItemsFilter[index]['passRequired'] = true
          vm.progressUploadPart = ''
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
          })
        }).catch(function (data) {
          if (data.length > 0) {
            vm.dossierTemplateItemsFilter[index]['passRequired'] = true
          }
          vm.progressUploadPart = ''
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
          })
        })
      } else {
        if (window.$('input[id="file' + data.partNo + '"]')[0].files.length === 0) {
          vm.progressUploadPart = ''
          return
        }
        vm.partView = data.partNo
        vm.stateView = true
        vm.dialogAddOtherTemp = true
      }
    },
    loadAlpcaForm (data) {
      let vm = this
      //
      let fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === data.partNo && itemFile.eForm
      })
      if (fileFind) {
        fileFind['id'] = vm.id
        vm.$store.dispatch('loadAlpcaForm', fileFind)
      } else {
        vm.dossierTemplateItemsFilter.forEach(val => {
          if (val.hasForm && data.partNo === val.partNo) {
            val['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
            vm.showAlpacaJSFORM(val)
          }
        })
      }
    },
    loadAlpcaFormClick (data) {
      let vm = this
      window.removeEventListener('message', vm.receiveMessage)
      window.addEventListener('message', vm.receiveMessage)
      //
      if (vm.currentFormView === 'formAlpaca' + data.partNo + vm.id) {
        vm.currentFormView = ''
      } else {
        vm.currentFormView = 'formAlpaca' + data.partNo + vm.id
      }
      vm.pstEl = vm.endEl = 0
      setTimeout(function () {
        if (window.$('div[id="formAlpaca' + data.partNo + vm.id + '"]').height() > 200) {
          vm.pstEl = window.$('div[id="wrapForm' + data.partNo + vm.id + '"]').offset().top
          vm.endEl = window.$('div[id="formAlpaca' + data.partNo + vm.id + '"]').height()
          $(window).scroll(function () {
            vm.pstFixed = $(window).scrollTop()
          })
        }
      }, 500)
      //
      let fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === data.partNo && itemFile.eForm
      })
      if (fileFind) {
        console.log('fileFind', fileFind)
        if (fileFind.fileSize) {
          fileFind['id'] = vm.id
          // vm.$store.dispatch('loadAlpcaForm', fileFind)
          // preview PDF
          data['editForm'] = false
          vm.$store.dispatch('viewFile', fileFind).then(result => {
            document.getElementById('displayPDF' + fileFind.dossierPartNo + vm.id).src = result
          })
        } else {
          data['editForm'] = false
          data.formData = fileFind.formData
          data['editForm'] = true
          data['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
          vm.showAlpacaJSFORM(data, true)
        }
        
      } else {
        vm.dossierTemplateItemsFilter.forEach(val => {
          if (val.hasForm && data.partNo === val.partNo) {
            val['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
            // if (!val['loaded']) {
              vm.showAlpacaJSFORM(val)
            // }
          }
        })
      }
    },
    editFormAlpaca (item) {
      let vm = this
      item['editForm'] = true
      /* eslint-disable */
      let fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === item.partNo && itemFile.eForm
      })
      let eformScript = eval('(' + fileFind.formScript + ')')
      console.log('eformScript', eformScript)
      /* eslint-disable */
      if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
        // console.log('eformEmbed', eformScript)
        item.embed = true
        let userId = window.themeDisplay.getUserId()
        let userEmail = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
        let referenceUid = vm.thongTinHoSo.referenceUid
        let dossierStatus = vm.thongTinHoSo.dossierStatus
        let dossierSubStatus = vm.thongTinHoSo.dossierSubStatus
        let templateNo = item.partNo
        let deliverableType = item.deliverableType ? item.deliverableType : ''

        let token = localStorage.getItem('jwt_token')

        let urlEmbed = eformScript.eformEmbed + '/' + item.fileTemplateNo + '/referenceUid/' +  referenceUid + '/' + token + '/' + encodeURIComponent(document.location.origin) +'?userId=' + userId + '&userEmail=' + userEmail + '&code=' + referenceUid + '&dossierStatus=' + dossierStatus + '&dossierSubStatus=' + dossierSubStatus + '&tp=' + templateNo
        // console.log('urlEmbed', urlEmbed)
        setTimeout(function () {
          document.getElementById('formAlpaca' + item.partNo + vm.id).src = urlEmbed
        }, 300)
      } else {
        item.embed = false
        setTimeout (function () {
          let fileFind = vm.dossierFilesItems.find(itemFile => {
            return itemFile.dossierPartNo === item.partNo && itemFile.eForm
          })
          fileFind['id'] = vm.id
          vm.$store.dispatch('loadAlpcaForm', fileFind)
        }, 200)
      }
      
    },
    deleteSingleFileEform (item, index) {
      var vm = this
      let x = confirm('Bạn có chắc chắn xóa file?')
      if (x) {
        vm.dossierFilesItems.forEach(file => {
          if (file.dossierPartNo === item.partNo && file.eForm) {
            file['dossierId'] = vm.thongTinHoSo.dossierId
            vm.$store.dispatch('deleteDossierFile', file).then(resFile => {
              vm.dossierTemplateItemsFilter[index].daKhai = false
              vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
                vm.dossierFilesItems = result
                vm.recountFileTemplates()
                // 
                item['editForm'] = true
                setTimeout(function () {
                  vm.loadAlpcaForm(item)
                }, 200)
                // 
                if (vm.dossierFilesItems.length !== 0) {
                  var fileViewsTemp = vm.dossierFilesItems.filter(file => {
                    return file.dossierPartNo === item.partNo
                  })
                  if (fileViewsTemp) {
                    vm.dossierTemplateItemsFilter[index]['passRequired'] = true
                  } else {
                    vm.dossierTemplateItemsFilter[index]['passRequired'] = false
                  }
                } else {
                  vm.dossierTemplateItemsFilter[index]['passRequired'] = false
                }
              })
            })
          }
        })
      }
    },
    previewFileEfom (item, index) {
      var vm = this
      vm.dossierFilesItems.forEach(file => {
        if (file.dossierPartNo === item.partNo && file.eForm && !file.removed) {
          file['dossierId'] = vm.thongTinHoSo.dossierId
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
          if (!vm.onlyView) {
            file['id'] = vm.id
            vm.$store.dispatch('putAlpacaForm', file).then(resData => {
              setTimeout(function () {
                vm.$store.dispatch('viewFile', file).then(result => {
                  vm.dialogPDFLoading = false
                  document.getElementById('dialogPDFPreview' + vm.id).src = result
                })
              }, 1000)
            }).catch(reject => {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          } else {
            vm.$store.dispatch('viewFile', file).then(result => {
              vm.dialogPDFLoading = false
              if (file['eForm']) {
                vm.pdfEform = true
              } else {
                vm.pdfEform = false
              }
              document.getElementById('dialogPDFPreview' + vm.id).src = result
            })
          }
        }
      })
    },
    previewFormAlpaca (item, index) {
      let vm = this
      vm.dossierFilesItems.forEach(file => {
        if (file.dossierPartNo === item.partNo && file.eForm && !file.removed) {
          file['dossierId'] = vm.thongTinHoSo.dossierId
          if (!vm.onlyView) {
            //
            let eformScript = eval('(' + file.formScript + ')')
            // console.log('eformScript preview', eformScript)
            if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
              item['editForm'] = false
              setTimeout(function () {
                vm.$store.dispatch('viewFile', file).then(result => {
                  document.getElementById('displayPDF' + file.dossierPartNo + vm.id).src = result
                })
              }, 500)
            } else {
              //
              file['id'] = vm.id
              vm.$store.dispatch('putAlpacaForm', file).then(resData => {
                item['editForm'] = false
                setTimeout(function () {
                  vm.$store.dispatch('viewFile', file).then(result => {
                    document.getElementById('displayPDF' + file.dossierPartNo + vm.id).src = result
                  })
                }, 500)          
              }).catch(reject => {
                toastr.clear()
                toastr.error('Yêu cầu của bạn thực hiện thất bại.')
              })
            }
            
          } else {
            item['editForm'] = false
            vm.$store.dispatch('viewFile', file).then(result => {
              if (file['eForm']) {
                vm.pdfEform = true
              } else {
                vm.pdfEform = false
              }
              document.getElementById('displayPDF' + item.dossierPartNo + vm.id).src = result
            })
          }
        }
      })
    },
    deleteSingleFile (item, index) {
      var vm = this
      let x = confirm('Bạn có chắc chắn xóa file đính kèm ?')
      if (x) {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.fileViews.splice(index, 1)
          // vm.stateView = true
          vm.partView = item.dossierPartNo
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            // vm.recountFileTemplates()
            vm.setDaKhai(item)
          })
        }).catch(reject => {
          toastr.clear()
          toastr.error('Yêu cầu của bạn thực hiện thất bại.')
        })
      }
    },
    downloadSingleFile (data) {
      let vm = this
      let url = vm.initDataResource.dossierApi + '/' + vm.thongTinHoSo.dossierId + '/files/' + data.referenceUid
      window.location.assign(url)
    },
    viewFile (data) {
      var vm = this
      vm.dossierFilesItems.forEach(val => {
        val['dossierId'] = vm.thongTinHoSo.dossierId
        if (val.dossierPartNo === data.partNo) {
          this.$store.dispatch('viewFile', val)
        }
      })
    },
    viewFileAlpaca (file) {
      let vm = this
      let counter = 0
      vm.loadingApacal = true
      let callServer = function() {
        setTimeout(function () {
          vm.$store.dispatch('viewFile', file).then(result => {
            if (result === 'pending' && counter <= 10) {
              counter += 1
              callServer()
            } else {
              if (counter > 10) {
                vm.loadingApacal = false
              } else {
                vm.loadingApacal = false
                setTimeout(function () {
                  document.getElementById('displayPDF' + file.dossierPartNo + vm.id).src = result
                }, 100)
              }
            }
          }).catch (function () {
            vm.loadingApacal = false
          })
        }, 1000)
      }
      callServer()
    },
    setDaKhai (itemFile) {
      var vm = this
      let indexFile = vm.dossierFilesItems.findIndex(file => {
        return file.dossierPartNo === itemFile.dossierPartNo
      })
      if (indexFile === -1) {
        for (var i = 0; i < vm.dossierTemplateItemsFilter.length; i++) {
          if (vm.dossierTemplateItemsFilter[i].partNo === itemFile.dossierPartNo) {
            vm.dossierTemplateItemsFilter[i]['passRequired'] = false
            break
          }
        }
      } else {
        for (var i = 0; i < vm.dossierTemplateItemsFilter.length; i++) {
          if (vm.dossierTemplateItemsFilter[i].partNo === itemFile.dossierPartNo) {
            vm.dossierTemplateItemsFilter[i]['passRequired'] = true
            break
          }
        }
      }
    },
    checkPartType3 () {
      var vm = this
      if (vm.dossierTemplateItems.length !== 0) {
        for (var i = 0; i < vm.dossierTemplateItems.length; i++) {
          if (vm.dossierTemplateItems[i].partType === 3) {
            return true
          }
        }
      }
      return false
    },
    viewFile2 (data) {
      var vm = this
      if (data.fileSize === 0) {
        return
      }
      if (data['eForm']) {
        vm.pdfEform = true
      } else {
        vm.pdfEform = false
      }
      if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar' || data.fileType === 'txt' || data.fileType === 'mp3' || data.fileType === 'mp4') {
        var url = vm.initDataResource.dossierApi + '/' + vm.thongTinHoSo.dossierId + '/files/' + data.referenceUid
        window.location.assign(url)
      } else {
        data['dossierId'] = vm.thongTinHoSo.dossierId
        if (data.referenceUid) {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
          vm.$store.dispatch('viewFile', data).then(result => {
            vm.dialogPDFLoading = false
            document.getElementById('dialogPDFPreview' + vm.id).src = result
          })
        } else {
          toastr.clear()
          toastr.error('File dữ liệu không tồn tại')
        }
      }
    },
    attachToDossier (file, index) {
      let vm = this
      console.log(file, index)
      file['dossierId'] = vm.thongTinHoSo.dossierId
      if (file.partType !== 3) {
        vm.progressUploadPart = file.dossierFileId
        vm.$store.dispatch('copyFile', file).then(function (result) {
          vm.progressUploadPart = ''
          vm.dossierTemplateItemsFilter[index]['passRequired'] = true
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
          })
        }).catch(function (xhr) {
          vm.progressUploadPart = ''
          toastr.error('Đính kèm tài liệu thất bại')
        })
      }
    },
    viewGiayToDaNop (data) {
      var vm = this
      if (data.fileSize === 0) {
        return
      }
      if (data['eForm']) {
        vm.pdfEform = true
      } else {
        vm.pdfEform = false
      }
      if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar' || data.fileType === 'txt' || data.fileType === 'mp3' || data.fileType === 'mp4') {
        var url = vm.initDataResource.dossierApi + '/' + data.dossierId + '/files/' + data.referenceUid
        window.location.assign(url)
      } else {
        if (data.referenceUid) {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
          vm.$store.dispatch('viewFile', data).then(result => {
            vm.dialogPDFLoading = false
            document.getElementById('dialogPDFPreview' + vm.id).src = result
          })
        } else {
          toastr.clear()
          toastr.error('File dữ liệu không tồn tại')
        }
      }
    },
    viewFileWithPartNo (item) {
      var vm = this
      if (vm.dossierFilesItems) {
        var fileViewsTemp = vm.dossierFilesItems.filter(file => {
          return file.dossierPartNo === item.partNo && !file.eForm
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
    saveMark () {
      let vm = this
      // console.log('save mark', vm.dossierTemplateItems)
      if (vm.dossierTemplateItemsFilter) {
        vm.dossierTemplateItemsFilter.forEach(function (value, index) {
          if (value.partType === 1 && value.fileMark && !value.recordCountDefault) {
            value['dossierId'] = vm.thongTinHoSo.dossierId
            vm.$store.dispatch('postDossierMark', value)
          }
        })
      }
    },
    changeFileMark (event, index) {
      let vm = this
      if (!vm.onlyView) {
        let item = vm.dossierTemplateItemsFilter[index]
        item['dossierId'] = vm.thongTinHoSo.dossierId
        item['fileMark'] = event
        item['checkInput'] = vm.checkInput
        vm.$store.dispatch('postDossierMark', item)
        vm.dossierTemplateItemsFilter[index].fileMark = event
        vm.dossierTemplateItemsFilter[index].hasTemplate = String(vm.dossierTemplateItemsFilter[index].fileMark) !== '0'
        if (event === 0) {
          vm.dossierTemplateItemsFilter[index].recordCount = 0
        }
      }
    },
    changeHasTemplate (index, item) {
      let vm = this
      item['dossierId'] = vm.thongTinHoSo.dossierId
      setTimeout(function () {
        if (item['hasTemplate']) {
          item.fileMark = item.fileMarkDefault
          item.recordCount = 1
        } else {
          item.fileMark = 0
          item.recordCount = 0
        }
        vm.$store.dispatch('postDossierMark', item)
      }, 100)
    },
    changeHasTemplateLienThong (index, item) {
      let vm = this
      setTimeout(() => {
        if (item['hasTemplateLienThong']) {
          vm.dossierTemplateLienThong.push(item.partNo)
          vm.$store.commit('setDossierTemplateLienThong', vm.dossierTemplateLienThong)
        } else {
          let a = vm.dossierTemplateLienThong.filter(function(item1) {
            return item1 !== item.partNo
          })
          vm.dossierTemplateLienThong = a
          vm.$store.commit('setDossierTemplateLienThong', vm.dossierTemplateLienThong)
        }
      }, 100);
    },
    changeFileCheck (event, index) {
      var vm = this
      // console.log('event=====', event)
      let item = vm.dossierTemplateItemsFilter[index]
      item['dossierId'] = vm.thongTinHoSo.dossierId
      item['fileCheck'] = event
      item['checkInput'] = vm.checkInput
      if (event === 2) {
        item['stateEditFileCheck'] = true
        return
      } else {
        item['fileComment'] = ''
      }
      // console.log('item-check-------', item)
      vm.$store.dispatch('postDossierMark', item)
      vm.dossierTemplateItemsFilter[index].fileCheck = event
    },
    changeFileComment (item, index) {
      var vm = this
      // console.log('item-------', item)
      if (item.fileComment === null || item.fileComment === undefined || item.fileComment === '') {
        return
      }
      item['dossierId'] = vm.thongTinHoSo.dossierId
      item['fileComment'] = item.fileComment
      item['checkInput'] = vm.checkInput
      item['stateEditFileCheck'] = !item['stateEditFileCheck']
      // console.log('item-comment-------', item)
      vm.$store.dispatch('postDossierMark', item)
      vm.dossierTemplateItemsFilter[index].fileComment = item.fileComment
    },
    checkStyle (item) {
      var vm = this
      if (vm.checkInput === 1) {
        return 'calc(100% - 140px)'
      } else {
        let divPx = 0
        if (vm.originality !== 1 && item.partType === 1 && !vm.thongTinHoSo.online && vm.checkInput !== 1) {
          if (!vm.onlyView) {
            divPx += 240
          } else {
            divPx += 140
          }
        }
        if (item.fileCheck > 0 && !vm.thongTinHoSo.online) {
          divPx += 20
        }
        if (item.fileCheck > 0 && vm.thongTinHoSo.online) {
          divPx += 40
        }
        if (!vm.onlyView) {
          divPx += 90
        }
        return 'calc(100% - ' + divPx + 'px)'
      }
    },
    checkVisibleTemp (item, index) {
      var vm = this
      if (!vm.onlyView) {
        return true
      }
      if (item.partType === 3) {
        if (vm.dossierFilesItems.length > 0) {
          let indexFile = vm.dossierFilesItems.findIndex(file => {
            return file.dossierPartNo === item.partNo
          })
          if (indexFile === -1) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      } else {
        return true
      }
    },
    changeStateViewResult () {
      var vm = this
      if (vm.dossierFilesItems.length > 0) {
        let index = vm.dossierFilesItems.findIndex(file => {
          return (file.dossierPartType === 2 || file.dossierPartType === 7)
        })
        if (index !== -1) {
          vm.$emit('tp:change-state-view-result', true)
        } else {
          vm.$emit('tp:change-state-view-result', false)
        }
      } else {
        if (vm.partTypes.includes(2) || vm.partTypes.includes(7)) {
          vm.$emit('tp:change-state-view-result', false)
        }
      }
    },
    changeOtherDossierTemp (data) {
      var vm = this
      if (vm.originality === 3 && vm.stateAddFileOther) {
        vm.loadingAddOther = true
        vm.$store.dispatch('uploadSingleOtherFile', {
          dossierId: vm.thongTinHoSo.dossierId,
          displayName: data,
          partNo: vm.dossierTemplatesItemSelect.partNo
        }).then(resFile => {
          vm.loadingAddOther = false
          vm.dialogAddOtherTemp = false
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result2 => {
            vm.dossierFilesItems = result2
          })
        }).catch(reject => {
          vm.loadingAddOther = false
        })
      } else {
        // console.log('dossierTemplatesItemSelect ', vm.dossierTemplatesItemSelect)
        let params = vm.dossierTemplatesItemSelect
        params['dossierId'] = vm.thongTinHoSo.dossierId
        params['displayName'] = data
        params['dossierTemplateNo'] = vm.thongTinHoSo.dossierTemplateNo
        vm.$store.dispatch('uploadSingleFile', params).then(function (result1) {
          vm.progressUploadPart = ''
          vm.dialogAddOtherTemp = false
          // console.log('success!!!!!!!!!!!!!!')
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result2 => {
            vm.dossierFilesItems = result2
            vm.recountFileTemplates()
            if (vm.stateView && vm.dossierFilesItems) {
              var fileViewsTemp = vm.dossierFilesItems.filter(file => {
                return file.dossierPartNo === vm.dossierTemplatesItemSelect.partNo && !file.eForm
              })
              if (fileViewsTemp) {
                vm.fileViews = fileViewsTemp
              }
            }
          })
        }).catch(function (xhr) {
          vm.progressUploadPart = ''
        })
      }
    },
    downloadFileTemplate (item, index) {
      var vm = this
      if (vm.fileTemplateItems.length > 0) {
        let fileFind = vm.fileTemplateItems.find(file => {
          return item.fileTemplateNo === file.fileTemplateNo
        })
        if (fileFind) {
          let url = vm.initDataResource.serviceInfoApi + '/' + vm.serviceInfoId + '/filetemplates/' + fileFind.fileTemplateNo
          window.location.assign(url)
        } else {
          console.log('ko thay file')
        }
      }
    },
    addOtherTemplate () {
      var vm = this
      if (vm.$refs.form.validate()) {
        // console.log('add')
        vm.changeOtherDossierTemp(vm.otherDossierTemplate)
      }
    },
    editDisplayName (item, index) {
      var vm = this
      if (vm.dossierFileIdView !== item.dossierFileId) {
        vm.dossierFileIdView = item.dossierFileId
        vm.stateEdit = true
      } else {
        vm.dossierFileIdView = item.dossierFileId
        vm.stateEdit = !vm.stateEdit
      }
    },
    cancelDialog () {
      var vm = this
      vm.dialogAddOtherTemp = false
      vm.progressUploadPart = ''
    },
    addFileOther (item) {
      var vm = this
      vm.dialogAddOtherTemp = true
      vm.stateAddFileOther = true
      vm.dossierTemplatesItemSelect = item
    },
    validDossierTemplate () {
      var vm = this
      if (vm.dossierTemplateItemsFilter.length > 0) {
        for (var i = 0; i < vm.dossierTemplateItemsFilter.length; i++) {
          if (vm.dossierTemplateItemsFilter[i]['required'] && !vm.dossierTemplateItemsFilter[i]['passRequired'] && vm.partTypes.includes(vm.dossierTemplateItemsFilter[i].partType)) {
            let message = 'Chú ý :' + vm.dossierTemplateItemsFilter[i].partName + ' là thành phần bắt buộc!'
            toastr.clear()
            toastr.error(message)
            return false
          }
        }
        return true
      } else {
        return true
      }
    },
    changeDisplayName (item, index) {
      var vm = this
      let params = {
        dossierId: vm.thongTinHoSo.dossierId,
        value: value
      }
      vm.$store.dispatch('changeDisplayNameFile', params).then(result => {
        vm.fileViews[index].displayName = result.displayName
        vm.stateEdit = false
      }).catch(reject => {
        console.log('error')
      })
    },
    getDossierFileApplicants (applicantIdNo, fileTemplateNo) {
      var vm = this
      let filter = {
        dossierId: vm.thongTinHoSo.dossierId,
        applicantIdNo: applicantIdNo,
        fileTemplateNo: fileTemplateNo
      }
      vm.$store.dispatch('getDossierFilesApplicants', filter).then(result => {
        vm.dossierFilesApplicant = result
      }).catch(reject => {
        console.log('error')
      })
    },
    showFilesApplicant (partNo) {
      let vm = this
      if ($('#fileApplicant-' + partNo).is(':visible')) {
        $('#fileApplicant-' + partNo).hide()
      } else {
        $('#fileApplicant-' + partNo).show()
      }
    },
    checkKQhasFile (item) {
      var vm = this
      if (vm.partTypes.includes(2)) {
        var hasFile = vm.dossierFilesItems.find(file => {
          return item.partNo === file.dossierPartNo
        })
        if (hasFile) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    partNoApplicantHasFile (partNo) {
      let vm = this
      let hasFile = vm.dossierFilesApplicant.find(file => {
        return (file.dossierTemplateNo === vm.thongTinHoSo['dossierTemplateNo'] && file.dossierPartNo === partNo)
      })
      if (hasFile) {
        return true
      } else {
        return false
      }
    },
    changeRecordCount (index) {
      let vm = this
      if (!vm.onlyView) {
        vm.dossierTemplateItemsFilter[index].recordCount = vm.dossierTemplateItemsFilter[index]['recordCount'] ? vm.dossierTemplateItemsFilter[index]['recordCount'] : ''
        function changeRecord () {
          vm.doChange[index] = setTimeout(function () {
            if (!vm.onlyView && Number(vm.dossierTemplateItemsFilter[index]['recordCount']) >= 0) {
              let item = Object.assign({}, vm.dossierTemplateItemsFilter[index], {dossierId: vm.thongTinHoSo.dossierId})  
              vm.$store.dispatch('postDossierMark', item)
            }
          }, 1000)
        }
        clearTimeout(vm.doChange[index])
        changeRecord()
      }
    },
    increaseCounter (index) {
      let vm = this
      vm.dossierTemplateItemsFilter[index].recordCount = vm.dossierTemplateItemsFilter[index]['recordCount'] ? vm.dossierTemplateItemsFilter[index]['recordCount'] : ''
      vm.dossierTemplateItemsFilter[index]['recordCount'] = Number(vm.dossierTemplateItemsFilter[index]['recordCount']) + 1
      function changeRecord () {
        vm.doChange[index] = setTimeout(function () {
          if (!vm.onlyView && Number(vm.dossierTemplateItemsFilter[index]['recordCount']) >= 0) {
            let item = Object.assign({}, vm.dossierTemplateItemsFilter[index], {dossierId: vm.thongTinHoSo.dossierId})  
            vm.$store.dispatch('postDossierMark', item)
          }
        }, 1000)
      }
      clearTimeout(vm.doChange[index])
      changeRecord()
    },
    decreaseCounter (index) {
      let vm = this
      vm.dossierTemplateItemsFilter[index].recordCount = vm.dossierTemplateItemsFilter[index]['recordCount'] ? vm.dossierTemplateItemsFilter[index]['recordCount'] : ''
      vm.dossierTemplateItemsFilter[index]['recordCount'] = vm.dossierTemplateItemsFilter[index]['recordCount'] ? Number(vm.dossierTemplateItemsFilter[index]['recordCount']) - 1 : vm.dossierTemplateItemsFilter[index]['recordCount']
      function changeRecord () {
        vm.doChange[index] = setTimeout(function () {
          if (!vm.onlyView && Number(vm.dossierTemplateItemsFilter[index]['recordCount']) >= 0) {
            let item = Object.assign({}, vm.dossierTemplateItemsFilter[index], {dossierId: vm.thongTinHoSo.dossierId})  
            vm.$store.dispatch('postDossierMark', item)
          }
        }, 1000)
      }
      clearTimeout(vm.doChange[index])
      changeRecord()
    },
    attachFileFromStorage (data) {
      let vm = this
      let filter = {
        dossierId: vm.thongTinHoSo.dossierId,
        dossierTemplateNo: vm.thongTinHoSo.dossierTemplateNo,
        partNo: vm.dossierPartAttach.partNo,
        filePath: data.filePath,
        fileName: data.fileName,
        fileType: data.fileExtension,
        // fileName: String(data.fileName).replace(/\s/g, '')
      }
      console.log('data storage', filter)
      if (vm.dossierPartAttach.partType !== 3) {
        vm.$store.dispatch('copyFileFromStorage', filter).then(function (result) {
          vm.dialog_documentApplicant = false
          vm.dossierTemplateItemsFilter[vm.indexPart]['passRequired'] = true
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
          })
        }).catch(function (xhr) {
          vm.dialog_documentApplicant = false
          toastr.error('Đính kèm tài liệu thất bại')
        })
      }
    },
    getDocumentTypeIcon (type) {
      let vm = this
      let typeDoc = 'doc,docx'
      let typeExcel = 'xls,xlsx'
      let typeImage = 'png,jpg,jpeg'
      if (type) {
        if (typeDoc.indexOf(type.toLowerCase()) >= 0) {
          return {
            icon: 'fas fa fa-file-word-o',
            color: 'blue',
            size: 14
          }
        } else if (typeExcel.indexOf(type.toLowerCase()) >= 0) {
          return {
            icon: 'fas fa fa-file-excel-o',
            color: 'green',
            size: 14
          }
        } else if (type.toLowerCase() === 'pdf') {
          return {
            icon: 'fa fa-file-pdf-o',
            color: 'red',
            size: 14
          }
        } else if (typeImage.indexOf(type.toLowerCase()) >= 0) {
          return {
            icon: 'fas fa fa-file-image-o',
            color: 'primary',
            size: 14
          }
        } else {
          return {
            icon: 'fas fa fa-paperclip',
            color: '',
            size: 14
          }
        }
      } else {
        return ''
      }
    },
    showDocumentApplicant (part, index) {
      let vm = this
      vm.dossierPartAttach = part
      vm.indexPart = index
      vm.$refs.khotailieu.initData()
      vm.dialog_documentApplicant = true
    }
  }
}
</script>
