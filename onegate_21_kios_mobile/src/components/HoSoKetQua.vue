<template>
  <div class="py-0 kios-item">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div class="table-dossier" style="background-color: #ffffff">
          <h3 class="py-3 ml-3">
            <span style="color:#065694">DANH SÁCH HỒ SƠ CÓ KẾT QUẢ (NGÀY {{fromDate()}}) </span>
          </h3>
          <v-container fluid grid-list-sm class="px-2">
            <v-layout wrap>
              <v-flex xs12 sm6 v-for="(item, index) in dossierList" :key="index" class="mb-2">
                <v-card flat color="#e9e9ff" width="100%" height="100%">
                  <v-card-title primary-title>
                    <v-flex class="xs12 sm12 pb-1">
                      <span class="pr-2 text-bold">Mã hồ sơ: </span>
                      <span class="pl-0"> {{item.dossierNo}}</span>
                    </v-flex>
                    <v-flex class="xs12 sm12 pb-1">
                      <span class="pr-2 text-bold">Chủ hồ sơ: </span>
                      <span class="pl-0"> {{item.applicantName}}</span>
                    </v-flex>
                    <v-flex class="xs12 sm12 pb-1">
                      <span class="pr-2 text-bold">Ngày nộp: </span>
                      <span class="pl-0"> {{item.receiveDate}}</span>
                    </v-flex>
                    <v-flex class="xs12 sm12 pb-1">
                      <span class="pr-2 text-bold">Ngày có kết quả: </span>
                      <span class="pl-0"> {{item.releaseDate}}</span>
                    </v-flex>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
            <!-- <div v-if="totalPages > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table">
                <tiny-pagination :total="totalPages" :page="hosoDatasPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div> -->
          </v-container>
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
    dossierList: [],
    dossierItemTotal: 0
  }),
  computed: {
    fullScreen () {
      return this.$store.getters.getFullScreen
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.commit('setFullScreen', false)
      vm.doLoadingDataHoSo()
      setInterval(function () {
        vm.doLoadingDataHoSo()
      }, 3600000)
    })
  },
  watch: {},
  methods: {
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      vm.loading = true
      var filter = {
        fromDate: vm.fromDate(),
        toDate: vm.fromDate()
      }
      vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.dossierList = result.data
        } else {
          vm.dossierList = []
        }
        if (result.total) {
          vm.dossierItemTotal = result.total
        } else {
          vm.dossierItemTotal = 0
        }
      }).catch(reject => {
        vm.loading = false
        vm.dossierList = []
        vm.dossierItemTotal = 0
      })
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    fromDate () {
      let value = new Date()
      return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    },
    toDate () {
      let value = new Date((new Date()).getTime() + 86400000)
      return `${(value.getDate()).toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
    }
  }
}
</script>
