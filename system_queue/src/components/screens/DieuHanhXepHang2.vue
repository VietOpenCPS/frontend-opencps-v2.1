<template>
  <v-card id="contain-dhxh" flat color="#1867c0">
    <v-flex xs12 class="header_login text-xs-center pt-3">
      <div class="logo d-inline-block">
        <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png"> 
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center">
      <h1 style="font-size:32px; color: yellow" class="text-bold">
        BẢNG ĐIỀU HÀNH XẾP HÀNG
      </h1>
    </v-flex>
    <v-layout wrap class="pt-5" style="height: calc(100vh - 270px);max-width: 1500px;margin:0 auto">
      <v-flex xs6 class="colum-dhxh text-xs-center px-2" v-for="(item, index) in gateNumberList" v-bind:key="index">
        <div class="py-3">
          <div class="mb-4" style="border-bottom:2px solid #ffff">
            <span class="text-bold">BÀN SỐ</span> <br>
            <v-avatar color="white" class="mt-3 mb-4">
              <span class="red--text headline text-bold" style="font-size: 42px !important;">{{item.gateNumber}}</span>
            </v-avatar>
          </div>
          <div class="d-inline-block mb-2 text-bold">
            <span>{{item.bookings['codeNumber'] ? item.bookings['codeNumber'] : '-- -- --'}}</span> <br>
            <span>{{item.bookings['bookingName'] ? item.bookings['bookingName'] : '-- -- --'}}</span>
          </div>
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
    loadData: false,
    queueList: [
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
    ],
    gateNumberList: [
      {
        gateNumber: 4,
        bookings: {
          codeNumber: '',
          bookingName: ''
        }
      },
      {
        gateNumber: 5,
        bookings: {
          codeNumber: '',
          bookingName: ''
        }
      }
    ],
    bookingList: []
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    $('header').css('display','none')
    $('#banner').css('display','none')
    $('.navbar-container').css('display','none')
    $('#footer').css('display','none')
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      setTimeout(function(){$('#footer').css('display','none')},500)
      vm.rowHeight = ($( window ).height() - 187) / vm.queueList.length
    })
    vm.getDanhSachCho()
  },
  updated () {
    var vm = this
    $('header').css('display','none')
    $('#banner').css('display','none')
    $('.navbar-container').css('display','none')
    $('#footer').css('display','none')
    setTimeout(function(){$('#footer').css('display','none')},500)
    vm.$nextTick(function () {
    })
  },
  watch: {
    loadData (val) {
      let vm = this
      setTimeout (function () {
        vm.getDanhSachCho()
      }, 30000)
    }
  },
  methods: {
    getDanhSachCho () {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      let filterEform = {
        state: 2,
        className: 'EFORM'
      }
      let bookingDossier = ''
      let bookingEform = ''
      let count = 0
      vm.$store.dispatch('getBookingDangGoi', filterEform).then(function (result) {
        count+=1
        if (result) {
          bookingEform = result
        } else {
          bookingEform = []
        }
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        bookingEform = []
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      })
      let filterDossier = {
        state: 2,
        className: 'DOSSIER'
      }
      vm.$store.dispatch('getBookingDangGoi', filterDossier).then(function (result) {
        count+=1
        if (result) {
          bookingDossier = result
        } else {
          bookingDossier = []
        }
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        bookingDossier = []
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      })
    },
    mergeBooking (bookingEform, bookingDossier) {
      let vm = this
      console.log('booking', bookingEform, bookingDossier)
      if (bookingEform.length > 0 || bookingDossier.length > 0) {
        vm.bookingList = bookingEform.concat(bookingDossier)
        let sortBooking = function (bookingList) {
          function compare(a, b) {
            if (a.checkinDate < b.checkinDate)
              return -1
            if (a.checkinDate > b.checkinDate)
              return 1
            return 0
          }
          return bookingList.sort(compare)
        }
        vm.bookingList = sortBooking(vm.bookingList)
        console.log('bookingList', vm.bookingList)
        for (let index in vm.gateNumberList) {
          let currentGate = vm.bookingList.filter(function (item) {
            return String(item.gateNumber) === String(vm.gateNumberList[index]['gateNumber'])
          })[0]
          vm.gateNumberList[index].bookings = currentGate ? currentGate : vm.gateNumberList[index].bookings
        }
        console.log('vm.gateNumberList', vm.gateNumberList)
      }
    }
  }
}
</script>
