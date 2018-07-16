<template>
  <v-form v-model="valid_thongtinchuhoso" ref="formChuHoSo" lazy-validation>
    <div>
      <div style="position: relative;">
        <v-expansion-panel class="expansion-pl">
          <v-expansion-panel-content hide-actions value="1">
            <div slot="header"> <div class="background-triangle-small"> II. </div> THÔNG TIN CHỦ HỒ SƠ</div>
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
                    v-else
                    @change="onChangeApplicantIdNo"
                    v-model="thongTinChuHoSo.applicantIdNo"
                    ></v-text-field>
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
        <div class="absolute__btn" style="width: 270px;margin-top: 4px;">
          <content-placeholders class="mt-1" v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-radio-group v-else v-model="thongTinChuHoSo.userType" row>
            <v-radio label="Công Dân" :value="true"></v-radio>
            <v-radio label="Doanh Nghiệp" :value="false"></v-radio>
          </v-radio-group>
        </div>
        <div style="position: relative;">
          <v-expansion-panel class="expansion-pl">
            <v-expansion-panel-content hide-actions value="1">
              <div slot="header"> <div class="background-triangle-small"> III. </div> THÔNG TIN NGƯỜI NỘP HỒ SƠ</div>
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
                      v-else
                      v-model="thongTinNguoiNopHoSo.delegateIdNo"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <content-placeholders class="mt-1" v-if="loading">
                        <content-placeholders-text :lines="1" />
                      </content-placeholders>
                      <v-subheader v-else class="pl-0">Tên tổ chức cá nhân: </v-subheader>
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

export default {
  data: () => ({
    valid_thongtinchuhoso: false,
    citys: [],
    delegateDistricts: [],
    districts: [],
    delegateWards: [],
    wards: [],
    labelSwitch: {
      'true': {
        cmtnd: 'CMND/ Hộ chiếu',
        nguoi_nop: 'Họ và tên'
      },
      'false': {
        cmtnd: 'Mã số thuế',
        nguoi_nop: 'Tên tổ chức/ cá nhân'
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
    }
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
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
          let dataNguoiNop = {
            delegateName: dataChuHoSo.applicantName,
            delegateCityCode: dataChuHoSo.cityCode,
            delegateAddress: dataChuHoSo.address,
            delegateDistrictCode: dataChuHoSo.districtCode,
            delegateWardCode: dataChuHoSo.wardCode,
            delegateEmail: dataChuHoSo.contactEmail,
            delegateTelNo: dataChuHoSo.contactTelNo,
            delegateIdNo: dataChuHoSo.applicantIdNo
          }
          vm.thongTinNguoiNopHoSo = Object.assign(vm.thongTinNguoiNopHoSo, dataNguoiNop)
        } else {
          this.$store.dispatch('resetThongTinNguoiNopHoSo')
        }
      },
      deep: true
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
      console.log('thongTinNguoiNopHoSoTemp-----------', thongTinNguoiNopHoSoTemp)
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
        address: data.address,
        applicantName: data.applicantName
      }
      let thongTinChuHoSoTemp = Object.assign(vm.thongTinChuHoSo, tempDataChuHs)
      vm.thongTinChuHoSo = thongTinChuHoSoTemp
      console.log('thongtinchuhoso', vm.thongTinChuHoSo)
      console.log('thongtinnguoinophoso', vm.thongTinNguoiNopHoSo)
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
            filter.parent = data.cityCode
            filter.level = 1
            vm.$store.getters.getDictItems(filter).then(function (result) {
              vm.districts = result.data
            })
          }
          if (data.districtCode) {
            filter.parent = data.districtCode
            filter.level = 1
            vm.$store.getters.getDictItems(filter).then(function (result) {
              vm.wards = result.data
            })
          }
          if (data.delegateCityCode) {
            filter.parent = data.delegateCityCode
            filter.level = 1
            vm.$store.getters.getDictItems(filter).then(function (result) {
              vm.delegateDistricts = result.data
            })
          }
          if (data.delegateDistrictCode) {
            filter.parent = data.delegateDistrictCode
            filter.level = 1
            vm.$store.getters.getDictItems(filter).then(function (result) {
              vm.delegateWards = result.data
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
    onChangeApplicantIdNo (data) {
      // this.$store.dispatch('getUserInfoFromApplicantIdNo', data)
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
    }
  }
}
</script>
