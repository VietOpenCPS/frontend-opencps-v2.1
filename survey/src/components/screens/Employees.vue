<template>
</template>

<script>

import Vue from 'vue'
export default {
  props: ['itemCode'],
  components: {
  },
  data: () => ({
    govAgencyName: {},
    itemName: '',
    employeeItems: [],
    btnLoading: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    console.log('landing---------', vm.itemCode)
    let currentQuery = vm.$router.history.current.query
    if (currentQuery.hasOwnProperty('itemName')) {
      vm.itemName = currentQuery.itemName
    }
    vm.$nextTick(function () {
      vm.$store.dispatch('loadEmployees', {
        itemCode: vm.itemCode
      }).then(result => {
        vm.employeeItems = result
        if (vm.employeeItems.length > 0) {
          for (var i = 0; i < vm.employeeItems.length; i++) {
            vm.getImageUsers(i, vm.employeeItems[i])
          }
        }
        console.log(vm.employeeItems)
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    getImageUsers (key, item) {
      var vm = this
      vm.$store.dispatch('loadImageEmployee', item).then(result => {
        item['imageUrl'] = result
      }).catch(xhr => {
      })
    },
    viewVotings (item, index) {
      var vm = this
      var query = item
      query['itemName'] = vm.itemName
     vm.$router.push({
        path: '/danh-sach-can-bo/' + vm.itemCode + '/' + item.employeeId,
        query: query
      })
    }
  },
  filters: {
  }
}
</script>
