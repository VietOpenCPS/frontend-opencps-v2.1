<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm12 class="mb-2">
      <v-subheader style="font-weight: bold">Tình trạng hồ sơ</v-subheader>
        <v-btn color="primary" outline v-for="(item, index) in tinhTrangHoSo" :class="{active: item.status === statusSearch}" :key="item.status" @click="changeTinhTrangHoSo(item)">{{item.statusName}} ({{item.count}})</v-btn>
      </v-flex>
      <v-flex xs12 sm12 class="mb-2">
        <v-subheader style="font-weight: bold">Đang thụ lý</v-subheader>
        <v-btn color="primary" outline v-for="(item, index) in dangThuLy" :class="{active: item.dueCode === dueSearch}" :key="item.dueCode" @click="changeDangThuLy(item)">{{item.dueName}} ({{item.count}})</v-btn>
      </v-flex>
      <v-flex xs12 sm12 class="mb-2">
        <v-subheader style="font-weight: bold">Sổ theo dõi</v-subheader>
        <v-btn color="primary" outline v-for="(item, index) in soTheoDoi" :class="{active: item.register === registerSearch}" :key="item.register" @click="changeSoTheoDoi(item)">{{item.registerName}} ({{item.count}})</v-btn>
      </v-flex>
      <v-flex xs12 sm9>
        <v-text-field
        class="ml-3"
        label="Nhập từ khóa"
        v-model="keywordSearch"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm3>
        <v-btn color="primary" @click="quickSearch" class="ml-4">Tìm kiếm nhanh</v-btn> 
      </v-flex>
      <v-flex xs12 sm9>
      </v-flex>
      <v-flex xs12 sm3 class="">
        <v-btn color="primary" @click="advancedSearch" class="ml-4 mb-3">Tìm kiếm nâng cao</v-btn> 
      </v-flex>
      <v-flex xs12 sm12>
        <v-data-table :headers="headers" :items="traCuuDatas" class="table-landing table-bordered"
        hide-actions no-data-text="Không có dữ liệu"
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
          <td class="text-xs-center">
            {{props.item.dossierNo}}
          </td>
          <td class="text-xs-center">
            {{props.item.serviceName}}
          </td>
          <td class="text-xs-center">
            {{props.item.applicantName}}
          </td>
          <td class="text-xs-center">
            {{props.item.address}}
          </td>
          <td class="text-xs-center">
            {{props.item.receiveDate}}
          </td>
          <td class="text-xs-center">
            {{props.item.releaseDate}}
          </td>
          <td class="text-xs-center">
            {{props.item.submitDate}}
          </td>
          <td class="text-xs-center">
            {{props.item.finishDate}}
          </td>
        </template>
      </v-data-table>
      <div class="text-xs-right layout wrap" style="position: relative;">
        <div class="flex pagging-table px-2"> 
          <tiny-pagination :total="traCuuDatasTotal" :page="traCuuDatasPage" custom-class="custom-tiny-class" 
          @tiny:change-page="paggingDataTraCuu" ></tiny-pagination> 
        </div>
      </div>
    </v-flex>
  </v-layout>
  </div>
</template>
<script>
// import $ from 'jquery'
import TinyPagination from './pagging/hanghai_pagination.vue'
import router from '@/router'
export default {
  props: ['index', 'id'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    tinhTrangHoSo: [{
      status: 'trangThai1',
      statusName: 'trang thai 1',
      count: '10'
    }, {
      status: 'trangThai2',
      statusName: 'trang thai 2',
      count: '8'
    }, {
      status: 'trangThai3',
      statusName: 'trang thai 3',
      count: '9'
    }],
    dangThuLy: [{
      dueCode: 'trangThai1',
      dueName: 'trang thai 1',
      count: '10'
    }, {
      dueCode: 'trangThai2',
      dueName: 'trang thai 2',
      count: '8'
    }, {
      dueCode: 'trangThai3',
      dueName: 'trang thai 3',
      count: '9'
    }],
    soTheoDoi: [{
      register: 'trangThai1',
      registerName: 'trang thai 1',
      count: '10'
    }, {
      register: 'trangThai2',
      registerName: 'trang thai 2',
      count: '8'
    }, {
      register: 'trangThai3',
      registerName: 'trang thai 3',
      count: '9'
    }],
    headers: [{
      text: 'STT',
      align: 'center',
      sortable: false,
      class: 'stt_column'
    }, {
      text: 'Mã hồ sơ',
      align: 'center',
      sortable: false,
      class: 'mahoso_column'
    }, {
      text: 'Thủ tục',
      align: 'center',
      sortable: false,
      class: 'thutuc_column'
    }, {
      text: 'Chủ hồ sơ',
      align: 'center',
      sortable: false,
      class: 'chuhoso_column'
    }, {
      text: 'Địa chỉ',
      align: 'center',
      sortable: false,
      class: 'diachi_column'
    }, {
      text: 'Ngày tiếp nhận',
      align: 'center',
      sortable: false,
      class: 'ngaytiepnhan_column'
    }, {
      text: 'Ngày hẹn trả',
      align: 'center',
      sortable: false,
      class: 'ngayhentra_column'
    }, {
      text: 'Ngày gửi',
      align: 'center',
      sortable: false,
      class: 'ngaygui_column'
    }, {
      text: 'Ngày trả kết quả',
      align: 'center',
      sortable: false,
      class: 'ngaytraketqua_column'
    }],
    statusSearch: null,
    dueSearch: null,
    registerSearch: null,
    traCuuDatas: [],
    traCuuDatasTotal: 0,
    traCuuDatasPage: 1,
    keywordSearch: ''
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {},
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      if (query.hasOwnProperty('page') && query['page'] !== 1) {
        vm.traCuuDatasPage = query['page']
      } else {
        vm.traCuuDatasPage = 1
      }
    })
  },
  methods: {
    initData (data) {
      var vm = this
      vm.$store.dispatch('loadDossierCounting', {}).then(resultDossier => {
        vm.tinhTrangHoSo = resultDossier.hasOwnProperty('bystatus') ? resultDossier.bystatus : []
        vm.dangThuLy = resultDossier.hasOwnProperty('bydue') ? resultDossier.bydue : []
        vm.soTheoDoi = resultDossier.hasOwnProperty('byregister') ? resultDossier.byregister : []
      })
      vm.doLoadingDataHoSo()
    },
    goBack () {
      window.history.back()
    },
    quickSearch () {
      var vm = this
      vm.doLoadingDataHoSo()
    },
    advancedSearch () {
      var vm = this
      vm.doLoadingDataHoSo()
    },
    changeTinhTrangHoSo (item) {
      var vm = this
      vm.statusSearch = item.status
    },
    changeDangThuLy (item) {
      var vm = this
      vm.dueSearch = item.dueCode
    },
    changeSoTheoDoi (item) {
      var vm = this
      vm.registerSearch = item.register
    },
    paggingDataTraCuu (config) {
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
      console.log(currentQuery)
      let filter = {
        queryParams: '/o/rest/v2/dossiers',
        page: vm.traCuuDatasPage,
        agency: vm.govAgencyCode,
        service: vm.serviceCode,
        template: vm.templateNo,
        status: vm.statusSearch,
        dueCode: vm.dueSearch,
        register: vm.registerSearch,
        keyword: vm.keywordSearch
      }
      vm.$store.dispatch('loadingDataHoSo', filter).then(function (result) {
        vm.traCuuDatas = result.data
        vm.traCuuDatasTotal = result.total
      })
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} | ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    }
  }
}
</script>

