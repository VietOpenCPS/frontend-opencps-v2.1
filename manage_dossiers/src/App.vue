<template>
  <v-app id="app_manager_dossiers" style="padding: 10px;">
    <v-navigation-drawer app clipped floating width="0">
    </v-navigation-drawer>
    <v-content>
      <Landing/>
    </v-content>
  </v-app>
</template>

<script>
import Landing from '../src/components/screens/Landing';

export default {
  name: 'App',

  components: {
    Landing,
  },

  data: () => ({
    //
  }),
};
</script>
