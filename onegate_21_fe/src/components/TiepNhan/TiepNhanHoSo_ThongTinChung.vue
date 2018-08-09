<template>
  <div>
    <v-card>
      <v-card-text>
        <v-layout wrap>
          <!--  -->
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0" >
              Mã hồ sơ: 
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader class="text-bold" v-else style="float:left">
              <span class="text-bold">
                {{thongTinChungHoSo.dossierNo}}
              </span>
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Thời gian giải quyết: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-if="!loading" style="float:left">
              <span class="text-bold">
                {{durationText(thongTinChungHoSo.durationUnit, thongTinChungHoSo.durationCount)}} làm việc
              </span>
            </v-subheader>
          </v-flex>
          <v-flex xs12></v-flex>
          <!--  -->
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Ngày tiếp nhận: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else style="float:left"><span class="text-bold">{{thongTinChungHoSo.receiveDate}}</span></v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-else class="pl-0">Ngày hẹn trả: </v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-subheader v-if="!loading&&editable === false" style="float:left;height: 100%">
              <span class="text-bold">
                {{thongTinChungHoSo.dueDate | dateTimeView}}
              </span>
            </v-subheader>
            <v-subheader v-if="!loading&&editable === true" style="float:left;height: 100%">
              <vue-ctk-date-time-picker 
                ref="datepicker" 
                v-model="dueDateInput" 
                format="YYYY-MM-DDTHH:mm"
                formatted="DD/MM/YYYY HH:mm"
                time-format="HH:mm"
                :without-header="true"
                :label="dueDateInput ? '' : 'Chọn ngày'"
                :min-date="minDate"
              ></vue-ctk-date-time-picker>
              <v-icon class="hover-pointer" @click="showDatePicker">event</v-icon>
            </v-subheader>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  // import router from '@/router'
  import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
  export default {
    components: {
      'vue-ctk-date-time-picker': VueCtkDateTimePicker
    },
    data: () => ({
      minDate: null,
      editable: false,
      dueDateInput: null,
      dataPostDossier: {
        serviceCode: '',
        govAgencyCode: '',
        processOptionId: ''
      },
      thongTinChungHoSo: {
        serviceName: '',
        dossierTemplateName: '',
        serviceConfig: '',
        serviceOption: '',
        dossierNo: '',
        receiveDate: '',
        dueDate: '',
        durationDate: '',
        dossierId: '',
        dossierIdCTN: '',
        dossierStatus: '',
        dossierStatusText: '',
        durationUnit: '',
        durationCount: ''
      }
    }),
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.minDate = vm.getCurentDateTime('date')
      })
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      isDetail () {
        return this.$store.getters.isDetail
      }
    },
    watch: {
      dueDateInput (val) {
        this.thongTinChungHoSo['dueDate'] = this.getDuedateF(val)
      }
    },
    methods: {
      initData (data) {
        var vm = this
        let thongTinChungHoSoTemp = {
          serviceName: data.serviceName,
          dossierTemplateName: data.dossierTemplateName,
          dossierNo: data.dossierNo,
          receiveDate: vm.dateTimeView(data.receivingDate),
          dueDate: data.receivingDuedate,
          durationDate: data.durationDate,
          dossierId: data.dossierId,
          dossierIdCTN: data.dossierIdCTN,
          dossierStatus: data.dossierStatus,
          dossierStatusText: data.dossierStatusText,
          durationUnit: data.durationUnit,
          durationCount: data.durationCount
        }
        vm.thongTinChungHoSo = thongTinChungHoSoTemp
        vm.editable = data.editable
        vm.thongTinChungHoSo['editable'] = vm.editable
        vm.dueDateInput = vm.thongTinChungHoSo.dueDate ? vm.formatDateInput(new Date(Number(vm.thongTinChungHoSo.dueDate))) : null
        vm.minDate = vm.getCurentDateTime('date')
        console.log('dueDateInput', vm.dueDateInput)
      },
      getthongtinchunghoso () {
        return this.thongTinChungHoSo
      },
      getCurentDateTime (type) {
        let date = new Date()
        if (type === 'datetime') {
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} | ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
        } else if (type === 'date') {
          return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`
        }
      },
      changeDate () {
        this.thongTinChungHoSo['dueDate'] = this.getDuedate()
        // console.log('dueDate', this.thongTinChungHoSo.dueDate)
      },
      getDuedate () {
        var vm = this
        let date = this.dueDateInput ? (new Date(this.dueDateInput)).getTime() : ''
        return date
      },
      getDuedateF (val) {
        var vm = this
        let date = (new Date(val)).getTime()
        return date
      },
      durationText (durationUnit, durationCount) {
        var durationText
        if (durationUnit === 1 && durationCount > 8) {
          let day = Math.floor(durationCount / 8) + ' ngày'
          let hours
          if (durationCount % 8 !== 0) {
            hours = ((durationCount / 8) - Math.floor(durationCount / 8)) * 8 + ' giờ'
          } else {
            hours = ''
          }
          durationText = `${day} ${hours}`
        } else if (durationUnit === 0) {
          durationText = durationCount + ' ngày'
        } else if (durationUnit === 1 && durationCount <= 8) {
          durationText = durationCount + ' giờ'
        }
        return durationText
      },
      goBack () {
        let vm = this
        let currentParams = vm.$router.history.current.params
        let currentQuery = vm.$router.history.current.query
        vm.$router.push({
          path: '/danh-sach-ho-so/' + currentParams.index,
          query: currentQuery
        })
      },
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        }
      },
      formatDateInput (date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      },
      showDatePicker () {
        this.$refs.datepicker.showDatePicker()
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
