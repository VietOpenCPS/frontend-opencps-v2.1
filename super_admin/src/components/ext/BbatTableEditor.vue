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
        <v-btn dark icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-0">
          {{nameScreen}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon>
          <v-icon>undo</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-2" v-if="showDetailForm">
        <bbat-table-editor-component :table-config="dataSocket.tableConfig" :detail-data="dataSocket.detail"></bbat-table-editor-component>
      </div>
      <v-alert v-else
        :value="true"
        color="warning"
        icon="priority_high"
        outline
      >
      Không tìm thấy dữ liệu
    </v-alert>
    </v-card>
  </div>
</template>

<script>
  import BbatTableEditorComponent from './BbatTableEditorComponent.vue'

  export default {
    props: ['tableName', 'id'],
    components: {
      BbatTableEditorComponent
    },
    data () {
      return {
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
        nameScreen: '',
        showDetailForm: false,
        dataSocket: {}
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
          if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && vm.dataSocket['detail'] !== '[]') {
            vm.nameScreen = eval('( ' + vm.dataSocket['detail'] + ' )')[0][dataObj.title]
            vm.showDetailForm = true
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
              respone: 'detail',
              responeType: 'detail',
              filter: [
                {
                  'key': 'id',
                  'value': vm.id,
                  'compare': '=',
                  'type': 'number'
                }
              ]
            }
          )
        }, 10)
      })
    },
    methods: {
    }
  }
</script>
