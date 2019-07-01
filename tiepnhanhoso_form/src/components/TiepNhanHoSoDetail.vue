<template>
  <v-form v-model="validTNHS" ref="formTiepNhanHoSo" lazy-validation>
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
    <div>
      <tiep-nhan-ho-so ref="thongtintiepnhan"></tiep-nhan-ho-so>
    </div>
  </v-form>
</template>

<script>
import Vue from 'vue'
import toastr from 'toastr'
import $ from 'jquery'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index', 'id', 'formCode'],
  components: {
  },
  data: () => ({
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
    loadingAction: false,
    vuejx_form: {
      template: `
        <v-card>
          <v-card-text color="red">
            <v-text-field
              label="Nhập mã hồ sơ"
              v-model="nameRender"
              @keyup.enter="viewLog"
              append-icon="search"
              box
              @click:append="viewLog"
            ></v-text-field>
          </v-card-text>
        </v-card>
      `,
      data: `{
        nameRender: 'TRẦN DUẨN BD',
        codeRender: 123123
      }`,
      methods: {
        viewLog () {
          console.log('OK CON DÊ')
        }
      }
    }
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
    let vm = this
    vm.$nextTick(function () {
      vm.dossierId = vm.id
      console.log('template', vm.vuejx_form['template'])
      console.log('data', eval("(" + vm.vuejx_form['data'] + ")"))
      console.log('methods', vm.vuejx_form['methods'])
      Vue.component('tiep-nhan-ho-so', {
        template: vm.vuejx_form['template'],
        data: eval("(" + vm.vuejx_form['data'] + ")"),
        methods: vm.vuejx_form['methods']
      })
    })
  },
  beforeDestroy () {
    // let viewport = $('meta[name="viewport"]')
    // viewport.attr('content', 'initial-scale=1.0, width=device-width')
    // if (typeof window !== 'undefined') {
    //   window.removeEventListener('resize', this.onResize, { passive: true })
    // }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  watch: {
    isMobile (val) {
      // let viewport = $('meta[name="viewport"]')
      // if (val) {
      //   viewport.attr('content', '')
      // } else {
      //   viewport.attr('content', 'initial-scale=1.0, width=device-width')
      // }
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
