<template>
  <div>
    <v-form v-model="valid_thongtincongvan" ref="formThongTinCongVan" lazy-validation>
      <div>
        <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div> Thông tin công văn</div>
              <v-card>
                <v-card-text class="pt-3">
                  <v-layout wrap v-if="!congVanDaGui">
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số công văn <span style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else-if="!loading && !congVanDaGui"
                      v-model="thongTinCongVan.documentNo"
                      :rules="[rules.required, rules.checkSpace, rules.varchar100]"
                      @change="thongTinCongVan.documentNo=thongTinCongVan.documentNo.trim()"
                      required
                      ></v-text-field>
                      <p class="pt-2" v-else>{{thongTinCongVan.documentNo}}</p>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Ngày công văn <span  style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-menu
                        v-else-if="!loading && !congVanDaGui"
                        ref="menuDate"
                        :close-on-content-click="false"
                        v-model="menuDate"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          :rules="[rules.required]"
                          required
                          slot="activator"
                          v-model="dateFormated"
                          append-icon="event"
                          placeholder="dd/mm/yyyy"
                          @input="inputDate('dateFormated')"
                          @change="changeDocumentDate()"
                       
                        >
                        </v-text-field>
                        <v-date-picker ref="picker" locale="vi"
                        :first-day-of-week="1" v-model="documentDate" no-title @input="menuDate = false"></v-date-picker>
                      </v-menu>
                      <p class="pt-2" v-else>{{dateFormated}}</p>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số lượng hồ sơ đề nghị xét<span style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2 input-no-drop">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else-if="!loading && !congVanDaGui"
                      v-model="lengthDossier"
                      disabled
                      ></v-text-field>
                      <p class="pt-2" v-else>{{lengthDossier}}</p>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Ngày hẹn trả lời<span  style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-menu
                        v-else-if="!loading && !congVanDaGui"
                        ref="menuDueDate"
                        :close-on-content-click="false"
                        v-model="menuDueDate"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          :rules="[rules.required]"
                          required
                          slot="activator"
                          v-model="duedateFormated"
                          append-icon="event"
                          placeholder="dd/mm/yyyy"
                          @input="inputDate('duedateFormated')"
                          @change="changeDueDate()"
                        >
                        </v-text-field>
                        <v-date-picker :min="getMindate()" ref="picker" locale="vi"
                        :first-day-of-week="1" v-model="dueDate" no-title @input="menuDueDate = false"></v-date-picker>
                      </v-menu>
                      <p class="pt-2" v-else>{{duedateFormated}}</p>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2" v-if="formCodeInput !== 'NEW_GROUP_CV'">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">
                        <span v-if="formCodeInput === 'NEW_GROUP_CV'">Đơn vị gửi công văn </span>
                        <span v-if="formCodeInput === 'NEW_GROUP_CV_DI'">Đơn vị nhận công văn </span> 
                        <span v-if="formCodeInput === 'NEW_GROUP_CV_DI' && lengthDossier !== 0  && typeof lengthDossier !== 'undefined' && !congVanDaGui" style="color:red">&nbsp;*</span>: 
                      </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2" v-if="formCodeInput !== 'NEW_GROUP_CV'">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-autocomplete
                      v-else-if="!loading && !congVanDaGui"
                      :items="govAgencySubmitList"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="donvi_gui_nhan"
                      :rules="formCodeInput === 'NEW_GROUP_CV_DI' && lengthDossier !== 0 && typeof lengthDossier !== 'undefined' ? [rules.required] : []"
                      :required="formCodeInput === 'NEW_GROUP_CV_DI' && lengthDossier !== 0 && typeof lengthDossier !== 'undefined'"
                      :disabled="formCodeInput === 'NEW_GROUP_CV_DI' && (lengthDossier === 0 ||typeof lengthDossier === 'undefined')"
                      ></v-autocomplete>
                      <p class="pt-2" v-else>{{formCodeInput === 'NEW_GROUP_CV_DI' ? metaDataDossier.tendonvinhan : metaDataDossier.tendonvigui}}</p>
                    </v-flex>

                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Nội dung tóm tắt <span style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-textarea
                      v-else-if="!loading && !congVanDaGui"
                      v-model="thongTinCongVan.briefNote"
                      rows="3"
                      :rules="[rules.required,rules.checkSpace, rules.varchar5000]"
                      @change="thongTinCongVan.briefNote=thongTinCongVan.briefNote.trim()"
                      required
                      ></v-textarea>
                      <p class="pt-2" v-else>{{thongTinCongVan.briefNote}}</p>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Chức vụ người ký<span  style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else-if="!loading && !congVanDaGui"
                      v-model="jobposSignerCongVan"
                      :rules="[rules.required,rules.checkSpace, rules.varchar100]"
                       @change="jobposSignerCongVan=jobposSignerCongVan.trim()"
                      required
                      ></v-text-field>
                      <p class="pt-2" v-else>{{jobposSignerCongVan}}</p>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Người ký<span  style="color:red" v-if="!congVanDaGui">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else-if="!loading && !congVanDaGui"
                      v-model="signerCongVan"
                      :rules="[rules.required,rules.checkSpace, rules.varchar100]"
                      @change="signerCongVan=signerCongVan.trim()"
                      required
                      ></v-text-field>
                      <p class="pt-2" v-else>{{signerCongVan}}</p>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số điện thoại : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else-if="!loading && !congVanDaGui"
                      v-model="thongTinCongVan.contactTelNo"
                      :rules="thongTinCongVan.contactTelNo ? [rules.telNo] : ''"
                      @change="thongTinCongVan.contactTelNo=thongTinCongVan.contactTelNo.trim()"
                      ></v-text-field>
                      <p class="pt-2" v-else>{{thongTinCongVan.contactTelNo}}</p>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Địa chỉ email : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else-if="!loading && !congVanDaGui"
                      v-model="thongTinCongVan.contactEmail"
                      @change="thongTinCongVan.contactEmail=thongTinCongVan.contactEmail.trim()"
                      :rules="thongTinCongVan.contactEmail ? [rules.email] : rules.varchar100"
                      ></v-text-field>
                      <p class="pt-2" v-else>{{thongTinCongVan.contactEmail}}</p>
                    </v-flex>

                    <v-flex xs12 class="mt-2">
                      <div class="mb-2">Tài liệu đính kèm: <i v-if="fileAttachCounter === 0">(Không có tài liệu đính kèm)</i></div>
                      <div v-for="(itemFileView, index) in dossierFilesItems" :key="index">
                        <div v-if="!itemFileView.eForm">
                          <span v-on:click.stop="viewFile2(itemFileView)" class="ml-0" style="cursor: pointer;">
                            <v-icon class="mr-1" v-if="itemFileView.fileSize !== 0" :color="getDocumentTypeIcon(itemFileView.fileType)['color']"
                              :size="getDocumentTypeIcon(itemFileView.fileType)['size']">
                              {{getDocumentTypeIcon(itemFileView.fileType)['icon']}}
                            </v-icon>
                            {{itemFileView.displayName}} - 
                            <i>{{itemFileView.modifiedDate}}</i>
                          </span>
                          <v-btn icon ripple v-on:click.stop="deleteSingleFile(itemFileView, index)" class="mx-0 my-0" v-if="!onlyView && checkInput !== 1">
                            <v-icon style="color: red">delete_outline</v-icon>
                          </v-btn>
                        </div>
                      </div>

                      <input type="file" id="documentFile" @input="onUploadSingleFile($event)" style="display:none">
                      <v-btn small color="primary" class="mx-0 mt-3" dark @click.native="uploadFile" v-if="!congVanDaGui">
                        <v-icon>fas fa fa-upload</v-icon> &nbsp; &nbsp;
                        Chọn tài liệu tải lên
                      </v-btn>
                      
                    </v-flex>
                  </v-layout>
                  <v-layout wrap v-else>
                    <v-flex xs12 sm4 class="pr-3">
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Số công văn: </span>
                        <span class="pl-0 text-bold"> {{thongTinCongVan.documentNo}}</span>
                      </div>
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Ngày công văn: </span>
                        <span class="pl-0 text-bold"> {{dateFormated}}</span>
                      </div>
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Ngày hẹn trả lời: </span>
                        <span class="pl-0 text-bold"> {{duedateFormated}}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 sm4 class="pr-3">
                      <div class="xs12 sm12 pb-2">
                        <span v-if="formCodeInput === 'NEW_GROUP_CV'" class="pr-2">Đơn vị gửi công văn: </span>
                        <span v-if="formCodeInput === 'NEW_GROUP_CV_DI'" class="pr-2">Đơn vị nhận công văn: </span> 
                        <span class="pl-0 text-bold"> {{formCodeInput === 'NEW_GROUP_CV_DI' ? metaDataDossier.tendonvinhan : metaDataDossier.tendonvigui}}</span>
                      </div>
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Chức vụ người ký: </span>
                        <span class="pl-0 text-bold"> {{jobposSignerCongVan}}</span>
                      </div>
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Người ký: </span>
                        <span class="pl-0 text-bold"> {{signerCongVan}}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 sm4 class="pr-3">
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Số lượng hồ sơ đề nghị xét: </span>
                        <span class="pl-0 text-bold"> {{lengthDossier}}</span>
                      </div>
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Số điện thoại: </span>
                        <span class="pl-0 text-bold"> {{thongTinCongVan.contactTelNo}}</span>
                      </div>
                      <div class="xs12 sm12 pb-2">
                        <span class="pr-2">Địa chỉ email: </span>
                        <span class="pl-0 text-bold"> {{thongTinCongVan.contactEmail}}</span>
                      </div>
                    </v-flex>
                    <v-flex xs12 class="pr-3">
                      <span class="pr-2">Nội dung tóm tắt: </span>
                      <span class="pl-0 text-bold"> {{thongTinCongVan.briefNote}}</span>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </div>
    </v-form>
    <thong-tin-quyet-dinh v-if="taoQuyetDinh" ref="thongtinquyetdinh" ></thong-tin-quyet-dinh>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <span>Tài liệu đính kèm</span>
          </v-toolbar-title>
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
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreviewCV" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Suggestions from 'v-suggestions'
import toastr from 'toastr'
import TinyPagination from '../../components/pagging/opencps_pagination'
import ThongTinQuyetDinh from './TiepNhanHoSo_ThongTinQuyetDinh'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  components: {
    'suggestions': Suggestions,
    'tiny-pagination': TinyPagination,
    'thong-tin-quyet-dinh': ThongTinQuyetDinh
  },
  props: ['formCodeInput', 'detailDossier', 'donvinhanCollection', 'taoQuyetDinh',
    'tphs', 'lengthDossier', 'createFileCongVan', 'requiredCVDenGroupId', 'requiredCVDenGovCode'],
  data: () => ({
    loading: false,
    dialogPDFLoading: false,
    dialogPDF: false,
    valid_thongtincongvan: true,
    thongTinCongVan: '',
    donvi_gui_nhan: '',
    dossierFilesItems: [],
    fileAttachCounter: 0,
    menuDate: false,
    menuDueDate: false,
    documentDate: null,
    dateFormated: null,
    dueDate: null,
    duedateFormated: null,
    agencySubmit: '',
    govAgencySubmitList: [],
    briefNote: '',
    sampleCount: '',
    contactTelNo: '',
    contactEmail: '',
    congVanDaGui: '',
    metaDataDossier: '',
    jobposSignerCongVan: '',
    signerCongVan: '',
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
        return pattern.test(value) || 'Gồm các ký tự 0-9'
      },
      checkSpace: (val) => {
        if(val){
          return val.replace(/\s/g, '').length ? true : 'Không hợp lệ'
        }
      },
      checkLength: (val) => {
        if(val){
          return val.length < 255 ? true : 'Không được nhập quá 255 ký tự'
        }      
      },
      varchar100: (val) => {
        if(val){
          return val.length < 100 ? true : 'Không được nhập quá 100 ký tự'
        }      
      },
      varchar255: (val) => {
        if(val){
          return val.length < 255 ? true : 'Không được nhập quá 255 ký tự'
        }      
      },
      varchar500: (val) => {
        if(val){
          return val.length < 255 ? true : 'Không được nhập quá 500 ký tự'
        }      
      },
      varchar5000: (val) => {
        if(val){
          return val.length < 255 ? true : 'Không được nhập quá 5000 ký tự'
        }      
      },
    },
    
  }),
  computed: {
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    userLoginInfomation () {
      return this.$store.getters.getUserLogin
    },
    employeeLoginInfomation () {
      return this.$store.getters.getEmployeeLogin
    },
  },
  created () {
    let vm = this
    vm.documentDate = new Date().toISOString().substr(0, 10)
    vm.getGovAgencyList()
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    documentDate (val) {
      this.dateFormated = this.formatDate(this.documentDate)
    },
    dueDate (val) {
      this.duedateFormated = this.formatDate(this.dueDate)
    },
    employeeLoginInfomation () {
      let vm = this
      vm.getGovAgencyList()
    },
    donvinhanCollection () {
      let vm = this
      if (vm.employeeLoginInfomation) {
        vm.getGovAgencyList()
      }
    },
    requiredCVDenGovCode () {
      let vm = this
      vm.getGovAgencyList()
    },
    createFileCongVan (val) {
      let vm = this
      if (val && vm.dossierFilesItems) {
        vm.dossierFilesItems = vm.dossierFilesItems.filter(function (item) {
          return item.dossierPartNo == val
        })
      }
    },
    dossierFilesItems (val) {
      let vm = this
      vm.fileAttachCounter = val.filter(function(item) {
        return !item.eForm
      }).length
    },
    taoQuyetDinh (val) {
      let vm = this
      if (val) {
        setTimeout(function () {
          vm.$refs.thongtinquyetdinh.initData(vm.detailDossier)
        }, 100)
      }
    }
    // thongTinCongVan: {
    //   handler: function (value) {
    //     let vm = this
    //     vm.dateFormated = vm.formatDate(value.documentDate)
    //     vm.duedateFormated = vm.formatDate(value.dueDate)
    //   },
    //   deep: true
    // }
  },
  methods: {
    initData (data) {
      let vm = this
      vm.thongTinCongVan = data
      try {
        let metadata = JSON.parse(vm.thongTinCongVan.metaData)
        vm.metaDataDossier = metadata
        vm.congVanDaGui = metadata.hasOwnProperty('congvandagui') && metadata.congvandagui ? true : false
        if (vm.formCodeInput === 'NEW_GROUP_CV_DI') {
          vm.getGovAgencyList()
          vm.donvi_gui_nhan = metadata.hasOwnProperty('congvandagui') && metadata.congvandagui ? metadata.donvinhan : metadata.donvinhandraf
          vm.jobposSignerCongVan = metadata.hasOwnProperty('jobposSignerCongVan') ? metadata.jobposSignerCongVan : ''
          vm.signerCongVan = metadata.hasOwnProperty('signerCongVan') ? metadata.signerCongVan : ''
        } else {
          vm.donvi_gui_nhan = metadata.donvigui
          vm.jobposSignerCongVan = metadata.hasOwnProperty('jobposSignerCongVan') ? metadata.jobposSignerCongVan : ''
          vm.signerCongVan = metadata.hasOwnProperty('signerCongVan') ? metadata.signerCongVan : ''
        }
        
      } catch (error) {
      }
      
      vm.documentDate = vm.thongTinCongVan.hasOwnProperty('documentDate') ? vm.parseDate(vm.thongTinCongVan.documentDate) : new Date().toISOString().substr(0, 10)
      vm.dueDate = vm.thongTinCongVan.hasOwnProperty('dueDate') ? vm.parseDate(vm.thongTinCongVan.dueDate) : ''
      vm.$store.dispatch('loadDossierFiles', vm.thongTinCongVan.dossierId).then(result => {
        vm.dossierFilesItems = result
        if (vm.createFileCongVan) {
          vm.dossierFilesItems = vm.dossierFilesItems.filter(function (item) {
            return item.dossierPartNo == vm.createFileCongVan
          })
        }
      })
      vm.$refs.formThongTinCongVan.resetValidation()
      if (vm.$refs.thongtinquyetdinh) {
        vm.$refs.thongtinquyetdinh.initData(data)
      }
      console.log('thongtincongvanInput', vm.thongTinCongVan)
    },
    getThongTinCongVan () {
      let vm = this
      let delegateFilter = vm.govAgencySubmitList.filter(function (item) {
        return item.itemCode === vm.donvi_gui_nhan
      })
      let delegateName = delegateFilter.length > 0 ? delegateFilter[0]['itemName'] : ''
      vm.thongTinCongVan.dueDate = vm.parseDateToTimestamp(vm.dueDate)
      vm.thongTinCongVan.documentDate = vm.parseDateToTimestamp(vm.documentDate)
      let metaDataDossier = ''
      try {
        metaDataDossier = JSON.parse(vm.thongTinCongVan.metaData)
      } catch (error) {
      }
      let metaData = metaDataDossier ? metaDataDossier : {donvigui: '', donvinhan: '', tendonvigui: '', tendonvinhan: ''}
      let scopeUser = ''
      if (vm.employeeLoginInfomation.hasOwnProperty('scope') && vm.employeeLoginInfomation.scope) {
        scopeUser = String(vm.employeeLoginInfomation.scope).split(',')[0]
      }
      if (vm.formCodeInput === 'NEW_GROUP_CV') {
        metaData.tendonvigui = delegateName
        metaData.donvigui = vm.donvi_gui_nhan
        metaData.donvinhan = scopeUser ? scopeUser : vm.detailDossier.govAgencyCode
        metaData.jobposSignerCongVan = vm.jobposSignerCongVan
        metaData.signerCongVan = vm.signerCongVan
      } else {
        metaData.donvigui = scopeUser ? scopeUser : vm.detailDossier.govAgencyCode
        metaData.tendonvigui = vm.detailDossier.govAgencyName
        metaData.donvinhan = vm.donvi_gui_nhan
        metaData.tendonvinhan = delegateName
        metaData.jobposSignerCongVan = vm.jobposSignerCongVan
        metaData.signerCongVan = vm.signerCongVan
        metaData.taoQuyetDinh = vm.taoQuyetDinh
      }
      let thongtinquyetdinh = {}
      if (vm.$refs.thongtinquyetdinh) {
        thongtinquyetdinh = vm.$refs.thongtinquyetdinh.getThongTinQuyetDinh()
      }
      vm.thongTinCongVan.metaData = Object.assign(metaData, thongtinquyetdinh)
      vm.thongTinCongVan.sampleCount = vm.lengthDossier
      vm.thongTinCongVan.validation = vm.$refs.formThongTinCongVan.validate()
      if (vm.taoQuyetDinh) {
        let validationQuyetDinh = vm.$refs.thongtinquyetdinh.getThongTinQuyetDinh()['validation']
        vm.thongTinCongVan.validation = vm.$refs.formThongTinCongVan.validate() && validationQuyetDinh
      }
      console.log('thongtincongvanOutput', vm.thongTinCongVan)
      return vm.thongTinCongVan
    },
    uploadFile () {
      let vm = this
      document.getElementById('documentFile').value = ''
      document.getElementById('documentFile').click()
    },
    onUploadSingleFile () {
      let vm = this
      console.log('tphs', vm.tphs)
      let tphsDungChung
      if (vm.createFileCongVan) {
        tphsDungChung = vm.tphs.filter(function(item) {
          return item.partNo == vm.createFileCongVan
        })[0]
      } else {
        tphsDungChung = vm.tphs.filter(function(item) {
          return item.partType == 6
        })[0]
      }
      
      let filter = Object.assign(vm.detailDossier, tphsDungChung)
      vm.$store.dispatch('uploadSingleFileGroupCongVan', filter).then(function (result) {
        vm.$store.dispatch('loadDossierFiles', filter.dossierId).then(result => {
          vm.dossierFilesItems = result
          if (vm.createFileCongVan) {
            vm.dossierFilesItems =  vm.dossierFilesItems.filter(function (item) {
              return item.dossierPartNo == vm.createFileCongVan
            })
          }
        })
      })
    },
    deleteSingleFile (item, index) {
      var vm = this
      let x = confirm('Bạn có chắc chắn xóa file đính kèm ?')
      if (x) {
        item['dossierId'] = vm.detailDossier.dossierId
        vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
          vm.$store.dispatch('loadDossierFiles', vm.detailDossier.dossierId).then(result => {
            vm.dossierFilesItems = result
            if (vm.createFileCongVan) {
              vm.dossierFilesItems = vm.dossierFilesItems.filter(function (item) {
                return item.dossierPartNo == vm.createFileCongVan
              })
            }
          })
        }).catch(reject => {
          
        })
      }
    },
    viewFile2 (data) {
      var vm = this
      if (data.fileSize === 0) {
        return
      }
      if (data['eForm']) {
        vm.pdfEform = true
      } else {
        vm.pdfEform = false
      }
      if (data.fileType === 'doc' || data.fileType === 'docx' || data.fileType === 'xlsx' || data.fileType === 'xls' || data.fileType === 'zip' || data.fileType === 'rar' || data.fileType === 'txt' || data.fileType === 'mp3' || data.fileType === 'mp4') {
        var url = '/o/rest/v2/dossier/' + vm.detailDossier.dossierId + '/files/' + data.referenceUid
        window.location.assign(url)
      } else {
        data['dossierId'] = vm.detailDossier.dossierId
        if (data.referenceUid) {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
          vm.$store.dispatch('viewFile', data).then(result => {
            vm.dialogPDFLoading = false
            document.getElementById('dialogPDFPreviewCV').src = result
          })
        } else {
          toastr.clear()
          toastr.error('File dữ liệu không tồn tại')
        }
      }
    },
    getGovAgencyList () {
      let vm = this
      console.log('employeeLoginInfomation', vm.employeeLoginInfomation)
      if (vm.formCodeInput === 'NEW_GROUP_CV') {
        let filter = {
          collectionCode: 'DON_VI_CONG_VAN',
          level: '',
          parent: ''
        }
        vm.getDictGovAgency(filter)
      } else {
        console.log('donvinhanCollection', vm.donvinhanCollection)
        let collectionSearch
        try {
          collectionSearch = vm.donvinhanCollection
        } catch (error) {
        }
        if (collectionSearch) {
          console.log('collectionSearch', collectionSearch)
          if (collectionSearch.hasOwnProperty('parrentCode')) {
            let itemParent
            if (collectionSearch.parrentCode.startsWith('#')) {
              let scopeUser = ''
              if (vm.employeeLoginInfomation.hasOwnProperty('scope') && vm.employeeLoginInfomation.scope) {
                scopeUser = String(vm.employeeLoginInfomation.scope).split(',')[0]
              }
              itemParent = collectionSearch.parrentCode === '#scope' ? scopeUser : vm.requiredCVDenGovCode
            } else {
              itemParent = collectionSearch.parrentCode
            }
            let filterGet = {
              collectionCode: collectionSearch.collectionCode,
              level: '',
              parent: itemParent
            }
            vm.getDictGovAgency(filterGet)
          }
          if (collectionSearch.hasOwnProperty('isParrentCode')) {
            let itemChild
            if (collectionSearch.isParrentCode.startsWith('#')) {
              let scopeUser = ''
              if (vm.employeeLoginInfomation.hasOwnProperty('scope') && vm.employeeLoginInfomation.scope) {
                scopeUser = String(vm.employeeLoginInfomation.scope).split(',')[0]
              }
              itemChild = collectionSearch.isParrentCode === '#scope' ? scopeUser : vm.requiredCVDenGovCode
            } else {
              itemChild = collectionSearch.isParrentCode
            }
            let filterGet = {
              collectionCode: collectionSearch.collectionCode,
              level: '',
              itemCode: itemChild
            }
            vm.getDetailDictitem(filterGet)
          }
          if (collectionSearch.hasOwnProperty('itemCode')) {
            let itemChild
            if (collectionSearch.itemCode.startsWith('#')) {
              let scopeUser = ''
              if (vm.employeeLoginInfomation.hasOwnProperty('scope') && vm.employeeLoginInfomation.scope) {
                scopeUser = String(vm.employeeLoginInfomation.scope).split(',')[0]
              }
              itemChild = collectionSearch.itemCode === '#scope' ? scopeUser : vm.requiredCVDenGovCode
            } else {
              itemChild = collectionSearch.itemCode
            }
            let filterGet = {
              collectionCode: collectionSearch.collectionCode,
              level: '',
              itemCode: itemChild,
              getCurrentItem: true
            }
            vm.getDetailDictitem(filterGet)
          }
          if (collectionSearch.hasOwnProperty('groupCode')) {
            let filterGet = {
              collectionCode: collectionSearch.collectionCode,
              level: '',
              groupCode: collectionSearch.groupCode
            }
            vm.getGroupDictitem(filterGet)
          }
        }
        
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
        return {
          icon: 'attach_file',
          color: 'primary',
          size: 14
        }
      }
    },
    getDictGovAgency (filterGet) {
      let vm = this
      let filter = {
        collectionCode: filterGet.hasOwnProperty('collectionCode') ? filterGet.collectionCode : 'DON_VI_CONG_VAN',
        level: filterGet.hasOwnProperty('level') ? filterGet.level : '',
        parent: filterGet.hasOwnProperty('parent') ? filterGet.parent : ''
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.govAgencySubmitList = result.data
        if (vm.govAgencySubmitList.length === 1 && vm.formCodeInput === 'NEW_GROUP_CV_DI') {
          vm.donvi_gui_nhan = vm.govAgencySubmitList[0]['itemCode']
        }
      })
    },
    getDetailDictitem (filterGet) {
      let vm = this
      let filter = {
        collectionCode: filterGet.hasOwnProperty('collectionCode') ? filterGet.collectionCode : 'DON_VI_CONG_VAN',
        level: filterGet.hasOwnProperty('level') ? filterGet.level : '',
        itemCode: filterGet.itemCode
      }
      vm.$store.dispatch('loadDetailDictItems', filter).then(function (result) {
        if (filterGet.hasOwnProperty('getCurrentItem')) {
          vm.govAgencySubmitList = [result]
        } else {
          let parent = result.parentItem ? result.parentItem : []
          vm.govAgencySubmitList = Array.isArray(parent) ? parent : [parent]
        }
        if (vm.govAgencySubmitList.length === 1 && vm.formCodeInput === 'NEW_GROUP_CV_DI') {
          vm.donvi_gui_nhan = vm.govAgencySubmitList[0]['itemCode']
        }
      })
    },
    getGroupDictitem (filterGet) {
      let vm = this
      let filter = {
        collectionCode: filterGet.hasOwnProperty('collectionCode') ? filterGet.collectionCode : 'DON_VI_CONG_VAN',
        groupCode: filterGet.groupCode
      }
      vm.$store.dispatch('getGroupDictitem', filter).then(function (result) {
        vm.govAgencySubmitList = Array.isArray(result) ? result : [result]
        if (vm.govAgencySubmitList.length === 1 && vm.formCodeInput === 'NEW_GROUP_CV_DI') {
          vm.donvi_gui_nhan = vm.govAgencySubmitList[0]['itemCode']
        }
      })
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      let dateF = date.split(' ')[0]
      const [day, month, year] = dateF.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    getCurrentDate: function () {
      let date = new Date()
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    },
    getMindate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    parseDateToTimestamp (date) {
      if (!date) {
        return null
      }
      // let [day, month, year] = `${date}`.split('/')
      // let day2 = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      if (new Date(date) == 'Invalid Date') {
        return ''
      } else {
        return (new Date(date)).getTime()
      }
    },
    validateDate(str){
        return str.replace(/[^\d\/]/g, "");
    },
    inputDate (key) {
        let vm = this
        let gt = vm.validateDate(vm[key]);
        if (gt.match(/^\d{2}$/) !== null) {
            vm[key] = gt + '/'
        } else if (gt.match(/^\d{2}\/\d{2}$/) !== null) {
            vm[key] = gt + '/'
        }else
            vm[key] = gt
    },
    changeDocumentDate() {
      let vm = this
      vm.changeDate('dateFormated')
      vm.documentDate = vm.parseDate(vm.dateFormated)
    },
    changeDueDate() {
      let vm = this
      vm.changeDate('duedateFormated')
      vm.dueDate = vm.parseDate(vm.duedateFormated)
    },
    changeDate(key){
        let vm = this 
        let dateString = vm[key];
        let regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        let regex2 = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2}$/
        if (!regex.test(dateString) && !regex2.test(dateString)) {
            vm[key] = ''
        }
        else{
            let date = vm[key].split("/");
            let day = date[0];
            let month = date[1];
            if (day > 31) {
                vm[key] = ''
            }
            else
                if (month > 12) {
                vm[key] = ''
                }else
                if(date[2].length == 2){
                    if(key==="birthdayFormated"){
                        if(date[2] <= 20){
                            vm[key] = day+'/'+month+'/20'+date[2]
                        } else {
                            vm[key] = day+'/'+month+'/19'+date[2]
                        }
                        
                    }else{
                        vm[key] = day+'/'+month+'/20'+date[2]
                    }
                }
        }
    },
  }
}
</script>
