<template>
  <div>
    <div class="row-header no__hidden_class">
      <div class="background-triangle-big"> <span>{{items[index] !== undefined ? items[index]['typeName'] : ''}}</span> </div>
      <div class="layout row wrap header_tools row-blue">
        <div class="flex pl-3 text-ellipsis text-bold" style="position: relative;">
          
        </div>
        <div class="flex xs4 sm2 text-right" style="margin-left: auto;">
          <v-btn flat class="my-0 mx-0 btn-border-left" @click="goBack" active-class="temp_active">
            Quay lại &nbsp;
            <v-icon size="16">undo</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <bbat-table-editor-component-simple ref="bbatFormSimple" :id="id"></bbat-table-editor-component-simple>
    <bbat-table-editor-component ref="bbatForm" :id="id"></bbat-table-editor-component>
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
        dataSocket: {}
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
          vm.$socket.onmessage = function (data) {
            let dataObj = eval('( ' + data.data + ' )')
            vm.dataSocket[dataObj.respone] = dataObj[dataObj.respone]
            console.log('onmessage dataSocket no home', vm.dataSocket)
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
      }
    },
    methods: {
      goBack () {
        window.history.back()
      }
    }
  }
</script>
