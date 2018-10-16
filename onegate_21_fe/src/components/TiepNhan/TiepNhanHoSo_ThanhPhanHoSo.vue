<template>
  <div>
    <v-card>
      <div class="form_alpaca" style="position: relative;" v-for="(item, index) in dossierTemplateItems" v-if="partTypes.includes(item.partType) && checkVisibleTemp(item, index)" v-bind:key="item.partNo">
        <v-expansion-panel class="expaned__list__data">
          <v-expansion-panel-content hide-actions :value="false">
            <div slot="header" @click="stateView = false" style="background-color:#fff">
              <div style="align-items: center;background: #fff; padding-left: 25px;" :style="{width: checkStyle(item)}">
                <div class="mr-2" @click="loadAlpcaForm(item)" style="min-width: 18px; display: flex;">
                  <div class="header__tphs"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                  <div class="header__tphs">
                    <v-tooltip top style="max-width: 100% !important;">
                      <span slot="activator">
                        {{item.partName}}&nbsp; 
                        <span v-if="item.required" style="color: red"> (*) </span>
                        &nbsp;&nbsp;
                      </span>
                      <span v-if="item.partTip">{{item.partTip}}</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.hasForm && item.daKhai">
                      <i slot="activator" style="color: #0d71bb; font-size: 13px;" class="fa fa-file-text-o" aria-hidden="true"></i>
                      <span>Biểu mẫu trực tuyến (Đã khai)</span>
                    </v-tooltip>
                    <v-tooltip top v-if="item.hasForm && !item.daKhai">
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
              </div>
            </div>
            <v-card v-if="item.hasForm">
              <v-card-text style="background-color: rgba(244, 247, 213, 0.19);">
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-right" v-if="!stateView">
                    <v-btn color="primary" @click="saveAlpacaForm(item, index)" 
                    v-if="item.hasForm && !onlyView && checkInput !== 1">Lưu lại</v-btn>
                    <v-btn color="primary" @click="deleteSingleFileEform(item, index)" v-if="item.daKhai && item.hasForm && !onlyView && checkInput !== 1">Xóa</v-btn>
                    <v-btn color="primary" @click="previewFileEfom(item, index)" v-if="item.daKhai && item.hasForm">In</v-btn>
                    <div :id="'formAlpaca' + item.partNo + id" :class='{"no_acction__event": onlyView}' v-if="!onlyView || item.daKhai">
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div class="absolute__btn group__thanh_phan pr-3 mr-1">
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
            <v-flex :style="{width: !onlyView ? '90px' : 'auto'}" :class="{'text-xs-center' : !onlyView, 'text-xs-right' : onlyView}" v-if="checkInput !== 1">
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
              <v-tooltip top v-else-if="progressUploadPart !== item.partNo && !onlyView">
                <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile(item)">
                  <v-badge>
                    <v-icon size="16" color="primary">cloud_upload</v-icon>
                  </v-badge>
                </v-btn>
                <span>Tải file lên</span>
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
              <v-btn color="primary" flat="flat" @click.native="addOtherTemplate"
              :loading="loadingAddOther"
              >
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
        <iframe v-show="!dialogPDFLoading" :id="'dialogPDFPreview' + id" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import $ from 'jquery'
// import * as utils from '../store/onegate_utils'
import toastr from 'toastr'
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
    }
  },
  data: () => ({
    dossierTemplateItems: [],
    dossierMarksItems: [],
    dossierFilesItems: [],
    thongTinHoSo: {},
    valid: true,
    stateView: false,
    dialogAddOtherTemp: false,
    loadingAddOther: false,
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
    sampleCount: 0,
    serviceInfoId: 0,
    fileMarkItems: [{
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
    }],
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
    stateViewResult: true
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    initDataResource () {
      return this.$store.getters.loadingInitData
    }
  },
  mounted () {
    var vm = this
    vm.page = 1
    vm.$nextTick(function () {
    })
  },
  watch: {},
  methods: {
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
      console.log('partTypes', vm.partTypes)
      var arrTemp = []
      // console.log('dossierId++++++++', data.dossierId)
      if (data['sampleCount'] !== null && data['sampleCount'] !== undefined && data['sampleCount'] !== 'undefined') {
        vm.sampleCount = data['sampleCount']
      }
      arrTemp.push(vm.$store.dispatch('loadDossierTemplates', data))
      arrTemp.push(vm.$store.dispatch('loadDossierMark', data))
      arrTemp.push(vm.$store.dispatch('loadDossierFiles', data.dossierId))
      arrTemp.push(vm.$store.dispatch('getServiceInfo', {
        serviceInfoId: data.serviceCode
      }))
      vm.thongTinHoSo = data
      Promise.all(arrTemp).then(values => {
        var dossierTemplates = values[0]
        var dossierMarks = values[1]
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
        // console.log('dossierTemplates++++++', dossierTemplates)
        // console.log('dossierMarks++++++', dossierMarks)
        // console.log('dossierFiles++++++', dossierFiles)
        var dossierTemplateItems = vm.mergeDossierTemplateVsDossierFiles(dossierTemplates, dossierFiles)
        // console.log('dossierTemplateItems++++++MERGER++++file', dossierTemplateItems)
        dossierTemplateItems = vm.mergeDossierTemplateVsDossierMark(dossierTemplateItems, dossierMarks)
        dossierTemplateItems = vm.mergeDossierTemplateVsFileTemplates(dossierTemplateItems, fileTemplates)
        // console.log('dossierTemplateItems++++++MERGE++++mark', dossierTemplateItems)
        vm.dossierFilesItems = dossierFiles
        vm.dossierMarksItems = dossierMarks
        vm.fileTemplateItems = fileTemplates
        vm.dossierTemplateItems = dossierTemplateItems
        if (vm.partTypes.includes(2) && vm.dossierTemplateItems.length > 0) {
          let dossierTemplateKQ = []
          vm.dossierTemplateItems.forEach(item => {
            let hasKQ = vm.dossierFilesItems.find(file => {
              return (item.partNo === file.dossierPartNo && item.partType === 2)
            })
            if (hasKQ) {
              dossierTemplateKQ.push(item)
            }
          })
          vm.dossierTemplateItems = dossierTemplateKQ
          console.log('dossierTemplateItems555', vm.dossierTemplateItems)
        }
        vm.changeStateViewResult()
        setTimeout(function (argument) {
          vm.genAllAlpacaForm(dossierFiles, dossierTemplateItems)
          vm.recountFileTemplates()
        }, 500)
        // console.log('dossierTemplateItems', vm.dossierTemplateItems)
      }).catch(reject => {
      })
    },
    genAllAlpacaForm (dossierFiles, dossierTemplateItems) {
      var vm = this
      if (dossierFiles.length > 0) {
        var dossierFilesEform = dossierFiles.filter(file => {
          return file.eForm
        })
        var dossierTemplatesHasForm = dossierTemplateItems.filter(template => {
          return template.hasForm && vm.partTypes.includes(template.partType)
        })
        if (dossierFilesEform.length > 0) {
          dossierFilesEform.forEach(itemFiles => {
            if (itemFiles.eForm) {
              vm.$store.dispatch('loadAlpcaForm', itemFiles)
            }
          })
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
          template['daKhai'] = false
          var itemFind = dossierFiles.find(file => {
            return template.partNo === file.dossierPartNo && vm.partTypes.includes(template.partType) && file.eForm
          })
          if (itemFind) {
            template['daKhai'] = true
          } else if (!itemFind && template.hasForm) {
            template['daKhai'] = false
          }
          dossierFiles.forEach(dossierFile => {
            if (template.partNo === dossierFile.dossierPartNo && !dossierFile.eForm && !template.hasForm) {
              template['daKhai'] = true
            }
          })
        })
      } else {
        dossierTemplates.forEach(template => {
          if (template.hasForm) {
            template['daKhai'] = false
          }
        })
      }
      return dossierTemplates
    },
    mergeDossierTemplateVsDossierMark (dossierTemplates, dossierMarks) {
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
          } else {
            itemTemplate['fileMark'] = 0
            itemTemplate['fileComment'] = ''
            itemTemplate['fileCheck'] = 0
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
    showAlpacaJSFORM (item) {
      var vm = this
      item['dossierId'] = vm.thongTinHoSo.dossierId
      vm.$store.dispatch('loadFormScript', item).then(resScript => {
        vm.$store.dispatch('loadFormData', item).then(resData => {
          window.$('#formAlpaca' + item.partNo + vm.id).empty()
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
          window.$('#formAlpaca' + item.partNo + vm.id).alpaca(formScript)
        })
      })
    },
    saveAlpacaForm (item, index) {
      var vm = this
      var fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === item.partNo && itemFile.eForm
      })
      if (fileFind) {
        fileFind['dossierId'] = vm.thongTinHoSo.dossierId
        fileFind['id'] = vm.id
        vm.$store.dispatch('putAlpacaForm', fileFind).then(resData => {
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
        }).catch(reject => {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        })
      } else {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        item['id'] = vm.id
        vm.$store.dispatch('postEform', item).then(resPostEform => {
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.dossierTemplateItems[index].daKhai = true
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
            vm.dossierFilesItems = resFiles
          }).catch(reject => {
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        }).catch(reject => {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        })
      }
    },
    onDeleteAttackFiles (item) {
      var vm = this
      console.log('delete')
      let x = confirm('Bạn có muốn xóa toàn bộ file trong thành phần hồ sơ này?')
      if (x) {
        vm.dossierFilesItems.forEach(val => {
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
    pickFile (item) {
      var vm = this
      vm.stateAddFileOther = false
      document.getElementById('file' + item.partNo).click()
    },
    onUploadSingleFile (e, data, index) {
      var vm = this
      console.log('vm.dossierTemplateItems[index]', vm.dossierTemplateItems[index])
      vm.dossierTemplatesItemSelect = data
      vm.progressUploadPart = data.partNo
      data['dossierId'] = vm.thongTinHoSo.dossierId
      data['dossierTemplateNo'] = vm.thongTinHoSo.dossierTemplateNo
      if (data.partType !== 3) {
        vm.$store.dispatch('uploadSingleFile', data).then(function (result) {
          vm.dossierTemplateItems[index]['daKhai'] = true
          vm.progressUploadPart = ''
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
            // var fileViewsTemp = vm.dossierFilesItems.filter(file => {
            //   return file.dossierPartNo === vm.dossierTemplatesItemSelect.partNo && !file.eForm
            // })
            // if (fileViewsTemp) {
            //   vm.fileViews = fileViewsTemp
            // }
          })
        }).catch(function (xhr) {
          vm.progressUploadPart = ''
        })
      } else {
        if (window.$('#file' + data.partNo)[0].files.length === 0) {
          vm.progressUploadPart = ''
          return
        }
        vm.partView = data.partNo
        vm.stateView = true
        vm.dialogAddOtherTemp = true
      }
    },
    loadAlpcaForm (data) {
      var vm = this
      var fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === data.partNo && itemFile.eForm
      })
      if (fileFind) {
        fileFind['id'] = vm.id
        vm.$store.dispatch('loadAlpcaForm', fileFind)
      } else {
        vm.dossierTemplateItems.forEach(val => {
          if (val.hasForm && data.partNo === val.partNo) {
            val['templateFileNo'] = vm.thongTinHoSo.dossierTemplateNo
            vm.showAlpacaJSFORM(val)
          }
        })
      }
    },
    deleteSingleFileEform (item, index) {
      var vm = this
      let x = confirm('Bạn có chắc chắn muốn xóa file đính kèm này không?')
      if (x) {
        vm.dossierFilesItems.forEach(file => {
          if (file.dossierPartNo === item.partNo && file.eForm) {
            file['dossierId'] = vm.thongTinHoSo.dossierId
            vm.$store.dispatch('deleteDossierFile', file).then(resFile => {
              console.log('success!')
              vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
                vm.dossierFilesItems = result
                vm.recountFileTemplates()
                var fileViewsTemp = vm.dossierFilesItems.filter(file => {
                  return file.dossierPartNo === item.partNo && !file.eForm
                })
                if (fileViewsTemp) {
                  vm.fileViews = fileViewsTemp
                }
              })
            })
          }
        })
        vm.dossierTemplateItems[index].daKhai = false
      }
    },
    previewFileEfom (item, index) {
      var vm = this
      vm.dossierFilesItems.forEach(file => {
        if (file.dossierPartNo === item.partNo && file.eForm) {
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
              toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          } else {
            vm.$store.dispatch('viewFile', file).then(result => {
              vm.dialogPDFLoading = false
              document.getElementById('dialogPDFPreview' + vm.id).src = result
            })
          }
        }
      })
    },
    deleteSingleFile (item, index) {
      var vm = this
      let x = confirm('Bạn có muốn xóa?')
      if (x) {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.fileViews.splice(index, 1)
          vm.stateView = true
          vm.partView = item.dossierPartNo
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            // vm.recountFileTemplates()
            vm.setDaKhai(item)
          })
        }).catch(reject => {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        })
      }
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
    setDaKhai (itemFile) {
      var vm = this
      let indexFile = vm.dossierFilesItems.findIndex(file => {
        return file.dossierPartNo === itemFile.dossierPartNo
      })
      if (indexFile === -1) {
        for (var i = 0; i < vm.dossierTemplateItems.length; i++) {
          if (vm.dossierTemplateItems[i].partNo === itemFile.dossierPartNo && !vm.dossierTemplateItems[i].hasForm) {
            vm.dossierTemplateItems[i]['daKhai'] = false
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
      if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar') {
        var url = vm.initDataResource.dossierApi + '/' + vm.thongTinHoSo.dossierId + '/files/' + data.referenceUid
        window.open(url)
      } else {
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        data['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('viewFile', data).then(result => {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview' + vm.id).src = result
        })
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
      var vm = this
      if (vm.dossierTemplateItems) {
        vm.dossierTemplateItems.forEach(function (value, index) {
          if (value.partType === 1) {
            value['dossierId'] = vm.thongTinHoSo.dossierId
            vm.$store.dispatch('postDossierMark', value)
          }
        })
      }
    },
    changeFileMark (event, index) {
      var vm = this
      let item = vm.dossierTemplateItems[index]
      item['dossierId'] = vm.thongTinHoSo.dossierId
      item['fileMark'] = event
      item['checkInput'] = vm.checkInput
      vm.$store.dispatch('postDossierMark', item)
      vm.dossierTemplateItems[index].fileMark = event
    },
    changeFileCheck (event, index) {
      var vm = this
      // console.log('event=====', event)
      let item = vm.dossierTemplateItems[index]
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
      vm.dossierTemplateItems[index].fileCheck = event
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
      vm.dossierTemplateItems[index].fileComment = item.fileComment
    },
    checkStyle (item) {
      var vm = this
      if (vm.checkInput === 1) {
        return 'calc(100% - 140px)'
      } else {
        let divPx = 0
        if (vm.originality !== 1 && item.partType === 1 && !vm.thongTinHoSo.online && vm.checkInput !== 1) {
          divPx += 140
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
          return file.dossierPartType === 2
        })
        if (index !== -1) {
          vm.$emit('tp:change-state-view-result', true)
        } else {
          vm.$emit('tp:change-state-view-result', false)
        }
      } else {
        if (vm.partTypes.includes(2)) {
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
          window.open(url)
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
      if (vm.dossierTemplateItems.length > 0) {
        for (var i = 0; i < vm.dossierTemplateItems.length; i++) {
          if (vm.dossierTemplateItems[i]['required'] && !vm.dossierTemplateItems[i]['daKhai'] && vm.partTypes.includes(vm.dossierTemplateItems[i].partType)) {
            let message = 'Chú ý :' + vm.dossierTemplateItems[i].partName + ' là thành phần bắt buộc!'
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
    }
  }
}
</script>
