<template>
  <v-app id="app_deliverable">
    <v-navigation-drawer app clipped floating width="0">
    </v-navigation-drawer>
    <v-content style="max-width: 1500px; margin: 0 auto;min-width: 1300px;">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    props: [],
    data: () => ({
      dialog: false,
      drawer: null,
      dataSocket: {},
      keywordFilter: '',
      functionTimeOut: null
    }),
    created () {
      let vm = this
      vm.$nextTick(function () {
      })
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypesFilter
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        
      }
    },
    methods: {
        
    }
  }
</script>