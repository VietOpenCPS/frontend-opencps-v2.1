<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-layout v-if="detailForm !== null && detailForm.length > 0" row wrap style="
      margin-bottom: 100px;
    ">
      <v-flex v-for="(item, index) in detailForm" v-bind:key="index" :class="item['class']">
        <v-subheader class="px-0" v-if="item.type === 'ricktext'">{{item['label']}}</v-subheader>
        <trumbowyg v-if="item.type === 'ricktext'" v-model="data[item.model]" :config="config"></trumbowyg>
        <attached-file-avatar v-if="item.type === 'avatar'" :pk="data[item.model]" :pick-item="item" :current-data="data"></attached-file-avatar>
        <datetime-picker :class="item['class_component']" v-if="item.type === 'date'" v-model="data[item.model]" :item="item" :data-value="data[item.model]"></datetime-picker>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['link'] && ((item.dependency && String(id) !== '0') || !item.dependency)" :to="item.url + '?pk=' + data[item.pk] + '&col=' + (item.hasOwnProperty('pk_foreign') ? item.pk_foreign : item.pk) ">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['account'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAccount(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['attached'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <v-btn :class="item['class_component']" color="blue darken-3" dark v-if="item.type === 'button' && item['fileform'] && ((item.dependency && String(id) !== '0') || !item.dependency)" v-on:click.native="showAttached(item)">
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'link'">how_to_vote</v-icon>
          <v-icon class="mr-1" size="14" v-if="item['btn_type'] === 'popup'">flip_to_back</v-icon>
          {{item.label}}
        </v-btn>
        <content-placeholders v-if="item.type === 'selects' && !pullOk && item.hasOwnProperty('datasource_key')">
          <content-placeholders-text :lines="1" />
        </content-placeholders>
        <v-autocomplete :class="item['class_component']" v-if="item.type === 'selects' && pullOk && item.hasOwnProperty('datasource_key')"
          v-model="data[item.model]"
          :items="dataSocket[item['datasource_key']]"
          :item-text="item.itemText"
          :item-value="item.itemValue"
          box
          :rules="processRules(item.rules)"
          :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
          @change="processChangeDataSource($event, item)"
          :chips="item['chips']"
          :multiple="item['multiple']"
          clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-autocomplete>
        <v-autocomplete :class="item['class_component']" v-if="item.type === 'selects' && !item.hasOwnProperty('datasource_key')"
          v-model="data[item.model]"
          :items="item.datasource"
          :item-text="item.itemText"
          :item-value="item.itemValue"
          box
          :rules="processRules(item.rules)"
          :no-data-text="'Không tìm thấy dữ liệu ' + item['label']"
          @change="processChangeDataSource($event, item)"
          :chips="item['chips']"
          :multiple="item['multiple']"
          clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-autocomplete>
        <v-text-field :class="item['class_component']" v-if="item.type === 'text-fields'"
          v-model="data[item.model]"
          :rules="processRules(item.rules)"
          :placeholder="item['placeholder']"
          box 
          clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-text-field>
        <v-textarea :class="item['class_component']" v-if="item.type === 'textarea'"
          v-model="data[item.model]"
          :rules="processRules(item.rules)"
          :placeholder="item['placeholder']"
          box 
          clearable
        >
          <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-textarea>
        <v-subheader class="px-0" v-if="item.type === 'codemirror'">{{item['label']}}</v-subheader>
        <codemirror v-if="item.type === 'codemirror'" v-model="data[item.model]" :options="cmOptions"></codemirror>
        <v-switch :class="item['class_component']" v-if="item.type === 'v-switch'"
          :label="item['label']" 
          v-model="data[item.model]"
        ></v-switch>
        <div v-if="item.hasOwnProperty('alongside')" v-for="(itemChild, indexChild) in item['alongside']" v-bind:key="indexChild">
        <v-subheader class="px-0" v-if="itemChild.type === 'ricktext'">{{itemChild['label']}}</v-subheader>
          <trumbowyg v-if="itemChild.type === 'ricktext'" v-model="data[itemChild.model]" :config="config"></trumbowyg>
          <attached-file-avatar :class="itemChild['class_component']" v-if="itemChild.type === 'avatar'" :pk="data[itemChild.model]" :pick-item="itemChild"></attached-file-avatar>
          <datetime-picker :class="itemChild['class_component']" v-if="itemChild.type === 'date'" v-model="data[itemChild.model]" :item="itemChild" :data-value="data[itemChild.model]"></datetime-picker>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['link'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" :to="itemChild.url + '?pk=' + data[itemChild.pk] + '&col=' + itemChild.pk">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{itemChild.label}}
          </v-btn>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['account'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" v-on:click.native="showAccount(itemChild)">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{itemChild.label}}
          </v-btn>
          <v-btn :class="itemChild['class_component']" color="blue darken-3" dark v-if="itemChild.type === 'button' && itemChild['attached'] && ((itemChild.dependency && String(id) !== '0') || !itemChild.dependency)" v-on:click.native="showAttached(itemChild)">
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'link'">how_to_vote</v-icon>
            <v-icon class="mr-1" size="14" v-if="itemChild['btn_type'] === 'popup'">flip_to_back</v-icon>
            {{itemChild.label}}
          </v-btn>
          <content-placeholders v-if="itemChild.type === 'selects' && !pullOk && itemChild.hasOwnProperty('datasource_key')">
            <content-placeholders-text :lines="1" />
          </content-placeholders>
          <v-autocomplete :class="itemChild['class_component']" v-if="itemChild.type === 'selects' && pullOk && itemChild.hasOwnProperty('datasource_key')"
            v-model="data[itemChild.model]"
            :items="dataSocket[itemChild['datasource_key']]"
            :item-text="itemChild.itemText"
            :item-value="itemChild.itemValue"
            box
            :rules="processRules(itemChild.rules)"
            :no-data-text="'Không tìm thấy dữ liệu ' + itemChild['label']"
            @change="processChangeDataSource($event, itemChild)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            clearable
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-autocomplete>
          <v-autocomplete :class="itemChild['class_component']" v-if="itemChild.type === 'selects' && !itemChild.hasOwnProperty('datasource_key')"
            v-model="data[itemChild.model]"
            :items="itemChild.datasource"
            :item-text="itemChild.itemText"
            :item-value="itemChild.itemValue"
            box
            :rules="processRules(itemChild.rules)"
            :no-data-text="'Không tìm thấy dữ liệu ' + itemChild['label']"
            @change="processChangeDataSource($event, itemChild)"
            :chips="item['chips']"
            :multiple="item['multiple']"
            clearable
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-autocomplete>
          <v-text-field :class="itemChild['class_component']" v-if="itemChild.type === 'text-fields'"
            v-model="data[itemChild.model]"
            :rules="processRules(itemChild.rules)"
            :placeholder="itemChild['placeholder']"
            box
            clearable
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-text-field>
          <v-textarea :class="itemChild['class_component']" v-if="itemChild.type === 'textarea'"
            v-model="data[itemChild.model]"
            :rules="processRules(itemChild.rules)"
            :placeholder="itemChild['placeholder']"
            box
            clearable
          >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
          </v-textarea>
          <v-subheader class="px-0" v-if="itemChild.type === 'codemirror'">{{itemChild['label']}}</v-subheader>
          <codemirror v-if="itemChild.type === 'codemirror'" v-model="data[itemChild.model]" :options="cmOptions"></codemirror>
          <v-switch :class="itemChild['class_component']" v-if="itemChild.type === 'v-switch'"
            :label="itemChild['label']" 
            v-model="data[itemChild.model]"
          ></v-switch>
        </div>
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
          v-on:click.native="saveToData('cmd_ide')"
        >Ghi lại và thêm mới</v-btn>
        <v-btn color="blue darken-3" class="mr-0" dark v-on:click.native="saveToData('cmd')"
          :loading="loading"
          :disabled="loading"
        >Ghi lại</v-btn>
        <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
          <v-icon>reply</v-icon> &nbsp;
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
        <v-card-title primary-title class="pb-0 pt-2" v-if="pickItem['attached']">
          <attached-file-template v-if="rightAttached" :pk="id" :pick-item="pickItem" :code="tableName"></attached-file-template>
        </v-card-title>
        <v-card-title primary-title class="pb-0 pt-2" v-if="pickItem['fileform']">
          <v-layout row wrap class="my-3">
            <v-flex xs12 class="text-center title">
              Tải file cấu hình mẫu FORM
            </v-flex>
            <attached-file-form v-if="rightAttached" :pk="id" :pick-item="pickItem" :code="tableName"></attached-file-form>
            <v-flex xs12 class="text-center title mt-3">
              Tải file cấu hình mẫu Jasper
            </v-flex>
            <attached-file-jasper v-if="rightAttached" :pk="id" :pick-item="pickItem" :code="tableName"></attached-file-jasper>
          </v-layout>
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
                type="password"
                label="Mật khẩu mới" 
                box 
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-btn block color="blue darken-3" dark v-on:click.native="doChangePassWord()">Xác nhận</v-btn>
            </v-flex>
            <v-flex xs12>
              <v-switch
                label="Kích hoạt tài khoản"
                v-model="deactiveAccountFlagBoolean"
                @change="doChangeStatusAccount($event)"
              ></v-switch>
            </v-flex>
          </v-layout>
        </v-card-title>
      </v-card>
      
    </v-navigation-drawer>
    <v-snackbar
      v-model="snackbarsuccess"
      :bottom="false"
      :left="false"
      :multi-line="false"
      :right="true"
      :timeout="2000"
      :top="true"
      :vertical="false"
      color="success"
    >
      Yêu cầu thực hiện thành công
      <v-btn
        icon
        @click="snackbarsuccess = false"
      >
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
  </v-form>
</template>

<script>
  import DatetimePicker from './DatetimePicker.vue'
  import AttachedFileTemplate from './AttachedFileTemplate.vue'
  import AttachedFileAvatar from './AttachedFileAvatar.vue'
  import AttachedFileForm from './AttachedFileForm.vue'
  import AttachedFileJasper from './AttachedFileJasper.vue'

  export default {
    props: ['tableConfig', 'detailData', 'id', 'tableName'],
    components: {
      DatetimePicker,
      AttachedFileTemplate,
      AttachedFileAvatar,
      AttachedFileForm,
      AttachedFileJasper,
      'trumbowyg': window.VueTrumbowyg.default
    },
    data() {
      return {
        config: {},
        deactiveAccountFlag: 0,
        deactiveAccountFlagBoolean: false,
        snackbarsuccess: false,
        pickItem: {},
        layoutNameDynamic: '',
        screenLogin: '',
        emailLogin: '',
        password: '',
        rightAttached: false,
        rightAccount: false,
        pullOk: true,
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
            const pattern = /^\d+$/
            return pattern.test(value) || 'Bắt buộc phải nhập kiểu số.'
          },
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Sai định dạng thư điện tử.'
          }
        }
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
    created() {
      var vm = this
      vm.$nextTick(function() {
        if (vm.tableConfig !== null && vm.tableConfig !== undefined) {
          if (vm.tableConfig['detailColumns'] !== '') {
            vm.detailForm = eval('( ' + vm.tableConfig['detailColumns'] + ' )')
          } else {
            let videoElement = document.getElementById('editor-video-preloader')
            if (videoElement !== null && videoElement !== undefined) {
              videoElement.play()
            }
          }
          if (vm.detailData !== null && vm.detailData !== undefined) {
            vm.data = vm.detailData[0]
            vm.processDataSourceVerify()
          } else {
            vm.data = {}
          }
          vm.processDataSource()
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
            if (vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined) {
              if (vm.dataSocket['detail'].length === 0) {
                vm.data = {}
              } else {
                vm.data = vm.dataSocket[dataObj.respone][0]
              }
              vm.processDataSourceVerify()
            } else {
              vm.data = {}
            }
          } else if (dataObj.respone === 'loginUser') {
            vm.$store.commit('setloginUser', dataObj['loginUser'])
          } 
          if (dataObj.respone === 'tableConfig' && vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined) {
            vm.detailForm = eval('( ' + vm.dataSocket['tableConfig']['detailColumns'] + ' )')
            console.log('load tableConfig')
            vm.processDataSource()
          }
          vm.loading = false
          if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get' && dataObj['cmd'] !== 'cmd_ide') {
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
          } else if (dataObj['status'] === '200' && dataObj['cmd'] === 'cmd_ide') {
            vm.snackbarsuccess = true
            vm.data = {}
          }
          if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
            vm.pullCounter = vm.pullCounter - 1
            if (vm.pullCounter === 0) {
              vm.pullOk = true
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
      saveToData (cmdText) {
        let vm = this
        if (vm.isConnected) {
          vm.isConnected = false
          vm.$socket.onmessage = function (data) {
            let dataObj = eval('( ' + data.data + ' )')
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            if (dataObj.respone === 'detail') {
              if (vm.dataSocket['detail'] !== null && vm.dataSocket['detail'] !== undefined) {
                if (vm.dataSocket['detail'].length === 0) {
                  vm.data = {}
                } else {
                  vm.data = vm.dataSocket[dataObj.respone][0]
                }
                vm.processDataSourceVerify()
              } else {
                vm.data = {}
              }
            } else if (dataObj.respone === 'loginUser') {
              vm.$store.commit('setloginUser', dataObj['loginUser'])
            } 
            if (dataObj.respone === 'tableConfig' && vm.dataSocket['tableConfig'] !== null && vm.dataSocket['tableConfig'] !== undefined) {
              vm.detailForm = eval('( ' + vm.dataSocket['tableConfig']['detailColumns'] + ' )')
              console.log('load tableConfig')
              vm.processDataSource()
            }
            vm.loading = false
            if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get' && dataObj['cmd'] !== 'cmd_ide') {
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
            } else if (dataObj['status'] === '200' && dataObj['cmd'] === 'cmd_ide') {
              vm.snackbarsuccess = true
              vm.data = {}
            }
            if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
              vm.pullCounter = vm.pullCounter - 1
              if (vm.pullCounter === 0) {
                vm.pullOk = true
              }
            }
          }
        }
        if (vm.$refs.form.validate()) {
          vm.loading = true
          let current = vm.$router.history.current
          let newQuery = current.query
          let dataPOST = Object.assign({}, vm.data)
          delete dataPOST['expandoBridge']
          delete dataPOST['modelAttributes']
          delete dataPOST['stagedModelType']
          if (newQuery.hasOwnProperty('col') && newQuery.hasOwnProperty('pk')) {
            dataPOST[newQuery['col']] = newQuery['pk']
          }
          vm.$socket.sendObj(
            {
              type: 'admin',
              cmd: cmdText,
              respone: 'detail',
              id: vm.id,
              code: vm.$router.history.current.params.tableName,
              data: dataPOST
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
          vm.pullCounter = vm.pullCounter + 1
          vm.$socket.sendObj(
            {
              type: 'api',
              cmd: 'get',
              respone: item.concatina['datasource_key'],
              api: item.concatina['datasource_api'] + '?' + item.concatina['query'] + '=' + data,
              headers: {
                'Token': vm.getAuthToken(),
                'groupId': vm.getScopeGroupId(),
                'USER_ID': vm.getUserId()
              }
            }
          )
        }
      },
      processDataSourceVerify () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            if (vm.data.hasOwnProperty(vm.detailForm[key]['model']) && String(vm.data[vm.detailForm[key]['model']]).startsWith("[")) {
              vm.data[vm.detailForm[key]['model']] = JSON.parse(vm.data[vm.detailForm[key]['model']])
            }
          }
        }
      },
      processDataSource () {
        let vm = this
        for (let key in vm.detailForm) {
          if (vm.detailForm[key].hasOwnProperty('datasource_api') && vm.detailForm[key].hasOwnProperty('datasource_key')) {
            vm.pullOk = false
            vm.pullCounter = vm.pullCounter + 1
            let apiURL = vm.detailForm[key]['datasource_api']
            if (vm.detailForm[key]['dependency'] && vm.detailForm[key].hasOwnProperty('pk')) {
              apiURL = apiURL + '?pk' + '=' + vm.id + '&col=' + vm.detailForm[key]['pk']
            }
            vm.$socket.sendObj(
              {
                type: 'api',
                cmd: 'get',
                respone: vm.detailForm[key]['datasource_key'],
                api: apiURL,
                headers: {
                  'Token': vm.getAuthToken(),
                  'groupId': vm.getScopeGroupId(),
                  'USER_ID': vm.getUserId()
                }
              }
            )
          }
        }
      },
      doDeactiveAccount () {
        let vm = this
        let postData = {
          id: vm.detailData[0]['mappingUserId'],
          data: {
            locked: vm.password
          }
        }
        vm.$store.dispatch('deactiveAccount', postData).then(function (data) {
          vm.snackbarsuccess = true
          console.log(data)
        })
      },
      doChangePassWord () {
        let vm = this
        var result = confirm('Bạn có muốn đổi mật khẩu?');
        if (result) {
          let postData = {
            id: vm.detailData[0]['mappingUserId'],
            data: {
              password: vm.password
            }
          }
          vm.$store.dispatch('changePassUserAccount', postData).then(function (data) {
            vm.snackbarsuccess = true
            console.log(data)
          })
        }
      },
      doChangeStatusAccount (dataLock) {
        let vm = this
        let labelStatus = 'Bạn có muốn khoá tài khoản này?'
        if (dataLock) {
          labelStatus = 'Bạn có muốn mở khoá tài khoản này?'
        }
        var result = confirm(labelStatus)
        if (result) {
          let postData = {
            id: vm.detailData[0]['mappingUserId'],
            data: {
              locked: !dataLock
            }
          }
          vm.$store.dispatch('doChangeStatusAccount', postData).then(function (data) {
            vm.snackbarsuccess = true
            console.log(data)
          })
        } else {
          setTimeout(function() {
            vm.deactiveAccountFlagBoolean = !dataLock
          }, 10)
        }
      },
      showAccount (item) {
        let vm = this
        if (vm.detailData[0]['mappingUserId'] === 0) {
          if (item['email'] === '') {
            alert('Cấp địa chỉ email trước khi tạo tài khoản.')
          } else {
            var result = confirm('Bạn có muốn cấp tài khoản sử dụng cho nhân sự này?');
            if (result) {
              let postData = {
                id: vm.id,
                data: {
                  email: vm.detailData[0]['email'],
                  screenName: '',
                  exist: false
                }
              }
              vm.$store.dispatch('createUserAccount', postData).then(function (data) {
                vm.screenLogin = data['screenName']
                vm.emailLogin = data['email']
                vm.deactiveAccountFlag = data['deactiveAccountFlag']
                if (vm.deactiveAccountFlag === 0) {
                  vm.deactiveAccountFlagBoolean = true
                } else {
                  vm.deactiveAccountFlagBoolean = false
                }
                vm.layoutNameDynamic = item['label']
                vm.rightAccount = !vm.rightAccount
              })
            }
          }
        } else {
          vm.$store.dispatch('getUserAccount', vm.detailData[0]['mappingUserId']).then(function (data) {
            vm.screenLogin = data['screenName']
            vm.emailLogin = data['email']
            vm.deactiveAccountFlag = data['deactiveAccountFlag']
            if (vm.deactiveAccountFlag === 0) {
              vm.deactiveAccountFlagBoolean = true
            } else {
              vm.deactiveAccountFlagBoolean = false
            }
            vm.layoutNameDynamic = item['label']
            vm.rightAccount = !vm.rightAccount
          })
        }
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
