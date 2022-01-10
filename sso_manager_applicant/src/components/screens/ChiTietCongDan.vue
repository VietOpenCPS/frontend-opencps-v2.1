<template>
    <div>
        <vue-confirm-dialog></vue-confirm-dialog>
        <v-layout wrap style="background: #fff;">
          <v-flex xs12 md8>
              <div class="row-header no__hidden_class">
                <div class="background-triangle-big">
                  <span>THÔNG TIN CÔNG DÂN</span>
                </div>
                <div class="layout row wrap header_tools row-blue mx-1">
                  <div class="flex text-right" style="margin-left: auto;">
                    <v-btn
                        class="mx-0 mr-2"
                        small
                        color="primary"
                        @click="goBack()"
                    >
                        <v-icon size="18">reply</v-icon>&nbsp;
                        <span>Quay lại</span>
                    </v-btn>
                    <v-btn
                        class="mx-0"
                        small
                        color="primary"
                        @click="editCongDan(thongTinCongDan['primKey'])"
                    >
                        <v-icon size="18">edit</v-icon>&nbsp;
                        <span>Cập nhật thông tin</span>
                    </v-btn>
                  </div>
                </div>
              </div>
              <div>
                <table :dense="true" class="cong-dan-info"  style="border-bottom: thin solid rgba(0, 0, 0, 0.12);">
                  <template>
                    <tbody>
                        <tr v-for="(item, index) in thongTin" :key="index" :class="{'td-highlight': index%2 === 0}">
                            <td class="py-2 px-2" style="width: 200px;border-right: 1px solid #dedede;"><strong>{{item.lable}}</strong></td>
                            <td v-if="item.value !== 'action'" class="py-2 px-2">
                              <span v-if="item.type && item.type === 'date'">{{dateLocale(thongTinCongDan[item.value])}}</span>
                              <span v-else-if="item.type === 'danhmuc'">{{thongTinCongDan[item.value] ? thongTinCongDan[item.value]['tenMuc'] : ''}}</span>
                              <span v-else-if="item.type === 'address'">
                                <span v-if="thongTinCongDan[item.value]">
                                  {{thongTinCongDan[item.value]['soNhaChiTiet']}}, {{thongTinCongDan[item.value]['phuongXa']['tenMuc']}} - 
                                  {{thongTinCongDan[item.value]['quanHuyen']['tenMuc']}} - {{thongTinCongDan[item.value]['tinhThanh']['tenMuc']}}
                                </span>
                                <span v-else></span>
                              </span>
                              <span v-else-if="item.value === 'sdt'">{{thongTinCongDan['danhBaLienLac'] ? thongTinCongDan['danhBaLienLac']['soDienThoai'] : ''}}</span>
                              <span v-else-if="item.value === 'email'">{{thongTinCongDan['danhBaLienLac'] ? thongTinCongDan['danhBaLienLac']['thuDienTu'] : ''}}</span>
                              <span v-else>{{ thongTinCongDan[item.value]}}</span>
                            </td>
                            <td v-else class="py-2 px-2">    
                              <v-btn                            
                                  dark
                                  text
                                  color="primary"
                                  >
                                  <v-icon dark>
                                      mdi-plus
                                  </v-icon>
                              </v-btn>
                            </td>
                        </tr>
                    </tbody>
                  </template>
                </table>
              </div>
          </v-flex>
          <v-flex xs12 md4 class="mt-0">
              <v-card class="pt-4" style="border: 1px solid #dedede;border-radius: 5px;">
                  <div style="text-align: center;">
                      <img class="mb-4" style="width: 226px; height: 226px;" src="/o/hau-giang-theme/images/avt.png">
                      <h4 class="title-page" style="font-size: 16px;font-weight: bold;color: #903938">{{thongTinCongDan['hoVaTen']}}</h4>
                      <v-layout class="mt-4" wrap style="width: 350px;">
                          <v-flex xs5>Số CMND/ CCCD:</v-flex>
                          <v-flex xs7 class="mb-2">
                            <span style="font-weight: bold">{{thongTinCongDan['maSoCaNhan']}}</span>
                          </v-flex>
                          <v-flex xs5>Trạng thái:</v-flex>
                          <v-flex xs7>
                            <span style="font-weight: bold">
                              {{thongTinCongDan && thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['tenMuc'] ? thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['tenMuc'] : 'Chưa tạo tài khoản'}}
                            </span>
                          </v-flex>
                      </v-layout>
                      <div class="d-flex justify-space-between w-full pb-2" v-if="thongTinCongDan">
                          <v-btn v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 2"
                            color="primary" small class="mt-3 mx-3 text-white" @click="showChangePass()">
                            Đổi mật khẩu
                          </v-btn>
                          <v-btn color="primary" v-if="!thongTinCongDan['danhTinhDienTu'][0]" small class="mt-3 mx-3 text-white" @click="showCreateAcc()">
                              Tạo tài khoản
                          </v-btn>
                          <v-btn v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 1" color="primary" small class="mt-3 mx-3 text-white" @click="showChangeStatusAcc('active')">
                              Kích hoạt tài khoản
                          </v-btn>
                          <v-btn v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 2" color="primary" small class="mt-3 mx-3 text-white" @click="showChangeStatusAcc('block')">
                              Khóa tài khoản
                          </v-btn>
                          <v-btn v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 3" color="primary" small class="mt-3 mx-3 text-white" @click="showChangeStatusAcc('unlock')">
                              Mở khóa tài khoản
                          </v-btn>
                          <v-btn v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 4" color="primary" small class="mt-3 mx-3 text-white" @click="showChangeStatusAcc('restore')">
                              Khôi phục tài khoản
                          </v-btn>
                          <v-btn color="primary" v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 3" small class="mt-3 mx-3 text-white" @click="showChangeStatusAcc('delete')">
                            Xóa tài khoản
                          </v-btn>
                      </div>
                      <div class="d-flex justify-space-between w-full pb-2 " v-if="thongTinCongDan && thongTinCongDan['danhTinhDienTu'][0]">
                        <!-- <v-btn color="primary" small class="mt-3 mx-3 text-white">
                            In phiếu
                        </v-btn> -->
                      </div>
                  </div>
              </v-card>
          </v-flex>
        </v-layout>
        <v-dialog
          max-width="450"
          v-model="dialogCreateAcc"
          persistent
        >
          <v-card>
            <v-toolbar
              dark
              color="primary"
            >
              <v-toolbar-title >Tạo tài khoản</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialogCreateAcc = false"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-2">
              <v-form
                ref="formCreateAcc"
                v-model="validFormAdd"
                lazy-validation
              >
                  <v-layout wrap>
                    <v-flex xs12 class="mb-2">
                      <div class="text-label mb-2">
                        <span>Mật khẩu tài khoản</span>
                        <span class="red--text"> (*)</span>
                      </div>
                      <v-text-field
                        class="input-form"
                        v-model="passwordCreate"
                        solo
                        dense
                        :rules="required"
                        required
                        hide-details="auto"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="red" class="white--text mr-2" :loading="loadingAction" :disabled="loadingAction" @click="dialogCreateAcc = false">
                <v-icon left>
                  clear
                </v-icon>
                Thoát
              </v-btn>
              <v-btn class="mr-2" color="primary" :loading="loadingAction" :disabled="loadingAction" @click.native="createAccount">
                <v-icon left>
                  save
                </v-icon>
                <span>Tạo tài khoản</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          max-width="450"
          v-model="dialogChangePass"
          persistent
        >
          <v-card>
            <v-toolbar
              dark
              color="primary"
            >
              <v-toolbar-title >Đổi mật khẩu</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialogChangePass = false"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-2">
              <v-form
                ref="formChangePass"
                v-model="validFormChangePass"
                lazy-validation
              >
                  <v-layout wrap>
                    <v-flex xs12 class="mb-2">
                      <div class="text-label mb-2">
                        <span>Mật khẩu mới</span>
                        <span class="red--text"> (*)</span>
                      </div>
                      <v-text-field
                        class="input-form"
                        v-model="passwordChange"
                        solo
                        dense
                        :rules="required"
                        required
                        hide-details="auto"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="red" class="white--text mr-2" :loading="loadingAction" :disabled="loadingAction" @click="dialogChangePass = false">
                <v-icon left>
                  clear
                </v-icon>
                Thoát
              </v-btn>
              <v-btn class="mr-2" color="primary" :loading="loadingAction" :disabled="loadingAction" @click.native="submitChangePass">
                <v-icon left>
                  save
                </v-icon>
                <span>Xác nhận</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          max-width="650"
          v-model="dialogNoteAction"
          persistent
        >
          <v-card>
            <v-toolbar
              dark
              color="primary"
            >
              <v-toolbar-title >{{titleAction}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialogNoteAction = false"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-2">
              <v-form
                ref="formActionAccount"
                v-model="validFormActionAccount"
                lazy-validation
              >
                  <v-layout wrap>
                    <v-flex xs12 class="mb-2">
                      <div class="text-label mb-2">
                        <span>Nhập nội dung</span>
                        <!-- <span class="red--text"> (*)</span> -->
                      </div>
                      <v-textarea
                        class="input-form"
                        v-model="noteAction"
                        solo
                        dense
                        hide-details="auto"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
              </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn color="red" class="white--text mr-2" :loading="loadingAction" :disabled="loadingAction" @click="dialogNoteAction = false">
                <v-icon left>
                  clear
                </v-icon>
                Thoát
              </v-btn>
              <v-btn class="mr-2" color="primary" :loading="loadingAction" :disabled="loadingAction" @click.native="submitChangeStatusAcc">
                <v-icon left>
                  save
                </v-icon>
                <span>Xác nhận</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
// import Pagination from './Pagination.vue'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000',
  "positionClass": "toast-top-center"
}
import VueConfirmDialog from 'vue-confirm-dialog'
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
export default {
    props: ["id"],
    components: {
      // Pagination
    },
    data() {
      return {
        selected: [],
        passwordCreate: '',
        loadingAction: false,
        loadingData: false,
        headers: [
            {
                sortable: false,
                text: 'STT',
                align: 'center',
                value: 'index'
            },
            {
                sortable: false,
                text: 'Loại giấy tờ',
                align: 'left',
                value: 'cmnd'
            },
            {
                sortable: false,
                text: 'Số giấy tờ',
                align: 'left',
                value: 'fullname'
            },
            {
                sortable: false,
                text: 'Ngày cấp',
                align: 'left',
                value: 'contact'
            },
            {
                sortable: false,
                text: 'Nơi cấp',
                align: 'left',
                value: 'status'
            },
            {
                sortable: false,
                text: 'Thao tác',
                align: 'center',
                value: 'action'
            },
        ],
        items: [
            {
                cmnd: 'CMND',
                fullname: '029922398',
                contact: '11/12/2020',
                status: 'Hà Nội',
            },
            {
                cmnd: 'CMND',
                fullname: '029922398',
                contact: '11/12/2020',
                status: 'Hà Nội',
            }
        ],
        page: 0,
        itemsPerPage: 10,
        total: 2,
        chuaCapTaiKhoan: false,
        daCapTaiKhoan: false,
        pageCount: 10,
        thongTin:  [
            {
                lable: 'Họ tên',
                value: 'hoVaTen'
            },
            {
                lable: 'Ngày sinh',
                value: 'ngaySinh',
                type: 'date'
            },
            {
                lable: 'Giới tính',
                value: 'gioiTinh',
                type: 'danhmuc'
            },
            {
                lable: 'Dân tộc',
                value: 'danToc',
                type: 'danhmuc'
            },
            {
                lable: 'Quốc gia',
                value: 'quocTich',
                type: 'danhmuc'
            },
            {
                lable: 'CMND/CCCD',
                value: 'maSoCaNhan'
            },
            {
                lable: 'Số điện thoại',
                value: 'sdt'
            },
            {
                lable: 'Email',
                value: 'email'
            },
            {
                lable: 'Địa chỉ thường trú',
                value: 'diaChiThuongTru',
                type: 'address'
            },
            {
                lable: 'Nơi ở hiện tại',
                value: 'noiOHienTai',
                type: 'address'
            },
            // {
            //     lable: 'Giấy tờ tùy thân',
            //     value: 'action'
            // }
        
        ],
        thongTinCongDan: '',
        validFormAdd: true,
        dialogCreateAcc: false,
        dialogChangePass: false,
        validFormChangePass: true,
        passwordChange: '',
        required: [
          v => (v !== '' && v !== null && v !== undefined) || 'Thông tin bắt buộc'
        ],
        validFormActionAccount: true,
        dialogNoteAction: false,
        titleAction: '',
        noteAction: '',
        actionStatusAcc: ''
      }
    },
    watch: {
      dialogNoteAction (val) {
        this.noteAction = ''
      }
    },
    created () {
      let vm = this
      vm.$store.commit('SET_INDEXTAB', 1)
      vm.getThongTinCongDan()
    },
    methods: {
      getStatus(status) {
          switch(status) {
              case 1:
                  return 'Hoạt động'
              case 0:
                  return 'Đã khóa'
              default:
                  return ''
          }
      },
      editCongDan(id) {
        this.$router.push({ path: '/cong-dan/' + id })
      },
      getThongTinCongDan () {
        let vm = this
        let filter = {
          collectionName: 'canhan',
          id: vm.id
        }
        vm.$store.dispatch('collectionDetail', filter).then(function (response) {
          // console.log('responseThongTinCongDan', response.resp)
          vm.thongTinCongDan = response.resp
        }).catch(function () {
          vm.loadingData = false
        })
      },
      showCreateAcc () {
        let vm = this
        vm.passwordCreate = ''
        vm.dialogCreateAcc = true
      },
      showChangePass () {
        let vm = this
        vm.passwordChange = ''
        vm.dialogChangePass = true
      },
      submitChangePass () {
        let vm = this
        if (vm.$refs.formChangePass.validate()) {
          let filter = {
            data: {
              "tenDinhDanh": vm.thongTinCongDan['danhTinhDienTu'][0]['tenDinhDanh'],
              "matKhauMoi": vm.passwordChange,
              "type": "canhan"
            }
          }
          vm.loadingAction = true
          vm.$store.dispatch('changePass', filter).then(function (response) {
            vm.loadingAction = false
            vm.dialogChangePass = false
            toastr.remove()
            toastr.success('Đổi mật khẩu thành công')
          }).catch(function () {
            vm.loadingAction = false
            toastr.remove()
            toastr.error('Đổi mật khẩu thất bại')
          })
        }
      },
      showChangeStatusAcc (action) {
        let vm = this
        vm.actionStatusAcc = action
        if (action === 'block') {
          vm.titleAction = 'LÝ DO KHÓA TÀI KHOẢN'
        } else if (action === 'active') {
          vm.titleAction = 'NỘI DUNG KÍCH HOẠT TÀI KHOẢN'
        } else if (action === 'unlock') {
          vm.titleAction = 'NỘI DUNG MỞ KHÓA TÀI KHOẢN'
        } else if (action === 'delete') {
          vm.titleAction = 'LÝ DO XÓA TÀI KHOẢN'
        } else if (action === 'restore') {
          vm.titleAction = 'NỘI DUNG KHÔI PHỤC TÀI KHOẢN'
        } 
        vm.noteAction = ''
        vm.dialogNoteAction = true
        vm.$refs.validFormActionAccount.resetValidation()
      },
      submitChangeStatusAcc () {
        let vm = this
        if (vm.$refs.formActionAccount.validate()) {
          if (vm.actionStatusAcc === 'block') {
            vm.blockAccount()
          } else if (vm.actionStatusAcc === 'delete') {
            vm.deleteAccount()
          } else if (vm.actionStatusAcc === 'active') {
            vm.activeAccount()
          } else if (vm.actionStatusAcc === 'unlock') {
            vm.unLockAccount()
          } else if (vm.actionStatusAcc === 'restore') {
            vm.restoreAccount()
          }
        }
      },
      createAccount () {
        let vm = this
        if (vm.$refs.formCreateAcc.validate()) {
          let filter = {
            data: {
              "maDinhDanh": vm.thongTinCongDan.maDinhDanh,
              "password": vm.passwordCreate,
              "type": "canhan"
            }
          }
          vm.loadingAction = true
          vm.$store.dispatch('createAccountCaNhan', filter).then(function (response) {
            vm.loadingAction = false
            vm.dialogCreateAcc = false
            toastr.remove()
            toastr.success('Tạo tài khoản thành công')
            vm.getThongTinCongDan()
          }).catch(function () {
            vm.loadingAction = false
            toastr.remove()
            toastr.error('Tạo tài khoản không thành công')
          })
        }
      },
      activeAccount () {
        let vm = this
        let filter = {
          data: {
            "tenDinhDanh": vm.thongTinCongDan['danhTinhDienTu'][0]['tenDinhDanh'],
            "type": "canhan",
            "activityNote": vm.noteAction
          }
        }
        vm.loadingAction = true
        vm.$store.dispatch('activeCaNhan', filter).then(function (response) {
          vm.loadingAction = false
          vm.dialogCreateAcc = false
          toastr.remove()
          toastr.success('Kích hoạt tài khoản thành công')
          vm.getThongTinCongDan()
          vm.dialogNoteAction = false
        }).catch(function () {
          vm.loadingAction = false
          toastr.remove()
          toastr.error('Kích hoạt tài khoản không thành công')
        })
      },
      blockAccount () {
        let vm = this
        let filter = {
          data: {
            "tenDinhDanh": vm.thongTinCongDan['danhTinhDienTu'][0]['tenDinhDanh'],
            "type": "canhan",
            "activityNote": vm.noteAction
          }
        }
        vm.loadingAction = true
        vm.$store.dispatch('blockCaNhan', filter).then(function (response) {
          vm.loadingAction = false
          vm.dialogCreateAcc = false
          toastr.remove()
          toastr.success('Khóa tài khoản thành công')
          vm.getThongTinCongDan()
          vm.dialogNoteAction = false
        }).catch(function () {
          vm.loadingAction = false
          toastr.remove()
          toastr.error('Khóa tài khoản không thành công')
        })
      },
      unBlockAccount () {
        let vm = this
        let filter = {
          data: {
            "tenDinhDanh": vm.thongTinCongDan['danhTinhDienTu'][0]['tenDinhDanh'],
            "type": "canhan",
            "activityNote": vm.noteAction
          }
        }
        vm.loadingAction = true
        vm.$store.dispatch('unBlockCaNhan', filter).then(function (response) {
          vm.loadingAction = false
          toastr.remove()
          toastr.success('Mở khóa tài khoản thành công')
          vm.getThongTinCongDan()
          vm.dialogNoteAction = false
        }).catch(function () {
          vm.loadingAction = false
          toastr.remove()
          toastr.error('Mở khóa tài khoản không thành công')
        })
      },
      restoreAccount () {
        let vm = this
        let filter = {
          data: {
            "tenDinhDanh": vm.thongTinCongDan['danhTinhDienTu'][0]['tenDinhDanh'],
            "type": "canhan",
            "activityNote": vm.noteAction
          }
        }
        vm.loadingAction = true
        vm.$store.dispatch('restoreCaNhan', filter).then(function (response) {
          vm.loadingAction = false
          toastr.remove()
          toastr.success('Khôi phục tài khoản thành công')
          vm.getThongTinCongDan()
          vm.dialogNoteAction = false
        }).catch(function () {
          vm.loadingAction = false
          toastr.remove()
          toastr.error('Khôi phục tài khoản không thành công')
        })
      },
      deleteAccount () {
        let vm = this
        vm.$confirm({
          title: 'Xác nhận xóa dữ liệu',
          message: 'Bạn có chắc chắn xóa tài khoản này?',
          button: {
            yes: 'Có',
            no: 'Không'
          },
          callback: confirm => {
            if (confirm == true) {
              let filter = {
                data: {
                  "tenDinhDanh": vm.thongTinCongDan['danhTinhDienTu'][0]['tenDinhDanh'],
                  "type": "canhan",
                  "activityNote": vm.noteAction
                }
              }
              vm.loadingAction = true
              vm.$store.dispatch('deleteCaNhan', filter).then(function (response) {
                vm.loadingAction = false
                vm.dialogCreateAcc = false
                toastr.remove()
                toastr.success('Xóa tài khoản thành công')
                vm.getThongTinCongDan()
                vm.dialogNoteAction = false
              }).catch(function () {
                vm.loadingAction = false
                toastr.remove()
                toastr.error('Xóa tài khoản không thành công')
              })
            }
          }
        })
      },
      dateLocale (dateInput) {
        let date = new Date(dateInput)
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      },
      goBack () {
        window.history.back()
      }
    }
}
</script>

<style scoped lang="css">
.cong-dan-info td{
    border-bottom: 0px!important;
}
.cong-dan-info table{
    border-top: none!important;
}
.td-highlight{
    background-color: #F9F4F1;
}
</style>