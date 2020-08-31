<template>
  <div>
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>
          <span v-if="!detailView">Danh sách hồ sơ liên thông</span>
          <span v-else>{{currentHoSoLienThong ? currentHoSoLienThong.dossierName : ''}}</span>
        </div>
        <v-card class="">
          <v-card-text class="px-0 py-0">
            <v-data-table
              :headers="headers"
              :items="listLienThong"
              hide-actions
              class="table-landing table-bordered"
              item-key="dossierId"
              v-if="!detailView"
            >
              <template slot="items" slot-scope="props">
                <!-- <tr @click="viewDetail(props.item)" style="cursor: pointer"> -->
                <tr>
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
                    {{ props.item.createDate }}
                  </td>
                  <td class="text-xs-left" width="15%">
                    {{ props.item.dossierSubStatusText ? props.item.dossierSubStatusText : props.item.dossierStatusText }}
                  </td>
                </tr>
              </template>
              <!-- <template slot="expand" slot-scope="props">
                <content-placeholders v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-card flat v-else>
                  <v-expansion-panel :value="[true]" expand   class="expansion-pl ext__form">
                    <v-expansion-panel-content v-bind:value="true">
                      <div slot="header">
                        <div class="background-triangle-small"> 1.</div>
                        Tài liệu nộp &nbsp;&nbsp;&nbsp;&nbsp;
                      </div>
                      <thanh-phan-ho-so ref="thanhphanhoso1" :onlyView="true" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel :value="[true]" expand   class="expansion-pl ext__form">
                    <v-expansion-panel-content v-bind:value="true">
                      <div slot="header">
                        <div class="background-triangle-small"> 2.</div>
                        Tài liệu kết quả
                      </div>
                      <thanh-phan-ho-so ref="thanhphanhoso2" :onlyView="true" :id="'kq'" :partTypes="outputTypes"></thanh-phan-ho-so>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-card>
              </template> -->
            </v-data-table>
            <div v-else>
              <v-expansion-panel :value="[true]" expand   class="expansion-pl ext__form">
                <v-expansion-panel-content v-bind:value="true">
                  <div slot="header">
                    <div class="background-triangle-small"> I.</div>
                    Tài liệu nộp &nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                  <thanh-phan-ho-so ref="thanhphanhoso1" :onlyView="true" :id="'nm'" :partTypes="inputTypes"></thanh-phan-ho-so>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel :value="[true]" expand   class="expansion-pl ext__form">
                <v-expansion-panel-content v-bind:value="true">
                  <div slot="header">
                    <div class="background-triangle-small"> II.</div>
                    Tài liệu kết quả
                  </div>
                  <thanh-phan-ho-so ref="thanhphanhoso2" :onlyView="true" :id="'kq'" :partTypes="outputTypes"></thanh-phan-ho-so>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-flex xs12 class="mt-3 mb-2 text-right">
                <v-btn color="primary" class="my-0 mx-0" @click="detailView = false">
                  <v-icon size="16">undo</v-icon> &nbsp;
                  Quay lại danh sách 
                </v-btn>
              </v-flex>
            </div>
          </v-card-text>
        </v-card>
        <!--  -->
        <!-- <v-card v-for="(items, index) in hoSoLienThongItems" :key="items.dossierId" :class="index>0?'bdt-0':''" class="bdb-0">
          <v-expansion-panel :value="[true]" expand  class="expansion-p0">
            <v-expansion-panel-content :value="index===0?true:false">
              <div slot="header" class="pl-3">
                CƠ QUAN LIÊN THÔNG: <span style="font-weight:normal">{{items.govAgencyName}}</span>
              </div>
              <v-card class="bdt-0 bdb-0">
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-header">Tình trạng: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10>
                      <v-subheader class="pl-0 text-header header-text-field">  {{items.dossierSubStatusText}} </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-header">Ngày gửi hồ sơ: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 text-header header-text-field"> {{items.submitDate|dateTimeView}}</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-header">Ngày tiếp nhận: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 text-header header-text-field"> {{items.receiveDate|dateTimeView}}</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-header">Ngày hẹn trả: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 text-header header-text-field"> {{items.dueDate|dateTimeView}}</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2>
                      <v-subheader class="pl-0 text-header">Ngày hoàn thành: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-subheader class="pl-0 text-header header-text-field"> {{items.releaseDate|dateTimeView}}</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm2 >
                      <v-subheader class="pl-0 text-header">Chi tiết nhật ký: </v-subheader>
                    </v-flex>
                    <v-flex xs12 sm10>
                      <div class="mb-1" v-for="item in items.dossierLog" :key="item.dossierLogId">
                        - {{item.createDate|dateTimeView}}: {{item.content}}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card> -->
        <!--  -->
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>

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
        text: 'Ngày gửi liên thông',
        align: 'center',
        sortable: false
      },
      {
        text: 'Trạng thái',
        align: 'center',
        sortable: false
      }
    ]
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
      var vm = this
      console.log('item', item)
      vm.detailView = true
      vm.currentHoSoLienThong = item
      setTimeout(function () {
        if (vm.$refs.thanhphanhoso1) {
          vm.$refs.thanhphanhoso1.initData(item)
        }
        if (vm.$refs.thanhphanhoso2) {
          vm.$refs.thanhphanhoso2.initData(item)
        }
      }, 300)
    },
    goBack () {
      window.history.back()
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}  ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
      } else {
        return ''
      }
    }
  }
}
</script>
