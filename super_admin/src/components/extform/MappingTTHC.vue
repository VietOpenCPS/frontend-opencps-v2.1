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
    <!-- layout for desktop -->
    <!-- Đồng bộ thủ tục hành chính từ DVCQG-->
    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Mapping Thủ tục hành chính
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
        <div class="list-thu-tuc" v-if="!isMobile" >
          <v-layout wrap class="white py-2">
            <v-flex class="xs12 sm6 px-2">
              <v-autocomplete
                class="select-border"
                :items="listTimKiemTheo"
                v-model="timKiemTheoSelected"
                label="Tìm kiếm theo"
                item-text="text"
                item-value="value"
                :hide-selected="true"
                @change="changeTimKiemTheo"
                box
                :readonly="loading"
              ></v-autocomplete>
            </v-flex>
            <v-flex class="xs12 sm6 px-2">
              <v-autocomplete
                class="select-border"
                :items="listTrangThai"
                v-model="trangThaiSelected"
                label="Trạng thái"
                item-text="text"
                item-value="value"
                :hide-selected="true"
                @change="changeTrangThai"
                box
                :readonly="loading"
                clearable
              ></v-autocomplete>
            </v-flex>
            <v-flex class="xs12 sm6 px-2">
              <v-text-field
                class="select-border"
                label="Tên thủ tục"
                v-model="tenThuTucModel"
                box
              ></v-text-field>
            </v-flex>    
          </v-layout>
          <content-placeholders class="mt-3" v-if="loading">
            <content-placeholders-text :lines="10" />
          </content-placeholders>
          <div v-else class="service__info__table">
            <v-data-table
                v-if="timKiemTheoSelected === 'DonVi'"
                :headers="headers"
                :items="serviceInfoListDonViView"
                hide-actions
                class="table-landing table-bordered"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                  <td class="text-xs-center">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{ thutucPage*pageSize - pageSize + props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-layout wrap>
                            <v-flex xs12 @click="openDialogChiTietThuTucDonVi(props.item)">
                                <span class="text-bold">{{props.item.serviceCode}}</span> - <span>{{props.item.serviceName}}</span>
                            </v-flex>
                        </v-layout>
                    </div>
                  </td>
                  <td class="text-xs-left" style="min-width: 400px;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-layout wrap v-if="props.item.serviceCodeDVCQG === '' ">
                            <v-flex xs12 class="text-right"> 
                                <v-btn small outline color="primary" @click="openDialogMappingDVCQG(props.item)">Mapping</v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout v-else align-center wrap>
                            <v-flex xs8  @click="openDialogChiTietThuTucDVCQG(props.item)">
                                <span class="text-bold">{{props.item.serviceCodeDVCQG}}</span> - <span>{{props.item.serviceNameDVCQG}}</span>
                            </v-flex>
                            <v-flex xs4 class="text-right">
                                <v-btn small outline color="primary" @click="removeMapping(props.item)">Huỷ mapping</v-btn>
                                <v-btn small outline color="primary" v-if="props.item.synced === 0" @click="syncServiceinfo(props.item)">Đồng bộ</v-btn>
                            </v-flex>
                        </v-layout>
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
            <v-data-table
                v-if="timKiemTheoSelected === 'DVCQG'"
                :headers="headers"
                :items="serviceInfoListDVCQGView"
                hide-actions
                class="table-landing table-bordered"
            >
              <template slot="items" slot-scope="props">
                <tr v-bind:class="{'active': props.index%2==1}">
                  <td class="text-xs-center">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                      <span>{{thutucPage*pageSize - pageSize + props.index + 1}}</span><br>
                    </div>
                  </td>
                  <td class="text-xs-left" style="min-width: 471px;">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-layout wrap v-if="props.item.serviceCode">
                            <v-flex xs6 @click="openDialogChiTietThuTucDonVi(props.item)"><span class="text-bold" >{{props.item.serviceCode}}</span> - <span>{{props.item.serviceName}}</span></v-flex>
                            <v-flex xs6 class="text-right"> 
                                <v-btn small outline color="primary"  @click="removeMapping(props.item)">Hủy mapping</v-btn>
                            </v-flex>
                        </v-layout>
                        <v-layout v-else align-center justify-center wrap>
                            <v-flex xs6 class="text-right">
                                <v-btn small outline color="primary" @click="openDialogChiTietThuTucThem(props.item)">Thêm vào đơn vị</v-btn>
                            </v-flex>
                            <v-flex xs6 class="text-left">
                                <v-btn small outline color="primary" @click="openDialogMappingDonVi(props.item)">Mapping</v-btn>
                            </v-flex>
                        </v-layout>
                    </div>
                  </td>
                  <td class="text-xs-left">
                    <content-placeholders v-if="loading">
                      <content-placeholders-text :lines="1" />
                    </content-placeholders>
                    <div v-else>
                        <v-layout wrap>
                            <v-flex xs12 @click="openDialogChiTietThuTucDVCQG(props.item)">
                                <span class="text-bold" >{{props.item.serviceCodeDVCQG}}</span> - <span>{{props.item.serviceNameDVCQG}}</span>
                            </v-flex>
                        </v-layout>
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
            <div class="text-xs-right layout wrap mt-2" style="position: relative;">
              <div class="flex pagging-table px-2"> 
                <tiny-pagination :total="totalThuTuc" :page="thutucPage" custom-class="custom-tiny-class" 
                  @tiny:change-page="paggingData"></tiny-pagination> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Popup danh sách mapping thêm -->
    <v-dialog v-model="dialogMapping" persistent max-width="600px">
        <v-card style="background: #fff;">
          <v-card-title>
            <span class="headline">Chọn để mapping</span>
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
            
              <div v-if="listMappingView.length>0"  style="height: 437px;overflow-y: scroll;padding: 0 10px;">
                <content-placeholders v-if="loadingMapping">
                      <content-placeholders-text :lines="5" />
                </content-placeholders>
                <v-layout v-else align-center style="border-bottom: 0.5px dashed" wrap v-for="(item, index) in listMappingView" :key="index">
                  <v-flex xs9 class="pa-0">
                    <span style="font-weight: bold">{{timKiemTheoSelected === 'DonVi' ? item.serviceNameDVCQG : item.serviceName}}</span>
                  </v-flex>
                  <v-flex xs3  class="text-right pa-0">
                    <v-btn small color="primary" @click="mappingTTHC(item)">Chọn</v-btn>
                  </v-flex>
                </v-layout>
              </div>
              <div v-else style="height: 437px;">
                <v-layout>
                  <v-flex xs12><span>Không tìm thấy dữ liệu</span></v-flex>
                </v-layout>
              </div>
              <v-layout>
                <v-flex xs12>
                  <div class="text-xs-right layout wrap" style="position: relative;">
                    <div class="flex pagging-table"> 
                      <tiny-pagination :total="listMapping.length" :page="pageMapping" custom-class="custom-tiny-class" 
                        @tiny:change-page="paggingDataMapping" ></tiny-pagination> 
                    </div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-layout>
            <v-flex xs12 class="text-right">
            <v-btn color="blue darken-1" flat @click="dialogMapping = false">Đóng</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
    </v-dialog>
    <!-- Popup danh sách chi tiết TTHC DVCQG -->
    <v-dialog v-model="dialogChiTietThuTucDVCQG" persistent max-width="900px">
      <v-card style="background: #fff;">
        <v-card-title>
          <span class="headline">Chi tiết thủ tục</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-tabs
                v-model="active"
                color="cyan"
                dark
                slider-color="yellow"
            >
                <v-tab
                  v-for="n in tabDetailServiecs"
                  :key="n"
                  ripple
                >
                    {{ n.text }}

                </v-tab>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-layout wrap align-center>
                        <v-flex xs12 style="border-bottom: 0.5px solid;">
                          <v-layout wrap>
                            <v-flex xs3 style="border-right: 0.5px solid;"><strong>Mã thủ tục</strong></v-flex>
                            <v-flex xs9><span>{{serviceDVCQGDetail[0].MATTHC}}</span></v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 style="border-bottom: 0.5px solid;">
                          <v-layout wrap>
                            <v-flex xs3 style="border-right: 0.5px solid;"><strong>Cơ quan thực hiện</strong></v-flex>
                            <v-flex xs9><p v-for="(item, index) in serviceDVCQGDetail[0].COQUANTHUCHIEN" :key="index">{{item.TENDONVI}}</p></v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 style="border-bottom: 0.5px solid;">
                          <v-layout wrap>
                            <v-flex xs3 style="border-right: 0.5px solid;"><strong>Lĩnh vực</strong></v-flex>
                            <v-flex xs9><p v-for="(item, index) in serviceDVCQGDetail[0].LINHVUCTHUCHIEN" :key="index">{{item.TENLINHVUC}}</p></v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 style="border-bottom: 0.5px solid;">
                          <v-layout wrap>
                            <v-flex xs3 style="border-right: 0.5px solid;"><strong>Cách thực hiện</strong></v-flex>
                            <v-flex xs9><p v-for="(item, index) in serviceDVCQGDetail[0].CACHTHUCTHUCHIEN" :key="index">- {{item.THOIGIAN[0].MOTA}}</p></v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 style="border-bottom: 0.5px solid;">
                          <v-layout wrap>
                            <v-flex xs3 style="border-right: 0.5px solid;"><strong>Đối tượng thực hiện</strong></v-flex>
                            <v-flex xs9><p v-for="(item, index) in serviceDVCQGDetail[0].DOITUONGTHUCHIEN" :key="index">- {{item.TENDOITUONG}}</p></v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-layout wrap>
                        <v-flex xs12 v-for="(item, index) in serviceDVCQGDetail[0].TRINHTUTHUCHIEN" :key="index">
                          <p>{{item.TRUONGHOP}}</p>
                          <p>-{{item.TRINHTU[0].TENTRINHTU}}</p>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-layout wrap>
                        <v-flex xs12 v-for="(item, index) in serviceDVCQGDetail[0].THANHPHANHOSO[0].GIAYTO" :key="index">
                          <p>-{{item.TENGIAYTO}}</p>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text>
                      <v-layout wrap>
                        <v-flex>
                          <p>{{serviceDVCQGDetail.YEUCAU ? serviceDVCQGDetail.YEUCAU : 'Không có'}}</p>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
          </v-container>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-layout>
          <v-flex xs12 class="text-right">
            <v-btn  color="blue darken-1 mx-2" v-if="btnThem"  @click="addTTHC()"> Xác nhận</v-btn>
          <v-btn color="blue darken-1" flat @click="dialogChiTietThuTucDVCQG = false">Đóng</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- Popup danh sách chi tiết TTHC Don Vi -->
    <v-dialog v-model="dialogChiTietThuTucDonVi" persistent max-width="900px">
      <v-card style="background: #fff;">
        <v-card-title>
          <span class="headline">Chi tiết thủ tục</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <div class="mt-0">
              <v-tabs
                v-model="active"
                color="cyan"
                dark
                slider-color="yellow"
              >
                <v-tab key="1" ripple class="mr-2"> Thông tin chung </v-tab>
                <v-tab key="2" ripple class="mr-2"> Trình tự thực hiện</v-tab>
                <v-tab key="3" ripple class="mr-2"> Thành phần hồ sơ </v-tab>
                <v-tab key="4" ripple class="mr-2"> Yêu cầu điều kiện </v-tab>
                <v-tab-item key="1" class="wrap-scroll wrap-scroll-sevice">
                  <v-card>
                    <v-card-text class="px-0 py-0">
                      <div class="table-detail-domain table-bordered">
                        <div class="table__overflow">
                          <table class="datatable table">
                            <tbody>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Mã thủ tục</span></td>
                                <td class="pt-2"><span>{{serviceDonViDetail.serviceCode}}</span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Cơ quan quản lý</span></td>
                                <td class="pt-2"><span>{{serviceDonViDetail.administrationName}}</span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Lĩnh vực</span></td>
                                <td class="pt-2"><span>{{serviceDonViDetail.domainName}}</span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Cách thực hiện</span></td>
                                <td class="pt-2"><span v-html="serviceDonViDetail.methodText"></span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Thời gian giải quyết</span></td>
                                <td class="pt-2"><span v-html="serviceDonViDetail.durationText"></span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Đối tượng</span></td>
                                <td class="pt-2"><span v-html="serviceDonViDetail.applicantText"></span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Kết quả giải quyết</span></td>
                                <td class="pt-2"><span v-html="serviceDonViDetail.resultText"></span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Lệ phí</span></td>
                                <td class="pt-2"><span v-html="serviceDonViDetail.feeText"></span></td>
                              </tr>
                              <tr>
                                <td class="pt-2"><span class="text-bold">Căn cứ pháp lý</span></td>
                                <td class="pt-2"><span v-html="serviceDonViDetail.regularText"></span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item key="2" class="wrap-scroll wrap-scroll-sevice">
                  <v-card>
                    <v-card-text>
                      <div v-html="serviceDonViDetail.processText"></div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item key="3" class="wrap-scroll wrap-scroll-sevice">
                  <v-card>
                    <v-card-text>
                      <div v-html="serviceDonViDetail.dossierText"></div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item key="4" class="wrap-scroll wrap-scroll-sevice">
                  <v-card>
                    <v-card-text>
                      <div v-html="serviceDonViDetail.conditionText"></div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </div>
          </v-container>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-layout>
          <v-flex xs12 class="text-right">
          <v-btn color="blue darken-1" flat @click="dialogChiTietThuTucDonVi = false">Đóng</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
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
    loading: true,
    btnThem : false,
    dialogMapping: false,
    dialogChiTietThuTucDonVi: false,
    dialogChiTietThuTucDVCQG: false,
    loadingMapping: false,
    tenThuTucModel: '',
    timKiemTheoSelected: '',
    trangThaiSelected: '',
    listTrangThai: [{text: 'Tất cả', value: ''}, {text: 'Đã đồng bộ', value: 'true'}, {text: 'Chưa đồng bộ', value: 'false'}],
    listTimKiemTheo: [{text: 'Tìm kiếm theo TTHC đơn vị', value: 'DonVi'},{text: 'Tìm kiếm theo TTHC DVC QG', value: 'DVCQG'}],
    tabDetailServiecs: [{text: "Thông tin chung"},{text: "Trình tự thực hiên"},{text: "Thành phần hồ sơ"},{text: "Yêu cầu điều kiện"}],
    serviceInfoListDonVi: [],
    serviceInfoListDonViView: [],
    serviceInfoListDVCQG: [],
    serviceInfoListDVCQGView: [],
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'TTHC tại đơn vị',
        align: 'center',
        sortable: false
      },
      {
        text: 'TTHC tại DVCQG',
        align: 'center',
        sortable: false
      }
    ],
    nameDVCQGModel: '',
    listMappingView: [],
    listMapping: [],
    pageMapping: 1,
    totalThuTuc: 0,
    thutucPage: 1,
    pageSize: 20,
    serviceSelect: {},
    serviceDVCQGDetail: [
      {
            CACHTHUCTHUCHIEN: [     ],
            TENTTHC: "",
            CANCUPHAPLY: [],
            COQUANCOTHAMQUYEN: [],
            MOTACOQUANTHUCHIEN: "",
            COQUANTHUCHIEN: [],
            TTHCLIENTHONG: [],
            COQUANDUOCUYQUYEN: [],
            THANHPHANHOSO: [
                {
                    TRUONGHOP: "", 
                    GIAYTO: []
                }
            ],
            DIACHITIEPNHAN: "",
            TUKHOA: "",
            COQUANPHOIHOP: [],
            LOAITTHC: "",
            MOTADOITUONGTHUCHIEN: "",
            ID: "",
            LINHVUCTHUCHIEN: [],
            YEUCAU: "",
            TRINHTUTHUCHIEN: [],
            MACOQUANCONGBO: "",
            TTHCLIENQUAN: [],
            DOITUONGTHUCHIEN: [],
            TRANGTHAI: "",
            MOTA: "",
            MATTHC: "",
            IDQUYETDINHCONGBO: "",
            MOTACOQUANTHAMQUYEN: "",
            CAPTHUCHIEN: [],
            KETQUATHUCHIEN: []
      }
    ],
    serviceDonViDetail : {

    }
  }),
  computed: {

  },
  created () {
    let vm = this
    // 
    vm.$nextTick(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['mapping'] = newQuery.hasOwnProperty('mapping') && newQuery.mapping ? newQuery.mapping : ''
        newQuery['timkiemtheo'] = newQuery.hasOwnProperty('timkiemtheo') && newQuery.timkiemtheo ? newQuery.timkiemtheo : 'DonVi'
        vm.timKiemTheoSelected = newQuery.hasOwnProperty('timkiemtheo') && newQuery.timkiemtheo ? newQuery.timkiemtheo : 'DonVi' 
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
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
        let vm = this
        let currentQuery = vm.$router.history.current.query
        if(currentQuery.timkiemtheo === 'DonVi') {
            vm.doLoadingThuTucDonVi()
        }
        if (currentQuery.timkiemtheo === 'DVCQG') {
            vm.doLoadingThuTucDVCQG()
        }
    },
    nameDVCQGModel (val) {
      let vm = this
      vm.pageMapping = 1
      vm.loadingMapping = true
      if(val){
        if(vm.timKiemTheoSelected === 'DonVi') {
          vm.listMappingView = vm.listMapping.filter(e => e.serviceNameDVCQG.search(val) >= 0 ).slice(0, 10)
        } else {
          vm.listMappingView = vm.listMapping.filter(e => e.serviceName.search(val) >= 0 ).slice(0, 10)
        }
        
        vm.loadingMapping = false
      } else{
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.loadingMapping = false
      }
    },
    tenThuTucModel (val) {
      let vm = this
      vm.thutucPage = 1
      if(val){
        if(vm.timKiemTheoSelected === 'DonVi') {
          vm.serviceInfoListDonViView = vm.serviceInfoListDonVi.filter(e => e.serviceName.search(val) >= 0 ).slice(0, vm.pageSize)
        } else {
          vm.serviceInfoListDVCQGView = vm.serviceInfoListDVCQG.filter(e => e.serviceNameDVCQG.search(val) >= 0 ).slice(0, vm.pageSize)
        }
        
      } else{
        if(vm.timKiemTheoSelected === 'DonVi') {
          vm.serviceInfoListDonViView = vm.serviceInfoListDonVi.slice(0, vm.pageSize)
        } else {
          vm.serviceInfoListDVCQGView = vm.serviceInfoListDVCQG.slice(0, vm.pageSize)
        }
      }  
    }
  },
  methods: {
    changeTrangThai () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['mapping'] = vm.trangThaiSelected
        newQuery['timkiemtheo'] = vm.timKiemTheoSelected
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
    changeTimKiemTheo () {
      let vm = this
      setTimeout(function () {
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['mapping'] = vm.trangThaiSelected
        newQuery['timkiemtheo'] = vm.timKiemTheoSelected
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
    doLoadingThuTucDonVi () {
      let vm = this
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
          mapping: currentQuery.hasOwnProperty('mapping') ? currentQuery.mapping : ''
      }
      vm.$store.dispatch('getTTHCDonVi', filter).then(function (result) {
        vm.loading = false
        vm.serviceInfoListDonVi = result.data
        vm.totalThuTuc = result.total
        vm.serviceInfoListDonViView = vm.serviceInfoListDonVi.slice(0, vm.pageSize)
        console.log('adsadasdas',vm.serviceInfoListDonVi)
        vm.thutucPage = 1

      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoListDonVi = []
        vm.totalThuTuc = 0
        vm.serviceInfoListDonViView = vm.serviceInfoListDonVi
      })
    },
    doLoadingThuTucDVCQG () {
      let vm = this
      vm.loading = true
      let currentQuery = vm.$router.history.current.query
      let filter = null
      filter = {
          mapping: currentQuery.hasOwnProperty('mapping') ? currentQuery.mapping : ''
      }
      vm.$store.dispatch('getTTHCDVCQG', filter).then(function (result) {
        vm.loading = false
        vm.serviceInfoListDVCQG = result.data
        vm.totalThuTuc = result.total
        vm.serviceInfoListDVCQGView = vm.serviceInfoListDVCQG.slice(0, vm.pageSize)
        console.log('serviceInfoListDVCQG',vm.serviceInfoListDVCQG)
        
        vm.thutucPage = 1
      }).catch(reject => {
        vm.loading = false
        vm.serviceInfoListDVCQG = []
        vm.serviceInfoListDVCQGView = vm.serviceInfoListDVCQG
        vm.totalThuTuc = 0
        vm.thutucPage = 1
      })
    },
    paggingDataMapping (config) {
      let vm = this
      let start = config.page * 10 - 10
      let end = config.page * 10
      vm.listMappingView = vm.listMapping.slice(start, end)
    },
    paggingData (config) {
      let vm = this
      let start = config.page * vm.pageSize - vm.pageSize
      let end = config.page * vm.pageSize
      vm.thutucPage = config.page
      if(vm.timKiemTheoSelected === 'DonVi') {
        vm.serviceInfoListDonViView = vm.serviceInfoListDonVi.slice(start, end)
      }
      if(vm.timKiemTheoSelected === 'DVCQG') {
        vm.serviceInfoListDVCQGView = vm.serviceInfoListDVCQG.slice(start, end)
      }      
    },
    openDialogMappingDVCQG (item) {
      let vm = this
      vm.serviceSelect = item
      vm.dialogMapping = true
      let filter = {
         serviceCode: item.serviceCode,
         serviceName: item.serviceName
      }
      vm.loadingMapping = true
      vm.$store.dispatch('getTTHCDVCQG', filter).then(function (result) {
        vm.pageMapping = 1
        vm.listMapping = result.data
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.loadingMapping = false
        vm.nameDVCQGModel = item.serviceName
      }).catch(function() {
        vm.listMapping = []
        vm.listMappingView = []
        vm.loadingMapping = false
      })
    },
    openDialogMappingDonVi (item) {
      let vm = this
      vm.serviceSelect = item
      vm.dialogMapping = true
      let filter = {
         serviceCode: item.serviceCode,
         serviceName: item.serviceName
      }
      vm.loadingMapping = true
      vm.$store.dispatch('getTTHCDonVi', filter).then(function (result) {
        vm.pageMapping = 1
        vm.listMapping = result.data
        vm.listMappingView = vm.listMapping.slice(0, 10)
        vm.loadingMapping = false
        vm.nameDVCQGModel = item.serviceNameDVCQG
      }).catch(function() {
        vm.listMapping = []
        vm.listMappingView = []
        vm.loadingMapping = false
      })
    },
    openDialogChiTiet (item) {
      let vm = this
      vm.serviceSelect = item
      vm.btnThem = false
      vm.dialogChiTietThuTuc = true
      let filter = {
         serviceCodeDVCQG: item.serviceCodeDVCQG,
      }
      vm.loadingMapping = true
      vm.$store.dispatch('getChiTietTTDVCQG', filter).then(function (result) {
        vm.serviceDVCQGDetail = result.result
      }).catch(function() {

      })
    },
    openDialogChiTietThuTucDVCQG (item) {
      let vm = this
      vm.serviceSelect = item
      vm.dialogChiTietThuTucDVCQG = true
      vm.btnThem = false
      let filter = {
         serviceCodeDVCQG: item.serviceCodeDVCQG,
      }
      vm.loadingMapping = true
      vm.$store.dispatch('getChiTietTTDVCQG', filter).then(function (result) {
        vm.serviceDVCQGDetail = result.result
      }).catch(function() {

      })
    },
    openDialogChiTietThuTucDonVi (item) {
      let vm = this
      vm.serviceDonViDetail = item
      vm.dialogChiTietThuTucDonVi = true
      vm.btnThem = false
      let filter = {
         serviceCodeDVCQG: item.serviceCode,
      }
      // vm.$store.dispatch('getChiTietTTDVCQG', filter).then(function (result) {
      //   vm.serviceDVCQGDetail = result.result
      // }).catch(function() {

      // })
    },
    openDialogChiTietThuTucThem (item) {
      let vm = this
      vm.serviceSelect = item
      vm.dialogChiTietThuTucDVCQG = true
      vm.btnThem = true
      let filter = {
         serviceCodeDVCQG: item.serviceCodeDVCQG,
      }
      vm.loadingMapping = true
      vm.$store.dispatch('getChiTietTTDVCQG', filter).then(function (result) {
        vm.serviceDVCQGDetail = result.result
      }).catch(function() {

      })
    },
    mappingTTHC (item) {
      let vm = this
      let serviceCode = ''
      let serviceCodeDVCQG = ''
      let serviceNameDVCQG = ''
      if (vm.timKiemTheoSelected === 'DonVi') {
        serviceCode =  vm.serviceSelect.serviceCode,
        serviceCodeDVCQG = item.serviceCodeDVCQG
        serviceNameDVCQG = item.serviceNameDVCQG        
      }
      if (vm.timKiemTheoSelected === 'DVCQG') {
        serviceCode = item.serviceCode
        serviceCodeDVCQG = vm.serviceSelect.serviceCodeDVCQG
        serviceNameDVCQG = vm.serviceSelect.serviceNameDVCQG          
      }
      let filter = {
        serviceCode,
        serviceCodeDVCQG,
        serviceNameDVCQG
      }
      vm.$store.dispatch('mappingTTHC', filter).then(function (result) {
        vm.dialogMapping = false
        toastr.success('Mapping thủ tục thành công')
        if(vm.timKiemTheoSelected === 'DonVi'){
          vm.doLoadingThuTucDonVi()
        }
        if (vm.timKiemTheoSelected === 'DVCQG') {
          vm.doLoadingThuTucDVCQG()
        }
      }).catch(function() {
        toastr.error('Mapping thủ tục thất bại')
     
      })
    },
    removeMapping (item) {
      let vm = this
      let filter = {
        mappingClassPK: item.mappingClassPK
      }
      vm.$store.dispatch('removeMappingTTHC', filter).then(function (result) {
          toastr.success('Hủy đồng bộ thành công')
          if(vm.timKiemTheoSelected === 'DonVi'){
            vm.doLoadingThuTucDonVi()
          }
          if (vm.timKiemTheoSelected === 'DVCQG') {
            vm.doLoadingThuTucDVCQG()
          }
        }).catch(function() {
          toastr.error('Hủy đồng bộ thất bại')

        })
    },
    addTTHC () {
      let vm = this
      let filter = {
        serviceCodes: vm.serviceSelect.serviceCodeDVCQG,
        type: "create"
      }
      vm.$store.dispatch('syncServiceinfoNew', filter).then(function (result) {
         toastr.success('Thêm thủ tục thành công')
         vm.dialogChiTietThuTuc = false
        if(vm.timKiemTheoSelected === 'DonVi'){
          vm.doLoadingThuTucDonVi()
        }
        if (vm.timKiemTheoSelected === 'DVCQG') {
          vm.doLoadingThuTucDVCQG()
        }
      }).catch(function() {
        toastr.error('Thêm thủ tục thất bại')
      })     
    },
    syncServiceinfo (item) {
        let vm = this
        let filter = {
          serviceCodes: item.serviceCode,
          type: "sync"
        }
        vm.$store.dispatch('syncServiceinfoNew', filter).then(function (result) {
            toastr.clear()
            toastr.success('Đồng bộ thành công')
            if(vm.timKiemTheoSelected === 'DonVi'){
              vm.doLoadingThuTucDonVi()
            }
            if (vm.timKiemTheoSelected === 'DVCQG') {
              vm.doLoadingThuTucDVCQG()
            }
            // vm.doLoadingThuTuc()
        }).catch(function() {
            toastr.error('Đồng bộ thất bại')
       
            // vm.doLoadingThuTuc()
        })
    },
      backToList () {
        window.history.back()
      }
  }
}
</script>
