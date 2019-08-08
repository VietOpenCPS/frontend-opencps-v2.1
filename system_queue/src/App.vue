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
      },
      serverConfig () {
        return this.$store.getters.getServerConfig
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
      let vm = this
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let filter = {
          serverNo: 'EFORM_DVC'
        }
        vm.$store.dispatch('getServerConfig', filter).then(function (result) {
          try {
            let config = JSON.parse(result.configs)
            vm.$store.commit('setServerConfig', config)
            console.log('serverConfig', vm.serverConfig)
          } catch (error) {
          }
        }).catch(function (reject) {
          let config = ''
          vm.$store.commit('setServerConfig', config)
        })
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

