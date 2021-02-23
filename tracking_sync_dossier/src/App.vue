<template>
  <v-app id="app_tracking_sync_dossier" style="padding: 10px;">
    <v-navigation-drawer app clipped floating width="0" v-if="false">
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
