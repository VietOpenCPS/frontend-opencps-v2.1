<template>
  <v-app id="app_dynamic_report">
    <v-navigation-drawer app clipped floating width="240"
      :class='{"detail_state": detailState !== 0}'
    >
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="7" />
      </content-placeholders>
      <v-list v-else class="py-0 nav_trang_thai_ho_so">
        <v-list-group
          v-for="(item, index) in trangThaiHoSoList"
          v-model="item.active"
          :key="index"
          prepend-icon="description"
          :append-icon="item.hasOwnProperty('items') ? '' : ''"
          no-action
          ref="listGroupCustom"
        >
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      isCallBack: true,
      trangThaiHoSoList: [],
      loading: true,
      currentStep: '0',
      counterData: [],
      detailState: 0
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      activeGetCounter () {
        return this.$store.getters.activeGetCounter
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.loading = true
        vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
          vm.loading = false
          if (result) {
            vm.trangThaiHoSoList = result
            let currentParams = vm.$router.history.current.params
            if (Array.isArray(vm.trangThaiHoSoList) && vm.trangThaiHoSoList.length > 0) {
              if (!currentParams.hasOwnProperty('index') && !currentParams.hasOwnProperty('serviceCode')) {
                vm.trangThaiHoSoList[0]['active'] = true
               vm.$router.push({
                  path: vm.pathLanding + '/0',
                  query: {
                    q: vm.trangThaiHoSoList[0]['queryParams']
                  }
                })
              } else {
                vm.trangThaiHoSoList[currentParams.index]['active'] = true
              }
            }
            vm.loadingCounter()
            vm.loading = false
          }
        })
      })
    }
  }
</script>
