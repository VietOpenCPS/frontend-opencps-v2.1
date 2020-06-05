<template>
  <div>
    <v-layout row wrap :class="isMobile ? 'pt-0' : 'pt-2'">
      <v-flex xs12 md3>
        <div style="font-size: 20px;font-weight: 500;color:#0054a6" :class="isMobile ? 'px-2 text-xs-center' : 'px-2'">
          {{!qrscan ? 'TRA CỨU HỒ SƠ' : 'THÔNG TIN HỒ SƠ'}}
        </div>
        <v-card v-if="!qrscan" flat color="#ffffff" class="px-2 py-2">
          <v-flex xs12 class="mb-2">
            <v-text-field
              label="Mã số hồ sơ"
              v-model="dossierNoKey"
              box
              @keyup.enter="changeDataSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="mb-2">
            <v-text-field
              label="Số CMND/ hộ chiếu"
              v-model="applicantIdNo"
              box
              @keyup.enter="changeDataSearch"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 :class="isMobile ? 'mb-2 right' : 'mb-2'">
            <v-btn class="mr-2 ml-0" color="primary" @click="changeDataSearch"
            :loading="loading"
            :disabled="loading">
              <v-icon>search</v-icon> &nbsp;
              Tìm kiếm
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn class="" outline color="#0072bc" @click.native="goBack">
              <v-icon>reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </v-flex>
        </v-card>
      </v-flex>

      <v-flex xs12 md9 :class="isMobile ? 'pt-1 mb-2' : 'pl-3 pt-1 mb-2'">
        <v-card flat class="" v-if="!detail">
          <div class="" v-if="totalDossier > 0">
            <div class="mx-2">Có <span class="text-bold" style="color:#0167d3">{{totalDossier}}</span> hồ sơ được tìm thấy</div>
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
                      <span>{{props.item.dossierNo}}</span>
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
        </v-card>
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
                @click="dialogCheckPass = false"
              >
                <v-icon>reply</v-icon>&nbsp;
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
    qrscan: false
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
  },
  created () {
    var vm = this
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
      vm.dossierPage = newQuery.hasOwnProperty('page') ? Number(newQuery.page) : 1
      let filter = {
        page: vm.dossierPage,
        dossierNo: vm.dossierNoKey,
        applicantIdNo: vm.applicantIdNo
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
      if (String(vm.dossierNoKey).length > 3 || String(vm.applicantIdNo).length > 3) {
        setTimeout(function () {
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          newQuery['page'] = vm.dossierPage
          newQuery['dossierNo'] = vm.dossierNoKey
          newQuery['applicantIdNo'] = vm.applicantIdNo
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
        }
      }).catch(function (reject) {
        vm.loading = false
        toastr.error('Lỗi hệ thống')
      })
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
    }
  }
}
</script>
