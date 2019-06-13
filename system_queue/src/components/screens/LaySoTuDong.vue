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
          <img :src="'/documents/' + groupId + '/0/barcode.png'" alt="" width="480px" height="150px">
        </v-card>
      </v-flex>
      <v-flex xs12 class="mt-4">
        <v-flex class="text-xs-center">
          <v-text-field
            v-model="eformInformation"
            height="70px"
            class="d-inline-block centered-input"
            autofocus
            flat
            solo
            color="primary"
            style="font-size: 32px;width:480px"
            @keyup.enter="submitQueue"
          ></v-text-field>
        </v-flex>
      </v-flex>
      <v-flex v-if="isActive" xs12 class="mt-3 text-xs-center" style="color:yellow">
        <div v-if="checkinFail">
          <span>
            Thông tin của quý khách không chính xác
          </span><br>
          <span>
            Quý khách vui lòng kiểm tra lại. Xin cảm ơn!
          </span>
        </div>
        <div v-else>
          <span>
            Thông tin của quý khách đã được tiếp nhận
          </span><br>
          <span>
            Vui lòng đợi gọi tên để được xử lý. Xin cảm ơn!
          </span>
        </div>
      </v-flex>
      <v-flex v-else xs12 class="mt-3 text-xs-center" style="color:yellow">
        <span>
          Xin mời quý khách quét mã vạch để đăng ký xếp hàng 
        </span><br>
        <span>
          Please scan barcode here to do
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
    eformInformation: '',
    isActive: false,
    checkinFail: false,
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
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
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      $('header').css('display','none')
      $('#banner').css('display','none')
      $('.navbar-container').css('display','none')
      $('#footer').css('display','none')
      setTimeout(function(){$('#footer').css('display','none')},500)
    })
  },
  watch: {},
  methods: {
    submitQueue () {
      let vm = this
      if (String(vm.eformInformation).indexOf('-') > 0) {
        let keySearch = String(vm.eformInformation).split('-')
        if (keySearch.length !== 3) {
          vm.isActive = true
          vm.checkinFail = true
          setTimeout(function() {
            vm.isActive = false
            vm.eformInformation = ''
          }, 5000)
        }
        let filterBooking = {
          className: '',
          classPK: '',
          serviceCode: '',
          gateNumber: '',
          state: 1,
          codeNumber: vm.eformInformation,
          bookingName: ''
        }
        if (keySearch[0] === 'E' && keySearch.length === 3) {
          let filterEform = {
            eFormId: keySearch[2]
          }
          vm.$store.dispatch('getEform', filterEform).then(function (result) {
            let bookingName = ''
            if (result['eFormId']) {
              try {
                let name = JSON.parse(result['eFormData'])['ho_ten_yeu_cau']
                bookingName = name !== 'undefined' && name !== undefined ? name : ''
              } catch (e) {
              }
              vm.checkinFail = false
              filterBooking.className = 'EFORM'
              filterBooking.classPK = result.eFormId
              filterBooking.serviceCode = result.serviceCode
              filterBooking.bookingName = bookingName
              vm.createBooking(filterBooking)
            } else {
              vm.isActive = true
              vm.checkinFail = true
              setTimeout(function() {
                vm.isActive = false
                vm.eformInformation = ''
              }, 5000)
            }
          }).catch (function (reject) {
            vm.isActive = true
            vm.checkinFail = true
            setTimeout(function() {
              vm.isActive = false
              vm.eformInformation = ''
            }, 5000)
          })
        } else if (keySearch[1] === 'D' && keySearch.length === 3) {
          let filterDossier = {
            dossierId: keySearch[2]
          }
          vm.$store.dispatch('getDossier', filterDossier).then(function (result) {
            if (result) {
              vm.checkinFail = false
              filterBooking.className = 'DOSSIER'
              filterBooking.classPK = result.dossierId
              filterBooking.serviceCode = result.serviceCode
              filterBooking.bookingName = result.applicantName
              vm.createBooking(filterBooking)
            } else {
              vm.isActive = true
              vm.checkinFail = true
              setTimeout(function() {
                vm.isActive = false
                vm.eformInformation = ''
              }, 5000)
            }
          }).catch (function (reject) {
            vm.isActive = true
            vm.checkinFail = true
            setTimeout(function() {
              vm.isActive = false
              vm.eformInformation = ''
            }, 5000)
          })
        }
      } else {
        vm.isActive = true
        vm.checkinFail = true
        setTimeout(function() {
          vm.isActive = false
          vm.eformInformation = ''
        }, 5000)
      }
    },
    createBooking (filter) {
      let vm = this
      vm.$store.dispatch('createBooking', filter).then(function (result) {
        vm.isActive = true
        setTimeout(function() {
          vm.isActive = false
          vm.eformInformation = ''
        }, 5000)
      }).catch (function (reject) {
      })
    }
  }
}
</script>

