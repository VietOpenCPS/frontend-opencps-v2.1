<template>
  <div>
    <v-card>
      <v-card-text v-if="dichVuChuyenPhatHoSo.vnpostalStatus === 1">
        
        <v-slide-y-transition>
          <v-form  v-model="valid_dichvuchuyenphat" ref="formDichVuChuyenPhatHoSo" lazy-validation>
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
                <v-autocomplete
                  v-else
                  :items="postalServiceItems"
                  item-text="itemName"
                  item-value="itemCode"
                  hide-no-data
                  v-model="dichVuChuyenPhatHoSo.postalServiceCode"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-autocomplete>
              </v-flex>
              
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Địa chỉ nhận hồ sơ<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm10>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-text-field
                  v-else
                  v-model="dichVuChuyenPhatHoSo.postalAddress"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-text-field>
              </v-flex>
              
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Tỉnh/Thành phố<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-autocomplete
                  v-else
                  :items="citys"
                  item-text="itemName"
                  item-value="itemCode"
                  @change="onChangeResultCity"
                  hide-no-data
                  v-model="dichVuChuyenPhatHoSo.postalCityCode"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Quận/Huyện<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-autocomplete
                  v-else
                  :items="resultDistricts"
                  item-text="itemName"
                  item-value="itemCode"
                  @change="onChangeResultDistrict"
                  hide-no-data
                  v-model="dichVuChuyenPhatHoSo.postalDistrictCode"
                  :rules="[v => !!v || 'Trường dữ liệu bắt buộc']"
                  required
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">SĐT người gửi<span style="color:red">&nbsp;*&nbsp;</span>: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-text-field
                  v-else
                  v-model="dichVuChuyenPhatHoSo.postalTelNo"
                  append-icon="phone"
                  :rules="[rules.telNo, rules.required]"
                  required
                ></v-text-field>
              </v-flex>
              <!-- <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0">Xã/Phường: </v-subheader>
              </v-flex>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-autocomplete
                  v-else
                  :items="resultWards"
                  item-text="itemName"
                  item-value="itemCode"
                  v-model="dichVuChuyenPhatHoSo.postalWardCode"
                  @change="onChangeResultWard"
                ></v-autocomplete>
              </v-flex> -->
            </v-layout>
          </v-form>
        </v-slide-y-transition>
        
      </v-card-text>
    </v-card>
    <div class="absolute__btn" style="width: 200px; margin-top: 5px;"> 
      <content-placeholders class="mt-1" v-if="loading">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <v-checkbox
        class="mt-0"
        v-else
        label="Đăng ký thu hồ sơ tại nhà"
        v-model="dichVuChuyenPhatHoSo.vnpostalStatus"
        :value="1"
        @change="changeViaPostal($event)"
      ></v-checkbox>
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
        itemName: 'VIETTEL POST',
        itemCode: 'VTPOST'
      },
      // {
      //   itemName: 'VNPOST',
      //   itemCode: 'VNPOST'
      // }
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
    dichVuChuyenPhatHoSo () {
      return this.$store.getters.dichVuChuyenPhatHoSo
    }
  },
  created () {
    let vm = this
    // vm.$store.dispatch('getVNPOSTcode').then(result => {
    //   vm.vnPostItems = result
    // })
    if (this.postalServiceItems.length > 0) {
      this.dichVuChuyenPhatHoSo.postalServiceCode = this.postalServiceItems[0].itemCode
    }
  },
  watch: {
    thongTinChuHoSoBindChuyenPhat (val) {
      var vm = this
      // vm.dichVuChuyenPhatHoSo.postalCityCode = val.cityCode
      // vm.dichVuChuyenPhatHoSo.postalDistrictCode = val.districtCode
      // vm.dichVuChuyenPhatHoSo.postalWardCode = val.wardCode
      /*
      vm.dichVuChuyenPhatHoSo.postalAddress = val.address
      vm.dichVuChuyenPhatHoSo.postalTelNo = val.contactTelNo
      */
      // var filter = {
      //   collectionCode: 'VNPOST_CITY_CODE',
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
    let vm = this
    let filter = {
      collectionCode: 'VNPOST_CITY_CODE',
      level: 0,
      parent: 0
    }
    let data = vm.dichVuChuyenPhatHoSo
    vm.$store.getters.getDictItems(filter).then(function (result) {
      vm.citys = result.data
    })
    if (data.postalCityCode) {
      let filter1 = {
        collectionCode: 'VNPOST_CITY_CODE',
        level: 1,
        parent: data.postalCityCode
      }
      vm.$store.getters.getDictItems(filter1).then(function (result) {
        vm.resultDistricts = result.data
      })
    }
    // if (data.postalDistrictCode) {
    //   let filter2 = {
    //     collectionCode: 'VNPOST_CITY_CODE',
    //     level: 1,
    //     parent: data.postalDistrictCode
    //   }
    //   vm.$store.getters.getDictItems(filter2).then(function (result) {
    //     vm.resultWards = result.data
    //   })
    // }
  },
  methods: {
    initData (data) {
      var vm = this
      vm.$nextTick(function () {
      })
    },
    onChangeResultCity (data) {
      let vm = this
      vm.resultDistricts = []
      vm.resultWards = []
      let filter = {
        collectionCode: 'VNPOST_CITY_CODE',
        level: 1,
        parent: data
      }
      console.log('onChangeResultCity', data)
      vm.$store.getters.getDictItems(filter).then(function (result) {
        vm.resultDistricts = result.data
      })
      vm.dichVuChuyenPhatHoSo.postalCityName = vm.citys.filter(function(item) {
        return item.itemCode === data
      })[0]['itemName']
    },
    onChangeResultDistrict (data) {
      let vm = this
      // vm.resultWards = []
      // let filter = {
      //   collectionCode: 'VNPOST_CITY_CODE',
      //   level: 2,
      //   parent: data
      // }
      // vm.$store.getters.getDictItems(filter).then(function (result) {
      //   vm.resultWards = result.data
      // })
      vm.dichVuChuyenPhatHoSo.postalDistrictName = vm.resultDistricts.filter(function(item) {
        return item.itemCode === data
      })[0]['itemName']
    },
    onChangeResultWard (data) {
      let vm = this
      vm.dichVuChuyenPhatHoSo.postalWardName = vm.resultWards.filter(function(item) {
        return item.itemCode === data
      })[0]['itemName']
    },
    changeViaPostal (event) {
      // console.log('changeViaPostal', event)
      // this.$store.commit('setViaPostal', event)
      // this.$emit('changeViapostal', event)
      let dataChuyenPhat = {
        vnpostalStatus: event,
        postalServiceCode: this.dichVuChuyenPhatHoSo.postalServiceCode ? this.dichVuChuyenPhatHoSo.postalServiceCode : '',
        postalAddress: this.dichVuChuyenPhatHoSo.postalAddress ? this.dichVuChuyenPhatHoSo.postalAddress : '',
        postalCityCode: this.dichVuChuyenPhatHoSo.postalCityCode ? this.dichVuChuyenPhatHoSo.postalCityCode : '',
        postalCityName: this.dichVuChuyenPhatHoSo.postalCityName ? this.dichVuChuyenPhatHoSo.postalCityName : '',
        postalDistrictCode: this.dichVuChuyenPhatHoSo.postalDistrictCode ? this.dichVuChuyenPhatHoSo.postalDistrictCode : '',
        postalDistrictName: this.dichVuChuyenPhatHoSo.postalDistrictName ? this.dichVuChuyenPhatHoSo.postalDistrictName : '',
        postalWardCode: this.dichVuChuyenPhatHoSo.postalWardCode ? this.dichVuChuyenPhatHoSo.postalWardCode : '',
        postalWardName: this.dichVuChuyenPhatHoSo.postalWardName ? this.dichVuChuyenPhatHoSo.postalWardName : '',
        postalTelNo: this.dichVuChuyenPhatHoSo.postalTelNo ? this.dichVuChuyenPhatHoSo.postalTelNo : ''
      }
      this.$store.commit('setDichVuChuyenPhatHoSo', dataChuyenPhat)
      console.log('dichVuChuyenPhatHoSo', this.dichVuChuyenPhatHoSo)
    },
    validDichVuChuyenPhat () {
      var vm = this
      if(vm.dichVuChuyenPhatHoSo.vnpostalStatus){
        return vm.$refs.formDichVuChuyenPhatHoSo.validate()
      } else {
        return true
      }
      
    } 
  }
}
</script>
