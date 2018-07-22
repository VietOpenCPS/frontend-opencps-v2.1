<template>
  <div>
    <v-card>
      <div class="form_alpaca" style="position: relative;" v-for="(item, index) in dossierTemplateItems" v-if="item.partType === 1" v-bind:key="item.partNo">
        <v-expansion-panel class="expaned__list__data" :class='{"no_acction__event": !item.hasForm}'>
          <v-expansion-panel-content hide-actions :value="false">
            <div slot="header" @click="stateView = false">
              <div style="width: calc(100% - 370px);display: flex;align-items: center;min-height: 38px;background: #fff;padding-left: 15px;">
                <span class="text-bold mr-2">{{index + 1}}.</span>
                <span @click="loadAlpcaForm(item)">{{item.partName}} <span v-if="item.required" style="color: red"> (*)</span> <i v-if="item.hasForm" style="font-size: 10px;color: #0d71bb;">(Form trực tuyến)</i> <i v-if="item.hasForm" style="font-size: 10px;color: #0d71bb;">({{item.daKhai ? 'Đã khai' : 'Chưa khai '}})</i></span>
              </div>
            </div>
            <v-card>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-right" v-if="!stateView">
                    <v-btn color="primary" @click="saveAlpacaForm(item, index)" v-if="item.hasForm">Lưu lại</v-btn>
                    <v-btn color="primary" @click="deleteSingleFileEform(item, index)" v-if="item.daKhai && item.hasForm">Xóa</v-btn>
                    <div :id="'formAlpaca' + item.partNo">
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div class="absolute__btn group__thanh_phan">
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-layout row wrap class="flex__checkbox" v-else>
            <v-flex style="width: 260px;" class="layout wrap">
              <!-- <v-checkbox light color="secondary" class="flex" v-model="dossierTemplateItems[index].fileType" :value="1"></v-checkbox>
              <v-checkbox light color="secondary" class="flex" v-model="dossierTemplateItems[index].fileType" :value="2"></v-checkbox>
              <v-checkbox light color="secondary" class="flex" v-model="dossierTemplateItems[index].fileType" :value="3"></v-checkbox> -->
              <v-radio-group v-model="dossierTemplateItems[index].fileMark" @change="postDossierMark(item, index)" row>
                <v-radio :value="0"></v-radio>
                <v-radio :value="1"></v-radio>
                <v-radio :value="2"></v-radio>
                <v-radio :value="3"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex style="width: 110px;background: #fff;" class="text-xs-center">
              <v-tooltip top>
                <v-btn slot="activator" icon class="mx-0 my-0">
                  <v-badge>
                    <input
                    type="file"
                    style="display: none"
                    :id="'file' + item.partNo"
                    @change="onUploadSingleFile($event,item)"
                    >
                    <v-icon size="16" color="primary" @click="pickFile(item)">attach_file</v-icon>
                  </v-badge>
                </v-btn>
                <span>Tải file lên</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" class="mx-0" fab dark small color="primary" @click="viewFileWithPartNo(item)" style="height:20px;width:20px">
                  {{item.count}}
                </v-btn>
                <span>Xem</span>
              </v-tooltip>
              <!-- <v-tooltip top>
                <v-btn slot="activator" @click="onDeleteAttackFiles(item)" icon class="mx-0 my-0">
                  <v-icon size="16" class="mx-0" color="red darken-3">delete</v-icon>
                </v-btn>
                <span>Xóa</span>
              </v-tooltip> -->
            </v-flex>
          </v-layout>
        </div>
        <div v-if="item.partNo === partView && stateView">
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <div v-for="(itemFileView, index) in fileViews">
                <div style="width: calc(100% - 370px);display: flex;align-items: center;min-height: 38px;background: #fff;padding-left: 15px;">
                  <!-- <span class="text-bold mr-2">{{index + 1}}.</span> -->
                  <span @click="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;">{{itemFileView.displayName}}</span>
                  <v-btn icon ripple @click="deleteSingleFile(itemFileView, index)">
                    <v-icon style="color: red">delete_outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-subheader style="float: left;">Thêm giấy tờ khác</v-subheader>
        </v-flex>
        <v-flex xs12 sm6 class="text-xs-right">
          <v-btn color="primary" @click="dialogAddOtherTemp = true">
            <v-icon>add</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-dialog v-model="dialogAddOtherTemp" max-width="400" transition="fade-transition" persistent>
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title class="headline">Thêm thành phần hồ sơ</v-card-title>
            <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogAddOtherTemp = false">
              <v-icon>clear</v-icon>
            </v-btn>
            <v-progress-linear v-if="loadingAddOther" class="my-0" :indeterminate="true"></v-progress-linear>
            <v-card-text class="pb-0 pt-4">
              <v-layout wrap>
                <v-flex xs12 class="px-2 pb-3">
                  <v-text-field
                  label="Tên thành phần:"
                  v-model="otherDossierTemplate"
                  @change = "changeOtherDossierTemp"
                  :rules="[v => !!v || 'Bạn phải điền tên thành phần.']"
                  required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-3" flat="flat" @click.native="dialogAddOtherTemp = false">
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

        <v-layout row wrap>
          <v-flex xs12 sm8>
            <v-bottom-sheet v-model="sheet">
              <v-list>
                <v-subheader>Danh sách file</v-subheader>
                <v-list-tile
                v-for="(item, index) in fileViews"
                :key="item.dossierFileId">
                <v-list-tile-avatar>
                </v-list-tile-avatar>
                <v-list-tile-title>
                  <span @click="viewFile2(item)" style="cursor: pointer; font-weight: bold">{{ item.displayName }}</span>
                </v-list-tile-title>
                <v-list-tile-action>
                  <v-btn icon ripple @click="deleteSingleFile(item, index)">
                    <v-icon style="color: red">delete_outline</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-bottom-sheet>
        </v-flex>
        <v-flex xs12 sm4>
        </v-flex>
      </v-layout>

      <div class="other_dossiertemplate" style="position: relative;" v-for="(item, index) in dossierTemplateItems" v-if="item.partType === 3" v-bind:key="item.partNo">
        <v-expansion-panel class="no_acction__event expaned__list__data">
          <v-expansion-panel-content hide-actions :value="false">
            <div slot="header" @click="stateView = false">
              <div style="width: calc(100% - 370px);display: flex;align-items: center;min-height: 38px;background: #fff;padding-left: 15px;">
                <span class="text-bold mr-2">{{index + 1}}.</span>
                <span>{{item.partName}}</span>
              </div>
            </div>
            <v-card>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-right">
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div class="absolute__btn group__thanh_phan">
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-layout row wrap class="flex__checkbox" v-else>
            <v-flex style="width: 260px;" class="layout wrap">
              <v-radio-group v-model="dossierTemplateItems[index].fileMark" @change="postDossierMark(item, index)" row>
                <v-radio :value="0"></v-radio>
                <v-radio :value="1"></v-radio>
                <v-radio :value="2"></v-radio>
                <v-radio :value="3"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex style="width: 110px;background: #fff;">
              <v-tooltip top>
                <v-btn slot="activator" icon class="mx-0 my-0">
                  <v-badge>
                    <input
                    type="file"
                    style="display: none"
                    :id="'file' + item.partNo"
                    @change="onUploadSingleFile($event,item)"
                    >
                    <v-icon size="16" color="primary" @click="pickFile(item)">attach_file</v-icon>
                  </v-badge>
                </v-btn>
                <span>Tải file lên</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" class="mx-0" fab dark small color="primary" @click="viewFileWithPartNo(item)" style="height:20px;width:20px">
                  {{item.count}}
                </v-btn>
                <span>Xem</span>
              </v-tooltip>
              <!-- <v-tooltip top>
                <v-btn slot="activator" @click="onDeleteSingleFiles(item)" icon class="mx-0 my-0">
                  <v-icon size="16" class="mx-0" style="color: red">delete</v-icon>
                </v-btn>
                <span>Xóa</span>
              </v-tooltip> -->
            </v-flex>
          </v-layout>
        </div>
        <div v-if="item.partNo === partView && stateView && item.partType === 3">
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <div v-for="(itemFileView, index) in fileViews">
                <div style="width: calc(100% - 370px);display: flex;align-items: center;min-height: 38px;background: #fff;padding-left: 15px;">
                  <!-- <span class="text-bold mr-2">{{index + 1}}.</span> -->
                  <span @click="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;">{{itemFileView.displayName}}</span>
                  <v-btn icon ripple @click="deleteSingleFile(itemFileView, index)">
                    <v-icon style="color: red">delete_outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <!-- <v-card-text class="note_trichyeu">
        <v-layout wrap>
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0 text-right">Trích yếu: </v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-text-field
              v-else
              v-model="thongTinHoSo.applicantNote"
              multi-line
              rows="2"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-text> -->
    </v-card>
    <!--  <i><span style="color: red">(*)</span> Những thành phần bắt buộc</i> -->
    <div class="absolute-lable" style="font-size: 12px">
      <span>Không chọn</span>
      <span>Bản chính</span>
      <span>Bản chụp</span>
      <span>Công chứng</span>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
// import * as utils from '../store/onegate_utils'
import toastr from 'toastr'
export default {
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
    fileViews: [{
      dossierFileId: 12121,
      displayName: 'THanh phan 1'
    }, {
      dossierFileId: 12122,
      displayName: 'THanh phan 2'
    }]
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  mounted () {
    var vm = this
    vm.page = 1
    vm.$nextTick(function () {
    })
  },
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
          if (itemTemplate.partNo === itemFile.dossierPartNo) {
            itemTemplate.count ++
          }
        })
      })
    },
    initData (data) {
      var vm = this
      var arrTemp = []
      console.log('dossierId++++++++', data.dossierId)
      arrTemp.push(vm.$store.dispatch('loadDossierTemplates', data))
      arrTemp.push(vm.$store.dispatch('loadDossierMark', data))
      arrTemp.push(vm.$store.dispatch('loadDossierFiles', data.dossierId))
      vm.thongTinHoSo = data
      Promise.all(arrTemp).then(values => {
        var dossierTemplates = values[0]
        var dossierMarks = values[1]
        var dossierFiles = values[2]
        console.log('dossierTemplates++++++', dossierTemplates)
        console.log('dossierMarks++++++', dossierMarks)
        console.log('dossierFiles++++++', dossierFiles)
        var dossierTemplateItems = vm.mergeDossierTemplateVsDossierFiles(dossierTemplates, dossierFiles)
        console.log('dossierTemplateItems++++++MERGER++++file', dossierTemplateItems)
        dossierTemplateItems = vm.mergeDossierTemplateVsDossierMark(dossierTemplateItems, dossierMarks)
        console.log('dossierTemplateItems++++++MERGE++++mark', dossierTemplateItems)
        vm.dossierTemplateItems = dossierTemplateItems
        vm.dossierFilesItems = dossierFiles
        vm.dossierMarksItems = dossierMarks
        setTimeout(function (argument) {
          vm.genAllAlpacaForm(dossierFiles, dossierTemplateItems)
          vm.recountFileTemplates()
        }, 500)
        console.log('dossierTemplateItems', vm.dossierTemplateItems)
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
          return template.hasForm && template.partType === 1
        })
        if (dossierFilesEform.length > 0) {
          dossierFilesEform.forEach(itemFiles => {
            if (itemFiles.eForm) {
              vm.$store.dispatch('loadAlpcaForm', itemFiles)
            }
          })
        } else {
          dossierTemplateItems.forEach(val => {
            if (val.hasForm && val.partType === 1) {
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
          if (val.hasForm && val.partType === 1) {
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
      if (dossierFiles) {
        dossierTemplates.forEach(template => {
          var itemFind = dossierFiles.find(file => {
            return template.partNo === file.dossierPartNo && template.partType === 0 && template.hasForm
          })
          if (itemFind) {
            template['daKhai'] = true
          } else if (!itemFind && template.hasForm) {
            template['daKhai'] = false
          }
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
      if (dossierMarks) {
        dossierTemplates = dossierTemplates.map(itemTemplate => {
          itemTemplate.count = 0
          dossierMarks.forEach(function (val, index) {
            if (val.dossierPartNo === itemTemplate.partNo) {
              itemTemplate.fileMark = val.fileMark
                // itemTemplate.fileCheck = val.fileCheck
            }
          })
          return itemTemplate
        })
      } else {
        dossierTemplates = dossierTemplates.map(itemTemplate => {
          itemTemplate.count = 0
          itemTemplate.fileMark = 0
          return itemTemplate
        })
      }
      return dossierTemplates
    },
    showAlpacaJSFORM (item) {
      var vm = this
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
          $('#formAlpaca' + item.partNo).alpaca(formScript)
        })
      })
    },
    saveAlpacaForm (item, index) {
      var vm = this
      var fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === item.partNo
      })
      if (fileFind) {
        fileFind['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('putAlpacaForm', fileFind).then(resData => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
        }).catch(reject => {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        })
      } else {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('postEform', item).then(resPostEform => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
            vm.dossierFilesItems = resFiles
          }).catch(reject => {
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      }
      vm.dossierTemplateItems[index].daKhai = true
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
      document.getElementById('file' + item.partNo).click()
    },
    onUploadSingleFile (e, data) {
      var vm = this
      e.dataItem = data
      e['dossierId'] = vm.thongTinHoSo.dossierId
      e['dossierTemplateNo'] = vm.thongTinHoSo.dossierTemplateNo
      vm.$store.dispatch('uploadSingleFile', e).then(function (result) {
        vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
          vm.dossierFilesItems = result
          vm.recountFileTemplates()
        })
      }).catch(function (xhr) {
      })
    },
    loadAlpcaForm (data) {
      var vm = this
      var fileFind = vm.dossierFilesItems.find(itemFile => {
        return itemFile.dossierPartNo === data.partNo && itemFile.eForm
      })
      if (fileFind) {
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
      let x = confirm('Bạn có muốn xóa?')
      if (x) {
        vm.dossierFilesItems.forEach(file => {
          if (file.dossierPartNo === item.partNo && file.eForm) {
            vm.$store.dispatch('deleteDossierFile', file).then(resFile => {
              console.log('success!')
              vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
                vm.dossierFilesItems = result
                vm.recountFileTemplates()
                var fileViewsTemp = vm.dossierFilesItems.filter(file => {
                  return file.dossierPartNo === item.partNo
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
    deleteSingleFile (item, index) {
      var vm = this
      let x = confirm('Bạn có muốn xóa?')
      if (x) {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
            var fileViewsTemp = vm.dossierFilesItems.filter(file => {
              return file.dossierPartNo === item.partNo
            })
            if (fileViewsTemp) {
              vm.fileViews = fileViewsTemp
            } else {
              return
            }
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
    viewFile2 (data) {
      var vm = this
      data['dossierId'] = vm.thongTinHoSo.dossierId
      vm.$store.dispatch('viewFile', data)
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
          vm.partView = item.partNo
          vm.stateView = !vm.stateView
        } else {
          return
        }
      }
      return
    },
    changeOtherDossierTemp (data) {
      var vm = this
      vm.loadingAddOther = true
      vm.$store.dispatch('uploadSingleOtherFile', {
        dossierId: vm.thongTinHoSo.dossierId,
        displayName: data
      }).then(resFile => {
        vm.loadingAddOther = false
        vm.dialogAddOtherTemp = false
      }).catch(reject => {
        vm.loadingAddOther = false
      })
    },
    addOtherTemplate () {
      var vm = this
      if (vm.$refs.form.validate()) {
        vm.changeOtherDossierTemp(vm.otherDossierTemplate)
      }
    }
  }
}
</script>
