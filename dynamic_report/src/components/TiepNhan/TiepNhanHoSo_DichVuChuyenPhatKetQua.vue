<template>
  <div>
    <v-card>
      <v-card-text>
        
        <v-slide-y-transition>
          <!-- <span v-if="dichVuChuyenPhatKetQua.viaPostal === 1">
            <v-icon size="16">check_circle</v-icon> <b>Nhận kết quả tại nhà</b> để điền thông tin chuyển phát tận nhà
          </span> -->
          <v-form v-if="dichVuChuyenPhatKetQua.viaPostal === 2" v-model="valid_dichvuchuyenphat" ref="formDichVuChuyenPhat" lazy-validation>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Dịch vụ đăng ký <span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm10>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-select
                  v-else
                  :items="postalServiceItems"
                  item-text="itemName"
                  item-value="itemCode"
                  v-model="dichVuChuyenPhatKetQua.postalServiceCode"
                  autocomplete
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-select>
              </v-flex>
              <!--  -->
              <!--  -->
              <!-- <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Mã bưu cục: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-select
                  v-else
                  :items="vnPostItems"
                  item-text="itemName"
                  item-value="itemCode"
                  v-model="dichVuChuyenPhatKetQua.vnPostCode"
                  :required='dichVuChuyenPhatKetQua.viaPostal'
                  autocomplete
                ></v-select>
              </v-flex> -->
              <v-flex xs12>

              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Địa chỉ trả kết quả<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm6>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-text-field
                  v-else
                  v-model="dichVuChuyenPhatKetQua.postalAddress"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">SĐT người nhận<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-text-field
                  v-else
                  v-model="dichVuChuyenPhatKetQua.postalTelNo"
                  append-icon="phone"
                  :rules="[rules.telNo, rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Bưu cục<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm6>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-select
                  v-else
                  :items="vnPostItems"
                  item-text="itemName"
                  item-value="itemCode"
                  v-model="dichVuChuyenPhatKetQua.postalCityCode"
                  autocomplete
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-select>
              </v-flex>
              <!-- <v-flex xs12 sm2>
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
                  @change="onChangeResultCity"
                  v-model="dichVuChuyenPhatKetQua.postalCityCode"
                  autocomplete
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
                  :items="resultDistricts"
                  item-text="itemName"
                  item-value="itemCode"
                  @change="onChangeResultDistrict"
                  v-model="dichVuChuyenPhatKetQua.postalDistrictCode"
                  autocomplete
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
                  :items="resultWards"
                  item-text="itemName"
                  item-value="itemCode"
                  v-model="dichVuChuyenPhatKetQua.postalWardCode"
                  autocomplete
                ></v-select>
              </v-flex> -->
            </v-layout>
          </v-form>
        </v-slide-y-transition>
        
      </v-card-text>
    </v-card>
    <div class="absolute__btn" style="width: 400px; margin-top: 4px;">
      <content-placeholders class="mt-1" v-if="loading">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <!--  -->
      <v-radio-group v-model="dichVuChuyenPhatKetQua.viaPostal" row @change="changeViaPostal($event)">
        <v-radio label="Nhận kết quả trực tiếp" :value="1" ></v-radio>
        <v-radio label="Nhận kết quả tại nhà" :value="2"></v-radio>
      </v-radio-group>
      <!--  -->
      <!-- <v-checkbox
        v-else
        label="Đăng ký trả kết quả tại nhà"
        v-model="dichVuChuyenPhatKetQua.viaPostal"
        :value="2"
        @change="changeViaPostal($event)"
      ></v-checkbox> -->
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid_dichvuchuyenphat: false,
    citys: [],
    resultDistricts: [],
    resultWards: [],
    vnPostItems: [],
    postalServiceItems: [
      {
        itemName: 'VNPOST',
        itemCode: 'VNPOST'
      }
    ],
    rules: {
      required: (value) => !!value || 'Trường dữ liệu bắt buộc',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
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
    thongTinChuHoSoBindChuyenPhat () {
      return this.$store.getters.thongTinChuHoSoBindChuyenPhat
    },
    dichVuChuyenPhatKetQua () {
      return this.$store.getters.dichVuChuyenPhatKetQua
    }
  },
  created () {
    let vm = this
    vm.$store.dispatch('getVNPOSTcode').then(result => {
      vm.vnPostItems = result
    })
    if (this.postalServiceItems.length > 0) {
      this.dichVuChuyenPhatKetQua.postalServiceCode = this.postalServiceItems[0].itemCode
    }
  },
  watch: {
    thongTinChuHoSoBindChuyenPhat (val) {
      var vm = this
      // vm.dichVuChuyenPhatKetQua.postalCityCode = val.cityCode
      // vm.dichVuChuyenPhatKetQua.postalDistrictCode = val.districtCode
      // vm.dichVuChuyenPhatKetQua.postalWardCode = val.wardCode
      /*
      vm.dichVuChuyenPhatKetQua.postalAddress = val.address
      vm.dichVuChuyenPhatKetQua.postalTelNo = val.contactTelNo
      */
      // var filter = {
      //   collectionCode: 'ADMINISTRATIVE_REGION',
      //   level: 0,
      //   parent: 0
      // }
      // if (val.cityCode) {
      //   vm.onChangeResultCity(val.cityCode)
      // }
      // if (val.districtCode) {
      //   vm.onChangeResultDistrict(val.districtCode)
      // }
    }
  },
  mounted () {
    var vm = this
    var filter = {
      collectionCode: 'ADMINISTRATIVE_REGION',
      level: 0,
      parent: 0
    }
    var data = vm.dichVuChuyenPhatKetQua
    vm.$store.getters.getDictItems(filter).then(function (result) {
      vm.citys = result.data
    })
    if (data.postalCityCode) {
      filter.parent = data.postalCityCode
      filter.level = 1
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.resultDistricts = result.data
      })
    }
    if (data.postalDistrictCode) {
      filter.parent = data.postalDistrictCode
      filter.level = 1
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.resultWards = result.data
      })
    }
  },
  methods: {
    initData (data) {
      var vm = this
      // let dichVuChuyenPhatKetQuaTemp = {
      //   viaPostal: data.viaPostal,
      //   postalServiceCode: data.postalServiceCode,
      //   postalServiceName: data.postalServiceName,
      //   postalAddress: data.postalAddress,
      //   postalCityCode: data.postalCityCode,
      //   postalCityName: data.postalCityName,
      //   postalDistrictCode: data.postalDistrictCode,
      //   postalDistrictName: data.postalDistrictName,
      //   postalWardCode: data.postalWardCode,
      //   postalWardName: data.postalWardName,
      //   postalTelNo: data.postalTelNo,
      //   vnPostCode: data.vnPostCode
      // }
      // vm.dichVuChuyenPhatKetQua = dichVuChuyenPhatKetQuaTemp
      vm.$nextTick(function () {
        // var filter = {
        //   collectionCode: 'ADMINISTRATIVE_REGION',
        //   level: 0,
        //   parent: 0
        // }
        // vm.$store.getters.getDictItems(filter).then(function (result) {
        //   vm.citys = result.data
        // })
        // if (data.postalCityCode) {
        //   filter.parent = data.postalCityCode
        //   filter.level = 1
        //   vm.$store.getters.getDictItems(filter).then(function (result) {
        //     vm.resultDistricts = result.data
        //   })
        // }
        // if (data.postalDistrictCode) {
        //   filter.parent = data.postalDistrictCode
        //   filter.level = 1
        //   vm.$store.getters.getDictItems(filter).then(function (result) {
        //     vm.resultWards = result.data
        //   })
        // }
        // filter = {
        //   collectionCode: 'VNPOST_CODE',
        //   level: 0,
        //   parent: 0
        // }
        // vm.$store.getters.getDictItems(filter).then(function (result) {
        //   vm.vnPostItems = result.data
        // })
      })
    },
    onChangeResultCity (data) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 1,
        parent: data
      }
      console.log('onChangeResultCity', data)
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.resultDistricts = result.data
      })
    },
    onChangeResultDistrict (data) {
      var vm = this
      let filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 2,
        parent: data
      }
      console.log('onChangeResultDistrict', data)
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.resultWards = result.data
      })
    },
    changeViaPostal (event) {
      console.log('changeViaPostal', event)
      this.$store.commit('setViaPostal', event === 2 ? 2 : 1)
      this.$emit('changeViapostal', event)
      let dataChuyenPhat = {
        viaPostal: event === 2 ? 2 : 1,
        postalServiceCode: this.dichVuChuyenPhatKetQua.postalServiceCode ? this.dichVuChuyenPhatKetQua.postalServiceCode : '',
        postalAddress: this.dichVuChuyenPhatKetQua.postalAddress ? this.dichVuChuyenPhatKetQua.postalAddress : '',
        postalCityCode: this.dichVuChuyenPhatKetQua.postalCityCode ? this.dichVuChuyenPhatKetQua.postalCityCode : '',
        postalDistrictCode: this.dichVuChuyenPhatKetQua.postalDistrictCode ? this.dichVuChuyenPhatKetQua.postalDistrictCode : '',
        postalWardCode: this.dichVuChuyenPhatKetQua.postalWardCode ? this.dichVuChuyenPhatKetQua.postalWardCode : '',
        postalTelNo: this.dichVuChuyenPhatKetQua.postalTelNo ? this.dichVuChuyenPhatKetQua.postalTelNo : ''
      }
      this.$store.commit('setDichVuChuyenPhatKetQua', dataChuyenPhat)
      console.log('dichVuChuyenPhatKetQua', this.dichVuChuyenPhatKetQua)
    },
    validDichVuChuyenPhat () {
      var vm = this
      return vm.$refs.formDichVuChuyenPhat.validate()
    }
  }
}
</script>
