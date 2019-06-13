<template>
  <v-data-table
    id="table-danhsachcho"
    :headers="headers"
    :items="applicantList"
    hide-actions
    class="table-landing table-bordered"
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
      </tr>
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
      }
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
