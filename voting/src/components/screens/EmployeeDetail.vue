<template>
  <div v-if="loading" class="text-xs-center pt-4">
    <v-progress-circular
      size="100"
      width="5"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else style="height: 100%; background-color: #ffff;">
  <v-form v-model="validFormVoting" ref="formVoting" lazy-validation>
    <v-layout row wrap>
     <v-flex xs12 sm1>
     </v-flex>
     <v-flex xs12 sm10>
      <v-layout row wrap>
        <v-flex xs12 sm12 class="text-xs-center mt-4 mb-5">
          <h3 class="text-xs-center">ĐÁNH GIÁ CÁN BỘ CÔNG CHỨC</h3>
          <h3 style="text-transform: uppercase; color: #237ff9;" class="text-xs-center">{{itemName}}</h3>
        </v-flex>
        <v-flex xs12 sm12>
        <div style="margin-bottom: 15px;">
          <div v-if="employee['imageUrl']" class="mt-1" :style="'background-image: url(' + employee['imageUrl'] + ');'" style="width: 150px;height: 200px;margin: 0 auto;background-position: center;background-size: cover;"></div>
          <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" style="width: 150px;height: 200px;object-fit: contain;"/>
          <div style="float: left; margin-left: 20px;">
            <div style="margin-bottom: 5px;"><span>Họ và tên: </span> {{employee.fullName}}</div>
            <div style="margin-bottom: 5px;"><span>Ngày sinh: </span> {{employee.birthdate | dateTimeView2}}</div>
            <div style="margin-bottom: 5px;"><span>Chức vụ: </span> {{employee.title}}</div>
          </div>
          <div style="clear: both; margin-top: 15px;"></div>
        </div>
        <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;" :key="index">
          <div style="font-weight: bold;">{{index + 1}}. {{ item.subject }}</div>
          <div class="ml-4">
            <v-radio-group v-model="item.selected" height="10" row>
              <v-radio :label="itemChoise" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
              </v-radio>
            </v-radio-group>
            <v-layout wrap class="ml-3" style="margin-top:-10px">
              <v-flex style="margin-left:18px" v-for="(item2, index2) in item.answers" :key="index2">
                <span class="text-bold" style="color:green">{{item2}}/{{item.answersCount}}</span>
              </v-flex>
            </v-layout>
          </div>
          <div class="mt-3 ml-4 mr-3" v-if="item.commentable">
            <v-text-field
            v-model="item['comment']"
            label="Ý kiến khác"
            multi-line
            rows="2"
            ></v-text-field>
          </div>
        </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 sm1>
    </v-flex>
    <v-flex xs12 sm12 class="text-xs-center mt-2">
      <v-btn v-if="Array.isArray(votingItems) && votingItems.length > 0" @click="submitResultVoting" color="primary" :loading="votingDialog_hidden_loading" :disabled="votingDialog_hidden_loading">
        Gửi kết quả đánh giá
      </v-btn>
      <v-btn @click="goBack" color="primary">
        <v-icon size="16">undo</v-icon>&nbsp;
        Quay lại 
      </v-btn>
    </v-flex>
  </v-layout>
  <v-dialog v-model="dialogShowApplicantIdNo" persistent max-width="400">
    <v-card>
      <v-card-title class="headline">Nhập số CMND, mã hồ sơ</v-card-title>
      <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogShowApplicantIdNo = false">
        <v-icon>clear</v-icon>
      </v-btn>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm12>
            <v-text-field
            placeholder="Nhập số chứng minh thư nhân dân"
            v-model="applicantIdNo"
            :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
            required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12>
            <v-text-field
            placeholder="Nhập mã hồ sơ"
            v-model="dossierNo"
            :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
            required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 class="mb-3" v-if="showCaptcha">
            <captcha ref="captcha"></captcha>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click.native="doVottingSubmit">Đồng ý</v-btn>
        <v-btn color="green darken-1" flat @click.native="() => dialogShowApplicantIdNo = false">Quay lại</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-form>
</div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
import moment from 'moment'
export default {
  props: ['itemCode', 'id'],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    applicantIdNo: '',
    dossierNo: '',
    workingUnit: {},
    employee: {},
    votingItems: [],
    itemName: '',
    btnLoading: false,
    votingDialog_hidden_loading: false,
    validFormVoting: false,
    showCaptcha: false,
    dialogShowApplicantIdNo: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    console.log('landing---------')
    let currentQuery = vm.$router.history.current.query
    if (currentQuery !== null && currentQuery !== undefined && currentQuery !== 'undefined') {
      vm.itemName = currentQuery.itemName
      vm.employee = currentQuery
      console.log(vm.employee)
      vm.$store.dispatch('loadImageEmployee', vm.employee).then(data => {
        if (data !== '' && data !== null) {
          let portalURL = ''
          if (window.themeDisplay !== null && window.themeDisplay !== undefined) {
            portalURL = window.themeDisplay.getPortalURL()
          }
          vm.employee['imageUrl'] = portalURL + data
        }
      }).catch(xhr => {
        vm.employee['imageUrl'] = ''
      })
    }
    vm.$nextTick(function () {
      vm.$store.dispatch('loadVoting', {
        className: 'employee',
        classPk: vm.id
      }).then(result => {
        vm.votingItems = result
        console.log(vm.votingItems)
      }).catch(xhr => {
      })
      // vm.$store.dispatch('getEmployee', {
      //   employeeId: vm.id
      //   // employeeId: 1
      // }).then(result => {
      //   vm.employee = result
      //   console.log(vm.employee)
      // }).catch(xhr => {
      // })
    })
  },
  watch: {
  },
  methods: {
    submitResultVoting: function () {
      var vm = this
      vm.votingDialog_hidden_loading = true
      var isSigned = window.themeDisplay.isSignedIn()
      if (isSigned) {
        vm.doVottingResultSubmit()
      } else {
        vm.votingDialog_hidden_loading = false
        vm.dialogShowApplicantIdNo = true
      }
    },
    doVottingSubmit () {
      var vm = this
      if (!vm.$refs.formVoting.validate()) {
        vm.votingDialog_hidden_loading = false
        return
      } else {
        let filter = {
          applicantIdNo: vm.applicantIdNo,
          dossierNo: vm.dossierNo
        }
        vm.$store.dispatch('checkPermisionVoting', filter).then(result => {
          console.log('result', result)
          if (result.hasPermission === true || result.hasPermission === 'true') {
            vm.doVottingResultSubmit()
          } else {
            toastr.error('Số CMTND hoặc Số hồ sơ không chính xác')
          }
        }).catch(xhr => {
          toastr.error('Lỗi hệ thống')
        })
      }
    },
    doVottingResultSubmit: function () {
      var vm = this
      let arrAction = []
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = vm.itemCode
        vm.votingItems[key]['classPk'] = vm.id
        arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
      }
      Promise.all(arrAction).then(results => {
        toastr.success('Gửi đánh giá thành công thành công')
        vm.dialogShowApplicantIdNo = false
        vm.votingDialog_hidden_loading = false
       vm.$router.push('/danh-sach-can-bo/' + vm.itemCode)
      }).catch(xhr => {
        toastr.error('Gửi đánh giá thất bại')
        vm.votingDialog_hidden_loading = false
        vm.dialogShowApplicantIdNo = false
      })
    },
    goBack () {
      var vm = this
     vm.$router.push('/danh-sach-can-bo/' + vm.itemCode)
    }
  },
  filters: {
    dateTimeView2 (arg) {
      if (arg) {
        return moment(String(arg)).utc().format('DD/MM/YYYY')
      } else {
        return ''
      }
    }
  }
}
</script>
