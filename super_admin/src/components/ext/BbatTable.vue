<template>
  <div>
    <v-breadcrumbs>
      <v-icon slot="divider">chevron_right</v-icon>

      <v-breadcrumbs-item
        v-for="item in breadCrumbsitems"
        :disabled="item.disabled"
        :key="item.text"
      >
        {{ item.text }}
      </v-breadcrumbs-item>
      <a href="javascript:;" style="
        text-decoration: none;
        font-weight: bold;
      ">{{tableName}}</a>
    </v-breadcrumbs>

    <v-card class="px-2 mx-1 mb-5" style="overflow: hidden;">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon v-on:click.native="addFilterRow">
          <v-icon v-if="!showFilter">highlight</v-icon>
          <v-icon v-else>highlight_off</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{nameScreen}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon v-on:click.native="rePullData">
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="toEditor(0)">
          <v-icon>add_circle</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout row wrap style="
        position: fixed;
        bottom: 0;
        width: -webkit-calc( 100% - 300px );
        width: calc( 100% - 300px );
        background: white;
        z-index: 2;
        border-top: 1px solid #dcdcdc;
    ">
        <v-progress-linear v-if="showLoadingTable" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
        <v-flex xs12>
          <tiny-pagination :total="pageTotalCounter" :page="page" @tiny:change-page="paggingData" custom-class="custom-tiny-class"></tiny-pagination> 
        </v-flex>
      </v-layout>
      <div style="overflow: hidden;overflow-x: scroll;border-left: 1px solid gainsboro;">
        <div id="table_filter" v-show="showFilter"></div>
        <div id="table_database"></div>
      </div>
    </v-card>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
      content-class="box_shadow_custom"
    >
      <v-list>
        <v-list-tile v-on:click.native="toEditor(-1)">
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Sửa</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click.native="deleteRecord()">
          <v-list-tile-action>
            <v-icon color="red darken-3">clear</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Xoá</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import TinyPagination from './TinyPagination.vue'

  export default {
    props: ['tableName'],
    components: {
      TinyPagination
    },
    data () {
      return {
        showLoadingTable: true,
        nameScreen: '',
        showFilter: false,
        breadCrumbsitems: [
          {
            text: 'Bảng dữ liệu',
            disabled: false
          },
          {
            text: '',
            disabled: false
          }
        ],
        showMenu: false,
        x: 0,
        y: 0,
        items: [
        ],
        tableData: [],
        tableConfig: {},
        dataSocket: {},
        currentIndex: -1,
        filterData: {},
        columnsDataFilter: [],
        page: 1,
        pageTotalCounter: 0
      }
    },
    watch: {
      dataSocket: {
        handler: function (value) {
          if (value['tableConfig'] !== null && value['tableConfig'] !== undefined && value['tableData'] !== null && value['tableData'] !== undefined) {
            this.generateTable()
          }
        },
        deep: true
      },
      '$route': function (newRoute, oldRoute) {
        console.debug(oldRoute)
        let vm = this
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('page')) {
          vm.page = parseInt(currentQuery.page)
        } else {
          vm.page = 1
        }
        vm.showLoadingTable = true
        vm.getData()
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        let query = vm.$router.history.current.query
        if (query.hasOwnProperty('page') && query['page'] !== '1') {
          vm.page = parseInt(query['page'])
        } else {
          vm.page = 1
        }
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
          if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['tableData'] !== null && vm.dataSocket['tableData'] !== undefined) {
            vm.nameScreen = eval('( ' +vm.dataSocket['tableConfig']+ ' )')[dataObj.title]
            vm.generateTable()
          }
          if (vm.dataSocket['pageTotalCounter'] !== null && vm.dataSocket['pageTotalCounter'] !== undefined) {
            vm.pageTotalCounter = parseInt(vm.dataSocket['pageTotalCounter'])
            vm.showLoadingTable = false
          }
          if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get') {
            let currentPath = vm.$router.history.current.path
            vm.$router.push({
              path: currentPath.substring(0, currentPath.indexOf('/editor/')),
              query: {
                renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
              }
            })
          }
        }
        setTimeout(() => {
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd: 'get',
              config: true,
              code: vm.$router.history.current.params.tableName,
              respone: 'tableConfig'
            }
          )
          vm.getData()
        }, 10)
      })
    },
    methods: {
      rePullData () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['renew'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
        vm.$router.push({
          path: current.path + queryString
        })
      },
      paggingData (config) {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let queryString = '?'
        newQuery['page'] = ''
        for (let key in newQuery) {
          if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
            queryString += key + '=' + newQuery[key] + '&'
          }
        }
        queryString += 'page=' + config.page
        vm.$router.push({
          path: current.path + queryString
        })
      },
      getData () {
        let vm = this
        for (var key in vm.filterData) {
          vm.columnsDataFilter[key]['value_filter'] = vm.filterData[key]
        }
        vm.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'get',
            code: vm.$router.history.current.params.tableName,
            respone: 'tableData',
            filter: vm.columnsDataFilter,
            start: vm.page * 15 - 15,
            end: vm.page * 15
          }
        )
        vm.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'get',
            counter: true,
            code: vm.$router.history.current.params.tableName,
            respone: 'pageTotalCounter',
            filter: vm.columnsDataFilter
          }
        )
      },
      show (e) {
        e.preventDefault()
        this.showMenu = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.showMenu = true
        })
      },
      addFilterRow () {
        let vm = this
        vm.showFilter = !vm.showFilter
        if (vm.showFilter) {
          let dataFilter = [
          ]
          let objectConfig = eval('( ' + vm.dataSocket['tableConfig'] + ' )');
          let columns = eval('( ' + objectConfig.columns + ' )')
          let colWidths = []
          for (let key in columns) {
            if (columns[key]['type'] === 'checkbox') {
              dataFilter.push(false)
            } else {
              dataFilter.push('')
            }
            colWidths.push(columns[key]['width'])
          }
          window.$('#table_filter').jexcel({
            data: [dataFilter],
            colHeaders: objectConfig.headersName,
            colWidths: colWidths,
            colAlignments: [ 'left', 'left', 'left', 'left' ],
            allowInsertRow:false,
            allowManualInsertRow:false,
            allowInsertColumn:false,
            allowManualInsertColumn:false,
            allowDeleteRow:false,
            allowDeleteColumn:false,
            contextMenu:function() { 
              vm.show(window.event); 
            },
            onchange: function (instance, cell, value) {
              let cellIndex = cell[0].cellIndex - 1
              console.log(vm.filterData)
              vm.filterData[cellIndex] = value
              let currentPath = vm.$router.history.current.path
              vm.$router.push({
                path: currentPath.substring(0, currentPath.indexOf('/editor/')),
                query: {
                  renew: Math.floor(Math.random() * (100 - 1 + 1)) + 1
                }
              })
            },
            onsort: function (e) {
              window.$('#table_database').jexcel('orderBy', window.$(e).next().val())
            },
            columns: columns
          })
        } else {
          window.$('#table_filter').jexcel('destroy');
        }
      },
      generateTable () {
        let vm = this
        let objectConfig = eval('( ' + vm.dataSocket['tableConfig'] + ' )');
        let columns = eval('( ' + objectConfig.columns + ' )')
        let colWidths = []
        for (let key in columns) {
          colWidths.push(columns[key]['width'])
        }
        vm.columnsDataFilter = columns
        window.$('#table_database').jexcel({
          data: eval('( ' + vm.dataSocket['tableData'] + ' )'),
          colHeaders: objectConfig.headersName,
          colWidths: colWidths,
          colAlignments: [ 'left', 'left', 'left', 'left' ],
          onselection: function(instance, firstColumn) {
            var cellName1 = window.$(instance).jexcel('getColumnNameFromId', window.$(firstColumn).prop('id'));
            vm.currentIndex = cellName1.substring(1) - 1
          },
          contextMenu:function() { 
            vm.show(window.event); 
          },
          onsort: function (e) {
            window.$('#table_database').jexcel('orderBy', window.$(e).next().val())
          },
          columns: columns
        })
      },
      toEditor (id) {
        let vm = this
        let idEditor = 0
        if (id === -1) {
          let tempTableData = eval('( ' + vm.dataSocket['tableData'] + ' )')
          idEditor = tempTableData[vm.currentIndex][0]
        } else {
          idEditor = id
        }
        vm.$router.push({
          path: '/table/' + vm.tableName + '/editor/' + idEditor
        })
      },
      deleteRecord () {
        let vm = this
        var result = confirm('Bạn có muốn xoá bản ghi này?');
        if (result) {
          let idEditor = 0
          let tempTableData = eval('( ' + vm.dataSocket['tableData'] + ' )')
          idEditor = tempTableData[vm.currentIndex][0]
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd:  'delete',
              respone: 'detail',
              id: idEditor,
              code: vm.$router.history.current.params.tableName
            }
          )
        }
      },
      start() {
        let vm = this
        vm.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'add',
            code: vm.$router.history.current.params.tableName,
            bundle_name: 'backend.admin.config.service',
            model_name: 'org.opencps.adminconfig.model.AdminConfig',
            service_util_name: 'org.opencps.adminconfig.service.AdminConfigLocalServiceUtil',
            data: {
              id: 102,
              code: "abc",
              name: "Danh sách màn hình quản trị",
              bundleName: "backend.admin.config.service",
              modelName: "org.opencps.adminconfig.model.AdminConfig",
              serviceUtilName: "org.opencps.adminconfig.service.AdminConfigLocalServiceUtil",
              headersName: `["id","Mã code","Tên","Tên gói backend"]`,
              columns: `[
                {
                  "column": "id",
                  "type": "number",
                  "width": "0",
                  "readOnly": true
                },
                {
                  "column": "code",
                  "type": "text",
                  "width": "30%"
                },
                {
                  "column": "name",
                  "type": "text",
                  "width": "30%"
                },
                {
                  "column": "bundleName",
                  "type": "text",
                  "width": "40%"
                }
              ]`
            }
          }
        )
      }
    }
  }
</script>
