<template>
  <div>
    <div class="row-header" style="margin-top: 6px;">
      <div class="background-triangle-big"> <span v-if="trangThaiHoSoList">{{trangThaiHoSoList[index].title}}</span> </div> 
      <div class="layout row wrap header_tools row-blue">
        <span v-if="trangThaiHoSoList" class="pl-2">{{trangThaiHoSoList[index].desc}}</span>
      </div>
    </div>
    <content-placeholders v-if="loadingTable">
      <content-placeholders-img />
      <content-placeholders-heading />
    </content-placeholders>
    <div id="hot-preview" v-else>
      <HotTable :root="root" :settings="hotSettings"
      ></HotTable>
    </div>
    <content-placeholders class="mt-3" v-if="loadingTable">
      <content-placeholders-text :lines="1" />
    </content-placeholders>
    <div v-else class="row-header">
      <div class="layout row wrap header_tools row-blue">
        <v-icon size="18" style="min-width: 51px;">settings_input_composite</v-icon>
        <v-btn icon class="mx-0 my-0" v-on:click.native="addRow">
          <v-icon color="primary" size="18">add_box</v-icon>
        </v-btn>
        <v-btn :disabled="rowIndexSelected === -1" icon class="mx-0 my-0">
          <v-icon color="primary" size="18">library_add</v-icon>
        </v-btn>
        <v-btn :disabled="rowIndexSelected === -1" icon class="mx-0 my-0" 
          :loading="loadingBTN"
          v-on:click.native="removeRow">
          <v-icon color="red darken-3" size="18">clear</v-icon>
        </v-btn>
        <v-btn :disabled="rowIndexSelected === -1" icon class="mx-0 my-0">
          <v-icon color="primary" size="18">edit</v-icon>
        </v-btn>
        <div class="flex text-right" style="margin-left: auto;">
          <v-btn flat class="mx-0 my-0">
            Tổng số <span class="pagging_counter"> {{hotSettings.data["length"]}} </span> bản ghi
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HotTable from '@handsontable-pro/vue'
import { eventBus } from '../event-bus/eventBus.js'
import moment from 'moment'
import router from '@/router'
let dataObject = []
export default {
  props: ['index'],
  data: () => ({
    selectedOBJBefore: null,
    selectedOBJ: null,
    selectedOBJAfter: null,
    rowIndexSelected: -1,
    isCallBack: true,
    loadingTable: true,
    loadingBTN: false,
    root: 'test-hot',
    hotSettings: {
      data: dataObject,
      columns: [],
      stretchH: 'all',
      autoWrapRow: true,
      dropdownMenu: true,
      rowHeaders: true,
      contextMenu: true,
      colHeaders: [],
      filters: true,
      beforeRemoveRow: function (index, amount, visualRows) {
        let currentParams = router.history.current.params
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x) {
          router.push({
            path: '/danh-sach-ho-so/' + currentParams.index,
            query: {
              row: index,
              action: 'remove'
            }
          })
        } else {
          return false
        }
      },
      afterSelection: function (r, c, r2, c2, preventScrolling, selectionLayerLevel) {
        let currentParams = router.history.current.params
        let currentQuery = router.history.current.query
        eventBus.$emit('selectedOBJBefore', dataObject[r])
        if (!currentQuery.hasOwnProperty('row') || String(currentQuery['row']) !== String(r)) {
          router.push({
            path: '/danh-sach-ho-so/' + currentParams.index,
            query: {
              row: r
            }
          })
        }
      },
      afterChange: function (changes, source) {
        let currentParams = router.history.current.params
        let currentQuery = router.history.current.query
        if (currentQuery.hasOwnProperty('row')) {
          eventBus.$emit('selectedOBJ', dataObject[currentQuery.row])
          router.push({
            path: '/danh-sach-ho-so/' + currentParams.index,
            query: {
              row: currentQuery.row,
              action: source,
              timestamps: moment().toDate().getMilliseconds()
            }
          })
        }
      }
    }
  }),
  components: {
    HotTable
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let currentQuery = router.history.current.query
      if (currentQuery.hasOwnProperty('row')) {
        vm.rowIndexSelected = currentQuery.row
      } else {
        vm.rowIndexSelected = -1
      }
      vm.initRenderTable()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let currentQuery = router.history.current.query
      if (currentQuery.hasOwnProperty('row')) {
        vm.rowIndexSelected = currentQuery.row
        eventBus.$on('selectedOBJBefore', (data) => {
          vm.selectedOBJBefore = data
        })
      } else {
        vm.rowIndexSelected = -1
        vm.initRenderTable()
      }
      if (!currentQuery.hasOwnProperty('action')) {
        vm.selectedOBJAfter = null
      }
      if (currentQuery.hasOwnProperty('action') && vm.isCallBack) {
        this.isCallBack = false
        eventBus.$on('selectedOBJ', (data) => {
          vm.selectedOBJ = data
        })
        setTimeout(() => {
          vm.editFUNC()
        }, 200)
      }
    }
  },
  computed: {
    trangThaiHoSoList () {
      return this.$store.getters.loadtrangThaiHoSoList
    }
  },
  methods: {
    initRenderTable () {
      let vm = this
      let params = {
        type: vm.trangThaiHoSoList[vm.index].id
      }
      vm.loadingTable = true
      vm.$store.dispatch('loadHandsOnTableData', params).then(function (result) {
        dataObject = result.data
        dataObject.push({
          id: 0
        })
        vm.hotSettings.data = dataObject
        vm.hotSettings.columns = result.columns
        vm.hotSettings.colHeaders = result.colHeaders
        vm.loadingTable = false
      })
    },
    editFUNC () {
      let vm = this
      vm.isCallBack = true
      let currentQuery = router.history.current.query
      if (currentQuery.hasOwnProperty('action') && currentQuery.action === 'remove') {
        vm.selectedOBJBefore['type'] = vm.trangThaiHoSoList[vm.index].id
        vm.$store.dispatch('removeData', vm.selectedOBJBefore).then(function (result) {})
      } else {
        if (vm.selectedOBJAfter !== null && vm.selectedOBJAfter !== undefined && vm.selectedOBJAfter !== 'undefined') {
          vm.selectedOBJ['actionConfigId'] = vm.selectedOBJAfter['actionConfigId']
          vm.selectedOBJ['menuConfigId'] = vm.selectedOBJAfter['menuConfigId']
          vm.selectedOBJ['stepConfigId'] = vm.selectedOBJAfter['stepConfigId']
        }
        if (vm.selectedOBJ !== null && vm.selectedOBJ !== undefined && vm.selectedOBJ !== 'undefined') {
          let type = vm.trangThaiHoSoList[vm.index].id
          vm.selectedOBJ['type'] = type
          if (type === '1' && vm.selectedOBJ.actionConfigId === 0) {
            vm.selectedOBJ['isAdd'] = true
          } else if (type === '1' && vm.selectedOBJ.actionConfigId !== 0) {
            vm.selectedOBJ['isAdd'] = false
          } else if (type === '2' && vm.selectedOBJ.menuConfigId === 0) {
            vm.selectedOBJ['isAdd'] = true
          } else if (type === '2' && vm.selectedOBJ.menuConfigId !== 0) {
            vm.selectedOBJ['isAdd'] = false
          } else if (type === '3' && vm.selectedOBJ.stepConfigId === 0) {
            vm.selectedOBJ['isAdd'] = true
          } else if (type === '3' && vm.selectedOBJ.stepConfigId !== 0) {
            vm.selectedOBJ['isAdd'] = false
          }
          let dataObj = {
            oldObj: vm.selectedOBJBefore,
            newObj: vm.selectedOBJ
          }
          vm.$store.dispatch('addOrEditData', dataObj).then(function (result) {
            vm.selectedOBJAfter = result
          })
        }
      }
    },
    addRow () {
      let vm = this
      let type = vm.trangThaiHoSoList[vm.index].id
      dataObject.splice(-1, 1)
      if (type === '1') {
        dataObject.push({
          actionConfigId: 0
        })
      } else if (type === '2') {
        dataObject.push({
          menuConfigId: 0
        })
      } else if (type === '3') {
        dataObject.push({
          stepConfigId: 0
        })
      }
      dataObject.push({
        id: 0
      })
      vm.selectedOBJAfter = null
      vm.selectedOBJ = null
      router.push({
        path: '/danh-sach-ho-so/' + vm.index,
        query: {
          row: dataObject.length
        }
      })
      vm.hotSettings.data = dataObject
    },
    removeRow () {
      let vm = this
      let currentQuery = router.history.current.query
      if (currentQuery.hasOwnProperty('row')) {
        let x = confirm('Bạn có muốn thực hiện hành động này?')
        if (x) {
          vm.selectedOBJBefore = dataObject[currentQuery.row]
          let type = vm.trangThaiHoSoList[vm.index].id
          vm.selectedOBJBefore['type'] = type
          console.log('vm.selectedOBJBefore: ', vm.selectedOBJBefore)
          vm.loadingBTN = true
          vm.$store.dispatch('removeData', vm.selectedOBJBefore).then(function (result) {
            vm.initRenderTable()
            vm.loadingBTN = false
          })
        } else {
          return false
        }
      }
    }
  }
}
</script>
