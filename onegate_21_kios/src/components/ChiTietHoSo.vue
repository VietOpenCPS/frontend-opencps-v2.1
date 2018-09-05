<template>
  <div class="kios-item">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div v-else>
      <div class="row-header">
        <div class="background-triangle-big"> <span>CHI TIẾT HỒ SƠ</span> </div>
        <div class="layout row wrap header_tools">
          <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" :title="dossierDetail.serviceName">
            {{dossierDetail.serviceName}}
          </div>
          <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
            <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
              Quay lại &nbsp;
              <v-icon size="16">undo</v-icon>
            </v-btn>
          </div>
        </div> 
      </div>
      <v-expansion-panel class="expansion-pl">
        <v-expansion-panel-content value="1">
          <div slot="header">
            <div class="background-triangle-small"> 
              <v-icon size="18" color="white">star_rate</v-icon> 
            </div>Thông tin chung hồ sơ
          </div>
          <v-card style="border-top: 1px solid #ddd;">
            <v-card-text class="py-0">
              <v-layout wrap class="px-2 py-2">
                <v-flex xs12 sm4 class="pr-3">
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Mã hồ sơ: </span>
                    <span class="pl-0 text-bold ">  {{dossierDetail.dossierNo}} </span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Cơ quan: </span>
                    <span class="pl-0 text-bold ">  {{dossierDetail.govAgencyName}} </span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Trạng thái: </span>
                    <span class="pl-0 text-bold "> {{dossierDetail.dossierStatusText}} </span>
                  </div>
                </v-flex>
                <!--  -->
                <v-flex xs12 sm4>
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Ngày gửi: </span>
                    <span class="pl-0 text-bold" v-if="dossierDetail.online"> {{dossierDetail.submitDate}} </span>
                    <span class="pl-0 text-bold" v-else> Một cửa </span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Ngày tiếp nhận: </span>
                    <span class="pl-0 text-bold "> {{dossierDetail.receiveDate}}</span>
                  </div>
                  <!--  -->
                  <div class="xs12 sm12 pb-1">
                    <span class="pr-2">Ngày hẹn trả: </span>
                    <span class="pl-0 text-bold "> {{dossierDetail.dueDate}}</span>
                  </div>
                </v-flex>
                <!--  -->
                <v-flex xs12 sm4>
                  <div class="xs12 sm12 pb-1" style="color:#0b72ba">Ghi chú:</div>
                  <div class="xs12 sm12 pb-1 overHidden" v-if="dossierDetail.dossierNote&&dossierDetail.dossierNote!=='null'">
                    <v-tooltip top>
                      <span slot="activator" class="text-bold ">{{dossierDetail.dossierNote}} </span>
                      <span class="pl-0"> {{dossierDetail.dossierNote}} </span>
                    </v-tooltip>
                  </div>
                  <div class="xs12 sm12 pb-1" v-if="dossierDetail.extendDate">
                    <span class="pl-0 text-bold">Hẹn lại: {{dossierDetail.extendDate}}</span>
                  </div>
                  <!--  -->
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <div class="mt-2">
        <v-tabs
          v-model="active"
          color="cyan"
          dark
          slider-color="yellow"
        >
          <v-tab key="1" ripple class="mx-2" @click="loadDossiertemplate"> Thành phần hồ sơ </v-tab>
          <v-tab key="2" ripple class="mx-2" @click="loadLogs"> Nhật ký sửa đổi</v-tab>
          <v-tab-item key="1" >
            <v-card >
              <v-card-text class="px-0 py-0">
                <v-expansion-panel expand  class="expansion-pl ext__form">
                  <v-expansion-panel-content v-bind:value="true">
                    <div slot="header" class="text-bold">
                      <div class="background-triangle-small"> I.</div>
                      Tài liệu nộp &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div v-for="(item, index) in tailieuNop" :key="index" style="align-items: center;min-height: 38px;background: #fff; padding-left: 15px;border-top: 1px solid rgb(221, 221, 221)">
                      <div class="mr-2" style="min-width: 18px; display: flex; min-height: 38px;">
                        <div class="header__tphs"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                        <div class="header__tphs">
                          {{item.partName}} <span v-if="item.required" style="color: red">&nbsp; (*) </span>
                          &nbsp;&nbsp;
                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel expand  class="expansion-pl ext__form">
                  <v-expansion-panel-content v-bind:value="true">
                    <div slot="header" class="text-bold">
                      <div class="background-triangle-small"> II.</div>
                      Kết quả xử lý
                    </div>
                    <div v-for="(item, index) in tailieuKeyQua" :key="index" style="align-items: center;min-height: 38px;background: #fff; padding-left: 15px;border-top: 1px solid rgb(221, 221, 221)">
                      <div class="mr-2" style="min-width: 18px; display: flex; min-height: 38px;">
                        <div class="header__tphs"><span class="text-bold">{{index + 1}}.</span> &nbsp;</div>
                        <div class="header__tphs">
                          {{item.partName}} <span v-if="item.required" style="color: red">&nbsp; (*) </span>
                          &nbsp;&nbsp;
                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="2" >
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
    </div>
  </div>
</template>
<script>
  import router from '@/router'
  import Vue from 'vue/dist/vue.min.js'
  export default {
    props: ['index'],
    components: {},
    data: () => ({
      loading: false,
      loadingAction: false,
      dossierDetail: {},
      listHistoryProcessing: [],
      tailieuNop: [],
      tailieuKeyQua: []
    }),
    computed: {},
    created () {
      let vm = this
      vm.$nextTick(function () {
        var vm = this
        vm.dossierDetail = this.$store.getters.getDetailDossier
        vm.loadDossiertemplate()
      })
    },
    watch: {},
    methods: {
      loadLogs () {
        var vm = this
        let filter = {
          dossierId: vm.index
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
        window.history.back()
      },
      getColor (level) {
        if (level === 2) {
          return 'green'
        } else if (level === 3) {
          return 'orange'
        } else if (level === 4) {
          return 'red'
        }
      }
    }
  }
</script>
