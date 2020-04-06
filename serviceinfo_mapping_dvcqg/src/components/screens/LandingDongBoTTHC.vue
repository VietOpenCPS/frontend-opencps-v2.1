<template>
  <div>
    <!-- layout for desktop -->
    <!-- Đồng bộ thủ tục hành chính từ DVCQG-->
    <div class="list-thu-tuc" v-if="!isMobile" >
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span>ĐỒNG BỘ THÔNG TIN TTHC DVCQG</span>
        </div>
      </div>
      <v-layout wrap class="white py-2">
        <v-flex class="xs12 sm6 px-2">
          <v-text-field
            class="select-border"
            label="Tên thủ tục"
            v-model="tenThuTucModel"
            box
          ></v-text-field>
        </v-flex> 
        <v-flex class="xs12 sm6 px-2">
          <v-autocomplete
            class="select-border"
            :items="listDomain"
            v-model="domainSelected"
            label="Lĩnh vực"
            item-text="domainName"
            item-value="domainCode"
            :hide-selected="true"
            @change="changeDomain"
            box
            :readonly="loading"
            clearable
          ></v-autocomplete>
        </v-flex>
   
      </v-layout>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="service__info__table">
        <v-data-table
            :headers="headers"
            :items="serviceInfoView"
            hide-actions
            class="table-landing table-bordered"
        >
            <template slot="headers" slot-scope="props">
                <thead>
                <tr>
                    <th v-for="header in props.headers" :key="header.name">
                        <span>{{header.text}}</span>
                    </th>
                    <th>
                        <v-btn color="primary" :loading="loadingSyncAll" @click="syncServiceInfoAll()">Đồng bộ tất cả</v-btn>
                    </th>
                </tr>
                </thead>
            </template>
            <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                <td class="text-xs-center">
                    <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                    <span>{{props.index + 1}}</span><br>
                    </div>
                </td>
                <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-layout wrap>
                            <v-flex xs12>
                                <span class="text-bold">{{props.item.serviceCode}}</span> - <span>{{props.item.serviceName}}</span>
                            </v-flex>
                        </v-layout>
                    </div>
                </td>
                <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-layout align-center wrap>
                            <v-flex xs12>
                                <span class="text-bold">{{props.item.serviceCodeDVCQG}}</span> - <span>{{props.item.serviceNameDVCQG}}</span>
                            </v-flex>
                        </v-layout>
                    </div>
                </td>
                <td class="text-xs-right">
                    <content-placeholders v-if="loading">
                    <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-btn color="primary" @click="syncServiceinfo(props.item)">Đồng bộ</v-btn>
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
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    loadingSyncAll: false,
    loading: true,
    dialogMapping: false,
    loadingMapping: false,
    tenThuTucModel: '',
    domainSelected: '',
    listDomain: [],
    listTimKiemTheo: [{text: 'Tìm kiếm theo TTHC đơn vị', value: 'DonVi'},{text: 'Tìm kiếm theo TTHC DVC QG', value: 'DVCQG'}],
    serviceInfo: [],
    serviceInfoView: [],
    serviceInfoListDVCQG: [],
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'TTHC tại đơn vị',
        align: 'center',
        sortable: false
      },
      {
        text: 'TTHC tại DVCQG',
        align: 'center',
        sortable: false
      }
    ],
    listMappingView: [],
    listMapping: [],
    pageMapping: 1,
    totalThuTuc: 0,
    thutucPage: 1,
    pageSize: 20,
    serviceSelect: {}
  }),
  computed: {

  },
  created () {
    let vm = this
    // 
    vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.listDomain = result
        })
        vm.domainSelected = newQuery.hasOwnProperty('domain') && newQuery.domain ? newQuery.domain : '' 
        newQuery['domain'] = newQuery.hasOwnProperty('domain') && newQuery.domain ? newQuery.domain : ''
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
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = vm.$router.history.current.query
        vm.doLoadingThuTuc()
    },
    tenThuTucModel (val) {
      let vm = this
      vm.thutucPage = 1
      if(val){
        vm.serviceInfoView = vm.serviceInfo.filter(e => e.serviceName.search(val) >= 0 ).slice(0, vm.pageSize)
      }  else{
        vm.serviceInfoView = vm.serviceInfo.slice(0,vm.pageSize)
      }
    }
  },
  methods: {
    changeDomain () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['domain'] = vm.domainSelected
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
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
          mapping: true
      }
      vm.thutucPage = 1
      vm.$store.dispatch('getTTHCDonVi', filter).then(function (result) {
        vm.loading = false
        vm.serviceInfo = result.data
        vm.totalThuTuc = result.total
        vm.serviceInfoView = vm.serviceInfo.slice(0, vm.pageSize)

      }).catch(reject => {
        vm.loading = false
        vm.serviceInfo = []
        vm.totalThuTuc = 0
        vm.serviceInfoView = []
      })
    },
    paggingData (config) {
      let vm = this
      let start = config.page * vm.pageSize - vm.pageSize
      let end = config.page * vm.pageSize
      vm.thutucPage = config.page
      vm.serviceInfoView = vm.serviceInfo.slice(start,end)      
    },
    syncServiceinfo (item) {
        let vm = this
        let filter = {
            serviceCodes: item.serviceCode,
            type: "sync"
        }
        vm.$store.dispatch('syncServiceinfoNew', filter).then(function (result) {
          toastr.clear()
          toastr.success('Đồng bộ thành công')
          vm.doLoadingThuTuc()
            // vm.doLoadingThuTuc()
        }).catch(function() {
            toastr.error('Đồng bộ thất bại')
       
            // vm.doLoadingThuTuc()
        })
    },
    syncServiceInfoAll () {
        let vm = this
        let filter = {
            serviceCodes: "",
            type: "sync"
        }
        vm.loadingSyncAll = true
        vm.$store.dispatch('syncServiceinfoNew', filter).then(function (result) {
            toastr.clear()
            toastr.success('Đồng bộ thành công')
            vm.loadingSyncAll = false
            vm.doLoadingThuTuc()
            // vm.doLoadingThuTuc()
        }).catch(function() {
            toastr.error('Đồng bộ thất bại')
            vm.loadingSyncAll = false
            // vm.doLoadingThuTuc()
        })
    }
  }
}
</script>
