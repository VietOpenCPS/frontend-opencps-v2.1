<template>
  <div>
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span>Danh sách hồ sơ liên thông</span>
        </div>
        <v-card class="">
          <v-card-text class="px-0 py-0">
            <v-data-table
              :headers="headers"
              :items="listLienThong"
              hide-actions
              class="table-landing table-bordered"
              item-key="dossierId"
            >
              <template slot="items" slot-scope="props">
                <tr @click="viewDetail(props.item)" style="cursor: pointer">
                  <td class="text-xs-center" width="5%">
                    <span>{{props.index + 1}}</span>
                  </td>
                  <td class="text-xs-left" width="30%">
                    {{ props.item.dossierName }}
                  </td>
                  <td class="text-xs-left" width="10%">
                    {{ props.item.dossierNo }}
                  </td>
                  <td class="text-xs-left" width="25%">
                    {{ props.item.govAgencyName }}
                  </td>
                  <td class="text-xs-left" width="15%">
                    {{ props.item.dueDate | dateTimeView }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-dialog v-model="dialogDetailDossier" max-width="1200" transition="fade-transition">
      <v-card flat>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>Tiến trình xử lý hồ sơ tại {{dossierLienThong.govAgencyName}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="dialogDetailDossier = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-0 pb-0 px-0">
          <v-card>
            <v-card-text class="py-0 mt-2">
              <v-data-table :headers="headersTienTrinh" :items="dossierActions" class="table-landing table-bordered"
              hide-actions no-data-text="Không có dữ liệu" style="border-left: 1px solid #dedede;"
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
                      <span style="color: green" v-if="dossierLienThong['dossierStatus'] === 'done' || dossierLienThong['dossierStatus'] === 'unresolved'">
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
import axios from 'axios'
import thongtinchunghoso from './form_xu_ly/ThongTinChungHoSo.vue'
import ThanhPhanHoSo from './TiepNhan/TiepNhanHoSo_ThanhPhanHoSoNew.vue'
export default {
  components: {
    'thongtinchunghoso': thongtinchunghoso,
    'thanh-phan-ho-so': ThanhPhanHoSo
  },
  props: {
    listLienThong: {
      type: Array,
      default: () => []
    },
    dossierDetail: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    loading: false,
    inputTypes: [1, 3],
    outputTypes: [2],
    detailView: false,
    thongTinLienThong: {},
    hoSoLienThongItems: [],
    currentHoSoLienThong: '',
    lienthongPage: 1,
    dialogDetailDossier: false,
    dossierActions: [],
    dossierLienThong: '',
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Mã hồ sơ',
        align: 'center',
        sortable: false
      },
      {
        text: 'Cơ quan liên thông',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày hẹn trả',
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
    var vm = this
    vm.$nextTick(function () {
    })
  },
  methods: {
    getDossierLogs (dossier) {
      var vm = this
      let data = {
        dossierId: dossier.dossierId,
        type: ''
      }
      vm.$store.dispatch('loadDossierLogs', data).then(result => {
        if (result.length > 0) {
          dossier.dossierLog = result
        }
      }).catch(reject => {
        console.log(reject)
      })
    },
    viewDetail (item) {
      let vm = this
      vm.dossierLienThong = item
      vm.loadDossierActions(item)
      vm.dialogDetailDossier = true
    },
    loadDossierActions (dossier) {
      let vm = this
      let config = {
        headers: {
          groupId: dossier.groupId
        },
        params: {}
      }
      let url = '/o/rest/v2/dossiers/' + dossier.dossierId + '/sequences'
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
        vm.dossierActions = []
      })
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(isNaN(arg) ? arg : Number(arg))
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    },
    getThoiHanQuyDinh (val) {
      if (val > 0) {
        return val + ' ngày'
      } else {
        return ''
      }
    }
  }
}
</script>
