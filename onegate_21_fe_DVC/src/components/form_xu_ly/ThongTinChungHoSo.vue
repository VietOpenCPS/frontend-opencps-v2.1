<template>
  <v-card>
    <v-card-text class="pb-0">
      <v-layout wrap>
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Mã số hồ sơ: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.dossierIdCTN}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Ngày tiếp nhận: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field"> {{thongTinChiTietHoSo.receiveDate|dateTimeView}}</v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Thủ tục: </v-subheader>
        </v-flex>
        <v-flex xs12 sm10>
          <v-subheader class="pl-0 header-text-field text-header">  {{thongTinChiTietHoSo.serviceName}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Chủ hồ sơ: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.applicantName}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Mã số: </v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.dossierNo}} </v-subheader>
        </v-flex>
        <!--  -->
        <v-flex xs12 sm2>
          <v-subheader class="pl-0 text-header">Địa chỉ: </v-subheader>
        </v-flex>
        <v-flex xs12 sm10>
          <v-subheader class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.address}} </v-subheader>
        </v-flex>
        <!--  -->
      </v-layout>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    props: ['dataDetail'],
    data: () => ({
      thongTinChiTietHoSo: {}
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      dataDetail (val) {
        var vm = this
        vm.thongTinChiTietHoSo = val
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        if (vm.dataDetail) {
          vm.thongTinChiTietHoSo = vm.dataDetail
        }
      })
    },
    methods: {},
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
