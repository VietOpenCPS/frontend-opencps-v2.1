<template>
  <v-expansion-panel class="expansion-pl ext__form">
    <v-expansion-panel-content hide-actions value="1">
      <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Thông tin chung hồ sơ</div>
      <v-card>
        <v-card-text class="py-0">
          <v-layout wrap class="px-2 py-2">
            <v-flex xs12 sm4 class="pr-3" v-if="originality !== 1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Chủ hồ sơ: </span>
                <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantName}}</span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1 overHidden">
                <span class="pr-2">Địa chỉ: </span>
                <v-tooltip top>
                  <span slot="activator" class="text-bold ">{{ thongTinChiTietHoSo.address }} {{thongTinChiTietHoSo.wardName}}, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span>
                  <span class="pl-0"> {{thongTinChiTietHoSo.address}} {{thongTinChiTietHoSo.wardName}}, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span>
                </v-tooltip>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pl-0">Thư điện tử: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.contactEmail}} </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Điện thoại: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.contactTelNo}} </span>
              </div>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm4 class="pr-3" v-if="originality === 1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Mã hồ sơ: </span>
                <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.dossierNo}} </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Cơ quan: </span>
                <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.govAgencyName}} </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Trạng thái: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
              </div>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm4 v-if="originality !== 1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Ngày gửi trực tuyến: </span>
                <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                <span class="pl-0 text-bold" v-else> Một cửa </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Ngày tiếp nhận: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.receiveDate}}</span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Thời hạn giải quyết: </span>
                <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.durationCount > 0"> 
                  {{durationText(thongTinChiTietHoSo.durationUnit, thongTinChiTietHoSo.durationCount)}} làm việc 
                </span>
                <span class="pl-0 text-bold " v-else>
                  Không quy định
                </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Ngày hẹn trả: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dueDate}}</span>
              </div>
            </v-flex>
            <v-flex xs12 sm4 v-else>
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Ngày gửi: </span>
                <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                <span class="pl-0 text-bold" v-else> Một cửa </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Ngày tiếp nhận: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.receiveDate}}</span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Ngày hẹn trả: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dueDate}}</span>
              </div>
            </v-flex>
            <!--  -->
            <v-flex xs12 sm4 v-if="originality !== 1">
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Mã hồ sơ: </span>
                <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.dossierNo}} </span>
              </div>
              <!--  -->
              <div class="xs12 sm12 pb-1">
                <span class="pr-2">Trạng thái: </span>
                <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
              </div>
              <!-- brief note -->
              <div class="xs12 sm12 pb-1 overHidden">
                <span class="pr-2">Nội dung: </span>
                <v-tooltip top v-if="thongTinChiTietHoSo.briefNote">
                  <span slot="activator" class="text-bold ">{{ thongTinChiTietHoSo.briefNote}}</span>
                  <span class="pl-0">{{thongTinChiTietHoSo.briefNote}} </span>
                </v-tooltip>
              </div>
            </v-flex>
            <v-flex xs12 sm4 v-else>
              <div class="xs12 sm12 pb-1" style="color:#0b72ba">Ghi chú:</div>
              <div class="xs12 sm12 pb-1 overHidden" v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'">
                <v-tooltip top>
                  <span slot="activator" class="text-bold ">{{thongTinChiTietHoSo.dossierNote}} </span>
                  <span class="pl-0"> {{thongTinChiTietHoSo.dossierNote}} </span>
                </v-tooltip>
              </div>
              <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo.extendDate">
                <span class="pl-0 text-bold">Hẹn lại: {{thongTinChiTietHoSo.extendDate}}</span>
              </div>
              <!--  -->
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script>
  export default {
    props: {
      detailDossier: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      detailDossier (val) {
        console.log('watch', val)
        var vm = this
        vm.thongTinChiTietHoSo = val
      }
    },
    components: {
    },
    data: () => ({
      thongTinChiTietHoSo: {},
      showContactDetail: false
    }),
    computed: {
      loading () {
        return this.$store.getters.loading
      },
      originality () {
        var vm = this
        return vm.getOriginality()
      }
    },
    created () {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    mounted () {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    methods: {
      initData (data) {
        var vm = this
        vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
          vm.thongTinChiTietHoSo = resultDossier
          console.log('thongTinChiTietHoSo', vm.thongTinChiTietHoSo)
        })
      },
      goBack () {
        window.history.back()
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
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
