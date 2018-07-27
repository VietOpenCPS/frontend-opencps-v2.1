<template>
  <div>
    <v-expansion-panel expand>
      <v-expansion-panel-content v-for='(itemGov, index) in govAgencies' :key='index'>
        <div slot='header' class="ml-3"><v-icon>fas fa-lock</v-icon> {{itemGov.govAgencyName}}</div>
        <v-card>
          <v-card-text class='grey lighten-3 px-0 py-0'>
            <!-- Cap 2 -->
            <v-expansion-panel expand>
              <v-expansion-panel-content v-for='(itemDomain, index2) in itemGov.domains' :key='index2' v-if='itemGov.domains'>
                <div slot='header' class="ml-4">{{itemDomain.domainName}}</div>
                <v-card>
                  <v-card-text class='' style="font-size: 13px; margin-left: 24px;">
                    <!-- Cap 3 -->
                    <div slot="header">
                      <v-layout row wrap v-for='(itemServiceConfig, index3) in itemDomain.serviceConfigs' v-if='itemDomain.serviceConfigs' :key='index3'>
                        <v-flex xs12 sm9>
                          <span style="font-weight: bold">{{index3 + 1}}. </span>{{itemServiceConfig.serviceInfoName}}
                        </v-flex>
                        <v-flex xs12 sm1>
                          Mức {{itemServiceConfig.level}}
                        </v-flex>
                        <v-flex xs12 sm2 class="text-xs-center">
                          <v-btn outline small color='primary' @click='selectServiceConfig(itemServiceConfig)'>Chọn</v-btn>
                            <v-menu left>
                                <v-btn class="mx-0 my-0" slot="activator" icon @click="pullServiceOptions(props.item)">
                                  <v-icon>Chọn</v-icon>
                                </v-btn>
                                <v-list v-if="serviceOptions.length > 1">
                                  <v-list-tile v-for="(itemOption, i) in serviceOptions" :key="i" 
                                  @click="selectServiceOption(itemOption)">
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
      })
    },
    updated () {
    },
    watch: {
    },
    methods: {
      pullServiceOptions (item) {
        var vm = this
        vm.serviceConfigSelect = item
        vm.$store.dispatch('getServiceOpionByProcess', item).then(result => {
          if (result.length === 1) {
            let data = {
              serviceCode: item.serviceCode,
              govAgencyCode: item.govAgencyCode,
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
          } else {
            vm.serviceOptions = result
          }
        })
      },
      selectServiceOption (item) {
        var vm = this
        let data = {
          serviceCode: vm.serviceConfigSelect.serviceCode,
          govAgencyCode: vm.serviceConfigSelect.govAgencyCode,
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
      }
    }
  }
</script>
