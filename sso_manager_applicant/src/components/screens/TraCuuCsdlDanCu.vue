<template>
    <div>
      <v-form lazy-validation ref="formAddCaNhan" v-model="validFormAdd" class="px-2">
        <v-layout wrap class="py-2">
            <v-flex xs12 md4 class="py-0 mb-2 pr-3">
                <label>Họ tên <span class="red--text">(*)</span></label>
                <v-text-field
                  class="input-form"
                  v-model="hoVaTenCreate"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="required"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md4 class="py-0 pr-3">
                <label>CMND/CCCD <span class="red--text">(*)</span> <i> (Gồm 9 hoặc 12 ký tự)</i></label>
                <v-text-field
                  class="input-form"
                  v-model="maSoCaNhanCreate"
                  solo
                  dense
                  clearable
                  max
                  hide-details="auto"
                  :rules="requiredCredit"
                  required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 md3 class="py-0 mb-2">
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
            <v-flex xs12 class="text-center">
                <v-btn color="primary" class="mt-3 mx-2  text-white" @click.native="checkCsdldc()" :loading="loadingSearchLgsp" :disabled="loadingSearchLgsp">
                    <v-icon
                        left
                        dark
                        size="20"
                    >
                      save
                    </v-icon> &nbsp;Tra cứu thông tin
                </v-btn>
            </v-flex>
            <v-layout wrap v-if="applicantLgspInfomation">
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
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Địa chỉ thường trú</span></td>
                        <td class="pt-2">
                          <span>{{applicantLgspInfomation.ThuongTru.ChiTiet}}</span>
                          <span>, {{diaChiThuongTruTraCuuQr}}</span>
                        </td>
                      </tr>
                      <tr>
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

                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Họ và tên vợ/ chồng</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.HoVaTen}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Quốc tịch</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.QuocTich == 'VN' ? 'Việt Nam' : applicantLgspInfomation.VoChong.QuocTich}}</span></td>
                      </tr>
                      <tr>
                        <td width="200" class="pt-2"><span class="text-bold">Số định danh cá nhân/ CCCD</span></td>
                        <td class="pt-2"><span>{{applicantLgspInfomation.VoChong.SoDinhDanh}}</span></td>
                      </tr>
                      <tr>
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
            <v-flex xs12 v-if="showError" class="mb-5 mt-3">
              <v-alert
                :value="true"
                color="red"
                icon="warning"
                outline
                class="px-2 py-2"
                style="max-width: 700px;"
              >
                <span>{{messageLgsp}}</span>
              </v-alert>
            </v-flex>
        </v-layout>
      </v-form>
    </div>
</template>

<script>
import toastr from 'toastr'
import support from '../../store/support.json'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000',
  "positionClass": "toast-top-center"
}
export default {
    props: ["id", "hoVaTen", "maSoCaNhan", "ngaySinh", "employeeEmail"],
    data() {
      return {
        diaChiThuongTruTraCuuQr: '',
        noiOHienTaiTraCuuQr: '',
        danhmuctongiao: support.danhmuctongiao,
        danhmucdantoc: support.danhmucdantoc,
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
        hoVaTenCreate: '',
        maSoCaNhanCreate: '',
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
        trangThaiDuLieu: true,
        messageLgsp: '',
        showError: false
      }
    },
    created () {
      let vm = this
      vm.getDanhMucTinhThanh()
      vm.getDanhMuc()
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
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
      initData () {
        let vm = this
        vm.hoVaTenCreate = vm.hoVaTen
        vm.maSoCaNhanCreate = vm.maSoCaNhan
        vm.ngaySinhCreate = vm.ngaySinh
        vm.showError = false
        vm.applicantLgspInfomation = ''
      },
      checkCsdldc () {
        let vm = this
        if (String(vm.maSoCaNhanCreate).trim() && String(vm.hoVaTenCreate).trim() && String(vm.ngaySinhCreate).trim()) {
          let filter = {
            applicantIdNo: vm.maSoCaNhanCreate,
            applicantName: vm.convertString((String(vm.hoVaTenCreate).trim())).toUpperCase(),
            birthDate: vm.convertDateLgsp(vm.ngaySinhCreate),
            StaffEmail : vm.employeeEmail
          }
          vm.loadingSearchLgsp = true
          vm.$store.dispatch('searchLgspCongDan', filter).then(result => {
            vm.loadingSearchLgsp = false
            vm.applicantLgspInfomation = result
            if (vm.applicantLgspInfomation) {
              // Lấy thông tin thường trú
              vm.showError = false
              let dataThuongTru = {
                ThuongTruTinhThanh: '',
                ThuongTruQuanHuyen: '',
                ThuongTruXaPhuong: ''
              }
              let city = vm.itemsTinhThanh.find(function (item) {
                return item.maMuc == vm.applicantLgspInfomation.ThuongTru.MaTinhThanh
              })
              dataThuongTru.ThuongTruTinhThanh = city ? city.tenMuc : ''
              if (city) {
                let filter = {
                  collectionName: 'quanhuyen',
                  data: {
                    keyword: '',
                    page: 0,
                    size: 100,
                    orderFields: 'maMuc',
                    orderTypes: 'asc',
                    tinhTrang: '1',
                    thamChieu_maMuc: city.maMuc
                  }
                }
                
                vm.$store.dispatch('collectionFilter', filter).then(function (resultDistricts) {
                  let quanhuyen = resultDistricts.content.find(function (item) {
                    return item.maMuc == vm.applicantLgspInfomation.ThuongTru.MaQuanHuyen
                  })
                  dataThuongTru.ThuongTruQuanHuyen = quanhuyen ? quanhuyen.tenMuc : ''
                  if (quanhuyen) {
                    let filter = {
                      collectionName: 'phuongxa',
                      data: {
                        keyword: '',
                        page: 0,
                        size: 100,
                        orderFields: 'maMuc',
                        orderTypes: 'asc',
                        tinhTrang: '1',
                        thamChieu_maMuc: quanhuyen.maMuc
                      }
                    }
                    
                    vm.$store.dispatch('collectionFilter', filter).then(function (resultWards) {
                      let xaphuong = resultWards.content.find(function (item) {
                        return item.maMuc == vm.applicantLgspInfomation.ThuongTru.MaPhuongXa
                      })
                      dataThuongTru.ThuongTruXaPhuong = xaphuong ? xaphuong.tenMuc : ''
                      vm.diaChiThuongTruTraCuuQr = dataThuongTru.ThuongTruXaPhuong + ', ' + dataThuongTru.ThuongTruQuanHuyen + ', ' + dataThuongTru.ThuongTruTinhThanh
                    })
                  }
                })
              }

              let dataNoiOHienTai = {
                TinhThanh: '',
                QuanHuyen: '',
                XaPhuong: ''
              }
              let city1 = vm.itemsTinhThanh.find(function (item) {
                return item.maMuc == vm.applicantLgspInfomation.NoiOHienTai.MaTinhThanh
              })
              dataNoiOHienTai.TinhThanh = city1 ? city1.tenMuc : ''
              if (city1) {
                let filter = {
                  collectionName: 'quanhuyen',
                  data: {
                    keyword: '',
                    page: 0,
                    size: 100,
                    orderFields: 'maMuc',
                    orderTypes: 'asc',
                    tinhTrang: '1',
                    thamChieu_maMuc: city1.maMuc
                  }
                }
                
                vm.$store.dispatch('collectionFilter', filter).then(function (resultDistricts) {
                  let quanhuyen = resultDistricts.content.find(function (item) {
                    return item.maMuc == vm.applicantLgspInfomation.NoiOHienTai.MaQuanHuyen
                  })
                  dataNoiOHienTai.QuanHuyen = quanhuyen ? quanhuyen.tenMuc : ''
                  if (quanhuyen) {
                    let filter = {
                      collectionName: 'phuongxa',
                      data: {
                        keyword: '',
                        page: 0,
                        size: 100,
                        orderFields: 'maMuc',
                        orderTypes: 'asc',
                        tinhTrang: '1',
                        thamChieu_maMuc: quanhuyen.maMuc
                      }
                    }
                    
                    vm.$store.dispatch('collectionFilter', filter).then(function (resultWards) {
                      let xaphuong = resultWards.content.find(function (item) {
                        return item.maMuc == vm.applicantLgspInfomation.NoiOHienTai.MaPhuongXa
                      })
                      dataNoiOHienTai.XaPhuong = xaphuong ? xaphuong.tenMuc : ''
                      vm.noiOHienTaiTraCuuQr = vm.applicantLgspInfomation.NoiOHienTai.ChiTiet + ' ' + dataNoiOHienTai.XaPhuong + ', ' + dataNoiOHienTai.QuanHuyen + ', ' + dataNoiOHienTai.TinhThanh
                    })
                  }
                })
              }
              // 
            } else {
              vm.showError = true
              vm.messageLgsp = 'Số CCCD/ CMND: "' + vm.maSoCaNhanCreate + '", họ tên: "' + vm.hoVaTenCreate + '", ngày sinh: "'+ vm.ngaySinhCreate + '" không có thông tin trên CSDL quốc gia về dân cư'
            }
          }).catch(function (result) {
            vm.showError = true
            vm.applicantLgspInfomation = ''
            vm.loadingSearchLgsp = false
            vm.messageLgsp = 'Lỗi hệ thống'
          })
        } else {
          toastr.remove()
          toastr.error('Vui lòng nhập đầy đủ Họ tên, Số CMND/CCCD và Ngày sinh để tra cứu')
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
    }
}
</script>