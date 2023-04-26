<template>
  <v-data-table
    id="table-danhsachcho"
    :headers="headers"
    :items="applicantList"
    hide-actions
    class="table-landing table-bordered"
  >
    <template slot="items" slot-scope="props">
      <tr>
        <td class="text-xs-center text-bold px-0" style="">
          <div>
            <!-- <span style="font-size:22px">{{props.index + 1}}</span> -->
            <span style="font-size:22px">{{props.item['count']}}</span>
          </div>
        </td>
        <td class="text-xs-center text-bold px-0" style="">
          <div>
            <span style="font-size:26px">{{props.item['codeNumber']}}</span>
          </div>
        </td>
        <!-- <td class="text-xs-left text-bold py-2" style="">
          <div style="">
            <span>{{props.item.bookingName}}</span>
          </div>
        </td> -->
      </tr>
    </template>
    <template slot="no-data">
      <v-card flat color="transparent">
        <v-flex class="text-xs-center white--text">
          <span>Không có</span>
        </v-flex>
      </v-card>
    </template>
  </v-data-table>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import toastr from 'toastr'
Vue.use(toastr)
export default {
  props: ['applicantList'],
  components: {
  },
  data: () => ({
    groupId: window.themeDisplay ? window.themeDisplay.getScopeGroupId() : '',
    headers: [
      {
        text: 'TT',
        align: 'center',
        sortable: false,
        class: 'py-3'
      },
      {
        text: 'MÃ TK/BN',
        align: 'center',
        sortable: false,
        class: 'py-3'
      }
      // {
      //   text: 'HỌ TÊN',
      //   align: 'center',
      //   sortable: false,
      //   class: 'py-3'
      // }
    ]
  }),
  computed: {
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let current = vm.$router.history.current
      let currentQuery = current.query
    })
  },
  updated () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
  },
  methods: {
  }
}
</script>
