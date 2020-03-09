<template>
  <v-app id="app_report_charts" style="padding: 10px;">
    <v-content>
      <Landing/>
    </v-content>
  </v-app>
</template>

<script>
import Landing from './screens/Landing';

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
