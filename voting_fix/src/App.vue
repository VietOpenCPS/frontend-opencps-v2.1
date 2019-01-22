<template>
  <v-app id="app_voting">
    <v-content>
      <router-view></router-view>
    </v-content>
    <go-top :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  
  import GoTop from '@inotom/vue-go-top'
  export default {
    data: () => ({
    }),
    components: {
      GoTop
    }
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
