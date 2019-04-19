<template>
  <div class="list-thu-tuc">
    <div class="row-header no__hidden_class">
      <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
        <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
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
        </div>
      </div> 
    </div>
    <v-layout wrap class="white py-2">
      <v-flex xs4 class="px-2 input-group--text-field-box">
        <v-select
          class="select-border"
          :items="govAgencyList"
          v-model="govAgencySelected"
          label="Chọn cơ quan"
          item-text="administrationName"
          item-value="administrationCode"
          :hide-selected="true"
          clearable
          @change="changeAdministration"
          box
          height="36"
        ></v-select>
      </v-flex>
      <v-flex xs4 class="px-2 input-group--text-field-box">
        <v-select
          class="select-border"
          :items="domainListCurrent"
          v-model="domainSelected"
          label="Chọn lĩnh vực"
          item-text="domainName"
          item-value="domainCode"
          :hide-selected="true"
          clearable
          @change="changeDomain"
          box
          height="36"
        ></v-select>
      </v-flex>
      <v-flex xs4 class="px-2 input-group--text-field-box">
        <v-select
          class="select-border"
          :items="levelList"
          v-model="levelSelected"
          autocomplete
          label="Chọn mức độ"
          item-text="levelName"
          item-value="level"
          :hide-selected="true"
          @change="changeLevel"
          clearable
          box
          height="36"
        >
        </v-select>
      </v-flex>
      <!-- <v-flex xs3 class="pl-2 pr-2">
        <div style="position:relative">
          <v-text-field class="input-border input-search"
            label="Nhập tên thủ tục hành chính"
            v-model="serviceNameKey"
            @keyup.enter="filterServiceName()"
            append-icon="search"
            box
            height="36"
          ></v-text-field>
        </div>
      </v-flex> -->
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
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
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
            <td class="text-xs-left" style="min-width: 135px;">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.serviceCode}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="min-width: 135px">
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
                <v-btn class="mx-0 my-0 mt-1 white--text" depressed readonly small :color="getColor(props.item.maxLevel)"
                style="pointer-events: none;min-width: 110px;">Mức độ {{props.item.maxLevel}}</v-btn>
              </div>
            </td>
            <td class="text-xs-center">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <v-menu bottom right offset-y v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length > 1">
                  <v-btn small slot="activator" color="primary" v-if="props.item.maxLevel >= 3" style="min-width: 110px;">Nộp hồ sơ</v-btn>
                  <v-btn small slot="activator" color="primary" v-else style="min-width: 110px;">Hướng dẫn</v-btn>
                  <v-list v-if="props.item.serviceConfigs">
                    <v-list-tile v-for="(item2, index) in serviceConfigs(props.item.serviceConfigs)" :key="index">
                      <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                      <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                <v-btn small slot="activator" color="primary" class="my-1" style="min-width: 110px;"
                  v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length === 1 && Number(serviceConfigs(props.item.serviceConfigs)[0]['serviceLevel']) > 2"
                  @click="createDossier(serviceConfigs(props.item.serviceConfigs)[0])"
                >
                  Nộp hồ sơ
                </v-btn>
                <v-btn small slot="activator" color="primary" class="my-1" style="min-width: 110px;"
                  v-if="props.item.serviceConfigs && serviceConfigs(props.item.serviceConfigs).length === 1 && Number(serviceConfigs(props.item.serviceConfigs)[0]['serviceLevel']) <= 2"
                  @click="viewGuide(serviceConfigs(props.item.serviceConfigs)[0])"
                >
                  Hướng dẫn
                </v-btn>
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

import Vue from 'vue'
import $ from 'jquery'
import support from '../../store/support.json'
import TinyPagination from './Pagination.vue'
import { isMobile } from 'mobile-device-detect'
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    pathRouter: '/thu-tuc-hanh-chinh/',
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
        text: 'Mã thủ tục',
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
      vm.pathRouter = isMobile ? '/m/thu-tuc-hanh-chinh/' : '/thu-tuc-hanh-chinh/'
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.govAgencySelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') && isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      if (currentQuery.hasOwnProperty('agency')) {
        let filterDomain = {
          agencyCode: currentQuery['agency']
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      } else {
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      }
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
      vm.levelSelected = currentQuery.hasOwnProperty('level') && isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.doLoadingThuTuc()
    }
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
        vm.$router.push({
          path: vm.pathRouter + queryString,
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
        vm.$router.push({
          path: vm.pathRouter + queryString,
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
        vm.$router.push({
          path: vm.pathRouter + queryString,
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
        vm.$router.push({
          path: vm.pathRouter + queryString,
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
      let currentQuery = vm.$router.history.current.query
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
        path: vm.pathRouter + item.serviceInfoId
      })
    },
    createDossier (item) {
      let isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
      if (isSigned) {
        let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
        window.open(url, '_self')
      } else {
        alert('Vui lòng đăng nhập để thực hiện')
      }
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
