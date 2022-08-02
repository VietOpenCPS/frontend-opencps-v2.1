<template>
  <v-app id="khodientu" style="background-color: #f4f3ef !important;">
    <v-navigation-drawer app clipped floating width="0">
    </v-navigation-drawer>
    <v-content style="padding-top: 25px;">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      activeTab: 1,
      isSigned: window.themeDisplay.isSignedIn()
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
      let vm = this
      
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

