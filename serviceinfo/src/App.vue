<template>
  <v-app id="app_serviceinfo">
    <v-navigation-drawer app clipped floating width="310" v-if="!viewMobile">
      <v-tabs v-model="active" class="service__info__menu">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab key="tab-1" ripple class="primary--text">
          Cơ quan quản lý
        </v-tab>
        <v-tab key="tab-2" ripple class="primary--text">
          Lĩnh vực
        </v-tab>
        <v-tab key="tab-3" ripple class="primary--text">
          Mức độ
        </v-tab>
        <v-tab-item key="tab-1" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-list class="pt-0">
              <v-list-tile v-for="item in govAgencyList" :key="item.administrationCode"
                :class="{'list__tile--active': String(currentAgency) === String(item.administrationCode)}"
                @click="filterAgency(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentAgency) === String(item.administrationCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title style="width: calc(100% - 45px)" :title="item.administrationName" v-text="item.administrationName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item key="tab-2" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-list class="pt-0">
              <v-list-tile v-for="item in domainList" :key="item.domainCode"
                :class="{'list__tile--active': String(currentDomain) === String(item.domainCode)}"
                @click="filterDomain(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentDomain) === String(item.domainCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.domainName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item key="tab-3" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-list class="pt-0">
              <v-list-tile v-for="item in levelList" :key="item.level"
                :class="{'list__tile--active': String(currentLevel) === String(item.level)}"
                @click="filterLevel(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentLevel) === String(item.level)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Mức độ {{item.level}}</v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-navigation-drawer>
    <div v-if="viewMobile && !isDetail">
      <div class="row-header mb-2 py-1" style="background-color: #070f52">
        <div class="ml-2 text-bold white--text"> <span>THỦ TỤC HÀNH CHÍNH</span> </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left white--text" @click="goBack" active-class="temp_active">
              <v-icon size="18">reply</v-icon> &nbsp; Quay lại
            </v-btn>
          </div>
        </div> 
      </div>
      <v-tabs v-model="active" class="service__info__menu">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab key="tab-1" ripple class="primary--text">
          Cơ quan quản lý
        </v-tab>
        <v-tab key="tab-2" ripple class="primary--text">
          Lĩnh vực
        </v-tab>
        <v-tab key="tab-3" ripple class="primary--text">
          Mức độ
        </v-tab>
        <v-tab-item key="tab-1" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card style="max-height:200px;overflow:hidden;overflow-y:scroll">
            <v-list class="pt-0">
              <v-list-tile v-for="item in govAgencyList" :key="item.administrationCode"
                :class="{'list__tile--active': String(currentAgency) === String(item.administrationCode)}"
                @click="filterAgency(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentAgency) === String(item.administrationCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.administrationName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-divider class="mx-0" inset style="background-color:#0072c0a1;width:100%"></v-divider>
        </v-tab-item>
        <v-tab-item key="tab-2" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card style="max-height:200px;overflow:hidden;overflow-y:scroll">
            <v-list class="pt-0">
              <v-list-tile v-for="item in domainList" :key="item.domainCode"
                :class="{'list__tile--active': String(currentDomain) === String(item.domainCode)}"
                @click="filterDomain(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentDomain) === String(item.domainCode)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.domainName"></v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-divider class="mx-0" inset style="background-color:#0072c0a1;width:100%"></v-divider>
        </v-tab-item>
        <v-tab-item key="tab-3" class="list-coquan" transition="fade-transition" reverse-transition="fade-transition">
          <v-card style="max-height:200px;overflow:hidden;overflow-y:scroll">
            <v-list class="pt-0">
              <v-list-tile v-for="item in levelList" :key="item.level"
                :class="{'list__tile--active': String(currentLevel) === String(item.level)}"
                @click="filterLevel(item)"
              >
                <v-list-tile-action>
                  <v-icon color="primary" v-if="String(currentLevel) === String(item.level)">play_arrow</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Mức độ {{item.level}}</v-list-tile-title>
                  <span class="status__counter" style="color:#0b72ba">
                    {{item.count}}
                  </span>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <v-divider class="mx-0" inset style="background-color:#0072c0a1;width:100%"></v-divider>
        </v-tab-item>
      </v-tabs>
    </div>
    <v-content>
      <router-view></router-view>
    </v-content>
    <go-top v-if="viewMobile" :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  
  import { isMobile } from 'mobile-device-detect'
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      active: null,
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentDomain: '',
      currentLevel: '',
      isDetail: false,
      text: ''
    }),
    components: {
      GoTop
    },
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
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
      }
    },
    created () {
      var vm = this
      console.log('isMobile', isMobile)
      vm.$nextTick(function () {
        vm.pathRouter = isMobile ? '/m/thu-tuc-hanh-chinh' : '/thu-tuc-hanh-chinh'
        let current = vm.$router.history.current
        let newQuery = current.query
        console.log('current', current)
        console.log('newQuery', newQuery)
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.$store.commit('setAgencyList', result)
          if ((vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'Landing') && !newQuery.hasOwnProperty('agency')) ||
          (vm.govAgencyList.length > 0 && current.hasOwnProperty('name') && (current.name === 'NotFound') && !newQuery.hasOwnProperty('agency'))
          ) {
            vm.currentAgency = vm.govAgencyList[0].administrationCode
            let queryString = '?'
            newQuery['page'] = 1
            newQuery['agency'] = vm.govAgencyList[0].administrationCode
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
          } else {
            vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
          }
        })
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.$store.commit('setDomainList', result)
        })
        vm.$store.dispatch('getLevelList').then(function (result) {
          vm.$store.commit('setLevelList', result)
        })
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        if (currentParams.hasOwnProperty('index') && currentParams['index']) {
          vm.isDetail = true
        } else {
          vm.isDetail = false
        }
        vm.currentAgency = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
        vm.currentDomain = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
        vm.currentLevel = currentQuery.hasOwnProperty('level') ? currentQuery.level : ''
      }
    },
    methods: {
      filterAgency (item) {
        var vm = this
        vm.currentAgency = item.administrationCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = item.administrationCode
        newQuery['domain'] = ''
        newQuery['level'] = ''
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
      },
      filterDomain (item) {
        var vm = this
        vm.currentDomain = item.domainCode
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = item.domainCode
        newQuery['agency'] = ''
        newQuery['level'] = ''
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
      },
      filterLevel (item) {
        var vm = this
        vm.currentLevel = item.level
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = ''
        newQuery['agency'] = ''
        newQuery['level'] = item.level
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
      },
      goBack () {
        window.history.back()
      }
    }
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
