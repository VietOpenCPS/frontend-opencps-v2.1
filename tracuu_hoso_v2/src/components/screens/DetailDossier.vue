<template>
  <div>
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="10" />
    </content-placeholders>
    <div v-else>
      <v-layout class="wrap px-2 py-2">
        <v-flex :class="isMobile ? 'pb-2 pl-2' : 'pb-2'">
          <h3 style="color:#0054a6" v-if="!isMobile"><span class="text-bold">Tên hồ sơ: </span>{{dossierDetail.dossierName ? dossierDetail.dossierName : dossierDetail.serviceName}}</h3>
          <h3 style="color:#0054a6" v-else><span class="text-bold">Thủ tục hành chính: </span>{{dossierDetail.serviceName}}</h3>
        </v-flex>
      </v-layout>
      <div class="pt-1">
        <v-tabs
          v-model="active"
          color="#0054a6"
          dark
          slider-color="yellow"
        >
          <v-tab key="1" ripple class="mx-2"> Thông tin chung </v-tab>
          <v-tab key="2" ripple class="mx-2"> Tiến trình thụ lý </v-tab>
          <v-tab key="3" ripple class="mx-2" v-if="paymentInfo"> Thanh toán trực tuyến</v-tab>
          <v-tab key="4" ripple class="mx-2" @click="loadVoting()" v-if="dossierDetail['dossierStatus'] === 'done'"> Đánh giá chất lượng dịch vụ</v-tab>
          <v-tab-item key="1">
            <v-card style="border: 1px solid #dedede;border-top: none;">
              <v-card-text class="px-0 py-0">
                <v-layout wrap class="px-2 py-2">
                  <v-flex xs12 sm4 class="pr-3">
                    <div class="xs12 sm12 pb-1" v-if="isMobile">
                      <span class="pr-2">Tên hồ sơ: </span>
                      <span class="pl-0 text-bold ">  {{dossierDetail.dossierName ? dossierDetail.dossierName  : dossierDetail.serviceName}} </span>
                    </div>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Mã hồ sơ: </span>
                      <span class="pl-0 text-bold ">  {{dossierDetail.dossierNo}} </span>
                    </div>
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Hình thức nộp: </span>
                      <span class="pl-0 text-bold ">  {{dossierDetail.online ? 'Nộp trực tuyến' : 'Nộp trực tiếp'}} </span>
                    </div>
                    <!--  -->
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Đơn vị tiếp nhận: </span>
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
                      <span class="pr-2">Chủ hồ sơ: </span>
                      <span class="pl-0 text-bold"> {{dossierDetail.applicantName}} </span>
                    </div>
                    <div class="xs12 sm12 pb-1" v-if="isMobile">
                      <span class="pr-2">{{dossierDetail.applicantIdType === 'citizen' ? 'Số CMND/ căn cước' : 'Mã số thuế'}} : </span>
                      <span class="pl-0 text-bold ">  {{dossierDetail.applicantIdNo}} </span>
                    </div>
                    <!--  -->
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Điện thoại: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.contactTelNo}}</span>
                    </div>
                    <!--  -->
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Thư điện tử: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.contactEmail}}</span>
                    </div>
                  </v-flex>
                  <!--  -->
                  <v-flex xs12 sm4>
                    <div class="xs12 sm12 pb-1" v-if="dossierDetail.online">
                      <span class="pr-2">Ngày gửi: </span>
                      <span class="pl-0 text-bold" v-if="dossierDetail.online"> {{dossierDetail.submitDate}} </span>
                    </div>
                    <!--  -->
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Ngày tiếp nhận: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.receiveDate}}</span>
                    </div>
                    <!--  -->
                    <div class="xs12 sm12 pb-1">
                      <span class="pr-2">Ngày hẹn trả: </span>
                      <span class="pl-0 text-bold "> {{dossierDetail.dueDate ? dossierDetail.dueDate : 'Chưa có ngày hẹn trả'}}</span>
                    </div>
                  </v-flex>
                  <!--  -->
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
                    <!--  -->
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item key="2">
            <v-card style="border: 1px solid #dedede;border-top: none;">
              <v-card-text class="px-0 py-0">
                <div>
                  <v-data-table v-if="!isMobile" :headers="headers" :items="dossierActions" class="table-landing table-bordered"
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
                  <!--  -->
                  <v-data-table v-else :headers="headersMobile" :items="dossierActions" class="table-landing table-bordered"
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
                    <!--  -->
                    <template slot="items" slot-scope="props">
                      <td class="text-xs-center">{{props.index + 1}}</td>
                      <td class="text-xs-left">{{props.item.sequenceName}}</td>
                      <td class="text-xs-left">{{props.item.sequenceRole}}</td>
                      <td class="text-xs-left">{{props.item.startDate|dateTimeView}}</td>
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
          <v-tab-item key="3" v-if="paymentInfo">
            <v-card class="px-2 py-2" style="border: 1px solid #dedede;border-top: none;">
              <v-card-text class="px-0 py-0">
                <v-layout wrap>
                  <v-flex xs12 sm2 style="height: 32px;">
                    <v-subheader class="pl-0 text-right" style="height: 32px;font-family: Roboto;font-size: 13px;">Lệ phí: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <p class="mt-1 mb-0">{{currency(Number(paymentInfo.feeAmount))}} &nbsp;&nbsp; vnđ</p>
                  </v-flex>
                  <v-flex xs12 sm2 style="height: 32px;">
                    <v-subheader class="pl-0 text-right" style="height: 32px;font-family: Roboto;font-size: 13px;">Phí: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <p class="mt-1 mb-0">{{currency(Number(paymentInfo.serviceAmount))}} &nbsp;&nbsp; vnđ</p>
                  </v-flex>
                  <v-flex xs12 sm2 v-if="paymentInfo.shipAmount !== 0" style="height: 32px;">
                    <v-subheader class="pl-0 text-right" style="height: 32px;font-family: Roboto;font-size: 13px;">Phí chuyển phát: </v-subheader>
                  </v-flex>
                  <v-flex xs12 sm2>
                    <p class="mt-1 mb-0" v-if="paymentInfo.shipAmount !== 0">
                      {{currency(Number(paymentInfo.shipAmount))}} &nbsp;&nbsp; vnđ
                    </p>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-text class="px-0 py-0">
                <v-layout wrap>
                  <v-flex xs12 sm2 style="height: 32px;">
                    <v-subheader class="pl-0 text-right" style="height: 32px;font-family: Roboto;font-size: 13px;"><span class="text-bold">Tổng: </span></v-subheader>
                  </v-flex>
                  <v-flex xs12 sm3 style="padding-top:7px">
                    <span>{{currency(Number(paymentInfo.paymentAmount))}} &nbsp;&nbsp; vnđ</span>
                  </v-flex>
                </v-layout>
                <v-layout wrap v-if="paymentInfo.paymentNote">
                  <v-flex style="width:70px" class="my-0 py-1"><span class="red--text">* </span>&nbsp;Ghi chú:</v-flex>
                  <v-flex style="width:calc(100% - 80px)">
                    <p class="px-2 my-0 py-1">
                      {{paymentInfo.paymentNote}} &nbsp;&nbsp;
                    </p>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <div class="text-xs-left mt-2 mb-3 ml-0">
                <v-chip v-if="getEPaymentProfile(paymentInfo.epaymentProfile)" color="orange" text-color="white"
                  @click.native="toKeyPay(getEPaymentProfile(paymentInfo.epaymentProfile).keypayUrl)"
                >
                  <v-avatar style="cursor: pointer">
                    <img src="/o/opencps-store/js/cli/dvc/app/image/logo-keypay.png" alt="trevor" style="background: #fff">
                  </v-avatar>
                  <span class="py-2" style="cursor: pointer">Thanh toán trực tuyến</span>
                </v-chip>
              </div>
            </v-card>
            
          </v-tab-item>
          <v-tab-item key="4" v-if="dossierDetail['dossierStatus'] === 'done'">
            <v-card style="border: 1px solid #dedede;border-top: none;">
              <v-card-text class="px-2 py-2">
                <div>
                  <div v-if="votingItems.length > 0" v-for="(item, index) in votingItems" :key="index" >
                    <div class="text-bold">
                      {{index + 1}}.&nbsp; {{ item.subject }}
                    </div>
                    <v-radio-group :class="!isMobile ? 'ml-3 pt-2' : 'ml-0 mb-2 mt-2 pt-0'" v-model="item.selected" row>
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
  import toastr from 'toastr'
  export default {
    props: ['index', 'detail'],
    components: {
    },
    data: () => ({
      loading: false,
      loadingAction: false,
      dossierDetail: {},
      dossierDetailMotcua: '',
      listHistoryProcessing: [],
      dossierActions: [],
      tailieuNop: [],
      tailieuKeyQua: [],
      votingItems: [],
      loadingVoting: false,
      headers: [
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
        }
      ],
      headersMobile: [
        {
          text: 'TT',
          align: 'center',
          sortable: false
        }, {
          text: 'Công việc',
          align: 'center',
          sortable: false,
          class: 'congviec_column'
        }, {
          text: 'Bộ phận xử lý',
          align: 'center',
          sortable: false,
          class: 'vaitro_column'
        }, {
          text: 'Ngày bắt đầu',
          align: 'center',
          sortable: false,
          class: 'ngaybatdau_column'
        }, {
          text: 'Kết quả',
          align: 'center',
          sortable: false,
          class: 'ketqua_column'
        }
      ],
      isMobile: false,
      two_system: true,
      paymentInfo: false
    }),
    computed: {
      secretCode () {
        return this.$store.getters.getScretCode
      }
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, { passive: true })
      }
    },
    mounted () {
      let vm = this
      vm.onResize()
      window.addEventListener('resize', vm.onResize, { passive: true })
      if (vm.isMobile) {
        $('section#content').css('padding-left', '0px')
      }
    },
    created () {
      let vm = this
      vm.$nextTick(function () {
        vm.onResize()
        window.addEventListener('resize', vm.onResize, { passive: true })
        try {
          // server dvc và motcua độc lập
          vm.two_system = two_system_config 
        } catch (error) {
        }
        vm.dossierDetail = vm.detail
        vm.getPaymentInfo()
        vm.loadDossierDetailMotcua()
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
      })
    },
    watch: {},
    methods: {
      loadDossierActions () {
        var vm = this
        let dataParams = {
          dossierId: vm.dossierDetail.dossierId
        }
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
      loadDossierDetailMotcua () {
        let vm = this
        if (vm.two_system) {
          vm.$store.dispatch('loadDetailDossierMC', vm.dossierDetail).then(function (result) {
            console.log('loadDetailDossierMC', result)
            vm.dossierDetailMotcua = result[0]
          }).catch(function (reject) {
          })
        }
      },
      loadVoting () {
        let vm = this
        console.log('dossierDetailMotcua', vm.dossierDetailMotcua)
        let filter = {
          className: 'dossier',
          classPK: vm.two_system ? vm.dossierDetailMotcua.dossierId : vm.dossierDetail.dossierId,
          serverCode: vm.dossierDetailMotcua['govAgencyCode']
        }
        if (vm.two_system) {
          vm.$store.dispatch('loadVotingMC', filter).then(function (result) {
            vm.votingItems = result
            console.log('votingItems', vm.votingItems)
          }).catch(function (reject) {
          })
        } else {
          vm.$store.dispatch('loadVoting', filter).then(function (result) {
            vm.votingItems = result
            console.log('votingItems', vm.votingItems)
          }).catch(function (reject) {
          })
        }
      },
      submitVoting () {
        let vm = this
        let arrAction = []
        if (vm.votingItems.length > 0) {
          vm.loadingVoting = true
          for (var index in vm.votingItems) {
            vm.votingItems[index]['className'] = 'dossier'
            vm.votingItems[index]['classPk'] = vm.two_system ? vm.dossierDetailMotcua.dossierId : vm.dossierDetail.dossierId
            vm.votingItems[index]['serverCode'] = 'SERVER_' + vm.dossierDetail['govAgencyCode']
            if (!vm.two_system) {
              arrAction.push(vm.$store.dispatch('submitVoting', vm.votingItems[index]))
            } else {
              arrAction.push(vm.$store.dispatch('submitVotingMC', vm.votingItems[index]))
            }
          }
          Promise.all(arrAction).then(results => {
            vm.loadingVoting = false
            toastr.success('Gửi đánh giá thành công')
            vm.loadVoting()
          }).catch(xhr => {
            vm.loadingVoting = false
          })
        }
      },
      toKeyPay (item) {
        let vm = this
        window.open(item, '_self')
      },
      getPaymentInfo () {
        let vm = this
        let scr = vm.getScr(vm.dossierDetail.referenceUid)
        let filter = {
          referenceUid: vm.dossierDetail.referenceUid,
          secretCode: scr,
          serverCode: vm.dossierDetail['govAgencyCode']
        }
        console.log(filter)

        vm.$store.dispatch('loadDossierPayments', filter).then(function (result) {
          console.log(result)
          if (result && result.paymentStatus && String(result.paymentStatus) === '2') {
            vm.paymentInfo = result
          }
        })
      },
      currency (value) {
        if (value) {
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 0
        }
        return 0
      },
      getEPaymentProfile (paymentProfile) {
        if (paymentProfile) {
          try {
            JSON.parse(paymentProfile)
            return JSON.parse(paymentProfile)
          } catch (e) {
            return ''
          }
        } else {
          return ''
        }
      },
      getScr (id) {
        if (typeof(Storage) !== 'undefined') {
          return sessionStorage.getItem(id) ? sessionStorage.getItem(id) : ''
        } else {
          return ''
        }
      },
      goBack () {
        window.history.back()
      },
      onResize () {
        let vm = this
        vm.isMobile = window.innerWidth < 1024
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
      }
    }
  }
</script>