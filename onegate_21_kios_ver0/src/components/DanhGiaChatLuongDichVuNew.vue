<template>
  <div class="px-2 py-0 kios-item">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div class="text-xs-center" v-if="detailActive">
      <h4 class="py-2" style="color:#065694;font-size: 1.2em !important;">ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG</h4>
    </div>
    <chi-tiet-danh-gia v-if="detailActive" :administration="govAgencySelected"></chi-tiet-danh-gia>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import TinyPagination from './pagination.vue'
import ChiTietDanhGia from './ChiTietDanhGiaCLDVNew.vue'
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
    groupIds () {
      return this.$store.getters.getGroupid
    },
    groupIdArr () {
      console.log('groupIds', this.getGroupIdArr(this.groupIds))
      return this.getGroupIdArr(this.groupIds)
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
      //
      // if (vm.govAgencySelected) {
      //   vm.detailActive = true
      //   if (vm.govAgencyList.length === 0) {
      //     vm.$store.dispatch('getGovAgency').then(function (result) {
      //       vm.govAgencyList = result
      //     }).catch(reject => {})
      //   }
      // } else {
      //   vm.detailActive = false
      //   vm.$store.dispatch('getGovAgency').then(function (result) {
      //     vm.govAgencyList = result
      //   }).catch(reject => {})
      // }
      //
      let groupIds = vm.groupIdArr.length
    //   if (vm.govAgencySelected) {
    //     vm.detailActive = true
    //   } else {
    //     vm.detailActive = false
    //   }
        vm.detailActive = true
      if (groupIds > 0) {
        let count = 0
        for (var key = 0; key < groupIds; key++) {
          let filter = {
            groupId: vm.groupIdArr[key]
          }
          console.log('filter', filter)
          vm.$store.dispatch('getGovAgency', filter).then(function (result) {
            count += 1
            result[0] = Object.assign(result[0], {groupId: vm.groupIdArr[key]})
            vm.govAgencyList = vm.govAgencyList.concat(result)
            if (count === groupIds) {
              if (vm.govAgencyList.length > 0) {
                vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
                if (groupIds === 1) {
                  vm.govAgencySelected = vm.govAgencyList[0]['administrationCode']
                  vm.detailActive = true
                }
              }
            }
          }).catch(reject => {
            if (count === groupIds) {
              if (vm.govAgencyList.length > 0) {
                vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
                if (groupIds === 1) {
                  vm.govAgencySelected = vm.govAgencyList[0]['administrationCode']
                  vm.detailActive = true
                }
              }
            }
          })
        }
      } else {
        let filter = {
          groupId: ''
        }
        vm.$store.dispatch('getGovAgency', filter).then(function (result) {
          vm.govAgencyList = result
          if (vm.govAgencyList.length > 0) {
            vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
            if (vm.govAgencyList.length === 1) {
              vm.govAgencySelected = vm.govAgencyList[0]['administrationCode']
              vm.detailActive = true
            }
          }
        }).catch(reject => {
        })
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.govAgencySelected = currentQuery.hasOwnProperty('administration') ? currentQuery.administration : ''
    //   if (vm.govAgencySelected) {
    //     vm.detailActive = true
    //   } else {
    //     vm.detailActive = false
    //   }
    vm.detailActive = true
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
      vm.govAgencySelected = item.administrationCode
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['administration'] = item.administrationCode
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
          return item.administrationCode.toString() === arg.toString()
        })
        if (value.length > 0) {
          return value[0].administrationName
        }
      } else {
        return ''
      }
    },
    getGroupIdArr (groupIds) {
      if (groupIds) {
        return groupIds.split(',')
      } else {
        return []
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
