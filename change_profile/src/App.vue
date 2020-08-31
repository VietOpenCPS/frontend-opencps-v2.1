<template>
  <v-app id="app_user_profile" :class='{"close__drawer_bbat": !drawer}'>
    <v-navigation-drawer app clipped floating width="310" v-if="false">
    </v-navigation-drawer>
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
