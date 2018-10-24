<template>
  <div>
    <v-layout v-if="detailForm !== null && detailForm.length > 0" row wrap style="
      margin-bottom: 100px;
    ">
      <v-flex v-for="(item, index) in detailForm" v-bind:key="index" :class="item['class']">
        <v-text-field v-if="item.type === 'text-fields'"
          v-model="data[item.model]"
          :label="item['label']" 
          :placeholder="item['placeholder']"
          box 
          clearable
        >
        </v-text-field>
        <v-textarea v-if="item.type === 'textarea'"
          v-model="data[item.model]"
          :label="item['label']" 
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
      <v-flex xs12 class="text-right" style="
          position: fixed;
          bottom: 0;
          width: -webkit-calc( 100% - 300px );
          width: calc( 100% - 300px );
          background: white;
          z-index: 2;
      ">
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
  </div>
  
</template>

<script>
  export default {
    props: ['tableConfig', 'detailData', 'id'],
    data() {
      return {
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
        }
      }
    },
    created() {
      var vm = this
      vm.$nextTick(function() {
        if ((eval('( ' + vm.tableConfig + ' )').detailColumns !== '')) {
          vm.detailForm = eval('( ' + eval('( ' + vm.tableConfig + ' )').detailColumns + ' )')
        } else {
          let videoElement = document.getElementById('editor-video-preloader')
          videoElement.play()
        }
        if (vm.detailData !== null && vm.detailData !== undefined) {
          vm.data = eval('( ' + vm.detailData + ' )')[0]
        } else {
          vm.data = {}
        }
        vm.$socket.onmessage = function (data) {
          let dataObj = eval('( ' + data.data + ' )')
          vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
          if (dataObj.respone === 'detail') {
            vm.data = eval('( ' + vm.dataSocket[dataObj.respone] + ' )')
          }
          vm.loading = false
          if (dataObj['status'] === '200' && dataObj['cmd'] !== 'get') {
            let currentPath = vm.$router.history.current.path
            vm.$router.push(currentPath.substring(0, currentPath.indexOf('/editor/')))
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
    }
  }
</script>
