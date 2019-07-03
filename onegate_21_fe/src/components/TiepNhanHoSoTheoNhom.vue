<template>
  <div>
    <v-form v-model="validTNHS" ref="formTiepNhanHoSo" lazy-validation>
      <div class="row-header">
        <div class="background-triangle-big">
          <span>THÊM MỚI HỒ SƠ</span> 
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="processOptionSelected.processName">
            {{processOptionSelected.processName}}
          </div>
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <div style="position: relative;border-bottom: 1px solid #dedede;">
        <v-expansion-panel :value="[true]" expand  class="expansion-pl">
          <v-expansion-panel-content>
            <v-card>
              <v-card-text class="pb-0 mb-3">
                <v-layout wrap>
                  <v-flex xs12 sm2>
                    <v-subheader class="pl-0 text-header">Chọn nhóm hồ sơ: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm10>
                    <v-select
                    :items="groupDossierList"
                    item-text="dossierName"
                    item-value="dossierId"
                    v-model="groupDossierSelected"
                    :placeholder="groupDossierList.length === 0 ? 'Chưa có nhóm hồ sơ nào được tạo' : ''"
                    return-object
                    >
                    </v-select>
                  </v-flex>
                  <!--  -->
                  <!-- <v-flex xs12 sm2 class="my-2">
                    <v-subheader class="pl-0 text-header">Tên nhóm hồ sơ: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm10 class="my-2">
                    <v-text-field class="mt-1"
                    v-model="groupDossierSelected.dossierName"
                    :disabled="groupDossierSelected ? false : true"
                    ></v-text-field>
                  </v-flex> -->
                </v-layout>
                <v-flex xs12 class="text-right">
                  <v-btn v-if="groupDossierSelected && activeAddDossierIntoGroup && !activeAddGroup" color="primary" @click="updateGroupDossier" class="mr-3">
                    <v-icon size="20">edit</v-icon>  &nbsp;
                    <span>Cập nhật nhóm hồ sơ</span>
                  </v-btn>
                  <v-btn color="primary" @click="doSubmitAddGroupDialog" class="mx-0">
                    <v-icon size="20">add</v-icon>  &nbsp;
                    <span>Thêm nhóm hồ sơ</span>
                  </v-btn>
                </v-flex>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!-- Thông tin nhóm hồ sơ -->
      <div class="row-header" v-if="!activeAddDossierIntoGroup && groupDossierSelected">
        <div class="background-triangle-big">
          <span>THÔNG TIN NHÓM</span> 
        </div>
        <div class="layout row wrap header_tools row-blue">
          <!-- <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="processOptionSelected.processName">
            {{processOptionSelected.processName}}
          </div> -->
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn color="primary" @click="createDossierIntoGroup" class="mx-0 my-0">
              <v-icon size="20">add</v-icon>  &nbsp;
              <span>Tạo hồ sơ trong nhóm</span>
            </v-btn>
          </div>
        </div> 
      </div>
      <div v-if="(tiepNhanState || activeAddGroup) && !activeAddDossierIntoGroup">
        <v-layout wrap>
          <v-flex xs12 sm2 class="my-2">
            <v-subheader class="pl-0 text-header pt-2">Tên nhóm hồ sơ: </v-subheader>
          </v-flex>
          <v-flex xs12 sm10 class="my-2">
            <v-text-field class="mt-1"
            v-model="groupDossierSelected.dossierName"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <thong-tin-chu-ho-so :showApplicant="true" :showDelegate="false" ref="thongtinnguoinophoso"></thong-tin-chu-ho-so>
        <div style="position: relative;">
          <v-expansion-panel :value="0" class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Thành phần hồ sơ theo nhóm&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <thanh-phan-ho-so-1 ref="thanhphanhoso" :onlyView="false" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so-1>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div style="position: relative;">
          <v-expansion-panel :value="0" class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Hồ sơ trong nhóm&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div class="mb-3" v-if="dossiersIntoGroup.length > 0">
                <v-data-table
                  :headers="headers"
                  :items="dossiersIntoGroup"
                  hide-actions
                  class="table-landing table-bordered"
                  item-key="dossierId"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="viewDetail(props.item, props.index)" style="cursor: pointer">
                      <td class="text-xs-center" width="70px">
                        <span>{{props.index + 1}}</span>
                      </td>
                      <td class="text-xs-left" width="250px">
                        {{ props.item.dossierNo }}
                      </td>
                      <td class="text-xs-left">
                        {{ props.item.applicantName }}
                      </td>
                      <td class="text-xs-left" width="250px">
                        {{ props.item.dossierSubStatusText ? props.item.dossierSubStatusText : props.item.dossierStatusText }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </div>
              <div v-else class="pl-3 py-2">Chưa có hồ sơ nào</div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <!-- <v-flex xs12 class="text-right">
          <v-btn color="primary" @click="createDossierIntoGroup" class="mx-0 mr-3">
            <v-icon size="20">add</v-icon>  &nbsp;
            <span>Thêm mới hồ sơ</span>
          </v-btn>
        </v-flex> -->
      </div>
      <!-- Thông tin hồ sơ trong nhóm -->
      <div v-if="activeAddDossierIntoGroup">
        <thong-tin-chu-ho-so :showApplicant="false" :showDelegate="true" v-if="activeAddDossierIntoGroup" ref="thongtinchuhoso"></thong-tin-chu-ho-so>
        <div style="position: relative;" v-if="activeAddDossierIntoGroup">
          <v-expansion-panel :value="0" class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header" style="display: flex; align-items: center;">
                <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
                Thành phần hồ sơ &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <thanh-phan-ho-so ref="thanhphanhoso2" :onlyView="false" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <!--  -->
        <div style="position: relative;" v-if="viaPortalDetail !== 0">
          <v-expansion-panel :value="0"  class="expansion-pl">
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
      </div>
      <!--  -->
      <v-tabs icons-and-text centered class="mb-4" v-if="activeAddDossierIntoGroup || activeAddGroup">
        <!-- <v-tabs-slider color="primary"></v-tabs-slider> -->
        <!-- Cập nhật thông tin nhóm -->
        <v-tab href="#tab-1" @click="putGroupDossier()" v-if="activeAddGroup" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Cập nhật</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <!--  -->
        <v-tab href="#tab-1" @click="tiepNhanHoSo()" v-if="tiepNhanState && !activeAddGroup" class="px-0 py-0"> 
          <v-btn flat class="" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">save</v-icon>  &nbsp;
            <span>Tiếp nhận hồ sơ</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab>
        <!-- <v-tab href="#tab-2" @click="tiepNhanHoSo('add')" v-if="tiepNhanState && !activeAddGroup" class="px-0 py-0"> 
          <v-btn flat class=""
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            <v-icon size="20">note_add</v-icon>  &nbsp;
            <span>Tiếp nhận và thêm mới</span>
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-tab> -->
        <!--  -->
        <v-tab href="#tab-2" @click="goBack" class="px-0 py-0">
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
    </v-form>
    <v-dialog v-model="dialogAddGroup" max-width="500" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Tên nhóm hồ sơ</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialogAddGroup = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pb-0 pt-2">
            <v-text-field v-model="groupDossierNameCreate" box placeholder="Nhập tên nhóm hồ sơ">
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogAddGroup = false"
            >
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
            <v-btn color="primary" flat="flat" @click.native="doSubmitAddGroup"
            >
              <v-icon>save</v-icon>&nbsp;
              Đồng ý
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import toastr from 'toastr'
import $ from 'jquery'
import ThongTinChuHoSo from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
import ThanhPhanHoSo1 from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
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
    'thanh-phan-ho-so-1': ThanhPhanHoSo1,
    'thong-tin-chung': ThongTinChung,
    'thu-phi': LePhi,
    'dich-vu-chuyen-phat-ket-qua': DichVuChuyenPhatKetQua
  },
  data: () => ({
    groupDossierList: [],
    groupDossierSelected: '',
    dossiersIntoGroup: [],
    processOptionSelected: '',
    thongTinNhomHoSo: '',
    validTNHS: false,
    groupDossierNameCreate: '',
    currentDossierIntoGroup: '',
    dossierId: '',
    mark: true,
    stateEditSample: false,
    tiepNhanState: false,
    activeAddGroup: false,
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
    loadingAction: false,
    dialogAddGroup: false,
    activeAddDossierIntoGroup: false,
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false
      }
    ]
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
      let query = vm.$router.history.current.query
      let filter = {
        serviceConfigId: query.hasOwnProperty('service_config') ? query.service_config : '',
        processOptionId: query.hasOwnProperty('processOptionId') ? query.processOptionId : ''
      }
      vm.initData(filter)
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
    },
    groupDossierSelected (val) {
      let vm = this
      if (val) {
        vm.tiepNhanState = true
        vm.thongTinNhomHoSo = val
        vm.onChangeGroupDossier()
      } else {
        vm.tiepNhanState = false
        vm.thongTinNhomHoSo = ''
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
      vm.$store.dispatch('getServiceOpionByProcess', data).then(result => {
        vm.processOptionSelected = result.filter(function(item) {
          return String(item.processOptionId) === String(data.processOptionId)
        })[0]
        vm.groupDossierNameCreate = vm.processOptionSelected.processName
      }).catch(reject => {
      })
      vm.getGroupDossier()
    },
    getGroupDossier () {
      let vm = this
      let query = vm.$router.history.current.query
      let filter = {
        service: query.serviceCode ? query.serviceCode : '',
        template: query.template_no ? query.template_no : '',
        agency: query.govAgencyCode ? query.govAgencyCode : ''
      }
      vm.$store.dispatch('getGroupDossier', filter).then(result => {
        vm.groupDossierList = result
        if (query.hasOwnProperty('groupDossierId') && query.groupDossierId) {
          let id = query.groupDossierId
          vm.$store.dispatch('getDetailDossier', id).then(resultDossier => {
            vm.activeAddDossierIntoGroup = false
            vm.activeAddGroup = true
            vm.groupDossierSelected = resultDossier
          })
        }
      })
    },
    onChangeGroupDossier () {
      let vm = this
      vm.activeAddDossierIntoGroup = false
      vm.activeAddGroup = true
      let current = vm.$router.history.current
      let currentQuery = current.query
      currentQuery['groupDossierId'] = vm.groupDossierSelected.dossierId
      vm.$router.push({
        path: current.path,
        query: currentQuery
      })
      setTimeout (function () {
        let id = vm.groupDossierSelected.dossierId
        vm.$store.dispatch('getDetailDossier', id).then(resultDossier => {
          let filter = {
            groupDossierId: id
          }
          vm.$store.dispatch('getDossiersIntoGroup', filter).then(function (result) {
            vm.dossiersIntoGroup = result
          })
          vm.$refs.thongtinnguoinophoso.initData(resultDossier)
          vm.$refs.thanhphanhoso.initData(resultDossier)
        })
      }, 300)
    },
    updateGroupDossier () {
      let vm = this
      vm.activeAddDossierIntoGroup = false
      vm.activeAddGroup = true
      let id = vm.groupDossierSelected.dossierId
      vm.$store.dispatch('getDetailDossier', id).then(resultDossier => {
        vm.$refs.thongtinnguoinophoso.initData(resultDossier)
        vm.$refs.thanhphanhoso.initData(resultDossier)
      })
    },
    doSubmitAddGroupDialog () {
      let vm = this
      vm.dialogAddGroup = true
      vm.groupDossierNameCreate = vm.processOptionSelected.processName
    },
    doSubmitAddGroup () {
      let vm = this
      vm.activeAddDossierIntoGroup = false
      let query = vm.$router.history.current.query
      let data = {
        serviceCode: query.hasOwnProperty('serviceCode') ? query.serviceCode : '',
        govAgencyCode: query.hasOwnProperty('govAgencyCode') ? query.govAgencyCode : '',
        templateNo: query.hasOwnProperty('template_no') ? query.template_no : '',
        originality: 9
      }
      vm.$store.dispatch('postDossier', data).then(function (result) {
        // 
        result.dossierName = vm.groupDossierNameCreate
        vm.$store.dispatch('putDossier', result).then(function (result) {
          vm.dialogAddGroup = false
          vm.activeAddGroup = true
          vm.groupDossierList.unshift(result)
          vm.groupDossierSelected = vm.groupDossierList[0]
          vm.$refs.thongtinnguoinophoso.initData(result)
          vm.$refs.thanhphanhoso.initData(result)
        }).catch(function (xhr) {
        })
        // 
      }).catch(reject => {
      })
    },
    putGroupDossier () {
      let vm = this
      let thongtinnguoinophoso = this.$refs.thongtinnguoinophoso ? this.$refs.thongtinnguoinophoso.thongTinNguoiNopHoSo : {}
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      let validThongtinnguoinophoso = vm.$refs.thongtinnguoinophoso.showValid()
      if (validThongtinnguoinophoso['validForm']) {
        let passValid = false
        if (!validThongtinnguoinophoso['validApplicant']) {
          let x = confirm(validThongtinnguoinophoso['message'] + ' Bạn có muốn tiếp tục?')
          if (x) {
            passValid = true
          }
        } else { passValid = true }
        if (passValid) {
          if (!vm.$refs.thanhphanhoso.validDossierTemplate()) {
            return
          }
          // if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
          //   return
          // }
          let dossierFiles = vm.$refs.thanhphanhoso.dossierFilesItems
          let dossierTemplates = thanhphanhoso
          let listAction = []
          let listDossierMark = []
          if (dossierFiles) {
            dossierFiles.forEach(function (value, index) {
              if (value.eForm) {
                value['dossierId'] = vm.thongTinNhomHoSo.dossierId
                listAction.push(vm.$store.dispatch('putAlpacaForm', value))
              }
            })
          }
          let tempData = Object.assign(vm.thongTinNhomHoSo, thongtinnguoinophoso)
          tempData['dossierId'] = vm.thongTinNhomHoSo.dossierId
          tempData['originality'] = vm.thongTinNhomHoSo.originality
          tempData['dossierName'] = vm.groupDossierSelected.dossierName
          console.log('data put groupDossier -->', tempData)
          setTimeout(function () {
            vm.$store.dispatch('putDossier', tempData).then(function (result) {
              toastr.clear()
              toastr.success('Cập nhật thành công')
            }).catch(function (xhr) {
              toastr.clear()
              toastr.error('Yêu cầu của bạn thực hiện thất bại.')
            })
          }, 500)
        }
      }
    },
    createDossierIntoGroup () {
      let vm = this
      let query = vm.$router.history.current.query
      vm.activeAddGroup = false
      vm.activeAddDossierIntoGroup = true
      let data = {
        serviceCode: query.hasOwnProperty('serviceCode') ? query.serviceCode : '',
        govAgencyCode: query.hasOwnProperty('govAgencyCode') ? query.govAgencyCode : '',
        templateNo: query.hasOwnProperty('template_no') ? query.template_no : '',
        originality: vm.originality,
        groupDossierId: vm.thongTinNhomHoSo.dossierId,
        dossierId: ''
      }
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.currentDossierIntoGroup = result
        data.dossierId = result.dossierId
        vm.$store.dispatch('postDossierIntoGroup', data).then(function (result) {
        })
        setTimeout (function () {
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
                  if (resAction && resAction.payment && resAction.payment.requestPayment > 0) {
                    vm.showThuPhi = true
                    vm.payments = resAction.payment
                  }
                })
              } else {
              }
            })
          } else {
            if (vm.$refs.thongtinchunghoso) {
              console.log('has thong tin chung ho so')
              vm.$refs.thongtinchunghoso.initData(result)
            }
          }
          vm.$refs.thongtinchuhoso.initData(result)
          vm.$refs.thanhphanhoso2.initData(result)
          vm.viaPortalDetail = result.viaPostal
          if (result.viaPostal > 0) {
            let postalAddress = result.address ? (result.address + ', ' + result.wardName + ' - ' + result.districtName + ' - ' + result.cityName) : ''
            if (vm.formCode === 'NEW' && vm.originality === 1) {
              result['postalAddress'] = postalAddress
              result['postalTelNo'] = vm.thongTinChuHoSo['contactTelNo']
            }
            vm.$store.commit('setDichVuChuyenPhatKetQua', result)
          }
        }, 300)
      }).catch(reject => {
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
      let thongtinchuhoso = this.$refs.thongtinchuhoso.getThongTinChuHoSo()
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso2.dossierTemplateItems
      // let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      if (validThongtinchuhoso['validForm']) {
        let passValid = true
        if (passValid) {
          vm.loadingAction = true
          if (!vm.$refs.thanhphanhoso2.validDossierTemplate()) {
            vm.loadingAction = false
            return
          }
          if (dichvuchuyenphatketqua.viaPostal === 2 && !vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat()) {
            vm.loadingAction = false
            return
          }
          let dossierFiles = vm.$refs.thanhphanhoso2.dossierFilesItems
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
          var tempData = Object.assign(thongtinchuhoso, thongtinnguoinophoso, dichvuchuyenphatketqua)
          tempData['dossierId'] = vm.currentDossierIntoGroup.dossierId
          tempData['sampleCount'] = vm.currentDossierIntoGroup.sampleCount
          tempData['originality'] = vm.originality
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
                dossierId: vm.currentDossierIntoGroup.dossierId,
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
                  // vm.goBack()
                  // vm.tiepNhanState = false
                  toastr.success('Thêm hồ sơ vào nhóm thành công')
                  vm.onChangeGroupDossier()
                  vm.activeAddDossierIntoGroup = false
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
    durationText (durationUnit, durationCount) {
      let durationText
      if (durationUnit === 1 && durationCount > 8) {
        let day = Math.floor(durationCount / 8) + ' ngày'
        let hours
        if (durationCount % 8 !== 0) {
          hours = ((durationCount / 8) - Math.floor(durationCount / 8)) * 8 + ' giờ'
        } else {
          hours = ''
        }
        durationText = `${day} ${hours}`
      } else if (durationUnit === 0) {
        durationText = durationCount + ' ngày'
      } else if (durationUnit === 1 && durationCount <= 8) {
        durationText = durationCount + ' giờ'
      }
      return durationText
    },
    viewDetail (item, indexItem) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.$router.push('/danh-sach-ho-so/0/chi-tiet-ho-so/' + item['dossierId'])
    },
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      vm.$router.push({
        path: '/danh-sach-ho-so/' + currentParams.index,
        query: currentQuery
      })
    }
  }
}
</script>
