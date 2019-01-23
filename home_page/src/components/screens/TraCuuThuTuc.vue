<template>
  <v-card flat class="py-0">
    <h3 class="pt-5 ml-2">
      <span style="color:#065694">TRA CỨU THỦ TỤC HÀNH CHÍNH </span>
    </h3>
    <v-layout wrap class="mt-2">
      <v-flex xs12 sm4 class="pl-2 pr-2">
        <v-select
          box
          :items="govAgencyList"
          v-model="govAgencySelected"
          placeholder="Chọn cơ quan"
          item-text="administrationName"
          item-value="administrationCode"
          :hide-selected="true"
          @change="changeAdministration"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 class="pl-2 pr-2">
        <v-select
          box
          :items="listLinhVuc"
          v-model="linhVucSelected"
          placeholder="Chọn lĩnh vực"
          item-text="domainName"
          item-value="domainCode"
          :hide-selected="true"
          @change="changeDomain"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 class="pl-2 pr-2">
        <v-text-field
          label="Tên thủ tục"
          v-model="serviceNameKey"
          box
          append-icon="search"
          @keyup.enter="filterServiceinfos('keyword')"
          @click:append="filterServiceinfos('keyword')"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <!-- danh sách cơ quan -->
    <div class="mt-4" v-if="!loading && !activeDetailService && !showListThuTuc && govAgencyList && !govAgencySelected && govAgencyList.length > 0" >
      <v-layout class="wrap">
        <v-flex xs12 sm4 class="pr-3" v-for="(item, index) in govAgencyList" :key="index">
          <v-btn outline flat color="primary" class="btn-select" @click="filterAdministration(item)" style="width:100%;background-color:#b3d4fc5c!important">{{item.administrationName}}</v-btn>
        </v-flex>
      </v-layout>
    </div>
    <div class="mx-2" v-if="!loading && !activeDetailService && !showListThuTuc && showListLinhVuc">
      <!-- danh sách lĩnh vực -->
      <v-card class="">
        <v-list class="py-0">
          <template v-for="(item, index) in listLinhVuc" >
            <v-list-tile :key="index" @click="filterDomain(item)" style="border-bottom:1px solid #dedede">
              <v-list-tile-content>
                <v-list-tile-title v-html="item.domainName"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
      <div v-if="totalPaggingLinhVuc > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="totalPaggingLinhVuc" :page="pageListLinhVuc" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </div>
    <!-- danh sách thủ tục -->
    <v-container fluid grid-list-sm class="px-2" v-if="!loading && !activeDetailService && showListThuTuc && !showListLinhVuc">
      <v-layout wrap>
        <v-flex xs12 sm6 v-for="(item, index) in listThuTuc" :key="index" class="mb-2">
          <v-card flat color="#e9e9ff" width="100%" height="100%">
            <v-card-title primary-title>
              <v-flex class="xs12 sm12 pb-1">
                <span class="pr-2 text-bold">Tên thủ tục: </span>
                <span class="pl-0"> {{item.serviceName}}</span>
              </v-flex>
              <v-flex class="xs12 sm12 pb-1">
                <span class="pr-2 text-bold">Lĩnh vực: </span>
                <span class="pl-0"> {{item.domainName}}</span>
              </v-flex>
              <v-flex class="xs12 sm12 pb-1">
                <span class="pr-2 text-bold">Mức độ: </span>
                <span :style="'color:'+getColor(item.maxLevel)">
                  Mức độ {{item.maxLevel}}
                </span>
              </v-flex>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="primary" @click="viewDetail(item)">
                <v-icon size="18">near_me</v-icon> &nbsp;
                Xem chi tiết
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <div v-if="totalPaggingThuTuc > 10" class="text-xs-center layout wrap mt-2" style="position: relative;">
        <div class="flex pagging-table px-2">
          <tiny-pagination :total="totalPaggingThuTuc" :page="pageListThuTuc" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </v-container>
    <!-- chi tiết thủ tục -->
    <div class="mt-4" v-if="!loading && activeDetailService">
      <chi-tiet-thu-tuc :index="serviceId"></chi-tiet-thu-tuc>
    </div>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import TinyPagination from './pagination.vue'
import ChiTietThuTuc from './ChiTietThuTuc.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination,
    'chi-tiet-thu-tuc': ChiTietThuTuc
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    serviceNameKey: '',
    listLinhVuc: [],
    linhVucSelected: '',
    listMucDo: [],
    levelSelected: '',
    listThuTuc: [],
    govAgencyList: [],
    govAgencySelected: {},
    serviceItemTotal: 0,
    pageListLinhVuc: 1,
    pageListThuTuc: 1,
    totalPaggingLinhVuc: 0,
    totalPaggingThuTuc: 0,
    serviceId: '',
    headersTable: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lĩnh vực',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mức độ',
        align: 'center',
        sortable: false
      }
    ],
    showListThuTuc: false,
    showListLinhVuc: false
  }),
  computed: {
    activeDetailService () {
      return this.$store.getters.getActiveDetailService
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.$store.commit('setFullScreen', false)
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.loading = true
      vm.listThuTuc = []
      vm.$store.dispatch('getGovAgency').then(function (result) {
        vm.loading = false
        vm.govAgencyList = result
        if (vm.govAgencyList.length > 0) {
          vm.serviceNameKey = newQuery.hasOwnProperty('keyword') ? newQuery.keyword : ''
          vm.levelSelected = newQuery.hasOwnProperty('level') ? Number(newQuery.level) : ''
          vm.linhVucSelected = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
          vm.govAgencySelected = newQuery.hasOwnProperty('administration') ? newQuery.administration : ''
          if (vm.govAgencySelected) {
            vm.loading = true
            let filter = {
              page: newQuery.page ? newQuery.page : 1,
              administrationCode: vm.govAgencySelected
            }
            vm.$store.dispatch('getDomainListsPublic', filter).then(function (result) {
              vm.loading = false
              if (result.data) {
                vm.listLinhVuc = result.data
                vm.totalPaggingLinhVuc = Number(result.total)
                vm.showListLinhVuc = true
              } else {
                vm.listLinhVuc = []
                vm.totalPaggingLinhVuc = 0
              }
              vm.pageListLinhVuc = Number(newQuery.page) ? Number(newQuery.page) : 1
              if (vm.govAgencySelected && vm.linhVucSelected) {
                vm.doLoadingThuTuc()
                vm.showListLinhVuc = false
                vm.showListThuTuc = true
              }
            }).catch(reject => {
              vm.listLinhVuc = []
              vm.totalPaggingLinhVuc = 0
              vm.loading = false
            })
          }
        }
      }).catch(reject => {
        vm.loading = false
      })
      // vm.$store.dispatch('getLevelLists').then(function (result) {
      //   vm.listMucDo = result
      // })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.govAgencySelected = currentQuery.hasOwnProperty('administration') ? currentQuery.administration : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') ? Number(currentQuery.level) : ''
      vm.linhVucSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      if (vm.govAgencySelected && !vm.linhVucSelected) {
        vm.loading = true
        let filter = {
          page: currentQuery.page ? currentQuery.page : 1,
          administrationCode: vm.govAgencySelected
        }
        vm.$store.dispatch('getDomainListsPublic', filter).then(function (result) {
          vm.loading = false
          if (result.data) {
            vm.listLinhVuc = result.data
            vm.totalPaggingLinhVuc = Number(result.total)
            vm.showListThuTuc = false
            vm.showListLinhVuc = true
          } else {
            vm.listLinhVuc = []
            vm.totalPaggingLinhVuc = 0
          }
          vm.pageListLinhVuc = Number(currentQuery.page) ? Number(currentQuery.page) : 1
        }).catch(reject => {
          vm.loading = false
          vm.listLinhVuc = []
          vm.totalPaggingLinhVuc = 0
        })
      }
      if (vm.linhVucSelected || vm.serviceNameKey !== '') {
        vm.doLoadingThuTuc()
        vm.showListLinhVuc = false
        vm.showListThuTuc = true
      }
      if (currentQuery.hasOwnProperty('detail')) {
        vm.$store.commit('setActiveDetailService', true)
      } else {
        vm.$store.commit('setActiveDetailService', false)
      }
    }
  },
  methods: {
    filterServiceinfos (type) {
      var vm = this
      if (type === 'keyword' && vm.serviceNameKey !== '') {
        vm.showListThuTuc = true
      }
      vm.visible = false
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      if (newQuery.hasOwnProperty('detail')) {
        newQuery['detail'] = ''
      }
      newQuery['keyword'] = vm.serviceNameKey ? vm.serviceNameKey : ''
      newQuery['level'] = vm.levelSelected ? vm.levelSelected : ''
      newQuery['domain'] = vm.linhVucSelected ? vm.linhVucSelected : ''
      newQuery['administration'] = vm.govAgencySelected ? vm.govAgencySelected : ''
      newQuery['page'] = 1
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
    doLoadingThuTuc () {
      var vm = this
      vm.listThuTuc = []
      vm.loading = true
      let currentQuery =vm.$router.history.current.query
      var filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        administration: currentQuery.hasOwnProperty('administration') ? currentQuery.administration : vm.govAgencySelected,
        keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : vm.levelSelected,
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.linhVucSelected
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.listThuTuc = result.data
          vm.pageListThuTuc = Number(currentQuery.page) ? Number(currentQuery.page) : 1
          vm.totalPaggingThuTuc = result.total
        } else {
          vm.totalPaggingThuTuc = 0
          vm.listThuTuc = []
        }
        vm.serviceItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.listThuTuc = []
        vm.totalPaggingThuTuc = 0
        vm.serviceItemTotal = 0
      })
    },
    changeAdministration () {
      var vm = this
      vm.showListThuTuc = false
      vm.showListLinhVuc = true
      vm.listLinhVuc = []
      vm.linhVucSelected = ''
      vm.levelSelected = ''
      vm.visible = false
      let current = vm.$router.history.current
      let newQuery = {
        administration: ''
      }
      let queryString = '?'
      setTimeout(function () {
        newQuery['administration'] = vm.govAgencySelected ? vm.govAgencySelected : ''
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
      }, 200)
    },
    filterAdministration (item) {
      var vm = this
      vm.govAgencySelected = item.administrationCode
      vm.changeAdministration()
    },
    changeDomain () {
      var vm = this
      vm.showListThuTuc = true
      setTimeout(function () {
        if (vm.linhVucSelected) {
          vm.filterServiceinfos()
        }
      }, 200)
    },
    filterDomain (item) {
      var vm = this
      vm.linhVucSelected = item.domainCode
      vm.changeDomain()
    },
    changeLevel () {
      var vm = this
      setTimeout(function () {
        vm.filterServiceinfos()
      }, 200)
    },
    viewDetail (item) {
      var vm = this
      vm.serviceId = item.serviceInfoId
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      if (newQuery.hasOwnProperty('detail')) {
        newQuery['detail'] = ''
      }
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += '&detail=true'
      vm.$router.push({
        path: current.path + queryString
      })
    },
    paggingData (config) {
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
    },
    getColor (level) {
      if (level === 2) {
        return 'green'
      } else if (level === 3) {
        return 'orange'
      } else if (level === 4) {
        return 'red'
      }
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
          vm.filterServiceinfos()
        })
      }, 300)
    }
  }
}
</script>
