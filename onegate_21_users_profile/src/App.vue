<template>
  <v-app>
    <v-content class="user__profile_container">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import router from '@/router'
  export default {
    data: () => ({
      active: null,
      currentAgency: '',
      currentDomain: '',
      currentLevel: ''
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
