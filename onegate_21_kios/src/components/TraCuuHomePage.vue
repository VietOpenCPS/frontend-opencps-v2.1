<template>
  <div class="py-0" >
    <div>
      <v-card flat class="pb-2" style="border: none;min-height: 100vh;">
        <h2 class="pt-2 mx-2 text-xs-center">
          <span style="color:#065694">TRA CỨU THÔNG TIN HỒ SƠ </span>
        </h2>
        <v-layout wrap class="mx-2 mt-2 px-0 py-0">
          <v-flex xs12 >
            <v-card class="px-3 py-3" color="#002c46b3" flat style="max-width:700px;margin: 0 auto;border: 1px solid #dddddd">
              <v-form ref="form" v-model="valid" lazy-validation class="mt-2">
                <v-flex xs12 class="mt-3">
                  <v-text-field
                    solo
                    placeholder="Mã số hồ sơ"
                    v-model="dossierNoKey"
                    prepend-inner-icon="description"
                    @keyup.enter="filterDossier"
                    height="42"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="">
                  <v-text-field
                    solo
                    placeholder="Số CMTND/ Hộ chiếu"
                    v-model="applicantIdNoKey"
                    prepend-inner-icon="credit_card"
                    @keyup.enter="filterDossier"
                    height="42"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="text-xs-left text-xs-center mt-2">
                  <v-btn class="ml-0 mr-1 my-0 white--text" color="#0b72ba"
                    :loading="loadingTable"
                    :disabled="loadingTable"
                    @click="filterDossier"
                  >
                    <v-icon>search</v-icon>&nbsp;
                    Tra cứu
                  </v-btn>
                  <v-btn class="ml-1 my-0 white--text" color="#0b72ba"
                    :loading="loading"
                    :disabled="loading"
                    @click="goBack"
                  >
                    <v-icon>reply</v-icon>&nbsp;
                    Quay lại
                  </v-btn>
                </v-flex>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
        <div style="max-width:1300px;margin:0 auto">
          <v-flex class="mt-3 mx-3">
            <v-toolbar height="42" color="#0b72ba" dark flat>
              <v-toolbar-title v-if="!activeDetailDossier" style="font-size: 16px !important;">Kết quả tìm kiếm <span>: {{dossierList.length}} hồ sơ</span></v-toolbar-title>
              <v-toolbar-title v-else style="font-size: 16px !important;">Thông tin chi tiết hồ sơ</v-toolbar-title>
            </v-toolbar>
          </v-flex>
          <div class="mx-3 mt-4" v-if="validateTracuu === true && !activeDetailDossier" style="position:relative">
            <v-data-table
            :headers="headersTable"
            :items="dossierList"
            hide-actions
            id="tracuuhoso"
            class="table-landing table-bordered"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}" class="hover-pointer" @click="viewDetail(props.item)">
                  <td class="text-xs-center py-3" width="50px">
                    <content-placeholders v-if="loadingTable">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left py-3">
                    <content-placeholders v-if="loadingTable">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.item.dossierNo}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left py-3" >
                    <content-placeholders v-if="loadingTable">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.item.applicantName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left py-3">
                    <content-placeholders v-if="loadingTable">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>
                        <span>{{props.item.receiveDate}}</span>
                      </span>
                    </div>
                  </td>
                  <td class="text-xs-left py-3" >
                    <content-placeholders v-if="loadingTable">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.item.dossierStatusText}}</span>
                    </div>
                  </td>
                </tr>
              </template>
              <template slot="no-data">
                <div class="text-xs-center mt-2">
                  Không có hồ sơ nào được tìm thấy
                </div>
              </template>
            </v-data-table>
            <div v-if="totalPages > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table px-2">
                <tiny-pagination :total="totalPages" :page="hosoDatasPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div>
          </div>
          <div class="mx-3 mt-0" v-if="validateTracuu === true && activeDetailDossier" style="border: 1px solid #0b72ba;">
            <chi-tiet-ho-so :index="dossierDetail.dossierId"></chi-tiet-ho-so>
          </div>
        </div>
      </v-card>
      <v-dialog v-model="dialogError" persistent max-width="290">
        <v-card>
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
import ChiTietHoSoHomePage from './ChiTietHoSoHomePage.vue'
import TinyPagination from './pagination.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'chi-tiet-ho-so': ChiTietHoSoHomePage
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    loadingTable: false,
    dossierNoKey: '',
    applicantNameKey: '',
    applicantIdNoKey: '',
    dossierList: [],
    dossierItemTotal: 0,
    hosoDatasPage: 1,
    totalPages: 0,
    headersTable: [
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
    }
  }),
  computed: {
    filterDossierKey () {
      return this.$store.getters.getFilterDossierKey
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      vm.$store.commit('setFullScreen', true)
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.dossierNoKey = newQuery.hasOwnProperty('keyword') ? newQuery.keyword : ''
      vm.applicantIdNoKey = newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : ''
      if (!newQuery.hasOwnProperty('detail') && $('#dossierNoKey').val() === '') {
        let inputs = document.querySelectorAll('input')
        inputs[0].focus()
      }
      vm.hosoDatasPage = 1
      if ((vm.dossierNoKey !== '' || vm.applicantIdNoKey !== '') && !newQuery.hasOwnProperty('detail') && !newQuery['detail']) {
        vm.validateTracuu = true
        vm.doLoadingDataHoSo()
      } else {
        vm.validateTracuu = false
      }
      if (newQuery.hasOwnProperty('detail') && newQuery['detail']) {
        vm.validateTracuu = true
        vm.activeDetailDossier = true
      } else {
        vm.activeDetailDossier = false
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.dossierNoKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.applicantIdNoKey = currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      vm.hosoDatasPage = 1
      if ((vm.dossierNoKey || vm.applicantIdNoKey) && !currentQuery.hasOwnProperty('detail') && !currentQuery['detail']) {
        vm.validateTracuu = true
        vm.doLoadingDataHoSo()
      } else {
        vm.validateTracuu = false
      }
      if (currentQuery.hasOwnProperty('detail') && currentQuery['detail']) {
        vm.validateTracuu = true
        vm.activeDetailDossier = true
      } else {
        vm.activeDetailDossier = false
      }
      if (!currentQuery.hasOwnProperty('detail') && vm.dossierNoKey === '') {
        let inputs = document.querySelectorAll('input')
        inputs[0].focus()
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
      newQuery['keyword'] = vm.dossierNoKey
      vm.$store.commit('setDossierNoSearch', vm.dossierNoKey)
      newQuery['applicantIdNo'] = vm.applicantIdNoKey
      vm.$store.commit('setApplicantIdNoSearch', vm.applicantIdNoKey)
      newQuery['detail'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (vm.dossierNoKey || vm.applicantIdNoKey) {
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
    confirmPass () {
      var vm = this
      let payload = {
        dossierNo: vm.dossierNoKey,
        applicantIdNo: vm.applicantIdNoKey,
        secretCode: vm.filterDossierKey.secretCode ? vm.filterDossierKey.secretCode : ''
      }
      vm.$store.commit('setFilterDossierKey', payload)
      if (vm.dossierNoKey || vm.applicantIdNoKey) {
        vm.validateTracuu = true
        vm.$router.push({
          path: '/ma-truy-cap-ho-so',
          query: {
            target: 'tracuuhoso'
          }
        })
      } else {
        vm.validateTracuu = false
      }
    },
    showMore () {
      var vm = this
      vm.hosoDatasPage += 1
      vm.loadingTable = true
      let currentQuery = vm.$router.history.current.query
      var filter = null
      filter = {
        page: vm.hosoDatasPage,
        dossierNo: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        applicantName: currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '',
        applicantIdNo: currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        vm.loadingTable = false
        let dossierMore = result.data
        vm.dossierList = vm.dossierList.concat(dossierMore)
      }).catch(reject => {
        vm.loadingTable = false
      })
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loadingTable = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        dossierNo: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        applicantIdNo: currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : '',
        secretCode: vm.filterDossierKey.secretCode
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        vm.hosoDatasPage = currentQuery.page ? currentQuery.page : 1
        vm.loadingTable = false
        if (result.data) {
          vm.dossierList = result.data
          vm.dossierItemTotal = result.total
          vm.totalPages = Number(result.total)
        } else {
          vm.dossierList = []
          vm.dossierItemTotal = 0
        }
      }).catch(reject => {
        vm.loadingTable = false
        vm.dossierList = []
        vm.totalPages = 0
        vm.dossierItemTotal = 0
      })
    },
    viewDetail (item) {
      var vm = this
      vm.dossierDetail = item
      if (item.permission) {
        vm.$store.commit('setDossierDetail', item)
        let queryString = '?keyword=' + vm.dossierNoKey + '&applicantIdNo=' + vm.applicantIdNoKey + '&detail=true'
        vm.$router.push({
          path: '/tra-cuu-ho-so-homepage' + queryString
        })
      } else {
        vm.$store.commit('setDossierDetail', item)
        vm.$router.push({
          path: '/ma-truy-cap-ho-so',
          query: {
            target: 'chitiethoso'
          }
        })
      }
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
    goBack () {
      window.history.back()
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
