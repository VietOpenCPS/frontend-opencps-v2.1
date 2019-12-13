<template>
  <div>
    <div class="text-center mt-5" v-if="String(serviceCode) !== '0' && !selectOption">
      <v-progress-circular
        :size="100"
        :width="1"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p class="mt-5">Đang tạo hồ sơ ...</p>
    </div>
    <div v-else>
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span>DANH SÁCH THỦ TỤC HÀNH CHÍNH</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
            <v-text-field
              v-model="serviceNameKey"
              placeholder="Tìm kiếm theo tên thủ tục"
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
      <v-layout wrap class="white pt-3">
        <v-flex style="width:calc(100% - 230px)">
          <v-layout wrap class="">
            <v-flex xs6 class="px-2">
              <v-autocomplete
                class="select-border"
                :items="govAgencyList"
                v-model="govAgencyFilter"
                label="Chọn cơ quan"
                item-text="govAgencyName"
                item-value="govAgencyCode"
                :hide-selected="true"
                clearable
                @change="changeFilterAgency"
                box
              ></v-autocomplete>
            </v-flex>
            <v-flex xs6 class="px-2">
              <v-autocomplete
                class="select-border"
                :items="domainList"
                v-model="domainFilter"
                label="Chọn lĩnh vực"
                item-text="domainName"
                item-value="domainCode"
                :hide-selected="true"
                clearable
                @change="changeFilterDomain"
                box
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex style="width:230px" class="pl-2">
          <v-chip label color="primary" class="my-0" text-color="white" style="height:48px;border-radius: 5px;">
            <v-checkbox
              class="mt-0"
              v-model="serviceLastest"
              color="white"
              hide-details
            >
              <template slot="label">
                <div class="white--text">THỦ TỤC NỘP GẦN ĐÂY</div>
              </template>
            </v-checkbox>
          </v-chip>
        </v-flex>
      </v-layout>
      <v-divider class="my-0 py-0"></v-divider>
      <v-expansion-panel v-if="!domainFilter && !activeFilterKey && !serviceLastest" class="expand__select__gov" v-model="panelAgency" expand>
        <v-expansion-panel-content v-for='(itemGov, index) in govAgencyRender' :key='index'>
          <div slot='header' class="ml-3 text-bold">
            <v-icon style="
              font-size: 14px;
              margin-top: -4px;
              padding-right: 5px;
            ">account_balance</v-icon>
            {{itemGov.govAgencyName}}
          </div>
          <v-card>
            <v-card-text class='grey lighten-3 px-0 py-0'>
              <!-- Cap 2 -->
              <v-expansion-panel class="expand__select__domain" v-model="panelDomain[index]" expand>
                <v-expansion-panel-content class="blue darken-3" v-for='(itemDomain, index2) in itemGov.domains' :key='index2' v-if='itemGov.domains' :value="true">
                  <div class="text-bold white--text" slot='header' style="margin-left: 14px;">
                    <v-icon class="pr-2 theme--dark">navigate_next</v-icon> 
                    <span style="position: absolute;margin-top: 1px;">{{itemDomain.domainName}}</span>
                  </div>
                  <v-card>
                    <v-card-text class="card__text__gov" v-for='(itemServiceConfig, index3) in itemDomain.serviceConfigs' v-if='itemDomain.serviceConfigs' :key='index3'>
                      <!-- Cap 3 -->
                      <v-layout row wrap>
                        <v-flex xs12 sm9 class="pt-1">
                          <span style="font-weight: bold">{{index3 + 1}}.</span> &nbsp;
                          <span>{{itemServiceConfig.serviceInfoName}}</span>
                        </v-flex>
                        <v-flex xs12 sm1 class="text-xs-center pt-1">
                          <span>Mức {{itemServiceConfig.level}}</span>
                        </v-flex>
                        <v-flex xs12 sm2 class="text-xs-center">
                          <v-menu left offset-x>
                            <v-btn flat class="mx-0 my-0" slot="activator" small 
                              @click="pullServiceOptions(itemServiceConfig, itemGov.govAgencyCode)"
                            >
                              Chọn
                            </v-btn>
                            <v-list v-if="serviceOptions.length > 1">
                              <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                                @click="selectServiceOption(itemOption, itemGov.govAgencyCode, itemServiceConfig)">
                                <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                              </v-list-tile>
                            </v-list>
                          </v-menu>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <div class="my-2" v-if="!govAgencyFilter && !domainFilter && !activeFilterKey && !serviceLastest && govAgencyFilterList.length > numberPerPage">
        <div class="text-xs-right layout wrap" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="govAgencyFilterList.length" :page="agencyPage" :numberPerPage="numberPerPage" nameRecord="đơn vị" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></tiny-pagination> 
          </div>
        </div>
      </div>
      <v-card v-if="domainFilter">
        <v-card-text class='grey lighten-3 px-0 py-0'>
          <v-expansion-panel class="expand__select__domain" v-model="panelDomainList" expand>
            <v-expansion-panel-content class="blue darken-3" v-for='(itemDomain, index2) in domainListRender' :key='index2' :value="true">
              <div class="text-bold white--text" slot='header' style="margin-left: 14px;">
                  <v-icon class="pr-2 theme--dark">navigate_next</v-icon> 
                  <span style="position: absolute;margin-top: 1px;">{{itemDomain.domainName}} <span v-if="domainListRender.length > 1"> - {{itemDomain.govAgencyName}}</span> </span>
              </div>
              <v-card>
                <v-card-text class="card__text__gov" v-for='(itemServiceConfig, index3) in itemDomain.serviceConfigs' v-if='itemDomain.serviceConfigs' :key='index3'>
                  <!-- Cap 3 -->
                  <v-layout row wrap>
                    <v-flex xs12 sm9 class="pt-1">
                      <span style="font-weight: bold">{{index3 + 1}}.</span> &nbsp;
                      <span>{{itemServiceConfig.serviceInfoName}}</span>
                    </v-flex>
                    <v-flex xs12 sm1 class="text-xs-center pt-1">
                      <span>Mức {{itemServiceConfig.level}}</span>
                    </v-flex>
                    <v-flex xs12 sm2 class="text-xs-center">
                      <v-menu left offset-x>
                        <v-btn flat class="mx-0 my-0" slot="activator" small 
                          @click="pullServiceOptions(itemServiceConfig, itemDomain.govAgencyCode)"
                        >
                          Chọn
                        </v-btn>
                        <v-list v-if="serviceOptions.length > 1">
                          <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                            @click="selectServiceOption(itemOption, itemDomain.govAgencyCode, itemServiceConfig)">
                            <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
      </v-card>
      <v-card v-if="activeFilterKey || serviceLastest">
        <div v-if="serviceConfigListRender.length > 0">
          <v-card-text class="card__text__gov" v-for='(itemServiceConfig, index3) in serviceConfigListRender' :key='index3'>
            <!-- Cap 3 -->
            <v-layout row wrap>
              <v-flex xs12 sm9 class="pt-1">
                <span style="font-weight: bold">{{index3 + 1}}.</span> &nbsp;
                <span>{{itemServiceConfig.serviceInfoName}}</span>&nbsp;
                <span v-if="itemServiceConfig.govAgencyNameRender" class="primary--text">({{itemServiceConfig.govAgencyNameRender}})</span>
              </v-flex>
              <v-flex xs12 sm1 class="text-xs-center pt-1">
                <span>Mức {{serviceLastest ? itemServiceConfig.serviceLevel : itemServiceConfig.level}}</span>
              </v-flex>
              <v-flex xs12 sm2 class="text-xs-center">
                <v-menu left offset-x>
                  <v-btn flat class="mx-0 my-0" slot="activator" small 
                    @click="pullServiceOptions(itemServiceConfig, itemServiceConfig.govAgencyCode)"
                  >
                    Chọn
                  </v-btn>
                  <v-list v-if="serviceOptions.length > 1">
                    <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                      @click="selectServiceOption(itemOption, itemServiceConfig.govAgencyCode, itemServiceConfig)">
                      <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-card-text>
        </div>
        <div v-else class="my-3 mx-2">
          <v-alert outline color="warning" icon="priority_high" :value="true">
            Không có thủ tục nào
          </v-alert>
        </div>
      </v-card>
      <v-dialog v-model="dialog_captcha" scrollable persistent max-width="700px">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Xác thực người dùng</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialog_captcha = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form ref="formCaptcha" v-model="validCaptcha" lazy-validation>
              <v-layout wrap class="py-1 align-center row-list-style">
                <v-flex xs12>
                  <captcha ref="captcha"></captcha>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-3" color="primary" @click="doCreateDossier"
            :loading="loadingAction"
            :disabled="loadingAction">
              <v-icon>done</v-icon> &nbsp;
              Đồng ý
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn class="mr-3" color="primary" @click="dialog_captcha = false"
            :loading="loadingAction"
            :disabled="loadingAction">
              <v-icon>clear</v-icon> &nbsp;
              Hủy nộp hồ sơ
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogVerifycation" max-width="350">
        <v-card class="px-0">
          <v-card-title color="primary" class="headline">Yêu cầu xác minh tài khoản</v-card-title>
          <v-divider></v-divider>
          <v-card-text>Tài khoản chỉ được phép nộp tối đa 3 hồ sơ trực tuyến khi chưa được xác minh. Để tiếp tục nộp hồ sơ trực tuyến vui lòng mang chứng minh thư nhân dân/ thẻ căn cước đến Bộ phận tiếp nhận và trả kết quả để được xác minh.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">Đóng</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    
  </div>
</template>

<script>
  import Captcha from './Captcha.vue'
  import toastr from 'toastr'
  import TinyPagination from './pagging/hanghai_pagination.vue'
  toastr.options = {
    'closeButton': true,
    'timeOut': '3000'
  }
  export default {
    props: ['serviceCode'],
    components: {
      'captcha': Captcha,
      'tiny-pagination': TinyPagination
    },
    data: () => ({
      dialog_captcha: false,
      validCaptcha: false,
      govAgencyList: [],
      govAgencyFilter: '',
      domainList: [],
      domainListRender: [],
      panelDomainList: [true],
      domainFilter: '',
      panelAgency: [],
      panelDomain: [],
      govAgencies: [],
      govAgencyFilterList: [],
      govAgencyRender: [],
      serviceOptions: [],
      serviceConfigSelect: '',
      serviceConfigList: [],
      serviceConfigListRender: [],
      serviceInfoIdSelect: '',
      serviceOptionsProcess: [],
      selectOption: false,
      govAgencyCodeSelect: '',
      serviceNameKey: '',
      activeFilterKey: false,
      loadingMutiple: true,
      dataPostDossier: '',
      serviceLastest: false,
      numberPerPage: 10,
      agencyPage: 1,
      dialogVerifycation: false
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      currentUser () {
        return this.$store.getters.loadingInitData.user
      },
      userLoginInfomation () {
        return this.$store.getters.getUserLogin
      }
    },
    created () {
      var vm = this
      // console.log('run created 2')
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$store.dispatch('loadServiceConfigsGov', {}).then(result => {
        vm.govAgencies = result
        vm.govAgencyFilterList = vm.govAgencies
        vm.govAgencyList = []
        vm.domainList = []
        vm.serviceConfigList = []
        for (let index in vm.govAgencies) {
          let item = {
            govAgencyCode: vm.govAgencies[index]['govAgencyCode'],
            govAgencyName: vm.govAgencies[index]['govAgencyName']
          }
          vm.govAgencyList.push(item)
          let itemDomain = vm.govAgencies[index]['domains']
          for (let index2 in itemDomain) {
            let item2 = {
              govAgencyCode: vm.govAgencies[index]['govAgencyCode'],
              govAgencyName: vm.govAgencies[index]['govAgencyName'],
              domainCode: itemDomain[index2]['domainCode'],
              domainName: itemDomain[index2]['domainName'],
              serviceConfigs: itemDomain[index2]['serviceConfigs']
            }
            vm.domainList.push(item2)
            let itemServiceConfig = vm.govAgencies[index]['domains'][index2]['serviceConfigs']
            for (let index3 in itemServiceConfig) {
              let item3 = {
                level: itemServiceConfig[index3]['level'],
                serviceConfigId: itemServiceConfig[index3]['serviceConfigId'],
                serviceInfoId: itemServiceConfig[index3]['serviceInfoId'],
                serviceInfoName: itemServiceConfig[index3]['serviceInfoName'],
                govAgencyCode: vm.govAgencies[index]['govAgencyCode']
              }
              vm.serviceConfigList.push(item3)
            }
          }
        }
        vm.serviceConfigListRender = vm.serviceConfigList
        vm.domainListRender = vm.domainList
        // 
        if (newQuery['domain']) {
          vm.domainFilter = newQuery['domain']
        }
        if (newQuery['agency']) {
          vm.govAgencyFilter = newQuery['agency']
        }
        
        if (String(vm.serviceCode) === '0') {
          vm.filterAndSort()
        }
        // 
        if (String(vm.serviceCode) !== '0') {
          for (let key in vm.govAgencies) {
            let govAgencyCode = vm.govAgencies[key].govAgencyCode
            for (let keyDomain in vm.govAgencies[key].domains) {
              for (let keyConfig in vm.govAgencies[key].domains[keyDomain].serviceConfigs) {
                let serviceConfig = vm.govAgencies[key].domains[keyDomain].serviceConfigs[keyConfig]
                let serviceConfigId = serviceConfig.serviceConfigId
                if (String(vm.serviceCode) === String(serviceConfigId)) {
                  vm.govAgencyCodeSelect = govAgencyCode
                  vm.serviceInfoIdSelect = serviceConfig.serviceInfoId
                  vm.pullServiceOptions(serviceConfig, govAgencyCode)
                  break
                }
              }
            }
          }
        }
      })
    },
    updated () {
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        vm.filterAndSort()
      },
      serviceLastest (val) {
        let vm = this
        if (val) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceNameKey = ''
          vm.filterService()
        } else {
          vm.filterService()
        }
      }
    },
    methods: {
      changeFilterAgency () {
        let vm = this
        vm.domainFilter = ''
        vm.serviceNameKey = ''
        vm.activeFilterKey = false
        vm.serviceLastest = false
        vm.filterService()
      },
      changeFilterDomain () {
        let vm = this
        vm.govAgencyFilter = ''
        vm.serviceNameKey = ''
        vm.activeFilterKey = false
        vm.serviceLastest = false
        vm.panelDomainList = [true]
        vm.filterService()
      },
      filterServiceName () {
        let vm = this
        if (vm.serviceNameKey && vm.serviceNameKey.length > 5) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceLastest = false
          vm.activeFilterKey = true
          vm.filterService()
        } else {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceNameKey = ''
          vm.serviceLastest = false
          vm.activeFilterKey = false
          vm.filterService()
        }
      },
      changePage (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        vm.agencyPage = config.page
        newQuery['page'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'page=' + vm.agencyPage
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      },
      filterService () {
        let vm = this
        setTimeout (function () {
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          newQuery['agency'] = vm.govAgencyFilter
          newQuery['domain'] = vm.domainFilter
          if (vm.serviceLastest) {
            newQuery['lastest'] = vm.serviceLastest
          } else {
            newQuery['lastest'] = ''
          }
          newQuery['keyword'] = String(vm.serviceNameKey).trim()
          if (!vm.govAgencyFilter) {
            newQuery['page'] = 1
          }
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
        }, 5)
      },
      filterAndSort () {
        let vm = this
        vm.govAgencyRender = []
        vm.govAgencyRender = []
        vm.domainListRender = []
        let current = vm.$router.history.current
        let newQuery = current.query
        if (!newQuery.hasOwnProperty('agency') && !newQuery.hasOwnProperty('domain') && !newQuery.hasOwnProperty('keyword') && !newQuery['lastest']) {
          vm.govAgencyFilterList = vm.govAgencies
          if (newQuery.hasOwnProperty('page') && newQuery['page']) {
            vm.agencyPage = newQuery['page']
            let start = vm.agencyPage * vm.numberPerPage - vm.numberPerPage
            let end = vm.agencyPage * vm.numberPerPage
            vm.govAgencyRender = vm.govAgencyFilterList.slice(start, end)
          } else {
            vm.agencyPage = 1
            let start = vm.agencyPage * vm.numberPerPage - vm.numberPerPage
            let end = vm.agencyPage * vm.numberPerPage
            vm.govAgencyRender = vm.govAgencyFilterList.slice(start, end)
          }
          console.log('vm.govAgencyRender', vm.govAgencyRender)
        }
        if (newQuery.hasOwnProperty('agency') && newQuery.agency) {
          vm.govAgencyRender = vm.govAgencies.filter(function (item) {
            return String(item['govAgencyCode']) === newQuery.agency
          })
        }
        if (newQuery.hasOwnProperty('domain') && newQuery.domain) {
          vm.domainListRender = vm.domainList.filter(function (item) {
            return String(item['domainCode']) === newQuery.domain
          })
        }
        if (newQuery.hasOwnProperty('keyword') && newQuery.keyword) {
          let keySearch = vm.convertString(newQuery.keyword)
          vm.serviceConfigListRender = vm.serviceConfigList.filter(function (item) {
            return vm.convertString(String(item['serviceInfoName'])).indexOf(keySearch) >= 0
          })
        }
        if (newQuery.hasOwnProperty('lastest') && newQuery.lastest && String(newQuery.lastest) !== 'false') {
          vm.$store.dispatch('getServiceRecently').then(function (result) {
            if (result.length > 0) {
              let serviceConfigs = []
              for (let index in result) {
                if (Array.isArray(result[index]['serviceConfigs'])) {
                  for (let key in result[index]['serviceConfigs']) {
                    result[index]['serviceConfigs'][key].serviceInfoId = result[index]['serviceConfigs'][key]['serviceInfoId']
                    result[index]['serviceConfigs'][key].serviceInfoName = result[index]['serviceName']
                    result[index]['serviceConfigs'][key].govAgencyNameRender = result[index]['serviceConfigs'][key]['govAgencyName']
                    serviceConfigs.push(result[index]['serviceConfigs'][key])
                  }
                } else {
                  result[index]['serviceConfigs'].serviceInfoId = result[index]['serviceInfoId']
                  result[index]['serviceConfigs'].serviceInfoName = result[index]['serviceName']
                  serviceConfigs.push(result[index]['serviceConfigs'])
                }
              }
              vm.serviceConfigListRender = serviceConfigs
              console.log('serviceConfigListRender 2', vm.serviceConfigListRender)
            } else {
              vm.serviceConfigListRender = []
            }
          }).catch (function () {
            vm.serviceConfigListRender = []
          })
        }
        if (!vm.domainFilter && !vm.serviceNameKey) {
          if (vm.govAgencyRender.length === 1) {
            vm.panelAgency = [true]
            if (vm.govAgencyRender[0].domains.length === 1) {
              vm.panelDomain = []
              vm.panelDomain[0] = [true]
            } else {
              for (let key in vm.govAgencyRender[0].domains) {
                vm.panelDomain.push([])
                vm.panelDomain[key].push(false)
              }
              vm.panelDomain[0] = [true]
            }
          } else {
            for (let key in vm.govAgencyRender) {
              vm.panelAgency.push(false)
              vm.panelDomain.push([])
              if (vm.govAgencyRender[key].domains.length === 1) {
                vm.panelDomain[0] = [true]
              } else {
                for (let index in vm.govAgencyRender[key].domains[index]) {
                  vm.panelDomain[key].push(false)
                }
              }
            }
          }
        }
      },
      pullServiceOptions (item, govAgencyCode) {
        var vm = this
        if (vm.userLoginInfomation && vm.userLoginInfomation['verification'] && String(vm.userLoginInfomation['verification']) === '2') {
          vm.dialogVerifycation = true
        } else {
          vm.serviceConfigSelect = item
          vm.govAgencyCodeSelect = govAgencyCode
          vm.serviceInfoIdSelect = item.serviceInfoId
          vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
            vm.serviceOptions = result
            if (result.length === 1) {
              vm.selectOption = false
              vm.$store.dispatch('getServiceInfo', {
                serviceInfoId: item.serviceInfoId
              }).then(resServiceInfo => {
                let data = {
                  serviceCode: resServiceInfo.serviceCode,
                  govAgencyCode: govAgencyCode,
                  templateNo: result[0].templateNo,
                  originality: vm.getOriginality(),
                  j_captcha_response: ''
                }
                if (!vm.isOffLine) {
                  vm.$store.dispatch('postDossier', data).then(function (result) {
                    vm.loadingAction = false
                    vm.indexAction = -1
                    vm.$router.push({
                      path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
                      query: vm.$router.history.current.query
                    })
                  })
                } else {
                  vm.dataPostDossier = data
                  vm.$refs.captcha.makeImageCap()
                  vm.dialog_captcha = true
                }
              })
            } else {
              vm.serviceOptionsProcess = result
              vm.selectOption = true
            }
          }).catch(result => {
            vm.serviceOptions = []
          })
        }
      },
      selectServiceOption (item, govAgencyCode, itemServiceConfig) {
        var vm = this
        vm.serviceConfigSelect = itemServiceConfig
        vm.govAgencyCodeSelect = govAgencyCode
        vm.serviceInfoIdSelect = itemServiceConfig.serviceInfoId
        vm.loadingMutiple = true
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceConfigSelect.serviceInfoId
        }).then(resServiceInfo => {
          let data = {
            serviceCode: resServiceInfo.serviceCode,
            govAgencyCode: govAgencyCode,
            templateNo: item.templateNo,
            originality: vm.getOriginality(),
            j_captcha_response: ''
          }
          if (!vm.isOffLine) {
            vm.$store.dispatch('postDossier', data).then(function (result) {
              vm.loadingAction = false
              vm.indexAction = -1
              vm.$router.push({
                path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
                query: vm.$router.history.current.query
              })
            })
          } else {
            vm.dataPostDossier = data
            vm.$refs.captcha.makeImageCap()
            vm.dialog_captcha = true
          }
        })
      },
      selectServiceOptionCRD (item, govAgencyCode) {
        var vm = this
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceInfoIdSelect
        }).then(resServiceInfo => {
          let data = {
            serviceCode: resServiceInfo.serviceCode,
            govAgencyCode: govAgencyCode,
            templateNo: item.templateNo,
            originality: vm.getOriginality()
          }
          vm.$store.dispatch('postDossier', data).then(function (result) {
            vm.loadingAction = false
            vm.indexAction = -1
            vm.$router.push({
              path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
              query: vm.$router.history.current.query
            })
          })
        })
      },
      doCreateDossier () {
        let vm = this
        vm.$refs.formCaptcha.resetValidation()
        let captchaInput = vm.$refs.captcha.j_captcha_response
        if (vm.$refs.formCaptcha.validate()) {
          vm.dataPostDossier['j_captcha_response'] = captchaInput
          vm.createDossier(vm.dataPostDossier)
        }
      },
      createDossier (data) {
        let vm = this
        vm.$store.dispatch('postDossier', data).then(function (result) {
          if (result['status'] !== undefined && result['status'] === 203) {
            vm.loadingAction = false
            toastr.clear()
            toastr.error('Mã captcha không chính xác. Vui lòng thử lại')
            vm.$refs.captcha.makeImageCap()
          } else {
            vm.loadingAction = false
            vm.dialog_captcha = false
            vm.indexAction = -1
            vm.$router.push({
              path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.data.dossierId + '/NEW',
              query: vm.$router.history.current.query
            })
          }
        }).catch (function (reject) {
          toastr.error('Nộp hồ sơ không thành công')
          vm.$refs.captcha.makeImageCap()
        })
      },
      getColor (level) {
        if (level === 2) {
          return 'green'
        } else if (level === 3) {
          return 'orange'
        } else if (level === 4) {
          return 'red'
        }
      },
      goBack () {
        window.history.back()
      },
      convertString(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        str = str.replace(/đ/g, 'd')
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
        str = str.replace(/Đ/g, 'D')
        str = str.toLocaleLowerCase().replace(/\s/g, '')
        return str
      }
    }
  }
</script>
