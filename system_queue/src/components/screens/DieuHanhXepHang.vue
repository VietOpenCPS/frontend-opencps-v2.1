<template>
  <v-card id="contain-dhxh" flat color="#1867c0">
    <v-flex xs12 class="header_login text-xs-center pt-3">
      <div class="logo d-inline-block">
        <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png"> 
        <h1 style="font-size:34px; color: #ffffff" class="text-bold">CỤC LÃNH SỰ</h1>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center">
      <h1 style="font-size:32px; color: yellow" class="text-bold">
        BẢNG ĐIỀU HÀNH XẾP HÀNG
      </h1>
    </v-flex>
    <v-layout wrap class="mt-5" style="height: calc(100vh - 320px)">
      <v-flex xs3 class="colum-dhxh text-xs-center px-2">
        <div class="py-3">
          <div class="mb-4" style="border-bottom:2px solid #ffff">
            <span class="text-bold">BÀN SỐ</span> <br>
            <v-avatar color="white" class="mt-3 mb-4">
              <span class="red--text headline text-bold">1</span>
            </v-avatar>
          </div>
          <div class="d-inline-block mb-2 text-bold">
            <span>198378312</span> 
          </div>
          <br>
          <span class="text-bold">Trần Văn Duẩn</span>
        </div>
      </v-flex>
      <v-flex xs3 class="colum-dhxh text-xs-center px-2">
        <div class="py-3">
          <div class="mb-4" style="border-bottom:2px solid #ffff">
            <span class="text-bold">BÀN SỐ</span> <br>
            <v-avatar color="white" class="mt-3 mb-4">
              <span class="red--text headline text-bold">2</span>
            </v-avatar>
          </div>
          <div class="d-inline-block mb-2 text-bold">
            <span>198378312</span> 
          </div>
          <br>
          <span class="text-bold">Trần Văn Duẩn</span>
        </div>
      </v-flex>
      <v-flex xs3 class="colum-dhxh text-xs-center px-2">
        <div class="py-3">
          <div class="mb-4" style="border-bottom:2px solid #ffff">
            <span class="text-bold">BÀN SỐ</span> <br>
            <v-avatar color="white" class="mt-3 mb-4">
              <span class="red--text headline text-bold">3</span>
            </v-avatar>
          </div>
          <div class="d-inline-block mb-2 text-bold">
            <span>-- -- --</span> 
          </div>
          <br>
          <span class="text-bold">-- -- --</span>
        </div>
      </v-flex>
      <v-flex xs3 class="colum-dhxh text-xs-center px-2">
        <div class="py-3">
          <div class="mb-4" style="border-bottom:2px solid #ffff">
            <span class="text-bold">BÀN SỐ</span> <br>
            <v-avatar color="white" class="mt-3 mb-4">
              <span class="red--text headline text-bold">4</span>
            </v-avatar>
          </div>
          <div class="d-inline-block mb-2 text-bold">
            <span>198378312</span> 
          </div>
          <br>
          <span class="text-bold">Trần Văn Duẩn</span>
        </div>
      </v-flex>
    </v-layout>

    <!-- <v-layout wrap style="height: calc(100vh - 100px)">
      <v-flex>
        <v-data-table
          id="table-dieuhanhxephang"
          :headers="headers"
          :items="queueList"
          hide-actions
          class="table-landing table-bordered"
        >
          <template slot="items" slot-scope="props">
            <tr style="cursor: pointer;" :style="'height:' + rowHeight + 'px'">
              <td class="text-xs-center text-bold py-2" style="letter-spacing:2px;color:#1867c0;font-weight:600;font-size: 36px !important;" width="200px">
                <div>
                  <span>{{props.item.gateNumber}}</span>
                </div>
              </td>

              <td class="text-xs-center text-bold py-2" width="250px" style="letter-spacing:2px;">
                <div>
                  <span>{{props.item.eFormNo}}</span><br>
                </div>
              </td>
              <td class="text-xs-left text-bold py-2 px-4" width="450px" style="letter-spacing:2px">
                <div style="text-transform: uppercase">
                  <span>{{props.item.applicantName}}</span>
                </div>
              </td>
              
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex style="max-width:400px;">
        <div xs12 class="" style="background:#ededed;width:100%;height:100%;display: table; border-bottom: 1px solid #dedede">
          <div class="logo" style="display: table-cell;
            text-align: center;
            vertical-align: middle;">
            <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png">
            <h1 style="font-size:34px; color: #1867c0" class="text-bold">CỤC LÃNH SỰ</h1>
          </div>
        </div>
      </v-flex>
    </v-layout> -->
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
    rowHeight: 70,
    queueList: [
      {
        gateNumber: '01',
        eFormNo: '1989644',
        applicantName: 'Trần Văn Duẩn'
      },
      {
        gateNumber: '02',
        eFormNo: '1964613',
        applicantName: 'Vũ Văn Nguyên'
      },
      {
        gateNumber: '03',
        eFormNo: '1349644',
        applicantName: 'Nguyễn Nguyên Nam'
      },
      {
        gateNumber: '04',
        eFormNo: '1981225',
        applicantName: 'Vũ Đình Huy'
      }
    ],
    headers: [
      {
        text: 'BÀN SỐ',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'MÃ TỜ KHAI',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'NGƯỜI NỘP',
        align: 'center',
        sortable: false,
        class: 'py-3'
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
      vm.rowHeight = ($( window ).height() - 187) / vm.queueList.length
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
      vm.$store.dispatch('getThongTinXepHang', filter).then(function (result) {
        if (result.data) {
          vm.queueList = result.data
        }
      }).catch(reject => {
      })
    }
  }
}
</script>
