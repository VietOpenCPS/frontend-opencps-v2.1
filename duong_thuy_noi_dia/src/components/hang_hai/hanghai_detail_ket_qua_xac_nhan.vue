<template>
  <div style="width: 100%; position: relative;" class="icon__nopadding">
    <div>
      <v-expansion-panel expand class="my-0 thong__tin_gt_xt">
        <v-expansion-panel-content v-bind:value="true">
        <div slot="header" class="text-bold primary--text">THÔNG BÁO PHẢN HỒI TỪ CÁC CƠ QUAN NHÀ NƯỚC KHÁC</div>
        <div v-if="loadingTablePH">
          <content-placeholders :rounded="true">
            <content-placeholders-img />
            <content-placeholders-heading />
          </content-placeholders>
          <br/>
          <br/>
        </div>
        <v-data-table v-else
            v-bind:headers="coQuanheaders"
            :items="coQuanItems"
            hide-actions
            class="table-bordered danhSachHoSocoQuanTable__class table_border_right_none table_border_left_none"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.index + 1 }}</td>
              <td class="text-xs-left">{{ props.item.orgName }}</td>
              <td class="text-xs-center">{{ props.item.status }}</td>
              <td class="text-xs-center text-bold" style="padding: 0 !important;">
                
                <v-btn flat block v-on:click.native="viewPDFGhiChu(props.item)"
                  class="px-0 py-0 mx-0 my-0"
                  :loading="loading_process_btn"
									:disabled="loading_process_btn"
                >
                  Xem
                  <span slot="loader">Loading...</span>
                </v-btn>
              
              </td>
            </template>
          </v-data-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div>
      <v-expansion-panel expand class="my-0">
        <v-expansion-panel-content v-bind:value="true">
        <div slot="header" class="text-bold primary--text">KÊT QUẢ XÁC NHẬN HOÀN THÀNH THỦ TỤC</div>
        <v-form v-model="extvaild" ref="extform">
          <v-layout wrap class="pb-3">
            <v-flex xs12 sm2>
              <v-subheader>Cảng vụ: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> {{detail_model.maritimeName}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader>Số chứng nhận <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
            </v-flex>
            <v-flex xs9 sm3 class="px-3">
              <v-text-field
                v-if="detail_model.documentStatusCode === 12"
                v-model="soChungNhan"
                placeholder="số chứng nhận..."
                :rules="[v => !!v || 'số chứng nhận bắt buộc phải nhập']"
                required
              ></v-text-field>
              <v-subheader v-else class="pl-0">{{soChungNhan}}</v-subheader>
            </v-flex>
            <v-flex xs3 sm1>
              <v-subheader> {{detail_model.maritimeReferent}} </v-subheader>
            </v-flex>
          <v-flex xs12 sm2>
              <v-subheader>Tên tàu: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> {{detail_model.shipName}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader>Quốc tịch:</v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> {{supportData.data_state[detail_model.stateCode]}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader>Tên thuyền trưởng: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> {{detail_model.shipCaptain}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader v-if="document_type === '14' || document_type === '15'">Trọng tải toàn phần:</v-subheader>
              <v-subheader v-else>Dung tích toàn phần:</v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> {{detail_model.grt}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader>Nhập cảng: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> {{detail_model.portName}} </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader>Thời gian phê duyệt <span class="red--text text--darken-3 pl-1">(*)</span>:</v-subheader>
            </v-flex>
            <v-flex xs12 sm4 class="px-3">
              <v-subheader v-if="detail_model.documentStatusCode === 12" class="px-0">
                <datetime-picker
                  v-model="ngayPheDuyet"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
              </v-subheader>
              <v-subheader v-else class="pl-0">{{ngayPheDuyet}}</v-subheader>
            </v-flex>

            <v-flex xs12 sm2>
              <v-subheader>Trạng thái: </v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader class="text-bold red--text text--darken-3"> <span v-if="type === 'thu_tuc'">
                {{supportData.status.thu_tuc[detail_model.documentStatusCode]}}
                </span>
                <span v-else>
                  {{supportData.status.thu_tuc[detail_model.requestState]}}
                </span>
              </v-subheader>
            </v-flex>
            <v-flex xs12 sm2>
              <v-subheader>Cán bộ phê duyệt:</v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader v-if="approveName === '' || approveName === null || approveName === undefined"> {{detail_model.canBoPheDuyet}} </v-subheader>
              <v-subheader v-else> {{approveName}} </v-subheader>
            </v-flex>

            <v-flex xs12 sm2>
              <v-subheader></v-subheader>
            </v-flex>
            <v-flex xs12 sm4>
              <v-subheader> </v-subheader>
            </v-flex>
            <v-flex xs12 sm2 v-if="1 === 0">
              <v-subheader>Nhập phí lệ phí:</v-subheader>
            </v-flex>
            <v-flex xs12 sm4 class="px-3" v-if="1 === 0">
              <v-text-field
              v-model="lePhi"
                placeholder="lệ phí..." 
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div>
      <v-expansion-panel expand class="my-0">
        <v-expansion-panel-content v-bind:value="true">
        <div slot="header" class="text-bold primary--text">THÔNG TIN ĐỐI CHIẾU HỒ SƠ</div>
        
        <v-layout wrap class="pb-3" v-if="showListChk">
          <v-flex xs12>
               
            <ul class="list thanh_phan_hoso" style="border: 0px solid #ddd !important;">
              <li class="list--group__container" v-for="(item, index) in thanh_phan_lists" v-bind:key="item.code" v-if="checkCodeResult(item, index)">
                <div v-show="false">
                  <div class="error_thanh_phan_checked" v-if="item.state != 1"></div>
                </div>
                <ul class="list--group__header" :index="index">
                  <li>
                    <a class="list__tile list__tile--link">
                      <div class="list__tile__action">
                        <v-icon>chevron_right</v-icon>
                      </div>
                      <div class="list__tile__content">
                        <div class="list__tile__title">
                          {{item.name}}
                          <i aria-hidden="true" class="material-icons icon primary--text ml-2" style="margin-top: -8px;" v-if="item.state == 1">done</i>
                          <i aria-hidden="true" class="material-icons icon orange--text ml-2" style="margin-top: -3px;" v-else>warning</i>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </v-flex>
        </v-layout>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <v-dialog
      v-model="dialogPDF"
      max-width="800"
    >
      <v-card>
        <v-card-title class="headline">
          {{tenCoQuan}}
          <v-btn dark icon class="mx-0 my-0 btn-top-panel" v-on:click.native="dialogPDF = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <div id="dialogPDFView">
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from './DatetimePicker.vue'
import supportData from '../../store/support_data.json'
const COMPONENT_NAME = 'jx-hanghai-detail-ket-qua-xac-nhan'

export default {
  name: COMPONENT_NAME,
  props: {
    'name': String,
    group_id: 0,
    document_name: 0,
    document_year: 0,
    document_type: '',
    thong_bao_api: '',
    ghi_chu_api: '',
    type: '',
    thanh_phan_code: ''
  },
  components: {
    'datetime-picker': DatetimePicker
  },
  data () {
    return {
      showListChk: false,
      tenCoQuan: '',
      dialogPDF: false,
      detail_model: {
        maritimeName: '',
        documentStatusCode: '18',
        maritimeReferent: '',
        shipName: '',
        stateCode: 'AD',
        shipCaptain: '',
        grt: '',
        portName: '',
        requestState: '11',
        canBoPheDuyet: '',
        approveName: ''
      },
      thanh_phan_lists: [],
      loadingTablePH: true,
      supportData: supportData,
      avblo: 0,
      valValidator: 1,
      urlDownload: '',
      co_quan_title: 'các cơ quan nhà nước khác',
      dialog: false,
      loadingPDF: true,
      coQuanheaders: [
        {
          text: 'STT',
          align: 'left',
          sortable: false
        },
        {
          text: 'Tên cơ quan',
          align: 'left',
          sortable: false
        },
        {
          text: 'Hồ sơ',
          align: 'center',
          sortable: false
        },
        {
          text: 'Ghi chú',
          align: 'center',
          sortable: false
        }
      ],
      coQuanItems: [
      ],
      paginationCoQuan: {
        totalItems: 0
      },
      noti_respone_time: '',
      noti_latest_date: '',
      ngayPheDuyet: moment().locale('vi').format('DD/MM/YYYY HH:mm'),
      soChungNhan: '',
      lePhi: 0
    }
  },
  methods: {
    loadXacNhanDetailThanhPhan (data) {
      this.thanh_phan_lists = data
      this.showListChk = true
      console.log('loading list tp chk:')
    },
    loadXacNhanDetail (detail, data) {
      this.detail_model = detail
      if (this.detail_model === null || this.detail_model === undefined || this.detail_model === 'undefined') {
        this.detail_model = {
          maritimeName: '',
          documentStatusCode: '18',
          maritimeReferent: '',
          shipName: '',
          stateCode: 'AD',
          shipCaptain: '',
          grt: '',
          portName: '',
          requestState: '11',
          canBoPheDuyet: '',
          approveName: '',
          ngayPheDuyet: new Date().getTime()
        }
      }
      let vm = this
      let configDetail = {
        'documentType': vm.document_type,
        'documentName': vm.document_name,
        'documentYear': vm.document_year,
        'type': vm.type
      }
      vm.showListChk = false
      vm.$store.dispatch('loadDetailHoSo', configDetail).then(function (resultDetail) {
        vm.detail_model = resultDetail
        let config = {
          'maBanKhai': vm.document_name,
          'documentYear': vm.document_year
        }
        vm.$store.dispatch('loadMessageType23EXT', config).then(function (result) {
          vm.detail_model['ngayPheDuyet'] = result.ngayPheDuyet
          vm.detail_model['soChungNhan'] = result.soChungNhan
          vm.approveName = result['approveName']
          vm.loadXacNhanDetailThanhPhan(data)
          vm.reloadData()
          vm.loadPhanHoi()
          vm.showListChk = true
        })
      })
    },
    availableKeQuaPheDuyetF: function () {
      var vm = this
      return vm.avblo
    },
    reloadData: function () {
      var vm = this
      if (vm.detail_model['ngayPheDuyet'] != null) {
        vm.ngayPheDuyet = moment(new Date(vm.detail_model['ngayPheDuyet'])).locale('vi').format('DD/MM/YYYY HH:mm')
      }
      if (vm.detail_model['soChungNhan'] != null) {
        vm.soChungNhan = vm.detail_model['soChungNhan']
      }
      vm.lePhi = vm.detail_model['lePhi']
    },
    checkCodeResult: function (item, index) {
      var vm = this
      var result = false
      var codeCHKs = vm.thanh_phan_code.split(',')
      for (var key in codeCHKs) {
        if (codeCHKs[key] === item.code && item.available) {
          result = true
          if (item.state !== 1) {
            vm.avblo = 1
          }
          break
        }
      }
      return result
    },
    loadPhanHoi: function () {
      var vm = this
      let config = {
        'maBanKhai': vm.document_name,
        'documentYear': vm.document_year
      }
      vm.coQuanItems = []
      vm.loadingTablePH = true
      vm.$store.dispatch('loadPhanHoi', config).then(function (result) {
        vm.coQuanItems = result.data
        vm.loadingTablePH = false
      })
    },
    viewPDFGhiChu: function (item) {
      var vm = this
      vm.tenCoQuan = item.orgName
      let config = {
        'maBanKhai': item.documentName,
        'documentYear': item.documentYear,
        'ministryCode': item.ministryCode
      }
      let iFrame = document.getElementById('dialogPDFView')
      iFrame.innerHTML = ''
      vm.loading_process_btn = true
      vm.$store.dispatch('loadGhiChu', config).then(function (result) {
        let urlDownload = result.download
        vm.dialogPDF = true
        if (urlDownload !== null && urlDownload !== '') {
          iFrame.innerHTML =
            '<iframe src="' + urlDownload + '" style="width:100%; height: 100vh;" frameborder="0"></iframe>'
        } else {
          iFrame.innerHTML = '<div class="alert alert--outline error--text mx-4 mb-2"><i aria-hidden="true" class="icon material-icons alert__icon">warning</i><div> Không tìm thấy tài liệu PDF </div></div>'
        }
        vm.loading_process_btn = false
      })
    },
    doValidate () {
      let vm = this
      let result = false
      if (vm.$refs.extform.validate()) {
        result = true
      }
      if (document.getElementsByClassName('error_thanh_phan_checked') !== null && document.getElementsByClassName('error_thanh_phan_checked') !== undefined && document.getElementsByClassName('error_thanh_phan_checked').length > 0) {
        result = false
      }
      return result
    }
  }
}
</script>
