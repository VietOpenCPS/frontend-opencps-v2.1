<template>  
  <div class="phancong" style="background-color: white;width:100%">
    <v-expansion-panel v-if="type === 3 || type === 4" :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>Phân công chỉ đạo
        </div>
        <v-card >
          <div class="px-4 py-1">
            <v-layout wrap>
              <v-checkbox v-for="(item, index) in data_uyquyen" v-bind:key="item.userId"
              slot="activator"
              v-model="item.assigned"
              @change = 'changeDelegacy($event, index)'
              style="display:inline-block;min-width:190px;max-width:190px"
              :title="item.userName"
              >
                <template slot="label"><span class="black--text">{{item.userName}}</span></template>
              </v-checkbox>
            </v-layout>
          </div>
          <!-- <v-flex class="pl-4 pb-3">
            <v-btn color="primary" @click="doReAsign" class="mx-0 my-0">
              <v-icon class="white--text">supervisor_account</v-icon>&nbsp;
              Ủy quyền
            </v-btn>
          </v-flex> -->
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!--  -->
    <v-expansion-panel :value="[true]" expand  class="expansion-pl">
      <v-expansion-panel-content>
        <div slot="header">
          <div class="background-triangle-small"> 
            <v-icon size="18" color="white">star_rate</v-icon> 
          </div>Chọn người thực hiện
        </div>
        <v-card >
          <div v-if="type === 1 || type === 3" class="px-4 py-1">
            <v-layout wrap>
              <v-checkbox v-for="(item, index) in data_phancong" v-bind:key="item.userId"
              slot="activator"
              v-model="item.assigned"
              @change = 'changeAssigned($event, index)'
              style="display:inline-block;min-width:190px;max-width:190px"
              :title="item.userName"
              >
                <template slot="label"><span class="black--text">{{item.userName}}</span></template>
              </v-checkbox>
            </v-layout>
            <!-- <span class="ml-3" v-if="!assignValidate" style="color:#f44336">* Yêu cầu chọn người để thực hiện</span> -->
          </div>
          <!--  -->
          <v-card-text v-if="type === 2 || type === 4" class="px-4 py-1">
            <v-layout wrap class="my-1">
              <div class="ml-3" v-for="(item, index) in data_phancong" v-bind:key="item.userId">
                <v-layout wrap>
                  <v-tooltip top>
                    <v-checkbox 
                      slot="activator"
                      v-model="item.assigned"
                      :label="item.userName"
                      @change = 'checkAsign($event, index)'
                      style="min-width:150px"
                    ></v-checkbox>
                    <span class="pl-0"> {{item.userName}} </span>
                  </v-tooltip>
                  
                  <!-- <toggle-button class="mx-1 btn-tgl"
                  :id="`btn-${index}`"                                           
                  v-model="presenterAddGroup"
                  title_checked = "Thực hiện"
                  title_unchecked = "Phối hợp"
                  :labels="{checked: 'TH', unchecked: 'PH'}"
                  :color="{checked: '#7DCE94', unchecked: '#82C7EB'}"
                  :width="50"
                  @change="changeTypeAssign($event, index)"/> -->
                </v-layout>
              </div>
            </v-layout>
            <!-- <span class="ml-3" v-if="!assignValidate" style="color:#f44336">* Yêu cầu chọn người để thực hiện</span> -->
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>
<script>
// import $ from 'jquery'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '2000'
}
import toggleButton from '../toggleButton.vue'
export default {
  components: {
    'toggle-button': toggleButton
  },
  props: {
    assign_items: {
      type: Array,
      default: () => []
    },
    data_uyquyen: {
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
    },
    detailDossier : {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: 'assign_items'
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
    this.data_phancong = this.assign_items
  },
  methods: {
    changeAssigned (event, index) {
      var vm = this
      if (vm.type !== 0) {
        if (event === true) {
          vm.assign_items[index].assigned = 1
        } else {
          vm.assign_items[index].assigned = 0
        }
      }
    },
    changeDelegacy (event, index) {
      var vm = this
      if (vm.type === 3 || vm.type === 4) {
        if (event === true) {
          vm.data_uyquyen[index].assigned = 1
        } else {
          vm.data_uyquyen[index].assigned = 0
        }
      }
    },
    checkAsign (event, index) {
      var vm = this
      if (event) {
        vm.assign_items[index].assigned = 1
        window.$(`#btn-${index}`).removeClass('btn-hidden')
      } else {
        vm.assign_items[index].assigned = 0
        window.$(`#btn-${index}`).addClass('btn-hidden')
      }
      // console.log('vm.assign_items', vm.assign_items)
    },
    changeTypeAssign (event, index) {
      var vm = this
      if (event.value) {
        vm.assign_items[index].assigned = 1
        window.$(`#btn-${index}`).removeClass('btn-hidden')
      } else {
        vm.assign_items[index].assigned = 2
        window.$(`#btn-${index}`).addClass('btn-hidden')
      }
      // console.log('vm.assign_items', vm.assign_items)
    },
    doReAsign () {
      let vm = this
      let filter = {
        'dossierId': vm.detailDossier.dossierId,
        'users': vm.data_uyquyen
      }
      vm.$store.dispatch('postDossierUserAsign', filter).then(function (result) {
        toastr.success('Yêu cầu của bạn thực hiện thành công')
      }).catch(function (error) {
      })
    },
    doExport () {
      var vm = this
      let assign = vm.assign_items.filter(function (item) {
        return Number(item.assigned) > 0
      })
      if (assign.length === 0) {
        vm.assignValidate = false
        return vm.assignValidate
      } else {
        vm.assignValidate = true
        return vm.assignValidate
      }
    },
    getDataDelegacy () {
      let vm = this
      return vm.data_uyquyen
    }
  }
}
</script>
