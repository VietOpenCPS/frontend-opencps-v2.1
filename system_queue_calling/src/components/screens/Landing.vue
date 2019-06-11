<template>
  <v-card flat color="#ffffff" class="pt-3">
    <v-flex xs12 class="text-xs-center" id="nav-calling">
      <v-chip class="text-bold" color="#3fa8f1" text-color="white" style="width:170px;height:42px;font-size: 22px;position:absolute;top:20px;left:10px">
        <v-avatar class="pl-3">
          <v-icon color="white"> chrome_reader_mode</v-icon>
        </v-avatar>
        <span class="pl-2" v-if="!currentCounter">BÀN SỐ ---</span>
        <span class="pl-2" v-else>BÀN SỐ {{currentCounter}}</span>
      </v-chip>
      <h1 style="font-size:24px; color: #11558e" class="text-bold">HỆ THỐNG GỌI SỐ TỰ ĐỘNG</h1>
      <v-flex xs12 class="text-xs-center" style="position: relative;">
        <div class="d-inline-block">
          <div class="d-inline-block">
            <h1 class="my-2" style="color: green">SỐ ĐANG GỌI</h1>
            <v-chip class="d-inline-block text-xs-center pt-2" label color="#3fa8f1" text-color="white" style="width:200px;height:70px;font-size:32px;color:#ffffff">
              <span v-if="currentApplicant">{{currentApplicant.formCode}}</span>
              <span v-else>-- -- --</span>
            </v-chip>
          </div>
          <div v-if="currentApplicant" class="d-inline-block ml-3" style="position: absolute;top:50px">
            <v-btn
              :loading="loadingCalling"
              :disabled="loadingCalling"
              color="red"
              class="white--text"
              @click="ignoreApplicant"
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
          <div class="text-bold my-2 mt-4 mx-2 left">DANH SÁCH CHỜ TIẾP NHẬN</div>
        </v-flex>
        <v-flex xs6 class="text-right pt-3">
          <div class="d-inline-block">
            <span class="text-bold">BÀN TIẾP NHẬN SỐ:</span>
            <v-select
              :items="counterList"
              v-model="currentCounter"
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
      :items="applicantList"
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
              <span>{{props.item.formCode}}</span>
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
              :disabled="loadingCalling"
              color="primary"
              class="white--text"
              @click="callingApplicant(props.item)"
            >
              Gọi số
            </v-btn>
            <v-btn
              :loading="loadingCalling"
              :disabled="loadingCalling"
              color="red"
              class="white--text ml-2"
              @click="ignoreApplicant(props.item)"
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
    <audio id="my-audio" controls autoplay>
      <source src="" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </v-card>
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
    loadingCalling: false,
    counterList: [{
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
    currentCounter: '',
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
    currentApplicant : ''
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      setTimeout(function () {
        if (vm.applicantList.length > 5) {
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
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.govAgencySelected = vm.domainSelected = vm.levelSelected = vm.serviceNameKey = ''
      vm.govAgencySelected = currentQuery.hasOwnProperty('agency') ? currentQuery.agency : ''
      vm.domainSelected = currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      vm.levelSelected = currentQuery.hasOwnProperty('level') && !isNaN(currentQuery.hasOwnProperty('level')) ? Number(currentQuery.level) : ''
      vm.serviceNameKey = currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : ''
      if (currentQuery.hasOwnProperty('agency')) {
        let filterDomain = {
          agencyCode: currentQuery['agency']
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      } else {
        let filterDomain = {
          agencyCode: ''
        }
        vm.$store.dispatch('getDomain', filterDomain).then(function (result) {
          vm.domainListCurrent = result
        })
      }
      vm.doLoadingThuTuc()
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
    }
  },
  methods: {
    changeAdministration () {
      var vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = vm.govAgencySelected
        newQuery['domain'] = ''
        newQuery['keyword'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: vm.pathRouter + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    doLoadingThuTuc () {
      var vm = this
      vm.serviceInfoList = []
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      var filter = null
      filter = {
        page: currentQuery.page ? currentQuery.page : 1,
        administration: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : '',
        keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
        level: currentQuery.hasOwnProperty('level') ? currentQuery.level : '',
        domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : ''
      }
      vm.$store.dispatch('getServiceLists', filter).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.serviceInfoList = result.data
          vm.thutucPage = Number(currentQuery.page) ? Number(currentQuery.page) : 1
          vm.totalThuTuc = result.total
        } else {
          vm.totalThuTuc = 0
          vm.serviceInfoList = []
        }
        vm.serviceItemTotal = result.total
      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoList = []
        vm.totalThuTuc = 0
        vm.thutucPage = 1
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
      vm.currentApplicant = item
      console.log(item)
    },
    ignoreApplicant (item) {
      let vm = this
      vm.currentApplicant = ''
      vm.currentCounter = ''
      console.log(item)
    },
    callBack () {
      let vm = this
      let params = {
        text: 'Xin chào',
        voice: 'free',
        gender: 'female',
        speed: -2
      }

      $.ajax({
        url: 'https://speech.openfpt.vn/speech',
        headers: {
          'api_key': 'beded05cc91b4499abb15ab67c56f62a'
        },
        method: 'POST',
        dataType: 'json',
        data: params,
        success: function(data){
          document.getElementById("my-audio").pause()
          document.getElementById("my-audio").setAttribute('src', data.async)
          document.getElementById("my-audio").load()
          document.getElementById("my-audio").play()
        }
      })
    },
    receiveDossier (item) {
      let vm = this
      vm.currentApplicant = item
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
