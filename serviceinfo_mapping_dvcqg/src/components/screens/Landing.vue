<template>
  <div>
    <!-- layout for desktop -->
    <div class="list-thu-tuc" v-if="!isMobile">
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span>ĐỒNG BỘ THỦ TỤC HÀNH CHÍNH DỊCH VỤ CÔNG QUỐC GIA</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <!-- <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <v-text-field
              v-model="serviceNameKey"
              placeholder="Tìm kiếm theo tên thủ tục, mã thủ tục ..."
              solo
              chips
              multiple
              deletable-chips
              item-value="value"
              item-text="text"
              @keyup.enter="filterServiceName"
              content-class="adv__search__select"
              return-object
            ></v-text-field>
          </div>
          <div class="flex text-right" style="margin-left: auto;max-width: 50px;">
            <v-btn icon class="my-0 mx-2" v-on:click.native="filterServiceName">
              <v-icon size="16">search</v-icon>
            </v-btn>
          </div> -->
        </div> 
      </div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="service__info__table">
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
                    <v-tooltip top>
                      <v-checkbox
                        slot="activator"
                        v-model="itemDvc.mapped"
                        primary
                        hide-details
                        color="primary"
                        style="display: inline-block;width: 25px;position: absolute;top: -2px;"
                        :disabled="loadingSync"
                        @change="doActionMapping(props.item, props.index, itemDvc, index1)"
                      ></v-checkbox>
                      <span v-if="itemDvc.mapped">Chọn để hủy đồng bộ</span>
                      <span v-else>Chọn để đồng bộ</span>
                    </v-tooltip>
                    <span class="text-bold ml-4">{{itemDvc.serviceCodeDVCQG}}</span> - <span>{{itemDvc.serviceNameDVCQG}}</span>
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
    pathRouter: '/thu-tuc-hanh-chinh/',
    serviceInfoList: [],
    totalThuTuc: 0,
    thutucPage: 1,
    govAgencySelected: {},
    govAgencyThucHienSelected: {},
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
        text: 'Thủ tục hành chính Bộ giao thông vận tải',
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
    syncing: false
  }),
  computed: {

  },
  created () {
    var vm = this
    // 
    vm.$nextTick(function () {
      vm.doLoadingThuTuc()
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
    filterServiceName () {
      var vm = this
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
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    doLoadingThuTuc () {
      let vm = this
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
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
    doActionMapping(item, indexDvc, itemDvcqg, index) {
      console.log(item, indexDvc, itemDvcqg, index)
      let vm = this
      setTimeout(function() {
        if (itemDvcqg['mapped']) {
          vm.mappingDvcqg(item, indexDvc, itemDvcqg, index)
        } else {
          vm.removeMapping(item, indexDvc, itemDvcqg, index)
        }
        vm.loadingSync = true
      }, 300)
    },
    mappingDvcqg (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let removeBeforeMapping = false
      vm.syncing = false
      let filter = {
        serviceCode: item.serviceCode,
        serviceCodeDVCQG: itemDvcqg.serviceCodeDVCQG
      }
      for (let i = 0; i <= vm.serviceInfoList[indexDvc]['similarity'].length; i++) {
        if (String(i) !== String(index) && vm.serviceInfoList[indexDvc]['similarity'][i] === true) {
          vm.serviceInfoList[indexDvc]['similarity'][i] = false
          vm.syncing = {
            item: item,
            indexDvc: indexDvc,
            itemDvcqg: itemDvcqg,
            index: index
          }
          removeBeforeMapping = true
          break
        }
      }
      if (!removeBeforeMapping) {
        vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
          vm.syncServiceinfo(item, indexDvc, itemDvcqg, index)
        }).catch(function() {
          toastr.error('Đồng bộ thất bại')
          vm.loadingSync = false
        })
      }
      
    },
    removeMapping (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        serviceInfoId: itemDvcqg.serviceInfoMappingId
      }
      vm.$store.dispatch('removeMappingDvcqg', filter).then(function (result) {
        if (!vm.syncing) {
          toastr.clear()
          toastr.success('Hủy đồng bộ thành công')
          vm.loadingSync = false
          vm.doLoadingThuTuc()
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
      }).catch(function() {
        if (!vm.syncing) {
          toastr.error('Hủy đồng bộ thất bại')
          vm.loadingSync = false
          vm.doLoadingThuTuc()
        }
      })
    },
    syncServiceinfo(item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        serviceCode: item.serviceCode
      }
      vm.$store.dispatch('syncServiceinfo', filter).then(function (result) {
        toastr.clear()
        toastr.success('Đồng bộ thành công')
        vm.loadingSync = false
        vm.doLoadingThuTuc()
      }).catch(function() {
        toastr.error('Đồng bộ thất bại')
        vm.loadingSync = false
        vm.doLoadingThuTuc()
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
