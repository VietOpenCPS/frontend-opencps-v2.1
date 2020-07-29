<template>
  <div class="form-chitiet">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <div v-else class="row-header">
        <div class="background-triangle-big"> <span>CHI TIẾT HỒ SƠ</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="thongTinChiTietHoSo.serviceName">
            {{thongTinChiTietHoSo.serviceName}}
          </div>
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <thong-tin-co-ban-ho-so ref="thong-tin-co-ban-ho-so" :detailDossier="thongTinChiTietHoSo" :mauCongVan="mauCongVan"></thong-tin-co-ban-ho-so>
      <!--  -->
      <div>
        <v-tabs icons-and-text v-model="activeTab">
          <v-tabs-slider color="primary"></v-tabs-slider>
          
          <v-tab :key="1" href="#tabs-1" @click="loadDossierActions()" >
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              TIẾN TRÌNH XỬ LÝ
            </v-btn>
          </v-tab>
          <v-tab :key="2" href="#tabs-2" @click="loadDossierLogs()" >
            <v-btn flat class="px-0 py-0 mx-0 my-0">
              NHẬT KÝ SỬA ĐỔI
            </v-btn>
          </v-tab>
          <v-tabs-items v-model="activeTab" reverse-transition="fade-transition" transition="fade-transition" style="overflow: visible!important">

            <v-tab-item value="tabs-1" :key="1" reverse-transition="fade-transition" transition="fade-transition">
              <v-flex xs12 style="height:42px" v-if="!sequencyDossierImport">
                <v-radio-group class="absolute__btn pt-1" style="width: 350px" v-model="typeTienTrinh" row @change="changeTypeTienTrinh($event)">
                  <v-radio label="Xem dạng bảng" :value="1" ></v-radio>
                  <v-radio label="Xem dạng biểu đồ" :value="2"></v-radio>
                </v-radio-group>
                <v-btn small color="primary" @click.stop="previewTienTrinh" v-if="hasPreviewSync"
                  :loading="dialogPDFLoading"
                  :disabled="dialogPDFLoading"
                  class="right"
                >
                  <v-icon color="white">print</v-icon>&nbsp;
                  In
                </v-btn>
              </v-flex>
              <v-data-table v-if="sequencyDossierImport" :headers="headersSequencyImport" :items="dossierImportActions" class="table-landing table-bordered"
              hide-actions no-data-text="Không có dữ liệu"
              >
                <template slot="headerCell" slot-scope="props">
                  <v-tooltip bottom>
                    <span slot="activator">
                      {{ props.header.text }}
                    </span>
                    <span>
                      {{ props.header.text }}
                    </span>
                  </v-tooltip>
                </template>
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center">{{props.index + 1}}</td>
                  <td class="text-xs-left">{{props.item.sequenceName}}</td>
                  <td class="text-xs-left">{{props.item.actions[0]['actionUser']}}</td>
                  <td class="text-xs-left">{{props.item.startDate|dateTimeViewSequency}}</td>
                  <td class="text-xs-left">{{props.item.finishDate|dateTimeViewSequency}}</td>
                  <td class="text-xs-left">{{props.item.actions[0]['note']}}</td>

                </template>
              </v-data-table>

              <v-data-table v-if="!sequencyDossierImport && typeTienTrinh === 1" :headers="headers" :items="dossierActions" class="table-landing table-bordered"
              hide-actions no-data-text="Không có dữ liệu"
              >
                <template slot="headerCell" slot-scope="props">
                  <v-tooltip bottom>
                    <span slot="activator">
                      {{ props.header.text }}
                    </span>
                    <span>
                      {{ props.header.text }}
                    </span>
                  </v-tooltip>
                </template>
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center">{{props.index + 1}}</td>
                  <td class="text-xs-left">{{props.item.sequenceRole}}</td>
                  <td class="text-xs-left">{{props.item.sequenceName}}</td>
                  <td class="text-xs-left">{{props.item.durationCount|getThoiHanQuyDinh}}</td>
                  <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                  <td class="text-xs-left">
                    <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                      {{itemUser.userName}} <br>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <div v-for="(itemAction, index) in props.item.actions" :key="index">
                      {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                      <span v-if="itemAction.actionNote && itemAction.actionNote !== 'null'"> - <i>{{itemAction.actionNote}}</i></span>
                      <div v-if="Array.isArray(itemAction.files) && itemAction.files.length > 0">
                        <div v-for="(itemFile, index) in itemAction.files" :key="index" title="Tải xuống">
                          <p v-if="itemFile.dossierDocumentId" @click="downloadFileDocument(itemFile.dossierReferenceUid ? itemFile.dossierReferenceUid : '')">
                            <v-icon size="18" color="#0b72ba">
                              get_app
                            </v-icon>
                            <!-- <v-icon size="18" color="#0b72ba" class="mx-2" @click="">visibility</v-icon> -->
                            <span style="color: #0b72ba;cursor: pointer;">
                              {{itemFile.fileName}}
                            </span>
                          </p>
                          <p v-if="itemFile.dossierFileId" @click="downloadFileLogs(itemFile.dossierFileId)">
                            <v-icon size="18" color="#0b72ba">
                              get_app
                            </v-icon>
                            <!-- <v-icon size="18" color="#0b72ba" class="mx-2" @click="">visibility</v-icon> -->
                            <span style="color: #0b72ba;cursor: pointer;">
                              {{itemFile.fileName}}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-if="props.item.statusText">
                      <span style="color: green" v-if="thongTinChiTietHoSo['dossierStatus'] === 'done' || thongTinChiTietHoSo['dossierStatus'] === 'unresolved'">
                        {{props.item.statusText.replace("Đang thực hiện:", "")}}
                      </span>
                      <span style="color: green" v-else>
                        {{props.item.statusText}}
                      </span>
                    </div>
                  </td>
                </template>
              </v-data-table>
              <div v-if="!sequencyDossierImport && typeTienTrinh !== 1">
                <content-placeholders v-if="loadingMermaidgraph">
                  <content-placeholders-img />
                  <content-placeholders-heading />
                </content-placeholders>
                <div id="mermaid_dossier" class="mermaid" style="padding: 15px;"></div>
              </div>
            </v-tab-item>

            <v-tab-item value="tabs-2" :key="2" reverse-transition="fade-transition" transition="fade-transition">
              <div v-for="(item, index) in listHistoryProcessing" v-bind:key="item.dossierLogId" class="list_history_style">
                  <td class="px-2 pt-2" :class="index % 2 !== 0 ? 'col-tien-trinh-1' : 'col-tien-trinh-2'">{{ index + 1 }}</td>
                  <td class="text-xs-left px-2 pt-2 pb-1">
                    <p class="mb-1"> <span>{{ item.createDate | dateTimeView }}</span> - <b>{{ item.author }}</b>: <span style="color: #0b72ba">{{ item.payload.stepName }}</span>
                    </p>
                    <p class="mb-1" v-if="item.content !== '' && item.content !== null">Ý kiến: <span v-html="item.content"></span></p>
                    <div v-for="(file, index) in item.payload.files" :key="index">
                      <p v-if="file.dossierFileId" class="history__download__link hover-pointer-download mb-1"
                        title="Tải xuống"
                        style="cursor: pointer;"
                        @click.prevent.stop="downloadFileLogs(file.dossierFileId)"
                        >
                        <v-icon>file_download</v-icon> 
                        <span>{{file.fileName}}</span>
                      </p>
                      <p v-if="file.dossierDocumentId" class="history__download__link hover-pointer-download mb-1"
                        title="Tải xuống"
                        style="cursor: pointer;"
                        @click.prevent.stop="downloadFileDocument(file.dossierReferenceUid ? file.dossierReferenceUid : '')"
                        >
                        <v-icon>file_download</v-icon> 
                        <span>{{file.fileName}}</span>
                      </p>
                    </div>
                </td>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
        
      </div>
    </div>

  </div>
</template>

<script>

import $ from 'jquery'
import toastr from 'toastr'
import ThongTinCoBanHoSo from './ThongTinCoBanHoSo'
// import mermaid from 'mermaid'
mermaid.initialize({
  theme: 'forest',
  startOnLoad: false
})
export default {
  props: ['index'],
  components: {
    'thong-tin-co-ban-ho-so': ThongTinCoBanHoSo
  },
  data: () => ({
    isMobile: false,
    inputTypes: [1, 3, 6],
    inputTypesLienThong: [1, 2, 3, 6, 7],
    outputTypes: [2, 7],
    actionIdCurrent: 0,
    validateAction: true,
    btnIndex: -1,
    processActionCurrent: 0,
    activeTab: 'tabs-1',
    activeTab2: '',
    btnDossierDynamics: [],
    btnStepsDynamics: [],
    loadingAction: false,
    indexAction: -1,
    indexActionStep: -1,
    dossierId: '',
    className: 'org.opencps.dossiermgt.model.Dossier',
    dossierFilesItems: [],
    dossierTemplatesItems: [],
    fileViews: [],
    showContactDetail: false,
    listHistoryProcessing: [],
    dossierTemplatesTN: [],
    dossierTemplatesKQ: [],
    thongTinChiTietHoSo: {
    },
    dialogPDF: false,
    dialogPDFLoading: false,
    loadingAlpacajsForm: false,
    nextActions: [],
    createFiles: [],
    returnFiles: [],
    processSteps: [],
    documents: [],
    payments: '',
    dossierActions: [],
    dossierImportActions: [],
    reAsignUsers: [],
    showReasign: false,
    itemselect: '',
    dossierSyncs: [],
    stepModel: null,
    actionNote: '',
    actionsSubmitLoading: false,
    showThongTinCoBanHoSo: false,
    showYkienCanBoThucHien: false,
    showFormBoSungThongTinNgan: false,
    showPhanCongNguoiThucHien: false,
    showTaoTaiLieuKetQua: false,
    showKyPheDuyetTaiLieu: false,
    dataEsign: '',
    filesPdfSign: [
      {fileName: 'Tài liệu ký duyệt 001', time: '20/08/2019 11:20:30', url: 'http://103.101.163.17:8080/documents/35166/0/testKS.pdf', fileSigned: false},
      {fileName: 'Tài liệu ký duyệt 002', time: '21/08/2019 10:10:13',url: 'http://103.101.163.17:8080/documents/35166/0/testKS.pdf', fileSigned: false}
    ],
    typeEsign: '',
    showTraKetQua: false,
    showThanhPhanLienThong: false,
    showThuPhi: false,
    showPostalService: false,
    showThanhToanDienTu: false,
    showEditDate: false,
    showExtendDateEdit: false,
    checkInput: 0,
    viaPortalDetail: 0,
    showThucHienThanhToanDienTu: false,
    dossierItemDialogPick: '',
    itemDialogPick: '',
    resultDialogPick: '',
    indexDialogPick: '',
    userNote: 0,
    partView: '',
    stateView: false,
    paymentDetail: '',
    paymentProfile: '',
    payment_type: 0,
    type_assign: 0,
    assign_items: [],
    btnStateVisible: true,
    extendDateEdit: '',
    typeExtendDate: '',
    dueDateEdit: '',
    receiveDateEdit: '',
    dialogActionProcess: false,
    rollbackable: false,
    configNote: null,
    actionSpecial: false,
    btnPlugins: [],
    loadingPlugin: false,
    listDossierFiles: [],
    detailPreAction: '',
    headers: [
      {
        text: '#',
        align: 'center',
        sortable: false
      },
      {
        text: 'Vai trò',
        align: 'center',
        sortable: false,
        class: 'vaitro_column'
      }, {
        text: 'Công việc',
        align: 'center',
        sortable: false,
        class: 'congviec_column'
      }, {
        text: 'Thời hạn quy định',
        align: 'center',
        sortable: false,
        class: 'thoihanquydinh_column'
      }, {
        text: 'Ngày bắt đầu',
        align: 'center',
        sortable: false,
        class: 'ngaybatdau_column'
      }, {
        text: 'Người thực hiện',
        align: 'center',
        sortable: false,
        class: 'nguoithuchien_column'
      }, {
        text: 'Kết quả',
        align: 'center',
        sortable: false,
        class: 'ketqua_column'
      }
    ],
    headersSequencyImport: [
      {
        text: '#',
        align: 'center',
        sortable: false
      }, {
        text: 'Công việc',
        align: 'center',
        sortable: false,
        class: 'congviec_column'
      }, {
        text: 'Người thực hiện',
        align: 'center',
        sortable: false,
        class: 'nguoithuchien_column'
      }, {
        text: 'Ngày bắt đầu',
        align: 'center',
        sortable: false,
        class: 'ngaybatdau_column'
      }, {
        text: 'Ngày kết thúc',
        align: 'center',
        sortable: false,
        class: 'ngayketthuc_column'
      }, {
        text: 'Ghi chú',
        align: 'center',
        sortable: false,
        class: 'ghichu_column'
      }
    ],
    headerSyncs: [
      {
        text: 'Nhật kí hồ sơ',
        align: 'center',
        sortable: false,
        class: 'nhatki_column'
      }, {
        text: 'Trao đổi trực tuyến',
        align: 'center',
        sortable: false,
        class: 'traodoitructuyen_column'
      }],
      filterDossierActionItems: [{
        text: 'Tất cả',
        value: ''
      }, {
        text: 'Có thao tác thực hiện',
        value: '1'
      }, {
        text: 'Không thao tác thực hiện',
        value: '2'
      }
    ],
    filterDossierAction: null,
    filterDossierSyncItems: [{
      text: 'Tất cả',
      value: '1,2'
    }, {
      text: 'Thông tin trao đổi',
      value: '2'
    }
    ],
    filterDossierSync: null,
    messageChat: '',
    isCallBack: true,
    printDocument: false,
    printInvoicefilePayment: false,
    alertObj: {
      icon: 'check_circle',
      color: 'success',
      message: 'Thực hiện thành công!'
    },
    stateViewResult: true,
    stateViewDocument: true,
    listLienThong: [],
    modelPlugin: null,
    dialogPlugin: false,
    dialog_reAsign: false,
    loadingMermaidgraph: false,
    typeTienTrinh: 1,
    votingItems: [],
    loadingVoting: false,
    titleDialogPdf: 'Tài liệu đính kèm',
    viewScript: false,
    loadingForm: false,
    hasPreviewSync: false,
    isNotarization: false,
    sequencyDossierImport: false,
    mauCongVan: ''
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    visibleDoAction () {
      return this.$store.getters.getVisibleDoAction
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    dataCreateFile () {
      return this.$store.getters.getDataCreateFile
    },
    getCheckInput () {
      return this.$store.getters.getCheckInput
    },
    usersNextAction () {
      return this.$store.getters.getUsersNextAction
    },
    stepOverdueNextAction () {
      return this.$store.getters.getStepOverdueNextAction
    },
    currentUser () {
      return this.$store.getters.loadingInitData.user
    },
    kysoSuccess () {
      return this.$store.getters.kysoSuccess
    },
    menuConfigs () {
      return this.$store.getters.getMenuConfigsTodo
    },
    dossierTemplateLienThong () {
      return this.$store.getters.getDossierTemplateLienThong
    },
    createFileSignedSync () {
      return this.$store.getters.getCreateFileSigned
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
    $('#m-navigation').css('display', 'none')
  },
  created () {
    let vm = this
    window.toastr = toastr
    vm.$nextTick(function () {
      vm.$store.dispatch('getDetailDossier', vm.index).then(resultDossier => {
        vm.thongTinChiTietHoSo = resultDossier
        vm.loadDossierActions()
        vm.loadDossierLogs()
      })
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  beforeDestroy () {
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
    },
  },
  methods: {
    onResize () {
      let vm = this
      let isMobile = window.innerWidth < 1264
      vm.isMobile = isMobile
    },
    initData (data) {
      var vm = this
      vm.dossierId = data
      vm.activeTab2 = 'tabs-2b'
    },
    runComment () {
      var vm = this
      if (vm.$refs.comment) {
        vm.$refs.comment.runComment()
      }
    },
    goBack () {
      window.history.back()
    },
    downloadFileLogs (data) {
      var vm = this
      let dataCommit = {
        fileAttachId: data,
        dossierId: vm.id
      }
      this.$store.dispatch('downloadFile', dataCommit).then(function (result) {
        if (result) {
          vm.dialogPDFLoading = false
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      })
    },
    downloadFileDocument(data) {
      var vm = this
      let dataCommit = {
        referenceUid: data,
        dossierId: vm.id
      }
      vm.$store.dispatch('downloadFileDocument', dataCommit).then(function (result) {
        if (result) {
          vm.dialogPDFLoading = false
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      })
    },
    loadDossierActions (data) {
      var vm = this
      let submissionNote = ''
      try {
        submissionNote = vm.thongTinChiTietHoSo['submissionNote'] ? JSON.parse(vm.thongTinChiTietHoSo['submissionNote']) : ''
      } catch (error) {
      }
      if (submissionNote && submissionNote.hasOwnProperty('dossierImport') && submissionNote.dossierImport) {
        vm.sequencyDossierImport = true
        vm.dossierImportActions = submissionNote['data']
      } else {
        vm.sequencyDossierImport = false
        if (vm.thongTinChiTietHoSo.dossierId) {
          let dataParams = {
            dossierId: vm.thongTinChiTietHoSo.dossierId,
            stepType: data
          }
          vm.$store.dispatch('loadDossierActions', dataParams).then(resultActions => {
            if (resultActions.data && resultActions.data.length !== 0) {
              let resultTemp = resultActions.data
              for (var i = 0; i < resultTemp.length; i++) {
                if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                  if (!Array.isArray(resultTemp[i]['actions'])) {
                    let arrActionsTemp = []
                    arrActionsTemp.push(resultTemp[i]['actions'])
                    resultTemp[i]['actions'] = arrActionsTemp
                  }
                }
              }
              vm.dossierActions = resultTemp
            } else {
              if (vm.thongTinChiTietHoSo['submissionNote']) {
                try {
                  JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])
                  let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote']).data
                  for (var i = 0; i < resultTemp.length; i++) {
                    if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                      if (!Array.isArray(resultTemp[i]['actions'])) {
                        let arrActionsTemp = []
                        arrActionsTemp.push(resultTemp[i]['actions'])
                        resultTemp[i]['actions'] = arrActionsTemp
                      }
                    }
                  }
                  vm.dossierActions = resultTemp
                } catch (e) {
                }
              }
            }
          }).catch(function () {
            if (vm.thongTinChiTietHoSo['submissionNote']) {
              try {
                JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])
                let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote']).data
                for (var i = 0; i < resultTemp.length; i++) {
                  if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                    if (!Array.isArray(resultTemp[i]['actions'])) {
                      let arrActionsTemp = []
                      arrActionsTemp.push(resultTemp[i]['actions'])
                      resultTemp[i]['actions'] = arrActionsTemp
                    }
                  }
                }
                vm.dossierActions = resultTemp
              } catch (e) {
              }
            }
          })
        }
      }
      
    },
    loadMermaidgraph (data) {
      var vm = this
      document.getElementById('mermaid_dossier').innerHTML = ''
      if (vm.thongTinChiTietHoSo.dossierId) {
        let dataParams = {
          dossierId: vm.thongTinChiTietHoSo.dossierId
        }
        vm.loadingMermaidgraph = true
        vm.$store.dispatch('loadMermaidgraph', dataParams).then(chartData => {
          vm.loadingMermaidgraph = false
          mermaid.render('theGraph', chartData, function (svgCode) {
            document.getElementById('mermaid_dossier').innerHTML = svgCode
          })
        }).catch(function () {
          vm.loadingMermaidgraph = false
        })
      }
    },
    loadDossierSyncs (data) {
      var vm = this
      if (vm.thongTinChiTietHoSo.dossierId) {
        let dataParams = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          info: '1,2'
        }
        vm.$store.dispatch('loadDossierSyncs', dataParams).then(resultSyncs => {
          if (resultSyncs !== null && resultSyncs !== undefined && resultSyncs !== 'undefined') {
            if (Array.isArray(resultSyncs)) {
              vm.dossierSyncs = resultSyncs
            } else {
              vm.dossierSyncs = [resultSyncs]
            }
          } else {
            vm.dossierSyncs = []
          }
        })
      }
    },
    changeTypeTienTrinh (event) {
      let vm = this
      if (event === 2) {
        setTimeout(function () {
          vm.loadMermaidgraph()
        }, 200)
      }
    },
    previewTienTrinh () {
      let vm = this
      let data = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      vm.dialogPDFLoading = true
      vm.$store.dispatch('previewTienTrinh', data).then(function (result) {
        vm.dialogPDFLoading = false
        vm.titleDialogPdf = 'Tiến trình thụ lý'
        vm.dialogPDF = true
        document.getElementById('dialogPDFPreviewXl').src = result
      }).catch(function () {
        vm.dialogPDFLoading = false
      })
    },
    loadDossierLogs (data) {
      var vm = this
      // data.dossierId = vm.thongTinChiTietHoSo.dossierId
      let dataParams = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let promiseHisProcessing = vm.$store.dispatch('getListHistoryProcessingItems', dataParams)
      promiseHisProcessing.then(function (result) {
        vm.listHistoryProcessing = []
        vm.listHistoryProcessing = result
      })
    },
    deleteDossierFileVersion (item) {
      var vm = this
      item['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('deleteAttackFiles', item).then(res => {
      })
    },
    getNextAction (item) {
      var vm = this
      vm.actionIdCurrent = item.processActionId
      if (item.type === 1) {
        let filter = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionId: item.processActionId
        }
        vm.$store.dispatch('getNextAction', filter).then(resultAction => {
          vm.stepModel = resultAction
        }).catch(reject => {
          vm.stepModel = null
        })
      } else {
        let filter = {
          dossierId: vm.thongTinChiTietHoSo.dossierId,
          actionId: item.processActionId
        }
        vm.$store.dispatch('loadPlugin', filter).then(resultPlugin => {
          vm.stepModel = resultPlugin
        }).catch(reject => {
          vm.stepModel = null
        })
      }
    },

    doPrint01 (dossierItem, item, index) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint01', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreviewXl').src = result
      })
    },
    doPreview (dossierItem, item, index) {
      let vm = this
      vm.dialogPDFLoading = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        if (result !== 'pending') {
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      }).catch(function () {
        vm.dialogPDFLoading = false
      })
    },
    doCopy (dossierItem, item, index) {
      let vm = this
      let filter = {
        dossierId: dossierItem.dossierId
      }
      vm.loadingAction = true
      vm.$store.dispatch('doCopy', filter).then(function (result) {
        vm.loadingAction = false
        vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(function (reject) {
        vm.loadingAction = false
      })
    },
    
    doPrint02 (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          document: item.document,
          'serviceCode': vm.thuTucHanhChinhSelected.serviceCode,
          'govAgencyCode': vm.thuTucHanhChinhSelected.govAgencyCode,
          dossiers: JSON.stringify(vm.selected)
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doPrint02', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreviewXl').src = result
        })
      }
    },
    doPrint03 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        if (result !== 'pending') {
          vm.dialogPDF = true
          document.getElementById('dialogPDFPreviewXl').src = result
        }
      }).catch(function () {
        vm.dialogPDFLoading = false
      })
    },
    doGuiding (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelected.serviceConfigId
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreviewXl').src = result
        })
      }
    },
    
    getNextActions () {
      let vm = this
      let query = vm.$router.history.current.query
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let currentQuery = vm.$router.history.current.query
      vm.dossierId = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('pullNextactions', filter).then(function (result) {
        vm.btnDossierDynamics = result
        if (currentQuery.hasOwnProperty('btnIndex') && currentQuery.btnIndex !== null && currentQuery.btnIndex !== '') {
          vm.btnStateVisible = true
          vm.dialogActionProcess = true
          if (currentQuery.btnIndex.toString() === '8500') {
            let result = {
              actionCode: 8500,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              overdue: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else if (currentQuery.btnIndex.toString() === '8501') {
            let result = {
              actionCode: 8501,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              preoverdue: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else if (currentQuery.btnIndex.toString() === '8400') {
            let result = {
              actionCode: 8400,
              dossierId: vm.thongTinChiTietHoSo.dossierId,
              betimes: vm.thongTinChiTietHoSo['extendDate']
            }
            vm.processPullBtnDetailRouter(vm.thongTinChiTietHoSo, null, result, null)
          } else {
            if (vm.btnDossierDynamics[currentQuery.btnIndex].enable === 1 || vm.btnDossierDynamics[currentQuery.btnIndex].enable === 2) {
              vm.processPullBtnDetail(vm.btnDossierDynamics[currentQuery.btnIndex], currentQuery.btnIndex)
            } else {
              vm.dialogActionProcess = false
            }
          }
        }
        vm.checkInput = vm.getCheckInput
        if (vm.getCheckInput !== null && vm.getCheckInput !== undefined) {
          if (vm.checkInput !== 0) {
            setTimeout(function () {
              vm.$refs.thanhphanhoso.initData(vm.thongTinChiTietHoSo)
            }, 300)
          }
        }
        // lấy danh sách user reAsign
        vm.loadUserReAsign()
      })
      vm.$store.dispatch('loadPlugins', {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }).then(results => {
        vm.btnPlugins = results
      }).catch(xhr => {
        vm.btnPlugins = []
      })
      if (vm.thongTinChiTietHoSo.online && !vm.thongTinChiTietHoSo.originDossierNo && 
        ((vm.originality === 1 && vm.thongTinChiTietHoSo['dossierStatus'] !== 'new') || vm.originality === 3)) {
        vm.loadDossierSyncs(vm.thongTinChiTietHoSo.dossierId)
      }
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
          if (vm.partView !== item.partNo) {
            vm.stateView = true
            vm.partView = item.partNo
          } else {
            vm.stateView = !vm.stateView
            vm.partView = item.partNo
          }
        } else {
          return
        }
      }
      return
    },
    viewFile2 (data) {
      var vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      data['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('viewFile', data).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreviewXl').src = result
      })
    },
    viewFileDocument (item) {
      var vm = this
      vm.dialogPDFLoading = true
      vm.titleDialogPdf = 'Văn bản hành chính'
      vm.dialogPDF = true
      item['dossierId'] = vm.thongTinChiTietHoSo.dossierId
      vm.$store.dispatch('viewDocument', item).then(result => {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreviewXl').src = result
      })
    },
    
    printViewDocument () {
      let vm = this
      vm.dialogPDFLoading = true
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId
      }
      let counter = 0
      let callServer = function() {
        setTimeout(function () {
          vm.$store.dispatch('doPrint03', filter).then(function (result) {
            if (result === 'pending' && counter <= 5) {
              counter += 1
              callServer()
            } else {
              if (counter > 5) {
                vm.dialogPDFLoading = false
              } else {
                vm.dialogPDFLoading = false
                vm.dialogPDF = true
                setTimeout(function () {
                  document.getElementById('dialogPDFPreviewXl').src = result
                }, 100)
              }
            }
          })
        }, 1000)
      }
      callServer()
    },
    printPay () {
      let vm = this
      let filter = {
        dossierId: vm.thongTinChiTietHoSo.dossierId,
        referenceUid: vm.thongTinChiTietHoSo.referenceUid
      }
      vm.dialogPDFLoading = true
      vm.$store.dispatch('printPay', filter).then(function (result) {
        vm.dialogPDFLoading = false
        vm.titleDialogPdf = 'Biên lai thanh toán'
        vm.dialogPDF = true
        setTimeout(function () {
          document.getElementById('dialogPDFPreviewXl').src = result
        }, 200)
      }).catch(function(){
        vm.dialogPDFLoading = false
      })
    },
    filterNextActionEnable (nextaction) {
      var isEnabale = false
      if (nextaction && Array.isArray(nextaction)) {
        for (let key in nextaction) {
          if (nextaction[key]['enable'] !== 0) {
            isEnabale = true
          }
        }
      }
      return isEnabale 
    },
    checkPemissionSpecialAction (form, currentUser, thongtinchitiet) {
      var vm = this
      var checkValue = true
      // check theo người thực hiện
      if (form !== 'PRINT_01' && form !== 'PRINT_02' && form !== 'PRINT_03'
      && form !== 'GUIDE' && form !== 'PREVIEW' && form !== 'BETIMES') {
        let userArr = vm.$store.getters.getUsersNextAction
        if (userArr.length > 0) {
          let check = userArr.filter(function (item) {
            if (item !== undefined && currentUser !== undefined) {
              return item['userId'].toString() === currentUser['userId'].toString()
            }
          })
          if (check.length > 0) {
            checkValue = true
          } else {
            checkValue = false
          }
        } else {
          checkValue = false
        }
      }
      // check theo lastactionUser
      if (form === 'ROLLBACK_01' || form === 'ROLLBACK_02' || form === 'ROLLBACK_03') {
        // if (currentUser.userId === thongtinchitiet.lastActionUserId) {
        //   checkValue = true
        // } else {
          checkValue = false
        // }
      }
      return checkValue
    },
    checkPemissionPhanCongLai (currentUser) {
      let vm = this
      let checkValue = true
      // check theo người thực hiện và chuyển đến bởi
      let userArr = vm.$store.getters.getUsersNextAction
      let userLastAction = [{'userId': vm.thongTinChiTietHoSo.lastActionUserId ? vm.thongTinChiTietHoSo.lastActionUserId : ''}]
      // let userCheckPermission = userArr.concat(userLastAction)
      let userCheckPermission = userArr
      if (userCheckPermission.length > 0) {
        let check = userCheckPermission.filter(function (item) {
          if (item !== undefined && currentUser !== undefined) {
            return item['userId'].toString() === currentUser['userId'].toString()
          }
        })
        if (check.length > 0) {
          checkValue = true
        } else {
          checkValue = false
        }
      } else {
        checkValue = false
      }
      return checkValue
    },
    reAsign () {
      let vm = this
      vm.dialog_reAsign = true
    },
    loadUserReAsign () {
      let vm = this
      vm.$store.dispatch('getDossierUserAsign', vm.thongTinChiTietHoSo.dossierId).then(function(result) {
        if (result.length > 0) {
          vm.reAsignUsers = result.filter(function (item) {
            return Number(item['userId']) !== Number(vm.currentUser['userId'])
          })
        }
        vm.showReasign = true
        if (vm.reAsignUsers.length === 0) {
          vm.showReasign = false
        }
        if (vm.usersNextAction.length === 1 && vm.reAsignUsers.length === 1 && Number(vm.reAsignUsers[0]['userId']) === Number(vm.usersNextAction[0]['userId'])) {
          vm.showReasign = false
        }
      })
    },
    changeStateViewResult (data) {
      // console.log('state view result', data)
      var vm = this
      vm.stateViewResult = data
    },
    getUser (roleItem) {
      let vm = this
      let roles = vm.$store.getters.getUser.role
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)

    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(Number(arg))
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    dateTimeViewSequency (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    getMaxDueDate (arr) {
      let maxDue = Math.max.apply(Math, arr.map(function (item) {
        return item.actionOverdue
      }))
      return maxDue
    },
    getThoiHanQuyDinh (val) {
      if (val > 0) {
        return val + ' ngày'
      } else {
        return ''
      }
    }
  }
}
window.showSuccess = function (note) {
  toastr.success(note)
}
window.showError = function (note) {
  toastr.error(note)
}
</script>
