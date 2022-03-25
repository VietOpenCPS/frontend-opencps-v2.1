<template>
  <div style="padding: 0px 25px; max-width: 1500px; margin: 0px auto" class="mt-0 pb-3" id="top-header">
    <vue-confirm-dialog></vue-confirm-dialog>
    <v-card class="px-3 py-3" style="width: 100%; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
      <div class="headline mb-3" style="font-size: 20px!important;">DANH SÁCH GIẤY TỜ SỐ HÓA</div>
      <v-btn color="#0072bc" small class="mx-0 white--text" @click.stop="showTimKiem" style="position: absolute; right: 17px; top: 15px;">
        <v-icon size="20">
          filter_list
        </v-icon> &nbsp;
        Lọc danh sách
      </v-btn>
      <v-card-text class="px-0 pb-0" v-if="showAdvanceSearch">
        <tim-kiem ref="timkiem"  v-on:trigger-search="searchGiayToSoHoa" v-on:trigger-cancel="cancelSearchGiayToSoHoa"></tim-kiem>
      </v-card-text>

      <v-btn color="orange" small class="mx-0 white--text mr-2" @click.stop="downloadTemplate">
        <v-icon size="16">
          fas fa fa-file-excel-o
        </v-icon> &nbsp;
        Tải mẫu import
      </v-btn>
      <v-btn color="#0072bc" small class="mx-2 white--text" :loading="processingImport" :disabled="processingImport" @click.stop="pickFileImport">
        <v-icon size="20">
          post_add
        </v-icon> &nbsp;
        Import danh sách giấy tờ
      </v-btn>
      <v-btn color="#0072bc" small class="mx-0 white--text ml-2" :loading="processingSigning" :disabled="processingSigning" @click.stop="signDocument">
        <v-icon size="20">
          drive_file_rename_outline
        </v-icon> &nbsp;
        Ký số giấy tờ
      </v-btn>
      <div class="mt-2">
        <v-checkbox
          class="mt-0 mr-3 d-inline-block"
          v-model="chuaKy"
          :value="true"
          @change="changeFilterStatus($event)"
        >
          <template slot="label">
            <span style="color:black !important">Chưa ký số</span>
          </template>
        </v-checkbox>
        <v-checkbox
          class="mt-0 d-inline-block"
          v-model="daKy"
          :value="true"
          @change="changeFilterStatus($event)"
        >
          <template slot="label">
            <span style="color:black !important">Đã ký số</span>
          </template>
        </v-checkbox>
      </div>
      <div class="mt-0 mr-0" style="font-weight: 500;">Tổng số {{totalDocument}} giấy tờ</div>
      <v-data-table
        :headers="documentListHeader"
        :items="documentApplicantList"
        :total-items="hosoDatasTotal"
        v-model="selected"
        item-key="excelDataId"
        :select-all="true"
        hide-actions
        class="table-landing table-bordered mt-2"
        style="border-left: 1px solid #dedede"
      >
        <v-progress-linear v-if="loadingTable" slot='progress' color="blue" indeterminate></v-progress-linear>
        <template slot="headers" slot-scope="props">
          <tr>
            <th width="32px" class="v_data_table_check_all" >
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.native="toggleAll"
              ></v-checkbox>
            </th>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="header['class'] ? header['class'] : ''"
              :width="header['width'] ? header['width'] + 'px' : ''"
              :style="header['sortable'] ? 'cursor: pointer' : ''"
            >
              <v-tooltip bottom>
                <span slot="activator">{{ header.text }}</span>
                <span>{{ header.text }}</span>
              </v-tooltip> 
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
            <td width="32px" class="v_data_table_check_all">
              <v-checkbox
                v-model="props.selected"
                @change="changeSelected"
                primary
                hide-details
                color="primary"
                :disabled="props.item.isKyso == true"
              ></v-checkbox>
            </td>
            <td class="text-xs-center py-2" style="width:50px;height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{ documentPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('soHieuVanBan') ? props.item.soHieuVanBan : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px; min-width:200px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span style="word-break: break-word;">{{props.item.hasOwnProperty('tenGiayTo') ? props.item.tenGiayTo : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px; min-width:250px; max-width: 350px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span style="word-break: break-word;">{{props.item.hasOwnProperty('tenFile') ? props.item.tenFile : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('createDate') ? props.item.createDate : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('maHoSo') ? props.item.maHoSo : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('caNhanDuocCap') ? props.item.caNhanDuocCap : ''}}</span>
              </div>
            </td>
            <td class="text-xs-left py-2" style="height:36px;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.hasOwnProperty('donViCap') ? props.item.donViCap : ''}}</span>
              </div>
            </td>
            <td class="text-xs-center py-2" style="height:36px;min-width:120px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span :style="props.item.isKyso == true ? 'color: green' : 'color: red'">
                  {{props.item.isKyso == true ? 'Đã ký số' : 'Chưa ký số'}}
                </span>
              </div>
            </td>
            <td class="text-center py-2" style="height:36px;min-width:50px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-tooltip top class="">
                <v-btn @click="viewDocument(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                  <v-icon size="22">visibility</v-icon>
                </v-btn>
                <span>Xem giấy tờ</span>
              </v-tooltip>
              <!-- <v-tooltip top v-if="!loadingTable" class="mr-2">
                <v-btn @click="showEditDocument(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                  <v-icon size="22">edit</v-icon>
                </v-btn>
                <span>Cập nhật giấy tờ</span>
              </v-tooltip> -->
              <!-- <v-tooltip top v-if="!loadingTable" class="mr-2">
                <v-btn @click="showEditDocument(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                  <v-icon size="22">drive_file_rename_outline</v-icon>
                </v-btn>
                <span>Ký số</span>
              </v-tooltip> -->
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center mt-2">
            Không có giấy tờ
          </div>
        </template>
      </v-data-table>

      <div class="my-2" v-if="totalDocument > numberPerPage">
        <div class="text-xs-right layout wrap" style="position: relative;">
          <div class="flex pagging-table"> 
            <pagination :total="totalDocument" :page="documentPage" :numberPerPage="numberPerPage" nameRecord="giấy tờ" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></pagination> 
          </div>
        </div>
      </div>
    </v-card>
    
    <v-dialog v-model="dialogPDF" max-width="1200" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Giấy tờ tài liệu</v-toolbar-title>
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
    <input type="file" id="fileImport" @input="uploadFileImport($event)" style="display:none">
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  import Pagination from './Pagination.vue'
  import Search from './FormTimKiem.vue'
  import VueConfirmDialog from 'vue-confirm-dialog'
  Vue.use(toastr)
  Vue.use(VueConfirmDialog)
  Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    components: {
      'tim-kiem': Search,
      'pagination': Pagination
    },
    data: () => ({
      daKy: true,
      chuaKy: true,
      processingImport: false,
      processingSigning: false,
      valid: false,
      applicantNameCreate: '',
      applicantIdNoCreate: '',
      govAgencyCreate: '',
      createDate: '',
      expireDate: '',
      showDetail: false,
      fileTemplateList: [],
      statusCreate: 1,
      fileTemplateNoCreate: '',
      fileName: '',
      fileNo: '',
      fileUpdate: '',
      fileNameUpdate: '',
      documentSelect: '',
      loadingAction: false,
      showAdvanceSearch: false,
      showApplicantInfo: false,
      dataInputSearch: '',
      loadingTable: false,
      documentApplicantList: [],
      totalDocument: 0,
      documentPage: 1,
      numberPerPage: 30,
      totalPage: 0,
      dialogViewFileSign: false,
      pathNameFileESign: '',
      dialogPDF: false,
      isDvc: false,
      maxFileSize: 100,
      typeCreate: 'create',
      fileNameView: '',
      srcDownload: '',
      fileEntryESign: '',
      hasEsign: false,
      statusList: [
        {text: 'Yêu cầu số hóa', value: 0},
        {text: 'Có hiệu lực', value: 1},
        {text: 'Hết hiệu lực', value: 2},
        {text: 'Hủy', value: 3}
      ],
      applicantInfos: '',
      documentListHeader: [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Số hiệu giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Đường dẫn giấy tờ',
          align: 'left',
          sortable: false
        },
        {
          text: 'Ngày tạo',
          align: 'center',
          sortable: false
        },
        {
          text: 'Mã hồ sơ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Chủ sở hữu',
          align: 'center',
          sortable: false
        },
        {
          text: 'Đơn vị cấp',
          align: 'center',
          sortable: false
        },
        {
          text: 'Trạng thái',
          align: 'center',
          sortable: false
        },
        {
          text: 'Thao tác',
          align: 'center',
          sortable: false
        }
      ],
      hosoDatasTotal: 0,
      selected: [],
      selectMultiplePage: [],
      uriDocument: '',
      mappingFileSignedUpdate: {
        dossierFiles: '',
        fileEntries: ''
      },
      uriConfig: ''
    }),
    computed: {
    },
    beforeDestroy () {
    },
    mounted () {
     let vm = this
    },
    beforeCreate() {
    },
    created () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      try {
        vm.srcDownload = srcDownloadTemplate
      } catch (error) {
      }
      try {
        vm.numberPerPage = numberPerPage ? numberPerPage : 30
      } catch (error) {
      }
      vm.selectMultiplePage = []
      vm.getUriDocument()
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        // vm.getDanhSachGiayToSoHoa()
      },
      selectMultiplePage: {
        handler: function (val) {
          let vm = this
          if (val.length > 0) {
            vm.selectedDocument = []
            for (let key in val) {
              vm.selectedDocument = vm.selectedDocument.concat(val[key]['selected'])
            }
          } else {
            vm.selectedDocument = []
          }
          console.log('selectedDoAction', vm.selectedDocument)
          
        },
        deep: true
      },
    },
    methods: {
      changeFilterStatus () {
        let vm = this
        setTimeout(function () {
          vm.getDanhSachGiayToSoHoa()
        }, 100)
      },
      toggleAll () {
        let vm = this
        if (vm.selected.length) {
          vm.selected = []
        } else {
          vm.selected = vm.documentApplicantList.filter(function (item) {
            return !item['isKyso']
          })
        }
        
        vm.selectMultiplePage[vm.documentPage - 1]['selected'] = vm.selected
        console.log('selected toggle all', vm.selectMultiplePage)
      },
      changeSelected () {
        let vm = this
        vm.selectMultiplePage[vm.documentPage - 1]['selected'] = vm.selected
        console.log('selected item', vm.selectMultiplePage)
      },
      downloadTemplate () {
        let vm = this
        if (vm.srcDownload) {
          document.getElementById('downloadFile').click()
        } else {
          toastr.error('Chưa có mẫu import')
        }
      },
      pickFileImport () {
        document.getElementById('fileImport').value = ''
        document.getElementById('fileImport').click()
      },
      uploadFileImport () {
        let vm = this
        let files = $('#fileImport')[0].files
        let file = files[0]
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          },
          params: {}
        }
        let dataPost = new FormData()
        dataPost.append("file", file)
        dataPost.append("sheetAt", 0)
        dataPost.append("startCol", 0)
        dataPost.append("endCol", 9)
        dataPost.append("startRow", 1)
        dataPost.append("endRow", 500)
        dataPost.append("table", "opencps_excel_data")
        vm.processingImport = true
        axios.post('/o/rest/v2/applicantdatas/excelData', dataPost, param).then(function (response) {
          vm.processingImport = false
          toastr.success('Import thành công')
        }).catch(xhr => {
          vm.processingImport = false
          toastr.error('Import thất bại')
        })
      },
      showTimKiem () {
        this.showAdvanceSearch = true
      },
      getUriDocument () {
        let vm = this
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            Token: window.Liferay ? window.Liferay.authToken : ''
          }
        }
        let url = '/o/rest/v2/serverconfigs/URI_TAILIEUSOHOA'
        axios.get(url, param).then(function (response) {
          let serializable = response.data
          console.log('uriConfig', JSON.parse(serializable.configs)['uri'])
          vm.uriConfig = JSON.parse(serializable.configs)['uri']
          if (vm.uriConfig) {
            vm.getDanhSachGiayToSoHoa()
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      signDocument () {
        let vm = this
        if (vm.selectedDocument && vm.selectedDocument.length) {
          vm.$confirm(
            {
              message: 'Tổng số ' + vm.selectedDocument.length + ' giấy tờ sẽ được ký số',
              button: {
                no: 'Thoát',
                yes: 'Đồng ý'
              },
              callback: confirm => {
                if (confirm) {
                  vm.kySoGop()
                }
              }
            }
          )
        } else {
          toastr.error("Chưa có giấy tờ nào được chọn")
        }
      },
      kySoGop () {
        let vm = this
        let signFileCallBack = function (rv) {
          let received_msg = JSON.parse(rv)
          console.log('received_msg_kysogop', received_msg)
          if (received_msg.Status == 0 && received_msg.Message && received_msg.Files) {
            let dataFiles = received_msg.Files
            let dossierFiles = []
            let fileEntries = []
            dataFiles.forEach(element => {
              let signed = JSON.parse(element.FileSignedURL)
              let fileEntryId = signed['fileEntryId']
              let dossierFileId = element['FileID']
              dossierFiles.push(dossierFileId)
              fileEntries.push(fileEntryId)
            });
            vm.mappingFileSignedUpdate.dossierFiles = dossierFiles.toString()
            vm.mappingFileSignedUpdate.fileEntries = fileEntries.toString()
            console.log('vm.mappingFileSignedUpdate', vm.mappingFileSignedUpdate)
            let dataUpdateFile = {
              fileEntryIdStr: vm.mappingFileSignedUpdate.fileEntries,
              excelDataIdStr: vm.mappingFileSignedUpdate.dossierFiles
            }
            vm.$store.dispatch('updateFileKySoVgca', dataUpdateFile).then(res => {
              toastr.success('Ký số thành công')
              vm.getDanhSachGiayToSoHoa(vm.dataInputSearch, 'reset')
            }).catch(function() {
              toastr.error('Ký số thất bại')
            })
          }
        }
        
        let fileArr = []
        vm.selectedDocument.forEach((element, index) => {
          let prms = {
            "FileID": element.excelDataId,
            "FileName": element.tenGiayTo,
            "URL": element.tenFile
          }
          fileArr.push(prms)
        });
        let paramsInput = {
          "FileUploadHandler": window.themeDisplay.getPortalURL() + '/o/rest/v2/vgca/fileupload',
          "SessionId": "",
          "Files": fileArr
        }
        console.log('paramsInput123123', paramsInput)
        let json_prms = JSON.stringify(paramsInput)
        vgca_sign_files(json_prms, signFileCallBack)
      },
      searchGiayToSoHoa (data) {
        let vm = this
        console.log('dataInputSearch', data)
        vm.dataInputSearch = data
        vm.documentPage = 1
        vm.totalDocument = 0
        vm.getDanhSachGiayToSoHoa(data)
      },
      cancelSearchGiayToSoHoa (data) {
        let vm = this
        console.log('dataInputSearch2', data)
        vm.showAdvanceSearch = false
        vm.dataInputSearch = data
        vm.documentPage = 1
        vm.totalDocument = 0
        vm.getDanhSachGiayToSoHoa(data)
      },
      changePage (config) {
        let vm = this
        vm.documentPage = config.page
        vm.getDanhSachGiayToSoHoa(vm.dataInputSearch)
      },
      getDanhSachGiayToSoHoa (dataSearch, reset) {
        let vm = this
        if (reset) {
          vm.documentPage = 1
          vm.selected = []
          vm.selectMultiplePage = []
        }
        let filter = {
          start: vm.documentPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.documentPage * vm.numberPerPage,
          maHoSo: dataSearch ? dataSearch.dossierNoSearch : '',
          soHieuVanBan: dataSearch ? dataSearch.soHieuVanBanSearch : '',
          tenGiayTo: dataSearch ? dataSearch.tenFileSearch : '',
          maThuTuc: dataSearch ? dataSearch.maThuTucSearch : '',
          keyword: dataSearch ? dataSearch.keywordSearch : ''
        }
        if ((vm.daKy && !vm.chuaKy) || (!vm.daKy && vm.chuaKy)) {
          if (vm.daKy) {
            filter.isKyso = true
          }
          if (!vm.daKy) {
            filter.isKyso = false
          }
        }
        let currentQuery = vm.$router.history.current.query
        vm.loadingTable = true
        vm.$store.dispatch('getApplicantDocument', filter).then(function (result) {
          if (result.hasOwnProperty('data')) {
            vm.documentApplicantList = Array.from(result.data, function (e) {
              return Object.assign(e, {tenFile: vm.uriConfig + e.tenFile})
            })
          } else {
            vm.documentApplicantList = []
          }
          console.log('documentApplicantList', vm.documentApplicantList)
          vm.totalDocument = result['total']
          //
          vm.totalPage = Math.ceil(vm.totalDocument / vm.numberPerPage)
          if (vm.totalPage > 0 && vm.selectMultiplePage.length === 0) {
            for (let key = 0; key < vm.totalPage; key++) {
              let item = {
                selected: [],
                page: key + 1
              }
              vm.selectMultiplePage.push(item)
            }
          }
          vm.selected = vm.selectMultiplePage[vm.documentPage - 1]['selected']
          // 
          vm.loadingTable = false
        }).catch(function () {
          vm.loadingTable = false
          vm.documentApplicantList = []
          vm.totalDocument = 0
          vm.selectMultiplePage = []
          vm.selected = []
        })
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
        vm.dialogPDF = true
        document.getElementById('dialogPDFPreview').src = item.tenFile
      },
      showEditDocument (item) {
        let vm = this
        vm.updateFile = false
        $('html, body').animate({
            scrollTop: $('#top-header').offset().top,
          },
          100,
          'linear'
        )
        vm.documentSelect = item
        vm.typeCreate = 'update'
        vm.fileNameView = item.fileName
        try {
          vm.fileTemplateNoCreate = vm.fileTemplateList.filter(function (items) {
            return items.fileTemplateNo === item.fileTemplateNo
          })[0]
        } catch (error) {
        }
        vm.statusCreate = item.status
        vm.fileName = item.fileName
        vm.fileNo = item.fileNo
        vm.govAgencyCreate = item.govAgencyName ? item.govAgencyName : ''
        vm.applicantNameCreate = item.applicantName ? item.applicantName : ''
        vm.applicantIdNoCreate = item.applicantIdNo ? item.applicantIdNo : ''
        vm.createDate = item.issueDate ? String(item.issueDate).split(" ")[0] : ''
        vm.expireDate = item.expireDate ? String(item.expireDate).split(" ")[0] : ''
        vm.showDetail = true
      },
      showCreatedocument () {
        let vm = this
        vm.showDetail = true
        vm.typeCreate = 'create'
        vm.pathNameFileESign = ''
        vm.fileNameView = ''
        vm.fileName = ''
        vm.fileNo = ''
        vm.updateFile = false
        setTimeout(function () {
          // vm.$refs.form.reset()
          vm.$refs.form.resetValidation()
          if (vm.showApplicantInfo) {
            vm.applicantIdNoCreate = vm.applicantInfos.applicantIdNo
            vm.applicantNameCreate = vm.applicantInfos.applicantName
          }
          vm.statusCreate = 1
        }, 200)
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
              dataCreateFile.append('applicantIdNo', vm.applicantIdNoCreate)
              dataCreateFile.append('applicantName', vm.applicantNameCreate)
              dataCreateFile.append('govAgencyName', vm.govAgencyCreate)
              dataCreateFile.append('file', vm.fileUpdate)
              dataCreateFile.append('issueDate', vm.createDate)
              dataCreateFile.append('expireDate', vm.expireDate)
              dataCreateFile.append('serviceCode', '')
              dataCreateFile.append('templateNo', '')
              dataCreateFile.append('desciption', '')
              dataCreateFile.append('dossierNo', '')
              
              axios.post(url, dataCreateFile, param).then(result1 => {
                vm.loadingAction = false
                toastr.success('Thêm mới giấy tờ thành công')
                vm.showDetail = false
                setTimeout(function () {
                  vm.getDanhSachGiayToSoHoa()
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
        } else {
          vm.createDocumentKySo()
        }
      },
      createDocumentKySo () {
        let vm = this
        if (vm.$refs.form.validate()) {
          if (vm.fileNameView) {
            vm.loadingAction = true
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
            dataCreateFile.append('applicantIdNo', vm.applicantIdNoCreate)
            dataCreateFile.append('applicantName', vm.applicantNameCreate)
            dataCreateFile.append('govAgencyName', vm.govAgencyCreate)
            dataCreateFile.append('fileEntryId', vm.fileEntryESign)
            dataCreateFile.append('issueDate', vm.createDate)
            dataCreateFile.append('expireDate', vm.expireDate)
            dataCreateFile.append('serviceCode', '')
            dataCreateFile.append('templateNo', '')
            dataCreateFile.append('desciption', '')
            dataCreateFile.append('file', '')
            dataCreateFile.append('dossierNo', '')
                
            axios.post(url, dataCreateFile, param).then(result1 => {
              vm.loadingAction = false
              toastr.success('Thêm mới tài liệu thành công')
              vm.showDetail = false
              setTimeout(function () {
                vm.getDanhSachGiayToSoHoa()
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
            dataPost.append('applicantIdNo', vm.applicantIdNoCreate)
            dataPost.append('applicantName', vm.applicantNameCreate)
            dataPost.append('govAgencyName', vm.govAgencyCreate)
            dataPost.append('issueDate', vm.createDate)
            dataPost.append('expireDate', vm.expireDate)
            dataPost.append('serviceCode', '')
            dataPost.append('templateNo', '')
            dataPost.append('desciption', '')
            
            if (vm.updateFile) {
              dataPost.append('file', vm.fileUpdate)
            } else {
              dataPost.append('file', '')
            } 
            axios.put(url, dataPost, param).then(result1 => {
              vm.loadingAction = false
              toastr.success('Cập nhật tài liệu thành công')
              vm.showDetail = false
              setTimeout(function () {
                vm.getDanhSachGiayToSoHoa()
              }, 200)
            }).catch(xhr => {
              vm.loadingAction = false
              toastr.error('Cập nhật thất bại. Vui lòng thử lại.')
            })
            
          }
        } else {
          vm.updateDocumentKySo()
        }
      },
      updateDocumentKySo () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loadingAction = true
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
          dataPost.append('applicantIdNo', vm.documentSelect.applicantIdNo)
          dataPost.append('fileEntryId', vm.fileEntryESign)
          dataPost.append('govAgencyName', vm.govAgencyCreate)
          dataPost.append('issueDate', vm.createDate)
          dataPost.append('expireDate', vm.expireDate)
          dataPost.append('serviceCode', '')
          dataPost.append('templateNo', '')
          dataPost.append('desciption', '')
          dataPost.append('file', '')
          axios.put(url, dataPost, param).then(result1 => {
            vm.loadingAction = false
            toastr.success('Cập nhật tài liệu thành công')
            vm.showDetail = false
            setTimeout(function () {
              vm.getDanhSachGiayToSoHoa()
            }, 200)
          }).catch(xhr => {
            vm.loadingAction = false
            toastr.error('Cập nhật thất bại. Vui lòng thử lại.')
          })
          
        }
      },
      vgca_sign_approved() {
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
              let urlPdf = dataSigned.url
              if (window.top.location.protocol === 'https:') {
                urlPdf = urlPdf.replace('http:', 'https:')
              }
              urlPdf = urlPdf.replace(':80/', '/')
              vm.pathNameFileESign = urlPdf
              vm.fileNameView = urlPdf
            } catch (error) {
            }
            console.log('dataSigned', dataSigned)
            toastr.clear()
            toastr.success('Giấy tờ đã được ký duyệt')
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
      formatDate () {
        let vm = this
        let lengthDate = String(vm.createDate).trim().length
        let splitDate = String(vm.createDate).split('/')
        if (lengthDate && lengthDate > 4 && splitDate.length === 3 && splitDate[2]) {
          vm.createDate = vm.translateDate(vm.createDate)
        } else if (lengthDate && lengthDate === 8) {
          let date = String(vm.createDate)
          vm.createDate = date.slice(0,2) + '/' + date.slice(2,4) + '/' + date.slice(4,8)
        } else {
          vm.createDate = ''
        }     
      },
      formatExpireDate () {
        let vm = this
        let lengthDate = String(vm.expireDate).trim().length
        let splitDate = String(vm.expireDate).split('/')
        if (lengthDate && lengthDate > 4 && splitDate.length === 3 && splitDate[2]) {
          vm.expireDate = vm.translateDate(vm.expireDate)
        } else if (lengthDate && lengthDate === 8) {
          let date = String(vm.expireDate)
          vm.expireDate = date.slice(0,2) + '/' + date.slice(2,4) + '/' + date.slice(4,8)
        } else {
          vm.expireDate = ''
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
    }
  }
</script>

