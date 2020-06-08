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
                        @input="changeApplicantInfos"
                        :disabled="loadingVerify"
                        :rules="requiredOptions['applicantName'] ? [rules.required] : ''"
                        :required="requiredOptions['applicantName']"
                      ></v-text-field>
                    </v-flex>
                    
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Giới tính <span v-if="requiredOptions['gender']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2" style="position:relative">
                      <v-radio-group class="mt-0" v-model="gender" row>
                        <v-radio label="Nam" :value="1" class="mr-4"></v-radio>
                        <v-radio label="Nữ" :value="2" class=""></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Ngày tháng năm sinh<span v-if="requiredOptions['birthDate']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2" style="position:relative">
                      
                    </v-flex>
                    
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">CMND/ hộ chiếu<span v-if="requiredOptions['applicantIdNo']" style="color:red">&nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2" style="position:relative">
                      <suggestions
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
                      </suggestions>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Quê quán<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <v-layout wrap>
                        <v-flex xs12 sm4>
                          <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="cityNativeCode" item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeCity($event, 'NoiDangKyKhaiSinhdistrictItems', 'NoiDangKyKhaiSinhwardItems')"></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pl-3">
                          <v-autocomplete :items="districtNativeItems" label="Quận/huyện" v-model="districtNativeCode" item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeDistrict($event, 'NoiDangKyKhaiSinhwardItems')"></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pl-3">
                          <v-autocomplete label="Xã/phường" :items="wardNativeItems" v-model="wardNativeCode" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Tình trạng<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <div>
                        <v-radio-group class="mt-0" v-model="state" row>
                          <v-radio label="Còn sống" :value="1" class="mr-4"></v-radio>
                          <v-radio label="Đã chết" :value="2" class=""></v-radio>
                        </v-radio-group>
                      </div>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Nơi đăng ký HKTT<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <v-text-field  v-model="address" clearable></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2 class="mb-2"></v-flex>
                    <v-flex xs12 sm10 class="mb-2">
                      <v-layout wrap>
                        <v-flex xs12 sm4>
                          <v-autocomplete :items="cityItems" label="Tỉnh/thành phố" v-model="cityCode" item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeCity($event, 'NoiDangKyKhaiSinhdistrictItems', 'NoiDangKyKhaiSinhwardItems')"></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pl-3">
                          <v-autocomplete :items="districtItems" label="Quận/huyện" v-model="districtCode" item-text="itemName" item-value="itemCode" :hide-selected="true" @change="onChangeDistrict($event, 'NoiDangKyKhaiSinhwardItems')"></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm4 class="pl-3">
                          <v-autocomplete label="Xã/phường" :items="wardItems" v-model="wardCode" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Số năm được hưởng<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="yearPayment"
                        :rules="requiredOptions['yearPayment'] ? [rules.required] : ''"
                        :required="requiredOptions['yearPayment']"
                      ></v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Mức trợ cấp<span style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                        v-model="subsidy"
                        :rules="requiredOptions['subsidy'] ? [rules.required] : ''"
                        :required="requiredOptions['subsidy']"
                      ></v-text-field>
                    </v-flex>
                    
                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Số điện thoại : </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-text-field
                      v-model="contactTelNo"
                      append-icon="phone"
                      :rules="requiredOptions['contactTelNo'] ? [rules.telNo, rules.required] : [rules.telNo]"
                      :required="requiredOptions['contactTelNo']"
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

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0"> Là đối tượng<span v-if="requiredOptions['incidence']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">

                      <v-subheader class="pl-0">Nhập ngũ, tuyển dụng <span v-if="requiredOptions['recruitment']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-autocomplete :items="recruitmentItems" v-model="recruitment" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Phục viên, xuất ngũ, thôi việc <span v-if="requiredOptions['retire']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-autocomplete :items="retireItems" v-model="retire" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Tái ngũ <span v-if="requiredOptions['reactivated']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-autocomplete :items="reactivatedItems" v-model="reactivated" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
                    </v-flex>

                    <v-flex xs12 sm2 class="mb-2">
                      <v-subheader class="pl-0">Phục viên, xuất ngũ <span v-if="requiredOptions['published']" style="color:red"> &nbsp;*</span>: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4 class="mb-2">
                      <v-autocomplete :items="publishedItems" v-model="published" item-text="itemName" item-value="itemCode" :hide-selected="true"></v-autocomplete>
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
                        <suggestions
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
                        </suggestions>
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
                        :items="citys"
                        item-text="itemName"
                        item-value="itemCode"
                        @change="onChangeDelegateCity"
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
                        @change="onChangeDelegateDistrict"
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
    gender: '',
    birthDate: '',
    applicantIdNo: '',
    cityItems: '',
    districtNativeItems: '',
    wardNativeItems: '',
    wardNativeCode: '',
    districtNativeCode: '',
    cityNativeCode: '',
    gender: 1,
    state: 1,
    address: '',
    districtItems: '',
    wardItems: '',
    wardCode: '',
    districtCode: '',
    cityCode: '',
    yearPayment: '',
    subsidy: '',
    contactTelNo: '',
    contactEmail: '',
    anonymName: '',
    incidence: '',
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
      applicantIdNo: true,
      applicantName: true,
      address: true,
      cityCode: true,
      districtCode: true,
      wardCode: true,
      contactTelNo: true,
      contactEmail: false,
      delegateIdNo: false,
      delegateName: false,
      delegateAddress: false,
      delegateCityCode: false,
      delegateDistrictCode: false,
      delegateWardCode: false,
      delegateTelNo: false,
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
    sameUser: false
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
    }
  },
  methods: {
    initData (data) {
      let vm = this
      vm.$nextTick(function () {
        let filter = {
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
      vm.$refs.formChuHoSo.resetValidation()
    },
    onChangeCity (data, editDelegate) {
      let vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      if (!editDelegate) {
        vm.thongTinChuHoSo.districtCode = ''
        vm.thongTinChuHoSo.wardCode = ''
        vm.$store.commit('setCityVal', data)
      }
      vm.$store.getters.getDictItems(filter).then(function (result) {
        if (!editDelegate) {
          vm.districts = result.data
          vm.wards = []
        }

        if (editDelegate || vm.thongTinNguoiNopHoSo.sameUser || (!vm.thongTinNguoiNopHoSo.sameUser && vm.showApplicant && !vm.showDelegate)) {
          vm.delegateDistricts = result.data
          vm.delegateWards = []
        }
      })
    },
    onChangeDistrict (data, editDelegate) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      if (!editDelegate) {
        vm.thongTinChuHoSo.wardCode = ''
        vm.$store.commit('setDistrictVal', data)
      }
      
      vm.$store.getters.getDictItems(filter).then(function (result) {
        if (!editDelegate) {
          vm.wards = result.data
        }
        
        if (editDelegate || vm.thongTinNguoiNopHoSo.sameUser || (!vm.thongTinNguoiNopHoSo.sameUser && vm.showApplicant && !vm.showDelegate)) {
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
        if ((vm.originality === 3 && vm.thongTinChuHoSo.userType === '2') || (vm.originality === 1 && vm.thongTinChuHoSo.applicantIdType === 'business')) {
          vm.checkApplicantInfos()
        }
        vm.$store.commit('setApplicantId', vm.thongTinChuHoSo.applicantIdNo)
      }, 2000)
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
    getApplicantList () {
      let vm = this
      let url = '/o/rest/v2/applicants'
      vm.loadingTable = true
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
            },
            params: {
              start: vm.applicantPage * vm.numberPerPage - vm.numberPerPage,
              end: vm.applicantPage * vm.numberPerPage,
              type: vm.typeSearch,
              applicantName: vm.keySearch
            }
          }
          axios.get(url, param).then(response => {
            let items = []
            if (response.data.hasOwnProperty('data')) {
              items = response.data.data
            } else {
            }
            let dataOut = {
              data: items,
              total: response.data['total']
            }
            vm.loadingTable = false
            resolve(dataOut)
          }).catch(function () {
            vm.loadingTable = false
          })
        })
      })
    },
    showDialogApplicantList (type) {
      let vm = this
      vm.typeApplicantBind = type
      vm.applicantPage = 1
      vm.getApplicantList().then(function(result) {
        vm.totalApplicantSearch = result['total']
        vm.applicantLists = result['data']
        vm.dialog_applicantList = true
      }).catch(function () {
        toastr.error('Không lấy được danh sách công dân, tổ chức, doanh nghiệp')
      })
    },
    searchKeyword () {
      let vm = this
      setTimeout(function () {
        if (String(vm.keySearch).length >= 3) {
          vm.applicantPage = 1
          vm.getApplicantList().then(function(result) {
            vm.totalApplicantSearch = result['total']
            vm.applicantLists = result['data']
          }).catch(function () {
          })
        }
      }, 200)
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
    onChangeWardEditApplicant (data) {
      let vm = this
      vm.applicantEdit['wardName'] = vm.wardItems.filter(function (item) {
        return item['itemCode'] === data
      })[0]['itemName']
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
