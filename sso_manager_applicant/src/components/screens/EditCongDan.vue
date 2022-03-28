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
        <v-form lazy-validation ref="formAddCaNhan" v-model="validFormAdd">
          <v-layout wrap class="py-2">
              <v-flex xs12 class="py-0 mb-2 pr-3">
                <label>Trạng thái thông tin <span class="red--text">(*)</span></label>
                <v-switch color="primary" class="mt-2" v-model="trangThaiDuLieu">
                  <template slot="label">
                    <span class="ml-2" style="color: black">{{trangThaiDuLieu ? 'ĐANG SỬ DỤNG' : 'ĐÁNH DẤU XÓA'}}</span>
                  </template>
                </v-switch>
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
                  <label>CMND/CCCD <span class="red--text">(*)</span></label>
                  <v-text-field
                    class="input-form"
                    v-model="thongTinCongDan.maSoCaNhan"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                    :rules="required"
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
                  <label>Giới tính <span class="red--text">(*)</span></label>
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
                    :rules="required"
                    required
                    placeholder="Chọn giới tính"
                    return-object
                  >
                  </v-autocomplete>
              </v-flex>
              <v-flex xs12 md3 class="py-0 pr-3">
                  <label>Dân tộc <span class="red--text">(*)</span></label>
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
                    :rules="required"
                    required
                    placeholder="Chọn dân tộc"
                    return-object
                  >
                  </v-autocomplete>
              </v-flex>
              <v-flex xs12 md3 class="py-0">
                  <label>Quốc tịch <span class="red--text">(*)</span></label>
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
                    :rules="required"
                    required
                    placeholder="Chọn quốc tịch"
                    return-object
                  >
                  </v-autocomplete>
              </v-flex>
              <v-flex xs12 md6 class="py-0 mb-2 pr-3">
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
              <v-flex xs12 md3 class="py-0 pr-3">
                  <label>Điện thoại</label>
                  <v-text-field
                      class="input-form"
                      v-model="thongTinCongDan.danhBaLienLac['soDienThoai']"
                      solo
                      dense
                      clearable
                      max
                      hide-details="auto"
                  ></v-text-field>
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
    </div>
</template>

<script>
import Vue from 'vue'
import toastr from 'toastr'
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
          ngaySinh: "1991-11-26T03:25:43.979Z",
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
          }
        },
        required: [
          v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'
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
        vm.loading = true
        if (vm.$refs.formAddCaNhan.validate()) {
          let filter = {
            collectionName: 'canhan',
            data: vm.thongTinCongDan
          }
          vm.$store.dispatch('collectionCreate', filter).then(function (result) {
            vm.loading = false
            toastr.remove()
            toastr.success('Thêm mới thành công')
            // window.history.back()
            let data = result.resp
            vm.$router.push({ path: '/thong-tin-ca-nhan/' + data.primKey })
          }).catch(function (response) {
            vm.loading = false
            toastr.remove()
            // if (response && response.status == 409) {
            //   toastr.error('Mã danh mục đã tồn tại')
            //   return
            // }
            toastr.error('Thêm mới thất bại')
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
            window.history.back()
          }).catch(function (response) {
            vm.loading = false
            toastr.remove()
            toastr.error('Cập nhật thông tin thất bại')
          })
        } else {
          vm.loading = false
        }
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
            "maMuc": vm.thuongTruPhuongXa.maMuc,
            "tenMuc": vm.thuongTruPhuongXa.tenMuc
          },
          "quanHuyen": {
            "maMuc": vm.thuongTruQuanHuyen.maMuc,
            "tenMuc": vm.thuongTruQuanHuyen.tenMuc
          },
          "tinhThanh": {
            "maMuc": vm.thuongTruTinhThanh.maMuc,
            "tenMuc": vm.thuongTruTinhThanh.tenMuc
          },
          "soNhaChiTiet": vm.diaChiThuongTruCuThe
        }
        vm.thongTinCongDan.noiOHienTai = {
          "phuongXa": {
            "maMuc": vm.noiOHienTaiPhuongXa.maMuc,
            "tenMuc": vm.noiOHienTaiPhuongXa.tenMuc
          },
          "quanHuyen": {
            "maMuc": vm.noiOHienTaiQuanHuyen.maMuc,
            "tenMuc": vm.noiOHienTaiQuanHuyen.tenMuc
          },
          "tinhThanh": {
            "maMuc": vm.noiOHienTaiTinhThanh.maMuc,
            "tenMuc": vm.noiOHienTaiTinhThanh.tenMuc
          },
          "soNhaChiTiet": vm.noiOHienTaiCuThe
        }
        vm.thongTinCongDan.gioiTinh = {
          "maMuc": vm.gioiTinhCreate.maMuc,
          "tenMuc": vm.gioiTinhCreate.tenMuc
        }
        vm.thongTinCongDan.quocTich = {
          "maMuc": vm.quocTichCreate.maMuc,
          "tenMuc": vm.quocTichCreate.tenMuc
        }
        vm.thongTinCongDan.danToc = {
          "maMuc": vm.danTocCreate.maMuc,
          "tenMuc": vm.danTocCreate.tenMuc
        }
        vm.thongTinCongDan.tonGiao = {
          "maMuc": vm.tonGiaoCreate.maMuc,
          "tenMuc": vm.tonGiaoCreate.tenMuc
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
        vm.diaChiThuongTruCuThe = vm.thongTinCongDan.diaChiThuongTru.soNhaChiTiet
        vm.thuongTruTinhThanh = vm.thongTinCongDan.diaChiThuongTru.tinhThanh
        vm.thuongTruQuanHuyen = vm.thongTinCongDan.diaChiThuongTru.quanHuyen
        vm.thuongTruPhuongXa = vm.thongTinCongDan.diaChiThuongTru.phuongXa
        vm.noiOHienTaiTinhThanh = vm.thongTinCongDan.noiOHienTai.tinhThanh
        vm.noiOHienTaiQuanHuyen = vm.thongTinCongDan.noiOHienTai.quanHuyen
        vm.noiOHienTaiPhuongXa = vm.thongTinCongDan.noiOHienTai.phuongXa
        vm.noiOHienTaiCuThe = vm.thongTinCongDan.noiOHienTai.soNhaChiTiet
        vm.trangThaiDuLieu = vm.thongTinCongDan.trangThaiDuLieu.maMuc == '2' ? true : false 
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
      goBack () {
        window.history.back()
      }
    }
}
</script>