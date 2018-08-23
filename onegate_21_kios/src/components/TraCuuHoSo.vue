<template>
  <div class="px-2 py-0">
    <div>
      <v-card>
        <v-layout wrap class="px-0 py-0">
          <div style="width: calc(100% - 150px)">
            <v-layout wrap>
              <v-flex xs4 class="pl-2 pr-2">
                <!-- <v-text-field
                  label="Số hồ sơ"
                  placeholder="Nhấn để nhập mã số hồ sơ"
                  v-model="dossierNoKey"
                  clearable
                  @focus="show"
                  data-layout="normal"
                ></v-text-field> -->
                <div class="input-group input-group--placeholder input-group--text-field primary--text">
                  <label>Số hồ sơ</label>
                  <div class="input-group__input">
                    <input id="dossierNoKey" data-layout="normal" @focus="show" aria-label="Số hồ sơ" placeholder="Nhấn để nhập mã số hồ sơ" type="text">
                    <i v-if="visible" @click="clear('dossierNoKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                  </div>
                  <div class="input-group__details"></div>
                </div>
              </v-flex>
              <v-flex xs4 class="pl-2 pr-2">
                <!-- <v-text-field
                  label="Số CMND"
                  placeholder="Nhấn để nhập số CMND"
                  v-model="applicantIdNoKey"
                  clearable
                  @focus="show"
                  data-layout="normal"
                ></v-text-field> -->
                <div class="input-group input-group--placeholder input-group--text-field primary--text">
                  <label>Số CMND</label>
                  <div class="input-group__input">
                    <input id="applicantIdNoKey" data-layout="normal" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập số CMND" type="text">
                    <i v-if="visible" @click="clear('applicantIdNoKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                  </div>
                  <div class="input-group__details"></div>
                </div>
              </v-flex>
              <v-flex xs4 class="pl-2 pr-2">
                <!-- <v-text-field
                  label="Họ tên người nộp"
                  placeholder="Nhấn để nhập họ và tên"
                  v-model="applicantNameKey"
                  clearable
                ></v-text-field> -->
                <div class="input-group input-group--placeholder input-group--text-field primary--text">
                  <label>Họ tên người nộp</label>
                  <div class="input-group__input">
                    <input id="applicantNameKey" data-layout="normal" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập họ và tên" type="text">
                    <i v-if="visible" @click="clear('applicantNameKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                  </div>
                  <div class="input-group__details"></div>
                </div>
              </v-flex>
            </v-layout>
          </div>
          <div class="pt-2 text-center" style="width: 150px">
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
          </div>
        </v-layout>
        <!--  -->
        <vue-touch-keyboard class="mt-5" v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" />
        <!--  -->
        <div class="my-3 pt-2 text-center total-result-search">
          <span class="text-bold">Có {{dossierItemTotal}} kết quả được tìm thấy</span>
        </div>
        <v-data-table
        :headers="headersTable"
        :items="dossierList"
        hide-actions
        class="table-tracuu table-landing table-bordered"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" @click="viewDetail(props.item)">
              <td class="text-xs-center">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.index + 1}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.dossierNo}}</span><br>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loadingTable">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceName}}</span>
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
                    <span>{{props.item.dossierStatusText}}</span>
                  </span>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
        <div v-if="hosoDatasPage < totalPages && dossierItemTotal > 0" class="mt-3 text-center">
          <v-btn outline color="indigo" @click="showMore" 
            :loading="loadingTable"
            :disabled="loadingTable">
            <v-icon size="20">expand_more</v-icon>&nbsp;
            Xem thêm
            <span slot="loader">Loading...</span>
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
export default {
  props: [],
  components: {},
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
    totalPages: 1,
    headersTable: [
      {
        text: 'Số thứ tự',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thủ tục thực hiện',
        align: 'center',
        sortable: false
      },
      {
        text: 'Người nộp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng hồ sơ',
        align: 'center',
        sortable: false
      }
    ],
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: false
    }
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      // vm.dossierNoKey = newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : ''
      $('#dossierNoKey').val(newQuery.hasOwnProperty('dossierNo') ? newQuery.dossierNo : '')
      // vm.applicantIdNoKey = newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : ''
      $('#applicantIdNoKey').val(newQuery.hasOwnProperty('applicantIdNo') ? newQuery.applicantIdNo : '')
      // vm.applicantNameKey = newQuery.hasOwnProperty('applicantName') ? newQuery.applicantName : ''
      $('#applicantNameKey').val(newQuery.hasOwnProperty('applicantName') ? newQuery.applicantName : '')
      vm.hosoDatasPage = 1
      vm.doLoadingDataHoSo()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      // vm.dossierNoKey = currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : ''
      $('#dossierNoKey').val(currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '')
      // vm.applicantIdNoKey = currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      $('#applicantIdNoKey').val(currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : '')
      // vm.applicantNameKey = currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : ''
      $('#applicantNameKey').val(currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '')
      vm.hosoDatasPage = 1
      vm.doLoadingDataHoSo()
    }
  },
  methods: {
    filterDossier () {
      var vm = this
      vm.visible = false
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      // newQuery['dossierNo'] = vm.dossierNoKey ? vm.dossierNoKey : ''
      newQuery['dossierNo'] = $('#dossierNoKey').val()
      // newQuery['applicantIdNo'] = vm.applicantIdNoKey ? vm.applicantIdNoKey : ''
      newQuery['applicantIdNo'] = $('#applicantIdNoKey').val()
      // newQuery['applicantName'] = vm.applicantNameKey ? vm.applicantNameKey : ''
      newQuery['applicantName'] = $('#applicantNameKey').val()
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
        page: vm.hosoDatasPage,
        dossierNo: currentQuery.hasOwnProperty('dossierNo') ? currentQuery.dossierNo : '',
        applicantName: currentQuery.hasOwnProperty('applicantName') ? currentQuery.applicantName : '',
        applicantIdNo: currentQuery.hasOwnProperty('applicantIdNo') ? currentQuery.applicantIdNo : ''
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        vm.loadingTable = false
        vm.dossierList = result.data
        vm.dossierItemTotal = result.total
        vm.totalPages = Math.ceil(result.total / 15)
      }).catch(reject => {
        vm.loadingTable = false
        vm.dossierList = []
        vm.dossierItemTotal = 0
      })
    },
    viewDetail (item) {
      router.push('/tra-cuu-ho-so/' + item.dossierId)
    },
    //
    clear (id) {
      $(`#${id}`).val('')
    },
    accept (text) {
      this.hide()
    },
    show (e) {
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
    },
    hide () {
      this.visible = false
    },
    next () {
      console.log('run next')
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
    }
  }
}
</script>
