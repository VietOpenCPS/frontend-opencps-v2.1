<template>
  <div class="mt-3 px-2 py-0 kios-item">
    <div class="wrap-scroll px-2 py-2" :class="votingItems.length > 2 ? 'wrap-scroll-votting' : ''">
      <div v-if="votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" :class="visible ? 'overlayActive': ''">
        <div class="text-bold">
          {{index + 1}}.&nbsp; {{ item.subject }}
        </div>
        <v-radio-group class="ml-3 pt-2" v-model="item.selected" row>
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
      <v-layout wrap class="mt-4" v-if="!isSigned && votingItems.length > 0">
        <v-flex xs12 sm6 class="pr-3">
          <v-layout wrap>
            <div style="width:110px" class="text-bold">Mã hồ sơ <span style="color:red">*</span></div>
            <div style="width:calc(100% - 110px)" class="pt-0 input-border input-group input-group--placeholder input-group--text-field primary--text">
              <!-- <div class="input-group__input">
                <input id="dossierIdNoKey" class="kios-input" data-layout="normal" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập mã hồ sơ" type="text">
                <i v-if="visible" @click="clear('dossierIdNoKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
              </div>
              <div class="mt-2" v-if="!validPass1">
                <div class="input-group__messages" style="color:red">Mã hồ sơ là bắt buộc</div>
              </div> -->
              <div class="input-custom">
                <input id="dossierIdNoKey" type="text" @focus="show" required="required" />
                <span class="bar"></span>
                <label for="dossierIdNoKey">Mã hồ sơ</label>
              </div>
            </div>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm6 class="pl-3">
          <v-layout wrap>
            <div style="width:110px" class="text-bold">Số CMND <span style="color:red">*</span></div>
            <div style="width:calc(100% - 110px)" class="pt-0 input-border input-group input-group--placeholder input-group--text-field primary--text">
              <!-- <div class="input-group__input">
                <input id="applicantIdNo" class="kios-input" data-layout="normal" @focus="show" aria-label="Số CMND" placeholder="Nhấn để nhập số CMND" type="text">
                <i v-if="visible" @click="clear('applicantIdNo')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
              </div>
              <div class="mt-2" v-if="!validPass2">
                <div class="input-group__messages" style="color:red">Số CMND là bắt buộc</div>
              </div> -->
              <div class="input-custom">
                <input id="applicantIdNo" type="text" @focus="show" required="required" />
                <span class="bar"></span>
                <label for="applicantIdNo">Số CMND</label>
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
    <v-btn v-if="votingItems.length > 0" class="back-btn" @click="goBack" fab color="primary">
      <v-icon dark>arrow_back</v-icon>
    </v-btn>
    <div class="virtual-keyboard" v-if="visible">
      <vue-touch-keyboard v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" />
    </div>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import toastr from 'toastr'
import VueTouchKeyBoard from './keyboard.vue'
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
    }
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      vm.isSigned = window.themeDisplay.isSignedIn()
      // vm.isSigned = true
      vm.validPass2 = true
      let filter = {
        className: 'govagency',
        classPK: vm.administration
      }
      vm.$store.dispatch('loadVoting', filter).then(function (result) {
        vm.votingItems = result
        console.log('votingItems', vm.votingItems)
        vm.loading = false
      }).catch(function (reject) {
        vm.loading = false
      })
    })
  },
  watch: {},
  methods: {
    submitVoting () {
      var vm = this
      if (!vm.isSigned) {
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
            applicantIdNo: $('#applicantIdNo').val(),
            dossierNo: $('#dossierIdNoKey').val()
          }
          vm.$store.dispatch('checkPermisionVoting', filter).then(result => {
            console.log('result', result)
            if (result.hasPermission === true || result.hasPermission === 'true') {
              vm.doResultVoting()
            } else {
              toastr.error('Số CMTND hoặc Số hồ sơ không chính xác')
            }
          }).catch(xhr => {
            toastr.error('Lỗi hệ thống')
          })
        }
      } else {
        vm.doResultVoting()
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
          vm.$router.push({
            path: '/danh-gia-cldv'
          })
        }).catch(xhr => {
          vm.loadingAction = false
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
      this.validPass = true
      this.input = e.target
      if (!this.visible) {
        this.visible = true
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
