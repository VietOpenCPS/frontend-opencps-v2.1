<template>
    <div style="padding: 0px 25px; max-width: 1500px; margin: 0px auto; background: #ffffff" class="mt-5 pb-3">
        <div class="content-wrapper" style="width: 100%; height: 500px;border: 1px solid #dedede; background: #ffffff;border-radius: 12px;box-shadow: 0 6px 10px -4px rgb(0 0 0 / 15%)">
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

