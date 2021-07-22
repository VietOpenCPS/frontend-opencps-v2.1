<template>

  <v-layout wrap>
    <div class="row-header flex-break ke__toan_header" v-if="!detailPage">
      <div class="background-triangle-big"> Kết quả tìm kiếm</div>
      <div class="layout row wrap header_tools w-100-xs">
      
        <div class="flex xs8 sm5 solo" v-if="paymentStatus !== 1 && paymentStatus !== '1'">

          <v-radio-group v-model="paymentMethodSearch" row>
            <v-radio label="Tiền mặt" value="0" ></v-radio>
            <v-radio label="Chuyển khoản" value="1"></v-radio>
          </v-radio-group>

        </div>

        <div class="flex xs4 sm2" v-if="paymentStatus !== 1 && paymentStatus !== '1'">
          
          <v-btn flat class="px-0 py-0" v-on:click.native="paymentConfirmAction">
            <v-icon size="16">done_all</v-icon> &nbsp;
            Xác nhận
          </v-btn>

        </div>

        <div class="flex pr-3 w-100-xs" style="display: flex;display: -webkit-flex;">
          
          <v-text-field 
            append-icon="search"
            v-on:keyup.native="filterByKeyWordOBJ"
            v-model="keywordsSearch" solo placeholder="Tìm kiếm theo từ khoá mã bản khai, số phiếu"></v-text-field>

        </div>

      </div>
    </div>
    <div style="width: 100%;">
      <content-placeholders v-if="loading">
        <content-placeholders-img />
        <content-placeholders-heading />
      </content-placeholders>
      <v-data-table
        v-else
        :headers="headersPayment"
        :items="loadHomeDataTablePayment.data"
        class="table-bordered danhSachHoSoTable__class danhSachPhieuThanhToan__class"
        hide-actions
        :no-data-text="'Không tìm thấy phiếu thanh toán'"
        :no-results-text="'Không tìm thấy phiếu thanh toán'"
      >
        <template slot="items" slot-scope="props">
          <td style="padding: 0 !important;" v-if="paymentStatus !== 1 && paymentStatus !== '1'"> 
            <div class="radio radio-primary">
              <label style="margin-left: 3px;" v-if="choiced === props.item.id">
                <v-btn class="mx-0 my-0 px-0 py-0" v-on:click="doSelectedPayment(props.item, props.index)" icon>
                  <v-icon color="primary">radio_button_checked</v-icon>
                </v-btn>
              </label>
              <label style="margin-left: 3px;" v-else>
                <v-btn class="mx-0 my-0 px-0 py-0" v-on:click="doSelectedPayment(props.item, props.index)" icon>
                  <v-icon>radio_button_unchecked</v-icon>
                </v-btn>
              </label>
            </div>
          </td>
          <td class="text-xs-left" @click="toViewDetail(props.item)">
            {{ loadHomeDataTablePagePayment * 15 - 15 + props.index + 1 }}
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">
          {{props.item.documentName}} <br/>
          <small v-if="props.item.paymenttype > 0" style="
              color: #0e70bc;
          ">( {{paymentTypeData[props.item.paymenttype]}} {{paymentMarkDelete[props.item.markasdeleted]}})</small>
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">
          {{props.item.tenTau}}
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">
          {{props.item.hoHieu}}
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">
          {{props.item.imo}}
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">
          {{supportData.data_state[props.item.quocTich]}}
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">
          {{props.item.daiLy}}
          </td>
          <td class="text-xs-center" @click="toViewDetail(props.item)">{{props.item.debitnotenumber}}</td>
          <td class="text-xs-center" @click="toViewDetail(props.item)"> {{props.item.reportdate | moment("DD/MM/YYYY | HH:mm")}}</td>
          <td class="text-xs-center red--text" @click="toViewDetail(props.item)">{{props.item.totalpayment | moneyView}} {{props.item.currency}}</td>
          <td class="text-xs-left btn--action-ketoan" style="padding: 0 0 0 0px !important;"  v-if="paymentStatus !== 1 && paymentStatus !== '1'">
            <v-btn flat class="mx-0 my-0" v-on:click.native="doSelectedPaymentEdit(props.item, props.index)" v-if="props.item.markasdeleted != 9">
              <v-icon size="16">chevron_right</v-icon> &nbsp;
              Cập nhật phí
            </v-btn>
            <v-btn flat class="mx-0 my-0" v-if="props.item.totalpayment > 0 && props.item.markasdeleted != 9"
              v-on:click.native="resendNoti(props.item, props.index)"
              :loading="loading_process_btn"
              :disabled="loading_process_btn"
            >
              <v-icon size="16">chevron_right</v-icon> &nbsp;
              Gửi lại TBP
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </div>
    <div v-if="!loadingPage" class="text-xs-right layout wrap" style="position: relative;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="loadHomeDataTablePayment.total" :page="loadHomeDataTablePagePayment" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingDataPayment" ></tiny-pagination> 
      </div>
    </div>
    <v-dialog v-model="dialog_edit_payment" scrollable persistent max-width="800px">
      <v-form v-model="validPayment" ref="formEditPayment" lazy-validation>
        <v-card>
          <v-card-title class="headline">
            Thêm mới, cập nhật thông tin
          </v-card-title>
          <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialog_edit_payment = false">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0">Mã bản khai:</v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-subheader>{{detailModel.documentName}}</v-subheader>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader>Ngày lập phiếu:</v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-subheader class="px-0">{{detailModel.reportdate | datetime}}</v-subheader>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0">Số phiếu tính tiền:</v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <v-subheader>{{detailModel.debitnotenumber}}</v-subheader>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader>Tổng tiền:</v-subheader>
              </v-flex>
              <v-flex xs8 sm3>
                <v-text-field
                  v-model="detailModel.totalpayment"
                  placeholder="tổng tiền ..."
                  :rules="[rulesMoney.required]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4 sm1>
                <v-select
                  v-bind:items="currencys"
                  v-model="currency"
                  single-line
                  auto
                  hide-details
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-subheader class="pl-0">Nhập ý kiến:</v-subheader>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="detailModel.comments"
                  :rules="[rulesMoney.requiredYKien]"
                  required
                  textarea
                ></v-text-field>
              </v-flex>
            </v-layout>
            </v-card-text>
            <v-card-actions class="pr-2 mr-1">
              <v-spacer></v-spacer>
              <v-btn color="red" dark @click.native="dialog_edit_payment = false">
                <v-icon size="16" >undo</v-icon>&nbsp;
                Quay lại
                <span slot="loader">Loading...</span>
              </v-btn>
              <v-btn color="primary" dark @click.native="doSaveData"
                :loading="loadingAction"
                :disabled="loadingAction"
              >
                <v-icon size="16">save</v-icon>&nbsp;
                Ghi lại
                <span slot="loader">Loading...</span>
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-layout>

</template>

<script>
import TinyPagination from './hang_hai/hanghai_pagination.vue'
import supportData from '../store/support_data.json'
import axios from 'axios'
import toastr from 'toastr'

var paymentMarkDeleteData = {
  '0': '',
  '1': '',
  '2': '',
  '9': '',
  '11': 'báo nộp chuyển khoản',
  '12': 'thanh toán trực tuyến'
}
var paymentTypeData = {
  '0': '',
  '1': 'chuyển khoản',
  '2': 'trực tuyến'
}

export default {
  props: ['paymentStatus'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    validPayment: false,
    loadingAction: false,
    dialog_edit_payment: false,
    loadingPage: false,
    loading: false,
    supportData: supportData,
    paymentMethodSearch: '0',
    loadHomeDataTablePayment: {},
    loadHomeDataTablePagePayment: 1,
    headersPayment: [],
    currencys: ['VND', 'USD'],
    currency: 'VND',
    imo: '',
    maritimeCodes: [],
    maritimeCodesTiepTheos: [],
    positionCodes: [],
    stateCodes: [],
    maritimeCode: null,
    maritimeCodeNext: null,
    positionCode: null,
    stateCode: null,
    shipName: '',
    callSign: '',
    cang_vu_label: '',
    isAdv: true,
    paymentMarkDelete: paymentMarkDeleteData,
    paymentTypeData: paymentTypeData,
    offsetTop: 0,
    detailPage: false,
    viewmore: false,
    showmore: false,
    choiced: 0,
    loading_process_btn: false,
    detailModel: {
    },
    xem_them: 'Không tìm thấy phiếu thanh toán nào',
    rulesMoney: {
      required: function (value) {
        return !!value || 'Tổng tiền bắt buộc phải nhập.'
      },
      requiredYKien: function (value) {
        return !!value || 'Ý kiến bắt buộc phải nhập.'
      },
      number: function (value) {
        var pattern = /^\d+$/
        return pattern.test(value) || 'Tổng tiền sai định dạng.'
      }
    },
    userName: '',
    actionKeToanURL: '',
    actionKeToanUpdatePaymentURL: ''
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
        if (vm.initData !== null) {
          vm.userName = vm.initData.user.userName
          vm.actionKeToanURL = vm.initData.actionKeToanURL
          vm.actionKeToanUpdatePaymentURL = vm.initData.actionKeToanUpdatePaymentURL
        }
      })
      vm.headersPayment = vm.supportData.headersPayment
      console.log('----------headersPayment++++++++++', vm.headersPayment)
      vm.paymentTypeData = vm.supportData.paymentTypeData
      vm.paymentMarkDelete = vm.supportData.paymentMarkDeleteData
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let paramFilter = {
        'markasdeleted': '0,11',
        'isAdv': true,
        'start': vm.loadHomeDataTablePagePayment * 15 - 15,
        'end': vm.loadHomeDataTablePagePayment * 15
      }
      vm.loading = true
      vm.loadingPage = true
      vm.$store.dispatch('loadHomeDataPaymentTable', paramFilter).then(function (result) {
        vm.loadHomeDataTablePayment = result
        vm.loading = false
        vm.loadingPage = false
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      console.log('vm.paymentStatus', vm.paymentStatus)
      if (vm.paymentStatus === 1 || vm.paymentStatus === '1') {
        vm.headersPayment = vm.supportData.headersPaymentView
      } else {
        vm.headersPayment = vm.supportData.headersPayment
      }
      console.log('----------headersPayment++++++++++', vm.headersPayment)
      vm.loadHomeDataTablePagePayment = 1
      if (query.hasOwnProperty('page')) {
        vm.loadHomeDataTablePagePayment = parseInt(query['page'])
      } else {
        vm.loadHomeDataTablePagePayment = 1
      }
      let paramFilter = {
        'markasdeleted': vm.paymentStatus,
        'start': vm.loadHomeDataTablePagePayment * 15 - 15,
        'end': vm.loadHomeDataTablePagePayment * 15
      }
      if (vm.paymentStatus === 0 || vm.paymentStatus === '0') {
        paramFilter['markasdeleted'] = '0,11'
      } else if (vm.paymentStatus === 1 || vm.paymentStatus === '1') {
        paramFilter['markasdeleted'] = '1,2,9,12'
      }
      if (query.hasOwnProperty('keywordsSearch')) {
        paramFilter['keywordsSearch'] = query.keywordsSearch
      }
      if (query.hasOwnProperty('positionCode')) {
        paramFilter['positionCode'] = query.positionCode
      }
      if (query.hasOwnProperty('shipName')) {
        paramFilter['shipName'] = query.shipName
      }
      if (query.hasOwnProperty('callSign')) {
        paramFilter['callSign'] = query.callSign
      }
      if (query.hasOwnProperty('imo')) {
        paramFilter['imo'] = query.imo
      }
      if (query.hasOwnProperty('stateCode')) {
        paramFilter['stateCode'] = query.stateCode
      }
      if (query.hasOwnProperty('maritimeCode')) {
        paramFilter['maritimeCode'] = query.maritimeCode
      }
      if (query.hasOwnProperty('maritimeCodeNext')) {
        paramFilter['maritimeCodeNext'] = query.maritimeCodeNext
      }
      vm.loading = true
      vm.loadingPage = true
      vm.$store.dispatch('loadHomeDataPaymentTable', paramFilter).then(function (result) {
        vm.loadHomeDataTablePayment = result
        vm.loading = false
        vm.loadingPage = false
      })
    }
  },
  methods: {
    paggingDataPayment (config) {
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
    doSelectedPaymentEdit: function (item, index) {
      let vm = this
      vm.detailModel = item
      vm.detailModel['index'] = index
      vm.choiced = item.id
      vm.dialog_edit_payment = true
    },
    doSelectedPayment: function (item, index) {
      let vm = this
      vm.detailModel = item
      vm.detailModel['index'] = index
      vm.choiced = item.id
    },
    resendNoti: function (item) {
      let vm = this
      vm.loading_process_btn = true
      let x = confirm('Bạn có muốn Gửi lại thông báo phí?')
      if (x) {
        vm.detailModel = item
        vm.popUpPaymentFileEditSave()
        vm.loading_process_btn = false
      } else {
        vm.loading_process_btn = false
        return false
      }
    },
    popUpPaymentFileEditSave: function () {
      let vm = this
      let configParam = {
      }
      let params = new FormData()
      params.append('id', vm.detailModel.id)
      params.append('DOCUMENT_NAME', vm.detailModel.documentName)
      params.append('DOCUMENT_YEAR', vm.detailModel.documentYear)
      params.append('totalpayment', vm.detailModel.totalpayment)
      params.append('ykienReject', vm.detailModel.comments)
      params.append('currency', vm.currency)
      axios.post(
        vm.actionKeToanUpdatePaymentURL,
        params,
        configParam
      ).then(function (response) {
        toastr.success('Yêu cầu của bạn được thực hiện thành công.')
      }).catch(function (error) {
        toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
        console.log(error)
      })
      vm.popUpPaymentFileEdit = false
    },
    toViewDetail (item) {
      let vm = this
      vm.$router.push('/ho-so/ke_toan/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/0')
    },
    filterByKeyWordOBJ (event) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      if (event.keyCode === 13 || vm.keywordsSearch.length === 0) {
        let queryString = '?'
        newQuery['page'] = ''
        newQuery['keywordsSearch'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'keywordsSearch=' + vm.keywordsSearch + '&'
        queryString += 'page=' + 1
        vm.$router.push({
          path: current.path + queryString
        })
      }
    },
    paymentConfirmAction: function () {
      let vm = this
      let documentN = vm.detailModel['documentName']
      if (typeof documentN === undefined || documentN === 'undefined' || documentN === undefined) {
        alert('Chưa chọn phiếu thanh toán nào?. ')
        return
      }
      let labelBtn = 'Xác nhận'
      let dateConfirmPayment = new Date()
      let month = dateConfirmPayment.getMonth() + 1
      let day = dateConfirmPayment.getDate()
      let year = dateConfirmPayment.getFullYear()
      let typePaymentStr = (String(vm.paymentMethodSearch) === '0') ? 'Tiền mặt' : 'Chuyển khoản'
      let dialogContent = '<strong>Ngày xác nhận thu phí: </strong> ' + day + '/' + month + '/' + year + ' <br/>'
      dialogContent += '<strong>Người thực hiện: </strong> ' + vm.userName + ' <br/>'
      dialogContent += '<strong>Hình thức thanh toán: </strong> ' + typePaymentStr + ' <br/>'
      dialogContent += '<strong>Xác nhận thu phí cho: </strong> ' + vm.detailModel['documentName'] + ' . <br/>'
      vm.$dialog.confirm(dialogContent, {
        html: true,
        loader: true,
        okText: labelBtn,
        cancelText: 'Quay lại',
        animation: 'fade'
      })
      .then(function (dialog) {
        var configParam = {}
        var params = new FormData()
        params.append('DOCUMENT_NAME', vm.detailModel.documentName)
        params.append('DOCUMENT_YEAR', vm.detailModel.documentYear)
        params.append('paymenttype', vm.paymentMethodSearch)
        axios.post(
          vm.actionKeToanURL,
          params,
          configParam
        ).then(function (response) {
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          queryString += 'reNew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
          vm.$router.push({
            path: current.path + queryString
          })
        }).catch(function (error) {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          console.log(error)
        })
        dialog.close()
      })
      .catch(function (e) {
        console.log('process aborted')
      })
    },
    doSaveData () {
      let vm = this
      if (vm.$refs.formEditPayment.validate()) {
        vm.loadingAction = true
        let configParam = {}
        let params = new FormData()
        params.append('id', vm.detailModel.id)
        params.append('DOCUMENT_NAME', vm.detailModel.documentName)
        params.append('DOCUMENT_YEAR', vm.detailModel.documentYear)
        params.append('totalpayment', vm.detailModel.totalpayment)
        params.append('ykienReject', vm.detailModel.comments)
        params.append('currency', vm.currency)
        axios.post(
          vm.actionKeToanUpdatePaymentURL,
          params,
          configParam
        ).then(function (response) {
          vm.loadingAction = false
          toastr.success('Yêu cầu của bạn được thực hiện thành công.')
          let current = vm.$router.history.current
          let newQuery = current.query
          let queryString = '?'
          for (let key in newQuery) {
            if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
              queryString += key + '=' + newQuery[key] + '&'
            }
          }
          queryString += 'reNew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
          vm.$router.push({
            path: current.path + queryString
          })
        }).catch(function (error) {
          toastr.error('Yêu cầu của bạn được thực hiện thất bại.')
          console.log(error)
          vm.loadingAction = false
        })
        vm.dialog_edit_payment = false
      }
    }
  },
  filters: {
    moneyView (arg) {
      if (arg !== '') {
        return (arg / 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      } else {
        return '0'
      }
    }
  }
}
</script>
