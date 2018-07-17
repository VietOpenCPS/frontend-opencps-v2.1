<template>
  <div>
    <v-card>
      <div class="form_alpaca" style="position: relative;" v-for="(item, index) in dossierTemplateItems" v-if="item.partType === 1" v-bind:key="item.partNo">
        <v-expansion-panel class="expaned__list__data" :class='{"no_acction__event": !item.hasForm}'>
          <v-expansion-panel-content hide-actions :value="false">
            <div slot="header">
              <div style="width: calc(100% - 370px);display: flex;align-items: center;min-height: 38px;background: #fff;padding-left: 15px;">
                <span class="text-bold mr-2">{{index + 1}}.</span>
                <span @click="loadAlpcaForm(item)">{{item.partName}} <span v-if="item.required" style="color: red"> (*)</span> <i v-if="item.hasForm" style="font-size: 10px;color: #0d71bb;">(Form trực tuyến)</i></span>
              </div>
            </div>
            <v-card>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12 class="text-xs-right">
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
              <v-checkbox light color="secondary" class="flex" v-model="dossierTemplateItems[index].fileCheck"></v-checkbox>
              <v-radio-group v-model="dossierTemplateItems[index].fileType" row>
                <v-radio :value="2" :disabled="!dossierTemplateItems[index].fileCheck" ></v-radio>
                <v-radio :value="0" :disabled="!dossierTemplateItems[index].fileCheck" ></v-radio>
                <v-radio :value="1" :disabled="!dossierTemplateItems[index].fileCheck" ></v-radio>
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
                <v-btn slot="activator" class="mx-0" fab dark small color="primary" @click="viewFile(item)" style="height:20px;width:20px">
                  {{item.count}}
                </v-btn>
                <span>Xem</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn slot="activator" @click="onDeleteAttackFiles(item)" icon class="mx-0 my-0">
                  <v-icon size="16" class="mx-0" color="red darken-3">delete</v-icon>
                </v-btn>
                <span>Xóa</span>
              </v-tooltip>
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
      <span>Bản chính</span>
      <span>Bản chụp</span>
      <span>Công chứng</span>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
// import * as utils from '../store/onegate_utils'
export default {
  data: () => ({
    dossierTemplateItems: [],
    dossierMarksItems: [],
    dossierFilesItems: [],
    thongTinHoSo: {}
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
      console.log(data.dossierId)
      arrTemp.push(vm.$store.dispatch('loadDossierTemplates', data))
      arrTemp.push(vm.$store.dispatch('loadDossierMark', data))
      arrTemp.push(vm.$store.dispatch('loadDossierFiles', data.dossierId))
      vm.thongTinHoSo = data
      Promise.all(arrTemp).then(values => {
        let dossierTemplates = values[0]
        let dossierMarks = values[1]
        let dossierFiles = values[2]
        var dossierTemplateItems = []
        if (dossierMarks) {
          dossierTemplateItems = dossierTemplates.map(itemTemplate => {
            if (itemTemplate.hasForm) {
              itemTemplate.count = 1
            } else {
              itemTemplate.count = 0
            }
            dossierMarks.forEach(function (val, index) {
              if (val.dossierPartNo === itemTemplate.partNo) {
                itemTemplate.fileType = val.fileType
                itemTemplate.fileCheck = val.fileCheck
              }
            })
            return itemTemplate
          })
        } else {
          dossierTemplateItems = dossierTemplates.map(itemTemplate => {
            if (itemTemplate.hasForm) {
              itemTemplate.count = 1
            } else {
              itemTemplate.count = 0
            }
            itemTemplate.fileType = 0
            itemTemplate.fileCheck = false
            return itemTemplate
          })
        }
        vm.dossierTemplateItems = dossierTemplateItems
        vm.dossierFilesItems = dossierFiles
        vm.dossierMarksItems = dossierMarks
        setTimeout(function (argument) {
          dossierFiles.forEach(val => {
            if (val.eForm) {
              vm.$store.dispatch('loadAlpcaForm', val)
            }
          })
        }, 500)
        console.log('dossierTemplateItems', vm.dossierTemplateItems)
      }).catch(reject => {
      })
    },
    onDeleteAttackFiles (item) {
      var vm = this
      console.log('delete')
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
      // vm.$root.$confirm.open('Xóa', 'Bạn có muốn xoá thành phần hồ sơ này?', { color: 'red' }).then((confirm) => {
      // }).catch(function (xhr) {
      //   console.log('kkk')
      // })
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
      vm.dossierFilesItems.forEach(val => {
        if (val.dossierPartNo === data.partNo) {
          this.$store.dispatch('loadAlpcaForm', val)
        }
      })
    },
    viewFile (data) {
      var vm = this
      vm.dossierFilesItems.forEach(val => {
        val['dossierId'] = vm.thongTinHoSo.dossierId
        if (val.dossierPartNo === data.partNo) {
          this.$store.dispatch('viewFile', val)
        }
      })
    }
  }
}
</script>
