<template>  
  <div class="phancong" style="background-color: white;width:100%">
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>Ngày hẹn trả
        </div>
        <v-card >
          <v-card-text>
            <v-layout wrap class="pl-2">
              <v-icon color="blue">event</v-icon>
              <datetime v-model="dueDateInput"
                class="ml-2"
                type="datetime"
                input-format="DD/MM/YYYY HH:mm"
                :i18n="{ok:'Chọn', cancel:'Thoát'}"
                zone="local"
                :min-date="minDate"
                monday-first
                wrapper-class="wrapper-datetime"
                auto-continue
                auto-close
                required
              ></datetime>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['dueDateEdit'],
  data: () => ({
    dueDateInput: null,
    minDate: null
  }),
  created () {
    var vm = this
    vm.dueDateInput = vm.dueDateEdit.toString()
  },
  watch: {},
  mounted () {
    this.dueDateInput = this.dueDateEdit.toString()
    this.minDate = this.getCurentDateTime('date')
  },
  methods: {
    getDateInput () {
      var vm = this
      console.log('vm.dueDateInput', vm.dueDateInput)
      let date = (new Date(vm.dueDateInput)).getTime()
      return date
    },
    getCurentDateTime (type) {
      let date = new Date()
      if (type === 'datetime') {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      } else if (type === 'date') {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`
      }
    }
  }
}
</script>
