<template>
  <div>
    <v-card>
      <v-card-text class="px-0 pt-0 mt-3">
        <v-layout wrap class="mt-0">
          <v-flex xs12 sm6 class="pr-2" v-if="originality === 3">
            <v-text-field
              label="Số CMND/ căn cước công dân, mã số thuế doanh nghiệp, mã tổ chức"
              v-model="applicantIdNo"
              @keyup.enter="changeFilterSearch"
              append-icon="search"
              box
              clear-icon="clear"
              clearable
              @click:clear="changeFilterSearch"
              @click:append="changeFilterSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 class="" v-if="originality === 3">
            <v-text-field
              label="Tìm theo mã tài liệu"
              v-model="fileNoSearch"
              @keyup.enter="changeFilterSearch"
              append-icon="search"
              box
              clear-icon="clear"
              clearable
              @click:clear="changeFilterSearch"
              @click:append="changeFilterSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 class="pr-2">
            <v-autocomplete
              :items="fileTemplateList"
              v-model="fileTemplateNo"
              label="Chọn loại tài liệu"
              item-text="name"
              item-value="fileTemplateNo"
              :hide-selected="true"
              clearable
              @change="changeFilterSearch"
              box
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 class="pr-2" v-if="originality === 3">
            <v-autocomplete
              :items="statusList"
              v-model="status"
              label="Chọn tình trạng"
              item-text="text"
              item-value="value"
              :hide-selected="true"
              clearable
              @change="changeFilterSearch"
              box
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 class="pr-2" v-if="originality === 1">
            <v-text-field
              label="Tìm theo mã tài liệu"
              v-model="fileNoSearch"
              @keyup.enter="changeFilterSearch"
              append-icon="search"
              box
              clear-icon="clear"
              clearable
              @click:clear="changeFilterSearch"
              @click:append="changeFilterSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm4 class="">
            <v-text-field
              label="Tìm theo tên tài liệu"
              v-model="keySearch"
              @keyup.enter="changeFilterSearch"
              append-icon="search"
              box
              clear-icon="clear"
              clearable
              @click:clear="changeFilterSearch"
              @click:append="changeFilterSearch"
            ></v-text-field>
          </v-flex>
          
        </v-layout>

        <v-data-table
          :headers="documentListHeader"
          :items="documentApplicantList"
          hide-actions
          class="table-landing table-bordered mt-2"
          style="border-left: 1px solid #dedede"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center" style="width:50px;height:36px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{ documentPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px; min-width:350px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span style="word-break: break-word;">{{props.item.hasOwnProperty('fileName') ? props.item.fileName : ''}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px;min-width:150px;max-width: 300px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span style="word-break: break-word;">{{props.item.hasOwnProperty('fileNo') ? props.item.fileNo : ''}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px;min-width:120px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('fileExtension') ? props.item.fileExtension : ''}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px; min-width:150px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('createDate') ? props.item.createDate : ''}}</span>
                </div>
              </td>
              <td class="text-xs-center" style="height:36px;min-width:125px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span :style="props.item.status === 1 ? 'color: green' : (props.item.status === 2 ? 'color: red' : 'color: orange')">
                    {{props.item.hasOwnProperty('status') ? getStatus(props.item.status) : ''}}
                  </span>
                </div>
              </td>
              <td class="text-xs-center" style="height:36px;min-width: 100px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-tooltip top v-if="!loadingTable" class="mr-2">
                  <v-btn @click="viewDocument(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon>visibility</v-icon>
                  </v-btn>
                  <span>Xem trước</span>
                </v-tooltip>
                <v-tooltip top v-if="!loadingTable" class="mr-2">
                  <v-btn @click="$emit('trigger-attach', props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon>fas fa fa-download</v-icon>
                  </v-btn>
                  <span>Sử dụng</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <v-progress-linear v-if="loadingTable" :indeterminate="true"></v-progress-linear>
            <div v-else class="text-xs-center mt-2">
              Không có tài liệu
            </div>
          </template>
        </v-data-table>

        <div class="my-2" v-if="totalDocument > numberPerPage">
          <div class="text-xs-right layout wrap" style="position: relative;">
            <div class="flex pagging-table"> 
              <tiny-pagination :total="totalDocument" :page="documentPage" :numberPerPage="numberPerPage" nameRecord="tài liệu" custom-class="custom-tiny-class" 
                @tiny:change-page="changePage" ></tiny-pagination> 
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogPDF" max-width="1200" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Tài liệu đính kèm</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <iframe id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
    <div style="display:none">
      <a id="downloadFile" :href="srcDownload" download></a>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import axios from 'axios'
import $ from 'jquery'
import TinyPagination from '../../components/pagging/opencps_pagination'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    applicantInfos: '',
    nameTitle: '',
    creditTitle: '',
    documentApplicantList: '',
    totalDocument: 0,
    documentPage: 1,
    numberPerPage: 15,
    statusList: [
      {text: 'Chưa duyệt', value: 0},
      {text: 'Có hiệu lực', value: 1},
      {text: 'Hết hiệu lực', value: 2}
    ],
    status: '',
    statusCreate: '',
    fileTemplateNoCreate: '',
    fileTemplateList: [],
    fileTemplateNo: '',
    fileName: '',
    fileNo: '',
    fileUpdate: '',
    fileNameUpdate: '',
    fileNoSearch: '',
    keySearch: '',
    dialog_createDocument: false,
    updateFile: false,
    loadingAction: false,
    loadingTable: false,
    dialogPDF: false,
    valid: false,
    documentListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên tài liệu',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã số',
        align: 'center',
        sortable: false
      },
      {
        text: 'Định dạng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày tạo',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    maxFileSize: 100,
    typeCreate: 'create',
    documentSelect: '',
    fileNameView: '',
    srcDownload: '',
    applicantIdNo: ''
  }),
  computed: {
    originality () {
      let vm = this
      return vm.getOriginality()
    }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    index (val) {
      this.applicantIdNo = val
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      vm.applicantIdNo = vm.index
    })
  },
  mounted () {
    let vm = this
    vm.applicantIdNo = vm.index
  },
  methods: {
    initData () {
      let vm = this
      vm.getApplicantDocument()
      vm.getFileItems()
    },
    getApplicantInfos () {
      let vm = this
      let filter = {
        applicantId: vm.index
      }
      vm.$store.dispatch('getApplicantInfos', filter).then(function (result) {
        vm.applicantInfos = result
        vm.getApplicantType(vm.applicantInfos)
      }).catch(function () {
      })
    },
    getApplicantDocument () {
      let vm = this
      let filter = {
        start: vm.documentPage * vm.numberPerPage - vm.numberPerPage,
        end: vm.documentPage * vm.numberPerPage,
        applicantIdNo: vm.applicantIdNo,
        fileTemplateNo: vm.fileTemplateNo,
        status: vm.originality === 1 ? 1 : vm.status,
        keywordSearch: vm.keySearch,
        fileNoSearch: vm.fileNoSearch,
        applicantDataType: ''
      }
      vm.loadingTable = true
      if (vm.originality === 1) {
        vm.$store.dispatch('getApplicantDocumentProxy', filter).then(function (result) {
          if (result.hasOwnProperty('data')) {
            vm.documentApplicantList = result.data
          } else {
            vm.documentApplicantList = []
          }
          vm.totalDocument = result['total']
          vm.loadingTable = false
        }).catch(function () {
          vm.loadingTable = false
          vm.documentApplicantList = []
          vm.totalDocument = 0
        })
      } else {
        vm.$store.dispatch('getApplicantDocument', filter).then(function (result) {
          if (result.hasOwnProperty('data')) {
            vm.documentApplicantList = result.data
          } else {
            vm.documentApplicantList = []
          }
          vm.totalDocument = result['total']
          vm.loadingTable = false
        }).catch(function () {
          vm.loadingTable = false
          vm.documentApplicantList = []
          vm.totalDocument = 0
        })
      }
      
    },
    getFileItems () {
      let vm = this
      let filter = {
        status: 1
      }
      if (vm.originality === 1) {
        vm.$store.dispatch('getFileItemsProxy', filter).then(function (result) {
          if (result.hasOwnProperty('data')) {
            vm.fileTemplateList = result.data
          } else {
            vm.fileTemplateList = []
          }
        }).catch(function () {
        })
      } else {
        vm.$store.dispatch('getFileItems', filter).then(function (result) {
          if (result.hasOwnProperty('data')) {
            vm.fileTemplateList = result.data
          } else {
            vm.fileTemplateList = []
          }
        }).catch(function () {
        })
      }
      
    },
    showCreatedocument () {
      let vm = this
      vm.typeCreate = 'create'
      vm.dialog_createDocument = true
      vm.$refs.form.reset()
      vm.$refs.form.resetValidation()
      vm.fileNameView = ''
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
    changeFilterSearch () {
      let vm = this
      vm.documentPage = 1
      setTimeout(function () {
        vm.getApplicantDocument()
      }, 200)
    },
    changePage (config) {
      let vm = this
      vm.documentPage = config.page
      vm.getApplicantDocument()
    },
    showEditDocument (item) {
      let vm = this
      vm.documentSelect = item
      vm.typeCreate = 'update'
      vm.fileNameView = item.filePath
      vm.fileTemplateNoCreate = vm.fileTemplateList.filter(function (items) {
        return items.fileTemplateNo === item.fileTemplateNo
      })[0]
      vm.statusCreate = item.status
      vm.fileName = item.fileName
      vm.fileNo = item.fileNo
      vm.dialog_createDocument = true
    },
    validFileUpload (file) {
      let vm = this
      let passed = true
      let getFileType = file.name ? file.name.split('.') : ''
      let fileType = getFileType ? getFileType[getFileType.length - 1] : ''
      let fileTypeAllow = vm.fileTemplateNoCreate && vm.fileTemplateNoCreate.fileType ? vm.fileTemplateNoCreate.fileType.toUpperCase().split(',') : ''
      let fileSizeAllow = vm.fileTemplateNoCreate && vm.fileTemplateNoCreate.size ? vm.fileTemplateNoCreate.size : vm.maxFileSize
      let fileTypeInput = fileTypeAllow ? fileTypeAllow.filter(function (item) {
        return item === fileType.toUpperCase()
      }) : ''
      if ((fileTypeInput && fileTypeInput.length > 0) || !fileTypeAllow) {
        if (Number(file.size) <= fileSizeAllow * 1048576 || !fileSizeAllow) {
          passed = true
        } else {
          passed = false
          toastr.clear()
          toastr.error('Tài liệu tải lên dung lượng tối đa là ' + fileSizeAllow + 'MB')
        }
      } else {
        passed = false
        toastr.clear()
        toastr.error('Tài liệu tải lên chỉ chấp nhận các định dạng ' + vm.fileTemplateNoCreate.fileType)
      }
      return passed
    },
    attachDocument () {
      let vm = this
      
    },
    downloadDocument (item) {
      let vm = this
      vm.srcDownload = ''
      let url = item.filePath
      let filter = {
        applicantDataId: item.applicantDataId
      }
      vm.$store.dispatch('getFileAttach', filter).then(function (result) {
        vm.srcDownload = result
        setTimeout(function () {
          document.getElementById('downloadFile').click()
        }, 100)
      }).catch(function () {
      })
    },
    viewDocument (item) {
      let vm = this
      vm.srcDownload = ''
      let url = item.filePath
      let filter = {
        applicantDataId: item.applicantDataId
      }
      if (vm.originality === 1) {
        vm.$store.dispatch('getFileAttachProxy', filter).then(function (result) {
          let fileType = item.fileExtension.toLowerCase()
          if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'pdf' || fileType === 'gif' ||
            fileType === 'tif' || fileType === 'tiff'
          ) {
            vm.dialogPDF = true
            document.getElementById('dialogPDFPreview').src = result
          } else {
            vm.srcDownload = result
            setTimeout(function () {
              document.getElementById('downloadFile').click()
            }, 100)
          }
        }).catch(function () {
        })
      } else {
        vm.$store.dispatch('getFileAttach', filter).then(function (result) {
          let fileType = item.fileExtension.toLowerCase()
          if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'pdf' || fileType === 'gif' ||
            fileType === 'tif' || fileType === 'tiff'
          ) {
            vm.dialogPDF = true
            document.getElementById('dialogPDFPreview').src = result
          } else {
            vm.srcDownload = result
            setTimeout(function () {
              document.getElementById('downloadFile').click()
            }, 100)
          }
        }).catch(function () {
        })
      }
    },
    getApplicantType (item) {
      let vm = this
      if (item.applicantIdType === '') {
        vm.nameTitle = 'Tên công dân, tổ chức, doanh nghiệp'
        vm.creditTitle = 'Số CMND/ căn cước, mã số thuế doanh nghiệp'
      } else if (item.applicantIdType === 'citizen') {
        vm.nameTitle = 'Tên công dân'
        vm.creditTitle = 'Số CMND/ căn cước'
      } else if (item.applicantIdType === 'business') {
        vm.nameTitle = 'Tên doanh nghiệp'
        vm.creditTitle = 'Mã số thuế doanh nghiệp'
      } else {
        vm.nameTitle = 'Tên cơ quan, tổ chức'
        vm.creditTitle = 'Mã cơ quan, tổ chức'
      }
    },
    getStatus (val) {
      if (String(val) === '1') {
        return 'Có hiệu lực'
      } else if (String(val) === '2') {
        return 'Hết hiệu lực'
      } else {
        return 'Chưa duyệt'
      }
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
