<template>
  <v-app id="app_system_queue_calling" style="border: 1px solid #dedede;max-width:1300px;margin:0 auto">
    <!-- <v-navigation-drawer app clipped floating width="265" v-if="!isMobile">
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
    </v-navigation-drawer> -->
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
