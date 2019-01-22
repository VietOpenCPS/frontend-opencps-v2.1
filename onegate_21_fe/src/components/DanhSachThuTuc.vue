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
    <v-expansion-panel :value="[true]" expand  v-if="String(serviceCode) === '0' && !selectOption" expand class="expand__select__gov">
      <v-expansion-panel-content v-for='(itemGov, index) in govAgencies' :key='index'>
        <div slot='header' class="ml-3">
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
            <v-expansion-panel :value="[true]" expand  class="expand__select__domain">
              <v-expansion-panel-content v-for='(itemDomain, index2) in itemGov.domains' :key='index2' v-if='itemGov.domains' :value="true">
                <div slot='header' style="margin-left: 14px;">
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
                        <v-menu left>
                        <v-btn flat class="mx-0 my-0" slot="activator" small @click="pullServiceOptions(itemServiceConfig, itemGov.govAgencyCode)">
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
    <!-- Chọn processOption -->
    <div v-if="selectOption">
      <div class="row-header">
        <div class="background-triangle-big"> <span>THÊM MỚI HỒ SƠ</span> </div>
        <!-- <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="serviceOptionsProcess[0].serviceName">
          {{thongTinChiTietHoSo.serviceName}}
        </div> -->
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              Quay lại &nbsp;
              <v-icon size="16">undo</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <v-list class="py-0">
        <template v-for="(item, index) in serviceOptionsProcess" >
          <v-list-tile class="px-2 py-1" :key="index" style="border-bottom: 1px solid #dede;">
            <v-list-tile-content>
              <v-list-tile-title v-html="item.optionName"></v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn color="primary" @click="selectServiceOptionCRD(item, govAgencyCodeSelect)">
                Chọn
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script>
  
  export default {
    props: ['serviceCode'],
    data: () => ({
      govAgencies: [],
      serviceOptions: [],
      serviceConfigSelect: '',
      serviceInfoIdSelect: '',
      serviceOptionsProcess: [],
      selectOption: false,
      govAgencyCodeSelect: '',
      loadingMutiple: true
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      }
    },
    created () {
      var vm = this
      console.log('create------')
      vm.$store.dispatch('loadServiceConfigsGov', {}).then(result => {
        vm.govAgencies = result
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
    },
    methods: {
      pullServiceOptions (item, govAgencyCode) {
        console.log('govAgencyCode++++++++++', govAgencyCode)
        var vm = this
        vm.serviceConfigSelect = item
        vm.govAgencyCodeSelect = govAgencyCode
        vm.serviceInfoIdSelect = item.serviceInfoId
        vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
          if (result.length === 1) {
            vm.selectOption = false
            vm.$store.dispatch('getServiceInfo', {
              serviceInfoId: item.serviceInfoId
            }).then(resServiceInfo => {
              console.log('resServiceInfo+++++++++++', resServiceInfo)
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
            vm.serviceOptions = result
            vm.serviceOptionsProcess = result
            vm.selectOption = true
          }
        })
      },
      selectServiceOption (item, govAgencyCode, itemServiceConfig) {
        var vm = this
        vm.serviceConfigSelect = itemServiceConfig
        vm.govAgencyCodeSelect = govAgencyCode
        vm.serviceInfoIdSelect = itemServiceConfig.serviceInfoId
        vm.loadingMutiple = true
        console.log('govAgencyCode+++++++++++', govAgencyCode)
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceConfigSelect.serviceInfoId
        }).then(resServiceInfo => {
          console.log('resServiceInfo+++++++++++', resServiceInfo)
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
        console.log('govAgencyCode+++++++++++', govAgencyCode)
        vm.$store.dispatch('getServiceInfo', {
          serviceInfoId: vm.serviceInfoIdSelect
        }).then(resServiceInfo => {
          console.log('resServiceInfo+++++++++++', resServiceInfo)
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
      // goBack () {
      //   let vm = this
      //   let currentParams = vm.$router.history.current.params
      //   let currentQuery = vm.$router.history.current.query
      //   vm.$router.push({
      //     path: '/add-dvc/0'
      //   })
      // },
      goBack () {
        window.history.back()
      }
    }
  }
</script>
