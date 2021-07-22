<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Error - permission denied</h1>
        <div class="text-center">
          <v-btn color="primary" v-on:click.native="backToHome">
            Quay lại trang chủ
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  methods: {
    backToHome () {
      let orginURL = window.location.href
      let coma = window.location.href.lastIndexOf('#/')
      if (coma > 0) {
        orginURL = window.location.href.substr(0, coma)
      }
      location.replace(orginURL)
    }
  }
}
</script>
