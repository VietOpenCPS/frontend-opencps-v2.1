<template>
  <v-card flat class="mb-3">
    <div v-if="!onlyView">
      <v-flex xs12>
        <v-btn class="mx-2 right" color="primary" v-on:click.native="addNotarization">
          <v-icon size="22" color="white">add</v-icon>&nbsp;
          Thêm mới
        </v-btn>
      </v-flex>
    </div>
    <v-data-table
      :headers="headers"
      :items="notarizationList"
      :loading="loading"
      hide-actions
      class="elevation-1"
      no-data-text="Không có tài liệu nào"
      style="border-bottom: 1px solid #dedede;"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate v-if="loading"></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td :width="!onlyView ? 50 : 100" class="text-xs-center" :class="onlyView ? 'pt-1' : 'pt-3'"> {{!onlyView ? props.index + 1 : props.item.notarizationNo}}</td>
        <td class="text-xs-left py-1">
          <content-placeholders v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field
            v-if="!loading && !onlyView"
            single-line
            placeholder="Nhập tên tài liệu"
            v-model="props.item.fileName"
            clearable
            :autofocus="props.index + 1 === notarizationList.length"
            @input="changeDataItem(props.item, props.index)"
          ></v-text-field>
          <span v-if="!loading && onlyView">{{props.item.fileName}}</span>
        </td>
        <td width="70" class="text-xs-center py-1" style="font-weight: bold;">
          <content-placeholders v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field v-if="!loading && !onlyView"
            v-model="props.item.totalRecord"
            single-line
            @input="changeDataItem(props.item, props.index)"
          ></v-text-field>
          <span v-if="!loading && onlyView">{{props.item.totalRecord}}</span>
        </td>
        <td width="70" class="text-xs-center py-1" style="font-weight: bold;">
          <content-placeholders v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field v-if="!loading && !onlyView"
            v-model="props.item.totalPage"
            single-line
            @input="changeDataItem(props.item, props.index)"
          ></v-text-field>
          <span v-if="!loading && onlyView">{{props.item.totalPage}}</span>
        </td>
        <td width="120" class="text-xs-center py-1" style="font-weight: bold;">
          <content-placeholders v-if="loading">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-text-field v-if="!loading && !onlyView"
            v-model="props.item.totalFee"
            single-line
            suffix="vnđ"
            @input="changeFeeItem(props.item, props.index)"
          ></v-text-field>
          <span v-if="!loading && onlyView">{{props.item.totalFee | currency}}</span>
        </td>
        <td v-if="!onlyView" width="120" class="text-xs-center py-1">
          <v-tooltip top>
            <v-btn :disabled="loading" slot="activator" width="50" height="32" color="red" dense small dark @click="removeNotarization(props.item, props.index)">
              <v-icon>remove</v-icon>
            </v-btn>
            <span>Xóa</span>
          </v-tooltip>
          <v-tooltip top class="ml-2">
            <v-btn :disabled="loading" slot="activator" width="50" height="32" color="primary" dense small dark @click="addNotarization">
              <v-icon>add</v-icon>
            </v-btn>
            <span>Thêm</span>
          </v-tooltip>
        </td>
      </template>
      <template slot="footer" v-if="notarizationList.length > 0">
        <td :colspan="!onlyView ? headers.length - 2 : headers.length - 1" class="text-xs-center" style="border-right: 1px solid #dedede;">
          <strong style="font-size: 1.25em;">TỔNG TIỀN</strong>
        </td>
        <td :class="!onlyView ? 'px-2' : 'px-2 text-xs-center'" :style="onlyView ? 'border-right: 1px solid #dedede' : ''">
          <strong style="font-size: 1.25em;">{{fee | currency}}</strong>
          <p v-if="!onlyView" class="d-inline-block right text-bold">vnđ</p>
        </td>
        <td v-if="!onlyView" style="border-right: 1px solid #dedede;">
        </td>
      </template>
    </v-data-table>
  </v-card>

</template>

<script>
import $ from 'jquery'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '5000'
}
export default {
  props: {
    dossierInfo: {
      type: String,
      default: () => ''
    },
    formCodeInput: {
      type: String,
      default: () => ''
    },
    onlyView: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    validAdd: true,
    fileName: '',
    totalRecord: 1,
    totalPage: 1,
    notarizationList: [],
    pagination: {
      rowsPerPage: 2
    },
    totalNotarizations: 0,
    loading: false,
    dialog_notarization: false,
    doChangeSync: {},
    headers: [
      {
        text: 'STT',
        align: 'center',
        sortable: false
      },
      {
        text: 'Tên tài liệu chứng thực',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số bản',
        align: 'center',
        sortable: false
      },
      {
        text: 'Số trang',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thành tiền',
        align: 'center',
        sortable: false
      },
      {
        text: 'Thao tác',
        align: 'center',
        sortable: false
      }
    ],
    fee: ''
  }),

  created () {
    let vm = this
    if (vm.onlyView) {
      vm.headers.pop()
      vm.headers[0]['text'] = 'Số chứng thực'
    }
    vm.loading = true
    let filter = {
      dossierId: vm.dossierInfo.dossierId
    }
    vm.$store.dispatch('getNotarization', filter).then(function (result) {
      vm.loading = false
      vm.notarizationList = result
      if (vm.notarizationList.length > 0) {
        let initialValue = 0
        vm.fee = vm.notarizationList.reduce(
          (accumulator, currentValue) => accumulator + Number(currentValue.totalFee.toString().replace(/\./g, ''))
          ,initialValue
        )
        if (!vm.onlyView) {
          for (let key in vm.notarizationList) {
            vm.notarizationList[key].totalFee = vm.convertCurrency(vm.notarizationList[key].totalFee)
          }
        }
      }
    }).catch(function () {
      vm.loading = false
    })
  },
  computed: {
    originality () {
      let vm = this
      return vm.getOriginality()
    }
  },
  mounted () {
    let vm = this
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = newRoute.query
      let currentQueryOld = oldRoute.query
    },
    notarizationList () {
      let vm = this
      for (let key in vm.notarizationList) {
        vm.doChangeSync[key] = ''
      }
    }
  },
  methods: {
    initData (data) {
      let vm = this
    },
    showAddNotarization () {
      let vm = this
      vm.dialog_notarization = true
      vm.fileName = ''
      vm.totalRecord = 1
      vm.totalPage = 1
      vm.$refs.formGuide.resetValidation()
    },
    addNotarization () {
      let vm = this
      let item = {
        fileName: '',
        totalRecord: 1,
        totalPage: 1,
        totalFee: vm.feeTotal(1,1).toLocaleString('it-IT'),
        dossierId: vm.dossierInfo.dossierId,
        serviceCode: vm.dossierInfo.serviceCode,
        govAgencyCode: vm.dossierInfo.govAgencyCode
      }
      vm.loading = true
      vm.$store.dispatch('createNotarization', item).then(function (result) {
        vm.loading = false
        result.totalFee = Number(result.totalFee.toString().replace(/\./g, '')).toLocaleString('it-IT')
        vm.notarizationList.push(result)
        let initialValue = 0
        vm.fee = vm.notarizationList.reduce(
          (accumulator, currentValue) => accumulator + Number(currentValue.totalFee.toString().replace(/\./g, ''))
          ,initialValue
        )
      }).catch(function () {
        vm.loading = false
      })
    },
    removeNotarization (item, index) {
      let vm = this
      console.log('itemRemove', item)
      let x = confirm('Bạn có chắc chắn xóa tài liệu này?')
      if (x) {
        vm.$store.dispatch('deleteNotarization', item).then(function (result) {
          vm.notarizationList.splice(index, 1)
          let initialValue = 0
          vm.fee = vm.notarizationList.reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue.totalFee.toString().replace(/\./g, ''))
            ,initialValue
          )
        }).catch(function (){
        })
      }
    },
    changeDataItem (item, index) {
      let vm = this
      vm.notarizationList[index].totalFee = Number(vm.feeTotal(item.totalRecord, item.totalPage)).toLocaleString('it-IT')
      let initialValue = 0
      vm.fee = vm.notarizationList.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.totalFee.toString().replace(/\./g, ''))
        ,initialValue
      )

      function changeData () {
        vm.doChangeSync[index] = setTimeout(function () {
          vm.$store.dispatch('updateNotarization', item).then(function (result) {
          }).catch(function (){
          })
        }, 1500)
      }
      clearTimeout(vm.doChangeSync[index])
      changeData()
    },
    changeFeeItem (item, index) {
      let vm = this
      vm.notarizationList[index].totalFee = Number(vm.notarizationList[index].totalFee.toString().replace(/\./g, '')).toLocaleString('it-IT')
      let initialValue = 0
      vm.fee = vm.notarizationList.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.totalFee.toString().replace(/\./g, ''))
        ,initialValue
      )
      function changeData () {
        vm.doChangeSync[index] = setTimeout(function () {
          vm.$store.dispatch('updateNotarization', item).then(function (result) {
          }).catch(function (){
          })
        }, 1500)
      }
      clearTimeout(vm.doChangeSync[index])
      changeData()
    },
    dataExport () {
      let vm = this
      for (let key in vm.notarizationList) {
        vm.notarizationList[key].totalRecord = Number(vm.notarizationList[key].totalRecord)
        vm.notarizationList[key].totalPage = Number(vm.notarizationList[key].totalPage)
        vm.notarizationList[key].totalFee = Number(vm.notarizationList[key].totalFee.toString().replace(/\./g, ''))
      }
      let dataExport = {
        notarizationList: vm.notarizationList,
        feeTotal: vm.fee
      }
      console.log('dataExport', dataExport)
      return dataExport
    },
    cancelAdd () {
      let vm = this
    },
    feeTotal (copy, page) {
      let vm = this
      let copies = isNaN(Number(copy)) ? 0 : Number(copy)
      let pages = isNaN(Number(page)) ? 0 : Number(page)
      let mod = pages - 2
      if (mod > 0) {
        let pay = copies*(2*2000 + mod*1000)
        return pay < 200000 ? pay : 200000
      } else {
        return copies*pages*2000
      }
    },
    convertCurrency (value) {
      if (value) {
        let moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      }
      return ''
    }
  },
  filters: {
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
