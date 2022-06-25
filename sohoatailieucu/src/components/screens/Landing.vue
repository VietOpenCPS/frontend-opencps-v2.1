<template>
    <div>
      <div class="content-wrapper">
      </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  Vue.use(toastr)

  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    data: () => ({
      listDonVi: [],
      donviSelect: ''
    }),
    components: {

    },
    computed: {
      
    },
    beforeDestroy () {

    },
    mounted () {
     let vm = this
    },
    beforeCreate() {

    },
    created () {
        let vm = this
    },
    watch: {
    },
    methods: {
    }
  }
</script>

