<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation class="py-3 px-3 grid-list">
      <v-layout class="user_profile" wrap style="
            max-width: 1300px;
            margin: 0 auto;
          ">
        <v-flex class="xs12 sm8">
          <v-card style="border-radius: 4px;-webkit-box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;">
            <v-toolbar color="blue darken-3" dark height="48">
              <v-btn dark flat>
                <v-icon>verified_user</v-icon> &nbsp; 
                <span v-if="state === 0">
                  Thông tin tài khoản
                </span>
                <span v-else>
                  Đổi mật khẩu
                </span>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn dark flat class="mr-2" v-if="state === 0" v-on:click="submitUserProfile">
                <v-icon>done</v-icon> &nbsp; Cập nhật thông tin
              </v-btn>
              <v-btn dark flat class="mr-2" v-else v-on:click.native="doChangePassWord">
                <v-icon>done</v-icon> &nbsp; Xác nhận đổi mật khẩu
              </v-btn>
            </v-toolbar>
            <v-layout v-if="state === 1" row justify-center wrap class="py-3">
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-alert
                  :value="true"
                  color="error"
                  icon="warning"
                  outline
                  v-if="changePassWordFail"
                >
                  Mật khẩu cũ không chính xác. Vui lòng kiểm tra lại.
                </v-alert>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="oldPassWord" box
                :append-icon="e3 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e3 = !e3)"
                :type="e3 ? 'password' : 'text'"
                name="input-10-2"
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required
              >
                  <template slot="label">Mật khẩu cũ <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="newPassWord" box 
                :rules="[rules.required, rules.passWord, v => v!==oldPassWord || 'Mật khẩu mới trùng mật khẩu cũ']"
                :append-icon="e1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e1 = !e1)"
                :type="e1 ? 'password' : 'text'"
                name="input-10-2"
                min="8"
                required>
                  <template slot="label">Mật khẩu mới <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="newPassWordConfirm" box 
                :rules="[rules.required, v => v===newPassWord || 'Mật khẩu nhập lại không chính xác']"
                :append-icon="e2 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (e2 = !e2)"
                :type="e2 ? 'password' : 'text'"
                name="input-10-2"
                min="8"
                required>
                  <template slot="label">Nhập lại mật khẩu mới <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-btn block color="blue darken-3" dark :loading="loading" :disabled="loading" v-on:click.native="doChangePassWord" class="mx-0">
                  <v-icon>done</v-icon>&nbsp; Xác nhận đổi mật khẩu
                </v-btn>
              </v-flex>
            </v-layout>
            <!-- profile công dân -->
            <v-layout v-if="state === 0 && (user['className'] === 'org.opencps.usermgt.model.Applicant' || user['className'] === 'com.liferay.portal.kernel.model.User')" row wrap class="px-3 py-3">
              <v-flex xs12 :class="user['applicantType'] === 'citizen' ? 'sm4' : 'sm12'">
                <v-text-field v-model="user['applicantName']" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required>
                  <template slot="label"> 
                    <span v-if="user['applicantType'] === 'business'">Tên tổ chức, doanh nghiệp</span>
                    <span v-else-if="user['applicantType'] === 'citizen'">Họ tên</span>
                    <span v-else>Tên người dùng</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('GioiTinh') >= 0">
                <v-autocomplete v-model="user['applicantProfile']['GioiTinh']" :items="sexItems" label="Giới tính" item-text="itemName" item-value="itemCode" :hide-selected="true" box ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('QuocTich') >= 0">
                <v-text-field v-model="user['applicantProfile']['QuocTich']" label="Quốc tịch" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NgayThangNamSinh') >= 0">
                <!-- <v-text-field v-model="user['applicantProfile']['NgayThangNamSinh']" label="Ngày sinh" box></v-text-field> -->
                <v-menu
                  ref="menuBirthDate2"
                  :close-on-content-click="false"
                  v-model="menuBirthDate2"
                  :nudge-right="40"
                  lazy
                  transition="fade-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    box append-icon="event"
                    v-model="user['applicantProfile']['NgayThangNamSinh']"
                    label="Ngày sinh"
                    @blur="ngaySinh = parseDate(user['applicantProfile']['NgayThangNamSinh'])"
                  ></v-text-field>
                  <v-date-picker ref="picker" min="1950-01-01" :max="getMaxdate()" :first-day-of-week="1" locale="vi"
                  v-model="ngaySinh" no-title @input="changeBirthDate2"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen'">
                <v-text-field v-model="user['applicantContactTelNo']" box>
                  <template slot="label"> 
                    <span>Điện thoại di động</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('SoDienThoaiBan') >= 0">
                <v-text-field label="Điện thoại cố định" v-model="user['applicantProfile']['SoDienThoaiBan']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'citizen'">
                <v-text-field v-model="user['applicantContactEmail']" box readonly>
                  <template slot="label"> 
                    <span>Thư điện tử</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Short_Name') >= 0">
                <v-text-field label="Tên viết tắt" v-model="user['applicantProfile']['Short_Name']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Name_F') >= 0">
                <v-text-field label="Tên tiếng anh" v-model="user['applicantProfile']['Name_F']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Enterprise_type_id') >= 0">
                <v-text-field label="Loại hình doanh nghiệp" v-model="user['applicantProfile']['Enterprise_type_id']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field v-model="user['applicantIdNo']" box readonly>
                  <template slot="label"> 
                    <span v-if="user['applicantType'] === 'business'">Mã số thuế</span>
                    <span v-else-if="user['applicantType'] === 'citizen'">Số CMND/ Căn cước</span> 
                    <span v-else>Số CMND/ Căn cước</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="isBXD">
                <div>{{ user['applicantType'] === 'citizen' ? 'Ảnh CMND mặt trước' : 'Ảnh Giấy phép đăng ký kinh doanh mặt trước'}} </div>
                <AttachImage :dataImage="user['applicantProfile']['indentifyNoFFileUrl']"
                  @changeImage="changeImageFront"  
                ></AttachImage>
                <!-- <v-text-field 
                  @click='onPickFileCMNDFront'
                  v-model='fileCMNDFrontName'
                  v-if="isBXD"
                  box
                  prepend-icon="attach_file"
                ></v-text-field>
             
                <input
                  type="file"
                  style="display: none"
                  ref="refFileCMNDFront"
                  accept="*/*"
                  @change="onFileCMNDFrontPicked"> -->
              </v-flex>
              <v-flex xs12 sm4 v-if="isBXD">
                <div>{{ user['applicantType'] === 'citizen' ? 'Ảnh CMND mặt sau' : 'Ảnh Giấy phép đăng ký kinh doanh mặt sau'}} </div>
                <AttachImage :dataImage="user['applicantProfile']['indentifyNoBFileUrl']"
                  @changeImage="changeImageBack"  
                ></AttachImage>
                <!-- <v-text-field 
                  @click='onPickFileCMNDBack'
                  v-model='fileCMNDBackName'
                  prepend-icon="attach_file"
                  v-if="isBXD"
                  box
                ></v-text-field>
                <input
                  type="file"
                  style="display: none"
                  ref="refFileCMNDBack"
                  accept="*/*"
                  @change="onFileCMNDBackPicked"> -->
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('LoaiThe') >= 0">
                <v-text-field label="Loại thẻ" v-model="user['applicantProfile']['LoaiThe']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <!-- <v-text-field label="Ngày cấp" v-model="user['applicantIdDate']" box disabled></v-text-field> -->
                <v-menu
                  ref="menuBirthDate"
                  :close-on-content-click="false"
                  v-model="menuBirthDate"
                  :nudge-right="40"
                  lazy
                  transition="fade-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    box append-icon="event"
                    v-model="user['applicantIdDate']"
                    @blur="ngayCap = parseDate(user['applicantIdDate'])"
                  >
                    <template slot="label"> 
                      <span>Ngày cấp</span> 
                      <span class="red--text darken-3"> *</span>
                    </template>
                  </v-text-field>
                  <v-date-picker ref="picker" min="1950-01-01" :max="getMaxdate()" :first-day-of-week="1" locale="vi"
                  v-model="ngayCap" no-title @input="changeBirthDate"></v-date-picker>
                </v-menu>
              </v-flex>
              
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Enterprise_Id') >= 0">
                <v-text-field label="Mã ID của doanh nghiệp" v-model="user['applicantProfile']['Enterprise_Id']" box></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Enterprise_Code') >= 0">
                <v-text-field label="Mã số nội bộ" v-model="user['applicantProfile']['Enterprise_Code']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Site_Id') >= 0">
                <v-text-field label="Mã ID của Phòng ĐKKD đang quản lý" v-model="user['applicantProfile']['Site_Id']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Subunit_Paren_Ent_Id') >= 0">
                <v-text-field label="Mã ID của doanh nghiệp mẹ" v-model="user['applicantProfile']['Subunit_Paren_Ent_Id']" box></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('SoDinhDanh') >= 0">
                <v-text-field label="Số định danh cá nhân" v-model="user['applicantProfile']['SoDinhDanh']" box clearable></v-text-field>
              </v-flex>
              <!-- Địa chỉ thường trú -->
              <v-flex xs12 sm12>
                <v-text-field v-model="user['applicantAddress']" box clearable>
                  <template slot="label"> 
                    <span v-if="user['applicantType'] === 'business'">Địa chỉ</span>
                    <span v-else-if="user['applicantType'] === 'citizen'">Địa chỉ thường trú</span> 
                    <span v-else>Địa chỉ</span> 
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="user['applicantCityCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeCity($event, 'districtItems', 'wardItems')"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="districtItems" label="Quận/huyện" v-model="user['applicantDistrictCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeDistrict($event, 'wardItems')"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete label="Xã/phường" :items="wardItems" v-model="user['applicantWardCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box></v-autocomplete>
              </v-flex>
              <!-- Nơi đăng ký khai sinh -->
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiDangKyKhaiSinhAddress') >= 0">
                <v-text-field label="Nơi đăng ký khai sinh" v-model="user['applicantProfile']['NoiDangKyKhaiSinhAddress']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiDangKyKhaiSinhAddress') >= 0">
                <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="user['applicantProfile']['NoiDangKyKhaiSinhCityCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeCity($event, 'NoiDangKyKhaiSinhdistrictItems', 'NoiDangKyKhaiSinhwardItems')"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiDangKyKhaiSinhAddress') >= 0">
                <v-autocomplete :items="NoiDangKyKhaiSinhdistrictItems" label="Quận/huyện" v-model="user['applicantProfile']['NoiDangKyKhaiSinhDistrictCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeDistrict($event, 'NoiDangKyKhaiSinhwardItems')"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiDangKyKhaiSinhAddress') >= 0">
                <v-autocomplete label="Xã/phường" :items="NoiDangKyKhaiSinhwardItems" v-model="user['applicantProfile']['NoiDangKyKhaiSinhWardCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box></v-autocomplete>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('QueQuan') >= 0">
                <v-text-field label="Quê quán" v-model="user['applicantProfile']['QueQuan']" box clearable></v-text-field>
              </v-flex>
              <!-- Nơi ở hiện tại -->
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiOHienTaiAddress') >= 0">
                <v-text-field label="Nơi ở hiện tại" v-model="user['applicantProfile']['NoiOHienTaiAddress']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiOHienTaiAddress') >= 0">
                <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="user['applicantProfile']['NoiOHienTaiCityCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeCity($event, 'NoiOHienTaidistrictItems', 'NoiOHienTaiwardItems')"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiOHienTaiAddress') >= 0">
                <v-autocomplete :items="NoiOHienTaidistrictItems" label="Quận/huyện" v-model="user['applicantProfile']['NoiOHienTaiDistrictCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeDistrict($event, 'NoiOHienTaiwardItems')"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NoiOHienTaiAddress') >= 0">
                <v-autocomplete label="Xã/phường" :items="NoiOHienTaiwardItems" v-model="user['applicantProfile']['NoiOHienTaiWardCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box></v-autocomplete>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('TonGiao') >= 0">
                <v-text-field label="Tôn giáo" v-model="user['applicantProfile']['TonGiao']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('DanToc') >= 0">
                <v-text-field label="Dân tộc" v-model="user['applicantProfile']['DanToc']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NhomMau') >= 0">
                <v-autocomplete v-model="user['applicantProfile']['NhomMau']" :items="bloodGroups" label="Nhóm máu" item-text="itemName" item-value="itemCode" :hide-selected="true" box ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('Cha') >= 0">
                <v-text-field label="Họ tên cha" v-model="user['applicantProfile']['Cha']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('Me') >= 0">
                <v-text-field label="Họ tên mẹ" v-model="user['applicantProfile']['Me']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('NguoiDaiDien') >= 0">
                <v-text-field label="Người đại diện" v-model="user['applicantProfile']['NguoiDaiDien']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen' && profileConfig.indexOf('TinhTrangHonNhan') >= 0">
                <v-autocomplete v-model="user['applicantProfile']['TinhTrangHonNhan']" :items="matrimonyItems" label="Tình trạng hôn nhân" item-text="itemName" item-value="itemCode" :hide-selected="true" box ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen'&& profileConfig.indexOf('VoChong') >= 0">
                <v-text-field label="Họ tên vợ (chồng)" v-model="user['applicantProfile']['VoChong']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen'&& profileConfig.indexOf('ChuHo') >= 0">
                <v-text-field label="Họ tên chủ hộ" v-model="user['applicantProfile']['ChuHo']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'citizen'&& profileConfig.indexOf('TrangThai') >= 0">
                <v-autocomplete v-model="user['applicantProfile']['TrangThai']" :items="statusApplicants" label="Hiện trạng của công dân " item-text="itemName" item-value="itemCode" :hide-selected="true" box ></v-autocomplete>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'business'&& profileConfig.indexOf('HOAddress') >= 0">
                <v-text-field label="Địa chỉ đầy đủ trên giấy phép kinh doanh" v-model="user['applicantProfile']['HOAddress']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Phone') >= 0">
                <v-text-field label="Điện thoại cố định" v-model="user['applicantProfile']['Phone']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business'">
                <v-text-field v-model="user['applicantContactTelNo']" box clearable>
                  <template slot="label"> 
                    <span>Điện thoại di động</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business'&& profileConfig.indexOf('Fax') >= 0">
                <v-text-field label="Fax" v-model="user['applicantProfile']['Fax']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business'">
                <v-text-field v-model="user['applicantContactEmail']" box readonly>
                  <template slot="label"> 
                    <span>Thư điện tử</span> 
                    <span class="red--text darken-3"> *</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business' && profileConfig.indexOf('Website') >= 0">
                <v-text-field label="Website" v-model="user['applicantProfile']['Website']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business'&& profileConfig.indexOf('Founding_Date') >= 0">
                <v-menu
                  ref="menuBirthDate2"
                  :close-on-content-click="false"
                  v-model="menuBirthDate2"
                  :nudge-right="40"
                  lazy
                  transition="fade-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    box append-icon="event"
                    v-model="user['applicantProfile']['Founding_Date']"
                    label="Ngày thành lập"
                    @blur="ngaySinh = parseDate(user['applicantProfile']['Founding_Date'])"
                  ></v-text-field>
                  <v-date-picker ref="picker" min="1950-01-01" :max="getMaxdate()" :first-day-of-week="1" locale="vi"
                  v-model="ngaySinh" no-title @input="changeBirthDate2"></v-date-picker>
                </v-menu>
              </v-flex>
              
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'business'&& profileConfig.indexOf('BusinessActivity') >= 0">
                <v-text-field label="Nghành nghề kinh doanh" v-model="user['applicantProfile']['BusinessActivity']" box clearable></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'business'&& profileConfig.indexOf('Legal_Name') >= 0">
                <v-text-field label="Người đại diện pháp luật" v-model="user['applicantProfile']['Legal_Name']" box clearable></v-text-field>
              </v-flex>
              
              <v-flex xs12 sm12 v-if="user['applicantType'] === 'business'&& profileConfig.indexOf('Enterprise_Status') >= 0">
                <v-text-field label="Tình trạng hoạt động" v-model="user['applicantProfile']['Enterprise_Status']" box clearable></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex sm12 class="text-xs-right">
                <v-btn color="blue darken-3" :loading="loading" :disabled="loading" v-on:click="submitUserProfile" class="mx-0" dark>
                  <v-icon>done</v-icon>&nbsp; Cập nhật thông tin
                </v-btn>
                <v-btn v-if="hasSSo" color="blue darken-3" @click="checkVNConect" class="mx-0 ml-3" dark>
                  <v-icon>sync</v-icon>&nbsp; Đồng bộ thông tin từ Cổng DVC Quốc gia
                </v-btn>
              </v-flex>
            </v-layout>
            <!-- profile cán bộ -->
            <v-layout v-if="state === 0 && user['className'] === 'org.opencps.usermgt.model.Employee'" row wrap class="px-3 py-3">
              <v-flex xs12 sm4>
                <v-text-field v-model="user['employeeFullName']" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required>
                  <template slot="label">Tên người dùng <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Điện thoại" v-model="user['employeeTelNo']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-menu
                  ref="menuBirthDate"
                  :close-on-content-click="false"
                  v-model="menuBirthDate"
                  :nudge-right="40"
                  lazy
                  transition="fade-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    box append-icon="event"
                    v-model="user['employeeBirthDate']"
                    label="Ngày sinh"
                    @blur="ngayCap = parseDate(user['employeeBirthDate'])"
                  ></v-text-field>
                  <v-date-picker ref="picker" min="1950-01-01" :max="getMaxdate()" :first-day-of-week="1" locale="vi"
                  v-model="ngayCap" no-title @input="changeBirthDate"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field v-model="user['employeeNo']" box>
                  <template slot="label">Contact code <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Địa điểm ký số" value="Hà Nội" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Chức danh ký số" v-model="user['title']" box></v-text-field>
              </v-flex>
              <!--  -->
              <v-flex xs12 class="px-0" v-if="serverProtocolFilter.length > 0">
                <v-layout wrap>
                  <v-flex xs12 sm4 v-for="(item, index) in serverProtocolFilter" :key="index">
                    <v-autocomplete :label="item['serverName']" :items="item['optionsData']" v-model="item['serverNo']" item-text="TEN" item-value="MA" :hide-selected="true" box>
                    </v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm6>
                <p class="mb-2 px-1">File ảnh ký số</p>
                <attached-file-avatar v-if="user['classPK'] !== '' && user['classPK'] !== 'undefined'" :pk="user['classPK']" :pick-item="itemEsign" :type="'image'"></attached-file-avatar>
              </v-flex>
              <v-flex xs12 sm6>
                <p class="mb-2 px-1">File chứng thư gốc</p>
                <attached-file-avatar v-if="user['classPK'] !== '' && user['classPK'] !== 'undefined'" :pk="user['classPK']" :pick-item="itemEsignCert" :type="'document'"></attached-file-avatar>
              </v-flex>

              <v-flex sm12 class="text-xs-right">
                <v-btn color="blue darken-3" :loading="loading" :disabled="loading" v-on:click.native="submitUserProfile" class="mx-0" dark>
                  <v-icon>done</v-icon>&nbsp; Cập nhật thông tin
                </v-btn>
              </v-flex>
            </v-layout>

          </v-card>
        </v-flex>
        <!-- content-right -->
        <v-flex class="xs12 sm4 px-3">
          <v-card style="border-radius: 4px;-webkit-box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;">
            <v-card-text class="my-0 py-0 px-0" v-if="zaloOaId">
              <v-flex xs12 class="text-right" style="height: 30px;">
                <v-tooltip top v-if="isFollowZalo === false">
                  <div class="zalo-follow-only-button" :data-oaid="zaloOaId" data-callback="callbackzalo"
                    slot="activator" style="width:90px">
                  </div>
                  <span>Nhấn Quan tâm để có thể nhận thông báo về tình hình xử lý hồ sơ trên ứng dụng Zalo </span>
                </v-tooltip>
              </v-flex>
            </v-card-text>
            <v-card-text class="mt-2" style="width: 395px;padding: 0;margin: 0 auto;">
              <attached-file-avatar v-if="user['classPK'] !== '' && user['classPK'] !== 'undefined'" :pk="user['classPK']" :pick-item="item" :type="'image'"></attached-file-avatar>
            </v-card-text>
            <!-- Profile Employee -->
            <v-card-text v-if="user['className'] === 'org.opencps.usermgt.model.Employee'">
              <div class="text-bold text-xs-center mb-2">{{user['employeeFullName']}}</div>
              <div class="text-xs-center label__user_profile pb-2">
                <a href="javascript:;" style="
                      text-decoration: none;
                      border-bottom: 1px dashed;
                    ">{{user['employeeEmail']}}</a>
              </div>
              <v-layout row wrap>
                <v-flex xs12 sm4>
                  <v-subheader class="pr-0">Ngày sinh: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>{{user['employeeBirthDate']}}</v-subheader>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-subheader class="pr-0">Số điện thoại: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>{{user['employeeTelNo']}}</v-subheader>
                </v-flex>
              </v-layout>
              <!-- Đổi mật khẩu -->
              <v-layout row wrap v-if="activeChangePass">
                <v-flex xs12 class="mx-3">
                  <v-btn block color="blue darken-3" dark v-on:click.native="showChangePass">{{stateLabel}}</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
            <!-- Profile Apllicant -->
            <v-card-text class="py-3" v-else-if="user['className'] === 'org.opencps.usermgt.model.Applicant' || user['className'] === 'com.liferay.portal.kernel.model.User'">
              <div class="text-bold text-xs-center label__user_profile">{{user['applicantName']}}</div>
              <div class="text-xs-center label__user_profile pb-2">
                <a href="javascript:;" style="
                      text-decoration: none;
                      border-bottom: 1px dashed;
                    ">{{user['applicantContactEmail']}}</a>
              </div>
              <div class="text-xs-center label__user_profile">
                {{user['applicantAddress']}}
              </div>
              <hr class="my-1" style="
                    border: 0;
                    border-top: 1px solid rgba(0,0,0,.1);
                  ">
              <v-layout row wrap v-if="user['applicantType'] === 'business'">
                <v-flex xs12 sm4>
                  <v-subheader class="pr-0">Mã số thuế: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>{{user['applicantIdNo']}}</v-subheader>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-subheader class="pr-0">Ngày cấp: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader>{{user['applicantIdDate']}}</v-subheader>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 class="mx-3">
                  <v-btn block color="blue darken-3" dark v-on:click.native="showChangePass">{{stateLabel}}</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-form>
    <div class="mt-2 mb-5" v-if="user['className'] === 'org.opencps.usermgt.model.Applicant'" style="
      max-width: 1300px;
      margin: 0 auto;
    ">
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span>DANH SÁCH GIẤY TỜ ĐÃ NỘP</span>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="fileList"
        hide-actions
        class="table-landing table-bordered"
        style="border-left: 1px solid #dedede;"
      >
        <template slot="items" slot-scope="props">
          <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
            <td class="text-xs-center pt-2" width="50">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{filePage * 15 - 15 + props.index + 1}}</span><br>
              </div>
            </td>
            <td class="text-xs-left pt-2">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.displayName}}</span>
              </div>
            </td>
            <td class="text-xs-left pt-2" @click="viewDetail(props.item)" width="150">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>{{props.item.eForm ? 'Khai trực tuyến' : 'Đính kèm'}}</span>
              </div>
            </td>
            <td class="text-xs-center pt-2" width="170">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <span>
                  <span>{{props.item.modifiedDate}}</span>
                </span>
              </div>
            </td>
            <td class="text-xs-center pt-0" width="170">
              <content-placeholders v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <div v-else>
                <v-btn flat icon color="indigo" class="mr-2" @click="viewFile(props.item)" title="Xem trước">
                  <v-icon>visibility</v-icon>
                </v-btn>
                <v-btn flat icon color="green" class="mr-2" @click="downloadFile(props.item)" title="Tải xuống">
                  <v-icon>cloud_download</v-icon>
                </v-btn>
                <v-btn flat icon color="red" class="" @click="deleteFileApplicant(props.item)" title="Xóa">
                  <v-icon>delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <div class="text-xs-center mt-2">
            Không có giấy tờ nào được tìm thấy
          </div>
        </template>
      </v-data-table>
      <div class="layout wrap mt-2" style="position: relative;" v-if="totalFileList > 0">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="totalFileList" :page="filePage" custom-class="custom-tiny-class" 
            @tiny:change-page="paggingData" ></tiny-pagination> 
        </div>
      </div>
    </div>
    <v-dialog v-model="dialogPDF" max-width="1000" transition="fade-transition" style="overflow: hidden;">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{titleDialogPdf}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogPDF = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="dialogPDFLoading" style="
            min-height: 600px;
            text-align: center;
            margin: auto;
            padding: 25%;
        ">
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 600px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
    <!--  -->
    <v-dialog class="my-0" v-model="dialog_loginDVCQG" max-width="1200px" style="width:100%;max-height: 100%;">
      <v-card>
        <v-card-text class="px-0 py-0">
          <iframe id="iframeLoginDVCQG" :src="tempDVCQG" style="
            width: 100%;
            height: 650px;
            border: none;
          "></iframe>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import AttachedFileAvatar from '../ext/AttachedFileAvatar.vue'
  import AttachImage from '../ext/AttachImage.vue'
  import TinyPagination from './Pagination.vue'
  import toastr from 'toastr'
  Vue.use(toastr)
  toastr.options = {
    'closeButton': true,
    'timeOut': '3000'
  }
  export default {
    components: {
      AttachedFileAvatar,
      'tiny-pagination': TinyPagination,
      AttachImage
    },
    data: () => ({
      isBXD: false,
      indentifyNoFFileUrl: '',
      indentifyNoBFileUrl: '',
      fileCMNDFrontName: '',
      fileCMNDBackName: '',
      fileCMNDFront: '',
      fileCMNDBack: '',
      mapping: false,
      dataMapping: '',
      hasSSo: false,
      dialog_loginDVCQG: false,
      tempDVCQG: '',
      profileConfig: '',
      activeChangePass: true,
      zaloOaId: '',
      zaloOaid_token_access: '',
      userAppZaloUid: '',
      isFollowZalo: false,
      titleDialogPdf: '',
      dialogPDF: false,
      dialogPDFLoading: false,
      changePassWordFail: false,
      snackbarsuccess: false,
      oldPassWord: '',
      newPassWord: '',
      newPassWordConfirm: '',
      state: 0,
      stateLabel: 'Đổi mật khẩu',
      valid: false,
      loading: false,
      user: {},
      menuBirthDate: false,
      menuBirthDate2: false,
      toDateFormatted: null,
      ngayCap: null,
      ngaySinh: null,
      toggle_exclusive: 0,
      cityItems: [],
      districtItems: [],
      wardItems: [],
      NoiDangKyKhaiSinhdistrictItems: [],
      NoiDangKyKhaiSinhwardItems: [],
      NoiOHienTaidistrictItems: [],
      NoiOHienTaiwardItems: [],
      fileList: [],
      totalFileList: 0,
      filePage: 1,
      userInfoSet: {
        ngay_sinh: '',
        gioi_tinh: ''
      },
      sexItems: [
        {
          itemCode: '0',
          itemName: 'Chưa xác định'
        },
        {
          itemCode: '1',
          itemName: 'Nam'
        },
        {
          itemCode: '2',
          itemName: 'Nữ'
        }
      ],
      bloodGroups: [
        {
          itemCode: '00',
          itemName: 'Chưa có thông tin'
        },
        {
          itemCode: '01',
          itemName: 'Nhóm máu A'
        },
        {
          itemCode: '02',
          itemName: 'Nhóm máu B'
        },
        {
          itemCode: '03',
          itemName: 'Nhóm máu AB'
        },
        {
          itemCode: '04',
          itemName: 'Nhóm máu O'
        }
      ],
      statusApplicants: [
        {
          itemCode: '0',
          itemName: 'Chưa có thông tin'
        },
        {
          itemCode: '1',
          itemName: 'Đang sống'
        },
        {
          itemCode: '2',
          itemName: 'Đã chết'
        },
        {
          itemCode: '3',
          itemName: 'Đã mất tích'
        }
      ],
      matrimonyItems: [
        {
          itemCode: '0',
          itemName: 'Chưa có thông tin'
        },
        {
          itemCode: '1',
          itemName: 'Chưa kết hôn'
        },
        {
          itemCode: '2',
          itemName: 'Đang có vợ/ chồng'
        },
        {
          itemCode: '3',
          itemName: 'Đã ly hôn hoặc góa vợ/ chồng'
        }
      ],
      item: {
        "model": "classPK",
        'upload_api': '/o/v1/opencps/users/upload/opencps_applicant/org.opencps.usermgt.model.ApplicantAvatar',
        'remove_api': '',
        'class_name': 'org.opencps.usermgt.model.ApplicantAvatar'
      },
      itemEsign: {
        "model": "classPK",
        'upload_api': '/o/v1/opencps/users/upload/opencps_applicant/org.opencps.usermgt.model.ApplicantEsign',
        'remove_api': '',
        'class_name': 'org.opencps.usermgt.model.ApplicantEsign'
      },
      itemEsignCert: {
        "model": "classPK",
        'upload_api': '/o/v1/opencps/users/upload/opencps_applicant/org.opencps.usermgt.model.ApplicantEsignCert',
        'remove_api': '',
        'class_name': 'org.opencps.usermgt.model.ApplicantEsignCert'
      },
      rules: {
        required: (value) => !!value || 'Trường dữ liệu bắt buộc',
        passWord: (value) => {
          const pattern = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])([0-9a-zA-Z@$!%*#?&]{8,}))$/
          return pattern.test(value) || 'Ít nhất 8 ký tự và có chữ hoa, chữ thường, ký tự đặc biệt @$!%*#?&'
        }
      },
      e1: true,
      e2: true,
      e3: true,
      headers: [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Loại giấy tờ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Ngày tạo',
          align: 'center',
          sortable: false
        },
        {
          text: 'Thao tác',
          align: 'center',
          sortable: false
        }
      ],
      serverProtocolFilter: [],
      requiredOption: {
        applicantName: true,
        applicantIdNo: true,
        applicantIdDate: true,
        contactEmail: true,
        contactTelNo: false
      }
    }),
    watch: {
      ngayCap(val) {
        this.toDateFormatted = this.formatDate(val)
        this.user['applicantIdDate'] = this.toDateFormatted
      },
      ngaySinh(val) {
        this.toDateFormatted = this.formatDate(val)
        if (this.user['applicantType'] === 'citizen') {
          this.user['applicantProfile']['NgayThangNamSinh'] = this.toDateFormatted
        } else if (this.user['applicantType'] === 'business') {
          this.user['applicantProfile']['Founding_Date'] = this.toDateFormatted
        }
      },
      menuBirthDate (val) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      menuBirthDate2 (val) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentParams = newRoute.params
        let currentQuery = newRoute.query
        if (vm.user['className'] === 'org.opencps.usermgt.model.Applicant') {
          let filter = {
            applicantIdNo: vm.user['applicantIdNo'],
            page: currentQuery.hasOwnProperty('page') && currentQuery.page ? currentQuery.page : 1
          }
          vm.$store.dispatch('getDossierFilesApplicants', filter).then(function(result) {
            vm.fileList = result.data
            vm.totalFileList = result.total
            vm.filePage = currentQuery.hasOwnProperty('page') && currentQuery.page ? currentQuery.page : 1
          })
        }
      }
    },
    created () {
      var vm = this
      window.callback_dvcqg = vm.callback_dvcqg
      try {
        vm.hasSSo = ssoConect
        if (rulesConfig) {
          vm.rules = Object.assign({}, vm.rules, rulesConfig)
        }
      } catch (error) {
      }
      try {
        if (xacthuc_credit) {
          vm.isBXD = true
        }
      } catch (error) {
      }
      vm.$nextTick(function() {
        window.axios = axios
        let current = vm.$router.history.current
        let currentQuery = current.query
        vm.user = {}
        vm.$store.dispatch('getUserInfo').then(function(data) {
          vm.user = data
          window.callbackzalo = vm.callbackzalo
          vm.getServerConfig()
          if (vm.user['className'] === 'org.opencps.usermgt.model.Employee') {
            vm.item['upload_api'] = '/o/v1/opencps/users/upload/opencps_employee/org.opencps.usermgt.model.Employee'
            vm.item['class_name'] = 'org.opencps.usermgt.model.Employee'
            vm.getServerConfigAll()
          }
          if (vm.user['applicantCityCode'] && vm.user['applicantCityCode'].indexOf('0') !== 0) {
            vm.user['applicantCityCode'] = Number(vm.user['applicantCityCode'])
          }
          if (vm.user['applicantDistrictCode'] && vm.user['applicantDistrictCode'].indexOf('0') !== 0) {
            vm.user['applicantDistrictCode'] = Number(vm.user['applicantDistrictCode'])
          }
          if (vm.user['applicantWardCode'] && vm.user['applicantWardCode'].indexOf('0') !== 0) {
            vm.user['applicantWardCode'] = Number(vm.user['applicantWardCode'])
          }
          let filterCity = {
            collectionCode: 'ADMINISTRATIVE_REGION',
            level: 0,
            parent: 0
          }
          vm.$store.dispatch('loadDictItems', filterCity).then(function (result) {
            vm.cityItems = result.data
          })
          if (vm.user['applicantDistrictCode']) {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantCityCode']
            }).then(function (resultDistricts) {
              vm.districtItems = resultDistricts.data
            })
          }
          if (vm.user['applicantWardCode']) {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantDistrictCode']
            }).then(function (resultWards) {
              vm.wardItems = resultWards.data
            })
          }
          if (vm.user['className'] === 'org.opencps.usermgt.model.Applicant') {
            vm.user['applicantIdDate'] = vm.parseDateInput(vm.user['applicantIdDate'])
            let filter = {
              applicantIdNo: vm.user['applicantIdNo'],
              page: currentQuery.hasOwnProperty('page') && currentQuery.page ? currentQuery.page : 1
            }
            vm.$store.dispatch('getDossierFilesApplicants', filter).then(function(result) {
              vm.fileList = result.data
              vm.totalFileList = result.total
              vm.filePage = currentQuery.hasOwnProperty('page') && currentQuery.page ? currentQuery.page : 1
            })
          }
          if (vm.user['className'] === 'org.opencps.usermgt.model.Employee') {
            vm.user['employeeBirthDate'] = vm.parseDateInput(vm.user['employeeBirthDate'])
          }
          // 
          if (vm.user['applicantProfile'] && vm.user['applicantProfile']['NoiDangKyKhaiSinhCityCode']) {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantProfile']['NoiDangKyKhaiSinhCityCode']
            }).then(function (resultDistricts) {
              vm.NoiDangKyKhaiSinhdistrictItems = resultDistricts.data
            })
          }
          if (vm.user['applicantProfile'] && vm.user['applicantProfile']['NoiDangKyKhaiSinhDistrictCode']) {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantProfile']['NoiDangKyKhaiSinhDistrictCode']
            }).then(function (resultWards) {
              vm.NoiDangKyKhaiSinhwardItems = resultWards.data
            })
          }
          // 
          if (vm.user['applicantProfile'] && vm.user['applicantProfile']['NoiOHienTaiCityCode']) {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantProfile']['NoiOHienTaiCityCode']
            }).then(function (resultDistricts) {
              vm.NoiOHienTaidistrictItems = resultDistricts.data
            })
          }
          if (vm.user['applicantProfile'] && vm.user['applicantProfile']['NoiOHienTaiDistrictCode']) {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantProfile']['NoiOHienTaiDistrictCode']
            }).then(function (resultWards) {
              vm.NoiOHienTaiwardItems = resultWards.data
            })
          }
          let  applicantTypeTemp = vm.user['applicantProfile']
          vm.indentifyNoBFileUrl = applicantTypeTemp.indentifyNoBFileUrl
          vm.indentifyNoFFileUrl = applicantTypeTemp.indentifyNoFFileUrl
          // profileConfig cấu hình fragment
          try {
            if (vm.user['applicantType'] === 'citizen') {
              vm.profileConfig = profileConfigCitizen ? profileConfigCitizen : ''
            } else if (vm.user['applicantType'] === 'business') {
              vm.profileConfig = profileConfigBusiness ? profileConfigBusiness : ''
            }
          } catch (error) {
          }
          // Tự động đồng bộ thông tin Cổng DVC Quốc gia
          // if (currentQuery.hasOwnProperty('sync') && currentQuery.sync) {
          //   vm.checkVNConect()
          // }
          let searchParams = window.location.href.split("?")
          if (searchParams[1]) {
            let dataDVCQG = decodeURIComponent(String(vm.getSearchParams(searchParams[1], "data")))
            // console.log('dataDVCQG', dataDVCQG)
            if (dataDVCQG) {
              let dataObj = JSON.parse(atob(dataDVCQG))
              if (dataObj && dataObj.hasOwnProperty('userId') && String(dataObj.userId) === '0') {
                vm.mapping = true
                vm.dataMapping = dataObj
                vm.doMappingDvcqg()
              }
            }
          }
        })
      })
    },
    mounted () {
      let vm = this
    },
    computed: {
      snackbarerror: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarerror
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarerror', newValue)
        }
      }
    },
    methods: {
      getInfo (info) {
        let vm = this
        try {
          return JSON.parse(info)
        } catch (error) {
          return ''
        }
      },
      formatDate(date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      parseDate(date) {
        if (!date) return null
        const [day, month, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      changeBirthDate () {
        let vm = this
        vm.menuBirthDate = false
        vm.user['employeeBirthDate'] = vm.formatDate(vm.ngayCap)
      },
      changeBirthDate2 () {
        let vm = this
        vm.menuBirthDate2 = false
        if (vm.user['applicantType'] === 'citizen') {
          vm.user['applicantProfile']['NgayThangNamSinh'] = vm.formatDate(vm.ngaySinh)
        } else {
          vm.user['applicantProfile']['Founding_Date'] = vm.formatDate(vm.ngaySinh)
        }        
      },
      onChangeCity (data, districts, wards) {
        var vm = this
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: data
        }
        if (districts === 'NoiDangKyKhaiSinhdistrictItems') {
          vm.user['applicantProfile']['NoiDangKyKhaiSinhCityName'] = vm.cityItems.filter(function (item) {
            return item['itemCode'] === data
          })[0]['itemName']
        } else if (districts === 'NoiOHienTaidistrictItems') {
          vm.user['applicantProfile']['NoiOHienTaiCityName'] = vm.cityItems.filter(function (item) {
            return item['itemCode'] === data
          })[0]['itemName']
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm[districts] = result.data
          vm[wards] = []
        })
      },
      onChangeDistrict (data, wards) {
        var vm = this
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: data
        }
        if (wards === 'NoiDangKyKhaiSinhwardItems') {
          vm.user['applicantProfile']['NoiDangKyKhaiSinhDistrictName'] = vm.NoiDangKyKhaiSinhdistrictItems.filter(function (item) {
            return item['itemCode'] === data
          })[0]['itemName']
        } else if (wards === 'NoiOHienTaiwardItems') {
          vm.user['applicantProfile']['NoiOHienTaiDistrictName'] = vm.NoiOHienTaidistrictItems.filter(function (item) {
            return item['itemCode'] === data
          })[0]['itemName']
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm[wards] = result.data
        })
      },
      onChangeWard (data, wards) {
        var vm = this
        if (wards === 'NoiDangKyKhaiSinhwardItems') {
          vm.user['applicantProfile']['NoiDangKyKhaiSinhWardName'] = vm.NoiDangKyKhaiSinhwardItems.filter(function (item) {
            return item['itemCode'] === data
          })[0]['itemName']
        } else if (wards === 'NoiOHienTaiwardItems') {
          vm.user['applicantProfile']['NoiOHienTaiWardName'] = vm.NoiOHienTaiwardItems.filter(function (item) {
            return item['itemCode'] === data
          })[0]['itemName']
        }
      },
      submitUserProfile () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loading = true
          console.log('user put data', vm.user)
          if(!vm.fileCMNDFront && !vm.fileCMNDBack) {
            toastr.error('File ảnh chưa được chọn')
            vm.loading = false
            return
          }
          let filter = {
            indentifyNoFFile: vm.fileCMNDFront,
            indentifyNoBFile: vm.fileCMNDBack,
            applicantId: vm.user['classPK']
          }
          if(vm.isBXD) {
            vm.$store.dispatch('updateindentifies', filter).then(function (data) {
              let applicantProfile =  JSON.parse(data['applicantProfile'])
              vm.user['applicantProfile']['indentifyNoFFileUrl'] = applicantProfile.indentifyNoFFileUrl
              vm.user['applicantProfile']['indentifyNoBFileUrl'] = applicantProfile.indentifyNoBFileUrl
              vm.$store.dispatch('putUser', vm.user).then(function () {
                vm.loading = false
                toastr.clear()
                toastr.success('Yêu cầu thực hiện thành công')
                // vm.$store.dispatch('getUserInfo').then((data)=>{
                
                // }).catch(()=>{})
              }).catch(function () {
                vm.loading = false
                toastr.clear()
                toastr.error('Yêu cầu thực hiện thất bại')
              })
            }).catch(function () {
              vm.loading = false
              toastr.clear()
              toastr.error('Yêu cầu thực hiện thất bại')
            })
          } else {
            vm.$store.dispatch('putUser', vm.user).then(function () {
              vm.loading = false
              toastr.clear()
              toastr.success('Yêu cầu thực hiện thành công')
            }).catch(function () {
              vm.loading = false
              toastr.clear()
              toastr.error('Yêu cầu thực hiện thất bại')
            })
          }

        }
      },
      showChangePass () {
        let vm = this
        if (vm.state === 0) {
          vm.state = 1
          vm.stateLabel = 'Thông tin tài khoản'
        } else {
          vm.state = 0
          vm.stateLabel = 'Đổi mật khẩu'
          vm.$refs.form.reset()
          vm.$refs.form.resetValidation()
        }
      },
      doChangePassWord () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loading = true
          let data = {
            oldPassword : vm.oldPassWord,
            newPassword : vm.newPassWord
          }
          vm.changePassWordFail = false
          vm.$store.dispatch('changePass', data).then(function (data) {
            vm.loading = false
            // if (String(data) === 'false') {
            //   vm.changePassWordFail = true
            // } else {
              vm.snackbarsuccess = true
              toastr.success('Đổi mật khẩu thành công')
              vm.state = 0
            // }
          }).catch(function () {
            vm.doActionChangePass(data)
          })
        }
      },
      doActionChangePass (data) {
        let vm = this
        vm.changePassWordFail = false
        vm.$store.dispatch('changePass', data).then(function (data) {
          vm.loading = false
          // if (String(data) === 'false') {
          //   vm.changePassWordFail = true
          // } else {
            toastr.success('Đổi mật khẩu thành công')
            vm.snackbarsuccess = true
            vm.state = 0
          // }
        }).catch(function () {
          vm.loading = false
        })
      },
      parseDateInput (dateInput) {
        if (dateInput) {
          let date = ''
          if (isNaN(dateInput)) {
            date = new Date(dateInput)
          } else {
            date = new Date(Number(dateInput))
          }
          let dateFormated = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
          return dateFormated
        }
      },
      getMaxdate () {
        let date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      },
      itemCodeNumber (code) {
        if (code && code.indexOf('0') !== 0) {
          return Number(code)
        } else {
          return ''
        }
      },
      viewFile (file) {
        var vm = this
        vm.titleDialogPdf = file.eForm ? 'Giấy tờ khai trực tuyến' : 'Giấy tờ đính kèm'
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        document.getElementById('dialogPDFPreview').src = ''
        vm.$store.dispatch('viewFile', file).then(result => {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      },
      downloadFile (file) {
        let vm = this
        vm.$store.dispatch('downloadFile', file)
      },
      deleteFileApplicant (file) {
        let vm = this
        let x = confirm('Bạn có chắc chắn xóa giấy tờ này?')
        if (x) {
          vm.$store.dispatch('deleteFileApplicant', file).then(function (result) {
            toastr.success('Xóa giấy tờ thành công')
            let current = vm.$router.history.current
            let newQuery = current.query
            let filter = {
              applicantIdNo: vm.user['applicantIdNo'],
              page: newQuery.hasOwnProperty('page') && newQuery.page ? newQuery.page : 1
            }
            vm.$store.dispatch('getDossierFilesApplicants', filter).then(function(result) {
              vm.fileList = result.data
              vm.totalFileList = result.total
              vm.filePage = currentQuery.hasOwnProperty('page') && currentQuery.page ? currentQuery.page : 1
            })
          }).catch(function(reject) {
            toastr.error('Xóa giấy tờ không thành công')
          })
        }
      },
      getServerConfig () {
        let vm = this
        let filter = {
          serverNo: 'ZALO'
        }
        vm.$store.dispatch('getServerConfig', filter).then(function (result) {
          try {
            let zaloOAInfo = JSON.parse(result.configs)
            vm.zaloOaId = zaloOAInfo['oaid']
            vm.zaloOaid_token_access = zaloOAInfo['oaid_token_access']
            console.log('zalo_info', vm.zaloOaId, vm.zaloOaid_token_access)
            vm.getUserAppZaloInfo()
          } catch (error) {
          }
        })
      },
      getServerConfigAll () {
        let vm = this
        let filter = {
        }
        vm.serverProtocolFilter = []
        vm.$store.dispatch('getServerConfigAll', filter).then(function (result) {
          let serverNoFilter = result.filter(function (item) {
            return item.protocol === 'ACCOUNT_MAPPING'
          })
          for (let index in serverNoFilter) {
            let configs =  JSON.parse(serverNoFilter[index]['configs'])
            let serverNoData = configs['serverNoData']
            let serverConfig = result.filter(function (item) {
              return item.serverNo === serverNoData
            })
            if (serverConfig.length > 0) {
              vm.serverProtocolFilter.push(serverConfig[0])
            }
          }
          for (let index in vm.serverProtocolFilter) {
            let configs =  JSON.parse(vm.serverProtocolFilter[index]['configs'])
            let url = configs['url']
            vm.getUserTichHop(url, index)
          }
        })
      },
      getUserTichHop (arg, index) {
        let vm = this
        let filter = {
          url: arg
        }
        vm.$store.dispatch('getUserTichHop', filter).then(function (result) {
          vm.serverProtocolFilter[index].optionsData =  result
        }).catch (function () {
          vm.serverProtocolFilter[index].optionsData = []
        })
      },
      getUserAppZaloInfo () {
        let vm = this
        let url = '/o/rest/v2/users/' + vm.user['userId'] + '/preferences/ZALO_UID'
        let config = {
          headers: {
            'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          },
          params: {
            start: -1,
            end: -1
          }
        }
        window.axios.get(url, config).then(function (response) {
          if (response.data && response.data.uid) {
            vm.userAppZaloUid = response.data.uid
            vm.getZaloIsFollowing(vm.userAppZaloUid)
          } else {
            vm.isFollowZalo = false
          }
        }).catch(function (error) {
          vm.getZaloIsFollowing(vm.userAppZaloUid)
        })
      },
      getZaloIsFollowing (uid) {
        let vm = this
        let zaloOaToken = vm.zaloOaid_token_access
        let url = 'https://cors-anywhere.herokuapp.com/https://openapi.zalo.me/v2.0/oa/getprofile?access_token=' + zaloOaToken + '&data={"user_id":"' + uid + '"}'
        $.ajax({
          url: url,
          method: 'GET',
          success: function(data){
            console.log(data)
            if (data['user_id']) {
              vm.isFollowZalo = true
            }
          }
        })
      },
      callbackzalo (responeFromZalo) {
        let vm = this
        let url = '/o/rest/v2/users/' + vm.user['userId'] + '/preferences/ZALO_UID'
        const config = {
          headers: {
            'groupId': window.themeDisplay ? window.themeDisplay.getScopeGroupId() : ''
          }
        }
        let params = new URLSearchParams()
        params.append('value', '{"uid":"' + responeFromZalo.userId + '"}')
        window.axios.put(url, params, config).then(function (response) {
        }).catch(function (error) {
        })
      },
      checkVNConect () {
        let vm = this
        let filter = {
          state: '',
          redirectURL: window.location.href.split("?")[0]
        }
        vm.$store.dispatch('getVNConect', filter).then(function (result) {
          if (result) {
            window.location.href = result
          } else {
            alert('Chức năng đang cập nhật')
          }
        }).catch(function () {
          alert('Chức năng đang cập nhật')
        })
      },
      doMappingDvcqg () {
        let vm = this
        let filter = {
          dataMapping: vm.dataMapping
        }
        vm.$store.dispatch('mappingDvcqg', filter).then(function (result) {
        }).catch(function () {
        })
      },
      callback_dvcqg (data) {
        let vm = this
        let current = vm.$router.history.current
        let currentQuery = current.query
        if (String(data['userId']) !== '0') {
          vm.dialog_loginDVCQG = false
          // if (!currentQuery.hasOwnProperty('sync')) {
            // window.location.href = window.themeDisplay.getLayoutURL() + '#' + current.path
            // window.location.reload()
            let url = window.themeDisplay.getLayoutURL() + '#' + current.path
            window.open(url, '_self')
          // }
        } else {
          toastr.error('Chưa có tài khoản đăng ký tại Cổng DVC Quốc gia')
        }
      },
      paggingData (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'page=' + config.page
        vm.$router.push({
          path: current.path + queryString
        })
      },
      onPickFileCMNDFront () {
        this.$refs.refFileCMNDFront.click()
      },
      onPickFileCMNDBack () {
        this.$refs.refFileCMNDBack.click()
      },
      onFileCMNDFrontPicked (event) {
        let vm = this
        const files = event.target.files
        if(files.length){
          const file = files[0]
          console.log(files)
          console.log(files[0])
          vm.fileCMNDFront = file
          vm.fileCMNDFrontName = files[0].name
        }
      },
      onFileCMNDBackPicked (event) {
        let vm = this
        const files = event.target.files
        if(files.length){
          const file = files[0]
          console.log(files)
          console.log(files[0])
          vm.fileCMNDBack = file
          vm.fileCMNDBackName = files[0].name
        }
      },
      changeImageFront(config) {
        let vm = this
        vm.fileCMNDFront = config.file
        console.log(config)
      },
      changeImageBack(config) {
        let vm = this
        vm.fileCMNDBack = config.file
        console.log(config)
      }
    }
  }
</script>