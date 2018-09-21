<template>
  <v-app>
    <v-navigation-drawer app clipped floating width="310">
      <v-tabs v-model="active" color="#fff" slider-color="#fff0">
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
                  <v-list-tile-title v-text="item.administrationName"></v-list-tile-title>
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
  
    <v-content class="ml-2">
      <router-view></router-view>
    </v-content>
  
  </v-app>
</template>

<script>
  import router from '@/router'
  export default {
    data: () => ({
      active: null,
      currentAgency: '',
      currentDomain: '',
      currentLevel: '',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }),
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
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$store.dispatch('getGovAgency').then(function (result) {
          vm.$store.commit('setAgencyList', result)
          if (vm.govAgencyList.length > 0) {
            vm.currentAgency = vm.govAgencyList[0].administrationCode
            let queryString = '?'
            newQuery['page'] = 1
            newQuery['agency'] = vm.govAgencyList[0].administrationCode
            for (let key in newQuery) {
              if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
                queryString += key + '=' + newQuery[key] + '&'
              }
            }
            router.push({
              path: '/thu-tuc-hanh-chinh' + queryString,
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
          }
        })
        vm.$store.dispatch('getDomain').then(function (result) {
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
        router.push({
          path: '/thu-tuc-hanh-chinh' + queryString,
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
        router.push({
          path: '/thu-tuc-hanh-chinh' + queryString,
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
        router.push({
          path: '/thu-tuc-hanh-chinh' + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }
    }
  }
</script>
