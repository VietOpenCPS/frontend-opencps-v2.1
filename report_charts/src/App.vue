<template>
  <v-app id="app_report_charts">
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <!-- <go-top :size="42" bg-color="#0064c7"></go-top> -->
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'

  export default {
    props: ['index'],
    data: () => ({
      dialog: false,
      drawer: null,
      dataSocket: {}
    }),
    components: {
      GoTop
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
      }
    }
  }
</script>
