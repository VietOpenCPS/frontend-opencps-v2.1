<template>
  <div class="py-0 kios-item" :class="!isMobile ? 'px-2 mt-3' : ''">
    <!-- <div v-if="!isMobile" class="d-inline-block" style="position:absolute;top:0;right:50px">
      <qrcode :value="urlQR" :options="{ width: 150 }"></qrcode><br>
      <v-chip class="my-0 ml-2" color="primary" text-color="white" style="width:135px;margin-top:-25px !important">
        <v-icon left class="mr-1 pl-1">center_focus_strong</v-icon> <span style="font-size:13px !important">Quét để đánh giá</span>
      </v-chip>
    </div> -->
    <div class="wrap-scroll py-2" :class="!isMobile && votingItems.length > 2 ? 'wrap-scroll-votting' : ''">
      <div v-if="votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" :class="visible ? 'overlayActive': ''">
        <div class="text-bold">
          {{index + 1}}.&nbsp; {{ item.subject }}
        </div>
        <v-radio-group class="ml-3 pt-2 mt-0" v-model="item.selected" row>
          <v-radio v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1" :value="index1 + 1"></v-radio>
        </v-radio-group>
        <!-- <v-layout wrap class="ml-3" style="margin-top:-10px">
          <v-flex style="margin-left:45px" v-for="(item2, index2) in item.answers" :key="index2">
            <span class="text-bold" style="color:green">{{item2}}/{{item.answersCount}}</span>
          </v-flex>
        </v-layout> -->
      </div>
    </div>
    <div :class="visible ? 'validDanhGiaCLDV': ''">
      <v-layout wrap :class="!isMobile ? 'mt-4' : 'mt-0'" v-if="!isSigned && votingItems.length > 0">
        <v-flex xs12 sm6 :class="!isMobile ? 'pr-3' : 'pr-0'">
          <v-layout wrap>
            <div style="width:110px" class="text-bold">Mã hồ sơ <span style="color:red">*</span></div>
            <div style="width:calc(100% - 110px)" class="pt-0 input-border input-group input-group--placeholder input-group--text-field primary--text">
              <div class="input-group__input">
                <input id="dossierIdNoKey" style="width:calc(100% - 40px)" class="kios-input" data-layout="normal" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập mã hồ sơ" type="text">
                <i v-if="visible" @click="clear('dossierIdNoKey')" style="padding: 5px;" aria-hidden="true" class="py-0 icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
              </div>
              <div class="mt-1" v-if="!validPass1">
                <div class="input-group__messages" style="color:red">Mã hồ sơ là bắt buộc!</div>
              </div>
            </div>
          </v-layout>
        </v-flex>
        <!-- <v-flex xs12 sm6 :class="!isMobile ? 'pl-3' : 'pl-0 mt-2'">
          <v-layout wrap>
            <div style="width:110px" class="text-bold">Số CMND <span style="color:red">*</span></div>
            <div style="width: calc(100% - 110px)" class="pt-0 input-border input-group input-group--placeholder input-group--text-field primary--text">
              <div class="input-group__input">
                <input id="applicantIdNo" style="width:calc(100% - 40px)" class="kios-input" data-layout="normal" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập số CMND" type="text">
                <i v-if="visible" style="padding: 5px;" @click="clear('applicantIdNo')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
              </div>
              <div class="mt-1" v-if="!validPass2">
                <div class="input-group__messages" style="color:red">Số CMND là bắt buộc!</div>
              </div>
            </div>
          </v-layout>
        </v-flex> -->

        <v-flex xs12 sm6 :class="!isMobile ? 'pl-3' : 'pl-0 mt-2'">
          <v-layout wrap>
            <div style="width:110px" class="text-bold">Mã bí mật<span style="color:red">*</span></div>
            <div style="width: calc(100% - 110px)" class="pt-0 input-border input-group input-group--placeholder input-group--text-field primary--text">
              <div class="input-group__input">
                <input id="applicantIdNo" style="width:calc(100% - 40px)" class="kios-input" data-layout="normal" @focus="show" aria-label="Mã bí mật" placeholder="Nhấn để nhập mã bí mật" type="text">
                <i v-if="visible" style="padding: 5px;" @click="clear('applicantIdNo')" aria-hidden="true" class="py-0 icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
              </div>
              <div class="mt-1" v-if="!validPass2">
                <div class="input-group__messages" style="color:red">Mã bí mật là bắt buộc!</div>
              </div>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
      <div class="text-xs-center mt-4">
        <v-btn color="primary"
          :loading="loadingAction"
          :disabled="loadingAction"
          @click="submitVoting"
          class="kios-btn"
        >Gửi kết quả</v-btn>
      </div>
    </div>
    <v-btn v-if="!isMobile && votingItems.length > 0" class="back-btn" @click="goBack" fab color="primary">
      <v-icon dark>arrow_back</v-icon>
    </v-btn>
    <!-- <div class="virtual-keyboard" v-if="visible && !isMobile">
      <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" />
    </div> -->
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import toastr from 'toastr'
import VueTouchKeyBoard from './keyboard.vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
export default {
  props: ['administration'],
  components: {
    'vue-touch-keyboard': VueTouchKeyBoard
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    votingItems: [],
    isSigned: false,
    validPass1: true,
    validPass2: true,
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: true,
      preventClickEvent: false
    },
    detailDossierMC: ''
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      vm.isSigned = window.themeDisplay.isSignedIn()
      // vm.isSigned = true
      vm.validPass2 = true
      let filter = {
      }
      vm.$store.dispatch('loadVotingNew', filter).then(function (result) {
        vm.votingItems = result
        console.log('votingItems', vm.votingItems)
        vm.loading = false
      }).catch(function (reject) {
        vm.loading = false
      })
    })
  },
  mounted () {
    let vm = this
    vm.urlQR = window.location.href
  },
  watch: {},
  methods: {
    submitVoting () {
      var vm = this

      if ($('#applicantIdNo').val() === '') {
        vm.validPass2 = false
      } else {
        vm.validPass2 = true
      }
      if ($('#dossierIdNoKey').val() === '') {
        vm.validPass1 = false
      } else {
        vm.validPass1 = true
      }
      if (vm.validPass1 && vm.validPass2) {
        let filter = {
          password: $('#applicantIdNo').val(),
          dossierId: $('#dossierIdNoKey').val()
        }
        vm.$store.dispatch('getDossierDetailPass', filter).then(function (result) {
          if (result.status && result.status.toString() === '203') {
            toastr.error('Mã hồ sơ hoặc mã tra cứu không chính xác. Vui lòng thử lại.')
          } else if (result.status && result.status.toString() === '200') {
            vm.doResultVotingMC()
          }
        }).catch(function (reject) {
          vm.loading = false
          toastr.error('Lỗi hệ thống')
        })

      }

    },
    doResultVoting () {
      var vm = this
      let arrAction = []
      if (vm.votingItems.length > 0) {
        vm.loadingAction = true
        for (var index in vm.votingItems) {
          vm.votingItems[index]['className'] = 'govagency'
          vm.votingItems[index]['classPk'] = vm.administration
          arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[index]))
        }
        Promise.all(arrAction).then(results => {
          vm.loadingAction = false
          toastr.success('Đánh giá của bạn được gửi thành công')

          $('#applicantIdNo').val('')
          $('#dossierIdNoKey').val('')
          let filter = {
          }
          vm.$store.dispatch('loadVotingNew', filter).then(function (result) {
            vm.votingItems = result
          }).catch(function (reject) {
          })
        }).catch(xhr => {
          vm.loadingAction = false
        })
      }
    },
    doResultVotingMC () {
      let vm = this
      let arrAction = []
      if (vm.votingItems.length > 0) {
        vm.loadingAction = true
        for (var index in vm.votingItems) {
          vm.votingItems[index]['className'] = 'dossier'
          vm.votingItems[index]['classPk'] = vm.detailDossierMC.dossierId
          vm.votingItems[index]['serverCode'] = 'SERVER_' + vm.detailDossierMC['govAgencyCode']
          arrAction.push(vm.$store.dispatch('submitVotingMC', vm.votingItems[index]))
        }
        Promise.all(arrAction).then(results => {
          vm.loadingAction = false
          vm.loadVoting()
          toastr.clear()
          toastr.success('Đánh giá của bạn được gửi thành công')
        }).catch(xhr => {
          vm.loadingAction = false
          toastr.clear()
          toastr.error('Gửi đánh giá không thành công')
        })
      }
    },
    goBack () {
      window.history.back()
    },
    clear (id) {
      $(`#${id}`).val('')
    },
    accept (text) {
      this.hide()
    },
    show (e) {
      if (!this.isMobile) {
        this.validPass = true
        this.input = e.target
        if (!this.visible) {
          this.visible = true
        }
      }
    },
    showKeyboard (e) {
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
      }
    },
    hide () {
      this.visible = false
    },
    next () {
      let inputs = document.querySelectorAll('input')
      let found = false
      let arr1 = []
      arr1.forEach.call(inputs, (item, i) => {
        if (!found && item === this.input && i < inputs.length - 1) {
          found = true
          this.$nextTick(() => {
            inputs[i + 1].focus()
          })
        }
      })
      if (!found) {
        this.input.blur()
        this.hide()
      }
    }
  }
}
</script>
