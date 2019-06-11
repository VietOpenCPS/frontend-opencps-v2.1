<template>
  <v-card flat color="#fff" class="pb-4" style="height:100vh">
    <h2 class="text-xs-center py-4 primary--text">TẠO TỜ KHAI THÀNH CÔNG !</h2>
    <div class="px-3" style="font-size:16px">
      <p class="mb-2 text-bold">Tên tờ khai: <span class="ml-2 primary--text">{{fileTemplateSelected.templateName}}</span></p>
      <p class="mb-2 text-bold">Mã tờ khai: <span class="ml-2 primary--text">{{eformDetail.eFormNo }}</span></p>
      <p class="text-bold">Mã xác thực: <span class="ml-2 primary--text">{{eformDetail.secret}}</span></p>
      <span class="mr-2"><v-icon color="warning">warning</v-icon></span>
      <i>Vui lòng ghi lại Mã tờ khai, mã xác thực để tra cứu, sửa, in lại tờ khai khi cần thiết!</i>
      <div class="mt-3">
        <v-btn color="success" class="white--text" @click="downloadEform">
          <v-icon>visibility</v-icon> &nbsp;
          Xem trước
        </v-btn>
        <v-btn color="primary" class="ml-3 white--text" @click="downloadEform">
          <v-icon>cloud_download</v-icon> &nbsp;
          Tải xuống
        </v-btn>
      </div>
      <p class="mt-4">
        Để hoàn tất thủ tục, đề nghị mang Tờ khai này cùng các giấy tờ theo quy định đến Cục Lãnh sự 
        hoặc Sở Ngoại vụ Thành phố Hồ Chí Minh hoặc Ngoại vụ địa phương hoặc 
        Cơ quan đại diện để xin chứng nhận/ hợp pháp hóa lãnh sự. 
        Tờ khai này chỉ có giá trị hiệu lực trong vòng 10 ngày làm việc. Quá thời hạn trên nếu chưa nộp tờ khai đề nghị kê khai tờ khai mới.
      </p>
    </div>
    <v-flex xs12 class="text-xs-right mt-3">
      <v-btn color="primary" class="ml-3 white--text" @click="goBack">
        <v-icon>reply</v-icon> &nbsp;
        Quay lại
      </v-btn>
    </v-flex>
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
      if (!vm.eformDetail.secret && !vm.eformDetail.eFormNo) {
        vm.goBack()
      }
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
    downloadEform () {
      let vm = this
      vm.$store.dispatch('downloadEform', vm.eformDetail)
    },
    goBack () {
      let vm = this
      vm.$router.push({
        path: '/',
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    }
  }
}
</script>
