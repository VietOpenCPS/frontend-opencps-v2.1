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
      <v-container align-center row wrap>
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
                  <!--  -->
                  <div :style="isMobile ? '' : 'position:absolute;top:0;right:0'">
                    <star-rating class="mt-2" read-only :rating="employeeSelected['score']" :increment="0.1" :max-rating="5" :show-rating="false" :star-size="30" :title="employeeSelected['score'] + '/5*'"></star-rating>
                    <div class="text-bold primary--text pl-2">{{employeeSelected['totalVoting']}} lượt đánh giá</div>
                  </div>
                  <!--  -->
                  <div v-if="!isMobile">
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
        <v-flex xs12 sm12 class="text-xs-center my-3">
          <v-btn v-if="Array.isArray(votingItems) && votingItems.length > 0" @click="submitResultVoting" color="primary" :loading="votingDialog_hidden_loading" :disabled="votingDialog_hidden_loading">
            Gửi đánh giá
          </v-btn>
          <v-btn @click="goBack" color="primary">
            <v-icon size="16">reply</v-icon>&nbsp;
            Quay lại 
          </v-btn>
        </v-flex>
      </v-container>
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
    <v-btn class="back-btn" @click="changeScreen" fab color="primary">
      <v-icon v-if="!fullScreen" dark>fullscreen</v-icon>
      <v-icon v-if="fullScreen" dark>fullscreen_exit</v-icon>
    </v-btn>
  </div>
</template>

<script>

import Vue from 'vue'
import toastr from 'toastr'
import Captcha from './Captcha.vue'
import StarRating from 'vue-star-rating'
export default {
  props: ['id'],
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
    dialogShowApplicantIdNo: false,
    isMobile: false
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
        toastr.success('Gửi đánh giá thành công')
        vm.getVotingEmployee()
      }).catch(xhr => {
        toastr.error('Gửi đánh giá thất bại')
      })
    },
    onResize () {
      let vm = this
      vm.isMobile = window.innerWidth < 600
    },
    changeScreen () {
      var vm = this
      vm.$store.commit('setFullScreen', !vm.fullScreen)
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
