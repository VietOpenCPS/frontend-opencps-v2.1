<template>
  <div>
    <v-expansion-panel class="expansion-pl">
      <v-expansion-panel-content hide-actions value="1">
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
            >
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td class="text-xs-center">
                    <span>{{lienthongPage * 15 - 15 + props.index + 1}}</span>
                  </td>
                  <td class="text-xs-left">
                    {{ props.item.dossierName }}
                  </td>
                  <td class="text-xs-left">
                    {{ props.item.govAgencyName }}
                  </td>
                  <td class="text-xs-left">
                    {{ props.item.submitDate }}
                  </td>
                  <td class="text-xs-left">
                    {{ props.item.dossierStatusText }}
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-card-text></v-card-text>
                </v-card>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <!--  -->
        <!-- <v-card v-for="(items, index) in hoSoLienThongItems" :key="items.dossierId" :class="index>0?'bdt-0':''" class="bdb-0">
          <v-expansion-panel expand class="expansion-p0">
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
import router from '@/router'
import thongtinchunghoso from './form_xu_ly/ThongTinChungHoSo.vue'
export default {
  components: {
    'thongtinchunghoso': thongtinchunghoso
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
    thongTinLienThong: {},
    hoSoLienThongItems: [],
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
        text: 'Cơ quan liên thông',
        align: 'center',
        sortable: false
      },
      {
        text: 'Ngày gửi',
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
    loading () {
      return this.$store.getters.loading
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  methods: {
    loadHoSoLienThong (classPK) {
      var vm = this
      vm.$store.dispatch('loadDossierLienThong', classPK).then(result => {
        vm.hoSoLienThongItems = result
        if (vm.hoSoLienThongItems.length > 0) {
          for (var key in vm.hoSoLienThongItems) {
            let itemDossier = vm.hoSoLienThongItems[key]
            vm.getDossierLogs(itemDossier)
          }
        }
      }).catch(reject => {
        console.log(reject)
      })
    },
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
