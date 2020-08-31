<template>
  <div>
    <v-card>
      <div class="form_alpaca" style="position: relative;" v-for="(item, index) in dossierTemplateItems" v-if="partTypes.includes(item.partType) && checkVisibleTemp(item, index)" v-bind:key="item.partNo">
        <v-expansion-panel expand :value="[currentFormView === 'formAlpaca' + item.partNo + id ? true : false]" class="expaned__list__data">
          <v-expansion-panel-content hide-actions>
            <div slot="header" @click="stateView = false" style="background-color:#fff">
              <div style="align-items: center;background: #fff; padding-left: 25px;" :style="{width: checkStyle(item)}">
                <div class="mr-2" @click="onlyView && item.hasForm ? viewFile2(item) : loadAlpcaForm(item)" style="min-width: 18px; display: flex;">
                  <div class="header__tphs"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                  <div class="header__tphs">
                    <v-tooltip top style="max-width: 100% !important;">
                      <span slot="activator">
                        {{item.partName}}&nbsp; 
                        <span v-if="item.required" style="color: red"> (*) </span>
                        &nbsp;&nbsp;
                      </span>
                      <span v-if="item.partTip['tip']">{{item.partTip['tip']}}</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.hasForm && item.daKhai && ((originality === 1 && item.partType !==2) || originality !== 1)">
                      <i slot="activator" style="color: #0d71bb; font-size: 13px;" class="fa fa-file-text-o" aria-hidden="true"></i>
                      <span>Biểu mẫu trực tuyến (Đã khai)</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.hasForm && !item.daKhai && ((originality === 1 && item.partType !==2) || originality !== 1)">
                      <i slot="activator" style="color: #0d71bb; font-size: 13px;" class="fa fa-file-o"></i>
                      <span>Biểu mẫu trực tuyến (Chưa khai)</span>
                    </v-tooltip>
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
                  ></v-text-field>
                  <v-tooltip top v-if="checkInput === 1 && item.fileCheck === 2 && item.stateEditFileCheck">
                    <v-btn slot="activator" v-on:click.stop="changeFileComment(item, index)" icon class="mx-0 my-0">
                      <v-icon size="16" class="mx-0" color="primary">send</v-icon>
                    </v-btn>
                    <span>Gửi</span>
                  </v-tooltip>
                </div>
                <i v-if="item.fileComment && !item.stateEditFileCheck" style="font-size: 12px; color: #0d71bb; margin-left: 10px;">{{item.fileComment}}</i>
                <v-tooltip top v-if="item.fileComment && !item.stateEditFileCheck && checkInput === 1">
                  <v-icon slot="activator" v-on:click.stop="item.stateEditFileCheck = !item.stateEditFileCheck" style="font-size: 13px; color: #0d71bb; margin-left: 10px; cursor: pointer;">edit</v-icon>
                  <span>Chỉnh sửa ý kiến</span>
                </v-tooltip>
                <div v-for="(itemFileView, index) in dossierFilesItems" :key="index" v-if="item.partNo === itemFileView.dossierPartNo && !itemFileView.eForm">
                  <div :style="{width: 'calc(100% - 370px)', 'display': 'flex', 'align-items': 'center', 'background': '#fff', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '0px'}">
                    <span v-on:click.stop="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;">
                      <v-icon v-if="itemFileView.fileSize !== 0">attach_file</v-icon>
                      {{itemFileView.displayName}} - 
                      <i>{{itemFileView.modifiedDate}}</i>
                    </span>
                    <v-btn icon ripple v-on:click.stop="deleteSingleFile(itemFileView, index)" class="mx-0 my-0" v-if="!onlyView && checkInput !== 1">
                      <v-icon style="color: red">delete_outline</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div class="mr-3 my-1 py-2" :id="'fileApplicant-'+item.partNo" style="display:none;border:1px solid #f3ae75">
                  <div v-for="(itemFileView, index) in dossierFilesApplicant" :key="index" v-if="itemFileView.dossierTemplateNo === thongTinHoSo['dossierTemplateNo'] && item.partNo === itemFileView.dossierPartNo" >
                    <div v-if="itemFileView.eForm" :style="{width: 'calc(100% - 0px)', 'display': 'flex', 'align-items': 'center', 'background': '#fff', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '0px'}">
                      <v-tooltip top style="max-width:100%">
                        <span slot="activator" v-on:click.stop="viewGiayToDaNop(itemFileView)" class="ml-3" style="cursor: pointer;">
                          <i style="color: #0d71bb; font-size: 13px;" class="ml-1 fa fa-file-o"></i> &nbsp;
                          {{itemFileView.referenceUid}}.{{itemFileView.fileType}} - 
                          <i>{{itemFileView.modifiedDate}}</i>
                        </span>
                        <span>Bản khai trực tuyến</span>
                      </v-tooltip>
                    </div>
                    <div v-else :style="{width: 'calc(100% - 0px)', 'display': 'flex', 'align-items': 'center', 'background': '#fff', 'padding-left': '15px', 'font-size': '12px', 'margin-bottom': onlyView ? '5px' : '0px'}">
                      <v-tooltip top style="max-width:100%">
                        <span slot="activator" v-on:click.stop="viewGiayToDaNop(itemFileView)" class="ml-3" style="cursor: pointer;">
                          <v-icon style="color: #0d71bb" v-if="itemFileView.fileSize !== 0">attach_file</v-icon>
                          {{itemFileView.displayName}} - 
                          <i>{{itemFileView.modifiedDate}}</i>
                        </span>
                        <span>Đính kèm</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <v-card v-if="item.hasForm && !onlyView">
              <v-card-text style="background-color: rgba(244, 247, 213, 0.19)">
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-right" v-if="!stateView">
                    <div :id="'wrapForm' + item.partNo + id" :style="pstFixed > pstEl && pstFixed < endEl + pstEl ? 'position:fixed;top:5px;z-index:101' : ''">
                      <v-btn color="primary" @click="saveAlpacaForm(item, index)" 
                      v-if="item.hasForm && !onlyView && checkInput !== 1">Lưu lại</v-btn>
                      <v-btn color="primary" @click="deleteSingleFileEform(item, index)" v-if="item.daKhai && item.hasForm && !onlyView && checkInput !== 1">Xóa</v-btn>
                      <v-btn color="primary" @click="previewFileEfom(item, index)" v-if="item.daKhai && item.hasForm">In</v-btn>
                    </div>
                    <div :id="'formAlpaca' + item.partNo + id" :class='{"no_acction__event": onlyView}' v-if="!onlyView || item.daKhai">
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div class="absolute__btn group__thanh_phan mr-1">
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-layout row wrap v-else>
            <v-flex style="width: 110px;" class="layout wrap" v-if="originality !== 1 && item.partType === 1 && !thongTinHoSo.online && checkInput !== 1">
              <!-- <v-radio-group v-model="dossierTemplateItems[index].fileMark" row>
                <v-radio :value="0"></v-radio>
                <v-radio :value="1"></v-radio>
                <v-radio :value="2"></v-radio>
                <v-radio :value="3"></v-radio>
              </v-radio-group> -->
              <v-select
                :items="fileMarkItems"
                v-model="dossierTemplateItems[index].fileMark"
                :disabled="onlyView"
                @change="changeFileMark($event, index)"
              ></v-select>
            </v-flex>
            <v-flex style="width: 120px;" class="layout wrap" v-if="checkInput === 1">
              <v-select
                :items="fileCheckItems"
                item-text="text"
                item-value="value"
                v-model="dossierTemplateItems[index].fileCheck"
                @change="changeFileCheck($event, index)"
              ></v-select>
            </v-flex>
            <v-flex :style="{width: '20px', 'align-items': 'center', 'margin-left': '10px', 'margin-top': thongTinHoSo.online ? '10px' : '0px'}" class="layout wrap" v-else-if="item.fileCheck > 0">
              <v-tooltip top v-if="item.fileCheck === 1">
                <v-icon slot="activator" size="16" class="mx-0" color="primary">done</v-icon>
                <span>Đạt</span>
              </v-tooltip>
              <v-tooltip top v-else-if="item.fileCheck === 2">
                <v-icon slot="activator" size="16" class="mx-0" color="primary">close</v-icon>
                <span>Không đạt</span>
              </v-tooltip>
            </v-flex>
            <v-flex :style="{width: !onlyView ? '90px' : 'auto'}" :class="{'text-xs-right' : onlyView}" v-if="checkInput !== 1">
              <input
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
              <v-tooltip left v-else-if="progressUploadPart !== item.partNo && !onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile(item)">
                  <v-badge>
                    <v-icon size="16" color="primary">cloud_upload</v-icon>
                  </v-badge>
                </v-btn>
                <span v-if="!item.partTip['extensions'] && !item.partTip['maxSize']">Tải file lên</span>
                <span v-else>Chấp nhận tải lên các định dạng: {{item.partTip['extensions']}}. Tối đa {{item.partTip['maxSize']}} MB </span>
              </v-tooltip>
              <v-tooltip top v-if="partNoApplicantHasFile(item.partNo) && !onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="showFilesApplicant(item.partNo)">
                  <v-badge>
                    <v-icon size="16" color="orange darken-3">warning</v-icon>
                  </v-badge>
                </v-btn>
                <span>Giấy tờ đã nộp</span>
              </v-tooltip>
              <!-- <v-tooltip top>
                <v-btn slot="activator" class="mx-0" fab dark small color="primary" @click="viewFileWithPartNo(item)" style="height:20px;width:20px">
                  {{item.count}}
                </v-btn>
                <span>Xem</span>
              </v-tooltip> -->
            </v-flex>
          </v-layout>
        </div>
        <!-- <div v-if="item.partNo === partView && stateView">
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <div v-for="(itemFileView, index) in fileViews" :key="index">
                <div style="width: calc(100% - 370px);display: flex;align-items: center;background: #fff;padding-left: 15px;">
                  <span @click="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;" v-if="!stateEdit">
                    <v-icon v-if="itemFileView.eForm">border_color</v-icon>
                    <v-icon v-else>attach_file</v-icon>
                    {{itemFileView.displayName}}
                  </span>
                  <v-text-field
                    v-model="itemFileView.displayName"
                    v-if="itemFileView.dossierFileId === dossierFileIdView && stateEdit"
                    @change="changeDisplayName(itemFileView, index)"
                  ></v-text-field>
                  <v-btn icon ripple @click="deleteSingleFile(itemFileView, index)" class="mx-0 my-0" v-if="!onlyView">
                    <v-icon style="color: red">delete_outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </div> -->
      </div>
      <div v-if="!partTypes.includes(2)">
        <v-layout class="mx-4" wrap>
          <v-flex style="width:60px" class="my-0 py-2 text-bold" v-if="!onlyView || (onlyView && applicantNoteDossier)">Ghi chú:</v-flex>
          <v-flex style="width:calc(100% - 80px)">
            <div v-if="!onlyView" class="pl-2">
              <v-text-field class="py-0"
              v-model="applicantNoteDossier"
              multi-line
              rows="3"
              @input="changeApplicantNote"
              ></v-text-field>
            </div>
            <p class="my-0 py-2" v-if="onlyView && applicantNoteDossier">
              {{applicantNoteDossier}} 
            </p>
          </v-flex>
        </v-layout>
      </div>
      <v-dialog v-model="dialogAddOtherTemp" max-width="400" transition="fade-transition" persistent>
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title class="headline">Tên giấy tờ</v-card-title>
            <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="cancelDialog">
              <v-icon>clear</v-icon>
            </v-btn>
            <v-progress-linear v-if="loadingAddOther" class="my-0" :indeterminate="true"></v-progress-linear>
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
              <v-btn color="red darken-3" flat="flat" @click.native="cancelDialog">
                Quay lại
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
        <v-card-title class="headline">
          <span v-if="pdfEform">Bản khai trực tuyến</span>
          <span v-else>File đính kèm</span>
        </v-card-title>
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
        <iframe v-show="!dialogPDFLoading" :id="'dialogPDFPreview' + id" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  data: () => ({})
}
</script>
