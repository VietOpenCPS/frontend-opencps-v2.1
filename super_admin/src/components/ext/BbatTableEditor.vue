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
        <v-btn dark flat v-on:click.native="deleteRecord">
          <v-icon>delete</v-icon> &nbsp;
          Xoá bản ghi
        </v-btn>
        <v-icon dark>more_vert</v-icon>
        <v-btn dark icon v-on:click.native="backToList">
          <v-icon>reply</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="grid-list mt-2" v-if="showDetailForm">
        <bbat-table-editor-component ref="bbatForm" :table-config="dataSocket.tableConfig" :detail-data="dataSocket.detail" :id="id" :table-name="tableName"></bbat-table-editor-component>
      </div>
      <v-alert v-if="noDetail"
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
  import axios from 'axios'

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
        noDetail: false,
        dataSocket: {}
      }
    },
    computed: {
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
        if (vm.isConnected) {
          vm.isConnected = false
          /*
          vm.$socket.onmessage = function (data) {
            let dataObj = eval('( ' + data.data + ' )')
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && (dataObj.respone === 'detail' || dataObj.respone === 'tableConfig')) {
              if (vm.dataSocket['detail'] !== '[]') {
                vm.nameScreen = vm.dataSocket['detail'][0][dataObj.title]
                vm.showDetailForm = true
                vm.noDetail = false
              } else {
                vm.noDetail = true
              }
            }
            if (dataObj.respone === 'listTableMenu') {
              vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
            } else if (dataObj.respone === 'loginUser') {
              vm.$store.commit('setloginUser', dataObj['loginUser'])
            } 
            if (String(vm.id) === '0') {
              vm.nameScreen = 'Thêm mới dữ liệu'
              vm.showDetailForm = true
              vm.noDetail = false
            }
          }
          */
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
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            textPost = {
              'type': 'admin',
              'cmd': 'get',
              'code': vm.$router.history.current.params.tableName,
              'respone': 'detail',
              'responeType': 'detail',
              'filter': [
                {
                  'key': 'id',
                  'value_filter': vm.id,
                  'compare': '=',
                  'type': 'number'
                }
              ]
            }
            dataPost = new URLSearchParams();
            dataPost.append('text', JSON.stringify(textPost))
            axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
              let dataObj = response.data
              vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
              if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && (dataObj.respone === 'detail' || dataObj.respone === 'tableConfig')) {
                if (vm.dataSocket['detail'] !== []) {
                  vm.nameScreen = vm.dataSocket['detail'][0][dataObj.title]
                  vm.showDetailForm = true
                  vm.noDetail = false
                } else {
                  vm.noDetail = true
                }
              }
              if (dataObj.respone === 'listTableMenu') {
                vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
              } else if (dataObj.respone === 'loginUser') {
                vm.$store.commit('setloginUser', dataObj['loginUser'])
              } 
              if (String(vm.id) === '0') {
                console.log('Thêm mới 1 -=-=-=-=')
                vm.nameScreen = 'Thêm mới dữ liệu'
                vm.showDetailForm = true
                vm.noDetail = false
              }
            }).catch(function (error) {
            })
          }).catch(function (error) {
          })
        }
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        vm.noDetail = false
        /*
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
          if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && (dataObj.respone === 'detail' || dataObj.respone === 'tableConfig')) {
            if (vm.dataSocket['detail'] !== '[]') {
              vm.nameScreen = vm.dataSocket['detail'][0][dataObj.title]
              vm.showDetailForm = true
              vm.noDetail = false
            } else {
              vm.noDetail = true
            }
          }
          if (dataObj.respone === 'listTableMenu') {
            vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
          } else if (dataObj.respone === 'loginUser') {
            vm.$store.commit('setloginUser', dataObj['loginUser'])
          } 
          if (String(vm.id) === '0') {
            vm.nameScreen = 'Thêm mới dữ liệu'
            vm.showDetailForm = true
            vm.noDetail = false
          }
        }
        */
        setTimeout(() => {
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
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            textPost = {
              'type': 'admin',
              'cmd': 'get',
              'code': vm.$router.history.current.params.tableName,
              'respone': 'detail',
              'responeType': 'detail',
              'filter': [
                {
                  'key': 'id',
                  'value_filter': vm.id,
                  'compare': '=',
                  'type': 'number'
                }
              ]
            }
            dataPost = new URLSearchParams();
            dataPost.append('text', JSON.stringify(textPost))
            axios.post('/o/rest/v2/socket/web', dataPost, {}).then(function (response) {
              let dataObj = response.data
              vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
              console.log('dataObj44 = ', dataObj)
              console.log('dataSocket44 = ', vm.dataSocket)
              if (vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined && vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined && (dataObj.respone === 'detail' || dataObj.respone === 'tableConfig')) {
                if (Array.isArray(vm.dataSocket['detail']) && vm.dataSocket['detail'].length > 0) {
                  vm.nameScreen = vm.dataSocket['detail'][0][dataObj.title]
                  vm.showDetailForm = true
                  vm.noDetail = false
                  console.log('Sửa -=-=-=-=')
                } else {
                  vm.noDetail = true
                }
              }
              console.log('run 1 -=-=-=-=', vm.id)
              if (dataObj.respone === 'listTableMenu') {
                vm.$store.commit('setlistTableMenu', vm.dataSocket[dataObj.respone])
              } else if (dataObj.respone === 'loginUser') {
                vm.$store.commit('setloginUser', dataObj['loginUser'])
              }
              console.log('run 2 -=-=-=-=')
              if (String(vm.id) === '0') {
                console.log('Thêm mới -=-=-=-=')
                vm.nameScreen = 'Thêm mới dữ liệu'
                vm.showDetailForm = true
                vm.noDetail = false
              }
            }).catch(function (error) {
            })
          }).catch(function (error) {
          })
          /*
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
              respone: 'detail',
              responeType: 'detail',
              filter: [
                {
                  'key': 'id',
                  'value_filter': vm.id,
                  'compare': '=',
                  'type': 'number'
                }
              ]
            }
          )
          */
        }, 10)
      })
    },
    methods: {
      backToList () {
        let vm = this
        let current = vm.$router.history.current
        let newQuery = current.query
        let currentPath = current.path
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
          path: currentPath.substring(0, currentPath.indexOf('/editor/')) + queryString
        })
      },
      deleteRecord () {
        let vm = this
        var result = confirm('Bạn có muốn xoá bản ghi này?');
        if (result) {
          let dataPost = new URLSearchParams()
          let textPost = {
            'type': 'admin',
            'cmd': 'delete',
            'respone': 'detail',
            'id': vm.id,
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
          // vm.$socket.sendObj(
          //   {
          //     type: 'admin',
          //     cmd:  'delete',
          //     respone: 'detail',
          //     id: vm.id,
          //     code: vm.$router.history.current.params.tableName
          //   }
          // )
        }
      }
    }
  }
</script>
