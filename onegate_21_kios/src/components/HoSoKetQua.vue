<template>
  <div class="py-0 kios-item">
    <div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <v-card v-else>
        <div class="table-dossier" style="background-color: #ffffff">
          <h4 class="py-3 ml-3">
            <span style="color:#065694">DANH SÁCH HỒ SƠ CÓ KẾT QUẢ </span>
          </h4>
          <div class="mt-3"> 
            <v-layout class="wrap">
              <v-flex class="px-2 py-2 th" style="width: 250px"><span class="text-bold">Mã hồ sơ</span></v-flex>
              <v-flex class="px-2 py-2 th" style="width: calc(100% - 550px)"><span class="text-bold"> Chủ hồ sơ</span></v-flex>
              <v-flex class="px-2 py-2 th" style="width: 150px"><span class="text-bold">Ngày nộp</span></v-flex>
              <v-flex class="px-2 py-2 th" style="width: 150px"><span class="text-bold">Ngày có kết quả</span></v-flex>
            </v-layout>
          </div>
          <div class="dossierList">
            <marquee behavior="scroll" direction="up" v-if="dossierList.length > 9">
              <div class="wrap-list">
                <v-layout class="wrap" v-for="(item, index) in dossierList"
                :key="item.dossierId" :class="index%2===1 ? 'active': ''">
                  <v-flex class="px-2 py-2 td" style="width: 250px"><span>{{item.dossierNo}}</span></v-flex>
                  <v-flex class="px-2 py-2 td" style="width: calc(100% - 550px)"><span> {{item.applicantName}}</span></v-flex>
                  <v-flex class="px-2 py-2 td" style="width: 150px"><span>{{item.submitDate}}</span></v-flex>
                  <v-flex class="px-2 py-2 td" style="width: 150px"><span>{{item.finishDate}}</span></v-flex>
                </v-layout>
              </div>
            </marquee>
            <div class="wrap-list" v-else>
              <v-layout class="wrap" v-for="(item, index) in dossierList"
              :key="item.dossierId" :class="index%2===1 ? 'active': ''">
                <v-flex class="px-2 py-2 td" style="width: 250px"><span>{{item.dossierNo}}</span></v-flex>
                <v-flex class="px-2 py-2 td" style="width: calc(100% - 550px)"><span> {{item.applicantName}}</span></v-flex>
                <v-flex class="px-2 py-2 td" style="width: 150px"><span>{{item.submitDate}}</span></v-flex>
                <v-flex class="px-2 py-2 td" style="width: 150px"><span>{{item.finishDate}}</span></v-flex>
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
      var filter = {}
      vm.$store.dispatch('loadingDataHoSoKQ', filter).then(function (result) {
        vm.loading = false
        vm.dossierList = result.data
        vm.dossierItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.dossierList = []
        vm.dossierItemTotal = 0
      })
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    }
  }
}
</script>
