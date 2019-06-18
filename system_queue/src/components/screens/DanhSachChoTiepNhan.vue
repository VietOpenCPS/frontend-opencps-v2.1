<template>
  <v-card flat color="#064787" id="contain-ctn" >
    <v-flex xs12 class="header_dhxh text-xs-center pt-1">
      <div class="logo d-inline-block">
        <div class="d-inline-block px-3 pt-2" style="position:fixed;top:0;left:0">
          <img style="width:70px;" :src="'/documents/' + groupId + '/0/logo.png'">
          <div style="font-size:16px;color:#e5e0e0" class="text-xs-center mt-3">BỘ NGOẠI GIAO</div>
        </div>
        <div class="d-inline-block px-2 pt-2" style="position:fixed;top:0;right:0">
          <img class="img-slogan mb-3" :src="'/documents/' + groupId + '/0/ct.png'">
          <div style="font-size:14px;color:#e5e0e0" class="text-xs-center">CHUNG TAY CẢI CÁCH</div>
          <div style="font-size:14px;color:#e5e0e0" class="text-xs-center mt-1">THỦ TỤC HÀNH CHÍNH</div>
        </div>
        <div style="font-size:26px;color:#e5e0e0" class="mb-1">BỘ PHẬN TIẾP NHẬN HỒ SƠ VÀ TRẢ KẾT QUẢ</div>
        <v-flex style="line-height: 5px">
          <div class="underline-white" style="width:350px;height:2px"></div>
        </v-flex>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center">
      <div style="font-size:20px; color: #f7d900;height:50px" class="pt-2">
        DANH SÁCH XẾP HÀNG NỘP HỒ SƠ, NHẬN KẾT QUẢ
      </div>
    </v-flex>

    <v-layout wrap class="content-dhxh px-2 pt-0">
      <v-flex class="column-danhsachcho" :style="`width: ${100/columnList.length}%`" v-for="(item, index) in columnList" v-bind:key="index">
        <div v-if="item.key === 'newboard'" style="height:100%">
          <v-flex xs12 class="text-xs-center title thongbao-title py-3" style="height:70px">
            <p class="text-bold white--text">{{item.title}}</p>
          </v-flex>
          <v-flex xs12 class="title content-thongbao py-3 px-2" style="border-bottom:2px solid #d3d3d3;">
            <div class="white--text" v-html="item.content" id="noidung-thongbao"></div>
          </v-flex>
        </div>
        <div v-else style="height:100%">
          <v-flex xs12 class="text-xs-center title py-3 pt-4" style="height:70px">
            <p class="text-bold white--text">{{item.title}} ({{Array.isArray(columnList[index]['content']) ? columnList[index]['content'].length : 0}})</p>
          </v-flex>
          <table-cho-tiep-nhan :applicantList="item.content"></table-cho-tiep-nhan>
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
import TableChoTiepNhan from './TableChoTiepNhan.vue'
Vue.use(toastr)
export default {
  props: [],
  components: {
    'table-cho-tiep-nhan': TableChoTiepNhan
  },
  data: () => ({
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
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
      }
    ],
    columnList: [],
    loadData: false
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
      vm.getServerConfig()
      setInterval(function () {
        vm.getDanhSachCho()
      }, 15000)
    })
  },
  updated () {
    var vm = this
    $('header').css('display','none')
    $('#banner').css('display','none')
    $('.navbar-container').css('display','none')
    $('#footer').css('display','none')
    setTimeout(function(){$('#footer').css('display','none')}, 500)
  },
  watch: {
    // loadData (val) {
    //   let vm = this
    //   setTimeout(function () {
    //     vm.getDanhSachCho()
    //   }, 30000)
    // }
  },
  methods: {
    getServerConfig () {
      let vm = this
      let filter = {
        serverNo: 'BOOKING_CONFIG'
      }
      vm.$store.dispatch('getServerConfig', filter).then(function (result) {
        vm.columnList = JSON.parse(result.configs)
        // console.log('columnList', vm.columnList)
        vm.getDanhSachCho()
      })
    },
    getDanhSachCho () {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.columnList.length > 0) {
        for (let index in vm.columnList) {
          if (vm.columnList[index]['key'] === 'booking') {
            let filterEform = {
              state: 1,
              className: 'EFORM',
              service: vm.columnList[index]['config']
            }
            let bookingDossier = ''
            let bookingEform = ''
            let count = 0
            vm.$store.dispatch('getBookingDangGoi', filterEform).then(function (result) {
              count+=1
              vm.loading = false
              if (result) {
                bookingEform = result
              } else {
                bookingEform = []
              }
              if (count === 2) {
                vm.mergeBooking(bookingDossier, bookingEform, index)
              }
            }).catch(reject => {
              count+=1
              bookingEform = []
              if (count === 2) {
                vm.mergeBooking(bookingDossier, bookingEform, index)
              }
              vm.loading = false
            })
            let filterDossier = {
              state: 1,
              className: 'DOSSIER',
              service: vm.columnList[index]['config']
            }
            vm.$store.dispatch('getBookingDangGoi', filterDossier).then(function (result) {
              count+=1
              vm.loading = false
              if (result) {
                bookingDossier = result
              } else {
                bookingDossier = []
              }
              if (count === 2) {
                vm.mergeBooking(bookingDossier, bookingEform, index)
              }
            }).catch(reject => {
              count+=1
              bookingDossier = []
              vm.loading = false
              if (count === 2) {
                vm.mergeBooking(bookingDossier, bookingEform, index)
              }
            })
          } else if (vm.columnList[index]['key'] === 'API') {
            let bookingDossierRealease = []
            let filter = {
              url: vm.columnList[index]['url'] ? vm.columnList[index]['url'] : ''
            }
            vm.$store.dispatch('getDossier', filter).then(function (result) {
              // -----
              let bookingDossierArray = []
              if (Array.isArray(result) && result.length > 0) {
                let filter = {
                  state: '',
                  className: 'DOSSIER',
                  service: vm.columnList[index]['config']
                }
                vm.$store.dispatch('getBookingDangGoi', filter).then(function (resultBooking) {
                  if (resultBooking) {
                    bookingDossierRealease = resultBooking
                  } else {
                    bookingDossierRealease = []
                  }
                  if (bookingDossierRealease.length > 0) {
                    let lengthBooking = bookingDossierRealease.length
                    for (let i = 0; i < lengthBooking; i++) {
                      let dossierId = bookingDossierRealease[i]['codeNumber'].split('-')[2]
                      let lengthDossier = result.length
                      for (let j = 0; j < lengthDossier; j++) {
                        if (String(dossierId) === String(result[j]['dossierId'])) {
                          bookingDossierArray.push(bookingDossierRealease[i])
                          break
                        }
                      }
                      vm.columnList[index]['content'] = bookingDossierArray
                    }
                  }
                })
              }
              // -----
              vm.columnList[index]['content'] = result
            }).catch(function (reject) {
            })
          }
        }
      }
    },
    mergeBooking (bookingDossier, bookingEform, index) {
      let vm = this
      // console.log('booking', bookingEform, bookingDossier)
      if (bookingEform.length > 0 || bookingDossier.length > 0) {
        let booking
        if (vm.columnList[index]['className'] && vm.columnList[index]['className'] === 'DOSSIER') {
          booking = bookingDossier
        } else if (vm.columnList[index]['className'] && vm.columnList[index]['className'] === 'EFORM') {
          booking = bookingEform
        } else {
          booking = bookingEform.concat(bookingDossier)
        }
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
        booking = sortBooking(booking)
        vm.columnList[index]['content'] = booking
      }
    }
  }
}
</script>

