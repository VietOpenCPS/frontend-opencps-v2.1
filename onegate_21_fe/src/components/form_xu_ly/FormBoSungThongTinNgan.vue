<template>
  <v-expansion-panel class="expansion-pl ext__form">
    <v-expansion-panel-content hide-actions value="1">
      <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
      Form bổ sung thông tin
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
                    :placeholder="item.placeholder"
                ></v-text-field>
                <v-text-field v-if="item.fieldType === 'number'"
                    :id="item.fieldName"
                    :placeholder="item.placeholder"
				    :rules="[rulesValid.number]"
                ></v-text-field>
                <v-text-field v-if="item.fieldType === 'date'"
                    :id="item.fieldName"
                    :placeholder="item.placeholder"
                    readonly
                    append-icon="event"
                    v-on:click.native="dialog = true"
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
    }
  }
</script>
