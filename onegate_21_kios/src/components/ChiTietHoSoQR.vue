<template>
  <div :class="!isPermission ? 'pt-2' : ''">
    <div v-if="!isPermission" class="mx-2 mt-3">
      <v-alert outline color="warning" icon="priority_high" :value="true">
        Bạn không có quyền truy cập hồ sơ
      </v-alert>
    </div>
    <div v-else>
      <h4 class="pt-2 ml-2">
        <span style="color:#065694">TRA CỨU THÔNG TIN HỒ SƠ </span>
      </h4>
      <v-layout class="wrap">
        <v-flex class="px-2 py-2 mt-2">
          <span class="text-bold">{{dossierDetail.serviceName}}</span>
        </v-flex>
      </v-layout>
      <div class="mt-4">
        <v-tabs
          v-model="active"
          color="cyan"
          dark
          slider-color="yellow"
        >
          <v-tab key="1" ripple class="mx-2"> Thông tin chung </v-tab>
          <v-tab key="2" ripple class="mx-2" @click="loadDossierActions"> Tiến trình thụ lý </v-tab>
          <v-tab key="3" ripple class="mx-2" @click="loadLogs"> Nhật ký sửa đổi</v-tab>
          <v-tab-item key="1" class="wrap-scroll wrap-scroll-dossier">
            <v-card >
              <v-card-text class="px-0 py-0">
                <v-layout wrap class="px-2 py-2">
                  <v-flex xs12 sm4 class="pr-3">
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Mã hồ sơ: </span>
                      <span class="pl-0 text-bold ">  {{dossierDetail.dossierNo}} </span>
                    </div>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Cơ quan: </span>
                      <span class="pl-0 text-bold ">  {{dossierDetail.govAgencyName}} </span>
                    </div>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Trạng thái: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.dossierStatusText}} </span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Ngày gửi: </span>
                      <span class="pl-0 text-bold" v-if="dossierDetail.online"> {{dossierDetail.submitDate}} </span>
                      <span class="pl-0 text-bold" v-else> Một cửa </span>
                    </div>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Ngày tiếp nhận: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.receiveDate}}</span>
                    </div>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Ngày hẹn trả: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.dueDate}}</span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <div class="xs12 sm12 pb-1" style="color:#0b72ba">Ghi chú:</div>
                    <div class="xs12 sm12 pb-1 overHidden" v-if="dossierDetail.dossierNote&&dossierDetail.dossierNote!=='null'">
                      <v-tooltip top>
                        <span slot="activator" class="text-bold ">{{dossierDetail.dossierNote}} </span>
                        <span class="pl-0" v-html="dossierDetail.dossierNote"> </span>
                      </v-tooltip>
                    </div>
                    <div class="xs12 sm12 pb-1" v-if="dossierDetail.extendDate">
                      <span class="pl-0 text-bold">Hẹn lại: {{dossierDetail.extendDate}}</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="2">
            <v-card>
              <v-card-text class="px-0 py-0">
                <div>
                  <v-data-table :headers="headers" :items="dossierActions" class="table-landing table-bordered"
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
                      <td class="text-xs-left">{{props.item.durationCount}} ngày</td>
                      <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
                      <td class="text-xs-left">
                        <div v-for="itemUser in props.item.assignUsers" :key="itemUser.userId">
                          {{itemUser.userName}} <br>
                        </div>
                      </td>
                      <td class="text-xs-left">
                        <div v-for="(itemAction, index) in props.item.actions" :key="index">
                          {{itemAction.createDate | dateTimeView}} : <span style="color: #0b72ba">{{itemAction.actionName}}</span>
                        </div>
                        <div v-if="props.item.statusText">
                          <span style="color: green">{{props.item.statusText}}</span>
                        </div>
                      </td>
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="3" class="wrap-scroll wrap-scroll-dossier">
            <v-card>
              <v-card-text class="px-0 py-0">
                <div v-for="(item, index) in listHistoryProcessing" v-bind:key="item.dossierLogId" class="list_history_style">
                  <td class="px-2 pt-2" :class="index % 2 !== 0 ? 'col-tien-trinh-1' : 'col-tien-trinh-2'">{{ index + 1 }}</td>
                  <td class="text-xs-left px-2 py-2">
                    <p class="mb-1"> <span>{{ item.createDate | dateTimeView }}</span> - <b>{{ item.author }}</b> 
                      : <span style="color: #0b72ba">{{ item.payload.stepName }}</span>
                    </p>
                    <p class="mb-1" v-if="item.content !== '' && item.content !== null">Ý kiến: <span style="color: green" v-html="item.content"></span></p>
                  </td>
              </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </div>
      <v-btn class="back-btn" title="Trang chủ" @click="goHome" fab color="primary">
        <v-icon dark>home</v-icon>
      </v-btn>
    </div>
    <!-- <div v-else>
      <v-layout row wrap>
        <v-flex xs12 sm12 md6>
          <v-card color="grey lighten-4" flat height="200px">
            <v-toolbar color="primary" dark>
              <v-toolbar-side-icon></v-toolbar-side-icon>
              <v-toolbar-title class="mx-0 mobile">Thông tin hồ sơ</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon size="20">home</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card>
        </v-flex>
      </v-layout>
    </div> -->
  </div>
</template>
<script>
  import router from '@/router'
  import Vue from 'vue/dist/vue.min.js'
  export default {
    props: ['index'],
    components: {
      fullScreen () {
        return this.$store.getters.getFullScreen
      }
    },
    data: () => ({
      loading: false,
      loadingAction: false,
      dossierDetail: {},
      listHistoryProcessing: [],
      dossierActions: [],
      tailieuNop: [],
      tailieuKeyQua: [],
      isPermission: false,
      headers: [{
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
      }, {
        text: 'Thời hạn quy định',
        align: 'center',
        sortable: false,
        class: 'thoihanquydinh_column'
      }, {
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
      }]
    }),
    computed: {},
    created () {
      let vm = this
      vm.$nextTick(function () {
        vm.$store.commit('setFullScreen', true)
        let currentParams = vm.$router.history.current.params
        let currentQuery = vm.$router.history.current.query
        console.log('currentQuery', currentQuery)
        if (currentQuery.hasOwnProperty('secretKey') && currentQuery.secretKey) {
          console.log('run run run')
          let filter = {
            secretKey: currentQuery.secretKey,
            dossierId: vm.index
          }
          vm.$store.dispatch('getDetailDossierQR', filter).then(resultDossier => {
            if (resultDossier.status && resultDossier.status.toString() === '200') {
              vm.isPermission = true
              vm.dossierDetail = resultDossier.data
            } else {
              vm.isPermission = false
            }
          })
        } else {
          vm.isPermission = false
        }
      })
    },
    watch: {},
    methods: {
      loadDossierActions () {
        var vm = this
        let dataParams = {
          dossierId: vm.dossierDetail.dossierId
        }
        vm.$store.dispatch('loadDossierActions', dataParams).then(resultActions => {
          if (resultActions.data) {
            let resultTemp = resultActions.data
            for (var i = 0; i < resultTemp.length; i++) {
              if (resultTemp[i].hasOwnProperty('actions') && resultTemp[i]['actions'] !== null && resultTemp[i]['actions'] !== undefined) {
                if (!Array.isArray(resultTemp[i]['actions'])) {
                  let arrActionsTemp = []
                  arrActionsTemp.push(resultTemp[i]['actions'])
                  resultTemp[i]['actions'] = arrActionsTemp
                }
              }
            }
            vm.dossierActions = resultTemp
          }
        })
      },
      loadLogs () {
        var vm = this
        let filter = {
          dossierId: vm.dossierDetail.dossierId
        }
        vm.$store.dispatch('getListHistoryProcessingItems', filter).then(function (result) {
          vm.listHistoryProcessing = []
          vm.listHistoryProcessing = result
        })
      },
      loadDossiertemplate () {
        var vm = this
        let filter = {
          dossierTemplateNo: vm.dossierDetail.dossierTemplateNo
        }
        if (vm.dossierDetail.dossierTemplateNo) {
          vm.$store.dispatch('loadDossierTemplates', filter).then(function (result) {
            console.log(result)
            vm.tailieuNop = result.filter(function (item) {
              return item.partType === 1
            })
            vm.tailieuKeyQua = result.filter(function (item) {
              return item.partType === 2
            })
          })
        }
      },
      goBack () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['detail'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined && newQuery[key] !== null && newQuery[key] !== 'null') {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        vm.$router.push({
          path: current.path + queryString
        })
      },
      getColor (level) {
        if (level === 2) {
          return 'green'
        } else if (level === 3) {
          return 'orange'
        } else if (level === 4) {
          return 'red'
        }
      },
      goHome () {
        window.open('/web/cong-dich-vu-cong', '_self')
      }
    },
    filters: {
      dateTimeView (arg) {
        if (arg) {
          let value = new Date(Number(arg))
          return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
        } else {
          return ''
        }
      }
    }
  }
</script>
