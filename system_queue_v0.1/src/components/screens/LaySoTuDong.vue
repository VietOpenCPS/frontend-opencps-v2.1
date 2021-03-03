<template>
  <v-card flat color="#064787" id="contain-dktn" class="">
    <v-flex xs12 class="header_login text-xs-center pt-2">
      <div class="logo d-inline-block">
        <img src="/o/bongoaigiao-theme/images/logo3.png">
        <!-- <div style="font-size:22px;color:#e5e0e0" class="mt-2 text-xs-center">BỘ NGOẠI GIAO</div> -->
        <h1 style="font-size:26px; color: #ffffff" class="text-bold my-2">BỘ PHẬN TIẾP NHẬN HỒ SƠ VÀ TRẢ KẾT QUẢ
        </h1>
      </div>
    </v-flex>
    <!-- <v-flex xs12 class="text-xs-center" style="margin-top: 10px">
      <h1 style="font-size:32px; color: yellow" class="text-bold">ĐĂNG KÝ TIẾP NHẬN HỒ SƠ TỰ ĐỘNG</h1>
    </v-flex> -->
    <v-layout wrap style="font-size:32px; color: white;max-width:1000px;margin: 0 auto">
      <v-flex xs12 class="text-xs-center mt-2">
        <v-card color="#ffffff" width="480px" class="py-3 d-inline-block">
          <img :src="'/documents/' + groupId + '/0/barcode.png'" alt="" width="480px" height="100px">
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
          <span v-if="overTime">
            Quý khách vui lòng đăng ký xếp hàng trong thời gian <br>
            Buổi sáng: {{timeMorning ? timeMorning : '--:--'}} <br>
            Buổi chiều: {{timeAfternoon ? timeAfternoon : '--:--'}}
          </span>
          <span v-else>
            <span v-if="isScaned">
              Mã số không hợp lệ. Vui lòng kiểm tra lại <br>
            </span>
            <span v-else>
              Lỗi. Quý khách vui lòng quét lại <br>
              Error. Please again!
            </span>
          </span>
        </div>
        <div v-else>
          <span v-if="overMax">
            Mã {{codeShow}} của quý khách đã được xếp hàng<br>
            Số thứ tự: <span style="color: white !important; font-size: 36px">{{countBooking}}</span> <br>
            {{notifyOverMax}}
          </span>
          <span v-else>
            Mã {{codeShow}} của quý khách đã được xếp hàng<br>
            Số thứ tự: <span style="color: white !important; font-size: 36px">{{countBooking}}</span>
          </span>
        </div>
      </v-flex>
      <v-flex v-else xs12 class="mt-3 text-xs-center" style="color:yellow">
        <span>
          Xin mời quý khách quét mã vạch để đăng ký xếp hàng 
        </span><br>
        <span>
          Please scan barcode here to queue
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
    groupDvc: '',
    bookingGroups: '',
    stepDossierRelease: '',
    dossierStepsAllow: '',
    overMax: false,
    notifyOverMax: '',
    maxCounter: '',
    currentGroup: '',
    eformInformation: '',
    codeShow: '',
    countBooking: '', 
    isActive: false,
    checkinFail: false,
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
    loadData: false,
    timeMorning: '',
    timeAfternoon: '',
    onTime: true,
    overTime: false,
    isScaned: false
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    },
    serverConfig () {
      return this.$store.getters.getServerConfig
    }
  },
  created () {
    var vm = this
    $('header').css('display','none')
    $('#banner').css('display','none')
    $('.navbar-container').css('display','none')
    $('#footer').css('display','none')
    vm.$nextTick(function () {
      vm.getBookingConfigs()
      vm.getBooking()
      setInterval(function () {
        vm.checkOntime()
      }, 1*60*1000)
      setInterval(function () {
        vm.getBookingConfigs()
      }, 5*60*1000)
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
  watch: {
    loadData (val) {
      let vm = this
      setTimeout (function () {
        vm.getBooking()
      }, 5000)
    },
    isActive () {
      let vm = this
      vm.eformInformation = ''
    }
  },
  methods: {
    submitQueue () {
      let vm = this
      vm.maxCounter = ''
      vm.countBooking = ''
      vm.currentGroup = ''
      vm.checkOntime()
      if (!vm.isActive) {
        if (vm.onTime) {
          vm.overTime = false
          if (String(vm.eformInformation).length > 0) {
            let keySearch = String(vm.eformInformation).split('-')
            vm.codeShow = vm.eformInformation
            // if (keySearch.length !== 3) {
            //   vm.isActive = true
            //   vm.checkinFail = true
            //   setTimeout(function() {
            //     vm.isActive = false
            //   }, 5000)
            //   vm.eformInformation = ''
            // }
            let filterBooking = {
              className: '',
              classPK: '',
              serviceCode: '',
              gateNumber: '',
              state: 1,
              codeNumber: '',
              bookingName: '',
              serviceGroupCode: '',
              dossierRelease: false
            }
            if (keySearch.length === 1) {
              filterBooking['codeNumber'] = vm.eformInformation
            } else {
              filterBooking['codeNumber'] = vm.maBienNhan(vm.eformInformation)
            }
            if (keySearch.length === 1) {
              let filterEform = {
                eFormNo: vm.eformInformation,
                endPoint: '/eforms/' + vm.eformInformation + '/barcode',
                serverNo: 'SERVER_EFORM_DVC',
                protocol: 'API_CONNECT'
              }
              vm.$store.dispatch('getEformBarcode', filterEform).then(function (result) {
                let bookingName = ''
                if (result['eFormId']) {
                  // 
                  vm.currentGroup = vm.bookingGroups.filter(function (item) {
                    return (item['config'] && item['config'].split(',').indexOf(result['serviceCode']) >= 0)
                  })[0]
                  console.log('currentGroup', vm.currentGroup)
                  // 
                  try {
                    let name = JSON.parse(result['eFormData'])
                    bookingName = name !== 'undefined' && name !== undefined ? name['bookingName'] : ''
                  } catch (e) {
                    console.log('lỗi parse eFormData get bookingName')
                  }
                  vm.checkinFail = false
                  filterBooking.className = 'EFORM'
                  filterBooking.classPK = result.eFormId
                  filterBooking.serviceCode = result.serviceCode
                  filterBooking.govAgencyCode = result.hasOwnProperty('govAgencyCode') ? result.govAgencyCode : ''
                  filterBooking.bookingName = bookingName
                  filterBooking.serviceGroupCode = vm.currentGroup['groupCode']
                  vm.createBooking(filterBooking)
                } else {
                  vm.isActive = true
                  vm.checkinFail = true
                  setTimeout(function() {
                    vm.isActive = false
                  }, 5000)
                  vm.eformInformation = ''
                }
              }).catch (function (reject) {
                vm.isActive = true
                vm.checkinFail = true
                setTimeout(function() {
                  vm.isActive = false
                }, 5000)
                vm.eformInformation = ''
              })
            } else if (keySearch[0] === 'D' && keySearch.length !== 1) {
              let filterDossier = {
                dossierId: keySearch[2],
                secretCode: keySearch[1]
              }
              vm.$store.dispatch('getDossierDetail', filterDossier).then(function (result) {
                if (result) {
                  vm.currentGroup = vm.bookingGroups.filter(function (item) {
                    return (item['className'] === 'DOSSIER')
                  })[0]
                  vm.checkinFail = false
                  filterBooking.className = 'DOSSIER'
                  filterBooking.classPK = result.dossierId
                  filterBooking.serviceCode = result.serviceCode
                  filterBooking.bookingName = result.applicantName
                  filterBooking.serviceGroupCode = vm.currentGroup['groupCode']
                  if (result['stepCode'] && vm.dossierStepsAllow.indexOf(String(result['stepCode'])) >= 0) {
                    if (vm.stepDossierRelease.indexOf(String(result['stepCode'])) >= 0) {
                      filterBooking.dossierRelease = true
                    } else {
                      filterBooking.dossierRelease = false
                    }
                    vm.createBooking(filterBooking)
                  } else {
                    vm.isActive = true
                    vm.checkinFail = true
                    setTimeout(function() {
                      vm.isActive = false
                    }, 5000)
                    vm.eformInformation = ''
                  }
                } else {
                  vm.isActive = true
                  vm.checkinFail = true
                  setTimeout(function() {
                    vm.isActive = false
                  }, 5000)
                  vm.eformInformation = ''
                }
              }).catch (function (reject) {
                vm.isActive = true
                vm.checkinFail = true
                setTimeout(function() {
                  vm.isActive = false
                }, 5000)
                vm.eformInformation = ''
              })
            }
          } else {
            vm.isActive = true
            vm.checkinFail = true
            setTimeout(function() {
              vm.isActive = false
            }, 5000)
            vm.eformInformation = ''
          }
        } else {
          vm.isActive = true
          vm.checkinFail = true
          vm.overTime = true
          setTimeout(function() {
            vm.isActive = false
          }, 5000)
          vm.eformInformation = ''
        }
      }
    },
    createBooking (filter) {
      let vm = this
      console.log('filter create booking', filter)
      vm.$store.dispatch('createBooking', filter).then(function (result) {
        vm.isActive = true
        vm.checkinFail = false
        vm.isScaned = false
        vm.countBooking = result['count']
        // 
        let timeDelay = 5000
        if (String(result['state']) === '4') {
          vm.checkinFail = true
          vm.isScaned = true
        } else {
          // 
          if (filter.dossierRelease) {
            result.state = 4
            console.log('filter update', result)
            vm.updateStateBooking(result)
          }
          vm.overMax = false
          if (vm.currentGroup.hasOwnProperty('maxRecord') && vm.currentGroup['maxRecord'] 
            && Number(result['count']) > Number(vm.currentGroup['maxRecord'])
          ) {
            vm.overMax = true
            timeDelay = 10000
          }
        }
        // 
        setTimeout(function() {
          vm.isActive = false
        }, timeDelay)
        vm.eformInformation = ''
      }).catch (function (reject) {
        vm.eformInformation = ''
      })
    },
    getBooking () {
      let vm = this
      let filterEform = {
        state: 1,
        className: 'EFORM'
      }
      vm.$store.dispatch('getBookingDangGoi', filterEform).then(function (result) {
        vm.loadData = !vm.loadData
      }).catch(reject => {
        vm.loadData = !vm.loadData
      })
    },
    getBookingConfigs () {
      let vm = this
      let filter = {
        serverNo: 'BOOKING_CONFIG'
      }
      vm.$store.dispatch('getServerConfig', filter).then(function (result) {
        // nhóm thủ tục, step dossier
        try {
          let configs = JSON.parse(result.configs)
          vm.dossierStepsAllow = configs['dossierStepsAllow']
          vm.stepDossierRelease = configs['stepDossierRelease']
          vm.bookingGroups = configs['bookings']
          vm.groupDvc = configs['groupId']
          vm.notifyOverMax = configs['notifyMax']
          console.log('bookingGroups', vm.bookingGroups)
          // thời gian làm việc
          let workTime = configs['workTime'] ? configs['workTime'] : '08:00-11:00;13:00-16:00'
          let parse = function (min) {
            return (new Date(`1970-01-01 ${min}`)).getTime()
          }
          let s1, s2, c1, c2
          if (workTime) {
            vm.timeMorning = workTime.split(';')[0]
            s1 = parse(workTime.split(';')[0].split('-')[0])
            s2 = parse(workTime.split(';')[0].split('-')[1])
            if (workTime.split(';')[1]) {
              vm.timeAfternoon = workTime.split(';')[1]
              c1 = parse(workTime.split(';')[1].split('-')[0])
              c2 = parse(workTime.split(';')[1].split('-')[1])
            }
            let stringTime = `${s1},${s2},${c1},${c2}`
            vm.workingTime = stringTime.split(',')
          } else {
            vm.workingTime = ''
          }
        } catch (error) {
          console.log('bookings parseError')
          vm.dossierStepsAllow = 600
        }
        vm.checkOntime()
      }).catch(function (reject) {
        vm.workingTime = ''
        vm.checkOntime()
      })
    },
    updateStateBooking (item) {
      let vm = this
      let filter = item
      vm.$store.dispatch('updateBookingAll', filter).then(function (result) {
      }).catch (function (reject) {
      })
    },
    checkOntime () {
      let vm = this
      let currentTime = `${(new Date()).getHours()}:${(new Date()).getMinutes()}`
      let currentTimeFull = (new Date(`1970-01-01 ${currentTime}`)).getTime()
      // console.log('currentTimeFull', currentTimeFull)
      // console.log('workingTime', vm.workingTime)
      vm.onTime = true
      if (vm.workingTime) {
        if (Number(currentTimeFull) >= Number(vm.workingTime[0]) && Number(currentTimeFull) <= Number(vm.workingTime[1])) {
          vm.onTime = true
        } else {
          vm.onTime = false
        }
        if (!vm.onTime && vm.workingTime[2]) {
          if (Number(currentTimeFull) >= Number(vm.workingTime[2]) && Number(currentTimeFull) <= Number(vm.workingTime[3])) {
            vm.onTime = true
          } else {
            vm.onTime = false
          }
        }
      }
      if (!vm.onTime) {
        vm.isActive = true
        vm.checkinFail = true
        vm.overTime = true
        vm.eformInformation = ''
      } else {
        vm.isActive = false
        vm.checkinFail = false
        vm.overTime = false
      }
    },
    maBienNhan (str) {
      let index = 0
      let pstBN = 0
      for (var i=0; i<str.length; i++) {
        if (str.charAt(i) === '-') {
          index += 1
        }
        if (index === 3) {
          pstBN = i
          break;
        }
      }
      return str.substr(pstBN + 1)
    }
  }
}
</script>

