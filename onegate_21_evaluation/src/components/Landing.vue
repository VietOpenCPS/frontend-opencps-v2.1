<template>
  <div style="font-size:13px" class="px-2 py-2">
    <div class="row-header mb-2">
      <div class="background-triangle-big"> <span>ĐÁNH GIÁ CÁN BỘ</span> </div>
      <div class="layout row wrap header_tools">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="workingUnitSelect ? workingUnitSelect.name : ''">
          {{workingUnitSelect ? workingUnitSelect.name : ''}}
        </div>
      </div> 
    </div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div v-else>
      <v-alert v-if="employeeList.length === 0" :value="true" outline color="info" icon="info">
        Không có dữ liệu.
      </v-alert>
      <div v-else>
        <v-card-text class="px-0 py-0">
          <v-layout class="employeeItem mb-1" wrap v-for="(item, index) in employeeList" :key="index" @click="showEvaluation(item, index)" style="height:120px">
            <v-flex xs12 sm8>
              <v-card style="height:100%;background-color:inherit">
                <v-card-text class="px-2 py-1 pr-0">
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <img v-if="item.photoFileEntryId" style="opacity:0.8;height:100%" :src="item.photoFileEntryId">
                      <img v-else style="opacity:0.8;height:100%" src="https://png.icons8.com/material/100/000000/guest-male.png">
                    </v-flex>
                    <v-flex xs12 sm10>
                      <p class="mb-2" style="font-weight: bold">{{item.fullName}}</p>
                      <p class="mb-2">{{item.birthdate}} <span v-if="item.birthdate && item.jobPosTitle"> |</span><span style="color: #0b72ba"> {{item.jobPosTitle}}</span></p>
                      <p class="mb-2" style="color:green">{{item.workingUnitName}}</p>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4>
              <v-card style="height:100%;background-color:inherit">
                <v-card-text class="px-2 py-1 pr-0">
                  <p class="mb-2">Tổng số lượt đánh giá: <span class="text-bold">{{item.totalEvaluation}}</span></p>
                  <v-layout wrap class="mb-2">
                    <div class="flex xs5 pr-2">Rất hài lòng <span class="text-bold" style="color:#5cb85c">({{item.veryGoodCount}})</span></div>
                    <progress-bar class="flex xs7" size="17" spacing="1" bar-transition="all 1s ease"
                    :val="item.perVeryGood" :text="item.perVeryGood? item.perVeryGood + '%' : ''" 
                    text-position="inside" bg-color="#e0e0e0" bar-color="#5cb85c" text-fg-color="#fff">
                    </progress-bar>
                  </v-layout>
                  <v-layout wrap class="mb-2">
                    <div class="flex xs5 pr-2">Hài lòng <span class="text-bold" style="color:#f0ad4e">({{item.goodCount}})</span></div>
                    <progress-bar class="flex xs7" size="17" spacing="1" bar-transition="all 1s ease"
                    :val="item.perGood" :text="item.perGood ? item.perGood + '%' : ''" 
                    text-position="inside" bg-color="#e0e0e0" bar-color="#f0ad4e" text-fg-color="#fff">
                    </progress-bar>
                  </v-layout>
                  <v-layout wrap class="mb-2">
                    <div class="flex xs5 pr-2">Không hài lòng <span class="text-bold" style="color:#d9534f">({{item.badCount}})</span></div>
                    <progress-bar class="flex xs7" size="17" spacing="1" bar-transition="all 1s ease"
                    :val="item.perBad" :text="item.perBad ? item.perBad + '%' : ''" 
                    text-position="inside" bg-color="#e0e0e0" bar-color="#d9534f" text-fg-color="#fff">
                    </progress-bar>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
        <div class="text-xs-right layout wrap mt-3" style="position: relative;">
          <div class="flex pagging-table px-2"> 
            <tiny-pagination :total="totalPagging" :page="employeePage" custom-class="custom-tiny-class" 
              @tiny:change-page="paggingData" ></tiny-pagination> 
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <v-dialog v-model="dialogEvaluation" max-width="600" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="headline">Đánh giá cán bộ</v-card-title>
          <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogEvaluation = false">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-card-text class="pb-0 pt-4">
            <v-layout wrap>
              <v-flex xs12 sm4>
                <img v-if="employeeSelected.photoFileEntryId" style="opacity:0.8;width:100%" :src="employeeSelected.photoFileEntryId">
                <img v-else style="opacity:0.8;width:100%" src="https://png.icons8.com/material/100/000000/guest-male.png">
              </v-flex>
              <v-flex xs12 sm8 class="pl-3">
                <p class="mb-2 text-bold">{{employeeSelected.fullName}}</p>
                <p class="mb-2">Mã nhân viên: <span class="text-bold">{{employeeSelected.employeeNo}}</span></p>
                <p class="mb-2">Ngày sinh: <span class="text-bold">{{employeeSelected.birthdate}}</span></p>
                <p class="mb-2">Số điện thoại: <span class="text-bold">{{employeeSelected.telNo}}</span></p>
                <p class="mb-2">Email: <span class="text-bold">{{employeeSelected.email}}</span></p>
                <p class="mb-2">Chức vụ: <span class="text-bold">{{employeeSelected.jobTitle}}</span></p>
                <p class="mb-2">Đơn vị: <span class="text-bold">{{employeeSelected.workingUnitName}}</span></p>
              </v-flex>
            </v-layout>
            <div class="mx-4">
              <v-radio-group v-model="radioGroup" row>
                <v-radio label="Rất hài lòng" :value="1"></v-radio>
                <v-radio label="Hài lòng" :value="2"></v-radio>
                <v-radio label="Không hài lòng" :value="3"></v-radio>
              </v-radio-group>
            </div>
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-spacer></v-spacer>
            <v-btn color="primary" flat="flat" @click.native="submitEvaluation"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon>save</v-icon>&nbsp;
              Gửi đánh giá
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogEvaluation = false"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              <v-icon>undo</v-icon>&nbsp;
              Hủy
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import TinyPagination from './pagination.vue'
import ProgressBar from 'vue-simple-progress'
export default {
  props: ['index'],
  components: {
    ProgressBar,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    employeeList: [],
    employeeSelected: {},
    employeeIndex: 0,
    employeePage: 1,
    dialogEvaluation: false,
    loading: true,
    loadingAction: false
  }),
  computed: {
    totalPagging () {
      return this.$store.getters.getTotalEmployee
    },
    workingUnitSelect () {
      return this.$store.getters.getWorkingUnitSelect
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let filter = {
        workingunit: vm.index,
        start: 0,
        end: 5
      }
      vm.$nextTick(function () {
        vm.loading = true
        vm.$store.dispatch('getEmployee', filter).then(function (result) {
          // console.log('employeesCreated', result)
          setTimeout(function () {
            vm.loading = false
          }, 200)
          vm.employeeList = result
          let query = vm.$router.history.current.query
          if (query.hasOwnProperty('page') && query['page'] !== '1') {
            vm.employeePage = parseInt(query['page'])
          } else {
            vm.employeePage = 1
          }
          if (vm.employeeList && vm.employeeList.length > 0) {
            for (let key in vm.employeeList) {
              vm.getEvaluationItem(key)
            }
          }
        }).catch(function (reject) {
          vm.loading = false
          vm.employeeList = []
        })
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (currentParams.hasOwnProperty('index') && currentParams.index) {
        vm.currentIndex = currentParams.index
      }
      if (currentQuery.hasOwnProperty('page')) {
        vm.employeePage = parseInt(currentQuery.page)
      } else {
        vm.employeePage = 1
      }
      // console.log('currentIndex', vm.currentIndex)
      let filter = {
        workingunit: vm.currentIndex,
        start: vm.employeePage * 5 - 5,
        end: vm.employeePage * 5
      }
      vm.loading = true
      this.$store.dispatch('getEmployee', filter).then(function (result) {
        console.log('employeesWatch', result)
        setTimeout(function () {
          vm.loading = false
        }, 200)
        vm.employeeList = result
        let query = vm.$router.history.current.query
        if (query.hasOwnProperty('page') && query['page'] !== '1') {
          vm.employeePage = parseInt(query['page'])
        } else {
          vm.employeePage = 1
        }
        if (vm.employeeList && vm.employeeList.length > 0) {
          for (let key in vm.employeeList) {
            vm.getEvaluationItem(key)
          }
        }
      }).catch(function (reject) {
        vm.loading = false
      })
    }
  },
  methods: {
    showEvaluation (item, index) {
      var vm = this
      console.log('itemEmployee', item)
      vm.employeeSelected = item
      vm.employeeIndex = index
      vm.dialogEvaluation = true
      vm.radioGroup = null
    },
    submitEvaluation () {
      var vm = this
      vm.loadingAction = true
      let filter = {
        evaluationName: vm.employeeSelected.fullName,
        score: vm.radioGroup
      }
      vm.$store.dispatch('postEvaluationEmployee', vm.employeeSelected).then(function (result) {
        console.log('resultPostEvaluation', result)
        vm.loadingAction = false
        vm.dialogEvaluation = false
        setTimeout(function () {
          vm.getEvaluationItem(vm.employeeIndex)
        }, 100)
      }).catch(function (reject) {
        vm.loadingAction = false
        console.log(reject)
      })
    },
    getEvaluationItem (key) {
      var vm = this
      vm.$store.dispatch('getEvaluationEmployee', vm.employeeList[key]).then(function (result) {
        // console.log('resultgetEvaluationEmployee', result)
        if (result && result.length > 0) {
          vm.employeeList[key]['totalEvaluation'] = result.length
          vm.employeeList[key]['veryGoodCount'] = vm.countingPercent(result).veryGoodCount
          vm.employeeList[key]['perVeryGood'] = vm.countingPercent(result).perVeryGood
          vm.employeeList[key]['goodCount'] = vm.countingPercent(result).goodCount
          vm.employeeList[key]['perGood'] = vm.countingPercent(result).perGood
          vm.employeeList[key]['badCount'] = vm.countingPercent(result).badCount
          vm.employeeList[key]['perBad'] = vm.countingPercent(result).perBad
        }
      }).catch(function (reject) {
        console.log(reject)
      })
    },
    countingPercent (result) {
      let outData = {
        veryGoodCount: 0,
        perVeryGood: 0,
        goodCount: 0,
        perGood: 0,
        badCount: 0,
        perBad: 0
      }
      let veryGood = result.filter(function (item) {
        return item['score'] === 1
      }).length
      let good = result.filter(function (item) {
        return item['score'] === 2
      }).length
      let bad = result.filter(function (item) {
        return item['score'] === 3
      }).length
      outData.veryGoodCount = veryGood
      outData.perVeryGood = ((veryGood / result.length) * 100).toFixed(1)
      outData.goodCount = good
      outData.perGood = ((good / result.length) * 100).toFixed(1)
      outData.badCount = bad
      outData.perBad = (100 - outData.perVeryGood - outData.perGood).toFixed(1)
      return outData
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      // console.log('queryString=====', queryString)
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    }
  }
}
</script>
