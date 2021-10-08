<template>
  <div>
    <v-card>
      <div class="row-header no__hidden_class" id="top-header">
        <div class="background-triangle-big">
          <span v-if="!showDetail">QUẢN LÝ TÀI LIỆU CÔNG DÂN, CƠ QUAN TỔ CHỨC, DOANH NGHIỆP</span>
          <span v-else>CẬP NHẬT, SỐ HÓA TÀI LIỆU</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </div>
        </div>
      </div>
      <v-card-text class="px-0 pt-0" v-if="!showDetail">
        <v-card-text class="py-0 px-0">
          <v-layout wrap class="px-0 py-3">
            <v-flex xs12 sm5 class="pr-2">
              <div class="xs12 sm12 pb-1 mb-1">
                <span class="pr-2">{{nameTitle}}: </span>
                <span class="pl-0 text-bold"> {{applicantInfos.applicantName}}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm7 class="mb-1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">{{creditTitle}}: </span>
                <span class="pl-0 text-bold"> {{applicantInfos.applicantIdNo}}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm5 class="pr-2 mb-1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Điện thoại: </span>
                <span class="pl-0 text-bold"> {{applicantInfos.contactTelNo}} </span>
              </div>
            </v-flex>
            <v-flex xs12 sm7 class="mb-1">
              <div class="xs12 sm12 pb-1">
                <span class="pl-0">Thư điện tử: </span>
                <span class="pl-0 text-bold"> {{applicantInfos.contactEmail}} </span>
              </div>
            </v-flex>
            <v-flex xs12 class="">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Địa chỉ: </span>
                <span class="pl-0 text-bold"> {{String(applicantInfos.address).replace(/\./g, "")}} {{applicantInfos.wardName}}<span v-if="applicantInfos.wardName">, {{applicantInfos.districtName}}, {{applicantInfos.cityName}}</span></span>
              </div>
            </v-flex>
            
          </v-layout>
        </v-card-text>
        <v-layout wrap class="mt-0">
          <v-flex xs12 sm6 class="px-0 pr-2">
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
          <v-flex xs12 sm6 class="px-0">
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
          <v-flex xs12 sm6 class="px-0 pr-2">
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
          <v-flex xs12 sm6 class="">
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
        </v-layout>
        <v-flex style="width: 100%;height:32px">
          <v-btn class="mx-0 my-0 right" color="primary" dark @click.native="showCreatedocument">
            <v-icon size="18">add</v-icon> &nbsp; Thêm tài liệu
          </v-btn>
        </v-flex>
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
              <td class="text-xs-left" style="height:36px; min-width:450px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('fileName') ? props.item.fileName : ''}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px;min-width:150px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('fileNo') ? props.item.fileNo : ''}}</span>
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
              <td class="text-xs-center" style="height:36px;width:135px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span :style="props.item.status === 1 ? 'color: green' : (props.item.status === 2 ? 'color: red' : 'color: orange')">
                    {{props.item.hasOwnProperty('status') ? getStatus(props.item.status) : ''}}
                  </span>
                </div>
              </td>
              <td class="text-right" style="height:36px;width: 150px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-tooltip top v-if="!loadingTable && props.item.fileEntryId" class="mr-2">
                  <v-btn @click="viewDocument(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon size="22">visibility</v-icon>
                  </v-btn>
                  <span>Xem tài liệu</span>
                </v-tooltip>
                <v-tooltip top v-if="!loadingTable && props.item.fileEntryId" class="mr-2">
                  <v-btn @click="downloadDocument(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon size="22">fas fa fa-download</v-icon>
                  </v-btn>
                  <span>Tải xuống</span>
                </v-tooltip>
                <v-tooltip top v-if="!loadingTable" class="mr-2">
                  <v-btn @click="showEditDocument(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon size="22">edit</v-icon>
                  </v-btn>
                  <span>Số hóa, cập nhật tài liệu</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
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
      <v-card-text class="py-1 px-0" v-else>
        <v-form ref="form" v-model="valid" lazy-validation class="px-0 grid-list">
          <v-layout row wrap class="px-0 py-3">
            <v-flex xs12 sm6 class="pr-2 pl-0">
              <v-autocomplete
                :items="fileTemplateList"
                v-model="fileTemplateNoCreate"
                label="Loại tài liệu"
                item-text="name"
                item-value="fileTemplateNo"
                return-object
                :hide-selected="true"
                box
                :rules="[v => !!v || 'Loại tài liệu là bắt buộc']"
                required
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="pr-0">
              <v-autocomplete
                :items="statusList"
                v-model="statusCreate"
                label="Tình trạng"
                item-text="text"
                item-value="value"
                :hide-selected="true"
                box
                :rules="[v => v !== '' && v !== null || 'Tình trạng là bắt buộc']"
                required
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 class="px-0">
              <v-text-field
                label="Tên tài liệu"
                v-model="fileName"
                box
                clearable
                :rules="[v => !!v || 'Tên tài liệu là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-0">
              <v-text-field
                label="Mã tài liệu"
                v-model="fileNo"
                box
                clearable
                :rules="[v => !!v || 'Mã tài liệu là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>

            <v-flex xs12 class="mt-2">
              <div v-if="fileNameView" class="pb-3" @click="viewDocument(documentSelect)">
                <v-icon size="18" color="red">fa fa-file-pdf-o</v-icon>
                <a class="ml-2" style="font-style: italic;font-size: 14px;text-decoration: underline;">{{fileNameView}}</a>
              </div>
              <input type="file" id="documentFile" @input="uploadDocumentFile($event)" style="display:none">
              <v-btn block color="primary" class="mx-0 px-0 mr-4 d-inline-block" dark @click.native="uploadFile()" style="width: 175px">
                <v-icon size="16">fas fa fa-upload</v-icon> &nbsp; &nbsp;
                Tải lên tài liệu
              </v-btn>
              <v-btn block color="primary" class="mx-0 px-0 d-inline-block" dark @click.native="vgsignCopy('https://kiemthu-mt-gov-vn-9001.fds.vn')" style="width: 230px">
                <v-icon size="16">border_color</v-icon> &nbsp; &nbsp;
                Tải lên và ký duyệt tài liệu
              </v-btn>
              <div v-if="fileTemplateNoCreate && fileTemplateNoCreate.fileType">
                <span style="color:red">(*) </span>
                <span>File tải lên chấp nhận các định dạng: {{fileTemplateNoCreate.fileType}} .</span>
                <!-- <span>Dung lượng tải lên tối đa {{fileTemplateNoCreate && fileTemplateNoCreate.size ? fileTemplateNoCreate.size : maxFileSize}}MB.</span> -->
              </div>
            </v-flex>
          </v-layout>
        </v-form>
        <v-flex class="text-right">
          <v-btn class="mr-2 white--text" color="red" :disabled="loadingAction" @click.native="showDetail = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
          <v-btn v-if="typeCreate === 'create'" class="mr-0" color="primary" 
            :disabled="loadingAction"
            @click.native="createDocument"
          >
            <v-icon>save</v-icon> &nbsp;
            <span>Thêm tài liệu</span> 
          </v-btn>
          <v-btn v-else :disabled="loadingAction" class="mr-0" color="primary" @click.native="updateDocument">
            <v-icon>save</v-icon> &nbsp;
            <span>Cập nhật tài liệu</span> 
          </v-btn>
        </v-flex>
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
    <v-dialog v-model="dialogViewFileSign" max-width="1200" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogViewFileSign = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <iframe id="dialogEsignPreview" :src="pathNameFileESign" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
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
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    isDvc: false,
    applicantInfos: '',
    nameTitle: '',
    creditTitle: '',
    documentApplicantList: '',
    totalDocument: 0,
    documentPage: 1,
    numberPerPage: 15,
    statusList: [
      {text: 'Yêu cầu số hóa', value: 0},
      {text: 'Có hiệu lực', value: 1},
      {text: 'Hết hiệu lực', value: 2},
      {text: 'Hủy', value: 3}
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
    showDetail: false,
    updateFile: false,
    loadingAction: false,
    loadingTable: false,
    dialogPDF: false,
    dialogViewFileSign: false,
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
        text: 'Mã tài liệu',
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
    fileEntryESign: '',
    pathNameFileESign: '',
    hasEsign: false
  }),
  computed: {
    
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      try {
        vm.isDvc = isDvc
      } catch (error) {
      }
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let applicant = vm.$store.getters.getApplicantInfos
      if (applicant) {
        vm.applicantInfos = applicant
        vm.getApplicantType(vm.applicantInfos)
        vm.getApplicantDocument()
      } else {
        vm.getApplicantList()
      }
      vm.getFileItems()
    })
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    vgsignCopy() {
      let vm = this
      vm.hasEsign = true
      let prms = {}
      prms['FileUploadHandler'] = window.themeDisplay.getPortalURL() + '/o/rest/v2/vgca/fileupload'
      prms['SessionId'] = ''
      prms['FileName'] = ''
      let signFileCallBack = function (rv) {
        let received_msg = JSON.parse(rv)
        console.log('received_msg', received_msg)
        if (received_msg.Status === 0) {
          let dataSigned
          try {
            dataSigned = JSON.parse(received_msg.FileServer)
            vm.fileEntryESign = dataSigned.fileEntryId
            if (window.top.location.protocol === 'https:') {
              dataSigned.url = dataSigned.url.replace('http:', 'https:')
            }
            dataSigned.url = dataSigned.url.replace(':80/', '/')
            vm.pathNameFileESign = dataSigned.url
            vm.fileNameView = dataSigned.url
          } catch (error) {
          }
          console.log('dataSigned', dataSigned)
          toastr.clear()
          toastr.success('Tài liệu đã được ký duyệt')
          vm.dialogViewFileSign = true
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
      let json_prms = JSON.stringify(prms)
      vgca_sign_approved(json_prms, signFileCallBack)
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
    getApplicantList () {
      let vm = this
      let url = '/o/rest/v2/applicants'
      let param = {
        headers: {
        },
        params: {
          start: 0,
          end: 1,
          idNo: vm.index
        }
      }
      axios.get(url, param).then(response => {
        if (response.data.hasOwnProperty('data')) {
          vm.applicantInfos = response.data.data[0]
          vm.getApplicantType(vm.applicantInfos)
          vm.getApplicantDocument()
        } else {
        }
      }).catch(function () {
      })
    },
    getApplicantDocument () {
      let vm = this
      let filter = {
        start: vm.documentPage * vm.numberPerPage - vm.numberPerPage,
        end: vm.documentPage * vm.numberPerPage,
        applicantIdNo: vm.applicantInfos.applicantIdNo,
        fileTemplateNo: vm.fileTemplateNo,
        status: vm.status,
        keywordSearch: vm.keySearch,
        fileNoSearch: vm.fileNoSearch,
        applicantDataType: ''
      }
      vm.loadingTable = true
      if (vm.isDvc) {
        vm.$store.dispatch('getApplicantDocumentFromDvc', filter).then(function (result) {
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
    uploadFile () {
      let vm = this
      vm.hasEsign = false
      document.getElementById('documentFile').value = ''
      document.getElementById('documentFile').click()
    },
    uploadDocumentFile (e) {
      let vm = this
      let files = $('#documentFile')[0].files
      let file = files[0]
      let fileName = ''
      let valid = vm.validFileUpload(file)
      if (valid) {
        vm.updateFile = true
        if (file['name']) {
          fileName = file['name'].replace(/\%/g, '')
          fileName = fileName.replace(/\//g, '')
          fileName = fileName.replace(/\\/g, '')
          fileName = fileName.replace(/\s/g, '')
        }
        vm.fileUpdate = file
        vm.fileNameUpdate = fileName
        vm.fileNameView = fileName
      }

    },
    getFileItems () {
      let vm = this
      let filter = {
        status: 1
      }
      if (vm.isDvc) {
        vm.$store.dispatch('getFileItemsFromDvc', filter).then(function (result) {
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
      vm.showDetail = true
      vm.typeCreate = 'create'
      vm.pathNameFileESign = ''
      vm.fileNameView = ''
      vm.statusCreate = ''
      vm.fileName = ''
      vm.fileNo = ''
      // vm.dialog_createDocument = true
      vm.$refs.form.reset()
      vm.$refs.form.resetValidation()
    },
    createDocument () {
      let vm = this
      if (!vm.hasEsign) {
        let validFileUpload = true
        if (vm.updateFile) {
          let files = $('#documentFile')[0].files
          let file = files[0]
          validFileUpload = vm.validFileUpload(file)
        }
        if (!validFileUpload) {
          return
        }
        if (vm.$refs.form.validate()) {
          if (vm.fileNameView) {
            vm.loadingAction = true
            let filter = {
              fileTemplateNo: vm.fileTemplateNoCreate.fileTemplateNo,
              status: vm.statusCreate ? vm.statusCreate : 0,
              fileNo: vm.fileNo,
              fileName: vm.fileName,
              applicantIdNo: vm.applicantInfos.applicantIdNo,
            }
            let param = {
              headers: {
                groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
            if (vm.isDvc) {
              let dataPost = new FormData()
              dataPost.append('method', 'POST')
              dataPost.append('url', '/applicantdatas')
              dataPost.append('data', JSON.stringify(filter))
              dataPost.append('file', vm.fileUpdate)
              
              axios.post('/o/rest/v2/proxy/multipart', dataPost, param).then(response => {
                vm.loadingAction = false
                toastr.success('Thêm mới tài liệu thành công')
                vm.dialog_createDocument = false
                setTimeout(function () {
                  vm.getApplicantDocument()
                }, 200)
              }).catch(xhr => {
                toastr.error('Thêm mới thất bại. Vui lòng thử lại.')
              })
            } else {
              let dataCreateFile = new FormData()
              let url = '/o/rest/v2/applicantdatas'
              dataCreateFile.append('fileTemplateNo', vm.fileTemplateNoCreate.fileTemplateNo)
              dataCreateFile.append('status', vm.statusCreate ? vm.statusCreate : 0)
              dataCreateFile.append('fileNo', vm.fileNo)
              dataCreateFile.append('fileName', vm.fileName)
              dataCreateFile.append('applicantIdNo', vm.applicantInfos.applicantIdNo)
              dataCreateFile.append('file', vm.fileUpdate)
              dataPost.append('govAgencyName', '')
              dataPost.append('issueDate', '')
              dataPost.append('expireDate', '')
              dataPost.append('desciption', '')
              
              axios.post(url, dataCreateFile, param).then(result1 => {
                vm.loadingAction = false
                toastr.success('Thêm mới tài liệu thành công')
                vm.dialog_createDocument = false
                setTimeout(function () {
                  vm.getApplicantDocument()
                }, 200)
              }).catch(xhr => {
                vm.loadingAction = false
                toastr.error('Thêm mới thất bại. Vui lòng thử lại.')
              })
            }
            
          } else {
            toastr.clear()
            toastr.error('Vui lòng đính kèm tài liệu')
          }
        }
      } else {
        vm.createDocumentKySo()
      }
    },
    createDocumentKySo () {
      let vm = this
      if (vm.$refs.form.validate()) {
        if (vm.fileNameView) {
          vm.loadingAction = true
          let filter = {
            fileTemplateNo: vm.fileTemplateNoCreate.fileTemplateNo,
            status: vm.statusCreate ? vm.statusCreate : 0,
            fileNo: vm.fileNo,
            fileName: vm.fileName,
            applicantIdNo: vm.applicantInfos.applicantIdNo,
          }
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          let dataCreateFile = new FormData()
          let url = '/o/rest/v2/applicantdatas'
          dataCreateFile.append('fileTemplateNo', vm.fileTemplateNoCreate.fileTemplateNo)
          dataCreateFile.append('status', vm.statusCreate ? vm.statusCreate : 0)
          dataCreateFile.append('fileNo', vm.fileNo)
          dataCreateFile.append('fileName', vm.fileName)
          dataCreateFile.append('applicantIdNo', vm.applicantInfos.applicantIdNo)
          dataCreateFile.append('fileEntryId', vm.fileEntryESign)
          dataPost.append('govAgencyName', '')
          dataPost.append('issueDate', '')
          dataPost.append('expireDate', '')
          dataPost.append('desciption', '')
          
          axios.post(url, dataCreateFile, param).then(result1 => {
            vm.loadingAction = false
            toastr.success('Thêm mới tài liệu thành công')
            vm.dialog_createDocument = false
            setTimeout(function () {
              vm.getApplicantDocument()
            }, 200)
          }).catch(xhr => {
            vm.loadingAction = false
            toastr.error('Thêm mới thất bại. Vui lòng thử lại.')
          })
          
        } else {
          toastr.clear()
          toastr.error('Vui lòng đính kèm tài liệu')
        }
      }
    },
    updateDocument () {
      let vm = this
      if (!vm.hasEsign) {
        let validFileUpload = true
        if (vm.updateFile) {
          let files = $('#documentFile')[0].files
          let file = files[0]
          validFileUpload = vm.validFileUpload(file)
        }
        if (!validFileUpload) {
          return
        }
        if (vm.$refs.form.validate()) {
          vm.loadingAction = true
          let filter = {
            fileTemplateNo: vm.fileTemplateNoCreate.fileTemplateNo,
            status: vm.statusCreate ? vm.statusCreate : 0,
            fileNo: vm.fileNo,
            fileName: vm.fileName,
            applicantIdNo: vm.applicantInfos.applicantIdNo
          }
          let param = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          if (vm.isDvc) {
            let dataPost = new FormData()
            dataPost.append('method', 'PUT')
            dataPost.append('url', '/applicantdatas/' + vm.documentSelect.applicantDataId)
            dataPost.append('data', JSON.stringify(filter))
            if (vm.updateFile) {
              dataPost.append('file', vm.fileUpdate)
            } else {
              dataPost.append('file', '')
            }

            axios.post('/o/rest/v2/proxy/multipart', dataPost, param).then(response => {
              vm.loadingAction = false
              toastr.success('Cập nhật tài liệu thành công')
              vm.dialog_createDocument = false
              setTimeout(function () {
                vm.getApplicantDocument()
              }, 200)
            }).catch(xhr => {
              vm.loadingAction = false
              toastr.error('Cập nhật thất bại. Vui lòng thử lại.')
            })
          } else {
            let dataPost = new FormData()
            let url = '/o/rest/v2/applicantdatas/' + vm.documentSelect.applicantDataId
            dataPost.append('fileTemplateNo', vm.fileTemplateNoCreate.fileTemplateNo)
            dataPost.append('status', vm.statusCreate ? vm.statusCreate : 0)
            dataPost.append('fileNo', vm.fileNo)
            dataPost.append('fileName', vm.fileName)
            dataPost.append('applicantIdNo', vm.applicantInfos.applicantIdNo)
            dataPost.append('govAgencyName', '')
            dataPost.append('issueDate', '')
            dataPost.append('expireDate', '')
            dataPost.append('desciption', '')
            if (vm.updateFile) {
              dataPost.append('file', vm.fileUpdate)
            } else {
              dataPost.append('file', '')
            } 
            axios.put(url, dataPost, param).then(result1 => {
              vm.loadingAction = false
              toastr.success('Cập nhật tài liệu thành công')
              vm.dialog_createDocument = false
              setTimeout(function () {
                vm.getApplicantDocument()
              }, 200)
            }).catch(xhr => {
              vm.loadingAction = false
              toastr.error('Cập nhật thất bại. Vui lòng thử lại.')
            })
          }
          
        }
      } else {
        vm.updateDocumentKySo()
      }
    },
    updateDocumentKySo () {
      let vm = this
      if (vm.$refs.form.validate()) {
        vm.loadingAction = true
        let filter = {
          fileTemplateNo: vm.fileTemplateNoCreate.fileTemplateNo,
          status: vm.statusCreate ? vm.statusCreate : 0,
          fileNo: vm.fileNo,
          fileName: vm.fileName,
          applicantIdNo: vm.applicantInfos.applicantIdNo
        }
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        let dataPost = new FormData()
        let url = '/o/rest/v2/applicantdatas/' + vm.documentSelect.applicantDataId
        dataPost.append('fileTemplateNo', vm.fileTemplateNoCreate.fileTemplateNo)
        dataPost.append('status', vm.statusCreate ? vm.statusCreate : 0)
        dataPost.append('fileNo', vm.fileNo)
        dataPost.append('fileName', vm.fileName)
        dataPost.append('applicantIdNo', vm.applicantInfos.applicantIdNo)
        dataPost.append('fileEntryId', vm.fileEntryESign)
        dataPost.append('govAgencyName', '')
        dataPost.append('issueDate', '')
        dataPost.append('expireDate', '')
        dataPost.append('desciption', '')

        axios.put(url, dataPost, param).then(result1 => {
          vm.loadingAction = false
          toastr.success('Cập nhật tài liệu thành công')
          vm.dialog_createDocument = false
          vm.showDetail = false
          setTimeout(function () {
            vm.getApplicantDocument()
          }, 200)
        }).catch(xhr => {
          vm.loadingAction = false
          toastr.error('Cập nhật thất bại. Vui lòng thử lại.')
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
      $('html, body').animate({
          scrollTop: $('#top-header').offset().top,
        },
        100,
        'linear'
      )
      vm.documentSelect = item
      vm.typeCreate = 'update'
      vm.fileNameView = item.fileName
      vm.fileTemplateNoCreate = vm.fileTemplateList.filter(function (items) {
        return items.fileTemplateNo === item.fileTemplateNo
      })[0]
      vm.statusCreate = item.status
      vm.fileName = item.fileName
      vm.fileNo = item.fileNo
      // vm.dialog_createDocument = true
      vm.showDetail = true
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
    downloadDocument (item) {
      let vm = this
      vm.srcDownload = ''
      let url = item.filePath
      let filter = {
        applicantDataId: item.applicantDataId
      }
      if (vm.isDvc) {
        vm.$store.dispatch('getFileAttachProxy', filter).then(function (result) {
          vm.srcDownload = result
          setTimeout(function () {
            document.getElementById('downloadFile').click()
          }, 100)
        }).catch(function () {
        })
      } else {
        vm.$store.dispatch('getFileAttach', filter).then(function (result) {
          vm.srcDownload = result
          setTimeout(function () {
            document.getElementById('downloadFile').click()
          }, 100)
        }).catch(function () {
        })
      }
    },
    viewDocument (item) {
      let vm = this
      if (vm.pathNameFileESign) {
        vm.dialogViewFileSign = true
      } else {
        vm.srcDownload = ''
        let filter = {
          applicantDataId: item.applicantDataId
        }
        if (vm.isDvc) {
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
      if (String(val) === '0') {
        return 'Yêu cầu số hóa'
      } else if (String(val) === '1') {
        return 'Có hiệu lực'
      } else if (String(val) === '2') {
        return 'Hết hiệu lực'
      } else if (String(val) === '3') {
        return 'Hủy'
      }
    },
    goBack () {
      let vm = this
      if (vm.showDetail) {
        vm.showDetail = false
      } else {
        window.history.back()
      }
    }
  }
}
</script>
