<template>
  <v-card flat color="#ffffff" class="my-4" style="height:100vh;">
    <div v-if="timeBooking" style="position: absolute;top: 0; right: 0; max-width: 500px">
      <v-alert
        :value="true"
        color="info"
        icon="info"
        outline
        class="my-0 px-2 py-2"
      >
        - Tờ khai đã đăng ký xếp hàng.<br>
        - Thời gian xếp hàng: {{timeBooking}} ngày {{checkinDate}}.<br>
        - Qua thời gian xếp hàng trên nếu chưa đến làm thủ tục đề nghị đăng ký xếp hàng lại.
      </v-alert>
    </div>
    <!-- <div class="row-header no__hidden_class">
      <div class="background-triangle-big">
        <span v-if="String(index) !== '0'">THÔNG TIN TỜ KHAI</span>
        <span v-else>TẠO TỜ KHAI THÀNH CÔNG</span>
      </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
        </div>
        <div class="flex text-right" style="margin-left: auto;max-width: 150px;height:37px">
          <v-btn color="primary" class="my-0 mx-0 white--text" v-on:click.native="goBack" style="height:100%">
            <v-icon size="16">reply</v-icon> &nbsp;
            Quay lại
          </v-btn>
        </div>
      </div> 
    </div> -->
    <v-container align-center row wrap class="px-0 pt-0">
      <v-flex xs12 style="border: 1px solid #0072bc; border-radius: 3px">
        <v-layout row wrap>
          <h2 class="flex pt-2 text-xs-center">
            <span style="color:#065694">THÔNG TIN TỜ KHAI </span>
          </h2>
          <v-flex xs12 sm12 class="pb-3">
            <div class="px-3 mt-3" style="font-size:16px">
              <p class="mb-2 text-bold">Tên tờ khai: <span class="ml-2 primary--text">{{fileTemplateSelected.templateName}}</span></p>
              <p class="mb-2 text-bold">Mã tờ khai: <span class="ml-2 primary--text">{{eformDetail.eFormNo }}</span></p>
              <p class="mb-2 text-bold">Mã bí mật tra cứu tờ khai: <span class="ml-2 primary--text">{{eformDetail.secret}}</span></p>
              <span class="mr-2"><v-icon color="warning">warning</v-icon></span>
              <span class="warning--text" style="font-size: 1.2em">Vui lòng ghi lại Mã tờ khai, Mã bí mật để tra cứu, in lại tờ khai khi cần thiết!</span>
              <div class="mt-3">
                <v-btn color="success" class="white--text" 
                  @click="previewEform"
                  :loading="dialogPDFLoading"
                  :disabled="dialogPDFLoading"
                >
                  <v-icon>visibility</v-icon> &nbsp;
                  Xem trước
                </v-btn>
                <v-btn color="primary" class="ml-3 white--text"
                @click="downloadEform"
                  :loading="dialogPDFLoading"
                  :disabled="dialogPDFLoading"
                >
                  <v-icon>cloud_download</v-icon> &nbsp;
                  Tải xuống
                </v-btn>
              </div>
              <p class="mt-4">
                -  Để hoàn tất thủ tục, đề nghị mang Tờ khai này cùng các giấy tờ theo quy định đến Cục Lãnh sự 
                hoặc Sở Ngoại vụ Thành phố Hồ Chí Minh hoặc Ngoại vụ địa phương hoặc 
                Cơ quan đại diện để xin chứng nhận/ hợp pháp hóa lãnh sự.
              </p>
              <p>
                -  Tờ khai này chỉ có giá trị hiệu lực trong vòng 10 ngày làm việc. Quá thời hạn trên nếu chưa nộp tờ khai đề nghị kê khai tờ khai mới.
              </p>
            </div>
          </v-flex>
          <v-flex xs12 class="text-xs-right mt-3 mb-2">
            <v-btn color="primary" class="mx-3 white--text" @click="goBack">
              <v-icon>reply</v-icon> &nbsp;
              Quay lại
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    <!--  -->
    </v-container>
    
    <v-dialog fullscreen v-model="dialogPDF" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Tờ khai trực tuyến</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn title="Thoát" icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-0 py-0">
          <div v-if="dialogPDFLoading" style="
              min-height: 700px;
              text-align: center;
              margin: auto;
              padding: 25%;
          ">
            <v-progress-circular
              :size="100"
              :width="1"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </div>
          <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
          </iframe>
        </v-card-text>
        
        <v-card-actions class="mx-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" class="white--text mr-2" @click.native="printEform">
            <v-icon>print</v-icon> &nbsp;
            In tờ khai
          </v-btn>
          <v-btn color="red" class="white--text" @click.native="() => dialogPDF = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import support from '../../store/support.json'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    serviceInfoList: [],
    eformNoSearch: '',
    formScriptEform: '',
    dialogPDF: false,
    dialogPDFLoading: false,
    timeBooking: '',
    checkinDate: ''
  }),
  computed: {
    serviceinfoSelected () {
      return this.$store.getters.getServiceinfoSelected
    },
    fileTemplateSelected () {
      return this.$store.getters.getFileTemplateSelected
    },
    eformDetail () {
      return this.$store.getters.getEformDetail
    },
    serverCode () {
      return this.$store.getters.getServerNo
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      if (!vm.eformDetail.secret && !vm.eformDetail.eFormNo) {
        vm.goBack()
      }
      if (String(vm.index) === '1') {
        vm.getDetailBooking()
      }
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
    downloadEform () {
      let vm = this
      vm.dialogPDFLoading = true
      vm.$store.dispatch('downloadEform', vm.eformDetail).then(function (result) {
        vm.dialogPDFLoading = false
      }).catch(function (reject) {
        vm.dialogPDFLoading = false
      })
    },
    previewEform () {
      let vm = this
      vm.dialogPDFLoading = true
      vm.$store.dispatch('previewEform', vm.eformDetail).then(function (result) {
        vm.dialogPDFLoading = false
        vm.dialogPDF = true
        document.getElementById('dialogPDFPreview').src = result
      }).catch(function (reject) {
        vm.dialogPDFLoading = false
      })
    },
    printEform () {
      try {
        document.getElementById("dialogPDFPreview").contentWindow.print()
      } catch (error) {
      }
    },
    getDetailBooking () {
      let vm = this
      let serverNoInfo = this.$store.getters.getServerNo
      let serverNo = serverNoInfo ? serverNoInfo : 'SERVER_CLS'
      let filter = {
        codeNumber: vm.eformDetail.eFormNo ? vm.eformDetail.eFormNo : '',
        serverCode: serverNo
      }
      vm.$store.dispatch('getDetailBookingProxy', filter).then(function (result) {
        vm.timeBooking = result.bookingInTime ? result.bookingInTime : ''
        vm.checkinDate = vm.parseDate(result.checkinDate)
      }).catch(function (reject) {
      })
    },
    parseDate (value) {
      if (!value) return ''
      let date = ''
      if (!isNaN(Number(value))) {
        date = new Date(Number(value))
      } else {
        date = new Date(value)
      }
      if (date) {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      } else {
        return ''
      }
    },
    goBack () {
      let vm = this
      vm.$router.push({
        path: '/',
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    }
  }
}
</script>
