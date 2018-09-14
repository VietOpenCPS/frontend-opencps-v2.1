<template>
  <div class="py-0 kios-item">
    <v-card>
      <v-layout wrap class="wrap-password px-0 py-0">
        <div style="width: calc(100% - 150px)">
          <v-layout wrap class="text-xs-center">
            <v-flex xs12 class="pr-2">
              <div class="input-border input-group input-group--placeholder input-group--text-field primary--text">
                <div class="input-group__input">
                  <input id="passCheck" class="kios-input" data-layout="normal" @keyup.enter="submitPass" @focus="show" aria-label="Số hồ sơ" placeholder="Nhập mã tra cứu" type="text">
                  <i v-if="visible" @click="clear('passCheck')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                </div>
                <div class="mt-2" v-if="!validPass">
                  <div class="input-group__messages" style="color:red">* Mã tra cứu là bắt buộc</div>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </div>
        <div class="text-center" style="width: 150px;margin-top:12px">
          <v-btn color="primary"
            :loading="loadingTable"
            :disabled="loadingTable"
            @click="submitPass"
            class="kios-btn"
          >
            <v-icon size="20">search</v-icon>
            &nbsp;
            Tra Cứu
            <span slot="loader">Loading...</span>
          </v-btn>
        </div>
        <div class="text-center text-bold mt-3" style="color:#065694">
          <p class="mb-1">Mã tra cứu là dãy số gồm 4 ký tự được in trên</p>
          <p> GIẤY TIẾP NHẬN HỒ SƠ VÀ HẸN TRẢ KẾT QUẢ</p>
        </div>
      </v-layout>
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
    <v-btn class="back-btn" @click="goBack" fab color="primary">
      <v-icon dark>arrow_back</v-icon>
    </v-btn>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import VueTouchKeyBoard from './keyboard.vue'
export default {
  props: [],
  components: {
    'vue-touch-keyboard': VueTouchKeyBoard
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    dialogError: false,
    valid: false,
    passCheck: '',
    validPass: true,
    targetCheckPass: '',
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
    dossierDetail () {
      return this.$store.getters.getDetailDossier
    },
    applicantIdNoSearch () {
      return this.$store.getters.getApplicantIdNoSearch
    },
    dossierNoSearch () {
      return this.$store.getters.getDossierNoSearch
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let inputs = document.querySelectorAll('input')
      inputs[0].focus()
      $('#passCheck').val('')
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.targetCheckPass = newQuery['target']
    })
  },
  watch: {},
  methods: {
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loadingTable = true
      vm.$store.dispatch('loadingDataHoSo', vm.filterDossierKey).then(function (result) {
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
    submitPass () {
      var vm = this
      if ($('#passCheck').val() !== '') {
        vm.validPass = true
        if (vm.targetCheckPass === 'tracuuhoso') {
          let payload = {
            dossierNo: vm.filterDossierKey.dossierNo ? vm.filterDossierKey.dossierNo : '',
            applicantIdNo: vm.filterDossierKey.applicantIdNo ? vm.filterDossierKey.applicantIdNo : '',
            secretCode: $('#passCheck').val()
          }
          vm.$store.commit('setFilterDossierKey', payload)
          let newQuery = {
            dossierNo: vm.filterDossierKey.dossierNo,
            applicantIdNo: vm.filterDossierKey.applicantIdNo
          }
          let queryString = '?'
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          vm.$router.push({
            path: '/tra-cuu-ho-so' + queryString,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        } else {
          console.log('vm.dossierDetail', vm.dossierDetail)
          let filter = {
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
              vm.$store.commit('setDossierDetail', result.data)
              let queryString = '?dossierNo=' + vm.dossierNoSearch + '&applicantIdNo=' + vm.applicantIdNoSearch + '&detail=true'
              vm.$router.push({
                path: '/tra-cuu-ho-so' + queryString
              })
            }
          }).catch(function (reject) {
            vm.dialogCheckPass = false
            vm.visible = false
            vm.loading = false
            console.log('reject', reject)
          })
        }
      } else {
        vm.validPass = false
      }
    },
    viewDetail (item) {
      var vm = this
      vm.dossierDetail = item
      vm.dialogCheckPass = true
      // router.push('/tra-cuu-ho-so/' + item.dossierId)
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
      this.bindClick()
    },
    showKeyboard (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick()
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
    bindClick () {
      var vm = this
      setTimeout(function () {
        $('.keyboard .line:nth-child(2) .key:last-child').unbind('click')
        $('.keyboard .line:nth-child(2) .key:last-child').bind('click', function () {
          vm.submitPass()
        })
      }, 200)
    }
  }
}
</script>
