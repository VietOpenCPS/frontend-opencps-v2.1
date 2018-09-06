<template>
	<div>
		<v-layout row wrap>
		  <v-flex xs12 sm12 class="text-xs-center">
		    <h3 class="text-xs-center">NỘP HỒ SƠ THÀNH CÔNG</h3>
		    <p class="text-center">
		    	Mã hồ sơ đã nộp: <span class="text-light-blue">18155925</span>
		    	<span class="text-bold" style="color: green;"></span>
		    </p>
		  </v-flex>
		  <v-flex xs12 sm12>
		    <p>
		    	<i class="fa fa-book" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
		    	<span class="text-bold">THÔNG TIN HỒ SƠ ĐÃ NỘP</span>
		    </p>
		  </v-flex>
		  <v-flex xs12 sm12>
		    <p>
		    	<i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
		    	<span class="text-bold">ĐỊA ĐIỂM HOÀN TẤT THỦ TỤC</span>
		    </p>
		  </v-flex>
		</v-layout>
	</div>
</template>

<script>
  // import router from '@/router'
  // import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
  export default {
    data: () => ({
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
        // vm.minDate = vm.getCurentDateTime('date')
      })
    },
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      initData (data) {
        var vm = this
        vm.thongTinChungHoSo = data
      },
      goBack () {
        let vm = this
        // let currentParams = vm.$router.history.current.params
        // let currentQuery = vm.$router.history.current.query
        // vm.$router.push({
        //   path: '/danh-sach-ho-so/' + currentParams.index,
        //   query: currentQuery
        // })
        window.history.back()
      },
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        }
      },
      formatDateInput (date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
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
