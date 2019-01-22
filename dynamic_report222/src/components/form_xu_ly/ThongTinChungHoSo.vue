<template>
  <v-card>
    <v-card-text class="pb-0">
      <v-layout wrap>
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Thủ tục: </v-subheader>
        </v-flex>
        <v-flex xs12 sm10>
          <v-subheader class="pl-0 header-text-field text-header">  {{thongTinChiTietHoSo.serviceName}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Mã số hồ sơ: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.dossierNo}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Thời hạn giải quyết: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{durationText(thongTinChiTietHoSo.durationUnit, thongTinChiTietHoSo.durationCount)}} làm việc  </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Ngày tiếp nhận: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.receiveDate}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Ngày hẹn trả: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.dueDate}} </v-subheader>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    data: () => ({
      thongTinChiTietHoSo: {}
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    created () {},
    methods: {
      initData (result) {
        this.thongTinChiTietHoSo = result
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
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}  ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
