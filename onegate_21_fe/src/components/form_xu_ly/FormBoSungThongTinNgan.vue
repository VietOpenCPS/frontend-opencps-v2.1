<template>
  <v-expansion-panel class="expansion-pl ext__form">
    <v-expansion-panel-content hide-actions value="1">
      <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
      FORM BỔ SUNG THÔNG TIN
      </div>
      <v-card>
        <v-card-text class="py-2 px-2">
          <v-layout wrap>
            <v-flex xs12 v-for="(item, index) in formBuilder" v-bind:key="index">
                <span :for="item.fieldName" style="
                    font-size: 13px;
                ">{{item.fieldLabel}}</span>
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
            <v-card-actions style="
                background: #fff;
            ">
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
</template>
<script>
  export default {
    props: {
      dossier_id: {
        type: Number
      },
      action_id: {
        type: Number
      }
    },
    data: () => ({
      itemId: null,
      fieldNameID: '',
      date: null,
      dialog: false,
      formBuilder: [],
      rulesValid: {
        number: function (value) {
          var pattern = /^\d+$/
          return pattern.test(value) || 'Kiểu dữ liệu sai định dạng.'
        }
      }
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        let filter = {
          dossierId: vm.dossier_id,
          actionId: vm.action_id
        }
        vm.$store.dispatch('getExtraForm', filter).then(function (result) {
          vm.formBuilder = result
        })
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
      formSubmitData () {
        let vm = this
        let objectReturn = {}
        for (let key in vm.formBuilder) {
          objectReturn[vm.formBuilder[key].fieldName] = vm.formBuilder[key].value
        }
        return objectReturn
      }
    }
  }
</script>
