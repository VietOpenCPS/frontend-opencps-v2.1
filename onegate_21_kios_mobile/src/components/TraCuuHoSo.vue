<template>
  <div class="py-0" >
    <v-card class="pb-2">
      <h3 class="pt-2 ml-2">
        <span style="color:#065694">TRA CỨU THÔNG TIN HỒ SƠ </span>
      </h3>
      <v-layout wrap class="mt-2 px-0 py-0">
        <v-flex xs12 sm5 class="px-2">
          <v-text-field
            label="Số hồ sơ"
            v-model="dossierNoKey"
            box
            clearable
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm5 class="px-2">
          <v-text-field
            label="Số CMND"
            v-model="applicantIdNoKey"
            box
            clearable
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm2 class="text-right">
          <v-btn color="primary"
            :loading="loadingTable"
            :disabled="loadingTable"
            @click="filterDossier"
          >
            <v-icon size="18">search</v-icon>
            &nbsp;
            Tra Cứu
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-alert class="mt-2 mx-2" v-if="validateTracuu === false && !activeDetailDossier" :value="true" outline color="orange" icon="priority_high">
        Nhập thông tin tra cứu
      </v-alert>
      <!--  -->
      <v-container fluid grid-list-sm class="px-2" v-if="validateTracuu === true && !activeDetailDossier">
        <v-layout wrap>
          <v-flex xs12 sm6 v-for="(item, index) in dossierList" :key="index" class="mb-2">
            <v-card flat color="#e9e9ff" width="100%" height="100%">
              <v-card-title primary-title>
                <v-flex class="xs12 sm12 pb-1">
                  <span class="pr-2 text-bold">Mã hồ sơ: </span>
                  <span class="pl-0"> {{item.dossierNo}}</span>
                </v-flex>
                <v-flex class="xs12 sm12 pb-1">
                  <span class="pr-2 text-bold">Người nộp: </span>
                  <span class="pl-0"> {{item.applicantName}}</span>
                </v-flex>
                <v-flex class="xs12 sm12 pb-1">
                  <span class="pr-2 text-bold">Ngày nộp: </span>
                  <span class="pl-0"> {{item.receiveDate}}</span>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="primary" @click="viewDetail(item)">
                  <v-icon size="18">near_me</v-icon> &nbsp;
                  Xem chi tiết
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <div v-if="totalPages > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
          <div class="flex pagging-table">
            <tiny-pagination :total="totalPages" :page="hosoDatasPage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div>
      </v-container>
      <div class="mx-2 mt-3" v-if="validateTracuu === true && activeDetailDossier">
        <chi-tiet-ho-so :index="dossierDetail.dossierId"></chi-tiet-ho-so>
      </div>
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
    </v-card>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import ChiTietHoSo from './ChiTietHoSo.vue'
import TinyPagination from './pagination.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'chi-tiet-ho-so': ChiTietHoSo
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
    activeDetailDossier: false
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
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.dossierNoKey = newQuery.hasOwnProperty('keyword') ? newQuery.keyword : ''
      vm.applicantIdNoKey = newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : ''
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
      let currentQuery = router.history.current.query
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
      let currentQuery = router.history.current.query
      var filter = null
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
          console.log('totalPages', vm.totalPages)
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
      vm.$store.commit('setDossierDetail', item)
      vm.$router.push({
        path: '/ma-truy-cap-ho-so',
        query: {
          id: item.dossierId,
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
    }
  }
}
</script>
