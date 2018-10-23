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

    <v-card class="px-2 mx-1" style="overflow: hidden;">
      <v-toolbar color="blue darken-3" dark height="48">
        <v-btn dark icon v-on:click.native="addFilterRow">
          <v-icon v-if="!showFilter">highlight</v-icon>
          <v-icon v-else>highlight_off</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{nameScreen}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn dark icon>
          <v-icon>refresh</v-icon>
        </v-btn>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="toEditor(0)">
          <v-icon>add_circle</v-icon>
        </v-btn>
      </v-toolbar>
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
        <v-list-tile >
          <v-list-tile-action>
            <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Sửa</v-list-tile-title>
        </v-list-tile>
        <v-list-tile >
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
  export default {
    props: ['tableName'],
    data () {
      return {
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
        dataSocket: {}
      }
    },
    watch: {
      dataSocket: {
        handler: function (value) {
          console.log(value)
          if (value['tableConfig'] !== null && value['tableConfig'] !== undefined && value['tableData'] !== null && value['tableData'] !== undefined) {
            this.generateTable()
          }
        },
        deep: true
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
          if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['tableData'] !== null && vm.dataSocket['tableData'] !== undefined) {
            vm.nameScreen = eval('( ' +vm.dataSocket['tableConfig']+ ' )')[dataObj.title]
            vm.generateTable()
          }
        }
        setTimeout(() => {
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd: 'get',
              config: true,
              code: 'abc',
              respone: 'tableConfig'
            }
          )
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd: 'get',
              code: 'abc',
              respone: 'tableData'
            }
          )
        }, 10)
      })
    },
    methods: {
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
            contextMenu:function() { vm.show(window.event); },
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
        window.$('#table_database').jexcel({
          data: eval('( ' + vm.dataSocket['tableData'] + ' )'),
          colHeaders: objectConfig.headersName,
          colWidths: colWidths,
          colAlignments: [ 'left', 'left', 'left', 'left' ],
          contextMenu:function() { vm.show(window.event); },
          onsort: function (e) {
            window.$('#table_database').jexcel('orderBy', window.$(e).next().val())
          },
          columns: columns
        })
      },
      toEditor (id) {
        let vm = this
        vm.$router.push({
          path: '/table/' + vm.tableName + '/editor/' + id
        })
      },
      start() {
        this.$socket.sendObj(
          {
            type: 'admin',
            cmd: 'add',
            code: 'abc',
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
