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
        <v-btn dark flat v-on:click.native="backToCode" v-if="depen">
          <v-icon>reply</v-icon> &nbsp;
          {{backTableName}}
        </v-btn>
        <v-btn dark icon v-on:click.native="rePullData">
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="toEditor(0)">
          <v-icon>add_circle</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout v-if="pageTotalCounter > 0" row wrap style="
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
        <div class="table_filter" :id="'table_filter_' + tableName" v-show="showFilter"></div>
        <div :id="'table_database_' + tableName" v-show="!problem"></div>
      </div>
    </v-card>
    <v-card v-show="problem" class="px-2 mx-1 mb-5" style="overflow: hidden;">
      <div id="video-preloader" class="video-preloader">
        <video loop id="editor-video-preloader" width="100%" height="350" muted="true" src="https://editorassets.parastorage.com/video-preloader/editor-video-preloader-2-@2x.mp4"></video>
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
        <v-list-tile v-if="tableName === 'opencps_serviceprocess'" v-on:click.native="toBieuDoQuyTrinh()">
          <v-list-tile-action>
            <v-icon>merge_type</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Biểu đồ quy trình</v-list-tile-title>
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
        backTableName: '',
        depen: false,
        problem: true,
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
      '$route': function (newRoute, oldRoute) {
        console.debug(oldRoute)
        let vm = this
        vm.dataSocket = {}
        vm.problem = true
        let currentQuery = newRoute.query
        if (currentQuery.hasOwnProperty('state_change') && String(currentQuery['state_change']) !== '0') {
          vm.showFilter = false
        }
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
        let videoElement = document.getElementById('editor-video-preloader')
        if (videoElement !== null && videoElement !== undefined) {
          videoElement.play()
        }
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          if (dataObj['status'] === '200') {
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['tableData'] !== null && vm.dataSocket['tableData'] !== undefined && (dataObj.respone === 'tableData' || dataObj.respone === 'tableConfig')) {
              vm.nameScreen = vm.dataSocket['tableConfig']['name']
              vm.backTableName = vm.dataSocket['tableConfig']['dependency_title']
              if (vm.dataSocket['tableConfig'].hasOwnProperty('dependency_title')) {
                vm.depen = true
              } else {
                vm.depen = false
              }
              vm.generateTable()
            }
            if (dataObj.respone === 'pageTotalCounter') {
              vm.pageTotalCounter = parseInt(vm.dataSocket['pageTotalCounter'])
              vm.showLoadingTable = false
            } else if (dataObj.respone === 'loginUser') {
              vm.$store.commit('setloginUser', dataObj['loginUser'])
            } else if (dataObj.respone === 'listTableMenu') {
              vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
            }
            if (dataObj['cmd'] !== 'get') {
              let current = vm.$router.history.current
              let newQuery = current.query
              let queryString = '?'
              newQuery['state_change'] = '0'
              newQuery['renew'] = ''
              for (let key in newQuery) {
                if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
                  queryString += key + '=' + newQuery[key] + '&'
                }
              }
              queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
              vm.$router.push({
                path: current.path.substring(0, current.path.indexOf('/editor/')) + queryString
              })
            }
          }
        }
        setTimeout(() => {
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
        newQuery['state_change'] = '0'
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
        newQuery['state_change'] = '0'
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
        if (!vm.showFilter) {
          vm.columnsDataFilter = []
        } else {
          for (var key in vm.filterData) {
            vm.columnsDataFilter[key]['value_filter'] = vm.filterData[key]
            delete vm.columnsDataFilter[key]['source']
            delete vm.columnsDataFilter[key]['options']
          }
        }
        let query = vm.$router.history.current.query
        if (query.hasOwnProperty('pk')) {
          vm.columnsDataFilter.push({
            key: query['col'],
            value_filter: query['pk'],
            compare: "=",
            type: isNaN(query['pk']) ? 'text' : 'number'
          })
        }
        vm.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'get',
            config: true,
            code: vm.$router.history.current.params.tableName,
            respone: 'tableConfig'
          }
        )
        vm.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'get',
            code: vm.$router.history.current.params.tableName,
            respone: 'tableData',
            filter: vm.columnsDataFilter,
            start: vm.page * 10 - 10,
            end: vm.page * 10
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
        vm.problem = true
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
          let objectConfig = vm.dataSocket['tableConfig']
          let columns = eval('( ' + objectConfig.columns + ' )')
          let colWidths = []
          let colAlignments = []
          for (let key in columns) {
            if (columns[key]['type'] === 'checkbox') {
              dataFilter.push(false)
            } else {
              dataFilter.push('')
            }
            colWidths.push(columns[key]['width'])
            colAlignments.push(columns[key]['colAlignments'])
          }
          window.$('#table_filter_' + vm.tableName).jexcel({
            data: [dataFilter],
            colHeaders: objectConfig.headersName,
            colWidths: colWidths,
            colAlignments: colAlignments,
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
              vm.filterData[cellIndex] = value
              let current = vm.$router.history.current
              let newQuery = current.query
              let queryString = '?'
              newQuery['page'] = 1
              newQuery['state_change'] = '0'
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
            columns: columns
          })
        } else {
          window.$('#table_filter_' + vm.tableName).jexcel('destroy');
        }
      },
      generateTable () {
        let vm = this
        let objectConfig = vm.dataSocket['tableConfig']
        let columns = eval('( ' + objectConfig.columns + ' )')
        let colWidths = []
        let colAlignments = []
        for (let key in columns) {
          colWidths.push(columns[key]['width'])
          colAlignments.push(columns[key]['colAlignments'])
        }
        vm.columnsDataFilter = columns
        window.$('#table_database_' + vm.tableName).jexcel({
          data: vm.dataSocket['tableData'],
          colHeaders: objectConfig.headersName,
          colWidths: colWidths,
          colAlignments: colAlignments,
          updateSelection: function () {
            return false
          },
          onselection: function(instance, firstColumn) {
            var cellName1 = window.$(instance).jexcel('getColumnNameFromId', window.$(firstColumn).prop('id'));
            vm.currentIndex = cellName1.substring(1) - 1
          },
          contextMenu:function() { 
            vm.show(window.event); 
          },
          onsort: function (e) {
            window.$('#table_database_' + vm.tableName).jexcel('orderBy', window.$(e).next().val())
          },
          columns: columns
        })
        vm.problem = false
      },
      toEditor (id) {
        let vm = this
        let idEditor = 0
        if (id === -1) {
          let tempTableData = vm.dataSocket['tableData']
          idEditor = tempTableData[vm.currentIndex][0]
        } else {
          idEditor = id
        }
        let current = vm.$router.history.current
        let newQuery = current.query
        if (vm.dataSocket['tableConfig']['extForm']) {
          vm.$router.push({
            path: '/table/' + vm.tableName + '/ext/editor/' + idEditor,
            query: newQuery
          })
        } else {
          vm.$router.push({
            path: '/table/' + vm.tableName + '/editor/' + idEditor,
            query: newQuery
          })
        }
      },
      backToCode () {
        let vm = this
        let query = vm.$router.history.current.query
        vm.$router.push({
          path: vm.dataSocket['tableConfig']['dependency_link'] + '/' + query['pk']
        })
      },
      deleteRecord () {
        let vm = this
        var result = confirm('Bạn có muốn xoá bản ghi này?');
        if (result) {
          let idEditor = 0
          let tempTableData = vm.dataSocket['tableData']
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
      toBieuDoQuyTrinh() {
        let vm = this
        let idEditor = 0
        let tempTableData = vm.dataSocket['tableData']
        idEditor = tempTableData[vm.currentIndex][0]
        let current = vm.$router.history.current
        let newQuery = current.query
        vm.$router.push({
          path: '/table/' + vm.tableName + '/flowchart/' + idEditor,
          query: newQuery
        })
      }
    }
  }
</script>
