<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm2>
        
      </v-flex>
      <v-flex xs12 sm8>
        <v-list class="opencps--voting" v-if="votingItems.length > 0">
          <template v-for="(item, index) in votingItems">
            <v-list-tile :key="index">
              <v-list-tile-content>
                <v-list-tile-sub-title class="grey--text text--darken-4 px-4">
                  {{index + 1}}. {{ item.subject }}
                </v-list-tile-sub-title>
                <!-- <v-list-tile-sub-title class="text-right">
                 <small class="text-gray"> Tạo vào {{ item.createDate | datetimelog}}</small>
               </v-list-tile-sub-title> -->

               <ul class="voting_results" style="margin-left: 20px;">
                <v-radio-group v-model="item.selected">
                  <li v-for="(itemChilds, indexResults) in item.choices" v-bind:key="indexResults">
                    <div status="success" class="voting-results-wrap">
                      <div v-if="item.answersCount > 0 && item.answers[indexResults]" class="uploader-file-progress" :style="'background: white;transform: translateX(' + (item.answers[indexResults] / item.answersCount)*100 + '%);'"></div>
                      <div v-else class="uploader-file-progress" :style="'background: white;transform: translateX(0%);'"></div>
                      <div class="uploader-file-info">
                        <div class="voting-processing">
                          <v-radio 
                          :label="itemChilds"
                          color="primary"
                          :value="indexResults + 1"
                          ></v-radio>
                        </div>
                       <!--  <div class="voting_result_summer">{{item.answers[indexResults]}} / {{item.answersCount}}</div> -->
                      </div>
                    </div>
                  </li>
                </v-radio-group>
                <div class="pl-3 pr-3" v-if="item.commentable"> 
                  <v-text-field
                    v-model="item['comment']"
                    label="Ý kiến khác"
                    multi-line
                    rows="2"
                  ></v-text-field>
                </div>
              </ul>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < votingItems.length" :key="index"></v-divider>
        </template>
        <v-flex xs12 sm12 class="text-xs-center">
            <v-btn color="primary" @click.native="doVottingResultSubmit" style="margin-left: 30px;" :loading="votingDialog_hidden_loading"  class="text-xs-center"
            :disabled="votingDialog_hidden_loading">Gửi ý kiến &nbsp;&nbsp;<v-icon>send</v-icon></v-btn>
            </v-btn>
        </v-flex>
    </v-list>
    <div style="width: 100%;" class="text-xs-center" v-else>
      
    </div>
      </v-flex>
      <v-flex xs12 sm2>
        
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    votingItems: [],
    votingDialog_hidden_loading: false
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
      vm.$store.dispatch('loadVoting', {}).then(result => {
        vm.votingItems = result
        console.log(vm.votingItems)
      }).catch(xhr => {
      })
    })
  },
  watch: {
  },
  methods: {
    doVottingResultSubmit: function () {
      var vm = this
      vm.votingDialog_hidden_loading = true
      let arrAction = []
      for (var key in vm.votingItems) {
        arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[key]))
      }
      Promise.all(arrAction).then(results => {
        vm.votingDialog_hidden_loading = false
      }).catch(xhr => {
        vm.votingDialog_hidden_loading = false
      })
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
      } else {
        return ''
      }
    }
  }
}
</script>
