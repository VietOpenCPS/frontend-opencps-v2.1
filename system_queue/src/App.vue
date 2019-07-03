<template>
  <v-app id="system_queue" style="width:100%;margin:0 auto">
    <v-content>
      <router-view></router-view>
    </v-content>
    <!-- <v-btn class="go-home-btn" @click="goHome" fab color="white" title="Trang chủ">
      <v-icon size="32" color="primary">home</v-icon>
    </v-btn> -->
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'
  import axios from 'axios'
  export default {
    data: () => ({
    }),
    components: {
      GoTop
    },
    computed: {
      currentIndex () {
        return this.$store.getters.index
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
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
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 1024
        vm.$store.commit('setIsMobile', isMobile)
      }
    }
  }
</script>

