<template>
  <div class="py-0">
    <v-card style="min-height: 100vh;">
      <h2 class="pt-2 mx-2 text-xs-center">
        <span style="color:#065694">XÁC THỰC TRA CỨU THÔNG TIN HỒ SƠ</span>
      </h2>
      <v-flex xs12 class="text-xs-center" >
        <div class="d-inline-block mt-4" style="width:100%;max-width: 700px">
          <v-flex xs12 class="px-2 pb-2">
            <v-card class="px-3 py-3" color="#002c46b3" flat style="max-width:700px;margin: 0 auto;border: 1px solid #dddddd">
              <v-form ref="form" v-model="valid" lazy-validation class="mt-2">
                <v-flex xs12 class="mt-3">
                  <v-text-field
                    solo
                    placeholder="Mã tra cứu"
                    v-model="secretKey"
                    prepend-inner-icon="vpn_key"
                    @keyup.enter="submitPass"
                    height="42"
                    :rules="[v => !!v || 'Mã tra cứu là bắt buộc']"
                    required
                  ></v-text-field>
                </v-flex>
                <!-- <v-flex xs12 class="">
                  <v-text-field
                    solo
                    placeholder="Số CMTND/ Hộ chiếu"
                    v-model="applicantIdNo"
                    prepend-inner-icon="credit_card"
                    @keyup.enter="submitPass"
                    height="42"
                  ></v-text-field>
                </v-flex> -->
                <v-layout wrap xs12 class="text-xs-left">
                  <!-- <div class="flex red--text" style="width:10px">(*) </div> -->
                  <div class="flex white--text" style="width:calc(100% - 30px)">Mã tra cứu là dãy số gồm 4 ký tự được in trên giấy tiếp nhận hồ sơ và hẹn trả kết quả, mail thông báo tiếp nhận hồ sơ.</div>
                </v-layout>
                <v-flex xs12 class="text-xs-left text-xs-center mt-2">
                  <v-btn class="ml-0 mr-1 my-0 white--text" color="#0b72ba"
                    :loading="loading"
                    :disabled="loading"
                    @click="submitPass"
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
        </div>
      </v-flex>
    </v-card>

    <v-dialog v-model="dialogError" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Bạn không có quyền truy cập hồ sơ 
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialogError = false">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import toastr from 'toastr'
import $ from 'jquery'
Vue.use(toastr)
export default {
  props: [],
  components: {},
  data: () => ({
    loading: false,
    loadingAction: false,
    dialogError: false,
    valid: false,
    secretKey: '',
    validPass: true,
    targetCheckPass: ''
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
    },
    fullScreen () {
      return this.$store.getters.getFullScreen
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.commit('setFullScreen', true)
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
      if (vm.$refs.form.validate()) {
        vm.validPass = true
        if (vm.targetCheckPass === 'tracuuhoso') {
          let payload = {
            dossierNo: vm.filterDossierKey.dossierNo ? vm.filterDossierKey.dossierNo : '',
            applicantIdNo: vm.filterDossierKey.applicantIdNo ? vm.filterDossierKey.applicantIdNo : '',
            secretCode: $('#passCheck').val()
          }
          vm.$store.commit('setFilterDossierKey', payload)
          let newQuery = {
            keyword: vm.filterDossierKey.dossierNo,
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
          let filter = {
            password: vm.secretKey,
            dossierId: vm.dossierDetail.dossierId
          }
          vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
            vm.loading = false
            if (result.status && result.status.toString() === '203') {
              toastr.error('Mã tra cứu không chính xác. Vui lòng thử lại.')
            } else if (result.status && result.status.toString() === '200') {
              vm.clearDialog()
              vm.$store.commit('setDossierDetail', result.data)
              let queryString = '?keyword=' + vm.dossierNoSearch + '&applicantIdNo=' + vm.applicantIdNoSearch + '&detail=true'
              vm.$router.push({
                path: '/tra-cuu-ho-so-homepage' + queryString
              })
            }
          }).catch(function (reject) {
            vm.loading = false
            toastr.error('Lỗi hệ thống')
            console.log('reject', reject)
          })
        }
      } else {
        console.log('run validPass false')
        // vm.validPass = false
      }
    },
    viewDetail (item) {
      var vm = this
      vm.dossierDetail = item
      // router.push('/tra-cuu-ho-so/' + item.dossierId)
    },
    clearDialog () {
      $('#passCheck').val('')
      this.validPass = true
    },
    clear (id) {
      $(`#${id}`).val('')
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
