<template>
  <v-app id="app" :class='{"theme--dark": true, "close__drawer_bbat": !drawer}'>
    <v-content>
        <router-view></router-view>
    </v-content>
    <go-top :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'
  import axios from 'axios'
  export default {
    data: () => ({}),
    components: {
      GoTop
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      drawer () {
        return this.$store.getters.drawer
      }
    },
    created () {
      let vm = this
      axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId()).then(function(response) {
        let userData = response.data
        vm.$store.commit('setUserLogin', userData)
      })
      .catch(function(error) {
      })
    }
  }
</script>
