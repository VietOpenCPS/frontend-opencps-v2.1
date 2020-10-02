<template>
  <div class="py-0 kios-item" :class="!isMobile ? 'px-2 mt-3' : ''">
    <!-- <div v-if="!isMobile" class="d-inline-block" style="position:absolute;top:0;right:50px">
      <qrcode :value="urlQR" :options="{ width: 150 }"></qrcode><br>
      <v-chip class="my-0 ml-2" color="primary" text-color="white" style="width:135px;margin-top:-25px !important">
        <v-icon left class="mr-1 pl-1">center_focus_strong</v-icon> <span style="font-size:13px !important">Quét để đánh giá</span>
      </v-chip>
    </div> -->
    <div class="wrap-scroll py-2" :class="!isMobile && votingItems.length > 2 ? 'wrap-scroll-votting' : ''">
      <div v-if="votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" :class="visible ? 'overlayActive': ''" :style="daDanhGia ? 'pointer-events: none !important' : ''">
        <div class="text-bold pl-3">
          {{index + 1}}.&nbsp; {{ item.subject }}
        </div>
        <v-radio-group class="ml-3 pt-2 mt-0" v-model="item.selected" row>
          <v-radio v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1" :value="index1 + 1"></v-radio>
        </v-radio-group>
      </div>
    </div>
    <div :class="visible ? 'validDanhGiaCLDV': ''">
      <div class="text-xs-center mt-4">
        <v-btn color="primary"
          :loading="loadingAction"
          :disabled="loadingAction"
          @click="submitVotingDossier"
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
    isDvc: false,
    daDanhGia: false,
    serverConfigVoting: "SERVER_SCT",
    votingItemsResult: []
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    let vm = this
    try {
      vm.isDvc = isDvcConfig
    } catch (error) {
    }
    try {
      vm.serverConfigVoting = serverConfigVoting
    } catch (error) {
    }
    vm.$nextTick(function () {
      var vm = this
      // 
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
  mounted () {
    let vm = this
    vm.urlQR = window.location.href
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      try {
        vm.isDvc = isDvcConfig
      } catch (error) {
      }
    }
  },
  methods: {
    submitVoting () {
      let vm = this
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

    },
    submitVotingDossier () {
      let vm = this
      if ($('#dossierNoKey').val() && $('#secretKey').val()) {
        vm.doLoadingDataHoSo()
      } else {
        toastr.clear()
        toastr.error('Vui lòng nhập mã hồ sơ, mã bí mật để đánh giá')
      }
      
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.dossierList = []
      // vm.loadingTable = true
      let currentQuery = router.history.current.query
      let filter = null
      filter = {
        dossierNo: $('#dossierNoKey').val(),
        start: 0,
        end: 1
      }
      vm.$store.dispatch('loadingDanhSachHoSo', filter).then(function (result) {
        if(result.data && result.data.length){
          let dossier = result.data[0]
          if (filter.dossierNo !== dossier['dossierNo']) {
            toastr.error('Mã hồ sơ không chính xác. Vui lòng kiểm tra lại')
            return
          }
          if (dossier.dossierStatus === 'done' || (dossier.dossierStatus !== 'done' && dossier.dossierOverdue.indexOf('Quá') >=0)) {
            let filter2 = {
              password: currentQuery.hasOwnProperty('secret') ? currentQuery.secret : '',
              dossierId: dossier.dossierId,
              referenceUid: dossier.referenceUid,
              isDvc: vm.isDvc,
              serverCode: 'SERVER_' + dossier['govAgencyCode']
            }
            vm.$store.dispatch('getDossierDetailPass', filter2).then(function (res) {
              if (String(dossier.hasPassword) !== String(filter2.password)) {
                toastr.error('Mã bí mật không chính xác')
                return
              }
              if(res && res.data && res.data.dossierId){
                vm.govAgencySelected = res.data.dossierId
                vm.detailDossierMC = res.data
                let valid = vm.votingItems.filter(function (item) {
                  return item.selected == 0
                })
                if (valid && valid.length > 0) {
                  toastr.error('Vui lòng thực hiện đánh giá tất cả các tiêu chí')
                  return
                }
                vm.checkDaDanhGia()
              } else {
                toastr.error('Mã bí mật không chính xác')
              }
            }).catch(function (reject) {
              toastr.error('Mã bí mật không chính xác')
            })
          } else {
            toastr.error('Chỉ hồ sơ đã hoàn thành giải quyết hoặc quá hạn giải quyết mới được thực hiện đánh giá. Xin cảm ơn.')
          }
          
        } else {
          toastr.error('Mã hồ sơ không chính xác. Vui lòng kiểm tra lại')
        }
      }).catch(reject => {
        toastr.error('Mã hồ sơ không chính xác. Vui lòng kiểm tra lại')
      })
    },
    checkDaDanhGia () {
      let vm = this
      let filter = {
        className: 'dossier',
        classPk: vm.detailDossierMC.dossierId,
        serverCode: 'SERVER_' + vm.detailDossierMC['govAgencyCode'],
        isDvc: vm.isDvc
      }
      vm.$store.dispatch('loadVoting', filter).then(function (result) {
        vm.loading = false
        if (result && result.length > 0) {
          let valid = result.filter(function (item) {
            return item.answersCount
          })
          if (valid && valid.length > 0) {
            vm.daDanhGia = true
            toastr.success('Thông tin hồ sơ trên bạn đã thực hiện đánh giá')
            return
          } else {
            for (let index in result) {
              result[index].selected = vm.votingItems[index]['selected']
            }
            vm.votingItemsResult = result
            if (!vm.isDvc) {
              vm.doResultVotingDossier()
            } else {
              vm.doResultVotingMC()
            }
            
          }
        }
        
      }).catch(function (reject) {
        vm.loading = false
      })
    },
    doResultVotingDossier () {
      var vm = this
      let arrAction = []
      if (vm.votingItemsResult.length > 0) {
        vm.loadingAction = true
        for (var index in vm.votingItemsResult) {
          vm.votingItemsResult[index]['className'] = 'dossier'
          vm.votingItemsResult[index]['classPk'] = vm.detailDossierMC.dossierId
          arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItemsResult[index]))
        }
        Promise.all(arrAction).then(results => {
          vm.loadingAction = false
          toastr.success('Đánh giá của bạn được gửi thành công')
          vm.$router.push({
            path: '/danh-gia-mdhl'
          })
        }).catch(xhr => {
          vm.loadingAction = false
          toastr.error('Gửi đánh giá không thành công')
        })
      }
    },
    doResultVotingMC () {
      let vm = this
      let arrAction = []
      if (vm.votingItemsResult.length > 0) {
        vm.loadingAction = true
        for (var index in vm.votingItemsResult) {
          vm.votingItemsResult[index]['className'] = 'dossier'
          vm.votingItemsResult[index]['classPk'] = vm.detailDossierMC.dossierId
          vm.votingItemsResult[index]['serverCode'] = 'SERVER_' + vm.detailDossierMC['govAgencyCode']
          arrAction.push(vm.$store.dispatch('submitVotingMC', vm.votingItemsResult[index]))
        }
        Promise.all(arrAction).then(results => {
          vm.loadingAction = false
          toastr.clear()
          toastr.success('Đánh giá của bạn được gửi thành công')
          vm.$router.push({
            path: '/danh-gia-mdhl'
          })
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
