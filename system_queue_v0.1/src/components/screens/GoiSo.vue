<template>
  <v-card id="contain-calling" flat color="#064787">
    <v-flex xs12 class="header_dhxh text-xs-center pt-0">
      <div class="logo d-inline-block">
        <div class="d-inline-block px-3 pt-2" style="position:fixed;top:0;left:0">
          <img style="width:70px;" :src="'/documents/' + groupId + '/0/logo.png'">
          <div style="font-size:22px;color:#e5e0e0" class="mt-3 text-xs-center">BỘ NGOẠI GIAO</div>
        </div>
        <div class="d-inline-block px-2 pt-2" style="position:fixed;top:0;right:0">
          <img class="img-slogan mb-3" style="width:70px;" :src="'/documents/' + groupId + '/0/ct.png'">
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
        DANH SÁCH SỐ ĐANG GỌI 
      </div>
    </v-flex>
    <div class="px-3 mt-4" style="max-width:1500px;margin:0 auto">
      <v-flex xs12 class="text-xs-center mt-4" style="position: relative;">
        <div class="d-inline-block">
          <h1 class="my-2 white--text">SỐ ĐANG GỌI</h1>
          <v-chip class="d-inline-block text-xs-center pt-4" label color="#3fa8f1" text-color="white" style="width:250px;height:100px;font-size:32px;color:#ffffff">
            <span v-if="currentCalling">{{currentCalling.codeNumber}}</span>
            <span v-else>-- -- --</span>
          </v-chip>
        </div>
        <v-btn large fab dark color="indigo" class="right" @click="activeCalling = !activeCalling" style="top: 70px;">
          <v-icon color="white" v-if="!activeCalling">play_arrow</v-icon>
          <v-icon color="white" v-else>pause</v-icon>
        </v-btn>
      </v-flex>
      
      <v-data-table
        id="table-danhsachcho"
        :headers="headers"
        :items="queueList"
        hide-actions
        class="table-landing table-bordered mt-4"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td class="text-xs-center text-bold px-0" style="">
              <div>
                <span style="font-size:24px">{{props.index + 1}}</span>
              </div>
            </td>
            <td class="text-xs-center text-bold px-0" style="">
              <div>
                <span style="font-size:32px">{{props.item['codeNumber']}}</span>
              </div>
            </td>
            <td class="text-xs-left text-bold py-2 px-3" style="">
              <div style="">
                <span style="font-size:32px">{{props.item.bookingName}}</span>
              </div>
            </td>
            <td class="text-xs-center text-bold py-2" style="">
              <div style="">
                <span style="font-size:32px">{{props.item.gateNumber}}</span>
              </div>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <v-card flat color="transparent">
            <v-flex class="text-xs-center white--text">
              <span>Không có</span>
            </v-flex>
          </v-card>
        </template>
      </v-data-table>
    </div>
    <!--  -->
    <div id="audioCalling" style="visibility: hidden;position:fixed;top:0;right:0;z-index:-999">
    </div>
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
    activeCalling: true,
    called: true,
    currentCalling: '',
    loadData: false,
    idVoicePortlet: 161427,
    queueList: [
    ],
    headers: [
      {
        text: 'TT',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'MÃ TK/BN',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'HỌ TÊN',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'QUẦY SỐ',
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
      }, 5000)
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
      vm.queueList = []
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
            return (String(item.gateNumber) === String(vm.gateNumberList[index]['gateNumber']) && !item['speaking'])
          })
          vm.queueList = vm.queueList.concat(currentGate)
        }
        if (vm.activeCalling && vm.called && Array.isArray(vm.queueList) && vm.queueList.length > 0) {
          vm.currentCalling = vm.queueList[0]
          try {
            vm.callingApplicant(vm.currentCalling)
          }
          catch(err) {
            console.log('catch play audio 1')
            vm.getDanhSachCho()
          }
        } else {
          vm.loadData = !vm.loadData
        }
      } else {
        vm.loadData = !vm.loadData
      }
    },
    updateStateBooking (item, speakingArg) {
      let vm = this
      let filter = Object.assign({}, item, {speaking: speakingArg})
      vm.$store.dispatch('updateBooking', filter).then(function (result) {
      }).catch (function (reject) {
      })
    },
    callingApplicant (item) {
      let vm = this
      vm.updateStateBooking(item, true)
      if (item) {
        vm.called = false
        $('#audioCalling').html('')
        let splitNumberCode = item['codeNumber'].split('-')
        let numberCalling = splitNumberCode[0] + splitNumberCode[1] + splitNumberCode[2]
        let srcAudioStart = splitNumberCode[0] === 'E' ? `/documents/${vm.groupId}/${vm.idVoicePortlet}/eformStart1.mp3` : `/documents/${vm.groupId}/${vm.idVoicePortlet}/dossierStart1.mp3`
        let numberArr = String(numberCalling).split('')
        // 
        let mainGateNumber = ''
        let subGateNumber = ''
        if (isNaN(String(item['gateNumber']).slice(-1))) {
          mainGateNumber = item['gateNumber'].replace(item['gateNumber'].slice(-1), '')
          subGateNumber = item['gateNumber'].slice(-1)
        }
        // 
        let audioStart = `
          <audio id="start">
            <source src="${srcAudioStart}" type="audio/mp3">
          </audio>
        `
        let audioEnd = `
          <audio id="end">
            <source src="/documents/${vm.groupId}/${vm.idVoicePortlet}/toGateNumber.mp3" type="audio/mp3">
          </audio>
        `
        let audioNumber = ''
        for (let index = 0; index < numberArr.length; index++) {
          audioNumber += `
            <audio id="au${index}">
              <source src="/documents/${vm.groupId}/${vm.idVoicePortlet}/${numberArr[index]}.mp3" type="audio/mp3">
            </audio>
          `
        }
        let gateAudio
        if (subGateNumber === '') {
          gateAudio = `
            <audio id="gateNumber">
              <source src="/documents/${vm.groupId}/${vm.idVoicePortlet}/${Number(item['gateNumber'])}.mp3" type="audio/mp3">
            </audio>
          `
        } else {
          gateAudio = `
            <audio id="mainGateNumber">
              <source src="/documents/${vm.groupId}/${vm.idVoicePortlet}/${Number(mainGateNumber)}.mp3" type="audio/mp3">
            </audio>
            <audio id="subGateNumber">
              <source src="/documents/${vm.groupId}/${vm.idVoicePortlet}/${String(subGateNumber)}.mp3" type="audio/mp3">
            </audio>
          `
        }
        $('#audioCalling').html(audioStart + audioNumber + audioEnd + gateAudio)
        // 
        document.getElementById('start').onended = function () {
          document.getElementById(`au0`).play()
          for (let index = 1; index < numberArr.length; index++) {
            setTimeout (function() {
              document.getElementById(`au${index}`).play()
            }, (index)*800)
          }
        }
        document.getElementById(`au${numberArr.length - 1}`).onended = function () {
          document.getElementById('end').play()
        }
        document.getElementById('end').onended = function() {
          if (!subGateNumber) {
            document.getElementById('gateNumber').play()
          } else {
            document.getElementById('mainGateNumber').play()
            setTimeout (function() {
              document.getElementById('subGateNumber').play()
            },600)
          }
        }
        if (!subGateNumber) {
          document.getElementById('gateNumber').onended = function () {
            vm.currentCalling = ''
            vm.called = true
            vm.loadData = !vm.loadData
          }
        } else {
          document.getElementById('subGateNumber').onended = function () {
            vm.currentCalling = ''
            vm.called = true
            vm.loadData = !vm.loadData
          }
        }
        // start audio
        setTimeout (function () {
          try {
            document.getElementById('start').play()
          } catch (error) {
            console.log('catch play audio')
            vm.getDanhSachCho()
          }
        }, 300)
      } else {
        vm.called = true
      }
    }
  }
}
</script>