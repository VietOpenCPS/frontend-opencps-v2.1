<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big">
        <span>HỆ THỐNG GỌI SỐ TỰ ĐỘNG</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
      </div> 
    </div>
    <v-card flat color="#ffffff" class="pt-2 pb-4">
      <v-flex xs12 class="text-xs-center pt-2" id="nav-calling">
        <v-layout wrap class="white py-0">
          <v-flex xs4 class="px-2">
            <v-autocomplete
              class="select-border"
              :items="serviceGroupList"
              v-model="serviceGroupSelected"
              label="Chọn nhóm"
              item-text="title"
              item-value="sibling"
              :hide-selected="true"
              clearable
              @change="changeGroup"
              box
              return-object
              :disabled="isCalling"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs4 class="px-2">
            <v-autocomplete
              class="select-border"
              :items="serviceInfoList"
              v-model="serviceInfoSelected"
              label="Chọn thủ tục"
              item-text="serviceName"
              item-value="serviceCode"
              :hide-selected="true"
              clearable
              @change="changeService"
              box
              :disabled="isCalling"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs4 class="px-2">
            <v-autocomplete
              class="select-border"
              :items="stateList"
              v-model="stateSelected"
              label="Chọn trạng thái"
              item-text="stateName"
              item-value="stateCode"
              :hide-selected="true"
              clearable
              @change="changeState"
              box
              :disabled="isCalling"
            ></v-autocomplete>
          </v-flex>
        </v-layout>
        <v-chip class="text-bold" color="#3fa8f1" text-color="white" style="width:200px;height:42px;font-size: 22px;position:absolute;top:100px;left:10px">
          <v-avatar class="pl-3">
            <v-icon color="white"> chrome_reader_mode</v-icon>
          </v-avatar>
          <span class="pl-2" v-if="!currentGate">QUẦY SỐ ---</span>
          <span class="pl-2" v-else>QUẦY SỐ {{currentGate}}</span>
        </v-chip>
        <v-flex xs12 class="text-xs-center" style="position: relative;">
          <div class="d-inline-block">
            <div class="d-inline-block">
              <h1 class="my-2" style="color: green">SỐ ĐANG GỌI</h1>
              <v-chip class="d-inline-block text-xs-center pt-4" label color="#3fa8f1" text-color="white" style="width:250px;height:100px;font-size:32px;color:#ffffff">
                <span v-if="currentBooking">{{currentBooking.codeNumber}}</span>
                <span v-else>-- -- --</span>
              </v-chip>
            </div>
            <div v-if="currentBooking" class="d-inline-block ml-3 pt-1" style="position: absolute;top:50px">
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling"
                color="red"
                class="white--text mb-1"
                @click="ignoreBooking(currentBooking)"
                style="width: 120px;"
              >
                <v-icon class="ml-0" right dark>clear</v-icon> &nbsp;
                BỎ QUA
              </v-btn>
              <br>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling"
                color="#3fa8f1"
                class="white--text my-0"
                @click="receiveBooking(currentBooking)"
                style="width: 120px;"
              >
                <v-icon class="ml-0" right dark>save</v-icon> &nbsp;
                TIẾP NHẬN
              </v-btn>
              <br>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling || !currentBooking['speaking']"
                color="primary"
                class="white--text mt-1"
                @click="callBack(currentBooking)"
                style="width: 120px;"
              >
                <v-icon class="ml-0" right dark>cached</v-icon> &nbsp;
                GỌI LẠI
              </v-btn>
            </div>
          </div>
        </v-flex>
        <!--  -->
        <v-layout wrap>
          <v-flex xs6 class="">
            <div class="text-bold my-2 mt-4 mx-2 left" style="text-transform:uppercase">
              Danh sách {{getStateName()}}
            </div>
          </v-flex>
          <v-flex xs6 class="text-right pt-3">
            <div class="d-inline-block">
              <span class="text-bold">QUẦY TIẾP NHẬN SỐ:</span>
              <v-select
                :items="gateList"
                v-model="currentGate"
                item-text="itemCode"
                item-value="itemCode"
                :hide-selected="true"
                clearable
                class="d-inline-block ml-3 text-bold"
                style="width:100px;font-size:16px"
              >
              </v-select>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-data-table
        id="table-danhsachchoMC"
        :headers="headers"
        :items="bookingList"
        hide-actions
        class="mt-2"
        style="border-left: 1px solid #dedede; margin-top: 10px;"
      >
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
            <td class="text-xs-center text-bold py-2" width="70px">
              <div>
                <span>{{props.index + 1}}</span><br>
              </div>
            </td>
            <td class="text-xs-center text-bold py-2" width="150px">
              <div>
                <span>{{props.item.codeNumber}}</span>
              </div>
            </td>
            <td class="text-xs-left text-bold py-2 px-5">
              <div>
                <span>{{props.item.bookingName}}</span>
              </div>
            </td>
            <td class="text-xs-center text-bold py-1" width="350px">
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling || currentBooking['codeNumber'] === props.item['codeNumber'] || props.item['state'] != 1 || isCalling"
                :color="currentBooking['codeNumber'] === props.item['codeNumber'] || props.item['state'] != 1  ? 'grey' : 'primary'"
                class="white--text"
                @click="callingBooking(props.item)"
                style="width: 100px;"
              >
                <span v-if="currentBooking['codeNumber'] === props.item['codeNumber'] || props.item['state'] == 2">Đang gọi...</span>
                <span v-else>Gọi số</span>
              </v-btn>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling || currentBooking['codeNumber'] === props.item['codeNumber'] || 
                props.item['state'] === 4 || props.item['state'] === 3 || isCalling"
                :color="currentBooking['codeNumber'] === props.item['codeNumber'] ? 'grey' : 'red'"
                class="white--text ml-2"
                @click="ignoreBooking(props.item)"
                style="width: 100px;"
              >
                Bỏ qua
              </v-btn>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling || props.item['state'] === 4"
                color="#3fa8f1"
                class="white--text ml-2"
                @click="receiveBooking(props.item)"
                style="width: 100px;"
              >
                Tiếp nhận
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <v-card flat color="#fff">
            <v-flex class="text-xs-center pt-2">
              <span>Không có lượt chờ nào</span>
            </v-flex>
          </v-card>
        </template>
      </v-data-table>
      <!--  -->
      <div id="audioCalling" style="visibility: hidden;position:fixed;top:0;right:0;z-index:-999">
      </div>
    </v-card>

    <v-dialog v-model="dialogAction" max-width="550" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Lựa chọn dịch vụ</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialogAction = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pb-0 pt-4">
            <v-layout wrap>
              <v-flex xs12 class="px-2">
                <v-select
                  :items="listDichVu"
                  v-model="dichVuSelected"
                  label="Dịch vụ:"
                  item-text="optionName"
                  item-value="processOptionId"
                  return-object
                  :hide-selected="true"
                  :rules="[v => !!v || 'Dịch vụ bắt buộc phải chọn.']"
                  required
                  box
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-spacer></v-spacer>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogAction = false"
            >
              <v-icon>reply</v-icon>&nbsp;
              Thoát
            </v-btn>
            <v-btn color="primary" flat="flat" @click.native="doSubmitCreateDossier()"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon>save</v-icon>&nbsp;
              Đồng ý
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import axios from 'axios'
import toastr from 'toastr'
import support from '../../store/support.json'
Vue.use(toastr)
export default {
  props: [],
  components: {
  },
  data: () => ({
    loadData: false,
    apiRelease: '',
    dialogAction: false,
    dichVuSelected: '',
    listDichVu: '',
    filterCreateDossier: '',
    groupId: window.themeDisplay.getScopeGroupId(),
    idVoicePortlet: 161427,
    serviceInfoList: [],
    serviceInfoSelected: '',
    stateList: [
      {
        stateName: 'Đang chờ gọi',
        stateCode: '1'
      },
      {
        stateName: 'Đang được gọi',
        stateCode: '2'
      },
      {
        stateName: 'Hủy tiếp nhận',
        stateCode: '3'
      },
      {
        stateName: 'Đã xử lý xong',
        stateCode: '4'
      }
    ],
    stateSelected: '1',
    loadingCalling: false,
    gateList: [{
      itemCode: 1,
      itemName: 'Quầy số 1'
    },
    {
      itemCode: 2,
      itemName: 'Quầy số 2'
    },
    {
      itemCode: 3,
      itemName: 'Quầy số 3'
    },
    {
      itemCode: 4,
      itemName: 'Quầy số 4'
    },
    {
      itemCode: 5,
      itemName: 'Quầy số 5'
    }],
    currentGate: '',
    bookingList: [
    ],
    loading: true,
    headers: [
      {
        text: 'Thứ tự',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã TK/BN',
        align: 'center',
        sortable: false
      },
      {
        text: 'Họ tên',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    currentBooking : '',
    isCalling: false,
    serviceGroupList: [],
    serviceGroupSelected: ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.getServerConfig()
      vm.getServiceInfo()
      vm.getGateLists()
      vm.loadBooking()
      setTimeout(function () {
        if (vm.bookingList.length > 5) {
          let heightScroll = $('header').height() + $('.navbar-container').height()
          let widthParent = $('#nav-calling').parent().width()
          $(window).scroll(function () {
            if ($(window).scrollTop() > heightScroll) {
              $('#nav-calling').css('width',`${widthParent}px`)
              $('#nav-calling').addClass('fixedContent')
            } else {
              $('#nav-calling').removeClass('fixedContent')
            }
          })
        }
      }, 500)
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      vm.loadBooking()
    },
    loadData (val) {
      let vm = this
      setTimeout(function () {
        vm.loadBooking()
      }, 5000)
    },
    currentGate (val) {
      let vm = this
      let gateNumber = isNaN(val) ? val : Number(val)
      vm.updateGateNumber(gateNumber)
      vm.getBookingCalling()
    }
  },
  methods: {
    getServiceInfo () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$store.dispatch('getServiceLists').then(function (result) {
        vm.serviceInfoList = result
        vm.serviceInfoSelected = newQuery.hasOwnProperty('service') && newQuery.service ? newQuery.service : ''
      })
    },
    getServerConfig () {
      let vm = this
      let filter = {
        serverNo: 'BOOKING_CONFIG'
      }
      vm.$store.dispatch('getServerConfig', filter).then(function (result) {
        let configs = JSON.parse(result.configs)
        vm.serviceGroupList = configs
        vm.apiRelease = configs.filter(function (item) {
          return item.key === 'API'
        })[0]['url']
      })
    },
    changeGroup () {
      let vm = this
      vm.serviceInfoSelected = ''
      vm.filterBooking()
    },
    getGateLists () {
      let vm = this
      vm.$store.dispatch('getGateLists').then(function (result) {
        vm.gateList = result
        vm.getGateNumber()
      })
    },
    filterBooking () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['service'] = vm.serviceInfoSelected ? vm.serviceInfoSelected : ''
        if (vm.serviceGroupSelected['config'] && vm.serviceGroupSelected['key'] === 'booking') {
          newQuery['service'] = vm.serviceGroupSelected['config']
        }
        if (vm.serviceGroupSelected['key'] === 'booking' && vm.serviceGroupSelected['className'] === 'DOSSIER') {
          newQuery['service'] = ''
          newQuery['keyBooking'] = ''
          newQuery['className'] = vm.serviceGroupSelected['className']
        }
        if (vm.serviceGroupSelected['key'] === 'API') {
          newQuery['service'] = ''
          newQuery['className'] = ''
          newQuery['keyBooking'] = vm.serviceGroupSelected['key']
        }
        newQuery['state'] = vm.stateSelected
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 200)
    },
    changeService () {
      var vm = this
      vm.filterBooking()
    },
    changeState () {
      var vm = this
      vm.filterBooking()
    },
    loadBooking () {
      var vm = this
      let count = 0
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let bookingDossier = []
      let bookingEform = []
      let filterEform = {
        service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceInfoSelected,
        state: currentQuery.hasOwnProperty('state') ? currentQuery.state : vm.stateSelected,
        className: 'EFORM'
      }
      vm.$store.dispatch('getBooking', filterEform).then(function (result) {
        count+=1
        vm.loading = false
        if (result.data) {
          bookingEform = result.data
        }
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
        vm.loading = false
      })
      // 
      let filterDossier = {
        service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceInfoSelected,
        state: currentQuery.hasOwnProperty('state') ? currentQuery.state : vm.stateSelected,
        className: 'DOSSIER'
      }
      vm.$store.dispatch('getBooking', filterDossier).then(function (result) {
        count+=1
        vm.loading = false
        if (result.data) {
          bookingDossier = result.data
        }
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        vm.loading = false
        if (count === 2) {
          vm.mergeBooking(bookingDossier, bookingEform)
        }
      })
    },
    mergeBooking (bookingEform, bookingDossier) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.getBookingCalling()
      // ------>
      let bookingRelease = []
      let bookingDossierRealease = []
      let filter = {
        url: vm.apiRelease
      }
      vm.$store.dispatch('getDossier', filter).then(function (result) {
        // -----
        let bookingDossierArray = []
        let filter = {
          state: 4,
          className: 'DOSSIER'
        }
        vm.$store.dispatch('getBooking', filter).then(function (resultBooking) {
          if (resultBooking.data) {
            bookingDossierRealease = resultBooking.data
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
                  let bookingConvert = Object.assign({}, bookingDossierRealease[i], {state: 1})
                  bookingDossierArray.push(bookingConvert)
                  break
                }
              }
            }
          }
          bookingRelease = bookingDossierArray
          // merge
          if (bookingEform || bookingDossier || bookingRelease) {
            if (newQuery.hasOwnProperty('className') && newQuery.className === 'DOSSIER') {
              vm.bookingList = [].concat(bookingDossier)
            } else if (newQuery.hasOwnProperty('keyBooking') && newQuery.keyBooking === 'API') {
              vm.bookingList = [].concat(bookingRelease)
            } else {
              vm.bookingList = [].concat(bookingEform, bookingDossier, bookingRelease)
            }
            // vm.bookingList = [].concat(bookingEform, bookingDossier, bookingRelease)
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
          }
          vm.loadData = !vm.loadData
        }).catch (function (reject) {
          if (bookingEform || bookingDossier || bookingRelease) {
            vm.bookingList = [].concat(bookingEform, bookingDossier, bookingRelease)
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
          }
          vm.loadData = !vm.loadData
        })
        // -----
      }).catch(function (reject) {
        if (bookingEform || bookingDossier || bookingRelease) {
          vm.bookingList = [].concat(bookingEform, bookingDossier, bookingRelease)
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
        }
        vm.loadData = !vm.loadData
      })
      // ------>
    },
    getBookingCalling () {
      var vm = this
      let count = 0
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let bookingDossier = []
      let bookingEform = []
      let filterEform = {
        service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceInfoSelected,
        state: 2,
        className: 'EFORM',
        gateNumber: vm.currentGate
      }
      // console.log('vm.currentGate', vm.currentGate, filterEform)
      vm.$store.dispatch('getBooking', filterEform).then(function (result) {
        count+=1
        vm.loading = false
        if (result.data) {
          bookingEform = result.data
        }
        if (count === 2) {
          vm.mergeBookingCalling(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        if (count === 2) {
          vm.mergeBookingCalling(bookingDossier, bookingEform)
        }
        vm.loading = false
      })
      // 
      let filterDossier = {
        service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceInfoSelected,
        state: 2,
        className: 'DOSSIER',
        gateNumber: vm.currentGate
      }
      vm.$store.dispatch('getBooking', filterDossier).then(function (result) {
        count+=1
        vm.loading = false
        if (result.data) {
          bookingDossier = result.data
        }
        if (count === 2) {
          vm.mergeBookingCalling(bookingDossier, bookingEform)
        }
      }).catch(reject => {
        count+=1
        vm.loading = false
        if (count === 2) {
          vm.mergeBookingCalling(bookingDossier, bookingEform)
        }
      })
    },
    mergeBookingCalling (bookingDossier, bookingEform) {
      let vm = this
      // console.log('booking', bookingEform, bookingDossier)
      if (bookingEform.length > 0 || bookingDossier.length > 0) {
        let booking
        booking = bookingEform.concat(bookingDossier)
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
        booking = sortBooking(booking)
        vm.currentBooking = booking[0]
        console.log('currentBooking', vm.currentBooking)
      } else {
        vm.currentBooking = ''
      }
    },
    callingBooking (item) {
      let vm = this
      vm.currentBooking = item
      item.speaking = false
      item.state = 2
      item.gateNumber = vm.currentGate
      if (vm.currentGate) {
        vm.updateStateBooking(item)
      } else {
        alert('Vui lòng chọn quầy trước khi gọi!')
      }
    },
    callBack (item) {
      let vm = this
      vm.currentBooking = item
      item.state = 2
      item.speaking = false
      vm.updateStateBooking(item)
    },
    callingApplicant (item) {
      let vm = this
      if (vm.currentGate) {
        vm.currentBooking = item
        $('#audioCalling').html('')
        let splitNumberCode = vm.currentBooking['codeNumber'].split('-')
        let numberCalling = splitNumberCode[0] + splitNumberCode[1] + splitNumberCode[2]
        let srcAudioStart = splitNumberCode[0] === 'E' ? `/documents/${vm.groupId}/${vm.idVoicePortlet}/eformStart1.mp3` : `/documents/${vm.groupId}/${vm.idVoicePortlet}/dossierStart1.mp3`
        let numberArr = String(numberCalling).split('')
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
        let gateAudio = `
          <audio id="gateNumber">
            <source src="/documents/${vm.groupId}/${vm.idVoicePortlet}/${Number(vm.currentGate)}.mp3" type="audio/mp3">
          </audio>
        `
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
          document.getElementById('gateNumber').play()
        }
        document.getElementById('gateNumber').onended = function () {
          vm.isCalling = false
        }
        setTimeout (function () {
          vm.isCalling = true
          document.getElementById('start').play()
        }, 300)
        // 
        item.state = 2
        item.gateNumber = vm.currentGate
        vm.updateStateBooking(item)
      } else {
        alert('Chọn bàn tiếp nhận')
      }
    },
    ignoreBooking (item) {
      let vm = this
      vm.currentBooking = ''
      item.state = 3
      vm.updateStateBooking(item)
    },
    updateStateBooking (item) {
      let vm = this
      let filter = item
      vm.$store.dispatch('updateBooking', filter).then(function (result) {
        setTimeout (function () {
          vm.loadBooking()
        }, 500)
      }).catch (function (reject) {
        setTimeout (function () {
          vm.loadBooking()
        }, 500)
      })
    },
    receiveBooking (item) {
      let vm = this
      vm.currentBooking = item
      vm.filterCreateDossier = ''
      if (item.codeNumber.indexOf('E-') >= 0) {
        vm.$store.dispatch('getProcessDetail').then(function (result) {
          let processDetail = result.filter(function (item2) {
            return item2.serviceCode === item.serviceCode
          })[0]
          vm.filterCreateDossier = {
            serviceCode: item.serviceCode,
            govAgencyCode: processDetail['govAgencyCode'],
            dossierTemplateNo: '',
            serviceConfigId: processDetail['serviceConfigId']
          }
          if (processDetail['options'].length === 1) {
            vm.filterCreateDossier.dossierTemplateNo = processDetail['options'][0]['templateNo']
            vm.postDossier()
          } else {
            vm.listDichVu = processDetail['options']
            vm.dichVuSelected = vm.listDichVu[0]
            vm.dialogAction = true
          }
        }).catch (function (reject) {
        })
      } else if (item.codeNumber.indexOf('D-' >=0)) {
        vm.currentBooking.state = 4
        vm.$store.dispatch('updateBooking', vm.currentBooking).then(function (result1) {
        }).catch (function (reject1) {
        })
        let dossierId = item.codeNumber.split('-')[2]
        let urlRedirect = '/web/cuc-lanh-su#/danh-sach-ho-so/9/chi-tiet-ho-so/' + dossierId
        window.open(urlRedirect, '_blank')
      }
    },
    doSubmitCreateDossier () {
      let vm = this
      vm.filterCreateDossier.dossierTemplateNo = vm.dichVuSelected['templateNo']
      vm.postDossier()
      vm.dialogAction = false
    },
    postDossier () {
      let vm = this
      let filter = {
        dossierTemplateNo: vm.filterCreateDossier.dossierTemplateNo
      }
      vm.$store.dispatch('loadDossierFormTemplates', filter).then(function (result) {
        if (result['newFormScript']) {
          vm.currentBooking.state = 4
          vm.$store.dispatch('updateBooking', vm.currentBooking).then(function (result1) {
          }).catch (function (reject1) {
          })
          let urlRedirect = '/web/cuc-lanh-su/mot-cua-dien-tu#/danh-sach-ho-so/0/ho-so/0/NEW'
          let query = '?q=/o/rest/v2/dossiers/todo?order=true&step=110,500&service_config=' + vm.filterCreateDossier['serviceConfigId'] + '&template_no=' + vm.filterCreateDossier['dossierTemplateNo'] + '&eform=true&eformCode=' + vm.currentBooking['codeNumber']
          window.location.href = urlRedirect + query
        } else {
          vm.$store.dispatch('postDossier', vm.filterCreateDossier).then(function (result) {
            vm.currentBooking.state = 4
            vm.$store.dispatch('updateBooking', vm.currentBooking).then(function (result1) {
            }).catch (function (reject1) {
            })
            let urlRedirect = '/web/cuc-lanh-su/mot-cua-dien-tu#/danh-sach-ho-so/0/ho-so/' + result.dossierId + '/NEW'
            let query = '?q=/o/rest/v2/dossiers/todo?order=true&step=110,500&service_config=' + vm.filterCreateDossier['serviceConfigId'] + '&template_no=' + vm.filterCreateDossier['dossierTemplateNo'] + '&eform=true'
            window.location.href = urlRedirect + query
          }).catch (function (reject) {
          })
        }
      })
    },
    getGateNumber () {
      let vm = this
      vm.$store.dispatch('getGateNumber').then(function (result) {
        vm.currentGate = result
        vm.getBookingCalling()
      }).catch (function (reject) {
      })
    },
    updateGateNumber (val) {
      let vm = this
      let filter = {
        gateNumber: val
      }
      vm.$store.dispatch('updateGateNumber', filter).then(function (result) {
        vm.getBookingCalling()
      })
    },
    getStateName () {
      let vm = this
      return vm.stateList.filter(function(state) {
        return state.stateCode === vm.stateSelected
      })[0]['stateName']
    },
    getColor (level) {
      if (level === 2) {
        return 'green'
      } else if (level === 3) {
        return 'orange darken-1'
      } else if (level === 4) {
        return 'red'
      }
    }
  }
}
</script>
