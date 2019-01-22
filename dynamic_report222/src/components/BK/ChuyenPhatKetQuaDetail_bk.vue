<template>
	<div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header" style="margin-top: 6px;">
      <div class="background-triangle-big"> CHUYỂN PHÁT KẾT QUẢ </div> 
      <div class="layout row wrap header_tools row-blue">
        <div class="flex solo text-ellipsis">

        </div> 
        <div class="flex text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
		<v-card>
      <v-card-title primary-title>
        <v-chip label outline color="blue">Mẫu biên bản bàn giao</v-chip>
      </v-card-title>
    </v-card>
	</div>
</template>
<script>
  export default {
    data: () => ({
      thongTinChiTietHoSo: {
        dossierIdCTN: '182CB683',
        receiveDate: 1529409276000,
        applicantName: 'Lê việt Đức',
        dossierId: '67501',
        address: 'Phường Tân Hồng, Thị xã Từ Sơn, Tỉnh Bắc Ninh',
        releaseDate: 1529409276000,
        dossierStatusText: 'Đang xử lý',
        durationDate: 3,
        delegateName: 'Lê việt Đức',
        applicantIdNo: '123456778',
        fee: '1.000.000.000'
      }
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    components: {
    },
    created () {
    },
    watch: {
    },
    methods: {
      initData (data) {
        var vm = this
        vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
          vm.thongTinChiTietHoSo = resultDossier
        })
      },
      goBack () {
        window.history.back()
      },
      daTra () {
        console.log('Đã tra')
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        }
        //  else {
        //   if (!arg) {
        //     return ''
        //   }
        //   const [date, time] = date.split(' ')
        //   const [day, month, year] = date.split('/')
        //   const [hour, minute] = time.split(':')
        //   return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year} | ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        // }
      }
    }
  }
</script>
