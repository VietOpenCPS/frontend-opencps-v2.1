<template>
  <div>
  <v-form v-model="validTNHS" ref="formImport" lazy-validation>
    <div class="row-header">
      <div class="background-triangle-big"> 
        <span>IMPORT HỒ SƠ</span>
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
    <!--  -->
    <div style="position: relative;">
      <thong-tin-chu-ho-so ref="thongtinchuhoso" :showApplicant="true"></thong-tin-chu-ho-so>
    </div>
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

    <div style="position: relative;">
      <v-expansion-panel :value="[true]" expand  class="expansion-pl">
        <v-expansion-panel-content hide-actions value="2">
          <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Dịch vụ chuyển phát kết quả</div>
          <dich-vu-chuyen-phat-ket-qua ref="dichvuchuyenphatketqua"></dich-vu-chuyen-phat-ket-qua>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <!--  -->
    
    <div style="position: relative;" class="py-2">
      <div style="width: 100%;" class="text-xs-center">
        <input type="file" id="dossierImport" @change="uploadfileDossierImport($event)" style="display:none">
        <span class="text-bold" style="color: #004b94!important">Tải lên file thông tin chủ hồ sơ (Định dạng: .xlsx, .xls)</span>
        <v-progress-circular
        :width="2"
        :size="25"
        color="green"
        indeterminate
        v-if="progressUploadFile"
        ></v-progress-circular>
        <v-tooltip top v-else class="ml-2">
          <v-btn slot="activator" icon class="mx-0 my-0" @click="pickFile()">
            <v-badge>
              <v-icon size="24" color="#004b94">cloud_upload</v-icon>
            </v-badge>
          </v-btn>
          <span>Tải file lên</span>
        </v-tooltip>
      </div>
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
  </v-form>
  <v-dialog v-model="dialogImportDosier" max-width="700" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Import hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogImportDosier = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <v-flex class="text-xs-center">
            <v-progress-circular
              :rotate="-90"
              :size="70"
              :width="10"
              :value="valueProgress"
              color="primary"
              class="my-2"
              >
              <span style="font-size: 1.5em;font-weight: bold;">{{ countDossierProgress }}</span> 
            </v-progress-circular>
            <div class="pb-0" style="margin: 0 auto;">
              <v-card class="py-0">
                <span style="color: green;">Thành công: {{countDossierSuccess}} hồ sơ</span>
                <p style="color: red;">Lỗi: {{dossierError.length}} hồ sơ</p>
              </v-card>
            </div>
          </v-flex>
          
          <div class="px-2" v-if="dossierError.length && !loadingImportDossier" style="margin: 0 auto;">
            <span style="font-size: 1.2em;font-weight: bold;">Danh sách hồ sơ bị lỗi:</span>
            <v-data-table
              :headers="headers"
              :items="dossierError"
              hide-actions
              class="table-landing table-bordered mt-2"
              item-key="dossierId"
              style="border-left: 1px solid #dedede"
            >
              <template slot="items" slot-scope="props">
                <tr style="cursor: pointer">
                  <td class="text-xs-center" width="">
                    <span>{{props.index + 1}}</span>
                  </td>
                  <td class="text-xs-left" width="">
                    {{ props.item.applicantName }}
                  </td>
                  <td class="text-xs-left">
                    {{ props.item.applicantIdNo }}
                  </td>
                  <td class="text-xs-left" width="">
                    {{ props.item.address}}
                  </td>
                </tr>
              </template>
            </v-data-table>
            <!-- <v-list two-line style="border: 1px solid #ccc; border-radius: 4px; max-height: 200px; overflow: auto;">
              <template v-for="(item, index) in dossierError">
                <v-list-tile
                  :key="item.dossierId"
                  avatar
                  ripple
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="px-2">{{ item.applicantName }}</v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary px-2">{{ item.applicantIdNo }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title class="px-2">{{ item.address }}</v-list-tile-sub-title>
                  </v-list-tile-content>

                </v-list-tile>
                <v-divider
                  v-if="index + 1 < dossierError.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list> -->
          </div>
          <!-- <div v-else-if="dossierError.length && loadingImportDossier" style="max-width: 400px; margin: 0 auto;">
            Danh sách hồ sơ bị lỗi:
            <v-list two-line style="border: 1px solid #ccc; border-radius: 4px; max-height: 200px; overflow: auto;">
              <template v-for="(item, index) in 3">
                <v-list-tile
                  :key="index + 'pg'"
                  avatar
                  ripple
                >
                  <v-list-tile-content>
                    <v-list-tile-title class="px-1"><content-placeholders-text :lines="2" /></v-list-tile-title>
                  </v-list-tile-content>

                </v-list-tile>
                <v-divider
                  v-if="index + 1 < 3"
                  :key="index"
                ></v-divider>
              </template>
            </v-list>
          </div> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="addDossierAgain()"
              :loading="loadingImportDossier"
              :disabled="loadingImportDossier"
              v-if="dossierError.length"
              >
              <v-icon>send</v-icon>&nbsp;
              Thực hiện lại
              <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="red" style="color: #fff;" @click.native="dialogImportDosier = false"
            :loading="loadingImportDossier"
            :disabled="loadingImportDossier"
            >
            <v-icon>reply</v-icon>&nbsp;
            Quay lại
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import toastr from 'toastr'
import $ from 'jquery'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSo.vue'
import ThongTinChuHoSo from './TiepNhan/TiepNhanHoSo_ThongTinChuHoSo.vue'
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
    'dich-vu-chuyen-phat-ket-qua': DichVuChuyenPhatKetQua
  },
  data: () => ({
    validTNHS: false,
    dossierId: '',
    mark: true,
    dossierFiles: '',
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
    countDossierProgress: 0,
    dialogImportDosier: false,
    listDossierImport: [],
    progressUploadFile: false,
    loadingImportDossier: false,
    dossierError: [],
    dossierSuccess: [],
    totalDossier: 0,
    valueProgress: 0,
    countDossierSuccess: 0,
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã CMND/CCCD',
        align: 'center',
        sortable: false
      },
      {
        text: 'Địa chỉ',
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
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.listDossierImport = []
      vm.thongTinChiTietHoSo = {}
      vm.dossierId = vm.id
      vm.initData(vm.id)
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
    uploadfileDossierImport: function (e) {
      var vm = this
      let thanhphanhoso = vm.$refs.thanhphanhoso.dossierTemplateItems
      thanhphanhoso = thanhphanhoso.filter(function (item) {
        return item['partType'] === 1
      })
      // console.log('thanhphanhoso', thanhphanhoso)
      vm.$store.dispatch('loadDossierFiles', vm.thongTinChiTietHoSo['dossierId']).then(function (result) {
        let files = []
        for (let index in result) {
          if (result[index]['dossierPartType'] === 1) {
            files.push(result[index]['dossierFileId'])
          }
        }
        vm.dossierFiles = files ? files.toString() : ''
        // if (thanhphanhoso.length > 0) {
        //   let tmp = thanhphanhoso.map(item => {
        //     return {
        //       partNo: item.partNo,
        //       formData: item['files'] ? item['files'].toString() : '',
        //       eform: item['hasForm'] === true ? true : false
        //     }
        //   })
        //   vm.dossierFiles = tmp
        // }
        vm.progressUploadFile = true
        let data = {}
        vm.countDossierProgress = 0
        vm.valueProgress = 0
        vm.listDossierImport = []
        vm.dossierError = []
        vm.dossierSuccess = []
        vm.countDossierSuccess = 0
        data['dossierId'] = vm.thongTinChiTietHoSo['dossierId']
        data['referenceUid'] = vm.thongTinChiTietHoSo['referenceUid']
        data['selector'] = 'dossierImport'
        data['partTip'] = {
          tip: '',
          maxSize: 10,
          extensions: 'xlsx,xls'
        }
        let file = $('#dossierImport')[0].files[0]
        vm.$store.dispatch('uploadDossierFileImport', data).then(function (result) {
          vm.progressUploadFile = false
          vm.totalDossier = result.total
          if (result.total) {
            let cf = confirm('Bạn có chắc chắn thực hiện hành động này?')
            if (cf) {
              vm.dialogImportDosier = true
              vm.listDossierImport = result.data
              console.log(result.data)
              setTimeout(function () {
                if (vm.listDossierImport.length) {
                  vm.loadingImportDossier = true
                  let action = []
                  vm.listDossierImport.forEach(function (item, index) {
                    setTimeout(function () {
                      action.push(vm.doCreateDossier(item, index))
                      if (action.length === vm.listDossierImport.length) {
                        Promise.all(action).then(function (result) {
                          vm.loadingImportDossier = false
                        }).catch(function (xhr) {
                          vm.loadingImportDossier = false
                        })
                      }
                    }, index * 1000);
                  })
                }
              }, 300);
            }
          } else {
            vm.listDossierImport = []
            toastr.error('Dữ liệu bị lỗi, vui lòng kiểm tra lại!')
          }
        }).catch(function (xhr) {
          vm.dialogImportDosier = false
          vm.progressUploadFile = false
          toastr.error('Tải file lỗi, vui lòng thử lại!')
        })
      }).catch(function (reject) {

      })
    },
    addDossierAgain () {
      let vm = this
      console.log(vm.dossierSuccess)
      vm.countDossierProgress = vm.dossierSuccess.length
      vm.valueProgress = vm.countDossierProgress * 100 / vm.totalDossier
      console.log('valueProgress++++', vm.valueProgress)
      vm.countDossierSuccess = vm.dossierSuccess.length
      if (vm.dossierError.length) {
        vm.loadingImportDossier = true
        let action = []
        vm.dossierError.forEach(function (item, index) {
          setTimeout(function () {
            action.push(vm.doCreateDossier(item, index))
            if (action.length === vm.dossierError.length) {
              Promise.all(action).then(function (result) {
                vm.loadingImportDossier = false
              }).catch(function (xhr) {
                vm.loadingImportDossier = false
              })
            }
          }, index * 1000);
        })
      }
    },
    doCreateDossier (item, index) {
      return new Promise((resolve, reject) => {
        var vm = this
        let thanhphanhoso = this.$refs.thanhphanhoso.dossierTemplateItems
        let dataTotal = {}
        let dataDossier = item
        let dataDossiermark = ''
        let dataDossierFile = ''
        let dataDossierPayment = ''
        let thongTinChungHS = vm.$refs.thongtinchuhoso
        let dichVuChuyenKetQua = vm.$refs.dichvuchuyenphatketqua
        dataTotal['serviceCode'] = vm.thongTinChiTietHoSo['serviceCode']
        dataTotal['govAgencyCode'] = vm.thongTinChiTietHoSo['govAgencyCode']
        dataTotal['dossierTemplateNo'] = vm.thongTinChiTietHoSo['dossierTemplateNo']
        dataTotal['originality'] = vm.originality
        if (thanhphanhoso && thanhphanhoso.length) {
          let tmp = thanhphanhoso.map(item => {
            return {
              partNo: item.partNo,
              partName: item.partName,
              fileMark: item.fileMark
            }
          })
          dataDossiermark = JSON.stringify(tmp)
        } else {
          dataDossiermark = ''
        }
        dataTotal['dossierMarks'] = dataDossiermark
        if (thongTinChungHS && thongTinChungHS['thongTinNguoiNopHoSo']) {
          let thongTinNguoiNop = thongTinChungHS['thongTinNguoiNopHoSo']
          dataDossier = Object.assign(dataDossier, thongTinNguoiNop)
        }
        dataDossier = Object.assign(dataDossier, vm.dichVuChuyenPhatKetQua)
        dataTotal['dossiers'] = dataDossier ? JSON.stringify(dataDossier) : ''
        dataTotal['dossierFiles'] = vm.dossierFiles ? vm.dossierFiles : ''
        dataTotal['payment'] = dataDossierPayment ? JSON.stringify(dataDossierPayment) : ''

        vm.$store.dispatch('importDossier', dataTotal).then(function (result) {
          // ---------
          vm.countDossierProgress ++
          vm.valueProgress += (100 / vm.totalDossier)
          vm.listDossierImport[index]['flagError'] = false
          if (vm.countDossierSuccess < vm.listDossierImport.length) {
            vm.countDossierSuccess ++
          }
          vm.calDossierErrorSuccess()
          resolve(true)
        }).catch(xhr => {
          console.log(xhr)
          vm.countDossierProgress ++
          vm.valueProgress += (100 / vm.totalDossier)
          vm.listDossierImport[index]['flagError'] = true
          vm.calDossierErrorSuccess()
          reject(xhr)
        })
      })
    },
    calDossierErrorSuccess () {
      let vm = this
      vm.dossierError = vm.listDossierImport.filter(function (item) {
        return item['flagError']
      })
      vm.dossierSuccess = vm.listDossierImport.filter(function (item) {
        return !item.hasOwnProperty('flagError') || !item['flagError']
      })
    },
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
        vm.thongTinChiTietHoSo = result
        vm.$refs.thanhphanhoso.initData(result)
        vm.$refs.thongtinchuhoso.initData(result)
        let dataDichVuChuyenPhatKetQua = {
          viaPostal: 2,
          postalServiceCode: 'VNPOST',
          postalAddress: '',
          postalCityCode: '',
          postalDistrictCode: '',
          postalWardCode: '',
          postalTelNo: ''
        }
        vm.$store.commit('setDichVuChuyenPhatKetQua', dataDichVuChuyenPhatKetQua)
      }).catch(reject => {
        console.log(reject)
      })
    },
    pickFile () {
      var vm = this
      let validThongtinchuhoso = vm.$refs.thongtinchuhoso.showValid()
      let dichvuchuyenphatketqua = this.$refs.dichvuchuyenphatketqua ? this.$refs.dichvuchuyenphatketqua.dichVuChuyenPhatKetQua : {}
      if (dichvuchuyenphatketqua.viaPostal === 2) {
        if (!vm.$refs.dichvuchuyenphatketqua.validDichVuChuyenPhat() || !validThongtinchuhoso['validForm']) {
          toastr.error('Vui lòng kiểm tra lại các thông tin bắt buộc trước khi thực hiện!')
          return
        }
      } else {
        if (!validThongtinchuhoso['validForm']) {
          toastr.error('Vui lòng kiểm tra lại các thông tin bắt buộc trước khi thực hiện!')
          return
        }
      }
      document.getElementById('dossierImport').value = ''
      document.getElementById('dossierImport').click()
    },
    goBack () {
      let vm = this
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      vm.$router.push({
        path: '/danh-sach-ho-so/0',
        query: currentQuery
      })
    }
  }
}
</script>
