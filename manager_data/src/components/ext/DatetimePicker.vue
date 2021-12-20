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
            :rules="processRules(item.rules)"
            :value="formatDate(dataValue)"
        >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-text-field>
        <v-date-picker v-model="toDate" :min="min" :max="max" no-title></v-date-picker>
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
              return value.indexOf('</') >= 0 || value.indexOf('<img') >= 0 || value.indexOf('<script') >= 0 ? 'Dữ liệu nhập không hợp lệ' : true
            } else {
              return true
            }  
          },
          varchar10: (val) => {
            if(val){
              val = String(val).trim()
              return val.length <= 10 ? true : 'Không được nhập quá 10 ký tự'   
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
        }
      }
    },
    props: ['value', 'item', 'dataValue', 'min', 'max'],
    watch: {
        toDate (val) {
            this.toDateFormatted = this.formatDate(val)
            this.$emit('input', new Date(val).getTime())
        }
    },
    methods: {
        formatDate (date) {
            if (!date) return null
            let dateObj = new Date(date)
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
