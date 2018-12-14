<template>
  <div>
    <v-navigation-drawer v-model="drawer" fixed app width="240">
      <div class="drawer__filter px-2">
        <v-select
          v-model="reportType"
          :items="itemsReports"
          placeholder="Chọn báo cáo"
          item-text="title"
          item-value="document"
          @change="changeReportType($event)"
        ></v-select>
        <v-select
          v-model="groupType"
          :items="itemsGroups"
          placeholder="GroupBy"
          item-text="text"
          item-value="value"
          v-if="reportType !== 'REPORT_01' || reportType.startsWith('REPORT_FIX')"
        ></v-select>
        <v-checkbox v-if="reportType !== 'REPORT_01' && !reportType.startsWith('REPORT_FIX')" v-for="(item, index) in itemsReportsConfig" v-bind:key="index" v-model="selected" :label="item.text" :value="item.value"></v-checkbox>
        <v-btn color="primary" block v-if="userConfig.length > 0" v-on:click.native="resetConfig">Quay lại mặc định</v-btn>
      </div>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-snackbar
      v-model="snackbarerror"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      Yêu cầu thực hiện thất bại
      <v-btn
        icon
        @click="closeError()"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="snackbarsocket"
      :bottom="true"
      :left="false"
      :multi-line="true"
      :right="false"
      :timeout="0"
      :top="true"
      :vertical="false"
      color="red darken-3"
    >
      <v-progress-circular
        :size="20"
        :width="1"
        color="white"
        indeterminate
      ></v-progress-circular>
      &nbsp;
      Mất kết nối, tự động kết nối lại trong giây lát ... 
      
      <v-btn
        icon
        @click="reloadPage()"
      >
        <v-icon>replay</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import support from '../store/support.json'
  export default {
    props: ['index'],
    data: () => ({
      dialog: false,
      drawer: null,
      dataSocket: {},
      support: support,
      itemsReportsConfig: [],
      itemsGroups: [
        {
          value: 'domain',
          text: 'lĩnh vực'
        },
        {
          value: 'gov',
          text: 'đơn vị'
        }
      ],
      userConfig: []
    }),
    computed: {
      itemsReports () {
        return this.$store.getters.itemsReports
      },
      items () {
        return this.$store.getters.getDeliverableTypes
      },
      groupType: {
        // getter
        get: function() {
          return this.$store.getters.groupType
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setgroupType', newValue)
        }
      },
      reportType: {
        // getter
        get: function() {
          return this.$store.getters.reportType
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setreportType', newValue)
        }
      },
      selected: {
        // getter
        get: function() {
          return this.$store.getters.selected
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setselected', newValue)
        }
      },
      snackbarerror: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarerror
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarerror', newValue)
        }
      },
      snackbarsocket: {
        // getter
        get: function() {
          return this.$store.getters.getsnackbarsocket
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setsnackbarsocket', newValue)
        }
      }
    },
    watch: {
      selected (val) {
        let vm = this
        let doData = {
          selected: val,
          itemsReports: vm.itemsReports,
          index: vm.index,
          userId: vm.getUserId()
        }
        // vm.$store.dispatch('updateDynamicReport', doData)
      }
    },
    created () {
    var vm = this
      vm.$nextTick(function () {
        setTimeout(() => {
          vm.itemsReportsConfig = []
          vm.userConfig = []
          if (String(vm.index) !== '0') {
            for (let key in vm.itemsReports) {
              if (vm.itemsReports[key]['code'] === String(vm.index)) {
                vm.reportType = vm.itemsReports[key]['document']
                vm.itemsReportsConfig = vm.itemsReports[key]['filterConfig']['reportConfig']
                if (vm.itemsReports[key]['userConfig'] !== '') {
                  let userConfigObjec = vm.itemsReports[key]['userConfig']
                  if (userConfigObjec.hasOwnProperty(vm.getUserId())) {
                    vm.userConfig = userConfigObjec[vm.getUserId()]
                  }
                }
                break
              }
            }
          } else {
            vm.reportType = vm.itemsReports[0]['document']
            vm.itemsReportsConfig = vm.itemsReports[0]['filterConfig']['reportConfig']
            if (vm.itemsReports[0]['userConfig'] !== '') {
              let userConfigObjec = vm.itemsReports[0]['userConfig']
              if (userConfigObjec.hasOwnProperty(vm.getUserId())) {
                vm.userConfig = userConfigObjec[vm.getUserId()]
              }
            }
          }
          vm.selected = []
          if (vm.userConfig.length > 0) {
            vm.selected = vm.userConfig
          } else {
            for (let keySelected in vm.itemsReportsConfig) {
              if (vm.itemsReportsConfig[keySelected]['selected']) {
                vm.selected.push(vm.itemsReportsConfig[keySelected]['value'])
              }
            }
          }
        }, 200)
      })
    },
    methods: {
      redirectFilter(val) {
        this.$router.push(val + '?state_change=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1)
      },
      closeError() {
        this.$store.commit('setsnackbarerror', false)
      },
      reloadPage() {
        window.location.reload(true)
      },
      deliverableRouter (item) {
        console.log(item)
      },
      resetConfig () {
        let vm = this
        vm.selected = []
        for (let keySelected in vm.itemsReportsConfig) {
          if (vm.itemsReportsConfig[keySelected]['selected']) {
            vm.selected.push(vm.itemsReportsConfig[keySelected]['value'])
          }
        }
      },
      changeReportType (data) {
        let vm = this
        vm.itemsReportsConfig = []
        for (let key in vm.itemsReports) {
          if (vm.itemsReports[key]['document'] === data) {
            vm.itemsReportsConfig = vm.itemsReports[key]['filterConfig']['reportConfig']
            if (vm.itemsReports[key]['userConfig'] !== '') {
              let userConfigObjec = vm.itemsReports[key]['userConfig']
              if (userConfigObjec.hasOwnProperty(vm.getUserId())) {
                vm.userConfig = userConfigObjec[vm.getUserId()]
              }
            }
            vm.selected = []
            if (vm.userConfig.length > 0) {
              vm.selected = vm.userConfig
            } else {
              for (let keySelected in vm.itemsReportsConfig) {
                if (vm.itemsReportsConfig[keySelected]['selected']) {
                  vm.selected.push(vm.itemsReportsConfig[keySelected]['value'])
                }
              }
            }
            vm.$router.push('/bao-cao/' + vm.itemsReports[key]['code'])
            break
          }
        }
      }
    }
  }
</script>