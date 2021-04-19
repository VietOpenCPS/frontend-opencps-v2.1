<template>
  <div class="" style="max-width: 1000px; margin: 0 auto;">
    <input type="file" style="display: none" id="fileStatisticTemplate"  @change="onUploadStatisticTemplate($event)">
    
    <div style="width: 100%;height: 60px;">
      <v-flex xs12 class="right">
        <v-btn  color="primary" @click.native="goToDone" class="right my-3 ml-3"
          :loading="loadingAction"
          :disabled="loadingAction"
        >
          <v-icon color="green">exit_to_app</v-icon>&nbsp;
          Chuyển hoàn thành
        </v-btn>
        <v-btn color="primary" @click.native="uploadFile" class="right my-3"
          :loading="loadingAction"
          :disabled="loadingAction"
        >
          <v-icon color="green">fas fa fa-file-excel-o</v-icon>&nbsp;
          Tải lên danh sách hồ sơ
        </v-btn>
      </v-flex>
    </div>
    <div style="width: 100%" v-if="loadingAction && !runUpdate">
      <div class="text-xs-center">
        <span style="font-size: 16px"><span style="color: red">{{successCount + errorCount}}</span> / <span style="color: green">{{dossierList.length}}</span></span>
      </div>
      <v-progress-linear v-model="valueDeterminate"></v-progress-linear>
    </div>
    <div style="width: 100%" v-if="!loadingAction && runUpdate">
      <div class="mb-2">
        <span>Tổng số: <span style="color: blue">{{dossierList.length}}</span></span>;&nbsp;
        <span><span>Thành công: </span> <span style="color: green">{{successCount}}</span></span>;&nbsp;
        <span><span>Thất bại: </span> <span style="color: red">{{errorCount}}</span></span>
      </div>
    </div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big">
        <span>DANH SÁCH HỒ SƠ QUÁ HẠN</span>
      </div>
      <div class="pr-3" style="width: 100%;">
        <span class="d-inline-block right text-bold">Tổng số: {{dossierList.length}} hồ sơ</span>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="dossierList"
      hide-actions
      class="table-landing table-bordered"
      style="border-left: 1px solid #dedede;"
    >
      <template slot="items" slot-scope="props">
        <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
          <td class="text-xs-center my-1 py-1" @click="viewDetail(props.item)" style="height: 26px; width: 150px">
            <div>
              <v-icon size=14 style="color:green !important" v-if="props.item['success'] === 1">done</v-icon>
              <v-icon size=14 style="color:red !important" v-if="props.item['success'] === 0">block</v-icon>
              &nbsp;<span>{{props.index + 1}}</span>
            </div>
          </td>
          <td class="text-xs-left my-1 py-1" style="height: 26px; min-width: 135px;" @click="viewDetail(props.item)">
            <div class="ml-2">
              <span>{{props.item.dossierNo}}</span>
            </div>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <div class="text-xs-center mt-2">
          Không có hồ sơ nào
        </div>
      </template>
    </v-data-table>
    <!--  -->
  </div>
</template>

<script>

import $ from 'jquery'
import axios from 'axios'
import toastr from 'toastr'
import readXlsxFile from 'read-excel-file'
import convertToJson from "read-excel-file/schema"
export default {
  props: [],
  components: {
  },
  data: () => ({
    runUpdate: false,
    countStep: 0,
    successCount: 0,
    errorCount: 0,
    valueDeterminate: 0,
    loadingAction: false,
    isAdmin: false,
    dossierList: [],
    dataImportExcel: '',
    serverImportId: '',
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    options () {
      return {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    $('html').addClass('report')
    vm.$nextTick(function () {
      vm.runUpdate = false
      vm.getRoleUser()
    })
  },
  mounted () {
    let vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      
    }
  },
  methods: {
    uploadFile () {
      let vm = this
      document.getElementById('fileStatisticTemplate').value = ''
      document.getElementById('fileStatisticTemplate').click()
    },
    onUploadStatisticTemplate () {
      let vm = this
      vm.dossierList = []
      vm.runUpdate = false
      let map1 = {
        'index': {prop: 'index'},
        'dossierNo': {prop: 'dossierNo'}
      }
      let inputFile = document.getElementById('fileStatisticTemplate')
      // DVC-MCDT
      readXlsxFile(inputFile.files[0], {sheet: 1}).then((rows) => {
        let dataJson = convertToJson(rows, map1)
        let dataOut = dataJson.rows.map(item => {
          item['success'] = ''
          return item
        })
        dataOut.shift()
        vm.dossierList = dataOut
        vm.dossierList = vm.dossierList.filter(function (item) {
          return item.hasOwnProperty('dossierNo') && item.dossierNo
        })
        vm.countStep = (100/vm.dossierList.length).toFixed(3)
        console.log("dossierList", vm.dossierList)
      })
    },
    goToDone () {
      let vm = this
      let arrRequest = []
      vm.successCount = 0
      vm.errorCount = 0
      vm.dossierList = vm.dossierList.filter(function (item) {
        return !item.success
      })
      if (vm.dossierList.length) {
        vm.countStep = (100/vm.dossierList.length).toFixed(3)
      }
      for (let key in vm.dossierList) {
        arrRequest.push(vm.goToStep(vm.dossierList[key], key))
      }
      vm.loadingAction = true
      vm.runUpdate = false
      Promise.all(arrRequest).then(results => {
        vm.loadingAction = false
        vm.runUpdate = true
        vm.valueDeterminate = 0
        toastr.success('Quá trình chuyển hồ sơ hoàn thành')
      }).catch(reject => {
      })
    },
    goToStep (item, key) {
      let vm = this
      return new Promise((resolve, reject) => {
        let options = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId()
          }
        }
        let dataGoto = new URLSearchParams()
        let url = '/o/rest/v2/dossiers/' + item.dossierNo + '/goto/400'
        axios.post(url, dataGoto, options).then(function (response) {
          vm.valueDeterminate += vm.countStep
          if (response['status'] !== undefined && response['status'] !== 200) {
            vm.errorCount += 1
            vm.dossierList[key]['success'] = 0
            resolve('error')
          } else {
            vm.successCount += 1
            vm.dossierList[key]['success'] = 1
            resolve('success')
          }
        }).catch(function (xhr) {
          vm.valueDeterminate += vm.countStep
          vm.errorCount += 1
          vm.dossierList[key]['success'] = 0
          resolve('error')
        })
      })
      
    },
    getRoleUser () {
      let vm = this
      vm.isAdmin = false
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
        }
      }
      axios.get('/o/rest/v2/users/login', param).then(function (response) {
        let serializable = response.data
        if (serializable && serializable.length > 0) {
          let roles = []
          for (let key in serializable) {
            if (serializable[key]['role']) {
              roles.push(serializable[key]['role'])
            }
          }
          let roleExits = roles.findIndex(item => item === 'Administrator' || item === 'Administrator_data')
          if (roleExits >= 0) {
            vm.isAdmin = true
          }
        } else {
          vm.isAdmin = false
        }
      }).catch(function (error) {
        vm.isAdmin = false
      })
    },
    viewDetail () {
      let vm = this
      if (!vm.loadingAction) {

      }
    }
  }
}
</script>
