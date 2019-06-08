<template>
  <div id="contain-dhxh">
    <v-card flat color="#1867c0" class="py-4" style="height: 100px;">
      <v-flex xs12 class="text-xs-center">
        <h1 style="font-size:36px; color: #ffffff" class="text-bold">HỆ THỐNG XẾP HÀNG TỰ ĐỘNG</h1>
      </v-flex>
    </v-card>
    <v-layout wrap style="height: calc(100vh - 100px)">
      <v-flex>
        <v-data-table
          id="table-dieuhanhxephang"
          :headers="headers"
          :items="queueList"
          hide-actions
          class="table-landing table-bordered"
        >
          <template slot="items" slot-scope="props">
            <tr style="cursor: pointer;" :style="'height:' + rowHeight + 'px'">
              <td class="text-xs-center text-bold py-2" style="letter-spacing:2px;color:#1867c0;font-weight:600;font-size: 36px !important;" width="200px">
                <div>
                  <span>{{props.item.gateNumber}}</span>
                </div>
              </td>

              <td class="text-xs-center text-bold py-2" width="250px" style="letter-spacing:2px;">
                <div>
                  <span>{{props.item.eFormNo}}</span><br>
                </div>
              </td>
              <td class="text-xs-left text-bold py-2 px-4" width="450px" style="letter-spacing:2px">
                <div style="text-transform: uppercase">
                  <span>{{props.item.applicantName}}</span>
                </div>
              </td>
              
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex style="max-width:400px;">
        <div xs12 class="" style="background:#ededed;width:100%;height:100%;display: table; border-bottom: 1px solid #dedede">
          <div class="logo" style="display: table-cell;
            text-align: center;
            vertical-align: middle;">
            <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png">
            <h1 style="font-size:34px; color: #1867c0" class="text-bold">CỤC LÃNH SỰ</h1>
          </div>
        </div>
        <!-- <div style="width:100%;height:auto;display: table;">
          <div style="display: table-cell;
            text-align: center;
            vertical-align: middle;">
            <span>LƯỢT CHỜ: </span>
            <span>25</span>
          </div>
        </div> -->
      </v-flex>
    </v-layout>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
import support from '../../store/support.json'
import TinyPagination from './Pagination.vue'
Vue.use(toastr)
export default {
  props: [],
  components: {
    'tiny-pagination': TinyPagination
  },
  data: () => ({
    rowHeight: 70,
    queueList: [
      {
        gateNumber: '01',
        eFormNo: '1989644',
        applicantName: 'Trần Văn Duẩn'
      },
      {
        gateNumber: '02',
        eFormNo: '1964613',
        applicantName: 'Vũ Văn Nguyên'
      },
      {
        gateNumber: '03',
        eFormNo: '1349644',
        applicantName: 'Nguyễn Nguyên Nam'
      },
      {
        gateNumber: '04',
        eFormNo: '1981225',
        applicantName: 'Vũ Đình Huy'
      },
      {
        gateNumber: '05',
        eFormNo: '1954211',
        applicantName: 'Trịnh Công Trình'
      }
    ],
    headers: [
      {
        text: 'BÀN SỐ',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'MÃ TỜ KHAI',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'NGƯỜI NỘP',
        align: 'center',
        sortable: false,
        class: 'py-3'
      }
    ]
  }),
  computed: {
    isMobile () {
      return this.$store.getters.getIsMobile
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
      vm.rowHeight = ($( window ).height() - 187) / vm.queueList.length
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {},
  methods: {
    getDanhSachCho () {
      var vm = this
      let currentQuery = vm.$router.history.current.query
      let filter = {}
      vm.$store.dispatch('getThongTinXepHang', filter).then(function (result) {
        if (result.data) {
          vm.queueList = result.data
        }
      }).catch(reject => {
      })
    }
  }
}
</script>
