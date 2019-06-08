<template>
  <v-card flat color="#1867c0" id="contain-ctn" class="pb-4">
    <v-flex xs12 class="header_login text-xs-center pt-3">
      <div class="logo d-inline-block">
        <img src="http://hanoi.fds.vn:1580/o/bongoaigiao-theme/images/logo3.png"> 
        <h1 style="font-size:34px; color: #ffffff" class="text-bold">CỤC LÃNH SỰ</h1>
      </div>
    </v-flex>
    <v-flex xs12 class="text-xs-center" style="margin-top: 20px">
      <h1 style="font-size:32px; color: yellow" class="text-bold">DANH SÁCH XẾP HÀNG NỘP HỒ SƠ</h1>
    </v-flex>
    <v-data-table
      id="table-danhsachcho"
      :headers="headers"
      :items="applicantList"
      hide-actions
      class="table-landing table-bordered mx-5"
      style="border-left: 1px solid #dedede; margin-top: 30px;"
    >
      <template slot="items" slot-scope="props">
        <tr v-bind:class="{'active': props.index%2==1}" style="cursor: pointer;">
          <td class="text-xs-center text-bold py-2" width="150px">
            <div>
              <span>{{props.index + 1}}</span><br>
            </div>
          </td>
          <td class="text-xs-center text-bold py-2" style="letter-spacing:2px" width="300px">
            <div>
              <span>{{props.item.formCode}}</span>
            </div>
          </td>
          <td class="text-xs-left text-bold py-2 px-5" style="letter-spacing:2px; word-spacing:2px">
            <div style="text-transform: uppercase">
              <span>{{props.item.applicantName}}</span>
            </div>
          </td>
          <td class="text-xs-center text-bold py-2" style="letter-spacing:2px;color:#1867c0;font-weight:600;font-size: 36px !important;" width="150px">
            <div>
              <span>{{props.item.counter}}</span>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
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
    applicantList: [
      {
        formCode: 143983123,
        applicantName: 'Trần Văn Duẩn',
        counter: '02'
      },
      {
        formCode: 123983123,
        applicantName: 'Trần Viết Lãm',
        counter: '04'
      },
      {
        formCode: 123483123,
        applicantName: 'Trịnh Công Trình',
        counter: '01'
      },
      {
        formCode: 123984523,
        applicantName: 'Nguyễn Tấn Dũng',
        counter: '05'
      },
      {
        formCode: 123933123,
        applicantName: 'Nông Đức Mạnh'
      },
      {
        formCode: 123922123,
        applicantName: 'Trần Văn Duẩn'
      },
      {
        formCode: 123548123,
        applicantName: 'Trần Đức Lương'
      },
      {
        formCode: 143983123,
        applicantName: 'Trần Văn Duẩn'
      },
      {
        formCode: 123983123,
        applicantName: 'Trần Viết Lãm'
      },
      {
        formCode: 123483123,
        applicantName: 'Trịnh Công Trình'
      },
      {
        formCode: 123984523,
        applicantName: 'Nguyễn Tấn Dũng'
      },
      {
        formCode: 123933123,
        applicantName: 'Nông Đức Mạnh'
      },
      {
        formCode: 123922123,
        applicantName: 'Trần Văn Duẩn'
      },
      {
        formCode: 123548123,
        applicantName: 'Trần Đức Lương'
      }
    ],
    headers: [
      {
        text: 'THỨ TỰ',
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
        text: 'NGƯỜI NỘP HỒ SƠ',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'BÀN SỐ',
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
      vm.getDanhSachCho()
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
      vm.$store.dispatch('getDanhSachCho', filter).then(function (result) {
        if (result.data) {
          vm.applicantList = result.data
        }
      }).catch(reject => {
      })
    }
  }
}
</script>

