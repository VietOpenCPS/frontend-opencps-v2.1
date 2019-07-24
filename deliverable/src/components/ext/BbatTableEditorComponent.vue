<template>
  <v-form ref="form" v-model="valid" lazy-validation class="px-3 py-3 vuejx__form">
    <v-layout row wrap>
      <v-flex xs12>
        <div id="formDelivert" class="mb-5 pt-0"></div>
      </v-flex>
    </v-layout>

  </v-form>
</template>

<script>
  import DatetimePicker from './DatetimePicker.vue'

  export default {
    props: ['id', 'formid', 'datainput'],
    components: {
      DatetimePicker
    },
    data() {
      return {
        pullCounter: 0,
        isCallBack: true,
        config: {},
        pullOk: true,
        valid: true,
        loading: false,
        data: {},
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-light',
          lineNumbers: true,
          line: true,
        },
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
        },
        formTempalate: '',
        active: false
      }
    },
    computed: {
      detailForm () {
        let vm = this
        let detailDynamic = this.$store.getters.getContentFile
        vm.formTempalate = detailDynamic
        if (detailDynamic === '') {
          return []
        } else {
          return detailDynamic
        }
      },
      alpacaFormData () {
        let vm = this
        let control = window.$('#formDelivert').alpaca('get')
        let formData = control.getValue()
        console.log('alpacaFormData -+-+', formData)
        if (formData) {
          return formData
        } else {
          return {}
        }
      },
      dataSocket: {
        // getter
        get: function() {
          return this.$store.getters.dataSocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setdataSocket', newValue)
        }
      },
      pullCounterOrg () {
        return this.$store.getters.pullCounter
      },
      formData () {
        return this.$store.getters.getChangeFormData
      },
      activeBindFormData () {
        return this.$store.getters.getActiveBindFormData
      }
    },
    updated() {
      var vm = this
      vm.$nextTick(function () {
      })
    },
    watch: {
      activeBindFormData () {
        let vm = this
        // var runBind
        // function runBindData () {
        //   runBind = setTimeout(function () {
        //     vm.bindFormData(vm.formData)
        //   }, 500)
        // }
        // clearTimeout(runBind)
        // runBindData()
      }
    },
    mounted () {
      let vm = this
      vm.$nextTick(function () {
        vm.$store.dispatch('getContentFile', vm.formid).then(function (result) {
          console.log('formScript --->', result)
          vm.formTempalate = result
          window.$('#formDelivert').empty()
          let formScript, formData
          /* eslint-disable */
          if (result) {
            formScript = result
          } else {
            formScript = {}
          }
          if (String(vm.id) !== '0' && vm.datainput) {
            formData = eval('(' + vm.datainput + ')')
          } else {
            formData = {}
          }
          /* eslint-disable */
          formScript.data = formData
          window.$('#formDelivert').alpaca(formScript)
          // 
        })
      })
    },
    methods: {
      clearLoading () {
        this.loading = false
      },
      processRules (rulesStr) {
        return eval('( ' + rulesStr + ' )')
      },
      processChangeDataSource (data, item) {
        let vm = this
        if (item.hasOwnProperty('concatina')) {
          vm.pullOk = false
          vm.pullCounter = vm.pullCounter + 1
          vm.$store.commit('setpullCounter', vm.pullCounter)
          vm.$socket.sendObj(
            {
              type: 'api',
              cmd: 'get',
              respone: item.concatina['datasource_key'],
              api: item.concatina['datasource_api'] + '?' + item.concatina['query'] + '=' + data,
              headers: {
                'Token': vm.getAuthToken(),
                'groupId': vm.getScopeGroupId(),
                'USER_ID': vm.getUserId()
              }
            }
          )
        }
      },
      processDataSourceVerify () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            if (vm.data.hasOwnProperty(vm.detailForm[key]['model']) && String(vm.data[vm.detailForm[key]['model']]).startsWith("[")) {
              vm.data[vm.detailForm[key]['model']] = JSON.parse(vm.data[vm.detailForm[key]['model']])
            }
          }
        }
      },
      processDataSource () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            vm.pullOk = false
            vm.pullCounter = vm.pullCounter + 1
            vm.$store.commit('setpullCounter', vm.pullCounter)
            let apiURL = vm.detailForm[key]['datasource_api']
            if (vm.detailForm[key]['dependency'] && vm.detailForm[key].hasOwnProperty('pk')) {
              apiURL = apiURL + '?pk' + '=' + vm.id + '&col=' + vm.detailForm[key]['pk']
            }
            vm.$socket.sendObj(
              {
                type: 'api',
                cmd: 'get',
                respone: vm.detailForm[key]['datasource_key'],
                api: apiURL,
                headers: {
                  'Token': vm.getAuthToken(),
                  'groupId': vm.getScopeGroupId(),
                  'USER_ID': vm.getUserId()
                }
              }
            )
          }
        }
      },
      getFormData () {
        let vm = this
        let control = window.$('#formDelivert').alpaca('get')
        let formData = control.getValue()
        if (formData) {
          return formData
        } else {
          return {}
        }
      },
      bindFormData (form_data) {
        let vm = this
        console.log('form_data_bind', form_data)
        let formDataRender = form_data
        window.$('#formDelivert').empty()
        let formScript, formData
        /* eslint-disable */
        if (vm.formTempalate) {
          formScript = vm.formTempalate
        } else {
          formScript = {}
        }
        if (formDataRender) {
          formData = formDataRender
          for (let key in formData) {
            if (String(key).toLowerCase().indexOf('date') >= 0 && formData[key] && String(formData[key]).indexOf('/') < 0) {
              // console.log('key', key, vm.convertDate(formData[key]))
              formData[key] = vm.convertDate(formData[key])
            } else {
              // console.log('key 2', key, formData[key])
            }
          }
          // console.log('form_data 123', formData)
        } else {
          formData = {}
        }
        /* eslint-disable */
        formScript.data = formData
        window.$('#formDelivert').alpaca(formScript)
        // console.log('vm.formTempalate ->', formScript)
        // 
      },
      convertDate (val) {
        if (Number(val) > 0) {
          let date = new Date(val)
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        } else {
          return ''
        }
      }
    }
  }
</script>
