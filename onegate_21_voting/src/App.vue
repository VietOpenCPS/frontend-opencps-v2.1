<template>
  <div>
    <v-app>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  import router from '@/router'
  export default {
    data: () => ({
      workingUnitList: [],
      currentIndex: 0,
      loading: true
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {})
    },
    watch: {
    },
    methods: {}
  }
</script>
