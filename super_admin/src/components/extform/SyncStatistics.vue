<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
      >
        
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      "></a>
    </v-breadcrumbs>
    <v-card class="px-2 mx-1">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          Đồng bộ thống kê hồ sơ
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-3">
          <v-layout wrap>
              <v-flex xs12 md4>
                <v-autocomplete
                    class="select-border"
                    :items="months"
                    v-model="monthSelected"
                    item-text="name"
                    item-value="value"
                    label="Tháng"
                    :hide-selected="true"
                    box
                    @change="changeDate()"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 md4>
                <v-autocomplete
                    class="select-border"
                    :items="years"
                    v-model="yearSelected"
                    label="Năm"
                    item-text="name"
                    item-value="value"
                    :hide-selected="true"
                    box
                    @change="changeDate()"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                  <v-layout wrap>
                      <v-flex :class="item.class" v-for="(item, index) in fields" :key="index" v-if="!item.hiden">
                        <v-text-field
                            box
                            :label="item.label"
                            v-model="dataPOST.data[0][item.value]"
                        ></v-text-field>
                      </v-flex>
                  </v-layout>
              </v-flex>
              <v-flex xs12   class="text-xs-right">
                <v-btn  color="blue darken-3" class="white--text" @click="postSyncStatistics()">Gửi đi</v-btn>
              </v-flex>
          </v-layout>
      </div>
    </v-card>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="#EF5350"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="snackbarerror = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'

Vue.use(toastr)
export default {
  props: ['index'],
  components: {
  },
  data: () => ({
    snackbarerror: false,
    snackbarsuccess: false,
    months: [{name: 'Tháng 1', value: 0}, {name: 'Tháng 2', value: 1}, {name: 'Tháng 3', value: 2}, {name: 'Tháng 4', value: 3}, {name: 'Tháng 5', value: 4}, {name: 'Tháng 6', value: 5}, {name: 'Tháng 7', value: 6}, {name: 'Tháng 8', value: 7}, {name: 'Tháng 9', value: 8}, {name: 'Tháng 10', value: 9}, {name: 'Tháng 11', value: 10}, {name: 'Tháng 12', value: 11}],
    years: [{name: 'Năm 2020', value: 2020},{name: 'Năm 2019', value: 2019},{name: 'Năm 2018', value: 2018}],
    monthSelected: 0,
    yearSelected: 2020,
    madonvi: '',
    fields: [
      {
        label: 'Mã đơn vị',
        class: 'xs12 md4',
        value: 'Madonvi',
        model: '',
        hiden: true,
      },
      {
        label: 'Tên đơn vị',
        class: 'xs12 md4',
        value: 'TenDonVi',
        model: ''
      },     
      {
        label: 'Số nhận trong kỳ',
        class: 'xs12 md4',
        value: 'SoNhanTrongKy',
        model: ''
      },
      {
        label: 'Số tồn kỳ trước',
        value: 'SoTonKyTruoc',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng số xử lý',
        value: 'TongSoXuLy',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng đã xử lý',
        value: 'TongDaXuLy',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng xử lý đúng hạn',
        value: 'TongXuLyDungHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Phần trăm xử lý đúng hạn',
        value: 'PhanTramXuLyDungHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng xử lý trễ hạn',
        value: 'TongXuLyTreHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Phần trăm xử lý trễ hạn',
        value: 'PhanTramXuLyTreHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng chưa xử lý',
        value: 'TongChuaXuLy',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng chưa xử lý trong hạn',
        value: 'TongChuaXuLyTrongHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Phần trăm chưa xử lý trong hạn',
        value: 'PhanTramChuaXuLyTrongHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Tổng chưa xử lý chễ hạn',
        value: 'TongChuaXuLyTreHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Phần tăm chưa xử lý trễn hạn',
        value: 'PhanTramChuaXuLyTreHan',
        class: 'xs12 md4',
        model: ''
      },
      {
        label: 'Ghi chú',
        value: 'GhiChu',
        class: 'xs12 md4',
        model: ''
      }
    ],
    listThongke: [],
    dataPOST: {
        "service":"DongBoThongKeHoSo",
        "madonvi": "000.00.00.G05",
        "data": [{
            "Thang": "7",
            "Nam": "2020",
            "SoNhanTrongKy": "0",
            "SoTonKyTruoc": "0",
            "TongSoXuLy": "0",
            "TongDaXuLy": "0",
            "TongXuLyDungHan": "0",
            "PhanTramXuLyDungHan": "0",
            "TongXuLyTreHan": "0",
            "PhanTramXuLyTreHan": "0",
            "TongChuaXuLy": "0",
            "TongChuaXuLyTrongHan": "0",
            "PhanTramChuaXuLyTrongHan": "0",
            "TongChuaXuLyTreHan": "0",
            "PhanTramChuaXuLyTreHan": "0",
            "GhiChu": "",
            "Madonvi": "000.00.00.G05",
            "TenDonVi": "Bộ Kế hoạch và Đầu tư",
            "LoaiThongKe": "1"
        }]
    }
  }),
  computed: {

  },
  created () {
    let vm = this
    vm.$nextTick(function () {
        let serverconfig = 'DVCQG_INTEGRATION'
        vm.$store.dispatch('getServerconfigs',serverconfig).then(function (result) {
          let configs = JSON.parse(result.configs)
          vm.fields[0].model = configs.madonvi
          vm.fields[1].model = configs.tendonvi
          vm.dataPOST['madonvi'] =  configs.madonvi
          vm.dataPOST.data[0]['Madonvi'] =  configs.madonvi
          vm.dataPOST.data[0]['TenDonVi'] =  configs.tendonvi
          console.log(vm.fields)
        }).catch(function (){})
        let filter = {
            domain: 'total',
            agency: 'total',
            month: String(vm.monthSelected),
            year: String(vm.yearSelected)
        }
        vm.$store.dispatch('getStatistics',filter).then(function (result) {
          console.log(result)
          if(result.data && result.data.length) {
            vm.dataPOST.data[0]['SoNhanTrongKy'] = String(result.data[0].receivedCount)
            vm.dataPOST.data[0]['SoTonKyTruoc'] = String(result.data[0].remainingCount)
            vm.dataPOST.data[0]['TongSoXuLy'] = String(result.data[0].processCount)
            vm.dataPOST.data[0]['TongDaXuLy'] = String(result.data[0].releaseCount)
            vm.dataPOST.data[0]['TongXuLyDungHan'] = String(result.data[0].ontimeCount)
            vm.dataPOST.data[0]['PhanTramXuLyDungHan'] = String(((result.data[0].ontimeCount / result.data[0].releaseCount)*100).toFixed(2))
            vm.dataPOST.data[0]['TongXuLyTreHan'] = String(result.data[0].overdueCount)
            vm.dataPOST.data[0]['PhanTramXuLyTreHan'] = String(((result.data[0].overdueCount/result.data[0].processingCount)*100).toFixed(2))
            vm.dataPOST.data[0]['TongChuaXuLy'] = String(result.data[0].processingCount)
            vm.dataPOST.data[0]['TongChuaXuLyTrongHan'] = String(result.data[0].ontimeCount)
            vm.dataPOST.data[0]['PhanTramChuaXuLyTrongHan'] = String(result.data[0].ontimePercentage)
            vm.dataPOST.data[0]['TongChuaXuLyTreHan'] = String(result.data[0].overtimeCount)
            vm.dataPOST.data[0]['PhanTramChuaXuLyTreHan'] = String(((result.data[0].overtimeCount/result.data[0].processingCount)*100).toFixed(2))
          } else {
            vm.dataPOST.data[0]['SoNhanTrongKy'] = '0'
            vm.dataPOST.data[0]['SoTonKyTruoc'] = '0'
            vm.dataPOST.data[0]['TongSoXuLy'] = '0'
            vm.dataPOST.data[0]['TongDaXuLy'] = '0'
            vm.dataPOST.data[0]['TongXuLyDungHan'] = '0'
            vm.dataPOST.data[0]['PhanTramXuLyDungHan'] = '0'
            vm.dataPOST.data[0]['TongXuLyTreHan'] = '0'
            vm.dataPOST.data[0]['PhanTramXuLyTreHan'] = '0'
            vm.dataPOST.data[0]['TongChuaXuLy'] = '0'
            vm.dataPOST.data[0]['TongChuaXuLyTrongHan'] = '0'
            vm.dataPOST.data[0]['PhanTramChuaXuLyTrongHan'] = '0'
            vm.dataPOST.data[0]['TongChuaXuLyTreHan'] = '0'
            vm.dataPOST.data[0]['PhanTramChuaXuLyTreHan'] = '0'           
          }

          console.log(vm.dataPOST)
        }).catch(function (){})
     
    })
  },
  watch: {

  },
  methods: {
    changeDate() {
      let vm = this
      vm.dataPOST.data[0]['Thang'] = String(vm.monthSelected)
      vm.dataPOST.data[0]['Nam'] = String(vm.yearSelected)
      let filter = {
        domain: 'total',
          agency: 'total',
          month: vm.monthSelected,
          year: vm.yearSelected
      }
      vm.$store.dispatch('getStatistics',filter).then(function (result) {
          console.log(result)
          if(result.data && result.data.length) {
            vm.dataPOST.data[0]['SoNhanTrongKy'] = String(result.data[0].receivedCount)
            vm.dataPOST.data[0]['SoTonKyTruoc'] = String(result.data[0].remainingCount)
            vm.dataPOST.data[0]['TongSoXuLy'] = String(result.data[0].processCount)
            vm.dataPOST.data[0]['TongDaXuLy'] = String(result.data[0].releaseCount)
            vm.dataPOST.data[0]['TongXuLyDungHan'] = String(result.data[0].ontimeCount)
            vm.dataPOST.data[0]['PhanTramXuLyDungHan'] = String(((result.data[0].ontimeCount / result.data[0].releaseCount)*100).toFixed(2))
            vm.dataPOST.data[0]['TongXuLyTreHan'] = String(result.data[0].overdueCount)
            vm.dataPOST.data[0]['PhanTramXuLyTreHan'] = String(((result.data[0].overdueCount/result.data[0].processingCount)*100).toFixed(2))
            vm.dataPOST.data[0]['TongChuaXuLy'] = String(result.data[0].processingCount)
            vm.dataPOST.data[0]['TongChuaXuLyTrongHan'] = String(result.data[0].ontimeCount)
            vm.dataPOST.data[0]['PhanTramChuaXuLyTrongHan'] = String(result.data[0].ontimePercentage)
            vm.dataPOST.data[0]['TongChuaXuLyTreHan'] = String(result.data[0].overtimeCount)
            vm.dataPOST.data[0]['PhanTramChuaXuLyTreHan'] = String(((result.data[0].overtimeCount/result.data[0].processingCount)*100).toFixed(2))
          } else {
            vm.dataPOST.data[0]['SoNhanTrongKy'] = '0'
            vm.dataPOST.data[0]['SoTonKyTruoc'] = '0'
            vm.dataPOST.data[0]['TongSoXuLy'] = '0'
            vm.dataPOST.data[0]['TongDaXuLy'] = '0'
            vm.dataPOST.data[0]['TongXuLyDungHan'] = '0'
            vm.dataPOST.data[0]['PhanTramXuLyDungHan'] = '0'
            vm.dataPOST.data[0]['TongXuLyTreHan'] = '0'
            vm.dataPOST.data[0]['PhanTramXuLyTreHan'] = '0'
            vm.dataPOST.data[0]['TongChuaXuLy'] = '0'
            vm.dataPOST.data[0]['TongChuaXuLyTrongHan'] = '0'
            vm.dataPOST.data[0]['PhanTramChuaXuLyTrongHan'] = '0'
            vm.dataPOST.data[0]['TongChuaXuLyTreHan'] = '0'
            vm.dataPOST.data[0]['PhanTramChuaXuLyTreHan'] = '0'           
          }

          console.log(vm.dataPOST)
      }).catch(function (){})
    },
    postSyncStatistics(){
      let vm = this
      vm.dataPOST.data[0]['Thang'] = String(vm.monthSelected)
      vm.dataPOST.data[0]['Nam'] = String(vm.yearSelected)
      vm.$store.dispatch('postSyncStatistics',vm.dataPOST).then(function (result) {
        vm.snackbarsuccess = true
      }).catch(function (){})
    }

  }
}
</script>
