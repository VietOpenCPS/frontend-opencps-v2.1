<template>
  <div class="list-thu-tuc">
    <div class="row-header">
      <div class="background-triangle-big"> <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span> </div>
    </div>
    <v-layout wrap class="mt-2">
      <v-flex xs3 class="pl-2 pr-2">
        <v-select
          class="select-border"
          :items="govAgencyList"
          v-model="govAgencySelected"
          placeholder="Chọn cơ quan"
          item-text="administrationName"
          item-value="administrationCode"
          :hide-selected="true"
          @change="changeAdministration"
        ></v-select>
      </v-flex>
      <v-flex xs3 class="pl-2 pr-2">
        <v-select
          class="select-border"
          :items="domainList"
          v-model="domainSelected"
          placeholder="Chọn lĩnh vực"
          item-text="domainName"
          item-value="domainCode"
          :hide-selected="true"
          @change="changeDomain"
        ></v-select>
      </v-flex>
      <v-flex xs3 class="pl-2 pr-2">
        <v-select
          class="select-border"
          :items="levelList"
          v-model="levelSelected"
          autocomplete
          placeholder="Chọn mức độ"
          item-text="levelName"
          item-value="level"
          :hide-selected="true"
          @change="changeLevel"
          clearable
        >
          <template slot="item" slot-scope="data">
            <template>
              <v-list-tile-content>
                <v-list-tile-title >Mức độ {{data.item.level}}</v-list-tile-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-select>
      </v-flex>
      <v-flex xs3 class="pl-2 pr-2">
        <div style="position:relative">
          <v-text-field class="input-border"
            placeholder="Nhập tên thủ tục hành chính"
            v-model="serviceNameKey"
            @keyup.enter="filterServiceinfos()"
          ></v-text-field>
          <v-icon color="primary" @click="filterServiceinfos()" class="hover-pointer" style="position:absolute;top:28px;right:10px">search</v-icon>
        </div>
      </v-flex>
    </v-layout>
    <div class="mt-4" v-if="true">
      <v-data-table
        :headers="headers"
        :items="serviceInfoList"
        hide-actions
        class="table-bordered btn--block my-0"
      >
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" @click="viewDetail(props.item)">
            <td class="text-xs-center">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{thutucPage * 15 - 15 + props.index + 1}}</span><br>
              </div>
            </td>
            <td class="text-xs-left" >
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.serviceName}}</span>
              </div>
            </td>
            <td class="text-xs-left">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>
                  <span>{{props.item.domainName}}</span>
                </span>
              </div>
            </td>
            <td class="text-xs-center">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>
                  <v-chip class="mx-0 my-0" label :color="getColor(props.item.maxLevel)" text-color="white" style="height:25px">
                    Mức độ {{props.item.maxLevel}}
                  </v-chip>
                  <!-- <span :style="getColor(props.item.maxLevel)">Mức độ {{props.item.maxLevel}}</span> -->
                </span>
              </div>
            </td>
            <td class="text-xs-center">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span v-if="props.item.maxLevel === 3">
                  Nộp hồ sơ
                </span>
                <span v-else>
                  Xem hướng dẫn
                </span>
              </div>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center mt-2">
            Không có thủ tục nào được tìm thấy
          </div>
        </template>
      </v-data-table>
      <div v-if="totalThuTuc > 10" class="text-xs-right layout wrap" style="position: relative;">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import support from '../store/support.json'
import TinyPagination from './Pagination.vue'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    serviceInfoList: [],
    totalThuTuc: 0,
    thutucPage: 1,
    govAgencySelected: {},
    domainListCurrent: [],
    domainSelected: {},
    levelSelected: {},
    loading: false,
    headers: [
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
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    govAgencyList () {
      return this.$store.getters.getAgencyList
    },
    domainList () {
      return this.$store.getters.getDomainList
    },
    levelList () {
      return this.$store.getters.getLevelList
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      var vm = this
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
      vm.doLoadingThuTuc()
    }
  },
  methods: {
    changeAdministration () {
      var vm = this
      setTimeout(function () {
        // if (vm.govAgencySelected) {
        //   vm.domainListCurrent = vm.domainList.filter(function (itemLinhVuc) {
        //     return (itemLinhVuc.domainCode.indexOf(vm.govAgencySelected) === 0)
        //   })
        // } else {
        //   vm.domainListCurrent = vm.domainList
        // }
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = vm.govAgencySelected
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        router.push({
          path: '/thu-tuc-hanh-chinh' + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeDomain () {
      var vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = vm.domainSelected
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        router.push({
          path: '/thu-tuc-hanh-chinh' + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeLevel () {
      var vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['level'] = vm.levelSelected
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        router.push({
          path: '/thu-tuc-hanh-chinh' + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    doLoadingThuTuc () {
      var vm = this
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = router.history.current.query
      var filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        administration: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : '',
        keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : '',
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.serviceInfoList = result.data
          vm.thutucPage = Number(currentQuery.page) ? Number(currentQuery.page) : 1
          vm.totalThuTuc = result.total
        } else {
          vm.totalThuTuc = 0
          vm.serviceInfoList = []
        }
        vm.serviceItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoList = []
        vm.totalThuTuc = 0
        vm.thutucPage = 1
      })
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
    viewDetail (item) {
      var vm = this
    },
    getColor (level) {
      if (level === 2) {
        return 'green'
      } else if (level === 3) {
        return 'orange darken-1'
      } else if (level === 4) {
        return 'red'
      }
    }
  }
}
</script>
