<template>
  <div>
    à adf ádf ádf sdf
    <v-layout wrap>
      <div>
        adf
      </div>
    </v-layout>
  </div>
</template>

<script>
import Vue from 'vue'
import TemplateRendering from './pagging/template_rendering.vue'
import TinyPagination from './pagging/hanghai_pagination.vue'
import ThongTinCoBanHoSo from './form_xu_ly/ThongTinCoBanHoSo.vue'
import PhanCong from './form_xu_ly/PhanCongNguoiThucHien.vue'
import TraKetQua from './form_xu_ly/TraKetQua.vue'
import XacNhanThuPhi from './form_xu_ly/XacNhanThuPhi.vue'
import ThuPhi from './form_xu_ly/FeeDetail.vue'
import YkienCanBoThucHien from './form_xu_ly/YkienCanBoThucHien.vue'
import support from '../store/support.json'
import FormBoSungThongTinNgan from './form_xu_ly/FormBoSungThongTinNgan.vue'

export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination,
    'thong-tin-co-ban-ho-so': ThongTinCoBanHoSo,
    'phan-cong': PhanCong,
    'tra-ket-qua': TraKetQua,
    'xac-nhan-thu-phi': XacNhanThuPhi,
    'thu-phi': ThuPhi,
    'y-kien-can-bo': YkienCanBoThucHien,
    'template-rendering': TemplateRendering,
    'form-bo-sung-thong-tin': FormBoSungThongTinNgan
  },
  data: () => ({
    isAdminSuper: false,
    actionId: '',
    dossierIdSelected: '',
    dossierCountingShow: false,
    dossierCounting: [],
    advSearchToolsSelected: [],
    advSearchTools: support.advSearchTools,
    advSearchItems: [],
    advObjectSearch: {},
    menusss: false,
    itemFilterSupport: {
      years: [
        {
          'value': '',
          'name': 'Lọc theo năm'
        },
        {
          'value': '2017',
          'name': 'năm 2017'
        },
        {
          'value': '2018',
          'name': 'năm 2018'
        },
        {
          'value': '2019',
          'name': 'năm 2019'
        }
      ],
      year: '',
      months: [
        {
          'value': '',
          'name': 'Lọc theo tháng'
        },
        {
          'value': '1',
          'name': 'tháng 1'
        },
        {
          'value': '2',
          'name': 'tháng 2'
        },
        {
          'value': '3',
          'name': 'tháng 3'
        },
        {
          'value': '4',
          'name': 'tháng 4'
        },
        {
          'value': '5',
          'name': 'tháng 5'
        },
        {
          'value': '6',
          'name': 'tháng 6'
        },
        {
          'value': '7',
          'name': 'tháng 7'
        },
        {
          'value': '8',
          'name': 'tháng 8'
        },
        {
          'value': '9',
          'name': 'tháng 9'
        },
        {
          'value': '10',
          'name': 'tháng 10'
        },
        {
          'value': '11',
          'name': 'tháng 11'
        },
        {
          'value': '12',
          'name': 'tháng 12'
        }
      ],
      month: '',
      days: [],
      day: '',
      tops: [
        {
          'value': '',
          'name': 'toàn bộ'
        },
        {
          'value': 'overdue',
          'name': 'hồ sơ đang quá hạn cần giải quyết'
        },
        {
          'value': 'delay',
          'name': 'chậm hạn trả'
        },
        {
          'value': 'coming',
          'name': 'sắp đến hạn'
        }
      ],
      top: '',
      statusLists: [],
      status: '',
      substatusLists: [
        {
          'itemCode': '',
          'itemName': 'toàn bộ'
        }
      ],
      substatus: '',
      agencyLists: [],
      agency: '',
      serviceLists: [],
      service: '',
      domainLists: [],
      domain: '',
      keyword: '',
      register: ''
    },
    itemFilterKey: ['year', 'month', 'day', 'top', 'status', 'substatus', 'agency', 'service', 'domain', 'keyword', 'register'],
    menuType: 0,
    type_assign: '',
    assign_items: [],
    /* data TraKetQua */
    returnFiles: [],
    /* data XacNhanThuPhi */
    payments: '',
    viaPortalDetail: 0,
    /* */
    countSelected: 0,
    statusFailed: 0,
    dialog_statusAction: false,
    dialog_printGuide: false,
    dialog_extraForm: false,
    validGuide: false,
    applicantNameGuide: '',
    applicantEmailGuide: '',
    applicantTelNoGuide: '',
    applicantAddressGuide: '',
    dossierSelected: [
      {
        dossierNo: '18ACE289',
        serviceName: 'Đăng ký, cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất lần đầu đối với tài sản gắn liền với đất mà chủ sở hữu không đồng thời là người sử dụng đất',
        statusAction: false
      }
    ],
    /** */
    buttonConfigItem: {},
    /* ý kiến cán bộ */
    textNote: '',
    /** */
    thongtinhoso: {},
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
    hosoTotalPage: 0,
    selectedDoAction: [],
    selectMultiplePage: [],
    selected: [],
    listThuTucHanhChinh: [],
    listThuTuc: [],
    thuTucHanhChinhSelected: null,
    thuTucHanhChinhSelectedGuide: null,
    listLinhVuc: [],
    linhVucSelected: null,
    listDichVuGuide: [],
    dichVuSelectedGuide: null,
    templateNoGuide: '',
    domainCode: '',
    govAgencyCode: '',
    serviceCode: '',
    templateNo: '',
    dossierNoKey: '',
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
    showThuPhi: false,
    showThucHienThanhToanDienTu: false,
    dossierItemDialogPick: null,
    itemDialogPick: null,
    resultDialogPick: null,
    indexDialogPick: 0,
    userNote: 0,
    dialogPDF: false,
    dialogPDFLoading: true,
    filterForm: null,
    checkSelectAll: false,
    titleLanding: '',
    currentQueryState: ''
  }),
  computed: {
    loadingDynamicBtn () {
      return this.$store.getters.loadingDynamicBtn
    },
    loadingTable () {
      return this.$store.getters.loadingTable
    },
    originality () {
      var vm = this
      return vm.getOriginality()
    },
    currentUser () {
      return this.$store.getters.loadingInitData.user
    },
    activeLoadingDataHoSo () {
      return this.$store.getters.activeLoadingDataHoSo
    }
  },
  created () {
    var vm = this
    vm.selectMultiplePage = []
    vm.checkSelectAll = (vm.menuType !== 3 && vm.originality !== 1)
    vm.itemFilterSupport['days'] = [{'value': '', 'name': 'Lọc theo ngày'}]
    for (let i = 1; i <= 31; i++) {
      let item = {'value': i, 'name': 'Ngày ' + i}
      vm.itemFilterSupport.days.push(item)
    }
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      let currentQuery = vm.$router.history.current.query
      vm.currentQueryState = query
      if (query.hasOwnProperty('page') && query['page'] !== '1') {
        vm.hosoDatasPage = parseInt(query['page'])
      } else {
        vm.hosoDatasPage = 1
      }
      // <--- set State advSearch
      vm.setStateAdvSearch(currentQuery)
      // ---->
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
      let currentParams = vm.$router.history.current.params
      let currentQuery = vm.$router.history.current.query
      vm.currentQueryState = currentQuery
      if (currentParams.hasOwnProperty('index') && vm.isCallBack) {
        vm.isCallBack = false
        vm.$store.commit('setLoadingDynamicBtn', true)
        setTimeout(() => {
          vm.$store.dispatch('loadMenuConfigToDo').then(function (result) {
            vm.btnDynamics = []
            vm.trangThaiHoSoList = result
            vm.menuType = parseInt(vm.trangThaiHoSoList[vm.index]['menuType'])
            vm.checkSelectAll = (vm.menuType !== 3 && vm.originality !== 1)
            vm.processListTTHC(currentQuery)
            vm.processListDomain(currentQuery)
            // console.log('vm.trangThaiHoSoList[vm.index]', vm.trangThaiHoSoList[vm.index])
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('headers')) {
              vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
            }
            if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
              vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
            }
            if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
              vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
            }
            if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('layout_view')) {
              vm.filterForm = vm.trangThaiHoSoList[vm.index]['buttonConfig']['layout_view']
              // console.log('filterForm11111', vm.trangThaiHoSoList[vm.index]['buttonConfig'])
              // console.log('filterForm', vm.filterForm)
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
                  for (let keyOnlyStep in btnDynamicsOnlySteps) {
                    for (var i = 0; i < btnDynamicsOnlySteps[keyOnlyStep].onlySteps.length; i++) {
                      if (String(btnDynamicsOnlySteps[keyOnlyStep].onlySteps[i]) === String(currentStep.stepCode)) {
                        vm.btnDynamics.push(btnDynamicsOnlySteps[keyOnlyStep])
                      }
                    }
                  }
                  break
                }
              }
            }
            vm.$store.commit('setLoadingDynamicBtn', false)
          })
        }, 200)
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      let currentQueryOld = oldRoute.query
      vm.currentQueryState = currentQuery
      if (currentQuery.hasOwnProperty('q')) {
        vm.btnDynamics = []
        vm.$store.commit('setLoadingDynamicBtn', true)
        vm.menuType = vm.trangThaiHoSoList[vm.index]['menuType']
        vm.checkSelectAll = (vm.menuType !== 3 && vm.originality !== 1)
        // console.log('vm.trangThaiHoSoList[vm.index]', vm.trangThaiHoSoList[vm.index])
        vm.headers = vm.trangThaiHoSoList[vm.index]['tableConfig']['headers']
        if (vm.trangThaiHoSoList[vm.index]['tableConfig'] !== null && vm.trangThaiHoSoList[vm.index]['tableConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['tableConfig'].hasOwnProperty('hideAction')) {
          vm.hideAction = vm.trangThaiHoSoList[vm.index]['tableConfig']['hideAction']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('buttons')) {
          vm.btnDynamics = vm.trangThaiHoSoList[vm.index]['buttonConfig']['buttons']
        }
        if (vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== null && vm.trangThaiHoSoList[vm.index]['buttonConfig'] !== undefined && vm.trangThaiHoSoList[vm.index]['buttonConfig'].hasOwnProperty('layout_view')) {
          vm.filterForm = vm.trangThaiHoSoList[vm.index]['buttonConfig']['layout_view']
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
              for (let keyOnlySteps in btnDynamicsOnlySteps) {
                for (var i = 0; i < btnDynamicsOnlySteps[keyOnlySteps].onlySteps.length; i++) {
                  if (String(btnDynamicsOnlySteps[keyOnlySteps].onlySteps[i]) === String(currentStep.stepCode)) {
                    vm.btnDynamics.push(btnDynamicsOnlySteps[keyOnlySteps])
                  }
                }
              }
              break
            }
          }
          // console.log('btnDynamics', vm.btnDynamics)
        }
        if (currentQuery.hasOwnProperty('page')) {
          vm.hosoDatasPage = parseInt(currentQuery.page)
          if (currentQuery.page === currentQueryOld['page']) {
            vm.selectMultiplePage = []
          }
        } else {
          vm.hosoDatasPage = 1
          vm.selectMultiplePage = []
        }
        vm.$store.commit('setLoadingDynamicBtn', false)
        if (vm.listLinhVuc === null || vm.listLinhVuc === undefined || (vm.listLinhVuc !== null && vm.listLinhVuc !== undefined && vm.listLinhVuc.length === 0)) {
          vm.processListDomain(currentQuery)
        } else {
          for (let key in vm.listLinhVuc) {
            if (String(vm.listLinhVuc[key]['domainCode']) === String(currentQuery.domain)) {
              vm.linhVucSelected = vm.listLinhVuc[key]
              vm.domainCode = vm.linhVucSelected['domainCode']
            }
          }
        }
        if (vm.listThuTucHanhChinh === null || vm.listThuTucHanhChinh === undefined || (vm.listThuTucHanhChinh !== null && vm.listThuTucHanhChinh !== undefined && vm.listThuTucHanhChinh.length === 0)) {
          vm.processListTTHC(currentQuery)
        } else {
          vm.doLoadingDataHoSo()
        }
        // <--- set State advSearch
        vm.setStateAdvSearch(currentQuery)
        // ---->
      }
    },
    activeLoadingDataHoSo (val) {
      var vm = this
      setTimeout(function () {
        vm.doLoadingDataHoSo()
      }, 100)
    },
    selectMultiplePage: {
      handler: function (val) {
        let vm = this
        if (val.length > 0) {
          vm.selectedDoAction = []
          for (let key in val) {
            vm.selectedDoAction = vm.selectedDoAction.concat(val[key]['selected'])
          }
        } else {
          vm.selectedDoAction = []
        }
        // console.log('selectedDoAction', vm.selectedDoAction)
      },
      deep: true
    }
  },
  methods: {
    toggleAll () {
      var vm = this
      /*
      if (window.themeDisplay !== null && window.themeDisplay !== undefined && String(window.themeDisplay.getUserId()) === '20139') {
        vm.isAdminSuper = true
      }
      */
      if (vm.getUser('Administrator')) {
        if (vm.selected.length) {
          vm.selected = []
        } else {
          vm.selected = vm.hosoDatas
        }
      } else {
        if (!vm.thuTucHanhChinhSelected || (vm.thuTucHanhChinhSelected && vm.thuTucHanhChinhSelected.serviceConfigId === '0') || (vm.thuTucHanhChinhSelected && vm.thuTucHanhChinhSelected.serviceConfigId === '')) {
          return
        } else {
          if (vm.selected.length) {
            vm.selected = []
          } else {
            vm.selected = vm.hosoDatas.filter(function (item) {
              return item['assigned'] !== 0
            })
          }
        }
      }
      vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected'] = vm.selected
      // console.log('selected toggle all', vm.selectMultiplePage)
    },
    getUser (roleItem) {
      let vm = this
      let roles = vm.$store.getters.getUser.role
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)
    },
    changeSelected () {
      let vm = this
      vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected'] = vm.selected
      // console.log('selected item', vm.selectMultiplePage)
    },
    setStateAdvSearch (currentQuery) {
      // <--------- set State advSearch
      let vm = this
      if (currentQuery.hasOwnProperty('adv_renew')) {
        vm.advSearchItems = []
        for (let key1 in vm.itemFilterKey) {
          for (let key in currentQuery) {
            if (vm.itemFilterKey[key1] === key && currentQuery[key]) {
              vm.itemFilterSupport[vm.itemFilterKey[key1]] = currentQuery[key]
              break
            } else {
              vm.itemFilterSupport[vm.itemFilterKey[key1]] = ''
            }
          }
        }
        for (let key in vm.itemFilterKey) {
          let spec = vm.itemFilterKey[key]
          let current = vm.advSearchTools.find(function (item) {
            return item.spec === spec
          })
          if (vm.itemFilterSupport[spec]) {
            if (spec === 'keyword') {
              vm.advSearchItems.push({
                spec: spec,
                value: spec + ':' + vm.itemFilterSupport[spec],
                text: spec + ':' + vm.itemFilterSupport[spec],
                index: -1
              })
            } else if (spec === 'year') {
              let searchDate = vm.advSearchItems.find(function (item) { return item.spec === 'year_month_day' })
              if (searchDate) {
                searchDate['value'] = 'year_month_day' + ':' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport['day']
                searchDate['text'] = 'year_month_day' + ':' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport['day']
                searchDate['index'] = 0
              } else {
                vm.advSearchItems.push({
                  spec: 'year_month_day',
                  value: 'year_month_day' + ':' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport['day'],
                  text: 'year_month_day' + ':' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport['day'],
                  index: 0
                })
              }
            } else if (spec === 'month') {
              let searchDate = vm.advSearchItems.find(function (item) { return item.spec === 'year_month_day' })
              if (searchDate) {
                searchDate['value'] = 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['day']
                searchDate['text'] = 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['day']
                searchDate['index'] = 0
              } else {
                vm.advSearchItems.push({
                  spec: 'year_month_day',
                  value: 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['day'],
                  text: 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport[spec] + '_' + vm.itemFilterSupport['day'],
                  index: 0
                })
              }
            } else if (spec === 'day') {
              let searchDate = vm.advSearchItems.find(function (item) { return item.spec === 'year_month_day' })
              if (searchDate) {
                searchDate['value'] = 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport[spec]
                searchDate['text'] = 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport[spec]
                searchDate['index'] = 0
              } else {
                vm.advSearchItems.push({
                  spec: 'year_month_day',
                  value: 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport[spec],
                  text: 'year_month_day' + ':' + vm.itemFilterSupport['year'] + '_' + vm.itemFilterSupport['month'] + '_' + vm.itemFilterSupport[spec],
                  index: 0
                })
              }
            } else {
              vm.advSearchItems.push({
                spec: spec,
                value: spec + ':' + vm.itemFilterSupport[spec],
                text: spec + ':' + vm.itemFilterSupport[spec],
                index: current['index']
              })
            }
          }
        }
      } else {
        vm.advSearchItems = []
      }
      for (let keyTool in vm.advSearchTools) {
        vm.advSearchTools[keyTool].display = false
        vm.advSearchTools[keyTool].disabled = false
        let current = vm.advSearchItems.find(function (item) {
          return item.spec === vm.advSearchTools[keyTool].spec
        })
        if (current) {
          vm.advSearchTools[keyTool].display = true
          vm.advSearchTools[keyTool].disabled = true
        }
      }
      // ------->
    },
    resend () {
      var vm = this
      vm.doActions(null, vm.buttonConfigItem, null, true)
    },
    closeDialogStatusAction () {
      var vm = this
      vm.dialog_statusAction = false
      vm.selectedDoAction = vm.selectedDoAction.filter(function (item) {
        return !item.statusAction
      })
    },
    submitFormXuLy (dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, isGroup) {
      var vm = this
      if (vm.showYkienCanBoThucHien) {
        let result = vm.$refs.ykiencanbo.doExport()
        if (result.valid) {
          vm.textNote = result.text
          vm.processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)
        }
      } else {
        vm.processAction(dossierItemDialogPick, itemDialogPick, resultDialogPick, indexDialogPick, false)
      }
    },
    processListTTHC (currentQuery) {
      let vm = this
      vm.$store.dispatch('loadListThuTucHanhChinh').then(function (result) {
        if (!currentQuery.hasOwnProperty('domain') || (currentQuery.hasOwnProperty('domain') && String(currentQuery.domain) === '')) {
          vm.listThuTucHanhChinh = result.map(thuTuc => {
            thuTuc['displayName'] = thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
            return thuTuc
          })
        }
        vm.listThuTuc = result.map(thuTuc => {
          thuTuc['displayName'] = thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
          return thuTuc
        })
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
    processListDomain (currentQuery) {
      let vm = this
      vm.$store.dispatch('getDomainLists').then(function (result) {
        if (result.length > 0) {
          vm.listLinhVuc = result.map(domain => {
            domain['displayName'] = domain['domainCode'] + ' - ' + domain['domainName']
            return domain
          })
        }
        if (currentQuery.hasOwnProperty('domain') && String(currentQuery.domain) !== '') {
          for (let key in vm.listLinhVuc) {
            if (String(vm.listLinhVuc[key]['domainCode']) === String(currentQuery.domain)) {
              vm.linhVucSelected = vm.listLinhVuc[key]
              vm.domainCode = vm.linhVucSelected['domainCode']
            }
          }
          let domain = {
            domain: vm.linhVucSelected.domainCode
          }
          vm.$store.dispatch('getServiceinfoFilter', domain).then(result => {
            vm.listThuTucHanhChinh = result.map(thuTuc => {
              thuTuc['displayName'] = thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
              return thuTuc
            })
          })
        } else {
          vm.linhVucSelected = null
        }
        // vm.doLoadingDataHoSo()
      })
    },
    checkPemissionSpecialAction (form, currentUser, thongtinchitiet) {
      var vm = this
      var checkValue = true
      // check theo người thực hiện
      if (form !== 'PRINT_01' && form !== 'PRINT_02' && form !== 'PRINT_03' && form !== 'GUIDE' && form !== 'PREVIEW' && form !== 'BETIMES') {
        let userArr = vm.$store.getters.getUsersNextAction
        if (userArr.length > 0) {
          let check = userArr.filter(function (item) {
            if (item !== undefined && currentUser !== undefined) {
              return item['userId'].toString() === currentUser['userId'].toString()
            }
          })
          if (check.length > 0) {
            checkValue = true
          } else {
            checkValue = false
          }
        } else {
          checkValue = false
        }
      }
      // check theo lastactionUser
      if (form === 'ROLLBACK_01' || form === 'ROLLBACK_02' || form === 'ROLLBACK_03') {
        // if (currentUser.userId === thongtinchitiet.lastActionUserId) {
        //   checkValue = true
        // } else {
        checkValue = false
        // }
      }
      return checkValue
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
      // console.log('queryString=====', queryString)
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    doLoadingDataHoSo () {
      let vm = this
      vm.selected = []
      let currentQuery =vm.$router.history.current.query
      console.log('currentQuery======', currentQuery)
      if (currentQuery.hasOwnProperty('q')) {
        let querySet
        if (currentQuery.q.indexOf('step') > 0) {
          querySet = currentQuery.q
          // console.log('querySet------', querySet)
        } else {
          querySet = currentQuery['step'] ? currentQuery.q + '&step=' + currentQuery['step'] : currentQuery.q
        }
        var filter = null
        if (vm.menuType !== 3) {
          filter = {
            queryParams: querySet,
            /*  test local */
            // queryParams: 'http://127.0.0.1:8081' + querySet,
            page: vm.hosoDatasPage,
            agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyCode,
            service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceCode,
            template: currentQuery.hasOwnProperty('template') ? currentQuery.template : vm.templateNo,
            domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.domainCode,
            status: currentQuery.hasOwnProperty('status') ? currentQuery.status : '',
            substatus: currentQuery.hasOwnProperty('substatus') ? currentQuery.substatus : '',
            year: currentQuery.hasOwnProperty('year') ? currentQuery.year : 0,
            month: currentQuery.hasOwnProperty('month') ? currentQuery.month : 0,
            day: currentQuery.hasOwnProperty('day') ? currentQuery.day : 0,
            top: currentQuery.hasOwnProperty('top') ? currentQuery.top : '',
            keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
            register: currentQuery.hasOwnProperty('register') ? currentQuery.register : '',
            dossierNo: vm.dossierNoKey ? vm.dossierNoKey : ''
          }
        } else {
          let originalityDossierDeleted = currentQuery.hasOwnProperty('status') && currentQuery['status'] === 'deleted' ? -1 : ''
          filter = {
            queryParams: querySet,
            /*  test local */
            // queryParams: 'http://127.0.0.1:8081' + querySet,
            page: vm.hosoDatasPage,
            agency: currentQuery.hasOwnProperty('agency') ? currentQuery.agency : vm.govAgencyCode,
            service: currentQuery.hasOwnProperty('service') ? currentQuery.service : vm.serviceCode,
            template: currentQuery.hasOwnProperty('template') ? currentQuery.template : vm.templateNo,
            domain: currentQuery.hasOwnProperty('domain') ? currentQuery.domain : vm.domainCode,
            status: currentQuery.hasOwnProperty('status') && currentQuery['status'] && currentQuery['status'] !== 'deleted' ? currentQuery.status : '',
            substatus: currentQuery.hasOwnProperty('substatus') ? currentQuery.substatus : '',
            year: currentQuery.hasOwnProperty('year') ? currentQuery.year : 0,
            month: currentQuery.hasOwnProperty('month') ? currentQuery.month : 0,
            day: currentQuery.hasOwnProperty('day') ? currentQuery.day : 0,
            top: currentQuery.hasOwnProperty('top') ? currentQuery.top : '',
            keyword: currentQuery.hasOwnProperty('keyword') ? currentQuery.keyword : '',
            register: currentQuery.hasOwnProperty('register') ? currentQuery.register : '',
            originality: currentQuery.hasOwnProperty('originality') && currentQuery['originality'] ? currentQuery.originality : originalityDossierDeleted,
            dossierNo: vm.dossierNoKey ? vm.dossierNoKey : ''
          }
        }
        vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
          vm.hosoDatas = result.data
          vm.hosoDatasTotal = result.total
          vm.hosoTotalPage = Math.ceil(vm.hosoDatasTotal / 15)
          /*
          if (window.themeDisplay !== null && window.themeDisplay !== undefined && String(window.themeDisplay.getUserId()) === '20139') {
            vm.isAdminSuper = true
          }
          */
          if (vm.hosoTotalPage > 0 && vm.selectMultiplePage.length === 0) {
            for (let key = 0; key < vm.hosoTotalPage; key++) {
              let item = {
                selected: [],
                page: key + 1
              }
              vm.selectMultiplePage.push(item)
            }
            console.log('selectMultiplePage', vm.selectMultiplePage)
          }
          vm.selected = vm.selectMultiplePage[vm.hosoDatasPage - 1]['selected']
        }).catch(reject => {
          vm.hosoDatas = []
          vm.hosoDatasTotal = 0
        })
      }
      if (vm.menuType === 3 || String(vm.menuType) === '3') {
        setTimeout(() => {
          vm.$store.dispatch('loadingDossierCounting').then(function (result) {
            if (result !== null && result !== undefined) {
              vm.dossierCounting = result
              // add search dossierDeleted
              if (vm.getUser('Administrator_data')) {
                let dossierDelete = {key: 'deleted', title: 'Hồ sơ đã xóa', count: 0}
                vm.dossierCounting.push(dossierDelete)
              }
            } else {
              vm.dossierCounting = []
            }
            vm.dossierCountingShow = true
          })
        }, 200)
      } else {
        vm.dossierCountingShow = false
      }
    },
    changeServiceConfigs (item) {
      let vm = this
      vm.selectMultiplePage = []
      if (item !== null && item !== 'null' && item !== undefined && item.hasOwnProperty('options')) {
        vm.listDichVu = item.options
      } else {
        vm.listDichVu = []
      }
      if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
        vm.dichVuSelected = vm.listDichVu[0]
        vm.templateNo = vm.dichVuSelected.templateNo
      } else {
        vm.dichVuSelected = null
      }
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['service_config'] = ''
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        queryString += 'step=' + newQuery['step'] + '&'
      }
      if (vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu !== 'undefined' && vm.listDichVu.length > 0) {
        queryString += 'service_config=' + item.serviceConfigId
        queryString += '&template_no=' + vm.dichVuSelected.templateNo
        vm.govAgencyCode = item.govAgencyCode
        vm.serviceCode = item.serviceCode
      } else {
        vm.templateNo = ''
        vm.govAgencyCode = ''
        vm.serviceCode = ''
      }
      vm.$router.push({
        path: current.path + queryString
      })
    },
    changeServiceConfigsGuide (item) {
      let vm = this
      if (item !== null && item !== 'null' && item !== undefined && item.hasOwnProperty('options')) {
        vm.listDichVuGuide = item.options
      } else {
        vm.listDichVuGuide = []
      }
      if (vm.listDichVuGuide !== null && vm.listDichVuGuide !== undefined && vm.listDichVuGuide !== 'undefined' && vm.listDichVuGuide.length > 0) {
        vm.dichVuSelectedGuide = vm.listDichVuGuide[0]
        vm.templateNoGuide = vm.dichVuSelectedGuide.templateNo
      } else {
        vm.dichVuSelectedGuide = null
      }
    },
    changeDomain (item) {
      // console.log('change Domain')
      let vm = this
      vm.selectMultiplePage = []
      vm.linhVucSelected = item
      if (item) {
        setTimeout(function () {
          let domain = {
            domain: vm.linhVucSelected.domainCode
          }
          vm.$store.dispatch('getServiceinfoFilter', domain).then(result => {
            vm.listThuTucHanhChinh = result.map(thuTuc => {
              thuTuc['displayName'] = thuTuc['serviceCode'] + ' - ' + thuTuc['serviceName']
              return thuTuc
            })
          })
          // vm.listThuTucHanhChinh = vm.listThuTuc.filter(function (itemThuTuc) {
          //   return (itemThuTuc.serviceCode.split(itemThuTuc.serviceCode.match(/\d+/g)[0])[0] === item.domainCode)
          // })
        }, 100)
      } else {
        vm.listThuTucHanhChinh = vm.listThuTuc
      }
      if (item !== null && item !== undefined) {
        vm.domainCode = vm.linhVucSelected['domainCode']
      } else {
        vm.domainCode = ''
      }
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['domain'] = ''
      for (let key in newQuery) {
        if (key === 'page') {
          queryString += key + '=1&'
        } else if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && key !== 'step') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (String(newQuery['q']).indexOf('&step') === -1 && vm.menuType !== 3) {
        queryString += 'step=' + newQuery['step'] + '&'
      }
      queryString += 'domain=' + vm.domainCode
      // console.log('change Domain queryString', queryString)
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
    },
    changeDossierNoKey () {
      var vm = this
      vm.selectMultiplePage = []
      // console.log('run log ...')
      setTimeout(function () {
        if (vm.dossierNoKey) {
          if (vm.dossierNoKey.length > 3 || vm.dossierNoKey === '') {
            vm.doLoadingDataHoSo()
          }
        } else {
          vm.doLoadingDataHoSo()
        }
      }, 200)
    },
    clearDossierNoKey () {
      this.dossierNoKey = ''
      this.changeDossierNoKey()
    },
    changeDichVuConfigs (item) {
      let vm = this
      vm.selectMultiplePage = []
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['template_no'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      if (item !== null && item !== undefined) {
        queryString += 'template_no=' + item.templateNo
        vm.templateNo = item.templateNo
      }
      vm.$router.push({
        path: current.path + queryString
      })
    },
    btnActionEvent (dossierItem, item, index, isGroup) {
      let vm = this
      // set info buttonConfig
      vm.buttonConfigItem = {}
      vm.buttonConfigItem = item
      //
      vm.itemAction = item
      // console.log('itemAction++++++++++++', item)
      vm.indexAction = index
      if (String(item.form) === 'NEW') {
        let isOpenDialog = true
        if (vm.dichVuSelected !== null && vm.dichVuSelected !== undefined && vm.dichVuSelected !== 'undefined' && vm.listDichVu !== null && vm.listDichVu !== undefined && vm.listDichVu.length === 1) {
          isOpenDialog = false
        }
        if (isOpenDialog) {
          // vm.thuTucHanhChinhSelected = null
          vm.dialogAction = true
        } else {
          vm.doCreateDossier()
        }
        // console.log('isOpenDialog++++++++', isOpenDialog)
      } else if (String(item.form) === 'UPDATE') {
       vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + dossierItem.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      } else if (String(item.form) === 'ADD') {
       vm.$router.push({
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
      } else if (String(item.form) === 'GUIDING') {
        vm.dialog_printGuide = true
        // vm.doGuiding(dossierItem, item, index, isGroup)
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
          actionCode: 8500,
          dossierId: dossierItem.dossierId,
          overdue: dossierItem['extendDate']
        }
        vm.processPullBtnDetailRouter(dossierItem, null, result, null, 8500)
      } else if (String(item.form) === 'PREOVERDUE') {
        let result = {
          actionCode: 8501,
          dossierId: dossierItem.dossierId,
          preoverdue: dossierItem['extendDate']
        }
        vm.processPullBtnDetailRouter(dossierItem, null, result, null, 8501)
      } else if (String(item.form) === 'BETIMES') {
        let result = {
          actionCode: 8400,
          dossierId: dossierItem.dossierId,
          betimes: dossierItem['extendDate']
        }
        vm.processPullBtnDetailRouter(dossierItem, null, result, null, 8400)
      } else if (String(item.form) === 'CHANGE_DATA_DOSSIER') {
        vm.doChangeDossier(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'UNDO_DOSSIER') {
        vm.doUndoDossier(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'RESTORE_DOSSIER') {
        vm.doRestoreDossier(dossierItem, item, index, isGroup)
      } else if (String(item.form) === 'GOTO_DONE') {
        if (!dossierItem) {
          alert('Chọn hồ sơ để thực hiện')
          return
        }
        let result = {
          stepCode: 400,
          stepName: 'hoàn thành'
        }
        vm.gotoStep(dossierItem, result)
      } else if (String(item.form) === 'GOTO_CANCEL') {
        if (!dossierItem) {
          alert('Chọn hồ sơ để thực hiện')
          return
        }
        let result = {
          stepCode: 410,
          stepName: 'rút'
        }
        vm.gotoStep(dossierItem, result)
      } else if (String(item.form) === 'GOTO_DENY') {
        if (!dossierItem) {
          alert('Chọn hồ sơ để thực hiện')
          return
        }
        let result = {
          stepCode: 420,
          stepName: 'từ chối'
        }
        vm.gotoStep(dossierItem, result)
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
      console.log('vm.selectedDoAction', vm.selectedDoAction)
      if (vm.thuTucHanhChinhSelected === null || vm.thuTucHanhChinhSelected === undefined || vm.thuTucHanhChinhSelected === 'undefined') {
        alert('Loại thủ tục bắt buộc phải chọn')
      } else {
        let filter = {
          document: item.document,
          'serviceCode': vm.thuTucHanhChinhSelected.serviceCode,
          'govAgencyCode': vm.thuTucHanhChinhSelected.govAgencyCode,
          dossiers: JSON.stringify(vm.selectedDoAction)
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
    doGuiding (type) {
      let vm = this
      if (vm.$refs.formGuide.validate()) {
        vm.loadingAction = true
        let filter = {
          serviceConfigId: vm.thuTucHanhChinhSelectedGuide.serviceConfigId,
          serviceCode: vm.thuTucHanhChinhSelectedGuide.serviceCode,
          serviceName: vm.thuTucHanhChinhSelectedGuide.serviceName,
          templateNo: vm.templateNoGuide,
          applicantName: vm.applicantNameGuide,
          applicantAddress: vm.applicantAddressGuide,
          applicantEmail: vm.applicantEmailGuide,
          applicantTelNo: vm.applicantTelNoGuide,
          // employeeName: window.themeDisplay.getUserName() ? window.themeDisplay.getUserName() : '',
          typeCode: 'DOC_03'
        }
        if (type === 'doc') {
          filter['reportType'] = 'word'
        }
        if (type !== 'doc') {
          vm.dialogPDFLoading = true
          vm.dialogPDF = true
        }
        vm.$store.dispatch('doGuiding', filter).then(function (result) {
          vm.loadingAction = false
          vm.dialog_printGuide = false
          vm.dialogPDFLoading = false
          if (type !== 'doc') {
            document.getElementById('dialogPDFPreview').src = result
          }
        }).catch(function () {
          vm.loadingAction = false
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
      let result = {
        actionCode: item.action
      }
      if (isGroup) {
        vm.countSelected = 0
        if (vm.selectedDoAction.length === 1) {
          for (let key in vm.selectedDoAction) {
            let actionDossierItem = vm.selectedDoAction[key]
           vm.$router.push({
              path: '/danh-sach-ho-so/' + vm.index + '/chi-tiet-ho-so/' + actionDossierItem['dossierId'],
              query: {
                activeTab: 'tabs-1',
                btnIndex: null
              }
            })
            // vm.processAction(actionDossierItem, item, result, key, false)
          }
        } else if (vm.selectedDoAction.length > 1) {
          // console.log('run doActions Landing')
          vm.$store.dispatch('loadActionActive', item).then(function () {
            vm.$store.dispatch('loadDossierSelected', vm.selectedDoAction).then(function () {
              let dossiersSelect = vm.selectedDoAction.map(select => {
                return select.dossierId
              }).join(',')
              let query = vm.$router.history.current.query
              query['dossiers'] = dossiersSelect
              query['actionActive'] = JSON.stringify(item)
             vm.$router.push({
                path: '/danh-sach-ho-so/' + vm.index + '/xu-ly-ho-so',
                query: query
              })
            })
          })
        } else {
          alert('Chọn hồ sơ để thao tác')
        }
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
       vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    doCancel (dossierItem, item, index, isGroup) {
      let vm = this
      vm.loadingAction = true
      if (isGroup) {
        // console.log(vm.selected)
      } else {
        let filter = {
          dossierId: dossierItem.dossierId
        }
        vm.$store.dispatch('doCancel', filter).then(function (result) {
          vm.loadingAction = false
          vm.indexAction = -1
         vm.$router.push({
            path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
            query: vm.$router.history.current.query
          })
        }).catch(reject => {
          vm.loadingAction = false
        })
      }
    },
    doChangeDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (isGroup) {
        if (vm.selectedDoAction.length > 0) {
          let countSelectedDoAction = vm.selectedDoAction.length
          vm.actionId = 9100
          vm.dossierIdSelected = vm.selectedDoAction[countSelectedDoAction - 1].dossierId
          // console.log('selectExtraForm', vm.dossierIdSelected, vm.actionId)
          vm.dialog_extraForm = true
        } else {
          alert('Chọn hồ sơ để thực hiện')
        }
      }
    },
    doUndoDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.selectedDoAction.length > 0) {
        let countSelectedDoAction = vm.selectedDoAction.length
        let x = confirm('Xác thực Undo hồ sơ với mã: ' + vm.selectedDoAction[countSelectedDoAction - 1].dossierNo)
        if (x) {
          let fiter = {
            dossierId: vm.selectedDoAction[countSelectedDoAction - 1].dossierId
          }
          vm.$store.dispatch('rollBack', fiter).then(function (result) {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          }).catch(function () {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          })
        }
      } else {
        alert('Chọn hồ sơ để thực hiện')
      }
    },
    gotoStep (dossierItem, result) {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      if (vm.selectedDoAction.length > 0) {
        let countSelectedDoAction = vm.selectedDoAction.length
        let x = confirm('Xác thực ' + result['stepName'] + ' hồ sơ với mã: ' + vm.selectedDoAction[countSelectedDoAction - 1].dossierNo)
        if (x) {
          let fiter = {
            dossierId: vm.selectedDoAction[countSelectedDoAction - 1].dossierId,
            stepCode: result['stepCode']
          }
          vm.$store.dispatch('goToStep', fiter).then(function (result) {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          }).catch(function () {
            setTimeout(function () {
              vm.doLoadingDataHoSo()
            }, 300)
          })
        }
      } else {
        alert('Chọn hồ sơ để thực hiện')
      }
    },
    doChangeDossierExtraForm () {
      let vm = this
      let validation = vm.$refs.formBoSungThongTinNgan.checkValid()
      if (validation) {
        let payloadExtraForm = vm.$refs.formBoSungThongTinNgan.formSubmitData()
        if (payloadExtraForm) {
          let x = confirm('Bạn có chắc chắn thực hiện hành động điều chỉnh dữ liệu?')
          if (x) {
            let countSelectedDoAction = vm.selectedDoAction.length
            let fiter = {
              dossierId: vm.selectedDoAction[countSelectedDoAction - 1].dossierId,
              actionCode: vm.actionId,
              payload: payloadExtraForm
            }
            vm.$store.dispatch('processDossierRouter', fiter).then(function (result) {
              vm.doLoadingDataHoSo()
              vm.dialog_extraForm = false
            }).catch(function () {
              vm.dialog_extraForm = false
              vm.doLoadingDataHoSo()
            })
          }
        } else {
          vm.dialog_extraForm = false
        }
      }
    },
    doRestoreDossier () {
      let vm = this
      let x = confirm('Bạn có chắc chắn thực hiện hành động khôi phục hồ sơ?')
      if (x) {
        if (vm.selectedDoAction.length > 0) {
          let restoreCounter = 0
          let lengthDossier = vm.selectedDoAction.length
          for (let key in vm.selectedDoAction) {
            let filter = {
              dossierId: vm.selectedDoAction[key]['dossierId']
            }
            console.log('filter Restore', filter)
            if (vm.selectedDoAction[key]['originality']) {
              vm.$store.dispatch('restoreDossier', filter).then(function (result) {
                restoreCounter += 1
                if (restoreCounter === lengthDossier) {
                  vm.doLoadingDataHoSo()
                }
              }).catch(function () {
                restoreCounter += 1
                if (restoreCounter === lengthDossier) {
                  vm.doLoadingDataHoSo()
                }
              })
            }
          }
        } else {
          alert('Chọn hồ sơ để thực hiện')
        }
      }
    },
    doDeleteDossier (dossierItem, item, index, isGroup) {
      let vm = this
      let x = confirm('Bạn có chắc chắn thực hiện hành động xóa hồ sơ?')
      if (x) {
        let currentQuery = vm.$router.history.current.query
        //
        if (isGroup) {
          let filter = {
            dossierId: 0
          }
          // console.log(vm.selected)
          if (vm.selectedDoAction.length > 0) {
            let deleteIds = []
            for (let key in vm.selectedDoAction) {
              deleteIds.push(vm.selectedDoAction[key]['dossierId'])
            }
            filter['dossierId'] = deleteIds
            vm.$store.dispatch('deleteDossierPatch', filter).then(function (result) {
            })
          } else {
            alert('Chọn hồ sơ để thực hiện')
          }
        } else {
          let filter = {
            dossierId: dossierItem.dossierId
          }
          vm.$store.dispatch('deleteDossier', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
           vm.$router.push({
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
        originality: vm.getOriginality()
      }
      vm.$store.commit('setDataCreateDossier', data)
      vm.loadingAction = true
      vm.$store.dispatch('postDossier', data).then(function (result) {
        vm.loadingAction = false
        vm.indexAction = -1
       vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/ho-so/' + result.dossierId + '/' + vm.itemAction.form,
          query: vm.$router.history.current.query
        })
      }).catch(reject => {
        vm.loadingAction = false
      })
    },
    doSubmitDialogAction (item) {
      let vm = this
      if (vm.$refs.form.validate()) {
        // console.log('yes-----')
        // console.log('item++++++++', item)
        vm.doCreateDossier()
      }
    },
    processPullBtnDynamics (item) {
      let vm = this
      vm.btnDossierDynamics = []
      let filter = {
        dossierId: item.dossierId,
        dossierStatus: item.dossierStatus,
        dossierSubStatus: item.dossierSubStatus
      }
      vm.dossierId = item.dossierId
      // if (vm.$router.history.current.query.hasOwnProperty('step')) {
      //   vm.$store.dispatch('pullNextactions', filter).then(result => {
      //     vm.btnDossierDynamics = result
      //   })
      // } else {
      if (item.dossierStatus === '' || item.dossierSubStatus === '') {
        vm.$store.dispatch('pullNextactions', filter).then(result => {
          vm.btnDossierDynamics = result
        })
      } else {
        vm.btnStepsDynamics = []
        var getbuttonAction = [vm.$store.dispatch('pullNextactions', filter), vm.$store.dispatch('pullBtnConfigStep', filter)]
        Promise.all(getbuttonAction).then(result => {
          vm.btnDossierDynamics = result[0]
          vm.btnStepsDynamics = result[1]
        }).catch(reject => {
          vm.$store.dispatch('pullNextactions', filter).then(result => {
            vm.btnDossierDynamics = result
          })
        })
      }
      // }
    },
    processAction (dossierItem, item, result, index, isConfirm) {
      let vm = this
      var paymentsOut = null
      if (vm.payments) {
        paymentsOut = {
          requestPayment: vm.payments['requestPayment'],
          advanceAmount: Number(vm.payments['advanceAmount'].toString().replace(/\./g, '')),
          feeAmount: Number(vm.payments['feeAmount'].toString().replace(/\./g, '')),
          serviceAmount: Number(vm.payments['serviceAmount'].toString().replace(/\./g, '')),
          shipAmount: Number(vm.payments['shipAmount'].toString().replace(/\./g, ''))
        }
      }
      let filter = {
        dossierId: dossierItem.dossierId,
        actionCode: result.actionCode,
        toUsers: vm.assign_items,
        payment: paymentsOut,
        userNote: vm.textNote ? vm.textNote : ''
      }
      vm.dossierId = dossierItem.dossierId
      let currentQuery = vm.$router.history.current.query
      let queryString = '?'
      currentQuery['recount'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
      currentQuery['renew'] = Math.floor(Math.random() * (100 - 1 + 1)) + 1
      for (let key in currentQuery) {
        if (currentQuery[key] !== '' && currentQuery[key] !== 'undefined' && currentQuery[key] !== undefined) {
          queryString += key + '=' + currentQuery[key] + '&'
        }
      }
      vm.loadingActionProcess = true
      if (isConfirm) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x) {
          vm.$store.dispatch('processDossierRouter', filter).then(function (result) {
            vm.dialogActionProcess = false
            vm.loadingActionProcess = false
            vm.$router.push({
              path: vm.$router.history.current.path + queryString
            })
          })
        } else {
          return false
        }
      } else {
        if (!dossierItem.statusAction) {
          vm.$store.dispatch('processCheckNextActions', filter).then(function (newFilter) {
            vm.$store.dispatch('processDossierRouter', newFilter).then(function (result) {
              vm.dialogActionProcess = false
              vm.loadingActionProcess = false
              //
              if (String(item.form) === 'ACTIONS') {
                // get dossier submit fail and show on dialog
                vm.hosoDatas.splice(index, 1)
                vm.selectedDoAction[index].statusAction = true
                vm.countSelected += 1
                if (vm.countSelected === vm.selectedDoAction.length && vm.statusFailed > 0 && vm.selectedDoAction.length > 1) {
                  vm.dialog_statusAction = true
                } else if (vm.countSelected === vm.selectedDoAction.length && vm.statusFailed === 0) {
                 vm.$router.push({
                    path: vm.$router.history.current.path,
                    query: {
                      recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                      renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                      q: currentQuery['q']
                    }
                  })
                }
              } else {
               vm.$router.push({
                  path: vm.$router.history.current.path,
                  query: {
                    recount: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                    renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
                    q: currentQuery['q']
                  }
                })
              }
            }).catch(function () {
              vm.loadingActionProcess = false
              //
              if (String(item.form) === 'ACTIONS') {
                vm.countSelected += 1
                vm.statusFailed += 1
                vm.selectedDoAction[index].statusAction = false
                if (vm.countSelected === vm.selectedDoAction.length && vm.statusFailed > 0 && vm.selectedDoAction.length > 1) {
                  vm.dialog_statusAction = true
                }
              } else {}
            })
          })
        }
      }
    },
    processPullBtnDetailRouter (dossierItem, item, result, index, btnIndex) {
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
      vm.showThuPhi = false
      vm.showThucHienThanhToanDienTu = false
      vm.dossierItemDialogPick = dossierItem
      vm.itemDialogPick = item
      vm.resultDialogPick = result
      vm.indexDialogPick = index
      vm.userNote = 0
      if (result !== null && result !== undefined && result !== 'undefined' &&
        (result.hasOwnProperty('userNote') || result.hasOwnProperty('extraForm') || result.hasOwnProperty('allowAssignUser') ||
        result.hasOwnProperty('createFiles') || result.hasOwnProperty('eSignature') || result.hasOwnProperty('returnFiles') ||
        result.hasOwnProperty('payment') || result.hasOwnProperty('overdue') || result.hasOwnProperty('betimes'))) {
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
        // if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment !== '') {
        //   isPopup = true
        //   vm.showThuPhi = true
        //   vm.payments = result.payment
        //   vm.viaPortalDetail = dossierItem.viaPostal
        // }
        // add thanh toán điện tử
        if (result.hasOwnProperty('payment') && result.payment !== null && result.payment !== undefined && result.payment !== 'undefined' && result.payment.requestPayment > 0) {
          if (result.payment.requestPayment === 2 || result.payment.requestPayment === '2') {
            isPopup = true
            let filter = {
              dossierId: vm.dossierId
            }
            vm.$store.dispatch('loadDossierPayments', filter).then(result => {
              vm.paymentProfile = result
              // vm.showThanhToanDienTu = true
            }).catch(reject => {
            })
          } else {
            isPopup = true
            vm.showThuPhi = true
            vm.payments = result.payment
            vm.viaPortalDetail = dossierItem.viaPostal
          }
        }
        //
        if (result.hasOwnProperty('overdue')) {
          isPopup = true
        }
        if (result.hasOwnProperty('betimes')) {
          isPopup = true
        }
      }
      if (isPopup) {
        /*
        vm.dialogActionProcess = true
        vm.loadingActionProcess = false
        */
        let query = {
          activeTab: 'tabs-1',
          btnIndex: btnIndex
        }
        // if (item['autoEvent']) {
        //   if (item['autoEvent'] === 'special') {
        //     query['actionSpecial'] = true
        //   }
        // }
       vm.$router.push({
          path: '/danh-sach-ho-so/' + vm.index + '/chi-tiet-ho-so/' + dossierItem['dossierId'],
          query: query
        })
      } else {
        vm.processAction(dossierItem, item, result, index, true)
      }
    },
    processPullBtnDetail (dossierItem, item, index, btnIndex) {
      let vm = this
      if (item['enable'] === 1 || item['autoEvent'] === 'special') {
        vm.itemAction = item
        let filter = {
          dossierId: dossierItem.dossierId,
          actionId: item.processActionId
        }
        vm.dossierId = dossierItem.dossierId
        vm.loadingActionProcess = true
        vm.$store.dispatch('processPullBtnDetail', filter).then(function (result) {
          vm.processPullBtnDetailRouter(dossierItem, item, result, index, btnIndex)
        })
      }
    },
    goBack () {
      window.history.back()
    },
    viewDetail (item, indexItem) {
      let vm = this
      console.log('permission: ', item.permission)
      if (item.permission !== null && item.permission !== '') {
       vm.$router.push('/danh-sach-ho-so/' + this.index + '/chi-tiet-ho-so/' + item['dossierId'])
      }
    },
    keywordEventChange (data) {
      let vm = this
      vm.selectMultiplePage = []
      console.log('keywordEventChange', data)
      vm.advObjectSearch = {}
      for (let key in data) {
        if (typeof data[key] === 'string' && data[key] !== null && data[key] !== undefined && data[key] !== 'undefined') {
          if (!data[key].startsWith('keyword:') && !data[key].startsWith('year_month_day:') && !data[key].startsWith('top:') &&
            !data[key].startsWith('status:') && !data[key].startsWith('substatus:') && !data[key].startsWith('agency:') &&
            !data[key].startsWith('service:') && !data[key].startsWith('domain:') && !data[key].startsWith('register:')) {
            vm.advObjectSearch['keyword'] = data[key]
          }
          if (data[key].startsWith('keyword:')) {
            vm.advObjectSearch['keyword'] = data[key].replace('keyword:', '')
          } else {
            for (let keyTool in vm.advSearchItems) {
              if (data[key].startsWith(vm.advSearchItems[keyTool].spec + ':')) {
                vm.advObjectSearch[vm.advSearchItems[keyTool].spec] = data[key].replace(vm.advSearchItems[keyTool].spec + ':', '')
              }
            }
          }
        } else {
          let newText = data[key].value
          vm.advObjectSearch[data[key].spec] = newText.replace(data[key].spec + ':', '')
        }
      }
      vm.advSearchItems = []
      for (let key in vm.advObjectSearch) {
        if (!vm.advObjectSearch.hasOwnProperty(key)) continue
        let value = vm.advObjectSearch[key]
        if (typeof value === 'string' && value !== null && value !== undefined && value !== '') {
          if (key === 'keyword') {
            vm.advSearchItems.push({
              spec: key,
              value: key + ':' + value,
              text: key + ':' + value,
              index: -1
            })
          } else {
            let toolIndex = -2
            for (let keyTool in vm.advSearchTools) {
              if (vm.advSearchTools[keyTool].spec === key) {
                toolIndex = vm.advSearchTools[keyTool].index
                break
              }
            }
            vm.advSearchItems.push({
              spec: key,
              value: key + ':' + value,
              text: key + ':' + value,
              index: toolIndex
            })
          }
        } else if (typeof value !== 'string' && value !== null && value !== undefined && value !== '') {
          vm.advSearchItems.push({
            spec: key,
            value: key + ':' + value.value,
            text: key + ':' + value.value,
            index: key + ':' + value.index
          })
        }
      }
      for (let keyTool in vm.advSearchTools) {
        vm.advSearchTools[keyTool].display = false
        vm.advSearchTools[keyTool].disabled = false
        if (vm.advObjectSearch[vm.advSearchTools[keyTool].spec] !== null && vm.advObjectSearch[vm.advSearchTools[keyTool].spec] !== undefined &&
          vm.advObjectSearch[vm.advSearchTools[keyTool].spec] !== '') {
          vm.advSearchTools[keyTool].display = true
          vm.advSearchTools[keyTool].disabled = true
        }
      }
      console.log('vm.advSearchItems', vm.advSearchItems)
      vm.doRedirectFilter()
    },
    selectedAdvFilter (item) {
      let vm = this
      vm.advSearchTools[item.index].display = true
      vm.advSearchTools[item.index].disabled = true
      let hasKey = false
      for (let key in vm.advSearchItems) {
        if (vm.advSearchItems[key].index === item.index) {
          hasKey = true
          break
        }
      }
      if (!hasKey) {
        vm.advSearchItems.push({
          spec: vm.advSearchTools[item.index].spec,
          value: vm.advSearchTools[item.index].spec + ':' + '__',
          text: vm.advSearchTools[item.index].spec + ':' + '__',
          index: item.index
        })
      }
    },
    showAdvFilter () {
      let vm = this
      vm.menusss = !vm.menusss
      vm.$store.dispatch('getStatusLists').then(function (result) {
        vm.itemFilterSupport.statusLists = result
        let statusDeleted = {
          itemCode: 'deleted',
          itemName: 'Đã xóa'
        }
        if (vm.getUser('Administrator_data')) {
          vm.itemFilterSupport.statusLists.push(statusDeleted)
        }
      })
      let filter = {
        itemCode: ''
      }
      vm.$store.dispatch('getSubstatusLists', filter).then(function (result) {
        vm.itemFilterSupport.substatusLists = result
      })
      vm.$store.dispatch('getAgencyLists').then(function (result) {
        vm.itemFilterSupport.agencyLists = result
      })
      vm.$store.dispatch('getServiceLists').then(function (result) {
        vm.itemFilterSupport.serviceLists = result
      })
      vm.$store.dispatch('getDomainLists').then(function (result) {
        vm.itemFilterSupport.domainLists = result
      })
    },
    changeAdvFilterData (data, spec, index) {
      let vm = this
      console.log('data change advSearch', data, spec, index)
      if (spec === 'status') {
        let filter = {
          itemCode: data
        }
        vm.$store.dispatch('getSubstatusLists', filter).then(function (result) {
          vm.itemFilterSupport.substatusLists = result
        })
      }
      let valueFilter = data
      if (spec === 'year') {
        vm.itemFilterSupport.year = data
        valueFilter = vm.itemFilterSupport.year + '_' + vm.itemFilterSupport.month + '_' + vm.itemFilterSupport.day
        spec = 'year_month_day'
      } else if (spec === 'month') {
        vm.itemFilterSupport.month = data
        valueFilter = vm.itemFilterSupport.year + '_' + vm.itemFilterSupport.month + '_' + vm.itemFilterSupport.day
        spec = 'year_month_day'
      } else if (spec === 'day') {
        vm.itemFilterSupport.day = data
        valueFilter = vm.itemFilterSupport.year + '_' + vm.itemFilterSupport.month + '_' + vm.itemFilterSupport.day
        spec = 'year_month_day'
      } else {
        /* set State advSearch */
        vm.itemFilterSupport[spec] = data
      }
      for (let key in vm.advSearchItems) {
        console.log('adv Search index', vm.advSearchItems[key].index)
        if (vm.advSearchItems[key].index === index) {
          console.log('vm.itemFilterSupport2', vm.itemFilterSupport)
          vm.advSearchItems[key].value = spec + ':' + valueFilter
          vm.advSearchItems[key].text = spec + ':' + valueFilter
          break
        }
      }
      vm.doRedirectFilter()
    },
    doRedirectFilter () {
      let vm = this
      vm.selectMultiplePage = []
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined &&
          key !== 'top' && key !== 'status' && key !== 'substatus' && key !== 'agency' && key !== 'service' && key !== 'domain' &&
          key !== 'register' && key !== 'year' && key !== 'month' && key !== 'day' && key !== 'adv_renew' && key !== 'keyword') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      for (let key in vm.advSearchItems) {
        let currentItemFilter = vm.advSearchItems[key]
        if (currentItemFilter.spec === 'year_month_day') {
          let currentYearMonth = currentItemFilter.text.replace(currentItemFilter.spec + ':', '')
          const [year, month, day] = currentYearMonth.split('_')
          queryString += 'year' + '=' + year + '&' + 'month' + '=' + month + '&' + 'day' + '=' + day + '&'
        } else {
          console.log('currentItemFilter.spec', currentItemFilter.text.replace(currentItemFilter.spec + ':', ''))
          queryString += currentItemFilter.spec + '=' + currentItemFilter.text.replace(currentItemFilter.spec + ':', '') + '&'
        }
      }
      queryString += 'adv_renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
      queryString = queryString.replace(/=__/g, '=')
      vm.$router.push({
        path: current.path + queryString
      })
    },
    changeAdvFilterDataChips (item) {
      let vm = this
      // console.log('changeAdvFilterDataChips', vm.advSearchItems)
      let indexPush = -2
      for (let key in vm.advSearchTools) {
        if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
          if (vm.advSearchTools[key]['spec'] === 'top') {
            indexPush = vm.advSearchTools[key]['index']
            vm.advSearchTools[key].display = true
            vm.advSearchTools[key].disabled = true
          }
        } else {
          if (vm.advSearchTools[key]['spec'] === 'status') {
            indexPush = vm.advSearchTools[key]['index']
            vm.advSearchTools[key].display = true
            vm.advSearchTools[key].disabled = true
          }
        }
      }
      let typeSearch = ''
      if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
        typeSearch = 'top'
      } else {
        typeSearch = 'status'
      }
      let noFilterData = true
      for (let key in vm.advSearchItems) {
        if (vm.advSearchItems[key]['spec'] === 'status') {
          if (item.key !== 'delay' && item.key !== 'overdue' && item.key !== 'coming') {
            vm.advSearchItems[key].value = 'status' + ':' + item.key
            vm.advSearchItems[key].text = 'status' + ':' + item.key
            noFilterData = false
            break
          }
        } else if (vm.advSearchItems[key]['spec'] === 'top') {
          if (item.key === 'delay' || item.key === 'overdue' || item.key === 'coming') {
            vm.advSearchItems[key].value = 'top' + ':' + item.key
            vm.advSearchItems[key].text = 'top' + ':' + item.key
            noFilterData = false
            break
          }
        }
      }
      if (noFilterData) {
        vm.advSearchItems.push({
          spec: typeSearch,
          value: typeSearch + ':' + item.key,
          text: typeSearch + ':' + item.key,
          index: indexPush
        })
      }
      vm.doRedirectFilter()
    },
    validate () {
      // validate your form , if you don't have validate prop , default validate pass .
      return true
    },
    callback (token) {
      // google recaptcha token , then you can pass to backend with your form data .
      if (token) {
        alert(token)
      } else {
        // if you use data-size show reCAPTCHA , maybe you will get empty token. 6LfuMm4UAAAAAIeNgZHhWHR-aVaqXqNUSsurnzm2
        alert('please check you are not robot')
      }
    }
  }
}
</script>
