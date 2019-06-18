<template>
  <v-card flat color="#064787" id="contain-control" class="">
    <v-flex xs12 class="header_login text-xs-center pt-2">
      <div class="logo d-inline-block">
        <!-- <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png">  -->
        <div style="font-size:26px; color: #ffffff" class="">BỘ PHẬN TIẾP NHẬN HỒ SƠ VÀ TRẢ KẾT QUẢ</div>
        <v-flex style="line-height: 5px">
          <div class="underline-white" style="width:350px;height:2px"></div>
        </v-flex>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center mt-3 mb-5" >
      <div style="font-size:26px; color: yellow" class="">ĐIỀU KHIỂN HỆ THỐNG HIỂN THỊ</div>
    </v-flex>
    <v-layout wrap style="font-size:24px; color: white;max-width:1200px;margin: 0 auto">
      <v-flex xs4 class="text-xs-center" @click="goTo(1)">
        <img :src="'/documents/' + groupId + '/0/layso.png'" alt="" width="250px" height="150px" style="border: 2px solid #fff;border-radius: 5px;">
        <div class="mt-2">SCREEN-1</div>
      </v-flex>
      <v-flex xs4 class="text-xs-center" @click="goTo(2)">
        <img :src="'/documents/' + groupId + '/0/danhsachcho.png'" alt="" width="250px" height="150px" style="border: 2px solid #fff;border-radius: 5px;">
        <div class="mt-2">SCREEN-2</div>
      </v-flex>
      <v-flex xs4 class="text-xs-center"  @click="goTo(3)">
        <img :src="'/documents/' + groupId + '/0/dhxh.png'" alt="" width="250px" height="150px" style="border: 2px solid #fff;border-radius: 5px;">
        <div class="mt-2">SCREEN-3</div>
      </v-flex>
      <!-- <v-flex xs3 class="text-xs-center"  @click="goTo(4)">
        <img :src="'/documents/' + groupId + '/0/dhxh2.png'" alt="" width="250px" height="150px">
        <div class="mt-2">SCREEN-4</div>
      </v-flex> -->
      <!-- <v-flex xs3 class="text-xs-center"  @click="goTo(4)">
        <img :src="'/documents/' + groupId + '/0/kios.png'" alt="" width="250px" height="150px">
        <div class="mt-2">KIOSK TRA CỨU</div>
      </v-flex> -->
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
          path: '/dieu-hanh-xep-hang?gate=1,2,3,4'
        })
      }
    }
  }
}
</script>
