<template>
  <div class="taotailieuketqua" style="background-color: white;width:100%" v-if="active">
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div> Kết quả xử lý
        </div>
        <v-card>
          <div class="form_alpaca" style="position: relative;" v-for="(item, index) in createFiles" v-bind:key="item.partNo + 'cr'">
            <v-expansion-panel expand :value="[true]" class="expaned__list__data">
              <v-expansion-panel-content hide-actions>
                <div slot="header" @click="stateView = false" style="background-color:#fff">
                  <div style="align-items: center;background: #fff; padding-left: 25px;" :style="{width: checkStyle(item)}">
                    <div class="mr-2" @click="loadAlpcaFormClick(item)" style="min-width: 20px; display: flex;">
                      <div class="header__tphs" style="min-width: 20px"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                      <div class="header__tphs">
                        {{item.partName}} <span v-if="item.required" style="color: red"> (*)</span>
                        &nbsp;&nbsp;

                        <span v-if="item.hasForm" style="color:#004b94">(Bản khai trực tuyến)</span>
                        &nbsp;&nbsp;

                      </div>
                    </div>
                    <div v-for="(itemFileView, index2) in dossierFilesItems" :key="index2 + 'cr'" v-if="item.partNo + id === itemFileView.dossierPartNo + id && !itemFileView.eForm">
                      <div style="width: calc(100% - 370px);display: flex;align-items: center;background: #fff;padding-left: 25px; font-size: 12px;">
                        <span v-on:click.stop="viewFile2(itemFileView, index2)" class="ml-3" style="cursor: pointer;">
                          <v-icon class="mr-1" :color="getDocumentTypeIcon(itemFileView.fileType)['color']"
                            :size="getDocumentTypeIcon(itemFileView.fileType)['size']">
                            {{getDocumentTypeIcon(itemFileView.fileType)['icon']}}
                          </v-icon>
                          {{itemFileView.displayName}} - 
                          <i>{{itemFileView.modifiedDate}}</i>
                        </span>
                        <v-btn title="Xóa" icon ripple v-on:click.stop="deleteSingleFile(itemFileView, index2, index)" class="mx-0 my-0">
                          <v-icon style="color: red">delete_outline</v-icon>
                        </v-btn>
                        <!-- <v-btn title="Đính kèm cho hồ sơ khác" v-if="itemFileView['dossierPartType'] === 7" icon ripple v-on:click.stop="attachOtherDossier(itemFileView)" class="mx-0 my-0">
                          <v-icon color="primary" size="13">fas fa fa-clone</v-icon>
                        </v-btn> -->
                        <v-tooltip top v-if="esignType === 'plugin' && itemFileView.fileType.toLowerCase() === 'pdf'">
                          <v-btn slot="activator" flat icon color="indigo" v-on:click.stop="signAction(itemFileView, index2)" class="my-0">
                            <v-icon size="18">fa fa-pencil-square-o</v-icon>
                          </v-btn>
                          <span>Ký duyệt</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <v-card v-if="item.eForm">
                  <v-card-text style="overflow: hidden;background-color: rgba(244, 247, 213, 0.19);">
                    <v-layout wrap>
                      <v-flex xs12 class="text-xs-right">
                        <div :id="'wrapForm' + item.partNo + id" :style="(pstFixed > pstEl && pstFixed < endEl + pstEl) ? 'position:fixed;top:5px;z-index:101' : ''">
                          <v-btn :disabled="loadingApacal" color="primary" @click.stop="saveAlpacaForm(item, index)" :id="'saveBtn' + item.partNo + item.templateNo"
                          v-if="item.eForm && item['editForm'] && !item.embed">
                            <i class="fa fa-spinner" aria-hidden="true" v-if="loadingApacal"></i>
                            <v-icon color="white" v-else>save</v-icon>&nbsp;
                            Lưu lại
                          </v-btn>
                          <!-- <v-btn color="primary" @click.stop="previewFormAlpaca(item, index)" v-if="item['editForm'] && item.daKhai && item.eForm">
                            <i class="fa fa-spinner" aria-hidden="true" v-if="loadingApacal"></i>
                            <v-icon color="white" v-else>print</v-icon>&nbsp;
                            Xem
                          </v-btn> -->
                          <!-- <v-btn color="primary" @click.stop="editFormAlpaca(item, index)" v-if="!item['editForm'] && item.eForm">
                            <v-icon color="white">edit</v-icon>&nbsp;
                            Sửa
                          </v-btn> -->
                          <!-- <v-btn color="primary" @click.stop="deleteSingleFileEform(item, index)" v-if="item.daKhai && item.eForm">
                            <i class="fa fa-spinner" aria-hidden="true" v-if="loadingApacal"></i>
                            <v-icon color="white" v-else>delete</v-icon>&nbsp;
                            Xóa
                          </v-btn> -->
                        </div>
                        <!--  -->
                        <div v-if="createFiles[index]['editForm'] && !createFiles[index].embed" :id="'formAlpaca' + item.partNo + id"></div>
                        <!--  -->
                        <div v-if="createFiles[index]['editForm'] && createFiles[index].embed">
                          <iframe :id="'formAlpaca' + item.partNo + id + 'embed'" width="100%" height="500px" frameborder="0" src=""></iframe>
                        </div>
                        <!--  -->
                        <iframe v-if="!createFiles[index]['editForm']" :id="'displayPDF' + item.partNo + id" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
                        </iframe>
                        <!--  -->
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
                <v-flex :style="esignType === 'plugin' ? 'width: 120px' : 'width: 100px'">
                  <input
                  type="file"
                  style="display: none"
                  :id="'file' + item.partNo"
                  @change="onUploadSingleFile($event, item, index)"
                  >
                  <v-progress-circular
                  :width="2"
                  :size="25"
                  color="green"
                  indeterminate
                  v-if="progressUploadPart + id === item.partNo + id"
                  ></v-progress-circular>
                  <!-- <v-tooltip top v-if="progressUploadPart + id !== item.partNo + id & item.eForm">
                    <v-btn slot="activator" icon class="mx-0 my-0" @click.stop="loadAlpcaFormClick(item)">
                      <v-badge>
                        <v-icon size="24" color="#004b94">edit</v-icon>
                      </v-badge>
                    </v-btn>
                    <span>Khai trực tuyến</span>
                  </v-tooltip> -->
                  <v-tooltip top v-if="progressUploadPart + id !== item.partNo + id">
                    <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile(item)">
                      <v-badge>
                        <v-icon size="24" color="#004b94">cloud_upload</v-icon>
                      </v-badge>
                    </v-btn>
                    <span v-if="!item.partTip['extensions'] && !item.partTip['maxSize']">Tải giấy tờ lên</span>
                    <span v-else>Tải giấy tờ lên (Chấp nhận tải lên các định dạng: {{item.partTip['extensions']}}. Tối đa {{item.partTip['maxSize']}} MB)</span>
                  </v-tooltip>
                  <v-tooltip top v-if="esignType === 'plugin' && item['eForm']">
                    <v-btn slot="activator" flat icon color="indigo" v-on:click.stop="signAction(item, index, item.partNo)" class="ml-2 my-0">
                      <v-icon size="22">fa fa-pencil-square-o</v-icon>
                    </v-btn>
                    <span>Ký duyệt</span>
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
          </div>
        </v-card>
        <!-- <div class="absolute-lable" style="font-size: 12px" v-if="originality !== 1 && !onlyView">
          <span>Không chọn</span>
          <span>Bản chính</span>
          <span>Bản chụp</span>
          <span>Công chứng</span>
        </div> -->
        <v-dialog v-model="dialogPDF" max-width="1000" transition="fade-transition" style="overflow: hidden;">
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{documentType}}</v-toolbar-title>
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
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialogConfirm" hide-overlay persistent max-width="350" transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="#1867c0">
          <v-toolbar-title style="font-size:16px">{{labelConfirm}}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <!-- <v-card-text class="pt-0 pb-0 px-0">
          {{labelConfirm}}
        </v-card-text> -->
        <v-card-actions class="mt-3">
          <v-flex class="text-xs-center">
            <v-btn class="mr-2" color="primary" @click.native="confirmAction">
              <v-icon>send</v-icon>&nbsp;
              Đồng ý
            </v-btn>
            <v-btn class="ml-2" color="red" style="color: #fff;" @click.native="dialogConfirm = false">
              <v-icon>close</v-icon>&nbsp;
              Bỏ qua
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSelectDosier" max-width="1000" transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Chọn hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="cancelAddFile">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <ho-so-nhom :dossiersgroup="dossierIntoGroup"></ho-so-nhom>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="addFileToDossier()">
            <v-icon>send</v-icon>&nbsp;
            Xác nhận
          </v-btn>
          <v-btn color="red" style="color: #fff;" @click.native="cancelAddFile">
            <v-icon>close</v-icon>&nbsp;
            Bỏ qua
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--  -->

  </div>
</template>

<script>
  // import $ from 'jquery'
  import toastr from 'toastr'
  import HoSoTrongNhom from '.././TiepNhan/HoSoTrongNhom'
  toastr.options = {
    'closeButton': true,
    'timeOut': '5000'
  }
  export default {
    props: {
      id: {
        type: String,
        default: () => 'nm'
      },
      detailDossier: {
        type: Object,
        default: () => {}
      },
      createFiles: {
        type: Array,
        default: () => []
      },
      esignType: {
        type: String,
        default: () => ''
      }
    },
    components: {
      'ho-so-nhom': HoSoTrongNhom
    },
    data: () => ({
      dialogConfirm: false,
      labelConfirm: '',
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
      fileTemplateItems: [],
      currentFormView: '',
      pstFixed: 0,
      pstEl: 0,
      endEl: 0,
      dialogSelectDosier: false,
      dossierIntoGroup: [],
      filesAdd: [],
      documentType: 'Tài liệu đính kèm',
      receiveMessage: '',
      active: true,
      loadingApacal: false,
      thaoTacGop: false
    }),
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
      dossierIntoGroupSelect () {
        return this.$store.getters.getDossierIntoGroup
      },
      createFileSignedSync () {
        return this.$store.getters.getCreateFileSigned
      },
      userLoginInfomation () {
        return this.$store.getters.getUserLogin
      },
    },
    created () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (currentQuery.hasOwnProperty('dossiers')) {
        vm.thaoTacGop = true
      }
      vm.receiveMessage = function (event) {
        vm.saveAlpacaFormCallBack(event)
      }
      vm.page = 1
      vm.$nextTick(function () {
        console.log('vm.detailDossier--TLKQ--', vm.detailDossier)
        if (vm.detailDossier['dossierId']) {
          if (!vm.thaoTacGop) {
            var arrTemp = []
            arrTemp.push(vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId))
            arrTemp.push(vm.$store.dispatch('loadDossierTemplates', vm.detailDossier))
            Promise.all(arrTemp).then(values => {
              var dossierTemplates = values[1]['dossierParts']
              var dossierFiles = values[0]
              vm.dossierFilesItems = dossierFiles
              //
              vm.dossierFilesItems.forEach((template, index) => {
                if (vm.detailDossier['dossierId'] === vm.createFileSignedSync['dossierId']) {
                  template['isSigned'] = vm.createFileSignedSync['createFiles'][index]['isSigned']
                  template['fileEntryId'] = vm.createFileSignedSync['createFiles'][index]['fileEntryId']
                  template['pdfSigned'] = vm.createFileSignedSync['createFiles'][index]['pdfSigned']
                } else {
                  template['isSigned'] = false
                  template['fileEntryId'] = ''
                  template['pdfSigned'] = ''
                }
              })
              // 
              vm.createFiles = vm.mergeDossierTemplateVsDossierFiles(vm.createFiles, dossierFiles)
              if (dossierTemplates.length !== 0) {
                vm.createFiles.forEach(template => {
                  var itemFind = dossierTemplates.find(part => {
                    return template.partNo === part.partNo
                  })
                  if (itemFind) {
                    template['required'] = itemFind['required']
                    template['partTip'] = itemFind['partTip']
                  }
                })
              }
            })
            // danh sách hồ sơ cùng group
            if (vm.detailDossier['groupDossierId']) {
              vm.getDossierIntoGroup(vm.detailDossier['groupDossierId'])
            }
          } else {
            vm.createFiles = vm.createFiles.map(obj =>{
              return obj = Object.assign(obj, {filesAttach: []})
            })
          }
        }
      })
      
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
      }
    },
    mounted () {
      var vm = this
      vm.$nextTick(function () {
        if (vm.createFiles.length > 0 && !vm.thaoTacGop) {
          setTimeout(function () {
            vm.genAllAlpacaForm(vm.dossierFilesItems, vm.createFiles)
          }, 300)
        }
      })
    },
    methods: {
      genAllAlpacaForm (dossierFiles, createFiles) {
        var vm = this
        if (dossierFiles.length > 0 && dossierFiles.filter(file => {
          return file.eForm && file.size
        }).length > 0) {
          var dossierFilesEform = dossierFiles.filter(file => {
            return file.eForm
          })
          var dossierTemplatesHasForm = createFiles.filter(template => {
            return template.eForm
          })
          if (dossierFilesEform.length > 0) {
            // dossierFilesEform.forEach(itemFiles => {
            //   if (itemFiles.eForm) {
            //     vm.$store.dispatch('loadAlpcaForm', itemFiles)
            //   }
            // })
          } else {
            createFiles.forEach(val => {
              if (val.eForm) {
                val['templateNo'] = vm.detailDossier.dossierTemplateNo
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
                template['templateNo'] = vm.detailDossier.dossierTemplateNo
                vm.showAlpacaJSFORM(template)
              }
            })
          }
        } else {
          createFiles.forEach(val => {
            if (val.eForm) {
              val['templateNo'] = vm.detailDossier.dossierTemplateNo
              vm.showAlpacaJSFORM(val)
            }
          })
        }
      },
      mergeDossierTemplateVsDossierFiles (createFiles, dossierFiles) {
        var vm = this
        if (dossierFiles.length !== 0) {
          createFiles.forEach((template, index) => {
            template['editForm'] = true
            template['embed'] = false
            let itemFind = dossierFiles.find(file => {
              return (template.partNo === file.dossierPartNo && file.fileSize !== 0 && file.eForm) || (template.partNo === file.dossierPartNo && !file.eForm)
              // return template.partNo === file.dossierPartNo && file.eForm
            })
            if (itemFind) {
              template['daKhai'] = true
            } else if (!itemFind) {
              template['daKhai'] = false
            }
          })
        } else {
          createFiles.forEach(template => {
            if (template.eForm) {
              template['daKhai'] = false
              template['editForm'] = true
              template['embed'] = false
              // template['isSigned'] = false
              // template['fileEntryId'] = ''
              // template['pdfSigned'] = ''
            }
          })
        }
        return createFiles
      },
      showAlpacaJSFORM (item) {
        var vm = this
        item['dossierId'] = vm.detailDossier.dossierId
        item['editForm'] = true
        item.templateNo = vm.detailDossier.dossierTemplateNo
        /* eslint-disable */
        let eformScript = ''
        if (item.formScript) {
          try {
            eformScript = eval('(' + item.formScript + ')')
          } catch (error) {
          }
          /* eslint-disable */
          if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
            console.log('eformEmbed', item)
            item.embed = true
            vm.active = false
            vm.active = true
            let userId = window.themeDisplay.getUserId()
            let userEmail = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
            let referenceUid = vm.detailDossier.referenceUid
            let dossierStatus = vm.detailDossier.dossierStatus
            let dossierSubStatus = vm.detailDossier.dossierSubStatus
            let templateNo = item.partNo
            let deliverableType = item.deliverableType ? item.deliverableType : ''

            let token = localStorage.getItem('jwt_token')

            let urlEmbed = eformScript.eformEmbed + '/' + item.templateFileNo + '/referenceUid/' +  referenceUid + '/' + token + '/' + encodeURIComponent(document.location.origin) +'?userId=' + userId + '&userEmail=' + userEmail + '&code=' + referenceUid + '&dossierStatus=' + dossierStatus + '&dossierSubStatus=' + dossierSubStatus + '&tp=' + templateNo
            console.log('urlEmbed', urlEmbed)
            setTimeout(function () {
              document.getElementById('formAlpaca' + item.partNo + vm.id + 'embed').src = ''
              setTimeout(function () {
                document.getElementById('formAlpaca' + item.partNo + vm.id + 'embed').src = urlEmbed
              }, 50)
              
            }, 300)
          } else {
            item.embed = false
            vm.active = false
            vm.active = true
            vm.$store.dispatch('loadFormData', item).then(resData => {
              window.$('#formAlpaca' + item.partNo + vm.id).empty()
              let formScript, formData
              /* eslint-disable */
              if (item.formScript) {
                formScript = eval('(' + item.formScript + ')')
              } else {
                formScript = {}
              }
              if (resData) {
                formData = eval('(' + resData + ')')
              } else {
                formData = {}
              }
              let hasFormDataFile = vm.dossierFilesItems.filter(function (itemFile) {
                return itemFile.dossierPartNo == item.partNo && itemFile.eForm && itemFile.formData
              })
              if (hasFormDataFile && hasFormDataFile.length > 0) {
                formData = eval('(' + hasFormDataFile[0]['formData'] + ')')
              }
              // giấy phép
              formData.dossierId_hidden = vm.detailDossier.dossierId
              formData.dossierStatus_hidden = vm.detailDossier.dossierStatus
              formData.dossierSubStatus_hidden = vm.detailDossier.dossierSubStatus
              formData.fileTemplateNo_hidden = item.templateFileNo
              formData.deliverableType_hidden = item.deliverableType
              formData.userEmailAddress_hidden = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
              formData.referenceUid = vm.detailDossier.referenceUid
              console.log('formDataMC', formData)
              /* eslint-disable */
              formScript.data = formData
              window.$('div[id="formAlpaca' + item.partNo + vm.id + '"]').alpaca(formScript)
            })
          }
          // 
        } else {
          vm.$store.dispatch('loadFormScriptKQ', item).then(resScript => {
            try {
              eformScript = eval('(' + resScript + ')')
            } catch (error) {
            }
            /* eslint-disable */
            if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
              console.log('eformEmbed2', item)
              item.embed = true
              vm.active = false
              vm.active = true
              let userId = window.themeDisplay.getUserId()
              let userEmail = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
              let referenceUid = vm.detailDossier.referenceUid
              let dossierStatus = vm.detailDossier.dossierStatus
              let dossierSubStatus = vm.detailDossier.dossierSubStatus
              let templateNo = item.partNo
              let deliverableType = item.deliverableType ? item.deliverableType : ''

              let token = localStorage.getItem('jwt_token')

              let urlEmbed = eformScript.eformEmbed + '/' + item.templateFileNo + '/referenceUid/' +  referenceUid + '/' + token + '/' + encodeURIComponent(document.location.origin) +'?userId=' + userId + '&userEmail=' + userEmail + '&code=' + referenceUid + '&dossierStatus=' + dossierStatus + '&dossierSubStatus=' + dossierSubStatus + '&tp=' + templateNo
              console.log('urlEmbed', urlEmbed)
              setTimeout(function () {
                document.getElementById('formAlpaca' + item.partNo + vm.id + 'embed').src = urlEmbed
              }, 300)
            } else {
              item.embed = false
              vm.active = false
              vm.active = true
              vm.$store.dispatch('loadFormData', item).then(resData => {
                window.$('#formAlpaca' + item.partNo + vm.id).empty()
                let formScript, formData
                /* eslint-disable */
                formScript = eformScript
                if (resData) {
                  formData = eval('(' + resData + ')')
                } else {
                  formData = {}
                }
                let hasFormDataFile = vm.dossierFilesItems.filter(function (itemFile) {
                  return itemFile.dossierPartNo == item.partNo && itemFile.eForm && itemFile.formData
                })
                if (hasFormDataFile && hasFormDataFile.length > 0) {
                  formData = eval('(' + hasFormDataFile[0]['formData'] + ')')
                }
                // giấy phép
                formData.dossierId_hidden = vm.detailDossier.dossierId
                formData.dossierStatus_hidden = vm.detailDossier.dossierStatus
                formData.dossierSubStatus_hidden = vm.detailDossier.dossierSubStatus
                formData.fileTemplateNo_hidden = item.templateFileNo
                formData.deliverableType_hidden = item.deliverableType
                formData.userEmailAddress_hidden = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
                formData.referenceUid = vm.detailDossier.referenceUid
                console.log('formDataMC', formData)
                /* eslint-disable */
                formScript.data = formData
                window.$('div[id="formAlpaca' + item.partNo + vm.id + '"]').alpaca(formScript)
              })
            }
            // 
          })
        }
      },
      saveAlpacaForm (item, index) {
        let vm = this
        console.log('itemSave', item)
        var fileFind = vm.dossierFilesItems.find(itemFile => {
          // return itemFile.dossierPartNo === item.partNo && itemFile.eForm && itemFile.fileSize !== 0
          return itemFile.dossierPartNo === item.partNo && itemFile.eForm
        })
        if (fileFind) {
          vm.loadingApacal = true
          fileFind['dossierId'] = vm.detailDossier.dossierId
          fileFind['id'] = vm.id
          vm.$store.dispatch('putAlpacaForm', fileFind).then(resData => {
            vm.loadingApacal = false
            toastr.clear()
            toastr.success('Yêu cầu của bạn thực hiện thành công')
            vm.createFiles[index].daKhai = true
            // Đính kèm giấy tờ hồ sơ cùng nhóm
            // if (vm.dossierIntoGroup.length > 0) {
            //   vm.labelConfirm = 'Đính kèm giấy tờ này cho hồ sơ khác?'
            //   vm.dialogConfirm = true
            //   vm.filesAdd = [resData]
            // }
            vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(resFiles => {
              vm.dossierFilesItems = resFiles
              // 
              vm.createFileSigned('update')
              // 
            }).catch(reject => {
            })
            // 
            // vm.createFiles[index]['isSigned'] = false
            // vm.createFiles[index]['fileEntryId'] = ''
            // vm.createFiles[index]['pdfSigned'] = ''
            // let createFileSigned = {
            //   dossierId: vm.detailDossier['dossierId'],
            //   createFiles: vm.createFiles
            // }
            // vm.$store.commit('setCreateFileSigned', createFileSigned)
          }).catch(reject => {
            vm.loadingApacal = false
            // toastr.clear()
            // toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
        } else {
          vm.loadingApacal = true
          item['dossierId'] = vm.detailDossier.dossierId
          item['id'] = vm.id
          vm.$store.dispatch('postEform', item).then(resPostEform => {
            // Đính kèm giấy tờ hồ sơ cùng nhóm
            // if (vm.dossierIntoGroup.length > 0) {
            //   vm.labelConfirm = 'Đính kèm giấy tờ này cho hồ sơ khác?'
            //   vm.dialogConfirm = true
            //   vm.filesAdd = [resData]
            // }
            setTimeout(function () {
              vm.loadingApacal = false
              toastr.success('Yêu cầu của bạn thực hiện thành công')
              vm.createFiles[index].daKhai = true
            }, 3000)
            vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(resFiles => {
              vm.dossierFilesItems = resFiles
              // 
              vm.createFileSigned('update')
              // 
            }).catch(reject => {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
            // 
            // vm.createFiles[index]['isSigned'] = false
            // vm.createFiles[index]['fileEntryId'] = ''
            // vm.createFiles[index]['pdfSigned'] = ''
            // let createFileSigned = {
            //   dossierId: vm.detailDossier['dossierId'],
            //   createFiles: vm.createFiles
            // }
            // vm.$store.commit('setCreateFileSigned', createFileSigned)
          }).catch(reject => {
            vm.loadingApacal = false
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
        }
      },
      saveAlpacaFormCallBack (data) {
        let vm = this
        let dataOutPut = data.data ? data.data : ''
        // console.log('data_output eform', dataOutPut)
        if (dataOutPut.hasOwnProperty('tp') && dataOutPut.tp) {
          let fileFind = vm.dossierFilesItems.find(itemFile => {
            return itemFile.dossierPartNo === dataOutPut.tp && itemFile.eForm && itemFile.fileSize!==0
          })
          if (fileFind) {
            let index = vm.createFiles.findIndex(item => item.partNo === dataOutPut.tp)
            fileFind['dossierId'] = vm.detailDossier.dossierId
            vm.$store.dispatch('putAlpacaFormCallBack', fileFind).then(resData => {
              setTimeout(function () {
                toastr.clear()
                toastr.success('Thực hiện thành công')
                // gen lại sau cập nhật
                vm.createFiles[index].daKhai = true
                vm.showAlpacaJSFORM(vm.createFiles[index])
              }, 3000)
              vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(resFiles => {
                vm.dossierFilesItems = resFiles
              }).catch(reject => {
              })
            }).catch(reject => {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          } else {
            dataOutPut['dossierId'] = vm.detailDossier.dossierId
            console.log('item post', dataOutPut)
            vm.$store.dispatch('postEformCallBack', dataOutPut).then(resPostEform => {
              let index = vm.createFiles.findIndex(item => item.partNo === dataOutPut.tp)
              setTimeout(function () {
                toastr.clear()
                toastr.success('Thực hiện thành công')
                vm.createFiles[index].daKhai = true
                // gen lại sau cập nhật
                vm.createFiles[index].daKhai = true
                vm.showAlpacaJSFORM(vm.createFiles[index])
              }, 3000)
              vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(resFiles => {
                vm.dossierFilesItems = resFiles
              }).catch(reject => {
                toastr.clear()
                toastr.error('Yêu cầu của bạn thực hiện thất bại.')
              })
            }).catch(reject => {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          }
        }
      },
      pickFile (item) {
        var vm = this
        vm.stateAddFileOther = false
        document.getElementById('file' + item.partNo).value = ''
        document.getElementById('file' + item.partNo).click()
      },
      onUploadSingleFile (e, data, indexItem) {
        let vm = this
        vm.dossierTemplatesItemSelect = data
        vm.progressUploadPart = data.partNo
        data['dossierId'] = vm.detailDossier.dossierId
        data['dossierTemplateNo'] = vm.detailDossier.dossierTemplateNo
        if (!vm.thaoTacGop) {
          vm.$store.dispatch('uploadSingleFile', data).then(function (result) {
            vm.progressUploadPart = ''
            vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(result => {
              vm.dossierFilesItems = result
              vm.createFiles = vm.mergeDossierTemplateVsDossierFiles(vm.createFiles, vm.dossierFilesItems)
              console.log('createFiles', vm.createFiles)
              // 
              vm.createFileSigned()
              // 
            })
            // add hồ sơ cùng nhóm
            console.log('vm.dossierIntoGroup', vm.dossierIntoGroup)
            // Đính kèm giấy tờ hồ sơ cùng nhóm
            // if (vm.dossierIntoGroup.length > 0) {
            //   // vm.dialogSelectDosier = true
            //   vm.labelConfirm = 'Đính kèm giấy tờ này cho hồ sơ khác?'
            //   vm.dialogConfirm = true
            //   vm.filesAdd = result
            // }
          }).catch(function (xhr) {
            vm.progressUploadPart = ''
          })
        } else {
          vm.progressUploadPart = ''
          let files = $('input[id="file' + data.partNo + '"]')[0].files
          let countFiles = files.length
          if (files) {
            for (let index = 0; index < countFiles; index++) {
              let file = files[index]
              let fileName = file['name']
              if (file['name']) {
                fileName = file['name'].replace(/\%/g, '')
                fileName = fileName.replace(/\//g, '')
                fileName = fileName.replace(/\\/g, '')
              }
              if (data.partType === 3) {
                if (data['displayName']) {
                  fileName = data['displayName'].replace(/\%/g, '')
                  fileName = fileName.replace(/\//g, '')
                  fileName = fileName.replace(/\\/g, '')
                }
              }
              let fileCreate = {
                displayName: fileName,
                fileType: file.type,
                fileSize: file.size,
                isSync: false,
                file: file,
                dossierPartNo: data.partNo,
                dossierTemplateNo: data.dossierTemplateNo,
                fileTemplateNo: data.templateFileNo,
                formData: '',
                referenceUid: '',
                modifiedDate: vm.getCurentDateTime(),
                createDate: (new Date()).getTime()
              }
              vm.dossierFilesItems.push(fileCreate)
              console.log('dossierFilesItems', vm.dossierFilesItems)
              vm.createFiles[indexItem]['filesAttach'].push(fileCreate)
              console.log('createFilesAttachThaoTacGop', vm.createFiles)
            }
          }
        }
        
      },
      loadAlpcaForm (data) {
        var vm = this
        var fileFind = vm.dossierFilesItems.find(itemFile => {
          return itemFile.dossierPartNo === data.partNo && itemFile.eForm && itemFile.fileSize !== 0
        })
        if (fileFind) {
          fileFind['id'] = vm.id
          vm.$store.dispatch('loadAlpcaForm', fileFind)
        } else {
          vm.createFiles.forEach(val => {
            if (val.eForm && data.partNo === val.partNo) {
              val['templateNo'] = vm.detailDossier.dossierTemplateNo
              vm.showAlpacaJSFORM(val)
            }
          })
        }
      },
      loadAlpcaFormClick (data) {
        var vm = this
        console.log('data alpaca-111', data)
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
          if ($('#formAlpaca' + data.partNo + vm.id).height() > 200) {
            vm.pstEl = $('#wrapForm' + data.partNo + vm.id).offset().top
            vm.endEl = $('#formAlpaca' + data.partNo + vm.id).height()
            $(window).scroll(function () {
              vm.pstFixed = $(window).scrollTop()
            })
          }
        }, 300)
        //
        var fileFind = vm.dossierFilesItems.find(itemFile => {
          return itemFile.dossierPartNo === data.partNo && itemFile.eForm
        })

        vm.createFiles.forEach(val => {
          if (val.eForm && data.partNo === val.partNo) {
            val['templateNo'] = vm.detailDossier.dossierTemplateNo
            vm.showAlpacaJSFORM(val)
          }
        })   
      },
      editFormAlpaca (item, index) {
        var vm = this
        vm.createFiles[index].editForm = true
        window.scrollBy(0, 10)
        vm.active = false
        vm.active = true

        let fileFind = vm.dossierFilesItems.find(itemFile => {
          return itemFile.dossierPartNo === item.partNo && itemFile.eForm
        })
        /* eslint-disable */
        let eformScript = ''
        try {
          eformScript = eval('(' + fileFind.formScript + ')')
        } catch (error) {
        }
        /* eslint-disable */
        if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
          console.log('eformEmbed3', item)
          vm.createFiles[index].embed = true
          let userId = window.themeDisplay.getUserId()
          let userEmail = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
          let referenceUid = vm.detailDossier.referenceUid
          let dossierStatus = vm.detailDossier.dossierStatus
          let dossierSubStatus = vm.detailDossier.dossierSubStatus
          let templateNo = item.partNo
          let deliverableType = item.deliverableType ? item.deliverableType : ''

          let token = localStorage.getItem('jwt_token')

          let urlEmbed = eformScript.eformEmbed + '/' + item.templateFileNo + '/referenceUid/' +  referenceUid + '/' + token + '/' + encodeURIComponent(document.location.origin) +'?userId=' + userId + '&userEmail=' + userEmail + '&code=' + referenceUid + '&dossierStatus=' + dossierStatus + '&dossierSubStatus=' + dossierSubStatus + '&tp=' + templateNo

          setTimeout(function () {
            document.getElementById('formAlpaca' + item.partNo + vm.id + 'embed').src = urlEmbed
          }, 500)
        } else {
          vm.createFiles[index].embed = false
          setTimeout (function () {
            let fileFind = vm.dossierFilesItems.find(itemFile => {
              return itemFile.dossierPartNo === item.partNo && itemFile.eForm
            })
            fileFind['id'] = vm.id
            vm.$store.dispatch('loadAlpcaForm', fileFind)
          }, 200)
        }
      },
      previewFormAlpaca (item, index) {
        var vm = this
        vm.createFiles[index]['editForm'] = false
        window.scrollBy(0, 10)
        vm.active = false
        vm.active = true
        // 
        let indexFile = ''
        for (let i = 0; i < vm.dossierFilesItems.length; i++) {
          if (vm.dossierFilesItems[i]['dossierPartNo'] === item['partNo'] && vm.dossierFilesItems[i]['eForm']) {
            indexFile = i
            break
          }
        }
        // 
        if (!vm.dossierFilesItems[indexFile]['isSigned']) {
          vm.dossierFilesItems.forEach(file => {
            if (file.dossierPartNo === item.partNo && file.eForm && !file.removed) {
              file['dossierId'] = vm.detailDossier.dossierId
              if (!vm.onlyView) {
                //
                let eformScript = eval('(' + file.formScript + ')')
                console.log('eformScript preview', eformScript)
                if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
                  item['editForm'] = false
                  setTimeout(function () {
                    vm.$store.dispatch('viewFile', file).then(result => {
                      document.getElementById('displayPDF' + file.dossierPartNo + vm.id).src = result
                    })
                  }, 500)
                } else {
                  file['id'] = vm.id
                  vm.$store.dispatch('putAlpacaForm', file).then(resData => {
                    item['editForm'] = false
                    setTimeout(function () {
                      vm.$store.dispatch('viewFile', file).then(result => {
                        document.getElementById('displayPDF' + file.dossierPartNo + vm.id).src = result
                      })
                    }, 200)
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
                  setTimeout(function () {
                    document.getElementById('displayPDF' + item.partNo + vm.id).src = result
                  }, 200)
                })
              }
            }
          })
        } else {
          setTimeout(function () {
            document.getElementById('displayPDF' + item.partNo + vm.id).src = vm.dossierFilesItems[indexFile].pdfSigned
          }, 200)
        }
      },
      deleteSingleFileEform (item, index) {
        var vm = this
        let x = confirm('Bạn có muốn xóa?')
        if (x) {
          vm.dossierFilesItems.forEach(file => {
            if (file.dossierPartNo === item.partNo && file.eForm) {
              file['dossierId'] = vm.detailDossier.dossierId
              vm.$store.dispatch('deleteDossierFile', file).then(resFile => {
                vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(result => {
                  vm.dossierFilesItems = result
                  // 
                  vm.createFileSigned('update')
                  // 
                  item['editForm'] = true
                  var fileViewsTemp = vm.dossierFilesItems.filter(file => {
                    return file.dossierPartNo === item.partNo && !file.eForm
                  })
                  if (fileViewsTemp) {
                    vm.fileViews = fileViewsTemp
                  }
                  // 
                  let eformScript = ''
                  console.log('item1234', item, index)
                  item.templateNo = vm.detailDossier.dossierTemplateNo
                  vm.$store.dispatch('loadFormScriptKQ', item).then(resScript => {
                    try {
                      eformScript = eval('(' + resScript + ')')
                    } catch (error) {
                    }
                    /* eslint-disable */
                    if (eformScript && eformScript.hasOwnProperty('eformEmbed') && eformScript.eformEmbed) {
                      item.embed = true
                      vm.active = false
                      vm.active = true
                      let userId = window.themeDisplay.getUserId()
                      let userEmail = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
                      let referenceUid = vm.detailDossier.referenceUid
                      let dossierStatus = vm.detailDossier.dossierStatus
                      let dossierSubStatus = vm.detailDossier.dossierSubStatus
                      let templateNo = item.partNo
                      let deliverableType = item.deliverableType ? item.deliverableType : ''

                      let urlEmbed = eformScript.eformEmbed + '/' + item.templateFileNo + '___' + deliverableType + '?userId=' + userId + '&userEmail=' + userEmail + '&code=' + referenceUid + '&dossierStatus=' + dossierStatus + '&dossierSubStatus=' + dossierSubStatus + '&tp=' + templateNo
                      console.log('urlEmbed', urlEmbed)
                      setTimeout(function () {
                        document.getElementById('formAlpaca' + item.partNo + vm.id + 'embed').src = urlEmbed
                      }, 300)
                    } else {
                      item.embed = false
                      vm.active = false
                      vm.active = true
                      vm.$store.dispatch('loadFormData', item).then(resData => {
                        window.$('#formAlpaca' + item.partNo + vm.id).empty()
                        let formScript, formData
                        /* eslint-disable */
                        if (item.formScript) {
                          formScript = eval('(' + item.formScript + ')')
                        } else {
                          formScript = {}
                        }
                        if (resData) {
                          formData = eval('(' + resData + ')')
                        } else {
                          formData = {}
                        }
                        let hasFormDataFile = vm.dossierFilesItems.filter(function (item) {
                          return itemFile.dossierPartNo == item.partNo && itemFile.eForm && itemFile.formData
                        })
                        if (hasFormDataFile && hasFormDataFile.length > 0) {
                          formData = eval('(' + hasFormDataFile[0]['formData'] + ')')
                        }
                        // giấy phép
                        formData.dossierId_hidden = vm.detailDossier.dossierId
                        formData.dossierStatus_hidden = vm.detailDossier.dossierStatus
                        formData.dossierSubStatus_hidden = vm.detailDossier.dossierSubStatus
                        formData.fileTemplateNo_hidden = item.templateFileNo
                        formData.deliverableType_hidden = item.deliverableType
                        formData.userEmailAddress_hidden = vm.originality === 1 ? vm.userLoginInfomation.applicantContactEmail : vm.userLoginInfomation.employeeEmail
                        formData.referenceUid = vm.detailDossier.referenceUid
                        console.log('formDataMC', formData)
                        /* eslint-disable */
                        formScript.data = formData
                        window.$('div[id="formAlpaca' + item.partNo + vm.id + '"]').alpaca(formScript)
                      })
                    }
                    // 
                  })
                  // 
                })
                // 
              })
            }
          })
          vm.createFiles[index].daKhai = false
        }
      },
      previewFileEfom (item, index) {
        var vm = this
        vm.dossierFilesItems.forEach(file => {
          if (file.dossierPartNo === item.partNo && file.eForm) {
            file['dossierId'] = vm.detailDossier.dossierId
            vm.dialogPDFLoading = true
            vm.documentType = 'Tài liệu khai trực tuyến'
            vm.dialogPDF = true
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
          }
        })
      },
      showConfigSignService () {
        vgca_show_config()
      },
      viewFileKySo (item, index) {},
      signAction (item, index, partNo) {
        let vm = this
        console.log('file ký duyệt', item)
        if (item['eForm'] && item['daKhai'] || !item['eForm']) {
          let signFileCallBack = function (rv) {
            let received_msg = JSON.parse(rv)
            if (received_msg.Status === 0) {
              let dataSigned
              try {
                dataSigned = JSON.parse(received_msg.FileServer)
              } catch (error) {
              }
              console.log('dataSigned', dataSigned)
              toastr.clear()
              toastr.success('Tài liệu đã được ký duyệt')
              if (!partNo) {
                vm.dossierFilesItems[index].isSigned = true
                vm.dossierFilesItems[index].pdfSigned = dataSigned ? dataSigned.url : ''
                vm.dossierFilesItems[index].fileEntryId = dataSigned ? dataSigned.fileEntryId : ''
              } else {
                let indexFile = ''
                for (let i = 0; i < vm.dossierFilesItems.length; i++) {
                  if (vm.dossierFilesItems[i]['dossierPartNo'] === partNo && vm.dossierFilesItems[i]['eForm']) {
                    indexFile = i
                    break
                  }
                }
                vm.dossierFilesItems[indexFile].isSigned = true
                vm.dossierFilesItems[indexFile].pdfSigned = dataSigned ? dataSigned.url : ''
                vm.dossierFilesItems[indexFile].fileEntryId = dataSigned ? dataSigned.fileEntryId : ''
                // 
                if (vm.createFiles[index]['editForm']) {
                  vm.createFiles[index]['editForm'] = false
                  setTimeout(function () {
                    document.getElementById('displayPDF' + partNo + vm.id).src = dataSigned.url
                  }, 200)
                } else {
                  setTimeout(function () {
                    document.getElementById('displayPDF' + partNo + vm.id).src = dataSigned.url
                  }, 200)
                }
                // 
                console.log('indexFile', vm.dossierFilesItems)
              }
              // lọc file gán với createFiles
              let createFileItems = []
              if (vm.dossierFilesItems.length > 0) {
                for (let i = 0; i < vm.dossierFilesItems.length; i++) {
                  let hasCreate = vm.createFiles.filter(function (item) {
                    return String(item.partNo) === String(vm.dossierFilesItems[i]['dossierPartNo'])
                  })
                  if (hasCreate && hasCreate.length > 0) {
                    createFileItems.push(vm.dossierFilesItems[i])
                  }
                }
              }
              
              // 
              let createFileSigned = {
                dossierId: vm.detailDossier['dossierId'],
                createFiles: createFileItems
              }
              vm.$store.commit('setCreateFileSigned', createFileSigned)
            } else {
              if (received_msg.Message) {
                toastr.clear()
                toastr.error(received_msg.Message)
              } else {
                toastr.clear()
                toastr.error('Ký duyệt không thành công')
              }
            }
          }
          let prms = {}
          prms['FileUploadHandler'] = window.themeDisplay.getPortalURL() + '/o/rest/v2/vgca/fileupload'
          prms['SessionId'] = ''
          prms['FileName'] = window.themeDisplay.getPortalURL() + '/o/rest/v2/dossiers/' + vm.detailDossier['dossierId'] + '/files/' + item['referenceUid'] + '/preview.pdf'

          let json_prms = JSON.stringify(prms)
          vgca_sign_approved(json_prms, signFileCallBack)
        } else {
          toastr.clear()
          toastr.error('Chưa có tài liệu ký duyệt')
        }
      },
      deleteSingleFile (item, index, indexPart) {
        var vm = this
        let x = confirm('Bạn có muốn xóa?')
        if (x) {
          if (!vm.thaoTacGop) {
            item['dossierId'] = vm.detailDossier.dossierId
            vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
              vm.fileViews.splice(index, 1)
              vm.partView = item.dossierPartNo
              vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(result => {
                vm.dossierFilesItems = result
                // 
                vm.createFileSigned()
                // 
                vm.createFiles = vm.mergeDossierTemplateVsDossierFiles(vm.createFiles, vm.dossierFilesItems)
              })
            }).catch(reject => {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          } else {
            vm.dossierFilesItems = vm.dossierFilesItems.filter(function (x) {
              return x.createDate !== item.createDate
            })
            vm.createFiles[indexPart]['filesAttach'] = vm.createFiles[indexPart]['filesAttach'].filter(function (x) {
              return x.createDate !== item.createDate
            })
            console.log('createFilesAttachThaoTacGop123', vm.createFiles)
          }
        }
      },
      viewFile (data) {
        var vm = this
        vm.dossierFilesItems.forEach(val => {
          val['dossierId'] = vm.detailDossier.dossierId
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
      viewFile2 (data, index) {
        var vm = this
        console.log('fileView', vm.dossierFilesItems[index])
        if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar' || data.fileType === 'txt') {
          var url = vm.initDataResource.dossierApi + '/' + vm.detailDossier.dossierId + '/files/' + data.referenceUid
          window.location.assign(url)
        } else {
          vm.dialogPDFLoading = true
          vm.documentType = 'Tài liệu đính kèm'
          vm.dialogPDF = true
          data['dossierId'] = vm.detailDossier.dossierId
          if (vm.esignType === 'plugin' && vm.dossierFilesItems[index]['isSigned']) {
            vm.dialogPDFLoading = false
            document.getElementById('dialogPDFPreview' + vm.id).src = vm.dossierFilesItems[index]['pdfSigned']
          } else {
            vm.$store.dispatch('viewFile', data).then(result => {
              vm.dialogPDFLoading = false
              document.getElementById('dialogPDFPreview' + vm.id).src = result
            })
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
      checkStyle (item) {
        return 'calc(100% - ' + 140 + 'px)'
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
      changeDisplayName (item, index) {
        var vm = this
        let params = {
          dossierId: vm.detailDossier.dossierId,
          value: value
        }
        vm.$store.dispatch('changeDisplayNameFile', params).then(result => {
          vm.fileViews[index].displayName = result.displayName
          vm.stateEdit = false
        }).catch(reject => {
          console.log('error')
        })
      },
      validCreateFileTemplate () {
        var vm = this
        if (vm.createFiles.length > 0) {
          for (var i = 0; i < vm.createFiles.length; i++) {
            let hasFileEform = vm.dossierFilesItems.filter(function (item) {
              return item.dossierPartNo === vm.createFiles[i].partNo && item.eForm && (item.fileSize !== 0 || (item.fileSize === 0 && item.modifiedDate != item.createDate))
            }).length
            let hasFileAttach = vm.dossierFilesItems.filter(function (item) {
              return item.dossierPartNo === vm.createFiles[i].partNo && !item.eForm
            }).length
            if (vm.createFiles[i]['required'] && vm.createFiles[i]['eForm'] && hasFileEform === 0) {
              let message = 'Thông tin ' + vm.createFiles[i].partName + ' chưa được lưu!'
              toastr.error(message)
              return false
            }
            if (vm.createFiles[i]['required'] && vm.createFiles[i]['eForm'] && hasFileAttach === 0) {
              let message = vm.createFiles[i].partName + ' chưa có tài liệu đính kèm!'
              toastr.error(message)
              return false
            }
            if (vm.createFiles[i]['required'] && !vm.createFiles[i]['eForm'] && hasFileAttach === 0) {
              let message = vm.createFiles[i].partName + ' chưa có tài liệu đính kèm!'
              toastr.error(message)
              return false
            }
          }
          return true
        } else {
          return true
        }
      },
      getDossierIntoGroup (dossierIdGroup) {
        let vm = this
        let filter = {
          groupDossierId: dossierIdGroup
        }
        vm.dossierIntoGroup = []
        vm.$store.dispatch('getDossiersIntoGroup', filter).then(function (result) {
          vm.dossierIntoGroup = result
          vm.dossierIntoGroup = vm.dossierIntoGroup.filter(function(item) {
            return (String(item['stepCode']) === String(vm.detailDossier['stepCode'])
              && String(item['dossierId']) !== String(vm.detailDossier['dossierId'])
            )
          })
        })
      },
      checkIsSigned (dossierFileId) {
        let vm = this
        if (vm.createFileSignedSync) {
          let file = vm.createFileSignedSync['createFiles'].filter(function(item) {
            return item.dossierFileId === dossierFileId
          })
          if (file.length > 0) {
            return file[0]
          } else {return false}
        } else {
          return false
        }
      },
      createFileSigned (type) {
        let vm = this
        vm.dossierFilesItems.forEach((template, index) => {
          if (vm.createFileSignedSync && vm.detailDossier['dossierId'] === vm.createFileSignedSync['dossierId']) {
            let file = vm.checkIsSigned(template['dossierFileId'])
            if (file && type !== 'update') {
              vm.dossierFilesItems[index]['isSigned'] = file['isSigned']
              vm.dossierFilesItems[index]['fileEntryId'] = file['fileEntryId']
              vm.dossierFilesItems[index]['pdfSigned'] = file['pdfSigned']
            } else {
              vm.dossierFilesItems[index]['isSigned'] = false
              vm.dossierFilesItems[index]['fileEntryId'] = ''
              vm.dossierFilesItems[index]['pdfSigned'] = ''
            }
          } else {
            vm.dossierFilesItems[index]['isSigned'] = false
            vm.dossierFilesItems[index]['fileEntryId'] = ''
            vm.dossierFilesItems[index]['pdfSigned'] = ''
          }
        })
        // lọc file gán với createFiles
          let createFileItems = []
          if (vm.dossierFilesItems.length > 0) {
            for (let i = 0; i < vm.dossierFilesItems.length; i++) {
              let hasCreate = vm.createFiles.filter(function (item) {
                return String(item.partNo) === String(vm.dossierFilesItems[i]['dossierPartNo'])
              })
              if (hasCreate && hasCreate.length > 0) {
                createFileItems.push(vm.dossierFilesItems[i])
              }
            }
          }
          
        // 
        let createFileSigned = {
          dossierId: vm.detailDossier['dossierId'],
          createFiles: createFileItems
        }
        console.log('fileSignedSync', createFileSigned)
        vm.$store.commit('setCreateFileSigned', createFileSigned)
      },
      addFileToDossier () {
        let vm = this
        // add file cho thành phần hồ sơ con
        let dossierIds = vm.dossierIntoGroupSelect.map(obj =>{
          return obj.dossierId
        }).toString()
        let dossierFileIds = vm.filesAdd.map(obj =>{
          return obj.dossierFileId
        }).toString()
        let filterCopyFile = {
          dossierIds: dossierIds,
          dossierFileId: dossierFileIds
        }
        vm.$store.dispatch('uploadFileDossierGroup', filterCopyFile).then(function (result) {
          toastr.success('Đính kèm tài liệu thành công')
          vm.dialogSelectDosier = false
          vm.filesAdd = []
          vm.$store.commit('setSelectDossierGroup', [])
        })
      },
      attachOtherDossier (files) {
        let vm = this
        vm.filesAdd = [files]
        vm.dialogSelectDosier = true
      },
      cancelAddFile () {
        let vm = this
        vm.dialogSelectDosier = false
        vm.filesAdd = []
        vm.$store.commit('setSelectDossierGroup', [])
      },
      confirmAction (type) {
        let vm = this
        vm.dialogConfirm = false
        vm.dialogSelectDosier = true
      },
      getCreateFileAttach () {
        let vm = this
        return vm.createFiles
      },
      getCurentDateTime () {
        let date = new Date()
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
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
          return {
            icon: 'attach_file',
            color: 'primary',
            size: 14
          }
        }
      }
    }
  }
</script>
