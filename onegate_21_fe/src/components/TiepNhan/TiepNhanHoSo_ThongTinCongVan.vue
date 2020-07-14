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
                  <v-layout wrap>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số công văn <span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinCongVan.documentNo"
                      :rules="[rules.required]"
                      required
                      ></v-text-field>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Ngày công văn <span  style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-menu
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
                          readonly
                          @blur="documentDate = parseDate(dateFormated)"
                        >
                        </v-text-field>
                        <v-date-picker ref="picker" locale="vi"
                        :first-day-of-week="1" v-model="documentDate" no-title @input="menuDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số lượng hồ sơ đề nghị xét<span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinCongVan.sampleCount"
                      :rules="[rules.required]"
                      required
                      ></v-text-field>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Ngày hẹn trả lời<span  style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-menu
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
                          readonly
                          @blur="dueDate = parseDate(duedateFormated)"
                        >
                        </v-text-field>
                        <v-date-picker :min="getMindate()" ref="picker" locale="vi"
                        :first-day-of-week="1" v-model="dueDate" no-title @input="menuDueDate = false"></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2" v-if="formCodeInput !== 'NEW_GROUP_CV'">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">
                        <span v-if="formCodeInput === 'NEW_GROUP_CV'">Đơn vị gửi công văn </span>
                        <span v-if="formCodeInput === 'NEW_GROUP_CV_DI'">Đơn vị nhận công văn </span> 
                        <span v-if="formCodeInput === 'NEW_GROUP_CV_DI'  && lengthDossier !== 0  && typeof lengthDossier !== 'undefined'" style="color:red">&nbsp;*</span>: 
                      </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2" v-if="formCodeInput !== 'NEW_GROUP_CV'">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-autocomplete
                      v-else
                      :items="govAgencySubmitList"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="donvi_gui_nhan"
                      :rules="formCodeInput === 'NEW_GROUP_CV_DI' && lengthDossier !== 0 && typeof lengthDossier !== 'undefined' ? [rules.required] : []"
                      :required="formCodeInput === 'NEW_GROUP_CV_DI' && lengthDossier !== 0 && typeof lengthDossier !== 'undefined'"
                      :readonly="formCodeInput === 'NEW_GROUP_CV_DI' && (lengthDossier === 0 ||typeof lengthDossier === 'undefined')"
                      ></v-autocomplete>
                    </v-flex>

                    <!--  -->
                    <v-flex xs12 sm2 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Nội dung tóm tắt <span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-textarea
                      v-else
                      v-model="thongTinCongVan.briefNote"
                      rows="3"
                      :rules="[rules.required]"
                      required
                      ></v-textarea>
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
                      v-else
                      v-model="thongTinCongVan.contactTelNo"
                      :rules="thongTinCongVan.contactTelNo ? [rules.telNo] : ''"
                      ></v-text-field>
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
                      v-else
                      v-model="thongTinCongVan.contactEmail"
                      :rules="thongTinCongVan.contactEmail ? [rules.email] : ''"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 class="mt-2">
                      <div class="mb-2"> <span style="color:red">(*) &nbsp;</span>Tài liệu đính kèm: <i v-if="dossierFilesItems.length === 0">(Chưa có tài liệu đính kèm)</i></div>
                      <div v-for="(itemFileView, index) in dossierFilesItems" :key="index">
                        <div v-if="!itemFileView.eForm">
                          <span v-on:click.stop="viewFile2(itemFileView)" class="ml-3" style="cursor: pointer;">
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
                      <v-btn small color="primary" class="mx-0 mt-3" dark @click.native="uploadFile">
                        <v-icon>fas fa fa-upload</v-icon> &nbsp; &nbsp;
                        Chọn tài liệu tải lên
                      </v-btn>
                      
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
      </div>
    </v-form>
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
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  components: {
    'suggestions': Suggestions,
    'tiny-pagination': TinyPagination
  },
  props: ['formCodeInput', 'detailDossier', 'tphs', 'lengthDossier'],
  data: () => ({
    loading: false,
    dialogPDFLoading: false,
    dialogPDF: false,
    valid_thongtincongvan: true,
    thongTinCongVan: '',
    donvi_gui_nhan: '',
    dossierFilesItems: '',
    menuDate: false,
    menuDueDate: false,
    documentDate: null,
    dateFormated: null,
    dueDate: null,
    duedateFormated: null,
    agencySubmit: '',
    govAgencySubmitList: '',
    briefNote: '',
    sampleCount: '',
    contactTelNo: '',
    contactEmail: '',
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
      }
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
        vm.donvi_gui_nhan = vm.formCodeInput === 'NEW_GROUP_CV_DI' ? metadata.donvinhan : metadata.donvigui
      } catch (error) {
      }
      
      vm.documentDate = vm.thongTinCongVan.hasOwnProperty('documentDate') ? vm.parseDate(vm.thongTinCongVan.documentDate) : ''
      vm.dueDate = vm.thongTinCongVan.hasOwnProperty('dueDate') ? vm.parseDate(vm.thongTinCongVan.dueDate) : ''
      vm.$store.dispatch('loadDossierFiles', vm.thongTinCongVan.dossierId).then(result => {
        vm.dossierFilesItems = result
      })
      vm.$refs.formThongTinCongVan.resetValidation()
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
        scopeUser = String(vm.employeeLoginInfomation.scope).split(",")[0]
      }
      if (vm.formCodeInput === 'NEW_GROUP_CV') {
        // vm.thongTinCongVan.delegateName = delegateName ? delegateName : ''
        metaData.tendonvigui = delegateName
        metaData.donvigui = vm.donvi_gui_nhan
        metaData.donvinhan = scopeUser ? scopeUser : vm.detailDossier.govAgencyCode
      } else {
        metaData.donvigui = scopeUser ? scopeUser : vm.detailDossier.govAgencyCode
        metaData.donvinhan = vm.donvi_gui_nhan
        metaData.tendonvinhan = delegateName
      }
      vm.thongTinCongVan.metaData = metaData
      vm.thongTinCongVan.validation = vm.$refs.formThongTinCongVan.validate()
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
      let tphsDungChung = vm.tphs.filter(function(item) {
        return item.partType == 6
      })[0]
      let filter = Object.assign(vm.detailDossier, tphsDungChung)
      vm.$store.dispatch('uploadSingleFileGroupCongVan', filter).then(function (result) {
        vm.$store.dispatch('loadDossierFiles', filter.dossierId).then(result => {
          vm.dossierFilesItems = result
        })
      })
    },
    deleteSingleFile (item, index) {
      var vm = this
      let x = confirm('Bạn có chắc chắn xóa file đính kèm ?')
      if (x) {
        item['dossierId'] = vm.detailDossier.dossierId
        vm.$store.dispatch('deleteDossierFile', item).then(resFile => {
          vm.$store.dispatch('loadDossierFiles', vm.thongTinHoSo.dossierId).then(result => {
            vm.dossierFilesItems = result
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
      let filter = {
        collectionCode: 'DON_VI_CONG_VAN',
        level: '',
        parent: ''
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.govAgencySubmitList = result.data
      })
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
  }
}
</script>
