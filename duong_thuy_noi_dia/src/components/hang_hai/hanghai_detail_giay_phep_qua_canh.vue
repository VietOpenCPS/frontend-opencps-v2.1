<template>
  <div style="width: 100%; position: relative;" class="extFormXuLy">
    <v-form v-model="extvaild" ref="extform">
      <v-layout wrap>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Tên tàu:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4 class="pr-3">
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.nameOfship}}</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Quốc tịch:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.stateName}}</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else-if="!loadingPDF && (document_type_code === '14' || document_type_code === '15')">Số đăng ký:</v-subheader>
          <v-subheader v-else class="px-0">Hô hiệu:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else-if="!loadingPDF && (document_type_code === '14' || document_type_code === '15')" class="px-0">{{detail_clearance.imo}}</v-subheader>
          <v-subheader v-else class="px-0">{{detail_clearance.callSign}}</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader class="px-0" v-else-if="!loadingPDF && (document_type_code === '14' || document_type_code === '15')">Trọng tải toàn phần:</v-subheader>
          <v-subheader v-else class="px-0">Dung tích toàn phần:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.grt}}</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Tên thuyền trưởng:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.nameOfMaster}}</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Cảng làm thủ tục quá cảnh:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.unitCertificateNo}}</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Số lượng thuyền viên:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.numberOfCrews}} Pers</v-subheader>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Số lượng hành khách:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">{{detail_clearance.numberOfPassengers}} Pers</v-subheader>
        </v-flex>

        <hr class="divider divider--inset flex xs12 my-3 ml-0">

        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Khu vực cảng <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4 class="pr-4">
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-select
            v-else
            v-model="detail_clearance.cangRoi"
            :items="lstRegion"
            item-text="portRegionNameVN"
            item-value="portRegionCode"
            autocomplete
            :rules="[v => !!v || 'khu vực cảng bắt buộc phải nhập']"
            required
          ></v-select>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Được phép quá cảnh đến <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-select
            v-else
            v-model="detail_clearance.cangDen"
            :items="lstState"
            item-text="stateName"
            item-value="stateCode"
            autocomplete
            :rules="[v => !!v || 'được phép quá cảnh đến bắt buộc phải nhập']"
            required
          ></v-select>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Thời gian khởi hành <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4 class="pr-4">
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">
            <datetime-picker
              v-model="timeOfDeparture"
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
          <v-subheader v-else class="px-0">Thời gian hiệu lực <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">
            {{timeOfValidUntil}}
          </v-subheader>
        </v-flex>
        
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Ngày cấp phép <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4 class="pr-4">
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">
            <datetime-picker
              v-model="issueDate"
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
          <v-subheader v-else class="px-0">Giấy phép số <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
        </v-flex>
        <v-flex xs12 sm2 class="pr-3">
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-text-field
            v-else
            v-model="detail_clearance.certificateNo" 
            :rules="[v => !!v || 'giấy phép số bắt buộc phải nhập']"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-text-field
            v-else
            v-model="detail_clearance.unitCertificateNo" 
            :rules="[v => !!v || 'giấy phép số bắt buộc phải nhập']"
            required
          ></v-text-field>
        </v-flex>
        
        <v-flex xs12 sm6>
        
        </v-flex>

        <v-flex xs12 sm2>
          <div v-if="loadingPDF">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0">Người ký:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
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
            autocomplete
            :rules="[v => !!v || 'người ký bắt buộc phải nhập']"
            required
          ></v-select>
        </v-flex>

        <hr class="divider divider--inset flex xs12 mt-3 ml-0 mb-2">

        <v-flex xs12 sm8>
          <div v-if="loadingPDFTable">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-subheader v-else class="px-0 text-bold">Hàng hóa vận chuyển trên tàu:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4 class="text-right mb-2">
          <div v-if="loadingPDFTable">
            <content-placeholders>
              <content-placeholders-text :lines="1" />
            </content-placeholders>
          </div>
          <v-btn v-else class="mx-0 my-0 white--text" color="blue-grey" v-on:click.native="addDanhSachHangHoa()" >
            Thêm khai báo hàng hóa <v-icon right dark>add_circle</v-icon>
          </v-btn>
        </v-flex>
        
        <v-flex xs12 v-if="loadingPDFTable">
          <content-placeholders :rounded="true">
            <content-placeholders-img />
          </content-placeholders>
        </v-flex>
        <v-data-table
          v-else
          v-bind:headers="khaiBaoheaders"
          :items="khaiBaoItems"
          hide-actions
          class="table-bordered danhSachHangHoaTable__class mb-2"
        >
          <template slot="items" slot-scope="props">
            <td v-if="props.item.idXoa === 0" class="text-xs-left" style="padding: 10px !important;">{{ props.index + 1 }}</td>
            <td v-if="props.item.idXoa === 0" class="text-xs-center">
              <v-select
                v-model="props.item.cargoType"
                :items="cargoTypes"
                return-object
                item-text="name"
                item-value="code0"
                autocomplete
              ></v-select>
            </td>
            <td v-if="props.item.idXoa === 0" class="text-xs-center">
              <v-select
                v-model="props.item.cargoCode"
                :items="cargoCodesFUNC(props.item, props.index)"
                return-object
                item-text="name"
                item-value="code0"
                autocomplete
              ></v-select>
            </td>
            <td v-if="props.item.idXoa === 0" class="text-xs-center">
              <v-text-field
                  v-model="props.item.description" 
              ></v-text-field>
            </td>
            <td v-if="props.item.idXoa === 0" class="text-xs-center">
              <v-text-field
                  v-model="props.item.quantity" 
              ></v-text-field>  
            </td>
            <td v-if="props.item.idXoa === 0" class="text-xs-center">
              <v-select
                v-model="props.item.unit"
                :items="unitCargos"
                return-object
                item-text="name"
                item-value="code0"
                autocomplete
              ></v-select>
            </td>
            <td v-if="props.item.idXoa === 0" class="text-xs-center">
              <v-btn icon class="mx-0 my-0" v-on:click.native="removeDanhSachHangHoa(props.item, props.index)">
                <v-icon class="red--text text--darken-3">clear</v-icon>
              </v-btn>  
            </td>
          </template>
        </v-data-table>
        <v-flex xs12 class="text-right" v-if="khaiBaoItems.length > 10">
          <v-btn class="mx-0 my-0 white--text" color="blue-grey" v-on:click.native="addDanhSachHangHoa()" >
            Thêm khai báo hàng hóa <v-icon right dark>add_circle</v-icon>
          </v-btn>
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
const COMPONENT_NAME = 'jx-hanghai-detail-giay-phep-qua-canh'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    document_name: 0,
    document_year: 0,
    document_type_code: '',
    user_signs: [],
    port_clearance_api: '',
    port_clearance_api_table: '',
    port_clearance: '',
    port_clearance_table: ''
  },
  components: {
    'datetime-picker': DatetimePicker
  },
  data () {
    return {
      loadingPDF: true,
      loadingPDFTable: true,
      showError: false,
      detail_clearance: {},
      khaiBaoheaders: [
        {
          text: 'STT',
          align: 'left',
          sortable: false
        },
        {
          text: 'Loại hàng hóa',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên hàng hóa',
          align: 'center',
          sortable: false
        },
        {
          text: 'Mô tả hàng hóa (nếu có)',
          align: 'center',
          sortable: false
        },
        {
          text: 'Số lượng',
          align: 'center',
          sortable: false
        },
        {
          text: 'Đơn vị',
          align: 'center',
          sortable: false
        },
        {
          text: 'Xóa',
          align: 'center',
          sortable: false
        }
      ],
      khaiBaoItems: [
      ],
      cargoTypes: [],
      cargoCodes: [],
      unitCargos: [],
      unitVolumeTransitCargoItems: [],
      lstRegion: [],
      lstState: [],
      cusIndex: 0,
      giamDoc: {},
      timeOfDeparture: moment().locale('vi').format('DD/MM/YYYY HH:mm'),
      timeOfValidUntil: moment().locale('vi').format('DD/MM/YYYY HH:mm'),
      issueDate: moment().locale('vi').format('DD/MM/YYYY HH:mm'),
      extvaild: true
    }
  },
  watch: {
    timeOfDeparture (val) {
      this.timeOfValidUntil = moment(moment(val, 'DD/MM/YYYY HH:mm').add(1, 'day')).locale('vi').format('DD/MM/YYYY HH:mm')
    }
  },
  methods: {
    cargoCodesFUNC: function (item, index) {
      var vm = this
      vm.cusIndex = index
      var typeVal = ''
      if (item.hasOwnProperty('cargoType')) {
        typeVal = item.cargoType
        var cargoData = []
        for (var key in vm.cargoCodes) {
          if (typeof typeVal === 'string') {
            if (vm.cargoCodes[key].node1 === typeVal) {
              cargoData.push(vm.cargoCodes[key])
            }
          } else {
            if (vm.cargoCodes[key].node1 === typeVal.code0) {
              cargoData.push(vm.cargoCodes[key])
            }
          }
        }
        return cargoData
      } else {
        return false
      }
    },
    removeDanhSachHangHoa: function (item, index) {
      let vm = this
      var x = confirm('Bạn có muốn thực hiện hành động này?')
      if (x) {
        vm.khaiBaoItems[index]['idXoa'] = 1
        vm.khaiBaoItems.push({
          id: vm.khaiBaoItems.length + 1,
          idXoa: 0
        })
        vm.khaiBaoItems.splice(-1, 1)
      } else {
        return false
      }
    },
    addDanhSachHangHoa: function () {
      var vm = this
      vm.khaiBaoItems.push({
        id: vm.khaiBaoItems.length + 1,
        idXoa: 0
      })
    },
    process_giay_phep: function () {
    },
    bindData: function (serializable) {
      let vm = this
      vm.detail_clearance = serializable
      if (vm.cargoTypes.length <= 0) {
        vm.cargoTypes = vm.detail_clearance.cargoType
      }
      if (vm.cargoCodes.length <= 0) {
        vm.cargoCodes = vm.detail_clearance.cargoCode
      }
      if (vm.unitCargos.length <= 0) {
        vm.unitCargos = vm.detail_clearance.unitCargo
      }
      if (vm.unitVolumeTransitCargoItems.length <= 0) {
        vm.unitVolumeTransitCargoItems = vm.detail_clearance.unitVolumeTransitCargoItems
      }
      if (vm.lstRegion.length <= 0) {
        vm.lstRegion = vm.detail_clearance.lstRegion
      }
      if (vm.lstState.length <= 0) {
        vm.lstState = vm.detail_clearance.lstState
      }

      var dateDepart = new Date()
      if (vm.detail_clearance.timeOfDeparture == null) {
        vm.timeOfDeparture = moment().locale('vi').format('DD/MM/YYYY HH:mm')
      } else {
        let dateOfDePart = new Date(vm.detail_clearance.timeOfDeparture)
        vm.timeOfDeparture = moment(dateOfDePart).locale('vi').format('DD/MM/YYYY HH:mm')
        dateDepart = new Date(vm.detail_clearance.timeOfDeparture)
      }

      if (vm.detail_clearance.timeOfValidUntil == null) {
        let addDateOfDepart = new Date(dateDepart + 86400000).toString()
        vm.timeOfValidUntil = new Date(addDateOfDepart).toString()
      } else {
        let timeOfValidUntilPart = new Date(vm.detail_clearance.timeOfValidUntil)
        vm.timeOfValidUntil = moment(timeOfValidUntilPart).locale('vi').format('DD/MM/YYYY HH:mm')
      }

      if (vm.detail_clearance.issueDate == null) {
        vm.issueDate = moment().locale('vi').format('DD/MM/YYYY HH:mm')
      } else {
        let issueDatePart = new Date(vm.detail_clearance.issueDate)
        vm.issueDate = moment(issueDatePart).locale('vi').format('DD/MM/YYYY HH:mm')
      }
      vm.user_signs = serializable.userSigns
      if (vm.user_signs != null && vm.user_signs.length > 0) {
        for (var key in vm.user_signs) {
          if (vm.user_signs[key].representative === vm.detail_clearance.representative) {
            vm.giamDoc = vm.user_signs[key]
          }
        }
      }
      vm.detail_clearance.cargoType = []
      vm.detail_clearance.cargoCode = []
      vm.detail_clearance.unitCargo = []
      vm.detail_clearance.unitVolumeTransitCargoItems = []
      vm.detail_clearance.lstRegion = []
      vm.detail_clearance.lstState = []
      vm.loadingPDF = false
    },
    bindDataTable: function (serializable) {
      let vm = this
      vm.khaiBaoItems = serializable.tempCargoItems
      for (let key in vm.khaiBaoItems) {
        vm.khaiBaoItems[key]['idXoa'] = 0
      }
      vm.loadingPDFTable = false
    },
    doValidate () {
      let vm = this
      let result = false
      if (vm.$refs.extform.validate()) {
        result = true
      }
      return result
    }
  }
}
</script>
