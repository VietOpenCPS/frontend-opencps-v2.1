<template>
  <div style="width:100%">
    <v-expansion-panel :value="panel" expand  v-if="type !== 'dieuchinhdulieu' && formBuilder.length > 0 && !pending" class="expansion-pl ext__form">
      <v-expansion-panel-content v-for="(item, index) in formBuilder" v-bind:key="index">
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
        {{item.fieldLabel}} <span v-if="item.required === true || item.required === 'true'" style="color:red"> *</span>
        </div>
        <v-card>
          <v-card-text class="py-2 px-2">
            <v-form ref="form1" v-model="valid1" lazy-validation :id="'form_' + item.fieldName">
              <v-layout wrap>
                <v-flex xs12 class="mx-3">
                  <v-text-field v-if="item.fieldType === 'textarea'"
                    box
                    :id="item.fieldName"
                    :value="item.value"
                    :placeholder="item.placeholder"
                    multi-line
                    @input="inputChangeValue(item)"
                    :rules="(item.required === true || item.required === 'true') ? [rules.required] : []"
                    :required="(item.required === true || item.required === 'true') ? true : false"
                  ></v-text-field>
                  <v-text-field v-if="item.fieldType === 'string'"
                    box
                    :id="item.fieldName"
                    :value="item.value"
                    :placeholder="item.placeholder"
                    @input="inputChangeValue(item)"
                    :rules="(item.required === true || item.required === 'true') ? [rules.required] : []"
                    :required="(item.required === true || item.required === 'true') ? true : false"
                  ></v-text-field>
                  <v-text-field v-if="item.fieldType === 'number'"
                    box
                    :id="item.fieldName"
                    :value="item.value"
                    :placeholder="item.placeholder"
                    @input="inputChangeValue(item)"
                    :rules="(item.required === true || item.required === 'true') ? [rules.required] : [rules.number]"
                    :required="(item.required === true || item.required === 'true') ? true : false"
                  ></v-text-field>
                  <v-autocomplete v-if="validDatasourceSelect(item.fieldType) && JSON.parse(item.fieldType)['select'] && !JSON.parse(item.fieldType)['api']"
                    class="select-border"
                    :items="validDatasourceSelect(item.fieldType) ? JSON.parse(item.fieldType)['select'] : []"
                    :value="item.value"
                    :rules="(item.required === true || item.required === 'true') ? [rules.required] : []"
                    :required="(item.required === true || item.required === 'true') ? true : false"
                    :placeholder="item.placeholder"
                    item-text="text"
                    item-value="value"
                    hide-no-data
                    :hide-selected="true"
                    @change="inputChangeValue($event, index)"
                    box
                  ></v-autocomplete>
                  <v-autocomplete v-if="validDatasourceSelect(item.fieldType) && JSON.parse(item.fieldType)['select'] && JSON.parse(item.fieldType)['api']"
                    class="select-border"
                    :items="validDatasourceSelect(item.fieldType) ? JSON.parse(item.fieldType)['dataSource'] : []"
                    :value="item.value"
                    :rules="(item.required === true || item.required === 'true') ? [rules.required] : []"
                    :required="(item.required === true || item.required === 'true') ? true : false"
                    :placeholder="item.placeholder"
                    :item-text="JSON.parse(item.fieldType)['textMapping']"
                    :item-value="JSON.parse(item.fieldType)['valueMapping']"
                    hide-no-data
                    :hide-selected="true"
                    @change="inputChangeValue($event, index)"
                    box
                  ></v-autocomplete>
                  <v-layout wrap class="pl-2" v-if="item.fieldType === 'date'">
                    <v-icon color="blue" class="">event</v-icon>
                    <vue-ctk-date-time-picker 
                      ref="datepicker"
                      :label="item.value ? '' : 'Chọn ngày'"
                      style="width:auto!important"
                      class="ml-2"
                      :id="item.fieldName"
                      v-model="item.value"
                      formatted="DD/MM/YYYY HH:mm"
                      format="YYYY-MM-DDTHH:mm"
                      time-format="HH:mm"
                      :min-date="getCurentDateTime()"
                      :without-header="true"
                      locale="vi"
                    />
                  </v-layout>
                  <v-layout wrap v-if="item.fieldType.indexOf('options_group') >= 0" class="mt-2">
                    <v-flex xs4 v-for="(item1, index1) in optionsGroup" v-bind:key="index1" class="pr-3">
                      <v-autocomplete 
                        class="select-border"
                        :items="optionsGroup[index1]['datasource']"
                        :value="item1.value"
                        :rules="(item1.required === true || item1.required === 'true') ? [rules.required] : []"
                        :required="(item1.required === true || item1.required === 'true') ? true : false"
                        :label="item1.fieldLabel"
                        item-text="itemName"
                        item-value="itemCode"
                        :hide-selected="true"
                        hide-no-data
                        @change="inputChangeSelect($event, index1)"
                        box
                      ></v-autocomplete>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
          <v-dialog v-model="dialog" width="500">
            <v-date-picker
              v-model="date"
              full-width
              landscape
            ></v-date-picker>
            <v-card-actions style="background: #fff">
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="pickDateCustom">
                Xác nhận
              </v-btn>
            </v-card-actions>
          </v-dialog>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <div v-if="type === 'dieuchinhdulieu' && !pending" class="ext__form px-3">
      <div v-if="formBuilder.length > 0" class="mb-2" hide-actions v-for="(item, index) in formBuilder" v-bind:key="index">
        <div class="py-1" style="border-bottom:1px solid #8a898942">
          <!-- <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div> -->
          <span class="text-bold">{{index + 1}}. </span>{{item.fieldLabel}} <span v-if="item.required === true || item.required === 'true'" style="color:red"> *</span>
        </div>
        <v-form ref="form" v-model="valid2" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 class="px-3 mt-2">
              <v-text-field v-if="item.fieldType === 'textarea'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                multi-line
                @input="inputChangeValue(item)"
                :rules="(item.required === true || item.required === 'true') ? [rules.required, rules.varchar5000] : [rules.varchar5000]"
                :required="(item.required === true || item.required === 'true') ? true : false"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'string'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                @input="inputChangeValue(item)"
                :rules="(item.required === true || item.required === 'true') ? [rules.required, rules.varchar5000] : [rules.varchar5000]"
                :required="(item.required === true || item.required === 'true') ? true : false"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'number'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                @input="inputChangeValue(item)"
                :rules="(item.required === true || item.required === 'true') ? [rules.required] : [rules.number]"
                :required="(item.required === true || item.required === 'true') ? true : false"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-autocomplete v-if="item.fieldType.indexOf('select') >= 0"
                class="select-border"
                :items="validDatasourceSelect(item.fieldType) ? JSON.parse(item.fieldType)['select'] : []"
                :value="item.value"
                :rules="(item.required === true || item.required === 'true') ? [rules.required] : []"
                :required="(item.required === true || item.required === 'true') ? true : false"
                :placeholder="item.placeholder"
                item-text="text"
                item-value="value"
                hide-no-data
                :hide-selected="true"
                @change="inputChangeValue($event, index)"
                box
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-layout wrap class="mt-2" v-if="item.fieldType === 'date'">
                <v-icon color="blue" class="">event</v-icon>
                <vue-ctk-date-time-picker 
                  ref="datepicker"
                  :label="item.value ? '' : 'Chọn ngày'"
                  style="width:auto!important"
                  class="ml-2"
                  :id="item.fieldName"
                  v-model="item.value"
                  formatted="DD/MM/YYYY HH:mm"
                  format="YYYY-MM-DDTHH:mm"
                  time-format="HH:mm"
                  :without-header="true"
                  locale="vi"
                />
              </v-layout>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'status'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                @input="inputChangeValue(item)"
                :rules="(item.required === true || item.required === 'true') ? [rules.required] : []"
                :required="(item.required === true || item.required === 'true') ? true : false"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
        <v-dialog v-model="dialog" width="500">
          <v-date-picker
            v-model="date"
            full-width
            landscape
          ></v-date-picker>
          <!-- <vue-ctk-date-time-picker
            v-model="date"
            formatted="DD/MM/YYYY HH:mm"
            format="YYYY-MM-DDTHH:mm"
            time-format="HH:mm"
            without-input
          /> -->
          <v-card-actions style="background: #fff">
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="pickDateCustom">
              Xác nhận
            </v-btn>
          </v-card-actions>
        </v-dialog>
      </div>
      <div v-if="formBuilder.length === 0">
        <v-alert outline color="warning" icon="priority_high" :value="true">
          Không có form điều chỉnh dữ liệu
        </v-alert>
      </div>
    </div>
  </div>
</template>
<script>
  let datePicker = window.VueCtkDateTimePicker ? window.VueCtkDateTimePicker.default : window['vue-ctk-date-time-picker']
  import $ from 'jquery'
  import axios from 'axios'
  export default {
    components: {
      'vue-ctk-date-time-picker': datePicker
    },
    props: {
      dossier_id: {
        type: Number
      },
      action_id: {
        type: Number
      },
      type: {
        type: String,
        default: () => ''
      }
    },
    data: () => ({
      pending: false,
      optionsGroup: [],
      itemId: null,
      fieldNameID: '',
      date: null,
      dialog: false,
      formBuilder: [],
      panel: [],
      valid: false,
      valid1: false,
      valid2: false,
      rulesValid: {
        number: function (value) {
          var pattern = /^\d+$/
          return pattern.test(value) || 'Kiểu dữ liệu sai định dạng'
        }
      },
      rules: {
        required: (value) => !!value || 'Trường dữ liệu bắt buộc',
        number: function (value) {
          const pattern = /^\d+$/
          return pattern.test(value) || 'Kiểu dữ liệu sai định dạng'
        },
        varchar50: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 50 ? true : 'Không được nhập quá 50 ký tự'   
          } else {
            return true
          }  
        },
        varchar100: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 100 ? true : 'Không được nhập quá 100 ký tự'   
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
        varchar5000: (val) => {
          if(val){
            val = String(val).trim()
            return val.length <= 5000 ? true : 'Không được nhập quá 5000 ký tự'   
          } else {
            return true
          }
        },
      }
    }),
    watch: {
      dossier_id () {
        let vm = this
        let filter = {
          dossierId: vm.dossier_id,
          actionId: vm.action_id
        }
        vm.$store.dispatch('getExtraForm', filter).then(function (result) {
          vm.formBuilder = result
          if (vm.formBuilder.length > 0) {
            for (let key in vm.formBuilder) {
              if (vm.formBuilder[key]['fieldType'] === 'date' && vm.formBuilder[key]['value'] && isNaN(new Date(vm.formBuilder[key]['value']).getTime())) {
                vm.formBuilder[key]['value'] = ''
              } else if (vm.formBuilder[key]['fieldType'] === 'date' && vm.formBuilder[key]['value'] && !isNaN(new Date(vm.formBuilder[key]['value']).getTime())) {
                vm.formBuilder[key]['value'] = new Date(vm.formBuilder[key]['value'])
              }
            }
          }
        }).catch(function () {
          vm.formBuilder = []
        })
      },
      formBuilder () {
        let vm = this
        vm.allExpand(vm.formBuilder)
      }
    },
    created () {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      vm.$nextTick(function () {
        let filter = {
          dossierId: vm.dossier_id,
          actionId: vm.action_id
        }
        if (filter['dossierId'] && filter['actionId']) {
          vm.$store.dispatch('getExtraForm', filter).then(function (result) {
            vm.formBuilder = result
            if (vm.formBuilder.length > 0) {
              for (let key in vm.formBuilder) {
                if (vm.formBuilder[key]['fieldType'] === 'date' && vm.formBuilder[key]['value'] && isNaN(new Date(vm.formBuilder[key]['value']).getTime())) {
                  vm.formBuilder[key]['value'] = ''
                } else if (vm.formBuilder[key]['fieldType'] === 'date' && vm.formBuilder[key]['value'] && !isNaN(new Date(vm.formBuilder[key]['value']).getTime())) {
                  vm.formBuilder[key]['value'] = new Date(vm.formBuilder[key]['value'])
                } else if (vm.formBuilder[key]['fieldType'].indexOf('select') >= 0 && JSON.parse(vm.formBuilder[key]['fieldType'])['select'] && JSON.parse(vm.formBuilder[key]['fieldType'])['api']) {
                  let api = JSON.parse(vm.formBuilder[key]['fieldType'])['api']
                  let dataSourceSelect = []
                  let param = {
                    headers: {
                      groupId:currentQuery.hasOwnProperty('groupIdSiteMng') && currentQuery.groupIdSiteMng ? currentQuery.groupIdSiteMng: window.themeDisplay.getScopeGroupId()
                    },
                    params: {}
                  }
                  axios.get(api, param).then(function (response) {
                    vm.pending = true
                    if (response.data && response.data['data']) {
                      dataSourceSelect = response.data['data']
                    } else {
                      dataSourceSelect = response.data
                    }
                    let fieldTypeObj = JSON.parse(vm.formBuilder[key]['fieldType'])
                    fieldTypeObj['dataSource'] = dataSourceSelect
                    vm.formBuilder[key]['fieldType'] = JSON.stringify(fieldTypeObj)
                    vm.pending = false
                  }).catch(function (xhr) {
                  })
                  
                } else if (vm.formBuilder[key]['fieldType'].indexOf('options_group') >= 0) {
                  vm.optionsGroup = JSON.parse(vm.formBuilder[key]['fieldType'])['options_group']
                  for (let key1 in vm.optionsGroup) {
                    if (vm.optionsGroup[key1].hasOwnProperty('api') && vm.optionsGroup[key1]['api']) {
                      vm.getDataSource(vm.optionsGroup[key1]['api'], key1, {})
                    }
                  }
                }
              }
              vm.allExpand(vm.formBuilder)
            }
          })
        }
      })
    },
    methods: {
      allExpand (arr) {
        let vm = this
        vm.panel = [...Array(arr.length).keys()].map(_ => true)
      },
      openDialogCustom (item, fieldName) {
        let vm = this
        vm.dialog = true
        vm.fieldNameID = fieldName
        vm.itemId = item
      },
      pickDateCustom () {
        let vm = this
        console.log(vm.date)
        if (vm.date) {
          vm.itemId.value = new Date(vm.date)
        }
        vm.dialog = false
      },
      inputChangeValue (item, index) {
        let vm = this
        if (index !== undefined && index !== null && index !== 'undefined' && index !== 'null') {
          vm.formBuilder[index]['value'] = item
        } else {
          item.value = document.getElementById(item.fieldName).value
        }
        console.log('formBuilder', vm.formBuilder)
      },
      inputChangeSelect (item, index) {
        console.log('inputChangeSelect', item, index)
        let vm = this
        vm.optionsGroup[index]['value'] = item
        if (vm.optionsGroup.length > (index + 1)) {
          vm.optionsGroup[index + 1]['value'] = ''
          vm.getDataSource(vm.optionsGroup[index + 1]['api'], index + 1, {parent: item})
        }
      },
      getDataSource (api, index, paramInput) {
        let vm = this
        let currentQuery = vm.$router.history.current.query
        let param = {
          headers: {
            groupId: currentQuery.hasOwnProperty('groupIdSiteMng') && currentQuery.groupIdSiteMng ? currentQuery.groupIdSiteMng:window.themeDisplay.getScopeGroupId()
          },
          params: paramInput ? paramInput : {}
        }
        axios.get(api, param).then(function (response) {
          if (response.data && response.data['data']) {
            vm.optionsGroup[index]['datasource'] = response.data['data']
          } else {
            vm.optionsGroup[index]['datasource'] = []
          }
        }).catch(function (xhr) {
          vm.optionsGroup[index]['datasource'] = []
        })
      },
      showDatePicker () {
        this.$refs.datepicker.showDatePicker()
      },
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
        } else {
          return ''
        }
      },
      parseCurrentDate (date) {
        if (!date) {
          return null
        }
        // let [day1, time] = date.split(' ')
        let [day2, month, year] = date.split('/')
        // let [hh, mm, ss] = `${time}`.split(':')
        return `${year}-${month.padStart(2, '0')}-${day2.padStart(2, '0')}`
      },
      validDatasourceSelect (fieldType) {
        if (fieldType) {
          try {
            let x = JSON.parse(fieldType)
            if (x) {
              return true
            }
            return false
          } catch (error) {
            return false
          }
        } else {
          return false
        }
      },
      checkValid () {
        let vm = this
        let valid = true
        if (vm.formBuilder.length > 0) {
          for (let key in vm.formBuilder) {
            if (vm.formBuilder[key].fieldType.indexOf('options_group') >= 0) {
              for (let key1 in vm.optionsGroup) {
                console.log('itemGroup', vm.optionsGroup[key1])
                if ((vm.optionsGroup[key1]['required'] === true || vm.optionsGroup[key1]['required'] === 'true') && !vm.optionsGroup[key1]['value']) {
                  valid = false
                  alert(vm.formBuilder[key]['fieldLabel'] + ' là bắt buộc!')
                  return valid
                }
              }
            } else {
              if ((vm.formBuilder[key]['required'] === true || vm.formBuilder[key]['required'] === 'true') && !vm.formBuilder[key]['value']) {
                valid = false
                alert(vm.formBuilder[key]['fieldLabel'] + ' là bắt buộc!')
                $('#form_' + vm.formBuilder[key].fieldName)[0].__vue__.validate()
                return valid
              }
            }
          }
        }
        return valid
      },
      formSubmitData () {
        let vm = this
        let objectReturn = {}
        if (vm.formBuilder.length > 0) {
          for (let key in vm.formBuilder) {
            if (vm.formBuilder[key].fieldName) {
              let valueEdit = vm.formBuilder[key].value
              if (vm.formBuilder[key].fieldType === 'date') {
                valueEdit = (new Date(vm.formBuilder[key].value)).getTime() ? (new Date(vm.formBuilder[key].value)).getTime() : ''
              }
              objectReturn[vm.formBuilder[key].fieldName] = valueEdit
            } else if (!vm.formBuilder[key].fieldName && vm.formBuilder[key].fieldType.indexOf('options_group') >= 0) {
              for (let key1 in vm.optionsGroup) {
                objectReturn[vm.optionsGroup[key1].fieldName] = vm.optionsGroup[key1]['value']
              }
            }
          }
        } else {
          objectReturn = ''
        }
        console.log('form-thong-tin', objectReturn)
        return objectReturn
      },
      getCurentDateTime () {
        let date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      }
    },
    filters: {
      parseDate: function (value) {
        if (!value) return ''
        let date = ''
        if (!isNaN(Number(value))) {
          date = new Date(Number(value))
        } else {
          date = new Date(value)
        }
        if (date) {
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
