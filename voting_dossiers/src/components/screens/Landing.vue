<template>
  <div :class="!isMobile ? 'pt-3' : 'pt-0'" style="max-width:1300px;height: 100%; background-color: #ffff;margin: 0 auto" >
    <v-layout row wrap>
      <v-flex xs12 v-if="votingItems.length > 0">
        <v-layout row wrap class="px-3">
          <v-flex xs12 sm12 class="mb-4 px-2" v-if="!isMobile">
            <div id="title" class="text-bold text-xs-center" style="color:#034687">
              ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG
            </div>
          </v-flex>
          <v-flex xs12 sm12 class="mb-2" v-else>
            <div class="row-header" style="background-color: #0054a6">
              <div class="ml-2 py-2 text-bold white--text"> <span>ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG</span> </div>
              <div class="layout row wrap header_tools row-blue">
                <div class="flex text-right" style="margin-left: auto;">
                  <v-btn icon class="my-0 white--text" @click="dialogMobile = true">
                    <v-icon size="18">star</v-icon>
                  </v-btn>
                </div>
              </div> 
            </div>
          </v-flex>
          <v-flex xs12 sm12>
            <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;" :key="index">
              <v-layout wrap class="text-bold" v-if="!isMobile">
                <div class="flex px-3 py-1" style="height:26px;max-width:100px;background-color: #034687;transform: skew(-25deg)">
                  <span class="d-block white--text" style="transform: skew(25deg)">Tiêu chí {{index + 1}} : </span>
                </div>
                <div class="flex pl-3 pr-2" style="max-width:calc(100% - 100px);color:#034687">
                  {{ item.subject }}
                </div>
              </v-layout>
              <div class="text-bold px-2" v-if="isMobile">
                <div class="" style="text-align: justify;color:#034687">
                  Tiêu chí {{index + 1}}: {{ item.subject }}
                </div>
              </div>
              <div :class="!isMobile ? 'ml-4' : 'ml-2'">
                <v-radio-group v-model="item.selected" column class="mt-1">
                  <v-radio :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    <div style="text-align: justify;" :style="item.selected === indexChoise + 1 ? 'color:#034687' : 'color:black'" slot="label">{{itemChoise}}</div>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
            <v-flex xs12 sm12 class="mx-2 my-3" v-if="showCaptcha">
              <div style="max-width: 400px;background: #dedede;margin: 0 auto;" class="pb-2">
                <v-flex xs12 class="py-2" style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <div id="captcha" class="d-inline-block text-xs-center" style="padding-top: 15px;background: #fff;border-radius: 5px;"></div>
                  <v-btn class="right ml-3 mx-0 my-0" title="refresh" flat icon v-on:click.native="createCaptcha">
                    <v-icon color="primary" size="32">refresh</v-icon>
                  </v-btn>
                </v-flex>
                <v-text-field
                  class="mx-3"
                  single-lines
                  hide-details
                  solo
                  flat
                  height="36"
                  min-height="36"
                  clearable
                  v-model="captchaValue"
                  placeholder="Nhập mã captcha"
                ></v-text-field>
              </div>
              
            </v-flex>
            <v-flex xs12 sm12 :class="!isMobile ? 'text-xs-left mt-2' : 'text-xs-left mt-2 px-2'">
              <v-btn class="white--text" @click="showFormVerify" color="#004C98" :loading="btnLoading" :disabled="btnLoading">
                <v-icon>save</v-icon>&nbsp;
                Gửi đánh giá
              </v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 v-else>
        <div class="px-3">
          <v-alert outline color="warning" icon="priority_high" :value="true">
            Chưa có câu hỏi khảo sát
          </v-alert>
        </div>
      </v-flex>
    </v-layout>
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
              <p>Mã bí mật <span style="color: red">(*)</span></p>
              <v-text-field
                box
                placeholder="Nhập mã bí mật"
                v-model="applicantIdNo"
                :rules="[v => !!v || 'Mã bí mật là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 sm12 class="">
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
              
            </v-flex> -->
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
    ProgressBar
  },
  data: () => ({
    votingItems: [],
    votingItemsResult: [],
    btnLoading: false,
    showCaptcha: false,
    barColor: ['#5cb85c', '#f0ad4e', '#d9534f', '#2e4fc8', '#2ec8bad9', '#142f14'],
    dialog_voting_result: false,
    resultTotal: [],
    totalAnswer: 0,
    dialogMobile: false,
    captchaCode: '',
    captchaValue: '',
    applicantIdNo: '',
    dossierNo: '',
    dialogVerify: false,
    isDvc: false,
    serverConfigVoting: "SERVER_SCT",
    detailDossierMC: ''
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    try {
      vm.isDvc = isDvcConfig
    } catch (error) {
    }
    try {
      vm.serverConfigVoting = serverConfigVoting
    } catch (error) {
    }
    vm.$nextTick(function () {
      let filter = {
        className: 'dossier',
        classPk: 0,
        serverCode: vm.serverConfigVoting,
        isDvc: vm.isDvc
      }
      vm.$store.dispatch('loadVoting', filter).then(function (result) {
        vm.votingItems = result
      }).catch(function (reject) {
      })
    })
  },
  watch: {
  },
  methods: {
    showFormVerify () {
      let vm = this
      let valid = true
      for (var key in vm.votingItems) {
        if (String(vm.votingItems[key]['selected']) === '0') {
          valid = false
        }
      }
      if (valid) {
        vm.dialogVerify = true
        vm.$refs.formVerify.resetValidation()
        vm.createCaptcha()
      } else {
        toastr.error('Vui lòng chọn đánh giá tất cả các tiêu chí')
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
        if(result.data && result.data.length){
          let dossier = result.data[0]
          if (vm.isDvc) {
            let filter2 = {
              password: vm.applicantIdNo,
              dossierId: dossier.dossierId
            }
            vm.$store.dispatch('getDossierDetailPass', filter2).then(function (result) {
              if (result.status && result.status.toString() === '203') {
                toastr.error('Mã bí mật không chính xác. Vui lòng kiểm tra lại.')
                return
              } else {
                let filter3 = {
                  dossierNo: dossier['dossierNo'],
                  serverCode: 'SERVER_' + dossier['govAgencyCode']
                }
                vm.$store.dispatch('loadingDataHoSoFromMcToDvc', filter3).then(resultActions => {
                  vm.detailDossierMC = resultActions
                  vm.submitVoting()
                })
              }
            }).catch(function (reject) {
              toastr.error('Mã bí mật không chính xác. Vui lòng kiểm tra lại.')
              return
            })
          } else {
            if (filter.dossierNo !== dossier['dossierNo']) {
              toastr.error('Mã hồ sơ không chính xác. Vui lòng kiểm tra lại')
              return
            }
            vm.detailDossierMC = dossier
            vm.submitVoting()
          }
          
        } else {
          toastr.error('Mã hồ sơ không chính xác. Vui lòng kiểm tra lại')
        }
      }).catch(reject => {
        toastr.error('Mã hồ sơ không chính xác. Vui lòng kiểm tra lại')
      })
    },
    submitVoting () {
      let filter = {
        className: 'dossier',
        classPk: vm.detailDossierMC.dossierId,
        serverCode: 'SERVER_' + vm.detailDossierMC['govAgencyCode'],
        isDvc: vm.isDvc
      }
      vm.$store.dispatch('loadVoting', filter).then(function (result) {
        if (result && result.length > 0) {
          let valid = result.filter(function (item) {
            return item.answersCount
          })
          if (valid && valid.length > 0) {
            toastr.success('Thông tin hồ sơ trên bạn đã thực hiện đánh giá')
            return
          }
          // 
          for (let index in result) {
            result[index].selected = vm.votingItems[index]['selected']
          }
          vm.votingItemsResult = result
          vm.doVottingResultSubmit()
        }
      }).catch(function (reject) {
      })
    },
    doVottingResultSubmit: function () {
      var vm = this
      vm.btnLoading = true
      let arrAction = []
      let valid = false
      for (var key in vm.votingItemsResult) {
        vm.votingItemsResult[key]['className'] = 'dossier'
        vm.votingItemsResult[key]['classPk'] = 0
        if (String(vm.votingItemsResult[key]['selected']) !== '0') {
          valid = true
          arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItemsResult[key]))
        }
      }
      if (valid) {
        Promise.all(arrAction).then(results => {
          toastr.success('Thực hiện đánh giá thành công.')
          vm.dialogVerify = false
          vm.btnLoading = false
          
        }).catch(xhr => {
          toastr.error('Thực hiện đánh giá không thành công.')
          vm.btnLoading = false
        })
      } else {
        vm.btnLoading = false
        toastr.error('Bạn chưa chọn đánh giá nào')
      }
    },
    showVotingResult () {
      let vm = this
      vm.$store.dispatch('loadVoting', {
        className: 'dossier',
        classPk: 0
      }).then(result => {
        vm.votingItems = result
        vm.dialog_voting_result = true
      }).catch(xhr => {
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
      canv.width = 150
      canv.height = 50
      let ctx = canv.getContext("2d")
      ctx.font = "32px Georgia"
      ctx.strokeText(captcha.join(""), 0, 30)
      vm.captchaCode = captcha.join("")
      document.getElementById("captcha").appendChild(canv)
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
