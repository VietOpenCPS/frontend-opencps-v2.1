<template>
  <v-app id="app2">
    <router-view></router-view>
    <go-top :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  import GoTop from '@inotom/vue-go-top'

  export default {
    props: ['index'],
    data: () => ({
    }),
    components: {
      GoTop
    },
    computed: {
    },
    methods: {
    }
  }
</script>
