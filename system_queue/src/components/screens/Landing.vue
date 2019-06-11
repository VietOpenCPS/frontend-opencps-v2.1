<template>
  <v-card flat color="#2585f1" id="contain-control" class="">
    <v-flex xs12 class="header_login text-xs-center pt-2">
      <div class="logo d-inline-block">
        <!-- <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png">  -->
        <h1 style="font-size:34px; color: #ffffff" class="text-bold">CỤC LÃNH SỰ</h1>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center mt-3 mb-5" >
      <h1 style="font-size:32px; color: yellow" class="text-bold">ĐIỀU KHIỂN HỆ THỐNG HIỂN THỊ</h1>
    </v-flex>
    <v-layout wrap style="font-size:24px; color: white;max-width:1200px;margin: 0 auto">
      <v-flex xs3 class="text-xs-center" @click="goTo(1)">
        <img :src="'/documents/' + groupId + '/0/layso.png'" alt="" width="250px" height="150px">
        <div class="mt-2">LẤY SỐ XẾP HÀNG</div>
      </v-flex>
      <v-flex xs3 class="text-xs-center" @click="goTo(2)">
        <img :src="'/documents/' + groupId + '/0/danhsachcho.png'" alt="" width="250px" height="150px">
        <div class="mt-2">DANH SÁCH CHỜ</div>
      </v-flex>
      <v-flex xs3 class="text-xs-center"  @click="goTo(3)">
        <img :src="'/documents/' + groupId + '/0/dhxh.png'" alt="" width="250px" height="150px">
        <div class="mt-2">SỐ ĐANG TIẾP NHẬN</div>
      </v-flex>
      <v-flex xs3 class="text-xs-center"  @click="goTo(4)">
        <img :src="'/documents/' + groupId + '/0/kios.png'" alt="" width="250px" height="150px">
        <div class="mt-2">KIOSK TRA CỨU</div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    groupId: window.themeDisplay.getScopeGroupId()
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      $('header').css('display','block')
      $('#banner').css('display','block')
      $('.navbar-container').css('display','block')
      $('#footer').css('display','block')
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
  },
  methods: {
    goTo(val) {
      let vm = this
      if (val === 1) {
        vm.$router.push({
          path: '/lay-so-tu-dong'
        })
      } else if (val === 2) {
        vm.$router.push({
          path: '/danh-sach-cho-tiep-nhan'
        })
      } else if (val === 3) {
        vm.$router.push({
          path: '/dieu-hanh-xep-hang'
        })
      } else if (val === 4) {
        window.location.href = '/web/cong-dich-vu-cong-bo-ngoai-giao/kios#/'
      }
    }
  }
}
</script>
