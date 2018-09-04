<template>
  <div style="font-size:13px" class="py-0">
    <v-layout class="wrap">
      <v-flex class="content-left">
        <div class="row-header my-0 mb-2">
          <div class="row-blue"> CƠ QUAN CHUYÊN MÔN </div> 
        </div>
        <content-placeholders class="mt-3" v-if="loading">
          <content-placeholders-text :lines="7" />
        </content-placeholders>
        <v-list v-else class="py-0 nav_trang_thai_ho_so overflowComment wrap_working">
          <v-list-tile :class="item.itemCode.toString() === currentIndex.toString() ? 'list_item_active' : ''" 
          v-for="item in workingUnitList" :key="item.itemCode" @click="fiterWorkingUnit(item)">
            <v-list-tile-action>
              <v-icon size="18" color="primary">account_balance</v-icon>
            </v-list-tile-action>
            <v-list-tile-content style="display:inline-block;padding-top:3px">
              <v-tooltip top>
                <v-list-tile-title slot="activator" v-text="item.itemName"></v-list-tile-title>
                <span>{{item.itemName}}</span>
              </v-tooltip>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-flex>
      <v-flex class="content-right pl-2">
        <div class="row-header mb-2">
          <div class="background-triangle-big"> <span>{{workingUnitSelect ? workingUnitSelect.itemName : ''}}</span> </div>
          <div class="layout row wrap header_tools">
            <div class="flex solo text-ellipsis">
              <v-text-field
                v-model="employeeNameKey"
                @keyup.enter="getEmployee"
                placeholder="Tìm kiếm theo tên cán bộ"
                solo
              ></v-text-field>
            </div> 
            <div class="flex text-right" style="margin-left: auto;">
              <v-btn flat class="my-0 mx-0 btn-border-left"
              :loading="loading"
              :disabled="loading"
              @click="getEmployee">
                <!-- <v-icon size="16">search</v-icon> -->
                Tìm kiếm
              </v-btn>
            </div>
          </div> 
        </div>
        <!--  -->
        <!-- <div class="row-header" style="margin-top: 6px;">
          <div class="background-triangle-big"> <span v-if="trangThaiHoSoList">{{trangThaiHoSoList[index].title}}</span> </div> 
          <div class="layout row wrap header_tools row-blue">
            
          </div>
        </div> -->
        <!--  -->
        <!-- <v-layout class="wrap mb-4">
          <v-text-field
            class="input-border pt-2"
            placeholder="Nhấn để nhập tên cán bộ"
            v-model="employeeNameKey"
            @keyup.enter="getEmployee"
            clearable
            style="width: calc(100% - 200px)"
          ></v-text-field>
          <div class="pt-1 text-center" style="width: 200px">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="getEmployee"
              class="mt-3 ml-3"
            >
              <v-icon size="18">search</v-icon>
              &nbsp;
              Tra Cứu
              <span slot="loader">Loading...</span>
            </v-btn>
          </div>
        </v-layout> -->
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
                <v-flex xs6 md8>
                  <v-card style="height:100%;background-color:inherit">
                    <v-card-text class="px-2 py-1 pr-0">
                      <v-layout wrap>
                        <v-flex xs3 sm3 md2>
                          <img v-if="item.imageUrl" style="max-height:105px" :src="item.imageUrl">
                          <img v-else style="max-height:105px" src="/o/frontend-web-evaluation/images/default_avatar.png">
                        </v-flex>
                        <v-flex xs9 sm9 md10 class="pl-3">
                          <p class="mb-2 text-bold">{{item.fullName}}</p>
                          <p class="mb-2">Mã thẻ: <span class="text-bold">{{item.employeeNo}}</span></p>
                          <!-- <p class="mb-2">Ngày sinh: <span class="text-bold">{{item.birthdate | dateTimeView}}</span></p> -->
                          <p class="mb-2">Chức vụ: <span class="text-bold">{{item.jobPosTitle}}</span></p>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs6 md4>
                  <v-card style="height:100%;background-color:inherit">
                    <v-card-text class="px-2 py-1 pr-0">
                      <p class="mb-2">Tổng số lượt đánh giá: <span class="text-bold">{{item.totalEvaluation}}</span></p>
                      <v-layout wrap class="mb-2">
                        <div class="flex xs6 md5 pr-2">Rất hài lòng <span class="text-bold" style="color:#5cb85c">({{item.veryGoodCount}})</span></div>
                        <progress-bar class="flex xs6 md7" size="17" spacing="1" bar-transition="all 1s ease"
                        :val="item.perVeryGood" :text="item.veryGoodCount !== 0 ? item.perVeryGood + '%' : ''" 
                        text-position="inside" bg-color="#e0e0e0" bar-color="#5cb85c" text-fg-color="#fff">
                        </progress-bar>
                      </v-layout>
                      <v-layout wrap class="mb-2">
                        <div class="flex xs6 md5 pr-2">Hài lòng <span class="text-bold" style="color:#f0ad4e">({{item.goodCount}})</span></div>
                        <progress-bar class="flex xs6 md7" size="17" spacing="1" bar-transition="all 1s ease"
                        :val="item.perGood" :text="item.goodCount !== 0 ? item.perGood + '%' : ''" 
                        text-position="inside" bg-color="#e0e0e0" bar-color="#f0ad4e" text-fg-color="#fff">
                        </progress-bar>
                      </v-layout>
                      <v-layout wrap class="mb-2">
                        <div class="flex xs6 md5 pr-2">Không hài lòng <span class="text-bold" style="color:#d9534f">({{item.badCount}})</span></div>
                        <progress-bar class="flex xs6 md7" size="17" spacing="1" bar-transition="all 1s ease"
                        :val="item.perBad" :text="item.badCount !== 0 ? item.perBad + '%' : ''" 
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
      </v-flex>
    </v-layout>
    <!--  -->
    <v-dialog v-model="dialogEvaluation" scrollable max-width="500" persistent>
      <v-card>
        <v-card-title class="headline">Đánh giá cán bộ</v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogEvaluation = false">
          <v-icon>clear</v-icon>
        </v-btn>
        <v-card-text class="pb-0 pt-3" style="height: 200px;">
          <v-layout wrap>
            <v-flex xs12 sm4>
              <img v-if="employeeSelected.imageUrl" style="max-height:125px" :src="employeeSelected.imageUrl">
              <img v-else style="max-height:125px" src="/o/frontend-web-evaluation/images/default_avatar.png">
            </v-flex>
            <v-flex xs12 sm8 class="pl-3">
              <p class="mb-2 text-bold">{{employeeSelected.fullName}}</p>
              <p class="mb-2">Mã thẻ: <span class="text-bold">{{employeeSelected.employeeNo}}</span></p>
              <!-- <p class="mb-2">Ngày sinh: <span class="text-bold">{{employeeSelected.birthdate | dateTimeView}}</span></p>
              <p class="mb-2">Số điện thoại: <span class="text-bold">{{employeeSelected.telNo}}</span></p>
              <p class="mb-2">Email: <span class="text-bold">{{employeeSelected.email}}</span></p> -->
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
export default {
  props: ['index'],
  components: {
    ProgressBar,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    currentIndex: '',
    workingUnitList: [],
    workingUnitSelect: {},
    employeeList: [],
    employeeSelected: {},
    employeeIndex: 0,
    employeeNameKey: '',
    employeePage: 1,
    dialogEvaluation: false,
    evaluationValidate: true,
    loading: true,
    loadingAction: false
  }),
  computed: {
    totalPagging () {
      return this.$store.getters.getTotalEmployee
    }
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      vm.loading = true
      vm.$store.dispatch('getWorkingUnit').then(function (result) {
        vm.loading = false
        if (result && result.length > 0) {
          vm.workingUnitList = result
        }
        if (vm.index) {
          vm.currentIndex = vm.index
        } else {
          vm.currentIndex = vm.workingUnitList.length > 0 ? vm.workingUnitList[0].itemCode : ''
        }
        vm.workingUnitSelect = vm.workingUnitList.length > 0 ? vm.workingUnitList[0] : ''
        let filter = {
          workingunit: vm.currentIndex,
          start: 0,
          end: 10
        }
        if (vm.workingUnitList.length > 0) {
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
                // vm.getImageUsers(key, vm.employeeList[key])
              }
            }
          }).catch(function (reject) {
            vm.loading = false
            vm.employeeList = []
          })
        }
      }).catch(function (reject) {
        vm.loading = false
        vm.workingUnitList = []
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
      let filter = {
        employeeName: vm.employeeNameKey,
        workingunit: vm.currentIndex,
        start: vm.employeePage * 10 - 10,
        end: vm.employeePage * 10
      }
      console.log('filter', filter)
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
            // vm.getImageUsers(key, vm.employeeList[key])
          }
        }
      }).catch(function (reject) {
        vm.loading = false
      })
    }
  },
  methods: {
    fiterWorkingUnit (item) {
      this.workingUnitSelect = item
      this.currentIndex = item.itemCode
      this.employeeNameKey = ''
      router.push({
        path: '/' + item.itemCode,
        query: {
          q: item.queryParamsqueryParams
        }
      })
    },
    showEvaluation (item, index) {
      var vm = this
      console.log('itemEmployee', item)
      vm.employeeSelected = item
      vm.employeeIndex = index
      vm.dialogEvaluation = true
      vm.radioGroup = null
    },
    getEmployee () {
      var vm = this
      vm.employeePage = 1
      let filter = {
        workingunit: vm.currentIndex,
        employeeName: vm.employeeNameKey,
        start: vm.employeePage * 10 - 10,
        end: vm.employeePage * 10
      }
      vm.loading = true
      vm.$store.dispatch('getEmployee', filter).then(function (result) {
        setTimeout(function () {
          vm.loading = false
        }, 200)
        vm.employeeList = result
        if (vm.employeeList && vm.employeeList.length > 0) {
          for (let key in vm.employeeList) {
            vm.getEvaluationItem(key)
            // vm.getImageUsers(key, vm.employeeList[key])
          }
        }
      }).catch(function (reject) {
        vm.loading = false
      })
    },
    submitEvaluation () {
      var vm = this
      if (vm.radioGroup) {
        vm.evaluationValidate = true
        vm.loadingAction = true
        let filter = {
          employeeId: vm.employeeSelected.employeeId,
          evaluationName: vm.employeeSelected.fullName,
          score: vm.radioGroup
        }
        vm.$store.dispatch('postEvaluationEmployee', filter).then(function (result) {
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
      } else {
        vm.evaluationValidate = false
      }
    },
    // getImageUsers (key, item) {
    //   var vm = this
    //   vm.fileAttachmentUrl({
    //     method : 'GET',
    //     url : '/o/rest/v2/users/' + item.mappingUser.userId + '/photo',
    //     async : false,
    //     success: function (options) {
    //       var urlOut = options.url
    //       item['imageUrl'] = urlOut
    //     },
    //     error: function () {}
    //   })
    // },
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
    }
    // get image users
    // fileAttachmentUrl (options) {
    //   var xhttp = new XMLHttpRequest()
    //   var a, filename
    //   var data = {}
    //   xhttp.onreadystatechange = function() {
    //     if (xhttp.readyState === 4 && xhttp.status === 200) {
    //       var disposition = xhttp.getResponseHeader('Content-Disposition')
    //       if (disposition && disposition.indexOf('attachment') !== -1) {
    //         var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    //         var matches = filenameRegex.exec(disposition)
    //         if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '')
    //       }
    //       a = document.createElement('a')
    //       a.href = window.URL.createObjectURL(xhttp.response)
    //       var url = window.URL.createObjectURL(xhttp.response)
    //       options.success({url : url, status : xhttp.status})
    //     } else if (xhttp.readyState === 4 && xhttp.status !== 200) {
    //       options.error(xhttp.status)
    //     }
    //   }
    //   xhttp.open(options.method, options.url)
    //   xhttp.setRequestHeader('Content-Type', 'application/json')
    //   if (options.hasOwnProperty('headers')) {
    //     Object.keys( options.headers ).map(function(objectKey, index) {
    //       var value = options.headers[objectKey]
    //       xhttp.setRequestHeader(objectKey, value)
    //     })
    //   }
    //   if (options.hasOwnProperty('responseType')) {
    //     xhttp.responseType = options.responseType
    //   } else {
    //     xhttp.responseType = 'blob'
    //   }
    //   if (options.hasOwnProperty('data')) {
    //     data = options.data
    //   }
    //   xhttp.send(data)
    // }
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
