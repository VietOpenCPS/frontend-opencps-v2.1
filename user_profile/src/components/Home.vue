<template>
  <v-app>
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
                  Vui lòng kiểm tra lại mật khẩu cũ, mật khẩu yêu cầu 8 ký tự và có chữ hoa chữ thường.
                </v-alert>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-text-field type="password" v-model="oldPassWord" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc']" required>
                  <template slot="label">Mật khẩu cũ <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-text-field type="password" v-model="newPassWord" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc', v => v!==oldPassWord || 'Mật khẩu mới trùng mật khẩu cũ']" required>
                  <template slot="label">Mật khẩu mới <span class="red--text darken-3">*</span></template>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm3></v-flex>
              <v-flex xs12 sm6>
                <v-text-field type="password" v-model="newPassWordConfirm" box :rules="[v => !!v || 'Trường dữ liệu bắt buộc', v => v===newPassWord || 'Mật khẩu nhập lại không chính xác']" required>
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
                  <v-date-picker v-model="ngayCap" no-title @input="changeBirthDate"></v-date-picker>
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
            <v-card-text class="pt-3" style="width: 300px;padding: 0;margin: 0 auto;">
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
            <v-card-text v-else-if="user['className'] === 'org.opencps.usermgt.model.Applicant'">
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
              <hr class="my-3" style="
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
    <v-snackbar v-model="snackbarerror" :bottom="false" :left="false" :multi-line="false" :right="true" :timeout="2000" :top="true" :vertical="false" color="red darken-3">
      Yêu cầu thực hiện thất bại
      <v-btn icon @click="closeError()">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbarsuccess" :bottom="false" :left="false" :multi-line="false" :right="true" :timeout="2000" :top="true" :vertical="false" color="success">
      Yêu cầu thực hiện thành công
      <v-btn icon @click="snackbarsuccess = !snackbarsuccess">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  import AttachedFileAvatar from './ext/AttachedFileAvatar.vue'
  
  export default {
    components: {
      AttachedFileAvatar
    },
    data: () => ({
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
      }
    }),
    watch: {
      ngayCap(val) {
        this.toDateFormatted = this.formatDate(val)
        this.user['applicantIdDate'] = this.toDateFormatted
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function() {
        vm.user = {}
        vm.$store.dispatch('getUserInfo').then(function(data) {
          vm.user = data
          if (vm.user['className'] === 'org.opencps.usermgt.model.Employee') {
            vm.item['upload_api'] = '/o/v1/opencps/users/upload/opencps_applicant/org.opencps.usermgt.model.EmployeeAvatar'
            vm.item['class_name'] = 'rg.opencps.usermgt.model.EmployeeAvatar'
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
          if (vm.user['applicantDistrictCode'] !== '') {
            vm.$store.dispatch('loadDictItems', {
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.user['applicantCityCode']
            }).then(function (resultDistricts) {
              vm.districtItems = resultDistricts.data
            })
          }
          if (vm.user['applicantWardCode'] !== '') {
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
            vm.snackbarsuccess = true
            vm.loading = false
          }).catch(function () {
            vm.loading = false
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
            }
          }).catch(function () {
            vm.loading = false
          })
        }
      },
      parseDateInput (dateInput) {
        if (dateInput) {
          let date = new Date(dateInput)
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
        }
      },
      itemCodeNumber (code) {
        if (code && code.indexOf('0') !== 0) {
          return Number(code)
        } else {
          return ''
        }
      }
    }
  }
</script>