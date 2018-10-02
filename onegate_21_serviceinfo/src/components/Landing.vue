<template>
  <div class="list-thu-tuc">
    <div class="row-header">
      <div class="background-triangle-big"> <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span> </div>
    </div>
    <v-layout wrap class="white py-2">
      <v-flex xs3 class="px-2 input-group--text-field-box">
        <v-select
          class="select-border"
          :items="govAgencyList"
          v-model="govAgencySelected"
          placeholder="Chọn cơ quan"
          item-text="administrationName"
          item-value="administrationCode"
          :hide-selected="true"
          clearable
          @change="changeAdministration"
        ></v-select>
      </v-flex>
      <v-flex xs3 class="px-2 input-group--text-field-box">
        <v-select
          class="select-border"
          :items="domainListCurrent"
          v-model="domainSelected"
          placeholder="Chọn lĩnh vực"
          item-text="domainName"
          item-value="domainCode"
          :hide-selected="true"
          clearable
          @change="changeDomain"
        ></v-select>
      </v-flex>
      <v-flex xs3 class="px-2 input-group--text-field-box">
        <v-select
          class="select-border"
          :items="levelList"
          v-model="levelSelected"
          autocomplete
          placeholder="Chọn mức độ"
          item-text="textLevel"
          item-value="level"
          :hide-selected="true"
          @change="changeLevel"
          clearable
        >
        </v-select>
      </v-flex>
      <v-flex xs3 class="pl-2 pr-2">
        <div style="position:relative">
          <v-text-field class="input-border input-search"
            placeholder="Nhập tên thủ tục hành chính"
            v-model="serviceNameKey"
            @keyup.enter="filterServiceName()"
            box
            append-icon="search"
            :append-icon-cb="filterServiceName()"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
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
          <tr v-bind:class="{'active': props.index%2==1}" class="hover-pointer">
            <td class="text-xs-center">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{thutucPage * 15 - 15 + props.index + 1}}</span><br>
              </div>
            </td>
            <td class="text-xs-left" @click="viewDetail(props.item)">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.serviceName}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="min-width: 150px">
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
                  <v-chip class="mx-0 my-0 mt-1" small disabled label :color="getColor(props.item.maxLevel)" text-color="white" >
                    Mức độ {{props.item.maxLevel}}
                  </v-chip>
                </span>
              </div>
            </td>
            <td class="text-xs-center">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <v-menu bottom right offset-y>
                  <v-btn small slot="activator" color="primary" v-if="props.item.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-btn small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                  <v-list v-if="props.item.serviceConfigs">
                    <v-list-tile v-for="(item2, index) in serviceConfigs(props.item.serviceConfigs)" :key="index">
                      <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
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
    <v-dialog scrollable v-model="dialogGuide" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Hướng dẫn nộp hồ sơ</v-card-title>
        <v-card-text v-if="serviceDetail" style="max-height: 400px" v-html="serviceDetail.serviceInstruction"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialogGuide = false">
            Đóng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.govAgencySelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
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
      vm.domainListCurrent = []
      if (currentQuery.hasOwnProperty('agency')) {
        let filterDomain = {
          agencyCode: currentQuery['agency']
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
        // vm.domainListCurrent = vm.domainList.filter(function (itemLinhVuc) {
        //   return (itemLinhVuc.domainCode.indexOf(currentQuery.agency) === 0)
        // })
      } else {
        vm.domainListCurrent = vm.domainList
      }
      vm.govAgencySelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.doLoadingThuTuc()
    }
    // domainList (val) {
    //   var vm = this
    //   if (vm.govAgencySelected) {
    //     vm.domainListCurrent = val.filter(function (itemLinhVuc) {
    //       return (itemLinhVuc.domainCode.indexOf(vm.govAgencySelected) === 0)
    //     })
    //   } else {
    //     vm.domainListCurrent = val
    //   }
    // }
  },
  methods: {
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
        newQuery['keyword'] = vm.serviceNameKey
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
        newQuery['keyword'] = vm.serviceNameKey
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
      console.log('item', item)
      var vm = this
      vm.$router.push({
        path: '/thu-tuc-hanh-chinh/' + item.serviceInfoId
      })
    },
    createDossier (item) {
      let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
      let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
      window.open(url, '_self')
    },
    viewGuide (item) {
      var vm = this
      vm.serviceDetail = item
      vm.dialogGuide = true
    },
    serviceConfigs (config) {
      if (Array.isArray(config)) {
        return config
      } else {
        if (config.hasOwnProperty('serviceConfigId')) {
          return [config]
        } else {
          return []
        }
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
    }
  }
}
</script>
