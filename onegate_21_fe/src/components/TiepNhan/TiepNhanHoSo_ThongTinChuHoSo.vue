<template>
  <v-form v-model="valid_thongtinchuhoso" ref="formChuHoSo" lazy-validation>
    <div>
      <div style="position: relative;">
        <v-expansion-panel class="expansion-pl">
          <v-expansion-panel-content hide-actions value="1">
            <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon></div> Thông tin chủ hồ sơ</div>
            <v-card>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12 sm2>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-subheader v-else class="pl-0"> <!-- {{thongTinChuHoSo.userType}} --> {{ labelSwitch[thongTinChuHoSo.userType].cmtnd }}: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-text-field
                      v-if="originality === 1 || originality === '1'"
                      v-model="thongTinChuHoSo.applicantIdNo"
                    ></v-text-field>
                    <suggestions
                      v-if="originality === 3 || originality === '3'"
                      v-model="thongTinChuHoSo.applicantIdNo"
                      :options="searchOptions"
                      :onItemSelected="onSearchItemSelected"
                      :onInputChange="onInputChange">
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
                    <v-subheader v-else class="pl-0"> {{ labelSwitch[thongTinChuHoSo.userType].nguoi_nop }}: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-text-field
                    v-else
                    v-model="thongTinChuHoSo.applicantName"
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
                    v-model="thongTinChuHoSo.address"
                    multi-line
                    rows="2"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-subheader v-else class="pl-0">Tỉnh/Thành phố: </v-subheader>
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
                    <v-subheader v-else class="pl-0">Quận/Huyện: </v-subheader>
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
                    <v-subheader v-else class="pl-0">Xã/Phường: </v-subheader>
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
                    <v-subheader v-else class="pl-0">Số điện thoại: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-text-field
                    v-else
                    v-model="thongTinChuHoSo.contactTelNo"
                    append-icon="phone"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-subheader v-else class="pl-0">Địa chỉ E-mail: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <content-placeholders class="mt-1" v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <v-text-field
                    v-else
                    v-model="thongTinChuHoSo.contactEmail"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div class="absolute__btn" style="width: 270px;margin-top: 4px;" v-if="originality !== 1">
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-radio-group v-else v-model="thongTinChuHoSo.userType" row>
            <v-radio label="Công Dân" :value="true"></v-radio>
            <v-radio label="Doanh Nghiệp" :value="false"></v-radio>
          </v-radio-group>
        </div>
        <div style="position: relative;" v-if="originality !== 1">
          <v-expansion-panel class="expansion-pl">
            <v-expansion-panel-content hide-actions value="1">
              <div slot="header"> <div class="background-triangle-small"> <v-icon size="18" color="white">star_rate</v-icon> </div> Thông tin người nộp hồ sơ</div>
              <v-card>
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">CMND/Hộ chiếu: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-if="originality === 1 || originality === '1'"
                      v-model="thongTinNguoiNopHoSo.delegateIdNo"
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
                      <!-- <v-select
                      v-if="originality === 3 || originality === '3'"
                      :items="applicantItems"
                      hide-selected
                      tags
                      v-model="thongTinNguoiNopHoSo.delegateIdNo"
                      item-text="applicantIdNo"
                      item-value="applicantIdNo"
                      autocomplete
                      clearable
                      :search-input.sync="search"
                      @input="eventInput($event)"
                      cache-items
                      return-object
                      >
                        <template slot="item" slot-scope="data">
                          <template>
                            <v-list-tile-content>
                              <v-list-tile-title v-html="data.item.applicantName"></v-list-tile-title>
                              <v-list-tile-sub-title v-html="data.item.applicantIdNo"></v-list-tile-sub-title>
                            </v-list-tile-content>
                          </template>
                        </template>
                      </v-select> -->
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Họ và tên: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-text-field
                      v-else
                      v-model="thongTinNguoiNopHoSo.delegateName"
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
                      <v-subheader v-else class="pl-0">Tỉnh/Thành phố: </v-subheader>
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
                      <v-subheader v-else class="pl-0">Quận/Huyện: </v-subheader>
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
                      <v-subheader v-else class="pl-0">Xã/Phường: </v-subheader>
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
</template>

<script>
import axios from 'axios'
import Suggestions from 'v-suggestions'

export default {
  components: {
    'suggestions': Suggestions
  },
  data: () => ({
    valid_thongtinchuhoso: false,
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
        nguoi_nop: 'Tên tổ chức'
      }
    },
    thongTinChuHoSo: {
      userType: true,
      cityCode: '',
      districtCode: '',
      wardCode: '',
      applicantNote: '',
      applicantIdNo: '',
      contactEmail: '',
      contactTelNo: '',
      contactName: '',
      address: '',
      applicantName: ''
    },
    thongTinNguoiNopHoSo: {
      sameUser: true,
      delegateName: '',
      delegateCityCode: '',
      delegateAddress: '',
      delegateDistrictCode: '',
      delegateWardCode: '',
      delegateEmail: '',
      delegateTelNo: '',
      delegateIdNo: ''
    },
    search: null,
    search2: null,
    searchQuery: '',
    selectedSearchItem: null,
    searchOptions: {}
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
        wardCode: this.thongTinChuHoSo.wardCode
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
        if (vm.thongTinNguoiNopHoSo.sameUser) {
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
            applicantName: value.delegateName,
            cityCode: value.delegateCityCode,
            address: value.delegateAddress,
            districtCode: value.delegateDistrictCode,
            wardCode: value.delegateWardCode,
            contactEmail: value.delegateEmail,
            contactTelNo: value.delegateTelNo,
            applicantIdNo: value.delegateIdNo
          }
          vm.thongTinChuHoSo = Object.assign(vm.thongTinChuHoSo, dataNguoiNopHoSo)
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
        applicantNote: data.applicantNote,
        applicantIdNo: data.applicantIdNo,
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        contactTelNo: data.contactTelNo,
        address: data.address,
        applicantName: data.applicantName
      }
      let thongTinChuHoSoTemp = Object.assign(vm.thongTinChuHoSo, tempDataChuHs)
      vm.thongTinChuHoSo = thongTinChuHoSoTemp
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
    eventInput (event) {
      var vm = this
      vm.thongTinNguoiNopHoSo.delegateIdNo = []
      setTimeout(function () {
        if (event.length !== 0) {
          vm.thongTinNguoiNopHoSo.delegateIdNo = [event[event.length - 1]]
        }
        if (vm.thongTinNguoiNopHoSo['delegateIdNo'][0]) {
          console.log('vm.thongTinNguoiNopHoSo[delegateIdNo][0]==========', vm.thongTinNguoiNopHoSo['delegateIdNo'][0])
          vm.thongTinNguoiNopHoSo['delegateName'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['applicantName'] ? vm.thongTinNguoiNopHoSo['delegateName'][0]['applicantName'] : ''
          vm.thongTinNguoiNopHoSo['delegateAddress'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['address'] ? vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['address'] : ''
          vm.thongTinNguoiNopHoSo['delegateTelNo'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['contactTelNo'] ? vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['contactTelNo'] : ''
          vm.thongTinNguoiNopHoSo['delegateEmail'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['contactEmail'] ? vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['contactEmail'] : ''
          vm.thongTinNguoiNopHoSo['delegateCityCode'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['cityCode'] ? vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['cityCode'] : ''
          vm.thongTinNguoiNopHoSo['delegateDistrictCode'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['districtCode'] ? vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['districtCode'] : ''
          vm.thongTinNguoiNopHoSo['delegateWardCode'] = vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['wardCode'] ? vm.thongTinNguoiNopHoSo['delegateIdNo'][0]['wardCode'] : ''
          if (vm.thongTinNguoiNopHoSo['delegateCityCode'] !== null && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== undefined && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== 0 && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== '0') {
            vm.onChangeDelegateCity(vm.thongTinNguoiNopHoSo['delegateCityCode'])
          }
          if (vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== null && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== undefined && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== 0 && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== '0') {
            vm.onChangeDelegateDistrict(vm.thongTinNguoiNopHoSo['delegateDistrictCode'])
          }
        }
        return false
      }, 100)
    },
    eventInput2 (event) {
      var vm = this
      vm.thongTinChuHoSo['applicantIdNo'] = []
      setTimeout(function () {
        if (event.length !== 0) {
          vm.thongTinChuHoSo['applicantIdNo'] = [event[event.length - 1]]
        }
        if (vm.thongTinChuHoSo['applicantIdNo'][0]) {
          console.log('vm.thongTinChuHoSo[applicantIdNo][0]==========', vm.thongTinChuHoSo['applicantIdNo'][0])
          vm.thongTinChuHoSo['applicantName'] = vm.thongTinChuHoSo['applicantIdNo'][0]['applicantName'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['applicantName'] : ''
          vm.thongTinChuHoSo['address'] = vm.thongTinChuHoSo['applicantIdNo'][0]['address'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['address'] : ''
          vm.thongTinChuHoSo['contactTelNo'] = vm.thongTinChuHoSo['applicantIdNo'][0]['contactTelNo'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['contactTelNo'] : ''
          vm.thongTinChuHoSo['contactEmail'] = vm.thongTinChuHoSo['applicantIdNo'][0]['contactEmail'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['contactEmail'] : ''
          vm.thongTinChuHoSo.cityCode = vm.thongTinChuHoSo['applicantIdNo'][0]['cityCode'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['cityCode'] : ''
          vm.thongTinChuHoSo.districtCode = vm.thongTinChuHoSo['applicantIdNo'][0]['districtCode'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['districtCode'] : ''
          vm.thongTinChuHoSo.wardCode = vm.thongTinChuHoSo['applicantIdNo'][0]['wardCode'] ? vm.thongTinChuHoSo['applicantIdNo'][0]['wardCode'] : ''
          if (vm.thongTinChuHoSo['applicantIdNo'][0]['applicantIdType'] === 'business') {
            vm.thongTinChuHoSo.userType = false
          } else {
            vm.thongTinChuHoSo.userType = true
          }
          if (vm.thongTinChuHoSo['cityCode'] !== '' && vm.thongTinChuHoSo['cityCode'] !== null && vm.thongTinChuHoSo['cityCode'] !== undefined && vm.thongTinChuHoSo['cityCode'] !== 0 && vm.thongTinChuHoSo['cityCode'] !== '0') {
            vm.onChangeCity(vm.thongTinChuHoSo['cityCode'])
          }
          if (vm.thongTinChuHoSo['districtCode'] !== '' && vm.thongTinChuHoSo['districtCode'] !== null && vm.thongTinChuHoSo['districtCode'] !== undefined && vm.thongTinChuHoSo['districtCode'] !== 0 && vm.thongTinChuHoSo['districtCode'] !== '0') {
            vm.onChangeDistrict(vm.thongTinChuHoSo['districtCode'])
          }
        }
        return false
      }, 100)
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
      return vm.$refs.formChuHoSo.validate()
    },
    onChangeDelegateDistrict (data) {
      var vm = this
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
      if (query.trim().length === 0) {
        return null
      }
      const url = `/o/rest/v2/applicants?start=0&end=5&idNo=${query}`
      // test local
      // const url = `http://127.0.0.1:8081/api/applicant?start=0&end=5&idNo=${query}`
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
              groupId: result.groupId
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
      // const url = `http://127.0.0.1:8081/api/applicant?start=0&end=5&idNo=${query}`
      return new Promise(resolve => {
        vm.$store.dispatch('loadInitResource').then(result => {
          let param = {
            headers: {
              groupId: result.groupId
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
      vm.thongTinChuHoSo['applicantIdNo'] = item.applicantIdNo.toString()
      //
      vm.thongTinChuHoSo['applicantName'] = item['applicantName'] ? item['applicantName'] : ''
      vm.thongTinChuHoSo['address'] = item['address'] ? item['address'] : ''
      vm.thongTinChuHoSo['contactTelNo'] = item['contactTelNo'] ? item['contactTelNo'] : ''
      vm.thongTinChuHoSo['contactEmail'] = item['contactEmail'] ? item['contactEmail'] : ''
      vm.thongTinChuHoSo.cityCode = item['cityCode'] ? item['cityCode'] : ''
      vm.thongTinChuHoSo.districtCode = item['districtCode'] ? item['districtCode'] : ''
      vm.thongTinChuHoSo.wardCode = item['wardCode'] ? item['wardCode'] : ''
      if (item['applicantIdType'] === 'business') {
        vm.thongTinChuHoSo.userType = false
      } else {
        vm.thongTinChuHoSo.userType = true
      }
      if (vm.thongTinChuHoSo['cityCode'] !== '' && vm.thongTinChuHoSo['cityCode'] !== null && vm.thongTinChuHoSo['cityCode'] !== undefined && vm.thongTinChuHoSo['cityCode'] !== 0 && vm.thongTinChuHoSo['cityCode'] !== '0') {
        vm.onChangeCity(vm.thongTinChuHoSo['cityCode'])
      }
      if (vm.thongTinChuHoSo['districtCode'] !== '' && vm.thongTinChuHoSo['districtCode'] !== null && vm.thongTinChuHoSo['districtCode'] !== undefined && vm.thongTinChuHoSo['districtCode'] !== 0 && vm.thongTinChuHoSo['districtCode'] !== '0') {
        vm.onChangeDistrict(vm.thongTinChuHoSo['districtCode'])
      }
      console.log('vm.thongTinChuHoSo', vm.thongTinChuHoSo)
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
      vm.thongTinNguoiNopHoSo['delegateDistrictCode'] = item['districtCode'] ? item['districtCode'] : ''
      vm.thongTinNguoiNopHoSo['delegateWardCode'] = item['wardCode'] ? item['wardCode'] : ''
      if (vm.thongTinNguoiNopHoSo['delegateCityCode'] !== null && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== undefined && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== 0 && vm.thongTinNguoiNopHoSo['delegateCityCode'] !== '0') {
        vm.onChangeDelegateCity(vm.thongTinNguoiNopHoSo['delegateCityCode'])
      }
      if (vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== null && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== undefined && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== 0 && vm.thongTinNguoiNopHoSo['delegateDistrictCode'] !== '0') {
        vm.onChangeDelegateDistrict(vm.thongTinNguoiNopHoSo['delegateDistrictCode'])
      }
      console.log('vm.thongTinNguoiNopHoSo', vm.thongTinNguoiNopHoSo)
    },
    getThongTinChuHoSo () {
      return this.thongTinChuHoSo
    },
    getThongTinNguoiNopHoSo () {
      return this.thongTinNguoiNopHoSo
    }
  }
}
</script>
