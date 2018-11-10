<template>
  <div class="mt-3 px-2 py-0 kios-item">
    <div class="wrap-scroll px-2 py-2" :class="votingItems.length > 2 ? 'wrap-scroll-votting' : ''">
      <div v-if="votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" :class="visible ? 'overlayActive': ''">
        <div class="text-bold">
          {{index + 1}}.&nbsp; {{ item.subject }}
        </div>
        <v-radio-group class="ml-3" v-model="item.selected" column>
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
        <v-flex xs12 class="pr-3">
          <v-container fluid grid-list-sm class="px-0">
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field
                label="Nhập số hồ sơ"
                v-model="dossierIdNoKey"
                box
                clearable
                :rules="[v => !!v || 'Số hồ sơ là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                label="Nhập số CMND"
                v-model="applicantIdNo"
                box
                clearable
                :rules="[v => !!v || 'Số CMND là bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      <div class="text-xs-center mt-4">
        <v-btn color="primary"
          :loading="loadingAction"
          :disabled="loadingAction"
          @click="submitVoting"
          class="kios-btn"
        >Gửi kết quả đánh giá</v-btn>
      </div>
    </div>
    <!-- <v-btn v-if="votingItems.length > 0" class="back-btn" @click="goBack" fab color="primary">
      <v-icon dark>arrow_back</v-icon>
    </v-btn> -->
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import toastr from 'toastr'
export default {
  props: ['administration'],
  components: {
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    votingItems: [],
    isSigned: false,
    validPass1: true,
    validPass2: true,
    dossierIdNoKey: '',
    applicantIdNo: ''
  }),
  computed: {},
  created () {
    let vm = this
    vm.$nextTick(function () {
      var vm = this
      // test local
      vm.isSigned = window.themeDisplay.isSignedIn()
      // vm.isSigned = false
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
        if (vm.applicantIdNo === '') {
          vm.validPass2 = false
        } else {
          vm.validPass2 = true
        }
        if (vm.dossierIdNoKey === '') {
          vm.validPass1 = false
        } else {
          vm.validPass1 = true
        }
        if (vm.validPass1 && vm.validPass2) {
          let filter = {
            applicantIdNo: vm.applicantIdNo,
            dossierNo: vm.dossierIdNoKey
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
