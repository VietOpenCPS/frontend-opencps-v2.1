<template>
  <v-app id="app_voting">
    <v-navigation-drawer app clipped floating width="310" v-if="!viewMobile">
      12312313
    </v-navigation-drawer>
    <v-content>
      768657656757
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  
  import { isMobile } from 'mobile-device-detect'
  export default {
    data: () => ({
    })
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
