<template>
  <v-layout wrap>
    <v-flex class="xs12 sm9">
      <v-card class="mx-3 my-3">
        <div class="row-header">
          <div class="background-triangle-big">
            <span v-if="currentTab">THÔNG TIN TÀI KHOẢN</span>
            <span v-else>THAY ĐỔI MẬT KHẨU</span>
          </div>
          <div class="layout row wrap header_tools">
            <div class="flex xs4 sm3 text-right" style="margin-left: auto;">
              <v-btn v-if="currentTab" color="primary" @click="()=>currentTab = !currentTab" flat class="my-0 mx-0 btn-border-left" active-class="temp_active">
                <v-icon>verified_user</v-icon>&nbsp;
                <span>Đổi mật khẩu</span>
              </v-btn>
              <v-btn v-else color="primary" @click="()=>currentTab = !currentTab" flat class="my-0 mx-0 btn-border-left" active-class="temp_active">
                <v-icon>how_to_reg</v-icon>&nbsp;
                <span>Thông tin tài khoản</span>
              </v-btn>
            </div>
          </div> 
        </div>
        <v-form v-if="currentTab" ref="form" v-model="valid" lazy-validation>
          <v-layout v-if="user['className'] === 'employee'" wrap class="px-3">
            <!-- row:1 -->
            <v-flex xs6 sm6 class="pr-3">
              <v-text-field
                label="Tên người dùng"
                v-model="user.fullName"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm3 class="pr-3">
              <v-text-field
                label="Số điện thoại"
                v-model="user.telNo"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm3>
              <v-text-field
                label="Thư điện tử"
                v-model="user.email"
                box
              ></v-text-field>
            </v-flex>
            <!-- row:2 -->
            <v-flex xs6 sm6 class="pr-3">
              <v-text-field
                label="Tài khoản đăng nhập"
                v-model="user.email"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6>
              <v-text-field
                label="Contact code"
                v-model="user.email"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                label="Chức danh ký số"
                v-model="user.email"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                label="Địa điểm ký số"
                v-model="user.email"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm6 class="mt-2 pr-3">
              <p class="text-bold">File ảnh ký số:</p>
              <file-pond
                label-idle="Cập nhật ảnh ký sô"
                accepted-file-types="image/jpeg, image/png"
                :server='serverImgEsign'
                v-bind:files="filesImgAvatar"
                v-on:init="loadImgEsign"/>
            </v-flex>
            <v-flex xs6 sm6 class="mt-2">
              <p class="text-bold">File chứng thư gốc:</p>
              <file-pond
                label-idle="Cập nhật chứng thư gốc"
                accepted-file-types="image/jpeg, image/png"
                :server='serverEsignCert'
                v-bind:files="myFiles"
                v-on:init="loadEsignCert"/>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap class="px-3">
            <!-- row:1 -->
            <v-flex xs6 sm4 class="pr-3">
              <v-text-field
                label="Họ và tên"
                v-model="user.applicantName"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs4 class="pr-3">
              <v-text-field
                label="Điện thoại"
                v-model="user.contactTelNo"
                box
              ></v-text-field>
            </v-flex>
            <v-flex sm4>
              <v-text-field
                label="Thư điện tử"
                v-model="user.contactEmail"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
              <v-text-field
                label="Địa chỉ"
                v-model="user.address"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm4 class="pr-3 input-group--text-field-box">
              <v-select
                :items="cityItems"
                label="Tỉnh/thành phố"
                v-model="user.cityCode"
                item-text="itemName"
                item-value="itemCode"
                @change="onChangeCity"
                autocomplete
                :hide-selected="true"
              ></v-select>
            </v-flex>

            <v-flex xs6 sm4 class="pr-3 input-group--text-field-box">
              <v-select
                :items="districtItems"
                label="Quận/huyện"
                v-model="user.districtCode"
                item-text="itemName"
                item-value="itemCode"
                @change="onChangeDistrict"
                autocomplete
                :hide-selected="true"
              ></v-select>
            </v-flex>
            <v-flex xs4 class="input-group--text-field-box">
              <v-select
                label="Xã/phường"
                :items="wardItems"
                v-model="user.wardCode"
                @change="onChangeWard"
                item-text="itemName"
                item-value="itemCode"
                autocomplete
                :hide-selected="true"
              ></v-select>
            </v-flex>
          </v-layout>
          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitUserProfile"
            >
              <v-icon>save</v-icon>&nbsp;
              Cập nhật thông tin
            </v-btn>
          </div>
        </v-form>
        <v-form v-else ref="form" v-model="valid" lazy-validation>
          <v-layout wrap class="px-3 py-3">
            <v-flex xs3>
              <v-subheader>Mật khẩu hiện tại</v-subheader>
            </v-flex>
            <v-flex xs9 class="pr-3">
              <v-text-field
                v-model="passWord"
                box
                :append-icon="passField1 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (passField1 = !passField1)"
                :rules="[() => ('Trường dữ liệu bắt buộc')]"
                :type="passField1 ? 'password' : 'text'"
                hint="Ít nhất 6 ký tự"
                min="6"
              ></v-text-field>
            </v-flex>

            <v-flex xs3>
              <v-subheader>Mật khẩu mới</v-subheader>
            </v-flex>
            <v-flex xs9 class="pr-3">
              <v-text-field
                v-model="newPassWord"
                box
                :append-icon="passField2 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (passField2 = !passField2)"
                :rules="[() => ('Trường dữ liệu bắt buộc')]"
                :type="passField2 ? 'password' : 'text'"
                hint="Ít nhất 6 ký tự"
                min="6"
              ></v-text-field>
            </v-flex>

            <v-flex xs3>
              <v-subheader>Nhập lại mật khẩu mới</v-subheader>
            </v-flex>
            <v-flex xs9 class="pr-3">
              <v-text-field
                v-model="againNewPassWord"
                box
                :append-icon="passField3 ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (passField3 = !passField3)"
                :rules="[() => ('Trường dữ liệu bắt buộc')]"
                :type="passField3 ? 'password' : 'text'"
                hint="Ít nhất 6 ký tự"
                min="6"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <div class="text-xs-center my-2">
            <v-btn color="primary"
              :loading="loading"
              :disabled="loading"
              @click="submitUserPassWord"
            >
              <v-icon>save</v-icon>&nbsp;
              Cập nhật mật khẩu
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-flex>
    <!-- content-right -->
    <v-flex class="xs12 sm3">
      <v-card class="mr-3 my-3">
        <v-card-text style="height: 100px;border:1px solid #dedede">
          <file-pond
            ref="pond"
            label-idle="Cập nhật ảnh đại diện"
            accepted-file-types="image/jpeg, image/png"
            :server='serverImgAvatar'
            v-bind:files="filesImgAvatar"
            v-on:init="loadImgAvatar"/>
        </v-card-text>
        <div class="px-3 py-3" v-if="userType === 'employee'">
          <div class="text-bold text-xs-center mb-2">{{user.fullName}}</div>
          <div>
            <span>Ngày sinh:</span>&nbsp; <span class="text-bold">{{user.birthdate}}</span>
          </div>
          <div>
            <span>Thư điện tử:</span>&nbsp; <span class="text-bold">{{user.email}}</span>
          </div>
          <div>
            <span>Số điện thoại:</span>&nbsp; <span class="text-bold">{{user.telNo}}</span>
          </div>
        </div>
        <div class="px-3 py-3" v-else>
          <div class="text-bold text-xs-center mb-2">{{user.applicantName}}</div>
          <div>
            <span v-if="applicantIdType == 'citizen'">Số CMND/Hộ chiếu:</span>
            <span v-else>Mã số thuế:</span>
            &nbsp; <span class="text-bold">{{user.applicantIdNo}}</span>
          </div>
          <div>
            <span>Ngày cấp:</span>&nbsp; <span class="text-bold">{{user.applicantIdDate}}</span>
          </div>
          <div>
            <span>Thư điện tử:</span>&nbsp; <span class="text-bold">{{user.contactEmail}}</span>
          </div>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import router from '@/router'
import Vue from 'vue/dist/vue.min.js'
import $ from 'jquery'
import support from '../store/support.json'
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)
export default {
  props: [],
  components: {
    FilePond
  },
  data: () => ({
    loading: false,
    currentTab: true,
    cityItems: [],
    districtItems: [],
    wardItems: [],
    cityCode: '',
    districtCode: '',
    wardCode: '',
    user: {
      userId: 123,
      fullName: 'Nguyễn Vũ Nam',
      birthDay: '20/09/1985',
      telNo: '0868979395',
      email: 'namnv@sct.phutho.gov',
      nameAccount: 'namnv@sct.phutho.gov',
      contactCode: 'EMP001',
      jobposKeySign: 'Mis',
      locationKeySign: 'HaNoi',
      imageUrl: '',
      applicantType: 'citizen'
    },
    userType: 'employee',
    serverImgAvatar: {
    },
    filesImgAvatar: [],
    serverImgEsign: {
      url: '',
      process: {
        url: '',
        method: 'PUT',
        withCredentials: false,
        headers: {},
        timeout: 5000,
        onload: null,
        onerror: null
      }
    },
    serverEsignCert: {
      url: '',
      process: {
        url: '',
        method: 'PUT',
        withCredentials: false,
        headers: {},
        timeout: 5000,
        onload: null,
        onerror: null
      }
    },
    passWord: '',
    newPassWord: '',
    againNewPassWord: '',
    passField1: true,
    passField2: true,
    passField3: true
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.currentTab = true
      vm.$store.dispatch('loadInitResource').then(result => {
        let filter = {
          userId: result['user'].userId
        }
        vm.$store.dispatch('loadUser', filter).then(result => {
          vm.user = result
          vm.getUserDetail(vm.user)
        }).catch(xhr => {
        })
        vm.filesImgAvatar = ['/o/rest/v2/users/' + result['user'].userId + '/photo']
        vm.serverImgAvatar = {
          url: '/o/rest/v2/users/' + result['user'].userId + '/photo',
          process: {
            url: '',
            method: 'PUT',
            withCredentials: false,
            headers: {
              groupId: result.groupId
            },
            timeout: 5000,
            onload: vm.loadImgAvatar,
            onerror: vm.loadImgAvatar
          },
          load: {
            url: '',
            method: 'GET',
            withCredentials: false,
            headers: {
              groupId: result.groupId
            },
            timeout: 5000,
            onload: null,
            onerror: null
          }
        }
      }).catch(xhr => {
      })
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
  },
  methods: {
    getUserDetail (user) {
      var vm = this
      if (user['className'] === 'applicant') {
        let filterCity = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0
        }
        vm.$store.getters.getDictItems(filterCity).then(function (result) {
          vm.cityItems = result.data
        })
        if (vm.cityCode) {
          vm.$store.getters.getDictItems({
            collectionCode: 'ADMINISTRATIVE_REGION',
            level: 1,
            parent: user.cityCode
          }).then(function (resultDistricts) {
            vm.districtItems = resultDistricts.data
          })
        }
        if (vm.districtCode) {
          vm.$store.getters.getDictItems({
            collectionCode: 'ADMINISTRATIVE_REGION',
            level: 1,
            parent: user.districtCode
          }).then(function (resultWards) {
            vm.wardItems = resultWards.data
          })
        }
      } else if (vm.userType === 'employee') {
      }
    },
    onChangeCity (data) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.districtItems = result.data
        vm.wardItems = []
      })
    },
    onChangeDistrict (data) {
      console.log('district', data)
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.wardItems = result.data
      })
    },
    onchangeWard (data) {
      console.log('ward', data)
    },
    submitUserProfile () {
      var vm = this
      vm.$store.dispatch('putUser', vm.user).then(result => {
      })
    },
    submitUserPassWord () {
    },
    loadImgAvatar () {
      var vm = this
    },
    loadImgEsign () {
    },
    loadEsignCert () {
    }
  }
}
</script>
