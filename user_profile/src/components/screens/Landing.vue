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
            <v-layout v-if="state === 0 && user['className'] === 'org.opencps.usermgt.model.Applicant'" row wrap class="px-3 py-3">
              <v-flex xs12 sm4>
                <v-text-field v-model="user['applicantName']" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required>
                  <template slot="label"> 
                    <span v-if="user['applicantType'] === 'business'">Tên tổ chức, doanh nghiệp</span>
                    <span v-if="user['applicantType'] === 'citizen'">Họ tên</span> 
                    <span class="red--text darken-3">*</span>
                  </template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Điện thoại" v-model="user['applicantContactTelNo']" box></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field label="Thư điện tử" v-model="user['applicantContactEmail']" box disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business'">
                <v-text-field label="Mã số thuế" v-model="user['applicantIdNo']" box disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 v-if="user['applicantType'] === 'business'">
                <v-text-field label="Ngày cấp" v-model="user['applicantIdDate']" box disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm12>
                <v-textarea label="Địa chỉ" v-model="user['applicantAddress']" box clearable></v-textarea>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="user['applicantCityCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeCity($event)"></v-autocomplete>
              </v-flex>
  
              <v-flex xs12 sm4>
                <v-autocomplete :items="districtItems" label="Quận/huyện" v-model="user['applicantDistrictCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box @change="onChangeDistrict($event)"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm4>
                <v-autocomplete label="Xã/phường" :items="wardItems" v-model="user['applicantWardCode']" item-text="itemName" item-value="itemCode" :hide-selected="true" box></v-autocomplete>
              </v-flex>
              <v-flex sm12 class="text-xs-right">
                <v-btn color="blue darken-3" :loading="loading" :disabled="loading" v-on:click="submitUserProfile" class="mx-0" dark>
                  <v-icon>done</v-icon>&nbsp; Cập nhật thông tin
                </v-btn>
              </v-flex>
            </v-layout>

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
            <v-card-text class="my-0 py-0 px-0">
              <v-flex xs12 class="text-right" style="height: 30px;">
                <v-tooltip top v-if="!isFollowZalo">
                  <div class="zalo-follow-only-button" data-oaid="579745863508352884" data-callback="callbackzalo"
                    slot="activator" style="width:90px">
                  </div>
                  <span>Nhấn Quan tâm để có thể nhận thông báo về tình hình xử lý hồ sơ trên ứng dụng Zalo </span>
                </v-tooltip>
              </v-flex>
            </v-card-text>
            <v-card-text class="mt-2" style="width: 395px;padding: 0;margin: 0 auto;">
              <attached-file-avatar v-if="user['classPK'] !== '' && user['classPK'] !== 'undefined'" :pk="user['classPK']" :pick-item="item" :type="'image'"></attached-file-avatar>
            </v-card-text>
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
              <v-layout row wrap>
                <v-flex xs12 class="mx-3">
                  <v-btn block color="blue darken-3" dark v-on:click.native="showChangePass">{{stateLabel}}</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text class="py-3" v-else-if="user['className'] === 'org.opencps.usermgt.model.Applicant'">
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import AttachedFileAvatar from '../ext/AttachedFileAvatar.vue'
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
      'tiny-pagination': TinyPagination
    },
    data: () => ({
      zaloOaId: '402033447373752096333',
      zaloOaid_token_access: 'ZAK13QrlEIg1fGC4e6myB8Aa0WMkTNj_skCICgqkMXxguJfYoITG4fkwR4ZHCoCOh8WUPOaSS2oaZXTto09N8f2-DK_c95PaYgvhGj8SBXkhX7TFvWqAQ8g6T3RGFJ9AlP95PleE4Jwud4fYmb4MFeRWI6lONZ83_SbLNfvUON31y5zSlJmY1fcXHcxbA3f6mAHk8RakCGdFjMXOZmmH0lEUJKwrE7CqrB0NVBCfR2hFeHjJxHL62y-_U4ozTWK3pUewAfCuTGotWouXSHN_3H-gT3uX',
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
      toDateFormatted: null,
      ngayCap: null,
      toggle_exclusive: 0,
      cityItems: [],
      districtItems: [],
      wardItems: [],
      fileList: [],
      totalFileList: 0,
      filePage: 1,
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
      ]
    }),
    watch: {
      ngayCap(val) {
        this.toDateFormatted = this.formatDate(val)
        this.user['applicantIdDate'] = this.toDateFormatted
      },
      menuBirthDate (val) {
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
    created() {
      var vm = this
      vm.$nextTick(function() {
        window.axios = axios
        let current = vm.$router.history.current
        let currentQuery = current.query
        vm.user = {}
        vm.$store.dispatch('getUserInfo').then(function(data) {
          vm.user = data
          window.callbackzalo = vm.callbackzalo
          vm.getUserAppZaloInfo()
          if (vm.user['className'] === 'org.opencps.usermgt.model.Employee') {
            vm.item['upload_api'] = '/o/v1/opencps/users/upload/opencps_employee/org.opencps.usermgt.model.Employee'
            vm.item['class_name'] = 'org.opencps.usermgt.model.Employee'
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
        })
      })
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
      onChangeCity (data) {
        var vm = this
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: data
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.districtItems = result.data
          vm.wardItems = []
        })
      },
      onChangeDistrict (data) {
        var vm = this
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: data
        }
        vm.$store.dispatch('loadDictItems', filter).then(function (result) {
          vm.wardItems = result.data
        })
      },
      submitUserProfile () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loading = true
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
      },
      showChangePass () {
        let vm = this
        if (vm.state === 0) {
          vm.state = 1
          vm.stateLabel = 'Thông tin tài khoản'
        } else {
          vm.state = 0
          vm.stateLabel = 'Đổi mật khẩu'
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
            if (String(data) === 'false') {
              vm.changePassWordFail = true
            } else {
              vm.snackbarsuccess = true
              vm.state = 1
            }
          }).catch(function () {
            vm.loading = false
          })
        }
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
        window.axios.get(url).then(function (response) {
          console.log(response.data)
          if (response.data && response.data['user_id']) {
            vm.isFollowZalo = true
          }
          // vm.zaloOaId = response.data.message !== 'Success' ? vm.MSystemConfiguration.configuration.zalo.oaid : ''
        }).catch(function (error) {
          console.log(error)
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
      }
    }
  }
</script>