<template>
  <div class="taotailieuketqua" style="background-color: white;width:100%">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div> Tài liệu kết quả
        </div>
        <v-card>
          <div class="form_alpaca" style="position: relative;" v-for="(item, index) in createFiles" v-bind:key="item.partNo + 'cr'">
            <v-expansion-panel class="expaned__list__data">
              <v-expansion-panel-content hide-actions :value="false">
                <div slot="header" @click="stateView = false" style="background-color:#fff">
                  <div style="align-items: center;background: #fff; padding-left: 25px;" :style="{width: checkStyle(item)}">
                    <!-- <div class="mr-2" @click="loadAlpcaForm(item)" style="min-width: 18px; display: flex;">
                      <div class="header__tphs"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                      <div class="header__tphs">
                        {{item.partName}} <span v-if="item.required" style="color: red"> (*)</span>
                        &nbsp;&nbsp;
                        <v-tooltip top v-if="item.eForm">
                          <i slot="activator" style="color: #0d71bb; font-size: 13px;" class="fa fa-file-text-o" aria-hidden="true"></i>
                          <span>Biểu mẫu trực tuyến</span>
                        </v-tooltip>
                      </div>
                    </div> -->
                    <div v-for="(itemFileView, index) in dossierFilesItems" :key="index + 'cr'" v-if="item.partNo + id === itemFileView.dossierPartNo + id">
                      <div style="width: calc(100% - 370px);display: flex;align-items: center;background: #fff;padding-left: 25px; font-size: 12px;">
                        <span class="text-bold">{{index + 1}}. </span>
                        <span v-on:click.stop="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;">
                          <v-icon v-if="itemFileView.eForm">border_color</v-icon>
                          <v-icon v-else>attach_file</v-icon>
                          {{itemFileView.displayName}} - 
                          <i>{{itemFileView.modifiedDate}}</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <v-card v-if="item.eForm">
                  <v-card-text style="background-color: rgba(244, 247, 213, 0.19);">
                    <v-layout wrap>
                      <v-flex xs12 class="text-xs-right">
                        <v-btn color="primary" @click="previewFileEfom(item, index)" v-if="item.daKhai && item.eForm">In</v-btn>
                        <div :id="'formAlpaca' + item.partNo + id">
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
        </v-card>
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
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
  // import $ from 'jquery'
  import toastr from 'toastr'
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
      fileTemplateItems: []
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
    created () {
      var vm = this
      vm.page = 1
      vm.$nextTick(function () {
        console.log('vm.detailDossier------------', vm.detailDossier)
        if (vm.detailDossier['dossierId']) {
          vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(resFiles => {
            vm.dossierFilesItems = resFiles
            vm.createFiles = vm.mergeDossierTemplateVsDossierFiles(vm.createFiles, resFiles)
            console.log('vm.createFiles------------', vm.createFiles)
            console.log('vm.dossierFilesItems------------', vm.dossierFilesItems)
          }).catch(reject => {
          })
        }
      })
    },
    mounted () {
      var vm = this
      vm.$nextTick(function () {
        if (vm.createFiles.length > 0) {
          setTimeout(function () {
            console.log('vm.createFiles------------', vm.createFiles)
            console.log('vm.dossierFilesItems------------', vm.dossierFilesItems)
            vm.genAllAlpacaForm(vm.dossierFilesItems, vm.createFiles)
          }, 300)
        }
      })
    },
    methods: {
      genAllAlpacaForm (dossierFiles, createFiles) {
        var vm = this
        if (dossierFiles.length > 0) {
          var dossierFilesEform = dossierFiles.filter(file => {
            return file.eForm
          })
          var dossierTemplatesHasForm = createFiles.filter(template => {
            return template.eForm
          })
          if (dossierFilesEform.length > 0) {
            dossierFilesEform.forEach(itemFiles => {
              if (itemFiles.eForm) {
                vm.$store.dispatch('loadAlpcaForm', itemFiles)
              }
            })
          } else {
            createFiles.forEach(val => {
              if (val.eForm) {
                val['templateFileNo'] = vm.detailDossier.dossierTemplateNo
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
                template['templateFileNo'] = vm.detailDossier.dossierTemplateNo
                vm.showAlpacaJSFORM(template)
              }
            })
          }
        } else {
          createFiles.forEach(val => {
            if (val.eForm) {
              val['templateFileNo'] = vm.detailDossier.dossierTemplateNo
              vm.showAlpacaJSFORM(val)
            }
          })
        }
      },
      mergeDossierTemplateVsDossierFiles (createFiles, dossierFiles) {
        var vm = this
        if (dossierFiles.length !== 0) {
          createFiles.forEach(template => {
            var itemFind = dossierFiles.find(file => {
              return template.partNo === file.dossierPartNo && file.eForm
            })
            if (itemFind) {
              template['daKhai'] = true
            } else if (!itemFind && template.eForm) {
              template['daKhai'] = false
            }
          })
        } else {
          createFiles.forEach(template => {
            if (template.eForm) {
              template['daKhai'] = false
            }
          })
        }
        return createFiles
      },
      showAlpacaJSFORM (item) {
        var vm = this
        item['dossierId'] = vm.detailDossier.dossierId
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
      loadAlpcaForm (data) {
        var vm = this
        var fileFind = vm.dossierFilesItems.find(itemFile => {
          return itemFile.dossierPartNo === data.partNo && itemFile.eForm
        })
        if (fileFind) {
          fileFind['id'] = vm.id
          vm.$store.dispatch('loadAlpcaForm', fileFind)
        } else {
          vm.createFiles.forEach(val => {
            if (val.eForm && data.partNo === val.partNo) {
              val['templateFileNo'] = vm.detailDossier.dossierTemplateNo
              vm.showAlpacaJSFORM(val)
            }
          })
        }
      },
      previewFileEfom (item, index) {
        var vm = this
        vm.dossierFilesItems.forEach(file => {
          if (file.dossierPartNo === item.partNo && file.eForm) {
            file['dossierId'] = vm.detailDossier.dossierId
            vm.dialogPDFLoading = true
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
              toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
            })
          }
        })
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
      viewFile2 (data) {
        var vm = this
        if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar' || data.fileType === 'txt') {
          var url = vm.initDataResource.dossierApi + '/' + vm.detailDossier.dossierId + '/files/' + data.referenceUid
          window.open(url)
        } else {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
          data['dossierId'] = vm.detailDossier.dossierId
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
        return 'calc(100% - ' + 50 + 'px)'
      },
      downloadFileTemplate (item, index) {
        var vm = this
        if (vm.fileTemplateItems.length > 0) {
          let fileFind = vm.fileTemplateItems.find(file => {
            return item.fileTemplateNo === file.fileTemplateNo
          })
          if (fileFind) {
            let url = vm.initDataResource.serviceInfoApi + '/' + fileFind.serviceCode + '/filetemplates/' + fileFind.fileTemplateNo
            window.open(url)
          } else {
            console.log('ko thay file')
          }
        }
      }
    }
  }
</script>
