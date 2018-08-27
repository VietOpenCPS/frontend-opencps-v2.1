<template>  
  <div style="background-color: white;width:100%">
    <v-expansion-panel v-if="type === 'overdue'" class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>
          <span>Lý do chậm hạn trả</span><span> *</span>
        </div>
        <v-card>
          <v-card-text class="py-2 px-2">
            <v-layout wrap>
              <v-flex xs12>
                <v-form v-if="type === 'overdue'" v-model="valid" ref="delayNoteForm">
                  <v-text-field
                    v-model="delayNote"
                    multi-line
                    :rows="4"
                    :rules="() => delayNote !== '' || 'Trường dữ liệu bắt buộc'"
                  ></v-text-field>
                </v-form>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
      </v-expansion-panel>
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span v-if="type === 'overdue'">Ngày hẹn lại</span>
          <span v-if="type === 'betimes'">Ngày hẹn trả sớm</span>
        </div>
        <v-card >
          <v-card-text>
            <v-layout wrap class="pl-2">
              <v-icon color="blue" class="hover-pointer ml-3" @click="showDatePicker">event</v-icon>
              <vue-ctk-date-time-picker
                ref="datepicker" 
                style="width:auto!important"
                class="ml-2"
                v-model="extendDateInput" 
                format="YYYY-MM-DDTHH:mm"
                time-format="HH:mm"
                :without-header="true"
                formatted="DD/MM/YYYY HH:mm"
                :label="extendDateInput ? '' : 'Chọn ngày'"
                :min-date="minDate"
              ></vue-ctk-date-time-picker>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    
  </div>
</template>
<script>
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
export default {
  components: {
    'vue-ctk-date-time-picker': VueCtkDateTimePicker
  },
  props: ['extendDateEdit', 'type'],
  data: () => ({
    extendDateInput: '',
    minDate: null,
    delayNote: ''
  }),
  created () {
    var vm = this
    vm.extendDateInput = vm.extendDateEdit ? vm.formatDateInput(vm.extendDateEdit) : vm.formatDateInput(new Date())
    console.log('extendDateInput', vm.extendDateInput)
  },
  watch: {},
  mounted () {
    this.extendDateInput = this.extendDateEdit ? this.formatDateInput(this.extendDateEdit) : this.formatDateInput(new Date())
    console.log('extendDateInput', this.extendDateInput)
    this.minDate = this.getCurentDateTime('date')
  },
  methods: {
    doExport () {
      let vm = this
      let date = vm.extendDateInput ? (new Date(vm.extendDateInput)).getTime() : ''
      var exportData
      if (vm.type === 'overdue') {
        exportData = {
          text: vm.delayNote,
          extendDate: date,
          valid: vm.$refs.delayNoteForm.validate()
        }
      } else {
        exportData = {
          text: vm.delayNote,
          extendDate: date,
          valid: true
        }
      }
      return exportData
    },
    // getDateInput () {
    //   var vm = this
    //   console.log('vm.extendDateInput', vm.extendDateInput)
    //   let date = vm.extendDateInput ? (new Date(vm.extendDateInput)).getTime() : ''
    //   return date
    // },
    getCurentDateTime (type) {
      let date = new Date()
      if (type === 'datetime') {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      } else if (type === 'date') {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      }
    },
    formatDateInput (date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    },
    showDatePicker () {
      this.$refs.datepicker.showDatePicker()
    }
  }
}
</script>
