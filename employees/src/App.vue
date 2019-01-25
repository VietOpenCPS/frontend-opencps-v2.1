<template>
  <v-app id="app_employees">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import support from './store/support.json'
  export default {
    props: [],
    data: () => ({
    }),
    computed: {
    },
    created () {
    var vm = this
      vm.$nextTick(function () {
      })
    },
    methods: {
    }
  }
</script>
