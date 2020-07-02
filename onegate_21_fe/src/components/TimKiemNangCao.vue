<template>
  <div class="adv_search px-2 mt-2 mx-2" style="background: #eeeeee">
    <div class="searchAdvanced-content py-2">
      <v-layout wrap>
        <v-flex xs12 sm6 md4 class="mb-2 px-2">
          <div>
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Trạng thái:</div>
            <v-autocomplete
              class="select-search d-inline-block"
              style="width: calc(100% - 130px);"
              :items="statusItems"
              v-model="status"
              item-text="itemName"
              item-value="itemCode"
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-autocomplete>
          </div>
        </v-flex>
        <v-flex xs12 sm6 md4 class="mb-2 px-2">
          <div>
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Trạng thái con:</div>
            <v-autocomplete
              class="select-search d-inline-block"
              style="width: calc(100% - 130px);"
              :items="substatusItems"
              v-model="substatus"
              item-text="itemName"
              item-value="itemCode"
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-autocomplete>
          </div>
        </v-flex>
        <v-flex xs12 sm6 md4 class="mb-2 px-2">
          <div>
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Theo tình trạng:</div>
            <v-autocomplete
              class="select-search d-inline-block"
              style="width: calc(100% - 130px);"
              :items="topItems"
              v-model="top"
              item-text="text"
              item-value="value"
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-autocomplete>
          </div>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm6 md4 class="mb-2 px-2">
          <div>
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Đơn vị:</div>
            <v-autocomplete
              class="select-search d-inline-block"
              style="width: calc(100% - 130px);"
              :items="agencyItems"
              v-model="agency"
              item-text="administrationName"
              item-value="administrationCode"
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-autocomplete>
          </div>
        </v-flex>
        <v-flex xs12 sm6 md4 class="mb-2 px-2">
          <div v-if="menuInfo.id !== 'CV_DI' && menuInfo.id !== 'CV_DEN'">
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Lĩnh vực:</div>
            <v-autocomplete
              class="select-search d-inline-block"
              style="width: calc(100% - 130px);"
              :items="domainItems"
              v-model="domain"
              item-text="domainName"
              item-value="domainCode"
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-autocomplete>
          </div>
          <div v-else>
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Số công văn:</div>
            <v-text-field
              v-model="documentNo"
              class="search-input-appbar input-search d-inline-block"
              style="width: calc(100% - 130px);"
              single-lines
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-text-field>
          </div>
        </v-flex>
        <v-flex xs12 sm6 md4 class="mb-2 px-2">
          <div v-if="menuInfo.id !== 'CV_DI' && menuInfo.id !== 'CV_DEN'">
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Mã sổ theo dõi:</div>
            <v-text-field
              v-model="register"
              class="search-input-appbar input-search d-inline-block"
              style="width: calc(100% - 130px);"
              single-lines
              hide-details
              solo
              flat
              height="32"
              min-height="32"
              clearable
            ></v-text-field>
          </div>
          <div v-else>
            <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Ngày công văn:</div>
            <div class="d-inline-block" style="width: calc(100% - 130px);">
              <v-menu
                ref="menuDateCV"
                v-model="menuDateCV"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
              >
                <v-text-field
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="dateCvFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="dateCv = parseDate(dateCvFormatted)"
                  placeholder=""
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                >
                </v-text-field>
                <v-date-picker v-model="dateCv" locale="vi" :first-day-of-week="1" no-title @input="changeDate('9')"></v-date-picker>
              </v-menu>
            </div>
          </div>
        </v-flex>
        <!-- date -->
        <v-flex xs12 md6 class="mb-2 px-2">
          <div class="layout wrap">
            <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 130px;">Ngày tiếp nhận:</div>
            <v-layout wrap style="width: calc(100% - 130px);">
              <v-flex xs6>
                <v-menu
                  ref="menuDate1"
                  v-model="menuDate1"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <v-text-field
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="fromReceiveDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="fromReceiveDate = parseDate(fromReceiveDateFormatted)"
                  placeholder="Từ ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  append-outer-icon="remove"
                  clearable
                  >
                    <template slot='append-outer'>
                      <v-icon color="primary">remove</v-icon>
                    </template>
                  </v-text-field>
                  <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : null" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('1')"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs6 class="pl-2">
                <v-menu
                  ref="menuDate2"
                  v-model="menuDate2"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >

                  <v-text-field
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="toReceiveDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="toReceiveDate = parseDate(toReceiveDateFormatted)"
                  placeholder="Đến ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                  ></v-text-field>
                  <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('2')"></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
            
          </div>
        </v-flex>
        <v-flex xs12 md6 class="mb-2 px-2">
          <div class="layout wrap">
            <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 130px;">Ngày hẹn trả:</div>
            <v-layout wrap style="width: calc(100% - 130px);">
              <v-flex xs6>
                <v-menu
                  ref="menuDate3"
                  v-model="menuDate3"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >

                  <v-text-field
                  class="search-input-appbar input-search"
                  v-model="fromDueDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="fromDueDate = parseDate(fromDueDateFormatted)"
                  slot="activator"
                  placeholder="Từ ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                  >
                    <template slot='append-outer'>
                      <v-icon color="primary">remove</v-icon>
                    </template>
                  </v-text-field>
                  <v-date-picker :max="toDueDateFormatted ? getMinMax(toDueDateFormatted) : null" v-model="fromDueDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('3')"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs6 class="pl-2">
                <v-menu
                ref="menuDate4"
                v-model="menuDate4"
                :close-on-content-click="true"
                transition="scale-transition"
                offset-y
                full-width
              >

                <v-text-field
                slot="activator"
                class="search-input-appbar input-search"
                v-model="toDueDateFormatted"
                persistent-hint
                append-icon="event"
                @blur="toDueDate = parseDate(toDueDateFormatted)"
                placeholder="Đến ngày"
                hide-details
                solo
                flat
                height="32"
                min-height="32"
                clearable
                ></v-text-field>
                <v-date-picker :min="fromDueDateFormatted ? getMinMax(fromDueDateFormatted) : null" v-model="toDueDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('4')"></v-date-picker>
              </v-menu>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>

        <v-flex xs12 md6 class="mb-2 px-2">
          <div class="layout wrap">
            <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 130px;">Ngày có kết quả:</div>
            <v-layout wrap style="width: calc(100% - 130px);">
              <v-flex xs6>
                <v-menu
                  ref="menuDate5"
                  v-model="menuDate5"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <v-text-field
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="fromReleaseDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="fromReleaseDate = parseDate(fromReleaseDateFormatted)"
                  placeholder="Từ ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                  >
                    <template slot='append-outer'>
                      <v-icon color="primary">remove</v-icon>
                    </template>
                  </v-text-field>
                  <v-date-picker :max="toReleaseDateFormatted ? getMinMax(toReleaseDateFormatted) : null" v-model="fromReleaseDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('5')"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs6 class="pl-2">
                <v-menu
                  ref="menuDate6"
                  v-model="menuDate6"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >

                  <v-text-field
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="toReleaseDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="toReleaseDate = parseDate(toReleaseDateFormatted)"
                  placeholder="Đến ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                  ></v-text-field>
                  <v-date-picker :min="fromReleaseDateFormatted ? getMinMax(fromReleaseDateFormatted) : null" v-model="toReleaseDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('6')"></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>

          </div>
        </v-flex>
        <v-flex xs12 md6 class="mb-2 px-2">
          <div class="layout wrap">
            <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 130px;">Ngày trả hồ sơ:</div>
            <v-layout wrap style="width: calc(100% - 130px);">
              <v-flex xs6>
                <v-menu
                  ref="menuDate7"
                  v-model="menuDate7"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >
                  <v-text-field
                  class="search-input-appbar input-search"
                  v-model="fromFinishDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="fromFinishDate = parseDate(fromFinishDateFormatted)"
                  slot="activator"
                  placeholder="Từ ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                  >
                    <template slot='append-outer'>
                      <v-icon color="primary">remove</v-icon>
                    </template>
                  </v-text-field>
                  <v-date-picker :max="toFinishDateFormatted ? getMinMax(toFinishDateFormatted) : null" v-model="fromFinishDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('7')"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs6 class="pl-2">
                <v-menu
                  ref="menuDate8"
                  v-model="menuDate8"
                  :close-on-content-click="true"
                  transition="scale-transition"
                  offset-y
                  full-width
                >

                  <v-text-field
                  slot="activator"
                  class="search-input-appbar input-search"
                  v-model="toFinishDateFormatted"
                  persistent-hint
                  append-icon="event"
                  @blur="toFinishDate = parseDate(toFinishDateFormatted)"
                  placeholder="Đến ngày"
                  hide-details
                  solo
                  flat
                  height="32"
                  min-height="32"
                  clearable
                  ></v-text-field>
                  <v-date-picker :min="fromFinishDateFormatted ? getMinMax(fromFinishDateFormatted) : null" v-model="toFinishDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('8')"></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
        <!--  -->
      </v-layout>
      
      <v-flex class="xs12 mx-2">
        <v-btn class="mx-0 mb-0" color="primary" dark @click.native="submitAdvSearch">
          <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
        </v-btn>
      </v-flex>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['menuInfo'],
  components: {},
  data: () => ({
    advSearchShow: false,
    itemsFilter: [],
    keyFilterItems: [],
    menuDate1: false,
    menuDate2: false,
    menuDate3: false,
    menuDate4: false,
    menuDate5: false,
    menuDate6: false,
    menuDate7: false,
    menuDate8: false,
    menuDateCV: false,
    dateCvFormatted: '',
    dateCv: '',
    fromReceiveDate: '',
    fromReceiveDateFormatted: '',
    toReceiveDate: '',
    toReceiveDateFormatted: '',
    fromDueDate: '',
    fromDueDateFormatted: '',
    toDueDate: '',
    toDueDateFormatted: '',
    fromReleaseDate: '',
    fromReleaseDateFormatted: '',
    toReleaseDate: '',
    toReleaseDateFormatted: '',
    fromFinishDate: '',
    fromFinishDateFormatted: '',
    toFinishDate: '',
    toFinishDateFormatted: '',
    statusItems: [],
    status: '',
    substatusItems: [],
    substatus: '',
    agencyItems: [],
    agency: '',
    domainItems: [],
    domain: '',
    topItems: [
      {
        'value': 'overdue',
        'text': 'Đang quá hạn'
      },
      {
        'value': 'delay',
        'text': 'Chậm hạn trả'
      },
      {
        'value': 'coming',
        'text': 'Sắp đến hạn'
      }
    ],
    top: '',
    register: '',
    documentNo: ''
  }),
  computed: {
  },
  created () {
    let vm = this
    vm.getSearchItems()
    console.log('menuInfo', vm.menuInfo)
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      vm.getSearchItems()
    },
    menuInfo (val) {
      console.log('menuInfo', val)
    }
  },
  methods: {
    setShow(show) {
      let vm = this
      vm.advSearchShow = show
      if (!vm.statusItems || vm.statusItems.length === 0) {
        vm.$store.dispatch('getStatusLists').then(function (result) {
          let statusDeleted = {
            itemCode: 'deleted',
            itemName: 'Đã xóa'
          }
          if (vm.getUser('Administrator') || vm.getUser('Administrator_data')) {
            result.push(statusDeleted)
          }
          vm.statusItems = result
        }).catch(function (){})
      }
      if (!vm.substatusItems || vm.substatusItems.length === 0) {
        let filter = {
          itemCode: ''
        }
        vm.$store.dispatch('getSubstatusLists', filter).then(function (result) {
          vm.substatusItems = result
        }).catch(function (){})
      }
      if (!vm.agencyItems || vm.agencyItems.length === 0) {
        vm.$store.dispatch('getAgencyLists').then(function (result) {
          vm.agencyItems = result
        }).catch(function (){})
      }
      if (!vm.domainItems || vm.domainItems.length === 0) {
        vm.$store.dispatch('getDomainLists').then(function (result) {
          vm.domainItems = result
        }).catch(function (){})
      }
    },
    getSearchItems() {
      let vm = this
      let newQuery = vm.$router.history.current.query
      console.log('newQuery', newQuery)
      vm.status = newQuery.hasOwnProperty('status') ? newQuery.status : ''
      vm.substatus = newQuery.hasOwnProperty('substatus') ? newQuery.substatus : ''
      vm.top = newQuery.hasOwnProperty('top') ? newQuery.top : ''
      vm.agency = newQuery.hasOwnProperty('agency') ? newQuery.agency : ''
      vm.domain = newQuery.hasOwnProperty('domain') ? newQuery.domain : ''
      vm.register = newQuery.hasOwnProperty('register') ? newQuery.register : ''

      vm.fromReceiveDate = newQuery.hasOwnProperty('fromReceiveDate') ? vm.parseDate(newQuery.fromReceiveDate) : ''
      vm.toReceiveDate = newQuery.hasOwnProperty('toReceiveDate') ? vm.parseDate(newQuery.toReceiveDate) : ''
      vm.fromDueDate = newQuery.hasOwnProperty('fromDueDate') ? vm.parseDate(newQuery.fromDueDate) : ''
      vm.toDueDate = newQuery.hasOwnProperty('toDueDate') ? vm.parseDate(newQuery.toDueDate) : ''
      vm.fromReleaseDate = newQuery.hasOwnProperty('fromReleaseDate') ? vm.parseDate(newQuery.fromReleaseDate) : ''
      vm.toReleaseDate = newQuery.hasOwnProperty('toReleaseDate') ? vm.parseDate(newQuery.toReleaseDate) : ''
      vm.fromFinishDate = newQuery.hasOwnProperty('fromFinishDate') ? vm.parseDate(newQuery.fromFinishDate) : ''
      vm.toFinishDate = newQuery.hasOwnProperty('toFinishDate') ? vm.parseDate(newQuery.toFinishDate) : ''
      vm.dateCv = newQuery.hasOwnProperty('dateCv') ? vm.parseDate(newQuery.dateCv) : ''

      vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
      vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
      vm.fromDueDateFormatted = vm.formatDate(vm.fromDueDate)
      vm.toDueDateFormatted= vm.formatDate(vm.toDueDate)
      vm.fromReleaseDateFormatted= vm.formatDate(vm.fromReleaseDate)
      vm.toReleaseDateFormatted= vm.formatDate(vm.toReleaseDate)
      vm.fromFinishDateFormatted= vm.formatDate(vm.fromFinishDate)
      vm.toFinishDateFormatted= vm.formatDate(vm.toFinishDate)

      vm.dateCvFormatted = vm.formatDate(vm.dateCv)
    },
    submitAdvSearch () {
      let vm = this
      // vm.selectMultiplePage = []
      console.log('fromReceiveDate', vm.fromReceiveDate, vm.toReceiveDate)
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['status'] = vm.status
      newQuery['substatus'] = vm.substatus
      newQuery['top'] = vm.top
      newQuery['agency'] = vm.agency
      newQuery['domain'] = vm.domain
      newQuery['register'] = vm.register
      newQuery['documentNo'] = vm.documentNo ? vm.documentNo : ''

      newQuery['fromReceiveDate'] = vm.formatDate(vm.fromReceiveDate)
      newQuery['toReceiveDate'] = vm.formatDate(vm.toReceiveDate)
      newQuery['fromDueDate'] = vm.formatDate(vm.fromDueDate)
      newQuery['toDueDate'] = vm.formatDate(vm.toDueDate)
      newQuery['fromReleaseDate'] = vm.formatDate(vm.fromReleaseDate)
      newQuery['toReleaseDate'] = vm.formatDate(vm.toReleaseDate)
      newQuery['fromFinishDate'] = vm.formatDate(vm.fromFinishDate)
      newQuery['toFinishDate'] = vm.formatDate(vm.toFinishDate)
      newQuery['dateCv'] = vm.formatDate(vm.dateCv)

      console.log('newQuery', newQuery)
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== 'adv_renew') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'adv_renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
      queryString = queryString.replace(/=__/g, '=')
      vm.$router.push({
        path: current.path + queryString
      })
    },
    changeDate(index) {
      let vm = this
      vm.menuDate = vm.menuDate2 = vm.menuDate3 = vm.menuDate4 = vm.menuDateCV = false
      if (index === '1') {
        vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
      } else if (index === '2') {
        vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
      } else if (index === '3') {
        vm.fromDueDateFormatted = vm.formatDate(vm.fromDueDate)
      } else if (index === '4') {
        vm.toDueDateFormatted= vm.formatDate(vm.toDueDate)
      } else if (index === '5') {
        vm.fromReleaseDateFormatted= vm.formatDate(vm.fromReleaseDate)
      } else if (index === '6') {
        vm.toReleaseDateFormatted= vm.formatDate(vm.toReleaseDate)
      } else if (index === '7') {
        vm.fromFinishDateFormatted= vm.formatDate(vm.fromFinishDate)
      } else if (index === '8') {
        vm.toFinishDateFormatted= vm.formatDate(vm.toFinishDate)
      } else if (index === '9') {
        vm.dateCvFormatted = vm.formatDate(vm.dateCv)
      }
    },
    formatDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate(date) {
      if (!date) return ''
      if (String(date).indexOf('/') > 0) {
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else if (String(date).indexOf('-') > 0) {
        const [day, month, year] = date.split('-')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      } else {
        let date1 = new Date(Number(date))
        return `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')}`
      }
    },
    getUser (roleItem) {
      let vm = this
      let roles = vm.$store.getters.getUser.role
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)
    },
    getMinMax (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
    }
  }
};
</script>
