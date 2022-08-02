<template>
  <div style="width: 100%;">
    <v-card class="mb-3">
      <v-expansion-panel :value="[true]" expand  class="expansion-pl">
        <v-expansion-panel-content>
          <div slot="header">
            <div class="background-triangle-small"> 
              <v-icon size="18" color="white">star_rate</v-icon> 
            </div>
            <span>Danh sách biên lai</span>
          </div>
          <v-card>
            <v-card-text class="px-0 py-0">
              <v-data-table
                v-if="feeList && feeList.length"
                :headers="headers"
                :items="feeList"
                hide-actions
                class="elevation-1"
                style="border-bottom: 1px solid #dedede;border-left: 1px solid #dedede;"
              >
                <template slot="items" slot-scope="props">
                  <td width="50">
                    <v-checkbox
                      v-model="props.item.select"
                      primary
                      hide-details
                      color="primary"
                    ></v-checkbox>
                  </td>
                  <td width="170" class="text-xs-center pt-2"> {{ props.item.soBienLai }}</td>
                  <td class="text-xs-left py-1">
                  <div>
                      <p class="mt-1 mb-0">{{props.item && props.item.paymentFee ? props.item.paymentFee : ''}}</p>
                  </div>
                  </td>
                  <td class="px-3 py-1" style="width: 170px">
                  <div>
                      <p class="mt-1 mb-0">{{props.item && props.item.feeAmount ? currency(props.item.feeAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; </p>
                  </div>
                  </td>
                  <td class="px-3 py-1" style="width: 170px">
                  <div>
                      <p class="mt-1 mb-0">{{props.item && props.item.serviceAmount ? currency(props.item.serviceAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; </p>
                  </div>
                  </td>
                  <td width="170" class="text-xs-left px-2 py-1" style="font-weight: bold;">
                  <div style="padding-top:7px">
                      <span>{{props.item && props.item.paymentAmount ? currency(props.item.paymentAmount.toString().replace(/\./g, '')) : 0}} &nbsp;&nbsp; </span>
                  </div>
                  </td>
                </template>
              </v-data-table>
              <div class="ma-3 ml-4" v-else>
                KHÔNG CÓ BIÊN LAI NÀO
              </div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-card>
  </div>
</template>

<script>

export default {
  props: {
    payments: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data: () => ({
    loading: true,
    loadingAction: false,
    feeList: [],
    headers: [
      {
        text: '',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số biên lai',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên phí, lệ phí',
        align: 'center',
        sortable: false
      },
      {
        text: 'Lệ phí',
        align: 'center',
        sortable: false
      },
      {
        text: 'Phí',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thành tiền',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let listBienLai = []
      let arrBienLai = vm.payments.groupEInvoice ? JSON.parse(vm.payments.groupEInvoice) : []
      if (!vm.payments.groupEInvoice) {
        listBienLai = []
        return
      }
      listBienLai = JSON.parse(vm.payments.groupPaymentFile)
      listBienLai.forEach(element => {
        let bienLai = arrBienLai.find(function (item) {
          return item.tranId == element.tranId
        })
        element['select'] = false
        element['soBienLai'] = bienLai ? bienLai['soBienlai'] : ''
      });
      vm.feeList = listBienLai.filter(function (item) {
        return item.hasOwnProperty('invoiceFileEntryId') && item.invoiceFileEntryId != '0'
      })
      console.log('feeList', vm.feeList)
    })
  },
  watch: {
    payments (val) {
      let vm = this
      let listBienLai = []
      let arrBienLai = vm.payments.groupEInvoice ? JSON.parse(vm.payments.groupEInvoice) : []
      if (!vm.payments.groupEInvoice) {
        listBienLai = []
        return
      }
      listBienLai = JSON.parse(vm.payments.groupPaymentFile)
      listBienLai.forEach(element => {
        let bienLai = arrBienLai.find(function (item) {
          return item.tranId == element.tranId
        })
        element['select'] = false
        element['soBienLai'] = bienLai['soBienlai']
      });
      vm.feeList = listBienLai.filter(function (item) {
        return item.hasOwnProperty('invoiceFileEntryId') && item.invoiceFileEntryId != '0'
      })
      console.log('feeList123', vm.feeList)
    }
  },
  methods: {
    getBienLaiXoa () {
      let vm = this
      let arr = vm.feeList.filter(function (item) {
        return item.select
      })
      return arr
    },
    currency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    }
  }
}
</script>
