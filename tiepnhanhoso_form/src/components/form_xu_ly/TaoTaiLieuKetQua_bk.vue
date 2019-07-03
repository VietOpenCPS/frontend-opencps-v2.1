<template>
  <div class="taotailieuketqua" style="background-color: white;width:100%">
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div> Tài liệu kết quả
        </div>
        <v-card>
          <div class="form_alpaca" style="position: relative;" v-for="(item, index) in createFiles" v-bind:key="item.partNo">
            <v-expansion-panel :value="[true]" expand  class="expaned__list__data" :class='{"no_acction__event": !item.eForm}'>
              <v-expansion-panel-content hide-actions :value="false">
                <div slot="header" @click="stateView = false">
                  <div style="width: calc(100% - 370px);display: flex;align-items: center;background: #fff;padding-left: 25px;">
                    <span class="text-bold mr-2">{{index + 1}}.</span>
                    <span @click="loadAlpcaForm(item)">{{item.partName}} <span v-if="item.required" style="color: red"> (*)</span> <i v-if="item.eForm" style="font-size: 10px;color: #0d71bb;">(Form trực tuyến)</i> <i v-if="item.eForm" style="font-size: 10px;color: #0d71bb;">({{item.daKhai ? 'Đã khai' : 'Chưa khai '}})</i></span>
                  </div>
                </div>
                <v-card>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12 class="text-xs-right" v-if="!stateView">
                        <v-btn color="primary" @click="saveAlpacaForm(item, index)" v-if="item.eForm">Lưu lại</v-btn>
                        <v-btn color="primary" @click="deleteSingleFileEform(item, index)" v-if="item.daKhai && item.eForm">Xóa</v-btn>
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
                  <v-radio-group v-model="createFiles[index].fileMark" @change="postDossierMark(item, index)" row>
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
                <div style="width: calc(100% - 370px);display: flex;align-items: center;background: #fff;padding-left: 25px;">
                  <!-- <span class="text-bold mr-2">{{index + 1}}.</span> -->
                  <span @click="viewFile2(itemFileView)" class="ml-3">{{itemFileView.displayName}}</span>
                  <v-btn icon ripple @click="deleteSingleFile(itemFileView, index)">
                    <v-icon style="color: red">delete_outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <!-- <v-layout row wrap>
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
    </v-layout> -->
  </v-card>
  <div class="absolute-lable" style="font-size: 12px">
    <span>Không chọn</span>
    <span>Bản chính</span>
    <span>Bản chụp</span>
    <span>Công chứng</span>
  </div>
</v-expansion-panel-content>
</v-expansion-panel>
</div>
</template>

<script>
// import $ from 'jquery'
// import * as utils from '../store/onegate_utils'
import toastr from 'toastr'
export default {
  props: {
    createFiles: {
      type: Array,
      default: () => []
    },
    detailDossier: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    detailDossier (val) {
      console.log('watch', val)
      var vm = this
      vm.thongTinHoSo = val
      vm.$store.dispatch('loadDossierFiles', val.dossierId).then(resultFiles => {
        vm.dossierFilesItems = resultFiles
        vm.initData()
      })
    },
    createFiles (val) {
      var vm = this
      vm.createFiles = val
      vm.initData()
    }
  },
  data: () => ({
    createFiles: [],
    thongTinHoSo: {},
    dossierFilesItems: [],
    valid: true,
    dialogAddOtherTemp: false,
    loadingAddOther: false,
    otherDossierTemplate: '',
    sheet: false,
    fileViews: [{
      dossierFileId: 12121,
      displayName: 'THanh phan 1'
    }, {
      dossierFileId: 12122,
      displayName: 'THanh phan 2'
    }],
    partView: '',
    stateView: false
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
      vm.createFiles.forEach(val => {
        if (val.partNo === data.partNo) {
          if (val.eForm) {
            val.count = 1
          } else {
            val.count = 0
          }
        }
      })
    },
    recountFileTemplates () {
      var vm = this
      vm.createFiles.forEach(itemTemplate => {
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
      var createFiles = vm.createFiles
      var dossierFiles = vm.dossierFilesItems
      createFiles = vm.mergeDossierTemplateVsDossierFiles(createFiles, dossierFiles)
      console.log('createFiles++++++MERGER++++file', createFiles)
      setTimeout(function (argument) {
        vm.genAllAlpacaForm(createFiles, dossierFiles)
        vm.recountFileTemplates()
      }, 500)
    },
    genAllAlpacaForm (createFiles, dossierFiles) {
      var vm = this
      if (dossierFiles.length > 0) {
        var dossierFilesEform = dossierFiles.filter(file => {
          return file.eForm
        })
        var createFilesHasForm = createFiles.filter(createFile => {
          return createFile.eForm
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
              vm.showAlpacaJSFORM(val)
            }
          })
        }
        if (createFilesHasForm.length !== dossierFilesEform.length) {
          createFilesHasForm.forEach(createFile => {
            let indexFromFile = dossierFilesEform.findIndex(item => {
              return createFile.partNo === item.dossierPartNo
            })
            if (indexFromFile === -1) {
              vm.showAlpacaJSFORM(createFile)
            }
          })
        }
      } else {
        createFiles.forEach(val => {
          if (val.eForm) {
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
    },
    mergeDossierTemplateVsDossierFiles (createFiles, dossierFiles) {
      if (dossierFiles) {
        createFiles.forEach(createFile => {
          var itemFind = dossierFiles.find(file => {
            return createFile.partNo === file.dossierPartNo && createFile.eForm
          })
          if (itemFind) {
            createFile['daKhai'] = true
          } else if (!itemFind && createFile.eForm) {
            createFile['daKhai'] = false
          }
        })
      } else {
        createFiles.forEach(createFile => {
          if (createFile.eForm) {
            createFile['daKhai'] = false
          }
        })
      }
      return createFiles
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
          window.$('#formAlpaca' + item.partNo).alpaca(formScript)
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
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
        }).catch(reject => {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        })
      } else {
        item['dossierId'] = vm.thongTinHoSo.dossierId
        vm.$store.dispatch('postEform', item).then(resPostEform => {
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(resFiles => {
            vm.dossierFilesItems = resFiles
          }).catch(reject => {
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        })
      }
      vm.createFiles[index].daKhai = true
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
      e['dossierTemplateNo'] = data.templateFileNo
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
        vm.createFiles.forEach(val => {
          if (val.eForm && data.partNo === val.partNo) {
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
              })
            })
          }
        })
        vm.createFiles[index].daKhai = false
      }
    },
    deleteSingleFile (item, index) {
      var vm = this
      let x = confirm('Bạn có muốn xóa?')
      if (x) {
        vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
          // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
            vm.recountFileTemplates()
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
        partName: data
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
