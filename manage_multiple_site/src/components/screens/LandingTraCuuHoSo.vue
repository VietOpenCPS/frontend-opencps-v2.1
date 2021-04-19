<template>
    <div>
      <div class="row-header no__hidden_class">
        <div v-if="trangThaiHoSoList !== null" class="background-triangle-big">
          <span v-if="!boNganh">DANH SÁCH HỒ SƠ DỊCH VỤ HÀNH CHÍNH CÔNG</span>
          <span v-if="boNganh">TRA CỨU THÔNG TIN HỒ SƠ</span>
        </div>
        <div class="layout row wrap header_tools row-blue">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              <v-icon size="16">reply</v-icon> &nbsp; Quay lại 
            </v-btn>
          </div>
        </div>
      </div>
      <v-form ref="form" v-model="validFormSearch" lazy-validation>
        <v-layout wrap>
          <div class="adv_search my-2 px-2" :style="!boNganh ? 'background: #eeeeee' : 'background: #eeeeee;width: 100%'">
            <div :class="!boNganh ? 'searchAdvanced-content pb-3' : 'searchAdvanced-content py-3'">
              <v-layout wrap>
                <v-flex xs12 class="px-2" v-if="!boNganh && !donViHuyen">
                  <v-layout wrap align-center>
                    <v-flex class="text-bold" style="font-weight:450;width: 200px;">Cấp đơn vị thực hiện:</v-flex>
                    <v-flex style="width: calc(100% - 200px);">    
                      <v-radio-group v-model="capCoQuanThucHien" row class="mt-2">
                        <v-radio v-for='(item, index) in administrationList' :key='index' :value="item.groupCode">
                          <div v-if="item.groupCode === 'XA_PHUONG'" slot="label">
                            <v-menu right offset-x class="d-inline-block">
                              <span small slot="activator" color="primary">
                                {{item.groupName}} <span v-if="quanhuyenSelected">/ Cấp xã {{quanhuyenSelected.itemName}}</span>&nbsp;<v-icon size="18" class="text-bold">arrow_drop_down</v-icon>
                              </span>
                              <v-list>
                                <v-list-tile v-for="(item, index) in listDoiTuong" :key="index" @click="getAgencys(capCoQuanThucHien, item)">
                                  <v-list-tile-title><v-icon size="18" class="blue--text" v-if="quanhuyenSelected.itemCode === item.itemCode">check</v-icon>&nbsp; Cấp xã {{item.itemName}}</v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </div>
                          <span v-else slot="label">
                            {{item.groupName}}
                          </span>
                          
                        </v-radio>
                      </v-radio-group>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex class="mb-2 px-2 xs12" :class="donViHuyen ? 'mt-2' : ''">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Đơn vị thực hiện<span style="color: red" > (*)</span>:</div>
                    <v-autocomplete
                      placeholder="Chọn đơn vị thực hiện"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 200px);"
                      :items="govAgencyList"
                      v-model="govAgencyFilter"
                      item-text="itemName"
                      item-value="itemCode"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      clearable
                      required
                      :rules="[v => !!v || 'Chọn đơn vị thực hiện']"
                    >
                    </v-autocomplete>
                  </div>
                </v-flex>
                <v-flex xs12 class="mb-2 px-2">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Lĩnh vực:</div>
                    <v-autocomplete
                      placeholder="Chọn lĩnh vực"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 200px);"
                      :items="domainList"
                      v-model="domainFilter"
                      item-text="domainName"
                      item-value="domainCode"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      clearable
                    ></v-autocomplete>
                  </div>
                </v-flex>
                <v-flex xs12 class="mb-2 px-2">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Thủ tục:</div>
                    <v-autocomplete
                      placeholder="Chọn thủ tục"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 200px)"
                      :items="serviceInfoList"
                      v-model="serviceFilter"
                      item-text="serviceName"
                      item-value="serviceCode"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      clearable
                    ></v-autocomplete>
                  </div>
                </v-flex>
                <v-flex xs12 sm6 class="mb-2 px-2">
                  <div class="layout wrap">
                    <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 200px;">Ngày tiếp nhận:</div>
                    <v-layout wrap style="width: calc(100% - 200px);">
                      <v-flex xs6>
                        <v-menu
                          ref="menuDate1"
                          v-model="menuDate1"
                          :close-on-content-click="true"
                          transition="scale-transition"
                          offset-y
                          full-width
                        >
                          <v-text-field
                          slot="activator"
                          class="search-input-appbar input-search"
                          v-model="fromReceiveDateFormatted"
                          persistent-hint
                          append-icon="event"
                          @blur="fromReceiveDate = parseDate(fromReceiveDateFormatted)"
                          placeholder="Từ ngày"
                          hide-details
                          solo
                          flat
                          height="32"
                          min-height="32"
                          append-outer-icon="remove"
                          clearable
                          >
                            <template slot='append-outer'>
                              <v-icon color="primary">remove</v-icon>
                            </template>
                          </v-text-field>
                          <v-date-picker :max="toReceiveDateFormatted ? getMinMax(toReceiveDateFormatted) : null" v-model="fromReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('1')"></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6 class="pl-2">
                        <v-menu
                          ref="menuDate2"
                          v-model="menuDate2"
                          :close-on-content-click="true"
                          transition="scale-transition"
                          offset-y
                          full-width
                        >

                          <v-text-field
                          slot="activator"
                          class="search-input-appbar input-search"
                          v-model="toReceiveDateFormatted"
                          persistent-hint
                          append-icon="event"
                          @blur="toReceiveDate = parseDate(toReceiveDateFormatted)"
                          placeholder="Đến ngày"
                          hide-details
                          solo
                          flat
                          height="32"
                          min-height="32"
                          clearable
                          ></v-text-field>
                          <v-date-picker :min="fromReceiveDateFormatted ? getMinMax(fromReceiveDateFormatted) : null" v-model="toReceiveDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('2')"></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </div>
                </v-flex>
                <v-flex xs12 sm6 class="mb-2 px-2">
                  <div class="layout wrap">
                    <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 200px;">Ngày hẹn trả:</div>
                    <v-layout wrap style="width: calc(100% - 200px);">
                      <v-flex xs6>
                        <v-menu
                          ref="menuDate5"
                          v-model="menuDate5"
                          :close-on-content-click="true"
                          transition="scale-transition"
                          offset-y
                          full-width
                        >
                          <v-text-field
                          slot="activator"
                          class="search-input-appbar input-search"
                          v-model="fromReleaseDateFormatted"
                          persistent-hint
                          append-icon="event"
                          @blur="fromReleaseDate = parseDate(fromReleaseDateFormatted)"
                          placeholder="Từ ngày"
                          hide-details
                          solo
                          flat
                          height="32"
                          min-height="32"
                          clearable
                          >
                            <template slot='append-outer'>
                              <v-icon color="primary">remove</v-icon>
                            </template>
                          </v-text-field>
                          <v-date-picker :max="toReleaseDateFormatted ? getMinMax(toReleaseDateFormatted) : null" v-model="fromReleaseDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('5')"></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs6 class="pl-2">
                        <v-menu
                          ref="menuDate6"
                          v-model="menuDate6"
                          :close-on-content-click="true"
                          transition="scale-transition"
                          offset-y
                          full-width
                        >
                          <v-text-field
                          slot="activator"
                          class="search-input-appbar input-search"
                          v-model="toReleaseDateFormatted"
                          persistent-hint
                          append-icon="event"
                          @blur="toReleaseDate = parseDate(toReleaseDateFormatted)"
                          placeholder="Đến ngày"
                          hide-details
                          solo
                          flat
                          height="32"
                          min-height="32"
                          clearable
                          ></v-text-field>
                          <v-date-picker :min="fromReleaseDateFormatted ? getMinMax(fromReleaseDateFormatted) : null" v-model="toReleaseDate" locale="vi" :first-day-of-week="1" no-title @input="changeDate('6')"></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>

                  </div>
                </v-flex>
                <v-flex xs12 sm6 class="mb-2 px-2">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;">Mã hồ sơ :</div>
                    <v-text-field
                      placeholder="Nhập mã hồ sơ"
                      v-model="dossierNoKey"
                      class="search-input-appbar input-search d-inline-block"
                      style="width: calc(100% - 200px);"
                      single-lines
                      hide-details
                      solo
                      flat
                      height="32"
                      min-height="32"
                      clearable
                    ></v-text-field>
                  </div>
                </v-flex>
                <v-flex xs12 sm6 class="mb-2 px-2">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;" v-if="boNganh">Tình trạng hồ sơ :</div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 200px;" v-else>Trạng thái hồ sơ :</div>
                    <v-autocomplete
                      :placeholder="boNganh ? 'Chọn tình trạng' : 'Chọn trạng thái'"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 200px)"
                      :items="statusList"
                      v-model="statusFilter"
                      item-text="title"
                      item-value="key"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      clearable
                    ></v-autocomplete>
                  </div>
                </v-flex>
              </v-layout>
              
              <v-flex class="xs12 mx-2">
                <v-btn :loading="loadingTable" :style="loadingTable ? 'pointer-events: none' : ''" class="mx-0 mb-0" color="primary" dark @click.native="getDossiers('reset')">
                  <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
                </v-btn>
              </v-flex>
            </div>
          </div>

        </v-layout>

      </v-form>

      <v-data-table
        :headers="dossierListHeader"
        :items="dossierList"
        hide-actions
        class="table-landing table-bordered mt-3"
        style="border-left: 1px solid #dedede"
        no-data-text="Không có hồ sơ"
      >
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;" @click="viewDetailDossier(props.item)">
            <td class="text-xs-center" style="width:50px;height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{ dossierPage * limitRecord - limitRecord + props.index + 1 }}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.dossierNo}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.dossierName}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;min-width:200px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.applicantName}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;min-width:200px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.govAgencyName}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;width:100px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.receiveDate}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;width:100px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.dueDate}}</span>
              </div>
            </td>
            <td class="text-xs-left" style="height:36px;width:150px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.dossierSubStatusText ? props.item.dossierSubStatusText : props.item.dossierStatusText}}</span>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!--  -->
      <div class="my-2">
        <div class="text-xs-right layout wrap" style="position: relative;">
          <div class="flex pagging-table"> 
            <tiny-pagination :total="totalDossierSearch" :page="dossierPage" :numberPerPage="limitRecord" nameRecord="hồ sơ" custom-class="custom-tiny-class" 
              @tiny:change-page="changePage" ></tiny-pagination> 
          </div>
        </div>
      </div>
      <!--  -->
      <v-dialog v-model="dialogDetailDossier" max-width="1200" transition="fade-transition">
        <v-card flat>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Thông tin hồ sơ</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialogDetailDossier = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pt-0 pb-0 px-0">
            <v-expansion-panel :value="[true]" expand >
              <v-expansion-panel-content>
                <div slot="header" class="pl-3"><span class="text-bold">I. </span> THÔNG TIN CHUNG HỒ SƠ</div>
                <v-card>
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
                      </v-flex>
                      <!--  -->
                      <v-flex xs12 sm4>
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
                      <!--  -->
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
                        <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                          v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                          thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                          Ghi chú:
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            
            <v-expansion-panel :value="[true]" expand >
              <v-expansion-panel-content>
                <div slot="header" class="pl-3"><span class="text-bold">II. </span> TIẾN TRÌNH XỬ LÝ</div>
                <v-card>
                  <v-card-text class="py-0 mt-2">
                    <v-data-table :headers="headersTienTrinh" :items="dossierActions" class="table-landing table-bordered"
                    hide-actions no-data-text="Không có thông tin tiến trình xử lý"
                    >
                      <template slot="headerCell" slot-scope="props">
                        <v-tooltip bottom>
                          <span slot="activator">
                            {{ props.header.text }}
                          </span>
                          <span>
                            {{ props.header.text }}
                          </span>
                        </v-tooltip>
                      </template>
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-center">{{props.index + 1}}</td>
                        <td class="text-xs-left">{{props.item.sequenceRole}}</td>
                        <td class="text-xs-left">{{props.item.sequenceName}}</td>
                        <td class="text-xs-left">{{props.item.durationCount|getThoiHanQuyDinh}}</td>
                        <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                        <td class="text-xs-left">
                          <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                            {{itemUser.userName}} <br>
                          </div>
                        </td>
                        <td class="text-xs-left">
                          <div v-for="(itemAction, index) in props.item.actions" :key="index">
                            {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                            <span v-if="itemAction.actionNote && itemAction.actionNote !== 'null'"> - <i>{{itemAction.actionNote}}</i></span>
                            
                          </div>
                          <div v-if="props.item.statusText">
                            <span style="color: green" v-if="thongTinChiTietHoSo['dossierStatus'] === 'done' || thongTinChiTietHoSo['dossierStatus'] === 'unresolved'">
                              {{props.item.statusText.replace("Đang thực hiện:", "")}}
                            </span>
                            <span style="color: green" v-else>
                              {{props.item.statusText}}
                            </span>
                          </div>
                        </td>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card-text>
          <v-card-actions class="mx-2">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click.native="dialogDetailDossier = false"
              >
              <v-icon class="white--text">close</v-icon>&nbsp;
              Thoát
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import toastr from 'toastr'
  import TinyPagination from './Pagination'
  Vue.use(toastr)

  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    data: () => ({
      loadingTable: false,
      agencySiteList: [],
      listDonVi: [],
      domainList: [],
      serviceInfoList: [],
      statusList: [],
      statusFilter: '',
      domainFilter: '',
      serviceFilter: '',
      donviSelect: '',
      groupIdDonVi: '',
      capCoQuanThucHien: '',
      validFormSearch: false,
      administrationList: [],
      listDoiTuong: [],
      listQuanHuyen: [],
      quanHuyenSelect: '',
      govAgencyList: [],
      govAgencyFilter: '',
      dossierNoKey: '',
      dossierList: [],
      limitRecord: 20,
      numberPerPage: 20,
      dossierPage: 1,
      totalDossierSearch: 0,
      thongTinChiTietHoSo: '',
      dialogDetailDossier: false,
      dossierActions: [],
      quanhuyenSelected: '',
      boNganh: false,
      donViHuyen: false,
      menuDate1: false,
      fromReceiveDate: '',
      fromReceiveDateFormatted: '',
      menuDate2: false,
      toReceiveDate: '',
      toReceiveDateFormatted: '',
      menuDate5: false,
      fromReleaseDate: '',
      fromReleaseDateFormatted: '',
      menuDate6: false,
      toReleaseDate: '',
      toReleaseDateFormatted: '',
      dossierListHeader: [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Mã hồ sơ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Nội dung',
          align: 'center',
          sortable: false
        },
        {
          text: 'Chủ hồ sơ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Đơn vị thực hiện',
          align: 'center',
          sortable: false
        },
        {
          text: 'Ngày tiếp nhận',
          align: 'center',
          sortable: false
        },
        {
          text: 'Ngày hẹn trả',
          align: 'center',
          sortable: false
        },
        {
          text: 'Trạng thái',
          align: 'center',
          sortable: false
        }
      ],
      headersTienTrinh: [
        {
          text: '#',
          align: 'center',
          sortable: false
        },
        {
          text: 'Vai trò',
          align: 'center',
          sortable: false,
          class: 'vaitro_column'
        }, {
          text: 'Công việc',
          align: 'center',
          sortable: false,
          class: 'congviec_column'
        }, 
        {
          text: 'Thời hạn quy định',
          align: 'center',
          sortable: false,
          class: 'thoihanquydinh_column'
        }, 
        {
          text: 'Ngày bắt đầu',
          align: 'center',
          sortable: false,
          class: 'ngaybatdau_column'
        }, {
          text: 'Người thực hiện',
          align: 'center',
          sortable: false,
          class: 'nguoithuchien_column'
        }, {
          text: 'Kết quả',
          align: 'center',
          sortable: false,
          class: 'ketqua_column'
        }
      ],
    }),
    components: {
      'tiny-pagination': TinyPagination
    },
    computed: {
    },
    beforeDestroy () {

    },
    mounted () {
     let vm = this

    },
    beforeCreate() {

    },
    created () {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      try {
        vm.donViHuyen = donViHuyen
        // sử dụng cho các đơn vị huyện quản lý hồ sơ cấp xã
      } catch (error) {
      }
      try {
        vm.boNganh = boNganh
        // sử dụng cho các đơn vị bộ ngành
      } catch (error) {
      }
      if (!vm.boNganh) {
        vm.getAgencyConfigs()
        if (vm.donViHuyen) {
          vm.capCoQuanThucHien = 'CAP_XA'
          vm.getDomains('CAP_XA')
          vm.getServiceInfo('CAP_XA')
        } else {
          vm.getServiceAdminisTration()
        }
      } else {
        try {
          vm.statusList = statusListConfig
          vm.statusFilter = vm.statusList.filter(function(item) {
            return item.hasOwnProperty('selected') && item.selected
          })[0]['key']
        } catch (error) {
        }
        vm.getAgencyConfigs()
        vm.getDomains()
        vm.getServiceInfo()
      }
      
    },
    watch: {
      capCoQuanThucHien (val) {
        let vm = this
        if (!vm.donViHuyen) {
          vm.govAgencyFilter = ''
          vm.domainFilter = ''
          vm.serviceFilter = ''
          vm.quanhuyenSelected = ''
          if(val){
            vm.getAgencys(val)
            if (val === 'XA_PHUONG') {
              vm.getDictcollectionsQuanHuyen()
            }
            if (val === 'QUAN_HUYEN' || val === 'XA_PHUONG') {
              vm.getDomains(val === 'QUAN_HUYEN' ? 'CAP_HUYEN' : 'CAP_XA')
              vm.getServiceInfo(val === 'QUAN_HUYEN' ? 'CAP_HUYEN' : 'CAP_XA', vm.domainFilter)
            } else {
              vm.domainList = []
              vm.serviceInfoList = []
            }
          }
        }
      },

      govAgencyFilter (val) {
        let vm = this
        if (!vm.boNganh) {
          if (!vm.donViHuyen) {
            if (val) {
              if (vm.agencySiteList.length > 0) {
                try {
                  vm.groupIdDonVi = vm.agencySiteList.filter(function (item) {
                    return item.itemCode === val
                  })[0]['value']
                  vm.getStatusList()
                } catch (error) {
                }
              }
              if (!vm.groupIdDonVi) {
                vm.getServerAgency(val)
              }
              if (vm.capCoQuanThucHien === 'SBN') {
                vm.domainFilter = ''
                vm.serviceFilter = ''
                vm.getDomains(val)
                vm.getServiceInfo(val, vm.domainFilter)
              }
            } else {
              if (vm.capCoQuanThucHien === 'SBN') {
                vm.domainList = []
                vm.serviceInfoList = []
                vm.statusList = []
                vm.domainFilter = ''
                vm.serviceFilter = ''
                vm.statusFilter = ''
              }
            }
          }
        } else {
          vm.domainFilter = ''
          vm.serviceFilter = ''
          vm.getDomains(val)
          vm.getServiceInfo(val, vm.domainFilter)
        }
      },
      domainFilter (val) {
        let vm = this
        if (val) {
          if (vm.capCoQuanThucHien === 'QUAN_HUYEN' || vm.capCoQuanThucHien === 'XA_PHUONG') {
            vm.getServiceInfo(vm.capCoQuanThucHien === 'QUAN_HUYEN' ? 'CAP_HUYEN' : 'CAP_XA', val)
          } else {
            vm.getServiceInfo(vm.govAgencyFilter, val)
          }
        }
      }
    },
    methods: {
      getServiceAdminisTration () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let sortCode = function (serviceList) {
          function compare(a, b) {
            if (a.dictGroupId < b.dictGroupId)
              return -1
            if (a.dictGroupId > b.dictGroupId)
              return 1
            return 0
          }
          return serviceList.sort(compare)
        }
        vm.$store.dispatch('getServiceAdminisTration', {}).then(
          res => {
            vm.administrationList = sortCode(res)
            vm.capCoQuanThucHien = 'SBN'
            vm.getAgencys('SBN')
            vm.getAgencys('QUAN_HUYEN')
          }
        ).catch(()=>{})
      },
      getAgencys(administrationCode, parentFilter) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let data = {
          administration: administrationCode ? administrationCode : '',
          parent: parentFilter ? parentFilter.itemCode : ''
        }
        if (!parentFilter) {
          vm.$store.dispatch('getAgencys', data).then(
            res => {
              vm.govAgencyList = res
              if (administrationCode === 'QUAN_HUYEN') {
                vm.listDoiTuong = vm.govAgencyList
              }
            }
          ).catch(()=>{
            vm.govAgencyList = []
          }) 
        } else {
          vm.quanhuyenSelected = parentFilter
          vm.$store.dispatch('getAgencysFromParent', data).then(
            res => {
              vm.govAgencyList = res
            }
          ).catch(()=>{
            vm.govAgencyList = []
          }) 
        }
             
      },
      getAgencysBoNganh() {
        let vm = this
        let data = {}
        vm.govAgencyList = []
        vm.$store.dispatch('getAgencysFromDict', data).then(
          res => {
            vm.govAgencyList = res
          }
        ).catch(()=>{
          vm.govAgencyList = []
        })
      },
      getServerAgency (agencyCode) {
        let vm = this
        let data = {
          serverNo: agencyCode ? 'SERVER_' + agencyCode : ''
        }
        vm.groupIdDonVi = ''
        vm.$store.dispatch('getServerConfig', data).then(
          res => {
            try {
              vm.groupIdDonVi = JSON.parse(res.configs)['groupId']
            } catch (error) {
            }
            vm.getStatusList()
          }
        ).catch(()=>{
          vm.groupIdDonVi = ''
        })
      },
      getAgencyConfigs () {
        let vm = this
        let param = {
          headers: {
            groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
            Token: window.Liferay ? window.Liferay.authToken : ''
          }
        }
        
        let dataGet = {}
        let dataPost = new URLSearchParams()
        dataPost.append('method', 'GET')
        dataPost.append('serverCode', 'SERVER_DVC')
        dataPost.append('url', '/serverconfigs/GROUP_ID_SITE_MOTCUA')
        dataPost.append('data', JSON.stringify(dataGet))
        axios.post('/o/rest/v2/proxy', dataPost, param).then(function (response) {
          let serializable = response.data
          let configs = JSON.parse(serializable.configs)
          if (!vm.boNganh) {
            vm.agencySiteList = configs['groupIds']
            let groupHuyen = vm.agencySiteList.filter(function(item) {
              return item.value == window.themeDisplay.getScopeGroupId()
            })[0]
            let groupSiteCapXa = vm.agencySiteList.filter(function(item) {
              return item.hasOwnProperty('parent') && item.parent === groupHuyen['code']
            })[0]
            vm.groupIdDonVi = groupSiteCapXa['value']
            vm.getStatusList()
            let param = {
              groupIdTrungTam: 968548,
              parent: groupHuyen['code']
            }
            vm.$store.dispatch('getAgencysFromParent', param).then(
              res => {
                vm.govAgencyList = res
              }
            ).catch(()=>{
              vm.govAgencyList = []
            })
          } else {
            vm.govAgencyList = configs['groupIds']
          }
          
        }).catch(function (xhr) {
        })
      },
      getDomains (agencyCode) {
        let vm = this
        let data = {
          agency: agencyCode ? agencyCode : ''
        }
        vm.domainList = []
        vm.$store.dispatch('getDomains', data).then(
          res => {
            vm.domainList = res
          }
        ).catch(()=>{
          vm.domainList = []
        })      
      },
      getServiceInfo (agencyCode, domainCode) {
        let vm = this
        let data = {
          domain: domainCode ? domainCode : '',
          agency: agencyCode ? agencyCode : ''
        }
        vm.serviceInfoList = []
        vm.$store.dispatch('getServiceInfo', data).then(function(res) {
          vm.serviceInfoList = res
        }).catch(()=>{
          vm.serviceInfoList = []
        })  
      },
      getDictcollectionsQuanHuyen () {
        let vm = this
        let filter = {
          groupCode: 'QUAN_HUYEN'
        }
        vm.$store.dispatch('getDictcollections', filter).then(
          res => {
            vm.listQuanHuyen = res.data
          }
        ).catch(()=>{})
      },
      getStatusList () {
        let vm = this
        let filter = {
          groupId: vm.groupIdDonVi
        }
        vm.$store.dispatch('getStatus', filter).then(
          res => {
            vm.statusList = res
          }
        ).catch(()=>{})
      },
      getDossiers (reset) {
        let vm = this
        if (reset) {
          vm.dossierPage = 1
        }
        vm.loadingTable = true
        let params = {
          groupId: vm.groupIdDonVi ? vm.groupIdDonVi : '',
          start:  vm.dossierPage * vm.limitRecord - vm.limitRecord,
          end: vm.dossierPage * vm.limitRecord,
          agency: vm.govAgencyFilter ? vm.govAgencyFilter : '',
          domain: vm.domainFilter ? vm.domainFilter : '',
          service: vm.serviceFilter ? vm.serviceFilter : '',
          dossierNo: vm.dossierNoKey,
          status: vm.statusFilter,
          fromReceiveDate: vm.fromReceiveDateFormatted ? vm.fromReceiveDateFormatted : '',
          toReceiveDate: vm.toReceiveDateFormatted ? vm.toReceiveDateFormatted : '',
          fromReleaseDate: vm.fromReleaseDateFormatted ? vm.fromReleaseDateFormatted : '',
          toReleaseDate: vm.toReleaseDateFormatted ? vm.toReleaseDateFormatted : ''
        }
        if (!vm.boNganh) {
          vm.$store.dispatch('getDossiers', params).then(res => {
            vm.loadingTable = false
            vm.totalDossierSearch = res.total
            if (res.data) {
              vm.dossierList = res.data
            } else {
              vm.dossierList = []
              vm.totalDossierSearch = 0
            }
          }).catch(() => {
            vm.loadingTable = false
            vm.dossierList = []
            vm.totalDossierSearch = 0
          })
        } else {
          vm.$store.dispatch('getDossiersFromDvc', params).then(res => {
            vm.loadingTable = false
            vm.totalDossierSearch = res.total
            if (res.data) {
              vm.dossierList = res.data
            } else {
              vm.dossierList = []
              vm.totalDossierSearch = 0
            }
          }).catch(() => {
            vm.loadingTable = false
            vm.dossierList = []
            vm.totalDossierSearch = 0
          })
        }
      },
      getDetailDossier (data) {
        let vm = this
        let config = {
          headers: {
            groupId: vm.groupIdDonVi ? vm.groupIdDonVi : window.themeDisplay.getScopeGroupId()
          },
          params: {}
        }
        if (!vm.boNganh) {
          let url = '/o/rest/v2/dossiers/' + data.dossierId
          axios.get(url, config).then(function (response) {
            vm.thongTinChiTietHoSo = response.data
            vm.loadDossierActions(vm.thongTinChiTietHoSo)
          })
        } else {
          let dataPost = new URLSearchParams()
          let textPost = {}
          dataPost.append('method', 'GET')
          dataPost.append('url', '/dossiers/' + data.dossierId)
          dataPost.append('data', JSON.stringify(textPost))

          axios.post('/o/rest/v2/proxy', dataPost, config).then(function (response) {
            vm.thongTinChiTietHoSo = response.data
            if (!vm.boNganh) {
              vm.loadDossierActions(vm.thongTinChiTietHoSo)
            } else {
              try {
                let resultTemp = JSON.parse(vm.thongTinChiTietHoSo['submissionNote'])['data']
                for (let i = 0; i < resultTemp.length; i++) {
                  if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                    if (!Array.isArray(resultTemp[i]['actions'])) {
                      let arrActionsTemp = []
                      arrActionsTemp.push(resultTemp[i]['actions'])
                      resultTemp[i]['actions'] = arrActionsTemp
                    }
                  }
                }
                vm.dossierActions = resultTemp
              } catch (error) {
                vm.dossierActions = []
              }
            }
          }, error => {
            reject(error)
          })
        }
        
      },
      loadDossierActions (data) {
        let vm = this
        let config = {
          headers: {
            groupId: vm.groupIdDonVi ? vm.groupIdDonVi : window.themeDisplay.getScopeGroupId()
          },
          params: {}
        }
        let url = '/o/rest/v2/dossiers/' + data.dossierId + '/sequences'
        axios.get(url, config).then(function (response) {
          if (response.data) {
            let resultTemp = response.data.data
            for (let i = 0; i < resultTemp.length; i++) {
              if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                if (!Array.isArray(resultTemp[i]['actions'])) {
                  let arrActionsTemp = []
                  arrActionsTemp.push(resultTemp[i]['actions'])
                  resultTemp[i]['actions'] = arrActionsTemp
                }
              }
            }
            vm.dossierActions = resultTemp
          } else {
            vm.dossierActions = []
          }
          
        }).catch(function (xhr) {
        })

      },
      changePage (config) {
        let vm = this
        vm.limitRecord = config.numberPerPage ? config.numberPerPage : 20
        vm.dossierPage = config.page
        vm.getDossiers()
      },
      viewDetailDossier (data) {
        let vm = this
        vm.getDetailDossier(data)
        setTimeout(function() {
          vm.dialogDetailDossier = true
        }, 100)
      },
      durationText(durationUnit, durationCount) {
        let durationText
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
      parseDate(date) {
        if (!date) return ''
        if (String(date).indexOf('/') > 0) {
          const [day, month, year] = date.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        } else if (String(date).indexOf('-') > 0) {
          const [day, month, year] = date.split('-')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        } else {
          let date1 = new Date(Number(date))
          return `${date1.getFullYear()}-${(date1.getMonth() + 1).toString().padStart(2, '0')}-${date1.getDate().toString().padStart(2, '0')}`
        }
      },
      getMinMax (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
      },
      formatDate(date) {
        if (!date) return ''
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      changeDate(index) {
        let vm = this
        vm.menuDate1 = vm.menuDate2 = vm.menuDate5 = vm.menuDate6 = false
        if (index === '1') {
          vm.fromReceiveDateFormatted = vm.formatDate(vm.fromReceiveDate)
        } else if (index === '2') {
          vm.toReceiveDateFormatted = vm.formatDate(vm.toReceiveDate)
        } else if (index === '5') {
          vm.fromReleaseDateFormatted= vm.formatDate(vm.fromReleaseDate)
        } else if (index === '6') {
          vm.toReleaseDateFormatted= vm.formatDate(vm.toReleaseDate)
        }
      },
      goBack () {
        window.history.back()
      },
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(Number(arg))
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      },
      getThoiHanQuyDinh (val) {
        if (val > 0) {
          return val + ' ngày'
        } else {
          return ''
        }
      }
    }
  }
</script>

