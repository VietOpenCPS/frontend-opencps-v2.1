<template>  
  <div class="phancong" style="background-color: white;width:100%">
    <div v-if="type > 0">
      <v-layout wrap>
        <v-checkbox v-for="(item, index) in data_phancong" v-bind:key="item.userId"
        slot="activator"
        v-model="item.assigned"
        :label="item.userName ? item.userName : item['fullName']"
        @change = 'changeAssigned($event, index)'
        style="display:inline-block;min-width:190px;max-width:190px"
        :title="item.userName ? item.userName : item['fullName']"
        >
          <template slot="label"><span class="black--text">{{item.userName ? item.userName : item['fullName']}}</span></template>
        </v-checkbox>
      </v-layout>
      <span class="ml-3" v-if="!assignValidate" style="color:#f44336">* Yêu cầu chọn người để thực hiện</span>
    </div>
    <!--  -->
    <v-card-text v-else>
      <v-layout wrap class="my-1">
        <div class="ml-3" v-for="(item, index) in data_phancong" v-bind:key="item.userId">
          <v-layout wrap>
            <v-tooltip top>
              <v-checkbox 
                slot="activator"
                v-model="item.assigned"
                :label="item.userName ? item.userName : item['fullName']"
                @change = 'checkAsign($event, index)'
                style="min-width:150px"
              ></v-checkbox>
              <span class="pl-0"> {{item.userName ? item.userName : item['fullName']}} </span>
            </v-tooltip>
            
            <toggle-button class="mx-1 btn-tgl"
            :id="`btn-${index}`"                                           
            v-model="presenterAddGroup"
            title_checked = "Thực hiện"
            title_unchecked = "Phối hợp"
            :labels="{checked: 'TH', unchecked: 'PH'}"
            :color="{checked: '#7DCE94', unchecked: '#82C7EB'}"
            :width="50"
            @change="changeTypeAssign($event, index)"/>
          </v-layout>
        </div>
      </v-layout>
      <span class="ml-3" v-if="!assignValidate" style="color:#f44336">* Yêu cầu chọn người thực hiện</span>
    </v-card-text>
  </div>
</template>
<script>
// import $ from 'jquery'
import toggleButton from '../toggleButton.vue'
export default {
  components: {
    'toggle-button': toggleButton
  },
  props: {
    reAsignUsers: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: () => 1
    },
    configNote: {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: 'reAsignUsers'
  },
  data: () => ({
    data_phancong: [],
    assignedtype_items: {
      '2': [
        {text: 'Không có phân công', value: 0},
        {text: 'Thực hiện chính', value: 1},
        {text: 'Thực hiện phối hợp', value: 2}
      ],
      '3': [
        {text: 'Không có phân công', value: 0},
        {text: 'Thực hiện chính', value: 1},
        {text: 'Thực hiện phối hợp', value: 2},
        {text: 'Theo dõi', value: 3}
      ]
    },
    title_asign: {
      '1': 'PHÂN CÔNG NGƯỜI THỰC HIỆN',
      '2': 'PHÂN CÔNG THỰC HIỆN, PHỐI HỢP',
      '3': 'PHÂN CÔNG THỰC HIỆN, PHỐI HỢP VÀ THEO DÕI'
    },
    presenterAddGroup: true,
    assignValidate: true
  }),
  created () {
    var vm = this
    setTimeout(function () {
      window.$('.btn-tgl').addClass('btn-hidden')
    }, 200)
  },
  mounted () {
    this.data_phancong = this.reAsignUsers
  },
  watch: {
    reAsignUsers (val) {
      this.data_phancong = val
    }
  },
  methods: {
    changeAssigned (event, index) {
      var vm = this
      if (vm.type === 1) {
        if (event === true) {
          vm.reAsignUsers[index].assigned = 1
        } else {
          vm.reAsignUsers[index].assigned = 0
        }
      }
    },
    checkAsign (event, index) {
      var vm = this
      if (event) {
        vm.reAsignUsers[index].assigned = 1
        window.$(`#btn-${index}`).removeClass('btn-hidden')
      } else {
        vm.reAsignUsers[index].assigned = 0
        window.$(`#btn-${index}`).addClass('btn-hidden')
      }
      // console.log('vm.reAsignUsers', vm.reAsignUsers)
    },
    changeTypeAssign (event, index) {
      var vm = this
      if (event.value) {
        vm.reAsignUsers[index].assigned = 1
        window.$(`#btn-${index}`).removeClass('btn-hidden')
      } else {
        vm.reAsignUsers[index].assigned = 2
        window.$(`#btn-${index}`).addClass('btn-hidden')
      }
      // console.log('vm.reAsignUsers', vm.reAsignUsers)
    },
    doExport () {
      var vm = this
      let assign = vm.reAsignUsers.filter(function (item) {
        return Number(item.assigned) > 0
      })
      if (assign.length === 0) {
        vm.assignValidate = false
        return vm.assignValidate
      } else {
        vm.assignValidate = true
        return vm.assignValidate
      }
    }
  }
}
</script>
