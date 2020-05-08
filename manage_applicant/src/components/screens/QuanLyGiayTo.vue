<template>
  <div>

  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import axios from 'axios'
import $ from 'jquery'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {},
  data: () => ({
    
  }),
  computed: {
    
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let query = vm.$router.history.current.query
      
    })
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    goBack () {
      window.history.back()
    }
  }
}
</script>
