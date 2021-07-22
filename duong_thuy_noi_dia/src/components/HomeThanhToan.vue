<template>
  <div>
    <v-navigation-drawer class="px-0 py-0 ke__toan_nav" app clipped floating width="250">
      <div class="flex xs12 ">
        <div class="row-header layout" style="background-color: #e1e2e1;height: 38px;overflow: hidden;"><div class="background-triangle-big" style="max-width: 90px;padding: 10px 0px 10px 10px;"> TRẠNG THÁI </div> 
        <div class="layout row wrap header_tools row-blue px-0">
        <a class="text-bold primary--text text-right" style="color: #1976D2 !important;" @click="isAdv = !isAdv">
          Tìm kiếm nâng cao
          <v-icon size="16" color="primary" v-if="!isAdv">expand_more</v-icon>
          <v-icon size="16" color="primary" v-else>expand_less</v-icon>
        </a>
        </div></div>
      </div>
      <div class="layout row wrap px-2" v-if="isAdv">
        <v-flex xs12 class="px-0" style="position: absolute;width: 94%;">
          <v-subheader class="pl-0 text-bold" style="height: 36px;">Cảng vụ: {{cang_vu_label}}</v-subheader>
        </v-flex>
        <v-flex xs12 class="px-0 mt-4">
            <v-select
              label="Tàu đến/rời:"
              v-model="positionCode"
              autocomplete
              :items="positionCodes"
              item-text="name"
              item-value="code"
            ></v-select>
          </v-flex>
          <v-flex xs12 class="pl-0">
            <v-text-field
              label="Tên tàu:"
              v-model="shipName"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="pl-0">
            <v-text-field
              label="Hô hiệu:"
              v-model="callSign"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="pl-0">
            <v-text-field
              label="IMO:"
              v-model="imo"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="pl-0">
          <v-select
            label="Quốc tịch:"
              v-model="stateCode"
              autocomplete
              :items="stateCodes"
              item-text="name"
              item-value="code"
            ></v-select>
            </v-flex>
            <v-flex xs12 class="pl-0">
          <v-select
          label="Khu vực cảng:"
              v-model="maritimeCode"
              autocomplete
              :items="maritimeCodes"
              item-text="name"
              item-value="code"
            ></v-select>
            </v-flex>
          <v-flex xs12 class="pl-0">
            <v-select
            label="Cảng tiếp theo:"
              v-model="maritimeCodeNext"
              autocomplete
              :items="maritimeCodesTiepTheos"
              item-text="name"
              item-value="code"
            ></v-select>
          </v-flex>
		</div>
    <v-list-tile class="pl-2 ke__toan_tilte_menu" @click="filterByStatus(0)">

      <v-list-tile-action> 
        <v-icon color="primary">folder</v-icon> 
      </v-list-tile-action>

      <v-list-tile-content> 
        <v-list-tile-title>Xác nhận thanh toán </v-list-tile-title>  
      </v-list-tile-content>

      <v-list-tile-action class="mr-2"> <v-icon>search</v-icon> </v-list-tile-action>

    </v-list-tile>

    <v-list-tile class="pl-2 ke__toan_tilte_menu" @click="filterByStatus(1)">

      <v-list-tile-action> 
        <v-icon color="primary">folder</v-icon> 
      </v-list-tile-action>

      <v-list-tile-content> 
        <v-list-tile-title>Đã xử lý </v-list-tile-title>  
      </v-list-tile-content>

      <v-list-tile-action class="mr-2"> <v-icon>search</v-icon> </v-list-tile-action>

    </v-list-tile>

    </v-navigation-drawer>

    <router-view></router-view>
    
  </div>
</template>

<script>
import FilterLeft from './hang_hai/hanghai_filter_left.vue'
import FilterADV from './hang_hai/hanghai_filter_adv.vue'
// import supportData from '../store/support_data.json'
import axios from 'axios'

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
var getFilterADVDataAPI = ''

export default {
  props: ['paymentStatus'],
  components: {
    'jx-hanghai-filter-left': FilterLeft,
    'jx-hanghai-filter-adv': FilterADV
  },
  data: () => ({
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
    getFilterADVDataAPI: getFilterADVDataAPI,
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
      number: function (value) {
        var pattern = /^\d+$/
        return pattern.test(value) || 'Tổng tiền sai định dạng.'
      }
    }
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        let initData = result
        axios.get(
          initData.getFilterADVDataAPI
        ).then(function (response) {
          let serializable = response.data
          vm.maritimeCodes = serializable.cang_vu_list
          vm.maritimeCodesTiepTheos = serializable.cang_tiep_theo
          vm.positionCodes = serializable.tau_den_roi_list
          vm.stateCodes = serializable.quoc_tich_list
          vm.cang_vu_label = serializable.cang_vu_label

          vm.maritimeCodesTiepTheos.unshift({
            'code': '',
            'name': 'Toàn bộ'
          })
          vm.maritimeCodes.unshift({
            'code': '',
            'name': 'Toàn bộ'
          })
          vm.positionCodes.unshift({
            'code': '',
            'name': 'Toàn bộ'
          })
          vm.stateCodes.unshift({
            'code': '',
            'name': 'Toàn bộ'
          })
        }).catch(function (error) {
          console.log(error)
        })
      })
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
      if (vm.callBack) {
        vm.callBack = false
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
    }
  },
  methods: {
    filterByStatus (data) {
      console.log('data', data)
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['reNew'] = ''
      newQuery['page'] = ''
      newQuery['positionCode'] = ''
      newQuery['shipName'] = ''
      newQuery['callSign'] = ''
      newQuery['imo'] = ''
      newQuery['stateCode'] = ''
      newQuery['maritimeCode'] = ''
      newQuery['maritimeCodeNext'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (vm.positionCode !== null && vm.positionCode !== undefined && vm.positionCode !== '') {
        queryString += 'positionCode=' + vm.positionCode + '&'
      } else {
        queryString += 'positionCode=&'
      }
      queryString += 'shipName=' + vm.shipName + '&'
      queryString += 'callSign=' + vm.callSign + '&'
      queryString += 'imo=' + vm.imo + '&'
      if (vm.stateCode !== null && vm.stateCode !== undefined && vm.stateCode !== '') {
        queryString += 'stateCode=' + vm.stateCode + '&'
      } else {
        queryString += 'stateCode=&'
      }
      if (vm.maritimeCode !== null && vm.maritimeCode !== undefined && vm.maritimeCode !== '') {
        queryString += 'maritimeCode=' + vm.maritimeCode + '&'
      } else {
        queryString += 'maritimeCode=&'
      }
      if (vm.maritimeCodeNext !== null && vm.maritimeCodeNext !== undefined && vm.maritimeCodeNext !== '') {
        queryString += 'maritimeCodeNext=' + vm.maritimeCodeNext + '&'
      } else {
        queryString += 'maritimeCodeNext=&'
      }
      queryString += 'reNew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1 + '&' + 'page=1'
      vm.$router.push({
        path: '/danh-sach-phieu-thanh-toan/ke_toan/' + data + queryString
      })
    }
  }
}
</script>
