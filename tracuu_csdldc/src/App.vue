<template>
  <v-app id="app_tracuu_csdldc" style="background: #fff !important">
    <v-content style="width: 100%;max-width: 1300px;margin: 0 auto">
      <v-card-text class="py-1">
        <v-form ref="formLgsp" v-model="valid" class="py-3 px-3 grid-list"
          style="max-width: 1000px;
          border: 2px solid rgb(222, 222, 222);
          border-radius: 10px;
          margin: 0 auto;
          margin-top: 10px;"
        >
          <v-layout row wrap class="px-0 py-0">
            <div class="flex xs12" style="
                text-align: center;
                font-size: 20px;
                margin-bottom: 20px;
                color: #658a04;
                font-weight: 600;
            ">
              <span>TRA CỨU THÔNG TIN CÔNG DÂN TRÊN CƠ SỞ DỮ LIỆU QUỐC GIA VỀ DÂN CƯ</span>
            </div>
            <v-flex class="xs12 md4 px-2">
              <div class="text-label mb-2">
                <span style="font-size: 14px;font-weight: 500;color: #465f06;">Họ và tên công dân</span>
                <span class="red--text"> (*)</span>
              </div>
              <v-text-field v-model="applicantNameLgsp" :rules="[rules.required]" solo dense hide-details="auto"
                clearable autofocus @keyup.enter=" traCuuThongTin()"></v-text-field>
            </v-flex>
            <v-flex class="xs12 md4 px-2">
              <div class="text-label mb-2">
                <span style="font-size: 14px;font-weight: 500;color: #465f06;">Số CMND/CCCD</span>
                <span class="red--text"> (*)</span>
              </div>
              <v-text-field id="soCanCuocTraCuu" v-model="applicantIdNoLgsp" solo dense hide-details="auto"
                clearable :rules="[rules.required, rules.credit]"
                @keyup.enter="traCuuThongTin()"
              >
              </v-text-field>
            </v-flex>
            <v-flex class="xs12 md4 px-2">
              <div class="text-label mb-2">
                <span style="font-size: 14px;font-weight: 500;color: #465f06;">Ngày sinh</span>
                <span class="red--text"> (*)</span>
              </div>
              <v-menu
                ref="menuApplicantIdDate"
                :close-on-content-click="false"
                v-model="menuApplicantIdDate"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  label="Ngày sinh"
                  :rules="[rules.required]"
                  solo dense hide-details="auto"
                  slot="activator"
                  v-model="applicantBirthDate"
                  append-icon="event"
                  @blur="ngaysinh = parseDate(applicantBirthDate)"
                  placeholder="dd/mm/yyyy"
                  mask="##/##/####"
                ></v-text-field>
                <v-date-picker min="1900-01-01" :max="getMaxdate()" ref="picker"
                :first-day-of-week="1" locale="vi" v-model="ngaysinh" no-title @input="menuApplicantIdDate = false"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 class="my-2 mt-3" style="text-align: center;">
              <v-btn color="primary"
                @click="traCuuThongTin"
                :loading="loadingSearchLgsp"
                :disabled="loadingSearchLgsp"
                class="mx-0 my-0"
                style="height: 36px;width: 200px;"
              >
                <v-icon size="20">search</v-icon>
                &nbsp;
                TRA CỨU THÔNG TIN
                <span slot="loader">Đang tra cứu...</span>
              </v-btn>
            </v-flex>
            
          </v-layout>
        </v-form>
        <v-flex xs12 v-if="warningLgsp" style="margin-top: 30px;">
          <v-alert
            :value="true"
            color="red"
            icon="warning"
            outline
            class="px-2 py-2"
            style="max-width: 750px;"
          >
            <span>{{messageLgsp}}</span>
          </v-alert>
        </v-flex>
        <v-layout wrap v-if="applicantLgspInfomation" style="max-width: 1000px; margin: 0 auto;">
          <div class="flex xs12" style="
              text-align: center;
              font-size: 20px;
              margin: 15px;
              color: #658a04;
              margin-bottom: 0px;
              font-weight: 600;
          ">
            <span>THÔNG TIN CÔNG DÂN</span>
          </div>
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
                      <span>, {{diaChiThuongTru}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td width="200" class="pt-2"><span class="text-bold">Nơi ở hiện tại</span></td>
                    <td class="pt-2">
                      <span>{{noiOHienTaiTra}}</span>
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

                  <tr style="background-color: #ededed;">
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
                  <tr style="background-color: #ededed;">
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
                  
                  <tr style="background-color: #ededed;">
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
      </v-card-text>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import toastr from 'toastr'
  import axios from 'axios'
  import support from './support.json'
  Vue.use(toastr)
  toastr.options = {
    'positionClass': 'toast-top-center',
    'timeOut': '5000'
  }
  export default {
    data: () => ({
      danhmuctongiao: support.danhmuctongiao,
      danhmucdantoc: support.danhmucdantoc,
      isMobile: false,
      valid: false,
      applicantNameLgsp: '',
      applicantIdNoLgsp: '',
      ngaysinh: null,
      menuApplicantIdDate: false,
      applicantBirthDate: null,
      loadingSearchLgsp: false,
      applicantLgspInfomation: '',
      messageLgsp: '',
      warningLgsp: '',
      noiOHienTaiTra: '',
      diaChiThuongTru: '',
      citys: [],
      rules: {
        required: (value) => !!value || 'Thông tin bắt buộc',
        cmndHoChieu: (value) => {
          const pattern = /^(?![0-9]{4,12})[0-9a-zA-Z]{4,12}$/
          return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 4-12 ký tự'
        },
        credit: (value) => {
          if (value) {
            if (value.length === 9) {
              const pattern = /^(([0-9]{9,9}))$/
              return pattern.test(value) || 'Số CCCD, số CMND gồm 9 hoặc 12 ký tự 0-9'
            } else {
              const pattern = /^(([0-9]{12,12}))$/
              return pattern.test(value) || 'Số CCCD, số CMND gồm 9 hoặc 12 ký tự 0-9'
            }
          } else {
            return true
          }
        }
      },
    }),
    computed: {
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        let paramGetUser = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        axios.get('/o/v1/opencps/users/' + window.themeDisplay.getUserId(), paramGetUser).then(function(response) {
          vm.userLoginInfomation = response.data
        })
        let param = {
          headers: {
            groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : '',
            'Token': window.Liferay ? window.Liferay.authToken : ''
          }
        }
        axios.get('/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?parent=0', param).then(function (response) {
          let serializable = response.data
          vm.citys = serializable.data
        }, error => {
        })
      })
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
      },
      ngaysinh (val) {
        this.applicantBirthDate = this.formatDate(val)
      },
      menuApplicantIdDate (val) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      }
    },
    methods: {
      onResize () {
        let vm = this
        vm.isMobile = window.innerWidth < 1024
      },
      traCuuThongTin () {
        let vm = this
        if (vm.applicantIdNoLgsp && vm.applicantNameLgsp && String(vm.applicantIdNoLgsp).trim() && String(vm.applicantNameLgsp).trim() && vm.applicantBirthDate && String(vm.applicantBirthDate).length === 8) {
          if (String(vm.applicantIdNoLgsp).trim().length !== 9 && String(vm.applicantIdNoLgsp).trim().length !== 12) {
            toastr.error('Số CMND/CCCD gồm 9 số hoặc 12 số.')
            return;
          }
          let dateInput = ''
          if (String(vm.applicantBirthDate).indexOf('/') > 0) {
            let date = String(vm.applicantBirthDate).split('/')
            dateInput = date[2] + '-' + date[1] + '-' + date[0]
          } else {
            dateInput = String(vm.applicantBirthDate).substring(4,8) + '-' + String(vm.applicantBirthDate).substring(2,4) + '-' + String(vm.applicantBirthDate).substring(0,2)
          }
          vm.loadingSearchLgsp = true
          let config = {
            headers: {
              groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
            },
            params: {}
          }
          let dataInput = {
            "MaYeuCau" : (new Date()).getTime(),
            "MaTichHop" : "037",
            "StaffEmail" : vm.userLoginInfomation && vm.userLoginInfomation.hasOwnProperty('employeeEmail') ? vm.userLoginInfomation.employeeEmail : '',
            "GovAgencyCode": "",
            "MaDVC" : "",
            "HoVaTen" : vm.convertString(String(vm.applicantNameLgsp).trim()).toUpperCase(),
            "type" : "TraCuuThongTinCongDan",
            "NgayThangNamSinh" : dateInput,
          }
          
          if (String(vm.applicantIdNoLgsp).length === 9) {
            dataInput['SoCMND'] = vm.applicantIdNoLgsp
          } else {
            dataInput['SoDinhDanh'] = vm.applicantIdNoLgsp
          }
          console.log('dataInput', dataInput)
          axios({
            method: 'POST',
            url: "/o/rest/v2/qldc/dvcqg",
            headers: config.headers,
            params: config.params,
            data: dataInput
          }).then(function (response) {
            vm.loadingSearchLgsp = false
            let serializable = response.data
            if (serializable && serializable.hasOwnProperty('Body') && serializable["Body"].hasOwnProperty('CongdanCollection') && serializable["Body"]["CongdanCollection"]) {
              let data = serializable["Body"]["CongdanCollection"].hasOwnProperty("CongDan") && serializable["Body"]["CongdanCollection"]["CongDan"] ?serializable["Body"]["CongdanCollection"]["CongDan"] : ''
              vm.warningLgsp = false
              vm.applicantLgspInfomation = data

              if (vm.applicantLgspInfomation) {
                vm.messageLgsp = 'Số CCCD/ CMND: "' + vm.applicantIdNoLgsp + '", họ tên: "' + vm.applicantNameLgsp + '" có thông tin trên CSDL quốc gia về dân cư'
                // Lấy thông tin thường trú
                let dataThuongTru = {
                  ThuongTruTinhThanh: '',
                  ThuongTruQuanHuyen: '',
                  ThuongTruXaPhuong: ''
                }
                let city = vm.citys.find(function (item) {
                  return item.itemCode == vm.applicantLgspInfomation.ThuongTru.MaTinhThanh
                })
                dataThuongTru.ThuongTruTinhThanh = city ? city.itemName : ''
                if (city) {
                  let param = {
                    headers: {
                      groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : '',
                      'Token': window.Liferay ? window.Liferay.authToken : ''
                    }
                  }
                  axios.get('/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?parent=' + city.itemCode, param).then(function (response) {
                    let resultDistricts = response.data
                    let quanhuyen = resultDistricts.data.find(function (item) {
                      return item.itemCode == vm.applicantLgspInfomation.ThuongTru.MaQuanHuyen
                    })
                    dataThuongTru.ThuongTruQuanHuyen = quanhuyen ? quanhuyen.itemName : ''
                    if (quanhuyen) {
                      axios.get('/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?parent=' + quanhuyen.itemCode, param).then(function (response1) {
                        let resultWards = response1.data
                        let xaphuong = resultWards.data.find(function (item) {
                          return item.itemCode == vm.applicantLgspInfomation.ThuongTru.MaPhuongXa
                        })
                        dataThuongTru.ThuongTruXaPhuong = xaphuong ? xaphuong.itemName : ''
                        vm.diaChiThuongTru = dataThuongTru.ThuongTruXaPhuong + ', ' + dataThuongTru.ThuongTruQuanHuyen + ', ' + dataThuongTru.ThuongTruTinhThanh
                        console.log('diaChiThuongTru', vm.diaChiThuongTru)
                      })
                    }
                  }, error => {
                  })
                }

                let dataNoiOHienTai = {
                  TinhThanh: '',
                  QuanHuyen: '',
                  XaPhuong: ''
                }
                let city1 = vm.citys.find(function (item) {
                  return item.itemCode == vm.applicantLgspInfomation.NoiOHienTai.MaTinhThanh
                })
                dataNoiOHienTai.TinhThanh = city1 ? city1.itemName : ''
                if (city1) {
                  let param = {
                    headers: {
                      groupId: window.themeDisplay.getScopeGroupId() ? window.themeDisplay.getScopeGroupId() : '',
                      'Token': window.Liferay ? window.Liferay.authToken : ''
                    }
                  }
                  axios.get('/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?parent=' + city1.itemCode, param).then(function (response) {
                    let resultDistricts = response.data
                    let quanhuyen = resultDistricts.data.find(function (item) {
                      return item.itemCode == vm.applicantLgspInfomation.NoiOHienTai.MaQuanHuyen
                    })
                    dataNoiOHienTai.QuanHuyen = quanhuyen ? quanhuyen.itemName : ''
                    if (quanhuyen) {
                      axios.get('/o/rest/v2/dictcollections/ADMINISTRATIVE_REGION/dictitems?parent=' + quanhuyen.itemCode, param).then(function (response) {
                        let resultWards = response.data
                        let xaphuong = resultWards.data.find(function (item) {
                          return item.itemCode == vm.applicantLgspInfomation.NoiOHienTai.MaPhuongXa
                        })
                        dataNoiOHienTai.XaPhuong = xaphuong ? xaphuong.itemName : ''
                        vm.noiOHienTaiTra = vm.applicantLgspInfomation.NoiOHienTai.ChiTiet + ' ' + dataNoiOHienTai.XaPhuong + ', ' + dataNoiOHienTai.QuanHuyen + ', ' + dataNoiOHienTai.TinhThanh
                      })
                    }
                  })
                }
              } else {
                vm.warningLgsp = true
                vm.messageLgsp = 'Số CCCD/ CMND: "' + vm.applicantIdNoLgsp + '", họ tên: "' + vm.applicantNameLgsp + '" không có thông tin trên CSDL quốc gia về dân cư'
              }
            } else {
              vm.applicantLgspInfomation = ''
              vm.warningLgsp = true
              vm.messageLgsp = 'Số CCCD/ CMND: "' + vm.applicantIdNoLgsp + '", họ tên: "' + vm.applicantNameLgsp + '" không có thông tin trên CSDL quốc gia về dân cư'
            }
          }).catch(function (error) {
            let result = error.response.data
            vm.loadingSearchLgsp = false
            vm.applicantLgspInfomation = ''
            vm.warningLgsp = true
            vm.messageLgsp = "Lỗi truy cập hệ thống tra cứu"
            
            if (result.hasOwnProperty('errorCode')) {
              let errorCode = result.errorCode
              switch(errorCode) {
                case "004":
                  vm.messageLgsp = "Thủ tục chưa được cấp phép khai thác CSDL dân cư";
                  break;
                case "005":
                  vm.messageLgsp = "Tài khoản cán bộ không có quyền thao tác";
                  break;
                default:
                  vm.messageLgsp = "Lỗi truy cập hệ thống tra cứu"
              }
            }
          })
        } else {
          toastr.error('Vui lòng nhập đầy đủ số CCCD/CMND, họ tên và ngày sinh để tra cứu')
        }
      },
      parseDate (date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      formatDate(date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      getMaxdate () {
        let date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
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
      parse_query_string (query) {
        let vars = query.split('&')
        let query_string = {}
        for (let i = 0; i < vars.length; i++) {
          let pair = vars[i].split('=')
          let key = decodeURIComponent(pair[0])
          let value = decodeURIComponent(pair[1])
          if (typeof query_string[key] === 'undefined') {
            query_string[key] = decodeURIComponent(value)
          } else if (typeof query_string[key] === 'string') {
            let arr = [query_string[key], decodeURIComponent(value)]
            query_string[key] = arr
          } else {
            query_string[key].push(decodeURIComponent(value))
          }
        }
        return query_string
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
