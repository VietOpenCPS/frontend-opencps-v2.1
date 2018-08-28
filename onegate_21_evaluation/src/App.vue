<template>
  <v-app>
    <router-view></router-view>
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
      vm.$nextTick(function () {})
    },
    watch: {
      // '$route': function (newRoute, oldRoute) {
      //   let vm = this
      //   let currentParams = newRoute.params
      //   let currentQuery = newRoute.query
      //   console.log('currentParams', currentParams)
      //   if (currentParams.index) {
      //     vm.currentIndex = currentParams.index
      //   }
      //   console.log('workingUnitList', vm.workingUnitList)
      //   let workingUnitSelect = vm.workingUnitList.filter(function (item) {
      //     return item.itemCode === vm.currentIndex
      //   })
      //   console.log('workingUnitSelect', workingUnitSelect)
      //   if (workingUnitSelect && workingUnitSelect.length > 0) {
      //     this.$store.commit('setWorkingUnitSelect', workingUnitSelect[0])
      //   } else {
      //     this.$store.commit('setWorkingUnitSelect', null)
      //   }
      // }
    },
    methods: {}
  }
</script>
