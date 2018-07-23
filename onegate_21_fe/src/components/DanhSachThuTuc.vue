<template>
  <div>
    <v-expansion-panel expand class="expand__select__gov">
      <v-expansion-panel-content v-for='(itemGov, index) in govAgencies' :key='index' value="1">
        <div slot='header' class="ml-3"><v-icon>account_balance</v-icon> {{itemGov.govAgencyName}}</div>
        <v-card>
          <v-card-text class='grey lighten-3 px-0 py-0'>
            <!-- Cap 2 -->
            <v-expansion-panel expand class="expand__select__domain">
              <v-expansion-panel-content v-for='(itemDomain, index2) in itemGov.domains' :key='index2' v-if='itemGov.domains' value="1">
                <div slot='header' style="margin-left: 40px;">{{itemDomain.domainName}}</div>
                <v-card>
                  <v-card-text class="card__text__gov" style="font-size: 13px; margin-left: 38px;">
                    <!-- Cap 3 -->
                    <div slot="header">
                      <v-layout row wrap v-for='(itemServiceConfig, index3) in itemDomain.serviceConfigs' v-if='itemDomain.serviceConfigs' :key='index3'>
                        <v-flex xs12 sm9>
                          <v-subheader style="font-size: 13px; float: left;">
                            <span style="font-weight: bold">{{index3 + 1}}. </span>{{itemServiceConfig.serviceInfoName}}
                          </v-subheader>
                        </v-flex>
                        <v-flex xs12 sm1>
                          <v-subheader style="font-size: 13px; float: left;">
                            Mức {{itemServiceConfig.level}}
                          </v-subheader>
                        </v-flex>
                        <v-flex xs12 sm2 class="text-xs-center">
                          <v-menu left>
                          <v-btn class="mx-0 my-0" slot="activator" small @click="pullServiceOptions(itemServiceConfig, itemGov.govAgencyCode)">
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
