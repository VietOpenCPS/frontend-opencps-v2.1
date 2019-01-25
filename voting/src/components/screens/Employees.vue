<template>
  <div>
    <h3 class="text-xs-center mt-2" style="color:#065694">ĐÁNH GIÁ CÁN BỘ</h3>
    <h3 class="text-xs-center mb-3" style="text-transform: uppercase; color: #bd3718;">{{itemName}}</h3>
    <v-layout justify-center>
      <v-flex xs12>
        <v-card flat >
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex
                v-for="employee in employeeItems"
                xs12 sm4 md2
                :key="employee.employeeId"
              >
                <v-card color="#1a571b21">
                  <v-flex style="text-align: center!important;">
                    <img v-if="employee['photoFileEntryId']" :src="employee.photoFileEntryId" style="width: 150px;height: 200px;object-fit: contain;"/>
                    <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" style="width: 150px;height: 200px;object-fit: contain;"/>
                  </v-flex>
                  <v-divider light></v-divider>
                  <v-card-text class="py-2 px-1">
                    <v-flex xs12 class="text-bold text-xs-center px-2"><span class="primary--text">{{employee.fullName}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span> {{employee.jobPosTitle}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span>{{itemName}}</span></v-flex>
                    <v-flex xs12 class="px-2"><span>{{employee.telNo}}</span></v-flex>
                  </v-card-text>
                  <v-divider light></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip top>
                      <v-btn icon slot="activator" @click="showVoting(employee)">
                        <v-icon color="green">star</v-icon>
                      </v-btn>
                      <span>Đánh giá</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn icon slot="activator" @click="showVotingResult(employee)">
                        <v-icon color="orange">bookmark</v-icon>
                      </v-btn>
                      <span>Xem đánh giá</span>
                    </v-tooltip>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

        <v-dialog v-model="dialog_voting" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Đánh giá cán bộ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="closeVoting">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm9 class="pl-4">
              <v-card flat class="py-1" v-if="Array.isArray(votingItems) && votingItems.length > 0">
                <div v-for="(item, index) in votingItems" :key="index">
                  <div class="text-bold primary--text">{{index + 1}}. {{ item.subject }}</div>
                  <div class="ml-4">
                    <v-radio-group v-model="item.selected" column class="mt-1">
                      <v-radio :label="itemChoise" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </v-card>
              <div class="px-3" v-else>
                <v-alert outline color="warning" icon="priority_high" :value="true">
                  Không có câu hỏi đánh giá
                </v-alert>
              </div>
              <v-flex xs12 sm12 class="mt-3">
                <v-btn v-if="Array.isArray(votingItems) && votingItems.length > 0" @click="submitResultVoting" color="primary">
                  <v-icon size="16">save</v-icon>&nbsp;
                  Gửi kết quả đánh giá
                </v-btn>
                <v-btn @click="closeVoting" color="primary">
                  <v-icon size="16">reply</v-icon>&nbsp;
                  Quay lại 
                </v-btn>
              </v-flex>
            </v-flex>
            <v-flex xs12 sm3>
              <v-card flat color="#1a571b21" width="225px" max-height="350">
                <v-flex style="text-align: center!important;">
                  <img v-if="employeeSelected['photoFileEntryId']" :src="employeeSelected.photoFileEntryId" style="width: 150px;height: 200px;object-fit: contain;"/>
                  <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" style="width: 150px;height: 200px;object-fit: contain;"/>
                </v-flex>
                <v-divider light></v-divider>
                <v-card-text class="py-2 px-1">
                  <v-flex xs12 class="text-bold text-xs-center px-2 pb-2"><span class="primary--text">{{employeeSelected.fullName}}</span></v-flex>
                  <v-flex xs12 class="px-1 pb-2">
                    <span class="text-bold"> Chức vụ: </span>
                    <span> {{employeeSelected.jobPosTitle}}</span>
                  </v-flex>
                  <v-flex xs12 class="px-1 pb-2">
                    <span class="text-bold"> Đơn vị: </span>
                    <span>{{itemName}}</span>
                  </v-flex>
                  <v-flex xs12 class="px-1 pb-2">
                    <span class="text-bold"> Điện thoại: </span>
                    <span>{{employeeSelected.telNo}}</span>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogShowApplicantIdNo" persistent max-width="400">
      <v-form v-model="validFormVoting" ref="formVoting" lazy-validation>
        <v-card>
          <v-toolbar flat dark color="primary">
              <v-toolbar-title>Nhập số CMND, mã hồ sơ</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click.native="dialogShowApplicantIdNo = false">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <v-text-field
                box
                label="Số chứng minh thư nhân dân"
                v-model="applicantIdNo"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12>
                <v-text-field
                box
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
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="doVottingSubmit">Đồng ý</v-btn>
            <v-btn color="green darken-1" flat @click.native="() => dialogShowApplicantIdNo = false">Quay lại</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!--  -->
    <v-dialog v-model="dialog_voting_result" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Kết quả đánh giá cán bộ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="closeVotingResult">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm9 class="pl-4">
              <v-card flat class="py-1" v-if="Array.isArray(votingItems) && votingItems.length > 0">
                <div v-for="(item, index) in votingItems" :key="index">
                  <div class="text-bold primary--text">
                    {{index + 1}}. {{ item.subject }}
                    <i style="color:#ad1717"> (Số lượt đánh giá: {{item.answersCount}})</i>
                  </div>
                  <v-card flat class="pl-2">
                    <v-card-text class="px-2 py-1 pr-0">
                      <div v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                        <v-layout wrap class="mb-2">
                          <div class="flex xs6 sm8 pr-2">{{itemChoise}} <span class="text-bold" :style="'color:' + barColor[indexChoise]">({{item.answers[indexChoise]}})</span> </div>
                          <progress-bar v-if="item.answersCount > 0" class="flex xs6 sm4" size="16" :spacing="1" bar-transition="all 1s ease"
                          :val="getPercent(item.answers, indexChoise)" :text="getPercent(item.answers, indexChoise) !== 0 ? getPercent(item.answers, indexChoise) + '%' : ''" 
                          text-position="inside" bg-color="#e0e0e0" :bar-color="barColor[indexChoise]" text-fg-color="#fff" style="z-index:10000">
                          </progress-bar>
                        </v-layout>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card>
              <div class="px-3" v-else>
                <v-alert outline color="warning" icon="priority_high" :value="true">
                  Không có câu hỏi đánh giá
                </v-alert>
              </div>
              <v-flex xs12 sm12 class="mt-3">
                <v-btn @click="closeVotingResult" color="primary">
                  <v-icon size="16">reply</v-icon>&nbsp;
                  Quay lại 
                </v-btn>
              </v-flex>
            </v-flex>
            <v-flex xs12 sm3>
              <v-card flat color="#1a571b21" width="225px" max-height="350">
                <v-flex style="text-align: center!important;">
                  <img v-if="employeeSelected['photoFileEntryId']" :src="employeeSelected.photoFileEntryId" style="width: 150px;height: 200px;object-fit: contain;"/>
                  <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" style="width: 150px;height: 200px;object-fit: contain;"/>
                </v-flex>
                <v-divider light></v-divider>
                <v-card-text class="py-2 px-1">
                  <v-flex xs12 class="text-bold text-xs-center px-2 pb-2"><span class="primary--text">{{employeeSelected.fullName}}</span></v-flex>
                  <v-flex xs12 class="px-1 pb-2">
                    <span class="text-bold"> Chức vụ: </span>
                    <span> {{employeeSelected.jobPosTitle}}</span>
                  </v-flex>
                  <v-flex xs12 class="px-1 pb-2">
                    <span class="text-bold"> Đơn vị: </span>
                    <span>{{employeeSelected.workingUnit}}</span>
                  </v-flex>
                  <v-flex xs12 class="px-1 pb-2">
                    <span class="text-bold"> Điện thoại: </span>
                    <span>{{employeeSelected.telNo}}</span>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
import ProgressBar from 'vue-simple-progress'

Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['itemCode'],
  components: {
    ProgressBar,
    'captcha': Captcha
  },
  data: () => ({
    govAgencyName: {},
    itemName: '',
    employeeItems: [],
    btnLoading: false,
    dialog_voting: false,
    dialog_voting_result: false,
    dialogShowApplicantIdNo: false,
    applicantIdNo: '',
    dossierNo: '',
    employeeSelected: '',
    votingItems: [],
    showCaptcha: false,
    validFormVoting: false,
    barColor: ['#5cb85c', '#f0ad4e', '#d9534f', '#2e4fc8', '#2ec8bad9']
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    console.log('landing---------', vm.itemCode)
    let currentQuery = vm.$router.history.current.query
    if (currentQuery.hasOwnProperty('itemName')) {
      vm.itemName = currentQuery.itemName
    }
    vm.$nextTick(function () {
      vm.$store.dispatch('loadEmployees', {
        itemCode: vm.itemCode
      }).then(result => {
        vm.employeeItems = result
        // if (vm.employeeItems.length > 0) {
        //   for (var i = 0; i < vm.employeeItems.length; i++) {
        //     vm.getImageUsers(i, vm.employeeItems[i])
        //   }
        // }
        console.log(vm.employeeItems)
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    getImageUsers (key, item) {
      var vm = this
      vm.$store.dispatch('loadImageEmployee', item).then(result => {
        item['imageUrl'] = result
      }).catch(xhr => {
      })
    },
    viewVotings (item, index) {
      var vm = this
      var query = item
      query['itemName'] = vm.itemName
     vm.$router.push({
        path: '/danh-sach-can-bo/' + vm.itemCode + '/' + item.employeeId,
        query: query
      })
    },
    showVoting (item) {
      let vm = this
      vm.employeeSelected = item
      vm.dialog_voting = true
      vm.$store.dispatch('loadVoting', {
        className: 'employee',
        classPk: item.employeeId
      }).then(result => {
        vm.votingItems = result
        console.log(vm.votingItems)
      }).catch(xhr => {
      })
    },
    showVotingResult (item) {
      let vm = this
      vm.employeeSelected = item
      vm.$store.dispatch('loadVoting', {
        className: 'employee',
        classPk: item.employeeId
      }).then(result => {
        vm.votingItems = result
        vm.dialog_voting_result = true
        console.log(vm.votingItems)
      }).catch(xhr => {
      })
    },
    closeVoting () {
      let vm = this
      vm.dialog_voting = false
      vm.dialogShowApplicantIdNo = false
    },
    closeVotingResult () {
      let vm = this
      vm.dialog_voting_result = false
    },
    submitResultVoting: function () {
      var vm = this
      var isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
      if (isSigned) {
        vm.doVottingResultSubmit()
      } else {
        vm.dialogShowApplicantIdNo = true
      }
    },
    doVottingSubmit () {
      var vm = this
      if (!vm.$refs.formVoting.validate()) {
        return
      } else {
        if (vm.$refs.captcha) {
          if (!vm.$refs.captcha.checkValidCaptcha()) {
            toastr.error('Mã captcha không đúng. Vui lòng kiểm tra lại')
            return
          }
        } else {
          vm.showCaptcha = true
          return
        }
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
        vm.votingItems[key]['className'] = 'employee'
        vm.votingItems[key]['classPk'] = vm.employeeSelected['employeeId']
        arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
      }
      Promise.all(arrAction).then(results => {
        toastr.success('Gửi đánh giá thành công thành công')
        vm.dialogShowApplicantIdNo = false
        vm.dialog_voting = false
        if (vm.$refs.captcha) {
          vm.$refs.captcha.makeRandomString()
        }
      }).catch(xhr => {
        toastr.error('Gửi đánh giá thất bại')
        vm.dialogShowApplicantIdNo = false
      })
    },
    getPercent (answers, index) {
      let totalVoted = 0
      let percent = 0
      for (var i = 0; i < answers.length; i++) {
        totalVoted += answers[i]
      }
      percent = ((answers[index] / totalVoted) * 100).toFixed(1)
      return percent
    },
    goBack () {
      var vm = this
      vm.dialog_voting = false
    }
  }
}
</script>
