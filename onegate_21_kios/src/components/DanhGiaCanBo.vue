<template>
  <div style="font-size:13px" class="px-2 py-0">
    <!-- <div class="row-header mb-2">
      <div class="background-triangle-big"> <span>ĐÁNH GIÁ CÁN BỘ</span> </div>
      <div class="layout row wrap header_tools">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="workingUnitSelect ? workingUnitSelect.name : ''">
          {{workingUnitSelect ? workingUnitSelect.name : ''}}
        </div>
      </div> 
    </div> -->
    <div >
      <v-layout class="wrap">
        <div style="width: calc(100% - 150px)">
          <v-layout wrap>
            <!-- <v-text-field
              label="Tên cán bộ"
              placeholder="Nhấn để nhập tên cán bộ"
              v-model="employeeNameKey"
              clearable
              style="max-width:400px"
            ></v-text-field> -->
            <v-flex xs6 class="pl-2 pr-2">
              <v-select
                :items="listCoQuan"
                v-model="coQuanSelected"
                autocomplete
                label="Cơ quan"
                item-text="itemName"
                item-value="itemCode"
                return-object
                @change="changeCoQuan"
                :hide-selected="true"
              ></v-select>
            </v-flex>
            <v-flex xs6 class="pl-2 pr-2">
              <div class="input-group input-group--placeholder input-group--text-field primary--text">
                <label>Tên cán bộ</label>
                <div class="input-group__input">
                  <input id="employeeNameKey" data-layout="normal" @focus="show" aria-label="Tên cán bộ" placeholder="Nhấn để nhập tên cán bộ" type="text">
                  <i v-if="visible" @click="clear('employeeNameKey')" aria-hidden="true" class="icon material-icons input-group__append-icon input-group__icon-cb input-group__icon-clearable">clear</i>
                </div>
                <div class="input-group__details"></div>
              </div>
            </v-flex>
          </v-layout>
        </div>
        <div class="pt-2 text-center" style="width: 150px">
          <v-btn color="primary"
            :loading="loading"
            :disabled="loading"
            @click="filterEmployee"
            class="mt-3 ml-3"
          >
            <v-icon size="18">search</v-icon>
            &nbsp;
            Tra Cứu
            <span slot="loader">Loading...</span>
          </v-btn>
        </div>
      </v-layout>
      <!--  -->
      <vue-touch-keyboard class="mt-5" v-if="visible" :layout="layout" :cancel="hide" :accept="accept" :input="input" :next="next" />
      <!--  -->
      <content-placeholders class="mt-3" v-if="loading">
        <content-placeholders-text :lines="10" />
      </content-placeholders>
      <div v-else class="mt-3">
        <div class="my-3 pt-2 text-center total-result-search">
          <span class="text-bold">Có {{totalPagging}} kết quả được tìm thấy</span>
        </div>
        <v-card-text class="px-0 py-0">
          <v-layout wrap >
            <v-flex xs12 sm6 class="mb-2" v-for="(item, index) in employeeList" :key="index" :class="index%2!==1 ? 'pr-2' : ''" @click="showEvaluation(item, index)" style="height:120px">
              <v-layout class="employeeItem mb-1 card" wrap>
                <v-flex xs12 sm6>
                  <v-card class="employeeItem-scope-left">
                    <v-card-text class="px-2 py-1 pr-0">
                      <v-layout wrap>
                        <v-flex xs12 sm5>
                          <img v-if="item.photoFileEntryId" style="max-height:105px" :src="item.photoFileEntryId">
                          <img v-else style="max-height:105px" src="/o/frontend-web-evaluation/images/default_avatar.png">
                        </v-flex>
                        <v-flex xs12 sm7>
                          <p class="mb-2 text-bold">{{item.fullName}}</p>
                          <p class="mb-2">Mã nhân viên: <span class="text-bold">{{item.employeeNo}}</span></p>
                          <p class="mb-2">Ngày sinh: <span class="text-bold">{{item.birthdate | dateTimeView}}</span></p>
                          <p class="mb-2" style="color:green">{{item.jobPosTitle}}</p>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-card class="employeeItem-scope-right">
                    <v-card-text class="px-2 py-1 pr-0">
                      <p class="mb-2">Tổng số lượt đánh giá: <span class="text-bold">{{item.totalEvaluation}}</span></p>
                      <v-layout wrap class="mb-2">
                        <div class="flex xs5 pr-2">Rất hài lòng <span class="text-bold" style="color:#5cb85c">({{item.veryGoodCount}})</span></div>
                        <progress-bar class="flex xs7" size="17" spacing="1" bar-transition="all 1s ease"
                        :val="item.perVeryGood" :text="item.veryGoodCount !== 0 ? item.perVeryGood + '%' : ''" 
                        text-position="inside" bg-color="#e0e0e0" bar-color="#5cb85c" text-fg-color="#fff">
                        </progress-bar>
                      </v-layout>
                      <v-layout wrap class="mb-2">
                        <div class="flex xs5 pr-2">Hài lòng <span class="text-bold" style="color:#f0ad4e">({{item.goodCount}})</span></div>
                        <progress-bar class="flex xs7" size="17" spacing="1" bar-transition="all 1s ease"
                        :val="item.perGood" :text="item.goodCount !== 0 ? item.perGood + '%' : ''" 
                        text-position="inside" bg-color="#e0e0e0" bar-color="#f0ad4e" text-fg-color="#fff">
                        </progress-bar>
                      </v-layout>
                      <v-layout wrap class="mb-2">
                        <div class="flex xs5 pr-2">Không hài lòng <span class="text-bold" style="color:#d9534f">({{item.badCount}})</span></div>
                        <progress-bar class="flex xs7" size="17" spacing="1" bar-transition="all 1s ease"
                        :val="item.perBad" :text="item.badCount !== 0 ? item.perBad + '%' : ''" 
                        text-position="inside" bg-color="#e0e0e0" bar-color="#d9534f" text-fg-color="#fff">
                        </progress-bar>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
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
    <v-dialog v-model="dialogEvaluation" scrollable max-width="600" persistent>
      <v-card>
        <v-card-title class="headline">Đánh giá cán bộ</v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogEvaluation = false">
          <v-icon>clear</v-icon>
        </v-btn>
        <v-card-text class="pb-0 pt-4" style="height: 290px;">
          <v-layout wrap>
            <v-flex xs12 sm4>
              <img v-if="employeeSelected.photoFileEntryId" style="max-height:185px" :src="employeeSelected.photoFileEntryId">
              <img v-else style="max-height:185px" src="/o/frontend-web-evaluation/images/default_avatar.png">
            </v-flex>
            <v-flex xs12 sm8 class="pl-3">
              <p class="mb-2 text-bold">{{employeeSelected.fullName}}</p>
              <p class="mb-2">Mã nhân viên: <span class="text-bold">{{employeeSelected.employeeNo}}</span></p>
              <p class="mb-2">Ngày sinh: <span class="text-bold">{{employeeSelected.birthdate | dateTimeView}}</span></p>
              <p class="mb-2">Số điện thoại: <span class="text-bold">{{employeeSelected.telNo}}</span></p>
              <p class="mb-2">Email: <span class="text-bold">{{employeeSelected.email}}</span></p>
              <p class="mb-2">Chức vụ: <span class="text-bold">{{employeeSelected.jobPosTitle}}</span></p>
            </v-flex>
          </v-layout>
          <div class="mx-4">
            <v-radio-group v-model="radioGroup" row>
              <v-radio label="Rất hài lòng" :value="1"></v-radio>
              <v-radio label="Hài lòng" :value="2"></v-radio>
              <v-radio label="Không hài lòng" :value="3"></v-radio>
            </v-radio-group>
          </div>
          <span class="mx-4" v-if="radioGroup === null && evaluationValidate === false" style="color:#f44336">* &nbsp; Lựa chọn đánh giá của bạn</span>
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
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import TinyPagination from './pagination.vue'
import ProgressBar from 'vue-simple-progress'
import $ from 'jquery'
export default {
  // props: ['index'],
  components: {
    ProgressBar,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    employeeList: [],
    employeeSelected: {},
    listCoQuan: [],
    coQuanSelected: '',
    employeeIndex: 0,
    employeePage: 1,
    // employeeNameKey: '',
    dialogEvaluation: false,
    evaluationValidate: true,
    loading: true,
    loadingAction: false,
    //
    visible: false,
    layout: 'normal',
    input: null,
    options: {
      useKbEvents: false
    }
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
        // workingunit: vm.index,
        start: 0,
        end: 10
      }
      vm.$nextTick(function () {
        vm.loading = true
        vm.$store.dispatch('getWorkingUnit').then(function (result) {
          vm.listCoQuan = result
          if (vm.listCoQuan.length > 0) {
            vm.coQuanSelected = vm.listCoQuan[0]
            vm.employeePage = 1
            let filter = {
              workingunit: vm.coQuanSelected.itemCode,
              start: 0,
              end: 10
            }
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
          }
        })
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      // if (currentParams.hasOwnProperty('index') && currentParams.index) {
      //   vm.currentIndex = currentParams.index
      // }
      if (currentQuery.hasOwnProperty('page')) {
        vm.employeePage = parseInt(currentQuery.page)
      } else {
        vm.employeePage = 1
      }
      let filter = {
        workingunit: vm.coQuanSelected,
        // keyword: vm.employeeNameKey ? vm.employeeNameKey : '',
        employeeName: $('#employeeNameKey').val(),
        start: vm.employeePage * 10 - 10,
        end: vm.employeePage * 10
      }
      // console.log('filter', filter)
      vm.loading = true
      this.$store.dispatch('getEmployee', filter).then(function (result) {
        // console.log('employeesWatch', result)
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
    filterEmployee () {
      var vm = this
      vm.visible = false
      let filter = {
        workingunit: vm.coQuanSelected.itemCode,
        // keyword: vm.employeeNameKey ? vm.employeeNameKey : '',
        employeeName: $('#employeeNameKey').val(),
        start: vm.employeePage * 10 - 10,
        end: vm.employeePage * 10
      }
      vm.employeePage = 1
      vm.loading = true
      this.$store.dispatch('getEmployee', filter).then(function (result) {
        setTimeout(function () {
          vm.loading = false
        }, 200)
        vm.employeeList = result
        if (vm.employeeList && vm.employeeList.length > 0) {
          for (let key in vm.employeeList) {
            vm.getEvaluationItem(key)
          }
        }
      }).catch(function (reject) {
        vm.loading = false
      })
    },
    changeCoQuan () {
      var vm = this
      setTimeout(function () {
        vm.filterEmployee()
      }, 100)
    },
    showEvaluation (item, index) {
      var vm = this
      // console.log('itemEmployee', item)
      vm.employeeSelected = item
      vm.employeeIndex = index
      vm.dialogEvaluation = true
      vm.radioGroup = null
    },
    submitEvaluation () {
      var vm = this
      if (vm.radioGroup) {
        vm.evaluationValidate = true
        vm.loadingAction = true
        let filter = {
          employeeId: vm.employeeSelected.employeeId,
          // employeeName: $('#employeeNameKey').val(),
          // evaluationName: vm.employeeSelected.fullName,
          score: vm.radioGroup
        }
        vm.$store.dispatch('postEvaluationEmployee', filter).then(function (result) {
          // console.log('resultPostEvaluation', result)
          vm.loadingAction = false
          vm.dialogEvaluation = false
          setTimeout(function () {
            vm.getEvaluationItem(vm.employeeIndex)
          }, 100)
        }).catch(function (reject) {
          vm.loadingAction = false
          console.log(reject)
        })
      } else {
        vm.evaluationValidate = false
      }
    },
    getEvaluationItem (key) {
      var vm = this
      vm.$store.dispatch('getEvaluationEmployee', vm.employeeList[key]).then(function (result) {
        // console.log('resultgetEvaluationEmployee', result)
        if (result && result.length > 0) {
          setTimeout(function () {
            vm.employeeList[key]['totalEvaluation'] = result.length
            vm.employeeList[key]['veryGoodCount'] = vm.countingPercent(result).veryGoodCount
            vm.employeeList[key]['perVeryGood'] = vm.countingPercent(result).perVeryGood
            vm.employeeList[key]['goodCount'] = vm.countingPercent(result).goodCount
            vm.employeeList[key]['perGood'] = vm.countingPercent(result).perGood
            vm.employeeList[key]['badCount'] = vm.countingPercent(result).badCount
            vm.employeeList[key]['perBad'] = vm.countingPercent(result).perBad
          }, 200)
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
    },
    //
    clear (id) {
      $(`#${id}`).val('')
    },
    accept (text) {
      this.hide()
    },
    show (e) {
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
