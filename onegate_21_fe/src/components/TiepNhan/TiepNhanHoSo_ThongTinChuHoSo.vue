<template>
  <div>
    <v-form v-model="valid_thongtinchuhoso" ref="formChuHoSo" lazy-validation>
      <div>
        <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div> Thông tin chủ hồ sơ</div>
              <v-card>
                <v-tooltip left v-if="(!thongTinChuHoSo.userType || (originality === 1 && thongTinChuHoSo.applicantIdType === 'business')) && bussinessExits"
                style="position:absolute;right:5px;z-index:101"
                >
                  <v-btn slot="activator" class="my-0 mt-1" fab icon small dark color="primary" @click.native="getApplicantInfos()" style="width:32px!important;height:32px!important"
                  >
                    <v-icon dark>account_balance</v-icon>
                  </v-btn>
                  <span>Đối chiếu thông tin doanh nghiệp</span>
                </v-tooltip>
                <v-card-text class="pt-3">
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0"> <!-- {{thongTinChuHoSo.userType}} --> {{ labelSwitch[thongTinChuHoSo.userType].cmtnd }} <span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-text-field
                        v-if="originality === 1 || originality === '1'"
                        v-model="thongTinChuHoSo.applicantIdNo"
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        @input="changeApplicantInfos"
                        :disabled="loadingVerify"
                      ></v-text-field>
                      <suggestions
                        v-if="originality === 3 || originality === '3'"
                        v-model="thongTinChuHoSo.applicantIdNo"
                        :options="searchOptions"
                        :onItemSelected="onSearchItemSelected"
                        :onInputChange="onInputChange"
                        :class="loadingVerify ? 'input-group--disabled' : ''"
                        :style="loadingVerify ? 'color:#00000061' : ''"
                        >
                        <div slot="item" slot-scope="props" class="single-item">
                          <v-list-tile-content>
                            <v-list-tile-title v-html="props.item.applicantName"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="props.item.applicantIdNo"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </div>
                      </suggestions>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0"> {{ labelSwitch[thongTinChuHoSo.userType].nguoi_nop }}<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                        v-else
                        v-model="thongTinChuHoSo.applicantName"
                        @input="changeApplicantInfos"
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        :disabled="loadingVerify"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Địa chỉ <span v-if="originality === 1" style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinChuHoSo.address"
                      multi-line
                      rows="2"
                      :rules="originality === 1 ? [v => !!v || 'Trường dữ liệu bắt buộc'] : ''"
                      required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Tỉnh/Thành phố<span style="color:red">&nbsp;*&nbsp;</span> : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-select
                      v-else
                      :items="citys"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="thongTinChuHoSo.cityCode"
                      @change="onChangeCity"
                      autocomplete
                      :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                      required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Quận/Huyện <span style="color:red">&nbsp;*&nbsp;</span> : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-select
                      v-else
                      :items="districts"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="thongTinChuHoSo.districtCode"
                      @change="onChangeDistrict"
                      autocomplete
                      :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                      required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Xã/Phường <span style="color:red">&nbsp;*&nbsp;</span> : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-select
                      v-else
                      :items="wards"
                      item-text="itemName"
                      item-value="itemCode"
                      v-model="thongTinChuHoSo.wardCode"
                      autocomplete
                      @change="onChangeWard"
                      :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                      required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Số điện thoại <span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinChuHoSo.contactTelNo"
                      append-icon="phone"
                      :rules="[rules.telNo, rules.required]"
                      required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Địa chỉ E-mail <span v-if="originality === 1" style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinChuHoSo.contactEmail"
                      :rules="originality === 1 ? [rules.email, rules.required] : (thongTinChuHoSo.contactEmail && originality !== 1 ? [rules.email] : '')"
                      required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div class="absolute__btn" style="width: 380px;" v-if="originality !== 1">
            <content-placeholders class="mt-1" v-if="loading">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <v-radio-group v-else v-model="thongTinChuHoSo.userType" row @change="checkApplicantInfos">
              <v-radio label="Công dân" :value="true"></v-radio>
              <v-radio label="Tổ chức, doanh nghiệp" :value="false"></v-radio>
            </v-radio-group>
          </div>
          <div style="position: relative;" v-if="originality !== 1">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div> Thông tin người nộp hồ sơ</div>
                <v-card>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">CMND/Hộ chiếu <span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-if="originality === 1 || originality === '1'"
                        v-model="thongTinNguoiNopHoSo.delegateIdNo"
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        ></v-text-field>
                        <!--  -->
                        <suggestions
                          v-if="originality === 3 || originality === '3'"
                          v-model="thongTinNguoiNopHoSo.delegateIdNo"
                          :options="searchOptions"
                          :onItemSelected="onSearchItemSelected1"
                          :onInputChange="onInputChange1">
                          <div slot="item" slot-scope="props" class="single-item">
                            <v-list-tile-content>
                              <v-list-tile-title v-html="props.item.applicantName"></v-list-tile-title>
                              <v-list-tile-sub-title v-html="props.item.applicantIdNo"></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </div>
                        </suggestions>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Họ và tên <span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateName"
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Địa chỉ: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm10>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateAddress"
                        multi-line
                        rows="2"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Tỉnh/Thành phố <span style="color:red">&nbsp;*&nbsp;</span> : </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-select
                        v-else
                        :items="citys"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeDelegateCity"
                        v-model="thongTinNguoiNopHoSo.delegateCityCode"
                        autocomplete
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Quận/Huyện <span style="color:red">&nbsp;*&nbsp;</span> : </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-select
                        v-else
                        :items="delegateDistricts"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeDelegateDistrict"
                        v-model="thongTinNguoiNopHoSo.delegateDistrictCode"
                        autocomplete
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Xã/Phường <span style="color:red">&nbsp;*&nbsp;</span> : </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-select
                        v-else
                        :items="delegateWards"
                        item-text="itemName"
                        item-value="itemCode"
                        v-model="thongTinNguoiNopHoSo.delegateWardCode"
                        autocomplete
                        :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                        required
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Số điện thoại: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateTelNo"
                        :rules="[rules.telNo]"
                        append-icon="phone"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-subheader v-else class="pl-0">Email: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <content-placeholders class="mt-1" v-if="loading">
                          <content-placeholders-text :lines="1" />
                        </content-placeholders>
                        <v-text-field
                        v-else
                        v-model="thongTinNguoiNopHoSo.delegateEmail"
                        :rules="thongTinNguoiNopHoSo.delegateEmail ? [rules.email] : ''"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <div class="absolute__btn" style="width: 150px;margin-top: 4px;">
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-checkbox
              v-else
              label="Giống chủ hồ sơ"
              v-model="thongTinNguoiNopHoSo.sameUser"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </div>
    </v-form>
    <v-dialog v-model="dialog_applicantInfos" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline">
          Thông tin doanh nghiệp
        </v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialog_applicantInfos = false">
          <v-icon>clear</v-icon>
        </v-btn>
        <v-card-text class="py-1">
          <v-layout wrap class="py-1 align-center">
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Tên tổ chức, doanh nghiệp: </span> <span>{{applicantInfos.applicantName}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Mã số thuế: </span> <span>{{applicantInfos.applicantIdNo}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Loại hình doanh nghiệp: </span> <span>{{applicantInfos.companyType}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Địa chỉ:</span> <span>{{applicantInfos.address}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Người đại diện: </span> <span>{{applicantInfos.representatives}}</span></div>
            </v-flex>
            <v-flex xs12 class="px-2">
              <div class="my-2"><span class="text-bold">Tình trạng: </span> <span>{{applicantInfos.companyStatus}}</span></div>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-3" color="primary" @click.native="dialog_applicantInfos = false">
            <v-icon>clear</v-icon> &nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Suggestions from 'v-suggestions'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  components: {
    'suggestions': Suggestions
  },
  data: () => ({
    valid_thongtinchuhoso: false,
    loadingVerify: false,
    citys: [],
    delegateDistricts: [],
    districts: [],
    delegateWards: [],
    wards: [],
    applicantItems: [],
    applicantItems2: [],
    applicantIdNo: '',
    labelSwitch: {
      'true': {
        cmtnd: 'CMND/ Hộ chiếu',
        nguoi_nop: 'Họ và tên'
      },
      'false': {
        cmtnd: 'Mã số thuế',
        nguoi_nop: 'Tên tổ chức, doanh nghiệp'
      }
    },
    thongTinChuHoSo: {
      userType: true,
      cityCode: '',
      districtCode: '',
      wardCode: '',
      applicantIdNo: '',
      applicantIdType: '',
      contactEmail: '',
      contactTelNo: '',
      contactName: '',
      address: '',
      applicantName: ''
    },
    thongTinNguoiNopHoSo: {
      sameUser: false,
      delegateName: '',
      delegateCityCode: '',
      delegateAddress: '',
      delegateDistrictCode: '',
      delegateWardCode: '',
      delegateEmail: '',
      delegateTelNo: '',
      delegateIdNo: ''
    },
    applicantInfos: {
      applicantName: '',
      applicantIdNo: '',
      companyType: '',
      companyStatus: '',
      address: '',
      representatives: ''
    },
    bussinessExits: false,
    validBussinessInfos: true,
    messageCheckApplicant: '',
    search: null,
    search2: null,
    searchQuery: '',
    selectedSearchItem: null,
    searchOptions: {},
    functionTimeOut: null,
    dialog_applicantInfos: false,
    rules: {
      required: (value) => !!value || 'Trường dữ liệu bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      },
      passWord: (value) => {
        const pattern = /^(?![0-9]{6,})[0-9a-zA-Z]{6,}$/
        return pattern.test(value) || 'Gồm các ký tự 0-9, a-z và ít nhất 6 ký tự'
      },
      telNo: (value) => {
        const pattern = /^([0-9]{0,})$/
        return pattern.test(value) || 'Gồm các ký tự 0-9'
      }
    }
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    originality () {
      var vm = this
      console.log('originality', vm.getOriginality())
      return vm.getOriginality()
    },
    viaPostal () {
      return this.$store.getters.viaPostal
    },
    dichVuChuyenPhatKetQua () {
      return this.$store.getters.dichVuChuyenPhatKetQua
    },
    ThongTinChuHoSoBindChuyenPhat () {
      let data = {
        cityCode: this.thongTinChuHoSo.cityCode,
        address: this.thongTinChuHoSo.address,
        districtCode: this.thongTinChuHoSo.districtCode,
        wardCode: this.thongTinChuHoSo.wardCode,
        contactTelNo: this.thongTinChuHoSo.contactTelNo
      }
      return data
    }
  },
  created () {
  },
  watch: {
    thongTinChuHoSo: {
      handler: function (value) {
        let vm = this
        let tempData = {
          delegateName: value.applicantName,
          delegateCityCode: value.cityCode,
          delegateAddress: value.address,
          delegateDistrictCode: value.districtCode,
          delegateWardCode: value.wardCode,
          delegateEmail: value.contactEmail,
          delegateTelNo: value.contactTelNo,
          delegateIdNo: value.applicantIdNo
        }
        // if (!vm.thongTinChuHoSo.userType) {
        //   vm.thongTinNguoiNopHoSo.sameUser = false
        // } else {
        //   vm.thongTinNguoiNopHoSo.sameUser = true
        // }
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          if (value.cityCode && value.cityCode !== vm.thongTinNguoiNopHoSo['delegateCityCode']) {
            vm.onChangeDelegateCity(value.cityCode)
          }
          if (value.districtCode && value.districtCode !== vm.thongTinNguoiNopHoSo['delegateDistrictCode']) {
            vm.onChangeDelegateDistrict(value.districtCode)
          }
          vm.thongTinNguoiNopHoSo = Object.assign(vm.thongTinNguoiNopHoSo, tempData)
        }
      },
      deep: true
    },
    thongTinNguoiNopHoSo: {
      handler: function (value) {
        var vm = this
        let dataChuHoSo = vm.thongTinChuHoSo
        if (value.sameUser) {
          let dataNguoiNopHoSo = {
            delegateName: dataChuHoSo.applicantName,
            delegateCityCode: dataChuHoSo.cityCode,
            delegateAddress: dataChuHoSo.address,
            delegateDistrictCode: dataChuHoSo.districtCode,
            delegateWardCode: dataChuHoSo.wardCode,
            delegateEmail: dataChuHoSo.contactEmail,
            delegateTelNo: dataChuHoSo.contactTelNo,
            delegateIdNo: dataChuHoSo.applicantIdNo
          }
          if (dataChuHoSo.cityCode && dataChuHoSo.cityCode !== vm.thongTinNguoiNopHoSo['delegateCityCode']) {
            vm.onChangeDelegateCity(dataChuHoSo.cityCode)
          }
          if (dataChuHoSo.districtCode && dataChuHoSo.districtCode !== vm.thongTinNguoiNopHoSo['delegateDistrictCode']) {
            vm.onChangeDelegateDistrict(dataChuHoSo.districtCode)
          }
          vm.thongTinNguoiNopHoSo = Object.assign(vm.thongTinNguoiNopHoSo, dataNguoiNopHoSo)
        } else {
          this.$store.dispatch('resetThongTinNguoiNopHoSo')
        }
      },
      deep: true
    },
    ThongTinChuHoSoBindChuyenPhat (val) {
      this.$store.commit('setThongTinChuHoSoBindChuyenPhat', val)
    },
    search (val) {
      val && this.querySelections(val)
    },
    search2 (val) {
      val && this.querySelections2(val)
    }
  },
  methods: {
    initData (data) {
      var vm = this
      vm.$store.commit('setApplicantId', data.applicantIdNo)
      let tempData = {
        delegateName: data.delegateName,
        delegateCityCode: data.delegateCityCode,
        delegateAddress: data.delegateAddress,
        delegateDistrictCode: data.delegateDistrictCode,
        delegateWardCode: data.delegateWardCode,
        delegateEmail: data.delegateEmail,
        delegateTelNo: data.delegateTelNo,
        delegateIdNo: data.delegateIdNo
      }
      let thongTinNguoiNopHoSoTemp = Object.assign(vm.thongTinNguoiNopHoSo, tempData)
      vm.thongTinNguoiNopHoSo = thongTinNguoiNopHoSoTemp
      let userTypeCondition = true
      if (data.applicantIdType === 'business') {
        userTypeCondition = false
      }
      let tempDataChuHs = {
        userType: userTypeCondition,
        cityCode: data.cityCode,
        districtCode: data.districtCode,
        wardCode: data.wardCode,
        applicantIdNo: data.applicantIdNo,
        applicantIdType: data.applicantIdType,
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        contactTelNo: data.contactTelNo,
        address: data.address,
        applicantName: data.applicantName,
        cityName: data.cityName,
        districtName: data.districtName,
        wardName: data.wardName
      }
      let thongTinChuHoSoTemp = Object.assign(vm.thongTinChuHoSo, tempDataChuHs)
      vm.thongTinChuHoSo = thongTinChuHoSoTemp
      vm.checkApplicantInfos()
      vm.$nextTick(function () {
        var filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0
        }
        vm.$store.getters.getDictItems(filter).then(function (result) {
          vm.citys = result.data
        })
        setTimeout(function () {
          if (data.cityCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.cityCode
            }).then(function (resultDistricts) {
              vm.districts = resultDistricts.data
            })
          }
          console.log('districtCode-----------', data.districtCode)
          if (data.districtCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.districtCode
            }).then(function (resultWards) {
              vm.wards = resultWards.data
            })
          }
          if (data.delegateCityCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.delegateCityCode
            }).then(function (resultDeDistricts) {
              vm.delegateDistricts = resultDeDistricts.data
            })
          }
          if (data.delegateDistrictCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.delegateDistrictCode
            }).then(function (resultDeWards) {
              vm.delegateWards = resultDeWards.data
            })
          }
        }, 200)
      })
    },
    onChangeCity (data) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.thongTinChuHoSo.districtCode = ''
      vm.thongTinChuHoSo.wardCode = ''
      vm.$store.commit('setCityVal', data)
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.districts = result.data
        vm.wards = []
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          vm.delegateDistricts = result.data
          vm.wards = []
        }
      })
    },
    onChangeDistrict (data) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.thongTinChuHoSo.wardCode = ''
      vm.$store.commit('setDistrictVal', data)
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.wards = result.data
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          vm.delegateWards = result.data
        }
      })
    },
    onChangeWard (data) {
      this.$store.commit('setWardVal', data)
    },
    querySelections (val) {
      var vm = this
      let params = {
        idNo: val
      }
      vm.$store.dispatch('getUserInfoFromApplicantIdNo', params).then(result => {
        vm.applicantItems = result
      }).catch(xhr => {
      })
    },
    querySelections2 (val) {
      var vm = this
      let params = {
        idNo: val
      }
      vm.$store.dispatch('getUserInfoFromApplicantIdNo', params).then(result => {
        vm.applicantItems2 = result
      }).catch(xhr => {
      })
    },
    onChangeDelegateCity (data) {
      var vm = this
      vm.thongTinNguoiNopHoSo.delegateDistrictCode = ''
      vm.thongTinNguoiNopHoSo.delegateWardCode = ''
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.delegateDistricts = result.data
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          vm.districts = result.data
        }
      })
    },
    showValid () {
      var vm = this
      let result = {
        validForm: vm.$refs.formChuHoSo.validate(),
        message: vm.messageCheckApplicant,
        validApplicant: vm.validBussinessInfos
      }
      return result
    },
    onChangeDelegateDistrict (data) {
      var vm = this
      vm.thongTinNguoiNopHoSo.delegateWardCode = ''
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.delegateWards = result.data
        if (vm.thongTinNguoiNopHoSo.sameUser) {
          vm.wards = result.data
        }
      })
    },
    onInputChange (query) {
      let vm = this
      if (vm.functionTimeOut) {
        clearTimeout(vm.functionTimeOut)
      }
      vm.functionTimeOut = setTimeout(function () {
        if ((vm.originality === 3 && !vm.thongTinChuHoSo.userType) || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
          vm.checkApplicantInfos()
        }
        vm.$store.commit('setApplicantId', query)
      }, 2000)
      if (query.trim().length === 0) {
        return null
      }
      const url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`
      // test local
      // const url = 'http://127.0.0.1:8081/api/applicants'
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
            }
          }
          axios.get(url, param).then(response => {
            let items = []
            if (response.data.hasOwnProperty('data')) {
              items = response.data.data
            } else {
            }
            resolve(items)
          })
        })
      })
    },
    onInputChange1 (query) {
      let vm = this
      if (query.trim().length === 0) {
        return null
      }
      const url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`
      // test local
      // const url = 'http://127.0.0.1:8081/api/applicants'
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
            }
          }
          axios.get(url, param).then(response => {
            let items = []
            if (response.data.hasOwnProperty('data')) {
              items = response.data.data
            } else {
            }
            resolve(items)
          })
        })
      })
    },
    onSearchItemSelected (item) {
      var vm = this
      vm.selectedSearchItem = item
      console.log('selectedSearchItem', vm.selectedSearchItem)
      // if (item['applicantIdType'] === 'business') {
      //   vm.thongTinChuHoSo.userType = false
      //   vm.thongTinNguoiNopHoSo.sameUser = false
      // } else {
      //   vm.thongTinChuHoSo.userType = true
      // }
      vm.thongTinChuHoSo['applicantIdNo'] = item.applicantIdNo.toString()
      //
      vm.thongTinChuHoSo['applicantName'] = item['applicantName'] ? item['applicantName'] : ''
      vm.thongTinChuHoSo['address'] = item['address'] ? item['address'] : ''
      vm.thongTinChuHoSo['contactTelNo'] = item['contactTelNo'] ? item['contactTelNo'] : ''
      vm.thongTinChuHoSo['contactEmail'] = item['contactEmail'] ? item['contactEmail'] : ''
      vm.thongTinChuHoSo.cityCode = item['cityCode'] ? item['cityCode'] : ''
      vm.$store.commit('setApplicantId', vm.thongTinChuHoSo['applicantIdNo'])
      vm.checkApplicantInfos()
      function changeCity (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeCity(data)
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      function changeDistrict (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeDistrict(data)
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      if (vm.thongTinChuHoSo['cityCode'] !== '' && vm.thongTinChuHoSo['cityCode'] !== null && vm.thongTinChuHoSo['cityCode'] !== undefined && vm.thongTinChuHoSo['cityCode'] !== 0 && vm.thongTinChuHoSo['cityCode'] !== '0') {
        changeCity(vm.thongTinChuHoSo['cityCode']).then(function () {
          vm.thongTinChuHoSo.districtCode = item['districtCode'] ? item['districtCode'] : ''
          if (vm.thongTinChuHoSo['districtCode'] !== '' && vm.thongTinChuHoSo['districtCode'] !== null && vm.thongTinChuHoSo['districtCode'] !== undefined && vm.thongTinChuHoSo['districtCode'] !== 0 && vm.thongTinChuHoSo['districtCode'] !== '0') {
            changeDistrict(vm.thongTinChuHoSo['districtCode']).then(function () {
              vm.thongTinChuHoSo.wardCode = item['wardCode'] ? item['wardCode'] : ''
            })
          }
        })
      }
    },
    onSearchItemSelected1 (item) {
      var vm = this
      vm.selectedSearchItem = item
      console.log('selectedSearchItem1', item)
      vm.thongTinNguoiNopHoSo['delegateIdNo'] = item.applicantIdNo.toString()
      //
      vm.thongTinNguoiNopHoSo['delegateName'] = item['applicantName'] ? item['applicantName'] : ''
      vm.thongTinNguoiNopHoSo['delegateAddress'] = item['address'] ? item['address'] : ''
      vm.thongTinNguoiNopHoSo['delegateTelNo'] = item['contactTelNo'] ? item['contactTelNo'] : ''
      vm.thongTinNguoiNopHoSo['delegateEmail'] = item['contactEmail'] ? item['contactEmail'] : ''
      vm.thongTinNguoiNopHoSo['delegateCityCode'] = item['cityCode'] ? item['cityCode'] : ''
      function changeCity (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeCity(data)
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      function changeDistrict (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeDistrict(data)
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      if (vm.thongTinNguoiNopHoSo['delegateCityCode'] !== null && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== undefined && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== 0 && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== '0') {
        changeCity(vm.thongTinNguoiNopHoSo['delegateCityCode']).then(function () {
          vm.thongTinNguoiNopHoSo['delegateDistrictCode'] = item['districtCode'] ? item['districtCode'] : ''
          if (vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== null && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== undefined && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== 0 && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== '0') {
            changeDistrict(vm.thongTinNguoiNopHoSo['delegateDistrictCode']).then(function () {
              vm.thongTinNguoiNopHoSo['delegateWardCode'] = item['wardCode'] ? item['wardCode'] : ''
            })
          }
        })
      }
    },
    getThongTinChuHoSo () {
      return this.thongTinChuHoSo
    },
    getThongTinNguoiNopHoSo () {
      return this.thongTinNguoiNopHoSo
    },
    changeApplicantInfos () {
      let vm = this
      if (vm.functionTimeOut) {
        clearTimeout(vm.functionTimeOut)
      }
      vm.functionTimeOut = setTimeout(function () {
        if ((vm.originality === 3 && !vm.thongTinChuHoSo.userType) || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
          vm.checkApplicantInfos()
        }
        vm.$store.commit('setApplicantId', vm.thongTinChuHoSo.applicantIdNo)
      }, 2000)
    },
    checkApplicantInfos () {
      let vm = this
      if ((vm.originality === 3 && !vm.thongTinChuHoSo.userType && vm.thongTinChuHoSo.applicantIdNo) || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
        let filter = {
          applicantIdNo: vm.thongTinChuHoSo.applicantIdNo,
          applicantName: vm.thongTinChuHoSo.applicantName
        }
        // vm.loadingVerify = true
        vm.$store.dispatch('checkApplicantInfos', filter).then(result => {
          // vm.loadingVerify = false
          if (result && result.hasOwnProperty('error') && result.error === true) {
            vm.bussinessExits = false
            vm.validBussinessInfos = false
            // vm.$store.commit('setApplicantBussinessExit', false)
            vm.messageCheckApplicant = result.message
            // toastr.error(result.message + ' Vui lòng kiểm tra lại mã số thuế')
          } else if (result && result.hasOwnProperty('warning') && result.warning === true) {
            vm.bussinessExits = true
            vm.validBussinessInfos = false
            // vm.$store.commit('setApplicantBussinessExit', false)
            vm.messageCheckApplicant = result.message
            // toastr.error(result.message + ' Vui lòng đối chiếu thông tin doanh nghiệp')
          } else if (result && !result.hasOwnProperty('error') && !result.hasOwnProperty('warning')) {
            vm.bussinessExits = true
            vm.validBussinessInfos = true
            // vm.$store.commit('setApplicantBussinessExit', filter['applicantIdNo'])
          }
        }).catch(function () {
          vm.loadingVerify = false
        })
      }
    },
    getApplicantInfos () {
      let vm = this
      let filter = {
        applicantIdNo: vm.thongTinChuHoSo.applicantIdNo
      }
      vm.$store.dispatch('getApplicantInfos', filter).then(result => {
        vm.applicantInfos['applicantName'] = result['MainInformation']['NAME']
        vm.applicantInfos['applicantIdNo'] = result['MainInformation']['ENTERPRISE_GDT_CODE']
        vm.applicantInfos['address'] = result['HOAdress']['AddressFullText']
        vm.applicantInfos['representatives'] = result['Representatives']['FULL_NAME']
        vm.applicantInfos['companyType'] = result['MainInformation']['ENTERPRISE_TYPE_NAME']
        vm.applicantInfos['companyStatus'] = result['MainInformation']['ENTERPRISE_STATUS_NAME']
        vm.dialog_applicantInfos = true
      })
    }
  }
}
</script>
