<template>
  <v-app id="app_register">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    }),
    computed: {
      currentIndex () {
        return this.$store.getters.index
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        console.log('current 11', current)
        console.log('newQuery', newQuery)
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
    }
  }
</script>
