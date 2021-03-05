<template>
  <v-app id="goto_dossiers" style="max-width: 1300px;margin: 0 auto;">
    <v-navigation-drawer app clipped floating width="0">
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios'
  export default {
    data: () => ({
      
    }),
    components: {

    },
    computed: {
      
    },
    beforeDestroy () {

    },
    mounted () {
     
    },
    beforeCreate() {

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

