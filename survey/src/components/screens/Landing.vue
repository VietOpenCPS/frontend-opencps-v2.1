<template>
  <div style="max-width:1300px;height: 100%; background-color: #ffff; padding-top: 20px;">
    <v-layout row wrap>
      <!-- <v-flex xs12 sm12 class="text-xs-center" style="margin-bottom: 20px;">
        <h3 class="text-xs-center mt-2" style="color:#065694">CÂU HỎI KHẢO SÁT</h3>
      </v-flex> -->
      <!-- <v-flex xs12 sm1>
      </v-flex> -->
      <v-flex xs12 sm9 v-if="votingItems.length > 0">
        <v-layout row wrap>
          <v-flex xs12 sm12 class="mb-4 px-2">
            <div class="primary--text text-bold">
              Phiếu đánh giá dạng điện tử dành cho cá nhân, tổ chức được cung cấp trên Cổng dịch vụ công cấp bộ, cấp tỉnh,
              Cổng thông tin điện tử của cơ quan, đơn vị để cá nhân, tổ chức thực hiện đánh giá trực tuyến; đồng thời tích hợp ý kiến góp ý, 
              phản ánh và kết quả xử lý với Hệ thống thông tin một cửa điện tử cấp bộ, cấp tỉnh.
            </div>
          </v-flex>
          <v-flex xs12 sm12>
            <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;" :key="index">
              <v-layout wrap class="text-bold">
                <div class="flex px-3 py-1" style="height:26px;max-width:87px;background-color: #0052A3;transform: skew(-25deg)">
                  <span class="d-block white--text" style="transform: skew(25deg)">Chỉ số {{index + 1}} : </span>
                </div>
                <div class="flex primary--text pl-3 pr-2" style="max-width:calc(100% - 100px)">
                  {{ item.subject }}
                </div>
              </v-layout>
              <div class="ml-4">
                <v-radio-group v-model="item.selected" column class="mt-1">
                  <v-radio :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                    <div :class="item.selected === indexChoise + 1 ? 'primary--text' : 'black--text'" slot="label">{{itemChoise}}</div>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
            <v-flex xs12 sm12 class="mb-3 mt-3" v-if="showCaptcha">
              <captcha ref="captcha"></captcha>
            </v-flex>
            <v-flex xs12 sm12 class="text-xs-left mt-2">
              <v-btn class="white--text" @click="doVottingResultSubmit" color="#004C98" :loading="btnLoading" :disabled="btnLoading">
                <v-icon>save</v-icon>&nbsp;
                Gửi đánh giá
              </v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm7 v-else>
        <div class="px-3">
          <v-alert outline color="warning" icon="priority_high" :value="true">
            Chưa có câu hỏi khảo sát
          </v-alert>
        </div>
      </v-flex>
      <v-flex xs12 sm3>
        <div >
          <v-card color="#b33431ed" flat class="white--text px-2 py-2" style="border-radius: 7px;">
            <v-card-text class="px-2 py-1 pr-0 ">
              <div class="text-xs-center text-bold">Tổng số lượt đánh giá</div>
              <div class="text-xs-center"> trong năm {{(new Date()).getFullYear()}}</div>
              <div class="text-xs-center text-bold" style="font-size:24px">{{totalAnswer}}</div>
              <div class="text-xs-center">lượt đánh giá</div>
            </v-card-text>
          </v-card>
          <!-- <v-card color="teal lighten-1" flat class="px-2 py-2 mt-4" style="border-radius: 7px;">
            <v-card-text class="px-2 py-1 pr-0">
              <div class="text-xs-center white--text text-bold">Kết quả đánh giá các chỉ số</div>
              <div class="text-xs-center white--text" >Năm {{(new Date()).getFullYear()}}</div>
              <div class="mt-3" v-for="(item, index) in resultTotal" :key="index">
                <v-layout wrap class="mb-2">
                  <div class="flex white--text" style="width:70px">{{item.name}} : </div>
                  <progress-bar class="flex pt-1" size="13" :spacing="1" bar-transition="all 1s ease"
                  :val="Number(item.percent)" 
                  bg-color="#e0e0e0" bar-color="#3F51B5" text-fg-color="#fff" style="z-index:10000;width: calc(100% - 120px)">
                  </progress-bar>
                  <div style="width:50px" class="flex indigo--text pl-2 text-bold">{{item.percent}} % </div>
                </v-layout>
              </div>
            </v-card-text>
          </v-card> -->
          <v-card v-for="(item, index) in votingItems" :key="index" color="teal lighten-1" flat class="px-2 py-2 mt-4" style="border-radius: 7px;">
            <v-card-text class="px-2 py-1 pr-0">
              <div class="text-xs-center white--text text-bold">Kết quả đánh giá Chỉ số {{index + 1}}</div>
              <div class="text-xs-center white--text" >Năm {{(new Date()).getFullYear()}}</div>
              <div class="mt-3" v-for="(item1, index1) in item['answerPercent']" :key="index1">
                <v-layout wrap class="mb-2">
                  <div class="flex white--text" style="width:70px">{{item1.name}} : </div>
                  <progress-bar class="flex pt-1" size="13" :spacing="1" bar-transition="all 1s ease"
                  :val="Number(item1.percent)" 
                  bg-color="#e0e0e0" bar-color="#3F51B5" text-fg-color="#fff" style="z-index:10000;width: calc(100% - 120px)">
                  </progress-bar>
                  <div style="width:50px" class="flex indigo--text pl-2 text-bold">{{item1.percent}} % </div>
                </v-layout>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-flex>
      <v-flex xs12 sm1>
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
            <v-flex xs12 sm10 class="pl-4">
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
    resultTotal: [],
    totalAnswer: 0
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadVoting', {
        className: 'survey',
        classPk: 0
      }).then(result => {
        vm.votingItems = result
        vm.totalAnswer = 0
        for (let i = 0; i < vm.votingItems.length; i++) {
          vm.totalAnswer += Number(vm.votingItems[i]['answersCount'])
          vm.getPercentItem(vm.votingItems[i], i)
        }
        // vm.getPercentTotal(vm.votingItems)
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
    doVottingResultSubmit: function () {
      var vm = this
      if (vm.$refs.captcha) {
        if (!vm.$refs.captcha.checkValidCaptcha()) {
          toastr.error('Mã captcha không đúng. Vui lòng kiểm tra lại')
          return
        }
      } else {
        vm.showCaptcha = true
        return
      }
      vm.btnLoading = true
      let arrAction = []
      for (var key in vm.votingItems) {
        vm.votingItems[key]['className'] = 'survey'
        vm.votingItems[key]['classPk'] = 0
        arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
      }
      Promise.all(arrAction).then(results => {
        toastr.success('Yêu cầu của bạn được thực hiện thành công.')
        vm.btnLoading = false
        if (vm.$refs.captcha) {
          vm.$refs.captcha.makeRandomString()
        }
        vm.$store.dispatch('loadVoting', {
          className: 'survey',
          classPk: 0
        }).then(result => {
          vm.votingItems = result
          vm.totalAnswer = 0
          for (let i = 0; i < vm.votingItems.length; i++) {
            vm.totalAnswer += Number(vm.votingItems[i]['answersCount'])
            vm.getPercentItem(vm.votingItems[i], i)
          }
          // vm.getPercentTotal(vm.votingItems)
        }).catch( function () {
        })
      }).catch(xhr => {
        toastr.error('Yêu cầu của bạn thực hiện thất bại.')
        vm.btnLoading = false
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
    getPercentItem (votingItems, index) {
      let vm = this
      let votingPercent = []
      for (var i = votingItems['answers'].length - 1; i >= 0; i--) {
        let result = {
          name: 'Điểm ' + (i + 1),
          count: Number(votingItems['answersCount']),
          percent: Number(((Number(votingItems['answers'][i]) / Number(votingItems['answersCount'])) * 100).toFixed(1))
        }
        votingPercent.push(result)
      }
      vm.votingItems[index]['answerPercent'] = votingPercent
    },
    getPercentTotal (votingItems) {
      let vm = this
      if (votingItems && votingItems.length > 0) {
        let votingPercent = []
        let totalAnswer = 0
        for (var i = votingItems[0]['answers'].length - 1; i >= 0; i--) {
          // let result = {
          //   name: 'Điểm ' + (i + 1),
          //   count: 0,
          //   percent: 0
          // }
          let result = {
            name: 'Điểm ' + (i),
            count: 0,
            percent: 0
          }
          votingPercent.push(result)
        }
        for (var j = votingItems.length -1 ; j >= 0; j--) {
          totalAnswer += votingItems[j]['answersCount']
          let itemAnswer
          for (var k = votingItems[j]['answers'].length - 1; k >= 0; k--) {
            votingPercent[k]['count'] += votingItems[j]['answers'][k]
          }
        }
        // for (var i = votingPercent.length - 1; i >= 0; i--) {
        //   totalAnswer += votingPercent[i]['count']
        // }
        for (var i = votingPercent.length - 1; i >= 0; i--) {
          if (totalAnswer) {
            let percent = ((votingPercent[i]['count'] / totalAnswer) * 100).toFixed(0)
            votingPercent[i]['percent'] = percent
          } else {
            votingPercent[i]['percent'] = 0
          }
        }
        vm.totalAnswer = totalAnswer
        vm.resultTotal = votingPercent
        console.log('votingPercent', votingPercent)
      }
    },
    changeVoting () {
    },
    getQuarters () {
      let month = (new Date()).getMonth() + 1;
      return (Math.ceil(month / 3));
    }
  },
  filters: {
  }
}
</script>
