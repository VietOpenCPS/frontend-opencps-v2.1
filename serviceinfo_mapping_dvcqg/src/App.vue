<template>
  <v-app id="app_serviceinfo_mapping" style="border: 1px solid #dedede;max-width:1300px;margin:0 auto">
    <v-content>
      <router-view></router-view>
    </v-content>
    <go-top v-if="isMobile" :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
      
    }),
    components: {
      GoTop
    },
    computed: {
      
    },
    beforeDestroy () {
    },
    mounted () {
    },
    created () {
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
<style>

</style>
