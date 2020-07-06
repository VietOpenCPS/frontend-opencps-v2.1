<template>
  <div>
    <v-expansion-panel :value="[true]" expand >
      <v-expansion-panel-content>
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Thông tin chung hồ sơ</div>
        <v-card v-if="!mauCongVan">
          <v-card-text class="py-0">
            <v-layout wrap class="px-2 py-2">
              <v-flex xs12 sm4 class="pr-3" v-if="originality !== 1">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Chủ hồ sơ: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantName}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Số CMND/ căn cước: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantIdNo}}</span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1 overHidden">
                  <span class="pr-2">Địa chỉ: </span>
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{ String(thongTinChiTietHoSo.address).replace(/\./g, "") }} {{thongTinChiTietHoSo.wardName}}<span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span></span>
                    <span class="pl-0"> {{String(thongTinChiTietHoSo.address).replace(/\./g, "")}} {{thongTinChiTietHoSo.wardName}}<span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span></span>
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
                <div class="xs12 sm12 pb-1">
                  <v-menu offset-y style="position:relative !important;">
                    <span slot="activator" class="pr-2">
                      Thông tin người nộp
                      <v-icon color="blue" size="22" style="position: absolute;right: -12px;top: -2px;">arrow_drop_down</v-icon>
                    </span>
                    <v-list class="px-3 py-2">
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Tên người nộp:</span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> 
                          {{thongTinChiTietHoSo.applicantName}}
                        </span>
                        <span v-else class="pl-0 text-bold "> {{thongTinChiTietHoSo.delegateName}} </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Số CMND/ căn cước: </span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> 
                          {{thongTinChiTietHoSo.applicantIdNo}}
                        </span>
                        <span v-else class="pl-0 text-bold "> {{thongTinChiTietHoSo.delegateIdNo}} </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Địa chỉ:</span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> 
                          {{String(thongTinChiTietHoSo.address).replace(/\./g, "")}} {{thongTinChiTietHoSo.wardName}}
                          <span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span>
                        </span>
                        <span class="pl-0 text-bold" v-else> 
                          {{String(thongTinChiTietHoSo.delegateAddress).replace(/\./g, "")}} {{thongTinChiTietHoSo.delegateWardName}}
                          <span v-if="thongTinChiTietHoSo.delegateWardName">, {{thongTinChiTietHoSo.delegateDistrictName}}, {{thongTinChiTietHoSo.delegateCityName}}</span>
                        </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Thư điện tử:</span>
                        <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.contactEmail}} </span>
                        <span class="pl-0 text-bold " v-else> {{thongTinChiTietHoSo.delegateEmail}} </span>
                      </div>
                      <div class="xs12 sm12 py-1">
                        <span class="pr-2">Số điện thoại:</span>
                        <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.contactTelNo}} </span>
                        <span class="pl-0 text-bold " v-else> {{thongTinChiTietHoSo.delegateTelNo}} </span>
                      </div>
                    </v-list>
                  </v-menu>
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
                  <span class="pr-2" v-if="thongTinChiTietHoSo.online">Ngày gửi trực tuyến: </span>
                  <span class="pr-2" v-else>Ngày nộp hồ sơ: </span>
                  <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                  <span class="pl-0 text-bold" v-else> {{thongTinChiTietHoSo.receiveDate}} </span>
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
                  <span class="pr-2" v-if="thongTinChiTietHoSo.online">Ngày gửi trực tuyến: </span>
                  <span class="pr-2" v-else>Ngày nộp hồ sơ: </span>
                  <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                  <span class="pl-0 text-bold" v-else> {{thongTinChiTietHoSo.receiveDate}} </span>
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
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo.originDossierNo">
                  <span class="pr-2">Hồ sơ gốc: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.originDossierNo}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Trạng thái: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
                </div>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <div class="xs12 sm12 pb-1 overHidden" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0&&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{thongTinChiTietHoSo.dossierNote}} </span>
                    <span class="pl-0"> {{thongTinChiTietHoSo.dossierNote}} </span>
                  </v-tooltip>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo['groupDossierId']">
                  <span class="pr-2">Nhóm hồ sơ: </span>
                  <span class="pl-0 text-bold" :title="thongTinChiTietHoSo['permission'].indexOf('write') >= 0 ? 'Chi tiết nhóm hồ sơ' : ''" @click="detailGroup" 
                    :style="thongTinChiTietHoSo['permission'].indexOf('write') >= 0 ? 'cursor: pointer; color: #0072bc' : ''">
                    {{groupDossierName}}
                  </span>
                </div>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <!-- brief note -->
                <!-- <div class="xs12 sm12 pb-1 overHidden">
                  <span class="pr-2">Nội dung: </span>
                  <v-tooltip top v-if="thongTinChiTietHoSo.briefNote">
                    <span slot="activator" class="text-bold ">{{ thongTinChiTietHoSo.briefNote}}</span>
                    <span class="pl-0">{{thongTinChiTietHoSo.briefNote}} </span>
                  </v-tooltip>
                </div> -->
              </v-flex>
              <v-flex xs12 sm4 v-else>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <div class="xs12 sm12 pb-1 overHidden" v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
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
        <!--  -->
        <v-card v-if="mauCongVan">
          <v-card-text class="py-0">
            <v-layout wrap class="px-2 py-2">
              <v-flex xs12 sm4 class="pr-3">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Chủ hồ sơ: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantName}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Số CMND/ căn cước: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantIdNo}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Giới tính: </span>
                  <span class="pl-0 text-bold"> {{metaData.gender === 0 ? 'Nam' : 'Nữ'}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày sinh: </span>
                  <span class="pl-0 text-bold"> 
                    <span v-if="metaData.birthDateDay && metaData.birthDateMonth && metaData.birthDateYear">{{metaData.birthDateDay}}/ </span>
                    <span v-if="metaData.birthDateMonth && metaData.birthDateYear">{{metaData.birthDateMonth}}/ </span>
                    <span v-if="metaData.birthDateYear">{{metaData.birthDateYear}} </span>
                  </span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Quê quán: </span>
                  <span class="text-bold pl-0">
                    <span v-if="metaData.wardNativeName">{{metaData.wardNativeName}}, </span>
                    <span v-if="metaData.districtNativeName">{{metaData.districtNativeName}}, </span>
                    <span v-if="metaData.cityNativeName">{{metaData.cityNativeName}} </span>
                  </span>
                </div>
                
              </v-flex>
              <v-flex xs12 sm4 class="pr-3">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Nơi đăng ký HKTT: </span>
                  <span class="text-bold pl-0">
                    <span v-if="thongTinChiTietHoSo.address">{{thongTinChiTietHoSo.address}}, </span>
                    <span v-if="thongTinChiTietHoSo.wardName">{{thongTinChiTietHoSo.wardName}}, </span>
                    <span v-if="thongTinChiTietHoSo.districtName">{{thongTinChiTietHoSo.districtName}}, </span>
                    <span v-if="thongTinChiTietHoSo.cityName">{{thongTinChiTietHoSo.cityName}} </span>
                  </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Tình trạng: </span>
                  <span class="pl-0 text-bold "> {{metaData.state && metaData.state === 1 ? 'Đã chết' : 'Còn sống'}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Số năm được hưởng: </span>
                  <span class="pl-0 text-bold "> {{metaData.yearPayment ? metaData.yearPayment : ''}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Mức trợ cấp (đồng/tháng): </span>
                  <span class="pl-0 text-bold "> {{metaData.subsidy ? currency(metaData.subsidy) : ''}}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm4>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Mã hồ sơ: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.dossierNo}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo.originDossierNo">
                  <span class="pr-2">Hồ sơ gốc: </span>
                  <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.originDossierNo}} </span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày tiếp nhận: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.receiveDate}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Thời hạn giải quyết: </span>
                  <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.durationCount > 0"> 
                    {{durationText(thongTinChiTietHoSo.durationUnit, thongTinChiTietHoSo.durationCount)}} làm việc 
                  </span>
                  <span class="pl-0 text-bold " v-else>
                    Không quy định
                  </span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Ngày hẹn trả: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dueDate}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Trạng thái: </span>
                  <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel v-if="mauCongVan" :value="[true]" expand >
      <v-expansion-panel-content>
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Thông tin người nộp</div>
        <v-card>
          <v-card-text class="py-0">
            <v-layout wrap class="px-2 py-2">
              <v-flex xs12 sm4 class="pr-3">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Họ tên: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.delegateName}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">CMND/ hộ chiếu: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.delegateIdNo}}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm4 class="pr-3">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Địa chỉ: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.delegateAddress}}</span>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Số điện thoại: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.delegateTelNo}}</span>
                </div>
              </v-flex>
              <v-flex xs12 sm4 class="pr-3">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Email: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.delegateEmail}}</span>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
  export default {
    props: {
      detailDossier: {
        type: Object,
        default: () => {}
      },
      mauCongVan: {
        type: String,
        default: () => ''
      }
    },
    watch: {
      detailDossier(val) {
        // console.log('watch', val)
        var vm = this
        vm.thongTinChiTietHoSo = val
        try {
          vm.metaData = JSON.parse(val.metaData)
        } catch (error) {
        }
        if (vm.thongTinChiTietHoSo['groupDossierId']) {
          vm.$store.dispatch('getDetailDossier', vm.thongTinChiTietHoSo['groupDossierId']).then(resultDossier => {
            vm.groupDossierNo = resultDossier['dossierNo']
            vm.groupDossierName = resultDossier['dossierName']
          })
        }
      }
    },
    components: {},
    data: () => ({
      thongTinChiTietHoSo: {},
      metaData: '',
      groupDossierNo: '',
      groupDossierName: '',
      showContactDetail: false,
      xacthuc_BNG: false
    }),
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      originality() {
        var vm = this
        return vm.getOriginality()
      }
    },
    created() {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
      if (vm.thongTinChiTietHoSo['groupDossierId']) {
        vm.$store.dispatch('getDetailDossier', vm.thongTinChiTietHoSo['groupDossierId']).then(resultDossier => {
          vm.groupDossierNo = resultDossier['dossierNo']
          vm.groupDossierName = resultDossier['dossierName']
        })
      }
      try {
        if (xacthuc_BNG) {
          vm.xacthuc_BNG = true
          
        }
      } catch (error) {
      }
    },
    mounted() {
      var vm = this
      vm.thongTinChiTietHoSo = vm.detailDossier
    },
    methods: {
      initData(data) {
        var vm = this
        vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
          vm.thongTinChiTietHoSo = resultDossier
          console.log('thongTinChiTietHoSo', vm.thongTinChiTietHoSo)
        })
      },
      goBack() {
        window.history.back()
      },
      durationText(durationUnit, durationCount) {
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
      detailGroup () {
        let vm = this
        if (vm.thongTinChiTietHoSo['permission'].indexOf('write') >= 0) {
          vm.$router.push('/danh-sach-ho-so/0/nhom-ho-so/' + vm.thongTinChiTietHoSo['groupDossierId'])
        }
      },
      currency (value) {
        if (value) {
          let moneyCur = (value / 1).toFixed(0).replace('.', ',')
          return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
        return ''
      },
      checkSoBan (thongTinChiTietHoSo) {
        try{
          let metaData = JSON.parse(thongTinChiTietHoSo.metaData)
          if('tongSoBan' in metaData){
            return true
          } else{
            return false
          }

        } catch (err) {
          return false
        }
      },
      checkTongSoTien (thongTinChiTietHoSo) {
        try{
          let metaData = JSON.parse(thongTinChiTietHoSo.metaData)
          if('tongSoTien' in metaData){
            return true
          } else{
            return false
          }

        } catch (err) {
          return false
        }
      },
      formarMoney (str){
        let formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });

        return formatter.format(parseFloat(str))
      }
    },
    filters: {
      dateTimeView(arg) {
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
