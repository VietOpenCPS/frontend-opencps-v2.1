<template>
  <div style="margin: 0 auto;">
    <v-card class="mb-3 mt-0">
      <v-toolbar color="blue darken-3" dark height="40">
        <v-toolbar-title class="ml-0">
          <span @click="openServiceConfig" class="mr-2">
            <a href="javascript:;" class="" style="color: white;text-decoration: none;font-size: 16px;">Dịch vụ công</a>
          </span>
          <span> <v-icon>chevron_right</v-icon></span>
          <span @click="openServiceConfigProcess" class="ml-2">
            <a href="javascript:;" class="" style="color: white;text-decoration: none;font-size: 16px;">Quy trình thực hiện</a>
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="py-0 px-2">
      <v-flex xs12 class="mb-3">
        <span class="text-bold" style="color: #073b76">Tên dịch vụ công:</span>
        <span> {{serviceConfigName}}</span>
      </v-flex>
      <div>
        <v-form ref="formAddServiceProcessOption" class="px-0 mb-5" v-model="validformAddServiceProcessOption" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 sm12 md2 class="mb-2 pr-2">
              <v-text-field 
                v-model="seqOrder"
                :rules="[rules.syntaxError, rules.varchar500]"
                placeholder="Nhập số thứ tự"
                maxlength="500"
                counter="500"
                box 
                clearable
              >
                <template slot="label">Số thứ tự</template>
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md10 class="mb-2 pl-2">
              <v-text-field 
                v-model="optionName"
                :rules="[rules.required, rules.syntaxError, rules.varchar2000]"
                placeholder=""
                maxlength="2000"
                counter="2000"
                box 
                clearable
                required
              >
                <template slot="label">Tên quy trình xác lập dịch vụ <span class="red--text darken-3">*</span></template>
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 class="mb-2">
              <v-autocomplete
                box
                :items="dossierTemplateList"
                v-model="dossierTemplateFilter"
                item-text="templateName"
                item-value="dossierTemplateId"
                clearable
                :rules="[rules.required]"
                required
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex xs12 class="v-list__tile__title">{{data.item.templateNo}} - {{data.item.templateName}}</v-flex>
                </template>
                <template slot="label">Mẫu hồ sơ <span class="red--text darken-3">*</span></template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 class="mb-2">
              <v-autocomplete
                box
                :items="serviceProcessList"
                v-model="serviceProcessFilter"
                item-text="processName"
                item-value="serviceProcessId"
                clearable
                :rules="[rules.required]"
                required
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex xs12 class="v-list__tile__title">{{data.item.processNo}} - {{data.item.processName}}</v-flex>
                </template>
                <template slot="label">Quy trình xử lý thủ tục <span class="red--text darken-3">*</span></template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 class="mb-2">
              <v-text-field 
                v-model="autoSelect"
                :rules="[rules.syntaxError, rules.varchar500]"
                placeholder=""
                maxlength="500"
                counter="500"
                box 
                clearable
              >
                <template slot="label">Chuỗi pattern xác định việc lựa chọn tự động theo đối tượng xử lý hồ sơ</template>
              </v-text-field>
            </v-flex>
            
            <v-flex xs12>
              <v-subheader class="px-0">Hướng dẫn chi tiết để chuẩn bị hồ sơ</v-subheader>
              <codemirror v-if="reRender" v-model="instructionNote" :options="cmOptions"></codemirror>
            </v-flex>
            <v-flex xs12 class="mb-2">
              <v-subheader class="px-0">Hướng dẫn sau khi nộp hồ sơ</v-subheader>
              <codemirror v-if="reRender" v-model="submissionNote" :options="cmOptions"></codemirror>
            </v-flex>
            <!-- <v-flex xs12 sm6 class="mb-2 pr-2">
              <v-autocomplete
                box
                :items="registerBookList"
                v-model="registerBookCode"
                item-text="itemName"
                item-value="itemCode"
                clearable
              >
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <v-flex xs12 class="v-list__tile__title">{{data.item.itemCode}} - {{data.item.itemName}}</v-flex>
                </template>
                <template slot="label">Chọn sổ theo dõi</template>
              </v-autocomplete>
            </v-flex> -->
            <v-flex xs12 sm6 class="mb-2 pl-2">
              <v-text-field 
                v-model="sampleCount"
                :rules="[rules.syntaxError, rules.varchar500]"
                placeholder=""
                maxlength="500"
                counter="500"
                box 
                clearable
              >
                <template slot="label">Số bộ hồ sơ</template>
              </v-text-field>
            </v-flex>

            <!--  -->
          </v-layout>
          <v-flex xs12 class="text-right pr-3" style="
            position: fixed;
            bottom: 0;
            background: white;
            z-index: 4;
            border-top: 1px solid #dcdcdc;
            width: 100%;
            margin-left: -268px !important;
            height: 70px
          ">
            <v-btn color="red darken-3" class="mr-2" dark v-on:click.native="backToList">
              <v-icon>reply</v-icon>&nbsp;
              Quay lại
            </v-btn>
            <v-btn color="blue darken-3" dark
              v-if="id === 0 || id === '0'"
              :loading="loading"
              :disabled="loading"
              @click="updateServiceProcessOption('add')"
            >
              <v-icon>add_circle_outline</v-icon>&nbsp;
              Thêm mới
            </v-btn>
            <v-btn color="blue darken-3" dark
              v-else
              :loading="loading"
              :disabled="loading"
              @click="updateServiceProcessOption('update')"
            >
              <v-icon>save</v-icon>&nbsp;
              Cập nhật
            </v-btn>
          </v-flex>
        </v-form>
      </div>
    </v-card>
    
  </div>
</template>

<script>
import Vue from 'vue'
import toastr from 'toastr'
import axios from "axios"

export default {
  components: {
  },
  props: ['id'],
  data: () => ({
    reRender: true,
    validformAddServiceProcessOption: false,
    serviceConfigId: '',
    serviceConfigName: '',
    isDvc: false,
    boNganh: false,
    seqOrder: '',
    optionName: '',
    dossierTemplateList: [],
    dossierTemplateFilter: '',
    serviceProcessList: [],
    serviceProcessFilter: '',
    autoSelect: '',
    instructionNote: '',
    submissionNote: '',
    registerBookList: [],
    registerBookCode: '',
    sampleCount: '',
    cmOptions: {
      tabSize: 4,
      mode: 'text/html',
      theme: 'base16-light',
      lineNumbers: true,
      line: true,
    },
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
      let currentQuery = vm.$router.history.current.query
      vm.serviceConfigId = currentQuery.hasOwnProperty('serviceConfigId') && currentQuery.serviceConfigId ? currentQuery.serviceConfigId : ''
      vm.serviceConfigName = currentQuery.hasOwnProperty('serviceConfigName') && currentQuery.serviceConfigName ? currentQuery.serviceConfigName : ''
      vm.getDossierTemplate()
      vm.getServiceProcesses()
      // vm.getRegisterBooks()
      if (vm.id != '0' && vm.serviceConfigId) {
        vm.getServiceProcessOptionDetail()
      } else {
        vm.optionName = vm.serviceConfigName
        vm.reRender = false
        setTimeout(function() {
          vm.reRender = true
        }, 1000)
      }
    })
  },
  watch: {
  },
  methods: {
    openServiceConfig () {
      let vm = this
      vm.$router.push({
        path: '/table/opencps_serviceconfig_dvc'
      })
    },
    openServiceConfigProcess () {
      let vm = this
      vm.$router.push({
        path: '/table/opencps_processoption_dvc?serviceConfigId=' + vm.serviceConfigId + '&serviceConfigName=' + vm.serviceConfigName
      })
    },
    getDossierTemplate () {
      let vm = this
      let data = {
      }
      vm.dossierTemplateList = []
      vm.$store.dispatch('getDossierTemplateDvc', data).then(
        res => {
          vm.dossierTemplateList = res
        }
      ).catch(()=>{
        vm.dossierTemplateList = []
      }) 
    },
    getServiceProcesses () {
      let vm = this
      let data = {
      }
      vm.serviceProcessList = []
      vm.$store.dispatch('getServiceProcessesDvc', data).then(
        res => {
          vm.serviceProcessList = res
        }
      ).catch(()=>{
        vm.serviceProcessList = []
      })
    },
    getRegisterBooks () {
      let vm = this
      let data = {
      }
      vm.registerBookList = []
      vm.$store.dispatch('getRegisterBookList', data).then(function(res) {
        vm.registerBookList = res
      }).catch(()=>{
        vm.registerBookList = []
      })  
    },
    getServiceProcessOptionDetail () {
      let vm = this
      let processOptionList = []
      let processOptionFilter = ''
      let param = {
        headers: {
          groupId: window.themeDisplay.getScopeGroupId()
        }
      }
      let params = {
        start: 0,
        end: 50,
      }
      let dataPost = new URLSearchParams()
      dataPost.append('method', 'GET')
      dataPost.append('url', '/serviceconfigs/' + vm.serviceConfigId + '/processes')
      dataPost.append('data', JSON.stringify(params))
      axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
        if (response && response.data.hasOwnProperty('data')) {
          processOptionList = response['data']['data']
          processOptionFilter = processOptionList.filter(function (item) {
            return item.processOptionId == vm.id
          })[0]
          vm.seqOrder = processOptionFilter.seqOrder
          vm.optionName = processOptionFilter.optionName
          vm.dossierTemplateFilter = processOptionFilter.dossierTemplateId
          vm.serviceProcessFilter = processOptionFilter.serviceProcessId
          vm.autoSelect = processOptionFilter.autoSelect
          vm.instructionNote = processOptionFilter.instructionNote
          vm.submissionNote = processOptionFilter.submissionNote
          vm.sampleCount = processOptionFilter.sampleCount
          vm.registerBookCode = processOptionFilter.hasOwnProperty('registerBookCode') ? processOptionFilter['registerBookCode'] : ''
          vm.reRender = false
          setTimeout(function() {
            vm.reRender = true
          }, 1000)
        }
      }).catch(function (error) {
      })
    },
    updateServiceProcessOption (type) {
      let vm = this
      let filter = {
        serviceConfigId: vm.serviceConfigId,
        processOptionId: vm.id,
        seqOrder: vm.seqOrder,
        optionName: vm.optionName,
        dossierTemplateId: vm.dossierTemplateFilter,
        serviceProcessId: vm.serviceProcessFilter,
        autoSelect: vm.autoSelect,
        instructionNote: vm.instructionNote,
        submissionNote: vm.submissionNote,
        sampleCount: vm.sampleCount,
        registerBookCode: vm.registerBookCode,
        type: type
      }
      vm.$store.dispatch('createServiceProcessOptionDvc', filter).then(function (result) {
        if (type === 'add') {
          toastr.success('Thêm quy trình thực hiện thành công')
        } else {
          toastr.success('Cập nhật thành công')
        }
        vm.$router.push({
          path: '/table/opencps_processoption_dvc?serviceConfigId=' + vm.serviceConfigId + '&serviceConfigName=' + vm.serviceConfigName
        })
      }).catch(reject => {
        toastr.error('Yêu cầu thực hiện thất bại')
      })
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
