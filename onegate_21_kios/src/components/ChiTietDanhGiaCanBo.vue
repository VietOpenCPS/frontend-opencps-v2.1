<template>
  <div v-if="loading" class="text-xs-center pt-4">
    <v-progress-circular
      size="100"
      width="5"
      color="purple"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else class="px-2 pt-2" style="height: 100%;">
    <v-btn class="back-home" fab dark color="primary" @click="goHome"> 
      <v-icon style="font-size: 24px !important;" class="white--text">home</v-icon>
    </v-btn>
    <!-- <v-btn class="back-btn" outline large color="primary" @click="goBack" style="width: 120px !important;">
      <v-icon style="font-size: 24px !important;">reply</v-icon>&nbsp;
      Quay lại 
    </v-btn> -->
    <v-form v-model="validFormVoting" ref="formVoting" lazy-validation>
      <v-container align-center row wrap style="font-size:1.5em">
        <v-flex xs12 style="border: 1px solid #0072bc">
          <v-layout row wrap>
            <v-flex xs12 sm12 class="py-3">
              <v-layout wrap class="px-2">
                <v-flex xs4 sm3 class="mt-1" style="text-align: center!important;max-height: 200px">
                  <div v-if="employeeSelected['imgSrc']" class="mt-1" :style="'background-image: url(' + employeeSelected['imgSrc'] + ');'"
                  style="width: 100%;max-width: 150px;height: 200px;margin: 0 auto;background-position: center;background-size: cover;">
                  </div>
                  <img v-else src="https://img.icons8.com/windows/150/000000/contacts.png" 
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
                  <!-- <div v-if="!isMobile">
                    <div v-for="(item, index) in votingItems" :key="index" >
                      <div class="text-bold primary--text">* {{ item.subject }}</div>
                      <div class="ml-3">
                        <v-radio-group class="py-0" v-model="item.selected" height="10" row>
                          <v-radio height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                            <div :class="item.selected === indexChoise + 1 ? 'primary--text' : 'black--text'" slot="label">{{itemChoise}}</div>
                          </v-radio>
                        </v-radio-group>
                      </div>
                    </div>
                  </div> -->
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
        <v-flex xs12 class="py-2 px-2 pl-5" v-if="!isMobile" style="border: 1px solid #0072bc; border-top: 0">
          <div v-for="(item, index) in votingItems" :key="index" >
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
        <v-flex xs12 row wrap v-if="!isSigned" class="py-3" :class="visible ? 'input_voting_fixed' : ''">
          <!-- <v-form v-model="validFormVoting" ref="formVoting" lazy-validation> -->
            <v-layout row wrap>
              <v-flex xs12 sm6 class="pr-2">
                <div>Nhập số CMND/ Hộ chiếu <span style="color:red">*</span></div>
                <div class="input-custom">
                  <input id="applicantIdNo" type="text" @focus="show" />
                  <span class="bar"></span>
                  <!-- <label for="applicantIdNo">Số CMND/ Hộ chiếu</label> -->
                </div>
              </v-flex>
              <v-flex xs12 sm6 class="pl-2">
                <div>Nhập mã hồ sơ <span style="color:red">*</span></div>
                <div class="input-custom">
                  <input id="dossierNo" type="text" @focus="show" />
                  <span class="bar"></span>
                  <!-- <label for="dossierNo">Mã hồ sơ</label> -->
                </div>
              </v-flex>
            </v-layout>
          <!-- </v-form> -->
        </v-flex>
        <v-flex xs12 class="text-xs-center my-3">
          <v-btn v-if="Array.isArray(votingItems) && votingItems.length > 0" @click="submitResultVoting" color="primary" style="width: 150px;height: 36px;"
          :loading="votingDialog_hidden_loading" :disabled="votingDialog_hidden_loading">
            <v-icon size="16">done_all</v-icon>&nbsp;
            Gửi đánh giá
          </v-btn>
          <v-btn @click="goBack" color="primary" style="width: 150px;height: 36px;">
            <v-icon size="16">reply</v-icon>&nbsp;
            Quay lại 
          </v-btn>
        </v-flex>
      </v-container>

      <!-- <v-dialog v-model="dialogShowApplicantIdNo" persistent max-width="400">
        <v-form v-model="validFormVoting" ref="formVoting" lazy-validation class="dialog-submit-voting">
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
                  <div class="input-custom">
                    <input id="applicantIdNo" type="text" @focus="show" required="required" />
                    <span class="bar"></span>
                    <label for="applicantIdNo">Số CMND/ Hộ chiếu</label>
                  </div>
                </v-flex>
                <v-flex xs12 sm12 class="mt-3">
                  <div class="input-custom">
                    <input id="dossierNo" type="text" @focus="show" required="required" />
                    <span class="bar"></span>
                    <label for="dossierNo">Mã hồ sơ</label>
                  </div>
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
    <!-- <v-btn v-if="!isMobile" class="back-btn" @click="changeScreen" fab color="primary">
      <v-icon v-if="!fullScreen" dark>fullscreen</v-icon>
      <v-icon v-if="fullScreen" dark>fullscreen_exit</v-icon>
    </v-btn> -->
    <div class="virtual-keyboard" v-if="visible && !isMobile">
      <v-btn small fab color="#383533" @click="visible = false" style="position:absolute;right:0;top:0">
        <v-icon color="#fff">clear</v-icon>
      </v-btn>
      <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" :options="options" />
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import $ from 'jquery'
import Captcha from './Captcha.vue'
import StarRating from 'vue-star-rating'
import VueTouchKeyBoard from './keyboard.vue'
export default {
  props: ['id'],
  components: {
    'vue-touch-keyboard': VueTouchKeyBoard,
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
    dialogShowApplicantIdNo: false,
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: true,
      preventClickEvent: false
    },
    isSigned: window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    employeeSelected () {
      return this.$store.getters.employeeSelected
    },
    fullScreen () {
      return this.$store.getters.getFullScreen
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    let currentQuery = vm.$router.history.current.query
    vm.$nextTick(function () {
      vm.getVotingEmployee()
    })
  },
  watch: {
  },
  methods: {
    getVotingEmployee () {
      let vm = this
      vm.$store.dispatch('loadVoting', {
        className: 'employee',
        classPk: vm.id
      }).then(result => {
        vm.votingItems = result
        vm.getScoreVoting(vm.votingItems)
      }).catch(xhr => {
      })
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
          vm.employeeSelected['totalVoting'] = Number(totalVoting)
        }
      }
    },
    submitResultVoting: function () {
      var vm = this
      var isSigned = window.themeDisplay ? window.themeDisplay.isSignedIn() : ''
      if (isSigned) {
        vm.doVottingResultSubmit()
      } else {
        vm.applicantIdNo = $('#applicantIdNo').val()
        vm.dossierNo = $('#dossierNo').val()
        console.log('xacthuc', vm.applicantIdNo, vm.dossierNo)
        if (!vm.dossierNo || !vm.applicantIdNo) {
          toastr.error('Vui lòng điền đầy đủ thông tin xác thực')
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
              vm.visible = false
              toastr.error('Số CMTND hoặc Số hồ sơ không chính xác')
            }
          }).catch(xhr => {
            toastr.error('Lỗi hệ thống')
          })
        }
      }
    },
    doVottingSubmit () {
      var vm = this
      vm.applicantIdNo = $('#applicantIdNo').val()
      vm.dossierNo = $('#dossierNo').val()
      if (!vm.dossierNo || !vm.applicantIdNo) {
        toastr.error('Vui lòng điền đầy đủ thông tin xác thực')
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
            vm.visible = false
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
        vm.visible = false
        toastr.success('Gửi đánh giá thành công')
        vm.getVotingEmployee()
        setTimeout(function () {
          window.history.back()
        }, 2000)
      }).catch(xhr => {
        toastr.error('Gửi đánh giá thất bại')
        vm.visible = false
      })
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
    },
    goBack () {
      window.history.back()
    },
    //
    show (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
      this.bindClick('search')
    },
    bindClick (type) {
      var vm = this
      setTimeout(function () {
        $('.keyboard .enter').unbind('click')
        if (type === 'search') {
          $('.keyboard .enter').bind('click', function () {
            vm.doVottingSubmit()
          })
        } else if (type === 'view') {
          $('.keyboard .enter').bind('click', function () {
            vm.submitViewDetail()
          })
        }
      }, 300)
    }
  },
  filters: {
  }
}
</script>
