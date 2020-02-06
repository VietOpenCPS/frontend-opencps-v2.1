<template>
  <div>
    <!-- layout for desktop -->
    <div class="list-thu-tuc" v-if="!isMobile">
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span>ĐỒNG BỘ THỦ TỤC HÀNH CHÍNH DỊCH VỤ CÔNG QUỐC GIA</span>
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
      <v-layout wrap class="white py-2">
        <v-flex class="xs12 sm6 px-2">
          <v-autocomplete
            class="select-border"
            :items="govAgencyList"
            v-model="govAgencySelected"
            label="Chọn cơ quan quản lý"
            item-text="administrationName"
            item-value="administrationCode"
            :hide-selected="true"
            @change="changeAdministration"
            box
            :readonly="loading"
          ></v-autocomplete>
        </v-flex>
        <v-flex class="xs12 sm6 px-2">
          <v-autocomplete
            class="select-border"
            :items="domainListCurrent"
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
            v-on:click.native="syncAll"
            :loading="loading"
            :disabled="loading"
          >
          <v-icon size="18">sync</v-icon> &nbsp; Đồng bộ tất cả thủ tục đã mapping
          </v-btn>
        </v-flex>
        <v-data-table
          :headers="headers"
          :items="serviceInfoList"
          hide-actions
          class="table-landing table-bordered"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}">
              <td class="text-xs-center">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{thutucPage * 15 - 15 + props.index + 1}}</span><br>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span class="text-bold">{{props.item.serviceCode}}</span> - <span>{{props.item.serviceName}}</span>
                </div>
              </td>
              <td class="text-xs-left">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <div v-for="(itemDvc, index1) in props.item.similarity" :key="index1" class="mb-2" style="position: relative;">
                    <v-tooltip top style="display: inline-block;width: 25px;position: absolute;top: -2px;">
                      <v-checkbox
                        slot="activator"
                        v-model="itemDvc.mapped"
                        primary
                        hide-details
                        color="primary"
                        :disabled="loadingSync"
                        @change="doActionMapping(props.item, props.index, itemDvc, index1)"
                      ></v-checkbox>
                      <span v-if="itemDvc.mapped">Chọn để hủy mapping</span>
                      <span v-else>Chọn để mapping</span>
                    </v-tooltip>
                    <v-tooltip top v-if="itemDvc.mapped" style="display: inline-block;width: 25px;position: absolute;top: -5px;left:15px">
                      <v-btn slot="activator" class="mx-0 my-0" flat icon color="primary" :disabled="loadingSync"
                      @click="syncServiceinfo(props.item, props.index, itemDvc, index1)">
                        <v-icon size="18">sync</v-icon>
                      </v-btn>
                      <span>Đồng bộ thủ tục này</span>
                    </v-tooltip>
                    <span class="text-bold" :style="itemDvc.mapped ? 'margin-left: 50px' : 'margin-left: 24px'">{{itemDvc.serviceCodeDVCQG}}</span> - <span>{{itemDvc.serviceNameDVCQG}}</span>
                  </div>
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
    domainListCurrent: [],
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
        text: 'Thủ tục hành chính',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thủ tục hành chính Dịch vụ công quốc gia',
        align: 'center',
        sortable: false
      }
    ],
    isLogin: false,
    verificationApplicantCreateDossier: false,
    serviceSelected: '',
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
      vm.$store.dispatch('getGovAgency').then(function (result) {
        vm.govAgencyList = result
        vm.govAgencySelected = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyList[0]['administrationCode']
        let filterDomain = {
          agencyCode: vm.govAgencySelected
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
          if (!currentQuery.hasOwnProperty('agency') && !vm.govAgencySelected) {
            vm.domainList = result
          }
        })
        vm.doLoadingThuTuc()
      }).catch(function(){
      })
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
      if ((currentQuery.hasOwnProperty('agency') && currentQuery['agency'])) {
        let filterDomain = {
          agencyCode: currentQuery['agency'] ? currentQuery['agency'] : ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      } else {
        console.log('125555123', vm.domainList)
        if (!vm.domainList || vm.domainList.length === 0) {
          let filterDomain = {
            agencyCode: ''
          }
          vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
            vm.domainList = result
            vm.domainListCurrent = vm.domainList
          })
        } else {
          vm.domainListCurrent = vm.domainList
        }
      }
      vm.govAgencySelected = vm.domainSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.doLoadingThuTuc()
    }
  },
  methods: {
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
    changeAdministration () {
      var vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = vm.govAgencySelected
        newQuery['domain'] = ''
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
      vm.mappingIdArray = {}
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        keyword: currentQuery.keyword ? currentQuery.keyword : '',
        agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencySelected,
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
    doActionMapping(item, indexDvc, itemDvcqg, indexDvcqg) {
      console.log(item, indexDvc, itemDvcqg, indexDvcqg)
      let vm = this
      setTimeout(function() {
        if (itemDvcqg['mapped']) {
          vm.mappingDvcqgCongMotCua(item, indexDvc, itemDvcqg, indexDvcqg)
        } else {
          // if (!itemDvcqg['serviceInfoMappingId']) {
          //   itemDvcqg.serviceInfoMappingId = vm.mappingIdArray[item['serviceInfoId']]
          // }
          vm.removeMapping(item, indexDvc, itemDvcqg, indexDvcqg)
        }
        vm.loadingSync = true
      }, 300)
    },
    mappingDvcqgCongMotCua (item, indexDvc, itemDvcqg, indexDvcqg) {
      let vm = this
      let removeBeforeMapping = false
      let itemRemoveBefore = ''
      vm.syncing = false
      let filter = {
        serviceCode: item.serviceCode,
        serviceCodeDVCQG: itemDvcqg.serviceCodeDVCQG
      }
      for (let i = 0; i < vm.serviceInfoList[indexDvc]['similarity'].length; i++) {
        if (String(i) !== String(indexDvcqg) && vm.serviceInfoList[indexDvc]['similarity'][i]['mapped']) {
          vm.serviceInfoList[indexDvc]['similarity'][i]['mapped'] = false
          itemRemoveBefore = vm.serviceInfoList[indexDvc]['similarity'][i]
          vm.syncing = {
            item: item,
            indexDvc: indexDvc,
            itemDvcqg: itemDvcqg,
            index: indexDvcqg
          }
          removeBeforeMapping = true
          break
        }
      }
      console.log('filterMapping', filter)
      if (!removeBeforeMapping) {
        vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
          vm.mappingIdArray[item['serviceInfoId']] = result.serviceInfoMappingId
          toastr.success('Mapping thủ tục thành công')
          vm.loadingSync = false
        }).catch(function() {
          toastr.error('Mapping thủ tục thất bại')
          vm.loadingSync = false
        })
      } else {
        let filter2 = {
          serviceInfoId: itemRemoveBefore.serviceInfoMappingId ? itemRemoveBefore.serviceInfoMappingId : vm.mappingIdArray[item['serviceInfoId']]
        }
        console.log('itemRemoveBefore', itemRemoveBefore, filter2)
        vm.$store.dispatch('removeMappingDvcqg', filter2).then(function (result) {
          vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
            vm.mappingIdArray[item['serviceInfoId']] = result.serviceInfoMappingId
            toastr.success('Mapping thủ tục thành công')
            vm.loadingSync = false
          }).catch(function() {
            toastr.error('Mapping thủ tục thất bại')
            vm.loadingSync = false
          })
        }).catch(function() {
          vm.loadingSync = false
        })
      }
      
    },
    mappingDvcqgCongDvc (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        serviceCode: item.serviceCode,
        serviceCodeDVCQG: itemDvcqg.serviceCodeDVCQG
      }
      vm.$store.dispatch('mappingDvcqgCongDvc', filter).then(function (result) {
        vm.syncServiceinfoCongDvc(item, indexDvc, itemDvcqg, index)
      }).catch(function() {
        console.log('mapping cổng dịch vụ công thất bại')
      })
    },
    removeMapping (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        serviceInfoId: vm.mappingIdArray[item['serviceInfoId']] ? vm.mappingIdArray[item['serviceInfoId']] : itemDvcqg.serviceInfoMappingId
      }
      vm.$store.dispatch('removeMappingDvcqg', filter).then(function (result) {
        if (!vm.syncing) {
          toastr.clear()
          toastr.success('Hủy đồng bộ thành công')
          vm.loadingSync = false
        } else {
          let filter1 = {
            serviceCode: item.serviceCode,
            serviceCodeDVCQG: itemDvcqg.serviceCodeDVCQG
          }
          vm.$store.dispatch('mappingDvcqg', filter1).then(function (result) {
            vm.syncServiceinfo(vm.syncing.item, vm.syncing.indexDvc, vm.syncing.itemDvcqg, vm.syncing.index)
          }).catch(function() {
            toastr.error('Đồng bộ thất bại')
            vm.doLoadingThuTuc()
          })
        }
        // vm.removeMappingCongDvc(item, indexDvc, itemDvcqg, index)
      }).catch(function() {
        if (!vm.syncing) {
          toastr.error('Hủy đồng bộ thất bại')
          vm.loadingSync = false
          vm.doLoadingThuTuc()
        }
      })
    },
    removeMappingCongDvc (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        serviceInfoId: itemDvcqg.serviceInfoMappingId
      }
      vm.$store.dispatch('removeMappingDvcqgCongDvc', filter).then(function (result) {
      }).catch(function() {
        console.log('remove mapping cổng dịch vụ công thất bại')
      })
    },
    syncServiceinfo(item, indexDvc, itemDvcqg, index) {
      let vm = this
      vm.loadingSync = true
      let filter = {
        serviceCode: item.serviceCode
      }
      vm.$store.dispatch('syncServiceinfo', filter).then(function (result) {
        toastr.clear()
        toastr.success('Đồng bộ thành công')
        vm.loadingSync = false
        // vm.doLoadingThuTuc()
      }).catch(function() {
        toastr.error('Đồng bộ thất bại')
        vm.loadingSync = false
        // vm.doLoadingThuTuc()
      })
    },
    syncServiceinfoCongDvc(item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        serviceCode: item.serviceCode
      }
      vm.$store.dispatch('syncServiceinfoCongDvc', filter).then(function (result) {
      }).catch(function() {
        console.log('sync cổng dịch vụ công thất bại')
      })
    },
    syncAll () {
      let vm = this
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
