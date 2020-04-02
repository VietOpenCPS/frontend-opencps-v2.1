<template>
  <div style="height: 100%;">
    <v-layout row wrap color="#ffffff">

      <v-flex xs12>
        <div class="row-header">
          <div class="background-triangle-big"> 
            <span>Thống kê tình hình giải quyết hồ sơ từng cán bộ</span>
          </div>
          <div class="layout row wrap header_tools row-blue"> 
          </div> 
        </div>
        <v-card>
          <v-layout wrap class="pt-3">
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12 md3 class="pl-3" v-if="agencyLists.length > 1">
                        <v-autocomplete
                        :items="agencyLists"
                        v-model="govAgency"
                        item-text="text"
                        item-value="value"
                        class="input-outline"
                        >
                        </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 md3 class="pl-3">
                        <v-text-field
                            v-model="employeeName"
                            class="input-outline"
                            placeholder="Tên cán bộ"
                            @change="changeEmployeeName"
                        >
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 md2 class="pl-3" v-for="(item, indexTool) in filters" v-bind:key="indexTool">
                      <datetime-picker
                          v-if="item['type'] === 'date' && showPicker"
                          v-model="data[item.key]"
                          :item="item"
                          :data-value="data[item.key]"
                          :data-all="data"
                          @change="reloadPickerChange(item.key)"
                          class="input-outline"
                      >
                      </datetime-picker>
                    </v-flex>
                    <v-flex xs12 md2 class="text-right">
                      <v-btn depressed small color="primary" @click="getReportDossierEmployee"><v-icon>image_search</v-icon>Tìm kiếm</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="text-center mt-5" style="font-size:14px">
              <span class="text-bold">THỐNG KÊ TÌNH HÌNH GIẢI QUYẾT HỒ SƠ TỪNG CÁN BỘ</span> <br/>
              <span>Từ ngày {{data['fromStatisticDate']}} đến ngày {{data['toStatisticDate']}}</span>
            </v-flex>
            <v-flex xs12 class="pb-3">
    
                <v-data-table
                :headers="headersReport"
                :items="listDossierEmployeeFilter"
                hide-actions
                :loading="loading"
                class="table-landing table-bordered mt-4 mx-3"
                style="border-left: 1px solid #dedede;"
                no-data-text="Không có hồ sơ giải quyết"
                >
                <template slot="items" slot-scope="props">
                    <tr>
                    <td class="text-xs-center py-2" style="width: 65px;height: 36px">
                        <div>
                        <span>{{ pageNumber * 10 - 10 + props.index + 1 }}</span>
                        </div>
                    </td>
                    <td class="text-xs-left py-2" style="height: 36px">
                        <div>
                        <span>{{props.item.fullName}}</span>
                        </div>
                    </td>
                    <td class="text-xs-left py-2" style="height: 36px">
                        <div>
                        <span>{{props.item.jobPosName ? props.item.jobPosName : 'Cán bộ'}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center py-2" style="height: 36px">
                        <div>
                        <span>{{Number(props.item.overdue) + Number(props.item.undue)}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center py-2" style="height: 36px">
                        <div>
                        <span>{{props.item.undue}}</span>
                        </div>
                    </td>
                    <td class="text-xs-center py-2" style="height: 36px">
                        <div>
                        <span>{{props.item.overdue}}</span>
                        </div>
                    </td>
                    </tr>
                </template>
                </v-data-table>  
            </v-flex>
            <v-flex xs12>
              <v-layout>
                <v-flex xs1>                
                  <v-btn outline color="primary" @click="back"> 
                      <v-icon>arrow_back</v-icon>  Quay lại
                  </v-btn></v-flex>
                <v-flex xs11>
                  <div class="text-xs-right layout wrap mx-2" style="position: relative;" v-if="listDossierEmployee.length > 10">
                    <div class="flex pagging-table px-2"> 
                        <tiny-pagination :total="listDossierEmployee.length" nameRecord="cán bộ" :page="pageNumber" :numberPerPage="10" :showLimit="false" custom-class="custom-tiny-class" 
                        @tiny:change-page="paggingData" ></tiny-pagination> 
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import DatetimePicker from './DatetimePicker.vue'
import StarRating from 'vue-star-rating'
import TinyPagination from './pagination'
Vue.use(toastr)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: ['index'],
  components: {
    DatetimePicker,
    StarRating,
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    employeeName: '',
    reportDossier: true,
    loading: false,
    agencyLists: [],
    filterConfig: '',
    filters: [],
    govAgency: 0,
    hasData: true,
    data: {},
    showPicker: true,
    totalEmployee: 0,
    employeeSelected: '',
    votingList: '',
    headersReport: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Cán bộ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chức vụ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tổng số hồ sơ đã xử lý',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đúng hạn',
        align: 'center',
        sortable: false
      },
      {
        text: 'Quá hạn',
        align: 'center',
        sortable: false
      }
    ],
    listDossierEmployee: [],
    listDossierEmployeeFilter: [],
    reportDossierTotal: 0,
    pageNumber: 1
  }),
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      let filter = {
        reportCode: 'STATISTIC_09'
      }
      vm.$store.dispatch('getDynamicReports', filter).then(function (result) {
        vm.filterConfig = eval('( ' + result['filterConfig'] + ' )')
        if (vm.filterConfig.hasOwnProperty('groupIdsAdmin')) {
          vm.agencyLists = vm.filterConfig['groupIdsAdmin']
          if (vm.agencyLists.length > 0) {
            let defaultVal = vm.agencyLists[0]['value']
            for (let key in vm.agencyLists) {
              if (vm.agencyLists[key]['selected']) {
                defaultVal = vm.agencyLists[key]['value']
                break
              }
            }
            if (query.hasOwnProperty('groupId') && query['groupId']) {
              vm.govAgency = Number(query['groupId'])
            } else {
              vm.govAgency = defaultVal
            }
          }
        }
        if (vm.filterConfig.hasOwnProperty('filters')) {
          vm.filters = vm.filterConfig['filters']
        }
        for (let key in vm.filters) {
          if (vm.filters[key]['type'] === 'select' || vm.filters[key]['type'] === 'date') {
            vm.data[vm.filters[key]['key']] = vm.filters[key]['value']
            if (vm.filters[key]['type'] === 'date' && query.hasOwnProperty(vm.filters[key]['key']) && query[vm.filters[key]['key']]) {
              vm.data[vm.filters[key]['key']] = query[vm.filters[key]['key']]
            }
          }
        }
        vm.getReportDossierEmployee()
      })
    })
  },
  mounted () {
    let vm = this
    vm.$nextTick(function () {
      $('#app_report_charts .application--wrap').css('max-width', '1500px')
    })
  },
  watch: {
  },
  methods: {
    reloadPickerChange (key) {
      let vm = this
      vm.showPicker = false
      setTimeout(() => {
        vm.data[key] = new Date(vm.data[key]).toLocaleDateString('vi-VN')
        vm.showPicker = true
      }, 200)
    },
    changeAgency () {
      let vm = this
      vm.employeeName = ''
      setTimeout(function () {
          vm.getReportDossierEmployee()
      }, 200)
    },
    changeEmployeeName () {
      let vm = this
      setTimeout(function () {
        if (vm.employeeName.length > 0) {
          vm.listDossierEmployeeFilter = vm.listDossierEmployee.filter(function (item) {
            return vm.stringConvert(item.fullName).indexOf(vm.stringConvert(vm.employeeName)) >= 0
          })
        } else {
          vm.pageNumber = 1
          vm.listDossierEmployeeFilter = vm.listDossierEmployee.slice(0, 10)
        }
      }, 200)
    },
    getReportDossierEmployee () {
      let vm = this
      vm.loading = true
      setTimeout (function () {
        let filter = {
          groupId: vm.govAgency ? vm.govAgency : window.themeDisplay.getScopeGroupId(),
          from: vm.data['fromStatisticDate'],
          to: vm.data['toStatisticDate']
        }
        vm.$store.dispatch('getReportDossierEmployee', filter).then(function (result) {
          vm.listDossierEmployee = result
          if (vm.employeeName) {
            vm.listDossierEmployeeFilter = vm.listDossierEmployee.filter(function (item) {
              return vm.stringConvert(item.fullName).indexOf(vm.stringConvert(vm.employeeName)) >= 0
            })
          } else {
            vm.listDossierEmployeeFilter = vm.listDossierEmployee
          }
          vm.pageNumber = 1
          vm.listDossierEmployeeFilter = vm.listDossierEmployeeFilter.slice(0, 10)
          vm.loading = false
        }).catch(function () {
          vm.listDossierEmployee = []
          vm.listDossierEmployeeFilter = []
          vm.loading = false
        })
      }, 200)
    },
    stringConvert (str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      str = str.replace(/ /g, "");
      return str.toLowerCase();
    },
    paggingData (config) {
      let vm = this
      vm.pageNumber = config.page
      vm.listDossierEmployeeFilter = vm.listDossierEmployee.slice((config.page - 1)*10, config.page*10)
    },
    back() {
      window.history.back()
    }
  },
  filters: {
  }
}
</script>
