<template>
  <div class="py-0 kios-item">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div class="table-dossier" style="background-color: #ffffff">
          <h4 class="py-3 ml-3">
            <span style="color:#065694">DANH SÁCH HỒ SƠ CÓ KẾT QUẢ (NGÀY {{fromDate()}}) </span>
          </h4>
          <div class="mt-3"> 
            <v-layout class="wrap">
              <v-flex class="px-2 py-2 th" style="width: 25%"><span class="text-bold">Mã hồ sơ</span></v-flex>
              <v-flex class="px-2 py-2 th" style="width: 35%"><span class="text-bold"> Chủ hồ sơ</span></v-flex>
              <v-flex class="px-2 py-2 th" style="width: 20%"><span class="text-bold">Ngày nộp</span></v-flex>
              <v-flex class="px-2 py-2 th" style="width: 20%"><span class="text-bold">Ngày có kết quả</span></v-flex>
            </v-layout>
          </div>
          <div class="dossierList">
            <marquee behavior="scroll" direction="up" v-if="dossierList.length > 5">
              <div class="wrap-list">
                <v-layout class="wrap" v-for="(item, index) in dossierList"
                :key="item.dossierId" :class="index%2===1 ? 'active': ''">
                  <v-flex class="px-2 py-2 td" style="width: 25%"><span>{{item.dossierNo}}</span></v-flex>
                  <v-flex class="px-2 py-2 td" style="width: 35%"><span> {{item.applicantName}}</span></v-flex>
                  <v-flex class="px-2 py-2 td" style="width: 20%"><span>{{item.receiveDate}}</span></v-flex>
                  <v-flex class="px-2 py-2 td" style="width: 20%"><span>{{item.dueDate}}</span></v-flex>
                </v-layout>
              </div>
            </marquee>
            <div class="wrap-list" v-else>
              <v-layout class="wrap" v-for="(item, index) in dossierList"
              :key="item.dossierId" :class="index%2===1 ? 'active': ''">
                <v-flex class="px-2 py-2 td" style="width: 25%"><span>{{item.dossierNo}}</span></v-flex>
                <v-flex class="px-2 py-2 td" style="width: 35%"><span> {{item.applicantName}}</span></v-flex>
                <v-flex class="px-2 py-2 td" style="width: 20%"><span>{{item.receiveDate}}</span></v-flex>
                <v-flex class="px-2 py-2 td" style="width: 20%"><span>{{item.dueDate}}</span></v-flex>
              </v-layout>
            </div>
          </div>
        </div>
        <v-btn class="back-btn" @click="changeScreen" fab color="primary">
          <v-icon v-if="!fullScreen" dark>fullscreen</v-icon>
          <v-icon v-if="fullScreen" dark>fullscreen_exit</v-icon>
        </v-btn>
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
