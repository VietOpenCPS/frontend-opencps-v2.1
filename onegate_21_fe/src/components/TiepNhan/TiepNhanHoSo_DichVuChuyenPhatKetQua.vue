<template>
  <div>
    <v-card>
      <v-card-text>
        
        <v-slide-y-transition>
          <span v-if="dichVuChuyenPhatKetQua.viaPostal === 1">
            <v-icon size="16">check_circle</v-icon> <strong>Đăng ký kết quả tại nhà</strong> để điền thông tin chuyển phát tận nhà
          </span>
          <v-layout v-else wrap>
            <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">Dịch vụ đăng ký: </v-subheader>
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
              ></v-select>
            </v-flex>
            <!--  -->
            <!--  -->
            <!-- <v-flex xs12 sm2>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-subheader v-else class="pl-0">SĐT người nhận: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-text-field
                v-else
                v-model="dichVuChuyenPhatKetQua.postalTelNo"
                append-icon="phone"
                :required='dichVuChuyenPhatKetQua.viaPostal'
              ></v-text-field>
            </v-flex> -->
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
              <v-subheader v-else class="pl-0">Địa chỉ trả kết quả: </v-subheader>
            </v-flex>
            <v-flex xs12 sm10>
              <content-placeholders class="mt-1" v-if="loading">
                <content-placeholders-text :lines="1" />
              </content-placeholders>
              <v-text-field
                v-else
                v-model="dichVuChuyenPhatKetQua.postalAddress"
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
            </v-flex>
          </v-layout>
        </v-slide-y-transition>
        
      </v-card-text>
    </v-card>
    <div class="absolute__btn" style="width: 198px; margin-top: 4px;">
      <content-placeholders class="mt-1" v-if="loading">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <v-checkbox
        v-else
        label="Đăng ký kết quả tại nhà"
        v-model="dichVuChuyenPhatKetQua.viaPostal"
        :value="2"
        @change="changeViaPostal($event)"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    citys: [],
    resultDistricts: [],
    resultWards: [],
    vnPostItems: [],
    postalServiceItems: [
      {
        itemName: 'VNPOST',
        itemCode: 'VNPOST'
      }
    ]
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
  },
  watch: {
    thongTinChuHoSoBindChuyenPhat (val) {
      var vm = this
      vm.dichVuChuyenPhatKetQua.postalCityCode = val.cityCode
      vm.dichVuChuyenPhatKetQua.postalDistrictCode = val.districtCode
      vm.dichVuChuyenPhatKetQua.postalWardCode = val.wardCode
      vm.dichVuChuyenPhatKetQua.postalAddress = val.address
      var filter = {
        collectionCode: 'ADMINISTRATIVE_REGION',
        level: 0,
        parent: 0
      }
      if (val.cityCode) {
        vm.onChangeResultCity(val.cityCode)
      }
      if (val.districtCode) {
        vm.onChangeResultDistrict(val.districtCode)
      }
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
        var filter = {
          collectionCode: 'ADMINISTRATIVE_REGION',
          level: 0,
          parent: 0
        }
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
        filter = {
          collectionCode: 'VNPOST_CODE',
          level: 0,
          parent: 0
        }
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
        postalWardCode: this.dichVuChuyenPhatKetQua.postalWardCode ? this.dichVuChuyenPhatKetQua.postalWardCode : ''
      }
      this.$store.commit('setDichVuChuyenPhatKetQua', dataChuyenPhat)
      console.log('dichVuChuyenPhatKetQua', this.dichVuChuyenPhatKetQua)
    }
  }
}
</script>
