<template>
  <v-app id="app" :class='{"theme--dark": true, "close__drawer_bbat": !drawer}'>
    <v-content>
        <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({}),
    computed: {
      user () {
        return this.$store.getters.user
      },
      drawer () {
        return this.$store.getters.drawer
      }
    }
  }
</script>
