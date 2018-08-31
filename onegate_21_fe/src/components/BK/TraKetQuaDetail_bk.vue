<template>
  <div class="ketqua-detail">
    <content-placeholders class="mt-3" v-if="loading">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header">
      <div class="background-triangle-big"> <span>TRẢ KẾT QUẢ HỒ SƠ</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex xs8 sm10 pl-3 text-ellipsis text-bold" >
          {{thongTinChiTietHoSo.serviceName}}
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
          Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div> 
    </div>
    <v-expansion-panel expand class="expansion-p0">
      <v-expansion-panel-content :value="true">
        <div slot="header">
          <div class="background-triangle-small">I. </div>THÔNG TIN HỒ SƠ
        </div>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Thủ tục: </v-subheader>
              </v-flex>
              <v-flex xs12 sm10>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.serviceName}} </v-subheader>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Mã hồ sơ: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field"> {{thongTinChiTietHoSo.dossierIdCTN}}</v-subheader>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Ngày tiếp nhận: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field"> {{thongTinChiTietHoSo.receiveDate|dateTimeView}}</v-subheader>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Chủ hồ sơ: </v-subheader>
              </v-flex>
              <v-flex xs12 sm10>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.applicantName}} </v-subheader>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Địa chỉ: </v-subheader>
              </v-flex>
              <v-flex xs12 sm10>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field">  {{thongTinChiTietHoSo.address}} </v-subheader>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Người nộp: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field"> {{thongTinChiTietHoSo.delegateName}} </v-subheader>
              </v-flex>
              <!--  -->
              <v-flex xs12 sm2>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header">Số CMND: </v-subheader>
              </v-flex>
              <v-flex xs12 sm4>
                <content-placeholders class="mt-1" v-if="loading">
                  <content-placeholders-text :lines="1" />
                </content-placeholders>
                <v-subheader v-else class="pl-0 text-header header-text-field"> {{thongTinChiTietHoSo.applicantIdNo}} </v-subheader>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!--  -->
    <v-expansion-panel expand class="expansion-p0 ex-table">
      <v-expansion-panel-content :value="true">
        <div slot="header">
          <div class="background-triangle-small"> II. </div>GIẤY TỜ TRẢ KẾT QUẢ
        </div>
        <v-card>
          <v-card-text class="px-0">
            <!--  -->
            <content-placeholders v-if="loadingTable">
              <content-placeholders-img />
              <content-placeholders-heading />
            </content-placeholders>
            <v-data-table v-else
              :headers="headers"
              :items="resultFiles"
              item-key="no"
              class="table-bordered"
              hide-actions
              :no-data-text="'Không có giấy tờ kết quả'"
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
                <td class="text-xs-center" style="width:5%"> {{ props.index + 1 }} </td>
                <td class="text-xs-left" style="width:10%"> {{ props.item.deliverableCode }} </td>
                <td class="text-xs-left" style="width:10%"> {{ props.item.createDate|dateTimeView }} </td>
                <td class="text-xs-left" style="width:75%"> {{props.item.displayName}} </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!--  -->
    <v-flex xs12>
      <content-placeholders class="mt-1" v-if="loading">
        <content-placeholders-text :lines="1" />
      </content-placeholders>
      <div v-else class="pl-3 py-2 fee-info">
        <v-checkbox :label="`Phí phải nộp: ${currency(feeAmount)} VNĐ`" v-model="checkPaid"></v-checkbox>
        <span class="red--text">* </span> Đánh dấu để xác định người làm thủ tục đã hoàn thành nộp phí.
      </div>
    </v-flex>
    <!--  -->
    <v-card-actions class="mt-2" style="float: right">
      <v-btn color="primary" @click="traKetQua"
        :loading="loadingAction"
        :disabled="loadingAction"
      >
        Trả kết quả
        <span slot="loader">Loading...</span>
      </v-btn>
      <v-btn color="primary" @click="goBack" style="height:30px"
        :loading="loadingAction"
        :disabled="loadingAction"
      >
        <v-icon>undo</v-icon> &nbsp;
        Quay lại
        <span slot="loader">Loading...</span>
      </v-btn>
    </v-card-actions>
    <!--  -->
    <v-dialog v-model="dialog_add_dined" persistent max-width="500px">
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="note_reason" placeholder="Nhập lý do từ chối" multi-line></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat="flat" @click.native="submitAddReason(note_reason)"
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            Chấp nhận &nbsp;
            <span slot="loader">Loading...</span>
          </v-btn>
          <v-btn color="red darken-3" flat="flat" @click.native="dialog_add_dined = false"
            :loading="loadingAction"
            :disabled="loadingAction"
          >
            Bỏ qua &nbsp;
            <span slot="loader">Loading...</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  data: () => ({
    dossierId: '',
    dialog_add_dined: false,
    loadingAction: false,
    note_reason: '',
    resultFiles: [],
    feeAmount: '',
    thongTinChiTietHoSo: {},
    headers: [{
      text: 'STT',
      align: 'center',
      sortable: false
    },
    {
      text: 'Số giấy',
      align: 'center',
      sortable: false
    },
    {
      text: 'Ngày cấp',
      align: 'center',
      sortable: false
    },
    {
      text: 'Tên giấy tờ',
      align: 'center',
      sortable: false
    }
    ],
    checkPaid: false
  }),
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    loadingTable () {
      return this.$store.getters.loadingTable
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {})
  },
  methods: {
    initData (data) {
      var vm = this
      vm.dossierId = data
      vm.$store.dispatch('getDetailDossier', data).then(resultDossier => {
        vm.thongTinChiTietHoSo = resultDossier
        vm.$store.dispatch('loadDossierFiles', data).then(function (result) {
          vm.resultFiles = result.filter((val, index) => {
            return (val.dossierPartType === 2 && val.eForm === false)
          })
        }).catch(function (reject) {
          console.log(reject)
        })
        vm.$store.dispatch('loadDossierPayments', resultDossier).then(function (result) {
          vm.feeAmount = result.feeAmount
        }).catch(function (reject) {
          console.log(reject)
        })
      }).catch(reject => {
        console.log(reject)
      })
    },
    submitAddReason (reason) {
      console.log('note_reason', reason)
    },
    traKetQua () {
      var vm = this
      let dataPostAction = {
        dossierId: vm.dossierId,
        actionCode: 400
      }
      vm.$store.dispatch('postAction', dataPostAction).then(function (result) {
      })
    },
    goBack () {
      window.history.back()
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    }
  },
  filters: {
    dateTimeView (arg) {
      if (arg) {
        let value = new Date(arg)
        return `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()}`
      } else {
        return ''
      }
    }
  }
}
</script>
