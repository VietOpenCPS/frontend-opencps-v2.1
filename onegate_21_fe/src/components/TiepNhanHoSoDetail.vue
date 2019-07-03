<template>
  <v-form v-model="validTNHS" ref="formTiepNhanHoSo" lazy-validation>
    <div v-if="formTemplate === 'version_1.0'">
      <div class="row-header">
        <div class="background-triangle-big"> 
          <span v-if="formCode === 'UPDATE'">SỬA HỒ SƠ</span>
          <span v-else-if="formCode === 'COPY'">SAO CHÉP HỒ SƠ</span>
          <span v-else-if="isOffLine">NỘP HỒ SƠ TRỰC TUYẾN</span>
          <span v-else>THÊM MỚI HỒ SƠ</span> 
        </div>
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
      <div style="position: relative;" v-if="originality !== 1">
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content>
            <thong-tin-chung ref="thongtinchunghoso"></thong-tin-chung>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div style="position: relative;" v-else>
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content>
            <div slot="header">
              <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
              HƯỚNG DẪN &nbsp;&nbsp;&nbsp;&nbsp; 
            </div>
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <div class="ml-3 mr-3 pt-1" v-html="thongTinChiTietHoSo.dossierNote"></div>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!--  -->
      <thong-tin-chu-ho-so ref="thongtinchuhoso"></thong-tin-chu-ho-so>
      <!--  -->
      <div v-if="originality !== 1">
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content>
            <div slot="header" style="display: flex; align-items: center;">
              <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
              Tên hồ sơ &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>
              <v-card>
                <v-card-text>
                  <v-textarea
                    v-model="briefNote"
                    :rows="2"
                    box
                    label="Nhập tên hồ sơ"
                  ></v-textarea>
                </v-card-text>
              </v-card>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!--  -->
      <div style="position: relative;">
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content>
            <div slot="header" style="display: flex; align-items: center;">
              <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
              Thành phần hồ sơ &nbsp;&nbsp;&nbsp;&nbsp;
              <span v-if="!stateEditSample && originality !== 1">({{thongTinChiTietHoSo.sampleCount === 0 ? '?' : thongTinChiTietHoSo.sampleCount}}&nbsp;bộ hồ sơ)</span>
              <v-text-field
              class="px-0 py-0"
              style="width: 90px; max-width: 90px;"
              v-else-if="originality !== 1"
              v-model="thongTinChiTietHoSo.sampleCount"
              type="number"
              ></v-text-field> &nbsp;
              <v-icon v-if="!stateEditSample && originality !== 1" v-on:click.stop="stateEditSample = !stateEditSample" style="cursor: pointer;" size="16" color="primary">edit</v-icon>
              <v-icon v-else-if="originality !== 1" style="cursor: pointer;" v-on:click.stop="stateEditSample = !stateEditSample" size="16" color="primary">done</v-icon>
            </div>
            <thanh-phan-ho-so ref="thanhphanhoso" :onlyView="false" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!--  -->
      <div style="position: relative;" v-if="viaPortalDetail !== 0">
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content hide-actions value="2">
            <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát kết quả</div>
            <dich-vu-chuyen-phat-ket-qua ref="dichvuchuyenphatketqua" @changeViapostal="changeViapostal"></dich-vu-chuyen-phat-ket-qua>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!--  -->
      <div style="position: relative;">
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content hide-actions value="2">
            <thu-phi v-if="showThuPhi" v-model="payments" :viaPortal="viaPortalDetail"></thu-phi>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!--  -->
      <v-tabs icons-and-text centered class="mb-4">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <!-- <v-tab href="#tab-1" @click="luuHoSo">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            Lưu &nbsp;
            <v-icon>save</v-icon>
          </v-btn>
        </v-tab> -->
        <v-tab href="#tab-2" @click="tiepNhanHoSo()" v-if="originality !== 1 && tiepNhanState" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span v-if="formCode === 'UPDATE'">Lưu hồ sơ</span> <span v-else>Tiếp nhận</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-4" @click="tiepNhanHoSo('add')" v-if="originality !== 1 &&  formCode !== 'UPDATE' && formCode !== 'COPY' && tiepNhanState" class="px-0 py-0"> 
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">note_add</v-icon>  &nbsp;
            <span>Tiếp nhận và thêm mới</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-3" @click="luuHoSo" v-if="originality === 1" class="px-0 py-0"> 
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon> &nbsp;
            Lưu
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <!-- <v-tab href="#tab-3" @click="boSungHoSo">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            Bổ sung &nbsp;
            <v-icon>save</v-icon>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-4">
          <v-btn flat class="px-0 py-0 mx-0 my-0">
            Trả kết quả &nbsp;
            <v-icon>send</v-icon>
          </v-btn>
        </v-tab> -->
        <v-tab href="#tab-5" @click="goBack" class="px-0 py-0">
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="18">reply</v-icon> &nbsp;
            Quay lại
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
      </v-tabs>
    </div>
    <!-- add new template -->
    <div v-if="formTemplate === 'version_2.0'">
      <div style="display: none">
        <input id="serviceCode_hidden" type="text" :value="serviceCode_hidden">
        <input id="govAgencyCode_hidden" type="text" :value="govAgencyCode_hidden">
        <input id="dossierTemplateNo_hidden" type="text" :value="dossierTemplateNo_hidden">
        <input id="eformCode_hidden" type="text" :value="eformCode_hidden">
      </div>
      <div class="row-header">
        <div class="background-triangle-big"> 
          <span v-if="formCode === 'UPDATE'">SỬA HỒ SƠ</span>
          <span v-else-if="formCode === 'COPY'">SAO CHÉP HỒ SƠ</span>
          <span v-else-if="isOffLine">NỘP HỒ SƠ TRỰC TUYẾN</span>
          <span v-else>THÊM MỚI HỒ SƠ</span> 
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="templateName">
            {{templateName}}
          </div>
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <v-card flat color="#fff">
        <div id="formAlpacaNewTemplate" class="mb-5 pt-0"></div>
      </v-card>
      <!--  -->
      <v-tabs icons-and-text centered class="mb-4">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab href="#tab-2" @click="tiepNhanHoSoNewTemplate()" v-if="originality !== 1 && tiepNhanState" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span v-if="formCode === 'UPDATE'">Lưu hồ sơ</span> <span v-else>Tiếp nhận</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-4" @click="tiepNhanHoSoNewTemplate('add')" v-if="originality !== 1 &&  formCode !== 'UPDATE' && formCode !== 'COPY' && tiepNhanState" class="px-0 py-0"> 
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">note_add</v-icon>  &nbsp;
            <span>Tiếp nhận và thêm mới</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-3" @click="luuHoSo" v-if="originality === 1" class="px-0 py-0"> 
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon> &nbsp;
            Lưu
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <v-tab href="#tab-5" @click="goBack" class="px-0 py-0">
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="18">reply</v-icon> &nbsp;
            Quay lại
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
      </v-tabs>
    </div>
    <!--  -->
  </v-form>
</template>

<script>

import toastr from 'toastr'
import $ from 'jquery'
import ThongTinChuHoSo from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
import ThongTinChung from './TiepNhan/TiepNhanHoSo_ThongTinChung.vue'
import LePhi from './form_xu_ly/FeeDetail.vue'
import DichVuChuyenPhatKetQua from './TiepNhan/TiepNhanHoSo_DichVuChuyenPhatKetQua.vue'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index', 'id', 'formCode'],
  components: {
    'thong-tin-chu-ho-so': ThongTinChuHoSo,
    'thanh-phan-ho-so': ThanhPhanHoSo,
    'thong-tin-chung': ThongTinChung,
    'thu-phi': LePhi,
    'dich-vu-chuyen-phat-ket-qua': DichVuChuyenPhatKetQua
  },
  data: () => ({
    // add new template
    templateName: '',
    formTemplate: '',
    data_form_template: '',
    serviceCode_hidden: '',
    govAgencyCode_hidden: '',
    dossierTemplateNo_hidden: '',
    eformCode_hidden: '',
    // 
    validTNHS: false,
    dossierId: '',
    mark: true,
    stateEditSample: false,
    tiepNhanState: true,
    thongTinChiTietHoSo: {},
    payments: {},
    paymentProfile: {},
    briefNote: '',
    receiveDateEdit: '',
    editableDate: false,
    dueDateEdit: '',
    viaPortalDetail: 0,
    showThuPhi: false,
    inputTypes: [1, 3],
    outputTypes: [2],
    sampleCount: 0,
    isMobile: false,
    loadingAction: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    dichVuChuyenPhatKetQua () {
      return this.$store.getters.dichVuChuyenPhatKetQua
    },
    thongTinChuHoSo () {
      return this.$store.getters.thongTinChuHoSo
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.dossierId = vm.id
    })
  },
  beforeDestroy () {
    let viewport = $('meta[name="viewport"]')
    viewport.attr('content', 'initial-scale=1.0, width=device-width')
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  watch: {
    isMobile (val) {
      let viewport = $('meta[name="viewport"]')
      if (val) {
        viewport.attr('content', '')
      } else {
        viewport.attr('content', 'initial-scale=1.0, width=device-width')
      }
    }
  },
  methods: {
    onResize () {
      let vm = this
      let isMobile = window.innerWidth < 1024
      vm.isMobile = isMobile
    },
    initData: function (data) {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      let filter = {
        dossierTemplateNo: currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
      }
      vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result) {
        vm.templateName = result['templateName']
        if (result['newFormScript']) {
          vm.data_form_template = eval("( " + result['newFormScript'] + " ) ")
          console.log('data_form_template', vm.data_form_template)
          vm.formTemplate = 'version_2.0'
          let filterServiceConfig = {
            serviceConfigId: currentQuery.hasOwnProperty('service_config') && currentQuery.service_config ? currentQuery.service_config : ''
          }
          vm.$store.dispatch('getServiceConfigDetail', filterServiceConfig).then(function (data) {
            vm.serviceCode_hidden = data.serviceCode
            vm.govAgencyCode_hidden = data.govAgencyCode
            vm.dossierTemplateNo_hidden = currentQuery.hasOwnProperty('template_no') && currentQuery.template_no ? currentQuery.template_no : ''
            vm.eformCode_hidden = currentQuery.hasOwnProperty('eformCode') && currentQuery.eformCode ? currentQuery.eformCode : ''
            setTimeout (function () {
              if (vm.data_form_template) {
                let formScript, formData
                /* eslint-disable */
                if (vm.data_form_template) {
                  formScript = vm.data_form_template
                } else {
                  formScript = {}
                }
                formData = {}
                /* eslint-disable */
                formScript.data = formData
                window.$('#formAlpacaNewTemplate').alpaca(formScript)
              }
            }, 200)
          })
        } else {
          vm.formTemplate = 'version_1.0'
          vm.$store.dispatch('getDetailDossier', data).then(result => {
            vm.dossierId = result.dossierId
            vm.briefNote = result.dossierName ? result.dossierName : ''
            result['editable'] = false
            if (result.dossierStatus === '') {
              vm.$store.dispatch('pullNextactions', result).then(result2 => {
                if (result2) {
                  var actionDetail = result2.filter(function (item) {
                    return (item.actionCode === 1100 || item.actionCode === '1100')
                  })
                  vm.$store.dispatch('processPullBtnDetail', {
                    dossierId: result.dossierId,
                    actionId: actionDetail[0] ? actionDetail[0].processActionId : ''
                  }).then(resAction => {
                    result['editable'] = resAction && resAction.receiving ? resAction.receiving.editable : false
                    result['receivingDuedate'] = resAction && resAction.receiving && resAction.receiving.dueDate ? resAction.receiving.dueDate : null
                    result['receivingDate'] = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                    vm.editableDate = resAction && resAction.receiving ? resAction.receiving.editable : false
                    vm.dueDateEdit = resAction && resAction.receiving && resAction.receiving.dueDate ? resAction.receiving.dueDate : ''
                    vm.receiveDateEdit = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                    if (resAction && resAction.payment && resAction.payment.requestPayment > 0 && resAction.payment.requestPayment !== 5) {
                      vm.showThuPhi = true
                      vm.payments = resAction.payment
                    }
                    // call initData thong tin chung ho so
                    if (vm.$refs.thongtinchunghoso) {
                      vm.$refs.thongtinchunghoso.initData(result)
                    }
                  })
                } else {
                  // call initData thong tin chung ho so
                  if (vm.$refs.thongtinchunghoso) {
                    vm.$refs.thongtinchunghoso.initData(result)
                  }
                }
              })
            } else {
              if (vm.$refs.thongtinchunghoso) {
                console.log('has thong tin chung ho so')
                vm.$refs.thongtinchunghoso.initData(result)
              }
            }
            vm.thongTinChiTietHoSo = result
            vm.$refs.thongtinchuhoso.initData(result)
            vm.$refs.thanhphanhoso.initData(result)
            vm.viaPortalDetail = result.viaPostal
            if (result.viaPostal > 0) {
              let postalAddress = result.address ? (result.address + ', ' + result.wardName + ' - ' + result.districtName + ' - ' + result.cityName) : ''
              if (vm.formCode === 'NEW' && vm.originality === 1) {
                result['postalAddress'] = postalAddress
                result['postalTelNo'] = vm.thongTinChuHoSo['contactTelNo']
              }
              vm.$store.commit('setDichVuChuyenPhatKetQua', result)
            }
          }).catch(reject => {
          })
        }
      })
    },
    luuHoSo () {
      var vm = this
      console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      let thongtinchunghoso = this.$refs.thongtinchunghoso ? this.$refs.thongtinchunghoso.getthongtinchunghoso() : {}
      let thongtinchuhoso = this.$refs.thongtinchuhoso.thongTinChuHoSo
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso ? this.$refs.thongtinchuhoso.thongTinNguoiNopHoSo : {}
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      if (validThongtinchuhoso['validForm']) {
        let passValid = false
        if (!validThongtinchuhoso['validApplicant']) {
          let x = confirm(validThongtinchuhoso['message'] + ' Bạn có muốn tiếp tục?')
          if (x) {
            passValid = true
          }
        } else { passValid = true }
        if (passValid) {
          if (!vm.$refs.thanhphanhoso.validDossierTemplate()) {
            return
          }
          if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
            return
          }
          let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
          let dossierTemplates = thanhphanhoso
          let listAction = []
          let listDossierMark = []
          if (dossierFiles) {
            dossierFiles.forEach(function (value, index) {
              if (value.eForm) {
                value['dossierId'] = vm.dossierId
                listAction.push(vm.$store.dispatch('putAlpacaForm', value))
              }
            })
          }
          // if (vm.$refs.thanhphanhoso) {
          //   vm.$refs.thanhphanhoso.saveMark()
          // }
          let tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua, thongtinchunghoso)
          tempData['dossierId'] = vm.dossierId
          tempData['sampleCount'] = vm.thongTinChiTietHoSo.sampleCount
          tempData['originality'] = vm.originality
          console.log('data put dossier -->', tempData)
          setTimeout(function () {
            vm.$store.dispatch('putDossier', tempData).then(function (result) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              if (vm.formCode === 'UPDATE') {
                vm.goBack()
              } else {
                var initData = vm.$store.getters.loadingInitData
                let actionUser = initData.user.userName ? initData.user.userName : ''
                let dataPostAction = {
                  dossierId: vm.dossierId,
                  actionCode: 1100,
                  actionNote: '',
                  actionUser: actionUser,
                  payload: '',
                  security: '',
                  assignUsers: '',
                  payment: vm.payments,
                  createDossiers: '',
                  dueDate: tempData.dueDate
                }
                vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
                  // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
                  let currentQuery = vm.$router.history.current.query
                  vm.$router.push({
                    path: '/danh-sach-ho-so/4/chi-tiet-ho-so/' + result.dossierId,
                    query: {
                      activeTab: 'tabs-1'
                    }
                  })
                  vm.tiepNhanState = false
                })
              }
            }).catch(function (xhr) {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          }, 500)
        }
      }
    },
    tiepNhanHoSo (type) {
      var vm = this
      console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      var thongtinchunghoso = this.$refs.thongtinchunghoso.getthongtinchunghoso()
      let thongtinchuhoso = this.$refs.thongtinchuhoso.getThongTinChuHoSo()
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      // let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      if (validThongtinchuhoso['validForm']) {
        let passValid = false
        if (!validThongtinchuhoso['validApplicant']) {
          let x = confirm(validThongtinchuhoso['message'] + ' Bạn có muốn tiếp tục?')
          if (x) {
            passValid = true
          }
        } else { passValid = true }
        if (passValid) {
          console.log('valid confirm2', passValid)
          vm.loadingAction = true
          if (!vm.$refs.thanhphanhoso.validDossierTemplate()) {
            vm.loadingAction = false
            return
          }
          if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
            vm.loadingAction = false
            return
          }
          let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
          let dossierTemplates = thanhphanhoso
          let listAction = []
          let listDossierMark = []
          if (dossierFiles) {
            dossierFiles.forEach(function (value, index) {
              if (value.eForm) {
                value['dossierId'] = vm.dossierId
                listAction.push(vm.$store.dispatch('putAlpacaForm', value))
              }
            })
          }
          // if (vm.$refs.thanhphanhoso) {
          //   vm.$refs.thanhphanhoso.saveMark()
          // }
          var tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua, thongtinchunghoso)
          tempData['dossierId'] = vm.dossierId
          tempData['sampleCount'] = vm.thongTinChiTietHoSo.sampleCount
          tempData['dossierName'] = vm.briefNote
          tempData['originality'] = vm.originality
          console.log('data put dossier -->', tempData)
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            vm.loadingAction = false
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            if (vm.formCode === 'UPDATE') {
              vm.goBack()
            } else {
              var initData = vm.$store.getters.loadingInitData
              let actionUser = initData.user.userName ? initData.user.userName : ''
              //
              var paymentsOut = {}
              if (vm.showThuPhi) {
                paymentsOut = {
                  requestPayment: vm.payments['requestPayment'],
                  paymentNote: vm.payments['paymentNote'],
                  advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                  feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                  serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                  shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
                }
              }
              var payloadDate = {
                'dueDate': vm.editableDate && tempData.dueDate ? tempData.dueDate : vm.dueDateEdit,
                'receiveDate': vm.receiveDateEdit
              }
              let dataPostAction = {
                dossierId: vm.dossierId,
                actionCode: 1100,
                actionNote: '',
                actionUser: actionUser,
                payload: payloadDate,
                security: '',
                assignUsers: '',
                payment: paymentsOut,
                createDossiers: ''
              }
              vm.loadingAction = true
              vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
                vm.loadingAction = false
                if (!type) {
                  vm.goBack()
                  vm.tiepNhanState = false
                } else {
                  // tạo hồ sơ mới
                  let current = vm.$router.history.current
                  let newQuery = current.query
                  let dataCreateDossier = vm.$store.getters.getDataCreateDossier
                  vm.loadingAction = true
                  vm.$store.dispatch('postDossier', dataCreateDossier).then(function (result) {
                    vm.loadingAction = false
                    vm.dossierId = result.dossierId
                    vm.$refs.thongtinchunghoso.changeDossierNo(result.dossierNo)
                    let queryString = '?'
                    for (let key in newQuery) {
                      if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
                        queryString += key + '=' + newQuery[key] + '&'
                      }
                    }
                    console.log('queryString=====', queryString)
                    vm.$router.push({
                      path: '/danh-sach-ho-so/0/ho-so/' + result.dossierId + '/NEW' + queryString,
                      query: {
                        renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                      }
                    })
                  }).catch(reject => {
                    vm.loadingAction = false
                  })
                }
              }).catch(reject => {
                vm.loadingAction = false
              })
            }
          }).catch(rejectXhr => {
            vm.loadingAction = false
            console.log('rejectXhr==========', rejectXhr)
            toastr.clear()
            toastr.error('Yêu cầu của bạn thực hiện thất bại.')
          })
        }
      }
    },
    boSungHoSo () {
      var vm = this
      console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      let thongtinchunghoso = this.$refs.thongtinchunghoso.getthongtinchunghoso()
      let thongtinchuhoso = this.$refs.thongtinchuhoso.thongTinChuHoSo
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.thongTinNguoiNopHoSo
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      let lephi = this.$refs.lephi.lePhi
      let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua
      console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      if (vm.$refs.thongtinchuhoso.showValid()) {
        let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
        let dossierTemplates = thanhphanhoso
        let listAction = []
        let listDossierMark = []
        if (dossierTemplates) {
          dossierTemplates.forEach(function (val, index) {
            if (val.partType === 1) {
              val['dossierId'] = vm.dossierId
              listDossierMark.push(vm.$store.dispatch('postDossierMark', val))
            }
          })
          dossierFiles.forEach(function (value, index) {
            if (value.eForm) {
              value['dossierId'] = vm.dossierId
              listAction.push(vm.$store.dispatch('putAlpacaForm', value))
            }
          })
        }
        Promise.all(listDossierMark).then(values => {
        }).catch(function (xhr) {
        })
        Promise.all(listAction).then(values => {
          console.log(values)
          let tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, thanhphanhoso, lephi, dichvuchuyenphatketqua, thongtinchunghoso)
          console.log('data put dossier -->', tempData)
          tempData['dossierId'] = vm.dossierId
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            let dataPostAction = {
              dossierId: vm.dossierId,
              actionCode: 7100,
              payload: '',
              security: '',
              assignUsers: {},
              payment: {},
              createDossiers: {},
              dueDate: tempData.dueDate
            }
            vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
            })
          })
        }).catch(reject => {
        })
      }
    },
    changeViapostal (viapostal) {
      if (viapostal) {
        this.viaPortalDetail = 2
      } else {
        this.viaPortalDetail = 1
      }
    },
    // 
    tiepNhanHoSoNewTemplate (type) {
      let vm = this
      let actionUser = initData.user.userName ? initData.user.userName : ''
      let data = {
        originality: vm.getOriginality(),
        serviceCode: $('#serviceCode_hidden').val(),
        govAgencyCode: $('#govAgencyCode_hidden').val(),
        templateNo: $('#dossierTemplateNo_hidden').val()
      }
      let dataFormTemplate = window.$('#formAlpacaNewTemplate').alpaca('get').getValue()
      let dataFilter = dataFormTemplate
      for (let i in dataFilter) {
        if (String(i).indexOf('_') >= 0 || String(i) === 'dueDate' || String(i) === 'payment') {
          delete dataFilter[i]
        }
      }
      let dataCreate = Object.assign({}, data, dataFilter)
      vm.loadingAction = true
      vm.$store.dispatch('postDossier', dataCreate).then(function (result) {
        if (dataFormTemplate['payment']) {
          paymentsOut = JSON.parse(dataFormTemplate['payment'])
        }
        var payloadDate = {
          dueDate: '',
          receiveDate: ''
        }
        let dataPostAction = {
          dossierId: result.dossierId,
          actionCode: 1100,
          actionNote: '',
          actionUser: actionUser,
          payload: payloadDate,
          security: '',
          assignUsers: '',
          payment: paymentsOut,
          createDossiers: ''
        }
        vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
          vm.loadingAction = false
          if (!type) {
            vm.goBack()
          } else {
          }
        }).catch(reject => {
          vm.loadingAction = false
        })
        
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    // 
    parseDateToTimestamp (date) {
      if (!date) {
        return null
      }
      let [day, month, year] = `${date}`.split('/')
      let day2 = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      return (new Date (day2)).getTime()
    },
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (vm.isOffLine) {
        vm.$router.push({
          path: '/add-dvc/0'
        })
      } else {
        vm.$router.push({
          path: '/danh-sach-ho-so/' + currentParams.index,
          query: currentQuery
        })
      }
    }
  }
}
</script>
