<template>
  <v-app>
    <v-navigation-drawer app clipped floating width="240">
      <div class="row-header my-2 mt-1">
        <div class="row-blue"> CƠ QUAN CHUYÊN MÔN </div> 
      </div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="7" />
        </content-placeholders>
      <v-list v-else class="py-0 nav_trang_thai_ho_so overflowComment wrap_working" style="max-height: 500px;overflow: auto;">
        <v-list-tile :class="item.workingUnitId === currentIndex ? 'list_item_active' : ''" v-for="item in workingUnitList" :key="item.workingUnitId" @click="toTableIndexing(item)">
          <v-list-tile-action>
            <v-icon size="18" color="primary">account_balance</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
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
      workingUnitList: [
        {
          'workingUnitId': 101,
          'name': 'Sở Xây Dựng'
        },
        {
          'workingUnitId': 102,
          'name': 'Sở Công Thương'
        },
        {
          'workingUnitId': 103,
          'name': 'Sở Tài Nguyên Môi Trường'
        },
        {
          'workingUnitId': 104,
          'name': 'Sở Nội Vụ'
        },
        {
          'workingUnitId': 105,
          'name': 'Sở Nông Nghiệp Và Phát Triển Nông Thôn'
        }
      ],
      currentIndex: 0
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$store.dispatch('getWorkingUnit').then(function (result) {
          if (result && result.length > 0) {
            vm.workingUnitList = result
            vm.currentIndex = vm.workingUnitList[0].workingUnitId
            router.push({
              path: '/danh-gia-can-bo/' + vm.currentIndex
            })
          }
        }).catch(function (reject) {
          vm.workingUnitList = []
        })
      })
    },
    updated () {
      // var vm = this
      // vm.$nextTick(function () {
      //   let currentParams = vm.$router.history.current.params
      //   let currentQuerys = vm.$router.history.current.query
      //   router.push({
      //     path: '/danh-gia-can-bo/' + vm.currentIndex,
      //     query: currentQuerys
      //   })
      // })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        console.log('currentParams', currentParams)
        if (currentParams.index) {
          vm.currentIndex = Number(currentParams.index)
        }
      }
    },
    methods: {
      toTableIndexing (item) {
        this.currentIndex = item.workingUnitId
        router.push({
          path: '/danh-gia-can-bo/' + item.workingUnitId,
          query: {
            q: item.queryParamsqueryParams
          }
        })
      }
    }
  }
</script>
