<template>
  <div style="padding: 0px 25px; max-width: 1500px; margin: 0px auto" class="mt-5 pb-3">
      <v-card class="px-3 py-3" style="width: 100%; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
        <div class="headline mb-3" style="font-size: 20px!important;">DANH SÁCH GIẤY TỜ, TÀI LIỆU YÊU CẦU SỐ HÓA</div>
        <v-btn color="#0072bc" small class="mx-0 white--text" @click.stop="showTimKiem" style="position: absolute; right: 17px; top: 15px;">
          <v-icon size="20">
            search
          </v-icon> &nbsp;
          Tìm kiếm
        </v-btn>
        <v-card-text class="px-0" v-if="showAdvanceSearch">
          <tim-kiem ref="timkiem" v-on:trigger-search="searchGiayToSoHoa" v-on:trigger-cancel="cancelSearchGiayToSoHoa"></tim-kiem>
        </v-card-text>
        <v-data-table
          :headers="documentListHeader"
          :items="documentApplicantList"
          hide-actions
          class="table-landing table-bordered mt-2"
          style="border-left: 1px solid #dedede"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center py-2" style="width:50px;height:36px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{ documentPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
                </div>
              </td>
              <td class="text-xs-left py-2" style="height:36px; min-width:450px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('fileName') ? props.item.fileName : ''}}</span>
                </div>
              </td>
              <td class="text-xs-left py-2" style="height:36px;min-width:150px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('fileNo') ? props.item.fileNo : ''}}</span>
                </div>
              </td>
              <td class="text-xs-left py-2" style="height:36px; min-width:150px">
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
              <td class="text-right py-2" style="height:36px;width: 150px">
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
                <!-- <v-tooltip top v-if="!loadingTable" class="mr-2">
                  <v-btn @click="showEditDocument(props.item)" color="green" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon size="22">edit</v-icon>
                  </v-btn>
                  <span>Số hóa, cập nhật tài liệu</span>
                </v-tooltip> -->
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có giấy tờ yêu cầu số hóa
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
      <div style="display:none">
        <a id="downloadFile" :href="srcDownload" download></a>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  import Pagination from './Pagination.vue'
  import Search from './FormTimKiem.vue'
  Vue.use(toastr)

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
      showAdvanceSearch: false,
      dataInputSearch: '',
      loadingTable: false,
      documentApplicantList: [],
      totalDocument: 0,
      documentPage: 1,
      numberPerPage: 15,
      dialogViewFileSign: '',
      pathNameFileESign: '',
      dialogPDF: false,
      isDvc: false,
      documentListHeader: [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Số hiệu giấy tờ',
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
      vm.getDanhSachGiayToSoHoa()
    },
    watch: {
    },
    methods: {
      showTimKiem () {
        this.showAdvanceSearch = true
      },
      searchGiayToSoHoa (data) {
        let vm = this
        vm.dataInputSearch = data
        vm.documentPage = 1
        vm.totalDocument = 0
        vm.getDanhSachGiayToSoHoa(data)
      },
      cancelSearchGiayToSoHoa (data) {
        let vm = this
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
      getDanhSachGiayToSoHoa (dataSearch) {
        let vm = this
        let filter = {
          start: vm.documentPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.documentPage * vm.numberPerPage,
          applicantIdNo: dataSearch ? dataSearch.applicantIdNo : '',
          fileTemplateNo: dataSearch ? dataSearch.fileTemplateNo : '',
          status: 0,
          fileNoSearch: dataSearch ? dataSearch.fileNoSearch : '',
          applicantName: dataSearch ? dataSearch.applicantName : '',
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

