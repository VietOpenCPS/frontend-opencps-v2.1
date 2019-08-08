<template>
  <div class="px-2 py-0 kios-item">
    <v-card flat>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <h4 class="pt-2 ml-2" v-if="!detailActive">
        <span style="color:#065694">CHỌN ĐƠN VỊ </span>
      </h4>
      <div class="mt-4" v-if="!loading && !detailActive" :class="visible ? 'overlayActive': ''">
        <v-layout class="wrap">
          <v-flex xs6 sm4 class="pr-3" v-for="(item, index) in govAgencyList" :key="index">
            <v-btn outline flat color="primary" class="kios-btn btn-select" @click="votingDetail(item)" 
              style="width:100%;background-color:#b3d4fc5c!important;">
              {{item.administrationName}}
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
    <v-btn v-if="!isMobile" class="back-btn" @click="changeScreen" fab color="primary">
      <v-icon size="20" v-if="!fullScreen" dark>fullscreen</v-icon>
      <v-icon size="20" v-if="fullScreen" dark>fullscreen_exit</v-icon>
    </v-btn>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import TinyPagination from './pagination.vue'
import ChiTietDanhGia from './ChiTietDanhGiaCanBo.vue'
import VueTouchKeyBoard from './keyboard.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'vue-touch-keyboard': VueTouchKeyBoard,
    'chi-tiet-danh-gia': ChiTietDanhGia
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    govAgencyList: [],
    govAgencySelectedObj: {},
    govAgencySelected: '',
    detailActive: false,
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: false
    }
  }),
  computed: {
    fullScreen () {
      return this.$store.getters.getFullScreen
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      //
      if (vm.govAgencyList.length === 0) {
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.govAgencyList = result
        }).catch(reject => {})
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.govAgencySelected = currentQuery.hasOwnProperty('administration') ? currentQuery.administration : ''
      if (vm.govAgencySelected) {
        vm.detailActive = true
      } else {
        vm.detailActive = false
      }
      if (vm.govAgencyList.length === 0) {
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.govAgencyList = result
        }).catch(reject => {})
      }
    }
  },
  methods: {
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    votingDetail (item) {
      var vm = this
      vm.govAgencySelected = item.administrationCode
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['agencyCode'] = item.administrationCode
      newQuery['agencyName'] = item.administrationName
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      vm.$router.push({
        path: '/danh-sach-can-bo' + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    }
  }
}
</script>