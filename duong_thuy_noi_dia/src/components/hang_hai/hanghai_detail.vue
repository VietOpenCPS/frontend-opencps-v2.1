<template>
  <div style="width: 100%; position: relative;" class="detail-view">
    <v-btn flat style="margin-right: 110px;" class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('ke_hoach')"
    v-if="isThuTuc && isKeHoach && !isKeToan"
    >
					<v-icon class="mr-2 primary--text">undo</v-icon>
				Kế hoạch
    </v-btn>
    <v-btn flat class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('ke_hoach')"
    v-if="!isThuTuc && isKeHoach && !isKeToan"
    >
					<v-icon class="mr-2 primary--text">undo</v-icon>
				Kế hoạch
    </v-btn>
    <v-btn flat class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('thu_tuc')"
      v-if="isThuTuc && isKeHoach && !isKeToan"
    >
					<v-icon class="mr-2 primary--text">undo</v-icon>
				Thủ tục
    </v-btn>
    <v-btn flat class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('thu_tuc')"
      v-if="isThuTuc && !isKeHoach && !isKeToan"
    >
					<v-icon class="mr-2 primary--text">undo</v-icon>
				Thủ tục
    </v-btn>
    <v-btn flat class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('else_type')"
      v-if="!isThuTuc && !isKeHoach && !isKeToan"
    >
					<v-icon class="mr-2 primary--text">undo</v-icon>
				Quay lại
    </v-btn>
     <v-btn flat class=" primary--text my-0 pr-3 btn-top-panel" v-on:click.native="backtolist('ke_toan')"
      v-if="isKeToan"
    >
					<v-icon class="mr-2 primary--text">undo</v-icon>
				Quay lại
    </v-btn>
    <div v-if="loading1">
      <content-placeholders>
        <content-placeholders-text :lines="4" />
      </content-placeholders>
      <br/>
      <br/>
    </div>
    <div v-else>
      <v-expansion-panel expand class="my-0 thong__tin_chung_hanghai">
        <v-expansion-panel-content v-bind:value="true">
        <div slot="header" class="text-bold primary--text">THÔNG TIN CHUNG</div>
        
        <v-layout wrap class="px-4 pb-2">
          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Cảng vụ: </div>
                <div class="labelClass flex xs12 sm8">
                  {{detail_model.maritimeName}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Mã bản khai: </div>
                <div class="labelClass flex xs12 sm8">
                  {{detail_model.documentName}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Loại bản khai: </div>
                <div class="labelClass flex xs12 sm8">
                  {{supportData.docType[detail_model.documentTypeCode]}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Tên tàu: </div>
                <div class="labelClass flex xs12 sm8">
                  {{detail_model.shipName}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Quốc tịch: </div>
                <div class="labelClass flex xs12 sm8">
                  {{supportData.data_state[detail_model.stateCode]}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4" v-if="detail_model.documentTypeCode === '14' || detail_model.documentTypeCode === '15'"> Số đăng ký: </div>
                <div class="labelClass flex text-bold xs12 sm4" v-else> Hô hiệu: </div>
                <div class="labelClass flex xs12 sm8" v-if="detail_model.documentTypeCode === '14' || detail_model.documentTypeCode === '15'">
                  {{detail_model.imo}}
                </div>
                <div v-else>
                  {{detail_model.callSign}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Tàu đến/rời: </div>
                <div class="labelClass flex xs12 sm8">
                  <span v-if="detail_model.documentTypeCode === '15' || detail_model.documentTypeCode === 'XC' || detail_model.documentTypeCode === '5' || detail_model.documentTypeCode === '17' || detail_model.documentTypeCode === '9' || detail_model.documentTypeCode === '11' || detail_model.documentTypeCode === '13'">
                    Rời
                  </span>
                  <span v-else>
                    Đến
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4" 
                  v-if="detail_model.documentTypeCode === 'NC' || detail_model.documentTypeCode === 'QC' || detail_model.documentTypeCode === '4' || detail_model.documentTypeCode === '16' || detail_model.documentTypeCode === '8' || detail_model.documentTypeCode === '10' || detail_model.documentTypeCode === '12'"> 
                  Thời gian đến: 
                  </div>
                <div class="labelClass flex xs12 sm8"
                  v-if="detail_model.documentTypeCode === 'NC' || detail_model.documentTypeCode === 'QC' || detail_model.documentTypeCode === '4' || detail_model.documentTypeCode === '16' || detail_model.documentTypeCode === '8' || detail_model.documentTypeCode === '10' || detail_model.documentTypeCode === '12'">
                  {{detail_model.shipDateFrom | moment("DD/MM/YYYY | HH:mm")}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4" v-if="detail_model.documentTypeCode === 'XC' || detail_model.documentTypeCode === '5' || detail_model.documentTypeCode === '17' || detail_model.documentTypeCode === '9' || detail_model.documentTypeCode === '11' || detail_model.documentTypeCode === '13'"> 
                  Thời gian rời: 
                </div>
                <div class="labelClass flex xs12 sm8" v-if="detail_model.documentTypeCode === 'XC' || detail_model.documentTypeCode === '5' || detail_model.documentTypeCode === '17' || detail_model.documentTypeCode === '9' || detail_model.documentTypeCode === '11' || detail_model.documentTypeCode === '13'">
                  {{detail_model.shipDateTo | moment("DD/MM/YYYY | HH:mm")}}
                </div>
              </div>
            </div>
          </div>

          <div class="flex xs12 sm4">
            <div class="editable-wrap">
              <div class="layout wrap">
                <div class="labelClass flex text-bold xs12 sm4"> Trạng thái: </div>
                <div class="labelClass flex xs12 sm8 text-bold red--text text--darken-3">
                  <span v-if="type === 'thu_tuc'">
                    {{supportData.status['thu_tuc'][detail_model.documentStatusCode]}}
                  </span>
                  <span v-else>
                    {{supportData.status['ke_hoach'][detail_model.requestState]}}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </v-layout>
        
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div>
      <v-expansion-panel expand class="my-0 no-boder-top-detail-table">
        <v-expansion-panel-content v-bind:value="true">
          <div slot="header" class="text-bold primary--text">THÔNG TIN KHAI BÁO</div>
          <div v-if="loadingTable">
            <content-placeholders :rounded="true">
              <content-placeholders-img />
              <content-placeholders-heading />
            </content-placeholders>
            <br/>
            <br/>
          </div>
          <v-data-table v-else
            v-bind:headers="khaiBaoheaders"
            :items="khaiBaoItems"
            hide-actions
            class="table-bordered danhSachHoSoKhaiBaoTable__class table_border_right_none table_border_left_none"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.index + 1 }}</td>
              <td class="text-xs-center">{{ props.item.thoi_gian_khai_bao }}</td>
              <td class="text-xs-left">{{ props.item.ban_khai }}</td>
              <td class="text-xs-center">{{ props.item.lan_gui_cuoi }}</td>
              <td class="text-xs-center">{{ props.item.so_gio_con_lai }}</td>
              <td class="text-xs-center">{{ props.item.trang_thai }}</td>
              <td class="text-xs-left">{{ props.item.ghi_chu }}</td>
            </template>
          </v-data-table>
          <p class="red--text text--darken-3 pt-4" style="text-align: center;" v-if="noti_latest_date != ''">{{noti_latest_date}}</p>
          <p class="red--blue text--blue-3 pt-4" style="text-align: center;" v-if="noti_respone_time != ''">{{noti_respone_time}}</p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>
    <div>
      <v-expansion-panel expand class="my-0 no-boder-top-detail-table">
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

        <div id="dialogPDFView"> </div>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import supportData from '../../store/support_data.json'
  const COMPONENT_NAME = 'jx-hanghai-detail'
  
  export default {
    name: COMPONENT_NAME,
    props: {
      'name': String,
      group_id: 0,
      thong_bao_api: '',
      ghi_chu_api: '',
      thong_tin_khai_bao_api: '',
      type: '',
      document_type_code: '',
      document_status_code: '',
      document_name: '',
      document_year: 0
    },
    data () {
      return {
        tenCoQuan: '',
        dialogPDF: false,
        detail_model: {},
        loadingTable: true,
        loadingTablePH: true,
        loading_process_btn: false,
        supportData: supportData,
        urlDownload: '',
        co_quan_title: 'các cơ quan chuyên nghành',
        dialog: false,
        loadingPDF: true,
        loading1: true,
        khaiBaoheaders: [
          {
            text: 'STT',
            align: 'left',
            sortable: false
          },
          {
            text: 'Thời gian khai báo',
            align: 'center',
            sortable: false
          },
          {
            text: 'Bản khai',
            align: 'left',
            sortable: false
          },
          {
            text: 'Lần gửi cuối',
            align: 'center',
            sortable: false
          },
          {
            text: 'Số giờ còn lại',
            align: 'center',
            sortable: false
          },
          {
            text: 'Trạng thái',
            align: 'center',
            sortable: false
          },
          {
            text: 'Ghi chú',
            align: 'left',
            sortable: false
          }
        ],
        khaiBaoItems: [
        ],
        pagination: {
          totalItems: 0
        },
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
        isKeHoach: false,
        isThuTuc: false,
        isKeToan: false
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$store.dispatch('loadInitResource').then(function (result) {
          let initData = result
          vm.isKeHoach = initData.user.isKeHoach
          vm.isThuTuc = initData.user.isThuTuc
          vm.isKeToan = initData.user.isKeToan
        })
      })
    },
    methods: {
      backtolist: function (keyType) {
        this.document_status_code = 0
        if (keyType === 'ke_hoach') {
          this.type = keyType
          this.$router.push('/danh-sach-ho-so/' + this.type + '/' + this.document_type_code + '/' + this.document_status_code)
        } else if (keyType === 'ke_toan') {
          this.$router.push('/danh-sach-phieu-thanh-toan/ke_toan/0')
        } else if (keyType === 'thu_tuc') {
          this.type = keyType
          this.$router.push('/danh-sach-ho-so/' + this.type + '/' + this.document_type_code + '/' + this.document_status_code)
        } else {
          this.$router.push('/danh-sach-ho-so/' + this.type + '/' + this.document_type_code + '/' + this.document_status_code)
        }
      },
      reloadDetail: function () {
        var vm = this
        vm.loading1 = true
        vm.detail_model = vm.$parent.detail_model
        vm.loading1 = false
      },
      reloadKhaiBao: function () {
        var vm = this
        let config = {
          'maBanKhai': vm.document_name,
          'documentYear': vm.document_year
        }
        vm.khaiBaoItems = []
        vm.loadingTable = true
        vm.$store.dispatch('loadKhaiBaoHoSo', config).then(function (result) {
          vm.khaiBaoItems = result.data
          vm.noti_respone_time = result.noti_respone_time
          vm.noti_latest_date = result.noti_latest_date
          vm.loadingTable = false
        })
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
      }
    }
  }
</script>
