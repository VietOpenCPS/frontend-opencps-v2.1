<template>
  <div style="padding: 0px 25px; max-width: 1500px; margin: 0px auto" class="mt-5 pb-3" id="top-header">
      <v-card v-if="!showDetail" class="px-3 py-3" style="width: 100%; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
        <div class="headline mb-3" style="font-size: 20px!important;">KHO GIẤY TỜ, TÀI LIỆU</div>
        <v-btn color="#0072bc" small class="mx-0 white--text" @click.stop="showTimKiem" style="position: absolute; right: 17px; top: 15px;">
          <v-icon size="20">
            filter_alt
          </v-icon> &nbsp;
          Lọc danh sách
        </v-btn>
        <v-card-text class="px-0" v-if="showAdvanceSearch">
          <tim-kiem ref="timkiem" :inputSearch="inputSearch" v-on:trigger-search="searchGiayToSoHoa" v-on:trigger-cancel="cancelSearchGiayToSoHoa"></tim-kiem>
        </v-card-text>
        <v-card-text class="px-0 py-0" v-if="showApplicantInfo">
          <v-layout wrap class="px-0 py-0">
            <v-flex xs12 sm5 class="pr-2">
              <div class="xs12 sm12 pb-1 mb-1">
                <span class="pr-2">Tên công dân, tổ chức , doanh nghiệp: </span>
                <span class="pl-0 text-bold"> {{applicantInfos.applicantName}}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm7 class="mb-1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Số CMND/ CCCD, mã tổ chức, doanh nghiệp: </span>
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
        <v-btn color="#0072bc" small class="mx-0 white--text" @click.stop="showCreatedocument">
          <v-icon size="20">
            post_add
          </v-icon> &nbsp;
          Thêm mới giấy tờ
        </v-btn>
        <v-data-table
          :headers="documentListHeader"
          :items="documentApplicantList"
          hide-actions
          class="table-landing table-bordered mt-2"
          style="border-left: 1px solid #dedede"
        >
          <v-progress-linear v-if="loadingTable" slot='progress' color="blue" indeterminate></v-progress-linear>
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
              <td class="text-xs-left py-2" style="height:36px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('fileNo') ? props.item.fileNo : ''}}</span>
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
              <td class="text-xs-left py-2" style="height:36px;">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hasOwnProperty('applicantName') ? props.item.applicantName : ''}}</span><br>
                  <span>{{props.item.hasOwnProperty('applicantIdNo') ? props.item.applicantIdNo : ''}}</span>
                </div>
              </td>
              <td class="text-xs-center py-2" style="height:36px;min-width:120px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span :style="props.item.status === 1 ? 'color: green' : (props.item.status === 2 ? 'color: red' : 'color: orange')">
                    {{props.item.hasOwnProperty('status') ? getStatus(props.item.status) : ''}}
                  </span>
                </div>
              </td>
              <td class="text-right py-2" style="height:36px;min-width:150px">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-tooltip top v-if="!loadingTable && props.item.fileEntryId" class="mr-2">
                  <v-btn @click="viewDocument(props.item)" color="blue" slot="activator" flat icon class="mx-0 my-0">
                    <v-icon size="22">visibility</v-icon>
                  </v-btn>
                  <span>Xem giấy tờ</span>
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
                  <span>Cập nhật giấy tờ</span>
                </v-tooltip>
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
      <v-card v-else class="px-3 py-3" style="width: 100%; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
        <div class="headline mb-0" style="font-size: 20px!important;">
          <span v-if="typeCreate === 'create'">THÊM MỚI GIẤY TỜ</span>
          <span v-else>KÝ DUYỆT, CẬP NHẬT GIẤY TỜ</span>
        </div>
        <v-card-text class="py-1 px-0">
          <v-form ref="form" v-model="valid" lazy-validation class="px-0 grid-list">
            <v-layout row wrap class="px-0 py-3">
              <!-- <v-flex xs12 md6 class="px-0 pr-3">
                <v-autocomplete
                  :items="serviceInfoList"
                  v-model="serviceInfoCreate"
                  label="Chọn thủ tục hành chính"
                  item-text="serviceName"
                  item-value="serviceCode"
                  return-object
                  :hide-selected="true"
                  box
                  :rules="[v => !!v || 'Thủ tục là bắt buộc']"
                  required
                  @change="changeService"
                  clearable
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md6 class="px-0">
                <v-autocomplete
                  :items="optionList"
                  v-model="optionCreate"
                  label="Chọn trường hợp"
                  item-text="optionName"
                  item-value="templateNo"
                  return-object
                  :hide-selected="true"
                  box
                  :rules="[v => !!v || 'Trường hợp là bắt buộc']"
                  required
                  @change="changeOption"
                  clearable
                ></v-autocomplete>
              </v-flex> -->
              <v-flex xs12 class="pr-0 pl-0">
                <v-autocomplete
                  :items="fileTemplateList"
                  v-model="fileTemplateNoCreate"
                  label="Loại giấy tờ"
                  item-text="name"
                  item-value="fileTemplateNo"
                  return-object
                  :hide-selected="true"
                  box
                  :rules="[v => !!v || 'Loại giấy tờ là bắt buộc']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 class="px-0">
                <v-text-field
                  label="Tên giấy tờ"
                  v-model="fileName"
                  box
                  clearable
                  :rules="[v => !!v || 'Tên giấy tờ là bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 class="px-0 pr-3">
                <v-text-field
                  label="Số hiệu giấy tờ"
                  v-model="fileNo"
                  box
                  clearable
                  :rules="[v => !!v || 'Số hiệu giấy tờ là bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 class="px-0 pr-3">
                <v-text-field
                  label="Ngày cấp"
                  v-model="createDate"
                  placeholder="dd/mm/yyyy, ddmmyyyy"
                  @blur="formatDate"
                  box
                  :rules="[v => !!v || 'Ngày cấp là bắt buộc']"
                  required
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 class="px-0 pr-3">
                <v-text-field
                  label="Ngày hết hạn"
                  v-model="expireDate"
                  placeholder="dd/mm/yyyy, ddmmyyyy"
                  @blur="formatExpireDate"
                  box
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm3 class="px-0">
                <v-autocomplete
                  :items="statusList"
                  v-model="statusCreate"
                  label="Tình trạng"
                  item-text="text"
                  item-value="value"
                  :hide-selected="true"
                  box
                ></v-autocomplete>
              </v-flex>
              
              <v-flex xs12 class="px-0">
                <v-text-field
                  label="Đơn vị cấp"
                  v-model="govAgencyCreate"
                  box
                  :rules="[v => !!v || 'Đơn vị cấp là bắt buộc']"
                  required
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 class="px-0 pr-3">
                <v-text-field
                  label="Số cmnd/cccd, MST doanh nghiệp, tổ chức"
                  v-model="applicantIdNoCreate"
                  box
                  :rules="[v => !!v || 'Thông tin bắt buộc']"
                  required
                  :readonly="typeCreate === 'update'"
                ></v-text-field>
              </v-flex> 
              <v-flex xs12 sm6 class="px-0 pr-0">
                <v-text-field
                  label="Chủ sở hữu"
                  v-model="applicantNameCreate"
                  box
                  :rules="[v => !!v || 'Chủ sở hữu giấy tờ là bắt buộc']"
                  required
                  :readonly="typeCreate === 'update'"
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
                  Tải lên giấy tờ
                </v-btn>
                <v-btn block color="primary" class="mx-0 px-0 d-inline-block" dark @click.native="vgca_sign_approved('https://kiemthu-mt-gov-vn-9001.fds.vn')" style="width: 230px">
                  <v-icon size="16">border_color</v-icon> &nbsp; &nbsp;
                  Tải lên và ký duyệt giấy tờ
                </v-btn>
                <div v-if="fileTemplateNoCreate && fileTemplateNoCreate.fileType">
                  <span style="color:red">(*) </span>
                  <span>File tải lên chấp nhận các định dạng: {{fileTemplateNoCreate.fileType}} .</span>
                </div>
              </v-flex>
            </v-layout>
          </v-form>
          <v-flex class="text-right">
            <v-btn class="mr-2 white--text" color="red" :disabled="loadingAction" @click.native="showDetail = false">
              <v-icon>reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
            <v-btn v-if="typeCreate === 'create'" :disabled="loadingAction" class="mr-0" color="primary" @click.native="createDocument">
              <v-icon>save</v-icon> &nbsp;
              <span>Thêm mới</span> 
            </v-btn>
            <v-btn v-else :disabled="loadingAction" class="mr-0" color="primary" @click.native="updateDocument">
              <v-icon>save</v-icon> &nbsp;
              <span>Cập nhật</span> 
            </v-btn>
          </v-flex>
        </v-card-text>
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
      inputSearch: {
        applicantName: '',
        applicantIdNo: '',
        fileTemplateNo: '',
        status: '',
        keywordSearch: '',
        fileNoSearch: '',
        name: ''
      },
      dataInputSearch: '',
      loadingTable: false,
      documentApplicantList: [],
      totalDocument: 0,
      documentPage: 1,
      numberPerPage: 15,
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
          text: 'Chủ sở hữu',
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
      let currentQuery = vm.$router.history.current.query
      if (currentQuery.hasOwnProperty('applicantIdNo') && currentQuery.applicantIdNo) {
        let param = {
          headers: {
            groupId: 0
          },
          params: {
            start: 0,
            end: 1,
            idNo: currentQuery.applicantIdNo
          }
        }
        axios.get('/o/rest/v2/applicants', param).then(response => {
          if (response.data.hasOwnProperty('data') && response.data.data.length) {
            vm.applicantInfos = response.data.data[0]
            vm.inputSearch = {
              applicantIdNo: currentQuery.applicantIdNo,
              applicantName: vm.applicantInfos.applicantName
            }
          } else {
          }
        }).catch(function () {
        })
        vm.showApplicantInfo = true
        vm.getDanhSachGiayToSoHoa()
      } else {
        vm.getDanhSachGiayToSoHoa()
      }
      vm.getDanhMucGiayTo()
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('applicantIdNo') && currentQuery.applicantIdNo) {
          let param = {
            headers: {
              groupId: 0
            },
            params: {
              start: 0,
              end: 1,
              idNo: currentQuery.applicantIdNo
            }
          }
          axios.get('/o/rest/v2/applicants', param).then(response => {
            if (response.data.hasOwnProperty('data') && response.data.data.length) {
              vm.applicantInfos = response.data.data[0]
              vm.inputSearch = {
                applicantIdNo: currentQuery.applicantIdNo,
                applicantName: vm.applicantInfos.applicantName
              }
            } else {
            }
          }).catch(function () {
          })
          vm.showApplicantInfo = true
          vm.getDanhSachGiayToSoHoa()
        } else {
          vm.showApplicantInfo = false
          vm.getDanhSachGiayToSoHoa()
        }
        vm.getDanhMucGiayTo()
      },
      fileTemplateNoCreate (val) {
        let vm = this
        if (val && vm.typeCreate === 'create') {
          vm.fileName = val.name
        }
      }
    },
    methods: {
      showTimKiem () {
        this.showAdvanceSearch = true
      },
      uploadFile () {
        let vm = this
        vm.hasEsign = false
        document.getElementById('documentFile').value = ''
        document.getElementById('documentFile').click()
      },
      getDanhMucGiayTo () {
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
      getDanhSachGiayToSoHoa (dataSearch) {
        let vm = this
        let filter = {
          start: vm.documentPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.documentPage * vm.numberPerPage,
          applicantIdNo: dataSearch ? dataSearch.applicantIdNo : '',
          fileTemplateNo: dataSearch ? dataSearch.fileTemplateNo : '',
          status: dataSearch ? dataSearch.status : '',
          fileNoSearch: dataSearch ? dataSearch.fileNoSearch : '',
          applicantName: dataSearch ? dataSearch.applicantName : '',
          applicantDataType: ''
        }
        let currentQuery = vm.$router.history.current.query
        if (currentQuery.hasOwnProperty('applicantIdNo') && currentQuery.applicantIdNo) {
          filter.applicantIdNo = currentQuery.applicantIdNo
        }
        vm.loadingTable = true
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

