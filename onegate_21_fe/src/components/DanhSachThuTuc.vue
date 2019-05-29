<template>
  <div>
    <div class="text-center mt-4" v-if="String(serviceCode) !== '0' && !selectOption">
      <v-progress-circular
        :size="100"
        :width="1"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p class="mt-4">đang tạo hồ sơ ...</p>
    </div>
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
      <!-- <v-flex xs4 class="px-2">
        <v-autocomplete
          class="select-border"
          :items="levelList"
          v-model="levelSelected"
          placeholder="Chọn mức độ"
          item-text="levelName"
          item-value="level"
          :hide-selected="true"
          @change="changeLevel"
          clearable
          box
        >
        </v-autocomplete>
      </v-flex> -->
    </v-layout>
    <v-divider class="my-0 py-0"></v-divider>
    <v-expansion-panel v-if="!domainFilter && !activeFilterKey" class="expand__select__gov" v-model="panelAgency" expand>
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
    <v-card v-if="domainFilter">
      <v-card-text class='grey lighten-3 px-0 py-0'>
        <v-expansion-panel class="expand__select__domain" v-model="panelDomainList" expand>
          <v-expansion-panel-content class="blue darken-3" v-for='(itemDomain, index2) in domainListRender' :key='index2' :value="true">
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
    <v-card v-if="activeFilterKey">
      <v-card-text class="card__text__gov" v-for='(itemServiceConfig, index3) in serviceConfigListRender' :key='index3'>
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
    </v-card>
  </div>
</template>

<script>
  
  export default {
    props: ['serviceCode'],
    data: () => ({
      govAgencyList: [],
      govAgencyFilter: '',
      domainList: [],
      domainListRender: [],
      panelDomainList: [true],
      domainFilter: '',
      panelAgency: [],
      panelDomain: [],
      govAgencies: [],
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
      loadingMutiple: true
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      }
    },
    created () {
      var vm = this
      vm.$store.dispatch('loadServiceConfigsGov', {}).then(result => {
        vm.govAgencies = result
        vm.govAgencyRender = vm.govAgencies
        vm.govAgencyList = []
        for (let index in vm.govAgencies) {
          let item = {
            govAgencyCode: vm.govAgencies[index]['govAgencyCode'],
            govAgencyName: vm.govAgencies[index]['govAgencyName']
          }
          vm.govAgencyList.push(item)
          vm.domainList = []
          let itemDomain = vm.govAgencies[index]['domains']
          for (let index2 in itemDomain) {
            let item2 = {
              domainCode: itemDomain[index2]['domainCode'],
              domainName: itemDomain[index2]['domainName'],
              serviceConfigs: itemDomain[index2]['serviceConfigs']
            }
            vm.domainList.push(item2)
            vm.serviceConfigList = []
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
            vm.serviceConfigListRender = vm.serviceConfigList
          }
          vm.domainListRender = vm.domainList
        }
        // 
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
      }
    },
    methods: {
      changeFilterAgency () {
        let vm = this
        vm.domainFilter = ''
        vm.serviceNameKey = ''
        vm.activeFilterKey = false
        vm.filterService()
      },
      changeFilterDomain () {
        let vm = this
        vm.govAgencyFilter = ''
        vm.serviceNameKey = ''
        vm.activeFilterKey = false
        vm.filterService()
      },
      filterServiceName () {
        let vm = this
        if (vm.serviceNameKey && vm.serviceNameKey.length > 3) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.activeFilterKey = true
          vm.filterService()
        } else {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.activeFilterKey = false
        }
      },
      filterService () {
        let vm = this
        setTimeout (function () {
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          newQuery['agency'] = vm.govAgencyFilter
          newQuery['domain'] = vm.domainFilter
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
        }, 200)
      },
      filterAndSort () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
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
          } else {
            vm.serviceOptionsProcess = result
            vm.selectOption = true
          }
        }).catch(result => {
          vm.serviceOptions = []
        })
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
