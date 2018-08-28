<template>
  <v-app id="app_evv11">
    <v-navigation-drawer app clipped floating width="240">
      <div class="row-header my-0 mb-2">
        <div class="row-blue"> CƠ QUAN CHUYÊN MÔN </div> 
      </div>
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="7" />
      </content-placeholders>
      <v-list v-else class="py-0 nav_trang_thai_ho_so overflowComment wrap_working" style="max-height: 500px;overflow: auto;">
        <v-list-tile :class="item.workingUnitId.toString() === currentIndex.toString() ? 'list_item_active' : ''" v-for="item in workingUnitList" :key="item.workingUnitId" @click="fiterWorkingUnit(item)">
          <v-list-tile-action>
            <v-icon size="18" color="primary">account_balance</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-tooltip top>
              <v-list-tile-title slot="activator" v-text="item.name"></v-list-tile-title>
              <span>{{item.name}}</span>
            </v-tooltip>
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
      workingUnitList: [],
      currentIndex: 0,
      loading: true
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$store.dispatch('getWorkingUnit').then(function (result) {
          vm.loading = false
          if (result && result.length > 0) {
            vm.workingUnitList = result
          }
        }).catch(function (reject) {
          vm.loading = false
          vm.workingUnitList = []
        })
        vm.currentIndex = 'all'
        router.push({
          path: '/' + vm.currentIndex
        })
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        // console.log('currentParams', currentParams)
        if (currentParams.index) {
          vm.currentIndex = currentParams.index
        }
        let workingUnitSelect = vm.workingUnitList.filter(function (item) {
          return item.workingUnitId.toString() === vm.currentIndex.toString()
        })
        if (workingUnitSelect && workingUnitSelect.length > 0) {
          this.$store.commit('setWorkingUnitSelect', workingUnitSelect[0])
        } else {
          this.$store.commit('setWorkingUnitSelect', null)
        }
      }
    },
    methods: {
      fiterWorkingUnit (item) {
        this.currentIndex = item.workingUnitId
        router.push({
          path: '/' + item.workingUnitId,
          query: {
            q: item.queryParamsqueryParams
          }
        })
      }
    }
  }
</script>
