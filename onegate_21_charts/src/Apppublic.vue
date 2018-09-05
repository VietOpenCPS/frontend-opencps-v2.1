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
      isCallBack: true
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
      })
    },
    updated () {
      var vm = this
      vm.$nextTick(function () {
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
      },
      filterSteps (item) {
      }
    }
  }
</script>
