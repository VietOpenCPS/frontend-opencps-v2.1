<template>
  <div style="width: 100%; background: #fff; position: relative;" class="extFormXuLy">
    <v-flex xs12 style="background: #e6e1e1;">
      <v-layout row wrap >
        <div class="row-header" style="height: 38px;overflow: hidden;">
          <div class="background-triangle-big view_tp_pdf"> Kế hoạch tàu di chuyển </div>
          <div class="layout row wrap header_tools row-blue">

            <div class="flex solo text-ellipsis" v-if="documentName && documentName !== '0'">

              <span class="font-regulal">
                <span @click="showWarning = !showWarning" slot="activator" style="cursor: pointer; color: orange;" v-if="warningTauDiChuyen['show']" color="warning">(Cảnh báo)
                </span>

                {{detailHs.shipName}}
              </span> | <span class="red--text text--darken-3">#</span>
              <span class="font-regulal">{{detailHs.callSign}}</span> &nbsp;
              <span class="font-regulal" style="font-weight: bold; color: rgb(35, 114, 187);">{{detailHs['documentName']}} </span>&nbsp;|&nbsp;
              <span style="color: rgb(35, 114, 187);" v-if="detailHs['documentName']">{{supportData.docType[detailHs['documentTypeCode']]}}</span>
              <span v-if="detailHsOther['documentName']" class="font-regulal" style="font-weight: bold; color: rgb(35, 114, 187);">&nbsp;/&nbsp;{{detailHsOther['documentName']}} &nbsp;|&nbsp;</span>
              <span style="color: rgb(35, 114, 187);" v-if="detailHsOther['documentName']">{{supportData.docType[detailHsOther['documentTypeCode']]}}</span>
            </div>
            <div class="flex text-right" style="margin-left: auto;" v-if="!documentName || documentName === '0'">
              <span class="font-regulal" style="font-weight: bold;color: #2372bb;">  </span>
              <v-btn
                :disabled="loadingDetail"
                v-if="!id || id === '0'"
                small
                flat
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="addTauDiChuyen()"
              >
                <v-icon size="17">file_copy</v-icon>Lưu
              </v-btn>

              <v-btn
                :disabled="loadingDetail"
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 1 || detailTauDiChuyen['requestState'] === '1')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauDiChuyen()"
              >
                <v-icon size="17">save</v-icon>Lưu
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 1 || detailTauDiChuyen['requestState'] === '1')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xacNhanTauDiChuyen()"
              >
                <v-icon size="20">confirmation_number</v-icon>Xác nhận
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="goBoTauDiChuyen()"
              >
                <v-icon size="20">confirmation_number</v-icon>Gỡ bỏ
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4') && type === 'lanh_dao'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="kySoHSM()"
              >
                <v-icon size="20">confirmation_number</v-icon>Ký số HSM
              </v-btn>

              <v-btn
                v-if="detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4'"
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
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="huyTauDiChuyen()"
              >
                <v-icon size="20">confirmation_number</v-icon>Hủy
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
                v-if="id && id !== '0' && detailTauDiChuyen['requestState'] !== 1 && detailTauDiChuyen['requestState'] !== 6"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="inLenhDD()"
                >
                <v-icon size="20" color="red">print</v-icon>In LĐĐ
              </v-btn>

              <v-btn
                v-if="id && id !== '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xemTruocLenhDD()"
                >
                Xem trước LĐĐ
              </v-btn>

              <v-btn
                v-if="id && id !== '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="deleteTauDiChuyen()"
                >
                <v-icon size="20" color="red">close</v-icon>Xóa
              </v-btn>

              <v-btn
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="quaylai()"
              >
                <v-icon size="17">reply</v-icon>Quay lại
              </v-btn>
            </div>

            <!-- <div class="flex text-right" style="margin-left: auto;" v-else-if="itineraryNo['markedAsArrival'] !== 6 && itineraryNo['markedAsArrival'] >= 1 || itineraryNo['markedAsDeparture'] !== 6 && itineraryNo['markedAsDeparture'] >= 1 || itineraryNo['markedAsTransmit'] !== 6 && itineraryNo['markedAsTransmit'] >= 1 || itineraryNo['markedAsVoyage'] !== 6  && itineraryNo['markedAsVoyage'] >= 1 "> -->

            <div class="flex text-right" style="margin-left: auto;" v-else>
              <span class="font-regulal" style="font-weight: bold;color: #2372bb;">  </span>
              <v-btn
                :disabled="loadingDetail"
                v-if="!id || id === '0'"
                small
                flat
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="addTauDiChuyen()"
              >
                <v-icon size="17">file_copy</v-icon>Lưu
              </v-btn>

              <v-btn
                :disabled="loadingDetail"
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 1 || detailTauDiChuyen['requestState'] === '1')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="luuTauDiChuyen()"
              >
                <v-icon size="17">save</v-icon>Lưu
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 1 || detailTauDiChuyen['requestState'] === '1')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xacNhanTauDiChuyen()"
              >
                <v-icon size="20">confirmation_number</v-icon>Xác nhận
              </v-btn>

              <v-btn
                v-if="detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4'"
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
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="goBoTauDiChuyen()"
              >
                <v-icon size="20">confirmation_number</v-icon>Gỡ bỏ
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4') && type === 'lanh_dao'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="kySoHSM()"
              >
                <v-icon size="20">confirmation_number</v-icon>Ký số HSM
              </v-btn>

              <v-btn
                v-if="id && id !== '0' && (detailTauDiChuyen['requestState'] === 4 || detailTauDiChuyen['requestState'] === '4')"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="huyTauDiChuyen()"
              >
                <v-icon size="20">confirmation_number</v-icon>Hủy
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
                v-if="id && id !== '0' && detailTauDiChuyen['requestState'] !== 1 && detailTauDiChuyen['requestState'] !== 6"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="inLenhDD()"
                >
                <v-icon size="20" color="red">print</v-icon>In LĐĐ
              </v-btn>

              <v-btn
                v-if="id && id !== '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="xemTruocLenhDD()"
                >
                Xem trước KHĐĐ
              </v-btn>

              <v-btn
                v-if="id && id !== '0'"
                flat
                small
                class="mx-0 my-0"
                style="text-transform: none; color: #007bff; font-weight: normal;"
                @click="deleteTauDiChuyen()"
                >
                <v-icon size="20" color="red">close</v-icon>Xóa
              </v-btn>

            </div>
          </div>
        </div>
      </v-layout>
    </v-flex>

    <v-flex xs12 sm12 style="border-bottom: 1px solid #ccc; padding: 0 20px;">
      <v-slide-y-transition>
        <div v-if="showWarning">
          <div v-for="(item, index) in warningTauDiChuyen['message']">
            - <label style="color: #FFBB3D">{{item}}</label>
          </div>
        </div>
      </v-slide-y-transition>
    </v-flex>
    <v-progress-linear v-if="loadingDetail" :indeterminate="true"></v-progress-linear>
    <v-form
      v-if="itineraryNo['markedAsArrival'] !== 0"
      ref="formTauDiChuyen"
      :style="{'opacity': loadingDetail ? '0.6' : 1, 'pointer-events': loadingDetail ? 'none' : 'auto'}"
      :disabled="loadingDetail"
      v-model="validFormTauDiChuyen"
      lazy-validation
      class="mt-2"
   >
      <v-flex xs12 d-flex>
        <v-layout row wrap>
          <v-flex xs6 class="pr-1">

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Số lệnh điều động: <label style="color: red;">*</label></label></v-flex>
              <v-flex xs9 class="">
                <v-text-field class="py-0 my-0"
                required
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                placeholder="Nhập số lệnh điều động"
                v-model="detailTauDiChuyen['certificateNo']"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="pl-2"><label>Thời gian di chuyển:</label> <label style="color: red;">*</label></v-flex>
              <v-flex xs9>
                <datetime-picker
                v-model="detailTauDiChuyen['shiftingDate']"
                :first-day="1"
                :show-dst="false"
                :show-hours="true"
                :show-minutes="true"
                :show-seconds="false"
                class="mx-0 my-0"
                ></datetime-picker>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>Thời gian kết thúc di chuyển:</label></v-flex>
              <v-flex xs9>
                <datetime-picker
                v-model="detailTauDiChuyen['timeOfDeparture']"
                :first-day="1"
                :show-dst="false"
                :show-hours="true"
                :show-minutes="true"
                :show-seconds="false"
                class="mx-0 my-0"
                ></datetime-picker>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Đại lý:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="shipAgencyItems"
                item-text="shipAgencyNameVN"
                item-value="shipAgencyCode"
                v-model="detailTauDiChuyen['taxCodeOfShipownersAgents']"
                class="py-0 my-0"
                placeholder="Chọn đại lý"
                ></v-select>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Tên đại lý/ người làm thủ tục:</label></v-flex>
              <v-flex xs9>
                <v-text-field clearable class="py-0 my-0" v-model="detailTauDiChuyen['nameOfShipownersAgents']"
                ></v-text-field>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Từ bến:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="portHarbourTuItems"
                item-text="portHarbourNameVN"
                item-value="portHarbourCode"
                v-model="detailTauDiChuyen['anchoringPortHarbourCode']"
                class="py-0 my-0"
                placeholder="Từ bến"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Từ vị trí <label style="color: red;">*</label>:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="portWharfTuVTItems"
                item-text="portWharfNameVN"
                item-value="portWharfCode"
                v-model="detailTauDiChuyen['anchoringPortWharfCode']"
                class="py-0 my-0"
                placeholder="Từ vị trí"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Đến bến:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="portHarbourDenItems"
                item-text="portHarbourNameVN"
                item-value="portHarbourCode"
                v-model="detailTauDiChuyen['shiftingPortHarbourCode']"
                class="py-0 my-0"
                placeholder="Đến bến"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Đến vị trí <label style="color: red;">*</label>:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="portWharfDenVTItems"
                item-text="portWharfNameVN"
                item-value="portWharfCode"
                v-model="detailTauDiChuyen['shiftingPortWharfCode']"
                class="py-0 my-0"
                placeholder="Đến vị trí"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Cập mạn vào tàu:</label></v-flex>
              <v-flex xs9>
                <v-text-field class="py-0 my-0" placeholder="Cập mạn tàu"  v-model="detailTauDiChuyen['mergedShip']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Mục đích di chuyển:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="purposeItems"
                item-text="purposeNameVN"
                item-value="purposeCode"
                v-model="detailTauDiChuyen['purposeCode']"
                class="py-0 my-0"
                placeholder="Chọn mục đích"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Lý do điều động:</label></v-flex>
              <v-flex xs9>
                <v-text-field clearable class="py-0 my-0" multi-line rows="2" v-model="detailTauDiChuyen['reasonToShift']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Hàng hóa:</label></v-flex>
              <v-flex xs9>
                <v-select
                clearable
                autocomplete
                :items="cargoItems"
                item-text="name"
                item-value="code0"
                v-model="detailTauDiChuyen['cargoCode']"
                class="py-0 my-0"
                placeholder="Chọn hàng hóa"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Mớn nước mũi (m):</label></v-flex>
              <v-flex xs2 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['shownDraftxF']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Mớn nước lái (m):</label></v-flex>
              <v-flex xs2 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['shownDraftxA']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Số thuyền viên:</label></v-flex>
              <v-flex xs2 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['crewNumber']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Số hành khách  :</label></v-flex>
              <v-flex xs2 class="pb-1">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['passengerNumber']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="0">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Tuyến luồng:</label></v-flex>
              <v-flex xs9 class="">
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
                v-model="detailTauDiChuyen.chanelCodeList"
                class="py-0 my-0"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Đơn vị:</label></v-flex>
              <v-flex xs9 class="">
                <v-select
                autocomplete
                :max-height="270"
                :items="departmentItems"
                item-text="departmentName"
                item-value="departmentCode"
                v-model="detailTauDiChuyen['departmentCode']"
                class="py-0 my-0"
                placeholder="Chọn đơn vị"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1" v-if="type === 'lanh_dao'">
            <v-flex xs3 class="px-2">Người ký <span style="color: red;">(*)</span>:</v-flex>
            <v-flex xs9 class>
              <v-select
              v-model="detailTauDiChuyen['representative']"
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
              <v-flex xs3 class="px-2"><label>Ghi chú:</label></v-flex>
              <v-flex xs9 class="">
                <v-text-field clearable class="py-0 my-0" multi-line rows="3" v-model="detailTauDiChuyen['remarks']"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- -------------------- -->
          </v-flex>

          <v-flex xs6 class="px-2">

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Tàu:</label> <label style="color: red;">*</label></v-flex>
              <v-flex xs9 class="">
                <v-text-field clearable  placeholder="Nhập tàu" :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" v-model="detailTauDiChuyen.nameOfShip"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Quốc tịch:</label></v-flex>
              <v-flex xs9 class="">
                <v-select
                placeholder="Chọn quốc tịch"
                :items="flagStateOfShipItems"
                item-text="stateName"
                item-value="stateCode"
                v-model="detailTauDiChuyen.flagStateOfShip"
                class="py-0 my-0"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']"
                clearable
                autocomplete
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Hô hiệu:</label></v-flex>
              <v-flex xs9 class="">
                <v-text-field clearable  placeholder="Nhập hô hiệu"  v-model="detailTauDiChuyen.callSign"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Số IMO:</label></v-flex>
              <v-flex xs9 class="">
                <v-text-field clearable  placeholder="Nhập số IMO"  v-model="detailTauDiChuyen.imoNumber"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Loại tàu:</label></v-flex>
              <v-flex xs9 class="">
                <v-select
                clearable
                autocomplete
                :items="shipTypeItems"
                item-text="shipTypeNameVN"
                item-value="shipTypeCode"
                v-model="detailTauDiChuyen.shipTypeCode"
                class="py-0 my-0"
                placeholder="Chọn loại tàu"
                ></v-select>
              </v-flex>
            </v-layout> -->

            <v-layout row wrap v-if="detailTauDiChuyen['vrCode'] && detailTauDiChuyen['vrCode'].indexOf('VR-SB') !== -1">
              <v-flex xs12 sm3 class="pt-1">
                <span>Loại tàu <!-- (Agent) -->:</span>
              </v-flex>
              <v-flex xs12 sm9>
                <v-select
                autocomplete
                :items="shipTypeItems"
                item-text="shipTypeName"
                item-value="shipTypeCode"
                :max-height="270"
                v-model="detailTauDiChuyen['shipTypeCode']"
                class="py-0 my-0"
                placeholder="Chọn loại tàu"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap v-else>
              <v-flex xs12 sm3 class="pt-1 px-2">
                <span>Loại tàu <!-- (Agent) -->:</span>
              </v-flex>
              <v-flex xs12 sm9>
                <v-select
                autocomplete
                :items="shipTypeItems"
                item-text="shipTypeNameVN"
                item-value="shipTypeCode"
                :max-height="270"
                v-model="detailTauDiChuyen['shipTypeCode']"
                class="py-0 my-0"
                placeholder="Chọn loại tàu"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Cấp độ an ninh:</label></v-flex>
              <v-flex xs9 class="">
                <v-select
                clearable
                autocomplete
                :items="securityLevelItems"
                item-text="securityLevelName"
                item-value="securityLevelCode"
                v-model="detailTauDiChuyen.securityLevelCode"
                class="py-0 my-0"
                placeholder="Chọn cấp độ an ninh"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Chủ tàu:</label></v-flex>
              <v-flex xs9 class="">
                <v-select
                clearable
                autocomplete
                :items="shipOwnersItems"
                item-text="companyName"
                item-value="shipOwnerCode"
                :max-height="270"
                v-model="detailTauDiChuyen['shipOwnerCode']"
                class="py-0 my-0"
                placeholder="Chọn tên chủ tàu"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs3 class="px-2"><label>Người khai thác:</label></v-flex>
              <v-flex xs9 class="">
                <v-select
                clearable
                autocomplete
                :items="shipOperatorItems"
                item-text="companyName"
                item-value="shipOwnerCode"
                :max-height="270"
                v-model="detailTauDiChuyen['shipOperatorCode']"
                class="py-0 my-0"
                placeholder="Chọn người khai thác"
                ></v-select>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>NT:</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['nt']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>GT:</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['gt']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>


            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>DWT:</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['dwt']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>Breadth (m):</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['breadth']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>LOA (m):</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['loa']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>Mớn nước t.kế (m):</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['maxDraft']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>Chiều cao t.không (m):</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['clearanceHeight']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="pb-1">
              <v-flex xs3 class="px-2"><label>Công suất máy:</label></v-flex>
              <v-flex xs2 class="">
                <input-number class="my-0 py-0" v-model="detailTauDiChuyen['power']" required :rules="[v => !!v || 'Trường dữ liệu bắt buộc phải nhập']" :step="1000" type="currency" :decimals="2">
                </input-number>
              </v-flex>
            </v-layout>

          </v-flex>
        </v-layout>
      </v-flex>
    </v-form>

    
  </div>

</template>

<script>
// import axios from 'axios'
import DatetimePicker from '../DatetimePicker.vue'
import NumberInput from '@/components/hang_hai/Detail_hang_hai/NumberInput.vue'
import {VMoney} from 'v-money'
import toastr from 'toastr'
// import print from 'print-js'
// import {eventBus} from '../../../event-bus/eventBus.js'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
import supportData from '../../../store/support_data.json'
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
    loadingBtn: false,
    supportData: supportData,
    loadingDetail: false,
    showWarning: true,
    errorsMessage: {},
    disabledForm: false,
    warningTauDiChuyen: {
      show: false,
      message: []
    },
    formatClearanceHeight: {
      decimal: '.',
      thousands: ',',
      prefix: '',
      suffix: '',
      precision: 1,
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
    portItems: [],
    portWharfTuVTItems: [],
    portWharfDenVTItems: [],
    cargoItems: [],
    chanelListItems: [],
    securityLevelItems: [],
    homeValue: 350000,
    detailTauDiChuyen: {
      vrCode: '',
      reasonToShift: '',
      remarks: '',
      purposeCode: '',
      expiredDate: '',
      anchoringPortHarbourCode: '',
      shiftingPortHarbourCode: ''
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
    validFormTauDiChuyen: true,
    shipTypeItems: [],
    representativeItems: [],
    flagStateOfShipItems: [],
    purposeItems: [],
    portMaritimeItems: [],
    portHarbourTuItems: [],
    portHarbourDenItems: [],
    shipAgencyItems: [],
    shipOwnersItems: [],
    shipOperatorItems: [],
    departmentItems: [],
    detailHs: {},
    detailHsOther: {},
    documentTypeCodeOther: ''
  }),
  watch: {
    // notification (notification) {
    //   this.detailTauDiChuyen = notification
    // }
    'detailTauDiChuyen.purposeCode' (val) {
      let vm = this
      if (val) {
        let item = vm.purposeItems.find(item => {
          return item.purposeCode === val
        })
        if (item) {
          vm.detailTauDiChuyen['reasonToShift'] = item['purposeNameVN']
        }
      }
    },
    'detailTauDiChuyen.vrCode' (val) {
      let vm = this
      if (val && val.indexOf('VR-SB') !== -1) {
        vm.loadShipType('DM_VMA_SHIP_TYPE')
      } else {
        vm.loadShipType()
      }
    },
    pttnd () {
      return this.$store.getters.pttnd
    },
    selectPTTND (val) {
      if (val) {
        this.initDataPTTND()
      }
    },
    'detailTauDiChuyen.anchoringPortHarbourCode' (val) {
      if (val) {
        this.changeBenCang(val, 'anchoringPortHarbourCode')
      }
    },
    'detailTauDiChuyen.shiftingPortHarbourCode' (val) {
      if (val) {
        this.changeBenCang(val, 'shiftingPortHarbourCode')
      }
    },
    documentName (val) {
      var vm = this
      if (val && val !== '0') {
        if (!vm.id || vm.id === '0') {
          vm.disabledForm = true
        }
      }
    },
    id: function (newVal, oldVal) {
      var vm = this
      if (newVal && newVal !== '0' && String(vm.detailTauDiChuyen['vmaScheduleShiftingId']) !== String(newVal)) {
        if (vm.documentName && vm.documentName !== '0') {
          vm.loadTauDiChuyen()
        } else {
          vm.loadTauDiChuyenOut()
        }
      }
    }
  },
  computed: {
    selectTau () {
      return this.$store.getters.selectTau
    },
    totalTauDiChuyen () {
      return this.$store.getters.totalTauDiChuyen
    },
    selectPTTND () {
      return this.$store.getters.selectPTTND
    },
    maritimeCode () {
      return this.$store.getters.maritimeCode
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
    }
  },
  created () {
    var vm = this
    vm.$store.dispatch('loadInitResource').then(resInit => {
      if (vm.documentName && vm.documentName !== '0') {
        if (!vm.id || vm.id === '0') {
          vm.disabledForm = true
        }
      }
      let query = vm.$router.history.current.query
      vm.loadUserSigns()
      if (vm.documentName && vm.documentName !== '0' && !query['itineraryNo']) {
        vm.$store.dispatch('loadItineraryNo', {
          documentName: vm.documentName,
          documentYear: vm.documentYear
        }).then(resultItineraryNo => {
          if (resultItineraryNo['documentNameIN'] && resultItineraryNo['documentYearIN']) {
            vm.loadDetailHs(resultItineraryNo['documentNameIN'], resultItineraryNo['documentYearIN'], 'NC')
          } else {
          }
          if (resultItineraryNo['documentNameOUT'] && resultItineraryNo['documentYearOUT']) {
            vm.loadDetailHs(resultItineraryNo['documentNameOUT'], resultItineraryNo['documentYearOUT'], 'XC')
          } else {
          }
          if (!vm.id || vm.id === '0') {
            vm.loadInitData().then(result => {
              if (result && result['shipAgencyCode']) {
                vm.detailTauDiChuyen['taxCodeOfShipownersAgents'] = result['shipAgencyCode']
              }
              if (vm.departmentItems && vm.departmentItems['length']) {
                vm.detailTauDiChuyen['departmentCode'] = vm.departmentItems[0]['departmentCode']
              }
              vm.initPort()
              vm.loadDetailFromItineraryNo_NoticeShipType(resultItineraryNo, 4).then(resultNoticeShipType4 => {
                vm.genCertificateNo().then(resultCertificate => {
                  if (resultNoticeShipType4.hasOwnProperty('errorCode')) {
                    vm.loadDetailFromItineraryNo_NoticeShipType(resultItineraryNo, 1).then(resultNoticeShipType1 => {
                      if (!resultNoticeShipType1.hasOwnProperty('errorCode')) {
                        if (resultNoticeShipType1.hasOwnProperty('chanelCodeList')) {
                          if (resultNoticeShipType1['chanelCodeList']) {
                            if (typeof resultNoticeShipType1['chanelCodeList'] === 'string') {
                              resultNoticeShipType1['chanelCodeList'] = resultNoticeShipType1['chanelCodeList'].split(',')
                            }
                          } else {
                            resultNoticeShipType1['chanelCodeList'] = []
                          }
                        }
                        vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, resultNoticeShipType1)
                        vm.detailTauDiChuyen['certificateNo'] = resultCertificate
                        vm.loadWarning(Object.assign(vm.detailTauDiChuyen, result))
                        vm.checkPortWharf(vm.detailTauDiChuyen)
                        vm.detailTauDiChuyen['taxCodeOfShipownersAgents'] = resultNoticeShipType1['arrivalShipAgencyCode']
                        // vm.themTauDiChuyen()
                      }
                    }).catch(xhr => {
                      console.log(xhr)
                    })
                  } else {
                    if (resultNoticeShipType4.hasOwnProperty('chanelCodeList')) {
                      if (resultNoticeShipType4['chanelCodeList']) {
                        if (typeof resultNoticeShipType4['chanelCodeList'] === 'string') {
                          resultNoticeShipType4['chanelCodeList'] = resultNoticeShipType4['chanelCodeList'].split(',')
                        }
                      } else {
                        resultNoticeShipType4['chanelCodeList'] = []
                      }
                    }
                    vm.detailTauDiChuyen['anchoringPortHarbourCode'] = resultNoticeShipType4['portHarbourCode']
                    vm.detailTauDiChuyen['anchoringPortWharfCode'] = resultNoticeShipType4['portWharfCode']
                    for (var key in resultNoticeShipType4) {
                      if (key !== 'anchoringPortHarbourCode' && key !== 'anchoringPortWharfCode' && key !== 'shiftingPortHarbourCode' && key !== 'shiftingPortWharfCode') {
                        vm.detailTauDiChuyen[key] = resultNoticeShipType4[key]
                      }
                    }
                    vm.loadWarning(Object.assign(vm.detailTauDiChuyen, result))
                    vm.checkPortWharf(vm.detailTauDiChuyen)
                    vm.detailTauDiChuyen['certificateNo'] = resultCertificate
                    // vm.themTauDiChuyen()
                  }
                })
              }).catch(xhr => {
                console.log(xhr)
              })
            })
          } else {
            vm.loadTauDiChuyen()
          }
        })
      } else {
        vm.loadPortHarbour('', 'DENBEN')
        let query = vm.$router.history.current.query
        if (query && query['itineraryNo']) {
          vm.loadItineraryFromUrlQuery().then(result => {
            vm.initDataPTTND()
            if (vm.id && vm.id !== '0') {
              vm.loadTauDiChuyenOut()
            } else {
              vm.loadDetailFromItineraryNo_NoticeShipType(result, 4).then(resultNoticeShipType4 => {
                vm.genCertificateNo().then(resultCertificate => {
                  if (resultNoticeShipType4.hasOwnProperty('errorCode')) {
                    vm.loadDetailFromItineraryNo_NoticeShipType(result, 1).then(resultNoticeShipType1 => {
                      resultNoticeShipType1['remarks'] = ''
                      vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, vm.selectTau)
                      vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, resultNoticeShipType1)
                      vm.detailTauDiChuyen['anchoringPortHarbourCode'] = resultNoticeShipType1['portHarbourCode']
                      vm.detailTauDiChuyen['anchoringPortWharfCode'] = resultNoticeShipType1['portWharfCode']
                      delete vm.detailTauDiChuyen['vmaItineraryScheduleId']
                      vm.detailTauDiChuyen['remarks'] = ''
                      vm.detailTauDiChuyen['certificateNo'] = resultCertificate
                    })
                  } else {
                    resultNoticeShipType4['remarks'] = ''
                    vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, vm.selectTau)
                    vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, resultNoticeShipType4)
                    vm.detailTauDiChuyen['anchoringPortHarbourCode'] = resultNoticeShipType4['portHarbourCode']
                    vm.detailTauDiChuyen['anchoringPortWharfCode'] = resultNoticeShipType4['portWharfCode']
                    delete vm.detailTauDiChuyen['vmaItineraryScheduleId']
                    vm.detailTauDiChuyen['remarks'] = ''
                    vm.detailTauDiChuyen['certificateNo'] = resultCertificate
                  }
                })
              })
            }
          })
        } else {
          if (vm.id && vm.id !== '0') {
            vm.loadTauDiChuyenOut()
          } else {
            vm.loadDetailFromItineraryNo_NoticeShipType(vm.itineraryNo, 4).then(resultNoticeShipType4 => {
              vm.genCertificateNo().then(resultCertificate => {
                if (resultNoticeShipType4.hasOwnProperty('errorCode')) {
                  vm.loadDetailFromItineraryNo_NoticeShipType(vm.itineraryNo, 1).then(resultNoticeShipType1 => {
                    vm.detailTauDiChuyen['taxCodeOfShipownersAgents'] = vm.selectTau['shipAgencyCode'] || ''
                    vm.genCertificateNo().then(resultCertificate => {
                      resultNoticeShipType1['remarks'] = ''
                      vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, vm.selectTau)
                      vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, resultNoticeShipType1)
                      vm.detailTauDiChuyen['anchoringPortHarbourCode'] = resultNoticeShipType1['portHarbourCode']
                      vm.detailTauDiChuyen['anchoringPortWharfCode'] = resultNoticeShipType1['portWharfCode']
                      vm.detailTauDiChuyen['taxCodeOfShipownersAgents'] = resultNoticeShipType1['arrivalShipAgencyCode']
                      vm.detailTauDiChuyen['remarks'] = ''
                      vm.detailTauDiChuyen['certificateNo'] = resultCertificate
                      delete vm.detailTauDiChuyen['vmaItineraryScheduleId']
                    })
                  })
                } else {
                  resultNoticeShipType4['remarks'] = ''
                  vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, vm.selectTau)
                  vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, resultNoticeShipType4)
                  vm.detailTauDiChuyen['anchoringPortHarbourCode'] = resultNoticeShipType4['portHarbourCode']
                  vm.detailTauDiChuyen['anchoringPortWharfCode'] = resultNoticeShipType4['portWharfCode']
                  vm.detailTauDiChuyen['remarks'] = ''
                  delete vm.detailTauDiChuyen['vmaItineraryScheduleId']
                  vm.detailTauDiChuyen['certificateNo'] = resultCertificate
                }
              })
            })
          }
        }
      }
      vm.loadPortWharf({}, 'anchoringPortHarbourCode')
      vm.loadPortWharf({}, 'shiftingPortHarbourCode')
      vm.loadShipAgency()
      vm.loadPortHarbour('', 'TUBEN')
      vm.loadPortHarbour('', 'DENBEN')
      vm.loadPurpose()
      vm.loadCargo()
      vm.loadShipType()
      vm.loadChanelList()
      vm.loadsecurityLevel()
      vm.loadDonVi()
      vm.loadPortMaritime()
      vm.loadFlagStateOfShip()
      vm.loadShipOwners({
        isShipOwner: 1
      })
      vm.loadShipOwners({
        isShipOperator: 1
      })
      vm.loadDepartment()
    })
  },
  methods: {
    loadDetailFromItineraryNo_NoticeShipType: function (itineraryNo, noticeShipType) {
      var vm = this
      vm.loadingDetail = true
      return new Promise((resolve, reject) => {
        let param = {
          itineraryNo: itineraryNo['itineraryNo'],
          noticeShipType: noticeShipType
        }
        vm.$store.dispatch('loadDetailFromItineraryNo_NoticeShipType', param).then(function (result) {
          vm.loadingDetail = false
          if (result.hasOwnProperty('chanelCodeList')) {
            if (result['chanelCodeList']) {
              if (typeof result['chanelCodeList'] === 'string') {
                result['chanelCodeList'] = result['chanelCodeList'].split(',')
              }
            } else {
              result['chanelCodeList'] = []
            }
          }
          resolve(result)
        }).catch(function (xhr) {
          console.log(xhr)
          vm.loadingDetail = false
          reject(xhr)
        })
      })
    },
    xemKHDD () {
      window.open('/group/ke-hoach/quan-ly-thu-tuc-tau-bien#/tra-cuu/ke_hoach/0/0/KeHoachDieuDongTau2', '_blank')
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
          vm.detailTauDiChuyen['certificateNo'] = result
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadInitDepartmentCode: function () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadInitDepartmentCode').then(result => {
          vm.detailTauDiChuyen['departmentCode'] = result['departmentCode'] || ''
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    createCertificateNo: function () {
      return this.documentName + '_' + (this.totalTauDiChuyen + 1) + '-LDD/' + this.maritimeCode
    },
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
        }
      })
    },
    initDataPTTND: function () {
      let vm = this
      if (vm.itineraryNo['itineraryNo']) {
        vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, vm.selectPTTND)
        vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, vm.itineraryNo)
      }
    },
    luuNhapTachDoan: function () {
      let vm = this
      if (vm.$refs.detailNhapTachDoan) {
        vm.$refs.detailNhapTachDoan['detailNhapTachDoan'] = Object.assign(vm.$refs.detailNhapTachDoan['detailNhapTachDoan'], vm.detailTauDiChuyen)
        if (vm.$refs.detailNhapTachDoan['detailNhapTachDoan'] && vm.$refs.detailNhapTachDoan['detailNhapTachDoan'].hasOwnProperty('vmaScheduleMergingId') && vm.$refs.detailNhapTachDoan['detailNhapTachDoan']['vmaScheduleMergingId']) {
          vm.$refs.detailNhapTachDoan.luuNhapTachDoan(true)
        } else {
          vm.$refs.detailNhapTachDoan.themNhapTachDoan(true)
        }
      }
    },
    luuHoaTieu: function () {
      let vm = this
      if (vm.$refs.detailHoaTieuDanTau) {
        vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau'] = Object.assign(vm.$refs.detailHoaTieuDanTau['detailHoaTieuDanTau'], vm.detailTauDiChuyen)
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
        vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'] = Object.assign(vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'], vm.detailTauDiChuyen)
        vm.$refs.detailTauLaiHoTro.luuTauLaiHoTro(true)
        // if (vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'] && vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro'].hasOwnProperty('vmaScheduleTugboatId') && vm.$refs.detailTauLaiHoTro['detailTauLaiHoTro']['vmaScheduleTugboatId']) {
        //   vm.$refs.detailTauLaiHoTro.luuTauLaiHoTro(true)
        // } else {
        //   vm.$refs.detailTauLaiHoTro.themTauLaiHoTro(true)
        // }
      }
    },
    changeBenCang: function (data, type) {
      var vm = this
      vm.loadPortWharf(data, type)
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
    loadWarning: function (model) {
      let vm = this
      let actions = []
      vm.loadingWarning = true
      actions.push(vm.loadWarningCauCang(model, 'dwt'))
      actions.push(vm.loadWarningCauCang(model, 'loa'))
      actions.push(vm.loadWarningCauCang(model, 'shownDraftxA'))
      Promise.all(actions).then(results => {
        vm.loadingWarning = false
        let message = ''
        let lineBreak = '\r\n'
        if (vm.warningTauDiChuyen['message'] && vm.warningTauDiChuyen['message'].length) {
          vm.warningTauDiChuyen['message'].forEach(item => {
            message += lineBreak
          })
        }
        console.log('message=======', message)
        // if (message) {
        //   vm.detailTauDiChuyen['remarks'] = message
        // }
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
            if (vm.warningTauDiChuyen['message'].length) {
              let index = vm.warningTauDiChuyen['message'].findIndex(item => {
                return item === result['message']
              })
              if (index === -1) {
                vm.warningTauDiChuyen['message'].push(result['message'])
              }
            } else {
              vm.warningTauDiChuyen['message'].push(result['message'])
            }
            vm.warningTauDiChuyen['show'] = true
          }
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadDepartment: function (query) {
      var vm = this
      let param = {
        categoryId: 'VMA_TRANSACTION_DEPARTMENT'
      }
      if (query) {
        for (var key in query) {
          param[key] = query[key]
        }
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.departmentItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadDetailHs: function (documentName, documentYear, typeNCXC) {
      var vm = this
      let param = {
        documentName: documentName,
        documentYear: documentYear,
        type: vm.type,
        documentType: vm.documentType
      }
      vm.$store.dispatch('loadDetailHoSo', param).then(result => {
        if (result) {
          if (typeNCXC === 'NC') {
            vm.detailHs = result
          } else {
            vm.detailHsOther = result
          }
        } else {
          // vm.detailHs = {}
          // vm.detailHsOther = {}
        }
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
    loadDonVi: function () {
      var vm = this
      let param = {
        categoryId: 'DM_REPRESENTATIVE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.representativeItems = result
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
    chuyenlanhDaoKySo: function () {
      let vm = this
      let cf = confirm('Bạn có muốn thực hiện hành động này')
      if (cf) {
        let tmp = Object.assign({}, vm.detailTauDiChuyen)
        tmp['keyId'] = 'vma_schedule_shifting'
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
    loadFlagStateOfShip: function () {
      var vm = this
      let param = {
        categoryId: 'DM_STATE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.flagStateOfShipItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadPortWharf: function (data, type) {
      var vm = this
      let param = {
        categoryId: 'DM_PORT_WHARF'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      if (data) {
        param['holdPortHarbourCode'] = data
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        if (type === 'anchoringPortHarbourCode') {
          vm.portWharfTuVTItems = result
        } else if (type === 'shiftingPortHarbourCode') {
          vm.portWharfDenVTItems = result
        }
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
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.shipAgencyItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadPortHarbour: function (data, type) {
      var vm = this
      let param = {
        categoryId: 'DM_PORT_HARBOUR'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      if (data) {
        param['portRegion'] = data
      }
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        if (type === 'TUBEN') {
          vm.portHarbourTuItems = result
        } else {
          vm.portHarbourDenItems = result
        }
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
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.purposeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadCargo: function () {
      // var vm = this
      // let param = {
      //   categoryId: 'DM_CARGO_ON_BOARD'
      // }
      // if (vm.id && vm.id !== '0') {
      //   delete param['isDelete']
      // } else {
      //   param['isDelete'] = 0
      // }
      // param['start'] = -1
      // param['end'] = -1
      // vm.$store.dispatch('loadDataDm', param).then(function (result) {
      //   vm.cargoItems = result
      // }).catch(function (xhr) {
      //   console.log(xhr)
      // })
      var vm = this
      let param = {
        categoryId: 'DM_DATAITEM_GROUP124'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.cargoItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadShipType: function (code) {
      var vm = this
      let param = {
        categoryId: code || 'DM_SHIP_TYPE'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.shipTypeItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    checkPortWharf: function (model) {
      let vm = this
      if (!model) {
        return
      }
      if (model.hasOwnProperty('shiftingPortWharfCode') && !model['shiftingPortWharfCode']) {
        vm.warningTauDiChuyen['show'] = true
        let message = 'Chưa có thông tin cầu cảng'
        let index = vm.warningTauDiChuyen['message'].findIndex(item => {
          return item === message
        })
        if (index === -1) {
          vm.warningTauDiChuyen['message'].push(message)
        }
      }
    },
    loadChanelList: function () {
      var vm = this
      let param = {
        categoryId: 'DM_TUYEN_LUONG'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.chanelListItems = result
      }).catch(function (xhr) {
        console.log(xhr)
      })
    },
    loadPortMaritime: function () {
      var vm = this
      let param = {
        categoryId: 'DM_MARITIME'
      }
      param['isDelete'] = 0
      param['maritimeCode'] = vm.maritimeCode
      param['portofAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['portOfAuthority'] = vm.maritimeCode
      param['start'] = -1
      param['end'] = -1
      vm.$store.dispatch('loadDataDm', param).then(function (result) {
        vm.portMaritimeItems = result
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
    initPort: function () {
      let vm = this
      vm.$store.dispatch('getLastVmaItinerarySchedule', {
        documentName: vm.documentName,
        documentYear: vm.documentYear
      }).then(result => {
        console.log('initPort======portRegionCode================>>>>>>', result['portRegionCode'])
        console.log('initPort======portHarbourCode================>>>>>>', result['portHarbourCode'])
        console.log('initPort======portWharfCode================>>>>>>', result['portWharfCode'])
        vm.detailTauDiChuyen['portRegionCode'] = result['portRegionCode']
        vm.detailTauDiChuyen['anchoringPortRegionCode'] = result['portRegionCode']
        vm.loadPortHarbour(result['portRegionCode'], 'DENBEN')
        vm.detailTauDiChuyen['anchoringPortHarbourCode'] = result['portHarbourCode']
        vm.detailTauDiChuyen['anchoringPortWharfCode'] = result['portWharfCode']
      })
    },
    loadInitData: function () {
      var vm = this
      return new Promise((resolve, reject) => {
        let param = {
          documentName: vm.documentName,
          documentYear: vm.documentYear
        }
        vm.loadingBtn = true
        vm.loadingDetail = true
        if (!vm.documentName || vm.documentName === '0') {
          vm.loadingDetail = false
          resolve({})
          return
        }
        vm.$store.dispatch('loadInitData', param).then(function (result) {
          vm.loadingDetail = false
          vm.loadingBtn = false
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
            vm.detailTauDiChuyen['shiftingPortRegionCode'] = result['portRegionCode']
            vm.detailTauDiChuyen['nameOfShipownersAgents'] = result['shipAgencyName']
            if (!vm.detailTauDiChuyen['cargoCode']) {
              if (result && result['tempCargoItems'] && result['tempCargoItems'].length) {
                vm.detailTauDiChuyen['cargoCode'] = result['tempCargoItems'][0].cargoCode
              }
            }
            delete result['tempCargoItems']
            vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, result)
            // vm.detailTauDiChuyen['chanelCodeList'] = vm.stringToArray(vm.detailTauDiChuyen['chanelCodeList'])
            resolve(vm.detailTauDiChuyen)
          } else {
            resolve({})
          }
        }).catch(xhr => {
          vm.loadingDetail = false
          vm.loadingBtn = false
          reject(xhr)
        })
      })
    },
    luuTauDraftTauDiChuen: function () {
      var vm = this
      if (vm.id && vm.id !== '0') {
        vm.luuTauDiChuyen()
      } else {
        vm.themTauDiChuyen()
      }
    },
    parseTimeTau: function (modelTauDiChuyen) {
      var vm = this
      if (!modelTauDiChuyen) {
        console.log('valid tau di chuyen', modelTauDiChuyen)
        return
      }
      modelTauDiChuyen['timeOfDeparture'] = vm.parseTimeStamp(modelTauDiChuyen['timeOfDeparture'])
      return modelTauDiChuyen
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
    loadTauDiChuyen: function () {
      var vm = this
      let data = {
        'id': vm.id
      }
      vm.loadingDetail = true
      vm.loadInitData().then(resultDC => {
        if (resultDC && resultDC['shipAgencyCode']) {
          vm.detailTauDiChuyen['taxCodeOfShipownersAgents'] = resultDC['shipAgencyCode']
        }
        // vm.initPort()
        vm.$store.dispatch('loadDetailTauDiChuyen', data).then(function (result) {
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
            // vm.changeBenCang(result['anchoringPortHarbourCode'])
            vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, result)
            vm.loadWarning(Object.assign(vm.detailTauDiChuyen, result))
            vm.checkPortWharf(vm.detailTauDiChuyen)
          }
          if (!vm.detailTauDiChuyen['certificateNo']) {
            vm.genCertificateNo()
          }
          if (!vm.detailTauDiChuyen['departmentCode']) {
            vm.loadInitDepartmentCode().then(resultRepartmentCode => {
              if (!resultRepartmentCode['departmentCode']) {
                let item = vm.departmentItems[0] || {}
                if (item['departmentCode']) {
                  vm.detailTauDiChuyen['departmentCode'] = item['departmentCode']
                }
              }
            })
          }
          vm.loadingDetail = false
        }).catch(function (xhr) {
          console.log(xhr)
          vm.loadingDetail = false
        })
      })
    },
    loadTauDiChuyenOut: function () {
      var vm = this
      let data = {
        'id': vm.id
      }
      vm.loadingDetail = true
      vm.$store.dispatch('loadDetailTauDiChuyen', data).then(function (result) {
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
          vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, result)
          vm.loadWarning(Object.assign(vm.detailTauDiChuyen, result))
          vm.checkPortWharf(vm.detailTauDiChuyen)
        }
        if (!vm.detailTauDiChuyen['certificateNo']) {
          vm.genCertificateNo()
        }
        vm.loadingDetail = false
      }).catch(function (xhr) {
        console.log(xhr)
        vm.loadingDetail = false
      })
    },
    setMarkedAsArrival_ItineraryNo: function (markedAsArrival) {
      var itineraryNoTmp = this.itineraryNo
      itineraryNoTmp['markedAsArrival'] = markedAsArrival
      this.$store.commit('setItineraryNo', itineraryNoTmp)
    },
    luuTauDCMarkedAsArrival: function (markedAsArrival) {
      this.detailTauDiChuyen['markedAsArrival'] = markedAsArrival
      this.luuTauDiChuyen()
      this.setMarkedAsArrival_ItineraryNo(markedAsArrival)
    },
    huyTauDiChuyen: function () {
      let vm = this
      let cf = confirm('Bạn có muốn thực hiện hành động này?')
      if (cf) {
        vm.detailTauDiChuyen['requestState'] = 6
        vm.detailTauDiChuyen['isApproval'] = 1
        vm.luuTauDiChuyen()
      }
    },
    goBoTauDiChuyen: function () {
      let vm = this
      let cf = confirm('Bạn có muốn thực hiện hành động này?')
      if (cf) {
        vm.detailTauDiChuyen['requestState'] = 1
        vm.detailTauDiChuyen['isApproval'] = 1
        vm.luuTauDiChuyen()
      }
    },
    xacNhanTauDiChuyen: function () {
      let vm = this
      let cf = confirm('Bạn có muốn thực hiện hành động này?')
      if (cf) {
        vm.detailTauDiChuyen['requestState'] = 4
        vm.detailTauDiChuyen['isApproval'] = 1
        vm.luuTauDiChuyen()
        // let data = {
        //   vmaScheduleShiftingId: vm.detailTauDiChuyen['vmaScheduleShiftingId'],
        //   requestState: vm.detailTauDiChuyen['requestState'],
        //   isApproval: vm.detailTauDiChuyen['isApproval']
        // }
        // vm.$store.dispatch('editTauDiChuyen', data).then(function (result) {
        //   if (result && !result.hasOwnProperty('errorCode')) {
        //     toastr.error('Xác nhận thành công!')
        //   } else {
        //     toastr.error('Xác nhận thất bại, vui lòng thử lại!')
        //   }
        // }).catch(xhr => {
        //   toastr.error('Xác nhận thất bại, vui lòng thử lại!')
        // })
      }
    },
    kySoHSM () {
      // let vm = this
    },
    addTauDiChuyen: function () {
      var vm = this
      if (!vm.detailTauDiChuyen['vmaScheduleShiftingId']) {
        vm.themTauDiChuyen()
      } else {
        vm.luuTauDiChuyen()
      }
    },
    themTauDiChuyen: function () {
      var vm = this
      vm.detailTauDiChuyen['id'] = ''
      vm.detailTauDiChuyen['itineraryNo'] = vm.itineraryNo['itineraryNo']
      vm.detailTauDiChuyen['vmaItineraryId'] = vm.itineraryNo['vmaItineraryId']
      vm.detailTauDiChuyen['quantityOfCargo'] = ''
      vm.detailTauDiChuyen['portofAuthority'] = vm.maritimeCode
      vm.detailTauDiChuyen['noticeShipType'] = 4
      vm.detailTauDiChuyen['unitLOA'] = 'MTR'
      vm.detailTauDiChuyen['unitGT'] = 'GT'
      vm.detailTauDiChuyen['unitNT'] = 'MTR'
      vm.detailTauDiChuyen['unitDWT'] = 'TNE'
      vm.detailTauDiChuyen['unitBreadth'] = 'MTR'
      vm.detailTauDiChuyen['unitClearanceHeight'] = 'MTR'
      vm.detailTauDiChuyen['unitShownDraftxF'] = 'MTR'
      vm.detailTauDiChuyen['unitShownDraftxA'] = 'MTR'
      vm.loadingBtn = true
      vm.loadingDetail = true
      vm.clearData()
      vm.$store.dispatch('addTauDiChuyen', vm.detailTauDiChuyen).then(function (result) {
        if (result && !result.hasOwnProperty('errorCode')) {
          vm.detailTauDiChuyen['itineraryScheduleId'] = result['itineraryScheduleId']
          vm.detailTauDiChuyen['vmaScheduleShiftingId'] = result['vmaScheduleShiftingId']
          vm.detailTauDiChuyen['requestState'] = result['requestState']
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
          // vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, result)
          let query = vm.$router.history.current.query
          vm.changeIdUrl(result['vmaScheduleShiftingId'], {
            ...query
          })
          vm.luuNhapTachDoan()
          toastr.success('Thêm thành công!')
        } else {
          toastr.error('Thêm thất bại, vui lòng thử lại!')
          toastr.error(result.message)
        }
        vm.loadingBtn = false
        vm.loadingDetail = false
      }).catch(function (xhr) {
        console.log(xhr)
        vm.loadingBtn = false
        vm.loadingDetail = false
      })
    },
    deleteTauDiChuyen: function () {
      var vm = this
      let data = {
        vmaScheduleShiftingId: vm.id
      }
      var cf = confirm('Bạn có muốn xóa!')
      if (cf) {
        vm.loadingBtn = true
        vm.loadingDetail = true
        vm.$store.dispatch('deleteTauDiChuyen', data).then(function (result) {
          if (result && result.hasOwnProperty('errorCode') && result['errorCode']) {
            toastr.error('Xóa thất bại, vui lòng thử lại!')
            toastr.error(result.message)
          } else {
            vm.changeIdUrl('0')
            toastr.success('Xóa thành công!')
            vm.quayLai()
          }
          vm.loadingBtn = false
          vm.loadingDetail = false
        }).catch(function (xhr) {
          console.log(xhr)
          vm.loadingBtn = false
          vm.loadingDetail = false
        })
      } else {
        vm.loadingDetail = false
      }
    },
    inLenhDD: function () {
      let vm = this
      vm.$store.dispatch('vmaScheduleShiftingExport', {
        itineraryNo: vm.itineraryNo['itineraryNo'],
        noticeShipType: 4,
        certificateNo: vm.detailTauDiChuyen['certificateNo'],
        printing: 1
      }).then(result => {
        if (result) {
          window.open(result, '_blank')
        } else {
          toastr.error('Không tìm thấy file!')
        }
      })
    },
    xemTruocLenhDD: function () {
      let vm = this
      vm.$store.dispatch('xemTruocLenhDD', {
        itineraryNo: vm.itineraryNo['itineraryNo'],
        vmaScheduleShiftingId: vm.detailTauDiChuyen['vmaScheduleShiftingId'] || vm.id,
        printing: 0
      }).then(result => {
        if (result) {
          window.open(result, '_blank')
        } else {
          toastr.error('Không tìm thấy file!')
        }
      })
    },
    lamMoi: function () {
      var vm = this
      vm.detailTauDiChuyen = {}
    },
    activeForm: function () {
      var vm = this
      vm.disabledForm = false
    },
    clearData: function () {
      let vm = this
      delete vm.detailTauDiChuyen['lastPortCode']
      delete vm.detailTauDiChuyen['timeOfArrival']
      delete vm.detailTauDiChuyen['arrivalShipAgencyCode']
      delete vm.detailTauDiChuyen['arrivalShipAgency']
    },
    luuTauDiChuyen: function () {
      var vm = this
      if (vm.$refs.formTauDiChuyen.validate()) {
        vm.loadingDetail = true
        vm.detailTauDiChuyen['quantityOfCargo'] = ''
        vm.detailTauDiChuyen['portofAuthority'] = vm.maritimeCode
        vm.detailTauDiChuyen['vmaItineraryId'] = vm.itineraryNo['vmaItineraryId']
        vm.detailTauDiChuyen['itineraryNo'] = vm.itineraryNo['itineraryNo']
        vm.detailTauDiChuyen['unitLOA'] = 'MTR'
        vm.detailTauDiChuyen['unitGT'] = 'GT'
        vm.detailTauDiChuyen['unitNT'] = 'MTR'
        vm.detailTauDiChuyen['unitDWT'] = 'TNE'
        vm.detailTauDiChuyen['unitBreadth'] = 'MTR'
        vm.detailTauDiChuyen['unitClearanceHeight'] = 'MTR'
        vm.detailTauDiChuyen['unitShownDraftxF'] = 'MTR'
        vm.detailTauDiChuyen['unitShownDraftxA'] = 'MTR'
        vm.detailTauDiChuyen['unitShownDraftxA'] = 'MTR'
        vm.clearData()
        vm.$store.dispatch('editTauDiChuyen', vm.detailTauDiChuyen).then(function (result) {
          if (result && !result.hasOwnProperty('errorCode')) {
            vm.detailTauDiChuyen['itineraryScheduleId'] = result['itineraryScheduleId']
            vm.detailTauDiChuyen['vmaScheduleShiftingId'] = result['vmaScheduleShiftingId']
            vm.detailTauDiChuyen['requestState'] = result['requestState']
            if (result.hasOwnProperty('chanelCodeList')) {
              if (result['chanelCodeList']) {
                if (typeof result['chanelCodeList'] === 'string') {
                  result['chanelCodeList'] = result['chanelCodeList'].split(',')
                }
              } else {
                result['chanelCodeList'] = []
              }
            }
            console.log('detailTauDiChuyen.itineraryScheduleId******************', vm.detailTauDiChuyen['itineraryScheduleId'])
            // vm.luuNhapTachDoan()
            setTimeout(function () {
              vm.luuHoaTieu()
              vm.luuTauLai()
              vm.luuNhapTachDoan()
            }, 300)
            // vm.detailTauDiChuyen = Object.assign(vm.detailTauDiChuyen, result)
            toastr.success('Lưu thành công!')
          } else {
            toastr.error('Lưu thất bại, vui lòng thử lại!')
            toastr.error(result.message)
          }
          vm.loadingDetail = false
        }).catch(function (xhr) {
          console.log(xhr)
          vm.loadingDetail = false
        })
      }
    },
    themTauLaiHoTro: function () {
      var vm = this
      console.log('them tau lai')
      vm.$router.push({
        path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.documentName + '/' + vm.documentYear + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/DanhSachTauLaiHoTro/0'
      })
      vm.$store.commit('setOtherData', {
        certificateNo: vm.detailTauDiChuyen['certificateNo'],
        itineraryNo: vm.detailTauDiChuyen['itineraryNo']
      })
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
        var path = vm.$router.history.current.path
        if (path.indexOf('/tau-bien') !== -1) {
          vm.$router.push({
            path: '/tau-bien/' + vm.type + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.idPT + '/' + vm.code + '/table',
            query: {
              ...query
            }
          })
        } else {
          vm.$router.push({
            path: '/quan-ly-tau-bien/' + vm.type + '/' + vm.documentTypeCode + '/' + vm.documentStatusCode + '/' + vm.code,
            query: {
              ...query
            }
          })
        }
      }
    }
  }

}
</script>

