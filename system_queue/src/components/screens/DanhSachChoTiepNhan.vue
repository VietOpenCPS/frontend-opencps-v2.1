<template>
  <v-card flat color="#1867c0" id="contain-ctn" class="pb-4">
    <v-flex xs12 class="header_login text-xs-center pt-3">
      <div class="logo d-inline-block">
        <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png"> 
        <h1 style="font-size:34px; color: #ffffff" class="text-bold">CỤC LÃNH SỰ</h1>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center" style="margin-top: 20px; margin-bottom: 40px">
      <h1 style="font-size:32px; color: yellow" class="text-bold">DANH SÁCH XẾP HÀNG NỘP HỒ SƠ</h1>
    </v-flex>
    <v-layout wrap>
      <v-flex class="column-danhsachcho">
        <v-flex xs12 class="text-xs-center title mx-4 py-3" style="min-height:100px">
          <h1 style="font-size:32px; color: white;" class="text-bold">THÔNG BÁO</h1>
        </v-flex>
        <v-flex xs12 class="text-xs-center title mx-4 py-3" style="min-height:2000px;border-bottom:2px solid #d3d3d3">

        </v-flex>
      </v-flex>
      <v-flex class="column-danhsachcho">
        <v-flex xs12 class="text-xs-center title mx-4 py-3">
          <h1 style="font-size:32px; color: white" class="text-bold">CÁC THỦ TỤC HÀNH CHÍNH TẠI CƠ QUAN TRONG NƯỚC</h1>
        </v-flex>
        <table-cho-tiep-nhan :applicantList="applicantList"></table-cho-tiep-nhan>
      </v-flex>
      <v-flex class="column-danhsachcho">
        <v-flex xs12 class="text-xs-center title mx-4 py-3" >
          <h1 style="font-size:32px; color: white" class="text-bold">CÁC THỦ TỤC HÀNH CHÍNH TẠI CƠ QUAN TRONG NƯỚC</h1>
        </v-flex>
        <table-cho-tiep-nhan :applicantList="applicantList"></table-cho-tiep-nhan>
      </v-flex>
      <v-flex class="column-danhsachcho">
        <v-flex xs12 class="text-xs-center title mx-4 py-3" >
          <h1 style="font-size:32px; color: white" class="text-bold">CÁC THỦ TỤC HÀNH CHÍNH TẠI CƠ QUAN TRONG NƯỚC</h1>
        </v-flex>
        <table-cho-tiep-nhan :applicantList="applicantList"></table-cho-tiep-nhan>
      </v-flex>
      <v-flex class="column-danhsachcho">
        <v-flex xs12 class="text-xs-center title mx-4 py-3" >
          <h1 style="font-size:32px; color: white" class="text-bold">CÁC THỦ TỤC HÀNH CHÍNH TẠI CƠ QUAN TRONG NƯỚC</h1>
        </v-flex>
        <table-cho-tiep-nhan :applicantList="applicantList"></table-cho-tiep-nhan>
      </v-flex>
      
    </v-layout>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
import TableChoTiepNhan from './TableChoTiepNhan.vue'
Vue.use(toastr)
export default {
  props: [],
  components: {
    'table-cho-tiep-nhan': TableChoTiepNhan
  },
  data: () => ({
    applicantList: [
      {
        formCode: 143983123,
        applicantName: 'Trần Văn Duẩn',
        counter: '02'
      },
      {
        formCode: 123983123,
        applicantName: 'Trần Viết Lãm',
        counter: '04'
      },
      {
        formCode: 123483123,
        applicantName: 'Trịnh Công Trình',
        counter: '01'
      },
      {
        formCode: 123984523,
        applicantName: 'Nguyễn Tấn Dũng',
        counter: '05'
      },
      {
        formCode: 123933123,
        applicantName: 'Nông Đức Mạnh'
      },
      {
        formCode: 123922123,
        applicantName: 'Trần Văn Duẩn'
      },
      {
        formCode: 123548123,
        applicantName: 'Trần Đức Lương'
      },
      {
        formCode: 143983123,
        applicantName: 'Trần Văn Duẩn'
      },
      {
        formCode: 123983123,
        applicantName: 'Trần Viết Lãm'
      },
      {
        formCode: 123483123,
        applicantName: 'Trịnh Công Trình'
      },
      {
        formCode: 123984523,
        applicantName: 'Nguyễn Tấn Dũng'
      },
      {
        formCode: 123933123,
        applicantName: 'Nông Đức Mạnh'
      },
      {
        formCode: 123922123,
        applicantName: 'Trần Văn Duẩn'
      },
      {
        formCode: 123548123,
        applicantName: 'Trần Đức Lương'
      }
    ]
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
      vm.getDanhSachCho()
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {},
  methods: {
    getDanhSachCho () {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      let filter = {}
      vm.$store.dispatch('getDanhSachCho', filter).then(function (result) {
        if (result.data) {
          vm.applicantList = result.data
        }
      }).catch(reject => {
      })
    }
  }
}
</script>

