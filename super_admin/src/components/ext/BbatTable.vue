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
        <v-btn dark flat v-if="tableName === 'opencps_applicant'" @click="filterApplicantType('citizen')" v-bind:style="{ background: applicantType === 'citizen' ? '#f1eeee6e': 'none'}">
          Tài khoản cá nhân
        </v-btn>
        <v-btn dark flat v-if="tableName === 'opencps_applicant'" @click="filterApplicantType('business')" v-bind:style="{ background: applicantType === 'business' ? '#f1eeee6e': 'none'}">
          Tài khoản tổ chức
        </v-btn>
        <v-btn dark flat v-if="exportExcel" :loading="exportLoading" :disabled="exportLoading"
         @click="exportTableData()">
          <v-icon right dark>cloud_download</v-icon> &nbsp; Xuất file Excel 
        </v-btn>
        <v-btn dark flat v-if="showWorkingunits" @click="getWorkingunits()">
          Cấu trúc phòng ban
        </v-btn>
        <v-btn dark flat v-if="downloadFileTemplate" @click="downloadFile(downloadFileTemplate)">
          Tải tệp mẫu
        </v-btn>
        <v-btn dark icon v-on:click.native="rePullData">
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="toEditor(0)">
          <v-icon>add_circle</v-icon>
        </v-btn>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
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
        <v-list-tile v-if="tableName !== 'opencps_services_filetemplates'" v-on:click.native="toEditor(-1)">
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
        <v-list-tile v-if="tableName === 'opencps_serviceprocess'" v-on:click.native="cloneServiceProcess">
          <v-list-tile-action>
            <v-icon>copyright</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Sao chép quy trình</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="showCopy" v-on:click.native="copyRecord(-1)">
          <v-list-tile-action>
            <v-icon color="red darken-3">content_copy</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Copy</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="tableName === 'opencps_services_filetemplates'" v-on:click.native="toEditor(-1)">
          <v-list-tile-action>
            <v-icon color="red darken-3">visibility</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Xem</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="tableName !== 'opencps_services_filetemplates'" v-on:click.native="deleteRecord()">
          <v-list-tile-action>
            <v-icon color="red darken-3">clear</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Xoá</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog
        v-model="dialog"
        max-width="800px"
        persistent
    >    
        <v-card>
            <div style="width: 100%;height: 45px; background-color: #115ebe; display: flex;justify-content: space-between; align-items: center;">
              <span class="mx-2" style="font-size: 20px; font-weight: bold;color: #fff;">Cấu trúc phòng ban</span>
              <v-btn color="#115ebe" fab small dark  @click="dialog = false">
                  <v-icon>cancel</v-icon>
              </v-btn>
            </div>
            <v-card-text class="form_vuejs" style="min-height: 150px;">
              <v-list>
                <v-list-group
                  v-for="item in itemTree"
                  :key="item.workingUnitId"
                  :value="true"
                  prepend-icon="account_balance"
                  no-action
                >
                  <template slot="activator">
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>

                  <v-list-tile
                    v-for="subItem in item.children"
                    :key="subItem.workingUnitId"
                    style="padding-left: 42px !important"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-icon>label_important</v-icon>&nbsp; {{ subItem.name }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
              </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import TinyPagination from './TinyPagination.vue'
  import axios from 'axios'
  import saveAs from 'file-saver'

  export default {
    props: ['tableName'],
    components: {
      TinyPagination
    },
    data () {
      return {
        order: 1,
        applicantType: '',
        backTableName: '',
        depen: false,
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
        tableData: [],
        tableConfig: {},
        dataSocket: {},
        currentIndex: -1,
        filterData: {},
        columnsDataFilter: [],
        page: 1,
        pageTotalCounter: 0,
        showCopy: false,
        tableConfigExport: '',
        exportExcel: false,
        showWorkingunits: false,
        dialog: false,
        tree: [],
        itemTree: [],
        exportLoading: false,
        dataTest:  [
          {
            "workingUnitId": 301,
            "createDate": "2020-08-08T09:52:23.000Z",
            "modifiedDate": "2020-08-10T10:12:01.000Z",
            "name": "Phòng 1.0",
            "enName": "Phòng 1.0",
            "govAgencyCode": "CUC_CHINH_SACH",
            "parentWorkingUnitId": 0,
            "sibling": 1,
            "address": "",
            "telNo": "",
            "faxNo": "",
            "email": "abc@gmail.com",
            "website": "",
            "treeIndex": "0001",
            "level": 0
          },
          {
            "workingUnitId": 401,
            "createDate": "2020-08-10T10:10:55.000Z",
            "modifiedDate": "2020-08-10T10:12:18.000Z",
            "name": "Phòng 1.1",
            "enName": "Phòng 1.1",
            "govAgencyCode": "CUC_CHINH_SACH",
            "parentWorkingUnitId": 301,
            "sibling": 1,
            "address": "",
            "telNo": "",
            "faxNo": "",
            "email": "abc@gmail.com",
            "website": "",
            "treeIndex": "0001.0001",
            "level": 1
          },
          {
            "workingUnitId": 402,
            "createDate": "2020-08-10T10:12:49.000Z",
            "modifiedDate": "2020-08-10T10:12:49.000Z",
            "name": "Phòng 2.0",
            "enName": "Phòng 2.0",
            "govAgencyCode": "CUC_CHINH_SACH",
            "parentWorkingUnitId": 0,
            "sibling": 2,
            "address": "",
            "telNo": "",
            "faxNo": "",
            "email": "abc@gmail.com",
            "website": "",
            "treeIndex": "0002",
            "level": 0
          }
        ],
        open: [],
        items: [
          {
            id: 1,
            name: 'Applications :',
            children: [
              { id: 2, name: 'Calendar : app' },
              { id: 3, name: 'Chrome : app' },
              { id: 4, name: 'Webstorm : app' }
            ]
          },
          {
            id: 5,
            name: 'Documents :',
            children: [
              {
                id: 6,
                name: 'vuetify :',
                children: [
                  {
                    id: 7,
                    name: 'src :',
                    children: [
                      { id: 8, name: 'index : ts' },
                      { id: 9, name: 'bootstrap : ts' }
                    ]
                  }
                ]
              },
              {
                id: 10,
                name: 'material2 :',
                children: [
                  {
                    id: 11,
                    name: 'src :',
                    children: [
                      { id: 12, name: 'v-btn : ts' },
                      { id: 13, name: 'v-card : ts' },
                      { id: 14, name: 'v-window : ts' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 15,
            name: 'Downloads :',
            children: [
              { id: 16, name: 'October : pdf' },
              { id: 17, name: 'November : pdf' },
              { id: 18, name: 'Tutorial : html' }
            ]
          },
          {
            id: 19,
            name: 'Videos :',
            children: [
              {
                id: 20,
                name: 'Tutorials :',
                children: [
                  { id: 21, name: 'Basic layouts : mp4' },
                  { id: 22, name: 'Advanced techniques : mp4' },
                  { id: 23, name: 'All about app : dir' }
                ]
              },
              { id: 24, name: 'Intro : mov' },
              { id: 25, name: 'Conference introduction : avi' }
            ]
          }
        ],
        downloadFileTemplate: ''
      }
    },
    computed: {
      problem: {
        // getter
        get: function() {
          return this.$store.getters.getproblem
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setproblem', newValue)
        }
      },
      isConnected: {
        // getter
        get: function() {
          return this.$store.getters.getisConnected
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setisConnected', newValue)
        }
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        console.debug(oldRoute)
        let vm = this
        vm.dataSocket = {}
        console.log('vm.problem', vm.problem)
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
        if (vm.isConnected) {
          vm.isConnected = false
        }
        setTimeout(() => {
          vm.getData()
        }, 10)
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
        vm.showCopy = false
        vm.exportExcel = false
        vm.showWorkingunits = false
        vm.downloadFileTemplate =  ''
        if (!vm.showFilter && vm.applicantType === '') {
          vm.columnsDataFilter = []
        } else {
          for (var key in vm.filterData) {
            vm.columnsDataFilter[key]['value_filter'] = vm.filterData[key].trim()
            delete vm.columnsDataFilter[key]['source']
            delete vm.columnsDataFilter[key]['options']
          }
        }
        let query = vm.$router.history.current.query
        if (query.hasOwnProperty('pk')) {
          let pk_type = 'number'
          if (query.hasOwnProperty('pk_type')) {
            pk_type = query['pk_type']
          }
          vm.columnsDataFilter.push({
            key: query['col'],
            value_filter: query['pk'].trim(),
            compare: "=",
            type: pk_type
          })
        }
        let dataPost = new URLSearchParams()
        //dataPost.append('delegacy', filter.delegacy)
        let textPost = {
          'type': 'admin',
          'cmd': 'get',
          'config': 'true',
          'code': vm.$router.history.current.params.tableName,
          'respone': 'tableConfig'
        }
        dataPost.append('text', JSON.stringify(textPost))
        axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
          let dataObj = response.data
          vm.tableConfigExport = dataObj
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && dataObj.respone === 'tableConfig') {              
              vm.nameScreen = vm.dataSocket['tableConfig']['name']
              vm.backTableName = vm.dataSocket['tableConfig']['dependency_title']
              if(vm.dataSocket['tableConfig']['detailColumns']){
                try{
                  let detailColumns = JSON.parse(vm.dataSocket['tableConfig']['detailColumns'])
                  console.log(detailColumns)
                  for(let i=0; i<detailColumns.length; i++){
                    if(detailColumns[i]['showCopy']){
                      vm.showCopy = true
                    }
                    if(detailColumns[i]['exportExcel']){
                      vm.exportExcel = true
                    }
                    if(detailColumns[i]['showWorkingunits']){
                      vm.showWorkingunits = true
                    }
                    if(detailColumns[i]['downloadFileTemplate']){
                      vm.downloadFileTemplate = detailColumns[i]['downloadFileTemplate']
                    }
                  }
                } catch (err) {

                }
              }
              if (vm.dataSocket['tableConfig'].hasOwnProperty('dependency_title')) {
                vm.depen = true
              } else {
                vm.depen = false
              }
              if(vm.tableName === 'opencps_applicant'){
                textPost = {
                  'type': 'admin',
                  'cmd': 'get',
                  'code': vm.$router.history.current.params.tableName,
                  'respone': 'tableData',
                  'filter': vm.columnsDataFilter,
                  'sort': vm.order ? 'activationCode_desc' : 'activationCode_asc',
                  'start': vm.page * 10 - 10,
                  'end': vm.page * 10
                }
              } else {
                textPost = {
                  'type': 'admin',
                  'cmd': 'get',
                  'code': vm.$router.history.current.params.tableName,
                  'respone': 'tableData',
                  'filter': vm.columnsDataFilter,
                  'start': vm.page * 10 - 10,
                  'end': vm.page * 10
                }               
              }

              dataPost = new URLSearchParams();
              dataPost.append('text', JSON.stringify(textPost))
              axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
                let dataObj = response.data
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
                    vm.showLoadingTable = false
                  }
              }).catch(function (error) {
              })
              textPost = {
                'type': 'admin',
                'cmd': 'get',
                'counter': 'true',
                'code': vm.$router.history.current.params.tableName,
                'respone': 'pageTotalCounter',
                'filter': vm.columnsDataFilter
              }
              dataPost = new URLSearchParams();
              dataPost.append('text', JSON.stringify(textPost))
              axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
                let dataObj = response.data
                vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
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
              }).catch(function (error) {
              })
            }
        }).catch(function (error) {
        })
        
        vm.problem = true
      },
      show (e) {
        if (e !== undefined && e !== null) {
          e.preventDefault()
          this.showMenu = false
          this.x = e.clientX
          this.y = e.clientY
          this.$nextTick(() => {
            this.showMenu = true
          })
        } else {
          this.showMenu = false
          this.$nextTick(() => {
            this.showMenu = true
          })
        }
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
          onsort: function (instance, cellNum, order) {
            let colName = columns[cellNum]['column']
            vm.order = order
            vm.page = 1
            vm.setDataJexcel(colName)
          },
          closeEditor : function(cell, save) {
            let value = cell.children[0].value
            cell.innerHTML = value
            console.log('value cell', value)
            return value
          },
          columns: columns
        })
        vm.problem = false
      },
      setDataJexcel (colName) {
        let vm = this
        let textPost = {}
        let orderBy = vm.order ? '_desc' : '_asc' 
        textPost = {
          'type': 'admin',
          'cmd': 'get',
          'code': vm.$router.history.current.params.tableName,
          'respone': 'tableData',
          'filter': vm.columnsDataFilter,
          'sort': colName + orderBy,
          'start': vm.page * 10 - 10,
          'end': vm.page * 10
        }

        let dataPost = new URLSearchParams();
        dataPost.append('text', JSON.stringify(textPost))
        axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
          let dataObj = response.data
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['tableData'] !== null && vm.dataSocket['tableData'] !== undefined && (dataObj.respone === 'tableData' || dataObj.respone === 'tableConfig')) {
              window.$('#table_database_' + vm.tableName).jexcel('setData', vm.dataSocket['tableData'], false);
            }
        }).catch(function (error) {
        })

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
      copyRecord (id) {
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
        newQuery['idCopy'] = idEditor
        if (vm.dataSocket['tableConfig']['extForm']) {
          vm.$router.push({
            path: '/table/' + vm.tableName + '/ext/editor/' + 0,
            query: newQuery
          })
        } else {
          vm.$router.push({
            path: '/table/' + vm.tableName + '/editor/' + 0,
            query: newQuery
          })
        }
      },
      deleteRecord () {
        let vm = this
        var result = confirm('Bạn có muốn xoá bản ghi này?');
        if (result) {
          let idEditor = 0
          let tempTableData = vm.dataSocket['tableData']
          idEditor = tempTableData[vm.currentIndex][0]
                  let dataPost = new URLSearchParams()
          let textPost = {
            'type': 'admin',
            'cmd': 'delete',
            'respone': 'detail',
            'id': idEditor,
            'code': vm.$router.history.current.params.tableName
          }
          dataPost = new URLSearchParams();
          dataPost.append('text', JSON.stringify(textPost))
          axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
            let dataObj = response.data
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
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
          }).catch(function (error) {
          })
          /*
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd:  'delete',
              respone: 'detail',
              id: idEditor,
              code: vm.$router.history.current.params.tableName
            }
          )
          */
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
      },
      cloneServiceProcess () {
        let currentProcess = this.dataSocket['tableData'][this.currentIndex]
        this.$emit('cloneProcess', currentProcess[0], currentProcess[1], currentProcess[2])
      },
      filterApplicantType (type) {
        let vm = this
        vm.applicantType = type
        vm.filterData[1] = type
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
      exportTableData () {
        let vm = this
        let tableDataExport = {
          'type': 'admin',
          'cmd': 'get',
          'code': vm.$router.history.current.params.tableName,
          'respone': 'tableData',
          'filter': [],
          'start': -1,
          'end': -1
        }
        let options = {
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Token': window.Liferay !== undefined ? window.Liferay.authToken : '',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          responseType: 'blob'
        }
        let paramGet = {}
        let dataPost = new URLSearchParams()
        dataPost.append('columnName', JSON.stringify(vm.tableConfigExport))
        dataPost.append('content', JSON.stringify(tableDataExport))
        vm.exportLoading = true
        axios.post('/o/rest/v2/socket/web/export-excel',
        dataPost, options)
        .then(function (response) {
          vm.exportLoading = false
          var fileNames = response.headers['content-disposition']
          var fileName = fileNames.split('filename=')[1] || dataReq.fileName
          fileName = fileName.split('"').join('')
          var a = document.createElement('a')
          document.body.appendChild(a)
          a.style = 'display: none'
          var urlFile = window.URL.createObjectURL(response.data)
          a.href = urlFile
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(urlFile)
        }).catch(function (error) {
          vm.exportLoading = false
          console.log(error)
        })

      },
      getWorkingunits () {
        let vm = this
        vm.dialog = true
        let options = {
          headers: {
            'groupId': window.themeDisplay.getScopeGroupId(),
            'Token': window.Liferay !== undefined ? window.Liferay.authToken : ''
          }
        }
        axios.get('/o/rest/v2/workingunits',options).then(function (response) {
          let data= response.data.data
          vm.itemTree = vm.list_to_tree(data, 'workingUnitId', 'parentWorkingUnitId')
          console.log('vm.itemTree',vm.itemTree)
        }).catch(function (error) {
        })
      },
      list_to_tree (list, id, parentId) {
        var map = {}, node, roots = [], i;
        
        for (i = 0; i < list.length; i += 1) {
          map[list[i][id]] = i; 
          list[i]['children'] = []; 
        }
        
        for (i = 0; i < list.length; i += 1) {
          node = list[i];
          if (node[parentId] !== 0) {
            list[map[node[parentId]]].children.push(node);
          } else {
            roots.push(node);
          }
        }
        return roots;
      },
      downloadFile (string) {
        //const url = window.URL.createObjectURL(new Blob([response.data]))
        console.log(string)
        const link = document.createElement('a')
        link.href = string
        
        // link.setAttribute('download', 'file.png') //or any other extension
        document.body.appendChild(link)
        link.click()
      },
      backToList () {
        let vm = this
        // let current = vm.$router.history.current
        // let newQuery = current.query
        // let currentPath = current.path
        // let queryString = '?'
        // newQuery['state_change'] = '0'
        // newQuery['renew'] = ''
        // for (let key in newQuery) {
        //   if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
        //     queryString += key + '=' + newQuery[key] + '&'
        //   }
        // }
        // queryString += 'renew=' + Math.floor(Math.random() * (100 - 1 + 1)) + 1
        // vm.$router.push({
        //   path: currentPath.substring(0, currentPath.indexOf('/editor/')) + queryString
        // })
        vm.$router.go(-1)
      },
    }
  }
</script>
