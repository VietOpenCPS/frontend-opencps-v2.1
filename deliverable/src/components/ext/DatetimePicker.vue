<template>
    <v-menu
        :close-on-content-click="true"
        lazy
        transition="fade-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
    >
        <v-text-field
            slot="activator"
            box
            append-icon="event"
            @blur="toDate = parseDate(toDateFormatted)"
            :label="item.required ? item['label'] + ' 💥': item['label']" 
            :rules="processRules(item.rules)"
            :value="formatDate(dataValue)"
        ></v-text-field>
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
    props: ['value', 'item', 'dataValue'],
    watch: {
        toDate (val) {
            this.toDateFormatted = this.formatDate(parseInt(val))
            this.$emit('input', new Date(val).getTime())
        }
    },
    methods: {
        formatDate (date) {
            if (!date) return null
            let dateObj = new Date(parseInt(date))
            return dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear()
        },
        parseDate (date) {
            if (!date) return null
            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        processRules (rulesStr) {
            return eval('( ' + rulesStr + ' )')
        }
    }
  }
</script>
