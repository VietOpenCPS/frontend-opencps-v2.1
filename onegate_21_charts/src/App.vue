<template>
  <v-app>
    
    <v-content>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  import router from '@/router'
  export default {
    data: () => ({
      isCallBack: true,
      danhSachBaoCao: []
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
        console.log(currentParams)
        if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
          vm.isCallBack = false
          vm.danhSachBaoCao = vm.loadingMenuConfigToDo
          vm.danhSachBaoCao[currentParams.index]['active'] = true
          let currentIndex = 0
          if (currentParams.hasOwnProperty('index')) {
            currentIndex = currentParams.index
          }
          router.push({
            path: '/bao-cao/' + currentIndex
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
