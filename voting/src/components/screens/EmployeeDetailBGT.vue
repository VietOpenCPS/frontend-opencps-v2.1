<template>
  <div v-if="loading" class="text-xs-center pt-4">
    <v-progress-circular
      size="100"
      width="5"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else class="px-2 pt-2" style="height: 100%; background-color: #ffff;">
    <v-form v-model="validFormVoting" ref="formVoting" lazy-validation>
      <v-layout row wrap>
        <!-- <v-flex xs12 sm1 lg2>
        </v-flex>
        <v-flex xs12 sm10 lg8>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-layout wrap class="px-2">
                <v-flex xs4 sm3 class="mt-1" style="text-align: center!important;max-height: 200px">
                  <div v-if="employeeSelected['imgSrc']" class="mt-1" :style="'background-image: url(' + employeeSelected['imgSrc'] + ');'"
                  style="width: 100%;max-width: 150px;height: 200px;margin: 0 auto;background-position: center;background-size: cover;">
                  </div>
                  <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" 
                  style="width: 100%;max-width: 150px;height: 200px;object-fit: contain;opacity:0.6;background: #ddd"/>
                </v-flex>
                <v-flex class="pl-2" xs8 sm9 style="word-wrap: break-word;position:relative">
                  <div class="text-bold primary--text" style="font-size:1.5em">{{employeeSelected.fullName}}</div>
                  <div class="primary--text" v-if="employeeSelected.jobPosTitle || employeeSelected.workingUnitName">
                    {{employeeSelected.jobPosTitle}} - {{employeeSelected.workingUnitName}}
                  </div>
                  <div class="mb-2">Email: {{employeeSelected.email}}</div>

                  <div :style="isMobile ? '' : 'position:absolute;top:0;right:0'">
                    <star-rating class="mt-2" read-only :rating="employeeSelected['score']" :increment="0.1" :max-rating="5" :show-rating="false" :star-size="30" :title="employeeSelected['score'] + '/5*'"></star-rating>
                    <div class="text-bold primary--text pl-2">{{employeeSelected['totalVoting']}} lượt đánh giá</div>
                  </div>

                  <div v-if="!isMobile">
                    <div v-for="(item, index) in votingItems" :key="index" >
                      <div class="text-bold primary--text">* {{ item.subject }}</div>
                      <div class="ml-3">
                        <v-radio-group class="mt-2" v-model="item.selected" height="10" row>
                          <v-radio height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                            <div :class="item.selected === indexChoise + 1 ? 'primary--text' : 'black--text'" slot="label">{{itemChoise}}</div>
                          </v-radio>
                        </v-radio-group>
                      </div>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
              <div v-if="isMobile">
                <div class="px-2 mt-3" v-for="(item, index) in votingItems" :key="index" >
                  <div class="text-bold primary--text">{{index + 1}}. {{ item.subject }}</div>
                  <div class="ml-3">
                    <v-radio-group v-model="item.selected" height="10" row>
                      <v-radio :label="itemChoise" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm1 lg2>
        </v-flex> -->

        <v-container align-center row wrap class="px-5" style="font-size:1.25em">
          <v-flex xs12 style="border: 1px solid #0072bc;border-top-left-radius: 7px;border-top-right-radius: 7px;">
            <v-layout row wrap>
              <v-flex xs12 sm12 class="py-3">
                <v-layout wrap class="px-2">
                  <v-flex xs4 sm3 class="mt-1" style="text-align: center!important;max-height: 200px">
                    <div v-if="employeeSelected['imgSrc']" class="mt-1" :style="'background-image: url(' + employeeSelected['imgSrc'] + ');'"
                    style="width: 100%;max-width: 150px;height: 200px;margin: 0 auto;background-position: center;background-size: cover;">
                    </div>
                    <img v-else src="/o/opencps-store/js/cli/voting/app/img/contacts-icon.png" 
                    style="width: 100%;max-width: 150px;height: 200px;object-fit: contain;opacity:0.6;background: #ddd"/>
                  </v-flex>
                  <v-flex class="pl-2" xs8 sm9 style="word-wrap: break-word;position:relative">
                    <div class="primary--text">
                      {{employeeSelected.titleJobpos ? employeeSelected.titleJobpos : 'Cán bộ tiếp nhận'}}
                    </div>
                    <div class="text-bold primary--text text-bold">{{employeeSelected.fullName}}</div>
                    <div class="mb-2" v-if="employeeSelected.agencyName">{{employeeSelected.agencyName}}</div>
                    <div class="mb-2">Email: {{employeeSelected.email}}</div>
                    <!--  -->
                    <div :style="isMobile ? '' : 'position:absolute;top:0;right:0'">
                      <star-rating read-only :rating="employeeSelected['score']" :increment="0.1" :max-rating="5" :show-rating="false" :star-size="30" :title="employeeSelected['score'] + '/5*'"></star-rating>
                      <div class="text-bold primary--text pl-2">{{employeeSelected['totalVoting']}} lượt đánh giá</div>
                    </div>
                    <!--  -->
                </v-flex>
              </v-layout>
              <div v-if="isMobile">
                <div class="px-2 mt-3" v-for="(item, index) in votingItems" :key="index" >
                  <div class="text-bold primary--text">{{index + 1}}. {{ item.subject }}</div>
                  <div class="ml-3">
                    <v-radio-group v-model="item.selected" height="10" row>
                      <v-radio :label="itemChoise" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>
              </div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 class="py-3 px-2 pl-5" v-if="!isMobile" style="border: 1px solid #0072bc; border-top: 0;border-bottom-left-radius: 7px; border-bottom-right-radius: 7px;">
            <div v-for="(item, index) in votingItems" :key="index" class="mb-2">
              <div class="text-bold primary--text">* {{ item.subject }}</div>
              <div class="ml-3">
                <v-radio-group class="py-0" v-model="item.selected" height="10" row>
                  <v-radio class="mr-4" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    <div :class="item.selected === indexChoise + 1 ? 'primary--text' : 'black--text'" slot="label"
                    style="font-size: 16px;font-weight: bold;"
                    >{{itemChoise}}</div>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
          </v-flex>
        </v-container>

        <v-flex xs12 sm12 class="text-xs-center mb-3">
          <v-btn v-if="Array.isArray(votingItems) && votingItems.length > 0" @click="showFormVerify" color="primary" :loading="votingDialog_hidden_loading" :disabled="votingDialog_hidden_loading">
            Gửi đánh giá
          </v-btn>
          <v-btn @click="goBack" color="primary">
            <v-icon size="16">reply</v-icon>&nbsp;
            Quay lại 
          </v-btn>
        </v-flex>
      </v-layout>
      <!-- <v-dialog v-model="dialogShowApplicantIdNo" persistent max-width="400">
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
      </v-dialog> -->
    </v-form>
    <v-dialog v-model="dialogVerify" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          <div style="text-align: center;width: 100%;">Quý khách vui lòng nhập thông tin để gửi đánh giá</div>
        </v-card-title>
        <v-card-text class="py-2 px-2">
          <v-form ref="formVerify" v-model="validVerify" lazy-validation class="px-2 pt-2">
            <v-flex xs12>
              <p>Mã hồ sơ <span style="color: red">(*)</span></p>
              <v-text-field
                box
                placeholder="Nhập mã hồ sơ"
                v-model="dossierNo"
                :rules="[v => !!v || 'Mã hồ sơ là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <p>Số CMND/ mã số thuế <span style="color: red">(*)</span></p>
              <v-text-field
                box
                placeholder="Nhập số CMND/ mã số thuế"
                v-model="applicantIdNo"
                :rules="[v => !!v || 'Số CMND/ mã số thuế là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 class="">
              <p>Mã bảo mật <span style="color: red">(*)</span></p>
              <v-layout wrap>
                <v-flex style="width: calc(100% - 200px)">
                  <v-text-field
                    box
                    class="mr-2"
                    clearable
                    v-model="captchaValue"
                    placeholder="Nhập mã bảo mật"
                    :rules="[v => !!v || 'Mã bảo mật là bắt buộc']"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex style="width: 200px">
                  <div id="captcha" class="d-inline-block text-xs-center" style="background: #d4d4d4;border-radius: 5px;"></div>
                  <v-btn outline class="right mx-0 my-0 mt-2" flat v-on:click.native="createCaptcha">
                    <v-icon color="primary" size="32">refresh</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              
            </v-flex>
          </v-form>
        </v-card-text>
        <v-card-actions class="mx-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitForm" :disabled="btnLoading">
            <v-icon>how_to_reg</v-icon>&nbsp;
              Xác nhận
          </v-btn>
          <v-btn color="primary" @click="dialogVerify = false" :disabled="btnLoading">
            <v-icon>clear</v-icon>&nbsp;
              Hủy
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    workingUnit: {},
    employee: {},
    votingItems: [],
    itemName: '',
    btnLoading: false,
    votingDialog_hidden_loading: false,
    validFormVoting: false,
    showCaptcha: false,
    dialogShowApplicantIdNo: false,
    isMobile: false,
    dialogVerify: false,
    validVerify: false,
    applicantIdNo: '',
    dossierNo: '',
    captchaValue: '',
    captchaCode: '',
    arrAction: [],
    isDVC: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    employeeSelected () {
      return this.$store.getters.employeeSelected
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  created () {
    var vm = this
    try {
      if (isDVC) {
        vm.isDVC = isDVC
      }
    } catch (error) {
    }
    let currentQuery = vm.$router.history.current.query
    vm.$nextTick(function () {
      vm.getVotingEmployee()
    })
  },
  watch: {
  },
  methods: {
    showFormVerify () {
      let vm = this
      let valid = false
      for (var key in vm.votingItems) {
        if (String(vm.votingItems[key]['selected']) !== '0') {
          valid = true
        }
      }
      if (valid) {
        vm.dialogVerify = true
        vm.$refs.formVerify.resetValidation()
        vm.createCaptcha()
      } else {
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
    },
    submitForm () {
      let vm = this
      if (vm.$refs.formVerify.validate()) {
        let valid = vm.validateCaptcha()
        if (!valid) {
          return
        } else {
          vm.checkDossierInfo()
        }
      } else {
        setTimeout (function () {
          vm.createCaptcha()
        }, 100)
        return
      }
    },
    checkDossierInfo () {
      let vm = this
      let filter = {
        dossierNo: vm.dossierNo
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        if (String(result.dossierNo) === String(vm.dossierNo)) {
          if (String(result.applicantIdNo) === String(vm.applicantIdNo)) {
            vm.doVottingResultSubmit()
          } else {
            toastr.error('Hồ sơ ' + vm.dossierNo + ' không phải hồ sơ quý khách đã đăng ký. Quý khách vui lòng kiểm tra lại.')
          }
        } else {
          toastr.error('Hồ sơ ' + vm.dossierNo + ' không tồn tại. Quý khách vui lòng kiểm tra lại.')
        }
      }).catch(function () {
        toastr.error('Hồ sơ ' + vm.dossierNo + ' không tồn tại. Quý khách vui lòng kiểm tra lại.')
      })
    },
    getVotingEmployee () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let maDonVi = currentQuery.hasOwnProperty('itemCode') ? currentQuery.itemCode : ''
      if (vm.isDVC) {
        vm.$store.dispatch('loadVoting', {
          className: 'employee',
          classPk: vm.id
        }).then(result => {
          vm.votingItems = result.data
          vm.getScoreVoting(vm.votingItems)
          vm.employeeSelected['totalVoting'] = Number(result.votingCount)
        }).catch(xhr => {
        })
      } else {
        vm.$store.dispatch('loadVotingMotcua', {
          className: 'employee',
          classPk: vm.id,
          itemCode: maDonVi
        }).then(result => {
          vm.votingItems = result.data
          vm.getScoreVoting(vm.votingItems)
          vm.employeeSelected['totalVoting'] = Number(result.votingCount)
        }).catch(xhr => {
        })
      }
      
    },
    getScoreVoting (votingItems) {
      let vm = this
      if (votingItems && votingItems.length > 0) {
        let totalVoting = 0
        let totalScore = 0
        let lengthQuestion = votingItems.length
        let lengthAnswer = votingItems[0]['answers'].length
        for (var i = 0; i < lengthQuestion; i++) {
          totalVoting += votingItems[i]['answersCount']
          for (var j = 0; j < lengthAnswer; j++) {
            totalScore += votingItems[i]['answers'][j] * (lengthAnswer - j)
          }
        }
        if (totalVoting > 0) {
          vm.employeeSelected['score'] = Number(((totalScore * 5) / (totalVoting * lengthAnswer)).toFixed(1))
          // vm.employeeSelected['totalVoting'] = Number(totalVoting)
        }
      }
    },
    submitResultVoting: function () {
      let vm = this
      let valid = false
      for (var key in vm.votingItems) {
        if (String(vm.votingItems[key]['selected']) !== '0') {
          valid = true
        }
      }
      if (valid) {
        let isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
        if (isSigned) {
          vm.doVottingResultSubmit()
        } else {
          vm.dialogShowApplicantIdNo = true
        }
      } else {
        toastr.error('Bạn chưa chọn đánh giá nào')
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
            toastr.error('Số CMTND hoặc Mã hồ sơ không chính xác')
          }
        }).catch(xhr => {
          toastr.error('Lỗi hệ thống')
        })
      }
    },
    doVottingResultSubmit () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      let maDonVi = currentQuery.hasOwnProperty('itemCode') ? currentQuery.itemCode : ''
      vm.arrAction = []
      for (let key in vm.votingItems) {
        vm.votingItems[key]['className'] = 'employee'
        vm.votingItems[key]['classPk'] = vm.employeeSelected['employeeId']
        if (String(vm.votingItems[key]['selected']) !== '0') {
          if (vm.isDVC) {
            vm.arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
          } else {
            vm.votingItems[key] = Object.assign(vm.votingItems[key], {itemCode: maDonVi})
            vm.arrAction.push(vm.$store.dispatch('submitVotingProxy', vm.votingItems[key]))
          }
        }
      }
      vm.btnLoading = true
      Promise.all(vm.arrAction).then(results => {
        vm.btnLoading = false
        toastr.success('Gửi đánh giá thành công')
        vm.goBack()
      }).catch(xhr => {
        vm.btnLoading = false
        toastr.error('Gửi đánh giá thất bại')
      })
    },
    createCaptcha () {
      let vm = this
      document.getElementById('captcha').innerHTML = "";
      let charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#&*"
      let lengthOtp = 6
      let captcha = []
      for (var i = 0; i < lengthOtp; i++) {
        var index = Math.floor(Math.random() * charsArray.length + 1)
        if (captcha.indexOf(charsArray[index]) == -1)
          captcha.push(charsArray[index])
        else i--
      }
      let canv = document.createElement("canvas")
      canv.id = "captcha"
      canv.width = 140
      canv.height = 42
      let ctx = canv.getContext("2d")
      ctx.font = "32px Georgia"
      ctx.strokeText(captcha.join(""), 0, 30)
      vm.captchaCode = captcha.join("")
      document.getElementById("captcha").appendChild(canv)
    },
    validateCaptcha () {
      let vm = this
      if (vm.captchaValue == vm.captchaCode) {
        return true
      } else {
        toastr.error('Mã captcha không đúng. Vui lòng thử lại.')
        vm.createCaptcha()
        return false
      }
    },
    onResize () {
      let vm = this
      vm.isMobile = window.innerWidth < 600
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {
  }
}
</script>
