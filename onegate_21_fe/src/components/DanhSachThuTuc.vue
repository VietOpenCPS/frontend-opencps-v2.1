<template>
  <div>
    <div class="text-center mt-4" v-if="String(serviceCode) !== '0'">
      <v-progress-circular
        :size="100"
        :width="1"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <p class="mt-4">đang tạo hồ sơ ...</p>
    </div>
    <v-expansion-panel v-else expand class="expand__select__gov">
      <v-expansion-panel-content v-for='(itemGov, index) in govAgencies' :key='index'>
        <div slot='header' class="ml-3"><v-icon>account_balance</v-icon> {{itemGov.govAgencyName}}</div>
        <v-card>
          <v-card-text class='grey lighten-3 px-0 py-0'>
            <!-- Cap 2 -->
            <v-expansion-panel expand class="expand__select__domain">
              <v-expansion-panel-content v-for='(itemDomain, index2) in itemGov.domains' :key='index2' v-if='itemGov.domains'>
                <div slot='header' style="margin-left: 40px;">{{itemDomain.domainName}}</div>
                <v-card>
                  <v-card-text class="card__text__gov" style="font-size: 13px; margin-left: 38px;">
                    <!-- Cap 3 -->
                    <div slot="header">
                      <v-layout row wrap v-for='(itemServiceConfig, index3) in itemDomain.serviceConfigs' v-if='itemDomain.serviceConfigs' :key='index3' class="center-all ml-2 mb-2">
                        <v-flex xs12 sm9>
                          <span style="font-weight: bold">{{index3 + 1}}.</span> &nbsp;
                          <span>{{itemServiceConfig.serviceInfoName}}</span>
                        </v-flex>
                        <v-flex xs12 sm1 class="text-xs-center">
                          Mức {{itemServiceConfig.level}}
                        </v-flex>
                        <v-flex xs12 sm2 class="text-xs-center">
                          <v-menu left>
                          <v-btn flat class="mx-0 my-0" slot="activator" small @click="pullServiceOptions(itemServiceConfig, itemGov.govAgencyCode)">
                              Chọn
                            </v-btn>
                            <v-list v-if="serviceOptions.length > 1">
                              <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                              @click="selectServiceOption(itemOption, itemGov.govAgencyCode)">
                              <v-list-tile-title>{{ itemOption.optionName }}</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                        </v-flex>
                      </v-layout>
                    </div>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
  import router from '@/router'
  export default {
    props: ['serviceCode'],
    data: () => ({
      govAgencies: [],
      serviceOptions: [],
      serviceConfigSelect: null
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
        if (String(vm.serviceCode) !== '0') {
          for (let key in vm.govAgencies) {
            let govAgencyCode = vm.govAgencies[key].govAgencyCode
            for (let keyDomain in vm.govAgencies[key].domains) {
              for (let keyConfig in vm.govAgencies[key].domains[keyDomain].serviceConfigs) {
                let serviceConfig = vm.govAgencies[key].domains[keyDomain].serviceConfigs[keyConfig]
                let serviceConfigId = serviceConfig.serviceConfigId
                if (String(vm.serviceCode) === String(serviceConfigId)) {
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
        vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
          if (result.length === 1) {
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
                router.push({
                  path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
                  query: vm.$router.history.current.query
                })
              })
            })
          } else {
            vm.serviceOptions = result
          }
        })
      },
      selectServiceOption (item, govAgencyCode) {
        var vm = this
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
            router.push({
              path: '/danh-sach-ho-so/' + 0 + '/ho-so/' + result.dossierId + '/NEW',
              query: vm.$router.history.current.query
            })
          })
        })
      }
    }
  }
</script>
