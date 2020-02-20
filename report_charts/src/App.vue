<template>
  <v-app id="app_report_charts">
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'

  export default {
    props: ['index'],
    data: () => ({
      dialog: false,
      loadingDelay: false,
      drawer: null,
      dataSocket: {}
    }),
    components: {
      GoTop
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
      if (this.isMobile) {
        $('section#content').css('padding-left', '0px')
      }
    },
    computed: {
      snackbarerror: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarerror
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarerror', newValue)
        }
      },
      snackbarsocket: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarsocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarsocket', newValue)
        }
      },
      isMobile () {
        return this.$store.getters.getIsMobile
      }
    },
    methods: {
      redirectFilter(val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError() {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage() {
        window.location.reload(true)
      },
      deliverableRouter (item) {
        console.log(item)
      },
      changeReportType (data) {
        let vm = this
        for (let key in vm.itemsReports) {
          if (vm.itemsReports[key]['document'] === data) {
            vm.$router.push('/bao-cao/' + vm.itemsReports[key]['code'])
            break
          }
        }
      },
      onResize () {
        let vm = this
        let isMobile = window.innerWidth < 768
        vm.$store.commit('setIsMobile', isMobile)
      },
    }
  }
</script>
