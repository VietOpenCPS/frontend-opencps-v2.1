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
          <v-flex xs6 class="px-2">
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
            ></v-autocomplete>
          </v-flex>
          <v-flex xs6 class="px-2">
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
            ></v-autocomplete>
          </v-flex>
        </v-layout>
        <v-chip class="text-bold" color="#3fa8f1" text-color="white" style="width:170px;height:42px;font-size: 22px;position:absolute;top:100px;left:10px">
          <v-avatar class="pl-3">
            <v-icon color="white"> chrome_reader_mode</v-icon>
          </v-avatar>
          <span class="pl-2" v-if="!currentGate">BÀN SỐ ---</span>
          <span class="pl-2" v-else>BÀN SỐ {{currentGate}}</span>
        </v-chip>
        <v-flex xs12 class="text-xs-center" style="position: relative;">
          <div class="d-inline-block">
            <div class="d-inline-block">
              <h1 class="my-2" style="color: green">SỐ ĐANG GỌI</h1>
              <v-chip class="d-inline-block text-xs-center pt-2" label color="#3fa8f1" text-color="white" style="width:250px;height:70px;font-size:32px;color:#ffffff">
                <span v-if="currentBooking">{{currentBooking.codeNumber}}</span>
                <span v-else>-- -- --</span>
              </v-chip>
            </div>
            <div v-if="currentBooking" class="d-inline-block ml-3" style="position: absolute;top:50px">
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling"
                color="red"
                class="white--text"
                @click="deleteBooking"
              >
                <v-icon class="ml-0" right dark>clear</v-icon> &nbsp;
                BỎ QUA
              </v-btn>
              <br>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling"
                color="primary"
                class="white--text mt-1"
                @click="callBack"
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
              <span class="text-bold">BÀN TIẾP NHẬN SỐ:</span>
              <v-select
                :items="gateList"
                v-model="currentGate"
                item-text="value"
                item-value="value"
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
            <td class="text-xs-center text-bold py-2" style="letter-spacing:2px" width="150px">
              <div>
                <span>{{props.item.codeNumber}}</span>
              </div>
            </td>
            <td class="text-xs-left text-bold py-2 px-5" style="letter-spacing:2px; word-spacing:2px">
              <div>
                <span>{{props.item.applicantName}}</span>
              </div>
            </td>
            <td class="text-xs-center text-bold py-1" width="300px">
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling || currentBooking['codeNumber'] === props.item['codeNumber']"
                :color="currentBooking['codeNumber'] === props.item['codeNumber'] ? 'grey' : 'primary'"
                class="white--text"
                @click="callingApplicant(props.item)"
              >
                <span v-if="currentBooking['codeNumber'] === props.item['codeNumber']">Đang gọi...</span>
                <span v-else>Gọi số</span>
              </v-btn>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling"
                color="red"
                class="white--text ml-2"
                @click="deleteBooking(props.item)"
              >
                Bỏ qua
              </v-btn>
              <v-btn
                :loading="loadingCalling"
                :disabled="loadingCalling"
                color="#3fa8f1"
                class="white--text ml-2"
                @click="receiveDossier(props.item)"
              >
                Tiếp nhận
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!--  -->
      <div id="audioCalling" style="visibility: hidden;position:fixed;top:0;right:0;z-index:-999">
      </div>
    </v-card>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import axios from 'axios'
import toastr from 'toastr'
import support from '../../store/support.json'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    groupId: window.themeDisplay.getScopeGroupId(),
    idVoicePortlet: 161427,
    serviceInfoList: [],
    serviceInfoSelected: '',
    stateList: [
      {
        stateName: 'Đang chờ tiếp nhận',
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
      value: 1,
      text: 'Bàn số 1'
    },
    {
      value: 2,
      text: 'Bàn số 2'
    },
    {
      value: 3,
      text: 'Bàn số 3'
    },
    {
      value: 4,
      text: 'Bàn số 4'
    },
    {
      value: 5,
      text: 'Bàn số 5'
    }],
    currentGate: '',
    bookingList: [
      {
        codeNumber: 'E-14398-1125',
        applicantName: 'Trần Văn Duẩn',
        counter: '02'
      },
      {
        codeNumber: 'D-14592-4124',
        applicantName: 'Trần Viết Lãm',
        counter: '04'
      },
      {
        codeNumber: 'E-12298-4124',
        applicantName: 'Trịnh Công Trình',
        counter: '01'
      },
      {
        codeNumber: 'D-14528-4525',
        applicantName: 'Nguyễn Tấn Dũng',
        counter: '05'
      },
      {
        codeNumber: 'E-1498-1123',
        applicantName: 'Nông Đức Mạnh'
      },
      {
        codeNumber: 'E-14498-2122',
        applicantName: 'Trần Văn Duẩn'
      }
    ],
    loading: true,
    headers: [
      {
        text: 'Thứ tự',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã tờ khai',
        align: 'center',
        sortable: false
      },
      {
        text: 'Người nộp hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    currentBooking : ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.getServiceInfo()
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
    }
  },
  methods: {
    getServiceInfo () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      vm.$store.dispatch('getServiceLists').then(function (result) {
        vm.serviceInfoList = result
        vm.serviceInfoSelected = newQuery.hasOwnProperty('service') && newQuery.service ? newQuery.service : vm.serviceInfoList[0]
      })
    },
    filterBooking () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['service'] = vm.serviceInfoSelected
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
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = {
        service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceInfoSelected,
        state: currentQuery.hasOwnProperty('state') ? currentQuery.state : vm.stateSelected
      }
      vm.$store.dispatch('getBooking', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.bookingList = result.data
        }
      }).catch(reject => {
        vm.loading = false
      })
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    callingApplicant (item) {
      let vm = this
      if (vm.currentGate) {
        vm.currentBooking = item
        let splitNumberCode = vm.currentBooking['codeNumber'].split('-')
        let numberCalling = splitNumberCode[1] + splitNumberCode[2]
        let srcAudioStart = splitNumberCode[0] === 'E' ? `http://hanoi.fds.vn:1580/documents/${vm.groupId}/${vm.idVoicePortlet}/eformStart1.mp3` : `http://hanoi.fds.vn:1580/documents/${vm.groupId}/${vm.idVoicePortlet}/dossierStart1.mp3`
        let numberArr = String(numberCalling).split('')
        let audioStart = `
          <audio id="start" controls>
            <source src="${srcAudioStart}" type="audio/mp3">
          </audio>
        `
        let audioEnd = `
          <audio id="end">
            <source src="http://hanoi.fds.vn:1580/documents/${vm.groupId}/${vm.idVoicePortlet}/toGateNumber.mp3" type="audio/mp3">
          </audio>
        `
        let audioNumber = ''
        for (let index = 0; index < numberArr.length; index++) {
          audioNumber += `
            <audio id="au${index}">
              <source src="http://hanoi.fds.vn:1580/documents/${vm.groupId}/${vm.idVoicePortlet}/${numberArr[index]}.mp3" type="audio/mp3">
            </audio>
          `
        }
        let gateAudio = `
          <audio id="gateNumber">
            <source src="http://hanoi.fds.vn:1580/documents/${vm.groupId}/${vm.idVoicePortlet}/${vm.currentGate}.mp3" type="audio/mp3">
          </audio>
        `
        $('#audioCalling').html(audioStart + audioNumber + audioEnd + gateAudio)
        // 
        document.getElementById('start').onended = function() {
          for (let index = 0; index < numberArr.length; index++) {
            setTimeout (function() {
              document.getElementById(`au${index}`).play()
            }, (index + 1)*1000)
          }
          setTimeout (function () {
            document.getElementById('end').play()
          }, numberArr.length * 1000)
        }
        document.getElementById('end').onended = function() {
          document.getElementById('gateNumber').play()
        }
        document.getElementById('start').play()
        // 
      } else {
        alert('Chọn bàn tiếp nhận')
      }
    },
    deleteBooking (item) {
      let vm = this
      vm.currentBooking = ''
      vm.currentGate = ''
      console.log(item)
    },
    callBack () {
      let vm = this
      vm.callingApplicant(vm.currentBooking)
    },
    receiveDossier (item) {
      let vm = this
      vm.currentBooking = item
      console.log(item)
    },
    createDossier (item) {
      let isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
      if (isSigned) {
        let redirectURL = window.themeDisplay.getLayoutRelativeURL().substring(0, window.themeDisplay.getLayoutRelativeURL().lastIndexOf('\/'))
        let url = redirectURL + '/dich-vu-cong#/add-dvc/' + item.serviceConfigId
        window.open(url, '_self')
      } else {
        alert('Vui lòng đăng nhập để nộp hồ sơ trực tuyến')
        // vm.dialog_createDossier = true
      }
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
