<template>
  <v-app>
    
    <v-content>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>
  import router from '@/router'
  export default {
    data: () => ({
      danhSachBaoCao: [],
      isCallBack: true
    }),
    computed: {
    },
    created () {
    },
    updated () {
    },
    watch: {
    },
    methods: {
    }
  }
</script>
