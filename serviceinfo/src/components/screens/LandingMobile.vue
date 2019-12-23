<template>
  <div class="list-thu-tuc">
    <v-layout wrap class="white py-2">
      <v-flex xs12 sm6 md3 class="px-2 input-group--text-field-box">
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
          box
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6 md3 class="px-2 input-group--text-field-box">
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
          box
        ></v-select>
      </v-flex>
      <v-flex xs12 sm6 md3 class="px-2 input-group--text-field-box">
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
          box
        >
        </v-select>
      </v-flex>
      <v-flex xs12 sm6 md3 class="pl-2 pr-2">
        <div style="position:relative">
          <v-text-field class="input-border input-search"
            placeholder="Nhập tên thủ tục hành chính"
            v-model="serviceNameKey"
            @keyup.enter="filterServiceName()"
            box
            append-icon="search"
            :append-icon-cb="filterServiceName"
          ></v-text-field>
        </div>
      </v-flex>
    </v-layout>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div v-else class="service__info__table mt-2">
      <v-card class="mx-2">
        <div class="px-2 py-2 blue text-bold white--text">
          STT | Tên thủ tục
        </div>
        <v-list class="py-0">
          <template v-for="(item, index) in serviceInfoList" >
            <v-layout wrap :key="index" style="border-bottom:1px solid #dedede;height:auto">
              <v-flex xs1 class="text-xs-center text-bold">
                <span>{{index + 1}}</span>
              </v-flex>
              <v-flex xs10 @click="viewDetail(item)">
                <div style="color:#1e5018">{{item.serviceName}}</div>
                <div> <span class="text-bold">Lĩnh vực: </span> <span>{{item.domainName}}</span> </div>
                <div> <span class="text-bold">Mức độ: </span> <span>{{item.maxLevel}}</span> </div>
              </v-flex>
              <v-flex xs1 class="text-xs-center mt-1">
                <v-menu :close-on-content-click="false" left style="position:relative !important;">
                  <v-btn slot="activator" icon class="mx-0 my-0" style="width:100%">
                    <v-icon color="primary lighten-1">more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-menu :close-on-content-click="false" bottom right offset-y v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length > 1" style="position:relative !important;">
                      <v-btn class="mx-0 my-0" small slot="activator" color="primary" v-if="item.maxLevel >= 3">Nộp hồ sơ &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                      <v-btn class="mx-0 my-0" small slot="activator" color="primary" v-else>Xem hướng dẫn &nbsp; <v-icon size="18">arrow_drop_down</v-icon></v-btn>
                      <v-list v-if="item.serviceConfigs">
                        <v-list-tile v-for="(item2, index) in serviceConfigs(item.serviceConfigs)" :key="index">
                          <v-list-tile-title v-if="item2.serviceLevel >= 3" @click="createDossier(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                          <v-list-tile-title v-else @click="viewGuide(item2)">{{item2.govAgencyName}}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-btn class="mx-0 my-0" small color="primary" 
                      v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length === 1 && Number(serviceConfigs(item.serviceConfigs)[0]['serviceLevel']) > 2"
                      @click="createDossier(serviceConfigs(item.serviceConfigs)[0])"
                    >
                      Nộp hồ sơ
                    </v-btn>
                    <v-btn class="mx-0 my-0" small color="primary" 
                      v-if="item.serviceConfigs && serviceConfigs(item.serviceConfigs).length === 1 && Number(serviceConfigs(item.serviceConfigs)[0]['serviceLevel']) <= 2"
                      @click="viewGuide(serviceConfigs(item.serviceConfigs)[0])"
                    >
                      Xem hướng dẫn
                    </v-btn>
                  </v-list>
                </v-menu>
              </v-flex>
            </v-layout>
          </template>
        </v-list>
      </v-card>
      <div :class="!viewMobile ? 'text-xs-right layout wrap mt-2' : 'mt-2'" style="position: relative;">
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
    <v-dialog v-model="dialogVerifycation" max-width="350">
      <v-card class="px-0">
        <v-card-title color="primary" class="headline">Yêu cầu xác minh tài khoản</v-card-title>
        <v-divider class="my-0"></v-divider>
        <v-card-text>Tài khoản chỉ được phép nộp tối đa 3 hồ sơ trực tuyến khi chưa được xác minh. <br>
          Để tiếp tục nộp hồ sơ trực tuyến vui lòng mang chứng minh thư nhân dân/ thẻ căn cước đến Bộ phận tiếp nhận và trả kết quả để được xác minh.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="dialogVerifycation = false">Đóng</v-btn>
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
    dialogVerifycation: false,
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
    },
    viewMobile () {
      return isMobile
    },
    userLoginInfomation () {
      return this.$store.getters.getUserLogin
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
      vm.levelSelected = currentQuery.hasOwnProperty('level') && !isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
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
      vm.levelSelected = currentQuery.hasOwnProperty('level') && !isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
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
            renew: newQuery['renew'] ? (newQuery['renew'] + 1) : 101
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
      let vm = this
      if (item.serviceUrl) {
        window.location.href = item.serviceUrl
      } else {
        let isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
        if (isSigned) {
          if (vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
            vm.dialogVerifycation = true
          } else {
            let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
            let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
            window.open(url, '_self')
          }
        } else {
          alert('Vui lòng đăng nhập để thực hiện')
        }
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
