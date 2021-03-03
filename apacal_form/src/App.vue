<template>
  <v-app id="app_alpaca_form">
    <v-content>
      <router-view></router-view>
    </v-content>
    <go-top v-if="isMobile" :size="42" bg-color="#0064c7"></go-top>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
    }),
    components: {
    },
    computed: {
    },
    beforeDestroy () {
    },
    mounted () {
      $('header').css('display', 'none !important')
      $('nav').not('.v-toolbar').css('display', 'none !important')
      $('footer').css('display', 'none !important')
      $('body').removeClass('page-theme')
    },
    created () {
      $('header').css('display', 'none !important')
      $('nav').not('.v-toolbar').css('display', 'none !important')
      $('footer').css('display', 'none !important')
      $('body').removeClass('page-theme')
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        $('header').css('display', 'none !important')
        $('nav').not('.v-toolbar').css('display', 'none !important')
        $('footer').css('display', 'none !important')
        $('body').removeClass('page-theme')
      }
    },
    methods: {
    }
  }
</script>
<style>
  .service__info__menu .tabs__container {
    border-bottom: 1px solid #0072c0;
  }
</style>
