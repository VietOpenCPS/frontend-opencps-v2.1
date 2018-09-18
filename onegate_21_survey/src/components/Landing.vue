<template>
  <div style="height: 100%; background-color: #ffff; padding-top: 20px;">
    <v-layout row wrap>
      <v-flex xs12 sm12 class="text-xs-center" style="margin-bottom: 20px;">
        <h3 class="text-center">CÂU HỎI KHẢO SÁT</h3>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
      <v-flex xs12 sm8>
        <v-layout row wrap>
          <v-flex xs12 sm12>
            <div v-for="(item, index) in votingItems" style="margin-bottom: 5px;">
              <div style="font-weight: bold;">{{index + 1}}. {{ item.subject }}</div>
              <div class="ml-4">
                <v-radio-group v-model="item.selected" height="10" row>
                  <v-radio :label="itemChoise" height="10" :value="indexChoise + 1" v-for="(itemChoise, indexChoise) in item['choices']" :key="'rd' + indexChoise">
                  </v-radio>
                </v-radio-group>
                <v-layout wrap class="ml-3" style="margin-top:-21px">
                  <v-flex style="margin-left:45px" v-for="(item2, index2) in item.answers" :key="index2">
                    <span class="text-bold" style="color:green">{{item2}}/{{item.answersCount}}</span>
                  </v-flex>
                </v-layout>
              </div>
              <div class="mt-3 ml-4 mr-3" v-if="item.commentable">
                <v-text-field
                v-model="item['comment']"
                label="Ý kiến khác"
                multi-line
                rows="2"
                ></v-text-field>
              </div>
            </div>
            <v-flex xs12 sm12 class="mb-3 mt-3" v-if="showCaptcha">
              <captcha ref="captcha"></captcha>
            </v-flex>
            <v-flex xs12 sm12 class="text-xs-center mt-2">
              <v-btn @click="doVottingResultSubmit" color="primary" :loading="btnLoading" :disabled="btnLoading">Gửi kết quả đánh giá</v-btn>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm2>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import Captcha from './Captcha.vue'
import toastr from 'toastr'
export default {
  props: ['index'],
  components: {
    'captcha': Captcha
  },
  data: () => ({
    votingItems: [],
    btnLoading: false,
    showCaptcha: false
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
      router.push({
        path: '/danh-sach-can-bo/' + item.itemCode,
        query: {
          itemName: item.itemName
        }
      })
    },
    doVottingResultSubmit: function () {
      var vm = this
      if (vm.$refs.captcha) {
        if (!vm.$refs.captcha.checkValidCatcha()) {
          toastr.error('Xác nhận sai. Vui lòng kiểm tra lại!')
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
          vm.$refs.captcha.refreshCaptcha()
        }
      }).catch(xhr => {
        toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        vm.btnLoading = false
      })
    }
  },
  filters: {
  }
}
</script>
