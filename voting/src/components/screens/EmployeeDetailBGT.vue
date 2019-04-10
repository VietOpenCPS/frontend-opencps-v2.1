<template>
  <div v-if="loading" class="text-xs-center pt-4">
    <v-progress-circular
      size="100"
      width="5"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else class="pt-2" style="height: 100%; background-color: #ffff;">
    <v-form v-model="validFormVoting" ref="formVoting" lazy-validation>
      <v-layout row wrap>
        <v-flex xs12 md2>
        </v-flex>
        <v-flex xs12 md8>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-layout wrap class="px-2">
                <v-flex xs4 sm2 style="text-align: center!important;background: #ddd">
                  <div v-if="employeeSelected['imgSrc']" class="mt-1" :style="'background-image: url(' + employeeSelected['imgSrc'] + ');'"
                  style="max-width: 100px;height: 150px;margin: 0 auto;background-position: center;background-size: cover;">
                  </div>
                  <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" 
                  style="max-width: 100px;height: 150px;object-fit: contain;opacity:0.6"/>
                </v-flex>
                <v-flex class="pl-2" xs8 style="word-wrap: break-word;">
                  <div class="text-bold primary--text" style="font-size:1.5em">{{employeeSelected.fullName}}</div>
                  <div class="primary--text mb-2">{{employeeSelected.jobPosTitle}} - {{employeeSelected.workingUnitName}}</div>
                  <div >Email: {{employeeSelected.email}}</div>
                  <star-rating class="mt-2" read-only :rating="3.5" :increment="0.5" :max-rating="5" :show-rating="false" :star-size="30"></star-rating>
                  <div class="text-bold primary--text">50 lượt đánh giá</div>
                </v-flex>
              </v-layout>
              <div class="px-2 mt-3" v-for="(item, index) in votingItems" :key="index">
                <div class="text-bold primary--text">{{index + 1}}. {{ item.subject }}</div>
                <div class="ml-3">
                  <v-radio-group v-model="item.selected" height="10" row>
                    <v-radio :label="itemChoise" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    </v-radio>
                  </v-radio-group>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 md2>
        </v-flex>
        <v-flex xs12 sm12 class="text-xs-center my-3">
          <v-btn v-if="Array.isArray(votingItems) && votingItems.length > 0" @click="submitResultVoting" color="primary" :loading="votingDialog_hidden_loading" :disabled="votingDialog_hidden_loading">
            Gửi đánh giá
          </v-btn>
          <v-btn @click="goBack" color="primary">
            <v-icon size="16">reply</v-icon>&nbsp;
            Quay lại 
          </v-btn>
        </v-flex>
      </v-layout>
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
    </v-form>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
import StarRating from 'vue-star-rating'
export default {
  props: ['itemCode', 'id'],
  components: {
    'captcha': Captcha,
    StarRating
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
    },
    employeeSelected () {
      return this.$store.getters.employeeSelected
    }
  },
  created () {
    var vm = this
    let currentQuery = vm.$router.history.current.query
    vm.$nextTick(function () {
      vm.$store.dispatch('loadVoting', {
        className: 'employee',
        classPk: vm.id
      }).then(result => {
        vm.votingItems = result
        console.log(vm.votingItems)
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    showVoting () {
        let vm = this
        vm.$store.dispatch('loadVoting', {
            className: 'employee',
            classPk: vm.id
        }).then(result => {
            vm.votingItems = result
            console.log(vm.votingItems)
        }).catch(xhr => {
        })
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
    goBack () {
      var vm = this
      vm.$router.push({
        path: '/',
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    }
  },
  filters: {
  }
}
</script>
