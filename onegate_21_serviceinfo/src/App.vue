<template>
  <v-app>
    <v-navigation-drawer app clipped floating width="300">
      <v-tabs v-model="tabs" color="transparent">
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#mobile-tabs-5-1" class="primary--text">
          Cơ quan quản lý
        </v-tab>
        <v-tab href="#mobile-tabs-5-2" class="primary--text">
          Lĩnh vực
        </v-tab>
        <v-tab href="#mobile-tabs-5-3" class="primary--text">
          Mức độ
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs" class="white">
        <v-tab-item v-for="i in 3" :key="i" :id="'mobile-tabs-5-' + i" transition="fade-transition" reverse-transition="fade-transition">
          <v-card>
            <v-card-text>{{ text }}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
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
      isCallBack: true,
      tabs: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
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
      filterSteps (item) {}
    }
  }
</script>
