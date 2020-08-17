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
              <!-- <v-flex style="max-width:190px" v-for="(item, index) in data_uyquyen" v-bind:key="index">
                <v-list-tile>
                  <v-list-tile-action style="min-width:30px" :class="item.jobPosTitle ? 'pt-2' : ''">
                    <v-checkbox v-model="item.assigned" @change = 'changeDelegacy($event, index)'></v-checkbox>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span style="font-size: 13px" class="black--text">{{item.userName}}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="item.jobPosTitle">
                      <span style="font-size: 13px;color: #0000008a">{{item.jobPosTitle}}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex> -->
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
          </div>
          <span v-if="type === 6 || type === 7 || type === 8 || type === 9">Chọn bộ phận thực hiện</span>
          <span v-else>Chọn người thực hiện</span>
        </div>
        <v-card >
          <div v-if="type === 1 || type === 3 || type === 5" class="px-4 py-1">
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

              <!-- <v-flex style="max-width:190px" v-for="(item, index) in data_phancong" v-bind:key="index">
                <v-list-tile>
                  <v-list-tile-action style="min-width:30px" :class="item.jobPosTitle ? 'pt-2' : ''">
                    <v-checkbox v-model="item.assigned" @change = 'changeAssigned($event, index)'></v-checkbox>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span style="font-size: 13px" class="black--text">{{item.userName}}</span>
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="item.jobPosTitle">
                      <span style="font-size: 13px;color: #0000008a">{{item.jobPosTitle}}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex> -->
            </v-layout>
            <!-- <span class="ml-3" v-if="!assignValidate" style="color:#f44336">* Yêu cầu chọn người để thực hiện</span> -->
          </div>
          <!--  -->
          <v-card-text v-if="type === 6 || type === 7 || type === 8 || type === 9" class="px-4 py-1">
            <v-layout wrap class="my-1" v-if="reRender">
              <div class="ml-3" v-for="(item, index) in data_rolegroup" v-bind:key="item.roleId">
                <v-layout wrap>
                  <v-tooltip top>
                    <v-checkbox 
                      slot="activator"
                      v-model="item.assigned"
                      :label="item.roleName"
                      @change = 'checkAssignedRoleGroup($event, index)'
                      style="min-width:150px"
                    ></v-checkbox>
                    <span class="pl-0"> {{item.roleName}} </span>
                  </v-tooltip>
                  
                </v-layout>
              </div>
            </v-layout>
            <!-- <span class="ml-3" v-if="!assignValidate" style="color:#f44336">* Yêu cầu chọn người để thực hiện</span> -->
          </v-card-text>
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
    data_rolegroup: {
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
  watch: {
    // data_rolegroup: {
    //   handler: function (value) {
    //     let vm = this
    //     console.log('valWatch123', value)
    //     vm.data_rolegroup = value
    //   },
    //   deep: true
    // },
  },
  data: () => ({
    reRender: true,
    toUsersExport: [],
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
    let vm = this
    console.log('userRoles', vm.$store.getters.getUser.role)
    vm.data_phancong = vm.assign_items
    if (vm.type === 8 || vm.type === 9) {
      vm.data_rolegroup = vm.data_rolegroup.filter (function (item) {
        return !vm.checkUserRole(item.roleCode)
      })
    }
    console.log('this.data_rolegroup', vm.data_rolegroup)
  },
  methods: {
    changeAssigned (event, index) {
      let vm = this
      if (vm.type !== 0) {
        if (event === true) {
          if (vm.type === 5) {
            for (let key in vm.assign_items) {
              vm.assign_items[key].assigned = 0
            }
            vm.assign_items[index].assigned = 1
          } else {
            vm.assign_items[index].assigned = 1
          }
        } else {
          vm.assign_items[index].assigned = 0
        }
      }
      console.log('assign_itemsChange', vm.assign_items)
    },
    checkAssignedRoleGroup (event, index) {
      let vm = this
      if (vm.type !== 0) {
        if (event === true) {
          if (vm.type === 7 || vm.type === 9) {
            for (let key in vm.data_rolegroup) {
              vm.data_rolegroup[key].assigned = 0
            }
            vm.data_rolegroup[index].assigned = 1
          } else if (vm.type === 6 || vm.type === 8) {
            vm.data_rolegroup[index].assigned = 1
          }
        } else {
          vm.data_rolegroup[index].assigned = 0
        }
      }
      console.log('data_rolegroupChange2222', vm.data_rolegroup)
      let toUsers = []
      for (let key in vm.data_rolegroup) {
        if (vm.data_rolegroup[key].assigned === 1) {
          let usersAssign = vm.data_rolegroup[key].hasOwnProperty('lstUser') && vm.data_rolegroup[key]['lstUser'] ? vm.data_rolegroup[key]['lstUser'] : []
          if (!Array.isArray(usersAssign)) {
            usersAssign = [usersAssign]
          }
          usersAssign = usersAssign.map(item => {
            item = Object.assign(item, {assigned: 1})
            return item
          })
          toUsers = toUsers.concat(usersAssign)
        }
      }
      vm.toUsersExport = toUsers
      console.log('toUsersGroup', vm.toUsersExport)
      vm.reRender = false
      vm.$nextTick(() => {
        vm.reRender = true
      })
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
      let vm = this
      let assign 
      if (vm.type === 6 || vm.type === 7 || vm.type === 8 || vm.type === 9) {
        assign = vm.toUsersExport.filter(function (item) {
          return Number(item.assigned) > 0
        })
      } else {
        assign = vm.assign_items.filter(function (item) {
          return Number(item.assigned) > 0
        })
      }
      if (assign.length === 0) {
        vm.assignValidate = false
        return vm.assignValidate
      } else {
        vm.assignValidate = true
        return vm.assignValidate
      }
    },
    getToUsersExport () {
      let vm = this
      return vm.toUsersExport
    },
    getDataDelegacy () {
      let vm = this
      return vm.data_uyquyen
    },
    checkUserRole (roleItem) {
      let vm = this
      let roles = vm.$store.getters.getUser.role
      if (!roles) {
        return false
      }
      let roleExits = roles.findIndex(item => item === roleItem)
      return (roleExits >= 0)
    },
  }
}
</script>
