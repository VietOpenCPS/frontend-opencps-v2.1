<template>
  <div style="width: 100%; background: #fff; position: relative;" class="extFormXuLy">
    <v-flex xs12 style="background: #e6e1e1;">
      <v-layout row wrap >

        <div class="row-header" style="height: 38px;overflow: hidden;">
          <div class="background-triangle-big view_tp_pdf"> Kế hoạch tàu thuyền rời cảng </div>
          <div class="layout row wrap header_tools row-blue">

            <div class="flex solo text-ellipsis" v-if="documentName && documentName !== '0'">
              <span @click="showWarning = !showWarning" slot="activator" style="cursor: pointer; color: orange;" v-if="warningTauRoi['show']" color="warning">(Cảnh báo)
              </span>
              <span class="font-regulal">
                <!-- <v-menu
                  :close-on-content-click="false"
                  :nudge-width="200"
                  v-model="showWarning"
                  offset-x
                  >
                  <span slot="activator" style="cursor: pointer; color: orange;" v-if="warningTauRoi['show']" color="warning">(Cảnh báo)
                  </span>
                  <v-card>
                    <v-card-title class="pt-0 py-0 px-0 adv__search__container">
                      <div v-html="item" v-for="(item, index) in warningTauRoi['message']"></div>
                    </v-card-title>
                  </v-card>
                </v-menu> -->

                {{detailHs['shipName']}}
                </span> | <span class="red--text text--darken-3">#</span>
                <span class="font-regulal" style="font-weight: bold; color: rgb(35, 114, 187);">{{detailHs['documentName']}} </span>| <span class="font-regulal">{{detailHs.callSign}}</span> &nbsp;
              <span style="color: rgb(35, 114, 187);">{{supportData.docType[documentTypeCode]}}</span>
            </div>
            <div class="flex text-right" style="margin-left: auto;" v-if="!documentName || documentName === '0'">
              <span class="font-regulal" style="font-weight: bold;color: #2372bb;">  </span>
              <v-btn
                :disabled="loadingDetail"
                v-if="!itineraryNo || !itineraryNo['markedAsDeparture'] || itineraryNo['markedAsDeparture'] === '0' || itineraryNo['markedAsDeparture'] === 1 || itineraryNo['markedAsDeparture'] === '1'"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="addTauRoiCang()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="17">save</v-icon>Lưu lại
              </v-btn>


              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 9"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="17">file_copy</v-icon>Thêm mới
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 2"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauRoiCangMarkedAsDeparture(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Lưu
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 2"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauRoiCangMarkedAsDeparture(8)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Xác nhận
              </v-btn>

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="taoGiayPhepRoiCang()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Tạo giấy phép rời cảng
              </v-btn> -->

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(5)"
              >
                <span slot="loader">Loading...</span>
                Sửa
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(2)"
              >
                <span slot="loader">Loading...</span>
                Gỡ bỏ
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5 && type === 'lanh_dao'"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="kySoHSM()"
              >
                <span slot="loader">Loading...</span>
                Ký số HSM
              </v-btn>

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xemThongBaoThuPhi()"
              >
                <span slot="loader">Loading...</span>
                Xem phiếu thông báo thu phí chuyển tài vụ
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="chuyenTaiVuTinhPhi()"
                >
                Chuyển tài vụ tính phí
              </v-btn> -->

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 3"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Đã chuyển lãnh đạo, chờ ký
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 4"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Đã chuyển văn thư, chờ đóng dấu
              </v-btn>

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Đã chuyển thủ tục
              </v-btn> -->

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 6"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Hủy giấy phép rời cảng
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 7"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Lãnh đạo trả lại
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 7"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauRoiCangMarkedAsDeparture(8)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Xác nhận
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === 8"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="chuyenlanhDaoKySo()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Chuyển lãnh đạo ký số
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 7"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(7)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Sửa
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 8"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="capLai(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Cấp lại
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 9"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="capLai(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Cấp lại
              </v-btn>

              <v-btn
                :disabled="!id || id === '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="deleteTauRoiCang()"
                >
                <v-icon size="20" color="red">close</v-icon>Xóa
              </v-btn>

              <v-btn
                flat
                small
                class="mx-0 my-0 py-0 px-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xemKHDD()"
                >
                Xem KHĐĐ
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (itineraryNo['markedAsDeparture'] === '5' || itineraryNo['markedAsDeparture'] === 5 || itineraryNo['markedAsDeparture'] === '8' || itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === '9' || itineraryNo['markedAsDeparture'] === 9)"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="inGiayPhep(1)"
                >
                {{documentTypeCode === 'QC' ? 'In giấy phép QC' : 'In giấy phép RC'}}
              </v-btn>

              <v-btn
                v-if="id && id !== '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="inGiayPhep(0)"
                >
                Xem trước giấy phép
              </v-btn>

              <v-btn
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="quayLai()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="17">reply</v-icon>Quay lại
              </v-btn>
            </div>

            <div class="flex text-right" style="margin-left: auto;" v-else-if="itineraryNo['markedAsDeparture'] > 0">
              <span class="font-regulal" style="font-weight: bold;color: #2372bb;">  </span>
              <v-btn
                :disabled="loadingDetail"
                v-if="itineraryNo['markedAsDeparture'] === 1"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="addTauRoiCang()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="17">add</v-icon>Lưu lại
              </v-btn>


              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 9"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="17">file_copy</v-icon>Thêm mới
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 2"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauRoiCangMarkedAsDeparture(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Lưu
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 2"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauRoiCangMarkedAsDeparture(5)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Xác nhận
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5 || itineraryNo['markedAsDeparture'] === '5'"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="chuyenlanhDaoKySo()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Chuyển lãnh đạo ký số
              </v-btn>

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="taoGiayPhepRoiCang()"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Tạo giấy phép rời cảng
              </v-btn> -->

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(5)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Sửa
              </v-btn> -->

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Gỡ bỏ
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5 && type === 'lanh_dao'"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="kySoHSM()"
              >
                <span slot="loader">Loading...</span>
                Ký số HSM
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 3"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Đã chuyển lãnh đạo, chờ ký
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 4"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Đã chuyển văn thư, chờ đóng dấu
              </v-btn>

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 5"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Đã chuyển thủ tục
              </v-btn> -->

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 6"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Hủy giấy phép rời cảng
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 7"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal; pointer-events: none;"
              >
                Lãnh đạo trả lại
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 7"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauRoiCangMarkedAsDeparture(3)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Xác nhận
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 7"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(7)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Sửa
              </v-btn>

              <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === 9 || itineraryNo['markedAsDeparture'] === '8' || itineraryNo['markedAsDeparture'] === '9'"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Gỡ bỏ
              </v-btn>

              <!-- <v-btn
                v-if="itineraryNo['markedAsDeparture'] === 9"
                flat
                small
                :loading="loadingBtn"
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="suaTau(2)"
              >
                <span slot="loader">Loading...</span>
                <v-icon size="20">save</v-icon>Gỡ bỏ
              </v-btn> -->

              <v-btn
                :disabled="!id || id === '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="deleteTauRoiCang()"
                >
                <v-icon size="20" color="red">close</v-icon>Xóa
              </v-btn>

              <v-btn
                flat
                small
                class="mx-0 my-0 py-0 px-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xemKHDD()"
                >
                Xem KHĐĐ
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (itineraryNo['markedAsDeparture'] === '5' || itineraryNo['markedAsDeparture'] === 5 || itineraryNo['markedAsDeparture'] === '8' || itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === '9' || itineraryNo['markedAsDeparture'] === 9)"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="inGiayPhep(1)"
                >
                <v-icon size="20" color="red">print</v-icon>{{documentTypeCode === 'QC' ? 'In giấy phép QC' : 'In giấy phép RC'}}
              </v-btn>

              <v-btn
                v-if="id && id !== '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="inGiayPhep(0)"
                >
                Xem trước giấy phép
              </v-btn>

              <!-- đồng nai + cần thơ -->

            </div>
          </div>
        </div>

      </v-layout>
    </v-flex>
    <v-flex xs12 sm12 style="border-bottom: 1px solid #ccc; padding: 0 20px;">
      <v-slide-y-transition>
        <div v-if="showWarning">
          <div v-for="(item, index) in warningTauRoi['message']">
            - <label style="color: #FFBB3D">{{item}}</label>
          </div>
        </div>
      </v-slide-y-transition>
    </v-flex>
    <v-progress-linear v-if="loadingDetail" :indeterminate="true"></v-progress-linear>
    <v-form
      v-show="checkShowForm"
      ref="formTauRoiCang"
      :style="{'opacity': (loadingDetail || itineraryNo['markedAsDeparture'] === 5 || itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === 9 || itineraryNo['markedAsDeparture'] === '5' || itineraryNo['markedAsDeparture'] === '8' || itineraryNo['markedAsDeparture'] === '9') ? '0.6' : 1, 'pointer-events': (loadingDetail || itineraryNo['markedAsDeparture'] === 5 || itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === 9 || itineraryNo['markedAsDeparture'] === '5' || itineraryNo['markedAsDeparture'] === '8' || itineraryNo['markedAsDeparture'] === '9') ? 'none' : 'auto'}"
      :disabled="loadingDetail"
      v-model="validFormTauRoiCang"
      lazy-validation
      class="mt-2"
   >
      <v-flex xs12 d-flex>
        <v-layout row wrap>
          <v-flex xs4 class="pr-1">

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pl-2"><label>Thời gian rời:</label></v-flex>
              <v-flex xs7>
                <datetime-picker
                v-model="detailTauRoiCang['timeOfDeparture']"
                :first-day="1"
                :show-dst="false"
                :show-hours="true"
                :show-minutes="true"
                :show-seconds="false"
                class="mx-0 my-0"
                ></datetime-picker>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Đại lý rời:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field class="py-0 my-0" placeholder="Nhập đại lý đi"  v-model="detailTauRoiCang['departureShipAgency']"
                ></v-text-field>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap v-if="documentName && documentName !== '0'">
              <v-flex xs5 class="text-xs-left pl-2 background__blue__"><label>Đại lý rời:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field class="py-0 my-0" placeholder="Nhập đại lý đến"  v-model="detailTauRoiCang['departureShipAgency']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap v-else>
              <v-flex md5 class="pl-2">
                <label>Đại lý: <label v-if="documentName && documentName !== '0'" style="color: red;">*</label></label>
              </v-flex>
              <v-flex md7 style="display: flex;">
                <v-select
                :disabled="stateAddShipAgency"
                style="width: 95%;"
                clearable
                return-object
                autocomplete
                :items="shipAgencyItems"
                item-text="shipAgencyNameVN"
                item-value="shipAgencyCode"
                v-model="detailTauRoiCang['shipAgency']"
                class="py-0 my-0"
                placeholder="Chọn đại lý"
                ></v-select>

                <v-tooltip bottom>
                  <v-chip slot="activator" class="px-0 mt-0" label :color="!stateAddShipAgency ? 'primary' : 'blue-grey lighten-4'" text-color="white">
                    <v-icon color="white" style="cursor: pointer;" @click="stateAddShipAgency = !stateAddShipAgency">add</v-icon>
                  </v-chip>
                  <span>Thêm mới đại lý</span>
                </v-tooltip>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2" v-if="stateAddShipAgency">
                <label>Mã số thuế: <label style="color: red;">*</label></label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipAgency">
                <v-text-field
                v-model="shipAgency['shipAgencyCode']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập mã số thuế đại lý"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2" v-if="stateAddShipAgency">
                <label>Tên đại lý: <label style="color: red;">*</label></label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipAgency">
                <v-text-field
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                required
                v-model="shipAgency['shipAgencyNameVN']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập tên đại lý"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2" v-if="stateAddShipAgency">
                <label>Địa chỉ đại lý:</label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipAgency">
                <v-text-field
                v-model="shipAgency['addressVN']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập địa chỉ đại lý"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>SĐT đại lý:</label></v-flex>
              <v-flex xs7>
                <v-text-field class="py-0 my-0"  placeholder="Nhập sđt"  v-model="detailTauRoiCang['shipAgencyPhone']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2">
                <label>Chọn quốc gia đến:</label>
              </v-flex>
              <v-flex md7>
                <v-select
                clearable
                return-object
                autocomplete
                :items="flagStateOfShipItems"
                item-text="stateName"
                item-value="stateName"
                v-model="flagStateOfShipTmp"
                class="py-0 my-0"
                placeholder="Chọn quốc gia"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2" v-if="stateShowPortType">
                <label>Phân loại cảng:</label>
              </v-flex>
              <v-flex md7 v-if="stateShowPortType">
                <v-select
                @input="changePortType(detailTauRoiCang['portTypeTmp'])"
                clearable
                autocomplete
                :items="portTypeItems"
                item-text="name"
                item-value="code"
                v-model="detailTauRoiCang['portTypeTmp']"
                class="py-0 my-0"
                placeholder="Phân loại cảng"
                ></v-select>
              </v-flex>
            </v-layout>


            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Cảng đến kế tiếp:</label></v-flex>
              <v-flex xs7>
                <v-select
                clearable
                autocomplete
                :items="dmPortItems"
                item-text="portName"
                item-value="portCode"
                v-model="detailTauRoiCang['portGoingToCode']"
                class="py-0 my-0"
                placeholder="Chọn cảng kế tiếp"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="text-xs-left pl-2" v-if="stateShowLastProvince">
                <label>Tên cảng đến kế tiếp:</label>
              </v-flex>
              <v-flex md7 v-if="stateShowLastProvince">
                <v-text-field
                v-model="detailTauRoiCang['nextProvinceCode']"
                class="py-0 my-0"
                clearable
                placeholder="Nhập tên cảng đến kế tiếp"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Tên quốc gia:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field clearable class="py-0 my-0" placeholder="Nhập tên quốc gia" v-model="detailTauRoiCang['portGoingToStateName']"
                ></v-text-field>
              </v-flex>
            </v-layout> -->


            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2 background__blue__"><label>Đến hành trình:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field  class="py-0 my-0" placeholder="Nhập đến hành trình" v-model="detailTauRoiCang['initFrom']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2 background__blue__"><label>Khu vực hàng hải (<label style="color: red;">*</label>):</label></v-flex>
              <v-flex xs7>
                <v-select
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                required
                autocomplete
                :max-height="270"
                :items="portRegionItems"
                item-text="portRegionNameVN"
                item-value="portRegionCode"
                v-model="detailTauRoiCang['portRegionCode']"
                class="py-0 my-0"
                placeholder="Chọn khu vực hàng hải"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Bến cảng rời (<span style="color: red;">*</span>):</label></v-flex>
              <v-flex xs7>
                <v-select
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                clearable
                required
                autocomplete
                :items="portHarbourItems"
                item-text="portHarbourNameVN"
                item-value="portHarbourCode"
                v-model="detailTauRoiCang['portHarbourCode']"
                class="py-0 my-0"
                placeholder="Chọn bến cảng rời"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Cầu cảng rời (<span style="color: red;">*</span>):</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                clearable
                required
                autocomplete
                :items="portWharfItems"
                item-text="portWharfNameVN"
                item-value="portWharfCode"
                v-model="detailTauRoiCang['portWharfCode']"
                class="py-0 my-0"
                placeholder="Chọn cầu cảng rời"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Tuyến luồng:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                clearable
                autocomplete
                multiple
                deletable-chips
                chips
                placeholder="Chọn tuyến luồng"
                :items="chanelListItems"
                item-text="name"
                item-value="code"
                v-model="detailTauRoiCang.chanelCodeList"
                class="py-0 my-0"
                ></v-select>

                <i style="color: red;">{{itemLevel2['description']}}</i>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Đơn vị:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                  autocomplete
                  :max-height="270"
                  :items="departmentItems"
                  item-text="departmentName"
                  item-value="departmentCode"
                  v-model="detailTauRoiCang['departmentCode']"
                  class="py-0 my-0"
                  placeholder="Chọn đơn vị"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1" v-if="type === 'lanh_dao'">
              <v-flex xs5 class="text-xs-left pl-2">Người ký <span style="color: red;">(*)</span>:</v-flex>
              <v-flex xs7 class>
                <v-select
                v-model="detailTauRoiCang['representative']"
                :items="user_signs"
                return-object
                item-text="representative"
                item-value="representative"
                :rules="[v => !!v || 'Người ký bắt buộc phải nhập']"
                required
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Mục đích chính :</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                <v-select
                autocomplete
                :items="purposeItems"
                item-text="purposeNameVN"
                item-value="purposeCode"
                v-model="detailTauRoiCang['purposeCode']"
                class="py-0 my-0"
                placeholder="Chọn mục đích chính"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Hàng hóa:</label></v-flex>
              <v-flex xs7>
                <v-select
                clearable
                autocomplete
                :items="cargoItems"
                item-text="name"
                item-value="code0"
                v-model="detailTauRoiCang.cargoType"
                class="py-0 my-0"
                placeholder="Chọn hàng hóa"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap v-if="documentName && documentName !== '0'">
              <v-flex xs5 class="text-xs-left pl-2"><label>Số tấn rời :</label></v-flex>
              <v-flex xs3 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['numberTNE']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap v-if="documentName && documentName !== '0'">
              <v-flex xs5 class="text-xs-left pl-2 background__blue__"><label>Số TEUS:</label></v-flex>
              <v-flex xs7 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['numberTEU']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

          </v-flex>

          <v-flex xs4 class="pr-2">

              <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Thời gian thủ tục đi :</label></v-flex>
              <v-flex xs7>
                <datetime-picker
                v-model="detailTauRoiCang['timeOfPORTArrival']"
                :first-day="1"
                :show-dst="false"
                :show-hours="true"
                :show-minutes="true"
                :show-seconds="false"
                class="mx-0 my-0"
                ></datetime-picker>
              </v-flex>
            </v-layout> -->

            <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Mớn nước mũi (m):</label></v-flex>
              <v-flex  xs3 class="">
                <v-currency-field v-bind="formatGT" :error-messages="errorsMessage.messageNT" :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" v-model="detailTauRoiCang['nt']"></v-currency-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Mớn nước lái (m):</label></v-flex>
              <v-flex  xs3 class="">
                <v-currency-field v-bind="formatGT" :error-messages="errorsMessage.messageNT" :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" v-model="detailTauRoiCang['nt']"></v-currency-field>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pl-2 background__blue__"><label>Mớn nước (m) (<span style="color: red;">*</span>):</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['shownDraftxF']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
              <v-flex xs1 sm1 class="text-xs-center">
                <span>F/A</span>
              </v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['shownDraftxA']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>


            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Ghi chú khi tàu rời:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field clearable class="py-0 my-0" multi-line rows="2" v-model="detailTauRoiCang['remarks']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Ghi chú của cảng vụ:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field clearable class="py-0 my-0" multi-line rows="2" v-model="detailTauRoiCang['maritimeRemarks']"
                ></v-text-field>
              </v-flex>
            </v-layout>


            <v-layout row wrap class="pb-2">
              <v-flex xs5 class="text-xs-left pl-2 background__blue__"><label>GP vận tải nội địa:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                autocomplete
                :max-height="270"
                :items="domesticTransportCertificateItems"
                item-text="text"
                item-value="value"
                v-model="detailTauRoiCang['domesticTransportCertificate']"
                class="py-0 my-0"
                placeholder="Chọn"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Số hành khách :</label></v-flex>
              <v-flex xs3 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['passengerNumber']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Số thuyền viên:</label></v-flex>
              <v-flex  xs3 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['crewNumber']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Số người khác:</label></v-flex>
              <v-flex xs3 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['crewNumberOther']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2">
                <label>Số chỗ ngồi:</label>
              </v-flex>
              <v-flex md3 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['seat']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="pl-2">
                <label>Số giường nằm:</label>
              </v-flex>
              <v-flex md3 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['lies']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Thuyền trưởng:</label></v-flex>
              <v-flex xs7>
                <v-text-field class="py-0 my-0" placeholder="Nhập thuyền trưởng" v-model="detailTauRoiCang.shipCaptain"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pt-2">
              <v-flex xs12 sm12>
                <label>Tình trạng:</label> <span style="margin-left: 50px; color: red;">{{support.markedAsDeparture[itineraryNo['markedAsDeparture'] + '']}}</span>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pl-2"><label>Loại thủ tục rời:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                  clearable
                  autocomplete
                  placeholder="Chọn loại thủ tục"
                  :items="shipTypeItems"
                  item-text="shipTypeNameVN"
                  item-value="shipTypeCode"
                  v-model="detailTauRoiCang.shipTypeCode"
                  class="py-0 my-0"
                ></v-select>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap>
              <v-flex xs12 sm5>
              </v-flex>
              <v-flex  xs12 sm7>
                <v-checkbox label="Phá dỡ tàu biển" v-model="detailTauRoiCang['deconstructed']" value="0"></v-checkbox>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex  xs12 class="pl-2">
                <span v-if="detailTauRoiCang['violated'] === 0 || detailTauRoiCang['violated'] === '0'">Xác nhận kiểm tra an toàn hàng hải</span>
                <span style="color: red;" v-else>Đang kiểm tra, chưa cho xuất bến</span>
                <!-- <v-checkbox :label="detailTauRoiCang['violated'] === '0' || detailTauRoiCang['violated'] === 0 ? 'Xác nhận kiểm tra an toàn hàng hải' : 'Đang kiểm tra, chưa cho xuất bến'" v-model="detailTauRoiCang['violated']" value="0"></v-checkbox> -->
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs4 class="px-2">

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Tàu:</label> <label style="color: red;">*</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field clearable  placeholder="Nhập quốc tịch" :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" v-model="detailTauRoiCang.nameOfShip"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1 background__blue__"><label>Phân cấp:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                autocomplete
                placeholder="Chọn cấp tàu"
                :items="vrCodeItems"
                item-text="vrCodeName"
                item-value="vrCode"
                :max-height="270"
                v-model="detailTauRoiCang['vrCode']"
                class="py-0 my-0"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"

                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Quốc tịch:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                placeholder="Nhập quốc tịch"
                :items="flagStateOfShipItems"
                item-text="stateName"
                item-value="stateCode"
                v-model="detailTauRoiCang.flagStateOfShip"
                class="py-0 my-0"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                clearable
                autocomplete
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Hô hiệu:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field clearable  placeholder="Nhập hô hiệu"  v-model="detailTauRoiCang.callSign"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Số IMO:</label></v-flex>
              <v-flex  xs7 class="">
                <v-text-field clearable  placeholder="Nhập số IMO"  v-model="detailTauRoiCang.imoNumber"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Loại tàu:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                clearable
                autocomplete
                :items="shipTypeItems"
                item-text="shipTypeNameVN"
                item-value="shipTypeCode"
                v-model="detailTauRoiCang.shipTypeCode"
                class="py-0 my-0"
                placeholder="Chọn loại tàu"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Cấp độ an ninh:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                clearable
                autocomplete
                :items="securityLevelItems"
                item-text="securityLevelName"
                item-value="securityLevelCode"
                v-model="detailTauRoiCang.securityLevelCode"
                class="py-0 my-0"
                placeholder="Chọn cấp độ an ninh"
                ></v-select>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Chủ tàu:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                clearable
                autocomplete
                :items="shipOwnersItems"
                item-text="companyName"
                item-value="shipOwnerCode"
                :max-height="270"
                v-model="detailTauRoiCang['shipOwnerCode']"
                class="py-0 my-0"
                placeholder="Chọn chủ tàu"
                ></v-select>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap>
              <v-flex md5 class="">
                <label>Chủ tàu: <label v-if="documentName && documentName !== '0'" style="color: red;">*</label></label>
              </v-flex>
              <v-flex md7 style="display: flex;">
                <v-select
                style="width: 90%;"
                autocomplete
                clearable
                :items="shipOwnersItems"
                item-text="companyName"
                item-value="shipOwnerCode"
                :max-height="270"
                v-model="detailTauRoiCang['shipOwner']"
                class="py-0 my-0"
                placeholder="Chọn chủ tàu"
                ></v-select>
                <v-tooltip bottom>
                  <v-chip slot="activator" class="px-0" label :color="!stateAddShipOwner ? 'primary' : 'blue-grey lighten-4'" text-color="white">
                    <v-icon color="white" style="cursor: pointer;" @click="showAddShipOwner()">add</v-icon>
                  </v-chip>
                  <span>Thêm mới chủ phương tiện</span>
                </v-tooltip>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="" v-if="stateAddShipOwner">
                <label>Tên chủ phương tiện: <label style="color: red;">*</label></label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipOwner">
                <v-text-field
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                required
                v-model="shipOwner['companyName']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập tên chủ phương tiện"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="" v-if="stateAddShipOwner">
                <label>Địa chỉ:</label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipOwner">
                <v-text-field
                v-model="shipOwner['companyAddress']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập địa chỉ chủ phương tiện"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="" v-if="stateAddShipOwner">
                <label>Số điện thoại:</label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipOwner">
                <v-text-field
                v-model="shipOwner['telNo']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập số điện thoại chủ phương tiện"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs5 class="text-xs-left pr-1"><label>Người khai thác:</label></v-flex>
              <v-flex  xs7 class="">
                <v-select
                clearable
                autocomplete
                :items="shipOperatorItems"
                item-text="companyName"
                item-value="shipOwnerCode"
                :max-height="270"
                v-model="detailTauRoiCang['shipOperatorCode']"
                class="py-0 my-0"
                placeholder="Chọn người khai thác"
                ></v-select>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap>
              <v-flex md5 class="">
                <label>Người khai thác:</label>
              </v-flex>
              <v-flex md7 style="display: flex;">
                <v-select
                style="width: 90%;"
                autocomplete
                clearable
                return-object
                :items="shipOperatorItems"
                item-text="companyName"
                item-value="shipOwnerCode"
                :max-height="270"
                v-model="detailTauRoiCang['shipOperator']"
                class="py-0 my-0"
                placeholder="Chọn người khai thác"
                ></v-select>
                <v-tooltip bottom>
                  <v-chip slot="activator" class="px-0" label :color="!stateAddShipOperator ? 'primary' : 'blue-grey lighten-4'" text-color="white">
                    <v-icon color="white" style="cursor: pointer;" @click="showAddShipOperator()">add</v-icon>
                  </v-chip>
                  <span>Thêm mới người khai thác</span>
                </v-tooltip>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="" v-if="stateAddShipOperator">
                <label>Tên người khai thác: <label style="color: red;">*</label></label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipOperator">
                <v-text-field
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                required
                v-model="shipOperator['companyName']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập tên người khai thác"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="" v-if="stateAddShipOperator">
                <label>Địa chỉ:</label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipOperator">
                <v-text-field
                v-model="shipOperator['companyAddress']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập địa chỉ người khai thác"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex md5 class="" v-if="stateAddShipOperator">
                <label>Số điện thoại:</label>
              </v-flex>
              <v-flex md7 v-if="stateAddShipOperator">
                <v-text-field
                v-model="shipOperator['telNo']"
                class="py-0 my-0 red--text"
                clearable
                placeholder="Nhập số điện thoại người khai thác"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>NT:</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['nt']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>GT:</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['gt']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>DWT:</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['dwt']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>Rộng (m):</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['breadth']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>LOA (m):</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['loa']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>Mớn nước t.kế (m):</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['maxDraft']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>Chiều cao t.không (m):</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['clearanceHeight']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs5 class="text-xs-left pr-1"><label>Công suất máy:</label></v-flex>
              <v-flex  xs3 class="">
                <input-number class="my-0 py-0" v-model="detailTauRoiCang['power']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

          </v-flex>
        </v-layout>
      </v-flex>
    </v-form>


    <v-layout row wrap v-if="!documentName || documentName === '0'">
      <v-flex xs12 sm6>
        <v-subheader class="px-0 text-bold">Hàng hóa vận chuyển trên tàu:</v-subheader>
      </v-flex>
      <v-flex xs12 sm5 class="text-right mb-2">
        <v-btn class="mx-0 my-0 white--text" color="blue-grey" v-on:click.native="addDanhSachHangHoa()" >
          Thêm khai báo hàng hóa <v-icon right dark>add_circle</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <v-flex xs12 sm12 v-if="!documentName || documentName === '0'">
      <v-data-table
        v-bind:headers="khaiBaoheaders"
        :items="hangHoaItems"
        hide-actions
        class="table-bordered danhSachHangHoaTable__class mb-2"
        >
        <template slot="items" slot-scope="props">
          <td v-if="props.item.idXoa === 0" class="text-xs-center" style="padding: 10px !important;">{{ props.index + 1 }}</td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-select
            v-model="props.item.cargoCategory"
            :items="cargoCategoryItems"
            item-text="name"
            item-value="code"
            ></v-select>
          </td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-select
            v-model="props.item.cargoType"
            :items="cargoTypeItems"
            item-text="name"
            item-value="code"
            ></v-select>
          </td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-select
            v-model="props.item.cargoCode"
            :items="filterCargo(props.item.cargoType)"
            item-text="name"
            item-value="code0"
            ></v-select>
          </td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-text-field
            v-model="props.item.description"
            ></v-text-field>
          </td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-text-field
            v-model="props.item.quantity"
            ></v-text-field>
          </td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-select
            v-model="props.item.unit"
            :items="unitCargos"
            item-text="name"
            item-value="code"
            ></v-select>
          </td>
          <td v-if="props.item.idXoa === 0" class="text-xs-center">
            <v-btn icon class="mx-0 my-0" v-on:click.native="removeDanhSachHangHoa(props.item, props.index)">
              <v-icon class="red--text text--darken-3">clear</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </div>

</template>

<script>
import axios from 'axios'
import DatetimePicker from '../DatetimePicker.vue'
import NumberInput from '@/components/hang_hai/Detail_hang_hai/NumberInput.vue'
import {VMoney} from 'v-money'
import toastr from 'toastr'
// import print from 'print-js'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
import { eventBus } from '../../../event-bus/eventBus.js'
import supportData from '../../../store/support_data.json'
import support from '../../../store/support.json'
export default {
  name: 'my-form',
  components: {
    'datetime-picker': DatetimePicker,
    'input-number': NumberInput,
  },
  props: {
    type: '',
    documentTypeCode: '',
    documentStatusCode: '',
    id: '',
    idPT: '',
    code: '',
    statusCode: '',
    documentName: '',
    documentYear: ''
  },
  directives: {money: VMoney},
  data: () => ({
    nguoiKy: {},
    user_signs: [],
    tauTrongCang: false,
    domesticTransportCertificateItems: [
      {
        text: 'Không xác định',
        value: 0
      },
      {
        text: 'Có giấy phép vận tải nội địa, còn hạn',
        value: 1
      },
      {
        text: 'Có giấy phép vận tải nội địa, hết hạn',
        value: 2
      }
    ],
    supportData: supportData,
    support: support,
    loadingDetail: true,
    errorsMessage: {},
    showWarning: false,
    disabledForm: false,
    warningTauRoi: {
      show: false,
      message: []
    },
    formatClearanceHeight: {
      decimal: '.',
      thousands: ',',
      prefix: '',
      suffix: '',
      precision: 2,
      masked: false
    },
    formatGT: {
      decimal: '.',
      thousands: ',',
      prefix: '',
      suffix: '',
      precision: 0,
      masked: false
    },
    purposeItems: [],
    portItems: [],
    portWharfItems: [],
    cargoItems: [],
    securityLevelItems: [],
    representativeItems: [],
    chanelListItems: [],
    flagStateOfShipItems: [],
    dmPortItems: [],
    shipAgencyItems: [],
    portRegionItems: [],
    homeValue: 350000,
    detailTauRoiCang: {
      chanelCodeList: [],
      portGoingToCode: '',
      shipOwner: {},
      shipOwnerCode: '',
      deconstructed: 0,
      violated: 0,
      expiredDate: '',
      portRegionCode: '',
      portHarbourCode: ''
    },
    money: {
      decimal: ',',
      thousands: '.',
      prefix: 'R$ ',
      suffix: ' #',
      precision: 2,
      masked: false
    },
    addNotification: {},
    enabled: false,
    thoiGianDiDSDT: '',
    hangBangTtItems: [
      {
        text: 'Hạng 1',
        value: 1
      },
      {
        text: 'Hạng 2',
        value: 2
      },
      {
        text: 'Hạng 3',
        value: 3
      },
      {
        text: 'Hạng 4',
        value: 4
      }
    ],
    hangBangMtItems: [
      {
        text: 'Hạng 1',
        value: 1
      },
      {
        text: 'Hạng 2',
        value: 2
      },
      {
        text: 'Hạng 3',
        value: 3
      },
      {
        text: 'Hạng 4',
        value: 4
      }
    ],
    portTypeItems: [
      {
        name: 'Cảng biển',
        code: 0
      },
      {
        name: 'Cảng thủy nội địa',
        code: 1
      },
      {
        name: 'Cảng ngoài đảo(tuyến bờ ra đảo)',
        code: 2
      }
    ],
    validFormTauRoiCang: true,
    shipTypeItems: [],
    shipOwnersItems: [],
    shipOperatorItems: [],
    loadingBtn: false,
    detailHs: {},
    departmentItems: [],
    documentNameOUT: '',
    documentYearOUT: '',
    stateAddShipAgency: false,
    shipAgency: {},
    initData: {},
    stateAddShipOwner: false,
    shipOwner: {},
    shipOperator: {},
    stateAddShipOperator: false,
    unitCargos: [],
    khaiBaoheaders: [
      {
        text: 'STT',
        align: 'left',
        sortable: false
      },
      {
        text: 'Hình thức hàng hóa',
        align: 'center',
        sortable: false
      },
      {
        text: 'Loại hàng hóa',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên hàng hóa',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mô tả hàng hóa (nếu có)',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số lượng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Đơn vị',
        align: 'center',
        sortable: false
      },
      {
        text: 'Xóa',
        align: 'center',
        sortable: false
      }
    ],
    hangHoaItems: [
    ],
    cargoTypeItems: [],
    cargoCategoryItems: [],
    departureShipAgency: '',
    vrCodeItems: [],
    flagStateOfShipTmp: {},
    stateShowPortType: false,
    stateShowLastProvince: false,
    itemLevel2: {}
  }),
  watch: {
    // notification (notification) {
    //   this.detailTauRoiCang = notification
    // }
    'detailTauRoiCang.chanelCodeList' (val) {
      let vm = this
      if (val && val.length) {
        let filterLevel2 = vm.chanelListItems.filter(item => {
          return (item['level'] === 2 || item['level'] === '2') && val.includes(item['code'])
        })
        if (filterLevel2 && filterLevel2['length']) {
          vm.itemLevel2 = filterLevel2[0]
        } else {
          vm.itemLevel2 = {}
        }
      } else {
        vm.itemLevel2 = {}
      }
    },
    'chanelListItems' (val) {
      let vm = this
      let list = vm.detailTauRoiCang['chanelCodeList'] || []
      if (val && val.length && !vm.itemLevel2['code']) {
        let filterLevel2 = vm.chanelListItems.filter(item => {
          return (item['level'] === 2 || item['level'] === '2') && list.includes(item['code'])
        })
        if (filterLevel2 && filterLevel2['length']) {
          vm.itemLevel2 = filterLevel2[0]
        }
      }
    },
    'flagStateOfShipTmp' (val) {
      if (val) {
        this.changeQuocTich(val['stateCode'], val['stateName'])
      }
    },
    'detailTauRoiCang.portRegionCode' (val) {
      this.loadPortHarbour(val)
    },
    'detailTauRoiCang.portHarbourCode' (val) {
      this.loadPortWharf(val)
    },
    'detailTauRoiCang.portGoingToCode' (val) {
      if ((val && val === 'ORTHER') || (val && val.indexOf('ZZZ') !== -1)) {
        this.stateShowLastProvince = true
      } else {
        this.stateShowLastProvince = false
      }
    },
    '$route': function (newRoute, oldRoute) {
      this.checkTauTrongCang()
    },
    getTextShipAgency: function (item) {
      console.log('item---SHipAgent++++++++++++', item)
      this.departureShipAgency = item['shipAgencyNameVN']
    },
    documentName (val) {
      var vm = this
      if (val && val !== '0') {
        if (!vm.id || vm.id === '0') {
          vm.disabledForm = true
        }
      }
    },
    id (val) {
      var vm = this
      if (val && val !== '0' && String(this.detailTauRoiCang['vmaItineraryScheduleId']) !== String(val)) {
        vm.loadTauRoiCang()
      }
    }
  },
  computed: {
    maritimeCode () {
      return this.$store.getters.maritimeCode
    },
    pttnd () {
      return this.$store.getters.pttnd
    },
    selectPTTND () {
      return this.$store.getters.selectPTTND
    },
    loadingInitData () {
      return this.$store.getters.loadingInitData
    },
    itineraryNo () {
      var itineraryNo = this.$store.getters.itineraryNo
      if (itineraryNo) {
        return itineraryNo
      } else {
        return {}
      }
    },
    checkShowForm: function () {
      if (!this.documentName || this.documentName === '0') {
        return true
      } else {
        if (this.itineraryNo['markedAsDeparture']) {
          return true
        }
      }
      return false
    },
    selectTau () {
      return this.$store.getters.selectTau
    },
    selectTauRoi: function () {
      return this.$store.getters.selectTauRoi
    }
  },
  created () {
    var vm = this
    vm.$store.dispatch('loadInitResource').then(resInit => {
      vm.initData = resInit
      vm.checkTauTrongCang()
      vm.loadPortRegion()
      vm.loadPortWharf()
      vm.loadShipAgency()
      vm.loadPortHarbour()
      vm.loadPurpose()
      vm.loadCargo()
      vm.loadShipType()
      vm.loadChanelList().then(result => {
        vm.getDefaultDepartment()
      })
      vm.loadDepartment().then(result => {
        vm.getDefaultDepartment()
      })
      vm.loadUserSigns()
      vm.loadsecurityLevel()
      vm.loadDonVi()
      vm.loadFlagStateOfShip()
      vm.loadVrCode()
      vm.loadShipOwners({
        isShipOwner: 1
      })
      if (!vm.documentName || vm.documentName === '0') {
        vm.loadCargoType()
        vm.loadCargoCategory()
        vm.loadUnit()
      }
      // vm.loadPort()
      vm.loadShipOwners({
        isShipOperator: 1
      })
      vm.detailTauRoiCang['timeOfDeparture'] = vm.getCurrentDate()
      let query = vm.$router.history.current.query
      if (vm.documentName && vm.documentName !== '0' && !query['itineraryNo']) {
        vm.loadingDetail = true
        vm.$store.dispatch('loadItineraryNo', {
          documentName: vm.documentName,
          documentYear: vm.documentYear
        }).then(resultItineraryNo => {
          vm.loadingDetail = false
          console.log('resultItineraryNo["documentNameOUT"]-------', resultItineraryNo['documentNameOUT'])
          console.log('resultItineraryNo["documentYearOUT"]-------', resultItineraryNo['documentYearOUT'])
          console.log('resultItineraryNo["markedAsDeparture"]-------', resultItineraryNo['markedAsDeparture'])
          if (resultItineraryNo['documentNameOUT'] && resultItineraryNo['documentYearOUT']) {
            vm.documentNameOUT = resultItineraryNo['documentNameOUT']
            vm.documentYearOUT = resultItineraryNo['documentYearOUT']
            vm.loadingDetail = true
            if (vm.id && vm.id !== '0') {
              vm.loadTauRoiCang()
            } else {
              vm.detailTauRoiCang['timeOfDeparture'] = vm.getCurrentDate()
              // vm.flagStateOfShipTmp = {
              //   stateCode: 'VN',
              //   stateName: 'VIET NAM'
              // }
              // if (vm.detailTauRoiCang['portTypeTmp'] || vm.flagStateOfShipTmp['stateCode']) {
              //   vm.loadPort({
              //     portType: vm.detailTauRoiCang['portTypeTmp'],
              //     stateCode: vm.flagStateOfShipTmp['stateCode']
              //   })
              // }
              vm.loadDetailFromItineraryNo_NoticeShipType(resultItineraryNo, 2).then(result => {
                if (result && result.hasOwnProperty('errorCode') && result['errorCode']) {
                  vm.loadInitData().then(resultInit => {
                    // vm.themTauRoiCang()
                    vm.initPort()
                  })
                  if (vm.departmentItems && vm.departmentItems['length']) {
                    vm.detailTauRoiCang['departmentCode'] = vm.departmentItems[0]['departmentCode']
                  }
                }
              })
            }
            vm.loadDetailHs(resultItineraryNo['documentNameOUT'], resultItineraryNo['documentYearOUT'])
          } else {
            if (!vm.id || vm.id === '0') {
              vm.detailTauRoiCang['timeOfDeparture'] = vm.getCurrentDate()
              // vm.flagStateOfShipTmp = {
              //   stateCode: 'VN',
              //   stateName: 'VIET NAM'
              // }
              // if (vm.detailTauRoiCang['portTypeTmp'] || vm.flagStateOfShipTmp['stateCode']) {
              //   vm.loadPort({
              //     portType: vm.detailTauRoiCang['portTypeTmp'],
              //     stateCode: vm.flagStateOfShipTmp['stateCode']
              //   })
              // }
              if (query && query['thuCong']) {
                vm.setMarkedAsDeparture_ItineraryNo(1)
                vm.loadInitData().then(resultInit => {
                  vm.initPort()
                })
              } else {
                vm.loadInitData().then(resultInit => {
                  vm.selectTauRoiAndUpdateItinerary(vm.selectTauRoi, resultItineraryNo)
                  vm.initPort()
                })
              }
            } else {
              vm.loadTauRoiCang()
            }
          }
          vm.loadingDetail = false
        }).catch(xhr => {
          vm.loadingDetail = false
        })
      } else {
        vm.loadingDetail = false
        vm.loadItineraryFromUrlQuery().then(result => {
          vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, vm.selectTau)
          if (vm.itineraryNo && vm.itineraryNo['itineraryNo']) {
            vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, {
              ...vm.itineraryNo,
              shipOwner: {
                companyName: result['shipOwnersName'],
                shipOwnerCode: result['shipOwnerCode']
              }
            })
          }
          vm.detailTauRoiCang['shipAgency'] = {
            shipAgencyCode: vm.detailTauRoiCang['shipAgencyCode'],
            shipAgencyNameVN: vm.detailTauRoiCang['shipAgencyName']
          }
          if (vm.id && vm.id !== '0') {
            vm.loadTauRoiCangOut()
          } else {
            if (!vm.id || vm.id === '0') {
              vm.detailTauRoiCang['timeOfArrival'] = vm.getCurrentDate()
              vm.flagStateOfShipTmp = {
                stateCode: 'VN',
                stateName: 'VIET NAM'
              }
              if (vm.detailTauRoiCang['portTypeTmp'] || vm.flagStateOfShipTmp['stateCode']) {
                vm.loadPort({
                  portType: vm.detailTauRoiCang['portTypeTmp'],
                  stateCode: vm.flagStateOfShipTmp['stateCode']
                })
              }
              if (query && query['thuCong']) {
                vm.loadDetailFromItineraryNo_NoticeShipType(vm.itineraryNo, 1).then(resultTauDen => {
                  if (resultTauDen && !resultTauDen['errorCode']) {
                    vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, resultTauDen)
                  }
                  vm.detailTauRoiCang['vmaItineraryScheduleId'] = ''
                  if (!vm.detailTauRoiCang['documentNameVOY'] || vm.detailTauRoiCang['documentNameVOY'] === '0') {
                    vm.genDocumentNameVoy()
                  }
                  vm.initPort()
                })
              } else {
                vm.selectTauRoiAndUpdateItinerary(vm.selectTauRoi, vm.itineraryNo)
              }
            }
          }
        })
      }
    })
    // vm.loadWarning()
  },
  destroyed () {
    eventBus.$off('selectTauRoi', this.selectTauRoi)
  },
  methods: {
    loadUserSigns: function () {
      let vm = this
      let data = {
        documentType: 'XC',
        documentName: 0,
        documentYear: 0,
        messageType: 60,
        roleType: -2
      }
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadUserSigns', data).then(result => {
          vm.user_signs = result['data'] || []
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    initPort () {
      let vm = this
      let qg = ''
      if (vm.detailTauRoiCang['portGoingToCode']) {
        qg = vm.detailTauRoiCang['portGoingToCode'].substring(0, 2)
        let param = {
          categoryId: 'DM_STATE'
        }
        param['stateCode'] = qg || ''
        param['start'] = -1
        param['end'] = -1
        vm.$store.dispatch('loadDataDm', param).then(function (result) {
          vm.flagStateOfShipTmp = result[0] || {}
        }).catch(function (xhr) {
          console.log(xhr)
        })
      } else if (!vm.detailTauRoiCang['portGoingToCode'] && !vm.detailTauRoiCang['portGoingToStateName']) {
        vm.flagStateOfShipTmp = {
          stateCode: 'VN',
          stateName: 'VIET NAM'
        }
        qg = 'VN'
      }
      vm.loadPort({
        portType: vm.detailTauRoiCang['portTypeTmp'] || '',
        stateCode: qg
      })
    },
    getDefaultDepartment: function () {
      let vm = this
      if (!vm.detailTauRoiCang['vmaItineraryScheduleId'] || vm.detailTauRoiCang['vmaItineraryScheduleId'] === '0') {
        vm.$store.dispatch('findUserPortByUserId', {}).then(result => {
          if (result && !result['errorCode']) {
            if (result['departmentCode']) {
              vm.detailTauRoiCang['departmentCode'] = result['departmentCode']
            } else {
              vm.detailTauRoiCang['departmentCode'] = vm.departmentItems[0]['departmentCode']
            }
            if (result['routeCode']) {
              vm.detailTauRoiCang['chanelCodeList'] = [result['routeCode']]
            } else {
              vm.detailTauRoiCang['chanelCodeList'] = [vm.chanelListItems[0]['code']]
            }
          }
        }).catch(xhr => {
          console.log(xhr)
        })
      }
    },
    getCurrentDate () {
      let date = new Date()
      return `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    },
    changePortType (portType) {
      let vm = this
      vm.loadPort({
        stateCode: vm.flagStateOfShipTmp['stateCode'],
        portType: portType
      })
      vm.$store.commit('setSelectTau', {
        ...vm.selectTau,
        flagStateOfShipTmp: vm.flagStateOfShipTmp,
        portTypeTmp: portType
      })
    },
    changeQuocTich (stateCode, stateName) {
      let vm = this
      if (stateCode && stateCode !== 'VN') {
        vm.stateShowPortType = false
        vm.$store.commit('setSelectTau', {
          ...vm.selectTau,
          flagStateOfShipTmp: vm.flagStateOfShipTmp,
          portTypeTmp: vm.detailTauRoiCang['portTypeTmp']
        })
      } else {
        vm.$store.commit('setSelectTau', {
          ...vm.selectTau,
          flagStateOfShipTmp: vm.flagStateOfShipTmp,
          portTypeTmp: vm.detailTauRoiCang['portTypeTmp']
        })
        vm.stateShowPortType = true
        vm.dmPortItems = []
      }
      if (!stateCode) {
        let param = {
          categoryId: 'DM_STATE'
        }
        param['stateName'] = stateName || ''
        param['start'] = -1
        param['end'] = -1
        vm.$store.dispatch('loadDataDm', param).then(function (result) {
          vm.flagStateOfShipTmp = result[0] || {}
          vm.loadPort({
            stateCode: vm.flagStateOfShipTmp['stateCode']
          })
        }).catch(function (xhr) {
          console.log(xhr)
        })
      } else {
        vm.loadPort({
          stateCode: stateCode
        })
      }
    },
    loadVrCode: function () {
      var vm = this
      let param = {
        categoryId: 'DM_VRCODE',
        shipBoat: 'SHIP'
      }
      if (vm.id && vm.id !== '0') {
        delete param['isDelete']
      } else {
        param['isDelete'] = 0
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.vrCodeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    getCurrentYear () {
      let date = new Date()
      return date.getFullYear() || 0
    },
    genDocumentNameVoy: function () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('genDocumentNameVoy', {
          maritimeCode: vm.maritimeCode
        }).then(result => {
          vm.detailTauRoiCang['documentNameVOY'] = result
          vm.detailTauRoiCang['documentYearVOY'] = vm.getCurrentYear()
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    showAddShipOwner () {
      this.stateAddShipOwner = !this.stateAddShipOwner
      this.detailTauRoiCang['shipOwnerCode'] = ''
    },
    showAddShipOperator () {
      this.stateAddShipOperator = !this.stateAddShipOperator
      this.detailTauRoiCang['shipOperatorCode'] = ''
    },
    chuyenTaiVuTinhPhi: function () {
      let vm = this
      let cf = confirm('Bạn có muốn thực hiện hành động này')
      if (cf) {
        let data = {
          ...vm.detailTauRoiCang,
          statePayment: 1
        }
        vm.$store.dispatch('chuyenTaiVuTinhPhi', data).then(result => {
          toastr.success('Chuyển thành công!')
        }).catch(xhr => {
          toastr.error('Xử lý thất bại, vui lòng thử lại!')
        })
      }
    },
    chuyenlanhDaoKySo: function () {
      let vm = this
      let cf = confirm('Bạn có muốn thực hiện hành động này')
      if (cf) {
        let tmp = Object.assign({}, vm.detailTauRoiCang)
        tmp['keyId'] = 'vma_itinerary_schedule'
        let data = {
          value: JSON.stringify([tmp])
        }
        vm.$store.dispatch('chuyenLanhDaoKySo', data).then(result => {
          if (result && result['errorCode']) {
            toastr.error('Xử lý thất bại, vui lòng thử lại!')
          } else {
            toastr.success('Chuyển lãnh đạo thành công!')
          }
        }).catch(xhr => {
          toastr.error('Xử lý thất bại, vui lòng thử lại!')
        })
      }
    },
    xemThongBaoThuPhi: function () {
      let vm = this
      vm.$store.dispatch('xemThongBaoThuPhi', vm.detailTauRoiCang).then(result => {
        if (result && result['url']) {
          window.open(result['url'], '_blank')
        } else {
          toastr.error('Đường dẫn không tồn tại, vui lòng thử lại!')
        }
      }).catch(xhr => {
        toastr.error('Không thể hiển thị thông báo phí, vui lòng thử lại!')
      })
    },
    addShipOwner: async (vm) => {
      console.log('vm.shipOwner++++++++++', vm.shipOwner)
      let param = {
        params: {
          'LAN_CAP_MOI_DU_LIEU': 'LAN_CAP_MOI_DU_LIEU',
          'categoryId': 'DM_VMA_SHIP_OWNER',
          'isShipOwner': 1,
          ...vm.shipOwner
        }
      }
      return axios.get(vm.initData['actionUpdateDanhmuc'], param).then(function (response) {
        vm.shipOwner = response['data'] || {}
        vm.detailTauRoiCang['shipOwner'] = vm.shipOwner
        vm.stateAddShipOwner = false
        if (response && response['data']) {
          vm.shipOwnersItems.push(vm.shipOwner)
        }
      }).catch(function (error) {
        console.log(error)
        toastr.error('Không thể thêm mới chủ tàu!')
      })
    },
    addShipOperator: async (vm) => {
      console.log('vm.shipOperator++++++++++', vm.shipOperator)
      let param = {
        params: {
          'LAN_CAP_MOI_DU_LIEU': 'LAN_CAP_MOI_DU_LIEU',
          'categoryId': 'DM_VMA_SHIP_OWNER',
          'isShipOperator': 1,
          ...vm.shipOperator
        }
      }
      return axios.get(vm.initData['actionUpdateDanhmuc'], param).then(function (response) {
        vm.shipOperator = response['data'] || {}
        vm.detailTauRoiCang['shipOperator'] = vm.shipOperator
        vm.stateAddShipOperator = false
        if (response && response['data']) {
          vm.shipOperatorItems.push(vm.shipOperator)
        }
      }).catch(function (error) {
        console.log(error)
        toastr.error('Không thể thêm mới người khai thác!')
      })
    },
    checkChangeShipOwner: async (vm) => {
      if (!vm.detailTauRoiCang['shipOwner'] || !vm.detailTauRoiCang['shipOwner']['shipOwnerCode']) {
        return
      }
      if (vm.itineraryNo['shipOwnerCode'] !== vm.detailTauRoiCang['shipOwner']['shipOwnerCode']) {
        return axios.get(vm.initData.updateVmaItineraryURL, {
          itineraryNo: vm.itineraryNo['itineraryNo'],
          vmaItineraryId: vm.itineraryNo['vmaItineraryId'],
          newShipOwnerCode: vm.itineraryNo['shipOwnerCode'],
          newShipOwnerName: vm.itineraryNo['shipOwnersName']
        }).then(function (response) {
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    addShipAgency: async (vm) => {
      let param = {
        params: {
          'LAN_CAP_MOI_DU_LIEU': 'LAN_CAP_MOI_DU_LIEU',
          'categoryId': 'DM_SHIP_AGENCY',
          ...vm.shipAgency,
          fax: vm.detailTauRoiCang['shipAgencyPhone']
        }
      }
      return axios.get(vm.initData['actionUpdateDanhmuc'], param).then(function (response) {
        vm.shipAgency = response['data'] || {}
        if (vm.documentName && vm.documentName !== '0') {
          vm.detailTauRoiCang['departureShipAgency'] = vm.shipAgency['shipAgencyNameVN'] || ''
        } else {
          vm.detailTauRoiCang['shipAgencyCode'] = vm.shipAgency['shipAgencyCode'] || ''
        }
        vm.stateAddShipAgency = false
        if (response && response['data']) {
          vm.shipAgencyItems.push(vm.shipAgency)
        }
      }).catch(function (error) {
        console.log(error)
        toastr.error('Không thể thêm mới đại lý!')
      })
    },
    loadPortRegion: function (query) {
      var vm = this
      let param = {
        categoryId: 'DM_PORT_REGION'
      }
      if (vm.id && vm.id !== '0') {
        delete param['isDelete']
      } else {
        param['isDelete'] = 0
      }
      if (query) {
        for (var key in query) {
          param[key] = query[key]
        }
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.portRegionItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    xemKHDD () {
      window.open('/group/ke-hoach/quan-ly-thu-tuc-tau-bien#/tra-cuu/ke_hoach/0/0/KeHoachDieuDongTau2', '_blank')
    },
    checkTauTrongCang: function () {
      let query = this.$router.history.current.query
      if (query && query['tauTrongCang']) {
        this.tauTrongCang = true
      } else {
        this.tauTrongCang = false
      }
    },
    loadItineraryFromUrlQuery: function () {
      let vm = this
      let query = vm.$router.history.current.query
      return new Promise((resolve, reject) => {
        if (query && query.hasOwnProperty('itineraryNo') && query['itineraryNo']) {
          vm.$store.dispatch('loadItineraryFromItineraryNo', {
            itineraryNo: query['itineraryNo']
          }).then(result => {
            resolve(result)
          }).catch(xhr => {
            reject(xhr)
          })
        } else {
          resolve({})
        }
      })
    },
    genCertificateNo: function () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('genCertificateNo', {
          itineraryNo: vm.itineraryNo['itineraryNo'],
          documentName: vm.documentName,
          documentYear: vm.documentYear,
          maritimeCode: vm.maritimeCode
        }).then(result => {
          vm.detailTauRoiCang['certificateNo'] = result
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    luuNhapTachDoan: function () {
      let vm = this
      console.log('vm.$refs.detailNhapTachDoan******************', vm.$refs.detailNhapTachDoan)
      console.log('vm.$refs.detailNhapTachDoan|||detailNhapTachDoan******************', vm.$refs.detailNhapTachDoan['detailNhapTachDoan'])
      console.log('vm.detailTauRoiCang******************', vm.detailTauRoiCang)
      if (vm.$refs.detailNhapTachDoan) {
        vm.$refs.detailNhapTachDoan['detailNhapTachDoan'] = Object.assign(vm.$refs.detailNhapTachDoan['detailNhapTachDoan'], vm.detailTauRoiCang)
        // if (vm.$refs.detailNhapTachDoan['detailNhapTachDoan'] && vm.$refs.detailNhapTachDoan['detailNhapTachDoan'].hasOwnProperty('vmaScheduleMergingId') && vm.$refs.detailNhapTachDoan['detailNhapTachDoan']['vmaScheduleMergingId']) {
        //   vm.$refs.detailNhapTachDoan.luuNhapTachDoan(true)
        // } else {
        //   vm.$refs.detailNhapTachDoan.themNhapTachDoan(true)
        // }
        vm.$refs.detailNhapTachDoan.luuNhapTachDoan(true)
      }
    },
    luuHoaTieu: function () {
      let vm = this
      if (vm.$refs.detailHoaTieuDanTau) {
        vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau'] = Object.assign(vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau'], vm.detailTauRoiCang)
        if (vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau'] && vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau'].hasOwnProperty('vmaSchedulePilotId') && vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau']['vmaSchedulePilotId']) {
          vm.$refs.detailHoaTieuDanTau.luuHoaTieuDanTau(true)
        } else {
          vm.$refs.detailHoaTieuDanTau.themHoaTieuDanTau(true)
        }
      }
    },
    luuTauLai: function () {
      let vm = this
      if (vm.$refs.detailTauLaiHoTro) {
        vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'] = Object.assign(vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'], vm.detailTauRoiCang)
        vm.$refs.detailTauLaiHoTro.luuTauLaiHoTro(true)
        // if (vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'] && vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'].hasOwnProperty('vmaScheduleTugboatId') && vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro']['vmaScheduleTugboatId']) {
        //   vm.$refs.detailTauLaiHoTro.luuTauLaiHoTro(true)
        // } else {
        //   vm.$refs.detailTauLaiHoTro.themTauLaiHoTro(true)
        // }
      }
    },
    loadWarning: function (model) {
      let vm = this
      let actions = []
      vm.loadingWarning = true
      actions.push(vm.loadWarningCauCang(model, 'dwt'))
      actions.push(vm.loadWarningCauCang(model, 'loa'))
      actions.push(vm.loadWarningCauCang(model, 'shownDraftxA'))
      Promise.all(actions).then(results => {
        vm.loadingWarning = false
      }).catch(xhr => {
        vm.loadingWarning = false
      })
    },
    loadWarningCauCang: function (model, keySearch) {
      let vm = this
      if (!model || !keySearch) {
        console.log('valid param warning!', model)
        return
      }
      let param = {
        portWharfCode: model['shiftingPortWharfCode']
      }
      if (model.hasOwnProperty(keySearch) && model[keySearch]) {
        param[keySearch] = model[keySearch]
      } else {
        return
      }
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadWarningCauCang', param).then(result => {
          if (!result.hasOwnProperty('errorCode') && result['message']) {
            if (vm.warningTauRoi['message'].length) {
              let index = vm.warningTauRoi['message'].findIndex(item => {
                return item === result['message']
              })
              if (index === -1) {
                vm.warningTauRoi['message'].push(result['message'])
              }
            } else {
              vm.warningTauRoi['message'].push(result['message'])
            }
            vm.warningTauRoi['show'] = true
          }
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadDetailFromItineraryNo_NoticeShipType: function (itineraryNo, noticeShipType) {
      var vm = this
      vm.loadingDetail = true
      return new Promise((resolve, reject) => {
        let param = {
          itineraryNo: itineraryNo['itineraryNo'],
          noticeShipType: noticeShipType
        }
        vm.$store.dispatch('loadDetailFromItineraryNo_NoticeShipType', param).then(function (result) {
          if (!result.hasOwnProperty('errorCode')) {
            if (result.hasOwnProperty('chanelCodeList')) {
              if (result['chanelCodeList']) {
                if (typeof result['chanelCodeList'] === 'string') {
                  result['chanelCodeList'] = result['chanelCodeList'].split(',')
                }
              } else {
                result['chanelCodeList'] = []
              }
            }
            // console.log('chanelCodeList+++++++++++result___________', result)
            // vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, result)
            // console.log('detailTauRoiCang+++++++++++result___________', vm.detailTauRoiCang)
            // vm.loadWarning(vm.detailTauRoiCang)
            if (noticeShipType === 2 || noticeShipType === '2') {
              let query = vm.$router.history.current.query
              if (result['vmaItineraryScheduleId']) {
                vm.changeIdUrl(result['vmaItineraryScheduleId'], {
                  ...query
                })
              }
            }
          } else {
            vm.loadInitData().then(result => {
              vm.genCertificateNo().then(resultCerti => {
                vm.detailTauRoiCang['markedAsDeparture'] = 2
                // vm.themTauRoiCang()
              })
            })
            // vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, {})
          }
          if (result['portHarbourCode']) {
            vm.changeBenCang(result['portHarbourCode'])
          }
          // vm.changeBenCang(result['portHarbourCode'])
          vm.loadingDetail = false
          resolve(result)
        }).catch(function (xhr) {
          console.log(xhr)
          vm.loadingDetail = false
          reject(xhr)
        })
      })
    },
    updateVmaItinerary: function (param) {
      var vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('updateVmaItinerary', param).then(result => {
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    selectTauRoiAndUpdateItinerary: function (item, itineraryNo) {
      var vm = this
      if (!item) {
        return
      }
      console.log('item-------------Tau______________ROI+++++++++++', item)
      // vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, item)
      console.log('vm.detailTauRoiCang++++++++++++', vm.detailTauRoiCang)
      let param = {
        documentNameOUT: item['documentName'] || item['documentNameIN'],
        documentYearOUT: item['documentYear'] || item['documentYearIN'],
        itineraryNo: item['itineraryNo'],
        vmaItineraryId: itineraryNo['vmaItineraryId'],
        timeOfDeparture: item['shipDateTo'],
        departureShipAgencyCode: item['shipAgencyCode'],
        departureShipAgency: item['nameOfShipownersAgents'],
        nextPortCode: item['lastPortCode'],
        shipPosition: 2,
        markedAsDeparture: 1
      }
      if (item && item['documentTypeCode'] === 'QC') {
        param['markedAsTransmit'] = 1
      }
      vm.updateVmaItinerary(param).then(result => {
        // vm.$store.dispatch('loadItineraryNo', {
        //   documentName: vm.documentName,
        //   documentYear: vm.documentYear
        // }).then(resultItineraryNo => {
        // })
        if (result['documentNameOUT'] && result['documentYearOUT']) {
          vm.documentNameOUT = result['documentNameOUT']
          vm.documentYearOUT = result['documentYearOUT']
          vm.loadDetailHs(result['documentNameOUT'], result['documentYearOUT'])
          vm.detailTauRoiCang['markedAsDeparture'] = 1
          vm.loadInitData().then(resultRC => {
            vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, item)
            vm.setMarkedAsDeparture_ItineraryNo(1)
            vm.genCertificateNo().then(resultCertificate => {
              vm.detailTauRoiCang['markedAsDeparture'] = 2
              if (!vm.detailTauRoiCang['vmaItineraryScheduleId']) {
                // vm.themTauRoiCang()
              }
            })
          })
        }
      }).catch(xhr => {
        console.log(xhr)
      })
    },
    toDetailHs: function () {
      var vm = this
      this.$router.push({
        path: '/ho-so/' + vm.type + '/' + vm.detailHs['documentName'] + '/' + vm.detailHs['documentYear'] + '/' + vm.detailHs['documentTypeCode'] + '/' + vm.detailHs['requestState']
      })
    },
    toDetailHsOther: function () {
      var vm = this
      this.$router.push({
        path: '/ho-so/' + vm.type + '/' + vm.detailHsOther['documentName'] + '/' + vm.detailHsOther['documentYear'] + '/' + vm.detailHsOther['documentTypeCode'] + '/' + vm.detailHsOther['requestState']
      })
    },
    loadDetailHs: function (documentNameOUT, documentYearOUT) {
      var vm = this
      let param = {
        documentName: documentNameOUT,
        documentYear: documentYearOUT,
        type: vm.type,
        documentType: vm.documentType
      }
      vm.loadingDetail = true
      vm.$store.dispatch('loadDetailHoSo', param).then(result => {
        if (result) {
          vm.detailHs = result
        } else {
          vm.detailHs = {}
        }
        vm.loadingDetail = false
      }).catch(xhr => {
        vm.loadingDetail = false
      })
    },
    loadPort: function (query) {
      var vm = this
      let param = {
        categoryId: 'DM_PORT'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      if (query) {
        for (var key in query) {
          param[key] = query[key]
        }
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.dmPortItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadDonVi: function () {
      var vm = this
      let param = {
        categoryId: 'DM_REPRESENTATIVE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.representativeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadShipOwners: function (query) {
      var vm = this
      let param = {
        categoryId: 'DM_VMA_SHIP_OWNER'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      if (query) {
        for (var key in query) {
          param[key] = query[key]
        }
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        if (query.hasOwnProperty('isShipOwner') && query['isShipOwner'] === 1) {
          vm.shipOwnersItems = result
        } else {
          vm.shipOperatorItems = result
        }
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadsecurityLevel: function () {
      var vm = this
      let param = {
        categoryId: 'DM_SECURITY_LEVEL'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.securityLevelItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadFlagStateOfShip: function () {
      var vm = this
      let param = {
        categoryId: 'DM_STATE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.flagStateOfShipItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadPortWharf: function (data) {
      var vm = this
      let param = {
        categoryId: 'DM_PORT_WHARF'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      if (data) {
        param['holdPortHarbourCode'] = data
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.portWharfItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadShipAgency: function () {
      var vm = this
      let param = {
        categoryId: 'DM_SHIP_AGENCY'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.shipAgencyItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadPortHarbour: function (data) {
      var vm = this
      let param = {
        categoryId: 'DM_PORT_HARBOUR'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portRegion'] = data || ''
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.portHarbourItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadPurpose: function () {
      var vm = this
      let param = {
        categoryId: 'DM_ARRIVAL_PURPOSE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.purposeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadCargoType: function () {
      var vm = this
      let param = {
        dataGroupId: '115'
      }
      if (vm.id && vm.id !== '0') {
        delete param['isDelete']
      } else {
        param['isDelete'] = 0
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataItems', param).then(function (result) {
        vm.cargoTypeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadCargoCategory: function () {
      var vm = this
      let param = {
        dataGroupId: '119'
      }
      param['isDelete'] = 0
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataItems', param).then(function (result) {
        vm.cargoCategoryItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    filterCargo: function (code) {
      let vm = this
      if (!code) {
        return vm.cargoItems
      }
      let tempArr = []
      tempArr = vm.cargoItems.filter(item => {
        return item['node1'] === code
      })
      return tempArr
    },
    loadCargo: function () {
      var vm = this
      let param = {
        categoryId: 'DM_DATAITEM_GROUP124'
      }
      if (vm.id && vm.id !== '0') {
        delete param['isDelete']
      } else {
        param['isDelete'] = 0
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.cargoItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadDepartment: function (query) {
      var vm = this
      let param = {
        categoryId: 'VMA_TRANSACTION_DEPARTMENT'
      }
      param['isDelete'] = 0
      param['portOfAuthority'] = vm.maritimeCode
      if (query) {
        for (var key in query) {
          param[key] = query[key]
        }
      }
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadDataDm', param).then(function (result) {
          vm.departmentItems = result
          resolve(result)
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    loadShipType: function () {
      var vm = this
      let param = {
        categoryId: 'DM_SHIP_TYPE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.shipTypeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadChanelList: function () {
      var vm = this
      let param = {
        categoryId: 'DM_TUYEN_LUONG'
      }
      param['isDelete'] = 0
      param['start'] = -1
      param['end'] = -1
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadDataDm', param).then(function (result) {
          vm.chanelListItems = result
          resolve(result)
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    loadTauRoiCangOut: function () {
      var vm = this
      let data = {
        'id': vm.id
      }
      vm.loadingDetail = true
      vm.$store.dispatch('loadDetailTauRoiCang', data).then(function (result) {
        if (!result.hasOwnProperty('errorCode')) {
          if (result.hasOwnProperty('chanelCodeList')) {
            if (result['chanelCodeList']) {
              if (typeof result['chanelCodeList'] === 'string') {
                result['chanelCodeList'] = result['chanelCodeList'].split(',')
              }
            } else {
              result['chanelCodeList'] = []
            }
          }
          result['shipOwner'] = {
            companyName: result['shipOwnersName'],
            shipOwnerCode: result['shipOwnerCode']
          }
          vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, result)
          // if (result['portGoingToStateName']) {
          //   vm.flagStateOfShipTmp['stateName'] = result['portGoingToStateName']
          // }
          vm.initPort()
          vm.detailTauRoiCang['shipAgency'] = {
            shipAgencyCode: vm.detailTauRoiCang['shipAgencyCode'],
            shipAgencyNameVN: vm.detailTauRoiCang['shipAgencyName']
          }
          vm.loadWarning(Object.assign(vm.detailTauRoiCang, result))
          vm.loadDsHangHoaXD()
          if (result['portHarbourCode']) {
            vm.changeBenCang(result['portHarbourCode'])
          }
        } else {
          vm.detailTauRoiCang = {}
        }
        vm.loadingDetail = false
      }).catch(function (xhr) {
        console.log(xhr)
        vm.loadingDetail = false
      })
    },
    loadTauRoiCang: function () {
      var vm = this
      let data = {
        'id': vm.id
      }
      vm.loadingDetail = true
      vm.loadInitData().then(resultRC => {
        vm.$store.dispatch('loadDetailTauRoiCang', data).then(function (result) {
          if (!result.hasOwnProperty('errorCode')) {
            if (result.hasOwnProperty('chanelCodeList')) {
              if (result['chanelCodeList']) {
                if (typeof result['chanelCodeList'] === 'string') {
                  result['chanelCodeList'] = result['chanelCodeList'].split(',')
                }
              } else {
                result['chanelCodeList'] = []
              }
            }
            result['shipOwner'] = {
              companyName: result['shipOwnersName'],
              shipOwnerCode: result['shipOwnerCode']
            }
            vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, result)
            // if (result['portGoingToStateName']) {
            //   vm.flagStateOfShipTmp['stateName'] = result['portGoingToStateName']
            // }
            vm.initPort()
            vm.loadWarning(Object.assign(vm.detailTauRoiCang, result))
            vm.loadDsHangHoaXD()
            if (result['portHarbourCode']) {
              vm.changeBenCang(result['portHarbourCode'])
            }
          } else {
            vm.detailTauRoiCang = {}
          }
          vm.loadingDetail = false
        }).catch(function (xhr) {
          console.log(xhr)
          vm.loadingDetail = false
        })
      })
    },
    changeBenCang: function (data) {
      var vm = this
      vm.loadPortWharf(data)
    },
    taoGiayPhepRoiCang: function () {
      // this.luuTauDenMarkedAsArrival(3)
      this.$router.push({
        path: '/ho-so/' + this.type + '/' + this.documentName + '/' + this.documentYear + '/' + this.documentTypeCode + '/' + this.documentStatusCode + '/60/0/-1?title=Giấy%20phép%20rời%20cảng'
      })
    },
    loadInitData: function () {
      var vm = this
      return new Promise((resolve, reject) => {
        let param = {
          documentName: vm.documentNameOUT ? vm.documentNameOUT : vm.documentName,
          documentYear: vm.documentYearOUT ? vm.documentYearOUT : vm.documentYear
        }
        vm.$store.dispatch('loadInitData', param).then(function (result) {
          if (!result.hasOwnProperty('errorCode')) {
            if (result.hasOwnProperty('chanelCodeList')) {
              if (result['chanelCodeList']) {
                if (typeof result['chanelCodeList'] === 'string') {
                  result['chanelCodeList'] = result['chanelCodeList'].split(',')
                }
              } else {
                result['chanelCodeList'] = []
              }
            }
            result['shipOwner'] = {
              companyName: result['shipOwnersName'] || vm.itineraryNo['shipOwnerName'],
              shipOwnerCode: result['shipOwnerCode'] || vm.itineraryNo['shipOwnerCode']
            }
            if (!vm.detailTauRoiCang['initFrom']) {
              vm.detailTauRoiCang['initFrom'] = 'P/S'
            }
            if (!vm.detailTauRoiCang['departureShipAgency']) {
              vm.detailTauRoiCang['departureShipAgency'] = result['shipAgencyName']
            }
            if (!vm.detailTauRoiCang['domesticTransportCertificate']) {
              vm.detailTauRoiCang['domesticTransportCertificate'] = 0
            }
            if (!vm.documentName || vm.documentName === '0') {
              result['documentNameOUT'] = result['documentName']
              result['documentYearOUT'] = result['documentYear']
              result['documentTypeCode'] = '---'
              delete result['documentName']
              delete result['documentYear']
            }
            vm.loadWarning(Object.assign(vm.detailTauRoiCang, result))
            if (!vm.detailTauRoiCang['cargoType']) {
              if (result && result['tempCargoItems'] && result['tempCargoItems'].length) {
                vm.detailTauRoiCang['cargoType'] = result['tempCargoItems'][0].cargoType
              }
            }
            console.log('vm.detailTauRoiCang.cargoType***********', vm.detailTauRoiCang['cargoType'])
            delete result['tempCargoItems']
            vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, result)
            if (!vm.detailTauRoiCang['departureShipAgency']) {
              vm.detailTauRoiCang['departureShipAgency'] = result['arrivalShipAgency']
            }
            resolve(vm.detailTauRoiCang)
          } else {
            resolve({})
          }
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    // loadDetailHoSo: function () {
    //   var vm = this
    //   return new Promise(function (resolve, reject) {
    //     let data = {
    //       'documentName': vm.documentName,
    //       'documentYear': vm.documentYear,
    //       'type': vm.type
    //     }
    //     vm.$store.dispatch('loadDetailHoSo', data).then(function (result) {
    //       vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, {
    //         callSign: result['callSign'],
    //         shipName: result['shipName'],
    //         flagStateOfShip: result['stateCode'],
    //         imoNumber: result['imo'],
    //         shipTypeCode: result['shipTypeCode'],
    //         nt: result['nt'],
    //         dwt: result['dwt']
    //       })
    //       vm.tempDocument = result
    //       resolve(result)
    //     }).catch(function (xhr) {
    //       console.log(xhr)
    //       reject(xhr)
    //     })
    //   })
    // },
    setMarkedAsDeparture_ItineraryNo: function (markedAsDeparture) {
      var itineraryNoTmp = this.itineraryNo
      itineraryNoTmp['markedAsDeparture'] = markedAsDeparture
      this.$store.commit('setItineraryNo', itineraryNoTmp)
    },
    luuTauRoiCangMarkedAsDeparture: function (markedAsDeparture) {
      let cf = confirm('Bạn có muốn thực hiện hành động này?')
      if (cf) {
        if (this.$refs.formTauRoiCang.validate()) {
          this.detailTauRoiCang['markedAsDeparture'] = markedAsDeparture
          this.detailTauRoiCang['noticeShipType'] = 2
        }
        if (this.detailTauRoiCang['vmaItineraryScheduleId']) {
          this.luuTauRoiCang()
        } else {
          this.themTauRoiCang()
        }
        this.setMarkedAsDeparture_ItineraryNo(markedAsDeparture)
      }
    },
    capLai: function (markedAsDeparture) {
      var vm = this
      vm.luuTauRoiCangMarkedAsDeparture(markedAsDeparture)
      // vm.loadInitData().then(result => {
      //   vm.luuTauRoiCangMarkedAsDeparture(markedAsDeparture)
      // })
    },
    suaTau: function (markedAsDeparture) {
      var vm = this
      vm.luuTauRoiCangMarkedAsDeparture(markedAsDeparture)
      // vm.loadInitData().then(result => {
        // vm.luuTauRoiCangMarkedAsDeparture(markedAsDeparture)
      // })
    },
    luuTauRoi: function () {
      var vm = this
      if (vm.id && vm.id !== '0' && vm.detailTauRoiCang['vmaItineraryScheduleId'] && vm.detailTauRoiCang['vmaItineraryScheduleId'] !== '0') {
        vm.luuTauRoiCang()
      } else {
        vm.themTauRoiCang()
      }
    },
    addTauRoiCang: function () {
      var vm = this
      vm.loadingBtn = true
      vm.detailTauRoiCang['markedAsDeparture'] = 2
      if (!vm.detailTauRoiCang['vmaItineraryScheduleId']) {
        vm.themTauRoiCang().then(result => {
          vm.loadingBtn = false
          vm.setMarkedAsDeparture_ItineraryNo(2)
        })
      } else {
        vm.luuTauRoiCang().then(result => {
          vm.loadingBtn = false
          vm.setMarkedAsDeparture_ItineraryNo(2)
        })
      }
      // vm.loadInitData().then(result => {
      // })
    },
    loadUnit: function () {
      var vm = this
      let param = {
        dataGroupId: '111'
      }
      param['isDelete'] = 0
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataItems', param).then(function (result) {
        vm.unitCargos = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    stringToArray: function (str) {
      if (!str) {
        return []
      } else if (Array.isArray(str)) {
        return str
      } else {
        return str.split(',')
      }
    },
    addNewShip: function () {
      let query = this.$router.history.current.query
      if (query && query['addNewShip']) {
        return true
      } else {
        return false
      }
    },
    addVmaItinerary: function (model) {
      var vm = this
      return new Promise((resolve, reject) => {
        if (vm.itineraryNo && vm.itineraryNo['itineraryNo']) {
          resolve(vm.itineraryNo)
        } else {
          vm.$store.dispatch('addVmaItinerary', model).then(result => {
            if (result && !result.hasOwnProperty('errorCode')) {
              vm.$store.commit('setItineraryNo', result)
            }
            resolve(result)
          }).catch(xhr => {
            reject(xhr)
          })
        }
      })
    },
    addDanhSachHangHoa: function () {
      var vm = this
      vm.hangHoaItems.push({
        id: vm.hangHoaItems.length + 1,
        idXoa: 0
      })
    },
    removeDanhSachHangHoa: function (item, index) {
      var vm = this
      var x = confirm('Bạn có muốn thực hiện hành động này?')
      if (x) {
        vm.deleteHangHoaXD(item, index)
      } else {
        return false
      }
    },
    deleteHangHoaXD: function (item, index) {
      var vm = this
      let data = {
        vmaScheduleCargolistId: item['vmaScheduleCargolistId']
      }
      vm.$store.dispatch('deleteHangHoaXD', data).then(function (result) {
        if (result && result.hasOwnProperty('errorCode') && result['errorCode']) {
          toastr.error('Xóa thất bại, vui lòng thử lại!')
          toastr.error(result.message)
        } else {
          toastr.success('Xóa thành công!')
          vm.hangHoaItems.splice(index, 1)
        }
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadDsHangHoaXD: function () {
      let vm = this
      if (!vm.detailTauRoiCang['vmaItineraryScheduleId']) {
        console.log('Chưa tạo kế hoạch vào !!!!!!!!!!!!!')
        return
      }
      let param = {
        url: vm.initData['getVmaScheduleCargolistURL'],
        nameOfShip: vm.selectTau ? vm.selectTau['shipName'] : '',
        itineraryNo: vm.itineraryNo['itineraryNo'],
        itineraryScheduleId: vm.detailTauRoiCang['vmaItineraryScheduleId'],
        noticeShipType: 1,
        start: -1,
        end: -1
      }
      vm.$store.dispatch('loadDanhSachTauBien', param).then(function (result) {
        vm.hangHoaItems = result['data'].map(item => {
          item['idXoa'] = 0
          return item
        }) || []
      }).catch(xhr => {
        vm.hangHoaItems = []
      })
    },
    luuThongTinHangHoa: function () {
      let vm = this
      if (!vm.hangHoaItems || !vm.hangHoaItems.length) {
        console.log('ko có hàng hóa!!!!!!!!!!!!!')
        return
      }
      for (var i = 0; i < vm.hangHoaItems.length; i++) {
        vm.luuHangHoaXD(vm.hangHoaItems[i], i)
      }
    },
    kySoHSM () {
      // let vm = this
    },
    luuHangHoaXD: function (item, index) {
      var vm = this
      item['id'] = ''
      item['nameOfShip'] = vm.detailTauRoiCang['nameOfShip']
      item['itineraryNo'] = vm.itineraryNo['itineraryNo']
      item['vmaItineraryId'] = vm.itineraryNo['vmaItineraryId']
      item['portofAuthority'] = vm.maritimeCode
      item['itineraryScheduleId'] = vm.detailTauRoiCang['vmaItineraryScheduleId']
      item['portRegionCode'] = vm.detailTauRoiCang['portRegionCode']
      item['portHarbourCode'] = vm.detailTauRoiCang['portHarbourCode']
      item['portWharfCode'] = vm.detailTauRoiCang['portWharfCode']
      item['noticeShipType'] = 1
      item['quantityOfCargo'] = ''
      let action = ''
      if (!item['vmaScheduleCargolistId']) {
        action = 'addHangHoaXD'
      } else {
        action = 'editHangHoaXD'
      }
      vm.$store.dispatch(action, item).then(function (result) {
        console.log('Thêm hàng hóa xếp dỡ thành công!')
        if (result && !result['errorCode']) {
          item['vmaScheduleCargolistId'] = result['vmaScheduleCargolistId']
        }
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    async themTauRoiCang () {
      var vm = this
      let query = vm.$router.history.current.query
      if (vm.stateAddShipOwner) {
        await vm.addShipOwner(vm)
      }
      if (vm.stateAddShipOperator) {
        await vm.addShipOperator(vm)
      }
      if (vm.stateAddShipAgency) {
        await vm.addShipAgency(vm)
      }
      await vm.checkChangeShipOwner(vm)
      return new Promise((resolve, reject) => {
        vm.loadingBtn = true
        console.log('themTauRoiCang++++++++++++', vm.detailTauRoiCang)
        vm.detailTauRoiCang['id'] = ''
        vm.detailTauRoiCang['noticeShipType'] = 2
        vm.detailTauRoiCang['shipPosition'] = 2
        vm.detailTauRoiCang['shipBoat'] = 'SHIP'
        vm.detailTauRoiCang['quantityOfCargo'] = ''
        vm.detailTauRoiCang['portGoingToStateName'] = vm.flagStateOfShipTmp['stateName']
        vm.detailTauRoiCang['itineraryNo'] = vm.itineraryNo['itineraryNo']
        vm.detailTauRoiCang['vmaItineraryId'] = vm.itineraryNo['vmaItineraryId']
        vm.detailTauRoiCang['nextPortCode'] = vm.detailTauRoiCang['portGoingToCode']
        vm.detailTauRoiCang['portofAuthority'] = vm.maritimeCode
        vm.detailTauRoiCang['maritimeCode'] = vm.maritimeCode
        vm.detailTauRoiCang['unitLOA'] = 'MTR'
        vm.detailTauRoiCang['unitGT'] = 'GT'
        vm.detailTauRoiCang['unitNT'] = 'MTR'
        vm.detailTauRoiCang['unitDWT'] = 'TNE'
        vm.detailTauRoiCang['unitBreadth'] = 'MTR'
        vm.detailTauRoiCang['unitClearanceHeight'] = 'MTR'
        vm.detailTauRoiCang['unitShownDraftxF'] = 'MTR'
        vm.detailTauRoiCang['unitShownDraftxA'] = 'MTR'
        if (!vm.documentName || vm.documentName === '0') {
          vm.detailTauRoiCang['documentTypeCode'] = '---'
        }
        vm.clearData()
        vm.loadingDetail = true
        let addNewShip = vm.addNewShip()
        let data = Object.assign({}, vm.detailTauRoiCang)
        if (addNewShip) {
          data['maritimeCode'] = vm.maritimeCode
          data['shipBoat'] = 'SHIP'
          if (query['isTau200DWT']) {
            data['vrCode'] = 'VR200'
          }
          vm.$store.dispatch('addTauBien', data).then(function (result) {
            vm.$store.commit('setSelectTau', result)
            if (result && !result['errorCode']) {
              delete query['addNewShip']
            }
          })
        }
        // if (vm.tauTrongCang) {
        //   vm.detailTauRoiCang['shipPosition'] = 2
        // } else {
        //   vm.detailTauRoiCang['shipPosition'] = 1
        // }
        vm.detailTauRoiCang['shipPosition'] = 2
        if (!vm.itineraryNo['itineraryNo']) {
          // vm.detailTauRoiCang['shipPosition'] = 2
          vm.detailTauRoiCang['mtgateway'] = 0
          let data = Object.assign({}, vm.detailTauRoiCang)
          data['shipOwnerCode'] = data['shipOwner'] ? data['shipOwner']['shipOwnerCode'] : ''
          data['shipOwnersName'] = data['shipOwner'] ? data['shipOwner']['companyName'] : ''
          data['shipOwnerName'] = data['shipOwner'] ? data['shipOwner']['companyName'] : ''
          data['shipOperatorCode'] = data['shipOperator'] ? data['shipOperator']['shipOwnerCode'] : ''
          data['shipOperatorName'] = data['shipOperator'] ? data['shipOperator']['companyName'] : ''
          data['shipOperatorsName'] = data['shipOperator'] ? data['shipOperator']['companyName'] : ''
          delete data['shipOperator']
          delete data['shipOwner']
          // if ((!vm.documentName || vm.documentName === '0') && vm.detailTauRoiCang['arrivalShipAgency'] && vm.detailTauRoiCang['arrivalShipAgency'].hasOwnProperty('shipAgencyNameVN')) {
          //   data['arrivalShipAgency'] = vm.detailTauRoiCang['arrivalShipAgency']['shipAgencyNameVN']
          // }
          // let addNewShip = vm.addNewShip()
          // if (addNewShip) {
          //   data['maritimeCode'] = vm.maritimeCode
          //   data['shipBoat'] = 'SHIP'
          //   data['shipName'] = data['nameOfShip']
          //   if (query['isTau200DWT']) {
          //     data['vrCode'] = 'VR200'
          //   }
          //   vm.$store.dispatch('addTauBien', data).then(function (result) {
          //     vm.$store.commit('setSelectTau', result)
          //     if (result && !result['errorCode']) {
          //       delete query['addNewShip']
          //     }
          //   })
          // }
          if (query['isTau200DWT']) {
            data['vrCode'] = 'VR200'
          }
          if (!vm.documentName || vm.documentName === '0') {
            data['departureShipAgency'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            data['departureShipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            data['shipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            data['shipAgencyName'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            vm.detailTauRoiCang['shipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            vm.detailTauRoiCang['shipAgencyName'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            delete data['shipAgency']
          }
          vm.addVmaItinerary(data).then(resultItinerary => {
            vm.detailTauRoiCang['itineraryNo'] = resultItinerary['itineraryNo']
            vm.detailTauRoiCang['vmaItineraryId'] = resultItinerary['vmaItineraryId'] || 0
            data['itineraryNo'] = resultItinerary['itineraryNo']
            data['vmaItineraryId'] = resultItinerary['vmaItineraryId']
            vm.$store.dispatch('addVmaItinerarySchedule', data).then(function (result) {
              if (result && !result.hasOwnProperty('errorCode')) {
                vm.detailTauRoiCang['vmaItineraryScheduleId'] = result['vmaItineraryScheduleId']
                if (result.hasOwnProperty('chanelCodeList')) {
                  if (result['chanelCodeList']) {
                    if (typeof result['chanelCodeList'] === 'string') {
                      result['chanelCodeList'] = result['chanelCodeList'].split(',')
                    }
                  } else {
                    result['chanelCodeList'] = []
                  }
                }
                vm.$store.commit('setItineraryNo', resultItinerary || {})
                vm.changeIdUrl(result['vmaItineraryScheduleId'], {
                  itineraryNo: resultItinerary['itineraryNo'],
                  ...query
                })
                toastr.success('Thêm thành công!')
                setTimeout(function () {
                  vm.luuHoaTieu()
                  vm.luuTauLai()
                  vm.luuNhapTachDoan()
                  if (!vm.documentName || vm.documentName === '0') {
                    vm.luuThongTinHangHoa()
                  }
                }, 350)
              } else {
                toastr.error('Thêm thất bại, vui lòng thử lại!')
                toastr.error(result.message)
              }
              vm.loadingBtn = false
              vm.loadingDetail = false
            }).catch(function (xhr) {
              console.log(xhr)
              toastr.error('Thêm thất bại, vui lòng thử lại!')
              vm.loadingBtn = false
              vm.loadingDetail = false
            })
          })
        } else {
          let data = Object.assign({}, vm.detailTauRoiCang)
          data['shipOwnerCode'] = data['shipOwner'] ? data['shipOwner']['shipOwnerCode'] : ''
          data['shipOwnersName'] = data['shipOwner'] ? data['shipOwner']['companyName'] : ''
          data['shipOwnerName'] = data['shipOwner'] ? data['shipOwner']['companyName'] : ''
          data['shipOperatorCode'] = data['shipOperator'] ? data['shipOperator']['shipOwnerCode'] : ''
          data['shipOperatorName'] = data['shipOperator'] ? data['shipOperator']['companyName'] : ''
          data['shipOperatorsName'] = data['shipOperator'] ? data['shipOperator']['companyName'] : ''
          delete data['shipOperator']
          delete data['shipOwner']
          // let addNewShip = vm.addNewShip()
          // if (query['isTau200DWT']) {
          //   data['vrCode'] = 'VR200'
          // }
          // if (addNewShip) {
          //   data['maritimeCode'] = vm.maritimeCode
          //   data['shipBoat'] = 'SHIP'
          //   vm.$store.dispatch('addTauBien', data).then(function (result) {
          //     vm.$store.commit('setSelectTau', result)
          //     if (result && !result['errorCode']) {
          //       delete query['addNewShip']
          //     }
          //   })
          // }
          // if ((!vm.documentName || vm.documentName === '0') && vm.detailTauRoiCang['departureShipAgency'] && vm.detailTauRoiCang['departureShipAgency'].hasOwnProperty('shipAgencyNameVN')) {
          //   data['departureShipAgency'] = vm.detailTauRoiCang['departureShipAgency']['shipAgencyNameVN']
          // }
          if (!vm.documentName || vm.documentName === '0') {
            data['departureShipAgency'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            data['departureShipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            data['shipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            data['shipAgencyName'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            vm.detailTauRoiCang['shipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            vm.detailTauRoiCang['shipAgencyName'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            delete data['shipAgency']
          }
          vm.$store.dispatch('addVmaItinerarySchedule', data).then(function (result) {
            if (result && !result.hasOwnProperty('errorCode')) {
              vm.detailTauRoiCang['vmaItineraryScheduleId'] = result['vmaItineraryScheduleId']
              if (result.hasOwnProperty('chanelCodeList')) {
                if (result['chanelCodeList']) {
                  if (typeof result['chanelCodeList'] === 'string') {
                    result['chanelCodeList'] = result['chanelCodeList'].split(',')
                  }
                } else {
                  result['chanelCodeList'] = []
                }
              }
              // vm.luuNhapTachDoan()
              vm.luuHoaTieu()
              vm.luuTauLai()
              // vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, result)
              let query = vm.$router.history.current.query
              vm.changeIdUrl(result['vmaItineraryScheduleId'], {
                ...query,
                itineraryNo: vm.itineraryNo['itineraryNo']
              })
              vm.luuNhapTachDoan()
              if (!vm.documentName || vm.documentName === '0') {
                vm.luuThongTinHangHoa()
              }
              toastr.success('Thêm thành công!')
            } else {
              toastr.error('Thêm thất bại, vui lòng thử lại!')
              toastr.error(result.message)
            }
            vm.loadingBtn = false
            vm.loadingDetail = false
            resolve(result)
          }).catch(function (xhr) {
            console.log(xhr)
            vm.loadingBtn = false
            vm.loadingDetail = false
            reject(xhr)
          })
        }
      })
    },
    deleteTauRoiCang: function () {
      var vm = this
      let data = {
        vmaItineraryScheduleId: vm.id
      }
      let cf = confirm('Bạn có muốn xóa!')
      if (cf) {
        vm.loadingBtn = true
        vm.loadingDetail = true
        this.detailTauRoiCang['markedAsDeparture'] = 1
        this.setMarkedAsDeparture_ItineraryNo(1)
        vm.luuTauRoiCang().then(result => {
          vm.$store.dispatch('deleteTauRoiCang', data).then(function (result) {
            if (result && result.hasOwnProperty('errorCode') && result['errorCode']) {
              toastr.error('Xóa thất bại, vui lòng thử lại!')
              toastr.error(result.message)
            } else {
              toastr.success('Xóa thành công!')
              vm.quayLai()
            }
            vm.changeIdUrl('0')
            vm.loadingDetail = false
            vm.loadingBtn = false
          }).catch(function (xhr) {
            console.log(xhr)
            vm.loadingDetail = false
            vm.loadingBtn = false
          })
        })
      } else {
        vm.loadingDetail = false
      }
    },
    lamMoi: function () {
      var vm = this
      vm.detailTauRoiCang = {}
    },
    activeForm: function () {
      var vm = this
      vm.disabledForm = false
    },
    clearData: function () {
      let vm = this
      delete vm.detailTauRoiCang['markedAsArrival']
      delete vm.detailTauRoiCang['lastPortCode']
      delete vm.detailTauRoiCang['timeOfArrival']
      delete vm.detailTauRoiCang['arrivalShipAgencyCode']
      delete vm.detailTauRoiCang['arrivalShipAgency']
      delete vm.detailTauRoiCang['arrivalShipAgency']
      delete vm.detailTauRoiCang['tempCargoItems']
    },
    async luuTauRoiCang () {
      var vm = this
      if (vm.$refs.formTauRoiCang.validate()) {
        if (vm.stateAddShipOwner) {
          await vm.addShipOwner(vm)
        }
        if (vm.stateAddShipOperator) {
          await vm.addShipOperator(vm)
        }
        if (vm.stateAddShipAgency) {
          await vm.addShipAgency(vm)
        }
        await vm.checkChangeShipOwner(vm)
      }
      return new Promise((resolve, reject) => {
        vm.loadingBtn = true
        if (vm.$refs.formTauRoiCang.validate()) {
          vm.loadingDetail = true
          vm.detailTauRoiCang['noticeShipType'] = 2
          vm.detailTauRoiCang['quantityOfCargo'] = ''
          vm.detailTauRoiCang['itineraryNo'] = vm.itineraryNo['itineraryNo']
          vm.detailTauRoiCang['nextPortCode'] = vm.detailTauRoiCang['portGoingToCode']
          vm.detailTauRoiCang['vmaItineraryId'] = vm.itineraryNo['vmaItineraryId']
          vm.detailTauRoiCang['portofAuthority'] = vm.maritimeCode
          vm.detailTauRoiCang['portGoingToStateName'] = vm.flagStateOfShipTmp['stateName']
          vm.detailTauRoiCang['unitLOA'] = 'MTR'
          vm.detailTauRoiCang['unitGT'] = 'GT'
          vm.detailTauRoiCang['unitNT'] = 'MTR'
          vm.detailTauRoiCang['unitDWT'] = 'TNE'
          vm.detailTauRoiCang['unitBreadth'] = 'MTR'
          vm.detailTauRoiCang['unitClearanceHeight'] = 'MTR'
          vm.detailTauRoiCang['unitShownDraftxF'] = 'MTR'
          vm.detailTauRoiCang['maritimeCode'] = vm.maritimeCode
          if (!vm.documentName || vm.documentName === '0') {
            vm.detailTauRoiCang['documentTypeCode'] = '---'
          }
          vm.clearData()
          let data = Object.assign({}, vm.detailTauRoiCang)
          data['shipOwnerCode'] = data['shipOwner'] ? data['shipOwner']['shipOwnerCode'] : ''
          data['shipOwnersName'] = data['shipOwner'] ? data['shipOwner']['companyName'] : ''
          data['shipOwnerName'] = data['shipOwner'] ? data['shipOwner']['companyName'] : ''
          if (!vm.documentName || vm.documentName === '0') {
            data['departureShipAgency'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            data['departureShipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            data['shipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            data['shipAgencyName'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            vm.detailTauRoiCang['shipAgencyCode'] = data['shipAgency'] ? data['shipAgency']['shipAgencyCode'] : ''
            vm.detailTauRoiCang['shipAgencyName'] = data['shipAgency'] ? data['shipAgency']['shipAgencyNameVN'] : ''
            delete data['shipAgency']
          }
          vm.$store.dispatch('updateVmaItinerarySchedule', data).then(function (result) {
            if (result && !result.hasOwnProperty('errorCode')) {
              vm.detailTauRoiCang['vmaItineraryScheduleId'] = result['vmaItineraryScheduleId']
              if (result.hasOwnProperty('chanelCodeList')) {
                if (result['chanelCodeList']) {
                  if (typeof result['chanelCodeList'] === 'string') {
                    result['chanelCodeList'] = result['chanelCodeList'].split(',')
                  }
                } else {
                  result['chanelCodeList'] = []
                }
              }
              vm.luuHoaTieu()
              vm.luuTauLai()
              vm.luuNhapTachDoan()
              if (!vm.documentName || vm.documentName === '0') {
                vm.luuThongTinHangHoa()
              }
              // vm.detailTauRoiCang = Object.assign(vm.detailTauRoiCang, result)
              toastr.success('Lưu thành công!')
            } else {
              toastr.error('Lưu thất bại, vui lòng thử lại!')
              toastr.error(result.message)
            }
            vm.loadingBtn = false
            vm.loadingDetail = false
            resolve(result)
          }).catch(function (xhr) {
            console.log(xhr)
            vm.loadingBtn = false
            vm.loadingDetail = false
            reject(xhr)
          })
        } else {
          vm.loadingBtn = false
          resolve({})
        }
      })
    },
    parseTimeTau: function (modelTauRoi) {
      var vm = this
      if (!modelTauRoi) {
        console.log('valid tau den', modelTauRoi)
        return
      }
      modelTauRoi['timeOfDeparture'] = vm.parseTimeStamp(modelTauRoi['timeOfDeparture'])
      modelTauRoi['timeOfPORTArrival'] = vm.parseTimeStamp(modelTauRoi['timeOfPORTArrival'])
      return modelTauRoi
    },
    parseTimeStamp: function (time) {
      var resultTime = ''
      if (!time) {
        console.log('valid time!', time)
        return
      }
      if (typeof time === 'string') {
        time = parseInt(time)
      }
      var date = new Date(time)
      resultTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
      return resultTime
    },
    changeIdUrl: function (id, query) {
      var vm = this
      if (vm.documentName) {
        vm.$router.push({
          path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.code + '/' + id
        })
      } else if (vm.code === 'TauTrongCangKeHoachDen' || vm.code === 'TauTrongCangKeHoachDenPTTND') {
        vm.$router.push({
          path: '/tra-cuu/' + vm.type + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.code + '' + id,
          query: query || {}
        })
      } else {
        let path = vm.$router.history.current.path
        if (path.indexOf('tau-moi') !== -1) {
          vm.$router.push({
            path: '/tau-moi/ke_hoach/0/0/' + id + '/' + vm.code + '/detail',
            query: query || {}
          })
        } else if (path.indexOf('quan-ly-tau-bien') !== -1) {
          vm.$router.push({
            path: '/quan-ly-tau-bien/' + vm.type + '/0/0/' + vm.code + '/' + id,
            query: query || {}
          })
        } else {
          vm.$router.push({
            path: '/tau-bien/' + vm.type + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + id + '/' + vm.code + '/detail',
            query: query || {}
          })
        }
      }
    },
    inGiayPhep: function (print) {
      let vm = this
      vm.$store.dispatch('yeuCauGiayPhepVaoRoiExport', {
        itineraryNo: vm.itineraryNo['itineraryNo'],
        noticeShipType: 2,
        printing: print
      }).then(result => {
        if (result) {
          window.open(result, '_blank')
        } else {
          toastr.error('Không tìm thấy file!')
        }
      })
    },
    // inGiayPhep: function () {
    //   let vm = this
    //   vm.$store.dispatch('vmaItineraryScheduleExport', {
    //     itineraryNo: vm.itineraryNo['itineraryNo'],
    //     noticeShipType: 2
    //   }).then(result => {
    //     if (result) {
    //       window.open(result, '_blank')
    //     } else {
    //       toastr.error('Không tìm thấy file!')
    //     }
    //   })
    // },
    quayLai: function () {
      var vm = this
      let query = vm.$router.history.current.query
      if (vm.documentName && vm.documentName !== '0') {
        if (vm.code === 'DanhSachTauDenCang' || vm.code === 'DanhSachTauDiChuyen') {
          window.history.back()
        } else {
          vm.$router.push({
            path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.code,
            query: {
              ...query
            }
          })
        }
      } else {
        window.history.back()
        // var path = vm.$router.history.current.path
        // if (path.indexOf('/tau-bien') !== -1) {
        //   vm.$router.push({
        //     path: '/tau-bien/' + vm.type + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.idPT + '/' + vm.code + '/table'
        //   })
        // } else {
        //   vm.$router.push({
        //     path: '/quan-ly-tau-bien/' + vm.type + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.code
        //   })
        // }
      }
    }
  }

}
</script>

