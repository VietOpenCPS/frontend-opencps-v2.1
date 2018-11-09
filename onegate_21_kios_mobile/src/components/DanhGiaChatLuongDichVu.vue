<template>
  <div class="px-2 py-0 kios-item">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <h4 class="pt-2 ml-2" v-if="!detailActive">
      <span style="color:#065694">CHỌN ĐƠN VỊ ĐỂ ĐÁNH GIÁ CHẤT LƯỢNG DỊCH VỤ </span>
    </h4>
    <div class="text-xs-center" v-if="detailActive">
      <h4 class="py-2" style="color:#065694">ĐÁNH GIÁ CHẤT LƯỢNG DỊCH VỤ</h4>
      <h4 class="pb-2" style="color:green">{{govAgencyName(govAgencySelected)}}</h4>
    </div>
    <div class="mt-4" v-if="!loading && !detailActive" :class="visible ? 'overlayActive': ''">
      <v-layout class="wrap">
        <v-flex xs6 sm4 class="pr-3" v-for="(item, index) in govAgencyList" :key="index">
          <v-btn outline flat color="primary" class="kios-btn btn-select" @click="votingDetail(item)" style="width:100%;background-color:#b3d4fc5c!important">{{item.itemName}}</v-btn>
        </v-flex>
      </v-layout>
    </div>
    <chi-tiet-danh-gia v-if="detailActive" :administration="govAgencySelected"></chi-tiet-danh-gia>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import TinyPagination from './pagination.vue'
import ChiTietDanhGia from './ChiTietDanhGiaCLDV.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'chi-tiet-danh-gia': ChiTietDanhGia
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    govAgencyList: [],
    govAgencySelectedObj: {},
    govAgencySelected: '',
    detailActive: false
  }),
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
      if (vm.govAgencySelected) {
        vm.detailActive = true
        if (vm.govAgencyList.length === 0) {
          vm.$store.dispatch('getGovAgencyDictItem').then(function (result) {
            vm.govAgencyList = result
          }).catch(reject => {})
        }
      } else {
        vm.detailActive = false
        vm.$store.dispatch('getGovAgencyDictItem').then(function (result) {
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
    votingDetail (item) {
      var vm = this
      vm.govAgencySelected = item.itemCode
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['administration'] = item.itemCode
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
    govAgencyName (arg) {
      var vm = this
      if (arg) {
        let value = vm.govAgencyList.filter(function (item) {
          return item.itemCode.toString() === arg.toString()
        })
        if (value.length > 0) {
          return value[0].itemName
        }
      } else {
        return ''
      }
    },
    paggingData (config) {
      console.log('config', config)
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      // console.log('queryString=====', queryString)
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    }
  }
}
</script>
