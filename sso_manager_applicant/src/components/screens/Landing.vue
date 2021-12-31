<template>
  <div>
    <v-card>
      <div class="row-header no__hidden_class">
        <div class="background-triangle-big">
          <span>QUẢN LÝ THÔNG TIN CÔNG DÂN, CƠ QUAN TỔ CHỨC, DOANH NGHIỆP</span>
        </div>
        <div class="layout row wrap header_tools row-blue mx-1">
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <!-- <v-btn color="blue darken-3" dark class="my-0 mx-0 btn-border-left" @click="huongDanSuDung">
              Hướng dẫn sử dụng
            </v-btn> -->
          </div>
        </div>
      </div>
      
      <v-card-text class="px-0 pt-0">
        <v-layout wrap class="">
          <v-flex xs12 class="pr-2 mt-3">
            <div class="text-bold d-inline-block mr-3" style="color: #903938;line-height: 24px;vertical-align: top;">Đối tượng người dùng: </div>
            <v-radio-group class="pt-0 d-inline-block ml-3 mt-0" v-model="typeSearch" row>
              <v-radio label="Công dân" :value="'citizen'"></v-radio>
              <v-radio label="Tổ chức, doanh nghiệp" :value="'business'"></v-radio>
            </v-radio-group>
          </v-flex>

          <v-flex xs12 sm6 class="pr-2 input-group--text-field-box mt-1">
            <v-text-field
                :label="typeSearch === 'citizen' ? 'Tên người dùng, số CMND/ căn cước, mã tổ chức, doanh nghiệp' : 'Tên tổ chức, doanh nghiệp, mã tổ chức, doanh nghiệp'"
                v-model="keywordSearch"
                append-icon="search"
                box
                clear-icon="clear"
                clearable
                @keyup.enter="getDanhMuc()"
                @click:clear="clearKeyword()"
                @click:append="getDanhMuc()"
              ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 class="input-group--text-field-box mt-1 pl-2">
            <v-autocomplete
              class="flex input-form"
              hide-no-data
              box
              label="Tình trạng tài khoản"
              :items="itemsTinhTrang"
              v-model="tinhTrangSearch"
              item-text="tenMuc"
              item-value="maMuc"
              hide-details="auto"
              clearable
              @change="getDanhMuc()"
            >
          </v-flex>
        </v-layout>
        <div style="text-align: right">
          <v-btn color="blue darken-3" dark @click="addApplicant">
            <v-icon size="16">add</v-icon>&nbsp;Thêm mới
          </v-btn>
        </div>
        <!--  -->
        <v-data-table
          v-if="typeSearch === 'citizen'"
          :headers="applicantListHeaderCongDan"
          :items="itemsApplicant"
          hide-actions
          class="table-landing table-bordered mt-3"
          style="border-left: 1px solid #dedede"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center" style="width:50px;height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{ (page + 1) * itemsPerPage - itemsPerPage + props.index + 1 }}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.hoVaTen}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.maSoCaNhan}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <div>
                    <v-icon size="16">phone_in_talk</v-icon>&nbsp; {{ props.item.danhBaLienLac['soDienThoai'] }}
                  </div>
                  <div>
                    <v-icon size="16">mail_outline</v-icon>&nbsp; {{ props.item.danhBaLienLac['thuDienTu'] }}
                  </div>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px;min-width:200px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span v-if="total && props.item.noiOHienTai['soNhaChiTiet']">{{props.item.noiOHienTai['soNhaChiTiet']}}, </span>
                  <span v-if="total && props.item.noiOHienTai['phuongXa']['tenMuc']">{{props.item.noiOHienTai['phuongXa']['tenMuc']}} - </span>
                  <span v-if="total && props.item.noiOHienTai['quanHuyen']['tenMuc']">{{props.item.noiOHienTai['quanHuyen']['tenMuc']}} - </span>
                  <span v-if="total && props.item.noiOHienTai['tinhThanh']['tenMuc']">{{props.item.noiOHienTai['tinhThanh']['tenMuc']}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else :style="getColor(props.item.danhTinhDienTu)">
                  {{ getStatus(props.item.danhTinhDienTu) }}
                </div>
              </td>
              <td class="text-xs-center" style="height:36px;width: 90px">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-tooltip top v-if="!loadingData">
                  <v-btn @click="showEditApplicant(props.item)" color="green" slot="activator" flat icon class="mx-0 mr-3 my-0">
                    <v-icon size="22">edit</v-icon>
                  </v-btn>
                  <span>Cập nhật thông tin</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có công dân
            </div>
          </template>
        </v-data-table>
        <!--  -->
        <v-data-table
          v-if="typeSearch === 'business'"
          :headers="applicantListHeaderDoanhNghiep"
          :items="itemsApplicant"
          hide-actions
          class="table-landing table-bordered mt-3"
          style="border-left: 1px solid #dedede"
        >
          <template slot="items" slot-scope="props">
            <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
              <td class="text-xs-center" style="width:50px;height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{ (page + 1) * itemsPerPage - itemsPerPage + props.index + 1 }}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.tenGoi}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span>{{props.item.maSoDoanhNghiep}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <div>
                    <v-icon size="16">phone_in_talk</v-icon>&nbsp; {{ props.item.danhBaLienLac['soDienThoai'] }}
                  </div>
                  <div>
                    <v-icon size="16">mail_outline</v-icon>&nbsp; {{ props.item.danhBaLienLac['thuDienTu'] }}
                  </div>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px;min-width:200px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else>
                  <span v-if="total && props.item.diaChiHoatDong['soNhaChiTiet']">{{props.item.diaChiHoatDong['soNhaChiTiet']}}, </span>
                  <span v-if="total && props.item.diaChiHoatDong['phuongXa']['tenMuc']">{{props.item.diaChiHoatDong['phuongXa']['tenMuc']}} - </span>
                  <span v-if="total && props.item.diaChiHoatDong['quanHuyen']['tenMuc']">{{props.item.diaChiHoatDong['quanHuyen']['tenMuc']}} - </span>
                  <span v-if="total && props.item.diaChiHoatDong['tinhThanh']['tenMuc']">{{props.item.diaChiHoatDong['tinhThanh']['tenMuc']}}</span>
                </div>
              </td>
              <td class="text-xs-left" style="height:36px" @click="showEditApplicant(props.item)">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <div v-else :style="getColor(props.item.danhTinhDienTu)">
                  {{ getStatus(props.item.danhTinhDienTu) }}
                </div>
              </td>
              <td class="text-xs-center" style="height:36px;width: 90px">
                <content-placeholders v-if="loadingData">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-tooltip top v-if="!loadingData">
                  <v-btn @click="showEditApplicant(props.item)" color="green" slot="activator" flat icon class="mx-0 mr-3 my-0">
                    <v-icon size="22">edit</v-icon>
                  </v-btn>
                  <span>Cập nhật thông tin</span>
                </v-tooltip>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <div class="text-xs-center mt-2">
              Không có tổ chức, doanh nghiệp
            </div>
          </template>
        </v-data-table>
        <!--  -->
        <div class="my-2" v-if="pageCount">
          <div class="text-xs-right layout wrap" style="position: relative;">
            <div class="flex pagging-table"> 
              <tiny-pagination :total="total" :page="page + 1" :currentLimit='itemsPerPage' nameRecord="" custom-class="custom-tiny-class" 
                @tiny:change-page="changePage" ></tiny-pagination> 
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import axios from 'axios'
import support from '../../store/support.json'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    hasVerification: false,
    verificationApplicant: false,
    typeUpdateApplicant: 'update',
    keySearch: '',
    idNoSearch: '',
    typeSearch: 'citizen',
    applicantListHeaderCongDan: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Họ tên',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số CMND/ CCCD',
        align: 'center',
        sortable: false
      },
      {
        text: 'Điện thoại/ Email',
        align: 'center',
        sortable: false
      },
      {
        text: 'Địa chỉ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    applicantListHeaderDoanhNghiep: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên tổ chức, doanh nghiệp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã tổ chức, doanh nghiệp',
        align: 'center',
        sortable: false
      },
      {
        text: 'Điện thoại/ Email',
        align: 'center',
        sortable: false
      },
      {
        text: 'Địa chỉ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tình trạng',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    applicantLists: '',
    applicantTypeLists: [
      {text: 'Công dân', value: 'citizen'},
      {text: 'Doanh nghiệp', value: 'business'},
      {text: 'Cơ quan, tổ chức', value: 'organization'}
    ],
    loadingTable: false,
    numberPerPage: 30,
    applicantPage: 1,
    totalApplicantSearch: 0,
    menuBirthDate: false,
    toDateFormatted: null,
    dialog_editApplicant: false,
    urlFileHdsdKhoDienTu: '',
    dialogHDSD: false,
    valid: true,
    applicantEdit: '',
    ngayCap: null,
    cityItems: [],
    districtItems: [],
    wardItems: [],
    rolesUser: [],
    rules: {
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Địa chỉ Email không hợp lệ'
      }
    },


    selected: [],
    keywordSearch: '',
    loadingData: false,
    itemsTinhTrang: [],
    tinhTrangSearch: '',
    itemsApplicant: [],
    page: 0,
    itemsPerPage: 20,
    total: 0,
    chuaCapTaiKhoan: false,
    daCapTaiKhoan: false,
    pageCount: 0
  }),
  computed: {
    
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      setTimeout (function () {
        vm.getDanhMuc('reset')
        vm.getDanhMucSearch('tinhtrangsudungtaikhoan')
      }, 2000)
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  mounted () {
    
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
    },
    typeSearch (val) {
      let vm = this
      vm.getDanhMuc('reset')
    }
  },
  methods: {
    huongDanSuDung () {
      let vm = this
      try {
        vm.urlFileHdsdKhoDienTu = urlFileHdsdKhoDienTu
      } catch (error) {
      }
      vm.dialogHDSD = true
    },
    addApplicant () {
      let vm = this
      if (vm.typeSearch === 'citizen') {
        vm.$router.push({ path: '/cong-dan/0' })
      } else {
        vm.$router.push({ path: '/doanh-nghiep/0' })
      }
    },
    getDanhMuc (type) {
      let vm = this
      if (type === 'reset') {
        vm.keywordSearch = ''
        vm.total = 0
        vm.pageCount = 0
        vm.page = 0
      }
      if (vm.loadingData) {
        return
      }
      vm.loadingData = true
      let filter = {
        collectionName: vm.typeSearch === 'citizen' ? 'canhan' : 'donvikinhdoanh',
        data: {
          keyword: vm.keywordSearch,
          page: vm.page,
          size: vm.itemsPerPage,
          orderFields: 'hoVaTen',
          orderTypes: 'asc',
          danhTinhDienTu_tinhTrangSuDungTaiKhoan_maMuc: vm.tinhTrangSearch
        }
      }
      vm.$store.dispatch('collectionFilter', filter).then(function (response) {
        vm.loadingData = false
        vm.itemsApplicant = response.content
        vm.total = response.totalElements
        vm.pageCount = response.totalPages
      }).catch(function () {
        vm.loadingData = false
        vm.itemsApplicant = []
        vm.total = 0
        vm.pageCount = 0
      })
    },
    getDanhMucSearch (name) {
      let vm = this
      let filter = {
        collectionName: name,
        data: {
          keyword: '',
          page: 0,
          size: 100,
          orderFields: 'maMuc',
          orderTypes: 'asc',
          tinhTrang: '1',
          thamChieu_maMuc: ''
        }
      }
      vm.$store.dispatch('collectionFilter', filter).then(function (response) {
        vm.itemsTinhTrang = response.content
      }).catch(function () {
      })
    },
    getStatus(danhTinhDienTu) {
      return danhTinhDienTu[0] ? danhTinhDienTu[0].tinhTrangSuDungTaiKhoan['tenMuc'] : 'Chưa tạo tài khoản'
    },
    getColor (danhTinhDienTu) {
      let status = danhTinhDienTu[0] ? String(danhTinhDienTu[0].tinhTrangSuDungTaiKhoan['maMuc']) : '0'
      switch(status) {
        case '1':
            return 'color: blue'
        case '2':
            return 'color: green'
        case '3':
          return 'color: orange'
        case '4':
          return 'color: red'
        default:
          return 'color: black'
      }
    },
    dateLocale (dateInput) {
      let date = new Date(dateInput)
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    },
    goBack () {
      window.history.back()
    },
    clearKeyword () {
      let vm = this
      vm.keywordSearch = ''
      vm.getDanhMuc()
    },
    changePage (config) {
      let vm = this
      vm.page = config.page - 1
      vm.getDanhMuc()
    },
    showEditApplicant (item) {
      let vm = this
      if (vm.typeSearch === 'citizen') {
        vm.$router.push({ path: '/thong-tin-ca-nhan/' + item.primKey })
      } else {
        vm.$router.push({ path: '/thong-tin-doanh-nghiep/' + item.primKey })
      }
    }
  }
}
</script>
