<template>
  <v-app id="app_dynamic_report">

    <v-navigation-drawer class="login_drawer" v-model="drawer" app clipped floating>
      ada
    </v-navigation-drawer>

  </v-app>
</template>

<script>
  import axios from 'axios'
  import toastr from 'toastr'
  import TemplateRendering from './template_rendering.vue'
  import { templateDefault, testData } from './DefaultTemplate.js'
  toastr.options = {
    'closeButton': true,
    'timeOut': '15000'
  }
  export default {
    data: () => ({
      drawer: false
    })
  }
</script>
