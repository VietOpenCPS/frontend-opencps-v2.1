<template>
  <div>
    <v-form v-model="valid_thongtinchuhoso" ref="formChuHoSo" lazy-validation>
      <div>
        <div style="position: relative;">
          <v-expansion-panel :value="[true]" expand  class="expansion-pl">
            <v-expansion-panel-content>
              <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div> Thông tin chủ hồ sơ</div>
              <v-card>
                <v-card-text class="pt-3">
                  <v-layout wrap>
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Họ và tên<span v-if="requiredOptions['applicantName']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="applicantName"
                        :disabled="loadingVerify"
                        :rules="requiredOptions['applicantName'] ? [rules.required] : ''"
                        :required="requiredOptions['applicantName']"
                      ></v-text-field>
                    </v-flex>
                    
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Giới tính <span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2" style="position:relative">
                      <v-radio-group class="mt-0" v-model="gender" row>
                        <v-radio label="Nam" :value="0" class="mr-4"></v-radio>
                        <v-radio label="Nữ" :value="1" class=""></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Ngày tháng năm sinh<span style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2" style="position:relative">
                      <v-layout wrap>
                        <v-flex xs12 sm4 class="pr-2">
                          <v-autocomplete :items="days" placeholder="Ngày" v-model="birthDateDay" :hide-selected="true" ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pr-2">
                          <v-layout wrap>
                            <v-flex class="pt-2" style="width: 17px;max-width: 17px;font-size: 18px;">
                              <span>/</span>
                            </v-flex>
                            <v-flex style="width: calc(100% - 20px)">
                              <v-autocomplete :items="months" placeholder="Tháng" v-model="birthDateMonth"></v-autocomplete>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 sm4 class="">
                          <v-layout wrap>
                            <v-flex class="pt-2" style="width: 17px;max-width: 17px;font-size: 18px;">
                              <span>/</span>
                            </v-flex>
                            <v-flex style="width: calc(100% - 20px)">
                              <v-autocomplete placeholder="Năm" :items="years" v-model="birthDateYear" :rules="[rules.required]" required></v-autocomplete>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">CMND/ hộ chiếu<span v-if="requiredOptions['applicantIdNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2" style="position:relative">
                      <!-- <suggestions
                        v-model="applicantIdNo"
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
                      </suggestions> -->
                      <v-text-field
                      v-model="applicantIdNo"
                      :rules="requiredOptions['applicantIdNo'] ? [rules.required] : ''"
                      :required="requiredOptions['applicantIdNo']"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Quê quán<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <v-layout wrap>
                        <v-flex xs12 sm4 class="pr-3">
                          <v-autocomplete :items="cityItems" placeholder="Tỉnh/thành phố" v-model="cityNativeCode" :rules="[rules.required]" required
                            item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeCity($event, 'districtNativeItems', 'wardNativeItems')">
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="px-3">
                          <v-autocomplete :items="districtNativeItems" placeholder="Quận/huyện" v-model="districtNativeCode" :rules="[rules.required]" required
                          item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeDistrict($event, 'wardNativeItems')">
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pl-3">
                          <v-autocomplete placeholder="Xã/phường" :items="wardNativeItems" v-model="wardNativeCode" :rules="[rules.required]" required
                           item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeWard($event, 'wardNative')">
                          </v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Tình trạng<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <div>
                        <v-radio-group class="mt-0" v-model="state" row>
                          <v-radio label="Còn sống" :value="0" class="mr-4"></v-radio>
                          <v-radio label="Đã chết" :value="1" class=""></v-radio>
                        </v-radio-group>
                      </div>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Nơi đăng ký HKTT<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <v-text-field  v-model="address" clearable :rules="[rules.required]" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2"></v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <v-layout wrap>
                        <v-flex xs12 sm4 class="pr-3">
                          <v-autocomplete :items="cityItems" placeholder="Tỉnh/thành phố" v-model="cityCode" :rules="[rules.required]" required
                           item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeCity($event, 'districtItems', 'wardItems')"></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="px-3">
                          <v-autocomplete :items="districtItems" placeholder="Quận/huyện" v-model="districtCode" :rules="[rules.required]" required
                           item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeDistrict($event, 'wardItems')"></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pl-3">
                          <v-autocomplete placeholder="Xã/phường" :items="wardItems" v-model="wardCode" :rules="[rules.required]" required
                          item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Số tháng được hưởng<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="yearPayment"
                        :rules="[rules.required]" required
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Mức trợ cấp<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="subsidy"
                        @keyup="formatCurrent($event)"
                        :rules="[rules.required]" required
                      ></v-text-field>
                    </v-flex>
                    
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Số điện thoại : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                      v-model="contactTelNo"
                      append-icon="phone"
                      :rules="[rules.telNo]"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Địa chỉ email <span v-if="requiredOptions['contactEmail']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                      v-model="contactEmail"
                      :rules="requiredOptions['contactEmail'] ? [rules.email, rules.required] : (contactEmail ? [rules.email] : '')"
                      :required="requiredOptions['contactEmail']"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Bí danh<span v-if="requiredOptions['anonymName']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="anonymName"
                        :rules="requiredOptions['anonymName'] ? [rules.required] : ''"
                        :required="requiredOptions['anonymName']"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2 pt-1">
                      <v-subheader class="pl-0"> Là đối tượng<span v-if="requiredOptions['incidence']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2 pt-1" style="position:relative">
                      <v-radio-group class="mt-0" v-model="incidence" row>
                        <v-radio label="Quân nhân" :value="0" class="mr-4"></v-radio>
                        <v-radio label="Cơ yếu" :value="1" class=""></v-radio>
                      </v-radio-group>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">

                      <v-subheader class="pl-0">Nhập ngũ, tuyển dụng <span v-if="requiredOptions['recruitment']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="recruitment"
                        :rules="requiredOptions['recruitment'] ? [rules.required] : ''"
                        :required="requiredOptions['recruitment']"
                      ></v-text-field>
                      <!-- <v-autocomplete :items="recruitmentItems" v-model="recruitment" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete> -->
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Phục viên, xuất ngũ, thôi việc <span v-if="requiredOptions['retire']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="retire"
                        :rules="requiredOptions['retire'] ? [rules.required] : ''"
                        :required="requiredOptions['retire']"
                      ></v-text-field>
                      <!-- <v-autocomplete :items="retireItems" v-model="retire" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete> -->
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Tái ngũ <span v-if="requiredOptions['reactivated']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="reactivated"
                        :rules="requiredOptions['reactivated'] ? [rules.required] : ''"
                        :required="requiredOptions['reactivated']"
                      ></v-text-field>
                      <!-- <v-autocomplete :items="reactivatedItems" v-model="reactivated" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete> -->
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Phục viên, xuất ngũ <span v-if="requiredOptions['published']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <!-- <v-autocomplete :items="publishedItems" v-model="published" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete> -->
                      <v-text-field
                        v-model="published"
                        :rules="requiredOptions['published'] ? [rules.required] : ''"
                        :required="requiredOptions['published']"
                      ></v-text-field>
                    </v-flex>

                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div style="position: relative;">
            <v-expansion-panel :value="[true]" expand  class="expansion-pl">
              <v-expansion-panel-content>
                <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div> Thông tin người nộp hồ sơ</div>
                <v-card>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">CMND/Hộ chiếu <span v-if="requiredOptions['delegateIdNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2 style="position:relative">
                        <!-- <suggestions
                          v-model="delegateIdNo"
                          :options="searchOptions"
                          :onItemSelected="onSearchItemSelected1"
                          :onInputChange="onInputChange1">
                          <div slot="item" slot-scope="props" class="single-item">
                            <v-list-tile-content>
                              <v-list-tile-title v-html="props.item.applicantName"></v-list-tile-title>
                              <v-list-tile-sub-title v-html="props.item.applicantIdNo"></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </div>
                        </suggestions> -->
                        <v-text-field
                        v-model="delegateIdNo"
                        :rules="requiredOptions['delegateIdNo'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateIdNo']"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Họ và tên <span v-if="requiredOptions['delegateName']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                        v-model="delegateName"
                        :rules="requiredOptions['delegateName'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateName']"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Địa chỉ <span v-if="requiredOptions['delegateAddress']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm10>
                        <v-textarea
                        v-model="delegateAddress"
                        rows="2"
                        :rules="requiredOptions['delegateAddress'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateAddress']"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Tỉnh/Thành phố <span v-if="requiredOptions['delegateCityCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-autocomplete
                        :items="cityItems"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeCity($event, 'delegateDistricts', 'delegateWards')"
                        v-model="delegateCityCode"
                        :rules="requiredOptions['delegateCityCode'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateCityCode']"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Quận/Huyện <span v-if="requiredOptions['delegateDistrictCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-autocomplete
                        :items="delegateDistricts"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeDistrict($event, 'delegateWards')"
                        v-model="delegateDistrictCode"
                        :rules="requiredOptions['delegateDistrictCode'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateDistrictCode']"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Xã/Phường <span v-if="requiredOptions['delegateWardCode']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-autocomplete
                        :items="delegateWards"
                        item-text="itemName"
                        item-value="itemCode"
                        v-model="delegateWardCode"
                        :rules="requiredOptions['delegateWardCode'] ? [rules.required] : ''"
                        :required="requiredOptions['delegateWardCode']"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Số điện thoại <span v-if="requiredOptions['delegateTelNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-text-field
                        v-model="delegateTelNo"
                        append-icon="phone"
                        :rules="requiredOptions['delegateTelNo'] ? [rules.telNo, rules.required] : [rules.telNo]"
                        :required="requiredOptions['delegateTelNo']"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2>
                        <v-subheader class="pl-0">Địa chỉ email <span v-if="requiredOptions['delegateEmail']" style="color:red">&nbsp;*</span>: </v-subheader>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                        v-model="delegateEmail"
                        :rules="requiredOptions['delegateEmail'] ? [rules.email, rules.required] : (delegateEmail ? [rules.email] : '')"
                        :required="requiredOptions['delegateEmail']"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <div class="absolute__btn" style="width: 200px;margin-top: 4px;">
              <v-checkbox class="mt-1"
              label="Là chủ hồ sơ"
              v-model="sameUser"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </div>
    </v-form>

  </div>
</template>

<script>
import axios from 'axios'
import Suggestions from 'v-suggestions'
import toastr from 'toastr'
import TinyPagination from '../../components/pagging/opencps_pagination'
import {VMoney} from 'v-money'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  components: {
    'suggestions': Suggestions,
    'tiny-pagination': TinyPagination
  },
  props: ['requiredConfig', 'showApplicant', 'showDelegate', 'formCode'],
  data: () => ({
    applicantName: '',
    birthDate: '',
    applicantIdNo: '',
    cityItems: [],
    districtNativeItems: [],
    wardNativeItems: [],
    wardNativeCode: '',
    wardNativeName: '',
    districtNativeCode: '',
    districtNativeName: '',
    cityNativeCode: '',
    cityNativeName: '',
    gender: 0,
    state: 0,
    address: '',
    districtItems: [],
    wardItems: [],
    wardCode: '',
    districtCode: '',
    cityCode: '',
    yearPayment: '',
    subsidy: 0,
    contactTelNo: '',
    contactEmail: '',
    anonymName: '',
    incidence: 0,
    recruitmentItems: '',
    recruitment: '',
    retireItems: '',
    retire: '',
    reactivatedItems: '',
    reactivated: '',
    publishedItems: '',
    published: '',
    delegateName: '',
    delegateIdNo: '',
    delegateAddress: '',
    delegateWardCode: '',
    delegateDistrictCode: '',
    delegateCityCode: '',
    delegateTelNo: '',
    delegateEmail: '',

    requiredOptions: {
      applicantIdNo: false,
      applicantName: true,
      address: true,
      cityCode: true,
      districtCode: true,
      wardCode: true,
      contactTelNo: true,
      contactEmail: false,
      delegateIdNo: true,
      delegateName: true,
      delegateAddress: true,
      delegateCityCode: false,
      delegateDistrictCode: false,
      delegateWardCode: false,
      delegateTelNo: true,
      delegateEmail: false
    },
    valid_thongtinchuhoso: false,
    loadingVerify: false,
    citys: [],
    delegateDistricts: [],
    districts: [],
    delegateWards: [],
    wards: [],
    applicantIdNo: '',
    
    numberPerPage: 10,
    applicantPage: 1,
    totalApplicantSearch: 0,
    bussinessExits: false,
    validBussinessInfos: true,
    messageCheckApplicant: '',
    search: null,
    search2: null,
    searchQuery: '',
    selectedSearchItem: null,
    searchOptions: {},
    functionTimeOut: null,
    rules: {
      required: (value) => !!value || 'Thông tin bắt buộc',
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
    },
    valid: false,
    loadingTable: false,
    hasOrganization: false,
    sameUser: false,
    years: [],
    months: [1,2,3,4,5,6,7,8,9,10,11,12],
    days: [],
    money: {
      decimal: '',
      thousands: '.',
      prefix: '',
      suffix: '',
      precision: 0,
      masked: false
    },
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    forGroupDossier () {
      return this.$store.getters.getForGroupDossier
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
    }
  },
  directives: {money: VMoney},
  created () {
    let vm = this
    if (vm.requiredConfig && vm.requiredConfig['applicant']) {
      vm.requiredOptions = Object.assign(vm.requiredOptions, vm.requiredConfig['applicant'])
    }
  },
  watch: {
    ThongTinChuHoSoBindChuyenPhat (val) {
      this.$store.commit('setThongTinChuHoSoBindChuyenPhat', val)
    },
    search (val) {
      val && this.querySelections(val)
    },
    search2 (val) {
      val && this.querySelections2(val)
    },
    sameUser (val) {
      let vm = this
      vm.delegateIdNo = vm.applicantIdNo
      vm.delegateName = vm.applicantName
      vm.delegateAddress = vm.address
      vm.delegateTelNo = vm.contactTelNo
      vm.delegateEmail = vm.contactEmail
      vm.delegateCityCode = vm.cityCode
      vm.delegateDistrictCode = vm.districtCode
      vm.delegateWardCode = vm.wardCode

      vm.onChangeDelegateCity(vm.delegateCityCode)
      vm.onChangeDelegateDistrict(vm.delegateDistrictCode)
    }
  },
  methods: {
    initData (data) {
      let vm = this
      vm.$nextTick(function () {
        vm.days = []
        vm.years = []
        let currentYear = (new Date()).getFullYear()
        for (let i = 1; i <= 31; i++) {
          vm.days.push(i)
        }
        for (let i = currentYear; i >= 1900; i--) {
          vm.years.push(i)
        }
        // mapping data
        vm.mappingData(data)
        // 
        let filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0
        }
        vm.$store.getters.getDictItems(filter).then(function (result) {
          vm.cityItems = result.data
        })
        setTimeout(function () {
          // 
          if (vm.cityNativeCode) {
            vm.cityNativeName = vm.cityItems.filter(function (item) {
              return item.itemCode == vm.cityNativeCode
            })[0]['itemName']
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.cityNativeCode
            }).then(function (resultDistricts) {
              vm.districtNativeItems = resultDistricts.data
              if (vm.districtNativeCode) {
                vm.districtNativeName = vm.districtNativeItems.filter(function (item) {
                  return item.itemCode == vm.districtNativeCode
                })[0]['itemName']
              }
            })
          }
          if (vm.districtNativeCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: vm.districtNativeCode
            }).then(function (resultWards) {
              vm.wardNativeItems = resultWards.data
              if (vm.wardNativeCode) {
                vm.wardNativeName = vm.wardNativeItems.filter(function (item) {
                  return item.itemCode == vm.wardNativeCode
                })[0]['itemName']
              }
            })
          }
          // 
          if (data.cityCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.cityCode
            }).then(function (resultDistricts) {
              vm.districtItems = resultDistricts.data
            })
          }
          if (data.districtCode) {
            vm.$store.getters.getDictItems({
              collectionCode: 'ADMINISTRATIVE_REGION',
              level: 1,
              parent: data.districtCode
            }).then(function (resultWards) {
              vm.wardItems = resultWards.data
            })
          }
          // 
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
      vm.$refs.formChuHoSo.resetValidation()
    },
    getThongTinChuHoSo () {
      let vm = this
      let formMeta = {
        gender: vm.gender,
        genderText: vm.gender === 1 ? 'Nữ' : 'Nam',
        birthDate: vm.birthDateDay + '/' + vm.birthDateMonth + '/' + vm.birthDateYear,
        birthDateDay: vm.birthDateDay,
        birthDateMonth: vm.birthDateMonth,
        birthDateYear: vm.birthDateYear,
        wardNativeCode: vm.wardNativeCode,
        wardNativeName: vm.wardNativeName,
        districtNativeCode: vm.districtNativeCode,
        districtNativeName: vm.districtNativeName,
        cityNativeCode: vm.cityNativeCode,
        cityNativeName: vm.cityNativeName,
        state: vm.state,
        stateText: vm.state === 1 ? 'Đã chết' : 'Còn sống',
        yearPayment: vm.yearPayment,
        subsidy: Number(String(vm.subsidy).replace(/\./g, '')),
        anonymName: vm.anonymName,
        incidence: vm.incidence,
        incidenceText: vm.incidence === 1 ? 'Cơ yếu' : 'Quân nhân',
        recruitment: vm.recruitment,
        retire: vm.retire,
        reactivated: vm.reactivated,
        published: vm.published
      }
      let dataOut = {
        applicantName: vm.applicantName,
        gender: vm.gender,
        genderText: vm.gender === 1 ? 'Nữ' : 'Nam',
        birthDate: vm.birthDateDay + '/' + vm.birthDateMonth + '/' + vm.birthDateYear,
        applicantIdNo: vm.applicantIdNo,
        wardNativeCode: vm.wardNativeCode,
        wardNativeName: vm.wardNativeName,
        districtNativeCode: vm.districtNativeCode,
        districtNativeName: vm.districtNativeName,
        cityNativeCode: vm.cityNativeCode,
        cityNativeName: vm.cityNativeName,
        state: vm.state,
        address: vm.address,
        wardCode: vm.wardCode,
        districtCode: vm.districtCode,
        cityCode: vm.cityCode,
        yearPayment: vm.yearPayment,
        subsidy: Number(String(vm.subsidy).replace(/\./g, '')),
        contactTelNo: vm.contactTelNo,
        contactEmail: vm.contactEmail,
        anonymName: vm.anonymName,
        incidence: vm.incidence,
        recruitment: vm.recruitment,
        retire: vm.retire,
        reactivated: vm.reactivated,
        published: vm.published,
        delegateName: vm.delegateName,
        delegateIdNo: vm.delegateIdNo,
        delegateAddress: vm.delegateAddress,
        delegateWardCode: vm.delegateWardCode,
        delegateDistrictCode: vm.delegateDistrictCode,
        delegateCityCode: vm.delegateCityCode,
        delegateTelNo: vm.delegateTelNo,
        delegateEmail: vm.delegateEmail,
        formMeta: JSON.stringify(formMeta),
        validation: vm.$refs.formChuHoSo.validate()
      }
      return dataOut
    },
    mappingData (data) {
      let vm = this
      let metaData = ''
      try {
        metaData = JSON.parse(data.metaData)
      } catch (error) {
      }
      vm.applicantName = data.applicantName
      vm.applicantIdNo = data.applicantIdNo
      vm.address = data.address
      vm.wardCode = data.wardCode
      vm.districtCode = data.districtCode
      vm.cityCode = data.cityCode
      vm.contactTelNo = data.contactTelNo
      vm.contactEmail = data.contactEmail
      vm.delegateName = data.delegateName
      vm.delegateIdNo = data.delegateIdNo
      vm.delegateAddress = data.delegateAddress
      vm.delegateWardCode = data.delegateWardCode
      vm.delegateDistrictCode = data.delegateDistrictCode
      vm.delegateCityCode = data.delegateCityCode
      vm.delegateTelNo = data.delegateTelNo
      vm.delegateEmail = data.delegateEmail
      // metaData
      if (metaData) {
        vm.gender = metaData.hasOwnProperty('gender') ? metaData.gender : ''
        vm.birthDateDay = metaData.hasOwnProperty('birthDateDay') ? metaData.birthDateDay : ''
        vm.birthDateMonth = metaData.hasOwnProperty('birthDateMonth') ? metaData.birthDateMonth : ''
        vm.birthDateYear = metaData.hasOwnProperty('birthDateYear') ? metaData.birthDateYear : ''
        vm.wardNativeCode = metaData.hasOwnProperty('wardNativeCode') ? metaData.wardNativeCode : ''
        vm.districtNativeCode = metaData.hasOwnProperty('districtNativeCode') ? metaData.districtNativeCode : ''
        vm.cityNativeCode = metaData.hasOwnProperty('cityNativeCode') ? metaData.cityNativeCode : ''
        vm.state = metaData.hasOwnProperty('state') ? metaData.state : ''
        vm.yearPayment = metaData.hasOwnProperty('yearPayment') ? metaData.yearPayment : ''
        vm.subsidy = metaData.hasOwnProperty('subsidy') ? vm.currency(metaData.subsidy) : ''
        vm.anonymName = metaData.hasOwnProperty('anonymName') ? metaData.anonymName : ''
        vm.incidence = metaData.hasOwnProperty('incidence') ? metaData.incidence : ''
        vm.recruitment = metaData.hasOwnProperty('recruitment') ? metaData.recruitment : ''
        vm.retire = metaData.hasOwnProperty('retire') ? metaData.retire : ''
        vm.reactivated = metaData.hasOwnProperty('reactivated') ? metaData.reactivated : ''
        vm.published = metaData.hasOwnProperty('published') ? metaData.published : ''
      }
    },
    formatCurrent (event) {
      let vm = this
      vm.subsidy = vm.currency(String(vm.subsidy).replace(/\D/g,''))
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    },
    onChangeCity (data, districts, wards) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm[districts] = result.data
        vm[wards] = []
        if (districts === 'districtNativeItems') {
          vm.cityNativeName = vm.cityItems.filter(function (item) {
            return item.itemCode == data
          })[0]['itemName']
        }
      })
    },
    onChangeDistrict (data, wards) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm[wards] = result.data
        if (wards === 'wardNativeItems') {
          vm.districtNativeName = vm.districtNativeItems.filter(function (item) {
            return item.itemCode == data
          })[0]['itemName']
        }
      })
    },
    onChangeWard (data, ward) {
      var vm = this
      if (ward === 'wardNative') {
        vm.wardNativeName = vm.wardNativeItems.filter(function (item) {
          return item.itemCode == data
        })[0]['itemName']
      }
    },
    onChangeDelegateCity (data) {
      let vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.delegateDistricts = result.data
      })
    },
    onChangeDelegateDistrict (data) {
      let vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.delegateWards = result.data
      })
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

    showValid () {
      var vm = this
      let applicantIdRequired = true
      if (vm.requiredOptions['applicantIdNo'] && !vm.thongTinChuHoSo.applicantIdNo) {
        applicantIdRequired = false
      }
      if (vm.originality !== 1  && !vm.showDelegate && vm.requiredOptions['delegateIdNo'] && !vm.thongTinNguoiNopHoSo.delegateIdNo) {
        applicantIdRequired = false
      }
      let result = {
        validForm: vm.$refs.formChuHoSo.validate() && applicantIdRequired,
        message: vm.messageCheckApplicant,
        validApplicant: vm.validBussinessInfos
      }
      return result
    },
    onInputChange (query) {
      let vm = this
      if (vm.functionTimeOut) {
        clearTimeout(vm.functionTimeOut)
      }
      vm.functionTimeOut = setTimeout(function () {
        if ((vm.originality === 3 && vm.thongTinChuHoSo.userType === '2') || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
          vm.checkApplicantInfos()
        }
        vm.$store.commit('setApplicantId', query)
      }, 2000)
      if (query.trim().length === 0) {
        return null
      }
      let url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`

      // if (vm.functionTimeOutApplicant) {
      //   clearTimeout(vm.functionTimeOutApplicant)
      // }
      // vm.functionTimeOutApplicant = setTimeout(function () {
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
      // }, 1000)
    },
    onInputChange1 (query) {
      let vm = this
      if (query.trim().length === 0) {
        return null
      }
      let url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`

      // if (vm.functionTimeOutApplicant) {
      //   clearTimeout(vm.functionTimeOutApplicant)
      // }
      // vm.functionTimeOutApplicant = setTimeout(function () {
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
      // }, 1000)
    },
    onSearchItemSelected (item) {
      var vm = this
      vm.selectedSearchItem = item
      // console.log('selectedSearchItem', vm.selectedSearchItem)
      if (item['applicantIdType'] === 'business') {
        vm.thongTinChuHoSo.userType = '2'
        // vm.thongTinNguoiNopHoSo.sameUser = false
      } else if (item['applicantIdType'] === 'citizen') {
        vm.thongTinChuHoSo.userType = '1'
      } else {
        vm.thongTinChuHoSo.userType = '3'
      }
      vm.thongTinChuHoSo['applicantIdNo'] = item.applicantIdNo.toString()
      //
      vm.thongTinChuHoSo['applicantName'] = item['applicantName'] ? item['applicantName'] : ''
      vm.thongTinChuHoSo['address'] = item['address'] ? item['address'] : ''
      vm.thongTinChuHoSo['contactTelNo'] = item['contactTelNo'] ? item['contactTelNo'] : ''
      vm.thongTinChuHoSo['contactEmail'] = item['contactEmail'] ? item['contactEmail'] : ''
      vm.thongTinChuHoSo.cityCode = item['cityCode'] ? item['cityCode'] : ''
      setTimeout(function () {
        vm.$store.commit('setApplicantId', vm.thongTinChuHoSo['applicantIdNo'])
        vm.checkApplicantInfos()
      }, 2100)
      
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
              vm.onChangeCity(data, 'true')
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      function changeDistrict (data) {
        return new Promise((resolve, reject) => {
          setTimeout(
            () => {
              vm.onChangeDistrict(data, 'true')
              resolve()
            }, Math.floor(Math.random() * 100) + 1
          )
        })
      }
      console.log('thongTinNguoiNopHoSo', vm.thongTinNguoiNopHoSo)
      if (vm.thongTinNguoiNopHoSo['delegateCityCode'] && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== '0') {
        changeCity(vm.thongTinNguoiNopHoSo['delegateCityCode']).then(function () {
          vm.thongTinNguoiNopHoSo['delegateDistrictCode'] = item['districtCode'] ? item['districtCode'] : ''
          if (vm.thongTinNguoiNopHoSo['delegateDistrictCode'] && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== '0') {
            changeDistrict(vm.thongTinNguoiNopHoSo['delegateDistrictCode']).then(function () {
              vm.thongTinNguoiNopHoSo['delegateWardCode'] = item['wardCode'] ? item['wardCode'] : ''
            })
          }
        })
      }
    },
    checkApplicantInfos () {
      let vm = this
      if ((vm.originality === 3 && vm.thongTinChuHoSo.userType === '2' && vm.thongTinChuHoSo.applicantIdNo) || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
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
    },
    clearKeySearch () {
      let vm = this
      vm.keySearch = ''
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    changeTypeSearch () {
      let vm = this
      setTimeout(function () {
        vm.applicantPage = 1
        vm.getApplicantList().then(function(result) {
          vm.totalApplicantSearch = result['total']
          vm.applicantLists = result['data']
        }).catch(function () {
        })
      }, 200)
    },
    changePage (config) {
      let vm = this
      vm.applicantPage = config.page
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
      }).catch(function () {
      })
    },
    bindInfoApplicant (item) {
      let vm = this
      if (vm.typeApplicantBind === 'ChuHoSo') {
        vm.onSearchItemSelected(item)
      } else if (vm.typeApplicantBind === 'NguoiNop') {
        vm.onSearchItemSelected1(item)
      }
      vm.dialog_applicantList = false
    },
    showEditApplicant (item) {
      let vm = this
      vm.applicantEdit = item
      if (vm.cityItems.length === 0) {
        let filterCity = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0,
          commit: ''
        }
        vm.$store.dispatch('loadDictItems', filterCity).then(function (result) {
          vm.cityItems = result.data
        })
      }
      if (vm.applicantEdit['cityCode']) {
        vm.$store.dispatch('loadDictItems', {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: vm.applicantEdit['cityCode']
        }).then(function (resultDistricts) {
          vm.districtItems = resultDistricts.data
        })
      }
      if (vm.applicantEdit['districtCode']) {
        vm.$store.dispatch('loadDictItems', {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 1,
          parent: vm.applicantEdit['districtCode']
        }).then(function (resultWards) {
          vm.wardItems = resultWards.data
        })
      }
      if (vm.applicantEdit['applicantIdType'] === 'citizen') {
        vm.titleEdit = "Thông tin công dân"
      } else if (vm.applicantEdit['applicantIdType'] === 'business') {
        vm.titleEdit = "Thông tin tổ chức, doanh nghiệp"
      }
      vm.dialog_editApplicant = true
      vm.$refs.form.resetValidation()
    },
    changeBirthDate () {
      let vm = this
      vm.menuBirthDate = false
      vm.applicantEdit['applicantIdDate'] = vm.formatDate(vm.ngayCap)
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
    parseDate(date) {
      if (!date) return null
      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    onChangeCityEditApplicant (data) {
      let vm = this
      vm.applicantEdit['cityName'] = vm.cityItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
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
    onChangeDistrictEditApplicant (data) {
      let vm = this
      vm.applicantEdit['districtName'] = vm.districtItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      vm.$store.dispatch('loadDictItems', filter).then(function (result) {
        vm.wardItems = result.data
      })
    },
    updateApplicant () {
      let vm = this
      if (vm.$refs.form.validate()) {
        vm.loading = true
        // console.log('user put data', vm.applicantEdit)
        vm.$store.dispatch('putUser', vm.applicantEdit).then(function () {
          toastr.clear()
          toastr.success('Yêu cầu thực hiện thành công')
          vm.dialog_editApplicant = false
        }).catch(function () {
          toastr.clear()
          toastr.error('Yêu cầu thực hiện thất bại')
        })
      }
    },
    exitDialogEditApplicant () {
      let vm = this
      vm.dialog_editApplicant = false
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
      }).catch(function () {
        toastr.error('Không lấy được danh sách công dân, tổ chức, doanh nghiệp')
      })
    },
    fullAddress (address, city, district, ward) {
      let fullAddress = ''
      if (address) {
        fullAddress += (address + ', ')
      }
      if (ward) {
        fullAddress += (ward + ' - ')
      }
      if (district) {
        fullAddress += (district + ' - ')
      }
      if (city) {
        fullAddress += city
      }
      return fullAddress
    }
  }
}
</script>
