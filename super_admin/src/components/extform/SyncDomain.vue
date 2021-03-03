<template>
  <div>
    <!-- layout for desktop -->
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      "></a>
    </v-breadcrumbs>
    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Đồng bộ danh mục lĩnh vực
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <!-- Đồng bộ danh mục lĩnh vực TTHC -->
        <div class="list-thu-tuc" v-if="!isMobile">
          <content-placeholders class="mt-3" v-if="loading">
            <content-placeholders-text :lines="10" />
          </content-placeholders>
          <div v-else class="service__info__table">
            <!-- <v-flex class="xs12 mb-2 right">
              <v-btn color="primary" dark
                v-on:click.native="syncAll"
                :loading="loading"
                :disabled="loading"
              >
              <v-icon size="18">sync</v-icon> &nbsp; Đồng bộ tất cả thủ tục đã mapping
              </v-btn>
            </v-flex> -->
            <v-data-table
              :headers="headersLinhVuc"
              :items="listLinhVuc"
              class="table-landing table-bordered"
              :rows-per-page-items="rowsPerPageItems"
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                  <td class="text-xs-left" style="border-right: 0.5px solid #aba6a6;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span class="text-bold">{{props.item.itemCode}}</span> - <span>{{props.item.itemName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <v-layout wrap align-center>
                        <v-flex xs9>
                          <div v-for="(itemDomain, index1) in props.item.similarity" :key="index1" class="mb-2" style="position: relative;" v-if="itemDomain.mapped" >
                            <v-tooltip v-if="itemDomain.mapped" top style="display: inline-block;width: 25px;position: absolute;top: -2px;">
                              <v-checkbox
                                slot="activator"
                                v-model="itemDomain.mapped"
                                primary
                                hide-details
                                color="#115ebe"
                                :disabled="loadingSync"
                                @change="doActionMappingDomain(props.item, props.index, itemDomain, index1)"
                              ></v-checkbox>
                              <span v-if="itemDomain.mapped">Chọn để hủy mapping</span>
                              <span v-else>Chọn để mapping</span>
                            </v-tooltip>
                            <span v-if="itemDomain.mapped" class="text-bold" :style="itemDomain.mapped ? 'margin-left: 50px' : 'margin-left: 24px'">{{itemDomain.itemCodeDVCQG}}</span> - <span v-if="itemDomain.mapped">{{itemDomain.itemNameDVCQG}}</span>
                          </div>
                        </v-flex>
                        <v-flex xs3 class="text-right"><v-btn small outline color="#115ebe" @click="openDialogMapping(props.item)">Chọn</v-btn></v-flex>
                      </v-layout>
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
            <!-- <div class="text-xs-right layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </v-card>
    <!-- Popup danh sách mapping thêm -->
    <v-dialog v-model="dialogMapping" persistent max-width="600px">
        <v-card style="background: #fff;">
          <v-card-title pa-1>
            <v-layout wrap align-center>
              <v-flex xs6>
                <span class="headline">Chọn để mapping</span>
              </v-flex>
              <v-flex xs6 class="text-right">
                <v-btn color="#F44336" fab small dark  @click="dialogMapping = false">
                  <v-icon>cancel</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout>
                <v-flex xs12>
                  <v-text-field
                    label="Tìm kiếm theo tên"
                    v-model="nameDVCQGModel"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            
              <div v-if="listMappingView.length>0"  style="height: 437px;">
                <content-placeholders v-if="loadingMapping">
                      <content-placeholders-text :lines="5" />
                </content-placeholders>
                <v-layout v-else align-center style="border-bottom: 0.5px dashed" wrap v-for="(item, index) in listMappingView" :key="index">
                  <v-flex xs9 class="pa-0">
                    <span style="font-weight: bold">{{item.itemCodeDVCQG}}-{{item.itemNameDVCQG}}</span>
                  </v-flex>
                  <v-flex xs3  class="text-right pa-0">
                    <v-btn style="color:#fff;" small color="#115ebe" @click="mappingDomainDVCQG(item)">Chọn</v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <div v-else style="height: 437px;">
                <v-layout>
                  <v-flex xs12><span>Không tìm thấy dữ liệu</span></v-flex>
                </v-layout>
              </div>
              <v-layout>
                <v-flex xs12>
                  <div class="text-xs-right layout wrap" style="position: relative;">
                    <div class="flex pagging-table"> 
                      <tiny-pagination :total="total" :page="pageMapping" custom-class="custom-tiny-class" 
                        @tiny:change-page="paggingDataMapping" ></tiny-pagination> 
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="#EF5350"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="snackbarerror = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    snackbarerror: false,
    snackbarsuccess: false,
    breadCrumbsitems: [
      {
        text: 'Bảng dữ liệu',
        disabled: false
      },
      {
        text: '',
        disabled: false
      }
    ],
    nameDVCQGModel: '',
    listMapping: [],
    listMappingView: [],
    dialogMapping: false,
    dialog_createDossier: false,
    dialogVerifycation: false,
    dialogLogin: false,
    valid: false,
    userName: '',
    passWord: '',
    loadingSync: false,
    loadingMapping: false,
    serviceInfoList: [],
    listLinhVuc: [],
    totalThuTuc: 0,
    total: 0,
    thutucPage: 1,
    pageMapping: 1,
    govAgencyList: [],
    govAgencySelected: '',
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
    headersLinhVuc: [
      {
        text: 'Mã lĩnh vực',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã DVCQG',
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
    mappingIdArray: {},
    rowsPerPageItems: [10, 20, 30, 40],
    pagination: {
        rowsPerPage: 20
    },
    linhVucSelect: {}
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
        // vm.govAgencySelected = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyList[0]['administrationCode']
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
          if (!currentQuery.hasOwnProperty('agency') && !vm.govAgencySelected) {
            vm.domainList = result
          }
        })
      }).catch(function(){
      })
      vm.doLoadingServiceDomain()
      vm.loadingMapping = true
      let filter = {
         service: 'LayDanhMucLinhVuc'
      }
      vm.$store.dispatch('getServiceDomainDVCQG', filter).then(function (result) {
        
        vm.listMapping = result.data
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.loadingMapping = false
        vm.total = vm.listMapping.length
    
      }).catch(function() {
        vm.listMapping = []
        vm.listMappingView = []
        vm.loadingMapping = false
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
        vm.doLoadingServiceDomain()
    },
    nameDVCQGModel (val) {
      let vm = this
      vm.pageMapping = 1
      if(val){
        let test = val.toLowerCase()
        let arr = vm.listMapping.filter(e => {
          if(e.itemNameDVCQG.toLowerCase().search(test) >= 0 || e.itemNameDVCQG.search(test) >= 0 || e.itemNameDVCQG === val){
            return e
          }
        })
        vm.listMappingView = arr.slice(0, 10)
        vm.total = arr.length
      } else{
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.total = vm.listMapping.length
      }
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
        newQuery['agency'] = ''
        newQuery['domain'] = ''
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
    doLoadingServiceDomain () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.listLinhVuc = []
      vm.loading = true
      let filter = null
      filter = {
        service: 'LayDanhMucLinhVuc'
      }
      vm.$store.dispatch('getServiceDomain', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.listLinhVuc = result.data  
        } else {
          vm.listLinhVuc = []
        }
      }).catch(reject => {
        vm.loading = false
        vm.listLinhVuc = []
      })
    },
    doActionMappingDomain(item, index, itemDomain, indexDomain) {
      console.log(item, index, itemDomain, indexDomain)
      let vm = this
      setTimeout(function() {
        if (itemDomain['mapped']) {
          vm.mappingDomain(item, index, itemDomain, indexDomain)
        } else {
          vm.removeServiceDomain(item, index, itemDomain, indexDomain)
        }
        vm.loadingSync = true
      }, 300)
    },
    mappingDomain (item, indexDvc, itemDvcqg, indexDvcqg) {
      let vm = this
      let removeBeforeMapping = false
      let itemRemoveBefore = ''
      let filter = {
        itemCode: item.itemCode,
        itemCodeDVCQG: itemDvcqg.itemCodeDVCQG
      }
      for (let i = 0; i < vm.listLinhVuc[indexDvc]['similarity'].length; i++) {
        if (String(i) !== String(indexDvcqg) && vm.listLinhVuc[indexDvc]['similarity'][i]['mapped']) {
          vm.listLinhVuc[indexDvc]['similarity'][i]['mapped'] = false
          itemRemoveBefore = vm.listLinhVuc[indexDvc]['similarity'][i]
          removeBeforeMapping = true
          break
        }
      }
      console.log('filterMapping', filter)
      if (!removeBeforeMapping) {
        console.log('222222222222222')
        vm.$store.dispatch('mappingServiceDomain', filter).then(function (result) {
          if(result){

            // toastr.success('Mapping lĩnh vực thành công')
            vm.snackbarsuccess = true
            // vm.doLoadingServiceDomain()
          } else {
            //  toastr.error('Mapping lĩnh vực thất bại')
            vm.snackbarerror = true
          }
          vm.loadingSync = false
        }).catch(function() {
          // toastr.error('Mapping lĩnh vực thất bại')
          vm.snackbarerror = true
          vm.loadingSync = false
        })
      } else {
        let filter2 = {
          dictItemMappingId: itemRemoveBefore.dictItemMappingId
        }
        console.log('itemRemoveBefore', itemRemoveBefore, filter2)
          vm.$store.dispatch('mappingServiceDomain', filter).then(function (result) {
            if (result) {
              // vm.doLoadingServiceDomain()
              // toastr.success('Mapping lĩnh vực thành công')
              vm.snackbarsuccess = true
            } else {
              // toastr.error('Mapping lĩnh vực thất bại')
              vm.snackbarerror = true
            }
            vm.loadingSync = false
          }).catch(function() {
            // toastr.error('Mapping lĩnh vực thất bại')
            vm.snackbarsuccess = true
            vm.loadingSync = false
          })
        // vm.$store.dispatch('removeMappingServiceDomain', filter2).then(function (result) {
        //   vm.$store.dispatch('mappingServiceDomain', filter).then(function (result) {
        //     if (result) {
        //       // vm.doLoadingServiceDomain()
        //       // toastr.success('Mapping lĩnh vực thành công')
        //       vm.snackbarsuccess = true
        //     } else {
        //       // toastr.error('Mapping lĩnh vực thất bại')
        //       vm.snackbarerror = true
        //     }
        //     vm.loadingSync = false
        //   }).catch(function() {
        //     // toastr.error('Mapping lĩnh vực thất bại')
        //     vm.snackbarsuccess = true
        //     vm.loadingSync = false
        //   })
        // }).catch(function() {
        //   vm.loadingSync = false
        // })
      }
      
    },
    removeServiceDomain (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        dictItemMappingId: itemDvcqg.dictItemMappingId
      }
      vm.$store.dispatch('removeMappingServiceDomain', filter).then(function (result) {
        // toastr.success('Hủy đồng bộ thành công')
        vm.snackbarsuccess = true
        // vm.doLoadingServiceDomain()
        vm.loadingSync = false
      }).catch(function() {
        // toastr.error('Hủy đồng bộ thất bại')
        vm.snackbarerror= true
        vm.loadingSync = false
      })
    },
    syncServiceinfo(item, indexDvc, itemDvcqg, index) {
      let vm = this
      vm.loadingSync = true
      let filter = {
        serviceCode: item.serviceCode
      }
      vm.$store.dispatch('syncServiceinfo', filter).then(function (result) {
        // toastr.clear()
        // toastr.success('Đồng bộ thành công')
        vm.snackbarsuccess = true
        vm.loadingSync = false
        // vm.doLoadingThuTuc()
      }).catch(function() {
        // toastr.error('Đồng bộ thất bại')
        vm.snackbarerror = true
        vm.loadingSync = false
        // vm.doLoadingThuTuc()
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
    paggingDataMapping (config) {
      let vm = this
      let start = config.page * 10 - 10
      let end = config.page * 10
      if(vm.nameDVCQGModel){
        let test = vm.nameDVCQGModel.toLowerCase()
        vm.listMappingView = vm.listMapping.filter(e => {
          if(e.itemNameDVCQG.toLowerCase().search(test) >= 0 || e.itemNameDVCQG.search(test) >= 0 || e.itemNameDVCQG === vm.nameDVCQGModel){
            return e
          }
        }).slice(start, end)
      } else{
        vm.listMappingView = vm.listMapping.slice(start, end)
      }
      
    },
    getColor (level) {
      if (level === 2) {
        return 'green'
      } else if (level === 3) {
        return 'orange darken-1'
      } else if (level === 4) {
        return 'red'
      }
    },
    openDialogMapping (item) {
      let vm = this
      vm.linhVucSelect = item
      vm.nameDVCQGModel = item.itemName
      vm.pageMapping = 1
      vm.dialogMapping = true
    },
    mappingDomainDVCQG (item) {
      let vm = this
      let filter = {
        itemCode: vm.linhVucSelect.itemCode,
        itemCodeDVCQG: item.itemCodeDVCQG
      }
      vm.$store.dispatch('mappingServiceDomain', filter).then(function (result) {
        if(result){
          vm.dialogMapping =  false
          // toastr.success('Mapping lĩnh vực thành công')
          // vm.doLoadingServiceDomain()
          for (let i = 0; i < vm.listLinhVuc.length; i++) {
            if(vm.listLinhVuc[i].itemCode === vm.linhVucSelect.itemCode){
              // for (let j = 0; j < vm.listLinhVuc[i]['similarity'].length; j++){
              //   vm.listLinhVuc[i]['similarity'][j].mapped =  false
              // }
              vm.listLinhVuc[i]['similarity'] = []
              vm.listLinhVuc[i]['similarity'].push({itemCodeDVCQG: item.itemCodeDVCQG, itemNameDVCQG: item.itemNameDVCQG, mapped: true})
              break
            }
          }
          vm.snackbarsuccess = true
        } else {
            // toastr.error('Mapping lĩnh vực thất bại')
            vm.snackbarerror = true
        }
        vm.loadingSync = false
      }).catch(function() {
        // toastr.error('Mapping lĩnh vực thất bại')
        vm.snackbarerror = true
        vm.loadingSync = false
      })
    },
      backToList () {
        window.history.back()
      }
  }
}
</script>
