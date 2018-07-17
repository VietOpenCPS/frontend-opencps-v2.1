<template>
  <v-expansion-panel class="expansion-pl ext__form">
    <v-expansion-panel-content hide-actions value="1">
      <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>THÔNG TIN CHUNG HỒ SƠ</div>
      <v-card>
        <v-card-text class="py-2 px-2">
          <v-layout wrap>
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Tên doanh nghiệp: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field"> {{thongTinChiTietHoSo.applicantName}}</v-subheader>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Thời gian gửi: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field"> {{thongTinChiTietHoSo.submitDate|dateTimeView}} </v-subheader>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Mã hồ sơ: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field">  {{thongTinChiTietHoSo.dossierIdCTN}} </v-subheader>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Thời gian tiếp nhận: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field"> {{thongTinChiTietHoSo.receiveDate|dateTimeView}}</v-subheader>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Số hồ sơ: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field"> {{thongTinChiTietHoSo.dossierNo}} </v-subheader>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Thời hạn xử lý: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field"> <i>{{thongTinChiTietHoSo.durationDate}} làm việc</i> </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader :title="!showContactDetail?'Chi tiết liên hệ':'Thu gọn'" v-else class="pl-0 hover-pointer" @click.prevent.stop="showContactDetail = !showContactDetail">
                Thông tin liên hệ:
              </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field hover-pointer"> 
                <span :title="!showContactDetail?'Chi tiết liên hệ':'Thu gọn'" @click.prevent.stop="showContactDetail = !showContactDetail">
                  <v-icon color="primary" v-if="!showContactDetail">keyboard_arrow_down</v-icon>
                  <v-icon color="primary" v-if="showContactDetail">keyboard_arrow_up</v-icon>
                </span>
              </v-subheader>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Trạng thái: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0 header-text-field"> {{thongTinChiTietHoSo.dossierStatusText}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm12>
              <v-slide-y-transition>
                <div v-if="showContactDetail">
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0"><i>Tên doanh nghiệp: </i></v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 header-text-field"> {{thongTinChiTietHoSo.applicantName}} </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0"><i>Địa chỉ Email: </i></v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 header-text-field"> {{thongTinChiTietHoSo.contactEmail}} </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0"><i>Số điện thoại: </i></v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 header-text-field"> {{thongTinChiTietHoSo.contactTelNo}} </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0"><i>Địa chỉ: </i></v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 header-text-field"> {{thongTinChiTietHoSo.address}} </v-subheader>
                    </v-flex>
                  </v-layout>
                </div>
              </v-slide-y-transition>
            </v-flex>

          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
  export default {
    props: ['index', 'id'],
    components: {
    },
    data: () => ({
      thongTinChiTietHoSo: {
      },
      showContactDetail: false
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
    },
    created () {
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
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(arg)
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
