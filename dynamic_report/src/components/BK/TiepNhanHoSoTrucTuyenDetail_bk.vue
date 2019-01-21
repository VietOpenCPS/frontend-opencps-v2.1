<template>
  <div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header" style="margin-top: 6px;">
      <div class="background-triangle-big"> TIẾP NHẬN HỒ SƠ TRỰC TUYẾN </div> 
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
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-card class="mb-2">
          <!-- <v-toolbar dark color="primary" height="40">
            <v-toolbar-title class="white--tẽt" style="font-size: 15px;">Thông tin chung</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar> -->
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs12 sm6 class="mb-2">
                <span>Loại hồ sơ: </span> 
              </v-flex>
              <v-flex xs12 sm6>
                <v-chip small class="pl-0">
                  Hồ sơ trực tuyến
                </v-chip>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Mã hồ sơ: {{thongTinChiTietHoSo.dossierIdCTN}}</span> 
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Ngày tiếp nhận: {{thongTinChiTietHoSo.receiveDate|dateTimeView}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Chủ hồ sơ: {{thongTinChiTietHoSo.applicantName}}</span>
              </v-flex>
              <v-flex xs12 sm12 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Địa chỉ: {{thongTinChiTietHoSo.address}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Người nộp: {{thongTinChiTietHoSo.delegateName}}</span>
              </v-flex>
              <v-flex xs12 sm6 class="mb-2">
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <span v-else>Số CMND: {{thongTinChiTietHoSo.applicantIdNo}}</span>
              </v-flex>
              <v-flex xs12 sm12>
                <div class="text-right mt-2">
                  <v-btn color="primary" v-on:click.native="daTra">
                    Đồng ý &nbsp;
                    <v-icon>save</v-icon>
                  </v-btn>
                  <v-btn color="primary" v-on:click.native="daTra">
                    Không đồng ý &nbsp;
                    <v-icon>save</v-icon>
                  </v-btn>
                  <v-btn color="primary" @click="goBack">
                    Quay lại &nbsp;
                    <v-icon>undo</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
// import router from '@/router'
// import * as utils from '../store/onegate_utils'

export default {
  components: {
  },
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
  created () {
    var vm = this
    vm.$nextTick(function () {
      console.log(vm.index)
    })
  },
  watch: {
  },
  methods: {
    initData: function (data) {
      var vm = this
      vm.$store.dispatch('getDetailDossier', data).then(result => {
        console.log(vm.$refs)
      }).catch(reject => {
      })
    },
    luuHoSo () {
    },
    tiepNhanHoSo () {
    },
    boSungHoSo () {
    },
    goBack () {
      window.history.back()
    }
  }
}
</script>
