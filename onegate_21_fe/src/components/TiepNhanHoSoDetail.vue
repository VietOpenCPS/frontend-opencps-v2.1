<template>
  <v-form v-model="validTNHS" ref="formTiepNhanHoSo" lazy-validation>
    <div class="row-header">
      <div class="background-triangle-big"> <span>THÊM MỚI HỒ SƠ</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="thongTinChiTietHoSo.serviceName">
          {{thongTinChiTietHoSo.serviceName}}
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
    <div style="position: relative;" v-if="originality !== 1">
      <v-expansion-panel class="expansion-pl">
        <v-expansion-panel-content hide-actions value="1">
          <thong-tin-chung ref="thongtinchunghoso"></thong-tin-chung>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div style="position: relative;" v-else>
      <v-expansion-panel class="expansion-pl">
        <v-expansion-panel-content hide-actions value="1">
          <div slot="header">
            <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
            HƯỚNG DẪN &nbsp;&nbsp;&nbsp;&nbsp; 
          </div>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <span class="ml-3">{{thongTinChiTietHoSo.dossierNote}}</span>
            </v-flex>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <!--  -->
    <thong-tin-chu-ho-so ref="thongtinchuhoso"></thong-tin-chu-ho-so>
    <!--  -->
    <div style="position: relative;">
      <v-expansion-panel class="expansion-pl">
        <v-expansion-panel-content hide-actions value="1">
          <div slot="header" style="display: flex; align-items: center;">
            <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div>
            Thành phần hồ sơ &nbsp;&nbsp;&nbsp;&nbsp;
            <span v-if="!stateEditSample && originality !== 1">({{thongTinChiTietHoSo.sampleCount === 0 ? '?' : thongTinChiTietHoSo.sampleCount}}&nbsp;bộ hồ sơ)</span>
            <v-text-field
            class="px-0 py-0"
            style="width: 90px; max-width: 90px;"
            v-else-if="originality !== 1"
            v-model="thongTinChiTietHoSo.sampleCount"
            v-on:click.stop=""
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
      <v-expansion-panel class="expansion-pl">
        <v-expansion-panel-content hide-actions value="2">
          <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát kết quả</div>
          <dich-vu-chuyen-phat-ket-qua ref="dichvuchuyenphatketqua" @changeViapostal="changeViapostal"></dich-vu-chuyen-phat-ket-qua>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <!--  -->
    <div style="position: relative;">
      <v-expansion-panel class="expansion-pl">
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
      <v-tab href="#tab-2" @click="tiepNhanHoSo" v-if="originality !== 1 && tiepNhanState"> 
        <v-btn flat class="px-0 py-0 mx-0 my-0">
          Tiếp nhận &nbsp;
          <v-icon>save</v-icon>
        </v-btn>
      </v-tab>
      <v-tab href="#tab-3" @click="luuHoSo" v-if="originality === 1"> 
        <v-btn flat class="px-0 py-0 mx-0 my-0">
          Lưu &nbsp;
          <v-icon>save</v-icon>
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
      <v-tab href="#tab-5" @click="goBack">
        <v-btn flat class="px-0 py-0 mx-0 my-0">
          Quay lại &nbsp;
          <v-icon>undo</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>
  </v-form>
</template>

<script>
import router from '@/router'
import toastr from 'toastr'
// import * as utils from '../store/onegate_utils'
import ThongTinChuHoSo from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
import ThongTinChung from './TiepNhan/TiepNhanHoSo_ThongTinChung.vue'
import LePhi from './form_xu_ly/FeeDetail.vue'
import DichVuChuyenPhatKetQua from './TiepNhan/TiepNhanHoSo_DichVuChuyenPhatKetQua.vue'

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
    validTNHS: false,
    dossierId: '',
    mark: true,
    stateEditSample: false,
    tiepNhanState: true,
    thongTinChiTietHoSo: {},
    payments: {},
    receiveDateEdit: '',
    viaPortalDetail: 0,
    showThuPhi: false,
    inputTypes: [1, 3],
    outputTypes: [2],
    sampleCount: 0
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
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.dossierId = vm.id
    })
  },
  watch: {
  },
  methods: {
    initData: function (data) {
      var vm = this
      vm.$store.dispatch('getDetailDossier', data).then(result => {
        vm.dossierId = result.dossierId
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
                vm.receiveDateEdit = resAction && resAction.receiving ? resAction.receiving.receiveDate : ''
                if (resAction && resAction.payment && resAction.payment.requestPayment > 0) {
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
        }
        vm.thongTinChiTietHoSo = result
        // call initData thong tin chu ho so
        if (result['delegateCityCode'] === '') {
          result['delegateCityCode'] = 25
        }
        if (result['cityCode'] === '') {
          result['cityCode'] = 25
        }
        vm.$refs.thongtinchuhoso.initData(result)
        // call initData thanh phan ho so
        vm.$refs.thanhphanhoso.initData(result)
        // call initData dich vu ket qua
        vm.viaPortalDetail = result.viaPostal
        if (result.viaPostal > 0) {
          vm.$store.commit('setDichVuChuyenPhatKetQua', result)
          // vm.$refs.dichvuchuyenphatketqua.initData(result)
        }
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
      if (vm.$refs.thongtinchuhoso.showValid()) {
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
        console.log('data put dossier -->', tempData)
        setTimeout(function () {
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
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
              payment: JSON.stringify(vm.payments),
              createDossiers: '',
              dueDate: tempData.dueDate
            }
            vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              let currentQuery = vm.$router.history.current.query
              router.push({
                path: '/danh-sach-ho-so/4/chi-tiet-ho-so/' + result.dossierId,
                query: {
                  activeTab: 'tabs-1'
                }
              })
              vm.tiepNhanState = false
            })
          }).catch(function (xhr) {
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        }, 500)
      }
    },
    tiepNhanHoSo () {
      var vm = this
      console.log('luu Ho So--------------------')
      vm.$store.commit('setPrintPH', false)
      let thongtinchunghoso = this.$refs.thongtinchunghoso.getthongtinchunghoso()
      let thongtinchuhoso = this.$refs.thongtinchuhoso.getThongTinChuHoSo()
      let thongtinnguoinophoso = this.$refs.thongtinchuhoso.getThongTinNguoiNopHoSo()
      let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
      // let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      let dichvuchuyenphatketqua = vm.dichVuChuyenPhatKetQua
      console.log('validate TNHS formThongtinchuhoso.validate()', vm.$refs.thongtinchuhoso.showValid())
      if (vm.$refs.thongtinchuhoso.showValid()) {
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
        console.log('data put dossier -->', tempData)
        setTimeout(function () {
          vm.$store.dispatch('putDossier', tempData).then(function (result) {
            // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
            var initData = vm.$store.getters.loadingInitData
            let actionUser = initData.user.userName ? initData.user.userName : ''
            //
            var paymentsOut = {}
            if (vm.showThuPhi) {
              paymentsOut = {
                requestPayment: vm.payments['requestPayment'],
                advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
                feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
                serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
                shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
              }
            }
            var payloadDate = {
              'dueDate': tempData.dueDate,
              'receiveDate': vm.receiveDateEdit
            }
            let dataPostAction = {
              dossierId: vm.dossierId,
              actionCode: 1100,
              actionNote: '',
              actionUser: actionUser,
              payload: JSON.stringify(payloadDate),
              security: '',
              assignUsers: '',
              payment: JSON.stringify(paymentsOut),
              createDossiers: '',
              dueDate: tempData.dueDate
            }
            vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
              // toastr.success('Yêu cầu của bạn được thực hiện thành công.')
              let currentQuery = vm.$router.history.current.query
              // router.push({
              //   path: vm.$router.history.current.path,
              //   query: {
              //     recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
              //     renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
              //     q: currentQuery['q']
              //   }
              // })
              vm.goBack()
              vm.tiepNhanState = false
            })
          }).catch(rejectXhr => {
            console.log('rejectXhr==========', rejectXhr)
            toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          })
        }, 500)
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
