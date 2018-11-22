<template>
  <div>
    <v-expansion-panel v-if="type !== 'dieuchinhdulieu' && formBuilder.length > 0" class="expansion-pl ext__form">
      <v-expansion-panel-content hide-actions value="1" v-for="(item, index) in formBuilder" v-bind:key="index">
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
        {{item.fieldLabel}}
        </div>
        <v-card>
          <v-card-text class="py-2 px-2">
            <v-layout wrap>
              <v-flex xs12>
                  <!-- <span :for="item.fieldName" style="
                      font-size: 13px;
                  ">{{item.fieldLabel}}</span> -->
                  <v-text-field v-if="item.fieldType === 'textarea'"
                      :id="item.fieldName"
                      :value="item.value"
                      :placeholder="item.placeholder"
                      multi-line
                      @input="inputChangeValue(item)"
                  ></v-text-field>
                  <v-text-field v-if="item.fieldType === 'string'"
                      :id="item.fieldName"
                      :value="item.value"
                      :placeholder="item.placeholder"
                      @input="inputChangeValue(item)"
                  ></v-text-field>
                  <v-text-field v-if="item.fieldType === 'number'"
                      :id="item.fieldName"
                      :value="item.value"
                      :placeholder="item.placeholder"
                      :rules="[rulesValid.number]"
                      @input="inputChangeValue(item)"
                  ></v-text-field>
                  <v-text-field v-if="item.fieldType === 'date'"
                      :id="item.fieldName"
                      :value="item.value"
                      :placeholder="item.placeholder"
                      readonly
                      append-icon="event"
                      v-on:click.native="openDialogCustom(item, item.fieldName)"
                  ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <v-date-picker
              v-model="date"
              full-width
              landscape
            ></v-date-picker>
            <v-card-actions style="background: #fff">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="pickDateCustom"
              >
                Xác nhận
              </v-btn>
            </v-card-actions>
          </v-dialog>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <div v-if="type === 'dieuchinhdulieu' && formBuilder.length > 0" class="expansion-pl ext__form">
      <div class="mb-2" hide-actions value="1" v-for="(item, index) in formBuilder" v-bind:key="index">
        <div class="px-2 py-1" style="border-bottom:1px solid #8a8989">
          <!-- <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div> -->
          <span class="text-bold">{{index + 1}}. </span>{{item.fieldLabel}}
        </div>
        <v-form ref="formExtra" v-model="valid" lazy-validation>
          <v-layout wrap>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'textarea'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                multi-line
                @input="inputChangeValue(item)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'string'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                @input="inputChangeValue(item)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'number'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                :rules="[rulesValid.number]"
                @input="inputChangeValue(item)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'date'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                readonly
                append-icon="event"
                v-on:click.native="openDialogCustom(item, item.fieldName)"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="px-3">
              <v-text-field v-if="item.fieldType === 'status'"
                box
                :id="item.fieldName"
                :value="item.value"
                :placeholder="item.placeholder"
                @input="inputChangeValue(item)"
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
          <v-card-actions style="background: #fff">
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="pickDateCustom">
              Xác nhận
            </v-btn>
          </v-card-actions>
        </v-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
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
      itemId: null,
      fieldNameID: '',
      date: null,
      dialog: false,
      formBuilder: [],
      valid: false,
      rulesValid: {
        number: function (value) {
          var pattern = /^\d+$/
          return pattern.test(value) || 'Kiểu dữ liệu sai định dạng.'
        }
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
        })
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let filter = {
          dossierId: vm.dossier_id,
          actionId: vm.action_id
        }
        if (filter['dossierId'] && filter['actionId']) {
          vm.$store.dispatch('getExtraForm', filter).then(function (result) {
            vm.formBuilder = result
          })
        }
      })
    },
    methods: {
      openDialogCustom (item, fieldName) {
        let vm = this
        vm.dialog = true
        vm.fieldNameID = fieldName
        vm.itemId = item
      },
      pickDateCustom () {
        let vm = this
        console.log(vm.date)
        vm.itemId.value = vm.dateTimeView(vm.date)
        vm.dialog = false
      },
      inputChangeValue (item) {
        let vm = this
        item.value = document.getElementById(item.fieldName).value
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
      checkValid () {
        let vm = this
        return vm.$refs.formExtra.validate()
      },
      formSubmitData () {
        let vm = this
        let objectReturn = {}
        // console.log('formBuilder', vm.formBuilder)
        for (let key in vm.formBuilder) {
          let valueEdit = vm.formBuilder[key].value
          if (vm.formBuilder[key].fieldType === 'date') {
            valueEdit = (new Date(vm.parseCurrentDate(vm.formBuilder[key].value))).getTime() ? (new Date(vm.parseCurrentDate(vm.formBuilder[key].value))).getTime() : ''
          }
          objectReturn[vm.formBuilder[key].fieldName] = valueEdit
        }
        // console.log('objectReturn', objectReturn)
        return objectReturn
      }
    }
  }
</script>
