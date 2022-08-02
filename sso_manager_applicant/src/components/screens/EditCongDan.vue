<template>
    <div>
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span v-if="typeAction == 'update'">CẬP NHẬT THÔNG TIN CÔNG DÂN</span>
          <span v-if="typeAction == 'add'">THÊM MỚI CÔNG DÂN</span>
        </div>
        <div class="layout row wrap header_tools row-blue mx-1">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          </div>
        </div>
      </div>
      <v-form lazy-validation ref="formAddCaNhan" v-model="validFormAdd" class="px-2">
        <v-layout wrap class="py-2">
            <v-flex xs12 class="py-0 mb-2 pr-3">
              <label>Trạng thái thông tin <span class="red--text">(*)</span></label>
              <v-switch color="primary" class="mt-0 ml-3 d-inline-block" v-model="trangThaiDuLieu">
                <template slot="label">
                  <span class="ml-2" style="color: black">{{trangThaiDuLieu ? 'ĐANG SỬ DỤNG' : 'ĐÁNH DẤU XÓA'}}</span>
                </template>
              </v-switch>
            </v-flex>
            <v-flex xs12 v-if="!trangThaiDuLieu" cols="12" class="py-0 mb-2">
              <label>Lý do đánh dấu xóa</label>
              <v-text-field
                class="input-form"
                v-model="thongTinCongDan.activityNote"
                solo
                dense
                clearable
                max
                hide-details="auto"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 class="py-0 mb-2 pr-3" v-if="quyenTraCuuLgsp == 1 || quyenTraCuuLgsp == 2">
              <v-btn
                class="mx-0 mr-2"
                small
                color="primary"
                @click="checkCsdldc()"
                :loading="loadingSearchLgsp" :disabled="loadingSearchLgsp"
              >
                <v-icon size="18">check</v-icon>&nbsp;
                <span>Kiểm tra thông tin CSDL dân cư</span>
              </v-btn>
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2 pr-3">
                <label>Họ tên <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="thongTinCongDan.hoVaTen"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="required"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0">
                <label>CMND/CCCD <span class="red--text">(*)</span> <i> (Gồm 9 đến 12 ký tự)</i></label>
                <v-text-field
                  class="input-form"
                  v-model="thongTinCongDan.maSoCaNhan"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="requiredCredit"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md3 class="py-0 mb-2 pr-3">
                <label>Ngày sinh <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="ngaySinhCreate"
                  placeholder="dd/mm/yyyy, ddmmyyyy"
                  @blur="formatBirthDate"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="required"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md3 class="py-0 pr-3">
                <label>Giới tính </label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsGioiTinh"
                  v-model="gioiTinhCreate"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  placeholder="Chọn giới tính"
                  return-object
                  clearable
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 md3 class="py-0 pr-3">
                <label>Điện thoại <span class="red--text">(*)</span></label>
                <v-text-field
                    class="input-form"
                    v-model="thongTinCongDan.danhBaLienLac['soDienThoai']"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                    :rules="required"
                    required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md3 class="py-0 mb-2">
                <label>Email</label>
                <v-text-field
                    class="input-form"
                    v-model="thongTinCongDan.danhBaLienLac['thuDienTu']"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0 pr-3">
                <label>Quốc tịch </label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsQuocTich"
                  v-model="quocTichCreate"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  placeholder="Chọn quốc tịch"
                  return-object
                  clearable
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 md3 class="py-0 pr-3">
                <label>Dân tộc </label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsDanToc"
                  v-model="danTocCreate"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  placeholder="Chọn dân tộc"
                  return-object
                  clearable
                >
                </v-autocomplete>
            </v-flex>
            
            <v-flex xs12 md3 class="py-0">
                <label>Tôn giáo</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsTonGiao"
                  v-model="tonGiaoCreate"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  placeholder="Chọn tôn giáo"
                  return-object
                  clearable
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 class="py-0 mb-2">
                <label>Địa chỉ thường trú</label>
                <v-text-field
                  class="input-form"
                  v-model="diaChiThuongTruCuThe"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  placeholder="Số nhà, đường, phố, xóm..."
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md4 class="py-0 mb-2 pr-3">
                <label>Tỉnh/ thành</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsTinhThanh"
                  v-model="thuongTruTinhThanh"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 md4 class="py-0 pr-3">
                <label>Quận / Huyện</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsThuongTruQuanHuyen"
                  v-model="thuongTruQuanHuyen"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 md4 class="py-0">
                <label>Phường / Xã</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsThuongTruPhuongXa"
                  v-model="thuongTruPhuongXa"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 class="py-0 mb-2">
                <label>Nơi ở hiện tại</label>
                <v-text-field
                    class="input-form"
                    v-model="noiOHienTaiCuThe"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                    placeholder="Số nhà, đường, phố, xóm..."
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md4 class="py-0 pr-3">
                <label>Tỉnh thành</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsTinhThanh"
                  v-model="noiOHienTaiTinhThanh"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 md4 class="py-0 pr-3">
                <label>Quận / Huyện</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsNoiOHienTaiQuanHuyen"
                  v-model="noiOHienTaiQuanHuyen"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 md4 class="py-0">
                <label>Phường / Xã</label>
                <v-autocomplete
                  class="flex input-form"
                  hide-no-data
                  :items="itemsNoiOHienTaiPhuongXa"
                  v-model="noiOHienTaiPhuongXa"
                  item-text="tenMuc"
                  item-value="maMuc"
                  dense
                  solo
                  hide-details="auto"
                  return-object
                >
                </v-autocomplete>
            </v-flex>
            <v-flex xs12 class="text-center">
                <v-btn color="primary" @click="goBack()"  outlined class="mt-3 mx-2  text-white" :loading="loading" :disabled="loading">
                    <v-icon
                        left
                        dark
                        size="20"
                    >
                        reply
                    </v-icon>
                    Quay lại
                </v-btn>
                <v-btn color="primary" class="mt-3 mx-2  text-white" v-if="typeAction === 'add'" @click.native="submitAddCongDan()" :loading="loading" :disabled="loading">
                    <v-icon
                        left
                        dark
                        size="20"
                    >
                      save
                    </v-icon>
                    Thêm mới
                </v-btn>
                <v-btn color="primary" class="mt-3 mx-2  text-white" v-else @click.native="submitUpdateCongDan()" :loading="loading" :disabled="loading">
                    <v-icon
                        left
                        dark
                        size="20"
                    >
                        save
                    </v-icon>
                    Cập nhật
                </v-btn>
            </v-flex>
        </v-layout>
      </v-form>
      <!--  -->
      <v-dialog v-model="dialog_searchLgsp" scrollable persistent max-width="700px">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Thông tin công dân trên CSDL Quốc gia</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click.native="dialog_searchLgsp = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="py-1">
            <div>
              <table v-if="applicantLgspInfomation" class="datatable table my-3" style="border-top: 1px solid #dedede;">
                <tbody>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Họ và tên công dân</span></td>
                    <td class="pt-2"><span>{{applicantLgspInfomation.HoVaTen['Ten']}}</span></td>
                  </tr>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Số căn cước công dân</span></td>
                    <td class="pt-2"><span>{{applicantLgspInfomation.SoDinhDanh}}</span></td>
                  </tr>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Số chứng minh nhân dân</span></td>
                    <td class="pt-2"><span>{{applicantLgspInfomation.SoCMND}}</span></td>
                  </tr>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Ngày sinh</span></td>
                    <td class="pt-2"><span>{{ngaySinhCreate}}</span></td>
                  </tr>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Giới tính</span></td>
                    <td class="pt-2"><span>{{applicantLgspInfomation.GioiTinh == '1' ? 'Nam' : (applicantLgspInfomation.GioiTinh == '2' ? 'Nữ' : 'Chưa có thông tin')}}</span></td>
                  </tr>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Tình trạng hôn nhân</span></td>
                    <td class="pt-2"><span>{{applicantLgspInfomation.TinhTrangHonNhan == '2' ? 'Đã kết hôn' : 'Độc thân'}}</span></td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="mx-1 flex my-4">
                <v-alert outline color="red" icon="warning" :value="true">
                  Thông tin công dân không có trên CSDL quốc gia về dân cư
                </v-alert>
              </div>
              <v-flex xs12 class="text-right my-2">
                <v-btn color="primary"
                  @click="addApplicantLgsp"
                  class="mx-0 my-0 mr-2"
                  v-if="applicantLgspInfomation"
                >
                  <v-icon size="20">save_alt</v-icon>
                  &nbsp;
                  Lấy thông tin
                </v-btn>
                <v-btn color="primary"
                  @click="dialog_searchLgsp = false"
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
    </div>
</template>

<script>
import Vue from 'vue'
import toastr from 'toastr'
import axios from 'axios'
import VueConfirmDialog from 'vue-confirm-dialog'
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
toastr.options = {
  'closeButton': true,
  'timeOut': '5000',
  "positionClass": "toast-top-center"
}
export default {
    props: ["id"],
    data() {
      return {
        applicantLgspInfomation: '',
        quyenTraCuuLgsp: false,
        userLoginInfomation: '',
        loadingSearchLgsp: false,
        dialog_searchLgsp: false,
        loading: false,
        validFormAdd: false,
        typeAction: "add",
        congDanDetail: "",
        itemsGioiTinh: [],
        ngaySinhCreate: '',
        gioiTinhCreate: '',
        tonGiaoCreate: '',
        quocTichCreate: '',
        danTocCreate: '',
        itemsDanToc: [],
        itemsQuocTich: [],
        itemsTonGiao: [],
        itemsTinhThanh: [],
        diaChiThuongTruCuThe: '',
        thuongTruTinhThanh: '',
        itemsThuongTruQuanHuyen: [],
        thuongTruQuanHuyen: '',
        itemsThuongTruPhuongXa: [],
        thuongTruPhuongXa: '',
        noiOHienTaiTinhThanh: '',
        itemsNoiOHienTaiQuanHuyen: [],
        noiOHienTaiQuanHuyen: '',
        itemsNoiOHienTaiPhuongXa: [],
        noiOHienTaiPhuongXa: '',
        noiOHienTaiCuThe: '',
        thongTinCongDan: {
          hoVaTen: "",
          maSoCaNhan: "",
          ngayChetMatTich: "",
          ngaySinh: "",
          gioiTinh: {
            "maMuc": "",
            "tenMuc": ""
          },
          noiOHienTai: {
            "phuongXa": {
              "maMuc": "",
              "tenMuc": ""
            },
            "quanHuyen": {
              "maMuc": "",
              "tenMuc": ""
            },
            "soNhaChiTiet": "",
            "tinhThanh": {
              "maMuc": "",
              "tenMuc": ""
            }
          },
          diaChiThuongTru: {
            "phuongXa": {
              "maMuc": "",
              "tenMuc": ""
            },
            "quanHuyen": {
              "maMuc": "",
              "tenMuc": ""
            },
            "soNhaChiTiet": "",
            "tinhThanh": {
              "maMuc": "",
              "tenMuc": ""
            }
          },
          noiSinh: {
            "phuongXa": {
              "maMuc": "",
              "tenMuc": ""
            },
            "quanHuyen": {
              "maMuc": "",
              "tenMuc": ""
            },
            "soNhaChiTiet": "",
            "tinhThanh": {
              "maMuc": "",
              "tenMuc": ""
            }
          },
          queQuan: {
            "phuongXa": {
              "maMuc": "",
              "tenMuc": ""
            },
            "quanHuyen": {
              "maMuc": "",
              "tenMuc": ""
            },
            "soNhaChiTiet": "",
            "tinhThanh": {
              "maMuc": "",
              "tenMuc": ""
            },
          },
          quocTich: {
            "maMuc": "",
            "tenMuc": ""
          },
          danToc: {
            "maMuc": "",
            "tenMuc": ""
          },
          tonGiao: {
            "maMuc": "",
            "tenMuc": "",
            "type": ""
          },
          danhBaLienLac: {
            "soDienThoai": "",
            "soFax": "",
            "thuDienTu": ""
          },
          giayToTuyThan: [],
          tinhTrangHonNhan: {
            "maMuc": "",
            "tenMuc": ""
          },
          tinhTrangSinhSong: {
            "maMuc": "",
            "tenMuc": ""
          },
          trangThaiDuLieu: {
            "maMuc": "",
            "tenMuc": ""
          },
          vaiTroSuDung: [
            {
              "maMuc": "",
              "tenMuc": ""
            }
          ],
          anhCaNhan: {
            "chuKySo": "",
            "dinhDang": "",
            "duLieu": "",
            "kichThuoc": "",
            "ngayGioSua": "",
            "ngayGioTao": "",
            "ngayKySo": "",
            "tenTep": ""
          },
          nguoiTaoLap: {
            "maSoID": "",
            "tenDinhDanh": ""
          },
          nhaCungCapDinhDanh: {
            "maPhamVi": "",
            "maSoDinhDanh": "",
            "tenNhaCungCap": "",
            "tinhTrang": ""
          },
          activityNote: ""
        },
        required: [
          v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'
        ],
        requiredCredit: [
          (value) => {
            return String(value).trim().length >=9 && String(value).trim().length <= 12 || 'Số CMND/CCCD gồm 9 đến 12 ký tự'
          },
          (value) => {
            if(String(value).trim()){
              return true
            } else {
              return 'Thông tin bắt buộc'
            }  
          }
        ],
        trangThaiDuLieu: true
      }
    },
    created () {
      let vm = this
      vm.$store.commit('SET_INDEXTAB', 1)
      vm.getDanhMucTinhThanh()
      vm.getDanhMuc()
      if (vm.id != 0) {
        vm.typeAction = 'update'
        vm.getThongTinCongDan()
      } else {
        vm.typeAction = 'add'
      }
      // 
      let param = {
        headers: {
          groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
          Token: window.Liferay ? window.Liferay.authToken : ''
        }
      }
      let url = '/o/rest/v2/qldc/role/employee'
      axios.get(url, param).then(function (response) {
        let serializable = response.data
        vm.quyenTraCuuLgsp = serializable.hasOwnProperty('status') ? serializable.status : ''
      }).catch(function () {
        vm.quyenTraCuuLgsp = ''
      })
      axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId(), param).then(function(response) {
        vm.userLoginInfomation = response.data
      })
      .catch(function(error) {
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        vm.$store.commit('SET_INDEXTAB', 1)
        vm.getDanhMucTinhThanh()
        vm.getDanhMuc()
        if (vm.id != 0) {
          vm.typeAction = 'update'
          vm.getThongTinCongDan()
        } else {
          vm.typeAction = 'add'
        }
      },
      thuongTruTinhThanh () {
        let vm = this
        vm.changeTinhThanh('thuongtru')
      },
      thuongTruQuanHuyen () {
        let vm = this
        vm.changeQuanHuyen('thuongtru')
      },
      noiOHienTaiTinhThanh () {
        let vm = this
        vm.changeTinhThanh('noiohientai')
      },
      noiOHienTaiQuanHuyen () {
        let vm = this
        vm.changeQuanHuyen('noiohientai')
      }
    },
    methods: {
      checkCsdldc () {
        let vm = this
        if (String(vm.thongTinCongDan.maSoCaNhan).trim() && String(vm.thongTinCongDan.hoVaTen).trim() && String(vm.ngaySinhCreate).trim()) {
          let filter = {
            applicantIdNo: String(vm.thongTinCongDan.maSoCaNhan).trim(),
            applicantName: vm.convertString((String(vm.thongTinCongDan.hoVaTen).trim())).toUpperCase(),
            birthDate: vm.convertDateLgsp(vm.ngaySinhCreate),
            StaffEmail : vm.userLoginInfomation && vm.userLoginInfomation.hasOwnProperty('employeeEmail') ? vm.userLoginInfomation.employeeEmail : ''
          }
          vm.loadingSearchLgsp = true
          vm.$store.dispatch('searchLgspCongDan', filter).then(result => {
            vm.dialog_searchLgsp = true
            vm.loadingSearchLgsp = false
            vm.applicantLgspInfomation = result
          }).catch(function (result) {
            vm.dialog_searchLgsp = true
            vm.applicantLgspInfomation = ''
            vm.loadingSearchLgsp = false
          })
        } else {
          toastr.remove()
          toastr.error('Vui lòng nhập đầy đủ Họ tên, Số CMND/CCCD và Ngày sinh để tra cứu')
        }
      },
      addApplicantLgsp () {
        let vm = this
        vm.thongTinCongDan.hoVaTen = vm.applicantLgspInfomation.HoVaTen.Ten
        vm.thongTinCongDan.maSoCaNhan = vm.applicantLgspInfomation.SoDinhDanh ? vm.applicantLgspInfomation.SoDinhDanh : vm.applicantLgspInfomation.SoCMND
        vm.diaChiThuongTruCuThe = vm.applicantLgspInfomation.ThuongTru.ChiTiet
        vm.noiOHienTaiCuThe = vm.applicantLgspInfomation.NoiOHienTai.ChiTiet
        
        vm.dialog_searchLgsp = false
        // 
        if (vm.applicantLgspInfomation.GioiTinh) {
          try {
            vm.gioiTinhCreate = vm.itemsGioiTinh.filter(function (item) {
              return item.maMuc == vm.applicantLgspInfomation.GioiTinh
            })[0]
          } catch (error) {
          }
        }
        if (vm.applicantLgspInfomation.TonGiao) {
          try {
            vm.tonGiaoCreate = vm.itemsTonGiao.filter(function (item) {
              return item.maMuc == vm.applicantLgspInfomation.TonGiao
            })[0]
          } catch (error) {
          }
        }
        if (vm.applicantLgspInfomation.DanToc) {
          try {
            vm.danTocCreate = vm.itemsDanToc.filter(function (item) {
              return item.maMuc == vm.applicantLgspInfomation.DanToc
            })[0]
          } catch (error) {
          }
        }
        if (vm.applicantLgspInfomation.ThuongTru.MaTinhThanh) {
          try {
            vm.thuongTruTinhThanh = vm.itemsTinhThanh.filter(function (item) {
              return item.maMuc == vm.applicantLgspInfomation.ThuongTru.MaTinhThanh
            })[0]
          } catch (error) {
          }
          if (!vm.thuongTruTinhThanh) {
            return
          }
          let filter = {
            collectionName: 'quanhuyen',
            data: {
              keyword: '',
              page: 0,
              size: 100,
              orderFields: 'maMuc',
              orderTypes: 'asc',
              tinhTrang: '1',
              thamChieu_maMuc: vm.applicantLgspInfomation.ThuongTru.MaTinhThanh
            }
          }
          
          vm.$store.dispatch('collectionFilter', filter).then(function (response) {
            vm.itemsThuongTruQuanHuyen = response.content
            if (vm.applicantLgspInfomation.ThuongTru.MaQuanHuyen) {
              try {
                vm.thuongTruQuanHuyen = vm.itemsThuongTruQuanHuyen.filter(function (item) {
                  return item.maMuc == vm.applicantLgspInfomation.ThuongTru.MaQuanHuyen
                })[0]
              } catch (error) {
              }
              if (!vm.thuongTruQuanHuyen) {
                return
              }
              let filter = {
                collectionName: 'phuongxa',
                data: {
                  keyword: '',
                  page: 0,
                  size: 100,
                  orderFields: 'maMuc',
                  orderTypes: 'asc',
                  tinhTrang: '1',
                  thamChieu_maMuc: vm.applicantLgspInfomation.ThuongTru.MaQuanHuyen
                }
              }
              vm.$store.dispatch('collectionFilter', filter).then(function (response) {
                vm.itemsThuongTruPhuongXa = response.content
                if (vm.applicantLgspInfomation.ThuongTru.MaPhuongXa) {
                  try {
                    vm.thuongTruPhuongXa = vm.itemsThuongTruPhuongXa.filter(function (item) {
                      return item.maMuc == vm.applicantLgspInfomation.ThuongTru.MaPhuongXa
                    })[0]
                  } catch (error) {
                  }
                }
              }).catch(function () {
              })
            }
          }).catch(function () {
          })
        }
        // 
        // 
        if (vm.applicantLgspInfomation.NoiOHienTai.MaTinhThanh) {
          try {
            vm.noiOHienTaiTinhThanh = vm.itemsTinhThanh.filter(function (item) {
              return item.maMuc == vm.applicantLgspInfomation.NoiOHienTai.MaTinhThanh
            })[0]
          } catch (error) {
          }
          if (!vm.noiOHienTaiTinhThanh) {
            return
          }
          let filter = {
            collectionName: 'quanhuyen',
            data: {
              keyword: '',
              page: 0,
              size: 100,
              orderFields: 'maMuc',
              orderTypes: 'asc',
              tinhTrang: '1',
              thamChieu_maMuc: vm.applicantLgspInfomation.NoiOHienTai.MaTinhThanh
            }
          }
          
          vm.$store.dispatch('collectionFilter', filter).then(function (response) {
            vm.itemsNoiOHienTaiQuanHuyen = response.content
            if (vm.applicantLgspInfomation.NoiOHienTai.MaQuanHuyen) {
              try {
                vm.noiOHienTaiQuanHuyen = vm.itemsNoiOHienTaiQuanHuyen.filter(function (item) {
                  return item.maMuc == vm.applicantLgspInfomation.NoiOHienTai.MaQuanHuyen
                })[0]
              } catch (error) {
              }
              if (!vm.noiOHienTaiQuanHuyen) {
                return
              }
              let filter = {
                collectionName: 'phuongxa',
                data: {
                  keyword: '',
                  page: 0,
                  size: 100,
                  orderFields: 'maMuc',
                  orderTypes: 'asc',
                  tinhTrang: '1',
                  thamChieu_maMuc: vm.applicantLgspInfomation.NoiOHienTai.MaQuanHuyen
                }
              }
              vm.$store.dispatch('collectionFilter', filter).then(function (response) {
                vm.itemsNoiOHienTaiPhuongXa = response.content
                if (vm.applicantLgspInfomation.NoiOHienTai.MaPhuongXa) {
                  try {
                    vm.noiOHienTaiPhuongXa = vm.itemsNoiOHienTaiPhuongXa.filter(function (item) {
                      return item.maMuc == vm.applicantLgspInfomation.NoiOHienTai.MaPhuongXa
                    })[0]
                  } catch (error) {
                  }
                }
              }).catch(function () {
              })
            }
          }).catch(function () {
          })
        }
        // 
      },
      dateTraCuuLgsp (dateInput) {
        let date = new Date(dateInput)
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      },
      getThongTinCongDan () {
        let vm = this
        let filter = {
          collectionName: 'canhan',
          id: vm.id
        }
        vm.$store.dispatch('collectionDetail', filter).then(function (response) {
          let data = response.resp
          if (data) {
            for (let key in vm.thongTinCongDan) {
              if (data.hasOwnProperty(key)) {
                vm.thongTinCongDan[key] = data[key]
              }
            }
          }
          vm.formatInputData()
          console.log('dataCongDan', vm.thongTinCongDan)
        }).catch(function () {
          vm.loadingData = false
        })
      },
      submitAddCongDan () {
        let vm = this
        vm.formatOutputData()
        if (vm.loading) {
          return
        }
        if (vm.$refs.formAddCaNhan.validate()) {
          vm.loading = true
          let filter = {
            collectionName: 'canhan',
            data: vm.thongTinCongDan
          }
          vm.$store.dispatch('collectionCreate', filter).then(function (result) {
            vm.loading = false
            toastr.remove()
            toastr.success('Thêm mới thành công')
            let data = result.resp
            vm.$router.push({ path: '/thong-tin-ca-nhan/' + data.primKey })
          }).catch(function (response) {
            vm.loading = false
            toastr.remove()
            let mss = 'Thêm mới thất bại'
            try {
              if (response == 409) {
                mss = 'Thêm mới thất bại. Số CMND/CCCD đã được sử dụng.'
              }
            } catch (error) {
            }
            toastr.error(mss)
          })
        } else {
          vm.loading = false
        }
      },
      submitUpdateCongDan () {
        let vm = this
        vm.formatOutputData()
        if (vm.loading) {
          return
        }
        vm.loading = true
        if (vm.$refs.formAddCaNhan.validate()) {
          let filter = {
            collectionName: 'canhan',
            id: vm.id,
            data: vm.thongTinCongDan
          }
          vm.$store.dispatch('collectionUpdate', filter).then(function (result) {
            vm.loading = false
            toastr.remove()
            toastr.success('Cập nhật thông tin thành công')
            vm.updateApplicantDvc()
            window.history.back()
          }).catch(function (response) {
            vm.loading = false
            toastr.remove()
            let mss = 'Cập nhật thông tin thất bại'
            try {
              if (response == 409) {
                mss = 'Cập nhật thông tin thất bại. Số CMND/CCCD đã được sử dụng.'
              }
            } catch (error) {
            }
            toastr.error(mss)
          })
        } else {
          vm.loading = false
        }
      },
      updateApplicantDvc () {
        let vm = this
        let dataUpdate = {
          "groupId": 35417,
          "applicantName": vm.thongTinCongDan.HoVaTen,
          "address": vm.thongTinCongDan.diaChiThuongTru.soNhaChiTiet,
          "cityCode": vm.thongTinCongDan.diaChiThuongTru.tinhThanh.maMuc,
          "cityName": vm.thongTinCongDan.diaChiThuongTru.tinhThanh.tenMuc,
          "districtCode": vm.thongTinCongDan.diaChiThuongTru.quanHuyen.maMuc,
          "districtName": vm.thongTinCongDan.diaChiThuongTru.quanHuyen.tenMuc,
          "wardCode": vm.thongTinCongDan.diaChiThuongTru.phuongXa.maMuc,
          "wardName": vm.thongTinCongDan.diaChiThuongTru.phuongXa.tenMuc,
          "contactTelNo": vm.thongTinCongDan.danhBaLienLac.soDienThoai,
          "profile": {
            "gioiTinh": vm.thongTinCongDan.gioiTinh,
            "noiOHienTai": vm.thongTinCongDan.noiOHienTai,
            "diaChiThuongTru": vm.thongTinCongDan.diaChiThuongTru,
            "quocTich": vm.thongTinCongDan.quocTich,
            "danToc": vm.thongTinCongDan.danToc,
            "tonGiao": vm.thongTinCongDan.tonGiao,
            "thuDienTu": vm.thongTinCongDan.danhBaLienLac.thuDienTu,
            "soDienThoai": vm.thongTinCongDan.danhBaLienLac.soDienThoai,
            "ngaySinh": vm.ngaySinhCreate
          }
        }
        let filter = {
          applicantIdNo: String(vm.thongTinCongDan.maSoCaNhan).trim()
        }
        vm.$store.dispatch('searchApplicantCongDvc', filter).then(function (result) {
          if (result) {
            let filter2 = {
              applicantId: result.applicantId,
              data: dataUpdate
            }
            vm.$store.dispatch('updateApplicantCongDvc', filter2).then(function () {
            }).catch(function () {
            })
          }
        }).catch(function () {
        })
      },
      getDanhMucTinhThanh () {
        let vm = this
        let filter = {
          collectionName: 'tinhthanh',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: ''
          }
        }
        vm.$store.dispatch('collectionFilter', filter).then(function (response) {
          vm.itemsTinhThanh = response.content
        }).catch(function () {
        })
      },
      getDanhMuc () {
        let vm = this
        let filter = {
          collectionName: 'tongiao',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: ''
          }
        }
        vm.$store.dispatch('collectionFilter', filter).then(function (response) {
          vm.itemsTonGiao = response.content
        }).catch(function () {
        })
        let filter1 = {
          collectionName: 'dantoc',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: ''
          }
        }
        vm.$store.dispatch('collectionFilter', filter1).then(function (response) {
          vm.itemsDanToc = response.content
        }).catch(function () {
        })
        let filter2 = {
          collectionName: 'quocgia',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: ''
          }
        }
        vm.$store.dispatch('collectionFilter', filter2).then(function (response) {
          vm.itemsQuocTich = response.content
        }).catch(function () {
        })
        let filter3 = {
          collectionName: 'gioitinh',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: ''
          }
        }
        vm.$store.dispatch('collectionFilter', filter3).then(function (response) {
          vm.itemsGioiTinh = response.content
        }).catch(function () {
        })
      },
      changeTinhThanh (type) {
        let vm = this
        let danhMucCha = ''
        if (type === 'thuongtru') {
          danhMucCha = vm.thuongTruTinhThanh['maMuc']
        }
        if (type === 'noiohientai') {
          danhMucCha = vm.noiOHienTaiTinhThanh['maMuc']
        }
        let filter = {
          collectionName: 'quanhuyen',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: danhMucCha
          }
        }
        
        vm.$store.dispatch('collectionFilter', filter).then(function (response) {
          if (type === 'thuongtru') {
            vm.itemsThuongTruQuanHuyen = response.content
          }
          if (type === 'noiohientai') {
            vm.itemsNoiOHienTaiQuanHuyen = response.content
          }
        }).catch(function () {
        })
      },
      changeQuanHuyen (type) {
        let vm = this
        let danhMucCha = ''
        if (type === 'thuongtru') {
          danhMucCha = vm.thuongTruQuanHuyen['maMuc']
        }
        if (type === 'noiohientai') {
          danhMucCha = vm.noiOHienTaiQuanHuyen['maMuc']
        }
        let filter = {
          collectionName: 'phuongxa',
          data: {
            keyword: '',
            page: 0,
            size: 100,
            orderFields: 'maMuc',
            orderTypes: 'asc',
            tinhTrang: '1',
            thamChieu_maMuc: danhMucCha
          }
        }
        vm.$store.dispatch('collectionFilter', filter).then(function (response) {
          if (type === 'thuongtru') {
            vm.itemsThuongTruPhuongXa = response.content
          }
          if (type === 'noiohientai') {
            vm.itemsNoiOHienTaiPhuongXa = response.content
          }
        }).catch(function () {
        })
      },
      formatOutputData () {
        let vm = this
        vm.thongTinCongDan.ngaySinh = vm.convertDate(vm.ngaySinhCreate)
        vm.thongTinCongDan.diaChiThuongTru = {
          "phuongXa": {
            "maMuc": vm.thuongTruPhuongXa ? vm.thuongTruPhuongXa.maMuc : '',
            "tenMuc": vm.thuongTruPhuongXa ? vm.thuongTruPhuongXa.tenMuc : ''
          },
          "quanHuyen": {
            "maMuc": vm.thuongTruQuanHuyen ? vm.thuongTruQuanHuyen.maMuc : '',
            "tenMuc": vm.thuongTruQuanHuyen ? vm.thuongTruQuanHuyen.tenMuc : ''
          },
          "tinhThanh": {
            "maMuc": vm.thuongTruTinhThanh ? vm.thuongTruTinhThanh.maMuc : '',
            "tenMuc": vm.thuongTruTinhThanh ? vm.thuongTruTinhThanh.tenMuc : ''
          },
          "soNhaChiTiet": vm.diaChiThuongTruCuThe
        }
        vm.thongTinCongDan.noiOHienTai = {
          "phuongXa": {
            "maMuc": vm.noiOHienTaiPhuongXa ? vm.noiOHienTaiPhuongXa.maMuc : '',
            "tenMuc": vm.noiOHienTaiPhuongXa ? vm.noiOHienTaiPhuongXa.tenMuc : ''
          },
          "quanHuyen": {
            "maMuc": vm.noiOHienTaiQuanHuyen ? vm.noiOHienTaiQuanHuyen.maMuc : '',
            "tenMuc": vm.noiOHienTaiQuanHuyen ? vm.noiOHienTaiQuanHuyen.tenMuc : ''
          },
          "tinhThanh": {
            "maMuc": vm.noiOHienTaiTinhThanh ? vm.noiOHienTaiTinhThanh.maMuc : '',
            "tenMuc": vm.noiOHienTaiTinhThanh ? vm.noiOHienTaiTinhThanh.tenMuc : ''
          },
          "soNhaChiTiet": vm.noiOHienTaiCuThe
        }
        vm.thongTinCongDan.gioiTinh = {
          "maMuc": vm.gioiTinhCreate ? vm.gioiTinhCreate.maMuc : '',
          "tenMuc": vm.gioiTinhCreate ? vm.gioiTinhCreate.tenMuc : ''
        }
        vm.thongTinCongDan.quocTich = {
          "maMuc": vm.quocTichCreate ? vm.quocTichCreate.maMuc : '',
          "tenMuc": vm.quocTichCreate ? vm.quocTichCreate.tenMuc : ''
        }
        vm.thongTinCongDan.danToc = {
          "maMuc": vm.danTocCreate ? vm.danTocCreate.maMuc : '',
          "tenMuc": vm.danTocCreate ? vm.danTocCreate.tenMuc : ''
        }
        vm.thongTinCongDan.tonGiao = {
          "maMuc": vm.tonGiaoCreate ? vm.tonGiaoCreate.maMuc : '',
          "tenMuc": vm.tonGiaoCreate ? vm.tonGiaoCreate.tenMuc : ''
        }
        vm.thongTinCongDan.trangThaiDuLieu = {
          "maMuc": vm.trangThaiDuLieu ? '2' : '1',
          "tenMuc": vm.trangThaiDuLieu ? 'Đang sử dụng' : 'Đánh dấu xóa'
        }
        console.log('thongTinCongDanOutput', vm.thongTinCongDan)
      },
      formatInputData () {
        let vm = this
        vm.ngaySinhCreate = vm.dateLocale(vm.thongTinCongDan.ngaySinh)
        vm.gioiTinhCreate = vm.thongTinCongDan.gioiTinh
        vm.tonGiaoCreate = vm.thongTinCongDan.tonGiao
        vm.quocTichCreate = vm.thongTinCongDan.quocTich
        vm.danTocCreate = vm.thongTinCongDan.danToc
        vm.trangThaiDuLieu = vm.thongTinCongDan.trangThaiDuLieu.maMuc == '2' ? true : false 
        vm.noiOHienTaiCuThe = vm.thongTinCongDan.noiOHienTai.soNhaChiTiet
        vm.diaChiThuongTruCuThe = vm.thongTinCongDan.diaChiThuongTru.soNhaChiTiet
        vm.thuongTruTinhThanh = vm.thongTinCongDan.diaChiThuongTru.tinhThanh
        vm.thuongTruQuanHuyen = vm.thongTinCongDan.diaChiThuongTru.quanHuyen
        vm.thuongTruPhuongXa = vm.thongTinCongDan.diaChiThuongTru.phuongXa
        vm.noiOHienTaiTinhThanh = vm.thongTinCongDan.noiOHienTai.tinhThanh
        vm.noiOHienTaiQuanHuyen = vm.thongTinCongDan.noiOHienTai.quanHuyen
        vm.noiOHienTaiPhuongXa = vm.thongTinCongDan.noiOHienTai.phuongXa
        
      },
      formatBirthDate () {
        let vm = this
        let lengthDate = String(vm.ngaySinhCreate).trim().length
        let splitDate = String(vm.ngaySinhCreate).split('/')
        if (lengthDate && lengthDate > 4 && splitDate.length === 3 && splitDate[2]) {
          vm.ngaySinhCreate = vm.translateDate(vm.ngaySinhCreate)
        } else if (lengthDate && lengthDate === 8) {
          let date = String(vm.ngaySinhCreate)
          vm.ngaySinhCreate = date.slice(0,2) + '/' + date.slice(2,4) + '/' + date.slice(4,8)
        } else {
          vm.ngaySinhCreate = ''
        }
      },
      translateDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      },
      dateLocale (dateInput) {
        let date = new Date(dateInput)
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      },
      convertDate (date) {
        if (!date) return ''
        const [day, month, year] = date.split('/')
        let ddd = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        return (new Date(ddd)).toISOString()
      },
      convertDateLgsp (date) {
        if (!date) return ''
        const [day, month, year] = date.split('/')
        let ddd = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        return ddd
      },
      goBack () {
        window.history.back()
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
    }
}
</script>