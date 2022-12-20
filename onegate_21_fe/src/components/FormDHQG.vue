<template>
  <v-card
    class="mx-auto form_vuejs"
    flat
  >
    <v-form
      ref="formThanhPhan"
      v-model="validFormAdd"
      lazy-validation
      class="mt-2"
    >
      <v-layout wrap>
        <!--  -->
        <div v-for="(item, index) in mauNhap" v-bind:key="index" :class="item['fieldClass']" class="py-0 mb-2 px-2">
          <div style="
            margin-bottom: 5px;
            display: inline-block;
            color: #000000b8;
            font-weight: 600;">
            <span>{{item.title}}</span>
            <span class="red--text" v-if="item.required">(*)</span>
            <v-tooltip top class="ml-2" v-if="item.type === 'table-tochuc'">
              <v-btn icon slot="activator" width="70" height="32" color="primary" dense small dark @click="showAddToChuc(item.name)">
                <v-icon>add_circle_outline</v-icon>
              </v-btn>
              <span>Thêm tổ chức</span>
            </v-tooltip>
            <v-tooltip top class="ml-2" v-if="item.type === 'table-canhan'">
              <v-btn icon slot="activator" width="70" height="32" color="primary" dense small dark @click="showAddThanhVien(item.name)">
                <v-icon>add_circle_outline</v-icon>
              </v-btn>
              <span>Thêm thành viên</span>
            </v-tooltip>
          </div>
          <v-text-field
            v-if="item.type === 'textfield'"
            class="flex input-form"
            v-model="data[item.name]"
            :placeholder="item['placeHolder']"
            solo
            dense
            hide-details="auto"
            :clearable="!readonly"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          ></v-text-field>
          <v-text-field
            v-if="item.type === 'number'"
            class="flex input-form"
            v-model="data[item.name]"
            :placeholder="item['placeHolder']"
            solo
            dense
            hide-details="auto"
            :clearable="!readonly"
            type="number"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
            @input="!readonly && item.hasOwnProperty('keyCalculator') ? triggerCalculator(item.keyCalculator) : ''"
          ></v-text-field>
          <v-text-field
            v-if="item.type === 'calculator'"
            class="flex input-form"
            v-model="data[item.name]"
            :placeholder="item['placeHolder']"
            solo
            dense
            hide-details="auto"
            :clearable="!readonly"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          ></v-text-field>
          <v-textarea
            v-if="item.type === 'textarea'"
            class="flex input-form"
            v-model="data[item.name]"
            :placeholder="item['placeHolder']"
            solo
            dense
            hide-details="auto"
            :clearable="!readonly"
            :rows="item.hasOwnProperty('rows') ? item.rows : 3"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          ></v-textarea>

          <v-text-field
            v-if="item.type === 'date'"
            class="flex input-form"
            v-model="data[item.name]"
            placeholder="dd/mm/yyyy, ddmmyyyy"
            @blur="formatBirthDate(item.name)"
            @input="formatBirthDate(item.name)"
            @change="formatBirthDate(item.name)"
            solo
            dense
            hide-details="auto"
            :clearable="!readonly"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          ></v-text-field>
          <v-text-field
            v-if="item.type === 'money'"
            class="flex input-form"
            @input="toCurrency(item.name)"
            v-model="data[item.name]"
            type='number'
            :placeholder="item['placeHolder']"
            solo
            dense
            hide-details="auto"
            :clearable="!readonly"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          ></v-text-field>
          <v-autocomplete
            v-if="item.type === 'select' && !item.api"
            class="flex input-form"
            hide-no-data
            v-model="data[item.name]"
            :items="item.dataSource"
            :multiple="item['multiple']"
            :item-text="item.itemText"
            :item-value="item.itemValue"
            dense
            solo
            hide-details="auto"
            return-object
            :clearable="!readonly"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          >
          </v-autocomplete>
          <v-autocomplete
            v-if="item.type === 'select' && item.api"
            class="flex input-form"
            hide-no-data
            v-model="data[item.name]"
            :items="item.dataSource"
            :multiple="item['multiple']"
            :item-text="item.itemText"
            :item-value="item.itemValue"
            dense
            solo
            hide-details="auto"
            return-object
            :clearable="!readonly"
            :rules="item.required ? [v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'] : []"
          >
          </v-autocomplete>
          <!--  -->
          <v-flex class="xs12" v-if="item.type === 'table-tochuc' && !loadingData">
            <v-data-table
              :headers="item.headerTable"
              :items="data[item.name]"
              hide-actions
              class="table-landing table-bordered"
              style="border-left: 1px solid #dedede"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                  <td class="text-xs-center" style="width:50px;vertical-align: middle;">
                    <div>
                      <span>{{props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left" style="vertical-align: middle;">
                    <div>
                      <span>{{props.item.TenToChuc}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center" style="width: 150px;vertical-align: middle;">
                    <div>
                      <span>{{props.item.QuocGia.TenMuc}}</span>
                    </div>
                  </td>
                  <td width="200" class="text-xs-center py-0">
                    <v-tooltip top class="mr-2">
                      <v-btn icon slot="activator" width="50" height="32" color="primary" dense small dark @click="suaToChuc(item.name, props.index)">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <span>Sửa</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn icon slot="activator" width="50" height="32" color="red" dense small dark @click="xoaToChuc(item.name, props.index)">
                        <v-icon style="color: #fff !important">delete</v-icon>
                      </v-btn>
                      <span>Xóa</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <!--  -->
          <v-flex class="xs12" v-if="item.type === 'table-canhan' && !loadingDataThanhVien">
            <v-data-table
              :headers="item.headerTable"
              :items="data[item.name]"
              hide-actions
              class="table-landing table-bordered"
              style="border-left: 1px solid #dedede"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                  <td class="text-xs-center" style="width:50px;vertical-align: middle;">
                    <div>
                      <span>{{props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left" style="vertical-align: middle;">
                    <div>
                      <span>{{props.item.TenToChuc}}</span>
                    </div>
                  </td>
                  <td class="text-xs-center" style="width: 150px;vertical-align: middle;">
                    <div>
                      <span>{{props.item.QuocGia.TenMuc}}</span>
                    </div>
                  </td>
                  <td width="200" class="text-xs-center py-0">
                    <v-tooltip top class="mr-2">
                      <v-btn icon slot="activator" width="50" height="32" color="primary" dense small dark @click="suaThanhVien(item.name, props.index)">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <span>Sửa</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <v-btn icon slot="activator" width="50" height="32" color="red" dense small dark @click="xoaThanhVien(item.name, props.index)">
                        <v-icon style="color: #fff !important">delete</v-icon>
                      </v-btn>
                      <span>Xóa</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <!--  -->
        </div>
      </v-layout>
    </v-form>

    <v-dialog v-model="dialogToChuc" scrollable persistent max-width="900px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Thông tin tổ chức</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogToChuc = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-form ref="formToChuc" v-model="validToChuc" lazy-validation class="form_vuejs py-3 px-0 grid-list">
            <v-layout row wrap class="px-0 py-3">
              <v-flex class="xs12">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Tên tổ chức</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-text-field
                  v-if="typeAction == 'update'"
                  class="flex input-form"
                  v-model="toChucCreate['TenToChuc']"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                ></v-text-field>

                <v-combobox
                  v-if="typeAction == 'create'"
                  class="flex input-form mr-0"
                  hide-no-data
                  :items="danhSachToChucSuggest"
                  v-model="toChucSuggested"
                  item-text="TenToChuc"
                  item-value="MaToChuc"
                  dense
                  solo
                  clearable
                  return-object
                  @change="changeSuggest"
                >
                </v-combobox>
              </v-flex>

              <v-flex class="xs12">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Quốc gia</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  v-model="quocGiaSelected"
                  :items="danhMucQuocGia"
                  item-text="itemName"
                  item-value="itemCode"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                  clearable
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                >
                </v-autocomplete>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="primary" @click.native="dialogToChuc = false"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          >
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
          <v-btn v-if="typeAction == 'create'" class="mr-3" color="primary" @click.native="themToChuc"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          >
            <v-icon>save</v-icon> &nbsp;
            Thêm tổ chức
          </v-btn>
          <v-btn v-if="typeAction == 'update'" class="mr-3" color="primary" @click.native="updateToChuc"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          >
            <v-icon>save</v-icon> &nbsp;
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCaNhan" scrollable persistent max-width="1200px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Thông tin thành viên</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogCaNhan = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="py-1">
          <v-form ref="formThanhVien" v-model="validThanhVien" lazy-validation class="form_vuejs py-3 px-0 grid-list">
            <v-layout row wrap class="px-0 py-3">
              <v-flex class="xs4">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Họ và tên</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-text-field
                  v-if="typeAction == 'update'"
                  class="flex input-form"
                  v-model="thanhVienCreate['HoTen']"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                ></v-text-field>

                <v-combobox
                  v-if="typeAction == 'create'"
                  class="flex input-form mr-0"
                  hide-no-data
                  :items="danhSachThanhVienSuggest"
                  v-model="thanhVienSuggested"
                  item-text="HoTen"
                  item-value="Id"
                  dense
                  solo
                  clearable
                  return-object
                  @change="changeSuggestThanhVien"
                >
                </v-combobox>
              </v-flex>
              <v-flex class="xs4 px-2">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Ngày sinh</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="ngaySinhCreate"
                  placeholder="dd/mm/yyyy, ddmmyyyy"
                  @blur="formatBirthDate()"
                  @input="formatBirthDate()"
                  @change="formatBirthDate()"
                  solo
                  dense
                  hide-details="auto"
                  :clearable="!readonly"
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                ></v-text-field>
              </v-flex>
              <v-flex class="xs4">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Giới tính</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsGioiTinh"
                  v-model="gioiTinhCreate"
                  item-text="TenMuc"
                  item-value="MaMuc"
                  dense
                  solo
                  hide-details="auto"
                  placeholder="Chọn giới tính"
                  return-object
                >
                </v-autocomplete>
              </v-flex>
              <v-flex class="xs4">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Vai trò trong hội thảo</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsVaiTroHoiThao"
                  v-model="vaiTroHoiThaoCreate"
                  item-text="TenMuc"
                  item-value="MaMuc"
                  dense
                  solo
                  hide-details="auto"
                  placeholder="Chọn giới tính"
                  return-object
                >
                </v-autocomplete>
              </v-flex>
              <v-flex class="xs4">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Số CCCD/ Hộ chiếu</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="soHoChieuCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                ></v-text-field>
              </v-flex>
              <v-flex class="xs4">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Quốc gia</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  v-model="quocGiaSelected"
                  :items="danhMucQuocGia"
                  item-text="itemName"
                  item-value="itemCode"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                  clearable
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                >
              </v-flex>
              <v-flex class="xs12">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Địa chỉ</span>
                  <span class="red--text">(*)</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="diaChiCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                  :rules="[v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc']"
                ></v-text-field>
              </v-flex>
              <v-flex class="xs6">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Học hàm, học vị</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="hocHamCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex class="xs6">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Nghề nghiệp</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="ngheNghiepCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex class="xs6">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Đơn vị công tác</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="donViCongTacCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex class="xs6">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Chức vụ</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="chucVuDonViCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex class="xs6">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Số điện thoại</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="soDienThoaiCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex class="xs6">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Email</span>
                </div>
                <v-text-field
                  class="flex input-form"
                  v-model="emailCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex class="xs12">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Trình độ chuyên môn</span>
                </div>
                <v-textarea
                  class="flex input-form"
                  v-model="trinhDoChuyenMonCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                  rows="5"
                ></v-textarea>
              </v-flex>
              <v-flex class="xs12">
                <div style="
                  margin-bottom: 5px;
                  display: inline-block;
                  color: #000000b8;
                  font-weight: 600;">
                  <span>Lĩnh vực nghiên cứu</span>
                </div>
                <v-textarea
                  class="flex input-form"
                  v-model="linhVucNghienCuuCreate"
                  solo
                  dense
                  hide-details="auto"
                  clearable
                  rows="5"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="mr-3">
          <v-spacer></v-spacer>
          <v-btn class="mr-2" color="primary" @click.native="dialogCaNhan = false"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          >
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
          <v-btn v-if="typeAction == 'create'" class="mr-3" color="primary" @click.native="themThanhVien"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          >
            <v-icon>save</v-icon> &nbsp;
            Thêm thành viên
          </v-btn>
          <v-btn v-if="typeAction == 'update'" class="mr-3" color="primary" @click.native="updateThanhVien"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          >
            <v-icon>save</v-icon> &nbsp;
            Cập nhật
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000',
  "positionClass": "toast-top-center"
}
export default {
    props: ["mauNhap", "dataInput", "readonly", "thongtinthanhphan"],
    components: {
    },
    data() {
      return {
        validToChuc: false,
        validThanhVien: false,
        ngaySinhCreate: '',
        itemsGioiTinh: [
          {MaMuc: 0, TenMuc: 'Nam'},
          {MaMuc: 1, TenMuc: 'Nữ'}
        ],
        gioiTinhCreate: '',
        itemsVaiTroHoiThao: [],
        vaiTroHoiThaoCreate: '',
        soHoChieuCreate: '',
        quocGiaSelected: '',
        danhSachToChucSuggest: [
          {
            "MaToChuc": "DHKT-DHQGHN",
            "TenToChuc": "Trường Đại học Kinh tế, ĐHQG Hà Nội", 
            "QuocGia": {
              "MaMuc": "01",
              "TenMuc": "Việt Nam"
            }
          },
          {
            "MaToChuc": "DHGD-DHQGHN",
            "TenToChuc": "Trường Đại học Giáo dục, ĐHQG Hà Nội", 
            "QuocGia": {
              "MaMuc": "01",
              "TenMuc": "Việt Nam"
            }
          }
        ],
        danhSachThanhVienSuggest: [],
        toChucSuggested: '',
        tenNhomToChucThemMoi: '',
        indexToChucUpdate: '',
        toChucCreate: {
          "TenToChuc": "",
          "MaToChuc": "",
          "QuocGia": {
            "MaMuc": "",
            "TenMuc": ""
          }
        },
        quocGiaSelected: '',
        headersTableToChuc: [
          {
            text: 'TT',
            align: 'center',
            sortable: false
          },
          {
            text: 'Tên tổ chức',
            align: 'center',
            sortable: false
          },
          {
            text: 'Quốc gia',
            align: 'center',
            sortable: false
          },
          {
            text: 'Thao tác',
            align: 'center',
            sortable: false
          }
        ],

        loading: false,
        loadingData: false,
        thanhVienCreate: {
          HoTen: "",
          VaiTroTrongHoiThao: {
            MaMuc: "",
            TenMuc: ""
          },
          ChucVu: "",
          NgaySinh: "",
          GioiTinh: "",
          QuocGia: "",
          HoChieu: "",
          DiaChi: "",
          HocHam: "",
          NgheNghiep: "",
          DonViCongTac: "",
          DienThoai: "",
          Email: "",
          TrinhDoChuyenMon: "",
          LinhVucNghienCuu: ""
        },
        thanhVienSuggested: [],
        tenNhomThanhVienThemMoi: '',
        indexThanhVienUpdate: '',
        loadingDataThanhVien: false,

        diaChiCreate: "",
        hocHamCreate: "",
        ngheNghiepCreate: "",
        donViCongTacCreate: "",
        chucVuDonViCreate: "",
        soDienThoaiCreate: "",
        emailCreate: "",
        trinhDoChuyenMonCreate: "",
        linhVucNghienCuuCreate: "",

        validFormAdd: false,
        data: {},
        required: [
          v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'
        ],
        rules: {
          required: value => !!value || 'Thông tin bắt buộc'
        },
        fileUpload: [],
        dataDefaultOutSite: {
          govAgencyName: ''
        },
        dialogToChuc: false,
        dialogCaNhan: false,
        loadingSubmit: false,
        typeAction: 'create',
        danhMucQuocGia: []
      }
    },
    created () {
      let vm = this
      vm.getDanhMucQuocGia()
      try {
        vm.dataDefaultOutSite.govAgencyName = JSON.parse(localStorage.getItem('EmployeeInfo'))['coQuanDonVi']['tenGoi']
      } catch (error) {
      }
      vm.$store.commit('SET_INDEXTAB', 0)
      if (vm.data.files) {
        if (vm.data.files[0]) { 
          vm.$store.commit('SET_FILEUPLOADYET', true)
        } else { 
          vm.$store.commit('SET_FILEUPLOADYET', false)
        }
      } else { 
        vm.$store.commit('SET_FILEUPLOADYET', false)
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        vm.$store.commit('SET_INDEXTAB', 0)
        if (vm.data.files) {
          if (vm.data.files[0]) { 
            vm.$store.commit('SET_FILEUPLOADYET', true)
          }
          else { 
            vm.$store.commit('SET_FILEUPLOADYET', false)
          }
        } 
        else { 
          vm.$store.commit('SET_FILEUPLOADYET', false)
        }
      },
      
    },
    methods: {
      getDanhMucQuocGia () {
        let vm = this
        let filter = {
          collectionCode: 'COUNTRY',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.danhMucQuocGia = result.data
        })
      },
      getDanhSachToChucSuggest () {
        let vm = this
        let filter = {
          collectionCode: '123123',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.danhSachToChucSuggest = result.data
        }).catch(function () {
        })
      },
      getDanhSachThanhVienSuggest () {
        let vm = this
        let filter = {
          collectionCode: '123123',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.danhSachThanhVienSuggest = result.data
        }).catch(function () {
        })
      },
      processRules (rulesStr) {
        let rulesInput = []
        try {
          if (rulesStr) {
            rulesInput = eval('( ' + rulesStr + ' )')
          }
        } catch (error) {
        }
        return rulesInput
      },
      pickFileUpload () {
        document.getElementById('file_upload').value = ''
        document.getElementById('file_upload').click()
      },
      uploadFile () {
        let vm = this
        let files = $('#file_upload')[0].files
        for (let index = 0; index < files.length; index++) {
          vm.fileUpload.push({
            name: files[index]['name']
          })
        }
        vm.$store.commit('SET_FILEUPLOADYET', true)
      },
      deleteFileAttack (item, index) {
        let vm = this
        if (!item.id) {
          vm.fileUpload.splice(index, 1)
          vm.$store.commit('SET_FILEUPLOADYET', false)
        } else {
          vm.$store.commit('SET_SHOWCONFIRM', true)
          let confirm = {
            auth: false,
            title: 'Xóa tài liệu đính kèm',
            message: 'Bạn có chắc chắn muốn xóa tài liệu này',
            button: {
              yes: 'Có',
              no: 'Không'
            },
            callback: () => {
              let filter = {
                idThanhPhan: vm.thongtinthanhphan.primKey,
                idFile: item.id
              }
              vm.$store.dispatch('deleteFile', filter).then(function(result) {
                vm.fileUpload.splice(index, 1)
                toastr.success('Xóa tài liệu đính kèm thành công')
                vm.$store.commit('SET_FILEUPLOADYET', false)
              }).catch(function(){
                toastr.success('Xóa tài liệu đính kèm thất bại')
              })
            }
          }
          vm.$store.commit('SET_CONFIG_CONFIRM_DIALOG', confirm)
          
        }
      },
      getExtension (file) {
        var regex = new RegExp('[^.]+$');
        var extension = file.name.match(regex);
        return extension[0].toLocaleLowerCase()
      },
      viewFileUpload () {
        let vm = this
      },
      downloadFile (file) {
        let vm = this
        vm.$store.dispatch('downloadFile', file).then(function(result) {
        }).catch(function(){})
      },
      submitTaoBaoCao (type) {
        let vm = this
        let dataOutput = Object.assign({}, vm.data)
        for (let key in vm.mauNhap) {
          let itemConfig = vm.mauNhap[key]
          if (itemConfig.type == 'date' && dataOutput[itemConfig['name']]) {
            dataOutput[itemConfig['name']] = vm.convertDate(dataOutput[itemConfig['name']])
          }
          if (itemConfig.type == 'money' && dataOutput[itemConfig['name']]) {
            dataOutput[itemConfig['name']] = Number(dataOutput[itemConfig['name']].toString().replace(/\./g, ''))
          }
          if (itemConfig.type == 'select' && dataOutput[itemConfig['name']]) {
            let dataCv = Array.isArray(dataOutput[itemConfig['name']]) ? dataOutput[itemConfig['name']] : [dataOutput[itemConfig['name']]]
            let dataArray = Array.from(dataCv, function (item) {
              let itemGet = {}
              itemGet[itemConfig['itemText']] = item[itemConfig['itemText']]
              itemGet[itemConfig['itemValue']] = item[itemConfig['itemValue']]
              return itemGet
            })
            dataOutput[itemConfig['name']] = dataArray
          }
        }
        vm.$store.commit('SET_FORM_DATA', dataOutput)
      },
      initForm (type) {
        let vm = this
        for (let key in vm.mauNhap) {
          let itemData = vm.mauNhap[key]
          if (itemData['type'] === 'select' && itemData.hasOwnProperty('api') && itemData['api']) {
            vm.$store.dispatch('loadDataSource', itemData).then(function(result) {
              let resultData = itemData['responseDataApi'] ? result[itemData['responseDataApi']] : result
              vm.$set(vm.mauNhap[key], 'dataSource', resultData)
            }).catch(function(){})
          }
        }
        if (type === 'update' && vm.dataInput) {
          vm.data = vm.dataInput
          // console.log('data', vm.data)
          for (let key in vm.data) {
            let filter = vm.mauNhap.find(function (item) {
              return item.name == key
            })
            if (filter && filter.type === 'date') {
              vm.data[key] = vm.dateLocale(vm.data[key])
            }
            if (filter && filter.type === 'money') {
              vm.data[key] = vm.currency(vm.data[key])
            }
            if (filter && filter.type === 'select' && !filter['multiple']) {
              vm.data[key] = Array.isArray(vm.data[key]) ? vm.data[key][0] : vm.data[key]
            }
          }
          vm.$refs.formThanhPhan.resetValidation()
        } else {
          vm.$refs.formThanhPhan.reset()
          vm.$refs.formThanhPhan.resetValidation()
          for (let key in vm.data) {
            let filter = vm.mauNhap.find(function (item) {
              return item.name == key
            })
            if (filter && filter.defaultValue) {
              vm.data[key] = vm.dataDefaultOutSite[filter.defaultValue]
            }
          }
        }

        // if (vm.data.files) {
        //   if (vm.data.files[0]) { 
        //     console.log('ok', vm.data.files) 
        //     vm.$store.commit('SET_FILEUPLOADYET', true)
        //   }
        //   else { 
        //     console.log('n') 
        //     vm.$store.commit('SET_FILEUPLOADYET', false)
        //   }
        // } 
        // else { 
        //   console.log('not') 
        //   vm.$store.commit('SET_FILEUPLOADYET', false)
        // }

      },
      // LOẠI TỔ CHỨC
      // 
      showAddToChuc (tenDoiTuong) {
        let vm = this
        vm.toChucCreate = {
          "TenToChuc": "",
          "MaToChuc": "",
          "QuocGia": {
            "MaMuc": "",
            "TenMuc": ""
          }
        }
        vm.toChucSuggested = ''
        vm.dialogToChuc = true
        vm.tenNhomToChucThemMoi = tenDoiTuong
      },
      themToChuc () {
        let vm = this
        setTimeout(() => {
          console.log('vm.toChucSuggested', vm.toChucSuggested)
          try {
            if (!vm.toChucSuggested.hasOwnProperty('TenToChuc')) {
              vm.toChucCreate['TenToChuc'] = vm.toChucSuggested
            }
          } catch (error) {
          }
          console.log('vm.toChucCreate', vm.toChucCreate)
          let toChuc = {
            "TenToChuc": vm.toChucCreate['TenToChuc'],
            "MaToChuc": vm.toChucCreate['MaToChuc'] ? vm.toChucCreate['MaToChuc'] : '',
            "QuocGia": {
              "MaMuc": vm.quocGiaSelected.itemCode,
              "TenMuc": vm.quocGiaSelected.itemName
            }
          }
          if (!vm.data[vm.tenNhomToChucThemMoi]) {
            vm.data[vm.tenNhomToChucThemMoi] = []
          }
          vm.$set(vm.data, vm.tenNhomToChucThemMoi, vm.data[vm.tenNhomToChucThemMoi].concat([toChuc]))
          console.log('vm.data[vm.tenNhomToChucThemMoi144423]', vm.data[vm.tenNhomToChucThemMoi])
          vm.dialogToChuc = false
        }, 100);
      },
      updateToChuc () {
        let vm = this
        setTimeout(() => {
          let toChuc = {
            "TenToChuc": vm.toChucCreate['TenToChuc'],
            "MaToChuc": vm.toChucCreate['MaToChuc'] ? vm.toChucCreate['MaToChuc'] : '',
            "QuocGia": {
              "MaMuc": vm.quocGiaSelected.itemCode,
              "TenMuc": vm.quocGiaSelected.itemName
            }
          }
          vm.$set(vm.data[vm.tenNhomToChucThemMoi], vm.indexToChucUpdate, toChuc)
          vm.dialogToChuc = false
          vm.loadingData = true
          setTimeout(function () {
            vm.loadingData = false
          }, 10)
        }, 100);
      },
      suaToChuc (name, index) {
        let vm = this
        vm.typeAction = 'update'
        vm.tenNhomToChucThemMoi = name
        vm.indexToChucUpdate = index
        let data = Object.assign({}, vm.data[name][index]) 
        vm.toChucCreate = data
        vm.quocGiaSelected = {
          itemName: data.QuocGia.TenMuc,
          itemCode: data.QuocGia.MaMuc
        }
        vm.dialogToChuc = true
      },
      xoaToChuc (name, index) {
        let vm = this
        console.log('name', name, index)
        vm.tenNhomToChucThemMoi = name
        let abc = vm.data[vm.tenNhomToChucThemMoi].filter(function (item, key) {
          return key !== index
        })
        vm.$set(vm.data, vm.tenNhomToChucThemMoi, abc)
        vm.loadingData = true
        setTimeout(function () {
          vm.loadingData = false
        }, 10)
      },
      changeSuggest () {
        let vm = this
        if (vm.toChucSuggested && vm.toChucSuggested.hasOwnProperty('TenToChuc')) {
          vm.toChucCreate = vm.toChucSuggested
          // vm.ngaySinhCreate = vm.thiSinhSuggested.ngaySinh ? vm.convertDate(vm.thiSinhSuggested.ngaySinh) : ''
          // if (vm.thiSinhSuggested.doiTuongThi) {
          //   vm.doiTuongSuggested = vm.thiSinhSuggested.doiTuongThi
          // }
          // if (vm.thiSinhSuggested.nganhDaoTao) {
          //   vm.nganhDaoTaoSuggested = vm.thiSinhSuggested.nganhDaoTao
          // }
        }
      },
      // LOẠI THÀNH VIÊN
      // 
      showAddThanhVien (tenDoiTuong) {
        let vm = this
        vm.thanhVienCreate = {
          HoTen: "",
          VaiTroTrongHoiThao: {
            MaMuc: "",
            TenMuc: ""
          },
          ChucVu: "",
          NgaySinh: "",
          GioiTinh: "",
          QuocGia: "",
          HoChieu: "",
          DiaChi: "",
          HocHam: "",
          NgheNghiep: "",
          DonViCongTac: "",
          DienThoai: "",
          Email: "",
          TrinhDoChuyenMon: "",
          LinhVucNghienCuu: ""
        }
        vm.thanhVienSuggested = ''
        vm.dialogCaNhan = true
        vm.tenNhomThanhVienThemMoi = tenDoiTuong
      },
      themThanhVien () {
        let vm = this
        setTimeout(() => {
          console.log('vm.thanhVienSuggested', vm.thanhVienSuggested)
          try {
            if (!vm.thanhVienSuggested.hasOwnProperty('TenToChuc')) {
              vm.thanhVienSuggested['TenToChuc'] = vm.toChucSuggested
            }
          } catch (error) {
          }
          console.log('vm.thanhVienCreate', vm.thanhVienCreate)
          let thanhVien = {
            "TenToChuc": vm.thanhVienCreate['TenToChuc'],
            "MaToChuc": vm.thanhVienCreate['MaToChuc'] ? vm.thanhVienCreate['MaToChuc'] : '',
            "QuocGia": {
              "MaMuc": vm.quocGiaSelected.itemCode,
              "TenMuc": vm.quocGiaSelected.itemName
            }
          }
          if (!vm.data[vm.tenNhomThanhVienThemMoi]) {
            vm.data[vm.tenNhomThanhVienThemMoi] = []
          }
          vm.$set(vm.data, vm.tenNhomThanhVienThemMoi, vm.data[vm.tenNhomThanhVienThemMoi].concat([thanhVien]))
          console.log('vm.data[vm.tenNhomToChucThemMoi144423]', vm.data[vm.tenNhomThanhVienThemMoi])
          vm.dialogCaNhan = false
        }, 100);
      },
      updateThanhVien () {
        let vm = this
        setTimeout(() => {
          let thanhVien = {
            "TenToChuc": vm.thanhVienCreate['TenToChuc'],
            "MaToChuc": vm.thanhVienCreate['MaToChuc'] ? vm.thanhVienCreate['MaToChuc'] : '',
            "QuocGia": {
              "MaMuc": vm.quocGiaSelected.itemCode,
              "TenMuc": vm.quocGiaSelected.itemName
            }
          }
          vm.$set(vm.data[vm.tenNhomThanhVienThemMoi], vm.indexThanhVienUpdate, thanhVien)
          vm.dialogCaNhan = false
          vm.loadingDataThanhVien = true
          setTimeout(function () {
            vm.loadingDataThanhVien = false
          }, 10)
        }, 100);
      },
      suaThanhVien (name, index) {
        let vm = this
        vm.typeAction = 'update'
        vm.tenNhomThanhVienThemMoi = name
        vm.indexThanhVienUpdate = index
        let data = Object.assign({}, vm.data[name][index]) 
        vm.thanhVienCreate = data
        vm.quocGiaSelected = {
          itemName: data.QuocGia.TenMuc,
          itemCode: data.QuocGia.MaMuc
        }
        vm.dialogCaNhan = true
      },
      xoaThanhVien (name, index) {
        let vm = this
        console.log('name', name, index)
        vm.tenNhomThanhVienThemMoi = name
        let abc = vm.data[vm.tenNhomThanhVienThemMoi].filter(function (item, key) {
          return key !== index
        })
        vm.$set(vm.data, vm.tenNhomThanhVienThemMoi, abc)
        vm.loadingDataThanhVien = true
        setTimeout(function () {
          vm.loadingDataThanhVien = false
        }, 10)
      },
      changeSuggestThanhVien () {
        let vm = this
        if (vm.thanhVienSuggested && vm.thanhVienSuggested.hasOwnProperty('TenToChuc')) {
          vm.thanhVienCreate = vm.thanhVienSuggested
          // vm.ngaySinhCreate = vm.thiSinhSuggested.ngaySinh ? vm.convertDate(vm.thiSinhSuggested.ngaySinh) : ''
          // if (vm.thiSinhSuggested.doiTuongThi) {
          //   vm.doiTuongSuggested = vm.thiSinhSuggested.doiTuongThi
          // }
          // if (vm.thiSinhSuggested.nganhDaoTao) {
          //   vm.nganhDaoTaoSuggested = vm.thiSinhSuggested.nganhDaoTao
          // }
        }
      },
      // 
      validateForm () {
        let vm = this
        return vm.$refs.formThanhPhan.validate()
      },
      triggerCalculator (key) {
        let vm = this
        let dataTrigger = vm.mauNhap.find(function (item) {
          return item.name == key
        })
        if (dataTrigger && dataTrigger.hasOwnProperty('calculator')) {
          let dataInput = vm.data
          let calu = dataTrigger['calculator'].replace(/data/g, 'dataInput')
          try {
            let valueData = eval(calu)
            vm.data[key] = valueData
          } catch (error) {
          }
        }
      },
      formatBirthDate (name) {
        let vm = this
        let lengthDate = String(vm.data[name]).trim().length
        let splitDate = String(vm.data[name]).split('/')
        let splitDate2 = String(vm.data[name]).split('-')
        if (lengthDate && lengthDate > 4 && splitDate.length === 3 && splitDate[2]) {
          vm.data[name] = vm.translateDate(vm.data[name])
        } else if (lengthDate && lengthDate === 8) {
          let date = String(vm.data[name])
          vm.data[name] = date.slice(0,2) + '/' + date.slice(2,4) + '/' + date.slice(4,8)
        } else if (splitDate2[1]) {
          vm.data[name] = vm.dateLocale(vm.data[name])
        } else {
          vm.data[name] = ''
        }
      },
      formatBirthDateNgaySinh (name) {
        let vm = this
        let lengthDate = String(vm.ngaySinhCreate).trim().length
        let splitDate = String(vm.ngaySinhCreate).split('/')
        let splitDate2 = String(vm.ngaySinhCreate).split('-')
        if (lengthDate && lengthDate > 4 && splitDate.length === 3 && splitDate[2]) {
          vm.ngaySinhCreate = vm.translateDate(vm.ngaySinhCreate)
        } else if (lengthDate && lengthDate === 8) {
          let date = String(vm.ngaySinhCreate)
          vm.ngaySinhCreate = date.slice(0,2) + '/' + date.slice(2,4) + '/' + date.slice(4,8)
        } else if (splitDate2[1]) {
          vm.ngaySinhCreate = vm.dateLocale(vm.ngaySinhCreate)
        } else {
          vm.ngaySinhCreate = ''
        }
      },
      currency (value) {
        if (value) {
          let moneyCur = (value / 1).toFixed(0).replace('.', ',')
          return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
        return ''
      },
      toCurrency (name) {
        let vm = this
        if (vm.data[name]) {
          let data_number = Number(vm.data[name].toString().replace(/\./g, ''))
          let moneyCur = (data_number / 1).toFixed(0).replace('.', ',')
          Vue.set(vm.data, name, moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        }
      },
      translateDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      },
      dateLocale (dateInput) {
        if (!dateInput) return ''
        let date = new Date(dateInput)
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      },
      convertDate (date) {
        if (!date) return ''
        const [day, month, year] = date.split('/')
        let ddd = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        return (new Date(ddd)).toISOString()
      },
      resetForm () {
        let vm = this
        vm.$refs.formThanhPhan.reset()
        vm.$refs.formThanhPhan.resetValidation()
      },
      goBack () {
        window.history.back()
      }
    }
}
</script>