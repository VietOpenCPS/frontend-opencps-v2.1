<template>
  <v-card flat color="#fff" class="pb-4" style="height:100vh">
    <div class="row-header no__hidden_class">
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
    </div>
    <div class="px-3 mt-3" style="font-size:16px">
      <p class="mb-2 text-bold">Tên tờ khai: <span class="ml-2 primary--text">{{fileTemplateSelected.templateName}}</span></p>
      <p class="mb-2 text-bold">Mã tờ khai: <span class="ml-2 primary--text">E-{{eformDetail.secret}}-{{eformDetail.eFormId }}</span></p>
      <span class="mr-2"><v-icon color="warning">warning</v-icon></span>
      <i>Vui lòng ghi lại Mã tờ khai để tra cứu, in lại tờ khai khi cần thiết!</i>
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
    <!-- <v-flex xs12 class="text-xs-right mt-3">
      <v-btn color="primary" class="ml-3 mr-2 white--text" @click="goBack">
        <v-icon>reply</v-icon> &nbsp;
        Quay lại
      </v-btn>
    </v-flex> -->
    <!--  -->
    <v-dialog max-width="1200px" v-model="dialogPDF" transition="fade-transition">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Tờ khai trực tuyến</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
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
    dialogPDFLoading: false
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
