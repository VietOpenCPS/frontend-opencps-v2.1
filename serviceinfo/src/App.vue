<template>
  <v-app id="app_serviceinfo">
    <v-navigation-drawer app clipped floating width="310" v-if="!viewMobile">
      <v-list class="py-0">
        <v-list-group
          v-for="(item, index) in menuServiceInfos"
          :key="index"
          prepend-icon="description"
          :value="index === activeTab"
        >
          <v-list-tile slot="activator">
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-for="(item1, index1) in item['children']" :key="index1">
            <v-list-tile-action>
              <v-icon color="primary" 
                v-if="String(currentAgency) === String(item1[item.mappingCode])||String(currentDomain) === String(item1[item.mappingCode])||String(currentLevel) === String(item1[item.mappingCode])"
              >play_arrow</v-icon>
            </v-list-tile-action>
            <v-list-tile-content @click="filterAction(index, item1)">
              <v-list-tile-title v-text="item1[item.mappingName]" style="width: calc(100% - 45px)" :title="item1[item.mappingName]"></v-list-tile-title>
              <span class="status__counter" style="color:#0b72ba">
                {{item1[item.mappingCount]}}
              </span>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
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
      activeTab: 0,
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentDomain: '',
      currentLevel: '',
      isDetail: false,
      text: '',
      menuServiceInfos: [
        {
          id: 1,
          name: 'CƠ QUAN QUẢN LÝ',
          mappingName: 'administrationName',
          mappingCode: 'administrationCode',
          mappingCount: 'count',
          children: []
        },
        {
          id: 2,
          name: 'LĨNH VỰC',
          mappingName: 'domainName',
          mappingCode: 'domainCode',
          mappingCount: 'count',
          children: []
        },
        {
          id: 3,
          name: 'MỨC ĐỘ',
          mappingName: 'levelName',
          mappingCode: 'level',
          mappingCount: 'count',
          children: []
        }
      ],
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
      vm.$nextTick(function () {
        vm.pathRouter = isMobile ? '/m/thu-tuc-hanh-chinh' : '/thu-tuc-hanh-chinh'
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.menuServiceInfos[0].children = result
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
          vm.menuServiceInfos[1].children = result
          vm.$store.commit('setDomainList', result)
        })
        vm.$store.dispatch('getLevelList').then(function (result) {
          vm.menuServiceInfos[2].children = result
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
      filterAction (index, item1) {
        let vm = this
        if (index === 0) {
          vm.filterAgency(item1)
        } else if (index === 1) {
          vm.filterDomain(item1)
        } else if (index === 2) {
          vm.filterLevel(item1)
        }
      },
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
