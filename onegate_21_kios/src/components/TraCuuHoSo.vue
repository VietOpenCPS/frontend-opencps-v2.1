<template>
  <div class="py-0 kios-item pr-3">
    <div>
      <v-card flat class="pb-2">
        <h4 v-if="agencies.length === 1" class="py-1 text-xs-center" style="color:green; text-transform:uppercase">
          {{agencies[0]['administrationName']}}
        </h4>
        <h4 class="py-2 ml-2 text-xs-center">
          <span style="color:#065694">TRA CỨU THÔNG TIN HỒ SƠ </span>
        </h4>
        <v-layout wrap class="px-0 py-0">
          <div :style="!isMobile ? 'width: calc(100% - 150px)' : 'width: 100%'">
            <v-layout wrap>
              <v-flex xs12 md6 class="px-2">
                <v-text-field class="input-border input-search"
                  label="Mã hồ sơ"
                  v-model="dossierNoKey"
                  @keyup.enter="filterDossier"
                  @click:append="filterDossier"
                  append-icon="search"
                  box
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6 class="px-2">
                <v-text-field class="input-border input-search"
                  label="Số CMND/ hộ chiếu"
                  v-model="applicantIdNoKey"
                  @keyup.enter="filterDossier"
                  @click:append="filterDossier"
                  append-icon="search"
                  box
                ></v-text-field>
              </v-flex>
            </v-layout>
          </div>
          <div class="text-right" :style="!isMobile ? 'width: 150px' : 'width: 100%'">
            <v-btn color="primary"
              :loading="loadingTable"
              :disabled="loadingTable"
              @click="filterDossier"
              class="kios-btn"
            >
              <v-icon size="18">search</v-icon>
              &nbsp;
              Tra Cứu
              <span slot="loader">Loading...</span>
            </v-btn>
          </div>
        </v-layout>
        <v-alert class="mt-5 mx-2" v-if="validateTracuu === false && !activeDetailDossier" :value="true" outline color="orange" icon="priority_high">
          Nhập thông tin tra cứu
        </v-alert>
        <!--  -->
        <div class="wrap-scroll wrap-scroll-tabledossier mx-2 mt-4" v-if="validateTracuu === true && !activeDetailDossier" :class="visible ? 'overlayActive': ''" style="position:relative">
          <v-data-table
          :headers="headersTable"
          :items="dossierList"
          hide-actions
          id="tracuuhoso"
          class="table-tracuu table-landing table-bordered"
          :class="visible ? 'overlayActive': ''"
          >
            <template slot="items" slot-scope="props">
              <tr v-bind:class="{'active': props.index%2==1}" @click="viewDetail(props.item)">
                <td class="text-xs-left">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.dossierNo}}</span><br>
                  </div>
                </td>
                <td class="text-xs-left" >
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>{{props.item.applicantName}}</span>
                  </div>
                </td>
                <td class="text-xs-left">
                  <content-placeholders v-if="loadingTable">
                    <content-placeholders-text :lines="1" />
                  </content-placeholders>
                  <div v-else>
                    <span>
                      <span>{{props.item.receiveDate}}</span>
                    </span>
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
        <div class="mx-2 mt-3" v-if="validateTracuu === true && activeDetailDossier">
          <chi-tiet-ho-so :index="dossierDetail.dossierId"></chi-tiet-ho-so>
        </div>
        <div class="virtual-keyboard" v-if="visible">
          <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" :options="options" />
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
import ChiTietHoSo from './ChiTietHoSo.vue'
import TinyPagination from './pagination.vue'
import VueTouchKeyBoard from './keyboard.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'vue-touch-keyboard': VueTouchKeyBoard,
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
    }
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
    },
    isMobile () {
      return this.$store.getters.getIsMobile
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
      vm.dossierNoKey = newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : ''
      vm.applicantIdNoKey = newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : ''
      // $('#applicantNameKey').val(newQuery.hasOwnProperty('applicantName') ? newQuery.applicantName : '')
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
      vm.dossierNoKey = currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : ''
      vm.applicantIdNoKey = currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      // $('#applicantNameKey').val(currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '')
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
      newQuery['dossierNo'] = vm.dossierNoKey
      vm.$store.commit('setDossierNoSearch', vm.dossierNoKey)
      newQuery['applicantIdNo'] = vm.applicantIdNoKey
      vm.$store.commit('setApplicantIdNoSearch', vm.applicantIdNoKey)
      newQuery['applicantName'] = $('#applicantNameKey').val()
      newQuery['detail'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (vm.dossierNoKey || vm.applicantIdNoKey || $('#applicantNameKey').val()) {
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
        dossierNo: vm.dossierNoKey,
        applicantIdNo: vm.applicantIdNoKey,
        secretCode: vm.filterDossierKey.secretCode ? vm.filterDossierKey.secretCode : ''
      }
      vm.$store.commit('setFilterDossierKey', payload)
      if (vm.dossierNoKey || vm.applicantIdNoKey) {
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
      vm.loadingTable = true
      let currentQuery = router.history.current.query
      var filter = null
      let groupIds = vm.groupIdArr.length
      console.log('groupIds', groupIds)
      if (groupIds > 0) {
        let totalRecord = 0
        let count = 0
        for (var key = 0; key < groupIds; key++) {
          filter = {
            page: currentQuery.page ? currentQuery.page : 1,
            dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
            applicantIdNo: currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : '',
            secretCode: vm.filterDossierKey.secretCode,
            groupId: vm.groupIdArr[key]
          }
          vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
            vm.hosoDatasPage = currentQuery.page ? currentQuery.page : 1
            count += 1
            totalRecord = (result.total > totalRecord) ? result.total : totalRecord
            if (result.data) {
              vm.dossierList = vm.dossierList.concat(result.data)
            }
            if (count === groupIds) {
              vm.loadingTable = false
              vm.dossierItemTotal = totalRecord
              vm.totalPages = Number(totalRecord)
            }
          }).catch(reject => {
            count += 1
            if (count === groupIds) {
              vm.loadingTable = false
              vm.dossierItemTotal = totalRecord
              vm.totalPages = Number(totalRecord)
            }
          })
        }
      } else {
        filter = {
          page: currentQuery.page ? currentQuery.page : 1,
          dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
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
      }
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
