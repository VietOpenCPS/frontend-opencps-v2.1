<template>
    <my-dynamic-view v-if="(layout_view !== null && layout_view !== undefined && layout_view !== 'undefined')"></my-dynamic-view>
</template>

<script>
import Vue from 'vue/dist/vue.min.js'
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {
          dossierId: 0
        }
      }
    },
    layout_view: {
      type: Object
    }
  },
  created () {
    let vm = this
    console.log('vm.layout_view', vm.layout_view)
    if (vm.layout_view !== null && vm.layout_view !== undefined && vm.layout_view !== 'undefined' && vm.layout_view !== '') {
      let layoutObject = eval('( ' + vm.layout_view + ' )')
      console.log('vm.layoutObject', layoutObject)
      Vue.component('my-dynamic-view', {
        template: layoutObject['template'],
        data: eval(' ( ' + layoutObject['data'] + ' ) '),
        created: eval(' ( ' + layoutObject['created'] + ' ) '),
        updated: eval(' ( ' + layoutObject['updated'] + ' ) '),
        methods: layoutObject['methods']
      })
    }
  }
}
</script>
