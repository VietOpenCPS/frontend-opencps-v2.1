<template>
  <div style="background: #eeeeee;">
    <v-layout wrap>
      <v-flex xs12 class="text-xs-center my-4">
        <p class="display-1 font-weight-bold">Tra cứu hồ sơ</p>
        <p class="headline">Vui lòng nhập mã hồ sơ hoặc CMND/Hộ chiếu/MST để tra cứu hồ sơ</p>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">Mã hồ sơ:</div>
          <v-text-field
            class="search-input-appbar input-search d-inline-block"
            style="width: calc(100% - 160px);"
            v-model="dossierNoKey"
            single-lines
            hide-details
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">CMND/Hộ chiếu/MST:</div>
          <v-text-field
            class="search-input-appbar input-search d-inline-block"
            style="width: calc(100% - 160px);"
            single-lines
            v-model="applicantIdNo"
            hide-details
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-text-field>
        </div>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">Lĩnh vực:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 160px);"
            v-model="domain"
            :items="domainListCurrent"
            item-text="domainName"
            item-value="domainCode"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-autocomplete>
        </div>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">Thủ tục:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 160px);"
            item-text="domainName"
            item-value="domainCode"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-autocomplete>
        </div>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">Trạng thái:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 160px);"
            item-text="text"
            item-value="value"
            v-model="status"
            :items="statusList"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-autocomplete>
        </div>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">Phương thức nộp:</div>
          <v-autocomplete
            class="select-search d-inline-block"
            style="width: calc(100% - 160px);"
            :items="onlines"
            v-model="online"
            item-text="text"
            item-value="value"
            hide-details
            hide-no-data
            solo
            flat
            height="32"
            min-height="32"
            clearable
          ></v-autocomplete>
        </div>
      </v-flex>
      <v-flex class="mb-2 px-2 xs12 md6"> 
        <div>
          <div class="d-inline-block text-bold" style="font-weight:450;width: 160px;">Mã xác nhận:</div>
          <div style="width: calc(100% - 160px);display: inline-block;">
            <div style="display:flex; align-items: center;justify-content: center;">
              <div style="width: calc(100% - 130px);">
                <v-text-field
                  v-model="captchaValue"
                  class="search-input-appbar input-search d-inline-block"
                  single-lines
                  hide-details
                  style="width: 100%;"
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                ></v-text-field>
              </div>
              <div style="width: 130px">
                <div id="captcha" class="d-inline-block text-xs-center" style="background: #fff;border-radius: 5px;"></div>
                <v-btn class="right  mx-0 my-0" title="refresh" flat icon v-on:click.native="createCaptcha" style="display: inline-block;">
                  <v-icon color="primary" size="32">refresh</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 class="text-xs-center">
        <v-btn color="primary" @click="changeStatus">
          Tìm kiếm
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout wrap>
      <v-flex xs12>
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
              <td class="text-xs-left py-2" style="min-width: 150px;">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.dossierName}}</span>
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
              <td class="text-xs-left py-2" :style="isMobile ? 'min-width: 100px' : 'min-width: 135px'">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>
                    <span>{{props.item.dueDate}}</span>
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
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import TinyPagination from './Pagination.vue'
import ChiTietHoSo from './DetailDossier'
Vue.use(toastr)

toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'chi-tiet-ho-so': ChiTietHoSo
  },
  data: () => ({
    methodSelected: '',
    domain: '',
    domainListCurrent: [],
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
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Phương thức nộp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày tiếp nhận',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày hẹn trả',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng',
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
    onlines: [
      {text: 'Trực tuyến', value: 'true'},
      {text: 'Trực tiếp', value: 'false'}
    ],
    status: null,
    captchaCode: '',
    online: '',
    captchaValue: '',
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

  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.createCaptcha()
      vm.getDomain()
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
    getDomain(){
      let vm = this
      let filterDomain = {
        agencyCode: ''
      }
      vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
        vm.domainListCurrent = result
      })
    },
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
      vm.online = newQuery.hasOwnProperty('online') && newQuery.online !== 'null' ? newQuery.online : ''
      vm.domain = newQuery.hasOwnProperty('domain') && newQuery.domain !== 'null' ? newQuery.domain : ''
      vm.dossierPage = newQuery.hasOwnProperty('page') ? Number(newQuery.page) : 1
      let filter = {
        page: vm.dossierPage,
        dossierNo: vm.dossierNoKey,
        applicantIdNo: vm.applicantIdNo,
        status: vm.status,
        online: vm.online,
        domain: vm.domain
      }
      if (vm.dossierNoKey || vm.applicantIdNo) {
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
    changeDataSearch () {
      let vm = this
      if (vm.dossierNoKey || vm.applicantIdNo) {
        if(vm.validateCaptcha()){
          setTimeout(function () {
            vm.dossierPage = 1
            let current = vm.$router.history.current
            let newQuery = current.query
            let queryString = '?'
            newQuery['page'] = vm.dossierPage
            newQuery['domain'] = vm.domain
            newQuery['dossierNo'] = vm.dossierNoKey
            newQuery['applicantIdNo'] = vm.applicantIdNo
            newQuery['status'] = vm.status
            newQuery['online'] = vm.online
            
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
        }
      } else {
        toastr.error('Vui lòng nhập mã hồ sơ hoặc số CMND/ hộ chiếu để tra cứu')
      }
    },
    changeStatus () {
      let vm = this
      if (vm.dossierNoKey || vm.applicantIdNo) {
        vm.changeDataSearch()
      } else {
        toastr.error('Vui lòng nhập mã hồ sơ hoặc số CMND/ hộ chiếu để tra cứu')
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
    },
    createCaptcha () {
      let vm = this
      document.getElementById('captcha').innerHTML = "";
      let charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#&*"
      let lengthOtp = 6
      let captcha = []
      for (var i = 0; i < lengthOtp; i++) {
        var index = Math.floor(Math.random() * charsArray.length + 1)
        if (captcha.indexOf(charsArray[index]) == -1)
          captcha.push(charsArray[index])
        else i--
      }
      let canv = document.createElement("canvas")
      canv.id = "captcha"
      canv.width = 90
      canv.height = 30
      let ctx = canv.getContext("2d")
      ctx.font = "18px Georgia"
      ctx.strokeText(captcha.join(""), 0, 30)
      vm.captchaCode = captcha.join("")
      document.getElementById("captcha").appendChild(canv)
    },
    validateCaptcha () {
      let vm = this
      if (vm.captchaValue == vm.captchaCode) {
        return true
      } else {
        toastr.error('Mã captcha không đúng. Vui lòng thử lại.')
        vm.createCaptcha()
        return false
      }
    }
  }
}
</script>
