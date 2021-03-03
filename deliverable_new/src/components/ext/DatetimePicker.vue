<template>
    <v-menu
        :close-on-content-click="true"
        lazy
        transition="fade-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
        :class="classMenu"
        style="width: calc(100% - 150px);"
        
    >
        <v-text-field
            slot="activator"
            hide-details
            single-lines
            solo
            flat
            height="32"
            min-height="32"
            append-icon="event"
            @change="toDate = parseDate(dataValue)"
            :rules="processRules(item.rules)"
            v-model="dataValue"
            :class="classTextField"
            clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-text-field>
        <v-date-picker v-model="toDate" no-title></v-date-picker>
    </v-menu>
</template>

<script>
  export default {
    data () {
      return {
        toDateFormatted: null,
        toDate: null,
        rules: {
          required: value => !!value || 'Bắt buộc phải nhập.',
          number: value => {
            const pattern = /^\d+$/
            return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai định dạng thư điện tử.'
          }
        }
      }
    },
    props: ['value', 'item', 'dataValue', 'classTextField', 'classMenu'],
    watch: {
        toDate (val) {
          let vm = this
          setTimeout(function () {
            // console.log('val toDate', val)
            // vm.toDateFormatted = vm.formatDate(val)
            const [year, month, day] = val.split('-')
            vm.dataValue = `${day}/${month}/${year}`
            vm.$emit('changeDate', vm.dataValue)
            // console.log('toDateFormatted 123', vm.toDateFormatted)
          }, 300)
        },
        dataValue (val) {
          this.$emit('changeDate', val)
        }
        // toDateFormatted(val){
        //   let vm = this
        //   setTimeout(function () {
        //     vm.$emit('changeDate', val)
        //     // console.log('toDateFormatted 123', vm.toDateFormatted)
        //   }, 300)
        // }
    },
    methods: {
        formatDate (date) {
            if (!date) return null
            let dateFormat
            if (isNaN(date)) {
              if (String(date).indexOf('-') >= 0) {
                dateFormat = date
              } else {
                return date
              }
            } else {
              dateFormat = parseInt(date)
            }
            let dateObj = new Date(dateFormat)
            return dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear()
        },
        parseDate (date) {
          let vm = this
          let dateFormat = date
          if (!date) return null
          if (!isNaN(date)) {
            dateFormat = vm.formatDate(date)
          }
          const [day, month, year] = dateFormat.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        processRules (rulesStr) {
            return eval('( ' + rulesStr + ' )')
        },
    }
  }
</script>
