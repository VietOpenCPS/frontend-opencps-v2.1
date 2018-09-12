<template>
  <div class="py-0 kios-item">
    <div>
      <v-card class="pb-2">
        <h4 class="pt-2 ml-2">
          <span style="color:#065694">TRA CỨU THÔNG TIN HỒ SƠ </span>
        </h4>
        <v-layout wrap class="mt-3 px-0 py-0">
          <div style="width: calc(100% - 150px)">
            <v-layout wrap>
              <v-flex xs6 class="pl-2 pr-3">
                <div class="input-border input-group input-group--placeholder input-group--text-field primary--text">
                  <!-- <label>Mã số hồ sơ</label> -->
                  <div class="input-group__input">
                    <input id="dossierNoKey" class="kios-input" data-layout="normal" @keyup.enter="filterDossier" @focus="show" aria-label="Số hồ sơ" placeholder="Nhấn để nhập mã số hồ sơ" type="text">
                    <i v-if="visible" @click="clear('dossierNoKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                  </div>
                </div>
              </v-flex>
              <v-flex xs6 class="pl-3 pr-2">
                <div class="input-border input-group input-group--placeholder input-group--text-field primary--text">
                  <div class="input-group__input">
                    <input id="applicantIdNoKey" class="kios-input" data-layout="normal" @keyup.enter="filterDossier" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập số CMND" type="text">
                    <i v-if="visible" @click="clear('applicantIdNoKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </div>
          <div class="text-right" style="width: 150px;margin-top:12px">
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
                      <span>{{props.item.submitDate}}</span>
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
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      $('#dossierNoKey').val(newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : '')
      $('#applicantIdNoKey').val(newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : '')
      if (!newQuery.hasOwnProperty('detail') && $('#dossierNoKey').val() === '') {
        let inputs = document.querySelectorAll('input')
        inputs[0].focus()
      }
      // $('#applicantNameKey').val(newQuery.hasOwnProperty('applicantName') ? newQuery.applicantName : '')
      vm.hosoDatasPage = 1
      if (($('#dossierNoKey').val() !== '' || $('#applicantIdNoKey').val() !== '') && !newQuery.hasOwnProperty('detail') && !newQuery['detail']) {
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
      $('#dossierNoKey').val(currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '')
      $('#applicantIdNoKey').val(currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : '')
      // $('#applicantNameKey').val(currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '')
      vm.hosoDatasPage = 1
      if (($('#dossierNoKey').val() || $('#applicantIdNoKey').val()) && !currentQuery.hasOwnProperty('detail') && !currentQuery['detail']) {
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
      if (!currentQuery.hasOwnProperty('detail') && $('#dossierNoKey').val() === '') {
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
      newQuery['dossierNo'] = $('#dossierNoKey').val()
      vm.$store.commit('setDossierNoSearch', $('#dossierNoKey').val())
      newQuery['applicantIdNo'] = $('#applicantIdNoKey').val()
      vm.$store.commit('setApplicantIdNoSearch', $('#applicantIdNoKey').val())
      newQuery['applicantName'] = $('#applicantNameKey').val()
      newQuery['detail'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if ($('#dossierNoKey').val() || $('#applicantIdNoKey').val() || $('#applicantNameKey').val()) {
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
    showMore () {
      var vm = this
      vm.hosoDatasPage += 1
      vm.loadingTable = true
      let currentQuery = router.history.current.query
      var filter = null
      filter = {
        page: vm.hosoDatasPage,
        dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
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
