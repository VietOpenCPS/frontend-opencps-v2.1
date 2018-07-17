<template>
  <v-app>
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
          <v-list-tile slot="activator"
            @click="toTableIndexing(item, index)" >
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <span v-if="item.hasOwnProperty('counter') && item['counter'] > -1" class="status__counter_group status__counter">
                {{item.counter}}
              </span>
              <span v-else class="status__counter_group status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" :key="subItem.stepCode"
            v-on:click.native="filterSteps(subItem)"
            :class="{'list__tile--active': String(currentStep) === String(subItem.stepCode)}"
            >
            <v-list-tile-action>
              <v-icon color="primary" v-if="String(currentStep) === String(subItem.stepCode)">play_arrow</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.menuStepName }}</v-list-tile-title>
              <span v-if="subItem.hasOwnProperty('counter') && subItem['counter'] > -1" class="status__counter">
                {{subItem.counter}}
              </span>
              <span v-else class="status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
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
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.loading = true
        vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
          vm.trangThaiHoSoList = result
          let currentParams = vm.$router.history.current.params
          if (!currentParams.hasOwnProperty('index')) {
            vm.trangThaiHoSoList[0]['active'] = true
            router.push({
              path: '/danh-sach-ho-so/0',
              query: {
                q: vm.trangThaiHoSoList[0]['queryParams']
              }
            })
          } else {
            vm.trangThaiHoSoList[currentParams.index]['active'] = true
          }
          vm.loadingCounter()
          vm.loading = false
        })
      })
    },
    updated () {
      var vm = this
      vm.$nextTick(function () {
        let currentParams = vm.$router.history.current.params
        if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
          vm.isCallBack = false
          vm.$store.commit('setIndex', currentParams.index)
          if (currentParams.hasOwnProperty('id')) {
            vm.detailState = 1
          } else {
            vm.detailState = 0
          }
        }
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('step')) {
          vm.currentStep = String(currentQuery.step)
        } else {
          vm.currentStep = '0'
        }
        if (currentQuery.hasOwnProperty('recount')) {
          vm.loadingCounter()
        }
        if (currentParams.hasOwnProperty('id')) {
          vm.detailState = 1
        } else {
          vm.detailState = 0
        }
      }
    },
    methods: {
      toTableIndexing (item, index) {
        this.$store.commit('setIndex', index)
        router.push({
          path: '/danh-sach-ho-so/' + index,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: item.queryParams
          }
        })
      },
      filterSteps (item) {
        let currentQuery = this.$router.history.current.query
        let currentParams = this.$router.history.current.params
        console.log('currentParams', currentParams)
        console.log('currentQuery', currentQuery)
        let queryString = this.trangThaiHoSoList[currentParams.index].queryParams
        /* test Local */
        /* let queryString = this.trangThaiHoSoList[0].queryParams */
        if (currentQuery !== null && currentQuery !== undefined && currentQuery.hasOwnProperty('q')) {
          let coma = queryString.lastIndexOf('=')
          if (coma > 0) {
            queryString = queryString.substr(0, coma + 1)
          }
        }
        this.currentStep = String(item.stepCode)
        router.push({
          path: '/danh-sach-ho-so/' + currentParams.index,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: queryString + item.stepCode,
            step: item.stepCode
          }
        })
      },
      loadingCounter () {
        let vm = this
        vm.$store.dispatch('loadingCounterHoSo').then(function (result) {
          vm.counterData = result.data
          for (let key in vm.trangThaiHoSoList) {
            vm.trangThaiHoSoList[key]['counter'] = 0
            if (vm.trangThaiHoSoList[key].hasOwnProperty('items')) {
              let parentCount = 0
              for (let keyChild in vm.trangThaiHoSoList[key].items) {
                vm.trangThaiHoSoList[key].items[keyChild]['counter'] = 0
                for (let countKey in vm.counterData) {
                  if (String(vm.counterData[countKey].stepCode) === String(vm.trangThaiHoSoList[key].items[keyChild].stepCode)) {
                    let countCurrent = vm.counterData[countKey].totalCount
                    vm.trangThaiHoSoList[key].items[keyChild]['counter'] = countCurrent
                    parentCount = parentCount + countCurrent
                    break
                  }
                }
              }
              vm.trangThaiHoSoList[key]['counter'] = parentCount
            }
          }
          vm.loading = false
        })
      }
    }
  }
</script>
