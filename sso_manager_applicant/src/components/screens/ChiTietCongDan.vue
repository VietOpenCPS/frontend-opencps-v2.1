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
                    <!-- <v-btn
                        v-if="!daCapChungThu"
                        class="mx-0 mr-3"
                        small
                        color="primary"
                        @click="createChungThuSo()"
                    >
                        <v-icon size="18">mdi-plus</v-icon>&nbsp;
                        <span>Cấp chứng thư số</span>
                    </v-btn> -->
                    <v-btn
                        class="mx-0 mr-2"
                        small
                        color="primary"
                        v-if="quyenTraCuuLgsp == 1 || quyenTraCuuLgsp == 2"
                        @click="checkCsdldc()"
                        :loading="loadingSearchLgsp" :disabled="loadingSearchLgsp"
                    >
                        <v-icon size="18">check</v-icon>&nbsp;
                        <span>Kiểm tra thông tin CSDL dân cư</span>
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
                <div class="my-3" v-if="thongTinCongDan['trangThaiDuLieu']['maMuc'] == 2">
                  <v-icon
                    color="green darken-2"
                  >
                    verified
                  </v-icon>
                  <span class="ml-2" style="color: #388E3C; text-transform: uppercase;font-weight: bold;">{{thongTinCongDan['trangThaiDuLieu']['tenMuc']}}</span>
                </div>
                <div class="my-3" v-if="thongTinCongDan['trangThaiDuLieu']['maMuc'] == 1">
                  <v-icon
                    color="red darken-2"
                  >
                    do_disturb
                  </v-icon>
                  <span class="ml-2" style="color: #D32F2F; text-transform: uppercase;font-weight: bold;">{{thongTinCongDan['trangThaiDuLieu']['tenMuc']}}</span>
                  <span class="ml-2" style="color: #D32F2F;">(Lý do: {{thongTinCongDan['activityNote']}})</span>
                </div>
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
              <v-card flat class="pt-4" style="
              border: 1px solid rgb(222, 222, 222);
              border-bottom-left-radius: 5px;
              border-bottom-right-radius: 5px;
              border-top: none;">
                  <div style="text-align: center;">
                      <img class="mb-4" style="width: 226px; height: 226px;" src="/o/hau-giang-theme/images/avt.png?t=98312312323">
                      <h4 class="title-page" style="font-size: 16px;font-weight: bold;color: #903938">{{thongTinCongDan['hoVaTen']}}</h4>
                      <v-layout class="mt-4" wrap style="width: 350px;">
                          <v-flex xs5>Số CMND/ CCCD:</v-flex>
                          <v-flex xs7 class="mb-2">
                            <span style="font-weight: bold">{{thongTinCongDan['maSoCaNhan']}}</span>
                          </v-flex>
                          <v-flex style="max-width: 100px;" class="pt-2">Trạng thái: </v-flex>
                          <v-flex >
                            <span class="font-weight-bold">
                              {{thongTinCongDan && thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['tenMuc'] ? thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['tenMuc'] : 'Chưa tạo tài khoản'}}
                            </span>

                            <v-tooltip top >
                              <v-btn @click="viewLog()" color="primary" slot="activator" flat icon class="mx-0 ml-2">
                                <v-icon size="22">history</v-icon>
                              </v-btn>
                              <span>Lịch sử thay đổi</span>
                            </v-tooltip>
                          </v-flex>
                      </v-layout>
                      <div class="d-flex justify-space-between w-full pb-2" v-if="thongTinCongDan">
                          <v-btn v-if="thongTinCongDan['danhTinhDienTu'][0] && thongTinCongDan['danhTinhDienTu'][0]['tinhTrangSuDungTaiKhoan']['maMuc'] == 2"
                            color="primary" small class="mt-3 mx-3 text-white" @click="showChangePass()">
                            Đổi mật khẩu
                          </v-btn>
                          <v-btn color="primary" v-if="!thongTinCongDan['danhTinhDienTu'][0]" small class="mt-3 mx-3 text-white"
                           @click="showCreateAcc()" :loading="loadingSearchLgsp" :disabled="loadingSearchLgsp">
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
                        <v-btn color="primary" @click="printPhieu()" small class="mt-3 mx-3 text-white">
                            In phiếu cấp tài khoản
                        </v-btn>
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
          <v-card flat>
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
          <v-card flat>
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
                        <span>Mật khẩu mới (Ít nhất 8 ký tự, gồm chữ và số)</span>
                        <span class="red--text"> (*)</span>
                      </div>
                      <v-text-field
                        class="input-form"
                        v-model="passwordChange"
                        solo
                        dense
                        :rules="requiredPassword"
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
          <v-card flat>
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

        <v-dialog
          max-width="900"
          v-model="dialogStatusAccLog"
          persistent
        >
          <v-card flat>
            <v-toolbar
              dark
              color="primary"
            >
              <v-toolbar-title >Lịch sử thay đổi trạng thái tài khoản</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialogStatusAccLog = false"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-2">

              <v-data-table
                :headers="headersLog"
                :items="logItems"
                hide-actions
                class="table-landing table-bordered mt-2"
                style="border-left: 1px solid #dedede"
              >
                <template slot="items" slot-scope="props">
                  <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
                    <td class="text-xs-center" style="width:50px;height:36px">
                      <div>
                        <span>{{ props.index + 1 }}</span>
                      </div>
                    </td>
                    <td class="text-xs-left">
                      <div :style="getLogActionName(props.item.activityCode)['color']">
                          {{ getLogActionName(props.item.activityCode)['name'] }}
                      </div>
                    </td>
                    <td class="text-xs-left">
                      <div>
                        <span>{{ props.item.activityNote}}</span>
                      </div>
                    </td>
                    <td class="text-xs-left">
                      <div class="font-weight-bold">
                        {{ props.item.createdBy.fullName }}
                      </div>
                      <div v-if="props.item.createdBy.email">
                        {{ props.item.createdBy.email }}
                      </div>
                    </td>
                    <td class="text-xs-left">
                      <div>
                        <span>{{ dateLocaleTime(props.item.createdDate) }}</span>
                      </div>
                    </td>
                    
                    <td class="text-xs-center" style="height:36px;width: 90px">
                      <v-tooltip top>
                        <v-btn @click="editLog(props.item)" color="green" slot="activator" flat icon class="mx-0 mr-3 my-0">
                          <v-icon size="22">edit</v-icon>
                        </v-btn>
                        <span>Sửa nội dung</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
                <template slot="no-data">
                  <div class="text-xs-center mt-2">
                    Không có lịch sử
                  </div>
                </template>
              </v-data-table>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn color="red" class="white--text mr-2" :loading="loadingAction" :disabled="loadingAction" @click="dialogStatusAccLog = false">
                <v-icon left>
                  clear
                </v-icon>
                Thoát
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          max-width="650"
          v-model="dialogChangeLog"
          persistent
        >
          <v-card flat>
            <v-toolbar
              dark
              color="primary"
            >
              <v-toolbar-title >Cập nhật nội dung</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialogChangeLog = false"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-2">
              <v-form
                ref="formChangeLog"
                v-model="validFormChangeLog"
                lazy-validation
              >
                  <v-layout wrap>
                    <v-flex xs12 class="mb-2">
                      <v-textarea
                        class="input-form"
                        v-model="logChange"
                        solo
                        dense
                        hide-details="auto"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end">
              <!-- <v-btn color="red" class="white--text mr-2" :loading="loadingAction" :disabled="loadingAction" @click="dialogChangeLog = false">
                <v-icon left>
                  clear
                </v-icon>
                Thoát
              </v-btn> -->
              <v-btn class="mr-2" color="primary" :loading="loadingAction" :disabled="loadingAction" @click.native="submitChangeLog">
                <v-icon left>
                  save
                </v-icon>
                <span>Xác nhận</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          max-width="900"
          v-model="dialogPrint"
          persistent
        >
          <v-card flat>
            <v-toolbar
              dark
              color="primary"
            >
              <v-toolbar-title >Phiếu cấp tài khoản</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  icon
                  dark
                  @click="dialogPrint = false"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-2">
              <div id="printPhieu_1" v-html="contentPrint"></div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn color="red" class="white--text mr-2" @click="dialogPrint = false">
                <v-icon left>
                  clear
                </v-icon>
                Thoát
              </v-btn>
              <v-btn class="mr-2" color="primary" @click.native="submitPrint">
                <v-icon left>
                  mdi-printer
                </v-icon>
                <span>In phiếu</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
                      <td class="pt-2"><span>{{dateLocale(thongTinCongDan.ngaySinh)}}</span></td>
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
import axios from 'axios'
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
        requiredPassword: [
           (value) => {
            const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            if (value) {
              return pattern.test(value) || 'Mật khẩu ít nhất 8 ký tự, có chữ và số'
            } else {
              return 'Mật khẩu là bắt buộc'
            }
          }
        ],
        validFormActionAccount: true,
        dialogNoteAction: false,
        titleAction: '',
        noteAction: '',
        actionStatusAcc: '',
        dialogStatusAccLog: false,
        headersLog: [
          {
              sortable: false,
              text: 'STT',
              align: 'center',
          },
          {
              sortable: false,
              text: 'Thao tác',
              align: 'left'
          },
          {
              sortable: false,
              text: 'Nội dung',
              align: 'left'
          },
          {
              sortable: false,
              text: 'Người thao tác',
              align: 'left'
          },
          {
              sortable: false,
              text: 'Thời gian thao tác',
              align: 'left'
          },
          {
              sortable: false,
              text: 'Thao tác',
              align: 'center'
          }
        ],
        logItems: [],
        logUpdate: '',
        dialogChangeLog: false,
        logChange: '',
        validFormChangeLog: true,
        dialogPrint: false,
        contentPrint: '',
        daCapChungThu: false,
        loadingSearchLgsp: false,
        dialog_searchLgsp: false,
        applicantLgspInfomation: '',
        quyenTraCuuLgsp: false,
        userLoginInfomation: ''
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
      checkCsdldc () {
        let vm = this
        let filter = {
          applicantIdNo: String(vm.thongTinCongDan.maSoCaNhan).trim(),
          applicantName: vm.convertString((String(vm.thongTinCongDan.hoVaTen).trim())).toUpperCase(),
          birthDate: vm.dateTraCuuLgsp(vm.thongTinCongDan.ngaySinh),
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
      },
      showCreateAcc () {
        let vm = this
        let createFnc = function () {
          var characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          var alpha = "abcdefghijklmnopqrstuvwxyz";
          var numbers = "0123456789";
          var symbols = "@$!%*#?&";
          var allChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

          var result = '';
          result += characters.charAt(Math.floor(Math.random() * characters.length));
          result += alpha.charAt(Math.floor(Math.random() * alpha.length));
          result += numbers.charAt(Math.floor(Math.random() * numbers.length));
          result += symbols.charAt(Math.floor(Math.random() * symbols.length));
          for (let index = 0; index < 4; index++) {
              result += allChar.charAt(Math.floor(Math.random() * allChar.length));
          }
          result = result.split('').sort(function(){return 0.5-Math.random()}).join('')
          vm.passwordCreate = vm.thongTinCongDan['danhBaLienLac']['soDienThoai'] ? String(vm.thongTinCongDan['danhBaLienLac']['soDienThoai']).trim() : result
          vm.dialogCreateAcc = true
        }
        if (vm.quyenTraCuuLgsp == 1 || vm.quyenTraCuuLgsp == 2) {
          let filter = {
            applicantIdNo: String(vm.thongTinCongDan.maSoCaNhan).trim(),
            applicantName: vm.convertString((String(vm.thongTinCongDan.hoVaTen).trim())).toUpperCase(),
            birthDate: vm.dateTraCuuLgsp(vm.thongTinCongDan.ngaySinh),
            StaffEmail : vm.userLoginInfomation && vm.userLoginInfomation.hasOwnProperty('employeeEmail') ? vm.userLoginInfomation.employeeEmail : ''
          }
          vm.loadingSearchLgsp = true
          vm.$store.dispatch('searchLgspCongDan', filter).then(result => {
            vm.loadingSearchLgsp = false
            if (result == '') {
                vm.$confirm({
                title: 'Thông tin công dân không có trên CSDL dân cư',
                message: 'Bạn có tiếp tục tạo tài khoản?',
                button: {
                  yes: 'Có',
                  no: 'Không'
                },
                callback: confirm => {
                  if (confirm == true) {
                    createFnc()
                  }
                }
              })
            } else {
              createFnc()
            }
          }).catch(function (result) {
            vm.loadingSearchLgsp = false
            vm.$confirm({
              title: 'Thông tin công dân không có trên CSDL dân cư',
              message: 'Bạn có tiếp tục tạo tài khoản?',
              button: {
                yes: 'Có',
                no: 'Không'
              },
              callback: confirm => {
                if (confirm == true) {
                  createFnc()
                }
              }
            })
          })
        } else {
          createFnc()
        }
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
      unLockAccount () {
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
      dateTraCuuLgsp (dateInput) {
        let date = new Date(dateInput)
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      },
      goBack () {
        window.history.back()
      },
      dateLocaleTime (dateInput) {
        let date = new Date(dateInput)
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} `
      },
      goBack () {
        window.history.back()
      },
      viewLog () {
        let vm = this
        if (vm.loadingData) {
          return
        }
        vm.loadingData = true
        let filter = {
          data: {
            className: 'com.fds.flex.core.data.entity.T_Model.DanhTinhDienTu',
            classPK: vm.thongTinCongDan['danhTinhDienTu'][0]['maDinhDanh'],
            page: 0,
            size: 100
          }
          
        }
        vm.$store.dispatch('getLogChangeStatusAcc', filter).then(function (response) {
          vm.loadingData = false
          vm.logItems = response.content.reverse()
          vm.dialogStatusAccLog = true
        }).catch(function () {
          vm.loadingData = false
        })
      },
      editLog (item) {
        let vm = this
        vm.logUpdate = item
        vm.logChange = item.activityNote
        vm.dialogChangeLog = true
      },
      getLogActionName (code) {
        switch(code) {
          case 'LOCK_ACCOUNT':
              return {name: 'Khóa tài khoản', color: 'color: red'}
          case 'DELETE_ACCOUNT':
              return {name: 'Xóa tài khoản', color: 'color: red'}
          case 'UNLOCK_ACCOUNT':
              return {name: 'Mở khóa tài khoản', color: 'color: green'}
          case 'ACTIVE_ACCOUNT':
              return {name: 'Kích hoạt tài khoản', color: 'color: green'}
          case 'RESTORE_ACCOUNT':
              return {name: 'Khôi phục tài khoản', color: 'color: green'}
          case 'CREATE_ACCOUNT':
              return {name: 'Tạo tài khoản', color: 'color: green'}
          default:
              return {name: code, color: 'color: black'}  
        }
      },
      submitChangeLog () {
        let vm = this
        let filter = {
          "uuid": vm.logUpdate['uuid'],
          data: {
            "activityNote": vm.logChange
          }
        }
        vm.loadingAction = true
        vm.$store.dispatch('updateLog', filter).then(function (response) {
          vm.loadingAction = false
          toastr.remove()
          toastr.success('Cập nhật thành công')
          vm.viewLog()
          vm.dialogChangeLog = false
        }).catch(function () {
          vm.loadingAction = false
          toastr.remove()
          toastr.error('Cập nhật không thành công')
        })
      },
      printPhieu () {
        let vm = this
        let filter = {
          "madinhdanh": vm.thongTinCongDan['danhTinhDienTu'][0]['maDinhDanh']
        }
        vm.loadingAction = true
        vm.$store.dispatch('printPhieu', filter).then(function (response) {
          vm.contentPrint = response.content
          vm.loadingAction = false
          if (vm.contentPrint) {
            vm.dialogPrint = true
          } else {
            toastr.remove()
            toastr.error('Không có phiếu in')
          }
        }).catch(function () {
          vm.loadingAction = false
        })
      },
      submitPrint() {
        var printContents = document.getElementById("printPhieu_1").innerHTML
        var a = window.open()
        a.document.write(printContents)
        a.document.close()
        a.print()

        // var element = document.getElementById('printPhieu_1')
        // html2pdf(element)
      },
      createChungThuSo () {
        let vm = this
        let date = ''
        let maSoCaNhan = String(vm.thongTinCongDan.maSoCaNhan)
        try {
          let month = (new Date(vm.thongTinCongDan.ngaySinh)).getMonth() + 1
          date = (new Date(vm.thongTinCongDan.ngaySinh)).getDate() + '-' + month + '-' + (new Date(vm.thongTinCongDan.ngaySinh)).getFullYear()
        } catch (error) {
        }
        let filter = {
          data: {
            "fullName": vm.thongTinCongDan.hoVaTen, 
            "dob": date,
            "identityNo": maSoCaNhan.length == 9 ? "CMND:" + maSoCaNhan : "CCCD:" + maSoCaNhan,
            "issueDate": "",
            "issuePlace": "",
            "permanentAddress": "",
            "nation": "VN",
            "state": "",
            "email": vm.thongTinCongDan['danhBaLienLac']['thuDienTu'],
            "phone": vm.thongTinCongDan['danhBaLienLac']['soDienThoai'],
            "organization": "TrustCA"
          }
        }
        vm.$store.dispatch('createChungThuSo', filter).then(function (result) {
          
        }).catch(function (response) {
          
        })
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