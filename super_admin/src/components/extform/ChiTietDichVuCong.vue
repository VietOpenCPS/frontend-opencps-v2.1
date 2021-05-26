<template>
  <div style="margin: 0 auto;">
    <v-card class="mb-3 mt-2">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-btn dark icon>
          <v-icon>api</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          <span v-if="id != '0'">Cập nhật dịch vụ công</span>
          <span v-else>Thêm mới dịch vụ công</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="py-0 px-0">
      <div>
        <v-form ref="formAddServiceConfig" class="px-0 mb-5" v-model="validFormAddServiceConfig" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm6 class="pr-2 mb-2">
              <v-autocomplete
                box
                :items="govAgencyList"
                v-model="govAgencyFilter"
                item-text="itemName"
                item-value="itemCode"
                :rules="[rules.required]"
                required
                :hide-selected="true"
                clearable
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex v-if="!data.item.parentItem" xs12 class="v-list__tile__title">{{data.item.itemName}}</v-flex>
                  <v-flex v-else xs12 class="v-list__tile__title">
                    {{data.item.itemName}} - {{data.item.parentItem.itemName.replace('UBND', '')}}
                  </v-flex>
                </template>
                <template slot="label">Đơn vị thực hiện <span class="red--text darken-3">*</span></template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm6 class="pl-2 mb-2">
              <v-autocomplete
                box
                :items="levelList"
                v-model="levelFilter"
                item-text="levelName"
                item-value="level"
                :rules="[rules.required]"
                required
                :hide-selected="true"
                clearable
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex xs12>{{data.item.levelName}}</v-flex>
                </template>
                <template slot="label">Mức độ <span class="red--text darken-3">*</span></template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 class="mb-2">
              <v-autocomplete
                box
                :items="domainList"
                v-model="domainFilter"
                item-text="domainName"
                item-value="domainCode"
                clearable
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex xs12 class="v-list__tile__title">{{data.item.domainCode}} - {{data.item.domainName}}</v-flex>
                </template>
                <template slot="label">Lĩnh vực hành chính</template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 class="mb-2">
              <v-autocomplete
                box
                :items="serviceInfoList"
                v-model="serviceFilter"
                item-text="serviceName"
                item-value="serviceInfoId"
                :rules="[rules.required]"
                required
                clearable
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex xs12 class="v-list__tile__title">{{data.item.serviceCode}} - {{data.item.serviceName}}</v-flex>
                </template>
                <template slot="label">Thủ tục hành chính <span class="red--text darken-3">*</span></template>
              </v-autocomplete>
            </v-flex>
            
            <v-flex xs12>
              <v-subheader class="px-0">Hướng dẫn làm thủ tục hành chính tại cơ quan</v-subheader>
              <codemirror v-if="reRender" v-model="serviceInstruction" :options="cmOptions"></codemirror>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <v-textarea
                v-model="serviceUrl"
                placeholder="Đường dẫn dạng : https://www.abc.com"
                box 
                clearable
                :rules="[rules.syntaxError, rules.varchar2000]"
                :maxlength="2000"
                :counter="2000"
              >
                <template slot="label">Địa chỉ nộp hồ sơ trực tuyến</template>
              </v-textarea>
            </v-flex>
            <v-flex xs12 sm6>
              <v-switch class="" label="Dịch vụ công dành cho công dân" v-model="forCitizen"></v-switch>
            </v-flex>
            <v-flex xs12 sm6>
              <v-switch class="" label="Dịch vụ công dành cho doanh nghiệp" v-model="forBusiness"></v-switch>
            </v-flex>
            <v-flex xs12 sm6>
              <v-switch class="" label="Áp dụng phương thức nộp bưu điện" v-model="postalService"></v-switch>
            </v-flex>
            <v-flex xs12 sm6>
              <v-switch class="" label="Yêu cầu đăng ký hồ sơ thương nhân" v-model="registration"></v-switch>
            </v-flex>
            <!--  -->
          </v-layout>
          <v-flex xs12 class="text-right pr-3" style="
            position: fixed;
            bottom: 0;
            width: -webkit-calc( 100% - 300px );
            width: calc( 100% - 300px );
            background: white;
            z-index: 2;
          ">
            <v-btn color="blue darken-3" dark
              v-if="id === 0 || id === '0'"
              :loading="loading"
              :disabled="loading"
              @click="updateServiceConfig('add')"
            >
              <v-icon>add_circle_outline</v-icon>&nbsp;
              Thêm mới
            </v-btn>
            <v-btn color="blue darken-3" dark
              v-else
              :loading="loading"
              :disabled="loading"
              @click="updateServiceConfig('update')"
            >
              <v-icon>save</v-icon>&nbsp;
              Cập nhật
            </v-btn>
            <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
          </v-flex>
        </v-form>
      </div>
    </v-card>
    
  </div>
</template>

<script>
import toastr from 'toastr'
import axios from "axios"

export default {
  components: {
  },
  props: ['id'],
  data: () => ({
    reRender: true,
    validFormAddServiceConfig: false,
    isDvc: false,
    boNganh: false,
    administration: '',
    govAgencyList: [],
    govAgencyFilter: '',
    domainList: [],
    domainFilter: '',
    serviceInfoList: [],
    serviceFilter: '',
    levelList: [
      {levelName: 'Mức độ 2', level: 2},
      {levelName: 'Mức độ 3', level: 3},
      {levelName: 'Mức độ 4', level: 4}
    ],
    levelFilter: '',
    serviceInstruction: '',
    cmOptions: {
      tabSize: 4,
      mode: 'text/html',
      theme: 'base16-light',
      lineNumbers: true,
      line: true,
    },
    serviceUrl: '',
    forCitizen: false,
    forBusiness: false,
    postalService: false,
    registration: false,
    rules: {
      required: value => !!value || 'Bắt buộc phải nhập.',
      number: value => {
        const pattern = /^\d+$/
        return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
      },
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Sai định dạng thư điện tử.'
      },
      passWord: (value) => {
        const pattern = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])([0-9a-zA-Z@$!%*#?&]{8,}))$/
        return pattern.test(value) || 'Ít nhất 8 ký tự và có chữ hoa, chữ thường, ký tự đặc biệt @$!%*#?&'
      },
      telNo: (value) => {
        const pattern = /^0([1-9]{1}\d{8})$/
        if (value) {
          return pattern.test(value) || 'Số điện thoại gồm 10 ký tự 0-9, eg: 0989123456, ...'
        } else {
          return []
        }
      },
      syntaxError: (value) => {
        if (value) {
          value = String(value).trim()
          return value.indexOf('</') < 0 ? true : 'Không được có ký tự </'   
        } else {
          return true
        }  
      },
      varchar50: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
        } else {
          return true
        }  
      },
      varchar75: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 75 ? true : 'Không được nhập quá 75 ký tự'   
        } else {
          return true
        }
      },
      varchar255: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 255 ? true : 'Không được nhập quá 255 ký tự'   
        } else {
          return true
        }  
      },
      varchar500: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 500 ? true : 'Không được nhập quá 500 ký tự'   
        } else {
          return true
        }  
      },
      varchar2000: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
        } else {
          return true
        }
      },
      varchar5000: (val) => {
        if(val){
          val = String(val).trim()
          return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
        } else {
          return true
        }
      },
    },
  }),
  computed: {
  },
  created() {
    let vm = this
    try {
      vm.boNganh = boNganh
      // sử dụng cho các đơn vị bộ ngành
    } catch (error) {
    }
    try {
      vm.isDvc = isDvc
    } catch (error) {
    }
    vm.$nextTick(() => {
      vm.getAgency()
      if (vm.id != '0') {
        vm.getServiceConfigDetail()
      } else {
        let currentQuery = vm.$router.history.current.query
        vm.domainFilter = currentQuery.hasOwnProperty('domainCode') && currentQuery.domainCode ? currentQuery.domainCode : ''
        vm.serviceFilter = currentQuery.hasOwnProperty('serviceCode') && currentQuery.serviceCode ? currentQuery.serviceCode : ''
        vm.govAgencyFilter = currentQuery.hasOwnProperty('govAgencyCode') && currentQuery.govAgencyCode ? currentQuery.govAgencyCode : ''
        vm.administration = currentQuery.hasOwnProperty('administration') && currentQuery.administration ? currentQuery.administration : ''
        vm.levelFilter = currentQuery.hasOwnProperty('level') && currentQuery.level ? Number(currentQuery.level) : ''
        if (vm.isDvc && !vm.boNganh) {
          if (vm.govAgencyFilter) {
            if (vm.administration && vm.administration === 'XA_PHUONG') {
              vm.getDomains('CAP_XA')
              vm.getServiceInfo('CAP_XA', vm.domainFilter)
            } else {
              vm.getDomains(vm.govAgencyFilter)
              vm.getServiceInfo(vm.govAgencyFilter, vm.domainFilter)
            }
          }
        } else {
          vm.getDomains(vm.govAgencyFilter)
          vm.getServiceInfo(vm.govAgencyFilter, vm.domainFilter)
        }
        vm.reRender = false
        setTimeout(function() {
          vm.reRender = true
        }, 1000)
      }
    })
  },
  watch: {
    domainFilter (val) {
      let vm = this
      if (val) {
        vm.getServiceInfo(vm.govAgencyFilter, val)
      }
    }
  },
  methods: {
    getAgency () {
      let vm = this
      let data = {
      }
      vm.govAgencyList = []
      vm.$store.dispatch('getAgencyLists', data).then(
        res => {
          let sortName = function (list) {
            function compare(a, b) {
              if (a.itemName < b.itemName)
                return -1
              if (a.itemName > b.itemName)
                return 1
              return 0
            }
            return list.sort(compare)
          }
          vm.govAgencyList = sortName(res)
        }
      ).catch(()=>{
        vm.govAgencyList = []
      }) 
    },
    getDomains (agencyCode) {
      let vm = this
      let data = {
        agency: agencyCode ? agencyCode : ''
      }
      vm.domainList = []
      vm.$store.dispatch('getDomain', data).then(
        res => {
          vm.domainList = res
        }
      ).catch(()=>{
        vm.domainList = []
      })      
    },
    getServiceInfo (agencyCode, domainCode) {
      let vm = this
      let data = {
        domain: domainCode ? domainCode : '',
        agency: agencyCode ? agencyCode : ''
      }
      vm.serviceInfoList = []
      vm.$store.dispatch('getServiceInfo', data).then(function(res) {
        vm.serviceInfoList = res
      }).catch(()=>{
        vm.serviceInfoList = []
      })  
    },
    getServiceConfigDetail () {
      let vm = this
      let data = {
        serviceConfigId: vm.id
      }
      vm.$store.dispatch('getServiceConfigDetail', data).then(function(res) {
        if (res) {
          vm.domainFilter = res.domainCode
          vm.serviceFilter = res.serviceInfoId
          vm.govAgencyFilter = res.govAgencyCode
          vm.serviceInstruction = res.serviceInstruction
          vm.levelFilter = res.serviceLevel
          vm.serviceUrl = res.serviceUrl
          vm.forCitizen = res.forCitizen
          vm.forBusiness = res.forBusiness
          vm.postalService = res.postalService
          vm.registration = res.registration
          vm.getDomains()
          vm.getServiceInfo()
          vm.reRender = false
          setTimeout(function() {
            vm.reRender = true
          }, 1000)
        }
      }).catch(()=>{
      })  
    },
    updateServiceConfig (type) {
      let vm = this
      let filter = {
        serviceConfigId: vm.id,
        serviceInfoId: vm.serviceFilter,
        govAgencyCode: vm.govAgencyFilter,
        serviceInstruction: vm.serviceInstruction,
        serviceLevel: vm.levelFilter,
        serviceUrl: vm.serviceUrl,
        forCitizen: vm.forCitizen,
        forBusiness: vm.forBusiness,
        postalService: vm.postalService,
        registration: vm.registration,
        receptionReport: '',
        type: type
      }
      vm.$store.dispatch('createServiceConfig', filter).then(function (result) {
        if (type === 'add') {
          toastr.success('Thêm dịch vụ công thành công')
        } else {
          toastr.success('Cập nhật thành công')
        }
        vm.$router.push({
          path: '/table/opencps_serviceconfig',
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }).catch(reject => {
        toastr.error('Yêu cầu thực hiện thất bại')
      })
    },
    processRules (rulesStr, itemData) {
      let maxLength
      let syntaxErrorInput = false
      let vm = this
      if (itemData.hasOwnProperty('type') && (itemData.type === 'text-fields' || itemData.type === 'textarea')) {
        maxLength = 500
        if (itemData.type === 'textarea') {
          maxLength = 2000
        }
        if (itemData.hasOwnProperty('model') && (itemData.model.endsWith('Code') || itemData.model.endsWith('No') || itemData.model.endsWith('Id') || itemData.model == 'menuGroup')) {
          maxLength = 75
        }
        if (itemData.model == 'order') {
          maxLength = 10
        }
        syntaxErrorInput = true
      }
      let rulesInput = []
      if (rulesStr) {
        let hasRuleVarChar = rulesStr.indexOf('varchar') >= 0 ? true : false
        rulesInput = eval('( ' + rulesStr + ' )')
        if (maxLength == 2000 && !hasRuleVarChar) {
          rulesInput.push(vm.rules.varchar2000)
        }
        if (maxLength == 500 && !hasRuleVarChar) {
          rulesInput.push(vm.rules.varchar500)
        }
        if (maxLength == 75 && !hasRuleVarChar) {
          rulesInput.push(vm.rules.varchar75)
        }
        if (maxLength == 10 && !hasRuleVarChar) {
          rulesInput.push(vm.rules.varchar10)
        }
      } else {
        if (maxLength == 2000) {
          rulesInput.push(vm.rules.varchar2000)
        }
        if (maxLength == 500) {
          rulesInput.push(vm.rules.varchar500)
        }
        if (maxLength == 75) {
          rulesInput.push(vm.rules.varchar75)
        }
        if (maxLength == 10) {
          rulesInput.push(vm.rules.varchar10)
        }
      }
      if (syntaxErrorInput) {
        rulesInput.push(vm.rules.syntaxError)
      }
      return rulesInput
      // return eval('( ' + rulesStr + ' )')
    },
    getMaxLength(itemData) {
      let maxLength
      if (itemData.hasOwnProperty('type') && (itemData.type === 'text-fields' || itemData.type === 'textarea')) {
        maxLength = 500
        if (itemData.type === 'textarea') {
          maxLength = 2000
        }
        if (itemData.hasOwnProperty('model') && (itemData.model.endsWith('Code') || itemData.model.endsWith('No') || 
          itemData.model.endsWith('Id') || itemData.model == 'menuGroup')) {
          maxLength = 75
        }
        if (itemData.model == 'order') {
          maxLength = 10
        }
      }
      return maxLength

    },
    parsedate (date) {
      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    },
    currentDate () {
      let date = new Date()
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    },
    changeDate(index) {
      let vm = this
      vm.menuDate1 = vm.menuDate2 = false
      if (index === '1') {
        vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
      } else if (index === '2') {
        vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
      }
    },
    getMinMax (date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month}-${day}`
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
    formatDate(date) {
      if (!date) return ''
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    currentDateFormat (date) {
      let date1 = date ? new Date(date) : new Date()
      return `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()} ${date1.getHours().toString().padStart(2, '0')}:${date1.getMinutes().toString().padStart(2, '0')}`
    },
    backToList () {
      window.history.back()
    }
  }
}
</script>
