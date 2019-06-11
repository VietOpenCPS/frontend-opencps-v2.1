<template>
  <v-card flat color="#2585f1" id="contain-dktn" class="">
    <v-flex xs12 class="header_login text-xs-center pt-2">
      <div class="logo d-inline-block">
        <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png"> 
        <h1 style="font-size:34px; color: #ffffff" class="text-bold">CỤC LÃNH SỰ</h1>
      </div>
    </v-flex>
    <!-- <v-flex xs12 class="text-xs-center" style="margin-top: 10px">
      <h1 style="font-size:32px; color: yellow" class="text-bold">ĐĂNG KÝ TIẾP NHẬN HỒ SƠ TỰ ĐỘNG</h1>
    </v-flex> -->
    <v-layout wrap style="font-size:32px; color: white;max-width:1000px;margin: 0 auto">
      <v-flex xs12 class="text-xs-center mt-4">
        <v-card color="#ffffff" width="480px" class="py-3 d-inline-block">
          <img :src="'/documents/' + groupId + '/0/barcode.png'" alt="" width="480px" height="170px">
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-3" style="visibility: hidden;">
        <v-layout wrap>
          <v-flex style="max-width: 300px">
            <span>MÃ TỜ KHAI:</span>
          </v-flex>
          <v-flex>
            <v-text-field
              v-model="eformInformation.eformNo"
              height="46px"
              class="ml-3"
              autofocus
              flat
              solo
              color="primary"
              style="font-size: 32px"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex v-if="isActive" xs12 class="mt-4 text-xs-center" style="color:yellow">
        <span>
          TỜ KHAI CỦA QUÝ KHÁCH ĐÃ ĐƯỢC TIẾP NHẬN
        </span><br>
        <span>
          VUI LÒNG ĐỢI GỌI TÊN ĐỂ ĐƯỢC XỬ LÝ. XIN CẢM ƠN !
        </span>
      </v-flex>
      <v-flex v-else xs12 class="mt-5 text-xs-center" style="color:yellow">
        <span>
          Xin mời quý khách xác nhận tờ khai trực tuyến để xếp hàng 
        </span><br>
        <span>
          Please confirm your booking online here to do
        </span>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    eformInformation: {
      eformNo: '',
      applicantName: ''
    },
    isActive: false,
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      $('header').css('display','none')
      $('#banner').css('display','none')
      $('.navbar-container').css('display','none')
      $('#footer').css('display','none')
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {},
  methods: {
  }
}
</script>

