<template>
  <div>
    <!-- layout for desktop -->
    <div class="list-thu-tuc" v-if="!isMobile">
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
        <downloadExcel
          class="btn btn-default btn-export"
          :data="json_data"
          style="display: none"
        >
          Export Excel
        </downloadExcel>

        <v-btn color="primary"
          @click="exportTracking"
        >
          <v-icon>import_export</v-icon>&nbsp;
          Export Tracking
        </v-btn>
      </v-layout>

      <div class="service__info__table">
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
              <td class="text-xs-left" style="min-width: 135px;">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.serviceCodeDVCQG ? props.item.serviceCodeDVCQG : props.item.serviceCode}}</span>
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
import JsonExcel from 'vue-json-excel'
 
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination,
    'downloadExcel': JsonExcel
  },
  data: () => ({
    json_fields : {
      "name": "String",
      "level": "String",
      "url": "String",
      "idhttt": "String",
      "iddvc": "String"
    },
    json_data : [],
    json_meta: [
      [{
        "key": "charset",
        "value": "utf-8"
      }]
    ],
    formToKhai: false,
    templateFormList: '',
    dialog_selectTemplateEform: false,
    validFormSelectTemplateEform: false,
    templateFormSelected: '',
    serviceInfoSelected: '',
    dialog_selectAgency: false,
    dialog_createDossier: false,
    dialogVerifycation: false,
    dialogLogin: false,
    dialogLoginDvcqg: false,
    dialog_loginDVCQG: false,
    tempDVCQG: '',
    valid: false,
    userName: '',
    passWord: '',
    loadingLogin: false,
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
        text: 'Mã thủ tục',
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
    isLogin: false,
    verificationApplicantCreateDossier: false,
    serviceSelected: '',
    hasCoQuanThucHien: false,
    configUrl: '',
    keyCodeDvcqg: '',
    userInfoDvcqg: '',
    mapping: false,
    dataMapping: '',
    doCreateDossier: false,
    captcha: false,
    j_captcha_response: '',
    chapchablob: '',
    validFormSelectGov: false,
    govAgencyListTiepNhan: [],
    govAgencyTiepNhanSelected: '',
    selectGuide: false,
    onlyLoginDvcqg: false
  }),
  computed: {
    govAgencyList () {
      return this.$store.getters.getAgencyList
    },
    govAgencyListThucHien () {
      return this.$store.getters.getAgencyListThucHien
    },
    domainList () {
      return this.$store.getters.getDomainList
    },
    levelList () {
      return this.$store.getters.getLevelList
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    },
    userLoginInfomation () {
      return this.$store.getters.getUserLogin
    }
  },
  created () {
    let vm = this
    // 
    try {
      vm.formToKhai = toKhaiTrucTuyen ? true : false 
    } catch (error) {
      vm.formToKhai = false
    }
    // 
    try {
      vm.hasCoQuanThucHien = hasCoQuanThucHien
    } catch (error) {
      vm.hasCoQuanThucHien = false
    }
    // 
    try {
      vm.configUrl = configSso 
    } catch (error) {
    }
    // 
    try {
      vm.verificationApplicantCreateDossier = hasVerificationCreateDossier
    } catch (error) {
    }
    // 
    try {
      vm.keyCodeDvcqg = keyCodeDvcqg
    } catch (error) {
    }
    // 
    try {
      vm.onlyLoginDvcqg = hasOnlyLoginDvcqg
    } catch (error) {
    }
    // 
    if ( typeof(Storage) !== 'undefined') {
      let count = sessionStorage.getItem('isbot')
      if (window.themeDisplay.isSignedIn() || !count) {
        sessionStorage.setItem('isbot', '0')
      }
      if (Number(sessionStorage.getItem('isbot')) >= 5) {
        vm.captcha = true
      }
    }
    // 
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.initData()
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  mounted () {
    if (this.isMobile) {
      $('.input-search input').css('margin-top', '5px')
      $('.input-search .v-input__slot').css('min-height', '36px')
      $('.input-search .v-input__append-inner').css('margin-top', '10px')
    }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.domainListCurrent = []
      if ((currentQuery.hasOwnProperty('agency') && currentQuery['agency']) || vm.index) {
        let filterDomain = {
          agencyCode: currentQuery['agency'] ? currentQuery['agency'] : (vm.index !== 'thu-tuc-hanh-chinh' ? vm.index : '')
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      } else {
        vm.domainListCurrent = vm.domainList
      }
      vm.govAgencySelected = vm.govAgencyThucHienSelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : (vm.index !== 'thu-tuc-hanh-chinh' ? vm.index : '')
      vm.govAgencyThucHienSelected = currentQuery.hasOwnProperty('agencyth') && currentQuery.agencyth ? currentQuery.agencyth : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') && !isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      vm.doLoadingThuTuc()
    }
  },
  methods: {
    initData () {
      let vm = this
      // 
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.govAgencySelected = vm.govAgencyThucHienSelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') && currentQuery.agency ? currentQuery.agency : (vm.index !== 'thu-tuc-hanh-chinh' ? vm.index : '')
      vm.govAgencyThucHienSelected = currentQuery.hasOwnProperty('agencyth') && currentQuery.agencyth ? currentQuery.agencyth : ''
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
      let filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        agency: currentQuery.hasOwnProperty('agencyth') && currentQuery.agencyth ? currentQuery.agencyth : '',
        keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : '',
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : '',
        numberPerPage: 15
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
    exportTracking () {
      let vm = this
      vm.loading = true
      let pages = Math.ceil(vm.totalThuTuc / 100)
      let count = 0
      let serviceInfoMapping = []
      for (let index = 1; index <= pages; index++) {
        let filter = {
          page: index,
          numberPerPage: 100
        }
        vm.$store.dispatch('getServiceLists', filter).then(function (result) {
          count += 1
          let dataPush = []
          let dataInput = result.data
          for (let i = 0; i < dataInput.length; i++) {
            let item = {
              "name": dataInput[i]['serviceName'],
              "level": dataInput[i]['maxLevel'],
              "url": "",
              "idhttt": dataInput[i]['serviceCodeDVCQG'] ? dataInput[i]['serviceCodeDVCQG'] : dataInput[i]['serviceCode'],
              "iddvc": dataInput[i]['serviceCode']
            }
            dataPush.push(item)
          }
          serviceInfoMapping = serviceInfoMapping.concat(dataPush)
          if (count === pages) {
            vm.loading = false
            vm.json_data = serviceInfoMapping
            setTimeout(() => {
              $('.btn-export').click()
            }, 100)
          }
        })
      }
      
    },
    checkServiceExits (key) {
      let vm = this
      let filter = {
        keyword: key
      }
      vm.$store.dispatch('checkServiceExits', filter).then(function(result) {
        vm.loadingLogin = false
        if (result === 'success') {
          vm.dialogLogin = false
          vm.isLogin = true
          vm.createDossier(vm.serviceSelected)
        }          
      }).catch(function(){
        vm.loadingLogin = false
      })

    },
    checkVNConect () {
      let vm = this
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      let filter = {
        state: '',
        redirectURL: window.location.href.split("?")[0]
      }
      setTimeout (function () {
        if (!vm.isSigned) {
          vm.$store.dispatch('getVNConect', filter).then(function (result) {
            if (result) {
              window.location.href = result
            } else {
              alert('Chức năng đang cập nhật')
            }
          }).catch(function () {
            if (!vm.isSigned) {
              vm.doCreateDossier = false
              vm.dialogLogin = true
            }
          })
        }
      }, 300)
    },
    doMappingDvcqg () {
      let vm = this
      let filter = {
        dataMapping: vm.dataMapping
      }
      vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
      }).catch(function () {
      })
    },
    getSearchParams (prams, key) {
      let value = ""
      let headers = prams.split("&")
      headers.forEach(function (header) {
        header = header.split("=");
        let keyHeader = header[0];
        if (keyHeader === key) {
          value = header[1]
        }
      });
      return value
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
    goBack () {
      window.history.back()
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
    trackingBTTT (serviceCode) {
      try {
        console.log('trackDVC serviceCode', serviceCode)
        if (_govaq) {
          _govaq.push(['trackDVC', serviceCode, '1', ''])
        }
      } catch (error) { 
      }
    },
    getRoleUser () {
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : ''
        }
      }
      axios.get('/o/rest/v2/users/login', param).then(function (response) {
        let serializable = response.data
        if (serializable && serializable.length > 0) {
          let roles = []
          for (let key in serializable) {
            if (serializable[key]['role']) {
              roles.push(serializable[key]['role'])
            }
          }
          // console.log('roles', roles)
          resolve(roles)
        } else {
          resolve(['default'])
        }
      }).catch(function (error) {
      })
    },
  }
}
</script>
