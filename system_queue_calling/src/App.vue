<template>
  <v-app id="app_system_queue_calling" style="border: 1px solid #dedede;max-width:1300px;margin:0 auto">
    <v-navigation-drawer app clipped floating width="265" v-if="!isMobile">
      <v-list class="py-0">
        <v-list-group
          v-for="(item, index) in menuServiceInfos"
          :key="index"
          :append-icon="''"
          :value="index === activeTab"
        >
          <v-list-tile slot="activator" @click="filterAction(index, item)">
            <v-list-tile-action>
              <v-icon color="#00aeef" 
                v-if="activeTab === index"
              >play_arrow</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
            <span class="status__counter" style="color:#0b72ba!important">
              {{item.counter}}
            </span>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      active: null,
      activeAll: false,
      activeTab: 0,
      pathRouter: '/thu-tuc-hanh-chinh',
      currentAgency: '',
      currentDomain: '',
      currentLevel: '',
      currentMethod: '',
      countAllService: 0,
      isDetail: false,
      text: '',
      menuServiceInfos: [
        {
          id: 1,
          name: 'Tất cả thủ tục',
          children: [],
          counter: 15
        },
        {
          id: 2,
          name: 'Thủ tục cấp hộ chiếu',
          children: [],
          counter: 5
        },
        {
          id: 3,
          name: 'Thủ tục cấp thị thực',
          children: [],
          counter: 10
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
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.currentAgency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
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
          vm.currentDomain = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
        })
        vm.$store.dispatch('getLevelList').then(function (result) {
          vm.menuServiceInfos[2].children = result
          vm.$store.commit('setLevelList', result)
          vm.currentLevel = newQuery.hasOwnProperty('level') ? newQuery.level : ''
        })
        vm.currentMethod = newQuery.hasOwnProperty('level') && String(newQuery.level) === '2' ? 'MC' : newQuery.hasOwnProperty('level') && String(newQuery.level === '3,4') ? 'DVC' : ''
        vm.activeAll = newQuery.hasOwnProperty('all') && newQuery['all']
        vm.getCountAll()
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
      }
    },
    methods: {
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', isMobile)
      },
      filterAction (index, item1) {
        let vm = this
        vm.activeTab = index
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['service'] = item.serviceCode
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
      getCountAll () {
        let vm = this
        let filter = {
          page: 1
        }
        vm.$store.dispatch('getServiceLists', filter).then(function (result) {
          if (result.data) {
            vm.countAllService = result.total
            console.log('countAllService', vm.countAllService)
          }
        }).catch(reject => {
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
