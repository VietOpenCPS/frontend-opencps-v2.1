<template>
  <div style="width: 100%; position: relative;" class="filter__adv_class">
    <v-switch :label="supportData.langUI[type]" v-model="switch1" hide-details
    @change="changeType"
    style="position: absolute;
    left: 125px;
    top: 8px;
    width: 150px;
    z-index: 10;"
    ></v-switch>
    <v-expansion-panel class="my-0">
      <v-expansion-panel-content v-bind:value="false">
        <div slot="header">Danh sách hồ sơ: <span class="text-bold primary--text"> {{status_label}} </span></div>
        <div slot="header" class="text-bold primary--text text-right">Tìm kiếm nâng cao</div>
        <v-card>
          <v-card-title class="pt-0 px-0 adv__search__container">
            <v-layout wrap>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0">Cảng vụ:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0">
                <v-subheader class="pl-0" v-if="!roleBGTVT">{{cang_vu_label}}</v-subheader>
                <v-select v-else
                  v-model="maritimeCodeOwner"
                  autocomplete
                  combobox
                  :items="maritimeCodes"
                  return-object
                  item-text="name"
                  item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pr-0">Tàu đến/rời:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0">
                <v-select
                  v-model="positionCode"
                  autocomplete
                  combobox
                  :items="positionCodes"
                  return-object
                  item-text="name"
                  item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pr-0">IMO:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="pl-0">
                <v-text-field
                  v-model="imo"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pl-0">Quốc tịch:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0">
                <v-select
                  v-model="stateCode"
                  autocomplete
                  combobox
                  :items="stateCodes"
                  return-object
                  item-text="name"
                  item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pr-0">Khu vực cảng:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0">
                <v-select
                  v-model="maritimeCode"
                  autocomplete
                  combobox
                  :items="maritimeCodes"
                  return-object
                  item-text="name"
                  item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pr-0">Cảng tiếp theo:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="pl-0">
                <v-select
                  v-model="maritimeCodeNext"
                  autocomplete
                  combobox
                  :items="maritimeCodesTiepTheos"
                  return-object
                  item-text="name"
                  item-value="code"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm2 class="pr-0">
                <v-subheader class="px-0">Thời gian tàu (từ):</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0 layout wrap">
                <datetime-picker
                  v-model="date"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
              </v-flex>
              <v-flex xs12 sm2 class="pr-0">
                <v-subheader class="pr-0">Ngày nộp (từ):</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0 layout wrap">
                <datetime-picker
                  v-model="date3"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
              </v-flex>
              <v-flex xs12 sm2>
                <v-subheader class="pr-0">Đại lý đến:</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="pl-0">
                <v-text-field
                  v-model="daily"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2 class="pr-0">
                <v-subheader class="px-0">Thời gian tàu (đến):</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0 layout wrap">
                <datetime-picker
                  v-model="date2"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
              </v-flex>
              <v-flex xs12 sm2 class="pr-0">
                <v-subheader class="pr-0">Ngày nộp (đến):</v-subheader>
              </v-flex>
              <v-flex xs12 sm2 class="px-0 layout wrap">
                <datetime-picker
                  v-model="date4"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
              </v-flex>
              <v-flex xs12 class="mt-2">
                <v-btn color="grey lighten-1" class="mx-0 mt-3" v-on:click.native="filterAdvSearch">
                  Tìm kiếm
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import moment from 'moment'
import router from '@/router'
import supportData from '../../store/support_data.json'
import DatetimePicker from './DatetimePicker.vue'
const COMPONENT_NAME = 'jx-hanghai-filter-adv'

export default {
  name: COMPONENT_NAME,
  components: {
    'datetime-picker': DatetimePicker
  },
  props: {
    name: String,
    group_id: 0,
    detail_tp: {},
    filter_adv_api: '',
    type: '',
    document_type_code: '',
    document_status_code: '',
    cang_vu_name: '',
    tau_den_rois: [],
    quoc_tichs: [],
    khu_cuc_cangs: [],
    cang_den_tiep_theos: []
  },
  data () {
    return {
      supportData: supportData,
      switch1: true,
      shipName: '',
      imo: '',
      daily: '',
      shipDateFrom: new Date(),
      shipDateTo: new Date(),
      createDateFrom: new Date(),
      createDateTo: new Date(),
      maritimeCodes: [],
      maritimeCodesTiepTheos: [],
      positionCodes: [],
      stateCodes: [],
      maritimeCode: null,
      maritimeCodeNext: null,
      positionCode: null,
      stateCode: null,
      status_label: '',
      date: null,
      menu: false,
      date2: null,
      menu2: false,
      date3: null,
      menu3: false,
      date4: null,
      menu4: false,
      cang_vu_label: '',
      maritimeCodeOwner: null
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    computedDate2Formatted () {
      return this.formatDate(this.date2)
    },
    computedDate3Formatted () {
      return this.formatDate(this.date3)
    },
    computedDate4Formatted () {
      return this.formatDate(this.date4)
    }
  },
  methods: {
    filterAdvSearch: function () {
      let vm = this
      let maritimeCodeOwnerStr = ''
      let positionCodeStr = ''
      let stateCodeStr = ''
      let maritimeCodeStr = ''
      let maritimeCodeNextStr = ''

      if (vm.maritimeCodeOwner) {
        maritimeCodeOwnerStr = vm.maritimeCodeOwner.code
      }
      if (vm.positionCode) {
        positionCodeStr = vm.positionCode.code
      }
      if (vm.stateCode) {
        stateCodeStr = vm.stateCode.code
      }
      if (vm.maritimeCode) {
        maritimeCodeStr = vm.maritimeCode.code
      }
      if (vm.maritimeCodeNext) {
        maritimeCodeNextStr = vm.maritimeCodeNext.code
      }

      router.push({
        path: '/danh-sach-ho-so/' + vm.type + '/' + vm.document_type_code + '/' + vm.document_status_code,
        query: {
          'adv': true,
          'maritimeCodeOwner': maritimeCodeOwnerStr,
          'positionCode': positionCodeStr,
          'imo': vm.imo,
          'stateCode': stateCodeStr,
          'maritimeCode': maritimeCodeStr,
          'maritimeCodeNext': maritimeCodeNextStr,
          'timeShip': vm.computedDateFormatted + ',' + vm.computedDate2Formatted,
          'timeSend': vm.computedDate3Formatted + ',' + vm.computedDate4Formatted,
          'daily': vm.daily,
          'page': 1,
          'isNew': Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    dateTimeCustomPicker: function (value) {
      console.log(value)
    },
    changeType (val) {
      let currentUrl = this.$router.history.current.path
      if (this.type === 'ke_hoach') {
        currentUrl = currentUrl.replace('ke_hoach', 'thu_tuc')
        router.push(currentUrl)
      } else {
        currentUrl = currentUrl.replace('thu_tuc', 'ke_hoach')
        router.push(currentUrl)
      }
    },
    bindData (serializable) {
      let vm = this
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
    },
    formatDate (date) {
      if (date === null || date === undefined || date === '') return ''
      return moment(date, 'DD/MM/YYYY HH:mm').toDate().getTime()
    }
  }
}
</script>
