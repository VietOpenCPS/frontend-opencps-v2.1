<template>
    <div>
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span>DANH SÁCH HỒ SƠ QUÁ HẠN</span>
        </div>
      </div>
      <v-form ref="form" v-model="validFormSearch" lazy-validation>
        <v-layout wrap>
          <div class="adv_search my-2 px-2" style="background: #eeeeee">
            <div class="searchAdvanced-content py-3">
              <v-layout wrap>
                <v-flex xs12 class="mb-3 px-2" v-if="siteTrungTam">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Đơn vị:</div>
                    <v-autocomplete
                      placeholder="Chọn đơn vị"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 130px)"
                      :items="agencyList"
                      v-model="agencyFilter"
                      item-text="text"
                      item-value="code"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      return-object
                      @change="changeAgency"
                    ></v-autocomplete>
                  </div>
                </v-flex>
                <v-flex xs12 class="mb-3 px-2" v-if="siteTrungTam && agencyFilter.hasOwnProperty('hasChildrenSite')">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">{{ agencyFilter.labelGroup }}:</div>
                    <v-autocomplete
                      placeholder="Chọn"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 130px)"
                      :items="agencyChildrenList"
                      v-model="agencyChildrenFilter"
                      item-text="text"
                      item-value="code"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      return-object
                      clearable
                    ></v-autocomplete>
                  </div>
                </v-flex>
                <v-flex xs12 class="mb-3 px-2" v-if="agencyFilter && agencyFilter.hasOwnProperty('parent')">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Đơn vị xã, phường:</div>
                    <v-autocomplete
                      placeholder="Chọn đơn vị"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 130px)"
                      :items="agencyListXa"
                      v-model="agencyFilterXa"
                      item-text="itemName"
                      item-value="itemCode"
                      hide-details
                      hide-no-data
                      solo
                      flat
                      height="32"
                      min-height="32"
                      return-object
                      clearable
                    ></v-autocomplete>
                  </div>
                </v-flex>
                <v-flex xs12 class="mb-3 px-2" v-if="!siteTrungTam">
                  <div>
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Thủ tục:</div>
                    <v-autocomplete
                      placeholder="Chọn thủ tục"
                      class="select-search d-inline-block"
                      style="width: calc(100% - 130px)"
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
                <v-flex xs12 sm6 class="mb-3 px-2">
                  <div class="layout wrap">
                    <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 130px;">Ngày tiếp nhận:</div>
                    <v-layout wrap style="width: calc(100% - 130px);">
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
                <v-flex xs12 sm6 class="mb-3 px-2">
                  <div class="layout wrap">
                    <div class="d-inline-block text-bold pt-1" style="font-weight:450;width: 130px;">Ngày hẹn trả:</div>
                    <v-layout wrap style="width: calc(100% - 130px);">
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
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Mã hồ sơ :</div>
                    <v-text-field
                      placeholder="Nhập mã hồ sơ"
                      v-model="dossierNoKey"
                      class="search-input-appbar input-search d-inline-block"
                      style="width: calc(100% - 130px);"
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
                    <div class="d-inline-block text-bold" style="font-weight:450;width: 130px;">Từ khóa:</div>
                    <v-text-field
                      placeholder="Nhập tên chủ hồ sơ, tên hồ sơ,..."
                      v-model="keyword"
                      class="search-input-appbar input-search d-inline-block"
                      style="width: calc(100% - 130px);"
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
              </v-layout>
              
              <v-flex class="xs12 mx-2">
                <v-btn :loading="loadingTable || loadingActionUpdate" :style="loadingTable || loadingActionUpdate ? 'pointer-events: none' : ''" class="mx-0 mb-0" color="primary" dark @click.native="submitSearch">
                  <v-icon size="18">search</v-icon> &nbsp; Tìm kiếm
                </v-btn>
              </v-flex>
            </div>
          </div>

        </v-layout>

      </v-form>
      <div style="width: 100%;height: 30px;">
        <v-flex xs12 class="right">
          <v-btn color="primary" @click.native="submitUpdateDossier()" class="mx-0"
            :loading="loadingTable || loadingActionUpdate"
            :disabled="loadingTable || loadingActionUpdate"
          >
          <v-icon>save</v-icon>&nbsp;
          Chuyển hoàn thành
          <span slot="loader">Loading...</span>
          </v-btn>
        </v-flex>
      </div>
      <div style="width: 100%" v-if="loadingActionUpdate">
        <div class="text-xs-center">
          <span style="font-size: 16px"><span style="color: red">{{requestCount}}</span> / <span style="color: green">{{dossierSelected.length}}</span></span>
        </div>
        <v-progress-linear :indeterminate="true"></v-progress-linear>
      </div>
      <v-data-table
        :headers="dossierListHeader"
        :items="dossierList"
        v-model="dossierSelected"
        hide-actions
        select-all
        item-key="dossierId"
        class="table-landing table-bordered mt-3"
        style="border-left: 1px solid #dedede"
      >
        <template slot="headers" slot-scope="props">
          <tr>
            <th width="32px" class="v_data_table_check_all" style="padding-left: 14px !important;">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-checkbox v-else
                class="pl-1"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.stop="toggleAllSelectDossiers"
              ></v-checkbox>
            </th>
            <th
              v-for="header in dossierListHeader"
              :key="header.text"
              :class="header['class'] ? header['class'] : ''"
              :width="header['width'] ? header['width'] + 'px' : ''"
            >
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-tooltip bottom v-else>
                <span slot="activator">{{ header.text }}</span>
                <span>{{ header.text }}</span>
              </v-tooltip>
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;" @click="viewDetailDossier(props.item)">
            <td class="text-xs-center" width="30px" style="height: 40px !important">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-checkbox v-else
                class="pl-3"
                v-model="props.selected"
                primary
                hide-details
                color="primary"
                @click.native.stop
              ></v-checkbox>
            </td>
            <td class="text-xs-center" style="width:50px;height:36px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{dossierPage * limitRecord - limitRecord + props.index + 1}}</span>
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
                <span>{{props.item.govAgencyName}}</span>
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
            <td class="text-xs-left" style="height:36px;width:100px">
              <content-placeholders v-if="loadingTable">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.dossierOverdue}}</span>
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
                    hide-actions no-data-text="Không có dữ liệu"
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
      siteTrungTam: false,
      agencyListXa: [],
      agencyFilterXa: '',
      agencyList: [],
      agencyFilter: '',
      loadingTable: false,
      loadingActionUpdate: false,
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
      validFormUpdate: false,
      administrationList: [],
      listDoiTuong: [],
      listQuanHuyen: [],
      quanHuyenSelect: '',
      govAgencyList: [],
      govAgencyFilter: '',
      dossierNoKey: '',
      keyword: '',
      dossierList: [],
      dossierSelected: [],
      limitRecord: 20,
      numberPerPage: 20,
      dossierPage: 1,
      totalDossierSearch: 0,
      thongTinChiTietHoSo: '',
      dialogDetailDossier: false,
      dialogUpdateDossier: false,
      actionNote: '',
      dossierActions: [],
      quanhuyenSelected: '',
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
          text: 'Đơn vị giải quyết',
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
          text: 'Quá hạn',
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
      requestCount: 0,
      agencyChildrenList: [],
      agencyChildrenFilter: ''
    }),
    components: {
      'tiny-pagination': TinyPagination
    },
    computed: {
    },
    watch: {
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
      try {
        vm.siteTrungTam = siteTrungTam
      } catch (error) {
      }
      vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        // vm.fromReceiveDateFormatted= vm.currentDateFormat(new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1).toLocaleDateString('vi-VN'))
        // vm.toReceiveDateFormatted = vm.currentDateFormat()
        // vm.getDossiers()
        vm.getAgencyConfigs()
        if (!vm.siteTrungTam) {
          vm.getServiceInfo()
        }
      })
    },
    methods: {
      getDossiers () {
        let vm = this
        vm.dossierSelected = []
        vm.loadingTable = true
        vm.numberPerPage = vm.limitRecord
        let agencyCode = vm.agencyFilter ? vm.agencyFilter['code'] : ''
        if (vm.agencyFilterXa) {
          agencyCode = vm.agencyFilterXa['itemCode']
        }
        if (vm.agencyChildrenFilter) {
          agencyCode = vm.agencyChildrenFilter['code']
        }
        if (vm.agencyFilter.hasOwnProperty('hasChildrenSite') && !vm.agencyChildrenFilter) {
          agencyCode = ''
        }
        let params = {
          groupId: vm.groupIdDonVi,
          dossierNo: vm.dossierNoKey,
          keyword: vm.keyword,
          fromReceiveDate: vm.fromReceiveDateFormatted ? vm.fromReceiveDateFormatted : '',
          toReceiveDate: vm.toReceiveDateFormatted ? vm.toReceiveDateFormatted : '',
          fromReleaseDate: vm.fromReleaseDateFormatted ? vm.fromReleaseDateFormatted : '',
          toReleaseDate: vm.toReleaseDateFormatted ? vm.toReleaseDateFormatted : '',
          service: vm.serviceFilter ? vm.serviceFilter : '',
          start: vm.dossierPage * vm.numberPerPage - vm.numberPerPage,
          end: vm.dossierPage * vm.numberPerPage,
          agency: agencyCode
        }
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

      },
      submitSearch () {
        let vm = this
        vm.dossierPage = 1
        if (!vm.loadingActionUpdate) {
          vm.getDossiers()
        }
      },
      getDetailDossier (data) {
        let vm = this
        if (!vm.loadingActionUpdate) {
          let config = {
            headers: {
              groupId: vm.groupIdDonVi ? vm.groupIdDonVi : window.themeDisplay.getScopeGroupId()
            },
            params: {}
          }
          let url = '/o/rest/v2/dossiers/' + data.dossierId
          axios.get(url, config).then(function (response) {
            vm.thongTinChiTietHoSo = response.data
            vm.loadDossierActions(vm.thongTinChiTietHoSo)
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
        vm.dossierPage = config.page
        vm.limitRecord = config.numberPerPage
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
      toggleAllSelectDossiers () {
        let vm = this
        if (vm.dossierSelected.length) {
          vm.dossierSelected = []
        } else {
          vm.dossierSelected = vm.dossierList
        }
      },
      submitDossierStatus () {
        let vm = this
        if (!vm.dossierSelected.length) {
          alert('Vui lòng chọn hồ sơ để thực hiện')
        } else {
        //   vm.dialogUpdateDossier = true
        }
      },
      submitUpdateDossier () {
        let vm = this
        let x = confirm('Bạn có chắc chắn thực hiện chuyển hoàn thành với ' + vm.dossierSelected.length + ' hồ sơ đã chọn')
        if (x) {
          vm.loadingActionUpdate = true
          vm.requestCount = 0
          let arrRequest = []
          for (let key in vm.dossierSelected) {
            arrRequest.push(vm.goToStep(vm.dossierSelected[key]))
          }
          Promise.all(arrRequest).then(results => {
            vm.loadingActionUpdate = false
            toastr.success('Quá trình chuyển hồ sơ hoàn thành')
            vm.getDossiers()
          }).catch(reject => {
            vm.loadingActionUpdate = false
          })
        }
        
      },
      goToStep (item) {
        let vm = this
        return new Promise((resolve, reject) => {
          let options = {
            headers: {
              groupId: vm.groupIdDonVi ? vm.groupIdDonVi : window.themeDisplay.getScopeGroupId()
            }
          }
          let dataGoto = new URLSearchParams()
          let url = '/o/rest/v2/dossiers/' + item.dossierNo + '/goto/400'
          axios.post(url, dataGoto, options).then(function (response) {
            vm.requestCount += 1
            if (response['status'] !== undefined && response['status'] !== 200) {
              resolve('error')
            } else {
              resolve('success')
            }
          }).catch(function (xhr) {
            vm.requestCount += 1
            resolve('error')
          })
        })
        
      },
      changeAgency () {
        let vm = this
        setTimeout(function () {
          vm.groupIdDonVi = vm.agencyFilter['value']
          if (!vm.siteTrungTam) {
            vm.getServiceInfo()
          }
          if (vm.agencyFilter.hasOwnProperty('parent')) {
            vm.agencyListXa = []
            vm.agencyFilterXa = ''
            vm.getDonViXa()
          } else {
            vm.agencyListXa = []
            vm.agencyFilterXa = ''
          }
          if (vm.agencyFilter.hasOwnProperty('hasChildrenSite')) {
            let arr = []
            vm.agencyList.forEach(element => {
              if (element.value == vm.agencyFilter['value']) {
                arr.push(element)
              }
            });
            vm.agencyChildrenList = arr
          } else {
            vm.agencyChildrenFilter = ''
          }
        }, 200)
      },
      getServiceInfo () {
        let vm = this
        let data = {}
        vm.serviceInfoList = []
        if (vm.siteTrungTam && vm.agencyFilter) {
          data['groupId'] = vm.agencyFilter['value']
        }
        vm.$store.dispatch('getServiceInfo', data).then(function(res) {
          vm.serviceInfoList = res
        }).catch(()=>{
          vm.serviceInfoList = []
        })        
      },
      currentDateFormat (date) {
        let date1 = date ? new Date(date) : new Date()
        return `${date1.getDate().toString().padStart(2, '0')}/${(date1.getMonth() + 1).toString().padStart(2, '0')}/${date1.getFullYear()}`
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
          let agency = configs['groupIds']
          vm.agencyList = agency
          vm.agencyFilter = vm.agencyList[0]
          vm.groupIdDonVi = vm.agencyFilter['value']
          if (vm.agencyFilter.hasOwnProperty('hasChildrenSite')) {
            let arr = []
            vm.agencyList.forEach(element => {
              if (element.value == vm.agencyFilter['value']) {
                arr.push(element)
              }
            });
            vm.agencyChildrenList = arr
          }
          vm.getServiceInfo()
        }).catch(function (xhr) {
        })
      },
      getDonViXa () {
        let vm = this
        let filter = {
          parent: vm.agencyFilter['parent']
        }
        vm.$store.dispatch('getAgencysFromParent', filter).then(
          res => {
            vm.agencyListXa = res
          }
        ).catch(()=>{
          vm.agencyListXa = []
        }) 
      }
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

