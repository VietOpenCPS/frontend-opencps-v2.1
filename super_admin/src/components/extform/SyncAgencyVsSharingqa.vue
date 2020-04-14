<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      "></a>
    </v-breadcrumbs>
    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{index.toString() === '0' ? 'Đồng bộ danh mục cơ quan' : 'Đồng bộ danh mục câu hỏi'}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <!-- Đồng bộ danh mục cơ quan-->
        <div class="list-thu-tuc" v-if="!isMobile && index.toString() === '0'">
          <content-placeholders class="mt-3" v-if="loading">
            <content-placeholders-text :lines="10" />
          </content-placeholders>
          <div v-else class="service__info__table">
            <v-data-table
              :headers="headersCoQuan"
              :items="listCoQuan"
              class="table-landing table-bordered"
              :rows-per-page-items="rowsPerPageItems"
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                  <td class="text-xs-center" style="border-right: 0.5px solid #aba6a6;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left" style="border-right: 0.5px solid #aba6a6;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span class="text-bold">{{props.item.itemCode}}</span> - <span>{{props.item.itemName}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <div v-for="(itemAgency, index1) in props.item.similarity" :key="index1" class="mb-2" style="position: relative;">
                        <v-tooltip top style="display: inline-block;width: 25px;position: absolute;top: -2px;">
                          <v-checkbox
                            slot="activator"
                            v-model="itemAgency.mapped"
                            primary
                            hide-details
                            color="#115ebe"
                            :disabled="loadingSync"
                            @change="doActionMappingAgency(props.item, props.index, itemAgency, index1)"
                          ></v-checkbox>
                          <span v-if="itemAgency.mapped">Chọn để hủy mapping</span>
                          <span v-else>Chọn để mapping</span>
                        </v-tooltip>
                        <span class="text-bold" :style="itemAgency.mapped ? 'margin-left: 50px' : 'margin-left: 24px'">{{itemAgency.itemCodeDVCQG}}</span> - <span>{{itemAgency.itemNameDVCQG}}</span>
                      </div>
                      <div class="mb-2" style="position: relative;">
                        <v-btn small outline color="#115ebe" @click="openDialogMapping(props.item)">Chọn</v-btn>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
              <template slot="no-data">
                <div class="text-xs-center mt-2">
                  Không có thủ tục nào được tìm thấy
                </div>
              </template>
            </v-data-table>
            <!-- <div class="text-xs-right layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div> -->
          </div>
        </div>
        <!-- Đồng bộ danh mục câu hỏi -->
        <div class="list-thu-tuc" v-if="!isMobile && index.toString() !== '0'">
          <v-layout wrap align-center class="white py-2">
            <v-flex class="xs12 sm3 px-2">
              <v-autocomplete
                class="select-border"
                :items="listLoaiHoiDap"
                v-model="loaiHoiDapySelected"
                item-text="text"
                item-value="value"
                :hide-selected="true"
                @change="changeLoaiHoiDap"
                box
                :readonly="loading"
                clearable
              ></v-autocomplete>
            </v-flex>
            <v-flex class="xs12 sm3 px-2">
              <v-autocomplete
                class="select-border"
                label="Trạng thái"
                :items="listTrangThai"
                v-model="trangThaiSelected"
                item-text="text"
                item-value="value"
                :hide-selected="true"
                box
                :readonly="loading"
                clearable
              ></v-autocomplete>
            </v-flex>
            <v-flex class="xs12 sm6">
              <v-btn style="color:#fff;"  small color="#115ebe" :loading="loadingSyncSharingqa"  @click="syncSharingqa()">Đồng bộ tất cả</v-btn>
            </v-flex>   
          </v-layout>
          <content-placeholders class="mt-3" v-if="loading">
            <content-placeholders-text :lines="10" />
          </content-placeholders>
          <div v-else class="service__info__table">
            <v-data-table
              :headers="headersCauHoi"
              :items="listCauHoiView"
              class="table-landing table-bordered"
              :rows-per-page-items="rowsPerPageItems"
              :pagination.sync="pagination"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                  <td class="text-xs-center" style="border-right: 0.5px solid #aba6a6;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left" style="border-right: 0.5px solid #aba6a6;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span class="text-bold">{{props.item.NOIDUNG}}</span>
                    </div>
                  </td>
                  <td class="text-xs-left"  style="border-right: 0.5px solid #aba6a6; width: 112px;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <span v-if="props.item.SYNC"> Đã đồng bộ</span>
                    </div>
                  </td>

                  <td class="text-xs-left" style="width:229px;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <v-layout wrap align-center>
                        <v-flex xs8><v-btn small style="color:#fff;" color="#115ebe" @click="syncSharingqa(props.item)">{{ props.item.SYNC ? 'Đồng bộ lại' : 'Đồng bộ'}}</v-btn></v-flex>
                        <v-flex xs4><v-icon style="font-size:23px;cursor: pointer;" color="#115ebe" @click="viewDetailCauHoi(props.item)">visibility</v-icon></v-flex>
                      </v-layout>
                    
                    </div>
                  </td>
                </tr>
              </template>
              <template slot="no-data">
                <div class="text-xs-center mt-2">
                  Không có câu hỏi nào được tìm thấy
                </div>
              </template>
            </v-data-table>
            <!-- <div class="text-xs-right layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData" ></tiny-pagination> 
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </v-card>
    <!-- Dialog Chi tiết câu hỏi -->
    <v-dialog v-model="dialogChiTietCauHoi" persistent max-width="600px">
        <v-card>
          <v-card-title pa-1>
            <v-layout wrap align-center>
              <v-flex xs6>
                <span class="headline">Chi tiết câu hỏi</span>
              </v-flex>
              <v-flex xs6 class="text-right">
                <v-btn color="#115ebe" fab small dark @click="dialogChiTietCauHoi = false">
                  <v-icon>exit_to_app</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Mã" readonly v-model="chiTietCauHoi.MALINHVUC"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Mã đơn vị" readonly v-model="chiTietCauHoi.MADONVI"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Tên đơn vị" readonly v-model="chiTietCauHoi.TENDONVI"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    name="input-4-1"
                    label="Nội dung:"
                    readonly
                    v-model="chiTietCauHoi.NOIDUNG"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    name="input-4-1"
                    label="Nội dung trả lời:"
                    readonly
                    v-model="chiTietCauHoi.NOIDUNGTRALOI"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
    </v-dialog>
    <!-- Popup danh sách mapping thêm -->
    <v-dialog v-model="dialogMapping" persistent max-width="600px">
        <v-card style="background: #fff;">
          <v-card-title pa-1>
            <v-layout wrap align-center>
              <v-flex xs6>
                <span class="headline">Chọn để mapping</span>
              </v-flex>
              <v-flex xs6 class="text-right">
                <v-btn color="#115ebe" fab small dark  @click="dialogMapping = false">
                  <v-icon>exit_to_app</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout>
                <v-flex xs12>
                  <v-text-field
                    label="Tìm kiếm theo tên"
                    v-model="nameDVCQGModel"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <div v-if="listMappingView.length>0" style="height: 437px;">
                <content-placeholders v-if="loadingMapping">
                      <content-placeholders-text :lines="5" />
                </content-placeholders>
                <v-layout v-else align-center style="border-bottom: 0.5px dashed" wrap v-for="(item, index) in listMappingView" :key="index">
                  <v-flex xs9 class="pa-0">
                    <span style="font-weight: bold">{{item.itemNameDVCQG}}</span>
                  </v-flex>
                  <v-flex xs3 class="text-right pa-0">
                    <v-btn small style="color:#fff;" color="#115ebe" @click="mappingAgencyDVCQG(item)">Chọn</v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <div v-else style="height: 437px;">
                <content-placeholders v-if="loadingMapping">
                      <content-placeholders-text :lines="5" />
                </content-placeholders>
                <v-layout v-else>
                  <v-flex xs12><span>Không tìm thấy dữ liệu</span></v-flex>
                </v-layout>
              </div>
              <v-layout>
                <v-flex xs12>
                  <div class="text-xs-right layout wrap " style="position: relative;">
                    <div class="flex pagging-table "> 
                      <tiny-pagination :total="listMapping.length" :page="pageMapping" custom-class="custom-tiny-class" 
                        @tiny:change-page="paggingDataMapping" ></tiny-pagination> 
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="#EF5350"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="snackbarerror = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: ['index'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    snackbarsuccess: false,
    snackbarerror: false,
    breadCrumbsitems: [
      {
        text: 'Bảng dữ liệu',
        disabled: false
      },
      {
        text: '',
        disabled: false
      }
    ],
    nameDVCQGModel: '',
    listMapping: [],
    listMappingView: [],
    dialogMapping: false,
    dialogChiTietCauHoi: false,
    loadingSyncSharingqa: false,
    dialog_createDossier: false,
    dialogVerifycation: false,
    dialogLogin: false,
    valid: false,
    userName: '',
    passWord: '',
    loadingSync: false,
    loadingMapping: false,
    serviceInfoList: [],
    listCauHoi: [],
    listCauHoiView: [],
    totalThuTuc: 0,
    thutucPage: 1,
    pageMapping: 1,
    govAgencyList: [],
    govAgencySelected: '',
    govAgencyThucHienSelected: {},
    domainList: [],
    domainListCurrent: [],
    domainSelected: {},
    levelSelected: {},
    serviceNameKey: '',
    serviceDetail: '',
    dialogGuide: false,
    loading: true,
    headersCoQuan: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Cơ quan',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    listTrangThai: [{text: 'Đã đồng bộ', value: 1},{text: 'Chưa đồng bộ', value: 2}],
    trangThaiSelected: '',
    listCoQuan: [],
    headersCauHoi: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Câu hỏi',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false,
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    listLoaiHoiDap: [{text: 'Danh sách câu hỏi được biên soạn bởi Bộ, cơ quan', value: 'LayDanhSachHoiDapBoCoQuan'},{text: 'Danh sách câu hỏi được gửi bởi công dân, doanh nghiệp', value: 'LayDanhSachHoiDapGuiTuDVCQG'}],
    loaiHoiDapySelected: '',
    isLogin: false,
    verificationApplicantCreateDossier: false,
    serviceSelected: '',
    hasCoQuanThucHien: false,
    configUrl: '',
    syncing: false,
    mappingIdArray: {},
    rowsPerPageItems: [10, 20, 30, 40],
    pagination: {
        rowsPerPage: 20
    },
    chiTietCauHoi: {},
    coQuanSelect: {}
  }),
  computed: {

  },
  created () {
    let vm = this
    // 
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      let newQuery = current.query
      vm.loaiHoiDapySelected =  currentQuery.hasOwnProperty('service') ? currentQuery.service : 'LayDanhSachHoiDapBoCoQuan'
      let queryString = '?'
      newQuery['service'] = currentQuery.hasOwnProperty('service') ? currentQuery.service : 'LayDanhSachHoiDapBoCoQuan'
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      vm.$router.push({
        path: current.path + queryString,
        query: {
          renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
        }
      })
      vm.loadingMapping = true
      let filter = {
         service: 'LayDanhMucCoQuan'
      }
      vm.$store.dispatch('getServiceAgencyDVCQG', filter).then(function (result) {
        vm.pageMapping = 1
        vm.listMapping = result.data
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.loadingMapping = false
      }).catch(function() {
        vm.listMapping = []
        vm.listMappingView = []
        vm.loadingMapping = false
      })
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentParams = newRoute.params
      let currentQuery = newRoute.query
      if (vm.index.toString() === '0') {
        vm.doLoadingAgency()
      } else {
        vm.doLoadingCauHoi()
      }
    },
    nameDVCQGModel (val) {
      let vm = this
      vm.pageMapping = 1
      vm.loadingMapping = true
      if(val){
        let test =  val.toLowerCase()
        vm.listMappingView = vm.listMapping.filter(e => {
          if(e.itemNameDVCQG.toLowerCase().search(test) >= 0 || e.itemNameDVCQG.search(test) >= 0){
            return e
          }
        }).slice(0, 10)
        vm.loadingMapping = false
      } else{
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.loadingMapping = false
      }
    },
    trangThaiSelected (val) {
      let vm = this
      if(val){
        if(val === 1) {
          vm.listCauHoiView = vm.listCauHoi.filter(e => e.SYNC === true )
        } else{
          vm.listCauHoiView = vm.listCauHoi.filter(e => e.SYNC === false )
        }
      } else{
        vm.listCauHoiView = vm.listCauHoi
      }
    }
  },
  methods: {
    filterServiceName () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = ''
        newQuery['domain'] = ''
        newQuery['keyword'] = vm.serviceNameKey
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    clearKeyword () {
      let vm = this
      vm.serviceNameKey = ''
      vm.filterServiceName()
    },
    changeAdministration () {
      var vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['agency'] = vm.govAgencySelected
        newQuery['domain'] = ''
        newQuery['keyword'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeDomain () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['domain'] = vm.domainSelected
        newQuery['keyword'] = ''
        vm.trangThaiSelected = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    changeLoaiHoiDap () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = 1
        newQuery['service'] = vm.loaiHoiDapySelected
        newQuery['keyword'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: current.path + queryString,
          query: {
            renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
          }
        })
      }, 100)
    },
    doLoadingAgency () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.listCoQuan = []
      vm.loading = true
      let params = {
        service: 'LayDanhMucCoQuan'
      }
      vm.$store.dispatch('getServiceAgency', params).then(function (result) {
        vm.loading = false
        if (result.data) {
          vm.listCoQuan = result.data  
        } else {
          vm.listCoQuan = []
        }
      }).catch(reject => {
        vm.loading = false
        vm.listCoQuan = []
      })
    },
    doLoadingCauHoi () {
      let vm = this
      let currentQuery = vm.$router.history.current.query
      vm.listCauHoi = []
      vm.listCauHoiView = []
      vm.loading = true
      let filter = null
      filter = {
        service: currentQuery.hasOwnProperty('service') ? currentQuery.service : ''
      }
      vm.$store.dispatch('getSharingqa', filter).then(function (result) {
        vm.loading = false
        if (result.result) {
          vm.listCauHoi = result.result
          
          if(vm.trangThaiSelected){
            if(vm.trangThaiSelected === 1) {
              vm.listCauHoiView = vm.listCauHoi.filter(e=>e.SYNC ===true)
            } else {
              vm.listCauHoiView = vm.listCauHoi.filter(e=>e.SYNC ===false)
            }
          }else{
            vm.listCauHoiView = vm.listCauHoi
          }
        } else {
          vm.listCauHoi = []
           vm.listCauHoiView = vm.listCauHoi
        }
      }).catch(reject => {
        vm.loading = false
        vm.listCauHoi = []
        vm.listCauHoiView = vm.listCauHoi
      })
    },
    mappingAgency (item, indexDvc, itemDvcqg, indexDvcqg) {
      let vm = this
      let removeBeforeMapping = false
      let itemRemoveBefore = ''
      let filter = {
        itemCode: item.itemCode,
        itemCodeDVCQG: itemDvcqg.itemCodeDVCQG
      }
      for (let i = 0; i < vm.listCoQuan[indexDvc]['similarity'].length; i++) {
        if (String(i) !== String(indexDvcqg) && vm.listCoQuan[indexDvc]['similarity'][i]['mapped']) {
          vm.listCoQuan[indexDvc]['similarity'][i]['mapped'] = false
          itemRemoveBefore = vm.listCoQuan[indexDvc]['similarity'][i]
          removeBeforeMapping = true
          break
        }
      }
      console.log('filterMapping', filter)
      if (!removeBeforeMapping) {
        console.log('222222222222222')
        vm.$store.dispatch('mappingServiceAgency', filter).then(function (result) {
          if(result){
            // toastr.success('Mapping cơ quan thành công')
            vm.snackbarsuccess = true
            // vm.doLoadingAgency()
          } else {
            vm.snackbarerror = true
            //  toastr.error('Mapping cơ quan thất bại')
          }
          vm.loadingSync = false
        }).catch(function() {
          vm.snackbarerror = true
          // toastr.error('Mapping cơ quan thất bại')
          vm.loadingSync = false
        })
      } else {
        let filter2 = {
          dictItemMappingId: itemRemoveBefore.dictItemMappingId
        }
        console.log('itemRemoveBefore', itemRemoveBefore, filter2)
        vm.$store.dispatch('mappingServiceAgency', filter).then(function (result) {
            if (result) {
              // vm.doLoadingAgency()
              vm.snackbarsuccess = true
              // toastr.success('Mapping cơ quan thành công')
            } else {
              // toastr.error('Mapping cơ quan thất bại')
              vm.snackbarerror = true
            }
            vm.loadingSync = false
          }).catch(function() {
            vm.snackbarerror = true
            // toastr.error('Mapping cơ quan thất bại')
            vm.loadingSync = false
          })
        // vm.$store.dispatch('removeMappingServiceAgency', filter2).then(function (result) {

        // }).catch(function() {
        //   vm.loadingSync = false
        // })
      }
    },
    doActionMappingAgency(item, index, itemAgency, indexDomain) {
      console.log(item, index, itemAgency, indexDomain)
      let vm = this
      setTimeout(function() {
        if (itemAgency['mapped']) {
          vm.mappingAgency(item, index, itemAgency, indexDomain)
        } else {
          vm.removeMappingAgency(item, index, itemAgency, indexDomain)
        }
        vm.loadingSync = true
      }, 300)
    },
    syncSharingqa (item) {
      let vm = this
      vm.loadingSyncSharingqa = true
      item = item ? item : {}
      vm.$store.dispatch('syncSharingqa', item).then(function (result) {
        if(result.data.length){
          // toastr.success('Đồng bộ thành công')
          vm.snackbarsuccess = true
          vm.loadingSyncSharingqa = false
          // vm.doLoadingCauHoi()
          for (let i = 0; i < vm.listCauHoi.length; i++) {
            if (vm.listCauHoi[i].HOIDAPID === item.HOIDAPID) {
              vm.listCauHoi[i].SYNC = true
              break
            }
          }
          for (let i = 0; i < vm.listCauHoiView.length; i++) {
            if (vm.listCauHoiView[i].HOIDAPID === item.HOIDAPID) {
              vm.listCauHoiView[i].SYNC = true
              break
            }
          }
        } else{

          vm.loadingSyncSharingqa = false
          // toastr.error('Đồng bộ thất bại')
          vm.snackbarerror = true
        }

      }).catch(function() {

        vm.loadingSyncSharingqa = false
        // toastr.error('Đồng bộ thất bại')
        vm.snackbarerror = true
      })
    },
    removeMappingAgency (item, indexDvc, itemDvcqg, index) {
      let vm = this
      let filter = {
        dictItemMappingId: itemDvcqg.dictItemMappingId
      }
      vm.$store.dispatch('removeMappingServiceAgency', filter).then(function (result) {
        // toastr.success('Hủy đồng bộ thành công')
        // vm.doLoadingAgency()
        vm.snackbarsuccess = true
        vm.loadingSync = false
      }).catch(function() {
        // toastr.error('Hủy đồng bộ thất bại')
        vm.snackbarerror = true
        vm.loadingSync = false
      })
    },
    syncAll () {
      let vm = this
    },
    paggingData (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    paggingDataMapping (config) {
      let vm = this
      let start = config.page * 10 - 10
      let end = config.page * 10
      vm.listMappingView = vm.listMapping.slice(start, end)
    },
    getColor (level) {
      if (level === 2) {
        return 'green'
      } else if (level === 3) {
        return 'orange darken-1'
      } else if (level === 4) {
        return 'red'
      }
    },
    viewDetailCauHoi (item) {
      let vm = this
      vm.chiTietCauHoi = item
      vm.dialogChiTietCauHoi = true
    },
    openDialogMapping (item) {
      let vm = this
      vm.coQuanSelect = item
      vm.pageMapping = 1
      vm.nameDVCQGModel = item.itemName
      vm.dialogMapping = true
    },
    mappingAgencyDVCQG (item) {
      let vm = this
      let filter = {
        itemCode: vm.coQuanSelect.itemCode,
        itemCodeDVCQG: item.itemCodeDVCQG
      }
      vm.$store.dispatch('mappingServiceAgency', filter).then(function (result) {
        if(result){
          vm.dialogMapping =  false
          // toastr.success('Mapping thành công')
          for (let i = 0; i < vm.listCoQuan.length; i++) {
            if(vm.listCoQuan[i].itemCode === vm.coQuanSelect.itemCode){
              for (let j = 0; j < vm.listCoQuan[i]['similarity'].length; j++){
                vm.listCoQuan[i]['similarity'][j].mapped =  false
              }
              vm.listCoQuan[i]['similarity'].push({itemCodeDVCQG: item.itemCodeDVCQG, itemNameDVCQG: item.itemNameDVCQG, mapped: true})
              break
            }
          }
          // vm.doLoadingAgency()
          vm.snackbarsuccess = true
        } else {
            // toastr.error('Mapping thất bại')
          vm.snackbarerror = true
        }
        vm.loadingSync = false
      }).catch(function() {
        // toastr.error('Mapping thất bại')
        vm.snackbarerror = true
        vm.loadingSync = false
      })
    },
    backToList () {
      window.history.back()
    }
  }
}
</script>
