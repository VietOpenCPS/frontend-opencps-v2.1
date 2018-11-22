<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>{{items[index] !== undefined ? items[index]['typeName'] : ''}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn icon class="my-0 mx-0 btn-border-left">
            <v-icon size="16">more_vert</v-icon>
          </v-btn>
          <v-btn icon class="ml-0 mx-0 btn-border-left mr-3" @click="backToList" active-class="temp_active">
            <v-icon size="16">reply</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <bbat-table-editor-component-simple ref="bbatFormSimple" :id="id"></bbat-table-editor-component-simple>
    <v-tabs
      icons-and-text centered
      v-model="active"
    >
      <v-tabs-slider></v-tabs-slider>
  
      <v-tab
        href="#tab-1"
        :key="1"
        v-if="String(id) !== '0'"
      >
        <v-btn flat class="px-0 py-0 mx-0 my-0">
          XEM GIẤY PHÉP
        </v-btn>
      </v-tab>
        <v-tab
        href="#tab-2"
        :key="2"
      >
        <v-btn flat class="px-0 py-0 mx-0 my-0">
          FORM NHẬP GIẤY PHÉP
        </v-btn>
      </v-tab>
      <v-tab :key="3" href="#tab-3" 
        v-if="String(id) !== '0'"> 
        <v-btn flat class="px-0 py-0 mx-0 my-0">
          LỊCH SỬ CẬP NHẬT GIẤY PHÉP
        </v-btn>
      </v-tab>

      <v-tabs-items reverse-transition="fade-transition" transition="fade-transition">
        <v-tab-item
          value="tab-1"
          :key="1"
          reverse-transition="fade-transition" transition="fade-transition"
          v-if="String(id) !== '0'"
        >
          view giay phep
        </v-tab-item>
        <v-tab-item
          value="tab-2"
          :key="2"
          reverse-transition="fade-transition" transition="fade-transition"
        >
          <bbat-table-editor-component ref="bbatForm" :id="id"></bbat-table-editor-component>
        </v-tab-item>
        <v-tab-item
          value="tab-3"
          :key="3"
          reverse-transition="fade-transition" transition="fade-transition"
          v-if="String(id) !== '0'"
        >
          view logs
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
    <v-layout row wrap>
      <v-flex xs12 class="text-right pt-0 ml-1 px-0" style="
          border-top: 1px solid #dcdcdc;
      ">
        <v-progress-linear v-if="loading" :indeterminate="true" class="my-0" color="blue darken-3"></v-progress-linear>
        <v-btn v-if="String(id) === '0'" color="teal darken-3" class="mr-0" dark  v-on:click.native="saveToData(-1)"
          :loading="loading"
          :disabled="loading"
        >Ghi lại và thêm mới</v-btn>
        <v-btn color="blue darken-3" class="mr-0" dark  v-on:click.native="saveToData(0)"
          :loading="loading"
          :disabled="loading"
        >Ghi lại</v-btn>
        <v-btn color="red darken-3" class="mr-0" dark v-on:click.native="backToList">
          <v-icon>reply</v-icon> &nbsp;
          Quay lại
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { BbatTableEditorComponent, BbatTableEditorComponentSimple } from '@/components'

  export default {
    props: ['index', 'id'],
    components: {
      BbatTableEditorComponentSimple,
      BbatTableEditorComponent
    },
    data () {
      return {
        active: 0,
        loading: false,
        dataSocket: {},
        tempCounter: 0
      }
    },
    created () {
      var vm = this
      vm.$nextTick(function () {
        setTimeout(() => {
          let formId = vm.items[vm.index]['formScriptFileId']
          console.log('formId', formId)
          vm.$store.dispatch('getContentFile', formId)
          vm.$store.dispatch('getContentFileSimple')
          vm.tempCounter = vm.pullCounter
          vm.$socket.onmessage = function (data) {
            let dataObj = eval('( ' + data.data + ' )')
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            console.log('vm.dataSocket', vm.dataSocket)
            vm.$store.commit('setdataSocket', vm.dataSocket)
            if (dataObj['type'] === 'api' && dataObj['status'] === '200') {
              vm.tempCounter = vm.tempCounter - 1
              if (vm.tempCounter < 0) {
                vm.tempCounter = 0
              }
              vm.$store.commit('setpullCounter', vm.tempCounter)
            }
          }
        }, 100)
      })
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
      }
    },
    computed: {
      items () {
        return this.$store.getters.getDeliverableTypes
      },
      pullCounter: {
        // getter
        get: function() {
          return this.$store.getters.pullCounter
        },
        // setter
        set: function(newValue) {
          this.$store.commit('setpullCounter', newValue)
        }
      }
    },
    methods: {
      goBack () {
        window.history.back()
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
          path: '/danh-sach-giay-to/' + vm.index + queryString
        })
      },
      saveToData (cmd) {
        let vm = this
        let bbatFormSimple = vm.$refs.bbatFormSimple
        let bbatForm = vm.$refs.bbatForm
        let submitDataObject = {}
        if (bbatFormSimple !== null && bbatFormSimple !== undefined && bbatFormSimple !== 'undefined') {
          console.log('bbatFormSimple', bbatFormSimple.data)
          submitDataObject = bbatFormSimple.data
        }
        if (bbatForm !== null && bbatForm !== undefined && bbatForm !== 'undefined') {
          console.log('bbatForm', bbatForm.data)
          submitDataObject['formData'] = bbatForm.data
        }
        console.log('submitDataObject', submitDataObject)
        if (cmd === -1) {
        } else {
          vm.$store.dispatch('createDeliverable', submitDataObject)
        }
      }
    }
  }
</script>
