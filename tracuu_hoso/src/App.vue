<template>
  <v-app id="app_tracuu_hoso" style="background: #fff !important">
    <v-content style="width: 100%;max-width: 1300px;margin: 0 auto">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    created () {
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
    }
  }
</script>
