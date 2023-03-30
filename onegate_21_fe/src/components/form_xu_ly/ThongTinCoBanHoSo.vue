<template>
  <div>
    <v-expansion-panel :value="[true]" expand >
      <v-expansion-panel-content>
        <div slot="header"><div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div>Thông tin chung hồ sơ</div>
        <v-card v-if="!mauCongVan">
          <v-card-text class="py-0">
            <v-btn v-if="originality == 3 && thongTinChiTietHoSo.applicantIdType === 'citizen' && traCuuLgspCongDan && quyenTraCuuLgsp && serviceCheckCsdldc == '037'" :style="loadingSearchLgsp ? 'pointer-events: none' : ''"
             class="mx-0 ml-2 mt-2 mb-0" color="primary" @click.stop="showDialogSearchLgspCongDan()">
              <v-icon v-if="!loadingSearchLgsp">fas fa fa-search-plus</v-icon> 
              <v-progress-circular :size="24" v-if="loadingSearchLgsp"
                indeterminate
                color="white"
              ></v-progress-circular>&nbsp;
              <span v-if="!loadingSearchLgsp">Kiểm tra thông tin công dân</span>
              <span v-if="loadingSearchLgsp">Đang kiểm tra thông tin công dân</span>
            </v-btn>
            <v-layout wrap class="px-2 py-2">
              <v-flex xs12 v-if="showOptionName && metaData && metaData.hasOwnProperty('optionName') && metaData['optionName']">
                <div class="xs12 sm12 pb-1">
                  <span class="pl-0">Dịch vụ: </span>
                  <span class="pl-0 text-bold" style="text-align: justify;"> {{metaData['optionName']}} </span>
                </div>
              </v-flex>
              <v-flex xs12 sm4 class="pr-3" v-if="originality !== 1" style="word-break: break-word;">
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">Chủ hồ sơ: </span>
                  <v-tooltip top>
                    <span  class="text-bold ">{{thongTinChiTietHoSo.applicantName}}</span>
                    <span  slot="activator" class="pl-0 text-bold"> {{thongTinChiTietHoSo && thongTinChiTietHoSo.applicantName && thongTinChiTietHoSo.applicantName.length > 100 ? thongTinChiTietHoSo.applicantName.substr(0, 100) + '...' : thongTinChiTietHoSo.applicantName}}</span>
                  </v-tooltip>
                </div>
                <div class="xs12 sm12 pb-1">
                  <span class="pr-2">{{thongTinChiTietHoSo.applicantIdType === 'citizen' ? 'Số CMND/ căn cước' : 'Mã số thuế'}}: </span>
                  <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantIdNo}}</span>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1 overHidden">
                  <span class="pr-2">Địa chỉ: </span>
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{ String(thongTinChiTietHoSo.address).replace(/\./g, "").length < 100 ?  String(thongTinChiTietHoSo.address).replace(/\./g, "") : String(thongTinChiTietHoSo.address).replace(/\./g, "").substr(100) + '...'}} {{thongTinChiTietHoSo.wardName}}
                      <span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span>
                    </span>
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
              <v-flex xs12 sm4 class="pr-3" v-if="originality === 1" style="word-break: break-word;">
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
              <v-flex xs12 sm4 v-if="originality !== 1" style="word-break: break-word;">
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
              <v-flex xs12 sm4 v-if="originality !== 1" style="word-break: break-word;">
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
                <div class="xs12 sm12 pb-1" v-if="checkSoBan(thongTinChiTietHoSo) && thongTinChiTietHoSo.dossierStatus === 'paying' && xacthuc_BNG">
                  <span class="pr-2">Số bản: </span>
                  <span class="pl-0 text-bold "> {{JSON.parse(thongTinChiTietHoSo.metaData).tongSoBan}} bản</span>
                </div>
                <div class="xs12 sm12 pb-1" v-if="checkTongSoTien(thongTinChiTietHoSo) && thongTinChiTietHoSo.dossierStatus === 'paying'  && xacthuc_BNG">
                  <span class="pr-2">Tổng số tiền: </span>
                  <span class="pl-0 text-bold "> {{formarMoney(JSON.parse(thongTinChiTietHoSo.metaData).tongSoTien)}}</span>
                </div>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  String(thongTinChiTietHoSo.dossierNote).indexOf('<br/>') < 0 &&String(thongTinChiTietHoSo.dossierNote).indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <div class="xs12 sm12 pb-1 overHidden" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  String(thongTinChiTietHoSo.dossierNote).indexOf('<br/>') < 0&&String(thongTinChiTietHoSo.dossierNote).indexOf('</br>') < 0">
                  <v-tooltip top>
                    <span slot="activator" class="text-bold ">{{thongTinChiTietHoSo.dossierNote}} </span>
                    <span class="pl-0"> {{thongTinChiTietHoSo.dossierNote}} </span>
                  </v-tooltip>
                </div>
                <!--  -->
                <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo['groupDossierId'] && !mauCongVan">
                  <span class="pr-2">Nhóm hồ sơ: </span>
                  <span class="pl-0 text-bold" :title="thongTinChiTietHoSo['permission'].indexOf('write') >= 0 ? 'Chi tiết nhóm hồ sơ' : ''" @click="detailGroup" 
                    :style="thongTinChiTietHoSo['permission'].indexOf('write') >= 0 ? 'cursor: pointer; color: #0072bc' : ''">
                    {{groupDossierName}}
                  </span>
                </div>
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  String(thongTinChiTietHoSo.dossierNote).indexOf('<br/>') < 0 &&String(thongTinChiTietHoSo.dossierNote).indexOf('</br>') < 0">
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
              <v-flex xs12 sm4 v-else style="word-break: break-word;">
                <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                  v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                  String(thongTinChiTietHoSo.dossierNote).indexOf('<br/>') < 0 &&String(thongTinChiTietHoSo.dossierNote).indexOf('</br>') < 0">
                  Ghi chú:
                </div>
                <div class="xs12 sm12 pb-1 overHidden" v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&String(thongTinChiTietHoSo.dossierNote).indexOf('<br/>') < 0 &&String(thongTinChiTietHoSo.dossierNote).indexOf('</br>') < 0">
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
    <!-- tra cứu LGSP -->
    <v-dialog v-model="dialog_searchLgsp" scrollable persistent max-width="1000px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Tra cứu CSDL Quốc Gia về dân cư</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="closeSearchLgsp">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-form ref="formLgsp" v-model="valid" class="py-3 px-0 grid-list">
            <v-layout row wrap class="px-0 py-0">
              <v-flex xs12>
                <v-text-field label="Số CCCD hoặc số CMND" :rules="[rules.required]" v-model="applicantIdNoLgsp" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 >
                <v-text-field label="Họ và tên" v-model="applicantNameLgsp" :rules="[rules.required]" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-menu
                  ref="menuApplicantIdDate"
                  :close-on-content-click="false"
                  v-model="menuApplicantIdDate"
                  :nudge-right="40"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    label="Ngày sinh"
                    :rules="[rules.required]"
                    box
                    slot="activator"
                    v-model="applicantBirthDate"
                    append-icon="event"
                    @blur="ngaysinh = parseDate(applicantBirthDate)"
                    placeholder="dd/mm/yyyy"
                    mask="##/##/####"
                  ></v-text-field>
                  <v-date-picker min="1900-01-01" :max="getMaxdate()" ref="picker"
                  :first-day-of-week="1" locale="vi" v-model="ngaysinh" no-title @input="menuApplicantIdDate = false"></v-date-picker>
                </v-menu>
              </v-flex>
              
              <v-flex xs12 class="text-right">
                <v-btn color="primary"
                  @click="searchLgspCongDan"
                  :loading="loadingSearchLgsp"
                  :disabled="loadingSearchLgsp"
                  class="mx-0 my-0"
                >
                  <v-icon size="20">search</v-icon>
                  &nbsp;
                  Tra cứu CSDL dân cư
                  <span slot="loader">Đang tải...</span>
                </v-btn>
              </v-flex>
              
            </v-layout>
          </v-form>
          <div>
            <div class="mx-1 flex mb-3">
              <v-alert outline :color="lgspAlertColor" icon="warning" :value="true">
                {{messageLgsp}}
              </v-alert>
            </div>

            <v-layout wrap v-if="applicantLgspInfomation && lgspAlertColor == 'green'">
              <v-flex xs12 md6 class="pr-2">
                <div>
                  <table class="datatable table my-3" style="border-top: 1px solid #dedede;">
                    <tbody>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Họ và tên công dân</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.HoVaTen.Ten}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số định danh cá nhân/ CCCD</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.SoDinhDanh}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số chứng minh nhân dân</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.SoCMND}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Ngày sinh</span></td>
                        <td class="pt-2"><span>{{formatNgaySinh(applicantLgspInfomation.NgayThangNamSinh.NgayThangNam)}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Giới tính</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.GioiTinh == '1' ? 'Nam' : (applicantLgspInfomation.GioiTinh == '2' ? 'Nữ' : 'Chưa có thông tin')}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Quốc tịch</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.QuocTich == 'VN' ? 'Việt Nam' : applicantLgspInfomation.QuocTich}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Dân tộc</span></td>
                        <td class="pt-2"><span>{{getTenDanhMuc(applicantLgspInfomation.DanToc, 'dantoc')}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Tôn giáo</span></td>
                        <td class="pt-2"><span>{{getTenDanhMuc(applicantLgspInfomation.TonGiao, 'tongiao')}}</span></td>
                      </tr>
                      <tr v-if="diaChiThuongTruTraCuuQr">
                        <td width="200" class="pt-2"><span class="text-bold">Địa chỉ thường trú</span></td>
                        <td class="pt-2">
                          <span>{{applicantLgspInfomation.ThuongTru.ChiTiet}}</span>
                          <span>, {{diaChiThuongTruTraCuuQr}}</span>
                        </td>
                      </tr>
                      <tr v-if="noiOHienTaiTraCuuQr">
                        <td width="200" class="pt-2"><span class="text-bold">Nơi ở hiện tại</span></td>
                        <td class="pt-2">
                          <span>{{noiOHienTaiTraCuuQr}}</span>
                        </td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Nhóm máu</span></td>
                        <td class="pt-2"><span>{{getNhomMau(applicantLgspInfomation.NhomMau)}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Tình trạng hôn nhân</span></td>
                        <td class="pt-2"><span>{{getTinhTrangHonNhan(applicantLgspInfomation.TinhTrangHonNhan)}}</span></td>
                      </tr>

                      <tr v-if="applicantLgspInfomation.TinhTrangHonNhan == '2'">
                        <td width="200" class="pt-2"><span class="text-bold">Họ và tên vợ/ chồng</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.HoVaTen}}</span></td>
                      </tr>
                      <tr v-if="applicantLgspInfomation.TinhTrangHonNhan == '2'">
                        <td width="200" class="pt-2"><span class="text-bold">Quốc tịch</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.QuocTich == 'VN' ? 'Việt Nam' : applicantLgspInfomation.VoChong.QuocTich}}</span></td>
                      </tr>
                      <tr v-if="applicantLgspInfomation.TinhTrangHonNhan == '2'">
                        <td width="200" class="pt-2"><span class="text-bold">Số định danh cá nhân/ CCCD</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.SoDinhDanh}}</span></td>
                      </tr>
                      <tr v-if="applicantLgspInfomation.TinhTrangHonNhan == '2'">
                        <td width="200" class="pt-2"><span class="text-bold">Số chứng minh nhân dân</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.SoCMND}}</span></td>
                      </tr>
                      
                    </tbody>
                  </table>
                </div>
              </v-flex>
              <v-flex xs12 md6 class="pl-2">
                <div>
                  <table class="datatable table my-3" style="border-top: 1px solid #dedede;">
                    <tbody>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số sổ hộ khẩu</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.SoSoHoKhau}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Chủ hộ</span></td>
                        <td class="pt-2">
                          <p>{{applicantLgspInfomation.ChuHo.HoVaTen}}</p>
                          <p>Quan hệ: {{ applicantLgspInfomation.ChuHo.QuanHe }}</p>
                          <p>Số CMND: {{ applicantLgspInfomation.ChuHo.SoCMND }}</p>
                          <p>Số định danh: {{ applicantLgspInfomation.ChuHo.SoDinhDanh }}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Họ và tên cha</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Cha.HoVaTen}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Quốc tịch</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Cha.QuocTich == 'VN' ? 'Việt Nam' : applicantLgspInfomation.Cha.QuocTich}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số định danh cá nhân/ CCCD</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Cha.SoDinhDanh}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số chứng minh nhân dân</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Cha.SoCMND}}</span></td>
                      </tr>
                      
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Họ và tên mẹ</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Me.HoVaTen}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Quốc tịch</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Me.QuocTich == 'VN' ? 'Việt Nam' : applicantLgspInfomation.Me.QuocTich}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số định danh cá nhân/ CCCD</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Me.SoDinhDanh}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số chứng minh nhân dân</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.Me.SoCMND}}</span></td>
                      </tr>
                      
                    </tbody>
                  </table>
                </div>
              </v-flex>
            </v-layout>

            <v-flex xs12 class="text-right my-2">
              <v-btn color="red"
                @click="closeSearchLgsp"
                class="mx-0 my-0 white--text"
              >
                <v-icon size="20" class="white--text">clear</v-icon>
                &nbsp;
                Đóng
              </v-btn>
            </v-flex>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--  -->
  </div>
</template>

<script>
  import support from '../../store/support.json'
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
        // 
        if (vm.traCuuLgspCongDan && vm.thongTinChiTietHoSo.applicantIdType === 'citizen' && vm.originality == 3) {
          vm.$store.dispatch('checkRoleSearchLgsp', {serviceCode: vm.thongTinChiTietHoSo.serviceCode}).then(result => {
            if (result.hasOwnProperty('serviceCode')) {
              vm.quyenTraCuuLgsp = result.serviceCode
            }
            if (result.hasOwnProperty('serviceDvcqg')) {
              vm.serviceCheckCsdldc = result.serviceDvcqg
            }
          }).catch(xhr => {
            vm.quyenTraCuuLgsp = false
          })
        }
      },
      ngaysinh (val) {
        this.applicantBirthDate = this.formatDate(val)
      },
      menuApplicantIdDate (val) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      }
    },
    components: {},
    data: () => ({
      thongTinChiTietHoSo: "",
      metaData: '',
      groupDossierNo: '',
      groupDossierName: '',
      showContactDetail: false,
      xacthuc_BNG: false,
      showOptionName: false,
      applicantIdNoLgsp: '',
      applicantNameLgsp: '',
      applicantBirthDate: null,
      ngaysinh: null,
      menuApplicantIdDate: false,
      applicantLgspInfomation: '',
      warningLgsp: false,
      messageLgsp: 'Tra cứu cơ sở dữ liệu dân cư',
      lgspAlertColor: 'primary',
      traCuuLgspCongDan: false,
      dialog_searchLgsp: false,
      rules: {
        required: (value) => !!value || 'Thông tin bắt buộc',
        credit: (value) => {
          if (value) {
            if (value.length === 9) {
              const pattern = /^(([0-9]{9,9}))$/
              return pattern.test(value) || 'Số CCCD, số CMND gồm 9 hoặc 12 ký tự 0-9'
            } else {
              const pattern = /^(([0-9]{12,12}))$/
              return pattern.test(value) || 'Số CCCD, số CMND gồm 9 hoặc 12 ký tự 0-9'
            }
          } else {
            return true
          }
        },
      },
      quyenTraCuuLgsp: false,
      serviceCheckCsdldc: '',
      checkAccSso: false,
      citys: [],
      diaChiThuongTruTraCuuQr: '',
      noiOHienTaiTraCuuQr: '',
      danhmuctongiao: support.danhmuctongiao,
      danhmucdantoc: support.danhmucdantoc,
    }),
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      originality() {
        var vm = this
        return vm.getOriginality()
      },
      userLoginInfomation () {
        return this.$store.getters.getUserLogin
      },
    },
    created() {
      var vm = this
      try {
        vm.showOptionName = showOptionName
      } catch (error) {
      }
      try {
        vm.checkAccSso = checkAccSso
      } catch (error) {
      }
      try {
        vm.traCuuLgspCongDan = traCuuLgspCongDan
      } catch (error) {
      }
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
      var filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 0,
        parent: 0
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.citys = result.data
      })
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
      },
      showDialogSearchLgspCongDan () {
        let vm = this
        vm.applicantIdNoLgsp = vm.thongTinChiTietHoSo.applicantIdNo
        vm.applicantNameLgsp = vm.thongTinChiTietHoSo.applicantName
        vm.applicantLgspInfomation = ''
        if (vm.checkAccSso) {
          let filter = {
            maSoCaNhan: vm.thongTinChiTietHoSo['applicantIdNo'],
            type: 'citizen'
          }
          vm.$store.dispatch('getStatusAccount', filter).then(result => {
            console.log('resultCheck', result)
            if (result && result.profile) {
              let info = JSON.parse(result.profile)
              if (info && info.hasOwnProperty('ngaySinh') && info.ngaySinh && info.ngaySinh !== '01/01/1970') {
                vm.applicantBirthDate = info.ngaySinh
              }
            }
            vm.dialog_searchLgsp = true
          }).catch(function () {
            vm.dialog_searchLgsp = true
          })
        } else {
          vm.dialog_searchLgsp = true
        }
      },
      searchLgspCongDan (event) {
        let vm = this
        if (String(vm.applicantIdNoLgsp).trim() && String(vm.applicantNameLgsp).trim() && vm.applicantBirthDate && String(vm.applicantBirthDate).length === 8) {
          let dateInput = ''
          if (String(vm.applicantBirthDate).indexOf('/') > 0) {
            let date = String(vm.applicantBirthDate).split('/')
            dateInput = date[2] + '-' + date[1] + '-' + date[0]
          } else {
            dateInput = String(vm.applicantBirthDate).substring(4,8) + '-' + String(vm.applicantBirthDate).substring(2,4) + '-' + String(vm.applicantBirthDate).substring(0,2)
          }
          let filter = {
            applicantIdNo: String(vm.applicantIdNoLgsp).trim(),
            applicantName: vm.convertString(String(vm.applicantNameLgsp).trim()).toUpperCase(),
            birthDate: dateInput,
            StaffEmail : vm.userLoginInfomation && vm.userLoginInfomation.hasOwnProperty('employeeEmail') ? vm.userLoginInfomation.employeeEmail : '',
            GovAgencyCode: vm.thongTinChiTietHoSo ? vm.thongTinChiTietHoSo.govAgencyCode : '',
            MaDVC: vm.thongTinChiTietHoSo ? vm.thongTinChiTietHoSo.serviceCode : ''
          }
          vm.loadingSearchLgsp = true
          vm.$store.dispatch('searchLgspCongDan', filter).then(result => {
            vm.loadingSearchLgsp = false
            vm.applicantLgspInfomation = result
            vm.warningLgsp = false
            if (vm.applicantLgspInfomation && vm.applicantLgspInfomation.hasOwnProperty('SoLuongCongDan') && String(vm.applicantLgspInfomation["SoLuongCongDan"]) != '0') {
              vm.lgspAlertColor = 'green'
              vm.warningLgsp = true
              vm.messageLgsp = 'Số CCCD/ CMND: "' + vm.applicantIdNoLgsp + '", họ tên: "' + vm.applicantNameLgsp + '" có thông tin trên CSDL quốc gia về dân cư'
              // vm.dialog_searchLgsp = false
              // Lấy thông tin thường trú
              let dataThuongTru = {
                ThuongTruTinhThanh: '',
                ThuongTruQuanHuyen: '',
                ThuongTruXaPhuong: ''
              }
              let city = vm.citys.find(function (item) {
                return item.itemCode == vm.applicantLgspInfomation.ThuongTru.MaTinhThanh
              })
              dataThuongTru.ThuongTruTinhThanh = city ? city.itemName : ''
              if (city) {
                vm.$store.getters.getDictItems({
                  collectionCode: 'ADMINISTRATIVE_REGION',
                  level: 1,
                  parent: city.itemCode
                }).then(function (resultDistricts) {
                  let quanhuyen = resultDistricts.data.find(function (item) {
                    return item.itemCode == vm.applicantLgspInfomation.ThuongTru.MaQuanHuyen
                  })
                  dataThuongTru.ThuongTruQuanHuyen = quanhuyen ? quanhuyen.itemName : ''
                  if (quanhuyen) {
                    vm.$store.getters.getDictItems({
                      collectionCode: 'ADMINISTRATIVE_REGION',
                      level: 1,
                      parent: quanhuyen.itemCode
                    }).then(function (resultWards) {
                      let xaphuong = resultWards.data.find(function (item) {
                        return item.itemCode == vm.applicantLgspInfomation.ThuongTru.MaPhuongXa
                      })
                      dataThuongTru.ThuongTruXaPhuong = xaphuong ? xaphuong.itemName : ''
                      vm.diaChiThuongTruTraCuuQr = dataThuongTru.ThuongTruXaPhuong + ', ' + dataThuongTru.ThuongTruQuanHuyen + ', ' + dataThuongTru.ThuongTruTinhThanh
                      console.log('diaChiThuongTruTraCuuQr', vm.diaChiThuongTruTraCuuQr)
                    })
                  }
                })
              }

              let dataNoiOHienTai = {
                TinhThanh: '',
                QuanHuyen: '',
                XaPhuong: ''
              }
              let city1 = vm.citys.find(function (item) {
                return item.itemCode == vm.applicantLgspInfomation.NoiOHienTai.MaTinhThanh
              })
              dataNoiOHienTai.TinhThanh = city1 ? city1.itemName : ''
              if (city1) {
                vm.$store.getters.getDictItems({
                  collectionCode: 'ADMINISTRATIVE_REGION',
                  level: 1,
                  parent: city1.itemCode
                }).then(function (resultDistricts) {
                  let quanhuyen = resultDistricts.data.find(function (item) {
                    return item.itemCode == vm.applicantLgspInfomation.NoiOHienTai.MaQuanHuyen
                  })
                  dataNoiOHienTai.QuanHuyen = quanhuyen ? quanhuyen.itemName : ''
                  if (quanhuyen) {
                    vm.$store.getters.getDictItems({
                      collectionCode: 'ADMINISTRATIVE_REGION',
                      level: 1,
                      parent: quanhuyen.itemCode
                    }).then(function (resultWards) {
                      let xaphuong = resultWards.data.find(function (item) {
                        return item.itemCode == vm.applicantLgspInfomation.NoiOHienTai.MaPhuongXa
                      })
                      dataNoiOHienTai.XaPhuong = xaphuong ? xaphuong.itemName : ''
                      vm.noiOHienTaiTraCuuQr = vm.applicantLgspInfomation.NoiOHienTai.ChiTiet + ' ' + dataNoiOHienTai.XaPhuong + ', ' + dataNoiOHienTai.QuanHuyen + ', ' + dataNoiOHienTai.TinhThanh
                    })
                  }
                })
              }
              // 
            } else {
              // vm.dialog_searchLgsp = true
              vm.lgspAlertColor = 'red'
              vm.warningLgsp = true
              vm.messageLgsp = 'Số CCCD/ CMND: "' + vm.applicantIdNoLgsp + '", họ tên: "' + vm.applicantNameLgsp + '" không có thông tin trên CSDL quốc gia về dân cư'
            }
          }).catch(function (result) {
            vm.lgspAlertColor = 'red'
            vm.loadingSearchLgsp = false
            vm.applicantLgspInfomation = ''
            vm.warningLgsp = true
            vm.messageLgsp = "Số CCCD/ CMND: " + String(vm.applicantIdNoLgsp).trim() + ", họ tên: " + String(vm.applicantNameLgsp).trim() + " không có thông tin trên CSDL quốc gia về dân cư"
            
            if (result.hasOwnProperty('errorCode')) {
              let errorCode = result.errorCode
              switch(errorCode) {
                case "004":
                  vm.messageLgsp = "Thủ tục chưa được cấp phép khai thác CSDL dân cư";
                  break;
                case "005":
                  vm.messageLgsp = "Tài khoản cán bộ không có quyền thao tác";
                  break;
                default:
                  vm.messageLgsp = "Số CCCD/ CMND: " + String(vm.applicantNameLgsp).trim() + ", họ tên: " + String(vm.applicantNameLgsp).trim() + " không có thông tin trên CSDL quốc gia về dân cư"
              }
            }
          })
        } else {
          toastr.error('Vui lòng nhập đầy đủ số CCCD/ CMND, họ tên và ngày sinh để tra cứu')
        }
      },
      closeSearchLgsp () {
        let vm = this
        vm.dialog_searchLgsp = false
      },
      formatDate(date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      getMaxdate () {
        let date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      },
      parseDateInput (dateInput) {
        if (dateInput) {
          let date = ''
          if (isNaN(dateInput)) {
            date = new Date(dateInput)
          } else {
            date = new Date(Number(dateInput))
          }
          let dateFormated = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
          return dateFormated
        }
      },
      parseDate(date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      convertString(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        str = str.replace(/đ/g, 'd')
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
        str = str.replace(/Đ/g, 'D')
        str = str.toLocaleLowerCase().replace(/\s/g, '')
        return str
      },
      formatNgaySinh (date) {
        if (!date) {
          return ''
        }
        return date.slice(6,8) + '/' + date.slice(4,6) + '/' + date.slice(0,4)
      },
      getTinhTrangHonNhan(tinhtrang) {
        if (tinhtrang == '2') {
          return 'Đang có vợ/ chồng'
        } else if (tinhtrang == '1') {
          return 'Chưa kết hôn'
        } else if (tinhtrang == '3') {
          return 'Đã ly hôn hoặc góa vợ/ chồng'
        } else {
          return 'Chưa có thông tin'
        }
      },
      getTenDanhMuc (code, danhmuc) {
        let vm = this
        if (code) {
          if (danhmuc === 'tongiao') {
            let dm = vm.danhmuctongiao.find(function (item) {
              return Number(item.TONGIAO) == Number(code)
            })
            return dm ? dm.TENTONGIAO : ''
          } else if (danhmuc === 'dantoc') {
            let dm = vm.danhmucdantoc.find(function (item) {
              return Number(item.MADANTOC) == Number(code)
            })
            return dm ? dm.TENGOI : ''
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      getNhomMau(nhommau) {
        if (nhommau == '00') {
          return 'Chưa có thông tin'
        } else if (nhommau == '01') {
          return 'Nhóm máu A'
        } else if (nhommau == '02') {
          return 'Nhóm máu B'
        } else if (nhommau == '03') {
          return 'Nhóm máu AB'
        } else if (nhommau == '04') {
          return 'Nhóm máu O'
        } else {
          return 'Chưa có thông tin'
        }
      },
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
