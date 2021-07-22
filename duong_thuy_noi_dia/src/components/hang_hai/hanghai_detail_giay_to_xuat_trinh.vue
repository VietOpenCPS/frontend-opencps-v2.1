<template>
  <div style="width: 100%; position: relative;">
  <v-expansion-panel expand class="my-0 thong__tin_chung_hanghai thong__tin_gt_xt">
      <v-expansion-panel-content v-bind:value="true" class="px-0">
        <div slot="header" class="text-bold primary--text">{{title_name}}</div>
        <v-data-table
          v-bind:headers="headers"
          :items="items"
          hide-actions
          class="giay_to_xuat_trinh table-bordered"
        >
          <template slot="items" slot-scope="props">
            <td style="padding: 0 8px;">
              {{ props.index + 1 }}
            </td>
            <td class="text-xs-left px-2">
              {{ props.item.typeText }}
            </td>
            <td class="text-xs-left" style="padding: 0 10px;">
              <v-text-field
                v-model="props.item.giayChungNhan"
                placeholder="số giấy chứng nhận"
                single-line
                class="pb-0 pt-1"
              ></v-text-field>
            </td>
            <td class="text-xs-left" style="padding: 0 10px;">
              <v-subheader class="px-0">
                <datetime-picker
                  v-model="props.item.ngayCap"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
              </v-subheader>
            </td>
          <td class="text-xs-left" style="padding: 0 10px;">
            <v-subheader class="px-0">
                <datetime-picker
                  v-model="props.item.ngayHetHan"
                  :first-day="1"
                  :show-dst="false"
                  :show-hours="true"
                  :show-minutes="true"
                  :show-seconds="false"
                ></datetime-picker>
            </v-subheader>
          </td>
          <td class="text-xs-center px-0">
            {{ props.item.nguoiKiemDuyet }}
          </td>
          <td class="text-xs-center px-0" style="padding: 0 5px;">
            <v-checkbox v-model="props.item.yeuCauXuatTrinh"></v-checkbox>
          </td>
          <td class="text-xs-center px-0" style="padding: 0 5px;">
            <v-checkbox v-model="props.item.daKiemTra"></v-checkbox>
          </td>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import DatetimePicker from './DatetimePicker.vue'
const COMPONENT_NAME = 'jx-hanghai-detail-giay-to-xuat-trinh'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    detail_tp: {},
    items: [],
    name_column_1: '',
    title_name: ''
  },
  components: {
    'datetime-picker': DatetimePicker
  },
  data () {
    return {
      loadingPDF: true,
      headers: [
        {
          text: 'STT',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tên giấy chứng nhận',
          align: 'left',
          sortable: false
        },
        {
          text: 'GCN số',
          align: 'left',
          sortable: false
        },
        {
          text: 'Ngày cấp',
          align: 'left',
          sortable: false
        },
        {
          text: 'Ngày hết hạn',
          align: 'left',
          sortable: false
        },
        {
          text: 'Người kiểm duyệt',
          align: 'center',
          sortable: false
        },
        {
          text: 'Yêu cầu xuất trình',
          align: 'center',
          class: 'processchecked1',
          sortable: false
        },
        {
          text: 'Đã kiểm tra',
          align: 'center',
          class: 'processchecked2',
          sortable: false
        }
      ]
    }
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      if (vm.name_column_1.length > 5) {
        vm.headers[1].text = vm.name_column_1
      } else {
        vm.headers[1].text = 'Tên giấy chứng nhận'
      }
      var processchecked1 = document.querySelectorAll('.processchecked1')
      for (var i = 0, len = processchecked1.length; i < len; i++) {
        processchecked1[i].innerHTML = 'Yêu <br/> cầu <br/> xuất <br/> trình'
      }
      var processchecked2 = document.querySelectorAll('.processchecked2')
      for (var i2 = 0, len2 = processchecked2.length; i2 < len2; i2++) {
        processchecked2[i2].innerHTML = 'Đã <br/> kiểm <br/> tra'
      }
    })
  },
  methods: {
  }
}
</script>
