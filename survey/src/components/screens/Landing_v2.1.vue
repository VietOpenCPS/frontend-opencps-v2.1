<template>
  <div style="height: 100%; background-color: #ffff; padding-top: 20px;">
    <v-layout row wrap>
      <v-flex xs12 sm12 class="text-xs-center" style="margin-bottom: 20px;">
        <h3 class="text-xs-center mt-2" style="color:#065694">ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG</h3>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
      <v-flex xs12 sm8 class="px-2">
        <v-layout row wrap>
          <v-flex xs12 sm12>
            <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;" :key="index">
              <!-- <div class="text-bold primary--text" style="text-align: justify;">{{index + 1}}. {{ item.subject }}</div> -->
              <v-layout wrap class="text-bold">
                <div class="flex px-3 py-1" style="height:26px;max-width:75px;background-color: #0167d3;transform: skew(-25deg)">
                  <span class="d-block white--text" style="transform: skew(25deg)">Câu {{index + 1}}</span>
                </div>
                <div v-html="item.subject" class="flex pl-3 pr-2 pt-0" style="max-width:calc(100% - 100px);color:#0167d3">
                </div>
              </v-layout>
              <div class="ml-4">
                <v-radio-group v-model="item.selected" row class="my-2">
                  <v-radio :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    <div style="text-align: justify;" :style="item.selected === indexChoise + 1 ? 'color:#0167d3' : 'color:black'" slot="label">{{itemChoise}}</div>
                  </v-radio>
                </v-radio-group>
              </div>
              <!-- <div class="mt-3 ml-4 mr-3" v-if="item.commentable">
                <v-text-field
                v-model="item['comment']"
                label="Ý kiến khác"
                multi-line
                rows="2"
                ></v-text-field>
              </div> -->
            </div>
            <!-- <v-flex xs12 sm12 class="mb-3 mt-3" v-if="showCaptcha">
              <captcha ref="captcha"></captcha>
            </v-flex> -->
            <v-flex xs12 sm12 class="text-xs-center mt-2">
              <v-btn @click="showFormVerify" color="primary" :loading="btnLoading" :disabled="btnLoading">
                <v-icon>save</v-icon>&nbsp;
                Gửi đánh giá
              </v-btn>
              <v-btn class="ml-3" @click="showVotingResult" color="primary" :loading="btnLoading" :disabled="btnLoading">
                <v-icon>bookmark</v-icon>&nbsp;
                Xem kết quả đánh giá
              </v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog_voting_result" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="pl-5">Kết quả đánh giá</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog_voting_result = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm1></v-flex>
            <v-flex xs12 sm10 class="">
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
                  Không có câu hỏi khảo sát
                </v-alert>
              </div>
              <v-flex xs12 sm12 class="mt-4 text-xs-right">
                <v-btn @click="dialog_voting_result = false" color="primary">
                  <v-icon size="16">reply</v-icon>&nbsp;
                  Quay lại 
                </v-btn>
              </v-flex>
            </v-flex>
            <v-flex xs12 sm1></v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
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
          <v-btn color="primary" @click="submitForm">
            <v-icon>how_to_reg</v-icon>&nbsp;
              Xác nhận
          </v-btn>
          <v-btn color="primary" @click="dialogVerify = false">
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
import Captcha from './Captcha.vue'
import toastr from 'toastr'
import ProgressBar from 'vue-simple-progress'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index'],
  components: {
    'captcha': Captcha,
    ProgressBar
  },
  data: () => ({
    votingItems: [],
    btnLoading: false,
    showCaptcha: false,
    barColor: ['#5cb85c', '#f0ad4e', '#d9534f', '#2e4fc8', '#2ec8bad9', '#142f14'],
    dialog_voting_result: false,
    dialogVerify: false,
    validVerify: false,
    applicantIdNo: '',
    dossierNo: '',
    captchaValue: '',
    captchaCode: '',
    arrAction: []
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    console.log('landing---------')
    vm.$nextTick(function () {
      vm.$store.dispatch('loadVoting', {
        className: 'survey',
        classPk: 0
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
    viewListEmployee (item) {
     this.$router.push({
        path: '/danh-sach-can-bo/' + item.itemCode,
        query: {
          itemName: item.itemName
        }
      })
    },
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
    doVottingResultSubmit () {
      let vm = this
      vm.btnLoading = true
      vm.arrAction = []
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = 'survey'
        vm.votingItems[key]['classPk'] = 0
        if (String(vm.votingItems[key]['selected']) !== '0') {
          vm.arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
        }
      }
      Promise.all(vm.arrAction).then(results => {
        toastr.success('Thực hiện đánh giá thành công.')
        vm.btnLoading = false
        vm.dialogVerify = false
        vm.$store.dispatch('loadVoting', {
          className: 'survey',
          classPk: 0
        }).then(result => {
          vm.votingItems = result
        }).catch(xhr => {
        })
      }).catch(xhr => {
        toastr.error('Đánh giá thực hiện thất bại.')
        vm.btnLoading = false
        vm.createCaptcha()
      })      
    },
    showVotingResult () {
      let vm = this
      vm.$store.dispatch('loadVoting', {
        className: 'survey',
        classPk: 0
      }).then(result => {
        vm.votingItems = result
        vm.dialog_voting_result = true
        console.log(vm.votingItems)
      }).catch(xhr => {
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
    }
  },
  filters: {
  }
}
</script>
