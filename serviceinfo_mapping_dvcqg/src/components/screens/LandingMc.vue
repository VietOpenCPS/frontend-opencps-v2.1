<template>
  <div>
    <!-- layout for desktop -->
    <div class="list-thu-tuc" v-if="!isMobile">
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span>ĐỒNG BỘ THỦ TỤC HÀNH CHÍNH TỪ CỔNG DỊCH VỤ CÔNG</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <v-text-field
              v-model="serviceNameKey"
              placeholder="Tìm kiếm theo tên thủ tục, mã thủ tục ..."
              solo
              @keyup.enter="filterServiceName"
            ></v-text-field>
          </div>
          <div class="flex text-right" :style="serviceNameKey ? 'margin-left: auto;max-width: 90px;' : 'margin-left: auto;max-width: 50px;'">
            <v-btn icon class="my-0 mx-0" v-on:click.native="clearKeyword" v-if="serviceNameKey">
              <v-icon size="16">clear</v-icon>
            </v-btn>
            <v-btn icon class="my-0 mx-2" v-on:click.native="filterServiceName">
              <v-icon size="16">search</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <v-layout wrap class="white py-2" v-if="domainList.length > 1">
        <v-flex class="xs12 px-2">
          <v-autocomplete
            class="select-border"
            :items="domainList"
            v-model="domainSelected"
            label="Chọn lĩnh vực"
            item-text="domainName"
            item-value="domainCode"
            :hide-selected="true"
            @change="changeDomain"
            box
            :readonly="loading"
          ></v-autocomplete>
        </v-flex>
        
      </v-layout>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="service__info__table">
        <v-flex class="xs12 mb-2 right">
          <v-btn color="primary" dark
            v-on:click.native="syncServiceinfoCongDvc"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon size="18">sync</v-icon> &nbsp; Đồng bộ
          </v-btn>
        </v-flex>
        <v-data-table
          :headers="headers"
          :items="serviceInfoList"
          v-model="selected"
          item-key="serviceInfoId"
          select-all
          hide-actions
          class="table-landing table-bordered"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th width="32px" >
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  primary
                  hide-details
                  @click.native="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="header['class'] ? header['class'] : ''"
              >
                <span>{{ header.text }}</span>
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}">
              <td width="32px">
                <v-checkbox
                  v-model="props.selected"
                  primary
                  hide-details
                  color="primary"
                ></v-checkbox>
              </td>
              <td class="text-xs-center" width="50px">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{thutucPage * 15 - 15 + props.index + 1}}</span><br>
                </div>
              </td>
              <td class="text-xs-left" width="175px">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span class="text-bold">{{props.item.serviceCode}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceName}}</span>
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
        <div class="text-xs-right layout wrap mt-2" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    dialog_createDossier: false,
    dialogVerifycation: false,
    dialogLogin: false,
    valid: false,
    userName: '',
    passWord: '',
    loadingSync: false,
    serviceInfoList: [],
    totalThuTuc: 0,
    thutucPage: 1,
    govAgencyList: [],
    govAgencySelected: {},
    govAgencyThucHienSelected: {},
    domainList: [],
    domainSelected: {},
    levelSelected: {},
    serviceNameKey: '',
    serviceDetail: '',
    dialogGuide: false,
    loading: true,
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã thủ tục',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên thủ tục',
        align: 'center',
        sortable: false
      }
    ],
    isLogin: false,
    verificationApplicantCreateDossier: false,
    selected: [],
    hasCoQuanThucHien: false,
    configUrl: '',
    syncing: false,
    mappingIdArray: {}
  }),
  computed: {
  },
  created () {
    let vm = this
    // 
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') && currentQuery.keyword ? currentQuery.keyword : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      let filterDomain = {
        agencyCode: ''
      }
      vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
        vm.domainList = result
      })
      vm.doLoadingThuTuc()
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (!vm.domainList || vm.domainList.length === 0) {
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainList = result
        })
      }
      vm.govAgencySelected = vm.domainSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.doLoadingThuTuc()
    }
  },
  methods: {
    toggleAll () {
      let vm = this
      if (vm.selected.length) {
        vm.selected = []
      } else {
        vm.selected = vm.serviceInfoList
      }
    },
    filterServiceName () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['keyword'] = vm.serviceNameKey
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
    },
    clearKeyword () {
      let vm = this
      vm.serviceNameKey = ''
      vm.filterServiceName()
    },
    changeDomain () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = vm.domainSelected
        newQuery['keyword'] = ''
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
    },
    doLoadingThuTuc () {
      let vm = this
      vm.selected = []
      vm.mappingIdArray = {}
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        keyword: currentQuery.keyword ? currentQuery.keyword : '',
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      }
      vm.$store.dispatch('getServiceMcLists', filter).then(function (result) {
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
    syncServiceinfoCongDvc() {
      let vm = this
      console.log('selected', vm.selected)
      if (vm.selected.length === 0) {
        alert('Chọn thủ tục đồng bộ')
      } else {
        alert('HELLO CORONA VIRUS')
      }
      // let filter = {
      //   serviceCode: item.serviceCode
      // }
      // vm.$store.dispatch('syncServiceinfoCongDvc', filter).then(function (result) {
      // }).catch(function() {
      //   console.log('sync cổng dịch vụ công thất bại')
      // })
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
