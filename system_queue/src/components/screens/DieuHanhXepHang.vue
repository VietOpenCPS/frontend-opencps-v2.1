<template>
  <v-card id="contain-dhxh" flat color="#064787">
    <v-flex xs12 class="header_dhxh text-xs-center pt-0">
      <div class="logo d-inline-block">
        <div class="d-inline-block px-3 pt-2" style="position:fixed;top:0;left:0">
          <img style="width:100px;" :src="'/documents/' + groupId + '/0/logo.png'">
          <div style="font-size:22px;color:#e5e0e0" class="mt-3 text-xs-center">BỘ NGOẠI GIAO</div>
        </div>
        <div class="d-inline-block px-2 pt-2" style="position:fixed;top:0;right:0">
          <img class="img-slogan mb-3" style="width:100px;" :src="'/documents/' + groupId + '/0/ct.png'">
          <div style="font-size:22px;color:#e5e0e0" class="text-xs-center">CHUNG TAY CẢI CÁCH</div>
          <div style="font-size:22px;color:#e5e0e0" class="text-xs-center mt-1">THỦ TỤC HÀNH CHÍNH</div>
        </div>
        <div style="font-size:32px;color:#e5e0e0" class="mb-1">BỘ PHẬN TIẾP NHẬN HỒ SƠ VÀ TRẢ KẾT QUẢ</div>
        <v-flex style="line-height: 5px">
          <div class="underline-white" style="width:350px;height:2px"></div>
        </v-flex>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center">
      <div style="font-size:32px; color: #f7d900;height:50px" class="">
        BẢNG ĐIỀU HÀNH XẾP HÀNG
      </div>
    </v-flex>
    <v-layout wrap class="content-dhxh px-2 py-2 pt-5">
      <v-flex class="colum-dhxh text-xs-center px-0" :class="`xs${12/gateNumberList.length}`" v-for="(item, index) in gateNumberList" v-bind:key="index">
        <div class="py-2">
          <div class="pt-4" style="min-height:300px">
            <span class="" style="">QUẦY</span> <br>
            <v-flex class="pt-1">
              <div class="circle white-circle text-bold;">{{item.gateNumber}}</div><br>
            </v-flex>
            <v-flex style="line-height: 5px">
              <div class="underline-white"></div>
            </v-flex>
          </div>
          <div class="content-applicant">
            <div class="py-2">
              <span class="codeNumber">{{item.bookings['codeNumber'] ? item.bookings['codeNumber'] : ''}}</span> <br>
              <span>{{item.bookings['bookingName'] ? item.bookings['bookingName'] : ''}}</span>
            </div>
          </div>
        </div>
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
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
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
      vm.gateNumberList = []
      if (currentQuery.hasOwnProperty('gate') && currentQuery.gate) {
        let gate = currentQuery.gate.split(',')
        for (let index in gate) {
          vm.gateNumberList.push({
            gateNumber: gate[index],
            bookings: {
              codeNumber: '',
              bookingName: ''
            }
          })
        }
      }
    })
    vm.getDanhSachCho()
    // setTimeout (function () {
    //   vm.getDanhSachCho()
    // }, 30000)
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
      }, 15000)
    },
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.gateNumberList = []
      if (currentQuery.hasOwnProperty('gate') && currentQuery.gate) {
        let gate = currentQuery.gate.split(',')
        for (let index in gate) {
          vm.gateNumberList.push({
            gateNumber: gate[index],
            bookings: {
              codeNumber: '',
              bookingName: ''
            }
          })
        }
        vm.getDanhSachCho()
      }
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
        // console.log('count', count)
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        bookingEform = []
        // console.log('count', count)
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
        // console.log('count', count)
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        bookingDossier = []
        // console.log('count', count)
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      })
    },
    mergeBooking (bookingEform, bookingDossier) {
      let vm = this
      if (bookingEform.length > 0 || bookingDossier.length > 0) {
        vm.bookingList = bookingEform.concat(bookingDossier)
        let sortBooking = function (bookingList) {
          function compare(a, b) {
            if (a.modifiedDate > b.modifiedDate)
              return -1
            if (a.modifiedDate < b.modifiedDate)
              return 1
            return 0
          }
          return bookingList.sort(compare)
        }
        vm.bookingList = sortBooking(vm.bookingList)
        for (let index in vm.gateNumberList) {
          let currentGate = vm.bookingList.filter(function (item) {
            return String(item.gateNumber) === String(vm.gateNumberList[index]['gateNumber'])
          })[0]
          let bookingEmty = {
            codeNumber: '',
            bookingName: ''
          }
          vm.gateNumberList[index].bookings = currentGate && currentGate.hasOwnProperty('gateNumber') ? currentGate : bookingEmty
        }
        vm.loadData = !vm.loadData
      }
    }
  }
}
</script>
