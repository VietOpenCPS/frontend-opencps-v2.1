<template>

  <v-layout wrap>
    <v-flex v-if="!payment">
      <content-placeholders v-if="loading">
        <content-placeholders-img />
        <content-placeholders-heading />
      </content-placeholders>
      <v-data-table
        v-else
        :headers="headers"
        :items="loadHomeDataTable.data"
        class="table-bordered danhSachHoSoTable__class"
        hide-actions
        :no-data-text="'Không tìm thấy hồ sơ ' + supportData.langUI[type]"
        :no-results-text="'Không tìm thấy hồ sơ ' + supportData.langUI[type]"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left" v-if="type === 'ke_hoach'" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
            {{ loadHomeDataTablePage * 15 - 15 + props.index + 1 }}
          </td>
          <td class="text-xs-left" v-else :class='{
              "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
              "wd-label-color-light-green": props.item.documentStatusCode === 18,
              "wd-label-color-red": props.item.documentStatusCode === 10,
              "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
              "wd-bg-color-yellow": props.item.documentStatusCode === 13
              }'>
              {{ loadHomeDataTablePage * 15 - 15 + props.index + 1 }}
            </td>

          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
              "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
              "wd-label-color-light-green": props.item.requestState === 12,
              "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
              "wd-label-color-dark-blue": props.item.requestState === 15,
              "wd-bg-color-yellow": props.item.requestState === 27
              }' style="position: relative;">
            <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                {{supportData.status.ke_hoach[props.item.requestState]}}
            </a>
            <v-tooltip top v-if="props.item.ghichu.length > 0">
              <v-icon size="16" v-if="props.item.ghichu.length > 0" slot="activator" color="primary">info</v-icon>
              <span v-if="props.item.ghichu.length > 0">{{props.item.ghichu}}</span>
            </v-tooltip>
            </td>
            <td v-else-if="type === 'thu_tuc'" class="text-xs-center" :class='{
              "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
              "wd-label-color-light-green": props.item.documentStatusCode === 18,
              "wd-label-color-red": props.item.documentStatusCode === 10,
              "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
              "wd-bg-color-yellow": props.item.documentStatusCode === 13
              }' style="position: relative;">
            <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                {{supportData.status.thu_tuc[props.item.documentStatusCode]}}
            </a>
            <v-tooltip top v-if="props.item.ghichu.length > 0">
              <v-icon size="16" v-if="props.item.ghichu.length > 0" slot="activator" color="primary">info</v-icon>
              <span v-if="props.item.ghichu.length > 0">{{props.item.ghichu}}</span>
            </v-tooltip>
            </td>
            <td v-else-if="type === 'lanh_dao' || type === 'van_thu'" class="text-xs-center" :class='{
              "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
              "wd-label-color-light-green": props.item.documentStatusCode === 18,
              "wd-label-color-red": props.item.documentStatusCode === 10,
              "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
              "wd-bg-color-yellow": props.item.documentStatusCode === 13
              }'>
            <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                <span v-if="props.item.requestState === 14">
                  {{supportData.status.ke_hoach[props.item.requestState]}}
                </span>
                <span v-else>
                  {{supportData.status.thu_tuc[props.item.documentStatusCode]}}
                </span>
            </a>
        </td>
        <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
              {{supportData.status.ke_hoach[props.item.requestState]}}
          </a>
          </td>
          
          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.documentName}}
          </a>
          </td>
          <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.documentName}}
          </a>
          </td>


          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.shipName}}
          </a>
          </td>
          <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.shipName}}
          </a>
          </td>


          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.callSign}}
          </a>
          </td>
          <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.callSign}}
          </a>
          </td>


          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.imo}}
          </a>
          </td>
          <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.imo}}
          </a>
          </td>


          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{supportData.data_state[props.item.stateCode]}}
          </a>
          </td>
          <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{supportData.data_state[props.item.stateCode]}}
          </a>
          </td>


          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
            <span>
              <a v-if="props.item.documentTypeCode === 'XC' || props.item.documentTypeCode === '5' || props.item.documentTypeCode === '17' || props.item.documentTypeCode === '9' || props.item.documentTypeCode === '11' || props.item.documentTypeCode === '13'" 
                href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                {{props.item.shipDateTo | moment("DD/MM/YYYY | HH:mm")}}
              </a>
              <a v-else
                href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                {{props.item.shipDateFrom | moment("DD/MM/YYYY | HH:mm")}}
              </a>
            </span>
          </td>

          <td v-else class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
            <span>
              <a v-if="props.item.documentTypeCode === 'XC' || props.item.documentTypeCode === '5' || props.item.documentTypeCode === '17' || props.item.documentTypeCode === '9' || props.item.documentTypeCode === '11' || props.item.documentTypeCode === '13'" 
                href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                {{props.item.shipDateTo | moment("DD/MM/YYYY | HH:mm")}}
              </a>
              <a v-else
                href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
                {{props.item.shipDateFrom | moment("DD/MM/YYYY | HH:mm")}}
              </a>
            </span>
          </td>

          <td v-if="type === 'lanh_dao' || type === 'van_thu'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.nameOfShipownersAgents}}
          </a>
          </td>

          <td v-if="type === 'lanh_dao' || type === 'van_thu'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
            <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
              {{props.item.shipDateTo | moment("DD/MM/YYYY | HH:mm")}}
            </a>
          </td>

          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.nameOfShipownersAgents}}
          </a>
          </td>
          <td v-if="type === 'thu_tuc'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.nameOfShipownersAgents}}
          </a>
          </td>

          <td v-if="type === 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.requestState === 14 || props.item.requestState === 114,
            "wd-label-color-light-green": props.item.requestState === 12,
            "wd-label-color-red": props.item.requestState === 13 || props.item.requestState === 16,
            "wd-label-color-dark-blue": props.item.requestState === 15,
            "wd-bg-color-yellow": props.item.requestState === 27
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.createdDate | moment("DD/MM/YYYY | HH:mm")}}
          </a>
          </td>
          <td v-if="type !== 'ke_hoach'" class="text-xs-center" :class='{
            "wd-label-color-tim": props.item.documentStatusCode === 20 || props.item.documentStatusCode === 120,
            "wd-label-color-light-green": props.item.documentStatusCode === 18,
            "wd-label-color-red": props.item.documentStatusCode === 10,
            "wd-label-color-dark-blue": props.item.documentStatusCode === 19,
            "wd-bg-color-yellow": props.item.documentStatusCode === 13
            }'>
          <a href="javascript:;" @click.stop.prevent="toDetailHoSo(1, props.item)">
            {{props.item.createdDate | moment("DD/MM/YYYY | HH:mm")}}
          </a>
          </td>
        </template>
      </v-data-table>
      <div class="text-xs-right layout wrap" style="position: relative;">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="loadHomeDataTable.total" :page="loadHomeDataTablePage" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </v-flex>

    <v-flex v-else>
      <content-placeholders v-if="loading">
        <content-placeholders-img />
        <content-placeholders-heading />
      </content-placeholders>
      <v-data-table
        v-else
        :headers="headersPayment"
        :items="loadHomeDataTablePayment.data"
        class="table-bordered danhSachHoSoTable__class"
        hide-actions
        :no-data-text="'Không tìm thấy phiếu thanh toán'"
        :no-results-text="'Không tìm thấy phiếu thanh toán'"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">
            {{ loadHomeDataTablePagePayment * 15 - 15 + props.index + 1 }}
          </td>
          <td class="text-xs-center">
          {{props.item.documentName}} <br/>
          <small v-if="props.item.paymenttype > 0" style="
              color: #0e70bc;
          ">( {{paymentTypeData[props.item.paymenttype]}} {{paymentMarkDelete[props.item.markasdeleted]}})</small>
          </td>
          <td class="text-xs-center">
          {{props.item.tenTau}}
          </td>
          <td class="text-xs-center">
          {{props.item.hoHieu}}
          </td>
          <td class="text-xs-center">
          {{props.item.imo}}
          </td>
          <td class="text-xs-center">
          {{supportData.data_state[props.item.quocTich]}}
          </td>
          <td class="text-xs-center">
          {{props.item.daiLy}}
          </td>
          <td class="text-xs-center">{{props.item.debitnotenumber}}</td>
          <td class="text-xs-center"> {{props.item.reportdate | moment("DD/MM/YYYY | HH:mm")}}</td>
          <td class="text-xs-center red--text">{{props.item.totalpayment | money}}</td>
        </template>
      </v-data-table>
      <div class="text-xs-right layout wrap" style="position: relative;">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="loadHomeDataTablePayment.total" :page="loadHomeDataTablePagePayment" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingDataPayment" ></tiny-pagination> 
        </div>
      </div>
    </v-flex>

  </v-layout>

</template>

<script>
import supportData from '../store/support_data.json'
import TinyPagination from './hang_hai/hanghai_pagination.vue'

export default {
  props: ['type', 'documentTypeCode', 'documentStatusCode'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    loading: true,
    supportData: supportData,
    loadHomeDataTable: {},
    loadHomeDataTablePage: 1,
    headers: [],
    payment: false,
    loadHomeDataTablePayment: {},
    loadHomeDataTablePagePayment: 1,
    headersPayment: [],
    paymentTypeData: {},
    paymentMarkDelete: {}
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      if (vm.type === 'lanh_dao' || vm.type === 'van_thu') {
        vm.headers = vm.supportData.headers_boss
      } else {
        vm.headers = vm.supportData.headers
      }
      if (vm.type !== 'ke_toan') {
        vm.headersPayment = vm.supportData.headersPaymentView
      } else {
        vm.headersPayment = vm.supportData.headersPayment
      }
      vm.paymentTypeData = vm.supportData.paymentTypeData
      vm.paymentMarkDelete = vm.supportData.paymentMarkDeleteData
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      if (!vm.loadHomeDataTable.hasOwnProperty('data')) {
        let query = vm.$router.history.current.query
        if (query.hasOwnProperty('page') && query['page'] !== 1) {
          vm.loadHomeDataTablePage = query['page']
        } else {
          vm.loadHomeDataTablePage = 1
        }
        let param = null
        if (query.hasOwnProperty('adv') && (query['adv'] === true || query['adv'] === 'true')) {
          param = {
            type: vm.type,
            documentTypeCode: vm.documentTypeCode,
            documentStatusCode: vm.documentStatusCode,
            adv: query.adv,
            maritimeCodeOwner: query.maritimeCodeOwner,
            positionCode: query.positionCode,
            imo: query.imo,
            stateCode: query.stateCode,
            maritimeCode: query.maritimeCode,
            maritimeCodeNext: query.maritimeCodeNext,
            timeShip: query.timeShip,
            timeSend: query.timeSend,
            daily: encodeURIComponent(query.daily),
            start: vm.loadHomeDataTablePage * 15 - 15,
            end: vm.loadHomeDataTablePage * 15
          }
        } else {
          param = {
            type: vm.type,
            documentTypeCode: vm.documentTypeCode,
            documentStatusCode: vm.documentStatusCode,
            shipName: encodeURIComponent(query.shipName),
            maBanKhai: query.maBanKhai,
            callSign: query.callSign,
            start: vm.loadHomeDataTablePage * 15 - 15,
            end: vm.loadHomeDataTablePage * 15
          }
        }
        if (query.hasOwnProperty('daKy') && (query['daKy'] === true || query['daKy'] === 'true')) {
          param['daKy'] = true
        }
        vm.loading = true
        vm.$store.dispatch('loadHomeDataTable', param).then(function (result) {
          vm.loadHomeDataTable = result
          vm.loading = false
        })
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query.hasOwnProperty('page')) {
        vm.loadHomeDataTablePage = query['page']
      }
      let param = null
      if (query.hasOwnProperty('adv') && (query['adv'] === true || query['adv'] === 'true')) {
        param = {
          type: vm.type,
          documentTypeCode: vm.documentTypeCode,
          documentStatusCode: vm.documentStatusCode,
          adv: query.adv,
          maritimeCodeOwner: query.maritimeCodeOwner,
          positionCode: query.positionCode,
          imo: query.imo,
          stateCode: query.stateCode,
          maritimeCode: query.maritimeCode,
          maritimeCodeNext: query.maritimeCodeNext,
          timeShip: query.timeShip,
          timeSend: query.timeSend,
          daily: encodeURIComponent(query.daily),
          start: vm.loadHomeDataTablePage * 15 - 15,
          end: vm.loadHomeDataTablePage * 15
        }
      } else {
        param = {
          type: vm.type,
          documentTypeCode: vm.documentTypeCode,
          documentStatusCode: vm.documentStatusCode,
          shipName: encodeURIComponent(query.shipName),
          maBanKhai: query.maBanKhai,
          callSign: query.callSign,
          start: vm.loadHomeDataTablePage * 15 - 15,
          end: vm.loadHomeDataTablePage * 15
        }
      }
      if (query.hasOwnProperty('payment') && (query['payment'] === true || query['payment'] === 'true')) {
        vm.payment = true
        let paramFilter = {
          'markasdeleted': vm.documentStatusCode,
          'start': vm.loadHomeDataTablePagePayment * 15 - 15,
          'end': vm.loadHomeDataTablePagePayment * 15
        }
        if (vm.documentStatusCode === 2 || vm.documentStatusCode === '2') {
          paramFilter['markasdeleted'] = '1,2,9,12'
        } else if (vm.documentStatusCode === 1 || vm.documentStatusCode === '1') {
          paramFilter['markasdeleted'] = '0,11'
        }
        if (query.hasOwnProperty('maBanKhai')) {
          paramFilter['keywordsSearch'] = query.maBanKhai
        }
        if (query.hasOwnProperty('shipName')) {
          paramFilter['shipName'] = query.shipName
        }
        if (query.hasOwnProperty('callSign')) {
          paramFilter['callSign'] = query.callSign
        }
        vm.loading = true
        vm.$store.dispatch('loadHomeDataPaymentTable', paramFilter).then(function (result) {
          vm.loadHomeDataTablePayment = result
          vm.loading = false
        })
      } else {
        vm.payment = false
        vm.loading = true
        if (query.hasOwnProperty('daKy') && (query['daKy'] === true || query['daKy'] === 'true')) {
          param['daKy'] = true
        }
        vm.$store.dispatch('loadHomeDataTable', param).then(function (result) {
          vm.loadHomeDataTable = result
          vm.loading = false
        })
      }
      if (vm.documentTypeCode === '14' || vm.documentTypeCode === '15') {
        if (vm.headers.length > 0) {
          vm.headers.map(item => {
            if (item['text'] === 'IMO') {
              item['text'] = 'Số đăng ký'
            }
            return item
          })
        }
        if (vm.headersPayment.length > 0) {
          vm.headersPayment.map(item => {
            if (item['text'] === 'IMO') {
              item['text'] = 'Số đăng ký'
            }
            return item
          })
        }
      }
    }
  },
  methods: {
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    toDetailHoSo (index, item) {
      let status = item.requestState
      if (this.type === 'thu_tuc') {
        status = item.documentStatusCode
      }
      this.$router.push('/ho-so/' + this.type + '/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/' + status)
    }
  },
  filters: {
    money (value) {
      if (value) {
        var moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ'
      } else {
        return ''
      }
    }
  }
}
</script>
