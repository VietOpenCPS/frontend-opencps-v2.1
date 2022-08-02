<template>
  <div style="width: 100%; position: relative;" class="giay_to_xuat_trinh icon__nopadding">
    <v-form v-model="extvaild" ref="extform">
      <v-layout wrap>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="pl-0">Thời gian <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="px-0">
              <datetime-picker
                v-model="shiftingDate"
                :first-day="1"
                :show-dst="false"
                :show-hours="true"
                :show-minutes="true"
                :show-seconds="false"
                required
              ></datetime-picker>
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else>Tàu lai:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-text-field v-else
                v-model="detail_shifting.tugBoat"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Tên tàu <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="px-0">
              {{detail_shifting.nameOfShip}}
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
          
          </v-flex>
          <v-flex xs12 sm4>
            
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Tuyến luồng:</v-subheader>
          </v-flex>
          <v-flex xs12 sm10>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-select
              v-else
              v-model="chanel"
              chips
              deletable-chips
              tags
              hide-selected
              :items="chanels"
              return-object
              item-text="name"
              item-value="code0"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Mớn nước A<span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="px-0">
              {{detail_shifting.shownDraftxA}}
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else>Từ hành trình <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-text-field
              v-else
              v-model="detail_shifting.from"
              :rules="[v => !!v || 'từ bắt buộc phải nhập']"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Mớn nước F<span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="px-0">
              {{detail_shifting.shownDraftxF}}
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else-if="initData !== null && initData.user.isDTND">Đại diện cảng vụ <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
            <v-subheader v-else>Cảng biển <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">{{maritimeCityName}}</v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Chiều dài lớn nhất <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="px-0">
              {{detail_shifting.loa}}
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else-if="initData !== null && initData.user.isDTND">Đại diện <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
            <v-subheader v-else>Khu vực <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">{{portRegionName}}</v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Trọng tải <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="px-0">
              {{detail_shifting.dwt}}
            </v-subheader>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else>Bến cảng <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-select
              v-else
              v-model="detail_shifting.portHarbourCode"
              :items="lstPortHarbour"
              item-text="portHarbourName"
              item-value="portHarbourCode"
              return-object
              autocomplete
              :rules="[v => !!v || 'đến bến cảng bắt buộc phải nhập']"
              required
              @change="changePortHarbourName"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else class="pl-0">Người ký:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4 class="pr-3">
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-select
              v-else
              v-model="giamDoc"
              :items="user_signs"
              return-object
              item-text="representative"
              item-value="representative"
              :rules="[v => !!v || 'người ký bắt buộc phải nhập']"
              required
            ></v-select>
          </v-flex>
          <v-flex xs12 sm2>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-subheader v-else>Cầu cảng <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
          </v-flex>
          <v-flex xs12 sm4>
            <div v-if="loadingPDF">
              <content-placeholders>
                <content-placeholders-text :lines="1" />
              </content-placeholders>
            </div>
            <v-select
              v-else
              v-model="detail_shifting.shiftingPortWharfCode"
              :items="lstPortWharf"
              item-text="portWharfName"
              item-value="portWharfCode"
              return-object
              autocomplete
              :rules="[v => !!v || 'đến cầu cảng bắt buộc phải nhập']"
              required
            ></v-select>
          </v-flex>
          <v-flex xs12 v-if="showError">
            <v-alert outline color="warning" icon="priority_high" :value="true">
              Xảy ra lỗi trong quá trình lấy dữ liệu.
            </v-alert>
          </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from './DatetimePicker.vue'
const COMPONENT_NAME = 'jx-hanghai-detail-lenh-dieu-dong'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    type: '',
    document_type_code: '',
    document_status_code: '',
    document_name: 0,
    document_year: 0,
    user_signs: [],
    shifting_api: ''
  },
  components: {
    'datetime-picker': DatetimePicker
  },
  data () {
    return {
      initData: null,
      loadingPDF: true,
      showError: false,
      shiftingDate: moment().locale('vi').format('DD/MM/YYYY HH:mm'),
      detail_shifting: {},
      chanels: [],
      chanel: [],
      ports: [],
      lstPortHarbour: [],
      lstPortWharf: [],
      lstPortRegin: [],
      giamDoc: {},
      extvaild: true,
      maritimeCityName: '',
      portRegionName: ''
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
        vm.initData = result
      })
    })
  },
  methods: {
    changeDataFromCangBien: function (data) {
    },
    process_lenh_dieu_dong: function () {
      var vm = this
      vm.loadingPDF = true
      alert('lenh ideu dong')
      vm.$parent.process_lenh_dieu_dong()
    },
    bindData: function (serializable) {
      var vm = this
      vm.detail_shifting = serializable.detail
      vm.chanels = serializable.chanels
      vm.chanel = serializable.chanel
      vm.ports = serializable.ports
      vm.lstPortHarbour = serializable.lstPortHarbour
      vm.lstPortWharf = serializable.lstPortWharf
      vm.portRegionName = serializable.portRegionName

      vm.maritimeCityName = serializable.maritimeCityName

      if (vm.detail_shifting.shiftingDate == null) {
        vm.shiftingDate = moment().locale('vi').format('DD/MM/YYYY HH:mm')
      } else {
        let shiftingDatePart = new Date(vm.detail_shifting.shiftingDate)
        vm.shiftingDate = moment(shiftingDatePart).locale('vi').format('DD/MM/YYYY HH:mm')
      }
      vm.user_signs = serializable.userSigns
      if (vm.user_signs != null && vm.user_signs.length > 0) {
        for (var key in vm.user_signs) {
          if (
            vm.user_signs[key].representative === vm.detail_shifting.representative
          ) {
            vm.giamDoc = vm.user_signs[key]
          }
        }
      }
      vm.loadingPDF = false
    },
    clearLoading () {
      this.loadingPDF = false
    },
    doValidate () {
      let vm = this
      let result = false
      if (vm.$refs.extform.validate()) {
        result = true
      }
      return result
    },
    changePortHarbourName (data) {
      let vm = this
      let filter = {
        documentName: vm.document_name,
        documentYear: vm.document_year,
        harbourCode: data.portHarbourCode
      }
      vm.$store.dispatch('getListPortWharf', filter).then(function (result) {
        vm.lstPortWharf = result
      })
    }
  }
}
</script>
