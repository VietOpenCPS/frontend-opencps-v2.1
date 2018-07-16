<template>
  <div>
    <v-layout wrap class="menu_header_list" :class='{"no__border__bottom": btnDynamics === null || btnDynamics === undefined || btnDynamics === "undefined" || (btnDynamics !== null && btnDynamics !== undefined && btnDynamics !== "undefined" && btnDynamics.length === 0)}'>
      <v-flex xs12 class="px-2">
        <v-select
          :items="listThuTucHanhChinh"
          v-model="thuTucHanhChinhSelected"
          label="Thủ tục:"
          autocomplete
          placeholder="chọn thủ tục hành chính"
          item-text="serviceName"
          item-value="serviceConfigId"
          return-object
          :hide-selected="true"
          @change = "changeServiceConfigs"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout wrap v-if="loadingDynamicBtn">
      <v-flex xs12 sm6>
      </v-flex>
      <v-flex xs12 sm2>
       <content-placeholders class="mt-3">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      </v-flex>
      <v-flex xs12 sm2>
       <content-placeholders class="mt-3">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      </v-flex>
      <v-flex xs12 sm2>
       <content-placeholders class="mt-3">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      </v-flex>
    </v-layout>
    <div v-if="!loadingDynamicBtn" class="btn_wrap_actions">
      <v-btn color="primary" v-for="(item, index) in btnDynamics" v-bind:key="index" 
        v-on:click.native="btnActionEvent(null, item, index, true)" 
        v-if="String(item.form).indexOf('VIEW') < 0"
        :loading="loadingAction && index === indexAction"
        :disabled="loadingAction && index === indexAction"
      >
        {{item.title}}{{item.tiltle}}
        <span slot="loader">Loading...</span>
      </v-btn>
    </div>
    
    <v-data-table
        :headers="headers"
        :items="hosoDatas"
        :total-items="hosoDatasTotal"
        v-model="selected"
        item-key="dossierIdCTN"
        select-all
        class="table-landing table-bordered"
        hide-actions
      >
      <template slot="headerCell" slot-scope="props">
        <v-tooltip bottom>
          <span slot="activator">
            {{ props.header.text }}
          </span>
          <span>
            {{ props.header.text }}
          </span>
        </v-tooltip>
      </template>
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
            color="primary"
          ></v-checkbox>
        </td>
        <td>
          <content-placeholders v-if="loadingTable">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <span v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;">
            {{ hosoDatasPage * 15 - 15 + props.index + 1 }}
          </span>
        </td>

        <td v-for="(itemHeader, indexHeader) in headers" v-bind:key="indexHeader"
          :class="itemHeader['class_column']"
          v-if="itemHeader.hasOwnProperty('value')"
        >
          <content-placeholders v-if="loadingTable">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <span v-else @click="viewDetail(props.item, props.index)" style="cursor: pointer;">
            {{ props.item[itemHeader.value] }}
          </span>
        </td>
        <td class="text-xs-center px-0 py-0" v-if="!hideAction">
          <content-placeholders v-if="loadingTable">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-menu bottom left :nudge-left="50" :nudge-top="15" 
            v-if="!loadingTable && ((btnDynamics !== null || btnDynamics !== undefined || btnDynamics !== 'undefined') || 
              (btnDossierDynamics !== null || btnDossierDynamics !== undefined || btnDossierDynamics !== 'undefined'))">
            <v-btn class="mx-0 my-0" slot="activator" icon @click="processPullBtnDynamics(props.item)">
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in btnDossierDynamics" :key="i" @click="processPullBtnDetail(props.item, item, props.index)">
                <v-list-tile-title>{{ item.actionName }}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-for="(item, i) in btnStepsDynamics" :key="i" v-if="String(item.form) !== 'NEW'"
                @click="btnActionEvent(props.item, item, index, false)"
              >
                <v-list-tile-title>{{ item.title }}{{ item.tiltle }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-right layout wrap" style="position: relative;">
      <div class="flex pagging-table px-2"> 
        <tiny-pagination :total="hosoDatasTotal" :page="hosoDatasPage" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingData" ></tiny-pagination> 
      </div>
    </div>
    <v-dialog v-model="dialogAction" max-width="400" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title class="headline">{{itemAction.title}}{{itemAction.tiltle}}</v-card-title>
          <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogAction = false">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-progress-linear v-if="loadingAction" class="my-0" :indeterminate="true"></v-progress-linear>
          <v-card-text class="pb-0 pt-4">
            <v-layout wrap>
              <v-flex xs12 class="px-2 pb-3">
                <v-select
                  :items="listThuTucHanhChinh"
                  v-model="thuTucHanhChinhSelected"
                  label="Thủ tục:"
                  autocomplete
                  placeholder="chọn thủ tục hành chính"
                  item-text="serviceName"
                  item-value="serviceConfigId"
                  return-object
                  :hide-selected="true"
                  @change = "changeServiceConfigs"
                ></v-select>
              </v-flex>
              <v-flex xs12 class="px-2">
                <v-select
                  :items="listDichVu"
                  v-model="dichVuSelected"
                  label="Dịch vụ:"
                  autocomplete
                  placeholder="chọn dịch vụ"
                  item-text="optionName"
                  item-value="processOptionId"
                  return-object
                  :hide-selected="true"
                  :rules="[v => !!v || 'dịch vụ bắt buộc phải chọn.']"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogAction = false"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              Quay lại
              <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn color="primary" flat="flat" @click.native="doSubmitDialogAction(itemAction)"
              :loading="loadingAction"
              :disabled="loadingAction"
            >
              Đồng ý
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogActionProcess" max-width="900" transition="fade-transition" persistent>
      <v-card>
        <v-form ref="form" v-model="validProcess" lazy-validation>
          <v-card-title class="headline">{{itemAction.actionName}}</v-card-title>
          <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogActionProcess = false">
            <v-icon>clear</v-icon>
          </v-btn>
          <v-progress-linear v-if="loadingActionProcess" class="my-0" :indeterminate="true"></v-progress-linear>
          <v-card-text class="py-0 px-0">
            <v-layout wrap>
              <thong-tin-co-ban-ho-so v-if="dialogActionProcess" ref="thong-tin-co-ban-ho-so" :id="dossierId"></thong-tin-co-ban-ho-so>
              <!-- showFormBoSungThongTinNgan: {{showFormBoSungThongTinNgan}} <br/> -->
              <phan-cong v-if="dialogActionProcess && showPhanCongNguoiThucHien" v-model="assign_items" :type="type_assign" ></phan-cong>
              <!-- showTaoTaiLieuKetQua: {{showTaoTaiLieuKetQua}} <br/> -->
              <!-- showKyPheDuyetTaiLieu: {{showKyPheDuyetTaiLieu}} <br/> -->
              <tra-ket-qua v-if="dialogActionProcess && showTraKetQua" :resultFiles="returnFiles"></tra-ket-qua>
              <xac-nhan-thu-phi v-if="dialogActionProcess && showXacNhanThuPhi" :payments="payments" :payment_type="payment_type"></xac-nhan-thu-phi>
              <!-- showThucHienThanhToanDienTu: {{showThucHienThanhToanDienTu}} <br/> -->
              <y-kien-can-bo v-if="dialogActionProcess && showYkienCanBoThucHien" :user_note="userNote"></y-kien-can-bo>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat="flat" @click.native="processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)"
              :loading="loadingActionProcess"
              :disabled="loadingActionProcess"
            >
            Xác nhận
            <span slot="loader">Loading...</span>
            </v-btn>
            <v-btn color="red darken-3" flat="flat" @click.native="dialogActionProcess = false"
              :loading="loadingActionProcess"
              :disabled="loadingActionProcess"
            >
            Quay lại
            <span slot="loader">Loading...</span>
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPDF" max-width="900" transition="fade-transition">
      <v-card>
        <v-card-title class="headline">{{itemAction.title}}{{itemAction.tiltle}}</v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialogPDF = false">
          <v-icon>clear</v-icon>
        </v-btn>
        <div v-if="dialogPDFLoading" style="
            min-height: 400px;
            text-align: center;
            margin: auto;
            padding: 25%;
        ">
          <v-progress-circular
            :size="100"
            :width="1"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <iframe v-show="!dialogPDFLoading" id="dialogPDFPreview" src="" type="application/pdf" width="100%" height="100%" style="overflow: auto;min-height: 400px;" frameborder="0">
        </iframe>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_statusAction" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title class="headline">
          Trạng thái xử lý
        </v-card-title>
        <v-btn icon dark class="mx-0 my-0 absolute__btn_panel mr-2" @click.native="dialog_statusAction = false">
            <v-icon>clear</v-icon>
          </v-btn>
        <v-card-text style="max-height: 350px">
          <div v-for="(item, index) in dossierSelected" v-bind:key="item.dossierIdCTN">
            <v-layout wrap class="py-1 align-center row-list-style" style="border-bottom: 1px solid #ddd;position:relative"> 
              <v-flex xs11>
                <span class="text-bold" style="position: absolute;">{{index + 1}}.</span> 
                <div class="ml-4">{{item.dossierIdCTN}} - {{item.serviceName}}</div>
              </v-flex>
              <v-flex xs1 class="text-right">
                <v-tooltip top v-if="item.statusAction">
                  <v-icon color="primary" slot="activator">
                    check
                  </v-icon>
                  <span>Thành công</span>
                </v-tooltip>
                <v-tooltip top v-else>
                  <v-icon color="red darken-3" slot="activator">
                    clear
                  </v-icon>
                  <span>Thất bại</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click.native="resend" 
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            Thử lại &nbsp;
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="red darken-3" flat="flat" @click.native="dialog_statusAction = false"
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            Thoát &nbsp;
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <v-btn color="primary" @click.native="dialog_statusAction = true">
      TEST StatusAction &nbsp;
      <v-icon>save</v-icon>
    </v-btn> -->
  </div>
</template>

<script>
import router from '@/router'
import TinyPagination from './pagging/hanghai_pagination.vue'
import ThongTinCoBanHoSo from './form_xu_ly/ThongTinCoBanHoSo.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import TraKetQua from './form_xu_ly/TraKetQua.vue'
import XacNhanThuPhi from './form_xu_ly/XacNhanThuPhi.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination,
    'thong-tin-co-ban-ho-so': ThongTinCoBanHoSo,
    'phan-cong': PhanCong,
    'tra-ket-qua': TraKetQua,
    'xac-nhan-thu-phi': XacNhanThuPhi,
    'y-kien-can-bo': YkienCanBoThucHien
  },
  data: () => ({
    /* data PhanCongThucHien */
    type_assign: '',
    assign_items: [
      {
        userId: 101,
        userName: 'Trịnh Công Trình',
        moderator: 0,
        assigned: 1
      },
      {
        userId: 102,
        userName: 'Nguyễn Văn Nam',
        moderator: 0,
        assigned: 0
      },
      {
        userId: 103,
        userName: 'Trần Minh Quang',
        moderator: 0,
        assigned: 1
      }
    ],
    /* data TraKetQua */
    returnFiles: [],
    /* data XacNhanThuPhi */
    payments: {},
    payment_type: '',
    /* */
    dialog_statusAction: false,
    dossierSelected: [
      {
        dossierIdCTN: '18ACE289',
        serviceName: 'Đăng ký, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất lần đầu đối với tài sản gắn liền với đất mà chủ sở hữu không đồng thời là người sử dụng đất',
        statusAction: false
      },
      {
        dossierIdCTN: '18EC6501',
        serviceName: 'Thủ tục Điều chỉnh quyết định thu hồi đất, giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất của Thủ tướng Chính phủ đã ban hành trước ngày 01/7/2004',
        statusAction: true
      },
      {
        dossierIdCTN: '18EC6312',
        serviceName: 'Thủ tục Điều chỉnh quyết định thu hồi đất, giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất của Thủ tướng Chính phủ đã ban hành trước ngày 01/7/2004',
        statusAction: false
      },
      {
        dossierIdCTN: '18ACE299',
        serviceName: 'Đăng ký, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất lần đầu đối với tài sản gắn liền với đất mà chủ sở hữu không đồng thời là người sử dụng đất',
        statusAction: false
      },
      {
        dossierIdCTN: '20AA6501',
        serviceName: 'Thủ tục Điều chỉnh quyết định thu hồi đất, giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất của Thủ tướng Chính phủ đã ban hành trước ngày 01/7/2004',
        statusAction: true
      },
      {
        dossierIdCTN: '20EC6312',
        serviceName: 'Thủ tục Điều chỉnh quyết định thu hồi đất, giao đất, cho thuê đất, cho phép chuyển mục đích sử dụng đất của Thủ tướng Chính phủ đã ban hành trước ngày 01/7/2004',
        statusAction: false
      }
    ],
    dossierId: 0,
    valid: true,
    isCallBack: true,
    trangThaiHoSoList: null,
    listDichVu: [],
    dichVuSelected: null,
    btnDynamics: [],
    btnDossierDynamics: [],
    btnStepsDynamics: [],
    loading: true,
    headers: [],
    hideAction: false,
    hosoDatas: [],
    hosoDatasTotal: 0,
    hosoDatasPage: 1,
    selected: [],
    listThuTucHanhChinh: [],
    thuTucHanhChinhSelected: null,
    govAgencyCode: '',
    serviceCode: '',
    templateNo: '',
    dialogAction: false,
    loadingAction: false,
    dialogActionProcess: false,
    loadingActionProcess: false,
    validProcess: false,
    indexAction: -1,
    itemAction: {
      title: ''
    },
    showThongTinCoBanHoSo: false,
    showYkienCanBoThucHien: false,
    showFormBoSungThongTinNgan: false,
    showPhanCongNguoiThucHien: false,
    showTaoTaiLieuKetQua: false,
    showKyPheDuyetTaiLieu: false,
    showTraKetQua: false,
    showXacNhanThuPhi: false,
    showThucHienThanhToanDienTu: false,
    dossierItemDialogPick: null,
    itemDialogPick: null,
    resultDialogPick: null,
    indexDialogPick: 0,
    userNote: 0,
    dialogPDF: false,
    dialogPDFLoading: true
  }),
  computed: {
    loadingDynamicBtn () {
      return this.$store.getters.loadingDynamicBtn
    },
    loadingTable () {
      return this.$store.getters.loadingTable
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('page') && query['page'] !== 1) {
        vm.hosoDatasPage = query['page']
      } else {
        vm.hosoDatasPage = 1
      }
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
        vm.isCallBack = false
        vm.processListTTHC(currentQuery)
        if (vm.trangThaiHoSoList === null) {
          vm.$store.commit('setLoadingDynamicBtn', true)
          setTimeout(() => {
            vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
              vm.btnDynamics = []
              vm.trangThaiHoSoList = result
              vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
              if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
                vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
              }
              if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
                vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
              }
              let btnDynamicsOnlySteps = []
              let btnDynamicsView = []
              for (let key in vm.btnDynamics) {
                if (vm.btnDynamics[key].hasOwnProperty('onlySteps')) {
                  btnDynamicsOnlySteps.push(vm.btnDynamics[key])
                } else {
                  btnDynamicsView.push(vm.btnDynamics[key])
                }
              }
              vm.btnDynamics = []
              vm.btnDynamics = btnDynamicsView
              vm.btnStepsDynamics = []
              if (currentQuery.hasOwnProperty('step')) {
                for (let key in vm.trangThaiHoSoList[vm.index]['items']) {
                  let currentStep = vm.trangThaiHoSoList[vm.index]['items'][key]
                  if (String(currentStep.stepCode) === String(currentQuery.step)) {
                    let buttonConfig = currentStep.buttonConfig
                    if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                      vm.btnStepsDynamics = JSON.parse(buttonConfig)['buttons']
                      for (let key in btnDynamicsOnlySteps) {
                        for (var i = 0; i < btnDynamicsOnlySteps[key].onlySteps.length; i++) {
                          if (String(btnDynamicsOnlySteps[key].onlySteps[i]) === String(currentStep.stepCode)) {
                            vm.btnDynamics.push(btnDynamicsOnlySteps[key])
                          }
                        }
                      }
                    } else {
                      vm.btnStepsDynamics = []
                    }
                    break
                  }
                }
              }
              vm.$store.commit('setLoadingDynamicBtn', false)
            })
          }, 200)
        }
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      console.log('currentQuery watch router', currentQuery)
      if (currentQuery.hasOwnProperty('q')) {
        vm.btnDynamics = []
        vm.$store.commit('setLoadingDynamicBtn', true)
        vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
          vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
          vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
        }
        let btnDynamicsOnlySteps = []
        let btnDynamicsView = []
        for (let key in vm.btnDynamics) {
          if (vm.btnDynamics[key].hasOwnProperty('onlySteps')) {
            btnDynamicsOnlySteps.push(vm.btnDynamics[key])
          } else {
            btnDynamicsView.push(vm.btnDynamics[key])
          }
        }
        vm.btnDynamics = []
        vm.btnDynamics = btnDynamicsView
        vm.btnStepsDynamics = []
        if (currentQuery.hasOwnProperty('step')) {
          for (let key in vm.trangThaiHoSoList[vm.index]['items']) {
            let currentStep = vm.trangThaiHoSoList[vm.index]['items'][key]
            if (String(currentStep.stepCode) === String(currentQuery.step)) {
              let buttonConfig = currentStep.buttonConfig
              if (buttonConfig !== '' && buttonConfig !== undefined && buttonConfig !== 'undefined' && String(buttonConfig).indexOf('{') !== -1 && String(buttonConfig).indexOf('}') !== -1) {
                vm.btnStepsDynamics = JSON.parse(buttonConfig)['buttons']
                for (let key in btnDynamicsOnlySteps) {
                  for (var i = 0; i < btnDynamicsOnlySteps[key].onlySteps.length; i++) {
                    if (String(btnDynamicsOnlySteps[key].onlySteps[i]) === String(currentStep.stepCode)) {
                      vm.btnDynamics.push(btnDynamicsOnlySteps[key])
                    }
                  }
                }
              } else {
                vm.btnStepsDynamics = []
              }
              break
            }
          }
        }
        if (currentQuery.hasOwnProperty('page')) {
          vm.hosoDatasPage = currentQuery.page
        } else {
          vm.hosoDatasPage = 1
        }
        vm.$store.commit('setLoadingDynamicBtn', false)
        console.log('watch: landing')
        if (vm.listThuTucHanhChinh === null || vm.listThuTucHanhChinh === undefined || (vm.listThuTucHanhChinh !== null && vm.listThuTucHanhChinh !== undefined && vm.listThuTucHanhChinh.length === 0)) {
          vm.processListTTHC(currentQuery)
        } else {
          vm.doLoadingDataHoSo()
        }
      }
    }
  },
  methods: {
    expDataPC () {
      // this.data_pc = data
      console.log('dataPKKKK', this.assign_items)
    },
    processListTTHC (currentQuery) {
      let vm = this
      vm.$store.dispatch('loadListThuTucHanhChinh').then(function (result) {
        vm.listThuTucHanhChinh = result
        if (currentQuery.hasOwnProperty('service_config') && String(currentQuery.service_config) !== '0') {
          for (let key in vm.listThuTucHanhChinh) {
            if (String(vm.listThuTucHanhChinh[key].serviceConfigId) === String(currentQuery.service_config)) {
              vm.thuTucHanhChinhSelected = vm.listThuTucHanhChinh[key]
              if (vm.thuTucHanhChinhSelected !== null && vm.thuTucHanhChinhSelected !== undefined && vm.thuTucHanhChinhSelected.hasOwnProperty('options')) {
                vm.govAgencyCode = vm.thuTucHanhChinhSelected.govAgencyCode
                vm.serviceCode = vm.thuTucHanhChinhSelected.serviceCode
                if (currentQuery.hasOwnProperty('template_no')) {
                  vm.listDichVu = vm.thuTucHanhChinhSelected.options
                  for (let keyDv in vm.listDichVu) {
                    if (vm.listDichVu[keyDv].templateNo === currentQuery.template_no) {
                      vm.dichVuSelected = vm.listDichVu[keyDv]
                      vm.templateNo = vm.dichVuSelected.templateNo
                    }
                  }
                } else {
                  vm.listDichVu = []
                  vm.dichVuSelected = null
                  vm.govAgencyCode = ''
                  vm.serviceCode = ''
                  vm.templateNo = ''
                }
              }
              break
            }
          }
        } else {
          vm.thuTucHanhChinhSelected = null
          vm.dichVuSelected = null
          vm.govAgencyCode = ''
          vm.serviceCode = ''
          vm.templateNo = ''
        }
        vm.doLoadingDataHoSo()
      })
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    doLoadingDataHoSo () {
      let vm = this
      let currentQuery = router.history.current.query
      console.log('currentQuery', currentQuery)
      if (currentQuery.hasOwnProperty('q')) {
        let filter = {
          queryParams: currentQuery.q,
          page: vm.hosoDatasPage,
          agency: vm.govAgencyCode,
          service: vm.serviceCode,
          template: vm.templateNo
        }
        /*  test Local */
        /* let filter = {
          queryParams: 'http://127.0.0.1:8081' + currentQuery.q,
          page: vm.hosoDatasPage,
          agency: vm.govAgencyCode,
          service: vm.serviceCode,
          template: vm.templateNo
        } */
        vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
          vm.hosoDatas = result.data
          vm.hosoDatasTotal = result.total
        })
      }
    },
    changeServiceConfigs (item) {
      if (item.hasOwnProperty('options')) {
        this.listDichVu = item.options
      } else {
        this.listDichVu = []
      }
      if (this.listDichVu !== null && this.listDichVu !== undefined && this.listDichVu !== 'undefined' && this.listDichVu.length > 0) {
        this.dichVuSelected = this.listDichVu[0]
        this.templateNo = this.dichVuSelected.templateNo
      } else {
        this.dichVuSelected = null
      }
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['service_config'] = ''
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'service_config=' + item.serviceConfigId
      if (this.listDichVu !== null && this.listDichVu !== undefined && this.listDichVu !== 'undefined' && this.listDichVu.length > 0) {
        queryString += '&template_no=' + this.dichVuSelected.templateNo
      } else {
        vm.templateNo = ''
      }
      vm.govAgencyCode = item.govAgencyCode
      vm.serviceCode = item.serviceCode
      vm.$router.push({
        path: current.path + queryString
      })
    },
    btnActionEvent (dossierItem, item, index, isGroup) {
      let vm = this
      vm.itemAction = item
      vm.indexAction = index
      if (String(item.form) === 'NEW') {
        let isOpenDialog = true
        if (vm.dichVuSelected !== null && vm.dichVuSelected !== undefined && vm.dichVuSelected !== 'undefined' && vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu.length === 1) {
          isOpenDialog = false
        }
        if (isOpenDialog) {
          vm.dialogAction = true
        } else {
          vm.doCreateDossier()
        }
      } else if (String(item.form) === 'UPDATE') {
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + dossierItem.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'ADD') {
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/bo-sung-ho-so/' + dossierItem.dossierId,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'COPY') {
        vm.doCopy(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'CANCEL') {
        vm.doCancel(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_01') {
        // Xem trước phiếu của một hồ sơ
        vm.doPrint01(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_02') {
        // Xem trước phiếu gộp của nhiều hồ sơ
        vm.doPrint02(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PRINT_03') {
        // In văn bản mới nhất đã phê duyệt
        vm.doPrint03(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'GUIDE') {
        vm.doGuiding(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'PREVIEW') {
        vm.doPreview(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'ACTIONS') {
        vm.doActions(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'DELETE') {
        vm.doDeleteDossier(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'ROLLBACK_01') {
        let result = {
          actionCode: 9000
        }
        vm.processAction(dossierItem, item, result, index, true)
      } else if (String(item.form) === 'ROLLBACK_02') {
        let result = {
          actionCode: 9000
        }
        vm.processAction(dossierItem, item, result, index, true)
      } else if (String(item.form) === 'OVERDUE') {
        let result = {
          actionCode: 8500
        }
        vm.processAction(dossierItem, item, result, index, true)
      } else if (String(item.form) === 'BETIMES') {
        let result = {
          actionCode: 8400
        }
        vm.processAction(dossierItem, item, result, index, true)
      }
    },
    doPrint01 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint01', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doPrint02 (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          document: item.document,
          'serviceCode': vm.thuTucHanhChinhSelected.serviceCode,
          'govAgencyCode': vm.thuTucHanhChinhSelected.govAgencyCode,
          dossiers: JSON.stringify(vm.selected)
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doPrint02', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      }
    },
    doPrint03 (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doGuiding (dossierItem, item, index, isGroup) {
      let vm = this
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelected.serviceConfigId
        }
        vm.dialogPDFLoading = true
        vm.dialogPDF = true
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.dialogPDFLoading = false
          document.getElementById('dialogPDFPreview').src = result
        })
      }
    },
    doPreview (dossierItem, item, index, isGroup) {
      let vm = this
      vm.dialogPDFLoading = true
      vm.dialogPDF = true
      let filter = {
        dossierId: dossierItem.dossierId,
        document: item.document
      }
      vm.$store.dispatch('doPrint03', filter).then(function (result) {
        vm.dialogPDFLoading = false
        document.getElementById('dialogPDFPreview').src = result
      })
    },
    doActions (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      console.log('doActions', item.action)
      let result = {
        actionCode: item.action
      }
      if (isGroup) {
        console.log(vm.selected)
        for (let key in vm.selected) {
          let actionDossierItem = vm.selected[key]
          vm.processAction(actionDossierItem, item, result, index, false)
        }
        router.push({
          path: vm.$router.history.current.path,
          query: {
            recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
            q: currentQuery['q']
          }
        })
      }
    },
    doCopy (dossierItem, item, index, isGroup) {
      let vm = this
      let filter = {
        dossierId: dossierItem.dossierId
      }
      vm.loadingAction = true
      vm.$store.dispatch('doCopy', filter).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      })
    },
    doCancel (dossierItem, item, index, isGroup) {
      let vm = this
      vm.loadingAction = true
      if (isGroup) {
        console.log(vm.selected)
      } else {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        vm.$store.dispatch('doCancel', filter).then(function (result) {
          vm.loadingAction = false
          vm.indexAction = -1
          router.push({
            path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
            query: vm.$router.history.current.query
          })
        })
      }
    },
    doDeleteDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let x = confirm('Bạn có muốn thực hiện hành động này?')
      if (x) {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        let currentQuery = vm.$router.history.current.query
        if (isGroup) {
          console.log(vm.selected)
        } else {
          vm.$store.dispatch('deleteDossier', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          })
        }
      } else {
        return false
      }
    },
    doCreateDossier () {
      let vm = this
      let data = {
        serviceCode: vm.serviceCode,
        govAgencyCode: vm.govAgencyCode,
        templateNo: vm.templateNo,
        originality: 3
      }
      vm.loadingAction = true
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
        router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      })
    },
    doSubmitDialogAction (item) {
      let vm = this
      if (vm.$refs.form.validate()) {
        console.log('yes-----')
        vm.doCreateDossier()
      }
    },
    processPullBtnDynamics (item) {
      let vm = this
      let filter = {
        dossierId: item.dossierId
      }
      vm.dossierId = item.dossierId
      vm.$store.dispatch('pullNextactions', filter).then(function (result) {
        vm.btnDossierDynamics = result
      })
    },
    processAction (dossierItem, item, result, index, isConfirm) {
      let vm = this
      let filter = {
        dossierId: dossierItem.dossierId,
        actionCode: result.actionCode
      }
      vm.dossierId = dossierItem.dossierId
      let currentQuery = vm.$router.history.current.query
      vm.loadingActionProcess = true
      if (isConfirm) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x) {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          })
        } else {
          return false
        }
      } else {
        vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
          vm.dialogActionProcess = false
          vm.loadingActionProcess = false
          if (String(item.form) === 'ACTIONS') {
            // get dossier submit fail and show on dialog
          } else {
            router.push({
              path: vm.$router.history.current.path,
              query: {
                recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                q: currentQuery['q']
              }
            })
          }
        })
      }
    },
    processPullBtnDetailRouter (dossierItem, item, result, index) {
      console.log('result Nextaction', result)
      let vm = this
      let isPopup = false
      vm.dossierId = dossierItem.dossierId
      vm.showYkienCanBoThucHien = false
      vm.showFormBoSungThongTinNgan = false
      vm.showPhanCongNguoiThucHien = false
      vm.showTaoTaiLieuKetQua = false
      vm.showKyPheDuyetTaiLieu = false
      vm.showTraKetQua = false
      vm.showXacNhanThuPhi = false
      vm.showThucHienThanhToanDienTu = false
      vm.dossierItemDialogPick = dossierItem
      vm.itemDialogPick = item
      vm.resultDialogPick = result
      vm.indexDialogPick = index
      vm.userNote = 0
      if (result !== null && result !== undefined && result !== 'undefined' &&
        (result.hasOwnProperty('userNote') || result.hasOwnProperty('extraForm') || result.hasOwnProperty('allowAssignUser') ||
        result.hasOwnProperty('createFiles') || result.hasOwnProperty('eSignature') || result.hasOwnProperty('returnFiles') ||
        result.hasOwnProperty('payment'))) {
        if (result.hasOwnProperty('userNote') && (result.userNote === 1 || result.userNote === '1' || result.userNote === 2 || result.userNote === '2')) {
          isPopup = true
          vm.showYkienCanBoThucHien = true
          vm.userNote = result.userNote
        }
        if (result.hasOwnProperty('extraForm') && result.extraForm) {
          isPopup = true
          vm.showFormBoSungThongTinNgan = true
        }
        if (result.hasOwnProperty('allowAssignUser') && result.allowAssignUser !== 0) {
          vm.assign_items = result.toUsers
          vm.type_assign = result.allowAssignUser
          isPopup = true
          vm.showPhanCongNguoiThucHien = true
        }
        if (result.hasOwnProperty('returnFiles') && result.createFiles !== null && result.createFiles !== undefined && result.createFiles !== 'undefined' && result.createFiles.length > 0) {
          isPopup = true
          vm.showTaoTaiLieuKetQua = true
        }
        if (result.hasOwnProperty('eSignature') && result.eSignature) {
          isPopup = true
          vm.showKyPheDuyetTaiLieu = true
        }
        if (result.hasOwnProperty('returnFiles') && result.returnFiles !== null && result.returnFiles !== undefined && result.returnFiles !== 'undefined' && result.returnFiles.length > 0) {
          isPopup = true
          vm.showTraKetQua = true
          vm.returnFiles = result.returnFiles
        }
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment === 5) {
          isPopup = true
          vm.showXacNhanThuPhi = true
          vm.payments = result.payment
          vm.payment_type = result.payment.requestPayment
        }
      }
      if (isPopup) {
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
      } else {
        vm.processAction(dossierItem, item, result, index, true)
      }
    },
    processPullBtnDetail (dossierItem, item, index) {
      let vm = this
      vm.itemAction = item
      let filter = {
        dossierId: dossierItem.dossierId,
        actionId: item.processActionId
      }
      vm.dossierId = dossierItem.dossierId
      vm.loadingActionProcess = true
      vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
        vm.processPullBtnDetailRouter(dossierItem, item, result, index)
      })
    },
    goBack () {
      window.history.back()
    },
    resend () {
      alert('Thử lại')
    },
    viewDetail (item, indexItem) {
      router.push('/danh-sach-ho-so/' + this.index + '/chi-tiet-ho-so/' + item['dossierId'])
    }
  }
}
</script>
