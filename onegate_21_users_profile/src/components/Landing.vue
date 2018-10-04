<template>
  <v-layout wrap style="
    max-width: 1300px;
    margin: 0 auto;
  ">
    <v-flex class="xs12 sm8">
      <v-card style="border-radius: 4px;-webkit-box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;">
        <div class="row-header">
          <div class="background-triangle-big">
            <span v-if="currentTab">THÔNG TIN TÀI KHOẢN</span>
            <span v-else>THAY ĐỔI MẬT KHẨU</span>
          </div>
          <div class="layout row wrap header_tools">
            <div class="flex text-right" style="margin-left: auto;">
              <v-btn v-if="currentTab" color="primary" v-on:click.native="currentTab = !currentTab" flat class="my-0 btn-border-left" active-class="temp_active">
                <v-icon>verified_user</v-icon>&nbsp;
                <span>Đổi mật khẩu</span>
              </v-btn>
              <v-btn v-else color="primary" v-on:click.native="currentTab = !currentTab" flat class="my-0 btn-border-left" active-class="temp_active">
                <v-icon>how_to_reg</v-icon>&nbsp;
                <span>Thông tin tài khoản</span>
              </v-btn>
            </div>
          </div> 
        </div>
        <v-form v-if="currentTab" ref="form" v-model="valid" lazy-validation class="py-3 px-3">
          <v-layout v-if="user['className'] === 'employee'" wrap>
            <!-- row:1 -->
            <v-flex xs6 sm6>
              <v-text-field
                label="Tên người dùng"
                v-model="user.fullName"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm3>
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
            <v-flex xs6 sm6>
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
                v-bind:files="fileImgEsign"
                v-on:init="loadImgEsign"/>
            </v-flex>
            <v-flex xs6 sm6 class="mt-2">
              <p class="text-bold">File chứng thư gốc:</p>
              <file-pond
                label-idle="Cập nhật chứng thư gốc"
                accepted-file-types="image/jpeg, image/png"
                :server='serverEsignCert'
                v-bind:files="fileEsignCert"
                v-on:init="loadEsignCert"/>
            </v-flex>
          </v-layout>
          <v-layout v-else wrap>
            <!-- row:1 -->
            <v-flex xs6 sm4>
              <v-text-field
                label="Họ và tên"
                v-model="user.applicantName"
                box
                :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
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
                multi-line
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm4 class="pr-3 input-group--text-field-box">
              <v-select
                :items="cityItems"
                label="Tỉnh/thành phố"
                v-model="user.cityCode"
                item-text="itemName"
                item-value="itemCode"
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
                autocomplete
                :hide-selected="true"
              ></v-select>
            </v-flex>
            <v-flex xs4 class="input-group--text-field-box">
              <v-select
                label="Xã/phường"
                :items="wardItems"
                v-model="user.wardCode"
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
          <v-layout wrap>
            <v-flex xs3>
              <v-subheader>Mật khẩu hiện tại</v-subheader>
            </v-flex>
            <v-flex xs9>
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
            <v-flex xs9>
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
            <v-flex xs9>
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
    <v-flex class="xs12 sm4 px-3">
      <v-card style="border-radius: 4px;-webkit-box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;box-shadow: 0 0 2rem 0 rgba(136,152,170,.15)!important;">
        <v-card-text style="height: 180px;">
          <file-pond
            ref="pond"
            name="file"
            label-idle="<strong><i aria-hidden='true' class='icon material-icons' style='font-size: 80px;'>photo_camera</i></strong>"
            allow-multiple="false"
            accepted-file-types="image/jpeg, image/png"
            :server='serverImgAvatar'
            v-bind:files="filesImgAvatar"
            v-on:init="loadImgAvatar"/>
        </v-card-text>
        <v-card-text v-if="user.className === 'employee'">
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
        </v-card-text>
        <v-card-text v-else>
          <div class="text-bold text-xs-center label__user_profile">{{user.applicantName}} nguyen van a</div>
          <div class="text-xs-center label__user_profile">
            <a href="javascript:;" style="
              text-decoration: none;
              border-bottom: 1px dashed;
            ">binhth@fds.vn</a>
          </div>
          <div class="text-xs-center label__user_profile">
            Xã Việt Đoàn, huyện Tiên Du, tỉnh Bắc Ninh, số 183 chợ sơn khu phố 1 phường 2 đặc chủng khu vực
          </div>
          <hr class="my-3" style="
            border: 0;
            border-top: 1px solid rgba(0,0,0,.1);
          ">
          <v-layout row wrap>
            <v-flex xs4>
              <v-subheader class="pr-0">Mã số thuế: </v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-subheader>125458129</v-subheader>
            </v-flex>
            <v-flex xs4>
              <v-subheader class="pr-0">Ngày cấp: </v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-subheader>14/08/2008</v-subheader>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import router from '@/router'
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
    valid: false,
    loading: false,
    currentTab: true,
    cityItems: [],
    districtItems: [],
    wardItems: [],
    cityCode: '',
    districtCode: '',
    wardCode: '',
    user: {},
    serverImgAvatar: {
    },
    filesImgAvatar: [],
    serverImgEsign: {
    },
    fileEsignCert: [],
    serverEsignCert: {
    },
    fileImgEsign: [],
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
          console.log('user', vm.user)
          vm.getUserDetail(vm.user)
        }).catch(xhr => {
        })
        vm.filesImgAvatar = ['/o/gate/v2/users/' + result['user'].userId + '/photo']
        vm.serverImgAvatar = {
          url: '/o/gate/v2/users/' + result['user'].userId + '/photo',
          process: {
            url: '',
            method: 'PUT',
            withCredentials: false,
            headers: {
              groupId: result.groupId,
              Token: window.Liferay.authToken
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
              groupId: result.groupId,
              Token: window.Liferay.authToken
            },
            timeout: 5000,
            onload: null,
            onerror: null
          }
        }
        vm.fileImgEsign = ['/o/gate/v2/users/' + result['user'].userId + '/esign']
        vm.serverImgEsign = {
          url: '/o/gate/v2/users/' + result['user'].userId + '/esign',
          process: {
            url: '',
            method: 'PUT',
            withCredentials: false,
            headers: {
              groupId: result.groupId,
              Token: window.Liferay.authToken
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
              groupId: result.groupId,
              Token: window.Liferay.authToken
            },
            timeout: 5000,
            onload: null,
            onerror: null
          }
        }
        vm.fileEsignCert = ['/o/gate/v2/users/' + result['user'].userId + '/esigncert']
        vm.serverEsignCert = {
          url: '/o/gate/v2/users/' + result['user'].userId + '/esigncert',
          process: {
            url: '',
            method: 'PUT',
            withCredentials: false,
            headers: {
              groupId: result.groupId,
              Token: window.Liferay.authToken
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
              groupId: result.groupId,
              Token: window.Liferay.authToken
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
      } else if (user['className'] === 'employee') {
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

<style>
  body .filepond--panel-center {
    height: 80px!important;
    border-radius: 50%!important;
    width: 170.047px;
    margin: 0 auto;
  }
  .filepond--drop-label label {
    height: 180px;
    position: relative;
  }
  .filepond--panel-bottom, .filepond--panel-top {
    display: none;
  }
  .label__user_profile {
    padding: 5px 0;
  }
  .user__profile_container .input-group {
    padding: 5px 10px 0;
  }
  .user__profile_container .input-group--text-field label {
    position: initial;
    color: #212121 !important;
  }
  .user__profile_container .input-group--text-field-box:not(.input-group--textarea).input-group--multi-line .input-group__input {
    padding-top: 5px;
  }
</style>
