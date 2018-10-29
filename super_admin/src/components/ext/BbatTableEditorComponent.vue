<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-layout v-if="detailForm !== null && detailForm.length > 0" row wrap style="
      margin-bottom: 100px;
    ">
      <v-flex v-for="(item, index) in detailForm" v-bind:key="index" :class="item['class']">
        <datetime-picker v-if="item.type === 'date'" v-model="data[item.model]" :item="item" :data-value="data[item.model]"></datetime-picker>
        <v-btn color="blue darken-3" dark v-if="item.type === 'button' && item['link'] && ((item.dependency && String(id) !== '0') || !item.dependency)" :to="item.url + '?pk=' + data[item.pk] + '&col=' + item.pk">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn color="blue darken-3" dark v-if="item.type === 'button' && item['popup'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAccount(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn color="blue darken-3" dark v-if="item.type === 'button' && item['attached'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <content-placeholders v-if="item.type === 'selects' && !pullOk">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-autocomplete v-if="item.type === 'selects' && pullOk"
          v-model="data[item.model]"
          :menu-props="data[item.model]+''"
          :items="item.hasOwnProperty('datasource') ? item.datasource : dataSocket[item['datasource_key']]"
          :item-text="item.itemText"
          :item-value="item.itemValue"
          box
          :label="item.required ? item['label'] + ' 💥': item['label']" 
          :rules="processRules(item.rules)"
          :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
          @change="processChangeDataSource($event, item)"
        ></v-autocomplete>
        <v-text-field v-if="item.type === 'text-fields'"
          v-model="data[item.model]"
          :label="item.required ? item['label'] + ' 💥': item['label']" 
          :rules="processRules(item.rules)"
          :placeholder="item['placeholder']"
          box 
          clearable
        >
        </v-text-field>
        <v-textarea v-if="item.type === 'textarea'"
          v-model="data[item.model]"
          :label="item.required ? item['label'] + ' 💥': item['label']" 
          :rules="processRules(item.rules)"
          :placeholder="item['placeholder']"
          box 
          clearable
        ></v-textarea>
        <v-subheader class="px-0" v-if="item.type === 'codemirror'">{{item['label']}}</v-subheader>
        <codemirror v-if="item.type === 'codemirror'" v-model="data[item.model]" :options="cmOptions"></codemirror>
        <v-switch v-if="item.type === 'v-switch'"
          :label="item['label']" 
          v-model="data[item.model]"
        ></v-switch>
      </v-flex>
      <v-flex xs12 class="text-right pt-0 ml-1 px-0" style="
          position: fixed;
          bottom: 0;
          width: -webkit-calc( 100% - 308px );
          width: calc( 100% - 308px );
          background: white;
          z-index: 4;
          border-top: 1px solid #dcdcdc;
      ">
        <v-progress-linear v-if="loading" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
        <v-btn v-if="String(id) === '0'" color="teal darken-3" class="mr-0" dark
          :loading="loading"
          :disabled="loading"
        >Ghi lại và thêm mới</v-btn>
        <v-btn color="blue darken-3" class="mr-0" dark v-on:click.native="saveToData"
          :loading="loading"
          :disabled="loading"
        >Ghi lại</v-btn>
        <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
          <v-icon>undo</v-icon> &nbsp;
          Quay lại
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12>
        <div id="video-preloader" class="video-preloader">
          <video loop id="editor-video-preloader" width="100%" height="350" muted="true" src="https://editorassets.parastorage.com/video-preloader/editor-video-preloader-2-@2x.mp4"></video>
        </div>
      </v-flex>
    </v-layout>
    <v-navigation-drawer
      v-model="rightAttached"
      right
      app
      fixed
      temporary
      style="background: #fff;"
      :width="600"
    >
      <v-card>
        <v-card-title primary-title class="pb-0">
          <v-layout row wrap>
            <v-flex xs12 class="text-center title">
              <span id="rightAttachedCounter"></span> {{layoutNameDynamic}}
            </v-flex>
          </v-layout>
          <v-btn class="my-0" flat icon color="primary" v-on:click.native="rightAttached = false" style="
    position: absolute;
    right: 25px;
">
            <v-icon size="18">clear</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-2">
          <attached-file-template v-if="rightAttached" :pk="id" :pick-item="pickItem"></attached-file-template>
        </v-card-title>
      </v-card>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="rightAccount"
      right
      app
      fixed
      temporary
      style="background: #fff;"
    >
      <v-card>
        <v-card-title primary-title class="pb-0">
          <v-layout row wrap>
            <v-flex xs12 class="text-center title">
              {{layoutNameDynamic}}
            </v-flex>
          </v-layout>
          <v-btn class="my-0" flat icon color="primary" v-on:click.native="rightAccount = false" style="
    position: absolute;
    right: 25px;
">
            <v-icon size="18">clear</v-icon>
          </v-btn>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-2">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="screenLogin"
                label="Tên đăng nhập" 
                box 
                readonly
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="emailLogin"
                label="Tài khoản đăng nhập" 
                box 
                readonly
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      <v-divider></v-divider>
      <v-card>
        <v-card-title primary-title class="pb-0 pt-2">
          <v-layout row wrap>
            <v-flex xs12 class="text-center title">
              Đổi mật khẩu
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      <v-card>
        <v-card-title primary-title class="pt-2">
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field
                v-model="password"
                label="Mật khẩu mới" 
                box 
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn block color="blue darken-3" dark>Xác nhận</v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      
    </v-navigation-drawer>
  </v-form>
</template>

<script>
  import DatetimePicker from './DatetimePicker.vue'
  import AttachedFileTemplate from './AttachedFileTemplate.vue'

  export default {
    props: ['tableConfig', 'detailData', 'id', 'tableName'],
    components: {
      DatetimePicker,
      AttachedFileTemplate
    },
    data() {
      return {
        pickItem: {},
        layoutNameDynamic: '',
        screenLogin: '',
        emailLogin: '',
        password: '',
        rightAttached: false,
        rightAccount: false,
        pullOk: false,
        pullCounter: 0,
        valid: true,
        loading: false,
        data: {},
        dataSocket: {},
        detailForm: [],
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-light',
          lineNumbers: true,
          line: true,
        },
        rules: {
          required: value => !!value || 'Bắt buộc phải nhập.',
          number: value => {
            const pattern = /\d/
            return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai định dạng thư điện tử.'
          }
        }
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function() {
        if (vm.tableConfig !== null && vm.tableConfig !== undefined) {
          if ((eval('( ' + vm.tableConfig + ' )').detailColumns !== '')) {
            vm.detailForm = eval('( ' + eval('( ' + vm.tableConfig + ' )').detailColumns + ' )')
            vm.processDataSource()
          } else {
            let videoElement = document.getElementById('editor-video-preloader')
            if (videoElement !== null && videoElement !== undefined) {
              videoElement.play()
            }
          }
          if (vm.detailData !== null && vm.detailData !== undefined) {
            vm.data = eval('( ' + vm.detailData + ' )')[0]
          } else {
            vm.data = {}
          }
        } else {
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
        }
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
          if (dataObj.respone === 'detail') {
            vm.data = eval('( ' + vm.dataSocket[dataObj.respone] + ' )')
          }
          if (dataObj.respone === 'tableConfig') {
            vm.detailForm = eval('( ' + eval('( ' + vm.dataSocket[dataObj.respone] + ' )').detailColumns + ' )')
            vm.processDataSource()
          }
          vm.loading = false
          if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get') {
            let currentPath = vm.$router.history.current.path
            vm.$router.push(currentPath.substring(0, currentPath.indexOf('/editor/')))
          }
          if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
            vm.pullCounter = vm.pullCounter - 1
            console.log(vm.pullCounter)
            // vm.pullCounter = vm.pullCounter - 1
            if (vm.pullCounter === 0) {
              setTimeout(() => {
                vm.pullOk = true
              }, 500)
            }
          }
        }
      })
    },
    methods: {
      clearLoading () {
        this.loading = false
      },
      backToList () {
        let vm = this
        let currentPath = vm.$router.history.current.path
        vm.$router.push(currentPath.substring(0, currentPath.indexOf('/editor/')))
      },
      saveToData () {
        let vm = this
        if (vm.$refs.form.validate()) {
          vm.loading = true
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd:  'add',
              respone: 'detail',
              id: vm.id,
              code: vm.$router.history.current.params.tableName,
              data: Object.assign({}, vm.data)
            }
          )
        }
      },
      processRules (rulesStr) {
        return eval('( ' + rulesStr + ' )')
      },
      processChangeDataSource (data, item) {
        let vm = this
        if (item.hasOwnProperty('concatina')) {
          vm.pullOk = false
          vm.$socket.sendObj(
            {
              type: 'api',
              cmd: 'get',
              respone: item.concatina['datasource_key'],
              api: item.concatina['datasource_api'] + '?' + item.concatina['query'] + '=' + data,
              headers: {
                'Token': vm.getAuthToken(),
                'groupId': vm.getScopeGroupId()
              }
            }
          )
        }
      },
      processDataSource () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            vm.pullOk = false
            vm.pullCounter = vm.pullCounter + 1
            vm.$socket.sendObj(
              {
                type: 'api',
                cmd: 'get',
                respone: vm.detailForm[key]['datasource_key'],
                api: vm.detailForm[key]['datasource_api'],
                headers: {
                  'Token': vm.getAuthToken(),
                  'groupId': vm.getScopeGroupId()
                }
              }
            )
          }
        }
      },
      showAccount (item) {
        let vm = this
        vm.layoutNameDynamic = item['label']
        vm.rightAccount = !vm.rightAccount
      },
      showAttached (item) {
        let vm = this
        vm.layoutNameDynamic = item['label']
        vm.pickItem = item
        vm.rightAttached = !vm.rightAttached
      }
    }
  }
</script>
