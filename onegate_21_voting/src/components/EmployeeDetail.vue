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
          <h3 class="text-xs-center">ĐÁNH GÍA CÁN BỘ CÔNG CHỨC</h3>
          <h3 style="text-transform: uppercase; color: #237ff9;" class="text-xs-center">{{administrationName}}</h3>
        </v-flex>
        <v-flex xs12 sm12>
        <div style="margin-bottom: 15px;">
          <img v-if="employee['imageUrl']" style="width: 150px; height: 140px;" src="employee['imageUrl']"/>
          <img v-else src="https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0=" style="width: 150px; height: 140px; float: left;" />
          <div style="float: left; margin-left: 20px;">
            <div style="margin-bottom: 5px;"><span>Họ và tên: </span> {{employee.fullName}}</div>
            <div style="margin-bottom: 5px;"><span>Ngày sinh: </span> {{employee.birthdate | dateTimeView2}}</div>
            <div style="margin-bottom: 5px;"><span>Chức vụ: </span> {{employee.title}}</div>
          </div>
          <div style="clear: both; margin-top: 15px;"></div>
        </div>
        <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;">
          <div style="font-weight: bold;">{{index + 1}}. {{ item.subject }}</div>
          <div class="ml-4">
            <v-radio-group v-model="item.selected" height="10" row>
              <v-radio :label="itemChoise" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
              </v-radio>
            </v-radio-group>
          </div>
        </div>
        <div style="margin-top: 5px; clear: both;">
          <v-layout row wrap>
            <v-flex xs12 sm4 class="mr-4">
              <v-text-field
              label="Chứng minh thư nhân dân"
              v-model="applicantIdNo"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm3>
              <v-text-field
              label="Mã hồ sơ"
              v-model="dossierNo"
              :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
              required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 class="mb-3" v-if="showCaptcha">
              <captcha ref="captcha"></captcha>
            </v-flex>
          </v-layout>
        </div>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 sm1>
    </v-flex>
    <v-flex xs12 sm12 class="text-xs-center mt-2">
      <v-btn @click="doVottingResultSubmit" color="primary" :loading="votingDialog_hidden_loading" :disabled="votingDialog_hidden_loading">Gửi kết quả đánh gía</v-btn>
    </v-flex>
  </v-layout>
  </v-form>
</div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
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
    administrationName: '',
    btnLoading: false,
    votingDialog_hidden_loading: false,
    validFormVoting: false,
    showCaptcha: false
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
      vm.administrationName = currentQuery.administrationName
      vm.employee = currentQuery
      console.log(vm.employee)
      vm.$store.dispatch('loadImageEmployee', vm.employee).then(resultUrl => {
        vm.employee['imageUrl'] = resultUrl
      }).catch(xhr => {
      })
    }
    vm.$nextTick(function () {
      vm.$store.dispatch('loadVoting', {
        className: vm.itemCode,
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
    doVottingResultSubmit: function () {
      var vm = this
      // if (vm.$refs.captcha) {
      //   if (!vm.$refs.captcha.checkValidCatcha()) {
      //     toastr.error('Xác nhận sai. Vui lòng kiểm tra lại!')
      //     return
      //   }
      // } else {
      //   vm.showCaptcha = true
      //   return
      // }
      if (!vm.$refs.formVoting.validate()) {
        vm.votingDialog_hidden_loading = false
        return
      }
      vm.votingDialog_hidden_loading = true
      let arrAction = []
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = vm.itemCode
        vm.votingItems[key]['classPk'] = vm.id
        vm.votingItems[key]['applicantIdNo'] = vm.applicantIdNo
        vm.votingItems[key]['dossierNo'] = vm.dossierNo
        arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
      }
      Promise.all(arrAction).then(results => {
        toastr.success('Yêu cầu của bạn được thực hiện thành công.')
        vm.votingDialog_hidden_loading = false
      }).catch(xhr => {
        toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        vm.votingDialog_hidden_loading = false
      })
    }
  },
  filters: {
    dateTimeView2 (arg) {
      if (arg) {
        return moment(String(arg)).utc().format('DD/MM/YYYY HH:mm:ss')
      } else {
        return ''
      }
    }
  }
}
</script>
