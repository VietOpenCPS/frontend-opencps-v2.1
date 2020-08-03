<template>
  <div class="py-0 kios-item">
    <div>
      <v-card flat class="pb-2">
        <h4 v-if="agencies.length === 1" class="py-1 text-xs-center" style="color:green; text-transform:uppercase">
          {{agencies[0]['administrationName']}}
        </h4>
        <h4 class="py-4 ml-2 text-xs-center">
          <span style="color:#065694;font-size: 1.2em !important;">ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG </span>
        </h4>
        <v-layout wrap class="px-0 py-0">
          <div style="width: calc(100% - 150px)">
            <v-layout wrap>
              <v-flex xs12 md6 class="px-2">
                <div class="input-custom">
                  <input id="dossierNoKey" type="text" @focus="show" @keyup.enter="filterDossier" required="required" />
                  <span class="bar"></span>
                  <label for="dossierNoKey">Mã hồ sơ</label>
                </div>
              </v-flex>
              <v-flex xs12 md6 class="px-2">
                <div class="input-custom">
                  <input id="secretKey" type="text" @focus="show" @keyup.enter="filterDossier" required="required" />
                  <span class="bar"></span>
                  <label for="applicantIdNoKey">Mã bí mật</label>
                </div>
              </v-flex>
            </v-layout>
          </div>
          <div class="text-right" style="width: 150px;">
            <v-btn color="primary"
              :loading="loadingTable"
              :disabled="loadingTable"
              @click="filterDossier"
              class="kios-btn my-0"
              style="height: 50px !important"
            >
              <v-icon size="18">search</v-icon>
              &nbsp;
              Đánh giá
              <span slot="loader">Loading...</span>
            </v-btn>
          </div>
        </v-layout>
        <chi-tiet-danh-gia v-if="detailActive" :administration="govAgencySelected" :className='className'></chi-tiet-danh-gia>
        <v-alert class="mt-5 mx-2" v-if="validateTracuu === false && !activeDetailDossier" :value="true" outline color="orange" icon="priority_high">
          Nhập thông tin đánh giá
        </v-alert>
        <!--  -->
        <div class="virtual-keyboard" v-if="visible">
          <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" :options="options" />
        </div>
      </v-card>
      <v-dialog v-model="dialogError" persistent max-width="290">
        <v-card flat>
          <v-card-title class="headline">Bạn không có quyền truy cập hồ sơ 
            <span>{{dossierDetail.dossierNo}}</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="dialogError = false">Đồng ý</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import ChiTietHoSo from './ChiTietHoSo.vue'
import TinyPagination from './pagination.vue'
import VueTouchKeyBoard from './keyboard.vue'
import ChiTietDanhGia from './ChiTietDanhGiaCLDV.vue'
import toastr from 'toastr'

export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'vue-touch-keyboard': VueTouchKeyBoard,
    'chi-tiet-ho-so': ChiTietHoSo,
    'chi-tiet-danh-gia': ChiTietDanhGia
  },
  data: () => ({
    className: 'dossier',
    loading: false,
    loadingAction: false,
    loadingTable: false,
    dossierNoKey: '',
    applicantNameKey: '',
    applicantIdNoKey: '',
    dossierList: [],
    agencies: [],
    dossierItemTotal: 0,
    hosoDatasPage: 1,
    totalPages: 0,
    headersTable: [
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Người nộp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày nộp',
        align: 'center',
        sortable: false
      }
    ],
    validateTracuu: false,
    dialogCheckPass: false,
    dialogError: false,
    dossierDetail: '',
    valid: false,
    passCheck: '',
    validPass: true,
    activeDetailDossier: false,
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: true,
      preventClickEvent: false
    },
    govAgencySelected: '',
    detailActive: false,
  }),
  computed: {
    filterDossierKey () {
      return this.$store.getters.getFilterDossierKey
    },
    groupIds () {
      return this.$store.getters.getGroupid
    },
    groupIdArr () {
      return this.getGroupIdArr(this.groupIds)
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      vm.$store.dispatch('agencies').then(function (result) {
        vm.agencies = result
      })
      vm.$store.commit('setFullScreen', false)
      let current = vm.$router.history.current
      let newQuery = current.query
      $('#dossierNoKey').val(newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : '')
      $('#secretKey').val(newQuery.hasOwnProperty('secret') ? newQuery.secret : '')
      // $('#applicantNameKey').val(newQuery.hasOwnProperty('applicantName') ? newQuery.applicantName : '')
      vm.hosoDatasPage = 1
      if ($('#dossierNoKey').val() && $('#secretKey').val()) {
        vm.validateTracuu = true
        vm.doLoadingDataHoSo()
      } else {
        vm.validateTracuu = false
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      $('#dossierNoKey').val(currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '')
      $('#secretKey').val(currentQuery.hasOwnProperty('secret') ? currentQuery.secret : '')
      // $('#applicantNameKey').val(currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '')
      vm.hosoDatasPage = 1
      vm.govAgencySelected = ''
      vm.detailActive = false
      if ($('#dossierNoKey').val() && $('#secretKey').val()) {
        vm.validateTracuu = true
        vm.doLoadingDataHoSo()
      } else {
        vm.validateTracuu = false
      }
    }
  },
  methods: {
    filterDossier () {
      var vm = this
      vm.visible = false
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['dossierNo'] = $('#dossierNoKey').val()
      vm.$store.commit('setDossierNoSearch', $('#dossierNoKey').val())
      newQuery['secret'] = $('#secretKey').val()
      vm.$store.commit('setApplicantIdNoSearch', $('#applicantIdNoKey').val())
      newQuery['applicantName'] = $('#applicantNameKey').val()
      newQuery['detail'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if ($('#dossierNoKey').val()) {
        vm.validateTracuu = true
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      } else {
        vm.validateTracuu = false
      }
    },
    // setFilterKey () {
    //   var vm = this
    //   setTimeout(function () {
    //     let payload = {
    //       dossierNo: $('#dossierNoKey').val(),
    //       applicantIdNo: $('#applicantIdNoKey').val(),
    //       secretCode: vm.filterDossierKey.secretCode ? vm.filterDossierKey.secretCode : ''
    //     }
    //     vm.$store.commit('setFilterDossierKey', payload)
    //     console.log('payloadFilter', vm.$store.getters.getFilterDossierKey)
    //   }, 200)
    // },
    confirmPass () {
      var vm = this
      let payload = {
        dossierNo: $('#dossierNoKey').val(),
        applicantIdNo: $('#applicantIdNoKey').val(),
        secretCode: vm.filterDossierKey.secretCode ? vm.filterDossierKey.secretCode : ''
      }
      vm.$store.commit('setFilterDossierKey', payload)
      if ($('#dossierNoKey').val() || $('#applicantIdNoKey').val()) {
        vm.validateTracuu = true
        vm.$router.push({
          path: '/ma-truy-cap',
          query: {
            target: 'tracuuhoso'
          }
        })
      } else {
        vm.validateTracuu = false
      }
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      // vm.loadingTable = true
      let currentQuery = router.history.current.query
      var filter = null
      filter = {
        dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
      }
      vm.$store.dispatch('loadingDanhSachHoSo', filter).then(function (result) {
        if(result.data && result.data.length){
          let dossier = result.data[0]
          let filter2 = {
            password: currentQuery.hasOwnProperty('secret') ? currentQuery.secret : '',
            dossierId: dossier.dossierId
          }
          vm.$store.dispatch('getDossierDetailPass', filter2).then(function (res) {
            if(res && res.data && res.data.dossierId){
              vm.govAgencySelected = res.data.dossierId
              vm.detailActive = true
            } else {
              toastr.error('Mã bí mật không chính xác')
            }
            // vm.$store.dispatch('loadVoting', filter3).then(function (res2) {
  
            // }).catch(function (reject) {
            // })
          }).catch(function (reject) {
            toastr.error('Mã bí mật không chính xác')
          })
        } else {
          toastr.error('Mã hồ sơ không hợp lệ. Không tìm thấy hồ sơ')
        }
      }).catch(reject => {
        toastr.error('Mã hồ sơ không hợp lệ. Không tìm thấy hồ sơ')
      })
    },
    viewDetail (item) {
      var vm = this
      vm.dossierDetail = item
      vm.$store.commit('setDossierDetail', item)
      vm.$router.push({
        path: '/ma-truy-cap',
        query: {
          target: 'chitiethoso'
        }
      })
    },
    submitViewDetail () {
      var vm = this
      if ($('#passCheck').val() !== '') {
        vm.validPass = true
        vm.loading = true
        let filter = {
          // password: vm.passCheck ? vm.passCheck : '',
          password: $('#passCheck').val(),
          dossierId: vm.dossierDetail.dossierId
        }
        vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
          vm.loading = false
          vm.dialogCheckPass = false
          vm.clearDialog()
          if (result.status && result.status.toString() === '203') {
            vm.dialogError = true
          } else if (result.status && result.status.toString() === '200') {
            router.push('/ho-so/' + vm.dossierDetail.dossierId)
          }
        }).catch(function (reject) {
          vm.dialogCheckPass = false
          vm.visible = false
          vm.loading = false
          console.log('reject', reject)
        })
      } else {
        vm.validPass = false
      }
    },
    getGroupIdArr (groupIds) {
      if (groupIds) {
        return groupIds.split(',')
      } else {
        return []
      }
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
    clearDialog () {
      $('#passCheck').val('')
      this.validPass = true
      this.visible = false
    },
    //
    clear (id) {
      $(`#${id}`).val('')
    },
    accept (text) {
      this.hide()
    },
    show (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick('search')
    },
    showKeyboard (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick('view')
    },
    hide () {
      this.visible = false
    },
    next () {
      let inputs = document.querySelectorAll('input')
      let found = false
      let arr1 = []
      arr1.forEach.call(inputs, (item, i) => {
        if (!found && item === this.input && i < inputs.length - 1) {
          found = true
          this.$nextTick(() => {
            inputs[i + 1].focus()
          })
        }
      })
      if (!found) {
        this.input.blur()
        this.hide()
      }
    },
    bindClick (type) {
      var vm = this
      setTimeout(function () {
        $('.keyboard .line:nth-child(2) .key:last-child').unbind('click')
        if (type === 'search') {
          $('.keyboard .line:nth-child(2) .key:last-child').bind('click', function () {
            vm.filterDossier()
          })
        } else if (type === 'view') {
          $('.keyboard .line:nth-child(2) .key:last-child').bind('click', function () {
            vm.submitViewDetail()
          })
        }
      }, 300)
    }
  }
}
</script>
