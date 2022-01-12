<template>
    <div>
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span v-if="typeAction == 'update'">CẬP NHẬT THÔNG TIN TỔ CHỨC, DOANH NGHIỆP</span>
          <span v-if="typeAction == 'add'">THÊM MỚI TỔ CHỨC, DOANH NGHIỆP</span>
        </div>
        <div class="layout row wrap header_tools row-blue mx-1">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          </div>
        </div>
      </div>
      <v-form lazy-validation ref="formAddCaNhan" v-model="validFormAdd">
          <v-layout wrap class="py-2">
            <v-flex xs12 class="py-0 mb-2 pr-3">
              <label>
                Trạng thái thông tin <span class="red--text">(*)</span>
              </label>
              <v-switch color="primary" class="mt-2" v-model="trangThaiDuLieu">
                <template slot="label">
                  <span class="ml-2" style="color: black">{{trangThaiDuLieu ? 'ĐANG SỬ DỤNG' : 'ĐÁNH DẤU XÓA'}}</span>
                </template>
              </v-switch>
              
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2 pr-3">
                <label>Tên tổ chức, doanh nghiệp <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="thongTinDoanhNghiep.tenGoi"
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
                <label>Mã số tổ chức, doanh nghiệp <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="thongTinDoanhNghiep.maSoDoanhNghiep"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="required"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2 pr-3">
                <label>Tên viết tắt <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="thongTinDoanhNghiep.tenVietTat"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="required"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2">
                <label>Tên tiếng anh <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="thongTinDoanhNghiep.tenTiengAnh"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="required"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2 pr-3">
                <label>Email</label>
                <v-text-field
                    class="input-form"
                    v-model="thongTinDoanhNghiep.danhBaLienLac['thuDienTu']"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0">
                <label>Điện thoại</label>
                <v-text-field
                    class="input-form"
                    v-model="thongTinDoanhNghiep.danhBaLienLac['soDienThoai']"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2 pr-3">
                <label>Họ tên người đại diện</label>
                <v-text-field
                    class="input-form"
                    v-model="thongTinDoanhNghiep.nguoiDaiDien['hoVaTen']"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="py-0 mb-2">
                <label>Số CMND/ CCCD người đại diện</label>
                <v-text-field
                    class="input-form"
                    v-model="thongTinDoanhNghiep.nguoiDaiDien['maSoCaNhan']"
                    solo
                    dense
                    clearable
                    max
                    hide-details="auto"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 class="py-0 mb-2">
                <label>Địa chỉ hoạt động</label>
                <v-text-field
                  class="input-form"
                  v-model="diaChiHoatDongCuThe"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  placeholder="Số nhà, đường, phố ..."
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
        itemsTinhThanh: [],
        diaChiHoatDongCuThe: '',
        thuongTruTinhThanh: '',
        itemsThuongTruQuanHuyen: [],
        thuongTruQuanHuyen: '',
        itemsThuongTruPhuongXa: [],
        thuongTruPhuongXa: '',
        thongTinDoanhNghiep: {
          danhBaLienLac: {
            "soDienThoai": "",
            "soFax": "",
            "thuDienTu": ""
          },
          diaChiHoatDong: {
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
          maDinhDanh: "",
          giayCapPhepKinhDoanh: [],
          giayDangKyKinhDoanh: [],
          maSoDoanhNghiep: "",
          nguoiDaiDien: {
            "hoVaTen": "",
            "maDinhDanh": "",
            "maSoCaNhan": ""
          },
          tenGoi: "",
          tenTiengAnh: "",
          tenVietTat: "",
          tinhTrangToChuc: {
            "maMuc": "",
            "tenMuc": ""
          },
          trangThaiDuLieu: {
            "maMuc": "",
            "tenMuc": ""
          },
          vaiTroSuDung: []
        },
        required: [
          v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'
        ],
        trangThaiDuLieu: true
      }
    },
    created () {
      let vm = this
      vm.$store.commit('SET_INDEXTAB', 2)
      vm.getDanhMucTinhThanh()
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
        vm.$store.commit('SET_INDEXTAB', 2)
        vm.getDanhMucTinhThanh()
        if (vm.id != 0) {
          vm.typeAction = 'update'
          vm.getThongTinCongDan()
        } else {
          vm.typeAction = 'add'
        }
      },
      thuongTruTinhThanh () {
        let vm = this
        vm.changeTinhThanh()
      },
      thuongTruQuanHuyen () {
        let vm = this
        vm.changeQuanHuyen()
      }
    },
    methods: {
      getThongTinCongDan () {
        let vm = this
        let filter = {
          collectionName: 'donvikinhdoanh',
          id: vm.id
        }
        vm.$store.dispatch('collectionDetail', filter).then(function (response) {
          let data = response.resp
          if (data) {
            for (let key in vm.thongTinDoanhNghiep) {
              if (data.hasOwnProperty(key)) {
                vm.thongTinDoanhNghiep[key] = data[key]
              }
            }
          }
          vm.formatInputData()
          console.log('dataCongDan', vm.thongTinDoanhNghiep)
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
            collectionName: 'donvikinhdoanh',
            data: vm.thongTinDoanhNghiep
          }
          vm.$store.dispatch('collectionCreate', filter).then(function (result) {
            vm.loading = false
            toastr.remove()
            toastr.success('Thêm mới thành công')
            window.history.back()
          }).catch(function (response) {
            vm.loading = false
            toastr.remove()
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
            collectionName: 'donvikinhdoanh',
            id: vm.id,
            data: vm.thongTinDoanhNghiep
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
        let danhMucCha = vm.thuongTruTinhThanh['maMuc']
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
          vm.itemsThuongTruQuanHuyen = response.content
        }).catch(function () {
        })
      },
      changeQuanHuyen (type) {
        let vm = this
        let danhMucCha =  vm.thuongTruQuanHuyen['maMuc']
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
            vm.itemsThuongTruPhuongXa = response.content
        }).catch(function () {
        })
      },
      formatOutputData () {
        let vm = this
        vm.thongTinDoanhNghiep.diaChiHoatDong = {
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
          "soNhaChiTiet": vm.diaChiHoatDongCuThe
        }
        vm.thongTinDoanhNghiep.trangThaiDuLieu = {
          "maMuc": vm.trangThaiDuLieu ? '2' : '1',
          "tenMuc": vm.trangThaiDuLieu ? 'Đang sử dụng' : 'Đánh dấu xóa'
        }
        console.log('thongTinCongDanOutput', vm.thongTinDoanhNghiep)
      },
      formatInputData () {
        let vm = this
        vm.diaChiHoatDongCuThe = vm.thongTinDoanhNghiep.diaChiHoatDong.soNhaChiTiet
        vm.thuongTruTinhThanh = vm.thongTinDoanhNghiep.diaChiHoatDong.tinhThanh
        vm.thuongTruQuanHuyen = vm.thongTinDoanhNghiep.diaChiHoatDong.quanHuyen
        vm.thuongTruPhuongXa = vm.thongTinDoanhNghiep.diaChiHoatDong.phuongXa
        vm.trangThaiDuLieu = vm.thongTinDoanhNghiep.trangThaiDuLieu.maMuc == '2' ? true : false 
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