<template>
  <div style="max-width: 1500px; margin: 0 auto">
    <v-data-table
      :headers="dossierListHeader"
      :items="dossierList"
      hide-actions
      class="table-landing table-bordered mt-3"
      style="border-left: 1px solid #dedede"
    >
      <template slot="items" slot-scope="props">
        <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;" @click="viewDetailDossier(props.item)">
          <td class="text-xs-center" style="width:50px;height:36px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else>
              <span>{{ dossierPage * numberPerPage - numberPerPage + props.index + 1 }}</span>
            </div>
          </td>
          <td class="text-xs-left" style="height:36px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else>
              <span>{{props.item.dossierNo}}</span>
            </div>
          </td>
          <td class="text-xs-left" style="height:36px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else>
              <span>{{props.item.dossierName}}</span>
            </div>
          </td>
          <td class="text-xs-left" style="height:36px;min-width:200px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else>
              <span>{{props.item.applicantName}}</span>
            </div>
          </td>
          <td class="text-xs-left" style="height:36px;width:100px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else>
              <span>{{props.item.receiveDate}}</span>
            </div>
          </td>
          <td class="text-xs-left" style="height:36px;width:100px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <div v-else>
              <span>{{props.item.dueDate}}</span>
            </div>
          </td>
          <td class="text-xs-center pt-2" style="height:36px;width:100px">
            <content-placeholders v-if="loadingTable">
              <content-placeholders-text :lines="1" />
            </content-placeholders>
            <span v-if="!loadingTable" @click="viewDetailDossier(props.item)" style="text-decoration: underline; color: #0167d3;"> Xem chi tiết</span>
          </td>
        </tr>
      </template>
    </v-data-table>
    <!--  -->
    <div class="my-2">
      <div class="text-xs-right layout wrap" style="position: relative;">
        <div class="flex pagging-table"> 
          <tiny-pagination :total="totalDossierSearch" :page="dossierPage" :numberPerPage="numberPerPage" nameRecord="hồ sơ" custom-class="custom-tiny-class" 
            @tiny:change-page="changePage" ></tiny-pagination> 
        </div>
      </div>
    </div>
    <!--  -->
    <v-dialog v-model="dialogDetailDossier" max-width="1200" transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Thông tin hồ sơ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogDetailDossier = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <v-expansion-panel :value="[true]" expand >
            <v-expansion-panel-content>
              <div slot="header" class="pl-3"><span class="text-bold">I. </span> THÔNG TIN CHUNG HỒ SƠ</div>
              <v-card>
                <v-card-text class="py-0">
                  <v-layout wrap class="px-2 py-2">
                    <v-flex xs12 sm4 class="pr-3">
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Chủ hồ sơ: </span>
                        <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantName}}</span>
                      </div>
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Số CMND/ căn cước: </span>
                        <span class="pl-0 text-bold"> {{thongTinChiTietHoSo.applicantIdNo}}</span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1 overHidden">
                        <span class="pr-2">Địa chỉ: </span>
                        <v-tooltip top>
                          <span slot="activator" class="text-bold ">{{ String(thongTinChiTietHoSo.address).replace(/\./g, "") }} {{thongTinChiTietHoSo.wardName}}<span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span></span>
                          <span class="pl-0"> {{String(thongTinChiTietHoSo.address).replace(/\./g, "")}} {{thongTinChiTietHoSo.wardName}}<span v-if="thongTinChiTietHoSo.wardName">, {{thongTinChiTietHoSo.districtName}}, {{thongTinChiTietHoSo.cityName}}</span></span>
                        </v-tooltip>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1">
                        <span class="pl-0">Thư điện tử: </span>
                        <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.contactEmail}} </span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Điện thoại: </span>
                        <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.contactTelNo}} </span>
                      </div>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm4>
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2" v-if="thongTinChiTietHoSo.online">Ngày gửi trực tuyến: </span>
                        <span class="pr-2" v-else>Ngày nộp hồ sơ: </span>
                        <span class="pl-0 text-bold" v-if="thongTinChiTietHoSo.online"> {{thongTinChiTietHoSo.submitDate}} </span>
                        <span class="pl-0 text-bold" v-else> {{thongTinChiTietHoSo.receiveDate}} </span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Ngày tiếp nhận: </span>
                        <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.receiveDate}}</span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Thời hạn giải quyết: </span>
                        <span class="pl-0 text-bold " v-if="thongTinChiTietHoSo.durationCount > 0"> 
                          {{durationText(thongTinChiTietHoSo.durationUnit, thongTinChiTietHoSo.durationCount)}} làm việc 
                        </span>
                        <span class="pl-0 text-bold " v-else>
                          Không quy định
                        </span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Ngày hẹn trả: </span>
                        <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dueDate}}</span>
                      </div>
                    </v-flex>
                    <!--  -->
                    <v-flex xs12 sm4>
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Mã hồ sơ: </span>
                        <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.dossierNo}} </span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1" v-if="thongTinChiTietHoSo.originDossierNo">
                        <span class="pr-2">Hồ sơ gốc: </span>
                        <span class="pl-0 text-bold ">  {{thongTinChiTietHoSo.originDossierNo}} </span>
                      </div>
                      <!--  -->
                      <div class="xs12 sm12 pb-1">
                        <span class="pr-2">Trạng thái: </span>
                        <span class="pl-0 text-bold "> {{thongTinChiTietHoSo.dossierStatusText}} </span>
                      </div>
                      <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                        v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                        thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                        Ghi chú:
                      </div>
                      <div class="xs12 sm12 pb-1 overHidden" 
                        v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                        thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0&&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                        <v-tooltip top>
                          <span slot="activator" class="text-bold ">{{thongTinChiTietHoSo.dossierNote}} </span>
                          <span class="pl-0"> {{thongTinChiTietHoSo.dossierNote}} </span>
                        </v-tooltip>
                      </div>
                      <div class="xs12 sm12 pb-1" style="color:#0b72ba" 
                        v-if="thongTinChiTietHoSo.dossierNote&&thongTinChiTietHoSo.dossierNote!=='null'&&
                        thongTinChiTietHoSo.dossierNote.indexOf('<br/>') < 0 &&thongTinChiTietHoSo.dossierNote.indexOf('</br>') < 0">
                        Ghi chú:
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
          
          <v-expansion-panel :value="[true]" expand >
            <v-expansion-panel-content>
              <div slot="header" class="pl-3"><span class="text-bold">II. </span> TIẾN TRÌNH XỬ LÝ</div>
              <v-card>
                <v-card-text class="py-0 mt-2">
                  <v-data-table :headers="headersTienTrinh" :items="dossierActions" class="table-landing table-bordered"
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
                      <td class="text-xs-center">{{props.index + 1}}</td>
                      <td class="text-xs-left">{{props.item.sequenceRole}}</td>
                      <td class="text-xs-left">{{props.item.sequenceName}}</td>
                      <td class="text-xs-left">{{props.item.durationCount|getThoiHanQuyDinh}}</td>
                      <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                      <td class="text-xs-left">
                        <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                          {{itemUser.userName}} <br>
                        </div>
                      </td>
                      <td class="text-xs-left">
                        <div v-for="(itemAction, index) in props.item.actions" :key="index">
                          {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                          <span v-if="itemAction.actionNote && itemAction.actionNote !== 'null'"> - <i>{{itemAction.actionNote}}</i></span>
                          
                        </div>
                        <div v-if="props.item.statusText">
                          <span style="color: green" v-if="thongTinChiTietHoSo['dossierStatus'] === 'done' || thongTinChiTietHoSo['dossierStatus'] === 'unresolved'">
                            {{props.item.statusText.replace("Đang thực hiện:", "")}}
                          </span>
                          <span style="color: green" v-else>
                            {{props.item.statusText}}
                          </span>
                        </div>
                      </td>
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
        <v-card-actions class="mx-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="dialogDetailDossier = false"
            >
            <v-icon class="white--text">close</v-icon>&nbsp;
            Thoát
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios"
import TinyPagination from './Pagination'
export default {
  props: ['groupId', 'apiGetDossier'],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    thongTinChiTietHoSo: '',
    dialogDetailDossier: false,
    loadingTable: false,
    dossierList: '',
    numberPerPage: 15,
    dossierPage: 1,
    totalDossierSearch: 0,
    dossierActions: [],
    dossierListHeader: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Nội dung',
        align: 'center',
        sortable: false
      },
      {
        text: 'Chủ hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày tiếp nhận',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày hẹn trả',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    headersTienTrinh: [
      {
        text: '#',
        align: 'center',
        sortable: false
      },
      {
        text: 'Vai trò',
        align: 'center',
        sortable: false,
        class: 'vaitro_column'
      }, {
        text: 'Công việc',
        align: 'center',
        sortable: false,
        class: 'congviec_column'
      }, 
      {
        text: 'Thời hạn quy định',
        align: 'center',
        sortable: false,
        class: 'thoihanquydinh_column'
      }, 
      {
        text: 'Ngày bắt đầu',
        align: 'center',
        sortable: false,
        class: 'ngaybatdau_column'
      }, {
        text: 'Người thực hiện',
        align: 'center',
        sortable: false,
        class: 'nguoithuchien_column'
      }, {
        text: 'Kết quả',
        align: 'center',
        sortable: false,
        class: 'ketqua_column'
      }
    ],
  }),
  computed: {
  },
  created () {
    let vm = this
  },
  watch: {
    
  },
  methods: {
    initData () {
      let vm = this
      vm.dossierPage = 1
      vm.getDossiers()
    },
    changePage (config) {
      let vm = this
      vm.dossierPage = config.page
      vm.getDossiers()
    },
    getDossiers () {
      let vm = this
      let start = vm.dossierPage * 15 - 15
      let end = vm.dossierPage * 15
      let config = {
        url: vm.apiGetDossier + '&start=' + start + '&end=' + end + '&t=' + (new Date()).getTime(),
        method: 'get',
        params: {
        },
        headers: {
          groupId: vm.groupId
        }
      }
      vm.loadingTable = true
      axios.request(config).then(function (response) {
        vm.loadingTable = false
        let serializable = response.data
        if (serializable.data) {
          vm.totalDossierSearch = serializable['total']
          vm.dossierList = serializable['data']
        } else {
          vm.totalDossierSearch = 0
          vm.dossierList = []
        }
      }).catch(function (error) {
        vm.loadingTable = false
        vm.totalDossierSearch = 0
        vm.dossierList = []
      })
    },
    viewDetailDossier (data) {
      let vm = this
      vm.getDetailDossier(data)
      setTimeout(function() {
        vm.dialogDetailDossier = true
      }, 100)
    },
    getDetailDossier (data) {
      let vm = this
      let config = {
        headers: {
          groupId: vm.groupId
        },
        params: {}
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId
      axios.get(url, config).then(function (response) {
        vm.thongTinChiTietHoSo = response.data
        vm.loadDossierActions(vm.thongTinChiTietHoSo)
      })
    },
    loadDossierActions (data) {
      let vm = this
      let config = {
        headers: {
          groupId: vm.groupId
        },
        params: {}
      }
      let url = '/o/rest/v2/dossiers/' + data.dossierId + '/sequences'
      axios.get(url, config).then(function (response) {
        if (response.data) {
          let resultTemp = response.data.data
          for (let i = 0; i < resultTemp.length; i++) {
            if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
              if (!Array.isArray(resultTemp[i]['actions'])) {
                let arrActionsTemp = []
                arrActionsTemp.push(resultTemp[i]['actions'])
                resultTemp[i]['actions'] = arrActionsTemp
              }
            }
          }
          vm.dossierActions = resultTemp
        } else {
          vm.dossierActions = []
        }
        
      }).catch(function (xhr) {
      })
    },
    durationText(durationUnit, durationCount) {
      let durationText
      if (durationUnit === 1 && durationCount > 8) {
        let day = Math.floor(durationCount / 8) + ' ngày'
        let hours
        if (durationCount % 8 !== 0) {
          hours = ((durationCount / 8) - Math.floor(durationCount / 8)) * 8 + ' giờ'
        } else {
          hours = ''
        }
        durationText = `${day} ${hours}`
      } else if (durationUnit === 0) {
        durationText = durationCount + ' ngày'
      } else if (durationUnit === 1 && durationCount <= 8) {
        durationText = durationCount + ' giờ'
      }
      return durationText
    },
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(Number(arg))
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    dateTimeViewSequency (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    getMaxDueDate (arr) {
      let maxDue = Math.max.apply(Math, arr.map(function (item) {
        return item.actionOverdue
      }))
      return maxDue
    },
    getThoiHanQuyDinh (val) {
      if (val > 0) {
        return val + ' ngày'
      } else {
        return ''
      }
    }
  }
};
</script>
