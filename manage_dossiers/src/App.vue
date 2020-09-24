<template>
  <v-app id="app_manager_dossiers" style="padding: 10px;">
    <v-navigation-drawer app clipped floating width="0">
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
