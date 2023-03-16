<template>
  <div>
    <v-layout row wrap :class="isMobile ? 'pt-0' : 'pt-2'">
      <v-flex xs12 md3>
        <div v-if="forEPayment" id="titlePortlet" style="font-size: 20px;font-weight: 500;color:#0054a6" :class="isMobile ? 'px-2 text-xs-center' : 'px-2'">
          THANH TOÁN TRỰC TUYẾN
        </div>
        <div v-else id="titlePortlet" style="font-size: 20px;font-weight: 500;color:#0054a6" :class="isMobile ? 'px-2 text-xs-center' : 'px-2'">
          {{!qrscan ? 'TRA CỨU HỒ SƠ' : 'THÔNG TIN HỒ SƠ'}}
        </div>
        <v-card v-if="!qrscan" flat color="#ffffff" class="px-2 py-2">
          <!-- <selfie-image-box @filterByApplicantIdNo="filterByApplicantIdNo"></selfie-image-box> -->
          <v-flex xs12 class="mb-1">
            <v-text-field
              label="Mã số hồ sơ"
              v-model="dossierNoKey"
              box
              @keyup.enter="changeDataSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="mb-1">
            <v-text-field
              label="Số CMND/ hộ chiếu"
              v-model="applicantIdNo"
              box
              @keyup.enter="changeDataSearch"
            ></v-text-field>
          </v-flex>
          <!-- <v-flex xs12 class="my-3">
            <v-autocomplete
              :items="statusList"
              v-model="status"
              label="Trạng thái hồ sơ"
              item-text="text"
              item-value="value"
              :hide-selected="true"
              @change="changeStatus"
              clearable
            ></v-autocomplete>
          </v-flex> -->
          <v-flex xs12 class="mb-1">
            <div v-if="forEPayment"><span style="color: red">(*) </span> Nhập mã hồ sơ hoặc số CMND/ hộ chiếu để thực hiện thanh toán trực tuyến.</div>
            <div v-else><span style="color: red">(*) </span> Nhập mã hồ sơ hoặc số CMND/ hộ chiếu để thực hiện tra cứu hồ sơ.</div>
          </v-flex>
          <v-flex xs12 :class="isMobile ? 'mb-2 right' : 'mb-2'">
            <v-btn v-if="traCuuQlvt" class="mr-2 ml-0" color="primary" @click="traCuuHoSoVanTai"
            :loading="loading"
            :disabled="loading">
              <v-icon>search</v-icon> &nbsp;
              Hồ sơ Quản lý vận tải
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn class="mr-2 ml-0" color="primary" @click="changeDataSearch"
            :loading="loading"
            :disabled="loading">
              <v-icon>search</v-icon> &nbsp;
              {{traCuuQlvt ? 'Hồ sơ DVC' : 'Tìm kiếm'}}
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn v-if="!traCuuQlvt" class="" outline color="#0072bc" @click.native="goBack">
              <v-icon>reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
            <!-- <v-btn class="" outline color="#0072bc" @click="thanhToanTrucTuyen()">
             
              Thanh toán trực tuyến
            </v-btn> -->
          </v-flex>
        </v-card>
      </v-flex>

      <v-flex v-if="!hoSoQlvt" xs12 md9 :class="isMobile ? 'pt-1 mb-2' : 'pl-3 pt-1 mb-2'">
        <v-card flat class="" v-if="!detail">
          <div class="" v-if="totalDossier > 0">
            <div class="px-2">Có <span class="text-bold" style="color:#0167d3">{{totalDossier}}</span> hồ sơ được tìm thấy</div>
            <v-data-table
              :headers="headers"
              :items="dossierList"
              hide-actions
              class="table-landing table-bordered mt-3 mx-2"
              style="border-left: 1px solid #dedede;"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;" @click="viewDetail(props.item)">
                  <td class="text-xs-center py-2">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{dossierPage * 10 - 10 + props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" :style="isMobile ? 'min-width: 110px' : 'min-width: 135px'">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <p>{{props.item.dossierNo}}</p>
                      <p v-if="props.item.online" style="color: blue;">Hồ sơ nộp trực tuyến</p>
                      <p v-if="!props.item.online" style="color: green;">Hồ sơ nộp trực tiếp</p>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" style="min-width: 150px;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.item.dossierName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" style="min-width: 135px">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.applicantName}}</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" :style="isMobile ? 'min-width: 100px' : 'min-width: 135px'">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.receiveDate}}</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-xs-left py-2" style="min-width: 135px">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.dossierStatusText}}</span>
                      </span>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
            <div v-if="totalDossier > 10" class="text-xs-right layout wrap mt-3 px-2" style="position: relative;">
              <div class="flex pagging-table">
                <tiny-pagination :total="totalDossier" :page="dossierPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div>
          </div>
          <div v-else class="no-data" style="min-heiht: 350px; text-align: center; opacity: 0.7">
            <img style="max-width: 500px;max-height:350px" src="/o/opencps-store/js/cli/tracuu_hoso/app/img/browser.svg" alt="" srcset=""><br>
            <span>Không có hồ sơ nào được tìm thấy</span> <br>
            <span>Vui lòng nhập thông tin tra cứu hồ sơ</span>
          </div>
        </v-card>
        <v-card flat class="" v-else>
          <chi-tiet-ho-so :detail="dossierDetail"></chi-tiet-ho-so>
          <v-layout wrap align-center justify-end class="mt-3">
            <v-btn color="primary" class="mx-2" @click.native="detail = false">
              <v-icon>reply</v-icon>
              <span class="px-2">Quay lại</span>
            </v-btn>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if="hoSoQlvt" xs12 md9 :class="isMobile ? 'pt-1 mb-2' : 'pl-3 pt-1 mb-2'">
        <div v-if="detailQlvt">
          <v-layout class="wrap">
            <v-flex :class="isMobile ? 'pb-2 pl-2' : 'pb-2'">
              <h3 style="color:#0054a6"><span class="text-bold">Tên hồ sơ: </span>{{detailQlvt.TenTTHC}}</h3>
            </v-flex>
          </v-layout>
          <v-card>
            <v-card-text class="px-0 py-0">
              <v-layout wrap class="px-2 py-2">
                <v-flex xs12 sm4 class="pr-3">
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Mã hồ sơ: </span>
                    <span class="pl-0 text-bold ">  {{detailQlvt.MaHoSo}} </span>
                  </div>
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Chủ hồ sơ: </span>
                    <span class="pl-0 text-bold"> {{detailQlvt.ChuHoSo}} </span>
                  </div>
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Mã chủ hồ sơ : </span>
                    <span class="pl-0 text-bold ">  {{detailQlvt.MaDoiTuong}} </span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Đơn vị tiếp nhận: </span>
                    <span class="pl-0 text-bold ">  {{detailQlvt.DonViXuLy}} </span>
                  </div>
                  <!--  -->
                  
                </v-flex>
                <!--  -->
                <v-flex xs12 sm4>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Trạng thái: </span>
                    <span class="pl-0 text-bold "> {{detailQlvt.TenTrangThaiHoSo}} </span>
                  </div>
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Ngày gửi: </span>
                    <span class="pl-0 text-bold"> {{detailQlvt.NgayGuiHoSo}} </span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Ngày tiếp nhận: </span>
                    <span class="pl-0 text-bold "> {{detailQlvt.NgayTiepNhan}}</span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1" v-if="detailQlvt.NgayHenTra">
                    <span class="pr-2">Ngày hẹn trả: </span>
                    <span class="pl-0 text-bold "> {{detailQlvt.NgayHenTra}}</span>
                  </div>
                  <div class="xs12 sm12 pb-1" v-if="detailQlvt.NgayKetThucXuLy">
                    <span class="pr-2">Ngày hoàn thành: </span>
                    <span class="pl-0 text-bold "> {{detailQlvt.NgayKetThucXuLy}}</span>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </div>
        <div v-else class="no-data" style="min-heiht: 350px; text-align: center; opacity: 0.7">
          <img style="max-width: 500px;max-height:350px" src="/o/opencps-store/js/cli/tracuu_hoso/app/img/browser.svg" alt="" srcset=""><br>
          <span>Không có hồ sơ nào được tìm thấy</span> <br>
          <span>Vui lòng nhập thông tin tra cứu hồ sơ</span>
        </div>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogCheckPass" max-width="450">
      <v-card class="px-0">
        <v-card-title color="primary" class="headline">XÁC THỰC TRA CỨU THÔNG TIN HỒ SƠ</v-card-title>
        <v-divider class="my-0"></v-divider>
        <v-card-text class="pt-4">
          <v-form ref="form" v-model="valid" lazy-validation class="">
            <v-flex xs12 class="">
              <v-text-field
                box
                label="Mã tra cứu"
                v-model="secretKey"
                height="42"
                :rules="[v => !!v || 'Mã tra cứu là bắt buộc']"
                required
                @keyup.enter="submitPass"
                autofocus
              ></v-text-field>
            </v-flex>
            <div class="flex primary--text mb-3">Mã tra cứu là dãy số gồm 4 ký tự được in trên giấy tiếp nhận hồ sơ và hẹn trả kết quả, mail thông báo tiếp nhận hồ sơ.</div>
            <v-flex xs12 class="text-xs-left text-xs-center mt-2">
              <v-btn class="ml-0 mr-1 my-0 white--text primary" color="#0b72ba"
                :loading="loading"
                :disabled="loading"
                @click="submitPass"
              >
                <v-icon style="color: #fff !important">search</v-icon>&nbsp;
                Tra cứu
              </v-btn>
              <v-btn class="ml-1 my-0 white--text red" color="#0b72ba"
                :loading="loading"
                :disabled="loading"
                @click="dialogCheckPass = false"
              >
                <v-icon style="color: #fff !important">reply</v-icon>&nbsp;
                Quay lại
              </v-btn>
            </v-flex>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import TinyPagination from './Pagination.vue'
import ChiTietHoSo from './DetailDossier'
import SelfieImageBox from './SelfieImageBox'
Vue.use(toastr)

toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'chi-tiet-ho-so': ChiTietHoSo,
    SelfieImageBox
  },
  data: () => ({
    dossierList: [],
    dossierSelected: '',
    detail: false,
    dossierDetail: '',
    dossierNoKey: '',
    applicantIdNo: '',
    totalDossier: 0,
    dossierPage: 1,
    loading: false,
    valid: false,
    secretKey: '',
    dialogCheckPass: false,
    forEPayment: false,
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
        text: 'Tên hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày nộp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false
      }
    ],
    isMobile: false,
    qrscan: false,
    statusList: [
      {text: 'Chờ xử lý', value: 'receiving'},
      {text: 'Đang xử lý', value: 'processing'},
      {text: 'Yêu cầu bổ sung giấy tờ', value: 'waiting'},
      {text: 'Từ chối xử lý', value: 'denied'},
      {text: 'Đã xử lý xong', value: 'releasing'},
      {text: 'Đã trả kết quả', value: 'done'}
    ],
    status: null,
    traCuuQlvt: false,
    hoSoQlvt: false,
    detailQlvt: '',
    userInfo: ''
  }),
  computed: {
    originality () {
      var vm = this
      return vm.getOriginality()
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    let vm = this
    vm.onResize()
    window.addEventListener('resize', vm.onResize, { passive: true })
    if (vm.isMobile) {
      $('section#content').css('padding-left', '0px')
    }
    let cameraBox = document.getElementsByClassName('camera-selfie-box')[0];
    cameraBox.style.height = ""+ cameraBox.offsetWidth*3/4 + "px"
    
    let canvas = document.getElementById('canvasDup');
    canvas.style.height = "" + canvas.offsetWidth * 3 / 4 + "px";
  },
  created () {
    let vm = this
    try {
      vm.traCuuQlvt = traCuuQlvt
    } catch (error) {  
    }
    try {
      vm.forEPayment = forEPayment
    } catch (error) {  
    }
    try {
      vm.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    } catch (error) {
    }
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      if (newQuery.hasOwnProperty('id') && newQuery.id && newQuery.hasOwnProperty('secretKey') && newQuery.secretKey) {
        vm.qrscan = true
        vm.submitPassQrscan(newQuery.id, newQuery.secretKey)
      } else {
        vm.qrscan = false
        vm.doSearchDossier()
      }
      try {
        if (statusListConfig) {
          vm.statusList = statusListConfig
        }
      } catch (error) {
      }

      let cameraBox = document.getElementsByClassName('camera-selfie-box')[0];
      cameraBox.style.height = ""+ cameraBox.offsetWidth*3/4 + "px"
      
      let canvas = document.getElementById('canvasDup');
      canvas.style.height = "" + canvas.offsetWidth * 3 / 4 + "px";
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (currentQuery.hasOwnProperty('id') && currentQuery.id && currentQuery.hasOwnProperty('secretKey') && currentQuery.secretKey) {
        vm.qrscan = true
        vm.submitPassQrscan(currentQuery.id, currentQuery.secretKey)
      } else {
        vm.qrscan = false
        vm.doSearchDossier()
      }
    }
  },
  methods: {
    doSearchDossier () {
      let vm = this
      vm.detail = false
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.loading = true
      vm.dossierList = []
      vm.dossierNoKey = newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : ''
      vm.applicantIdNo = newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : ''
      vm.status = newQuery.hasOwnProperty('status') && newQuery.status !== 'null' ? newQuery.status : ''
      vm.dossierPage = newQuery.hasOwnProperty('page') ? Number(newQuery.page) : 1
      let filter = {
        page: vm.dossierPage,
        dossierNo: vm.dossierNoKey,
        applicantIdNo: vm.applicantIdNo,
        status: vm.status,
        order: true
      }
      if (vm.dossierNoKey || vm.applicantIdNo) {
        if (window.themeDisplay.isSignedIn() && !vm.applicantIdNo) {
          filter.applicantIdNo = vm.userInfo.applicantIdNo
        }
        vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
          vm.loading = false
          vm.totalDossier = result.total
          vm.dossierList = result.data ? result.data : []
        }).catch(function (reject) {
          vm.loading = false
        })
      } else {
        vm.loading = false
      }
    },
    filterByApplicantIdNo(applicantIdNo) {
      let vm = this
      vm.applicantIdNo = applicantIdNo
      vm.changeDataSearch()
    },
    changeDataSearch () {
      let vm = this
      vm.hoSoQlvt = false
      if (vm.dossierNoKey || vm.applicantIdNo) {
        setTimeout(function () {
          vm.dossierPage = 1
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          newQuery['page'] = vm.dossierPage
          newQuery['dossierNo'] = vm.dossierNoKey
          newQuery['applicantIdNo'] = vm.applicantIdNo
          newQuery['status'] = vm.status
          newQuery['order'] = true
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          vm.$router.push({
            path: current.path + queryString,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }, 100)
      } else {
        toastr.error('Vui lòng nhập mã hồ sơ hoặc số CMND/ hộ chiếu để tra cứu')
      }
    },
    traCuuHoSoVanTai () {
      let vm = this
      vm.hoSoQlvt = true
      vm.detail = true
      if (vm.dossierNoKey) {
        vm.loading = true
        let filter = {
          dossierNo: vm.dossierNoKey
        }
        vm.$store.dispatch('traCuuHsQlvt', filter).then(function (result) {
          vm.loading = false
          if (result) {
            vm.detailQlvt = result
          } else {
            vm.detailQlvt = ''
          }
        }).catch(function (reject) {
          vm.loading = false
          // toastr.error('Lỗi hệ thống')
        })
      } else {
        toastr.error('Vui lòng nhập mã hồ sơ để tra cứu')
      }
    },
    changeStatus () {
      let vm = this
      if (vm.dossierNoKey || vm.applicantIdNo) {
        vm.changeDataSearch()
      }
    },
    viewDetail (item) {
      let vm = this
      vm.dossierSelected = item
      vm.dialogCheckPass = true
    },
    submitPass () {
      let vm = this
      let current = vm.$router.history.current
      if (vm.$refs.form.validate()) {
        vm.$store.commit('setScretCode', vm.secretKey)
        let filter = {
          password: vm.secretKey,
          dossierId: vm.dossierSelected.dossierId
        }
        vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
          vm.loading = false
          if (result.status && result.status.toString() === '203') {
            toastr.error('Mã tra cứu không chính xác. Vui lòng thử lại.')
          } else if (result.status && result.status.toString() === '200') {
            vm.dialogCheckPass = false
            vm.dossierDetail = result.data
            vm.detail = true
            vm.setScr(vm.dossierDetail.referenceUid, vm.secretKey)
          }
        }).catch(function (reject) {
          vm.loading = false
          toastr.error('Lỗi hệ thống')
        })
      }
    },
    submitPassQrscan (id, secretKey) {
      let vm = this
      let current = vm.$router.history.current
      let filter = {
        password: secretKey,
        dossierId: id
      }
      vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
        vm.loading = false
        if (result.status && result.status.toString() === '203') {
          toastr.error('Mã tra cứu không chính xác. Vui lòng thử lại.')
        } else if (result.status && result.status.toString() === '200') {
          vm.dossierDetail = result.data
          vm.detail = true
          vm.setScr(vm.dossierDetail.referenceUid, secretKey)
        }
      }).catch(function (reject) {
        vm.loading = false
        toastr.error('Lỗi hệ thống')
      })
    },
    setScr (id, key) {
      if (typeof(Storage) !== 'undefined') {
        sessionStorage.setItem(id, key);
      }
    },
    onResize () {
      let vm = this
      vm.isMobile = window.innerWidth < 1024
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    goBack () {
      window.history.back()
    },
    thanhToanTrucTuyen () {
      let vm = this
      let paymentProfile = {
        "paymentMerchantCode": "UBNDHG",
        "paymentHashAlgorithm": "SHA-256",
        "paymentServiceCode": "720",
        "paymentVersion": "1.0",
        "paymentCommand": "pay",
        "paymentCurrencyCode": "704",
        "paymentCurrentLocale": "vn",
        "paymentCountryCode": "+84",
        "paymentInternalBank": "all_card",
        "paymentMerchantSecureKey": "ubnd@keypay@haugiang",
        "paymentResultUrl": "http://119.17.200.66:8074/o/rest/v2/dossiers/keypay",
        "paymentKeypayDomain": "http://online.keypay.vn/process",
            "bankAccountInfo": {
              "default": "3511.0.1004872.00000"
            },
        "paymentReturnUrl":"http://119.17.200.66:8074/web/cong-dich-vu-cong-tinh-hau-giang/dich-vu-cong/#/thanh-toan-thanh-cong?paymentPortal=KEYPAY&actionCode=6200"
      }
      let filter = {
        payment_domain: 'online.keypay.vn',
        params: {
          merchant_code: paymentProfile.paymentMerchantCode,
          name: 'Ten Khach Hang',
          phone: '0987654321',
          email: 'kh@email.com.vn',
          address: 'Đống Đa, Hà Nội',
          merchant_trans_id: '123',
          good_code: 'GC_232134034',
          net_cost: '100000',
          ship_fee: '3000',
          Tax: '3000',
          return_url: paymentProfile.paymentReturnUrl,
          Version: '1.0',
          Command: paymentProfile.paymentCommand,
          current_locale: paymentProfile.paymentCurrentLocale,
          currency_code: paymentProfile.paymentCurrencyCode,
          service_code: paymentProfile.paymentServiceCode,
          country_code: paymentProfile.paymentCountryCode,
          xml_description: 'Nap tien mobile',
          secure_hash: 'd13eac5a49adff8bdcd757ea8a527eab'
        }
      }
      vm.$store.dispatch('createBillCode', filter).then(function (result) {

      }).catch(function (reject) {

      })
    }
  }
}
</script>
