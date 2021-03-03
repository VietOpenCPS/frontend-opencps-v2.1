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
            append-icon="event"
            @blur="toDate = parseDate(toDateFormatted)"
            :value="formatDate(rawDate)"
            :rules="[rules.required]"
        >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-text-field>
        <v-date-picker :max="maxDate" :min="minDate" v-model="toDate" no-title></v-date-picker>
    </v-menu>
</template>

<script>
  export default {
    data () {
      return {
        toDateFormatted: null,
        toDate: null,
        rawDate: null,
        maxDate: '',
        minDate: '',
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
    props: ['value', 'item', 'dataValue', 'dataAll'],
    created () {
        var vm = this
        vm.$nextTick(function () {
            // console.log('input data: ', vm.dataValue)
            vm.rawDate = vm.parseDate(vm.dataValue)
            if (vm.item.hasOwnProperty('before')) {
                let dataMax = vm.dataAll[vm.item['before']]
                let dataMaxConvert = vm.parseDate(dataMax)
                // console.log('dataMax: ', dataMaxConvert)
                vm.maxDate = dataMaxConvert
            } else {
                vm.maxDate = null
            }
            if (vm.item.hasOwnProperty('after')) {
                let dataMin = vm.dataAll[vm.item['after']]
                let dataMinConvert = vm.parseDate(dataMin)
                // console.log('dataMinConvert: ', dataMinConvert)
                vm.minDate = dataMinConvert
            } else {
                vm.minDate = null
            }
        })
    },
    watch: {
        toDate (val) {
            let vm = this
            vm.toDateFormatted = vm.formatDate(val)
            vm.rawDate = vm.parseDate(vm.toDateFormatted)
            vm.$emit('input', new Date(val).getTime())
            vm.$emit('change', new Date(val).getTime())
            // vm.$parent.reloadPicker()
        },
        '$route': function (newRoute, oldRoute) {
            let vm = this
            vm.rawDate = vm.parseDate(vm.dataValue)
            if (vm.item.hasOwnProperty('before')) {
                let dataMax = vm.dataAll[vm.item['before']]
                let dataMaxConvert = vm.parseDate(dataMax)
                vm.maxDate = dataMaxConvert
            } else {
                vm.maxDate = null
            }
            if (vm.item.hasOwnProperty('after')) {
                let dataMin = vm.dataAll[vm.item['after']]
                let dataMinConvert = vm.parseDate(dataMin)
                vm.minDate = dataMinConvert
            } else {
                vm.minDate = null
            }
        }
    },
    methods: {
        formatDate (date) {
            if (!date) return null
            let dateObj = new Date(date)
            // this.$emit('input', dateObj.getTime())
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
