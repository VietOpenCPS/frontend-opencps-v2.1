<template>
  <div>
    <content-placeholders v-if="loading">
      <content-placeholders-img />
      <content-placeholders-heading />
    </content-placeholders>
    <!-- style="max-width: 1100px;" -->
    <div style="max-width: 1100px" v-else>
      <div style="display: flex; background-color: rgb(230, 225, 225)">
        <div class="search-top" style="background: #fff">
          <div
            class="row-header"
            style="background: #fff; height: 38px; overflow: hidden"
          >
            <div
              class="view_tp_pdf"
              :class="{ 'background-triangle-big': code !== 'DanhSachTau' }"
            >
              <span class="" v-if="code !== 'DanhSachTau'">{{
                status_label
              }}</span>
              <span
                class=""
                style="
                  margin-left: 10px;
                  color: #2464da;
                  font-weight: bold;
                  text-transform: uppercase;
                "
                v-else
                >{{ status_label }}</span
              >
            </div>
            <div v-if="!documentName || documentName === '0'">
              <v-switch
                v-model="switchType"
                hide-details
                @change="changeType"
              ></v-switch>
            </div>
            <div v-if="!documentName || documentName === '0'">
              <label style="color: #147bec">{{ labelType }}</label>
            </div>
            <div>
              <span
                v-if="
                  documentName &&
                  documentName !== '0' &&
                  itineraryNo['itineraryNo']
                "
              >
                <span
                  >{{
                    detailHs["shipName"]
                      ? detailHs["shipName"]
                      : detailHs["nameOfShip"]
                  }}
                  | &nbsp;</span
                >
                <span class="font-regulal"
                  ><span class="red--text text--darken-3">#</span>
                  {{ detailHs["callSign"] || "" }}</span
                >
                &nbsp;
                <v-tooltip bottom>
                  <span slot="activator">
                    <span
                      v-if="showNC"
                      @click="toDetailHs"
                      class="font-regulal"
                      style="
                        font-weight: bold;
                        color: rgb(35, 114, 187);
                        cursor: pointer;
                      "
                      >>>{{ detailHs["documentName"] }} </span
                    >|
                    <span
                      v-if="showNC"
                      @click="toDetailHs"
                      style="color: rgb(35, 114, 187); cursor: pointer"
                      >Vào</span
                    >
                  </span>
                  <span>{{
                    supportData.docType[detailHs["documentTypeCode"]]
                  }}</span>
                </v-tooltip>

                <span v-if="showXC">&nbsp;/&nbsp;</span>

                <v-tooltip bottom>
                  <span slot="activator">
                    <span
                      v-if="showXC"
                      @click="toDetailHsOther"
                      class="font-regulal"
                      style="
                        font-weight: bold;
                        color: rgb(35, 114, 187);
                        cursor: pointer;
                      "
                      >{{ detailHsOther["documentName"] }}|</span
                    >
                    <span
                      v-if="showXC"
                      @click="toDetailHsOther"
                      style="color: rgb(35, 114, 187); cursor: pointer"
                      >Rời</span
                    >
                  </span>
                  <span>{{
                    supportData.docType[detailHsOther["documentTypeCode"]]
                  }}</span>
                </v-tooltip>
              </span>
            </div>
          </div>
        </div>

        <div class="search-top-right" style="background: #fff">
          <v-btn
            flat
            v-if="
              code === 'DanhSachViTriNeoDauTaiCang' &&
              (itineraryNo['markedAsDeparture'] === 5 ||
                itineraryNo['markedAsDeparture'] === 8 ||
                itineraryNo['markedAsDeparture'] === 9 ||
                itineraryNo['markedAsDeparture'] === '5' ||
                itineraryNo['markedAsDeparture'] === '8' ||
                itineraryNo['markedAsDeparture'] === '9') &&
              (itineraryNo['shipPosition'] === 2 ||
                itineraryNo['shipPosition'] === '2') &&
              type !== 'lanh_dao'
            "
            small
            class="ml-0 mr-2 py-0 my-0"
            @click="capNhatTauRoiCang()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">add</v-icon> Cập nhật tàu rời cảng</v-btn
          >

          <span
            v-if="
              code === 'DanhSachViTriNeoDauTaiCang' &&
              (itineraryNo['markedAsDeparture'] === 5 ||
                itineraryNo['markedAsDeparture'] === 8 ||
                itineraryNo['markedAsDeparture'] === 9 ||
                itineraryNo['markedAsDeparture'] === '5' ||
                itineraryNo['markedAsDeparture'] === '8' ||
                itineraryNo['markedAsDeparture'] === '9') &&
              (itineraryNo['shipPosition'] === 2 ||
                itineraryNo['shipPosition'] === '2') &&
              type !== 'lanh_dao'
            "
            >|</span
          >

          <v-btn
            flat
            v-if="
              code === 'DanhSachXepDoHang' &&
              documentName &&
              documentName !== '0' &&
              type !== 'lanh_dao'
            "
            small
            class="ml-0 mr-2 py-0 my-0"
            @click="autoFillCargolist()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">add</v-icon> Tự động lấy thông tin xếp dỡ</v-btn
          >
          <span
            v-if="
              code === 'DanhSachXepDoHang' &&
              documentName &&
              documentName !== '0'
            "
            >|</span
          >

          <v-btn
            flat
            v-if="
              listCodeAdd.includes(code) &&
              code !== 'DanhSachTauLaiHoTro' &&
              code !== 'DanhSachHoaTieuDanTau' &&
              type !== 'lanh_dao'
            "
            small
            class="ml-0 mr-2 py-0 my-0"
            @click="themMoi()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">add</v-icon> {{ labelAdd }}</v-btn
          >

          <span
            v-if="
              listCodeAdd.includes(code) &&
              code !== 'DanhSachTauLaiHoTro' &&
              code !== 'DanhSachHoaTieuDanTau' &&
              type !== 'lanh_dao'
            "
            >|</span
          >

          <v-btn
            flat
            v-if="
              documentName &&
              code === 'DanhSachTauLaiHoTro' &&
              type !== 'lanh_dao'
            "
            small
            class="ml-0 mr-2 py-0 my-0"
            @click="themMoiSuDungTauLai()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">add</v-icon> Sử dụng tàu lai</v-btn
          >
          <span v-if="documentName && code === 'DanhSachTauLaiHoTro'">|</span>

          <v-btn
            flat
            v-if="
              documentName &&
              code === 'DanhSachHoaTieuDanTau' &&
              type !== 'lanh_dao'
            "
            small
            class="ml-0 mr-2 py-0 my-0"
            @click="themMoiSuDungHoaTieu()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">add</v-icon> Sử dụng hoa tiêu</v-btn
          >
          <span
            v-if="
              documentName &&
              code === 'DanhSachHoaTieuDanTau' &&
              type !== 'lanh_dao'
            "
            >|</span
          >

          <v-btn
            flat
            small
            v-if="code === 'DanhSachGiayToTau' && type !== 'lanh_dao'"
            :disabled="!itemsDsTauAll || !itemsDsTauAll['length']"
            class="ml-0 mr-2 py-0 my-0"
            @click="updateVmaCertificate_DmCertificate()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">save</v-icon> Cập nhật giấy tờ</v-btn
          >
          <span v-if="code === 'DanhSachGiayToTau'">|</span>

          <v-btn
            flat
            small
            v-if="code === 'DanhSachDetailChuyenTuyen' && type !== 'lanh_dao'"
            class="ml-0 mr-2 py-0 my-0"
            @click="stateXacBaoPhi = !stateXacBaoPhi"
            style="text-transform: none; color: #1d52e8"
          >
            Báo tính phí</v-btn
          >
          <span v-if="code === 'DanhSachDetailChuyenTuyen'">|</span>

          <v-btn
            flat
            small
            v-if="code === 'DanhSachDetailTauDichVu' && type !== 'lanh_dao'"
            class="ml-0 mr-2 py-0 my-0"
            @click="stateXacBaoPhi = !stateXacBaoPhi"
            style="text-transform: none; color: #1d52e8"
          >
            Báo tính phí</v-btn
          >
          <span v-if="code === 'DanhSachDetailTauDichVu'">|</span>

          <v-btn
            flat
            small
            v-if="type === 'lanh_dao'"
            class="ml-0 mr-2 py-0 my-0"
            @click="kySoHSM()"
            style="text-transform: none; color: #1d52e8"
          >
            Ký số HSM</v-btn
          >
          <span v-if="type === 'lanh_dao'">|</span>

          <v-btn
            flat
            small
            v-if="type === 'lanh_dao'"
            class="ml-0 mr-2 py-0 my-0"
            @click="traLaiHoSo()"
            style="text-transform: none; color: #1d52e8"
          >
            Trả lại</v-btn
          >
          <span v-if="type === 'lanh_dao'">|</span>

          <v-btn
            flat
            small
            class="ml-0 mr-2 py-0 my-0"
            :loading="loadingExport"
            :disabled="loadingExport"
            @click="xuatFile()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">save</v-icon>
            Xuất file
            <span slot="loader" class="custom-loader">
              <v-icon light size="17">cached</v-icon>
            </span>
          </v-btn>
          <span>|</span>

          <v-btn
            flat
            small
            class="ml-0 mr-2 py-0 my-0"
            @click="refreshSearch()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon size="17">refresh</v-icon> Refresh</v-btn
          >
          <span>|</span>

          <v-btn
            flat
            small
            class="mx-0 py-0 my-0"
            :loading="loadingDelete"
            v-if="type !== 'lanh_dao'"
            :disabled="loadingDelete || !selectAllValue.length"
            @click="deleteSelectTable()"
            style="text-transform: none; color: #1d52e8"
          >
            <v-icon color="red" size="17">close</v-icon>
            <span
              :style="{
                color: loadingDelete || !selectAllValue.length ? '#ccc' : 'red',
              }"
              >Xóa</span
            >
            <span slot="loader" class="custom-loader">
              <v-icon light size="17">cached</v-icon>
            </span>
          </v-btn>
        </div>
      </div>

      <v-dialog v-model="stateXacBaoPhi" persistent max-width="450">
        <v-card>
          <v-card-title class="headline">
            Xác báo tính phí
            <v-btn
              dark
              icon
              class="mx-0 my-0 btn-top-panel"
              v-on:click.native="stateXacBaoPhi = false"
            >
              <v-icon>clear</v-icon>
            </v-btn>
          </v-card-title>
          <div style="max-height: 220px; overflow: auto">
            <v-layout row wrap>
              <v-flex xs12 sm12>
                <v-layout row wrap class="pt-2">
                  <v-flex xs12 sm12 class="pl-2">
                    <label>{{ query["nameOfShip"] || "" }}</label>
                  </v-flex>

                  <v-flex
                    xs12
                    sm2
                    class="text-xs-right pr-2 pb-2"
                    v-if="
                      code === 'DanhSachDetailTauDichVu' ||
                      code === 'DanhSachDetailChuyenTuyen'
                    "
                  >
                    Từ ngày:
                  </v-flex>
                  <v-flex
                    xs12
                    sm10
                    class="pr-2"
                    v-if="
                      code === 'DanhSachDetailTauDichVu' ||
                      code === 'DanhSachDetailChuyenTuyen'
                    "
                  >
                    <datetime-picker
                      v-model="fromDate"
                      :first-day="1"
                      :show-dst="false"
                      :show-hours="true"
                      :show-minutes="true"
                      :show-seconds="false"
                      :clearable="true"
                      class="mx-0 my-0"
                    ></datetime-picker>
                  </v-flex>
                  <v-flex
                    xs12
                    sm2
                    class="text-xs-right pr-2 pb-2"
                    v-if="
                      code === 'DanhSachDetailTauDichVu' ||
                      code === 'DanhSachDetailChuyenTuyen'
                    "
                  >
                    Đến ngày:
                  </v-flex>
                  <v-flex
                    xs12
                    sm10
                    class="pr-2"
                    v-if="
                      code === 'DanhSachDetailTauDichVu' ||
                      code === 'DanhSachDetailChuyenTuyen'
                    "
                  >
                    <datetime-picker
                      v-model="toDate"
                      :first-day="1"
                      :show-dst="false"
                      :show-hours="true"
                      :show-minutes="true"
                      :show-seconds="false"
                      :clearable="true"
                      class="mx-0 my-0"
                    ></datetime-picker>
                  </v-flex>
                  <!-- <v-flex xs12 sm2 class="text-xs-right pr-2">
                      <label>Lý do:</label>
                    </v-flex>

                    <v-flex xs12 sm10 class="pr-2">
                      <v-text-field
                        multi-line rows="2"
                        v-model="description"
                      ></v-text-field>
                    </v-flex> -->
                </v-layout>
              </v-flex>
            </v-layout>
          </div>

          <v-card-actions class="text-xs-right">
            <v-btn
              color="primary"
              small
              @click="tinhPhiLai()"
              class="my-0"
              v-if="stateActionFee === 'TinhPhiLai'"
              >Tính phí lại</v-btn
            >

            <v-btn
              color="primary"
              small
              @click="xacNhanThongBaoPhiTauChuyenTuyen()"
              class="my-0"
              v-else-if="code === 'DanhSachDetailChuyenTuyen'"
              >Xác nhận</v-btn
            >

            <v-btn
              color="primary"
              small
              @click="xacNhanThongBaoPhiTauDichVu()"
              class="my-0"
              v-else-if="code === 'DanhSachDetailTauDichVu'"
              >Xác nhận</v-btn
            >

            <v-btn
              color="primary"
              small
              @click="xacBaoTinhPhiTauBien_PTTND()"
              class="my-0"
              v-else
              >Xác nhận</v-btn
            >

            <v-btn
              color="primary"
              small
              @click="xemGiayBaoTinhPhi2()"
              class="my-0"
              v-if="
                code === 'DanhSachDetailChuyenTuyen' ||
                code === 'DanhSachDetailTauDichVu'
              "
              >Xem giấy báo tính phí</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div v-if="listShowSearchDate.includes(code)" style="display: flex">
        <span style="margin: 8px 10px"> Ngày: </span>
        <v-menu
          ref="menuTopTau"
          :close-on-content-click="false"
          v-model="menuTopTauAll"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          :style="{}"
          style="margin-top: 8px"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="searchTopTauAll"
            persistent-hint
            class="pb-0 my-0"
          ></v-text-field>
          <v-date-picker
            v-model="dateSearchTopTauAll"
            no-title
            @input="menuTopTauAll = false"
          ></v-date-picker>
        </v-menu>
        <v-icon
          size="17"
          style="margin-left: 10px; cursor: pointer"
          @click="menuTopTauAll = !menuTopTauAll"
          >date_range</v-icon
        >
      </div>

      <content-placeholders v-if="loadingTableAlll">
        <content-placeholders-img />
        <content-placeholders-heading />
      </content-placeholders>

      <vue-scrolling-table
        style="max-height: 450px"
        class="table-highlight"
        :scroll-horizontal="scrollHorizontal"
        :scroll-vertical="true"
        :sync-header-scroll="syncHeaderScroll"
        :sync-footer-scroll="syncFooterScroll"
        :include-footer="includeFooter"
        :dead-area-color="deadAreaColor"
        :class="{
          freezeFirstColumn: freezeFirstColumn,
          fullWidthTauLai: code === 'DanhSachTauLaiHoTro',
          fullWidthHaXuong: code === 'DanhSachHaXuong',
          fullWidthGhiChu: code === 'DanhSachGhiChuCanhBao',
        }"
        v-else-if="
          !loadingTableAlll && code !== 'DanhSachGiayToTau' && checkTable
        "
      >
        <template slot="thead">
          <tr style="background: #eaeaea">
            <th
              v-for="header in headersDsTauAll"
              v-if="header.type === 'checkbox'"
              :key="header.text"
              :style="header['style'] ? header['style'] : ''"
            >
              <v-checkbox
                v-model="selectAll"
                :indeterminate="
                  selectAllValue.length &&
                  selectAllValue.length !== itemsDsTauAll.length
                "
                @change="selectAllItem()"
              ></v-checkbox>
            </th>
            <th
              v-else
              :key="header.text"
              v-html="header.text"
              :style="header['style'] ? header['style'] : ''"
            ></th>
          </tr>
        </template>
        <template slot="tbody">
          <tr style="position: relative">
            <td :style="headersDsTauAll[0]['style']"></td>
            <td :style="headersDsTauAll[1]['style']"></td>
            <td
              v-for="(item, index) in headersDsTauAll"
              v-if="item.id !== 'stt' && item.id !== 'selectAll'"
              :style="item['style'] ? item['style'] : ''"
            >
              <v-text-field
                v-if="item['type'] === 'text'"
                v-model="adv[item.id]"
                @keyup.enter="searchAdvTable()"
                class="px-1 py-0 mx-0 my-0"
              ></v-text-field>
              <v-select
                v-else-if="item['type'] === 'select'"
                item-text="itemText"
                item-value="itemValue"
                clearable
                autocomplete
                :items="itemsSup[item.items]"
                v-model="adv[item.id]"
                @input="searchAdvTable()"
                class="px-1 py-0 mx-0 my-0"
              ></v-select>
              <datetime-picker
                v-else
                v-model="adv[item.id]"
                :first-day="1"
                :show-dst="false"
                :show-hours="true"
                :show-minutes="true"
                :show-seconds="false"
                :clearable="true"
                @clearDate="clearDate"
                @keyupenter="keyupEnter"
                @change-value="changeDate"
                class="mx-0 my-0"
              ></datetime-picker>
            </td>
          </tr>

          <tr
            v-for="(item, index) in itemsDsTauAll"
            :key="item.id"
            style="cursor: pointer"
          >
            <td
              class="text-xs-center"
              style="padding: 5px 0; width: 2%"
              :style="headersDsTauAll[0]['style']"
            >
              <v-checkbox v-model="selectAllValue" :value="item"></v-checkbox>
            </td>
            <td
              class="text-xs-center"
              style="padding: 5px 0; width: 2%"
              :style="headersDsTauAll[1]['style']"
            >
              {{ pageDataTableAll * 15 - 15 + index + 1 }}
            </td>
            <td
              v-if="itemKey.id !== 'stt' && itemKey.id !== 'selectAll'"
              @click="toDetailTauBien(item)"
              class="text-xs-center"
              v-for="(itemKey, index) in headersDsTauAll"
              :style="itemKey['style'] ? itemKey['style'] : ''"
              style="padding: 5px 0"
            >
              <span v-if="itemKey.id === 'noticeShipType'">
                <span
                  v-if="
                    item['anchorageSupplement'] === 1 ||
                    item['anchorageSupplement'] === '1'
                  "
                >
                  Neo bổ sung
                </span>
                <span v-else-if="item['noticeShipType'] === 1"> Vào </span>
                <span v-else-if="item['noticeShipType'] === 2"> Rời </span>
                <span v-else-if="item['noticeShipType'] === 3"> Quá cảnh </span>
                <span v-else> Di chuyển </span>
              </span>

              <span v-else-if="itemKey.id === 'nameOfShip'">
                {{ item["nameOfShip"] ? item["nameOfShip"] : item["shipName"] }}
              </span>

              <!-- <span v-else-if="itemKey.id === 'noticeShipType'">
                  <span v-if="item['noticeShipType'] === 1 || item['noticeShipType'] === '1'">
                    Vào
                  </span>
                  <span v-else-if="item['noticeShipType'] === 2 || item['noticeShipType'] === '2'">
                    Rời
                  </span>
                  <span v-else-if="item['noticeShipType'] === 4 || item['noticeShipType'] === '4'">
                    Di chuyển
                  </span>
                </span> -->

              <span v-else-if="itemKey.id === 'deconstructed'">
                <span v-if="item['deconstructed']">Đã phá dỡ</span>
                <span v-else>Chưa phá dỡ</span>
              </span>

              <span v-else-if="itemKey.id === 'violated'">
                <span v-if="item['violated']">Xác nhận</span>
                <span v-else>Chưa xác nhận</span>
              </span>

              <span
                v-else-if="
                  code === 'DanhSachTauDenCang' &&
                  itemKey.id === 'anchoringPortWharfCode'
                "
              >
                {{ item["anchoringPortHarbourName"] }},
                {{ item["anchoringPortWharfName"] }}
              </span>

              <span
                v-else-if="
                  code === 'DanhSachViTriNeoDauTaiCang' &&
                  itemKey.id === 'anchoringPortWharfCode'
                "
              >
                {{ item["portHarbourNameVN"] }}, {{ item["portWharfNameVN"] }}
              </span>

              <span
                v-else-if="
                  code === 'DanhSachTauRoiCang' &&
                  itemKey.id === 'anchoringPortWharfCode'
                "
              >
                {{ item["anchoringPortHarbourName"] }},
                {{ item["anchoringPortWharfName"] }}
              </span>

              <span
                v-else-if="
                  code === 'DanhSachTauDiChuyen' &&
                  itemKey.id === 'shiftingPortHarbourCode'
                "
              >
                {{ item["anchoringPortHarbourName"] }},
                {{ item["anchoringPortWharfName"] }}
              </span>

              <span
                v-else-if="
                  code === 'DanhSachTauDiChuyen' &&
                  itemKey.id === 'shiftingPortWharfCode'
                "
              >
                {{ item["shiftingPortHarbourName"] }},
                {{ item["shiftingPortWharfName"] }}
              </span>

              <span
                v-else-if="
                  itemKey.id === 'timeOfArrival' &&
                  code === 'DanhSachViTriNeoDauTaiCang'
                "
              >
                <span
                  v-if="
                    item['noticeShipType'] === 1 ||
                    item['noticeShipType'] === '1'
                  "
                >
                  {{ item["timeOfArrival"] }}
                </span>
                <span v-else></span>
              </span>

              <span v-else-if="itemKey.id === 'chanelCodeList'">
                <div
                  v-for="(item, index) in item[itemKey.display]"
                  :key="'chanelCodeList' + index"
                >
                  {{ item }}
                </div>
              </span>

              <span
                v-else-if="
                  itemKey.id === 'pilotList' &&
                  code === 'DanhSachHoaTieuDanTau' &&
                  item[itemKey.id]
                "
              >
                <div
                  class="py-1"
                  v-for="(itemPilot, indexPilot) in item[itemKey.display]"
                  :key="'itempilot' + indexPilot"
                >
                  {{ itemPilot["pilotName"] }} -
                  {{ itemPilot["pilotCompanyName"] }}
                </div>
              </span>

              <span
                v-else-if="
                  itemKey.id === 'action' && code === 'DanhSachDetailTauDichVu'
                "
              >
                <span
                  v-on:click.stop="xemBangKe(item)"
                  style="cursor: pointer; color: blue"
                  >Xem bảng kê</span
                >
                <br />
                <span
                  v-on:click.stop="huyTinhPhi(item)"
                  style="cursor: pointer; color: blue"
                  >Hủy tính phí</span
                >
                <br />
                <span
                  v-on:click.stop="showDialogTinhPhiLai(item)"
                  style="cursor: pointer; color: blue"
                  >Tính phí lại</span
                >
                <br />
              </span>

              <span
                v-else-if="
                  itemKey.id === 'action' &&
                  code === 'DanhSachDetailChuyenTuyen'
                "
              >
                <span
                  v-on:click.stop="xemBangKe(item)"
                  style="cursor: pointer; color: blue"
                  >Xem bảng kê</span
                >
                <br />
                <span
                  v-on:click.stop="huyTinhPhi(item)"
                  style="cursor: pointer; color: blue"
                  >Hủy tính phí</span
                >
                <br />
                <span
                  v-on:click.stop="showDialogTinhPhiLai(item)"
                  style="cursor: pointer; color: blue"
                  >Tính phí lại</span
                >
                <br />
              </span>

              <span v-else>{{ item[itemKey.display] }}</span>
            </td>
          </tr>
        </template>
      </vue-scrolling-table>

      <v-layout
        wrap
        class="px-4 pb-2"
        v-else-if="
          itineraryNo &&
          itineraryNo['itineraryNo'] &&
          itemsDsTauAll.length &&
          code === 'DanhSachTau'
        "
      >
        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">Tên tàu:</div>
              <div class="labelClass flex xs12 sm8">
                {{ itineraryNo["nameOfShip"] || detailHsTmp["shipName"] }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">Quốc tịch:</div>
              <div class="labelClass flex xs12 sm8">
                {{ flagStateOfShipName }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">IMO:</div>
              <div class="labelClass flex xs12 sm8">
                {{ itineraryNo["imoNumber"] || itineraryNo["imo"] }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">Hô hiệu:</div>
              <div class="labelClass flex xs12 sm8">
                {{ itineraryNo["callSign"] }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">
                Thời gian đến:
              </div>
              <div class="labelClass flex xs12 sm8">
                {{
                  itineraryNo["timeOfArrival"] || itineraryNo["shipDateFrom"]
                }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">
                Thời gian rời:
              </div>
              <div class="labelClass flex xs12 sm8">
                {{
                  itineraryNo["timeOfDeparture"] || itineraryNo["shipDateTo"]
                }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4" v-if="itineraryNo['shipPreviousName']">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">
                Tên cũ (do tàu đổi tên):
              </div>
              <div class="labelClass flex xs12 sm8">
                {{ itineraryNo["shipPreviousName"] }}
              </div>
            </div>
          </div>
        </div>
        <v-flex xs12 sm4 v-else> </v-flex>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">Đại lý đến:</div>
              <div class="labelClass flex xs12 sm8">
                {{ itineraryNo["arrivalShipAgency"] }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex xs12 sm4">
          <div class="editable-wrap">
            <div class="layout wrap">
              <div class="labelClass flex text-bold xs12 sm4">Đại lý rời:</div>
              <div class="labelClass flex xs12 sm8">
                {{ itineraryNo["departureShipAgency"] }}
              </div>
            </div>
          </div>
        </div>
      </v-layout>

      <!-- <ejs-grid v-else-if="code !== 'DanhSachTau'" ref="grid" :dataSource='itemsDsTauAll' :rowSelected='rowSelected' :allowGrouping='true' :groupSettings='groupOptions' height='150px'>
          <e-columns>
            <e-column field='nameOfShip' headerText='Tên tàu' textAlign='Center' width=120></e-column>
            <e-column field='anchoringPortHarbourName' headerText='Bến cảng' textAlign='Center' width=120></e-column>
            <e-column field='flagStateOfShipName' headerText='Quốc tịch' textAlign='Center' width=150></e-column>
            <e-column field='anchoringPortWharfName' headerText='Cầu/ phao' textAlign='Center' width=150></e-column>
            <e-column field='timeOfArrival' headerText='Ngày đến' textAlign='Center' width=150></e-column>
            <e-column field='anchoringDateFrom' headerText='Ngày/ giờ vào cầu' textAlign='Center' width=150></e-column>
          </e-columns>
        </ejs-grid> -->

      <div
        class="row-header pt-2"
        v-if="
          itineraryNo && itineraryNo['itineraryNo'] && code === 'DanhSachTau'
        "
        style="background: #fff; height: 38px; overflow: hidden"
      >
        <div
          class="view_tp_pdf"
          :class="{ 'background-triangle-big': code !== 'DanhSachTau' }"
        >
          <span
            class=""
            style="
              margin-left: 10px;
              color: rgb(36, 100, 218);
              font-weight: bold;
              text-transform: uppercase;
            "
            >Hồ sơ chuyến tàu</span
          >
        </div>
      </div>

      <content-placeholders
        v-if="
          loadingTableHoSoChuyenTau && itineraryNo && itineraryNo['itineraryNo']
        "
      >
        <content-placeholders-img />
        <content-placeholders-heading />
      </content-placeholders>

      <vue-scrolling-table
        style="max-height: 450px"
        class="table-highlight"
        :scroll-horizontal="scrollHorizontal"
        :scroll-vertical="itemsHoSoChuyenTau['length'] > 10"
        :sync-header-scroll="syncHeaderScroll"
        :sync-footer-scroll="syncFooterScroll"
        :include-footer="includeFooter"
        :dead-area-color="deadAreaColor"
        v-else-if="
          itineraryNo &&
          itineraryNo['itineraryNo'] &&
          code === 'DanhSachTau' &&
          code !== 'DanhSachGiayToTau'
        "
      >
        <template slot="thead">
          <tr style="background: #eaeaea">
            <th
              v-for="header in headersHoSoChuyenTau"
              :key="header.text"
              v-html="header.text"
              :style="header['style'] ? header['style'] : ''"
            ></th>
          </tr>
        </template>
        <template slot="tbody">
          <tr style="position: relative">
            <td :style="headersHoSoChuyenTau[0]['style']"></td>
          </tr>

          <tr
            v-for="(item, index) in itemsHoSoChuyenTau"
            :key="item.id"
            style="cursor: pointer"
          >
            <td
              class="text-xs-center"
              style="padding: 5px 0; width: 2%"
              :style="headersHoSoChuyenTau[0]['style']"
            >
              {{ pageDataTableAll * 15 - 15 + index + 1 }}
            </td>
            <td
              v-if="itemKey.id !== 'stt'"
              class="text-xs-center"
              v-for="(itemKey, index) in headersHoSoChuyenTau"
              :style="itemKey['style'] ? itemKey['style'] : ''"
              style="padding: 5px 0"
            >
              <span v-if="itemKey.id === 'noticeShipType'">
                <span
                  v-if="
                    item['anchorageSupplement'] === 1 ||
                    item['anchorageSupplement'] === '1'
                  "
                >
                  Neo bổ sung
                </span>
                <span v-else-if="item['noticeShipType'] === 1"> Vào </span>
                <span v-else-if="item['noticeShipType'] === 2"> Rời </span>
                <span v-else-if="item['noticeShipType'] === 3"> Quá cảnh </span>
                <span v-else> Di chuyển </span>
              </span>

              <span
                v-else-if="
                  itemKey.id === 'shownDraftxA' &&
                  code === 'DanhSachTauDiChuyen'
                "
              >
                <span>{{
                  item["shownDraftxA"] ? item["shownDraftxA"] : "---"
                }}</span>
                /
                <span>{{
                  item["shownDraftxF"] ? item["shownDraftxF"] : "---"
                }}</span>
              </span>

              <span v-else-if="itemKey.id === 'portHarbourCode'">
                <span
                  v-if="
                    item['noticeShipType'] === 1 ||
                    item['noticeShipType'] === '1' ||
                    item['noticeShipType'] === 4 ||
                    item['noticeShipType'] === '4'
                  "
                >
                  {{ item["initFrom"] }}
                </span>
                <span v-else>{{
                  item["portHarbourName"]
                    ? item["portHarbourName"]
                    : item["portHarbourNameVN"]
                }}</span>
              </span>

              <span v-else-if="itemKey.id === 'lastPortHarbourCode'">
                <span
                  v-if="
                    item['noticeShipType'] === 2 ||
                    item['noticeShipType'] === '2'
                  "
                >
                  {{ item["initFrom"] }}
                </span>
                <span v-else
                  >{{
                    item["portRegionName"]
                      ? item["portRegionName"] + ", "
                      : item["portRegionNameVN"]
                  }}
                  {{
                    item["portHarbourName"]
                      ? item["portHarbourName"] + ", "
                      : item["portHarbourNameVN"]
                  }}
                  {{
                    item["portWharfName"]
                      ? item["portWharfName"]
                      : item["portWharfNameVN"]
                  }}</span
                >
              </span>

              <span v-else-if="itemKey.id === 'duyet'">
                <v-icon
                  size="16"
                  :style="{
                    color:
                      getCheckedKH(item['noticeShipType'], itineraryNo) ===
                      'clear'
                        ? 'red'
                        : 'green',
                  }"
                  >{{
                    getCheckedKH(item["noticeShipType"], itineraryNo)
                  }}</v-icon
                >
                <!-- {{getCheckedKH(item['noticeShipType'], item)}} -->
              </span>

              <span
                v-else-if="
                  itemKey.id === 'timeOfArrival' &&
                  code !== 'DanhSachViTriNeoDauTaiCang'
                "
              >
                <span
                  v-if="
                    item['noticeShipType'] === 1 ||
                    item['noticeShipType'] === '1'
                  "
                >
                  {{ item["timeOfArrival"] }}
                </span>
                <span v-else>{{ item["timeOfDeparture"] }}</span>
              </span>

              <span
                v-else-if="
                  itemKey.id === 'timeOfArrival' &&
                  code === 'DanhSachViTriNeoDauTaiCang'
                "
              >
                <span
                  v-if="
                    item['noticeShipType'] === 1 ||
                    (item['noticeShipType'] === '1' &&
                      (!item['anchorageSupplement'] ||
                        item['anchorageSupplement'] === '0'))
                  "
                >
                  {{ item["timeOfArrival"] }}
                </span>
              </span>

              <span v-else>{{ item[itemKey.display] }}</span>
            </td>
          </tr>

          <!-- <tr v-if="!itemsHoSoChuyenTau || !itemsHoSoChuyenTau.length">
              <span></span>
            </tr> -->
        </template>
      </vue-scrolling-table>

      <div
        class="row-header pt-2"
        v-if="
          itineraryNo && itineraryNo['itineraryNo'] && code === 'DanhSachTau'
        "
        style="background: #fff; height: 38px; overflow: hidden"
      >
        <div
          class="view_tp_pdf"
          :class="{ 'background-triangle-big': code !== 'DanhSachTau' }"
        >
          <span
            class=""
            style="
              margin-left: 10px;
              color: rgb(36, 100, 218);
              font-weight: bold;
              text-transform: uppercase;
            "
            >Xác báo tính phí:
          </span>

          <v-icon
            size="16"
            :style="{
              color:
                debitnoteInFlag === 1 || debitnoteInFlag === '1'
                  ? 'green'
                  : 'red',
            }"
            >{{
              debitnoteInFlag === 1 || debitnoteInFlag === "1"
                ? "done"
                : "clear"
            }}</v-icon
          >
          <span style="margin-right: 20px">Lượt vào </span>

          <v-icon
            size="16"
            :style="{
              color:
                debitnoteOutFlag === 1 || debitnoteOutFlag === '1'
                  ? 'green'
                  : 'red',
            }"
            >{{
              debitnoteOutFlag === 1 || debitnoteOutFlag === "1"
                ? "done"
                : "clear"
            }}</v-icon
          >
          <span style="margin-right: 20px">Lượt rời </span>
        </div>
      </div>

      <div v-if="code === 'DanhSachTau'" class="text-xs-right">
        <v-layout row wrap>
          <v-flex xs12 sm2 class="pr-2 pt-2"> Ghi chú xuất biên lai : </v-flex>
          <v-flex xs12 sm10 class="pr-2">
            <v-text-field
              class="py-0 my-0"
              multi-line
              rows="3"
              v-model="description"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm12 class="text-xs-right">
            <v-btn
              color="primary"
              small
              @click="noiChuyenLai()"
              class="my-0"
              v-if="checkNoiChuyenLai"
              >Nối chuyến lại</v-btn
            >
            <v-btn
              color="primary"
              small
              @click="xemGiayBaoTinhPhi()"
              v-if="itineraryNo['itineraryNo']"
              >Xem giấy báo tính phí</v-btn
            >
            <v-btn color="primary" small @click="showXacBaoPhiDialog()"
              >Xác báo tính phí</v-btn
            >
          </v-flex>
        </v-layout>
      </div>

      <div v-if="stateViewPhieuThu && code === 'DanhSachTau'">
        <content-placeholders v-if="loadingPhieuThu">
          <content-placeholders-img />
          <content-placeholders-heading />
        </content-placeholders>
        <iframe
          v-else
          :src="urlDownload"
          style="width: 100%; height: 100vh"
          frameborder="0"
        ></iframe>
      </div>

      <div v-if="code === 'DanhSachGiayToTau'">
        <vue-scrolling-table
          style="max-height: 450px"
          class="table-highlight"
          :scroll-horizontal="scrollHorizontal"
          :scroll-vertical="itemsDsTauAll['length'] > 10"
          :sync-header-scroll="syncHeaderScroll"
          :sync-footer-scroll="syncFooterScroll"
          :include-footer="includeFooter"
          :dead-area-color="deadAreaColor"
        >
          <template slot="thead">
            <tr style="background: #eaeaea">
              <th
                v-for="header in headersGiayToTau"
                :key="header.text"
                v-html="header.text"
                :style="header['style'] ? header['style'] : ''"
              ></th>
            </tr>
          </template>
          <template slot="tbody">
            <tr style="position: relative">
              <td :style="headersGiayToTau[0]['style']"></td>
              <td
                v-for="(item, index) in headersGiayToTau"
                v-if="item.id !== 'stt' && item.id !== 'selectAll'"
                :style="item['style'] ? item['style'] : ''"
              >
                <v-text-field
                  v-if="item['type'] === 'text'"
                  v-model="adv[item.id]"
                  @keyup.enter="searchAdvTable()"
                  class="px-1 py-0 mx-0 my-0"
                ></v-text-field>
                <v-select
                  v-else-if="item['type'] === 'select'"
                  item-text="itemText"
                  item-value="itemValue"
                  clearable
                  autocomplete
                  :items="itemsSup[item.items]"
                  v-model="adv[item.id]"
                  @input="searchAdvTable()"
                  class="px-1 py-0 mx-0 my-0"
                ></v-select>
                <datetime-picker
                  v-else
                  v-model="adv[item.id]"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="false"
                  :show-minutes="false"
                  :show-seconds="false"
                  :clearable="true"
                  @clearDate="clearDate"
                  @keyupenter="keyupEnter"
                  @change-value="changeDate"
                  class="mx-0 my-0"
                ></datetime-picker>
              </td>
            </tr>

            <tr
              v-for="(item, index) in itemsDsTauAll"
              :key="item.id"
              style="cursor: pointer"
            >
              <td style="padding: 0 8px" :style="headersGiayToTau[0]['style']">
                {{ pageDataTableAll * 15 - 15 + index + 1 }}
              </td>
              <td
                class="text-xs-left px-2"
                :style="headersGiayToTau[1]['style']"
              >
                <!-- <v-text-field
                    v-model="item['certificateName']"
                    placeholder="số giấy chứng nhận"
                    single-line
                    class="px-1 py-0 mx-0 my-0"
                  ></v-text-field> -->
                {{ item["certificateName"] }}
              </td>
              <td
                class="text-xs-left"
                style="padding: 0 10px"
                :style="headersGiayToTau[2]['style']"
              >
                {{ itineraryNo["nameOfShip"] || selectTau["shipName"] }}
                <!-- <v-text-field
                    v-model="item['certificateName']"
                    placeholder="số giấy chứng nhận"
                    single-line
                    class="px-1 py-0 mx-0 my-0"
                  ></v-text-field> -->
              </td>
              <td
                class="text-xs-left"
                style="padding: 0 10px"
                :style="headersGiayToTau[3]['style']"
              >
                <v-subheader class="px-0">
                  <datetime-picker
                    v-model="item['certificateIssueDate']"
                    :first-day="1"
                    :show-dst="false"
                    :show-hours="false"
                    :show-minutes="false"
                    :show-seconds="false"
                  ></datetime-picker>
                </v-subheader>
              </td>
              <td
                class="text-xs-left"
                style="padding: 0 10px"
                :style="headersGiayToTau[4]['style']"
              >
                <v-subheader class="px-0">
                  <datetime-picker
                    v-model="item['certificateExpiredDate']"
                    :first-day="1"
                    :show-dst="false"
                    :show-hours="false"
                    :show-minutes="false"
                    :show-seconds="false"
                  ></datetime-picker>
                </v-subheader>
              </td>
              <td
                class="text-xs-left"
                style="padding: 0 10px"
                :style="headersGiayToTau[5]['style']"
              >
                <v-subheader class="px-0">
                  <datetime-picker
                    v-model="item['examinationDate']"
                    :first-day="1"
                    :show-dst="false"
                    :show-hours="false"
                    :show-minutes="false"
                    :show-seconds="false"
                  ></datetime-picker>
                </v-subheader>
              </td>
              <!-- <td class="text-xs-center px-0">
                  {{ item['nguoiKiemDuyet'] }}
                </td>
                <td class="text-xs-center px-0" style="padding: 0 5px;">
                  <v-checkbox v-model="item['yeuCauXuatTrinh']"></v-checkbox>
                </td> -->
              <td
                class="text-xs-center px-0"
                style="padding: 0 5px"
                :style="headersGiayToTau[6]['style']"
              >
                <v-checkbox
                  v-model="item['isExamined']"
                  style="margin: 0 auto"
                  class="pl-5"
                ></v-checkbox>
              </td>
            </tr>

            <!-- <tr v-if="!itemsHoSoChuyenTau || !itemsHoSoChuyenTau.length">
                <span></span>
              </tr> -->
          </template>
        </vue-scrolling-table>
      </div>

      <div
        class="text-xs-right layout wrap"
        style="position: relative"
        v-if="code !== 'DanhSachGiayToTau' && code !== 'DanhSachTau'"
      >
        <div class="flex pagging-table px-2">
          <tiny-pagination
            :total="totalDsAll"
            :page="pageDataTableAll"
            custom-class="custom-tiny-class"
            @tiny:change-page="paggingData"
          ></tiny-pagination>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialogViewThongBaoPhi" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">
          {{ txtThongBaoPhi }}
          <v-btn
            dark
            icon
            class="mx-0 my-0 btn-top-panel"
            v-on:click.native="dialogViewThongBaoPhi = false"
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <div style="max-height: 370px; overflow: auto">
          <v-progress-linear
            v-if="loadingPhieuThu"
            :indeterminate="true"
          ></v-progress-linear>
          <iframe
            v-else
            :src="urlViewThongBaoPhi"
            style="width: 100%; height: 100vh"
            frameborder="0"
          ></iframe>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPTTND" persistent max-width="850">
      <v-card>
        <v-card-title class="headline">
          {{ titleDS }}
          <v-btn
            dark
            icon
            class="mx-0 my-0 btn-top-panel"
            v-on:click.native="dialogPTTND = false"
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <div style="max-height: 370px; overflow: auto">
          <v-progress-linear
            v-if="loadingDialog"
            :indeterminate="true"
          ></v-progress-linear>

          <div class="text-xs-center py-1" style="width: 100%">
            <span v-if="!totalDsTau"
              >Thông báo chưa có
              {{
                typeNavigate === "TauDen" || typeNavigate === "TauDen200DWT"
                  ? "tàu"
                  : "phương tiện thủy nội địa"
              }}</span
            >
            <span v-else class="py-1"
              >Số lượng phương tiện:
              <span style="color: blue; font-weight: bold">{{
                totalDsTau
              }}</span
              >, mời nhập thông tin tìm kiếm
              {{
                typeNavigate === "TauDen" || typeNavigate === "TauDen200DWT"
                  ? "tàu"
                  : "PTTNĐ"
              }}</span
            >
          </div>

          <vue-scrolling-table
            v-if="totalDsTau"
            :style="{
              opacity: loadingDialog ? '0.6' : 1,
              'pointer-events': loadingDialog ? 'none' : 'auto',
            }"
            style="max-height: 295px"
            class="table-highlight"
            :scroll-horizontal="true"
            :scroll-vertical="true"
            :sync-header-scroll="true"
            :sync-footer-scroll="true"
            :include-footer="true"
            :dead-area-color="'#DDDDDD'"
          >
            <template slot="thead">
              <tr style="background: #eaeaea">
                <th
                  v-for="header in headersDialog"
                  :key="header.text"
                  v-html="header.text"
                  :style="header['style'] ? header['style'] : ''"
                ></th>
              </tr>
            </template>
            <template slot="tbody">
              <tr style="position: relative">
                <td :style="headersDialog[0]['style']"></td>
                <td
                  v-for="(item, index) in headersDialog"
                  v-if="item.id !== 'stt'"
                  :style="item['style'] ? item['style'] : ''"
                >
                  <v-text-field
                    v-if="item['type'] === 'text'"
                    v-model="advTau[item.id]"
                    @input="loadDsEventKeyup(adv[item.id])"
                    @keyup.enter="loadDsTau()"
                    class="px-1 py-0 mx-0 my-0"
                  ></v-text-field>
                  <v-select
                    v-else-if="item['type'] === 'select'"
                    item-text="itemText"
                    item-value="itemValue"
                    clearable
                    autocomplete
                    :items="itemsSup[item.items]"
                    v-model="advTau[item.id]"
                    @input="loadDsTau()"
                    class="px-1 py-0 mx-0 my-0"
                  ></v-select>
                </td>
              </tr>

              <tr
                v-for="(item, index) in itemsDialog"
                :key="index + 'pttnd'"
                style="cursor: pointer"
              >
                <td
                  @click="selectTauVaThemKH(item)"
                  class="text-xs-center"
                  :style="headersDialog[0]['style']"
                >
                  {{ index + 1 }}
                </td>

                <td
                  @click="selectTauVaThemKH(item)"
                  v-if="itemKey.id !== 'stt'"
                  class="text-xs-center"
                  v-for="(itemKey, index) in headersDialog"
                  :style="itemKey['style'] ? itemKey['style'] : ''"
                  style="padding: 5px 0"
                >
                  <span v-if="itemKey.id !== 'xemLichSu'">{{
                    item[itemKey.display]
                  }}</span>

                  <a
                    v-else
                    href="javascript:;"
                    style="color: blue"
                    v-on:click.stop="xemLichSuVaoRoi(item)"
                    >Xem lịch sử vào rời</a
                  >
                </td>
                <!-- <td @click="selectTau(item)" style="cursor: pointer;" class="text-xs-center" :style="headersDialog[1]['style']">
                    {{ item['shipName'] }}
                  </td>
                  <td @click="selectTau(item)" style="cursor: pointer;" class="text-xs-center" :style="headersDialog[2]['style']">
                    {{ item['registryNumber'] }}
                  </td>
                  <td @click="selectTau(item)" style="cursor: pointer;" class="text-xs-center" :style="headersDialog[3]['style']">
                    {{ item['callSign'] }}
                  </td>
                  <td @click="selectTau(item)" style="cursor: pointer;" class="text-xs-center" :style="headersDialog[4]['style']">
                    {{ item['expiredDate'] }}
                  </td>
                  <td @click="selectTau(item)" style="cursor: pointer;" class="text-xs-center" :style="headersDialog[5]['style']">
                    <a href="javascript:;" style="color: blue;" @click="xemLichSuVaoRoi(item)">Xem lịch sử vào rời</a>
                  </td> -->
              </tr>
            </template>
          </vue-scrolling-table>

          <v-flex xs12 sm12>
            <v-btn color="primary" small @click="themTauMoi()"
              >Thêm tàu mới</v-btn
            >
          </v-flex>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";
import Vue from "vue";
import { GridPlugin, Group } from "@syncfusion/ej2-vue-grids";
import TinyPagination from "./hanghai_pagination.vue";
import DatetimePicker from "./DatetimePicker.vue";
import support from "@/store/support.json";
import VueScrollingTable from "vue-scrolling-table";
import { eventBus } from "../../event-bus/eventBus.js";
import supportData from "../../store/support_data.json";
import toastr from "toastr";
toastr.options = {
  closeButton: true,
  timeOut: "3000",
};
Vue.use(GridPlugin);
export default {
  props: {
    code: "",
    type: "",
    documentYear: "",
    documentName: "",
    documentTypeCode: "",
    documentStatusCode: "",
    noticeShipType: "",
    idPT: "",
  },
  components: {
    "tiny-pagination": TinyPagination,
    "datetime-picker": DatetimePicker,
    "vue-scrolling-table": VueScrollingTable,
  },
  provide: {
    grid: [Group],
  },
  data: () => ({
    debitnoteInFlag: 0,
    debitnoteOutFlag: 0,
    typeKH: "",
    stateActionFee: "",
    itemSelect: {},
    advTau: {},
    dialogPTTND: false,
    titleDS: "",
    typeNavigate: "",
    totalDsTau: 0,
    headersDialog: [],
    headersDialogPTTND: [
      {
        text: "STT",
        align: "left",
        sortable: false,
        id: "stt",
        type: "text",
        style: {
          "min-width": "5em",
          "max-width": "5em",
        },
      },
      {
        text: "Tên phương tiện",
        align: "center",
        sortable: false,
        value: "tentau",
        id: "shipName",
        display: "shipName",
        type: "text",
        style: {
          "min-width": "19em",
          "max-width": "19em",
        },
      },
      {
        text: "Số đăng ký",
        align: "center",
        sortable: false,
        value: "title",
        id: "registryNumber",
        display: "registryNumber",
        type: "text",
        style: {
          "min-width": "14em",
          "max-width": "14em",
        },
      },
      {
        text: "Ngày hết hạn <br> đăng ký",
        align: "center",
        sortable: false,
        value: "ngayhethandk",
        id: "expiredDate",
        display: "expiredDate",
        type: "text",
        style: {
          "min-width": "16em",
          "max-width": "16em",
        },
      },
      {
        text: "Xem lịch sử vào rời",
        align: "center",
        sortable: false,
        value: "xemlichsu",
        id: "xemLichSu",
        display: "xemLichSu",
        type: "text",
        style: {
          "min-width": "15.1em",
          "max-width": "15.1em",
        },
      },
    ],
    headersDialogTau: [
      {
        text: "STT",
        align: "left",
        sortable: false,
        id: "stt",
        type: "text",
        style: {
          "min-width": "5em",
          "max-width": "5em",
        },
      },
      {
        text: "Tên tàu",
        align: "center",
        sortable: false,
        value: "tentau",
        id: "shipName",
        display: "shipName",
        type: "text",
        style: {
          "min-width": "15em",
          "max-width": "15em",
        },
      },
      {
        text: "Số đăng ký",
        align: "center",
        sortable: false,
        value: "title",
        id: "registryNumber",
        display: "registryNumber",
        type: "text",
        style: {
          "min-width": "11em",
          "max-width": "11em",
        },
      },
      {
        text: "Hô hiệu",
        align: "center",
        sortable: false,
        value: "hohieu",
        id: "callSign",
        display: "callSign",
        type: "text",
        style: {
          "min-width": "11em",
          "max-width": "11em",
        },
      },
      {
        text: "Ngày hết hạn <br> đăng ký",
        align: "center",
        sortable: false,
        value: "ngayhethandk",
        id: "expiredDate",
        display: "expiredDate",
        type: "text",
        style: {
          "min-width": "12em",
          "max-width": "12em",
        },
      },
      {
        text: "Xem lịch sử vào rời",
        align: "center",
        sortable: false,
        value: "xemlichsu",
        id: "xemLichSu",
        display: "xemLichSu",
        type: "text",
        style: {
          "min-width": "15.1em",
          "max-width": "15.1em",
        },
      },
    ],
    itemsDialog: [],
    description: "",
    checkThongBaoPhi: false,
    dialogViewThongBaoPhi: "",
    txtThongBaoPhi: "",
    urlViewThongBaoPhi: "",
    urlDownload: "",
    loadingPhieuThu: false,
    stateViewPhieuThu: false,
    stateXacBaoPhi: false,
    fromDate: "",
    toDate: "",
    loadingTableHoSoChuyenTau: false,
    headersGiayToTau: [
      {
        text: "STT",
        align: "center",
        sortable: false,
        id: "stt",
        type: "text",
        style: {
          width: "3em",
          "min-width": "3em",
          "max-width": "3em",
        },
      },
      {
        text: "Tên giấy chứng nhận",
        align: "center",
        sortable: false,
        id: "certificateName",
        display: "certificateName",
        type: "text",
        style: {
          "min-width": "16em",
          "max-width": "16em",
        },
      },
      {
        text: "Tên tàu",
        align: "center",
        sortable: false,
        id: "nameOfShip",
        display: "nameOfShip",
        type: "text",
        style: {
          "min-width": "20.5em",
          "max-width": "20.5em",
        },
      },
      {
        text: "Ngày cấp",
        align: "center",
        sortable: false,
        id: "certificateIssueDate",
        display: "certificateIssueDate",
        type: "date",
        style: {
          "min-width": "14em",
          "max-width": "14em",
        },
      },
      {
        text: "Ngày hết hạn",
        align: "center",
        sortable: false,
        id: "certificateExpiredDate",
        display: "certificateExpiredDate",
        type: "date",
        style: {
          "min-width": "14em",
          "max-width": "14em",
        },
      },
      {
        text: "Ngày kiểm tra <br> định kỳ",
        align: "center",
        sortable: false,
        id: "examinationDate",
        display: "examinationDate",
        type: "date",
        style: {
          "min-width": "14em",
          "max-width": "14em",
        },
      },
      // {
      //   'text': 'Người kiểm duyệt',
      //   'align': 'center',
      //   'sortable': false,
      //   'id': 'nguoiKiemDuyet',
      //   'display': 'nguoiKiemDuyet',
      //   'type': 'text',
      //   'style': {
      //     'min-width': '18em',
      //     'max-width': '18em'
      //   }
      // },
      // {
      //   'text': 'Yêu cầu xuất trình',
      //   'align': 'center',
      //   'sortable': false,
      //   'id': 'yeuCauXuatTrinh',
      //   'display': 'yeuCauXuatTrinh',
      //   'items': 'yeuCauXuatTrinhItems',
      //   'type': 'select',
      //   'style': {
      //     'min-width': '18em',
      //     'max-width': '18em'
      //   }
      // },
      {
        text: "Đã kiểm tra",
        align: "center",
        sortable: false,
        id: "isExamined",
        display: "isExamined",
        items: "daKiemTraItems",
        type: "select",
        style: {
          "min-width": "10em",
          "max-width": "10em",
        },
      },
    ],
    headersHoSoChuyenTau: [
      {
        text: "STT",
        align: "center",
        sortable: false,
        id: "stt",
        type: "text",
        style: {
          width: "3em",
          "min-width": "3em",
          "max-width": "3em",
        },
      },
      {
        text: "Lượt",
        align: "center",
        sortable: false,
        id: "noticeShipType",
        display: "noticeShipType",
        type: "text",
        style: {
          "min-width": "16em",
          "max-width": "16em",
        },
      },
      {
        text: "Duyệt KH",
        align: "center",
        sortable: false,
        id: "duyet",
        display: "duyet",
        type: "text",
        style: {
          "min-width": "16em",
          "max-width": "16em",
        },
      },
      {
        text: "Từ",
        align: "center",
        sortable: false,
        id: "portHarbourCode",
        display: "portHarbourName",
        type: "text",
        style: {
          "min-width": "19em",
          "max-width": "18em",
        },
      },
      {
        text: "Đích đến",
        align: "center",
        sortable: false,
        id: "lastPortHarbourCode",
        display: "lastPortHarbourName",
        type: "text",
        style: {
          "min-width": "18em",
          "max-width": "18em",
        },
      },
      {
        text: "T/g đến",
        align: "center",
        sortable: false,
        id: "timeOfArrival",
        display: "timeOfArrival",
        type: "text",
        style: {
          "min-width": "18em",
          "max-width": "18em",
        },
      },
    ],
    itemsHoSoChuyenTau: [],
    detailHsTmp: {},
    detailHs: {},
    loadingDialog: false,
    detailHsOther: {},
    documentTypeCodeOther: "XC",
    supportData: supportData,
    loadingExport: false,
    status_label: "",
    listCodeAdd: [
      "DanhSachTauBien",
      "DanhSachPhuongTienThuyNoiDia",
      "DanhSachTauDenCang",
      "DanhSachTauRoiCang",
      "DanhSachNeoTau",
      "DanhSachSuaChuaTau",
      "DanhSachHaXuong",
      "DanhSachThuTau",
      "DanhSachDuTau",
      "DanhSachGhiChuCanhBao",
      "DanhSachKhangNghiHangHai",
      "DanhSachKeHoachChuyenTuyen",
      "DanhSachHoaTieuDanTau",
      "DanhSachTauLaiHoTro",
      "DanhSachTauDiChuyen",
      "DanhSachXepDoHang",
      "DanhSachPTTNDDenCang",
      "DanhSachPTTNDRoiCang",
      "DanhSach<200DWTVao",
      "DanhSach<200DWTRoi",
      "DanhSachViTriNeoDauTaiCang",
    ],
    listShowSearchDate: [
      "DanhSachViTriNeoDauTaiCang",
      "DanhSachTauDenCang",
      "DanhSachNeoTau",
    ],
    scrollHorizontal: true,
    scrollVertical: true,
    syncHeaderScroll: true,
    syncFooterScroll: true,
    includeFooter: true,
    deadAreaColor: "#DDDDDD",
    freezeFirstColumn: true,
    adv: {},
    query: {},
    getGiayToXuatTrinhPhuongTien: "",
    itemsGiayToXuatTrinhChoPhuongTien: [],
    itemsSup: {
      yeuCauXuatTrinhItems: [
        {
          itemText: "Có",
          itemValue: 1,
        },
        {
          itemText: "Không",
          itemValue: 0,
        },
      ],
      daKiemTraItems: [
        {
          itemText: "Đã kiểm tra",
          itemValue: 1,
        },
        {
          itemText: "Chưa kiểm tra",
          itemValue: 0,
        },
      ],
      cargoCategoryItems: [],
      shipTypeMTItems: [],
      quocTichItems: [],
      shipTypeItems: [],
      representativeItems: [],
      securityLevelItems: [],
      portWharfItems: [],
      shipAgencyItems: [],
      portHarbourItems: [],
      purposeItems: [],
      cargoItems: [],
      cargoTypeItems: [],
      shipOwnerItems: [],
      shipOperatorItems: [],
      pilotItems: [],
      cargo_124Items: [],
      cargo_115Items: [],
      chanelCodeListItems: [],
      violatedItems: [
        {
          itemText: "Xác nhận",
          itemValue: 1,
        },
        {
          itemText: "Chưa xác nhận",
          itemValue: 0,
        },
      ],
      deconstructedItems: [
        {
          itemText: "Đã phá dỡ",
          itemValue: 1,
        },
        {
          itemText: "Chưa phá dỡ",
          itemValue: 0,
        },
      ],
      noticeShipTypeItems: [
        {
          itemText: "Lượt vào",
          itemValue: "1",
        },
        {
          itemText: "Lượt rời",
          itemValue: "2",
        },
        {
          itemText: "Lượt quá cảnh",
          itemValue: "3",
        },
        {
          itemText: "Lượt di chuyển",
          itemValue: "4",
        },
      ],
      shipBoatItems: [
        {
          itemText: "Tàu biển",
          itemValue: "SHIP",
        },
        {
          itemText: "PTTNĐ",
          itemValue: "BOAT",
        },
      ],
      coHienThiCanhBaoItems: [
        {
          itemText: "Có",
          itemValue: 1,
        },
        {
          itemText: "Không",
          itemValue: 0,
        },
      ],
      khongGiaiQuyetRoiCangItems: [
        {
          itemText: "Tạm dừng",
          itemValue: 1,
        },
        {
          itemText: "Không yêu cầu",
          itemValue: 0,
        },
      ],
    },
    itemsDsTauAll: [{ ccc: "dcm" }, { ccc: "dcm" }, { ccc: "dcm" }],
    totalDsAll: 0,
    pageDataTableAll: 1,
    menuTopTauAll: false,
    searchTopTauAll: "",
    dateSearchTopTauAll: "",
    groupData: [],
    groupOptions: { columns: ["anchoringPortHarbourName"] },
    urlDanhSach: "",
    loadingTableAlll: false,
    showNC: false,
    showXC: false,
    switchType: false,
    showSwitchKeHoach: false,
    selectAll: false,
    selectAllValue: [],
    urlDelete: "",
    listCodeXC: [
      "XC",
      "QC",
      "2",
      "3",
      "5",
      "7",
      "9",
      "11",
      "13",
      "15",
      5,
      7,
      9,
      11,
      13,
      15,
      2,
      3,
    ],
    loadingDelete: false,
    flagStateOfShipName: "",
    initData: null,
  }),
  computed: {
    pttnd() {
      return this.$store.getters.pttnd;
    },
    selectTau() {
      return this.$store.getters.selectTau;
    },
    checkStateVaoRoi() {
      if (this.listCodeXC.includes(this.documentTypeCode)) {
        return "1002";
      } else {
        return "1001";
      }
    },
    checkNoiChuyenLai() {
      if (
        this.listCodeXC.includes(this.documentTypeCode) &&
        this.itineraryNo &&
        this.itineraryNo["markedAsArrival"] >= 2 &&
        this.itineraryNo["markedAsDeparture"] >= 1
      ) {
        return true;
      } else {
        return false;
      }
    },
    checkTable() {
      if (this.code === "DanhSachTau") {
        let path = this.$router.history.current.path;
        if (path.indexOf("/quan-ly-tau-bien")) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    // checkPaging () {
    //   if (!this.documentName || this.documentName === '0') {
    //     return true
    //   } else {
    //     if (this.code === 'DanhSachTau') {
    //       return false
    //     } else {
    //       return true
    //     }
    //   }
    // },
    labelAdd() {
      let vm = this;
      if (
        vm.code === "DanhSach<200DWTVao" ||
        vm.code === "DanhSach<200DWTRoi"
      ) {
        return "Thêm mới KH tàu < 200DWT";
      } else if (
        vm.code === "DanhSachPTTNDDenCang" ||
        vm.code === "DanhSachPTTNDRoiCang"
      ) {
        return "Thêm mới KH PTTNĐ";
      } else {
        return "Thêm mới";
      }
    },
    labelType() {
      if (this.type === "ke_hoach") {
        return "Kế hoạch";
      } else {
        return "Thủ tục";
      }
    },
    maritimeCode() {
      return this.$store.getters.maritimeCode;
    },
    itineraryNo() {
      var itineraryNo = this.$store.getters.itineraryNo;
      if (itineraryNo) {
        return itineraryNo;
      } else {
        return {};
      }
    },
    loading() {
      return this.$store.getters.loading;
    },
    loadingInitData() {
      return this.$store.getters.loadingInitData;
    },
    headersDsTauAll() {
      var vm = this;
      console.log(vm.code);
      let headerTau = [];
      switch (vm.code) {
        case "DanhSachTau": {
          headerTau = support.headersDsTauAll;
          break;
        }
        case "DanhSachTauBien": {
          headerTau = support.headersDsTauBien;
          break;
        }
        case "DanhSachPhuongTienThuyNoiDia": {
          headerTau = support.headersDsThuyNoiDia;
          break;
        }
        case "DanhSachTauRoiCang": {
          headerTau = support.headersTauRoiCang;
          break;
        }
        case "DanhSachTauDenCang": {
          headerTau = support.headersTauDenCang;
          break;
        }
        case "DanhSachPTTNDRoiCang": {
          headerTau = support.headersPTTNDRoiCang;
          break;
        }
        case "DanhSachPTTNDDenCang": {
          headerTau = support.headersPTTNDDenCang;
          break;
        }
        case "DanhSach<200DWTRoi": {
          headerTau = support.headersPTTNDRoiCang;
          break;
        }
        case "DanhSach<200DWTVao": {
          headerTau = support.headersPTTNDDenCang;
          break;
        }
        case "DanhSachTauDiChuyen": {
          headerTau = support.headersKHTauDiChuyen;
          break;
        }
        case "DanhSachNeoTau": {
          headerTau = support.headersNeoTau;
          break;
        }
        case "DanhSachTauLaiHoTro": {
          headerTau = support.headerTauLaiHoTro;
          break;
        }
        case "DanhSachHoaTieuDanTau": {
          headerTau = support.headersHoaTieuDanTau;
          break;
        }
        case "DanhSachXepDoHang": {
          headerTau = support.headersXepDoHang;
          break;
        }
        case "DanhSachNhapTachDoan": {
          headerTau = support.headersKHTauDiChuyen;
          break;
        }
        case "DanhSachSuaChuaTau": {
          headerTau = support.headersDsSuaChuaTau;
          break;
        }
        case "DanhSachHaXuong": {
          headerTau = support.headersDsHaXuong;
          break;
        }
        case "DanhSachThuTau": {
          headerTau = support.headersDsThuTau;
          break;
        }
        case "DanhSachDuTau": {
          headerTau = support.headersDsDuTau;
          break;
        }
        case "DanhSachGhiChuCanhBao": {
          headerTau = support.headersDsGhiChu;
          break;
        }
        case "DanhSachKhangNghiHangHai": {
          headerTau = support.headersDsKhangNghi;
          break;
        }
        case "DanhSachTauThanhThai": {
          headerTau = support.headersDsTauThanhThai;
          break;
        }
        case "DanhSachXacNhanAnToanAnNinh": {
          headerTau = support.headersDsXacNhanAnToan;
          break;
        }
        case "DanhSachViTriNeoDauTaiCang": {
          headerTau = support.headersDsKhNeoDau;
          break;
        }
        case "DanhSachTauDichVu": {
          headerTau = support.headersDsTauDichVu;
          break;
        }
        case "DanhSachDetailTauDichVu": {
          headerTau = support.headersChiTietChuyenTuyenDichVu;
          break;
        }
        case "DanhSachDetailChuyenTuyen": {
          headerTau = support.headersChiTietChuyenTuyenDichVu;
          break;
        }
        default: {
          headerTau = support.headersDsKeHoachChuyenTuyen;
          break;
        }
      }
      let index = headerTau.findIndex((item) => {
        return item["id"] === "selectAll";
      });
      if (index === -1) {
        headerTau.splice(0, 0, {
          text: " ",
          align: "center",
          sortable: false,
          id: "selectAll",
          type: "checkbox",
          style: {
            width: "2em",
            "min-width": "2em",
            "max-width": "2em",
          },
        });
      }
      return headerTau;
    },
  },
  created() {
    var vm = this;
    let query = vm.$router.history.current.query;
    vm.query = query || {};
    vm.$nextTick(function () {
      vm.$store.dispatch("loadInitResource").then((resultInit) => {
        vm.initData = resultInit;
        vm.checkHistoryTempDebitnote();
        // vm.loadingTableAlll = true
        vm.loadingTableAlll = false;
        vm.changeStatusTextTableByCode();
        console.log("query++++++++++", query);
        if (query.hasOwnProperty("page") && query["page"]) {
          vm.pageDataTableAll = parseInt(query["page"]) || 1;
        } else {
          vm.pageDataTableAll = 1;
        }
        let param = null;
        param = {
          type: vm.type,
          start: vm.pageDataTableAll * 15 - 15,
          end: vm.pageDataTableAll * 15,
        };
        for (var key in query) {
          if (key !== "page") {
            param[key] = query[key];
          }
        }
        if (
          vm.documentName &&
          vm.documentName !== "0" &&
          vm.documentYear &&
          vm.documentYear !== "0"
        ) {
          vm.$store
            .dispatch("loadItineraryNo", {
              documentName: vm.documentName,
              documentYear: vm.documentYear,
            })
            .then((result) => {
              vm.canhBaoTinhPhi();
              vm.getVmaitineraryRemarks();
              vm.bindModelSearchAdv();
              vm.changeUrlGetList().then(function (result) {
                param["url"] = vm.urlDanhSach;
                if (vm.code === "DanhSachTauDichVu") {
                  delete param["url"];
                  vm.loadDataTableDichVu(param);
                } else if (
                  vm.code === "DanhSachDetailChuyenTuyen" ||
                  vm.code === "DanhSachDetailTauDichVu"
                ) {
                  vm.loadDataTableDetailCT_DV(param);
                } else {
                  vm.loadDataTable(param);
                }
              });
              if (
                !result.hasOwnProperty("errorCode") &&
                vm.code === "DanhSachTau"
              ) {
                vm.changeUrlGetList().then(function (resultuRL) {
                  vm.loadHoSoChuyenTau(result);
                });
              }
              // let listNC = ['DanhSachViTriNeoDauTaiCang', 'DanhSachTauDenCang']
              // let listXC = ['DanhSachTauRoiCang']
              if (result["documentNameIN"] && result["documentYearIN"]) {
                vm.loadDetailHs(
                  result["documentNameIN"],
                  result["documentYearIN"],
                  "NC"
                ).then((resultHs) => {});
                vm.showNC = true;
              } else {
                vm.showNC = false;
              }
              if (result["documentNameOUT"] && result["documentYearOUT"]) {
                vm.loadDetailHs(
                  result["documentNameOUT"],
                  result["documentYearOUT"],
                  "XC"
                ).then((resultHsOther) => {});
                vm.showXC = true;
              } else {
                vm.showXC = false;
              }
              // if (listNC.includes(vm.code)) {
              //   vm.loadDetailHs(result['documentNameIN'], result['documentYearIN'], 'NC')
              // } else if (listXC.includes(vm.code)) {
              //   vm.loadDetailHs(result['documentNameOUT'], result['documentYearOUT'], 'XC')
              // } else {
              //   vm.loadDetailHs(result['documentNameIN'], result['documentYearIN'], 'NC')
              //   vm.loadDetailHs(result['documentNameOUT'], result['documentYearOUT'], 'XC')
              // }
              vm.loadingDetail = false;
            })
            .catch((xhr) => {
              vm.loadingDetail = false;
            });
        } else {
          // vm.$store.commit('setItineraryNo', {})
          vm.loadItineraryFromUrlQuery().then((resultItinerary) => {
            vm.canhBaoTinhPhi();
            vm.changeUrlGetList().then(function (result) {
              param["url"] = vm.urlDanhSach;
              if (vm.code === "DanhSachTau") {
                if (vm.documentName && vm.documentYear) {
                  param["documentName"] = vm.documentName;
                  param["documentYear"] = vm.documentYear;
                }
              }
              if (vm.code === "DanhSachTauDichVu") {
                delete param["url"];
                vm.loadDataTableDichVu(param);
              } else if (
                vm.code === "DanhSachDetailChuyenTuyen" ||
                vm.code === "DanhSachDetailTauDichVu"
              ) {
                vm.loadDataTableDetailCT_DV(param);
              } else if (vm.code === "DanhSachTau") {
                vm.loadHoSoChuyenTau(resultItinerary);
              } else {
                vm.loadDataTable(param);
              }
            });
          });
        }
        eventBus.$emit("eventSwitchPart", false);
      });
    });
    // vm.checkShowSwitchKeHoach()
  },
  mounted() {
    var vm = this;
    vm.loadDataOther();
    vm.loadFlagStateOfShipName(vm.itineraryNo["flagStateOfShip"]).then(
      (result) => {
        if (result && result.length) {
          console.log("flagStateOfShipName==============>>>", result[0]);
          vm.flagStateOfShipName = result[0]["stateName"];
        }
      }
    );
  },
  watch: {
    // adv: {
    //   handler (val) {
    //     var vm = this
    //     vm.searchAdvTable()
    //   },
    //   deep: true
    // },
    itineraryNo(val) {
      let vm = this;
      if (val && val["itineraryNo"]) {
        let actions = [];
        actions.push(
          vm.loadDetailHs(
            vm.itineraryNo["documentNameIN"],
            vm.itineraryNo["documentYearIN"],
            "NC"
          )
        );
        actions.push(
          vm.loadDetailHs(
            vm.itineraryNo["documentNameOUT"],
            vm.itineraryNo["documentYearOUT"],
            "XC"
          )
        );
      }
    },
    selectAll(val) {},
    selectAllValue(val) {
      if (val && val.length && val.length === this.selectAllValue.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
      }
    },
    code(val) {
      var vm = this;
      vm.adv = {};
      vm.selectAllValue = [];
      vm.totalDsAll = 0;
      vm.pageDataTableAll = 1;
      if (
        vm.itineraryNo["documentNameIN"] &&
        vm.itineraryNo["documentYearIN"]
      ) {
        vm.loadDetailHs(
          vm.itineraryNo["documentNameIN"],
          vm.itineraryNo["documentYearIN"],
          "NC"
        );
        vm.showNC = true;
      } else {
        vm.showNC = false;
      }
      if (
        vm.itineraryNo["documentNameOUT"] &&
        vm.itineraryNo["documentYearOUT"]
      ) {
        vm.loadDetailHs(
          vm.itineraryNo["documentNameOUT"],
          vm.itineraryNo["documentYearOUT"],
          "XC"
        );
        vm.showXC = true;
      } else {
        vm.showXC = false;
      }
      if (val === "DanhSachTau") {
        vm.changeUrlGetList().then(function (result) {
          vm.loadHoSoChuyenTau(vm.itineraryNo);
        });
        // vm.loadHoSoChuyenTau(vm.itineraryNo)
      }
      vm.changeStatusTextTableByCode();
    },
    dateSearchTopTauAll(val) {
      this.searchTopTauAll = this.parseDate(val);
    },
    $route: function (newRoute, oldRoute) {
      let vm = this;
      vm.loadingTableAlll = true;
      let query = newRoute.query;
      vm.query = query || {};
      if (query.hasOwnProperty("page") && query["page"]) {
        vm.pageDataTableAll = parseInt(query["page"])
          ? parseInt(query["page"])
          : 1;
      } else {
        vm.pageDataTableAll = 1;
      }
      let param = null;
      param = {
        type: vm.type,
        start: vm.pageDataTableAll * 15 - 15,
        end: vm.pageDataTableAll * 15,
      };
      for (var key in query) {
        if (key !== "page") {
          param[key] = query[key];
        }
      }
      if (query.hasOwnProperty("mtgateway")) {
        param["mtgateway"] = query["mtgateway"] || 0;
      }
      vm.$nextTick(function () {
        vm.changeUrlGetList().then(function (result) {
          param["url"] = vm.urlDanhSach;
          console.log("urlDanhSach+++++++++++++++", vm.urlDanhSach);
          if (vm.code === "DanhSachTau") {
            if (vm.documentName && vm.documentYear) {
              param["documentName"] = vm.documentName;
              param["documentYear"] = vm.documentYear;
            }
          }
          if (vm.code === "DanhSachTauDichVu") {
            param["url"] = "";
            vm.loadDataTableDichVu(param);
          } else if (
            vm.code === "DanhSachDetailChuyenTuyen" ||
            vm.code === "DanhSachDetailTauDichVu"
          ) {
            vm.loadDataTableDetailCT_DV(param);
          } else {
            vm.loadDataTable(param);
          }
          vm.loadDataOther();
        });
      });
    },
  },
  methods: {
    // checkShowSwitchKeHoach: function () {
    //   var vm = this
    //   let path = vm.$router.history.current.path
    //   if (path && path.indexOf('tau-bien')) {
    //     vm.showSwitchKeHoach = false
    //   } else {
    //     vm.showSwitchKeHoach = true
    //   }
    // },
    canhBaoTinhPhi() {
      let vm = this;
      vm.$store
        .dispatch("canhbaotinhphi", {
          itineraryNo: vm.itineraryNo["itineraryNo"],
        })
        .then((result) => {
          vm.debitnoteInFlag = result["debitnoteInFlag"] || 0;
          vm.debitnoteOutFlag = result["debitnoteOutFlag"] || 0;
        })
        .catch((xhr) => {
          vm.debitnoteInFlag = 0;
          vm.debitnoteOutFlag = 0;
        });
    },
    getVmaitineraryRemarks() {
      let vm = this;
      console.log("checkStateVaoRoi==========", vm.checkStateVaoRoi);
      vm.$store
        .dispatch("getVmaitineraryRemarks", {
          itineraryNo: vm.itineraryNo["itineraryNo"],
          noticeShipType: vm.checkStateVaoRoi,
        })
        .then((result) => {
          vm.description = result["remarks"] || "";
        })
        .catch((xhr) => {
          vm.description = "";
          console.log(xhr);
        });
    },
    noiChuyenLai() {
      eventBus.$emit("setNoiChuyenLai", true);
      this.$store.commit("setNoiChuyenLai", true);
    },
    themTauMoi() {
      let vm = this;
      vm.$store.commit("setItineraryNo", {});
      vm.$store.commit("setSelectTau", {});
      if (vm.typeNavigate === "TauDen") {
        vm.$store.commit("setPttnd", false);
        vm.$router.push({
          path: "/tau-moi/ke_hoach/0/0/0/DanhSachTauDenCang/detail",
          query: {
            tauTrongCang: true,
            addNewShip: true,
          },
        });
      } else if (vm.typeNavigate === "PTTNDDen") {
        vm.$store.commit("setPttnd", true);
        let code =
          vm.typeKH === "ROI" ? "DanhSachPTTNDRoiCang" : "DanhSachPTTNDDenCang";
        vm.$router.push({
          path: "/tau-bien/ke_hoach/0/0/0/" + code + "/detail",
          query: {
            tauTrongCang: true,
            addNewShip: true,
          },
        });
      } else if (vm.typeNavigate === "TauDen200DWT") {
        vm.$store.commit("setPttnd", false);
        let code =
          vm.typeKH === "ROI" ? "DanhSach<200DWTRoi" : "DanhSach<200DWTVao";
        vm.$router.push({
          path: "/tau-moi/ke_hoach/0/0/0/" + code + "/detail",
          query: {
            tauTrongCang: true,
            addNewShip: true,
            isTau200DWT: true,
          },
        });
      }
      vm.dialogPTTND = false;
    },
    themMoiTau200DWT() {
      let vm = this;
      vm.typeNavigate = "TauDen200DWT";
      vm.headersDialog = vm.headersDialogTau.slice();
      vm.adv = {};
      vm.$store.commit("setItineraryNo", {});
      vm.dialogPTTND = true;
      vm.titleDS = "Danh sách tàu";
      vm.loadDsTau({
        shipBoat: "SHIP",
        vrCode: "VR200",
      });
    },
    themMoiTauDen() {
      let vm = this;
      vm.typeNavigate = "TauDen";
      vm.headersDialog = vm.headersDialogTau.slice();
      vm.adv = {};
      vm.$store.commit("setItineraryNo", {});
      vm.dialogPTTND = true;
      vm.titleDS = "Danh sách tàu";
      vm.loadDsTau({
        shipBoat: "SHIP",
      });
    },
    themMoiPTTND() {
      let vm = this;
      vm.adv = {};
      vm.headersDialog = vm.headersDialogPTTND.slice();
      vm.typeNavigate = "PTTNDDen";
      vm.$store.commit("setItineraryNo", {});
      vm.dialogPTTND = true;
      vm.titleDS = "Danh sách PTTNĐ";
      vm.loadDsTau({
        shipBoat: "BOAT",
      });
    },
    loadDsTau: function (data) {
      var vm = this;
      vm.loadingDialog = true;
      vm.$store.dispatch("loadInitResource").then(function (result) {
        let query = {};
        query["url"] = result["getVmaShip_Boat_URL"];
        // query['portofAuthority'] = vm.maritimeCode
        // query['portOfAuthority'] = vm.maritimeCode
        // query['maritimeCode'] = vm.maritimeCode
        query["getShip"] = true;
        query["start"] = 0;
        query["end"] = 15;
        for (var key in data) {
          query[key] = data[key];
        }
        for (var keyAdv in vm.advTau) {
          query[keyAdv] = vm.advTau[keyAdv];
        }
        vm.$store
          .dispatch("loadDanhSachTauBien", query)
          .then((result) => {
            if (result && result["data"]) {
              vm.itemsDialog = result["data"];
            } else {
              vm.itemsDialog = [];
            }
            vm.totalDsTau = result["total"] || 0;
            vm.loadingDialog = false;
          })
          .catch((xhr) => {
            vm.itemsDialog = [];
            vm.loadingDialog = false;
          });
      });
    },
    selectTauVaThemKH(item) {
      let vm = this;
      item["nameOfShip"] = item["shipName"];
      vm.$store.commit("setSelectTau", item);
      vm.$store.commit("setItineraryNo", {});
      if (vm.typeNavigate === "TauDongMoi") {
        vm.$router.push({
          path: "/tau-moi/ke_hoach/0/0/0/DanhSachNeoTau/detail?page=1",
          query: {
            tauTrongCang: true,
          },
        });
        // vm.$store.commit('setPttnd', false)
      } else if (vm.typeNavigate === "TauDen") {
        vm.$router.push({
          path: "/tau-moi/ke_hoach/0/0/0/DanhSachTauDenCang/detail?page=1",
          query: {
            tauTrongCang: true,
          },
        });
        vm.$store.commit("setPttnd", false);
      } else if (vm.typeNavigate === "TauDen200DWT") {
        vm.$router.push({
          path: "/tau-moi/ke_hoach/0/0/0/DanhSachTauDenCang/detail?page=1",
          query: {
            tauTrongCang: true,
            isTau200DWT: true,
          },
        });
        vm.$store.commit("setPttnd", false);
      } else {
        vm.$router.push({
          path: "/tau-bien/ke_hoach/0/0/0/DanhSachPTTNDDenCang/detail?page=1",
          query: {
            tauTrongCang: true,
          },
        });
        vm.$store.commit("setPttnd", true);
      }
      vm.dialogPTTND = false;
    },
    updateVmaCertificate_DmCertificate: function () {
      let vm = this;
      if (!vm.itemsDsTauAll || !vm.itemsDsTauAll.length) {
        return;
      }
      let arrTmp = vm.itemsDsTauAll.slice();
      arrTmp.map((item) => {
        item["itineraryNo"] = "";
        item["imoNumber"] = vm.selectTau
          ? vm.selectTau["imoNumber"]
          : vm.itineraryNo["imoNumber"];
        item["callSign"] = vm.selectTau
          ? vm.selectTau["callSign"]
          : vm.itineraryNo["callSign"];
        item["registryNumber"] = vm.selectTau
          ? vm.selectTau["registryNumber"]
          : vm.itineraryNo["registryNumber"];
        item["nameOfShip"] =
          vm.itineraryNo["nameOfShip"] || vm.selectTau["shipName"];
        item["shipName"] =
          vm.itineraryNo["nameOfShip"] || vm.selectTau["shipName"];
        item["isExamined"] = item["isExamined"] ? 1 : 0;
        return item;
      });
      let config = {};
      var params = new URLSearchParams();
      params.append("json", JSON.stringify(arrTmp));
      axios
        .post(
          vm.initData["updateVmaCertificate_DmCertificate_URL"],
          params,
          config
        )
        .then(function (response) {
          let result = response["data"];
          if (result && result["errorCode"]) {
            toastr.error("Xử lý thất bại, vui lòng thử lại!");
          } else {
            toastr.success("Thực hiện thành công!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    process_all_giay_to: function () {
      let vm = this;
      let config = {
        params: {},
      };
      axios
        .get(vm.getGiayToXuatTrinhPhuongTien, config)
        .then(function (response) {
          let serializable = response.data;
          vm.itemsGiayToXuatTrinhChoPhuongTien = serializable["data"] || [];
          vm.totalDsAll = serializable["total"];
        })
        .catch(function (error) {
          console.log(error);
        });
      // axios
      //   .get(vm.getGiayToXuatTrinh_39, config)
      //   .then(function (response) {
      //     let serializable = response.data
      //     vm.itemsGiayToXuatTrinh_39 = serializable
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      // axios
      //   .get(vm.getGiayToXuatTrinh_40, config)
      //   .then(function (response) {
      //     let serializable = response.data
      //     vm.itemsGiayToXuatTrinh_40 = serializable
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      // axios
      //   .get(vm.getGiayToXuatTrinh_48, config)
      //   .then(function (response) {
      //     let serializable = response.data
      //     vm.itemsGiayToXuatTrinh_48 = serializable
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      // axios
      //   .get(vm.getGiayToXuatTrinh_49, config)
      //   .then(function (response) {
      //     let serializable = response.data
      //     vm.itemsGiayToXuatTrinh_49 = serializable
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      // axios
      //   .get(vm.getGiayToXuatTrinh_50, config)
      //   .then(function (response) {
      //     let serializable = response.data
      //     vm.itemsGiayToXuatTrinh_50 = serializable
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
    },
    loadFlagStateOfShipName: function (stateCode) {
      var vm = this;
      return new Promise((resolve, reject) => {
        let param = {
          categoryId: "DM_STATE",
          stateCode: stateCode,
        };
        param["isDelete"] = 0;
        param["start"] = -1;
        param["end"] = -1;
        vm.$store
          .dispatch("loadDataDm", param)
          .then(function (result) {
            resolve(result);
          })
          .catch(function (xhr) {
            console.log(xhr);
            reject(xhr);
          });
      });
    },
    deleteSelectTable() {
      let vm = this;
      let cf = confirm("Bạn có thực sự muốn xóa dữ liệu này!");
      if (cf) {
        vm.loadingDelete = true;
        let actions = [];
        for (var i = 0; i < vm.selectAllValue.length; i++) {
          actions.push(vm.deleteItemTable(vm.selectAllValue[i]));
        }
        if (actions && actions.length) {
          Promise.all(actions)
            .then((results) => {
              let listSuccess = [];
              let listError = [];
              if (results && Array.isArray(results)) {
                results.forEach((item) => {
                  if (
                    item &&
                    item.hasOwnProperty("errorCode") &&
                    item["errorCode"]
                  ) {
                    listError.push(item);
                  } else {
                    listSuccess.push(item);
                  }
                });
              }
              if (listSuccess.length) {
                toastr.success(
                  "Xóa thành công " + listSuccess.length + " bản ghi!"
                );
              }
              if (listError.length) {
                toastr.error("Xóa thất bại " + listError.length + " bản ghi!");
              }
              vm.loadingDelete = false;
            })
            .catch((xhr) => {
              toastr.error("Xóa thất bại, vui lòng thử lại :(");
              vm.loadingDelete = false;
            });
        }
      }
    },
    deleteItemTable(item) {
      let vm = this;
      item["url"] = vm.urlDelete;
      return new Promise((resolve, reject) => {
        vm.$store
          .dispatch("deleteItemTable", item)
          .then((result) => {
            resolve(result);
            let index = vm.itemsDsTauAll.findIndex((itemDs) => {
              if (
                Object.entries(itemDs).toString() ===
                Object.entries(item).toString()
              ) {
                return true;
              }
            });
            if (
              (result && !result.hasOwnProperty("errorCode")) ||
              !result["errorCode"]
            ) {
              if (index !== -1) {
                vm.itemsDsTauAll.splice(index, 1);
                vm.totalDsAll--;
              }
            }
          })
          .catch((xhr) => {
            reject(xhr);
          });
      });
    },
    selectAllItem(data) {
      let vm = this;
      if (vm.selectAll) {
        vm.selectAllValue = vm.itemsDsTauAll;
      } else {
        vm.selectAllValue = [];
      }
    },
    getCheckedKH(noticeShipType, item) {
      let daDuyet = "done";
      let chuaDuyet = "clear";
      let tmp = "";
      if (noticeShipType === 1 || noticeShipType === "1") {
        if (
          item["markedAsArrival"] === 8 ||
          item["markedAsArrival"] === 9 ||
          item["markedAsArrival"] === 5 ||
          item["markedAsArrival"] === "8" ||
          item["markedAsArrival"] === "9" ||
          item["markedAsArrival"] === "5"
        ) {
          tmp = daDuyet;
        } else {
          tmp = chuaDuyet;
        }
      } else if (noticeShipType === 2 || noticeShipType === "2") {
        if (
          item["markedAsDeparture"] === 8 ||
          item["markedAsDeparture"] === 9 ||
          item["markedAsDeparture"] === 5 ||
          item["markedAsDeparture"] === "8" ||
          item["markedAsDeparture"] === "9" ||
          item["markedAsDeparture"] === "5"
        ) {
          tmp = daDuyet;
        } else {
          tmp = chuaDuyet;
        }
      } else if (noticeShipType === 3 || noticeShipType === "3") {
        if (
          item["markedAsTransmit"] === 8 ||
          item["markedAsTransmit"] === 9 ||
          item["markedAsTransmit"] === 5 ||
          item["markedAsTransmit"] === "8" ||
          item["markedAsTransmit"] === "9" ||
          item["markedAsTransmit"] === "5"
        ) {
          tmp = daDuyet;
        } else {
          tmp = chuaDuyet;
        }
      } else if (noticeShipType === 4 || noticeShipType === "4") {
        tmp = daDuyet;
      } else {
        if (
          item["markedAsVoyage"] === 8 ||
          item["markedAsVoyage"] === 9 ||
          item["markedAsVoyage"] === 5 ||
          item["markedAsVoyage"] === "8" ||
          item["markedAsVoyage"] === "9" ||
          item["markedAsVoyage"] === "5"
        ) {
          tmp = daDuyet;
        } else {
          tmp = chuaDuyet;
        }
      }
      return tmp;
    },
    loadHoSoChuyenTau: function (itineraryNo) {
      var vm = this;
      let param = {
        itineraryNo: itineraryNo["itineraryNo"],
      };
      // vm.loadingTableHoSoChuyenTau = true
      vm.$store
        .dispatch("loadHoSoChuyenTau", param)
        .then((result) => {
          if (!result.hasOwnProperty("errorCode")) {
            vm.mapNameData(result.data, true)
              .then((resultData) => {
                vm.loadingTableHoSoChuyenTau = false;
                vm.itemsHoSoChuyenTau = resultData;
              })
              .catch((xhr) => {
                vm.loadingTableHoSoChuyenTau = false;
              });
          } else {
            vm.itemsHoSoChuyenTau = [];
          }
          vm.loadingTableHoSoChuyenTau = false;
        })
        .catch((xhr) => {
          vm.loadingTableHoSoChuyenTau = false;
        });
    },
    changeType: function (data) {
      let currentUrl = this.$router.history.current.path;
      if (this.type === "ke_hoach") {
        currentUrl = currentUrl.replace("ke_hoach", "thu_tuc");
        router.push(currentUrl);
      } else {
        currentUrl = currentUrl.replace("thu_tuc", "ke_hoach");
        router.push(currentUrl);
      }
    },
    ccc: function (event) {
      console.log("ccc++++++++++", event);
      console.log("eee+++++++++++++++++", this.$refs.grid);
    },
    rowSelected: function (args) {
      let selectedrowindex = this.$refs.grid.getSelectedRowIndexes();
      if (selectedrowindex !== -1) {
        let data = this.itemsDsTauAll[selectedrowindex];
        this.toDetailTauBien(data);
      }
    },
    toDetailHs: function () {
      var vm = this;
      this.$router.push({
        path:
          "/ho-so/" +
          vm.type +
          "/" +
          vm.detailHs["documentName"] +
          "/" +
          vm.detailHs["documentYear"] +
          "/" +
          vm.detailHs["documentTypeCode"] +
          "/" +
          vm.detailHs["requestState"],
      });
      eventBus.$emit("eventSwitchPart", true);
    },
    toDetailHsOther: function () {
      var vm = this;
      this.$router.push({
        path:
          "/ho-so/" +
          vm.type +
          "/" +
          vm.detailHsOther["documentName"] +
          "/" +
          vm.detailHsOther["documentYear"] +
          "/" +
          vm.detailHsOther["documentTypeCode"] +
          "/" +
          vm.detailHsOther["requestState"],
      });
      eventBus.$emit("eventSwitchPart", true);
    },
    loadDetailHs: function (documentName, documentYear, typeNCXC) {
      var vm = this;
      let param = {
        documentName: documentName,
        documentYear: documentYear,
        type: vm.type,
        documentType: vm.documentType,
      };
      return new Promise((resolve, reject) => {
        vm.$store
          .dispatch("loadDetailHoSo", param)
          .then((result) => {
            if (result) {
              if (typeNCXC === "NC") {
                vm.detailHs = result;
              } else {
                vm.detailHsOther = result;
              }
            } else {
              vm.detailHs = {};
              vm.detailHsOther = {};
            }
            resolve(result);
          })
          .catch((xhr) => {
            reject(xhr);
          });
      });
    },
    themMoi() {
      var vm = this;
      if (vm.documentName && vm.documentName !== "0") {
        vm.$router.push({
          path:
            "/ho-so-phuong-tien/" +
            vm.type +
            "/" +
            vm.documentName +
            "/" +
            vm.documentYear +
            "/" +
            vm.documentTypeCode +
            "/" +
            vm.documentStatusCode +
            "/" +
            vm.code +
            "/0",
        });
      } else {
        let query = vm.$router.history.current.query;
        let path = vm.$router.history.current.path;
        if (
          vm.code === "DanhSachPTTNDDenCang" ||
          vm.code === "DanhSachPTTNDRoiCang"
        ) {
          vm.$store.commit("setItineraryNo", {});
          vm.typeKH = vm.code === "DanhSachPTTNDDenCang" ? "VAO" : "ROI";
          vm.themMoiPTTND();
          return;
        }
        if (
          vm.code === "DanhSach<200DWTVao" ||
          vm.code === "DanhSach<200DWTRoi"
        ) {
          vm.$store.commit("setItineraryNo", {});
          vm.typeKH = vm.code === "DanhSach<200DWTVao" ? "VAO" : "ROI";
          vm.themMoiTau200DWT();
          return;
        }
        if (path && path.indexOf("tau-moi") !== -1) {
          vm.$router.push({
            path:
              "/tau-moi/" +
              vm.type +
              "/" +
              vm.documentTypeCode +
              "/" +
              vm.documentStatusCode +
              "/" +
              0 +
              "/" +
              vm.code +
              "/detail",
            query: {
              ...query,
            },
          });
        } else if (path && path.indexOf("quan-ly-tau-bien") !== -1) {
          vm.$router.push({
            path:
              "/quan-ly-tau-bien/" +
              vm.type +
              "/" +
              vm.documentTypeCode +
              "/" +
              vm.documentStatusCode +
              "/" +
              vm.code +
              "/0",
            query: {
              ...query,
            },
          });
        } else {
          vm.$router.push({
            path:
              "/tau-bien/" +
              vm.type +
              "/" +
              vm.documentTypeCode +
              "/" +
              vm.documentStatusCode +
              "/" +
              0 +
              "/" +
              vm.code +
              "/detail",
            query: {
              ...query,
            },
          });
        }
      }
    },
    loadDataOther() {
      var vm = this;
      vm.headersDsTauAll.forEach(function (item, index) {
        if (item["type"] === "select") {
          if (item.id === "shipTypeCode") {
            vm.loadShipType();
          } else if (item.id === "flagStateOfShip") {
            vm.loadFlagStateOfShip();
          } else if (item.id === "cargoType") {
            vm.loadCargoType();
            vm.loadCargoType115();
          } else if (item.id === "thang") {
            vm.itemsSup["thangItems"] = support.thangItems;
          } else if (item.id === "pilotCode" || item.id === "pilotList") {
            vm.loadPilot();
          } else if (item.id === "chanelCodeList") {
            vm.loadChanelCodeList();
          } else if (
            item.id === "shipOperatorCode" ||
            item.id === "shipOperatorName"
          ) {
            vm.loadShipOwner({
              isShipOperator: 1,
            });
          } else if (
            item.id === "shipOwnerCode" ||
            item.id === "shipOwnerName"
          ) {
            vm.loadShipOwner({
              isShipOwner: 1,
            });
          } else if (
            item.id === "anchoringPortHarbourCode" ||
            item.id === "shiftingPortHarbourCode" ||
            item.id === "portHarbourCode"
          ) {
            vm.loadPortHarbour();
          } else if (
            item.id === "anchoringPortWharfCode" ||
            item.id === "shiftingPortWharfCode" ||
            item.id === "portWharfCode"
          ) {
            vm.loadPortWharf();
          } else if (
            item.id === "cargoCode" &&
            !vm.code === "DanhSachXepDoHang"
          ) {
            vm.loadCargo();
          } else if (
            item.id === "cargoCode" &&
            vm.code === "DanhSachXepDoHang"
          ) {
            console.log("cargoCode+++++++++++++++++DanhSachXepDoHang");
            vm.loadCargo_124();
          } else if (
            item.id === "shipAgencyCode" ||
            item.id === "arrivalShipAgency"
          ) {
            vm.loadShipAgency();
          } else if (item.id === "shipTypeMT") {
            vm.loadShipTypeMT();
          } else if (
            item.id === "cargoCategory" ||
            item.id === "cargoCategoryCode"
          ) {
            vm.loadCargoCategory();
          }
        }
      });
    },
    changeDate: function (data) {
      var vm = this;
      vm.searchAdvTable();
    },
    changeUrlGetList: function (val) {
      var vm = this;
      return new Promise(function (resolve, reject) {
        vm.loadingInitData
          .then(function (result) {
            switch (vm.code) {
              case "DanhSachTau": {
                vm.urlDanhSach = result["getVmaItineraryURL"];
                vm.urlDelete = result["deleteVmaItineraryURL"];
                break;
              }
              case "DanhSachViTriNeoDauTaiCang": {
                vm.urlDanhSach = result["getVmaScheduleAnchorage_Port_URL"];
                vm.urlDelete = result["deleteVmaScheduleAnchorageURL"];
                break;
              }
              case "DanhSachTauBien": {
                vm.urlDanhSach = result["getVmaShip_Ship_URL"];
                vm.urlDelete = result["deleteVmaShip_Ship_URL"];
                break;
              }
              case "DanhSachPhuongTienThuyNoiDia": {
                vm.urlDanhSach = result["getVmaShip_Boat_URL"];
                vm.urlDelete = result["deleteVmaShip_Boat_URL"];
                break;
              }
              case "DanhSachTauRoiCang": {
                vm.urlDanhSach = result["getVmaItinerarySchedule_Leave_URL"];
                vm.urlDelete = result["deleteVmaItineraryScheduleURL"];
                break;
              }
              case "DanhSachTauDenCang": {
                vm.urlDanhSach = result["getVmaItinerarySchedule_Come_URL"];
                vm.urlDelete = result["deleteVmaItineraryScheduleURL"];
                break;
              }
              case "DanhSachTauDiChuyen": {
                vm.urlDanhSach = result["getVmaScheduleShiftingURL"];
                vm.urlDelete = result["deleteVmaScheduleShiftingURL"];
                break;
              }
              case "DanhSachNeoTau": {
                vm.urlDanhSach = result["getVmaScheduleAnchorage_Ship_URL"];
                vm.urlDelete = result["deleteVmaScheduleAnchorage_Ship_URL"];
                break;
              }
              case "DanhSachTauLaiHoTro": {
                vm.urlDanhSach = result["getVmaScheduleTugboatURL"];
                vm.urlDelete = result["deleteVmaScheduleTugboatURL"];
                break;
              }
              case "DanhSachHoaTieuDanTau": {
                vm.urlDanhSach = result["getVmaSchedulePilotURL"];
                vm.urlDelete = result["deleteVmaSchedulePilotURL"];
                break;
              }
              case "DanhSachXepDoHang": {
                vm.urlDanhSach = result["getVmaScheduleCargolistURL"];
                vm.urlDelete = result["deleteVmaScheduleCargolistURL"];
                break;
              }
              case "DanhSachNhapTachDoan": {
                vm.urlDanhSach = result["getVmaScheduleMergingURL"];
                vm.urlDelete = result["deleteVmaScheduleMergingURL"];
                break;
              }
              case "DanhSachSuaChuaTau": {
                vm.urlDanhSach = result["getVmaScheduleShipyardURL"];
                vm.urlDelete = result["deleteVmaScheduleShipyardURL"];
                break;
              }
              case "DanhSachHaXuong": {
                vm.urlDanhSach = result["getVmaScheduleLaunchingURL"];
                vm.urlDelete = result["deleteVmaItineraryURL"];
                break;
              }
              case "DanhSachThuTau": {
                vm.urlDanhSach = result["getVmaScheduleTestingURL"];
                vm.urlDelete = result["deleteVmaScheduleTestingURL"];
                break;
              }
              case "DanhSachDuTau": {
                vm.urlDanhSach = result["getVmaScheduleSecurityURL"];
                vm.urlDelete = result["deleteVmaScheduleSecurityURL"];
                break;
              }
              case "DanhSachGhiChuCanhBao": {
                vm.urlDanhSach = result["getVmaItineraryRemarksURL"];
                vm.urlDelete = result["deleteVmaItineraryRemarksURL"];
                break;
              }
              case "DanhSachKhangNghiHangHai": {
                vm.urlDanhSach = result["getVmaItineraryProtestURL"];
                vm.urlDelete = result["deleteVmaItineraryProtestURL"];
                break;
              }
              case "DanhSachPTTNDDenCang": {
                vm.urlDanhSach = result["getVmaItinerarySchedule_Come_URL"];
                vm.urlDelete = result["deleteVmaItineraryScheduleURL"];
                break;
              }
              case "DanhSachPTTNDRoiCang": {
                vm.urlDanhSach = result["getVmaItinerarySchedule_Leave_URL"];
                vm.urlDelete = result["deleteVmaItineraryScheduleURL"];
                break;
              }
              case "DanhSach<200DWTVao": {
                vm.urlDanhSach = result["getVmaItinerarySchedule_Come_URL"];
                vm.urlDelete = result["deleteVmaItinerarySchedule_Come_URL"];
                break;
              }
              case "DanhSach<200DWTRoi": {
                vm.urlDanhSach = result["getVmaItinerarySchedule_Leave_URL"];
                vm.urlDelete = result["deleteVmaItinerarySchedule_Leave_URL"];
                break;
              }
              case "DanhSachTauThanhThai": {
                vm.urlDanhSach = result["getVmaShip_Ship_URL"];
                vm.urlDelete = result["deleteVmaShip_Ship_URL"];
                break;
              }
              case "DanhSachXacNhanAnToanAnNinh": {
                vm.urlDanhSach = result["getVmaShip_Ship_URL"];
                vm.urlDelete = result["deleteVmaShip_Ship_URL"];
                break;
              }
              case "DanhSachGiayToTau": {
                vm.urlDanhSach = result["getVmaCertificateURL"];
                vm.urlDelete = result["deleteVmaCertificateURL"];
                break;
              }
              case "DanhSachDetailChuyenTuyen": {
                vm.urlDanhSach = result["dsTBPTauChuyenTuyenURL"];
                vm.urlDelete = "";
                break;
              }
              case "DanhSachDetailTauDichVu": {
                vm.urlDanhSach = result["dsTBPTauDichVuURL"];
                vm.urlDelete = "";
                break;
              }
              default: {
                vm.urlDanhSach = result["getVmaScheduleXlineSailingURL"];
                vm.urlDelete = result["deleteVmaScheduleXlineSailingURL"];
              }
            }
            resolve(true);
          })
          .catch(function (xhr) {
            reject(false);
          });
      });
    },
    showXacBaoPhiDialog() {
      this.stateActionFee = "";
      if (this.code === "DanhSachTau") {
        let cf = confirm("Bạn có muốn thực hiện hành động này?");
        if (cf) {
          this.xacBaoTinhPhiTauBien_PTTND();
          return;
        }
      }
      this.stateXacBaoPhi = true;
    },
    showDialogTinhPhiLai(item) {
      this.stateActionFee = "TinhPhiLai";
      this.itemSelect = Object.assign({}, item);
      this.stateXacBaoPhi = true;
    },
    tinhPhiLai: function (item) {
      let vm = this;
      let cf = confirm("Bạn có muốn thực hiện hành động này!");
      if (cf) {
        let action = "";
        let param = {};
        if (vm.code === "DanhSachDetailTauDichVu") {
          action = "tinhPhiLaiTauDichVu";
          param = {
            tugboatCode: item["tugboatCode"],
            debitnoteNumber: item["debitnoteNumber"],
            fromDate: item["fromDate"],
            toDate: item["toDate"],
          };
        } else if (vm.code === "DanhSachDetailChuyenTuyen") {
          action = "tinhPhiLaiTauChuyenTuyen";
          param = {
            imo: item["imo"],
            callSign: item["callSign"],
            registryNumber: item["registryNumber"],
            debitnoteNumber: item["debitnoteNumber"],
            fromDate: item["fromDate"],
            toDate: item["toDate"],
          };
        }
        vm.$store
          .dispatch(action, param)
          .then(function (result) {
            if (result && !result["errorCode"]) {
              toastr.success("Thực hiện thành công!");
            } else {
              toastr.error("Thực hiện thất bại, vui lòng thử lại");
            }
          })
          .catch((xhr) => {
            toastr.error("Thực hiện thất bại, vui lòng thử lại");
          });
      }
    },
    huyTinhPhi: function (item) {
      let vm = this;
      let cf = confirm("Bạn có muốn thực hiện hành động này!");
      if (cf) {
        let action = "";
        let param = {};
        if (vm.code === "DanhSachDetailTauDichVu") {
          action = "huyTinhPhiTauDichVu";
          param = {
            cancelMode: 1,
            tugboatCode: item["tugboatCode"],
            debitnoteNumber: item["debitnoteNumber"],
          };
        } else if (vm.code === "DanhSachDetailChuyenTuyen") {
          action = "huyTinhPhiTauChuyenTuyen";
          param = {
            cancelMode: 1,
            imo: item["imo"],
            callSign: item["callSign"],
            registryNumber: item["registryNumber"],
            debitnoteNumber: item["debitnoteNumber"],
          };
        }
        vm.$store
          .dispatch(action, param)
          .then(function (result) {
            if (result && !result["errorCode"]) {
              toastr.success("Thực hiện thành công!");
            } else {
              toastr.error("Thực hiện thất bại, vui lòng thử lại");
            }
          })
          .catch((xhr) => {
            toastr.error("Thực hiện thất bại, vui lòng thử lại");
          });
      }
    },
    loadDataTable: function (param) {
      var vm = this;
      console.log("vm.code++++++++++", vm.code);
      let path = vm.$router.history.current.path;
      if (
        path.indexOf("/quan-ly-tau-bien") !== -1 ||
        path.indexOf("/danh-sach-ho-so") !== -1
      ) {
        param["itineraryNo"] = vm.itineraryNo["itineraryNo"] || "";
      } else {
        param["itineraryNo"] = vm.itineraryNo["itineraryNo"] || 0;
      }
      if (vm.code === "DanhSachTauThanhThai") {
        param["shipBoat"] = "";
        param["deconstructed"] = 1;
      }
      if (vm.code === "DanhSachXacNhanAnToanAnNinh") {
        param["shipBoat"] = "";
        param["violated"] = 1;
      }
      if (vm.code === "DanhSachTauBien") {
        param["shipBoat"] = "SHIP";
      }
      if (
        vm.code === "DanhSachPhuongTienThuyNoiDia" ||
        vm.code === "DanhSachPTTNDDenCang" ||
        vm.code === "DanhSachPTTNDRoiCang"
      ) {
        param["shipBoat"] = "BOAT";
      }
      if (vm.code === "DanhSachTauDenCang") {
        param["shipBoat"] = "SHIP";
        param["noticeShipType"] = 1;
      }
      if (vm.code === "DanhSachTauRoiCang") {
        param["shipBoat"] = "SHIP";
        param["noticeShipType"] = 2;
      }
      // if (vm.code === 'DanhSachPTTNDDenCang' || vm.code === 'DanhSachPTTNDRoiCang') {
      //   param['mtgateway'] = 0
      // }
      if (vm.code === "DanhSachTauLaiHoTro" && !param["noticeShipType"]) {
        param["noticeShipType"] = 1;
      }
      if (vm.code === "DanhSachPTTNDDenCang") {
        param["markedAsArrival"] = "1,2,3,4,5,6,7,8,9";
        param["shipBoat"] = "BOAT";
        param["noticeShipType"] = 1;
      }
      if (vm.code === "DanhSachPTTNDRoiCang") {
        param["markedAsDeparture"] = "1,2,3,4,5,6,7,8,9";
        param["noticeShipType"] = 2;
        param["shipBoat"] = "BOAT";
      }
      if (vm.code === "DanhSach<200DWTVao") {
        param["markedAsArrival"] = "1,2,3,4,5,6,7,8,9";
        param["shipBoat"] = "SHIP";
        param["noticeShipType"] = 1;
        param["vrCode"] = "VR200";
      }
      if (vm.code === "DanhSach<200DWTRoi") {
        param["markedAsDeparture"] = "1,2,3,4,5,6,7,8,9";
        param["shipBoat"] = "SHIP";
        param["noticeShipType"] = 2;
        param["vrCode"] = "VR200";
      }
      if (vm.code === "DanhSachKeHoachChuyenTuyen") {
        param["itineraryNo"] = "";
        param["imo"] = vm.selectTau ? vm.selectTau["imoNumber"] : "";
        param["imoNumber"] = vm.selectTau ? vm.selectTau["imoNumber"] : "";
        param["callSign"] = vm.selectTau ? vm.selectTau["callSign"] : "";
        param["registryNumber"] = vm.selectTau
          ? vm.selectTau["registryNumber"]
          : "";
        param["nameOfShip"] = vm.selectTau ? vm.selectTau["shipName"] : "";
      }
      if (vm.code === "DanhSachTauDiChuyen") {
        param["noticeShipType"] = 4;
      }
      if (vm.code === "DanhSachThuTau") {
        param["noticeShipType"] = 5;
      }
      if (vm.code === "DanhSachGiayToTau") {
        param["start"] = -1;
        param["end"] = -1;
        if (!vm.itineraryNo["nameOfShip"] && !vm.selectTau["shipName"]) {
          console.log("DanhSachGiayToTau ERROR, NameOfShip empty!!!!!!!");
          vm.loadingTableAlll = false;
          vm.itemsDsTauAll = [];
          vm.totalDsAll = 0;
          return;
        }
        param["itineraryNo"] = "";
        param["nameOfShip"] =
          vm.itineraryNo["nameOfShip"] || vm.selectTau["shipName"];
        param["imo"] = vm.selectTau ? vm.selectTau["imoNumber"] : "";
        param["imoNumber"] = vm.selectTau ? vm.selectTau["imoNumber"] : "";
        param["callSign"] = vm.selectTau ? vm.selectTau["callSign"] : "";
        param["registryNumber"] = vm.selectTau
          ? vm.selectTau["registryNumber"]
          : "";
      }
      param["maritimeCode"] = vm.maritimeCode;
      console.log("vm.maritimeCode++++++++++++", vm.maritimeCode);
      vm.loadingTableAlll = true;
      vm.$store
        .dispatch("loadDanhSachTauBien", param)
        .then(function (result) {
          if (!result.hasOwnProperty("errorCode")) {
            if (
              vm.code === "DanhSachTau" &&
              vm.documentName &&
              vm.documentName !== "0"
            ) {
              vm.totalDsAll = result.total ? 1 : 0;
            } else {
              vm.totalDsAll = result.total;
            }
            if (vm.code === "DanhSachGiayToTau") {
              vm.itemsDsTauAll = vm.convertKeyGiayToTau(vm.itemsDsTauAll);
            }
            vm.mapNameData(result.data, false)
              .then((resultData) => {
                vm.loadingTableAlll = false;
                vm.itemsDsTauAll = resultData;
              })
              .catch((xhr) => {
                vm.loadingTableAlll = false;
              });
          } else {
            vm.itemsDsTauAll = [];
            vm.totalDsAll = 0;
            vm.loadingTableAlll = false;
          }
          if (vm.code === "DanhSachTauDiChuyen") {
            vm.$store.commit("totalTauDiChuyen", vm.totalDsAll);
          }
        })
        .catch((xhr) => {
          vm.loadingTableAlll = false;
          vm.itemsDsTauAll = [];
        });
    },
    convertKeyGiayToTau: function (arr) {
      if (arr && arr.length) {
        arr.map((item) => {
          if (item["isExamined"] === 1 || item["isExamined"] === "1") {
            item["isExamined"] = true;
          } else {
            item["isExamined"] = false;
          }
          return item;
        });
      } else {
        return [];
      }
      return arr;
    },
    checkHistoryTempDebitnote: function (param) {
      var vm = this;
      if (!param) {
        param = {};
      }
      param["itineraryNo"] = vm.itineraryNo["itineraryNo"];
      param["documentName"] = vm.documentName;
      param["documentYear"] = vm.documentYear;
      vm.$store
        .dispatch("checkHistoryTempDebitnote", param)
        .then(function (result) {
          vm.checkThongBaoPhi = result["counter"] <= 0;
        })
        .catch((xhr) => {
          vm.checkThongBaoPhi = false;
        });
    },
    loadDataTableDichVu: function (param) {
      var vm = this;
      if (!param) {
        param = {};
      }
      vm.loadingTableAlll = true;
      vm.$store
        .dispatch("loadDataTugboat", param)
        .then(function (result) {
          vm.itemsDsTauAll = result["data"] || [];
          vm.totalDsAll = result["total"] || 0;
          vm.loadingTableAlll = false;
        })
        .catch(function (xhr) {
          console.log(xhr);
          vm.itemsDsTauAll = [];
          vm.totalDsAll = 0;
          vm.loadingTableAlll = false;
        });
    },
    loadDataTableDetailCT_DV: function (param) {
      var vm = this;
      if (!param) {
        param = {};
      }
      vm.loadingTableAlll = true;
      param["maritimeCode"] = vm.maritimeCode;
      if (vm.code === "DanhSachDetailTauDichVu") {
        param["itineraryNo"] = "KEYTAUDICHVU";
      } else if (vm.code === "DanhSachDetailChuyenTuyen") {
        param["itineraryNo"] = "KEYTAUKHACH";
      }
      vm.$store
        .dispatch("loadDanhSachThanhToan", param)
        .then(function (result) {
          vm.itemsDsTauAll = result["data"] || [];
          vm.totalDsAll = result["total"] || 0;
          vm.loadingTableAlll = false;
        })
        .catch((xhr) => {
          vm.itemsDsTauAll = [];
          vm.totalDsAll = 0;
          vm.loadingTableAlll = false;
        });
    },
    loadCargoType: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_GOODS_TYPE",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.goodsTypeNameVN,
                itemValue: item.goodsTypeCode,
              };
            });
            vm.itemsSup["cargoTypeItems"] = result;
          } else {
            vm.itemsSup["cargoTypeItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadItineraryFromUrlQuery: function () {
      let vm = this;
      let query = vm.$router.history.current.query;
      return new Promise((resolve, reject) => {
        if (
          query &&
          query.hasOwnProperty("itineraryNo") &&
          query["itineraryNo"]
        ) {
          vm.$store
            .dispatch("loadItineraryFromItineraryNo", {
              itineraryNo: query["itineraryNo"],
            })
            .then((result) => {
              resolve(result);
            })
            .catch((xhr) => {
              reject(xhr);
            });
        } else {
          resolve({});
        }
      });
    },
    loadShipTypeMT: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_VMA_SHIP_TYPE",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.shipTypeName,
                itemValue: item.shipTypeCode,
              };
            });
            vm.itemsSup["shipTypeMTItems"] = result;
          } else {
            vm.itemsSup["shipTypeMTItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadCargoType115: function (data) {
      var vm = this;
      let param = {
        dataGroupId: "115",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataItems", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.name,
                itemValue: item.code,
              };
            });
            vm.itemsSup["cargo_115Items"] = result;
          } else {
            vm.itemsSup["cargo_115Items"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    xemBangKe: function (item) {
      let vm = this;
      vm.txtThongBaoPhi = "Xem bảng kê";
      vm.dialogViewThongBaoPhi = true;
      vm.loadingPhieuThu = true;
      let action = "xemBangKeTauDichVu";
      if (vm.code === "DanhSachDetailTauDichVu") {
        action = "xemBangKeTauDichVu";
      } else if (vm.code === "DanhSachDetailChuyenTuyen") {
        action = "xemBangChuyenTuyen";
      }
      vm.$store
        .dispatch(action, {
          tugboatCode: item["tugboatCode"],
          fromDate: item["fromDate"],
          toDate: item["toDate"],
          xemBK_Thutuc: 0,
        })
        .then(function (result) {
          vm.urlViewThongBaoPhi = result;
          vm.loadingPhieuThu = false;
        })
        .catch((xhr) => {
          toastr.error("Không thể hiển thị, vui lòng thử lại");
          vm.urlViewThongBaoPhi = "";
          vm.loadingPhieuThu = false;
        });
    },
    loadCargoCategory: function (data) {
      var vm = this;
      let param = {
        dataGroupId: "119",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataItems", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.name,
                itemValue: item.code,
              };
            });
            vm.itemsSup["cargoCategoryItems"] = result;
          } else {
            vm.itemsSup["cargoCategoryItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadChanelCodeList: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_TUYEN_LUONG",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.name,
                itemValue: item.code,
              };
            });
            vm.itemsSup["chanelCodeListItems"] = result;
          } else {
            vm.itemsSup["chanelCodeListItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadFlagStateOfShip: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_STATE",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.stateName,
                itemValue: item.stateCode,
              };
            });
            vm.itemsSup["quocTichItems"] = result;
          } else {
            vm.itemsSup["quocTichItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadPilot: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_VMA_PILOT",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.pilotName,
                itemValue: item.pilotCode,
              };
            });
            vm.itemsSup["pilotItems"] = result;
          } else {
            vm.itemsSup["pilotItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadShipType: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_SHIP_TYPE",
        applyShip: 1,
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            result = result.map((item) => {
              return {
                itemText: item.shipTypeNameVN,
                itemValue: item.shipTypeCode,
              };
            });
            vm.itemsSup["shipTypeItems"] = result;
          } else {
            vm.itemsSup["shipTypeItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadShipOwner: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_VMA_SHIP_OWNER",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result) && data.hasOwnProperty("isShipOwner")) {
            vm.itemsSup["shipOwnerItems"] = result.map((item) => {
              return {
                itemText: item["companyName"],
                itemValue: item["shipOwnerCode"],
              };
            });
          } else if (data.hasOwnProperty("isShipOperator")) {
            vm.itemsSup["shipOperatorItems"] = result.map((item) => {
              return {
                itemText: item["companyName"],
                itemValue: item["shipOwnerCode"],
              };
            });
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadDonVi: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_REPRESENTATIVE",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["representativeItems"] = result.map((item) => {
              return {
                itemText: item["repNameVN"],
                itemValue: item["repCode"],
              };
            });
          } else {
            vm.itemsSup["representativeItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadsecurityLevel: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_SECURITY_LEVEL",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["securityLevelItems"] = result.map((item) => {
              return {
                itemText: item["securityLevelName"],
                itemValue: item["securityLevelCode"],
              };
            });
          } else {
            vm.itemsSup["securityLevelItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadPortWharf: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_PORT_WHARF",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["maritimeCode"] = vm.maritimeCode;
      param["portofAuthority"] = vm.maritimeCode;
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["portWharfItems"] = result.map((item) => {
              return {
                itemText: item["portWharfNameVN"],
                itemValue: item["portWharfCode"],
              };
            });
          } else {
            vm.itemsSup["portWharfItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadShipAgency: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_SHIP_AGENCY",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["shipAgencyItems"] = result.map((item) => {
              return {
                itemText: item["shipAgencyNameVN"],
                itemValue: item["shipAgencyCode"],
              };
            });
          } else {
            vm.itemsSup["shipAgencyItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadPortHarbour: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_PORT_HARBOUR",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["portHarbourItems"] = result.map((item) => {
              return {
                itemText: item["portHarbourNameVN"],
                itemValue: item["portHarbourCode"],
              };
            });
          } else {
            vm.itemsSup["portHarbourItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadPurpose: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_PURPOSE",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["purposeItems"] = result.map((item) => {
              return {
                itemText: item["purposeName"],
                itemValue: item["purposeCode"],
              };
            });
          } else {
            vm.itemsSup["purposeItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadCargo_115: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_DATAITEM_GROUP124",
      };
      if (vm.id && vm.id !== "0") {
        delete param["isDelete"];
      } else {
        param["isDelete"] = 0;
      }
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["cargo_124Items"] = result.map((item) => {
              return {
                itemText: item["name"],
                itemValue: item["code0"],
              };
            });
          } else {
            vm.itemsSup["cargo_124Items"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadCargo_124: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_DATAITEM_GROUP124",
      };
      if (vm.id && vm.id !== "0") {
        delete param["isDelete"];
      } else {
        param["isDelete"] = 0;
      }
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["cargo_124Items"] = result.map((item) => {
              return {
                itemText: item["name"],
                itemValue: item["code0"],
              };
            });
          } else {
            vm.itemsSup["cargo_124Items"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    loadCargo: function (data) {
      var vm = this;
      let param = {
        categoryId: "DM_CARGO_ON_BOARD",
      };
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      param["start"] = -1;
      param["end"] = -1;
      vm.$store
        .dispatch("loadDataDm", param)
        .then(function (result) {
          if (Array.isArray(result)) {
            vm.itemsSup["cargoItems"] = result.map((item) => {
              return {
                itemText: item["goodsTypeNameVN"],
                itemValue: item["goodsTypeCode"],
              };
            });
          } else {
            vm.itemsSup["cargoItems"] = [];
          }
        })
        .catch(function (xhr) {
          console.log(xhr);
        });
    },
    searchAdvTable() {
      var vm = this;
      let advTemp = vm.adv;
      console.log("advTemp++++++++++++++", advTemp);
      let current = vm.$router.history.current;
      let newQuery = current.query;
      if (!newQuery) {
        newQuery = {};
      }
      newQuery["page"] = 1;
      for (var key in newQuery) {
        if (advTemp.hasOwnProperty(key)) {
          delete newQuery[key];
        }
        // if (advTemp.hasOwnProperty('chanelCodeList') && advTemp['chanelCodeList']) {
        //   console.log('advTemp["chanelCodeList"]+++++++++++++++++++', advTemp['chanelCodeList'])
        //   advTemp['chanelCodeList'] = advTemp['chanelCodeList'].join(',')
        // }
      }
      vm.$router.push({
        path: current.path,
        query: {
          ...newQuery,
          ...advTemp,
        },
      });
    },
    bindModelSearchAdv() {
      var vm = this;
      let current = vm.$router.history.current;
      let query = current.query;
      if (query) {
        for (var key in query) {
          if (key !== "start" && key !== "end") {
            // if (key === 'chanelCodeList' && query[key]) {
            //   vm.adv[key] = query[key].split(',')
            // } else {
            //   vm.adv[key] = query[key]
            // }
            vm.adv[key] = query[key];
          }
        }
      }
    },
    parseDate(date) {
      if (!date) return null;
      console.log(date.split("-"));
      const [year, month, day] = date.split("-");
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    },
    paggingData(config) {
      let vm = this;
      let current = vm.$router.history.current;
      let newQuery = current.query;
      let queryString = "?";
      newQuery["page"] = "";
      for (let key in newQuery) {
        if (
          newQuery[key] !== "" &&
          newQuery[key] !== "undefined" &&
          newQuery[key] !== undefined
        ) {
          queryString += key + "=" + newQuery[key] + "&";
        }
      }
      queryString += "page=" + config.page;
      vm.$router.push({
        path: current.path + queryString,
      });
    },
    themMoiSuDungTauLai() {
      var vm = this;
      vm.$router.push({
        path:
          "/ho-so-phuong-tien/" +
          vm.type +
          "/" +
          vm.documentName +
          "/" +
          vm.documentYear +
          "/" +
          vm.documentTypeCode +
          "/" +
          vm.documentStatusCode +
          "/DanhSachTauLaiHoTro/0",
      });
    },
    themMoiSuDungHoaTieu() {
      var vm = this;
      vm.$router.push({
        path:
          "/ho-so-phuong-tien/" +
          vm.type +
          "/" +
          vm.documentName +
          "/" +
          vm.documentYear +
          "/" +
          vm.documentTypeCode +
          "/" +
          vm.documentStatusCode +
          "/DanhSachHoaTieuDanTau/0",
      });
    },
    mapNameData(data, tableHoSoChuyenTau) {
      var vm = this;
      return new Promise((resolve, reject) => {
        if (!data || !Array.isArray(data) || !data.length) {
          console.log("no data table!");
          resolve([]);
          return;
        }
        if (
          vm.code === "DanhSachTau" &&
          vm.documentName &&
          vm.documentName !== "0" &&
          !tableHoSoChuyenTau
        ) {
          data = [data[0]];
        }
        let dmAnchoringPortHarbourCode = [];
        let dmAnchoringPortWharfCode = [];
        let dmShiftingPortHarbourCode = [];
        let dmShiftingPortWharfCode = [];
        let dmShiftingPortRegionCode = [];
        let dmLastPortHarbourCode = [];
        let dmLastPortWharfCode = [];
        let dmLastPortRegionCode = [];
        let dmNextMaritimePortCode = [];
        let dmNextPortRegionCode = [];
        let dmNextPortHarbourCode = [];
        let dmNextPortWharfCode = [];
        let dmPortRegionCode = [];
        let dmPortHarbourCode = [];
        let dmPortWharfCode = [];
        let dmShipTypeCode = [];
        let dmFlagStateOfShip = [];
        let dmNoticeShipType = [];
        let dmChanelCodeList = [];
        let dmShipAgencyCode = [];
        // let dmCargoCategory = []
        let dmCargo = [];
        let dmShipOperator = [];
        let dmShipOwner = [];
        let actions = [];
        for (var i = 0; i < data.length; i++) {
          if (
            data[i].hasOwnProperty("shipOperatorCode") &&
            data[i].shipOperatorCode &&
            (!data[i].hasOwnProperty("shipOperatorName") ||
              !data[i]["shipOperatorName"])
          ) {
            dmShipOperator.push({
              code: data[i]["shipOperatorCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("shipOwnerCode") &&
            data[i].shipOwnerCode &&
            (!data[i].hasOwnProperty("shipOwnerName") ||
              !data[i]["shipOwnerName"])
          ) {
            dmShipOwner.push({
              code: data[i]["shipOwnerCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("shipAgencyCode") &&
            data[i].shipAgencyCode &&
            (!data[i].hasOwnProperty("shipAgencyName") ||
              !data[i]["shipAgencyName"])
          ) {
            dmShipAgencyCode.push({
              code: data[i]["shipAgencyCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("cargoCode") &&
            data[i].cargoCode &&
            (!data[i].hasOwnProperty("cargoName") || !data[i]["cargoName"])
          ) {
            dmCargo.push({
              code: data[i]["cargoCode"],
              index: i,
            });
          }
          // if (data[i].hasOwnProperty('cargoCategory') && data[i].cargoCategory && (!data[i].hasOwnProperty('cargoCategoryName') || !data[i]['cargoCategoryName'])) {
          //   dmCargoCategory.push({
          //     code: data[i]['cargoCategory'],
          //     index: i
          //   })
          // }
          if (
            data[i].hasOwnProperty("chanelCodeList") &&
            data[i].chanelCodeList
          ) {
            dmChanelCodeList.push({
              code: data[i]["chanelCodeList"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("flagStateOfShip") &&
            data[i].flagStateOfShip
          ) {
            dmFlagStateOfShip.push({
              code: data[i]["flagStateOfShip"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("noticeShipType") &&
            data[i].noticeShipType
          ) {
            dmNoticeShipType.push({
              code: data[i]["noticeShipType"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("anchoringPortHarbourCode") &&
            data[i].anchoringPortHarbourCode
          ) {
            dmAnchoringPortHarbourCode.push({
              code: data[i]["anchoringPortHarbourCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("anchoringPortWharfCode") &&
            data[i].anchoringPortWharfCode
          ) {
            dmAnchoringPortWharfCode.push({
              code: data[i]["anchoringPortWharfCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("shiftingPortHarbourCode") &&
            data[i].shiftingPortHarbourCode
          ) {
            dmShiftingPortHarbourCode.push({
              code: data[i]["shiftingPortHarbourCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("shiftingPortWharfCode") &&
            data[i].shiftingPortWharfCode
          ) {
            dmShiftingPortWharfCode.push({
              code: data[i]["shiftingPortWharfCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("shiftingPortRegionCode") &&
            data[i].shiftingPortRegionCode
          ) {
            dmShiftingPortRegionCode.push({
              code: data[i]["shiftingPortRegionCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("lastPortHarbourCode") &&
            data[i].lastPortHarbourCode
          ) {
            dmLastPortHarbourCode.push({
              code: data[i]["lastPortHarbourCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("lastPortWharfCode") &&
            data[i].lastPortWharfCode
          ) {
            dmLastPortWharfCode.push({
              code: data[i]["lastPortWharfCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("lastPortRegionCode") &&
            data[i].lastPortRegionCode
          ) {
            dmLastPortRegionCode.push({
              code: data[i]["lastPortRegionCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("nextMaritimePortCode") &&
            data[i].nextMaritimePortCode
          ) {
            dmNextMaritimePortCode.push({
              code: data[i]["nextMaritimePortCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("nextPortRegionCode") &&
            data[i].nextPortRegionCode
          ) {
            dmNextPortRegionCode.push({
              code: data[i]["nextPortRegionCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("nextPortHarbourCode") &&
            data[i].nextPortHarbourCode
          ) {
            dmNextPortHarbourCode.push({
              code: data[i]["nextPortHarbourCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("nextPortWharfCode") &&
            data[i].nextPortWharfCode
          ) {
            dmNextPortWharfCode.push({
              code: data[i]["nextPortWharfCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("portRegionCode") &&
            data[i].portRegionCode
          ) {
            dmPortRegionCode.push({
              code: data[i]["portRegionCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("portHarbourCode") &&
            data[i].portHarbourCode
          ) {
            dmPortHarbourCode.push({
              code: data[i]["portHarbourCode"],
              index: i,
            });
          }
          if (
            data[i].hasOwnProperty("portWharfCode") &&
            data[i].portWharfCode
          ) {
            dmPortWharfCode.push({
              code: data[i]["portWharfCode"],
              index: i,
            });
          }
          if (data[i].hasOwnProperty("shipTypeCode") && data[i].shipTypeCode) {
            dmShipTypeCode.push({
              code: data[i]["shipTypeCode"],
              index: i,
            });
          }
        }
        if (dmAnchoringPortHarbourCode.length) {
          let codeArr = dmAnchoringPortHarbourCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_HARBOUR",
                portHarbourCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortHarbour, index) => {
                      if (
                        itemRes["portHarbourCode"] ===
                        itemPortHarbour["anchoringPortHarbourCode"]
                      ) {
                        data[index]["anchoringPortHarbourName"] =
                          itemRes["portHarbourNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmAnchoringPortWharfCode.length) {
          let codeArr = dmAnchoringPortWharfCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_WHARF",
                portWharfCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortWharf, index) => {
                      if (
                        itemRes["portWharfCode"] ===
                        itemPortWharf["anchoringPortWharfCode"]
                      ) {
                        data[index]["anchoringPortWharfName"] =
                          itemRes["portWharfNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShiftingPortHarbourCode.length) {
          let codeArr = dmShiftingPortHarbourCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_HARBOUR",
                portHarbourCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortHarbour, index) => {
                      if (
                        itemRes["portHarbourCode"] ===
                        itemPortHarbour["shiftingPortHarbourCode"]
                      ) {
                        data[index]["shiftingPortHarbourName"] =
                          itemRes["portHarbourNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShiftingPortWharfCode.length) {
          let codeArr = dmShiftingPortWharfCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_WHARF",
                portWharfCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortWharf, index) => {
                      if (
                        itemRes["portWharfCode"] ===
                        itemPortWharf["shiftingPortWharfCode"]
                      ) {
                        data[index]["shiftingPortWharfName"] =
                          itemRes["portWharfNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShiftingPortRegionCode.length) {
          let codeArr = dmShiftingPortRegionCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_REGION",
                portRegionCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortRegion, index) => {
                      if (
                        itemRes["portRegionCode"] ===
                        itemPortRegion["shiftingPortRegionCode"]
                      ) {
                        data[index]["shiftingPortRegionName"] =
                          itemRes["portRegionNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmLastPortHarbourCode.length) {
          let codeArr = dmLastPortHarbourCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_HARBOUR",
                portHarbourCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortHarbour, index) => {
                      if (
                        itemRes["portHarbourCode"] ===
                        itemPortHarbour["lastPortHarbourCode"]
                      ) {
                        data[index]["lastPortHarbourName"] =
                          itemRes["portHarbourNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmLastPortWharfCode.length) {
          let codeArr = dmLastPortWharfCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_WHARF",
                portWharfCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortWharf, index) => {
                      if (
                        itemRes["portWharfCode"] ===
                        itemPortWharf["lastPortWharfCode"]
                      ) {
                        data[index]["lastPortWharfName"] =
                          itemRes["portWharfNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmLastPortRegionCode.length) {
          let codeArr = dmLastPortRegionCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_REGION",
                portRegionCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortRegion, index) => {
                      if (
                        itemRes["portRegionCode"] ===
                        itemPortRegion["lastPortRegionCode"]
                      ) {
                        data[index]["lastPortRegionName"] =
                          itemRes["portRegionNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmNextMaritimePortCode.length) {
          let codeArr = dmNextMaritimePortCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_MARITIME",
                maritimeCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemMaritime, index) => {
                      if (
                        itemRes["maritimeCode"] ===
                        itemMaritime["nextMaritimePortCode"]
                      ) {
                        data[index]["nextMaritimePortName"] =
                          itemRes["maritimeNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmNextPortRegionCode.length) {
          let codeArr = dmNextPortRegionCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_REGION",
                portRegionCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortRegion, index) => {
                      if (
                        itemRes["portRegionCode"] ===
                        itemPortRegion["nextPortRegionCode"]
                      ) {
                        data[index]["nextPortRegionName"] =
                          itemRes["portRegionNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmNextPortHarbourCode.length) {
          let codeArr = dmNextPortHarbourCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_HARBOUR",
                portHarbourCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortHarbour, index) => {
                      if (
                        itemRes["portHarbourCode"] ===
                        itemPortHarbour["nextPortHarbourCode"]
                      ) {
                        data[index]["nextPortHarbourName"] =
                          itemRes["portHarbourNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmNextPortWharfCode.length) {
          let codeArr = dmNextPortWharfCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_WHARF",
                portWharfCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortWharf, index) => {
                      if (
                        itemRes["portWharfCode"] ===
                        itemPortWharf["nextPortWharfCode"]
                      ) {
                        data[index]["nextPortWharfName"] =
                          itemRes["portWharfNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmPortRegionCode.length) {
          let codeArr = dmPortRegionCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_HARBOUR",
                portRegionCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortRegion, index) => {
                      if (
                        itemRes["portRegionCode"] ===
                        itemPortRegion["portRegionCode"]
                      ) {
                        data[index]["portRegionName"] =
                          itemRes["portRegionNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmPortHarbourCode.length) {
          let codeArr = dmPortHarbourCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_HARBOUR",
                portHarbourCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortHarbour, index) => {
                      if (
                        itemRes["portHarbourCode"] ===
                        itemPortHarbour["portHarbourCode"]
                      ) {
                        data[index]["portHarbourName"] =
                          itemRes["portHarbourNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmPortWharfCode.length) {
          let codeArr = dmPortWharfCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_PORT_WHARF",
                portWharfCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemPortHarWharf, index) => {
                      if (
                        itemRes["portWharfCode"] ===
                        itemPortHarWharf["portWharfCode"]
                      ) {
                        data[index]["portWharfName"] =
                          itemRes["portWharfNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShipTypeCode.length) {
          let codeArr = dmShipTypeCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_SHIP_TYPE",
                shipTypeCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemShipType, index) => {
                      if (
                        itemRes["shipTypeCode"] === itemShipType["shipTypeCode"]
                      ) {
                        data[index]["shipTypeName"] = itemRes["shipTypeNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmFlagStateOfShip.length) {
          let codeArr = dmFlagStateOfShip
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_STATE",
                stateCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemShipType, index) => {
                      if (
                        itemRes["stateCode"] === itemShipType["flagStateOfShip"]
                      ) {
                        data[index]["flagStateOfShipName"] =
                          itemRes["stateName"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShipAgencyCode.length) {
          let codeArr = dmShipAgencyCode
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_SHIP_AGENCY",
                shipAgencyCode: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemShipAgency, index) => {
                      if (
                        itemRes["shipAgencyCode"] ===
                        itemShipAgency["shipAgencyCode"]
                      ) {
                        data[index]["shipAgencyName"] =
                          itemRes["shipAgencyNameVN"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmChanelCodeList.length) {
          let codeArr = dmChanelCodeList
            .map((item) => {
              data[item["index"]]["chanelCodeListName"] = [];
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_TUYEN_LUONG",
                code: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemChanelCodeList, index) => {
                      if (itemChanelCodeList["chanelCodeList"]) {
                        let chanelCodeListTmp =
                          itemChanelCodeList["chanelCodeList"].split(",");
                        for (var i = 0; i < chanelCodeListTmp.length; i++) {
                          if (itemRes["code"] === chanelCodeListTmp[i]) {
                            data[index]["chanelCodeListName"].push(
                              itemRes["name"]
                            );
                          }
                        }
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmNoticeShipType.length) {
          vm.itemsSup["noticeShipTypeItems"].forEach((itemRes) => {
            data.forEach((itemNoticeShipType, index) => {
              if (
                itemRes["itemValue"] ===
                itemNoticeShipType["noticeShipType"].toString()
              ) {
                data[index]["noticeShipTypeName"] = itemRes["itemText"];
              }
            });
          });
        }
        // if (dmCargoCategory.length) {
        //   let codeArr = dmCargoCategory.map(item => {
        //     return item.code
        //   }).join(',')
        //   actions.push(vm.getDmItem_2Name({
        //     dataGroupId: '119',
        //     code: codeArr
        //   }).then(result => {
        //     if (result && !result.hasOwnProperty('errorCode')) {
        //       result.forEach(itemRes => {
        //         data.forEach((itemCargoCategory, index) => {
        //           if (itemRes['code'] === itemCargoCategory['cargoCategory']) {
        //             data[index]['cargoCategoryName'] = itemRes['name']
        //           }
        //         })
        //       })
        //     }
        //   }))
        // }
        if (dmCargo.length) {
          let codeArr = dmCargo
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_DATAITEM_GROUP124",
                code: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemCargo, index) => {
                      if (itemRes["code0"] === itemCargo["cargoCode"]) {
                        data[index]["cargoName"] = itemRes["name"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShipOperator.length) {
          let codeArr = dmShipOperator
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_VMA_SHIP_OWNER",
                isShipOperator: 1,
                code: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemShipOperator, index) => {
                      if (
                        itemRes["shipOwnerCode"] ===
                        itemShipOperator["shipOperatorCode"]
                      ) {
                        data[index]["shipOperatorName"] =
                          itemRes["companyName"];
                      }
                    });
                  });
                }
              })
          );
        }
        if (dmShipOwner.length) {
          let codeArr = dmShipOwner
            .map((item) => {
              return item.code;
            })
            .join(",");
          actions.push(
            vm
              .getDmItemName({
                categoryId: "DM_VMA_SHIP_OWNER",
                isShipOwner: 1,
                code: codeArr,
              })
              .then((result) => {
                if (result && !result.hasOwnProperty("errorCode")) {
                  result.forEach((itemRes) => {
                    data.forEach((itemShipOwner, index) => {
                      if (
                        itemRes["shipOwnerCode"] ===
                        itemShipOwner["shipOwnerCode"]
                      ) {
                        data[index]["shipOwnerName"] = itemRes["companyName"];
                      }
                    });
                  });
                }
              })
          );
        }
        vm.loadingTableAlll = true;
        Promise.all(actions)
          .then((results) => {
            vm.loadingTableAlll = false;
            for (var i = 0; i < data.length; i++) {
              if (
                data[i].hasOwnProperty("chanelCodeList") &&
                data[i].chanelCodeList
              ) {
                if (typeof data[i].chanelCodeList === "string") {
                  data[i]["chanelCodeList"] =
                    data[i]["chanelCodeList"].split(",");
                }
              } else if (
                data[i].hasOwnProperty("chanelCodeList") &&
                !data[i].chanelCodeList
              ) {
                data[i]["chanelCodeList"] = [];
              }
            }
            console.log("data+++++++++", data);
            resolve(data);
          })
          .catch((xhr) => {
            console.log("data______table____error=======>>>>>>>", xhr);
            reject(xhr);
          });
      });
    },
    capNhatTauRoiCang() {
      var vm = this;
      var cf = confirm("Bạn có muốn thực hiện hành động này?");
      if (cf) {
        return new Promise((resolve, reject) => {
          vm.$store
            .dispatch("updateShipPosition", {
              itineraryNo: vm.itineraryNo["itineraryNo"],
              shipPosition: 3,
            })
            .then((result) => {
              toastr.success("Cập nhật thành công!");
              resolve(result);
            })
            .catch((xhr) => {
              toastr.error("Cập nhật thất bại, vui lòng thử lại!");
              reject(xhr);
            });
        });
      }
    },
    autoFillCargolist: function () {
      var vm = this;
      let param = {
        itineraryNo: vm.itineraryNo["itineraryNo"],
      };
      vm.loadingTableAlll = true;
      return new Promise((resolve, reject) => {
        var cf = confirm(
          "Hành động này sẽ xóa hết dữ liệu cũ, bạn chắc chắn muốn thực hiện"
        );
        if (cf) {
          vm.$store
            .dispatch("autoFillCargolist", param)
            .then(function (result) {
              console.log("Auto fill +++++++++++", result);
              if (result && !result.hasOwnProperty("errorCode")) {
                if (result["data"]) {
                  vm.itemsDsTauAll = result["data"];
                } else {
                  vm.itemsDsTauAll = [];
                }
                vm.totalDsAll = result["total"];
              } else {
                vm.itemsDsTauAll = [];
                vm.totalDsAll = 0;
              }
              // vm.changeUrlGetList().then(function (result) {
              //   param['url'] = vm.urlDanhSach
              //   if (vm.code === 'DanhSachTauDichVu') {
              //     delete param['url']
              //     vm.loadDataTableDichVu(param)
              //   } else if (vm.code === 'DanhSachDetailChuyenTuyen' || vm.code === 'DanhSachDetailTauDichVu') {
              //     vm.loadDataTableDetailCT_DV(param)
              //   } else {
              //     vm.loadDataTable(param)
              //   }
              // })
              vm.loadingTableAlll = false;
              resolve(result);
            })
            .catch(function (xhr) {
              console.log(xhr);
              vm.loadingTableAlll = false;
              reject(xhr);
            });
        }
      });
    },
    traLaiHoSo() {
      let vm = this;
      let cf = confirm("Bạn có muốn thực hiện hành động này");
      if (cf) {
        let tmp = vm.selectAllValue.slice();
        tmp = tmp.map((item) => {
          if (
            vm.code === "DanhSachTauDenCang" ||
            vm.code === "DanhSachTauRoiCang"
          ) {
            item["keyId"] = "vma_itinerary_schedule";
          } else if (vm.code === "DanhSachTauDiChuyen") {
            item["keyId"] = "vma_itinerary_shifting";
          } else if (
            vm.code === "DanhSachPTTNDDenCang" ||
            vm.code === "DanhSachPTTNDRoiCang"
          ) {
            item["keyId"] = "vma_itinerary_schedule";
          } else if (vm.code === "DanhSachThuTau") {
            item["keyId"] = "vma_itinerary_testing";
          } else if (vm.code === "DanhSachHaXuong") {
            item["keyId"] = "vma_itinerary_launching";
          } else if (vm.code === "DanhSachSuaChuaTau") {
            item["keyId"] = "vma_itinerary_shipyard";
          } else if (vm.code === "DanhSachDuTau") {
            item["keyId"] = "vma_itinerary_security";
          }
          return item;
        });
        let data = {
          value: JSON.stringify(tmp),
        };
        vm.$store
          .dispatch("lanhDaoTraLai", data)
          .then((result) => {
            if (result && result["errorCode"]) {
              toastr.error("Xử lý thất bại, vui lòng thử lại!");
            } else {
              toastr.success("Ký số thành công!");
              vm.selectAllValue = [];
            }
          })
          .catch((xhr) => {
            toastr.error("Xử lý thất bại, vui lòng thử lại!");
          });
      }
    },
    kySoHSM() {
      let vm = this;
      let cf = confirm("Bạn có muốn thực hiện hành động này");
      if (cf) {
        let tmp = vm.selectAllValue.slice();
        tmp = tmp.map((item) => {
          if (
            vm.code === "DanhSachTauDenCang" ||
            vm.code === "DanhSachTauRoiCang"
          ) {
            item["keyId"] = "vma_itinerary_schedule";
          } else if (vm.code === "DanhSachTauDiChuyen") {
            item["keyId"] = "vma_itinerary_shifting";
          } else if (
            vm.code === "DanhSachPTTNDDenCang" ||
            vm.code === "DanhSachPTTNDRoiCang"
          ) {
            item["keyId"] = "vma_itinerary_schedule";
          } else if (vm.code === "DanhSachThuTau") {
            item["keyId"] = "vma_itinerary_testing";
          } else if (vm.code === "DanhSachHaXuong") {
            item["keyId"] = "vma_itinerary_launching";
          } else if (vm.code === "DanhSachSuaChuaTau") {
            item["keyId"] = "vma_itinerary_shipyard";
          } else if (vm.code === "DanhSachDuTau") {
            item["keyId"] = "vma_itinerary_security";
          }
          return item;
        });
        let data = {
          value: JSON.stringify(tmp),
        };
        vm.$store
          .dispatch("lanhDaoKySoHSM", data)
          .then((result) => {
            if (result && result["errorCode"]) {
              toastr.error("Xử lý thất bại, vui lòng thử lại!");
            } else {
              toastr.success("Ký số thành công!");
              vm.selectAllValue = [];
            }
          })
          .catch((xhr) => {
            toastr.error("Xử lý thất bại, vui lòng thử lại!");
          });
      }
    },
    getDmItemName: function (data) {
      var vm = this;
      if (!data) {
        console.log("valid data param!!!!!!!");
        return;
      }
      let param = {};
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      return new Promise((resolve, reject) => {
        vm.$store
          .dispatch("loadDataDm", param)
          .then(function (result) {
            resolve(result);
          })
          .catch(function (xhr) {
            console.log(xhr);
            reject(xhr);
          });
      });
    },
    getDmItem_2Name: function (data) {
      var vm = this;
      if (!data) {
        console.log("valid data param!!!!!!!");
        return;
      }
      let param = {};
      if (data) {
        for (var key in data) {
          param[key] = data[key];
        }
      }
      return new Promise((resolve, reject) => {
        vm.$store
          .dispatch("loadDataItems", param)
          .then(function (result) {
            resolve(result);
          })
          .catch(function (xhr) {
            console.log(xhr);
            reject(xhr);
          });
      });
    },
    xacNhanThongBaoPhiTauDichVu() {
      let vm = this;
      let query = vm.$router.history.current.query;
      if (!vm.fromDate) {
        toastr.error("Bạn chưa chọn thời gian bắt đầu!");
        return;
      } else if (!vm.toDate) {
        toastr.error("Bạn chưa chọn thời gian kết thúc!");
        return;
      }
      if (!query["tugboatCode"]) {
        toastr.error("Không tìm thấy tàu!");
      }
      let cf = confirm("Bạn có muốn thực hiện hành động này!");
      if (cf) {
        vm.$store
          .dispatch("xacBaoTinhPhiTauDichVu", {
            tugboatCode: query["tugboatCode"] || "",
            itineraryNo: "KEYTAUDICHVU",
            fromDate: vm.fromDate,
            toDate: vm.toDate,
            description: vm.description,
          })
          .then(function (result) {
            if (result && !result["errorCode"]) {
              query["urlDanhSach"] = vm.urlDanhSach;
              vm.loadDataTableDetailCT_DV(query);
              toastr.success("Thực hiện thành công!");
            } else {
              toastr.error("Thực hiện thất bại, vui lòng thử lại");
            }
            vm.stateXacBaoPhi = false;
          })
          .catch((xhr) => {
            toastr.error("Thực hiện thất bại, vui lòng thử lại");
            vm.stateXacBaoPhi = false;
          });
      }
    },
    xacNhanThongBaoPhiTauChuyenTuyen() {
      let vm = this;
      let query = vm.$router.history.current.query;
      if (!vm.fromDate) {
        toastr.error("Bạn chưa chọn thời gian bắt đầu!");
        return;
      } else if (!vm.toDate) {
        toastr.error("Bạn chưa chọn thời gian kết thúc!");
        return;
      }
      let cf = confirm("Bạn có muốn thực hiện hành động này!");
      if (cf) {
        vm.$store
          .dispatch("xacBaoTinhPhiTauChuyenTuyen", {
            itineraryNo: "KEYTAUKHACH",
            imo: query["imo"] || "",
            callSign: query["callSign"] || "",
            registryNumber: query["registryNumber"] || "",
            nameOfShip: query["nameOfShip"] || "",
            fromDate: vm.fromDate,
            toDate: vm.toDate,
            description: vm.description,
          })
          .then(function (result) {
            if (result && !result["errorCode"]) {
              query["urlDanhSach"] = vm.urlDanhSach;
              vm.loadDataTableDetailCT_DV(query);
              toastr.success("Thực hiện thành công!");
            } else {
              toastr.error("Thực hiện thất bại, vui lòng thử lại");
            }
            vm.stateXacBaoPhi = false;
          })
          .catch((xhr) => {
            toastr.error("Thực hiện thất bại, vui lòng thử lại");
            vm.stateXacBaoPhi = false;
          });
      }
    },
    toDetailTauBien(item) {
      var vm = this;
      var id = 0;
      if (vm.code === "DanhSachTau") {
        return;
      }
      if (
        vm.code === "DanhSachTauDenCang" ||
        vm.code === "DanhSachTauRoiCang" ||
        vm.code === "DanhSachPTTNDDenCang" ||
        vm.code === "DanhSachPTTNDRoiCang" ||
        vm.code === "DanhSach<200DWTVao" ||
        vm.code === "DanhSach<200DWTRoi"
      ) {
        id = item["vmaItineraryScheduleId"];
        vm.$store.commit("setPttnd", true);
      } else if (vm.code === "DanhSachTauLaiHoTro") {
        id = item["vmaScheduleTugboatId"];
      } else if (vm.code === "DanhSachHoaTieuDanTau") {
        id = item["vmaSchedulePilotId"];
      } else if (vm.code === "DanhSachSuaChuaTau") {
        id = item["vmaScheduleShipyardId"];
      } else if (vm.code === "DanhSachNhapTachDoan") {
        id = item["vmaScheduleMergingId"];
      } else if (vm.code === "DanhSachHaXuong") {
        id = item["vmaScheduleLaunchingId"];
      } else if (vm.code === "DanhSachThuTau") {
        id = item["vmaScheduleTestingId"];
      } else if (vm.code === "DanhSachDuTau") {
        id = item["vmaScheduleSecurityId"];
      } else if (vm.code === "DanhSachGhiChuCanhBao") {
        id = item["vmaItineraryRemarksId"];
      } else if (
        vm.code === "DanhSachTauBien" ||
        vm.code === "DanhSachPhuongTienThuyNoiDia" ||
        vm.code === "DanhSachTauThanhThai" ||
        vm.code === "DanhSachXacNhanAnToanAnNinh"
      ) {
        id = item["vmaShipId"];
      } else if (vm.code === "DanhSachXepDoHang") {
        console.log("Danh sach xep do hang");
        id = item["vmaScheduleCargolistId"];
      } else if (vm.code === "DanhSachTauDiChuyen") {
        id = item["vmaScheduleShiftingId"];
      } else if (vm.code === "DanhSachThuTau") {
        id = item["vmaScheduleTestingId"];
      } else if (vm.code === "DanhSachNeoTau") {
        id = item["vmaScheduleAnchorageId"];
      } else if (vm.code === "DanhSachViTriNeoDauTaiCang") {
        id = item["vmaScheduleAnchorageId"];
      } else if (vm.code === "DanhSachKhangNghiHangHai") {
        id = item["vmaItineraryProtestId"];
      } else if (vm.code === "DanhSachKeHoachChuyenTuyen") {
        id = item["vmaScheduleXlineSailingId"];
      }
      console.log("id-----tau+++++++++++++++", id);
      let code = vm.code;
      if (
        code === "DanhSachTauThanhThai" ||
        code === "DanhSachXacNhanAnToanAnNinh"
      ) {
        if (item["shipBoat"] === "SHIP") {
          code = "DanhSachTauBien";
        } else {
          code = "DanhSachPhuongTienThuyNoiDia";
        }
      }
      if (vm.type === "lanh_dao") {
        vm.$router.push({
          path:
            "/tau-moi/" +
            vm.type +
            "/" +
            0 +
            "/" +
            0 +
            "/" +
            id +
            "/" +
            code +
            "/detail",
          query: {
            itineraryNo: item["itineraryNo"] || "",
          },
        });
        return;
      }
      if (
        vm.code === "DanhSachKeHoachChuyenTuyen" ||
        vm.code === "DanhSachTauDichVu"
      ) {
        code =
          vm.code === "DanhSachKeHoachChuyenTuyen"
            ? "DanhSachDetailChuyenTuyen"
            : "DanhSachDetailTauDichVu";
        let path = "";
        let query = {};
        if (vm.documentName && vm.documentName !== "0") {
          path =
            "/ho-so-phuong-tien/" +
            vm.type +
            "/" +
            vm.documentName +
            "/" +
            vm.documentYear +
            "/" +
            vm.documentTypeCode +
            "/" +
            vm.documentStatusCode +
            "/" +
            code;
          if (vm.code === "DanhSachKeHoachChuyenTuyen") {
            query = {
              imo: item["imoNumber"],
              callSign: item["callSign"],
              registryNumber: item["registryNumber"],
              nameOfShip: item["nameOfShip"],
            };
          } else if (vm.code === "DanhSachTauDichVu") {
            query = {
              tugboatCode: item["shipCode"],
              nameOfShip: item["nameOfShip"],
            };
          }
        } else {
          path = vm.$router.history.current.path;
          if (vm.code === "DanhSachKeHoachChuyenTuyen") {
            if (path.indexOf("quan-ly-tau-bien") !== -1) {
              path = "/quan-ly-tau-bien/" + vm.type + "/0/0/" + code;
            } else {
              path =
                "/tau-bien/" +
                vm.type +
                "/" +
                vm.documentTypeCode +
                "/" +
                vm.documentStatusCode +
                "/" +
                id +
                "/" +
                code +
                "/table";
            }
            query = {
              imo: item["imoNumber"],
              callSign: item["callSign"],
              registryNumber: item["registryNumber"],
              nameOfShip: item["nameOfShip"],
            };
          } else if (vm.code === "DanhSachTauDichVu") {
            if (path.indexOf("quan-ly-tau-bien") !== -1) {
              path = "/quan-ly-tau-bien/" + vm.type + "/0/0/" + code;
            } else {
              path =
                "/tau-bien/" +
                vm.type +
                "/" +
                vm.documentTypeCode +
                "/" +
                vm.documentStatusCode +
                "/" +
                id +
                "/" +
                code +
                "/table";
            }
            query = {
              tugboatCode: item["shipCode"],
              nameOfShip: item["shipName"],
            };
          }
        }
        vm.$router.push({
          path: path,
          query: {
            ...query,
          },
        });
      } else {
        if (vm.documentName && vm.documentName !== "0") {
          vm.$router.push({
            path:
              "/ho-so-phuong-tien/" +
              vm.type +
              "/" +
              vm.documentName +
              "/" +
              vm.documentYear +
              "/" +
              vm.documentTypeCode +
              "/" +
              vm.documentStatusCode +
              "/" +
              code +
              "/" +
              id,
          });
        } else {
          if (
            vm.code === "DanhSach<200DWTVao" ||
            vm.code === "DanhSach<200DWTRoi"
          ) {
            vm.$router.push({
              path:
                "/tau-moi/" +
                vm.type +
                "/" +
                vm.documentTypeCode +
                "/" +
                vm.documentStatusCode +
                "/" +
                id +
                "/" +
                code +
                "/detail",
              query: {
                itineraryNo: item["itineraryNo"] || "",
                isTau200DWT: true,
              },
            });
          } else {
            vm.$router.push({
              path:
                "/tau-bien/" +
                vm.type +
                "/" +
                vm.documentTypeCode +
                "/" +
                vm.documentStatusCode +
                "/" +
                id +
                "/" +
                code +
                "/detail",
              query: {
                itineraryNo: item["itineraryNo"] || "",
              },
            });
          }
        }
      }
    },
    clearDate() {
      var vm = this;
      console.log("clear");
      vm.searchAdvTable();
    },
    keyupEnter() {
      var vm = this;
      vm.searchAdvTable();
    },
    refreshSearch() {
      var vm = this;
      for (var key in vm.adv) {
        vm.adv[key] = "";
      }
      vm.searchAdvTable();
    },
    changeStatusTextTableByCode() {
      var vm = this;
      var statusText = "";
      let query = vm.$router.history.current.query;
      switch (vm.code) {
        case "DanhSachTau": {
          statusText = "Quản lý chuyến tàu";
          break;
        }
        case "DanhSachTauThanhThai": {
          statusText = "Danh sách tàu thanh thải";
          break;
        }
        case "DanhSachXacNhanAnToanAnNinh": {
          statusText = "DS xác nhận an toàn an ninh hàng hải";
          break;
        }
        case "DanhSachTauBien": {
          statusText = "Danh sách tàu biển";
          break;
        }
        case "DanhSachPhuongTienThuyNoiDia": {
          statusText = "Danh sách PTTNĐ";
          break;
        }
        case "DanhSachTauRoiCang": {
          statusText = "Kế hoạch tàu rời cảng";
          break;
        }
        case "DanhSachTauDenCang": {
          statusText = "Kế hoạch tàu đến cảng";
          break;
        }
        case "DanhSachPTTNDDenCang": {
          statusText = "PTTNĐ vào cảng";
          break;
        }
        case "DanhSachPTTNDRoiCang": {
          statusText = "PTTNĐ rời cảng";
          break;
        }
        case "DanhSach<200DWTVao": {
          statusText = "Tàu thuyền < 200 DWT nhập cảnh";
          break;
        }
        case "DanhSach<200DWTRoi": {
          statusText = "Tàu thuyền < 200 DWT xuất cảnh";
          break;
        }
        case "DanhSachTauDiChuyen": {
          statusText = "Kế hoạch tàu dịch chuyển";
          break;
        }
        case "DanhSachNeoTau": {
          statusText = "Danh sách tàu neo đậu";
          break;
        }
        case "DanhSachTauLaiHoTro": {
          statusText = "Tàu lai hỗ trợ";
          break;
        }
        case "DanhSachHoaTieuDanTau": {
          statusText = "Hoa tiêu dẫn tàu";
          break;
        }
        case "DanhSachXepDoHang": {
          statusText = "Hàng hóa xếp, dỡ";
          break;
        }
        case "DanhSachNhapTachDoan": {
          statusText = "Danh sách nhập tách đoàn";
          break;
        }
        case "DanhSachSuaChuaTau": {
          statusText = "Sửa chữa tàu";
          break;
        }
        case "DanhSachHaXuong": {
          statusText = "Danh sách hạ xuồng";
          break;
        }
        case "DanhSachThuTau": {
          statusText = "Danh sách thử tàu";
          break;
        }
        case "DanhSachDuTau": {
          statusText = "Danh sách giữ tàu";
          break;
        }
        case "DanhSachGhiChuCanhBao": {
          statusText = "Danh sách ghi chú cảnh báo";
          break;
        }
        case "DanhSachKhangNghiHangHai": {
          statusText = "Danh sách kháng nghị hàng hải";
          break;
        }
        case "DanhSachGiayToTau": {
          statusText = "Danh sách giấy tờ tàu";
          break;
        }
        case "DanhSachViTriNeoDauTaiCang": {
          statusText = "Vị trí neo đậu tại cảng";
          break;
        }
        case "DanhSachTauDichVu": {
          statusText = "Danh sách tàu dịch vụ";
          break;
        }
        case "DanhSachDetailChuyenTuyen": {
          statusText =
            "Chi tiết các lần thông báo phí - " + query["nameOfShip"];
          break;
        }
        case "DanhSachDetailTauDichVu": {
          statusText =
            "Chi tiết các lần thông báo phí - " + query["nameOfShip"];
          break;
        }
        default: {
          statusText = "Kế hoạch chuyên tuyến";
          break;
        }
      }
      vm.status_label = statusText;
    },
    xacBaoTinhPhiTauBien_PTTND() {
      let vm = this;
      console.log("checkStateVaoRoi==========", vm.checkStateVaoRoi);
      vm.$store
        .dispatch("xacBaoTinhPhiTauBien_PTTND", {
          itineraryNo: vm.itineraryNo["itineraryNo"],
          documentName: vm.documentName,
          documentYear: vm.documentYear,
          remarks: vm.description,
          noticeShipType: vm.checkStateVaoRoi || "",
        })
        .then(function (result) {
          if (result && result["errorCode"]) {
            toastr.error("Thực hiện thất bại, vui lòng thử lại!");
          } else {
            toastr.success("Thực hiện thành công!");
          }
          vm.canhBaoTinhPhi();
        })
        .catch((xhr) => {
          toastr.error("Thực hiện thất bại, vui lòng thử lại!");
        });
    },
    xemGiayBaoTinhPhi() {
      let vm = this;
      console.log("checkStateVaoRoi==========", vm.checkStateVaoRoi);
      vm.stateViewPhieuThu = !vm.stateViewPhieuThu;
      vm.loadingPhieuThu = true;
      vm.$store
        .dispatch("xemGiayBaoTinhPhi", {
          itineraryNo: vm.itineraryNo["itineraryNo"],
          noticeShipType: vm.checkStateVaoRoi,
          remarks: vm.description || "",
        })
        .then(function (result) {
          vm.urlDownload = result || "";
          vm.loadingPhieuThu = false;
        })
        .catch((xhr) => {
          vm.loadingPhieuThu = false;
        });
    },
    xemGiayBaoTinhPhi2() {
      let vm = this;
      console.log("checkStateVaoRoi==========", vm.checkStateVaoRoi);
      let query = vm.$router.history.current.query;
      if (!vm.fromDate) {
        toastr.error("Bạn chưa chọn thời gian bắt đầu!");
        return;
      } else if (!vm.toDate) {
        toastr.error("Bạn chưa chọn thời gian kết thúc!");
        return;
      }
      if (!query["tugboatCode"]) {
        toastr.error("Không tìm thấy tàu!");
      }
      vm.txtThongBaoPhi = "Xem bảng kê";
      vm.dialogViewThongBaoPhi = true;
      vm.loadingPhieuThu = true;
      let action = "xemBangKeTauDichVu";
      if (vm.code === "DanhSachDetailTauDichVu") {
        action = "xemBangKeTauDichVu";
      } else if (vm.code === "DanhSachDetailChuyenTuyen") {
        action = "xemBangChuyenTuyen";
      }
      vm.$store
        .dispatch(action, {
          tugboatCode: query["tugboatCode"],
          fromDate: vm.fromDate,
          toDate: vm.toDate,
          xemBK_Thutuc: 0,
        })
        .then(function (result) {
          vm.urlViewThongBaoPhi = result;
          vm.loadingPhieuThu = false;
        })
        .catch((xhr) => {
          toastr.error("Không thể hiển thị, vui lòng thử lại");
          vm.urlViewThongBaoPhi = "";
          vm.loadingPhieuThu = false;
        });
    },
    xuatFile() {
      var vm = this;
      var urlExport = "";
      vm.loadingExport = true;
      vm.loadingInitData
        .then(function (result) {
          switch (vm.code) {
            case "DanhSachTau": {
              urlExport = result["exportVmaItineraryURL"];
              break;
            }
            case "DanhSachViTriNeoDauTaiCang": {
              urlExport = result["exportVmaScheduleAnchorage_Port_URL"];
              break;
            }
            case "DanhSachXacNhanAnToanAnNinh": {
              urlExport = result["exportVmaShip_Ship_URL"];
              break;
            }
            case "DanhSachTauThanhThai": {
              urlExport = result["exportVmaShip_Ship_URL"];
              break;
            }
            case "DanhSachTauBien": {
              urlExport = result["exportVmaShip_Ship_URL"];
              break;
            }
            case "DanhSachPhuongTienThuyNoiDia": {
              urlExport = result["exportVmaShip_Boat_URL"];
              break;
            }
            case "DanhSachTauRoiCang": {
              urlExport = result["exportVmaItinerarySchedule_Leave_URL"];
              break;
            }
            case "DanhSachTauDenCang": {
              urlExport = result["exportVmaItinerarySchedule_Come_URL"];
              break;
            }
            case "DanhSachPTTNDRoiCang": {
              urlExport = result["exportVmaItinerarySchedule_Leave_URL"];
              break;
            }
            case "DanhSachPTTNDDenCang": {
              urlExport = result["exportVmaItinerarySchedule_Come_URL"];
              break;
            }
            case "DanhSachTauDiChuyen": {
              urlExport = result["exportVmaScheduleShiftingURL"];
              break;
            }
            case "DanhSachNeoTau": {
              urlExport = result["exportVmaScheduleAnchorage_Ship_URL"];
              break;
            }
            case "DanhSachTauLaiHoTro": {
              urlExport = result["exportVmaScheduleTugboatURL"];
              break;
            }
            case "DanhSachHoaTieuDanTau": {
              urlExport = result["exportVmaSchedulePilotURL"];
              break;
            }
            case "DanhSachXepDoHang": {
              urlExport = result["exportVmaScheduleCargolistURL"];
              break;
            }
            case "DanhSachNhapTachDoan": {
              urlExport = result["exportVmaScheduleMergingURL"];
              break;
            }
            case "DanhSachSuaChuaTau": {
              urlExport = result["exportVmaScheduleShipyardURL"];
              break;
            }
            case "DanhSachHaXuong": {
              urlExport = result["exportVmaScheduleLaunchingURL"];
              break;
            }
            case "DanhSachThuTau": {
              urlExport = result["exportVmaScheduleTestingURL"];
              break;
            }
            case "DanhSachDuTau": {
              urlExport = result["exportVmaScheduleSecurityURL"];
              break;
            }
            case "DanhSachGhiChuCanhBao": {
              urlExport = result["exportVmaItineraryRemarksURL"];
              break;
            }
            case "DanhSachKhangNghiHangHai": {
              urlExport = result["exportVmaItineraryProtestURL"];
              break;
            }
            case "DanhSachGiayToTau": {
              urlExport = result["exportVmaCertificateURL"];
              break;
            }
            default: {
              urlExport = result["exportVmaScheduleXlineSailingURL"];
            }
          }
          var param = {};
          if (vm.code === "DanhSachTauThanhThai") {
            param["shipBoat"] = "";
            param["deconstructed"] = 1;
          }
          if (vm.code === "DanhSachXacNhanAnToanAnNinh") {
            param["shipBoat"] = "";
            param["violated"] = 1;
          }
          if (vm.code === "DanhSachTauBien") {
            param["shipBoat"] = "SHIP";
          }
          if (vm.code === "DanhSachPhuongTienThuyNoiDia") {
            param["shipBoat"] = "BOAT";
          }
          if (vm.code === "DanhSachTauDenCang") {
            param["shipBoat"] = "SHIP";
            param["noticeShipType"] = 1;
          }
          if (vm.code === "DanhSachTauRoiCang") {
            param["shipBoat"] = "SHIP";
            param["noticeShipType"] = 2;
          }
          if (vm.code === "DanhSachTauDiChuyen") {
            param["noticeShipType"] = 4;
          }
          if (vm.code === "DanhSachThuTau") {
            param["noticeShipType"] = 5;
          }
          if (vm.documentName && vm.documentName !== "0") {
            param["itineraryNo"] = vm.itineraryNo["itineraryNo"];
          }
          if (vm.code === "DanhSachTauLaiHoTro" && !param["noticeShipType"]) {
            param["noticeShipType"] = 1;
          }
          if (vm.documentName && vm.documentYear) {
            param["documentName"] = vm.documentName;
            param["documentYear"] = vm.documentYear;
          }
          param["maritimeCode"] = vm.maritimeCode;
          param["url"] = urlExport;
          let query = vm.$router.history.current.query;
          for (var key in query) {
            if (key !== "page") {
              param[key] = query[key];
            }
          }
          vm.$store
            .dispatch("exportDanhSachTauBien", param)
            .then(function (result) {
              if (result) {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = result["url"];
                a.download = result["fileName"];
                a.click();
                window.URL.revokeObjectURL(result["url"]);
                a.remove();
              } else {
                toastr.error("Export thất bại, vui lòng thử lại!");
              }
              vm.loadingExport = false;
            });
        })
        .catch(function (xhr) {
          vm.loadingExport = false;
        });
    },
  },
  filters: {},
};
</script>
<style>
/*@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css'*/
@import "../../../node_modules/@syncfusion/ej2-vue-grids/styles/material.css";
</style>
