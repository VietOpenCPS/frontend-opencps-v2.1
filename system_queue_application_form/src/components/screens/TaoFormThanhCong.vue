<template>
  <v-card flat color="#fff">
    <h2 style="color:green" class="text-xs-center my-4">TẠO TỜ KHAI THÀNH CÔNG !</h2>
    <div class="px-3">
        <p class="mb-2">Tên tờ khai: <span class="text-bold">{{eformDetail.eFormName}}</span></p>
        <p class="mb-2">Mã tờ khai: <span class="text-bold">{{eformDetail. eFormNo }}</span></p>
        <p>Mã xác thực: <span class="text-bold">{{eformDetail.secret}}</span></p>
    </div>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import support from '../../store/support.json'
Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    serviceInfoList: [],
    eformNoSearch: '',
    formScriptEform: ''
  }),
  computed: {
    serviceinfoSelected () {
      return this.$store.getters.getServiceinfoSelected
    },
    fileTemplateSelected () {
      return this.$store.getters.getFileTemplateSelected
    },
    eformDetail () {
      return this.$store.getters.getEformDetail
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    }
  },
  methods: {
    filterEform () {
      let vm = this
    }
  }
}
</script>
