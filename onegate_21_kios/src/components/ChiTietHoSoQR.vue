<template>
  <div :class="!isPermission ? 'pt-2' : ''">
    <v-flex xs12 v-if="!isPermission && !loading" class="mx-2 mt-3">
      <v-alert outline color="warning" icon="priority_high" :value="true">
        Bạn không có quyền truy cập hồ sơ này
      </v-alert>
    </v-flex>
    <v-flex xs12 v-if="isPermission && !loading">
      <div class="detailQR_desktop">
        <h2 class="pt-2 ml-2 text-xs-center">
          <span style="color:#065694">TRA CỨU THÔNG TIN HỒ SƠ </span>
        </h2>
        <v-layout class="wrap">
          <v-flex class="px-2 py-2 mt-2">
            <span class="text-bold" style="font-size: 1.2em;color: #065694;">Tên hồ sơ: {{dossierDetail.serviceName}}</span>
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
            <v-tab key="2" ripple class="mx-2"> Tiến trình thụ lý </v-tab>
            <v-tab-item key="1" class="wrap-scroll wrap-scroll-dossier">
              <v-card flat>
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
                      <div class="xs12 sm12 pb-1" v-if="dossierDetail.online">
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
                      <div class="xs12 sm12 pb-1" style="color:#0b72ba" v-if="dossierDetail.dossierNote&&dossierDetail.dossierNote!=='null'&&dossierDetail.dossierNote.indexOf('<br/>') < 0">Ghi chú:</div>
                      <div class="xs12 sm12 pb-1 overHidden" v-if="dossierDetail.dossierNote&&dossierDetail.dossierNote!=='null'&&dossierDetail.dossierNote.indexOf('<br/>') < 0">
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
              <v-card flat>
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
              <v-card flat>
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
      </div>
      <div class="detailQR_mobile">
        <v-layout row wrap>
          <v-flex xs12 sm12 md6>
            <v-card flat>
              <v-toolbar color="primary" dark>
                <v-menu transition="slide-x-transition">
                  <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
                  <v-list>
                    <v-list-tile @click="detailInfo = true;detailSync = false;detailVoting = false">Thông tin hồ sơ</v-list-tile>
                    <v-list-tile @click="detailSync = true;detailInfo = false;detailVoting = false">Tiến trình thụ lý</v-list-tile>
                    <v-list-tile v-if="dossierDetail['dossierStatus'] === 'done'" @click="loadVoting()">Đánh giá</v-list-tile>
                  </v-list>
                </v-menu>
                <v-toolbar-title class="mobile mx-2" v-if="detailInfo">THÔNG TIN HỒ SƠ</v-toolbar-title>
                <v-toolbar-title class="mobile mx-2" v-if="detailVoting">ĐÁNH GIÁ</v-toolbar-title>
                <v-toolbar-title class="mobile mx-2" v-if="detailSync">TIẾN TRÌNH THỤ LÝ</v-toolbar-title>
              </v-toolbar>
              <v-layout wrap class="mx-2 my-3" v-if="detailInfo">
                <v-flex xs4 class="mb-1">
                  <v-subheader class="pl-0 text-header">Thủ tục: </v-subheader>
                </v-flex>
                <v-flex xs8 class="mb-1">
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.serviceName}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Cơ quan: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.govAgencyName}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Mã hồ sơ: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.dossierNo}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Chủ hồ sơ: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.applicantName}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Ngày gửi: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.submitDate}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Ngày tiếp nhận: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.receiveDate}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Ngày hẹn trả: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.dueDate}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header">Trạng thái: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-subheader class="pl-0 header-text-field text-header text-bold">  {{dossierDetail.dossierStatusText}} </v-subheader>
                </v-flex>
                <v-flex xs4>
                  <v-subheader class="pl-0 text-header" style="color:#0b72ba">Ghi chú: </v-subheader>
                </v-flex>
                <v-flex xs8>
                  <div v-if="dossierDetail.dossierNote&&dossierDetail.dossierNote!=='null'">
                    <div class="pl-0 text-header text-bold" v-html="dossierDetail.dossierNote"></div>
                  </div>
                  <div v-if="dossierDetail.extendDate">
                    <div class="pl-0 text-header text-bold" style="color:red">Hẹn lại:  {{dossierDetail.extendDate}} </div>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout wrap class="mx-2 my-3" v-if="detailVoting">
                <div>
                  <div v-if="votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" >
                    <div class="text-bold">
                      {{index + 1}}.&nbsp; {{ item.subject }}
                    </div>
                    <v-radio-group class="ml-3 pt-2 mt-0" v-model="item.selected" row>
                      <v-radio v-for="(item1, index1) in item.choices" v-bind:key="index1" :label="item1" :value="index1 + 1" ></v-radio>
                    </v-radio-group>
                    <!-- <v-layout wrap class="ml-3" style="margin-top:-10px">
                      <v-flex style="margin-left:45px" v-for="(item2, index2) in item.answers" :key="index2">
                        <span class="text-bold" style="color:green">{{item2}}/{{item.answersCount}}</span>
                      </v-flex>
                    </v-layout> -->
                  </div>
                  <div v-if="votingItems.length === 0" class="mx-3">
                    <v-alert outline color="warning" icon="priority_high" :value="true">
                      Không có đánh giá
                    </v-alert>
                  </div>
                  <div class="ml-3" v-if="votingItems.length > 0">
                    <v-btn color="primary"
                      :loading="loadingVoting"
                      :disabled="loadingVoting"
                      @click="submitVoting"
                    >Gửi đánh giá</v-btn>
                  </div>
                </div>
              </v-layout>
              <v-layout wrap class="mx-0 my-3" v-if="detailSync">
                <v-card flat>
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
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </div>
</template>
<script>
  import router from '@/router'
  import Vue from 'vue/dist/vue.min.js'
  export default {
    props: ['index'],
    components: {
    },
    data: () => ({
      loading: true,
      loadingAction: false,
      dossierDetail: {},
      listHistoryProcessing: [],
      dossierActions: [],
      tailieuNop: [],
      tailieuKeyQua: [],
      isPermission: false,
      detailInfo: true,
      detailVoting: false,
      detailSync: false,
      votingItems: [],
      loadingVoting: false,
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
        vm.detailInfo = true
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
          vm.loading = true
          vm.$store.dispatch('getDetailDossierQR', filter).then(resultDossier => {
            vm.loading = false
            if (resultDossier.status && resultDossier.status.toString() === '200') {
              vm.isPermission = true
              vm.dossierDetail = resultDossier.data
              if (vm.dossierDetail.submissionNote) {
                let submissionNote = vm.dossierDetail.submissionNote ? JSON.parse(vm.dossierDetail.submissionNote) : ''
                let resultTemp = submissionNote ? submissionNote.data : ''
                if (resultTemp) {
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
              }
            } else {
              vm.isPermission = false
            }
          })
        } else {
          vm.loading = false
          vm.isPermission = false
        }
      })
    },
    mounted () {
      $('#content').css('padding-left', '0')
    },
    watch: {},
    methods: {
      loadDossierActions () {
        var vm = this
        let dataParams = {
          dossierId: vm.dossierDetail.dossierId
        }
        vm.detailInfo = false
        if (vm.dossierDetail.originality === 0 || vm.dossierDetail.originality === '0') {
        } else {
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
        }
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
      loadVoting () {
        let vm = this
        vm.detailVoting = true
        vm.detailSync = false
        vm.detailInfo = false
        let filter = {
          className: 'dossier',
          dossierDetail: vm.dossierDetail
        }
        vm.$store.dispatch('loadVotingMC', filter).then(function (result) {
          vm.votingItems = result
          console.log('votingItems', vm.votingItems)
        }).catch(function (reject) {
        })
      },
      submitVoting () {
        let vm = this
        let arrAction = []
        if (vm.votingItems.length > 0) {
          vm.loadingVoting = true
          for (var index in vm.votingItems) {
            vm.votingItems[index]['className'] = 'dossier'
            vm.votingItems[index]['classPk'] = vm.dossierDetail.dossierId
            vm.votingItems[index]['serverCode'] = 'SERVER_' + vm.dossierDetail['govAgencyCode']
            arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[index]))
          }
          Promise.all(arrAction).then(results => {
            vm.loadingVoting = false
            vm.loadVoting()
          }).catch(xhr => {
            vm.loadingVoting = false
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
