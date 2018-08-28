<template>
  <v-app id="app_report">
    <v-navigation-drawer app clipped floating width="240"
    >
      <v-list class="py-0 nav_trang_thai_ho_so">
        <v-list-group
          v-for="(item, index) in danhSachBaoCao"
          v-model="item.active"
          :key="index"
          prepend-icon="description"
          :append-icon="''"
          no-action
          ref="listGroupCustom"
        >
          <v-list-tile slot="activator"
            @click="toTableIndexing(item, index)" >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
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
  import router from '@/router'
  export default {
    data: () => ({
      danhSachBaoCao: [],
      isCallBack: true
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      loadingMenuConfigToDo () {
        return this.$store.getters.loadingMenuConfigToDo
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.danhSachBaoCao = vm.loadingMenuConfigToDo
      })
    },
    updated () {
      var vm = this
      vm.$nextTick(function () {
        let currentParams = vm.$router.history.current.params
        let currentQuerys = vm.$router.history.current.query
        if (vm.isCallBack) {
          vm.isCallBack = false
          let currentIndex = 0
          if (currentParams.hasOwnProperty('index')) {
            currentIndex = currentParams.index
          }
          router.push({
            path: '/bao-cao/' + currentIndex,
            query: {
              renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
            }
          })
        }
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
      toTableIndexing (item, index) {
        this.$store.commit('setIndex', index)
        router.push({
          path: '/bao-cao/' + index,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: item.queryParams
          }
        })
      },
      filterSteps (item) {
      }
    }
  }
</script>
