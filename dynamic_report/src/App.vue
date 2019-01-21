<template>
  <v-app id="app_dynamic_report">
    <v-navigation-drawer app clipped floating width="240">
      <v-list class="py-0">
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    })
  }
</script>
